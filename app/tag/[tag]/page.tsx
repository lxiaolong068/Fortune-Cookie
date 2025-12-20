import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Tag, ArrowRight, Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Breadcrumbs } from "@/components/InternalLinks";
import { fortuneDatabase, type FortuneMessage } from "@/lib/fortune-database";

interface PageProps {
  params: Promise<{ tag: string }>;
}

// Get all unique tags from the database
function getAllTags(): string[] {
  const tags = new Set<string>();
  fortuneDatabase.forEach((fortune) => {
    fortune.tags.forEach((tag) => tags.add(tag.toLowerCase()));
  });
  return Array.from(tags).sort();
}

// Get fortunes by tag
function getFortunesByTag(tag: string): FortuneMessage[] {
  return fortuneDatabase.filter((fortune) =>
    fortune.tags.some((t) => t.toLowerCase() === tag.toLowerCase())
  );
}

// Format tag for display
function formatTagName(tag: string): string {
  return tag
    .split(/[-_\s]/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export async function generateStaticParams() {
  const tags = getAllTags();
  return tags.map((tag) => ({
    tag: encodeURIComponent(tag),
  }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { tag } = await params;
  const decodedTag = decodeURIComponent(tag);
  const fortunes = getFortunesByTag(decodedTag);

  if (fortunes.length === 0) {
    return {
      title: "Tag Not Found | Fortune Cookie AI",
    };
  }

  const formattedTag = formatTagName(decodedTag);

  return {
    title: `${formattedTag} Fortune Cookie Messages | Fortune Cookie AI`,
    description: `Discover ${fortunes.length}+ fortune cookie messages about ${decodedTag}. Find inspiring quotes and wisdom related to ${decodedTag}.`,
    openGraph: {
      title: `${formattedTag} Fortune Cookie Messages`,
      description: `Explore ${fortunes.length}+ fortune cookie messages about ${decodedTag}.`,
      type: "website",
      url: `/tag/${tag}`,
    },
    twitter: {
      card: "summary_large_image",
      title: `${formattedTag} Fortune Cookie Messages`,
      description: `Explore ${fortunes.length}+ fortune cookie messages about ${decodedTag}.`,
    },
    alternates: {
      canonical: `/tag/${tag}`,
    },
  };
}

export default async function TagPage({ params }: PageProps) {
  const { tag } = await params;
  const decodedTag = decodeURIComponent(tag);
  const fortunes = getFortunesByTag(decodedTag);

  if (fortunes.length === 0) {
    notFound();
  }

  const formattedTag = formatTagName(decodedTag);
  const allTags = getAllTags();

  // Get related tags (tags that appear with this tag)
  const relatedTags = new Set<string>();
  fortunes.forEach((fortune) => {
    fortune.tags.forEach((t) => {
      if (t.toLowerCase() !== decodedTag.toLowerCase()) {
        relatedTags.add(t.toLowerCase());
      }
    });
  });
  const relatedTagsArray = Array.from(relatedTags).slice(0, 10);

  // Breadcrumb items
  const navBreadcrumbs = [
    { name: "Home", href: "/" },
    { name: "Browse", href: "/browse" },
    { name: formattedTag },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50">
      {/* Breadcrumbs */}
      <div className="container mx-auto px-4 pt-6">
        <Breadcrumbs items={navBreadcrumbs} />
      </div>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-12">
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-amber-100 mb-6">
            <Tag className="w-10 h-10 text-amber-600" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {formattedTag} Fortunes
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Explore fortune cookie messages related to {decodedTag}
          </p>
          <Badge className="bg-amber-100 text-amber-700 text-sm px-4 py-1">
            {fortunes.length} Messages Found
          </Badge>
        </div>
      </section>

      {/* Fortune Messages Grid */}
      <section className="container mx-auto px-4 py-8">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {fortunes.map((fortune) => (
            <Card
              key={fortune.id}
              className="hover:shadow-lg transition-shadow duration-200 border-l-4 border-l-amber-500"
            >
              <CardContent className="p-5">
                <blockquote className="text-gray-700 italic mb-3">
                  &ldquo;{fortune.message}&rdquo;
                </blockquote>
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {fortune.tags.map((t) => (
                    <Link key={t} href={`/tag/${encodeURIComponent(t.toLowerCase())}`}>
                      <Badge
                        variant={t.toLowerCase() === decodedTag.toLowerCase() ? "default" : "outline"}
                        className={`text-xs cursor-pointer hover:bg-amber-100 ${
                          t.toLowerCase() === decodedTag.toLowerCase()
                            ? "bg-amber-500 text-white"
                            : ""
                        }`}
                      >
                        #{t}
                      </Badge>
                    </Link>
                  ))}
                </div>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span className="capitalize">{fortune.category}</span>
                  {fortune.luckyNumbers && (
                    <div className="flex items-center gap-1">
                      <span>Lucky:</span>
                      {fortune.luckyNumbers.slice(0, 3).map((num, i) => (
                        <span
                          key={i}
                          className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-amber-100 text-amber-700 font-medium"
                        >
                          {num}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Related Tags */}
      {relatedTagsArray.length > 0 && (
        <section className="container mx-auto px-4 py-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Related Tags
          </h2>
          <div className="flex flex-wrap justify-center gap-2">
            {relatedTagsArray.map((t) => (
              <Link key={t} href={`/tag/${encodeURIComponent(t)}`}>
                <Badge
                  variant="outline"
                  className="text-sm px-3 py-1 cursor-pointer hover:bg-amber-100 hover:border-amber-300"
                >
                  #{formatTagName(t)}
                </Badge>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* All Tags Cloud */}
      <section className="container mx-auto px-4 py-12 border-t border-amber-200">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          Explore All Tags
        </h2>
        <div className="flex flex-wrap justify-center gap-2 max-w-4xl mx-auto">
          {allTags.slice(0, 30).map((t) => {
            const count = getFortunesByTag(t).length;
            return (
              <Link key={t} href={`/tag/${encodeURIComponent(t)}`}>
                <Badge
                  variant={t === decodedTag.toLowerCase() ? "default" : "secondary"}
                  className={`text-xs px-2 py-1 cursor-pointer hover:bg-amber-100 ${
                    t === decodedTag.toLowerCase() ? "bg-amber-500" : ""
                  }`}
                >
                  {formatTagName(t)} ({count})
                </Badge>
              </Link>
            );
          })}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-12">
        <Card className="bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0">
          <CardContent className="p-8 text-center">
            <Sparkles className="w-12 h-12 mx-auto mb-4 opacity-90" />
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Get Your AI Fortune
            </h2>
            <p className="text-white/90 mb-6 max-w-xl mx-auto">
              Want a personalized fortune about {decodedTag}? Let our AI create one just for you.
            </p>
            <Button
              asChild
              size="lg"
              className="bg-white text-amber-600 hover:bg-amber-50"
            >
              <Link href="/ai-generator">
                Generate AI Fortune <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </section>

      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: `${formattedTag} Fortune Cookie Messages`,
            description: `Collection of ${fortunes.length} fortune cookie messages about ${decodedTag}`,
            url: `https://fortunecookieai.app/tag/${tag}`,
            mainEntity: {
              "@type": "ItemList",
              numberOfItems: fortunes.length,
              itemListElement: fortunes.slice(0, 10).map((fortune, index) => ({
                "@type": "ListItem",
                position: index + 1,
                item: {
                  "@type": "Quotation",
                  text: fortune.message,
                },
              })),
            },
            breadcrumb: {
              "@type": "BreadcrumbList",
              itemListElement: [
                {
                  "@type": "ListItem",
                  position: 1,
                  name: "Home",
                  item: "https://fortunecookieai.app",
                },
                {
                  "@type": "ListItem",
                  position: 2,
                  name: "Browse",
                  item: "https://fortunecookieai.app/browse",
                },
                {
                  "@type": "ListItem",
                  position: 3,
                  name: formattedTag,
                  item: `https://fortunecookieai.app/tag/${tag}`,
                },
              ],
            },
          }),
        }}
      />
    </div>
  );
}
