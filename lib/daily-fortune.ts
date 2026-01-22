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
  localizeFortune,
} from "./fortune-database";
import { i18n, type Locale } from "./i18n-config";

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

const LUCKY_COLOR_LABELS: Record<Locale, Record<string, string>> = {
  en: {
    Red: "Red",
    Orange: "Orange",
    Yellow: "Yellow",
    Green: "Green",
    Blue: "Blue",
    Purple: "Purple",
    Pink: "Pink",
    Gold: "Gold",
    Silver: "Silver",
    Teal: "Teal",
  },
  zh: {
    Red: "红色",
    Orange: "橙色",
    Yellow: "黄色",
    Green: "绿色",
    Blue: "蓝色",
    Purple: "紫色",
    Pink: "粉色",
    Gold: "金色",
    Silver: "银色",
    Teal: "蓝绿色",
  },
  es: {
    Red: "Rojo",
    Orange: "Naranja",
    Yellow: "Amarillo",
    Green: "Verde",
    Blue: "Azul",
    Purple: "Morado",
    Pink: "Rosa",
    Gold: "Dorado",
    Silver: "Plateado",
    Teal: "Verde azulado",
  },
  pt: {
    Red: "Vermelho",
    Orange: "Laranja",
    Yellow: "Amarelo",
    Green: "Verde",
    Blue: "Azul",
    Purple: "Roxo",
    Pink: "Rosa",
    Gold: "Dourado",
    Silver: "Prata",
    Teal: "Verde-água",
  },
};

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

const LUCKY_DIRECTION_LABELS: Record<Locale, Record<string, string>> = {
  en: {
    North: "North",
    Northeast: "Northeast",
    East: "East",
    Southeast: "Southeast",
    South: "South",
    Southwest: "Southwest",
    West: "West",
    Northwest: "Northwest",
  },
  zh: {
    North: "北",
    Northeast: "东北",
    East: "东",
    Southeast: "东南",
    South: "南",
    Southwest: "西南",
    West: "西",
    Northwest: "西北",
  },
  es: {
    North: "Norte",
    Northeast: "Noreste",
    East: "Este",
    Southeast: "Sureste",
    South: "Sur",
    Southwest: "Suroeste",
    West: "Oeste",
    Northwest: "Noroeste",
  },
  pt: {
    North: "Norte",
    Northeast: "Nordeste",
    East: "Leste",
    Southeast: "Sudeste",
    South: "Sul",
    Southwest: "Sudoeste",
    West: "Oeste",
    Northwest: "Noroeste",
  },
};

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

const DAILY_ADVICE_BY_LOCALE: Record<Locale, typeof DAILY_ADVICE> = {
  en: DAILY_ADVICE,
  zh: {
    high: [
      "今天是你的好日子！大胆行动，抓住机会。",
      "星象对你有利，信任你的直觉。",
      "好运相伴，记得把好心情分享给他人。",
      "正能量会吸引成功，保持自信！",
      "美好将临，保持开放与好奇。",
    ],
    medium: [
      "今天节奏平稳，专注稳步前进。",
      "花点时间思考，规划下一步。",
      "今日的小努力，会成为明日的大成果。",
      "保持耐心与积极，好事会发生。",
      "相信过程，每一步都算数。",
    ],
    low: [
      "适合休息与反思，给自己充电。",
      "今天重在自我照顾，明天会更好。",
      "挑战是垫脚石，从经历中学习。",
      "有时最好的行动是不行动，保持耐心。",
      "用今天准备更明亮的明天。",
    ],
  },
  es: {
    high: [
      "¡Hoy es tu día! Actúa con valentía y aprovecha las oportunidades.",
      "Las estrellas están de tu lado. Confía en tu intuición.",
      "La fortuna te sonríe. Comparte tu buena suerte con los demás.",
      "Tu energía positiva atraerá el éxito. ¡Mantén la confianza!",
      "Hoy te esperan grandes cosas. Mantente abierto a nuevas posibilidades.",
    ],
    medium: [
      "Un día equilibrado. Enfócate en un progreso constante.",
      "Tómate un tiempo para reflexionar y planear tus próximos pasos.",
      "Pequeños esfuerzos hoy traerán grandes resultados mañana.",
      "Mantén la paciencia y una actitud positiva. Lo bueno llegará.",
      "Confía en el proceso. Cada paso cuenta.",
    ],
    low: [
      "Un día para descansar y reflexionar. Tómatelo con calma.",
      "Prioriza el autocuidado hoy. Mañana trae nuevas oportunidades.",
      "Los retos son peldaños. Aprende de lo vivido hoy.",
      "A veces la mejor acción es no actuar. Sé paciente.",
      "Usa el día de hoy para prepararte para tiempos mejores.",
    ],
  },
  pt: {
    high: [
      "Hoje é o seu dia! Aja com coragem e aproveite as oportunidades.",
      "As estrelas estão a seu favor. Confie na sua intuição.",
      "A sorte sorri para você. Compartilhe sua boa sorte.",
      "Sua energia positiva atrairá sucesso. Mantenha a confiança!",
      "Grandes coisas esperam por você hoje. Fique aberto ao novo.",
    ],
    medium: [
      "Um dia equilibrado. Foque em um progresso constante.",
      "Reserve um tempo para refletir e planejar os próximos passos.",
      "Pequenos esforços hoje trarão grandes resultados amanhã.",
      "Mantenha a paciência e o otimismo. Coisas boas virão.",
      "Confie no processo. Cada passo conta.",
    ],
    low: [
      "Um dia para descanso e reflexão. Vá com calma.",
      "Foque no autocuidado hoje. Amanhã trará novas oportunidades.",
      "Desafios são degraus. Aprenda com o dia de hoje.",
      "Às vezes, a melhor ação é não agir. Tenha paciência.",
      "Use o dia de hoje para se preparar para dias melhores.",
    ],
  },
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

function getLocalizedColorName(
  colorName: string,
  locale?: Locale,
): string {
  if (!locale || locale === i18n.defaultLocale) {
    return colorName;
  }
  return LUCKY_COLOR_LABELS[locale]?.[colorName] ?? colorName;
}

function getLocalizedDirectionName(
  directionName: string,
  locale?: Locale,
): string {
  if (!locale || locale === i18n.defaultLocale) {
    return directionName;
  }
  return LUCKY_DIRECTION_LABELS[locale]?.[directionName] ?? directionName;
}

/**
 * Select daily advice based on overall score
 */
export function selectDailyAdvice(
  seed: number,
  overallScore: number,
  locale?: Locale,
): string {
  const rng = new SeededRandom(seed + 11111);

  let advicePool: string[];
  if (overallScore >= 8) {
    advicePool = (DAILY_ADVICE_BY_LOCALE[locale ?? i18n.defaultLocale] ??
      DAILY_ADVICE).high;
  } else if (overallScore >= 5) {
    advicePool = (DAILY_ADVICE_BY_LOCALE[locale ?? i18n.defaultLocale] ??
      DAILY_ADVICE).medium;
  } else {
    advicePool = (DAILY_ADVICE_BY_LOCALE[locale ?? i18n.defaultLocale] ??
      DAILY_ADVICE).low;
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
  locale?: Locale,
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
  const localizedFortune = locale ? localizeFortune(fortune, locale) : fortune;
  const luckyColorObj = selectLuckyColor(seed);
  const luckyDirectionObj = selectLuckyDirection(seed);
  const advice = selectDailyAdvice(seed, scores.overall, locale);

  return {
    date: dateStr,
    fortune: localizedFortune,
    scores,
    luckyColor: `${luckyColorObj.emoji} ${getLocalizedColorName(
      luckyColorObj.name,
      locale,
    )}`,
    luckyDirection: `${luckyDirectionObj.emoji} ${getLocalizedDirectionName(
      luckyDirectionObj.name,
      locale,
    )}`,
    advice,
  };
}

/**
 * Get today's fortune
 */
export function getTodayFortune(
  category?: FortuneCategory,
  locale?: Locale,
): DailyFortune {
  return generateDailyFortune(getTodayDateString(), category, locale);
}

/**
 * Get tomorrow's fortune (for preview)
 */
export function getTomorrowFortune(
  category?: FortuneCategory,
  locale?: Locale,
): DailyFortune {
  return generateDailyFortune(getTomorrowDateString(), category, locale);
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

// ============================================================================
// Calendar Utilities
// ============================================================================

/**
 * Generate fortunes for a month (for calendar view)
 * @param year - Year (e.g., 2024)
 * @param month - Month (0-11, JavaScript Date format)
 * @returns Array of daily fortunes for the month
 */
export function getMonthFortunes(
  year: number,
  month: number,
  locale?: Locale,
): DailyFortune[] {
  const fortunes: DailyFortune[] = [];
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(Date.UTC(year, month, day));
    const dateStr = date.toISOString().split("T")[0] ?? "";
    fortunes.push(generateDailyFortune(dateStr, undefined, locale));
  }

  return fortunes;
}

/**
 * Get fortune for a specific date
 * @param year - Year
 * @param month - Month (0-11)
 * @param day - Day of month
 * @returns Daily fortune for the specified date
 */
export function getDateFortune(
  year: number,
  month: number,
  day: number,
  locale?: Locale,
): DailyFortune {
  const date = new Date(Date.UTC(year, month, day));
  const dateStr = date.toISOString().split("T")[0] ?? "";
  return generateDailyFortune(dateStr, undefined, locale);
}

/**
 * Check if a date is today
 */
export function isToday(dateStr: string): boolean {
  return dateStr === getTodayDateString();
}

/**
 * Check if a date is in the past
 */
export function isPastDate(dateStr: string): boolean {
  return dateStr < getTodayDateString();
}

/**
 * Check if a date is in the future
 */
export function isFutureDate(dateStr: string): boolean {
  return dateStr > getTodayDateString();
}

/**
 * Get week day names
 */
export function getWeekDayNames(
  locale: string = "en-US",
  format: "long" | "short" | "narrow" = "short",
): string[] {
  const formatter = new Intl.DateTimeFormat(locale, { weekday: format });
  const days: string[] = [];

  // Start from Sunday (0) to Saturday (6)
  // Dec 31, 2023 was Sunday, so we use it as reference
  for (let i = 0; i < 7; i++) {
    const adjustedDate = new Date(2023, 11, 31 + i);
    days.push(formatter.format(adjustedDate));
  }

  return days;
}

/**
 * Get month name
 */
export function getMonthName(
  year: number,
  month: number,
  locale: string = "en-US",
  format: "long" | "short" = "long",
): string {
  const date = new Date(year, month, 1);
  return new Intl.DateTimeFormat(locale, { month: format }).format(date);
}

/**
 * Get calendar grid data for a month
 * Returns a 2D array representing weeks and days, including padding days from adjacent months
 */
export interface CalendarDay {
  date: string; // ISO date string
  day: number; // Day of month
  isCurrentMonth: boolean;
  isToday: boolean;
  isPast: boolean;
  isFuture: boolean;
  fortune?: DailyFortune;
}

export function getCalendarGrid(
  year: number,
  month: number,
  includeFortunes: boolean = true,
  locale?: Locale,
): CalendarDay[][] {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startDayOfWeek = firstDay.getDay(); // 0 = Sunday

  const todayStr = getTodayDateString();
  const grid: CalendarDay[][] = [];
  let currentWeek: CalendarDay[] = [];

  // Add padding days from previous month
  const prevMonthLastDay = new Date(year, month, 0).getDate();
  for (let i = startDayOfWeek - 1; i >= 0; i--) {
    const day = prevMonthLastDay - i;
    const prevMonth = month === 0 ? 11 : month - 1;
    const prevYear = month === 0 ? year - 1 : year;
    const date = new Date(Date.UTC(prevYear, prevMonth, day));
    const dateStr = date.toISOString().split("T")[0] ?? "";

    currentWeek.push({
      date: dateStr,
      day,
      isCurrentMonth: false,
      isToday: dateStr === todayStr,
      isPast: dateStr < todayStr,
      isFuture: dateStr > todayStr,
      fortune: includeFortunes
        ? generateDailyFortune(dateStr, undefined, locale)
        : undefined,
    });
  }

  // Add days of current month
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(Date.UTC(year, month, day));
    const dateStr = date.toISOString().split("T")[0] ?? "";

    currentWeek.push({
      date: dateStr,
      day,
      isCurrentMonth: true,
      isToday: dateStr === todayStr,
      isPast: dateStr < todayStr,
      isFuture: dateStr > todayStr,
      fortune: includeFortunes
        ? generateDailyFortune(dateStr, undefined, locale)
        : undefined,
    });

    if (currentWeek.length === 7) {
      grid.push(currentWeek);
      currentWeek = [];
    }
  }

  // Add padding days from next month
  if (currentWeek.length > 0) {
    let nextDay = 1;
    const nextMonth = month === 11 ? 0 : month + 1;
    const nextYear = month === 11 ? year + 1 : year;

    while (currentWeek.length < 7) {
      const date = new Date(Date.UTC(nextYear, nextMonth, nextDay));
      const dateStr = date.toISOString().split("T")[0] ?? "";

      currentWeek.push({
        date: dateStr,
        day: nextDay,
        isCurrentMonth: false,
        isToday: dateStr === todayStr,
        isPast: dateStr < todayStr,
        isFuture: dateStr > todayStr,
        fortune: includeFortunes
          ? generateDailyFortune(dateStr, undefined, locale)
          : undefined,
      });
      nextDay++;
    }
    grid.push(currentWeek);
  }

  return grid;
}
