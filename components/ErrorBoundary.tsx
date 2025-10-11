'use client'

import React, { Component, ErrorInfo, ReactNode } from 'react'

import { AlertTriangle, RefreshCw, Home } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ErrorMonitor } from '@/lib/error-monitoring'

interface Props {
  children: ReactNode
  fallback?: ReactNode
  onError?: (error: Error, errorInfo: ErrorInfo) => void
  componentName?: string
  resetKeys?: Array<string | number>
}

interface State {
  hasError: boolean
  error?: Error
  errorId?: string
  errorCount: number
}

export class ErrorBoundary extends Component<Props, State> {
  private errorMonitor: ErrorMonitor
  private resetTimeout: NodeJS.Timeout | null = null

  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, errorCount: 0 }
    this.errorMonitor = ErrorMonitor.getInstance()
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    const { onError, componentName } = this.props
    const { errorCount } = this.state

    // Generate error ID
    const errorId = `ERR-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

    // Update error count
    this.setState((prevState) => ({
      errorId,
      errorCount: prevState.errorCount + 1,
    }))

    // Log error to monitoring system
    this.errorMonitor.captureError(error, {
      component: componentName || 'ErrorBoundary',
      action: 'componentDidCatch',
      additionalData: {
        componentStack: errorInfo.componentStack,
        errorCount: errorCount + 1,
        errorId,
      },
    }, 'error')

    // Call custom error handler if provided
    if (onError) {
      onError(error, errorInfo)
    }

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('ErrorBoundary caught an error:', error, errorInfo)
    }
  }

  componentDidUpdate(prevProps: Props) {
    const { resetKeys } = this.props
    const { hasError, errorCount } = this.state

    // Reset error boundary if resetKeys change
    if (hasError && resetKeys && prevProps.resetKeys) {
      const hasResetKeyChanged = resetKeys.some(
        (key, index) => key !== prevProps.resetKeys![index]
      )

      if (hasResetKeyChanged && errorCount < 5) {
        this.resetErrorBoundary()
      }
    }
  }

  componentWillUnmount() {
    if (this.resetTimeout) {
      clearTimeout(this.resetTimeout)
    }
  }

  resetErrorBoundary = () => {
    const { errorCount } = this.state

    // Prevent infinite error loops
    if (errorCount >= 5) {
      console.error('ErrorBoundary: Too many errors, not resetting')
      return
    }

    this.setState({
      hasError: false,
      error: undefined,
      errorId: undefined,
    })
  }

  handleRetry = () => {
    const { errorCount } = this.state

    // Exponential backoff for retries
    const delay = Math.min(1000 * Math.pow(2, errorCount), 10000)

    this.errorMonitor.captureUserAction(
      'retry',
      this.props.componentName || 'ErrorBoundary',
      undefined,
      { errorCount, delay }
    )

    // Reset after delay
    this.resetTimeout = setTimeout(() => {
      this.resetErrorBoundary()
    }, delay)
  }

  handleGoHome = () => {
    this.errorMonitor.captureUserAction(
      'goHome',
      this.props.componentName || 'ErrorBoundary'
    )
    window.location.href = '/'
  }

  render() {
    const { hasError, error, errorId, errorCount } = this.state
    const { children, fallback, componentName } = this.props

    if (hasError) {
      // Custom fallback UI
      if (fallback) {
        return fallback
      }

      // Default error UI
      return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-orange-50 to-red-50">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <CardTitle className="text-xl font-bold text-gray-900">
                Oops! Something went wrong
              </CardTitle>
              <CardDescription className="text-gray-600">
                {componentName
                  ? `We encountered an error in the ${componentName} component.`
                  : 'We encountered an unexpected error. We\'ve logged this issue and will fix it soon.'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Error Details (Development Only) */}
              {process.env.NODE_ENV === 'development' && error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-sm font-medium text-red-800 mb-1">Error Details:</p>
                  <p className="text-xs text-red-700 font-mono">
                    {error.message}
                  </p>
                </div>
              )}

              {/* Error ID */}
              {errorId && (
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
                  <p className="text-sm font-medium text-blue-800 mb-1">Error ID:</p>
                  <p className="text-xs text-blue-700 font-mono">
                    {errorId}
                  </p>
                  <p className="text-xs text-blue-600 mt-1">
                    Please provide this error ID if you need technical support
                  </p>
                </div>
              )}

              {/* Error Count Warning */}
              {errorCount >= 3 && (
                <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                  <p className="text-sm text-yellow-800">
                    ⚠️ Multiple errors detected ({errorCount}/5).
                    If the problem persists, please refresh the page or contact support.
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-2">
                {errorCount < 5 ? (
                  <Button
                    onClick={this.handleRetry}
                    className="flex-1 flex items-center justify-center gap-2"
                    variant="default"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Try Again
                  </Button>
                ) : (
                  <Button
                    onClick={this.handleGoHome}
                    className="flex-1 flex items-center justify-center gap-2"
                    variant="default"
                  >
                    <Home className="w-4 h-4" />
                    Go to Homepage
                  </Button>
                )}

                <Button
                  onClick={this.handleGoHome}
                  className="flex-1 flex items-center justify-center gap-2"
                  variant="outline"
                >
                  <Home className="w-4 h-4" />
                  Back to Home
                </Button>
              </div>

              {/* Help Text */}
              <div className="text-center">
                <p className="text-xs text-gray-500">
                  If this problem continues, please try refreshing the page or clearing your browser cache.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      )
    }

    return children
  }
}

/**
 * Higher-Order Component wrapper for ErrorBoundary
 *
 * @example
 * ```tsx
 * const SafeComponent = withErrorBoundary(MyComponent, {
 *   componentName: 'MyComponent',
 *   onError: (error, errorInfo) => console.error(error)
 * })
 * ```
 */
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  errorBoundaryProps?: Omit<Props, 'children'>
) {
  const WrappedComponent = (props: P) => (
    <ErrorBoundary {...errorBoundaryProps}>
      <Component {...props} />
    </ErrorBoundary>
  )

  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`

  return WrappedComponent
}

/**
 * Simplified Error Boundary component with minimal UI
 *
 * @example
 * ```tsx
 * <SimpleErrorBoundary message="Failed to load content">
 *   <MyComponent />
 * </SimpleErrorBoundary>
 * ```
 */
export function SimpleErrorBoundary({
  children,
  message = "An error occurred"
}: {
  children: ReactNode
  message?: string
}) {
  return (
    <ErrorBoundary
      fallback={
        <div className="p-4 text-center">
          <p className="text-red-600 mb-2">{message}</p>
          <Button onClick={() => window.location.reload()} size="sm">
            Refresh Page
          </Button>
        </div>
      }
    >
      {children}
    </ErrorBoundary>
  )
}

/**
 * Functional wrapper for ErrorBoundary with hooks support
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   return (
 *     <ErrorBoundaryWrapper componentName="MyComponent">
 *       <SomeComponent />
 *     </ErrorBoundaryWrapper>
 *   )
 * }
 * ```
 */
export function ErrorBoundaryWrapper({
  children,
  componentName,
  fallback,
  onError,
}: {
  children: ReactNode
  componentName?: string
  fallback?: ReactNode
  onError?: (error: Error, errorInfo: ErrorInfo) => void
}) {
  return (
    <ErrorBoundary
      componentName={componentName}
      fallback={fallback}
      onError={onError}
    >
      {children}
    </ErrorBoundary>
  )
}

export default ErrorBoundary
