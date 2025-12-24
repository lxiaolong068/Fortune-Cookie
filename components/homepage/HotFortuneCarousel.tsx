"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Flame, ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import {
  getPopularFortunes,
  type FortuneMessage,
} from "@/lib/fortune-database";
import { cn } from "@/lib/utils";

interface HotFortuneCarouselProps {
  className?: string;
  /** Number of fortunes to display */
  count?: number;
  /** Auto-rotate interval in milliseconds */
  interval?: number;
}

/**
 * HotFortuneCarousel - Displays popular fortunes in a rotating carousel
 *
 * Features:
 * - Auto-rotation with pause on hover
 * - Manual navigation with arrows
 * - Dot indicators
 * - Fade transition animation
 * - Respects prefers-reduced-motion
 */
export function HotFortuneCarousel({
  className,
  count = 5,
  interval = 5000,
}: HotFortuneCarouselProps) {
  const [fortunes] = useState<FortuneMessage[]>(() =>
    getPopularFortunes(count),
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

  return (
    <section
      className={cn("py-8", className)}
      aria-labelledby="hot-fortunes-heading"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="max-w-3xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <Flame className="h-5 w-5 text-orange-500" aria-hidden="true" />
          <h2
            id="hot-fortunes-heading"
            className="text-xl font-semibold text-gray-800"
          >
            Today&apos;s Popular Fortunes
          </h2>
          <Flame className="h-5 w-5 text-orange-500" aria-hidden="true" />
        </div>

        {/* Carousel Container */}
        <div className="relative bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl border border-amber-200 p-6 md:p-8 min-h-[160px]">
          {/* Navigation Arrows */}
          <button
            onClick={goToPrevious}
            className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 hover:bg-white shadow-md transition-all hover:scale-110 focus:outline-none focus:ring-2 focus:ring-amber-400"
            aria-label="Previous fortune"
          >
            <ChevronLeft className="h-5 w-5 text-gray-600" />
          </button>

          <button
            onClick={goToNext}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 hover:bg-white shadow-md transition-all hover:scale-110 focus:outline-none focus:ring-2 focus:ring-amber-400"
            aria-label="Next fortune"
          >
            <ChevronRight className="h-5 w-5 text-gray-600" />
          </button>

          {/* Fortune Content */}
          <div className="px-10 md:px-12">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={prefersReducedMotion ? {} : { opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={prefersReducedMotion ? {} : { opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="text-center"
              >
                {/* Quote marks */}
                <span
                  className="text-4xl text-amber-300 font-serif leading-none"
                  aria-hidden="true"
                >
                  &ldquo;
                </span>

                {/* Fortune message */}
                <blockquote className="text-lg md:text-xl text-gray-700 italic mb-4 px-4">
                  {currentFortune.message}
                </blockquote>

                {/* Category badge */}
                <span className="inline-block px-3 py-1 text-xs font-medium text-amber-700 bg-amber-100 rounded-full capitalize">
                  {currentFortune.category}
                </span>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Pause/Play indicator */}
          <button
            onClick={() => setIsPaused(!isPaused)}
            className="absolute bottom-2 right-2 p-1.5 rounded-full text-gray-400 hover:text-gray-600 hover:bg-white/50 transition-colors focus:outline-none focus:ring-2 focus:ring-amber-400"
            aria-label={isPaused ? "Resume auto-play" : "Pause auto-play"}
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
          className="flex justify-center gap-2 mt-4"
          role="tablist"
          aria-label="Fortune carousel navigation"
        >
          {fortunes.map((_, index) => (
            <button
              key={index}
              onClick={() => goToIndex(index)}
              className={cn(
                "w-2 h-2 rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2",
                index === currentIndex
                  ? "bg-amber-500 w-6"
                  : "bg-amber-200 hover:bg-amber-300",
              )}
              role="tab"
              aria-selected={index === currentIndex}
              aria-label={`Go to fortune ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
