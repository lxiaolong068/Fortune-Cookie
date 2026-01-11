import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// SEO相关工具函数
export function generateMetaTitle(title: string, suffix?: string): string {
  const baseSuffix = suffix || "Fortune Cookie AI";
  return `${title} | ${baseSuffix}`;
}

export function generateMetaDescription(
  description: string,
  maxLength: number = 160,
): string {
  if (description.length <= maxLength) return description;
  return description.substring(0, maxLength - 3) + "...";
}

// 格式化日期
export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}

// 延迟函数
export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// 验证环境变量
export function getEnvVar(name: string, defaultValue?: string): string {
  const value = process.env[name];
  if (!value && !defaultValue) {
    throw new Error(`Environment variable ${name} is required`);
  }
  return value || defaultValue!;
}

// 生成唯一ID - 使用时间戳和计数器避免随机数
let idCounter = 0;
export function generateId(): string {
  return (++idCounter).toString(36) + Date.now().toString(36);
}

/**
 * Deterministic Pseudo-Random Number Generator (PRNG)
 *
 * Used to avoid SSR/CSR hydration mismatches by producing consistent
 * random sequences when given the same seed. Uses a Linear Congruential
 * Generator (LCG) algorithm.
 *
 * @example
 * ```ts
 * const rng = new SeededRandom(42)
 * const value = rng.next()      // Always same value for seed 42
 * const integer = rng.int(1, 10) // Random integer between 1-9
 * ```
 */
export class SeededRandom {
  private seed: number;

  /**
   * Create a new seeded random number generator
   * @param seed - Initial seed value (default: 12345)
   */
  constructor(seed: number = 12345) {
    this.seed = seed;
  }

  /**
   * Generate the next random number in the sequence
   * @returns A number between 0 (inclusive) and 1 (exclusive)
   */
  next(): number {
    this.seed = (this.seed * 9301 + 49297) % 233280;
    return this.seed / 233280;
  }

  /**
   * Generate a random number within a specified range
   * @param min - Minimum value (inclusive)
   * @param max - Maximum value (exclusive)
   * @returns A number between min and max
   */
  range(min: number, max: number): number {
    return min + this.next() * (max - min);
  }

  /**
   * Generate a random integer within a specified range
   * @param min - Minimum value (inclusive)
   * @param max - Maximum value (exclusive)
   * @returns An integer between min (inclusive) and max (exclusive)
   */
  int(min: number, max: number): number {
    return Math.floor(this.range(min, max));
  }
}

/**
 * Create a SeededRandom instance with a seed based on an index
 * Useful for generating deterministic random values per item in a list
 *
 * @param index - The index to use for generating the seed
 * @returns A new SeededRandom instance
 *
 * @example
 * ```ts
 * // Each particle gets consistent random values across renders
 * particles.map((_, i) => {
 *   const rng = createSeededRandom(i)
 *   return { x: rng.range(0, 100), y: rng.range(0, 100) }
 * })
 * ```
 */
export function createSeededRandom(index: number): SeededRandom {
  return new SeededRandom(12345 + index * 1000);
}
