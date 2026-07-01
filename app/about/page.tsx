import { Metadata } from "next";
import { getImageUrl, getSiteUrl } from "@/lib/site";
import { BreadcrumbStructuredData } from "@/components/StructuredData";
import { AboutPageContent } from "./AboutPageContent";

const baseUrl = getSiteUrl();

// Static generation configuration
export const dynamic = "force-static";
export const revalidate = 86400; // 24 hours

export const metadata: Metadata = {
  title: "About Fortune Cookie AI - Our Mission & Team",
  description:
    "Learn about Fortune Cookie AI, our mission to deliver free AI-powered fortune cookie messages, and the team behind this project. Trusted by users worldwide.",
  openGraph: {
    title: "About Fortune Cookie AI - Our Mission & Team",
    description:
      "Learn about Fortune Cookie AI, our mission to deliver free AI-powered fortune cookie messages, and the team behind this project.",
    type: "article",
    url: `${baseUrl}/about`,
    images: [
      {
        url: getImageUrl("/og-image.png"),
        width: 1200,
        height: 630,
        alt: "About Fortune Cookie AI",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "About Fortune Cookie AI - Our Mission & Team",
    description:
      "Learn about Fortune Cookie AI, our mission and the technology behind the fortune cookie generator.",
    images: [getImageUrl("/twitter-image.png")],
    creator: "@fortunecookieai",
  },
  alternates: {
    canonical: "/about",
  },
  robots: "index, follow",
};

export default function AboutPage() {
  return (
    <>
      <BreadcrumbStructuredData
        items={[
          { name: "Home", url: "/" },
          { name: "About", url: "/about" },
        ]}
      />
      <AboutPageContent />
    </>
  );
}
