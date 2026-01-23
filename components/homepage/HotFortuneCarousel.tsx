"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Flame,
  ChevronLeft,
  ChevronRight,
  Pause,
  Play,
  Quote,
} from "lucide-react";
import {
  getPopularFortunes,
  localizeFortunes,
  type FortuneMessage,
} from "@/lib/fortune-database";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/lib/locale-context";
import {
  allCategories,
  categoryConfig,
  type FortuneCategory,
} from "@/lib/category-config";

interface HotFortuneCarouselProps {
  className?: string;
  /** Number of fortunes to display */
  count?: number;
  /** Auto-rotate interval in milliseconds */
  interval?: number;
}

/**
 * HotFortuneCarousel - Modern carousel displaying popular fortunes
 *
 * Features:
 * - Auto-rotation with pause on hover
 * - Manual navigation with arrows
 * - Dot indicators
 * - Smooth fade transitions
 * - Respects prefers-reduced-motion
 */
export function HotFortuneCarousel({
  className,
  count = 5,
  interval = 5000,
}: HotFortuneCarouselProps) {
  const { t, locale } = useTranslation();
  const fortunes = useMemo<FortuneMessage[]>(
    () => localizeFortunes(getPopularFortunes(count), locale),
    [count, locale],
  );
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  // Check for reduced motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  // Auto-rotation
  useEffect(() => {
    if (isPaused || prefersReducedMotion) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % fortunes.length);
    }, interval);

    return () => clearInterval(timer);
  }, [isPaused, prefersReducedMotion, fortunes.length, interval]);

  const goToPrevious = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + fortunes.length) % fortunes.length);
  }, [fortunes.length]);

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % fortunes.length);
  }, [fortunes.length]);

  const goToIndex = useCallback((index: number) => {
    setCurrentIndex(index);
  }, []);

  const currentFortune = fortunes[currentIndex];

  if (fortunes.length === 0 || !currentFortune) return null;

  const categoryKey = currentFortune.category as FortuneCategory;
  const config = allCategories.includes(categoryKey)
    ? categoryConfig[categoryKey]
    : null;
  const localizedCategory = config
    ? t(`generator.themes.${categoryKey}`)
    : currentFortune.category;

  return (
    <section
      className={cn("py-12 px-4", className)}
      aria-labelledby="hot-fortunes-heading"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center shadow-lg">
            <Flame className="h-5 w-5 text-white" aria-hidden="true" />
          </div>
          <h2
            id="hot-fortunes-heading"
            className="text-2xl md:text-3xl font-heading font-bold text-slate-800 dark:text-slate-100"
          >
            {t("home.hotFortunesTitle")}
          </h2>
        </div>

        {/* Carousel Container - Modern Card Design */}
        <div
          className={cn(
            "relative",
            "bg-white dark:bg-slate-800/50",
            "rounded-3xl",
            "border border-slate-100 dark:border-slate-700/50",
            "shadow-card",
            "overflow-hidden",
          )}
        >
          {/* Decorative gradient bar */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-orange-500" />

          {/* Navigation Arrows */}
          <button
            onClick={goToPrevious}
            className={cn(
              "absolute left-4 top-1/2 -translate-y-1/2 z-10",
              "w-10 h-10 rounded-xl",
              "bg-white/90 dark:bg-slate-700/90",
              "border border-slate-200 dark:border-slate-600",
              "shadow-soft hover:shadow-lg",
              "flex items-center justify-center",
              "transition-all duration-200",
              "hover:scale-110 hover:bg-white dark:hover:bg-slate-700",
              "focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500",
            )}
            aria-label={t("common.previousFortune")}
          >
            <ChevronLeft className="h-5 w-5 text-slate-600 dark:text-slate-300" />
          </button>

          <button
            onClick={goToNext}
            className={cn(
              "absolute right-4 top-1/2 -translate-y-1/2 z-10",
              "w-10 h-10 rounded-xl",
              "bg-white/90 dark:bg-slate-700/90",
              "border border-slate-200 dark:border-slate-600",
              "shadow-soft hover:shadow-lg",
              "flex items-center justify-center",
              "transition-all duration-200",
              "hover:scale-110 hover:bg-white dark:hover:bg-slate-700",
              "focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500",
            )}
            aria-label={t("common.nextFortune")}
          >
            <ChevronRight className="h-5 w-5 text-slate-600 dark:text-slate-300" />
          </button>

          {/* Fortune Content */}
          <div className="px-16 md:px-20 py-12 min-h-[200px] flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={prefersReducedMotion ? {} : { opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={prefersReducedMotion ? {} : { opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="text-center max-w-2xl"
              >
                {/* Quote icon */}
                <Quote
                  className="w-8 h-8 mx-auto mb-4 text-indigo-300 dark:text-indigo-500"
                  aria-hidden="true"
                />

                {/* Fortune message */}
                <blockquote className="text-xl md:text-2xl text-slate-700 dark:text-slate-200 font-body leading-relaxed mb-6">
                  {currentFortune.message}
                </blockquote>

                {/* Category badge */}
                {config && (
                  <span
                    className={cn(
                      "inline-flex items-center gap-2 px-4 py-2 rounded-full",
                      "text-sm font-medium font-body capitalize",
                      "bg-gradient-to-r",
                      config.gradientFrom,
                      config.gradientTo,
                      "text-white shadow-sm",
                    )}
                  >
                    <config.icon className="w-4 h-4" aria-hidden="true" />
                    {localizedCategory}
                  </span>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Pause/Play indicator */}
          <button
            onClick={() => setIsPaused(!isPaused)}
            className={cn(
              "absolute bottom-4 right-4",
              "w-8 h-8 rounded-lg",
              "bg-slate-100 dark:bg-slate-700",
              "flex items-center justify-center",
              "text-slate-500 dark:text-slate-400",
              "hover:text-slate-700 dark:hover:text-slate-200",
              "hover:bg-slate-200 dark:hover:bg-slate-600",
              "transition-all duration-200",
              "focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500",
            )}
            aria-label={
              isPaused ? t("common.resumeAutoPlay") : t("common.pauseAutoPlay")
            }
          >
            {isPaused ? (
              <Play className="h-4 w-4" />
            ) : (
              <Pause className="h-4 w-4" />
            )}
          </button>
        </div>

        {/* Dot Indicators */}
        <div
          className="flex justify-center gap-2 mt-6"
          role="tablist"
          aria-label={t("common.carouselNavigation")}
        >
          {fortunes.map((_, index) => (
            <button
              key={index}
              onClick={() => goToIndex(index)}
              className={cn(
                "h-2 rounded-full transition-all duration-300",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2",
                index === currentIndex
                  ? "bg-gradient-to-r from-indigo-500 to-purple-500 w-8"
                  : "bg-slate-200 dark:bg-slate-700 w-2 hover:bg-slate-300 dark:hover:bg-slate-600",
              )}
              role="tab"
              aria-selected={index === currentIndex}
              aria-label={t("common.goToFortune", { index: index + 1 })}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
