# 👤 用户会话管理系统指南

## 概述

本项目实现了完整的用户会话管理系统，提供历史记录、偏好设置、使用统计和数据管理功能，所有数据都存储在用户本地浏览器中，确保隐私安全。

## 🏗️ 系统架构

### 核心组件

1. **SessionManager**: 会话管理核心类
2. **UserHistory**: 历史记录组件
3. **UserPreferences**: 偏好设置组件
4. **UserStats**: 使用统计组件

### 数据模型

```typescript
interface UserSession {
  id: string
  userId: string
  sessionId: string
  createdAt: Date
  lastActiveAt: Date
  expiresAt: Date
  data: SessionData
}

interface SessionData {
  preferences: UserPreferences
  history: FortuneHistory[]
  stats: UserStats
  metadata: SessionMetadata
}
```

## 🔧 功能特性

### 1. 会话管理

- **自动初始化**: 页面加载时自动创建或恢复会话
- **会话持久化**: 数据存储在 sessionStorage 和 localStorage
- **会话过期**: 7天自动过期机制
- **跨标签页同步**: 同一浏览器多标签页数据同步

### 2. 历史记录

- **自动记录**: 生成的幸运饼干自动保存到历史
- **搜索过滤**: 支持按内容、类别、来源搜索
- **交互记录**: 记录点赞、分享等用户行为
- **数据限制**: 最多保存100条历史记录

### 3. 偏好设置

- **主题设置**: 浅色/深色/跟随系统
- **语言选择**: 中文/英文界面
- **喜欢类别**: 个性化推荐设置
- **通知设置**: 控制各种通知开关

### 4. 使用统计

- **生成统计**: 总生成数、点赞数、分享数
- **参与度分析**: 点赞率、分享率计算
- **连续访问**: 连续访问天数统计
- **成就系统**: 基于使用量的成就徽章

## 📁 文件结构

```
lib/
├── session-manager.ts              # 会话管理核心

components/
├── UserHistory.tsx                 # 历史记录组件
├── UserPreferences.tsx             # 偏好设置组件
├── UserStats.tsx                   # 使用统计组件

app/
├── profile/
│   └── page.tsx                    # 个人中心页面
```

## 🚀 使用指南

### 基本使用

```typescript
import { sessionManager } from '@/lib/session-manager'

// 初始化会话
const session = await sessionManager.initializeSession()

// 添加历史记录
sessionManager.addFortuneToHistory({
  message: '今天是美好的一天',
  category: 'inspirational',
  mood: 'positive',
  source: 'ai',
  liked: false,
  shared: false,
})

// 更新偏好设置
sessionManager.updatePreferences({
  theme: 'dark',
  language: 'zh',
})

// 获取统计信息
const stats = sessionManager.getStats()
```

### 组件集成

```tsx
import { UserHistory } from '@/components/UserHistory'
import { UserPreferences } from '@/components/UserPreferences'
import { UserStats } from '@/components/UserStats'

function ProfilePage() {
  return (
    <div>
      <UserHistory showControls={true} />
      <UserPreferences onPreferencesChange={handleChange} />
      <UserStats />
    </div>
  )
}
```

## 📊 数据存储策略

### 存储分层

1. **sessionStorage**: 当前会话数据
   - 会话信息
   - 临时设置
   - 当前状态

2. **localStorage**: 持久化数据
   - 用户ID
   - 偏好设置
   - 会话计数

### 数据结构

```javascript
// sessionStorage
{
  "fortune_session": {
    "id": "session-uuid",
    "userId": "user-uuid",
    "data": {
      "preferences": {...},
      "history": [...],
      "stats": {...}
    }
  }
}

// localStorage
{
  "fortune_user_id": "user-uuid",
  "fortune_preferences": {...},
  "fortune_session_count": 5
}
```

## 🔒 隐私保护

### 数据安全

- **本地存储**: 所有数据仅存储在用户浏览器
- **无服务器存储**: 不向服务器发送个人数据
- **用户控制**: 用户可随时清除所有数据
- **透明度**: 明确告知数据存储位置和用途

### 数据管理

```typescript
// 导出用户数据
const exportData = sessionManager.exportUserData()

// 清除历史记录
sessionManager.clearHistory()

// 销毁会话
sessionManager.destroySession()
```

## 📈 统计分析

### 用户行为统计

```typescript
interface UserStats {
  totalGenerated: number      // 总生成数
  totalLiked: number         // 总点赞数
  totalShared: number        // 总分享数
  favoriteCategory: string   // 最喜欢的类别
  streakDays: number         // 连续访问天数
  lastVisit: Date           // 最后访问时间
  sessionCount: number       // 会话次数
}
```

### 参与度计算

```typescript
// 点赞率计算
const likeRate = (stats.totalLiked / stats.totalGenerated) * 100

// 分享率计算
const shareRate = (stats.totalShared / stats.totalGenerated) * 100

// 用户等级判定
const getUserLevel = (likeRate: number) => {
  if (likeRate >= 80) return '超级粉丝'
  if (likeRate >= 60) return '活跃用户'
  if (likeRate >= 40) return '普通用户'
  return '新用户'
}
```

## 🎯 个性化推荐

### 偏好学习

```typescript
// 基于历史记录分析偏好
const analyzePreferences = (history: FortuneHistory[]) => {
  const categoryCount = history.reduce((acc, item) => {
    acc[item.category] = (acc[item.category] || 0) + 1
    return acc
  }, {} as Record<string, number>)
  
  const favoriteCategory = Object.entries(categoryCount)
    .sort(([,a], [,b]) => b - a)[0]?.[0]
    
  return favoriteCategory
}

// 更新用户统计
sessionManager.updateStats({
  favoriteCategory: analyzePreferences(history)
})
```

### 智能推荐

```typescript
// 基于用户偏好推荐类别
const getRecommendedCategories = (preferences: UserPreferences) => {
  return preferences.favoriteCategories.length > 0
    ? preferences.favoriteCategories
    : ['inspirational', 'motivational', 'wisdom']
}
```

## 🔄 数据同步

### 会话同步

```typescript
// 监听存储变化
window.addEventListener('storage', (event) => {
  if (event.key === 'fortune_preferences') {
    // 同步偏好设置变化
    const newPreferences = JSON.parse(event.newValue || '{}')
    updateUIPreferences(newPreferences)
  }
})

// 跨标签页通信
const broadcastChannel = new BroadcastChannel('fortune_session')
broadcastChannel.postMessage({
  type: 'preferences_updated',
  data: newPreferences
})
```

### 数据一致性

```typescript
// 定期同步检查
setInterval(() => {
  const currentSession = sessionManager.getCurrentSession()
  if (currentSession) {
    sessionManager.updateLastActive()
  }
}, 60000) // 每分钟更新一次
```

## 🛠️ 开发工具

### 调试功能

```typescript
// 开发环境调试
if (process.env.NODE_ENV === 'development') {
  // 暴露会话管理器到全局
  (window as any).sessionManager = sessionManager
  
  // 添加调试日志
  console.log('Session initialized:', session)
}
```

### 数据验证

```typescript
// 数据完整性检查
const validateSessionData = (session: UserSession) => {
  const errors: string[] = []
  
  if (!session.userId) errors.push('Missing userId')
  if (!session.sessionId) errors.push('Missing sessionId')
  if (session.history.length > 100) errors.push('History too long')
  
  return errors
}
```

## 📱 移动端优化

### 响应式设计

```tsx
// 移动端适配
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  <UserHistory className="md:col-span-2" />
  <UserStats />
</div>
```

### 触摸优化

```tsx
// 触摸友好的交互
<Button
  size="sm"
  className="touch-target-44" // 确保触摸目标至少44px
  onClick={handleAction}
>
  操作
</Button>
```

## 🚀 性能优化

### 懒加载

```typescript
// 历史记录懒加载
const loadHistory = useCallback(async (limit = 20) => {
  const history = sessionManager.getHistory(limit)
  setHistory(history)
}, [])

// 分页加载
const loadMoreHistory = () => {
  const nextBatch = sessionManager.getHistory(currentLimit + 20)
  setHistory(nextBatch)
  setCurrentLimit(prev => prev + 20)
}
```

### 内存管理

```typescript
// 清理过期数据
const cleanupExpiredData = () => {
  const session = sessionManager.getCurrentSession()
  if (session && sessionManager.isSessionExpired(session)) {
    sessionManager.destroySession()
  }
}

// 定期清理
setInterval(cleanupExpiredData, 5 * 60 * 1000) // 每5分钟检查一次
```

## 📚 最佳实践

### 1. 数据保护

- 始终在本地存储敏感数据
- 提供数据导出和删除功能
- 明确告知用户数据使用方式

### 2. 用户体验

- 提供直观的设置界面
- 实时反馈用户操作结果
- 优雅处理错误情况

### 3. 性能考虑

- 合理限制历史记录数量
- 使用防抖处理频繁操作
- 优化大数据量的渲染

### 4. 可访问性

- 提供键盘导航支持
- 使用语义化HTML结构
- 支持屏幕阅读器

## 🔗 相关资源

- [Web Storage API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API)
- [Broadcast Channel API](https://developer.mozilla.org/en-US/docs/Web/API/Broadcast_Channel_API)
- [Privacy by Design](https://www.ipc.on.ca/wp-content/uploads/resources/7foundationalprinciples.pdf)
- [GDPR Compliance](https://gdpr.eu/)
