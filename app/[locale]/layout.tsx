import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  i18n,
  isValidLocale,
  languages,
  getSEOConfig,
} from "@/lib/i18n-config";
import { getSiteMetadata, getOGImageConfig } from "@/lib/site";
import { loadTranslations } from "@/lib/translations";
import { LocaleProvider } from "@/lib/locale-context";

/**
 * Generate static params for all supported locales
 */
export function generateStaticParams() {
  return i18n.locales.map((locale) => ({ locale }));
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

  // Get language direction
  const langConfig = languages[locale];

  return (
    <div lang={locale} dir={langConfig.dir}>
      <LocaleProvider initialLocale={locale} initialTranslations={translations}>
        {children}
      </LocaleProvider>
    </div>
  );
}
