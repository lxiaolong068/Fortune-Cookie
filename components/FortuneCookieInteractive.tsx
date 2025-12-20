"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Sparkles, RefreshCw } from "lucide-react";
import type { Fortune } from "@/lib/fortune-data";

type CookieState = "unopened" | "cracking" | "opened";

/**
 * Interactive Fortune Cookie Component
 *
 * This component provides the interactive layer that overlays the static
 * FortuneCookieStatic component. It only activates on user interaction.
 *
 * Key optimizations:
 * - Delayed mount (waits for LCP completion)
 * - Uses CSS transitions for simple hover effects
 * - framer-motion only used for complex state transitions
 * - Positioned absolutely to overlay static content
 */
export function FortuneCookieInteractive() {
  const [state, setState] = useState<CookieState>("unopened");
  const [currentFortune, setCurrentFortune] = useState<Fortune | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);

  // Delay hydration to ensure LCP is complete
  useEffect(() => {
    // Use requestIdleCallback for non-critical hydration
    const scheduleHydration = () => {
      if ("requestIdleCallback" in window) {
        window.requestIdleCallback(
          () => setIsHydrated(true),
          { timeout: 2000 }
        );
      } else {
        // Fallback for Safari
        setTimeout(() => setIsHydrated(true), 100);
      }
    };

    scheduleHydration();
  }, []);

  const crackCookie = useCallback(async () => {
    if (state !== "unopened") return;

    setState("cracking");

    try {
      const { fortunes } = await import("@/lib/fortune-data");

      if (fortunes.length === 0) {
        console.error("No fortunes available");
        setState("unopened");
        return;
      }

      const randomIndex = Math.floor(Math.random() * fortunes.length);
      const randomFortune = fortunes[randomIndex];

      if (!randomFortune) {
        console.error("Failed to select fortune");
        setState("unopened");
        return;
      }

      setCurrentFortune(randomFortune);

      // Show cracking animation for 2 seconds, then reveal fortune
      setTimeout(() => {
        setState("opened");
      }, 2000);
    } catch (error) {
      console.error("Failed to load fortunes:", error);
      setState("unopened");
    }
  }, [state]);

  const getNewCookie = useCallback(() => {
    setState("unopened");
    setCurrentFortune(null);
  }, []);

  // Don't render until hydrated (LCP complete)
  if (!isHydrated) {
    return null;
  }

  // In unopened state, render a transparent click target over the static cookie
  if (state === "unopened") {
    return (
      <div
        className="absolute inset-0 z-20"
        style={{ pointerEvents: "auto" }}
      >
        {/* Invisible click target positioned over static cookie */}
        <div className="flex flex-col items-center justify-center min-h-screen p-6">
          <div className="w-full max-w-2xl min-h-[600px] flex flex-col items-center justify-center">
            <button
              onClick={crackCookie}
              className="w-32 h-32 cursor-pointer focus:outline-none focus:ring-4 focus:ring-amber-400/50 rounded-full transition-transform hover:scale-105 active:scale-95"
              aria-label="Crack open the fortune cookie to reveal your fortune"
              style={{ background: "transparent" }}
            >
              <span className="sr-only">Click to crack open the fortune cookie</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Cracking and opened states use full framer-motion animations
  return (
    <div className="absolute inset-0 z-30 flex flex-col items-center justify-center min-h-screen p-6 bg-gradient-to-br from-orange-50/80 to-amber-100/80 backdrop-blur-sm">
      <div className="w-full max-w-2xl min-h-[600px] flex flex-col items-center justify-center">
        <AnimatePresence mode="wait">
          {state === "cracking" && (
            <motion.div
              key="cracking"
              initial={{ scale: 1 }}
              animate={{ scale: [1, 1.2, 0.8, 1.1] }}
              transition={{ duration: 2, ease: "easeInOut" }}
              className="flex flex-col items-center"
            >
              <motion.div
                animate={{
                  rotate: [0, 5, -5, 10, -10, 0],
                  scale: [1, 1.1, 0.9, 1.05, 0.95, 1],
                }}
                transition={{ duration: 2, ease: "easeInOut" }}
                className="relative mb-8"
              >
                {/* Cracking cookie with split effect */}
                <div className="relative w-32 h-20">
                  {/* Left half */}
                  <motion.div
                    animate={{ x: [-16, -24], rotate: [0, -15] }}
                    transition={{ duration: 2, ease: "easeOut" }}
                    className="absolute left-0 w-16 h-20 bg-gradient-to-br from-yellow-200 to-amber-300 rounded-l-full border-2 border-amber-400 overflow-hidden"
                  >
                    <div className="absolute inset-1 border border-amber-500/30 rounded-l-full" />
                  </motion.div>

                  {/* Right half */}
                  <motion.div
                    animate={{ x: [16, 24], rotate: [0, 15] }}
                    transition={{ duration: 2, ease: "easeOut" }}
                    className="absolute right-0 w-16 h-20 bg-gradient-to-br from-yellow-200 to-amber-300 rounded-r-full border-2 border-amber-400 overflow-hidden"
                  >
                    <div className="absolute inset-1 border border-amber-500/30 rounded-r-full" />
                  </motion.div>

                  {/* Cracking particles */}
                  {[...Array(8)].map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{
                        opacity: [0, 1, 0],
                        scale: [0, 1, 0],
                        x: [0, (Math.random() - 0.5) * 100],
                        y: [0, (Math.random() - 0.5) * 100],
                      }}
                      transition={{
                        duration: 1.5,
                        delay: i * 0.1,
                        ease: "easeOut",
                      }}
                      className="absolute top-1/2 left-1/2 w-2 h-2 bg-amber-300 rounded-full"
                    />
                  ))}
                </div>
              </motion.div>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 1, 0.7, 1] }}
                transition={{ duration: 2 }}
                className="text-amber-700 text-center"
              >
                Cracking open your fortune...
              </motion.p>
            </motion.div>
          )}

          {state === "opened" && currentFortune && (
            <motion.div
              key="opened"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 30,
                delay: 0.2,
              }}
              className="w-full max-w-md"
            >
              <Card className="p-6 bg-white/90 backdrop-blur-sm border-amber-200 shadow-xl">
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="text-center mb-6 relative"
                >
                  {/* Magical glow background */}
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 0.3 }}
                    transition={{ delay: 0.6, duration: 1 }}
                    className="absolute inset-0 bg-gradient-to-r from-amber-200/50 via-yellow-200/50 to-orange-200/50 rounded-full blur-xl"
                  />

                  {/* Main sparkle with rotation */}
                  <motion.div
                    initial={{ scale: 0, rotate: 0 }}
                    animate={{
                      scale: [0, 1.2, 1],
                      rotate: 360,
                    }}
                    transition={{
                      scale: {
                        delay: 0.5,
                        duration: 0.8,
                        ease: "backOut",
                      },
                      rotate: {
                        delay: 0.7,
                        duration: 3,
                        repeat: Infinity,
                        ease: "linear",
                      },
                    }}
                    className="inline-block mb-4 relative z-10"
                  >
                    <Sparkles className="w-10 h-10 text-amber-500 drop-shadow-2xl" />
                  </motion.div>

                  {/* Title */}
                  <motion.h2
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{
                      delay: 0.7,
                      duration: 0.6,
                      ease: "backOut",
                    }}
                    className="text-2xl mb-4 bg-gradient-to-r from-amber-600 via-yellow-600 to-orange-600 bg-clip-text text-transparent relative z-10"
                  >
                    Your Fortune
                  </motion.h2>
                </motion.div>

                <motion.blockquote
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="text-center text-gray-700 mb-6 italic leading-relaxed"
                >
                  &ldquo;{currentFortune.quote}&rdquo;
                </motion.blockquote>

                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.8 }}
                  className="text-center mb-6"
                >
                  <h3 className="text-sm text-amber-700 mb-3">
                    Your Lucky Numbers
                  </h3>
                  <div className="flex justify-center gap-2 flex-wrap">
                    {currentFortune.numbers.map((number, index) => (
                      <motion.div
                        key={number}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{
                          delay: 1 + index * 0.1,
                          type: "spring",
                          stiffness: 500,
                          damping: 25,
                        }}
                        className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center shadow-md"
                      >
                        <span className="text-white font-medium text-sm">
                          {number}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 1.5 }}
                  className="text-center"
                >
                  <Button
                    onClick={getNewCookie}
                    className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white px-6 py-2 rounded-full shadow-lg transform transition-all duration-200 hover:scale-105"
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Get Another Fortune
                  </Button>
                </motion.div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
