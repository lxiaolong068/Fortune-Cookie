import { Metadata } from "next";
import { getImageUrl, getSiteUrl } from "@/lib/site";

const baseUrl = getSiteUrl();

export const metadata: Metadata = {
  title: "Browse Fortune Messages - Search & Filter",
  description:
    "Browse and search through fortune cookie messages. Filter by category, sort by popularity, and find the perfect fortune for any occasion.",
  openGraph: {
    title: "Browse Fortune Messages - Search & Filter",
    description:
      "Browse and search through fortune cookie messages. Filter by category, sort by popularity, and find the perfect fortune for any occasion.",
    type: "website",
    url: `${baseUrl}/browse`,
    images: [
      {
        url: getImageUrl("/og-image.png"),
        width: 1200,
        height: 630,
        alt: "Browse Fortune Messages",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Browse Fortune Messages - Search & Filter",
    description:
      "Browse and search through fortune cookie messages. Filter by category, sort by popularity, and find the perfect fortune for any occasion.",
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
