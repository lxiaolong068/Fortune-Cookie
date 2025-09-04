const { test, expect } = require('@playwright/test');

test.describe('Analytics Page Testing Suite', () => {
  let page;
  let context;

  test.beforeAll(async ({ browser }) => {
    context = await browser.newContext({
      viewport: { width: 1280, height: 720 },
      // Enable console logging
      recordVideo: { dir: 'test-results/videos' },
    });
    page = await context.newPage();

    // Listen for console messages
    page.on('console', (message) => {
      console.log(`Console ${message.type()}: ${message.text()}`);
    });

    // Listen for network errors
    page.on('response', (response) => {
      if (!response.ok()) {
        console.log(`Network error: ${response.url()} - ${response.status()}`);
      }
    });

    // Listen for page errors
    page.on('pageerror', (error) => {
      console.log(`Page error: ${error.message}`);
    });
  });

  test.afterAll(async () => {
    await context.close();
  });

  test('Analytics Page - Initial Load and Basic Functionality', async () => {
    console.log('🚀 Starting analytics page test...');

    // Navigate to analytics page
    try {
      await page.goto('http://localhost:3000/analytics', {
        waitUntil: 'networkidle',
        timeout: 30000
      });
      console.log('✅ Successfully navigated to analytics page');
    } catch (error) {
      console.log('❌ Failed to navigate to analytics page:', error.message);
      // Take screenshot of any error page
      await page.screenshot({
        path: 'test-results/analytics-navigation-error.png',
        fullPage: true
      });
      throw error;
    }

    // Take initial screenshot
    await page.screenshot({
      path: 'test-results/analytics-initial-load.png',
      fullPage: true
    });
    console.log('📸 Initial screenshot captured');

    // Check page title and URL
    const title = await page.title();
    const currentUrl = page.url();
    console.log(`📄 Page title: ${title}`);
    console.log(`🔗 Current URL: ${currentUrl}`);

    // Check if redirected (authentication required)
    if (currentUrl.includes('/login') || currentUrl.includes('/auth')) {
      console.log('🔐 Analytics page requires authentication');
      await page.screenshot({
        path: 'test-results/analytics-auth-required.png',
        fullPage: true
      });
      return; // Exit test as auth is required
    }

    // Check if page loaded successfully (not 404 or error page)
    const pageContent = await page.textContent('body');
    if (pageContent.includes('404') || pageContent.includes('Page Not Found')) {
      console.log('❌ Analytics page not found (404)');
      await page.screenshot({
        path: 'test-results/analytics-404-error.png',
        fullPage: true
      });
      throw new Error('Analytics page returns 404');
    }

    // Wait for potential loading states to complete
    await page.waitForTimeout(3000);

    // Take screenshot after loading
    await page.screenshot({
      path: 'test-results/analytics-loaded.png',
      fullPage: true
    });
  });

  test('Analytics Dashboard - Data Visualization and Metrics', async () => {
    await page.goto('http://localhost:3000/analytics', { waitUntil: 'networkidle' });

    console.log('🔍 Checking for analytics components...');

    // Look for common analytics elements
    const analyticsElements = {
      charts: 'canvas, svg, .chart, [data-testid*="chart"]',
      metrics: '.metric, .stat, .analytics-metric, [data-testid*="metric"]',
      dashboard: '.dashboard, .analytics-dashboard, [data-testid*="dashboard"]',
      webVitals: '[data-testid*="vitals"], .web-vitals, .core-web-vitals',
      rumData: '[data-testid*="rum"], .rum-data, .real-user-monitoring'
    };

    for (const [elementType, selector] of Object.entries(analyticsElements)) {
      const elements = await page.locator(selector).count();
      console.log(`📊 Found ${elements} ${elementType} elements`);

      if (elements > 0) {
        await page.screenshot({
          path: `test-results/analytics-${elementType}.png`,
          fullPage: true
        });
      }
    }

    // Check for specific Fortune Cookie analytics
    const fortuneAnalytics = [
      'fortune generation',
      'theme popularity',
      'user engagement',
      'performance metrics',
      'web vitals',
      'error tracking'
    ];

    const bodyText = await page.textContent('body');
    const foundAnalytics = [];

    for (const analytic of fortuneAnalytics) {
      if (bodyText.toLowerCase().includes(analytic.toLowerCase())) {
        foundAnalytics.push(analytic);
      }
    }

    console.log('📈 Found analytics categories:', foundAnalytics);
  });

  test('Interactive Elements and User Interface', async () => {
    await page.goto('http://localhost:3000/analytics', { waitUntil: 'networkidle' });

    console.log('🖱️ Testing interactive elements...');

    // Look for interactive elements
    const interactiveSelectors = [
      'button',
      'select',
      'input[type="date"]',
      '.filter',
      '.dropdown',
      '[role="button"]',
      '[data-testid*="filter"]',
      '[data-testid*="export"]'
    ];

    for (const selector of interactiveSelectors) {
      const elements = await page.locator(selector).count();
      if (elements > 0) {
        console.log(`🎛️ Found ${elements} interactive elements: ${selector}`);

        // Try to interact with first element
        try {
          const firstElement = page.locator(selector).first();
          await firstElement.scrollIntoViewIfNeeded();
          await firstElement.hover();

          // Take screenshot of interaction
          await page.screenshot({
            path: `test-results/analytics-interaction-${selector.replace(/[^a-zA-Z0-9]/g, '')}.png`,
            fullPage: true
          });
        } catch (error) {
          console.log(`⚠️ Could not interact with ${selector}:`, error.message);
        }
      }
    }
  });

  test('Accessibility Testing', async () => {
    await page.goto('http://localhost:3000/analytics', { waitUntil: 'networkidle' });

    console.log('♿ Testing accessibility...');

    // Check for accessibility landmarks
    const accessibilityElements = {
      headings: 'h1, h2, h3, h4, h5, h6',
      nav: 'nav, [role="navigation"]',
      main: 'main, [role="main"]',
      buttons: 'button, [role="button"]',
      labels: 'label',
      altText: 'img[alt]'
    };

    const accessibilityReport = {};

    for (const [elementType, selector] of Object.entries(accessibilityElements)) {
      const count = await page.locator(selector).count();
      accessibilityReport[elementType] = count;
      console.log(`♿ ${elementType}: ${count} elements`);
    }

    // Check heading hierarchy
    const headings = await page.locator('h1, h2, h3, h4, h5, h6').allTextContents();
    console.log('📋 Page headings:', headings);

    // Check for skip links
    const skipLinks = await page.locator('a[href^="#"]').count();
    console.log(`🔗 Skip links found: ${skipLinks}`);

    // Test keyboard navigation
    console.log('⌨️ Testing keyboard navigation...');
    await page.keyboard.press('Tab');
    await page.waitForTimeout(500);
    await page.screenshot({
      path: 'test-results/analytics-keyboard-focus.png',
      fullPage: true
    });
  });

  test('Responsive Design Testing', async () => {
    console.log('📱 Testing responsive design...');

    const viewports = [
      { name: 'mobile', width: 375, height: 667 },
      { name: 'tablet', width: 768, height: 1024 },
      { name: 'desktop', width: 1280, height: 720 },
      { name: 'large-desktop', width: 1920, height: 1080 }
    ];

    for (const viewport of viewports) {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.goto('http://localhost:3000/analytics', { waitUntil: 'networkidle' });

      console.log(`📐 Testing ${viewport.name} (${viewport.width}x${viewport.height})`);

      await page.waitForTimeout(2000); // Allow layout to settle
      await page.screenshot({
        path: `test-results/analytics-responsive-${viewport.name}.png`,
        fullPage: true
      });

      // Check for mobile menu or responsive elements
      if (viewport.width <= 768) {
        const mobileMenu = await page.locator('.mobile-menu, [data-testid*="mobile"], .hamburger').count();
        console.log(`📱 Mobile menu elements: ${mobileMenu}`);
      }
    }
  });

  test('Performance and Error Analysis', async () => {
    await page.goto('http://localhost:3000/analytics', { waitUntil: 'networkidle' });

    console.log('⚡ Analyzing performance and errors...');

    // Collect performance metrics
    const performanceMetrics = await page.evaluate(() => {
      const perfData = performance.getEntriesByType('navigation')[0];
      return {
        loadTime: perfData.loadEventEnd - perfData.loadEventStart,
        domContentLoaded: perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart,
        firstPaint: performance.getEntriesByName('first-paint')[0]?.startTime || 0,
        firstContentfulPaint: performance.getEntriesByName('first-contentful-paint')[0]?.startTime || 0
      };
    });

    console.log('📊 Performance metrics:', performanceMetrics);

    // Check for JavaScript errors in console
    const jsErrors = [];
    page.on('pageerror', (error) => {
      jsErrors.push(error.message);
    });

    // Wait and collect errors
    await page.waitForTimeout(5000);

    if (jsErrors.length > 0) {
      console.log('❌ JavaScript errors found:', jsErrors);
    } else {
      console.log('✅ No JavaScript errors detected');
    }

    // Check network requests
    const failedRequests = [];
    page.on('response', (response) => {
      if (!response.ok() && !response.url().includes('favicon')) {
        failedRequests.push(`${response.url()} - ${response.status()}`);
      }
    });

    await page.reload({ waitUntil: 'networkidle' });

    if (failedRequests.length > 0) {
      console.log('🌐 Failed network requests:', failedRequests);
    } else {
      console.log('✅ All network requests successful');
    }
  });

  test('Web Vitals and RUM Data Verification', async () => {
    await page.goto('http://localhost:3000/analytics', { waitUntil: 'networkidle' });

    console.log('📈 Checking Web Vitals and RUM data...');

    // Look for Web Vitals related content
    const webVitalsKeywords = [
      'LCP', 'Largest Contentful Paint',
      'FID', 'First Input Delay', 'INP', 'Interaction to Next Paint',
      'CLS', 'Cumulative Layout Shift',
      'Core Web Vitals',
      'Real User Monitoring',
      'RUM',
      'Performance'
    ];

    const pageContent = await page.textContent('body');
    const foundVitals = [];

    for (const keyword of webVitalsKeywords) {
      if (pageContent.includes(keyword)) {
        foundVitals.push(keyword);
      }
    }

    console.log('📊 Found Web Vitals keywords:', foundVitals);

    // Look for data visualization
    const chartElements = await page.locator('canvas, svg, .chart').count();
    console.log(`📈 Chart elements found: ${chartElements}`);

    // Check for data tables
    const dataElements = await page.locator('table, .data-table, .metrics-table').count();
    console.log(`📋 Data table elements found: ${dataElements}`);

    // Take final comprehensive screenshot
    await page.screenshot({
      path: 'test-results/analytics-final-state.png',
      fullPage: true
    });
  });
});
