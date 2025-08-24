#!/usr/bin/env tsx

/**
 * 数据库种子数据脚本
 * 用于初始化数据库和导入基础数据
 */

import { db, DatabaseManager } from '../lib/database'
import { FortuneService } from '../lib/database-service'
import { fortuneDatabase } from '../lib/fortune-database'

// 种子数据配置
const SEED_CONFIG = {
  batchSize: 100, // 批量插入大小
  logInterval: 500, // 日志输出间隔
}

// 数据库种子器
class DatabaseSeeder {
  private totalProcessed = 0
  private totalErrors = 0

  // 主要种子方法
  async seed(): Promise<void> {
    console.log('🌱 开始数据库种子数据初始化...')
    console.log(`📊 准备导入 ${fortuneDatabase.length} 条幸运饼干数据`)

    try {
      // 检查数据库连接
      const isHealthy = await DatabaseManager.healthCheck()
      if (!isHealthy) {
        throw new Error('数据库连接失败')
      }

      // 清理现有数据（可选）
      if (process.argv.includes('--clean')) {
        await this.cleanDatabase()
      }

      // 检查是否已有数据
      const existingCount = await db.fortune.count()
      if (existingCount > 0 && !process.argv.includes('--force')) {
        console.log(`⚠️  数据库已包含 ${existingCount} 条记录`)
        console.log('使用 --force 参数强制重新导入，或 --clean 参数清理后导入')
        return
      }

      // 导入幸运饼干数据
      await this.seedFortunes()

      // 创建测试用户会话
      if (process.argv.includes('--with-sessions')) {
        await this.seedTestSessions()
      }

      console.log('✅ 数据库种子数据初始化完成!')
      console.log(`📈 总计处理: ${this.totalProcessed} 条记录`)
      console.log(`❌ 错误数量: ${this.totalErrors} 条记录`)

    } catch (error) {
      console.error('❌ 种子数据初始化失败:', error)
      process.exit(1)
    } finally {
      await DatabaseManager.disconnect()
    }
  }

  // 清理数据库
  private async cleanDatabase(): Promise<void> {
    console.log('🧹 清理现有数据...')

    try {
      await db.$transaction([
        db.userFeedback.deleteMany(),
        db.webVital.deleteMany(),
        db.apiUsage.deleteMany(),
        db.errorLog.deleteMany(),
        db.cacheStats.deleteMany(),
        db.userSession.deleteMany(),
        db.fortune.deleteMany(),
      ])

      console.log('✅ 数据库清理完成')
    } catch (error) {
      console.error('❌ 数据库清理失败:', error)
      throw error
    }
  }

  // 导入幸运饼干数据
  private async seedFortunes(): Promise<void> {
    console.log('🔮 导入幸运饼干数据...')

    const batches = this.createBatches(fortuneDatabase, SEED_CONFIG.batchSize)
    
    for (let i = 0; i < batches.length; i++) {
      const batch = batches[i]
      
      try {
        await DatabaseManager.transaction(async (prisma) => {
          const promises = batch.map(fortune => 
            prisma.fortune.create({
              data: {
                message: fortune.message,
                category: fortune.category,
                mood: fortune.mood || 'positive',
                length: fortune.length || 'medium',
                source: 'database',
                popularity: fortune.popularity || 0,
                tags: fortune.tags ? JSON.stringify(fortune.tags) : null,
                language: fortune.language || 'zh',
              },
            })
          )

          await Promise.all(promises)
        })

        this.totalProcessed += batch.length

        if (this.totalProcessed % SEED_CONFIG.logInterval === 0) {
          console.log(`📊 已处理: ${this.totalProcessed}/${fortuneDatabase.length} 条记录`)
        }

      } catch (error) {
        console.error(`❌ 批次 ${i + 1} 导入失败:`, error)
        this.totalErrors += batch.length
      }
    }

    console.log(`✅ 幸运饼干数据导入完成: ${this.totalProcessed - this.totalErrors} 条成功`)
  }

  // 创建测试用户会话
  private async seedTestSessions(): Promise<void> {
    console.log('👥 创建测试用户会话...')

    const testSessions = [
      {
        sessionId: 'test-session-1',
        userId: 'test-user-1',
        ipAddress: '127.0.0.1',
        userAgent: 'Test User Agent',
        data: JSON.stringify({ preferences: { theme: 'dark' } }),
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7天后过期
      },
      {
        sessionId: 'test-session-2',
        userId: 'test-user-2',
        ipAddress: '127.0.0.1',
        userAgent: 'Test User Agent 2',
        data: JSON.stringify({ preferences: { language: 'en' } }),
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    ]

    try {
      await db.userSession.createMany({
        data: testSessions,
      })

      console.log(`✅ 创建了 ${testSessions.length} 个测试会话`)
    } catch (error) {
      console.error('❌ 测试会话创建失败:', error)
    }
  }

  // 创建批次
  private createBatches<T>(array: T[], batchSize: number): T[][] {
    const batches: T[][] = []
    
    for (let i = 0; i < array.length; i += batchSize) {
      batches.push(array.slice(i, i + batchSize))
    }
    
    return batches
  }

  // 验证数据完整性
  async validateData(): Promise<void> {
    console.log('🔍 验证数据完整性...')

    try {
      const stats = await FortuneService.getStats()
      
      console.log('📊 数据统计:')
      console.log(`  总计: ${stats.total} 条幸运饼干`)
      console.log(`  按类别分布:`, stats.byCategory)
      console.log(`  按心情分布:`, stats.byMood)
      console.log(`  最近7天新增: ${stats.recent} 条`)

      // 验证数据质量
      const emptyMessages = await db.fortune.count({
        where: { message: '' }
      })

      const missingCategories = await db.fortune.count({
        where: { category: '' }
      })

      if (emptyMessages > 0) {
        console.warn(`⚠️  发现 ${emptyMessages} 条空消息记录`)
      }

      if (missingCategories > 0) {
        console.warn(`⚠️  发现 ${missingCategories} 条缺少类别的记录`)
      }

      console.log('✅ 数据验证完成')

    } catch (error) {
      console.error('❌ 数据验证失败:', error)
    }
  }
}

// 命令行工具
async function main() {
  const seeder = new DatabaseSeeder()
  
  const args = process.argv.slice(2)
  const command = args[0] || 'seed'

  switch (command) {
    case 'seed':
      await seeder.seed()
      break
      
    case 'validate':
      await seeder.validateData()
      break
      
    case 'clean':
      console.log('🧹 仅清理数据库...')
      await seeder['cleanDatabase']()
      console.log('✅ 数据库清理完成')
      break
      
    default:
      console.log('可用命令:')
      console.log('  seed     - 导入种子数据 (默认)')
      console.log('  validate - 验证数据完整性')
      console.log('  clean    - 清理数据库')
      console.log('')
      console.log('选项:')
      console.log('  --clean         - 导入前清理现有数据')
      console.log('  --force         - 强制导入（即使已有数据）')
      console.log('  --with-sessions - 创建测试用户会话')
      break
  }
}

// 运行主函数
if (require.main === module) {
  main().catch(console.error)
}

export { DatabaseSeeder }
