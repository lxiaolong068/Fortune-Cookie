# 🌙 深色模式实现指南

## 概述

本项目实现了完整的深色模式支持，包括系统偏好检测、主题切换、用户偏好保存和无闪烁切换等功能。

## 🏗️ 系统架构

### 核心组件

1. **ThemeManager**: 主题管理核心类
2. **ThemeToggle**: 主题切换组件
3. **ThemeInitializer**: 主题初始化组件
4. **ThemeScript**: 防闪烁脚本

### 主题类型

```typescript
type Theme = 'light' | 'dark' | 'system'

interface ThemeConfig {
  theme: Theme                    // 用户选择的主题
  systemPreference: 'light' | 'dark'  // 系统偏好
  effectiveTheme: 'light' | 'dark'    // 实际应用的主题
}
```

## 🔧 功能特性

### 1. 主题管理

- **三种模式**: 浅色、深色、跟随系统
- **系统检测**: 自动检测系统主题偏好
- **实时切换**: 无需刷新页面即可切换主题
- **偏好保存**: 主题选择持久化存储

### 2. 无闪烁切换

- **预加载脚本**: 页面加载前应用主题
- **CSS变量**: 使用CSS自定义属性实现主题
- **过渡动画**: 平滑的主题切换动画
- **防抖处理**: 避免频繁切换造成的闪烁

### 3. 系统集成

- **媒体查询**: 监听系统主题变化
- **用户偏好**: 与用户会话管理集成
- **导航集成**: 导航栏主题切换按钮
- **全局状态**: 跨组件主题状态同步

## 📁 文件结构

```
lib/
├── theme-manager.ts            # 主题管理核心

components/
├── ThemeToggle.tsx             # 主题切换组件
├── ThemeInitializer.tsx        # 主题初始化组件

app/
├── globals.css                 # 深色模式样式
├── layout.tsx                  # 主题脚本集成

tailwind.config.js              # Tailwind深色模式配置
```

## 🚀 使用指南

### 基本使用

```typescript
import { themeManager } from '@/lib/theme-manager'

// 获取当前主题配置
const config = themeManager.getThemeConfig()

// 设置主题
themeManager.setTheme('dark')

// 切换主题
themeManager.toggleTheme()

// 循环切换主题
themeManager.cycleTheme()

// 监听主题变化
const unsubscribe = themeManager.addListener((config) => {
  console.log('Theme changed:', config)
})
```

### 组件集成

```tsx
import { ThemeToggle } from '@/components/ThemeToggle'

// 下拉菜单模式（默认）
<ThemeToggle />

// 简单按钮模式
<ThemeToggle variant="button" />

// 紧凑模式
<ThemeToggle variant="compact" showLabel={true} />
```

### React Hook

```tsx
import { useTheme } from '@/lib/theme-manager'

function MyComponent() {
  const { theme, effectiveTheme, setTheme } = useTheme()
  
  return (
    <div>
      <p>当前主题: {theme}</p>
      <p>实际主题: {effectiveTheme}</p>
      <button onClick={() => setTheme('dark')}>
        切换到深色模式
      </button>
    </div>
  )
}
```

## 🎨 样式实现

### CSS变量系统

```css
:root {
  --background: 0% 0% 100%;
  --foreground: 222.2% 84% 4.9%;
  --primary: 221.2% 83.2% 53.3%;
  /* ... 更多变量 */
}

.dark {
  --background: 222.2% 84% 4.9%;
  --foreground: 210% 40% 98%;
  --primary: 217.2% 91.2% 59.8%;
  /* ... 深色模式变量 */
}
```

### Tailwind配置

```javascript
// tailwind.config.js
module.exports = {
  darkMode: ['class'],
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        // ... 更多颜色
      },
    },
  },
}
```

### 深色模式样式

```css
.dark {
  /* 渐变背景调整 */
  .bg-gradient-to-br {
    @apply from-gray-900 via-gray-800 to-gray-900;
  }
  
  /* 卡片样式调整 */
  .bg-white/80 {
    @apply bg-gray-800/80;
  }
  
  /* 文本颜色调整 */
  .text-gray-900 {
    @apply text-gray-100;
  }
}
```

## 🔄 主题切换流程

### 1. 用户操作

```typescript
// 用户点击主题切换按钮
const handleThemeChange = (theme: Theme) => {
  themeManager.setTheme(theme)
}
```

### 2. 主题应用

```typescript
// ThemeManager内部流程
private applyTheme(): void {
  const effectiveTheme = this.getEffectiveTheme()
  const root = document.documentElement
  
  // 移除旧主题类
  root.classList.remove('light', 'dark')
  
  // 添加新主题类
  root.classList.add(effectiveTheme)
  
  // 设置主题属性
  root.setAttribute('data-theme', effectiveTheme)
  
  // 更新meta标签
  this.updateThemeColor(effectiveTheme)
}
```

### 3. 状态同步

```typescript
// 通知所有监听器
private notifyListeners(): void {
  const config = this.getThemeConfig()
  this.listeners.forEach(callback => {
    callback(config)
  })
}
```

## 🚫 防闪烁机制

### 预加载脚本

```javascript
// ThemeScript组件生成的内联脚本
(function() {
  const storedTheme = localStorage.getItem('fortune_theme');
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  let theme = 'light';
  
  if (storedTheme === 'dark') {
    theme = 'dark';
  } else if (storedTheme === 'system' || !storedTheme) {
    theme = systemPrefersDark ? 'dark' : 'light';
  }
  
  // 立即应用主题
  document.documentElement.classList.add(theme);
  document.documentElement.setAttribute('data-theme', theme);
})();
```

### CSS过渡

```css
/* 平滑过渡动画 */
* {
  transition: background-color 0.3s ease, 
              border-color 0.3s ease, 
              color 0.3s ease;
}

/* 防止闪烁 */
html {
  color-scheme: light;
}

html.dark {
  color-scheme: dark;
}
```

## 📱 系统集成

### 系统偏好检测

```typescript
// 检测系统主题偏好
private detectSystemPreference(): void {
  if (window.matchMedia) {
    this.mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    this.systemPreference = this.mediaQuery.matches ? 'dark' : 'light'
  }
}

// 监听系统主题变化
private setupSystemThemeListener(): void {
  if (this.mediaQuery) {
    this.mediaQuery.addEventListener('change', (e) => {
      this.systemPreference = e.matches ? 'dark' : 'light'
      
      if (this.currentTheme === 'system') {
        this.applyTheme()
        this.notifyListeners()
      }
    })
  }
}
```

### 用户偏好同步

```typescript
// 与用户会话管理集成
useEffect(() => {
  const initializeTheme = async () => {
    await sessionManager.initializeSession()
    const preferences = sessionManager.getPreferences()
    
    if (preferences.theme) {
      themeManager.setTheme(preferences.theme)
    }
    
    // 监听主题变化并同步
    themeManager.addListener((config) => {
      sessionManager.updatePreferences({
        theme: config.theme,
      })
    })
  }
  
  initializeTheme()
}, [])
```

## 🎯 最佳实践

### 1. 组件设计

```tsx
// 使用语义化的颜色类名
<div className="bg-background text-foreground border-border">
  <h1 className="text-primary">标题</h1>
  <p className="text-muted-foreground">描述文本</p>
</div>

// 避免硬编码颜色
// ❌ 不好
<div className="bg-white text-black">

// ✅ 好
<div className="bg-background text-foreground">
```

### 2. 条件样式

```tsx
// 使用Tailwind的dark:前缀
<div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100">
  内容
</div>

// 或使用CSS变量
<div className="bg-background text-foreground">
  内容
</div>
```

### 3. 图片和图标

```tsx
// 为深色模式提供不同的图片
<img 
  src={theme === 'dark' ? '/logo-dark.png' : '/logo-light.png'} 
  alt="Logo" 
/>

// 使用CSS filter调整图片
<img 
  src="/logo.png" 
  className="dark:invert" 
  alt="Logo" 
/>
```

### 4. 性能优化

```typescript
// 防抖主题切换
const debouncedSetTheme = debounce((theme: Theme) => {
  themeManager.setTheme(theme)
}, 100)

// 预加载主题资源
themeManager.preloadThemeResources()

// 使用CSS变量而不是重新渲染
themeManager.applyCSSVariables()
```

## 🔍 调试和测试

### 开发工具

```typescript
// 开发环境调试
if (process.env.NODE_ENV === 'development') {
  // 暴露主题管理器到全局
  (window as any).themeManager = themeManager
  
  // 添加调试日志
  themeManager.addListener((config) => {
    console.log('Theme changed:', config)
  })
}
```

### 测试用例

```typescript
// 主题切换测试
describe('ThemeManager', () => {
  it('should toggle between light and dark', () => {
    themeManager.setTheme('light')
    expect(themeManager.getEffectiveTheme()).toBe('light')
    
    themeManager.toggleTheme()
    expect(themeManager.getEffectiveTheme()).toBe('dark')
  })
  
  it('should follow system preference', () => {
    // Mock系统偏好
    Object.defineProperty(window, 'matchMedia', {
      value: jest.fn(() => ({ matches: true }))
    })
    
    themeManager.setTheme('system')
    expect(themeManager.getEffectiveTheme()).toBe('dark')
  })
})
```

## 📱 移动端适配

### 响应式设计

```tsx
// 移动端主题切换
<ThemeToggle 
  variant="compact" 
  className="md:hidden" 
/>

// 桌面端主题切换
<ThemeToggle 
  variant="dropdown" 
  className="hidden md:block" 
/>
```

### 触摸优化

```css
/* 确保触摸目标足够大 */
.theme-toggle-button {
  min-height: 44px;
  min-width: 44px;
}
```

## 🚀 部署注意事项

### 1. 服务端渲染

```tsx
// 防止SSR不匹配
const [mounted, setMounted] = useState(false)

useEffect(() => {
  setMounted(true)
}, [])

if (!mounted) {
  return <div>Loading...</div>
}
```

### 2. 缓存策略

```javascript
// 确保主题脚本不被缓存
<script 
  dangerouslySetInnerHTML={{ __html: themeScript }}
  suppressHydrationWarning
/>
```

### 3. 性能监控

```typescript
// 监控主题切换性能
const startTime = performance.now()
themeManager.setTheme('dark')
const endTime = performance.now()

console.log(`Theme switch took ${endTime - startTime}ms`)
```

## 🔗 相关资源

- [CSS Custom Properties](https://developer.mozilla.org/en-US/docs/Web/CSS/--*)
- [prefers-color-scheme](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-color-scheme)
- [Tailwind Dark Mode](https://tailwindcss.com/docs/dark-mode)
- [Next.js Themes](https://nextjs.org/docs/advanced-features/custom-app)
