import { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { StructuredData } from "@/components/StructuredData";
import { getSiteUrl } from "@/lib/site";
import { EventClient } from "./EventClient";

const baseUrl = getSiteUrl();

export const metadata: Metadata = {
  title: "Party & Event Fortune Cookie Generator",
  // "The Event Master" and the wedding/party phrasing dropped from the title
  // survive in this description, the keywords array, the visible header, and
  // the JSON-LD alternateName. URL unchanged, so no redirect is needed.
  description:
    "Party & Event Fortunes — The Event Master. Generate custom fortune cookie messages in bulk for weddings, birthdays, baby showers, and team nights. Add personal details, pick a tone, and create up to 100 unique fortunes.",
  keywords: [
    "custom fortune cookies for wedding",
    "fortune cookie messages for party",
    "bulk fortune cookie messages",
    "personalized fortune cookies",
    "wedding favor fortune cookies",
    "party fortune cookie generator",
  ],
  alternates: { canonical: `${baseUrl}/generator/event` },
  openGraph: {
    title:
      "Party & Event Fortune Cookie Generator — Weddings, Birthdays & Team Nights",
    description:
      "Generate custom fortune cookie messages in bulk for any event — personalized, on-tone, and unique.",
    type: "website",
    url: `${baseUrl}/generator/event`,
  },
};

export default function EventPage() {
  return (
    <main className="container mx-auto max-w-5xl px-4 pb-20 pt-24 md:pt-28">
      <StructuredData
        id="ld-mode-event"
        data={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: "Party & Event Fortune Cookie Generator",
          alternateName: [
            "The Event Master",
            "Custom Fortune Cookies for Weddings & Parties",
          ],
          url: `${baseUrl}/generator/event`,
        }}
      />
      <Link
        href="/generator"
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-slate-500 transition-colors hover:text-amber-600"
      >
        <ArrowLeft className="h-4 w-4" />
        All modes
      </Link>

      <header className="mb-8">
        <p className="text-sm font-medium uppercase tracking-wide text-amber-700 dark:text-amber-300">
          The Event Master
        </p>
        <h1 className="mt-1 text-3xl font-bold text-slate-900 dark:text-slate-50 md:text-4xl">
          Party &amp; Event Fortune Cookie Generator
        </h1>
        <p className="mt-2 max-w-2xl text-slate-600 dark:text-slate-300">
          Custom fortune cookie messages for weddings, birthdays, and team
          nights. Add the details, choose a tone, and generate a batch ready to
          tuck into real cookies.
        </p>
      </header>

      <EventClient />
    </main>
  );
}
