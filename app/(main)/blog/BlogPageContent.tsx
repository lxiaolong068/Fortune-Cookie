"use client";

import Link from "next/link";
import { BookOpen, Tag, TrendingUp, Sparkles } from "lucide-react";
import { BlogCard, Pagination } from "@/components/blog";
import { Badge } from "@/components/ui/badge";
import { PageLayout, PageSection } from "@/components/PageLayout";
import { PageHero, HeroBadge } from "@/components/PageHero";
import {
  ModernCard,
  ModernCardHeader,
  ModernCardContent,
  ModernCardIcon,
} from "@/components/ui/modern-card";
import type { BlogPostMeta } from "@/lib/blog-types";

interface BlogPageContentProps {
  featuredPosts: BlogPostMeta[];
  regularPosts: BlogPostMeta[];
  allTags: { tag: string; count: number }[];
  selectedTag?: string;
  currentPage: number;
  totalPosts: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  paginationSearchParams: Record<string, string>;
}

export function BlogPageContent({
  featuredPosts,
  regularPosts,
  allTags,
  selectedTag,
  currentPage,
  totalPosts,
  totalPages,
}: BlogPageContentProps) {
  const paginationSearchParams: Record<string, string> = {};
  if (selectedTag) {
    paginationSearchParams.tag = selectedTag;
  }

  return (
    <PageLayout background="subtle" gradient="indigo" headerOffset={false}>
      {/* Hero Section */}
      <PageHero
        title="Fortune Cookie Blog"
        subtitle="Wisdom & Insights"
        description="Discover the fascinating world of fortune cookies - from their surprising history to homemade recipes and the psychology of luck."
        icon={BookOpen}
        iconGradient={{ from: "from-indigo-500", to: "to-purple-500" }}
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Blog" }]}
        badge={<HeroBadge icon={Sparkles}>{totalPosts} Articles</HeroBadge>}
        size="md"
      />

      {/* Main Content */}
      <PageSection padding="lg" bg="transparent">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">
            {/* Featured Posts */}
            {featuredPosts.length > 0 && !selectedTag && (
              <section>
                <div className="flex items-center gap-3 mb-6">
                  <ModernCardIcon
                    gradientFrom="from-amber-500"
                    gradientTo="to-orange-500"
                    size="sm"
                  >
                    <TrendingUp className="w-4 h-4 text-white" />
                  </ModernCardIcon>
                  <h2 className="text-xl font-heading font-semibold text-slate-800 dark:text-white">
                    Featured Articles
                  </h2>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  {featuredPosts.map((post) => (
                    <BlogCard key={post.slug} post={post} variant="featured" />
                  ))}
                </div>
              </section>
            )}

            {/* All Posts */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <ModernCardIcon
                    gradientFrom="from-indigo-500"
                    gradientTo="to-purple-500"
                    size="sm"
                  >
                    <BookOpen className="w-4 h-4 text-white" />
                  </ModernCardIcon>
                  <div>
                    <h2 className="text-xl font-heading font-semibold text-slate-800 dark:text-white">
                      {selectedTag
                        ? `Articles tagged "${selectedTag}"`
                        : "All Articles"}
                    </h2>
                    {totalPosts > 0 && (
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        {totalPosts} {totalPosts === 1 ? "article" : "articles"}
                        {totalPages > 1 &&
                          ` · Page ${currentPage} of ${totalPages}`}
                      </p>
                    )}
                  </div>
                </div>
                {selectedTag && (
                  <Link
                    href="/blog"
                    className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-medium transition-colors"
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
                <ModernCard variant="glass" className="py-12 text-center">
                  <p className="text-6xl mb-4">📝</p>
                  <h3 className="text-xl font-heading font-semibold text-slate-800 dark:text-white mb-2">
                    {selectedTag ? "No articles found" : "Coming Soon"}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-300">
                    {selectedTag
                      ? `No articles found with the tag "${selectedTag}".`
                      : "We're working on exciting content. Check back soon!"}
                  </p>
                </ModernCard>
              )}
            </section>
          </div>

          {/* Sidebar */}
          <aside className="space-y-6">
            {/* Tags */}
            {allTags.length > 0 && (
              <ModernCard variant="glass" className="sticky top-20">
                <ModernCardHeader>
                  <div className="flex items-center gap-2">
                    <ModernCardIcon
                      gradientFrom="from-pink-500"
                      gradientTo="to-rose-500"
                      size="sm"
                    >
                      <Tag className="w-3 h-3 text-white" />
                    </ModernCardIcon>
                    <h3 className="font-heading font-semibold text-slate-800 dark:text-white">
                      Tags
                    </h3>
                  </div>
                </ModernCardHeader>
                <ModernCardContent>
                  <div className="flex flex-wrap gap-2">
                    {allTags.map(({ tag, count }) => (
                      <Link
                        key={tag}
                        href={`/blog?tag=${encodeURIComponent(tag)}`}
                      >
                        <Badge
                          variant={selectedTag === tag ? "default" : "outline"}
                          className={
                            selectedTag === tag
                              ? "bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white border-transparent"
                              : "bg-indigo-50 dark:bg-indigo-950/50 border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors"
                          }
                        >
                          {tag} ({count})
                        </Badge>
                      </Link>
                    ))}
                  </div>
                </ModernCardContent>
              </ModernCard>
            )}
          </aside>
        </div>
      </PageSection>
    </PageLayout>
  );
}
