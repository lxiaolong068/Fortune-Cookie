'use client'

import { useEffect } from 'react'
import { errorMonitor } from '@/lib/error-monitoring'
import { setupGlobalErrorHandlers } from '@/lib/global-error-handler'

export function ErrorMonitorInitializer() {
  useEffect(() => {
    // 初始化错误监控
    errorMonitor.initialize()
    
    // 设置全局错误处理器
    setupGlobalErrorHandlers()
    
    // 记录应用启动事件
    errorMonitor.captureBusinessEvent('app_initialized', {
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
      referrer: document.referrer,
      screenResolution: `${screen.width}x${screen.height}`,
      viewportSize: `${window.innerWidth}x${window.innerHeight}`,
      colorDepth: screen.colorDepth,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      language: navigator.language,
      cookieEnabled: navigator.cookieEnabled,
      onlineStatus: navigator.onLine,
    })

    // 监控页面卸载
    const handleBeforeUnload = () => {
      errorMonitor.captureBusinessEvent('app_unload', {
        timestamp: new Date().toISOString(),
        sessionDuration: Date.now() - (window as any).sessionStartTime,
      })
    }

    window.addEventListener('beforeunload', handleBeforeUnload)

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [])

  return null
}
