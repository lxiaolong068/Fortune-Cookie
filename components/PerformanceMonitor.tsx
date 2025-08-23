"use client"

import { useEffect } from 'react'
import Script from 'next/script'

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

          // Send to custom analytics endpoint
          fetch('/api/analytics/web-vitals', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(metric),
          }).catch(console.error)
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

// Performance optimization utilities
export const performanceUtils = {
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
      'openrouter.ai'
    ]

    domains.forEach((domain) => {
      const link = document.createElement('link')
      link.rel = 'dns-prefetch'
      link.href = `//${domain}`
      document.head.appendChild(link)
    })
  }
}

// Performance budget checker
export function checkPerformanceBudget() {
  if (typeof window === 'undefined') return

  const budget = {
    maxLCP: 2500, // 2.5 seconds
    maxINP: 200,  // 200 milliseconds (tune per product goals)
    maxCLS: 0.1,  // 0.1
    maxTTFB: 800, // 800 milliseconds
  }

  import('web-vitals').then(({ onCLS, onLCP, onTTFB, onINP }) => {
    onCLS((metric) => {
      if (metric.value > budget.maxCLS) {
        console.warn(`CLS budget exceeded: ${metric.value} > ${budget.maxCLS}`)
      }
    })

    onINP((metric) => {
      if (metric.value > budget.maxINP) {
        console.warn(`INP budget exceeded: ${metric.value}ms > ${budget.maxINP}ms`)
      }
    })

    onLCP((metric) => {
      if (metric.value > budget.maxLCP) {
        console.warn(`LCP budget exceeded: ${metric.value}ms > ${budget.maxLCP}ms`)
      }
    })

    onTTFB((metric) => {
      if (metric.value > budget.maxTTFB) {
        console.warn(`TTFB budget exceeded: ${metric.value}ms > ${budget.maxTTFB}ms`)
      }
    })
  })
}

// Component for critical resource preloading
export function CriticalResourcePreloader() {
  useEffect(() => {
    // Preload critical resources
    performanceUtils.addResourceHints()
    performanceUtils.optimizeFonts()
    
    // Register service worker
    performanceUtils.registerServiceWorker()
    
    // Check performance budget in development
    if (process.env.NODE_ENV === 'development') {
      setTimeout(checkPerformanceBudget, 3000)
    }
  }, [])

  return null
}
