# 上线前手动验证清单

> 本轮改动:留存与分享优化(两批前端 + 一批后端安全加固)。
> 每次开始新一轮「游客路径」测试前,都要在 DevTools → Application → Local Storage 里
> **同时删掉** `fc_client_id_v1` 和 `fc_home_draw_v1`,否则不是干净的新游客。

---

## 0. 已在本地验证通过的项(无需重复,但生产环境值得抽查)

- [x] 额度耗尽后刷新页面,`Crack another` 消失、换成 `Sign in with Google`,文案为
      `That was your last free fortune today. Sign in with Google for more.`
- [x] `remaining` 为哨兵值(`MAX_SAFE_INTEGER` / `9999`)时显示 `Unlimited today.`,不出现天文数字
- [x] 首页仪式句在饼干上方,390px 下在破折号处干净换行
- [x] 四模式卡片顺序:Quick Fortune → Tabletop RPG → Party & Event → Character Voice
- [x] 首页 FAQ 额度话术已更新
- [x] `type-check` / `lint` / 48 条新单测全绿

---

## 1. 游客额度路径(桌面 Chrome 无痕窗口)

| # | 操作 | 期望 |
|---|---|---|
| 1 | 无痕打开首页,看 Local Storage | 初始为空 |
| 2 | 点击饼干 | 1.6s 开裂动画 → 出现签文;LS 出现 `fc_client_id_v1`(UUID)和 `fc_home_draw_v1` |
| 3 | 看签文卡底部小字 | `One free fortune a day. Crack another for a fresh one.` |
| 4 | Network 面板,点 `Crack another`,查请求 | body 里 `source: "generator"`;请求头带 `X-Client-Id`,值与 LS 一致 |
| 5 | 看底部小字 | `2 free fortunes left today.`(不是 3,本次已扣) |
| 6 | 再点 `Crack another` | `1 free fortune left today.` — **单数,没有多余的 s** |
| 7 | 再点 `Crack another` | `That was your last free fortune today. Sign in with Google for more.` |
| 8 | 看按钮区 | `Crack another` 已消失,原位是 `Sign in with Google` |
| 9 | F5 刷新首页 | 仍显示「用完了」,不会退回「还能抽」 |
| 10 | 新开一个标签页访问首页 | 恢复今天的签文,状态与第 9 条一致 |

## 2. 首页 daily 拦截卡(不能是死路)

| # | 操作 | 期望 |
|---|---|---|
| 1 | 完成上一组后,**只删** `fc_home_draw_v1`,保留 `fc_client_id_v1`,刷新 | 饼干回到未开状态 |
| 2 | 点击饼干 | 1.6s 后出现 daily 拦截卡 |
| 3 | 读文案 | `Today's cookie is already open.` + `Sign in with Google for unlimited cookies here — or use your 3 free AI fortunes in the Generator.` |
| 4 | 找可点元素 | **必须有两个出口**:`Sign in with Google` 主按钮 + `Open the Generator` 次按钮 |
| 5 | 点 `Open the Generator` | 跳转 `/generator` |
| 6 | 检查倒计时格式 | 形如 `6h 12m`;接近整点时应为 `6h`(无 `0m`);不足 1 小时应为 `42m` |
| 7 | 卡片放置 61 秒不动 | 倒计时分钟数减 1 |
| 8 | 离开页面后看 Console | 无 "setState on unmounted component" 警告 |

## 3. Generator 四个模式(逐一验)

对 `/generator/oracle`、`/rpg`、`/event`、`/persona` 各做一遍:

| # | 操作 | 期望 |
|---|---|---|
| 1 | 用额度已耗尽的游客身份进入 | 空态提示 `Set your parameters and reveal your fortunes.` |
| 2 | 点生成 | 出现拦截卡,空态提示消失 |
| 3 | 读文案 | `That's 3 for today.` + `Sign in with Google for 10 fortunes a day.`(**不是** "get 7 more") |
| 4 | 卡片底部 | 时钟图标 + `Resets in Xh Ym` |
| 5 | **结果不清空**:换一个有额度的身份,先成功生成一批,再连点到 429 | 上一批结果**仍在屏幕上**,拦截卡出现在它们**上方** |
| 6 | 拦截卡出现后,断网再点生成 | 拦截卡**消失**,只剩 `Network error` toast(不能留着登录前的旧卡) |
| 7 | `/generator/event` 用免费账号把 quantity 调到 >20 生成 | 403 + toast,**不是**拦截卡 |

## 4. 登录路径与 callbackUrl

| # | 操作 | 期望 |
|---|---|---|
| 1 | 在 `/generator/oracle` 撞 429,点拦截卡的登录按钮 | 跳到 `/api/auth/signin/google?callbackUrl=%2Fgenerator%2Foracle` |
| 2 | 完成 Google 登录 | **回到 `/generator/oracle`**,不是首页 |
| 3 | 登录后立即再生成 | 成功;额度是 10/天的新桶(不是「剩 7 次」) |
| 4 | 回归:导航栏的 Sign in | 正常登录,回到当前页 |
| 5 | 回归:`/profile` 未登录态的 Sign in | 同上 |
| 6 | 回归:收藏空态的 Sign in | 同上 |
| 7 | 访问 `https://<域名>//example.com` 并在该页触发登录 | callbackUrl 拼成同源路径,**不得跳到 example.com** |
| 8 | 用 Premium 账号在首页点 `Crack another` | 小字显示 `Unlimited today.`,**不得出现 `9007199254740991`** |

## 5. 分享按钮(三端逐一实测)

### iOS Safari(必须真机,模拟器分享面板行为不同)

| # | 操作 | 期望 |
|---|---|---|
| 1 | 开饼干,看主按钮 | `Send to friends` + 分享图标 |
| 2 | 次级按钮 | `Save image` 和 `Copy`,各占一半宽 |
| 3 | 点 `Send to friends` | 弹出系统分享面板,**面板里带 PNG 预览** |
| 4 | 点面板的「取消」 | **安静回到页面**,不弹新标签页、不弹 toast |
| 5 | 再点 → 选「信息」 | 图片作为附件,正文 `Reply with yours. I need to know it does this to everyone. <url>` |
| 6 | 开 Network Link Conditioner 调慢速,再点主按钮 | 仍弹出分享面板(blob 已预取,手势不过期) |
| 7 | 点 `Save image` | 图片保存/预览,**不得把当前页面导航掉** |
| 8 | 点 `Copy` → 粘贴到备忘录 | `"签文" — apparently. Tell me yours: <url>`,直引号,无乱码 |

### Android Chrome(真机)

| # | 操作 | 期望 |
|---|---|---|
| 1 | 主按钮 | `Send to friends` |
| 2 | 分享到 WhatsApp | 图片 + 邀请文案 |
| 3 | 用返回键取消分享面板 | 不弹新标签页 |
| 4 | `Save image` | 下载到相册,文件名 `fortune-cookie.png`,**打开确认不是 0 字节** |

### 桌面 Chrome / Firefox

| # | 操作 | 期望 |
|---|---|---|
| 1 | 主按钮 | 显示 **`Save image`** + 下载图标(桌面 `canShare({files})` 通常为 false) |
| 2 | 次级按钮区 | 只有一个 `Copy`,且**跨满两列**,不是半宽留白 |
| 3 | 点主按钮 | 下载 `fortune-cookie.png`,打开确认图片完整、签文文字正确渲染 |
| 4 | **Firefox** 重复第 3 条 | **重点确认不是 0 字节 / 下载未中断** |
| 5 | 点 `Copy` | toast `Copied`,剪贴板内容同上 |
| 6 | 在非 https 环境测一次 | `fc_client_id_v1` 应是 32 位 hex(getRandomValues 分支),**不能报错** |

## 6. SEO 回归(四个模式页逐一)

| # | 操作 | 期望 |
|---|---|---|
| 1 | `curl -s <url> \| grep -o '<title>[^<]*'` | oracle → `Quick Fortune Cookie Generator`;rpg → `Tabletop RPG Fortune Generator — Omens & Quest Hooks`;event → `Party & Event Fortune Cookie Generator`;persona → `Character Voice Fortune Cookie Generator` |
| 2 | `curl -s <url> \| grep 'rel="canonical"'` | canonical 指向自身且**与改动前完全一致** |
| 3 | 查 `og:title` / `og:url` / `og:description` | og:url 与 canonical 一致 |
| 4 | 丢进 [Rich Results Test](https://search.google.com/test/rich-results) | JSON-LD 无 error,能识别 `WebPage` 节点,`alternateName` 正确 |
| 5 | Elements 里搜 `ld-mode-` | 每页**只有一个**,无重复 id |
| 6 | Console | 无 CSP 违规报错 |
| 7 | 检查 H 标签 | 每页**只有一个 `<h1>`**(新名),旧品牌名是它上方的 `<p>` |
| 8 | 打开 `/generator` | `<h1>` 仍是 `Fortune Cookie Generator`;`Choose a mode` 是 `<h2>`;卡片标题是 `<h3>` |
| 9 | `/generator` 与首页卡片顺序 | 两处**完全一致**:Quick Fortune → Tabletop RPG → Party & Event → Character Voice |
| 10 | 首页桌面宽度(≥640px) | featured 卡的 `ring-2` 高亮**消失**,四卡齐平 |
| 11 | 首页 390px | 第一张 Quick Fortune 有琥珀色描边 |
| 12 | Search Console → 网址检查,四个 URL 各跑一次 | 可抓取、可索引、渲染后能看到新 title |
| 13 | **上线后 7 天**回看 GSC 这四个 URL | 短期波动正常;**14 天后展示量跌超 30% 考虑回滚标题** |

## 7. 首页性能与仪式文案

| # | 操作 | 期望 |
|---|---|---|
| 1 | 390px 打开首页 | 饼干上方的 `Whoever just came to mind — this one's about them.` 在破折号处换行,无孤字 |
| 2 | Lighthouse 移动端跑首页 | LCP **仍 < 2.5s**,且 LCP 元素没被新增的 `<p>` 抢走 |
| 3 | 对比改动前后 CLS | 保持 < 0.1 |
| 4 | 点饼干看开裂动画 | 动画期间显示 `Reading them.` |
| 5 | 切暗色模式 | 仪式文案和拦截卡对比度足够 |

## 8. ⭐ 真机验证:同 Wi-Fi 两台设备额度互不影响

> **这是本轮改动的核心目的,必须真机验证。本地 localhost 测不出来(IP 都是 127.0.0.1)。**

| # | 操作 | 期望 |
|---|---|---|
| 1 | 两台设备连同一 Wi-Fi,各自访问 whatismyip 对比 | 公网 IP 相同 |
| 2 | 两台都清空站点数据,访问生产环境首页 | 各自的 `fc_client_id_v1` **必须不同** |
| 3 | 设备 A:开饼干 + 连点 3 次 `Crack another` 到耗尽 | A 出现拦截卡 |
| 4 | **核心验证点** 设备 B:开饼干 | **必须正常出签文**,不得出现任何拦截卡 |
| 5 | 设备 B:连点 3 次 `Crack another` | 三次全部成功,B 有独立配额 |
| 6 | 对照实验:设备 B 把 `X-Client-Id` 改成 A 的值再请求 | 立刻 429(证明后端确实按 header 分桶) |
| 7 | 关 Wi-Fi 走 4G/5G(CGNAT 场景)重复 3–4 | 同样互不影响 |
| 8 | 同一设备在同一运营商网段内 IP 轮换 | 额度桶**不变**(不会因为换 IP 白拿额度) |
| 9 | Network 面板 | 每个 `/api/generator` 请求都带 `X-Client-Id`,值稳定 |

## 9. 后端安全加固验证

| # | 操作 | 期望 |
|---|---|---|
| 1 | 同一台机器连打 4 次 generator | 第 4 次 429,不是无限放行(验证哈希没写错) |
| 2 | 无痕 / 禁用 localStorage 的浏览器 | 不 500,回落到按网段的共享桶 |
| 3 | 查 429 响应体 | 含 `authLimit` 字段,值等于线上 `GENERATOR_AUTH_DAILY_LIMIT` 实配值 |
| 4 | 把 `GENERATOR_AUTH_DAILY_LIMIT` 临时改成 7 发一版 | UI 跟着显示 7(**真正验证「不再静默说谎」**) |
| 5 | Premium 用户 | `quota.unlimited === true`,界面无 `9007199254740991` |
| 6 | 上线后头几天看 429 里 `reason: "network_limit"` 的量 | **有真实用户命中就直接调大 `GUEST_IP_DAILY_LIMIT`** — 宁可放过不要误杀 |
| 7 | 观察 generator 接口 p95 | 网段前缀 count 查询没让耗时明显变化 |

### 需要配的环境变量

| 变量 | 默认 | 说明 |
|---|---|---|
| `GUEST_ID_SALT` | 回落 `NEXTAUTH_SECRET` | **建议显式配一个随机值**。否则以后轮换 `NEXTAUTH_SECRET` 会顺手清零全站游客额度。⚠️ 改这个值 = 清空所有游客额度 |
| `GUEST_IP_DAILY_LIMIT` | `200` | 网段每日熔断线,设 ≤0 关闭 |
| `NEXT_PUBLIC_GENERATOR_GUEST_DAILY_LIMIT` | `3` | 需与服务端 `GENERATOR_GUEST_DAILY_LIMIT` 保持一致 |

### 发版时机

**尽量贴着 UTC 零点之后发版。** 本轮 guestId 格式变更会让所有游客当天额度重置一次,零点后发版能让受影响群体最小。

## 10. GA4 埋点(⚠️ 第 3 步必须和上线同一天做)

> 背景:站内 `lib/analytics-manager.ts` 从不调用 gtag,业务事件进不了 GA4,所以此前
> GA4 里关键事件恒为 0。本轮新增 `lib/track.ts` 作为桥,埋了 6 个事件。
> 代码只负责「把事件发出去」,下面这些**只能在 GA4 界面里操作**。

### 10.1 部署后先确认事件到了

1. GA4 → 左下角**管理**(齿轮)→ **DebugView**
2. 装 Chrome 扩展 **Google Analytics Debugger** 并启用,访问 fortunecookie.vip
3. 点饼干 → 点 `Crack another` → 点分享,看 DebugView 里事件是否实时冒出
4. ⚠️ **别用无痕 / 开了广告拦截的浏览器测** — gtag 会被拦掉,你会以为代码坏了

也可以用代码里内置的 debug 开关:控制台执行
`localStorage.setItem("fc_track_debug", "1")` 后刷新,线上会打印 `[track] <事件名> <参数>`。
关闭:`localStorage.removeItem("fc_track_debug")`。开发环境默认就会打印。

### 10.2 等事件在后台注册(最多 24 小时)

**管理 → 数据显示 → 事件**,等这 6 个出现:
`cookie_cracked`、`crack_another_clicked`、`share_clicked`、`share_completed`、
`quota_gate_shown`、`signin_from_gate`

### 10.3 ⚠️ 注册自定义维度 —— 最容易漏,且不追溯历史

GA4 默认**不会**把自定义参数存进报表。不注册的话,你能看到 `share_completed` 有多少次,
但**永远看不到里面的 `method` 和 `result`** —— 而「有多少人打开分享面板然后取消了」
正是本轮最想知道的数字。

**注册之前发生的事件,参数拿不回来。所以这一步要和上线同一天做。**

**管理 → 数据显示 → 自定义定义 → 自定义维度 → 创建**,范围一律选**事件**:

| 维度名称(建议) | 事件参数(必须一字不差) |
|---|---|
| Cookie Source | `source` |
| Is Fallback | `is_fallback` |
| Share Method | `method` |
| Share Result | `result` |
| Share Surface | `surface` |
| Gate Variant | `variant` |
| Is Authenticated | `is_authenticated` |

**自定义指标**页签建 1 个:

| 指标名称 | 范围 | 事件参数 | 计量单位 |
|---|---|---|---|
| Draws Left | 事件 | `draws_left` | 标准 |

> 免费版上限是 50 维度 + 50 指标,先看看现有用了多少。

### 10.4 标记关键事件

同在**管理 → 数据显示 → 事件**,打开这三个的「标记为关键事件」开关:

- ✅ `share_completed` — 分享率核心指标
- ✅ `signin_from_gate` — 拦截卡转化
- ✅ `cookie_cracked` — 激活指标

**不要标** `crack_another_clicked` / `share_clicked` / `quota_gate_shown` ——
它们是漏斗中间步骤,标了会把「转化数」稀释到没法看。

### 10.5 排除内部流量(强烈建议)

你天天在测,不排除的话前几周数据会被自己刷歪。

**管理 → 数据收集和修改 → 数据流 → 选数据流 → 配置代码 → 定义内部流量** → 加你的 IP。
再去 **管理 → 数据设置 → 数据过滤器**,把 Internal Traffic 从「测试中」改成**「有效」**。

### 10.6 搭漏斗(攒够 7 天数据后)

**探索 → 漏斗探索**:

- 留存漏斗:`page_view`(首页)→ `cookie_cracked` → `crack_another_clicked` → `quota_gate_shown` → `signin_from_gate`
- 分享漏斗:`cookie_cracked` → `share_clicked` → `share_completed`,把 **Share Result** 拖进细分维度

### 10.7 时间预期

| 看哪里 | 多久 |
|---|---|
| 实时 / DebugView | 立刻 |
| 标准报表 | 24–48 小时 |
| 漏斗能出稳定结论 | 建议攒 7 天 |

### 10.8 事件语义备忘(避免误读成 bug)

- `crack_another_clicked` **会比** `cookie_cracked` 多 —— 差值就是拦截率,是信号不是漏报
- `share_clicked` **会比** `share_completed` 多 —— 剪贴板被拒时不发 completed,避免把权限错误算成完成
- `share_completed` 的 `result` 除 `shared`/`downloaded`/`cancelled` 外,还有 `opened`(双双失败的兜底)和 `copied`(剪贴板没有「取消」态)
- 主按钮的 `method` 是 `canWebShare ? "share" : "save"` —— 桌面端该按钮本来就是下载,写死 share 会让 method 维度失效
- 首页内联登录按钮的 `variant` 是 `home_inline`,与拦截卡的 `daily`/`generator` 区分

---

## 11. 常规门禁

```bash
npm run type-check
npm run lint
npm run test:ci
npm run build
npm start && npm run test:local
```

---

## 遗留项(不阻塞本次上线,建议单独排期)

1. **数据同意弹层是个摆设** — `AnalyticsConsentBanner` 只控制站内自研埋点,GA 和 AdSense 在 `app/layout.tsx` 的 `<DeferredScripts>` 里**无条件加载**,用户点 Decline 也照跑。如果有欧洲/英国流量,这是真实合规缺口(AdSense 要求的是 Google 认证 CMP)。
2. **`/generator` 的 FAQ schema 没有对应的可见内容** — 只有 JSON-LD,页面上看不到,属于 Google 结构化数据政策风险点。
3. **后端 429 的 `message` 文案仍未与前端拦截卡统一** — 目前被前端兜底覆盖,Web 用户看不到,但移动端 app 直接读这个字段会看到旧话术。
4. **Premium 的 `limit`/`remaining` 仍是 `MAX_SAFE_INTEGER`** — 已加 `unlimited: true`,待前端确认只读该字段后可清掉魔法数字。
5. **首页恢复逻辑对 localStorage 的校验不够** — 只检查 `saved.fortune?.message`,不检查 `numbers`。若日后字段改名或写入不完整,整个首页会崩进 error boundary,用户必须手动清缓存才能恢复。

6. **⚠️ AI 兜底率目前完全不可见 —— 这是个观测盲区** — `FortuneUsage.source` 字段在
   2026-07-01 的 v2 改版时**换了含义**,但没有改名:
   - 改版前(2025-12-20 ~ 2026-06-29):记录 `ai` / `fallback`,即 AI 是否成功
   - 改版后(2026-07-01 起):记录 `home` / `generator`,即额度 scope
     (见 `app/api/generator/route.ts` 写入处 `source: scope`)

   后果:**过去 22 天里 AI 失败了多少次,查不出来**。AI 成功与否只出现在 API 响应体的
   `"source":"ai"` 字段里,从未落库。

   (历史参考:改版前那半年的兜底率是 70/466 ≈ 15%,但这**不能**代表现状,
   代码和模型都换过了。)

   因此新埋的 `cookie_cracked` 事件的 `is_fallback` 参数,是目前**唯一**能测这件事的手段
   —— 这也是第 10.3 节那 7 个自定义维度必须尽快注册的原因之一。

   **在投入 Oracle prompt 重写之前,先用 `is_fallback` 攒一周数据**。如果兜底率不低,
   那么走查里「内容不够有梗、反复撞同一个梗」的抱怨,有一部分根本不是 prompt 的问题,
   而是用户压根没看到 AI 生成的东西。可疑来源:OpenRouter 限额 / 超时 /
   函数冷启动 + Neon 唤醒(实测部署后首批请求会 502)/ 模型返回被
   `lib/prompts/validate.ts` 的反套路校验拦掉。

   **顺带建议**:把 `FortuneUsage` 的 AI 成败重新落库(加一列,别再复用 `source`),
   这样服务端自己就能回答这个问题,不必依赖前端埋点。归后端待办。

7. **⚠️⚠️ 首页开签率可能极低 —— 这条排在所有创意方案之前** — 对比 GA 与生产库
   (GA 6/25–7/22 共 28 天,库 7/1–7/22 共 22 天,量级可比):

   | 指标 | 数量 |
   |---|---|
   | GA:首页活跃用户 | **953** |
   | 库:首页开签 `home` | **122**(平均 5.5 次/天) |
   | 库:Generator 生成 `generator` | 239 |

   **近千人进了首页,真正点开饼干的只有 122 次。** 即使剔掉 GA 里那 718 个
   平均停留 3 秒的疑似机器人(见下),剩余约 400 个真实用户的开签率也只有三成左右。

   本轮所有改动(不清空结果 / 登录卡 / Crack another / 分享按钮)都发生在**开签之后**,
   而绝大多数访客根本没走到那一步。**在优化「第二条签」之前,先搞清楚为什么第一条都没人开。**

   可疑原因(按怀疑度排序):
   1. 数据同意弹层占 390px 首屏底部约 1/4,是进站第一眼看到的东西(见第 1 条)
   2. 饼干视觉上**已经是裂开、露出纸条**的样子,和「点击把它敲开」冲突,削弱点击欲
      (走查第 1 屏已指出)
   3. 首屏没有任何理由说明「为什么值得点」
   4. 相当一部分流量是爬虫,压根不会点

   **验证方式**:新埋的 `cookie_cracked` 事件 ÷ GA 的首页 `page_view`,一周即可得出
   准确开签率,并可按国家拆分以剔除机器人。

   **流量质量参考**(GA 28 天,共 42 个国家/地区):

   | 地区 | 活跃用户 | 平均互动时长 | 互动会话占比 |
   |---|---|---|---|
   | China | 718 (56%) | **3 秒** | 18.6% |
   | United States | 347 (27%) | **32 秒** | 65.7% |
   | South Korea | 74 | 1 秒 | 10.7% |
   | Singapore | 66 | 2 秒 | 16.7% |
   | Canada | 18 | 57 秒 | 80% |

   真实受众其实是美国那 347 人 + 加拿大等英语区,量级约 400–500,**不是 1,281**。
   评估任何改动效果时别拿总数当分母,否则提升会被稀释掉。
   (顺带:欧盟/EEA 仅 Germany 1 人,英国 0 —— 所以第 1 条的合规缺口目前不紧急,
   建议等欧洲流量占比到 2~3% 再处理。)

8. **遗留接口 `/api/fortune` 已 21 天零流量** — 生产库 `FortuneQuota` 最后写入停在
   2026-07-01(正是 v2 改版上线日),`FortuneUsage` 每天都在写。前端五处 fetch 全部指向
   `/api/generator`,iOS app 也没有在调。
   因此 `GUEST_DAILY_LIMIT` / `AUTH_DAILY_LIMIT` 两个线上环境变量目前是**死配置**
   (顺带确认:`FortuneQuota.dailyLimit` 快照全是 1,即线上 `GUEST_DAILY_LIMIT = 1`)。
   **清理顺序必须是**:先在代码里摘掉 `/api/fortune` 和 `/api/fortune/quota` → 确认无人报错
   → 再删环境变量。**反过来先删变量会让代码回落到默认值 5/20**,而不是停止工作。

---

## 后端待办(累计,交 Backend Architect 单独排期)

按优先级排。前三条是这轮改动直接暴露出来的。

| # | 事项 | 出处 |
|---|---|---|
| 1 | **AI 成败重新落库** —— 新加一列(如 `aiOutcome`),**不要再复用 `source`**。这次的教训:一个字段被悄悄换了含义、名字还没改,半年后就没人知道数据在说什么了。落库后服务端自己就能回答兜底率,不必依赖前端埋点 | 遗留项 6 |
| 2 | **两套额度计数合并** —— 遗留 `FortuneQuota`(给 `/api/fortune`)与新的 scope 计数(靠 `FortuneUsage` 行数 count)长期是双份真相。合并时连同遗留接口和 `GUEST_DAILY_LIMIT`/`AUTH_DAILY_LIMIT` 一起清 | 遗留项 8 |
| 3 | **统一 home / generator 两套额度口径** —— 用户界面上是两个突然出现的门槛,不是一条清楚的楼梯 | 走查 #13 |
| 4 | **后端 429 的 `message` 与前端拦截卡逐字统一** —— 绑成同一句话,以后改文案只能改一处 | 遗留项 3 |
| 5 | **清掉 Premium 的 `MAX_SAFE_INTEGER` 魔法数字** —— `unlimited: true` 已上线,待前端确认只读该字段 | 遗留项 4 |
| 6 | **冷启动导致的 502** —— 实测部署后首批 `/api/generator` 请求连续 502(日志停在 "Database connection established"),Vercel 函数冷启动叠加 Neon 唤醒。低谷期第一个用户可能直接看到失败。考虑预热或连接策略调整 | 上线实测 |
| 7 | `FortuneReaction` 新表 + `/api/fortune/reaction`(创意方案第 5 组「轻反应」的前置) | 走查 B3 |
| 8 | Premium 订阅链路:订阅/账单模型、支付回调、`isPremium` 同步 | 走查 #8 |
| 9 | Campaign Preset 存储 + RPG context 的 prompt injection 防护 | 走查 #11 |
| 10 | 跨请求 avoid-list 的存储(Oracle prompt 重写的前置) | 走查 #3 |

## 创意方案(已出稿,待数据决定投哪个)

Whimsy Injector 已交付 6 组,其中 4 组已实现(仪式句 1-B、分享话术 4-C/4-E、四模式命名、额度话术)。
剩余 3 组**不要凭直觉开工**,等 GA4 攒够一周数据后按下面的判断走:

- **若开签率低是主要矛盾** → 三组创意一个都不对症,该做的是首屏(同意弹层、饼干视觉、价值主张)
- **若兜底率高** → prompt 重写没意义,先修 AI 可用性
- **两个都还行** → 再谈 Oracle prompt 重写(14 题材轴 × 6 句式轴 + 跨请求轴记忆)、
  竖版分享卡 4:5 / 9:16 + 预览、结果页轻反应(`It knows` / `Close` / `Liar`)
