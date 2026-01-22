# Fortune Cookie AI - 项目索引文档

> 自动生成时间: 2026-01-22
> 版本: 1.0.0

## 目录

- [项目概述](#项目概述)
- [技术栈](#技术栈)
- [目录结构](#目录结构)
- [核心架构](#核心架构)
- [API 端点索引](#api-端点索引)
- [核心库索引](#核心库索引)
- [组件索引](#组件索引)
- [页面路由索引](#页面路由索引)
- [数据库模型](#数据库模型)
- [测试索引](#测试索引)
- [脚本工具](#脚本工具)
- [博客内容](#博客内容)
- [快速导航](#快速导航)

---

## 项目概述

**Fortune Cookie AI** 是一个 SEO 优化的 AI 驱动幸运饼干生成器。

### 核心特性
- 🍪 500+ 预分类幸运饼干消息
- 🤖 OpenRouter AI 智能生成
- 🔐 Google OAuth + Apple Sign In 认证
- 📱 iOS 移动端支持
- 💾 三层缓存架构 (Edge/Redis/Database)
- 📈 完整的性能监控和分析
- 🔍 SEO 优化 (结构化数据、站点地图)

### 关键指标
| 指标 | 目标值 |
|------|--------|
| LCP | < 2.5s |
| INP | < 200ms |
| CLS | < 0.1 |
| API 响应 (缓存) | < 500ms |
| API 响应 (AI) | < 2s |

---

## 技术栈

### 核心框架
| 技术 | 版本 | 用途 |
|------|------|------|
| Next.js | 14.2.x | App Router, SSR/SSG |
| TypeScript | 5.4.x | 类型安全 |
| React | 18.3.x | UI 框架 |
| Prisma | 6.14.x | ORM |

### 数据层
| 技术 | 用途 |
|------|------|
| PostgreSQL | 主数据库 |
| Redis (Upstash) | 分布式缓存、速率限制 |

### AI & 认证
| 技术 | 用途 |
|------|------|
| OpenRouter API | AI 生成 (GPT-4o-mini) |
| NextAuth.js 4.x | Web 认证 (Google OAuth) |
| Apple/Google Auth | 移动端认证 |

### UI 组件
| 技术 | 用途 |
|------|------|
| shadcn/ui | 基础组件库 |
| Radix UI | 无障碍原语 |
| Tailwind CSS | 样式系统 |
| Framer Motion | 动画效果 |

### 测试
| 技术 | 用途 |
|------|------|
| Jest | 单元/集成测试 |
| Playwright | E2E 测试 |

---

## 目录结构

```
Fortune Cookie/
├── app/                    # Next.js App Router
│   ├── api/               # API 路由 (14 端点)
│   ├── blog/              # 博客页面
│   ├── browse/            # 浏览功能
│   ├── generator/         # AI 生成器
│   ├── messages/          # 消息浏览
│   └── [其他页面]/        # 静态内容页
├── components/            # React 组件 (80+)
│   ├── ui/               # shadcn/ui 基础组件
│   ├── generator/        # 生成器相关组件
│   ├── messages/         # 消息相关组件
│   ├── homepage/         # 首页组件
│   └── blog/             # 博客组件
├── lib/                   # 核心业务逻辑 (35+ 模块)
│   └── types/            # TypeScript 类型定义
├── prisma/               # 数据库
│   ├── schema.prisma    # 数据库模式 (14 模型)
│   └── migrations/      # 迁移文件
├── content/              # 内容文件
│   └── blog/            # MDX 博客文章 (36 篇)
├── tests/                # E2E 测试
│   └── e2e/             # Playwright 测试
├── __tests__/            # 单元测试
│   ├── api/             # API 测试
│   ├── lib/             # 库测试
│   └── components/      # 组件测试
├── scripts/              # 工具脚本 (9 个)
├── public/               # 静态资源
├── docs/                 # 文档
└── claudedocs/           # Claude 生成的文档
```

---

## 核心架构

### 数据流

```
┌─────────────┐     ┌───────────────┐     ┌─────────────┐
│   Client    │────▶│  Middleware   │────▶│  API Route  │
│  (Browser/  │     │  (Rate Limit, │     │  (Handler)  │
│   iOS App)  │     │   CORS, CSP)  │     │             │
└─────────────┘     └───────────────┘     └──────┬──────┘
                                                  │
                    ┌─────────────────────────────┼─────────────────────────────┐
                    │                             ▼                             │
              ┌─────┴─────┐               ┌───────────────┐              ┌──────┴──────┐
              │   Redis   │◀──Cache Hit──│  Cache Check  │──Miss──────▶│  OpenRouter │
              │  (5min)   │              │               │              │     AI      │
              └───────────┘              └───────────────┘              └─────────────┘
                                                  │
                                                  ▼
                                         ┌───────────────┐
                                         │  PostgreSQL   │
                                         │  (Analytics)  │
                                         └───────────────┘
```

### 缓存策略

| 层级 | 技术 | TTL | 用途 |
|------|------|-----|------|
| Edge | CDN + Browser | 变量 | 静态资源、API 响应头 |
| Redis | Upstash | 5min | Fortune 结果、会话 |
| Database | PostgreSQL | 永久 | 分析数据、预置消息 |

### AI 回退链

```
1. OpenRouter API (主要)
   ├── 成功 → 返回 AI 生成结果
   └── 失败 ↓
2. 预置数据库 (500+ 消息)
   ├── 匹配 → 返回预置结果
   └── 失败 ↓
3. 优雅降级 + 用户通知
```

### 认证架构

```
┌─────────────────────────────────────────────────────────────┐
│                      认证系统                                │
├─────────────────────────────┬───────────────────────────────┤
│         Web 认证            │         移动端认证             │
│      (NextAuth.js)          │     (自定义实现)               │
├─────────────────────────────┼───────────────────────────────┤
│ Provider: Google OAuth      │ Providers: Apple, Google      │
│ Session: Database           │ Session: MobileSession 表     │
│ Adapter: Prisma             │ Token: 安全随机生成           │
│ Cookie: next-auth.session   │ Header: Authorization Bearer  │
└─────────────────────────────┴───────────────────────────────┘
                              │
                              ▼
              ┌───────────────────────────────┐
              │        统一 User 模型         │
              │   (配额、收藏跨平台共享)      │
              └───────────────────────────────┘
```

---

## API 端点索引

### Fortune API

| 端点 | 方法 | 文件 | 描述 |
|------|------|------|------|
| `/api/fortune` | GET, POST | `app/api/fortune/route.ts` | AI 生成幸运饼干 |
| `/api/fortune/quota` | GET | `app/api/fortune/quota/route.ts` | 查询每日配额状态 |
| `/api/fortunes` | GET | `app/api/fortunes/route.ts` | 浏览和搜索预置消息 |

### 认证 API

| 端点 | 方法 | 文件 | 描述 |
|------|------|------|------|
| `/api/auth/[...nextauth]` | ALL | `app/api/auth/[...nextauth]/route.ts` | NextAuth 路由 |
| `/api/auth/session` | GET | `app/api/auth/session/route.ts` | 统一会话验证 (Web+移动) |
| `/api/auth/mobile/apple` | POST | `app/api/auth/mobile/apple/route.ts` | Apple Sign In |
| `/api/auth/mobile/google` | POST | `app/api/auth/mobile/google/route.ts` | Google Sign In |
| `/api/auth/mobile/session` | GET | `app/api/auth/mobile/session/route.ts` | 移动端会话验证 |

### 系统 API

| 端点 | 方法 | 文件 | 描述 |
|------|------|------|------|
| `/api/analytics` | POST | `app/api/analytics/route.ts` | 性能指标收集 |
| `/api/analytics/web-vitals` | POST | `app/api/analytics/web-vitals/route.ts` | Web Vitals 上报 |
| `/api/analytics/dashboard` | GET | `app/api/analytics/dashboard/route.ts` | 分析仪表板数据 |
| `/api/database` | GET | `app/api/database/route.ts` | 数据库健康检查 |
| `/api/cache` | GET, POST, DELETE | `app/api/cache/route.ts` | 缓存管理 |
| `/api/indexnow` | POST | `app/api/indexnow/route.ts` | 搜索引擎 URL 通知 |
| `/api/favorites` | GET, POST, DELETE | `app/api/favorites/route.ts` | 收藏管理 |

---

## 核心库索引

### AI & 生成

| 文件 | 主要导出 | 描述 |
|------|----------|------|
| `lib/openrouter.ts` | `OpenRouterClient`, `openRouterClient` | OpenRouter API 客户端 |
| `lib/fortune-database.ts` | `fortuneDatabase`, `searchFortunes`, `getFortunesByCategory` | 500+ 预置消息数据库 |
| `lib/fortune-utils.ts` | 工具函数 | Fortune 相关工具 |
| `lib/lucky-numbers.ts` | 幸运数字生成 | 幸运数字算法 |

### 缓存 & 性能

| 文件 | 主要导出 | 描述 |
|------|----------|------|
| `lib/redis-cache.ts` | `CacheManager`, `cacheManager`, `rateLimiters` | Redis 缓存和速率限制 |
| `lib/edge-cache.ts` | `EdgeCacheManager`, `CachePerformanceMonitor` | 边缘缓存和性能监控 |
| `lib/performance-budget.ts` | 性能预算 | 性能阈值配置 |

### 认证 & 配额

| 文件 | 主要导出 | 描述 |
|------|----------|------|
| `lib/auth.ts` | `authOptions` | NextAuth.js 配置 |
| `lib/auth-client.ts` | `useAuthSession`, `startGoogleSignIn`, `startSignOut` | 客户端认证钩子 |
| `lib/mobile-auth.ts` | `verifyAppleToken`, `verifyGoogleToken`, `createMobileSession` | 移动端认证 |
| `lib/quota.ts` | `getDailyQuotaStatus`, `recordFortuneUsage`, `consumeDailyQuota` | 配额系统 |

### 监控 & 分析

| 文件 | 主要导出 | 描述 |
|------|----------|------|
| `lib/error-monitoring.ts` | `ErrorMonitor`, `captureError`, `captureApiError` | 错误监控 |
| `lib/analytics-manager.ts` | 分析管理器 | 分析事件追踪 |
| `lib/session-manager.ts` | 会话管理 | 用户会话追踪 |

### SEO & 内容

| 文件 | 主要导出 | 描述 |
|------|----------|------|
| `lib/blog.ts` | `getBlogPosts`, `getPostBySlug`, `getAllTags` | 博客数据工具 |
| `lib/indexnow.ts` | IndexNow 客户端 | 搜索引擎通知 |
| `lib/site.ts` | `getImageUrl`, 站点配置 | 站点元数据 |

### 工具 & 配置

| 文件 | 主要导出 | 描述 |
|------|----------|------|
| `lib/utils.ts` | `cn`, `SeededRandom`, 工具函数 | 通用工具 |
| `lib/category-config.ts` | 分类配置 | Fortune 分类配置 |
| `lib/blob-urls.ts` | `getBlobUrl` | Vercel Blob URL 映射 |
| `lib/i18n-config.ts` | 国际化配置 | 多语言配置 |

---

## 组件索引

### 核心组件

| 组件 | 文件 | 描述 |
|------|------|------|
| `AIFortuneCookie` | `components/AIFortuneCookie.tsx` | 主 AI 幸运饼干组件 |
| `FortuneCookie` | `components/FortuneCookie.tsx` | 原始幸运饼干组件 |
| `FortuneCookieInteractive` | `components/FortuneCookieInteractive.tsx` | 交互式饼干 |
| `FortuneCookieStatic` | `components/FortuneCookieStatic.tsx` | 静态饼干展示 |

### 布局 & 导航

| 组件 | 文件 | 描述 |
|------|------|------|
| `Navigation` | `components/Navigation.tsx` | 主导航 |
| `Footer` | `components/Footer.tsx` | 页脚 |
| `RouteProgress` | `components/RouteProgress.tsx` | 路由进度条 |
| `BackgroundEffects` | `components/BackgroundEffects.tsx` | 动画背景 |

### 生成器组件 (`components/generator/`)

| 组件 | 描述 |
|------|------|
| `ThemeSelector` | 主题选择器 |
| `PersonalizationPanel` | 个性化面板 |
| `CookieDisplay` | 饼干显示 |
| `HeroSection` | 英雄区块 |
| `SEOContent` | SEO 内容 |
| `GenerationResult/` | 生成结果组件组 |
| `HistoryTabs/` | 历史标签组件组 |

### 消息组件 (`components/messages/`)

| 组件 | 描述 |
|------|------|
| `MessagesClientWrapper` | 消息客户端包装 |
| `MessagesSearchFilter` | 搜索过滤 |
| `MessageCategorySection` | 分类区块 |
| `MessageCardSkeleton` | 加载骨架 |
| `CopyButton` | 复制按钮 |
| `GenerateSimilarButton` | 生成相似按钮 |

### 首页组件 (`components/homepage/`)

| 组件 | 描述 |
|------|------|
| `CategoryQuickLinks` | 快速分类链接 |
| `HotFortuneCarousel` | 热门轮播 |
| `SectionDivider` | 区块分隔 |
| `UseCaseScenes` | 使用场景 |

### 博客组件 (`components/blog/`)

| 组件 | 描述 |
|------|------|
| `BlogCard` | 博客卡片 |
| `MDXComponents` | MDX 渲染组件 |
| `Pagination` | 博客分页 |

### UI 基础组件 (`components/ui/`)

shadcn/ui 组件: `accordion`, `badge`, `button`, `card`, `checkbox`, `dropdown-menu`, `input`, `label`, `progress`, `select`, `separator`, `skeleton`, `switch`, `tabs`, `textarea`, `chart`, `sonner`

### 功能组件

| 组件 | 文件 | 描述 |
|------|------|------|
| `FavoriteButton` | `components/FavoriteButton.tsx` | 收藏按钮 |
| `FavoritesList` | `components/FavoritesList.tsx` | 收藏列表 |
| `SocialShare` | `components/SocialShare.tsx` | 社交分享 |
| `Pagination` | `components/Pagination.tsx` | 通用分页 |
| `AnimatedCounter` | `components/AnimatedCounter.tsx` | 动画计数器 |
| `ScrollReveal` | `components/ScrollReveal.tsx` | 滚动显示 |
| `Testimonials` | `components/Testimonials.tsx` | 用户评价 |

### SEO & 性能组件

| 组件 | 文件 | 描述 |
|------|------|------|
| `SEO` | `components/SEO.tsx` | SEO 元数据 |
| `StructuredData` | `components/StructuredData.tsx` | JSON-LD 结构化数据 |
| `FAQStructuredData` | `components/FAQStructuredData.tsx` | FAQ Schema |
| `PerformanceMonitor` | `components/PerformanceMonitor.tsx` | Web Vitals 监控 |
| `AdSenseFacade` | `components/AdSenseFacade.tsx` | AdSense 懒加载 |

---

## 页面路由索引

### 主要页面

| 路由 | 文件 | 描述 |
|------|------|------|
| `/` | `app/page.tsx` | 首页 |
| `/generator` | `app/generator/page.tsx` | AI 生成器 |
| `/messages` | `app/messages/page.tsx` | 消息浏览 |
| `/messages/[category]` | `app/messages/[category]/page.tsx` | 分类消息 |
| `/browse` | `app/browse/page.tsx` | 高级浏览 |
| `/browse/category/[category]` | `app/browse/category/[category]/page.tsx` | 分类浏览 |
| `/blog` | `app/blog/page.tsx` | 博客列表 |
| `/blog/[slug]` | `app/blog/[slug]/page.tsx` | 博客文章 |

### 用户页面

| 路由 | 文件 | 描述 |
|------|------|------|
| `/favorites` | `app/favorites/page.tsx` | 收藏页 |
| `/history` | `app/history/page.tsx` | 历史记录 |
| `/profile` | `app/profile/page.tsx` | 用户资料 |

### 内容页面

| 路由 | 文件 | 描述 |
|------|------|------|
| `/how-to-make-fortune-cookies` | `app/how-to-make-fortune-cookies/page.tsx` | 制作指南 |
| `/funny-fortune-cookie-messages` | `app/funny-fortune-cookie-messages/page.tsx` | 搞笑消息 |
| `/who-invented-fortune-cookies` | `app/who-invented-fortune-cookies/page.tsx` | 历史起源 |
| `/recipes` | `app/recipes/page.tsx` | 食谱 |
| `/faq` | `app/faq/page.tsx` | 常见问题 |

### 系统页面

| 路由 | 文件 | 描述 |
|------|------|------|
| `/search` | `app/search/page.tsx` | 站内搜索 |
| `/privacy` | `app/privacy/page.tsx` | 隐私政策 |
| `/terms` | `app/terms/page.tsx` | 服务条款 |
| `/cookies` | `app/cookies/page.tsx` | Cookie 政策 |
| `/offline` | `app/offline/page.tsx` | 离线页面 |
| `/admin/analytics` | `app/admin/analytics/page.tsx` | 管理分析 |
| `/analytics` | `app/analytics/page.tsx` | 公开分析 |

### SEO 文件

| 文件 | 描述 |
|------|------|
| `app/sitemap.ts` | 动态站点地图 |
| `app/robots.ts` | Robots.txt |
| `app/manifest.ts` | PWA Manifest |

---

## 数据库模型

### 核心业务模型

| 模型 | 表名 | 描述 | 关键字段 |
|------|------|------|----------|
| `Fortune` | `fortunes` | 幸运饼干消息 | message, category, mood, popularity |
| `Favorite` | `favorites` | 用户收藏 | userId, message, luckyNumbers |
| `FortuneQuota` | `fortune_quota` | 每日配额 | userId/guestId, dateKey, usedCount |
| `FortuneUsage` | `fortune_usage` | 使用记录 | userId/guestId, theme, mood |

### 认证模型

| 模型 | 表名 | 描述 | 来源 |
|------|------|------|------|
| `User` | `auth_users` | 用户 | NextAuth + Mobile |
| `Account` | `auth_accounts` | OAuth 账户 | NextAuth |
| `Session` | `auth_sessions` | Web 会话 | NextAuth |
| `VerificationToken` | `auth_verification_tokens` | 验证令牌 | NextAuth |
| `MobileSession` | `mobile_sessions` | 移动端会话 | 自定义 |

### 监控模型

| 模型 | 表名 | 描述 |
|------|------|------|
| `UserSession` | `user_sessions` | 用户会话追踪 |
| `ApiUsage` | `api_usage` | API 使用统计 |
| `WebVital` | `web_vitals` | 性能指标 |
| `ErrorLog` | `error_logs` | 错误日志 |
| `CacheStats` | `cache_stats` | 缓存统计 |
| `UserFeedback` | `user_feedback` | 用户反馈 |

### 索引策略

```sql
-- 高频查询优化
@@index([category])
@@index([mood])
@@index([popularity])
@@index([timestamp])
@@index([userId])
@@index([dateKey])
@@index([category, mood])  -- 复合索引
```

---

## 测试索引

### 单元测试 (`__tests__/`)

| 文件 | 测试范围 |
|------|----------|
| `api/fortune.test.ts` | Fortune API |
| `api/fortune.security.test.ts` | Fortune 安全测试 |
| `api/auth.session.test.ts` | 认证会话 |
| `lib/redis-cache.test.ts` | Redis 缓存 |
| `lib/fortune-utils.test.ts` | Fortune 工具 |
| `lib/api-signature.test.ts` | API 签名 |
| `lib/api-auth.test.ts` | API 认证 |
| `lib/database-service.test.ts` | 数据库服务 |
| `lib/cache-integration.test.ts` | 缓存集成 |
| `components/AIFortuneCookie.test.tsx` | AI 饼干组件 |

### E2E 测试 (`tests/e2e/`)

| 文件 | 测试范围 |
|------|----------|
| `homepage.spec.ts` | 首页功能 |
| `generator.spec.ts` | 生成器页面 |
| `analytics.spec.ts` | 分析功能 |
| `optimizations.spec.ts` | 性能优化 |
| `service-worker.test.js` | Service Worker |

### 测试命令

```bash
# 单元测试
npm test                    # 运行所有测试
npm run test:watch          # 监视模式
npm run test:coverage       # 覆盖率报告
npm run test:ci             # CI 模式

# E2E 测试
npm run test:e2e            # 运行 E2E 测试
npm run test:e2e:ui         # Playwright UI
npm run test:e2e:headed     # 有头模式
npm run test:e2e:debug      # 调试模式

# 部署测试
npm run test:local          # 本地测试
npm run test:deployment     # 生产部署测试
```

---

## 脚本工具

| 脚本 | 文件 | 描述 |
|------|------|------|
| 数据库种子 | `scripts/seed-database.ts` | 初始化数据库数据 |
| Blob 上传 | `scripts/upload-to-blob.js` | 上传图片到 Vercel Blob |
| 部署测试 | `scripts/test-deployment.js` | 测试部署健康状态 |
| Vercel 检查 | `scripts/vercel-deployment-check.js` | Vercel 部署验证 |
| 安全审计 | `scripts/security-audit.sh` | 安全漏洞扫描 |
| 图标生成 | `scripts/generate-icons.js` | 生成应用图标 |
| 博客图片 | `scripts/download-blog-images.js` | 下载博客图片 |
| Ads.txt 测试 | `scripts/test-ads-txt.sh` | 测试 AdSense 配置 |
| 模型测试 | `scripts/test-model-conf.js` | 测试 AI 模型配置 |

---

## 博客内容

### 文章统计
- **总数**: 36 篇 MDX 文章
- **位置**: `content/blog/`

### 文章分类

#### AI & 技术
- `how-ai-writes-fortunes.mdx` - AI 如何编写 Fortune
- `ai-fortune-telling-trends-2025.mdx` - AI 占卜趋势
- `ai-lucky-numbers-algorithm-fortune-cookies.mdx` - 幸运数字算法
- `building-fortune-cookie-seo.mdx` - SEO 构建

#### 文化 & 历史
- `history-of-fortune-cookies.mdx` - Fortune Cookie 历史
- `fortune-cookies-japanese-origins.mdx` - 日本起源
- `british-vs-american-fortune-cookie-culture.mdx` - 英美文化差异
- `american-cultural-values-fortune-cookie-phrases.mdx` - 美国文化价值观

#### 实用指南
- `wedding-fortune-cookie-messages-guide-2025.mdx` - 婚礼指南
- `virtual-party-fortune-cookies-2025.mdx` - 虚拟派对
- `instagram-fortune-cookie-captions.mdx` - Instagram 文案
- `fortune-cookie-crafts-upcycling-ideas.mdx` - 手工创意

#### 教育 & 学习
- `learn-english-idioms-fortune-cookies.mdx` - 英语习语学习
- `esl-activities-fortune-cookies-teachers.mdx` - ESL 教学活动
- `microlearning-english-fortune-cookie-method.mdx` - 微学习方法

#### 心理学 & 自我提升
- `psychology-of-fortune-cookies.mdx` - Fortune Cookie 心理学
- `psychology-of-luck.mdx` - 幸运心理学
- `overcoming-decision-fatigue-ai-fortune-cookies.mdx` - 决策疲劳
- `modern-stoicism-resilience-ai-fortune-cookies.mdx` - 现代斯多葛主义

---

## 快速导航

### 常用命令

```bash
# 开发
npm run dev                 # 启动开发服务器

# 数据库
npm run db:studio           # 打开 Prisma Studio
npm run db:push             # 推送 Schema 变更
npm run db:seed             # 种子数据

# 测试
npm test                    # 运行单元测试
npm run test:e2e            # 运行 E2E 测试

# 构建
npm run build               # 生产构建
npm run type-check          # 类型检查
```

### 关键文件快速访问

| 用途 | 文件路径 |
|------|----------|
| AI 生成逻辑 | `lib/openrouter.ts` |
| 认证配置 | `lib/auth.ts` |
| 配额系统 | `lib/quota.ts` |
| 缓存管理 | `lib/redis-cache.ts` |
| 数据库模式 | `prisma/schema.prisma` |
| Fortune API | `app/api/fortune/route.ts` |
| 主页 | `app/page.tsx` |
| 生成器页面 | `app/generator/page.tsx` |
| 环境变量模板 | `.env.example` |

### 环境变量清单

**必需**:
- `DATABASE_URL` - PostgreSQL 连接
- `NEXTAUTH_SECRET` - NextAuth 密钥
- `NEXTAUTH_URL` - 应用 URL

**推荐**:
- `OPENROUTER_API_KEY` - AI 生成
- `UPSTASH_REDIS_REST_URL` - Redis 缓存
- `UPSTASH_REDIS_REST_TOKEN` - Redis 令牌
- `GOOGLE_CLIENT_ID` - Google OAuth
- `GOOGLE_CLIENT_SECRET` - Google OAuth

**可选**:
- `APPLE_BUNDLE_ID` - Apple Sign In
- `GOOGLE_IOS_CLIENT_ID` - iOS Google Sign In
- `GUEST_DAILY_LIMIT` - 访客配额 (默认: 1)
- `AUTH_DAILY_LIMIT` - 认证用户配额 (默认: 10)

---

## 相关文档

- [CLAUDE.md](../CLAUDE.md) - 项目详细说明
- [README.md](../README.md) - 项目 README
- [README-EN.md](../README-EN.md) - 英文 README
- [.env.example](../.env.example) - 环境变量模板

---

*此文档由 Claude Code 自动生成，基于项目结构分析。*
