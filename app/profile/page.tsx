import { Metadata } from "next";
import { getImageUrl, getSiteUrl } from "@/lib/site";
import { ProfilePageContent } from "./ProfilePageContent";

const baseUrl = getSiteUrl();

export const metadata: Metadata = {
  title: "Profile - Fortune Cookie AI",
  description:
    "Manage your Fortune Cookie AI profile: view fortune history, check daily quota, update preferences, and access saved favorites. Sign in to sync across devices.",
  openGraph: {
    title: "Profile - Fortune Cookie AI",
    description:
      "Manage your Fortune Cookie AI profile: view fortune history, check daily quota, update preferences, and access saved favorites. Sign in to sync across devices.",
    type: "website",
    url: `${baseUrl}/profile`,
    images: [
      {
        url: getImageUrl("/og-image.png"),
        width: 1200,
        height: 630,
        alt: "Profile - Fortune Cookie AI",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Profile - Fortune Cookie AI",
    description:
      "Manage your Fortune Cookie AI profile: view fortune history, check daily quota, update preferences, and access saved favorites. Sign in to sync across devices.",
    images: [getImageUrl("/twitter-image.png")],
    creator: "@fortunecookieai",
  },
  alternates: {
    canonical: "/profile",
  },
  // Profile page requires authentication — exclude from Google index to avoid
  // soft-404 / low-quality page signals from unauthenticated crawls.
  robots: {
    index: false,
    follow: false,
  },
};

export default function ProfilePage() {
  return <ProfilePageContent />;
}
