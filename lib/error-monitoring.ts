import * as Sentry from '@sentry/nextjs'

// 错误类型定义
export interface ErrorContext {
  userId?: string
  sessionId?: string
  userAgent?: string
  url?: string
  component?: string
  action?: string
  additionalData?: Record<string, any>
}

// 错误严重程度
export type ErrorSeverity = 'fatal' | 'error' | 'warning' | 'info' | 'debug'

// 错误监控类
export class ErrorMonitor {
  private static instance: ErrorMonitor
  private isInitialized = false

  private constructor() {}

  public static getInstance(): ErrorMonitor {
    if (!ErrorMonitor.instance) {
      ErrorMonitor.instance = new ErrorMonitor()
    }
    return ErrorMonitor.instance
  }

  // 初始化错误监控
  public initialize(userId?: string) {
    if (this.isInitialized) return

    // 设置用户上下文
    if (userId) {
      Sentry.setUser({ id: userId })
    }

    // 设置全局标签
    Sentry.setTag('app.version', process.env.npm_package_version || '1.0.0')
    Sentry.setTag('app.environment', process.env.NODE_ENV || 'development')

    this.isInitialized = true
  }

  // 记录错误
  public captureError(
    error: Error | string,
    context?: ErrorContext,
    severity: ErrorSeverity = 'error'
  ) {
    // 设置上下文
    if (context) {
      Sentry.withScope((scope) => {
        // 设置用户信息
        if (context.userId) {
          scope.setUser({ id: context.userId })
        }

        // 设置标签
        if (context.component) {
          scope.setTag('component', context.component)
        }
        if (context.action) {
          scope.setTag('action', context.action)
        }

        // 设置上下文数据
        if (context.url) {
          scope.setContext('url', { url: context.url })
        }
        if (context.userAgent) {
          scope.setContext('browser', { userAgent: context.userAgent })
        }
        if (context.additionalData) {
          scope.setContext('additional', context.additionalData)
        }

        // 设置严重程度
        scope.setLevel(severity)

        // 捕获错误
        if (typeof error === 'string') {
          Sentry.captureMessage(error)
        } else {
          Sentry.captureException(error)
        }
      })
    } else {
      // 简单错误捕获
      if (typeof error === 'string') {
        Sentry.captureMessage(error, severity)
      } else {
        Sentry.captureException(error)
      }
    }
  }

  // 记录API错误
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
      additionalData: {
        endpoint,
        method,
        statusCode,
        responseTime,
      },
    }, statusCode && statusCode >= 500 ? 'error' : 'warning')
  }

  // 记录性能问题
  public capturePerformanceIssue(
    metric: string,
    value: number,
    threshold: number,
    context?: ErrorContext
  ) {
    if (value > threshold) {
      this.captureError(
        `Performance issue: ${metric} (${value}) exceeded threshold (${threshold})`,
        {
          ...context,
          component: 'performance',
          action: metric,
          additionalData: {
            metric,
            value,
            threshold,
            exceedBy: value - threshold,
          },
        },
        'warning'
      )
    }
  }

  // 记录用户操作
  public captureUserAction(
    action: string,
    component: string,
    userId?: string,
    additionalData?: Record<string, any>
  ) {
    Sentry.addBreadcrumb({
      message: `User action: ${action}`,
      category: 'user',
      data: {
        component,
        userId,
        ...additionalData,
      },
      level: 'info',
    })
  }

  // 记录业务事件
  public captureBusinessEvent(
    event: string,
    data?: Record<string, any>
  ) {
    Sentry.addBreadcrumb({
      message: `Business event: ${event}`,
      category: 'business',
      data,
      level: 'info',
    })
  }

  // 设置用户上下文
  public setUser(userId: string, email?: string, username?: string) {
    Sentry.setUser({
      id: userId,
      email,
      username,
    })
  }

  // 清除用户上下文
  public clearUser() {
    Sentry.setUser(null)
  }

  // 添加面包屑
  public addBreadcrumb(message: string, category: string, data?: Record<string, any>) {
    Sentry.addBreadcrumb({
      message,
      category,
      data,
      level: 'info',
    })
  }
}

// 导出单例实例
export const errorMonitor = ErrorMonitor.getInstance()

// 便捷函数
export const captureError = (error: Error | string, context?: ErrorContext, severity?: ErrorSeverity) => {
  errorMonitor.captureError(error, context, severity)
}

export const captureApiError = (error: Error | string, endpoint: string, method: string, statusCode?: number, responseTime?: number) => {
  errorMonitor.captureApiError(error, endpoint, method, statusCode, responseTime)
}

export const capturePerformanceIssue = (metric: string, value: number, threshold: number, context?: ErrorContext) => {
  errorMonitor.capturePerformanceIssue(metric, value, threshold, context)
}

export const captureUserAction = (action: string, component: string, userId?: string, additionalData?: Record<string, any>) => {
  errorMonitor.captureUserAction(action, component, userId, additionalData)
}

export const captureBusinessEvent = (event: string, data?: Record<string, any>) => {
  errorMonitor.captureBusinessEvent(event, data)
}
