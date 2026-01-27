"use client";

import { User, Clock, Settings, BarChart3, Shield, Database } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserHistory } from "@/components/UserHistory";
import { UserPreferences } from "@/components/UserPreferences";
import { UserStats } from "@/components/UserStats";
import { PageLayout, PageSection } from "@/components/PageLayout";
import { PageHero, HeroBadge } from "@/components/PageHero";
import { ModernCard, ModernCardIcon } from "@/components/ui/modern-card";

export function ProfilePageContent() {
  return (
    <PageLayout background="subtle" gradient="indigo" headerOffset={false}>
      {/* Hero Section */}
      <PageHero
        title="Profile"
        subtitle="Your Account"
        description="Manage your fortune cookie history, preferences, and usage stats. Your data is stored locally for privacy."
        icon={User}
        iconGradient={{ from: "from-indigo-500", to: "to-purple-500" }}
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Profile" }]}
        badge={<HeroBadge icon={Shield}>Privacy Protected</HeroBadge>}
        size="md"
      />

      {/* Main Content */}
      <PageSection padding="lg" bg="transparent">
        <div className="max-w-6xl mx-auto">
          <Tabs defaultValue="history" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3 lg:w-96 mx-auto bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-slate-200 dark:border-slate-700 p-1 rounded-xl">
              <TabsTrigger
                value="history"
                className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-500 data-[state=active]:to-purple-500 data-[state=active]:text-white rounded-lg transition-all"
              >
                <Clock className="w-4 h-4" />
                <span className="hidden sm:inline">History</span>
              </TabsTrigger>
              <TabsTrigger
                value="stats"
                className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-500 data-[state=active]:to-purple-500 data-[state=active]:text-white rounded-lg transition-all"
              >
                <BarChart3 className="w-4 h-4" />
                <span className="hidden sm:inline">Stats</span>
              </TabsTrigger>
              <TabsTrigger
                value="settings"
                className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-500 data-[state=active]:to-purple-500 data-[state=active]:text-white rounded-lg transition-all"
              >
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
                <ModernCard variant="glass">
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <ModernCardIcon
                        gradientFrom="from-emerald-500"
                        gradientTo="to-teal-500"
                        size="sm"
                      >
                        <BarChart3 className="w-4 h-4 text-white" />
                      </ModernCardIcon>
                      <div>
                        <h3 className="font-heading font-semibold text-slate-800 dark:text-white">
                          Usage Trends
                        </h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                          Analysis of your fortune cookie usage trends
                        </p>
                      </div>
                    </div>
                    <div className="text-center py-8 text-slate-500 dark:text-slate-400">
                      <BarChart3 className="w-12 h-12 mx-auto mb-4 text-slate-300 dark:text-slate-600" />
                      <p className="font-medium">Trend charts coming soon</p>
                      <p className="text-sm">
                        Stay tuned for more detailed analytics
                      </p>
                    </div>
                  </div>
                </ModernCard>
              </div>
            </TabsContent>

            {/* Preferences Tab */}
            <TabsContent value="settings" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <UserPreferences />
                <div className="space-y-6">
                  <ModernCard variant="glass">
                    <div className="p-6">
                      <div className="flex items-center gap-2 mb-4">
                        <ModernCardIcon
                          gradientFrom="from-blue-500"
                          gradientTo="to-cyan-500"
                          size="sm"
                        >
                          <User className="w-4 h-4 text-white" />
                        </ModernCardIcon>
                        <div>
                          <h3 className="font-heading font-semibold text-slate-800 dark:text-white">
                            Account Info
                          </h3>
                          <p className="text-sm text-slate-500 dark:text-slate-400">
                            Your basic account information
                          </p>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-700">
                          <span className="text-sm text-slate-600 dark:text-slate-300">
                            User Type:
                          </span>
                          <span className="text-sm font-medium text-slate-800 dark:text-white">
                            Guest User
                          </span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-700">
                          <span className="text-sm text-slate-600 dark:text-slate-300">
                            Data Storage:
                          </span>
                          <span className="text-sm font-medium text-slate-800 dark:text-white">
                            Local Storage
                          </span>
                        </div>
                        <div className="flex justify-between items-center py-2">
                          <span className="text-sm text-slate-600 dark:text-slate-300">
                            Privacy Mode:
                          </span>
                          <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
                            Enabled
                          </span>
                        </div>
                      </div>
                      <div className="mt-6 p-4 bg-indigo-50 dark:bg-indigo-900/30 rounded-xl border border-indigo-200 dark:border-indigo-800">
                        <div className="flex items-start gap-3">
                          <Shield className="w-5 h-5 text-indigo-600 dark:text-indigo-400 flex-shrink-0 mt-0.5" />
                          <p className="text-sm text-indigo-700 dark:text-indigo-300">
                            <strong>Privacy Protection:</strong> All your data
                            is stored in your local browser. We do not collect
                            or store your personal information.
                          </p>
                        </div>
                      </div>
                    </div>
                  </ModernCard>

                  <ModernCard variant="glass">
                    <div className="p-6">
                      <div className="flex items-center gap-2 mb-4">
                        <ModernCardIcon
                          gradientFrom="from-amber-500"
                          gradientTo="to-orange-500"
                          size="sm"
                        >
                          <Database className="w-4 h-4 text-white" />
                        </ModernCardIcon>
                        <div>
                          <h3 className="font-heading font-semibold text-slate-800 dark:text-white">
                            Data Management
                          </h3>
                          <p className="text-sm text-slate-500 dark:text-slate-400">
                            Manage your local data
                          </p>
                        </div>
                      </div>
                      <p className="text-sm text-slate-600 dark:text-slate-300">
                        You can export or clear your data at any time. All
                        operations are performed locally and do not affect any
                        server-side data.
                      </p>
                    </div>
                  </ModernCard>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </PageSection>

      {/* Footer Tip */}
      <PageSection padding="sm" bg="transparent">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-full border border-indigo-200 dark:border-indigo-800">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-slate-600 dark:text-slate-300">
              Data is synced to local storage in real time
            </span>
          </div>
        </div>
      </PageSection>
    </PageLayout>
  );
}
