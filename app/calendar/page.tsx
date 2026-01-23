import { Metadata } from "next";
import dynamic from "next/dynamic";
import { Suspense } from "react";
import { headers } from "next/headers";
import { DynamicBackgroundEffects } from "@/components/DynamicBackgroundEffects";
import {
  BreadcrumbStructuredData,
  WebApplicationStructuredData,
} from "@/components/StructuredData";
import { getImageUrl, getSiteUrl } from "@/lib/site";
import { DailyFortuneCompact } from "@/components/DailyFortune";
import {
  i18n,
  isValidLocale,
  generateAlternateLanguages,
  type Locale,
} from "@/lib/i18n-config";
import { loadTranslations, getTranslation } from "@/lib/translations";

const baseUrl = getSiteUrl();

// Dynamic import for calendar component
const FortuneCalendar = dynamic(
  () =>
    import("@/components/FortuneCalendar").then((mod) => mod.FortuneCalendar),
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
  },
);

export const metadata: Metadata = {
  title:
    "Fortune Calendar - Daily Fortune Cookie Predictions | Fortune Cookie AI",
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
    canonical: "/calendar",
    languages: generateAlternateLanguages("/calendar", baseUrl),
  },
};

export default async function CalendarPage() {
  const headerLocale = headers().get("x-locale") ?? "";
  const resolvedLocale = isValidLocale(headerLocale)
    ? (headerLocale as Locale)
    : i18n.defaultLocale;
  const translations = await loadTranslations(resolvedLocale);
  const t = (key: string, params?: Record<string, string | number>) =>
    getTranslation(translations, key, params);

  return (
    <>
      <BreadcrumbStructuredData
        items={[
          { name: t("navigation.home"), url: "/" },
          { name: t("navigation.calendar"), url: "/calendar" },
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
                🗓️ {t("calendarPage.pageTitle")}
              </h1>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                {t("calendarPage.pageSubtitle")}
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
                  <h2 className="text-lg font-semibold mb-4">
                    {t("calendarPage.howToTitle")}
                  </h2>
                  <ul className="space-y-3 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center text-xs font-bold flex-shrink-0">
                        1
                      </span>
                      <span>{t("calendarPage.howToSteps.step1")}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center text-xs font-bold flex-shrink-0">
                        2
                      </span>
                      <span>{t("calendarPage.howToSteps.step2")}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center text-xs font-bold flex-shrink-0">
                        3
                      </span>
                      <span>{t("calendarPage.howToSteps.step3")}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center text-xs font-bold flex-shrink-0">
                        4
                      </span>
                      <span>{t("calendarPage.howToSteps.step4")}</span>
                    </li>
                  </ul>
                </div>

                {/* Fortune Score Guide */}
                <div className="bg-card rounded-2xl border shadow-sm p-6">
                  <h2 className="text-lg font-semibold mb-4">
                    {t("calendarPage.scoreGuideTitle")}
                  </h2>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">
                        {t("calendarPage.scoreLabels.excellent")}
                      </span>
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
                      <span className="text-sm">
                        {t("calendarPage.scoreLabels.good")}
                      </span>
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
                      <span className="text-sm">
                        {t("calendarPage.scoreLabels.fair")}
                      </span>
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
                      <span className="text-sm">
                        {t("calendarPage.scoreLabels.challenging")}
                      </span>
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
                    {t("calendarPage.ctaTitle")}
                  </h2>
                  <p className="text-sm text-white/90 mb-4">
                    {t("calendarPage.ctaDescription")}
                  </p>
                  <a
                    href="/generator"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-white text-amber-600 font-medium rounded-lg hover:bg-amber-50 transition-colors"
                  >
                    {t("calendarPage.ctaButton")}
                    <span>→</span>
                  </a>
                </div>
              </div>
            </div>

            {/* SEO Content Section */}
            <section className="mt-16 max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                {t("calendarPage.seoTitle")}
              </h2>
              <div className="prose prose-amber max-w-none text-gray-600">
                <p>{t("calendarPage.seoIntro")}</p>
                <h3>{t("calendarPage.seoSections.dailyTitle")}</h3>
                <ul>
                  <li>
                    <strong>
                      {t("calendarPage.seoSections.dailyItems.overallLabel")}:
                    </strong>{" "}
                    {t("calendarPage.seoSections.dailyItems.overallText")}
                  </li>
                  <li>
                    <strong>
                      {t("calendarPage.seoSections.dailyItems.dimensionsLabel")}
                      :
                    </strong>{" "}
                    {t("calendarPage.seoSections.dailyItems.dimensionsText")}
                  </li>
                  <li>
                    <strong>
                      {t("calendarPage.seoSections.dailyItems.messageLabel")}:
                    </strong>{" "}
                    {t("calendarPage.seoSections.dailyItems.messageText")}
                  </li>
                  <li>
                    <strong>
                      {t("calendarPage.seoSections.dailyItems.numbersLabel")}:
                    </strong>{" "}
                    {t("calendarPage.seoSections.dailyItems.numbersText")}
                  </li>
                  <li>
                    <strong>
                      {t("calendarPage.seoSections.dailyItems.elementsLabel")}:
                    </strong>{" "}
                    {t("calendarPage.seoSections.dailyItems.elementsText")}
                  </li>
                  <li>
                    <strong>
                      {t("calendarPage.seoSections.dailyItems.adviceLabel")}:
                    </strong>{" "}
                    {t("calendarPage.seoSections.dailyItems.adviceText")}
                  </li>
                </ul>
                <h3>{t("calendarPage.seoSections.howTitle")}</h3>
                <p>{t("calendarPage.seoSections.howText")}</p>
                <h3>{t("calendarPage.seoSections.planningTitle")}</h3>
                <p>{t("calendarPage.seoSections.planningText")}</p>
              </div>
            </section>
          </div>
        </div>
      </main>
    </>
  );
}
