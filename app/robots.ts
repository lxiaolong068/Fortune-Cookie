import { MetadataRoute } from 'next'
import { getSiteUrl } from '@/lib/site'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = getSiteUrl()

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/private/',
          '/admin/',
          '/api/',
          '/_next/',
          '/static/',
          '*.json',
          '/tmp/',
          '/cache/',
        ],
      },
      // 允许搜索引擎访问重要的静态资源
      {
        userAgent: '*',
        allow: [
          '/favicon.ico',
          '/robots.txt',
          '/sitemap.xml',
          '/manifest.webmanifest',
          '/*.png',
          '/*.jpg',
          '/*.jpeg',
          '/*.svg',
          '/*.webp',
          '/*.css',
          '/*.js',
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  }
}
