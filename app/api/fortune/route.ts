import { NextRequest, NextResponse } from 'next/server'
import { openRouterClient, FortuneRequest } from '@/lib/openrouter'
import { captureApiError, captureUserAction, captureBusinessEvent } from '@/lib/error-monitoring'
import { rateLimiters, cacheManager, generateRequestHash } from '@/lib/redis-cache'
import { EdgeCacheManager, CachePerformanceMonitor } from '@/lib/edge-cache'

// 输入清理和验证工具
function sanitizeString(input: string, maxLength: number = 500): string {
  if (typeof input !== 'string') return ''

  // 移除潜在的恶意字符和脚本
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // 移除script标签
    .replace(/<[^>]*>/g, '') // 移除HTML标签
    .replace(/javascript:/gi, '') // 移除javascript协议
    .replace(/on\w+\s*=/gi, '') // 移除事件处理器
    .trim()
    .slice(0, maxLength) // 限制长度
}

function validateTheme(theme: string): boolean {
  const validThemes = ['funny', 'inspirational', 'love', 'success', 'wisdom', 'random']
  return validThemes.includes(theme)
}

function validateMood(mood: string): boolean {
  const validMoods = ['positive', 'neutral', 'motivational', 'humorous']
  return validMoods.includes(mood)
}

function validateLength(length: string): boolean {
  const validLengths = ['short', 'medium', 'long']
  return validLengths.includes(length)
}

// CORS配置
function getCorsOrigin(): string {
  if (process.env.NODE_ENV === 'production') {
    return process.env.NEXT_PUBLIC_APP_URL || 'https://your-domain.com'
  }
  return '*'
}

// 获取客户端标识符
function getClientIdentifier(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for')
  const ip = forwarded ? forwarded.split(',')[0] : request.ip || 'unknown'
  return ip
}

export async function POST(request: NextRequest) {
  const startTime = Date.now()

  try {
    // 分布式限流检查
    const clientId = getClientIdentifier(request)
    const rateLimitResult = await rateLimiters.fortune.limit(clientId)

    if (!rateLimitResult.success) {
      // 记录速率限制事件
      captureUserAction('rate_limit_exceeded', 'fortune_api', clientId, {
        limit: rateLimitResult.limit,
        remaining: rateLimitResult.remaining,
        reset: rateLimitResult.reset,
        endpoint: '/api/fortune'
      })

      CachePerformanceMonitor.recordError()

      return NextResponse.json(
        {
          error: 'Rate limit exceeded. Please try again later.',
          limit: rateLimitResult.limit,
          remaining: rateLimitResult.remaining,
          reset: rateLimitResult.reset
        },
        {
          status: 429,
          headers: {
            'X-RateLimit-Limit': rateLimitResult.limit.toString(),
            'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
            'X-RateLimit-Reset': rateLimitResult.reset.toString(),
          }
        }
      )
    }

    // Parse and validate request body
    let body: any
    try {
      body = await request.json()
    } catch (error) {
      return NextResponse.json(
        { error: 'Invalid JSON in request body' },
        { status: 400 }
      )
    }

    // 输入验证和清理
    const theme = body.theme ? sanitizeString(body.theme, 50) : 'random'
    const mood = body.mood ? sanitizeString(body.mood, 50) : 'positive'
    const length = body.length ? sanitizeString(body.length, 50) : 'medium'
    const customPrompt = body.customPrompt ? sanitizeString(body.customPrompt, 500) : undefined

    // 验证参数
    if (!validateTheme(theme)) {
      return NextResponse.json(
        { error: 'Invalid theme. Must be one of: funny, inspirational, love, success, wisdom, random' },
        { status: 400 }
      )
    }

    if (!validateMood(mood)) {
      return NextResponse.json(
        { error: 'Invalid mood. Must be one of: positive, neutral, motivational, humorous' },
        { status: 400 }
      )
    }

    if (!validateLength(length)) {
      return NextResponse.json(
        { error: 'Invalid length. Must be one of: short, medium, long' },
        { status: 400 }
      )
    }

    // 检查自定义提示的内容安全性
    if (customPrompt && customPrompt.length > 0) {
      const suspiciousPatterns = [
        /ignore\s+previous\s+instructions/i,
        /system\s+prompt/i,
        /you\s+are\s+now/i,
        /forget\s+everything/i,
        /new\s+instructions/i
      ]

      if (suspiciousPatterns.some(pattern => pattern.test(customPrompt))) {
        return NextResponse.json(
          { error: 'Custom prompt contains potentially harmful content' },
          { status: 400 }
        )
      }
    }

    const fortuneRequest: FortuneRequest = {
      theme,
      mood,
      length,
      customPrompt
    }

    // 生成请求哈希用于缓存
    const requestHash = generateRequestHash(fortuneRequest)

    // 检查缓存
    let fortune = await cacheManager.getCachedFortune(requestHash)

    if (fortune) {
      // 缓存命中
      CachePerformanceMonitor.recordHit()

      captureBusinessEvent('fortune_cache_hit', {
        theme: fortuneRequest.theme,
        requestHash,
        responseTime: Date.now() - startTime
      })
    } else {
      // 缓存未命中，生成新的幸运饼干
      CachePerformanceMonitor.recordMiss()

      fortune = await openRouterClient.generateFortune(fortuneRequest)

      // 缓存结果（如果不是自定义提示）
      if (!fortuneRequest.customPrompt) {
        await cacheManager.cacheFortune(requestHash, fortune)
      }
    }

    // 记录成功的业务事件
    const responseTime = Date.now() - startTime
    captureBusinessEvent('fortune_generated', {
      theme: fortuneRequest.theme,
      mood: fortuneRequest.mood,
      length: fortuneRequest.length,
      hasCustomPrompt: !!fortuneRequest.customPrompt,
      responseTime,
      source: fortune.source || 'unknown',
      cached: !!fortune.cached
    })

    // 记录用户操作
    captureUserAction('generate_fortune', 'fortune_generator', clientId, {
      theme: fortuneRequest.theme,
      responseTime,
      cached: !!fortune.cached
    })

    // 创建优化的响应
    const response = EdgeCacheManager.optimizeApiResponse(
      fortune,
      requestHash,
      fortuneRequest.customPrompt ? 0 : 300 // 自定义提示不缓存
    )

    // CORS头部
    response.headers.set('Access-Control-Allow-Origin', getCorsOrigin())
    response.headers.set('Access-Control-Allow-Methods', 'POST, OPTIONS')
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With')
    response.headers.set('Access-Control-Max-Age', '86400')

    // 额外的安全头部
    response.headers.set('X-Content-Type-Options', 'nosniff')
    response.headers.set('X-Frame-Options', 'DENY')
    response.headers.set('X-XSS-Protection', '1; mode=block')

    // 限流信息头部
    response.headers.set('X-RateLimit-Limit', rateLimitResult.limit.toString())
    response.headers.set('X-RateLimit-Remaining', rateLimitResult.remaining.toString())
    response.headers.set('X-RateLimit-Reset', rateLimitResult.reset.toString())

    return response

  } catch (error) {
    const responseTime = Date.now() - startTime

    // 记录缓存错误
    CachePerformanceMonitor.recordError()

    // 记录API错误
    captureApiError(
      error instanceof Error ? error : new Error(String(error)),
      '/api/fortune',
      'POST',
      500,
      responseTime
    )

    console.error('Fortune generation error:', error)

    const errorResponse = NextResponse.json(
      { error: 'Failed to generate fortune. Please try again.' },
      { status: 500 }
    )

    // 添加安全头部
    errorResponse.headers.set('X-Content-Type-Options', 'nosniff')
    errorResponse.headers.set('X-Frame-Options', 'DENY')
    errorResponse.headers.set('X-XSS-Protection', '1; mode=block')

    return errorResponse
  }
}

export async function GET(request: NextRequest) {
  // Health check endpoint with caching
  try {
    const clientId = getClientIdentifier(request)

    // 检查缓存的健康状态
    const cachedHealth = await cacheManager.getCachedApiResponse('health', 'check')

    if (cachedHealth) {
      CachePerformanceMonitor.recordHit()

      const response = EdgeCacheManager.optimizeApiResponse(cachedHealth, 'health-check', 60)
      response.headers.set('X-Cache', 'HIT')
      return response
    }

    CachePerformanceMonitor.recordMiss()

    // 检查Redis连接
    const redisHealthy = await cacheManager.isConnected()
    const isHealthy = await openRouterClient.healthCheck()

    const healthData = {
      status: 'ok',
      aiEnabled: isHealthy,
      cacheEnabled: redisHealthy,
      timestamp: new Date().toISOString(),
      cacheStats: CachePerformanceMonitor.getStats()
    }

    // 缓存健康检查结果
    await cacheManager.cacheApiResponse('health', 'check', healthData)

    const response = EdgeCacheManager.optimizeApiResponse(healthData, 'health-check', 60)
    response.headers.set('X-Cache', 'MISS')

    return response
  } catch (error) {
    CachePerformanceMonitor.recordError()

    captureApiError(
      error instanceof Error ? error : new Error(String(error)),
      '/api/fortune',
      'GET',
      503
    )

    return NextResponse.json(
      { status: 'error', message: 'Service unavailable' },
      { status: 503 }
    )
  }
}

export async function OPTIONS() {
  // Handle CORS preflight with enhanced security
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': getCorsOrigin(),
      'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
      'Access-Control-Max-Age': '86400',
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'X-XSS-Protection': '1; mode=block',
    },
  })
}
