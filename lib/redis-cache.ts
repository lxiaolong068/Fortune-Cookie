import { Redis } from '@upstash/redis'
import { Ratelimit } from '@upstash/ratelimit'

// Redis 客户端配置
const redis = process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN 
  ? new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    })
  : null

// 缓存键前缀
const CACHE_PREFIXES = {
  FORTUNE: 'fortune:',
  FORTUNE_LIST: 'fortune_list:',
  ANALYTICS: 'analytics:',
  USER_SESSION: 'session:',
  API_RESPONSE: 'api:',
} as const

// 缓存过期时间（秒）
const CACHE_TTL = {
  FORTUNE: 60 * 60 * 24, // 24小时
  FORTUNE_LIST: 60 * 60, // 1小时
  ANALYTICS: 60 * 30, // 30分钟
  USER_SESSION: 60 * 60 * 24 * 7, // 7天
  API_RESPONSE: 60 * 5, // 5分钟
} as const

// 分布式限流器 (仅在Redis可用时启用)
export const rateLimiters = redis ? {
  // API 请求限流：每个IP每15分钟50次
  api: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(50, '15 m'),
    analytics: true,
    prefix: 'ratelimit:api',
  }),
  
  // 幸运饼干生成限流：每个IP每分钟10次
  fortune: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(10, '1 m'),
    analytics: true,
    prefix: 'ratelimit:fortune',
  }),
  
  // 搜索限流：每个IP每分钟30次
  search: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(30, '1 m'),
    analytics: true,
    prefix: 'ratelimit:search',
  }),
  
  // 严格限流：每个IP每小时100次（用于敏感操作）
  strict: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(100, '1 h'),
    analytics: true,
    prefix: 'ratelimit:strict',
  }),
} : null

// 缓存管理类
export class CacheManager {
  private redis: Redis | null

  constructor() {
    this.redis = redis
  }

  // 检查Redis连接
  async isConnected(): Promise<boolean> {
    try {
      if (!this.redis) return false
      await this.redis.ping()
      return true
    } catch (error) {
      console.error('Redis connection failed:', error)
      return false
    }
  }

  // 通用缓存设置
  async set(key: string, value: any, ttl?: number): Promise<boolean> {
    try {
      if (!this.redis) return false
      if (ttl) {
        await this.redis.setex(key, ttl, JSON.stringify(value))
      } else {
        await this.redis.set(key, JSON.stringify(value))
      }
      return true
    } catch (error) {
      console.error('Cache set error:', error)
      return false
    }
  }

  // 通用缓存获取
  async get<T>(key: string): Promise<T | null> {
    try {
      if (!this.redis) return null
      const value = await this.redis.get(key)
      return value ? JSON.parse(value as string) : null
    } catch (error) {
      console.error('Cache get error:', error)
      return null
    }
  }

  // 删除缓存
  async del(key: string): Promise<boolean> {
    try {
      if (!this.redis) return false
      await this.redis.del(key)
      return true
    } catch (error) {
      console.error('Cache delete error:', error)
      return false
    }
  }

  // 批量删除缓存（通过模式匹配）
  async delPattern(pattern: string): Promise<number> {
    try {
      if (!this.redis) return 0
      const keys = await this.redis.keys(pattern)
      if (keys.length > 0) {
        return await this.redis.del(...keys)
      }
      return 0
    } catch (error) {
      console.error('Cache pattern delete error:', error)
      return 0
    }
  }

  // 缓存幸运饼干
  async cacheFortune(requestHash: string, fortune: any): Promise<boolean> {
    const key = `${CACHE_PREFIXES.FORTUNE}${requestHash}`
    return this.set(key, fortune, CACHE_TTL.FORTUNE)
  }

  // 获取缓存的幸运饼干
  async getCachedFortune(requestHash: string): Promise<any | null> {
    const key = `${CACHE_PREFIXES.FORTUNE}${requestHash}`
    return this.get(key)
  }

  // 缓存幸运饼干列表
  async cacheFortuneList(listKey: string, fortunes: any[]): Promise<boolean> {
    const key = `${CACHE_PREFIXES.FORTUNE_LIST}${listKey}`
    return this.set(key, fortunes, CACHE_TTL.FORTUNE_LIST)
  }

  // 获取缓存的幸运饼干列表
  async getCachedFortuneList(listKey: string): Promise<any[] | null> {
    const key = `${CACHE_PREFIXES.FORTUNE_LIST}${listKey}`
    return this.get(key)
  }

  // 缓存分析数据
  async cacheAnalytics(analyticsKey: string, data: any): Promise<boolean> {
    const key = `${CACHE_PREFIXES.ANALYTICS}${analyticsKey}`
    return this.set(key, data, CACHE_TTL.ANALYTICS)
  }

  // 获取缓存的分析数据
  async getCachedAnalytics(analyticsKey: string): Promise<any | null> {
    const key = `${CACHE_PREFIXES.ANALYTICS}${analyticsKey}`
    return this.get(key)
  }

  // 缓存API响应
  async cacheApiResponse(endpoint: string, params: string, response: any): Promise<boolean> {
    const key = `${CACHE_PREFIXES.API_RESPONSE}${endpoint}:${params}`
    return this.set(key, response, CACHE_TTL.API_RESPONSE)
  }

  // 获取缓存的API响应
  async getCachedApiResponse(endpoint: string, params: string): Promise<any | null> {
    const key = `${CACHE_PREFIXES.API_RESPONSE}${endpoint}:${params}`
    return this.get(key)
  }

  // 用户会话管理
  async setUserSession(sessionId: string, sessionData: any): Promise<boolean> {
    const key = `${CACHE_PREFIXES.USER_SESSION}${sessionId}`
    return this.set(key, sessionData, CACHE_TTL.USER_SESSION)
  }

  // 获取用户会话
  async getUserSession(sessionId: string): Promise<any | null> {
    const key = `${CACHE_PREFIXES.USER_SESSION}${sessionId}`
    return this.get(key)
  }

  // 增量计数器
  async increment(key: string, ttl?: number): Promise<number> {
    try {
      if (!this.redis) return 0
      const result = await this.redis.incr(key)
      if (ttl && result === 1) {
        await this.redis.expire(key, ttl)
      }
      return result
    } catch (error) {
      console.error('Cache increment error:', error)
      return 0
    }
  }

  // 获取缓存统计信息
  async getCacheStats(): Promise<any> {
    try {
      if (!this.redis) {
        return {
          connected: false,
          error: 'Redis client not configured',
          timestamp: new Date().toISOString(),
        }
      }
      // Basic connection test instead of info()
      await this.redis.ping()
      return {
        connected: true,
        timestamp: new Date().toISOString(),
      }
    } catch (error) {
      return {
        connected: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      }
    }
  }

  // 清理过期缓存
  async cleanup(): Promise<void> {
    try {
      // Redis 会自动清理过期键，这里可以添加自定义清理逻辑
      console.log('Cache cleanup completed')
    } catch (error) {
      console.error('Cache cleanup error:', error)
    }
  }
}

// 导出单例实例
export const cacheManager = new CacheManager()

// 工具函数：生成缓存键
export function generateCacheKey(prefix: string, ...parts: string[]): string {
  return `${prefix}${parts.join(':')}`
}

// 工具函数：生成请求哈希
export function generateRequestHash(data: any): string {
  return Buffer.from(JSON.stringify(data)).toString('base64').slice(0, 32)
}
