import { Metadata } from "next";
import { Heart } from "lucide-react";
import { DynamicBackgroundEffects } from "@/components/DynamicBackgroundEffects";
import { FavoritesList } from "@/components/FavoritesList";
import { generateSEOMetadata } from "@/components/SEO";
import { BreadcrumbStructuredData } from "@/components/StructuredData";

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
      <main className="min-h-screen w-full overflow-x-hidden relative">
        <DynamicBackgroundEffects />

        <div className="relative z-10">
          <div className="container mx-auto px-4 py-8">
            {/* Header */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center justify-center gap-3 mb-4">
                <Heart className="h-8 w-8 text-amber-500" />
                <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-amber-600 via-yellow-600 to-orange-600 bg-clip-text text-transparent">
                  My Favorites
                </h1>
              </div>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Your collection of saved fortune cookies. Revisit your favorite
                messages, share them with friends, or find inspiration whenever
                you need it.
              </p>
            </div>

            {/* Favorites List */}
            <FavoritesList />
          </div>
        </div>
      </main>
    </>
  );
}
