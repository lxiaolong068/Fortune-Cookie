"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { categoryConfig, allCategories, type FortuneCategory } from "@/lib/category-config";
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
    <section className={cn("py-8", className)} aria-labelledby="category-links-heading">
      <h2
        id="category-links-heading"
        className="text-2xl font-semibold text-center text-gray-800 mb-6"
      >
        {t("home.popularCategories")}
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-4 max-w-4xl mx-auto px-4">
        {categories.map((category, index) => {
          const config = categoryConfig[category];
          const Icon = config.icon;
          const labelKey = `generator.themes.${category}`;
          const localizedLabel = t(labelKey);
          const label = localizedLabel === labelKey ? config.label : localizedLabel;
          const categoryHref = `${getLocalizedHref("/browse")}?category=${encodeURIComponent(
            category,
          )}`;

          return (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.3,
                delay: index * 0.05,
                ease: "easeOut",
              }}
            >
              <Link
                href={categoryHref}
                className={cn(
                  "group flex flex-col items-center gap-2 p-4 rounded-xl",
                  "border transition-all duration-200",
                  "hover:shadow-lg hover:-translate-y-1",
                  "focus:outline-none focus:ring-2 focus:ring-offset-2",
                  config.bgColor,
                  config.borderColor,
                  config.hoverBgColor,
                  `focus:ring-${category === "inspirational" ? "blue" : category === "funny" ? "yellow" : category === "love" ? "pink" : category === "success" ? "green" : category === "wisdom" ? "purple" : category === "friendship" ? "orange" : category === "health" ? "red" : "indigo"}-400`
                )}
              >
                <div
                  className={cn(
                    "p-3 rounded-full transition-transform duration-200",
                    "group-hover:scale-110",
                    config.bgColor
                  )}
                >
                  <Icon
                    className={cn("h-6 w-6", config.color)}
                    aria-hidden="true"
                  />
                </div>
                <span
                  className={cn(
                    "text-sm font-medium text-gray-700",
                    "group-hover:text-gray-900"
                  )}
                >
                  {label}
                </span>
                {showDescriptions && (
                  <span className="text-xs text-gray-500 text-center line-clamp-2">
                    {config.description}
                  </span>
                )}
              </Link>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
