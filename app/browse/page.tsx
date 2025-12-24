import { Suspense } from "react";
import { Metadata } from "next";
import { BrowsePageContent } from "./BrowsePageContent";

export const metadata: Metadata = {
  title: "Browse Fortune Messages - Search & Filter",
  description:
    "Browse and search through 180+ fortune cookie messages. Filter by category, sort by popularity, and find the perfect fortune for any occasion.",
  openGraph: {
    title: "Browse Fortune Messages - Search & Filter",
    description:
      "Browse and search through 180+ fortune cookie messages. Filter by category, sort by popularity.",
    type: "website",
    url: "/browse",
  },
  twitter: {
    card: "summary_large_image",
    title: "Browse Fortune Messages - Search & Filter",
    description:
      "Browse and search through 180+ fortune cookie messages. Filter by category, sort by popularity.",
  },
  alternates: {
    canonical: "/browse",
  },
};

// Loading fallback for Suspense
function BrowseLoadingFallback() {
  return (
    <main className="min-h-screen w-full overflow-x-hidden relative">
      <div className="relative z-10">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-12">
            <div className="h-12 w-96 mx-auto bg-gray-200 rounded animate-pulse mb-4" />
            <div className="h-6 w-64 mx-auto bg-gray-200 rounded animate-pulse mb-6" />
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="p-6 bg-white/90 rounded-xl border border-amber-200"
              >
                <div className="h-6 w-24 bg-gray-200 rounded animate-pulse mb-4" />
                <div className="h-20 bg-gray-200 rounded animate-pulse mb-4" />
                <div className="h-8 w-32 bg-gray-200 rounded animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}

export default function BrowsePage() {
  return (
    <Suspense fallback={<BrowseLoadingFallback />}>
      <BrowsePageContent />
    </Suspense>
  );
}
