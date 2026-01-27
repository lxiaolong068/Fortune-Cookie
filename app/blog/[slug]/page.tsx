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
            className="inline-flex items-center gap-2 text-slate-600 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 mb-8 transition-colors group font-medium underline-offset-4 hover:underline"
          >
            <div className="p-2 bg-white dark:bg-gray-800 rounded-full shadow-sm group-hover:shadow-md transition-all border border-gray-100 dark:border-gray-700">
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            </div>
            Back to Blog
          </Link>

          {/* Article Header */}
          <div className="blog-header-card mb-12 max-w-3xl mx-auto">
            <header className="text-center">
              {/* Tags */}
              {post.tags.length > 0 && (
                <div className="flex flex-wrap justify-center gap-2 mb-6">
                  {post.tags.map((tag) => (
                    <Link key={tag} href={`/blog?tag=${encodeURIComponent(tag)}`}>
                      <Badge
                        variant="secondary"
                        className="bg-indigo-100 text-slate-900 hover:bg-indigo-200 dark:bg-indigo-900/40 dark:text-slate-100 border-transparent px-3 py-1 text-sm font-medium transition-colors"
                      >
                        <Tag className="w-3 h-3 mr-1.5" />
                        {tag}
                      </Badge>
                    </Link>
                  ))}
                </div>
              )}

              {/* Title - 恢复暗色模式可读性 */}
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 dark:text-slate-50 mb-6 leading-[1.2] tracking-tight">
                {post.title}
              </h1>

              {/* Meta Info - 提升次要信息对比度 */}
              <div className="flex flex-wrap items-center justify-center gap-6 text-slate-600 dark:text-slate-400 text-sm md:text-base font-medium">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-slate-100 dark:bg-slate-800 rounded-full">
                    <User className="w-4 h-4" />
                  </div>
                  <span>{post.author}</span>
                </div>
                <div className="w-1 h-1 bg-slate-400 dark:bg-slate-600 rounded-full" />
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <time dateTime={post.date}>{formatDate(post.date)}</time>
                </div>
                <div className="w-1 h-1 bg-slate-400 dark:bg-slate-600 rounded-full" />
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>{post.readingTime} min read</span>
                </div>
              </div>
            </header>
          </div>

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

          {/* Article Content - 优化 prose 配置以提升可读性 */}
          <article className="blog-article-content prose prose-lg max-w-3xl mx-auto mb-16">
            <MDXRemote source={post.content} components={mdxComponents} />
          </article>

          {/* Related Posts */}
          {relatedPosts.length > 0 && (
            <section className="border-t border-slate-200 dark:border-slate-700 pt-8">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-50 mb-6">
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
          <Card className="mt-12 bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-950/30 dark:to-blue-950/30 border-indigo-200 dark:border-indigo-800">
            <CardContent className="py-8 text-center">
              <h3 className="text-xl font-bold text-slate-900 dark:text-slate-50 mb-2">
                🥠 Try Your Luck!
              </h3>
              <p className="text-slate-700 dark:text-slate-300 mb-4 font-medium">
                Generate your own personalized fortune cookie message
              </p>
              <Link
                href="/generator"
                className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium transition-colors shadow-lg hover:shadow-xl"
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
