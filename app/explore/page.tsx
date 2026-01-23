import { Suspense } from "react";
import { Metadata } from "next";
import { ExplorePageContent } from "./ExplorePageContent";
import { getSiteUrl, getImageUrl } from "@/lib/site";
import { generateAlternateLanguages } from "@/lib/i18n-config";
import { getDatabaseStats } from "@/lib/fortune-database";
import {
  ItemListStructuredData,
  BreadcrumbStructuredData,
  FAQStructuredData,
} from "@/components/StructuredData";

const baseUrl = getSiteUrl();

// Dynamic metadata with actual message count from database
export async function generateMetadata(): Promise<Metadata> {
  const stats = getDatabaseStats();
  const totalCount = stats.total;
  const categoryCount = Object.keys(stats.categories).length;

  const title = "Explore Fortune Cookie Messages – Browse, Search & Filter";
  const description = `Explore ${totalCount}+ fortune cookie messages across ${categoryCount} categories. Search, filter by category or tag, sort by popularity, and find the perfect fortune for any occasion. Free to copy and share.`;

  return {
    title,
    description,
    keywords: [
      "fortune cookie messages",
      "fortune cookie sayings",
      "browse fortune cookies",
      "search fortune messages",
      "fortune cookie quotes",
      "inspirational fortunes",
      "funny fortune cookies",
      "love fortune messages",
      "wisdom quotes",
      "lucky numbers",
    ],
    openGraph: {
      title,
      description,
      type: "website",
      url: `${baseUrl}/explore`,
      images: [
        {
          url: getImageUrl("/og-image.png"),
          width: 1200,
          height: 630,
          alt: "Explore Fortune Cookie Messages",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [getImageUrl("/twitter-image.png")],
      creator: "@fortunecookieai",
    },
    alternates: {
      canonical: "/explore",
      languages: generateAlternateLanguages("/explore", baseUrl),
    },
  };
}

// FAQ content for structured data
const exploreFAQs = [
  {
    question: "How do I search for fortune cookie messages?",
    answer:
      "Use the search bar at the top of the Explore page to search by keywords, phrases, or themes. You can also filter by category (inspirational, funny, love, etc.) and sort by popularity, newest, or alphabetically.",
  },
  {
    question: "What categories of fortune cookie messages are available?",
    answer:
      "We offer 8 main categories: Inspirational, Funny, Love, Success, Wisdom, Friendship, Birthday, and Study. Each category contains curated messages perfect for different occasions and moods.",
  },
  {
    question: "Can I copy and share these fortune cookie messages?",
    answer:
      "Yes! All fortune cookie messages are free to copy and share. Simply click the copy button on any message card to copy the text along with its lucky numbers. Perfect for social media, cards, or personal use.",
  },
  {
    question: "How often are new fortune cookie messages added?",
    answer:
      "We regularly update our collection with new fortune cookie messages. Our AI generator can also create personalized fortunes based on your preferences. Visit our Generator page for custom fortunes.",
  },
];

// Loading fallback for Suspense
function ExploreLoadingFallback() {
  return (
    <main className="min-h-screen w-full overflow-x-hidden relative bg-[#FAFAFA]">
      <div className="relative z-10">
        <div className="container mx-auto px-4 py-8">
          {/* Hero skeleton */}
          <div className="text-center mb-12">
            <div className="h-12 w-96 mx-auto bg-gray-200 rounded animate-pulse mb-4" />
            <div className="h-6 w-80 mx-auto bg-gray-200 rounded animate-pulse mb-6" />
            <div className="flex flex-wrap justify-center gap-3 mb-8">
              <div className="h-8 w-32 bg-gray-200 rounded-full animate-pulse" />
              <div className="h-8 w-28 bg-gray-200 rounded-full animate-pulse" />
              <div className="h-8 w-24 bg-gray-200 rounded-full animate-pulse" />
            </div>
          </div>

          {/* Filter skeleton */}
          <div className="p-6 bg-white/90 rounded-xl border border-amber-200 mb-8">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="h-11 bg-gray-200 rounded animate-pulse" />
              <div className="h-11 bg-gray-200 rounded animate-pulse" />
            </div>
          </div>

          {/* Cards skeleton */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="p-6 bg-white/90 rounded-xl border border-amber-200"
              >
                <div className="h-6 w-24 bg-gray-200 rounded animate-pulse mb-4" />
                <div className="h-20 bg-gray-200 rounded animate-pulse mb-4" />
                <div className="h-8 w-32 bg-gray-200 rounded animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}

export default function ExplorePage() {
  const stats = getDatabaseStats();

  return (
    <>
      <BreadcrumbStructuredData
        items={[
          { name: "Home", url: "/" },
          { name: "Explore Fortune Messages", url: "/explore" },
        ]}
      />
      <ItemListStructuredData
        name="Fortune Cookie Messages Collection"
        description={`Explore our complete collection of ${stats.total}+ fortune cookie messages. Browse by category, search by keywords, and find the perfect fortune for any occasion.`}
        url="/explore"
        items={Object.keys(stats.categories).map((category) => ({
          name: `${category.charAt(0).toUpperCase() + category.slice(1)} Fortune Messages`,
          description: `Browse ${stats.categories[category]} ${category} fortune cookie messages`,
          category: category,
        }))}
      />
      <FAQStructuredData faqs={exploreFAQs} />
      <Suspense fallback={<ExploreLoadingFallback />}>
        <ExplorePageContent />
      </Suspense>
    </>
  );
}
