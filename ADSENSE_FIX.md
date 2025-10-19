# AdSense ads.txt 修复指南

## 问题描述
Google AdSense 报告 "ads.txt 文件未找到"，原因是 Vercel 将 `fortune-cookie.cc` 自动重定向到 `www.fortune-cookie.cc`，导致 AdSense 爬虫无法在根域名上直接访问 ads.txt 文件。

## 诊断结果
- ✅ ads.txt 文件存在于 `public/ads.txt`
- ✅ 文件内容正确：`google.com, pub-6958408841088360, DIRECT, f08c47fec0942fa0`
- ❌ 访问 `https://fortune-cookie.cc/ads.txt` 返回 307 重定向到 `https://www.fortune-cookie.cc/ads.txt`
- ✅ 重定向后的 URL 返回 200 OK

## 解决方案

### 步骤 1：Vercel 域名设置（必需）

这是**最关键**的步骤，必须在 Vercel Dashboard 中完成：

1. 登录 [Vercel Dashboard](https://vercel.com/dashboard)
2. 选择 `Fortune-Cookie` 项目
3. 进入 **Settings** → **Domains**
4. 找到域名配置：
   - `fortune-cookie.cc`
   - `www.fortune-cookie.cc`

#### 选项 A：将根域名设为主域名（推荐）
- 点击 `fortune-cookie.cc` 旁边的 **"Edit"**
- 选择 **"Set as Primary Domain"**
- 这样 `www.fortune-cookie.cc` 会重定向到 `fortune-cookie.cc`
- ads.txt 在根域名上直接可访问

#### 选项 B：保持 www 为主域名，但添加根域名别名
- 确保 `fortune-cookie.cc` 也被添加为域名（不仅仅是重定向）
- 在 Vercel 的 **Project Settings** → **General** 中检查是否有 "Redirect to www" 选项
- 如果有，**取消勾选**该选项

### 步骤 2：验证代码更改（已完成）

以下代码更改已经完成，确保 ads.txt 有正确的 headers：

#### `next.config.js` 更改：
```javascript
// 1. 添加了 ads.txt 的 headers 配置
{
  source: '/:path(ads\\.txt|robots\\.txt)',
  headers: [
    {
      key: 'Content-Type',
      value: 'text/plain; charset=utf-8',
    },
    {
      key: 'Cache-Control',
      value: 'public, max-age=3600, must-revalidate',
    },
  ],
}

// 2. 添加了 rewrites 配置（防止 Next.js 层面的重定向）
async rewrites() {
  return {
    beforeFiles: [
      {
        source: '/ads.txt',
        destination: '/ads.txt',
      },
      {
        source: '/robots.txt',
        destination: '/robots.txt',
      },
    ],
  };
}
```

### 步骤 3：部署更改

```bash
# 提交代码更改
git add next.config.js vercel.json
git commit -m "fix: configure ads.txt headers for AdSense compatibility"
git push origin main
```

### 步骤 4：验证修复

部署完成后（约 1-2 分钟），运行以下测试：

#### 测试 1：检查 HTTP 状态码
```bash
# 测试根域名（关键！）
curl -I https://fortune-cookie.cc/ads.txt

# 期望结果：
# HTTP/2 200 
# content-type: text/plain; charset=utf-8
# （没有 location: 重定向头）
```

#### 测试 2：检查文件内容
```bash
curl https://fortune-cookie.cc/ads.txt

# 期望结果：
# google.com, pub-6958408841088360, DIRECT, f08c47fec0942fa0
```

#### 测试 3：使用在线工具
访问以下任一工具验证：
- https://adstxt.guru/fortune-cookie.cc
- https://www.adstxtvalidator.com/

应该显示：
- ✅ ads.txt 文件找到
- ✅ Publisher ID 有效

### 步骤 5：通知 Google AdSense

1. 登录 [Google AdSense](https://www.google.com/adsense/)
2. 进入 **Sites** → 选择 `fortune-cookie.cc`
3. 点击 **"Check ads.txt"** 或 **"Recheck"**
4. 等待 Google 重新爬取（可能需要 24-48 小时）

## 常见问题

### Q1: 为什么 rewrites 不能解决重定向问题？
A: Next.js 的 rewrites 只能处理应用层的路由，无法阻止 Vercel 平台级的域名重定向。域名重定向发生在请求到达 Next.js 之前。

### Q2: 如果我想保持 www 为主域名怎么办？
A: 可以保持 www 为主域名，但需要确保：
1. 根域名（fortune-cookie.cc）也被添加为有效域名（不仅仅是重定向源）
2. 在 Vercel 设置中禁用 "Redirect to www" 选项
3. 或者在 AdSense 中同时添加两个域名：`fortune-cookie.cc` 和 `www.fortune-cookie.cc`

### Q3: 修复后多久 AdSense 会识别？
A: Google 的爬虫通常在 24-48 小时内重新爬取。你可以：
- 在 AdSense 控制台手动触发重新检查
- 使用 Google Search Console 提交 URL 检查
- 耐心等待自动更新

### Q4: 如何确认 Vercel 的域名设置正确？
A: 在 Vercel Dashboard 中：
- **Settings** → **Domains**
- 查看 "Primary Domain" 标签
- 确保根域名没有显示 "Redirects to www.fortune-cookie.cc"

## 预期结果

修复后的行为：

| URL | 状态码 | 行为 |
|-----|--------|------|
| `https://fortune-cookie.cc/ads.txt` | 200 | ✅ 直接返回文件（无重定向） |
| `https://www.fortune-cookie.cc/ads.txt` | 200 | ✅ 直接返回文件 |
| `https://fortune-cookie.cc/` | 200 或 307 | 根据主域名设置 |
| `https://www.fortune-cookie.cc/` | 200 或 307 | 根据主域名设置 |

## 紧急备选方案

如果以上方案都不生效，可以考虑：

### 方案 A：在 AdSense 中添加两个域名
在 AdSense 控制台中同时添加：
- `fortune-cookie.cc`
- `www.fortune-cookie.cc`

两个域名都使用相同的 ads.txt 文件。

### 方案 B：使用 Cloudflare
如果使用 Cloudflare 作为 DNS 提供商：
1. 在 Cloudflare 中创建 Page Rule
2. 规则：`fortune-cookie.cc/ads.txt` → 不重定向
3. 优先级设为最高

## 参考资料

- [Google AdSense ads.txt 指南](https://support.google.com/adsense/answer/7532444)
- [Vercel 域名配置文档](https://vercel.com/docs/concepts/projects/domains)
- [Next.js Rewrites 文档](https://nextjs.org/docs/api-reference/next.config.js/rewrites)

