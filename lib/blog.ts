/**
 * Blog Data Layer (Multi-Language Support)
 *
 * Utilities for reading and parsing MDX blog posts from the file system.
 * This implements a "Local File-based CMS" approach for maximum performance
 * with static site generation (SSG).
 *
 * Directory Structure:
 *   content/blog/
 *   ├── en/   (English - default)
 *   ├── zh/   (Chinese)
 *   ├── es/   (Spanish)
 *   └── pt/   (Portuguese)
 *
 * NOTE: This module uses Node.js fs/path and should only be imported in server components.
 */

import fs from "fs";
import path from "path";
import matter from "gray-matter";

import { type Locale, i18n } from "./i18n-config";

// Re-export types from the types file for convenience
export type { BlogPostFrontmatter, BlogPost, BlogPostMeta } from "./blog-types";

/**
 * Pagination result type
 */
export interface PaginatedBlogPosts {
  posts: BlogPostMeta[];
  totalPosts: number;
  totalPages: number;
  currentPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

/**
 * Available translations for a blog post
 */
export interface BlogPostTranslations {
  slug: string;
  availableLocales: Locale[];
  defaultLocale: Locale;
}

// Default posts per page
export const POSTS_PER_PAGE = 9;

// Import types for internal use
import type { BlogPost, BlogPostMeta } from "./blog-types";

// Base blog posts directory
const BLOG_BASE_DIRECTORY = path.join(process.cwd(), "content/blog");

/**
 * Get the posts directory for a specific locale
 */
function getPostsDirectory(locale: Locale = i18n.defaultLocale): string {
  return path.join(BLOG_BASE_DIRECTORY, locale);
}

/**
 * Calculate reading time in minutes
 * Adjusts for different languages (Chinese reads faster per character)
 */
function calculateReadingTime(content: string, locale: Locale = "en"): number {
  // Chinese has higher information density per character
  const wordsPerMinute = locale === "zh" ? 500 : 200;

  if (locale === "zh") {
    // For Chinese, count characters instead of words
    const characters = content.replace(/\s/g, "").length;
    return Math.ceil(characters / wordsPerMinute);
  }

  const words = content.trim().split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
}

/**
 * Ensure posts directory exists for a locale
 */
function ensurePostsDirectory(locale: Locale = i18n.defaultLocale): boolean {
  const dir = getPostsDirectory(locale);
  try {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    return true;
  } catch {
    return false;
  }
}

/**
 * Check if a locale directory exists and has posts
 */
function localeHasPosts(locale: Locale): boolean {
  const dir = getPostsDirectory(locale);
  try {
    if (!fs.existsSync(dir)) return false;
    const files = fs.readdirSync(dir);
    return files.some((file) => /\.(mdx?|md)$/.test(file));
  } catch {
    return false;
  }
}

/**
 * Get all blog post slugs for static generation
 * @param locale - The locale to get slugs for (defaults to default locale)
 */
export function getAllPostSlugs(locale: Locale = i18n.defaultLocale): string[] {
  ensurePostsDirectory(locale);

  try {
    const dir = getPostsDirectory(locale);
    const files = fs.readdirSync(dir);
    return files
      .filter((file) => /\.(mdx?|md)$/.test(file))
      .map((file) => file.replace(/\.(mdx?|md)$/, ""));
  } catch {
    return [];
  }
}

/**
 * Get all localized slugs for static generation
 * Returns an array of { slug, locale } for generateStaticParams
 */
export function getAllLocalizedSlugs(): { slug: string; locale: Locale }[] {
  const result: { slug: string; locale: Locale }[] = [];

  for (const locale of i18n.locales) {
    const slugs = getAllPostSlugs(locale);

    for (const slug of slugs) {
      result.push({ slug, locale });
    }
  }

  return result;
}

/**
 * Get available translations for a specific post
 * @param slug - The post slug to check translations for
 */
export function getAvailableTranslations(slug: string): BlogPostTranslations {
  const availableLocales: Locale[] = [];

  for (const locale of i18n.locales) {
    const dir = getPostsDirectory(locale);
    const extensions = [".mdx", ".md"];

    for (const ext of extensions) {
      const filePath = path.join(dir, `${slug}${ext}`);
      if (fs.existsSync(filePath)) {
        availableLocales.push(locale);
        break;
      }
    }
  }

  return {
    slug,
    availableLocales,
    defaultLocale: i18n.defaultLocale,
  };
}

/**
 * Get all blog posts metadata (sorted by date, newest first)
 * @param options.locale - The locale to get posts for (defaults to default locale)
 * @param options.tag - Filter by tag
 * @param options.limit - Limit number of results
 * @param options.includeDrafts - Include draft posts
 */
export function getBlogPosts(options?: {
  locale?: Locale;
  tag?: string;
  limit?: number;
  includeDrafts?: boolean;
}): BlogPostMeta[] {
  const {
    locale = i18n.defaultLocale,
    tag,
    limit,
    includeDrafts = false,
  } = options || {};

  ensurePostsDirectory(locale);

  try {
    const dir = getPostsDirectory(locale);
    const files = fs.readdirSync(dir);
    const posts: BlogPostMeta[] = [];

    for (const file of files) {
      if (!/\.(mdx?|md)$/.test(file)) continue;

      const slug = file.replace(/\.(mdx?|md)$/, "");
      const filePath = path.join(dir, file);
      const fileContent = fs.readFileSync(filePath, "utf-8");
      const { data, content } = matter(fileContent);

      // Skip drafts in production unless explicitly included
      if (
        data.draft &&
        !includeDrafts &&
        process.env.NODE_ENV === "production"
      ) {
        continue;
      }

      // Filter by tag if specified
      if (tag && (!data.tags || !data.tags.includes(tag))) {
        continue;
      }

      posts.push({
        slug,
        title: data.title || "Untitled",
        description: data.description || "",
        date: data.date || new Date().toISOString(),
        author: data.author || "Fortune Cookie AI",
        tags: data.tags || [],
        image: data.image,
        featured: data.featured || false,
        draft: data.draft || false,
        readingTime: calculateReadingTime(content, locale),
      });
    }

    // Sort by date (newest first)
    posts.sort((a, b) => {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });

    // Apply limit if specified
    if (limit && limit > 0) {
      return posts.slice(0, limit);
    }

    return posts;
  } catch {
    return [];
  }
}

/**
 * Get a single blog post by slug
 * @param slug - The post slug
 * @param locale - The locale (defaults to default locale)
 */
export function getPostBySlug(
  slug: string,
  locale: Locale = i18n.defaultLocale,
): BlogPost | null {
  ensurePostsDirectory(locale);

  const dir = getPostsDirectory(locale);
  const extensions = [".mdx", ".md"];

  for (const ext of extensions) {
    const filePath = path.join(dir, `${slug}${ext}`);

    if (fs.existsSync(filePath)) {
      try {
        const fileContent = fs.readFileSync(filePath, "utf-8");
        const { data, content } = matter(fileContent);

        return {
          slug,
          title: data.title || "Untitled",
          description: data.description || "",
          date: data.date || new Date().toISOString(),
          author: data.author || "Fortune Cookie AI",
          tags: data.tags || [],
          image: data.image,
          featured: data.featured || false,
          draft: data.draft || false,
          content,
          readingTime: calculateReadingTime(content, locale),
        };
      } catch {
        return null;
      }
    }
  }

  // Fallback: try to get from default locale if not found in requested locale
  if (locale !== i18n.defaultLocale) {
    return getPostBySlug(slug, i18n.defaultLocale);
  }

  return null;
}

/**
 * Get all unique tags from all posts
 * @param locale - The locale to get tags for (defaults to default locale)
 */
export function getAllTags(
  locale: Locale = i18n.defaultLocale,
): { tag: string; count: number }[] {
  const posts = getBlogPosts({ locale, includeDrafts: false });
  const tagCounts = new Map<string, number>();

  for (const post of posts) {
    for (const tag of post.tags) {
      tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1);
    }
  }

  return Array.from(tagCounts.entries())
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count);
}

/**
 * Get featured posts
 * @param limit - Maximum number of posts to return
 * @param locale - The locale (defaults to default locale)
 */
export function getFeaturedPosts(
  limit = 3,
  locale: Locale = i18n.defaultLocale,
): BlogPostMeta[] {
  return getBlogPosts({ locale, includeDrafts: false })
    .filter((post) => post.featured)
    .slice(0, limit);
}

/**
 * Get related posts by tags
 * @param currentSlug - The current post slug to exclude
 * @param tags - Tags to match against
 * @param limit - Maximum number of posts to return
 * @param locale - The locale (defaults to default locale)
 */
export function getRelatedPosts(
  currentSlug: string,
  tags: string[],
  limit = 3,
  locale: Locale = i18n.defaultLocale,
): BlogPostMeta[] {
  const allPosts = getBlogPosts({ locale, includeDrafts: false });

  return allPosts
    .filter((post) => post.slug !== currentSlug)
    .map((post) => ({
      post,
      relevance: post.tags.filter((tag) => tags.includes(tag)).length,
    }))
    .filter((item) => item.relevance > 0)
    .sort((a, b) => b.relevance - a.relevance)
    .slice(0, limit)
    .map((item) => item.post);
}

/**
 * Get blog statistics
 * @param locale - The locale (defaults to default locale)
 */
export function getBlogStats(locale: Locale = i18n.defaultLocale): {
  totalPosts: number;
  totalTags: number;
  latestPostDate: string | null;
} {
  const posts = getBlogPosts({ locale, includeDrafts: false });
  const tags = getAllTags(locale);

  const firstPost = posts[0];
  return {
    totalPosts: posts.length,
    totalTags: tags.length,
    latestPostDate: firstPost ? firstPost.date : null,
  };
}

/**
 * Get paginated blog posts (sorted by date, newest first)
 * @param options.locale - The locale (defaults to default locale)
 * @param options.tag - Filter by tag
 * @param options.page - Page number (1-indexed)
 * @param options.perPage - Posts per page
 * @param options.includeDrafts - Include draft posts
 */
export function getPaginatedBlogPosts(options?: {
  locale?: Locale;
  tag?: string;
  page?: number;
  perPage?: number;
  includeDrafts?: boolean;
}): PaginatedBlogPosts {
  const {
    locale = i18n.defaultLocale,
    tag,
    page = 1,
    perPage = POSTS_PER_PAGE,
    includeDrafts = false,
  } = options || {};

  // Get all posts (already sorted by date, newest first)
  const allPosts = getBlogPosts({ locale, tag, includeDrafts });

  const totalPosts = allPosts.length;
  const totalPages = Math.ceil(totalPosts / perPage);
  const currentPage = Math.max(1, Math.min(page, totalPages || 1));

  // Calculate pagination slice
  const startIndex = (currentPage - 1) * perPage;
  const endIndex = startIndex + perPage;
  const posts = allPosts.slice(startIndex, endIndex);

  return {
    posts,
    totalPosts,
    totalPages,
    currentPage,
    hasNextPage: currentPage < totalPages,
    hasPrevPage: currentPage > 1,
  };
}

/**
 * Get all available locales that have blog posts
 */
export function getAvailableBlogLocales(): Locale[] {
  return i18n.locales.filter((locale) => localeHasPosts(locale));
}

/**
 * Get post count per locale (useful for admin/stats)
 */
export function getBlogPostCountByLocale(): Record<Locale, number> {
  const counts = {} as Record<Locale, number>;

  for (const locale of i18n.locales) {
    counts[locale] = getAllPostSlugs(locale).length;
  }

  return counts;
}
