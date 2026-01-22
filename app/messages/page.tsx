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
  FAQStructuredData,
} from "@/components/StructuredData";
import { getImageUrl, getSiteUrl } from "@/lib/site";
import {
  getFortunesByCategory,
  getDatabaseStats,
  FortuneMessage,
} from "@/lib/fortune-database";
import { MessagesClientWrapper, CategoryConfig } from "@/components/messages";

const baseUrl = getSiteUrl();

// Dynamic metadata with actual message count from database
export async function generateMetadata(): Promise<Metadata> {
  const stats = getDatabaseStats();
  const totalCount = stats.total;

  const title = "Fortune Cookie Messages – Inspirational & Funny Quotes";
  const description = `Browse ${totalCount}+ fortune cookie messages for daily inspiration, parties, gift cards, printing, and social media. Free copy-paste texts for wisdom, love, success, and funny pranks with lucky numbers.`;

  return {
    title,
    description,
    keywords: [
      "fortune cookie messages",
      "fortune cookie sayings",
      "printable fortune cookie quotes",
      "copy paste fortune messages",
      "short fortune cookie sayings",
      "custom fortune cookie text",
      "funny fortune cookies",
      "inspirational quotes",
      "love fortune messages",
      "lucky numbers",
    ],
    openGraph: {
      title,
      description,
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
      title,
      description,
      images: [getImageUrl("/twitter-image.png")],
      creator: "@fortunecookieai",
    },
    alternates: {
      canonical: "/messages",
    },
  };
}

// FAQ content for structured data - helps capture "People Also Ask" snippets
const messageFAQs = [
  {
    question: "What are common fortune cookie sayings?",
    answer:
      "Common fortune cookie sayings include inspirational quotes about success, love, and wisdom. Popular examples include 'The journey of a thousand miles begins with a single step' and 'Good things come to those who wait.' Our collection features over 500 curated messages across 8 categories.",
  },
  {
    question: "How long should a fortune cookie message be?",
    answer:
      "Ideal fortune cookie messages are between 10-60 characters for short fortunes (great for printing), 60-120 characters for medium-length sayings, and up to 180 characters for longer philosophical messages. Most traditional fortune cookies use short to medium length messages.",
  },
  {
    question: "Can I write my own fortune cookie messages?",
    answer:
      "Yes! You can create custom fortune cookie messages for parties, gifts, weddings, or special occasions. Our AI Fortune Generator helps you create personalized fortunes in various styles including inspirational, funny, romantic, and wisdom themes.",
  },
  {
    question: "What types of fortune cookie messages are most popular?",
    answer:
      "Inspirational and funny messages are the most popular categories. Love fortunes are frequently used for weddings and Valentine's Day, while success messages are popular for graduation parties and business events. Birthday fortunes are great for party favors.",
  },
];

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
    label: "Inspirational",
    seoTitle: "Inspirational Fortune Cookie Messages",
    iconName: "star",
    color: "border border-[#FFD6C5] bg-[#FFE4D6] text-[#E55328]",
    borderColor: "border-l-[#FFE4D6]",
    intro:
      "Discover uplifting fortune cookie sayings that inspire positivity, motivation, and personal growth. These inspirational quotes are perfect for daily encouragement, graduation cards, sharing words of wisdom with friends, or printing on custom fortune cookies for special occasions. Each message carries timeless wisdom to brighten your day.",
    viewAllPath: "/messages/inspirational",
    ctaText: "Want more inspirational messages?",
  },
  {
    id: "funny",
    label: "Funny",
    seoTitle: "Funny Fortune Cookie Messages",
    iconName: "smile",
    color: "border border-[#FFD6C5] bg-[#FFE4D6] text-[#E55328]",
    borderColor: "border-l-[#FFE4D6]",
    intro:
      "Get ready to laugh with our collection of hilarious fortune cookie sayings and witty jokes. These funny fortune messages are perfect for parties, pranks, brightening someone's day with humor, or adding levity to office events. From clever wordplay to absurd predictions, these messages will bring smiles.",
    viewAllPath: "/funny-fortune-cookie-messages",
    ctaText: "Want more funny fortune cookies?",
  },
  {
    id: "love",
    label: "Love",
    seoTitle: "Love Fortune Cookie Messages",
    iconName: "heart",
    color: "border border-[#FFD6C5] bg-[#FFE4D6] text-[#E55328]",
    borderColor: "border-l-[#FFE4D6]",
    intro:
      "Explore romantic fortune cookie messages about love, relationships, and matters of the heart. These sweet and heartfelt sayings are ideal for Valentine's Day, wedding favors, anniversary celebrations, or expressing affection to someone special. Let these love fortunes kindle romance and connection.",
    viewAllPath: "/messages/love",
    ctaText: "Want more love fortune messages?",
  },
  {
    id: "success",
    label: "Success",
    seoTitle: "Success & Career Fortune Cookie Messages",
    iconName: "trending-up",
    color: "border border-[#FFD6C5] bg-[#FFE4D6] text-[#E55328]",
    borderColor: "border-l-[#FFE4D6]",
    intro:
      "Motivating fortune cookie messages about achievement, career success, and reaching your goals. These success-themed sayings are perfect for corporate events, graduation parties, job promotions, or anyone needing a boost of professional motivation. Let these fortunes fuel your ambition.",
    viewAllPath: "/messages/success",
    ctaText: "Want more success messages?",
  },
  {
    id: "wisdom",
    label: "Wisdom",
    seoTitle: "Wisdom Fortune Cookie Messages",
    iconName: "brain",
    color: "border border-[#FFD6C5] bg-[#FFE4D6] text-[#E55328]",
    borderColor: "border-l-[#FFE4D6]",
    intro:
      "Thoughtful and philosophical fortune cookie messages offering timeless wisdom and life insights. These profound sayings draw from ancient philosophy and modern understanding, perfect for reflection, meditation, or sharing deep thoughts with friends seeking guidance and perspective.",
    viewAllPath: "/messages/wisdom",
    ctaText: "Want more wisdom fortunes?",
  },
  {
    id: "friendship",
    label: "Friendship",
    seoTitle: "Friendship Fortune Cookie Messages",
    iconName: "users",
    color: "border border-[#FFD6C5] bg-[#FFE4D6] text-[#E55328]",
    borderColor: "border-l-[#FFE4D6]",
    intro:
      "Celebrate the bonds of friendship with these heartwarming fortune cookie messages. Perfect for friend reunions, bestie gifts, friendship day celebrations, or simply reminding your friends how much they mean to you. These messages honor the beautiful connections that enrich our lives.",
    viewAllPath: "/messages/friendship",
    ctaText: "Want more friendship fortunes?",
  },
  {
    id: "birthday",
    label: "Birthday",
    seoTitle: "Birthday Fortune Cookie Messages",
    iconName: "cake",
    color: "border border-[#FFD6C5] bg-[#FFE4D6] text-[#E55328]",
    borderColor: "border-l-[#FFE4D6]",
    intro:
      "Make birthdays extra special with these celebratory fortune cookie messages. Ideal for birthday party favors, greeting cards, or adding a unique touch to birthday celebrations. These messages bring hope, joy, and positive predictions for the year ahead.",
    viewAllPath: "/messages/birthday",
    ctaText: "Want more birthday messages?",
  },
  {
    id: "study",
    label: "Study",
    seoTitle: "Study & Exam Motivation Messages",
    iconName: "book-open",
    color: "border border-[#FFD6C5] bg-[#FFE4D6] text-[#E55328]",
    borderColor: "border-l-[#FFE4D6]",
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
  const categoryMeta: Record<
    string,
    { totalCount: number; lastUpdated?: string }
  > = {};
  for (const category of categoryConfig) {
    const allMessages = getFortunesByCategory(category.id);
    categoryMessages[category.id] = allMessages.slice(0, 15);

    const latestTimestamp = allMessages.reduce((latest, message) => {
      const timestamp = new Date(message.dateAdded).getTime();
      if (Number.isNaN(timestamp)) {
        return latest;
      }
      return Math.max(latest, timestamp);
    }, 0);

    categoryMeta[category.id] = {
      totalCount: allMessages.length,
      lastUpdated: latestTimestamp
        ? new Date(latestTimestamp).toISOString().split("T")[0]
        : undefined,
    };
  }

  // Prepare message items for structured data (only first 5 per category for SEO)
  const messageItems = categoryConfig.flatMap((category) => {
    const messages = categoryMessages[category.id] || [];
    return messages.slice(0, 5).map((fortune) => ({
      name: fortune.message,
      description: `${category.label} fortune cookie message`,
      category: category.seoTitle,
    }));
  });

  return (
    <>
      <ItemListStructuredData
        name="Fortune Cookie Messages Collection"
        description={`Browse our complete collection of ${stats.total}+ fortune cookie messages including funny, inspirational, love, success, wisdom, friendship, birthday, and study motivation sayings. Find the perfect fortune for any occasion.`}
        url="/messages"
        items={messageItems}
      />
      <BreadcrumbStructuredData
        items={[
          { name: "Home", url: "/" },
          { name: "Fortune Cookie Messages", url: "/messages" },
        ]}
      />
      <FAQStructuredData faqs={messageFAQs} />
      <main className="min-h-screen w-full overflow-x-hidden relative bg-[#FAFAFA]">
        <DynamicBackgroundEffects />
        <div className="relative z-10">
          <div className="container mx-auto px-4 py-8">
            {/* Hero Section - SSR for SEO */}
            <div className="text-center mb-16">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#222222] mb-6">
                Fortune Cookie Messages
              </h1>
              <p className="text-lg md:text-xl text-[#555555] max-w-4xl mx-auto leading-relaxed mb-8">
                Browse hundreds of fortune cookie messages perfect for daily
                inspiration, parties, gift cards, printing, and social media
                captions. Discover funny, inspirational, love, success, wisdom,
                and friendship sayings—each with lucky numbers to brighten your
                day.
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                <Badge className="px-4 py-2 border border-[#FFD6C5] bg-[#FFE4D6] text-[#E55328]">
                  <Sparkles className="mr-2 h-4 w-4" />
                  {stats.total}+ Messages
                </Badge>
                <Badge className="px-4 py-2 border border-[#FFD6C5] bg-[#FFE4D6] text-[#E55328]">
                  <Star className="mr-2 h-4 w-4" />
                  {Object.keys(stats.categories).length} Categories
                </Badge>
                <Badge className="px-4 py-2 border border-[#FFD6C5] bg-[#FFE4D6] text-[#E55328]">
                  <TrendingUp className="mr-2 h-4 w-4" />
                  AI Generator Available
                </Badge>
              </div>
            </div>

            {/* Quick Navigation - SSR for SEO */}
            <section className="mb-16">
              <h2 className="text-xl font-semibold text-[#222222] mb-6 text-center">
                Jump to Category
              </h2>
              <div className="flex flex-wrap justify-center gap-3">
                {categoryConfig.map((category) => {
                  const IconComponent = iconComponents[category.iconName];
                  return (
                    <Link
                      key={category.id}
                      href={`#${category.id}`}
                      className={`inline-flex items-center gap-2 rounded-full px-4 py-2 transition-colors ${category.color} hover:bg-[#FFD6C5] hover:underline`}
                    >
                      <IconComponent className="h-4 w-4" />
                      <span className="text-sm font-medium">
                        {category.label}
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
              categoryMeta={categoryMeta}
            />
          </div>
        </div>
      </main>
    </>
  );
}
