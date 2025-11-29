import { test, expect } from "@playwright/test";

test.describe("Analytics Page Comprehensive Testing", () => {
  test.beforeEach(async ({ page }) => {
    // Listen for console messages
    page.on("console", (message) => {
      console.log(`Console ${message.type()}: ${message.text()}`);
    });

    // Listen for network errors
    page.on("response", (response) => {
      if (!response.ok() && !response.url().includes("favicon")) {
        console.log(`Network error: ${response.url()} - ${response.status()}`);
      }
    });

    // Listen for page errors
    page.on("pageerror", (error) => {
      console.log(`Page error: ${error.message}`);
    });
  });

  test("Analytics Page - Navigation and Initial Load", async ({ page }) => {
    console.log("🚀 Starting analytics page test...");

    // Navigate to analytics page
    try {
      await page.goto("/analytics", {
        waitUntil: "networkidle",
        timeout: 30000,
      });
      console.log("✅ Successfully navigated to analytics page");
    } catch (error) {
      console.log("❌ Failed to navigate to analytics page:", error);
      // Take screenshot of any error page
      await page.screenshot({
        path: "test-results/analytics-navigation-error.png",
        fullPage: true,
      });
      throw error;
    }

    // Take initial screenshot
    await page.screenshot({
      path: "test-results/analytics-initial-load.png",
      fullPage: true,
    });

    // Check page title and URL
    const title = await page.title();
    const currentUrl = page.url();
    console.log(`📄 Page title: ${title}`);
    console.log(`🔗 Current URL: ${currentUrl}`);

    // Check if redirected (authentication required)
    if (
      currentUrl.includes("/login") ||
      currentUrl.includes("/auth") ||
      currentUrl.includes("/404")
    ) {
      console.log("🔐 Analytics page requires authentication or is not found");
      await page.screenshot({
        path: "test-results/analytics-auth-or-404.png",
        fullPage: true,
      });

      // Continue testing whatever page we land on
      const pageContent = await page.textContent("body");
      console.log(
        "📄 Page content preview:",
        (pageContent ?? "").slice(0, 200) + "...",
      );
      return;
    }

    // Check if page loaded successfully (not 404 or error page)
    const bodyContent = await page.textContent("body");
    if (
      bodyContent?.includes("404") ||
      bodyContent?.includes("Page Not Found")
    ) {
      console.log("❌ Analytics page not found (404)");
      await page.screenshot({
        path: "test-results/analytics-404-error.png",
        fullPage: true,
      });
    } else {
      console.log("✅ Analytics page loaded successfully");
    }

    // Wait for content to load
    await page.waitForTimeout(3000);

    // Take screenshot after loading
    await page.screenshot({
      path: "test-results/analytics-loaded.png",
      fullPage: true,
    });
  });

  test("Analytics Dashboard - Data Elements and Visualization", async ({
    page,
  }) => {
    await page.goto("/analytics", { waitUntil: "networkidle" });

    console.log("🔍 Checking for analytics components...");

    // Look for common analytics elements
    const analyticsSelectors = [
      "canvas", // Chart.js, D3.js charts
      "svg", // SVG charts
      ".chart", // Chart containers
      ".metric", // Metric displays
      ".analytics", // Analytics sections
      ".dashboard", // Dashboard components
      '[data-testid*="chart"]', // Chart test IDs
      '[data-testid*="metric"]', // Metric test IDs
      '[data-testid*="analytics"]', // Analytics test IDs
      "table", // Data tables
      ".data-table", // Data table classes
      ".web-vitals", // Web Vitals specific
      ".core-web-vitals", // Core Web Vitals
      '[data-testid*="vitals"]', // Web Vitals test IDs
    ];

    let foundElements = 0;
    for (const selector of analyticsSelectors) {
      const elements = await page.locator(selector).count();
      if (elements > 0) {
        console.log(`📊 Found ${elements} elements matching: ${selector}`);
        foundElements += elements;
      }
    }

    console.log(`📈 Total analytics elements found: ${foundElements}`);

    // Check for specific Fortune Cookie analytics content
    const fortuneAnalyticsTerms = [
      "fortune",
      "generation",
      "theme",
      "popularity",
      "user",
      "engagement",
      "performance",
      "metrics",
      "web vitals",
      "error",
      "tracking",
      "analytics",
      "dashboard",
    ];

    const bodyText = (await page.textContent("body")) ?? "";
    const foundTerms = fortuneAnalyticsTerms.filter((term) =>
      bodyText.toLowerCase().includes(term.toLowerCase()),
    );

    console.log("📈 Found analytics-related terms:", foundTerms);

    // Take screenshot of current state
    await page.screenshot({
      path: "test-results/analytics-dashboard-view.png",
      fullPage: true,
    });
  });

  test("Interactive Elements and UI Testing", async ({ page }) => {
    await page.goto("/analytics", { waitUntil: "networkidle" });

    console.log("🖱️ Testing interactive elements...");

    // Look for interactive elements
    const interactiveSelectors = [
      "button:not([disabled])",
      "select",
      "input",
      '[role="button"]',
      '[role="tab"]',
      ".filter",
      ".dropdown",
      ".toggle",
      '[data-testid*="button"]',
      '[data-testid*="filter"]',
      '[data-testid*="export"]',
      "a[href]",
    ];

    let totalInteractive = 0;
    const interactionResults = [];

    for (const selector of interactiveSelectors) {
      const elements = await page.locator(selector).count();
      if (elements > 0) {
        console.log(`🎛️ Found ${elements} interactive elements: ${selector}`);
        totalInteractive += elements;

        // Try to interact with first visible element
        try {
          const firstElement = page.locator(selector).first();
          const isVisible = await firstElement.isVisible();

          if (isVisible) {
            await firstElement.scrollIntoViewIfNeeded();
            await firstElement.hover();

            const elementText = (await firstElement.textContent()) || "";
            interactionResults.push({
              selector,
              text: elementText.slice(0, 50),
              interactable: true,
            });
          }
        } catch (error) {
          const errorMessage =
            error instanceof Error ? error.message : String(error);
          console.log(`⚠️ Could not interact with ${selector}:`, errorMessage);
          interactionResults.push({
            selector,
            text: "",
            interactable: false,
            error: errorMessage,
          });
        }
      }
    }

    console.log(`🎯 Total interactive elements: ${totalInteractive}`);
    console.log("📋 Interaction results:", interactionResults);

    // Take screenshot showing interactive state
    await page.screenshot({
      path: "test-results/analytics-interactive-elements.png",
      fullPage: true,
    });
  });

  test("Accessibility Testing", async ({ page }) => {
    await page.goto("/analytics", { waitUntil: "networkidle" });

    console.log("♿ Testing accessibility...");

    // Check for accessibility landmarks and structure
    const accessibilityChecks = {
      "Headings (h1-h6)": "h1, h2, h3, h4, h5, h6",
      Navigation: 'nav, [role="navigation"]',
      "Main content": 'main, [role="main"]',
      Buttons: 'button, [role="button"]',
      Links: "a[href]",
      "Form labels": "label",
      "Images with alt": "img[alt]",
      "Skip links": 'a[href^="#"]',
      "ARIA landmarks": "[role]",
      "Focus indicators": ":focus-visible",
    };

    const accessibilityReport: Record<string, number> = {};

    for (const [description, selector] of Object.entries(accessibilityChecks)) {
      const count = await page.locator(selector).count();
      accessibilityReport[description] = count;
      console.log(`♿ ${description}: ${count}`);
    }

    // Check heading hierarchy
    const headings = await page
      .locator("h1, h2, h3, h4, h5, h6")
      .allTextContents();
    console.log("📋 Page heading structure:", headings);

    // Test keyboard navigation
    console.log("⌨️ Testing keyboard navigation...");
    await page.keyboard.press("Tab");
    await page.waitForTimeout(500);
    const focusedElement = await page.evaluate(() => {
      const focused = document.activeElement;
      return focused
        ? {
            tagName: focused.tagName,
            className: focused.className,
            id: focused.id,
            textContent: focused.textContent?.slice(0, 50),
          }
        : null;
    });

    console.log("🎯 First focusable element:", focusedElement);

    await page.screenshot({
      path: "test-results/analytics-accessibility-focus.png",
      fullPage: true,
    });
  });

  test("Responsive Design Testing", async ({ page }) => {
    console.log("📱 Testing responsive design...");

    const viewports = [
      { name: "mobile-portrait", width: 375, height: 667 },
      { name: "mobile-landscape", width: 667, height: 375 },
      { name: "tablet", width: 768, height: 1024 },
      { name: "desktop", width: 1280, height: 720 },
      { name: "large-desktop", width: 1920, height: 1080 },
    ];

    for (const viewport of viewports) {
      await page.setViewportSize({
        width: viewport.width,
        height: viewport.height,
      });
      await page.goto("/analytics", { waitUntil: "networkidle" });

      console.log(
        `📐 Testing ${viewport.name} (${viewport.width}x${viewport.height})`,
      );

      // Allow layout to settle
      await page.waitForTimeout(2000);

      // Check for responsive elements
      const responsiveElements = await page.evaluate(() => {
        const elements = document.querySelectorAll("*");
        let overflowCount = 0;
        let hiddenCount = 0;

        elements.forEach((el) => {
          const computedStyle = window.getComputedStyle(el);
          if (computedStyle.overflow === "hidden") hiddenCount++;
          if (el.scrollWidth > window.innerWidth) overflowCount++;
        });

        return {
          overflowCount,
          hiddenCount,
          viewportWidth: window.innerWidth,
          viewportHeight: window.innerHeight,
          bodyWidth: document.body.scrollWidth,
          bodyHeight: document.body.scrollHeight,
        };
      });

      console.log(`📊 ${viewport.name} metrics:`, responsiveElements);

      await page.screenshot({
        path: `test-results/analytics-responsive-${viewport.name}.png`,
        fullPage: true,
      });

      // Check for mobile-specific elements
      if (viewport.width <= 768) {
        const mobileElements = await page
          .locator(
            '.mobile-menu, [data-testid*="mobile"], .hamburger, .menu-toggle',
          )
          .count();
        console.log(`📱 Mobile UI elements found: ${mobileElements}`);
      }
    }
  });

  test("Performance and Web Vitals Analysis", async ({ page }) => {
    await page.goto("/analytics", { waitUntil: "networkidle" });

    console.log("⚡ Analyzing performance and Web Vitals...");

    // Collect performance metrics
    const performanceMetrics = await page.evaluate(() => {
      const perfData = performance.getEntriesByType(
        "navigation",
      )[0] as PerformanceNavigationTiming;
      const paintEntries = performance.getEntriesByType("paint");

      return {
        // Navigation timing
        loadTime: perfData
          ? Math.round(perfData.loadEventEnd - perfData.loadEventStart)
          : 0,
        domContentLoaded: perfData
          ? Math.round(
              perfData.domContentLoadedEventEnd -
                perfData.domContentLoadedEventStart,
            )
          : 0,
        domComplete: perfData
          ? Math.round(perfData.domComplete - perfData.startTime)
          : 0,

        // Paint timing
        firstPaint:
          paintEntries.find((entry) => entry.name === "first-paint")
            ?.startTime || 0,
        firstContentfulPaint:
          paintEntries.find((entry) => entry.name === "first-contentful-paint")
            ?.startTime || 0,

        // Resource counts
        resourceCount: performance.getEntriesByType("resource").length,

        // Memory (if available)
        memory: (performance as any).memory
          ? {
              used: Math.round(
                (performance as any).memory.usedJSHeapSize / 1024 / 1024,
              ),
              total: Math.round(
                (performance as any).memory.totalJSHeapSize / 1024 / 1024,
              ),
              limit: Math.round(
                (performance as any).memory.jsHeapSizeLimit / 1024 / 1024,
              ),
            }
          : null,
      };
    });

    console.log("📊 Performance metrics:", performanceMetrics);

    // Look for Web Vitals content on the page
    const webVitalsContent = await page.evaluate(() => {
      const bodyText = document.body.textContent || "";
      const vitalsKeywords = [
        "LCP",
        "Largest Contentful Paint",
        "FID",
        "First Input Delay",
        "INP",
        "Interaction to Next Paint",
        "CLS",
        "Cumulative Layout Shift",
        "Core Web Vitals",
        "Web Vitals",
        "Real User Monitoring",
        "RUM",
        "Performance",
      ];

      const foundKeywords = vitalsKeywords.filter((keyword) =>
        bodyText.toLowerCase().includes(keyword.toLowerCase()),
      );

      return {
        foundKeywords,
        hasPerformanceData:
          bodyText.includes("ms") ||
          bodyText.includes("score") ||
          bodyText.includes("%"),
        hasCharts: document.querySelectorAll("canvas, svg, .chart").length > 0,
        hasMetrics:
          document.querySelectorAll('.metric, [data-testid*="metric"]').length >
          0,
      };
    });

    console.log("📈 Web Vitals content analysis:", webVitalsContent);

    // Check for console errors
    const jsErrors: string[] = [];
    page.on("pageerror", (error) => {
      jsErrors.push(error.message);
    });

    // Wait and reload to collect fresh data
    await page.reload({ waitUntil: "networkidle" });
    await page.waitForTimeout(3000);

    if (jsErrors.length > 0) {
      console.log("❌ JavaScript errors detected:", jsErrors);
    } else {
      console.log("✅ No JavaScript errors detected");
    }

    await page.screenshot({
      path: "test-results/analytics-performance-state.png",
      fullPage: true,
    });
  });

  test("Analytics Page Content and Features Summary", async ({ page }) => {
    await page.goto("/analytics", { waitUntil: "networkidle" });

    console.log("📋 Generating analytics page summary...");

    // Get comprehensive page information
    const pageInfo = await page.evaluate(() => {
      const getElementInfo = (selector: string) => {
        const elements = document.querySelectorAll(selector);
        return {
          count: elements.length,
          visible: Array.from(elements).filter((el) => {
            const style = window.getComputedStyle(el);
            return style.display !== "none" && style.visibility !== "hidden";
          }).length,
        };
      };

      return {
        title: document.title,
        url: window.location.href,
        bodyClasses: document.body.className,

        // Element counts
        elements: {
          headings: getElementInfo("h1, h2, h3, h4, h5, h6"),
          buttons: getElementInfo('button, [role="button"]'),
          links: getElementInfo("a[href]"),
          forms: getElementInfo("form"),
          inputs: getElementInfo("input, select, textarea"),
          tables: getElementInfo("table"),
          charts: getElementInfo("canvas, svg, .chart"),
          images: getElementInfo("img"),
        },

        // Text content analysis
        textContent: document.body.textContent?.length || 0,
        hasLoadingStates:
          document.body.textContent?.toLowerCase().includes("loading") || false,
        hasErrorMessages:
          document.body.textContent?.toLowerCase().includes("error") || false,

        // Performance indicators
        scriptsCount: document.querySelectorAll("script").length,
        stylesheetsCount: document.querySelectorAll('link[rel="stylesheet"]')
          .length,

        // Accessibility
        hasSkipLinks: document.querySelectorAll('a[href^="#"]').length > 0,
        hasAriaLabels:
          document.querySelectorAll("[aria-label], [aria-labelledby]").length >
          0,

        // Meta information
        metaTags: Array.from(document.querySelectorAll("meta"))
          .map((meta) => ({
            name: meta.getAttribute("name"),
            property: meta.getAttribute("property"),
            content: meta.getAttribute("content")?.slice(0, 100),
          }))
          .filter((meta) => meta.name || meta.property),
      };
    });

    console.log("📊 Analytics page comprehensive analysis:", pageInfo);

    // Take final comprehensive screenshot
    await page.screenshot({
      path: "test-results/analytics-final-comprehensive.png",
      fullPage: true,
    });

    // Generate summary report
    const summary = {
      pageTitle: pageInfo.title,
      url: pageInfo.url,
      isAnalyticsPage: pageInfo.url.includes("/analytics"),
      hasContent: pageInfo.textContent > 1000,
      hasInteractiveElements:
        pageInfo.elements.buttons.count > 0 ||
        pageInfo.elements.links.count > 0,
      hasDataVisualization: pageInfo.elements.charts.count > 0,
      hasDataTables: pageInfo.elements.tables.count > 0,
      isAccessible: pageInfo.hasSkipLinks || pageInfo.hasAriaLabels,
      elementsFound: pageInfo.elements,
      potentialIssues: {
        hasErrors: pageInfo.hasErrorMessages,
        stillLoading: pageInfo.hasLoadingStates,
        lowContent: pageInfo.textContent < 500,
      },
    };

    console.log("🎯 Final Analytics Page Summary:", summary);
  });
});
