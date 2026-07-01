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

// CTR optimization (GSC: 325 imp, pos 8.1, CTR 0.3% — far below the ~4%
// baseline expected at this position). The old title started with "History
// of…" which buries the actual high-intent "who invented fortune cookies"
// query the page ranks for, and the 231-char description was getting cut
// off long before the most clickable detail. Lead with the question form
// and keep every description variant under 160 chars.
const historyTitle =
  "Who Invented Fortune Cookies? The Surprising True History";

export const metadata: Metadata = {
  title: historyTitle,
  description:
    "Who really invented fortune cookies? Japanese roots in Kyoto, San Francisco origins, Makoto Hagiwara, and the 1980s court case that decided it.",
  openGraph: {
    title: historyTitle,
    description:
      "Who really invented fortune cookies? Japanese roots, San Francisco origins, Makoto Hagiwara, and the 1980s court case that decided it.",
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
    title: historyTitle,
    description:
      "Who really invented fortune cookies? Japanese roots, San Francisco origins, and the cultural journey of this iconic treat.",
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
        headline={historyTitle}
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
