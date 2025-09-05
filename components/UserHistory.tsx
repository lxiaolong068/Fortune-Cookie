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

// Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(item =>
        item.message.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query) ||
        item.tags?.some(tag => tag.toLowerCase().includes(query))
      )
    }

// Category filter
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(item => item.category === categoryFilter)
    }

// Source filter
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
          title: 'Fortune Cookie AI - Fortune Cookie',
          text: fortune.message,
          url: window.location.origin,
        })
      } else {
        await navigator.clipboard.writeText(
          `${fortune.message}\n\nFrom Fortune Cookie AI - ${window.location.origin}`
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
    if (confirm('Are you sure you want to clear all history? This action cannot be undone.')) {
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

  const getSourceName = (source: string) => {
    const sourceMap: Record<string, string> = {
      ai: 'AI',
      database: 'Database',
      offline: 'Offline',
    }
    return sourceMap[source] || source
  }

  const formatDate = (date: Date) => {
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return 'just now'
    if (diffMins < 60) return `${diffMins} minutes ago`
    if (diffHours < 24) return `${diffHours} hours ago`
    if (diffDays < 7) return `${diffDays} days ago`
    
    return date.toLocaleDateString('en-US')
  }

  if (isLoading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            History
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
          History
        </CardTitle>
        <CardDescription>
          Your fortune history ({history.length})
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* 搜索和过滤控件 */}
        {showControls && history.length > 0 && (
          <div className="space-y-3">
            <div className="flex gap-2">
              <div className="flex-1">
                <Input
                  placeholder="Search history..."
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
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All categories</SelectItem>
                  {getUniqueCategories().map(category => (
                    <SelectItem key={category} value={category}>
                      {getCategoryName(category)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={sourceFilter} onValueChange={setSourceFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Source" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All sources</SelectItem>
                  <SelectItem value="ai">AI</SelectItem>
                  <SelectItem value="database">Database</SelectItem>
                  <SelectItem value="offline">Offline</SelectItem>
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
              Export
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleClearHistory}
              className="flex items-center gap-1 text-red-600 hover:text-red-700"
            >
              <Trash2 className="w-3 h-3" />
              Clear
            </Button>
          </div>
        )}

        <Separator />

        {/* History list */}
        {filteredHistory.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            {history.length === 0 ? (
              <div>
                <Clock className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>No history yet</p>
                <p className="text-sm">Generate your first fortune!</p>
              </div>
            ) : (
              <div>
                <Filter className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>No matching records found</p>
                <p className="text-sm">Try adjusting your search</p>
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
                          {item.liked ? 'Liked' : 'Like'}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleShare(item)}
                          className="h-7 px-2 text-gray-500"
                        >
                          <Share2 className="w-3 h-3 mr-1" />
                          Share
                        </Button>
                      </div>
                      
                      {item.customPrompt && (
                        <Badge variant="outline" className="text-xs">
                          Custom
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
