import { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getSiteUrl } from "@/lib/site";
import { RpgClient } from "./RpgClient";

const baseUrl = getSiteUrl();

export const metadata: Metadata = {
  title: "The Tabletop RPG — DnD Fortune Cookie & Quest Hook Generator",
  description:
    "Generate prophecies, quest hooks, and cryptic riddles for your tabletop campaign. Choose for the character or the player, a style, and a setting — fantasy, sci-fi, horror, and more.",
  keywords: [
    "DnD fortune cookie",
    "tabletop RPG fortune generator",
    "quest hook generator",
    "RPG prophecy generator",
    "campaign prompt generator",
  ],
  alternates: { canonical: `${baseUrl}/generator/rpg` },
  openGraph: {
    title: "The Tabletop RPG — DnD Fortune Cookie & Quest Hook Generator",
    description:
      "Prophecies, quest hooks, and cryptic riddles for your campaign — for the character or the player.",
    type: "website",
    url: `${baseUrl}/generator/rpg`,
  },
};

export default function RpgPage() {
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
          The Tabletop RPG
        </h1>
        <p className="mt-2 max-w-2xl text-slate-600 dark:text-slate-300">
          Drop a prophecy on the table. Quest hooks, omens, and riddles for your
          next session — for the character or the player.
        </p>
      </header>

      <RpgClient />
    </main>
  );
}
