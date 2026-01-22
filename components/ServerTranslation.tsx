/**
 * Server-Side Translation Components
 *
 * These components enable pure server-side rendering of translated content
 * for improved SEO and performance. They don't require JavaScript on the client.
 */

import { type ReactNode } from "react";
import Link from "next/link";
import {
  type TranslationFile,
  getTranslation,
  createSyncTranslator,
} from "@/lib/translations";
import { type Locale, i18n } from "@/lib/i18n-config";

// ============================================================================
// Types
// ============================================================================

export interface ServerTranslationProps {
  translations: TranslationFile;
  locale: Locale;
}

export interface TranslatedTextProps {
  translations: TranslationFile;
  tKey: string;
  params?: Record<string, string | number>;
  as?: keyof JSX.IntrinsicElements;
  className?: string;
}

export interface LocalizedLinkProps {
  href: string;
  locale: Locale;
  children: ReactNode;
  className?: string;
  prefetch?: boolean;
  replace?: boolean;
  scroll?: boolean;
  [key: string]: unknown;
}

// ============================================================================
// Server Components
// ============================================================================

/**
 * Server-side translated text component
 * Renders translated text directly on the server without client-side hydration
 */
export function TranslatedText({
  translations,
  tKey,
  params,
  as: Component = "span",
  className,
}: TranslatedTextProps) {
  const text = getTranslation(translations, tKey, params);
  return <Component className={className}>{text}</Component>;
}

/**
 * Server-side localized link component
 * Automatically prefixes href with locale for non-default locales
 */
export function LocalizedLink({
  href,
  locale,
  children,
  className,
  prefetch,
  replace,
  scroll,
  ...props
}: LocalizedLinkProps) {
  // Don't prefix for default locale or external links
  const isExternal = href.startsWith("http") || href.startsWith("//");
  const localizedHref = isExternal || locale === i18n.defaultLocale
    ? href
    : `/${locale}${href.startsWith("/") ? href : `/${href}`}`;

  return (
    <Link
      href={localizedHref}
      className={className}
      prefetch={prefetch}
      replace={replace}
      scroll={scroll}
      {...props}
    >
      {children}
    </Link>
  );
}

/**
 * Server-side translation provider for passing context to child components
 * This is a simple wrapper that passes translations as a render prop
 */
export function ServerTranslationProvider({
  translations,
  locale,
  children,
}: ServerTranslationProps & { children: (ctx: ServerTranslationContext) => ReactNode }) {
  const t = createSyncTranslator(translations);

  const getLocalizedHref = (path: string): string => {
    if (locale === i18n.defaultLocale) {
      return path;
    }
    const normalizedPath = path.startsWith("/") ? path : `/${path}`;
    return `/${locale}${normalizedPath}`;
  };

  const ctx: ServerTranslationContext = {
    locale,
    translations,
    t,
    getLocalizedHref,
  };

  return <>{children(ctx)}</>;
}

export interface ServerTranslationContext {
  locale: Locale;
  translations: TranslationFile;
  t: (key: string, params?: Record<string, string | number>) => string;
  getLocalizedHref: (path: string) => string;
}

// ============================================================================
// Helper Functions for Server Components
// ============================================================================

/**
 * Create translation helpers for a server component
 * Returns t function and getLocalizedHref helper
 */
export function createServerTranslationHelpers(
  translations: TranslationFile,
  locale: Locale
): ServerTranslationContext {
  const t = (key: string, params?: Record<string, string | number>): string => {
    return getTranslation(translations, key, params);
  };

  const getLocalizedHref = (path: string): string => {
    if (locale === i18n.defaultLocale) {
      return path;
    }
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
 * Server-side translated heading component
 */
export function TranslatedHeading({
  translations,
  tKey,
  params,
  level = 1,
  className,
}: TranslatedTextProps & { level?: 1 | 2 | 3 | 4 | 5 | 6 }) {
  const text = getTranslation(translations, tKey, params);
  const Tag = `h${level}` as keyof JSX.IntrinsicElements;
  return <Tag className={className}>{text}</Tag>;
}

/**
 * Server-side translated paragraph component
 */
export function TranslatedParagraph({
  translations,
  tKey,
  params,
  className,
}: Omit<TranslatedTextProps, "as">) {
  const text = getTranslation(translations, tKey, params);
  return <p className={className}>{text}</p>;
}

/**
 * Server-side translated button text (for use inside buttons)
 */
export function TranslatedButtonText({
  translations,
  tKey,
  params,
}: Omit<TranslatedTextProps, "as" | "className">) {
  return getTranslation(translations, tKey, params);
}

/**
 * Server-side conditional translation
 * Renders different content based on translation key existence
 */
export function TranslatedConditional({
  translations,
  tKey,
  params,
  fallback,
  children,
}: TranslatedTextProps & {
  fallback?: ReactNode;
  children?: (text: string) => ReactNode;
}) {
  const text = getTranslation(translations, tKey, params);

  // If translation returns the key itself, it means it wasn't found
  if (text === tKey && fallback !== undefined) {
    return <>{fallback}</>;
  }

  if (children) {
    return <>{children(text)}</>;
  }

  return <>{text}</>;
}

/**
 * Server-side translated list
 * Renders a list of translated items
 */
export function TranslatedList({
  translations,
  tKeys,
  params,
  as: Component = "ul",
  itemAs: ItemComponent = "li",
  className,
  itemClassName,
}: {
  translations: TranslationFile;
  tKeys: string[];
  params?: Record<string, string | number>;
  as?: "ul" | "ol";
  itemAs?: "li" | "span" | "div";
  className?: string;
  itemClassName?: string;
}) {
  return (
    <Component className={className}>
      {tKeys.map((key) => (
        <ItemComponent key={key} className={itemClassName}>
          {getTranslation(translations, key, params)}
        </ItemComponent>
      ))}
    </Component>
  );
}

// ============================================================================
// Metadata Helpers for Server Components
// ============================================================================

/**
 * Get translated metadata for a page
 */
export function getTranslatedMetadata(
  translations: TranslationFile,
  titleKey: string,
  descriptionKey: string,
  params?: Record<string, string | number>
) {
  return {
    title: getTranslation(translations, titleKey, params),
    description: getTranslation(translations, descriptionKey, params),
  };
}

/**
 * Get translated Open Graph metadata
 */
export function getTranslatedOGMetadata(
  translations: TranslationFile,
  titleKey: string,
  descriptionKey: string,
  params?: Record<string, string | number>
) {
  return {
    title: getTranslation(translations, titleKey, params),
    description: getTranslation(translations, descriptionKey, params),
  };
}
