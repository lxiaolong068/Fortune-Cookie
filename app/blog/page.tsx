/**
 * Blog List Page
 *
 * Displays all blog posts with optional tag filtering.
 * Optimized for SEO with proper metadata and structured data.
 */

import { Metadata } from "next";
import Link from "next/link";
import { BookOpen, Tag, TrendingUp } from "lucide-react";
import {
  getPaginatedBlogPosts,
  getAllTags,
  getFeaturedPosts,
  POSTS_PER_PAGE,
} from "@/lib/blog";
import { BlogCard, Pagination } from "@/components/blog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { getSiteUrl, getImageUrl } from "@/lib/site";
import { BreadcrumbStructuredData } from "@/components/StructuredData";

const baseUrl = getSiteUrl();

interface MetadataProps {
  searchParams: Promise<{ tag?: string; page?: string }>;
}

export async function generateMetadata({
  searchParams,
}: MetadataProps): Promise<Metadata> {
  const params = await searchParams;
  const currentPage = Math.max(1, parseInt(params.page || "1", 10) || 1);
  const selectedTag = params.tag;

  // Build canonical URL
  const canonicalParams = new URLSearchParams();
  if (selectedTag) canonicalParams.set("tag", selectedTag);
  if (currentPage > 1) canonicalParams.set("page", String(currentPage));
  const canonicalQuery = canonicalParams.toString();
  const canonicalUrl = canonicalQuery ? `/blog?${canonicalQuery}` : "/blog";

  // Note: rel="prev" and rel="next" links are added in the page component
  // since we need totalPages from getPaginatedBlogPosts

  // Dynamic title based on page/tag
  const titleParts = ["Blog"];
  if (selectedTag) titleParts.push(`Tagged "${selectedTag}"`);
  if (currentPage > 1) titleParts.push(`Page ${currentPage}`);
  titleParts.push("Fortune Cookie Wisdom & Insights");
  const title = titleParts.join(" - ");

  const description = selectedTag
    ? `Explore articles tagged "${selectedTag}" about fortune cookies, luck, wisdom, and cultural insights.`
    : "Explore articles about fortune cookies, luck, wisdom, and the fascinating history behind these iconic treats. Discover tips, recipes, and cultural insights.";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      url: `${baseUrl}${canonicalUrl}`,
      images: [{ url: getImageUrl("/og-image.png"), width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [getImageUrl("/twitter-image.png")],
      creator: "@fortunecookieai",
    },
    alternates: {
      canonical: canonicalUrl,
    },
    robots: currentPage > 1 ? { index: true, follow: true } : undefined,
  };
}

interface BlogPageProps {
  searchParams: Promise<{ tag?: string; page?: string }>;
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const params = await searchParams;
  const selectedTag = params.tag;
  const currentPage = Math.max(1, parseInt(params.page || "1", 10) || 1);

  const canonicalParams = new URLSearchParams();
  if (selectedTag) canonicalParams.set("tag", selectedTag);
  if (currentPage > 1) canonicalParams.set("page", String(currentPage));
  const canonicalQuery = canonicalParams.toString();
  const canonicalUrl = canonicalQuery ? `/blog?${canonicalQuery}` : "/blog";

  const breadcrumbItems: Array<{ name: string; url: string }> = [
    { name: "Home", url: "/" },
    { name: "Blog", url: "/blog" },
  ];
  if (selectedTag) {
    const tagParams = new URLSearchParams({ tag: selectedTag });
    breadcrumbItems.push({
      name: `Tag: ${selectedTag}`,
      url: `/blog?${tagParams.toString()}`,
    });
  }
  if (currentPage > 1) {
    breadcrumbItems.push({ name: `Page ${currentPage}`, url: canonicalUrl });
  }

  // Get paginated posts (filtered by tag if specified, sorted by date newest first)
  const {
    posts: regularPosts,
    totalPosts,
    totalPages,
    hasNextPage,
    hasPrevPage,
  } = getPaginatedBlogPosts({
    tag: selectedTag,
    page: currentPage,
    perPage: POSTS_PER_PAGE,
  });

  // Only show featured posts on first page without tag filter
  const featuredPosts =
    selectedTag || currentPage > 1 ? [] : getFeaturedPosts(2);
  const allTags = getAllTags();

  // Build search params for pagination links
  const paginationSearchParams: Record<string, string> = {};
  if (selectedTag) {
    paginationSearchParams.tag = selectedTag;
  }

  // Build prev/next URLs for SEO link tags
  const buildPageUrl = (page: number) => {
    const urlParams = new URLSearchParams();
    if (selectedTag) urlParams.set("tag", selectedTag);
    if (page > 1) urlParams.set("page", String(page));
    const query = urlParams.toString();
    return query ? `${baseUrl}/blog?${query}` : `${baseUrl}/blog`;
  };

  const prevUrl = hasPrevPage ? buildPageUrl(currentPage - 1) : null;
  const nextUrl = hasNextPage ? buildPageUrl(currentPage + 1) : null;

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
                Fortune Cookie Blog
              </h1>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Discover the fascinating world of fortune cookies - from their
                surprising history to homemade recipes and the psychology of
                luck.
              </p>
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
                        Featured Articles
                      </h2>
                    </div>
                    <div className="grid md:grid-cols-2 gap-6">
                      {featuredPosts.map((post) => (
                        <BlogCard
                          key={post.slug}
                          post={post}
                          variant="featured"
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
                        {selectedTag
                          ? `Articles tagged "${selectedTag}"`
                          : "All Articles"}
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
                        href="/blog"
                        className="text-sm text-amber-600 hover:text-amber-700 underline"
                      >
                        Clear filter
                      </Link>
                    )}
                  </div>

                  {regularPosts.length > 0 ? (
                    <>
                      <div className="grid md:grid-cols-2 gap-6">
                        {regularPosts.map((post) => (
                          <BlogCard key={post.slug} post={post} />
                        ))}
                      </div>

                      {/* Pagination */}
                      {totalPages > 1 && (
                        <div className="mt-8">
                          <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            basePath="/blog"
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
                          {selectedTag ? "No articles found" : "Coming Soon"}
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
                        <h3 className="font-semibold text-gray-800">Tags</h3>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {allTags.map(({ tag, count }) => (
                          <Link
                            key={tag}
                            href={`/blog?tag=${encodeURIComponent(tag)}`}
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
