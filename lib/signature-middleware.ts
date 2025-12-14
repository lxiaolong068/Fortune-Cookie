import { NextRequest, NextResponse } from 'next/server'
import { SignatureValidator } from './api-signature'
import { captureApiError, captureUserAction } from './error-monitoring'

// 需要签名验证的API路径
const SIGNED_API_PATHS = [
  '/api/admin',
  '/api/cache',
  '/api/analytics/dashboard',
] as const

// 权限映射
const PERMISSION_MAP: Record<string, string> = {
  '/api/admin': 'admin',
  '/api/cache': 'cache:manage',
  '/api/analytics/dashboard': 'analytics:read',
} as const

// 签名验证结果接口
export interface SignatureValidationResult {
  success: boolean
  keyId?: string
  error?: string
  statusCode?: number
}

// 签名中间件类
export class SignatureMiddleware {
  // 检查路径是否需要签名验证
  static requiresSignature(pathname: string): boolean {
    return SIGNED_API_PATHS.some(path => pathname.startsWith(path))
  }

  // 验证请求签名
  static async validateSignature(request: NextRequest): Promise<SignatureValidationResult> {
    try {
      const { pathname } = request.nextUrl
      const method = request.method
      
      // 读取请求体
      let body = ''
      if (method !== 'GET' && method !== 'HEAD') {
        try {
          const clonedRequest = request.clone()
          body = await clonedRequest.text()
        } catch {
          // 如果无法读取请求体，使用空字符串
          body = ''
        }
      }

      // 验证签名
      const validationResult = await SignatureValidator.validateRequest(
        method,
        pathname,
        request.headers,
        body
      )

      if (!validationResult.valid) {
        // 记录验证失败
        const clientId = this.getClientIdentifier(request)
        captureUserAction('signature_validation_failed', 'api_security', clientId, {
          path: pathname,
          method,
          error: validationResult.error,
        })

        return {
          success: false,
          error: validationResult.error || 'Signature validation failed',
          statusCode: 401,
        }
      }

      // 检查权限
      const requiredPermission = PERMISSION_MAP[pathname] || 'api:access'
      if (!SignatureValidator.checkPermission(validationResult.keyId!, requiredPermission)) {
        captureUserAction('insufficient_permissions', 'api_security', validationResult.keyId!, {
          path: pathname,
          method,
          requiredPermission,
        })

        return {
          success: false,
          error: 'Insufficient permissions',
          statusCode: 403,
        }
      }

      // 记录成功的验证
      captureUserAction('signature_validation_success', 'api_security', validationResult.keyId!, {
        path: pathname,
        method,
      })

      return {
        success: true,
        keyId: validationResult.keyId,
      }

    } catch (error) {
      captureApiError(
        error instanceof Error ? error : new Error(String(error)),
        request.nextUrl.pathname,
        request.method,
        500
      )

      return {
        success: false,
        error: 'Internal signature validation error',
        statusCode: 500,
      }
    }
  }

  // 创建签名验证失败的响应
  static createErrorResponse(result: SignatureValidationResult): NextResponse {
    const response = NextResponse.json(
      {
        error: result.error || 'Signature validation failed',
        code: 'SIGNATURE_VALIDATION_FAILED',
        timestamp: new Date().toISOString(),
      },
      { status: result.statusCode || 401 }
    )

    // 添加安全头部
    response.headers.set('WWW-Authenticate', 'Signature realm="API"')
    response.headers.set('X-Content-Type-Options', 'nosniff')
    response.headers.set('X-Frame-Options', 'DENY')
    response.headers.set('X-XSS-Protection', '1; mode=block')

    return response
  }

  // 获取客户端标识符
  private static getClientIdentifier(request: NextRequest): string {
    const forwarded = request.headers.get('x-forwarded-for')
    const ip = forwarded ? forwarded.split(',')[0]?.trim() : request.ip
    return ip || 'unknown'
  }
}

// 签名验证装饰器函数
export function withSignatureValidation<C = unknown>(
  handler: (request: NextRequest, context?: C) => Promise<NextResponse>
) {
  return async (request: NextRequest, context?: C): Promise<NextResponse> => {
    // 检查是否需要签名验证
    if (!SignatureMiddleware.requiresSignature(request.nextUrl.pathname)) {
      return handler(request, context)
    }

    // 验证签名
    const validationResult = await SignatureMiddleware.validateSignature(request)
    
    if (!validationResult.success) {
      return SignatureMiddleware.createErrorResponse(validationResult)
    }

    // 将验证信息添加到请求头中，供后续处理使用
    const modifiedRequest = new NextRequest(request, {
      headers: {
        ...Object.fromEntries(request.headers.entries()),
        'X-Validated-Key-Id': validationResult.keyId || '',
        'X-Signature-Validated': 'true',
      },
    })

    return handler(modifiedRequest, context)
  }
}

// API路由签名验证助手
export class ApiSignatureHelper {
  // 从请求中提取验证信息
  static getValidationInfo(request: NextRequest): {
    isValidated: boolean
    keyId?: string
  } {
    const isValidated = request.headers.get('X-Signature-Validated') === 'true'
    const keyId = request.headers.get('X-Validated-Key-Id') || undefined

    return { isValidated, keyId }
  }

  // 验证特定权限
  static hasPermission(request: NextRequest, permission: string): boolean {
    const { isValidated, keyId } = this.getValidationInfo(request)
    
    if (!isValidated || !keyId) {
      return false
    }

    return SignatureValidator.checkPermission(keyId, permission)
  }

  // 创建权限不足的响应
  static createPermissionDeniedResponse(permission: string): NextResponse {
    return NextResponse.json(
      {
        error: `Permission denied. Required permission: ${permission}`,
        code: 'PERMISSION_DENIED',
        timestamp: new Date().toISOString(),
      },
      { status: 403 }
    )
  }
}

// 权限检查装饰器
export function requirePermission(permission: string) {
  return function <C = unknown>(
    handler: (request: NextRequest, context?: C) => Promise<NextResponse>
  ) {
    return async (request: NextRequest, context?: C): Promise<NextResponse> => {
      if (!ApiSignatureHelper.hasPermission(request, permission)) {
        return ApiSignatureHelper.createPermissionDeniedResponse(permission)
      }

      return handler(request, context)
    }
  }
}

// 签名验证状态检查
export function checkSignatureStatus(request: NextRequest): {
  required: boolean
  validated: boolean
  keyId?: string
} {
  const required = SignatureMiddleware.requiresSignature(request.nextUrl.pathname)
  const { isValidated, keyId } = ApiSignatureHelper.getValidationInfo(request)

  return {
    required,
    validated: isValidated,
    keyId,
  }
}
