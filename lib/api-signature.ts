import { createHmac, randomBytes, timingSafeEqual } from 'crypto'

// 签名配置
const SIGNATURE_CONFIG = {
  algorithm: 'sha256',
  timestampTolerance: 300, // 5分钟时间窗口
  nonceLength: 16,
  headerPrefix: 'X-API-',
} as const

// 签名头部名称
export const SIGNATURE_HEADERS = {
  SIGNATURE: `${SIGNATURE_CONFIG.headerPrefix}Signature`,
  TIMESTAMP: `${SIGNATURE_CONFIG.headerPrefix}Timestamp`,
  NONCE: `${SIGNATURE_CONFIG.headerPrefix}Nonce`,
  KEY_ID: `${SIGNATURE_CONFIG.headerPrefix}Key-Id`,
} as const

// API密钥接口
export interface ApiKey {
  id: string
  secret: string
  name: string
  permissions: string[]
  createdAt: Date
  expiresAt?: Date
  isActive: boolean
}

// 签名请求接口
export interface SignedRequest {
  method: string
  path: string
  body?: string
  timestamp: number
  nonce: string
  keyId: string
}

// API密钥管理器
export class ApiKeyManager {
  private static keys: Map<string, ApiKey> = new Map()

  // 添加API密钥
  static addKey(key: ApiKey): void {
    this.keys.set(key.id, key)
  }

  // 获取API密钥
  static getKey(keyId: string): ApiKey | null {
    const key = this.keys.get(keyId)
    
    if (!key || !key.isActive) {
      return null
    }
    
    // 检查过期时间
    if (key.expiresAt && key.expiresAt < new Date()) {
      return null
    }
    
    return key
  }

  // 验证权限
  static hasPermission(keyId: string, permission: string): boolean {
    const key = this.getKey(keyId)
    return key ? key.permissions.includes(permission) || key.permissions.includes('*') : false
  }

  // 初始化默认密钥（开发环境）
  static initializeDefaultKeys(): void {
    if (process.env.NODE_ENV === 'development') {
      const defaultKey: ApiKey = {
        id: 'dev-key-001',
        secret: process.env.API_SIGNATURE_SECRET || 'dev-secret-key',
        name: 'Development Key',
        permissions: ['*'],
        createdAt: new Date(),
        isActive: true,
      }
      
      this.addKey(defaultKey)
    }
    
    // 生产环境密钥（从环境变量加载）
    if (process.env.API_KEY_ID && process.env.API_KEY_SECRET) {
      const prodKey: ApiKey = {
        id: process.env.API_KEY_ID,
        secret: process.env.API_KEY_SECRET,
        name: 'Production Key',
        permissions: process.env.API_KEY_PERMISSIONS?.split(',') || ['*'],
        createdAt: new Date(),
        isActive: true,
      }
      
      this.addKey(prodKey)
    }
  }
}

// 请求签名器
export class RequestSigner {
  // 生成签名
  static generateSignature(
    secret: string,
    method: string,
    path: string,
    body: string,
    timestamp: number,
    nonce: string
  ): string {
    // 构建签名字符串
    const signatureString = [
      method.toUpperCase(),
      path,
      body || '',
      timestamp.toString(),
      nonce,
    ].join('\n')
    
    // 生成HMAC签名
    const hmac = createHmac(SIGNATURE_CONFIG.algorithm, secret)
    hmac.update(signatureString, 'utf8')
    return hmac.digest('hex')
  }

  // 验证签名
  static verifySignature(
    secret: string,
    signature: string,
    method: string,
    path: string,
    body: string,
    timestamp: number,
    nonce: string
  ): boolean {
    const expectedSignature = this.generateSignature(
      secret,
      method,
      path,
      body,
      timestamp,
      nonce
    )
    
    // 使用时间安全比较防止时序攻击
    const signatureBuffer = Buffer.from(signature, 'hex')
    const expectedBuffer = Buffer.from(expectedSignature, 'hex')
    
    if (signatureBuffer.length !== expectedBuffer.length) {
      return false
    }
    
    return timingSafeEqual(signatureBuffer, expectedBuffer)
  }

  // 验证时间戳
  static verifyTimestamp(timestamp: number): boolean {
    const now = Math.floor(Date.now() / 1000)
    const diff = Math.abs(now - timestamp)
    return diff <= SIGNATURE_CONFIG.timestampTolerance
  }

  // 生成随机nonce
  static generateNonce(): string {
    return randomBytes(SIGNATURE_CONFIG.nonceLength).toString('hex')
  }
}

// Nonce管理器（防重放攻击）
export class NonceManager {
  private static usedNonces: Set<string> = new Set()
  private static cleanupInterval: NodeJS.Timeout | null = null

  // 检查nonce是否已使用
  static isNonceUsed(nonce: string): boolean {
    return this.usedNonces.has(nonce)
  }

  // 标记nonce为已使用
  static markNonceAsUsed(nonce: string): void {
    this.usedNonces.add(nonce)
    
    // 启动清理定时器
    if (!this.cleanupInterval) {
      this.startCleanup()
    }
  }

  // 启动清理定时器
  private static startCleanup(): void {
    this.cleanupInterval = setInterval(() => {
      // 清理超过时间窗口的nonce
      // 简单实现：清空所有nonce（生产环境应该基于时间戳清理）
      if (this.usedNonces.size > 10000) {
        this.usedNonces.clear()
      }
    }, SIGNATURE_CONFIG.timestampTolerance * 1000)
  }

  // 停止清理定时器
  static stopCleanup(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval)
      this.cleanupInterval = null
    }
  }
}

// 签名验证中间件
export class SignatureValidator {
  // 验证请求签名
  static async validateRequest(
    method: string,
    path: string,
    headers: Headers,
    body?: string
  ): Promise<{ valid: boolean; keyId?: string; error?: string }> {
    try {
      // 提取签名头部
      const signature = headers.get(SIGNATURE_HEADERS.SIGNATURE)
      const timestampStr = headers.get(SIGNATURE_HEADERS.TIMESTAMP)
      const nonce = headers.get(SIGNATURE_HEADERS.NONCE)
      const keyId = headers.get(SIGNATURE_HEADERS.KEY_ID)

      // 检查必需的头部
      if (!signature || !timestampStr || !nonce || !keyId) {
        return { valid: false, error: 'Missing required signature headers' }
      }

      // 验证时间戳格式
      const timestamp = parseInt(timestampStr, 10)
      if (isNaN(timestamp)) {
        return { valid: false, error: 'Invalid timestamp format' }
      }

      // 验证时间戳
      if (!RequestSigner.verifyTimestamp(timestamp)) {
        return { valid: false, error: 'Request timestamp is outside acceptable window' }
      }

      // 检查nonce重放
      if (NonceManager.isNonceUsed(nonce)) {
        return { valid: false, error: 'Nonce has already been used' }
      }

      // 获取API密钥
      const apiKey = ApiKeyManager.getKey(keyId)
      if (!apiKey) {
        return { valid: false, error: 'Invalid API key' }
      }

      // 验证签名
      const isValidSignature = RequestSigner.verifySignature(
        apiKey.secret,
        signature,
        method,
        path,
        body || '',
        timestamp,
        nonce
      )

      if (!isValidSignature) {
        return { valid: false, error: 'Invalid signature' }
      }

      // 标记nonce为已使用
      NonceManager.markNonceAsUsed(nonce)

      return { valid: true, keyId }
    } catch (error) {
      return { 
        valid: false, 
        error: `Signature validation error: ${error instanceof Error ? error.message : 'Unknown error'}` 
      }
    }
  }

  // 检查API权限
  static checkPermission(keyId: string, permission: string): boolean {
    return ApiKeyManager.hasPermission(keyId, permission)
  }
}

// 客户端签名工具
export class ClientSigner {
  // 为请求添加签名
  static signRequest(
    keyId: string,
    secret: string,
    method: string,
    path: string,
    body?: string
  ): Record<string, string> {
    const timestamp = Math.floor(Date.now() / 1000)
    const nonce = RequestSigner.generateNonce()
    
    const signature = RequestSigner.generateSignature(
      secret,
      method,
      path,
      body || '',
      timestamp,
      nonce
    )

    return {
      [SIGNATURE_HEADERS.SIGNATURE]: signature,
      [SIGNATURE_HEADERS.TIMESTAMP]: timestamp.toString(),
      [SIGNATURE_HEADERS.NONCE]: nonce,
      [SIGNATURE_HEADERS.KEY_ID]: keyId,
    }
  }
}

// 初始化API密钥管理器
ApiKeyManager.initializeDefaultKeys()
