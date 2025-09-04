import { test, expect, Page, Response } from '@playwright/test';

test.describe('LOW PRIORITY Optimizations Testing', () => {
  test.beforeEach(async ({ page }) => {
    // Wait for dev server to be ready
    await page.goto('http://localhost:3000');
    await page.waitForLoadState('networkidle');
  });

  test('1. Server-Timing Headers - HTTP Response Headers', async ({ page }) => {
    let serverTimingFound = false;
    let responseHeaders: { [key: string]: string } = {};

    // Listen for all responses
    page.on('response', async (response: Response) => {
      if (response.url().includes('localhost:3000')) {
        const headers = response.headers();
        responseHeaders = { ...responseHeaders, ...headers };

        if (headers['server-timing']) {
          serverTimingFound = true;
          console.log('Server-Timing header found:', headers['server-timing']);
        }
      }
    });

    // Navigate and trigger various requests
    await page.goto('http://localhost:3000');
    await page.waitForLoadState('networkidle');

    // Test API routes
    const apiResponse = await page.request.get('http://localhost:3000/api/fortune');
    const apiHeaders = apiResponse.headers();

    console.log('Main page headers:', Object.keys(responseHeaders).filter(k => k.toLowerCase().includes('timing')));
    console.log('API headers:', Object.keys(apiHeaders).filter(k => k.toLowerCase().includes('timing')));

    // Check for Server-Timing headers
    console.log('Server-Timing headers found:', serverTimingFound);
    console.log('All response headers sample:', Object.keys(responseHeaders).slice(0, 10));
  });

  test('2. RUM Sampling - Performance Data Collection', async ({ page }) => {
    // Monitor console for RUM/performance logs
    const consoleMessages: string[] = [];
    const performanceLogs: string[] = [];

    page.on('console', msg => {
      const text = msg.text();
      consoleMessages.push(text);

      if (text.includes('performance') || text.includes('RUM') || text.includes('sampling') || text.includes('vitals')) {
        performanceLogs.push(text);
        console.log('Performance log:', text);
      }
    });

    await page.goto('http://localhost:3000');
    await page.waitForLoadState('networkidle');

    // Trigger user interactions to generate RUM data
    await page.click('button[aria-label*="Generate"], .fortune-button, [data-testid*="generate"]').catch(() => {
      console.log('Generate button not found, trying alternative selectors');
    });

    await page.waitForTimeout(2000);

    // Check if Web Vitals are being collected
    const webVitals = await page.evaluate(() => {
      return new Promise((resolve) => {
        // Check for Web Vitals library
        if (typeof window.webVitals !== 'undefined') {
          resolve('Web Vitals library found');
        } else if (typeof (window as any).getCLS !== 'undefined' ||
                   typeof (window as any).getFID !== 'undefined' ||
                   typeof (window as any).getLCP !== 'undefined') {
          resolve('Web Vitals functions found');
        } else {
          resolve('No Web Vitals detected');
        }
      });
    });

    console.log('Web Vitals status:', webVitals);
    console.log('Performance logs count:', performanceLogs.length);
    console.log('Sample console messages:', consoleMessages.slice(0, 5));
  });

  test('3. Service Worker Cache Strategy', async ({ page }) => {
    let serviceWorkerRegistered = false;
    let serviceWorkerUrl = '';

    // Check for service worker registration
    const swRegistration = await page.evaluate(() => {
      return navigator.serviceWorker.getRegistrations().then(registrations => {
        return registrations.map(reg => ({
          scope: reg.scope,
          scriptURL: reg.active?.scriptURL || 'No active worker'
        }));
      });
    });

    console.log('Service Worker registrations:', swRegistration);

    // Check if service worker file exists
    try {
      const swResponse = await page.request.get('http://localhost:3000/sw.js');
      console.log('Service worker file status:', swResponse.status());

      if (swResponse.status() === 200) {
        const swContent = await swResponse.text();
        console.log('Service worker content length:', swContent.length);
        console.log('Cache strategy patterns found:', swContent.includes('cache') ? 'Yes' : 'No');
      }
    } catch (error) {
      console.log('Service worker file not found or error:', (error as Error).message);
    }

    // Check cache API usage
    const cacheInfo = await page.evaluate(async () => {
      try {
        const cacheNames = await caches.keys();
        return {
          available: true,
          cacheNames: cacheNames,
          count: cacheNames.length
        };
      } catch (error) {
        return {
          available: false,
          error: (error as Error).message
        };
      }
    });

    console.log('Cache API info:', cacheInfo);
  });

  test('4. Middleware Updates - Routing and Analytics', async ({ page }) => {
    const networkRequests: string[] = [];
    const middlewareLogs: string[] = [];

    // Monitor network requests
    page.on('request', request => {
      networkRequests.push(request.url());
    });

    page.on('console', msg => {
      const text = msg.text();
      if (text.includes('middleware') || text.includes('analytics') || text.includes('routing')) {
        middlewareLogs.push(text);
        console.log('Middleware log:', text);
      }
    });

    await page.goto('http://localhost:3000');
    await page.waitForLoadState('networkidle');

    // Navigate to different routes to test middleware
    const routes = ['/about', '/api/fortune', '/api/analytics'];

    for (const route of routes) {
      try {
        if (route.startsWith('/api/')) {
          const response = await page.request.get(`http://localhost:3000${route}`);
          console.log(`${route} status:`, response.status());
          const headers = response.headers();
          console.log(`${route} headers:`, Object.keys(headers).filter(h =>
            h.includes('timing') || h.includes('analytics') || h.includes('performance')
          ));
        } else {
          await page.goto(`http://localhost:3000${route}`);
          await page.waitForLoadState('networkidle');
        }
      } catch (error) {
        console.log(`Error testing route ${route}:`, (error as Error).message);
      }
    }

    console.log('Network requests count:', networkRequests.length);
    console.log('Middleware logs:', middlewareLogs);

    // Check for analytics requests
    const analyticsRequests = networkRequests.filter(url =>
      url.includes('analytics') || url.includes('google') || url.includes('gtag')
    );
    console.log('Analytics requests:', analyticsRequests);
  });

  test('5. Sitemap Accessibility', async ({ page }) => {
    // Test sitemap.xml accessibility
    const sitemapResponse = await page.request.get('http://localhost:3000/sitemap.xml');

    console.log('Sitemap status:', sitemapResponse.status());
    console.log('Sitemap content-type:', sitemapResponse.headers()['content-type']);

    if (sitemapResponse.status() === 200) {
      const sitemapContent = await sitemapResponse.text();
      console.log('Sitemap content length:', sitemapContent.length);

      // Basic XML validation
      const hasXmlDeclaration = sitemapContent.includes('<?xml');
      const hasUrlset = sitemapContent.includes('<urlset');
      const hasUrls = sitemapContent.includes('<url>');

      console.log('XML structure check:', {
        hasXmlDeclaration,
        hasUrlset,
        hasUrls,
        urlCount: (sitemapContent.match(/<url>/g) || []).length
      });
    }

    // Also check robots.txt
    try {
      const robotsResponse = await page.request.get('http://localhost:3000/robots.txt');
      console.log('Robots.txt status:', robotsResponse.status());

      if (robotsResponse.status() === 200) {
        const robotsContent = await robotsResponse.text();
        console.log('Robots.txt mentions sitemap:', robotsContent.includes('sitemap'));
      }
    } catch (error) {
      console.log('Robots.txt error:', (error as Error).message);
    }
  });

  test('6. Analytics Enhancements', async ({ page }) => {
    const analyticsEvents: any[] = [];
    const gtmEvents: any[] = [];

    // Monitor analytics events
    await page.addInitScript(() => {
      // Mock gtag to capture events
      (window as any).gtag = (...args: any[]) => {
        (window as any).gtagEvents = (window as any).gtagEvents || [];
        (window as any).gtagEvents.push(args);
        console.log('GTAG Event:', args);
      };

      // Mock dataLayer
      (window as any).dataLayer = (window as any).dataLayer || [];
      const originalPush = (window as any).dataLayer.push;
      (window as any).dataLayer.push = (...args: any[]) => {
        console.log('DataLayer Event:', args);
        (window as any).dataLayerEvents = (window as any).dataLayerEvents || [];
        (window as any).dataLayerEvents.push(args);
        return originalPush.apply((window as any).dataLayer, args);
      };
    });

    await page.goto('http://localhost:3000');
    await page.waitForLoadState('networkidle');

    // Trigger various user interactions
    try {
      // Try to find and click fortune generation button
      await page.click('button').catch(() => console.log('No clickable buttons found'));
      await page.waitForTimeout(1000);
    } catch (error) {
      console.log('Interaction error:', (error as Error).message);
    }

    // Check captured analytics events
    const capturedEvents = await page.evaluate(() => {
      return {
        gtagEvents: (window as any).gtagEvents || [],
        dataLayerEvents: (window as any).dataLayerEvents || [],
        hasGoogleAnalytics: typeof (window as any).gtag !== 'undefined',
        hasDataLayer: Array.isArray((window as any).dataLayer)
      };
    });

    console.log('Analytics events captured:', capturedEvents);

    // Check for Google Analytics script
    const gaScripts = await page.locator('script[src*="googletagmanager"], script[src*="google-analytics"], script[src*="gtag"]').count();
    console.log('Google Analytics scripts found:', gaScripts);
  });

  test('7. Performance Metrics and Error Detection', async ({ page }) => {
    const errors: string[] = [];
    const warnings: string[] = [];
    const performanceMetrics: any[] = [];

    // Capture console errors and warnings
    page.on('console', msg => {
      const text = msg.text();
      const type = msg.type();

      if (type === 'error') {
        errors.push(text);
        console.log('ERROR:', text);
      } else if (type === 'warning') {
        warnings.push(text);
        console.log('WARNING:', text);
      }
    });

    // Capture page errors
    page.on('pageerror', error => {
      errors.push(error.message);
      console.log('PAGE ERROR:', error.message);
    });

    await page.goto('http://localhost:3000');
    await page.waitForLoadState('networkidle');

    // Get performance metrics
    const metrics = await page.evaluate(() => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      return {
        loadTime: navigation.loadEventEnd - navigation.loadEventStart,
        domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
        firstPaint: performance.getEntriesByName('first-paint')[0]?.startTime || 'Not available',
        firstContentfulPaint: performance.getEntriesByName('first-contentful-paint')[0]?.startTime || 'Not available',
        resourceCount: performance.getEntriesByType('resource').length,
        navigationTiming: {
          dns: navigation.domainLookupEnd - navigation.domainLookupStart,
          tcp: navigation.connectEnd - navigation.connectStart,
          request: navigation.responseStart - navigation.requestStart,
          response: navigation.responseEnd - navigation.responseStart
        }
      };
    });

    console.log('Performance metrics:', metrics);
    console.log('Total errors found:', errors.length);
    console.log('Total warnings found:', warnings.length);

    if (errors.length > 0) {
      console.log('First few errors:', errors.slice(0, 3));
    }

    if (warnings.length > 0) {
      console.log('First few warnings:', warnings.slice(0, 3));
    }
  });
});
