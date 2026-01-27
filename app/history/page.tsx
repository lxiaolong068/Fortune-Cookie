import { Metadata } from "next";
import {
  ArticleStructuredData,
  BreadcrumbStructuredData,
} from "@/components/StructuredData";
import { FAQStructuredData, historyFAQs } from "@/components/FAQStructuredData";
import { getImageUrl, getSiteUrl } from "@/lib/site";
import { generateAlternateLanguages } from "@/lib/i18n-config";
import { HistoryPageContent } from "./HistoryPageContent";

const baseUrl = getSiteUrl();

// Static generation configuration
export const dynamic = "force-static";
export const revalidate = 86400; // 24 hours

export const metadata: Metadata = {
  title: "History of Fortune Cookies - Origins and Cultural Evolution",
  description:
    "Explore the fascinating history of fortune cookies from Japanese roots in Kyoto to American invention in California. Discover the true story of Makoto Hagiwara and the evolution of this beloved treat.",
  openGraph: {
    title: "History of Fortune Cookies - Origins and Cultural Evolution",
    description:
      "Discover the fascinating history of fortune cookies, from their Japanese roots to American invention. Learn about Makoto Hagiwara and the cultural journey of this iconic cookie.",
    type: "article",
    url: `${baseUrl}/history`,
    images: [
      {
        url: getImageUrl("/og-image.png"),
        width: 1200,
        height: 630,
        alt: "History of Fortune Cookies",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "History of Fortune Cookies - Origins and Cultural Evolution",
    description:
      "Explore the fascinating history of fortune cookies from Japanese roots in Kyoto to American invention in California.",
    images: [getImageUrl("/twitter-image.png")],
    creator: "@fortunecookieai",
  },
  alternates: {
    canonical: "/history",
    languages: generateAlternateLanguages("/history", baseUrl),
  },
};

export default function HistoryPage() {
  return (
    <>
      <ArticleStructuredData
        headline="History of Fortune Cookies - Origins and Cultural Evolution"
        description="Discover the fascinating history of fortune cookies, from their Japanese roots to American invention. Learn about the cultural evolution and origins of this beloved treat."
        url="/history"
        datePublished="2024-01-01"
        dateModified={new Date().toISOString().split("T")[0]}
        keywords={[
          "history of fortune cookies",
          "fortune cookie origins",
          "who invented fortune cookies",
          "fortune cookies japanese roots",
          "fortune cookies in america",
          "cultural history",
          "asian american food history",
          "fortune cookie facts",
        ]}
      />
      <BreadcrumbStructuredData
        items={[
          { name: "Home", url: "/" },
          { name: "History of Fortune Cookies", url: "/history" },
        ]}
      />
      <FAQStructuredData faqs={historyFAQs} />
      <HistoryPageContent />
    </>
  );
}
