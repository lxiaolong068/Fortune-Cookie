import { NextRequest, NextResponse } from 'next/server'

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
    
    // In production, fetch real data from Google Analytics, Search Console, etc.
    let data = mockAnalyticsData
    
    // Filter by specific metric if requested
    if (metric) {
      switch (metric) {
        case 'pageviews':
          data = { pageViews: mockAnalyticsData.pageViews } as any
          break
        case 'search':
          data = { searchQueries: mockAnalyticsData.searchQueries } as any
          break
        case 'vitals':
          data = { webVitals: mockAnalyticsData.webVitals } as any
          break
        case 'users':
          data = { userMetrics: mockAnalyticsData.userMetrics } as any
          break
        case 'fortunes':
          data = { fortuneGeneration: mockAnalyticsData.fortuneGeneration } as any
          break
      }
    }
    
    return NextResponse.json({
      data,
      timeframe,
      lastUpdated: new Date().toISOString(),
      status: 'success'
    })
    
  } catch (error) {
    console.error('Analytics dashboard error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch analytics data' },
      { status: 500 }
    )
  }
}

// POST endpoint for custom events
export async function POST(request: NextRequest) {
  try {
    const event = await request.json()
    
    // Validate event data
    if (!event.name || !event.category) {
      return NextResponse.json(
        { error: 'Event name and category are required' },
        { status: 400 }
      )
    }
    
    // In production, send to Google Analytics or other analytics service
    console.log('Custom event:', event)
    
    // Send to Google Analytics 4 if available
    if (typeof gtag !== 'undefined') {
      gtag('event', event.name, {
        event_category: event.category,
        event_label: event.label,
        value: event.value,
        custom_parameter_1: event.customData?.param1,
        custom_parameter_2: event.customData?.param2,
      })
    }
    
    return NextResponse.json({ success: true })
    
  } catch (error) {
    console.error('Custom event error:', error)
    return NextResponse.json(
      { error: 'Failed to track event' },
      { status: 500 }
    )
  }
}
