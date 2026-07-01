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
        <div className="max-w-4xl mx-auto space-y-12">
          {/* About section */}
          <div className="prose prose-slate dark:prose-invert prose-headings:font-heading max-w-none">
            <h2 className="text-2xl font-heading font-semibold text-slate-800 dark:text-white mb-4">
              What is a Fortune Cookie Calendar?
            </h2>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
              A <strong>fortune cookie calendar</strong> is an interactive daily planner that pairs each day of the year with a unique fortune cookie message, lucky numbers, and life-dimension scores. Our AI-powered Fortune Calendar goes beyond a simple random fortune — it assigns each date a consistent, deterministic fortune so you can plan ahead, look back at past days, and track how your luck evolves over time.
            </p>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
              Each daily fortune includes an <strong>overall fortune score</strong> (1–5 stars), individual ratings for Love, Career, Health, and Wealth, a personalized wisdom message, lucky numbers, and lucky colors. Click any date on the calendar to reveal its full fortune profile.
            </p>

            {/* Features grid */}
            <h3 className="text-xl font-heading font-semibold text-slate-800 dark:text-white mb-3">
              Daily Fortune Features
            </h3>
            <div className="grid md:grid-cols-2 gap-4 not-prose mb-6">
              {[
                { icon: "⭐", title: "Overall Fortune Score", desc: "A 1–5 star rating that summarizes the energy of the day at a glance." },
                { icon: "💕", title: "Love & Relationship", desc: "Insights into romantic connections, friendships, and social harmony." },
                { icon: "💼", title: "Career & Wealth", desc: "Guidance on professional opportunities, financial decisions, and ambition." },
                { icon: "🌿", title: "Health & Vitality", desc: "Advice on physical energy, mental clarity, and overall well-being." },
                { icon: "🔢", title: "Lucky Numbers", desc: "AI-generated numbers associated with each day — perfect for lottery picks or meaningful dates." },
                { icon: "🎨", title: "Lucky Colors & Elements", desc: "Colors and natural elements that resonate with the day's fortune energy." },
              ].map((f) => (
                <div key={f.title} className="flex items-start gap-3 p-4 rounded-xl bg-indigo-50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-800/30">
                  <span className="text-2xl flex-shrink-0">{f.icon}</span>
                  <div>
                    <p className="font-semibold text-slate-800 dark:text-white text-sm mb-1">{f.title}</p>
                    <p className="text-xs text-slate-600 dark:text-slate-400">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Use cases */}
          <div>
            <h2 className="text-2xl font-heading font-semibold text-slate-800 dark:text-white mb-4">
              How people use the Fortune Calendar
            </h2>
            <div className="grid md:grid-cols-3 gap-4">
              {[
                { icon: "🌅", title: "Morning Ritual", desc: "Start each day by checking your fortune score and daily message for a mindful, intentional morning." },
                { icon: "📅", title: "Event Planning", desc: "Choose auspicious dates for weddings, job interviews, launches, or important decisions by comparing fortune scores." },
                { icon: "🎁", title: "Birthday Fortunes", desc: "Look up a friend's birthday to discover their fortune for that day — a unique and personal gift idea." },
                { icon: "📓", title: "Journaling Prompt", desc: "Use the daily wisdom message as a journaling prompt or meditation focus to deepen self-reflection." },
                { icon: "🏫", title: "Classroom Activity", desc: "Teachers use the calendar to introduce students to cultural traditions and creative writing exercises." },
                { icon: "🎉", title: "Party Icebreaker", desc: "Share fortune scores with guests at parties or team meetings to spark fun conversations." },
              ].map((u) => (
                <div key={u.title} className="p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  <span className="text-2xl block mb-2">{u.icon}</span>
                  <p className="font-semibold text-slate-800 dark:text-white text-sm mb-1">{u.title}</p>
                  <p className="text-xs text-slate-600 dark:text-slate-400">{u.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* FAQ */}
          <div>
            <h2 className="text-2xl font-heading font-semibold text-slate-800 dark:text-white mb-6">
              Frequently asked questions about fortune cookie calendars
            </h2>
            <div className="space-y-4">
              {[
                {
                  q: "How is each day's fortune determined?",
                  a: "Each date's fortune is generated by our AI using a deterministic algorithm seeded by the date itself. This means the same date always produces the same fortune — so you can plan ahead or revisit past days consistently.",
                },
                {
                  q: "Can I view fortunes for past or future dates?",
                  a: "Yes! Simply click any date on the calendar — past, present, or future — to reveal its full fortune profile including score, lucky numbers, and daily message.",
                },
                {
                  q: "What is a fortune score?",
                  a: "The fortune score is a 1–5 star rating that summarizes the overall energy of a given day across love, career, health, and wealth dimensions. A score of 5 (Excellent) suggests a highly auspicious day; a score of 2 (Challenging) suggests a day to proceed with extra care.",
                },
                {
                  q: "How is the fortune calendar different from a horoscope?",
                  a: "Unlike horoscopes, which are based on astrological signs, our fortune calendar is inspired by the tradition of fortune cookies — offering universal daily wisdom rather than sign-specific predictions. It's designed for fun, reflection, and inspiration rather than astrological guidance.",
                },
                {
                  q: "Can I get a personalized fortune instead of a calendar fortune?",
                  a: "Absolutely! The calendar shows a universal daily fortune. For a personalized AI-generated fortune based on your chosen theme and mood, try our AI Fortune Cookie Generator.",
                },
              ].map((faq) => (
                <div key={faq.q} className="p-5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  <p className="font-semibold text-slate-800 dark:text-white mb-2 text-sm">{faq.q}</p>
                  <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Internal links */}
          <div>
            <h2 className="text-xl font-heading font-semibold text-slate-800 dark:text-white mb-3">
              Explore more fortune cookie tools
            </h2>
            <div className="grid md:grid-cols-2 gap-3">
              {[
                { icon: "🤖", title: "AI Fortune Cookie Generator", href: "/generator" },
                { icon: "🎊", title: "Fortune Cookie Messages by Occasion", href: "/fortune-cookie-messages" },
                { icon: "😂", title: "Funny Fortune Cookie Messages", href: "/funny-fortune-cookie-messages" },
                { icon: "💬", title: "Fortune Cookie Quotes", href: "/fortune-cookie-quotes" },
                { icon: "📚", title: "History of Fortune Cookies", href: "/history" },
                { icon: "🍪", title: "Fortune Cookie Recipes", href: "/recipes" },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-indigo-400 dark:hover:border-indigo-600 hover:shadow-sm transition-all text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-indigo-700 dark:hover:text-indigo-400 group"
                >
                  <span className="text-lg flex-shrink-0">{link.icon}</span>
                  <span className="flex-1">{link.title}</span>
                  <span className="text-slate-400 group-hover:translate-x-1 transition-transform">→</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </PageSection>
    </PageLayout>
  );
}
