"use client";

import { motion } from "framer-motion";
import {
  Briefcase,
  Heart,
  Activity,
  Coins,
  Star,
  TrendingUp,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  type FortuneScores,
  getScoreRating,
  getScoreColorClass,
  getScoreBgClass,
} from "@/lib/daily-fortune";

// ============================================================================
// Types
// ============================================================================

interface FortuneScoreProps {
  scores: FortuneScores;
  showDetails?: boolean;
  animated?: boolean;
  className?: string;
}

interface ScoreDimension {
  key: keyof Omit<FortuneScores, "overall">;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
}

// ============================================================================
// Constants
// ============================================================================

const SCORE_DIMENSIONS: ScoreDimension[] = [
  {
    key: "career",
    label: "Career",
    icon: Briefcase,
    description: "Work & Professional Growth",
  },
  {
    key: "love",
    label: "Love",
    icon: Heart,
    description: "Relationships & Romance",
  },
  {
    key: "health",
    label: "Health",
    icon: Activity,
    description: "Wellness & Vitality",
  },
  {
    key: "wealth",
    label: "Wealth",
    icon: Coins,
    description: "Money & Prosperity",
  },
];

// ============================================================================
// Sub-Components
// ============================================================================

/**
 * Overall score display with large number and rating
 */
function OverallScore({
  score,
  animated,
}: {
  score: number;
  animated?: boolean;
}) {
  const rating = getScoreRating(score);
  const colorClass = getScoreColorClass(score);
  const bgClass = getScoreBgClass(score);

  const ratingLabels: Record<typeof rating, string> = {
    excellent: "Excellent Day!",
    good: "Good Fortune",
    fair: "Balanced Day",
    challenging: "Growth Day",
  };

  const ratingEmoji: Record<typeof rating, string> = {
    excellent: "🌟",
    good: "✨",
    fair: "🌤️",
    challenging: "🌱",
  };

  return (
    <div className={cn("text-center p-4 rounded-xl", bgClass)}>
      <div className="flex items-center justify-center gap-2 mb-2">
        <Star className={cn("w-5 h-5", colorClass)} />
        <span className="text-sm font-medium text-muted-foreground">
          Overall Fortune
        </span>
      </div>

      <motion.div
        initial={animated ? { scale: 0.5, opacity: 0 } : false}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
        className="flex items-baseline justify-center gap-1"
      >
        <span className={cn("text-5xl font-bold", colorClass)}>{score}</span>
        <span className="text-xl text-muted-foreground">/10</span>
      </motion.div>

      <div className="mt-2 flex items-center justify-center gap-2">
        <span className="text-lg">{ratingEmoji[rating]}</span>
        <span className={cn("font-medium", colorClass)}>
          {ratingLabels[rating]}
        </span>
      </div>
    </div>
  );
}

/**
 * Single dimension score bar
 */
function DimensionScore({
  dimension,
  score,
  animated,
  index,
}: {
  dimension: ScoreDimension;
  score: number;
  animated?: boolean;
  index: number;
}) {
  const Icon = dimension.icon;
  const colorClass = getScoreColorClass(score);
  const percentage = (score / 10) * 100;

  return (
    <motion.div
      initial={animated ? { opacity: 0, x: -20 } : false}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
      className="space-y-1"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon className={cn("w-4 h-4", colorClass)} />
          <span className="text-sm font-medium">{dimension.label}</span>
        </div>
        <span className={cn("text-sm font-bold", colorClass)}>{score}/10</span>
      </div>

      <div className="h-2 bg-muted rounded-full overflow-hidden">
        <motion.div
          initial={animated ? { width: 0 } : { width: `${percentage}%` }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.8, delay: index * 0.1, ease: "easeOut" }}
          className={cn(
            "h-full rounded-full",
            score >= 9
              ? "bg-yellow-500"
              : score >= 7
                ? "bg-green-500"
                : score >= 5
                  ? "bg-blue-500"
                  : "bg-orange-500"
          )}
        />
      </div>
    </motion.div>
  );
}

/**
 * Compact score display (horizontal badges)
 */
function CompactScores({
  scores,
  animated,
}: {
  scores: FortuneScores;
  animated?: boolean;
}) {
  return (
    <div className="flex flex-wrap gap-2 justify-center">
      {SCORE_DIMENSIONS.map((dim, index) => {
        const score = scores[dim.key];
        const Icon = dim.icon;
        const colorClass = getScoreColorClass(score);
        const bgClass = getScoreBgClass(score);

        return (
          <motion.div
            key={dim.key}
            initial={animated ? { opacity: 0, scale: 0.8 } : false}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-full",
              bgClass
            )}
            title={`${dim.label}: ${score}/10`}
          >
            <Icon className={cn("w-3.5 h-3.5", colorClass)} />
            <span className={cn("text-xs font-semibold", colorClass)}>
              {score}
            </span>
          </motion.div>
        );
      })}
    </div>
  );
}

// ============================================================================
// Main Component
// ============================================================================

/**
 * Fortune Score Component
 *
 * Displays fortune scores with optional detailed breakdown.
 * Supports animated entrance and multiple display variants.
 */
export function FortuneScore({
  scores,
  showDetails = true,
  animated = true,
  className,
}: FortuneScoreProps) {
  return (
    <div className={cn("space-y-4", className)}>
      {/* Overall Score */}
      <OverallScore score={scores.overall} animated={animated} />

      {/* Dimension Details */}
      {showDetails ? (
        <div className="space-y-3 pt-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <TrendingUp className="w-4 h-4" />
            <span>Fortune Breakdown</span>
          </div>
          <div className="space-y-3">
            {SCORE_DIMENSIONS.map((dimension, index) => (
              <DimensionScore
                key={dimension.key}
                dimension={dimension}
                score={scores[dimension.key]}
                animated={animated}
                index={index}
              />
            ))}
          </div>
        </div>
      ) : (
        <CompactScores scores={scores} animated={animated} />
      )}
    </div>
  );
}

// ============================================================================
// Exports
// ============================================================================

export { OverallScore, DimensionScore, CompactScores, SCORE_DIMENSIONS };
export type { FortuneScoreProps, ScoreDimension };
