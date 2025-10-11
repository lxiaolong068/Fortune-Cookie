import { Redis } from '@upstash/redis'
import { Ratelimit } from '@upstash/ratelimit'

// Redis clientconfiguration
const redis = process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN 
  ? new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    })
  : null

// Cache key prefix
const CACHE_PREFIXES = {
  FORTUNE: 'fortune:',
  FORTUNE_LIST: 'fortune_list:',
  ANALYTICS: 'analytics:',
  USER_SESSION: 'session:',
  API_RESPONSE: 'api:',
} as const

// Cache expiration time（seconds）
const CACHE_TTL = {
  FORTUNE: 60 * 60 * 24, // 24hour(s)
  FORTUNE_LIST: 60 * 60, // 1hour(s)
  ANALYTICS: 60 * 30, // 30minute(s)
  USER_SESSION: 60 * 60 * 24 * 7, // 7day(s)
  API_RESPONSE: 60 * 5, // 5minute(s)
} as const

// Distributed rate limiter (Only enabled when Redis is available)
export const rateLimiters = redis ? {
  // API Request rate limiting：perIP每15minute(s)50times
  api: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(50, '15 m'),
    analytics: true,
    prefix: 'ratelimit:api',
  }),
  
  // Fortune cookie generation rate limiting：perIP每minute(s)10times
  fortune: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(10, '1 m'),
    analytics: true,
    prefix: 'ratelimit:fortune',
  }),
  
  // Search rate limiting：perIP每minute(s)30times
  search: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(30, '1 m'),
    analytics: true,
    prefix: 'ratelimit:search',
  }),
  
  // Strict rate limiting：perIP每hour(s)100times（For sensitive operations）
  strict: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(100, '1 h'),
    analytics: true,
    prefix: 'ratelimit:strict',
  }),
} : null

// Cache manager class
export class CacheManager {
  private redis: Redis | null

  constructor() {
    this.redis = redis
  }

  // Check Redis connection
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

  // Generic cache set
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

  // Generic cache get
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

  // Delete cache
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

  // Batch delete cache（By pattern matching）
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

  // Cache fortune cookie
  async cacheFortune(requestHash: string, fortune: any): Promise<boolean> {
    const key = `${CACHE_PREFIXES.FORTUNE}${requestHash}`
    return this.set(key, fortune, CACHE_TTL.FORTUNE)
  }

  // Get cached fortune cookie
  async getCachedFortune(requestHash: string): Promise<any | null> {
    const key = `${CACHE_PREFIXES.FORTUNE}${requestHash}`
    return this.get(key)
  }

  // Cache fortune cookie list
  async cacheFortuneList(listKey: string, fortunes: any[]): Promise<boolean> {
    const key = `${CACHE_PREFIXES.FORTUNE_LIST}${listKey}`
    return this.set(key, fortunes, CACHE_TTL.FORTUNE_LIST)
  }

  // Get cached fortune cookie list
  async getCachedFortuneList(listKey: string): Promise<any[] | null> {
    const key = `${CACHE_PREFIXES.FORTUNE_LIST}${listKey}`
    return this.get(key)
  }

  // Cache analytics data
  async cacheAnalytics(analyticsKey: string, data: any): Promise<boolean> {
    const key = `${CACHE_PREFIXES.ANALYTICS}${analyticsKey}`
    return this.set(key, data, CACHE_TTL.ANALYTICS)
  }

  // Get cached analytics data
  async getCachedAnalytics(analyticsKey: string): Promise<any | null> {
    const key = `${CACHE_PREFIXES.ANALYTICS}${analyticsKey}`
    return this.get(key)
  }

  // Cache API response
  async cacheApiResponse(endpoint: string, params: string, response: any): Promise<boolean> {
    const key = `${CACHE_PREFIXES.API_RESPONSE}${endpoint}:${params}`
    return this.set(key, response, CACHE_TTL.API_RESPONSE)
  }

  // Get cached API response
  async getCachedApiResponse(endpoint: string, params: string): Promise<any | null> {
    const key = `${CACHE_PREFIXES.API_RESPONSE}${endpoint}:${params}`
    return this.get(key)
  }

  // User session management
  async setUserSession(sessionId: string, sessionData: any): Promise<boolean> {
    const key = `${CACHE_PREFIXES.USER_SESSION}${sessionId}`
    return this.set(key, sessionData, CACHE_TTL.USER_SESSION)
  }

  // Get user session
  async getUserSession(sessionId: string): Promise<any | null> {
    const key = `${CACHE_PREFIXES.USER_SESSION}${sessionId}`
    return this.get(key)
  }

  // Increment counter
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

  // Get cache statistics
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

  // Cleanup expired cache
  async cleanup(): Promise<void> {
    try {
      // Redis Automatically cleans up expired keys，Custom cleanup logic can be added here
      console.log('Cache cleanup completed')
    } catch (error) {
      console.error('Cache cleanup error:', error)
    }
  }
}

// Export singleton instance
export const cacheManager = new CacheManager()

// Utility function: Generate cache key
export function generateCacheKey(prefix: string, ...parts: string[]): string {
  return `${prefix}${parts.join(':')}`
}

// Utility function: Generate request hash
// Use SHA-256 cryptographic hash algorithm to avoid Base64 encoding collision risk
export function generateRequestHash(data: any): string {
  // Use dynamic import for Node.js crypto module
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const crypto = require('crypto')
  return crypto
    .createHash('sha256')
    .update(JSON.stringify(data))
    .digest('hex')
    .slice(0, 32) // 32-char hash for cache key
}
