import { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { StructuredData } from "@/components/StructuredData";
import { getSiteUrl } from "@/lib/site";
import { OracleClient } from "./OracleClient";

const baseUrl = getSiteUrl();

export const metadata: Metadata = {
  title: "Quick Fortune Cookie Generator",
  // The phrases dropped from the shorter title ("The True Oracle",
  // "AI fortune cookie predictions") are retained here, in the keywords array,
  // in the visible header, and in the JSON-LD alternateName — the URL is
  // unchanged, so no indexed signal is orphaned.
  description:
    "Quick Fortune — The True Oracle. Get AI fortune cookie predictions in one tap, or tune the time horizon, intensity, and fortune type: good, neutral, bad, or ominous.",
  keywords: [
    "fortune cookie prediction",
    "fortune teller cookie",
    "AI fortune prediction",
    "oracle fortune cookie",
    "bad luck fortune cookie",
    "quick fortune cookie generator",
  ],
  alternates: { canonical: `${baseUrl}/generator/oracle` },
  openGraph: {
    title: "Quick Fortune Cookie Generator — The True Oracle",
    description:
      "AI fortune cookie predictions in one tap, or tuned to your chosen time horizon and intensity.",
    type: "website",
    url: `${baseUrl}/generator/oracle`,
  },
};

export default function OraclePage() {
  return (
    <main className="container mx-auto max-w-5xl px-4 pb-20 pt-24 md:pt-28">
      {/* Keeps the original brand name bound to this URL for anything already
          indexed as "The True Oracle". */}
      <StructuredData
        id="ld-mode-oracle"
        data={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: "Quick Fortune Cookie Generator",
          alternateName: ["The True Oracle", "Oracle Fortune Cookie Generator"],
          url: `${baseUrl}/generator/oracle`,
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
          The True Oracle
        </p>
        <h1 className="mt-1 text-3xl font-bold text-slate-900 dark:text-slate-50 md:text-4xl">
          Quick Fortune Cookie Generator
        </h1>
        <p className="mt-2 max-w-2xl text-slate-600 dark:text-slate-300">
          One tap, one prophecy — no settings needed. Or tune the timeframe and
          intensity, pick the flavor of fate, and let the oracle speak.
        </p>
      </header>

      <OracleClient />
    </main>
  );
}
