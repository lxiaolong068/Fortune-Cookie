import { Metadata } from "next";
import { getImageUrl, getSiteUrl } from "@/lib/site";
import { generateAlternateLanguages } from "@/lib/i18n-config";
import { TermsPageContent } from "./TermsPageContent";

const baseUrl = getSiteUrl();

// Static generation configuration
export const dynamic = "force-static";
export const revalidate = 86400; // 24 hours

export const metadata: Metadata = {
  title: "Terms of Service - Fortune Cookie AI",
  description:
    "Terms of Service for Fortune Cookie AI. Learn the rules, rights, and responsibilities for using our service.",
  openGraph: {
    title: "Terms of Service - Fortune Cookie AI",
    description:
      "Learn about the terms and conditions for using Fortune Cookie AI service.",
    type: "article",
    url: "https://www.fortune-cookie.cc/terms",
    images: [
      {
        url: getImageUrl("/og-image.png"),
        width: 1200,
        height: 630,
        alt: "Terms of Service - Fortune Cookie AI",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Terms of Service - Fortune Cookie AI",
    description:
      "Learn about the terms and conditions for using Fortune Cookie AI service.",
    images: [getImageUrl("/twitter-image.png")],
    creator: "@fortunecookieai",
  },
  alternates: {
    canonical: "/terms",
    languages: generateAlternateLanguages("/terms", baseUrl),
  },
  robots: "index, follow",
};

export default function TermsPage() {
  return <TermsPageContent />;
}
