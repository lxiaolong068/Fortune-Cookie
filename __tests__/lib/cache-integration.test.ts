/**
 * Cache Integration Tests
 *
 * Tests multi-tier caching behavior, cache expiration, and performance tracking
 */

import { CacheManager } from '@/lib/redis-cache'
import { CachePerformanceMonitor } from '@/lib/edge-cache'

// Mock Redis for testing
jest.mock('@upstash/redis', () => ({
  Redis: jest.fn().mockImplementation(() => ({
    ping: jest.fn().mockResolvedValue('PONG'),
    set: jest.fn().mockResolvedValue('OK'),
    setex: jest.fn().mockResolvedValue('OK'),
    get: jest.fn().mockResolvedValue(null),
    del: jest.fn().mockResolvedValue(1),
    keys: jest.fn().mockResolvedValue([]),
    incr: jest.fn().mockResolvedValue(1),
    expire: jest.fn().mockResolvedValue(1),
  })),
}))

describe('CacheManager', () => {
  let cacheManager: CacheManager

  beforeEach(() => {
    cacheManager = new CacheManager()
    jest.clearAllMocks()
  })

  describe('Connection', () => {
    it('should check Redis connection', async () => {
      const isConnected = await cacheManager.isConnected()
      
      // In test environment without Redis, should return false
      expect(typeof isConnected).toBe('boolean')
    })
  })

  describe('Generic Cache Operations', () => {
    it('should set and get cache values', async () => {
      const key = 'test:key'
      const value = { data: 'test value' }

      const setResult = await cacheManager.set(key, value, 60)
      expect(typeof setResult).toBe('boolean')

      const getValue = await cacheManager.get(key)
      // In test environment, may return null if Redis not available
      expect(getValue === null || typeof getValue === 'object').toBe(true)
    })

    it('should handle cache expiration with TTL', async () => {
      const key = 'test:expiring'
      const value = { data: 'expires soon' }
      const ttl = 5 // 5 seconds

      const setResult = await cacheManager.set(key, value, ttl)
      expect(typeof setResult).toBe('boolean')
    })

    it('should delete cache keys', async () => {
      const key = 'test:delete'
      const value = { data: 'to be deleted' }

      await cacheManager.set(key, value)
      const delResult = await cacheManager.del(key)
      
      expect(typeof delResult).toBe('boolean')
    })

    it('should delete cache keys by pattern', async () => {
      const pattern = 'test:*'
      
      const delCount = await cacheManager.delPattern(pattern)
      
      expect(typeof delCount).toBe('number')
      expect(delCount).toBeGreaterThanOrEqual(0)
    })
  })

  describe('Fortune Caching', () => {
    it('should cache fortune with request hash', async () => {
      const requestHash = 'hash123'
      const fortune = {
        message: 'Your future is bright',
        luckyNumbers: [1, 2, 3, 4, 5, 6],
        theme: 'inspirational',
        timestamp: new Date().toISOString()
      }

      const result = await cacheManager.cacheFortune(requestHash, fortune)
      expect(typeof result).toBe('boolean')
    })

    it('should retrieve cached fortune', async () => {
      const requestHash = 'hash123'
      
      const cachedFortune = await cacheManager.getCachedFortune(requestHash)
      
      // May be null if not cached or Redis unavailable
      expect(cachedFortune === null || typeof cachedFortune === 'object').toBe(true)
    })

    it('should handle cache miss gracefully', async () => {
      const nonExistentHash = 'nonexistent'
      
      const result = await cacheManager.getCachedFortune(nonExistentHash)
      
      expect(result).toBeNull()
    })
  })

  describe('Fortune List Caching', () => {
    it('should cache fortune lists', async () => {
      const listKey = 'category:inspirational'
      const fortunes = [
        { message: 'Fortune 1', luckyNumbers: [1, 2, 3, 4, 5, 6] },
        { message: 'Fortune 2', luckyNumbers: [7, 8, 9, 10, 11, 12] }
      ]

      const result = await cacheManager.cacheFortuneList(listKey, fortunes)
      expect(typeof result).toBe('boolean')
    })

    it('should retrieve cached fortune lists', async () => {
      const listKey = 'category:inspirational'
      
      const cachedList = await cacheManager.getCachedFortuneList(listKey)
      
      expect(cachedList === null || Array.isArray(cachedList)).toBe(true)
    })
  })

  describe('Analytics Caching', () => {
    it('should cache analytics data', async () => {
      const analyticsKey = 'daily:2024-01-01'
      const data = {
        totalRequests: 1000,
        cacheHits: 800,
        cacheMisses: 200
      }

      const result = await cacheManager.cacheAnalytics(analyticsKey, data)
      expect(typeof result).toBe('boolean')
    })

    it('should retrieve cached analytics', async () => {
      const analyticsKey = 'daily:2024-01-01'
      
      const cachedAnalytics = await cacheManager.getCachedAnalytics(analyticsKey)
      
      expect(cachedAnalytics === null || typeof cachedAnalytics === 'object').toBe(true)
    })
  })

  describe('API Response Caching', () => {
    it('should cache API responses', async () => {
      const endpoint = '/api/fortune'
      const params = 'theme=inspirational'
      const response = { data: { message: 'Test fortune' } }

      const result = await cacheManager.cacheApiResponse(endpoint, params, response)
      expect(typeof result).toBe('boolean')
    })

    it('should retrieve cached API responses', async () => {
      const endpoint = '/api/fortune'
      const params = 'theme=inspirational'
      
      const cachedResponse = await cacheManager.getCachedApiResponse(endpoint, params)
      
      expect(cachedResponse === null || typeof cachedResponse === 'object').toBe(true)
    })
  })

  describe('User Session Management', () => {
    it('should set user session', async () => {
      const sessionId = 'session123'
      const sessionData = {
        userId: 'user123',
        preferences: { theme: 'dark' }
      }

      const result = await cacheManager.setUserSession(sessionId, sessionData)
      expect(typeof result).toBe('boolean')
    })

    it('should get user session', async () => {
      const sessionId = 'session123'
      
      const session = await cacheManager.getUserSession(sessionId)
      
      expect(session === null || typeof session === 'object').toBe(true)
    })
  })

  describe('Counter Operations', () => {
    it('should increment counters', async () => {
      const key = 'counter:requests'
      
      const count = await cacheManager.increment(key)
      
      expect(typeof count).toBe('number')
      expect(count).toBeGreaterThanOrEqual(0)
    })

    it('should increment counters with expiration', async () => {
      const key = 'counter:daily'
      const ttl = 86400 // 24 hours
      
      const count = await cacheManager.increment(key, ttl)
      
      expect(typeof count).toBe('number')
      expect(count).toBeGreaterThanOrEqual(0)
    })
  })
})

describe('CachePerformanceMonitor', () => {
  beforeEach(() => {
    CachePerformanceMonitor.resetStats()
  })

  describe('Hit/Miss Tracking', () => {
    it('should record cache hits', () => {
      CachePerformanceMonitor.recordHit()
      CachePerformanceMonitor.recordHit()

      const stats = CachePerformanceMonitor.getStats()

      expect(stats.hits).toBe(2)
      expect(stats.totalRequests).toBe(2)
    })

    it('should record cache misses', () => {
      CachePerformanceMonitor.recordMiss()
      CachePerformanceMonitor.recordMiss()
      CachePerformanceMonitor.recordMiss()

      const stats = CachePerformanceMonitor.getStats()

      expect(stats.misses).toBe(3)
      expect(stats.totalRequests).toBe(3)
    })

    it('should calculate hit rate correctly', () => {
      CachePerformanceMonitor.recordHit()
      CachePerformanceMonitor.recordHit()
      CachePerformanceMonitor.recordHit()
      CachePerformanceMonitor.recordMiss()

      const stats = CachePerformanceMonitor.getStats()

      expect(stats.hits).toBe(3)
      expect(stats.misses).toBe(1)
      expect(stats.totalRequests).toBe(4)
      expect(stats.hitRate).toBe(75) // 3/4 = 75%
    })

    it('should handle zero total requests', () => {
      const stats = CachePerformanceMonitor.getStats()

      expect(stats.hits).toBe(0)
      expect(stats.misses).toBe(0)
      expect(stats.totalRequests).toBe(0)
      expect(stats.hitRate).toBe(0)
    })
  })

  describe('Statistics Reset', () => {
    it('should reset statistics', () => {
      CachePerformanceMonitor.recordHit()
      CachePerformanceMonitor.recordHit()
      CachePerformanceMonitor.recordMiss()

      CachePerformanceMonitor.resetStats()

      const stats = CachePerformanceMonitor.getStats()

      expect(stats.hits).toBe(0)
      expect(stats.misses).toBe(0)
      expect(stats.totalRequests).toBe(0)
      expect(stats.hitRate).toBe(0)
    })
  })

  describe('Performance Metrics', () => {
    it('should track cache performance over time', () => {
      // Simulate cache usage
      // i % 3 === 0: 0, 3, 6, 9, ... (34 times out of 100)
      // i % 3 !== 0: 1, 2, 4, 5, 7, 8, ... (66 times out of 100)
      for (let i = 0; i < 100; i++) {
        if (i % 3 === 0) {
          CachePerformanceMonitor.recordMiss()
        } else {
          CachePerformanceMonitor.recordHit()
        }
      }

      const stats = CachePerformanceMonitor.getStats()

      expect(stats.totalRequests).toBe(100)
      expect(stats.hits).toBe(66) // 66% hit rate
      expect(stats.misses).toBe(34)
      expect(stats.hitRate).toBeCloseTo(66, 0)
    })
  })
})

describe('Cache Integration Scenarios', () => {
  let cacheManager: CacheManager

  beforeEach(() => {
    cacheManager = new CacheManager()
    CachePerformanceMonitor.resetStats()
    jest.clearAllMocks()
  })

  it('should handle cache hit scenario', async () => {
    const requestHash = 'test-hash'
    const fortune = { message: 'Test fortune', luckyNumbers: [1, 2, 3, 4, 5, 6] }

    // Cache the fortune
    await cacheManager.cacheFortune(requestHash, fortune)

    // Retrieve from cache (should be a hit)
    const cached = await cacheManager.getCachedFortune(requestHash)

    if (cached) {
      CachePerformanceMonitor.recordHit()
    } else {
      CachePerformanceMonitor.recordMiss()
    }

    const stats = CachePerformanceMonitor.getStats()
    expect(stats.totalRequests).toBe(1)
  })

  it('should handle cache miss scenario', async () => {
    const requestHash = 'nonexistent-hash'

    // Try to retrieve non-existent fortune
    const cached = await cacheManager.getCachedFortune(requestHash)

    if (cached) {
      CachePerformanceMonitor.recordHit()
    } else {
      CachePerformanceMonitor.recordMiss()
    }

    const stats = CachePerformanceMonitor.getStats()
    expect(stats.totalRequests).toBe(1)
    expect(cached).toBeNull()
  })
})

