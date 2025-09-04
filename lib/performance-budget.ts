/**
 * 性能预算配置和监控
 * 定义各种性能指标的阈值和监控逻辑
 */

// Core Web Vitals 阈值配置
export const CORE_WEB_VITALS_THRESHOLDS = {
  // Largest Contentful Paint (LCP) - 最大内容绘制
  LCP: {
    good: 2500,    // 2.5秒以内为良好
    poor: 4000,    // 4秒以上为差
  },
  // First Input Delay (FID) / Interaction to Next Paint (INP)
  INP: {
    good: 200,     // 200毫秒以内为良好
    poor: 500,     // 500毫秒以上为差
  },
  // Cumulative Layout Shift (CLS) - 累积布局偏移
  CLS: {
    good: 0.1,     // 0.1以内为良好
    poor: 0.25,    // 0.25以上为差
  },
  // First Contentful Paint (FCP) - 首次内容绘制
  FCP: {
    good: 1800,    // 1.8秒以内为良好
    poor: 3000,    // 3秒以上为差
  },
  // Time to First Byte (TTFB) - 首字节时间
  TTFB: {
    good: 800,     // 800毫秒以内为良好
    poor: 1800,    // 1.8秒以上为差
  },
} as const

// 资源大小预算
export const RESOURCE_BUDGETS = {
  // JavaScript 包大小限制
  javascript: {
    // 首屏 JS 总大小
    firstLoad: 250 * 1024,      // 250KB
    // 单个页面额外 JS 大小
    pageSpecific: 50 * 1024,    // 50KB
    // 单个 chunk 大小
    chunkSize: 100 * 1024,      // 100KB
  },
  // CSS 大小限制
  css: {
    total: 50 * 1024,           // 50KB
    critical: 14 * 1024,        // 14KB (关键CSS)
  },
  // 图片大小限制
  images: {
    hero: 200 * 1024,           // 200KB (主要图片)
    thumbnail: 50 * 1024,       // 50KB (缩略图)
    icon: 10 * 1024,            // 10KB (图标)
  },
  // 字体大小限制
  fonts: {
    total: 100 * 1024,          // 100KB
    perFont: 30 * 1024,         // 30KB (单个字体)
  },
} as const

// 性能评分函数
export function getPerformanceScore(metric: string, value: number): 'good' | 'needs-improvement' | 'poor' {
  const thresholds = CORE_WEB_VITALS_THRESHOLDS[metric as keyof typeof CORE_WEB_VITALS_THRESHOLDS]
  if (!thresholds) return 'good'
  
  if (value <= thresholds.good) return 'good'
  if (value <= thresholds.poor) return 'needs-improvement'
  return 'poor'
}

// 性能预算检查器
export class PerformanceBudgetChecker {
  private violations: Array<{
    type: string
    metric: string
    actual: number
    budget: number
    severity: 'warning' | 'error'
  }> = []

  // 检查 Core Web Vitals
  checkCoreWebVitals(metrics: Record<string, number>) {
    Object.entries(metrics).forEach(([metric, value]) => {
      const score = getPerformanceScore(metric, value)
      if (score === 'poor') {
        this.violations.push({
          type: 'core-web-vitals',
          metric,
          actual: value,
          budget: CORE_WEB_VITALS_THRESHOLDS[metric as keyof typeof CORE_WEB_VITALS_THRESHOLDS]?.good || 0,
          severity: 'error',
        })
      } else if (score === 'needs-improvement') {
        this.violations.push({
          type: 'core-web-vitals',
          metric,
          actual: value,
          budget: CORE_WEB_VITALS_THRESHOLDS[metric as keyof typeof CORE_WEB_VITALS_THRESHOLDS]?.good || 0,
          severity: 'warning',
        })
      }
    })
  }

  // 检查资源大小
  checkResourceSizes(resources: {
    javascript?: number
    css?: number
    images?: number
    fonts?: number
  }) {
    if (resources.javascript && resources.javascript > RESOURCE_BUDGETS.javascript.firstLoad) {
      this.violations.push({
        type: 'resource-size',
        metric: 'javascript-first-load',
        actual: resources.javascript,
        budget: RESOURCE_BUDGETS.javascript.firstLoad,
        severity: 'error',
      })
    }

    if (resources.css && resources.css > RESOURCE_BUDGETS.css.total) {
      this.violations.push({
        type: 'resource-size',
        metric: 'css-total',
        actual: resources.css,
        budget: RESOURCE_BUDGETS.css.total,
        severity: 'warning',
      })
    }

    if (resources.fonts && resources.fonts > RESOURCE_BUDGETS.fonts.total) {
      this.violations.push({
        type: 'resource-size',
        metric: 'fonts-total',
        actual: resources.fonts,
        budget: RESOURCE_BUDGETS.fonts.total,
        severity: 'warning',
      })
    }
  }

  // 获取违规报告
  getViolations() {
    return this.violations
  }

  // 清除违规记录
  clearViolations() {
    this.violations = []
  }

  // 生成性能报告
  generateReport() {
    const errors = this.violations.filter(v => v.severity === 'error')
    const warnings = this.violations.filter(v => v.severity === 'warning')

    return {
      score: this.calculateOverallScore(),
      errors: errors.length,
      warnings: warnings.length,
      violations: this.violations,
      recommendations: this.generateRecommendations(),
    }
  }

  private calculateOverallScore(): number {
    if (this.violations.length === 0) return 100
    
    const errorPenalty = this.violations.filter(v => v.severity === 'error').length * 20
    const warningPenalty = this.violations.filter(v => v.severity === 'warning').length * 10
    
    return Math.max(0, 100 - errorPenalty - warningPenalty)
  }

  private generateRecommendations(): string[] {
    const recommendations: string[] = []
    
    const jsViolations = this.violations.filter(v => v.metric.includes('javascript'))
    if (jsViolations.length > 0) {
      recommendations.push('Consider code splitting and lazy loading to reduce JavaScript bundle size')
    }

    const coreWebVitalsViolations = this.violations.filter(v => v.type === 'core-web-vitals')
    if (coreWebVitalsViolations.some(v => v.metric === 'LCP')) {
      recommendations.push('Optimize images and critical resources to improve Largest Contentful Paint')
    }

    if (coreWebVitalsViolations.some(v => v.metric === 'CLS')) {
      recommendations.push('Add size attributes to images and reserve space for dynamic content to reduce layout shift')
    }

    if (coreWebVitalsViolations.some(v => v.metric === 'INP')) {
      recommendations.push('Optimize JavaScript execution and reduce main thread blocking to improve responsiveness')
    }

    return recommendations
  }
}

// 全局性能预算检查器实例
export const performanceBudgetChecker = new PerformanceBudgetChecker()

// 性能监控工具函数
export const performanceUtils = {
  // 测量资源加载时间
  measureResourceTiming: (resourceType: string) => {
    if (typeof window === 'undefined') return null
    
    const entries = performance.getEntriesByType('resource') as PerformanceResourceTiming[]
    return entries
      .filter(entry => entry.name.includes(resourceType))
      .map(entry => ({
        name: entry.name,
        duration: entry.duration,
        size: entry.transferSize,
        startTime: entry.startTime,
      }))
  },

  // 获取页面加载性能指标
  getPageLoadMetrics: () => {
    if (typeof window === 'undefined') return null
    
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
    if (!navigation) return null

    return {
      dns: navigation.domainLookupEnd - navigation.domainLookupStart,
      tcp: navigation.connectEnd - navigation.connectStart,
      ttfb: navigation.responseStart - navigation.requestStart,
      download: navigation.responseEnd - navigation.responseStart,
      domParse: navigation.domContentLoadedEventStart - navigation.responseEnd,
      domReady: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
      total: navigation.loadEventEnd - navigation.fetchStart,
    }
  },

  // 检查是否超出性能预算
  checkBudget: (metrics: Record<string, number>, resources?: Record<string, number>) => {
    performanceBudgetChecker.clearViolations()
    performanceBudgetChecker.checkCoreWebVitals(metrics)
    if (resources) {
      performanceBudgetChecker.checkResourceSizes(resources)
    }
    return performanceBudgetChecker.generateReport()
  },
}
