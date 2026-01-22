import { Suspense } from "react";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { BrowsePageContent } from "@/app/browse/BrowsePageContent";
import { i18n, isValidLocale, getLanguageConfig, getSEOConfig, type Locale } from "@/lib/i18n-config";
import { loadTranslations, getTranslation } from "@/lib/translations";
import { LocaleProvider } from "@/lib/locale-context";
import { getSiteUrl, getImageUrl } from "@/lib/site";

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

  const seoConfig = getSEOConfig(locale);
  const langConfig = getLanguageConfig(locale);
  const translations = await loadTranslations(locale);

  const title = getTranslation(translations, "seo.browseTitle") ||
    "Browse Fortune Messages - Search & Filter";
  const description = getTranslation(translations, "seo.browseDescription") ||
    "Browse and search through 180+ fortune cookie messages.";

  // Generate alternate language links
  const alternates: Record<string, string> = {};
  for (const loc of i18n.locales) {
    const config = getLanguageConfig(loc);
    alternates[config.hreflang] = loc === i18n.defaultLocale
      ? `${baseUrl}/browse`
      : `${baseUrl}/${loc}/browse`;
  }

  const canonicalUrl = locale === i18n.defaultLocale
    ? `${baseUrl}/browse`
    : `${baseUrl}/${locale}/browse`;

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
    },
    alternates: {
      canonical: canonicalUrl,
      languages: alternates,
    },
  };
}

// Loading fallback for Suspense
function BrowseLoadingFallback() {
  return (
    <main className="min-h-screen w-full overflow-x-hidden relative">
      <div className="relative z-10">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-12">
            <div className="h-12 w-96 mx-auto bg-gray-200 rounded animate-pulse mb-4" />
            <div className="h-6 w-64 mx-auto bg-gray-200 rounded animate-pulse mb-6" />
          </div>
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

interface BrowsePageProps {
  params: {
    locale: string;
  };
}

export default async function LocaleBrowsePage({ params }: BrowsePageProps) {
  const { locale } = params;

  // Validate locale
  if (!isValidLocale(locale)) {
    notFound();
  }

  // Load translations
  const translations = await loadTranslations(locale as Locale);

  return (
    <LocaleProvider initialLocale={locale as Locale} initialTranslations={translations}>
      <Suspense fallback={<BrowseLoadingFallback />}>
        <BrowsePageContent />
      </Suspense>
    </LocaleProvider>
  );
}
