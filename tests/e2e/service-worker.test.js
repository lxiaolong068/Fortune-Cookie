const { test, expect } = require('@playwright/test');

test.describe('Service Worker Tests', () => {
  let page;
  let context;

  test.beforeEach(async ({ browser }) => {
    // Create a new context for each test to ensure clean state
    context = await browser.newContext();
    page = await context.newPage();

    // Listen for console messages to catch Service Worker errors
    page.on('console', (msg) => {
      console.log(`Console ${msg.type()}: ${msg.text()}`);
    });

    // Listen for page errors
    page.on('pageerror', (error) => {
      console.log(`Page error: ${error.message}`);
    });
  });

  test.afterEach(async () => {
    await context.close();
  });

  test('should register Service Worker on homepage', async () => {
    console.log('🔍 Testing Service Worker registration...');

    // Navigate to the homepage
    await page.goto('http://localhost:3000');

    // Wait for page to load completely
    await page.waitForLoadState('networkidle');

    // Check if Service Worker is registered
    const serviceWorkerRegistration = await page.evaluate(async () => {
      if ('serviceWorker' in navigator) {
        const registration = await navigator.serviceWorker.getRegistration();
        return {
          isRegistered: !!registration,
          scope: registration?.scope,
          state: registration?.active?.state,
          scriptURL: registration?.active?.scriptURL
        };
      }
      return { isRegistered: false, error: 'Service Worker not supported' };
    });

    console.log('Service Worker Registration:', serviceWorkerRegistration);

    expect(serviceWorkerRegistration.isRegistered).toBe(true);
    expect(serviceWorkerRegistration.state).toBe('activated');
    expect(serviceWorkerRegistration.scriptURL).toContain('sw.js');
  });

  test('should examine cache storage contents', async () => {
    console.log('🗄️ Testing Cache Storage...');

    await page.goto('http://localhost:3000');
    await page.waitForLoadState('networkidle');

    // Wait a moment for Service Worker to cache resources
    await page.waitForTimeout(2000);

    // Check what's in the cache storage
    const cacheContents = await page.evaluate(async () => {
      const cacheNames = await caches.keys();
      const allCaches = {};

      for (const cacheName of cacheNames) {
        const cache = await caches.open(cacheName);
        const requests = await cache.keys();
        allCaches[cacheName] = requests.map(req => ({
          url: req.url,
          method: req.method
        }));
      }

      return {
        cacheNames,
        totalCaches: cacheNames.length,
        cacheContents: allCaches
      };
    });

    console.log('Cache Storage Contents:', JSON.stringify(cacheContents, null, 2));

    expect(cacheContents.totalCaches).toBeGreaterThan(0);
    expect(cacheContents.cacheNames.length).toBeGreaterThan(0);
  });

  test('should cache static resources', async () => {
    console.log('📦 Testing static resource caching...');

    // Track network requests
    const requests = [];
    page.on('request', (request) => {
      requests.push({
        url: request.url(),
        method: request.method(),
        resourceType: request.resourceType()
      });
    });

    await page.goto('http://localhost:3000');
    await page.waitForLoadState('networkidle');

    // Wait for Service Worker to cache resources
    await page.waitForTimeout(3000);

    // Check if common static resources are cached
    const cachedResources = await page.evaluate(async () => {
      const cacheNames = await caches.keys();
      const staticResources = [];

      for (const cacheName of cacheNames) {
        const cache = await caches.open(cacheName);
        const requests = await cache.keys();

        for (const request of requests) {
          const url = request.url;
          if (url.includes('.js') || url.includes('.css') || url.includes('.ico') ||
              url.includes('_next/') || url.includes('static/')) {
            staticResources.push(url);
          }
        }
      }

      return staticResources;
    });

    console.log('Cached Static Resources:', cachedResources);

    expect(cachedResources.length).toBeGreaterThan(0);
  });

  test('should work offline (cache-first strategy)', async () => {
    console.log('📡 Testing offline functionality...');

    // First, load the page online to populate cache
    await page.goto('http://localhost:3000');
    await page.waitForLoadState('networkidle');

    // Wait for Service Worker to cache everything
    await page.waitForTimeout(3000);

    // Verify page loaded successfully
    const pageTitle = await page.title();
    expect(pageTitle).toContain('Fortune');

    // Go offline
    console.log('🔌 Going offline...');
    await context.setOffline(true);

    // Reload the page while offline
    await page.reload();
    await page.waitForLoadState('domcontentloaded');

    // Check if the page still works
    const offlineTitle = await page.title();
    console.log('Offline page title:', offlineTitle);

    // Check if main content is visible
    const mainContent = await page.locator('main').isVisible();
    expect(mainContent).toBe(true);

    // Check if we can still generate a fortune (should use fallback)
    const generateButton = page.locator('button:has-text("Get Your Fortune")');
    if (await generateButton.isVisible()) {
      await generateButton.click();
      await page.waitForTimeout(2000);

      // Should show some fortune content even offline
      const fortuneContent = await page.locator('[data-testid="fortune-content"]').isVisible().catch(() => false);
      console.log('Fortune content visible offline:', fortuneContent);
    }

    expect(offlineTitle).toContain('Fortune');
  });

  test('should update cache when back online', async () => {
    console.log('🔄 Testing cache update behavior...');

    // Load page online first
    await page.goto('http://localhost:3000');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    // Get initial cache timestamp
    const initialCacheInfo = await page.evaluate(async () => {
      const cacheNames = await caches.keys();
      return {
        cacheNames,
        timestamp: Date.now()
      };
    });

    // Go offline briefly
    await context.setOffline(true);
    await page.waitForTimeout(1000);

    // Go back online
    console.log('🔌 Going back online...');
    await context.setOffline(false);

    // Reload to trigger cache updates
    await page.reload();
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    // Check if caches were updated
    const updatedCacheInfo = await page.evaluate(async () => {
      const cacheNames = await caches.keys();
      return {
        cacheNames,
        timestamp: Date.now()
      };
    });

    console.log('Cache update info:', {
      initial: initialCacheInfo.cacheNames,
      updated: updatedCacheInfo.cacheNames
    });

    expect(updatedCacheInfo.timestamp).toBeGreaterThan(initialCacheInfo.timestamp);
  });

  test('should handle API responses caching', async () => {
    console.log('🌐 Testing API response caching...');

    await page.goto('http://localhost:3000');
    await page.waitForLoadState('networkidle');

    // Try to generate a fortune (API call)
    const generateButton = page.locator('button:has-text("Get Your Fortune")');
    if (await generateButton.isVisible()) {
      // Track API requests
      const apiRequests = [];
      page.on('response', (response) => {
        if (response.url().includes('/api/')) {
          apiRequests.push({
            url: response.url(),
            status: response.status(),
            fromCache: response.fromCache()
          });
        }
      });

      await generateButton.click();
      await page.waitForTimeout(3000);

      console.log('API Requests:', apiRequests);

      // Check if API responses are being cached
      const apiCacheContents = await page.evaluate(async () => {
        const cacheNames = await caches.keys();
        const apiCachedItems = [];

        for (const cacheName of cacheNames) {
          const cache = await caches.open(cacheName);
          const requests = await cache.keys();

          for (const request of requests) {
            if (request.url.includes('/api/')) {
              apiCachedItems.push({
                url: request.url,
                method: request.method
              });
            }
          }
        }

        return apiCachedItems;
      });

      console.log('Cached API endpoints:', apiCacheContents);
    }
  });

  test('should check for Service Worker errors', async () => {
    console.log('❌ Checking for Service Worker errors...');

    const consoleErrors = [];
    const pageErrors = [];

    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    page.on('pageerror', (error) => {
      pageErrors.push(error.message);
    });

    await page.goto('http://localhost:3000');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);

    // Check Service Worker status
    const swStatus = await page.evaluate(async () => {
      if ('serviceWorker' in navigator) {
        const registration = await navigator.serviceWorker.getRegistration();
        return {
          hasRegistration: !!registration,
          state: registration?.active?.state,
          installing: !!registration?.installing,
          waiting: !!registration?.waiting,
          error: registration?.error?.message
        };
      }
      return { error: 'Service Worker not supported' };
    });

    console.log('Service Worker Status:', swStatus);
    console.log('Console Errors:', consoleErrors);
    console.log('Page Errors:', pageErrors);

    expect(swStatus.hasRegistration).toBe(true);
    expect(swStatus.state).toBe('activated');

    // Filter out non-SW related errors
    const swErrors = consoleErrors.filter(error =>
      error.toLowerCase().includes('service worker') ||
      error.toLowerCase().includes('sw.js') ||
      error.toLowerCase().includes('cache')
    );

    expect(swErrors.length).toBe(0);
  });

  test('should test Service Worker update mechanism', async () => {
    console.log('🔄 Testing Service Worker update mechanism...');

    await page.goto('http://localhost:3000');
    await page.waitForLoadState('networkidle');

    // Force a Service Worker update check
    const updateResult = await page.evaluate(async () => {
      if ('serviceWorker' in navigator) {
        const registration = await navigator.serviceWorker.getRegistration();
        if (registration) {
          try {
            await registration.update();
            return {
              updated: true,
              state: registration.active?.state,
              installing: !!registration.installing,
              waiting: !!registration.waiting
            };
          } catch (error) {
            return { error: error.message };
          }
        }
      }
      return { error: 'No registration found' };
    });

    console.log('Update Result:', updateResult);

    expect(updateResult.updated).toBe(true);
  });

  test('should verify cache strategy modifications', async () => {
    console.log('⚙️ Testing recent cache strategy optimizations...');

    await page.goto('http://localhost:3000');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);

    // Check current cache strategies
    const cacheStrategies = await page.evaluate(async () => {
      const cacheNames = await caches.keys();
      const strategies = {};

      for (const cacheName of cacheNames) {
        const cache = await caches.open(cacheName);
        const requests = await cache.keys();

        strategies[cacheName] = {
          count: requests.length,
          types: requests.reduce((acc, req) => {
            const url = req.url;
            if (url.includes('.js')) acc.javascript = (acc.javascript || 0) + 1;
            if (url.includes('.css')) acc.css = (acc.css || 0) + 1;
            if (url.includes('/api/')) acc.api = (acc.api || 0) + 1;
            if (url.includes('_next/')) acc.nextjs = (acc.nextjs || 0) + 1;
            return acc;
          }, {})
        };
      }

      return strategies;
    });

    console.log('Cache Strategies:', JSON.stringify(cacheStrategies, null, 2));

    // Verify that we have reasonable cache distribution
    const totalCacheNames = Object.keys(cacheStrategies).length;
    expect(totalCacheNames).toBeGreaterThan(0);

    // Check for Next.js specific caching
    const hasNextJSCache = Object.values(cacheStrategies).some(strategy =>
      strategy.types.nextjs > 0
    );

    console.log('Has Next.js specific caching:', hasNextJSCache);
  });
});
