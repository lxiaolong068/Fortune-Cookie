'use client'

import { useState, useEffect } from 'react'
import { Wifi, WifiOff, AlertCircle } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { offlineDetector } from '@/lib/service-worker'
import { captureUserAction } from '@/lib/error-monitoring'

interface OfflineIndicatorProps {
  className?: string
  showDetails?: boolean
}

export function OfflineIndicator({ className, showDetails = false }: OfflineIndicatorProps) {
  const [isOffline, setIsOffline] = useState(false)
  const [showBanner, setShowBanner] = useState(false)
  const [connectionAttempts, setConnectionAttempts] = useState(0)
  const [lastOnlineTime, setLastOnlineTime] = useState<Date | null>(null)

  useEffect(() => {
    // 订阅离线状态变化
    const unsubscribe = offlineDetector.subscribe((offline) => {
      const wasOffline = isOffline
      setIsOffline(offline)
      
      if (offline && !wasOffline) {
        // 刚变为离线状态
        setShowBanner(true)
        setLastOnlineTime(new Date())
        captureUserAction('went_offline', 'network_status')
      } else if (!offline && wasOffline) {
        // 重新连接
        setShowBanner(false)
        setConnectionAttempts(0)
        captureUserAction('went_online', 'network_status', undefined, {
          offlineDuration: lastOnlineTime ? Date.now() - lastOnlineTime.getTime() : 0,
        })
      }
    })

    return unsubscribe
  }, [isOffline, lastOnlineTime])

  const handleRetryConnection = async () => {
    setConnectionAttempts(prev => prev + 1)
    captureUserAction('retry_connection', 'network_status', undefined, {
      attempt: connectionAttempts + 1,
    })

    try {
      // 尝试发起一个简单的网络请求来检查连接
      const response = await fetch('/favicon.ico', {
        method: 'HEAD',
        cache: 'no-cache',
      })
      
      if (response.ok) {
        setIsOffline(false)
        setShowBanner(false)
        setConnectionAttempts(0)
      }
    } catch (error) {
      // 连接仍然失败
      console.log('Connection retry failed:', error)
    }
  }

  const handleDismissBanner = () => {
    setShowBanner(false)
    captureUserAction('dismiss_offline_banner', 'network_status')
  }

  const getOfflineDuration = () => {
    if (!lastOnlineTime) return ''
    
    const duration = Date.now() - lastOnlineTime.getTime()
    const minutes = Math.floor(duration / 60000)
    const seconds = Math.floor((duration % 60000) / 1000)
    
    if (minutes > 0) {
      return `${minutes}分${seconds}秒`
    }
    return `${seconds}秒`
  }

  // 简单的状态指示器
  if (!showDetails) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        {isOffline ? (
          <>
            <WifiOff className="w-4 h-4 text-red-500" />
            <Badge variant="destructive" className="text-xs">
              离线
            </Badge>
          </>
        ) : (
          <>
            <Wifi className="w-4 h-4 text-green-500" />
            <Badge variant="default" className="text-xs">
              在线
            </Badge>
          </>
        )}
      </div>
    )
  }

  // 详细的离线横幅
  if (showBanner && isOffline) {
    return (
      <Card className={`border-orange-200 bg-orange-50 ${className}`}>
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-orange-600 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-sm font-medium text-orange-900">
                  网络连接中断
                </h3>
                {lastOnlineTime && (
                  <Badge variant="outline" className="text-xs">
                    已离线 {getOfflineDuration()}
                  </Badge>
                )}
              </div>
              <p className="text-xs text-orange-700">
                您当前处于离线状态。某些功能可能不可用，但您仍可以浏览缓存的内容。
              </p>
              {connectionAttempts > 0 && (
                <p className="text-xs text-orange-600 mt-1">
                  已尝试重连 {connectionAttempts} 次
                </p>
              )}
            </div>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={handleRetryConnection}
                className="text-xs h-7"
              >
                重试连接
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={handleDismissBanner}
                className="text-xs h-7"
              >
                关闭
              </Button>
            </div>
          </div>
          
          {/* 离线功能提示 */}
          <div className="mt-3 pt-3 border-t border-orange-200">
            <p className="text-xs text-orange-700 mb-2">离线可用功能：</p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                <span>浏览缓存内容</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                <span>查看历史记录</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 bg-red-500 rounded-full" />
                <span>生成新内容</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 bg-red-500 rounded-full" />
                <span>分享功能</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return null
}

// 简化的网络状态钩子
export function useNetworkStatus() {
  const [isOnline, setIsOnline] = useState(true)
  const [isOffline, setIsOffline] = useState(false)

  useEffect(() => {
    const unsubscribe = offlineDetector.subscribe((offline) => {
      setIsOffline(offline)
      setIsOnline(!offline)
    })

    return unsubscribe
  }, [])

  return { isOnline, isOffline }
}

// 离线状态上下文提供者（可选）
import { createContext, useContext, ReactNode } from 'react'

interface NetworkContextType {
  isOnline: boolean
  isOffline: boolean
}

const NetworkContext = createContext<NetworkContextType>({
  isOnline: true,
  isOffline: false,
})

export function NetworkProvider({ children }: { children: ReactNode }) {
  const networkStatus = useNetworkStatus()

  return (
    <NetworkContext.Provider value={networkStatus}>
      {children}
    </NetworkContext.Provider>
  )
}

export function useNetwork() {
  return useContext(NetworkContext)
}
