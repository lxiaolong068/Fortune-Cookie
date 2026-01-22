"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  type Locale,
  i18n,
  isValidLocale,
  getLocaleFromPath,
  getLocalizedPath,
  pathConfig,
} from "./i18n-config";
import {
  type TranslationFile,
  loadTranslations,
  getTranslation,
} from "./translations";

interface LocaleContextType {
  locale: Locale;
  translations: TranslationFile | null;
  isLoading: boolean;
  t: (key: string, params?: Record<string, string | number>) => string;
  setLocale: (locale: Locale) => void;
  getLocalizedHref: (path: string) => string;
}

const LocaleContext = createContext<LocaleContextType | null>(null);

interface LocaleProviderProps {
  children: ReactNode;
  initialLocale?: Locale;
  initialTranslations?: TranslationFile;
}

export function LocaleProvider({
  children,
  initialLocale,
  initialTranslations,
}: LocaleProviderProps) {
  const pathname = usePathname();
  const router = useRouter();

  // Determine current locale from path or initial value
  const { locale: pathLocale } = getLocaleFromPath(pathname);
  const [locale, setLocaleState] = useState<Locale>(
    initialLocale ?? pathLocale
  );
  const [translations, setTranslations] = useState<TranslationFile | null>(
    initialTranslations ?? null
  );
  const [isLoading, setIsLoading] = useState(!initialTranslations);

  // Load translations when locale changes
  useEffect(() => {
    let isMounted = true;

    async function loadLocaleTranslations() {
      if (initialTranslations && locale === initialLocale) {
        return;
      }

      setIsLoading(true);
      try {
        const loaded = await loadTranslations(locale);
        if (isMounted) {
          setTranslations(loaded);
        }
      } catch (error) {
        console.error("Failed to load translations:", error);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadLocaleTranslations();

    return () => {
      isMounted = false;
    };
  }, [locale, initialLocale, initialTranslations]);

  // Update locale when path changes
  useEffect(() => {
    const { locale: newPathLocale } = getLocaleFromPath(pathname);
    if (newPathLocale !== locale) {
      setLocaleState(newPathLocale);
    }
  }, [pathname, locale]);

  // Translation function
  const t = useCallback(
    (key: string, params?: Record<string, string | number>): string => {
      if (!translations) {
        return key;
      }
      return getTranslation(translations, key, params);
    },
    [translations]
  );

  // Set locale and navigate
  const setLocale = useCallback(
    (newLocale: Locale) => {
      if (!isValidLocale(newLocale) || newLocale === locale) {
        return;
      }

      // Update cookie
      document.cookie = `${pathConfig.detection.cookieName}=${newLocale};path=/;max-age=${pathConfig.detection.cookieMaxAge}`;

      // Get current path without locale prefix
      const { pathname: currentPath } = getLocaleFromPath(pathname);

      // Navigate to new localized path
      const newPath = getLocalizedPath(currentPath, newLocale);
      router.push(newPath);

      setLocaleState(newLocale);
    },
    [locale, pathname, router]
  );

  // Get localized href for links
  const getLocalizedHref = useCallback(
    (path: string): string => {
      return getLocalizedPath(path, locale);
    },
    [locale]
  );

  const value: LocaleContextType = {
    locale,
    translations,
    isLoading,
    t,
    setLocale,
    getLocalizedHref,
  };

  return (
    <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
  );
}

/**
 * Hook to access locale context
 */
export function useLocale(): LocaleContextType {
  const context = useContext(LocaleContext);

  if (!context) {
    throw new Error("useLocale must be used within a LocaleProvider");
  }

  return context;
}

/**
 * Hook for translation function only
 */
export function useTranslation() {
  const { t, locale, isLoading } = useLocale();
  return { t, locale, isLoading };
}

/**
 * Get static params for all locales (for generateStaticParams)
 */
export function getLocaleStaticParams() {
  return i18n.locales.map((locale) => ({ locale }));
}
