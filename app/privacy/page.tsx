import { Metadata } from 'next'
import { DynamicBackgroundEffects } from '@/components/DynamicBackgroundEffects'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Shield, Eye, Database, Cookie, Lock, UserCheck, Mail } from 'lucide-react'
import { getImageUrl } from '@/lib/site'

// Static generation configuration
export const dynamic = 'force-static'
export const revalidate = 86400 // 24 hours

export const metadata: Metadata = {
  title: 'Privacy Policy - Fortune Cookie AI',
  description: 'Privacy Policy for Fortune Cookie AI. Learn how we collect, use, and protect your data. We prioritize your privacy and security.',
  openGraph: {
    title: 'Privacy Policy - Fortune Cookie AI',
    description: 'Learn how Fortune Cookie AI protects your privacy and personal data.',
    type: 'article',
    url: 'https://www.fortune-cookie.cc/privacy',
    images: [
      {
        url: getImageUrl('/og-image.png'),
        width: 1200,
        height: 630,
        alt: 'Privacy Policy - Fortune Cookie AI',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Privacy Policy - Fortune Cookie AI',
    description: 'Learn how Fortune Cookie AI protects your privacy and personal data.',
    images: [getImageUrl('/twitter-image.png')],
    creator: '@fortunecookieai',
  },
  alternates: {
    canonical: '/privacy',
  },
  robots: 'index, follow',
}

const privacySections = [
  {
    id: 'information-collection',
    title: 'Information Collection',
    icon: Database,
    content: [
      {
        subtitle: 'Types of Information We Collect',
        items: [
          'Usage data: access time, page views, feature usage',
          'Device information: browser type, operating system, screen resolution',
          'User preferences: theme selection, language settings, display preferences',
          'Generation history: fortune cookie messages you create (stored locally only)'
        ]
      },
      {
        subtitle: 'Information Collection Methods',
        items: [
          'Automatic collection: through Cookies and local storage technology',
          'User provided: through your active settings and preference choices',
          'Analytics tools: using Google Analytics for anonymous statistical analysis'
        ]
      }
    ]
  },
  {
    id: 'information-use',
    title: 'Information Use',
    icon: Eye,
    content: [
      {
        subtitle: 'How We Use Your Information',
        items: [
          'Provide and improve service functionality',
          'Personalize user experience and content recommendations',
          'Analyze website usage and performance optimization',
          'Ensure website security and prevent abuse'
        ]
      },
      {
        subtitle: 'Data Processing Principles',
        items: [
          'Minimization principle: collect only necessary information',
          'Transparency principle: clearly inform data usage purposes',
          'Security principle: adopt appropriate technical and organizational measures to protect data'
        ]
      }
    ]
  },
  {
    id: 'data-storage',
    title: 'Data Storage',
    icon: Lock,
    content: [
      {
        subtitle: 'Storage Location and Methods',
        items: [
          'Local storage: user preferences and history stored on your device',
          'Server storage: anonymous usage statistics stored on secure cloud servers',
          'Third-party services: Google Analytics data processed according to their privacy policy'
        ]
      },
      {
        subtitle: 'Data Retention Period',
        items: [
          'Local data: controlled by users, can be cleared at any time',
          'Analytics data: automatically deleted after 26 months',
          'Log data: automatically deleted after 90 days'
        ]
      }
    ]
  },
  {
    id: 'user-rights',
    title: 'User Rights',
    icon: UserCheck,
    content: [
      {
        subtitle: 'Your Rights',
        items: [
          'Right to access: learn about information we collect about you',
          'Right to rectification: request correction of inaccurate personal information',
          'Right to erasure: request deletion of your personal information',
          'Right to restrict processing: limit information processing in specific circumstances'
        ]
      },
      {
        subtitle: 'How to Exercise Your Rights',
        items: [
          'Clear local data: clear Cookies and local storage through browser settings',
          'Contact us: send email to privacy@fortune-cookie.cc',
          'Opt out of analytics: use Google Analytics opt-out tools'
        ]
      }
    ]
  }
]

const cookieTypes = [
  {
    type: 'Essential Cookies',
    purpose: 'Required for basic website functionality',
    examples: 'Session management, security features',
    canDisable: false
  },
  {
    type: 'Analytics Cookies',
    purpose: 'Help us understand how visitors use our website',
    examples: 'Google Analytics, page view tracking',
    canDisable: true
  },
  {
    type: 'Functional Cookies',
    purpose: 'Remember your preferences and settings',
    examples: 'Theme selection, language preferences',
    canDisable: true
  }
]

export default function PrivacyPage() {
  return (
    <>
      <main className="min-h-screen w-full overflow-x-hidden relative">
        <DynamicBackgroundEffects />
        <div className="relative z-10">
          <div className="container mx-auto px-4 py-8">
            {/* Page Title */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                <Shield className="w-8 h-8 text-blue-600" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent mb-4">
                Privacy Policy
              </h1>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-6">
                Welcome to Fortune Cookie AI! We are committed to protecting your privacy and personal data.
                This policy explains how we collect, use, and safeguard your information.
              </p>
              <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                <span>Last Updated: August 25, 2024</span>
                <Badge className="bg-blue-100 text-blue-800">Effective</Badge>
              </div>
            </div>

            {/* Important Notice */}
            <section className="mb-12">
              <Card className="p-6 bg-green-50/50 backdrop-blur-sm border-green-200">
                <div className="flex items-start gap-4">
                  <Shield className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                  <div>
                    <h2 className="text-xl font-semibold text-gray-800 mb-3">
                      Privacy Commitment
                    </h2>
                    <p className="text-gray-600 text-sm leading-relaxed mb-4">
                      Fortune Cookie AI is designed with privacy in mind. Most of your data is stored locally on your device,
                      and we only collect minimal anonymous usage statistics to improve our service.
                    </p>
                    <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <UserCheck className="w-4 h-4 text-green-500" />
                        <span>No account registration required</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Database className="w-4 h-4 text-green-500" />
                        <span>Local data storage</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Eye className="w-4 h-4 text-green-500" />
                        <span>Minimal data collection</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Lock className="w-4 h-4 text-green-500" />
                        <span>Secure data handling</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </section>

            {/* Detailed Privacy Sections */}
            <div className="space-y-8 mb-12">
              {privacySections.map((section) => (
                <section key={section.id} id={section.id}>
                  <Card className="p-6 bg-white/90 backdrop-blur-sm border-gray-200">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <section.icon className="w-5 h-5 text-blue-600" />
                      </div>
                      <h2 className="text-2xl font-semibold text-gray-800">
                        {section.title}
                      </h2>
                    </div>

                    <div className="space-y-6">
                      {section.content.map((item, index) => (
                        <div key={index}>
                          <h3 className="text-lg font-medium text-gray-800 mb-3">
                            {item.subtitle}
                          </h3>
                          <ul className="space-y-2">
                            {item.items.map((listItem, itemIndex) => (
                              <li key={itemIndex} className="flex items-start gap-3 text-gray-600">
                                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full flex-shrink-0 mt-2"></div>
                                <span>{listItem}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </Card>
                </section>
              ))}
            </div>

            {/* Cookie Information */}
            <section className="mb-12">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center gap-3">
                <Cookie className="w-6 h-6 text-amber-600" />
                Cookie Usage
              </h2>
              <div className="grid md:grid-cols-3 gap-6">
                {cookieTypes.map((cookie, index) => (
                  <Card key={index} className="p-6 bg-white/90 backdrop-blur-sm border-gray-200">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-lg font-semibold text-gray-800">
                        {cookie.type}
                      </h3>
                      <Badge className={
                        cookie.canDisable
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }>
                        {cookie.canDisable ? 'Optional' : 'Required'}
                      </Badge>
                    </div>
                    <p className="text-gray-600 text-sm mb-3">
                      {cookie.purpose}
                    </p>
                    <p className="text-xs text-gray-500">
                      <span className="font-medium">Examples: </span>
                      {cookie.examples}
                    </p>
                  </Card>
                ))}
              </div>
            </section>

            {/* Contact Information */}
            <section>
              <Card className="p-6 bg-gray-50/50 backdrop-blur-sm border-gray-200">
                <div className="flex items-center gap-3 mb-4">
                  <Mail className="w-6 h-6 text-gray-600" />
                  <h2 className="text-xl font-semibold text-gray-800">
                    Contact Us
                  </h2>
                </div>
                <p className="text-gray-600 mb-4">
                  If you have any questions about this Privacy Policy or need assistance, please contact us:
                </p>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Email: </span>
                    <span>privacy@fortune-cookie.cc</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Support Email: </span>
                    <span>support@fortune-cookie.cc</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Response Time: </span>
                    <span>We will respond to your inquiry within 7 business days</span>
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
