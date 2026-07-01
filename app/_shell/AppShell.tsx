import { Suspense } from "react";
import { Inter } from "next/font/google";
import nextDynamic from "next/dynamic";
import "@/app/globals.css";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { ThemeScript } from "@/components/ThemeInitializer";
import { getBlobUrl } from "@/lib/blob-urls";
import { CriticalCSS } from "@/components/CriticalCSS";
import { NavigationFallback } from "@/components/NavigationFallback";
import {
  OrganizationStructuredData,
  WebsiteStructuredData,
} from "@/components/StructuredData";
import { Toaster } from "@/components/ui/sonner";
import {
  i18n,
  isValidLocale,
  languages,
  type Locale,
} from "@/lib/i18n-config";
import { LocaleProvider } from "@/lib/locale-context";
import { getTranslation } from "@/lib/translations";
import type { TranslationFile } from "@/lib/translations";

// Dynamic imports for non-critical components to reduce initial bundle size
const Footer = nextDynamic(
  () => import("@/components/Footer").then((mod) => ({ default: mod.Footer })),
  { ssr: true },
);
const Navigation = nextDynamic(
  () =>
    import("@/components/Navigation").then((mod) => ({
      default: mod.Navigation,
    })),
  { ssr: false, loading: () => <NavigationFallback /> },
);
const PerformanceMonitor = nextDynamic(
  () =>
    import("@/components/PerformanceMonitor").then((mod) => ({
      default: mod.PerformanceMonitor,
    })),
  { ssr: false },
);
const GoogleAnalytics = nextDynamic(
  () =>
    import("@/components/PerformanceMonitor").then((mod) => ({
      default: mod.GoogleAnalytics,
    })),
  { ssr: false },
);
// Use optimized AdSense Facade instead of direct AdSense component
const OptimizedAdSense = nextDynamic(() => import("@/components/AdSenseFacade"), {
  ssr: false,
});
const OptimizedPreloader = nextDynamic(
  () =>
    import("@/components/ResourcePreloader").then((mod) => ({
      default: mod.OptimizedPreloader,
    })),
  { ssr: false },
);
const ErrorMonitorInitializer = nextDynamic(
  () =>
    import("@/components/ErrorMonitorInitializer").then((mod) => ({
      default: mod.ErrorMonitorInitializer,
    })),
  { ssr: false },
);
const ServiceWorkerInitializer = nextDynamic(
  () =>
    import("@/components/ServiceWorkerInitializer").then((mod) => ({
      default: mod.ServiceWorkerInitializer,
    })),
  { ssr: false },
);
const ThemeInitializer = nextDynamic(
  () =>
    import("@/components/ThemeInitializer").then((mod) => ({
      default: mod.ThemeInitializer,
    })),
  { ssr: false },
);
const AnalyticsInitializer = nextDynamic(
  () =>
    import("@/components/AnalyticsInitializer").then((mod) => ({
      default: mod.AnalyticsInitializer,
    })),
  { ssr: false },
);
const AnalyticsConsentBanner = nextDynamic(
  () =>
    import("@/components/AnalyticsInitializer").then((mod) => ({
      default: mod.AnalyticsConsentBanner,
    })),
  { ssr: false },
);
const DeferredScripts = nextDynamic(
  () =>
    import("@/components/DeferredScripts").then((mod) => ({
      default: mod.DeferredScripts,
    })),
  { ssr: false },
);
const RouteProgress = nextDynamic(
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

/**
 * Shared application shell: owns <html>/<head>/<body>, global chrome, providers.
 *
 * Rendered by each root layout so the `<html lang>` is produced statically from
 * the branch's known locale (English root vs the /[locale] subtree) without any
 * dynamic headers() call — which is what lets every page be prerendered / ISR.
 *
 * No CSP nonce is threaded here: the middleware CSP uses `script-src
 * 'unsafe-inline'` (Next.js hydration scripts can't take a nonce), so a nonce
 * on these tags was always inert. See docs/i18n-static-lang-refactor.md §6.
 */
export function AppShell({
  locale,
  translations,
  children,
}: {
  locale: string;
  translations: TranslationFile;
  children: React.ReactNode;
}) {
  const activeLocale: Locale = isValidLocale(locale)
    ? locale
    : i18n.defaultLocale;
  const dir = languages[activeLocale].dir;
  const skipToContentLabel = getTranslation(
    translations,
    "common.skipToContent",
  );

  return (
    <html lang={activeLocale} dir={dir} suppressHydrationWarning>
      <head>
        <CriticalCSS />

        {/* Global structured data for Google Rich Results */}
        <WebsiteStructuredData />
        <OrganizationStructuredData />

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

        <ThemeScript />
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
        <LocaleProvider initialLocale={activeLocale} initialTranslations={translations}>
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
