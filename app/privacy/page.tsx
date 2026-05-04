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
    "Privacy Policy for Fortune Cookie AI. Learn what data we collect when you use our AI fortune cookie generator, how we protect it, and your rights as a user.",
  openGraph: {
    title: "Privacy Policy - Fortune Cookie AI",
    description:
      "Read how Fortune Cookie AI handles your data: what we collect from the AI fortune cookie generator, how we protect your privacy, and your rights.",
    type: "article",
    url: `${baseUrl}/privacy`,
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
      "Read how Fortune Cookie AI handles your data: what we collect from the AI fortune cookie generator, how we protect your privacy, and your rights.",
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
