"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Flame, Star, Gift, Check, Loader2, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuthSession } from "@/lib/auth-client";
import { toast } from "sonner";

// ============================================================================
// Types
// ============================================================================

interface CheckInStatus {
  checkedInToday: boolean;
  currentStreak: number;
  totalCheckIns: number;
  todayBonus: number;
  lastCheckIn: string | null;
}

interface CheckInResult {
  checkedInToday: boolean;
  currentStreak: number;
  bonusQuota: number;
  totalCheckIns: number;
  isNewRecord: boolean;
  milestoneReached: boolean;
}

interface DailyCheckInProps {
  className?: string;
  compact?: boolean;
  onCheckIn?: (result: CheckInResult) => void;
}

// ============================================================================
// Streak milestone labels
// ============================================================================

function getStreakLabel(streak: number): string {
  if (streak >= 30) return "🏆 Legend";
  if (streak >= 14) return "⚡ On Fire";
  if (streak >= 7) return "🌟 Weekly Warrior";
  if (streak >= 3) return "🔥 Building Momentum";
  if (streak >= 1) return "✨ Getting Started";
  return "Start your streak!";
}

function getNextMilestone(streak: number): { days: number; bonus: number } | null {
  if (streak < 3) return { days: 3, bonus: 2 };
  if (streak < 7) return { days: 7, bonus: 3 };
  if (streak < 14) return { days: 14, bonus: 5 };
  if (streak < 30) return { days: 30, bonus: 10 };
  return null;
}

// ============================================================================
// Streak Flame Display
// ============================================================================

function StreakFlame({ streak, size = "md" }: { streak: number; size?: "sm" | "md" | "lg" }) {
  const sizeClasses = {
    sm: "text-2xl",
    md: "text-4xl",
    lg: "text-6xl",
  };

  const flameColor =
    streak >= 30
      ? "text-purple-500"
      : streak >= 14
        ? "text-orange-500"
        : streak >= 7
          ? "text-amber-500"
          : streak >= 3
            ? "text-yellow-500"
            : "text-slate-400";

  return (
    <motion.div
      animate={streak > 0 ? { scale: [1, 1.1, 1] } : {}}
      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      className={cn("flex items-center justify-center", sizeClasses[size])}
    >
      <Flame className={cn("w-8 h-8", flameColor, streak > 0 && "drop-shadow-md")} />
      {streak > 0 && (
        <span className={cn("font-bold ml-1", flameColor, size === "lg" ? "text-3xl" : size === "md" ? "text-2xl" : "text-lg")}>
          {streak}
        </span>
      )}
    </motion.div>
  );
}

// ============================================================================
// Main DailyCheckIn Component
// ============================================================================

export function DailyCheckIn({ className, compact = false, onCheckIn }: DailyCheckInProps) {
  const { status } = useAuthSession();
  const isAuthenticated = status === "authenticated";

  const [checkInStatus, setCheckInStatus] = useState<CheckInStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [justCheckedIn, setJustCheckedIn] = useState(false);
  const [checkInResult, setCheckInResult] = useState<CheckInResult | null>(null);

  // Fetch check-in status
  const fetchStatus = useCallback(async () => {
    if (!isAuthenticated) {
      setFetching(false);
      return;
    }
    try {
      const res = await fetch("/api/checkin");
      if (res.ok) {
        const data = await res.json();
        setCheckInStatus(data.data);
      }
    } catch (err) {
      console.error("Failed to fetch check-in status:", err);
    } finally {
      setFetching(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchStatus();
  }, [fetchStatus]);

  // Perform check-in
  const handleCheckIn = async () => {
    if (loading || checkInStatus?.checkedInToday) return;
    setLoading(true);
    try {
      const res = await fetch("/api/checkin", { method: "POST" });
      const data = await res.json();

      if (res.ok && data.success) {
        const result: CheckInResult = data.data;
        setCheckInResult(result);
        setJustCheckedIn(true);
        setCheckInStatus((prev) => ({
          ...prev!,
          checkedInToday: true,
          currentStreak: result.currentStreak,
          totalCheckIns: result.totalCheckIns,
          todayBonus: result.bonusQuota,
          lastCheckIn: new Date().toISOString().split("T")[0] ?? new Date().toISOString().slice(0, 10),
        }));
        onCheckIn?.(result);

        // Show success toast
        if (result.milestoneReached) {
          toast.success(
            `🎉 ${result.currentStreak}-day streak milestone! +${result.bonusQuota} bonus fortunes!`,
            { duration: 5000 },
          );
        } else {
          toast.success(
            `✅ Checked in! +${result.bonusQuota} bonus fortune${result.bonusQuota > 1 ? "s" : ""} earned!`,
          );
        }
      } else if (res.status === 409) {
        toast.info("You've already checked in today!");
        setCheckInStatus((prev) => prev ? { ...prev, checkedInToday: true } : null);
      } else {
        toast.error(data.error || "Check-in failed. Please try again.");
      }
    } catch (err) {
      console.error("Check-in error:", err);
      toast.error("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Not logged in - show sign-in prompt
  if (!isAuthenticated) {
    return (
      <div className={cn(
        "rounded-2xl border border-indigo-100 dark:border-indigo-800/50 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30 p-6 text-center",
        className
      )}>
        <Calendar className="w-8 h-8 text-indigo-400 mx-auto mb-3" />
        <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Daily Check-In</p>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
          Sign in to track your streak and earn bonus fortunes every day!
        </p>
        <a
          href="/api/auth/signin"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition-colors"
        >
          Sign In to Check In
        </a>
      </div>
    );
  }

  // Loading state
  if (fetching) {
    return (
      <div className={cn("rounded-2xl border border-slate-100 dark:border-slate-800 p-6 flex items-center justify-center", className)}>
        <Loader2 className="w-5 h-5 animate-spin text-indigo-400" />
      </div>
    );
  }

  const streak = checkInStatus?.currentStreak ?? 0;
  const checkedIn = checkInStatus?.checkedInToday ?? false;
  const nextMilestone = getNextMilestone(streak);

  // Compact variant
  if (compact) {
    return (
      <div className={cn(
        "flex items-center gap-3 rounded-xl border px-4 py-3",
        checkedIn
          ? "border-green-200 dark:border-green-800/50 bg-green-50 dark:bg-green-950/20"
          : "border-amber-200 dark:border-amber-800/50 bg-amber-50 dark:bg-amber-950/20",
        className
      )}>
        <StreakFlame streak={streak} size="sm" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
            {streak > 0 ? `${streak}-day streak` : "Start your streak"}
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
            {getStreakLabel(streak)}
          </p>
        </div>
        <button
          onClick={handleCheckIn}
          disabled={loading || checkedIn}
          className={cn(
            "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all",
            checkedIn
              ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 cursor-default"
              : "bg-amber-500 hover:bg-amber-600 text-white shadow-sm active:scale-95",
          )}
        >
          {loading ? (
            <Loader2 className="w-3 h-3 animate-spin" />
          ) : checkedIn ? (
            <><Check className="w-3 h-3" /> Done</>
          ) : (
            <><Star className="w-3 h-3" /> Check In</>
          )}
        </button>
      </div>
    );
  }

  // Full variant
  return (
    <div className={cn(
      "rounded-2xl border overflow-hidden",
      checkedIn
        ? "border-green-200 dark:border-green-800/50"
        : "border-amber-200 dark:border-amber-800/50",
      className
    )}>
      {/* Header */}
      <div className={cn(
        "px-6 py-4 flex items-center justify-between",
        checkedIn
          ? "bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30"
          : "bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30",
      )}>
        <div className="flex items-center gap-3">
          <StreakFlame streak={streak} size="md" />
          <div>
            <h3 className="font-bold text-slate-800 dark:text-slate-200">Daily Check-In</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">{getStreakLabel(streak)}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-slate-800 dark:text-slate-200">{streak}</p>
          <p className="text-xs text-slate-500 dark:text-slate-400">day streak</p>
        </div>
      </div>

      {/* Body */}
      <div className="px-6 py-4 bg-white dark:bg-slate-900">
        {/* Stats row */}
        <div className="flex items-center gap-4 mb-4 text-sm">
          <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
            <Calendar className="w-4 h-4" />
            <span>{checkInStatus?.totalCheckIns ?? 0} total check-ins</span>
          </div>
          {checkInStatus?.todayBonus ? (
            <div className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400">
              <Gift className="w-4 h-4" />
              <span>+{checkInStatus.todayBonus} bonus today</span>
            </div>
          ) : null}
        </div>

        {/* Next milestone progress */}
        {nextMilestone && (
          <div className="mb-4">
            <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
              <span>Next milestone: {nextMilestone.days} days (+{nextMilestone.bonus} bonus)</span>
              <span>{streak}/{nextMilestone.days}</span>
            </div>
            <div className="h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.min((streak / nextMilestone.days) * 100, 100)}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="h-full bg-gradient-to-r from-amber-400 to-orange-500 rounded-full"
              />
            </div>
          </div>
        )}

        {/* Milestone badges */}
        <div className="flex gap-2 mb-4">
          {[
            { days: 3, label: "3d", bonus: "+2", icon: "🔥" },
            { days: 7, label: "7d", bonus: "+3", icon: "⚡" },
            { days: 14, label: "14d", bonus: "+5", icon: "🌟" },
            { days: 30, label: "30d", bonus: "+10", icon: "🏆" },
          ].map((milestone) => (
            <div
              key={milestone.days}
              className={cn(
                "flex-1 rounded-lg p-2 text-center text-xs border transition-all",
                streak >= milestone.days
                  ? "border-amber-300 dark:border-amber-700 bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400"
                  : "border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-slate-400",
              )}
            >
              <div className="text-base mb-0.5">{milestone.icon}</div>
              <div className="font-semibold">{milestone.label}</div>
              <div className="text-[10px] opacity-75">{milestone.bonus}</div>
            </div>
          ))}
        </div>

        {/* Check-in button */}
        <AnimatePresence mode="wait">
          {justCheckedIn && checkInResult ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center justify-center gap-3 py-3 rounded-xl bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800/50"
            >
              <Check className="w-5 h-5 text-green-600 dark:text-green-400" />
              <div className="text-center">
                <p className="font-semibold text-green-700 dark:text-green-400">
                  Checked in! {checkInResult.currentStreak}-day streak 🎉
                </p>
                <p className="text-xs text-green-600 dark:text-green-500">
                  +{checkInResult.bonusQuota} bonus fortune{checkInResult.bonusQuota > 1 ? "s" : ""} added to today&apos;s quota
                </p>
              </div>
            </motion.div>
          ) : checkedIn ? (
            <motion.div
              key="already-done"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center justify-center gap-2 py-3 rounded-xl bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800/50 text-green-700 dark:text-green-400"
            >
              <Check className="w-5 h-5" />
              <span className="font-medium">Already checked in today!</span>
            </motion.div>
          ) : (
            <motion.button
              key="check-in-btn"
              onClick={handleCheckIn}
              disabled={loading}
              whileTap={{ scale: 0.97 }}
              className={cn(
                "w-full py-3 rounded-xl font-semibold text-white transition-all",
                "bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600",
                "shadow-md hover:shadow-lg active:shadow-sm",
                "flex items-center justify-center gap-2",
                loading && "opacity-70 cursor-not-allowed",
              )}
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <Star className="w-5 h-5" />
                  Check In for Bonus Fortunes
                </>
              )}
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default DailyCheckIn;
