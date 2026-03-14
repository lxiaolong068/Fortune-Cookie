import { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getSiteUrl } from "@/lib/site";
import { occasionsDatabase } from "@/lib/pseo/occasions";
import {
  BreadcrumbStructuredData,
  ItemListStructuredData,
} from "@/components/StructuredData";

export const dynamic = "force-static";
export const revalidate = 86400;

const baseUrl = getSiteUrl();

export const metadata: Metadata = {
  title:
    "Fortune Cookie Messages for Every Occasion | Wedding, Birthday & More",
  description:
    "Browse 500+ fortune cookie messages organized by occasion. Find the perfect fortune for weddings, birthdays, graduations, holidays, and every special moment.",
  openGraph: {
    title:
      "Fortune Cookie Messages for Every Occasion | Wedding, Birthday & More",
    description:
      "Browse 500+ fortune cookie messages organized by occasion. Wedding, birthday, graduation, holiday, and workplace fortunes.",
    type: "website",
    url: `${baseUrl}/fortune-cookie-messages`,
  },
  alternates: { canonical: "/fortune-cookie-messages" },
};

const groups = [
  { key: "lifecycle", label: "Life Milestones", emoji: "🎉" },
  { key: "holiday", label: "Holidays & Seasons", emoji: "🎄" },
  { key: "workplace", label: "Workplace & School", emoji: "💼" },
] as const;

export default function FortuneMessagesHub() {
  const grouped = groups.map(({ key, label, emoji }) => ({
    key,
    label,
    emoji,
    items: occasionsDatabase.filter((o) => o.group === key),
  }));

  const listItems = occasionsDatabase.slice(0, 10).map((o) => ({
    name: o.title,
    description: o.description,
  }));

  return (
    <>
      <BreadcrumbStructuredData
        items={[
          { name: "Home", url: "/" },
          { name: "Fortune Cookie Messages", url: "/fortune-cookie-messages" },
        ]}
      />
      <ItemListStructuredData
        name="Fortune Cookie Messages by Occasion"
        description="Browse fortune cookie messages organized by occasion — weddings, birthdays, holidays, and more."
        url="/fortune-cookie-messages"
        items={listItems}
      />

      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50 dark:from-slate-900 dark:to-slate-950">
        {/* Hero */}
        <section className="container mx-auto px-4 py-16 md:py-24 text-center">
          <span className="inline-block text-5xl mb-6">🥠</span>
          <h1 className="text-4xl md:text-6xl font-bold text-slate-800 dark:text-white mb-6">
            Fortune Cookie Messages{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-500">
              for Every Occasion
            </span>
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto mb-8">
            Find the perfect fortune cookie message for any celebration, holiday,
            or special moment. Browse {occasionsDatabase.length}+ carefully curated
            occasion collections.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href="/ai-generator"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold hover:opacity-90 transition-opacity shadow-lg"
            >
              Generate Custom Fortune
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/explore"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full border-2 border-amber-300 text-amber-700 dark:text-amber-400 font-semibold hover:bg-amber-50 dark:hover:bg-amber-900/20 transition-colors"
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
              {items.map((occasion) => (
                <Link
                  key={occasion.slug}
                  href={`/fortune-cookie-messages/${occasion.slug}`}
                  className="group block"
                >
                  <div className="flex items-center gap-4 p-4 rounded-2xl bg-white dark:bg-slate-800 border border-amber-100 dark:border-slate-700 hover:border-amber-300 dark:hover:border-amber-600 hover:shadow-lg transition-all duration-200">
                    <span className="text-3xl flex-shrink-0">
                      {occasion.emoji}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-amber-600 dark:text-amber-400 uppercase tracking-wide">
                        {occasion.badge}
                      </p>
                      <p className="font-semibold text-slate-800 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                        {occasion.title}
                      </p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-amber-500 transition-colors flex-shrink-0" />
                  </div>
                </Link>
              ))}
            </div>
          </section>
        ))}

        {/* CTA */}
        <section className="container mx-auto px-4 pb-24">
          <div className="rounded-3xl bg-gradient-to-r from-amber-500 to-orange-500 p-8 md:p-12 text-center text-white">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Can&rsquo;t find the perfect fortune?
            </h2>
            <p className="text-white/80 mb-6 max-w-xl mx-auto">
              Use our AI generator to create a custom fortune cookie message for
              any occasion in seconds.
            </p>
            <Link
              href="/ai-generator"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white text-amber-600 font-semibold hover:bg-white/90 transition-colors shadow-lg"
            >
              Try AI Generator <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}
