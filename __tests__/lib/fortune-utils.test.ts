/**
 * Unit tests for Fortune Utilities
 * 
 * Tests business logic for fortune generation, formatting, and manipulation
 */

import {
  FortuneGenerator,
  FortuneThemeUtils,
  FortuneStatsUtils,
  type Fortune,
  type FortuneTheme
} from '@/lib/fortune-utils'

describe('FortuneGenerator', () => {
  describe('generateLuckyNumbers', () => {
    it('should generate 6 unique numbers', () => {
      const numbers = FortuneGenerator.generateLuckyNumbers()
      
      expect(numbers).toHaveLength(6)
      expect(new Set(numbers).size).toBe(6) // All unique
    })

    it('should generate numbers between 1 and 69', () => {
      const numbers = FortuneGenerator.generateLuckyNumbers()
      
      numbers.forEach(num => {
        expect(num).toBeGreaterThanOrEqual(1)
        expect(num).toBeLessThanOrEqual(69)
      })
    })

    it('should return sorted numbers', () => {
      const numbers = FortuneGenerator.generateLuckyNumbers()
      const sorted = [...numbers].sort((a, b) => a - b)
      
      expect(numbers).toEqual(sorted)
    })
  })

  describe('generateCustomLuckyNumbers', () => {
    it('should generate custom count of numbers', () => {
      const numbers = FortuneGenerator.generateCustomLuckyNumbers(5, 50, 1)
      
      expect(numbers).toHaveLength(5)
    })

    it('should respect custom range', () => {
      const numbers = FortuneGenerator.generateCustomLuckyNumbers(5, 20, 10)
      
      numbers.forEach(num => {
        expect(num).toBeGreaterThanOrEqual(10)
        expect(num).toBeLessThanOrEqual(20)
      })
    })

    it('should throw error if count exceeds range', () => {
      expect(() => {
        FortuneGenerator.generateCustomLuckyNumbers(10, 5, 1)
      }).toThrow('Count cannot exceed the range of possible numbers')
    })
  })

  describe('selectRandomTheme', () => {
    it('should return a valid theme', () => {
      const theme = FortuneGenerator.selectRandomTheme()
      const validThemes = ['funny', 'inspirational', 'love', 'success', 'wisdom']
      
      expect(validThemes).toContain(theme)
    })

    it('should exclude random theme by default', () => {
      const themes = Array.from({ length: 20 }, () => 
        FortuneGenerator.selectRandomTheme()
      )
      
      expect(themes).not.toContain('random')
    })

    it('should include random theme when specified', () => {
      const themes = Array.from({ length: 50 }, () => 
        FortuneGenerator.selectRandomTheme(false)
      )
      
      // With 50 attempts, we should see 'random' at least once
      const hasRandom = themes.includes('random')
      expect(hasRandom).toBe(true)
    })
  })

  describe('formatFortune', () => {
    it('should capitalize first letter', () => {
      const formatted = FortuneGenerator.formatFortune('your future is bright')
      
      expect(formatted).toBe('Your future is bright.')
    })

    it('should add period if missing', () => {
      const formatted = FortuneGenerator.formatFortune('Your future is bright')
      
      expect(formatted).toBe('Your future is bright.')
    })

    it('should not add period if punctuation exists', () => {
      const formatted1 = FortuneGenerator.formatFortune('Your future is bright!')
      const formatted2 = FortuneGenerator.formatFortune('Is your future bright?')
      
      expect(formatted1).toBe('Your future is bright!')
      expect(formatted2).toBe('Is your future bright?')
    })

    it('should remove surrounding quotes', () => {
      const formatted1 = FortuneGenerator.formatFortune('"Your future is bright"')
      const formatted2 = FortuneGenerator.formatFortune("'Your future is bright'")
      
      expect(formatted1).toBe('Your future is bright.')
      expect(formatted2).toBe('Your future is bright.')
    })

    it('should throw error for empty message', () => {
      expect(() => {
        FortuneGenerator.formatFortune('')
      }).toThrow('Fortune message cannot be empty')
      
      expect(() => {
        FortuneGenerator.formatFortune('   ')
      }).toThrow('Fortune message cannot be empty')
    })
  })

  describe('validateMessageLength', () => {
    it('should validate message length', () => {
      expect(FortuneGenerator.validateMessageLength('Short message', 100)).toBe(true)
      expect(FortuneGenerator.validateMessageLength('', 100)).toBe(false)
      expect(FortuneGenerator.validateMessageLength('A'.repeat(201), 200)).toBe(false)
    })
  })

  describe('cleanMessage', () => {
    it('should remove excessive whitespace', () => {
      const clean = FortuneGenerator.cleanMessage('  Your   future  is   bright  ')
      
      expect(clean).toBe('Your future is bright')
    })

    it('should replace newlines with spaces', () => {
      const clean = FortuneGenerator.cleanMessage('Your\nfuture\nis\nbright')
      
      expect(clean).toBe('Your future is bright')
    })

    it('should remove special characters', () => {
      const clean = FortuneGenerator.cleanMessage('Your future is bright! @#$%')
      
      expect(clean).toBe('Your future is bright!')
    })
  })

  describe('getLengthRange', () => {
    it('should return correct ranges', () => {
      expect(FortuneGenerator.getLengthRange('short')).toEqual({ min: 20, max: 50 })
      expect(FortuneGenerator.getLengthRange('medium')).toEqual({ min: 50, max: 80 })
      expect(FortuneGenerator.getLengthRange('long')).toEqual({ min: 80, max: 120 })
    })
  })

  describe('createFortune', () => {
    it('should create complete fortune object', () => {
      const fortune = FortuneGenerator.createFortune(
        'your future is bright',
        'inspirational'
      )
      
      expect(fortune).toHaveProperty('message')
      expect(fortune).toHaveProperty('luckyNumbers')
      expect(fortune).toHaveProperty('theme')
      expect(fortune).toHaveProperty('timestamp')
      
      expect(fortune.message).toBe('Your future is bright.')
      expect(fortune.theme).toBe('inspirational')
      expect(fortune.luckyNumbers).toHaveLength(6)
    })

    it('should accept custom lucky numbers', () => {
      const customNumbers = [1, 2, 3, 4, 5, 6]
      const fortune = FortuneGenerator.createFortune(
        'your future is bright',
        'inspirational',
        customNumbers
      )
      
      expect(fortune.luckyNumbers).toEqual(customNumbers)
    })
  })
})

describe('FortuneThemeUtils', () => {
  describe('getAllThemes', () => {
    it('should return all themes including random', () => {
      const themes = FortuneThemeUtils.getAllThemes()
      
      expect(themes).toHaveLength(6)
      expect(themes).toContain('random')
    })

    it('should exclude random when specified', () => {
      const themes = FortuneThemeUtils.getAllThemes(false)
      
      expect(themes).toHaveLength(5)
      expect(themes).not.toContain('random')
    })
  })

  describe('getThemeDisplayName', () => {
    it('should return correct display names', () => {
      expect(FortuneThemeUtils.getThemeDisplayName('funny')).toBe('Funny')
      expect(FortuneThemeUtils.getThemeDisplayName('inspirational')).toBe('Inspirational')
      expect(FortuneThemeUtils.getThemeDisplayName('love')).toBe('Love')
    })
  })

  describe('getThemeDescription', () => {
    it('should return theme descriptions', () => {
      const desc = FortuneThemeUtils.getThemeDescription('funny')
      
      expect(desc).toContain('Humorous')
      expect(typeof desc).toBe('string')
      expect(desc.length).toBeGreaterThan(0)
    })
  })

  describe('getThemeEmoji', () => {
    it('should return theme emojis', () => {
      expect(FortuneThemeUtils.getThemeEmoji('funny')).toBe('😄')
      expect(FortuneThemeUtils.getThemeEmoji('inspirational')).toBe('✨')
      expect(FortuneThemeUtils.getThemeEmoji('love')).toBe('❤️')
    })
  })

  describe('isValidTheme', () => {
    it('should validate themes', () => {
      expect(FortuneThemeUtils.isValidTheme('funny')).toBe(true)
      expect(FortuneThemeUtils.isValidTheme('invalid')).toBe(false)
    })
  })
})

describe('FortuneStatsUtils', () => {
  const mockFortunes: Fortune[] = [
    {
      message: 'Short',
      luckyNumbers: [1, 2, 3, 4, 5, 6],
      theme: 'funny',
      timestamp: '2024-01-01T00:00:00Z'
    },
    {
      message: 'Medium length message',
      luckyNumbers: [7, 8, 9, 10, 11, 12],
      theme: 'inspirational',
      timestamp: '2024-01-02T00:00:00Z'
    },
    {
      message: 'This is a longer message for testing',
      luckyNumbers: [1, 7, 13, 19, 25, 31],
      theme: 'funny',
      timestamp: '2024-01-03T00:00:00Z'
    }
  ]

  describe('calculateAverageLength', () => {
    it('should calculate average message length', () => {
      const avg = FortuneStatsUtils.calculateAverageLength(mockFortunes)
      
      expect(avg).toBeGreaterThan(0)
      expect(typeof avg).toBe('number')
    })

    it('should return 0 for empty array', () => {
      const avg = FortuneStatsUtils.calculateAverageLength([])
      
      expect(avg).toBe(0)
    })
  })

  describe('getThemeDistribution', () => {
    it('should count theme occurrences', () => {
      const dist = FortuneStatsUtils.getThemeDistribution(mockFortunes)
      
      expect(dist['funny']).toBe(2)
      expect(dist['inspirational']).toBe(1)
    })
  })

  describe('getMostCommonLuckyNumbers', () => {
    it('should return most common numbers', () => {
      const common = FortuneStatsUtils.getMostCommonLuckyNumbers(mockFortunes, 5)
      
      expect(common).toHaveLength(5)
      expect(common[0]).toHaveLength(2) // [number, count]
      
      // Number 1 and 7 appear twice
      const topNumbers = common.map(([num]) => num)
      expect(topNumbers).toContain(1)
      expect(topNumbers).toContain(7)
    })

    it('should sort by frequency', () => {
      const common = FortuneStatsUtils.getMostCommonLuckyNumbers(mockFortunes)
      
      // Check that counts are in descending order
      for (let i = 0; i < common.length - 1; i++) {
        expect(common[i]![1]).toBeGreaterThanOrEqual(common[i + 1]![1])
      }
    })
  })
})

