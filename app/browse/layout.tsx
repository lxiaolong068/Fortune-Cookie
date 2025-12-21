import { Metadata } from "next";
import { getImageUrl, getSiteUrl } from "@/lib/site";

const baseUrl = getSiteUrl();

export const metadata: Metadata = {
  title: "Browse 500+ Fortune Cookie Messages by Category",
  description:
    "Search and filter our collection of 500+ fortune cookie messages. Browse by category: inspirational, funny, love, success, wisdom, and more.",
  openGraph: {
    title: "Browse 500+ Fortune Cookie Messages by Category",
    description:
      "Search and filter our collection of 500+ fortune cookie messages. Browse by category: inspirational, funny, love, success, wisdom, and more.",
    type: "website",
    url: `${baseUrl}/browse`,
    images: [
      {
        url: getImageUrl("/og-image.png"),
        width: 1200,
        height: 630,
        alt: "Browse Fortune Cookie Messages",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Browse 500+ Fortune Cookie Messages by Category",
    description:
      "Search and filter our collection of 500+ fortune cookie messages. Browse by category: inspirational, funny, love, success, wisdom, and more.",
    images: [getImageUrl("/twitter-image.png")],
    creator: "@fortunecookieai",
  },
  alternates: {
    canonical: "/browse",
  },
};

export default function BrowseLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
