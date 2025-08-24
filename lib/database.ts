import { PrismaClient } from '@prisma/client'
import { captureError, capturePerformanceIssue } from './error-monitoring'

// 数据库连接配置
const DATABASE_CONFIG = {
  // 连接池配置
  connectionLimit: parseInt(process.env.DB_CONNECTION_LIMIT || '10'),
  
  // 查询超时配置
  queryTimeout: parseInt(process.env.DB_QUERY_TIMEOUT || '10000'), // 10秒
  
  // 连接超时配置
  connectionTimeout: parseInt(process.env.DB_CONNECTION_TIMEOUT || '5000'), // 5秒
  
  // 日志级别
  logLevel: process.env.NODE_ENV === 'development' ? ['query', 'info', 'warn', 'error'] : ['warn', 'error'],
  
  // 性能监控阈值
  slowQueryThreshold: parseInt(process.env.DB_SLOW_QUERY_THRESHOLD || '1000'), // 1秒
} as const

// 全局 Prisma 客户端实例
declare global {
  var __prisma: PrismaClient | undefined
}

// 数据库连接管理器
export class DatabaseManager {
  private static instance: PrismaClient
  private static connectionCount = 0
  private static queryStats = {
    total: 0,
    slow: 0,
    errors: 0,
    totalTime: 0,
  }

  // 获取数据库实例
  static getInstance(): PrismaClient {
    if (!this.instance) {
      this.instance = this.createPrismaClient()
      
      // 开发环境下复用连接
      if (process.env.NODE_ENV === 'development') {
        global.__prisma = this.instance
      }
    }
    
    return this.instance
  }

  // 创建 Prisma 客户端
  private static createPrismaClient(): PrismaClient {
    const prisma = new PrismaClient({
      log: DATABASE_CONFIG.logLevel as any,
      datasources: {
        db: {
          url: process.env.DATABASE_URL,
        },
      },
    })

    // 连接事件监听（使用process事件）
    process.on('beforeExit', () => {
      console.log('Database connection closing...')
      this.connectionCount--
    })

    // 查询性能监控
    if (process.env.NODE_ENV === 'development') {
      prisma.$on('query' as any, (e: any) => {
        this.queryStats.total++
        this.queryStats.totalTime += e.duration
        
        // 慢查询监控
        if (e.duration > DATABASE_CONFIG.slowQueryThreshold) {
          this.queryStats.slow++
          
          console.warn(`Slow query detected: ${e.duration}ms`)
          console.warn(`Query: ${e.query}`)
          console.warn(`Params: ${e.params}`)
          
          // 记录慢查询到监控系统
          capturePerformanceIssue(
            'slow_database_query',
            e.duration,
            DATABASE_CONFIG.slowQueryThreshold,
            {
              component: 'database',
              additionalData: {
                query: e.query,
                params: e.params,
                duration: e.duration,
              }
            }
          )
        }
      })
    }

    this.connectionCount++
    console.log(`Database connection established (${this.connectionCount})`)

    return prisma
  }

  // 健康检查
  static async healthCheck(): Promise<boolean> {
    try {
      const prisma = this.getInstance()
      await prisma.$queryRaw`SELECT 1`
      return true
    } catch (error) {
      captureError(
        error instanceof Error ? error : new Error(String(error)),
        {
          component: 'database',
          action: 'health_check',
        }
      )
      return false
    }
  }

  // 获取连接统计
  static getStats(): any {
    return {
      connectionCount: this.connectionCount,
      queryStats: {
        ...this.queryStats,
        averageTime: this.queryStats.total > 0 
          ? Math.round(this.queryStats.totalTime / this.queryStats.total) 
          : 0,
        slowQueryRate: this.queryStats.total > 0 
          ? Math.round((this.queryStats.slow / this.queryStats.total) * 100) 
          : 0,
      },
      config: DATABASE_CONFIG,
    }
  }

  // 重置统计
  static resetStats(): void {
    this.queryStats = {
      total: 0,
      slow: 0,
      errors: 0,
      totalTime: 0,
    }
  }

  // 关闭连接
  static async disconnect(): Promise<void> {
    if (this.instance) {
      await this.instance.$disconnect()
      this.instance = null as any
      this.connectionCount = 0
      console.log('Database connection closed')
    }
  }

  // 执行事务
  static async transaction<T>(
    fn: (prisma: PrismaClient) => Promise<T>,
    options?: {
      maxWait?: number
      timeout?: number
    }
  ): Promise<T> {
    const prisma = this.getInstance()
    const startTime = Date.now()
    
    try {
      const result = await prisma.$transaction(fn as any, {
        maxWait: options?.maxWait || 5000,
        timeout: options?.timeout || 10000,
      })
      
      const duration = Date.now() - startTime
      
      // 监控长事务
      if (duration > 5000) {
        capturePerformanceIssue(
          'long_database_transaction',
          duration,
          5000,
          {
            component: 'database',
            additionalData: { duration }
          }
        )
      }
      
      return result as T
    } catch (error) {
      this.queryStats.errors++
      
      captureError(
        error instanceof Error ? error : new Error(String(error)),
        {
          component: 'database',
          action: 'transaction',
          additionalData: {
            duration: Date.now() - startTime,
          }
        }
      )
      
      throw error
    }
  }
}

// 导出数据库实例（惰性初始化，避免在构建阶段读取 DATABASE_URL）
export const db = new Proxy({} as PrismaClient, {
  get(_target, prop, receiver) {
    const instance = DatabaseManager.getInstance()
    // 将属性访问转发到实际的 PrismaClient 实例
    // @ts-ignore
    return Reflect.get(instance, prop, receiver)
  }
}) as PrismaClient

// 查询构建器和优化工具
export class QueryOptimizer {
  // 分页查询优化
  static buildPaginationQuery(
    page: number = 1,
    limit: number = 20,
    maxLimit: number = 100
  ): { skip: number; take: number } {
    const normalizedPage = Math.max(1, page)
    const normalizedLimit = Math.min(Math.max(1, limit), maxLimit)
    
    return {
      skip: (normalizedPage - 1) * normalizedLimit,
      take: normalizedLimit,
    }
  }

  // 搜索查询优化
  static buildSearchQuery(query: string): any {
    if (!query || query.trim().length === 0) {
      return {}
    }

    const searchTerms = query.trim().split(/\s+/).filter(term => term.length > 0)
    
    return {
      OR: searchTerms.map(term => ({
        message: {
          contains: term,
          mode: 'insensitive' as const,
        },
      })),
    }
  }

  // 排序查询优化
  static buildSortQuery(
    sortBy: string = 'createdAt',
    sortOrder: 'asc' | 'desc' = 'desc'
  ): any {
    const allowedSortFields = [
      'createdAt',
      'updatedAt',
      'popularity',
      'category',
      'mood',
    ]

    const field = allowedSortFields.includes(sortBy) ? sortBy : 'createdAt'
    
    return {
      [field]: sortOrder,
    }
  }

  // 过滤查询优化
  static buildFilterQuery(filters: Record<string, any>): any {
    const where: any = {}

    // 类别过滤
    if (filters.category && typeof filters.category === 'string') {
      where.category = filters.category
    }

    // 心情过滤
    if (filters.mood && typeof filters.mood === 'string') {
      where.mood = filters.mood
    }

    // 长度过滤
    if (filters.length && typeof filters.length === 'string') {
      where.length = filters.length
    }

    // 日期范围过滤
    if (filters.dateFrom || filters.dateTo) {
      where.createdAt = {}
      
      if (filters.dateFrom) {
        where.createdAt.gte = new Date(filters.dateFrom)
      }
      
      if (filters.dateTo) {
        where.createdAt.lte = new Date(filters.dateTo)
      }
    }

    // 受欢迎程度过滤
    if (filters.minPopularity && typeof filters.minPopularity === 'number') {
      where.popularity = {
        gte: filters.minPopularity,
      }
    }

    return where
  }
}

// 数据库迁移和种子数据工具
export class DatabaseSeeder {
  // 检查是否需要种子数据
  static async needsSeeding(): Promise<boolean> {
    try {
      const count = await db.fortune.count()
      return count === 0
    } catch (error) {
      return true
    }
  }

  // 创建种子数据
  static async seedDatabase(): Promise<void> {
    console.log('Seeding database...')
    
    try {
      // 这里可以添加种子数据创建逻辑
      // 例如从现有的 fortune-database.ts 导入数据
      
      console.log('Database seeded successfully')
    } catch (error) {
      console.error('Database seeding failed:', error)
      throw error
    }
  }
}
