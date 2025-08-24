# 🗄️ 数据库配置指南

## 概述

本项目使用 Prisma ORM 和 SQLite 数据库，提供了完整的数据库连接池管理、查询优化和性能监控功能。

## 🏗️ 数据库架构

### 核心表结构

1. **fortunes** - 幸运饼干数据
2. **user_sessions** - 用户会话管理
3. **api_usage** - API使用统计
4. **web_vitals** - 性能指标记录
5. **error_logs** - 错误日志
6. **cache_stats** - 缓存统计
7. **user_feedback** - 用户反馈

### 索引优化

- **复合索引**: category + mood, endpoint + timestamp
- **单字段索引**: popularity, createdAt, sessionId
- **性能优化**: 针对常用查询模式优化

## 🔧 环境配置

### 环境变量

```bash
# 数据库连接
DATABASE_URL="file:./dev.db"

# 连接池配置
DB_CONNECTION_LIMIT=10
DB_QUERY_TIMEOUT=10000
DB_CONNECTION_TIMEOUT=5000
DB_SLOW_QUERY_THRESHOLD=1000

# 管理员令牌
DATABASE_ADMIN_TOKEN=your_admin_token
```

### 开发环境设置

```bash
# 1. 生成 Prisma 客户端
npm run db:generate

# 2. 创建数据库和表
npm run db:push

# 3. 导入种子数据
npm run db:seed

# 4. 验证数据
npm run db:validate
```

## 📊 数据库管理

### 常用命令

```bash
# 数据库操作
npm run db:generate    # 生成 Prisma 客户端
npm run db:push        # 推送模式到数据库
npm run db:migrate     # 创建迁移文件
npm run db:studio      # 打开数据库管理界面

# 种子数据
npm run db:seed        # 导入种子数据
npm run db:seed:clean  # 清理后导入
npm run db:seed:force  # 强制重新导入
npm run db:validate    # 验证数据完整性

# 数据库重置
npm run db:reset       # 重置数据库并重新导入
```

### 数据库管理 API

```bash
# 健康检查
GET /api/database?action=health

# 统计信息 (需要管理员权限)
GET /api/database?action=stats

# 分析数据 (需要管理员权限)
GET /api/database?action=analytics&startDate=2024-01-01&endDate=2024-12-31

# 数据库清理 (需要管理员权限)
POST /api/database
{
  "action": "cleanup"
}

# 数据库优化 (需要管理员权限)
POST /api/database
{
  "action": "optimize"
}
```

## 🚀 性能优化

### 连接池管理

```typescript
// 连接池配置
const DATABASE_CONFIG = {
  connectionLimit: 10,        // 最大连接数
  queryTimeout: 10000,        // 查询超时 (10秒)
  connectionTimeout: 5000,    // 连接超时 (5秒)
  slowQueryThreshold: 1000,   // 慢查询阈值 (1秒)
}
```

### 查询优化

```typescript
// 分页查询优化
const { skip, take } = QueryOptimizer.buildPaginationQuery(page, limit)

// 搜索查询优化
const searchWhere = QueryOptimizer.buildSearchQuery(query)

// 排序查询优化
const orderBy = QueryOptimizer.buildSortQuery(sortBy, sortOrder)

// 过滤查询优化
const filterWhere = QueryOptimizer.buildFilterQuery(filters)
```

### 性能监控

```typescript
// 慢查询监控
prisma.$on('query', (e) => {
  if (e.duration > SLOW_QUERY_THRESHOLD) {
    capturePerformanceIssue('slow_database_query', e.duration, threshold)
  }
})

// 连接统计
const stats = DatabaseManager.getStats()
console.log(`查询统计: ${stats.queryStats}`)
```

## 📈 数据服务层

### Fortune 服务

```typescript
// 创建幸运饼干
const fortune = await FortuneService.create({
  message: "今天是美好的一天",
  category: "inspirational",
  mood: "positive",
  length: "medium"
})

// 获取分页列表
const { fortunes, total, hasMore } = await FortuneService.findMany({
  page: 1,
  limit: 20,
  category: "inspirational",
  search: "美好"
})

// 获取随机幸运饼干
const randomFortune = await FortuneService.findRandom("inspirational")

// 获取热门幸运饼干
const popularFortunes = await FortuneService.findPopular(10)
```

### 会话服务

```typescript
// 创建用户会话
const session = await SessionService.create({
  sessionId: "unique-session-id",
  userId: "user-123",
  data: { preferences: { theme: "dark" } },
  expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
})

// 清理过期会话
const cleanedCount = await SessionService.cleanupExpired()
```

### 统计服务

```typescript
// 记录 API 使用
await ApiUsageService.record({
  endpoint: "/api/fortune",
  method: "POST",
  statusCode: 200,
  responseTime: 150
})

// 记录 Web Vitals
await WebVitalService.record({
  name: "LCP",
  value: 2.1,
  delta: 0.5,
  rating: "good"
})
```

## 🔍 数据库监控

### 健康检查

```typescript
// 数据库连接检查
const isHealthy = await DatabaseManager.healthCheck()

// 获取连接统计
const stats = DatabaseManager.getStats()
```

### 性能指标

- **连接数**: 当前活跃连接数
- **查询统计**: 总查询数、慢查询数、平均响应时间
- **错误率**: 查询错误数和错误率
- **慢查询率**: 慢查询占比

### 告警设置

建议设置以下监控告警：

- 慢查询率超过 5%
- 数据库连接失败
- 查询错误率超过 1%
- 连接池使用率超过 80%

## 🛠️ 故障排查

### 常见问题

1. **连接超时**
   - 检查数据库文件权限
   - 验证 DATABASE_URL 配置
   - 确认连接池配置

2. **慢查询**
   - 检查索引使用情况
   - 优化查询条件
   - 考虑数据分页

3. **内存使用过高**
   - 检查连接池大小
   - 优化查询结果集
   - 及时关闭连接

### 调试工具

```bash
# 打开 Prisma Studio
npm run db:studio

# 查看数据库统计
npm run db:validate

# 检查慢查询日志
tail -f logs/slow-queries.log
```

## 📚 最佳实践

### 1. 连接管理

- 使用连接池避免频繁连接
- 及时关闭不需要的连接
- 监控连接池使用情况

### 2. 查询优化

- 使用适当的索引
- 避免 N+1 查询问题
- 合理使用分页和限制

### 3. 事务处理

- 保持事务简短
- 避免长时间锁定
- 合理处理事务失败

### 4. 数据维护

- 定期清理过期数据
- 优化数据库结构
- 备份重要数据

## 🔗 相关资源

- [Prisma 文档](https://www.prisma.io/docs/)
- [SQLite 优化指南](https://www.sqlite.org/optoverview.html)
- [数据库设计最佳实践](https://www.prisma.io/dataguide/)
- [性能监控指南](https://www.prisma.io/docs/guides/performance-and-optimization)
