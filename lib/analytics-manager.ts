// 增强分析系统
// 用户行为跟踪、性能分析和业务指标收集

import { captureUserAction, captureBusinessEvent } from './error-monitoring'

export interface AnalyticsEvent {
  id: string
  type: 'user_action' | 'business_event' | 'performance' | 'error'
  category: string
  action: string
  label?: string
  value?: number
  userId?: string
  sessionId?: string
  timestamp: Date
  metadata: Record<string, any>
}

export interface UserBehaviorData {
  pageViews: number
  sessionDuration: number
  fortunesGenerated: number
  fortunesLiked: number
  fortunesShared: number
  categoriesUsed: string[]
  deviceType: string
  browserType: string
  referrer?: string
  exitPage?: string
}

export interface PerformanceMetrics {
  pageLoadTime: number
  firstContentfulPaint: number
  largestContentfulPaint: number
  firstInputDelay: number
  cumulativeLayoutShift: number
  timeToInteractive: number
  apiResponseTimes: Record<string, number[]>
  errorRate: number
}

export interface BusinessMetrics {
  dailyActiveUsers: number
  weeklyActiveUsers: number
  monthlyActiveUsers: number
  averageSessionDuration: number
  bounceRate: number
  conversionRate: number
  retentionRate: number
  popularCategories: Record<string, number>
  peakUsageHours: number[]
}

export class AnalyticsManager {
  private static instance: AnalyticsManager
  private events: AnalyticsEvent[] = []
  private sessionStartTime: number = Date.now()
  private pageViewCount: number = 0
  private isTrackingEnabled: boolean = true
  private batchSize: number = 10
  private flushInterval: number = 30000 // 30秒

  constructor() {
    if (typeof window !== 'undefined') {
      this.initializeTracking()
    }
  }

  static getInstance(): AnalyticsManager {
    if (!AnalyticsManager.instance) {
      AnalyticsManager.instance = new AnalyticsManager()
    }
    return AnalyticsManager.instance
  }

  // 初始化跟踪
  private initializeTracking(): void {
    // 页面可见性变化跟踪
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.trackEvent('user_action', 'page', 'hidden')
      } else {
        this.trackEvent('user_action', 'page', 'visible')
      }
    })

    // 页面卸载跟踪
    window.addEventListener('beforeunload', () => {
      this.trackSessionEnd()
      this.flush()
    })

    // 定期批量发送事件
    setInterval(() => {
      this.flush()
    }, this.flushInterval)

    // 跟踪页面加载性能
    this.trackPagePerformance()

    // 跟踪用户交互
    this.setupInteractionTracking()
  }

  // 跟踪事件
  trackEvent(
    type: AnalyticsEvent['type'],
    category: string,
    action: string,
    label?: string,
    value?: number,
    metadata: Record<string, any> = {}
  ): void {
    if (!this.isTrackingEnabled) return

    const event: AnalyticsEvent = {
      id: this.generateEventId(),
      type,
      category,
      action,
      label,
      value,
      userId: this.getUserId(),
      sessionId: this.getSessionId(),
      timestamp: new Date(),
      metadata: {
        ...metadata,
        url: window.location.href,
        userAgent: navigator.userAgent,
        viewport: `${window.innerWidth}x${window.innerHeight}`,
        referrer: document.referrer,
      },
    }

    this.events.push(event)

    // 如果事件数量达到批量大小，立即发送
    if (this.events.length >= this.batchSize) {
      this.flush()
    }

    // 同时发送到现有的错误监控系统
    if (type === 'user_action') {
      captureUserAction(action, category, label, metadata)
    } else if (type === 'business_event') {
      captureBusinessEvent(action, metadata)
    }
  }

  // 跟踪页面浏览
  trackPageView(page: string, title?: string): void {
    this.pageViewCount++
    
    this.trackEvent('user_action', 'page', 'view', page, 1, {
      title: title || document.title,
      pageViewCount: this.pageViewCount,
    })
  }

  // 跟踪用户行为
  trackUserBehavior(action: string, data: Record<string, any> = {}): void {
    this.trackEvent('user_action', 'behavior', action, undefined, undefined, data)
  }

  // 跟踪业务事件
  trackBusinessEvent(event: string, data: Record<string, any> = {}): void {
    this.trackEvent('business_event', 'business', event, undefined, undefined, data)
  }

  // 跟踪性能指标
  trackPerformance(metric: string, value: number, metadata: Record<string, any> = {}): void {
    this.trackEvent('performance', 'performance', metric, undefined, value, metadata)
  }

  // 跟踪页面性能
  private trackPagePerformance(): void {
    if ('performance' in window) {
      window.addEventListener('load', () => {
        setTimeout(() => {
          const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
          
          if (navigation) {
            this.trackPerformance('page_load_time', navigation.loadEventEnd - navigation.fetchStart)
            this.trackPerformance('dom_content_loaded', navigation.domContentLoadedEventEnd - navigation.fetchStart)
            this.trackPerformance('first_byte', navigation.responseStart - navigation.fetchStart)
          }

          // Web Vitals
          this.trackWebVitals()
        }, 0)
      })
    }
  }

  // 跟踪Web Vitals
  private trackWebVitals(): void {
    // 使用web-vitals库的数据
    if ('PerformanceObserver' in window) {
      // LCP (Largest Contentful Paint)
      new PerformanceObserver((list) => {
        const entries = list.getEntries()
        const lastEntry = entries[entries.length - 1]
        this.trackPerformance('lcp', lastEntry.startTime)
      }).observe({ entryTypes: ['largest-contentful-paint'] })

      // FID (First Input Delay)
      new PerformanceObserver((list) => {
        const entries = list.getEntries()
        entries.forEach((entry: any) => {
          this.trackPerformance('fid', entry.processingStart - entry.startTime)
        })
      }).observe({ entryTypes: ['first-input'] })

      // CLS (Cumulative Layout Shift)
      let clsValue = 0
      new PerformanceObserver((list) => {
        const entries = list.getEntries()
        entries.forEach((entry: any) => {
          if (!entry.hadRecentInput) {
            clsValue += entry.value
          }
        })
        this.trackPerformance('cls', clsValue)
      }).observe({ entryTypes: ['layout-shift'] })
    }
  }

  // 设置交互跟踪
  private setupInteractionTracking(): void {
    // 点击跟踪
    document.addEventListener('click', (event) => {
      const target = event.target as HTMLElement
      const tagName = target.tagName.toLowerCase()
      const className = target.className
      const id = target.id
      
      this.trackEvent('user_action', 'interaction', 'click', tagName, undefined, {
        className,
        id,
        text: target.textContent?.slice(0, 100),
      })
    })

    // 滚动跟踪
    let scrollDepth = 0
    window.addEventListener('scroll', () => {
      const currentDepth = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100)
      
      if (currentDepth > scrollDepth && currentDepth % 25 === 0) {
        scrollDepth = currentDepth
        this.trackEvent('user_action', 'scroll', 'depth', `${scrollDepth}%`, scrollDepth)
      }
    })

    // 表单交互跟踪
    document.addEventListener('submit', (event) => {
      const form = event.target as HTMLFormElement
      this.trackEvent('user_action', 'form', 'submit', form.id || form.className)
    })

    // 输入框焦点跟踪
    document.addEventListener('focus', (event) => {
      const target = event.target as HTMLElement
      if (target.tagName.toLowerCase() === 'input' || target.tagName.toLowerCase() === 'textarea') {
        this.trackEvent('user_action', 'form', 'focus', target.id || target.className)
      }
    }, true)
  }

  // 跟踪会话结束
  private trackSessionEnd(): void {
    const sessionDuration = Date.now() - this.sessionStartTime
    
    this.trackEvent('user_action', 'session', 'end', undefined, sessionDuration, {
      pageViews: this.pageViewCount,
      duration: sessionDuration,
    })
  }

  // 获取用户行为数据
  getUserBehaviorData(): UserBehaviorData {
    const userEvents = this.events.filter(e => e.type === 'user_action')
    
    return {
      pageViews: this.pageViewCount,
      sessionDuration: Date.now() - this.sessionStartTime,
      fortunesGenerated: userEvents.filter(e => e.action === 'fortune_generated').length,
      fortunesLiked: userEvents.filter(e => e.action === 'fortune_liked').length,
      fortunesShared: userEvents.filter(e => e.action === 'fortune_shared').length,
      categoriesUsed: [...new Set(userEvents
        .filter(e => e.metadata.category)
        .map(e => e.metadata.category))],
      deviceType: this.getDeviceType(),
      browserType: this.getBrowserType(),
      referrer: document.referrer,
    }
  }

  // 获取性能指标
  getPerformanceMetrics(): Partial<PerformanceMetrics> {
    const performanceEvents = this.events.filter(e => e.type === 'performance')
    
    const metrics: Partial<PerformanceMetrics> = {}
    
    performanceEvents.forEach(event => {
      if (event.value !== undefined) {
        switch (event.action) {
          case 'page_load_time':
            metrics.pageLoadTime = event.value
            break
          case 'lcp':
            metrics.largestContentfulPaint = event.value
            break
          case 'fid':
            metrics.firstInputDelay = event.value
            break
          case 'cls':
            metrics.cumulativeLayoutShift = event.value
            break
        }
      }
    })
    
    return metrics
  }

  // 批量发送事件
  private async flush(): Promise<void> {
    if (this.events.length === 0) return

    const eventsToSend = [...this.events]
    this.events = []

    try {
      // 发送到分析端点
      await fetch('/api/analytics', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          events: eventsToSend,
          timestamp: new Date().toISOString(),
        }),
      })
    } catch (error) {
      console.error('Failed to send analytics events:', error)
      // 如果发送失败，将事件放回队列
      this.events.unshift(...eventsToSend)
    }
  }

  // 工具方法
  private generateEventId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  }

  private getUserId(): string {
    return localStorage.getItem('fortune_user_id') || 'anonymous'
  }

  private getSessionId(): string {
    return sessionStorage.getItem('fortune_session_id') || 'unknown'
  }

  private getDeviceType(): string {
    const userAgent = navigator.userAgent
    if (/Mobile|Android|iPhone|iPad/.test(userAgent)) {
      return 'mobile'
    } else if (/Tablet|iPad/.test(userAgent)) {
      return 'tablet'
    }
    return 'desktop'
  }

  private getBrowserType(): string {
    const userAgent = navigator.userAgent
    if (userAgent.includes('Chrome')) return 'Chrome'
    if (userAgent.includes('Firefox')) return 'Firefox'
    if (userAgent.includes('Safari')) return 'Safari'
    if (userAgent.includes('Edge')) return 'Edge'
    return 'Unknown'
  }

  // 启用/禁用跟踪
  setTrackingEnabled(enabled: boolean): void {
    this.isTrackingEnabled = enabled
    
    if (enabled) {
      this.trackEvent('user_action', 'privacy', 'tracking_enabled')
    } else {
      this.trackEvent('user_action', 'privacy', 'tracking_disabled')
      this.flush()
    }
  }

  // 清除所有数据
  clearData(): void {
    this.events = []
    this.trackEvent('user_action', 'privacy', 'data_cleared')
  }

  // 导出分析数据
  exportData(): string {
    const data = {
      events: this.events,
      userBehavior: this.getUserBehaviorData(),
      performance: this.getPerformanceMetrics(),
      exportedAt: new Date().toISOString(),
    }
    
    return JSON.stringify(data, null, 2)
  }
}

// 全局分析管理器实例
export const analyticsManager = AnalyticsManager.getInstance()
