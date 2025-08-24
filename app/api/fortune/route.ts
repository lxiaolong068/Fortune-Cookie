import { NextRequest, NextResponse } from 'next/server'
import { openRouterClient, FortuneRequest } from '@/lib/openrouter'
import { captureApiError, captureUserAction, captureBusinessEvent } from '@/lib/error-monitoring'

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

// Rate limiting (simple in-memory store for demo)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>()

function getRateLimitKey(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for')
  const ip = forwarded ? forwarded.split(',')[0] : request.ip || 'unknown'
  return ip
}

function checkRateLimit(key: string): { allowed: boolean; resetTime?: number } {
  const now = Date.now()
  const windowMs = 15 * 60 * 1000 // 15 minutes
  const maxRequests = 50 // 50 requests per 15 minutes
  
  const record = rateLimitMap.get(key)
  
  if (!record || now > record.resetTime) {
    rateLimitMap.set(key, { count: 1, resetTime: now + windowMs })
    return { allowed: true }
  }
  
  if (record.count >= maxRequests) {
    return { allowed: false, resetTime: record.resetTime }
  }
  
  record.count++
  return { allowed: true }
}

export async function POST(request: NextRequest) {
  const startTime = Date.now()

  try {
    // Rate limiting
    const rateLimitKey = getRateLimitKey(request)
    const rateLimit = checkRateLimit(rateLimitKey)

    if (!rateLimit.allowed) {
      // 记录速率限制事件
      captureUserAction('rate_limit_exceeded', 'fortune_api', rateLimitKey, {
        resetTime: rateLimit.resetTime,
        endpoint: '/api/fortune'
      })

      return NextResponse.json(
        {
          error: 'Rate limit exceeded. Please try again later.',
          resetTime: rateLimit.resetTime
        },
        { status: 429 }
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

    // Generate fortune
    const fortune = await openRouterClient.generateFortune(fortuneRequest)

    // 记录成功的业务事件
    const responseTime = Date.now() - startTime
    captureBusinessEvent('fortune_generated', {
      theme: fortuneRequest.theme,
      mood: fortuneRequest.mood,
      length: fortuneRequest.length,
      hasCustomPrompt: !!fortuneRequest.customPrompt,
      responseTime,
      source: fortune.source || 'unknown'
    })

    // 记录用户操作
    captureUserAction('generate_fortune', 'fortune_generator', rateLimitKey, {
      theme: fortuneRequest.theme,
      responseTime
    })

    // 创建响应并添加安全头部
    const response = NextResponse.json(fortune)

    // CORS头部
    response.headers.set('Access-Control-Allow-Origin', getCorsOrigin())
    response.headers.set('Access-Control-Allow-Methods', 'POST, OPTIONS')
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With')
    response.headers.set('Access-Control-Max-Age', '86400')

    // 额外的安全头部
    response.headers.set('X-Content-Type-Options', 'nosniff')
    response.headers.set('X-Frame-Options', 'DENY')
    response.headers.set('X-XSS-Protection', '1; mode=block')

    return response

  } catch (error) {
    const responseTime = Date.now() - startTime

    // 记录API错误
    captureApiError(
      error instanceof Error ? error : new Error(String(error)),
      '/api/fortune',
      'POST',
      500,
      responseTime
    )

    console.error('Fortune generation error:', error)
    return NextResponse.json(
      { error: 'Failed to generate fortune. Please try again.' },
      { status: 500 }
    )
  }
}

export async function GET() {
  // Health check endpoint
  try {
    const isHealthy = await openRouterClient.healthCheck()
    return NextResponse.json({ 
      status: 'ok', 
      aiEnabled: isHealthy,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
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
