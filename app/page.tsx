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
import { generateSEOMetadata } from "@/components/SEO";
import { FortuneCookieStatic } from "@/components/FortuneCookieStatic";
import { DeferredMount } from "@/components/DeferredMount";
import { SocialProof } from "@/components/SocialProof";
import { Testimonials } from "@/components/Testimonials";
import { WaveDivider } from "@/components/homepage/SectionDivider";

// Optimize for Edge Runtime - faster TTFB
export const runtime = "edge";

// Enable static generation with revalidation for optimal performance
export const revalidate = 3600; // Revalidate every hour

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

const HotFortuneCarousel = dynamic(
  () =>
    import("@/components/homepage/HotFortuneCarousel").then(
      (mod) => mod.HotFortuneCarousel,
    ),
  { ssr: false, loading: () => null },
);

const UseCaseScenes = dynamic(
  () =>
    import("@/components/homepage/UseCaseScenes").then(
      (mod) => mod.UseCaseScenes,
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

// Feature list with colorful icons and gradient backgrounds
const features = [
  {
    icon: Sparkles,
    text: "Free online fortune cookie generator with AI",
    color: "text-amber-600",
    bgColor: "bg-amber-100",
    borderColor: "border-amber-200",
  },
  {
    icon: Heart,
    text: "Inspirational and motivational quotes",
    color: "text-pink-600",
    bgColor: "bg-pink-100",
    borderColor: "border-pink-200",
  },
  {
    icon: Smile,
    text: "Funny fortune cookie messages",
    color: "text-yellow-600",
    bgColor: "bg-yellow-100",
    borderColor: "border-yellow-200",
  },
  {
    icon: Dice1,
    text: "Lucky numbers for each fortune",
    color: "text-green-600",
    bgColor: "bg-green-100",
    borderColor: "border-green-200",
  },
  {
    icon: Wand2,
    text: "Custom message creation",
    color: "text-purple-600",
    bgColor: "bg-purple-100",
    borderColor: "border-purple-200",
  },
  {
    icon: Zap,
    text: "Beautiful animations and effects",
    color: "text-blue-600",
    bgColor: "bg-blue-100",
    borderColor: "border-blue-200",
  },
  {
    icon: Smartphone,
    text: "Mobile-friendly responsive design",
    color: "text-cyan-600",
    bgColor: "bg-cyan-100",
    borderColor: "border-cyan-200",
  },
  {
    icon: ShieldCheck,
    text: "No registration required",
    color: "text-emerald-600",
    bgColor: "bg-emerald-100",
    borderColor: "border-emerald-200",
  },
];

export const metadata: Metadata = generateSEOMetadata({
  title: "Fortune Cookie - Free Online AI Generator",
  description:
    "Free online AI-powered fortune cookie generator. Get personalized inspirational messages, funny quotes, and lucky numbers. Create custom cookies with our AI.",
  image: "/og-image.png",
  url: "/",
  type: "website",
});

export default function HomePage() {
  return (
    <>
      {/* Structured Data */}
      <WebApplicationStructuredData />

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

        {/* Category Quick Links Section */}
        <div className="relative z-10 bg-gradient-to-b from-amber-100/80 to-white">
          <WaveDivider
            fillColor="fill-amber-100/80"
            position="top"
            height={40}
          />
          <Suspense fallback={null}>
            <DeferredMount delay={1500} useIdle={false}>
              <CategoryQuickLinks />
            </DeferredMount>
          </Suspense>
        </div>

        {/* Hot Fortune Carousel Section */}
        <div className="relative z-10 bg-white">
          <Suspense fallback={null}>
            <DeferredMount delay={2000} useIdle={false}>
              <HotFortuneCarousel />
            </DeferredMount>
          </Suspense>
        </div>

        {/* SEO-optimized visible content */}
        <div className="relative z-10 bg-gradient-to-b from-white to-orange-50/30 backdrop-blur-sm border-t border-amber-200/50 pt-12 pb-16">
          <div className="container mx-auto px-4">
            <Suspense fallback={null}>
              <ScrollReveal direction="up" delay={0.1}>
                <div className="max-w-4xl mx-auto text-center mb-16">
                  <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
                    Fortune Cookie - Free Online AI Generator
                  </h1>
                  <p className="text-lg text-gray-600 leading-relaxed">
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
                    <h2 className="text-2xl font-semibold text-amber-700 mb-6 flex items-center gap-2">
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
                            className={`flex items-center gap-3 p-3 rounded-lg ${feature.bgColor} border ${feature.borderColor} transition-all duration-200 hover:scale-[1.02] hover:shadow-md`}
                          >
                            <div
                              className={`p-2 rounded-full bg-white/80 shadow-sm`}
                            >
                              <Icon
                                className={`h-5 w-5 ${feature.color}`}
                                aria-hidden="true"
                              />
                            </div>
                            <span className="text-gray-700 font-medium">
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
                    <h2 className="text-2xl font-semibold text-amber-700 mb-6 flex items-center gap-2">
                      <span className="text-3xl">🥠</span> How to Use
                    </h2>
                  </ScrollReveal>
                  <ScrollReveal direction="right" delay={0.3}>
                    <div className="prose prose-amber text-gray-600 bg-gradient-to-br from-amber-50 to-orange-50 p-6 rounded-xl border border-amber-200">
                      <p className="mb-4">
                        Simply click on the fortune cookie above to crack it
                        open and reveal your personalized message. Each fortune
                        comes with:
                      </p>
                      <ul className="list-none pl-0 space-y-3 mb-6">
                        <li className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-full bg-amber-200 flex items-center justify-center text-amber-700 text-sm font-bold">
                            1
                          </span>
                          A unique wisdom or prediction
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-full bg-amber-200 flex items-center justify-center text-amber-700 text-sm font-bold">
                            2
                          </span>
                          Your daily lucky numbers
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-full bg-amber-200 flex items-center justify-center text-amber-700 text-sm font-bold">
                            3
                          </span>
                          Shareable wisdom to brighten your day
                        </li>
                      </ul>
                      <p>
                        Want more specific fortunes? Try our{" "}
                        <a
                          href="/generator"
                          className="text-amber-600 hover:underline font-medium"
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

            {/* Social Proof Section */}
            <Suspense fallback={null}>
              <ScrollReveal direction="up" delay={0.2}>
                <div className="mt-16">
                  <SocialProof variant="hero" />
                </div>
              </ScrollReveal>
            </Suspense>
          </div>
        </div>

        {/* Use Case Scenes Section */}
        <div className="relative z-10 bg-gradient-to-b from-orange-50/30 to-pink-50/20">
          <Suspense fallback={null}>
            <DeferredMount delay={2500} useIdle={false}>
              <UseCaseScenes />
            </DeferredMount>
          </Suspense>
        </div>

        {/* Section Divider */}
        <WaveDivider
          fillColor="fill-white/80"
          position="top"
          height={50}
          className="relative z-10 bg-gradient-to-b from-pink-50/20 to-transparent"
        />

        {/* Testimonials Section */}
        <div className="relative z-10 bg-gradient-to-b from-white/80 to-amber-50/30 backdrop-blur-sm pb-16">
          <Testimonials limit={6} enableCarousel={true} />
        </div>
      </main>
    </>
  );
}
