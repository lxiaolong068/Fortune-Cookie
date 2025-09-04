import { Metadata } from 'next'
import { Wifi, Heart } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { OfflineActions } from '@/components/OfflineActions'

export const metadata: Metadata = {
  title: '离线模式 - Fortune Cookie AI',
  description: '您当前处于离线状态，请检查网络连接。',
  robots: 'noindex, nofollow',
}

// 离线时可用的幸运饼干
const OFFLINE_FORTUNES = [
  {
    id: 'offline-1',
    message: '即使在离线状态下，希望也会照亮前路。',
    category: 'inspirational',
    mood: 'positive',
  },
  {
    id: 'offline-2',
    message: '困难只是成功路上的垫脚石。',
    category: 'motivational',
    mood: 'positive',
  },
  {
    id: 'offline-3',
    message: '内心的平静不需要网络连接。',
    category: 'wisdom',
    mood: 'peaceful',
  },
  {
    id: 'offline-4',
    message: '真正的力量来自内心，而非外界。',
    category: 'strength',
    mood: 'empowering',
  },
  {
    id: 'offline-5',
    message: '每一次挫折都是成长的机会。',
    category: 'growth',
    mood: 'positive',
  },
]

export default function OfflinePage() {
  // 随机选择一个离线幸运饼干
  const randomIndex = Math.floor(Math.random() * OFFLINE_FORTUNES.length)
  const randomFortune = OFFLINE_FORTUNES[randomIndex]

  if (!randomFortune) {
    throw new Error('No offline fortunes available')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl space-y-6">
        {/* 主要离线提示卡片 */}
        <Card className="text-center">
          <CardHeader>
            <div className="mx-auto mb-4 w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center">
              <Wifi className="w-8 h-8 text-orange-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">
              离线模式
            </CardTitle>
            <CardDescription className="text-lg text-gray-600">
              您当前处于离线状态，请检查网络连接
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <OfflineActions />
          </CardContent>
        </Card>

        {/* 离线幸运饼干卡片 */}
        <Card className="bg-gradient-to-r from-orange-500 to-red-500 text-white">
          <CardHeader>
            <CardTitle className="text-xl font-bold flex items-center gap-2">
              <span className="text-2xl">🔮</span>
              离线幸运饼干
            </CardTitle>
            <CardDescription className="text-orange-100">
              即使离线，智慧依然与您同在
            </CardDescription>
          </CardHeader>
          <CardContent>
            <blockquote className="text-lg font-medium italic mb-4">
              "{randomFortune.message}"
            </blockquote>
            <div className="flex items-center justify-between text-sm text-orange-100">
              <span>类别: {getCategoryName(randomFortune.category)}</span>
              <span>心情: {getMoodName(randomFortune.mood)}</span>
            </div>
          </CardContent>
        </Card>

        {/* 离线功能说明 */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">离线功能</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <p className="font-medium text-gray-900">缓存的幸运饼干</p>
                  <p className="text-gray-600">查看之前获取的幸运饼干</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <p className="font-medium text-gray-900">离线浏览</p>
                  <p className="text-gray-600">浏览已缓存的页面内容</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <p className="font-medium text-gray-900">生成新内容</p>
                  <p className="text-gray-600">需要网络连接</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <p className="font-medium text-gray-900">分享功能</p>
                  <p className="text-gray-600">需要网络连接</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 网络状态检测 */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-gray-600">网络状态: 离线</span>
              </div>

            </div>
          </CardContent>
        </Card>

        {/* 底部信息 */}
        <div className="text-center text-sm text-gray-500">
          <p className="flex items-center justify-center gap-1">
            Made with <Heart className="w-4 h-4 text-red-500" /> by Fortune Cookie AI
          </p>
          <p className="mt-1">
            离线模式由 Service Worker 提供支持
          </p>
        </div>
      </div>
    </div>
  )
}

// 工具函数：获取类别中文名称
function getCategoryName(category: string): string {
  const categoryMap: Record<string, string> = {
    inspirational: '励志',
    motivational: '激励',
    wisdom: '智慧',
    strength: '力量',
    growth: '成长',
    love: '爱情',
    success: '成功',
    happiness: '快乐',
    peace: '平静',
    courage: '勇气',
  }
  return categoryMap[category] || category
}

// 工具函数：获取心情中文名称
function getMoodName(mood: string): string {
  const moodMap: Record<string, string> = {
    positive: '积极',
    peaceful: '平静',
    empowering: '赋能',
    uplifting: '振奋',
    calming: '平和',
    energetic: '充满活力',
    reflective: '深思',
    hopeful: '充满希望',
  }
  return moodMap[mood] || mood
}
