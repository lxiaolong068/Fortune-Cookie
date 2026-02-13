"use client";

import { useEffect } from "react";
import Script from "next/script";
import {
  capturePerformanceIssue,
  captureBusinessEvent,
} from "@/lib/error-monitoring";
import {
  performanceUtils,
  CORE_WEB_VITALS_THRESHOLDS,
  performanceAlertManager,
} from "@/lib/performance-budget";

type WebVitalsMetric = {
  id: string;
  name: keyof typeof CORE_WEB_VITALS_THRESHOLDS;
  value: number;
  rating?: string;
  delta?: number;
  navigationType?: string;
};

// Core Web Vitals monitoring
export function PerformanceMonitor() {
  useEffect(() => {
    let latestLcpEntry: PerformanceEntry | null = null;
    let lcpReported = false;
    let lcpObserver: PerformanceObserver | null = null;
    let longTaskObserver: PerformanceObserver | null = null;
    let layoutShiftObserver: PerformanceObserver | null = null;
    let resourceObserver: PerformanceObserver | null = null;
    let navigationObserver: PerformanceObserver | null = null;

    const getLcpElementData = (entry: PerformanceEntry) => {
      const lcpEntry = entry as PerformanceEntry & {
        element?: Element;
        url?: string;
        size?: number;
      };
      const element = lcpEntry.element;
      if (!element || !(element instanceof HTMLElement)) {
        return null;
      }

      return {
        tagName: element.tagName.toLowerCase(),
        id: element.id || undefined,
        className: element.className
          ? String(element.className).slice(0, 200)
          : undefined,
        url: lcpEntry.url,
        size: lcpEntry.size,
      };
    };

    // Web Vitals monitoring (web-vitals v5 API)
    import("web-vitals").then(({ onCLS, onFCP, onLCP, onTTFB, onINP }) => {
      function sendToAnalytics(metric: WebVitalsMetric) {
        // Send to console in development
        if (process.env.NODE_ENV === "development") {
          console.log("Web Vital:", metric);
        }

        // 使用性能预算系统检查阈值
        const thresholds =
          CORE_WEB_VITALS_THRESHOLDS[
            metric.name as keyof typeof CORE_WEB_VITALS_THRESHOLDS
          ];
        if (thresholds) {
          const threshold = thresholds.good;

          // 检查性能预算
          const budgetReport = performanceUtils.checkBudget({
            [metric.name]: metric.value,
          });

          // 如果超出预算，发送到错误监控
          if (budgetReport.violations.length > 0) {
            capturePerformanceIssue(metric.name, metric.value, threshold, {
              component: "web-vitals",
              additionalData: {
                id: metric.id,
                rating: metric.rating,
                navigationType: metric.navigationType,
                budgetScore: budgetReport.score,
                violations: budgetReport.violations,
                recommendations: budgetReport.recommendations,
              },
            });

            // 记录违规到告警管理器
            performanceAlertManager.recordViolation(
              metric.name,
              metric.value,
              threshold,
            );
          }
        }

        // 记录性能指标业务事件
        captureBusinessEvent("web_vital_measured", {
          name: metric.name,
          value: metric.value,
          rating: metric.rating,
          id: metric.id,
        });

        if (metric.name === "LCP" && latestLcpEntry && !lcpReported) {
          const elementData = getLcpElementData(latestLcpEntry);
          if (elementData) {
            captureBusinessEvent("lcp_element_detected", {
              ...elementData,
              value: metric.value,
              rating: metric.rating,
            });
          }
          lcpReported = true;
        }

        // Only send to external services in production
        if (process.env.NODE_ENV === "production") {
          // Send to Google Analytics 4
          if (typeof gtag !== "undefined") {
            gtag("event", metric.name, {
              event_category: "Web Vitals",
              event_label: metric.id,
              value: Math.round(
                metric.name === "CLS" ? metric.value * 1000 : metric.value,
              ),
              non_interaction: true,
            });
          }

          // Send to custom analytics endpoint with retry mechanism
          const sendWithRetry = async (retries = 3, delay = 1000) => {
            for (let i = 0; i < retries; i++) {
              try {
                const response = await fetch("/api/analytics/web-vitals", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify(metric),
                });

                if (response.ok) {
                  return; // Success
                }

                // If not the last retry, wait before retrying
                if (i < retries - 1) {
                  await new Promise((resolve) =>
                    setTimeout(resolve, delay * (i + 1)),
                  );
                }
              } catch (error) {
                // If not the last retry, wait before retrying
                if (i < retries - 1) {
                  await new Promise((resolve) =>
                    setTimeout(resolve, delay * (i + 1)),
                  );
                } else {
                  // Last retry failed, log error
                  capturePerformanceIssue("web_vitals_api_error", 1, 0, {
                    component: "performance-monitor",
                    additionalData: {
                      error:
                        error instanceof Error
                          ? error.message
                          : "Unknown error",
                      retries: i + 1,
                    },
                  });
                  console.error(
                    "Failed to send web vitals after retries:",
                    error,
                  );
                }
              }
            }
          };

          sendWithRetry().catch(() => {
            // Silent catch to prevent unhandled promise rejection
          });
        }
      }

      onCLS(sendToAnalytics);
      onFCP(sendToAnalytics);
      onLCP(sendToAnalytics);
      onTTFB(sendToAnalytics);
      onINP(sendToAnalytics);
    });

    // Performance observer for additional metrics
    if ("PerformanceObserver" in window) {
      lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        latestLcpEntry = entries[entries.length - 1] ?? null;
      });

      try {
        lcpObserver.observe({
          type: "largest-contentful-paint",
          buffered: true,
        });
      } catch {
        // LCP observer not supported
      }

      // Monitor long tasks
      longTaskObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.duration > 50) {
            console.warn("Long task detected:", entry);

            // 记录长任务到Sentry
            capturePerformanceIssue("long_task", entry.duration, 50, {
              component: "performance-observer",
              additionalData: {
                name: entry.name,
                startTime: entry.startTime,
                duration: entry.duration,
              },
            });
          }
        }
      });

      try {
        longTaskObserver.observe({ entryTypes: ["longtask"] });
      } catch {
        // Longtask observer not supported
      }

      // Monitor layout shifts
      layoutShiftObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          const layoutShift = entry as PerformanceEntry & {
            hadRecentInput?: boolean;
          };
          if (layoutShift.hadRecentInput) continue;
          console.log("Layout shift:", entry);
        }
      });

      try {
        layoutShiftObserver.observe({ entryTypes: ["layout-shift"] });
      } catch {
        // Layout shift observer not supported
      }

      // Monitor resource timing
      resourceObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          const resource = entry as PerformanceResourceTiming;

          // 只监控大型资源或慢速资源
          if (resource.transferSize > 100000 || resource.duration > 1000) {
            console.warn("Large/slow resource:", {
              name: resource.name,
              size: resource.transferSize,
              duration: resource.duration,
              type: resource.initiatorType,
            });

            capturePerformanceIssue("slow_resource", resource.duration, 1000, {
              component: "resource-timing",
              additionalData: {
                url: resource.name,
                size: resource.transferSize,
                duration: resource.duration,
                type: resource.initiatorType,
                protocol: resource.nextHopProtocol,
              },
            });
          }
        }
      });

      try {
        resourceObserver.observe({ entryTypes: ["resource"] });
      } catch {
        // Resource observer not supported
      }

      // Monitor navigation timing
      navigationObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          const nav = entry as PerformanceNavigationTiming;

          // 收集详细的导航时序数据
          const timings = {
            dns: nav.domainLookupEnd - nav.domainLookupStart,
            tcp: nav.connectEnd - nav.connectStart,
            request: nav.responseStart - nav.requestStart,
            response: nav.responseEnd - nav.responseStart,
            dom: nav.domContentLoadedEventEnd - nav.domContentLoadedEventStart,
            load: nav.loadEventEnd - nav.loadEventStart,
            total: nav.loadEventEnd - nav.fetchStart,
          };

          console.log("Navigation timings:", timings);

          // 记录导航性能
          captureBusinessEvent("navigation_timing", {
            ...timings,
            type: nav.type,
            redirectCount: nav.redirectCount,
          });

          // 检查是否有性能问题
          if (timings.total > 5000) {
            capturePerformanceIssue("slow_page_load", timings.total, 5000, {
              component: "navigation-timing",
              additionalData: timings,
            });
          }
        }
      });

      try {
        navigationObserver.observe({ entryTypes: ["navigation"] });
      } catch {
        // Navigation observer not supported
      }
    }

    return () => {
      lcpObserver?.disconnect();
      longTaskObserver?.disconnect();
      layoutShiftObserver?.disconnect();
      resourceObserver?.disconnect();
      navigationObserver?.disconnect();
    };
  }, []);

  return null;
}

// Bot User-Agent keywords (shared with middleware.ts)
const BOT_UA_KEYWORDS = [
  "bot", "spider", "crawl", "slurp", "headlesschrome",
  "puppeteer", "phantom", "selenium", "lighthouse",
  "pagespeed", "gtmetrix", "pingdom", "uptimerobot",
];

function isBotUserAgent(): boolean {
  if (typeof navigator === "undefined") return false;
  const ua = navigator.userAgent.toLowerCase();
  return BOT_UA_KEYWORDS.some((bot) => ua.includes(bot));
}

// Google Analytics 4 component
export function GoogleAnalytics({ measurementId }: { measurementId: string }) {
  if (!measurementId || process.env.NODE_ENV !== "production") {
    return null;
  }

  // Skip GA for known bots to prevent polluting analytics data
  if (isBotUserAgent()) {
    return null;
  }

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${measurementId}', {
            page_title: document.title,
            page_location: window.location.href,
          });
        `}
      </Script>
    </>
  );
}

// Google AdSense component
export function GoogleAdSense({ clientId }: { clientId: string }) {
  if (!clientId || process.env.NODE_ENV !== "production") {
    return null;
  }

  return (
    <Script
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${clientId}`}
      strategy="afterInteractive"
      crossOrigin="anonymous"
      onLoad={() => {
        if (process.env.NODE_ENV === "development") {
          console.log("Google AdSense script loaded successfully");
        }
      }}
      onError={(error) => {
        console.error("Failed to load Google AdSense script:", error);
        // 记录 AdSense 加载错误到性能监控
        capturePerformanceIssue("adsense_script_error", 1, 0, {
          component: "google-adsense",
          additionalData: { clientId, error: error.message },
        });
      }}
    />
  );
}

/**
 * Performance optimization utilities
 * Contains actively used functions for resource hints and service worker registration
 */
export const performanceOptimizationUtils = {
  /**
   * Preload critical resources
   * @param href - URL of the resource to preload
   * @param as - Type of resource (script, style, image, font, etc.)
   * @param type - Optional MIME type
   */
  preloadResource: (href: string, as: string, type?: string) => {
    const link = document.createElement("link");
    link.rel = "preload";
    link.href = href;
    link.as = as;
    if (type) link.type = type;
    document.head.appendChild(link);
  },

  /**
   * Register the service worker for offline support and caching
   */
  registerServiceWorker: async () => {
    if ("serviceWorker" in navigator && process.env.NODE_ENV === "production") {
      try {
        const registration = await navigator.serviceWorker.register("/sw.js");
        console.log("Service Worker registered:", registration);
      } catch (error) {
        console.error("Service Worker registration failed:", error);
      }
    }
  },

  /**
   * Add DNS prefetch hints for external domains to improve connection times
   */
  addResourceHints: () => {
    const domains = [
      "fonts.googleapis.com",
      "fonts.gstatic.com",
      "www.google-analytics.com",
      "openrouter.ai",
      "pagead2.googlesyndication.com",
      "www.googleadservices.com",
      "googleads.g.doubleclick.net",
    ];

    domains.forEach((domain) => {
      const link = document.createElement("link");
      link.rel = "dns-prefetch";
      link.href = `//${domain}`;
      document.head.appendChild(link);
    });
  },
};

// Keep legacy export for backwards compatibility
export const legacyPerformanceUtils = performanceOptimizationUtils;

// Enhanced performance budget checker
export function checkPerformanceBudget() {
  if (typeof window === "undefined") return;

  import("web-vitals").then(({ onCLS, onLCP, onTTFB, onINP, onFCP }) => {
    const metrics: Record<string, number> = {};

    const checkAndReport = (metricName: string, value: number) => {
      metrics[metricName] = value;
      const report = performanceUtils.checkBudget(metrics);

      if (report.violations.length > 0) {
        console.group(`🚨 Performance Budget Violation: ${metricName}`);
        console.warn(`Value: ${value}`);
        console.warn(`Budget Score: ${report.score}/100`);
        report.violations.forEach((violation) => {
          console.warn(
            `${violation.metric}: ${violation.actual} > ${violation.budget} (${violation.severity})`,
          );
        });
        if (report.recommendations.length > 0) {
          console.info("Recommendations:", report.recommendations);
        }
        console.groupEnd();
      } else {
        console.log(`✅ ${metricName}: ${value} (within budget)`);
      }
    };

    onCLS((metric) => checkAndReport("CLS", metric.value));
    onINP((metric) => checkAndReport("INP", metric.value));
    onLCP((metric) => checkAndReport("LCP", metric.value));
    onTTFB((metric) => checkAndReport("TTFB", metric.value));
    onFCP((metric) => checkAndReport("FCP", metric.value));
  });
}

// Component for critical resource preloading
export function CriticalResourcePreloader() {
  useEffect(() => {
    // Add DNS prefetch hints for external domains
    performanceOptimizationUtils.addResourceHints();

    // Register service worker for offline support
    performanceOptimizationUtils.registerServiceWorker();

    // Check performance budget in development
    if (process.env.NODE_ENV === "development") {
      setTimeout(checkPerformanceBudget, 3000);
    }
  }, []);

  return null;
}
