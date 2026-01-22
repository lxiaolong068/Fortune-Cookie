import { Metadata } from "next";
import { notFound } from "next/navigation";
import { DynamicBackgroundEffects } from "@/components/DynamicBackgroundEffects";
import { BreadcrumbStructuredData } from "@/components/StructuredData";
import { getImageUrl, getSiteUrl } from "@/lib/site";
import { GeneratorClient } from "@/app/generator/GeneratorClient";
import { i18n, isValidLocale, getLanguageConfig, getSEOConfig, type Locale } from "@/lib/i18n-config";
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

  const seoConfig = getSEOConfig(locale);
  const langConfig = getLanguageConfig(locale);
  const translations = await loadTranslations(locale);

  const title = getTranslation(translations, "seo.generatorTitle") ||
    "AI Fortune Cookie Generator - Create Custom Messages";
  const description = getTranslation(translations, "seo.generatorDescription") ||
    "Free AI fortune cookie generator for personalized messages, funny quotes, and lucky numbers.";

  // Generate alternate language links
  const alternates: Record<string, string> = {};
  for (const loc of i18n.locales) {
    const config = getLanguageConfig(loc);
    alternates[config.hreflang] = loc === i18n.defaultLocale
      ? `${baseUrl}/generator`
      : `${baseUrl}/${loc}/generator`;
  }

  const canonicalUrl = locale === i18n.defaultLocale
    ? `${baseUrl}/generator`
    : `${baseUrl}/${locale}/generator`;

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

interface GeneratorPageProps {
  params: {
    locale: string;
  };
}

export default async function LocaleGeneratorPage({ params }: GeneratorPageProps) {
  const { locale } = params;

  // Validate locale
  if (!isValidLocale(locale)) {
    notFound();
  }

  // Load translations
  const translations = await loadTranslations(locale as Locale);

  // Helper function to get translation
  const t = (key: string) => getTranslation(translations, key);

  // Get localized path helper
  const getLocalizedHref = (path: string) => {
    if (locale === i18n.defaultLocale) {
      return path;
    }
    return `/${locale}${path}`;
  };

  return (
    <LocaleProvider initialLocale={locale as Locale} initialTranslations={translations}>
      <BreadcrumbStructuredData
        items={[
          { name: t("navigation.home"), url: getLocalizedHref("/") },
          { name: t("navigation.generator"), url: getLocalizedHref("/generator") },
        ]}
      />
      <main className="min-h-screen w-full overflow-x-hidden relative">
        <DynamicBackgroundEffects />
        <div className="relative z-10">
          <GeneratorClient />
        </div>
      </main>
    </LocaleProvider>
  );
}
