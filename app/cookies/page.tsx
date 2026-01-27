import { Metadata } from "next";
import { getImageUrl, getSiteUrl } from "@/lib/site";
import { generateAlternateLanguages } from "@/lib/i18n-config";
import { CookiesPageContent } from "./CookiesPageContent";

const baseUrl = getSiteUrl();

// Static generation configuration
export const dynamic = "force-static";
export const revalidate = 86400; // 24 hours

export const metadata: Metadata = {
  title: "Cookie Policy - Fortune Cookie AI",
  description:
    "Fortune Cookie AI Cookie Policy. Learn how we use cookies and similar technologies to improve your browsing experience.",
  openGraph: {
    title: "Cookie Policy - Fortune Cookie AI",
    description:
      "Learn how Fortune Cookie AI uses cookies and local storage technologies.",
    type: "article",
    url: "https://www.fortune-cookie.cc/cookies",
    images: [
      {
        url: getImageUrl("/og-image.png"),
        width: 1200,
        height: 630,
        alt: "Cookie Policy - Fortune Cookie AI",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Cookie Policy - Fortune Cookie AI",
    description:
      "Learn how Fortune Cookie AI uses cookies and local storage technologies.",
    images: [getImageUrl("/twitter-image.png")],
    creator: "@fortunecookieai",
  },
  alternates: {
    canonical: "/cookies",
    languages: generateAlternateLanguages("/cookies", baseUrl),
  },
  robots: "index, follow",
};

export default function CookiesPage() {
  return <CookiesPageContent />;
}
