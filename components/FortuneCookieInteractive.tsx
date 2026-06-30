"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { Sparkles, Copy, Twitter, MessageCircle, ArrowRight } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";

type CookieState = "unopened" | "cracking" | "opened";

interface HomeFortune {
  message: string;
  numbers: number[];
}

const STORAGE_KEY = "fc_home_draw_v1";
const CRACK_MS = 1600;

function todayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

/**
 * Interactive homepage fortune cookie — the "trial" of the Generator.
 * One free Oracle draw per day (no login). Falls back to a local fortune if
 * the AI is unavailable so the homepage always delivers something.
 */
export function FortuneCookieInteractive() {
  const [state, setState] = useState<CookieState>("unopened");
  const [fortune, setFortune] = useState<HomeFortune | null>(null);
  const [drewToday, setDrewToday] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  // Delay hydration to ensure LCP is complete, then restore today's draw if any.
  useEffect(() => {
    const init = () => {
      setIsHydrated(true);
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
          const saved = JSON.parse(raw) as { date: string; fortune: HomeFortune };
          if (saved?.date === todayKey() && saved.fortune?.message) {
            setFortune(saved.fortune);
            setDrewToday(true);
            setState("opened");
          }
        }
      } catch {
        // ignore corrupt storage
      }
    };
    if ("requestIdleCallback" in window) {
      window.requestIdleCallback(init, { timeout: 2000 });
    } else {
      setTimeout(init, 100);
    }
  }, []);

  const drawFortune = useCallback(async (): Promise<HomeFortune> => {
    try {
      const res = await fetch("/api/generator", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode: "oracle",
          params: {
            timeHorizon: "today",
            intensity: 3,
            fortuneTypes: ["good", "neutral"],
            quantity: 1,
          },
        }),
      });
      if (res.ok) {
        const json = await res.json();
        const f = json?.data?.fortunes?.[0];
        if (f?.message) {
          return { message: f.message, numbers: f.luckyNumbers ?? [] };
        }
      }
    } catch {
      // fall through to local fallback
    }
    // Fallback: a local fortune so the homepage never breaks.
    const { fortunes } = await import("@/lib/fortune-data");
    const pick = fortunes[Math.floor(Math.random() * fortunes.length)];
    return {
      message: pick?.quote ?? "Something good is on its way to you.",
      numbers: pick?.numbers ?? [],
    };
  }, []);

  const crackCookie = useCallback(async () => {
    if (state !== "unopened") return;
    if (drewToday) {
      setState("opened");
      return;
    }
    setState("cracking");
    const [result] = await Promise.all([drawFortune(), delay(CRACK_MS)]);
    setFortune(result);
    setDrewToday(true);
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ date: todayKey(), fortune: result }),
      );
    } catch {
      // ignore storage failures (private mode)
    }
    setState("opened");
  }, [state, drewToday, drawFortune]);

  const share = useCallback(
    (channel: "copy" | "twitter" | "whatsapp") => {
      if (!fortune) return;
      const text = `🥠 ${fortune.message}`;
      if (channel === "copy") {
        navigator.clipboard?.writeText(text).then(
          () => toast.success("Copied"),
          () => toast.error("Copy failed"),
        );
        return;
      }
      const url =
        channel === "twitter"
          ? `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`
          : `https://wa.me/?text=${encodeURIComponent(text)}`;
      window.open(url, "_blank", "noopener,noreferrer");
    },
    [fortune],
  );

  if (!isHydrated) return null;

  // Unopened: transparent click target over the static cookie.
  if (state === "unopened") {
    return (
      <div className="absolute inset-0 z-20" style={{ pointerEvents: "auto" }}>
        <div className="flex flex-col items-center justify-center min-h-screen p-6">
          <div className="w-full max-w-2xl min-h-[600px] flex flex-col items-center justify-center">
            <button
              onClick={crackCookie}
              className="w-40 h-40 sm:w-32 sm:h-32 cursor-pointer focus:outline-none focus:ring-4 focus:ring-amber-400/50 rounded-full transition-transform hover:scale-105 active:scale-90 touch-manipulation select-none"
              aria-label="Tap to crack open the fortune cookie and reveal your fortune"
              style={{ background: "transparent", WebkitTapHighlightColor: "transparent" }}
            >
              <span className="sr-only">Tap to crack open the fortune cookie</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="absolute inset-0 z-30 flex flex-col items-center justify-center min-h-screen p-6 bg-gradient-to-br from-orange-50/80 to-amber-100/80 backdrop-blur-sm dark:from-slate-900/85 dark:to-slate-900/85">
      <div className="w-full max-w-2xl min-h-[600px] flex flex-col items-center justify-center">
        <AnimatePresence mode="wait">
          {state === "cracking" && (
            <motion.div
              key="cracking"
              initial={{ scale: 1 }}
              animate={{ scale: [1, 1.2, 0.8, 1.1] }}
              transition={{ duration: CRACK_MS / 1000, ease: "easeInOut" }}
              className="flex flex-col items-center"
            >
              <motion.div
                animate={{ rotate: [0, 5, -5, 10, -10, 0] }}
                transition={{ duration: CRACK_MS / 1000, ease: "easeInOut" }}
                className="relative mb-8"
              >
                <div className="relative w-32 h-20">
                  <motion.div
                    animate={{ x: [-16, -24], rotate: [0, -15] }}
                    transition={{ duration: CRACK_MS / 1000, ease: "easeOut" }}
                    className="absolute left-0 w-16 h-20 bg-gradient-to-br from-yellow-200 to-amber-300 rounded-l-full border-2 border-amber-400"
                  />
                  <motion.div
                    animate={{ x: [16, 24], rotate: [0, 15] }}
                    transition={{ duration: CRACK_MS / 1000, ease: "easeOut" }}
                    className="absolute right-0 w-16 h-20 bg-gradient-to-br from-yellow-200 to-amber-300 rounded-r-full border-2 border-amber-400"
                  />
                </div>
              </motion.div>
              <motion.p
                animate={{ opacity: [0, 1, 0.7, 1] }}
                transition={{ duration: CRACK_MS / 1000 }}
                className="text-amber-700 dark:text-amber-300 text-center"
              >
                Cracking open your fortune…
              </motion.p>
            </motion.div>
          )}

          {state === "opened" && fortune && (
            <motion.div
              key="opened"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="w-full max-w-md"
            >
              <Card className="p-6 bg-white/90 backdrop-blur-sm border-amber-200 shadow-xl dark:bg-slate-800/90 dark:border-amber-500/30">
                <div className="text-center mb-5">
                  <Sparkles className="mx-auto mb-3 h-8 w-8 text-amber-500" />
                  <blockquote className="font-serif text-lg leading-relaxed text-slate-800 dark:text-slate-100">
                    “{fortune.message}”
                  </blockquote>
                </div>

                {fortune.numbers.length > 0 && (
                  <div className="mb-5 text-center">
                    <p className="mb-2 text-xs uppercase tracking-wider text-amber-700 dark:text-amber-300">
                      Lucky Numbers
                    </p>
                    <div className="flex flex-wrap justify-center gap-2">
                      {fortune.numbers.map((n, i) => (
                        <span
                          key={`${n}-${i}`}
                          className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-orange-500 text-sm font-medium text-white shadow"
                        >
                          {n}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Share */}
                <div className="mb-5 flex items-center justify-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => share("copy")}
                    aria-label="Copy fortune"
                    className="rounded-full"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => share("twitter")}
                    aria-label="Share on X"
                    className="rounded-full"
                  >
                    <Twitter className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => share("whatsapp")}
                    aria-label="Share on WhatsApp"
                    className="rounded-full"
                  >
                    <MessageCircle className="h-4 w-4" />
                  </Button>
                </div>

                {/* CTA */}
                <Link
                  href="/generator"
                  className="flex w-full items-center justify-center gap-1.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 px-6 py-3 font-medium text-white shadow-lg transition-transform hover:scale-[1.02] active:scale-95"
                >
                  Want more? Try our Generator
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <p className="mt-3 text-center text-xs text-slate-400">
                  Your free daily draw. Come back tomorrow for another.
                </p>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
