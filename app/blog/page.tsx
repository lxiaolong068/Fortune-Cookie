/**
 * Blog List Page
 *
 * Displays all blog posts with optional tag filtering.
 * Optimized for SEO with proper metadata and structured data.
 */

import { Metadata } from "next";
import Link from "next/link";
import { BookOpen, Tag, TrendingUp } from "lucide-react";
import { getBlogPosts, getAllTags, getFeaturedPosts } from "@/lib/blog";
import { BlogCard } from "@/components/blog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { getSiteUrl, getImageUrl } from "@/lib/site";

const baseUrl = getSiteUrl();

export const metadata: Metadata = {
  title: "Blog - Fortune Cookie Wisdom & Insights",
  description:
    "Explore articles about fortune cookies, luck, wisdom, and the fascinating history behind these iconic treats. Discover tips, recipes, and cultural insights.",
  openGraph: {
    title: "Blog - Fortune Cookie Wisdom & Insights",
    description:
      "Explore articles about fortune cookies, luck, wisdom, and the fascinating history behind these iconic treats.",
    type: "website",
    url: `${baseUrl}/blog`,
    images: [{ url: getImageUrl("/og-image.png"), width: 1200, height: 630 }],
  },
  alternates: {
    canonical: "/blog",
  },
};

interface BlogPageProps {
  searchParams: Promise<{ tag?: string }>;
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const params = await searchParams;
  const selectedTag = params.tag;

  // Get posts (filtered by tag if specified)
  const posts = getBlogPosts({ tag: selectedTag });
  const featuredPosts = selectedTag ? [] : getFeaturedPosts(2);
  const allTags = getAllTags();

  // Show all posts in the regular list (featured posts appear in both sections)
  const regularPosts = posts;

  return (
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
              surprising history to homemade recipes and the psychology of luck.
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
                  <div className="grid md:grid-cols-2 gap-6">
                    {regularPosts.map((post) => (
                      <BlogCard key={post.slug} post={post} />
                    ))}
                  </div>
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
  );
}
