/**
 * Blog Types (Multi-Language Support)
 *
 * Type definitions for blog posts, separated from the data layer
 * to allow client components to import types without loading server-only code.
 */

import type { Locale } from "./i18n-config";

/**
 * Blog post frontmatter schema
 */
export interface BlogPostFrontmatter {
  title: string;
  description: string;
  date: string;
  author: string;
  tags: string[];
  image?: string;
  featured?: boolean;
  draft?: boolean;
}

/**
 * Complete blog post with content
 */
export interface BlogPost extends BlogPostFrontmatter {
  slug: string;
  content: string;
  readingTime: number;
}

/**
 * Blog post metadata (without content, for list views)
 */
export interface BlogPostMeta extends BlogPostFrontmatter {
  slug: string;
  readingTime: number;
}

/**
 * Localized blog post with locale information
 */
export interface LocalizedBlogPost extends BlogPost {
  locale: Locale;
  availableTranslations: Locale[];
}

/**
 * Localized blog post metadata
 */
export interface LocalizedBlogPostMeta extends BlogPostMeta {
  locale: Locale;
}

/**
 * Blog post translation status
 */
export interface BlogPostTranslationStatus {
  slug: string;
  translations: {
    locale: Locale;
    exists: boolean;
    title?: string;
    lastModified?: string;
  }[];
}

/**
 * Blog translation progress statistics
 */
export interface BlogTranslationStats {
  totalPosts: number;
  translatedPosts: Record<Locale, number>;
  pendingTranslations: Record<Locale, number>;
  completionPercentage: Record<Locale, number>;
}

/**
 * Parameters for generating static blog pages
 */
export interface BlogStaticParams {
  slug: string;
  locale?: Locale;
}

/**
 * Blog page props with locale support
 */
export interface BlogPageProps {
  params: {
    slug: string;
    locale?: Locale;
  };
  searchParams?: Record<string, string | string[] | undefined>;
}

/**
 * Blog list page props with locale support
 */
export interface BlogListPageProps {
  params: {
    locale?: Locale;
  };
  searchParams?: {
    page?: string;
    tag?: string;
  };
}
