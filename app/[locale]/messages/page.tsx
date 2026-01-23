import { permanentRedirect } from "next/navigation";
import { Metadata } from "next";
import { i18n, isValidLocale } from "@/lib/i18n-config";

// SEO metadata for redirect page
export const metadata: Metadata = {
  title: "Redirecting to Explore...",
  robots: { index: false, follow: true },
};

// Generate static params for all locales
export function generateStaticParams() {
  return i18n.locales.map((locale) => ({
    locale,
  }));
}

interface MessagesPageProps {
  params: {
    locale: string;
  };
}

/**
 * Locale-specific /messages page - redirects to /explore
 * 301 permanent redirect for SEO preservation
 *
 * This consolidation merges Browse and Messages into a unified Explore page
 * to prevent content duplication and keyword cannibalization.
 */
export default function LocaleMessagesPage({ params }: MessagesPageProps) {
  const { locale } = params;

  // Validate locale and redirect accordingly
  if (isValidLocale(locale)) {
    permanentRedirect(`/${locale}/explore`);
  }

  // Fallback redirect for invalid locale
  permanentRedirect("/explore");
}
