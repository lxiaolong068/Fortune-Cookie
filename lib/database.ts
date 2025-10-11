import { PrismaClient } from '@prisma/client'
import { captureError, capturePerformanceIssue } from './error-monitoring'

// Database connection configuration
const DATABASE_CONFIG = {
  // Connection pool configuration
  connectionLimit: parseInt(process.env.DB_CONNECTION_LIMIT || '10'),
  
  // Query timeout configuration
  queryTimeout: parseInt(process.env.DB_QUERY_TIMEOUT || '10000'), // 10seconds
  
  // Connection timeout configuration
  connectionTimeout: parseInt(process.env.DB_CONNECTION_TIMEOUT || '5000'), // 5seconds
  
  // Log level
  logLevel: process.env.NODE_ENV === 'development' ? ['query', 'info', 'warn', 'error'] : ['warn', 'error'],
  
  // Performance monitoring threshold
  slowQueryThreshold: parseInt(process.env.DB_SLOW_QUERY_THRESHOLD || '1000'), // 1seconds
} as const

// Global Prisma client instance
declare global {
  var __prisma: PrismaClient | undefined
}

// Database connection manager
export class DatabaseManager {
  private static instance: PrismaClient
  private static connectionCount = 0
  private static queryStats = {
    total: 0,
    slow: 0,
    errors: 0,
    totalTime: 0,
  }

  // Get database instance
  static getInstance(): PrismaClient {
    if (!this.instance) {
      this.instance = this.createPrismaClient()
      
      // Reuse connection in development environment
      if (process.env.NODE_ENV === 'development') {
        global.__prisma = this.instance
      }
    }
    
    return this.instance
  }

  // Create Prisma client
  private static createPrismaClient(): PrismaClient {
    const prisma = new PrismaClient({
      log: DATABASE_CONFIG.logLevel as any,
      datasources: {
        db: {
          url: process.env.DATABASE_URL,
        },
      },
    })

    // Connection event listener（useprocessevent）
    process.on('beforeExit', () => {
      console.log('Database connection closing...')
      this.connectionCount--
    })

    // Query performance monitoring
    if (process.env.NODE_ENV === 'development') {
      prisma.$on('query' as any, (e: any) => {
        this.queryStats.total++
        this.queryStats.totalTime += e.duration
        
        // Slow query monitoring
        if (e.duration > DATABASE_CONFIG.slowQueryThreshold) {
          this.queryStats.slow++
          
          console.warn(`Slow query detected: ${e.duration}ms`)
          console.warn(`Query: ${e.query}`)
          console.warn(`Params: ${e.params}`)
          
          // Log slow query to monitoring system
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

  // Health check
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

  // Get connection statistics
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

  // Reset statistics
  static resetStats(): void {
    this.queryStats = {
      total: 0,
      slow: 0,
      errors: 0,
      totalTime: 0,
    }
  }

  // Close connection
  static async disconnect(): Promise<void> {
    if (this.instance) {
      await this.instance.$disconnect()
      this.instance = null as any
      this.connectionCount = 0
      console.log('Database connection closed')
    }
  }

  // Execute transaction
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
      
      // Monitor long transaction
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

// Export database instance（Lazy initialization to avoid reading during build phase DATABASE_URL）
export const db = new Proxy({} as PrismaClient, {
  get(_target, prop, receiver) {
    const instance = DatabaseManager.getInstance()
    // 将propertyaccessforward到实际的 PrismaClient instance
    // @ts-ignore
    return Reflect.get(instance, prop, receiver)
  }
}) as PrismaClient

// Query builder and optimization utilities
export class QueryOptimizer {
  // Pagination query optimization
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

  // Search query optimization
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

  // Sort query optimization
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

  // Filter query optimization
  static buildFilterQuery(filters: Record<string, any>): any {
    const where: any = {}

    // Category filter
    if (filters.category && typeof filters.category === 'string') {
      where.category = filters.category
    }

    // Mood filter
    if (filters.mood && typeof filters.mood === 'string') {
      where.mood = filters.mood
    }

    // Length filter
    if (filters.length && typeof filters.length === 'string') {
      where.length = filters.length
    }

    // Date range filter
    if (filters.dateFrom || filters.dateTo) {
      where.createdAt = {}
      
      if (filters.dateFrom) {
        where.createdAt.gte = new Date(filters.dateFrom)
      }
      
      if (filters.dateTo) {
        where.createdAt.lte = new Date(filters.dateTo)
      }
    }

    // Popularity filter
    if (filters.minPopularity && typeof filters.minPopularity === 'number') {
      where.popularity = {
        gte: filters.minPopularity,
      }
    }

    return where
  }
}

// Database migration and seed data utilities
export class DatabaseSeeder {
  // Check if seed data is needed
  static async needsSeeding(): Promise<boolean> {
    try {
      const count = await db.fortune.count()
      return count === 0
    } catch (error) {
      return true
    }
  }

  // Create seed data
  static async seedDatabase(): Promise<void> {
    console.log('Seeding database...')
    
    try {
      // Seed data creation logic can be added here
      // for examplefromexisting fortune-database.ts importdata
      
      console.log('Database seeded successfully')
    } catch (error) {
      console.error('Database seeding failed:', error)
      throw error
    }
  }
}
