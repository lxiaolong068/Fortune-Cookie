// 用户会话管理系统
// 处理用户会话、历史记录和偏好设置

import { v4 as uuidv4 } from 'uuid'
import { captureUserAction, captureBusinessEvent } from './error-monitoring'

export interface UserSession {
  id: string
  userId: string
  sessionId: string
  createdAt: Date
  lastActiveAt: Date
  expiresAt: Date
  ipAddress?: string
  userAgent?: string
  data: SessionData
}

export interface SessionData {
  preferences: UserPreferences
  history: FortuneHistory[]
  stats: UserStats
  metadata: SessionMetadata
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system'
  language: 'zh' | 'en'
  favoriteCategories: string[]
  notifications: boolean
  autoSave: boolean
  displayMode: 'card' | 'list' | 'grid'
}

export interface FortuneHistory {
  id: string
  fortuneId?: string
  message: string
  category: string
  mood: string
  source: 'ai' | 'database' | 'offline'
  timestamp: Date
  liked: boolean
  shared: boolean
  tags?: string[]
  customPrompt?: string
}

export interface UserStats {
  totalGenerated: number
  totalLiked: number
  totalShared: number
  favoriteCategory: string
  streakDays: number
  lastVisit: Date
  sessionCount: number
}

export interface SessionMetadata {
  device: string
  browser: string
  os: string
  screenResolution?: string
  timezone: string
  referrer?: string
}

// 默认用户偏好设置
const DEFAULT_PREFERENCES: UserPreferences = {
  theme: 'system',
  language: 'zh',
  favoriteCategories: [],
  notifications: true,
  autoSave: true,
  displayMode: 'card',
}

// 默认用户统计
const DEFAULT_STATS: UserStats = {
  totalGenerated: 0,
  totalLiked: 0,
  totalShared: 0,
  favoriteCategory: '',
  streakDays: 0,
  lastVisit: new Date(),
  sessionCount: 0,
}

export class SessionManager {
  private static instance: SessionManager
  private currentSession: UserSession | null = null
  private sessionStorage: Storage | null = null
  private localStorage: Storage | null = null

  constructor() {
    if (typeof window !== 'undefined') {
      this.sessionStorage = window.sessionStorage
      this.localStorage = window.localStorage
    }
  }

  static getInstance(): SessionManager {
    if (!SessionManager.instance) {
      SessionManager.instance = new SessionManager()
    }
    return SessionManager.instance
  }

  // 初始化会话
  async initializeSession(): Promise<UserSession> {
    try {
      // 尝试恢复现有会话
      const existingSession = this.getStoredSession()
      if (existingSession && !this.isSessionExpired(existingSession)) {
        this.currentSession = existingSession
        this.updateLastActive()
        captureUserAction('session_restored', 'session_management')
        return existingSession
      }

      // 创建新会话
      const newSession = await this.createNewSession()
      this.currentSession = newSession
      this.storeSession(newSession)
      
      captureBusinessEvent('session_created', {
        sessionId: newSession.sessionId,
        userId: newSession.userId,
        timestamp: new Date().toISOString(),
      })

      return newSession
    } catch (error) {
      console.error('Failed to initialize session:', error)
      throw error
    }
  }

  // 创建新会话
  private async createNewSession(): Promise<UserSession> {
    const sessionId = uuidv4()
    const userId = this.getOrCreateUserId()
    const now = new Date()
    const expiresAt = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000) // 7天后过期

    const metadata = this.collectSessionMetadata()
    
    const session: UserSession = {
      id: uuidv4(),
      userId,
      sessionId,
      createdAt: now,
      lastActiveAt: now,
      expiresAt,
      ipAddress: await this.getClientIP(),
      userAgent: navigator.userAgent,
      data: {
        preferences: { ...DEFAULT_PREFERENCES },
        history: [],
        stats: { ...DEFAULT_STATS, sessionCount: this.getSessionCount() + 1 },
        metadata,
      },
    }

    return session
  }

  // 获取或创建用户ID
  private getOrCreateUserId(): string {
    if (!this.localStorage) return uuidv4()

    let userId = this.localStorage.getItem('fortune_user_id')
    if (!userId) {
      userId = uuidv4()
      this.localStorage.setItem('fortune_user_id', userId)
    }
    return userId
  }

  // 收集会话元数据
  private collectSessionMetadata(): SessionMetadata {
    const userAgent = navigator.userAgent
    
    return {
      device: this.getDeviceType(userAgent),
      browser: this.getBrowserName(userAgent),
      os: this.getOperatingSystem(userAgent),
      screenResolution: `${screen.width}x${screen.height}`,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      referrer: document.referrer || undefined,
    }
  }

  // 获取设备类型
  private getDeviceType(userAgent: string): string {
    if (/Mobile|Android|iPhone|iPad/.test(userAgent)) {
      return 'mobile'
    } else if (/Tablet|iPad/.test(userAgent)) {
      return 'tablet'
    }
    return 'desktop'
  }

  // 获取浏览器名称
  private getBrowserName(userAgent: string): string {
    if (userAgent.includes('Chrome')) return 'Chrome'
    if (userAgent.includes('Firefox')) return 'Firefox'
    if (userAgent.includes('Safari')) return 'Safari'
    if (userAgent.includes('Edge')) return 'Edge'
    return 'Unknown'
  }

  // 获取操作系统
  private getOperatingSystem(userAgent: string): string {
    if (userAgent.includes('Windows')) return 'Windows'
    if (userAgent.includes('Mac')) return 'macOS'
    if (userAgent.includes('Linux')) return 'Linux'
    if (userAgent.includes('Android')) return 'Android'
    if (userAgent.includes('iOS')) return 'iOS'
    return 'Unknown'
  }

  // 获取客户端IP（简化版）
  private async getClientIP(): Promise<string | undefined> {
    try {
      // 在实际应用中，这通常由服务器端提供
      return undefined
    } catch {
      return undefined
    }
  }

  // 获取会话计数
  private getSessionCount(): number {
    if (!this.localStorage) return 0
    
    const count = this.localStorage.getItem('fortune_session_count')
    return count ? parseInt(count, 10) : 0
  }

  // 存储会话
  private storeSession(session: UserSession): void {
    if (!this.sessionStorage || !this.localStorage) return

    try {
      // 会话数据存储在 sessionStorage 中
      this.sessionStorage.setItem('fortune_session', JSON.stringify(session))
      
      // 用户ID和会话计数存储在 localStorage 中
      this.localStorage.setItem('fortune_user_id', session.userId)
      this.localStorage.setItem('fortune_session_count', session.data.stats.sessionCount.toString())
      
      // 存储用户偏好设置
      this.localStorage.setItem('fortune_preferences', JSON.stringify(session.data.preferences))
    } catch (error) {
      console.error('Failed to store session:', error)
    }
  }

  // 获取存储的会话
  private getStoredSession(): UserSession | null {
    if (!this.sessionStorage) return null

    try {
      const sessionData = this.sessionStorage.getItem('fortune_session')
      if (!sessionData) return null

      const session = JSON.parse(sessionData) as UserSession
      
      // 转换日期字符串为Date对象
      session.createdAt = new Date(session.createdAt)
      session.lastActiveAt = new Date(session.lastActiveAt)
      session.expiresAt = new Date(session.expiresAt)
      session.data.stats.lastVisit = new Date(session.data.stats.lastVisit)
      
      // 转换历史记录中的日期
      session.data.history = session.data.history.map(item => ({
        ...item,
        timestamp: new Date(item.timestamp),
      }))

      return session
    } catch (error) {
      console.error('Failed to parse stored session:', error)
      return null
    }
  }

  // 检查会话是否过期
  private isSessionExpired(session: UserSession): boolean {
    return new Date() > session.expiresAt
  }

  // 更新最后活跃时间
  updateLastActive(): void {
    if (!this.currentSession) return

    this.currentSession.lastActiveAt = new Date()
    this.storeSession(this.currentSession)
  }

  // 获取当前会话
  getCurrentSession(): UserSession | null {
    return this.currentSession
  }

  // 添加幸运饼干到历史记录
  addFortuneToHistory(fortune: Omit<FortuneHistory, 'id' | 'timestamp'>): void {
    if (!this.currentSession) return

    const historyItem: FortuneHistory = {
      ...fortune,
      id: uuidv4(),
      timestamp: new Date(),
    }

    this.currentSession.data.history.unshift(historyItem)
    
    // 限制历史记录数量
    if (this.currentSession.data.history.length > 100) {
      this.currentSession.data.history = this.currentSession.data.history.slice(0, 100)
    }

    // 更新统计信息
    this.currentSession.data.stats.totalGenerated++
    this.updateLastActive()
    this.storeSession(this.currentSession)

    captureUserAction('fortune_added_to_history', 'session_management', undefined, {
      category: fortune.category,
      source: fortune.source,
    })
  }

  // 获取历史记录
  getHistory(limit?: number): FortuneHistory[] {
    if (!this.currentSession) return []

    const history = this.currentSession.data.history
    return limit ? history.slice(0, limit) : history
  }

  // 更新用户偏好设置
  updatePreferences(preferences: Partial<UserPreferences>): void {
    if (!this.currentSession) return

    this.currentSession.data.preferences = {
      ...this.currentSession.data.preferences,
      ...preferences,
    }

    this.storeSession(this.currentSession)
    
    captureUserAction('preferences_updated', 'session_management', undefined, {
      updatedFields: Object.keys(preferences),
    })
  }

  // 获取用户偏好设置
  getPreferences(): UserPreferences {
    return this.currentSession?.data.preferences || DEFAULT_PREFERENCES
  }

  // 更新统计信息
  updateStats(updates: Partial<UserStats>): void {
    if (!this.currentSession) return

    this.currentSession.data.stats = {
      ...this.currentSession.data.stats,
      ...updates,
    }

    this.storeSession(this.currentSession)
  }

  // 获取统计信息
  getStats(): UserStats {
    return this.currentSession?.data.stats || DEFAULT_STATS
  }

  // 标记幸运饼干为喜欢
  likeFortuneInHistory(fortuneId: string): void {
    if (!this.currentSession) return

    const historyItem = this.currentSession.data.history.find(item => item.id === fortuneId)
    if (historyItem && !historyItem.liked) {
      historyItem.liked = true
      this.currentSession.data.stats.totalLiked++
      this.storeSession(this.currentSession)
      
      captureUserAction('fortune_liked_in_history', 'session_management')
    }
  }

  // 标记幸运饼干为已分享
  shareFortuneInHistory(fortuneId: string): void {
    if (!this.currentSession) return

    const historyItem = this.currentSession.data.history.find(item => item.id === fortuneId)
    if (historyItem && !historyItem.shared) {
      historyItem.shared = true
      this.currentSession.data.stats.totalShared++
      this.storeSession(this.currentSession)
      
      captureUserAction('fortune_shared_in_history', 'session_management')
    }
  }

  // 清除历史记录
  clearHistory(): void {
    if (!this.currentSession) return

    this.currentSession.data.history = []
    this.storeSession(this.currentSession)
    
    captureUserAction('history_cleared', 'session_management')
  }

  // 销毁会话
  destroySession(): void {
    if (this.sessionStorage) {
      this.sessionStorage.removeItem('fortune_session')
    }
    
    this.currentSession = null
    
    captureUserAction('session_destroyed', 'session_management')
  }

  // 导出用户数据
  exportUserData(): string {
    if (!this.currentSession) return '{}'

    const exportData = {
      userId: this.currentSession.userId,
      preferences: this.currentSession.data.preferences,
      history: this.currentSession.data.history,
      stats: this.currentSession.data.stats,
      exportedAt: new Date().toISOString(),
    }

    captureUserAction('user_data_exported', 'session_management')
    
    return JSON.stringify(exportData, null, 2)
  }
}

// 全局会话管理器实例
export const sessionManager = SessionManager.getInstance()
