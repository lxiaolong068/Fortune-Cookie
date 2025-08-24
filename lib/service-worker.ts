// Service Worker 管理器
// 处理 Service Worker 的注册、更新和通信

export interface ServiceWorkerStatus {
  supported: boolean
  registered: boolean
  installing: boolean
  waiting: boolean
  active: boolean
  controlling: boolean
}

export interface CacheStatus {
  [cacheName: string]: number
}

export class ServiceWorkerManager {
  private registration: ServiceWorkerRegistration | null = null
  private updateAvailable = false
  private listeners: Map<string, Function[]> = new Map()

  // 检查 Service Worker 支持
  static isSupported(): boolean {
    return 'serviceWorker' in navigator
  }

  // 注册 Service Worker
  async register(): Promise<boolean> {
    if (!ServiceWorkerManager.isSupported()) {
      console.warn('Service Worker not supported')
      return false
    }

    try {
      this.registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/',
      })

      console.log('Service Worker registered:', this.registration.scope)

      // 监听更新
      this.registration.addEventListener('updatefound', () => {
        this.handleUpdateFound()
      })

      // 监听控制器变化
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        this.emit('controllerchange')
        window.location.reload()
      })

      // 检查是否有等待中的 Service Worker
      if (this.registration.waiting) {
        this.updateAvailable = true
        this.emit('updateavailable')
      }

      return true
    } catch (error) {
      console.error('Service Worker registration failed:', error)
      return false
    }
  }

  // 处理更新发现
  private handleUpdateFound(): void {
    if (!this.registration) return

    const newWorker = this.registration.installing
    if (!newWorker) return

    console.log('Service Worker update found')

    newWorker.addEventListener('statechange', () => {
      if (newWorker.state === 'installed') {
        if (navigator.serviceWorker.controller) {
          // 有新版本可用
          this.updateAvailable = true
          this.emit('updateavailable')
        } else {
          // 首次安装完成
          this.emit('installed')
        }
      }
    })
  }

  // 激活等待中的 Service Worker
  async activateUpdate(): Promise<void> {
    if (!this.registration || !this.registration.waiting) {
      return
    }

    // 发送跳过等待消息
    this.registration.waiting.postMessage({ type: 'SKIP_WAITING' })
  }

  // 获取 Service Worker 状态
  getStatus(): ServiceWorkerStatus {
    if (!ServiceWorkerManager.isSupported()) {
      return {
        supported: false,
        registered: false,
        installing: false,
        waiting: false,
        active: false,
        controlling: false,
      }
    }

    return {
      supported: true,
      registered: !!this.registration,
      installing: !!this.registration?.installing,
      waiting: !!this.registration?.waiting,
      active: !!this.registration?.active,
      controlling: !!navigator.serviceWorker.controller,
    }
  }

  // 获取缓存状态
  async getCacheStatus(): Promise<CacheStatus> {
    if (!navigator.serviceWorker.controller) {
      return {}
    }

    return new Promise((resolve) => {
      const messageChannel = new MessageChannel()
      
      messageChannel.port1.onmessage = (event) => {
        if (event.data.type === 'CACHE_STATUS') {
          resolve(event.data.payload)
        }
      }

      if (navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller.postMessage(
          { type: 'GET_CACHE_STATUS' },
          [messageChannel.port2]
        )
      }

      // 超时处理
      setTimeout(() => resolve({}), 5000)
    })
  }

  // 清理所有缓存
  async clearCache(): Promise<void> {
    if (!navigator.serviceWorker.controller) {
      return
    }

    return new Promise((resolve) => {
      const messageChannel = new MessageChannel()
      
      messageChannel.port1.onmessage = (event) => {
        if (event.data.type === 'CACHE_CLEARED') {
          resolve()
        }
      }

      if (navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller.postMessage(
          { type: 'CLEAR_CACHE' },
          [messageChannel.port2]
        )
      }

      // 超时处理
      setTimeout(() => resolve(), 5000)
    })
  }

  // 预取内容
  async prefetchContent(urls: string[]): Promise<void> {
    if (!navigator.serviceWorker.controller) {
      return
    }

    return new Promise((resolve) => {
      const messageChannel = new MessageChannel()
      
      messageChannel.port1.onmessage = (event) => {
        if (event.data.type === 'CONTENT_PREFETCHED') {
          resolve()
        }
      }

      if (navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller.postMessage(
          { type: 'PREFETCH_CONTENT', payload: urls },
          [messageChannel.port2]
        )
      }

      // 超时处理
      setTimeout(() => resolve(), 10000)
    })
  }

  // 检查网络状态
  isOnline(): boolean {
    return navigator.onLine
  }

  // 监听网络状态变化
  onNetworkChange(callback: (online: boolean) => void): () => void {
    const handleOnline = () => callback(true)
    const handleOffline = () => callback(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }

  // 事件监听器管理
  on(event: string, callback: Function): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, [])
    }
    this.listeners.get(event)!.push(callback)
  }

  off(event: string, callback: Function): void {
    const callbacks = this.listeners.get(event)
    if (callbacks) {
      const index = callbacks.indexOf(callback)
      if (index > -1) {
        callbacks.splice(index, 1)
      }
    }
  }

  private emit(event: string, ...args: any[]): void {
    const callbacks = this.listeners.get(event)
    if (callbacks) {
      callbacks.forEach(callback => callback(...args))
    }
  }

  // 卸载 Service Worker（开发时使用）
  async unregister(): Promise<boolean> {
    if (!this.registration) {
      return false
    }

    try {
      const result = await this.registration.unregister()
      console.log('Service Worker unregistered:', result)
      return result
    } catch (error) {
      console.error('Service Worker unregistration failed:', error)
      return false
    }
  }
}

// 全局 Service Worker 管理器实例
export const swManager = new ServiceWorkerManager()

// 自动注册 Service Worker（仅在生产环境）
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'production') {
  swManager.register().catch(console.error)
}

// 离线检测工具
export class OfflineDetector {
  private callbacks: Set<(offline: boolean) => void> = new Set()
  private isOffline = false

  constructor() {
    if (typeof window !== 'undefined') {
      this.isOffline = !navigator.onLine
      this.setupListeners()
    }
  }

  private setupListeners(): void {
    window.addEventListener('online', () => {
      this.isOffline = false
      this.notifyCallbacks(false)
    })

    window.addEventListener('offline', () => {
      this.isOffline = true
      this.notifyCallbacks(true)
    })

    // 定期检查网络连接
    setInterval(() => {
      this.checkConnection()
    }, 30000) // 每30秒检查一次
  }

  private async checkConnection(): Promise<void> {
    try {
      // 尝试获取一个小的资源来检查连接
      const response = await fetch('/favicon.ico', {
        method: 'HEAD',
        cache: 'no-cache',
      })
      
      const wasOffline = this.isOffline
      this.isOffline = !response.ok
      
      if (wasOffline !== this.isOffline) {
        this.notifyCallbacks(this.isOffline)
      }
    } catch {
      const wasOffline = this.isOffline
      this.isOffline = true
      
      if (!wasOffline) {
        this.notifyCallbacks(true)
      }
    }
  }

  private notifyCallbacks(offline: boolean): void {
    this.callbacks.forEach(callback => callback(offline))
  }

  // 订阅离线状态变化
  subscribe(callback: (offline: boolean) => void): () => void {
    this.callbacks.add(callback)
    
    // 立即调用一次以获取当前状态
    callback(this.isOffline)
    
    return () => {
      this.callbacks.delete(callback)
    }
  }

  // 获取当前离线状态
  getOfflineStatus(): boolean {
    return this.isOffline
  }
}

// 全局离线检测器实例
export const offlineDetector = new OfflineDetector()
