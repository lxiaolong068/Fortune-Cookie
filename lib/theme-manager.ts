// 主题管理系统
// 处理深色模式、浅色模式和系统偏好检测

import { captureUserAction } from './error-monitoring'

export type Theme = 'light' | 'dark' | 'system'

export interface ThemeConfig {
  theme: Theme
  systemPreference: 'light' | 'dark'
  effectiveTheme: 'light' | 'dark'
}

export class ThemeManager {
  private static instance: ThemeManager
  private currentTheme: Theme = 'system'
  private systemPreference: 'light' | 'dark' = 'light'
  private listeners: Set<(config: ThemeConfig) => void> = new Set()
  private mediaQuery: MediaQueryList | null = null

  constructor() {
    if (typeof window !== 'undefined') {
      this.initializeTheme()
    }
  }

  static getInstance(): ThemeManager {
    if (!ThemeManager.instance) {
      ThemeManager.instance = new ThemeManager()
    }
    return ThemeManager.instance
  }

  // 初始化主题系统
  private initializeTheme(): void {
    // 检测系统偏好
    this.detectSystemPreference()
    
    // 从存储中恢复主题设置
    this.loadThemeFromStorage()
    
    // 监听系统主题变化
    this.setupSystemThemeListener()
    
    // 应用主题
    this.applyTheme()
  }

  // 检测系统偏好
  private detectSystemPreference(): void {
    if (window.matchMedia) {
      this.mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
      this.systemPreference = this.mediaQuery.matches ? 'dark' : 'light'
    }
  }

  // 设置系统主题监听器
  private setupSystemThemeListener(): void {
    if (this.mediaQuery) {
      const handleChange = (e: MediaQueryListEvent) => {
        this.systemPreference = e.matches ? 'dark' : 'light'
        
        // 如果当前使用系统主题，则更新应用主题
        if (this.currentTheme === 'system') {
          this.applyTheme()
          this.notifyListeners()
        }
        
        captureUserAction('system_theme_changed', 'theme_manager', undefined, {
          newSystemTheme: this.systemPreference,
          currentTheme: this.currentTheme,
        })
      }

      // 使用新的 addEventListener API
      this.mediaQuery.addEventListener('change', handleChange)
    }
  }

  // 从存储中加载主题设置
  private loadThemeFromStorage(): void {
    try {
      const storedTheme = localStorage.getItem('fortune_theme') as Theme
      if (storedTheme && ['light', 'dark', 'system'].includes(storedTheme)) {
        this.currentTheme = storedTheme
      }
    } catch (error) {
      console.warn('Failed to load theme from storage:', error)
    }
  }

  // 保存主题设置到存储
  private saveThemeToStorage(): void {
    try {
      localStorage.setItem('fortune_theme', this.currentTheme)
    } catch (error) {
      console.warn('Failed to save theme to storage:', error)
    }
  }

  // 应用主题
  private applyTheme(): void {
    const effectiveTheme = this.getEffectiveTheme()
    const root = document.documentElement
    
    // 移除所有主题类
    root.classList.remove('light', 'dark')
    
    // 添加当前主题类
    root.classList.add(effectiveTheme)
    
    // 设置主题属性
    root.setAttribute('data-theme', effectiveTheme)
    
    // 更新meta标签的theme-color
    this.updateThemeColor(effectiveTheme)
    
    // 更新favicon（如果有深色版本）
    this.updateFavicon(effectiveTheme)
  }

  // 更新主题颜色meta标签
  private updateThemeColor(theme: 'light' | 'dark'): void {
    const themeColorMeta = document.querySelector('meta[name="theme-color"]')
    if (themeColorMeta) {
      const color = theme === 'dark' ? '#1f2937' : '#ffffff'
      themeColorMeta.setAttribute('content', color)
    }
  }

  // 更新favicon
  private updateFavicon(theme: 'light' | 'dark'): void {
    const favicon = document.querySelector('link[rel="icon"]') as HTMLLinkElement
    if (favicon) {
      // 如果有深色模式的favicon，可以在这里切换
      // favicon.href = theme === 'dark' ? '/favicon-dark.ico' : '/favicon.ico'
    }
  }

  // 获取有效主题
  getEffectiveTheme(): 'light' | 'dark' {
    if (this.currentTheme === 'system') {
      return this.systemPreference
    }
    return this.currentTheme as 'light' | 'dark'
  }

  // 获取当前主题配置
  getThemeConfig(): ThemeConfig {
    return {
      theme: this.currentTheme,
      systemPreference: this.systemPreference,
      effectiveTheme: this.getEffectiveTheme(),
    }
  }

  // 设置主题
  setTheme(theme: Theme): void {
    const previousTheme = this.currentTheme
    this.currentTheme = theme
    
    this.applyTheme()
    this.saveThemeToStorage()
    this.notifyListeners()
    
    captureUserAction('theme_changed', 'theme_manager', undefined, {
      previousTheme,
      newTheme: theme,
      effectiveTheme: this.getEffectiveTheme(),
    })
  }

  // 切换主题
  toggleTheme(): void {
    const currentEffective = this.getEffectiveTheme()
    const newTheme = currentEffective === 'light' ? 'dark' : 'light'
    this.setTheme(newTheme)
  }

  // 循环切换主题
  cycleTheme(): void {
    const themeOrder: Theme[] = ['light', 'dark', 'system']
    const currentIndex = themeOrder.indexOf(this.currentTheme)
    const nextIndex = (currentIndex + 1) % themeOrder.length
    this.setTheme(themeOrder[nextIndex])
  }

  // 添加主题变化监听器
  addListener(callback: (config: ThemeConfig) => void): () => void {
    this.listeners.add(callback)
    
    // 立即调用一次以获取当前状态
    callback(this.getThemeConfig())
    
    // 返回取消监听的函数
    return () => {
      this.listeners.delete(callback)
    }
  }

  // 通知所有监听器
  private notifyListeners(): void {
    const config = this.getThemeConfig()
    this.listeners.forEach(callback => {
      try {
        callback(config)
      } catch (error) {
        console.error('Theme listener error:', error)
      }
    })
  }

  // 检查是否支持系统主题检测
  static supportsSystemTheme(): boolean {
    return typeof window !== 'undefined' && 
           window.matchMedia && 
           window.matchMedia('(prefers-color-scheme)').media !== 'not all'
  }

  // 获取系统偏好（静态方法）
  static getSystemPreference(): 'light' | 'dark' {
    if (typeof window === 'undefined') return 'light'
    
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark'
    }
    return 'light'
  }

  // 预加载主题资源
  preloadThemeResources(): void {
    // 预加载深色模式可能需要的资源
    const preloadLinks: string[] = [
      // 可以在这里添加深色模式特定的CSS或图片资源
    ]

    preloadLinks.forEach((href: string) => {
      const link = document.createElement('link')
      link.rel = 'preload'
      link.href = href
      link.as = 'style'
      document.head.appendChild(link)
    })
  }

  // 获取主题相关的CSS变量
  getThemeVariables(): Record<string, string> {
    const effectiveTheme = this.getEffectiveTheme()
    
    if (effectiveTheme === 'dark') {
      return {
        '--background': '222.2% 84% 4.9%',
        '--foreground': '210% 40% 98%',
        '--card': '222.2% 84% 4.9%',
        '--card-foreground': '210% 40% 98%',
        '--popover': '222.2% 84% 4.9%',
        '--popover-foreground': '210% 40% 98%',
        '--primary': '217.2% 91.2% 59.8%',
        '--primary-foreground': '222.2% 84% 4.9%',
        '--secondary': '217.2% 32.6% 17.5%',
        '--secondary-foreground': '210% 40% 98%',
        '--muted': '217.2% 32.6% 17.5%',
        '--muted-foreground': '215% 20.2% 65.1%',
        '--accent': '217.2% 32.6% 17.5%',
        '--accent-foreground': '210% 40% 98%',
        '--destructive': '0% 62.8% 30.6%',
        '--destructive-foreground': '210% 40% 98%',
        '--border': '217.2% 32.6% 17.5%',
        '--input': '217.2% 32.6% 17.5%',
        '--ring': '217.2% 91.2% 59.8%',
      }
    }
    
    return {
      '--background': '0% 0% 100%',
      '--foreground': '222.2% 84% 4.9%',
      '--card': '0% 0% 100%',
      '--card-foreground': '222.2% 84% 4.9%',
      '--popover': '0% 0% 100%',
      '--popover-foreground': '222.2% 84% 4.9%',
      '--primary': '221.2% 83.2% 53.3%',
      '--primary-foreground': '210% 40% 98%',
      '--secondary': '210% 40% 96%',
      '--secondary-foreground': '222.2% 84% 4.9%',
      '--muted': '210% 40% 96%',
      '--muted-foreground': '215.4% 16.3% 46.9%',
      '--accent': '210% 40% 96%',
      '--accent-foreground': '222.2% 84% 4.9%',
      '--destructive': '0% 84.2% 60.2%',
      '--destructive-foreground': '210% 40% 98%',
      '--border': '214.3% 31.8% 91.4%',
      '--input': '214.3% 31.8% 91.4%',
      '--ring': '221.2% 83.2% 53.3%',
    }
  }

  // 应用CSS变量
  applyCSSVariables(): void {
    const variables = this.getThemeVariables()
    const root = document.documentElement
    
    Object.entries(variables).forEach(([property, value]) => {
      root.style.setProperty(property, value)
    })
  }
}

// 全局主题管理器实例
export const themeManager = ThemeManager.getInstance()

// 主题切换钩子
export function useTheme() {
  if (typeof window === 'undefined') {
    return {
      theme: 'system' as Theme,
      systemPreference: 'light' as 'light' | 'dark',
      effectiveTheme: 'light' as 'light' | 'dark',
      setTheme: () => {},
      toggleTheme: () => {},
      cycleTheme: () => {},
    }
  }

  return {
    ...themeManager.getThemeConfig(),
    setTheme: (theme: Theme) => themeManager.setTheme(theme),
    toggleTheme: () => themeManager.toggleTheme(),
    cycleTheme: () => themeManager.cycleTheme(),
  }
}
