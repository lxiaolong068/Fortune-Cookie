# 🔐 API 请求签名验证指南

## 概述

本项目实现了基于HMAC-SHA256的API请求签名验证机制，用于保护敏感API端点免受未授权访问和重放攻击。

## 🏗️ 签名机制

### 签名算法

使用HMAC-SHA256算法对请求进行签名，签名字符串格式：

```
METHOD\n
PATH\n
BODY\n
TIMESTAMP\n
NONCE
```

### 安全特性

- **防重放攻击**: 使用时间戳和nonce防止请求重放
- **时序攻击防护**: 使用时间安全比较函数
- **权限控制**: 基于API密钥的细粒度权限管理
- **时间窗口**: 5分钟的请求时间窗口

## 🔧 配置设置

### 环境变量

```bash
# API 签名配置
API_KEY_ID=your_api_key_id
API_KEY_SECRET=your_api_key_secret
API_KEY_PERMISSIONS=cache:manage,analytics:read,admin

# 开发环境签名密钥
API_SIGNATURE_SECRET=your_dev_signature_secret
```

### 需要签名的API端点

- `/api/admin/*` - 管理员接口
- `/api/cache/*` - 缓存管理接口
- `/api/analytics/dashboard` - 分析仪表板

## 📡 请求签名

### 必需的HTTP头部

```http
X-API-Signature: <hmac_signature>
X-API-Timestamp: <unix_timestamp>
X-API-Nonce: <random_nonce>
X-API-Key-Id: <api_key_id>
```

### 签名生成步骤

1. **构建签名字符串**:
   ```
   GET\n
   /api/cache?action=stats\n
   \n
   1640995200\n
   abc123def456
   ```

2. **生成HMAC签名**:
   ```javascript
   const signature = crypto
     .createHmac('sha256', apiSecret)
     .update(signatureString, 'utf8')
     .digest('hex')
   ```

3. **添加到请求头部**:
   ```javascript
   const headers = {
     'X-API-Signature': signature,
     'X-API-Timestamp': timestamp.toString(),
     'X-API-Nonce': nonce,
     'X-API-Key-Id': keyId,
   }
   ```

## 💻 客户端实现

### JavaScript/Node.js

```javascript
const crypto = require('crypto')

class ApiClient {
  constructor(keyId, secret, baseUrl) {
    this.keyId = keyId
    this.secret = secret
    this.baseUrl = baseUrl
  }

  generateNonce() {
    return crypto.randomBytes(16).toString('hex')
  }

  generateSignature(method, path, body, timestamp, nonce) {
    const signatureString = [
      method.toUpperCase(),
      path,
      body || '',
      timestamp.toString(),
      nonce,
    ].join('\n')
    
    return crypto
      .createHmac('sha256', this.secret)
      .update(signatureString, 'utf8')
      .digest('hex')
  }

  async request(method, path, body) {
    const timestamp = Math.floor(Date.now() / 1000)
    const nonce = this.generateNonce()
    const signature = this.generateSignature(method, path, body, timestamp, nonce)

    const headers = {
      'Content-Type': 'application/json',
      'X-API-Signature': signature,
      'X-API-Timestamp': timestamp.toString(),
      'X-API-Nonce': nonce,
      'X-API-Key-Id': this.keyId,
    }

    const response = await fetch(`${this.baseUrl}${path}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    })

    return response.json()
  }
}

// 使用示例
const client = new ApiClient('your-key-id', 'your-secret', 'https://api.example.com')
const result = await client.request('GET', '/api/cache?action=stats')
```

### Python

```python
import hmac
import hashlib
import time
import secrets
import requests

class ApiClient:
    def __init__(self, key_id, secret, base_url):
        self.key_id = key_id
        self.secret = secret
        self.base_url = base_url

    def generate_nonce(self):
        return secrets.token_hex(16)

    def generate_signature(self, method, path, body, timestamp, nonce):
        signature_string = '\n'.join([
            method.upper(),
            path,
            body or '',
            str(timestamp),
            nonce,
        ])
        
        return hmac.new(
            self.secret.encode('utf-8'),
            signature_string.encode('utf-8'),
            hashlib.sha256
        ).hexdigest()

    def request(self, method, path, body=None):
        timestamp = int(time.time())
        nonce = self.generate_nonce()
        signature = self.generate_signature(method, path, body, timestamp, nonce)

        headers = {
            'Content-Type': 'application/json',
            'X-API-Signature': signature,
            'X-API-Timestamp': str(timestamp),
            'X-API-Nonce': nonce,
            'X-API-Key-Id': self.key_id,
        }

        response = requests.request(
            method,
            f"{self.base_url}{path}",
            headers=headers,
            json=body if body else None
        )

        return response.json()
```

## 🧪 测试工具

### 命令行测试

```bash
# 运行所有测试
node scripts/test-api-signature.js test

# 发送签名请求
node scripts/test-api-signature.js sign GET /api/cache?action=stats

# 生成签名头部
node scripts/test-api-signature.js generate GET /api/cache?action=stats
```

### 测试用例

1. **正常签名请求** - 应该成功
2. **未签名请求** - 应该返回401
3. **过期时间戳** - 应该返回401
4. **错误的密钥ID** - 应该返回401
5. **重复的nonce** - 应该返回401

## 🔒 权限系统

### 权限定义

- `*` - 所有权限
- `admin` - 管理员权限
- `cache:manage` - 缓存管理权限
- `analytics:read` - 分析数据读取权限

### 权限检查

```javascript
// 在API路由中检查权限
import { ApiSignatureHelper } from '@/lib/signature-middleware'

export async function POST(request) {
  if (!ApiSignatureHelper.hasPermission(request, 'cache:manage')) {
    return NextResponse.json(
      { error: 'Permission denied' },
      { status: 403 }
    )
  }
  
  // 处理请求...
}
```

## 🛡️ 安全最佳实践

### 密钥管理

1. **安全存储**: 使用环境变量或密钥管理服务
2. **定期轮换**: 定期更换API密钥
3. **最小权限**: 只授予必要的权限
4. **监控使用**: 监控API密钥的使用情况

### 客户端安全

1. **HTTPS**: 始终使用HTTPS传输
2. **密钥保护**: 不要在客户端代码中硬编码密钥
3. **错误处理**: 妥善处理签名错误
4. **重试机制**: 实现合理的重试策略

### 服务端安全

1. **时间同步**: 确保服务器时间准确
2. **日志记录**: 记录签名验证失败的尝试
3. **速率限制**: 结合速率限制防止暴力攻击
4. **监控告警**: 设置异常访问告警

## 🚨 故障排查

### 常见错误

1. **时间戳错误**
   - 检查客户端和服务器时间同步
   - 确认时间戳格式正确

2. **签名不匹配**
   - 验证签名字符串构建逻辑
   - 检查密钥是否正确

3. **权限不足**
   - 确认API密钥有相应权限
   - 检查权限配置

### 调试技巧

```javascript
// 启用调试日志
console.log('签名字符串:', signatureString)
console.log('生成的签名:', signature)
console.log('请求头部:', headers)
```

## 📚 相关资源

- [HMAC 规范](https://tools.ietf.org/html/rfc2104)
- [HTTP 签名草案](https://tools.ietf.org/html/draft-cavage-http-signatures)
- [API 安全最佳实践](https://owasp.org/www-project-api-security/)
- [时序攻击防护](https://en.wikipedia.org/wiki/Timing_attack)
