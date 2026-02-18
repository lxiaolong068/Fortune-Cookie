# AdSense 审核优化 — 实施工作流

**基于**: `AdSense优化改进报告.md`
**生成日期**: 2026-02-18
**策略**: Systematic（分阶段、依赖明确、可并行执行）

---

## 代码库现状分析

### 关键发现

| # | 问题 | 根因 | 受影响文件 |
|---|------|------|-----------|
| 1 | `/zh/privacy` 等法律页面 404 | middleware i18n 重定向到不存在的路由 | `middleware.ts` |
| 2 | `/zh/favorites` 等导航页面 404 | 同上 — 所有页面仅在根路径 `app/*` 存在，无 `app/[locale]/` 结构 | `middleware.ts` |
| 3 | 虚假统计数据 (10,000+, 5,000+, 4.8 星) | 硬编码在 SocialProof + HeroSection | `components/SocialProof.tsx:14-18`, `components/generator/HeroSection.tsx:70` |
| 4 | 虚假用户评价 (8 条) | `lib/testimonials.ts` 自承 "fictional" | `lib/testimonials.ts:5,18-98` |
| 5 | 虚假 JSON-LD 结构化数据 | `aggregateRating` 硬编码假评分 | `components/SEO.tsx:183-187`, `components/StructuredData.tsx:64-87,450` |
| 6 | 无「关于我们」页面 | `app/about/` 不存在 | N/A (需新建) |
| 7 | AdSense `data-ns` 警告 | AdSenseFacade.tsx 本身无 data-ns，需进一步排查 Next.js Script 加载 | `components/AdSenseFacade.tsx` |

### 架构理解

```
当前 i18n 路由流程 (问题根源):

中文用户访问 /privacy
  → middleware 检测 Accept-Language: zh
  → 307 重定向到 /zh/privacy
  → Next.js 路由查找 app/zh/privacy/page.tsx → 不存在
  → 404 ❌

所有页面仅存在于 app/ 根目录:
  app/privacy/page.tsx ✅    app/[locale]/privacy/ ❌ 不存在
  app/favorites/page.tsx ✅  app/[locale]/favorites/ ❌ 不存在
  app/calendar/page.tsx ✅   app/[locale]/calendar/ ❌ 不存在
  ...
```

---

## 执行总览

```
Phase 1 (本周) ─ 致命问题修复 ─────────────────────────────────
  WF-1.1: i18n 路由修复        ═══════ [2h]   ──┐
  WF-1.2: 隐私政策 AdSense 条款 ═══════ [1h]   ──┤ 可并行
  WF-1.3: 虚假数据清理          ═══════ [3h]   ──┘
                                                  │
Phase 2 (2-4周) ─ 质量提升 ───────────────────────────────────
  WF-2.1: 创建 About 页面      ═══════ [2h]   ──┐
  WF-2.2: AdSense 脚本修复     ═══════ [1h]   ──┤ 可并行
  WF-2.3: 博客质量改善          ═══════ [4h+]  ──┘
                                                  │
Phase 3 (1-3月) ─ 流量积累 ───────────────────────────────────
  WF-3.1: SEO 持续优化          ═══════ [持续]
  WF-3.2: 外部推广              ═══════ [持续]
  WF-3.3: AdSense 再申请        ═══════ [里程碑]
```

**预估 Phase 1+2 工作量**: ~13h
**并行化节省**: ~40%

---

## Phase 1: 致命问题修复 (本周内)

### 🔀 分支策略
```bash
git checkout -b fix/adsense-critical-issues
```

---

### WF-1.1 修复 i18n 中间件路由 404 问题

**优先级**: 🔴 致命 — AdSense 审核直接拒因
**复杂度**: 中等
**文件变更**: `middleware.ts`

#### 问题本质

当用户 `Accept-Language` 包含 `zh`，middleware `handleLocaleDetection` 函数会 307 重定向到 `/zh/*` 路径。但所有页面路由仅存在于 `app/` 根目录，不存在 `app/[locale]/` 动态路由目录，导致所有 `/zh/*` URL 返回 404。

#### 方案对比

| 方案 | 描述 | 改动量 | 风险 |
|------|------|--------|------|
| **A: URL Rewrite** (推荐) | middleware 将 `/zh/*` rewrite 到 `/*`，保持 URL 不变 | 小 | 低 |
| B: 排除所有页面路径 | 在 `LOCALE_SKIP_PATHS` 中列出所有页面 | 小 | 中 (易遗漏新页面) |
| C: 创建 `[locale]` 目录 | 完全重构路由到 `app/[locale]/*` | 巨大 | 高 |

#### 推荐方案 A — 实施步骤

**核心思路**: 当路径已有 locale 前缀 (`/zh/*`)，不做 redirect，而是 rewrite 到对应的无前缀路径 (`/*`)，同时保持浏览器 URL 为 `/zh/*`。

```
步骤 1: 修改 handleLocaleDetection 函数
├── 文件: middleware.ts (约第 239-318 行)
├── 修改: 当 pathnameHasLocale === true 时
│   - 当前行为: 仅设置 cookie，返回 NextResponse.next()
│   - 新行为: 使用 NextResponse.rewrite() 将 /zh/privacy → /privacy
│   - 关键代码:
│     const rewriteUrl = new URL(request.url)
│     rewriteUrl.pathname = '/' + segments.slice(1).join('/')
│     const response = NextResponse.rewrite(rewriteUrl)
│     // 设置 x-locale header 供页面组件读取
│     response.headers.set('x-locale', firstSegment)
└── 注意: 保留现有 cookie 设置逻辑

步骤 2: 对不需要 redirect 的情况也做 rewrite
├── 当 preferredLocale !== defaultLocale 时
├── 当前: redirect 到 /zh/* (307)
├── 调整: 仍然 redirect (让 URL 变成 /zh/*)
├── 但要确保第一步的 rewrite 能正确处理到达的 /zh/* 请求
└── 验证: redirect + rewrite 链正常工作

步骤 3: 确保 handlePageCaching 传递 locale 信息
├── 文件: middleware.ts handlePageCaching 函数 (约第 505 行)
├── 确保 x-locale header 在 rewrite 场景下也正确传递
└── 页面组件可通过 headers() 读取当前 locale
```

#### 验证矩阵

| 测试场景 | URL | Accept-Language | 预期行为 |
|----------|-----|-----------------|---------|
| 英文用户访问法律页面 | `/privacy` | en | 200, 显示隐私政策 |
| 中文用户访问法律页面 | `/privacy` | zh | 307 → `/zh/privacy` → rewrite → 200 |
| 直接访问中文法律页面 | `/zh/privacy` | 任意 | rewrite 到 `/privacy` → 200 |
| 中文用户访问首页 | `/` | zh | 307 → `/zh` → rewrite → 200 |
| 英文用户访问首页 | `/` | en | 200 (不 redirect) |
| 中文用户访问收藏夹 | `/favorites` | zh | 307 → `/zh/favorites` → rewrite → 200 |
| API 路由不受影响 | `/api/fortune` | zh | 200 (跳过 locale 处理) |

#### 完成标准

- [ ] `/privacy`, `/terms`, `/cookies` 在所有语言环境下正常 200
- [ ] `/zh/privacy`, `/zh/terms`, `/zh/cookies` 正常 200
- [ ] `/zh/favorites`, `/zh/calendar`, `/zh/history`, `/zh/recipes`, `/zh/profile` 正常 200
- [ ] `/zh/blog`, `/zh/generator`, `/zh/explore` 正常 200
- [ ] 英文用户路由不受影响
- [ ] `npm run build` 通过

**依赖**: 无
**可并行**: 与 WF-1.3 并行

---

### WF-1.2 更新隐私政策 — 添加 AdSense 条款

**优先级**: 🔴 致命 — AdSense 明确要求
**复杂度**: 低
**文件变更**: `app/privacy/PrivacyPageContent.tsx`

#### 实施步骤

```
步骤 1: 在隐私政策中添加 AdSense/广告相关章节
├── 文件: app/privacy/PrivacyPageContent.tsx
├── 新增章节 "Third-Party Advertising" / "第三方广告":
│   - 声明网站使用 Google AdSense 投放个性化广告
│   - 说明 Google 及第三方使用 Cookie 基于访问记录展示广告
│   - 用户可通过 Google 广告设置 (https://adssettings.google.com) 管理偏好
│   - 用户可通过 NAI opt-out (https://optout.networkadvertising.org) 退出
│   - 链接到 Google 隐私政策 (https://policies.google.com/privacy)
│
├── 新增/更新章节 "Cookies and Tracking Technologies":
│   - 明确列出 AdSense 使用的 Cookie 类别
│   - 说明 DART cookie 用途
│   - 提供禁用第三方 Cookie 的浏览器设置指引
│
└── 确保内容清晰度:
    - 使用简洁非法律术语
    - 结构化标题分节
    - 中英文皆可理解 (根据页面当前语言)
```

#### 完成标准

- [ ] 隐私政策包含 "Google AdSense" 关键词
- [ ] 包含第三方 Cookie 使用说明
- [ ] 包含用户退出选项 (opt-out) 链接
- [ ] 包含 Google 隐私政策链接
- [ ] 页面可正常渲染且格式清晰

**依赖**: WF-1.1 (页面需先可访问)
**可并行**: 内容编写可提前，但验证需 WF-1.1 完成

---

### WF-1.3 移除虚假统计数据和伪造评价

**优先级**: 🟠 严重 — 违反 Google 欺骗性内容政策
**复杂度**: 中等
**文件变更**: 5-7 个文件

#### 受影响文件清单

| # | 文件 | 问题 | 行号 | 操作 |
|---|------|------|------|------|
| 1 | `components/SocialProof.tsx` | rating:4.8, reviewCount:1250, fortunes:10000, users:5000 | 14-18 | 移除或改用真实数据 |
| 2 | `components/generator/HeroSection.tsx` | "4.8/5 · 10,000+ fortunes generated" | 70 | 移除 badge |
| 3 | `components/SEO.tsx` | JSON-LD aggregateRating 4.8/1250 | 183-187 | 移除 aggregateRating |
| 4 | `components/StructuredData.tsx` | Recipe JSON-LD ratingCount:100 | 450 | 移除虚假 ratingCount |
| 5 | `components/StructuredData.tsx` | 虚假 testimonials → schema.org Review | 64-87 | 移除 Review markup |
| 6 | `lib/testimonials.ts` | 8 条 "fictional" 评价 | 5, 18-98 | 停止在前端渲染 |
| 7 | `components/Testimonials.tsx` | 渲染虚假评价组件 | 全文件 | 从首页隐藏 |

#### 实施步骤

```
步骤 1: SocialProof 组件处理
├── 选项 A (推荐): 改用真实可验证数据
│   - 保留 "500+ Fortune Messages" (来自 fortune-database.ts，可验证)
│   - 移除 rating/reviewCount (无真实评价系统)
│   - fortunesGenerated 改为从数据库查询实际数字 (如有)
│   - happyUsers 移除 (无法验证)
│
├── 选项 B: 从首页移除整个 SocialProof 组件
│   - 在 app/page.tsx 中移除 <SocialProof /> 调用
│   - 保留组件文件供未来使用
│
└── 文件: components/SocialProof.tsx, app/page.tsx

步骤 2: HeroSection badge 清理
├── 文件: components/generator/HeroSection.tsx:70
├── 移除 "4.8/5 · 10,000+ fortunes generated" 文本
└── 替换为真实描述 (如 "AI-Powered Fortune Generator" 或直接移除)

步骤 3: JSON-LD 结构化数据清理 (关键!)
├── 文件: components/SEO.tsx:183-187
│   └── 移除整个 aggregateRating 对象
│       (无真实评价系统，声明假评分可被 Google 处罚)
│
├── 文件: components/StructuredData.tsx:450
│   └── 移除 Recipe 的假 ratingCount: 100
│
└── 文件: components/StructuredData.tsx:64-87
    └── 移除基于虚假 testimonials 的 Review schema markup
    (保留其他有效的结构化数据)

步骤 4: Testimonials 处理
├── 选项 A (推荐): 从首页隐藏，保留代码
│   - 在 app/page.tsx 中注释/条件渲染 <Testimonials />
│   - 未来接入真实评价后可恢复
│
├── 选项 B: 完全删除
│   - 删除 lib/testimonials.ts
│   - 删除 components/Testimonials.tsx
│   - 清理所有 import 引用
│
└── 注意: Google 审核员会查看首页，虚假评价是直接拒绝原因

步骤 5: 验证结构化数据
├── 用 Google Rich Results Test 验证
├── 确认无 aggregateRating / Review 假数据
└── 确认保留的 schema 仍然有效
```

#### 完成标准

- [ ] 首页无不可验证的统计数字 (10k+, 5k+, 4.8 星, 1,250 评价)
- [ ] 首页无虚假用户评价 (Sarah M., James L. 等)
- [ ] Generator 页面无虚假 badge
- [ ] JSON-LD 中无 aggregateRating (或已对接真实数据)
- [ ] JSON-LD 中无虚假 Review markup
- [ ] Rich Results Test 验证通过
- [ ] 移除内容后页面布局无塌陷

**依赖**: 无
**可并行**: 与 WF-1.1 并行

---

### Phase 1 验证

```bash
# 全部完成后:
npm run type-check
npm run lint
npm run test:ci
npm run build
npm run test:e2e

# 手动验证:
# 1. 用 Chrome 设置 Accept-Language: zh → 访问 /privacy, /terms, /cookies
# 2. 检查首页无虚假数据
# 3. Google Rich Results Test 验证 JSON-LD
# 4. 浏览器控制台无 AdSense 警告
```

---

## Phase 2: 质量提升 (2-4 周内)

### 🔀 分支策略
```bash
git checkout main && git pull
git checkout -b feat/adsense-quality-improvements
```

---

### WF-2.1 创建「关于我们」页面

**优先级**: 🟡 一般 — 增强 E-E-A-T 信号
**复杂度**: 低
**文件变更**: 新建 2-3 个文件

#### 实施步骤

```
步骤 1: 创建 About 页面
├── 新建: app/about/page.tsx
│   - Server Component (SEO metadata)
│   - generateMetadata() for title, description, OG
│   - canonical URL and alternates
│
├── 新建: app/about/AboutPageContent.tsx
│   - Client Component ("use client")
│   - 内容:
│     ├── 网站使命: "用 AI 带来每日灵感"
│     ├── 创始人/团队简介
│     ├── 技术透明度: AI 如何生成内容
│     ├── 内容审核流程说明
│     ├── 联系方式 (email)
│     └── 隐私承诺链接 → /privacy
│
└── 风格: 遵循现有页面设计模式 (参考 privacy/PrivacyPageContent.tsx)

步骤 2: 添加导航链接
├── 文件: components/Footer.tsx
│   └── 在 "Company" 或 "About" 区块添加 /about 链接
│
└── 可选: components/Navigation.tsx
    └── 在导航菜单中添加 About 链接

步骤 3: 确保 i18n 兼容
└── /about 和 /zh/about 均可正常访问 (依赖 WF-1.1)

步骤 4: 更新 sitemap
├── 文件: app/sitemap.ts
└── 添加 /about URL
```

#### 完成标准

- [ ] `/about` 页面正常渲染
- [ ] 包含团队/创始人信息
- [ ] 包含 AI 内容生成说明
- [ ] Footer 有 About 链接
- [ ] Sitemap 包含 /about

**依赖**: WF-1.1 (i18n 路由修复)
**可并行**: 与 WF-2.2 并行

---

### WF-2.2 修复 AdSense 脚本技术问题

**优先级**: 🟡 一般
**复杂度**: 低-中
**文件变更**: 1-2 个文件

#### 排查与修复步骤

```
步骤 1: AdSense data-ns 警告排查
├── 文件: components/AdSenseFacade.tsx
├── 发现: 组件代码本身无 data-ns 属性
├── 排查方向:
│   1. 检查 Next.js <Script> 组件是否自动注入 data-ns
│   2. 检查是否有其他地方的 <script> tag 带有 data-ns
│   3. 用浏览器 DevTools 搜索 DOM 中的 data-ns 属性
│   4. 对比 Google 官方 AdSense 加载方式:
│      <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"
│              crossorigin="anonymous"></script>
│   5. 如果是 Next.js Script 的 strategy 问题:
│      - 尝试 strategy="afterInteractive" vs "lazyOnload"
│      - 确保无额外 data-* 属性
└── 修复: 根据排查结果调整脚本加载方式

步骤 2: /api/auth/session 500 错误修复
├── 文件: app/api/auth/session/route.ts (或 app/api/auth/[...nextauth]/route.ts)
├── 排查:
│   1. 检查 NEXTAUTH_SECRET 是否在生产环境中正确配置
│   2. 检查数据库连接 (PostgreSQL) 是否稳定
│   3. 检查 Session 表是否存在 (npx prisma db push)
│   4. 测试未登录用户访问 /api/auth/session 的响应
│      (应返回 { user: null }, 非 500)
│   5. 检查 authOptions 配置中的 adapter 是否正确
└── 修复: 根据排查结果修复配置或错误处理
```

#### 完成标准

- [ ] 浏览器控制台无 "data-ns" 警告
- [ ] `/api/auth/session` 未登录返回 200 (非 500)
- [ ] AdSense 脚本正常加载
- [ ] 无其他控制台错误

**依赖**: 无
**可并行**: 与 WF-2.1、WF-2.3 并行

---

### WF-2.3 改善博客内容质量

**优先级**: 🟡 一般 — Helpful Content 算法合规
**复杂度**: 中等 (内容工作为主)
**文件变更**: 5-10 篇 MDX 文件

#### 实施步骤

```
步骤 1: 审核现有博客文章
├── 目录: content/blog/en/ 和 content/blog/zh/
├── 评估标准:
│   - 搜索流量 (Search Console 数据)
│   - 内容独特性 (非纯模板化 AI 输出)
│   - 用户价值 (是否解答真实问题)
├── 产出: Top 5 优先优化列表
└── 工具: 可配合 Search Console 查看表现最好/最差的文章

步骤 2: 深度优化 Top 5 文章 (每篇 30-60min)
├── 每篇需要:
│   - 添加原创观点/个人体验/独特数据
│   - 增加内部链接 (到 /generator, /explore, /browse 等)
│   - 添加外部权威引用 (学术来源、行业报告)
│   - 优化 meta description 使其独特 (非模板化)
│   - 确保 H1/H2 层级合理
│   - 添加作者 byline
└── 文件: content/blog/ 下对应 MDX 文件

步骤 3: 添加作者信息
├── 在每篇博客文章 frontmatter 中添加 author 字段
├── 在博客详情页模板中显示作者名称
└── 作者链接指向 /about 页面

步骤 4: 调整发布节奏 (非代码，运营建议)
├── 当前: 47 篇集中在 1-2 月发布
├── 建议: 放慢到每周 2-3 篇
└── 新文章需确保有独特价值，非简单 AI 汇总
```

#### 完成标准

- [ ] Top 5 文章完成深度优化
- [ ] 每篇文章包含原创观点/数据
- [ ] 博客文章显示作者信息
- [ ] 内部链接密度提升

**依赖**: WF-2.1 (About 页面需先存在才能链接)
**可并行**: 步骤 1 可立即开始

---

### Phase 2 验证

```bash
npm run type-check && npm run lint && npm run test:ci && npm run build
npm run test:e2e

# 手动验证:
# 1. /about 页面正常显示
# 2. 浏览器控制台无 AdSense 警告
# 3. /api/auth/session 返回正常
# 4. 博客文章有作者信息和内部链接
```

---

## Phase 3: 流量积累与再申请 (1-3 个月)

### WF-3.1 SEO 持续优化 (持续性工作)

```
策略 1: 内部链接强化
├── 审核并增加页面间交叉链接
├── 确保博客文章链接到功能页面 (/generator, /explore)
└── 使用 InternalLinks 组件系统化管理

策略 2: 长尾关键词捕获
├── 分析 Search Console: 排名 5-20 的关键词
├── 优化对应页面内容或创建新着陆页
└── 目标: 核心关键词进前 5

策略 3: Core Web Vitals 保持
├── 定期 Lighthouse 审计
├── 监控 LCP < 2.5s, INP < 200ms, CLS < 0.1
└── 使用 IndexNow 即时通知搜索引擎新内容
```

### WF-3.2 外部推广 (持续性工作)

```
策略 1: 社交媒体
├── Twitter/X: 每日幸运饼干语录
├── Reddit: r/fortunecookie, r/quotes 等社区参与
└── Pinterest: 幸运饼干视觉内容

策略 2: 外链建设
├── 开发者社区分享技术实现 (DEV.to, Medium)
├── 论坛参与并自然引用网站
└── 寻求相关网站友情链接
```

### WF-3.3 AdSense 再申请检查清单

```
📋 再申请前必须全部 ✅:

基础合规:
├── [ ] 所有语言版本 /privacy, /terms, /cookies 正常显示 (非 404)
├── [ ] 隐私政策包含 Google AdSense / 第三方 Cookie 说明
├── [ ] 服务条款页面正常显示
├── [ ] 所有导航链接无 404 错误
└── [ ] ads.txt 正确配置 ✅ (已完成)

内容诚信:
├── [ ] 无虚假统计数据 (10k+, 5k+ 等)
├── [ ] 无伪造用户评价
├── [ ] JSON-LD 无虚假 aggregateRating / Review
└── [ ] 博客内容符合 Helpful Content 标准

网站质量:
├── [ ] 拥有 About 页面
├── [ ] AdSense 脚本无控制台警告
├── [ ] /api/auth/session 不返回 500
└── [ ] Core Web Vitals 达标

流量门槛:
├── [ ] 日均有机点击 > 30 次 (稳定 2 周以上)
├── [ ] 来自多个国家/地区的自然流量
└── [ ] 非 Bot 流量占比 > 90%
```

---

## 依赖关系图

```
                    ┌─────────────┐
                    │  WF-1.1     │
                    │  i18n 路由   │ ←── 最高优先级
                    │  修复        │
                    └──────┬──────┘
                           │
              ┌────────────┼────────────┐
              │            │            │
              ▼            ▼            │
       ┌──────────┐ ┌──────────┐       │
       │ WF-1.2   │ │ WF-1.3   │       │
       │ 隐私政策  │ │ 虚假数据  │       │ (WF-1.3 可与 WF-1.1 并行)
       │ AdSense  │ │ 清理     │       │
       └────┬─────┘ └────┬─────┘       │
            │             │             │
            ▼             ▼             ▼
       ┌──────────┐ ┌──────────┐ ┌──────────┐
       │ WF-2.1   │ │ WF-2.2   │ │ WF-2.3   │
       │ About    │ │ AdSense  │ │ 博客质量  │  ←── 全部可并行
       │ 页面     │ │ 脚本修复  │ │ 改善     │
       └────┬─────┘ └──────────┘ └──────────┘
            │
            ▼
       ┌──────────────────────┐
       │  WF-3.1 / 3.2 / 3.3 │
       │  流量积累 + 再申请    │
       └──────────────────────┘
```

**并行执行建议**:
- **批次 1** (立即开始): WF-1.1 + WF-1.3
- **批次 2** (WF-1.1 完成后): WF-1.2
- **批次 3** (Phase 1 完成后): WF-2.1 + WF-2.2 + WF-2.3 (全部并行)
- **持续**: WF-3.1 + WF-3.2，达标后 WF-3.3

---

## 文件冲突矩阵

| 文件 | WF-1.1 | WF-1.2 | WF-1.3 | WF-2.1 | WF-2.2 | WF-2.3 |
|------|--------|--------|--------|--------|--------|--------|
| `middleware.ts` | ✏️ | | | | | |
| `app/privacy/PrivacyPageContent.tsx` | | ✏️ | | | | |
| `components/SocialProof.tsx` | | | ✏️ | | | |
| `components/generator/HeroSection.tsx` | | | ✏️ | | | |
| `components/SEO.tsx` | | | ✏️ | | | |
| `components/StructuredData.tsx` | | | ✏️ | | | |
| `lib/testimonials.ts` | | | ✏️ | | | |
| `components/Testimonials.tsx` | | | ✏️ | | | |
| `app/page.tsx` | | | ✏️ | | | |
| `app/about/page.tsx` | | | | 🆕 | | |
| `components/Footer.tsx` | | | | ✏️ | | |
| `app/sitemap.ts` | | | | ✏️ | | |
| `components/AdSenseFacade.tsx` | | | | | ✏️ | |
| `content/blog/**/*.mdx` | | | | | | ✏️ |

✏️ = 修改  🆕 = 新建

**无冲突**: 所有 Phase 1 任务互不冲突，可完全并行。

---

## 风险评估

| 风险 | 概率 | 影响 | 缓解措施 |
|------|------|------|---------|
| middleware rewrite 逻辑影响现有英文用户 | 中 | 高 | feature branch + 全面测试矩阵 |
| 移除 SocialProof 后首页视觉空洞 | 低 | 中 | 替换为真实可验证数据或调整布局 |
| JSON-LD 移除 aggregateRating 后搜索外观变化 | 低 | 低 | 仅移除虚假数据，保留其他有效 schema |
| 博客内容修改影响现有排名 | 低 | 中 | 逐篇优化，不批量修改，保留原始 URL |
| AdSense 即使修复后仍因流量不足被拒 | 高 | 中 | Phase 3 持续流量积累是长期任务 |

---

## 预计时间线

```
Week 1: Phase 1 全部完成
  ├── Day 1-2: WF-1.1 (i18n 路由) + WF-1.3 (虚假数据) 并行
  ├── Day 3: WF-1.2 (隐私政策) + Phase 1 验证
  └── Day 4-5: PR review + 合并

Week 2-3: Phase 2 全部完成
  ├── WF-2.1 (About 页面)
  ├── WF-2.2 (AdSense 脚本)
  └── WF-2.3 (博客质量，可能跨周)

Month 2-4: Phase 3 持续执行
  └── 流量达标 (日均 30+ 点击) 后重新申请 AdSense
```

---

*工作流由 /sc:workflow 生成 | 2026-02-18*
