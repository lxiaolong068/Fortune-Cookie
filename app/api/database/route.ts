import { NextRequest, NextResponse } from 'next/server'
import { DatabaseManager } from '@/lib/database'
import { FortuneService, ApiUsageService, WebVitalService, SessionService } from '@/lib/database-service'
import { withSignatureValidation, ApiSignatureHelper } from '@/lib/signature-middleware'
import { rateLimiters } from '@/lib/redis-cache'
import { captureApiError, captureUserAction } from '@/lib/error-monitoring'

// get/retrieveclient标识符
function getClientIdentifier(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for')
  const ip = forwarded ? forwarded.split(',')[0]?.trim() : request.ip
  return ip || 'unknown'
}

// 验证management员权限
function isAuthorized(request: NextRequest): boolean {
  const { isValidated } = ApiSignatureHelper.getValidationInfo(request)
  if (isValidated && ApiSignatureHelper.hasPermission(request, 'admin')) {
    return true
  }
  
  // 回退到传统验证
  const authHeader = request.headers.get('authorization')
  const adminToken = process.env.DATABASE_ADMIN_TOKEN
  
  if (!adminToken) return false
  
  return authHeader === `Bearer ${adminToken}`
}

const getHandler = async (request: NextRequest) => {
  try {
    const clientId = getClientIdentifier(request)
    const { searchParams } = new URL(request.url)
    const action = searchParams.get('action') || 'health'
    
    // 限流check (only whenRedisavailable)
    if (rateLimiters) {
      const rateLimitResult = await rateLimiters.api.limit(clientId)
      if (!rateLimitResult.success) {
        return NextResponse.json(
          { error: 'Rate limit exceeded' },
          { status: 429 }
        )
      }
    }
    
    switch (action) {
      case 'health': {
        // databaseHealth check
        const isHealthy = await DatabaseManager.healthCheck()
        const stats = DatabaseManager.getStats()
        
        return NextResponse.json({
          status: isHealthy ? 'healthy' : 'unhealthy',
          connected: isHealthy,
          stats,
          timestamp: new Date().toISOString(),
        })
      }
      
      case 'stats': {
        // databasestatisticsinformation
        if (!isAuthorized(request)) {
          return NextResponse.json(
            { error: 'Unauthorized' },
            { status: 401 }
          )
        }
        
        const [fortuneStats, dbStats] = await Promise.all([
          FortuneService.getStats(),
          DatabaseManager.getStats(),
        ])
        
        return NextResponse.json({
          fortune: fortuneStats,
          database: dbStats,
          timestamp: new Date().toISOString(),
        })
      }
      
      case 'analytics': {
        // analyticsdatastatistics
        if (!isAuthorized(request)) {
          return NextResponse.json(
            { error: 'Unauthorized' },
            { status: 401 }
          )
        }
        
        const startDate = searchParams.get('startDate') 
          ? new Date(searchParams.get('startDate')!) 
          : new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // 默认7day(s)前
        
        const endDate = searchParams.get('endDate') 
          ? new Date(searchParams.get('endDate')!) 
          : new Date() // 默认现在
        
        const [apiStats, webVitalStats] = await Promise.all([
          ApiUsageService.getStats({ startDate, endDate }),
          WebVitalService.getStats({ startDate, endDate }),
        ])
        
        return NextResponse.json({
          api: apiStats,
          webVitals: webVitalStats,
          period: {
            startDate: startDate.toISOString(),
            endDate: endDate.toISOString(),
          },
          timestamp: new Date().toISOString(),
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
      '/api/database',
      'GET',
      500
    )
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

const postHandler = async (request: NextRequest) => {
  try {
    const clientId = getClientIdentifier(request)
    
    // 验证management员权限
    if (!isAuthorized(request)) {
      captureUserAction('unauthorized_database_access', 'database_api', clientId)
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }
    
    // Strict rate limiting (only whenRedisavailable)
    if (rateLimiters) {
      const rateLimitResult = await rateLimiters.strict.limit(clientId)
      if (!rateLimitResult.success) {
        return NextResponse.json(
          { error: 'Rate limit exceeded' },
          { status: 429 }
        )
      }
    }
    
    const body = await request.json()
    const { action, data } = body
    
    switch (action) {
      case 'cleanup': {
        // cleanup过期data
        captureUserAction('database_cleanup_initiated', 'database_api', clientId)
        
        const cleanupResults = await Promise.allSettled([
          SessionService.cleanupExpired(),
        ])
        
        const results = cleanupResults.map((result, index) => ({
          operation: ['expired_sessions'][index],
          status: result.status,
          count: result.status === 'fulfilled' ? result.value : 0,
          error: result.status === 'rejected' ? result.reason.message : null,
        }))
        
        return NextResponse.json({
          message: 'Database cleanup completed',
          results,
          timestamp: new Date().toISOString(),
        })
      }
      
      case 'optimize': {
        // databaseoptimization
        captureUserAction('database_optimization', 'database_api', clientId)
        
        // SQLite optimization命令
        try {
          await DatabaseManager.getInstance().$executeRaw`VACUUM`
          await DatabaseManager.getInstance().$executeRaw`ANALYZE`
          
          return NextResponse.json({
            message: 'Database optimization completed',
            timestamp: new Date().toISOString(),
          })
        } catch (error) {
          return NextResponse.json(
            { error: 'Database optimization failed' },
            { status: 500 }
          )
        }
      }
      
      case 'backup': {
        // database备份（简单实现）
        captureUserAction('database_backup_requested', 'database_api', clientId)
        
        // 在实际应用中，这里应该实现真正的备份logic
        return NextResponse.json({
          message: 'Database backup initiated',
          note: 'Backup functionality should be implemented based on deployment environment',
          timestamp: new Date().toISOString(),
        })
      }
      
      case 'reset_stats': {
        // resetdatabasestatistics
        captureUserAction('database_stats_reset', 'database_api', clientId)
        
        DatabaseManager.resetStats()
        
        return NextResponse.json({
          message: 'Database statistics reset',
          timestamp: new Date().toISOString(),
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
      '/api/database',
      'POST',
      500
    )
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export const GET = withSignatureValidation(getHandler)
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
