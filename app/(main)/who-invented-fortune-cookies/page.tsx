import { Metadata } from "next";
import {
  BreadcrumbStructuredData,
  ArticleStructuredData,
} from "@/components/StructuredData";
import {
  FAQStructuredData,
  whoInventedFAQs,
} from "@/components/FAQStructuredData";
import { getImageUrl, getSiteUrl } from "@/lib/site";
import { generateAlternateLanguages } from "@/lib/i18n-config";
import { WhoInventedPageContent } from "./WhoInventedPageContent";

const baseUrl = getSiteUrl();

// Static generation configuration
export const dynamic = "force-static";
export const revalidate = 86400; // 24 hours

export const metadata: Metadata = {
  title: "Who Invented Fortune Cookies? History & Origins Guide",
  description:
    "Discover who invented fortune cookies! Explore the debate between Makoto Hagiwara and David Jung. Uncover the Japanese origins and American history.",
  openGraph: {
    title: "Who Invented Fortune Cookies? History & Origins Guide",
    description:
      "Discover who invented fortune cookies! Explore the debate between Makoto Hagiwara and David Jung. Uncover the Japanese origins and American history.",
    type: "article",
    url: `${baseUrl}/who-invented-fortune-cookies`,
    images: [
      {
        url: getImageUrl("/og-image.png"),
        width: 1200,
        height: 630,
        alt: "Who Invented Fortune Cookies",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Who Invented Fortune Cookies? History & Origins Guide",
    description:
      "Discover who invented fortune cookies! Explore the debate between Makoto Hagiwara and David Jung.",
    images: [getImageUrl("/twitter-image.png")],
    creator: "@fortunecookieai",
  },
  alternates: {
    canonical: "/who-invented-fortune-cookies",
    languages: generateAlternateLanguages(
      "/who-invented-fortune-cookies",
      baseUrl,
    ),
  },
};

export default function WhoInventedFortuneCookiesPage() {
  return (
    <>
      <ArticleStructuredData
        headline="Who Invented Fortune Cookies? The Surprising History & Origins"
        description="Discover who really invented fortune cookies and explore the debate between Makoto Hagiwara, David Jung, and other key figures. Learn about Japanese origins and American history."
        url="/who-invented-fortune-cookies"
        datePublished="2024-01-15"
        dateModified={new Date().toISOString().split("T")[0]}
      />
      <BreadcrumbStructuredData
        items={[
          { name: "Home", url: "/" },
          { name: "History", url: "/who-invented-fortune-cookies" },
        ]}
      />
      <FAQStructuredData faqs={whoInventedFAQs} />
      <WhoInventedPageContent />
    </>
  );
}
