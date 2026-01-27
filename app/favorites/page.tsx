import { Metadata } from "next";
import { generateSEOMetadata } from "@/components/SEO";
import { BreadcrumbStructuredData } from "@/components/StructuredData";
import { FavoritesPageContent } from "./FavoritesPageContent";

export const metadata: Metadata = generateSEOMetadata({
  title: "My Favorites - Saved Fortune Cookies",
  description:
    "View and manage your saved fortune cookies. Access your favorite inspirational messages, lucky numbers, and wisdom anytime.",
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
