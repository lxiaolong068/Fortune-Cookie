import type { Metadata, Viewport } from "next";
import {
  getSiteMetadata,
  getOGImageConfig,
  getTwitterImageConfig,
} from "@/lib/site";
import { i18n } from "@/lib/i18n-config";
import { loadTranslations } from "@/lib/translations";
import { AppShell } from "@/app/_shell/AppShell";

const siteMetadata = getSiteMetadata();
const ogImage = getOGImageConfig();
const twitterImage = getTwitterImageConfig();

// Viewport configuration for optimal mobile experience
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5, // Allow user zoom for accessibility
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fffbeb" }, // amber-50
    { media: "(prefers-color-scheme: dark)", color: "#1e1b4b" }, // indigo-950
  ],
  colorScheme: "light dark",
};

export const metadata: Metadata = {
  title: {
    default: siteMetadata.title,
    template: "%s | Fortune Cookie AI",
  },
  description: siteMetadata.description,
  authors: [{ name: siteMetadata.author }],
  creator: siteMetadata.creator,
  publisher: siteMetadata.publisher,
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(siteMetadata.baseUrl),
  alternates: {
    canonical: "/",
    languages: {
      "en": "/",
      "zh": "/zh",
      "es": "/es",
      "pt": "/pt",
    },
  },
  openGraph: {
    type: "website",
    locale: siteMetadata.locale,
    url: siteMetadata.url,
    title: siteMetadata.title,
    description: siteMetadata.description,
    siteName: siteMetadata.siteName,
    images: [
      {
        url: ogImage.url,
        width: ogImage.width,
        height: ogImage.height,
        alt: ogImage.alt,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteMetadata.title,
    description: siteMetadata.description,
    images: [twitterImage.url],
    creator: "@fortunecookieai",
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
  verification: {
    google:
      process.env.GOOGLE_VERIFICATION_CODE || "your-google-verification-code",
  },
};

/**
 * Root layout for the default-locale (English) branch. Served at the root path
 * ("/", "/generator", ...). Renders the shared <html>/<body> shell with a
 * static `lang="en"` — no headers() call, so every page under this group can be
 * statically prerendered / ISR-cached.
 */
export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const translations = await loadTranslations(i18n.defaultLocale);

  return (
    <AppShell locale={i18n.defaultLocale} translations={translations}>
      {children}
    </AppShell>
  );
}
