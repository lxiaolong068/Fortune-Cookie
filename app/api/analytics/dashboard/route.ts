import { NextRequest, NextResponse } from 'next/server'

// 安全工具函数
function getCorsOrigin(): string {
  if (process.env.NODE_ENV === 'production') {
    return process.env.NEXT_PUBLIC_APP_URL || 'https://your-domain.com'
  }
  return '*'
}

function addSecurityHeaders(response: NextResponse): NextResponse {
  response.headers.set('Access-Control-Allow-Origin', getCorsOrigin())
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-XSS-Protection', '1; mode=block')
  return response
}

function sanitizeString(input: unknown, maxLength: number = 100): string {
  if (typeof input !== 'string') return ''

  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<[^>]*>/g, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '')
    .trim()
    .slice(0, maxLength)
}

// Mock analytics data (in production, fetch from real analytics services)
const mockAnalyticsData = {
  pageViews: {
    total: 15420,
    today: 342,
    yesterday: 298,
    thisWeek: 2156,
    thisMonth: 8934,
    growth: {
      daily: 14.8,
      weekly: 23.5,
      monthly: 18.2
    }
  },
  topPages: [
    { path: '/', views: 4521, title: 'Fortune Cookie Generator' },
    { path: '/generator', views: 3892, title: 'AI Generator' },
    { path: '/messages', views: 2134, title: 'Fortune Messages' },
    { path: '/funny-fortune-cookie-messages', views: 1876, title: 'Funny Messages' },
    { path: '/who-invented-fortune-cookies', views: 1543, title: 'Who Invented Fortune Cookies' },
    { path: '/how-to-make-fortune-cookies', views: 1298, title: 'How to Make Fortune Cookies' },
    { path: '/history', views: 987, title: 'Fortune Cookie History' },
    { path: '/recipes', views: 765, title: 'Fortune Cookie Recipes' },
    { path: '/browse', views: 654, title: 'Browse Messages' }
  ],
  searchQueries: [
    { query: 'fortune cookie generator', impressions: 12450, clicks: 892, ctr: 7.2, position: 3.4 },
    { query: 'funny fortune cookie messages', impressions: 8934, clicks: 654, ctr: 7.3, position: 4.1 },
    { query: 'who invented fortune cookies', impressions: 7821, clicks: 543, ctr: 6.9, position: 2.8 },
    { query: 'how to make fortune cookies', impressions: 6543, clicks: 432, ctr: 6.6, position: 3.9 },
    { query: 'ai fortune cookie', impressions: 5432, clicks: 387, ctr: 7.1, position: 5.2 },
    { query: 'fortune cookie history', impressions: 4321, clicks: 298, ctr: 6.9, position: 4.7 },
    { query: 'inspirational fortune cookies', impressions: 3876, clicks: 267, ctr: 6.9, position: 6.1 },
    { query: 'fortune cookie recipes', impressions: 3456, clicks: 234, ctr: 6.8, position: 5.8 }
  ],
  webVitals: {
    lcp: { value: 2.1, rating: 'good', trend: -0.3 },
    fid: { value: 85, rating: 'good', trend: -5 },
    cls: { value: 0.08, rating: 'good', trend: -0.01 },
    fcp: { value: 1.6, rating: 'good', trend: -0.2 },
    ttfb: { value: 650, rating: 'good', trend: -50 }
  },
  userMetrics: {
    totalUsers: 8934,
    newUsers: 6721,
    returningUsers: 2213,
    averageSessionDuration: 245, // seconds
    bounceRate: 42.3,
    pagesPerSession: 2.8
  },
  deviceBreakdown: {
    mobile: 58.4,
    desktop: 35.2,
    tablet: 6.4
  },
  topCountries: [
    { country: 'United States', users: 3456, percentage: 38.7 },
    { country: 'United Kingdom', users: 1234, percentage: 13.8 },
    { country: 'Canada', users: 987, percentage: 11.0 },
    { country: 'Australia', users: 765, percentage: 8.6 },
    { country: 'Germany', users: 543, percentage: 6.1 },
    { country: 'France', users: 432, percentage: 4.8 },
    { country: 'Japan', users: 321, percentage: 3.6 },
    { country: 'Other', users: 1196, percentage: 13.4 }
  ],
  fortuneGeneration: {
    totalGenerated: 23456,
    todayGenerated: 567,
    byTheme: {
      inspirational: 8934,
      funny: 6543,
      love: 3456,
      success: 2876,
      wisdom: 1647
    },
    aiVsStatic: {
      ai: 15678,
      static: 7778
    }
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const metric = searchParams.get('metric')
    const timeframe = searchParams.get('timeframe') || '30d'

    // 验证和清理参数
    const validMetrics = ['pageviews', 'search', 'vitals', 'users', 'fortunes']
    const sanitizedMetric = metric ? sanitizeString(metric, 20) : null
    const validTimeframes = ['1d', '7d', '30d', '90d', '1y']
    const sanitizedTimeframe = validTimeframes.includes(timeframe) ? timeframe : '30d'

    // In production, fetch real data from Google Analytics, Search Console, etc.
    let data: unknown = mockAnalyticsData

    // Filter by specific metric if requested
    if (sanitizedMetric && validMetrics.includes(sanitizedMetric)) {
      switch (sanitizedMetric) {
        case 'pageviews':
          data = { pageViews: mockAnalyticsData.pageViews }
          break
        case 'search':
          data = { searchQueries: mockAnalyticsData.searchQueries }
          break
        case 'vitals':
          data = { webVitals: mockAnalyticsData.webVitals }
          break
        case 'users':
          data = { userMetrics: mockAnalyticsData.userMetrics }
          break
        case 'fortunes':
          data = { fortuneGeneration: mockAnalyticsData.fortuneGeneration }
          break
      }
    }

    const response = NextResponse.json({
      data,
      timeframe: sanitizedTimeframe,
      lastUpdated: new Date().toISOString(),
      status: 'success'
    })

    return addSecurityHeaders(response)

  } catch (error) {
    console.error('Analytics dashboard error:', error)
    const response = NextResponse.json(
      { error: 'Failed to fetch analytics data' },
      { status: 500 }
    )
    return addSecurityHeaders(response)
  }
}

// POST endpoint for custom events
export async function POST(request: NextRequest) {
  try {
    let event: Record<string, unknown>

    // 解析和验证请求体
    try {
      event = (await request.json()) as Record<string, unknown>
    } catch {
      const response = NextResponse.json(
        { error: 'Invalid JSON in request body' },
        { status: 400 }
      )
      return addSecurityHeaders(response)
    }

    // 验证和清理事件数据
    if (typeof event.name !== 'string' || typeof event.category !== 'string') {
      const response = NextResponse.json(
        { error: 'Event name and category are required' },
        { status: 400 }
      )
      return addSecurityHeaders(response)
    }

    const customData =
      event.customData && typeof event.customData === 'object' && !Array.isArray(event.customData)
        ? (event.customData as Record<string, unknown>)
        : undefined

    // 清理和验证事件字段
    const sanitizedEvent = {
      name: sanitizeString(event.name, 100),
      category: sanitizeString(event.category, 50),
      label: event.label ? sanitizeString(event.label, 100) : undefined,
      value: typeof event.value === 'number' && event.value >= 0 && event.value <= 999999 ? event.value : undefined,
      customData: customData ? {
        param1: customData.param1 ? sanitizeString(customData.param1, 100) : undefined,
        param2: customData.param2 ? sanitizeString(customData.param2, 100) : undefined,
      } : undefined
    }

    // 验证事件名称和类别的有效性
    const validEventNames = ['fortune_generated', 'page_view', 'search', 'click', 'download', 'share']
    const validCategories = ['engagement', 'conversion', 'navigation', 'error', 'performance']

    if (!validEventNames.includes(sanitizedEvent.name) || !validCategories.includes(sanitizedEvent.category)) {
      const response = NextResponse.json(
        { error: 'Invalid event name or category' },
        { status: 400 }
      )
      return addSecurityHeaders(response)
    }

    // In production, send to Google Analytics or other analytics service
    console.log('Custom event:', sanitizedEvent)

    // Send to Google Analytics 4 if available (在客户端处理，这里只是示例)
    // 实际生产环境中应该使用服务端的Google Analytics Measurement Protocol

    const response = NextResponse.json({ success: true })
    return addSecurityHeaders(response)

  } catch (error) {
    console.error('Custom event error:', error)
    const response = NextResponse.json(
      { error: 'Failed to track event' },
      { status: 500 }
    )
    return addSecurityHeaders(response)
  }
}

// Handle CORS preflight
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': getCorsOrigin(),
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
      'Access-Control-Max-Age': '86400',
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'X-XSS-Protection': '1; mode=block',
    },
  })
}
