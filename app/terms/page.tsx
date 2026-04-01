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
    "Read Fortune Cookie AI's Terms of Service — learn about usage rights, content policies, liability limitations, and account rules. Contact us with any questions.",
  openGraph: {
    title: "Terms of Service - Fortune Cookie AI",
    description:
      "Read Fortune Cookie AI's Terms of Service — understand usage rights, content policies, limitations of liability, account rules, and how to contact us with questions.",
    type: "article",
    url: `${baseUrl}/terms`,
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
      "Read Fortune Cookie AI's Terms of Service — understand usage rights, content policies, limitations of liability, account rules, and how to contact us with questions.",
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
