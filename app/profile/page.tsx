import { Metadata } from "next";
import { getImageUrl, getSiteUrl } from "@/lib/site";
import { ProfilePageContent } from "./ProfilePageContent";

const baseUrl = getSiteUrl();

export const metadata: Metadata = {
  title: "Profile - Fortune Cookie AI",
  description:
    "Manage your fortune cookie history, preferences, and usage stats.",
  openGraph: {
    title: "Profile - Fortune Cookie AI",
    description:
      "Manage your fortune cookie history, preferences, and usage stats.",
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
      "Manage your fortune cookie history, preferences, and usage stats.",
    images: [getImageUrl("/twitter-image.png")],
    creator: "@fortunecookieai",
  },
  alternates: {
    canonical: "/profile",
  },
};

export default function ProfilePage() {
  return <ProfilePageContent />;
}
