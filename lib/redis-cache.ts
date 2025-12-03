/**
 * Redis Cache and Rate Limiting Module
 *
 * Provides distributed caching and rate limiting functionality using Upstash Redis.
 * Supports multi-tier caching with configurable TTLs and sliding window rate limiting.
 *
 * @module lib/redis-cache
 */

import { Redis } from "@upstash/redis";
import { Ratelimit } from "@upstash/ratelimit";

/**
 * Redis client instance
 * Initialized only if UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN are provided
 * @private
 */
const redis =
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
    ? new Redis({
        url: process.env.UPSTASH_REDIS_REST_URL,
        token: process.env.UPSTASH_REDIS_REST_TOKEN,
      })
    : null;

/**
 * Cache key prefixes for different data types
 * Used to namespace cache keys and prevent collisions
 * @constant
 */
const CACHE_PREFIXES = {
  FORTUNE: "fortune:",
  FORTUNE_LIST: "fortune_list:",
  ANALYTICS: "analytics:",
  USER_SESSION: "session:",
  API_RESPONSE: "api:",
} as const;

/**
 * Cache TTL (Time To Live) values in seconds
 * Defines how long different types of data should be cached
 * @constant
 */
const CACHE_TTL = {
  FORTUNE: 60 * 60 * 24, // 24 hours
  FORTUNE_LIST: 60 * 60, // 1 hour
  ANALYTICS: 60 * 30, // 30 minutes
  USER_SESSION: 60 * 60 * 24 * 7, // 7 days
  API_RESPONSE: 60 * 5, // 5 minutes
} as const;

/**
 * Distributed rate limiters using sliding window algorithm
 * Only enabled when Redis is available
 *
 * @property {Ratelimit} api - API request rate limiter (50 requests per 15 minutes per IP)
 * @property {Ratelimit} fortune - Fortune generation rate limiter (10 requests per minute per IP)
 * @property {Ratelimit} search - Search rate limiter (30 requests per minute per IP)
 * @property {Ratelimit} strict - Strict rate limiter for sensitive operations (100 requests per hour per IP)
 *
 * @example
 * ```typescript
 * if (rateLimiters) {
 *   const { success } = await rateLimiters.api.limit(ipAddress)
 *   if (!success) {
 *     return new Response('Rate limit exceeded', { status: 429 })
 *   }
 * }
 * ```
 */
export const rateLimiters = redis
  ? {
      // API Request rate limiting: 50 requests per 15 minutes per IP
      api: new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(50, "15 m"),
        analytics: true,
        prefix: "ratelimit:api",
      }),

      // Fortune cookie generation rate limiting: 10 requests per minute per IP
      fortune: new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(10, "1 m"),
        analytics: true,
        prefix: "ratelimit:fortune",
      }),

      // Search rate limiting: 30 requests per minute per IP
      search: new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(30, "1 m"),
        analytics: true,
        prefix: "ratelimit:search",
      }),

      // Strict rate limiting: 100 requests per hour per IP (for sensitive operations)
      strict: new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(100, "1 h"),
        analytics: true,
        prefix: "ratelimit:strict",
      }),

      // AI generation rate limiting: 1 request per hour per IP (cost control)
      aiGeneration: new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(1, "1 h"),
        analytics: true,
        prefix: "ratelimit:ai_generation",
      }),
    }
  : null;

/**
 * Cache Manager
 *
 * Manages distributed caching operations using Redis.
 * Provides methods for storing, retrieving, and managing cached data.
 * Gracefully handles Redis unavailability by returning null/false.
 *
 * @class
 * @example
 * ```typescript
 * const cache = new CacheManager()
 *
 * // Check connection
 * const connected = await cache.isConnected()
 *
 * // Set cache
 * await cache.set('key', { data: 'value' }, 3600)
 *
 * // Get cache
 * const data = await cache.get('key')
 * ```
 */
export class CacheManager {
  private redis: Redis | null;

  constructor() {
    this.redis = redis;
  }

  /**
   * Check if Redis connection is available
   *
   * @returns {Promise<boolean>} True if connected, false otherwise
   *
   * @example
   * ```typescript
   * const cache = new CacheManager()
   * if (await cache.isConnected()) {
   *   console.log('Redis is available')
   * }
   * ```
   */
  async isConnected(): Promise<boolean> {
    try {
      if (!this.redis) return false;
      await this.redis.ping();
      return true;
    } catch (error) {
      console.error("Redis connection failed:", error);
      return false;
    }
  }

  /**
   * Set a value in cache with optional TTL
   *
   * @param {string} key - Cache key
   * @param {any} value - Value to cache (will be JSON stringified)
   * @param {number} [ttl] - Time to live in seconds (optional)
   * @returns {Promise<boolean>} True if successful, false otherwise
   *
   * @example
   * ```typescript
   * // Set with TTL
   * await cache.set('user:123', { name: 'John' }, 3600)
   *
   * // Set without TTL (permanent)
   * await cache.set('config', { theme: 'dark' })
   * ```
   */
  async set(key: string, value: any, ttl?: number): Promise<boolean> {
    try {
      if (!this.redis) return false;
      if (ttl) {
        await this.redis.setex(key, ttl, JSON.stringify(value));
      } else {
        await this.redis.set(key, JSON.stringify(value));
      }
      return true;
    } catch (error) {
      console.error("Cache set error:", error);
      return false;
    }
  }

  /**
   * Get a value from cache
   *
   * @template T - Type of the cached value
   * @param {string} key - Cache key
   * @returns {Promise<T | null>} Cached value or null if not found/error
   *
   * @example
   * ```typescript
   * const user = await cache.get<User>('user:123')
   * if (user) {
   *   console.log(user.name)
   * }
   * ```
   */
  async get<T>(key: string): Promise<T | null> {
    try {
      if (!this.redis) return null;
      const value = await this.redis.get(key);
      return value ? JSON.parse(value as string) : null;
    } catch (error) {
      console.error("Cache get error:", error);
      return null;
    }
  }

  /**
   * Delete a cache entry
   *
   * @param {string} key - Cache key to delete
   * @returns {Promise<boolean>} True if successful, false otherwise
   *
   * @example
   * ```typescript
   * await cache.del('user:123')
   * ```
   */
  async del(key: string): Promise<boolean> {
    try {
      if (!this.redis) return false;
      await this.redis.del(key);
      return true;
    } catch (error) {
      console.error("Cache delete error:", error);
      return false;
    }
  }

  /**
   * Delete multiple cache entries by pattern
   *
   * @param {string} pattern - Redis key pattern (e.g., 'user:*')
   * @returns {Promise<number>} Number of keys deleted
   *
   * @example
   * ```typescript
   * // Delete all user caches
   * const deleted = await cache.delPattern('user:*')
   * console.log(`Deleted ${deleted} keys`)
   * ```
   */
  async delPattern(pattern: string): Promise<number> {
    try {
      if (!this.redis) return 0;
      const keys = await this.redis.keys(pattern);
      if (keys.length > 0) {
        return await this.redis.del(...keys);
      }
      return 0;
    } catch (error) {
      console.error("Cache pattern delete error:", error);
      return 0;
    }
  }

  /**
   * Cache a fortune cookie result
   *
   * @param {string} requestHash - Hash of the fortune request parameters
   * @param {any} fortune - Fortune object to cache
   * @returns {Promise<boolean>} True if successful, false otherwise
   *
   * @example
   * ```typescript
   * const hash = generateRequestHash({ theme: 'inspirational' })
   * await cache.cacheFortune(hash, {
   *   message: 'Your future is bright',
   *   luckyNumbers: [1, 2, 3, 4, 5, 6]
   * })
   * ```
   */
  async cacheFortune(requestHash: string, fortune: any): Promise<boolean> {
    const key = `${CACHE_PREFIXES.FORTUNE}${requestHash}`;
    return this.set(key, fortune, CACHE_TTL.FORTUNE);
  }

  /**
   * Get a cached fortune cookie
   *
   * @param {string} requestHash - Hash of the fortune request parameters
   * @returns {Promise<any | null>} Cached fortune or null if not found
   *
   * @example
   * ```typescript
   * const hash = generateRequestHash({ theme: 'inspirational' })
   * const fortune = await cache.getCachedFortune(hash)
   * ```
   */
  async getCachedFortune(requestHash: string): Promise<any | null> {
    const key = `${CACHE_PREFIXES.FORTUNE}${requestHash}`;
    return this.get(key);
  }

  /**
   * Cache a list of fortune cookies
   *
   * @param {string} listKey - Key for the fortune list
   * @param {any[]} fortunes - Array of fortune objects
   * @returns {Promise<boolean>} True if successful, false otherwise
   *
   * @example
   * ```typescript
   * await cache.cacheFortuneList('category:inspirational', fortunes)
   * ```
   */
  async cacheFortuneList(listKey: string, fortunes: any[]): Promise<boolean> {
    const key = `${CACHE_PREFIXES.FORTUNE_LIST}${listKey}`;
    return this.set(key, fortunes, CACHE_TTL.FORTUNE_LIST);
  }

  /**
   * Get a cached fortune list
   *
   * @param {string} listKey - Key for the fortune list
   * @returns {Promise<any[] | null>} Cached fortune list or null if not found
   *
   * @example
   * ```typescript
   * const fortunes = await cache.getCachedFortuneList('category:inspirational')
   * ```
   */
  async getCachedFortuneList(listKey: string): Promise<any[] | null> {
    const key = `${CACHE_PREFIXES.FORTUNE_LIST}${listKey}`;
    return this.get(key);
  }

  /**
   * Cache analytics data
   *
   * @param {string} analyticsKey - Key for analytics data
   * @param {any} data - Analytics data to cache
   * @returns {Promise<boolean>} True if successful
   */
  async cacheAnalytics(analyticsKey: string, data: any): Promise<boolean> {
    const key = `${CACHE_PREFIXES.ANALYTICS}${analyticsKey}`;
    return this.set(key, data, CACHE_TTL.ANALYTICS);
  }

  /**
   * Get cached analytics data
   *
   * @param {string} analyticsKey - Key for analytics data
   * @returns {Promise<any | null>} Cached analytics or null
   */
  async getCachedAnalytics(analyticsKey: string): Promise<any | null> {
    const key = `${CACHE_PREFIXES.ANALYTICS}${analyticsKey}`;
    return this.get(key);
  }

  /**
   * Cache API response
   *
   * @param {string} endpoint - API endpoint
   * @param {string} params - Request parameters
   * @param {any} response - Response data to cache
   * @returns {Promise<boolean>} True if successful
   */
  async cacheApiResponse(
    endpoint: string,
    params: string,
    response: any,
  ): Promise<boolean> {
    const key = `${CACHE_PREFIXES.API_RESPONSE}${endpoint}:${params}`;
    return this.set(key, response, CACHE_TTL.API_RESPONSE);
  }

  /**
   * Get cached API response
   *
   * @param {string} endpoint - API endpoint
   * @param {string} params - Request parameters
   * @returns {Promise<any | null>} Cached response or null
   */
  async getCachedApiResponse(
    endpoint: string,
    params: string,
  ): Promise<any | null> {
    const key = `${CACHE_PREFIXES.API_RESPONSE}${endpoint}:${params}`;
    return this.get(key);
  }

  /**
   * Set user session data
   *
   * @param {string} sessionId - Session identifier
   * @param {any} sessionData - Session data to store
   * @returns {Promise<boolean>} True if successful
   */
  async setUserSession(sessionId: string, sessionData: any): Promise<boolean> {
    const key = `${CACHE_PREFIXES.USER_SESSION}${sessionId}`;
    return this.set(key, sessionData, CACHE_TTL.USER_SESSION);
  }

  /**
   * Get user session data
   *
   * @param {string} sessionId - Session identifier
   * @returns {Promise<any | null>} Session data or null
   */
  async getUserSession(sessionId: string): Promise<any | null> {
    const key = `${CACHE_PREFIXES.USER_SESSION}${sessionId}`;
    return this.get(key);
  }

  /**
   * Increment a counter with optional TTL
   *
   * @param {string} key - Counter key
   * @param {number} [ttl] - Time to live in seconds (set on first increment)
   * @returns {Promise<number>} New counter value
   *
   * @example
   * ```typescript
   * // Increment daily counter
   * const count = await cache.increment('requests:2024-01-01', 86400)
   * ```
   */
  async increment(key: string, ttl?: number): Promise<number> {
    try {
      if (!this.redis) return 0;
      const result = await this.redis.incr(key);
      if (ttl && result === 1) {
        await this.redis.expire(key, ttl);
      }
      return result;
    } catch (error) {
      console.error("Cache increment error:", error);
      return 0;
    }
  }

  /**
   * Get cache statistics
   *
   * @returns {Promise<any>} Cache statistics object with connection status
   *
   * @example
   * ```typescript
   * const stats = await cache.getCacheStats()
   * console.log(`Connected: ${stats.connected}`)
   * ```
   */
  async getCacheStats(): Promise<any> {
    try {
      if (!this.redis) {
        return {
          connected: false,
          error: "Redis client not configured",
          timestamp: new Date().toISOString(),
        };
      }
      // Basic connection test instead of info()
      await this.redis.ping();
      return {
        connected: true,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        connected: false,
        error: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      };
    }
  }

  /**
   * Cleanup expired cache entries
   * Note: Redis automatically cleans up expired keys, this is a placeholder for custom logic
   *
   * @returns {Promise<void>}
   */
  async cleanup(): Promise<void> {
    try {
      // Redis automatically cleans up expired keys, custom cleanup logic can be added here
      console.log("Cache cleanup completed");
    } catch (error) {
      console.error("Cache cleanup error:", error);
    }
  }
}

/**
 * Singleton cache manager instance
 * Use this instance for all caching operations
 *
 * @example
 * ```typescript
 * import { cacheManager } from '@/lib/redis-cache'
 *
 * await cacheManager.set('key', 'value', 3600)
 * const value = await cacheManager.get('key')
 * ```
 */
export const cacheManager = new CacheManager();

/**
 * Generate a cache key from prefix and parts
 *
 * @param {string} prefix - Key prefix
 * @param {...string} parts - Key parts to join
 * @returns {string} Generated cache key
 *
 * @example
 * ```typescript
 * const key = generateCacheKey('user', '123', 'profile')
 * // Returns: 'user123:profile'
 * ```
 */
export function generateCacheKey(prefix: string, ...parts: string[]): string {
  return `${prefix}${parts.join(":")}`;
}

/**
 * Generate a SHA-256 hash for request caching
 * Uses cryptographic hashing to avoid collision risks
 *
 * @param {any} data - Data to hash (will be JSON stringified)
 * @returns {string} 32-character hex hash
 *
 * @example
 * ```typescript
 * const hash = generateRequestHash({ theme: 'inspirational', mood: 'positive' })
 * // Returns: '3f2a1b4c...' (32 chars)
 * ```
 */
export function generateRequestHash(data: any): string {
  // Use dynamic import for Node.js crypto module
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const crypto = require("crypto");
  return crypto
    .createHash("sha256")
    .update(JSON.stringify(data))
    .digest("hex")
    .slice(0, 32); // 32-char hash for cache key
}
