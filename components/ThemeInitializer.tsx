'use client'

import { useEffect } from 'react'
import { themeManager } from '@/lib/theme-manager'
import { sessionManager } from '@/lib/session-manager'

export function ThemeInitializer() {
  useEffect(() => {
    // 初始化主题系统
    const initializeTheme = async () => {
      try {
        // 初始化会话管理器以获取用户偏好
        await sessionManager.initializeSession()
        const preferences = sessionManager.getPreferences()
        
        // 如果用户有保存的主题偏好，应用它
        if (preferences.theme && preferences.theme !== themeManager.getThemeConfig().theme) {
          themeManager.setTheme(preferences.theme)
        }
        
        // 监听主题变化并同步到用户偏好
        themeManager.addListener((config) => {
          const currentPreferences = sessionManager.getPreferences()
          if (currentPreferences.theme !== config.theme) {
            sessionManager.updatePreferences({
              theme: config.theme,
            })
          }
        })
        
        // 预加载主题资源
        themeManager.preloadThemeResources()
        
        // 应用CSS变量
        themeManager.applyCSSVariables()
        
      } catch (error) {
        console.error('Failed to initialize theme:', error)
      }
    }

    initializeTheme()
  }, [])

  return null
}

// 主题脚本 - 防止闪烁
export function ThemeScript() {
  const script = `
    (function() {
      try {
        // 检查本地存储中的主题设置
        const storedTheme = localStorage.getItem('fortune_theme');
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        
        let theme = 'light';
        
        if (storedTheme === 'dark') {
          theme = 'dark';
        } else if (storedTheme === 'system' || !storedTheme) {
          theme = systemPrefersDark ? 'dark' : 'light';
        } else if (storedTheme === 'light') {
          theme = 'light';
        }
        
        // 立即应用主题类
        document.documentElement.classList.remove('light', 'dark');
        document.documentElement.classList.add(theme);
        document.documentElement.setAttribute('data-theme', theme);
        
        // 更新theme-color meta标签
        const themeColorMeta = document.querySelector('meta[name="theme-color"]');
        if (themeColorMeta) {
          const color = theme === 'dark' ? '#1f2937' : '#ffffff';
          themeColorMeta.setAttribute('content', color);
        }
        
        // 应用CSS变量
        const root = document.documentElement;
        const variables = theme === 'dark' ? {
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
        } : {
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
        };
        
        Object.entries(variables).forEach(([property, value]) => {
          root.style.setProperty(property, value);
        });
        
      } catch (error) {
        console.error('Theme initialization error:', error);
      }
    })();
  `

  return (
    <script
      dangerouslySetInnerHTML={{ __html: script }}
      suppressHydrationWarning
    />
  )
}
