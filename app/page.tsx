import { Metadata } from "next";
import dynamic from "next/dynamic";
import { Suspense } from "react";
import {
  Sparkles,
  Heart,
  Smile,
  Dice1,
  Wand2,
  Zap,
  Smartphone,
  ShieldCheck,
} from "lucide-react";
import { DynamicBackgroundEffects } from "@/components/DynamicBackgroundEffects";
import { WebApplicationStructuredData } from "@/components/StructuredData";
import { FAQStructuredData } from "@/components/FAQStructuredData";
import { generateSEOMetadata } from "@/components/SEO";
import { getSiteUrl } from "@/lib/site";
import { FortuneCookieStatic } from "@/components/FortuneCookieStatic";
import { DeferredMount } from "@/components/DeferredMount";
// SocialProof and Testimonials removed — contained unverifiable data (fake ratings, fictional reviews)
// Re-enable when backed by real user data
import { WaveDivider } from "@/components/homepage/SectionDivider";
import { AdUnit } from "@/components/AdUnit";

// Optimize for Edge Runtime - faster TTFB
export const runtime = "edge";

// Enable static generation with revalidation for optimal performance
// Increased from 1h to 6h: homepage content is stable (hero copy, hub links,
// category cards). 6h reduces ISR rebuild frequency by 6x with no UX impact.
export const revalidate = 21600; // 6 hours (was 1 hour)

const _baseUrl = getSiteUrl();

/**
 * Progressive Enhancement Strategy:
 *
 * Phase 1 (LCP): FortuneCookieStatic - Server-rendered, CSS-only animations
 *   - No JavaScript required for initial paint
 *   - CSS animations defined in CriticalCSS.tsx
 *   - Expected LCP: < 2.5s (down from 7.4s)
 *
 * Phase 2 (Hydration): FortuneCookieInteractive - Client-side enhancement
 *   - Loads after LCP is complete
 *   - Adds click handlers, state management, framer-motion animations
 *   - Uses absolute positioning to overlay static content
 *
 * Phase 3 (Deferred): BackgroundEffects, visual enhancements
 *   - Loads 2+ seconds after initial render
 *   - Non-critical visual polish
 */

// Dynamic import for interactive layer - loads AFTER static LCP content
const FortuneCookieInteractive = dynamic(
  () =>
    import("@/components/FortuneCookieInteractive").then(
      (mod) => mod.FortuneCookieInteractive,
    ),
  {
    ssr: false,
    // No loading fallback needed - static content is already visible
    loading: () => null,
  },
);

// Deferred homepage components - load after LCP
const CategoryQuickLinks = dynamic(
  () =>
    import("@/components/homepage/CategoryQuickLinks").then(
      (mod) => mod.CategoryQuickLinks,
    ),
  { ssr: false, loading: () => null },
);

const PSEOHubLinks = dynamic(
  () =>
    import("@/components/homepage/PSEOHubLinks").then(
      (mod) => mod.PSEOHubLinks,
    ),
  { ssr: false, loading: () => null },
);

const HotFortuneCarousel = dynamic(
  () =>
    import("@/components/homepage/HotFortuneCarousel").then(
      (mod) => mod.HotFortuneCarousel,
    ),
  { ssr: false, loading: () => null },
);

const DailyFortune = dynamic(
  () => import("@/components/DailyFortune").then((mod) => mod.DailyFortune),
  { ssr: false, loading: () => null },
);

const UseCaseScenes = dynamic(
  () =>
    import("@/components/homepage/UseCaseScenes").then(
      (mod) => mod.UseCaseScenes,
    ),
  { ssr: false, loading: () => null },
);

// Push notification prompt - loaded after LCP, shown after user interacts
const PushNotificationPrompt = dynamic(
  () =>
    import("@/components/PushNotificationPrompt").then(
      (mod) => mod.PushNotificationPrompt,
    ),
  { ssr: false, loading: () => null },
);

// Scroll reveal component - loaded dynamically for non-critical sections
const ScrollReveal = dynamic(
  () => import("@/components/ScrollReveal").then((mod) => mod.ScrollReveal),
  { ssr: false, loading: () => null },
);

const StaggerContainer = dynamic(
  () => import("@/components/ScrollReveal").then((mod) => mod.StaggerContainer),
  { ssr: false, loading: () => null },
);

const StaggerItem = dynamic(
  () => import("@/components/ScrollReveal").then((mod) => mod.StaggerItem),
  { ssr: false, loading: () => null },
);

// Feature list with modern gradient backgrounds
const features = [
  {
    icon: Sparkles,
    text: "Free online fortune cookie generator with AI",
    gradient: "from-indigo-500 to-purple-500",
    bgColor: "bg-indigo-50 dark:bg-indigo-950/30",
    borderColor: "border-indigo-100 dark:border-indigo-800/50",
  },
  {
    icon: Heart,
    text: "Inspirational and motivational quotes",
    gradient: "from-pink-500 to-rose-500",
    bgColor: "bg-pink-50 dark:bg-pink-950/30",
    borderColor: "border-pink-100 dark:border-pink-800/50",
  },
  {
    icon: Smile,
    text: "Funny fortune cookie messages",
    gradient: "from-amber-500 to-orange-500",
    bgColor: "bg-amber-50 dark:bg-amber-950/30",
    borderColor: "border-amber-100 dark:border-amber-800/50",
  },
  {
    icon: Dice1,
    text: "Lucky numbers for each fortune",
    gradient: "from-emerald-500 to-teal-500",
    bgColor: "bg-emerald-50 dark:bg-emerald-950/30",
    borderColor: "border-emerald-100 dark:border-emerald-800/50",
  },
  {
    icon: Wand2,
    text: "Custom message creation",
    gradient: "from-violet-500 to-purple-500",
    bgColor: "bg-violet-50 dark:bg-violet-950/30",
    borderColor: "border-violet-100 dark:border-violet-800/50",
  },
  {
    icon: Zap,
    text: "Beautiful animations and effects",
    gradient: "from-blue-500 to-cyan-500",
    bgColor: "bg-blue-50 dark:bg-blue-950/30",
    borderColor: "border-blue-100 dark:border-blue-800/50",
  },
  {
    icon: Smartphone,
    text: "Mobile-friendly responsive design",
    gradient: "from-cyan-500 to-sky-500",
    bgColor: "bg-cyan-50 dark:bg-cyan-950/30",
    borderColor: "border-cyan-100 dark:border-cyan-800/50",
  },
  {
    icon: ShieldCheck,
    text: "No registration required",
    gradient: "from-green-500 to-emerald-500",
    bgColor: "bg-green-50 dark:bg-green-950/30",
    borderColor: "border-green-100 dark:border-green-800/50",
  },
];

export const metadata: Metadata = {
  ...generateSEOMetadata({
    title: "Fortune Cookie AI — Free Online Fortune Cookie Generator",
    description:
      "Crack open a free AI fortune cookie online! Get personalized fortune cookie messages, lucky numbers & daily wisdom in seconds. 500+ unique fortunes, 6 themes, no signup needed.",
    image: "/og-image.png",
    url: "/",
    type: "website",
  }),
  openGraph: {
    title: "Fortune Cookie AI — Free Online Fortune Cookie Generator",
    description:
      "Crack open a free AI fortune cookie online! Get personalized fortune cookie messages, lucky numbers & daily wisdom in seconds. 500+ unique fortunes, 6 themes, no signup needed.",
    type: "website",
    url: _baseUrl,
    images: [
      {
        url: `${_baseUrl}/api/og?type=pseo&title=${encodeURIComponent("Fortune Cookie AI")}&emoji=${encodeURIComponent("🥠")}&badge=${encodeURIComponent("Free AI Generator")}&description=${encodeURIComponent("Generate personalized fortune cookie messages for any occasion. Free, instant, and powered by AI.")}&gradient=default`,
        width: 1200,
        height: 630,
        alt: "Fortune Cookie AI — Free Online Fortune Cookie Generator",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Fortune Cookie AI — Free Online Fortune Cookie Generator",
    description:
      "Crack open a free AI fortune cookie online! Get personalized fortune cookie messages, lucky numbers & daily wisdom in seconds.",
    images: [`${_baseUrl}/api/og?type=pseo&title=${encodeURIComponent("Fortune Cookie AI")}&emoji=${encodeURIComponent("🥠")}&badge=${encodeURIComponent("Free AI Generator")}&description=${encodeURIComponent("Generate personalized fortune cookie messages for any occasion. Free, instant, and powered by AI.")}&gradient=default`],
    creator: "@fortunecookieai",
  },
};

export default function HomePage() {
  return (
    <>
      {/* Structured Data */}
      <WebApplicationStructuredData />
      <FAQStructuredData
        faqs={[
          {
            question: "What is a fortune cookie generator?",
            answer:
              "A fortune cookie generator is a free online tool that creates personalized fortune cookie messages using AI. You can choose themes like love, career, humor, and wisdom to get unique fortune messages with lucky numbers.",
          },
          {
            question: "Is this fortune cookie generator free to use?",
            answer:
              "Yes! Our AI fortune cookie generator is completely free. You can generate up to 5 fortune cookies per day without signing up, or sign in for 20 daily fortunes.",
          },
          {
            question: "How does the AI fortune cookie work?",
            answer:
              "Our generator uses advanced AI to create unique, personalized fortune messages based on your selected theme and mood. Each fortune comes with lucky numbers and can be shared on social media.",
          },
          {
            question: "Can I get a fortune cookie online?",
            answer:
              "Absolutely! Just visit our website and click to crack open a virtual fortune cookie. You'll receive a unique message with lucky numbers instantly — no download required.",
          },
          {
            question: "What themes are available for fortune cookies?",
            answer:
              "We offer 6 themes: Inspirational, Love & Romance, Funny, Career & Success, Wisdom, and Random. Each theme generates messages tailored to that category.",
          },
        ]}
      />

      <main className="min-h-screen w-full overflow-x-hidden relative">
        {/* Background effects - static first, animated after idle */}
        <DynamicBackgroundEffects />

        {/*
          Progressive Enhancement Container
          Static content renders first, interactive overlay loads after
        */}
        <div className="relative z-10">
          {/* Phase 1: Static LCP Content - Server-Side Rendered */}
          <FortuneCookieStatic />

          {/* Phase 2: Interactive Layer - Client-Side Hydration */}
          <Suspense fallback={null}>
            <DeferredMount delay={3000} useIdle={false}>
              <FortuneCookieInteractive />
            </DeferredMount>
          </Suspense>
        </div>

        {/* Ad Unit - between fortune cookie and category links */}
        <div className="relative z-10 bg-white dark:bg-slate-900 py-4 flex justify-center">
          <AdUnit slot="3178756975" />
        </div>

        {/* Category Quick Links Section */}
        <div className="relative z-10 bg-gradient-to-b from-indigo-50/80 via-white to-white dark:from-indigo-950/30 dark:via-slate-900 dark:to-slate-900">
          <WaveDivider
            fillColor="fill-indigo-50/80 dark:fill-indigo-950/30"
            position="top"
            height={40}
          />
          <Suspense fallback={null}>
            <DeferredMount delay={1500} useIdle={false}>
              <CategoryQuickLinks />
            </DeferredMount>
          </Suspense>
        </div>

        {/* pSEO Hub Links Section */}
        <div className="relative z-10 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800">
          <Suspense fallback={null}>
            <DeferredMount delay={1800} useIdle={false}>
              <PSEOHubLinks />
            </DeferredMount>
          </Suspense>
        </div>

        {/* Hot Fortune Carousel Section */}
        <div className="relative z-10 bg-white dark:bg-slate-900">
          <Suspense fallback={null}>
            <DeferredMount delay={2000} useIdle={false}>
              <HotFortuneCarousel />
            </DeferredMount>
          </Suspense>
        </div>

        {/* Daily Fortune Section - For User Retention */}
        <div className="relative z-10 bg-gradient-to-b from-white to-indigo-50/50 dark:from-slate-900 dark:to-indigo-950/20">
          <div className="container mx-auto px-4 py-12">
            <Suspense fallback={null}>
              <DeferredMount delay={2200} useIdle={false}>
                <div className="max-w-2xl mx-auto">
                  <DailyFortune showTomorrowPreview={true} compact={false} />
                </div>
              </DeferredMount>
            </Suspense>
          </div>
        </div>

        {/* Push Notification Prompt - shown after user has interacted with the page */}
        <Suspense fallback={null}>
          <DeferredMount delay={5000} useIdle={true}>
            <PushNotificationPrompt variant="banner" />
          </DeferredMount>
        </Suspense>

        {/* SEO-optimized visible content */}
        <div className="relative z-10 bg-gradient-to-b from-white to-slate-50/50 dark:from-slate-900 dark:to-slate-800/50 backdrop-blur-sm border-t border-indigo-100/50 dark:border-indigo-800/30 pt-12 pb-16">
          <div className="container mx-auto px-4">
            <Suspense fallback={null}>
              <ScrollReveal direction="up" delay={0.1}>
                <div className="max-w-4xl mx-auto text-center mb-16">
                  <h1 className="text-3xl md:text-4xl font-heading font-bold text-slate-800 dark:text-white mb-6">
                    Fortune Cookie AI - Free Online Fortune Cookie Generator
                  </h1>
                  <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
                    Welcome to the best free online AI-powered fortune cookie
                    generator! Create personalized inspirational messages, funny
                    quotes, and discover your lucky numbers. Our AI tool
                    generates unique fortune cookies for entertainment,
                    motivation, and fun.
                  </p>
                </div>
              </ScrollReveal>
            </Suspense>

            <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
              <section>
                <Suspense fallback={null}>
                  <ScrollReveal direction="left" delay={0.2}>
                    <h2 className="text-2xl font-heading font-semibold text-indigo-700 dark:text-indigo-300 mb-6 flex items-center gap-2">
                      <span className="text-3xl">✨</span> Why Use Our
                      Generator?
                    </h2>
                  </ScrollReveal>
                  <StaggerContainer staggerDelay={0.08} className="space-y-3">
                    {features.map((feature, index) => {
                      const Icon = feature.icon;
                      return (
                        <StaggerItem key={index} direction="left">
                          <div
                            className={`flex items-center gap-3 p-3 rounded-xl ${feature.bgColor} border ${feature.borderColor} transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-indigo-500/10`}
                          >
                            <div
                              className={`p-2.5 rounded-xl bg-gradient-to-br ${feature.gradient} shadow-lg`}
                            >
                              <Icon
                                className="h-5 w-5 text-white"
                                aria-hidden="true"
                              />
                            </div>
                            <span className="text-slate-700 dark:text-slate-200 font-medium">
                              {feature.text}
                            </span>
                          </div>
                        </StaggerItem>
                      );
                    })}
                  </StaggerContainer>
                </Suspense>
              </section>

              <section>
                <Suspense fallback={null}>
                  <ScrollReveal direction="right" delay={0.2}>
                    <h2 className="text-2xl font-heading font-semibold text-indigo-700 dark:text-indigo-300 mb-6 flex items-center gap-2">
                      <span className="text-3xl">🥠</span> How to Use
                    </h2>
                  </ScrollReveal>
                  <ScrollReveal direction="right" delay={0.3}>
                    <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-lg shadow-indigo-500/5">
                      <p className="mb-4 text-slate-600 dark:text-slate-300">
                        Simply click on the fortune cookie above to crack it
                        open and reveal your personalized message. Each fortune
                        comes with:
                      </p>
                      <ul className="list-none pl-0 space-y-3 mb-6">
                        <li className="flex items-center gap-3">
                          <span className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white text-sm font-bold shadow-lg">
                            1
                          </span>
                          <span className="text-slate-700 dark:text-slate-200">
                            A unique wisdom or prediction
                          </span>
                        </li>
                        <li className="flex items-center gap-3">
                          <span className="w-8 h-8 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-sm font-bold shadow-lg">
                            2
                          </span>
                          <span className="text-slate-700 dark:text-slate-200">
                            Your daily lucky numbers
                          </span>
                        </li>
                        <li className="flex items-center gap-3">
                          <span className="w-8 h-8 rounded-xl bg-gradient-to-br from-pink-500 to-orange-500 flex items-center justify-center text-white text-sm font-bold shadow-lg">
                            3
                          </span>
                          <span className="text-slate-700 dark:text-slate-200">
                            Shareable wisdom to brighten your day
                          </span>
                        </li>
                      </ul>
                      <p className="text-slate-600 dark:text-slate-300">
                        Want more specific fortunes? Try our{" "}
                        <a
                          href="/generator"
                          className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-semibold transition-colors"
                        >
                          AI Generator
                        </a>{" "}
                        to create custom messages for friends and family!
                      </p>
                    </div>
                  </ScrollReveal>
                </Suspense>
              </section>
            </div>

            {/* Social Proof Section removed — re-enable when backed by real data */}
          </div>
        </div>

        {/* Use Case Scenes Section */}
        <div className="relative z-10 bg-gradient-to-b from-slate-50/50 to-indigo-50/30 dark:from-slate-800/50 dark:to-indigo-950/20">
          <Suspense fallback={null}>
            <DeferredMount delay={2500} useIdle={false}>
              <UseCaseScenes />
            </DeferredMount>
          </Suspense>
        </div>

        {/* Section Divider */}
        <WaveDivider
          fillColor="fill-white/80 dark:fill-slate-900/80"
          position="top"
          height={50}
          className="relative z-10 bg-gradient-to-b from-indigo-50/30 to-transparent dark:from-indigo-950/20 dark:to-transparent"
        />

        {/* Testimonials Section removed — contained fictional reviews */}
      </main>
    </>
  );
}
