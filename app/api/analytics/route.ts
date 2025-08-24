import { NextRequest, NextResponse } from 'next/server'
import { rateLimiters } from '@/lib/redis-cache'
import { captureApiError, captureBusinessEvent } from '@/lib/error-monitoring'
import { EdgeCacheManager } from '@/lib/edge-cache'
import { validateApiSignature } from '@/lib/api-signature'

interface AnalyticsEvent {
  id: string
  type: 'user_action' | 'business_event' | 'performance' | 'error'
  category: string
  action: string
  label?: string
  value?: number
  userId?: string
  sessionId?: string
  timestamp: string
  metadata: Record<string, any>
}

interface AnalyticsRequest {
  events: AnalyticsEvent[]
  timestamp: string
}

// POST - 接收分析事件
export async function POST(request: NextRequest) {
  try {
    // 获取客户端IP地址
    const ip = request.ip ?? request.headers.get('x-forwarded-for') ?? request.headers.get('x-real-ip') ?? '127.0.0.1'
    
    // 速率限制检查
    const rateLimitResult = await rateLimiters.api.limit(ip)
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: 'Rate limit exceeded' },
        { 
          status: 429,
          headers: {
            'X-RateLimit-Limit': rateLimitResult.limit.toString(),
            'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
            'X-RateLimit-Reset': rateLimitResult.reset.toString(),
          }
        }
      )
    }

    // 解析请求体
    const body: AnalyticsRequest = await request.json()
    
    // 验证请求数据
    if (!body.events || !Array.isArray(body.events)) {
      return NextResponse.json(
        { error: 'Invalid request: events array required' },
        { status: 400 }
      )
    }

    // 限制事件数量
    if (body.events.length > 100) {
      return NextResponse.json(
        { error: 'Too many events: maximum 100 events per request' },
        { status: 400 }
      )
    }

    // 处理事件
    const processedEvents = await processAnalyticsEvents(body.events)
    
    // 记录业务事件
    captureBusinessEvent('analytics_events_received', {
      eventCount: body.events.length,
      eventTypes: Array.from(new Set(body.events.map(e => e.type))),
      timestamp: body.timestamp,
    })

    // 返回成功响应
    const response = {
      success: true,
      processed: processedEvents.length,
      timestamp: new Date().toISOString(),
    }

    const jsonResponse = new Response(JSON.stringify(response), {
      headers: {
        'Content-Type': 'application/json',
        'X-RateLimit-Limit': rateLimitResult.limit.toString(),
        'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
        'X-RateLimit-Reset': rateLimitResult.reset.toString(),
      }
    })
    return jsonResponse

  } catch (error) {
    console.error('Analytics API error:', error)
    captureApiError(error as Error, 'analytics', 'POST')
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// GET - 获取分析数据（需要管理员权限）
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const action = searchParams.get('action')
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')

    // 验证管理员权限
    const isAuthorized = await validateAdminAccess(request)
    if (!isAuthorized) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    let data: any = {}

    switch (action) {
      case 'summary':
        data = await getAnalyticsSummary(startDate, endDate)
        break
      case 'user_behavior':
        data = await getUserBehaviorAnalytics(startDate, endDate)
        break
      case 'performance':
        data = await getPerformanceAnalytics(startDate, endDate)
        break
      case 'business_metrics':
        data = await getBusinessMetrics(startDate, endDate)
        break
      default:
        return NextResponse.json(
          { error: 'Invalid action parameter' },
          { status: 400 }
        )
    }

    const response = {
      success: true,
      data,
      timestamp: new Date().toISOString(),
    }
    
    return EdgeCacheManager.optimizeApiResponse(
      response,
      `analytics-${action}-${startDate}-${endDate}`,
      300
    )

  } catch (error) {
    console.error('Analytics GET API error:', error)
    captureApiError(error as Error, 'analytics', 'GET')
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// 处理分析事件
async function processAnalyticsEvents(events: AnalyticsEvent[]): Promise<AnalyticsEvent[]> {
  const processedEvents: AnalyticsEvent[] = []

  for (const event of events) {
    try {
      // 验证事件数据
      if (!isValidEvent(event)) {
        console.warn('Invalid event skipped:', event)
        continue
      }

      // 清理和标准化事件数据
      const cleanedEvent = cleanEvent(event)
      
      // 存储事件（这里可以存储到数据库或其他持久化存储）
      await storeEvent(cleanedEvent)
      
      processedEvents.push(cleanedEvent)
    } catch (error) {
      console.error('Error processing event:', error, event)
    }
  }

  return processedEvents
}

// 验证事件数据
function isValidEvent(event: AnalyticsEvent): boolean {
  return !!(
    event.id &&
    event.type &&
    event.category &&
    event.action &&
    event.timestamp
  )
}

// 清理事件数据
function cleanEvent(event: AnalyticsEvent): AnalyticsEvent {
  return {
    ...event,
    // 清理敏感信息
    metadata: {
      ...event.metadata,
      // 移除可能的敏感数据
      userAgent: event.metadata.userAgent ? 
        event.metadata.userAgent.substring(0, 200) : undefined,
      url: event.metadata.url ? 
        new URL(event.metadata.url).pathname : undefined,
    },
    // 确保时间戳格式正确
    timestamp: new Date(event.timestamp).toISOString(),
  }
}

// 存储事件
async function storeEvent(event: AnalyticsEvent): Promise<void> {
  // 这里可以实现实际的存储逻辑
  // 例如存储到数据库、发送到外部分析服务等
  
  // 暂时只记录到控制台（生产环境中应该移除）
  if (process.env.NODE_ENV === 'development') {
    console.log('Analytics event:', {
      type: event.type,
      category: event.category,
      action: event.action,
      timestamp: event.timestamp,
    })
  }
}

// 验证管理员访问权限
async function validateAdminAccess(request: NextRequest): Promise<boolean> {
  // 检查API签名
  const signatureResult = await validateApiSignature(request)
  if (!signatureResult.valid) {
    return false
  }

  // 检查管理员令牌
  const adminToken = request.headers.get('X-Admin-Token')
  const validAdminToken = process.env.ANALYTICS_ADMIN_TOKEN
  
  return adminToken === validAdminToken
}

// 获取分析摘要
async function getAnalyticsSummary(startDate?: string | null, endDate?: string | null) {
  // 这里应该从实际的数据存储中获取数据
  // 暂时返回模拟数据
  return {
    totalEvents: 1250,
    uniqueUsers: 89,
    pageViews: 456,
    averageSessionDuration: 180000, // 3分钟
    topPages: [
      { page: '/', views: 123 },
      { page: '/generator', views: 89 },
      { page: '/messages', views: 67 },
    ],
    topCategories: [
      { category: 'inspirational', count: 45 },
      { category: 'motivational', count: 32 },
      { category: 'wisdom', count: 28 },
    ],
  }
}

// 获取用户行为分析
async function getUserBehaviorAnalytics(startDate?: string | null, endDate?: string | null) {
  return {
    userJourney: [
      { step: 'landing', users: 100, dropoff: 0 },
      { step: 'generator', users: 85, dropoff: 15 },
      { step: 'result', users: 78, dropoff: 7 },
      { step: 'share', users: 23, dropoff: 55 },
    ],
    deviceBreakdown: {
      desktop: 45,
      mobile: 40,
      tablet: 15,
    },
    browserBreakdown: {
      Chrome: 60,
      Safari: 25,
      Firefox: 10,
      Edge: 5,
    },
  }
}

// 获取性能分析
async function getPerformanceAnalytics(startDate?: string | null, endDate?: string | null) {
  return {
    averageLoadTime: 1200,
    averageLCP: 2100,
    averageFID: 45,
    averageCLS: 0.08,
    slowestPages: [
      { page: '/messages', loadTime: 1800 },
      { page: '/generator', loadTime: 1500 },
    ],
    apiPerformance: {
      '/api/fortune': { average: 850, p95: 1200 },
      '/api/fortunes': { average: 320, p95: 450 },
    },
  }
}

// 获取业务指标
async function getBusinessMetrics(startDate?: string | null, endDate?: string | null) {
  return {
    conversionRate: 0.23, // 23%
    retentionRate: 0.45, // 45%
    averageFortunesPerUser: 3.2,
    mostPopularTime: '14:00-16:00',
    geographicDistribution: {
      'Asia': 60,
      'North America': 25,
      'Europe': 10,
      'Others': 5,
    },
  }
}

// OPTIONS - CORS预检请求
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': process.env.NEXT_PUBLIC_APP_URL || '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Admin-Token',
      'Access-Control-Max-Age': '86400',
    },
  })
}
