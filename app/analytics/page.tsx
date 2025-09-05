import { Metadata } from 'next'
import { BarChart3, TrendingUp, Users, Activity } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { SEO } from '@/components/SEO'
import { AnalyticsDashboard } from '@/components/AnalyticsDashboard'

export const metadata: Metadata = {
  title: 'Analytics - Fortune Cookie AI',
  description: 'View detailed user behavior, performance metrics, and business insights. Understand how users use Fortune Cookie AI.',
  robots: 'noindex, nofollow', // This page should not be indexed
}

export default function AnalyticsPage() {
  return (
    <>
      <SEO
        title="Analytics - Fortune Cookie AI"
        description="View detailed user behavior, performance metrics, and business insights for Fortune Cookie AI."
        canonical="/analytics"
        noIndex={true} // This page should not be indexed
      />

      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="container mx-auto px-4 py-8">
          {/* Page title */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full mb-4">
              <BarChart3 className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              Analytics Dashboard
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Get insights into user behavior, performance metrics, and business data to improve the experience
            </p>
          </div>

          {/* KPI cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100 text-sm font-medium">Real-time Users</p>
                    <p className="text-3xl font-bold">12</p>
                  </div>
                  <Users className="w-8 h-8 text-blue-200" />
                </div>
                <div className="mt-4 flex items-center">
                  <TrendingUp className="w-4 h-4 text-blue-200 mr-1" />
                  <span className="text-blue-100 text-sm">+5% vs yesterday</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-100 text-sm font-medium">Today’s Visits</p>
                    <p className="text-3xl font-bold">1,234</p>
                  </div>
                  <Activity className="w-8 h-8 text-green-200" />
                </div>
                <div className="mt-4 flex items-center">
                  <TrendingUp className="w-4 h-4 text-green-200 mr-1" />
                  <span className="text-green-100 text-sm">+12% vs yesterday</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-100 text-sm font-medium">Total Generations</p>
                    <p className="text-3xl font-bold">5,678</p>
                  </div>
                  <BarChart3 className="w-8 h-8 text-purple-200" />
                </div>
                <div className="mt-4 flex items-center">
                  <TrendingUp className="w-4 h-4 text-purple-200 mr-1" />
                  <span className="text-purple-100 text-sm">+8% vs yesterday</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-orange-100 text-sm font-medium">Average Session</p>
                    <p className="text-3xl font-bold">3m 24s</p>
                  </div>
                  <Activity className="w-8 h-8 text-orange-200" />
                </div>
                <div className="mt-4 flex items-center">
                  <TrendingUp className="w-4 h-4 text-orange-200 mr-1" />
                  <span className="text-orange-100 text-sm">+15% vs yesterday</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main analytics dashboard */}
          <AnalyticsDashboard showRealTime={true} />

          {/* About this data */}
          <div className="mt-12">
            <Card>
              <CardHeader>
                <CardTitle>About this data</CardTitle>
                <CardDescription>
                  How we collect and use analytics data
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                      Data we collect
                    </h3>
                    <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                      <li>• Page views and user interactions</li>
                      <li>• Performance metrics and load times</li>
                      <li>• Device and browser information</li>
                      <li>• User preferences and settings</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                      Privacy
                    </h3>
                    <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                      <li>• All data is anonymized</li>
                      <li>• We do not collect personal identifiable information</li>
                      <li>• Data is used only to improve user experience</li>
                      <li>• You can opt out anytime</li>
                    </ul>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span>Live data. Last updated: {new Date().toLocaleString('en-US')}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Technical details */}
          <div className="mt-8">
            <Card>
              <CardHeader>
                <CardTitle>Technical details</CardTitle>
                <CardDescription>
                  How the analytics system works and key capabilities
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">
                      Real‑time tracking
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Uses modern browser APIs to collect behavior and performance data in real time
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">
                      Performance monitoring
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Monitors Core Web Vitals and key metrics to ensure the best experience
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">
                      Business insights
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Provides actionable insights to improve features and user experience
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  )
}
