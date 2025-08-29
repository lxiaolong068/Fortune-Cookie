// Fortune Cookie AI - Service Worker
// 提供离线支持和缓存管理

const CACHE_NAME = 'fortune-cookie-ai-v1'
const STATIC_CACHE_NAME = 'fortune-static-v1'
const DYNAMIC_CACHE_NAME = 'fortune-dynamic-v1'
const API_CACHE_NAME = 'fortune-api-v1'

// 需要预缓存的静态资源
const STATIC_ASSETS = [
  '/',
  '/generator',
  '/messages',
  '/tutorial',
  '/manifest.webmanifest',
  '/favicon.ico',
  '/apple-touch-icon.png',
  '/favicon-32x32.png',
  '/favicon-16x16.png',
  // 添加关键的CSS和JS文件（这些会在构建时动态生成）
]

// 需要缓存的API端点
const CACHEABLE_APIS = [
  '/api/fortunes',
  '/api/fortune',
]

// 离线时的回退页面
const OFFLINE_PAGE = '/offline'
const OFFLINE_API_RESPONSE = {
  success: false,
  error: 'Offline mode - please check your internet connection',
  offline: true,
  timestamp: new Date().toISOString(),
}

// 安装事件 - 预缓存静态资源
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing...')
  
  event.waitUntil(
    Promise.all([
      // 缓存静态资源
      caches.open(STATIC_CACHE_NAME).then((cache) => {
        console.log('Service Worker: Caching static assets')
        return cache.addAll(STATIC_ASSETS)
      }),
      
      // 预缓存一些幸运饼干数据
      caches.open(API_CACHE_NAME).then((cache) => {
        console.log('Service Worker: Pre-caching API data')
        return fetch('/api/fortunes?action=popular&limit=10')
          .then(response => {
            if (response.ok) {
              cache.put('/api/fortunes?action=popular&limit=10', response.clone())
            }
            return response
          })
          .catch(() => {
            // 如果网络请求失败，缓存一个默认响应
            const defaultResponse = new Response(JSON.stringify({
              results: [
                {
                  id: 'offline-1',
                  message: '即使在离线状态下，希望也会照亮前路。',
                  category: 'inspirational',
                  mood: 'positive',
                  source: 'offline',
                  offline: true,
                },
                {
                  id: 'offline-2',
                  message: '困难只是成功路上的垫脚石。',
                  category: 'motivational',
                  mood: 'positive',
                  source: 'offline',
                  offline: true,
                },
              ],
              total: 2,
              offline: true,
            }), {
              headers: { 'Content-Type': 'application/json' }
            })
            
            return cache.put('/api/fortunes?action=popular&limit=10', defaultResponse)
          })
      }),
    ]).then(() => {
      console.log('Service Worker: Installation complete')
      // 强制激活新的Service Worker
      return self.skipWaiting()
    })
  )
})

// 激活事件 - 清理旧缓存
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating...')
  
  event.waitUntil(
    Promise.all([
      // 清理旧版本的缓存
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE_NAME && 
                cacheName !== DYNAMIC_CACHE_NAME && 
                cacheName !== API_CACHE_NAME) {
              console.log('Service Worker: Deleting old cache:', cacheName)
              return caches.delete(cacheName)
            }
          })
        )
      }),
      
      // 立即控制所有客户端
      self.clients.claim(),
    ]).then(() => {
      console.log('Service Worker: Activation complete')
    })
  )
})

// 获取事件 - 处理网络请求
self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)
  
  // 只处理同源请求
  if (url.origin !== location.origin) {
    return
  }
  
  // 根据请求类型选择不同的缓存策略
  if (request.method === 'GET') {
    if (url.pathname.startsWith('/api/')) {
      // API请求 - 网络优先策略
      event.respondWith(handleApiRequest(request))
    } else if (isStaticAsset(url.pathname)) {
      // 静态资源 - 缓存优先策略
      event.respondWith(handleStaticRequest(request))
    } else {
      // 页面请求 - 网络优先，缓存回退策略
      event.respondWith(handlePageRequest(request))
    }
  }
})

// 处理API请求 - 网络优先策略
async function handleApiRequest(request) {
  const url = new URL(request.url)
  
  try {
    // 尝试网络请求
    const networkResponse = await fetch(request)
    
    if (networkResponse.ok) {
      // 缓存成功的API响应
      if (isCacheableApi(url.pathname)) {
        const cache = await caches.open(API_CACHE_NAME)
        cache.put(request, networkResponse.clone())
      }
      return networkResponse
    }
    
    throw new Error(`Network response not ok: ${networkResponse.status}`)
    
  } catch (error) {
    console.log('Service Worker: Network request failed, trying cache:', error)
    
    // 网络失败，尝试从缓存获取
    const cachedResponse = await caches.match(request)
    if (cachedResponse) {
      return cachedResponse
    }
    
    // 缓存也没有，返回离线响应
    return new Response(JSON.stringify(OFFLINE_API_RESPONSE), {
      status: 503,
      statusText: 'Service Unavailable',
      headers: { 'Content-Type': 'application/json' }
    })
  }
}

// 处理静态资源请求 - 缓存优先策略
async function handleStaticRequest(request) {
  try {
    // 先尝试从缓存获取
    const cachedResponse = await caches.match(request)
    if (cachedResponse) {
      return cachedResponse
    }
    
    // 缓存没有，尝试网络请求
    const networkResponse = await fetch(request)
    
    if (networkResponse.ok) {
      // 缓存新的静态资源
      const cache = await caches.open(STATIC_CACHE_NAME)
      cache.put(request, networkResponse.clone())
    }
    
    return networkResponse
    
  } catch (error) {
    console.log('Service Worker: Static asset request failed:', error)
    
    // 返回一个基本的错误响应
    return new Response('Resource not available offline', {
      status: 503,
      statusText: 'Service Unavailable'
    })
  }
}

// 处理页面请求 - 网络优先，缓存回退策略
async function handlePageRequest(request) {
  try {
    // 尝试网络请求
    const networkResponse = await fetch(request)
    
    if (networkResponse.ok) {
      // 缓存页面响应
      const cache = await caches.open(DYNAMIC_CACHE_NAME)
      cache.put(request, networkResponse.clone())
      return networkResponse
    }
    
    throw new Error(`Network response not ok: ${networkResponse.status}`)
    
  } catch (error) {
    console.log('Service Worker: Page request failed, trying cache:', error)
    
    // 网络失败，尝试从缓存获取
    const cachedResponse = await caches.match(request)
    if (cachedResponse) {
      return cachedResponse
    }
    
    // 缓存也没有，返回离线页面
    const offlineResponse = await caches.match(OFFLINE_PAGE)
    if (offlineResponse) {
      return offlineResponse
    }
    
    // 最后的回退 - 返回基本的离线页面
    return new Response(`
      <!DOCTYPE html>
      <html lang="zh-CN">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>离线模式 - Fortune Cookie AI</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, sans-serif; text-align: center; padding: 2rem; }
          .offline-container { max-width: 400px; margin: 0 auto; }
          .offline-icon { font-size: 4rem; margin-bottom: 1rem; }
          .offline-title { color: #333; margin-bottom: 1rem; }
          .offline-message { color: #666; margin-bottom: 2rem; }
          .retry-button { background: #ff6b35; color: white; border: none; padding: 0.75rem 1.5rem; border-radius: 0.5rem; cursor: pointer; }
        </style>
      </head>
      <body>
        <div class="offline-container">
          <div class="offline-icon">🔮</div>
          <h1 class="offline-title">离线模式</h1>
          <p class="offline-message">您当前处于离线状态，请检查网络连接后重试。</p>
          <button class="retry-button" onclick="window.location.reload()">重新连接</button>
        </div>
      </body>
      </html>
    `, {
      headers: { 'Content-Type': 'text/html' }
    })
  }
}

// 工具函数：检查是否为静态资源
function isStaticAsset(pathname) {
  return pathname.startsWith('/_next/') ||
         pathname.startsWith('/static/') ||
         pathname.includes('.') && !pathname.includes('/api/')
}

// 工具函数：检查API是否可缓存
function isCacheableApi(pathname) {
  return CACHEABLE_APIS.some(api => pathname.startsWith(api))
}

// 消息处理 - 与主线程通信
self.addEventListener('message', (event) => {
  const { type, payload } = event.data
  
  switch (type) {
    case 'SKIP_WAITING':
      self.skipWaiting()
      break
      
    case 'GET_CACHE_STATUS':
      getCacheStatus().then(status => {
        event.ports[0].postMessage({ type: 'CACHE_STATUS', payload: status })
      })
      break
      
    case 'CLEAR_CACHE':
      clearAllCaches().then(() => {
        event.ports[0].postMessage({ type: 'CACHE_CLEARED' })
      })
      break
      
    case 'PREFETCH_CONTENT':
      prefetchContent(payload).then(() => {
        event.ports[0].postMessage({ type: 'CONTENT_PREFETCHED' })
      })
      break
  }
})

// 获取缓存状态
async function getCacheStatus() {
  const cacheNames = await caches.keys()
  const status = {}
  
  for (const cacheName of cacheNames) {
    const cache = await caches.open(cacheName)
    const keys = await cache.keys()
    status[cacheName] = keys.length
  }
  
  return status
}

// 清理所有缓存
async function clearAllCaches() {
  const cacheNames = await caches.keys()
  await Promise.all(cacheNames.map(name => caches.delete(name)))
}

// 预取内容
async function prefetchContent(urls) {
  const cache = await caches.open(DYNAMIC_CACHE_NAME)
  
  for (const url of urls) {
    try {
      const response = await fetch(url)
      if (response.ok) {
        await cache.put(url, response)
      }
    } catch (error) {
      console.log('Service Worker: Failed to prefetch:', url, error)
    }
  }
}

console.log('Service Worker: Script loaded')
