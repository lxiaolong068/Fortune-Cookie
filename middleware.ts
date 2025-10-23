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

// 生成 CSP Nonce
function generateNonce(): string {
  const array = new Uint8Array(16)
  crypto.getRandomValues(array)
  return Buffer.from(array).toString('base64')
}

export function middleware(request: NextRequest) {
  const startTime = Date.now()
  const { pathname } = request.nextUrl

  // 生成 CSP Nonce
  const nonce = generateNonce()

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
    return handleApiCaching(request, startTime, nonce)
  }

  // 处理页面缓存
  return handlePageCaching(request, startTime, nonce)
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
function handleApiCaching(request: NextRequest, startTime: number, nonce: string): NextResponse {
  const { pathname, searchParams } = request.nextUrl

  // 检查是否是可缓存的API路径
  const isCacheable = CACHEABLE_PATHS.some(path => pathname.startsWith(path))

  if (!isCacheable) {
    const response = NextResponse.next()
    addServerTiming(response, startTime, 'api-uncacheable')
    // 仅在生产环境启用安全头部
    if (process.env.NODE_ENV === 'production') {
      addSecurityHeaders(response, nonce)
    }
    return response
  }

  // 生成 ETag 用于条件请求
  const etag = generateSimpleETag(pathname + searchParams.toString())

  // 检查条件请求
  const ifNoneMatch = request.headers.get('If-None-Match')
  const ifModifiedSince = request.headers.get('If-Modified-Since')

  if (ifNoneMatch === etag) {
    // 返回 304 Not Modified
    const response = new NextResponse(null, {
      status: 304,
      statusText: 'Not Modified',
      headers: {
        'ETag': etag,
        'Cache-Control': 'public, max-age=300, stale-while-revalidate=60',
        'CDN-Cache-Control': 'public, max-age=300',
      },
    })
    addServerTiming(response, startTime, 'api-304')
    // 仅在生产环境启用安全头部
    if (process.env.NODE_ENV === 'production') {
      addSecurityHeaders(response, nonce)
    }
    return response
  }

  // 继续处理请求，添加缓存头
  const response = NextResponse.next()

  // 根据 API 类型设置不同的缓存策略
  if (pathname.includes('/fortunes')) {
    // 幸运饼干数据 - 中等缓存时间
    response.headers.set('Cache-Control', 'public, max-age=300, stale-while-revalidate=60')
    response.headers.set('CDN-Cache-Control', 'public, max-age=300')
  } else if (pathname.includes('/analytics')) {
    // 分析数据 - 短缓存时间
    response.headers.set('Cache-Control', 'public, max-age=60, stale-while-revalidate=30')
    response.headers.set('CDN-Cache-Control', 'public, max-age=60')
  } else {
    // 默认 API 缓存
    response.headers.set('Cache-Control', 'public, max-age=180, stale-while-revalidate=60')
    response.headers.set('CDN-Cache-Control', 'public, max-age=180')
  }

  // 添加 ETag 和 Last-Modified
  response.headers.set('ETag', etag)
  response.headers.set('Last-Modified', new Date().toUTCString())

  // 添加 Vary 头以支持内容协商
  response.headers.set('Vary', 'Accept-Encoding, Accept')

  addServerTiming(response, startTime, 'api-cacheable')
  // 仅在生产环境启用安全头部
  if (process.env.NODE_ENV === 'production') {
    addSecurityHeaders(response, nonce)
  }
  return response
}

// 添加安全标头（包括 CSP Nonce 和 Trusted Types）
function addSecurityHeaders(response: NextResponse, nonce: string): void {
  // 将 nonce 添加到响应头，供页面使用
  response.headers.set('x-nonce', nonce)

  // 更新 CSP 标头以使用 nonce 和 Trusted Types
  // 开发模式需要 'unsafe-eval' 用于 HMR (Hot Module Replacement)
  const isDev = process.env.NODE_ENV === 'development'
  const scriptSrc = isDev
    ? `script-src 'self' 'unsafe-eval' 'nonce-${nonce}' https://www.googletagmanager.com https://www.google-analytics.com https://ssl.google-analytics.com https://pagead2.googlesyndication.com https://www.googleadservices.com https://googleads.g.doubleclick.net https://fundingchoicesmessages.google.com`
    : `script-src 'self' 'nonce-${nonce}' https://www.googletagmanager.com https://www.google-analytics.com https://ssl.google-analytics.com https://pagead2.googlesyndication.com https://www.googleadservices.com https://googleads.g.doubleclick.net https://fundingchoicesmessages.google.com`

  const csp = [
    "default-src 'self'",
    scriptSrc,
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data: https: blob:",
    "connect-src 'self' https://openrouter.ai https://www.google-analytics.com https://analytics.google.com https://stats.g.doubleclick.net https://pagead2.googlesyndication.com https://www.googleadservices.com https://googleads.g.doubleclick.net https://fundingchoicesmessages.google.com",
    "frame-src 'self' https://googleads.g.doubleclick.net https://tpc.googlesyndication.com https://fundingchoicesmessages.google.com",
    "media-src 'self'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    "upgrade-insecure-requests"
  ]

  // Trusted Types 临时禁用
  // 原因：Next.js 14 和 Framer Motion 与 Trusted Types 存在兼容性问题
  // 错误：This document requires 'TrustedHTML' assignment
  // TODO: 在未来版本中重新启用，需要为所有第三方库添加适当的策略
  // if (process.env.NODE_ENV === 'production') {
  //   csp.push(
  //     "require-trusted-types-for 'script'",
  //     "trusted-types nextjs nextjs#bundler default 'allow-duplicates'"
  //   )
  // }

  const cspString = csp.join('; ')

  // 设置 CSP 头部
  response.headers.set('Content-Security-Policy', cspString)
}

// 处理页面缓存
function handlePageCaching(request: NextRequest, startTime: number, nonce: string): NextResponse {
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

  // 添加安全标头（仅在生产环境）
  if (process.env.NODE_ENV === 'production') {
    addSecurityHeaders(response, nonce)
  }

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
