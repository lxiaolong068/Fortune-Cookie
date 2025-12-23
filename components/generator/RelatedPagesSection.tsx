"use client";

import Link from "next/link";
import { Card } from "@/components/ui/card";

export function RelatedPagesSection() {
  return (
    <section className="max-w-4xl mx-auto">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        Related pages
      </h2>
      <div className="grid md:grid-cols-3 gap-4">
        {RELATED_PAGES.map((page, index) => (
          <Link key={index} href={page.href}>
            <Card className="p-4 bg-white/80 backdrop-blur-sm border-amber-200 hover:border-amber-400 hover:shadow-md transition-all group cursor-pointer h-full">
              <div className="flex flex-col h-full">
                <span className="text-3xl mb-3" aria-hidden="true">
                  {page.icon}
                </span>
                <h3 className="font-medium text-gray-800 group-hover:text-amber-700 transition-colors mb-2">
                  {page.title}
                </h3>
                <p className="text-sm text-gray-600 flex-1">
                  {page.description}
                </p>
                <span className="text-amber-600 text-sm font-medium mt-3 group-hover:underline">
                  Learn more →
                </span>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  );
}

const RELATED_PAGES = [
  {
    icon: "📜",
    title: "Browse fortune cookie messages",
    description:
      "Explore our collection of 500+ pre-written fortune cookie messages across various categories.",
    href: "/messages",
  },
  {
    icon: "📚",
    title: "History of fortune cookies",
    description:
      "Discover the fascinating history and origins of fortune cookies, from Japan to America.",
    href: "/history",
  },
  {
    icon: "🍪",
    title: "Fortune cookie recipes",
    description:
      "Learn how to make your own fortune cookies at home with our step-by-step recipes.",
    href: "/recipes",
  },
];
