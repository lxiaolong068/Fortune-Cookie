"use client";

import Link from "next/link";
import { useLocale } from "@/lib/locale-context";

const navigationItems = [
  { key: "home", href: "/" },
  { key: "generator", href: "/generator" },
  { key: "messages", href: "/messages" },
  { key: "browse", href: "/browse" },
  { key: "history", href: "/history" },
  { key: "recipes", href: "/recipes" },
  { key: "blog", href: "/blog" },
  { key: "profile", href: "/profile" },
];

export function NavigationFallback() {
  const { t, getLocalizedHref } = useLocale();

  return (
    <nav
      className="fixed top-6 left-1/2 z-50 hidden -translate-x-1/2 md:block"
      aria-label={t("navigation.mainLabel")}
    >
      <div className="rounded-full border border-amber-200 bg-white/90 px-4 py-3 shadow-lg backdrop-blur-md">
        <ul className="m-0 flex list-none items-center space-x-0.5 p-0">
          {navigationItems.map((item) => (
            <li key={item.href}>
              <Link
                href={getLocalizedHref(item.href)}
                className="flex items-center gap-1.5 rounded-full px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-amber-50 hover:text-amber-600"
                aria-label={t(`navigation.${item.key}`)}
              >
                {t(`navigation.${item.key}`)}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
