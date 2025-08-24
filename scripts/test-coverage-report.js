#!/usr/bin/env node

/**
 * 测试覆盖率报告生成器
 * 生成详细的测试覆盖率报告和分析
 */

const fs = require('fs')
const path = require('path')

// 覆盖率阈值配置
const COVERAGE_THRESHOLDS = {
  statements: 70,
  branches: 70,
  functions: 70,
  lines: 70,
}

// 关键文件和目录
const CRITICAL_PATHS = [
  'lib/openrouter.ts',
  'lib/database.ts',
  'lib/api-signature.ts',
  'lib/redis-cache.ts',
  'lib/error-monitoring.ts',
  'components/FortuneCard.tsx',
  'components/FortuneGenerator.tsx',
  'app/api/fortune/route.ts',
  'app/api/fortunes/route.ts',
]

class CoverageReporter {
  constructor() {
    this.coverageDir = path.join(process.cwd(), 'coverage')
    this.reportFile = path.join(this.coverageDir, 'coverage-summary.json')
  }

  // 生成覆盖率报告
  async generateReport() {
    console.log('📊 生成测试覆盖率报告...')

    try {
      // 检查覆盖率文件是否存在
      if (!fs.existsSync(this.reportFile)) {
        console.error('❌ 覆盖率文件不存在，请先运行测试: npm run test:coverage')
        process.exit(1)
      }

      // 读取覆盖率数据
      const coverageData = JSON.parse(fs.readFileSync(this.reportFile, 'utf8'))
      
      // 生成报告
      this.printOverallSummary(coverageData.total)
      this.printDetailedAnalysis(coverageData)
      this.printCriticalPathsAnalysis(coverageData)
      this.printRecommendations(coverageData)
      
      console.log('\n✅ 覆盖率报告生成完成!')
      
    } catch (error) {
      console.error('❌ 生成覆盖率报告失败:', error.message)
      process.exit(1)
    }
  }

  // 打印总体摘要
  printOverallSummary(totalCoverage) {
    console.log('\n📈 总体覆盖率摘要')
    console.log('='.repeat(50))
    
    const metrics = ['statements', 'branches', 'functions', 'lines']
    
    metrics.forEach(metric => {
      const coverage = totalCoverage[metric]
      const threshold = COVERAGE_THRESHOLDS[metric]
      const status = coverage.pct >= threshold ? '✅' : '❌'
      const color = coverage.pct >= threshold ? '\x1b[32m' : '\x1b[31m'
      
      console.log(
        `${status} ${metric.padEnd(12)}: ${color}${coverage.pct.toFixed(1)}%\x1b[0m ` +
        `(${coverage.covered}/${coverage.total}) - 目标: ${threshold}%`
      )
    })
  }

  // 打印详细分析
  printDetailedAnalysis(coverageData) {
    console.log('\n🔍 详细文件分析')
    console.log('='.repeat(50))
    
    const files = Object.entries(coverageData)
      .filter(([path]) => path !== 'total')
      .map(([path, data]) => ({
        path: path.replace(process.cwd(), ''),
        ...data.statements,
        branches: data.branches.pct,
        functions: data.functions.pct,
        lines: data.lines.pct,
      }))
      .sort((a, b) => a.pct - b.pct) // 按覆盖率排序

    // 显示覆盖率最低的文件
    console.log('\n📉 覆盖率最低的文件 (前10个):')
    files.slice(0, 10).forEach((file, index) => {
      const status = file.pct >= COVERAGE_THRESHOLDS.statements ? '✅' : '❌'
      const color = file.pct >= COVERAGE_THRESHOLDS.statements ? '\x1b[32m' : '\x1b[31m'
      
      console.log(
        `${index + 1}.`.padEnd(3) +
        `${status} ${file.path.padEnd(40)} ` +
        `${color}${file.pct.toFixed(1)}%\x1b[0m`
      )
    })

    // 显示覆盖率最高的文件
    console.log('\n📈 覆盖率最高的文件 (前5个):')
    files.slice(-5).reverse().forEach((file, index) => {
      console.log(
        `${index + 1}.`.padEnd(3) +
        `✅ ${file.path.padEnd(40)} ` +
        `\x1b[32m${file.pct.toFixed(1)}%\x1b[0m`
      )
    })
  }

  // 打印关键路径分析
  printCriticalPathsAnalysis(coverageData) {
    console.log('\n🎯 关键文件覆盖率分析')
    console.log('='.repeat(50))
    
    const criticalFiles = CRITICAL_PATHS.map(criticalPath => {
      const fullPath = path.join(process.cwd(), criticalPath)
      const data = coverageData[fullPath]
      
      return {
        path: criticalPath,
        exists: !!data,
        coverage: data ? data.statements.pct : 0,
        status: data ? (data.statements.pct >= COVERAGE_THRESHOLDS.statements ? '✅' : '❌') : '⚠️',
      }
    })

    criticalFiles.forEach(file => {
      if (!file.exists) {
        console.log(`⚠️  ${file.path.padEnd(40)} 未找到覆盖率数据`)
      } else {
        const color = file.coverage >= COVERAGE_THRESHOLDS.statements ? '\x1b[32m' : '\x1b[31m'
        console.log(
          `${file.status} ${file.path.padEnd(40)} ` +
          `${color}${file.coverage.toFixed(1)}%\x1b[0m`
        )
      }
    })
  }

  // 打印改进建议
  printRecommendations(coverageData) {
    console.log('\n💡 改进建议')
    console.log('='.repeat(50))
    
    const totalCoverage = coverageData.total
    const recommendations = []

    // 检查各项指标
    Object.entries(COVERAGE_THRESHOLDS).forEach(([metric, threshold]) => {
      const coverage = totalCoverage[metric]
      if (coverage.pct < threshold) {
        const gap = threshold - coverage.pct
        const needed = Math.ceil((coverage.total * threshold / 100) - coverage.covered)
        recommendations.push(
          `📝 ${metric}: 需要提高 ${gap.toFixed(1)}% (约需增加 ${needed} 个覆盖点)`
        )
      }
    })

    if (recommendations.length === 0) {
      console.log('🎉 所有覆盖率指标都达到了目标！')
    } else {
      recommendations.forEach(rec => console.log(rec))
    }

    // 通用建议
    console.log('\n📋 通用改进建议:')
    console.log('1. 为核心业务逻辑添加更多单元测试')
    console.log('2. 增加边界条件和错误处理的测试用例')
    console.log('3. 为API路由添加集成测试')
    console.log('4. 为React组件添加交互测试')
    console.log('5. 定期运行覆盖率检查: npm run test:coverage')
  }

  // 生成HTML报告链接
  printHtmlReportInfo() {
    const htmlReportPath = path.join(this.coverageDir, 'lcov-report', 'index.html')
    
    if (fs.existsSync(htmlReportPath)) {
      console.log('\n🌐 详细HTML报告:')
      console.log(`file://${htmlReportPath}`)
    }
  }
}

// 命令行工具
async function main() {
  const args = process.argv.slice(2)
  const command = args[0] || 'report'

  const reporter = new CoverageReporter()

  switch (command) {
    case 'report':
      await reporter.generateReport()
      reporter.printHtmlReportInfo()
      break
      
    case 'check':
      // 检查覆盖率是否达标
      try {
        const coverageData = JSON.parse(fs.readFileSync(reporter.reportFile, 'utf8'))
        const totalCoverage = coverageData.total
        
        let allPassed = true
        Object.entries(COVERAGE_THRESHOLDS).forEach(([metric, threshold]) => {
          if (totalCoverage[metric].pct < threshold) {
            allPassed = false
          }
        })
        
        if (allPassed) {
          console.log('✅ 所有覆盖率指标都达到了目标!')
          process.exit(0)
        } else {
          console.log('❌ 部分覆盖率指标未达到目标')
          process.exit(1)
        }
      } catch (error) {
        console.error('❌ 检查覆盖率失败:', error.message)
        process.exit(1)
      }
      break
      
    default:
      console.log('可用命令:')
      console.log('  report - 生成详细覆盖率报告 (默认)')
      console.log('  check  - 检查覆盖率是否达标')
      break
  }
}

// 运行主函数
if (require.main === module) {
  main().catch(console.error)
}

module.exports = { CoverageReporter }
