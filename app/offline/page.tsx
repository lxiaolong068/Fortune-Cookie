import { Metadata } from 'next'
import { Wifi, Heart } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { OfflineActions } from '@/components/OfflineActions'

export const metadata: Metadata = {
  title: 'Offline Mode - Fortune Cookie AI',
  description: 'You are currently offline. Please check your network connection.',
  robots: 'noindex, nofollow',
}

// 离线时可用的幸运饼干
const OFFLINE_FORTUNES = [
  {
    id: 'offline-1',
    message: 'Even offline, hope lights the way.',
    category: 'inspirational',
    mood: 'positive',
  },
  {
    id: 'offline-2',
    message: 'Obstacles are stepping stones to success.',
    category: 'motivational',
    mood: 'positive',
  },
  {
    id: 'offline-3',
    message: 'Inner peace does not need a connection.',
    category: 'wisdom',
    mood: 'peaceful',
  },
  {
    id: 'offline-4',
    message: 'True strength comes from within, not outside.',
    category: 'strength',
    mood: 'empowering',
  },
  {
    id: 'offline-5',
    message: 'Every setback is a chance to grow.',
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
              Offline Mode
            </CardTitle>
            <CardDescription className="text-lg text-gray-600">
              You are currently offline. Please check your connection
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
              Offline Fortune
            </CardTitle>
            <CardDescription className="text-orange-100">
              Even offline, wisdom is with you
            </CardDescription>
          </CardHeader>
          <CardContent>
            <blockquote className="text-lg font-medium italic mb-4">
              "{randomFortune.message}"
            </blockquote>
            <div className="flex items-center justify-between text-sm text-orange-100">
              <span>Category: {getCategoryName(randomFortune.category)}</span>
              <span>Mood: {getMoodName(randomFortune.mood)}</span>
            </div>
          </CardContent>
        </Card>

        {/* 离线功能说明 */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Offline features</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <p className="font-medium text-gray-900">Cached fortunes</p>
                  <p className="text-gray-600">View fortunes you retrieved before</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <p className="font-medium text-gray-900">Offline browsing</p>
                  <p className="text-gray-600">Browse cached pages</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <p className="font-medium text-gray-900">Generate new content</p>
                  <p className="text-gray-600">Requires a connection</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <p className="font-medium text-gray-900">Sharing</p>
                  <p className="text-gray-600">Requires a connection</p>
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
                <span className="text-sm text-gray-600">Network status: Offline</span>
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
            Offline mode is powered by a Service Worker
          </p>
        </div>
      </div>
    </div>
  )
}

// Helper: get English category label
function getCategoryName(category: string): string {
  const categoryMap: Record<string, string> = {
    inspirational: 'Inspirational',
    motivational: 'Motivational',
    wisdom: 'Wisdom',
    strength: 'Strength',
    growth: 'Growth',
    love: 'Love',
    success: 'Success',
    happiness: 'Happiness',
    peace: 'Peace',
    courage: 'Courage',
  }
  return categoryMap[category] || category
}

// Helper: get English mood label
function getMoodName(mood: string): string {
  const moodMap: Record<string, string> = {
    positive: 'Positive',
    peaceful: 'Peaceful',
    empowering: 'Empowering',
    uplifting: 'Uplifting',
    calming: 'Calming',
    energetic: 'Energetic',
    reflective: 'Reflective',
    hopeful: 'Hopeful',
  }
  return moodMap[mood] || mood
}
