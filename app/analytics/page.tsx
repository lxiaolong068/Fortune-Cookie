import { Metadata } from 'next'
import { BarChart3, TrendingUp, Users, Activity } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { SEO } from '@/components/SEO'
import { AnalyticsDashboard } from '@/components/AnalyticsDashboard'

export const metadata: Metadata = {
  title: '数据分析 - Fortune Cookie AI',
  description: '查看详细的用户行为分析、性能指标和业务数据。了解用户如何使用 Fortune Cookie AI。',
  robots: 'noindex, nofollow', // 分析页面不需要被搜索引擎索引
}

export default function AnalyticsPage() {
  return (
    <>
      <SEO
        title="数据分析 - Fortune Cookie AI"
        description="查看详细的用户行为分析、性能指标和业务数据。了解用户如何使用Fortune Cookie AI。"
        canonical="/analytics"
        noIndex={true} // 分析页面不需要被索引
      />

      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="container mx-auto px-4 py-8">
          {/* 页面标题 */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full mb-4">
              <BarChart3 className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              数据分析中心
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              深入了解用户行为、性能指标和业务数据，优化用户体验
            </p>
          </div>

          {/* 快速统计卡片 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100 text-sm font-medium">实时用户</p>
                    <p className="text-3xl font-bold">12</p>
                  </div>
                  <Users className="w-8 h-8 text-blue-200" />
                </div>
                <div className="mt-4 flex items-center">
                  <TrendingUp className="w-4 h-4 text-blue-200 mr-1" />
                  <span className="text-blue-100 text-sm">+5% 比昨天</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-100 text-sm font-medium">今日访问</p>
                    <p className="text-3xl font-bold">1,234</p>
                  </div>
                  <Activity className="w-8 h-8 text-green-200" />
                </div>
                <div className="mt-4 flex items-center">
                  <TrendingUp className="w-4 h-4 text-green-200 mr-1" />
                  <span className="text-green-100 text-sm">+12% 比昨天</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-100 text-sm font-medium">生成总数</p>
                    <p className="text-3xl font-bold">5,678</p>
                  </div>
                  <BarChart3 className="w-8 h-8 text-purple-200" />
                </div>
                <div className="mt-4 flex items-center">
                  <TrendingUp className="w-4 h-4 text-purple-200 mr-1" />
                  <span className="text-purple-100 text-sm">+8% 比昨天</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-orange-100 text-sm font-medium">平均会话</p>
                    <p className="text-3xl font-bold">3m 24s</p>
                  </div>
                  <Activity className="w-8 h-8 text-orange-200" />
                </div>
                <div className="mt-4 flex items-center">
                  <TrendingUp className="w-4 h-4 text-orange-200 mr-1" />
                  <span className="text-orange-100 text-sm">+15% 比昨天</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 主要分析仪表板 */}
          <AnalyticsDashboard showRealTime={true} />

          {/* 数据说明 */}
          <div className="mt-12">
            <Card>
              <CardHeader>
                <CardTitle>数据说明</CardTitle>
                <CardDescription>
                  关于我们如何收集和使用分析数据的说明
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                      数据收集
                    </h3>
                    <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                      <li>• 页面浏览和用户交互</li>
                      <li>• 性能指标和加载时间</li>
                      <li>• 设备和浏览器信息</li>
                      <li>• 用户偏好和设置</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                      隐私保护
                    </h3>
                    <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                      <li>• 所有数据匿名处理</li>
                      <li>• 不收集个人身份信息</li>
                      <li>• 数据仅用于改善用户体验</li>
                      <li>• 用户可随时选择退出</li>
                    </ul>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span>数据实时更新，最后更新时间: {new Date().toLocaleString('zh-CN')}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 技术信息 */}
          <div className="mt-8">
            <Card>
              <CardHeader>
                <CardTitle>技术信息</CardTitle>
                <CardDescription>
                  分析系统的技术实现和功能特性
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">
                      实时跟踪
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      使用现代浏览器API实时收集用户行为和性能数据
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">
                      性能监控
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      监控Core Web Vitals和关键性能指标，确保最佳用户体验
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">
                      业务洞察
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      提供深入的业务指标分析，帮助优化产品功能和用户体验
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  )
}
