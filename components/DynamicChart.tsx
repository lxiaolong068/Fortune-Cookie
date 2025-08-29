"use client"

import dynamic from 'next/dynamic'
import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { BarChart3 } from 'lucide-react'

/**
 * 动态加载的图表组件
 * 使用 next/dynamic 延迟加载 recharts 重的组件
 * 提升首屏性能
 */

// 图表加载骨架屏
function ChartSkeleton() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="w-5 h-5" />
          <Skeleton className="h-6 w-32" />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-16" />
          </div>
          <Skeleton className="h-64 w-full" />
          <div className="flex justify-center gap-4">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-16" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// 动态加载的分析仪表板
const DynamicAnalyticsDashboard = dynamic(
  () => import('./AnalyticsDashboard').then(mod => ({ default: mod.AnalyticsDashboard })),
  {
    ssr: false,
    loading: () => <ChartSkeleton />,
  }
)

// 动态加载的图表容器
const DynamicChartContainer = dynamic(
  () => import('./ui/chart').then(mod => ({ default: mod.ChartContainer })),
  {
    ssr: false,
    loading: () => (
      <div className="flex aspect-video justify-center items-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500" />
      </div>
    ),
  }
)

// 动态加载的条形图
const DynamicBarChart = dynamic(
  () => import('recharts').then(mod => ({ default: mod.BarChart })),
  {
    ssr: false,
    loading: () => <Skeleton className="h-64 w-full" />,
  }
)

// 动态加载的折线图
const DynamicLineChart = dynamic(
  () => import('recharts').then(mod => ({ default: mod.LineChart })),
  {
    ssr: false,
    loading: () => <Skeleton className="h-64 w-full" />,
  }
)

// 动态加载的饼图
const DynamicPieChart = dynamic(
  () => import('recharts').then(mod => ({ default: mod.PieChart })),
  {
    ssr: false,
    loading: () => <Skeleton className="h-64 w-full" />,
  }
)

// 动态加载的面积图
const DynamicAreaChart = dynamic(
  () => import('recharts').then(mod => ({ default: mod.AreaChart })),
  {
    ssr: false,
    loading: () => <Skeleton className="h-64 w-full" />,
  }
)

// 导出所有动态组件
export {
  DynamicAnalyticsDashboard,
  DynamicChartContainer,
  DynamicBarChart,
  DynamicLineChart,
  DynamicPieChart,
  DynamicAreaChart,
  ChartSkeleton,
}

// 默认导出分析仪表板
export default DynamicAnalyticsDashboard
