"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  categoryConfig,
  allCategories,
  type FortuneCategory,
} from "@/lib/category-config";
import { cn } from "@/lib/utils";
import { useLocale } from "@/lib/locale-context";

interface CategoryQuickLinksProps {
  className?: string;
  /** Categories to display. Defaults to first 8. */
  categories?: FortuneCategory[];
  /** Show category descriptions on hover */
  showDescriptions?: boolean;
}

export function CategoryQuickLinks({
  className,
  categories = allCategories.slice(0, 8),
  showDescriptions = false,
}: CategoryQuickLinksProps) {
  const { t, getLocalizedHref } = useLocale();

  return (
    <section
      className={cn("py-12 px-4", className)}
      aria-labelledby="category-links-heading"
    >
      {/* Section Header */}
      <div className="text-center mb-8">
        <h2
          id="category-links-heading"
          className="text-2xl md:text-3xl font-heading font-bold text-slate-800 dark:text-slate-100 mb-2"
        >
          {t("home.popularCategories")}
        </h2>
        <p className="text-slate-600 dark:text-slate-400 font-body">
          Explore fortunes by category
        </p>
      </div>

      {/* Category Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 md:gap-6 max-w-5xl mx-auto">
        {categories.map((category, index) => {
          const config = categoryConfig[category];
          const Icon = config.icon;
          const labelKey = `generator.themes.${category}`;
          const localizedLabel = t(labelKey);
          const label =
            localizedLabel === labelKey ? config.label : localizedLabel;
          const categoryHref = `${getLocalizedHref("/browse")}?category=${encodeURIComponent(
            category,
          )}`;

          return (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.4,
                delay: index * 0.05,
                ease: "easeOut",
              }}
            >
              <Link
                href={categoryHref}
                className={cn(
                  // Modern card design
                  "group relative flex flex-col items-center gap-4 p-6",
                  // White background with subtle shadow
                  "bg-white dark:bg-slate-800/50",
                  // Border
                  "border border-slate-100 dark:border-slate-700/50",
                  // Rounded corners
                  "rounded-2xl",
                  // Shadow - elevates on hover
                  "shadow-soft hover:shadow-card-hover",
                  // Transitions
                  "transition-all duration-300 ease-out",
                  // Hover lift effect
                  "hover:-translate-y-2",
                  // Cursor
                  "cursor-pointer",
                  // Focus ring
                  "focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2",
                )}
              >
                {/* Gradient Icon Container */}
                <div
                  className={cn(
                    "w-14 h-14 rounded-xl",
                    "bg-gradient-to-br",
                    config.gradientFrom,
                    config.gradientTo,
                    "flex items-center justify-center",
                    "shadow-lg",
                    // Hover effect
                    "group-hover:scale-110 group-hover:shadow-xl",
                    "transition-all duration-300",
                  )}
                >
                  <Icon className="w-7 h-7 text-white" aria-hidden="true" />
                </div>

                {/* Label */}
                <span
                  className={cn(
                    "text-sm md:text-base font-medium font-body",
                    "text-slate-700 dark:text-slate-200",
                    "group-hover:text-slate-900 dark:group-hover:text-white",
                    "transition-colors duration-200",
                  )}
                >
                  {label}
                </span>

                {/* Description (optional) */}
                {showDescriptions && (
                  <span className="text-xs text-slate-500 dark:text-slate-400 text-center line-clamp-2 font-body">
                    {config.description}
                  </span>
                )}

                {/* Hover glow effect */}
                <div
                  className={cn(
                    "absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100",
                    "bg-gradient-to-br",
                    config.gradientFrom
                      .replace("from-", "from-")
                      .replace("-500", "-100"),
                    config.gradientTo
                      .replace("to-", "to-")
                      .replace("-500", "-100"),
                    "dark:from-slate-700/30 dark:to-slate-600/30",
                    "transition-opacity duration-300",
                    "-z-10",
                  )}
                  aria-hidden="true"
                />
              </Link>
            </motion.div>
          );
        })}
      </div>

      {/* View All Link */}
      <div className="text-center mt-8">
        <Link
          href={getLocalizedHref("/browse")}
          className={cn(
            "inline-flex items-center gap-2 px-6 py-3",
            "text-indigo-600 dark:text-indigo-400",
            "hover:text-indigo-700 dark:hover:text-indigo-300",
            "font-medium font-body",
            "rounded-xl",
            "hover:bg-indigo-50 dark:hover:bg-indigo-900/30",
            "transition-all duration-200",
          )}
        >
          View all categories
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </Link>
      </div>
    </section>
  );
}
