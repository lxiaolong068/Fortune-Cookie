import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { DynamicBackgroundEffects } from "@/components/DynamicBackgroundEffects";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles } from "lucide-react";
import {
  BreadcrumbStructuredData,
  ItemListStructuredData,
} from "@/components/StructuredData";
import { getSiteUrl, getImageUrl } from "@/lib/site";
import {
  getFortunesByCategory,
  getDatabaseStats,
  type FortuneCategory,
  localizeFortunes,
} from "@/lib/fortune-database";
import {
  i18n,
  isValidLocale,
  getLanguageConfig,
  getSEOConfig,
  type Locale,
} from "@/lib/i18n-config";
import { loadTranslations, getTranslation } from "@/lib/translations";
import { LocaleProvider } from "@/lib/locale-context";
import { categoryConfig, categoryBadgeColors } from "@/lib/category-config";

const baseUrl = getSiteUrl();

const categoryKeys = Object.keys(categoryConfig) as FortuneCategory[];
const messageCategoryKeys = new Set<FortuneCategory>([
  "inspirational",
  "funny",
  "love",
  "success",
  "wisdom",
  "friendship",
  "birthday",
  "study",
]);

function getLocalizedHref(locale: Locale, path: string) {
  if (locale === i18n.defaultLocale) {
    return path;
  }
  return `/${locale}${path}`;
}

function getLocalizedCategoryLabel(
  category: FortuneCategory,
  translations: Awaited<ReturnType<typeof loadTranslations>>,
) {
  const key = `generator.themes.${category}`;
  const translated = getTranslation(translations, key);
  if (translated !== key) {
    return translated;
  }
  return category.charAt(0).toUpperCase() + category.slice(1);
}

function resolveCategoryTitle(
  translations: Awaited<ReturnType<typeof loadTranslations>>,
  category: FortuneCategory,
  label: string,
) {
  if (messageCategoryKeys.has(category)) {
    const seoKey = `messages.categories.${category}.title`;
    const seoTitle = getTranslation(translations, seoKey);
    if (seoTitle !== seoKey) {
      return seoTitle;
    }
  }
  const fallbackKey = "browse.categoryTitle";
  const fallback = getTranslation(translations, fallbackKey, {
    category: label,
  });
  if (fallback !== fallbackKey) {
    return fallback;
  }
  return `${label} Fortune Messages`;
}

function resolveCategoryDescription(
  translations: Awaited<ReturnType<typeof loadTranslations>>,
  category: FortuneCategory,
  label: string,
) {
  if (messageCategoryKeys.has(category)) {
    const introKey = `messages.categories.${category}.intro`;
    const intro = getTranslation(translations, introKey);
    if (intro !== introKey) {
      return intro;
    }
  }
  const fallbackKey = "browse.categoryDescription";
  const fallback = getTranslation(translations, fallbackKey, {
    category: label,
  });
  if (fallback !== fallbackKey) {
    return fallback;
  }
  return `Explore ${label} fortune cookie messages.`;
}

export function generateStaticParams() {
  return i18n.locales.flatMap((locale) =>
    categoryKeys.map((category) => ({
      locale,
      category,
    })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: { locale: string; category: string };
}): Promise<Metadata> {
  const { locale, category } = params;

  if (!isValidLocale(locale)) {
    return {};
  }

  if (!categoryKeys.includes(category as FortuneCategory)) {
    return { title: "Category Not Found" };
  }

  const translations = await loadTranslations(locale);
  const label = getLocalizedCategoryLabel(
    category as FortuneCategory,
    translations,
  );
  const title = resolveCategoryTitle(
    translations,
    category as FortuneCategory,
    label,
  );
  const description = resolveCategoryDescription(
    translations,
    category as FortuneCategory,
    label,
  );
  const seoConfig = getSEOConfig(locale);
  const langConfig = getLanguageConfig(locale);

  const canonicalUrl =
    locale === i18n.defaultLocale
      ? `${baseUrl}/browse/category/${category}`
      : `${baseUrl}/${locale}/browse/category/${category}`;

  const alternates: Record<string, string> = {};
  for (const loc of i18n.locales) {
    const config = getLanguageConfig(loc);
    alternates[config.hreflang] =
      loc === i18n.defaultLocale
        ? `${baseUrl}/browse/category/${category}`
        : `${baseUrl}/${loc}/browse/category/${category}`;
  }

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

interface CategoryPageProps {
  params: {
    locale: string;
    category: string;
  };
}

export default async function LocaleBrowseCategoryPage({
  params,
}: CategoryPageProps) {
  const { locale, category } = params;

  if (!isValidLocale(locale)) {
    notFound();
  }

  if (!categoryKeys.includes(category as FortuneCategory)) {
    notFound();
  }

  const resolvedLocale = locale as Locale;
  const translations = await loadTranslations(resolvedLocale);
  const label = getLocalizedCategoryLabel(
    category as FortuneCategory,
    translations,
  );
  const description = resolveCategoryDescription(
    translations,
    category as FortuneCategory,
    label,
  );
  const title = resolveCategoryTitle(
    translations,
    category as FortuneCategory,
    label,
  );

  const stats = getDatabaseStats();
  const fortunes = localizeFortunes(
    getFortunesByCategory(category as FortuneCategory),
    resolvedLocale,
  );
  const config = categoryConfig[category as FortuneCategory];
  const Icon = config.icon;
  const badgeColor =
    categoryBadgeColors[category] || "bg-gray-100 text-gray-800";

  const t = (key: string, p?: Record<string, string | number>) =>
    getTranslation(translations, key, p);

  const localizedBrowseHref = getLocalizedHref(resolvedLocale, "/browse");

  return (
    <LocaleProvider
      initialLocale={resolvedLocale}
      initialTranslations={translations}
    >
      <BreadcrumbStructuredData
        items={[
          {
            name: t("navigation.home"),
            url: getLocalizedHref(resolvedLocale, "/"),
          },
          {
            name: t("navigation.explore"),
            url: getLocalizedHref(resolvedLocale, "/explore"),
          },
          {
            name: title,
            url: getLocalizedHref(
              resolvedLocale,
              `/browse/category/${category}`,
            ),
          },
        ]}
      />

      <ItemListStructuredData
        name={title}
        description={description}
        url={getLocalizedHref(resolvedLocale, `/browse/category/${category}`)}
        items={fortunes.slice(0, 20).map((fortune) => ({
          name: fortune.message,
          description: t("messages.category.structuredDescription", {
            category: label,
          }),
        }))}
      />

      <main className="min-h-screen w-full overflow-x-hidden relative">
        <DynamicBackgroundEffects />
        <div className="relative z-10">
          <div className="container mx-auto px-4 py-8">
            {/* Header */}
            <div className="text-center mb-12">
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className={`p-3 rounded-full ${config.bgColor}`}>
                  <Icon className={`w-8 h-8 ${config.color}`} />
                </div>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-amber-600 via-yellow-600 to-orange-600 bg-clip-text text-transparent mb-4">
                {title}
              </h1>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-6">
                {description}
              </p>

              <div className="flex flex-wrap justify-center gap-3">
                <Badge className="bg-blue-100 text-blue-800 py-1.5 px-3">
                  {t("browse.stats.totalMessages", { count: stats.total })}
                </Badge>
                <Badge className="bg-green-100 text-green-800 py-1.5 px-3">
                  {t("browse.stats.categories", {
                    count: Object.keys(stats.categories).length,
                  })}
                </Badge>
                <Badge className="bg-purple-100 text-purple-800 py-1.5 px-3">
                  {t("browse.stats.tags", { count: stats.tags })}
                </Badge>
              </div>

              <Link href={localizedBrowseHref}>
                <Badge
                  variant="outline"
                  className="hover:bg-amber-50 cursor-pointer transition-colors mt-6"
                >
                  ← {t("browse.backToBrowse")}
                </Badge>
              </Link>
            </div>

            {/* Fortune List */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {fortunes.map((fortune) => (
                <Card
                  key={fortune.id}
                  className="p-6 bg-white/90 backdrop-blur-sm border-amber-200 hover:shadow-lg transition-all duration-200 hover:scale-105"
                >
                  <div className="flex items-start justify-between mb-3">
                    <Badge className={badgeColor}>
                      <Icon className="w-3 h-3 mr-1" />
                      {label}
                    </Badge>
                    <div className="flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-amber-500" />
                      <span className="text-xs text-gray-500">
                        {fortune.popularity}/10
                      </span>
                    </div>
                  </div>

                  <blockquote className="text-gray-700 italic leading-relaxed mb-4">
                    &ldquo;{fortune.message}&rdquo;
                  </blockquote>

                  <div className="space-y-3">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">
                        {t("generator.luckyNumbers")}:
                      </p>
                      <div className="flex gap-1">
                        {fortune.luckyNumbers.map((number) => (
                          <span
                            key={number}
                            className="w-6 h-6 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center text-white text-xs font-medium"
                          >
                            {number}
                          </span>
                        ))}
                      </div>
                    </div>

                    {fortune.tags.length > 0 && (
                      <div>
                        <p className="text-xs text-gray-500 mb-1">
                          {t("messages.tagsLabel")}:
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {fortune.tags.slice(0, 3).map((tag) => (
                            <Badge
                              key={tag}
                              variant="outline"
                              className="text-xs"
                            >
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </main>
    </LocaleProvider>
  );
}
