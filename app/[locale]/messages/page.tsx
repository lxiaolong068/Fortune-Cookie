import { Metadata } from "next";
import { notFound } from "next/navigation";
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
import {
  i18n,
  isValidLocale,
  getLanguageConfig,
  getSEOConfig,
  type Locale,
} from "@/lib/i18n-config";
import { loadTranslations, getTranslation } from "@/lib/translations";
import { LocaleProvider } from "@/lib/locale-context";

const baseUrl = getSiteUrl();

// Generate static params for all locales
export function generateStaticParams() {
  return i18n.locales.map((locale) => ({
    locale,
  }));
}

// Generate metadata for each locale
export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const { locale } = params;

  if (!isValidLocale(locale)) {
    return {};
  }

  const stats = getDatabaseStats();
  const totalCount = stats.total;
  const seoConfig = getSEOConfig(locale);
  const langConfig = getLanguageConfig(locale);
  const translations = await loadTranslations(locale);

  const title =
    getTranslation(translations, "seo.messagesTitle") ||
    "Fortune Cookie Messages – Inspirational & Funny Quotes";
  const description =
    getTranslation(translations, "seo.messagesDescription") ||
    `Browse ${totalCount}+ fortune cookie messages for daily inspiration.`;

  // Generate alternate language links
  const alternates: Record<string, string> = {};
  for (const loc of i18n.locales) {
    const config = getLanguageConfig(loc);
    alternates[config.hreflang] =
      loc === i18n.defaultLocale
        ? `${baseUrl}/messages`
        : `${baseUrl}/${loc}/messages`;
  }

  const canonicalUrl =
    locale === i18n.defaultLocale
      ? `${baseUrl}/messages`
      : `${baseUrl}/${locale}/messages`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      url: canonicalUrl,
      siteName: seoConfig.siteName,
      locale: langConfig.hreflang.replace("-", "_"),
      images: [
        {
          url: getImageUrl("/og-image.png"),
          width: 1200,
          height: 630,
          alt: title,
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
      canonical: canonicalUrl,
      languages: alternates,
    },
  };
}

// Icon name to component mapping
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

// Category configuration
const categoryConfig: CategoryConfig[] = [
  {
    id: "inspirational",
    seoTitle: "Inspirational Fortune Cookie Messages",
    iconName: "star",
    color: "border border-[#FFD6C5] bg-[#FFE4D6] text-[#E55328]",
    borderColor: "border-l-[#FFE4D6]",
    intro:
      "Discover uplifting fortune cookie sayings that inspire positivity, motivation, and personal growth.",
    viewAllPath: "/messages/inspirational",
    ctaText: "Want more inspirational messages?",
  },
  {
    id: "funny",
    seoTitle: "Funny Fortune Cookie Messages",
    iconName: "smile",
    color: "border border-[#FFD6C5] bg-[#FFE4D6] text-[#E55328]",
    borderColor: "border-l-[#FFE4D6]",
    intro:
      "Get ready to laugh with our collection of hilarious fortune cookie sayings and witty jokes.",
    viewAllPath: "/funny-fortune-cookie-messages",
    ctaText: "Want more funny fortune cookies?",
  },
  {
    id: "love",
    seoTitle: "Love Fortune Cookie Messages",
    iconName: "heart",
    color: "border border-[#FFD6C5] bg-[#FFE4D6] text-[#E55328]",
    borderColor: "border-l-[#FFE4D6]",
    intro:
      "Explore romantic fortune cookie messages about love, relationships, and matters of the heart.",
    viewAllPath: "/messages/love",
    ctaText: "Want more love fortune messages?",
  },
  {
    id: "success",
    seoTitle: "Success & Career Fortune Cookie Messages",
    iconName: "trending-up",
    color: "border border-[#FFD6C5] bg-[#FFE4D6] text-[#E55328]",
    borderColor: "border-l-[#FFE4D6]",
    intro:
      "Motivating fortune cookie messages about achievement, career success, and reaching your goals.",
    viewAllPath: "/messages/success",
    ctaText: "Want more success messages?",
  },
  {
    id: "wisdom",
    seoTitle: "Wisdom Fortune Cookie Messages",
    iconName: "brain",
    color: "border border-[#FFD6C5] bg-[#FFE4D6] text-[#E55328]",
    borderColor: "border-l-[#FFE4D6]",
    intro:
      "Thoughtful and philosophical fortune cookie messages offering timeless wisdom and life insights.",
    viewAllPath: "/messages/wisdom",
    ctaText: "Want more wisdom fortunes?",
  },
  {
    id: "friendship",
    seoTitle: "Friendship Fortune Cookie Messages",
    iconName: "users",
    color: "border border-[#FFD6C5] bg-[#FFE4D6] text-[#E55328]",
    borderColor: "border-l-[#FFE4D6]",
    intro:
      "Celebrate the bonds of friendship with these heartwarming fortune cookie messages.",
    viewAllPath: "/messages/friendship",
    ctaText: "Want more friendship fortunes?",
  },
  {
    id: "birthday",
    seoTitle: "Birthday Fortune Cookie Messages",
    iconName: "cake",
    color: "border border-[#FFD6C5] bg-[#FFE4D6] text-[#E55328]",
    borderColor: "border-l-[#FFE4D6]",
    intro:
      "Make birthdays extra special with these celebratory fortune cookie messages.",
    viewAllPath: "/messages/birthday",
    ctaText: "Want more birthday messages?",
  },
  {
    id: "study",
    seoTitle: "Study & Exam Motivation Messages",
    iconName: "book-open",
    color: "border border-[#FFD6C5] bg-[#FFE4D6] text-[#E55328]",
    borderColor: "border-l-[#FFE4D6]",
    intro:
      "Inspiring fortune cookie messages for students, test-takers, and lifelong learners.",
    viewAllPath: "/messages/study",
    ctaText: "Want more study motivation?",
  },
];

interface MessagesPageProps {
  params: {
    locale: string;
  };
}

export default async function LocaleMessagesPage({
  params,
}: MessagesPageProps) {
  const { locale } = params;

  // Validate locale
  if (!isValidLocale(locale)) {
    notFound();
  }

  // Load translations
  const translations = await loadTranslations(locale as Locale);

  // Helper function to get translation
  const t = (key: string, p?: Record<string, string | number>) =>
    getTranslation(translations, key, p);

  // Get localized path helper
  const getLocalizedHref = (path: string) => {
    if (locale === i18n.defaultLocale) {
      return path;
    }
    return `/${locale}${path}`;
  };

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

  // Prepare message items for structured data
  const messageItems = categoryConfig.flatMap((category) => {
    const messages = categoryMessages[category.id] || [];
    return messages.slice(0, 5).map((fortune) => ({
      name: fortune.message,
      description: `${category.seoTitle.replace(" Fortune Cookie Messages", "").replace(" Messages", "")} fortune cookie message`,
      category: category.seoTitle,
    }));
  });

  return (
    <LocaleProvider
      initialLocale={locale as Locale}
      initialTranslations={translations}
    >
      <ItemListStructuredData
        name="Fortune Cookie Messages Collection"
        description={`Browse our complete collection of ${stats.total}+ fortune cookie messages.`}
        url={getLocalizedHref("/messages")}
        items={messageItems}
      />
      <BreadcrumbStructuredData
        items={[
          { name: t("navigation.home"), url: getLocalizedHref("/") },
          {
            name: t("navigation.messages"),
            url: getLocalizedHref("/messages"),
          },
        ]}
      />
      <main className="min-h-screen w-full overflow-x-hidden relative bg-[#FAFAFA]">
        <DynamicBackgroundEffects />
        <div className="relative z-10">
          <div className="container mx-auto px-4 py-8">
            {/* Hero Section */}
            <div className="text-center mb-16">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#222222] mb-6">
                {t("messages.title")}
              </h1>
              <p className="text-lg md:text-xl text-[#555555] max-w-4xl mx-auto leading-relaxed mb-8">
                {t("messages.subtitle")}
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                <Badge className="px-4 py-2 border border-[#FFD6C5] bg-[#FFE4D6] text-[#E55328]">
                  <Sparkles className="mr-2 h-4 w-4" />
                  {stats.total}+ {t("messages.title")}
                </Badge>
                <Badge className="px-4 py-2 border border-[#FFD6C5] bg-[#FFE4D6] text-[#E55328]">
                  <Star className="mr-2 h-4 w-4" />
                  {Object.keys(stats.categories).length}{" "}
                  {t("browse.categories")}
                </Badge>
                <Badge className="px-4 py-2 border border-[#FFD6C5] bg-[#FFE4D6] text-[#E55328]">
                  <TrendingUp className="mr-2 h-4 w-4" />
                  {t("navigation.generator")}
                </Badge>
              </div>
            </div>

            {/* Quick Navigation */}
            <section className="mb-16">
              <h2 className="text-xl font-semibold text-[#222222] mb-6 text-center">
                {t("browse.categories")}
              </h2>
              <div className="flex flex-wrap justify-center gap-3">
                {categoryConfig.map((category) => {
                  const IconComponent = iconComponents[category.iconName];
                  // Try to get localized category name from translations
                  const categoryName =
                    t(`generator.themes.${category.id}`) ||
                    category.seoTitle
                      .replace(" Fortune Cookie Messages", "")
                      .replace(" Messages", "");
                  return (
                    <Link
                      key={category.id}
                      href={`#${category.id}`}
                      className={`inline-flex items-center gap-2 rounded-full px-4 py-2 transition-colors ${category.color} hover:bg-[#FFD6C5] hover:underline`}
                    >
                      <IconComponent className="h-4 w-4" />
                      <span className="text-sm font-medium">
                        {categoryName}
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
    </LocaleProvider>
  );
}
