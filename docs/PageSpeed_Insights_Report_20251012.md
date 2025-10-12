# PageSpeed Insights 报告

**网址:** https://fortune-cookie.cc/  
**分析时间:** 2025年10月12日 21:24:34  
**设备类型:** 手机 (Moto G 电源)  
**网络环境:** 低速 4G  

---

## 性能评分概览

| 指标 | 得分 | 状态 |
|------|------|------|
| **性能** | 71 | 中等 (50-89) |
| **无障碍** | 89 | 中等 (50-89) |
| **最佳做法** | 93 | 良好 (90-100) |
| **SEO** | 100 | 优秀 (90-100) |

---

## 核心性能指标

### 关键指标 (0-49差 / 50-89中 / 90-100优)

| 指标名称 | 数值 | 说明 |
|---------|------|------|
| **First Contentful Paint (FCP)** | 2.1秒 | 首次内容绘制时间 |
| **Largest Contentful Paint (LCP)** | 9.2秒 | 最大内容绘制时间 |
| **Total Blocking Time (TBT)** | 160毫秒 | 总阻塞时间 |
| **Cumulative Layout Shift (CLS)** | 0 | 累积布局偏移 |
| **Speed Index** | 2.5秒 | 速度指数 |

**测试环境:**
- 时间: 2025年10月12日 GMT+7 21:24
- 模拟设备: Moto G 电源
- Lighthouse版本: 12.8.2
- 浏览器: HeadlessChromium 137.0.7151.119
- 网络: 低速 4G 节流

---

## 性能分析 (71分)

### Insights 洞察

#### 1. 渲染屏蔽请求
**影响:** LCP  
**描述:** 请求正在屏蔽网页的初始渲染，这可能会延迟 LCP。可以将这些网络请求移出关键路径。

| 网址 | 来源 | 传输文件大小 | 时长 |
|------|------|-------------|------|
| fortune-cookie.cc | 第一方 | 20.1 KiB | 0毫秒 |
| www.fortune-cookie.cc | 第一方 | 17.7 KiB | - |
| www.fortune-cookie.cc | 第一方 | 2.4 KiB | - |

#### 2. 旧版 JavaScript
**节省潜力:** 12 KiB  
**描述:** polyfill 和 transform 让旧版浏览器能够使用新的 JavaScript 功能。不过，很多功能对现代浏览器而言并不是必需的。

**涉及的功能:**
- Array.prototype.at
- Array.prototype.flat
- Array.prototype.flatMap
- Object.fromEntries
- Object.hasOwn
- String.prototype.trimEnd
- String.prototype.trimStart

#### 3. LCP 分解

| 子部分 | 时长 |
|--------|------|
| Time to first byte | 150毫秒 |
| Element render delay | 2,160毫秒 |

**LCP 元素:**
```html
<h1 class="text-3xl mb-3 bg-gradient-to-r from-amber-700 via-yellow-600 to-orange-700…" 
    style="filter: drop-shadow(rgba(251, 191, 36, 0.4) 0px 2px 8px);">
Fortune Cookie
</h1>
```

#### 4. 第三方代码影响
**描述:** 第三方代码可能会显著影响加载性能。

| 第三方 | 传输大小 | 主线程耗时 |
|--------|---------|-----------|
| Google/Doubleclick Ads | 222 KiB | 99毫秒 |
| pagead2.googlesyndication.com | 168 KiB | 56毫秒 |
| pagead2.googlesyndication.com | 54 KiB | 44毫秒 |

---

### 诊断结果

#### 1. 减少未使用的 JavaScript
**节省潜力:** 556 KiB  
**影响:** LCP, FCP

**主要资源:**

**第三方资源 (Google/Doubleclick Ads):**
- pagead2.googlesyndication.com: 440.2 KiB → 可节省 332.4 KiB
- pagead2.googlesyndication.com: 167.2 KiB → 可节省 138.2 KiB
- pagead2.googlesyndication.com: 167.2 KiB → 可节省 138.2 KiB
- pagead2.googlesyndication.com: 52.9 KiB → 可节省 28.0 KiB

**第一方资源 (fortune-cookie.cc):**
- www.fortune-cookie.cc: 231.9 KiB → 可节省 224.0 KiB
- www.fortune-cookie.cc: 115.9 KiB → 可节省 112.3 KiB
- www.fortune-cookie.cc: 115.9 KiB → 可节省 111.7 KiB

#### 2. 缩短 JavaScript 执行用时
**时长:** 1.5秒  
**影响:** TBT

**主要资源执行时间:**

**第一方 (fortune-cookie.cc):**
- 总 CPU 时间: 2,255毫秒
  - 脚本评估: 937毫秒
  - 脚本解析: 208毫秒

**第三方 (Google/Doubleclick Ads):**
- 总 CPU 时间: 312毫秒
  - 脚本评估: 160毫秒
  - 脚本解析: 150毫秒

#### 3. 最大限度地减少主线程工作
**时长:** 2.9秒  
**影响:** TBT

**分类统计:**
| 类别 | 花费的时间 |
|------|-----------|
| Script Evaluation | 1,197毫秒 |
| Other | 513毫秒 |
| Style & Layout | 505毫秒 |
| Script Parsing & Compilation | 433毫秒 |
| Rendering | 228毫秒 |
| Garbage Collection | 31毫秒 |
| Parse HTML & CSS | 16毫秒 |

#### 4. 应避免向新型浏览器提供旧版 JavaScript
**节省潜力:** 11 KiB  
**影响:** LCP, FCP

#### 5. 应避免出现长时间运行的主线程任务
**发现:** 7项长时间运行的任务  
**影响:** TBT

**主要任务:**

**第三方 (Google/Doubleclick Ads):**
- pagead2.googlesyndication.com: 开始时间 3,783毫秒, 时长 312毫秒
- pagead2.googlesyndication.com: 开始时间 9,380毫秒, 时长 110毫秒
- pagead2.googlesyndication.com: 开始时间 7,456毫秒, 时长 98毫秒
- pagead2.googlesyndication.com: 开始时间 972毫秒, 时长 53毫秒

**第一方 (fortune-cookie.cc):**
- www.fortune-cookie.cc: 开始时间 9,283毫秒, 时长 221毫秒
- www.fortune-cookie.cc: 开始时间 7,761毫秒, 时长 97毫秒
- www.fortune-cookie.cc: 开始时间 6,238毫秒, 时长 72毫秒

---

### 已通过的审核 (21项)

1. **使用高效的缓存生命周期** - 延长缓存生命周期可加快重访您网页的速度
2. **布局偏移原因** - 避免在网页加载时添加、移除元素
3. **文档请求延迟** - 避免重定向、确保服务器快速响应(142ms)、应用文本压缩
4. **优化 DOM 大小** - 元素总数: 390, 最大子级数: 21, DOM深度: 13
5. **重复的 JavaScript** - 未发现重复的大型 JavaScript 模块
6. **字体显示** - 字体显示策略合理
7. **强制自动重排** - 未发现问题
8. **改进图片传送** - 图片传送优化良好
9. **INP breakdown** - 交互延迟分析
10. **发现 LCP 请求** - LCP 图像加载优化
11. **网络依赖关系树** - 关键路径延迟时间上限: 0毫秒
12. **Preconnected origins** - 无预连接源
13. **针对移动设备优化视口** - 已优化
14. **推迟加载屏幕外图片** - 已优化
15. **缩减 CSS** - CSS文件已缩减
16. **缩减 JavaScript** - JavaScript文件已缩减
17. **减少未使用的 CSS** - CSS使用率良好
18. **避免网络负载过大** - 总大小: 1,552 KiB
19. **User Timing 标记和测量结果** - 性能监控良好
20. **使用 Facade 延迟加载第三方资源** - 第三方资源加载优化
21. **使用被动式监听器** - 滚动性能优化良好

**网络负载详情 (总大小 1,552 KiB):**

**第一方 (fortune-cookie.cc): 483.4 KiB**
- www.fortune-cookie.cc: 117.8 KiB
- www.fortune-cookie.cc: 117.8 KiB
- www.fortune-cookie.cc: 84.7 KiB
- www.fortune-cookie.cc: 55.6 KiB
- www.fortune-cookie.cc: 55.6 KiB
- www.fortune-cookie.cc: 52.0 KiB

**第三方 (Google/Doubleclick Ads): 443.4 KiB**
- pagead2.googlesyndication.com: 167.9 KiB
- pagead2.googlesyndication.com: 167.9 KiB
- pagead2.googlesyndication.com: 53.8 KiB
- pagead2.googlesyndication.com: 53.8 KiB

---

## 无障碍分析 (89分)

### 需要改进的项目

#### 1. 名称和标签
**问题:** 按钮缺少可供访问的名称  
**影响:** 屏幕阅读器会将它读为"按钮"，导致用户无法使用

**与建议不符的元素:**
```html
<button data-slot="button" class="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm fo…">
```

#### 2. 对比度
**问题:** 背景色和前景色没有足够高的对比度  
**影响:** 对于许多用户而言，对比度低的文字都是难以阅读或无法阅读的

**与建议不符的元素:**
```html
<button class="flex-1 bg-orange-500 text-white text-xs py-2 px-3 rounded hover:bg-orange-…">
同意
</button>
```

---

### 待手动检查的其他项 (10项)

1. Interactive controls are keyboard focusable
2. Interactive elements indicate their purpose and state
3. The page has a logical tab order
4. Visual order on the page follows DOM order
5. User focus is not accidentally trapped in a region
6. The user's focus is directed to new content added to the page
7. HTML5 landmark elements are used to improve navigation
8. Offscreen content is hidden from assistive technology
9. Custom controls have associated labels
10. Custom controls have ARIA roles

---

### 已通过的审核 (20项)

1. **[aria-*] 属性与其角色匹配** ✓
2. **文档 <body> 中没有 [aria-hidden="true"]** ✓
3. **[role] 具备所有必需的 [aria-*] 属性** ✓
4. **[aria-*] 属性具备有效值** ✓
5. **[aria-*] 属性有效且拼写正确** ✓
6. **[user-scalable="no"] 未用在 <meta name="viewport">** ✓
7. **按照指定方式在元素角色中使用了 ARIA 属性** ✓
8. **元素仅使用允许的 ARIA 属性** ✓
9. **[role] 值有效** ✓
10. **文档包含 <title> 元素** ✓
11. **<html> 元素包含 [lang] 属性** ✓
12. **<html> 元素的 [lang] 属性具备有效值** ✓
13. **链接具备可识别的名称** ✓
14. **列表只包含 <li> 元素和脚本支持元素** ✓
15. **列表项 (<li>) 包含在父元素中** ✓
16. **所有元素的 [tabindex] 值都不大于 0** ✓
17. **触摸目标的尺寸和间距足够大** ✓
18. **标题元素按降序显示** ✓
19. **使用 ARIA 角色的元素均为兼容元素** ✓
20. **未使用已弃用的 ARIA 角色** ✓

---

### 不适用 (35项)

包括但不限于:
- [accesskey] 值是独一无二的
- button、link 和 menuitem 元素都有可供访问的名称
- 具有 role="dialog" 或 role="alertdialog" 的元素均有无障碍名称
- [aria-hidden="true"] 元素都不含可聚焦的下级元素
- ARIA 输入字段都有可供访问的名称
- 等等...

---

## 最佳做法分析 (93分)

### 常规问题

#### 控制台日志中已记录浏览器错误

**第一方错误 (fortune-cookie.cc):**

1. **Failed to send analytics events:**
```
TypeError: Failed to fetch
    at a.flush (https://www.fortune-cookie.cc/_next/static/chunks/app/layout-1b41ff0a8a52906a.js)
```

2. **Failed to send web vitals:** (多次出现)
```
TypeError: Failed to fetch
    at s (https://www.fortune-cookie.cc/_next/static/chunks/app/layout-1b41ff0a8a52906a.js)
```

3. **Resource loading error:** [object Object] (2次)

**第三方错误 (Google/Doubleclick Ads):**

CSP 违规:
```
Refused to load the script 'https://fundingchoicesmessages.google.com/i/ca-pub-6958408841088360'
因违反 Content Security Policy 指令而被拒绝加载
```

#### 问题记录在 Chrome Devtools 的 Issues 面板中

**问题类型:**
- Content security policy (fundingchoicesmessages.google.com)

#### 大型第一方 JavaScript 缺少源代码映射

**缺少源代码映射的文件:**
- www.fortune-cookie.cc (大型 JavaScript 文件)
- www.fortune-cookie.cc (大型 JavaScript 文件)

---

### 信任与安全

#### 1. 请确保 CSP 能够有效地抵御 XSS 攻击

| 说明 | 指令 | 严重程度 |
|------|------|---------|
| 主机许可名单经常可被绕过。建议改用 CSP nonces 或 hashes | script-src | 高 |
| 使用 `'unsafe-inline'` 将为执行不安全的页内脚本提供可乘之机 | script-src | 高 |

#### 2. 确保通过 COOP 实现适当的源隔离

| 说明 | 严重程度 |
|------|---------|
| 未找到 COOP 标头 | 高 |

#### 3. Mitigate DOM-based XSS with Trusted Types

| 说明 | Severity |
|------|---------|
| No Content-Security-Policy header with Trusted Types directive found | 高 |

---

### 已通过的审核 (12项)

1. **使用 HTTPS** ✓ - 所有网站都通过 HTTPS 保护
2. **请勿使用已弃用的 API** ✓
3. **避免使用第三方 Cookie** ✓
4. **允许用户将内容粘贴到输入字段中** ✓
5. **避免在网页加载时请求地理定位权限** ✓
6. **避免在网页加载时请求通知权限** ✓
7. **显示的图像宽高比正确** ✓
8. **所提供的图片都采用了合适的分辨率** ✓
9. **具有包含 width 或 initial-scale 的 viewport 标记** ✓
10. **文档所用的字体大小清晰可辨** ✓ - 100% 清晰可辨的文字 (≥ 12px)
11. **页面包含 HTML DOCTYPE** ✓
12. **正确地设定了字符集** ✓

---

### 不适用 (4项)

1. 将 HTTP 流量重定向到 HTTPS
2. 使用严格 HSTS 政策
3. 使用 XFO 或 CSP 缓解点击劫持问题
4. 已检测到的 JavaScript 库

---

## SEO 分析 (100分)

### 待手动检查的其他项 (1项)

**结构化数据有效**
- 建议运行额外的验证程序，以检查其他 SEO 最佳做法

---

### 已通过的审核 (9项)

1. **页面未被屏蔽，可编入索引** ✓
2. **文档包含 <title> 元素** ✓
3. **文档有 meta 描述** ✓
4. **页面返回了有效的 HTTP 状态代码** ✓
5. **链接有描述性文字** ✓
6. **链接都是可抓取的** ✓
7. **robots.txt 有效** ✓
8. **文档的 hreflang 有效** ✓
9. **文档的 rel=canonical 有效** ✓

---

### 不适用 (1项)

**图片元素具备 [alt] 属性**

---

## 总结与建议

### 优势
1. ✅ SEO 得分满分 (100分)
2. ✅ 最佳做法得分良好 (93分)
3. ✅ 累积布局偏移 (CLS) 为 0，表现优秀
4. ✅ 无障碍得分较好 (89分)
5. ✅ 使用 HTTPS 加密
6. ✅ 字体大小清晰可辨

### 需要改进的关键问题

#### 性能优化 (优先级：高)
1. **减少 LCP 时间 (9.2秒 → 目标 <2.5秒)**
   - 优化渲染屏蔽请求
   - 减少 Element render delay (2,160毫秒)
   - 优化首字节时间 (TTFB)

2. **减少未使用的 JavaScript (可节省 556 KiB)**
   - 移除第三方广告脚本中的未使用代码
   - 优化第一方 JavaScript bundle

3. **优化 JavaScript 执行**
   - 缩短执行用时 (1.5秒)
   - 减少主线程工作 (2.9秒)
   - 避免长时间运行的任务

4. **移除旧版 JavaScript polyfills (可节省 12-23 KiB)**
   - 针对现代浏览器优化构建流程

#### 无障碍优化 (优先级：中)
1. 为所有按钮添加可供访问的名称
2. 提高文本对比度

#### 安全优化 (优先级：高)
1. 加强 Content Security Policy (CSP)
   - 移除 'unsafe-inline'
   - 使用 nonces 或 hashes
2. 添加 Cross-Origin-Opener-Policy (COOP) 标头
3. 实施 Trusted Types 防御 DOM-based XSS

#### 代码质量 (优先级：中)
1. 添加源代码映射 (source maps)
2. 修复控制台错误
3. 解决第三方广告的 CSP 违规问题

---

## 相关资源

- **新变化:** https://developers.google.com/speed/docs/insights/release_notes
- **文档:** https://developers.google.com/speed/docs/insights/v5/about
- **详细了解网站性能:** https://developers.google.com/speed
- **Stack Overflow:** https://stackoverflow.com/questions/tagged/pagespeed-insights
- **邮寄名单:** https://groups.google.com/g/pagespeed-insights-discuss

**查看树状图:** 可通过 Chrome DevTools Performance Panel 查看更详细的性能追踪信息

---

*报告生成时间: 2025年10月12日 21:24:34*  
*分析工具: PageSpeed Insights (Lighthouse 12.8.2)*