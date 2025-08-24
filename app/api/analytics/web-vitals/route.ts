import { NextRequest, NextResponse } from 'next/server'

interface WebVitalMetric {
  id: string
  name: 'CLS' | 'INP' | 'FCP' | 'LCP' | 'TTFB'
  value: number
  delta: number
  rating: 'good' | 'needs-improvement' | 'poor'
  entries: any[]
  navigationType: string
}

// In-memory storage for demo (use a real database in production)
const metricsStore: WebVitalMetric[] = []

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

function validateMetric(metric: any): boolean {
  const validNames = ['CLS', 'INP', 'FCP', 'LCP', 'TTFB']
  const validRatings = ['good', 'needs-improvement', 'poor']

  return (
    typeof metric.id === 'string' &&
    metric.id.length > 0 &&
    metric.id.length < 100 &&
    validNames.includes(metric.name) &&
    typeof metric.value === 'number' &&
    metric.value >= 0 &&
    metric.value < 100000 && // 合理的上限
    typeof metric.delta === 'number' &&
    validRatings.includes(metric.rating)
  )
}

export async function POST(request: NextRequest) {
  try {
    let metric: any

    // 解析和验证请求体
    try {
      metric = await request.json()
    } catch (error) {
      const response = NextResponse.json(
        { error: 'Invalid JSON in request body' },
        { status: 400 }
      )
      return addSecurityHeaders(response)
    }

    // 全面验证指标数据
    if (!validateMetric(metric)) {
      const response = NextResponse.json(
        { error: 'Invalid metric data. Required fields: id, name, value, delta, rating' },
        { status: 400 }
      )
      return addSecurityHeaders(response)
    }

    // 限制存储的指标数量（防止内存泄漏）
    if (metricsStore.length > 10000) {
      metricsStore.splice(0, 1000) // 移除最旧的1000条记录
    }

    // 安全地获取请求头信息
    const userAgent = request.headers.get('user-agent')?.slice(0, 500) || ''
    const referer = request.headers.get('referer')?.slice(0, 500) || ''

    // Store the metric (in production, save to database)
    metricsStore.push({
      ...metric,
      timestamp: Date.now(),
      userAgent,
      url: referer,
    } as any)

    // Log performance issues
    const thresholds = {
      CLS: { good: 0.1, poor: 0.25 },
      INP: { good: 200, poor: 500 },
      FCP: { good: 1800, poor: 3000 },
      LCP: { good: 2500, poor: 4000 },
      TTFB: { good: 800, poor: 1800 },
    }

    const threshold = thresholds[metric.name as keyof typeof thresholds]
    if (threshold) {
      if (metric.value > threshold.poor) {
        console.warn(`Poor ${metric.name}: ${metric.value}`)
      } else if (metric.value > threshold.good) {
        console.log(`Needs improvement ${metric.name}: ${metric.value}`)
      }
    }

    const response = NextResponse.json({ success: true })
    return addSecurityHeaders(response)

  } catch (error) {
    console.error('Web Vitals API error:', error)
    const response = NextResponse.json(
      { error: 'Failed to process metric' },
      { status: 500 }
    )
    return addSecurityHeaders(response)
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const metric = searchParams.get('metric')
    const limitParam = searchParams.get('limit') || '100'

    // 验证和清理参数
    const validMetrics = ['CLS', 'INP', 'FCP', 'LCP', 'TTFB']
    const sanitizedMetric = metric && validMetrics.includes(metric) ? metric : null

    const limit = Math.min(Math.max(parseInt(limitParam) || 100, 1), 1000) // 限制在1-1000之间

    let results = metricsStore

    if (sanitizedMetric) {
      results = results.filter(m => m.name === sanitizedMetric)
    }

    // Get recent metrics
    results = results
      .sort((a: any, b: any) => b.timestamp - a.timestamp)
      .slice(0, limit)

    // Calculate averages
    const averages = results.reduce((acc, metric) => {
      if (!acc[metric.name]) {
        acc[metric.name] = { total: 0, count: 0, average: 0 }
      }
      acc[metric.name].total += metric.value
      acc[metric.name].count += 1
      acc[metric.name].average = acc[metric.name].total / acc[metric.name].count
      return acc
    }, {} as any)

    const response = NextResponse.json({
      metrics: results,
      averages,
      total: results.length
    })

    return addSecurityHeaders(response)

  } catch (error) {
    console.error('Web Vitals GET error:', error)
    const response = NextResponse.json(
      { error: 'Failed to fetch metrics' },
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
