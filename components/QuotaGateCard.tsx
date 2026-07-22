"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Sparkles, Clock, ImageDown, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { startGoogleSignIn } from "@/lib/auth-client";
import { trackEvent } from "@/lib/track";
import {
  formatResetIn,
  GUEST_GENERATOR_DAILY_LIMIT,
  SIGNED_IN_DAILY_LIMIT,
  type QuotaInfo,
} from "@/lib/quota-client";
import { cn } from "@/lib/utils";

/**
 * Which limit was hit:
 * - "generator" — the AI generator allowance (guest 3/day, signed in 10/day)
 * - "daily"     — the single free homepage cookie (1/day, no account)
 */
export type QuotaGateVariant = "generator" | "daily";

interface QuotaGateCardProps {
  quota: QuotaInfo;
  /** Fallback message from the API, shown when quota numbers are unusable. */
  message?: string;
  variant?: QuotaGateVariant;
  /**
   * Optional secondary action. Only rendered when supplied, so the card never
   * offers to save an image that does not exist.
   */
  onSaveImage?: () => void;
  className?: string;
}

/**
 * In-place daily-limit card. Replaces the old fire-and-forget toast: it stays
 * on screen above the existing results (which are no longer cleared), explains
 * exactly what was used, what signing in buys, and when the counter resets.
 *
 * Copy rules this file is the single source of truth for:
 * - always "fortunes", never message/prediction/prophecy
 * - always "a day", never daily/per day/every 24 hours
 * - always "Sign in with Google", in prose and on the button alike
 * - always "midnight UTC" for the reset
 * - never "free trial", "credits" or "tokens"
 * - no Premium/upgrade entry point while the paid flow is not live: a lock the
 *   user cannot buy their way out of costs more trust than no lock at all.
 */
export function QuotaGateCard({
  quota,
  message,
  variant = "generator",
  onSaveImage,
  className,
}: QuotaGateCardProps) {
  const [resetIn, setResetIn] = useState<string | null>(() =>
    formatResetIn(quota.resetsAtUtc),
  );

  // Keep the countdown honest if the card sits on screen for a while.
  useEffect(() => {
    setResetIn(formatResetIn(quota.resetsAtUtc));
    const timer = setInterval(
      () => setResetIn(formatResetIn(quota.resetsAtUtc)),
      60_000,
    );
    return () => clearInterval(timer);
  }, [quota.resetsAtUtc]);

  /**
   * Report the gate exactly once per mount.
   *
   * The countdown above re-renders this card every 60s, and `variant` /
   * `isAuthenticated` can in principle change while it is on screen — neither
   * is a new gate, so neither may produce a second event. The ref (not the dep
   * array) is what guarantees that; it also absorbs React StrictMode's
   * double-invoked effects in development.
   *
   * A genuinely new gate always arrives as a fresh mount (callers render the
   * card conditionally on `quotaGate !== null`), which resets the ref.
   */
  const gateReported = useRef(false);
  useEffect(() => {
    if (gateReported.current) return;
    gateReported.current = true;
    trackEvent("quota_gate_shown", {
      variant,
      is_authenticated: quota.isAuthenticated,
    });
  }, [variant, quota.isAuthenticated]);

  const guest = !quota.isAuthenticated;
  const daily = variant === "daily";

  // Limits always come from the API response, never from a hardcoded number,
  // so changing GUEST/AUTH_DAILY_LIMIT on the server needs no frontend edit.
  const limit = quota.limit;

  let title: string;
  let body: string;

  if (daily && guest) {
    title = "Today's cookie is already open.";
    // The homepage cookie is unlimited once signed in, and the generator scope
    // is a *separate* counter that is still untouched — so this card always has
    // two live exits. Never a dead end.
    body = `Sign in with Google for unlimited cookies here — or use your ${GUEST_GENERATOR_DAILY_LIMIT} free AI fortunes in the Generator.`;
  } else if (daily) {
    // Defensive: a signed-in homepage draw is unlimited, so this branch should
    // be unreachable. Still, never render a card with no explanation.
    title = "Today's cookie is already open.";
    body = resetIn
      ? `A new one is waiting at midnight UTC — in ${resetIn}.`
      : "A new one is waiting at midnight UTC.";
  } else if (guest) {
    title = `That's ${limit} for today.`;
    // No subtraction here: the server counts usage per identity, so a guest who
    // signs in starts a fresh bucket and gets the full signed-in allowance, not
    // the difference.
    body = `Sign in with Google for ${SIGNED_IN_DAILY_LIMIT} fortunes a day.`;
  } else {
    title = `That's ${limit} for today.`;
    body = resetIn
      ? `Your limit resets in ${resetIn}.`
      : "Your limit resets at midnight UTC.";
  }

  // The API's own wording is only a last resort — it is not yet unified with
  // this copy, so it must never override a message we can build ourselves.
  if (!daily && !guest && !resetIn && message) body = message;

  // Both guest variants get a sign-in exit. The daily one additionally points
  // at the Generator, whose allowance is a separate counter and still unspent.
  const showSignIn = guest;
  const showGeneratorLink = daily && guest;
  const resetLine = resetIn ? `Resets in ${resetIn}` : "Resets at midnight UTC";
  const dailyResetLine = resetIn
    ? `A new one is waiting at midnight UTC — in ${resetIn}.`
    : "A new one is waiting at midnight UTC.";

  return (
    <Card
      className={cn(
        "gap-4 border-amber-300/70 bg-gradient-to-br from-amber-50 to-orange-50 p-5 shadow-sm",
        "dark:border-amber-500/40 dark:from-slate-800 dark:to-slate-800/60",
        className,
      )}
    >
      {/* Only the prose is a live region: wrapping the buttons too would make
          screen readers announce them on every update, on top of reading them
          again in the tab order. */}
      <div className="flex items-start gap-3" role="status" aria-live="polite">
        <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-orange-500 text-white">
          <Sparkles className="h-5 w-5" aria-hidden="true" />
        </span>
        <div className="min-w-0">
          <h3 className="text-base font-semibold text-slate-900 dark:text-slate-50">
            {title}
          </h3>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
            {body}
          </p>
        </div>
      </div>

      {showSignIn && (
        <>
          {!daily && (
            <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
              {SIGNED_IN_DAILY_LIMIT} a day · saved favorites · history
            </p>
          )}

          <div className="space-y-2">
            <Button
              onClick={() => {
                trackEvent("signin_from_gate", { variant });
                startGoogleSignIn();
              }}
              className="h-12 w-full rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-base font-semibold text-white shadow-md hover:from-amber-600 hover:to-orange-600"
            >
              Sign in with Google
            </Button>
            {showGeneratorLink && (
              <Button
                asChild
                variant="outline"
                className="h-11 w-full rounded-xl"
              >
                <Link href="/generator">
                  Open the Generator
                  <ArrowRight className="ml-1.5 h-4 w-4" aria-hidden="true" />
                </Link>
              </Button>
            )}
            {onSaveImage && (
              <Button
                variant="outline"
                onClick={onSaveImage}
                className="h-11 w-full rounded-xl"
              >
                <ImageDown className="mr-2 h-4 w-4" aria-hidden="true" />
                Save this fortune as an image
              </Button>
            )}
          </div>
        </>
      )}

      {/* The countdown is already in the body for the signed-in variant;
          repeating it there would just be noise. */}
      {showSignIn && (
        <p className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
          <Clock className="h-3.5 w-3.5" aria-hidden="true" />
          {daily ? dailyResetLine : resetLine}
        </p>
      )}
    </Card>
  );
}
