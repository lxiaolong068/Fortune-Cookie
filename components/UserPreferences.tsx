'use client'

import { useState, useEffect } from 'react'
import { Settings, Palette, Globe, Bell, Save, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { sessionManager, type UserPreferences } from '@/lib/session-manager'
import { captureUserAction } from '@/lib/error-monitoring'

interface UserPreferencesProps {
  className?: string
  onPreferencesChange?: (preferences: UserPreferences) => void
}

const AVAILABLE_CATEGORIES = [
  { id: 'inspirational', name: '励志', description: '激励人心的话语' },
  { id: 'motivational', name: '激励', description: '推动行动的力量' },
  { id: 'wisdom', name: '智慧', description: '人生哲理与智慧' },
  { id: 'love', name: '爱情', description: '关于爱与情感' },
  { id: 'success', name: '成功', description: '成功与成就' },
  { id: 'happiness', name: '快乐', description: '快乐与幸福' },
  { id: 'peace', name: '平静', description: '内心平静与安宁' },
  { id: 'courage', name: '勇气', description: '勇敢面对挑战' },
]

export function UserPreferences({ className, onPreferencesChange }: UserPreferencesProps) {
  const [preferences, setPreferences] = useState<UserPreferences>({
    theme: 'system',
    language: 'zh',
    favoriteCategories: [],
    notifications: true,
    autoSave: true,
    displayMode: 'card',
  })
  const [isLoading, setIsLoading] = useState(true)
  const [hasChanges, setHasChanges] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    loadPreferences()
  }, [])

  const loadPreferences = async () => {
    try {
      setIsLoading(true)
      await sessionManager.initializeSession()
      const userPreferences = sessionManager.getPreferences()
      setPreferences(userPreferences)
    } catch (error) {
      console.error('Failed to load preferences:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const updatePreference = <K extends keyof UserPreferences>(
    key: K,
    value: UserPreferences[K]
  ) => {
    const newPreferences = { ...preferences, [key]: value }
    setPreferences(newPreferences)
    setHasChanges(true)
    
    // 立即保存某些关键设置
    if (key === 'theme' || key === 'language') {
      savePreferences(newPreferences)
    }
  }

  const toggleFavoriteCategory = (categoryId: string) => {
    const currentFavorites = preferences.favoriteCategories
    const newFavorites = currentFavorites.includes(categoryId)
      ? currentFavorites.filter(id => id !== categoryId)
      : [...currentFavorites, categoryId]
    
    updatePreference('favoriteCategories', newFavorites)
  }

  const savePreferences = async (prefsToSave = preferences) => {
    try {
      setIsSaving(true)
      sessionManager.updatePreferences(prefsToSave)
      setHasChanges(false)
      onPreferencesChange?.(prefsToSave)
      
      captureUserAction('preferences_saved', 'user_preferences', undefined, {
        theme: prefsToSave.theme,
        language: prefsToSave.language,
        favoriteCategories: prefsToSave.favoriteCategories.length,
      })
    } catch (error) {
      console.error('Failed to save preferences:', error)
    } finally {
      setIsSaving(false)
    }
  }

  const resetPreferences = () => {
    if (confirm('确定要重置所有偏好设置吗？')) {
      const defaultPrefs: UserPreferences = {
        theme: 'system',
        language: 'zh',
        favoriteCategories: [],
        notifications: true,
        autoSave: true,
        displayMode: 'card',
      }
      
      setPreferences(defaultPrefs)
      savePreferences(defaultPrefs)
      captureUserAction('preferences_reset', 'user_preferences')
    }
  }

  if (isLoading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            偏好设置
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
          <Settings className="w-5 h-5" />
          偏好设置
        </CardTitle>
        <CardDescription>
          个性化您的幸运饼干体验
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* 外观设置 */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Palette className="w-4 h-4" />
            <h3 className="text-sm font-medium">外观设置</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="theme">主题</Label>
              <Select
                value={preferences.theme}
                onValueChange={(value: 'light' | 'dark' | 'system') => 
                  updatePreference('theme', value)
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">浅色</SelectItem>
                  <SelectItem value="dark">深色</SelectItem>
                  <SelectItem value="system">跟随系统</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="displayMode">显示模式</Label>
              <Select
                value={preferences.displayMode}
                onValueChange={(value: 'card' | 'list' | 'grid') => 
                  updatePreference('displayMode', value)
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="card">卡片</SelectItem>
                  <SelectItem value="list">列表</SelectItem>
                  <SelectItem value="grid">网格</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <Separator />

        {/* 语言设置 */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4" />
            <h3 className="text-sm font-medium">语言设置</h3>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="language">界面语言</Label>
            <Select
              value={preferences.language}
              onValueChange={(value: 'zh' | 'en') => 
                updatePreference('language', value)
              }
            >
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="zh">中文</SelectItem>
                <SelectItem value="en">English</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Separator />

        {/* 喜欢的类别 */}
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium mb-1">喜欢的类别</h3>
            <p className="text-xs text-gray-500">
              选择您喜欢的幸运饼干类别，系统会优先推荐这些类别的内容
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {AVAILABLE_CATEGORIES.map((category) => (
              <div
                key={category.id}
                className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
                onClick={() => toggleFavoriteCategory(category.id)}
              >
                <Checkbox
                  checked={preferences.favoriteCategories.includes(category.id)}
                  onChange={() => toggleFavoriteCategory(category.id)}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{category.name}</span>
                    {preferences.favoriteCategories.includes(category.id) && (
                      <Badge variant="secondary" className="text-xs">
                        已选择
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {category.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* 通知设置 */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4" />
            <h3 className="text-sm font-medium">通知设置</h3>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="notifications" className="text-sm font-medium">
                  启用通知
                </Label>
                <p className="text-xs text-gray-500">
                  接收应用更新和新功能通知
                </p>
              </div>
              <Switch
                id="notifications"
                checked={preferences.notifications}
                onCheckedChange={(checked) => updatePreference('notifications', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="autoSave" className="text-sm font-medium">
                  自动保存
                </Label>
                <p className="text-xs text-gray-500">
                  自动保存您的幸运饼干到历史记录
                </p>
              </div>
              <Switch
                id="autoSave"
                checked={preferences.autoSave}
                onCheckedChange={(checked) => updatePreference('autoSave', checked)}
              />
            </div>
          </div>
        </div>

        <Separator />

        {/* 操作按钮 */}
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={resetPreferences}
            className="flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            重置设置
          </Button>
          
          <div className="flex gap-2">
            {hasChanges && (
              <Badge variant="outline" className="text-xs">
                有未保存的更改
              </Badge>
            )}
            <Button
              onClick={() => savePreferences()}
              disabled={!hasChanges || isSaving}
              className="flex items-center gap-2"
            >
              {isSaving ? (
                <>
                  <div className="w-4 h-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  保存中...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  保存设置
                </>
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
