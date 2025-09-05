'use client'

import { useState, useEffect } from 'react'
import { BarChart3, Users, Eye, Clock, TrendingUp, Activity, Globe, Smartphone } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { analyticsManager } from '@/lib/analytics-manager'

interface AnalyticsDashboardProps {
  className?: string
  showRealTime?: boolean
}

interface DashboardData {
  summary: {
    totalEvents: number
    uniqueUsers: number
    pageViews: number
    averageSessionDuration: number
  }
  userBehavior: {
    deviceBreakdown: Record<string, number>
    browserBreakdown: Record<string, number>
    topPages: Array<{ page: string; views: number }>
  }
  performance: {
    averageLoadTime: number
    averageLCP: number
    averageFID: number
    averageCLS: number
  }
  realTime: {
    currentUsers: number
    eventsLastHour: number
    topCategories: Array<{ category: string; count: number }>
  }
}

export function AnalyticsDashboard({ className, showRealTime = true }: AnalyticsDashboardProps) {
  const [data, setData] = useState<DashboardData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [realTimeData, setRealTimeData] = useState<any>(null)

  useEffect(() => {
    loadDashboardData()
    
    if (showRealTime) {
      // 实时数据更新
      const interval = setInterval(() => {
        updateRealTimeData()
      }, 30000) // 每30秒更新一次

      return () => clearInterval(interval)
    }
  }, [showRealTime])

  const loadDashboardData = async () => {
    try {
      setIsLoading(true)
      
      // 获取本地分析数据
      const userBehavior = analyticsManager.getUserBehaviorData()
      const performance = analyticsManager.getPerformanceMetrics()
      
      // 模拟仪表板数据（在实际应用中应该从API获取）
      const dashboardData: DashboardData = {
        summary: {
          totalEvents: 1250,
          uniqueUsers: 89,
          pageViews: userBehavior.pageViews || 456,
          averageSessionDuration: userBehavior.sessionDuration || 180000,
        },
        userBehavior: {
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
          topPages: [
            { page: '/', views: 123 },
            { page: '/generator', views: 89 },
            { page: '/messages', views: 67 },
          ],
        },
        performance: {
          averageLoadTime: performance.pageLoadTime || 1200,
          averageLCP: performance.largestContentfulPaint || 2100,
          averageFID: performance.firstInputDelay || 45,
          averageCLS: performance.cumulativeLayoutShift || 0.08,
        },
        realTime: {
          currentUsers: 12,
          eventsLastHour: 45,
          topCategories: [
            { category: 'inspirational', count: 15 },
            { category: 'motivational', count: 12 },
            { category: 'wisdom', count: 8 },
          ],
        },
      }
      
      setData(dashboardData)
    } catch (err) {
      setError('Failed to load dashboard data')
      console.error('Dashboard data loading error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const updateRealTimeData = () => {
    // 更新实时数据
    const userBehavior = analyticsManager.getUserBehaviorData()
    setRealTimeData({
      currentSession: {
        duration: userBehavior.sessionDuration,
        pageViews: userBehavior.pageViews,
        fortunesGenerated: userBehavior.fortunesGenerated,
      },
    })
  }

  const formatDuration = (ms: number) => {
    const seconds = Math.floor(ms / 1000)
    const minutes = Math.floor(seconds / 60)
    const hours = Math.floor(minutes / 60)
    
    if (hours > 0) {
      return `${hours}h ${minutes % 60}m`
    } else if (minutes > 0) {
      return `${minutes}m ${seconds % 60}s`
    } else {
      return `${seconds}s`
    }
  }

  const getPerformanceColor = (metric: string, value: number) => {
    switch (metric) {
      case 'loadTime':
        return value < 1000 ? 'text-green-600' : value < 2000 ? 'text-yellow-600' : 'text-red-600'
      case 'lcp':
        return value < 2500 ? 'text-green-600' : value < 4000 ? 'text-yellow-600' : 'text-red-600'
      case 'fid':
        return value < 100 ? 'text-green-600' : value < 300 ? 'text-yellow-600' : 'text-red-600'
      case 'cls':
        return value < 0.1 ? 'text-green-600' : value < 0.25 ? 'text-yellow-600' : 'text-red-600'
      default:
        return 'text-gray-600'
    }
  }

  if (isLoading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Analytics Dashboard
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error || !data) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Analytics Dashboard
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-red-600">
            {error || 'Unable to load data'}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className={className}>
      <div className="mb-6">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <BarChart3 className="w-6 h-6" />
          Analytics Dashboard
        </h2>
        <p className="text-gray-600 mt-1">
          Real-time user behavior and performance insights
        </p>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="realtime">Real-time</TabsTrigger>
        </TabsList>

        {/* 概览标签页 */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-blue-600" />
                  <span className="text-sm text-gray-600">总事件数</span>
                </div>
                <div className="text-2xl font-bold mt-1">
                  {data.summary.totalEvents.toLocaleString()}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-gray-600">独立用户</span>
                </div>
                <div className="text-2xl font-bold mt-1">
                  {data.summary.uniqueUsers}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4 text-purple-600" />
                  <span className="text-sm text-gray-600">页面浏览</span>
                </div>
                <div className="text-2xl font-bold mt-1">
                  {data.summary.pageViews}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-orange-600" />
                  <span className="text-sm text-gray-600">平均会话</span>
                </div>
                <div className="text-2xl font-bold mt-1">
                  {formatDuration(data.summary.averageSessionDuration)}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>热门页面</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {data.userBehavior.topPages.map((page, index) => (
                    <div key={page.page} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{index + 1}</Badge>
                        <span className="font-medium">{page.page}</span>
                      </div>
                      <span className="text-sm text-gray-600">{page.views} 次浏览</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>设备分布</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Object.entries(data.userBehavior.deviceBreakdown).map(([device, percentage]) => (
                    <div key={device} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="capitalize">{device}</span>
                        <span>{percentage}%</span>
                      </div>
                      <Progress value={percentage} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* 用户标签页 */}
        <TabsContent value="users" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Smartphone className="w-5 h-5" />
                  设备类型
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(data.userBehavior.deviceBreakdown).map(([device, percentage]) => (
                    <div key={device} className="flex items-center justify-between">
                      <span className="capitalize font-medium">{device}</span>
                      <div className="flex items-center gap-2">
                        <Progress value={percentage} className="w-20 h-2" />
                        <span className="text-sm text-gray-600 w-10">{percentage}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="w-5 h-5" />
                  浏览器分布
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(data.userBehavior.browserBreakdown).map(([browser, percentage]) => (
                    <div key={browser} className="flex items-center justify-between">
                      <span className="font-medium">{browser}</span>
                      <div className="flex items-center gap-2">
                        <Progress value={percentage} className="w-20 h-2" />
                        <span className="text-sm text-gray-600 w-10">{percentage}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* 性能标签页 */}
        <TabsContent value="performance" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="text-sm text-gray-600 mb-1">页面加载时间</div>
                <div className={`text-2xl font-bold ${getPerformanceColor('loadTime', data.performance.averageLoadTime)}`}>
                  {data.performance.averageLoadTime}ms
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="text-sm text-gray-600 mb-1">LCP</div>
                <div className={`text-2xl font-bold ${getPerformanceColor('lcp', data.performance.averageLCP)}`}>
                  {data.performance.averageLCP}ms
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="text-sm text-gray-600 mb-1">FID</div>
                <div className={`text-2xl font-bold ${getPerformanceColor('fid', data.performance.averageFID)}`}>
                  {data.performance.averageFID}ms
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="text-sm text-gray-600 mb-1">CLS</div>
                <div className={`text-2xl font-bold ${getPerformanceColor('cls', data.performance.averageCLS)}`}>
                  {data.performance.averageCLS.toFixed(3)}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* 实时标签页 */}
        <TabsContent value="realtime" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm text-gray-600">当前在线用户</span>
                </div>
                <div className="text-2xl font-bold mt-1 text-green-600">
                  {data.realTime.currentUsers}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="text-sm text-gray-600 mb-1">过去1小时事件</div>
                <div className="text-2xl font-bold text-blue-600">
                  {data.realTime.eventsLastHour}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="text-sm text-gray-600 mb-1">活跃类别</div>
                <div className="text-2xl font-bold text-purple-600">
                  {data.realTime.topCategories.length}
                </div>
              </CardContent>
            </Card>
          </div>

          {realTimeData && (
            <Card>
              <CardHeader>
                <CardTitle>当前会话</CardTitle>
                <CardDescription>您的实时使用数据</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <div className="text-sm text-gray-600">会话时长</div>
                    <div className="text-lg font-semibold">
                      {formatDuration(realTimeData.currentSession.duration)}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">页面浏览</div>
                    <div className="text-lg font-semibold">
                      {realTimeData.currentSession.pageViews}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">生成饼干</div>
                    <div className="text-lg font-semibold">
                      {realTimeData.currentSession.fortunesGenerated}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
