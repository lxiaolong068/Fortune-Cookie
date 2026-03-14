"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

const hubs = [
  {
    href: "/fortune-cookie-messages",
    emoji: "🥠",
    title: "Fortune Cookie Messages",
    subtitle: "By Occasion",
    description:
      "Wedding, birthday, graduation, holiday, and 16+ more occasions",
    count: "20 collections",
    gradient: "from-amber-400 to-orange-500",
    bgLight: "from-amber-50 to-orange-50",
    bgDark: "dark:from-amber-950/20 dark:to-orange-950/20",
    border: "border-amber-200 dark:border-amber-800/40",
    hover: "hover:border-amber-400 dark:hover:border-amber-600",
    badge: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
    arrow: "text-amber-500",
  },
  {
    href: "/fortune-cookie-quotes",
    emoji: "💫",
    title: "Fortune Cookie Quotes",
    subtitle: "By Theme",
    description:
      "Inspirational, funny, love, deep, sarcastic, philosophical & more",
    count: "16 collections",
    gradient: "from-indigo-400 to-purple-500",
    bgLight: "from-indigo-50 to-purple-50",
    bgDark: "dark:from-indigo-950/20 dark:to-purple-950/20",
    border: "border-indigo-200 dark:border-indigo-800/40",
    hover: "hover:border-indigo-400 dark:hover:border-indigo-600",
    badge: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300",
    arrow: "text-indigo-500",
  },
  {
    href: "/fortune-cookie-messages-for",
    emoji: "🎁",
    title: "Messages For Everyone",
    subtitle: "By Audience",
    description:
      "Teachers, students, couples, kids, friends, nurses, and more",
    count: "16 collections",
    gradient: "from-purple-400 to-pink-500",
    bgLight: "from-purple-50 to-pink-50",
    bgDark: "dark:from-purple-950/20 dark:to-pink-950/20",
    border: "border-purple-200 dark:border-purple-800/40",
    hover: "hover:border-purple-400 dark:hover:border-purple-600",
    badge: "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300",
    arrow: "text-purple-500",
  },
  {
    href: "/fortune-cookie-ideas",
    emoji: "💡",
    title: "Fortune Cookie Ideas",
    subtitle: "By Activity",
    description:
      "Dinner parties, classrooms, gift baskets, social media & more",
    count: "15 collections",
    gradient: "from-emerald-400 to-teal-500",
    bgLight: "from-emerald-50 to-teal-50",
    bgDark: "dark:from-emerald-950/20 dark:to-teal-950/20",
    border: "border-emerald-200 dark:border-emerald-800/40",
    hover: "hover:border-emerald-400 dark:hover:border-emerald-600",
    badge: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
    arrow: "text-emerald-500",
  },
] as const;

export function PSEOHubLinks({ className }: { className?: string }) {
  return (
    <section
      className={cn("py-12 px-4", className)}
      aria-labelledby="pseo-hub-heading"
    >
      {/* Section Header */}
      <div className="text-center mb-10 max-w-2xl mx-auto">
        <h2
          id="pseo-hub-heading"
          className="text-2xl md:text-3xl font-heading font-bold text-slate-800 dark:text-slate-100 mb-3"
        >
          Browse Fortune Collections
        </h2>
        <p className="text-slate-600 dark:text-slate-400 font-body">
          500+ curated fortune cookie messages organized by occasion, theme, audience,
          and activity
        </p>
      </div>

      {/* Hub Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-4xl mx-auto">
        {hubs.map((hub, index) => (
          <motion.div
            key={hub.href}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.08, ease: "easeOut" }}
          >
            <Link href={hub.href} className="group block h-full">
              <div
                className={cn(
                  "relative flex flex-col h-full rounded-2xl border p-6",
                  "bg-gradient-to-br",
                  hub.bgLight,
                  hub.bgDark,
                  hub.border,
                  hub.hover,
                  "hover:shadow-lg transition-all duration-300",
                  "focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
                )}
              >
                {/* Top row: emoji + count badge */}
                <div className="flex items-start justify-between mb-4">
                  <span className="text-4xl">{hub.emoji}</span>
                  <span
                    className={cn(
                      "text-xs font-semibold px-2.5 py-1 rounded-full",
                      hub.badge,
                    )}
                  >
                    {hub.count}
                  </span>
                </div>

                {/* Title */}
                <div className="mb-1">
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-0.5">
                    {hub.subtitle}
                  </p>
                  <h3 className="text-lg font-bold text-slate-800 dark:text-white group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
                    {hub.title}
                  </h3>
                </div>

                {/* Description */}
                <p className="text-sm text-slate-600 dark:text-slate-300 flex-1 leading-relaxed mb-4">
                  {hub.description}
                </p>

                {/* CTA arrow */}
                <div
                  className={cn(
                    "flex items-center gap-1 text-sm font-semibold",
                    hub.arrow,
                  )}
                >
                  <span>Browse all</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
