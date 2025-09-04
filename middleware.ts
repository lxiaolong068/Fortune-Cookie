import { NextRequest, NextResponse } from 'next/server'
import { EdgeCacheManager } from './lib/edge-cache'

// 需要缓存的路径模式
const CACHEABLE_PATHS = [
  '/api/fortunes',
  '/api/analytics/dashboard',
  '/api/analytics/web-vitals',
]

// 静态资源路径
const STATIC_PATHS = [
  '/_next/static',
  '/favicon.ico',
  '/apple-touch-icon.png',
  '/favicon-32x32.png',
  '/favicon-16x16.png',
  '/site.webmanifest',
  '/robots.txt',
  '/sitemap.xml',
]

// 不需要处理的路径
const SKIP_PATHS = [
  '/_next',
  '/api/cache',
  '/__nextjs_original-stack-frame',
]

export function middleware(request: NextRequest) {
  const startTime = Date.now()
  const { pathname } = request.nextUrl

  // 跳过不需要处理的路径
  if (SKIP_PATHS.some(path => pathname.startsWith(path))) {
    return NextResponse.next()
  }

  // 处理静态资源
  if (STATIC_PATHS.some(path => pathname.startsWith(path))) {
    return handleStaticAssets(request, startTime)
  }

  // 处理API路由缓存
  if (pathname.startsWith('/api/')) {
    return handleApiCaching(request, startTime)
  }

  // 处理页面缓存
  return handlePageCaching(request, startTime)
}

// 添加Server-Timing头部的工具函数
function addServerTiming(response: NextResponse, startTime: number, operation: string): void {
  const duration = Date.now() - startTime
  const existingTiming = response.headers.get('Server-Timing')
  const newTiming = `${operation};dur=${duration}`

  if (existingTiming) {
    response.headers.set('Server-Timing', `${existingTiming}, ${newTiming}`)
  } else {
    response.headers.set('Server-Timing', newTiming)
  }
}

// 处理静态资源缓存
function handleStaticAssets(request: NextRequest, startTime: number): NextResponse {
  const response = NextResponse.next()

  // 设置长期缓存头部
  response.headers.set('Cache-Control', 'public, max-age=31536000, immutable')
  response.headers.set('CDN-Cache-Control', 'public, max-age=31536000')

  // 添加Server-Timing头部
  addServerTiming(response, startTime, 'static')

  return response
}

// 处理API缓存
function handleApiCaching(request: NextRequest, startTime: number): NextResponse {
  const { pathname, searchParams } = request.nextUrl

  // 检查是否是可缓存的API路径
  const isCacheable = CACHEABLE_PATHS.some(path => pathname.startsWith(path))

  if (!isCacheable) {
    const response = NextResponse.next()
    addServerTiming(response, startTime, 'api-uncacheable')
    return response
  }

  // 检查条件请求
  const ifNoneMatch = request.headers.get('If-None-Match')
  const ifModifiedSince = request.headers.get('If-Modified-Since')

  if (ifNoneMatch || ifModifiedSince) {
    // 生成简单的ETag（实际应用中应该基于内容）
    const etag = generateSimpleETag(pathname + searchParams.toString())

    if (ifNoneMatch === etag) {
      const response = new NextResponse(null, {
        status: 304,
        statusText: 'Not Modified',
        headers: {
          'ETag': etag,
          'Cache-Control': 'public, max-age=300',
        },
      })
      addServerTiming(response, startTime, 'api-304')
      return response
    }
  }

  const response = NextResponse.next()
  addServerTiming(response, startTime, 'api-cacheable')
  return response
}

// 处理页面缓存
function handlePageCaching(request: NextRequest, startTime: number): NextResponse {
  const response = NextResponse.next()
  const pathname = request.nextUrl.pathname

  // 为页面设置适当的缓存头部
  if (pathname === '/') {
    // 首页 - 短期缓存
    response.headers.set('Cache-Control', 'public, max-age=60, s-maxage=300')
    addServerTiming(response, startTime, 'page-home')
  } else if (pathname.startsWith('/messages')) {
    // 消息页面 - 中期缓存
    response.headers.set('Cache-Control', 'public, max-age=300, s-maxage=600')
    addServerTiming(response, startTime, 'page-messages')
  } else if (pathname.startsWith('/api/')) {
    // API路由
    addServerTiming(response, startTime, 'page-api')
  } else {
    // 其他页面 - 验证缓存
    response.headers.set('Cache-Control', 'public, max-age=0, must-revalidate')
    addServerTiming(response, startTime, 'page-other')
  }

  // 添加Vary头部
  response.headers.set('Vary', 'Accept-Encoding, User-Agent')

  return response
}

// 生成简单的ETag
function generateSimpleETag(content: string): string {
  // 简单的哈希函数（生产环境应使用更强的哈希）
  let hash = 0
  for (let i = 0; i < content.length; i++) {
    const char = content.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash // 转换为32位整数
  }
  return `"${Math.abs(hash).toString(36)}"`
}

// 配置中间件匹配路径
export const config = {
  matcher: [
    /*
     * 匹配所有请求路径，除了以下开头的路径:
     * - _next/static (静态文件)
     * - _next/image (图像优化文件)
     * - favicon.ico (favicon文件)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}
