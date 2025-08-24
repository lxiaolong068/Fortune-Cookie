import { db, QueryOptimizer, DatabaseManager } from './database'
import { captureError, captureBusinessEvent } from './error-monitoring'
import type { Fortune, UserSession, ApiUsage, WebVital, ErrorLog, UserFeedback } from '@prisma/client'

// 幸运饼干服务
export class FortuneService {
  // 创建幸运饼干
  static async create(data: {
    message: string
    category: string
    mood: string
    length: string
    source?: string
    tags?: string[]
    language?: string
  }): Promise<Fortune> {
    try {
      const fortune = await db.fortune.create({
        data: {
          ...data,
          tags: data.tags ? JSON.stringify(data.tags) : null,
        },
      })

      captureBusinessEvent('fortune_created', {
        id: fortune.id,
        category: fortune.category,
        source: fortune.source,
      })

      return fortune
    } catch (error) {
      captureError(error instanceof Error ? error : new Error(String(error)), {
        component: 'FortuneService',
        action: 'create',
      })
      throw error
    }
  }

  // 获取幸运饼干列表
  static async findMany(options: {
    page?: number
    limit?: number
    category?: string
    mood?: string
    search?: string
    sortBy?: string
    sortOrder?: 'asc' | 'desc'
  } = {}): Promise<{ fortunes: Fortune[]; total: number; hasMore: boolean }> {
    try {
      const { skip, take } = QueryOptimizer.buildPaginationQuery(
        options.page,
        options.limit
      )

      const where = {
        ...QueryOptimizer.buildFilterQuery({
          category: options.category,
          mood: options.mood,
        }),
        ...QueryOptimizer.buildSearchQuery(options.search || ''),
      }

      const orderBy = QueryOptimizer.buildSortQuery(
        options.sortBy,
        options.sortOrder
      )

      const [fortunes, total] = await Promise.all([
        db.fortune.findMany({
          where,
          orderBy,
          skip,
          take,
        }),
        db.fortune.count({ where }),
      ])

      return {
        fortunes,
        total,
        hasMore: skip + take < total,
      }
    } catch (error) {
      captureError(error instanceof Error ? error : new Error(String(error)), {
        component: 'FortuneService',
        action: 'findMany',
      })
      throw error
    }
  }

  // 获取单个幸运饼干
  static async findById(id: string): Promise<Fortune | null> {
    try {
      return await db.fortune.findUnique({
        where: { id },
      })
    } catch (error) {
      captureError(error instanceof Error ? error : new Error(String(error)), {
        component: 'FortuneService',
        action: 'findById',
      })
      return null
    }
  }

  // 获取随机幸运饼干
  static async findRandom(category?: string): Promise<Fortune | null> {
    try {
      const where = category ? { category } : {}
      
      // SQLite 随机查询优化
      const count = await db.fortune.count({ where })
      if (count === 0) return null

      const skip = Math.floor(Math.random() * count)
      
      const fortune = await db.fortune.findFirst({
        where,
        skip,
      })

      if (fortune) {
        // 增加受欢迎程度
        await this.incrementPopularity(fortune.id)
      }

      return fortune
    } catch (error) {
      captureError(error instanceof Error ? error : new Error(String(error)), {
        component: 'FortuneService',
        action: 'findRandom',
      })
      return null
    }
  }

  // 获取热门幸运饼干
  static async findPopular(limit: number = 10): Promise<Fortune[]> {
    try {
      return await db.fortune.findMany({
        orderBy: { popularity: 'desc' },
        take: limit,
      })
    } catch (error) {
      captureError(error instanceof Error ? error : new Error(String(error)), {
        component: 'FortuneService',
        action: 'findPopular',
      })
      return []
    }
  }

  // 增加受欢迎程度
  static async incrementPopularity(id: string): Promise<void> {
    try {
      await db.fortune.update({
        where: { id },
        data: {
          popularity: {
            increment: 1,
          },
        },
      })
    } catch (error) {
      // 静默处理受欢迎程度更新错误
      captureError(error instanceof Error ? error : new Error(String(error)), {
        component: 'FortuneService',
        action: 'incrementPopularity',
      })
    }
  }

  // 搜索幸运饼干
  static async search(query: string, options: {
    category?: string
    limit?: number
  } = {}): Promise<Fortune[]> {
    try {
      const where = {
        message: {
          contains: query,
          mode: 'insensitive' as const,
        },
        ...(options.category && { category: options.category }),
      }

      return await db.fortune.findMany({
        where,
        orderBy: { popularity: 'desc' },
        take: options.limit || 50,
      })
    } catch (error) {
      captureError(error instanceof Error ? error : new Error(String(error)), {
        component: 'FortuneService',
        action: 'search',
      })
      return []
    }
  }

  // 获取统计信息
  static async getStats(): Promise<any> {
    try {
      const [total, byCategory, byMood, recent] = await Promise.all([
        db.fortune.count(),
        db.fortune.groupBy({
          by: ['category'],
          _count: { category: true },
        }),
        db.fortune.groupBy({
          by: ['mood'],
          _count: { mood: true },
        }),
        db.fortune.count({
          where: {
            createdAt: {
              gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7天内
            },
          },
        }),
      ])

      return {
        total,
        byCategory: byCategory.reduce((acc, item) => {
          acc[item.category] = item._count.category
          return acc
        }, {} as Record<string, number>),
        byMood: byMood.reduce((acc, item) => {
          acc[item.mood] = item._count.mood
          return acc
        }, {} as Record<string, number>),
        recent,
      }
    } catch (error) {
      captureError(error instanceof Error ? error : new Error(String(error)), {
        component: 'FortuneService',
        action: 'getStats',
      })
      return { total: 0, byCategory: {}, byMood: {}, recent: 0 }
    }
  }
}

// 用户会话服务
export class SessionService {
  // 创建会话
  static async create(data: {
    sessionId: string
    userId?: string
    ipAddress?: string
    userAgent?: string
    data?: any
    expiresAt: Date
  }): Promise<UserSession> {
    try {
      return await db.userSession.create({
        data: {
          ...data,
          data: data.data ? JSON.stringify(data.data) : null,
        },
      })
    } catch (error) {
      captureError(error instanceof Error ? error : new Error(String(error)), {
        component: 'SessionService',
        action: 'create',
      })
      throw error
    }
  }

  // 获取会话
  static async findBySessionId(sessionId: string): Promise<UserSession | null> {
    try {
      return await db.userSession.findUnique({
        where: { sessionId },
      })
    } catch (error) {
      captureError(error instanceof Error ? error : new Error(String(error)), {
        component: 'SessionService',
        action: 'findBySessionId',
      })
      return null
    }
  }

  // 更新会话
  static async update(sessionId: string, data: {
    data?: any
    expiresAt?: Date
  }): Promise<UserSession | null> {
    try {
      return await db.userSession.update({
        where: { sessionId },
        data: {
          ...data,
          data: data.data ? JSON.stringify(data.data) : undefined,
        },
      })
    } catch (error) {
      captureError(error instanceof Error ? error : new Error(String(error)), {
        component: 'SessionService',
        action: 'update',
      })
      return null
    }
  }

  // 删除过期会话
  static async cleanupExpired(): Promise<number> {
    try {
      const result = await db.userSession.deleteMany({
        where: {
          expiresAt: {
            lt: new Date(),
          },
        },
      })
      
      return result.count
    } catch (error) {
      captureError(error instanceof Error ? error : new Error(String(error)), {
        component: 'SessionService',
        action: 'cleanupExpired',
      })
      return 0
    }
  }
}

// API使用统计服务
export class ApiUsageService {
  // 记录API使用
  static async record(data: {
    endpoint: string
    method: string
    statusCode: number
    responseTime: number
    ipAddress?: string
    userAgent?: string
    keyId?: string
  }): Promise<void> {
    try {
      await db.apiUsage.create({
        data,
      })
    } catch (error) {
      // 静默处理统计记录错误，不影响主要功能
      captureError(error instanceof Error ? error : new Error(String(error)), {
        component: 'ApiUsageService',
        action: 'record',
      })
    }
  }

  // 获取API使用统计
  static async getStats(options: {
    startDate?: Date
    endDate?: Date
    endpoint?: string
  } = {}): Promise<any> {
    try {
      const where: any = {}

      if (options.startDate || options.endDate) {
        where.timestamp = {}
        if (options.startDate) where.timestamp.gte = options.startDate
        if (options.endDate) where.timestamp.lte = options.endDate
      }

      if (options.endpoint) {
        where.endpoint = options.endpoint
      }

      const [total, byEndpoint, byStatus, avgResponseTime] = await Promise.all([
        db.apiUsage.count({ where }),
        db.apiUsage.groupBy({
          by: ['endpoint'],
          where,
          _count: { endpoint: true },
          _avg: { responseTime: true },
        }),
        db.apiUsage.groupBy({
          by: ['statusCode'],
          where,
          _count: { statusCode: true },
        }),
        db.apiUsage.aggregate({
          where,
          _avg: { responseTime: true },
        }),
      ])

      return {
        total,
        byEndpoint: byEndpoint.map(item => ({
          endpoint: item.endpoint,
          count: item._count.endpoint,
          avgResponseTime: Math.round(item._avg.responseTime || 0),
        })),
        byStatus: byStatus.reduce((acc, item) => {
          acc[item.statusCode] = item._count.statusCode
          return acc
        }, {} as Record<number, number>),
        avgResponseTime: Math.round(avgResponseTime._avg.responseTime || 0),
      }
    } catch (error) {
      captureError(error instanceof Error ? error : new Error(String(error)), {
        component: 'ApiUsageService',
        action: 'getStats',
      })
      return { total: 0, byEndpoint: [], byStatus: {}, avgResponseTime: 0 }
    }
  }
}

// Web Vitals服务
export class WebVitalService {
  // 记录Web Vitals指标
  static async record(data: {
    name: string
    value: number
    delta: number
    rating: string
    navigationType?: string
    url?: string
    userAgent?: string
  }): Promise<void> {
    try {
      await db.webVital.create({
        data,
      })
    } catch (error) {
      captureError(error instanceof Error ? error : new Error(String(error)), {
        component: 'WebVitalService',
        action: 'record',
      })
    }
  }

  // 获取Web Vitals统计
  static async getStats(options: {
    startDate?: Date
    endDate?: Date
    metric?: string
  } = {}): Promise<any> {
    try {
      const where: any = {}

      if (options.startDate || options.endDate) {
        where.timestamp = {}
        if (options.startDate) where.timestamp.gte = options.startDate
        if (options.endDate) where.timestamp.lte = options.endDate
      }

      if (options.metric) {
        where.name = options.metric
      }

      const [byMetric, byRating] = await Promise.all([
        db.webVital.groupBy({
          by: ['name'],
          where,
          _avg: { value: true },
          _count: { name: true },
        }),
        db.webVital.groupBy({
          by: ['rating'],
          where,
          _count: { rating: true },
        }),
      ])

      return {
        byMetric: byMetric.reduce((acc, item) => {
          acc[item.name] = {
            average: Math.round(item._avg.value || 0),
            count: item._count.name,
          }
          return acc
        }, {} as Record<string, { average: number; count: number }>),
        byRating: byRating.reduce((acc, item) => {
          acc[item.rating] = item._count.rating
          return acc
        }, {} as Record<string, number>),
      }
    } catch (error) {
      captureError(error instanceof Error ? error : new Error(String(error)), {
        component: 'WebVitalService',
        action: 'getStats',
      })
      return { byMetric: {}, byRating: {} }
    }
  }
}

// 用户反馈服务
export class FeedbackService {
  // 创建反馈
  static async create(data: {
    type: string
    content: string
    rating?: number
    fortuneId?: string
    sessionId?: string
    ipAddress?: string
    userAgent?: string
  }): Promise<UserFeedback> {
    try {
      const feedback = await db.userFeedback.create({
        data,
      })

      captureBusinessEvent('feedback_created', {
        id: feedback.id,
        type: feedback.type,
        rating: feedback.rating,
      })

      return feedback
    } catch (error) {
      captureError(error instanceof Error ? error : new Error(String(error)), {
        component: 'FeedbackService',
        action: 'create',
      })
      throw error
    }
  }

  // 获取反馈列表
  static async findMany(options: {
    page?: number
    limit?: number
    type?: string
    status?: string
  } = {}): Promise<{ feedback: UserFeedback[]; total: number }> {
    try {
      const { skip, take } = QueryOptimizer.buildPaginationQuery(
        options.page,
        options.limit
      )

      const where: any = {}
      if (options.type) where.type = options.type
      if (options.status) where.status = options.status

      const [feedback, total] = await Promise.all([
        db.userFeedback.findMany({
          where,
          orderBy: { createdAt: 'desc' },
          skip,
          take,
        }),
        db.userFeedback.count({ where }),
      ])

      return { feedback, total }
    } catch (error) {
      captureError(error instanceof Error ? error : new Error(String(error)), {
        component: 'FeedbackService',
        action: 'findMany',
      })
      return { feedback: [], total: 0 }
    }
  }
}
