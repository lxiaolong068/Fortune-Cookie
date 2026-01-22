import { Metadata } from "next";
import dynamic from "next/dynamic";
import { Suspense } from "react";
import { notFound } from "next/navigation";
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
import { FortuneCookieStatic } from "@/components/FortuneCookieStatic";
import { DeferredMount } from "@/components/DeferredMount";
import { SocialProof } from "@/components/SocialProof";
import { Testimonials } from "@/components/Testimonials";
import { WaveDivider } from "@/components/homepage/SectionDivider";
import { i18n, isValidLocale, getLanguageConfig, getSEOConfig, type Locale } from "@/lib/i18n-config";
import { loadTranslations, getTranslation } from "@/lib/translations";

// Optimize for Edge Runtime - faster TTFB
export const runtime = "edge";

// Enable static generation with revalidation for optimal performance
export const revalidate = 3600; // Revalidate every hour

// Generate static params for all locales
export function generateStaticParams() {
  return i18n.locales.map((locale) => ({
    locale,
  }));
}

// Generate metadata for each locale
export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const { locale } = params;

  if (!isValidLocale(locale)) {
    return {};
  }

  const seoConfig = getSEOConfig(locale);
  const langConfig = getLanguageConfig(locale);
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://fortunecookieai.app";

  // Generate alternate language links
  const alternates: Record<string, string> = {};
  for (const loc of i18n.locales) {
    const config = getLanguageConfig(loc);
    alternates[config.hreflang] = loc === i18n.defaultLocale
      ? baseUrl
      : `${baseUrl}/${loc}`;
  }

  return {
    title: seoConfig.title,
    description: seoConfig.description,
    keywords: seoConfig.keywords,
    openGraph: {
      title: seoConfig.title,
      description: seoConfig.description,
      url: locale === i18n.defaultLocale ? baseUrl : `${baseUrl}/${locale}`,
      siteName: "Fortune Cookie AI",
      locale: langConfig.hreflang.replace("-", "_"),
      type: "website",
      images: [
        {
          url: `${baseUrl}/og-image.png`,
          width: 1200,
          height: 630,
          alt: seoConfig.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: seoConfig.title,
      description: seoConfig.description,
      images: [`${baseUrl}/og-image.png`],
    },
    alternates: {
      canonical: locale === i18n.defaultLocale ? baseUrl : `${baseUrl}/${locale}`,
      languages: alternates,
    },
  };
}

// Dynamic imports for interactive components
const FortuneCookieInteractive = dynamic(
  () =>
    import("@/components/FortuneCookieInteractive").then(
      (mod) => mod.FortuneCookieInteractive,
    ),
  {
    ssr: false,
    loading: () => null,
  },
);

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

// Feature configuration - icons and styling
const featureConfig = [
  {
    icon: Sparkles,
    key: "feature1",
    color: "text-amber-600",
    bgColor: "bg-amber-100",
    borderColor: "border-amber-200",
  },
  {
    icon: Heart,
    key: "feature2",
    color: "text-pink-600",
    bgColor: "bg-pink-100",
    borderColor: "border-pink-200",
  },
  {
    icon: Smile,
    key: "feature3",
    color: "text-yellow-600",
    bgColor: "bg-yellow-100",
    borderColor: "border-yellow-200",
  },
  {
    icon: Dice1,
    key: "feature4",
    color: "text-green-600",
    bgColor: "bg-green-100",
    borderColor: "border-green-200",
  },
  {
    icon: Wand2,
    key: "feature5",
    color: "text-purple-600",
    bgColor: "bg-purple-100",
    borderColor: "border-purple-200",
  },
  {
    icon: Zap,
    key: "feature6",
    color: "text-blue-600",
    bgColor: "bg-blue-100",
    borderColor: "border-blue-200",
  },
  {
    icon: Smartphone,
    key: "feature7",
    color: "text-cyan-600",
    bgColor: "bg-cyan-100",
    borderColor: "border-cyan-200",
  },
  {
    icon: ShieldCheck,
    key: "feature8",
    color: "text-emerald-600",
    bgColor: "bg-emerald-100",
    borderColor: "border-emerald-200",
  },
];

interface LocalePageProps {
  params: {
    locale: string;
  };
}

export default async function LocaleHomePage({ params }: LocalePageProps) {
  const { locale } = params;

  // Validate locale
  if (!isValidLocale(locale)) {
    notFound();
  }

  // Load translations
  const translations = await loadTranslations(locale as Locale);

  // Helper function to get translation
  const t = (key: string, p?: Record<string, string | number>) =>
    getTranslation(translations, key, p);

  // Get localized path helper
  const getLocalizedHref = (path: string) => {
    if (locale === i18n.defaultLocale) {
      return path;
    }
    return `/${locale}${path}`;
  };

  return (
    <>
      {/* Structured Data */}
      <WebApplicationStructuredData />

      <main className="min-h-screen w-full overflow-x-hidden relative">
        {/* Background effects */}
        <DynamicBackgroundEffects />

        {/* Progressive Enhancement Container */}
        <div className="relative z-10">
          {/* Phase 1: Static LCP Content */}
          <FortuneCookieStatic />

          {/* Phase 2: Interactive Layer */}
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

        {/* Daily Fortune Section */}
        <div className="relative z-10 bg-gradient-to-b from-white to-amber-50/50">
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

        {/* SEO-optimized visible content */}
        <div className="relative z-10 bg-gradient-to-b from-white to-orange-50/30 backdrop-blur-sm border-t border-amber-200/50 pt-12 pb-16">
          <div className="container mx-auto px-4">
            <Suspense fallback={null}>
              <ScrollReveal direction="up" delay={0.1}>
                <div className="max-w-4xl mx-auto text-center mb-16">
                  <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
                    {t("home.heroTitle")}
                  </h1>
                  <p className="text-lg text-gray-600 leading-relaxed">
                    {t("home.heroDescription")}
                  </p>
                </div>
              </ScrollReveal>
            </Suspense>

            <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
              <section>
                <Suspense fallback={null}>
                  <ScrollReveal direction="left" delay={0.2}>
                    <h2 className="text-2xl font-semibold text-amber-700 mb-6 flex items-center gap-2">
                      <span className="text-3xl">✨</span> {t("home.whyUseTitle")}
                    </h2>
                  </ScrollReveal>
                  <StaggerContainer staggerDelay={0.08} className="space-y-3">
                    {featureConfig.map((feature, index) => {
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
                              {t(`home.features.${feature.key}`)}
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
                      <span className="text-3xl">🥠</span> {t("home.howToUseTitle")}
                    </h2>
                  </ScrollReveal>
                  <ScrollReveal direction="right" delay={0.3}>
                    <div className="prose prose-amber text-gray-600 bg-gradient-to-br from-amber-50 to-orange-50 p-6 rounded-xl border border-amber-200">
                      <p className="mb-4">
                        {t("home.howToUseDescription")}
                      </p>
                      <ul className="list-none pl-0 space-y-3 mb-6">
                        <li className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-full bg-amber-200 flex items-center justify-center text-amber-700 text-sm font-bold">
                            1
                          </span>
                          {t("home.howToUseStep1")}
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-full bg-amber-200 flex items-center justify-center text-amber-700 text-sm font-bold">
                            2
                          </span>
                          {t("home.howToUseStep2")}
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-full bg-amber-200 flex items-center justify-center text-amber-700 text-sm font-bold">
                            3
                          </span>
                          {t("home.howToUseStep3")}
                        </li>
                      </ul>
                      <p>
                        {t("home.howToUseCta")}{" "}
                        <a
                          href={getLocalizedHref("/generator")}
                          className="text-amber-600 hover:underline font-medium"
                        >
                          {t("home.aiGeneratorLink")}
                        </a>{" "}
                        {t("home.howToUseCtaSuffix")}
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
