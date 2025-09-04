const { test, expect } = require('@playwright/test');

test.describe('Service Worker Basic Tests', () => {
  test.setTimeout(60000); // 1 minute timeout

  test('Service Worker Registration and Basic Functionality', async ({ page }) => {
    console.log('🔍 Testing Service Worker registration...');

    // Collect console messages
    const consoleMessages = [];
    page.on('console', msg => {
      consoleMessages.push(`${msg.type()}: ${msg.text()}`);
    });

    // Navigate to the homepage
    await page.goto('http://localhost:3000');
    await page.waitForLoadState('networkidle');

    // Check if Service Worker is registered
    const swRegistration = await page.evaluate(async () => {
      if ('serviceWorker' in navigator) {
        try {
          const registration = await navigator.serviceWorker.getRegistration();
          return {
            isRegistered: !!registration,
            scope: registration?.scope,
            state: registration?.active?.state,
            scriptURL: registration?.active?.scriptURL,
            updateAvailable: !!registration?.waiting
          };
        } catch (error) {
          return { error: error.message };
        }
      }
      return { error: 'Service Worker not supported' };
    });

    console.log('Service Worker Registration Status:', JSON.stringify(swRegistration, null, 2));

    expect(swRegistration.isRegistered).toBe(true);
    expect(swRegistration.scriptURL).toContain('sw.js');

    // Wait a bit for SW to settle
    await page.waitForTimeout(3000);

    // Check cache storage
    const cacheStatus = await page.evaluate(async () => {
      try {
        const cacheNames = await caches.keys();
        const cacheInfo = {};

        for (const cacheName of cacheNames) {
          const cache = await caches.open(cacheName);
          const keys = await cache.keys();
          cacheInfo[cacheName] = {
            count: keys.length,
            urls: keys.slice(0, 5).map(req => req.url) // First 5 URLs
          };
        }

        return {
          totalCaches: cacheNames.length,
          caches: cacheInfo
        };
      } catch (error) {
        return { error: error.message };
      }
    });

    console.log('Cache Status:', JSON.stringify(cacheStatus, null, 2));

    expect(cacheStatus.totalCaches).toBeGreaterThan(0);

    // Filter relevant console messages
    const swMessages = consoleMessages.filter(msg =>
      msg.includes('Service Worker') ||
      msg.includes('sw.js') ||
      msg.includes('cache')
    );

    console.log('Service Worker Console Messages:', swMessages);

    return {
      registration: swRegistration,
      caches: cacheStatus,
      consoleMessages: swMessages
    };
  });

  test('Offline Functionality Test', async ({ context, page }) => {
    console.log('📡 Testing offline functionality...');

    // Load page online first
    await page.goto('http://localhost:3000');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000); // Let SW cache things

    const onlineTitle = await page.title();
    console.log('Online page title:', onlineTitle);

    // Go offline
    await context.setOffline(true);
    console.log('🔌 Now offline...');

    // Reload page while offline
    await page.reload();
    await page.waitForLoadState('domcontentloaded');

    const offlineTitle = await page.title();
    console.log('Offline page title:', offlineTitle);

    // Check if main content is still visible
    const pageContent = await page.evaluate(() => {
      return {
        hasMainContent: !!document.querySelector('main'),
        hasTitle: !!document.querySelector('h1'),
        bodyText: document.body.innerText.substring(0, 200)
      };
    });

    console.log('Offline page content:', pageContent);

    // Go back online
    await context.setOffline(false);
    console.log('🔌 Back online...');

    expect(pageContent.hasMainContent || offlineTitle.includes('Offline')).toBe(true);
  });

  test('Performance and Error Analysis', async ({ page }) => {
    console.log('⚡ Analyzing performance issues...');

    const performanceIssues = [];
    const errors = [];

    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
      if (msg.text().includes('Long task detected')) {
        performanceIssues.push(msg.text());
      }
    });

    await page.goto('http://localhost:3000');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(5000); // Wait to collect performance data

    console.log('Performance Issues Found:', performanceIssues.length);
    console.log('Errors Found:', errors.length);

    if (performanceIssues.length > 0) {
      console.log('Sample Performance Issues:', performanceIssues.slice(0, 3));
    }

    if (errors.length > 0) {
      console.log('Sample Errors:', errors.slice(0, 3));
    }

    // Check Web Vitals
    const vitals = await page.evaluate(() => {
      return window.vitalsData || 'No vitals data available';
    });

    console.log('Web Vitals:', vitals);

    return {
      performanceIssueCount: performanceIssues.length,
      errorCount: errors.length,
      vitals
    };
  });
});
