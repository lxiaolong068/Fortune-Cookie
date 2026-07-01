# 重构方案：让 `/[locale]` 子树静态化且 `<html lang>` 正确

> 状态：**方案 F 已实施并验证**（2026-07-01）。作者：P3 Lighthouse 优化 pass 的后续。

## 0. 实施结果（方案 F）

已落地多根布局：删除 `app/layout.tsx`；新增 `app/_shell/AppShell.tsx`（共享 `<html>/<head>/<body>`+全局外壳，无 headers()）；36 个英文路由移入路由组 `app/(main)/`（URL 不变，`git mv` 保留历史）并由 `app/(main)/layout.tsx`（`lang="en"`）承载；`app/[locale]/layout.tsx` 升为根布局（`lang={params.locale}`）。nonce 形参从 AppShell 移除（本就惰性）。

验证（`next start` 实测）：
- `type-check` 0、`build` 0，无回归。
- `<html lang>` **服务端即正确**：`/zh`→zh、`/es`→es、`/zh/blog/[post]`→zh；英文页→en。
- 缓存（`x-nextjs-cache: HIT`）：`/`、`/zh`(首页)、`/zh/generator`、`/zh/explore`、`/zh/blog/[post]`（数十篇）、`/zh/tag/*`、`/zh/browse/category/*`、`/es` 等均真·预渲染/ISR。
- **关键经验**：`[locale]` 页面需**各自**加 `export const dynamic = "force-static"` 才会真正预渲染（其 client 子树含动态 hook；仅靠 layout 的 generateStaticParams 不够）。已对首页/explore/blog[slug]/browse-category/tag[tag]/generator 添加。
- 保持动态（与英文对应页一致，因分页 searchParams）：`/[locale]/blog`(索引)、`/[locale]/browse`(索引)、`/[locale]/messages`(索引)。其中 `/messages`、`/browse/category/*` 走既有 308→`/explore` 重定向（英文同样，非回归）。

待办（独立）：① ~~中文旧 URL 404 修复~~ **已完成**——在 `next.config.js redirects()` 加了 locale-scoped 301：`/:locale(zh|es|pt)/history`→`/:locale/blog/history-of-fortune-cookies`、`/free-online-fortune-cookie`→`/:locale/generator`、`/calendar`→`/:locale`、`/fortune-cookie-quotes/*`→`/:locale/explore`；实测 308→目标(200)，合法 `/zh/*` 未误伤。② 若想缓存 `/zh/blog` 索引（GA #1 页），需对 en+zh 的 blog 索引统一改造分页（去 searchParams），属独立工作项。

---
以下为原始提案，保留备查。

## 1. 背景与问题

根 layout [`app/layout.tsx`](../app/layout.tsx) 调用 `headers()` 读取 `x-locale`/`x-nonce`，并独占渲染 `<html lang={locale}>`。

经生产构建 + `next start` 实测确认：

- **根 `/` 已修复**：改用 `force-static`（去掉 `runtime = "edge"`）后是真正的静态 + ISR（`x-nextjs-cache: HIT`）。
- **整个 `app/[locale]/` 子树在运行时是动态的**（`Cache-Control: no-store`，不在 `prerender-manifest` 里），连构建标为 `● SSG` 的 `/zh/generator` 也是。原因：根 layout 的 `headers()` 让这些没有 `force-static` 的页面退化为逐请求渲染。
- 当前动态渲染下，`/zh` 的 `<html lang="zh">` 是**正确**的（middleware 转发 `x-locale`）。
- 若给 `[locale]` 页面加 `force-static` 使其静态：`headers()` 返回空 → 根 `<html>` 预渲染成 `lang="en"`，对 zh/es/pt 是 SEO 倒退。

**目标**：`[locale]` 页面既能静态缓存，`<html lang>` 又是服务端正确的（zh/es/pt）。

## 2. 结构性约束（为什么不能简单加 `force-static`）

- Next.js App Router 中**只有根 layout 能渲染 `<html>`/`<body>`**。
- `app/[locale]` 嵌套在 `app/layout.tsx` 之下。只要 `app/layout.tsx` 存在，它就先渲染 `<html>`；`[locale]/layout.tsx` 无法再渲染一个 `<html>`（否则嵌套非法）。
- 因此，要让 `[locale]` 拥有自己的 `<html lang={params.locale}>`，**必须把 `app/layout.tsx` 从 `[locale]` 的祖先链中移除**。

## 3. 现状规模与真实流量（决定方案取向）

**路由结构**
- 根级 page 路由：**36 个**（其中 24 个已 `force-static`）。
- `[locale]` 已本地化的 page 类型：**仅 8 个**（`/`、`/blog`、`/blog/[slug]`、`/browse`、`/browse/category/[category]`、`/explore`、`/generator`、`/messages`、`/tag/[tag]`）。
- 本地化站点是**有意为之的小子集**（页面类型层面），绝大多数页面只在根路径提供英文。任何方案都必须保留这一点，不得给 28 个纯英文页凭空生成 `/zh/*` URL。

**真实流量（GA4，过去 28 天 2026-06-03 ~ 06-30；全站 1,363 浏览 / 895 活跃用户）**

| 子树 | 浏览次数 | 占比 | 活跃用户 | 占比 |
|------|---------|------|---------|------|
| `/zh` | 643 | **47.2%** | 574 | **64.1%** |
| `/es` | 37 | 2.7% | 14 | 1.6% |
| `/pt` | 11 | 0.8% | 7 | 0.8% |
| **合计 `[locale]`** | **~691** | **~50.7%** | **~595** | **~66.5%** |

- ⚠️ **结论反转**：`[locale]` 子树并非"低流量"，而是**全站过半浏览、约三分之二活跃用户**的来源，且几乎全部来自**中文 `/zh`**。单页 `/zh/blog` 就有 **355 浏览（占全站 26%，全站第一名）**、270 活跃用户。`/es`、`/pt` 确实很小。
- ⚠️ **附带发现（另一独立问题）**：GA 里 `/zh/history`(24)、`/zh/calendar`(22)、`/zh/fortune-cookie-quotes/good-luck`(32)、`/zh/free-online-fortune-cookie`(12) 等有真实自然流量，但当前 `app/[locale]/` **没有对应路由**——很可能是 v2 重建前的旧 URL 现在 404 或缺失本地化版本。这批 URL 合计约 90+ 浏览/28 天，值得单独排查（恢复本地化路由或做 301 重定向），与本缓存重构互不依赖。

## 4. 备选方案

### 方案 A —— 全量迁移到 `[locale]`（不推荐）
把 36 个路由全搬进 `app/[locale]/`，根 layout `return children`，`[locale]/layout` 渲染 `<html lang={params.locale}>` 并 `generateStaticParams` 含 `en`，middleware 把 `/x` 内部 rewrite 到 `/en/x`。
- ❌ 需要为 28 个纯英文页决定是否生成各语言 URL —— 是产品决策，且极大扩张 URL 面与 hreflang/canonical 维护成本。**与"小子集本地化"的现状冲突，排除。**

### 方案 F —— 多根布局（Multiple Root Layouts）【结构上正确的推荐项】
利用 Next.js「移除 `app/layout.tsx` + 每个顶层分支各自提供根布局」的能力，把默认语言分支与 `[locale]` 分支拆成两个独立的根布局。

目标结构：
```
app/
  (main)/                 # 路由组，不影响 URL
    layout.tsx            # 根布局①：<html lang="en">，包裹全部 36 个英文页
    about/ generator/ ... # 现有 36 个根级路由整体移入
  [locale]/
    layout.tsx            # 根布局②：<html lang={params.locale}>
    page.tsx browse/ ...  # 现有 8 个本地化页
  layout.tsx  ← 删除
  _shell/AppShell.tsx     # 抽出的共享外壳（见下）
```

共享外壳（避免两个根布局重复上百行 chrome）：
```tsx
// app/_shell/AppShell.tsx —— 纯静态，无 headers()
export function AppShell({ lang, dir = "ltr", children }: {
  lang: string; dir?: string; children: React.ReactNode;
}) {
  return (
    <html lang={lang} dir={dir} suppressHydrationWarning>
      <head>
        <CriticalCSS />
        <WebsiteStructuredData />        {/* 去掉 nonce 传参，见 §6 */}
        <OrganizationStructuredData />
        {/* preconnect / dns-prefetch / icons / manifest ... */}
        <ThemeScript />
      </head>
      <body className={inter.className} suppressHydrationWarning>
        {/* ThemeInitializer / Navigation / <main>{children}</main> / Footer / Toaster ... */}
        {children}
      </body>
    </html>
  );
}
```
```tsx
// app/(main)/layout.tsx
export default function RootLayoutEn({ children }: { children: React.ReactNode }) {
  const t = getTranslation(loadTranslationsSync("en"), "common.skipToContent");
  return <AppShell lang="en"><LocaleProvider initialLocale="en" ...>{children}</LocaleProvider></AppShell>;
}
```
```tsx
// app/[locale]/layout.tsx —— 现有文件升级为根布局
export function generateStaticParams() {
  return i18n.locales.filter(l => l !== i18n.defaultLocale).map(locale => ({ locale }));
}
export default async function RootLayoutLocale({ children, params }: LocaleLayoutProps) {
  if (!isValidLocale(params.locale)) notFound();
  const dir = languages[params.locale].dir;
  const translations = await loadTranslations(params.locale);
  return (
    <AppShell lang={params.locale} dir={dir}>
      <LocaleProvider initialLocale={params.locale} initialTranslations={translations}>
        {children}
      </LocaleProvider>
    </AppShell>
  );
}
```

要点/影响：
- `[locale]` 页面加 `force-static`（或依赖 `generateStaticParams`）→ 真正预渲染，`<html lang="zh">` **服务端正确**。✅
- 根 `headers()` 彻底移除 → nonce 管线随之删除（本就惰性，见 §6）；`/` 等页面无需 `force-static` 也能静态。
- 36 个根路由移入 `(main)/` 是**机械移动**：路由组不改变 URL；`@/` 别名导入不受影响；需连带移动 `loading.tsx` 等特殊文件。
- middleware 的 locale 逻辑基本不变（仍负责 `/en/*` → `/*` 规范化、cookie/Accept-Language 重定向到 `/zh` 等）；仅 `x-nonce`/`x-locale` 的注入可删。

✅ **关键 Next.js 行为已 spike 验证（Next 14.2.32，2026-07-01）**：用最小结构实测 —— 无 `app/layout.tsx`、`(main)/layout` 作英文分支根布局、`[locale]/layout` 作本地化分支根布局。结果：
- 构建通过；`/`、`/about` = `○ Static`，`/[locale]` = `● SSG`（zh/es/pt 全部预渲染、进 prerender-manifest）。
- 预渲染 HTML 的 `<html lang>` **服务端即正确**：`/zh.html`→`lang="zh"`、`/es.html`→`lang="es"`、`/pt.html`→`lang="pt"`；`/`、`/about`→`lang="en"`。
- 结论：`[locale]` 动态段可与 `(main)` 路由组平级各作根布局，无需退化为 `app/(intl)/[locale]/`。

工作量：**中—高**（移动 36 路由进 `(main)/` + 抽出共享外壳 `AppShell` + 全量回归）。核心不确定性已消除。收益：`[locale]` 服务端正确 lang + 可静态缓存 + 顺带清理惰性 nonce。

### 方案 2 —— 轻量：静态 `[locale]` + 客户端 lang 修正（低成本折中）
不动路由结构。
1. 从根 layout 移除 `headers()`，`<html lang="en">` 硬编码为默认；同时删除惰性 nonce 管线（见 §6）。
2. 给 8 个 `[locale]` 页加 `force-static` → 预渲染（`<html lang="en">` + 现有内层 `<div lang={locale}>`）。
3. 在 `app/[locale]/layout.tsx` 注入一段极小内联脚本（类似 `ThemeScript`），首屏前 `document.documentElement.lang = "<locale>"`。

- ✅ 成本极低、无路由移动、`[locale]` 变为可缓存。
- ⚠️ 原始 HTML 的 `<html lang>` 仍是 `en`，仅 JS 执行后修正为 zh/es/pt。Google 会执行 JS 故基本能识别；但非 JS 抓取工具/纯静态审计看到的是 `en`，是**弱于服务端渲染**的信号。hreflang、localized metadata、内层 `<div lang>` 仍提供强本地化信号。

### 方案 3 —— 维持现状（基线）
`[locale]` 保持动态（`<html lang>` 已正确），仅接受其逐请求渲染成本。**注意：§3 的 GA 数据已证明这会让全站过半浏览、约 2/3 活跃用户长期走逐请求渲染，是最贵的一档，不再推荐。**

## 5. 推荐（依据 §3 真实流量修订）

**先前基于"低流量"的判断已作废。** GA 数据显示 `[locale]`（几乎全是 `/zh`）占全站 ~51% 浏览、~66% 活跃用户，且**全站第一名页面 `/zh/blog`（26% 浏览）就在这个子树里**、现在逐请求渲染无缓存。因此缓存 `[locale]` 的收益是**全站最高的一档**，不是"收益偏薄"。

- **推荐 → 方案 F（多根布局）**。理由：(1) 收益集中在 `/zh`，量大；(2) `/zh/blog` 这类中文页的核心价值就是中文 SEO，**必须服务端渲染正确的 `<html lang="zh">`** —— 这正是方案 2（客户端 JS 修正 lang）不够格、方案 F 才满足的点；(3) 顺带清理惰性 nonce、让根 `/` 及英文页也不再依赖 `force-static` 兜底。**前置：先做那个 ~30 分钟的多根布局 spike。**
- **方案 2 作为"快速见效"过渡**（可选）：若想在做 F 之前先拿到 `/zh` 的缓存收益，可先上方案 2 让 `[locale]` 可缓存，接受 `<html lang>` 由 JS 修正的暂时性弱化，之后再用 F 补齐服务端 lang。适合"先止血、后根治"。
- **es/pt** 流量极小（合计 ~3.5% 浏览），无论选哪个方案都是搭便车，不单独为它们投入。

**并行建议（独立、可能更高 ROI）**：先排查 §3 里那批**有自然流量但疑似 404 的 `/zh/*` 旧 URL**（`/zh/history`、`/zh/calendar`、`/zh/fortune-cookie-quotes/*`、`/zh/free-online-fortune-cookie` 等）。若确在 404，恢复本地化路由或加 301 是**留住既有中文自然流量**的直接手段，且不依赖本重构。

个人倾向：**先确认 `[locale]` 子树的实际流量**。若可忽略 → 方案 3 + 顺手做方案 2 的 nonce 清理即可；若这些语言是增长重点 → 投入方案 F。

## 6. 附带的 nonce 清理（任一方案都适用）
当前 CSP 用 `script-src 'unsafe-inline'` 且**从不声明 `'nonce-…'`**，故脚本上的 nonce 属性**惰性无效**。方案 F/2 移除根 `headers()` 后，nonce 天然失效，应一并删除：`app/layout.tsx` 的 nonce 读取与传参、以及 `ThemeScript`/`WebsiteStructuredData`/`OrganizationStructuredData` 的 `nonce` 形参。这是安全中性的清理（详见记忆 `layout-headers-nonce-csp`）。若反而想启用真·nonce CSP，则是相反方向：去掉 `'unsafe-inline'`、声明 `'nonce-…'`，并解决 Next.js 水合内联脚本无法带 nonce 的问题 —— 属独立的安全工作项。

## 7. 验收清单（实施方案 F/2 后）
- [ ] `npm run build`：`/[locale]` 从 `ƒ` 变为 `○/●`，且出现在 `prerender-manifest`。
- [ ] `next start` 实测：`/zh` 响应 `x-nextjs-cache: HIT`；`<html lang>` 为 `zh`（方案 F 服务端即正确；方案 2 需在浏览器/JS 渲染后确认）。
- [ ] 根 `/`、`/about` 等 36 个英文页仍 `○ Static`、`<html lang="en">`、URL 未变。
- [ ] hreflang / canonical / localized metadata 未回归。
- [ ] `npm run type-check` 通过；完整 `build` 通过。
- [ ] 无 `<html>` 嵌套、无水合告警。
