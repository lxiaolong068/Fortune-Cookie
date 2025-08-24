import { captureError, capturePerformanceIssue } from './error-monitoring'

// 全局错误处理器
export function setupGlobalErrorHandlers() {
  if (typeof window === 'undefined') return

  // 捕获未处理的Promise拒绝
  window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason)
    
    captureError(
      event.reason instanceof Error ? event.reason : new Error(String(event.reason)),
      {
        component: 'global-handler',
        action: 'unhandled_promise_rejection',
        url: window.location.href,
        userAgent: navigator.userAgent,
        additionalData: {
          type: 'unhandledrejection',
          reason: String(event.reason),
        }
      },
      'error'
    )
  })

  // 捕获全局JavaScript错误
  window.addEventListener('error', (event) => {
    console.error('Global error:', event.error)
    
    captureError(
      event.error || new Error(event.message),
      {
        component: 'global-handler',
        action: 'global_error',
        url: window.location.href,
        userAgent: navigator.userAgent,
        additionalData: {
          type: 'error',
          message: event.message,
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno,
        }
      },
      'error'
    )
  })

  // 捕获资源加载错误
  window.addEventListener('error', (event) => {
    const target = event.target
    
    if (target && target instanceof HTMLElement) {
      const tagName = target.tagName?.toLowerCase()
      const src = (target as any).src || (target as any).href
      
      if (src && ['img', 'script', 'link', 'video', 'audio'].includes(tagName)) {
        console.error('Resource loading error:', { tagName, src })
        
        captureError(
          `Resource loading failed: ${tagName} - ${src}`,
          {
            component: 'global-handler',
            action: 'resource_error',
            url: window.location.href,
            additionalData: {
              type: 'resource_error',
              tagName,
              src,
              outerHTML: target.outerHTML?.slice(0, 200), // 限制长度
            }
          },
          'warning'
        )
      }
    }
  }, true) // 使用捕获阶段

  // 监控网络状态变化
  if ('navigator' in window && 'onLine' in navigator) {
    const handleOnline = () => {
      captureError(
        'Network connection restored',
        {
          component: 'global-handler',
          action: 'network_online',
          additionalData: { online: true }
        },
        'info'
      )
    }

    const handleOffline = () => {
      captureError(
        'Network connection lost',
        {
          component: 'global-handler',
          action: 'network_offline',
          additionalData: { online: false }
        },
        'warning'
      )
    }

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
  }

  // 监控页面可见性变化
  if ('document' in window && 'visibilityState' in document) {
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') {
        // 页面隐藏时记录会话信息
        captureError(
          'Page hidden',
          {
            component: 'global-handler',
            action: 'page_visibility_change',
            additionalData: {
              visibilityState: document.visibilityState,
              sessionDuration: Date.now() - (window as any).sessionStartTime,
            }
          },
          'info'
        )
      }
    })
  }

  // 记录会话开始时间
  ;(window as any).sessionStartTime = Date.now()

  // 监控内存使用情况（如果支持）
  if ('memory' in performance) {
    const checkMemoryUsage = () => {
      const memory = (performance as any).memory
      const memoryUsage = {
        used: memory.usedJSHeapSize,
        total: memory.totalJSHeapSize,
        limit: memory.jsHeapSizeLimit,
      }

      // 如果内存使用超过80%，记录警告
      const usagePercentage = (memoryUsage.used / memoryUsage.limit) * 100
      if (usagePercentage > 80) {
        capturePerformanceIssue(
          'memory_usage',
          usagePercentage,
          80,
          {
            component: 'global-handler',
            additionalData: memoryUsage
          }
        )
      }
    }

    // 每30秒检查一次内存使用情况
    setInterval(checkMemoryUsage, 30000)
  }

  // 监控页面加载性能
  window.addEventListener('load', () => {
    setTimeout(() => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
      
      if (navigation) {
        const loadTime = navigation.loadEventEnd - navigation.fetchStart
        const domContentLoadedTime = navigation.domContentLoadedEventEnd - navigation.fetchStart
        
        // 如果页面加载时间超过5秒，记录性能问题
        if (loadTime > 5000) {
          capturePerformanceIssue(
            'page_load_time',
            loadTime,
            5000,
            {
              component: 'global-handler',
              additionalData: {
                loadTime,
                domContentLoadedTime,
                redirectTime: navigation.redirectEnd - navigation.redirectStart,
                dnsTime: navigation.domainLookupEnd - navigation.domainLookupStart,
                connectTime: navigation.connectEnd - navigation.connectStart,
                requestTime: navigation.responseEnd - navigation.requestStart,
              }
            }
          )
        }
      }
    }, 0)
  })

  console.log('Global error handlers initialized')
}

// 清理函数
export function cleanupGlobalErrorHandlers() {
  // 在实际应用中，你可能需要移除事件监听器
  // 这里只是一个占位符
  console.log('Global error handlers cleaned up')
}
