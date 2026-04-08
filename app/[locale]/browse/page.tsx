import { permanentRedirect } from "next/navigation";
import { i18n, isValidLocale } from "@/lib/i18n-config";

// Generate static params for non-default locales only (exclude 'en' to avoid duplicate routes)
export function generateStaticParams() {
  return i18n.locales
    .filter((locale) => locale !== i18n.defaultLocale)
    .map((locale) => ({ locale }));
}

interface BrowsePageProps {
  params: {
    locale: string;
  };
}

/**
 * Locale-specific /browse page - redirects to /explore
 * 301 permanent redirect for SEO preservation
 */
export default function LocaleBrowsePage({ params }: BrowsePageProps) {
  const { locale } = params;

  // Validate locale and redirect accordingly
  if (isValidLocale(locale)) {
    permanentRedirect(`/${locale}/explore`);
  }

  // Fallback redirect
  permanentRedirect("/explore");
}
