import { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getSiteUrl } from "@/lib/site";
import { PersonaClient } from "./PersonaClient";

const baseUrl = getSiteUrl();

export const metadata: Metadata = {
  title: "The Alter Ego — Funny Persona Fortune Cookie Generator",
  description:
    "Fortune cookies with attitude. Generate messages as a passive aggressive, existentialist, or unhinged optimist persona — and more. Pick a topic or leave it to fate.",
  keywords: [
    "funny fortune cookie generator",
    "passive aggressive fortune cookie",
    "persona fortune cookie",
    "sarcastic fortune cookie generator",
    "AI persona fortunes",
  ],
  alternates: { canonical: `${baseUrl}/generator/persona` },
  openGraph: {
    title: "The Alter Ego — Funny Persona Fortune Cookie Generator",
    description:
      "Fortune cookies with attitude — passive aggressive, existentialist, unhinged optimist, and more personas.",
    type: "website",
    url: `${baseUrl}/generator/persona`,
  },
};

export default function PersonaPage() {
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
          The Alter Ego
        </h1>
        <p className="mt-2 max-w-2xl text-slate-600 dark:text-slate-300">
          A fortune cookie is just a tiny stage. Choose who steps onto it — then
          read it in their voice.
        </p>
      </header>

      <PersonaClient />
    </main>
  );
}
