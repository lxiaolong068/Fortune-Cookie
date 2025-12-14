// 边缘缓存策略和CDN优化

// 缓存控制头部配置
export const CACHE_HEADERS = {
  // 静态资源 - 长期缓存
  STATIC_ASSETS: {
    'Cache-Control': 'public, max-age=31536000, immutable', // 1年
    'CDN-Cache-Control': 'public, max-age=31536000',
  },
  
  // 图片资源 - 中期缓存
  IMAGES: {
    'Cache-Control': 'public, max-age=2592000', // 30天
    'CDN-Cache-Control': 'public, max-age=2592000',
  },
  
  // API响应 - 短期缓存
  API_RESPONSES: {
    'Cache-Control': 'public, max-age=300, s-maxage=600', // 5分钟客户端，10分钟CDN
    'CDN-Cache-Control': 'public, max-age=600',
    'Vary': 'Accept-Encoding, User-Agent',
  },
  
  // 动态内容 - 验证缓存
  DYNAMIC_CONTENT: {
    'Cache-Control': 'public, max-age=0, must-revalidate',
    'CDN-Cache-Control': 'public, max-age=60', // CDN缓存1分钟
    'Vary': 'Accept-Encoding',
  },
  
  // 不缓存
  NO_CACHE: {
    'Cache-Control': 'no-cache, no-store, must-revalidate',
    'Pragma': 'no-cache',
    'Expires': '0',
  },
} as const

// 边缘缓存管理器
export class EdgeCacheManager {
  // 设置响应缓存头部
  static setCacheHeaders(response: Response, cacheType: keyof typeof CACHE_HEADERS): Response {
    const headers = CACHE_HEADERS[cacheType]
    
    Object.entries(headers).forEach(([key, value]) => {
      response.headers.set(key, value)
    })
    
    return response
  }

  // 生成ETag
  static generateETag(content: string): string {
    // 简单的ETag生成，生产环境可以使用更复杂的算法
    const hash = Buffer.from(content).toString('base64').slice(0, 16)
    return `"${hash}"`
  }

  // 检查条件请求
  static checkConditionalRequest(
    request: Request,
    etag: string,
    lastModified?: Date
  ): boolean {
    const ifNoneMatch = request.headers.get('If-None-Match')
    const ifModifiedSince = request.headers.get('If-Modified-Since')

    // 检查ETag
    if (ifNoneMatch && ifNoneMatch === etag) {
      return true // 304 Not Modified
    }

    // 检查Last-Modified
    if (ifModifiedSince && lastModified) {
      const ifModifiedSinceDate = new Date(ifModifiedSince)
      if (lastModified <= ifModifiedSinceDate) {
        return true // 304 Not Modified
      }
    }

    return false
  }

  // 创建304响应
  static createNotModifiedResponse(): Response {
    return new Response(null, {
      status: 304,
      statusText: 'Not Modified',
    })
  }

  // 为API响应添加缓存优化
  static optimizeApiResponse(
    data: unknown,
    cacheKey: string,
    maxAge: number = 300
  ): Response {
    const content = JSON.stringify(data)
    const etag = this.generateETag(content)
    
    const response = new Response(content, {
      headers: {
        'Content-Type': 'application/json',
        'ETag': etag,
        'Cache-Control': `public, max-age=${maxAge}`,
        'CDN-Cache-Control': `public, max-age=${maxAge * 2}`,
        'Vary': 'Accept-Encoding',
        'X-Cache-Key': cacheKey,
      },
    })

    return response
  }

  // 为静态内容添加缓存优化
  static optimizeStaticResponse(
    content: string,
    contentType: string,
    maxAge: number = 31536000
  ): Response {
    const etag = this.generateETag(content)
    
    return new Response(content, {
      headers: {
        'Content-Type': contentType,
        'ETag': etag,
        'Cache-Control': `public, max-age=${maxAge}, immutable`,
        'CDN-Cache-Control': `public, max-age=${maxAge}`,
      },
    })
  }
}

// CDN优化配置
export const CDN_CONFIG = {
  // Vercel Edge Functions 配置
  vercel: {
    regions: ['hkg1', 'sin1', 'nrt1', 'icn1'], // 亚太地区
    runtime: 'edge',
  },
  
  // Cloudflare 配置
  cloudflare: {
    cacheEverything: true,
    browserCacheTtl: 300,
    edgeCacheTtl: 600,
    cacheLevel: 'aggressive',
  },
  
  // AWS CloudFront 配置
  cloudfront: {
    defaultTtl: 300,
    maxTtl: 31536000,
    compress: true,
    viewerProtocolPolicy: 'redirect-to-https',
  },
}

// 缓存预热策略
export class CacheWarmupManager {
  private static readonly WARMUP_URLS = [
    '/',
    '/generator',
    '/messages',
    '/api/fortunes?action=popular&limit=10',
    '/api/fortunes?action=random&count=5',
  ]

  // 预热关键页面和API
  static async warmupCache(baseUrl: string): Promise<void> {
    const promises = this.WARMUP_URLS.map(async (url) => {
      try {
        const response = await fetch(`${baseUrl}${url}`, {
          method: 'GET',
          headers: {
            'User-Agent': 'Cache-Warmup-Bot/1.0',
            'X-Cache-Warmup': 'true',
          },
        })
        
        console.log(`Warmed up ${url}: ${response.status}`)
      } catch (error) {
        console.error(`Failed to warm up ${url}:`, error)
      }
    })

    await Promise.allSettled(promises)
    console.log('Cache warmup completed')
  }

  // 智能预热（基于用户行为）
  static async intelligentWarmup(popularUrls: string[], baseUrl: string): Promise<void> {
    const promises = popularUrls.map(async (url) => {
      try {
        await fetch(`${baseUrl}${url}`, {
          method: 'GET',
          headers: {
            'X-Cache-Warmup': 'intelligent',
          },
        })
      } catch (error) {
        console.error(`Intelligent warmup failed for ${url}:`, error)
      }
    })

    await Promise.allSettled(promises)
  }
}

// 缓存失效策略
export class CacheInvalidationManager {
  // 失效相关缓存
  static async invalidateRelatedCache(pattern: string): Promise<void> {
    // 这里可以集成CDN的缓存失效API
    console.log(`Invalidating cache pattern: ${pattern}`)
    
    // 示例：Vercel缓存失效
    if (process.env.VERCEL_TOKEN) {
      try {
        // 调用Vercel API失效缓存
        // await this.invalidateVercelCache(pattern)
      } catch (error) {
        console.error('Vercel cache invalidation failed:', error)
      }
    }
  }

  // 智能缓存失效
  static async smartInvalidation(contentType: string, contentId: string): Promise<void> {
    const patterns = this.generateInvalidationPatterns(contentType, contentId)
    
    for (const pattern of patterns) {
      await this.invalidateRelatedCache(pattern)
    }
  }

  // 生成失效模式
  private static generateInvalidationPatterns(contentType: string, contentId: string): string[] {
    void contentId
    const patterns: string[] = []
    
    switch (contentType) {
      case 'fortune':
        patterns.push(`/api/fortune*`)
        patterns.push(`/api/fortunes*`)
        patterns.push(`/generator*`)
        break
      case 'analytics':
        patterns.push(`/api/analytics*`)
        break
      default:
        patterns.push(`/${contentType}*`)
    }
    
    return patterns
  }
}

// 缓存性能监控
export class CachePerformanceMonitor {
  private static metrics = {
    hits: 0,
    misses: 0,
    errors: 0,
    totalRequests: 0,
  }

  // 记录缓存命中
  static recordHit(): void {
    this.metrics.hits++
    this.metrics.totalRequests++
  }

  // 记录缓存未命中
  static recordMiss(): void {
    this.metrics.misses++
    this.metrics.totalRequests++
  }

  // 记录缓存错误
  static recordError(): void {
    this.metrics.errors++
    this.metrics.totalRequests++
  }

  // 获取缓存统计
  static getStats(): {
    hits: number
    misses: number
    errors: number
    totalRequests: number
    hitRate: number
    timestamp: string
  } {
    const hitRate = this.metrics.totalRequests > 0 
      ? (this.metrics.hits / this.metrics.totalRequests) * 100 
      : 0

    return {
      ...this.metrics,
      hitRate: Math.round(hitRate * 100) / 100,
      timestamp: new Date().toISOString(),
    }
  }

  // 重置统计
  static resetStats(): void {
    this.metrics = {
      hits: 0,
      misses: 0,
      errors: 0,
      totalRequests: 0,
    }
  }
}
