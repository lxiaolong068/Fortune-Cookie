import { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getSiteUrl } from "@/lib/site";
import { quotesDatabase } from "@/lib/pseo/quotes";
import {
  BreadcrumbStructuredData,
  ItemListStructuredData,
} from "@/components/StructuredData";

export const dynamic = "force-static";
export const revalidate = 86400;

const baseUrl = getSiteUrl();

export const metadata: Metadata = {
  title:
    "Fortune Cookie Quotes | Inspirational, Funny, Love & More Collections",
  description:
    "Explore 500+ fortune cookie quotes organized by mood and theme. Inspirational, funny, love, deep, sarcastic, and more — find the perfect quote for any moment.",
  openGraph: {
    title:
      "Fortune Cookie Quotes | Inspirational, Funny, Love & More Collections",
    description:
      "Explore 500+ fortune cookie quotes by theme: inspirational, funny, love, deep, sarcastic, and more.",
    type: "website",
    url: `${baseUrl}/fortune-cookie-quotes`,
  },
  alternates: { canonical: "/fortune-cookie-quotes" },
};

const groups = [
  { key: "positive", label: "Positive & Uplifting", emoji: "✨" },
  { key: "humor", label: "Humor & Wit", emoji: "😄" },
  { key: "reflective", label: "Deep & Reflective", emoji: "🌊" },
  { key: "relationship", label: "Love & Relationships", emoji: "❤️" },
] as const;

export default function FortuneQuotesHub() {
  const grouped = groups.map(({ key, label, emoji }) => ({
    key,
    label,
    emoji,
    items: quotesDatabase.filter((q) => q.group === key),
  }));

  const listItems = quotesDatabase.slice(0, 10).map((q) => ({
    name: q.title,
    description: q.description,
  }));

  return (
    <>
      <BreadcrumbStructuredData
        items={[
          { name: "Home", url: "/" },
          { name: "Fortune Cookie Quotes", url: "/fortune-cookie-quotes" },
        ]}
      />
      <ItemListStructuredData
        name="Fortune Cookie Quotes by Category"
        description="Browse fortune cookie quotes organized by theme and mood."
        url="/fortune-cookie-quotes"
        items={listItems}
      />

      <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-purple-50 dark:from-slate-900 dark:to-slate-950">
        {/* Hero */}
        <section className="container mx-auto px-4 py-16 md:py-24 text-center">
          <span className="inline-block text-5xl mb-6">💫</span>
          <h1 className="text-4xl md:text-6xl font-bold text-slate-800 dark:text-white mb-6">
            Fortune Cookie{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-500">
              Quotes
            </span>
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto mb-8">
            Explore {quotesDatabase.length} curated collections of fortune cookie
            quotes — from deeply inspirational to hilariously sarcastic, there&rsquo;s
            a quote for every mood.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href="/ai-generator"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold hover:opacity-90 transition-opacity shadow-lg"
            >
              Generate Custom Fortune
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/explore"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full border-2 border-indigo-300 text-indigo-700 dark:text-indigo-400 font-semibold hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors"
            >
              Browse All Fortunes
            </Link>
          </div>
        </section>

        {/* Grouped Cards */}
        {grouped.map(({ key, label, emoji, items }) => (
          <section key={key} className="container mx-auto px-4 pb-16">
            <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-6 flex items-center gap-2">
              <span>{emoji}</span> {label}
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {items.map((quote) => (
                <Link
                  key={quote.slug}
                  href={`/fortune-cookie-quotes/${quote.slug}`}
                  className="group block"
                >
                  <div className="flex items-center gap-4 p-4 rounded-2xl bg-white dark:bg-slate-800 border border-indigo-100 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-600 hover:shadow-lg transition-all duration-200">
                    <span className="text-3xl flex-shrink-0">{quote.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-indigo-600 dark:text-indigo-400 uppercase tracking-wide">
                        {quote.badge}
                      </p>
                      <p className="font-semibold text-slate-800 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                        {quote.title}
                      </p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-500 transition-colors flex-shrink-0" />
                  </div>
                </Link>
              ))}
            </div>
          </section>
        ))}

        {/* CTA */}
        <section className="container mx-auto px-4 pb-24">
          <div className="rounded-3xl bg-gradient-to-r from-indigo-500 to-purple-500 p-8 md:p-12 text-center text-white">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Create Your Perfect Fortune Quote
            </h2>
            <p className="text-white/80 mb-6 max-w-xl mx-auto">
              Use our AI generator to craft a custom fortune with exactly the
              tone, theme, and message you need.
            </p>
            <Link
              href="/ai-generator"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white text-indigo-600 font-semibold hover:bg-white/90 transition-colors shadow-lg"
            >
              Try AI Generator <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}
