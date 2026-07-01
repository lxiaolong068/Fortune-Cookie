import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import {
  i18n,
  isValidLocale,
  languages,
  getSEOConfig,
} from "@/lib/i18n-config";
import { getSiteMetadata, getOGImageConfig } from "@/lib/site";
import { loadTranslations } from "@/lib/translations";
import { AppShell } from "@/app/_shell/AppShell";

// Root layout for the /[locale] branch — mirror the default-branch viewport.
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fffbeb" },
    { media: "(prefers-color-scheme: dark)", color: "#1e1b4b" },
  ],
  colorScheme: "light dark",
};

/**
 * Generate static params for all supported locales
 */
export function generateStaticParams() {
  // Exclude the default locale ('en') — English is served at the root path (e.g. /generator),
  // not under a locale prefix (/en/generator). Including 'en' here creates duplicate routes
  // that confuse Google and waste crawl budget.
  return i18n.locales
    .filter((locale) => locale !== i18n.defaultLocale)
    .map((locale) => ({ locale }));
}

/**
 * Generate metadata for each locale
 */
export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const { locale } = params;

  // Validate locale
  if (!isValidLocale(locale)) {
    return {};
  }

  const seoConfig = getSEOConfig(locale);
  const siteMetadata = getSiteMetadata();
  const ogImage = getOGImageConfig();
  const langConfig = languages[locale];

  // Generate alternate language links
  const alternateLanguages: Record<string, string> = {};
  i18n.locales.forEach((loc) => {
    const langHreflang = languages[loc].hreflang;
    if (loc === i18n.defaultLocale) {
      alternateLanguages[langHreflang] = siteMetadata.baseUrl;
    } else {
      alternateLanguages[langHreflang] = `${siteMetadata.baseUrl}/${loc}`;
    }
  });

  return {
    title: {
      default: seoConfig.title,
      template: `%s | ${seoConfig.title.split(" - ")[0]}`,
    },
    description: seoConfig.description,
    keywords: seoConfig.keywords,
    authors: [{ name: siteMetadata.author }],
    creator: siteMetadata.creator,
    publisher: siteMetadata.publisher,
    metadataBase: new URL(siteMetadata.baseUrl),
    alternates: {
      canonical: locale === i18n.defaultLocale ? "/" : `/${locale}`,
      languages: alternateLanguages,
    },
    openGraph: {
      type: "website",
      locale: langConfig.hreflang.replace("-", "_"),
      url:
        locale === i18n.defaultLocale
          ? siteMetadata.url
          : `${siteMetadata.url}/${locale}`,
      title: seoConfig.ogTitle,
      description: seoConfig.ogDescription,
      siteName: siteMetadata.siteName,
      images: [
        {
          url: ogImage.url,
          width: ogImage.width,
          height: ogImage.height,
          alt: seoConfig.ogTitle,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: seoConfig.ogTitle,
      description: seoConfig.ogDescription,
      images: [ogImage.url],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}

interface LocaleLayoutProps {
  children: React.ReactNode;
  params: { locale: string };
}

export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  const { locale } = params;

  // Validate locale
  if (!isValidLocale(locale)) {
    notFound();
  }

  // Load translations on the server
  const translations = await loadTranslations(locale);

  // Root layout for the /[locale] subtree: AppShell owns <html lang={locale}> so
  // the localized pages prerender statically with the correct server-side lang.
  return (
    <AppShell locale={locale} translations={translations}>
      {children}
    </AppShell>
  );
}
