import { Metadata } from "next";
import { getSiteUrl } from "@/lib/site";

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
