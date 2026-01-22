"use client";

import { useState, useRef, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Globe, ChevronDown, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  type Locale,
  i18n,
  languages,
  getLocaleFromPath,
  getLocalizedPath,
  pathConfig,
} from "@/lib/i18n-config";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/lib/locale-context";

interface LanguageSwitcherProps {
  className?: string;
  variant?: "dropdown" | "inline" | "minimal";
  showFlags?: boolean;
  showNativeNames?: boolean;
}

export function LanguageSwitcher({
  className,
  variant = "dropdown",
  showFlags = true,
  showNativeNames = true,
}: LanguageSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const router = useRouter();
  const { t } = useTranslation();

  // Get current locale from path
  const { locale: currentLocale, pathname: currentPath } =
    getLocaleFromPath(pathname);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle locale change
  const handleLocaleChange = (newLocale: Locale) => {
    if (newLocale === currentLocale) {
      setIsOpen(false);
      return;
    }

    // Get the new localized path
    const newPath = getLocalizedPath(currentPath, newLocale);

    // Set cookie for preference persistence
    document.cookie = `${pathConfig.detection.cookieName}=${newLocale};path=/;max-age=${pathConfig.detection.cookieMaxAge}`;

    // Navigate to the new locale
    router.push(newPath);
    setIsOpen(false);
  };

  // Current language config
  const currentLanguage = languages[currentLocale];

  // Render based on variant
  if (variant === "minimal") {
    return (
      <div className={cn("flex items-center gap-1", className)}>
        {i18n.locales.map((locale) => (
          <button
            key={locale}
            onClick={() => handleLocaleChange(locale)}
            className={cn(
              "px-2 py-1 text-sm rounded-md transition-colors",
              locale === currentLocale
                ? "bg-amber-100 text-amber-800 font-medium"
                : "text-gray-600 hover:bg-gray-100"
            )}
            aria-label={t("common.switchToLanguage", {
              language: languages[locale].name,
            })}
          >
            {showFlags ? languages[locale].flag : locale.toUpperCase()}
          </button>
        ))}
      </div>
    );
  }

  if (variant === "inline") {
    return (
      <div
        className={cn(
          "flex items-center gap-2 flex-wrap justify-center",
          className
        )}
      >
        {i18n.locales.map((locale, index) => (
          <span key={locale} className="flex items-center">
            <button
              onClick={() => handleLocaleChange(locale)}
              className={cn(
                "inline-flex items-center gap-1 px-2 py-1 text-sm rounded-md transition-colors",
                locale === currentLocale
                  ? "text-amber-700 font-medium"
                  : "text-gray-500 hover:text-gray-700"
              )}
              aria-label={t("common.switchToLanguage", {
                language: languages[locale].name,
              })}
            >
              {showFlags && <span>{languages[locale].flag}</span>}
              <span>
                {showNativeNames
                  ? languages[locale].nativeName
                  : languages[locale].name}
              </span>
            </button>
            {index < i18n.locales.length - 1 && (
              <span className="text-gray-300 mx-1">|</span>
            )}
          </span>
        ))}
      </div>
    );
  }

  // Default dropdown variant
  return (
    <div ref={dropdownRef} className={cn("relative", className)}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center gap-2 px-3 py-2 rounded-lg",
          "bg-white/80 hover:bg-white border border-gray-200",
          "text-gray-700 text-sm font-medium",
          "transition-all duration-200",
          "focus:outline-none focus:ring-2 focus:ring-amber-500/50"
        )}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-label={t("common.selectLanguage")}
      >
        <Globe className="w-4 h-4 text-gray-500" />
        {showFlags && <span>{currentLanguage.flag}</span>}
        <span className="hidden sm:inline">
          {showNativeNames
            ? currentLanguage.nativeName
            : currentLanguage.name}
        </span>
        <ChevronDown
          className={cn(
            "w-4 h-4 text-gray-400 transition-transform duration-200",
            isOpen && "rotate-180"
          )}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
            className={cn(
              "absolute right-0 mt-2 w-48 z-50",
              "bg-white rounded-lg shadow-lg border border-gray-200",
              "overflow-hidden"
            )}
            role="listbox"
            aria-label={t("common.languageOptions")}
          >
            {i18n.locales.map((locale) => {
              const lang = languages[locale];
              const isSelected = locale === currentLocale;

              return (
                <button
                  key={locale}
                  onClick={() => handleLocaleChange(locale)}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-3",
                    "text-left text-sm transition-colors",
                    isSelected
                      ? "bg-amber-50 text-amber-800"
                      : "text-gray-700 hover:bg-gray-50"
                  )}
                  role="option"
                  aria-selected={isSelected}
                >
                  {showFlags && <span className="text-lg">{lang.flag}</span>}
                  <span className="flex-1">
                    <span className="block font-medium">
                      {showNativeNames ? lang.nativeName : lang.name}
                    </span>
                    {showNativeNames && (
                      <span className="block text-xs text-gray-500">
                        {lang.name}
                      </span>
                    )}
                  </span>
                  {isSelected && (
                    <Check className="w-4 h-4 text-amber-600" />
                  )}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/**
 * Compact language switcher for mobile or footer
 */
export function CompactLanguageSwitcher({ className }: { className?: string }) {
  return (
    <LanguageSwitcher
      className={className}
      variant="minimal"
      showFlags={true}
      showNativeNames={false}
    />
  );
}

/**
 * Footer language switcher with inline style
 */
export function FooterLanguageSwitcher({ className }: { className?: string }) {
  return (
    <LanguageSwitcher
      className={className}
      variant="inline"
      showFlags={true}
      showNativeNames={true}
    />
  );
}

export default LanguageSwitcher;
