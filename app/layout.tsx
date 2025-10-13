import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Suspense } from 'react'
import dynamic from 'next/dynamic'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import { ThemeScript } from '@/components/ThemeInitializer'
import { getSiteMetadata, getOGImageConfig, getTwitterImageConfig } from '@/lib/site'
import { CriticalCSS } from '@/components/CriticalCSS'

// Dynamic imports for non-critical components to reduce initial bundle size
const DynamicNavigation = dynamic(() => import('@/components/DynamicNavigation').then(mod => ({ default: mod.DynamicNavigation })), { ssr: true })
const Footer = dynamic(() => import('@/components/Footer').then(mod => ({ default: mod.Footer })), { ssr: true })
const PerformanceMonitor = dynamic(() => import('@/components/PerformanceMonitor').then(mod => ({ default: mod.PerformanceMonitor })), { ssr: false })
const GoogleAnalytics = dynamic(() => import('@/components/PerformanceMonitor').then(mod => ({ default: mod.GoogleAnalytics })), { ssr: false })
const GoogleAdSense = dynamic(() => import('@/components/PerformanceMonitor').then(mod => ({ default: mod.GoogleAdSense })), { ssr: false })
const OptimizedPreloader = dynamic(() => import('@/components/ResourcePreloader').then(mod => ({ default: mod.OptimizedPreloader })), { ssr: false })
const ErrorMonitorInitializer = dynamic(() => import('@/components/ErrorMonitorInitializer').then(mod => ({ default: mod.ErrorMonitorInitializer })), { ssr: false })
const ServiceWorkerInitializer = dynamic(() => import('@/components/ServiceWorkerInitializer').then(mod => ({ default: mod.ServiceWorkerInitializer })), { ssr: false })
const ThemeInitializer = dynamic(() => import('@/components/ThemeInitializer').then(mod => ({ default: mod.ThemeInitializer })), { ssr: false })
const AnalyticsInitializer = dynamic(() => import('@/components/AnalyticsInitializer').then(mod => ({ default: mod.AnalyticsInitializer })), { ssr: false })
const AnalyticsConsentBanner = dynamic(() => import('@/components/AnalyticsInitializer').then(mod => ({ default: mod.AnalyticsConsentBanner })), { ssr: false })
const DeferredScripts = dynamic(() => import('@/components/DeferredScripts').then(mod => ({ default: mod.DeferredScripts })), { ssr: false })

const inter = Inter({
  subsets: ['latin'],
  display: 'swap', // Optimize font loading to prevent FOIT
  preload: true,
})

const siteMetadata = getSiteMetadata()
const ogImage = getOGImageConfig()
const twitterImage = getTwitterImageConfig()

export const metadata: Metadata = {
  title: {
    default: siteMetadata.title,
    template: '%s | Fortune Cookie AI'
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
    canonical: '/',
  },
  openGraph: {
    type: 'website',
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
    card: 'summary_large_image',
    title: siteMetadata.title,
    description: siteMetadata.description,
    images: [twitterImage.url],
    creator: '@fortunecookieai',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: process.env.GOOGLE_VERIFICATION_CODE || 'your-google-verification-code',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <CriticalCSS />

        {/* DNS Prefetch for third-party domains - improves connection time */}
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="https://fonts.gstatic.com" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://www.google-analytics.com" />
        <link rel="dns-prefetch" href="https://pagead2.googlesyndication.com" />

        {/* Preconnect to critical third-party origins - establishes early connection */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

        <ThemeScript />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
      </head>
      <body className={inter.className} suppressHydrationWarning>
        <ThemeInitializer />
        <ServiceWorkerInitializer />
        <ErrorMonitorInitializer />
        <OptimizedPreloader />
        <DeferredScripts>
          <PerformanceMonitor />
          <GoogleAnalytics measurementId={process.env.GOOGLE_ANALYTICS_ID || ''} />
          <GoogleAdSense clientId={process.env.GOOGLE_ADSENSE_CLIENT_ID || 'ca-pub-6958408841088360'} />
        </DeferredScripts>
        <ErrorBoundary>
          <Suspense fallback={null}>
            <AnalyticsInitializer />
          </Suspense>
          <DynamicNavigation />
          {children}
          <Footer />
          <AnalyticsConsentBanner />
        </ErrorBoundary>
      </body>
    </html>
  )
}
