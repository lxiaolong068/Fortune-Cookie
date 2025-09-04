// SEO and keyword tracking utilities

export interface KeywordData {
  keyword: string
  position: number
  impressions: number
  clicks: number
  ctr: number
  url: string
  device: 'mobile' | 'desktop' | 'tablet'
  country: string
  date: string
}

export interface SEOMetrics {
  totalImpressions: number
  totalClicks: number
  averageCTR: number
  averagePosition: number
  totalKeywords: number
  improvingKeywords: number
  decliningKeywords: number
}

// Target keywords for tracking
export const targetKeywords = [
  // Primary keywords
  'fortune cookie generator',
  'ai fortune cookie',
  'free fortune cookie generator',
  'online fortune cookie maker',
  
  // Long-tail keywords
  'funny fortune cookie messages',
  'who invented fortune cookies',
  'how to make fortune cookies at home easy',
  'inspirational fortune cookie quotes',
  'fortune cookie sayings funny',
  'best fortune cookie messages',
  'custom fortune cookie generator',
  'fortune cookie recipe easy',
  'fortune cookie history facts',
  'japanese fortune cookies origin',
  
  // Question-based keywords
  'what are fortune cookies made of',
  'where do fortune cookies come from',
  'how are fortune cookies made',
  'why are fortune cookies associated with chinese food',
  'when were fortune cookies invented',
  
  // Category-specific keywords
  'love fortune cookie messages',
  'success fortune cookie quotes',
  'wisdom fortune cookie sayings',
  'motivational fortune cookies',
  'birthday fortune cookie messages',
  'wedding fortune cookie ideas',
  
  // Recipe and DIY keywords
  'homemade fortune cookies recipe',
  'fortune cookie ingredients',
  'fortune cookie baking tutorial',
  'gluten free fortune cookies',
  'chocolate fortune cookies recipe',
  
  // Branded keywords
  'fortune cookie ai',
  'fortune cookie ai generator',
  'best ai fortune cookie generator'
]

import { getSiteUrl } from './site'

// SEO tracking functions
export class SEOTracker {
  private apiKey: string
  private siteUrl: string

  constructor(apiKey: string = '', siteUrl?: string) {
    this.apiKey = apiKey
    this.siteUrl = siteUrl || getSiteUrl()
  }

  // Track keyword rankings (mock implementation)
  async trackKeywordRankings(keywords: string[]): Promise<KeywordData[]> {
    // In production, integrate with Google Search Console API or SEO tools like SEMrush, Ahrefs
    const devices = ['mobile', 'desktop', 'tablet'] as const
    const mockData: KeywordData[] = keywords.map((keyword, index) => {
      const deviceIndex = Math.floor(Math.random() * devices.length)
      const device = devices[deviceIndex]

      if (!device) {
        throw new Error('Failed to select device type')
      }

      return {
        keyword,
        position: Math.floor(Math.random() * 20) + 1,
        impressions: Math.floor(Math.random() * 1000) + 100,
        clicks: Math.floor(Math.random() * 100) + 10,
        ctr: Math.random() * 10 + 2,
        url: this.siteUrl,
        device,
        country: 'US',
        date: new Date().toISOString().split('T')[0]!
      }
    })

    return mockData
  }

  // Get Search Console data
  async getSearchConsoleData(startDate: string, endDate: string): Promise<any> {
    // Mock implementation - in production, use Google Search Console API
    return {
      totalImpressions: 45678,
      totalClicks: 3456,
      averageCTR: 7.6,
      averagePosition: 4.2,
      queries: targetKeywords.slice(0, 10).map(keyword => ({
        query: keyword,
        impressions: Math.floor(Math.random() * 5000) + 500,
        clicks: Math.floor(Math.random() * 500) + 50,
        ctr: Math.random() * 10 + 3,
        position: Math.random() * 10 + 1
      }))
    }
  }

  // Calculate SEO metrics
  calculateSEOMetrics(keywordData: KeywordData[]): SEOMetrics {
    const totalImpressions = keywordData.reduce((sum, kw) => sum + kw.impressions, 0)
    const totalClicks = keywordData.reduce((sum, kw) => sum + kw.clicks, 0)
    const averageCTR = totalClicks / totalImpressions * 100
    const averagePosition = keywordData.reduce((sum, kw) => sum + kw.position, 0) / keywordData.length
    
    return {
      totalImpressions,
      totalClicks,
      averageCTR,
      averagePosition,
      totalKeywords: keywordData.length,
      improvingKeywords: keywordData.filter(kw => kw.position <= 10).length,
      decliningKeywords: keywordData.filter(kw => kw.position > 20).length
    }
  }

  // Generate SEO report
  async generateSEOReport(): Promise<any> {
    const keywordData = await this.trackKeywordRankings(targetKeywords)
    const metrics = this.calculateSEOMetrics(keywordData)
    const startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    const endDate = new Date().toISOString().split('T')[0]

    if (!startDate || !endDate) {
      throw new Error('Failed to generate date strings')
    }

    const searchConsoleData = await this.getSearchConsoleData(startDate, endDate)

    return {
      summary: metrics,
      keywords: keywordData,
      searchConsole: searchConsoleData,
      recommendations: this.generateRecommendations(keywordData),
      generatedAt: new Date().toISOString()
    }
  }

  // Generate SEO recommendations
  private generateRecommendations(keywordData: KeywordData[]): string[] {
    const recommendations: string[] = []
    
    const lowRankingKeywords = keywordData.filter(kw => kw.position > 10)
    const lowCTRKeywords = keywordData.filter(kw => kw.ctr < 5)
    
    if (lowRankingKeywords.length > 0) {
      recommendations.push(`Improve content for ${lowRankingKeywords.length} keywords ranking below position 10`)
    }
    
    if (lowCTRKeywords.length > 0) {
      recommendations.push(`Optimize meta titles and descriptions for ${lowCTRKeywords.length} keywords with low CTR`)
    }
    
    recommendations.push('Continue creating long-tail keyword content')
    recommendations.push('Build more internal links between related pages')
    recommendations.push('Monitor Core Web Vitals performance')
    
    return recommendations
  }
}

// Event tracking for SEO
export const trackSEOEvent = (eventName: string, data: any = {}) => {
  // Track custom events for SEO analysis
  if (typeof window !== 'undefined') {
    // Send to analytics
    fetch('/api/analytics/dashboard', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: eventName,
        category: 'SEO',
        label: data.label || '',
        value: data.value || 1,
        customData: data
      })
    }).catch(console.error)

    // Send to Google Analytics if available
    if (typeof gtag !== 'undefined') {
      gtag('event', eventName, {
        event_category: 'SEO',
        event_label: data.label,
        value: data.value,
        custom_parameter_1: data.page,
        custom_parameter_2: data.keyword
      })
    }
  }
}

// Page view tracking with SEO context
export const trackPageView = (path: string, title: string, keywords?: string[]) => {
  trackSEOEvent('page_view', {
    label: path,
    page: path,
    title,
    keywords: keywords?.join(',')
  })
}

// Search query tracking
export const trackSearchQuery = (query: string, results: number) => {
  trackSEOEvent('internal_search', {
    label: query,
    value: results,
    query
  })
}

// Fortune generation tracking
export const trackFortuneGeneration = (theme: string, method: 'ai' | 'static') => {
  trackSEOEvent('fortune_generated', {
    label: theme,
    theme,
    method
  })
}

// Export singleton instance
export const seoTracker = new SEOTracker()
