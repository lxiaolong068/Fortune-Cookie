/**
 * Translation utilities for multi-language support
 * Provides server-side and client-side translation functions
 */

import { type Locale, i18n } from "./i18n-config";

// Type definitions for translation files
export interface TranslationFile {
  common: {
    siteName: string;
    siteDescription: string;
    loading: string;
    error: string;
    tryAgain: string;
    close: string;
    save: string;
    cancel: string;
    share: string;
    copy: string;
    copied: string;
    download: string;
    learnMore: string;
    viewAll: string;
    back: string;
    next: string;
    previous: string;
    search: string;
    filter: string;
    sort: string;
    newest: string;
    oldest: string;
    popular: string;
    random: string;
    selectLanguage: string;
    switchToLanguage: string;
    languageOptions: string;
    skipToContent: string;
    online: string;
    offline: string;
    refresh: string;
    pauseAutoPlay: string;
    resumeAutoPlay: string;
    previousFortune: string;
    nextFortune: string;
    goToFortune: string;
    carouselNavigation: string;
  };
  navigation: {
    home: string;
    generator: string;
    messages: string;
    browse: string;
    history: string;
    recipes: string;
    blog: string;
    faq: string;
    profile: string;
    favorites: string;
    calendar: string;
    signIn: string;
    signOut: string;
    mainLabel: string;
    mobileLabel: string;
    menuLabel: string;
    openMenu: string;
    closeMenu: string;
    homeDescription: string;
    generatorDescription: string;
    messagesDescription: string;
    browseDescription: string;
    favoritesDescription: string;
    calendarDescription: string;
    historyDescription: string;
    recipesDescription: string;
    blogDescription: string;
    profileDescription: string;
  };
  footer: {
    about: string;
    privacy: string;
    terms: string;
    cookies: string;
    contact: string;
    copyright: string;
    madeWith: string;
    poweredBy: string;
    generate: string;
    learn: string;
    messages: string;
    fortuneGenerator: string;
    aiGenerator: string;
    browseMessages: string;
    whoInvented: string;
    allMessages: string;
    funnyMessages: string;
    howToMake: string;
    popularSearches: string;
    fortuneCategories: string;
    learnMore: string;
    resources: string;
    myFavorites: string;
    fortuneDatabase: string;
    sitemap: string;
    contactUs: string;
    followTwitter: string;
    viewGithub: string;
    contactEmail: string;
    funnyFortuneMessages: string;
    whoInventedFull: string;
    howToMakeFull: string;
    inspirationalQuotes: string;
    loveFortunes: string;
    successMessages: string;
    wisdomQuotes: string;
    friendshipMessages: string;
    fortuneHistory: string;
    fortuneRecipes: string;
    blogArticles: string;
  };
  home: {
    title: string;
    subtitle: string;
    description: string;
    getStarted: string;
    dailyFortune: string;
    popularCategories: string;
    howItWorks: string;
    testimonials: string;
    cta: string;
    ctaButton: string;
    heroTitle: string;
    heroTitleShort: string;
    heroDescription: string;
    experienceLabel: string;
    tapToOpen: string;
    magicAwaits: string;
    whyUseTitle: string;
    hotFortunesTitle: string;
    features: {
      feature1: string;
      feature2: string;
      feature3: string;
      feature4: string;
      feature5: string;
      feature6: string;
      feature7: string;
      feature8: string;
    };
    howToUseTitle: string;
    howToUseDescription: string;
    howToUseStep1: string;
    howToUseStep2: string;
    howToUseStep3: string;
    howToUseCta: string;
    aiGeneratorLink: string;
    howToUseCtaSuffix: string;
  };
  generator: {
    title: string;
    subtitle: string;
    selectTheme: string;
    themes: {
      inspirational: string;
      funny: string;
      love: string;
      success: string;
      wisdom: string;
      friendship: string;
      health: string;
      travel: string;
      birthday: string;
      study: string;
    };
    generateButton: string;
    generating: string;
    yourFortune: string;
    luckyNumbers: string;
    newFortune: string;
    saveFortune: string;
    shareFortune: string;
    quotaInfo: string;
    quotaExceeded: string;
    signInForMore: string;
  };
  dailyFortune: {
    title: string;
    subtitle: string;
    overallScore: string;
    dimensions: {
      career: string;
      love: string;
      health: string;
      wealth: string;
    };
    luckyColor: string;
    luckyDirection: string;
    advice: string;
    tomorrowPreview: string;
    revealTomorrow: string;
    resetIn: string;
    getAIFortune: string;
    luckyNumbers: string;
    breakdown: string;
    peek: string;
    hide: string;
    ratings: {
      excellent: string;
      good: string;
      fair: string;
      challenging: string;
    };
  };
  messages: {
    title: string;
    subtitle: string;
    searchPlaceholder: string;
    filterByCategory: string;
    allCategories: string;
    noResults: string;
    totalMessages: string;
  };
  browse: {
    title: string;
    subtitle: string;
    categories: string;
    tags: string;
    recentlyAdded: string;
  };
  favorites: {
    title: string;
    subtitle: string;
    empty: string;
    remove: string;
    addedOn: string;
  };
  history: {
    title: string;
    subtitle: string;
    readMore: string;
  };
  recipes: {
    title: string;
    subtitle: string;
    ingredients: string;
    instructions: string;
    prepTime: string;
    cookTime: string;
    servings: string;
    difficulty: string;
  };
  profile: {
    title: string;
    subtitle: string;
    accountInfo: string;
    preferences: string;
    language: string;
    theme: string;
    notifications: string;
    statistics: string;
    fortunesGenerated: string;
    favoritesSaved: string;
  };
  auth: {
    signInTitle: string;
    signInSubtitle: string;
    signInWithGoogle: string;
    signOutConfirm: string;
    welcomeBack: string;
    guestUser: string;
  };
  errors: {
    pageNotFound: string;
    pageNotFoundMessage: string;
    serverError: string;
    serverErrorMessage: string;
    networkError: string;
    networkErrorMessage: string;
    goHome: string;
  };
  seo: {
    homeTitle: string;
    homeDescription: string;
    generatorTitle: string;
    generatorDescription: string;
    messagesTitle: string;
    messagesDescription: string;
    browseTitle: string;
    browseDescription: string;
  };
}

// Cache for loaded translations
const translationCache: Partial<Record<Locale, TranslationFile>> = {};

/**
 * Load translations for a specific locale
 * Uses dynamic imports for code splitting
 */
export async function loadTranslations(
  locale: Locale,
): Promise<TranslationFile> {
  // Return cached translations if available
  if (translationCache[locale]) {
    return translationCache[locale];
  }

  try {
    // Dynamic import based on locale
    let translations: TranslationFile;

    switch (locale) {
      case "en":
        translations = (await import("@/locales/en.json"))
          .default as TranslationFile;
        break;
      case "zh":
        translations = (await import("@/locales/zh.json"))
          .default as TranslationFile;
        break;
      case "es":
        translations = (await import("@/locales/es.json"))
          .default as TranslationFile;
        break;
      case "pt":
        translations = (await import("@/locales/pt.json"))
          .default as TranslationFile;
        break;
      default:
        // Fallback to English
        translations = (await import("@/locales/en.json"))
          .default as TranslationFile;
    }

    // Cache the translations
    translationCache[locale] = translations;

    return translations;
  } catch (error) {
    console.error(`Failed to load translations for locale: ${locale}`, error);

    // Fallback to English
    if (locale !== "en") {
      return loadTranslations("en");
    }

    throw error;
  }
}

/**
 * Get a nested translation value by key path
 * @param translations - The translations object
 * @param key - Dot-separated key path (e.g., "common.loading")
 * @param params - Optional parameters for interpolation
 */
export function getTranslation(
  translations: TranslationFile,
  key: string,
  params?: Record<string, string | number>,
): string {
  const keys = key.split(".");
  let value: unknown = translations;

  for (const k of keys) {
    if (value && typeof value === "object" && k in value) {
      value = (value as Record<string, unknown>)[k];
    } else {
      console.warn(`Translation key not found: ${key}`);
      return key;
    }
  }

  if (typeof value !== "string") {
    console.warn(`Translation value is not a string: ${key}`);
    return key;
  }

  // Handle parameter interpolation
  if (params) {
    return interpolate(value, params);
  }

  return value;
}

/**
 * Interpolate parameters into a translation string
 * @param text - The translation string with placeholders like {name}
 * @param params - The parameters to interpolate
 */
function interpolate(
  text: string,
  params: Record<string, string | number>,
): string {
  return text.replace(/\{(\w+)\}/g, (match, key) => {
    if (key in params) {
      return String(params[key]);
    }
    return match;
  });
}

/**
 * Create a translation function for a specific locale
 * Server-side usage
 */
export async function createTranslator(locale: Locale) {
  const translations = await loadTranslations(locale);

  return function t(
    key: string,
    params?: Record<string, string | number>,
  ): string {
    return getTranslation(translations, key, params);
  };
}

/**
 * Get default locale from i18n config
 */
export function getDefaultLocale(): Locale {
  return i18n.defaultLocale;
}

/**
 * Check if a locale is supported
 */
export function isSupportedLocale(locale: string): locale is Locale {
  return i18n.locales.includes(locale as Locale);
}

/**
 * Get all supported locales
 */
export function getSupportedLocales(): readonly Locale[] {
  return i18n.locales;
}

/**
 * Detect preferred locale from Accept-Language header
 */
export function detectLocaleFromHeader(acceptLanguage: string | null): Locale {
  if (!acceptLanguage) {
    return i18n.defaultLocale;
  }

  // Parse Accept-Language header
  const languages = acceptLanguage
    .split(",")
    .map((lang) => {
      const [code, quality] = lang.trim().split(";q=");
      return {
        code: code?.toLowerCase() ?? "",
        quality: quality ? parseFloat(quality) : 1,
      };
    })
    .sort((a, b) => b.quality - a.quality);

  // Find the first supported locale
  for (const { code } of languages) {
    // Check exact match
    if (isSupportedLocale(code)) {
      return code;
    }

    // Check language code without region (e.g., "en-US" -> "en")
    const languageCode = code.split("-")[0];
    if (languageCode && isSupportedLocale(languageCode)) {
      return languageCode;
    }
  }

  return i18n.defaultLocale;
}

// ============================================================================
// Server-Side Translation Utilities
// ============================================================================

/**
 * Server-side translation context type
 * Used for passing translations to server components
 */
export interface ServerTranslationContext {
  locale: Locale;
  translations: TranslationFile;
  t: (key: string, params?: Record<string, string | number>) => string;
  getLocalizedHref: (path: string) => string;
}

/**
 * Create a server-side translation context
 * This should be used in Server Components for SSR translation
 */
export async function createServerTranslationContext(
  locale: Locale,
): Promise<ServerTranslationContext> {
  const translations = await loadTranslations(locale);

  const t = (key: string, params?: Record<string, string | number>): string => {
    return getTranslation(translations, key, params);
  };

  const getLocalizedHref = (path: string): string => {
    if (locale === i18n.defaultLocale) {
      return path;
    }
    // Ensure path starts with /
    const normalizedPath = path.startsWith("/") ? path : `/${path}`;
    return `/${locale}${normalizedPath}`;
  };

  return {
    locale,
    translations,
    t,
    getLocalizedHref,
  };
}

/**
 * Synchronous translation function for use when translations are already loaded
 * Useful for Server Components that receive translations as props
 */
export function createSyncTranslator(translations: TranslationFile) {
  return function t(
    key: string,
    params?: Record<string, string | number>,
  ): string {
    return getTranslation(translations, key, params);
  };
}

/**
 * Get localized href helper function
 * Returns a function that prefixes paths with locale for non-default locales
 */
export function createLocalizedHrefHelper(locale: Locale) {
  return function getLocalizedHref(path: string): string {
    if (locale === i18n.defaultLocale) {
      return path;
    }
    const normalizedPath = path.startsWith("/") ? path : `/${path}`;
    return `/${locale}${normalizedPath}`;
  };
}

/**
 * Batch translation helper
 * Translates multiple keys at once for better performance
 */
export function translateBatch(
  translations: TranslationFile,
  keys: string[],
): Record<string, string> {
  const result: Record<string, string> = {};
  for (const key of keys) {
    result[key] = getTranslation(translations, key);
  }
  return result;
}

/**
 * Get translation namespace
 * Returns all translations under a specific namespace (e.g., "navigation", "common")
 */
export function getTranslationNamespace<K extends keyof TranslationFile>(
  translations: TranslationFile,
  namespace: K,
): TranslationFile[K] {
  return translations[namespace];
}

/**
 * Type-safe translation key type
 * Generates union type of all possible translation keys
 */
export type TranslationKey =
  | `common.${keyof TranslationFile["common"]}`
  | `navigation.${keyof TranslationFile["navigation"]}`
  | `footer.${keyof TranslationFile["footer"]}`
  | `home.${keyof TranslationFile["home"]}`
  | `generator.${keyof TranslationFile["generator"]}`
  | `generator.themes.${keyof TranslationFile["generator"]["themes"]}`
  | `dailyFortune.${keyof TranslationFile["dailyFortune"]}`
  | `dailyFortune.dimensions.${keyof TranslationFile["dailyFortune"]["dimensions"]}`
  | `dailyFortune.ratings.${keyof TranslationFile["dailyFortune"]["ratings"]}`
  | `messages.${keyof TranslationFile["messages"]}`
  | `browse.${keyof TranslationFile["browse"]}`
  | `favorites.${keyof TranslationFile["favorites"]}`
  | `history.${keyof TranslationFile["history"]}`
  | `recipes.${keyof TranslationFile["recipes"]}`
  | `profile.${keyof TranslationFile["profile"]}`
  | `auth.${keyof TranslationFile["auth"]}`
  | `errors.${keyof TranslationFile["errors"]}`
  | `seo.${keyof TranslationFile["seo"]}`;

/**
 * Type-safe translation function
 * Provides autocomplete for translation keys
 */
export function getTypedTranslation(
  translations: TranslationFile,
  key: TranslationKey,
  params?: Record<string, string | number>,
): string {
  return getTranslation(translations, key, params);
}
