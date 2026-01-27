/**
 * Multi-Language Blog Post Detail Page
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
import {
  getAllLocalizedSlugs,
  getPostBySlug,
  getRelatedPosts,
  getAvailableTranslations,
} from "@/lib/blog";
import { mdxComponents } from "@/components/blog/MDXComponents";
import { BlogCard } from "@/components/blog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { getSiteUrl, getImageUrl } from "@/lib/site";
import { getBlobUrl } from "@/lib/blob-urls";
import { type Locale, i18n, isValidLocale, languages } from "@/lib/i18n-config";
import { loadTranslations } from "@/lib/translations";
import {
  ArticleStructuredData,
  BreadcrumbStructuredData,
} from "@/components/StructuredData";
import { DynamicBackgroundEffects } from "@/components/DynamicBackgroundEffects";
import { BlogLanguageSwitcher } from "@/components/blog/BlogLanguageSwitcher";

const baseUrl = getSiteUrl();

interface PageParams {
  locale: string;
  slug: string;
}

interface BlogPostPageProps {
  params: Promise<PageParams>;
}

/**
 * Generate static params for all blog posts in all locales
 */
export async function generateStaticParams() {
  const localizedSlugs = getAllLocalizedSlugs();
  return localizedSlugs.map(({ slug, locale }) => ({
    locale,
    slug,
  }));
}

/**
 * Generate metadata for the blog post
 */
export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { locale, slug } = await params;

  if (!isValidLocale(locale)) {
    return { title: "Not Found" };
  }

  const post = getPostBySlug(slug, locale as Locale);

  if (!post) {
    return { title: "Post Not Found" };
  }

  const basePath = locale === i18n.defaultLocale ? "" : `/${locale}`;
  const postUrl = `${basePath}/blog/${slug}`;

  // Get available translations for alternate links
  const translations = getAvailableTranslations(slug);
  const alternateLinks: Record<string, string> = {};

  for (const loc of translations.availableLocales) {
    const langConfig = languages[loc];
    const localePath = loc === i18n.defaultLocale ? "" : `/${loc}`;
    alternateLinks[langConfig.hreflang] =
      `${baseUrl}${localePath}/blog/${slug}`;
  }
  alternateLinks["x-default"] = `${baseUrl}/blog/${slug}`;

  return {
    title: post.title,
    description: post.description,
    authors: [{ name: post.author }],
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      url: `${baseUrl}${postUrl}`,
      locale: languages[locale as Locale].hreflang.replace("-", "_"),
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
    },
    alternates: {
      canonical: postUrl,
      languages: alternateLinks,
    },
  };
}

function formatDate(dateString: string, locale: Locale): string {
  const localeMap: Record<Locale, string> = {
    en: "en-US",
    zh: "zh-CN",
    es: "es-ES",
    pt: "pt-BR",
  };

  return new Intl.DateTimeFormat(localeMap[locale], {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(dateString));
}

export default async function LocaleBlogPostPage({
  params,
}: BlogPostPageProps) {
  const { locale, slug } = await params;

  if (!isValidLocale(locale)) {
    notFound();
  }

  const post = getPostBySlug(slug, locale as Locale);

  if (!post) {
    notFound();
  }

  const t = await loadTranslations(locale as Locale);
  const relatedPosts = getRelatedPosts(slug, post.tags, 3, locale as Locale);
  const translations = getAvailableTranslations(slug);

  // Build paths
  const basePath = locale === i18n.defaultLocale ? "" : `/${locale}`;
  const blogListPath = `${basePath}/blog`;
  const homePath = locale === i18n.defaultLocale ? "/" : `/${locale}`;

  // Translations
  const homeLabel = t.navigation?.home || "Home";
  const blogLabel = t.navigation?.blog || "Blog";
  const backToBlogLabel = t.common?.back || "Back to Blog";
  const relatedArticlesLabel =
    t.messages?.category?.relatedLabel || "Related Articles";
  const tryYourLuckLabel = t.home?.ctaButton || "Try Your Luck!";
  const openFortuneLabel = t.home?.tapToOpen || "Open Fortune Cookie";
  const minReadLabel = "min read";

  return (
    <main className="min-h-screen w-full overflow-x-hidden relative">
      <DynamicBackgroundEffects />

      {/* Structured Data */}
      <ArticleStructuredData
        headline={post.title}
        description={post.description}
        url={`${basePath}/blog/${slug}`}
        image={post.image}
        datePublished={post.date}
        dateModified={post.date}
        author={post.author}
        keywords={post.tags}
        locale={locale}
      />
      <BreadcrumbStructuredData
        items={[
          { name: homeLabel, url: homePath },
          { name: blogLabel, url: blogListPath },
          { name: post.title, url: `${basePath}/blog/${slug}` },
        ]}
      />

      <div className="relative z-10">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          {/* Back Link */}
          <Link
            href={blogListPath}
            className="inline-flex items-center gap-2 text-gray-600 hover:text-amber-600 mb-8 transition-colors group font-medium"
          >
            <div className="p-2 bg-white dark:bg-gray-800 rounded-full shadow-sm group-hover:shadow-md transition-all border border-gray-100 dark:border-gray-700">
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            </div>
            {backToBlogLabel}
          </Link>

          {/* Language Switcher for this article */}
          {translations.availableLocales.length > 1 && (
            <div className="mb-6">
              <BlogLanguageSwitcher
                currentLocale={locale as Locale}
                availableLocales={translations.availableLocales}
                basePath={`/blog/${slug}`}
                variant="compact"
              />
            </div>
          )}

          {/* Article Header */}
          <header className="mb-12 text-center max-w-3xl mx-auto">
            {/* Tags */}
            {post.tags.length > 0 && (
              <div className="flex flex-wrap justify-center gap-2 mb-6">
                {post.tags.map((tag) => (
                  <Link
                    key={tag}
                    href={`${blogListPath}?tag=${encodeURIComponent(tag)}`}
                  >
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
                <time dateTime={post.date}>
                  {formatDate(post.date, locale as Locale)}
                </time>
              </div>
              <div className="w-1 h-1 bg-gray-300 dark:bg-gray-700 rounded-full" />
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>
                  {post.readingTime} {minReadLabel}
                </span>
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
                <span
                  className="text-8xl"
                  role="img"
                  aria-label="Fortune cookie"
                >
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
                {relatedArticlesLabel}
              </h2>
              <div className="grid md:grid-cols-3 gap-6">
                {relatedPosts.map((relatedPost) => (
                  <BlogCard
                    key={relatedPost.slug}
                    post={relatedPost}
                    variant="compact"
                    locale={locale as Locale}
                  />
                ))}
              </div>
            </section>
          )}

          {/* CTA Section */}
          <Card className="mt-12 bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200">
            <CardContent className="py-8 text-center">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                🥠 {tryYourLuckLabel}
              </h3>
              <p className="text-gray-600 mb-4">
                {t.home?.heroDescription ||
                  "Generate your own personalized fortune cookie message"}
              </p>
              <Link
                href={`${basePath}/generator`}
                className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                {openFortuneLabel}
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
