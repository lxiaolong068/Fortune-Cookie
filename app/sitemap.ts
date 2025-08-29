import { MetadataRoute } from 'next'
import { getSiteUrl } from '@/lib/site'
import { i18n, getLocalizedPath, getAlternateLinks, type Locale } from '@/lib/i18n-config'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = getSiteUrl()
  const currentDate = new Date()

  // Define all pages that should be included in sitemap
  const pages = [
    { path: '/', priority: 1.0, changeFrequency: 'daily' as const },
    { path: '/generator', priority: 0.9, changeFrequency: 'daily' as const },
    { path: '/messages', priority: 0.8, changeFrequency: 'weekly' as const },
    { path: '/browse', priority: 0.8, changeFrequency: 'weekly' as const },
    { path: '/history', priority: 0.7, changeFrequency: 'monthly' as const },
    { path: '/recipes', priority: 0.7, changeFrequency: 'monthly' as const },
    { path: '/who-invented-fortune-cookies', priority: 0.6, changeFrequency: 'monthly' as const },
    { path: '/how-to-make-fortune-cookies', priority: 0.6, changeFrequency: 'monthly' as const },
    { path: '/funny-fortune-cookie-messages', priority: 0.6, changeFrequency: 'weekly' as const },
    { path: '/profile', priority: 0.5, changeFrequency: 'weekly' as const },
    { path: '/analytics', priority: 0.4, changeFrequency: 'weekly' as const },
    { path: '/cookies', priority: 0.4, changeFrequency: 'monthly' as const },
    { path: '/offline', priority: 0.2, changeFrequency: 'yearly' as const },
    { path: '/privacy', priority: 0.3, changeFrequency: 'yearly' as const },
    { path: '/terms', priority: 0.3, changeFrequency: 'yearly' as const },
  ]

  // Generate sitemap entries for all locales
  const sitemapEntries: MetadataRoute.Sitemap = []

  pages.forEach(page => {
    // For each page, create entries for all supported locales
    i18n.locales.forEach(locale => {
      const localizedPath = getLocalizedPath(page.path, locale)
      const fullUrl = `${baseUrl}${localizedPath}`

      // Generate alternate language links
      const alternates = getAlternateLinks(page.path).reduce((acc, alt) => {
        acc[alt.hreflang] = `${baseUrl}${alt.href}`
        return acc
      }, {} as Record<string, string>)

      sitemapEntries.push({
        url: fullUrl,
        lastModified: currentDate,
        changeFrequency: page.changeFrequency,
        priority: page.priority,
        alternates: {
          languages: alternates,
        },
      })
    })
  })

  return sitemapEntries

}
