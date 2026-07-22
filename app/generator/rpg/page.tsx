import { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { StructuredData } from "@/components/StructuredData";
import { getSiteUrl } from "@/lib/site";
import { RpgClient } from "./RpgClient";

const baseUrl = getSiteUrl();

export const metadata: Metadata = {
  title: "Tabletop RPG Fortune Generator — Omens & Quest Hooks",
  // "The Tabletop RPG" and "DnD fortune cookie" are dropped from the title but
  // kept in this description, the keywords array, the visible body copy, and
  // the JSON-LD alternateName. URL unchanged.
  description:
    "Tabletop RPG Fortunes — omens, riddles, and quest hooks for your next session. A DnD fortune cookie generator for the character or the player, across fantasy, sci-fi, horror, and more.",
  keywords: [
    "DnD fortune cookie",
    "tabletop RPG fortune generator",
    "quest hook generator",
    "RPG prophecy generator",
    "campaign prompt generator",
  ],
  alternates: { canonical: `${baseUrl}/generator/rpg` },
  openGraph: {
    title: "Tabletop RPG Fortune Generator — Omens & Quest Hooks",
    description:
      "Prophecies, quest hooks, and cryptic riddles for your campaign — for the character or the player.",
    type: "website",
    url: `${baseUrl}/generator/rpg`,
  },
};

export default function RpgPage() {
  return (
    <main className="container mx-auto max-w-5xl px-4 pb-20 pt-24 md:pt-28">
      <StructuredData
        id="ld-mode-rpg"
        data={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: "Tabletop RPG Fortune Generator",
          alternateName: [
            "The Tabletop RPG",
            "DnD Fortune Cookie & Quest Hook Generator",
          ],
          url: `${baseUrl}/generator/rpg`,
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
          Prophecies &amp; Quest Hooks
        </p>
        <h1 className="mt-1 text-3xl font-bold text-slate-900 dark:text-slate-50 md:text-4xl">
          Tabletop RPG Fortune Generator
        </h1>
        <p className="mt-2 max-w-2xl text-slate-600 dark:text-slate-300">
          The Tabletop RPG mode drops a prophecy on the table: omens, riddles,
          and quest hooks for your next session — for the character or the
          player.
        </p>
      </header>

      <RpgClient />
    </main>
  );
}
