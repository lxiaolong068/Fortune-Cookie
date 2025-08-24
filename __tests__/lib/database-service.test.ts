/**
 * @jest-environment node
 */

import { FortuneService, SessionService } from '@/lib/database-service'
import { mockFortune, mockFortuneList } from '../utils/test-utils'

// Mock Prisma client
const mockPrismaClient = {
  fortune: {
    create: jest.fn(),
    findMany: jest.fn(),
    findUnique: jest.fn(),
    findFirst: jest.fn(),
    count: jest.fn(),
    update: jest.fn(),
    groupBy: jest.fn(),
  },
  userSession: {
    create: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
    deleteMany: jest.fn(),
  },
}

jest.mock('@/lib/database', () => ({
  db: mockPrismaClient,
  DatabaseManager: {
    getInstance: jest.fn(() => mockPrismaClient),
    healthCheck: jest.fn(),
    getStats: jest.fn(),
  },
  QueryOptimizer: {
    buildPaginationQuery: jest.fn((page = 1, limit = 20) => ({
      skip: (page - 1) * limit,
      take: limit,
    })),
    buildFilterQuery: jest.fn((filters) => filters),
    buildSearchQuery: jest.fn((query) => 
      query ? { message: { contains: query, mode: 'insensitive' } } : {}
    ),
    buildSortQuery: jest.fn((sortBy = 'createdAt', sortOrder = 'desc') => ({
      [sortBy]: sortOrder,
    })),
  },
}))

jest.mock('@/lib/error-monitoring', () => ({
  captureError: jest.fn(),
  captureBusinessEvent: jest.fn(),
}))

describe('FortuneService', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('create', () => {
    it('creates a fortune successfully', async () => {
      const fortuneData = {
        message: '今天是美好的一天',
        category: 'inspirational',
        mood: 'positive',
        length: 'medium',
        tags: ['motivation', 'positive'],
      }

      mockPrismaClient.fortune.create.mockResolvedValue({
        ...mockFortune,
        ...fortuneData,
        tags: JSON.stringify(fortuneData.tags),
      })

      const result = await FortuneService.create(fortuneData)

      expect(mockPrismaClient.fortune.create).toHaveBeenCalledWith({
        data: {
          ...fortuneData,
          tags: JSON.stringify(fortuneData.tags),
        },
      })

      expect(result.message).toBe(fortuneData.message)
      expect(result.category).toBe(fortuneData.category)
    })

    it('handles creation errors', async () => {
      const fortuneData = {
        message: '测试消息',
        category: 'test',
        mood: 'positive',
        length: 'medium',
      }

      mockPrismaClient.fortune.create.mockRejectedValue(new Error('Database error'))

      await expect(FortuneService.create(fortuneData)).rejects.toThrow('Database error')
    })
  })

  describe('findMany', () => {
    it('returns paginated fortunes', async () => {
      const mockResults = mockFortuneList.slice(0, 2)
      const totalCount = 10

      mockPrismaClient.fortune.findMany.mockResolvedValue(mockResults)
      mockPrismaClient.fortune.count.mockResolvedValue(totalCount)

      const result = await FortuneService.findMany({
        page: 1,
        limit: 2,
        category: 'inspirational',
      })

      expect(result.fortunes).toEqual(mockResults)
      expect(result.total).toBe(totalCount)
      expect(result.hasMore).toBe(true)

      expect(mockPrismaClient.fortune.findMany).toHaveBeenCalledWith({
        where: { category: 'inspirational' },
        orderBy: { createdAt: 'desc' },
        skip: 0,
        take: 2,
      })
    })

    it('handles search queries', async () => {
      const searchQuery = '美好'
      mockPrismaClient.fortune.findMany.mockResolvedValue([mockFortune])
      mockPrismaClient.fortune.count.mockResolvedValue(1)

      const result = await FortuneService.findMany({
        search: searchQuery,
        limit: 10,
      })

      expect(mockPrismaClient.fortune.findMany).toHaveBeenCalledWith({
        where: {
          message: { contains: searchQuery, mode: 'insensitive' },
        },
        orderBy: { createdAt: 'desc' },
        skip: 0,
        take: 10,
      })

      expect(result.fortunes).toEqual([mockFortune])
    })

    it('handles database errors gracefully', async () => {
      mockPrismaClient.fortune.findMany.mockRejectedValue(new Error('Database error'))

      await expect(FortuneService.findMany()).rejects.toThrow('Database error')
    })
  })

  describe('findById', () => {
    it('returns fortune by ID', async () => {
      mockPrismaClient.fortune.findUnique.mockResolvedValue(mockFortune)

      const result = await FortuneService.findById('test-id')

      expect(result).toEqual(mockFortune)
      expect(mockPrismaClient.fortune.findUnique).toHaveBeenCalledWith({
        where: { id: 'test-id' },
      })
    })

    it('returns null for non-existent fortune', async () => {
      mockPrismaClient.fortune.findUnique.mockResolvedValue(null)

      const result = await FortuneService.findById('non-existent')

      expect(result).toBeNull()
    })

    it('handles database errors', async () => {
      mockPrismaClient.fortune.findUnique.mockRejectedValue(new Error('Database error'))

      const result = await FortuneService.findById('test-id')

      expect(result).toBeNull()
    })
  })

  describe('findRandom', () => {
    it('returns random fortune', async () => {
      mockPrismaClient.fortune.count.mockResolvedValue(10)
      mockPrismaClient.fortune.findFirst.mockResolvedValue(mockFortune)
      mockPrismaClient.fortune.update.mockResolvedValue(mockFortune)

      const result = await FortuneService.findRandom()

      expect(result).toEqual(mockFortune)
      expect(mockPrismaClient.fortune.count).toHaveBeenCalledWith({ where: {} })
      expect(mockPrismaClient.fortune.findFirst).toHaveBeenCalledWith({
        where: {},
        skip: expect.any(Number),
      })
    })

    it('returns random fortune by category', async () => {
      const category = 'inspirational'
      mockPrismaClient.fortune.count.mockResolvedValue(5)
      mockPrismaClient.fortune.findFirst.mockResolvedValue(mockFortune)
      mockPrismaClient.fortune.update.mockResolvedValue(mockFortune)

      const result = await FortuneService.findRandom(category)

      expect(result).toEqual(mockFortune)
      expect(mockPrismaClient.fortune.count).toHaveBeenCalledWith({
        where: { category },
      })
    })

    it('returns null when no fortunes exist', async () => {
      mockPrismaClient.fortune.count.mockResolvedValue(0)

      const result = await FortuneService.findRandom()

      expect(result).toBeNull()
    })

    it('increments popularity when fortune is found', async () => {
      mockPrismaClient.fortune.count.mockResolvedValue(1)
      mockPrismaClient.fortune.findFirst.mockResolvedValue(mockFortune)
      mockPrismaClient.fortune.update.mockResolvedValue(mockFortune)

      await FortuneService.findRandom()

      expect(mockPrismaClient.fortune.update).toHaveBeenCalledWith({
        where: { id: mockFortune.id },
        data: { popularity: { increment: 1 } },
      })
    })
  })

  describe('findPopular', () => {
    it('returns popular fortunes', async () => {
      const popularFortunes = mockFortuneList.slice(0, 2)
      mockPrismaClient.fortune.findMany.mockResolvedValue(popularFortunes)

      const result = await FortuneService.findPopular(2)

      expect(result).toEqual(popularFortunes)
      expect(mockPrismaClient.fortune.findMany).toHaveBeenCalledWith({
        orderBy: { popularity: 'desc' },
        take: 2,
      })
    })

    it('handles database errors', async () => {
      mockPrismaClient.fortune.findMany.mockRejectedValue(new Error('Database error'))

      const result = await FortuneService.findPopular()

      expect(result).toEqual([])
    })
  })

  describe('search', () => {
    it('searches fortunes by query', async () => {
      const query = '美好'
      const searchResults = [mockFortune]
      mockPrismaClient.fortune.findMany.mockResolvedValue(searchResults)

      const result = await FortuneService.search(query, { category: 'inspirational' })

      expect(result).toEqual(searchResults)
      expect(mockPrismaClient.fortune.findMany).toHaveBeenCalledWith({
        where: {
          message: { contains: query, mode: 'insensitive' },
          category: 'inspirational',
        },
        orderBy: { popularity: 'desc' },
        take: 50,
      })
    })

    it('handles search errors', async () => {
      mockPrismaClient.fortune.findMany.mockRejectedValue(new Error('Search error'))

      const result = await FortuneService.search('test')

      expect(result).toEqual([])
    })
  })

  describe('getStats', () => {
    it('returns fortune statistics', async () => {
      const mockStats = {
        total: 100,
        byCategory: [
          { category: 'inspirational', _count: { category: 50 } },
          { category: 'love', _count: { category: 30 } },
        ],
        byMood: [
          { mood: 'positive', _count: { mood: 70 } },
          { mood: 'neutral', _count: { mood: 30 } },
        ],
        recent: 10,
      }

      mockPrismaClient.fortune.count
        .mockResolvedValueOnce(mockStats.total)
        .mockResolvedValueOnce(mockStats.recent)

      mockPrismaClient.fortune.groupBy
        .mockResolvedValueOnce(mockStats.byCategory)
        .mockResolvedValueOnce(mockStats.byMood)

      const result = await FortuneService.getStats()

      expect(result.total).toBe(100)
      expect(result.byCategory).toEqual({
        inspirational: 50,
        love: 30,
      })
      expect(result.byMood).toEqual({
        positive: 70,
        neutral: 30,
      })
      expect(result.recent).toBe(10)
    })

    it('handles stats errors', async () => {
      mockPrismaClient.fortune.count.mockRejectedValue(new Error('Stats error'))

      const result = await FortuneService.getStats()

      expect(result).toEqual({
        total: 0,
        byCategory: {},
        byMood: {},
        recent: 0,
      })
    })
  })
})

describe('SessionService', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('create', () => {
    it('creates a user session', async () => {
      const sessionData = {
        sessionId: 'test-session-123',
        userId: 'user-456',
        ipAddress: '127.0.0.1',
        userAgent: 'Test Agent',
        data: { theme: 'dark' },
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      }

      const mockSession = {
        ...sessionData,
        id: 'session-id',
        data: JSON.stringify(sessionData.data),
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      mockPrismaClient.userSession.create.mockResolvedValue(mockSession)

      const result = await SessionService.create(sessionData)

      expect(result).toEqual(mockSession)
      expect(mockPrismaClient.userSession.create).toHaveBeenCalledWith({
        data: {
          ...sessionData,
          data: JSON.stringify(sessionData.data),
        },
      })
    })
  })

  describe('findBySessionId', () => {
    it('finds session by ID', async () => {
      const sessionId = 'test-session-123'
      const mockSession = {
        id: 'session-id',
        sessionId,
        userId: 'user-456',
        data: '{"theme":"dark"}',
        expiresAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      mockPrismaClient.userSession.findUnique.mockResolvedValue(mockSession)

      const result = await SessionService.findBySessionId(sessionId)

      expect(result).toEqual(mockSession)
      expect(mockPrismaClient.userSession.findUnique).toHaveBeenCalledWith({
        where: { sessionId },
      })
    })

    it('returns null for non-existent session', async () => {
      mockPrismaClient.userSession.findUnique.mockResolvedValue(null)

      const result = await SessionService.findBySessionId('non-existent')

      expect(result).toBeNull()
    })
  })

  describe('cleanupExpired', () => {
    it('removes expired sessions', async () => {
      mockPrismaClient.userSession.deleteMany.mockResolvedValue({ count: 5 })

      const result = await SessionService.cleanupExpired()

      expect(result).toBe(5)
      expect(mockPrismaClient.userSession.deleteMany).toHaveBeenCalledWith({
        where: {
          expiresAt: {
            lt: expect.any(Date),
          },
        },
      })
    })

    it('handles cleanup errors', async () => {
      mockPrismaClient.userSession.deleteMany.mockRejectedValue(new Error('Cleanup error'))

      const result = await SessionService.cleanupExpired()

      expect(result).toBe(0)
    })
  })
})
