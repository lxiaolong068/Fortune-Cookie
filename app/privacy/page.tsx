import { Metadata } from "next";
import { getImageUrl, getSiteUrl } from "@/lib/site";
import { generateAlternateLanguages } from "@/lib/i18n-config";
import { PrivacyPageContent } from "./PrivacyPageContent";

const baseUrl = getSiteUrl();

// Static generation configuration
export const dynamic = "force-static";
export const revalidate = 86400; // 24 hours

export const metadata: Metadata = {
  title: "Privacy Policy - Fortune Cookie AI",
  description:
    "Privacy Policy for Fortune Cookie AI. Learn how we collect, use, and protect your data. We prioritize your privacy and security.",
  openGraph: {
    title: "Privacy Policy - Fortune Cookie AI",
    description:
      "Learn how Fortune Cookie AI protects your privacy and personal data.",
    type: "article",
    url: "https://www.fortune-cookie.cc/privacy",
    images: [
      {
        url: getImageUrl("/og-image.png"),
        width: 1200,
        height: 630,
        alt: "Privacy Policy - Fortune Cookie AI",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Privacy Policy - Fortune Cookie AI",
    description:
      "Learn how Fortune Cookie AI protects your privacy and personal data.",
    images: [getImageUrl("/twitter-image.png")],
    creator: "@fortunecookieai",
  },
  alternates: {
    canonical: "/privacy",
    languages: generateAlternateLanguages("/privacy", baseUrl),
  },
  robots: "index, follow",
};

export default function PrivacyPage() {
  return <PrivacyPageContent />;
}
