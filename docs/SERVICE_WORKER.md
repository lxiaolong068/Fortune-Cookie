# 🔧 Service Worker 离线支持指南

## 概述

本项目实现了完整的 Service Worker 离线支持功能，提供缓存管理、离线浏览和网络状态监控等功能。

## 🏗️ 架构设计

### Service Worker 策略

1. **静态资源**: 缓存优先策略
2. **API 请求**: 网络优先，缓存回退策略
3. **页面请求**: 网络优先，离线页面回退策略

### 缓存分层

```javascript
const STATIC_CACHE_NAME = 'fortune-static-v1'    // 静态资源缓存
const DYNAMIC_CACHE_NAME = 'fortune-dynamic-v1'  // 动态内容缓存
const API_CACHE_NAME = 'fortune-api-v1'          // API 响应缓存
```

## 🔧 功能特性

### 1. 自动缓存管理

- **预缓存**: 关键静态资源和页面
- **动态缓存**: 用户访问的页面和API响应
- **智能清理**: 自动清理过期缓存

### 2. 离线支持

- **离线页面**: 专门的离线状态页面
- **缓存内容**: 离线时可访问已缓存的内容
- **离线幸运饼干**: 预设的离线可用内容

### 3. 网络状态监控

- **实时检测**: 监控网络连接状态
- **状态通知**: 离线/在线状态变化提醒
- **重连机制**: 自动和手动重连功能

### 4. 更新管理

- **版本检测**: 自动检测 Service Worker 更新
- **用户提示**: 友好的更新提示界面
- **无缝更新**: 后台更新，用户确认后激活

## 📁 文件结构

```
public/
├── sw.js                           # Service Worker 主文件
├── manifest.json                   # Web App Manifest

lib/
├── service-worker.ts               # Service Worker 管理器

components/
├── ServiceWorkerInitializer.tsx    # SW 初始化组件
├── ServiceWorkerStatus.tsx         # SW 状态显示组件
├── OfflineIndicator.tsx            # 离线状态指示器

app/
├── offline/
│   └── page.tsx                    # 离线页面
```

## 🚀 使用指南

### 基本使用

Service Worker 会在生产环境自动注册和激活：

```typescript
// 自动注册（仅生产环境）
import { swManager } from '@/lib/service-worker'

// 手动注册
const registered = await swManager.register()
```

### 状态监控

```typescript
// 获取 Service Worker 状态
const status = swManager.getStatus()

// 监听更新事件
swManager.on('updateavailable', () => {
  console.log('New version available!')
})

// 监听网络状态
const unsubscribe = offlineDetector.subscribe((offline) => {
  console.log('Offline:', offline)
})
```

### 缓存管理

```typescript
// 获取缓存状态
const cacheStatus = await swManager.getCacheStatus()

// 清理所有缓存
await swManager.clearCache()

// 预取内容
await swManager.prefetchContent(['/important-page'])
```

## 🎯 缓存策略详解

### 1. 静态资源缓存策略

```javascript
// 缓存优先 - 适用于不经常变化的资源
async function handleStaticRequest(request) {
  // 1. 先检查缓存
  const cachedResponse = await caches.match(request)
  if (cachedResponse) {
    return cachedResponse
  }
  
  // 2. 缓存未命中，请求网络
  const networkResponse = await fetch(request)
  
  // 3. 缓存新资源
  if (networkResponse.ok) {
    const cache = await caches.open(STATIC_CACHE_NAME)
    cache.put(request, networkResponse.clone())
  }
  
  return networkResponse
}
```

### 2. API 请求缓存策略

```javascript
// 网络优先 - 适用于动态数据
async function handleApiRequest(request) {
  try {
    // 1. 优先尝试网络请求
    const networkResponse = await fetch(request)
    
    if (networkResponse.ok) {
      // 2. 缓存成功的响应
      const cache = await caches.open(API_CACHE_NAME)
      cache.put(request, networkResponse.clone())
      return networkResponse
    }
  } catch (error) {
    // 3. 网络失败，回退到缓存
    const cachedResponse = await caches.match(request)
    if (cachedResponse) {
      return cachedResponse
    }
    
    // 4. 返回离线响应
    return new Response(JSON.stringify(OFFLINE_API_RESPONSE), {
      status: 503,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}
```

### 3. 页面请求缓存策略

```javascript
// 网络优先，离线页面回退
async function handlePageRequest(request) {
  try {
    // 1. 尝试网络请求
    const networkResponse = await fetch(request)
    
    if (networkResponse.ok) {
      // 2. 缓存页面
      const cache = await caches.open(DYNAMIC_CACHE_NAME)
      cache.put(request, networkResponse.clone())
      return networkResponse
    }
  } catch (error) {
    // 3. 尝试缓存
    const cachedResponse = await caches.match(request)
    if (cachedResponse) {
      return cachedResponse
    }
    
    // 4. 返回离线页面
    return caches.match('/offline') || createOfflinePage()
  }
}
```

## 🔄 更新流程

### 1. 检测更新

```javascript
// Service Worker 更新检测
self.addEventListener('install', (event) => {
  // 跳过等待，立即激活新版本
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  // 清理旧缓存
  event.waitUntil(cleanupOldCaches())
  
  // 立即控制所有客户端
  self.clients.claim()
})
```

### 2. 用户交互

```typescript
// 用户确认更新
const handleUpdate = async () => {
  await swManager.activateUpdate()
  // 页面将自动刷新
}
```

## 📊 性能优化

### 1. 预缓存策略

```javascript
// 预缓存关键资源
const STATIC_ASSETS = [
  '/',
  '/generator',
  '/messages',
  '/manifest.json',
  // 关键 CSS 和 JS 文件
]
```

### 2. 选择性缓存

```javascript
// 只缓存重要的 API 端点
const CACHEABLE_APIS = [
  '/api/fortunes',
  '/api/fortune',
]

function isCacheableApi(pathname) {
  return CACHEABLE_APIS.some(api => pathname.startsWith(api))
}
```

### 3. 缓存大小控制

```javascript
// 限制缓存项目数量
const MAX_CACHE_ENTRIES = 50

async function limitCacheSize(cacheName, maxEntries) {
  const cache = await caches.open(cacheName)
  const keys = await cache.keys()
  
  if (keys.length > maxEntries) {
    // 删除最旧的条目
    const entriesToDelete = keys.slice(0, keys.length - maxEntries)
    await Promise.all(entriesToDelete.map(key => cache.delete(key)))
  }
}
```

## 🛠️ 调试和监控

### 1. 开发工具

```javascript
// 开发环境调试
if (process.env.NODE_ENV === 'development') {
  console.log('Service Worker events:', {
    install: 'SW installing...',
    activate: 'SW activated',
    fetch: 'Handling fetch event'
  })
}
```

### 2. 缓存检查

```typescript
// 检查缓存状态
const cacheStatus = await swManager.getCacheStatus()
console.log('Cache status:', cacheStatus)

// 输出示例:
// {
//   'fortune-static-v1': 15,
//   'fortune-dynamic-v1': 8,
//   'fortune-api-v1': 12
// }
```

### 3. 网络监控

```typescript
// 监控网络状态变化
offlineDetector.subscribe((offline) => {
  if (offline) {
    console.log('App went offline')
    // 记录离线事件
  } else {
    console.log('App came back online')
    // 记录在线事件
  }
})
```

## 🔧 配置选项

### 1. 缓存配置

```javascript
// 缓存版本管理
const CACHE_VERSION = 'v1'
const CACHE_PREFIX = 'fortune-cookie-ai'

// 缓存名称
const STATIC_CACHE_NAME = `${CACHE_PREFIX}-static-${CACHE_VERSION}`
const DYNAMIC_CACHE_NAME = `${CACHE_PREFIX}-dynamic-${CACHE_VERSION}`
const API_CACHE_NAME = `${CACHE_PREFIX}-api-${CACHE_VERSION}`
```

### 2. 网络超时

```javascript
// 网络请求超时设置
const NETWORK_TIMEOUT = 3000 // 3秒

async function fetchWithTimeout(request, timeout = NETWORK_TIMEOUT) {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), timeout)
  
  try {
    const response = await fetch(request, {
      signal: controller.signal
    })
    clearTimeout(timeoutId)
    return response
  } catch (error) {
    clearTimeout(timeoutId)
    throw error
  }
}
```

## 📱 移动端优化

### 1. 数据节省

```javascript
// 在移动网络下减少缓存
function shouldCache(request) {
  // 检查连接类型
  if (navigator.connection) {
    const { effectiveType } = navigator.connection
    
    // 在慢速连接下只缓存关键资源
    if (effectiveType === 'slow-2g' || effectiveType === '2g') {
      return isCriticalResource(request.url)
    }
  }
  
  return true
}
```

### 2. 后台同步

```javascript
// 注册后台同步
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync())
  }
})

async function doBackgroundSync() {
  // 同步离线时的操作
  console.log('Performing background sync')
}
```

## 🚀 部署注意事项

### 1. HTTPS 要求

Service Worker 只能在 HTTPS 环境下工作（localhost 除外）。

### 2. 缓存更新

```javascript
// 确保在部署新版本时更新缓存版本
const CACHE_VERSION = 'v2' // 更新版本号
```

### 3. 清理策略

```javascript
// 定期清理过期缓存
setInterval(async () => {
  await cleanupExpiredCaches()
}, 24 * 60 * 60 * 1000) // 每24小时清理一次
```

## 📚 最佳实践

1. **渐进增强**: Service Worker 作为增强功能，不影响基本功能
2. **用户控制**: 提供清理缓存和禁用离线功能的选项
3. **透明度**: 清楚地告知用户离线状态和可用功能
4. **性能监控**: 监控缓存命中率和离线使用情况
5. **优雅降级**: 在不支持的浏览器中正常工作

## 🔗 相关资源

- [Service Worker API](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)
- [Cache API](https://developer.mozilla.org/en-US/docs/Web/API/Cache)
- [Web App Manifest](https://developer.mozilla.org/en-US/docs/Web/Manifest)
- [PWA 最佳实践](https://web.dev/pwa/)
