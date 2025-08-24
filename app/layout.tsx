import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Navigation } from '@/components/Navigation'
import { Footer } from '@/components/Footer'
import { PerformanceMonitor, GoogleAnalytics, CriticalResourcePreloader } from '@/components/PerformanceMonitor'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import { ErrorMonitorInitializer } from '@/components/ErrorMonitorInitializer'
import { ServiceWorkerInitializer } from '@/components/ServiceWorkerInitializer'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    default: 'Fortune Cookie - Free Online AI Generator',
    template: '%s | Fortune Cookie AI'
  },
  description: 'Free online AI-powered fortune cookie generator. Get personalized inspirational messages, funny quotes, and lucky numbers. Create custom fortune cookies with our AI tool.',
  keywords: [
    'fortune cookie',
    'free online fortune cookie generator ai',
    'custom fortune cookie message creator',
    'ai fortune cookie sayings app',
    'inspirational fortune cookie quotes',
    'funny fortune cookie messages',
    'lucky numbers generator',
    'personalized fortune cookies'
  ],
  authors: [{ name: 'Fortune Cookie AI Team' }],
  creator: 'Fortune Cookie AI',
  publisher: 'Fortune Cookie AI',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://fortune-cookie-ai.vercel.app'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://fortune-cookie-ai.vercel.app',
    title: 'Fortune Cookie - Free Online AI Generator',
    description: 'Free online AI-powered fortune cookie generator. Get personalized inspirational messages, funny quotes, and lucky numbers.',
    siteName: 'Fortune Cookie AI',
    images: [
      {
        url: '/og-image.svg',
        width: 1200,
        height: 630,
        alt: 'Fortune Cookie AI Generator',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Fortune Cookie - Free Online AI Generator',
    description: 'Free online AI-powered fortune cookie generator. Get personalized inspirational messages, funny quotes, and lucky numbers.',
    images: ['/twitter-image.svg'],
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
    google: 'your-google-verification-code',
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
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
      </head>
      <body className={inter.className} suppressHydrationWarning>
        <ServiceWorkerInitializer />
        <ErrorMonitorInitializer />
        <CriticalResourcePreloader />
        <PerformanceMonitor />
        <GoogleAnalytics measurementId={process.env.GOOGLE_ANALYTICS_ID || ''} />
        <ErrorBoundary>
          <Navigation />
          {children}
          <Footer />
        </ErrorBoundary>
      </body>
    </html>
  )
}
