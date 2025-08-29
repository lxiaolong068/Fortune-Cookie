/**
 * Internationalization (i18n) Configuration
 * Prepares the project for future multi-language support
 */

export const i18n = {
  defaultLocale: 'en',
  locales: ['en', 'zh'],
} as const

export type Locale = (typeof i18n)['locales'][number]

/**
 * Language configuration with display names and metadata
 */
export const languages = {
  en: {
    name: 'English',
    nativeName: 'English',
    flag: '🇺🇸',
    dir: 'ltr',
    hreflang: 'en-US',
    region: 'US',
    currency: 'USD',
    dateFormat: 'MM/dd/yyyy',
    timeFormat: '12h',
  },
  zh: {
    name: 'Chinese',
    nativeName: '中文',
    flag: '🇨🇳',
    dir: 'ltr',
    hreflang: 'zh-CN',
    region: 'CN',
    currency: 'CNY',
    dateFormat: 'yyyy/MM/dd',
    timeFormat: '24h',
  },
} as const

/**
 * Get language configuration for a specific locale
 */
export function getLanguageConfig(locale: Locale) {
  return languages[locale] || languages[i18n.defaultLocale]
}

/**
 * Check if a locale is supported
 */
export function isValidLocale(locale: string): locale is Locale {
  return i18n.locales.includes(locale as Locale)
}

/**
 * Get the default locale
 */
export function getDefaultLocale(): Locale {
  return i18n.defaultLocale
}

/**
 * Get all supported locales
 */
export function getSupportedLocales(): readonly Locale[] {
  return i18n.locales
}

/**
 * URL path configuration for different locales
 * Currently using subdirectory approach: /en/, /zh/
 */
export const pathConfig = {
  // Whether to show default locale in URL (false = /page, true = /en/page)
  showDefaultLocale: false,
  
  // URL structure strategy
  strategy: 'subdirectory' as const, // 'subdirectory' | 'subdomain' | 'domain'
  
  // Locale detection methods
  detection: {
    // Detect from URL path
    path: true,
    // Detect from Accept-Language header
    header: true,
    // Detect from cookie
    cookie: true,
    // Cookie name for storing user's language preference
    cookieName: 'NEXT_LOCALE',
    // Cookie max age (30 days)
    cookieMaxAge: 30 * 24 * 60 * 60,
  },
} as const

/**
 * Generate localized URL path
 */
export function getLocalizedPath(path: string, locale: Locale): string {
  // Remove leading slash if present
  const cleanPath = path.startsWith('/') ? path.slice(1) : path
  
  // For default locale, return path as-is if showDefaultLocale is false
  if (locale === i18n.defaultLocale && !pathConfig.showDefaultLocale) {
    return `/${cleanPath}`
  }
  
  // For non-default locales or when showDefaultLocale is true
  return `/${locale}${cleanPath ? `/${cleanPath}` : ''}`
}

/**
 * Extract locale from URL path
 */
export function getLocaleFromPath(path: string): { locale: Locale; pathname: string } {
  const segments = path.split('/').filter(Boolean)
  
  if (segments.length === 0) {
    return { locale: i18n.defaultLocale, pathname: '/' }
  }
  
  const firstSegment = segments[0]
  
  if (isValidLocale(firstSegment)) {
    const pathname = '/' + segments.slice(1).join('/')
    return { locale: firstSegment, pathname: pathname === '/' ? '/' : pathname }
  }
  
  return { locale: i18n.defaultLocale, pathname: path }
}

/**
 * Generate alternate language links for SEO
 */
export function getAlternateLinks(currentPath: string) {
  const { pathname } = getLocaleFromPath(currentPath)
  
  return i18n.locales.map(locale => ({
    hreflang: languages[locale].hreflang,
    href: getLocalizedPath(pathname, locale),
  }))
}

/**
 * Page-specific translation keys structure
 * This will be used when implementing actual translations
 */
export const translationNamespaces = {
  common: [
    'navigation',
    'footer',
    'buttons',
    'forms',
    'errors',
    'loading',
    'meta',
  ],
  pages: [
    'home',
    'generator',
    'messages',
    'browse',
    'history',
    'recipes',
    'profile',
    'privacy',
    'terms',
  ],
  components: [
    'fortune-cookie',
    'ai-generator',
    'message-card',
    'theme-selector',
    'preferences',
  ],
} as const

/**
 * SEO configuration for different locales
 */
export const seoConfig = {
  en: {
    title: 'Fortune Cookie - Free Online AI Generator',
    description: 'Free online AI-powered fortune cookie generator. Get personalized inspirational messages, funny quotes, and lucky numbers. Create custom fortune cookies with our AI tool.',
    keywords: [
      'fortune cookie',
      'free online fortune cookie generator ai',
      'custom fortune cookie message creator',
      'ai fortune cookie sayings app',
      'inspirational fortune cookie quotes',
      'funny fortune cookie messages',
      'lucky numbers generator',
      'personalized fortune cookies'
    ],
    ogTitle: 'Fortune Cookie AI - Free Online Generator',
    ogDescription: 'Create personalized fortune cookies with AI. Get inspirational messages, funny quotes, and lucky numbers instantly.',
  },
  zh: {
    title: '幸运饼干 - 免费在线AI生成器',
    description: '免费在线AI驱动的幸运饼干生成器。获取个性化励志消息、搞笑语录和幸运数字。使用我们的AI工具创建定制幸运饼干。',
    keywords: [
      '幸运饼干',
      '免费在线幸运饼干生成器',
      '定制幸运饼干消息创建器',
      'AI幸运饼干语录应用',
      '励志幸运饼干语录',
      '搞笑幸运饼干消息',
      '幸运数字生成器',
      '个性化幸运饼干'
    ],
    ogTitle: '幸运饼干AI - 免费在线生成器',
    ogDescription: '使用AI创建个性化幸运饼干。立即获取励志消息、搞笑语录和幸运数字。',
  },
} as const

/**
 * Get SEO metadata for a specific locale
 */
export function getLocalizedSEO(locale: Locale) {
  return seoConfig[locale] || seoConfig[i18n.defaultLocale]
}

/**
 * Future implementation notes:
 * 
 * 1. Translation files structure:
 *    - /locales/en/common.json
 *    - /locales/en/pages.json
 *    - /locales/zh/common.json
 *    - /locales/zh/pages.json
 * 
 * 2. Next.js middleware for locale detection:
 *    - Create middleware.ts in project root
 *    - Implement automatic locale detection and redirection
 * 
 * 3. Translation hook:
 *    - useTranslation() hook for components
 *    - Server-side translation functions
 * 
 * 4. Dynamic imports for translations:
 *    - Load only required translation files
 *    - Implement translation caching
 * 
 * 5. RTL support preparation:
 *    - CSS logical properties
 *    - Direction-aware components
 */
