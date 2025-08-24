# 🔒 Fortune Cookie AI - 安全指南

## 🚨 重要安全提醒

### API 密钥管理
- **永远不要**将真实的API密钥提交到git仓库
- 使用 `.env.local` 文件存储敏感信息（已在 `.gitignore` 中忽略）
- 生产环境请在部署平台的环境变量中配置密钥
- 定期轮换API密钥以确保安全性

### 环境变量配置

#### 开发环境
1. 复制 `.env.example` 为 `.env.local`
2. 填入真实的API密钥和配置值
3. 确保 `.env.local` 不被提交到git

#### 生产环境
1. 在Vercel/Netlify等平台的环境变量设置中配置
2. 不要在代码中硬编码任何敏感信息
3. 使用平台提供的安全存储功能

## 🛡️ 已实施的安全措施

### 1. 速率限制
- API请求限制：50次/15分钟
- 防止API滥用和DDoS攻击
- 可通过环境变量调整限制参数

### 2. 安全头部
- X-Frame-Options: DENY
- X-Content-Type-Options: nosniff
- Referrer-Policy: origin-when-cross-origin
- 防止点击劫持和内容类型嗅探攻击

### 3. 输入验证
- API请求参数验证
- 主题参数白名单验证
- 防止注入攻击

### 4. 错误处理
- 优雅的错误降级
- 不泄露敏感系统信息
- 本地消息库作为备用方案

## 🔧 待实施的安全增强

### 1. Content Security Policy (CSP)
```javascript
// next.config.js 中添加
headers: [
  {
    source: '/(.*)',
    headers: [
      {
        key: 'Content-Security-Policy',
        value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' https://www.googletagmanager.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' https://openrouter.ai https://www.google-analytics.com;"
      }
    ]
  }
]
```

### 2. API请求签名
- 实现HMAC签名验证
- 防止请求重放攻击
- 增强API调用安全性

### 3. CORS限制
- 限制跨域请求来源
- 生产环境严格的CORS策略

## 📋 安全检查清单

### 部署前检查
- [ ] 所有敏感信息已从代码中移除
- [ ] 环境变量正确配置
- [ ] API密钥已轮换（如有泄露）
- [ ] 安全头部已配置
- [ ] 速率限制已启用
- [ ] 错误处理不泄露敏感信息

### 定期安全审查
- [ ] 检查依赖包安全漏洞
- [ ] 审查API访问日志
- [ ] 验证安全头部配置
- [ ] 测试速率限制功能
- [ ] 检查错误日志异常

## 🚨 安全事件响应

### 如果API密钥泄露
1. **立即轮换**受影响的API密钥
2. **检查使用日志**确认是否有异常使用
3. **更新所有环境**的密钥配置
4. **监控账单**确认无异常费用
5. **从git历史中移除**敏感信息

### 如果发现安全漏洞
1. **立即评估**漏洞影响范围
2. **临时缓解**措施（如禁用功能）
3. **开发修复方案**
4. **测试修复效果**
5. **部署安全更新**
6. **通知相关人员**

## 📞 联系方式

如发现安全问题，请通过以下方式联系：
- 创建私有issue报告
- 发送邮件至项目维护者
- 不要在公开渠道披露安全漏洞

## 📚 相关资源

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Next.js Security](https://nextjs.org/docs/advanced-features/security-headers)
- [Vercel Security](https://vercel.com/docs/security)
- [OpenRouter API Security](https://openrouter.ai/docs/security)
