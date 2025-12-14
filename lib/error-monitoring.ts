// Lightweight error monitoring (Sentry removed)

// 错误类型定义
export interface ErrorContext {
  userId?: string
  sessionId?: string
  userAgent?: string
  url?: string
  component?: string
  action?: string
  additionalData?: Record<string, unknown>
}

// 错误严重程度
export type ErrorSeverity = 'fatal' | 'error' | 'warning' | 'info' | 'debug'

// 轻量错误monitoring（仅控制台输出）
export class ErrorMonitor {
  private static instance: ErrorMonitor
  private isInitialized = false
  private currentUser?: { id: string; email?: string; username?: string }

  private constructor() {}

  public static getInstance(): ErrorMonitor {
    if (!ErrorMonitor.instance) {
      ErrorMonitor.instance = new ErrorMonitor()
    }
    return ErrorMonitor.instance
  }

  // 初始化（可选）
  public initialize(userId?: string) {
    if (this.isInitialized) return
    if (userId) this.currentUser = { id: userId }
    this.isInitialized = true
  }

  // record/log错误
  public captureError(
    error: Error | string,
    context?: ErrorContext,
    severity: ErrorSeverity = 'error'
  ) {
    const payload = {
      severity,
      user: this.currentUser,
      context,
      error: typeof error === 'string' ? { message: error } : { name: error.name, message: error.message, stack: error.stack },
      timestamp: new Date().toISOString(),
    }

    if (severity === 'fatal' || severity === 'error') {
      console.error('[ErrorMonitor]', payload)
    } else if (severity === 'warning') {
      console.warn('[ErrorMonitor]', payload)
    } else {
      console.info('[ErrorMonitor]', payload)
    }
  }

  // record/logAPI错误
  public captureApiError(
    error: Error | string,
    endpoint: string,
    method: string,
    statusCode?: number,
    responseTime?: number
  ) {
    this.captureError(error, {
      component: 'api',
      action: `${method} ${endpoint}`,
      additionalData: { endpoint, method, statusCode, responseTime },
    }, statusCode && statusCode >= 500 ? 'error' : 'warning')
  }

  // record/logperformance问题
  public capturePerformanceIssue(
    metric: string,
    value: number,
    threshold: number,
    context?: ErrorContext
  ) {
    if (value > threshold) {
      this.captureError(
        `Performance issue: ${metric} (${value}) exceeded threshold (${threshold})`,
        { ...context, component: 'performance', action: metric, additionalData: { metric, value, threshold, exceedBy: value - threshold } },
        'warning'
      )
    }
  }

  // record/log用户操作
  public captureUserAction(
    action: string,
    component: string,
    userId?: string,
    additionalData?: Record<string, unknown>
  ) {
    console.info('[ErrorMonitor][Breadcrumb][User]', { action, component, userId, ...additionalData })
  }

  // record/log业务event
  public captureBusinessEvent(
    event: string,
    data?: Record<string, unknown>
  ) {
    console.info('[ErrorMonitor][Breadcrumb][Business]', { event, ...data })
  }

  // setup/configuration/clear用户
  public setUser(userId: string, email?: string, username?: string) {
    this.currentUser = { id: userId, email, username }
  }

  public clearUser() {
    this.currentUser = undefined
  }

  // add面bundle屑（控制台输出）
  public addBreadcrumb(message: string, category: string, data?: Record<string, unknown>) {
    console.info('[ErrorMonitor][Breadcrumb]', { message, category, ...data })
  }
}

// Export singleton instance
export const errorMonitor = ErrorMonitor.getInstance()

// 便捷function
export const captureError = (error: Error | string, context?: ErrorContext, severity?: ErrorSeverity) => {
  errorMonitor.captureError(error, context, severity)
}

export const captureApiError = (error: Error | string, endpoint: string, method: string, statusCode?: number, responseTime?: number) => {
  errorMonitor.captureApiError(error, endpoint, method, statusCode, responseTime)
}

export const capturePerformanceIssue = (metric: string, value: number, threshold: number, context?: ErrorContext) => {
  errorMonitor.capturePerformanceIssue(metric, value, threshold, context)
}

export const captureUserAction = (action: string, component: string, userId?: string, additionalData?: Record<string, unknown>) => {
  errorMonitor.captureUserAction(action, component, userId, additionalData)
}

export const captureBusinessEvent = (event: string, data?: Record<string, unknown>) => {
  errorMonitor.captureBusinessEvent(event, data)
}
