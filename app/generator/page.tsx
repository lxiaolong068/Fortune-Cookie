import { Metadata } from "next";
import { DynamicBackgroundEffects } from "@/components/DynamicBackgroundEffects";
import { BreadcrumbStructuredData } from "@/components/StructuredData";
import { getImageUrl, getSiteUrl } from "@/lib/site";
import { generateAlternateLanguages } from "@/lib/i18n-config";
import { GeneratorClient } from "./GeneratorClient";

const baseUrl = getSiteUrl();

export const metadata: Metadata = {
  title: "AI Fortune Cookie Generator - Create Custom Messages",
  description:
    "Free AI fortune cookie generator for personalized messages, funny quotes, and lucky numbers. Create and share custom fortune cookies instantly.",
  openGraph: {
    title: "AI Fortune Cookie Generator - Create Custom Messages",
    description:
      "Use our advanced AI fortune cookie generator to create personalized inspirational messages, funny quotes, and custom fortune cookies.",
    type: "website",
    url: `${baseUrl}/generator`,
    images: [
      {
        url: getImageUrl("/og-image.png"),
        width: 1200,
        height: 630,
        alt: "AI Fortune Cookie Generator",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Fortune Cookie Generator - Create Custom Messages",
    description:
      "Free AI fortune cookie generator for personalized messages, funny quotes, and lucky numbers. Create and share custom fortune cookies instantly.",
    images: [getImageUrl("/twitter-image.png")],
    creator: "@fortunecookieai",
  },
  alternates: {
    canonical: "/generator",
    languages: generateAlternateLanguages("/generator", baseUrl),
  },
};

export default function GeneratorPage() {
  return (
    <>
      <BreadcrumbStructuredData
        items={[
          { name: "Home", url: "/" },
          { name: "Generator", url: "/generator" },
        ]}
      />
      <main className="min-h-screen w-full overflow-x-hidden relative">
        <DynamicBackgroundEffects />
        <div className="relative z-10">
          <GeneratorClient />
        </div>
      </main>
    </>
  );
}
