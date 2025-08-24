'use client'

import { useState, useEffect } from 'react'
import { Clock, Heart, Share2, Trash2, Download, Filter, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { sessionManager, type FortuneHistory } from '@/lib/session-manager'
import { captureUserAction } from '@/lib/error-monitoring'

interface UserHistoryProps {
  className?: string
  limit?: number
  showControls?: boolean
}

export function UserHistory({ className, limit, showControls = true }: UserHistoryProps) {
  const [history, setHistory] = useState<FortuneHistory[]>([])
  const [filteredHistory, setFilteredHistory] = useState<FortuneHistory[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')
  const [sourceFilter, setSourceFilter] = useState<string>('all')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadHistory()
  }, [limit])

  useEffect(() => {
    filterHistory()
  }, [history, searchQuery, categoryFilter, sourceFilter])

  const loadHistory = async () => {
    try {
      setIsLoading(true)
      await sessionManager.initializeSession()
      const userHistory = sessionManager.getHistory(limit)
      setHistory(userHistory)
    } catch (error) {
      console.error('Failed to load history:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const filterHistory = () => {
    let filtered = [...history]

    // 搜索过滤
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(item =>
        item.message.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query) ||
        item.tags?.some(tag => tag.toLowerCase().includes(query))
      )
    }

    // 类别过滤
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(item => item.category === categoryFilter)
    }

    // 来源过滤
    if (sourceFilter !== 'all') {
      filtered = filtered.filter(item => item.source === sourceFilter)
    }

    setFilteredHistory(filtered)
  }

  const handleLike = (fortuneId: string) => {
    sessionManager.likeFortuneInHistory(fortuneId)
    loadHistory()
    captureUserAction('fortune_liked_from_history', 'user_history')
  }

  const handleShare = async (fortune: FortuneHistory) => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'Fortune Cookie AI - 幸运饼干',
          text: fortune.message,
          url: window.location.origin,
        })
      } else {
        await navigator.clipboard.writeText(
          `${fortune.message}\n\n来自 Fortune Cookie AI - ${window.location.origin}`
        )
      }
      
      sessionManager.shareFortuneInHistory(fortune.id)
      loadHistory()
      captureUserAction('fortune_shared_from_history', 'user_history')
    } catch (error) {
      console.error('Failed to share fortune:', error)
    }
  }

  const handleClearHistory = () => {
    if (confirm('确定要清除所有历史记录吗？此操作无法撤销。')) {
      sessionManager.clearHistory()
      setHistory([])
      captureUserAction('history_cleared_by_user', 'user_history')
    }
  }

  const handleExportHistory = () => {
    const exportData = sessionManager.exportUserData()
    const blob = new Blob([exportData], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `fortune-history-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    
    captureUserAction('history_exported', 'user_history')
  }

  const getUniqueCategories = () => {
    const categories = Array.from(new Set(history.map(item => item.category)))
    return categories.sort()
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

  const getSourceName = (source: string) => {
    const sourceMap: Record<string, string> = {
      ai: 'AI生成',
      database: '数据库',
      offline: '离线',
    }
    return sourceMap[source] || source
  }

  const formatDate = (date: Date) => {
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return '刚刚'
    if (diffMins < 60) return `${diffMins}分钟前`
    if (diffHours < 24) return `${diffHours}小时前`
    if (diffDays < 7) return `${diffDays}天前`
    
    return date.toLocaleDateString('zh-CN')
  }

  if (isLoading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            历史记录
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

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="w-5 h-5" />
          历史记录
        </CardTitle>
        <CardDescription>
          您的幸运饼干历史记录 ({history.length} 条)
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* 搜索和过滤控件 */}
        {showControls && history.length > 0 && (
          <div className="space-y-3">
            <div className="flex gap-2">
              <div className="flex-1">
                <Input
                  placeholder="搜索历史记录..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full"
                />
              </div>
              <Button variant="outline" size="icon">
                <Search className="w-4 h-4" />
              </Button>
            </div>
            
            <div className="flex gap-2">
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="类别" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">所有类别</SelectItem>
                  {getUniqueCategories().map(category => (
                    <SelectItem key={category} value={category}>
                      {getCategoryName(category)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={sourceFilter} onValueChange={setSourceFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="来源" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">所有来源</SelectItem>
                  <SelectItem value="ai">AI生成</SelectItem>
                  <SelectItem value="database">数据库</SelectItem>
                  <SelectItem value="offline">离线</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )}

        {/* 操作按钮 */}
        {showControls && history.length > 0 && (
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportHistory}
              className="flex items-center gap-1"
            >
              <Download className="w-3 h-3" />
              导出
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleClearHistory}
              className="flex items-center gap-1 text-red-600 hover:text-red-700"
            >
              <Trash2 className="w-3 h-3" />
              清空
            </Button>
          </div>
        )}

        <Separator />

        {/* 历史记录列表 */}
        {filteredHistory.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            {history.length === 0 ? (
              <div>
                <Clock className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>还没有历史记录</p>
                <p className="text-sm">生成您的第一个幸运饼干吧！</p>
              </div>
            ) : (
              <div>
                <Filter className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>没有找到匹配的记录</p>
                <p className="text-sm">尝试调整搜索条件</p>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {filteredHistory.map((item) => (
              <Card key={item.id} className="border-l-4 border-l-orange-500">
                <CardContent className="p-4">
                  <div className="space-y-2">
                    <blockquote className="text-sm font-medium italic">
                      "{item.message}"
                    </blockquote>
                    
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Badge variant="outline" className="text-xs">
                        {getCategoryName(item.category)}
                      </Badge>
                      <Badge variant="secondary" className="text-xs">
                        {getSourceName(item.source)}
                      </Badge>
                      <span>•</span>
                      <span>{formatDate(item.timestamp)}</span>
                    </div>

                    {item.tags && item.tags.length > 0 && (
                      <div className="flex gap-1 flex-wrap">
                        {item.tags.map(tag => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            #{tag}
                          </Badge>
                        ))}
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-2">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleLike(item.id)}
                          className={`h-7 px-2 ${item.liked ? 'text-red-500' : 'text-gray-500'}`}
                        >
                          <Heart className={`w-3 h-3 mr-1 ${item.liked ? 'fill-current' : ''}`} />
                          {item.liked ? '已喜欢' : '喜欢'}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleShare(item)}
                          className="h-7 px-2 text-gray-500"
                        >
                          <Share2 className="w-3 h-3 mr-1" />
                          分享
                        </Button>
                      </div>
                      
                      {item.customPrompt && (
                        <Badge variant="outline" className="text-xs">
                          自定义
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
