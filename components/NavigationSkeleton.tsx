"use client"

import { cn } from '@/lib/utils'

/**
 * 轻量级导航骨架屏组件
 * 在 Navigation 组件加载时显示，避免布局偏移
 */
export function NavigationSkeleton() {
  return (
    <>
      {/* Desktop Navigation Skeleton */}
      <nav className="hidden md:block fixed top-6 left-1/2 transform -translate-x-1/2 z-50">
        <div className="bg-white/90 backdrop-blur-md rounded-full border border-amber-200 shadow-lg px-6 py-3">
          <div className="flex items-center space-x-1">
            {/* Navigation items skeleton */}
            {Array.from({ length: 7 }).map((_, index) => (
              <div
                key={index}
                className="px-4 py-2 rounded-full flex items-center gap-2"
              >
                {/* Icon skeleton */}
                <div className="w-4 h-4 bg-gray-200 rounded animate-pulse" />
                {/* Text skeleton */}
                <div className="w-12 h-4 bg-gray-200 rounded animate-pulse" />
              </div>
            ))}
          </div>

          {/* Theme toggle and offline status skeleton */}
          <div className="flex items-center gap-2 ml-4">
            <div className="w-8 h-8 bg-gray-200 rounded animate-pulse" />
            <div className="w-8 h-8 bg-gray-200 rounded animate-pulse" />
          </div>
        </div>
      </nav>

      {/* Mobile Navigation Skeleton */}
      <div className="md:hidden">
        {/* Hamburger menu button skeleton */}
        <div className="fixed top-4 right-4 z-50 w-10 h-10 bg-white/90 backdrop-blur-md border border-amber-200 rounded-md">
          <div className="w-5 h-5 bg-gray-200 rounded animate-pulse m-2.5" />
        </div>
      </div>
    </>
  )
}

/**
 * 简化版导航组件（无动画）
 * 用于首屏快速渲染，提升 LCP
 */
export function NavigationStatic() {
  const navigationItems = [
    { name: 'Home', href: '/' },
    { name: 'Generator', href: '/generator' },
    { name: 'Messages', href: '/messages' },
    { name: 'Browse', href: '/browse' },
    { name: 'History', href: '/history' },
    { name: 'Recipes', href: '/recipes' },
    { name: 'Profile', href: '/profile' }
  ]

  return (
    <>
      {/* Desktop Navigation - Static Version */}
      <nav className="hidden md:block fixed top-6 left-1/2 transform -translate-x-1/2 z-50">
        <div className="bg-white/90 backdrop-blur-md rounded-full border border-amber-200 shadow-lg px-6 py-3">
          <div className="flex items-center space-x-1">
            {navigationItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className={cn(
                  "px-4 py-2 rounded-full transition-colors duration-200 flex items-center gap-2",
                  "text-gray-600 hover:text-amber-600 hover:bg-amber-50"
                )}
              >
                <span className="text-sm font-medium">{item.name}</span>
              </a>
            ))}
          </div>
        </div>
      </nav>

      {/* Mobile Navigation - Static Version */}
      <div className="md:hidden">
        <button className="fixed top-4 right-4 z-50 w-10 h-10 bg-white/90 backdrop-blur-md border border-amber-200 rounded-md flex items-center justify-center hover:bg-amber-50 transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
    </>
  )
}
