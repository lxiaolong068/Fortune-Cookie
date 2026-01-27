import { Metadata } from "next";
import {
  BreadcrumbStructuredData,
  ArticleStructuredData,
} from "@/components/StructuredData";
import {
  FAQStructuredData,
  funnyFortuneFAQs,
} from "@/components/FAQStructuredData";
import { getImageUrl, getSiteUrl } from "@/lib/site";
import { generateAlternateLanguages } from "@/lib/i18n-config";
import { FunnyFortunePageContent } from "./FunnyFortunePageContent";

const baseUrl = getSiteUrl();

// Static generation configuration
export const dynamic = "force-static";
export const revalidate = 86400; // 24 hours

export const metadata: Metadata = {
  title: "Funny Fortune Cookie Messages - Hilarious Sayings & Jokes",
  description:
    "Discover the funniest fortune cookie messages and hilarious sayings! Perfect for parties and pranks. Browse our collection of witty, humorous fortunes.",
  openGraph: {
    title: "Funny Fortune Cookie Messages - Hilarious Sayings & Jokes",
    description:
      "Discover the funniest fortune cookie messages and hilarious sayings! Perfect for parties and pranks. Browse our collection of witty, humorous fortunes.",
    type: "article",
    url: `${baseUrl}/funny-fortune-cookie-messages`,
    images: [
      {
        url: getImageUrl("/og-image.png"),
        width: 1200,
        height: 630,
        alt: "Funny Fortune Cookie Messages",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Funny Fortune Cookie Messages - Hilarious Sayings & Jokes",
    description:
      "Discover the funniest fortune cookie messages and hilarious sayings! Perfect for parties and pranks.",
    images: [getImageUrl("/twitter-image.png")],
    creator: "@fortunecookieai",
  },
  alternates: {
    canonical: "/funny-fortune-cookie-messages",
    languages: generateAlternateLanguages(
      "/funny-fortune-cookie-messages",
      baseUrl,
    ),
  },
};

export default function FunnyFortuneCookieMessagesPage() {
  return (
    <>
      <ArticleStructuredData
        headline="Funny Fortune Cookie Messages - Hilarious Sayings & Jokes"
        description="Discover the funniest fortune cookie messages and hilarious sayings! Perfect for parties and pranks. Browse our collection of witty, humorous fortunes."
        url="/funny-fortune-cookie-messages"
        datePublished="2024-01-15"
        dateModified={new Date().toISOString().split("T")[0]}
      />
      <BreadcrumbStructuredData
        items={[
          { name: "Home", url: "/" },
          { name: "Funny Messages", url: "/funny-fortune-cookie-messages" },
        ]}
      />
      <FAQStructuredData faqs={funnyFortuneFAQs} />
      <FunnyFortunePageContent />
    </>
  );
}
