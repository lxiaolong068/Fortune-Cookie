import { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getSiteUrl } from "@/lib/site";
import { OracleClient } from "./OracleClient";

const baseUrl = getSiteUrl();

export const metadata: Metadata = {
  title: "The True Oracle — AI Fortune Cookie Predictions",
  description:
    "Summon precise, eerie, or absurd fortune cookie predictions. Choose your time horizon, intensity, and fortune type — good, neutral, bad, or ominous.",
  keywords: [
    "fortune cookie prediction",
    "fortune teller cookie",
    "AI fortune prediction",
    "oracle fortune cookie",
    "bad luck fortune cookie",
  ],
  alternates: { canonical: `${baseUrl}/generator/oracle` },
  openGraph: {
    title: "The True Oracle — AI Fortune Cookie Predictions",
    description:
      "Summon precise, eerie, or absurd fortune cookie predictions tuned to your chosen time horizon and intensity.",
    type: "website",
    url: `${baseUrl}/generator/oracle`,
  },
};

export default function OraclePage() {
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
          The True Oracle
        </h1>
        <p className="mt-2 max-w-2xl text-slate-600 dark:text-slate-300">
          Prophecies, not platitudes. Tune the timeframe and intensity, pick the
          flavor of fate, and let the oracle speak.
        </p>
      </header>

      <OracleClient />
    </main>
  );
}
