import { Metadata } from "next";
import { generateSEOMetadata } from "@/components/SEO";
import {
  FAQStructuredData,
  fortuneCookieFAQs,
  funnyFortuneFAQs,
  recipeFAQs,
  howToMakeFAQs,
  whoInventedFAQs,
  historyFAQs,
  type FAQItem,
} from "@/components/FAQStructuredData";
import { BreadcrumbStructuredData } from "@/components/StructuredData";
import { FAQPageContent } from "./FAQPageContent";

// ISR: force-static + revalidate every 7 days
// FAQ content is hardcoded in source; no external data dependencies.
export const dynamic = "force-static";
export const revalidate = 604800; // 7 days

export const metadata: Metadata = generateSEOMetadata({
  title: "FAQ - Frequently Asked Questions",
  description:
    "Find answers to common questions about fortune cookies, how to make them, their history, funny messages, and more. Get all your fortune cookie questions answered.",
  url: "/faq",
  type: "website",
});

// Combine all FAQs for structured data
const allFAQs: FAQItem[] = [
  ...fortuneCookieFAQs,
  ...funnyFortuneFAQs,
  ...recipeFAQs,
  ...howToMakeFAQs,
  ...whoInventedFAQs,
  ...historyFAQs,
];

// For structured data (uses url)
const structuredBreadcrumbs = [
  { name: "Home", url: "/" },
  { name: "FAQ", url: "/faq" },
];

export default function FAQPage() {
  return (
    <>
      <FAQStructuredData faqs={allFAQs} />
      <BreadcrumbStructuredData items={structuredBreadcrumbs} />
      <FAQPageContent />
    </>
  );
}
