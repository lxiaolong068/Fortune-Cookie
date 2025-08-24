import { Metadata } from 'next'
import { User, Clock, Settings, BarChart3 } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { SEO } from '@/components/SEO'
import { UserHistory } from '@/components/UserHistory'
import { UserPreferences } from '@/components/UserPreferences'
import { UserStats } from '@/components/UserStats'

export const metadata: Metadata = {
  title: '个人中心 - Fortune Cookie AI',
  description: '管理您的幸运饼干历史记录、偏好设置和使用统计。',
  keywords: [
    '个人中心',
    '用户设置',
    '历史记录',
    '偏好设置',
    '使用统计',
    '幸运饼干',
    'Fortune Cookie AI'
  ],
  openGraph: {
    title: '个人中心 - Fortune Cookie AI',
    description: '管理您的幸运饼干历史记录、偏好设置和使用统计。',
    type: 'website',
    url: 'https://fortune-cookie-ai.vercel.app/profile',
  },
  alternates: {
    canonical: '/profile',
  },
}

export default function ProfilePage() {
  return (
    <>
      <SEO
        title="个人中心 - Fortune Cookie AI"
        description="管理您的幸运饼干历史记录、偏好设置和使用统计。个性化您的幸运饼干体验。"
        canonical="/profile"
        openGraph={{
          title: '个人中心 - Fortune Cookie AI',
          description: '管理您的幸运饼干历史记录、偏好设置和使用统计。',
          type: 'website',
          url: 'https://fortune-cookie-ai.vercel.app/profile',
        }}
      />

      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50">
        <div className="container mx-auto px-4 py-8">
          {/* 页面标题 */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 rounded-full mb-4">
              <User className="w-8 h-8 text-orange-600" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              个人中心
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              管理您的幸运饼干历史记录、偏好设置和使用统计
            </p>
          </div>

          {/* 主要内容 */}
          <div className="max-w-6xl mx-auto">
            <Tabs defaultValue="history" className="space-y-6">
              <TabsList className="grid w-full grid-cols-3 lg:w-96 mx-auto">
                <TabsTrigger value="history" className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span className="hidden sm:inline">历史记录</span>
                </TabsTrigger>
                <TabsTrigger value="stats" className="flex items-center gap-2">
                  <BarChart3 className="w-4 h-4" />
                  <span className="hidden sm:inline">使用统计</span>
                </TabsTrigger>
                <TabsTrigger value="settings" className="flex items-center gap-2">
                  <Settings className="w-4 h-4" />
                  <span className="hidden sm:inline">偏好设置</span>
                </TabsTrigger>
              </TabsList>

              {/* 历史记录标签页 */}
              <TabsContent value="history" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2">
                    <UserHistory showControls={true} />
                  </div>
                  <div className="space-y-6">
                    <UserStats />
                  </div>
                </div>
              </TabsContent>

              {/* 使用统计标签页 */}
              <TabsContent value="stats" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <UserStats />
                  <Card>
                    <CardHeader>
                      <CardTitle>使用趋势</CardTitle>
                      <CardDescription>
                        您的幸运饼干使用趋势分析
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center py-8 text-gray-500">
                        <BarChart3 className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                        <p>趋势图表功能即将推出</p>
                        <p className="text-sm">敬请期待更详细的数据分析</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* 偏好设置标签页 */}
              <TabsContent value="settings" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <UserPreferences />
                  <div className="space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>账户信息</CardTitle>
                        <CardDescription>
                          您的账户基本信息
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">用户类型:</span>
                            <span className="text-sm font-medium">访客用户</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">数据存储:</span>
                            <span className="text-sm font-medium">本地存储</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">隐私模式:</span>
                            <span className="text-sm font-medium">已启用</span>
                          </div>
                        </div>
                        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                          <p className="text-sm text-blue-800">
                            <strong>隐私保护:</strong> 您的所有数据都存储在本地浏览器中，
                            我们不会收集或存储您的个人信息。
                          </p>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>数据管理</CardTitle>
                        <CardDescription>
                          管理您的本地数据
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="text-sm text-gray-600">
                            您可以随时导出或清除您的数据。所有操作都在本地进行，
                            不会影响服务器端的任何数据。
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* 底部提示 */}
          <div className="mt-12 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-orange-200">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-600">
                数据实时同步到本地存储
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
