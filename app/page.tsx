import { Metadata } from "next";
import dynamic from "next/dynamic";
import Link from "next/link";
import { Sparkles, PartyPopper, Dices, Drama, ArrowRight } from "lucide-react";
import { DynamicBackgroundEffects } from "@/components/DynamicBackgroundEffects";
import { WebApplicationStructuredData } from "@/components/StructuredData";
import { FAQStructuredData } from "@/components/FAQStructuredData";
import { generateSEOMetadata } from "@/components/SEO";
import { getSiteUrl } from "@/lib/site";
import { FortuneCookieStatic } from "@/components/FortuneCookieStatic";

// Edge runtime for faster TTFB; homepage shell is static with ISR.
export const runtime = "edge";
export const revalidate = 21600; // 6 hours

const _baseUrl = getSiteUrl();

// Interactive layer loads after the static LCP hero.
const FortuneCookieInteractive = dynamic(
  () =>
    import("@/components/FortuneCookieInteractive").then(
      (mod) => mod.FortuneCookieInteractive,
    ),
  { ssr: false, loading: () => null },
);

export const metadata: Metadata = {
  ...generateSEOMetadata({
    title: "Fortune Cookie AI — Free Online Fortune Cookie Generator",
    description:
      "Crack open a free AI fortune cookie online. Get a daily prediction with lucky numbers, then craft custom fortunes with four AI modes — Oracle, Event, RPG, and Persona. No signup.",
    image: "/og-image.png",
    url: "/",
    type: "website",
  }),
  openGraph: {
    title: "Fortune Cookie AI — Free Online Fortune Cookie Generator",
    description:
      "Crack open a free AI fortune cookie online. Daily prediction with lucky numbers, plus four AI generator modes. No signup needed.",
    type: "website",
    url: _baseUrl,
    images: [
      {
        url: `${_baseUrl}/api/og?type=pseo&title=${encodeURIComponent("Fortune Cookie AI")}&emoji=${encodeURIComponent("🥠")}&badge=${encodeURIComponent("Free AI Generator")}&description=${encodeURIComponent("Crack open a free AI fortune cookie online.")}&gradient=default`,
        width: 1200,
        height: 630,
        alt: "Fortune Cookie AI — Free Online Fortune Cookie Generator",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Fortune Cookie AI — Free Online Fortune Cookie Generator",
    description:
      "Crack open a free AI fortune cookie online. Daily prediction with lucky numbers, plus four AI generator modes.",
    images: [
      `${_baseUrl}/api/og?type=pseo&title=${encodeURIComponent("Fortune Cookie AI")}&emoji=${encodeURIComponent("🥠")}&badge=${encodeURIComponent("Free AI Generator")}&description=${encodeURIComponent("Crack open a free AI fortune cookie online.")}&gradient=default`,
    ],
    creator: "@fortunecookieai",
  },
};

/**
 * Same function-first naming and same order as the /generator hub, so the two
 * entry points never disagree. `subtitle` carries the original brand name.
 * DOM order = mobile order (Quick Fortune first, visually promoted); on the
 * 2-column desktop grid it puts Tabletop RPG Fortunes second.
 */
const MODES = [
  {
    href: "/generator/oracle",
    icon: Sparkles,
    title: "Quick Fortune",
    subtitle: "The True Oracle",
    description: "One tap, one prophecy. No settings needed.",
    featured: true,
  },
  {
    href: "/generator/rpg",
    icon: Dices,
    title: "Tabletop RPG Fortunes",
    subtitle: "Prophecies & Quest Hooks",
    description: "Omens, riddles, and quest hooks for your next session.",
    featured: false,
  },
  {
    href: "/generator/event",
    icon: PartyPopper,
    title: "Party & Event Fortunes",
    subtitle: "The Event Master",
    description:
      "Custom fortune cookie messages for weddings, birthdays, and team nights.",
    featured: false,
  },
  {
    href: "/generator/persona",
    icon: Drama,
    title: "Character Voice",
    subtitle: "The Alter Ego",
    description:
      "Get your fortune from a noir detective, a villain, or your grandma.",
    featured: false,
  },
];

const FAQS = [
  {
    question: "What is the fortune cookie generator?",
    answer:
      "A free online tool that writes fortune cookie messages with AI. Crack the cookie on the homepage for a daily prediction, or open the Generator to craft custom fortunes across four modes.",
  },
  {
    question: "How many free fortunes do I get?",
    answer:
      "The cookie on this page gives you one free fortune a day, no account needed. The Generator gives guests 3 more AI fortunes a day, and signing in with Google raises that to 10 — plus saved favorites and history. Limits reset at midnight UTC.",
  },
  {
    question: "Are the fortunes written by AI?",
    answer:
      "Yes — each fortune is generated in real time and written to sound human, not like generic self-help platitudes.",
  },
  {
    question: "What can I do in the Generator?",
    answer:
      "Pick a mode: Quick Fortune (The True Oracle) for predictions, Tabletop RPG Fortunes for omens and quest hooks, Party & Event Fortunes (The Event Master) for weddings and parties, and Character Voice (The Alter Ego) for persona-driven fortunes. Each mode has its own controls.",
  },
];

export default function HomePage() {
  return (
    <>
      <WebApplicationStructuredData />
      <FAQStructuredData faqs={FAQS} />

      <main className="relative w-full overflow-x-hidden">
        <DynamicBackgroundEffects />

        {/* Hero — full-screen interactive cookie (the "trial" of the Generator) */}
        <div className="relative z-10">
          <FortuneCookieStatic />
          <FortuneCookieInteractive />
        </div>

        {/* Below the fold — concise SEO content + mode entry points */}
        <section className="relative z-10 border-t border-amber-100 bg-white/60 py-16 backdrop-blur dark:border-slate-800 dark:bg-slate-900/60">
          <div className="container mx-auto max-w-4xl px-4">
            <header className="mb-10 text-center">
              <h1 className="mb-3 text-2xl font-bold text-slate-900 dark:text-slate-50 md:text-3xl">
                Free Online Fortune Cookie Generator
              </h1>
              <p className="mx-auto max-w-2xl text-slate-600 dark:text-slate-300">
                Tap the cookie above for your free daily fortune — or open the
                Generator to craft your own with AI.
              </p>
            </header>

            <ul className="grid list-none gap-4 p-0 sm:grid-cols-2">
              {MODES.map((mode) => {
                const Icon = mode.icon;
                return (
                  <li key={mode.href}>
                    <Link
                      href={mode.href}
                      className={`group flex h-full items-start gap-3 rounded-2xl border border-amber-200 bg-white/80 p-5 transition-all hover:-translate-y-0.5 hover:border-amber-400 hover:shadow-md dark:border-slate-700 dark:bg-slate-800/60 ${
                        mode.featured
                          ? "ring-2 ring-amber-400/70 shadow-md sm:ring-0 sm:shadow-none"
                          : ""
                      }`}
                    >
                      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 text-white">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <h2 className="flex items-center gap-1 font-semibold text-slate-900 dark:text-slate-100">
                          {mode.title}
                          <ArrowRight className="h-4 w-4 text-amber-500 opacity-0 transition-opacity group-hover:opacity-100" />
                        </h2>
                        <p className="mt-0.5 text-sm font-medium text-amber-700 dark:text-amber-300">
                          {mode.subtitle}
                        </p>
                        <p className="mt-0.5 text-sm text-slate-600 dark:text-slate-400">
                          {mode.description}
                        </p>
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>

            <div className="mt-8 text-center">
              <Link
                href="/generator"
                className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 px-6 py-3 font-medium text-white shadow-lg transition-transform hover:scale-105"
              >
                Open the Generator
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            {/* Visible FAQ for SEO */}
            <div className="mt-14">
              <h2 className="mb-6 text-center text-xl font-bold text-slate-900 dark:text-slate-100">
                Frequently Asked Questions
              </h2>
              <dl className="space-y-4">
                {FAQS.map((faq) => (
                  <div
                    key={faq.question}
                    className="rounded-xl border border-slate-200 bg-white/70 p-4 dark:border-slate-700 dark:bg-slate-800/50"
                  >
                    <dt className="font-medium text-slate-900 dark:text-slate-100">
                      {faq.question}
                    </dt>
                    <dd className="mt-1.5 text-sm text-slate-600 dark:text-slate-400">
                      {faq.answer}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
