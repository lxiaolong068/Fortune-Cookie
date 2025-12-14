'use client'

import { Button } from '@/components/ui/button'
import { RefreshCw, Home } from 'lucide-react'

interface OfflineActionsProps {
  className?: string
}

export function OfflineActions({ className }: OfflineActionsProps) {
  return (
    <div className={className}>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Button 
          onClick={() => window.location.reload()}
          className="flex items-center gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          重新连接
        </Button>
        <Button 
          variant="outline"
          onClick={() => (window.location.href = '/')}
          className="flex items-center gap-2"
        >
          <Home className="w-4 h-4" />
          返回首页
        </Button>
      </div>

      {/* 网络检查按钮 */}
      <div className="flex items-center justify-end mt-4">
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => {
            if ('serviceWorker' in navigator) {
              navigator.serviceWorker.ready
                .then((registration) => {
                  // 检查是否支持 Background Sync
                  if ('sync' in registration) {
                    const syncRegistration = registration as ServiceWorkerRegistration & {
                      sync: { register: (tag: string) => Promise<void> }
                    }
                    void syncRegistration.sync.register('background-sync')
                  }
                })
                .catch(console.error)
            }
          }}
          className="text-xs"
        >
          检查连接
        </Button>
      </div>
    </div>
  )
}
