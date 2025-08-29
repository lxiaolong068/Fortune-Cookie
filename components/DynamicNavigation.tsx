"use client"

import dynamic from 'next/dynamic'
import { NavigationSkeleton } from './NavigationSkeleton'

/**
 * 动态加载的导航组件
 * 使用 next/dynamic 延迟加载 framer-motion 重的 Navigation 组件
 * 提升首屏 LCP 性能
 */
const Navigation = dynamic(
  () => import('./Navigation').then(mod => ({ default: mod.Navigation })),
  {
    ssr: false, // 禁用 SSR，避免首屏阻塞
    loading: () => <NavigationSkeleton />, // 显示骨架屏
  }
)

export { Navigation as DynamicNavigation }
