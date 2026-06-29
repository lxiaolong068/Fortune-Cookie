# 实施工作流：FortuneCookie.vip v2.0 纯工具站重构

> 源规格：`docs/FortuneCookie.vip 全站改版规格文档`
> 策略：systematic · 深度：deep · 生成日期：2026-06-29
> **本文档为实施计划，不含任何代码执行。** 执行用 `/sc:implement`。

---

## 0. 锁定决策（估算阶段已确认）

| # | 决策 | 后果 |
|---|------|------|
| ① | **删除 i18n，仅保留英语** | 拔除自研 i18n（`app/[locale]/` + `lib/i18n-config.ts` + `lib/translations.ts` + `lib/locale-context.tsx` + middleware ~160 行）；端状态单语言 |
| ② | **全砍 SEO 落地页** | 移除 ~15+ 路由目录及其 `[locale]` 镜像；~20 条 301 → `/` 或 `/generator` |
| ③ | **保留 OpenRouter** | 复用 [lib/openrouter.ts](../lib/openrouter.ts)（387 行）与现有 fallback 链，不迁 OpenAI |

**总估算**：50–74 开发日 ≈ 10–15 周（1 人）/ 6.5–9 周（2 人并行）。置信度 ~72%。
**不含**：支付/Premium 落地、Email Magic Link（标记为可选）。

---

## 1. 目标架构（端状态）

### 1.1 保留并复用
- Google OAuth（NextAuth，[lib/auth.ts](../lib/auth.ts)）
- Quota 框架（[lib/quota.ts](../lib/quota.ts)）— 改造为多计数器
- OpenRouter 生成链（[lib/openrouter.ts](../lib/openrouter.ts)）
- Redis 缓存 / 限流（[lib/redis-cache.ts](../lib/redis-cache.ts)）
- 饼干裂开动画（首页）
- Prisma `User` / `Account` / `Session` / `Favorite` / `FortuneQuota` / `FortuneUsage`

### 1.2 最终路由
```
/                  首页（试用装：1 次 Oracle 抽签）
/generator         生成器入口（4 模式 Tab/卡片）
/generator/oracle  经典预言
/generator/event   活动定制（+批量+PDF）
/generator/rpg     跑团游戏
/generator/persona 多重人格
/profile           用户中心（收藏/历史/导出/设置）
/about /privacy /terms  极简静态页
```

### 1.3 新增数据模型
- **`GenerationHistory`**（新建）：spec 要求"最近 50 条生成历史"，现库无此表（仅 `Favorite`）。字段建议：`id, userId, mode, params(JSON), message, luckyNumbers, createdAt`，索引 `userId+createdAt`。

---

## 2. 依赖图与关键路径

```
P0 拆除 (串行, 阻塞一切)
   │
   ├─► P1 核心 ──────────────┐
   │     ├ 首页重构          │
   │     ├ Generator 框架 ───┼─► P2 完善
   │     ├ Oracle 模式       │     ├ Event+批量+PDF
   │     ├ Alter Ego(3人格)  │     ├ RPG 模式
   │     └ Quota 多计数器 ───┘     └ Profile(收藏/历史/迁移)
   │                                      │
   └──────────────────────────────► P3 增长
                                          ├ Freemium 门控
                                          ├ 剩余 5 人格
                                          ├ 分享图片卡片
                                          └ Lighthouse 优化
```

**关键路径**：P0 → Generator 框架 → 任一模式 → Quota → Profile → Freemium。
**并行窗口**：P1 起 4 个模式相互独立；P2 的 PDF/Profile 可与模式开发错峰；2 人配置见 §6。

---

## 3. Phase 0 — 拆除与 i18n 移除（9–12 d，串行）

> ⚠️ 必须先做干净再叠功能。i18n 拔除是本阶段最易踩坑项。

| ID | 任务 | 涉及文件/路径 | 验收标准 | 依赖 |
|----|------|--------------|---------|------|
| P0-1 | 移除待砍英文路由 | `app/{calendar,recipes,history,explore,blog,messages,browse,faq,search,tag,favorites,cookies}`、`app/fortune-cookie-*`、`app/free-online-fortune-cookie`、`app/funny-fortune-cookie-messages`、`app/how-to-make-fortune-cookies`、`app/who-invented-fortune-cookies` | 目录删除；`npm run build` 无引用报错 | — |
| P0-2 | 拔除自研 i18n | 删 `app/[locale]/` 全树、`lib/i18n-config.ts`、`lib/translations.ts`、`lib/locale-context.tsx`、`lib/content-pipeline*.ts`；简化 [middleware.ts](../middleware.ts)（移除 locale 检测/重定向 ~L97–260，保留 CSP nonce + 限流） | 无 `[locale]` 路由；middleware 仅剩安全/限流；无 locale import | P0-1 |
| P0-3 | 解耦 30 个引用文件 | 导航/footer/sitemap/robots/StructuredData/内链组件（`grep -rl "calendar\|recipes\|/history\|/explore\|/blog"`） | 全站无死链；`app/sitemap.ts`/`app/robots.ts` 仅含保留路由 | P0-1,2 |
| P0-4 | 配置 301 重定向 | `next.config.js` redirects（或精简后的 middleware） | 旧 URL（含历史 locale 前缀）→ `/` 或 `/generator` 返回 301；规格 §7.2 全覆盖 | P0-1,2 |
| P0-5 | 导航栏极简化 | [components/Navigation.tsx](../components/Navigation.tsx)（405 行）→ Logo/Home/Generator/Profile-Login/Theme | 仅 3 核心入口 + 主题切换；移动端正常 | P0-3 |
| P0-6 | 拆除后回归 | 全局 | `npm run type-check` + `npm run lint` + `npm run build` 全绿；`npm run test:ci` 通过（删测同步移除） | P0-1..5 |

**P0 验证门**：build/lint/type-check 全绿 · 旧 URL 301 抽查 · GSC sitemap 仅剩 8 个路由 · 无控制台死链。

---

## 4. Phase 1 — 核心（16–23 d）

| ID | 任务 | 涉及文件 | 验收标准 | 依赖 |
|----|------|---------|---------|------|
| P1-1 | Prompt 工程基座 | 新建 `lib/prompts/`（全局反鸡汤规则 §10.1 + 禁词表 + 反模式校验） | 输出过滤禁词（journey/embrace/manifest…）；单测覆盖禁词命中 | P0 |
| P1-2 | Oracle 模式 | `app/generator/oracle/`、扩展 [app/api/fortune/route.ts](../app/api/fortune/route.ts)（560 行，加 mode 分支）、`lib/openrouter.ts` | Time Horizon/Intensity/Type/Quantity 参数生效；"You will…"句式；坏运幽默化 | P1-1 |
| P1-3 | Generator 框架 | [app/generator/GeneratorClient.tsx](../app/generator/GeneratorClient.tsx)（384 行重构）、`app/generator/page.tsx` | 4 模式 Tab/卡片切换；桌面左参右果 / 移动上下；"纸条抽出"动画 | P0 |
| P1-4 | Alter Ego（3 人格） | `app/generator/persona/`、`lib/prompts/personas.ts` | Passive Aggressive + 2 人格；输出一眼辨认人格；单句 | P1-1,3 |
| P1-5 | 首页重构 | `app/page.tsx`、复用饼干动画组件 | 点击→裂开→Oracle 签文+幸运数字+分享(Copy/X/WhatsApp)+CTA；首屏完整交互；每日 1 次门控 | P1-2 |
| P1-6 | Quota 多计数器改造 | [lib/quota.ts](../lib/quota.ts)、[app/api/fortune/quota/route.ts](../app/api/fortune/quota/route.ts) | 首页 1/天；生成器游客 3/天、登录 10/天；按入口独立计数；UTC 重置 | P1-2 |

**P1 验证门**：Oracle+Alter Ego 输出经**人工评审**（措辞质量）· Quota 各计数器 429 行为正确 · 首页移动端首屏交互无滚动 · 反鸡汤禁词单测通过。

---

## 5. Phase 2 — 完善（14–21 d）

| ID | 任务 | 涉及文件 | 验收标准 | 依赖 |
|----|------|---------|---------|------|
| P2-1 | Event Master + 批量 + 去重 | `app/generator/event/`、生成 API 批量分支 | 个人信息自然融入；≤15 词；Quantity 10–100；Avoid Duplicates 开关确保无重复 | P1-3 |
| P2-2 | PDF 打印导出 | `lib/pdf-export.ts`（客户端 `@react-pdf/renderer` 或 `jspdf`，需加依赖） | A4 条格 + 剪裁虚线 + 7cm×1.5cm 适配 + 可选幸运数字/日期/Logo；**实物打印验证** | P2-1 |
| P2-3 | RPG 模式 | `app/generator/rpg/`、`lib/prompts/rpg.ts` | Target×Style×Setting 矩阵；角色用古语/玩家破第四面墙；避免现代俚语(除 Modern) | P1-3 |
| P2-4 | GenerationHistory 模型 | `prisma/schema.prisma`（新建表）、`npm run db:migrate` | 迁移成功；写入生成记录 | P1-2 |
| P2-5 | Profile 页 | `app/profile/`（重构 [ProfilePageContent.tsx](../app/profile/ProfilePageContent.tsx)）、[app/api/favorites/route.ts](../app/api/favorites/route.ts) | My Favorites（复用 `Favorite`）+ History 50 条 + Export All(PDF/TXT) + Settings | P2-4 |
| P2-6 | 收藏数据迁移 | 迁移脚本 `scripts/` | 现有 `Favorite` 数据在新 Profile 正常展示；无丢失（规格 §11） | P2-5 |

**P2 验证门**：PDF 实物打印尺寸正确 · 批量去重 100 条无重复 · History 上限 50 滚动正确 · 迁移前后收藏计数一致 · 4 模式全部可用。

---

## 6. Phase 3 — 增长（11–18 d）

| ID | 任务 | 涉及文件 | 验收标准 | 依赖 |
|----|------|---------|---------|------|
| P3-1 | Freemium 门控系统 | `lib/quota.ts`、生成 API、各模式前端 | 批量(20+)/PDF/高级人格按 free/premium 门控；premium flag 占位（不接支付） | P2 |
| P3-2 | 剩余 5 人格 | `lib/prompts/personas.ts` | 8 人格全；各人格风格指南 + 辨识度人评 | P1-4 |
| P3-3 | 分享图片卡片 | `app/api/og/` 或 canvas 组件 | 生成签文图片卡（X/WhatsApp 适配） | P1-5 |
| P3-4 | Lighthouse 优化 | 全局 | LCP<2.5s / INP<200ms / CLS<0.1；移动端 Lighthouse ≥90 | P3-1..3 |
| P3-5 | （可选）Email Magic Link | `lib/auth.ts` | NextAuth Email Provider 可登录 | P0 |

**P3 验证门**：Lighthouse 移动端 ≥90 · Core Web Vitals 达标 · Freemium 各档位门控正确 · 分享卡片三平台预览正常。

---

## 7. 横切关注点

- **测试**：每模式加 Jest 单测（参数→prompt→输出过滤）；Playwright E2E 覆盖 4 模式生成流 + Quota 429 + Profile；目标覆盖率 ≥70%（沿用现有门槛）。
- **SEO**：P0 后重交 sitemap；监控 GSC 索引变化与流量断崖（已知风险，业务接受）；保留 IndexNow 提交新核心页。
- **安全**：沿用输入消毒/限流/CSP nonce（middleware 精简后保留）；prompt 注入防护扩展到新模式自由文本输入（Event 个人信息、Persona topic）。
- **可观测**：保留 GA / web-vitals / error-monitoring。

---

## 8. 风险登记与缓解

| 风险 | 等级 | 缓解 |
|------|------|------|
| AI 措辞质量（反鸡汤+人格辨识度反复迭代） | 🔴 | P1 早做 prompt 基座 + 人评门；建黄金样例集回归；Passive Aggressive 优先打磨 |
| i18n 拔除破坏路由/SEO | 🔴 | P0 独立分支；middleware 改动小步提交；301 全量回归测试 |
| PDF 真实尺寸/跨浏览器打印 | 🟡 | P2 早做 PDF 原型 + 实物打印验证，勿留到末期 |
| 收藏数据迁移丢失 | 🟡 | 迁移前备份；脚本幂等；前后计数比对 |
| SEO 流量断崖 | 🟡（业务） | 上线前后 GSC 对比；核心页强化结构化数据 |

---

## 9. 并行执行计划（2 人）

| 周期 | Dev A | Dev B |
|------|-------|-------|
| P0 | 路由拆除 + i18n 拔除（P0-1,2,4） | 解耦引用 + 导航 + 回归（P0-3,5,6） |
| P1 | Prompt 基座 + Oracle + 首页（P1-1,2,5） | Generator 框架 + Alter Ego + Quota（P1-3,4,6） |
| P2 | Event + PDF（P2-1,2） | RPG + History 模型 + Profile + 迁移（P2-3,4,5,6） |
| P3 | Freemium + 分享卡片（P3-1,3） | 剩余人格 + Lighthouse + (可选)Magic Link（P3-2,4,5） |

> 日历周期压缩至 ~6.5–9 周。P0 内部仍有强依赖，并行收益有限；P1 起收益最大。

---

## 10. 下一步

- 执行：`/sc:implement`（建议从 **P0-1** 开始，按本表逐项推进）
- 每阶段末跑对应**验证门**后再进入下一阶段
- 建议为本重构开 `feat/v2-toolsite-rebuild` 分支，按 P0/P1/P2/P3 增量提交

*工作流版本：v1 | 基于代码库实勘（45 page.tsx / 113 组件 / 46 lib / 自研 i18n / OpenRouter）*
