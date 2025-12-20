"use client";

import Link from "next/link";

const navigationItems = [
  { name: "Home", href: "/" },
  { name: "Generator", href: "/generator" },
  { name: "Messages", href: "/messages" },
  { name: "Browse", href: "/browse" },
  { name: "History", href: "/history" },
  { name: "Recipes", href: "/recipes" },
  { name: "Blog", href: "/blog" },
  { name: "Profile", href: "/profile" },
];

export function NavigationFallback() {
  return (
    <nav
      className="fixed top-6 left-1/2 z-50 hidden -translate-x-1/2 md:block"
      aria-label="Main navigation"
    >
      <div className="rounded-full border border-amber-200 bg-white/90 px-4 py-3 shadow-lg backdrop-blur-md">
        <ul className="m-0 flex list-none items-center space-x-0.5 p-0">
          {navigationItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className="flex items-center gap-1.5 rounded-full px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-amber-50 hover:text-amber-600"
                aria-label={item.name}
              >
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
