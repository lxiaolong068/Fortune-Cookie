/**
 * Daily Fortune Generation System
 *
 * Provides deterministic daily fortune generation based on date,
 * ensuring all users see the same "Today's Fortune" on the same day.
 *
 * Features:
 * - Deterministic PRNG based on date seed
 * - Daily fortune with message, lucky numbers, and score
 * - Tomorrow's fortune preview (optional blur/lock)
 * - Multi-dimension fortune scores (career, love, health, wealth)
 * - Time until next fortune reset (UTC midnight)
 */

import { SeededRandom } from "./utils";
import {
  fortuneDatabase,
  type FortuneMessage,
  type FortuneCategory,
} from "./fortune-database";

// ============================================================================
// Types
// ============================================================================

/**
 * Fortune score dimensions
 */
export interface FortuneScores {
  overall: number; // 1-10 overall fortune score
  career: number; // 1-10 career/work fortune
  love: number; // 1-10 love/relationship fortune
  health: number; // 1-10 health/wellness fortune
  wealth: number; // 1-10 wealth/money fortune
}

/**
 * Daily fortune with message and scores
 */
export interface DailyFortune {
  date: string; // ISO date string (YYYY-MM-DD)
  fortune: FortuneMessage;
  scores: FortuneScores;
  luckyColor: string;
  luckyDirection: string;
  advice: string;
}

/**
 * Time until next fortune reset
 */
export interface TimeUntilReset {
  hours: number;
  minutes: number;
  seconds: number;
  totalSeconds: number;
}

// ============================================================================
// Constants
// ============================================================================

/**
 * Lucky colors pool for daily fortune
 */
const LUCKY_COLORS = [
  { name: "Red", hex: "#EF4444", emoji: "🔴" },
  { name: "Orange", hex: "#F97316", emoji: "🟠" },
  { name: "Yellow", hex: "#EAB308", emoji: "🟡" },
  { name: "Green", hex: "#22C55E", emoji: "🟢" },
  { name: "Blue", hex: "#3B82F6", emoji: "🔵" },
  { name: "Purple", hex: "#A855F7", emoji: "🟣" },
  { name: "Pink", hex: "#EC4899", emoji: "💗" },
  { name: "Gold", hex: "#FFD700", emoji: "✨" },
  { name: "Silver", hex: "#C0C0C0", emoji: "🤍" },
  { name: "Teal", hex: "#14B8A6", emoji: "💠" },
];

/**
 * Lucky directions pool
 */
const LUCKY_DIRECTIONS = [
  { name: "North", emoji: "⬆️" },
  { name: "Northeast", emoji: "↗️" },
  { name: "East", emoji: "➡️" },
  { name: "Southeast", emoji: "↘️" },
  { name: "South", emoji: "⬇️" },
  { name: "Southwest", emoji: "↙️" },
  { name: "West", emoji: "⬅️" },
  { name: "Northwest", emoji: "↖️" },
];

/**
 * Daily advice pool based on score ranges
 */
const DAILY_ADVICE: Record<"high" | "medium" | "low", string[]> = {
  high: [
    "Today is your day! Take bold action and seize opportunities.",
    "The stars are aligned in your favor. Trust your instincts.",
    "Fortune smiles upon you. Share your good luck with others.",
    "Your positive energy will attract success. Stay confident!",
    "Great things await you today. Be open to new possibilities.",
  ],
  medium: [
    "A balanced day ahead. Focus on steady progress.",
    "Take time to reflect and plan your next steps carefully.",
    "Small efforts today will lead to big results tomorrow.",
    "Stay patient and positive. Good things come to those who wait.",
    "Trust the process. Every step forward counts.",
  ],
  low: [
    "A day for rest and reflection. Take it easy and recharge.",
    "Focus on self-care today. Tomorrow brings new opportunities.",
    "Challenges are stepping stones. Learn from today's experiences.",
    "Sometimes the best action is no action. Be patient.",
    "Use today to prepare for brighter days ahead.",
  ],
};

// ============================================================================
// Core Functions
// ============================================================================

/**
 * Generate a date-based seed for deterministic randomization
 * @param date - Date object or ISO string
 * @returns Numeric seed based on the date
 */
export function getDateSeed(date: Date | string): number {
  const d = typeof date === "string" ? new Date(date) : date;
  // Use UTC date to ensure consistency across timezones
  const year = d.getUTCFullYear();
  const month = d.getUTCMonth();
  const day = d.getUTCDate();

  // Create a unique seed for each day
  // Formula: year * 10000 + month * 100 + day
  return year * 10000 + (month + 1) * 100 + day;
}

/**
 * Get today's date in ISO format (YYYY-MM-DD) in UTC
 */
export function getTodayDateString(): string {
  const now = new Date();
  const parts = now.toISOString().split("T");
  return parts[0] ?? now.toISOString().slice(0, 10);
}

/**
 * Get tomorrow's date in ISO format (YYYY-MM-DD) in UTC
 */
export function getTomorrowDateString(): string {
  const now = new Date();
  now.setUTCDate(now.getUTCDate() + 1);
  const parts = now.toISOString().split("T");
  return parts[0] ?? now.toISOString().slice(0, 10);
}

/**
 * Generate fortune scores for a given date
 * @param seed - Date-based seed
 * @returns Fortune scores (1-10 for each dimension)
 */
export function generateFortuneScores(seed: number): FortuneScores {
  const rng = new SeededRandom(seed);

  // Generate base scores (3-10 range for better UX - avoid very low scores)
  const career = rng.int(3, 11);
  const love = rng.int(3, 11);
  const health = rng.int(3, 11);
  const wealth = rng.int(3, 11);

  // Calculate overall as weighted average
  const overall = Math.round((career + love + health + wealth) / 4);

  return {
    overall,
    career,
    love,
    health,
    wealth,
  };
}

/**
 * Select a fortune message for a given date
 * @param seed - Date-based seed
 * @param category - Optional category filter
 * @returns Selected fortune message
 */
export function selectDailyFortune(
  seed: number,
  category?: FortuneCategory,
): FortuneMessage {
  const rng = new SeededRandom(seed + 12345); // Offset to get different sequence from scores

  // Filter by category if specified
  const pool = category
    ? fortuneDatabase.filter((f) => f.category === category)
    : fortuneDatabase;

  // Ensure we have fortunes to select from
  const effectivePool = pool.length > 0 ? pool : fortuneDatabase;

  if (effectivePool.length === 0) {
    throw new Error("No fortunes available in database");
  }

  const index = rng.int(0, effectivePool.length);
  const fortune = effectivePool[index];

  if (!fortune) {
    throw new Error("Failed to select fortune from database");
  }

  return fortune;
}

/**
 * Select lucky color for a given date
 */
export function selectLuckyColor(seed: number): (typeof LUCKY_COLORS)[number] {
  const rng = new SeededRandom(seed + 54321);
  const index = rng.int(0, LUCKY_COLORS.length);
  const color = LUCKY_COLORS[index];
  if (!color) {
    return LUCKY_COLORS[0]!;
  }
  return color;
}

/**
 * Select lucky direction for a given date
 */
export function selectLuckyDirection(
  seed: number,
): (typeof LUCKY_DIRECTIONS)[number] {
  const rng = new SeededRandom(seed + 98765);
  const index = rng.int(0, LUCKY_DIRECTIONS.length);
  const direction = LUCKY_DIRECTIONS[index];
  if (!direction) {
    return LUCKY_DIRECTIONS[0]!;
  }
  return direction;
}

/**
 * Select daily advice based on overall score
 */
export function selectDailyAdvice(seed: number, overallScore: number): string {
  const rng = new SeededRandom(seed + 11111);

  let advicePool: string[];
  if (overallScore >= 8) {
    advicePool = DAILY_ADVICE.high;
  } else if (overallScore >= 5) {
    advicePool = DAILY_ADVICE.medium;
  } else {
    advicePool = DAILY_ADVICE.low;
  }

  const index = rng.int(0, advicePool.length);
  const advice = advicePool[index];
  if (!advice) {
    return advicePool[0] ?? "Trust the process. Good things are coming.";
  }
  return advice;
}

/**
 * Generate complete daily fortune for a given date
 * @param date - Date string (YYYY-MM-DD) or Date object
 * @param category - Optional category filter
 * @returns Complete daily fortune with message, scores, and extras
 */
export function generateDailyFortune(
  date?: string | Date,
  category?: FortuneCategory,
): DailyFortune {
  let dateStr: string;
  if (typeof date === "string") {
    dateStr = date;
  } else if (date) {
    const parts = date.toISOString().split("T");
    dateStr = parts[0] ?? date.toISOString().slice(0, 10);
  } else {
    dateStr = getTodayDateString();
  }

  const seed = getDateSeed(dateStr);
  const scores = generateFortuneScores(seed);
  const fortune = selectDailyFortune(seed, category);
  const luckyColorObj = selectLuckyColor(seed);
  const luckyDirectionObj = selectLuckyDirection(seed);
  const advice = selectDailyAdvice(seed, scores.overall);

  return {
    date: dateStr,
    fortune,
    scores,
    luckyColor: `${luckyColorObj.emoji} ${luckyColorObj.name}`,
    luckyDirection: `${luckyDirectionObj.emoji} ${luckyDirectionObj.name}`,
    advice,
  };
}

/**
 * Get today's fortune
 */
export function getTodayFortune(category?: FortuneCategory): DailyFortune {
  return generateDailyFortune(getTodayDateString(), category);
}

/**
 * Get tomorrow's fortune (for preview)
 */
export function getTomorrowFortune(category?: FortuneCategory): DailyFortune {
  return generateDailyFortune(getTomorrowDateString(), category);
}

/**
 * Calculate time until next fortune reset (UTC midnight)
 */
export function getTimeUntilReset(): TimeUntilReset {
  const now = new Date();

  // Calculate next UTC midnight
  const nextMidnight = new Date(now);
  nextMidnight.setUTCDate(nextMidnight.getUTCDate() + 1);
  nextMidnight.setUTCHours(0, 0, 0, 0);

  const totalSeconds = Math.floor(
    (nextMidnight.getTime() - now.getTime()) / 1000,
  );
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return {
    hours,
    minutes,
    seconds,
    totalSeconds,
  };
}

/**
 * Format time until reset as a string
 */
export function formatTimeUntilReset(time: TimeUntilReset): string {
  const { hours, minutes, seconds } = time;

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  } else if (minutes > 0) {
    return `${minutes}m ${seconds}s`;
  } else {
    return `${seconds}s`;
  }
}

// ============================================================================
// Score Rating Utilities
// ============================================================================

/**
 * Get rating label for a score (1-10)
 */
export function getScoreRating(
  score: number,
): "excellent" | "good" | "fair" | "challenging" {
  if (score >= 9) return "excellent";
  if (score >= 7) return "good";
  if (score >= 5) return "fair";
  return "challenging";
}

/**
 * Get emoji representation of score (stars)
 */
export function getScoreStars(score: number): string {
  const fullStars = Math.floor(score / 2);
  const halfStar = score % 2 >= 1;
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

  return (
    "⭐".repeat(fullStars) +
    (halfStar ? "✨" : "") +
    "☆".repeat(Math.max(0, emptyStars))
  );
}

/**
 * Get color class for score (Tailwind CSS)
 */
export function getScoreColorClass(score: number): string {
  if (score >= 9) return "text-yellow-500"; // Excellent - Gold
  if (score >= 7) return "text-green-500"; // Good - Green
  if (score >= 5) return "text-blue-500"; // Fair - Blue
  return "text-orange-500"; // Challenging - Orange
}

/**
 * Get background color class for score (Tailwind CSS)
 */
export function getScoreBgClass(score: number): string {
  if (score >= 9) return "bg-yellow-500/10"; // Excellent
  if (score >= 7) return "bg-green-500/10"; // Good
  if (score >= 5) return "bg-blue-500/10"; // Fair
  return "bg-orange-500/10"; // Challenging
}

// ============================================================================
// Export lucky colors and directions for UI usage
// ============================================================================

export { LUCKY_COLORS, LUCKY_DIRECTIONS };
