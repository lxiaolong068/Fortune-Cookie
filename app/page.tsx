import { Metadata } from "next";
import dynamic from "next/dynamic";
import { Suspense } from "react";
import { DynamicBackgroundEffects } from "@/components/DynamicBackgroundEffects";
import { WebApplicationStructuredData } from "@/components/StructuredData";
import { generateSEOMetadata } from "@/components/SEO";
import { FortuneCookieStatic } from "@/components/FortuneCookieStatic";

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
        {/* Background effects - deferred loading */}
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
            <FortuneCookieInteractive />
          </Suspense>
        </div>

        {/* SEO-optimized visible content */}
        <div className="relative z-10 bg-white/80 backdrop-blur-sm border-t border-amber-200 mt-[-50px] pt-20 pb-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center mb-16">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
                Fortune Cookie - Free Online AI Generator
              </h1>
              <p className="text-lg text-gray-600 leading-relaxed">
                Welcome to the best free online AI-powered fortune cookie
                generator! Create personalized inspirational messages, funny
                quotes, and discover your lucky numbers. Our AI tool generates
                unique fortune cookies for entertainment, motivation, and fun.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
              <section>
                <h2 className="text-2xl font-semibold text-amber-700 mb-6 flex items-center gap-2">
                  <span className="text-3xl">✨</span> Why Use Our Generator?
                </h2>
                <ul className="space-y-4">
                  {[
                    "Free online fortune cookie generator with AI",
                    "Inspirational and motivational quotes",
                    "Funny fortune cookie messages",
                    "Lucky numbers for each fortune",
                    "Custom message creation",
                    "Beautiful animations and effects",
                    "Mobile-friendly responsive design",
                    "No registration required",
                  ].map((item, index) => (
                    <li
                      key={index}
                      className="flex items-start gap-3 text-gray-700"
                    >
                      <span className="text-amber-500 mt-1">✓</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-amber-700 mb-6 flex items-center gap-2">
                  <span className="text-3xl">🥠</span> How to Use
                </h2>
                <div className="prose prose-amber text-gray-600">
                  <p className="mb-4">
                    Simply click on the fortune cookie above to crack it open
                    and reveal your personalized message. Each fortune comes
                    with:
                  </p>
                  <ul className="list-disc pl-5 space-y-2 mb-6">
                    <li>A unique wisdom or prediction</li>
                    <li>Your daily lucky numbers</li>
                    <li>Shareable wisdom to brighten your day</li>
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
              </section>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
