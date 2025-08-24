'use client'

import { useState, useEffect } from 'react'
import { BarChart3, Heart, Share2, Calendar, Trophy, TrendingUp } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { sessionManager, type UserStats } from '@/lib/session-manager'

interface UserStatsProps {
  className?: string
}

export function UserStats({ className }: UserStatsProps) {
  const [stats, setStats] = useState<UserStats>({
    totalGenerated: 0,
    totalLiked: 0,
    totalShared: 0,
    favoriteCategory: '',
    streakDays: 0,
    lastVisit: new Date(),
    sessionCount: 0,
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = async () => {
    try {
      setIsLoading(true)
      await sessionManager.initializeSession()
      const userStats = sessionManager.getStats()
      setStats(userStats)
    } catch (error) {
      console.error('Failed to load stats:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getLikeRate = () => {
    if (stats.totalGenerated === 0) return 0
    return Math.round((stats.totalLiked / stats.totalGenerated) * 100)
  }

  const getShareRate = () => {
    if (stats.totalGenerated === 0) return 0
    return Math.round((stats.totalShared / stats.totalGenerated) * 100)
  }

  const getCategoryName = (category: string) => {
    const categoryMap: Record<string, string> = {
      inspirational: '励志',
      motivational: '激励',
      wisdom: '智慧',
      love: '爱情',
      success: '成功',
      happiness: '快乐',
      peace: '平静',
      courage: '勇气',
    }
    return categoryMap[category] || category
  }

  const getStreakBadge = () => {
    if (stats.streakDays >= 30) return { text: '月度达人', color: 'bg-purple-500' }
    if (stats.streakDays >= 7) return { text: '周度活跃', color: 'bg-blue-500' }
    if (stats.streakDays >= 3) return { text: '连续访问', color: 'bg-green-500' }
    return { text: '新手', color: 'bg-gray-500' }
  }

  const getEngagementLevel = () => {
    const likeRate = getLikeRate()
    if (likeRate >= 80) return { text: '超级粉丝', color: 'text-purple-600' }
    if (likeRate >= 60) return { text: '活跃用户', color: 'text-blue-600' }
    if (likeRate >= 40) return { text: '普通用户', color: 'text-green-600' }
    return { text: '新用户', color: 'text-gray-600' }
  }

  const formatLastVisit = (date: Date) => {
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffDays = Math.floor(diffMs / 86400000)
    
    if (diffDays === 0) return '今天'
    if (diffDays === 1) return '昨天'
    if (diffDays < 7) return `${diffDays}天前`
    
    return date.toLocaleDateString('zh-CN')
  }

  if (isLoading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            使用统计
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

  const streakBadge = getStreakBadge()
  const engagementLevel = getEngagementLevel()

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="w-5 h-5" />
          使用统计
        </CardTitle>
        <CardDescription>
          您的幸运饼干使用数据
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* 基础统计 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-3 bg-orange-50 rounded-lg">
            <div className="text-2xl font-bold text-orange-600">
              {stats.totalGenerated}
            </div>
            <div className="text-xs text-gray-600">总生成数</div>
          </div>
          
          <div className="text-center p-3 bg-red-50 rounded-lg">
            <div className="text-2xl font-bold text-red-600 flex items-center justify-center gap-1">
              <Heart className="w-5 h-5" />
              {stats.totalLiked}
            </div>
            <div className="text-xs text-gray-600">总点赞数</div>
          </div>
          
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600 flex items-center justify-center gap-1">
              <Share2 className="w-5 h-5" />
              {stats.totalShared}
            </div>
            <div className="text-xs text-gray-600">总分享数</div>
          </div>
          
          <div className="text-center p-3 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600 flex items-center justify-center gap-1">
              <Calendar className="w-5 h-5" />
              {stats.streakDays}
            </div>
            <div className="text-xs text-gray-600">连续天数</div>
          </div>
        </div>

        {/* 用户等级和徽章 */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">用户等级</span>
            <div className="flex items-center gap-2">
              <Badge className={`${streakBadge.color} text-white`}>
                <Trophy className="w-3 h-3 mr-1" />
                {streakBadge.text}
              </Badge>
              <Badge variant="outline" className={engagementLevel.color}>
                {engagementLevel.text}
              </Badge>
            </div>
          </div>
        </div>

        {/* 参与度分析 */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            参与度分析
          </h3>
          
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>点赞率</span>
                <span>{getLikeRate()}%</span>
              </div>
              <Progress value={getLikeRate()} className="h-2" />
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>分享率</span>
                <span>{getShareRate()}%</span>
              </div>
              <Progress value={getShareRate()} className="h-2" />
            </div>
          </div>
        </div>

        {/* 偏好分析 */}
        {stats.favoriteCategory && (
          <div className="space-y-2">
            <h3 className="text-sm font-medium">偏好分析</h3>
            <div className="p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">最喜欢的类别</span>
                <Badge variant="secondary">
                  {getCategoryName(stats.favoriteCategory)}
                </Badge>
              </div>
            </div>
          </div>
        )}

        {/* 访问信息 */}
        <div className="space-y-2">
          <h3 className="text-sm font-medium">访问信息</h3>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">会话次数:</span>
              <span className="font-medium">{stats.sessionCount}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">上次访问:</span>
              <span className="font-medium">{formatLastVisit(stats.lastVisit)}</span>
            </div>
          </div>
        </div>

        {/* 成就提示 */}
        {stats.totalGenerated > 0 && (
          <div className="p-3 bg-gradient-to-r from-orange-50 to-red-50 rounded-lg border border-orange-200">
            <div className="text-sm">
              <div className="font-medium text-orange-800 mb-1">
                🎉 恭喜您！
              </div>
              <div className="text-orange-700">
                {stats.totalGenerated >= 100 && '您已经生成了超过100个幸运饼干！'}
                {stats.totalGenerated >= 50 && stats.totalGenerated < 100 && '您已经生成了超过50个幸运饼干！'}
                {stats.totalGenerated >= 10 && stats.totalGenerated < 50 && '您已经生成了超过10个幸运饼干！'}
                {stats.totalGenerated < 10 && '继续探索更多幸运饼干吧！'}
              </div>
            </div>
          </div>
        )}

        {/* 下一个目标 */}
        {stats.totalGenerated > 0 && (
          <div className="text-center text-sm text-gray-500">
            {stats.totalGenerated < 10 && `还需要 ${10 - stats.totalGenerated} 个就能解锁"初级探索者"徽章`}
            {stats.totalGenerated >= 10 && stats.totalGenerated < 50 && `还需要 ${50 - stats.totalGenerated} 个就能解锁"中级探索者"徽章`}
            {stats.totalGenerated >= 50 && stats.totalGenerated < 100 && `还需要 ${100 - stats.totalGenerated} 个就能解锁"高级探索者"徽章`}
            {stats.totalGenerated >= 100 && '您已经是幸运饼干大师了！'}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
