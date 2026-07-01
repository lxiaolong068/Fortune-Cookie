import { Metadata } from "next";
import { generateSEOMetadata } from "@/components/SEO";
import { BreadcrumbStructuredData } from "@/components/StructuredData";
import { FAQStructuredData, favoritesFAQs } from "@/components/FAQStructuredData";
import { FavoritesPageContent } from "./FavoritesPageContent";

// ISR: force-static + revalidate every 24 hours
// Favorites page shell is static; user-specific data loads client-side.
export const dynamic = "force-static";
export const revalidate = 86400; // 24 hours

export const metadata: Metadata = generateSEOMetadata({
  title: "Saved Fortune Cookies — My Favorites Collection",
  description:
    "View and manage your saved fortune cookie messages. Revisit your favorite AI-generated fortunes, inspirational quotes, and lucky numbers anytime. Sign in to sync across devices.",
  url: "/favorites",
  type: "website",
});

export default function FavoritesPage() {
  return (
    <>
      <BreadcrumbStructuredData
        items={[
          { name: "Home", url: "/" },
          { name: "Favorites", url: "/favorites" },
        ]}
      />
      <FAQStructuredData faqs={favoritesFAQs} />
      <FavoritesPageContent />
    </>
  );
}
