import { Metadata } from "next";
import { getImageUrl, getSiteUrl } from "@/lib/site";
import { BreadcrumbStructuredData } from "@/components/StructuredData";
import { CookiesPageContent } from "./CookiesPageContent";

const baseUrl = getSiteUrl();

// Static generation configuration
export const dynamic = "force-static";
export const revalidate = 86400; // 24 hours

export const metadata: Metadata = {
  title: "Cookie Policy - Fortune Cookie AI",
  description:
    "Fortune Cookie AI Cookie Policy. Learn how we use cookies and similar technologies to improve your browsing experience.",
  openGraph: {
    title: "Cookie Policy - Fortune Cookie AI",
    description:
      "Learn how Fortune Cookie AI uses cookies and local storage technologies.",
    type: "article",
    url: `${baseUrl}/cookies`,
    images: [
      {
        url: getImageUrl("/og-image.png"),
        width: 1200,
        height: 630,
        alt: "Cookie Policy - Fortune Cookie AI",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Cookie Policy - Fortune Cookie AI",
    description:
      "Learn how Fortune Cookie AI uses cookies and local storage technologies.",
    images: [getImageUrl("/twitter-image.png")],
    creator: "@fortunecookieai",
  },
  alternates: {
    canonical: "/cookies",
  },
  robots: "index, follow",
};

export default function CookiesPage() {
  return (
    <>
      <BreadcrumbStructuredData
        items={[
          { name: "Home", url: "/" },
          { name: "Cookie Policy", url: "/cookies" },
        ]}
      />
      <CookiesPageContent />
    </>
  );
}
