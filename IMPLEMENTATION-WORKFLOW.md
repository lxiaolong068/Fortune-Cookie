# Fortune Cookie AI 实施工作流

> 基于 OPTIMIZATION-PLAN.md 深度分析 + 代码库验证
> 生成时间: 2026-02-14

---

## 工作流总览

```
Phase 1 (Week 1) ──────────────────────────────────────────────
  Track A: 游客配额放宽     ═══════ [2h]   ──┐
  Track B: 机器人过滤       ═══════ [1.5h] ──┤ 并行执行
  Track C: 中文博客修复     ═══════ [3h]   ──┘
                                              │
Phase 2 (Week 2) ──────────────────────────────────────────────
  Track D: SERP 标题优化    ═══════ [1.5h] ──┐ 并行
  Track E: FAQ Schema       ═══════ [1h]   ──┘
  Track F: 着陆页创建       ═══════ [3h]   ←─ 依赖 D 完成
                                              │
Phase 3 (Week 3-4) ────────────────────────────────────────────
  Track G: 社交分享增强     ═══════ [4h]   ──┐
  Track H: 用户回访机制     ═══════ [6h]   ──┤ 并行 (注意文件冲突)
  Track I: 博客导航修复     ═══════ [0.5h] ──┘
                                              │
Phase 4 (Week 3-4) ────────────────────────────────────────────
  Track J: 缓存策略调优     ═══════ [0.5h] ←─ 依赖 B 完成
  Track K: 移动端优化       ═══════ [3h]   ──  独立
```

**总预估工作量**: ~26 小时
**并行化节省**: ~40% (实际执行 ~16 小时)

---

## Phase 1: P0 紧急修复 (Week 1)

### 🔀 分支策略
```bash
git checkout -b feature/p0-critical-fixes
```

---

### Track A: 游客配额放宽 ⏱️ ~2h

**目标**: /generator 互动时长 17s → 45s+

| 步骤 | 任务 | 文件 | 风险 | 预估 |
|------|------|------|------|------|
| A1 | 修改配额常量 | `lib/quota.ts:4-5` | 🟢 低 | 15min |
| A2 | 更新环境变量 | `.env.local` | 🟢 低 | 5min |
| A3 | 创建配额用尽引导组件 | `components/AIFortuneCookie.tsx` | 🟡 中 | 45min |
| A4 | 验证配额行为 | 本地测试 | 🟢 低 | 30min |

#### A1: 修改配额常量
**文件**: [lib/quota.ts:4-5](lib/quota.ts#L4-L5)
```typescript
// 变更:
const DEFAULT_GUEST_DAILY_LIMIT = 1;   →  const DEFAULT_GUEST_DAILY_LIMIT = 5;
const DEFAULT_AUTH_DAILY_LIMIT = 10;   →  const DEFAULT_AUTH_DAILY_LIMIT = 20;
```

#### A2: 更新环境变量
**文件**: `.env.local`
```bash
GUEST_DAILY_LIMIT="5"
AUTH_DAILY_LIMIT="20"
```

#### A3: 创建配额用尽引导组件
**文件**: [components/AIFortuneCookie.tsx](components/AIFortuneCookie.tsx)
- 在现有组件内新增 `QuotaExhaustedPrompt` 子组件
- 配额用尽时引导用户: 登录升级 / 浏览 /explore / 浏览 /funny-fortune-cookie-messages
- 显示配额重置时间
- **⚠️ 注意**: Phase 3 的 Track G 和 Track H 也会修改此文件

#### A4: 验证
```bash
npm run dev
# 1. 以游客身份生成 5 次 fortune → 第 6 次应显示 QuotaExhaustedPrompt
# 2. 登录后生成 → 限额应为 20 次
# 3. 检查 /api/fortune/quota 返回正确数据
```

**完成标准**: ✅ 游客 5 次/天 | ✅ 登录用户 20 次/天 | ✅ 用尽引导正常显示

---

### Track B: 机器人流量过滤 ⏱️ ~1.5h

**目标**: 排除 ~10% 无效流量，数据准确性提升

| 步骤 | 任务 | 文件 | 风险 | 预估 |
|------|------|------|------|------|
| B1 | 添加 Bot UA 列表和检测函数 | `middleware.ts` | 🟡 中 | 20min |
| B2 | middleware 中添加 Bot 早期返回 | `middleware.ts` | 🟡 中 | 20min |
| B3 | GA 初始化添加 Bot 跳过 | `components/PerformanceMonitor.tsx` | 🟢 低 | 20min |
| B4 | GA4 后台配置 (手动) | Google Analytics 管理界面 | 🟢 低 | 30min |

#### B1-B2: middleware.ts Bot 检测
**文件**: [middleware.ts:65](middleware.ts#L65)
- 在 `middleware()` 函数开头 (pathname 提取之后) 添加 Bot 检测
- 匹配已知爬虫 UA: bot, spider, crawl, headlesschrome, puppeteer, lighthouse 等
- Bot 请求设置 `X-Is-Bot: true` header 并跳过后续处理
- **⚠️ 注意**: Phase 4 的 Track J 也会修改此文件的缓存头部分

#### B3: GA Bot 跳过
**文件**: [components/PerformanceMonitor.tsx](components/PerformanceMonitor.tsx)
- 在 `GoogleAnalytics` 组件的 `useEffect` 中添加 UA 检测
- Bot UA 直接 return，不初始化 GA 脚本

#### B4: GA4 后台配置 (手动操作)
- [ ] 管理 → 数据流 → 启用"排除已知机器人的流量"
- [ ] 创建数据过滤器: 排除 The Dalles 和 Ashburn 城市

**完成标准**: ✅ Bot UA 返回 X-Is-Bot | ✅ GA 不在 Bot 浏览器初始化 | ✅ GA4 过滤器已配置

---

### Track C: 中文博客修复 ⏱️ ~3h

**目标**: /zh/blog 跳出率 100% → 60%

| 步骤 | 任务 | 文件 | 风险 | 预估 |
|------|------|------|------|------|
| C1 | 检查中文 MDX 内容有效性 | `content/blog/zh/*.mdx` | 🟢 低 | 15min |
| C2 | 检查 blog.ts 的 locale 处理 | `lib/blog.ts` | 🟢 低 | 15min |
| C3 | 本地测试 /zh/blog 渲染 | 浏览器 | 🟢 低 | 15min |
| C4 | 修复发现的问题 | 取决于根因 | 🔴 高 | 1-2h |
| C5 | 验证修复效果 | 浏览器 | 🟢 低 | 15min |

#### C1-C3: 排查步骤
**发现**:
- ✅ `content/blog/zh/` 目录**存在**
- ✅ 路由使用动态 `app/[locale]/blog/` (非硬编码 `app/zh/`)
- ❓ 需要验证: zh MDX 文件是否有 frontmatter 问题、locale 是否在支持列表中

**排查重点**:
1. `content/blog/zh/` 中的 MDX 文件 frontmatter 是否完整
2. [lib/blog.ts](lib/blog.ts) 的 `getBlogPosts()` 和 `localeHasPosts()` 对 `zh` locale 的处理
3. [app/[locale]/blog/page.tsx](app/[locale]/blog/page.tsx) 的数据获取逻辑
4. 浏览器控制台是否有 hydration 错误或数据获取异常

#### C4: 可能的修复方向
- **场景 A**: MDX frontmatter 缺失/格式错误 → 修复 MDX 文件
- **场景 B**: locale 不在支持列表 → 更新 locale 配置
- **场景 C**: 数据获取函数未正确传递 locale → 修复 lib/blog.ts
- **场景 D**: Turbopack 缓存问题 → `rm -rf .next node_modules/.cache`

**完成标准**: ✅ /zh/blog 显示文章列表 | ✅ 文章详情页可访问 | ✅ 无控制台错误

---

### Phase 1 完成验证
```bash
# 1. 类型检查
npm run type-check

# 2. Lint
npm run lint

# 3. 单元测试
npm run test:ci

# 4. 本地构建
npm run build

# 5. E2E 测试
npm run test:e2e
```

---

## Phase 2: P1 SEO 优化 (Week 2)

### 🔀 分支策略
```bash
git checkout -b feature/p1-seo-optimization
```

---

### Track D: SERP 标题/描述优化 ⏱️ ~1.5h (可并行)

**目标**: CTR 2.94% → 6%

| 步骤 | 任务 | 文件 | 风险 | 预估 |
|------|------|------|------|------|
| D1 | 优化 /generator 页面 Meta | `app/generator/page.tsx` | 🟢 低 | 15min |
| D2 | 优化首页 Meta | `app/page.tsx` | 🟢 低 | 15min |
| D3 | 优化 /explore 页面 Meta | `app/explore/page.tsx` | 🟢 低 | 15min |
| D4 | 优化 /funny-fortune-cookie-messages Meta | `app/funny-fortune-cookie-messages/page.tsx` | 🟢 低 | 15min |
| D5 | 优化 /blog 页面 Meta | `app/blog/page.tsx` | 🟢 低 | 15min |

#### D1-D5: Meta 优化对照表

| 页面 | 当前 Title | 优化后 Title |
|------|-----------|-------------|
| /generator | AI Fortune Cookie Generator - Create Custom Messages | Free Fortune Cookie Generator - AI Powered \| Get Your Fortune Now |
| / | 动态生成 (generateSEOMetadata) | Fortune Cookie AI - Free Online Fortune Cookie Generator |
| /explore | 需确认当前值 | Browse 500+ Fortune Cookie Messages - Find Your Perfect Fortune |
| /funny-... | 需确认当前值 | 100+ Funny Fortune Cookie Messages - Hilarious Fortunes |
| /blog | 需确认当前值 | Fortune Cookie Blog - History, Meanings & Fun Facts |

**优化原则**:
- Title 以高搜索量关键词开头
- 包含行动号召 (CTA)
- Description 使用情感触发词 + 数量词 + 降门槛词

**完成标准**: ✅ 所有核心页面 Title 含关键词 | ✅ Description 含 CTA | ✅ 构建无错误

---

### Track E: FAQ Schema 注入 ⏱️ ~1h (可并行)

**目标**: SERP 富片段展示

| 步骤 | 任务 | 文件 | 风险 | 预估 |
|------|------|------|------|------|
| E1 | 首页添加 FAQ Schema | `app/page.tsx` | 🟢 低 | 20min |
| E2 | /generator 添加 FAQ Schema | `app/generator/page.tsx` | 🟢 低 | 20min |
| E3 | Rich Results Test 验证 | 外部工具 | 🟢 低 | 15min |

#### E1-E2: 实现细节
**已有组件**: ✅ `FAQStructuredData` (已存在于 `components/StructuredData.tsx`)
**已有工具函数**: ✅ `SEOUtils.generateFAQJSONLD` (已存在于 `components/SEO.tsx:217`)

只需在页面中导入并传入 FAQ 数据:
```typescript
import { FAQStructuredData } from "@/components/StructuredData";

// 在页面 JSX 中添加:
<FAQStructuredData faqs={[
  { question: "What is a fortune cookie generator?", answer: "..." },
  { question: "Is this fortune cookie generator free to use?", answer: "..." },
  // ... 更多 FAQ
]} />
```

**首页 FAQ** (5 个问题): 通用产品类 FAQ
**Generator FAQ** (3-4 个问题): 使用方式类 FAQ

#### E3: 验证
- Google Rich Results Test: https://search.google.com/test/rich-results
- 输入页面 URL 验证 FAQ Schema 被识别

**完成标准**: ✅ Rich Results Test 检测到 FAQ | ✅ 无 Schema 错误/警告

---

### Track F: 长尾关键词着陆页 ⏱️ ~3h (依赖 Track D)

**目标**: 搜索流量 +30%

**⚠️ 依赖**: 需要 Track D 完成后参考已建立的 Meta 模式

| 步骤 | 任务 | 文件 | 风险 | 预估 |
|------|------|------|------|------|
| F1 | 创建着陆页 | `app/free-online-fortune-cookie/page.tsx` (新建) | 🟡 中 | 1.5h |
| F2 | 更新 sitemap | `app/sitemap.ts` | 🟢 低 | 15min |
| F3 | 添加内部链接 | 多个页面 | 🟢 低 | 30min |
| F4 | 验证 | 浏览器 + SEO 工具 | 🟢 低 | 15min |

#### F1: 着陆页结构
**文件**: `app/free-online-fortune-cookie/page.tsx` (新建)
```
├── Metadata (title, description, canonical)
├── FAQStructuredData (2-3 个 FAQ)
├── Hero Section ("Free Online Fortune Cookie")
├── FortuneCookieInteractive (复用现有组件)
├── Feature Highlights (Free, No Signup, AI-Powered)
├── Internal Links (/generator, /explore, /funny-fortune-cookie-messages)
└── Footer CTA
```

**目标关键词**: "fortune cookie online free", "fortune cookie free online"

#### F2: sitemap 更新
**文件**: [app/sitemap.ts](app/sitemap.ts)
```typescript
// 在核心页面数组中添加:
{
  url: `${baseUrl}/free-online-fortune-cookie`,
  lastModified: new Date(),
  changeFrequency: 'weekly' as const,
  priority: 0.8,
}
```

#### F3: 内部链接
在以下页面添加指向新着陆页的链接:
- `app/page.tsx` (首页)
- `app/generator/page.tsx` (生成器页)
- `app/explore/page.tsx` (浏览页)

**完成标准**: ✅ 新页面可访问 | ✅ Sitemap 包含新 URL | ✅ 内部链接可点击

---

### Phase 2 完成验证
```bash
npm run type-check && npm run lint && npm run test:ci && npm run build
npm run test:e2e
# + Google Rich Results Test 验证 FAQ Schema
```

---

## Phase 3: P2 增长功能 (Week 3-4)

### 🔀 分支策略
```bash
git checkout -b feature/p2-growth-features
```

---

### Track G: 社交分享功能增强 ⏱️ ~4h

**目标**: 社交流量 0.51% → 5%

**⚠️ 文件冲突**: 与 Track A (Phase 1) 和 Track H 共享 `AIFortuneCookie.tsx`
**⚠️ 前置条件**: Phase 1 Track A 必须已合并

| 步骤 | 任务 | 文件 | 风险 | 预估 |
|------|------|------|------|------|
| G1 | 安装 html2canvas | `package.json` | 🟢 低 | 5min |
| G2 | 创建 FortuneShareCard 组件 | `components/FortuneShareCard.tsx` (新建) | 🟡 中 | 1.5h |
| G3 | 集成到 fortune 结果展示 | `components/AIFortuneCookie.tsx` | 🟡 中 | 1h |
| G4 | 测试 Twitter 分享 | 浏览器 | 🟢 低 | 30min |
| G5 | 测试图片下载 | 浏览器 | 🟢 低 | 30min |

#### G1: 依赖安装
```bash
npm install html2canvas
```

#### G2: FortuneShareCard 组件
**文件**: `components/FortuneShareCard.tsx` (新建)
- 渐变背景卡片 (amber/orange 色系)
- Fortune 消息 + 幸运数字展示
- 底部 "fortunecookieai.com" 水印
- "Share on X/Twitter" 按钮
- "Download Image" 按钮 (html2canvas)
- 可选: WhatsApp 分享按钮

#### G3: 集成到 AIFortuneCookie
**文件**: [components/AIFortuneCookie.tsx](components/AIFortuneCookie.tsx)
- 在 fortune 生成成功后的结果区域，渲染 `<FortuneShareCard />`
- 传入 message, luckyNumbers, theme

**完成标准**: ✅ 分享卡片渲染 | ✅ Twitter 分享打开正确 URL | ✅ 图片下载正常

---

### Track H: 用户回访机制 ⏱️ ~6h

**目标**: 回访率 0% → 15%

**⚠️ 文件冲突**: 与 Track G 共享 `AIFortuneCookie.tsx`，与 Track E (Phase 2) 共享 `app/page.tsx`
**⚠️ 前置条件**: Phase 2 必须已合并

| 步骤 | 任务 | 文件 | 风险 | 预估 |
|------|------|------|------|------|
| H1 | 创建 fortune 历史模块 | `lib/fortune-history.ts` (新建) | 🟢 低 | 30min |
| H2 | 创建每日签语 API | `app/api/fortune/daily/route.ts` (新建) | 🟡 中 | 45min |
| H3 | 创建 DailyFortune 客户端组件 | `components/DailyFortune.tsx` (新建) | 🟡 中 | 1.5h |
| H4 | 集成到首页 | `app/page.tsx` | 🟢 低 | 30min |
| H5 | 集成历史保存到 AIFortuneCookie | `components/AIFortuneCookie.tsx` | 🟢 低 | 30min |
| H6 | 验证 | 浏览器 | 🟢 低 | 30min |

#### H1: Fortune 历史模块
**文件**: `lib/fortune-history.ts` (新建)
- `saveFortune()`: 保存到 localStorage
- `getHistory()`: 获取历史记录 (最多 50 条)
- `clearHistory()`: 清除历史
- 自动管理最大条目数

#### H2: 每日签语 API
**文件**: `app/api/fortune/daily/route.ts` (新建)
- GET 请求返回当天固定签语
- 使用 Redis 缓存 (同一天返回同一条)
- 缓存 key: `daily-fortune:{dateKey}`
- TTL: 86400 秒 (24 小时)

#### H3-H4: DailyFortune 组件 + 首页集成
**文件**: `components/DailyFortune.tsx` (新建)
- 调用 `/api/fortune/daily` 获取每日签语
- 展示卡片: 日期 + 签语 + "每天回来查看新签语" 提示
- 集成到 [app/page.tsx](app/page.tsx) 的适当位置

**完成标准**: ✅ 每日签语在首页展示 | ✅ 同一天返回相同签语 | ✅ 历史记录持久化

---

### Track I: 博客导航修复 ⏱️ ~30min

**目标**: /blog 跳出率降低

| 步骤 | 任务 | 文件 | 风险 | 预估 |
|------|------|------|------|------|
| I1 | 清除 Turbopack 缓存 | 终端 | 🟢 低 | 5min |
| I2 | 验证博客链接渲染 | 浏览器 | 🟢 低 | 10min |
| I3 | 必要时修复渲染逻辑 | `components/Navigation.tsx` | 🟢 低 | 15min |

#### 调查结论
**代码分析**: Blog 链接**已存在**于 [components/Navigation.tsx](components/Navigation.tsx) 的 `navigationItems` 数组中。问题为 Turbopack 缓存，非代码缺陷。

```bash
rm -rf .next node_modules/.cache && npm run dev
# 验证桌面端导航栏中 Blog 链接可见
```

**完成标准**: ✅ 桌面端导航栏显示 Blog 链接

---

### Phase 3 完成验证
```bash
npm run type-check && npm run lint && npm run test:ci && npm run build
npm run test:e2e
```

---

## Phase 4: P3 精细化优化 (Week 3-4)

### 🔀 分支策略
```bash
git checkout -b feature/p3-polish
```

---

### Track J: 缓存策略调优 ⏱️ ~30min

**⚠️ 前置条件**: Phase 1 Track B 必须已合并 (共享 middleware.ts)

| 步骤 | 任务 | 文件 | 风险 | 预估 |
|------|------|------|------|------|
| J1 | 更新 Redis TTL | `lib/redis-cache.ts` | 🟢 低 | 15min |
| J2 | 更新页面缓存头 | `middleware.ts` | 🟢 低 | 15min |

#### J1: Redis TTL 调整
**文件**: [lib/redis-cache.ts](lib/redis-cache.ts)
```
fortune TTL:      86400 → 86400 (不变)
fortuneList TTL:  3600  → 7200  (1h → 2h)
analytics TTL:    1800  → 3600  (30min → 1h)
api TTL:          300   → 1800  (5min → 30min) ← 核心优化
```

#### J2: 页面缓存头
**文件**: [middleware.ts](middleware.ts) (handlePageCaching 函数)
```
首页 revalidate:  60s  → 300s
内容页 revalidate: 300s → 600s
```

**完成标准**: ✅ TTL 值更新 | ✅ 缓存头反映新值

---

### Track K: 移动端体验优化 ⏱️ ~3h

| 步骤 | 任务 | 文件 | 风险 | 预估 |
|------|------|------|------|------|
| K1 | 添加 reduced motion 检测 | `components/AIFortuneCookie.tsx` | 🟢 低 | 30min |
| K2 | 移动端动画简化 | `components/AIFortuneCookie.tsx`, 背景组件 | 🟡 中 | 45min |
| K3 | 移动端广告策略优化 | `components/AdSenseFacade.tsx` | 🟢 低 | 30min |
| K4 | 移动端视口测试 | Playwright / 浏览器 | 🟢 低 | 30min |

#### K1-K2: 动画优化
**文件**: [components/AIFortuneCookie.tsx](components/AIFortuneCookie.tsx)
- 检测 `prefers-reduced-motion` 和 `window.innerWidth < 768`
- 移动端: opacity-only 过渡 (0.2s)
- 桌面端: 保持现有 spring 动画

#### K3: 广告策略
**文件**: [components/AdSenseFacade.tsx](components/AdSenseFacade.tsx)
- 4G 移动网络: 3s 延迟后加载
- 非 4G 移动网络: 跳过广告加载
- 桌面端: 保持现有策略

**完成标准**: ✅ 移动端动画流畅 | ✅ 非 4G 移动设备无广告延迟

---

### Phase 4 完成验证
```bash
npm run type-check && npm run lint && npm run test:ci && npm run build
npm run test:e2e
```

---

## 依赖关系图

```
Phase 1                     Phase 2                     Phase 3                 Phase 4
─────────                   ─────────                   ─────────               ─────────
A (quota)  ─────────────────────────────────────────→ G (social share)
           │                                          └→ H (retention)
           │                D (SERP titles) ─────→ F (landing page)
B (bot)    │                E (FAQ schema)          │
           │                                        │                        J (cache) ←── B
C (zh blog)│                                        I (blog nav)             K (mobile)
           │
           └── Phase 1 验证 ──→ Phase 2 开始 ──→ Phase 3 开始 ──→ Phase 4 开始
```

### 文件冲突矩阵

| 文件 | Phase 1 | Phase 2 | Phase 3 | Phase 4 |
|------|---------|---------|---------|---------|
| `middleware.ts` | B1-B2 | - | - | J2 |
| `AIFortuneCookie.tsx` | A3 | - | G3, H5, K1-K2 | - |
| `app/page.tsx` | - | D2, E1 | H4 | - |
| `app/generator/page.tsx` | - | D1, E2 | - | - |
| `app/sitemap.ts` | - | F2 | - | - |

**冲突缓解策略**:
- 每个 Phase 使用独立 feature 分支
- Phase N+1 从 Phase N 合并后的 main 分支创建
- 同 Phase 内修改同一文件的 Track 需要串行执行

---

## 风险评估

| 风险项 | 概率 | 影响 | 缓解措施 |
|--------|------|------|----------|
| 中文博客根因不明 (C4) | 🟡 | 🔴 | 预留 2h buffer，准备 fallback 方案 |
| html2canvas 兼容性 (G2) | 🟡 | 🟡 | 准备 dom-to-image 作为备选方案 |
| 每日签语 Redis 不可用 (H2) | 🟢 | 🟡 | 降级到内存缓存或随机选取 |
| Bot 过滤误杀真实用户 (B1) | 🟢 | 🔴 | UA 列表保守选择，仅匹配确定的爬虫 |
| SEO Title 变更后 CTR 下降 (D1-D5) | 🟢 | 🟡 | 2 周观察期，备份旧 Title 以便回滚 |

---

## 衡量指标 & 验证时间线

| 指标 | 当前基线 | Phase 1 后 (1w) | Phase 2 后 (2w) | Phase 3-4 后 (4w) |
|------|----------|-----------------|-----------------|-------------------|
| 核心词 CTR | 2.94% | 2.94% (无变化) | 4.5% | 6%+ |
| /generator 互动时长 | 17s | 35s | 35s | 45s+ |
| 日均真实用户 | ~10 | ~10 (去除 Bot) | 12 | 18 |
| 回访率 | ~0% | ~0% | ~0% | 15% |
| 社交流量占比 | 0.51% | 0.51% | 0.51% | 5% |
| /zh/blog 跳出 | 100% | 60% | 40% | 40% |

### 部署后验证清单
- [ ] Google Rich Results Test 验证 FAQ Schema
- [ ] Search Console 监控 CTR 变化 (2 周后)
- [ ] GA4 对比优化前后互动时长
- [ ] GA4 验证 Bot 流量已排除
- [ ] 移动端 Lighthouse 评分 ≥ 90

---

## 快速启动命令

```bash
# Phase 1 开始
git checkout -b feature/p0-critical-fixes
# → 执行 Track A, B, C (并行)
# → npm run type-check && npm run build
# → PR → 合并到 main

# Phase 2 开始
git checkout main && git pull
git checkout -b feature/p1-seo-optimization
# → 执行 Track D, E (并行) → Track F (串行)
# → npm run type-check && npm run build
# → PR → 合并到 main

# Phase 3 开始
git checkout main && git pull
git checkout -b feature/p2-growth-features
# → 执行 Track G, H, I (并行，注意文件冲突)
# → npm run type-check && npm run build
# → PR → 合并到 main

# Phase 4 开始
git checkout main && git pull
git checkout -b feature/p3-polish
# → 执行 Track J, K (并行)
# → npm run type-check && npm run build
# → PR → 合并到 main
```
