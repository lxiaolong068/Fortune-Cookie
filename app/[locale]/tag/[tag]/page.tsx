import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Tag, ArrowRight, Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Breadcrumbs } from "@/components/InternalLinks";
import {
  BreadcrumbStructuredData,
  ItemListStructuredData,
} from "@/components/StructuredData";
import {
  fortuneDatabase,
  type FortuneMessage,
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
import { getSiteUrl, getImageUrl } from "@/lib/site";

interface PageProps {
  params: { locale: string; tag: string };
}

const baseUrl = getSiteUrl();

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
    fortune.tags.some((t) => t.toLowerCase() === tag.toLowerCase()),
  );
}

// Format tag for display
function formatTagName(tag: string): string {
  return tag
    .split(/[-_\s]/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

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

export async function generateStaticParams() {
  const tags = getAllTags();
  return i18n.locales.flatMap((locale) =>
    tags.map((tag) => ({
      locale,
      tag: encodeURIComponent(tag),
    })),
  );
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale, tag } = params;
  if (!isValidLocale(locale)) {
    return {};
  }

  const decodedTag = decodeURIComponent(tag);
  const fortunes = getFortunesByTag(decodedTag);
  const translations = await loadTranslations(locale);

  const formattedTag = formatTagName(decodedTag);
  const metaTitleKey = "tagsPage.metaTitle";
  const metaTitle = getTranslation(translations, metaTitleKey, {
    tag: formattedTag,
  });
  const metaDescriptionKey = "tagsPage.metaDescription";
  const metaDescription = getTranslation(translations, metaDescriptionKey, {
    count: fortunes.length,
    tag: decodedTag,
  });

  const title =
    metaTitle !== metaTitleKey ? metaTitle : `${formattedTag} Fortune Messages`;
  const description =
    metaDescription !== metaDescriptionKey
      ? metaDescription
      : `Discover ${fortunes.length}+ fortune cookie messages about ${decodedTag}.`;

  if (fortunes.length === 0) {
    const noTagKey = "tagsPage.noTagTitle";
    const noTagTitle = getTranslation(translations, noTagKey);
    return {
      title: noTagTitle !== noTagKey ? noTagTitle : "Tag Not Found",
    };
  }

  const seoConfig = getSEOConfig(locale);
  const langConfig = getLanguageConfig(locale);

  const canonicalUrl =
    locale === i18n.defaultLocale
      ? `${baseUrl}/tag/${tag}`
      : `${baseUrl}/${locale}/tag/${tag}`;

  const alternates: Record<string, string> = {};
  for (const loc of i18n.locales) {
    const config = getLanguageConfig(loc);
    alternates[config.hreflang] =
      loc === i18n.defaultLocale
        ? `${baseUrl}/tag/${tag}`
        : `${baseUrl}/${loc}/tag/${tag}`;
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

export default async function LocaleTagPage({ params }: PageProps) {
  const { locale, tag } = params;
  if (!isValidLocale(locale)) {
    notFound();
  }

  const resolvedLocale = locale as Locale;
  const decodedTag = decodeURIComponent(tag);
  const fortunes = getFortunesByTag(decodedTag);
  if (fortunes.length === 0) {
    notFound();
  }

  const translations = await loadTranslations(resolvedLocale);
  const t = (key: string, p?: Record<string, string | number>) =>
    getTranslation(translations, key, p);

  const formattedTag = formatTagName(decodedTag);
  const allTags = getAllTags();
  const localizedBrowseHref = getLocalizedHref(resolvedLocale, "/browse");
  const localizedFortunes = localizeFortunes(fortunes, resolvedLocale);

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

  // Breadcrumb items - use explore page
  const localizedExploreHref = getLocalizedHref(resolvedLocale, "/explore");
  const navBreadcrumbs = [
    { name: t("navigation.home"), href: getLocalizedHref(resolvedLocale, "/") },
    { name: t("navigation.explore"), href: localizedExploreHref },
    { name: formattedTag },
  ];

  const metaTitleKey = "tagsPage.metaTitle";
  const pageTitle =
    t(metaTitleKey, { tag: formattedTag }) !== metaTitleKey
      ? t(metaTitleKey, { tag: formattedTag })
      : `${formattedTag} Fortune Messages`;

  const pageDescriptionKey = "tagsPage.metaDescription";
  const pageDescription =
    t(pageDescriptionKey, { count: fortunes.length, tag: decodedTag }) !==
    pageDescriptionKey
      ? t(pageDescriptionKey, { count: fortunes.length, tag: decodedTag })
      : `Collection of ${fortunes.length} fortune cookie messages about ${decodedTag}`;

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
          { name: t("navigation.explore"), url: localizedExploreHref },
          {
            name: formattedTag,
            url: getLocalizedHref(resolvedLocale, `/tag/${tag}`),
          },
        ]}
      />

      <ItemListStructuredData
        name={pageTitle}
        description={pageDescription}
        url={getLocalizedHref(resolvedLocale, `/tag/${tag}`)}
        items={localizedFortunes.slice(0, 10).map((fortune) => ({
          name: fortune.message,
          description: t("messages.category.structuredDescription", {
            category: formattedTag,
          }),
        }))}
      />

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
              {t("tagsPage.title", { tag: formattedTag })}
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              {t("tagsPage.subtitle", { tag: decodedTag })}
            </p>
            <Badge className="bg-amber-100 text-amber-700 text-sm px-4 py-1">
              {t("tagsPage.messagesFound", { count: fortunes.length })}
            </Badge>
          </div>
        </section>

        {/* Fortune Messages Grid */}
        <section className="container mx-auto px-4 py-8">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {localizedFortunes.map((fortune) => (
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
                      <Link
                        key={t}
                        href={getLocalizedHref(
                          resolvedLocale,
                          `/tag/${encodeURIComponent(t.toLowerCase())}`,
                        )}
                      >
                        <Badge
                          variant={
                            t.toLowerCase() === decodedTag.toLowerCase()
                              ? "default"
                              : "outline"
                          }
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
                    <span>
                      {getLocalizedCategoryLabel(
                        fortune.category,
                        translations,
                      )}
                    </span>
                    {fortune.luckyNumbers && (
                      <div className="flex items-center gap-1">
                        <span>{t("messages.category.luckyLabel")}</span>
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
              {t("tagsPage.relatedTags")}
            </h2>
            <div className="flex flex-wrap justify-center gap-2">
              {relatedTagsArray.map((t) => (
                <Link
                  key={t}
                  href={getLocalizedHref(
                    resolvedLocale,
                    `/tag/${encodeURIComponent(t)}`,
                  )}
                >
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
            {t("tagsPage.allTags")}
          </h2>
          <div className="flex flex-wrap justify-center gap-2 max-w-4xl mx-auto">
            {allTags.slice(0, 30).map((t) => {
              const count = getFortunesByTag(t).length;
              return (
                <Link
                  key={t}
                  href={getLocalizedHref(
                    resolvedLocale,
                    `/tag/${encodeURIComponent(t)}`,
                  )}
                >
                  <Badge
                    variant={
                      t === decodedTag.toLowerCase() ? "default" : "secondary"
                    }
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
                {t("tagsPage.ctaTitle")}
              </h2>
              <p className="text-white/90 mb-6 max-w-xl mx-auto">
                {t("tagsPage.ctaDescription", { tag: decodedTag })}
              </p>
              <Button
                asChild
                size="lg"
                className="bg-white text-amber-600 hover:bg-amber-50"
              >
                <Link href={getLocalizedHref(resolvedLocale, "/generator")}>
                  {t("tagsPage.ctaButton")}{" "}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </section>
      </div>
    </LocaleProvider>
  );
}
