"use client"

import dynamic from 'next/dynamic'
import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2 } from 'lucide-react'

/**
 * 优化的动态加载组件
 * 提供更好的加载状态和错误处理
 */

// 通用加载组件
export const LoadingSpinner = () => (
  <div className="flex items-center justify-center p-8">
    <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
  </div>
)

// 图表加载骨架
export const ChartSkeleton = () => (
  <Card className="w-full">
    <CardHeader>
      <CardTitle>
        <Skeleton className="h-6 w-32" />
      </CardTitle>
    </CardHeader>
    <CardContent>
      <div className="space-y-3">
        <Skeleton className="h-64 w-full" />
        <div className="flex justify-between">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-16" />
        </div>
      </div>
    </CardContent>
  </Card>
)

// 表格加载骨架
export const TableSkeleton = () => (
  <div className="space-y-3">
    {Array.from({ length: 5 }).map((_, i) => (
      <div key={i} className="flex items-center space-x-4">
        <Skeleton className="h-4 w-12" />
        <Skeleton className="h-4 flex-1" />
        <Skeleton className="h-4 w-16" />
      </div>
    ))}
  </div>
)

// 优化的动态加载配置
const dynamicConfig = {
  ssr: false,
  loading: () => <LoadingSpinner />,
}

// 重型组件的动态加载
export const DynamicAnalyticsDashboard = dynamic(
  () => import('./AnalyticsDashboard').then(mod => ({ default: mod.AnalyticsDashboard })),
  {
    ...dynamicConfig,
    loading: () => <ChartSkeleton />,
  }
)

export const DynamicUserHistory = dynamic(
  () => import('./UserHistory').then(mod => ({ default: mod.UserHistory })),
  {
    ...dynamicConfig,
    loading: () => <TableSkeleton />,
  }
)

// Recharts 组件的动态加载（按需加载）
export const DynamicBarChart = dynamic(
  () => import('recharts').then(mod => ({ default: mod.BarChart })),
  {
    ...dynamicConfig,
    loading: () => <Skeleton className="h-64 w-full" />,
  }
)

export const DynamicLineChart = dynamic(
  () => import('recharts').then(mod => ({ default: mod.LineChart })),
  {
    ...dynamicConfig,
    loading: () => <Skeleton className="h-64 w-full" />,
  }
)

export const DynamicPieChart = dynamic(
  () => import('recharts').then(mod => ({ default: mod.PieChart })),
  {
    ...dynamicConfig,
    loading: () => <Skeleton className="h-64 w-full" />,
  }
)

export const DynamicAreaChart = dynamic(
  () => import('recharts').then(mod => ({ default: mod.AreaChart })),
  {
    ...dynamicConfig,
    loading: () => <Skeleton className="h-64 w-full" />,
  }
)

// 图表容器的动态加载
export const DynamicChartContainer = dynamic(
  () => import('./ui/chart').then(mod => ({ default: mod.ChartContainer })),
  {
    ...dynamicConfig,
    loading: () => (
      <div className="flex aspect-video justify-center items-center">
        <LoadingSpinner />
      </div>
    ),
  }
)

// 错误边界组件
export const DynamicErrorBoundary = dynamic(
  () => import('./ErrorBoundary').then(mod => ({ default: mod.ErrorBoundary })),
  {
    ...dynamicConfig,
    loading: () => null,
  }
)

/**
 * 高阶组件：为任何组件添加动态加载
 */
export function withDynamicLoading<T extends Record<string, unknown>>(
  importFn: () => Promise<{ default: React.ComponentType<T> }>,
  options?: {
    loading?: () => React.ReactElement | null
    ssr?: boolean
  }
) {
  return dynamic(importFn, {
    ssr: options?.ssr ?? false,
    loading: options?.loading ?? (() => <LoadingSpinner />),
  })
}

/**
 * 预加载函数 - 在用户交互前预加载组件
 */
export const preloadComponent = (importFn: () => Promise<unknown>) => {
  if (typeof window !== 'undefined') {
    // 在空闲时间预加载
    if ('requestIdleCallback' in window) {
      window.requestIdleCallback(() => {
        importFn().catch(() => {
          // 静默处理预加载错误
        })
      })
    } else {
      // 回退到 setTimeout
      setTimeout(() => {
        importFn().catch(() => {
          // 静默处理预加载错误
        })
      }, 100)
    }
  }
}

// 预加载重型组件
export const preloadHeavyComponents = () => {
  preloadComponent(() => import('./AnalyticsDashboard'))
  preloadComponent(() => import('./UserHistory'))
  preloadComponent(() => import('recharts'))
}
