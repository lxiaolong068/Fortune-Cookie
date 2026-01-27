/**
 * Blog List Page
 *
 * Displays all blog posts with optional tag filtering.
 * Optimized for SEO with proper metadata and structured data.
 * Updated with modern UI design matching homepage style.
 */

import { Metadata } from "next";
import {
  getPaginatedBlogPosts,
  getAllTags,
  getFeaturedPosts,
  POSTS_PER_PAGE,
} from "@/lib/blog";
import { getSiteUrl, getImageUrl } from "@/lib/site";
import { generateAlternateLanguages } from "@/lib/i18n-config";
import { BreadcrumbStructuredData } from "@/components/StructuredData";
import { BlogPageContent } from "./BlogPageContent";

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
      languages: generateAlternateLanguages(canonicalUrl, baseUrl),
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

  // Get paginated posts
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

      <BlogPageContent
        featuredPosts={featuredPosts}
        regularPosts={regularPosts}
        allTags={allTags}
        selectedTag={selectedTag}
        currentPage={currentPage}
        totalPosts={totalPosts}
        totalPages={totalPages}
        hasNextPage={hasNextPage}
        hasPrevPage={hasPrevPage}
        paginationSearchParams={paginationSearchParams}
      />
    </>
  );
}
