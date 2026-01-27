/**
 * Multi-Language Blog List Page
 *
 * Displays blog posts for the specified locale with optional tag filtering.
 * Optimized for SEO with proper metadata and structured data.
 */

import { Metadata } from "next";
import Link from "next/link";
import { BookOpen, Tag, TrendingUp } from "lucide-react";
import {
  getPaginatedBlogPosts,
  getAllTags,
  getFeaturedPosts,
  getAvailableBlogLocales,
  POSTS_PER_PAGE,
} from "@/lib/blog";
import { BlogCard, Pagination } from "@/components/blog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { getSiteUrl, getImageUrl } from "@/lib/site";
import {
  type Locale,
  i18n,
  isValidLocale,
  generateAlternateLanguages,
  languages,
} from "@/lib/i18n-config";
import { loadTranslations } from "@/lib/translations";
import { BreadcrumbStructuredData } from "@/components/StructuredData";
import { notFound } from "next/navigation";
import { BlogLanguageSwitcher } from "@/components/blog/BlogLanguageSwitcher";

const baseUrl = getSiteUrl();

interface PageParams {
  locale: string;
}

interface MetadataProps {
  params: Promise<PageParams>;
  searchParams: Promise<{ tag?: string; page?: string }>;
}

export async function generateMetadata({
  params,
  searchParams,
}: MetadataProps): Promise<Metadata> {
  const { locale } = await params;
  const search = await searchParams;

  if (!isValidLocale(locale)) {
    return { title: "Not Found" };
  }

  const t = await loadTranslations(locale);
  const currentPage = Math.max(1, parseInt(search.page || "1", 10) || 1);
  const selectedTag = search.tag;

  // Build canonical URL
  const canonicalParams = new URLSearchParams();
  if (selectedTag) canonicalParams.set("tag", selectedTag);
  if (currentPage > 1) canonicalParams.set("page", String(currentPage));
  const canonicalQuery = canonicalParams.toString();

  const basePath = locale === i18n.defaultLocale ? "/blog" : `/${locale}/blog`;
  const canonicalUrl = canonicalQuery
    ? `${basePath}?${canonicalQuery}`
    : basePath;

  // Dynamic title based on locale/page/tag
  const blogTitle = t.navigation?.blog || "Blog";
  const titleParts = [blogTitle];
  if (selectedTag) titleParts.push(`#${selectedTag}`);
  if (currentPage > 1) titleParts.push(`Page ${currentPage}`);
  titleParts.push(t.common?.siteName || "Fortune Cookie AI");
  const title = titleParts.join(" - ");

  const description = selectedTag
    ? `${t.seo?.messagesDescription || "Explore articles"} - ${selectedTag}`
    : t.seo?.browseDescription ||
      "Explore articles about fortune cookies, luck, wisdom, and cultural insights.";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      url: `${baseUrl}${canonicalUrl}`,
      locale: languages[locale].hreflang.replace("-", "_"),
      images: [{ url: getImageUrl("/og-image.png"), width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [getImageUrl("/twitter-image.png")],
    },
    alternates: {
      canonical: canonicalUrl,
      languages: generateAlternateLanguages(
        canonicalQuery ? `/blog?${canonicalQuery}` : "/blog",
        baseUrl,
      ),
    },
  };
}

/**
 * Generate static params for all locales
 */
export function generateStaticParams() {
  return i18n.locales.map((locale) => ({ locale }));
}

interface BlogPageProps {
  params: Promise<PageParams>;
  searchParams: Promise<{ tag?: string; page?: string }>;
}

export default async function LocaleBlogPage({
  params,
  searchParams,
}: BlogPageProps) {
  const { locale } = await params;
  const search = await searchParams;

  if (!isValidLocale(locale)) {
    notFound();
  }

  const t = await loadTranslations(locale);
  const selectedTag = search.tag;
  const currentPage = Math.max(1, parseInt(search.page || "1", 10) || 1);

  const basePath = locale === i18n.defaultLocale ? "/blog" : `/${locale}/blog`;

  // Build canonical URL for breadcrumbs
  const canonicalParams = new URLSearchParams();
  if (selectedTag) canonicalParams.set("tag", selectedTag);
  if (currentPage > 1) canonicalParams.set("page", String(currentPage));
  const canonicalQuery = canonicalParams.toString();
  const canonicalUrl = canonicalQuery
    ? `${basePath}?${canonicalQuery}`
    : basePath;

  // Breadcrumb items
  const homeLabel = t.navigation?.home || "Home";
  const blogLabel = t.navigation?.blog || "Blog";
  const homePath = locale === i18n.defaultLocale ? "/" : `/${locale}`;

  const breadcrumbItems: Array<{ name: string; url: string }> = [
    { name: homeLabel, url: homePath },
    { name: blogLabel, url: basePath },
  ];
  if (selectedTag) {
    breadcrumbItems.push({
      name: `#${selectedTag}`,
      url: `${basePath}?tag=${encodeURIComponent(selectedTag)}`,
    });
  }
  if (currentPage > 1) {
    breadcrumbItems.push({ name: `Page ${currentPage}`, url: canonicalUrl });
  }

  // Get paginated posts for the locale
  const {
    posts: regularPosts,
    totalPosts,
    totalPages,
    hasNextPage,
    hasPrevPage,
  } = getPaginatedBlogPosts({
    locale: locale as Locale,
    tag: selectedTag,
    page: currentPage,
    perPage: POSTS_PER_PAGE,
  });

  // Only show featured posts on first page without tag filter
  const featuredPosts =
    selectedTag || currentPage > 1 ? [] : getFeaturedPosts(2, locale as Locale);
  const allTags = getAllTags(locale as Locale);
  const availableLocales = getAvailableBlogLocales();

  // Build search params for pagination links
  const paginationSearchParams: Record<string, string> = {};
  if (selectedTag) {
    paginationSearchParams.tag = selectedTag;
  }

  // Build prev/next URLs for SEO
  const buildPageUrl = (page: number) => {
    const urlParams = new URLSearchParams();
    if (selectedTag) urlParams.set("tag", selectedTag);
    if (page > 1) urlParams.set("page", String(page));
    const query = urlParams.toString();
    return query ? `${baseUrl}${basePath}?${query}` : `${baseUrl}${basePath}`;
  };

  const prevUrl = hasPrevPage ? buildPageUrl(currentPage - 1) : null;
  const nextUrl = hasNextPage ? buildPageUrl(currentPage + 1) : null;

  // Translations for UI
  const featuredLabel = t.home?.features?.feature1 || "Featured Articles";
  const allArticlesLabel = t.browse?.title || "All Articles";
  const clearFilterLabel = t.messages?.filters?.clearAll || "Clear filter";
  const noArticlesLabel =
    t.messages?.results?.noResultsTitle || "No articles found";
  const comingSoonLabel = t.common?.loading || "Coming Soon";
  const tagsLabel = t.messages?.tagsLabel || "Tags";

  return (
    <>
      {/* SEO Pagination Links */}
      {prevUrl && <link rel="prev" href={prevUrl} />}
      {nextUrl && <link rel="next" href={nextUrl} />}
      <BreadcrumbStructuredData items={breadcrumbItems} />

      <main className="min-h-screen w-full overflow-x-hidden relative bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50">
        <div className="relative z-10">
          <div className="container mx-auto px-4 py-8">
            {/* Header */}
            <header className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-amber-600 via-yellow-600 to-orange-600 bg-clip-text text-transparent mb-4">
                {blogLabel}
              </h1>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-6">
                {t.navigation?.blogDescription ||
                  "Discover the fascinating world of fortune cookies - from their surprising history to homemade recipes and the psychology of luck."}
              </p>

              {/* Language Switcher */}
              {availableLocales.length > 1 && (
                <BlogLanguageSwitcher
                  currentLocale={locale as Locale}
                  availableLocales={availableLocales}
                  basePath="/blog"
                  searchParams={search}
                />
              )}
            </header>

            <div className="grid lg:grid-cols-4 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-3 space-y-8">
                {/* Featured Posts */}
                {featuredPosts.length > 0 && !selectedTag && (
                  <section>
                    <div className="flex items-center gap-2 mb-4">
                      <TrendingUp className="w-5 h-5 text-amber-600" />
                      <h2 className="text-xl font-semibold text-gray-800">
                        {featuredLabel}
                      </h2>
                    </div>
                    <div className="grid md:grid-cols-2 gap-6">
                      {featuredPosts.map((post) => (
                        <BlogCard
                          key={post.slug}
                          post={post}
                          variant="featured"
                          locale={locale as Locale}
                        />
                      ))}
                    </div>
                  </section>
                )}

                {/* All Posts */}
                <section>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-5 h-5 text-amber-600" />
                      <h2 className="text-xl font-semibold text-gray-800">
                        {selectedTag ? `#${selectedTag}` : allArticlesLabel}
                      </h2>
                      {totalPosts > 0 && (
                        <span className="text-sm text-gray-500">
                          ({totalPosts}{" "}
                          {totalPosts === 1 ? "article" : "articles"}
                          {totalPages > 1 &&
                            `, page ${currentPage} of ${totalPages}`}
                          )
                        </span>
                      )}
                    </div>
                    {selectedTag && (
                      <Link
                        href={basePath}
                        className="text-sm text-amber-600 hover:text-amber-700 underline"
                      >
                        {clearFilterLabel}
                      </Link>
                    )}
                  </div>

                  {regularPosts.length > 0 ? (
                    <>
                      <div className="grid md:grid-cols-2 gap-6">
                        {regularPosts.map((post) => (
                          <BlogCard
                            key={post.slug}
                            post={post}
                            locale={locale as Locale}
                          />
                        ))}
                      </div>

                      {/* Pagination */}
                      {totalPages > 1 && (
                        <div className="mt-8">
                          <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            basePath={basePath}
                            searchParams={paginationSearchParams}
                          />
                        </div>
                      )}
                    </>
                  ) : (
                    <Card className="bg-white/90 backdrop-blur-sm border-amber-200">
                      <CardContent className="py-12 text-center">
                        <p className="text-6xl mb-4">📝</p>
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">
                          {selectedTag ? noArticlesLabel : comingSoonLabel}
                        </h3>
                        <p className="text-gray-600">
                          {selectedTag
                            ? `No articles found with the tag "${selectedTag}".`
                            : "We're working on exciting content. Check back soon!"}
                        </p>
                      </CardContent>
                    </Card>
                  )}
                </section>
              </div>

              {/* Sidebar */}
              <aside className="space-y-6">
                {/* Tags */}
                {allTags.length > 0 && (
                  <Card className="bg-white/90 backdrop-blur-sm border-amber-200 sticky top-4">
                    <CardHeader className="pb-3">
                      <div className="flex items-center gap-2">
                        <Tag className="w-4 h-4 text-amber-600" />
                        <h3 className="font-semibold text-gray-800">
                          {tagsLabel}
                        </h3>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {allTags.map(({ tag, count }) => (
                          <Link
                            key={tag}
                            href={`${basePath}?tag=${encodeURIComponent(tag)}`}
                          >
                            <Badge
                              variant={
                                selectedTag === tag ? "default" : "outline"
                              }
                              className={
                                selectedTag === tag
                                  ? "bg-amber-500 hover:bg-amber-600"
                                  : "bg-amber-50 border-amber-200 text-amber-700 hover:bg-amber-100"
                              }
                            >
                              {tag} ({count})
                            </Badge>
                          </Link>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </aside>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
