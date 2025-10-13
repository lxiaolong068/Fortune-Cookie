"use client"

import { useEffect } from 'react'
import Script from 'next/script'
import { capturePerformanceIssue, captureBusinessEvent } from '@/lib/error-monitoring'
import { performanceUtils, CORE_WEB_VITALS_THRESHOLDS } from '@/lib/performance-budget'

// Core Web Vitals monitoring
export function PerformanceMonitor() {
  useEffect(() => {
    // Web Vitals monitoring (web-vitals v5 API)
    import('web-vitals').then(({ onCLS, onFCP, onLCP, onTTFB, onINP }) => {
      function sendToAnalytics(metric: any) {
        // Send to console in development
        if (process.env.NODE_ENV === 'development') {
          console.log('Web Vital:', metric)
        }

        // 使用性能预算系统检查阈值
        const thresholds = CORE_WEB_VITALS_THRESHOLDS[metric.name as keyof typeof CORE_WEB_VITALS_THRESHOLDS]
        if (thresholds) {
          const threshold = thresholds.good

          // 检查性能预算
          const budgetReport = performanceUtils.checkBudget({ [metric.name]: metric.value })

          // 如果超出预算，发送到错误监控
          if (budgetReport.violations.length > 0) {
            capturePerformanceIssue(
              metric.name,
              metric.value,
              threshold,
              {
                component: 'web-vitals',
                additionalData: {
                  id: metric.id,
                  rating: metric.rating,
                  navigationType: metric.navigationType,
                  budgetScore: budgetReport.score,
                  violations: budgetReport.violations,
                  recommendations: budgetReport.recommendations,
                }
              }
            )
          }
        }

        // 记录性能指标业务事件
        captureBusinessEvent('web_vital_measured', {
          name: metric.name,
          value: metric.value,
          rating: metric.rating,
          id: metric.id,
        })

        // Only send to external services in production
        if (process.env.NODE_ENV === 'production') {
          // Send to Google Analytics 4
          if (typeof gtag !== 'undefined') {
            gtag('event', metric.name, {
              event_category: 'Web Vitals',
              event_label: metric.id,
              value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
              non_interaction: true,
            })
          }

          // Send to custom analytics endpoint with retry mechanism
          const sendWithRetry = async (retries = 3, delay = 1000) => {
            for (let i = 0; i < retries; i++) {
              try {
                const response = await fetch('/api/analytics/web-vitals', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(metric),
                })

                if (response.ok) {
                  return // Success
                }

                // If not the last retry, wait before retrying
                if (i < retries - 1) {
                  await new Promise(resolve => setTimeout(resolve, delay * (i + 1)))
                }
              } catch (error) {
                // If not the last retry, wait before retrying
                if (i < retries - 1) {
                  await new Promise(resolve => setTimeout(resolve, delay * (i + 1)))
                } else {
                  // Last retry failed, log error
                  capturePerformanceIssue(
                    'web_vitals_api_error',
                    1,
                    0,
                    {
                      component: 'performance-monitor',
                      additionalData: {
                        error: error instanceof Error ? error.message : 'Unknown error',
                        retries: i + 1
                      }
                    }
                  )
                  console.error('Failed to send web vitals after retries:', error)
                }
              }
            }
          }

          sendWithRetry().catch(() => {
            // Silent catch to prevent unhandled promise rejection
          })
        }
      }

      onCLS(sendToAnalytics)
      onFCP(sendToAnalytics)
      onLCP(sendToAnalytics)
      onTTFB(sendToAnalytics)
      onINP(sendToAnalytics)
    })

    // Performance observer for additional metrics
    if ('PerformanceObserver' in window) {
      // Monitor long tasks
      const longTaskObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.duration > 50) {
            console.warn('Long task detected:', entry)

            // 记录长任务到Sentry
            capturePerformanceIssue(
              'long_task',
              entry.duration,
              50,
              {
                component: 'performance-observer',
                additionalData: {
                  name: entry.name,
                  startTime: entry.startTime,
                  duration: entry.duration,
                }
              }
            )
          }
        }
      })

      try {
        longTaskObserver.observe({ entryTypes: ['longtask'] })
      } catch (e) {
        // Longtask observer not supported
      }

      // Monitor layout shifts
      const layoutShiftObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if ((entry as any).hadRecentInput) continue
          console.log('Layout shift:', entry)
        }
      })

      try {
        layoutShiftObserver.observe({ entryTypes: ['layout-shift'] })
      } catch (e) {
        // Layout shift observer not supported
      }
    }
  }, [])

  return null
}

// Google Analytics 4 component
export function GoogleAnalytics({ measurementId }: { measurementId: string }) {
  if (!measurementId || process.env.NODE_ENV !== 'production') {
    return null
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
  )
}

// Google AdSense component
export function GoogleAdSense({ clientId }: { clientId: string }) {
  if (!clientId || process.env.NODE_ENV !== 'production') {
    return null
  }

  return (
    <Script
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${clientId}`}
      strategy="afterInteractive"
      crossOrigin="anonymous"
      onLoad={() => {
        if (process.env.NODE_ENV === 'development') {
          console.log('Google AdSense script loaded successfully')
        }
      }}
      onError={(error) => {
        console.error('Failed to load Google AdSense script:', error)
        // 记录 AdSense 加载错误到性能监控
        capturePerformanceIssue(
          'adsense_script_error',
          1,
          0,
          {
            component: 'google-adsense',
            additionalData: { clientId, error: error.message }
          }
        )
      }}
    />
  )
}

// Performance optimization utilities (legacy)
export const legacyPerformanceUtils = {
  // Preload critical resources
  preloadResource: (href: string, as: string, type?: string) => {
    const link = document.createElement('link')
    link.rel = 'preload'
    link.href = href
    link.as = as
    if (type) link.type = type
    document.head.appendChild(link)
  },

  // Prefetch next page
  prefetchPage: (href: string) => {
    const link = document.createElement('link')
    link.rel = 'prefetch'
    link.href = href
    document.head.appendChild(link)
  },

  // Lazy load images with intersection observer
  lazyLoadImages: () => {
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = entry.target as HTMLImageElement
            if (img.dataset.src) {
              img.src = img.dataset.src
              img.classList.remove('lazy')
              imageObserver.unobserve(img)
            }
          }
        })
      })

      document.querySelectorAll('img[data-src]').forEach((img) => {
        imageObserver.observe(img)
      })
    }
  },

  // Optimize font loading (using next/font, no manual preload required)
  optimizeFonts: () => {
    // Intentionally left empty to avoid preloading non-existent fonts.
  },

  // Service worker registration
  registerServiceWorker: async () => {
    if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js')
        console.log('Service Worker registered:', registration)
      } catch (error) {
        console.error('Service Worker registration failed:', error)
      }
    }
  },

  // Critical CSS inlining
  inlineCriticalCSS: (css: string) => {
    const style = document.createElement('style')
    style.textContent = css
    document.head.appendChild(style)
  },

  // Resource hints
  addResourceHints: () => {
    // DNS prefetch for external domains
    const domains = [
      'fonts.googleapis.com',
      'fonts.gstatic.com',
      'www.google-analytics.com',
      'openrouter.ai',
      'pagead2.googlesyndication.com',
      'www.googleadservices.com',
      'googleads.g.doubleclick.net'
    ]

    domains.forEach((domain) => {
      const link = document.createElement('link')
      link.rel = 'dns-prefetch'
      link.href = `//${domain}`
      document.head.appendChild(link)
    })
  }
}

// Enhanced performance budget checker
export function checkPerformanceBudget() {
  if (typeof window === 'undefined') return

  import('web-vitals').then(({ onCLS, onLCP, onTTFB, onINP, onFCP }) => {
    const metrics: Record<string, number> = {}

    const checkAndReport = (metricName: string, value: number) => {
      metrics[metricName] = value
      const report = performanceUtils.checkBudget(metrics)

      if (report.violations.length > 0) {
        console.group(`🚨 Performance Budget Violation: ${metricName}`)
        console.warn(`Value: ${value}`)
        console.warn(`Budget Score: ${report.score}/100`)
        report.violations.forEach(violation => {
          console.warn(`${violation.metric}: ${violation.actual} > ${violation.budget} (${violation.severity})`)
        })
        if (report.recommendations.length > 0) {
          console.info('Recommendations:', report.recommendations)
        }
        console.groupEnd()
      } else {
        console.log(`✅ ${metricName}: ${value} (within budget)`)
      }
    }

    onCLS((metric) => checkAndReport('CLS', metric.value))
    onINP((metric) => checkAndReport('INP', metric.value))
    onLCP((metric) => checkAndReport('LCP', metric.value))
    onTTFB((metric) => checkAndReport('TTFB', metric.value))
    onFCP((metric) => checkAndReport('FCP', metric.value))
  })
}

// Component for critical resource preloading
export function CriticalResourcePreloader() {
  useEffect(() => {
    // Preload critical resources
    legacyPerformanceUtils.addResourceHints()
    legacyPerformanceUtils.optimizeFonts()

    // Register service worker
    legacyPerformanceUtils.registerServiceWorker()

    // Check performance budget in development
    if (process.env.NODE_ENV === 'development') {
      setTimeout(checkPerformanceBudget, 3000)
    }
  }, [])

  return null
}
