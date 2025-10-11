import { NextRequest, NextResponse } from 'next/server'
import { rateLimiters } from '@/lib/redis-cache'
import { captureApiError, captureBusinessEvent } from '@/lib/error-monitoring'
import { EdgeCacheManager } from '@/lib/edge-cache'
import { createSuccessResponse, createErrorResponse } from '@/types/api'
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

// POST - 接收analyticsevent
export async function POST(request: NextRequest) {
  try {
    // get/retrieveclientIP地址
    const ip = request.ip ?? request.headers.get('x-forwarded-for') ?? request.headers.get('x-real-ip') ?? '127.0.0.1'
    
    // 速率limitcheck (only whenRedisavailable)
    if (rateLimiters) {
      const rateLimitResult = await rateLimiters.api.limit(ip)
      if (!rateLimitResult.success) {
        return NextResponse.json(
          createErrorResponse('Rate limit exceeded'),
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
    }

    // 解析request体
    const body: AnalyticsRequest = await request.json()
    
    // 验证requestdata
    if (!body.events || !Array.isArray(body.events)) {
      return NextResponse.json(
        createErrorResponse('Invalid request: events array required'),
        { status: 400 }
      )
    }

    // limitevent数量
    if (body.events.length > 100) {
      return NextResponse.json(
        createErrorResponse('Too many events: maximum 100 events per request'),
        { status: 400 }
      )
    }

    // 处理event
    const processedEvents = await processAnalyticsEvents(body.events)
    
    // record/log业务event
    captureBusinessEvent('analytics_events_received', {
      eventCount: body.events.length,
      eventTypes: Array.from(new Set(body.events.map(e => e.type))),
      timestamp: body.timestamp,
    })

    // 返回成功response
    const responseData = createSuccessResponse({
      processed: processedEvents.length
    })

    const jsonResponse = new Response(JSON.stringify(responseData), {
      headers: {
        'Content-Type': 'application/json',
      }
    })
    return jsonResponse

  } catch (error) {
    console.error('Analytics API error:', error)
    captureApiError(error as Error, 'analytics', 'POST')
    
    return NextResponse.json(
      createErrorResponse('Internal server error'),
      { status: 500 }
    )
  }
}

// GET - get/retrieveanalyticsdata（need/requiremanagement员权限）
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const action = searchParams.get('action')
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')

    // 验证management员权限
    const isAuthorized = await validateAdminAccess(request)
    if (!isAuthorized) {
      return NextResponse.json(
        createErrorResponse('Unauthorized'),
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
          createErrorResponse('Invalid action parameter'),
          { status: 400 }
        )
    }

    const responseData = createSuccessResponse(data)

    return EdgeCacheManager.optimizeApiResponse(
      responseData,
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

// 处理analyticsevent
async function processAnalyticsEvents(events: AnalyticsEvent[]): Promise<AnalyticsEvent[]> {
  const processedEvents: AnalyticsEvent[] = []

  for (const event of events) {
    try {
      // 验证eventdata
      if (!isValidEvent(event)) {
        console.warn('Invalid event skipped:', event)
        continue
      }

      // cleanup和标准化eventdata
      const cleanedEvent = cleanEvent(event)
      
      // 存储event（这里可以存储到database或其他持久化存储）
      await storeEvent(cleanedEvent)
      
      processedEvents.push(cleanedEvent)
    } catch (error) {
      console.error('Error processing event:', error, event)
    }
  }

  return processedEvents
}

// 验证eventdata
function isValidEvent(event: AnalyticsEvent): boolean {
  return !!(
    event.id &&
    event.type &&
    event.category &&
    event.action &&
    event.timestamp
  )
}

// cleanupeventdata
function cleanEvent(event: AnalyticsEvent): AnalyticsEvent {
  return {
    ...event,
    // cleanup敏感information
    metadata: {
      ...event.metadata,
      // 移除可能的敏感data
      userAgent: event.metadata.userAgent ? 
        event.metadata.userAgent.substring(0, 200) : undefined,
      url: event.metadata.url ? 
        new URL(event.metadata.url).pathname : undefined,
    },
    // 确保时间戳格式正确
    timestamp: new Date(event.timestamp).toISOString(),
  }
}

// 存储event
async function storeEvent(event: AnalyticsEvent): Promise<void> {
  // 这里可以实现实际的存储logic
  // for example存储到database、send到外部analytics服务等
  
  // 暂时只record/log到控制台（生产环境中应该移除）
  if (process.env.NODE_ENV === 'development') {
    console.log('Analytics event:', {
      type: event.type,
      category: event.category,
      action: event.action,
      timestamp: event.timestamp,
    })
  }
}

// 验证management员access权限
async function validateAdminAccess(request: NextRequest): Promise<boolean> {
  // checkAPI签名
  const signatureResult = await validateApiSignature(request)
  if (!signatureResult.valid) {
    return false
  }

  // checkmanagement员令牌
  const adminToken = request.headers.get('X-Admin-Token')
  const validAdminToken = process.env.ANALYTICS_ADMIN_TOKEN
  
  return adminToken === validAdminToken
}

// get/retrieveanalytics摘要
async function getAnalyticsSummary(startDate?: string | null, endDate?: string | null) {
  // 这里应该from实际的data存储中get/retrievedata
  // 暂时返回模拟data
  return {
    totalEvents: 1250,
    uniqueUsers: 89,
    pageViews: 456,
    averageSessionDuration: 180000, // 3minute(s)
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

// get/retrieveuser behavioranalytics
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

// get/retrieveperformanceanalytics
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

// get/retrievebusiness metrics
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

// OPTIONS - CORS预检request
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
