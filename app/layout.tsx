import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Suspense } from "react";
import dynamic from "next/dynamic";
import { headers } from "next/headers";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { ThemeScript } from "@/components/ThemeInitializer";
import {
  getSiteMetadata,
  getOGImageConfig,
  getTwitterImageConfig,
} from "@/lib/site";
import { getBlobUrl } from "@/lib/blob-urls";
import { CriticalCSS } from "@/components/CriticalCSS";
import { NavigationFallback } from "@/components/NavigationFallback";
import {
  OrganizationStructuredData,
  WebsiteStructuredData,
} from "@/components/StructuredData";
import { Toaster } from "@/components/ui/sonner";
import { i18n, isValidLocale } from "@/lib/i18n-config";
import { LocaleProvider } from "@/lib/locale-context";
import { getTranslation, loadTranslations } from "@/lib/translations";

// Dynamic imports for non-critical components to reduce initial bundle size
const Footer = dynamic(
  () => import("@/components/Footer").then((mod) => ({ default: mod.Footer })),
  { ssr: true },
);
const Navigation = dynamic(
  () =>
    import("@/components/Navigation").then((mod) => ({
      default: mod.Navigation,
    })),
  { ssr: false, loading: () => <NavigationFallback /> },
);
const PerformanceMonitor = dynamic(
  () =>
    import("@/components/PerformanceMonitor").then((mod) => ({
      default: mod.PerformanceMonitor,
    })),
  { ssr: false },
);
const GoogleAnalytics = dynamic(
  () =>
    import("@/components/PerformanceMonitor").then((mod) => ({
      default: mod.GoogleAnalytics,
    })),
  { ssr: false },
);
// Use optimized AdSense Facade instead of direct AdSense component
const OptimizedAdSense = dynamic(() => import("@/components/AdSenseFacade"), {
  ssr: false,
});
const OptimizedPreloader = dynamic(
  () =>
    import("@/components/ResourcePreloader").then((mod) => ({
      default: mod.OptimizedPreloader,
    })),
  { ssr: false },
);
const ErrorMonitorInitializer = dynamic(
  () =>
    import("@/components/ErrorMonitorInitializer").then((mod) => ({
      default: mod.ErrorMonitorInitializer,
    })),
  { ssr: false },
);
const ServiceWorkerInitializer = dynamic(
  () =>
    import("@/components/ServiceWorkerInitializer").then((mod) => ({
      default: mod.ServiceWorkerInitializer,
    })),
  { ssr: false },
);
const ThemeInitializer = dynamic(
  () =>
    import("@/components/ThemeInitializer").then((mod) => ({
      default: mod.ThemeInitializer,
    })),
  { ssr: false },
);
const AnalyticsInitializer = dynamic(
  () =>
    import("@/components/AnalyticsInitializer").then((mod) => ({
      default: mod.AnalyticsInitializer,
    })),
  { ssr: false },
);
const AnalyticsConsentBanner = dynamic(
  () =>
    import("@/components/AnalyticsInitializer").then((mod) => ({
      default: mod.AnalyticsConsentBanner,
    })),
  { ssr: false },
);
const DeferredScripts = dynamic(
  () =>
    import("@/components/DeferredScripts").then((mod) => ({
      default: mod.DeferredScripts,
    })),
  { ssr: false },
);
const RouteProgress = dynamic(
  () =>
    import("@/components/RouteProgress").then((mod) => ({
      default: mod.RouteProgress,
    })),
  { ssr: false },
);

const inter = Inter({
  subsets: ["latin"],
  display: "swap", // Optimize font loading to prevent FOIT
  preload: true,
});

const siteMetadata = getSiteMetadata();
const ogImage = getOGImageConfig();
const twitterImage = getTwitterImageConfig();

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

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // 获取 nonce 用于 CSP（仅在生产环境）
  const requestHeaders = headers();
  const nonce =
    process.env.NODE_ENV === "production" ? requestHeaders.get("x-nonce") : null;

  const headerLocale = requestHeaders.get("x-locale") ?? "";
  const locale = isValidLocale(headerLocale) ? headerLocale : i18n.defaultLocale;
  const translations = await loadTranslations(locale);
  const skipToContentLabel = getTranslation(translations, "common.skipToContent");

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <CriticalCSS />

        {/* Global structured data for Google Rich Results */}
        <WebsiteStructuredData nonce={nonce} />
        <OrganizationStructuredData nonce={nonce} />

        {/* Preconnect to critical origins for faster resource loading */}
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />

        {/* DNS Prefetch for third-party domains - improves connection time */}
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://www.google-analytics.com" />
        <link rel="dns-prefetch" href="https://pagead2.googlesyndication.com" />
        <link rel="dns-prefetch" href="https://googleads.g.doubleclick.net" />
        <link rel="dns-prefetch" href="https://www.googleadservices.com" />

        {/* Fonts are handled by next/font (self-hosted) */}

        <ThemeScript nonce={nonce} />
        <link rel="icon" href={getBlobUrl("/favicon.ico")} />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href={getBlobUrl("/apple-touch-icon.png")}
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href={getBlobUrl("/favicon-32x32.png")}
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href={getBlobUrl("/favicon-16x16.png")}
        />
        {/* PWA Manifest with cache-busting version parameter to bypass stale browser cache */}
        <link rel="manifest" href="/app-manifest.json" />
      </head>
      <body className={inter.className} suppressHydrationWarning>
        <LocaleProvider initialLocale={locale} initialTranslations={translations}>
          {/* Skip to main content link for accessibility (WCAG 2.1) */}
          <a href="#main-content" className="skip-link">
            {skipToContentLabel}
          </a>
          <ThemeInitializer />
          <ServiceWorkerInitializer />
          <ErrorMonitorInitializer />
          <OptimizedPreloader />
          <DeferredScripts>
            <PerformanceMonitor />
            <GoogleAnalytics
              measurementId={process.env.GOOGLE_ANALYTICS_ID || "G-7QBCKNQ980"}
            />
            {/* Use optimized AdSense Facade for better LCP performance */}
            <OptimizedAdSense
              clientId={
                process.env.GOOGLE_ADSENSE_CLIENT_ID || "ca-pub-6958408841088360"
              }
            />
          </DeferredScripts>
          <ErrorBoundary>
            <Suspense fallback={null}>
              <RouteProgress />
              <AnalyticsInitializer />
            </Suspense>
            <Navigation />
            <main id="main-content">{children}</main>
            <Footer />
            <AnalyticsConsentBanner />
            <Toaster />
          </ErrorBoundary>
        </LocaleProvider>
      </body>
    </html>
  );
}
