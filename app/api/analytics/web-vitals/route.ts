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

export async function POST(request: NextRequest) {
  try {
    const metric: WebVitalMetric = await request.json()
    
    // Validate the metric
    if (!metric.name || !metric.value || !metric.id) {
      return NextResponse.json(
        { error: 'Invalid metric data' },
        { status: 400 }
      )
    }

    // Store the metric (in production, save to database)
    metricsStore.push({
      ...metric,
      timestamp: Date.now(),
      userAgent: request.headers.get('user-agent') || '',
      url: request.headers.get('referer') || '',
    } as any)

    // Log performance issues
    const thresholds = {
      CLS: { good: 0.1, poor: 0.25 },
      INP: { good: 200, poor: 500 },
      FCP: { good: 1800, poor: 3000 },
      LCP: { good: 2500, poor: 4000 },
      TTFB: { good: 800, poor: 1800 },
    }

    const threshold = thresholds[metric.name]
    if (threshold) {
      if (metric.value > threshold.poor) {
        console.warn(`Poor ${metric.name}: ${metric.value}`)
      } else if (metric.value > threshold.good) {
        console.log(`Needs improvement ${metric.name}: ${metric.value}`)
      }
    }

    return NextResponse.json({ success: true })
    
  } catch (error) {
    console.error('Web Vitals API error:', error)
    return NextResponse.json(
      { error: 'Failed to process metric' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const metric = searchParams.get('metric')
    const limit = parseInt(searchParams.get('limit') || '100')
    
    let results = metricsStore
    
    if (metric) {
      results = results.filter(m => m.name === metric)
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

    return NextResponse.json({
      metrics: results,
      averages,
      total: results.length
    })
    
  } catch (error) {
    console.error('Web Vitals GET error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch metrics' },
      { status: 500 }
    )
  }
}
