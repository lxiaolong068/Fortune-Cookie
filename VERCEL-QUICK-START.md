# 🚀 Vercel 快速部署指南

## 📦 一键部署

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-username/fortune-cookie-ai)

## ⚡ 快速开始

### 1. 准备环境变量
在部署前，请准备以下环境变量：

```env
# 必需
OPENROUTER_API_KEY=your_openrouter_api_key
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app

# 推荐
GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX
GOOGLE_VERIFICATION_CODE=your_verification_code
```

### 2. 部署步骤

#### 方法一：GitHub 集成（推荐）
1. Fork 此仓库到您的 GitHub
2. 访问 [Vercel Dashboard](https://vercel.com/dashboard)
3. 点击 "New Project" → 选择您的仓库
4. 配置环境变量 → 点击 "Deploy"

#### 方法二：CLI 部署
```bash
# 安装 Vercel CLI
npm i -g vercel

# 登录并部署
vercel login
vercel --prod
```

### 3. 环境变量配置

在 Vercel 项目设置中添加：

| 变量名 | 类型 | 必需 | 描述 |
|--------|------|------|------|
| `OPENROUTER_API_KEY` | Secret | ✅ | AI 服务 API 密钥 |
| `NEXT_PUBLIC_APP_URL` | Plain | ✅ | 应用完整 URL |
| `GOOGLE_ANALYTICS_ID` | Plain | ❌ | Google Analytics ID |
| `GOOGLE_VERIFICATION_CODE` | Plain | ❌ | 搜索控制台验证 |

## ✅ 部署验证

部署完成后，请验证：

- [ ] 主页正常加载
- [ ] AI 生成器功能正常
- [ ] 所有页面路由可访问
- [ ] 移动端适配良好
- [ ] Lighthouse 评分 > 90

## 🔧 配置说明

### vercel.json 配置
项目已包含优化的 `vercel.json` 配置：

- ✅ 亚太地区服务器优化
- ✅ API 函数超时配置
- ✅ 安全头部设置
- ✅ CORS 策略配置
- ✅ SEO 友好重定向

### 性能优化
- 🚀 自动 CDN 缓存
- 🖼️ 图片自动优化
- 📦 代码自动分割
- 🔄 增量静态再生成

## 🆘 常见问题

### 构建失败？
```bash
# 本地测试构建
npm run build
npm run type-check
```

### API 不工作？
- 检查 `OPENROUTER_API_KEY` 是否正确设置
- 确认环境变量类型设置正确（Secret vs Plain）

### 域名问题？
- 更新 `NEXT_PUBLIC_APP_URL` 为实际域名
- 检查 DNS 配置是否正确

## 📚 更多资源

- 📖 [完整部署文档](./docs/VERCEL-DEPLOYMENT.md)
- 📋 [部署检查清单](./docs/DEPLOYMENT-CHECKLIST.md)
- 🔧 [项目配置说明](./README.md)

---

🎉 **部署成功！享受您的 AI 幸运饼干生成器吧！**
