'use client'

import { useState, useEffect } from 'react'
import { Wifi, WifiOff, Download, RefreshCw, Trash2, Settings } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { swManager, offlineDetector, type ServiceWorkerStatus, type CacheStatus } from '@/lib/service-worker'
import { captureUserAction } from '@/lib/error-monitoring'

interface ServiceWorkerStatusProps {
  className?: string
}

export function ServiceWorkerStatus({ className }: ServiceWorkerStatusProps) {
  const [swStatus, setSwStatus] = useState<ServiceWorkerStatus>({
    supported: false,
    registered: false,
    installing: false,
    waiting: false,
    active: false,
    controlling: false,
  })
  const [cacheStatus, setCacheStatus] = useState<CacheStatus>({})
  const [isOnline, setIsOnline] = useState(true)
  const [updateAvailable, setUpdateAvailable] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const [isClearingCache, setIsClearingCache] = useState(false)

  useEffect(() => {
    // 初始化状态
    setSwStatus(swManager.getStatus())
    setIsOnline(swManager.isOnline())
    
    // 获取缓存状态
    swManager.getCacheStatus().then(setCacheStatus)

    // 监听 Service Worker 事件
    const handleUpdateAvailable = () => {
      setUpdateAvailable(true)
      captureUserAction('sw_update_available', 'service_worker')
    }

    const handleInstalled = () => {
      setSwStatus(swManager.getStatus())
      captureUserAction('sw_installed', 'service_worker')
    }

    const handleControllerChange = () => {
      setSwStatus(swManager.getStatus())
      captureUserAction('sw_controller_change', 'service_worker')
    }

    swManager.on('updateavailable', handleUpdateAvailable)
    swManager.on('installed', handleInstalled)
    swManager.on('controllerchange', handleControllerChange)

    // 监听网络状态变化
    const unsubscribeOffline = offlineDetector.subscribe((offline) => {
      setIsOnline(!offline)
    })

    // 定期更新状态
    const interval = setInterval(() => {
      setSwStatus(swManager.getStatus())
      swManager.getCacheStatus().then(setCacheStatus)
    }, 10000)

    return () => {
      swManager.off('updateavailable', handleUpdateAvailable)
      swManager.off('installed', handleInstalled)
      swManager.off('controllerchange', handleControllerChange)
      unsubscribeOffline()
      clearInterval(interval)
    }
  }, [])

  const handleUpdate = async () => {
    setIsUpdating(true)
    captureUserAction('sw_update_triggered', 'service_worker')
    
    try {
      await swManager.activateUpdate()
    } catch (error) {
      console.error('Failed to update Service Worker:', error)
    } finally {
      setIsUpdating(false)
    }
  }

  const handleClearCache = async () => {
    setIsClearingCache(true)
    captureUserAction('sw_cache_clear_triggered', 'service_worker')
    
    try {
      await swManager.clearCache()
      setCacheStatus({})
      
      // 刷新缓存状态
      setTimeout(() => {
        swManager.getCacheStatus().then(setCacheStatus)
      }, 1000)
    } catch (error) {
      console.error('Failed to clear cache:', error)
    } finally {
      setIsClearingCache(false)
    }
  }

  const getTotalCacheSize = () => {
    return Object.values(cacheStatus).reduce((total, count) => total + count, 0)
  }

  const getNetworkStatusColor = () => {
    return isOnline ? 'bg-green-500' : 'bg-red-500'
  }

  const getNetworkStatusText = () => {
    return isOnline ? '在线' : '离线'
  }

  if (!swStatus.supported) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Service Worker
          </CardTitle>
          <CardDescription>
            您的浏览器不支持 Service Worker 功能
          </CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="w-5 h-5" />
          离线支持状态
        </CardTitle>
        <CardDescription>
          Service Worker 和缓存管理
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* 网络状态 */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {isOnline ? (
              <Wifi className="w-4 h-4 text-green-600" />
            ) : (
              <WifiOff className="w-4 h-4 text-red-600" />
            )}
            <span className="text-sm font-medium">网络状态</span>
          </div>
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${getNetworkStatusColor()}`} />
            <Badge variant={isOnline ? 'default' : 'destructive'}>
              {getNetworkStatusText()}
            </Badge>
          </div>
        </div>

        <Separator />

        {/* Service Worker 状态 */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Service Worker 状态</h4>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex justify-between">
              <span>已注册:</span>
              <Badge variant={swStatus.registered ? 'default' : 'secondary'}>
                {swStatus.registered ? '是' : '否'}
              </Badge>
            </div>
            <div className="flex justify-between">
              <span>正在安装:</span>
              <Badge variant={swStatus.installing ? 'default' : 'secondary'}>
                {swStatus.installing ? '是' : '否'}
              </Badge>
            </div>
            <div className="flex justify-between">
              <span>等待激活:</span>
              <Badge variant={swStatus.waiting ? 'default' : 'secondary'}>
                {swStatus.waiting ? '是' : '否'}
              </Badge>
            </div>
            <div className="flex justify-between">
              <span>正在控制:</span>
              <Badge variant={swStatus.controlling ? 'default' : 'secondary'}>
                {swStatus.controlling ? '是' : '否'}
              </Badge>
            </div>
          </div>
        </div>

        <Separator />

        {/* 缓存状态 */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium">缓存状态</h4>
            <Badge variant="outline">
              总计: {getTotalCacheSize()} 项
            </Badge>
          </div>
          {Object.keys(cacheStatus).length > 0 ? (
            <div className="space-y-1 text-xs">
              {Object.entries(cacheStatus).map(([cacheName, count]) => (
                <div key={cacheName} className="flex justify-between">
                  <span className="truncate">{cacheName}:</span>
                  <span>{count} 项</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-gray-500">暂无缓存数据</p>
          )}
        </div>

        <Separator />

        {/* 操作按钮 */}
        <div className="flex flex-col gap-2">
          {updateAvailable && (
            <Button
              onClick={handleUpdate}
              disabled={isUpdating}
              className="w-full"
              size="sm"
            >
              {isUpdating ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  更新中...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 mr-2" />
                  更新可用 - 点击更新
                </>
              )}
            </Button>
          )}
          
          <Button
            variant="outline"
            onClick={handleClearCache}
            disabled={isClearingCache || getTotalCacheSize() === 0}
            className="w-full"
            size="sm"
          >
            {isClearingCache ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                清理中...
              </>
            ) : (
              <>
                <Trash2 className="w-4 h-4 mr-2" />
                清理缓存
              </>
            )}
          </Button>
        </div>

        {/* 离线提示 */}
        {!isOnline && (
          <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
            <p className="text-xs text-orange-800">
              您当前处于离线状态。某些功能可能不可用，但您仍可以浏览缓存的内容。
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
