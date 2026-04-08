import { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/site";
import {
  i18n,
  getLocalizedPath,
  languages,
  type Locale,
} from "@/lib/i18n-config";
import { getDatabaseStats } from "@/lib/fortune-database";
import {
  getBlogPosts,
  getAvailableBlogLocales,
  getAllLocalizedSlugs,
  getAvailableTranslations,
} from "@/lib/blog";
import { getAllOccasionSlugs } from "@/lib/pseo/occasions";
import { getAllQuoteSlugs } from "@/lib/pseo/quotes";
import { getAllAudienceSlugs } from "@/lib/pseo/audiences";
import { getAllActivitySlugs } from "@/lib/pseo/activities";

type ChangeFrequency = NonNullable<MetadataRoute.Sitemap[number]["changeFrequency"]>;

interface PageConfig {
  path: string;
  priority: number;
  changeFrequency: ChangeFrequency;
  lastModified: Date;
}

function buildAlternates(
  baseUrl: string,
  pathByLocale: Partial<Record<Locale, string>>,
): Record<string, string> {
  const alternates: Record<string, string> = {};

  for (const locale of i18n.locales) {
    const localePath = pathByLocale[locale];
    if (!localePath) continue;
    alternates[languages[locale].hreflang] = `${baseUrl}${localePath}`;
  }

  const defaultPath = pathByLocale[i18n.defaultLocale];
  if (defaultPath) {
    alternates["x-default"] = `${baseUrl}${defaultPath}`;
  }

  return alternates;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = getSiteUrl();
  const sitemapEntries: MetadataRoute.Sitemap = [];

  const now = new Date();
  const staticContentDate = new Date("2025-10-01");
  const legalPagesDate = new Date("2025-10-01");
  const dynamicContentDate = now; // user-generated content, always "fresh"
  const weeklyContentDate = now; // regularly updated pages

  const pages: PageConfig[] = [
    { path: "/", priority: 1.0, changeFrequency: "daily", lastModified: weeklyContentDate },
    { path: "/generator", priority: 0.9, changeFrequency: "daily", lastModified: weeklyContentDate },
    { path: "/explore", priority: 0.8, changeFrequency: "weekly", lastModified: weeklyContentDate },
    { path: "/browse", priority: 0.8, changeFrequency: "weekly", lastModified: weeklyContentDate },
    { path: "/search", priority: 0.6, changeFrequency: "weekly", lastModified: weeklyContentDate },
    { path: "/history", priority: 0.7, changeFrequency: "monthly", lastModified: staticContentDate },
    { path: "/recipes", priority: 0.7, changeFrequency: "monthly", lastModified: staticContentDate },
    { path: "/who-invented-fortune-cookies", priority: 0.6, changeFrequency: "monthly", lastModified: staticContentDate },
    { path: "/how-to-make-fortune-cookies", priority: 0.6, changeFrequency: "monthly", lastModified: staticContentDate },
    { path: "/funny-fortune-cookie-messages", priority: 0.6, changeFrequency: "weekly", lastModified: weeklyContentDate },
    { path: "/free-online-fortune-cookie", priority: 0.8, changeFrequency: "weekly", lastModified: weeklyContentDate },
    // NOTE: /profile is intentionally excluded — it's behind a login wall (noindex)
    // NOTE: /offline is intentionally excluded — it's an offline fallback page (noindex)
    { path: "/favorites", priority: 0.6, changeFrequency: "weekly", lastModified: dynamicContentDate },
    { path: "/faq", priority: 0.7, changeFrequency: "monthly", lastModified: staticContentDate },
    { path: "/cookies", priority: 0.4, changeFrequency: "monthly", lastModified: legalPagesDate },
    { path: "/about", priority: 0.5, changeFrequency: "monthly", lastModified: staticContentDate },
    { path: "/privacy", priority: 0.3, changeFrequency: "yearly", lastModified: legalPagesDate },
    { path: "/terms", priority: 0.3, changeFrequency: "yearly", lastModified: legalPagesDate },
  ];

  // Use /browse/category/[category] static pages instead of /explore?category=xxx query params.
  // URL parameters are generally ignored by Google and waste crawl budget.
  const stats = getDatabaseStats();
  for (const category of Object.keys(stats.categories)) {
    pages.push({
      path: `/browse/category/${category}`,
      priority: 0.7,
      changeFrequency: "weekly",
      lastModified: weeklyContentDate,
    });
  }

  const allTags = [
    "motivation",
    "action",
    "future",
    "success",
    "love",
    "humor",
    "wisdom",
    "self-improvement",
    "relationships",
    "happiness",
    "career",
    "health",
    "money",
    "friendship",
    "family",
    "gratitude",
    "patience",
    "courage",
    "creativity",
    "learning",
  ];
  for (const tag of allTags) {
    pages.push({
      path: `/tag/${encodeURIComponent(tag)}`,
      priority: 0.6,
      changeFrequency: "weekly",
      lastModified: weeklyContentDate,
    });
  }

  // pSEO Hub pages
  const pSEOHubs = [
    "/fortune-cookie-messages",
    "/fortune-cookie-quotes",
    "/fortune-cookie-messages-for",
    "/fortune-cookie-ideas",
  ];
  for (const hubPath of pSEOHubs) {
    pages.push({
      path: hubPath,
      priority: 0.8,
      changeFrequency: "weekly",
      lastModified: weeklyContentDate,
    });
  }

  // pSEO spoke pages — Template A (occasions)
  for (const slug of getAllOccasionSlugs()) {
    pages.push({
      path: `/fortune-cookie-messages/${slug}`,
      priority: 0.7,
      changeFrequency: "monthly",
      lastModified: weeklyContentDate,
    });
  }

  // pSEO spoke pages — Template B (quotes)
  for (const slug of getAllQuoteSlugs()) {
    pages.push({
      path: `/fortune-cookie-quotes/${slug}`,
      priority: 0.7,
      changeFrequency: "monthly",
      lastModified: weeklyContentDate,
    });
  }

  // pSEO spoke pages — Template C (audiences)
  for (const slug of getAllAudienceSlugs()) {
    pages.push({
      path: `/fortune-cookie-messages-for/${slug}`,
      priority: 0.6,
      changeFrequency: "monthly",
      lastModified: weeklyContentDate,
    });
  }

  // pSEO spoke pages — Template D (activities)
  for (const slug of getAllActivitySlugs()) {
    pages.push({
      path: `/fortune-cookie-ideas/${slug}`,
      priority: 0.6,
      changeFrequency: "monthly",
      lastModified: weeklyContentDate,
    });
  }

  // Regular pages: generate EN/ZH entries and full EN/ZH alternates.
  for (const page of pages) {
    const pathByLocale = Object.fromEntries(
      i18n.locales.map((locale) => [locale, getLocalizedPath(page.path, locale)]),
    ) as Record<Locale, string>;
    const alternates = buildAlternates(baseUrl, pathByLocale);

    for (const locale of i18n.locales) {
      sitemapEntries.push({
        url: `${baseUrl}${pathByLocale[locale]}`,
        lastModified: page.lastModified,
        changeFrequency: page.changeFrequency,
        priority: page.priority,
        alternates: { languages: alternates },
      });
    }
  }

  // Blog list pages: only locales that actually have blog content.
  const blogLocales = getAvailableBlogLocales().filter((locale) =>
    i18n.locales.includes(locale),
  );
  if (blogLocales.length > 0) {
    const blogPathByLocale = {} as Partial<Record<Locale, string>>;
    for (const locale of blogLocales) {
      blogPathByLocale[locale] =
        locale === i18n.defaultLocale ? "/blog" : `/${locale}/blog`;
    }
    const blogAlternates = buildAlternates(baseUrl, blogPathByLocale);

    for (const locale of blogLocales) {
      const localePath = blogPathByLocale[locale];
      if (!localePath) continue;
      sitemapEntries.push({
        url: `${baseUrl}${localePath}`,
        lastModified: weeklyContentDate,
        changeFrequency: "weekly",
        priority: 0.8,
        alternates: { languages: blogAlternates },
      });
    }
  }

  // Blog detail pages: generate by actual translation availability per slug.
  const blogPostsByLocale = new Map<Locale, ReturnType<typeof getBlogPosts>>();
  for (const locale of i18n.locales) {
    blogPostsByLocale.set(locale, getBlogPosts({ locale }));
  }

  const uniqueSlugs = Array.from(new Set(getAllLocalizedSlugs().map((item) => item.slug)));
  for (const slug of uniqueSlugs) {
    const availableLocales = getAvailableTranslations(slug).availableLocales.filter(
      (locale) => i18n.locales.includes(locale),
    );
    if (availableLocales.length === 0) continue;

    const pathByLocale = {} as Partial<Record<Locale, string>>;
    for (const locale of availableLocales) {
      pathByLocale[locale] =
        locale === i18n.defaultLocale ? `/blog/${slug}` : `/${locale}/blog/${slug}`;
    }
    const alternates = buildAlternates(baseUrl, pathByLocale);

    for (const locale of availableLocales) {
      const localePath = pathByLocale[locale];
      if (!localePath) continue;

      const localePost = blogPostsByLocale
        .get(locale)
        ?.find((post) => post.slug === slug);

      sitemapEntries.push({
        url: `${baseUrl}${localePath}`,
        lastModified: localePost ? new Date(localePost.date) : weeklyContentDate,
        changeFrequency: "monthly",
        priority: 0.7,
        alternates: { languages: alternates },
      });
    }
  }

  return sitemapEntries;
}
