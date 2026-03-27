import { Metadata } from "next";
import { generateSEOMetadata } from "@/components/SEO";
import { BreadcrumbStructuredData } from "@/components/StructuredData";
import { FavoritesPageContent } from "./FavoritesPageContent";

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
      <FavoritesPageContent />
    </>
  );
}
