import { Metadata } from "next";
import dynamic from "next/dynamic";
import { Suspense } from "react";
import { DynamicBackgroundEffects } from "@/components/DynamicBackgroundEffects";
import {
  BreadcrumbStructuredData,
  WebApplicationStructuredData,
} from "@/components/StructuredData";
import { getImageUrl, getSiteUrl } from "@/lib/site";
import { DailyFortuneCompact } from "@/components/DailyFortune";

const baseUrl = getSiteUrl();

// Dynamic import for calendar component
const FortuneCalendar = dynamic(
  () => import("@/components/FortuneCalendar").then((mod) => mod.FortuneCalendar),
  {
    ssr: false,
    loading: () => (
      <div className="bg-card rounded-2xl border shadow-sm p-6 animate-pulse">
        <div className="h-8 bg-muted rounded w-48 mb-6" />
        <div className="grid grid-cols-7 gap-1">
          {Array.from({ length: 35 }).map((_, i) => (
            <div key={i} className="h-16 bg-muted rounded" />
          ))}
        </div>
      </div>
    ),
  }
);

export const metadata: Metadata = {
  title: "Fortune Calendar - Daily Fortune Cookie Predictions | Fortune Cookie AI",
  description:
    "Explore your daily fortune predictions with our interactive Fortune Calendar. View past, present, and future fortunes with lucky numbers, colors, and personalized advice.",
  keywords: [
    "fortune calendar",
    "daily fortune",
    "fortune prediction",
    "lucky numbers calendar",
    "horoscope calendar",
    "fortune cookie predictions",
    "daily luck",
    "fortune planner",
  ],
  openGraph: {
    title: "Fortune Calendar - Daily Fortune Predictions",
    description:
      "Explore your daily fortune predictions with our interactive Fortune Calendar. View fortunes for any day!",
    type: "website",
    url: `${baseUrl}/calendar`,
    siteName: "Fortune Cookie AI",
    images: [
      {
        url: getImageUrl("/og-image.png"),
        width: 1200,
        height: 630,
        alt: "Fortune Calendar - Daily Fortune Cookie Predictions",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Fortune Calendar - Daily Fortune Predictions",
    description:
      "Explore your daily fortune predictions with our interactive Fortune Calendar.",
    images: [getImageUrl("/twitter-image.png")],
    creator: "@fortunecookieai",
  },
  alternates: {
    canonical: `${baseUrl}/calendar`,
  },
};

export default function CalendarPage() {
  return (
    <>
      <BreadcrumbStructuredData
        items={[
          { name: "Home", url: "/" },
          { name: "Fortune Calendar", url: "/calendar" },
        ]}
      />
      <WebApplicationStructuredData />

      <main className="min-h-screen w-full overflow-x-hidden relative">
        <DynamicBackgroundEffects />

        <div className="relative z-10">
          <div className="container mx-auto px-4 py-8">
            {/* Page Header */}
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
                🗓️ Fortune Calendar
              </h1>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Explore your daily fortunes! Click on any day to reveal your
                fortune prediction, lucky numbers, colors, and personalized advice.
              </p>
            </div>

            {/* Main Content Grid */}
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Calendar - Takes 2 columns on large screens */}
              <div className="lg:col-span-2">
                <Suspense
                  fallback={
                    <div className="bg-card rounded-2xl border shadow-sm p-6 animate-pulse">
                      <div className="h-8 bg-muted rounded w-48 mb-6" />
                      <div className="grid grid-cols-7 gap-1">
                        {Array.from({ length: 35 }).map((_, i) => (
                          <div key={i} className="h-16 bg-muted rounded" />
                        ))}
                      </div>
                    </div>
                  }
                >
                  <FortuneCalendar />
                </Suspense>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Today's Fortune Widget */}
                <Suspense
                  fallback={
                    <div className="bg-card rounded-2xl border shadow-sm p-6 animate-pulse">
                      <div className="h-6 bg-muted rounded w-32 mb-4" />
                      <div className="h-24 bg-muted rounded" />
                    </div>
                  }
                >
                  <DailyFortuneCompact />
                </Suspense>

                {/* How to Use */}
                <div className="bg-card rounded-2xl border shadow-sm p-6">
                  <h2 className="text-lg font-semibold mb-4">How to Use</h2>
                  <ul className="space-y-3 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center text-xs font-bold flex-shrink-0">
                        1
                      </span>
                      <span>
                        Navigate months using the arrows or click &quot;Today&quot; to
                        return to the current month
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center text-xs font-bold flex-shrink-0">
                        2
                      </span>
                      <span>
                        Each day shows a score indicator - more filled dots mean
                        better fortune
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center text-xs font-bold flex-shrink-0">
                        3
                      </span>
                      <span>
                        Click any day to see the full fortune with lucky numbers,
                        colors, and advice
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center text-xs font-bold flex-shrink-0">
                        4
                      </span>
                      <span>
                        Look for ✨ sparkles on days with excellent fortune scores
                      </span>
                    </li>
                  </ul>
                </div>

                {/* Fortune Score Guide */}
                <div className="bg-card rounded-2xl border shadow-sm p-6">
                  <h2 className="text-lg font-semibold mb-4">Score Guide</h2>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Excellent (9-10)</span>
                      <div className="flex gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <div
                            key={i}
                            className="w-2 h-2 rounded-full bg-yellow-500"
                          />
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Good (7-8)</span>
                      <div className="flex gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <div
                            key={i}
                            className={`w-2 h-2 rounded-full ${i < 4 ? "bg-green-500" : "bg-muted"}`}
                          />
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Fair (5-6)</span>
                      <div className="flex gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <div
                            key={i}
                            className={`w-2 h-2 rounded-full ${i < 3 ? "bg-blue-500" : "bg-muted"}`}
                          />
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Challenging (3-4)</span>
                      <div className="flex gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <div
                            key={i}
                            className={`w-2 h-2 rounded-full ${i < 2 ? "bg-orange-500" : "bg-muted"}`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* CTA */}
                <div className="bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl p-6 text-white">
                  <h2 className="text-lg font-semibold mb-2">
                    Want a Personal Fortune?
                  </h2>
                  <p className="text-sm text-white/90 mb-4">
                    Get a customized AI-generated fortune with your specific
                    themes and preferences.
                  </p>
                  <a
                    href="/generator"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-white text-amber-600 font-medium rounded-lg hover:bg-amber-50 transition-colors"
                  >
                    Try AI Generator
                    <span>→</span>
                  </a>
                </div>
              </div>
            </div>

            {/* SEO Content Section */}
            <section className="mt-16 max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                About the Fortune Calendar
              </h2>
              <div className="prose prose-amber max-w-none text-gray-600">
                <p>
                  The Fortune Calendar is your daily guide to luck and wisdom.
                  Each day features a unique fortune prediction generated using
                  our proprietary algorithm that considers cosmic patterns and
                  traditional fortune-telling wisdom.
                </p>
                <h3>What You&apos;ll Find Each Day</h3>
                <ul>
                  <li>
                    <strong>Overall Fortune Score:</strong> A 1-10 rating of your
                    day&apos;s overall luck potential
                  </li>
                  <li>
                    <strong>Dimensional Scores:</strong> Separate ratings for
                    career, love, health, and wealth
                  </li>
                  <li>
                    <strong>Fortune Message:</strong> A personalized wisdom quote
                    or prediction for the day
                  </li>
                  <li>
                    <strong>Lucky Numbers:</strong> Six special numbers to guide
                    your decisions
                  </li>
                  <li>
                    <strong>Lucky Color & Direction:</strong> Enhance your fortune
                    by incorporating these elements
                  </li>
                  <li>
                    <strong>Daily Advice:</strong> Practical guidance based on your
                    fortune score
                  </li>
                </ul>
                <h3>How It Works</h3>
                <p>
                  Our fortune calendar uses a deterministic algorithm that ensures
                  everyone sees the same fortune for each specific date. This
                  creates a shared experience where you can discuss your daily
                  fortunes with friends and family. The fortunes are generated
                  fresh at midnight UTC, giving you a new prediction each day.
                </p>
                <h3>Planning with Fortune</h3>
                <p>
                  Use the calendar to plan important events on days with high
                  fortune scores. Whether you&apos;re scheduling a job interview,
                  planning a date, or making financial decisions, the Fortune
                  Calendar can help you choose the most auspicious timing.
                </p>
              </div>
            </section>
          </div>
        </div>
      </main>
    </>
  );
}
