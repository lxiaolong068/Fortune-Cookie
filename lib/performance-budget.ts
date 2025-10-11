/**
 * performancebudgetconfiguration和monitoring
 * 定义各种performancemetrics的threshold和monitoringlogic
 */

// Core Web Vitals threshold configuration
export const CORE_WEB_VITALS_THRESHOLDS = {
  // Largest Contentful Paint (LCP) - Largest Contentful Paint
  LCP: {
    good: 2500,    // 2.5secondswithinis good
    poor: 4000,    // 4secondsaboveis poor
  },
  // First Input Delay (FID) / Interaction to Next Paint (INP)
  INP: {
    good: 200,     // 200millisecondswithinis good
    poor: 500,     // 500millisecondsaboveis poor
  },
  // Cumulative Layout Shift (CLS) - Cumulative Layout Shift
  CLS: {
    good: 0.1,     // 0.1withinis good
    poor: 0.25,    // 0.25aboveis poor
  },
  // First Contentful Paint (FCP) - First Contentful Paint
  FCP: {
    good: 1800,    // 1.8secondswithinis good
    poor: 3000,    // 3secondsaboveis poor
  },
  // Time to First Byte (TTFB) - Time to First Byte
  TTFB: {
    good: 800,     // 800millisecondswithinis good
    poor: 1800,    // 1.8secondsaboveis poor
  },
} as const

// resourcesizebudget
export const RESOURCE_BUDGETS = {
  // JavaScript bundlesizelimit
  javascript: {
    // initial/above-the-fold JS totalsize
    firstLoad: 250 * 1024,      // 250KB
    // singlepageadditional JS size
    pageSpecific: 50 * 1024,    // 50KB
    // single chunk size
    chunkSize: 100 * 1024,      // 100KB
  },
  // CSS sizelimit
  css: {
    total: 50 * 1024,           // 50KB
    critical: 14 * 1024,        // 14KB (criticalCSS)
  },
  // imagesizelimit
  images: {
    hero: 200 * 1024,           // 200KB (main/primaryimage)
    thumbnail: 50 * 1024,       // 50KB (thumbnail)
    icon: 10 * 1024,            // 10KB (图标)
  },
  // 字体sizelimit
  fonts: {
    total: 100 * 1024,          // 100KB
    perFont: 30 * 1024,         // 30KB (single字体)
  },
} as const

// performance评分function
export function getPerformanceScore(metric: string, value: number): 'good' | 'needs-improvement' | 'poor' {
  const thresholds = CORE_WEB_VITALS_THRESHOLDS[metric as keyof typeof CORE_WEB_VITALS_THRESHOLDS]
  if (!thresholds) return 'good'
  
  if (value <= thresholds.good) return 'good'
  if (value <= thresholds.poor) return 'needs-improvement'
  return 'poor'
}

// performancebudgetcheck器
export class PerformanceBudgetChecker {
  private violations: Array<{
    type: string
    metric: string
    actual: number
    budget: number
    severity: 'warning' | 'error'
  }> = []

  // check Core Web Vitals
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

  // checkresourcesize
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

  // get/retrieve违规报告
  getViolations() {
    return this.violations
  }

  // clear违规record/log
  clearViolations() {
    this.violations = []
  }

  // generation/generateperformance报告
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

// globalperformancebudgetcheck器instance
export const performanceBudgetChecker = new PerformanceBudgetChecker()

// performancemonitoringutility function
export const performanceUtils = {
  // 测量resourceload/loading时间
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

  // get/retrievepageload/loadingperformancemetrics
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

  // check是否超出performancebudget
  checkBudget: (metrics: Record<string, number>, resources?: Record<string, number>) => {
    performanceBudgetChecker.clearViolations()
    performanceBudgetChecker.checkCoreWebVitals(metrics)
    if (resources) {
      performanceBudgetChecker.checkResourceSizes(resources)
    }
    return performanceBudgetChecker.generateReport()
  },
}
