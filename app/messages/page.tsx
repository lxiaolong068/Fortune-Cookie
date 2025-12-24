import { Metadata } from "next";
import { DynamicBackgroundEffects } from "@/components/DynamicBackgroundEffects";
import { Badge } from "@/components/ui/badge";
import {
  Sparkles,
  Heart,
  Smile,
  TrendingUp,
  Star,
  Brain,
  Users,
  Cake,
  BookOpen,
} from "lucide-react";
import Link from "next/link";
import {
  ItemListStructuredData,
  BreadcrumbStructuredData,
} from "@/components/StructuredData";
import { getImageUrl, getSiteUrl } from "@/lib/site";
import {
  getFortunesByCategory,
  getDatabaseStats,
  FortuneMessage,
} from "@/lib/fortune-database";
import { MessagesClientWrapper, CategoryConfig } from "@/components/messages";

const baseUrl = getSiteUrl();

export const metadata: Metadata = {
  title: "Fortune Cookie Messages – Inspirational & Funny Quotes",
  description:
    "Browse 200+ fortune cookie messages for daily inspiration, parties, gift cards, and social media. Funny, inspirational, love, success, wisdom, and friendship sayings with lucky numbers.",
  openGraph: {
    title: "Fortune Cookie Messages – Inspirational & Funny Quotes",
    description:
      "Browse 200+ fortune cookie messages for daily inspiration, parties, gift cards, and social media. Funny, inspirational, love, success, wisdom, and friendship sayings.",
    type: "website",
    url: `${baseUrl}/messages`,
    images: [
      {
        url: getImageUrl("/og-image.png"),
        width: 1200,
        height: 630,
        alt: "Fortune Cookie Messages",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Fortune Cookie Messages – Inspirational & Funny Quotes",
    description:
      "Browse 200+ fortune cookie messages for daily inspiration, parties, gift cards, and social media. Funny, inspirational, love, success, wisdom, and friendship sayings.",
    images: [getImageUrl("/twitter-image.png")],
    creator: "@fortunecookieai",
  },
  alternates: {
    canonical: "/messages",
  },
};

// Icon name to component mapping for Quick Navigation (SSR)
const iconComponents = {
  star: Star,
  smile: Smile,
  heart: Heart,
  "trending-up": TrendingUp,
  brain: Brain,
  users: Users,
  cake: Cake,
  "book-open": BookOpen,
} as const;

// Category configuration with SEO-optimized content
// Using iconName (string) instead of icon (function) for serialization to client components
const categoryConfig: CategoryConfig[] = [
  {
    id: "inspirational",
    seoTitle: "Inspirational Fortune Cookie Messages",
    iconName: "star",
    color: "bg-blue-100 text-blue-800",
    borderColor: "border-l-blue-500",
    intro:
      "Discover uplifting fortune cookie sayings that inspire positivity, motivation, and personal growth. These inspirational quotes are perfect for daily encouragement, graduation cards, sharing words of wisdom with friends, or printing on custom fortune cookies for special occasions. Each message carries timeless wisdom to brighten your day.",
    viewAllPath: "/messages/inspirational",
    ctaText: "Want more inspirational messages?",
  },
  {
    id: "funny",
    seoTitle: "Funny Fortune Cookie Messages",
    iconName: "smile",
    color: "bg-yellow-100 text-yellow-800",
    borderColor: "border-l-yellow-500",
    intro:
      "Get ready to laugh with our collection of hilarious fortune cookie sayings and witty jokes. These funny fortune messages are perfect for parties, pranks, brightening someone's day with humor, or adding levity to office events. From clever wordplay to absurd predictions, these messages will bring smiles.",
    viewAllPath: "/funny-fortune-cookie-messages",
    ctaText: "Want more funny fortune cookies?",
  },
  {
    id: "love",
    seoTitle: "Love Fortune Cookie Messages",
    iconName: "heart",
    color: "bg-pink-100 text-pink-800",
    borderColor: "border-l-pink-500",
    intro:
      "Explore romantic fortune cookie messages about love, relationships, and matters of the heart. These sweet and heartfelt sayings are ideal for Valentine's Day, wedding favors, anniversary celebrations, or expressing affection to someone special. Let these love fortunes kindle romance and connection.",
    viewAllPath: "/messages/love",
    ctaText: "Want more love fortune messages?",
  },
  {
    id: "success",
    seoTitle: "Success & Career Fortune Cookie Messages",
    iconName: "trending-up",
    color: "bg-green-100 text-green-800",
    borderColor: "border-l-green-500",
    intro:
      "Motivating fortune cookie messages about achievement, career success, and reaching your goals. These success-themed sayings are perfect for corporate events, graduation parties, job promotions, or anyone needing a boost of professional motivation. Let these fortunes fuel your ambition.",
    viewAllPath: "/messages/success",
    ctaText: "Want more success messages?",
  },
  {
    id: "wisdom",
    seoTitle: "Wisdom Fortune Cookie Messages",
    iconName: "brain",
    color: "bg-purple-100 text-purple-800",
    borderColor: "border-l-purple-500",
    intro:
      "Thoughtful and philosophical fortune cookie messages offering timeless wisdom and life insights. These profound sayings draw from ancient philosophy and modern understanding, perfect for reflection, meditation, or sharing deep thoughts with friends seeking guidance and perspective.",
    viewAllPath: "/messages/wisdom",
    ctaText: "Want more wisdom fortunes?",
  },
  {
    id: "friendship",
    seoTitle: "Friendship Fortune Cookie Messages",
    iconName: "users",
    color: "bg-teal-100 text-teal-800",
    borderColor: "border-l-teal-500",
    intro:
      "Celebrate the bonds of friendship with these heartwarming fortune cookie messages. Perfect for friend reunions, bestie gifts, friendship day celebrations, or simply reminding your friends how much they mean to you. These messages honor the beautiful connections that enrich our lives.",
    viewAllPath: "/messages/friendship",
    ctaText: "Want more friendship fortunes?",
  },
  {
    id: "birthday",
    seoTitle: "Birthday Fortune Cookie Messages",
    iconName: "cake",
    color: "bg-orange-100 text-orange-800",
    borderColor: "border-l-orange-500",
    intro:
      "Make birthdays extra special with these celebratory fortune cookie messages. Ideal for birthday party favors, greeting cards, or adding a unique touch to birthday celebrations. These messages bring hope, joy, and positive predictions for the year ahead.",
    viewAllPath: "/messages/birthday",
    ctaText: "Want more birthday messages?",
  },
  {
    id: "study",
    seoTitle: "Study & Exam Motivation Messages",
    iconName: "book-open",
    color: "bg-indigo-100 text-indigo-800",
    borderColor: "border-l-indigo-500",
    intro:
      "Inspiring fortune cookie messages for students, test-takers, and lifelong learners. These motivational sayings are perfect for exam preparation, back-to-school encouragement, study groups, or anyone pursuing academic excellence. Let these fortunes boost your focus and confidence.",
    viewAllPath: "/messages/study",
    ctaText: "Want more study motivation?",
  },
];

export default function MessagesPage() {
  const stats = getDatabaseStats();

  // Pre-fetch all category messages (server-side)
  const categoryMessages: Record<string, FortuneMessage[]> = {};
  for (const category of categoryConfig) {
    categoryMessages[category.id] = getFortunesByCategory(category.id).slice(
      0,
      15,
    );
  }

  // Prepare message items for structured data (only first 5 per category for SEO)
  const messageItems = categoryConfig.flatMap((category) => {
    const messages = categoryMessages[category.id] || [];
    return messages.slice(0, 5).map((fortune) => ({
      name: fortune.message,
      description: `${category.seoTitle.replace(" Fortune Cookie Messages", "").replace(" Messages", "")} fortune cookie message`,
      category: category.seoTitle,
    }));
  });

  return (
    <>
      <ItemListStructuredData
        name="Fortune Cookie Messages Collection"
        description="Browse our complete collection of 200+ fortune cookie messages including funny, inspirational, love, success, wisdom, friendship, birthday, and study motivation sayings. Find the perfect fortune for any occasion."
        url="/messages"
        items={messageItems}
      />
      <BreadcrumbStructuredData
        items={[
          { name: "Home", url: "/" },
          { name: "Fortune Cookie Messages", url: "/messages" },
        ]}
      />
      <main className="min-h-screen w-full overflow-x-hidden relative">
        <DynamicBackgroundEffects />
        <div className="relative z-10">
          <div className="container mx-auto px-4 py-8">
            {/* Hero Section - SSR for SEO */}
            <div className="text-center mb-16">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-amber-600 via-yellow-600 to-orange-600 bg-clip-text text-transparent mb-6">
                Fortune Cookie Messages
              </h1>
              <p className="text-lg md:text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed mb-8">
                Browse hundreds of fortune cookie messages perfect for daily
                inspiration, parties, gift cards, printing, and social media
                captions. Discover funny, inspirational, love, success, wisdom,
                and friendship sayings—each with lucky numbers to brighten your
                day.
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                <Badge className="bg-amber-100 text-amber-800 px-4 py-2">
                  <Sparkles className="w-4 h-4 mr-2" />
                  {stats.total}+ Messages
                </Badge>
                <Badge className="bg-blue-100 text-blue-800 px-4 py-2">
                  <Star className="w-4 h-4 mr-2" />
                  {Object.keys(stats.categories).length} Categories
                </Badge>
                <Badge className="bg-green-100 text-green-800 px-4 py-2">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  AI Generator Available
                </Badge>
              </div>
            </div>

            {/* Quick Navigation - SSR for SEO */}
            <section className="mb-16">
              <h2 className="text-xl font-semibold text-gray-900 mb-6 text-center">
                Jump to Category
              </h2>
              <div className="flex flex-wrap justify-center gap-3">
                {categoryConfig.map((category) => {
                  const IconComponent = iconComponents[category.iconName];
                  return (
                    <Link
                      key={category.id}
                      href={`#${category.id}`}
                      className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${category.color} hover:opacity-80 transition-opacity`}
                    >
                      <IconComponent className="w-4 h-4" />
                      <span className="text-sm font-medium">
                        {category.seoTitle
                          .replace(" Fortune Cookie Messages", "")
                          .replace(" Messages", "")}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </section>

            {/* Message Categories + Bottom Sections - Client-side with Lazy Loading */}
            <MessagesClientWrapper
              allCategories={categoryConfig}
              categoryMessages={categoryMessages}
            />
          </div>
        </div>
      </main>
    </>
  );
}
