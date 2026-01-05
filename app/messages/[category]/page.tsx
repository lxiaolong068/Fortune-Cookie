import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Sparkles, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Breadcrumbs } from "@/components/InternalLinks";
import { fortuneDatabase } from "@/lib/fortune-database";
import { getImageUrl } from "@/lib/site";

// Define valid categories (expanded with new categories)
const VALID_CATEGORIES = [
  "inspirational",
  "funny",
  "love",
  "success",
  "wisdom",
  "friendship",
  "birthday",
  "study",
] as const;

type CategoryType = (typeof VALID_CATEGORIES)[number];

// Category metadata configuration
const categoryConfig: Record<
  CategoryType,
  {
    title: string;
    description: string;
    metaDescription: string;
    emoji: string;
    color: string;
    bgColor: string;
  }
> = {
  inspirational: {
    title: "Inspirational Fortune Cookie Messages",
    description:
      "Uplifting and motivational fortune cookie messages to inspire your day and boost your spirit.",
    metaDescription:
      "Discover 100+ inspirational fortune cookie messages. Uplifting quotes and motivational sayings to inspire positivity and personal growth.",
    emoji: "✨",
    color: "text-[#E55328]",
    bgColor: "bg-[#FFE4D6]",
  },
  funny: {
    title: "Funny Fortune Cookie Messages",
    description:
      "Hilarious and witty fortune cookie messages that will make you laugh and brighten your day.",
    metaDescription:
      "Browse 100+ funny fortune cookie messages and sayings. Witty, humorous quotes perfect for adding laughter to your day.",
    emoji: "😂",
    color: "text-[#E55328]",
    bgColor: "bg-[#FFE4D6]",
  },
  love: {
    title: "Love Fortune Cookie Messages",
    description:
      "Romantic and heartfelt fortune cookie messages about love, relationships, and matters of the heart.",
    metaDescription:
      "Explore 100+ romantic fortune cookie messages about love and relationships. Sweet sayings for romance and connection.",
    emoji: "❤️",
    color: "text-[#E55328]",
    bgColor: "bg-[#FFE4D6]",
  },
  success: {
    title: "Success Fortune Cookie Messages",
    description:
      "Motivating fortune cookie messages about achievement, career success, and reaching your goals.",
    metaDescription:
      "Find 100+ success-themed fortune cookie messages. Motivational quotes about achievement, career, and reaching your goals.",
    emoji: "🏆",
    color: "text-[#E55328]",
    bgColor: "bg-[#FFE4D6]",
  },
  wisdom: {
    title: "Wisdom Fortune Cookie Messages",
    description:
      "Thoughtful and philosophical fortune cookie messages offering timeless wisdom and life insights.",
    metaDescription:
      "Discover 100+ wisdom fortune cookie messages. Philosophical insights and thoughtful sayings for reflection and guidance.",
    emoji: "🧠",
    color: "text-[#E55328]",
    bgColor: "bg-[#FFE4D6]",
  },
  friendship: {
    title: "Friendship Fortune Cookie Messages",
    description:
      "Heartwarming fortune cookie messages celebrating the bonds of friendship and companionship.",
    metaDescription:
      "Browse 100+ friendship fortune cookie messages. Heartfelt sayings to celebrate your friends and the bonds you share.",
    emoji: "👫",
    color: "text-[#E55328]",
    bgColor: "bg-[#FFE4D6]",
  },
  birthday: {
    title: "Birthday Fortune Cookie Messages",
    description:
      "Celebratory fortune cookie messages perfect for birthday wishes, party favors, and special occasions.",
    metaDescription:
      "Discover 50+ birthday fortune cookie messages. Perfect sayings for birthday cards, party favors, and celebrating special days.",
    emoji: "🎂",
    color: "text-[#E55328]",
    bgColor: "bg-[#FFE4D6]",
  },
  study: {
    title: "Study & Motivation Fortune Cookie Messages",
    description:
      "Inspiring fortune cookie messages for students, exam preparation, and academic motivation.",
    metaDescription:
      "Find 50+ study and motivation fortune cookie messages. Perfect for students, exam prep, and academic encouragement.",
    emoji: "📚",
    color: "text-[#E55328]",
    bgColor: "bg-[#FFE4D6]",
  },
};

interface PageProps {
  params: Promise<{ category: string }>;
}

function isValidCategory(category: string): category is CategoryType {
  return VALID_CATEGORIES.includes(category as CategoryType);
}

export async function generateStaticParams() {
  return VALID_CATEGORIES.map((category) => ({
    category,
  }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { category } = await params;

  if (!isValidCategory(category)) {
    return {
      title: "Category Not Found | Fortune Cookie AI",
    };
  }

  const config = categoryConfig[category];

  return {
    title: `${config.title} | Fortune Cookie AI`,
    description: config.metaDescription,
    keywords: [
      `${category} fortune cookie`,
      `${category} fortune messages`,
      `${category} quotes`,
      "fortune cookie sayings",
      "fortune cookie messages",
    ],
    openGraph: {
      title: config.title,
      description: config.metaDescription,
      type: "website",
      url: `/messages/${category}`,
      images: [
        {
          url: getImageUrl("/og-image.png"),
          width: 1200,
          height: 630,
          alt: config.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: config.title,
      description: config.metaDescription,
      images: [getImageUrl("/twitter-image.png")],
      creator: "@fortunecookieai",
    },
    alternates: {
      canonical: `/messages/${category}`,
    },
  };
}

export default async function CategoryPage({ params }: PageProps) {
  const { category } = await params;

  if (!isValidCategory(category)) {
    notFound();
  }

  const config = categoryConfig[category];

  // Get fortunes for this category
  const categoryFortunes = fortuneDatabase.filter(
    (fortune) => fortune.category.toLowerCase() === category.toLowerCase(),
  );

  // Breadcrumb items
  const breadcrumbItems = [
    { name: "Home", href: "/" },
    { name: "Messages", href: "/messages" },
    {
      name: config.title
        .replace(" Fortune Cookie Messages", "")
        .replace(" Messages", ""),
    },
  ];

  // Related categories (exclude current)
  const relatedCategories = VALID_CATEGORIES.filter((c) => c !== category);

  // Use theme accent border for message cards
  const getBorderColor = () => "#FFE4D6";

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      {/* Breadcrumbs */}
      <div className="container mx-auto px-4 pt-6">
        <Breadcrumbs items={breadcrumbItems} />
      </div>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-12">
        <div className="text-center max-w-3xl mx-auto">
          <div
            className={`inline-flex h-20 w-20 items-center justify-center rounded-full mb-6 ${config.bgColor}`}
          >
            <span className="text-4xl">{config.emoji}</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-[#222222] mb-4">
            {config.title}
          </h1>
          <p className="text-lg text-[#555555] mb-8">{config.description}</p>
          <Badge
            className={`px-4 py-1 text-sm border border-[#FFD6C5] ${config.bgColor} ${config.color}`}
          >
            {categoryFortunes.length}+ Messages Available
          </Badge>
        </div>
      </section>

      {/* Fortune Messages Grid */}
      <section className="container mx-auto px-4 py-8">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {categoryFortunes.slice(0, 30).map((fortune) => (
            <Card
              key={fortune.id}
              className="border border-[#FFE4D6] border-l-4 bg-white transition-shadow duration-200 hover:shadow-lg"
              style={{
                borderLeftColor: getBorderColor(),
              }}
            >
              <CardContent className="p-5">
                <blockquote className="text-[#222222] italic mb-3">
                  &ldquo;{fortune.message}&rdquo;
                </blockquote>
                <div className="flex flex-wrap gap-1.5">
                  {fortune.tags?.slice(0, 3).map((tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="border border-[#FFD6C5] bg-[#FFE4D6] text-[#E55328] text-xs"
                    >
                      #{tag}
                    </Badge>
                  ))}
                </div>
                {fortune.luckyNumbers && (
                  <div className="mt-3 flex items-center gap-1.5 text-xs text-[#555555]">
                    <span>Lucky:</span>
                    {fortune.luckyNumbers.slice(0, 3).map((num, i) => (
                      <span
                        key={i}
                        className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#FFE4D6] text-[#E55328] font-medium"
                      >
                        {num}
                      </span>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {categoryFortunes.length > 30 && (
          <div className="text-center mt-8">
            <p className="text-[#555555] mb-4">
              Showing 30 of {categoryFortunes.length} messages
            </p>
          </div>
        )}
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-12">
        <Card className="border border-[#FFD6C5] bg-[#FFE4D6]">
          <CardContent className="p-8 text-center">
            <Sparkles className="mx-auto mb-4 h-12 w-12 text-[#E55328] opacity-90" />
            <h2 className="text-2xl md:text-3xl font-bold mb-4 text-[#222222]">
              Get Your Personalized AI Fortune
            </h2>
            <p className="text-[#555555] mb-6 max-w-xl mx-auto">
              Want a unique {category} fortune created just for you? Our AI can
              generate personalized messages based on your preferences.
            </p>
            <Button
              asChild
              size="lg"
              className="bg-[#FF6B3D] text-white hover:bg-[#E55328]"
            >
              <Link href={`/generator?category=${category}`}>
                Generate AI Fortune <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </section>

      {/* Related Categories */}
      <section className="container mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold text-[#222222] mb-6 text-center">
          Explore Other Categories
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {relatedCategories.slice(0, 4).map((cat) => {
            const catConfig = categoryConfig[cat];
            return (
              <Link key={cat} href={`/messages/${cat}`}>
                <Card className="h-full cursor-pointer border border-[#FFE4D6] bg-white transition-all duration-200 hover:-translate-y-1 hover:shadow-md">
                  <CardContent className="p-5 text-center">
                    <div
                      className={`inline-flex h-12 w-12 items-center justify-center rounded-full mb-3 ${catConfig.bgColor}`}
                    >
                      <span className="text-2xl">{catConfig.emoji}</span>
                    </div>
                    <h3 className={`font-semibold ${catConfig.color}`}>
                      {catConfig.title
                        .replace(" Fortune Cookie Messages", "")
                        .replace(" Messages", "")}
                    </h3>
                    <p className="text-sm text-[#555555] mt-1">
                      {
                        fortuneDatabase.filter(
                          (f) => f.category.toLowerCase() === cat,
                        ).length
                      }
                      + messages
                    </p>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: config.title,
            description: config.metaDescription,
            url: `https://fortunecookieai.app/messages/${category}`,
            mainEntity: {
              "@type": "ItemList",
              numberOfItems: categoryFortunes.length,
              itemListElement: categoryFortunes
                .slice(0, 10)
                .map((fortune, index) => ({
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
                  name: "Messages",
                  item: "https://fortunecookieai.app/messages",
                },
                {
                  "@type": "ListItem",
                  position: 3,
                  name: config.title
                    .replace(" Fortune Cookie Messages", "")
                    .replace(" Messages", ""),
                  item: `https://fortunecookieai.app/messages/${category}`,
                },
              ],
            },
          }),
        }}
      />
    </div>
  );
}
