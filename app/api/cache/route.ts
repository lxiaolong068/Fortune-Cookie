import { NextRequest, NextResponse } from 'next/server'
import { cacheManager, rateLimiters } from '@/lib/redis-cache'
import { CachePerformanceMonitor, CacheWarmupManager, CacheInvalidationManager } from '@/lib/edge-cache'
import { captureApiError, captureUserAction } from '@/lib/error-monitoring'
import { withSignatureValidation, ApiSignatureHelper } from '@/lib/signature-middleware'

// 获取客户端标识符
function getClientIdentifier(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for')
  const ip = forwarded ? forwarded.split(',')[0] : request.ip || 'unknown'
  return ip
}

// 验证管理员权限（现在使用签名验证）
function isAuthorized(request: NextRequest): boolean {
  // 检查签名验证状态
  const { isValidated } = ApiSignatureHelper.getValidationInfo(request)
  if (isValidated) {
    return true // 签名验证通过即可
  }

  // 回退到传统的Bearer token验证（向后兼容）
  const authHeader = request.headers.get('authorization')
  const adminToken = process.env.CACHE_ADMIN_TOKEN

  if (!adminToken) return false

  return authHeader === `Bearer ${adminToken}`
}

// 使用签名验证装饰器
const getHandler = async (request: NextRequest) => {
  try {
    const clientId = getClientIdentifier(request)
    const { searchParams } = new URL(request.url)
    const action = searchParams.get('action') || 'stats'
    
    // 限流检查
    const rateLimitResult = await rateLimiters.api.limit(clientId)
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: 'Rate limit exceeded' },
        { status: 429 }
      )
    }
    
    switch (action) {
      case 'stats': {
        // 获取缓存统计信息
        const cacheStats = await cacheManager.getCacheStats()
        const performanceStats = CachePerformanceMonitor.getStats()
        
        return NextResponse.json({
          cache: cacheStats,
          performance: performanceStats,
          timestamp: new Date().toISOString()
        })
      }
      
      case 'health': {
        // 检查缓存健康状态
        const isConnected = await cacheManager.isConnected()
        
        return NextResponse.json({
          status: isConnected ? 'healthy' : 'unhealthy',
          connected: isConnected,
          timestamp: new Date().toISOString()
        })
      }
      
      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        )
    }
    
  } catch (error) {
    captureApiError(
      error instanceof Error ? error : new Error(String(error)),
      '/api/cache',
      'GET',
      500
    )
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export const GET = withSignatureValidation(getHandler)

const postHandler = async (request: NextRequest) => {
  try {
    const clientId = getClientIdentifier(request)
    
    // 验证管理员权限
    if (!isAuthorized(request)) {
      captureUserAction('unauthorized_cache_access', 'cache_api', clientId)
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }
    
    // 严格限流
    const rateLimitResult = await rateLimiters.strict.limit(clientId)
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: 'Rate limit exceeded' },
        { status: 429 }
      )
    }
    
    const body = await request.json()
    const { action, data } = body
    
    switch (action) {
      case 'warmup': {
        // 缓存预热
        const baseUrl = data?.baseUrl || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
        
        captureUserAction('cache_warmup_initiated', 'cache_api', clientId, { baseUrl })
        
        // 异步执行预热，不阻塞响应
        CacheWarmupManager.warmupCache(baseUrl).catch(error => {
          captureApiError(error, '/api/cache', 'POST:warmup', 500)
        })
        
        return NextResponse.json({
          message: 'Cache warmup initiated',
          timestamp: new Date().toISOString()
        })
      }
      
      case 'invalidate': {
        // 缓存失效
        const pattern = data?.pattern
        if (!pattern) {
          return NextResponse.json(
            { error: 'Pattern is required for invalidation' },
            { status: 400 }
          )
        }
        
        captureUserAction('cache_invalidation', 'cache_api', clientId, { pattern })
        
        const deletedCount = await cacheManager.delPattern(pattern)
        
        // 智能失效相关缓存
        await CacheInvalidationManager.invalidateRelatedCache(pattern)
        
        return NextResponse.json({
          message: 'Cache invalidated',
          pattern,
          deletedCount,
          timestamp: new Date().toISOString()
        })
      }
      
      case 'clear': {
        // 清空所有缓存（危险操作）
        const confirmToken = data?.confirmToken
        if (confirmToken !== 'CONFIRM_CLEAR_ALL_CACHE') {
          return NextResponse.json(
            { error: 'Invalid confirmation token' },
            { status: 400 }
          )
        }
        
        captureUserAction('cache_clear_all', 'cache_api', clientId)
        
        // 清空所有缓存模式
        const patterns = ['fortune:*', 'fortune_list:*', 'analytics:*', 'api:*']
        let totalDeleted = 0
        
        for (const pattern of patterns) {
          const deleted = await cacheManager.delPattern(pattern)
          totalDeleted += deleted
        }
        
        // 重置性能统计
        CachePerformanceMonitor.resetStats()
        
        return NextResponse.json({
          message: 'All cache cleared',
          deletedCount: totalDeleted,
          timestamp: new Date().toISOString()
        })
      }
      
      case 'optimize': {
        // 缓存优化
        captureUserAction('cache_optimization', 'cache_api', clientId)
        
        await cacheManager.cleanup()
        
        return NextResponse.json({
          message: 'Cache optimization completed',
          timestamp: new Date().toISOString()
        })
      }
      
      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        )
    }
    
  } catch (error) {
    captureApiError(
      error instanceof Error ? error : new Error(String(error)),
      '/api/cache',
      'POST',
      500
    )
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export const POST = withSignatureValidation(postHandler)

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Max-Age': '86400',
    },
  })
}
