"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import {
  Sparkles,
  Copy,
  ArrowRight,
  ImageDown,
  Share2,
  RefreshCw,
} from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { QuotaGateCard, type QuotaGateVariant } from "./QuotaGateCard";
import {
  buildShareCardUrl,
  shareOrDownloadCard,
  downloadCard,
  prefetchShareCard,
} from "@/lib/share-card";
import { startGoogleSignIn } from "@/lib/auth-client";
import { withClientId } from "@/lib/client-id";
import {
  extractQuota,
  isUnlimitedRemaining,
  type QuotaInfo,
} from "@/lib/quota-client";
import { getSiteUrl } from "@/lib/site";
import { trackEvent } from "@/lib/track";
import { cn } from "@/lib/utils";

/**
 * Canonical site link used in share/clipboard text. Read from the public env
 * var (not hardcoded) so staging builds never ship a production URL.
 */
const SHARE_URL = getSiteUrl();

type CookieState = "unopened" | "cracking" | "opened";

interface HomeFortune {
  message: string;
  numbers: number[];
}

/**
 * Quota scope for a draw. The first tap of the day spends the "home" scope
 * (guest: 1/day); every "Crack another" spends the "generator" scope
 * (guest: 3/day), which is what makes an instant second draw possible.
 */
type DrawScope = "home" | "generator";

type DrawOutcome =
  | {
      kind: "fortune";
      fortune: HomeFortune;
      remaining: number | null;
      /**
       * True when the API never produced a fortune and we served one from the
       * local bundle. Reported to GA4 so a silent AI outage shows up as a shift
       * in fallback rate instead of as an unexplained drop in engagement.
       */
      isFallback: boolean;
    }
  | { kind: "quota"; quota: QuotaInfo; message?: string };

const STORAGE_KEY = "fc_home_draw_v1";
const CRACK_MS = 1600;

function todayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

interface SavedDraw {
  date: string;
  fortune: HomeFortune;
  /**
   * Snapshot of the server's `remaining` at the time of the draw. It is only a
   * hint for rendering the "N fortunes left today" line and disabling "Crack
   * another" after a reload — it is NOT authoritative: it is per-device, so a
   * user on two browsers (or in another tab) will see it drift from the real
   * server counter. The server is still the only thing that can grant a draw;
   * a stale optimistic value at worst costs one extra 429.
   */
  remaining?: number | null;
}

function persistDraw(fortune: HomeFortune, remaining: number | null): void {
  try {
    const payload: SavedDraw = { date: todayKey(), fortune, remaining };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch {
    // ignore storage failures (private mode)
  }
}

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
  const [quotaGate, setQuotaGate] = useState<QuotaInfo | null>(null);
  const [quotaMessage, setQuotaMessage] = useState<string | undefined>();
  // Which limit was hit: the one-a-day homepage cookie, or the AI generator
  // allowance spent by "Crack another". They need different copy.
  const [quotaVariant, setQuotaVariant] =
    useState<QuotaGateVariant>("generator");
  const [drawsLeft, setDrawsLeft] = useState<number | null>(null);
  const [canWebShare, setCanWebShare] = useState(false);

  // Feature-detect file sharing once: decides whether the primary share button
  // opens the system share sheet or falls back to saving the image.
  useEffect(() => {
    try {
      const nav = navigator as unknown as {
        canShare?: (data: { files: File[] }) => boolean;
        share?: unknown;
      };
      const probe = new File([new Blob([""], { type: "image/png" })], "p.png", {
        type: "image/png",
      });
      const shareable =
        typeof nav.share === "function" &&
        typeof nav.canShare === "function" &&
        nav.canShare({ files: [probe] });
      setCanWebShare(Boolean(shareable));
    } catch {
      setCanWebShare(false);
    }
  }, []);

  // Delay hydration to ensure LCP is complete, then restore today's draw if any.
  useEffect(() => {
    const init = () => {
      setIsHydrated(true);
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
          const saved = JSON.parse(raw) as SavedDraw;
          // The date guard is what makes the snapshot safe: anything written
          // before the current UTC day is discarded wholesale, so a stale
          // "0 left" can never survive the midnight reset.
          if (saved?.date === todayKey() && saved.fortune?.message) {
            setFortune(saved.fortune);
            setDrewToday(true);
            if (typeof saved.remaining === "number") {
              setDrawsLeft(saved.remaining);
            }
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

  const drawFortune = useCallback(
    async (scope: DrawScope): Promise<DrawOutcome> => {
      try {
        const res = await fetch("/api/generator", {
          method: "POST",
          headers: withClientId({ "Content-Type": "application/json" }),
          body: JSON.stringify({
            mode: "oracle",
            source: scope,
            params: {
              timeHorizon: "today",
              intensity: 3,
              fortuneTypes: ["good", "neutral"],
              quantity: 1,
            },
          }),
        });
        const json = await res.json().catch(() => null);

        // Daily limit is the one failure we must NOT paper over with a local
        // fortune — the user needs the sign-in card instead.
        if (res.status === 429) {
          const quota = extractQuota(json);
          if (quota) {
            return {
              kind: "quota",
              quota,
              message:
                typeof json?.error === "string" ? json.error : undefined,
            };
          }
        }

        if (res.ok) {
          const f = json?.data?.fortunes?.[0];
          if (f?.message) {
            const quota = extractQuota(json);
            return {
              kind: "fortune",
              fortune: { message: f.message, numbers: f.luckyNumbers ?? [] },
              remaining: quota ? quota.remaining : null,
              isFallback: false,
            };
          }
        }
      } catch {
        // fall through to local fallback
      }
      // Fallback: a local fortune so the homepage never breaks.
      const { fortunes } = await import("@/lib/fortune-data");
      const pick = fortunes[Math.floor(Math.random() * fortunes.length)];
      return {
        kind: "fortune",
        fortune: {
          message: pick?.quote ?? "Something good is on its way to you.",
          numbers: pick?.numbers ?? [],
        },
        remaining: null,
        isFallback: true,
      };
    },
    [],
  );

  const crackCookie = useCallback(async () => {
    if (state !== "unopened") return;
    if (drewToday) {
      setState("opened");
      return;
    }
    setState("cracking");
    const [outcome] = await Promise.all([drawFortune("home"), delay(CRACK_MS)]);
    if (outcome.kind === "quota") {
      setQuotaGate(outcome.quota);
      setQuotaMessage(outcome.message);
      setQuotaVariant("daily");
      setState("opened");
      return;
    }
    // Fired on reveal, not on tap: a draw that ends in the quota gate above is
    // not a cracked cookie and must not inflate this count.
    trackEvent("cookie_cracked", {
      source: "home",
      is_fallback: outcome.isFallback,
    });
    setFortune(outcome.fortune);
    setDrewToday(true);
    // `remaining` here belongs to the *home* scope; "Crack another" spends the
    // generator scope, so it says nothing about whether another draw is
    // possible. Persist null and let the first "Crack another" fill it in.
    persistDraw(outcome.fortune, null);
    setState("opened");
  }, [state, drewToday, drawFortune]);

  /**
   * Replay the crack animation in place with a fresh fortune. Deliberately
   * spends the "generator" scope: the "home" scope is capped at 1/day for
   * guests, so reusing it would block the second draw immediately.
   */
  const crackAnother = useCallback(async () => {
    if (state !== "opened") return;
    // Intent, reported before the request: `draws_left` is the count the user
    // saw when they decided to click, which is the number the funnel needs.
    // A click that ends in a 429 still counts as intent — that gap between
    // `crack_another_clicked` and `cookie_cracked` is the signal.
    trackEvent("crack_another_clicked", { draws_left: drawsLeft });
    setQuotaGate(null);
    setQuotaMessage(undefined);
    setState("cracking");
    const [outcome] = await Promise.all([
      drawFortune("generator"),
      delay(CRACK_MS),
    ]);
    if (outcome.kind === "quota") {
      setQuotaGate(outcome.quota);
      setQuotaMessage(outcome.message);
      setQuotaVariant("generator");
      setDrawsLeft(outcome.quota.remaining);
      // Keep the snapshot in step with the server's verdict so a reload does
      // not offer a draw we already know is refused.
      if (fortune) persistDraw(fortune, outcome.quota.remaining);
      setState("opened");
      return;
    }
    // "generator", matching the scope this draw actually spent. Reporting
    // "home" here would collapse first-draw and repeat-draw into one bucket
    // and make the Crack another funnel unreadable.
    trackEvent("cookie_cracked", {
      source: "generator",
      is_fallback: outcome.isFallback,
    });
    setFortune(outcome.fortune);
    setDrawsLeft(outcome.remaining);
    persistDraw(outcome.fortune, outcome.remaining);
    setState("opened");
  }, [state, drawFortune, fortune, drawsLeft]);

  const copyFortune = useCallback(() => {
    if (!fortune) return;
    // Straight ASCII quotes on purpose: this string lands in arbitrary paste
    // targets (SMS, notes, terminals) where curly quotes can mangle. The
    // fortune itself is never re-escaped — it is plain text, not markup.
    const text = `"${fortune.message}" — apparently. Tell me yours: ${SHARE_URL}`;
    trackEvent("share_clicked", { method: "copy", surface: "home" });
    navigator.clipboard?.writeText(text).then(
      () => {
        // Clipboard has no "cancelled" state: resolve means it landed.
        trackEvent("share_completed", {
          method: "copy",
          result: "copied",
          surface: "home",
        });
        toast.success("Copied");
      },
      // A rejected write is a failure, not a completion — stay silent so the
      // completion rate is not inflated by permission errors.
      () => toast.error("Copy failed"),
    );
  }, [fortune]);

  const cardUrl = useCallback(() => {
    if (!fortune) return null;
    return buildShareCardUrl({
      message: fortune.message,
      luckyNumbers: fortune.numbers,
      category: "Oracle",
      emoji: "🔮",
    });
  }, [fortune]);

  /**
   * Warm the share-card blob as soon as a fortune is on screen. iOS Safari
   * invalidates the user gesture across an `await fetch(...)`, so the image has
   * to be in hand *before* the tap for navigator.share() to be allowed.
   * Deliberately fire-and-forget: a failed prefetch just means the share path
   * fetches inline (still correct on desktop), so there is nothing to report.
   */
  useEffect(() => {
    if (state !== "opened" || !fortune) return;
    const url = cardUrl();
    if (url) void prefetchShareCard(url);
  }, [state, fortune, cardUrl]);

  /** Primary action: system share sheet when available, else save the image. */
  const sendToFriends = useCallback(async () => {
    const url = cardUrl();
    if (!url || !fortune) return;
    // The primary button is only a *share* where the Web Share API exists;
    // elsewhere it is labelled "Save image" and does exactly that. Reporting it
    // as "share" regardless would quietly book every desktop download as a
    // share and make the method breakdown a lie.
    const method = canWebShare ? "share" : "save";
    trackEvent("share_clicked", { method, surface: "home" });
    // The rendered card already carries the fortune text, so the share body is
    // pure invitation — no duplicated quote next to the image.
    const result = await shareOrDownloadCard(
      url,
      `Reply with yours. I need to know it does this to everyone. ${SHARE_URL}`,
    );
    // `cancelled` is reported on purpose: "opened the share sheet and backed
    // out" and "never tapped share" are completely different signals, and only
    // this event can tell them apart. `downloaded`/`opened` mean the Web Share
    // path was unavailable and we degraded — worth seeing separately.
    trackEvent("share_completed", { method, result, surface: "home" });
    if (result === "downloaded") toast.success("Image saved");
  }, [cardUrl, fortune, canWebShare]);

  const saveImage = useCallback(async () => {
    const url = cardUrl();
    if (!url) return;
    trackEvent("share_clicked", { method: "save", surface: "home" });
    const result = await downloadCard(url);
    trackEvent("share_completed", { method: "save", result, surface: "home" });
    if (result === "downloaded") toast.success("Image saved");
  }, [cardUrl]);

  // Single source of truth for "is another draw still possible" — the button
  // and the caption below it must never disagree.
  // `null` = unknown (first draw of the session, or a local fallback fortune):
  // let the user try, the server is the real gate.
  // A sentinel-large value means unlimited (Premium / signed-in home scope) and
  // must never be rendered as a number.
  const unlimited = isUnlimitedRemaining(drawsLeft);
  const canDrawAgain = drawsLeft === null || unlimited || drawsLeft > 0;

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
                Reading them.
              </motion.p>
            </motion.div>
          )}

          {state === "opened" && (fortune || quotaGate) && (
            <motion.div
              key="opened"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="w-full max-w-md space-y-4"
            >
              {quotaGate && (
                <QuotaGateCard
                  quota={quotaGate}
                  message={quotaMessage}
                  variant={quotaVariant}
                  /* No onSaveImage here: the fortune card right below already
                     renders a "Save image" button, and two identical actions on
                     one screen just makes the user pick between twins. */
                />
              )}

              {fortune && (
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

                {/* Share — labelled primary action, icon-only circles removed */}
                <div className="mb-5 space-y-2">
                  <Button
                    onClick={sendToFriends}
                    className="h-12 w-full rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-base font-semibold text-white shadow-lg transition-transform hover:from-amber-600 hover:to-orange-600 active:scale-95"
                  >
                    {canWebShare ? (
                      <>
                        <Share2 className="mr-2 h-5 w-5" aria-hidden="true" />
                        Send to friends
                      </>
                    ) : (
                      <>
                        <ImageDown className="mr-2 h-5 w-5" aria-hidden="true" />
                        Save image
                      </>
                    )}
                  </Button>
                  <div className="grid grid-cols-2 gap-2">
                    {canWebShare && (
                      <Button
                        variant="outline"
                        onClick={saveImage}
                        className="h-11 rounded-full"
                      >
                        <ImageDown className="mr-1.5 h-4 w-4" aria-hidden="true" />
                        Save image
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      onClick={copyFortune}
                      className={cn(
                        "h-11 rounded-full",
                        !canWebShare && "col-span-2",
                      )}
                    >
                      <Copy className="mr-1.5 h-4 w-4" aria-hidden="true" />
                      Copy
                    </Button>
                  </div>
                </div>

                {/* Primary retention CTA: another draw, in place. Once the
                    allowance is spent it becomes a sign-in CTA instead — an
                    enabled button that is guaranteed to 429 after a 1.6s crack
                    animation is worse than no button. */}
                {!quotaGate &&
                  (canDrawAgain ? (
                    <Button
                      onClick={crackAnother}
                      className="h-12 w-full rounded-full border-2 border-amber-400 bg-amber-50 text-base font-semibold text-amber-800 shadow-sm transition-transform hover:bg-amber-100 active:scale-95 dark:border-amber-500/60 dark:bg-amber-500/15 dark:text-amber-200 dark:hover:bg-amber-500/25"
                    >
                      <RefreshCw className="mr-2 h-5 w-5" aria-hidden="true" />
                      Crack another
                    </Button>
                  ) : (
                    <Button
                      onClick={() => {
                        // Same intent as the gate card's button, different
                        // surface: this one replaces "Crack another" once the
                        // allowance is spent, without a gate card on screen.
                        // Tagged distinctly so the two are comparable, not
                        // merged.
                        trackEvent("signin_from_gate", {
                          variant: "home_inline",
                        });
                        startGoogleSignIn();
                      }}
                      className="h-12 w-full rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-base font-semibold text-white shadow-lg hover:from-amber-600 hover:to-orange-600 active:scale-95"
                    >
                      Sign in with Google
                    </Button>
                  ))}

                <div className="mt-3 text-center">
                  <Link
                    href="/generator"
                    className="inline-flex min-h-[44px] items-center justify-center gap-1 px-3 text-sm font-medium text-amber-700 underline-offset-4 hover:underline dark:text-amber-300"
                  >
                    Customize it
                    <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </Link>
                </div>

                {/* Suppressed while the gate card is up: it already states the
                    limit, and this line would invite a "Crack another" button
                    that is no longer rendered.
                    Wording locked to the site-wide vocabulary: "fortunes",
                    "a day", never "draws" / "credits". */}
                {!quotaGate && (
                  <p className="mt-1 text-center text-xs text-slate-400">
                    {unlimited
                      ? "Unlimited today."
                      : drawsLeft === null
                        ? "One free fortune a day. Crack another for a fresh one."
                        : canDrawAgain
                          ? `${drawsLeft} free ${drawsLeft === 1 ? "fortune" : "fortunes"} left today.`
                          : "That was your last free fortune today. Sign in with Google for more."}
                  </p>
                )}
              </Card>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
