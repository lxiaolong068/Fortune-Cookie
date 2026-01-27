import { Metadata } from "next";
import {
  BreadcrumbStructuredData,
  WebApplicationStructuredData,
} from "@/components/StructuredData";
import { getImageUrl, getSiteUrl } from "@/lib/site";
import { generateAlternateLanguages } from "@/lib/i18n-config";
import { CalendarPageContent } from "./CalendarPageContent";

const baseUrl = getSiteUrl();

export const metadata: Metadata = {
  title:
    "Fortune Calendar - Daily Fortune Cookie Predictions | Fortune Cookie AI",
  description:
    "Explore your daily fortune predictions with our interactive Fortune Calendar. View past, present, and future fortunes with lucky numbers, colors, and personalized advice.",
  keywords: [
    "fortune calendar",
    "daily fortune",
    "fortune prediction",
    "lucky numbers calendar",
    "horoscope calendar",
    "fortune cookie predictions",
    "daily luck",
    "fortune planner",
  ],
  openGraph: {
    title: "Fortune Calendar - Daily Fortune Predictions",
    description:
      "Explore your daily fortune predictions with our interactive Fortune Calendar. View fortunes for any day!",
    type: "website",
    url: `${baseUrl}/calendar`,
    siteName: "Fortune Cookie AI",
    images: [
      {
        url: getImageUrl("/og-image.png"),
        width: 1200,
        height: 630,
        alt: "Fortune Calendar - Daily Fortune Cookie Predictions",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Fortune Calendar - Daily Fortune Predictions",
    description:
      "Explore your daily fortune predictions with our interactive Fortune Calendar.",
    images: [getImageUrl("/twitter-image.png")],
    creator: "@fortunecookieai",
  },
  alternates: {
    canonical: "/calendar",
    languages: generateAlternateLanguages("/calendar", baseUrl),
  },
};

export default function CalendarPage() {
  return (
    <>
      <BreadcrumbStructuredData
        items={[
          { name: "Home", url: "/" },
          { name: "Fortune Calendar", url: "/calendar" },
        ]}
      />
      <WebApplicationStructuredData />
      <CalendarPageContent />
    </>
  );
}
