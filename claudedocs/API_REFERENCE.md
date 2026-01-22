# Fortune Cookie AI - API 参考文档

> 自动生成时间: 2026-01-22

## 目录

- [认证](#认证)
- [Fortune API](#fortune-api)
- [认证 API](#认证-api)
- [收藏 API](#收藏-api)
- [分析 API](#分析-api)
- [系统 API](#系统-api)
- [错误处理](#错误处理)
- [速率限制](#速率限制)

---

## 认证

### Web 认证 (Cookie)
Web 客户端使用 NextAuth.js 的 cookie 会话自动认证。

### 移动端认证 (Bearer Token)
移动端客户端需要在请求头中包含 Bearer Token:

```http
Authorization: Bearer {mobile_session_token}
```

### 访客识别
未认证的访客通过以下方式识别:
1. `X-Client-Id` 请求头 (推荐)
2. IP 地址回退

---

## Fortune API

### 生成幸运饼干

**端点**: `POST /api/fortune`

**请求体**:
```typescript
interface FortuneRequest {
  theme?: 'inspirational' | 'love' | 'success' | 'wisdom' | 'funny' | 
          'birthday' | 'friendship' | 'health' | 'travel' | 'study';
  mood?: 'positive' | 'wisdom' | 'humor' | 'romance';
  length?: 'short' | 'medium' | 'long';
  tone?: 'classic' | 'modern' | 'playful' | 'poetic' | 'calm';
  language?: 'zh' | 'en';
  customPrompt?: string;  // 自定义提示 (最大 200 字符)
  scenario?: string;      // 使用场景
}
```

**响应**:
```typescript
interface FortuneResponse {
  success: true;
  data: {
    fortune: string;
    luckyNumbers: number[];
    category: string;
    theme: string;
    mood: string;
    length: string;
    source: 'ai' | 'database' | 'fallback';
    cached: boolean;
    responseTime: number;
  };
  quota?: {
    remaining: number;
    used: number;
    limit: number;
    resetAtUtc: string;
  };
}
```

**错误响应**:
```typescript
interface ErrorResponse {
  success: false;
  error: string;
  suggestion?: string;  // 429 错误时提供
  reset?: string;       // 配额重置时间
}
```

**状态码**:
| 状态码 | 描述 |
|--------|------|
| 200 | 成功生成 |
| 400 | 请求参数无效 |
| 429 | 配额已用尽 |
| 500 | 服务器错误 |

**示例**:
```bash
# 基本请求
curl -X POST https://fortunecookieai.com/api/fortune \
  -H "Content-Type: application/json" \
  -d '{"theme": "inspirational", "mood": "positive"}'

# 带自定义提示
curl -X POST https://fortunecookieai.com/api/fortune \
  -H "Content-Type: application/json" \
  -d '{"customPrompt": "给即将面试的人一句鼓励的话"}'

# 移动端 (带认证)
curl -X POST https://fortunecookieai.com/api/fortune \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {token}" \
  -d '{"theme": "success"}'
```

---

### 查询配额状态

**端点**: `GET /api/fortune/quota`

**请求头**:
```http
Authorization: Bearer {token}  # 可选，移动端
X-Client-Id: {client_id}       # 可选，访客识别
```

**响应**:
```typescript
interface QuotaResponse {
  success: true;
  data: {
    isAuthenticated: boolean;
    limit: number;         // 每日限额
    used: number;          // 已使用次数
    remaining: number;     // 剩余次数
    resetsAtUtc: string;   // UTC 重置时间
  };
}
```

**配额规则**:
| 用户类型 | 每日限额 | 重置时间 |
|----------|----------|----------|
| 访客 | 1 次 | UTC 午夜 |
| 认证用户 | 10 次 | UTC 午夜 |

---

### 浏览预置消息

**端点**: `GET /api/fortunes`

**查询参数**:
| 参数 | 类型 | 描述 |
|------|------|------|
| `category` | string | 筛选分类 |
| `mood` | string | 筛选情绪 |
| `style` | string | 筛选风格 |
| `length` | string | 筛选长度 |
| `query` | string | 搜索关键词 |
| `sortBy` | string | 排序方式: `popularity`, `random`, `newest` |
| `limit` | number | 返回数量 (默认: 20, 最大: 100) |
| `page` | number | 页码 |

**响应**:
```typescript
interface FortunesResponse {
  success: true;
  data: {
    fortunes: FortuneMessage[];
    total: number;
    page: number;
    limit: number;
    hasMore: boolean;
  };
}
```

---

## 认证 API

### 统一会话验证

**端点**: `GET /api/auth/session`

同时支持 Web (cookie) 和移动端 (Bearer token) 会话验证。

**请求头**:
```http
# 移动端
Authorization: Bearer {mobile_session_token}

# Web 端自动使用 cookie
```

**响应**:
```typescript
interface SessionResponse {
  user: {
    id: string;
    name: string | null;
    email: string | null;
    image: string | null;
  } | null;
  source: 'web' | 'mobile';  // 会话来源
}
```

---

### Apple Sign In (移动端)

**端点**: `POST /api/auth/mobile/apple`

**请求体**:
```typescript
interface AppleSignInRequest {
  identityToken: string;  // Apple 提供的 JWT
  user?: {
    email?: string;
    name?: {
      firstName?: string;
      lastName?: string;
    };
  };
  deviceId?: string;
}
```

**响应**:
```typescript
interface AuthResponse {
  success: true;
  data: {
    user: {
      id: string;
      name: string | null;
      email: string | null;
    };
    session: {
      token: string;      // 用于后续请求的 Bearer token
      expiresAt: string;  // 过期时间 (30 天)
    };
  };
}
```

---

### Google Sign In (移动端)

**端点**: `POST /api/auth/mobile/google`

**请求体**:
```typescript
interface GoogleSignInRequest {
  idToken: string;    // Google 提供的 ID token
  deviceId?: string;
}
```

**响应**: 与 Apple Sign In 相同

---

### 移动端会话验证

**端点**: `GET /api/auth/mobile/session`

**请求头**:
```http
Authorization: Bearer {mobile_session_token}
```

**响应**:
```typescript
interface MobileSessionResponse {
  success: true;
  data: {
    user: {
      id: string;
      name: string | null;
      email: string | null;
    };
    session: {
      expiresAt: string;
      provider: 'apple' | 'google';
    };
  };
}
```

---

## 收藏 API

### 获取收藏列表

**端点**: `GET /api/favorites`

**认证**: 必需

**查询参数**:
| 参数 | 类型 | 描述 |
|------|------|------|
| `limit` | number | 返回数量 (默认: 50) |
| `offset` | number | 偏移量 |

**响应**:
```typescript
interface FavoritesResponse {
  success: true;
  data: {
    favorites: Favorite[];
    total: number;
  };
}

interface Favorite {
  id: string;
  message: string;
  luckyNumbers: number[] | null;
  theme: string | null;
  category: string | null;
  createdAt: string;
}
```

---

### 添加收藏

**端点**: `POST /api/favorites`

**认证**: 必需

**请求体**:
```typescript
interface AddFavoriteRequest {
  message: string;
  luckyNumbers?: number[];
  theme?: string;
  category?: string;
  source?: string;
}
```

**响应**:
```typescript
interface AddFavoriteResponse {
  success: true;
  data: {
    favorite: Favorite;
  };
}
```

---

### 删除收藏

**端点**: `DELETE /api/favorites`

**认证**: 必需

**请求体**:
```typescript
interface DeleteFavoriteRequest {
  id: string;
}
```

---

## 分析 API

### 上报 Web Vitals

**端点**: `POST /api/analytics/web-vitals`

**请求体**:
```typescript
interface WebVitalPayload {
  name: 'CLS' | 'INP' | 'FCP' | 'LCP' | 'TTFB';
  value: number;
  delta: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  navigationType?: string;
  url?: string;
}
```

---

### 上报分析事件

**端点**: `POST /api/analytics`

**请求体**:
```typescript
interface AnalyticsPayload {
  type: 'user_action' | 'performance' | 'error' | 'business';
  action?: string;
  component?: string;
  data?: Record<string, unknown>;
}
```

---

### 获取分析仪表板

**端点**: `GET /api/analytics/dashboard`

**认证**: 需要管理员权限

**响应**:
```typescript
interface DashboardResponse {
  success: true;
  data: {
    webVitals: {
      LCP: MetricSummary;
      INP: MetricSummary;
      CLS: MetricSummary;
      FCP: MetricSummary;
      TTFB: MetricSummary;
    };
    apiUsage: {
      total: number;
      byEndpoint: Record<string, number>;
      avgResponseTime: number;
    };
    errors: {
      total: number;
      byLevel: Record<string, number>;
    };
  };
}
```

---

## 系统 API

### 数据库健康检查

**端点**: `GET /api/database`

**响应**:
```typescript
interface DatabaseHealthResponse {
  success: true;
  data: {
    connected: boolean;
    latency: number;
    stats: {
      fortunes: number;
      users: number;
    };
  };
}
```

---

### 缓存管理

**端点**: `GET /api/cache`

获取缓存统计信息。

**端点**: `POST /api/cache`

预热缓存。

**端点**: `DELETE /api/cache`

清除缓存。

---

### IndexNow URL 通知

**端点**: `POST /api/indexnow`

**认证**: 需要管理员令牌

**请求体**:
```typescript
interface IndexNowRequest {
  urls: string[];  // 要通知的 URL 列表
}
```

---

## 错误处理

### 错误响应格式

```typescript
interface ErrorResponse {
  success: false;
  error: string;
  code?: string;
  details?: Record<string, unknown>;
}
```

### 常见错误码

| 状态码 | 错误 | 描述 |
|--------|------|------|
| 400 | `INVALID_REQUEST` | 请求参数无效 |
| 401 | `UNAUTHORIZED` | 未认证 |
| 403 | `FORBIDDEN` | 权限不足 |
| 404 | `NOT_FOUND` | 资源不存在 |
| 429 | `RATE_LIMIT_EXCEEDED` | 速率限制 |
| 429 | `QUOTA_EXCEEDED` | 配额已用尽 |
| 500 | `INTERNAL_ERROR` | 服务器错误 |

---

## 速率限制

### 限制规则

| 端点 | 限制 | 窗口 |
|------|------|------|
| `/api/fortune` | 20 请求 | 10 秒 |
| `/api/fortunes` | 50 请求 | 10 秒 |
| 其他 API | 100 请求 | 10 秒 |

### 速率限制响应头

```http
X-RateLimit-Limit: 20
X-RateLimit-Remaining: 15
X-RateLimit-Reset: 1705920000
```

### 超出限制响应

```json
{
  "success": false,
  "error": "Rate limit exceeded",
  "retryAfter": 10
}
```

---

## CORS 配置

允许的来源:
- `https://fortunecookieai.com`
- `https://*.fortunecookieai.com`
- `http://localhost:3000` (开发环境)
- iOS App (通过 Authorization header)

允许的方法: `GET`, `POST`, `OPTIONS`, `DELETE`

允许的请求头: `Content-Type`, `Authorization`, `X-Client-Id`

---

## TypeScript 类型定义

完整的类型定义位于:
- `lib/types/generator.ts` - 生成器类型
- `lib/quota.ts` - 配额类型
- `lib/mobile-auth.ts` - 移动端认证类型

---

*此文档由 Claude Code 自动生成*
