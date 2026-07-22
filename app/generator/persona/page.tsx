import { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { StructuredData } from "@/components/StructuredData";
import { getSiteUrl } from "@/lib/site";
import { PersonaClient } from "./PersonaClient";

const baseUrl = getSiteUrl();

export const metadata: Metadata = {
  title: "Character Voice Fortune Cookie Generator",
  // "The Alter Ego" and "funny persona" are dropped from the title but kept in
  // this description, the keywords array, the visible header, and the JSON-LD
  // alternateName. URL unchanged.
  description:
    "Character Voice — The Alter Ego. A funny persona fortune cookie generator: get your fortune from a noir detective, a villain, a passive aggressive coworker, or your grandma.",
  keywords: [
    "funny fortune cookie generator",
    "passive aggressive fortune cookie",
    "persona fortune cookie",
    "sarcastic fortune cookie generator",
    "AI persona fortunes",
    "character voice fortune cookie",
  ],
  alternates: { canonical: `${baseUrl}/generator/persona` },
  openGraph: {
    title: "Character Voice Fortune Cookie Generator — The Alter Ego",
    description:
      "Fortune cookies with attitude — noir detective, villain, passive aggressive, existentialist, and more personas.",
    type: "website",
    url: `${baseUrl}/generator/persona`,
  },
};

export default function PersonaPage() {
  return (
    <main className="container mx-auto max-w-5xl px-4 pb-20 pt-24 md:pt-28">
      <StructuredData
        id="ld-mode-persona"
        data={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: "Character Voice Fortune Cookie Generator",
          alternateName: [
            "The Alter Ego",
            "Funny Persona Fortune Cookie Generator",
          ],
          url: `${baseUrl}/generator/persona`,
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
          The Alter Ego
        </p>
        <h1 className="mt-1 text-3xl font-bold text-slate-900 dark:text-slate-50 md:text-4xl">
          Character Voice Fortune Cookie Generator
        </h1>
        <p className="mt-2 max-w-2xl text-slate-600 dark:text-slate-300">
          Get your fortune from a noir detective, a villain, or your grandma. A
          fortune cookie is just a tiny stage — choose who steps onto it, then
          read it in their voice.
        </p>
      </header>

      <PersonaClient />
    </main>
  );
}
