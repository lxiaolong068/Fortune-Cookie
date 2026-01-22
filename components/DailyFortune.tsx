"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  Clock,
  Compass,
  Palette,
  Sparkles,
  ChevronRight,
  Eye,
  EyeOff,
  RefreshCw,
  Share2,
  Lightbulb,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  getTodayFortune,
  getTomorrowFortune,
  getTimeUntilReset,
  formatTimeUntilReset,
  type DailyFortune as DailyFortuneType,
  type TimeUntilReset,
} from "@/lib/daily-fortune";
import { FortuneScore } from "./FortuneScore";
import { SocialShare } from "./SocialShare";

// ============================================================================
// Types
// ============================================================================

interface DailyFortuneProps {
  className?: string;
  showTomorrowPreview?: boolean;
  compact?: boolean;
}

// ============================================================================
// Sub-Components
// ============================================================================

/**
 * Countdown timer to next fortune reset
 */
function ResetCountdown({ className }: { className?: string }) {
  const [timeUntil, setTimeUntil] = useState<TimeUntilReset | null>(null);

  useEffect(() => {
    // Initial calculation
    setTimeUntil(getTimeUntilReset());

    // Update every second
    const interval = setInterval(() => {
      setTimeUntil(getTimeUntilReset());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  if (!timeUntil) return null;

  return (
    <div
      className={cn(
        "flex items-center gap-2 text-sm text-muted-foreground",
        className
      )}
    >
      <Clock className="w-4 h-4" />
      <span>New fortune in {formatTimeUntilReset(timeUntil)}</span>
    </div>
  );
}

/**
 * Fortune message card
 */
function FortuneCard({
  fortune,
  isBlurred = false,
  onReveal,
}: {
  fortune: DailyFortuneType;
  isBlurred?: boolean;
  onReveal?: () => void;
}) {
  return (
    <div className="relative">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={cn(
          "p-6 rounded-xl bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 border border-amber-200/50 dark:border-amber-800/50",
          isBlurred && "select-none"
        )}
      >
        {/* Fortune Message */}
        <div className="relative">
          <p
            className={cn(
              "text-lg md:text-xl font-serif text-amber-900 dark:text-amber-100 leading-relaxed text-center",
              isBlurred && "blur-sm"
            )}
          >
            &ldquo;{fortune.fortune.message}&rdquo;
          </p>

          {/* Blur overlay for tomorrow's fortune */}
          {isBlurred && (
            <div className="absolute inset-0 flex items-center justify-center">
              <button
                onClick={onReveal}
                className="flex items-center gap-2 px-4 py-2 bg-amber-500/90 hover:bg-amber-500 text-white rounded-full shadow-lg transition-colors"
              >
                <Eye className="w-4 h-4" />
                <span className="text-sm font-medium">Reveal Preview</span>
              </button>
            </div>
          )}
        </div>

        {/* Lucky Numbers */}
        {!isBlurred && fortune.fortune.luckyNumbers && (
          <div className="mt-4 flex items-center justify-center gap-2">
            <span className="text-xs text-amber-700 dark:text-amber-300">
              Lucky Numbers:
            </span>
            <div className="flex gap-1">
              {fortune.fortune.luckyNumbers.map((num, i) => (
                <span
                  key={i}
                  className="w-6 h-6 flex items-center justify-center text-xs font-bold bg-amber-200 dark:bg-amber-800 text-amber-800 dark:text-amber-200 rounded-full"
                >
                  {num}
                </span>
              ))}
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}

/**
 * Daily extras (lucky color, direction, advice)
 */
function DailyExtras({ fortune }: { fortune: DailyFortuneType }) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {/* Lucky Color */}
      <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50">
        <Palette className="w-4 h-4 text-muted-foreground" />
        <div>
          <p className="text-xs text-muted-foreground">Lucky Color</p>
          <p className="text-sm font-medium">{fortune.luckyColor}</p>
        </div>
      </div>

      {/* Lucky Direction */}
      <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50">
        <Compass className="w-4 h-4 text-muted-foreground" />
        <div>
          <p className="text-xs text-muted-foreground">Lucky Direction</p>
          <p className="text-sm font-medium">{fortune.luckyDirection}</p>
        </div>
      </div>
    </div>
  );
}

/**
 * Daily advice section
 */
function DailyAdvice({ advice }: { advice: string }) {
  return (
    <div className="flex items-start gap-3 p-4 rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-200/50 dark:border-blue-800/50">
      <Lightbulb className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
      <div>
        <p className="text-xs font-medium text-blue-600 dark:text-blue-400 mb-1">
          Today&apos;s Advice
        </p>
        <p className="text-sm text-blue-900 dark:text-blue-100">{advice}</p>
      </div>
    </div>
  );
}

/**
 * Tomorrow preview section
 */
function TomorrowPreview({
  fortune,
  isRevealed,
  onToggle,
}: {
  fortune: DailyFortuneType;
  isRevealed: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="mt-6 pt-6 border-t border-border">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm font-medium">Tomorrow&apos;s Fortune Preview</span>
        </div>
        <button
          onClick={onToggle}
          className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          {isRevealed ? (
            <>
              <EyeOff className="w-3 h-3" />
              Hide
            </>
          ) : (
            <>
              <Eye className="w-3 h-3" />
              Peek
            </>
          )}
        </button>
      </div>

      <FortuneCard
        fortune={fortune}
        isBlurred={!isRevealed}
        onReveal={onToggle}
      />
    </div>
  );
}

// ============================================================================
// Main Component
// ============================================================================

/**
 * Daily Fortune Component
 *
 * Displays today's fortune with scores, lucky elements, and optional
 * tomorrow's preview. Updates automatically at UTC midnight.
 */
export function DailyFortune({
  className,
  showTomorrowPreview = true,
  compact = false,
}: DailyFortuneProps) {
  const [todayFortune, setTodayFortune] = useState<DailyFortuneType | null>(
    null
  );
  const [tomorrowFortune, setTomorrowFortune] =
    useState<DailyFortuneType | null>(null);
  const [tomorrowRevealed, setTomorrowRevealed] = useState(false);
  const [isSharing, setIsSharing] = useState(false);

  // Generate fortunes on mount
  useEffect(() => {
    setTodayFortune(getTodayFortune());
    if (showTomorrowPreview) {
      setTomorrowFortune(getTomorrowFortune());
    }
  }, [showTomorrowPreview]);

  // Refresh fortunes (for when day changes)
  const refreshFortunes = useCallback(() => {
    setTodayFortune(getTodayFortune());
    if (showTomorrowPreview) {
      setTomorrowFortune(getTomorrowFortune());
    }
    setTomorrowRevealed(false);
  }, [showTomorrowPreview]);

  if (!todayFortune) {
    return (
      <div className={cn("animate-pulse", className)}>
        <div className="h-64 bg-muted rounded-xl" />
      </div>
    );
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "bg-card rounded-2xl border shadow-sm overflow-hidden",
        className
      )}
    >
      {/* Header */}
      <div className="p-4 md:p-6 border-b bg-gradient-to-r from-amber-500/10 to-orange-500/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">Today&apos;s Fortune</h2>
              <p className="text-sm text-muted-foreground">
                {new Date(todayFortune.date).toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={refreshFortunes}
              className="p-2 rounded-full hover:bg-muted transition-colors"
              title="Refresh"
            >
              <RefreshCw className="w-4 h-4 text-muted-foreground" />
            </button>
            <button
              onClick={() => setIsSharing(!isSharing)}
              className="p-2 rounded-full hover:bg-muted transition-colors"
              title="Share"
            >
              <Share2 className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>
        </div>

        {/* Reset countdown */}
        <ResetCountdown className="mt-3" />
      </div>

      {/* Content */}
      <div className="p-4 md:p-6 space-y-6">
        {/* Fortune Scores */}
        <FortuneScore
          scores={todayFortune.scores}
          showDetails={!compact}
          animated={true}
        />

        {/* Fortune Message */}
        <FortuneCard fortune={todayFortune} />

        {/* Daily Extras */}
        {!compact && <DailyExtras fortune={todayFortune} />}

        {/* Daily Advice */}
        {!compact && <DailyAdvice advice={todayFortune.advice} />}

        {/* Share Panel */}
        <AnimatePresence>
          {isSharing && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="pt-4 border-t">
                <SocialShare
                  message={todayFortune.fortune.message}
                  luckyNumbers={todayFortune.fortune.luckyNumbers}
                  variant="default"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Tomorrow Preview */}
        {showTomorrowPreview && tomorrowFortune && (
          <TomorrowPreview
            fortune={tomorrowFortune}
            isRevealed={tomorrowRevealed}
            onToggle={() => setTomorrowRevealed(!tomorrowRevealed)}
          />
        )}
      </div>

      {/* Footer CTA */}
      <div className="p-4 md:p-6 border-t bg-muted/30">
        <a
          href="/generator"
          className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-medium rounded-xl transition-all shadow-md hover:shadow-lg"
        >
          <Sparkles className="w-4 h-4" />
          Generate Your Personal AI Fortune
          <ChevronRight className="w-4 h-4" />
        </a>
      </div>
    </motion.section>
  );
}

// ============================================================================
// Compact variant for sidebar/widget usage
// ============================================================================

export function DailyFortuneCompact({ className }: { className?: string }) {
  return (
    <DailyFortune
      className={className}
      showTomorrowPreview={false}
      compact={true}
    />
  );
}

export default DailyFortune;
