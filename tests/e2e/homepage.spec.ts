import { test, expect } from '@playwright/test';

test.describe('Homepage Tests', () => {
  test('should load homepage without hydration warnings or 404 errors', async ({ page }) => {
    // Collect console messages
    const consoleMessages: string[] = [];
    const networkErrors: string[] = [];
    
    page.on('console', (msg) => {
      const text = msg.text();
      consoleMessages.push(text);
      
      // Check for hydration warnings
      if (text.includes('hydration') || text.includes('mismatch') || text.includes('Hydration')) {
        console.error('❌ Hydration warning detected:', text);
      }
    });

    page.on('response', (response) => {
      if (response.status() === 404) {
        networkErrors.push(`404 Error: ${response.url()}`);
        console.error('❌ 404 Error detected:', response.url());
      }
    });

    // Navigate to homepage
    await page.goto('/');

    // Wait for page to be fully loaded
    await page.waitForLoadState('networkidle');

    // Basic page checks
    await expect(page).toHaveTitle(/Fortune Cookie/);
    await expect(page.locator('h1').first()).toContainText('Fortune Cookie');

    // Check that main interactive elements are present
    await expect(page.locator('main')).toBeVisible();
    await expect(page.locator('nav')).toBeVisible();
    await expect(page.locator('footer')).toBeVisible();

    // Check for fortune cookie component
    const fortuneCookie = page.locator('[data-testid="fortune-cookie"], .fortune-cookie, img[alt*="cookie"]').first();
    if (await fortuneCookie.count() > 0) {
      await expect(fortuneCookie).toBeVisible();
    }

    // Wait a bit more to catch any delayed hydration issues
    await page.waitForTimeout(2000);

    // Assert no hydration warnings
    const hydrationWarnings = consoleMessages.filter(msg => 
      msg.toLowerCase().includes('hydration') || 
      msg.toLowerCase().includes('mismatch') ||
      msg.toLowerCase().includes('server') && msg.toLowerCase().includes('client')
    );
    
    expect(hydrationWarnings, `Found hydration warnings: ${hydrationWarnings.join(', ')}`).toHaveLength(0);

    // Assert no 404 errors for critical resources
    const critical404s = networkErrors.filter(error => 
      error.includes('favicon') || 
      error.includes('icon') || 
      error.includes('.css') || 
      error.includes('.js')
    );
    
    expect(critical404s, `Found critical 404 errors: ${critical404s.join(', ')}`).toHaveLength(0);

    // Check that web vitals are being collected (in development)
    const webVitalLogs = consoleMessages.filter(msg => msg.includes('Web Vital:'));
    expect(webVitalLogs.length, 'Web Vitals should be logged in development').toBeGreaterThan(0);

    console.log('✅ Homepage test passed - no hydration warnings or critical 404s');
  });

  test('should have proper SEO meta tags', async ({ page }) => {
    await page.goto('/');

    // Check meta tags
    await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', /fortune cookie/i);
    await expect(page.locator('meta[property="og:title"]')).toHaveCount(1);
    await expect(page.locator('meta[property="og:description"]')).toHaveCount(1);
    await expect(page.locator('meta[name="viewport"]')).toHaveAttribute('content', /width=device-width/);

    // Check favicon (there might be multiple icon links for different sizes)
    await expect(page.locator('link[rel="icon"]')).toHaveCount(3);
    
    console.log('✅ SEO meta tags test passed');
  });

  test('should be responsive on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Check that main elements are still visible on mobile
    await expect(page.locator('main')).toBeVisible();
    // Navigation is hidden on mobile (hidden md:block), so we don't check it
    
    // Check that text is readable (not too small)
    const mainHeading = page.locator('h1').first();
    await expect(mainHeading).toBeVisible();
    
    console.log('✅ Mobile responsiveness test passed');
  });
});
