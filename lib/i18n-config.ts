/**
 * Internationalization (i18n) Configuration
 * Prepares the project for future multi-language support
 */

export const i18n = {
  defaultLocale: "en",
  locales: ["en", "zh", "es", "pt"],
} as const;

export type Locale = (typeof i18n)["locales"][number];

/**
 * Language configuration with display names and metadata
 */
export const languages = {
  en: {
    name: "English",
    nativeName: "English",
    flag: "🇺🇸",
    dir: "ltr",
    hreflang: "en-US",
    region: "US",
    currency: "USD",
    dateFormat: "MM/dd/yyyy",
    timeFormat: "12h",
  },
  zh: {
    name: "Chinese",
    nativeName: "中文",
    flag: "🇨🇳",
    dir: "ltr",
    hreflang: "zh-CN",
    region: "CN",
    currency: "CNY",
    dateFormat: "yyyy/MM/dd",
    timeFormat: "24h",
  },
  es: {
    name: "Spanish",
    nativeName: "Español",
    flag: "🇪🇸",
    dir: "ltr",
    hreflang: "es",
    region: "ES",
    currency: "EUR",
    dateFormat: "dd/MM/yyyy",
    timeFormat: "24h",
  },
  pt: {
    name: "Portuguese",
    nativeName: "Português",
    flag: "🇧🇷",
    dir: "ltr",
    hreflang: "pt-BR",
    region: "BR",
    currency: "BRL",
    dateFormat: "dd/MM/yyyy",
    timeFormat: "24h",
  },
} as const;

/**
 * Get language configuration for a specific locale
 */
export function getLanguageConfig(locale: Locale) {
  return languages[locale] || languages[i18n.defaultLocale];
}

/**
 * Check if a locale is supported
 */
export function isValidLocale(locale: string): locale is Locale {
  return i18n.locales.includes(locale as Locale);
}

/**
 * Get the default locale
 */
export function getDefaultLocale(): Locale {
  return i18n.defaultLocale;
}

/**
 * Get all supported locales
 */
export function getSupportedLocales(): readonly Locale[] {
  return i18n.locales;
}

/**
 * URL path configuration for different locales
 * Currently using subdirectory approach: /en/, /zh/
 */
export const pathConfig = {
  // Whether to show default locale in URL (false = /page, true = /en/page)
  showDefaultLocale: false,

  // URL structure strategy
  strategy: "subdirectory" as const, // 'subdirectory' | 'subdomain' | 'domain'

  // Locale detection methods
  detection: {
    // Detect from URL path
    path: true,
    // Detect from Accept-Language header
    header: true,
    // Detect from cookie
    cookie: true,
    // Cookie name for storing user's language preference
    cookieName: "NEXT_LOCALE",
    // Cookie max age (30 days)
    cookieMaxAge: 30 * 24 * 60 * 60,
  },
} as const;

/**
 * Generate localized URL path
 */
export function getLocalizedPath(path: string, locale: Locale): string {
  // Remove leading slash if present
  const cleanPath = path.startsWith("/") ? path.slice(1) : path;

  // For default locale, return path as-is if showDefaultLocale is false
  if (locale === i18n.defaultLocale && !pathConfig.showDefaultLocale) {
    return `/${cleanPath}`;
  }

  // For non-default locales or when showDefaultLocale is true
  return `/${locale}${cleanPath ? `/${cleanPath}` : ""}`;
}

/**
 * Extract locale from URL path
 */
export function getLocaleFromPath(path: string): {
  locale: Locale;
  pathname: string;
} {
  const segments = path.split("/").filter(Boolean);

  if (segments.length === 0) {
    return { locale: i18n.defaultLocale, pathname: "/" };
  }

  const firstSegment = segments[0];

  if (firstSegment && isValidLocale(firstSegment)) {
    const pathname = "/" + segments.slice(1).join("/");
    return {
      locale: firstSegment,
      pathname: pathname === "/" ? "/" : pathname,
    };
  }

  return { locale: i18n.defaultLocale, pathname: path };
}

/**
 * Generate alternate language links for SEO
 */
export function getAlternateLinks(currentPath: string) {
  const { pathname } = getLocaleFromPath(currentPath);

  return i18n.locales.map((locale) => ({
    hreflang: languages[locale].hreflang,
    href: getLocalizedPath(pathname, locale),
  }));
}

/**
 * Page-specific translation keys structure
 * This will be used when implementing actual translations
 */
export const translationNamespaces = {
  common: [
    "navigation",
    "footer",
    "buttons",
    "forms",
    "errors",
    "loading",
    "meta",
  ],
  pages: [
    "home",
    "generator",
    "messages",
    "browse",
    "history",
    "recipes",
    "profile",
    "privacy",
    "terms",
  ],
  components: [
    "fortune-cookie",
    "ai-generator",
    "message-card",
    "theme-selector",
    "preferences",
  ],
} as const;

/**
 * SEO configuration for different locales
 */
export const seoConfig = {
  en: {
    title: "Fortune Cookie - Free Online AI Generator",
    description:
      "Free online AI-powered fortune cookie generator. Get personalized inspirational messages, funny quotes, and lucky numbers. Create custom fortune cookies with our AI tool. Perfect for daily motivation, parties, and social sharing.",
    keywords: [
      "fortune cookie",
      "free online fortune cookie generator ai",
      "custom fortune cookie message creator",
      "ai fortune cookie sayings app",
      "inspirational fortune cookie quotes",
      "funny fortune cookie messages",
      "lucky numbers generator",
      "personalized fortune cookies",
    ],
    ogTitle: "Fortune Cookie AI - Free Online Generator",
    ogDescription:
      "Create personalized fortune cookies with AI. Get inspirational messages, funny quotes, and lucky numbers instantly. Share wisdom and fun with friends.",
  },
  zh: {
    title: "幸运饼干 - 免费在线AI生成器",
    description:
      "免费在线AI驱动的幸运饼干生成器。获取个性化励志消息、搞笑语录和幸运数字。使用我们的AI工具创建定制幸运饼干。适合日常激励、聚会娱乐和社交分享。",
    keywords: [
      "幸运饼干",
      "免费在线幸运饼干生成器",
      "定制幸运饼干消息创建器",
      "AI幸运饼干语录应用",
      "励志幸运饼干语录",
      "搞笑幸运饼干消息",
      "幸运数字生成器",
      "个性化幸运饼干",
    ],
    ogTitle: "幸运饼干AI - 免费在线生成器",
    ogDescription:
      "使用AI创建个性化幸运饼干。立即获取励志消息、搞笑语录和幸运数字。与朋友分享智慧和乐趣。",
  },
  es: {
    title: "Galleta de la Fortuna - Generador AI Gratis Online",
    description:
      "Generador de galletas de la fortuna con IA gratis online. Obtén mensajes inspiradores personalizados, frases graciosas y números de la suerte. Crea galletas de la fortuna personalizadas con nuestra herramienta de IA. Perfecto para motivación diaria, fiestas y compartir en redes sociales.",
    keywords: [
      "galleta de la fortuna",
      "generador de galletas de la fortuna gratis",
      "creador de mensajes de galleta de la fortuna",
      "app de frases de galleta de la fortuna con IA",
      "frases inspiradoras de galleta de la fortuna",
      "mensajes graciosos de galleta de la fortuna",
      "generador de números de la suerte",
      "galletas de la fortuna personalizadas",
    ],
    ogTitle: "Galleta de la Fortuna AI - Generador Gratis Online",
    ogDescription:
      "Crea galletas de la fortuna personalizadas con IA. Obtén mensajes inspiradores, frases graciosas y números de la suerte al instante. Comparte sabiduría y diversión con amigos.",
  },
  pt: {
    title: "Biscoito da Sorte - Gerador AI Grátis Online",
    description:
      "Gerador de biscoitos da sorte com IA grátis online. Obtenha mensagens inspiradoras personalizadas, frases engraçadas e números da sorte. Crie biscoitos da sorte personalizados com nossa ferramenta de IA. Perfeito para motivação diária, festas e compartilhamento nas redes sociais.",
    keywords: [
      "biscoito da sorte",
      "gerador de biscoito da sorte grátis",
      "criador de mensagens de biscoito da sorte",
      "app de frases de biscoito da sorte com IA",
      "frases inspiradoras de biscoito da sorte",
      "mensagens engraçadas de biscoito da sorte",
      "gerador de números da sorte",
      "biscoitos da sorte personalizados",
    ],
    ogTitle: "Biscoito da Sorte AI - Gerador Grátis Online",
    ogDescription:
      "Crie biscoitos da sorte personalizados com IA. Obtenha mensagens inspiradoras, frases engraçadas e números da sorte instantaneamente. Compartilhe sabedoria e diversão com amigos.",
  },
} as const;

/**
 * Get SEO metadata for a specific locale
 */
export function getLocalizedSEO(locale: Locale) {
  return seoConfig[locale] || seoConfig[i18n.defaultLocale];
}

/**
 * Get SEO config for a specific locale with mutable arrays for Next.js Metadata compatibility
 */
export function getSEOConfig(locale: Locale | string): {
  title: string;
  description: string;
  keywords: string[];
  ogTitle: string;
  ogDescription: string;
  siteName: string;
} {
  const validLocale = isValidLocale(locale) ? locale : i18n.defaultLocale;
  const config = seoConfig[validLocale] || seoConfig[i18n.defaultLocale];
  return {
    title: config.title,
    description: config.description,
    keywords: [...config.keywords], // Create mutable copy for Next.js Metadata
    ogTitle: config.ogTitle,
    ogDescription: config.ogDescription,
    siteName:
      languages[validLocale].nativeName === languages[validLocale].name
        ? "Fortune Cookie AI"
        : `Fortune Cookie AI - ${languages[validLocale].nativeName}`,
  };
}

/**
 * Generate multi-language alternates for Next.js Metadata
 * Used for hreflang SEO optimization
 *
 * @param path - The canonical path (e.g., "/generator", "/browse")
 * @param baseUrl - The site base URL (e.g., "https://fortunecookie.vip")
 * @returns Object with languages mapping for metadata.alternates
 *
 * @example
 * // In page metadata:
 * export const metadata: Metadata = {
 *   alternates: {
 *     canonical: "/generator",
 *     languages: generateAlternateLanguages("/generator", baseUrl),
 *   },
 * };
 */
export function generateAlternateLanguages(
  path: string,
  baseUrl: string,
): Record<string, string> {
  const alternates: Record<string, string> = {};

  // Clean the path - remove any existing locale prefix
  const cleanPath = path
    .replace(/^\/(zh|es|pt)\//, "/")
    .replace(/^\/(zh|es|pt)$/, "/");

  for (const locale of i18n.locales) {
    const config = getLanguageConfig(locale);

    if (locale === i18n.defaultLocale) {
      // Default locale (en) uses root path
      alternates[config.hreflang] =
        `${baseUrl}${cleanPath === "/" ? "" : cleanPath}`;
    } else {
      // Other locales use prefixed path
      const localePath =
        cleanPath === "/" ? `/${locale}` : `/${locale}${cleanPath}`;
      alternates[config.hreflang] = `${baseUrl}${localePath}`;
    }
  }

  // Add x-default pointing to English version
  alternates["x-default"] = `${baseUrl}${cleanPath === "/" ? "" : cleanPath}`;

  return alternates;
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
