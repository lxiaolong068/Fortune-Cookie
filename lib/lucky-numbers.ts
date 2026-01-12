/**
 * Lucky Numbers System
 *
 * Provides meanings, utilities, and date-based calculations for lucky numbers.
 * Numbers 1-63 have culturally-inspired meanings for fortune cookie context.
 */

export interface LuckyNumberMeaning {
  number: number;
  meaning: string;
  shortMeaning: string; // For tooltips
  category:
    | "prosperity"
    | "love"
    | "wisdom"
    | "health"
    | "adventure"
    | "spiritual";
  element?: "fire" | "water" | "earth" | "wood" | "metal";
}

/**
 * Lucky number meanings database (1-63)
 * Inspired by numerology, Chinese culture, and fortune cookie traditions
 */
export const luckyNumberMeanings: Record<number, LuckyNumberMeaning> = {
  // 1-10: Foundation Numbers
  1: {
    number: 1,
    meaning:
      "New beginnings and fresh starts await you. Leadership opportunities will arise.",
    shortMeaning: "New beginnings",
    category: "prosperity",
    element: "fire",
  },
  2: {
    number: 2,
    meaning:
      "Partnership and balance will bring harmony to your life. Cooperation is key.",
    shortMeaning: "Partnership & balance",
    category: "love",
    element: "water",
  },
  3: {
    number: 3,
    meaning:
      "Creativity flows through you. Express yourself and joy will follow.",
    shortMeaning: "Creativity & joy",
    category: "wisdom",
    element: "wood",
  },
  4: {
    number: 4,
    meaning:
      "Stability and solid foundations are being built. Trust the process.",
    shortMeaning: "Stability & foundation",
    category: "prosperity",
    element: "earth",
  },
  5: {
    number: 5,
    meaning:
      "Change and adventure beckon. Embrace the unexpected journey ahead.",
    shortMeaning: "Change & adventure",
    category: "adventure",
    element: "metal",
  },
  6: {
    number: 6,
    meaning:
      "Love and family connections strengthen. Nurture your relationships.",
    shortMeaning: "Love & family",
    category: "love",
    element: "water",
  },
  7: {
    number: 7,
    meaning: "Inner wisdom grows. Seek knowledge and spiritual understanding.",
    shortMeaning: "Wisdom & spirituality",
    category: "spiritual",
    element: "water",
  },
  8: {
    number: 8,
    meaning:
      "Abundance and prosperity flow toward you. Financial success is near.",
    shortMeaning: "Abundance & wealth",
    category: "prosperity",
    element: "earth",
  },
  9: {
    number: 9,
    meaning:
      "Completion and fulfillment. A cycle ends, bringing wisdom and peace.",
    shortMeaning: "Completion & wisdom",
    category: "wisdom",
    element: "fire",
  },
  10: {
    number: 10,
    meaning:
      "Perfect wholeness achieved. All aspects of life align harmoniously.",
    shortMeaning: "Wholeness & harmony",
    category: "spiritual",
    element: "metal",
  },

  // 11-20: Growth Numbers
  11: {
    number: 11,
    meaning:
      "Master number of intuition. Trust your instincts in important decisions.",
    shortMeaning: "Intuition & insight",
    category: "spiritual",
    element: "fire",
  },
  12: {
    number: 12,
    meaning:
      "Cosmic order guides you. The universe has a plan for your success.",
    shortMeaning: "Cosmic guidance",
    category: "spiritual",
    element: "water",
  },
  13: {
    number: 13,
    meaning:
      "Transformation awaits. What seems unlucky brings hidden blessings.",
    shortMeaning: "Transformation",
    category: "adventure",
    element: "earth",
  },
  14: {
    number: 14,
    meaning: "Freedom and independence strengthen. Forge your own path boldly.",
    shortMeaning: "Freedom & independence",
    category: "adventure",
    element: "wood",
  },
  15: {
    number: 15,
    meaning: "Harmony in home life. Domestic happiness and comfort increase.",
    shortMeaning: "Home harmony",
    category: "love",
    element: "earth",
  },
  16: {
    number: 16,
    meaning:
      "Spiritual awakening approaches. Inner growth leads to outer success.",
    shortMeaning: "Spiritual awakening",
    category: "spiritual",
    element: "fire",
  },
  17: {
    number: 17,
    meaning:
      "Good fortune in endeavors. Your efforts will be rewarded handsomely.",
    shortMeaning: "Good fortune",
    category: "prosperity",
    element: "metal",
  },
  18: {
    number: 18,
    meaning:
      "Prosperity and life force combine. Health and wealth walk together.",
    shortMeaning: "Health & prosperity",
    category: "health",
    element: "wood",
  },
  19: {
    number: 19,
    meaning: "Self-sufficiency grows. You have all you need to succeed within.",
    shortMeaning: "Self-reliance",
    category: "wisdom",
    element: "fire",
  },
  20: {
    number: 20,
    meaning:
      "Patience brings rewards. What you await will arrive at the perfect time.",
    shortMeaning: "Patience rewarded",
    category: "wisdom",
    element: "water",
  },

  // 21-30: Expansion Numbers
  21: {
    number: 21,
    meaning:
      "Success through creativity. Your unique ideas attract recognition.",
    shortMeaning: "Creative success",
    category: "prosperity",
    element: "wood",
  },
  22: {
    number: 22,
    meaning:
      "Master builder energy. Dreams become reality through dedicated work.",
    shortMeaning: "Dreams realized",
    category: "prosperity",
    element: "earth",
  },
  23: {
    number: 23,
    meaning:
      "Communication opens doors. Express yourself and opportunities appear.",
    shortMeaning: "Communication success",
    category: "wisdom",
    element: "metal",
  },
  24: {
    number: 24,
    meaning:
      "Nurturing energy surrounds you. Care for others returns multiplied.",
    shortMeaning: "Nurturing energy",
    category: "love",
    element: "water",
  },
  25: {
    number: 25,
    meaning:
      "Analysis leads to insight. Look deeper and find the answers you seek.",
    shortMeaning: "Deep insight",
    category: "wisdom",
    element: "metal",
  },
  26: {
    number: 26,
    meaning: "Material success approaches. Business ventures show promise now.",
    shortMeaning: "Business success",
    category: "prosperity",
    element: "earth",
  },
  27: {
    number: 27,
    meaning:
      "Humanitarian spirit grows. Helping others elevates your own path.",
    shortMeaning: "Humanitarian spirit",
    category: "spiritual",
    element: "water",
  },
  28: {
    number: 28,
    meaning:
      "Leadership with compassion. Guide others while staying true to yourself.",
    shortMeaning: "Compassionate leadership",
    category: "wisdom",
    element: "fire",
  },
  29: {
    number: 29,
    meaning:
      "Spiritual partnership. Deep connections form through shared beliefs.",
    shortMeaning: "Spiritual bonds",
    category: "love",
    element: "water",
  },
  30: {
    number: 30,
    meaning: "Self-expression brings joy. Share your talents with the world.",
    shortMeaning: "Joyful expression",
    category: "adventure",
    element: "fire",
  },

  // 31-40: Maturity Numbers
  31: {
    number: 31,
    meaning:
      "Practical creativity. Your ideas find grounded, successful expression.",
    shortMeaning: "Practical creativity",
    category: "prosperity",
    element: "earth",
  },
  32: {
    number: 32,
    meaning:
      "Joyful communication. Your words bring happiness to those around you.",
    shortMeaning: "Joyful words",
    category: "love",
    element: "wood",
  },
  33: {
    number: 33,
    meaning: "Master teacher energy. Share your wisdom and watch it multiply.",
    shortMeaning: "Teaching wisdom",
    category: "spiritual",
    element: "fire",
  },
  34: {
    number: 34,
    meaning:
      "Disciplined effort pays off. Consistent work brings consistent rewards.",
    shortMeaning: "Disciplined success",
    category: "prosperity",
    element: "metal",
  },
  35: {
    number: 35,
    meaning:
      "Adventure with purpose. Exploration leads to meaningful discovery.",
    shortMeaning: "Purposeful adventure",
    category: "adventure",
    element: "fire",
  },
  36: {
    number: 36,
    meaning: "Creative harmony. Artistic endeavors flourish and bring peace.",
    shortMeaning: "Creative harmony",
    category: "wisdom",
    element: "water",
  },
  37: {
    number: 37,
    meaning: "Individual expression. Your unique voice finds its audience.",
    shortMeaning: "Unique voice",
    category: "adventure",
    element: "metal",
  },
  38: {
    number: 38,
    meaning: "Abundant creativity. Ideas flow freely and manifest easily.",
    shortMeaning: "Flowing creativity",
    category: "prosperity",
    element: "wood",
  },
  39: {
    number: 39,
    meaning: "Artistic fulfillment. Beauty surrounds and flows through you.",
    shortMeaning: "Artistic beauty",
    category: "wisdom",
    element: "water",
  },
  40: {
    number: 40,
    meaning:
      "Practical wisdom emerges. Life experience becomes your greatest teacher.",
    shortMeaning: "Practical wisdom",
    category: "wisdom",
    element: "earth",
  },

  // 41-50: Wisdom Numbers
  41: {
    number: 41,
    meaning: "Organized success. Structure and planning lead to achievement.",
    shortMeaning: "Organized achievement",
    category: "prosperity",
    element: "earth",
  },
  42: {
    number: 42,
    meaning: "The answer you seek is closer than you think. Trust the process.",
    shortMeaning: "Answers near",
    category: "spiritual",
    element: "metal",
  },
  43: {
    number: 43,
    meaning:
      "Stable creativity. Your artistic side finds practical expression.",
    shortMeaning: "Stable creativity",
    category: "wisdom",
    element: "wood",
  },
  44: {
    number: 44,
    meaning:
      "Master number of manifestation. Thoughts become things rapidly now.",
    shortMeaning: "Rapid manifestation",
    category: "spiritual",
    element: "earth",
  },
  45: {
    number: 45,
    meaning: "Adventure and stability balance. Explore while staying grounded.",
    shortMeaning: "Balanced adventure",
    category: "adventure",
    element: "earth",
  },
  46: {
    number: 46,
    meaning: "Responsible love. Commitments deepen and strengthen bonds.",
    shortMeaning: "Deepening bonds",
    category: "love",
    element: "water",
  },
  47: {
    number: 47,
    meaning: "Analytical intuition. Logic and instinct combine for clarity.",
    shortMeaning: "Intuitive logic",
    category: "wisdom",
    element: "metal",
  },
  48: {
    number: 48,
    meaning:
      "Business and family align. Professional and personal life harmonize.",
    shortMeaning: "Life harmony",
    category: "prosperity",
    element: "water",
  },
  49: {
    number: 49,
    meaning:
      "Humanitarian success. Serving others brings personal fulfillment.",
    shortMeaning: "Service fulfillment",
    category: "spiritual",
    element: "fire",
  },
  50: {
    number: 50,
    meaning: "Personal freedom expands. New horizons open before you.",
    shortMeaning: "Expanding freedom",
    category: "adventure",
    element: "metal",
  },

  // 51-63: Mastery Numbers
  51: {
    number: 51,
    meaning: "Independent creativity. Your unique path leads to success.",
    shortMeaning: "Unique success",
    category: "adventure",
    element: "fire",
  },
  52: {
    number: 52,
    meaning:
      "Intuitive partnerships. Right connections appear at the right time.",
    shortMeaning: "Right connections",
    category: "love",
    element: "water",
  },
  53: {
    number: 53,
    meaning: "Expressive freedom. Communication barriers dissolve easily.",
    shortMeaning: "Free expression",
    category: "wisdom",
    element: "wood",
  },
  54: {
    number: 54,
    meaning: "Stable change. Transformation occurs smoothly and naturally.",
    shortMeaning: "Smooth change",
    category: "adventure",
    element: "earth",
  },
  55: {
    number: 55,
    meaning: "Master number of change. Major positive shifts accelerate now.",
    shortMeaning: "Positive shifts",
    category: "adventure",
    element: "fire",
  },
  56: {
    number: 56,
    meaning:
      "Loving responsibility. Caring for others strengthens your spirit.",
    shortMeaning: "Caring strength",
    category: "love",
    element: "water",
  },
  57: {
    number: 57,
    meaning:
      "Spiritual analysis. Deep understanding of life's mysteries grows.",
    shortMeaning: "Deep understanding",
    category: "spiritual",
    element: "water",
  },
  58: {
    number: 58,
    meaning: "Prosperous transformation. Change brings material improvement.",
    shortMeaning: "Prosperous change",
    category: "prosperity",
    element: "metal",
  },
  59: {
    number: 59,
    meaning: "Humanitarian freedom. Helping others sets your own spirit free.",
    shortMeaning: "Liberating service",
    category: "spiritual",
    element: "fire",
  },
  60: {
    number: 60,
    meaning: "Loving balance. Relationships find perfect equilibrium.",
    shortMeaning: "Relationship balance",
    category: "love",
    element: "water",
  },
  61: {
    number: 61,
    meaning: "Family prosperity. Home life flourishes with abundance.",
    shortMeaning: "Family abundance",
    category: "prosperity",
    element: "wood",
  },
  62: {
    number: 62,
    meaning: "Peaceful partnerships. Harmony reigns in all relationships.",
    shortMeaning: "Peaceful harmony",
    category: "love",
    element: "earth",
  },
  63: {
    number: 63,
    meaning: "Creative completion. A artistic cycle ends with satisfaction.",
    shortMeaning: "Creative fulfillment",
    category: "wisdom",
    element: "water",
  },
};

/**
 * Get meaning for a specific lucky number
 */
export function getLuckyNumberMeaning(num: number): LuckyNumberMeaning | null {
  return luckyNumberMeanings[num] || null;
}

/**
 * Get short meaning for tooltip display
 */
export function getShortMeaning(num: number): string {
  const meaning = luckyNumberMeanings[num];
  return meaning?.shortMeaning || `Lucky ${num}`;
}

/**
 * Get all numbers by category
 */
export function getNumbersByCategory(
  category: LuckyNumberMeaning["category"],
): LuckyNumberMeaning[] {
  return Object.values(luckyNumberMeanings).filter(
    (m) => m.category === category,
  );
}

/**
 * Get all numbers by element
 */
export function getNumbersByElement(
  element: NonNullable<LuckyNumberMeaning["element"]>,
): LuckyNumberMeaning[] {
  return Object.values(luckyNumberMeanings).filter(
    (m) => m.element === element,
  );
}

/**
 * Category configuration for display
 */
export const categoryConfig: Record<
  LuckyNumberMeaning["category"],
  { emoji: string; label: string; color: string }
> = {
  prosperity: { emoji: "💰", label: "Prosperity", color: "text-yellow-600" },
  love: { emoji: "❤️", label: "Love", color: "text-red-500" },
  wisdom: { emoji: "🧠", label: "Wisdom", color: "text-purple-600" },
  health: { emoji: "💚", label: "Health", color: "text-green-600" },
  adventure: { emoji: "🌟", label: "Adventure", color: "text-blue-500" },
  spiritual: { emoji: "✨", label: "Spiritual", color: "text-indigo-500" },
};

/**
 * Element configuration for display
 */
export const elementConfig: Record<
  NonNullable<LuckyNumberMeaning["element"]>,
  { emoji: string; label: string; color: string }
> = {
  fire: { emoji: "🔥", label: "Fire", color: "text-orange-500" },
  water: { emoji: "💧", label: "Water", color: "text-blue-400" },
  earth: { emoji: "🌍", label: "Earth", color: "text-amber-700" },
  wood: { emoji: "🌳", label: "Wood", color: "text-green-500" },
  metal: { emoji: "⚙️", label: "Metal", color: "text-gray-500" },
};

// ============================================
// Date-Based Lucky Numbers Utilities
// ============================================

/**
 * Seeded PRNG for consistent results per date
 */
class SeededRandom {
  private seed: number;

  constructor(seed: number) {
    this.seed = seed;
  }

  next(): number {
    this.seed = (this.seed * 1103515245 + 12345) & 0x7fffffff;
    return this.seed / 0x7fffffff;
  }

  nextInt(min: number, max: number): number {
    return Math.floor(this.next() * (max - min + 1)) + min;
  }
}

/**
 * Generate date seed from a Date object
 */
function getDateSeed(date: Date): number {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return year * 10000 + month * 100 + day;
}

/**
 * Get today's lucky numbers (consistent throughout the day)
 * @param count Number of lucky numbers to generate (default: 6)
 */
export function getTodaysLuckyNumbers(count: number = 6): number[] {
  return getLuckyNumbersForDate(new Date(), count);
}

/**
 * Get lucky numbers for a specific date
 * @param date The date to generate numbers for
 * @param count Number of lucky numbers to generate (default: 6)
 */
export function getLuckyNumbersForDate(
  date: Date,
  count: number = 6,
): number[] {
  const seed = getDateSeed(date);
  const rng = new SeededRandom(seed);
  const numbers: number[] = [];
  const used = new Set<number>();

  while (numbers.length < count) {
    const num = rng.nextInt(1, 63);
    if (!used.has(num)) {
      used.add(num);
      numbers.push(num);
    }
  }

  return numbers.sort((a, b) => a - b);
}

/**
 * Get lucky numbers for a specific date with meanings
 */
export function getLuckyNumbersWithMeanings(
  date: Date = new Date(),
  count: number = 6,
): Array<{ number: number; meaning: LuckyNumberMeaning | null }> {
  const numbers = getLuckyNumbersForDate(date, count);
  return numbers.map((num) => ({
    number: num,
    meaning: getLuckyNumberMeaning(num),
  }));
}

/**
 * Get personalized lucky numbers based on user input (e.g., birthdate)
 */
export function getPersonalizedLuckyNumbers(
  birthdate: Date,
  additionalSeed?: string,
  count: number = 6,
): number[] {
  let seed = getDateSeed(birthdate);

  // Add additional seed influence if provided
  if (additionalSeed) {
    for (let i = 0; i < additionalSeed.length; i++) {
      seed += additionalSeed.charCodeAt(i) * (i + 1);
    }
  }

  const rng = new SeededRandom(seed);
  const numbers: number[] = [];
  const used = new Set<number>();

  while (numbers.length < count) {
    const num = rng.nextInt(1, 63);
    if (!used.has(num)) {
      used.add(num);
      numbers.push(num);
    }
  }

  return numbers.sort((a, b) => a - b);
}

/**
 * Check if a number is in today's lucky numbers
 */
export function isNumberLuckyToday(num: number): boolean {
  const todaysNumbers = getTodaysLuckyNumbers();
  return todaysNumbers.includes(num);
}

/**
 * Get the "luckiest" number from a set based on today's alignment
 */
export function getLuckiestFromSet(numbers: number[]): number | null {
  if (numbers.length === 0) return null;

  const firstNumber = numbers[0];
  if (firstNumber === undefined) return null;

  const todaysNumbers = getTodaysLuckyNumbers();
  const matching = numbers.filter((n) => todaysNumbers.includes(n));

  if (matching.length > 0) {
    // Return the matching number with the "best" category
    const priorityOrder: LuckyNumberMeaning["category"][] = [
      "prosperity",
      "love",
      "wisdom",
      "health",
      "adventure",
      "spiritual",
    ];

    const firstMatch = matching[0];
    if (firstMatch === undefined) return firstNumber;

    let best = firstMatch;
    let bestPriority = 999;

    for (const num of matching) {
      const meaning = getLuckyNumberMeaning(num);
      if (meaning) {
        const priority = priorityOrder.indexOf(meaning.category);
        if (priority !== -1 && priority < bestPriority) {
          bestPriority = priority;
          best = num;
        }
      }
    }

    return best;
  }

  // If no match with today's numbers, return the first number
  return firstNumber;
}

/**
 * Format lucky numbers for display
 */
export function formatLuckyNumbers(numbers: number[]): string {
  return numbers.join(" • ");
}

/**
 * Get lucky number range info
 */
export const LUCKY_NUMBER_RANGE = {
  min: 1,
  max: 63,
  totalMeanings: Object.keys(luckyNumberMeanings).length,
} as const;
