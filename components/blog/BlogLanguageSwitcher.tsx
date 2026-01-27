"use client";

/**
 * Blog Language Switcher Component
 *
 * Displays available language options for blog posts and allows switching.
 * Shows only languages that have translated content.
 */

import { Globe, ChevronDown } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { type Locale, i18n, languages } from "@/lib/i18n-config";
import { cn } from "@/lib/utils";

interface BlogLanguageSwitcherProps {
  currentLocale: Locale;
  availableLocales: Locale[];
  basePath: string;
  searchParams?: Record<string, string | undefined>;
  variant?: "default" | "compact";
}

export function BlogLanguageSwitcher({
  currentLocale,
  availableLocales,
  basePath,
  searchParams,
  variant = "default",
}: BlogLanguageSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Build URL for a specific locale
  const buildUrl = (locale: Locale) => {
    const prefix = locale === i18n.defaultLocale ? "" : `/${locale}`;
    let url = `${prefix}${basePath}`;

    // Add search params if present
    if (searchParams) {
      const params = new URLSearchParams();
      Object.entries(searchParams).forEach(([key, value]) => {
        if (value) params.set(key, value);
      });
      const query = params.toString();
      if (query) url += `?${query}`;
    }

    return url;
  };

  const currentLang = languages[currentLocale];

  if (availableLocales.length <= 1) {
    return null;
  }

  if (variant === "compact") {
    return (
      <div className="flex items-center gap-2 text-sm">
        <Globe className="w-4 h-4 text-gray-500" />
        <span className="text-gray-500">Available in:</span>
        <div className="flex gap-1">
          {availableLocales.map((locale) => {
            const lang = languages[locale];
            const isActive = locale === currentLocale;

            return (
              <Link
                key={locale}
                href={buildUrl(locale)}
                className={cn(
                  "px-2 py-1 rounded text-sm transition-colors",
                  isActive
                    ? "bg-amber-100 text-amber-800 font-medium"
                    : "text-gray-600 hover:bg-gray-100"
                )}
                title={lang.name}
              >
                {lang.flag} {lang.nativeName}
              </Link>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="relative inline-block">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm border border-amber-200 rounded-lg hover:bg-amber-50 transition-colors"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <Globe className="w-4 h-4 text-amber-600" />
        <span className="text-gray-700">
          {currentLang.flag} {currentLang.nativeName}
        </span>
        <ChevronDown
          className={cn(
            "w-4 h-4 text-gray-500 transition-transform",
            isOpen && "rotate-180"
          )}
        />
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />

          {/* Dropdown */}
          <div
            className="absolute top-full left-0 mt-2 min-w-[180px] bg-white rounded-lg shadow-lg border border-amber-200 overflow-hidden z-20"
            role="listbox"
          >
            {availableLocales.map((locale) => {
              const lang = languages[locale];
              const isActive = locale === currentLocale;

              return (
                <Link
                  key={locale}
                  href={buildUrl(locale)}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 hover:bg-amber-50 transition-colors",
                    isActive && "bg-amber-100"
                  )}
                  role="option"
                  aria-selected={isActive}
                >
                  <span className="text-xl">{lang.flag}</span>
                  <div className="flex flex-col">
                    <span
                      className={cn(
                        "font-medium",
                        isActive ? "text-amber-800" : "text-gray-800"
                      )}
                    >
                      {lang.nativeName}
                    </span>
                    <span className="text-xs text-gray-500">{lang.name}</span>
                  </div>
                  {isActive && (
                    <span className="ml-auto text-amber-600">✓</span>
                  )}
                </Link>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
