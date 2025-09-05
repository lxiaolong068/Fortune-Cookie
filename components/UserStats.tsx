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
      inspirational: 'Inspirational',
      motivational: 'Motivational',
      wisdom: 'Wisdom',
      love: 'Love',
      success: 'Success',
      happiness: 'Happiness',
      peace: 'Peace',
      courage: 'Courage',
    }
    return categoryMap[category] || category
  }

  const getStreakBadge = () => {
    if (stats.streakDays >= 30) return { text: 'Monthly streak', color: 'bg-purple-500' }
    if (stats.streakDays >= 7) return { text: 'Weekly streak', color: 'bg-blue-500' }
    if (stats.streakDays >= 3) return { text: 'Streak', color: 'bg-green-500' }
    return { text: 'New', color: 'bg-gray-500' }
  }

  const getEngagementLevel = () => {
    const likeRate = getLikeRate()
    if (likeRate >= 80) return { text: 'Super fan', color: 'text-purple-600' }
    if (likeRate >= 60) return { text: 'Active user', color: 'text-blue-600' }
    if (likeRate >= 40) return { text: 'Regular user', color: 'text-green-600' }
    return { text: 'New user', color: 'text-gray-600' }
  }

  const formatLastVisit = (date: Date) => {
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffDays = Math.floor(diffMs / 86400000)
    
    if (diffDays === 0) return 'Today'
    if (diffDays === 1) return 'Yesterday'
    if (diffDays < 7) return `${diffDays} days ago`
    
    return date.toLocaleDateString('en-US')
  }

  if (isLoading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Usage stats
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
          Usage stats
        </CardTitle>
        <CardDescription>
          Your fortune usage data
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Basic stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-3 bg-orange-50 rounded-lg">
            <div className="text-2xl font-bold text-orange-600">
              {stats.totalGenerated}
            </div>
            <div className="text-xs text-gray-600">Total generated</div>
          </div>
          
          <div className="text-center p-3 bg-red-50 rounded-lg">
            <div className="text-2xl font-bold text-red-600 flex items-center justify-center gap-1">
              <Heart className="w-5 h-5" />
              {stats.totalLiked}
            </div>
            <div className="text-xs text-gray-600">Total likes</div>
          </div>
          
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600 flex items-center justify-center gap-1">
              <Share2 className="w-5 h-5" />
              {stats.totalShared}
            </div>
            <div className="text-xs text-gray-600">Total shares</div>
          </div>
          
          <div className="text-center p-3 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600 flex items-center justify-center gap-1">
              <Calendar className="w-5 h-5" />
              {stats.streakDays}
            </div>
            <div className="text-xs text-gray-600">Streak days</div>
          </div>
        </div>

        {/* User level and badges */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">User level</span>
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

        {/* Engagement */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            Engagement
          </h3>
          
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Like rate</span>
                <span>{getLikeRate()}%</span>
              </div>
              <Progress value={getLikeRate()} className="h-2" />
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Share rate</span>
                <span>{getShareRate()}%</span>
              </div>
              <Progress value={getShareRate()} className="h-2" />
            </div>
          </div>
        </div>

        {/* Preferences */}
        {stats.favoriteCategory && (
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Preferences</h3>
            <div className="p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Favorite category</span>
                <Badge variant="secondary">
                  {getCategoryName(stats.favoriteCategory)}
                </Badge>
              </div>
            </div>
          </div>
        )}

        {/* Visit info */}
        <div className="space-y-2">
          <h3 className="text-sm font-medium">Visit info</h3>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Session count:</span>
              <span className="font-medium">{stats.sessionCount}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Last visit:</span>
              <span className="font-medium">{formatLastVisit(stats.lastVisit)}</span>
            </div>
          </div>
        </div>

        {/* Achievements */}
        {stats.totalGenerated > 0 && (
          <div className="p-3 bg-gradient-to-r from-orange-50 to-red-50 rounded-lg border border-orange-200">
            <div className="text-sm">
              <div className="font-medium text-orange-800 mb-1">
                🎉 Congratulations!
              </div>
              <div className="text-orange-700">
                {stats.totalGenerated >= 100 && "You've generated over 100 fortunes!"}
                {stats.totalGenerated >= 50 && stats.totalGenerated < 100 && "You've generated over 50 fortunes!"}
                {stats.totalGenerated >= 10 && stats.totalGenerated < 50 && "You've generated over 10 fortunes!"}
                {stats.totalGenerated < 10 && 'Keep exploring more fortunes!'}
              </div>
            </div>
          </div>
        )}

        {/* Next goal */}
        {stats.totalGenerated > 0 && (
          <div className="text-center text-sm text-gray-500">
            {stats.totalGenerated < 10 && `Only ${10 - stats.totalGenerated} to unlock the "Beginner Explorer" badge`}
            {stats.totalGenerated >= 10 && stats.totalGenerated < 50 && `Only ${50 - stats.totalGenerated} to unlock the "Intermediate Explorer" badge`}
            {stats.totalGenerated >= 50 && stats.totalGenerated < 100 && `Only ${100 - stats.totalGenerated} to unlock the "Advanced Explorer" badge`}
            {stats.totalGenerated >= 100 && "You're a Fortune Cookie master!"}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
