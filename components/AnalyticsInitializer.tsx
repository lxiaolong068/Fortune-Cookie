'use client'

import { useEffect, useState } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import { analyticsManager } from '@/lib/analytics-manager'
import { sessionManager } from '@/lib/session-manager'
import { captureBusinessEvent } from '@/lib/error-monitoring'

export function AnalyticsInitializer() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    // 初始化分析系统
    initializeAnalytics()
    
    // 跟踪页面浏览
    trackPageView()
    
    // 设置用户偏好监听
    setupPreferencesTracking()
    
    // 设置性能监控
    setupPerformanceTracking()
    
  }, [pathname, searchParams])

  const initializeAnalytics = async () => {
    try {
      // 初始化会话管理器
      await sessionManager.initializeSession()
      
      // 获取用户偏好
      const preferences = sessionManager.getPreferences()
      
      // 检查用户是否同意分析跟踪
      const trackingEnabled = preferences.notifications // 使用通知设置作为跟踪同意的代理
      analyticsManager.setTrackingEnabled(trackingEnabled)
      
      // 跟踪应用启动
      analyticsManager.trackBusinessEvent('app_initialized', {
        pathname,
        userAgent: navigator.userAgent,
        screenResolution: `${screen.width}x${screen.height}`,
        colorDepth: screen.colorDepth,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        language: navigator.language,
      })
      
      captureBusinessEvent('analytics_initialized', {
        trackingEnabled,
        pathname,
        timestamp: new Date().toISOString(),
      })
      
    } catch (error) {
      console.error('Failed to initialize analytics:', error)
    }
  }

  const trackPageView = () => {
    const fullUrl = pathname + (searchParams.toString() ? `?${searchParams.toString()}` : '')
    
    analyticsManager.trackPageView(fullUrl, document.title)
    
    // 跟踪特定页面的业务事件
    switch (pathname) {
      case '/':
        analyticsManager.trackBusinessEvent('homepage_visited')
        break
      case '/generator':
        analyticsManager.trackBusinessEvent('generator_page_visited')
        break
      case '/messages':
        analyticsManager.trackBusinessEvent('messages_page_visited')
        break
      case '/profile':
        analyticsManager.trackBusinessEvent('profile_page_visited')
        break
      case '/tutorial':
        analyticsManager.trackBusinessEvent('tutorial_page_visited')
        break
    }
    
    // 跟踪UTM参数
    const utmSource = searchParams.get('utm_source')
    const utmMedium = searchParams.get('utm_medium')
    const utmCampaign = searchParams.get('utm_campaign')
    
    if (utmSource || utmMedium || utmCampaign) {
      analyticsManager.trackBusinessEvent('utm_tracking', {
        source: utmSource,
        medium: utmMedium,
        campaign: utmCampaign,
        page: pathname,
      })
    }
  }

  const setupPreferencesTracking = () => {
    // 监听用户偏好变化
    const handlePreferencesChange = () => {
      const preferences = sessionManager.getPreferences()
      
      analyticsManager.trackUserBehavior('preferences_updated', {
        theme: preferences.theme,
        language: preferences.language,
        favoriteCategories: preferences.favoriteCategories,
        displayMode: preferences.displayMode,
      })
    }

    // 这里可以添加偏好变化的监听器
    // sessionManager.onPreferencesChange(handlePreferencesChange)
  }

  const setupPerformanceTracking = () => {
    // 跟踪页面性能
    if ('performance' in window && 'PerformanceObserver' in window) {
      // 跟踪资源加载时间
      const resourceObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        entries.forEach((entry) => {
          if (entry.entryType === 'resource') {
            const resourceEntry = entry as PerformanceResourceTiming
            
            // 跟踪慢速资源
            if (resourceEntry.duration > 1000) {
              analyticsManager.trackPerformance('slow_resource', resourceEntry.duration, {
                name: resourceEntry.name,
                type: resourceEntry.initiatorType,
              })
            }
          }
        })
      })
      
      resourceObserver.observe({ entryTypes: ['resource'] })
      
      // 跟踪长任务
      const longTaskObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        entries.forEach((entry) => {
          analyticsManager.trackPerformance('long_task', entry.duration, {
            startTime: entry.startTime,
          })
        })
      })
      
      try {
        longTaskObserver.observe({ entryTypes: ['longtask'] })
      } catch (error) {
        // longtask 可能不被支持
        console.warn('Long task observer not supported:', error)
      }
    }

    // 跟踪内存使用情况
    if ('memory' in performance) {
      const memoryInfo = (performance as any).memory
      analyticsManager.trackPerformance('memory_usage', memoryInfo.usedJSHeapSize, {
        totalJSHeapSize: memoryInfo.totalJSHeapSize,
        jsHeapSizeLimit: memoryInfo.jsHeapSizeLimit,
      })
    }

    // 跟踪网络连接信息
    if ('connection' in navigator) {
      const connection = (navigator as any).connection
      analyticsManager.trackUserBehavior('network_info', {
        effectiveType: connection.effectiveType,
        downlink: connection.downlink,
        rtt: connection.rtt,
        saveData: connection.saveData,
      })
    }
  }

  // 设置错误跟踪
  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      analyticsManager.trackEvent('error', 'javascript', 'error', event.filename, undefined, {
        message: event.message,
        line: event.lineno,
        column: event.colno,
        stack: event.error?.stack,
      })
    }

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      analyticsManager.trackEvent('error', 'promise', 'unhandled_rejection', undefined, undefined, {
        reason: event.reason?.toString(),
        stack: event.reason?.stack,
      })
    }

    window.addEventListener('error', handleError)
    window.addEventListener('unhandledrejection', handleUnhandledRejection)

    return () => {
      window.removeEventListener('error', handleError)
      window.removeEventListener('unhandledrejection', handleUnhandledRejection)
    }
  }, [])

  // 设置用户交互跟踪
  useEffect(() => {
    // 跟踪表单提交
    const handleFormSubmit = (event: Event) => {
      const form = event.target as HTMLFormElement
      const formData = new FormData(form)
      const formFields = Array.from(formData.keys())
      
      analyticsManager.trackUserBehavior('form_submitted', {
        formId: form.id,
        formClass: form.className,
        fieldCount: formFields.length,
        fields: formFields,
      })
    }

    // 跟踪搜索行为
    const handleSearch = (event: Event) => {
      const input = event.target as HTMLInputElement
      if (input.type === 'search' || input.name === 'search' || input.placeholder?.includes('搜索')) {
        analyticsManager.trackUserBehavior('search_performed', {
          query: input.value,
          queryLength: input.value.length,
        })
      }
    }

    document.addEventListener('submit', handleFormSubmit)
    document.addEventListener('input', handleSearch)

    return () => {
      document.removeEventListener('submit', handleFormSubmit)
      document.removeEventListener('input', handleSearch)
    }
  }, [])

  // 设置可见性跟踪
  useEffect(() => {
    let startTime = Date.now()

    const handleVisibilityChange = () => {
      if (document.hidden) {
        const timeSpent = Date.now() - startTime
        analyticsManager.trackUserBehavior('page_time_spent', {
          page: pathname,
          timeSpent,
        })
      } else {
        startTime = Date.now()
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      
      // 页面卸载时记录时间
      const timeSpent = Date.now() - startTime
      analyticsManager.trackUserBehavior('page_time_spent', {
        page: pathname,
        timeSpent,
      })
    }
  }, [pathname])

  return null
}

// 分析同意横幅组件
export function AnalyticsConsentBanner() {
  const [showBanner, setShowBanner] = useState(false)

  useEffect(() => {
    // 检查用户是否已经做出选择
    const hasConsent = localStorage.getItem('analytics_consent')
    if (!hasConsent) {
      setShowBanner(true)
    }
  }, [])

  const handleAccept = () => {
    localStorage.setItem('analytics_consent', 'accepted')
    analyticsManager.setTrackingEnabled(true)
    setShowBanner(false)
    
    analyticsManager.trackUserBehavior('analytics_consent_accepted')
  }

  const handleDecline = () => {
    localStorage.setItem('analytics_consent', 'declined')
    analyticsManager.setTrackingEnabled(false)
    setShowBanner(false)
    
    analyticsManager.trackUserBehavior('analytics_consent_declined')
  }

  if (!showBanner) {
    return null
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 max-w-md mx-auto">
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-4">
        <h3 className="font-semibold text-sm mb-2">数据收集同意</h3>
        <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">
          我们使用分析工具来改善用户体验。您的数据将被匿名处理，不会用于其他目的。
        </p>
        <div className="flex gap-2">
          <button
            onClick={handleAccept}
            className="flex-1 bg-orange-500 text-white text-xs py-2 px-3 rounded hover:bg-orange-600 transition-colors"
          >
            同意
          </button>
          <button
            onClick={handleDecline}
            className="flex-1 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-xs py-2 px-3 rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          >
            拒绝
          </button>
        </div>
      </div>
    </div>
  )
}
