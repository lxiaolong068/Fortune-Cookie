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
  localizeFortunes,
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

type CategoryBaseConfig = Omit<
  CategoryConfig,
  "label" | "seoTitle" | "intro" | "ctaText"
>;

// Category configuration
const categoryBaseConfig: CategoryBaseConfig[] = [
  {
    id: "inspirational",
    iconName: "star",
    color: "border border-[#FFD6C5] bg-[#FFE4D6] text-[#E55328]",
    borderColor: "border-l-[#FFE4D6]",
    viewAllPath: "/messages/inspirational",
  },
  {
    id: "funny",
    iconName: "smile",
    color: "border border-[#FFD6C5] bg-[#FFE4D6] text-[#E55328]",
    borderColor: "border-l-[#FFE4D6]",
    viewAllPath: "/funny-fortune-cookie-messages",
  },
  {
    id: "love",
    iconName: "heart",
    color: "border border-[#FFD6C5] bg-[#FFE4D6] text-[#E55328]",
    borderColor: "border-l-[#FFE4D6]",
    viewAllPath: "/messages/love",
  },
  {
    id: "success",
    iconName: "trending-up",
    color: "border border-[#FFD6C5] bg-[#FFE4D6] text-[#E55328]",
    borderColor: "border-l-[#FFE4D6]",
    viewAllPath: "/messages/success",
  },
  {
    id: "wisdom",
    iconName: "brain",
    color: "border border-[#FFD6C5] bg-[#FFE4D6] text-[#E55328]",
    borderColor: "border-l-[#FFE4D6]",
    viewAllPath: "/messages/wisdom",
  },
  {
    id: "friendship",
    iconName: "users",
    color: "border border-[#FFD6C5] bg-[#FFE4D6] text-[#E55328]",
    borderColor: "border-l-[#FFE4D6]",
    viewAllPath: "/messages/friendship",
  },
  {
    id: "birthday",
    iconName: "cake",
    color: "border border-[#FFD6C5] bg-[#FFE4D6] text-[#E55328]",
    borderColor: "border-l-[#FFE4D6]",
    viewAllPath: "/messages/birthday",
  },
  {
    id: "study",
    iconName: "book-open",
    color: "border border-[#FFD6C5] bg-[#FFE4D6] text-[#E55328]",
    borderColor: "border-l-[#FFE4D6]",
    viewAllPath: "/messages/study",
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
  const resolvedLocale = locale as Locale;
  const translations = await loadTranslations(resolvedLocale);

  // Helper function to get translation
  const t = (key: string, p?: Record<string, string | number>) =>
    getTranslation(translations, key, p);

  // Get localized path helper
  const getLocalizedHref = (path: string) => {
    if (resolvedLocale === i18n.defaultLocale) {
      return path;
    }
    return `/${resolvedLocale}${path}`;
  };

  const categoryConfig: CategoryConfig[] = categoryBaseConfig.map(
    (category) => {
      const label = t(`generator.themes.${category.id}`);
      return {
        ...category,
        label:
          label === `generator.themes.${category.id}` ? category.id : label,
        seoTitle: t(`messages.categories.${category.id}.title`),
        intro: t(`messages.categories.${category.id}.intro`),
        ctaText: t(`messages.categories.${category.id}.cta`),
      };
    },
  );

  const stats = getDatabaseStats();

  // Pre-fetch all category messages (server-side)
  const categoryMessages: Record<string, FortuneMessage[]> = {};
  const categoryMeta: Record<
    string,
    { totalCount: number; lastUpdated?: string }
  > = {};

  for (const category of categoryConfig) {
    const allMessages = getFortunesByCategory(category.id);
    categoryMessages[category.id] = localizeFortunes(
      allMessages.slice(0, 15),
      resolvedLocale,
    );

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
      description: t("messages.category.structuredDescription", {
        category: category.label,
      }),
      category: category.seoTitle,
    }));
  });

  return (
    <LocaleProvider
      initialLocale={resolvedLocale}
      initialTranslations={translations}
    >
      <ItemListStructuredData
        name={t("messages.structuredData.collectionName")}
        description={t("messages.structuredData.collectionDescription", {
          count: stats.total,
        })}
        url={getLocalizedHref("/messages")}
        items={messageItems}
      />
      <BreadcrumbStructuredData
        items={[
          { name: t("navigation.home"), url: getLocalizedHref("/") },
          {
            name: t("navigation.explore"),
            url: getLocalizedHref("/explore"),
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
                  const categoryName = category.label;
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
