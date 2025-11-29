# 博客功能开发指南 (Blog Feature Development Guide)

## 1. 项目背景与目标
为了增加 Fortune Cookie AI 网站的内容深度，提升 SEO 表现并吸引更多长尾流量，我们计划增加一个博客板块。
鉴于我们是独立开发者，追求代码质量且无严格时间限制，我们将采用 **"本地文件驱动 (Local File-based CMS)"** 的方案。这种方案零成本、性能极高（纯静态生成）、且易于维护（内容即代码）。

## 2. 技术选型
- **框架**: Next.js 14 App Router (沿用现有架构)
- **内容格式**: MDX (Markdown + JSX)
    - 允许在文章中直接嵌入 React 组件（如：直接在文章中插入一个“运势生成器”小组件）。
- **解析库**: `next-mdx-remote/rsc` 或 `gray-matter` + `compileMDX`
    - 推荐使用 `next-mdx-remote/rsc`，专为 React Server Components 设计。
- **样式**: Tailwind CSS + `@tailwindcss/typography`
    - 使用 `prose` 类自动处理 Markdown 的排版样式，美观且省时。

## 3. 目录结构规划
建议新增以下目录和文件：

```text
/
├── content/                  # [新增] 存放 Markdown/MDX 源文件
│   └── blog/
│       ├── history-of-fortune-cookies.mdx
│       └── science-of-luck.mdx
├── app/
│   └── blog/
│       ├── page.tsx          # [新增] 博客列表页
│       └── [slug]/
│           └── page.tsx      # [新增] 博客文章详情页
├── lib/
│   └── blog.ts               # [新增] 读取和解析 MDX 文件的工具函数
└── components/
    └── blog/                 # [新增] 博客专用组件
        ├── BlogCard.tsx      # 文章列表卡片
        └── MDXComponents.tsx # 自定义 MDX 组件映射
```

## 4. 详细实施步骤

### 第一步：环境准备
安装必要的依赖：
```bash
pnpm add next-mdx-remote gray-matter @tailwindcss/typography
```

在 `tailwind.config.js` 中启用 typography 插件：
```javascript
module.exports = {
  // ...
  plugins: [
    require('@tailwindcss/typography'),
    // ...
  ],
}
```

### 第二步：数据层实现 (`lib/blog.ts`)
我们需要编写工具函数来读取文件系统。

```typescript
// 伪代码示例
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const postsDirectory = path.join(process.cwd(), 'content/blog')

export function getBlogPosts() {
  // 1. 读取 content/blog 下的所有文件
  // 2. 解析 Frontmatter (标题, 日期, 描述, 标签)
  // 3. 按日期降序排序
}

export function getPostBySlug(slug: string) {
  // 读取特定文件内容
}
```

### 第三步：定义 Frontmatter 规范
每篇文章的开头应包含元数据：

```yaml
---
title: "The Fascinating History of Fortune Cookies"
description: "Discover how a Japanese tradition became an American icon."
date: "2025-11-30"
author: "Fortune Cookie AI"
tags: ["History", "Culture", "Food"]
image: "/images/blog/history-cover.jpg"
---
```

### 第四步：页面开发

#### 1. 博客列表页 (`app/blog/page.tsx`)
- 使用 `getBlogPosts()` 获取数据。
- 渲染网格布局的 `BlogCard` 组件。
- 实现简单的分类/标签筛选（可选，初期可不做）。
- **SEO**: 设置 `metadata`，标题为 "Blog - Fortune Cookie AI"。

#### 2. 文章详情页 (`app/blog/[slug]/page.tsx`)
- 使用 `generateStaticParams` 预生成所有文章路径（SSG），确保极致的加载速度。
- 使用 `next-mdx-remote/rsc` 的 `<MDXRemote />` 渲染内容。
- 使用 `<article className="prose prose-amber lg:prose-xl">` 包裹内容以应用样式。
- **SEO**: 动态生成 `metadata`，包含 Open Graph 图片和 Article 结构化数据。

### 第五步：SEO 与 整合
1.  **Sitemap**: 更新 `app/sitemap.ts`，将所有博客文章 URL 加入。
2.  **RSS Feed**: 建议生成 `feed.xml`，方便 RSS 阅读器订阅（利于 SEO 和内容分发）。
3.  **内部链接**: 在首页或 Footer 添加 "Blog" 入口；在文章内部适当链接到 "Generator" 页面。

## 5. 写作与内容策略
既然没有时间限制，我们应专注于**长青内容 (Evergreen Content)**：
1.  **深度科普**: 比如《幸运饼干的心理学效应》、《全球各地的签语饼文化》。
2.  **数据分析**: 《分析了 10,000 条签语后，我们发现了什么？》。
3.  **教程**: 《如何制作完美的自制幸运饼干》。

## 6. 下一步行动建议
1.  先创建基础架构（目录、依赖、lib 函数）。
2.  撰写第一篇高质量的 "Hello World" 文章（例如关于本站的介绍或技术栈）。
3.  完成列表页和详情页的开发与样式调整。
