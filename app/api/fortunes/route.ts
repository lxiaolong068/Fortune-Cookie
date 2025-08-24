import { NextRequest, NextResponse } from 'next/server'
import {
  fortuneDatabase,
  searchFortunes,
  getFortunesByCategory,
  getPopularFortunes,
  getRandomFortune,
  getFortuneById,
  getDatabaseStats
} from '@/lib/fortune-database'
import { rateLimiters, cacheManager, generateCacheKey } from '@/lib/redis-cache'
import { EdgeCacheManager, CachePerformanceMonitor } from '@/lib/edge-cache'
import { captureApiError, captureUserAction } from '@/lib/error-monitoring'

// 安全工具函数
function sanitizeString(input: string, maxLength: number = 100): string {
  if (typeof input !== 'string') return ''

  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<[^>]*>/g, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '')
    .trim()
    .slice(0, maxLength)
}

function validatePositiveInteger(value: string, defaultValue: number, max: number = 1000): number {
  const parsed = parseInt(value)
  if (isNaN(parsed) || parsed < 1 || parsed > max) {
    return defaultValue
  }
  return parsed
}

function getCorsOrigin(): string {
  if (process.env.NODE_ENV === 'production') {
    return process.env.NEXT_PUBLIC_APP_URL || 'https://your-domain.com'
  }
  return '*'
}

function addSecurityHeaders(response: NextResponse): NextResponse {
  response.headers.set('Access-Control-Allow-Origin', getCorsOrigin())
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-XSS-Protection', '1; mode=block')
  return response
}

function getClientIdentifier(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for')
  const ip = forwarded ? forwarded.split(',')[0] : request.ip || 'unknown'
  return ip
}

export async function GET(request: NextRequest) {
  const startTime = Date.now()

  try {
    // 分布式限流检查
    const clientId = getClientIdentifier(request)
    const rateLimitResult = await rateLimiters.search.limit(clientId)

    if (!rateLimitResult.success) {
      captureUserAction('rate_limit_exceeded', 'fortunes_api', clientId, {
        endpoint: '/api/fortunes'
      })

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

    const { searchParams } = new URL(request.url)
    const action = searchParams.get('action') || 'list'
    
    switch (action) {
      case 'search': {
        const query = sanitizeString(searchParams.get('q') || '', 200)
        const category = searchParams.get('category') ? sanitizeString(searchParams.get('category')!, 50) : undefined
        const limit = validatePositiveInteger(searchParams.get('limit') || '50', 50, 100)

        // 生成缓存键
        const cacheKey = generateCacheKey('search', query, category || 'all', limit.toString())

        // 检查缓存
        let cachedResults = await cacheManager.getCachedFortuneList(cacheKey)

        if (cachedResults) {
          CachePerformanceMonitor.recordHit()

          const responseData = EdgeCacheManager.optimizeApiResponse(cachedResults, cacheKey, 300)
          const response = NextResponse.json(cachedResults, {
            headers: {
              'X-Cache': 'HIT',
              ...Object.fromEntries(responseData.headers.entries())
            }
          })
          return addSecurityHeaders(response)
        }

        CachePerformanceMonitor.recordMiss()

        const results = searchFortunes(query, category).slice(0, limit)

        const responseData = {
          results,
          total: results.length,
          query,
          category,
          cached: false
        }

        // 缓存结果
        await cacheManager.cacheFortuneList(cacheKey, results)

        const optimizedResponse = EdgeCacheManager.optimizeApiResponse(responseData, cacheKey, 300)
        const response = NextResponse.json(responseData, {
          headers: {
            'X-Cache': 'MISS',
            ...Object.fromEntries(optimizedResponse.headers.entries())
          }
        })
        return addSecurityHeaders(response)
      }
      
      case 'category': {
        const category = searchParams.get('category')
        if (!category) {
          const response = NextResponse.json(
            { error: 'Category parameter is required' },
            { status: 400 }
          )
          return addSecurityHeaders(response)
        }

        const sanitizedCategory = sanitizeString(category, 50)
        const results = getFortunesByCategory(sanitizedCategory)
        const response = NextResponse.json({
          results,
          total: results.length,
          category: sanitizedCategory
        })

        return addSecurityHeaders(response)
      }

      case 'popular': {
        const limit = validatePositiveInteger(searchParams.get('limit') || '10', 10, 50)

        const cacheKey = generateCacheKey('popular', limit.toString())
        let cachedResults = await cacheManager.getCachedFortuneList(cacheKey)

        if (cachedResults) {
          CachePerformanceMonitor.recordHit()
          const responseData = EdgeCacheManager.optimizeApiResponse(cachedResults, cacheKey, 600)
          const response = NextResponse.json(cachedResults, {
            headers: {
              'X-Cache': 'HIT',
              ...Object.fromEntries(responseData.headers.entries())
            }
          })
          return addSecurityHeaders(response)
        }

        CachePerformanceMonitor.recordMiss()

        const results = getPopularFortunes(limit)
        const responseData = {
          results,
          total: results.length,
          cached: false
        }

        await cacheManager.cacheFortuneList(cacheKey, results)

        const optimizedResponse = EdgeCacheManager.optimizeApiResponse(responseData, cacheKey, 600)
        const response = NextResponse.json(responseData, {
          headers: {
            'X-Cache': 'MISS',
            ...Object.fromEntries(optimizedResponse.headers.entries())
          }
        })
        return addSecurityHeaders(response)
      }
      
      case 'random': {
        const category = searchParams.get('category') ? sanitizeString(searchParams.get('category')!, 50) : undefined
        const count = validatePositiveInteger(searchParams.get('count') || '1', 1, 10)

        const results = Array.from({ length: count }, () =>
          getRandomFortune(category)
        )

        const response = NextResponse.json({
          results: count === 1 ? results[0] : results,
          total: count
        })

        return addSecurityHeaders(response)
      }

      case 'stats': {
        const stats = getDatabaseStats()
        const response = NextResponse.json(stats)
        return addSecurityHeaders(response)
      }

      case 'get': {
        const id = searchParams.get('id')
        if (!id) {
          const response = NextResponse.json(
            { error: 'ID parameter is required' },
            { status: 400 }
          )
          return addSecurityHeaders(response)
        }

        const sanitizedId = sanitizeString(id, 50)
        const fortune = getFortuneById(sanitizedId)
        if (!fortune) {
          const response = NextResponse.json(
            { error: 'Fortune not found' },
            { status: 404 }
          )
          return addSecurityHeaders(response)
        }

        const response = NextResponse.json(fortune)
        return addSecurityHeaders(response)
      }
      
      case 'list':
      default: {
        const page = validatePositiveInteger(searchParams.get('page') || '1', 1, 1000)
        const limit = validatePositiveInteger(searchParams.get('limit') || '20', 20, 100)
        const category = searchParams.get('category') ? sanitizeString(searchParams.get('category')!, 50) : undefined
        const sortBy = sanitizeString(searchParams.get('sort') || 'popularity', 20)

        // 验证排序参数
        const validSortOptions = ['popularity', 'recent', 'alphabetical']
        const finalSortBy = validSortOptions.includes(sortBy) ? sortBy : 'popularity'

        let results = category
          ? getFortunesByCategory(category)
          : [...fortuneDatabase]

        // Sort results
        switch (finalSortBy) {
          case 'popularity':
            results.sort((a, b) => b.popularity - a.popularity)
            break
          case 'recent':
            results.sort((a, b) => new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime())
            break
          case 'alphabetical':
            results.sort((a, b) => a.message.localeCompare(b.message))
            break
        }

        // Pagination
        const startIndex = (page - 1) * limit
        const endIndex = startIndex + limit
        const paginatedResults = results.slice(startIndex, endIndex)

        const response = NextResponse.json({
          results: paginatedResults,
          pagination: {
            page,
            limit,
            total: results.length,
            totalPages: Math.ceil(results.length / limit),
            hasNext: endIndex < results.length,
            hasPrev: page > 1
          },
          category,
          sortBy: finalSortBy
        })

        return addSecurityHeaders(response)
      }
    }

  } catch (error) {
    console.error('Fortune API error:', error)
    const response = NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
    return addSecurityHeaders(response)
  }
}

// Handle CORS preflight with enhanced security
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': getCorsOrigin(),
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
      'Access-Control-Max-Age': '86400',
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'X-XSS-Protection': '1; mode=block',
    },
  })
}
