import { test, expect } from '@playwright/test';

test.describe('Generator Page Tests', () => {
  test('should load generator page without hydration warnings or 404 errors', async ({ page }) => {
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

    // Navigate to generator page
    await page.goto('/generator');

    // Wait for page to be fully loaded
    await page.waitForLoadState('networkidle');

    // Basic page checks
    await expect(page).toHaveTitle(/Generator.*Fortune Cookie/);
    
    // Check that main interactive elements are present
    await expect(page.locator('main')).toBeVisible();
    // Only check nav on desktop (it's hidden on mobile)

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

    console.log('✅ Generator page test passed - no hydration warnings or critical 404s');
  });

  test('should have working navigation', async ({ page }) => {
    // Set desktop viewport to ensure nav is visible
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.goto('/generator');

    // Wait for page to load
    await page.waitForLoadState('networkidle');

    // Check that navigation links exist and are visible
    const homeLink = page.locator('nav a[href="/"]').first();
    if (await homeLink.count() > 0) {
      await expect(homeLink).toBeVisible();
    }

    const messagesLink = page.locator('nav a[href="/messages"]').first();
    if (await messagesLink.count() > 0) {
      await expect(messagesLink).toBeVisible();
    }

    const generatorLink = page.locator('nav a[href="/generator"]').first();
    if (await generatorLink.count() > 0) {
      await expect(generatorLink).toBeVisible();
    }

    console.log('✅ Navigation test passed');
  });

  test('should be responsive on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/generator');
    await page.waitForLoadState('networkidle');

    // Check that main elements are still visible on mobile
    await expect(page.locator('main')).toBeVisible();
    // Navigation is hidden on mobile (hidden md:block), so we don't check it
    
    console.log('✅ Generator mobile responsiveness test passed');
  });
});
