import { permanentRedirect, redirect } from "next/navigation";
import { Metadata } from "next";

// Define valid categories
const VALID_CATEGORIES = [
  "inspirational",
  "funny",
  "love",
  "success",
  "wisdom",
  "friendship",
  "birthday",
  "study",
] as const;

type CategoryType = (typeof VALID_CATEGORIES)[number];

interface PageProps {
  params: Promise<{ category: string }>;
}

function isValidCategory(category: string): category is CategoryType {
  return VALID_CATEGORIES.includes(category as CategoryType);
}

export async function generateStaticParams() {
  return VALID_CATEGORIES.map((category) => ({
    category,
  }));
}

// Return minimal metadata for redirect page
export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { category } = await params;

  // Special case: funny redirects to dedicated landing page
  if (category === "funny") {
    return {
      title: "Redirecting...",
      robots: { index: false, follow: true },
    };
  }

  return {
    title: "Redirecting to Explore...",
    robots: { index: false, follow: true },
  };
}

/**
 * Legacy /messages/[category] page - 301 redirect to /explore?category=
 *
 * Special cases:
 * - /messages/funny → /funny-fortune-cookie-messages (dedicated landing page)
 * - All other categories → /explore?category=[category]
 *
 * This redirect preserves SEO value while consolidating
 * content browsing into a single unified experience.
 */
export default async function CategoryRedirectPage({ params }: PageProps) {
  const { category } = await params;

  // Special case: redirect funny to dedicated SEO landing page
  if (category === "funny") {
    redirect("/funny-fortune-cookie-messages");
  }

  // Validate category and redirect to explore with category filter
  if (isValidCategory(category)) {
    permanentRedirect(`/explore?category=${encodeURIComponent(category)}`);
  }

  // Invalid category - redirect to explore main page
  permanentRedirect("/explore");
}
