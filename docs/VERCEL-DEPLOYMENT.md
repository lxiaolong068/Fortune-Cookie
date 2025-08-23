# 🚀 Vercel 部署指南 - Fortune Cookie AI

## 📋 部署前准备

### 1. 账户准备
- 注册 [Vercel 账户](https://vercel.com/signup)
- 安装 Vercel CLI：`npm i -g vercel`
- 连接 GitHub 仓库到 Vercel

### 2. 环境变量准备
确保您已准备好以下环境变量：

#### 必需的环境变量
```env
# AI 服务配置
OPENROUTER_API_KEY=your_openrouter_api_key_here

# 应用配置
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
```

#### 推荐的环境变量
```env
# Google 服务
GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX
GOOGLE_VERIFICATION_CODE=your_verification_code

# 应用名称
NEXT_PUBLIC_APP_NAME=Fortune Cookie AI

# 速率限制配置
RATE_LIMIT_MAX_REQUESTS=100
RATE_LIMIT_WINDOW_MS=900000
```

## 🔧 Vercel 配置详解

### vercel.json 配置说明

我们的 `vercel.json` 配置包含以下优化：

#### 1. 基础配置
- **Framework**: 自动检测为 Next.js
- **Regions**: 优化亚太地区访问速度（香港、新加坡、东京）
- **Build**: 使用 `npm run build` 构建

#### 2. 函数配置
- **AI API**: 30秒超时（处理 AI 生成请求）
- **静态 API**: 10秒超时（快速响应）

#### 3. 安全头部
- X-Frame-Options: 防止点击劫持
- X-Content-Type-Options: 防止 MIME 类型嗅探
- Referrer-Policy: 控制引用信息

#### 4. CORS 配置
- API 路由支持跨域访问
- 支持常用 HTTP 方法

#### 5. URL 重写和重定向
- SEO 友好的 URL 重定向
- sitemap.xml 和 robots.txt 路由

## 🚀 部署步骤

### 方法一：GitHub 集成部署（推荐）

1. **连接仓库**
   ```bash
   # 推送代码到 GitHub
   git add .
   git commit -m "Ready for Vercel deployment"
   git push origin main
   ```

2. **Vercel 仪表板配置**
   - 访问 [Vercel Dashboard](https://vercel.com/dashboard)
   - 点击 "New Project"
   - 选择您的 GitHub 仓库
   - 配置项目设置

3. **环境变量配置**
   - 在项目设置中添加环境变量
   - 确保所有必需变量都已配置
   - 保存并重新部署

### 方法二：CLI 部署

1. **登录 Vercel**
   ```bash
   vercel login
   ```

2. **初始化项目**
   ```bash
   vercel
   # 按提示配置项目
   ```

3. **生产部署**
   ```bash
   vercel --prod
   ```

## ⚙️ 环境变量配置

### 在 Vercel 仪表板中配置

1. 进入项目设置页面
2. 选择 "Environment Variables" 标签
3. 添加以下变量：

| 变量名 | 类型 | 描述 | 示例值 |
|--------|------|------|--------|
| `OPENROUTER_API_KEY` | Secret | OpenRouter API 密钥 | `sk-or-v1-...` |
| `NEXT_PUBLIC_APP_URL` | Plain Text | 应用完整 URL | `https://your-app.vercel.app` |
| `GOOGLE_ANALYTICS_ID` | Plain Text | GA4 跟踪 ID | `G-XXXXXXXXXX` |
| `GOOGLE_VERIFICATION_CODE` | Plain Text | 搜索控制台验证码 | `your_verification_code` |

### 环境变量最佳实践

1. **安全性**
   - API 密钥设置为 "Secret" 类型
   - 不要在客户端代码中暴露敏感信息

2. **环境区分**
   - Development: 开发环境变量
   - Preview: 预览环境变量
   - Production: 生产环境变量

## 🔍 部署后验证

### 1. 功能测试清单
- [ ] 主页正常加载
- [ ] AI 生成器功能正常
- [ ] 所有页面路由可访问
- [ ] API 端点响应正常
- [ ] 移动端适配良好

### 2. 性能验证
- [ ] Lighthouse 评分 > 90
- [ ] Core Web Vitals 达标
- [ ] 图片优化生效
- [ ] 缓存策略正常

### 3. SEO 验证
- [ ] Meta 标签正确生成
- [ ] Sitemap 可访问
- [ ] Robots.txt 配置正确
- [ ] 结构化数据有效

## 🛠️ 常见问题解决

### 1. 构建失败
```bash
# 检查依赖
npm ci
npm run build

# 检查 TypeScript
npm run type-check
```

### 2. 环境变量问题
- 确保变量名拼写正确
- 检查变量值是否包含特殊字符
- 验证 NEXT_PUBLIC_ 前缀变量

### 3. API 超时问题
- 检查 vercel.json 中的函数超时配置
- 优化 API 响应时间
- 考虑使用缓存策略

### 4. 域名配置
```bash
# 添加自定义域名
vercel domains add your-domain.com
```

## 📊 监控和分析

### 1. Vercel Analytics
- 自动启用 Vercel Analytics
- 监控页面性能和用户行为

### 2. 错误监控
- 查看 Vercel 函数日志
- 监控 API 错误率

### 3. 性能监控
- Core Web Vitals 跟踪
- 页面加载时间分析

## 🔄 持续部署

### 自动部署配置
- 主分支推送自动部署到生产环境
- Pull Request 自动创建预览部署
- 支持回滚到之前版本

### 部署钩子
```bash
# 部署后运行测试
npm run test:deployment
```

## 📝 部署检查清单

- [ ] 代码推送到 GitHub
- [ ] Vercel 项目创建完成
- [ ] 环境变量配置完成
- [ ] 自定义域名配置（如需要）
- [ ] SSL 证书自动配置
- [ ] 功能测试通过
- [ ] 性能测试达标
- [ ] SEO 配置验证
- [ ] 监控设置完成

## 🎯 优化建议

1. **性能优化**
   - 启用 Vercel Edge Functions
   - 配置 CDN 缓存策略
   - 使用 Image Optimization

2. **安全优化**
   - 配置安全头部
   - 启用 HTTPS 重定向
   - 设置 CORS 策略

3. **SEO 优化**
   - 配置自定义域名
   - 提交 sitemap 到搜索引擎
   - 设置 Google Analytics

---

🎉 **恭喜！您的 Fortune Cookie AI 应用已成功部署到 Vercel！**

如有问题，请参考 [Vercel 官方文档](https://vercel.com/docs) 或查看项目的其他文档。
