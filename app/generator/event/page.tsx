import { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getSiteUrl } from "@/lib/site";
import { EventClient } from "./EventClient";

const baseUrl = getSiteUrl();

export const metadata: Metadata = {
  title: "The Event Master — Custom Fortune Cookies for Weddings & Parties",
  description:
    "Generate custom fortune cookie messages in bulk for weddings, baby showers, birthdays, team building and more. Add personal details, pick a tone, and create up to 100 unique fortunes.",
  keywords: [
    "custom fortune cookies for wedding",
    "fortune cookie messages for party",
    "bulk fortune cookie messages",
    "personalized fortune cookies",
    "wedding favor fortune cookies",
  ],
  alternates: { canonical: `${baseUrl}/generator/event` },
  openGraph: {
    title: "The Event Master — Custom Fortune Cookies for Weddings & Parties",
    description:
      "Generate custom fortune cookie messages in bulk for any event — personalized, on-tone, and unique.",
    type: "website",
    url: `${baseUrl}/generator/event`,
  },
};

export default function EventPage() {
  return (
    <main className="container mx-auto max-w-5xl px-4 pb-20 pt-24 md:pt-28">
      <Link
        href="/generator"
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-slate-500 transition-colors hover:text-amber-600"
      >
        <ArrowLeft className="h-4 w-4" />
        All modes
      </Link>

      <header className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-50 md:text-4xl">
          The Event Master
        </h1>
        <p className="mt-2 max-w-2xl text-slate-600 dark:text-slate-300">
          Custom fortunes for the big day. Add the details, choose a tone, and
          generate a batch ready to tuck into real cookies.
        </p>
      </header>

      <EventClient />
    </main>
  );
}
