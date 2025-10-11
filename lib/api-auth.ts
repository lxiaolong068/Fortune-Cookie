/**
 * API Authentication and Rate Limiting Module
 * 
 * Provides tiered rate limiting based on API key authentication:
 * - Public access: 10 requests/minute (no API key required)
 * - Authenticated access: 100 requests/minute (with valid API key)
 * 
 * @module lib/api-auth
 */

import { NextRequest } from 'next/server'

/**
 * Rate limit configuration for different access tiers
 */
export const RATE_LIMITS = {
  /** Public access rate limit (requests per minute) */
  PUBLIC: 10,
  /** Authenticated access rate limit (requests per minute) */
  AUTHENTICATED: 100,
  /** Time window for rate limiting (in seconds) */
  WINDOW: 60,
} as const

/**
 * Validate API key from request headers
 * 
 * Checks if the provided API key is valid by comparing against
 * environment variable API_KEYS (comma-separated list).
 * 
 * @param request - Next.js request object
 * @returns True if API key is valid or not provided (public access), false if invalid
 * 
 * @example
 * ```typescript
 * const isValid = validateApiKey(request)
 * if (!isValid) {
 *   return NextResponse.json({ error: 'Invalid API key' }, { status: 401 })
 * }
 * ```
 */
export function validateApiKey(request: NextRequest): boolean {
  const apiKey = request.headers.get('x-api-key')

  // Allow public access if no API key is provided
  if (!apiKey) {
    return true
  }

  // Validate API key against environment variable
  const validKeys = process.env.API_KEYS?.split(',').map(key => key.trim()) || []
  
  // If no valid keys are configured, reject all API key attempts
  if (validKeys.length === 0) {
    return false
  }

  return validKeys.includes(apiKey)
}

/**
 * Get enhanced rate limit based on authentication status
 * 
 * Returns the appropriate rate limit for the request:
 * - 100 requests/minute for authenticated users (valid API key)
 * - 10 requests/minute for public users (no API key or invalid key)
 * 
 * @param request - Next.js request object
 * @returns Rate limit (requests per minute)
 * 
 * @example
 * ```typescript
 * const limit = getEnhancedRateLimit(request)
 * const rateLimitResult = await rateLimiters.fortune.limit(clientId, limit)
 * ```
 */
export function getEnhancedRateLimit(request: NextRequest): number {
  const apiKey = request.headers.get('x-api-key')

  // If API key is provided and valid, grant enhanced rate limit
  if (apiKey && validateApiKey(request)) {
    return RATE_LIMITS.AUTHENTICATED
  }

  // Default to public rate limit
  return RATE_LIMITS.PUBLIC
}

/**
 * Check if request has valid authentication
 * 
 * @param request - Next.js request object
 * @returns True if request has valid API key, false otherwise
 * 
 * @example
 * ```typescript
 * if (isAuthenticated(request)) {
 *   console.log('User has enhanced access')
 * }
 * ```
 */
export function isAuthenticated(request: NextRequest): boolean {
  const apiKey = request.headers.get('x-api-key')
  return !!apiKey && validateApiKey(request)
}

/**
 * Get authentication tier for logging and analytics
 * 
 * @param request - Next.js request object
 * @returns Authentication tier: 'authenticated' or 'public'
 * 
 * @example
 * ```typescript
 * const tier = getAuthTier(request)
 * captureUserAction('api_request', 'fortune', clientId, { tier })
 * ```
 */
export function getAuthTier(request: NextRequest): 'authenticated' | 'public' {
  return isAuthenticated(request) ? 'authenticated' : 'public'
}

/**
 * Extract API key from request (for logging purposes only)
 * 
 * Returns a masked version of the API key for security.
 * 
 * @param request - Next.js request object
 * @returns Masked API key or 'none' if not provided
 * 
 * @example
 * ```typescript
 * const maskedKey = getMaskedApiKey(request)
 * console.log(`Request from: ${maskedKey}`) // "key_***abc123"
 * ```
 */
export function getMaskedApiKey(request: NextRequest): string {
  const apiKey = request.headers.get('x-api-key')
  
  if (!apiKey) {
    return 'none'
  }

  // Mask the middle part of the API key for security
  if (apiKey.length <= 8) {
    return '***'
  }

  const prefix = apiKey.slice(0, 4)
  const suffix = apiKey.slice(-4)
  return `${prefix}***${suffix}`
}

/**
 * Rate limit response headers
 * 
 * Generates standard rate limit headers for API responses.
 * 
 * @param limit - Rate limit (requests per window)
 * @param remaining - Remaining requests in current window
 * @param reset - Unix timestamp when the rate limit resets
 * @returns Headers object
 * 
 * @example
 * ```typescript
 * const headers = getRateLimitHeaders(100, 95, Date.now() + 60000)
 * return NextResponse.json(data, { headers })
 * ```
 */
export function getRateLimitHeaders(
  limit: number,
  remaining: number,
  reset: number
): Record<string, string> {
  return {
    'X-RateLimit-Limit': limit.toString(),
    'X-RateLimit-Remaining': remaining.toString(),
    'X-RateLimit-Reset': reset.toString(),
    'X-RateLimit-Window': `${RATE_LIMITS.WINDOW}s`,
  }
}

/**
 * Authentication error response
 * 
 * Creates a standardized error response for authentication failures.
 * 
 * @param reason - Reason for authentication failure
 * @returns Error response object
 * 
 * @example
 * ```typescript
 * if (!validateApiKey(request)) {
 *   return NextResponse.json(
 *     getAuthErrorResponse('Invalid API key'),
 *     { status: 401 }
 *   )
 * }
 * ```
 */
export function getAuthErrorResponse(reason: string) {
  return {
    success: false,
    error: 'Authentication failed',
    message: reason,
    timestamp: new Date().toISOString(),
  }
}

/**
 * Rate limit exceeded response
 * 
 * Creates a standardized error response for rate limit violations.
 * 
 * @param limit - Rate limit that was exceeded
 * @param remaining - Remaining requests (should be 0)
 * @param reset - Unix timestamp when the rate limit resets
 * @param tier - Authentication tier ('authenticated' or 'public')
 * @returns Error response object
 * 
 * @example
 * ```typescript
 * if (!rateLimitResult.success) {
 *   return NextResponse.json(
 *     getRateLimitErrorResponse(10, 0, Date.now() + 60000, 'public'),
 *     { status: 429 }
 *   )
 * }
 * ```
 */
export function getRateLimitErrorResponse(
  limit: number,
  remaining: number,
  reset: number,
  tier: 'authenticated' | 'public'
) {
  return {
    success: false,
    error: 'Rate limit exceeded',
    message: `You have exceeded the ${tier} rate limit of ${limit} requests per minute. Please try again later.`,
    limit,
    remaining,
    reset,
    tier,
    timestamp: new Date().toISOString(),
    suggestion: tier === 'public' 
      ? 'Consider using an API key for higher rate limits (100 requests/minute).'
      : 'Please wait before making more requests.',
  }
}

