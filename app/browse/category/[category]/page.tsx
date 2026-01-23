import { permanentRedirect } from "next/navigation";
import { Metadata } from "next";
import { getDatabaseStats } from "@/lib/fortune-database";

interface Props {
  params: Promise<{ category: string }>;
}

export async function generateStaticParams() {
  const stats = getDatabaseStats();
  return Object.keys(stats.categories).map((category) => ({
    category,
  }));
}

// Return minimal metadata for redirect page
export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Redirecting to Explore...",
    robots: { index: false, follow: true },
  };
}

/**
 * Legacy /browse/category/[category] page - 301 redirect to /explore?category=
 *
 * This redirect preserves SEO value while consolidating
 * content browsing into a single unified experience.
 */
export default async function CategoryRedirectPage({ params }: Props) {
  const { category } = await params;

  // Redirect to explore with category filter
  permanentRedirect(`/explore?category=${encodeURIComponent(category)}`);
}
