# Fortune Cookie AI 优化改进方案

> 基于 Google Analytics 数据 (2026.1.16 - 2.13) 与代码架构深度分析

---

## 优化优先级总览

| 优先级 | 优化项 | 预期影响 | 工作量 | 涉及文件 |
|--------|--------|----------|--------|----------|
| P0 | 游客配额放宽 | 互动时长 +150% | 小 | `lib/quota.ts`, `.env` |
| P0 | 机器人流量过滤 | 数据准确性 +10% | 小 | `middleware.ts`, GA4 设置 |
| P0 | 中文版本修复 | 修复 /zh/blog 白屏 | 中 | `app/zh/`, `lib/blog.ts` |
| P1 | SERP 展示优化 | 搜索 CTR 2.94%→6% | 中 | `app/*/page.tsx`, SEO 组件 |
| P1 | FAQ Schema 注入 | SERP 富片段展示 | 小 | `components/StructuredData.tsx`, 各页面 |
| P1 | 长尾关键词着陆页 | 搜索流量 +30% | 中 | 新增 2-3 个页面 |
| P2 | 社交分享功能增强 | 社交流量 0.5%→5% | 中 | `AIFortuneCookie.tsx`, 新组件 |
| P2 | 用户回访机制 | 留存率 0%→15% | 大 | 新增多个功能模块 |
| P2 | 博客导航修复 | /blog 跳出率降低 | 小 | `Navigation.tsx` |
| P3 | 缓存策略调优 | API 响应加速 | 小 | `lib/redis-cache.ts` |
| P3 | 移动端体验优化 | 移动流量占比提升 | 中 | 多个组件 |

---

## P0-1: 游客配额放宽 (最高优先级)

### 问题诊断

GA 数据显示 `/generator` 页面平均互动仅 **17秒**，而 `/explore` 页面达到 **1分32秒**。根本原因是游客每天只能生成 1 次 AI fortune，体验一次即走。

当前代码 (`lib/quota.ts` 第4行):
```typescript
const DEFAULT_GUEST_DAILY_LIMIT = 1;  // 游客每天仅1次
const DEFAULT_AUTH_DAILY_LIMIT = 10;
```

### 优化方案

**方案 A (推荐): 阶梯式配额**

```typescript
// lib/quota.ts - 修改配额默认值
const DEFAULT_GUEST_DAILY_LIMIT = 5;   // 游客: 1 → 5 次/天
const DEFAULT_AUTH_DAILY_LIMIT = 20;   // 登录用户: 10 → 20 次/天
```

同时修改 `.env` 或 `.env.local`:
```bash
GUEST_DAILY_LIMIT="5"
AUTH_DAILY_LIMIT="20"
```

**方案 B: 首次访问赠送额度**

在 `lib/quota.ts` 中增加首访判断逻辑:

```typescript
// 新增: 首次访问赠送额外配额
export async function getEffectiveLimit(identity: QuotaIdentity): Promise<number> {
  const baseLimit = getDailyLimit(identity.isAuthenticated);

  if (!identity.isAuthenticated && identity.guestId) {
    // 检查是否为首次访问 (无历史记录)
    const historyCount = await db.fortuneQuota.count({
      where: { guestId: identity.guestId }
    });

    if (historyCount === 0) {
      return baseLimit + 3; // 首次访问赠送 3 次额外体验
    }
  }

  return baseLimit;
}
```

**配额用尽后的引导改进** — 在 `components/AIFortuneCookie.tsx` 中，配额用尽时不应只显示错误提示，而应引导用户:

```typescript
// components/AIFortuneCookie.tsx - 配额用尽时的引导组件
function QuotaExhaustedPrompt({ isAuthenticated, resetsAt }: {
  isAuthenticated: boolean;
  resetsAt: string
}) {
  return (
    <div className="text-center space-y-4 p-6">
      <p className="text-amber-600 font-medium">
        You've used all your fortune cookies for today!
      </p>

      {!isAuthenticated && (
        <div className="space-y-2">
          <p className="text-sm text-gray-600">
            Sign in to get 20 fortune cookies per day (free!)
          </p>
          <Button onClick={startGoogleSignIn} variant="outline">
            Sign in with Google
          </Button>
        </div>
      )}

      <div className="space-y-2">
        <p className="text-sm text-gray-500">
          Or explore our collection of 500+ fortune messages:
        </p>
        <div className="flex gap-2 justify-center">
          <Link href="/explore">Browse Fortunes</Link>
          <Link href="/funny-fortune-cookie-messages">Funny Messages</Link>
        </div>
      </div>

      <p className="text-xs text-gray-400">
        Resets at: {new Date(resetsAt).toLocaleString()}
      </p>
    </div>
  );
}
```

### 预期效果

- /generator 平均互动时长: 17秒 → 45秒+
- 首页到 /generator 的导流增加
- 注册转化率提升 (配额引导)

---

## P0-2: 机器人流量过滤

### 问题诊断

GA 数据中存在明显异常:
- The Dalles (Google 数据中心): 24 个"用户"
- Ashburn (AWS 数据中心): 7 个"用户"
- 800x600 分辨率异常集中 (2026年最常见分辨率不可能是800x600)
- Linux 用户占 12.6% (正常应 < 3%)
- 真实用户估算: 310 - 31 (数据中心) = ~279

### 优化方案

**Step 1: middleware.ts 增加 Bot 检测**

在 `middleware.ts` 中添加 Bot User-Agent 过滤，阻止已知爬虫触发 GA 事件:

```typescript
// middleware.ts - 在文件顶部新增
const BOT_USER_AGENTS = [
  'bot', 'spider', 'crawl', 'slurp', 'mediapartners',
  'headlesschrome', 'puppeteer', 'phantom', 'selenium',
  'lighthouse', 'pagespeed', 'gtmetrix', 'pingdom',
  'uptimerobot', 'statuscake', 'sitechecker',
];

function isBot(userAgent: string | null): boolean {
  if (!userAgent) return false;
  const ua = userAgent.toLowerCase();
  return BOT_USER_AGENTS.some(bot => ua.includes(bot));
}
```

在 `middleware()` 函数开头添加:

```typescript
export function middleware(request: NextRequest) {
  const startTime = Date.now();
  const { pathname } = request.nextUrl;
  const userAgent = request.headers.get('user-agent');

  // Bot 检测 — 对已知爬虫跳过 GA/Analytics 相关处理
  if (isBot(userAgent)) {
    // 设置自定义 header 标记，前端组件可据此跳过 GA 初始化
    const response = NextResponse.next();
    response.headers.set('X-Is-Bot', 'true');
    return response;
  }
  // ... 现有逻辑
}
```

**Step 2: PerformanceMonitor 中增加 Bot 跳过逻辑**

在 `components/PerformanceMonitor.tsx` 的 GoogleAnalytics 组件中:

```typescript
// 在 GA 脚本初始化前检查
useEffect(() => {
  // 跳过已知爬虫
  if (navigator.userAgent && BOT_USER_AGENTS.some(
    bot => navigator.userAgent.toLowerCase().includes(bot)
  )) {
    return; // 不初始化 GA
  }
  // ... 现有 GA 初始化逻辑
}, []);
```

**Step 3: GA4 后台配置**

在 Google Analytics 4 管理后台:
1. 进入 **管理 → 数据流 → Web 数据流设置**
2. 启用 **排除已知机器人的流量**
3. 创建数据过滤器:
   - 过滤器名称: "排除数据中心流量"
   - 类型: 排除
   - 条件: 城市名称 包含 "The Dalles" OR "Ashburn"

### 预期效果

- 排除约 10% 的无效流量
- 数据指标更准确地反映真实用户行为
- 平均互动时长等指标会因去除快速跳出的爬虫而提升

---

## P0-3: 中文版本修复

### 问题诊断

- `/zh/blog` 页面互动时长 **0秒**，9个新用户全部立即离开
- `/zh` 首页互动 6秒，远低于英文首页的 28秒
- 中文博客列表可能无内容或渲染失败

### 排查步骤

```bash
# 1. 检查中文博客内容是否存在
ls content/blog/zh/ 2>/dev/null || echo "中文博客目录不存在"

# 2. 检查 lib/blog.ts 对中文内容的处理
grep -n "zh\|locale\|lang" lib/blog.ts

# 3. 本地启动并访问中文版本
npm run dev
# 访问 http://localhost:3000/zh/blog 观察是否有内容

# 4. 检查控制台是否有 hydration 错误
# (已知 CLAUDE.md 中提到 Turbopack 缓存可能导致组件不更新)
```

### 修复方向

1. 如果中文博客内容不存在 → 在 `content/blog/` 中创建中文版本的博客文章，或在 `/zh/blog` 页面中 fallback 显示英文文章并标注 "English Only"
2. 如果渲染失败 → 检查 `app/zh/blog/page.tsx` 的服务端组件是否正确获取博客数据
3. 如果是 Turbopack 缓存问题 → `rm -rf .next node_modules/.cache && npm run dev`

---

## P1-1: SERP 展示优化 (搜索结果点击率)

### 问题诊断

核心关键词 "fortune cookie generator" 排名第 7.47 位 (首页)，但 CTR 仅 **2.94%**。首页排名的平均 CTR 应在 5-10% 之间。原因是 Title 和 Description 不够吸引人。

当前 Title (`app/generator/page.tsx` 第11行):
```
"AI Fortune Cookie Generator - Create Custom Messages"
```

当前 Description:
```
"Free AI fortune cookie generator for personalized messages, funny quotes,
and lucky numbers. Create and share custom fortune cookies instantly."
```

### 优化方案

**修改 /generator 页面 Meta** (`app/generator/page.tsx`):

```typescript
export const metadata: Metadata = {
  title: "Free Fortune Cookie Generator - AI Powered | Get Your Fortune Now",
  description:
    "Open your free AI fortune cookie now! Get personalized fortune messages, lucky numbers & life wisdom. 500+ unique fortunes - no signup needed. Try it instantly!",
  // ...
};
```

**修改首页 Meta** (`app/page.tsx` 中的 generateSEOMetadata 调用):

```typescript
export const metadata = generateSEOMetadata({
  title: "Fortune Cookie AI - Free Online Fortune Cookie Generator",
  description:
    "Crack open a virtual fortune cookie! Free AI-powered generator with 500+ unique messages. Get personalized fortune cookies, lucky numbers & daily wisdom instantly.",
  url: "/",
});
```

**优化原则**:
- Title 以高搜索量关键词开头 ("Free Fortune Cookie Generator")
- 包含行动号召 ("Get Your Fortune Now", "Try it instantly!")
- Description 使用情感触发词 ("Crack open", "personalized")
- 包含数量词 ("500+ unique")
- 包含降低门槛的词 ("no signup needed", "instantly")

**各页面 Title 优化对照表**:

| 页面 | 当前 Title | 优化后 |
|------|-----------|--------|
| / | Fortune Cookie - Free Online AI G... | Fortune Cookie AI - Free Online Fortune Cookie Generator |
| /generator | AI Fortune Cookie Generator - Create Custom Messages | Free Fortune Cookie Generator - AI Powered &#124; Get Your Fortune Now |
| /explore | Explore Fortune Cookie Messages | Browse 500+ Fortune Cookie Messages - Find Your Perfect Fortune |
| /funny-fortune-cookie-messages | Funny Fortune Cookie Messages | 100+ Funny Fortune Cookie Messages - Hilarious Fortunes That'll Make You Laugh |
| /blog | Blog - Fortune Cookie Wisdom | Fortune Cookie Blog - History, Meanings & Fun Facts |

---

## P1-2: FAQ Schema 注入

### 问题诊断

代码中 `components/SEO.tsx` 已有 `generateFAQJSONLD` 工具函数 (第218行)，但分析发现首页和 /generator 页面都没有实际调用它。FAQ Schema 可以在 SERP 中生成折叠式问答富片段，显著提升 CTR。

### 优化方案

**在首页添加 FAQ Schema** — 修改 `app/page.tsx`:

```typescript
import { SEO, SEOUtils } from "@/components/SEO";
import { FAQStructuredData } from "@/components/StructuredData";

// 在页面组件中添加:
<FAQStructuredData faqs={[
  {
    question: "What is a fortune cookie generator?",
    answer: "A fortune cookie generator is a free online tool that creates personalized fortune cookie messages using AI. You can choose themes like love, career, humor, and wisdom to get unique fortune messages with lucky numbers."
  },
  {
    question: "Is this fortune cookie generator free to use?",
    answer: "Yes! Our AI fortune cookie generator is completely free. You can generate up to 5 fortune cookies per day without signing up, or sign in for 20 daily fortunes."
  },
  {
    question: "How does the AI fortune cookie work?",
    answer: "Our generator uses advanced AI to create unique, personalized fortune messages based on your selected theme and mood. Each fortune comes with lucky numbers and can be shared on social media."
  },
  {
    question: "Can I get a fortune cookie online?",
    answer: "Absolutely! Just visit our website and click to crack open a virtual fortune cookie. You'll receive a unique message with lucky numbers instantly, no download required."
  },
  {
    question: "What themes are available for fortune cookies?",
    answer: "We offer 6 themes: Inspirational, Love & Romance, Funny, Career & Success, Wisdom, and Random. Each theme generates messages tailored to that category."
  }
]} />
```

**在 /generator 页面也添加相应的 FAQ Schema** — 聚焦"如何使用"类型的问题。

### 验证方式

```bash
# 部署后使用 Google Rich Results Test 验证
# https://search.google.com/test/rich-results
# 输入 https://fortunecookieai.com/ 检查 FAQ 是否被识别
```

---

## P1-3: 高 CTR 长尾关键词着陆页

### 问题诊断

Search Console 数据显示以下关键词 CTR 极高但展示量不足:

| 关键词 | CTR | 展示量 | 排名 | 机会 |
|--------|-----|--------|------|------|
| fortune cookie online free | 23.08% | 91 | 11.56 | 专门着陆页可冲进前5 |
| fortune cookie free online | 22.22% | 9 | 7.67 | 同上 |
| fortune cookie ai | 20% | 15 | 3.33 | 品牌词，加强品牌曝光 |

### 优化方案

**新增着陆页: `/free-online-fortune-cookie`**

创建 `app/free-online-fortune-cookie/page.tsx`:

```typescript
import { Metadata } from "next";
import { generateSEOMetadata } from "@/components/SEO";
import { FAQStructuredData } from "@/components/StructuredData";

export const metadata: Metadata = {
  title: "Free Online Fortune Cookie - Open Your Fortune Now | No Signup",
  description:
    "Get your free fortune cookie online instantly! AI-powered fortune messages with lucky numbers. No signup, no download - just click and discover your fortune.",
  alternates: {
    canonical: "/free-online-fortune-cookie",
  },
};

export default function FreeOnlineFortuneCookiePage() {
  return (
    <>
      <FAQStructuredData faqs={[
        {
          question: "Can I get a fortune cookie online for free?",
          answer: "Yes! Our free online fortune cookie generator lets you crack open virtual fortune cookies instantly. No signup, no download, no cost - just pure fortune fun!"
        },
        {
          question: "How many free fortune cookies can I get?",
          answer: "You can open up to 5 free fortune cookies per day as a guest. Sign in with Google to unlock 20 daily fortunes for free!"
        },
      ]} />
      {/*
        页面内容: 嵌入 FortuneCookieStatic + FortuneCookieInteractive
        突出"Free"和"Online"属性
        内部链接到 /generator, /explore, /funny-fortune-cookie-messages
      */}
    </>
  );
}
```

**同时更新 `app/sitemap.ts`** 添加新页面:

```typescript
// 在 sitemap 的核心页面列表中添加:
{
  url: `${baseUrl}/free-online-fortune-cookie`,
  lastModified: new Date(),
  changeFrequency: 'weekly' as const,
  priority: 0.8,
}
```

---

## P2-1: 社交分享功能增强

### 问题诊断

社交渠道流量仅占 **0.51%** (2个会话)。代码中 `components/SocialShare.tsx` 已存在，并在 `AIFortuneCookie.tsx` 第21行被导入使用，但分享功能可能不够突出或缺乏分享激励。

### 优化方案

**增强分享视觉效果** — 在 fortune 生成结果展示后，添加醒目的分享引导:

```typescript
// components/FortuneShareCard.tsx - 新增可分享的 fortune 图片卡片组件
"use client";

import { useRef } from "react";
import html2canvas from "html2canvas";

interface FortuneShareCardProps {
  message: string;
  luckyNumbers: number[];
  theme: string;
}

export function FortuneShareCard({ message, luckyNumbers, theme }: FortuneShareCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleDownloadImage = async () => {
    if (!cardRef.current) return;
    const canvas = await html2canvas(cardRef.current, {
      backgroundColor: null,
      scale: 2, // 高清
    });
    const link = document.createElement("a");
    link.download = "my-fortune-cookie.png";
    link.href = canvas.toDataURL();
    link.click();
  };

  const handleShareToTwitter = () => {
    const text = encodeURIComponent(
      `🥠 My fortune cookie says: "${message}" \n\nLucky numbers: ${luckyNumbers.join(", ")}\n\nGet your fortune → `
    );
    const url = encodeURIComponent("https://fortunecookieai.com/generator");
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, "_blank");
  };

  return (
    <div className="space-y-4">
      {/* 可截图的卡片 */}
      <div
        ref={cardRef}
        className="bg-gradient-to-br from-amber-50 to-orange-100 rounded-2xl p-8 text-center shadow-lg"
      >
        <div className="text-4xl mb-4">🥠</div>
        <p className="text-lg font-serif text-amber-900 italic mb-4">
          "{message}"
        </p>
        <p className="text-sm text-amber-700">
          Lucky Numbers: {luckyNumbers.join(" · ")}
        </p>
        <p className="text-xs text-amber-500 mt-4">fortunecookieai.com</p>
      </div>

      {/* 分享按钮组 */}
      <div className="flex gap-3 justify-center">
        <Button onClick={handleShareToTwitter} variant="outline" size="sm">
          Share on X/Twitter
        </Button>
        <Button onClick={handleDownloadImage} variant="outline" size="sm">
          Download Image
        </Button>
        {/* WhatsApp, WeChat 等分享按钮 */}
      </div>
    </div>
  );
}
```

**安装依赖**: `npm install html2canvas`

---

## P2-2: 用户回访机制

### 问题诊断

新用户 (312) ≈ 活跃用户 (310)，意味着回访率接近 0%。网站当前是"一次性体验"产品。

### 优化方案: 每日签语 + 历史记录

**1. 每日签语 API** — 新增 `app/api/fortune/daily/route.ts`:

```typescript
import { NextResponse } from "next/server";
import { getRandomFortune } from "@/lib/fortune-database";
import { getUtcDateKey } from "@/lib/quota";
import { cacheManager } from "@/lib/redis-cache";

export async function GET() {
  const dateKey = getUtcDateKey();
  const cacheKey = `daily-fortune:${dateKey}`;

  // 同一天返回同一个签语
  const cached = await cacheManager.get<string>(cacheKey);
  if (cached) {
    return NextResponse.json({ fortune: cached, date: dateKey });
  }

  const fortune = getRandomFortune();
  await cacheManager.set(cacheKey, fortune.message, 86400); // 24小时

  return NextResponse.json({ fortune: fortune.message, date: dateKey });
}
```

**2. 浏览历史组件** — 使用 localStorage 记录已查看的 fortune:

```typescript
// lib/fortune-history.ts
const HISTORY_KEY = "fortune-history";
const MAX_HISTORY = 50;

export function saveFortune(fortune: { message: string; date: string; theme: string }) {
  const history = getHistory();
  history.unshift({ ...fortune, savedAt: new Date().toISOString() });
  if (history.length > MAX_HISTORY) history.pop();
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
}

export function getHistory() {
  try {
    return JSON.parse(localStorage.getItem(HISTORY_KEY) || "[]");
  } catch {
    return [];
  }
}
```

**3. 首页"每日签语"展示区** — 给用户一个每天回来的理由:

在 `app/page.tsx` 中添加一个"Today's Fortune"区块，展示每日固定签语，鼓励用户每天访问查看新签语。

---

## P2-3: 博客导航修复

### 问题诊断

CLAUDE.md 中明确记录了已知问题:
> "Blog navigation link may not appear in desktop navbar due to Turbopack caching."

GA 数据证实了影响: `/blog` 作为着陆页时平均互动仅 **2秒**，用户可能无法从其他页面导航到博客。

### 修复方案

```bash
# 1. 清除 Turbopack 缓存
rm -rf .next node_modules/.cache

# 2. 检查 Navigation.tsx 中博客链接的渲染条件
grep -n "blog\|Blog" components/Navigation.tsx

# 3. 如果是动态导入 (ssr: false) 导致的问题，
# 改为在服务端也渲染导航链接
```

确保 `components/Navigation.tsx` 中博客链接是**静态渲染**的，不依赖客户端状态:

```typescript
// 博客链接应始终显示，不依赖客户端 hydration
<nav>
  {/* 其他链接... */}
  <Link href="/blog" className="nav-link">
    Blog
  </Link>
</nav>
```

---

## P3-1: 缓存策略调优

### 问题诊断

当前日均仅 ~14 个会话 (390/28天)，Redis 的 5 分钟 TTL 在这种低流量下缓存命中率极低。

### 优化方案

修改 `lib/redis-cache.ts` 中的 TTL 配置:

```typescript
// 当前值 → 优化值
const CACHE_CONFIG = {
  fortune: {
    prefix: 'fortune:',
    ttl: 86400,    // 24h (保持不变)
  },
  fortuneList: {
    prefix: 'fortune_list:',
    ttl: 7200,     // 1h → 2h
  },
  analytics: {
    prefix: 'analytics:',
    ttl: 3600,     // 30min → 1h
  },
  api: {
    prefix: 'api:',
    ttl: 1800,     // 5min → 30min (核心优化)
  },
};
```

同时在 `middleware.ts` 的页面缓存中延长 stale-while-revalidate 时间:

```typescript
// 首页缓存: 60s → 300s revalidate
// 内容页缓存: 300s → 600s revalidate
```

---

## P3-2: 移动端体验优化

### 问题诊断

移动流量仅 32.3% (iOS 51 + Android 49)，对于趣味工具类网站偏低 (目标50%+)。

### 优化方案

**1. 减少移动端 Framer Motion 动画复杂度**

在 `components/AIFortuneCookie.tsx` 和背景效果组件中:

```typescript
// 检测低端设备，简化动画
const prefersReducedMotion = typeof window !== 'undefined'
  && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const isMobile = typeof window !== 'undefined'
  && window.innerWidth < 768;

// 移动端使用简化动画
const animationVariants = isMobile ? {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { duration: 0.2 }
} : {
  initial: { opacity: 0, y: 20, scale: 0.95 },
  animate: { opacity: 1, y: 0, scale: 1 },
  transition: { duration: 0.5, type: "spring" }
};
```

**2. 移动端 AdSense 策略**

`components/AdSenseFacade.tsx` 已有网络感知加载，但可以更积极地在移动端跳过:

```typescript
// 在移动端优先保证内容加载速度
if (isMobile && navigator.connection?.effectiveType === '4g') {
  // 仅在 4G 移动网络下加载广告，3s延迟
  setTimeout(loadAdSense, 3000);
} else if (isMobile) {
  // 非 4G 移动网络完全跳过广告
  return;
}
```

---

## 实施路线图

### 第1周 (紧急)
- [ ] 修改 `GUEST_DAILY_LIMIT` 为 5 (10分钟完成)
- [ ] GA4 后台启用 Bot Filtering + 创建数据中心过滤器
- [ ] middleware.ts 添加 Bot User-Agent 检测
- [ ] 排查并修复 /zh/blog 白屏问题
- [ ] 修复桌面端博客导航链接

### 第2周 (SEO)
- [ ] 优化所有核心页面的 Title 和 Description
- [ ] 首页和 /generator 页面注入 FAQ Schema
- [ ] 创建 /free-online-fortune-cookie 着陆页
- [ ] 更新 sitemap.ts 包含新页面

### 第3-4周 (增长)
- [ ] 实现 FortuneShareCard 图片分享组件
- [ ] 实现每日签语 API 和首页展示
- [ ] 实现 fortune 浏览历史 (localStorage)
- [ ] 配额用尽后的引导优化
- [ ] 调整缓存 TTL 配置
- [ ] 移动端动画简化

### 部署后验证
- [ ] 确认 Google Rich Results Test 识别 FAQ Schema
- [ ] 监控 2 周后 CTR 变化
- [ ] 对比优化前后的互动时长和留存率
- [ ] 排除机器人后重新评估真实用户数据

---

## 衡量指标

| 指标 | 当前基线 | 2周目标 | 4周目标 |
|------|----------|---------|---------|
| 核心词 CTR | 2.94% | 4.5% | 6%+ |
| /generator 互动时长 | 17秒 | 35秒 | 45秒+ |
| 日均真实用户 | ~10 | 12 | 18 |
| 回访率 | ~0% | 5% | 15% |
| 社交流量占比 | 0.51% | 2% | 5% |
| 移动流量占比 | 32.3% | 36% | 42% |
| /zh/blog 跳出 | 100% | 60% | 40% |
