/**
 * Blog Types
 *
 * Type definitions for blog posts, separated from the data layer
 * to allow client components to import types without loading server-only code.
 */

/**
 * Blog post frontmatter schema
 */
export interface BlogPostFrontmatter {
  title: string
  description: string
  date: string
  author: string
  tags: string[]
  image?: string
  featured?: boolean
  draft?: boolean
}

/**
 * Complete blog post with content
 */
export interface BlogPost extends BlogPostFrontmatter {
  slug: string
  content: string
  readingTime: number
}

/**
 * Blog post metadata (without content, for list views)
 */
export interface BlogPostMeta extends BlogPostFrontmatter {
  slug: string
  readingTime: number
}

