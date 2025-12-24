/**
 * Blog Post Detail Page
 *
 * Renders individual blog posts using MDX with full SEO optimization.
 * Uses Static Site Generation (SSG) for optimal performance.
 */

import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { MDXRemote } from "next-mdx-remote/rsc";
import { Calendar, Clock, User, ArrowLeft, Tag } from "lucide-react";
import { getAllPostSlugs, getPostBySlug, getRelatedPosts } from "@/lib/blog";
import { mdxComponents } from "@/components/blog/MDXComponents";
import { BlogCard } from "@/components/blog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { getSiteUrl, getImageUrl } from "@/lib/site";
import { getBlobUrl } from "@/lib/blob-urls";
import {
  ArticleStructuredData,
  BreadcrumbStructuredData,
} from "@/components/StructuredData";
import { DynamicBackgroundEffects } from "@/components/DynamicBackgroundEffects";

const baseUrl = getSiteUrl();

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

/**
 * Generate static params for all blog posts (SSG)
 */
export async function generateStaticParams() {
  const slugs = getAllPostSlugs();
  return slugs.map((slug) => ({ slug }));
}

/**
 * Generate metadata for the blog post
 */
export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    return {
      title: "Post Not Found",
    };
  }

  return {
    title: post.title,
    description: post.description,
    authors: [{ name: post.author }],
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      url: `${baseUrl}/blog/${slug}`,
      images: post.image
        ? [{ url: getImageUrl(post.image) }]
        : [{ url: getImageUrl("/og-image.png") }],
      publishedTime: post.date,
      authors: [post.author],
      tags: post.tags,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
      images: post.image
        ? [getImageUrl(post.image)]
        : [getImageUrl("/twitter-image.png")],
      creator: "@fortunecookieai",
    },
    alternates: {
      canonical: `/blog/${slug}`,
    },
  };
}

function formatDate(dateString: string): string {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(dateString));
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const relatedPosts = getRelatedPosts(slug, post.tags, 3);

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
      <BreadcrumbStructuredData
        items={[
          { name: "Home", url: "/" },
          { name: "Blog", url: "/blog" },
          { name: post.title, url: `/blog/${slug}` },
        ]}
      />

      <div className="relative z-10">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          {/* Back Link */}
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-amber-600 mb-8 transition-colors group font-medium"
          >
            <div className="p-2 bg-white dark:bg-gray-800 rounded-full shadow-sm group-hover:shadow-md transition-all border border-gray-100 dark:border-gray-700">
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            </div>
            Back to Blog
          </Link>

          {/* Article Header */}
          <header className="mb-12 text-center max-w-3xl mx-auto">
            {/* Tags */}
            {post.tags.length > 0 && (
              <div className="flex flex-wrap justify-center gap-2 mb-6">
                {post.tags.map((tag) => (
                  <Link key={tag} href={`/blog?tag=${encodeURIComponent(tag)}`}>
                    <Badge
                      variant="secondary"
                      className="bg-amber-100 text-amber-800 hover:bg-amber-200 border-transparent px-3 py-1 text-sm transition-colors"
                    >
                      <Tag className="w-3 h-3 mr-1.5" />
                      {tag}
                    </Badge>
                  </Link>
                ))}
              </div>
            )}

            {/* Title */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-gray-50 mb-6 leading-tight tracking-tight">
              {post.title}
            </h1>

            {/* Meta Info */}
            <div className="flex flex-wrap items-center justify-center gap-6 text-gray-600 dark:text-gray-400 text-sm md:text-base">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-gray-100 dark:bg-gray-800 rounded-full">
                  <User className="w-4 h-4" />
                </div>
                <span className="font-medium">{post.author}</span>
              </div>
              <div className="w-1 h-1 bg-gray-300 dark:bg-gray-700 rounded-full" />
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <time dateTime={post.date}>{formatDate(post.date)}</time>
              </div>
              <div className="w-1 h-1 bg-gray-300 dark:bg-gray-700 rounded-full" />
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>{post.readingTime} min read</span>
              </div>
            </div>
          </header>

          {/* Cover Image */}
          <div className="mb-12 max-w-3xl mx-auto">
            {post.image && post.image.length > 0 ? (
              <div className="relative aspect-[16/9] overflow-hidden rounded-2xl shadow-lg bg-gradient-to-br from-amber-100 to-orange-100">
                <Image
                  src={getBlobUrl(post.image)}
                  alt={`Cover image for ${post.title}`}
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 896px"
                />
              </div>
            ) : (
              <div className="relative aspect-[16/9] overflow-hidden rounded-2xl shadow-lg bg-gradient-to-br from-amber-200 via-yellow-100 to-orange-200 flex items-center justify-center">
                <span className="text-8xl" role="img" aria-label="Fortune cookie">
                  🥠
                </span>
              </div>
            )}
          </div>

          {/* Article Content */}
          <article className="prose prose-lg prose-amber dark:prose-invert max-w-3xl mx-auto mb-16 prose-headings:font-bold prose-h1:text-4xl prose-h2:text-3xl prose-h3:text-2xl prose-img:rounded-xl prose-img:shadow-lg prose-a:text-amber-600 hover:prose-a:text-amber-700 prose-blockquote:border-l-amber-500 prose-blockquote:bg-amber-50/50 dark:prose-blockquote:bg-amber-900/10 prose-blockquote:py-1 prose-blockquote:px-4 prose-blockquote:not-italic">
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
  );
}
