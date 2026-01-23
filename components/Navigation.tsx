"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  Home,
  Sparkles,
  Clock,
  ChefHat,
  Search,
  User,
  BookOpen,
  Heart,
  LogIn,
  LogOut,
  CalendarDays,
} from "lucide-react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { OfflineIndicator } from "./OfflineIndicator";
import { ThemeToggle } from "./ThemeToggle";
import { LanguageSwitcher, CompactLanguageSwitcher } from "./LanguageSwitcher";
import {
  startGoogleSignIn,
  startSignOut,
  useAuthSession,
} from "@/lib/auth-client";
import { useLocale } from "@/lib/locale-context";

const navigationItems = [
  {
    key: "home",
    href: "/",
    icon: Home,
    descriptionKey: "homeDescription",
  },
  {
    key: "generator",
    href: "/generator",
    icon: Sparkles,
    descriptionKey: "generatorDescription",
  },
  {
    key: "explore",
    href: "/explore",
    icon: Search,
    descriptionKey: "exploreDescription",
  },
  {
    key: "favorites",
    href: "/favorites",
    icon: Heart,
    descriptionKey: "favoritesDescription",
  },
  {
    key: "calendar",
    href: "/calendar",
    icon: CalendarDays,
    descriptionKey: "calendarDescription",
  },
  {
    key: "history",
    href: "/history",
    icon: Clock,
    descriptionKey: "historyDescription",
  },
  {
    key: "recipes",
    href: "/recipes",
    icon: ChefHat,
    descriptionKey: "recipesDescription",
  },
  {
    key: "blog",
    href: "/blog",
    icon: BookOpen,
    descriptionKey: "blogDescription",
  },
  {
    key: "profile",
    href: "/profile",
    icon: User,
    descriptionKey: "profileDescription",
  },
];

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const { status } = useAuthSession();
  const isAuthenticated = status === "authenticated";
  const { t, getLocalizedHref } = useLocale();

  return (
    <>
      {/* Desktop Navigation - Modern Glassmorphism */}
      <nav
        className="hidden md:block fixed top-6 left-1/2 transform -translate-x-1/2 z-50"
        aria-label={t("navigation.mainLabel")}
      >
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className={cn(
            // Glassmorphism effect
            "bg-white/80 dark:bg-slate-900/80",
            "backdrop-blur-xl backdrop-saturate-150",
            // Border with subtle glow
            "border border-slate-200/50 dark:border-slate-700/50",
            // Shadow
            "shadow-lg shadow-slate-200/50 dark:shadow-slate-900/50",
            // Shape
            "rounded-2xl",
            // Padding
            "px-2 py-2",
          )}
        >
          <div className="flex items-center">
            <ul
              className="flex items-center space-x-1 list-none m-0 p-0"
              role="menubar"
            >
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const localizedHref = getLocalizedHref(item.href);
                const isActive = pathname === localizedHref;
                const label = t(`navigation.${item.key}`);
                const description = t(`navigation.${item.descriptionKey}`);

                return (
                  <li key={item.href} role="none">
                    <Link
                      href={localizedHref}
                      role="menuitem"
                      aria-current={isActive ? "page" : undefined}
                      aria-label={`${label}: ${description}`}
                      className={cn(
                        "relative px-3 py-2 rounded-xl transition-all duration-200 flex items-center gap-1.5",
                        "hover:scale-105 active:scale-95",
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2",
                        isActive
                          ? "text-indigo-700 dark:text-indigo-300"
                          : "text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-300 hover:bg-indigo-50/80 dark:hover:bg-indigo-900/30",
                      )}
                    >
                      <Icon className="w-4 h-4" aria-hidden="true" />
                      <span className="text-sm font-medium font-body">
                        {label}
                      </span>
                      {isActive && (
                        <motion.div
                          layoutId="activeTab"
                          className="absolute inset-0 bg-gradient-to-r from-indigo-100 to-purple-100 dark:from-indigo-900/40 dark:to-purple-900/40 rounded-xl -z-10"
                          transition={{ type: "spring", duration: 0.4 }}
                        />
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>

            {/* Divider */}
            <div className="h-6 w-px bg-slate-200 dark:bg-slate-700 mx-3" />

            {/* Theme toggle, language switcher and actions */}
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() =>
                  isAuthenticated ? startSignOut() : startGoogleSignIn()
                }
                className={cn(
                  "text-slate-600 dark:text-slate-400",
                  "hover:text-indigo-600 dark:hover:text-indigo-300",
                  "hover:bg-indigo-50/80 dark:hover:bg-indigo-900/30",
                  "rounded-xl transition-all duration-200",
                )}
                aria-label={
                  isAuthenticated
                    ? t("navigation.signOut")
                    : t("auth.signInWithGoogle")
                }
              >
                {isAuthenticated ? (
                  <>
                    <LogOut className="w-4 h-4 mr-1.5" />
                    <span className="font-body">{t("navigation.signOut")}</span>
                  </>
                ) : (
                  <>
                    <LogIn className="w-4 h-4 mr-1.5" />
                    <span className="font-body">{t("navigation.signIn")}</span>
                  </>
                )}
              </Button>
              <LanguageSwitcher variant="dropdown" showNativeNames={false} />
              <ThemeToggle />
              <OfflineIndicator />
            </div>
          </div>
        </motion.div>
      </nav>

      {/* Mobile Navigation - Modern Design */}
      <div className="md:hidden">
        {/* Hamburger menu button */}
        <Button
          variant="outline"
          size="icon"
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            "fixed top-4 right-4 z-50",
            "bg-white/80 dark:bg-slate-900/80",
            "backdrop-blur-xl",
            "border-slate-200/50 dark:border-slate-700/50",
            "hover:bg-indigo-50 dark:hover:bg-indigo-900/30",
            "w-12 h-12 min-w-[48px] min-h-[48px]",
            "rounded-xl",
            "shadow-lg shadow-slate-200/50 dark:shadow-slate-900/50",
          )}
          aria-label={
            isOpen ? t("navigation.closeMenu") : t("navigation.openMenu")
          }
          aria-expanded={isOpen}
          aria-controls="mobile-navigation-menu"
        >
          <AnimatePresence mode="wait">
            {isOpen ? (
              <motion.div
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <X className="w-5 h-5 text-slate-600 dark:text-slate-300" />
              </motion.div>
            ) : (
              <motion.div
                key="menu"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Menu className="w-5 h-5 text-slate-600 dark:text-slate-300" />
              </motion.div>
            )}
          </AnimatePresence>
        </Button>

        {/* Mobile menu overlay */}
        <AnimatePresence>
          {isOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-40"
                onClick={() => setIsOpen(false)}
              />
              <motion.div
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className={cn(
                  "fixed top-0 right-0 h-full w-80",
                  "bg-white/95 dark:bg-slate-900/95",
                  "backdrop-blur-xl",
                  "border-l border-slate-200/50 dark:border-slate-700/50",
                  "shadow-2xl",
                  "z-50 p-6",
                )}
                id="mobile-navigation-menu"
                role="dialog"
                aria-modal="true"
                aria-label={t("navigation.menuLabel")}
              >
                <nav aria-label={t("navigation.mobileLabel")}>
                  <ul className="mt-16 space-y-2 list-none m-0 p-0">
                    {navigationItems.map((item, index) => {
                      const Icon = item.icon;
                      const localizedHref = getLocalizedHref(item.href);
                      const isActive = pathname === localizedHref;
                      const label = t(`navigation.${item.key}`);
                      const description = t(
                        `navigation.${item.descriptionKey}`,
                      );

                      return (
                        <motion.li
                          key={item.href}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05, duration: 0.2 }}
                        >
                          <Link
                            href={localizedHref}
                            onClick={() => setIsOpen(false)}
                            aria-current={isActive ? "page" : undefined}
                            className={cn(
                              "flex items-center gap-4 p-4 rounded-xl transition-all duration-200 min-h-[56px]",
                              isActive
                                ? "bg-gradient-to-r from-indigo-100 to-purple-100 dark:from-indigo-900/40 dark:to-purple-900/40 text-indigo-700 dark:text-indigo-300"
                                : "text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-300 hover:bg-indigo-50/80 dark:hover:bg-indigo-900/30",
                            )}
                          >
                            <div
                              className={cn(
                                "w-10 h-10 rounded-xl flex items-center justify-center",
                                isActive
                                  ? "bg-indigo-600 text-white"
                                  : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400",
                              )}
                            >
                              <Icon className="w-5 h-5" aria-hidden="true" />
                            </div>
                            <div>
                              <div className="font-medium font-body">
                                {label}
                              </div>
                              <div className="text-sm opacity-70 font-body">
                                {description}
                              </div>
                            </div>
                          </Link>
                        </motion.li>
                      );
                    })}
                  </ul>
                </nav>

                {/* Mobile bottom section */}
                <div className="absolute bottom-6 left-6 right-6">
                  {/* Language Switcher */}
                  <div className="mb-4 flex justify-center">
                    <CompactLanguageSwitcher />
                  </div>

                  {/* Auth button */}
                  <div className="mb-6">
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-center",
                        "border-indigo-200 dark:border-indigo-700",
                        "text-indigo-700 dark:text-indigo-300",
                        "hover:bg-indigo-50 dark:hover:bg-indigo-900/30",
                        "rounded-xl",
                      )}
                      onClick={() =>
                        isAuthenticated ? startSignOut() : startGoogleSignIn()
                      }
                      aria-label={
                        isAuthenticated
                          ? t("navigation.signOut")
                          : t("auth.signInWithGoogle")
                      }
                    >
                      {isAuthenticated ? (
                        <>
                          <LogOut className="w-4 h-4 mr-2" />
                          <span className="font-body">
                            {t("navigation.signOut")}
                          </span>
                        </>
                      ) : (
                        <>
                          <LogIn className="w-4 h-4 mr-2" />
                          <span className="font-body">
                            {t("auth.signInWithGoogle")}
                          </span>
                        </>
                      )}
                    </Button>
                  </div>

                  {/* Brand footer */}
                  <div className="text-center">
                    <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 mb-2">
                      <Sparkles className="w-5 h-5 text-white" />
                    </div>
                    <p className="text-sm text-slate-500 dark:text-slate-400 font-body">
                      {t("common.siteName")}
                    </p>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
