# 博客内容自动生成工作流

自动化博客内容生产流水线，通过 Tavily 搜索选题、OpenRouter AI 写作、Unsplash 配图，生成符合 SEO 规范的 MDX 博客文章，并可自动翻译到多语言和通知搜索引擎。

---

## 架构概览

```
触发方式
  ├── CLI 脚本 (scripts/generate-blog-post.ts)     ← 手动 / cron 调度
  └── HTTP API (app/api/content/generate/route.ts) ← Vercel Cron / curl

              ↓ 调用

lib/content-pipeline.ts  ←  lib/content-pipeline-config.ts
    │
    ├── Stage 1  加载现有文章库 (53+ MDX → 去重防重复)
    ├── Stage 2  Tavily Web Search 选题
    ├── Stage 3  OpenRouter AI 选题决策 → JSON
    ├── Stage 4  OpenRouter AI 内容生成 → MDX
    ├── Stage 5  Unsplash API 配图
    ├── Stage 6  保存 content/blog/en/{slug}.mdx
    ├── Stage 7  翻译到 zh / es / pt (可选)
    └── Stage 8  IndexNow 通知搜索引擎 (可选)
```

---

## 文件结构

| 文件 | 说明 |
|------|------|
| `lib/content-pipeline-config.ts` | 配置：种子词、内容支柱、内链目标、Fallback 话题 |
| `lib/content-pipeline.ts` | 核心 8 阶段管道逻辑 |
| `scripts/generate-blog-post.ts` | CLI 入口 |
| `app/api/content/generate/route.ts` | HTTP 入口 |

---

## 快速开始

### 1. 配置环境变量

在 `.env.local` 中确认以下变量已设置：

```bash
# 必需
OPENROUTER_API_KEY=sk-or-...

# 选题（未设置时使用内置 fallback 话题池）
TAVILY_API_KEY=tvly-...

# 可选默认值
CONTENT_GENERATION_MODEL=x-ai/grok-4.1-fast
CONTENT_AUTO_TRANSLATE=false
CONTENT_AUTO_INDEXNOW=false
CONTENT_ADMIN_TOKEN=your-secret-token
```

### 2. 运行

```bash
# 最简单：全自动生成（选题 + 写作 + 配图 + 保存）
npx tsx scripts/generate-blog-post.ts

# 推荐：生成 + 翻译 + 通知搜索引擎
npx tsx scripts/generate-blog-post.ts --translate --notify

# 先预览选题，不写内容
npx tsx scripts/generate-blog-post.ts --dry-run
```

---

## CLI 参数说明

```
Usage: npx tsx scripts/generate-blog-post.ts [options]

选项：
  --model <model>    OpenRouter 模型 ID（覆盖环境变量）
  --topic <text>     手动指定话题（跳过 Tavily 搜索）
  --dry-run          仅预览选题，不生成内容，不保存文件
  --translate        生成后自动翻译到 zh/es/pt
  --no-translate     强制跳过翻译（覆盖环境变量）
  --notify           生成后通知 IndexNow
  --no-notify        强制跳过 IndexNow 通知
  --help             显示帮助
```

### 常用示例

```bash
# 使用 Gemini Flash 模型（更快更便宜）
npx tsx scripts/generate-blog-post.ts --model "google/gemini-2.5-flash"

# 使用 Claude Sonnet（质量最高）
npx tsx scripts/generate-blog-post.ts --model "anthropic/claude-sonnet-4-20250514"

# 指定话题（绕过 Tavily，AI 直接根据该描述选题）
npx tsx scripts/generate-blog-post.ts --topic "AI astrology 2026 trends"

# 完整流程（适合定时任务）
npx tsx scripts/generate-blog-post.ts --translate --notify

# 调试模式：只看选题不花钱
npx tsx scripts/generate-blog-post.ts --dry-run
```

---

## 8 阶段管道详解

### Stage 1 — 加载现有文章库
读取 `content/blog/en/*.mdx`，解析 frontmatter，构建 slug/title 列表，用于后续去重。

### Stage 2 — Tavily 选题搜索
- 从 16 个种子词池中**随机抽取 3 个**发起 Web 搜索
- 参数：`search_depth: "advanced"`，最多返回 15 条结果
- **Tavily 不可用时**：跳过此阶段，Stage 3 自动使用内置 fallback 话题池

种子词池示例（`lib/content-pipeline-config.ts`）：
```
"fortune cookie AI trends 2026"
"mindfulness digital wellness trends"
"luck psychology science research 2025"
"AI spirituality technology future"
...（共 16 个）
```

### Stage 3 — AI 选题决策
- 调用 OpenRouter（temperature: 0.4）
- 将 Tavily 结果 + 现有文章列表传给 AI，要求选择不重复的话题
- 返回结构化 JSON：

```json
{
  "title": "SEO 标题 (50-70 字符)",
  "slug": "url-friendly-slug",
  "description": "Meta 描述 (140-160 字符)",
  "tags": ["tag1", "tag2", "tag3"],
  "outline": ["H2 节 1", "H2 节 2", "H2 节 3", "H2 节 4", "H2 节 5"],
  "unsplashQuery": "3-4词 Unsplash 图片搜索词",
  "targetKeywords": ["主关键词", "副关键词"]
}
```

- 自动校验 slug 不与现有文章冲突，冲突则重试（最多 3 次）
- **Tavily 结果为空时**：从内置 5 个 fallback 话题中随机选一个

### Stage 4 — AI 内容生成
- 调用 OpenRouter（temperature: 0.7，max_tokens: 4096）
- 目标 1,200–1,800 词，使用 H2/H3 结构
- 自动插入 2-3 个内链（指向 `/`、`/generator`、`/browse` 等）
- 关键词自然分布在标题和首段
- 失败自动重试 2 次

### Stage 5 — Unsplash 配图
- 使用 Stage 3 返回的 `unsplashQuery` 搜索图片
- 从 `unsplash.config.json` 中**随机轮换** 10 个 access key
- 从前 3 张结果随机选取一张，增加多样性
- 构建 CDN hotlink URL：`https://images.unsplash.com/photo-{id}?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080`
- **失败时**：使用内置 fallback 图片，不中断流程

### Stage 6 — 保存 MDX 文件
生成标准 frontmatter 并保存到 `content/blog/en/{slug}.mdx`：

```yaml
---
title: "文章标题"
description: "Meta 描述"
date: "2026-03-31"       # 当天日期
author: "Fortune Cookie AI Team"
tags: ["tag1", "tag2"]
image: "https://images.unsplash.com/photo-..."
featured: false
---
（MDX 正文内容）
```

### Stage 7 — 多语言翻译（可选）
- 条件：`--translate` 参数 或 `CONTENT_AUTO_TRANSLATE=true`
- 调用现有脚本 `scripts/translate-blog.ts` 依次翻译到 zh、es、pt
- 翻译失败**不中断**主流程，仅记录警告

### Stage 8 — IndexNow 通知（可选）
- 条件：`--notify` 参数 或 `CONTENT_AUTO_INDEXNOW=true`
- 调用 `lib/indexnow.ts` 的 `notifyBlogPostUpdate(slug)` 通知 Bing/Yandex
- 失败**不中断**主流程，仅记录警告

---

## HTTP API

### GET `/api/content/generate`
供 Vercel Cron 或脚本调用。

**认证**（二选一）：
```
Authorization: Bearer {CRON_SECRET}     # Vercel Cron 自动注入
Authorization: Bearer {CONTENT_ADMIN_TOKEN}
```

**响应**：
```json
{
  "data": {
    "success": true,
    "slug": "generated-post-slug",
    "title": "文章标题",
    "filePath": "/path/to/content/blog/en/slug.mdx",
    "stages": [...]
  },
  "meta": { "triggeredAt": "2026-03-31T10:00:00Z", "trigger": "cron" }
}
```

### POST `/api/content/generate`
手动触发，支持自定义参数。

**认证**：`Authorization: Bearer {CONTENT_ADMIN_TOKEN}`

**请求体**（均可选）：
```json
{
  "model": "google/gemini-2.5-flash",
  "topic": "指定话题描述",
  "translate": true,
  "notify": true,
  "dryRun": false
}
```

**curl 示例**：
```bash
# 基本触发
curl -X POST https://fortune-cookie.cc/api/content/generate \
  -H "Authorization: Bearer your-token" \
  -H "Content-Type: application/json"

# 自定义参数
curl -X POST https://fortune-cookie.cc/api/content/generate \
  -H "Authorization: Bearer your-token" \
  -H "Content-Type: application/json" \
  -d '{"model": "google/gemini-2.5-flash", "translate": true}'

# 本地测试
curl -X POST http://localhost:3000/api/content/generate \
  -H "Authorization: Bearer your-token"
```

---

## 配置定时任务

脚本本身不绑定任何调度器，可灵活接入：

### 方案 A：系统 Cron（macOS/Linux）
```bash
# 每周一 UTC 10:00 生成一篇
crontab -e
0 10 * * 1 cd /path/to/project && npx tsx scripts/generate-blog-post.ts --translate --notify >> logs/content.log 2>&1
```

### 方案 B：GitHub Actions（推荐，会自动 commit + push）
```yaml
# .github/workflows/generate-blog.yml
name: Generate Blog Post
on:
  schedule:
    - cron: '0 10 * * 1'   # 每周一 UTC 10:00
  workflow_dispatch:         # 支持手动触发

jobs:
  generate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '20' }
      - run: npm ci
      - run: npx tsx scripts/generate-blog-post.ts --translate --notify
        env:
          OPENROUTER_API_KEY: ${{ secrets.OPENROUTER_API_KEY }}
          TAVILY_API_KEY: ${{ secrets.TAVILY_API_KEY }}
          CONTENT_AUTO_INDEXNOW: "true"
      - uses: stefanzweifel/git-auto-commit-action@v5
        with:
          commit_message: "feat(blog): auto-generate new post"
```

### 方案 C：Vercel Cron（serverless，无法写文件）
```json
// vercel.json（已配置 maxDuration: 300）
{
  "crons": [
    { "path": "/api/content/generate", "schedule": "0 10 * * 1" }
  ]
}
```
> ⚠️ Vercel serverless 函数无法持久化写入文件系统，API 路由适合在本地开发环境或配合 GitHub API commit 使用。

---

## 成本估算

| 项目 | 每次 | 每月（周更 4 次） |
|------|------|----------------|
| Tavily search | ~$0.01 | ~$0.04 |
| OpenRouter 选题 | ~$0.02 | ~$0.08 |
| OpenRouter 写作 | ~$0.05–0.10 | ~$0.20–0.40 |
| OpenRouter 翻译×3 | ~$0.09–0.18 | ~$0.36–0.72 |
| Unsplash | 免费 | 免费 |
| **合计** | **~$0.17–0.31** | **~$0.68–1.24** |

---

## 错误处理策略

| 阶段 | 失败行为 |
|------|---------|
| Tavily 搜索 | 自动 fallback 到内置话题池，继续 |
| AI 选题 | 最多重试 3 次；全部失败则终止 |
| AI 写作 | 最多重试 2 次；全部失败则终止 |
| Unsplash 配图 | fallback 到默认图片，继续 |
| 保存 MDX | 致命错误，立即终止 |
| 翻译 | 非致命，记录警告，继续 |
| IndexNow | 非致命，记录警告，继续 |

---

## 自定义内容方向

在 `lib/content-pipeline-config.ts` 中修改：

```typescript
// 添加新的搜索种子词
export const TOPIC_SEED_QUERIES = [
  ...现有列表,
  "your new seed query",
];

// 调整内容支柱权重（1-5，数字越大优先级越高）
export const CONTENT_PILLARS = [
  { name: "AI & Technology", weight: 5 },  // 最高优先级
  ...
];

// 添加新的内链目标
export const INTERNAL_LINK_TARGETS = [
  ...现有列表,
  { path: "/your-page", anchor: "anchor text", context: "description" },
];
```

---

## 相关文件

- [lib/content-pipeline.ts](../lib/content-pipeline.ts) — 核心管道
- [lib/content-pipeline-config.ts](../lib/content-pipeline-config.ts) — 配置
- [scripts/generate-blog-post.ts](../scripts/generate-blog-post.ts) — CLI 脚本
- [app/api/content/generate/route.ts](../app/api/content/generate/route.ts) — HTTP API
- [scripts/translate-blog.ts](../scripts/translate-blog.ts) — 翻译脚本（被 Stage 7 调用）
- [lib/indexnow.ts](../lib/indexnow.ts) — IndexNow 通知（被 Stage 8 调用）
