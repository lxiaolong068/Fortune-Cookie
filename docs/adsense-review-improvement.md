# AdSense 审核被拒问题分析与改进方案

> 更新时间：2026-03-22
> 问题来源：Google AdSense 后台 → fortunecookie.vip → 需要注意
> 核心判定：**低价值内容（Low-value content）**

---

## 一、当前状态

| 审核项 | 状态 | 说明 |
|--------|------|------|
| 验证网站所有权 | ✅ 通过 | ads.txt 配置正确 |
| 违规问题 | ❌ 未通过 | 低价值内容 |
| 网站是否准备好展示广告 | ❌ 否 | 需解决所有违规后重新申请 |

---

## 二、根本原因分析

### 问题 1（P0）：AdSense 脚本双重加载 + 互相冲突

**位置：`app/layout.tsx`**

代码中存在**两处**加载 AdSense 的逻辑，同时运行，相互冲突：

**第一处（第 207-212 行）：Next.js `<Script>` 组件直接加载**

```tsx
<Script
  async
  src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6958408841088360"
  crossOrigin="anonymous"
  strategy="afterInteractive"
/>
```

问题：Next.js 的 `<Script>` 组件会在脚本上自动注入 `data-nscript` 属性，导致控制台持续报警：
```
AdSense head tag doesn't support data-ns
```

**第二处（第 268-272 行）：`<OptimizedAdSense>` 组件（NetworkAwareAdSenseFacade）**

```tsx
<OptimizedAdSense
  clientId={process.env.GOOGLE_ADSENSE_CLIENT_ID || "ca-pub-6958408841088360"}
/>
```

`AdSenseFacade.tsx` 组件注释声称用原始 DOM 注入来规避 `data-ns` 问题，但由于第一处 `<Script>` 还存在，警告依然触发。

**结论**：两处同时保留，第一处的 `<Script>` 应当删除，仅保留 `AdSenseFacade`。

---

### 问题 2（P0）：GoogleBot 爬虫无法看到 AdSense 脚本加载

**位置：`components/AdSenseFacade.tsx` → `NetworkAwareAdSenseFacade`**

`NetworkAwareAdSenseFacade` 组件包含网络速度和设备内存检测逻辑：

```tsx
// 只在 4G 或更快的网络下加载
if (effectiveType && !['4g', 'unknown'].includes(effectiveType)) {
  setShouldRender(false)  // 跳过加载
  return
}

// 内存 < 4GB 的设备跳过加载
if (memory && memory < 4) {
  setShouldRender(false)  // 跳过加载
  return
}
```

**实测验证**：Playwright 爬虫访问网站时控制台输出：
```
[AdSense Facade] Skipping load on slow connection
```

**根本原因**：Google 的 Googlebot 和 AdSense 验证爬虫在 JavaScript 环境中不上报 `navigator.connection`，或 `effectiveType` 被识别为慢速网络。`deviceMemory` 在爬虫环境中可能返回低值。

**后果**：Google 审核爬虫访问任何页面时，AdSense 脚本**完全不加载**，审核系统无法验证广告集成。

---

### 问题 3（P0）：全站没有任何广告位单元

在整个代码库中搜索 `<ins class="adsbygoogle">`，**零结果**。

当前 `AdSenseFacade` 只负责加载 `adsbygoogle.js` 脚本，但没有在任何页面放置实际的广告展示单元。Google AdSense 审核需要看到：
1. 脚本正确加载 ✅（理论上）
2. 实际广告位代码存在于页面 ❌（完全缺失）

没有 `<ins>` 广告位，即使脚本正常加载，广告也无处展示，审核必然失败。

---

### 问题 4（P1）：内容质量 — 核心是工具型薄内容

这是 Google 判定"低价值内容"的根本原因：

**首页内容分析**：

| 内容区域 | 实际情况 | Google 的判定 |
|----------|---------|--------------|
| Above the fold | 幸运饼干图片 + "点击打开" | 纯交互 widget，无文字内容 |
| 静态说明文字 | Why Use/How to Use 两个短区块 | 质量尚可，但篇幅极短 |
| 核心功能 | 随机生成一句话 fortune | 程序自动生成，非原创 |

**Fortune 数据库内容**：`lib/fortune-database.ts` 中存储的 500+ 条 fortune 均为一句话短语（< 30 字），这些内容被分散展示在 `/explore`、分类页等多个页面，属于 Google 定义的"thin content"（薄内容）。

**博客内容风险**：`content/blog/` 下有大量博客文章（英文 ~40 篇、中文 ~35 篇），但：
- 内容高度同质化，话题紧密围绕"幸运饼干"的各种变体
- 多篇在结构和措辞上具有明显的 AI 生成特征
- zh/es/pt 语言版本是英文的直接翻译，Google 会将其识别为重复内容

---

### 问题 5（P2）：多语言 hreflang 配置不完整

**现状**：`app/sitemap.ts` 中通过 `buildAlternates()` 函数正确生成了 sitemap 的 `alternates` 字段。

**缺失**：`app/layout.tsx` 的 HTML `<head>` 中**没有 `<link rel="alternate" hreflang="...">` 标签**。

Sitemap 中的 hreflang 是辅助手段，标准做法是在每个页面的 `<head>` 中也内联声明。缺少内联 hreflang 会让 Google 对各语言版本的关联判断不确定，zh/en/es/pt 页面可能被判定为相互竞争的重复内容。

---

## 三、修复方案（按优先级）

### P0-1：删除 layout.tsx 中重复的 `<Script>` 加载

**文件**：`app/layout.tsx` 第 207-212 行

删除以下代码块（已由 `OptimizedAdSense` 组件替代）：
```tsx
{/* 删除这段 —— 会触发 data-ns 警告且与 AdSenseFacade 重复 */}
<Script
  async
  src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6958408841088360"
  crossOrigin="anonymous"
  strategy="afterInteractive"
/>
```

仅保留 `DeferredScripts` 内的 `<OptimizedAdSense>` 组件。

---

### P0-2：修复 NetworkAwareAdSenseFacade 的爬虫兼容性

**文件**：`components/AdSenseFacade.tsx`

当 `navigator.connection` API 不存在（爬虫环境）时，应默认加载而非跳过。当前逻辑的问题是：虽然有 `if ('connection' in navigator)` 检查，但 `deviceMemory` 检查没有这种保护，会在内存未知时误判跳过。

修改思路：
- 将"跳过加载"的判断从 **否定式（slow = skip）** 改为 **肯定式（confirmed fast = load）**，API 不存在时默认加载
- 或直接将 `NetworkAwareAdSenseFacade` 的内存下限从 4GB 降低到 1GB，或移除内存检查

---

### P0-3：在关键页面添加实际广告位单元

在以下页面添加 `<ins class="adsbygoogle">` 广告单元，这是 AdSense 审核**必须**看到的：

| 页面 | 建议位置 | 广告类型 |
|------|---------|---------|
| 首页 `/` | Fortune Cookie 展示区下方 | 展示广告（自适应）|
| AI 生成器 `/generator` | 结果展示区右侧或下方 | 展示广告 |
| 探索页 `/explore` | 列表项之间（每 10 条插 1 个）| 信息流广告 |
| 博客文章页 `/blog/[slug]` | 文章正文中部或底部 | 展示广告 |

广告位组件示例：
```tsx
// components/AdUnit.tsx
'use client'
import { useEffect } from 'react'

export function AdUnit({ slot }: { slot: string }) {
  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({})
    } catch (e) {}
  }, [])

  return (
    <ins
      className="adsbygoogle"
      style={{ display: 'block' }}
      data-ad-client="ca-pub-6958408841088360"
      data-ad-slot={slot}
      data-ad-format="auto"
      data-full-width-responsive="true"
    />
  )
}
```

---

### P1：提升内容质量，解决"低价值内容"根本问题

Google 对"低价值内容"的审核是人工 + 机器双重审核。以下措施可显著提升内容质量判定：

**1. 主页内容扩充**

在首页 Fortune Cookie widget 下方增加实质性内容区块，如：
- 每周精选 fortune 栏目（带编辑说明）
- "今日幸运数字"的文化背景解读（200-300 字）
- 用户评价或使用场景介绍（真实用户声音）

**2. Fortune 分类页深度化**

当前分类页（如 `/explore?category=love`）只是列出短句列表。为每个分类建立专题介绍页，增加：
- 该分类的文化背景介绍（300-500 字）
- 编辑精选推荐与理由
- 相关延伸阅读链接

**3. 博客文章质量管控**

- 避免在短时间内批量发布大量结构雷同的文章（Google 会检测发布频率异常）
- 确保每篇文章有独特的视角和观点，避免"AI 写作"的特征（段落结构过于整齐、缺乏个人叙述、引用来源模糊）
- 重点打磨 5-10 篇深度文章（1500+ 字，有原创见解），胜过 40 篇浅薄文章

**4. 确保博客导航可发现**

CLAUDE.md 中记录了一个已知问题：*"Blog navigation link may not appear in desktop navbar due to Turbopack caching"*。如果 Google 爬虫无法通过导航发现博客内容，这些文章对 SEO 和 AdSense 审核的贡献会大打折扣。需优先修复博客导航显示问题。

---

### P2：完善 hreflang 内联声明

在 `app/layout.tsx` 的 `<head>` 中为多语言页面添加 `<link rel="alternate">` 标签：

```tsx
// 示例：在 generateMetadata 或 layout 中补充 alternates
export const metadata: Metadata = {
  alternates: {
    canonical: 'https://www.fortunecookie.vip/',
    languages: {
      'en': 'https://www.fortunecookie.vip/',
      'zh': 'https://www.fortunecookie.vip/zh',
      'es': 'https://www.fortunecookie.vip/es',
      'pt': 'https://www.fortunecookie.vip/pt',
    },
  },
}
```

Next.js 14 的 `generateMetadata` 中配置 `alternates.languages` 会自动渲染 `<link rel="alternate" hreflang>` 标签。

---

## 四、修复后的申请流程

1. 完成 P0 三项修复（脚本冲突、爬虫兼容、广告位）并部署到生产环境
2. 等待 Google 索引更新（建议通过 Google Search Console 请求重新爬取首页和关键页面）
3. 在 AdSense 后台 → fortunecookie.vip → 勾选"我确认已解决相关问题" → 点击"申请审核"
4. 审核周期通常为 1-14 天

**注意**：内容质量问题（P1）不会立刻有"通过"按钮，但它决定了审核结果。建议先完成 P0 技术修复提交审核，同时持续推进 P1 内容改进，若首次申请被拒则在内容改进后再次申请。

---

## 五、问题优先级总结

| 优先级 | 问题 | 预计影响 | 工作量 |
|--------|------|---------|--------|
| P0 | 删除 layout.tsx 中重复的 `<Script>` AdSense 加载 | 消除 data-ns 警告 | 5 分钟 |
| P0 | 修复 NetworkAwareAdSenseFacade 爬虫兼容性 | 让 GoogleBot 能看到 AdSense | 1 小时 |
| P0 | 添加实际 `<ins>` 广告位到关键页面 | AdSense 审核必要条件 | 2-4 小时 |
| P1 | 博客导航 Bug 修复 | 让博客内容被 Google 发现 | 2 小时 |
| P1 | 提升内容深度（分类页、首页） | 解决"低价值内容"根本判定 | 持续迭代 |
| P2 | hreflang 内联声明 | 消除多语言重复内容信号 | 2 小时 |
