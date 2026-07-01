"use client"

import { useState, useEffect, useCallback } from 'react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  TrendingUp,
  Users,
  Eye,
  Clock,
  Smartphone,
  Monitor,
  Tablet,
  Zap
} from 'lucide-react'

interface AnalyticsData {
  pageViews: {
    total: number
    today: number
    growth: { daily: number; weekly: number; monthly: number }
  }
  topPages: Array<{ path: string; views: number; title: string }>
  searchQueries: Array<{ 
    query: string
    impressions: number
    clicks: number
    ctr: number
    position: number
  }>
  webVitals: {
    lcp: { value: number; rating: string; trend: number }
    fid: { value: number; rating: string; trend: number }
    cls: { value: number; rating: string; trend: number }
  }
  userMetrics: {
    totalUsers: number
    newUsers: number
    averageSessionDuration: number
    bounceRate: number
  }
  deviceBreakdown: {
    mobile: number
    desktop: number
    tablet: number
  }
  fortuneGeneration: {
    totalGenerated: number
    todayGenerated: number
    byTheme: Record<string, number>
  }
}

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [timeframe, setTimeframe] = useState('30d')

  const fetchAnalyticsData = useCallback(async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/analytics/dashboard?timeframe=${timeframe}`)
      const result = await response.json()
      setData(result.data)
    } catch (error) {
      console.error('Failed to fetch analytics:', error)
    } finally {
      setLoading(false)
    }
  }, [timeframe])

  useEffect(() => {
    fetchAnalyticsData()
  }, [fetchAnalyticsData])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-64 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!data) return <div>Failed to load analytics data</div>

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M'
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K'
    return num.toString()
  }

  const getRatingColor = (rating: string) => {
    switch (rating) {
      case 'good': return 'text-green-600 bg-green-100'
      case 'needs-improvement': return 'text-yellow-600 bg-yellow-100'
      case 'poor': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
            <p className="text-gray-600">Fortune Cookie AI Performance Metrics</p>
          </div>
          <div className="flex gap-2">
            {['7d', '30d', '90d'].map((period) => (
              <Button
                key={period}
                variant={timeframe === period ? 'default' : 'outline'}
                size="sm"
                onClick={() => setTimeframe(period)}
              >
                {period}
              </Button>
            ))}
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Page Views</p>
                <p className="text-2xl font-bold">{formatNumber(data.pageViews.total)}</p>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingUp className="w-4 h-4 text-green-500" />
                  <span className="text-sm text-green-600">+{data.pageViews.growth.daily}%</span>
                </div>
              </div>
              <Eye className="w-8 h-8 text-blue-500" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Users</p>
                <p className="text-2xl font-bold">{formatNumber(data.userMetrics.totalUsers)}</p>
                <div className="flex items-center gap-1 mt-1">
                  <span className="text-sm text-gray-600">
                    {Math.round((data.userMetrics.newUsers / data.userMetrics.totalUsers) * 100)}% new
                  </span>
                </div>
              </div>
              <Users className="w-8 h-8 text-green-500" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Fortunes Generated</p>
                <p className="text-2xl font-bold">{formatNumber(data.fortuneGeneration.totalGenerated)}</p>
                <div className="flex items-center gap-1 mt-1">
                  <span className="text-sm text-gray-600">
                    {data.fortuneGeneration.todayGenerated} today
                  </span>
                </div>
              </div>
              <Zap className="w-8 h-8 text-purple-500" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg. Session</p>
                <p className="text-2xl font-bold">
                  {Math.floor(data.userMetrics.averageSessionDuration / 60)}m {data.userMetrics.averageSessionDuration % 60}s
                </p>
                <div className="flex items-center gap-1 mt-1">
                  <span className="text-sm text-gray-600">
                    {data.userMetrics.bounceRate}% bounce rate
                  </span>
                </div>
              </div>
              <Clock className="w-8 h-8 text-orange-500" />
            </div>
          </Card>
        </div>

        {/* Web Vitals */}
        <Card className="p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Core Web Vitals</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-2">Largest Contentful Paint</p>
              <p className="text-2xl font-bold">{data.webVitals.lcp.value}s</p>
              <Badge className={getRatingColor(data.webVitals.lcp.rating)}>
                {data.webVitals.lcp.rating}
              </Badge>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-2">First Input Delay</p>
              <p className="text-2xl font-bold">{data.webVitals.fid.value}ms</p>
              <Badge className={getRatingColor(data.webVitals.fid.rating)}>
                {data.webVitals.fid.rating}
              </Badge>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-2">Cumulative Layout Shift</p>
              <p className="text-2xl font-bold">{data.webVitals.cls.value}</p>
              <Badge className={getRatingColor(data.webVitals.cls.rating)}>
                {data.webVitals.cls.rating}
              </Badge>
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Top Pages */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Top Pages</h2>
            <div className="space-y-3">
              {data.topPages.slice(0, 8).map((page) => (
                <div key={page.path} className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {page.title}
                    </p>
                    <p className="text-xs text-gray-500">{page.path}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{formatNumber(page.views)}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Search Queries */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Top Search Queries</h2>
            <div className="space-y-3">
              {data.searchQueries.slice(0, 8).map((query) => (
                <div key={query.query} className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {query.query}
                    </p>
                    <p className="text-xs text-gray-500">
                      Position {query.position.toFixed(1)} • CTR {query.ctr.toFixed(1)}%
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{formatNumber(query.impressions)}</p>
                    <p className="text-xs text-gray-500">{formatNumber(query.clicks)} clicks</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Device Breakdown */}
        <Card className="p-6 mt-8">
          <h2 className="text-xl font-semibold mb-4">Device Breakdown</h2>
          <div className="grid grid-cols-3 gap-6">
            <div className="text-center">
              <Smartphone className="w-8 h-8 text-blue-500 mx-auto mb-2" />
              <p className="text-2xl font-bold">{data.deviceBreakdown.mobile}%</p>
              <p className="text-sm text-gray-600">Mobile</p>
            </div>
            <div className="text-center">
              <Monitor className="w-8 h-8 text-green-500 mx-auto mb-2" />
              <p className="text-2xl font-bold">{data.deviceBreakdown.desktop}%</p>
              <p className="text-sm text-gray-600">Desktop</p>
            </div>
            <div className="text-center">
              <Tablet className="w-8 h-8 text-purple-500 mx-auto mb-2" />
              <p className="text-2xl font-bold">{data.deviceBreakdown.tablet}%</p>
              <p className="text-sm text-gray-600">Tablet</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
