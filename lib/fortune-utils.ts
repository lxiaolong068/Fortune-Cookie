/**
 * Fortune Utilities
 * 
 * Extracted business logic for fortune generation, formatting, and manipulation.
 * Separates pure business logic from API client code for better testability and maintainability.
 */

export type FortuneTheme = 'funny' | 'inspirational' | 'love' | 'success' | 'wisdom' | 'random'
export type FortuneMood = 'positive' | 'neutral' | 'motivational'
export type FortuneLength = 'short' | 'medium' | 'long'

export interface FortuneConfig {
  theme?: FortuneTheme
  mood?: FortuneMood
  length?: FortuneLength
  customPrompt?: string
}

export interface Fortune {
  message: string
  luckyNumbers: number[]
  theme: string
  timestamp: string
  source?: 'ai' | 'database' | 'fallback'
  cached?: boolean
  aiError?: {
    provider: 'openrouter' | string
    status?: number
    code?: string
    message: string
  }
}

/**
 * Fortune Generator Class
 * 
 * Handles all fortune-related business logic including:
 * - Lucky number generation
 * - Theme selection
 * - Fortune formatting
 * - Message validation
 */
export class FortuneGenerator {
  /**
   * Generate 6 unique lucky numbers between 1 and 69
   * Uses Set to ensure uniqueness and sorts the result
   * 
   * @returns Array of 6 sorted unique numbers
   * 
   * @example
   * ```ts
   * const numbers = FortuneGenerator.generateLuckyNumbers()
   * // [3, 12, 23, 45, 56, 68]
   * ```
   */
  static generateLuckyNumbers(): number[] {
    const numbers = new Set<number>()
    while (numbers.size < 6) {
      numbers.add(Math.floor(Math.random() * 69) + 1)
    }
    return Array.from(numbers).sort((a, b) => a - b)
  }

  /**
   * Generate lucky numbers with custom range and count
   * 
   * @param count - Number of lucky numbers to generate (default: 6)
   * @param max - Maximum number value (default: 69)
   * @param min - Minimum number value (default: 1)
   * @returns Array of sorted unique numbers
   * 
   * @example
   * ```ts
   * const numbers = FortuneGenerator.generateCustomLuckyNumbers(5, 50, 1)
   * // [5, 12, 23, 34, 48]
   * ```
   */
  static generateCustomLuckyNumbers(
    count: number = 6,
    max: number = 69,
    min: number = 1
  ): number[] {
    if (count > (max - min + 1)) {
      throw new Error('Count cannot exceed the range of possible numbers')
    }

    const numbers = new Set<number>()
    while (numbers.size < count) {
      numbers.add(Math.floor(Math.random() * (max - min + 1)) + min)
    }
    return Array.from(numbers).sort((a, b) => a - b)
  }

  /**
   * Select a random theme from available themes
   * 
   * @param excludeRandom - Whether to exclude 'random' from selection (default: true)
   * @returns Random theme
   * 
   * @example
   * ```ts
   * const theme = FortuneGenerator.selectRandomTheme()
   * // 'inspirational'
   * ```
   */
  static selectRandomTheme(excludeRandom: boolean = true): FortuneTheme {
    const themes: FortuneTheme[] = ['funny', 'inspirational', 'love', 'success', 'wisdom']
    
    if (!excludeRandom) {
      themes.push('random')
    }

    const randomIndex = Math.floor(Math.random() * themes.length)
    return themes[randomIndex]!
  }

  /**
   * Format a fortune message with proper capitalization and punctuation
   * 
   * @param message - Raw fortune message
   * @returns Formatted fortune message
   * 
   * @example
   * ```ts
   * const formatted = FortuneGenerator.formatFortune('your future is bright')
   * // 'Your future is bright.'
   * ```
   */
  static formatFortune(message: string): string {
    if (!message || message.trim().length === 0) {
      throw new Error('Fortune message cannot be empty')
    }

    let formatted = message.trim()

    // Remove surrounding quotes if present
    formatted = formatted.replace(/^["']|["']$/g, '')

    // Capitalize first letter
    formatted = formatted.charAt(0).toUpperCase() + formatted.slice(1)

    // Add period if not present and doesn't end with punctuation
    if (!/[.!?]$/.test(formatted)) {
      formatted += '.'
    }

    return formatted
  }

  /**
   * Validate fortune message length
   * 
   * @param message - Fortune message to validate
   * @param maxLength - Maximum allowed length (default: 200)
   * @returns True if valid, false otherwise
   * 
   * @example
   * ```ts
   * const isValid = FortuneGenerator.validateMessageLength('Your future is bright', 100)
   * // true
   * ```
   */
  static validateMessageLength(message: string, maxLength: number = 200): boolean {
    return message.length > 0 && message.length <= maxLength
  }

  /**
   * Clean and sanitize fortune message
   * Removes excessive whitespace, special characters, and normalizes text
   * 
   * @param message - Raw message to clean
   * @returns Cleaned message
   * 
   * @example
   * ```ts
   * const clean = FortuneGenerator.cleanMessage('  Your   future  is   bright!  ')
   * // 'Your future is bright!'
   * ```
   */
  static cleanMessage(message: string): string {
    let cleaned = message
      // Take only the first sentence/fortune if multiple are returned
      .split(/(?<=[.!?])\s+(?=[A-Z])/)[0] || message

    cleaned = cleaned
      // Add space before capital letters that follow lowercase (e.g., "gratitudewalk" -> "gratitude walk")
      .replace(/([a-z])([A-Z])/g, '$1 $2')
      // Add space around em-dashes
      .replace(/—/g, ' — ')
      .replace(/[^\w\s.,!?'"-]/g, '')  // Remove special characters except basic punctuation
      .replace(/\s+/g, ' ')  // Replace multiple spaces with single space
      .replace(/\n+/g, ' ')  // Replace newlines with space
      .trim()  // Trim after all replacements

    return cleaned
  }

  /**
   * Get character count for different fortune lengths
   * 
   * @param length - Fortune length type
   * @returns Object with min and max character counts
   * 
   * @example
   * ```ts
   * const range = FortuneGenerator.getLengthRange('medium')
   * // { min: 50, max: 80 }
   * ```
   */
  static getLengthRange(length: FortuneLength): { min: number; max: number } {
    const ranges = {
      short: { min: 20, max: 50 },
      medium: { min: 50, max: 80 },
      long: { min: 80, max: 120 }
    }
    return ranges[length]
  }

  /**
   * Create a complete fortune object
   * 
   * @param message - Fortune message
   * @param theme - Fortune theme
   * @param luckyNumbers - Optional custom lucky numbers
   * @returns Complete fortune object
   * 
   * @example
   * ```ts
   * const fortune = FortuneGenerator.createFortune(
   *   'Your future is bright',
   *   'inspirational'
   * )
   * ```
   */
  static createFortune(
    message: string,
    theme: FortuneTheme,
    luckyNumbers?: number[],
    source?: 'ai' | 'database' | 'fallback'
  ): Fortune {
    return {
      message: this.formatFortune(message),
      luckyNumbers: luckyNumbers || this.generateLuckyNumbers(),
      theme,
      timestamp: new Date().toISOString(),
      source
    }
  }
}

/**
 * Fortune Theme Utilities
 * 
 * Helper functions for working with fortune themes
 */
export class FortuneThemeUtils {
  /**
   * Get all available themes
   * 
   * @param includeRandom - Whether to include 'random' theme (default: true)
   * @returns Array of theme names
   */
  static getAllThemes(includeRandom: boolean = true): FortuneTheme[] {
    const themes: FortuneTheme[] = ['funny', 'inspirational', 'love', 'success', 'wisdom']
    if (includeRandom) {
      themes.push('random')
    }
    return themes
  }

  /**
   * Get theme display name
   * 
   * @param theme - Theme identifier
   * @returns Human-readable theme name
   * 
   * @example
   * ```ts
   * const name = FortuneThemeUtils.getThemeDisplayName('inspirational')
   * // 'Inspirational'
   * ```
   */
  static getThemeDisplayName(theme: FortuneTheme): string {
    const names: Record<FortuneTheme, string> = {
      funny: 'Funny',
      inspirational: 'Inspirational',
      love: 'Love',
      success: 'Success',
      wisdom: 'Wisdom',
      random: 'Random'
    }
    return names[theme]
  }

  /**
   * Get theme description
   * 
   * @param theme - Theme identifier
   * @returns Theme description
   */
  static getThemeDescription(theme: FortuneTheme): string {
    const descriptions: Record<FortuneTheme, string> = {
      funny: 'Humorous and lighthearted messages that make you smile',
      inspirational: 'Uplifting messages that inspire hope and positive action',
      love: 'Heartwarming messages about love and relationships',
      success: 'Messages about achievement and professional growth',
      wisdom: 'Thoughtful philosophical messages and life wisdom',
      random: 'A surprise mix of all fortune types'
    }
    return descriptions[theme]
  }

  /**
   * Get theme emoji
   * 
   * @param theme - Theme identifier
   * @returns Theme emoji
   */
  static getThemeEmoji(theme: FortuneTheme): string {
    const emojis: Record<FortuneTheme, string> = {
      funny: '😄',
      inspirational: '✨',
      love: '❤️',
      success: '🚀',
      wisdom: '🧠',
      random: '🎲'
    }
    return emojis[theme]
  }

  /**
   * Validate theme
   * 
   * @param theme - Theme to validate
   * @returns True if valid theme
   */
  static isValidTheme(theme: string): theme is FortuneTheme {
    return this.getAllThemes().includes(theme as FortuneTheme)
  }
}

/**
 * Fortune Statistics Utilities
 * 
 * Helper functions for fortune statistics and analytics
 */
export class FortuneStatsUtils {
  /**
   * Calculate average message length
   * 
   * @param fortunes - Array of fortunes
   * @returns Average message length
   */
  static calculateAverageLength(fortunes: Fortune[]): number {
    if (fortunes.length === 0) return 0
    const total = fortunes.reduce((sum, f) => sum + f.message.length, 0)
    return Math.round(total / fortunes.length)
  }

  /**
   * Get theme distribution
   * 
   * @param fortunes - Array of fortunes
   * @returns Object with theme counts
   */
  static getThemeDistribution(fortunes: Fortune[]): Record<string, number> {
    return fortunes.reduce((acc, fortune) => {
      acc[fortune.theme] = (acc[fortune.theme] || 0) + 1
      return acc
    }, {} as Record<string, number>)
  }

  /**
   * Get most common lucky numbers
   * 
   * @param fortunes - Array of fortunes
   * @param topN - Number of top numbers to return (default: 10)
   * @returns Array of [number, count] tuples
   */
  static getMostCommonLuckyNumbers(
    fortunes: Fortune[],
    topN: number = 10
  ): Array<[number, number]> {
    const counts: Record<number, number> = {}
    
    fortunes.forEach(fortune => {
      fortune.luckyNumbers.forEach(num => {
        counts[num] = (counts[num] || 0) + 1
      })
    })

    return Object.entries(counts)
      .map(([num, count]) => [parseInt(num), count] as [number, number])
      .sort((a, b) => b[1] - a[1])
      .slice(0, topN)
  }
}

// Export all utilities
const fortuneUtils = {
  FortuneGenerator,
  FortuneThemeUtils,
  FortuneStatsUtils,
} as const

export default fortuneUtils
