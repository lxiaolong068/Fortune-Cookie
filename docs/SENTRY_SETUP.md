# 🐛 Sentry 错误监控设置指南

## 概述

本项目集成了 Sentry 错误监控系统，用于实时跟踪和监控生产环境中的错误、性能问题和用户行为。

## 🚀 快速开始

### 1. 创建 Sentry 项目

1. 访问 [Sentry.io](https://sentry.io/) 并创建账户
2. 创建新项目，选择 "Next.js" 平台
3. 获取项目的 DSN (Data Source Name)

### 2. 配置环境变量

在 `.env.local` 文件中添加以下配置：

```bash
# Sentry 配置
NEXT_PUBLIC_SENTRY_DSN=https://your-dsn@sentry.io/project-id
SENTRY_ORG=your-organization-slug
SENTRY_PROJECT=your-project-slug
SENTRY_AUTH_TOKEN=your-auth-token
```

### 3. 生产环境部署

在 Vercel 或其他部署平台的环境变量中配置：

- `NEXT_PUBLIC_SENTRY_DSN`: 项目 DSN（可公开）
- `SENTRY_ORG`: 组织名称
- `SENTRY_PROJECT`: 项目名称  
- `SENTRY_AUTH_TOKEN`: 认证令牌（保密）

## 📊 监控功能

### 错误跟踪

- **JavaScript 错误**: 自动捕获未处理的异常
- **Promise 拒绝**: 捕获未处理的 Promise 错误
- **API 错误**: 监控 API 调用失败
- **资源加载错误**: 跟踪图片、脚本等资源加载失败

### 性能监控

- **Web Vitals**: LCP, CLS, INP, FCP, TTFB
- **长任务监控**: 超过 50ms 的任务
- **内存使用**: 监控 JavaScript 堆内存
- **页面加载时间**: 跟踪页面性能

### 用户行为跟踪

- **用户操作**: 按钮点击、表单提交等
- **业务事件**: 幸运饼干生成、搜索等
- **会话信息**: 用户会话开始/结束
- **网络状态**: 在线/离线状态变化

## 🔧 自定义配置

### 错误过滤

在 `sentry.client.config.ts` 中配置错误过滤：

```typescript
beforeSend(event, hint) {
  // 过滤掉不需要的错误
  if (event.exception?.values?.[0]?.type === 'NetworkError') {
    return null
  }
  return event
}
```

### 性能采样

调整性能监控采样率：

```typescript
// 生产环境 10% 采样，开发环境 100%
tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0
```

### 用户上下文

设置用户信息：

```typescript
import { errorMonitor } from '@/lib/error-monitoring'

errorMonitor.setUser('user-id', 'user@example.com', 'username')
```

## 📈 使用示例

### 手动错误报告

```typescript
import { captureError } from '@/lib/error-monitoring'

try {
  // 可能出错的代码
} catch (error) {
  captureError(error, {
    component: 'MyComponent',
    action: 'user_action',
    additionalData: { key: 'value' }
  })
}
```

### API 错误监控

```typescript
import { captureApiError } from '@/lib/error-monitoring'

fetch('/api/endpoint')
  .catch(error => {
    captureApiError(error, '/api/endpoint', 'GET', 500, responseTime)
  })
```

### 性能问题报告

```typescript
import { capturePerformanceIssue } from '@/lib/error-monitoring'

const loadTime = performance.now() - startTime
capturePerformanceIssue('page_load', loadTime, 3000)
```

### 业务事件跟踪

```typescript
import { captureBusinessEvent } from '@/lib/error-monitoring'

captureBusinessEvent('fortune_generated', {
  theme: 'inspirational',
  source: 'ai',
  responseTime: 1200
})
```

## 🛡️ 隐私和安全

### 数据脱敏

- 自动过滤敏感信息（API 密钥、密码等）
- 用户数据匿名化处理
- 遵循 GDPR 和隐私法规

### 源码映射

- 生产环境上传源码映射到 Sentry
- 便于调试但不暴露源码给用户
- 使用 `hideSourceMaps: true` 隐藏映射文件

## 📊 监控仪表板

### 关键指标

1. **错误率**: 错误数量/总请求数
2. **响应时间**: API 和页面加载时间
3. **用户影响**: 受错误影响的用户数
4. **性能分数**: Web Vitals 综合评分

### 告警设置

建议设置以下告警：

- 错误率超过 1%
- 响应时间超过 3 秒
- LCP 超过 2.5 秒
- 新错误类型出现

## 🔍 故障排查

### 常见问题

1. **DSN 配置错误**: 检查环境变量是否正确
2. **网络问题**: 确保可以访问 Sentry 服务
3. **采样率过低**: 调整采样率以获取更多数据
4. **过滤过于严格**: 检查 beforeSend 过滤逻辑

### 调试模式

开发环境启用调试：

```typescript
debug: process.env.NODE_ENV === 'development'
```

## 📚 相关资源

- [Sentry Next.js 文档](https://docs.sentry.io/platforms/javascript/guides/nextjs/)
- [性能监控指南](https://docs.sentry.io/product/performance/)
- [错误监控最佳实践](https://docs.sentry.io/product/issues/)
- [Sentry CLI 工具](https://docs.sentry.io/product/cli/)
