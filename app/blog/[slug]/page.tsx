/**
 * Blog Post Detail Page
 *
 * Renders individual blog posts using MDX with full SEO optimization.
 * Uses Static Site Generation (SSG) for optimal performance.
 */

import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { MDXRemote } from 'next-mdx-remote/rsc'
import { Calendar, Clock, User, ArrowLeft, Tag } from 'lucide-react'
import { getAllPostSlugs, getPostBySlug, getRelatedPosts } from '@/lib/blog'
import { mdxComponents } from '@/components/blog/MDXComponents'
import { BlogCard } from '@/components/blog'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { getSiteUrl } from '@/lib/site'
import { ArticleStructuredData } from '@/components/StructuredData'
import dynamic from 'next/dynamic'

const DynamicBackgroundEffects = dynamic(
  () => import('@/components/BackgroundEffects').then(mod => mod.BackgroundEffects),
  { ssr: false }
)

const baseUrl = getSiteUrl()

interface BlogPostPageProps {
  params: Promise<{ slug: string }>
}

/**
 * Generate static params for all blog posts (SSG)
 */
export async function generateStaticParams() {
  const slugs = getAllPostSlugs()
  return slugs.map((slug) => ({ slug }))
}

/**
 * Generate metadata for the blog post
 */
export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params
  const post = getPostBySlug(slug)

  if (!post) {
    return {
      title: 'Post Not Found',
    }
  }

  return {
    title: post.title,
    description: post.description,
    authors: [{ name: post.author }],
    openGraph: {
      title: post.title,
      description: post.description,
      type: 'article',
      url: `${baseUrl}/blog/${slug}`,
      images: post.image
        ? [{ url: post.image.startsWith('http') ? post.image : `${baseUrl}${post.image}` }]
        : [{ url: `${baseUrl}/og-image.png` }],
      publishedTime: post.date,
      authors: [post.author],
      tags: post.tags,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
    },
    alternates: {
      canonical: `/blog/${slug}`,
    },
  }
}

function formatDate(dateString: string): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(dateString))
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params
  const post = getPostBySlug(slug)

  if (!post) {
    notFound()
  }

  const relatedPosts = getRelatedPosts(slug, post.tags, 3)

  return (
    <main className="min-h-screen w-full overflow-x-hidden relative">
      <DynamicBackgroundEffects />

      {/* Article Structured Data */}
      <ArticleStructuredData
        headline={post.title}
        description={post.description}
        url={`/blog/${slug}`}
        image={post.image}
        datePublished={post.date}
        dateModified={post.date}
        author={post.author}
        keywords={post.tags}
      />

      <div className="relative z-10">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          {/* Back Link */}
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-amber-600 hover:text-amber-700 mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Blog
          </Link>

          {/* Article Header */}
          <header className="mb-8">
            {/* Tags */}
            {post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {post.tags.map((tag) => (
                  <Link key={tag} href={`/blog?tag=${encodeURIComponent(tag)}`}>
                    <Badge
                      variant="outline"
                      className="bg-amber-50 border-amber-200 text-amber-700 hover:bg-amber-100"
                    >
                      <Tag className="w-3 h-3 mr-1" />
                      {tag}
                    </Badge>
                  </Link>
                ))}
              </div>
            )}

            {/* Title */}
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 leading-tight">
              {post.title}
            </h1>

            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-4 text-gray-600">
              <span className="flex items-center gap-1">
                <User className="w-4 h-4" />
                {post.author}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {formatDate(post.date)}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {post.readingTime} min read
              </span>
            </div>
          </header>

          {/* Article Content */}
          <article className="prose prose-amber prose-lg max-w-none mb-12">
            <MDXRemote source={post.content} components={mdxComponents} />
          </article>

          {/* Related Posts */}
          {relatedPosts.length > 0 && (
            <section className="border-t border-amber-200 pt-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                Related Articles
              </h2>
              <div className="grid md:grid-cols-3 gap-6">
                {relatedPosts.map((relatedPost) => (
                  <BlogCard
                    key={relatedPost.slug}
                    post={relatedPost}
                    variant="compact"
                  />
                ))}
              </div>
            </section>
          )}

          {/* CTA Section */}
          <Card className="mt-12 bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200">
            <CardContent className="py-8 text-center">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                🥠 Try Your Luck!
              </h3>
              <p className="text-gray-600 mb-4">
                Generate your own personalized fortune cookie message
              </p>
              <Link
                href="/generator"
                className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                Open Fortune Cookie
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  )
}

