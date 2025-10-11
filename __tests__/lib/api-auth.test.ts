/**
 * Unit tests for API Authentication Module
 * Tests API key validation and tiered rate limiting
 */

import {
  validateApiKey,
  getEnhancedRateLimit,
  isAuthenticated,
  getAuthTier,
  getMaskedApiKey,
  getRateLimitHeaders,
  getRateLimitErrorResponse,
  RATE_LIMITS,
} from '@/lib/api-auth'

// Mock NextRequest
const createMockRequest = (headers: Record<string, string> = {}) => {
  return {
    headers: {
      get: (key: string) => headers[key] || null,
    },
  } as any
}

describe('API Authentication', () => {
  // Store original env
  const originalEnv = process.env.API_KEYS

  afterEach(() => {
    // Restore original env
    process.env.API_KEYS = originalEnv
  })

  describe('validateApiKey', () => {
    it('should allow public access when no API key is provided', () => {
      const request = createMockRequest()
      expect(validateApiKey(request)).toBe(true)
    })

    it('should validate correct API key', () => {
      process.env.API_KEYS = 'test_key_123,test_key_456'
      const request = createMockRequest({ 'x-api-key': 'test_key_123' })
      expect(validateApiKey(request)).toBe(true)
    })

    it('should reject invalid API key', () => {
      process.env.API_KEYS = 'test_key_123,test_key_456'
      const request = createMockRequest({ 'x-api-key': 'invalid_key' })
      expect(validateApiKey(request)).toBe(false)
    })

    it('should reject API key when no valid keys are configured', () => {
      process.env.API_KEYS = ''
      const request = createMockRequest({ 'x-api-key': 'any_key' })
      expect(validateApiKey(request)).toBe(false)
    })

    it('should handle multiple valid API keys', () => {
      process.env.API_KEYS = 'key1,key2,key3'
      const request1 = createMockRequest({ 'x-api-key': 'key1' })
      const request2 = createMockRequest({ 'x-api-key': 'key2' })
      const request3 = createMockRequest({ 'x-api-key': 'key3' })

      expect(validateApiKey(request1)).toBe(true)
      expect(validateApiKey(request2)).toBe(true)
      expect(validateApiKey(request3)).toBe(true)
    })

    it('should trim whitespace from API keys', () => {
      process.env.API_KEYS = ' key1 , key2 , key3 '
      const request = createMockRequest({ 'x-api-key': 'key1' })
      expect(validateApiKey(request)).toBe(true)
    })
  })

  describe('getEnhancedRateLimit', () => {
    it('should return public rate limit when no API key is provided', () => {
      const request = createMockRequest()
      expect(getEnhancedRateLimit(request)).toBe(RATE_LIMITS.PUBLIC)
    })

    it('should return authenticated rate limit for valid API key', () => {
      process.env.API_KEYS = 'test_key_123'
      const request = createMockRequest({ 'x-api-key': 'test_key_123' })
      expect(getEnhancedRateLimit(request)).toBe(RATE_LIMITS.AUTHENTICATED)
    })

    it('should return public rate limit for invalid API key', () => {
      process.env.API_KEYS = 'test_key_123'
      const request = createMockRequest({ 'x-api-key': 'invalid_key' })
      expect(getEnhancedRateLimit(request)).toBe(RATE_LIMITS.PUBLIC)
    })
  })

  describe('isAuthenticated', () => {
    it('should return false when no API key is provided', () => {
      const request = createMockRequest()
      expect(isAuthenticated(request)).toBe(false)
    })

    it('should return true for valid API key', () => {
      process.env.API_KEYS = 'test_key_123'
      const request = createMockRequest({ 'x-api-key': 'test_key_123' })
      expect(isAuthenticated(request)).toBe(true)
    })

    it('should return false for invalid API key', () => {
      process.env.API_KEYS = 'test_key_123'
      const request = createMockRequest({ 'x-api-key': 'invalid_key' })
      expect(isAuthenticated(request)).toBe(false)
    })
  })

  describe('getAuthTier', () => {
    it('should return "public" when no API key is provided', () => {
      const request = createMockRequest()
      expect(getAuthTier(request)).toBe('public')
    })

    it('should return "authenticated" for valid API key', () => {
      process.env.API_KEYS = 'test_key_123'
      const request = createMockRequest({ 'x-api-key': 'test_key_123' })
      expect(getAuthTier(request)).toBe('authenticated')
    })

    it('should return "public" for invalid API key', () => {
      process.env.API_KEYS = 'test_key_123'
      const request = createMockRequest({ 'x-api-key': 'invalid_key' })
      expect(getAuthTier(request)).toBe('public')
    })
  })

  describe('getMaskedApiKey', () => {
    it('should return "none" when no API key is provided', () => {
      const request = createMockRequest()
      expect(getMaskedApiKey(request)).toBe('none')
    })

    it('should mask API key correctly', () => {
      const request = createMockRequest({ 'x-api-key': 'test_key_123456789' })
      const masked = getMaskedApiKey(request)
      expect(masked).toBe('test***6789')
      expect(masked).not.toContain('key_123456')
    })

    it('should handle short API keys', () => {
      const request = createMockRequest({ 'x-api-key': 'short' })
      expect(getMaskedApiKey(request)).toBe('***')
    })
  })

  describe('getRateLimitHeaders', () => {
    it('should generate correct rate limit headers', () => {
      const headers = getRateLimitHeaders(100, 95, 1234567890)

      expect(headers['X-RateLimit-Limit']).toBe('100')
      expect(headers['X-RateLimit-Remaining']).toBe('95')
      expect(headers['X-RateLimit-Reset']).toBe('1234567890')
      expect(headers['X-RateLimit-Window']).toBe('60s')
    })
  })

  describe('getRateLimitErrorResponse', () => {
    it('should generate error response for public tier', () => {
      const response = getRateLimitErrorResponse(10, 0, 1234567890, 'public')

      expect(response.success).toBe(false)
      expect(response.error).toBe('Rate limit exceeded')
      expect(response.limit).toBe(10)
      expect(response.remaining).toBe(0)
      expect(response.reset).toBe(1234567890)
      expect(response.tier).toBe('public')
      expect(response.suggestion).toContain('API key')
    })

    it('should generate error response for authenticated tier', () => {
      const response = getRateLimitErrorResponse(100, 0, 1234567890, 'authenticated')

      expect(response.success).toBe(false)
      expect(response.error).toBe('Rate limit exceeded')
      expect(response.limit).toBe(100)
      expect(response.tier).toBe('authenticated')
      expect(response.suggestion).toContain('wait')
    })
  })

  describe('RATE_LIMITS constants', () => {
    it('should have correct rate limit values', () => {
      expect(RATE_LIMITS.PUBLIC).toBe(10)
      expect(RATE_LIMITS.AUTHENTICATED).toBe(100)
      expect(RATE_LIMITS.WINDOW).toBe(60)
    })
  })
})

