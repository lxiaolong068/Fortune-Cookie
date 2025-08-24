# 🚀 缓存系统配置指南

## 概述

本项目实现了多层缓存架构，包括Redis分布式缓存、边缘缓存和CDN优化，以提供最佳的性能和用户体验。

## 🏗️ 缓存架构

### 多层缓存策略

1. **浏览器缓存** - 客户端缓存静态资源
2. **CDN/边缘缓存** - 全球分布式缓存
3. **Redis缓存** - 分布式内存缓存
4. **应用缓存** - 内存中的临时缓存

### 缓存类型

- **静态资源缓存**: 图片、CSS、JS文件 (1年)
- **API响应缓存**: 动态数据缓存 (5-10分钟)
- **幸运饼干缓存**: 生成的内容缓存 (24小时)
- **搜索结果缓存**: 查询结果缓存 (1小时)
- **分析数据缓存**: 统计数据缓存 (30分钟)

## 🔧 Redis 配置

### 1. 创建 Upstash Redis 实例

1. 访问 [Upstash Console](https://console.upstash.com/)
2. 创建新的Redis数据库
3. 选择合适的地区（推荐亚太地区）
4. 获取REST URL和Token

### 2. 环境变量配置

```bash
# Redis 配置
UPSTASH_REDIS_REST_URL=https://your-redis-url.upstash.io
UPSTASH_REDIS_REST_TOKEN=your-redis-token

# 缓存管理令牌
CACHE_ADMIN_TOKEN=your-secure-admin-token
```

### 3. 分布式限流配置

```typescript
// 限流策略
const rateLimiters = {
  api: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(50, '15 m'), // 15分钟50次
  }),
  fortune: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(10, '1 m'), // 1分钟10次
  }),
  search: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(30, '1 m'), // 1分钟30次
  }),
}
```

## 📊 缓存管理

### 缓存统计API

```bash
# 获取缓存统计
GET /api/cache?action=stats

# 检查缓存健康状态
GET /api/cache?action=health
```

### 缓存管理API (需要管理员权限)

```bash
# 缓存预热
POST /api/cache
Authorization: Bearer your-admin-token
{
  "action": "warmup",
  "data": { "baseUrl": "https://your-domain.com" }
}

# 缓存失效
POST /api/cache
Authorization: Bearer your-admin-token
{
  "action": "invalidate",
  "data": { "pattern": "fortune:*" }
}

# 清空所有缓存
POST /api/cache
Authorization: Bearer your-admin-token
{
  "action": "clear",
  "data": { "confirmToken": "CONFIRM_CLEAR_ALL_CACHE" }
}
```

## 🌐 边缘缓存优化

### CDN配置

```javascript
// Vercel Edge Functions
export const config = {
  runtime: 'edge',
  regions: ['hkg1', 'sin1', 'nrt1', 'icn1'], // 亚太地区
}

// 缓存头部配置
const CACHE_HEADERS = {
  STATIC_ASSETS: {
    'Cache-Control': 'public, max-age=31536000, immutable',
  },
  API_RESPONSES: {
    'Cache-Control': 'public, max-age=300, s-maxage=600',
  },
}
```

### 条件请求支持

- **ETag**: 内容指纹验证
- **Last-Modified**: 修改时间验证
- **304 Not Modified**: 减少带宽使用

## 🔍 缓存策略

### 幸运饼干缓存

```typescript
// 缓存键生成
const requestHash = generateRequestHash({
  theme: 'inspirational',
  mood: 'positive',
  length: 'medium'
})

// 缓存时间: 24小时
await cacheManager.cacheFortune(requestHash, fortune)
```

### 搜索结果缓存

```typescript
// 缓存键: search:query:category:limit
const cacheKey = generateCacheKey('search', query, category, limit)

// 缓存时间: 1小时
await cacheManager.cacheFortuneList(cacheKey, results)
```

### API响应缓存

```typescript
// 自动缓存优化
const response = EdgeCacheManager.optimizeApiResponse(
  data,
  cacheKey,
  maxAge // 缓存时间（秒）
)
```

## 📈 性能监控

### 缓存指标

- **命中率**: 缓存命中次数 / 总请求次数
- **响应时间**: 缓存命中 vs 缓存未命中的响应时间
- **错误率**: 缓存操作失败率
- **内存使用**: Redis内存使用情况

### 监控面板

```typescript
// 获取性能统计
const stats = CachePerformanceMonitor.getStats()
console.log(`缓存命中率: ${stats.hitRate}%`)
```

## 🛠️ 缓存优化建议

### 1. 缓存键设计

- 使用有意义的前缀
- 包含版本信息
- 避免键冲突
- 合理的键长度

### 2. 过期策略

- 根据数据更新频率设置TTL
- 使用渐进式过期避免缓存雪崩
- 实现缓存预热机制

### 3. 内存管理

- 监控Redis内存使用
- 设置合理的最大内存限制
- 使用LRU淘汰策略

### 4. 网络优化

- 启用压缩
- 使用连接池
- 批量操作减少网络往返

## 🚨 故障排查

### 常见问题

1. **Redis连接失败**
   - 检查网络连接
   - 验证URL和Token
   - 确认防火墙设置

2. **缓存命中率低**
   - 检查缓存键生成逻辑
   - 验证TTL设置
   - 分析访问模式

3. **内存使用过高**
   - 检查大对象缓存
   - 优化数据结构
   - 调整过期时间

### 调试工具

```bash
# Redis CLI 连接
redis-cli -u $UPSTASH_REDIS_REST_URL

# 查看所有键
KEYS *

# 查看键的TTL
TTL key_name

# 查看内存使用
INFO memory
```

## 📚 最佳实践

1. **缓存预热**: 在部署后预热关键数据
2. **渐进式失效**: 避免同时失效大量缓存
3. **监控告警**: 设置缓存性能告警
4. **降级策略**: 缓存不可用时的降级方案
5. **数据一致性**: 确保缓存与数据源的一致性

## 🔗 相关资源

- [Upstash Redis 文档](https://docs.upstash.com/redis)
- [Vercel Edge Functions](https://vercel.com/docs/functions/edge-functions)
- [Redis 最佳实践](https://redis.io/docs/manual/patterns/)
- [HTTP 缓存指南](https://developer.mozilla.org/en-US/docs/Web/HTTP/Caching)
