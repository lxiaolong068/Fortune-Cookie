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
import { ThemePreview } from '@/components/ThemeToggle'
import { themeManager } from '@/lib/theme-manager'

interface UserPreferencesProps {
  className?: string
  onPreferencesChange?: (preferences: UserPreferences) => void
}

const AVAILABLE_CATEGORIES = [
  { id: 'inspirational', name: 'Inspirational', description: 'Uplifting and motivating messages' },
  { id: 'motivational', name: 'Motivational', description: 'Messages that drive action' },
  { id: 'wisdom', name: 'Wisdom', description: 'Life philosophy and wisdom' },
  { id: 'love', name: 'Love', description: 'About love and emotions' },
  { id: 'success', name: 'Success', description: 'Success and achievement' },
  { id: 'happiness', name: 'Happiness', description: 'Joy and happiness' },
  { id: 'peace', name: 'Peace', description: 'Inner peace and tranquility' },
  { id: 'courage', name: 'Courage', description: 'Bravely face challenges' },
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
    
    // Save critical settings immediately
    if (key === 'theme' || key === 'language') {
      savePreferences(newPreferences)

      // Sync theme to theme manager
      if (key === 'theme') {
        themeManager.setTheme(value as 'light' | 'dark' | 'system')
      }
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
    if (confirm('Are you sure you want to reset all preference settings?')) {
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
            Preferences
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
          Preferences
        </CardTitle>
        <CardDescription>
          Personalize your fortune cookie experience
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Appearance Settings */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Palette className="w-4 h-4" />
            <h3 className="text-sm font-medium">Appearance Settings</h3>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="theme">Theme Selection</Label>
              <ThemePreview />
            </div>

            <div className="space-y-2">
              <Label htmlFor="displayMode">Display Mode</Label>
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
                  <SelectItem value="card">Card</SelectItem>
                  <SelectItem value="list">List</SelectItem>
                  <SelectItem value="grid">Grid</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <Separator />

        {/* Language Settings */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4" />
            <h3 className="text-sm font-medium">Language Settings</h3>
          </div>

          <div className="space-y-2">
            <Label htmlFor="language">Interface Language</Label>
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
                <SelectItem value="zh">Chinese</SelectItem>
                <SelectItem value="en">English</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Separator />

        {/* Favorite Categories */}
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium mb-1">Favorite Categories</h3>
            <p className="text-xs text-gray-500">
              Select your favorite fortune cookie categories, the system will prioritize content from these categories
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
                        Selected
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

        {/* Notification Settings */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4" />
            <h3 className="text-sm font-medium">Notification Settings</h3>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="notifications" className="text-sm font-medium">
                  Enable Notifications
                </Label>
                <p className="text-xs text-gray-500">
                  Receive app updates and new feature notifications
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
                  Auto Save
                </Label>
                <p className="text-xs text-gray-500">
                  Automatically save your fortune cookies to history
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

        {/* Action Buttons */}
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={resetPreferences}
            className="flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            Reset Settings
          </Button>

          <div className="flex gap-2">
            {hasChanges && (
              <Badge variant="outline" className="text-xs">
                Unsaved changes
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
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Save Settings
                </>
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
