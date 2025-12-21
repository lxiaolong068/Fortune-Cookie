import { Metadata } from 'next'
import { User, Clock, Settings, BarChart3 } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { SEO } from '@/components/SEO'
import { UserHistory } from '@/components/UserHistory'
import { UserPreferences } from '@/components/UserPreferences'
import { UserStats } from '@/components/UserStats'
import { getImageUrl, getSiteUrl } from '@/lib/site'

const baseUrl = getSiteUrl()

export const metadata: Metadata = {
  title: 'Profile - Fortune Cookie AI',
  description: 'Manage your fortune cookie history, preferences, and usage stats.',
  openGraph: {
    title: 'Profile - Fortune Cookie AI',
    description: 'Manage your fortune cookie history, preferences, and usage stats.',
    type: 'website',
    url: `${baseUrl}/profile`,
    images: [
      {
        url: getImageUrl('/og-image.png'),
        width: 1200,
        height: 630,
        alt: 'Profile - Fortune Cookie AI',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Profile - Fortune Cookie AI',
    description: 'Manage your fortune cookie history, preferences, and usage stats.',
    images: [getImageUrl('/twitter-image.png')],
    creator: '@fortunecookieai',
  },
  alternates: {
    canonical: '/profile',
  },
}

export default function ProfilePage() {
  return (
    <>
      <SEO
        title="Profile - Fortune Cookie AI"
        description="Manage your fortune cookie history, preferences, and usage stats. Personalize your fortune cookie experience."
        canonical="/profile"
        openGraph={{
          title: 'Profile - Fortune Cookie AI',
          description: 'Manage your fortune cookie history, preferences, and usage stats.',
          type: 'website',
          url: 'https://fortune-cookie-ai.vercel.app/profile',
        }}
      />

      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50">
        <div className="container mx-auto px-4 py-8">
          {/* Page Title */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 rounded-full mb-4">
              <User className="w-8 h-8 text-orange-600" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Profile
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Manage your fortune cookie history, preferences, and usage stats
            </p>
          </div>

          {/* Main Content */}
          <div className="max-w-6xl mx-auto">
            <Tabs defaultValue="history" className="space-y-6">
              <TabsList className="grid w-full grid-cols-3 lg:w-96 mx-auto">
                <TabsTrigger value="history" className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span className="hidden sm:inline">History</span>
                </TabsTrigger>
                <TabsTrigger value="stats" className="flex items-center gap-2">
                  <BarChart3 className="w-4 h-4" />
                  <span className="hidden sm:inline">Stats</span>
                </TabsTrigger>
                <TabsTrigger value="settings" className="flex items-center gap-2">
                  <Settings className="w-4 h-4" />
                  <span className="hidden sm:inline">Preferences</span>
                </TabsTrigger>
              </TabsList>

              {/* History Tab */}
              <TabsContent value="history" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2">
                    <UserHistory showControls={true} />
                  </div>
                  <div className="space-y-6">
                    <UserStats />
                  </div>
                </div>
              </TabsContent>

              {/* Stats Tab */}
              <TabsContent value="stats" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <UserStats />
                  <Card>
                    <CardHeader>
                      <CardTitle>Usage Trends</CardTitle>
                      <CardDescription>
                        Analysis of your fortune cookie usage trends
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center py-8 text-gray-500">
                        <BarChart3 className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                        <p>Trend charts coming soon</p>
                        <p className="text-sm">Stay tuned for more detailed analytics</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Preferences Tab */}
              <TabsContent value="settings" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <UserPreferences />
                  <div className="space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Account Info</CardTitle>
                        <CardDescription>
                          Your basic account information
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">User Type:</span>
                            <span className="text-sm font-medium">Guest User</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Data Storage:</span>
                            <span className="text-sm font-medium">Local Storage</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Privacy Mode:</span>
                            <span className="text-sm font-medium">Enabled</span>
                          </div>
                        </div>
                        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                          <p className="text-sm text-blue-800">
                            <strong>Privacy Protection:</strong> All your data is stored in your local browser.
                            We do not collect or store your personal information.
                          </p>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Data Management</CardTitle>
                        <CardDescription>
                          Manage your local data
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="text-sm text-gray-600">
                            You can export or clear your data at any time. All operations are performed locally
                            and do not affect any server-side data.
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Footer Tip */}
          <div className="mt-12 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-orange-200">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-600">
                Data is synced to local storage in real time
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
