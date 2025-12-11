/**
 * Blog Data Layer
 *
 * Utilities for reading and parsing MDX blog posts from the file system.
 * This implements a "Local File-based CMS" approach for maximum performance
 * with static site generation (SSG).
 *
 * NOTE: This module uses Node.js fs/path and should only be imported in server components.
 */

import fs from "fs";
import path from "path";
import matter from "gray-matter";

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

// Default posts per page
export const POSTS_PER_PAGE = 9;

// Import types for internal use
import type { BlogPostFrontmatter, BlogPost, BlogPostMeta } from "./blog-types";

// Blog posts directory
const POSTS_DIRECTORY = path.join(process.cwd(), "content/blog");

/**
 * Calculate reading time in minutes
 */
function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const words = content.trim().split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
}

/**
 * Ensure posts directory exists
 */
function ensurePostsDirectory(): boolean {
  try {
    if (!fs.existsSync(POSTS_DIRECTORY)) {
      fs.mkdirSync(POSTS_DIRECTORY, { recursive: true });
    }
    return true;
  } catch {
    return false;
  }
}

/**
 * Get all blog post slugs for static generation
 */
export function getAllPostSlugs(): string[] {
  ensurePostsDirectory();

  try {
    const files = fs.readdirSync(POSTS_DIRECTORY);
    return files
      .filter((file) => /\.(mdx?|md)$/.test(file))
      .map((file) => file.replace(/\.(mdx?|md)$/, ""));
  } catch {
    return [];
  }
}

/**
 * Get all blog posts metadata (sorted by date, newest first)
 */
export function getBlogPosts(options?: {
  tag?: string;
  limit?: number;
  includeDrafts?: boolean;
}): BlogPostMeta[] {
  ensurePostsDirectory();

  const { tag, limit, includeDrafts = false } = options || {};

  try {
    const files = fs.readdirSync(POSTS_DIRECTORY);
    const posts: BlogPostMeta[] = [];

    for (const file of files) {
      if (!/\.(mdx?|md)$/.test(file)) continue;

      const slug = file.replace(/\.(mdx?|md)$/, "");
      const filePath = path.join(POSTS_DIRECTORY, file);
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
        readingTime: calculateReadingTime(content),
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
 */
export function getPostBySlug(slug: string): BlogPost | null {
  ensurePostsDirectory();

  // Try both .mdx and .md extensions
  const extensions = [".mdx", ".md"];

  for (const ext of extensions) {
    const filePath = path.join(POSTS_DIRECTORY, `${slug}${ext}`);

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
          readingTime: calculateReadingTime(content),
        };
      } catch {
        return null;
      }
    }
  }

  return null;
}

/**
 * Get all unique tags from all posts
 */
export function getAllTags(): { tag: string; count: number }[] {
  const posts = getBlogPosts({ includeDrafts: false });
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
 */
export function getFeaturedPosts(limit = 3): BlogPostMeta[] {
  return getBlogPosts({ includeDrafts: false })
    .filter((post) => post.featured)
    .slice(0, limit);
}

/**
 * Get related posts by tags
 */
export function getRelatedPosts(
  currentSlug: string,
  tags: string[],
  limit = 3,
): BlogPostMeta[] {
  const allPosts = getBlogPosts({ includeDrafts: false });

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
 */
export function getBlogStats(): {
  totalPosts: number;
  totalTags: number;
  latestPostDate: string | null;
} {
  const posts = getBlogPosts({ includeDrafts: false });
  const tags = getAllTags();

  const firstPost = posts[0];
  return {
    totalPosts: posts.length,
    totalTags: tags.length,
    latestPostDate: firstPost ? firstPost.date : null,
  };
}

/**
 * Get paginated blog posts (sorted by date, newest first)
 */
export function getPaginatedBlogPosts(options?: {
  tag?: string;
  page?: number;
  perPage?: number;
  includeDrafts?: boolean;
}): PaginatedBlogPosts {
  const {
    tag,
    page = 1,
    perPage = POSTS_PER_PAGE,
    includeDrafts = false,
  } = options || {};

  // Get all posts (already sorted by date, newest first)
  const allPosts = getBlogPosts({ tag, includeDrafts });

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
