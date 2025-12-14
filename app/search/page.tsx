import type { Metadata } from "next";
import Link from "next/link";
import { Search as SearchIcon, FileText, Quote } from "lucide-react";
import { BreadcrumbStructuredData } from "@/components/StructuredData";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { getSiteUrl } from "@/lib/site";
import { searchSite } from "@/lib/siteSearch";

const baseUrl = getSiteUrl();

export const metadata: Metadata = {
  title: "Search",
  description:
    "Search Fortune Cookie AI for fortune messages, blog posts, and guides.",
  alternates: {
    canonical: "/search",
  },
  openGraph: {
    title: "Search - Fortune Cookie AI",
    description:
      "Search Fortune Cookie AI for fortune messages, blog posts, and guides.",
    type: "website",
    url: `${baseUrl}/search`,
  },
  robots: {
    index: false,
    follow: true,
  },
};

interface SearchPageProps {
  searchParams: Promise<{ q?: string }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  const query = (params.q || "").trim();

  const results = query
    ? searchSite(query, { maxPages: 10, maxBlogPosts: 10, maxFortunes: 20 })
    : { query, pages: [], blogPosts: [], fortunes: [] };

  const totalResults =
    results.pages.length + results.blogPosts.length + results.fortunes.length;

  return (
    <>
      <BreadcrumbStructuredData
        items={[
          { name: "Home", url: "/" },
          { name: "Search", url: "/search" },
        ]}
      />

      <main className="min-h-screen w-full overflow-x-hidden bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50">
        <div className="container mx-auto px-4 py-10 max-w-5xl">
          <header className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-amber-600 via-yellow-600 to-orange-600 bg-clip-text text-transparent mb-4">
              Search
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Search across fortune messages, blog posts, and guides.
            </p>
          </header>

          <Card className="p-4 md:p-6 bg-white/90 backdrop-blur-sm border-amber-200 mb-8">
            <form action="/search" method="get" className="flex gap-3">
              <Input
                name="q"
                placeholder="Try “lucky numbers”, “history”, or “funny”"
                defaultValue={query}
                aria-label="Search query"
              />
              <Button type="submit" className="bg-amber-500 hover:bg-amber-600">
                <SearchIcon className="w-4 h-4 mr-2" />
                Search
              </Button>
            </form>
            {query && (
              <p className="mt-3 text-sm text-gray-600">
                Found {totalResults} result{totalResults === 1 ? "" : "s"} for{" "}
                <span className="font-medium text-gray-800">“{query}”</span>.
              </p>
            )}
          </Card>

          {!query ? (
            <Card className="p-8 bg-white/90 backdrop-blur-sm border-amber-200 text-center">
              <p className="text-gray-700">
                Enter a search term to see results.
              </p>
              <p className="text-sm text-gray-600 mt-2">
                Tip: Use short keywords. Examples: “inspirational”, “recipe”,
                “Japan”.
              </p>
            </Card>
          ) : totalResults === 0 ? (
            <Card className="p-8 bg-white/90 backdrop-blur-sm border-amber-200 text-center">
              <p className="text-gray-700">No results found.</p>
              <p className="text-sm text-gray-600 mt-2">
                Try a different keyword, or browse{" "}
                <Link href="/browse" className="text-amber-700 underline">
                  categories
                </Link>{" "}
                and{" "}
                <Link href="/blog" className="text-amber-700 underline">
                  blog posts
                </Link>
                .
              </p>
            </Card>
          ) : (
            <div className="space-y-8">
              {results.pages.length > 0 && (
                <section>
                  <div className="flex items-center gap-2 mb-4">
                    <FileText className="w-5 h-5 text-amber-600" />
                    <h2 className="text-xl font-semibold text-gray-800">
                      Pages
                    </h2>
                    <Badge className="bg-amber-100 text-amber-800">
                      {results.pages.length}
                    </Badge>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    {results.pages.map((page) => (
                      <Card
                        key={page.url}
                        className="p-5 bg-white/90 backdrop-blur-sm border-amber-200 hover:shadow-md transition-shadow"
                      >
                        <Link href={page.url} className="block">
                          <div className="font-semibold text-gray-900 mb-1">
                            {page.title}
                          </div>
                          <div className="text-sm text-gray-600">
                            {page.description}
                          </div>
                        </Link>
                      </Card>
                    ))}
                  </div>
                </section>
              )}

              {results.blogPosts.length > 0 && (
                <section>
                  <div className="flex items-center gap-2 mb-4">
                    <FileText className="w-5 h-5 text-amber-600" />
                    <h2 className="text-xl font-semibold text-gray-800">
                      Blog Posts
                    </h2>
                    <Badge className="bg-amber-100 text-amber-800">
                      {results.blogPosts.length}
                    </Badge>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    {results.blogPosts.map((post) => (
                      <Card
                        key={post.slug}
                        className="p-5 bg-white/90 backdrop-blur-sm border-amber-200 hover:shadow-md transition-shadow"
                      >
                        <Link href={`/blog/${post.slug}`} className="block">
                          <div className="font-semibold text-gray-900 mb-1">
                            {post.title}
                          </div>
                          <div className="text-sm text-gray-600 mb-3">
                            {post.description}
                          </div>
                          {post.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                              {post.tags.slice(0, 4).map((tag) => (
                                <Badge
                                  key={tag}
                                  variant="secondary"
                                  className="bg-amber-100 text-amber-800 border-transparent"
                                >
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </Link>
                      </Card>
                    ))}
                  </div>
                </section>
              )}

              {results.fortunes.length > 0 && (
                <section>
                  <div className="flex items-center gap-2 mb-4">
                    <Quote className="w-5 h-5 text-amber-600" />
                    <h2 className="text-xl font-semibold text-gray-800">
                      Fortune Messages
                    </h2>
                    <Badge className="bg-amber-100 text-amber-800">
                      {results.fortunes.length}
                    </Badge>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    {results.fortunes.map((fortune) => (
                      <Card
                        key={fortune.id}
                        className="p-5 bg-white/90 backdrop-blur-sm border-amber-200"
                      >
                        <blockquote className="text-gray-800 italic leading-relaxed">
                          “{fortune.message}”
                        </blockquote>
                        <div className="mt-3 flex flex-wrap gap-2">
                          <Badge className="bg-blue-100 text-blue-800">
                            {fortune.category}
                          </Badge>
                          {fortune.tags.slice(0, 3).map((tag) => (
                            <Badge
                              key={tag}
                              variant="outline"
                              className="bg-amber-50 border-amber-200 text-amber-800"
                            >
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </Card>
                    ))}
                  </div>
                </section>
              )}
            </div>
          )}
        </div>
      </main>
    </>
  );
}

