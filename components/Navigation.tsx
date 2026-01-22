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
  MessageSquare,
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
    key: "messages",
    href: "/messages",
    icon: MessageSquare,
    descriptionKey: "messagesDescription",
  },
  {
    key: "browse",
    href: "/browse",
    icon: Search,
    descriptionKey: "browseDescription",
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
      {/* Desktop Navigation */}
      <nav
        className="hidden md:block fixed top-6 left-1/2 transform -translate-x-1/2 z-50"
        aria-label={t("navigation.mainLabel")}
      >
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="bg-white/90 backdrop-blur-md rounded-full border border-amber-200 shadow-lg px-4 py-3"
        >
          <div className="flex items-center">
            <ul
              className="flex items-center space-x-0.5 list-none m-0 p-0"
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
                        "relative px-3 py-2 rounded-full transition-all duration-200 flex items-center gap-1.5 hover:scale-105 active:scale-95",
                        isActive
                          ? "bg-amber-100 text-amber-700"
                          : "text-gray-600 hover:text-amber-600 hover:bg-amber-50",
                      )}
                    >
                      <Icon className="w-4 h-4" aria-hidden="true" />
                      <span className="text-sm font-medium">{label}</span>
                      {isActive && (
                        <motion.div
                          layoutId="activeTab"
                          className="absolute inset-0 bg-amber-100 rounded-full -z-10"
                          transition={{ type: "spring", duration: 0.3 }}
                        />
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>

            {/* Theme toggle, language switcher and offline status indicator */}
            <div className="flex items-center gap-2 ml-3 pl-3 border-l border-amber-200">
              <Button
                variant="ghost"
                size="sm"
                onClick={() =>
                  isAuthenticated ? startSignOut() : startGoogleSignIn()
                }
                className="text-gray-600 hover:text-amber-600"
                aria-label={
                  isAuthenticated
                    ? t("navigation.signOut")
                    : t("auth.signInWithGoogle")
                }
              >
                {isAuthenticated ? (
                  <>
                    <LogOut className="w-4 h-4 mr-1" />
                    {t("navigation.signOut")}
                  </>
                ) : (
                  <>
                    <LogIn className="w-4 h-4 mr-1" />
                    {t("navigation.signIn")}
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

      {/* Mobile Navigation */}
      <div className="md:hidden">
        {/* Hamburger menu button - 44x44px minimum touch target */}
        <Button
          variant="outline"
          size="icon"
          onClick={() => setIsOpen(!isOpen)}
          className="fixed top-4 right-4 z-50 bg-white/90 backdrop-blur-md border-amber-200 hover:bg-amber-50 w-11 h-11 min-w-[44px] min-h-[44px]"
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
                <X className="w-5 h-5" />
              </motion.div>
            ) : (
              <motion.div
                key="menu"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Menu className="w-5 h-5" />
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
                className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
                onClick={() => setIsOpen(false)}
              />
              <motion.div
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="fixed top-0 right-0 h-full w-80 bg-white/95 backdrop-blur-md border-l border-amber-200 shadow-xl z-50 p-6"
                id="mobile-navigation-menu"
                role="dialog"
                aria-modal="true"
                aria-label={t("navigation.menuLabel")}
              >
                <nav aria-label={t("navigation.mobileLabel")}>
                  <ul className="mt-16 space-y-4 list-none m-0 p-0">
                    {navigationItems.map((item, index) => {
                      const Icon = item.icon;
                      const localizedHref = getLocalizedHref(item.href);
                      const isActive = pathname === localizedHref;
                      const label = t(`navigation.${item.key}`);
                      const description = t(`navigation.${item.descriptionKey}`);

                      return (
                        <li
                          key={item.href}
                          className="animate-in slide-in-from-right-4 duration-300"
                          style={{ animationDelay: `${index * 50}ms` }}
                        >
                          <Link
                            href={localizedHref}
                            onClick={() => setIsOpen(false)}
                            aria-current={isActive ? "page" : undefined}
                            className={cn(
                              "flex items-center gap-4 p-4 rounded-lg transition-all duration-200 min-h-[56px]",
                              isActive
                                ? "bg-amber-100 text-amber-700 border border-amber-200"
                                : "text-gray-600 hover:text-amber-600 hover:bg-amber-50",
                            )}
                          >
                            <Icon className="w-5 h-5" aria-hidden="true" />
                            <div>
                              <div className="font-medium">{label}</div>
                              <div className="text-sm opacity-70">
                                {description}
                              </div>
                            </div>
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </nav>

                {/* Mobile bottom decoration */}
                <div className="absolute bottom-6 left-6 right-6">
                  {/* Language Switcher for Mobile */}
                  <div className="mb-4 flex justify-center">
                    <CompactLanguageSwitcher />
                  </div>
                  <div className="mb-6">
                    <Button
                      variant="outline"
                      className="w-full justify-center border-amber-200 text-amber-700 hover:bg-amber-50"
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
                          {t("navigation.signOut")}
                        </>
                      ) : (
                        <>
                          <LogIn className="w-4 h-4 mr-2" />
                          {t("auth.signInWithGoogle")}
                        </>
                      )}
                    </Button>
                  </div>
                  <div className="text-center">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 8,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                      className="inline-block mb-2"
                    >
                      <Sparkles className="w-6 h-6 text-amber-500" />
                    </motion.div>
                    <p className="text-sm text-gray-500">
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
