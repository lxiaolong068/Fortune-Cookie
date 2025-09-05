import { Metadata } from 'next'
import { BackgroundEffects } from '@/components/BackgroundEffects'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Cookie, Settings, BarChart3, Shield, Eye, Trash2, RefreshCw, Mail } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Cookie Policy - Fortune Cookie AI',
  description: 'Fortune Cookie AI Cookie Policy. Learn how we use cookies and similar technologies to improve your browsing experience.',
  openGraph: {
    title: 'Cookie Policy - Fortune Cookie AI',
    description: 'Learn how Fortune Cookie AI uses cookies and local storage technologies.',
    type: 'article',
    url: 'https://www.fortune-cookie.cc/cookies',
  },
  alternates: {
    canonical: '/cookies',
  },
  robots: 'index, follow',
}

const cookieCategories = [
  {
    id: 'essential',
    name: 'Essential Cookies',
    icon: Shield,
    required: true,
    description: 'These cookies are necessary for the website to function and cannot be disabled.',
    purpose: 'Ensure core functionality and security',
    examples: [
      {
        name: 'fortune_session',
        purpose: 'Manage session state',
        duration: 'End of session',
        type: 'Session Storage'
      },
      {
        name: 'fortune_preferences',
        purpose: 'Save user preferences',
        duration: 'Persistent (user-controlled)',
        type: 'Local Storage'
      },
      {
        name: 'theme_preference',
        purpose: 'Remember theme selection',
        duration: 'Persistent (user-controlled)',
        type: 'Local Storage'
      }
    ]
  },
  {
    id: 'analytics',
    name: 'Analytics Cookies',
    icon: BarChart3,
    required: false,
    description: 'Help us understand site usage and improve the user experience.',
    purpose: 'Collect anonymous usage statistics',
    examples: [
      {
        name: '_ga',
        purpose: 'Google Analytics primary identifier',
        duration: '2 years',
        type: 'HTTP Cookie'
      },
      {
        name: '_ga_*',
        purpose: 'Google Analytics 4 property identifier',
        duration: '2 years',
        type: 'HTTP Cookie'
      },
      {
        name: '_gid',
        purpose: 'Google Analytics session identifier',
        duration: '24 hours',
        type: 'HTTP Cookie'
      }
    ]
  },
  {
    id: 'functional',
    name: 'Functional Cookies',
    icon: Settings,
    required: false,
    description: 'Enhance site features and provide a personalized experience.',
    purpose: 'Remember user choices and preferences',
    examples: [
      {
        name: 'fortune_history',
        purpose: 'Save generated fortune history',
        duration: 'Persistent (user-controlled)',
        type: 'Local Storage'
      },
      {
        name: 'user_stats',
        purpose: 'Save usage statistics',
        duration: 'Persistent (user-controlled)',
        type: 'Local Storage'
      },
      {
        name: 'display_mode',
        purpose: 'Remember display mode preference',
        duration: 'Persistent (user-controlled)',
        type: 'Local Storage'
      }
    ]
  }
]

const storageTypes = [
  {
    name: 'HTTP Cookies',
    description: 'Small text files stored in your browser',
    characteristics: ['Configurable expiration', 'Accessible across pages', 'Automatically sent to the server'],
    control: 'Manageable in browser settings'
  },
  {
    name: 'Local Storage',
    description: 'Persistent storage in your browser',
    characteristics: ['Persistent until manually cleared', 'Client-side only', 'Larger storage capacity'],
    control: 'Clear via browser developer tools or settings'
  },
  {
    name: 'Session Storage',
    description: 'Per-tab session storage',
    characteristics: ['Automatically cleared when the tab closes', 'Valid for the current session only', 'Not shared across tabs'],
    control: 'Cleared when the tab closes'
  }
]

const managementSteps = [
  {
    browser: 'Chrome',
    steps: [
      'Menu (⋮) → Settings',
      'Privacy and security → Cookies and other site data',
      'Choose “Block third‑party cookies” or “Block all cookies”',
      'Or use “See all cookies and site data” for detailed control'
    ]
  },
  {
    browser: 'Firefox',
    steps: [
      'Menu → Settings',
      'Privacy & Security → Cookies and Site Data',
      'Choose the cookie settings you prefer',
      'Click “Manage Data…” to view/delete specific cookies'
    ]
  },
  {
    browser: 'Safari',
    steps: [
      'Safari → Preferences',
      'Privacy tab',
      'Choose “Block all cookies” or another option',
      'Click “Manage Website Data…” for detailed control'
    ]
  }
]

export default function CookiesPage() {
  return (
    <>
      <main className="min-h-screen w-full overflow-x-hidden relative">
        <BackgroundEffects />
        <div className="relative z-10">
          <div className="container mx-auto px-4 py-8">
            {/* Page title */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-amber-100 rounded-full mb-4">
                <Cookie className="w-8 h-8 text-amber-600" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-amber-600 via-orange-600 to-amber-800 bg-clip-text text-transparent mb-4">
                Cookie Policy
              </h1>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-6">
                This policy explains how Fortune Cookie AI uses cookies and similar technologies to improve your experience
                and how you can control their use.
              </p>
              <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                <span>Last updated: August 25, 2024</span>
                <Badge className="bg-amber-100 text-amber-800">Active</Badge>
              </div>
            </div>

            {/* What are cookies */}
            <section className="mb-12">
              <Card className="p-6 bg-amber-50/50 backdrop-blur-sm border-amber-200">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center gap-3">
                  <Eye className="w-6 h-6 text-amber-600" />
                  What are cookies?
                </h2>
                <p className="text-gray-600 leading-relaxed mb-4">
                  Cookies are small text files stored in your browser. They help websites remember your preferences,
                  improve functionality, and provide a better user experience. We also use similar technologies like local storage.
                </p>
                <div className="grid md:grid-cols-3 gap-4 text-sm">
                  <div className="flex items-center gap-2 text-gray-600">
                    <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                    <span>Improve site functionality</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                    <span>Remember your preferences</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                    <span>Analyze usage</span>
                  </div>
                </div>
              </Card>
            </section>

            {/* Cookie categories */}
            <section className="mb-12">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                Types of cookies we use
              </h2>
              <div className="space-y-6">
                {cookieCategories.map((category) => (
                  <Card key={category.id} className="p-6 bg-white/90 backdrop-blur-sm border-gray-200">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-amber-100 rounded-lg">
                          <category.icon className="w-5 h-5 text-amber-600" />
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold text-gray-800">
                            {category.name}
                          </h3>
                          <p className="text-sm text-gray-600 mt-1">
                            {category.description}
                          </p>
                        </div>
                      </div>
                      <Badge className={category.required ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}>
                        {category.required ? 'Required' : 'Optional'}
                      </Badge>
                    </div>

                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Purpose:</h4>
                      <p className="text-sm text-gray-600">{category.purpose}</p>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-3">Examples:</h4>
                      <div className="space-y-3">
                        {category.examples.map((example, index) => (
                          <div key={index} className="bg-gray-50 rounded-lg p-3">
                            <div className="flex items-start justify-between mb-2">
                              <span className="font-mono text-sm text-gray-800">{example.name}</span>
                              <Badge className="bg-blue-100 text-blue-800 text-xs">
                                {example.type}
                              </Badge>
                            </div>
                            <p className="text-xs text-gray-600 mb-1">{example.purpose}</p>
                            <p className="text-xs text-gray-500">
                              <span className="font-medium">Retention:</span> {example.duration}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </section>

            {/* Storage technologies */}
            <section className="mb-12">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                Storage technologies
              </h2>
              <div className="grid md:grid-cols-3 gap-6">
                {storageTypes.map((type, index) => (
                  <Card key={index} className="p-6 bg-white/90 backdrop-blur-sm border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">
                      {type.name}
                    </h3>
                    <p className="text-sm text-gray-600 mb-4">
                      {type.description}
                    </p>
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Characteristics:</h4>
                      <ul className="space-y-1">
                        {type.characteristics.map((char, charIndex) => (
                          <li key={charIndex} className="text-xs text-gray-600 flex items-center gap-2">
                            <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                            {char}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="text-xs text-gray-500">
                      <span className="font-medium">Control:</span>
                      {type.control}
                    </div>
                  </Card>
                ))}
              </div>
            </section>

            {/* Cookie management */}
            <section className="mb-12">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center gap-3">
                <Settings className="w-6 h-6 text-gray-600" />
                How to manage cookies
              </h2>
              
              {/* Browser settings */}
              <div className="space-y-6 mb-8">
                <h3 className="text-lg font-medium text-gray-800">Browser settings</h3>
                {managementSteps.map((browser, index) => (
                  <Card key={index} className="p-6 bg-white/90 backdrop-blur-sm border-gray-200">
                    <h4 className="text-md font-semibold text-gray-800 mb-3">
                      {browser.browser}
                    </h4>
                    <ol className="space-y-2">
                      {browser.steps.map((step, stepIndex) => (
                        <li key={stepIndex} className="text-sm text-gray-600 flex items-start gap-3">
                          <span className="w-5 h-5 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0 mt-0.5">
                            {stepIndex + 1}
                          </span>
                          {step}
                        </li>
                      ))}
                    </ol>
                  </Card>
                ))}
              </div>

              {/* Quick actions */}
              <Card className="p-6 bg-blue-50/50 backdrop-blur-sm border-blue-200">
                <h3 className="text-lg font-medium text-gray-800 mb-4 flex items-center gap-2">
                  <RefreshCw className="w-5 h-5 text-blue-600" />
                  Quickly clear site data
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  You can quickly clear all data stored by this website by:
                </p>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Trash2 className="w-4 h-4 text-red-500" />
                    <span>Clearing browsing history and site data</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Trash2 className="w-4 h-4 text-red-500" />
                    <span>Using your browser’s “Clear browsing data” feature</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Trash2 className="w-4 h-4 text-red-500" />
                    <span>Clearing Application Storage in developer tools</span>
                  </div>
                </div>
              </Card>
            </section>

            {/* Third-party services */}
            <section className="mb-12">
              <Card className="p-6 bg-yellow-50/50 backdrop-blur-sm border-yellow-200">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                  Third‑party services
                </h2>
                <p className="text-gray-600 text-sm leading-relaxed mb-4">
                  We use Google Analytics to analyze usage. Google Analytics may set its own cookies.
                  You can opt out by:
                </p>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <span>Visiting the Google Analytics opt‑out page</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <span>Installing the Google Analytics opt‑out browser add‑on</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <span>Disabling third‑party cookies in your browser</span>
                  </div>
                </div>
              </Card>
            </section>

            {/* Contact information */}
            <section>
              <Card className="p-6 bg-gray-50/50 backdrop-blur-sm border-gray-200">
                <div className="flex items-center gap-3 mb-4">
                  <Mail className="w-6 h-6 text-gray-600" />
                  <h2 className="text-xl font-semibold text-gray-800">
                    Contact us
                  </h2>
                </div>
                <p className="text-gray-600 mb-4">
                  If you have any questions about our use of cookies, please contact us:
                </p>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Email:</span>
                    <span>privacy@fortune-cookie.cc</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Subject:</span>
                    <span>Cookie policy inquiry</span>
                  </div>
                </div>
              </Card>
            </section>
          </div>
        </div>
      </main>
    </>
  )
}
