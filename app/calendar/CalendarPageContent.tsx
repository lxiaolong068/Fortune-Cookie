"use client";

import { Suspense } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { CalendarDays, Sparkles, ArrowRight, HelpCircle } from "lucide-react";
import { DailyFortuneCompact } from "@/components/DailyFortune";
import { PageLayout, PageSection } from "@/components/PageLayout";
import { PageHero, HeroBadge } from "@/components/PageHero";
import { ModernCard, ModernCardIcon } from "@/components/ui/modern-card";
import { useLocale } from "@/lib/locale-context";

// Dynamic import for calendar component
const FortuneCalendar = dynamic(
  () =>
    import("@/components/FortuneCalendar").then((mod) => mod.FortuneCalendar),
  {
    ssr: false,
    loading: () => (
      <ModernCard variant="glass" className="p-6 animate-pulse">
        <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-48 mb-6" />
        <div className="grid grid-cols-7 gap-1">
          {Array.from({ length: 35 }).map((_, i) => (
            <div
              key={i}
              className="h-16 bg-slate-200 dark:bg-slate-700 rounded"
            />
          ))}
        </div>
      </ModernCard>
    ),
  }
);

const scoreGuide = [
  { label: "Excellent", dots: 5, color: "bg-yellow-500" },
  { label: "Good", dots: 4, color: "bg-green-500" },
  { label: "Fair", dots: 3, color: "bg-blue-500" },
  { label: "Challenging", dots: 2, color: "bg-orange-500" },
];

export function CalendarPageContent() {
  const { t } = useLocale();

  return (
    <PageLayout background="subtle" gradient="indigo" headerOffset={false}>
      {/* Hero Section */}
      <PageHero
        title={
          t("calendarPage.pageTitle") !== "calendarPage.pageTitle"
            ? t("calendarPage.pageTitle")
            : "Fortune Calendar"
        }
        subtitle="Daily Predictions"
        description={
          t("calendarPage.pageSubtitle") !== "calendarPage.pageSubtitle"
            ? t("calendarPage.pageSubtitle")
            : "Explore your daily fortune predictions with our interactive Fortune Calendar. View past, present, and future fortunes with lucky numbers and personalized advice."
        }
        icon={CalendarDays}
        iconGradient={{ from: "from-indigo-500", to: "to-purple-500" }}
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Calendar" }]}
        badge={<HeroBadge icon={Sparkles}>Daily Fortunes</HeroBadge>}
        size="md"
      />

      {/* Main Content */}
      <PageSection padding="lg" bg="transparent">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Calendar - Takes 2 columns */}
          <div className="lg:col-span-2">
            <Suspense
              fallback={
                <ModernCard variant="glass" className="p-6 animate-pulse">
                  <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-48 mb-6" />
                  <div className="grid grid-cols-7 gap-1">
                    {Array.from({ length: 35 }).map((_, i) => (
                      <div
                        key={i}
                        className="h-16 bg-slate-200 dark:bg-slate-700 rounded"
                      />
                    ))}
                  </div>
                </ModernCard>
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
                <ModernCard variant="glass" className="p-6 animate-pulse">
                  <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-32 mb-4" />
                  <div className="h-24 bg-slate-200 dark:bg-slate-700 rounded" />
                </ModernCard>
              }
            >
              <DailyFortuneCompact />
            </Suspense>

            {/* How to Use */}
            <ModernCard variant="glass">
              <div className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <ModernCardIcon
                    gradientFrom="from-blue-500"
                    gradientTo="to-cyan-500"
                    size="sm"
                  >
                    <HelpCircle className="w-4 h-4 text-white" />
                  </ModernCardIcon>
                  <h2 className="text-lg font-heading font-semibold text-slate-800 dark:text-white">
                    {t("calendarPage.howToTitle") !== "calendarPage.howToTitle"
                      ? t("calendarPage.howToTitle")
                      : "How to Use"}
                  </h2>
                </div>
                <ul className="space-y-3 text-sm text-slate-600 dark:text-slate-300">
                  {[1, 2, 3, 4].map((step) => (
                    <li key={step} className="flex items-start gap-3">
                      <span className="w-6 h-6 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
                        {step}
                      </span>
                      <span>
                        {t(`calendarPage.howToSteps.step${step}`) !==
                        `calendarPage.howToSteps.step${step}`
                          ? t(`calendarPage.howToSteps.step${step}`)
                          : step === 1
                            ? "Click on any date to view its fortune"
                            : step === 2
                              ? "View detailed fortune predictions"
                              : step === 3
                                ? "Check lucky numbers and colors"
                                : "Navigate between months easily"}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </ModernCard>

            {/* Fortune Score Guide */}
            <ModernCard variant="glass">
              <div className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <ModernCardIcon
                    gradientFrom="from-amber-500"
                    gradientTo="to-orange-500"
                    size="sm"
                  >
                    <Sparkles className="w-4 h-4 text-white" />
                  </ModernCardIcon>
                  <h2 className="text-lg font-heading font-semibold text-slate-800 dark:text-white">
                    {t("calendarPage.scoreGuideTitle") !==
                    "calendarPage.scoreGuideTitle"
                      ? t("calendarPage.scoreGuideTitle")
                      : "Fortune Score Guide"}
                  </h2>
                </div>
                <div className="space-y-3">
                  {scoreGuide.map((item) => (
                    <div
                      key={item.label}
                      className="flex items-center justify-between"
                    >
                      <span className="text-sm text-slate-600 dark:text-slate-300">
                        {item.label}
                      </span>
                      <div className="flex gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <div
                            key={i}
                            className={`w-2 h-2 rounded-full ${
                              i < item.dots
                                ? item.color
                                : "bg-slate-200 dark:bg-slate-700"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </ModernCard>

            {/* CTA Card */}
            <ModernCard
              variant="gradient"
              gradientFrom="from-indigo-500"
              gradientTo="to-purple-600"
              className="text-white"
            >
              <div className="p-6">
                <h2 className="text-lg font-heading font-semibold mb-2">
                  {t("calendarPage.ctaTitle") !== "calendarPage.ctaTitle"
                    ? t("calendarPage.ctaTitle")
                    : "Want a Personal Fortune?"}
                </h2>
                <p className="text-sm text-white/80 mb-4">
                  {t("calendarPage.ctaDescription") !==
                  "calendarPage.ctaDescription"
                    ? t("calendarPage.ctaDescription")
                    : "Generate a unique AI-powered fortune just for you!"}
                </p>
                <Link
                  href="/generator"
                  className="inline-flex items-center gap-2 px-4 py-2.5 bg-white text-indigo-600 font-medium rounded-xl hover:bg-indigo-50 transition-colors"
                >
                  {t("calendarPage.ctaButton") !== "calendarPage.ctaButton"
                    ? t("calendarPage.ctaButton")
                    : "Generate Fortune"}
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </ModernCard>
          </div>
        </div>
      </PageSection>

      {/* SEO Content Section */}
      <PageSection padding="lg" bg="white">
        <div className="max-w-4xl mx-auto prose prose-slate dark:prose-invert prose-headings:font-heading">
          <h2 className="text-2xl font-heading font-semibold text-slate-800 dark:text-white mb-4">
            {t("calendarPage.seoTitle") !== "calendarPage.seoTitle"
              ? t("calendarPage.seoTitle")
              : "About Fortune Calendar"}
          </h2>
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
            {t("calendarPage.seoIntro") !== "calendarPage.seoIntro"
              ? t("calendarPage.seoIntro")
              : "Our Fortune Calendar provides daily fortune predictions based on ancient wisdom combined with modern AI. Each day features a unique fortune, lucky numbers, and personalized guidance to help you navigate life's opportunities."}
          </p>
          <h3 className="text-xl font-heading font-semibold text-slate-800 dark:text-white mb-3">
            Daily Fortune Features
          </h3>
          <ul className="text-slate-600 dark:text-slate-300 space-y-2">
            <li>
              <strong>Overall Fortune Score:</strong> A comprehensive rating for
              your day
            </li>
            <li>
              <strong>Life Dimensions:</strong> Insights on love, career,
              health, and wealth
            </li>
            <li>
              <strong>Daily Message:</strong> Personalized wisdom for guidance
            </li>
            <li>
              <strong>Lucky Numbers:</strong> Numbers that may bring you fortune
            </li>
            <li>
              <strong>Lucky Elements:</strong> Colors, directions, and more
            </li>
          </ul>
        </div>
      </PageSection>
    </PageLayout>
  );
}
