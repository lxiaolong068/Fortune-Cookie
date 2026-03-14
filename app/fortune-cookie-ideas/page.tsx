import { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getSiteUrl } from "@/lib/site";
import { activitiesDatabase } from "@/lib/pseo/activities";
import {
  BreadcrumbStructuredData,
  ItemListStructuredData,
} from "@/components/StructuredData";

export const dynamic = "force-static";
export const revalidate = 86400;

const baseUrl = getSiteUrl();

export const metadata: Metadata = {
  title:
    "Fortune Cookie Ideas for Every Activity | Dinner Parties, Classrooms & More",
  description:
    "Creative fortune cookie ideas for any activity! Dinner parties, game nights, classrooms, gift baskets, social media, and more — find inspiration for every use.",
  openGraph: {
    title:
      "Fortune Cookie Ideas for Every Activity | Dinner Parties, Classrooms & More",
    description:
      "Creative fortune cookie ideas for dinner parties, game nights, classrooms, gift baskets, social media, and more.",
    type: "website",
    url: `${baseUrl}/fortune-cookie-ideas`,
  },
  alternates: { canonical: "/fortune-cookie-ideas" },
};

const groups = [
  { key: "entertaining", label: "Entertaining & Social", emoji: "🎉" },
  { key: "educational", label: "Educational & Reflective", emoji: "📚" },
  { key: "creative", label: "Creative & Handmade", emoji: "✨" },
  { key: "professional", label: "Professional & Marketing", emoji: "📣" },
] as const;

export default function FortuneIdeasHub() {
  const grouped = groups.map(({ key, label, emoji }) => ({
    key,
    label,
    emoji,
    items: activitiesDatabase.filter((a) => a.group === key),
  }));

  const listItems = activitiesDatabase.slice(0, 10).map((a) => ({
    name: a.title,
    description: a.description,
  }));

  return (
    <>
      <BreadcrumbStructuredData
        items={[
          { name: "Home", url: "/" },
          { name: "Fortune Cookie Ideas", url: "/fortune-cookie-ideas" },
        ]}
      />
      <ItemListStructuredData
        name="Fortune Cookie Ideas by Activity"
        description="Creative fortune cookie ideas for every activity and context."
        url="/fortune-cookie-ideas"
        items={listItems}
      />

      <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-teal-50 dark:from-slate-900 dark:to-slate-950">
        {/* Hero */}
        <section className="container mx-auto px-4 py-16 md:py-24 text-center">
          <span className="inline-block text-5xl mb-6">💡</span>
          <h1 className="text-4xl md:text-6xl font-bold text-slate-800 dark:text-white mb-6">
            Fortune Cookie{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-500">
              Ideas
            </span>
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto mb-8">
            Discover creative ways to use fortune cookie messages for any
            activity — from dinner parties and classrooms to gift baskets and
            marketing campaigns.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href="/ai-generator"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold hover:opacity-90 transition-opacity shadow-lg"
            >
              Generate Custom Fortune
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/explore"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full border-2 border-emerald-300 text-emerald-700 dark:text-emerald-400 font-semibold hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors"
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
              {items.map((activity) => (
                <Link
                  key={activity.slug}
                  href={`/fortune-cookie-ideas/${activity.slug}`}
                  className="group block"
                >
                  <div className="flex items-center gap-4 p-4 rounded-2xl bg-white dark:bg-slate-800 border border-emerald-100 dark:border-slate-700 hover:border-emerald-300 dark:hover:border-emerald-600 hover:shadow-lg transition-all duration-200">
                    <span className="text-3xl flex-shrink-0">
                      {activity.emoji}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-emerald-600 dark:text-emerald-400 uppercase tracking-wide">
                        {activity.badge}
                      </p>
                      <p className="font-semibold text-slate-800 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                        {activity.title}
                      </p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-emerald-500 transition-colors flex-shrink-0" />
                  </div>
                </Link>
              ))}
            </div>
          </section>
        ))}

        {/* CTA */}
        <section className="container mx-auto px-4 pb-24">
          <div className="rounded-3xl bg-gradient-to-r from-emerald-500 to-teal-500 p-8 md:p-12 text-center text-white">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Need a Custom Fortune for Your Activity?
            </h2>
            <p className="text-white/80 mb-6 max-w-xl mx-auto">
              Use our AI generator to create the perfect fortune cookie message
              for any use case, event, or creative project.
            </p>
            <Link
              href="/ai-generator"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white text-emerald-600 font-semibold hover:bg-white/90 transition-colors shadow-lg"
            >
              Try AI Generator <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}
