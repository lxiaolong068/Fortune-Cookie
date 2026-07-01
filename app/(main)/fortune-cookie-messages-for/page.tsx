import { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getSiteUrl } from "@/lib/site";
import { audiencesDatabase } from "@/lib/pseo/audiences";
import {
  BreadcrumbStructuredData,
  ItemListStructuredData,
} from "@/components/StructuredData";

export const dynamic = "force-static";
export const revalidate = 86400;

const baseUrl = getSiteUrl();

export const metadata: Metadata = {
  title:
    "Fortune Cookie Messages For Everyone | Teachers, Kids, Couples & More",
  description:
    "Find personalized fortune cookie messages for the special people in your life. Messages for teachers, students, couples, kids, grandparents, and more.",
  openGraph: {
    title:
      "Fortune Cookie Messages For Everyone | Teachers, Kids, Couples & More",
    description:
      "Find personalized fortune cookie messages for teachers, students, couples, kids, grandparents, and more.",
    type: "website",
    url: `${baseUrl}/fortune-cookie-messages-for`,
  },
  alternates: { canonical: "/fortune-cookie-messages-for" },
};

const groups = [
  { key: "professional", label: "Professional & Academic", emoji: "💼" },
  { key: "relationships", label: "Relationships & Friendship", emoji: "💕" },
  { key: "family", label: "Family", emoji: "👨‍👩‍👧‍👦" },
] as const;

export default function FortuneMessagesForHub() {
  const grouped = groups.map(({ key, label, emoji }) => ({
    key,
    label,
    emoji,
    items: audiencesDatabase.filter((a) => a.group === key),
  }));

  const listItems = audiencesDatabase.slice(0, 10).map((a) => ({
    name: a.title,
    description: a.description,
  }));

  return (
    <>
      <BreadcrumbStructuredData
        items={[
          { name: "Home", url: "/" },
          {
            name: "Fortune Cookie Messages For",
            url: "/fortune-cookie-messages-for",
          },
        ]}
      />
      <ItemListStructuredData
        name="Fortune Cookie Messages for Every Audience"
        description="Personalized fortune cookie messages for everyone in your life."
        url="/fortune-cookie-messages-for"
        items={listItems}
      />

      <div className="min-h-screen bg-gradient-to-b from-purple-50 to-pink-50 dark:from-slate-900 dark:to-slate-950">
        {/* Hero */}
        <section className="container mx-auto px-4 py-16 md:py-24 text-center">
          <span className="inline-block text-5xl mb-6">🎁</span>
          <h1 className="text-4xl md:text-6xl font-bold text-slate-800 dark:text-white mb-6">
            Fortune Cookie Messages{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500">
              For Everyone
            </span>
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto mb-8">
            Find thoughtful fortune cookie messages tailored for the special
            people in your life — from teachers and students to partners and
            grandparents.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href="/generator"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold hover:opacity-90 transition-opacity shadow-lg"
            >
              Generate Personal Fortune
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/explore"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full border-2 border-purple-300 text-purple-700 dark:text-purple-400 font-semibold hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors"
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
              {items.map((audience) => (
                <Link
                  key={audience.slug}
                  href={`/fortune-cookie-messages-for/${audience.slug}`}
                  className="group block"
                >
                  <div className="flex items-center gap-4 p-4 rounded-2xl bg-white dark:bg-slate-800 border border-purple-100 dark:border-slate-700 hover:border-purple-300 dark:hover:border-purple-600 hover:shadow-lg transition-all duration-200">
                    <span className="text-3xl flex-shrink-0">
                      {audience.emoji}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-purple-600 dark:text-purple-400 uppercase tracking-wide">
                        {audience.badge}
                      </p>
                      <p className="font-semibold text-slate-800 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                        {audience.title}
                      </p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-purple-500 transition-colors flex-shrink-0" />
                  </div>
                </Link>
              ))}
            </div>
          </section>
        ))}

        {/* CTA */}
        <section className="container mx-auto px-4 pb-24">
          <div className="rounded-3xl bg-gradient-to-r from-purple-500 to-pink-500 p-8 md:p-12 text-center text-white">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Make It Personal
            </h2>
            <p className="text-white/80 mb-6 max-w-xl mx-auto">
              Use our AI generator to create a fortune cookie message tailored
              specifically for someone you care about.
            </p>
            <Link
              href="/generator"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white text-purple-600 font-semibold hover:bg-white/90 transition-colors shadow-lg"
            >
              Try AI Generator <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}
