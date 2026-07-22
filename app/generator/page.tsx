import { Metadata } from "next";
import Link from "next/link";
import { Sparkles, PartyPopper, Dices, Drama, ArrowRight } from "lucide-react";
import { DynamicBackgroundEffects } from "@/components/DynamicBackgroundEffects";
import { BreadcrumbStructuredData } from "@/components/StructuredData";
import { FAQStructuredData } from "@/components/FAQStructuredData";
import { getImageUrl, getSiteUrl } from "@/lib/site";
import { AdUnit } from "@/components/AdUnit";

const baseUrl = getSiteUrl();

// ISR: the hub is static (cards + metadata). Interactive generation lives in
// each mode's own route (/generator/oracle, etc.).
export const dynamic = "force-static";
export const revalidate = 86400; // 24 hours

export const metadata: Metadata = {
  title: "Fortune Cookie Generator — 4 AI Modes, Free & Instant",
  description:
    "Pick a mode and craft fortune cookie messages with AI: Quick Fortune (The True Oracle), Tabletop RPG Fortunes, Party & Event Fortunes (The Event Master), and Character Voice (The Alter Ego). Free, no signup.",
  keywords: [
    "fortune cookie generator",
    "AI fortune cookie generator",
    "custom fortune cookie messages",
    "fortune cookie maker",
    "personalized fortune cookie",
  ],
  openGraph: {
    title: "Fortune Cookie Generator — 4 AI Modes, Free & Instant",
    description:
      "Pick a mode and craft fortune cookie messages with AI: predictions, custom party fortunes, tabletop RPG prophecies, and persona-driven fortunes.",
    type: "website",
    url: `${baseUrl}/generator`,
    images: [
      {
        url: getImageUrl("/og-image.png"),
        width: 1200,
        height: 630,
        alt: "AI Fortune Cookie Generator",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Fortune Cookie Generator — 4 AI Modes, Free & Instant",
    description:
      "Pick a mode and craft fortune cookie messages with AI: predictions, custom party fortunes, RPG prophecies, and persona fortunes.",
    images: [getImageUrl("/twitter-image.png")],
    creator: "@fortunecookieai",
  },
  alternates: {
    canonical: "/generator",
  },
};

/**
 * Mode cards. Function-first naming: `title` says what the mode does (what
 * people search for), `subtitle` keeps the original brand name visible so the
 * already-indexed semantics are not lost. URLs are deliberately unchanged — no
 * slug rename, no redirects.
 *
 * Array order is the DOM order, which is also the mobile order: Quick Fortune
 * first (and visually promoted via `featured`). On the 2-column desktop grid
 * this same order puts Tabletop RPG Fortunes in the second slot.
 */
const MODES = [
  {
    href: "/generator/oracle",
    icon: Sparkles,
    title: "Quick Fortune",
    subtitle: "The True Oracle",
    description: "One tap, one prophecy. No settings needed.",
    status: "live" as const,
    featured: true,
  },
  {
    href: "/generator/rpg",
    icon: Dices,
    title: "Tabletop RPG Fortunes",
    subtitle: "Prophecies & Quest Hooks",
    description: "Omens, riddles, and quest hooks for your next session.",
    status: "live" as const,
    featured: false,
  },
  {
    href: "/generator/event",
    icon: PartyPopper,
    title: "Party & Event Fortunes",
    subtitle: "The Event Master",
    description:
      "Custom fortune cookie messages for weddings, birthdays, and team nights.",
    status: "live" as const,
    featured: false,
  },
  {
    href: "/generator/persona",
    icon: Drama,
    title: "Character Voice",
    subtitle: "The Alter Ego",
    description:
      "Get your fortune from a noir detective, a villain, or your grandma.",
    status: "live" as const,
    featured: false,
  },
];

export default function GeneratorPage() {
  return (
    <>
      <BreadcrumbStructuredData
        items={[
          { name: "Home", url: "/" },
          { name: "Fortune Cookie Generator", url: "/generator" },
        ]}
      />
      <FAQStructuredData
        faqs={[
          {
            question: "What can the fortune cookie generator do?",
            answer:
              "Choose from four AI modes: Quick Fortune (The True Oracle) for predictions — good, neutral, bad, or ominous; Tabletop RPG Fortunes for campaign omens and quest hooks; Party & Event Fortunes (The Event Master) for custom wedding and party fortunes; and Character Voice (The Alter Ego) for persona-driven fortunes. Each mode has its own controls.",
          },
          {
            question: "How many fortunes can I generate for free?",
            answer:
              "Guests get 3 AI fortunes a day. Sign in with Google for 10 a day, plus saved favorites and history across devices. Limits reset at midnight UTC. The daily cookie on the homepage is separate and always free.",
          },
          {
            question: "Do I need an account?",
            answer:
              "No signup is needed to generate fortunes. Signing in with Google only unlocks extras like saved favorites, history across devices, and a higher daily limit.",
          },
          {
            question: "Are the fortunes generated by real AI?",
            answer:
              "Yes, each fortune is generated by an AI model in real time and written to read like a human wrote it — no generic self-help platitudes.",
          },
          {
            question: "How do the lucky numbers work?",
            answer:
              "Each fortune comes with a set of algorithmically selected lucky numbers, purely for fun — a playful nod to the classic fortune cookie tradition.",
          },
        ]}
      />
      <main className="min-h-screen w-full overflow-x-hidden relative">
        <DynamicBackgroundEffects />
        <div className="relative z-10 container mx-auto max-w-5xl px-4 pb-20 pt-24 md:pt-28">
          <header className="mb-10 text-center">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-50 md:text-4xl">
              Fortune Cookie Generator
            </h1>
            <p className="mx-auto mt-3 max-w-2xl text-slate-600 dark:text-slate-300">
              Four ways to craft a fortune. Pick a mode to begin.
            </p>
          </header>

          {/* Section label for the mode grid. The page H1 stays
              "Fortune Cookie Generator" — this is only a section heading. */}
          <h2 className="mb-4 text-center text-lg font-semibold text-slate-800 dark:text-slate-200">
            Choose a mode
          </h2>

          <ul className="grid list-none gap-5 p-0 sm:grid-cols-2">
            {MODES.map((mode) => {
              const Icon = mode.icon;
              const isLive = mode.status === "live";
              const inner = (
                <>
                  <div className="mb-4 flex items-center justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 text-white">
                      <Icon className="h-6 w-6" />
                    </div>
                    {isLive ? (
                      <ArrowRight className="h-5 w-5 text-amber-500 transition-transform group-hover:translate-x-1" />
                    ) : (
                      <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                        Coming soon
                      </span>
                    )}
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                    {mode.title}
                  </h3>
                  <p className="mt-0.5 text-sm font-medium text-amber-700 dark:text-amber-300">
                    {mode.subtitle}
                  </p>
                  <p className="mt-1.5 text-sm text-slate-600 dark:text-slate-400">
                    {mode.description}
                  </p>
                </>
              );

              const baseClass =
                "group block h-full rounded-2xl border p-6 transition-all";
              // Mobile-only promotion of the first card. Desktop keeps a level
              // grid so the 2-column reading order stays predictable.
              const featuredClass = mode.featured
                ? "ring-2 ring-amber-400/70 shadow-md sm:ring-0 sm:shadow-none"
                : "";

              return (
                <li key={mode.href}>
                  {isLive ? (
                    <Link
                      href={mode.href}
                      className={`${baseClass} ${featuredClass} border-amber-200 bg-white/80 backdrop-blur hover:-translate-y-0.5 hover:border-amber-400 hover:shadow-lg dark:border-amber-500/30 dark:bg-slate-900/60`}
                    >
                      {inner}
                    </Link>
                  ) : (
                    <div
                      aria-disabled="true"
                      className={`${baseClass} cursor-not-allowed border-slate-200 bg-white/50 opacity-75 dark:border-slate-700 dark:bg-slate-900/40`}
                    >
                      {inner}
                    </div>
                  )}
                </li>
              );
            })}
          </ul>

          <div className="py-8 flex justify-center">
            <AdUnit slot="8173598207" />
          </div>
        </div>
      </main>
    </>
  );
}
