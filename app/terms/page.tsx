import { Metadata } from 'next'
import { BackgroundEffects } from '@/components/BackgroundEffects'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { FileText, Users, Shield, AlertTriangle, CheckCircle, XCircle, Scale, Mail } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Terms of Service - Fortune Cookie AI',
  description: 'Fortune Cookie AI Terms of Service. Learn about the rules, rights, and responsibilities for using our service. Please read these terms carefully.',
  keywords: [
    'terms of service',
    'terms of use',
    'user agreement',
    'service agreement',
    'Fortune Cookie AI',
    'legal terms',
    'user responsibilities',
    'service rules'
  ],
  openGraph: {
    title: 'Terms of Service - Fortune Cookie AI',
    description: 'Learn about the terms and conditions for using Fortune Cookie AI service.',
    type: 'article',
    url: 'https://www.fortune-cookie.cc/terms',
  },
  alternates: {
    canonical: '/terms',
  },
  robots: 'index, follow',
}

const termsSections = [
  {
    id: 'acceptance',
    title: 'Terms Acceptance',
    icon: CheckCircle,
    content: [
      {
        subtitle: 'Agreement Effective',
        items: [
          'By accessing or using Fortune Cookie AI services, you agree to be bound by these Terms of Service',
          'If you do not agree to these terms, please do not use our services',
          'We reserve the right to modify these terms at any time, and modified terms will be published on the website'
        ]
      },
      {
        subtitle: 'User Eligibility',
        items: [
          'You must be at least 13 years old to use our services',
          'If you are under 18, you need parental or guardian consent to use our services',
          'You must provide accurate and complete information'
        ]
      }
    ]
  },
  {
    id: 'service-description',
    title: 'Service Description',
    icon: FileText,
    content: [
      {
        subtitle: 'Services We Provide',
        items: [
          'AI-powered fortune cookie message generator',
          'Browse preset fortune cookie message database',
          'Personalized message creation and history management',
          'Educational content and fortune cookie cultural information'
        ]
      },
      {
        subtitle: 'Service Features',
        items: [
          'Free to use, no registration required',
          'Support for multiple themes and styles of message generation',
          'Local data storage to protect user privacy',
          'Responsive design supporting multiple devices'
        ]
      }
    ]
  },
  {
    id: 'user-conduct',
    title: 'User Conduct Guidelines',
    icon: Users,
    content: [
      {
        subtitle: 'Permitted Use',
        items: [
          'Personal entertainment and inspirational purposes',
          'Educational and cultural learning purposes',
          'Sharing generated messages with friends and family',
          'Reasonable commercial use (such as restaurants, events, etc.)'
        ]
      },
      {
        subtitle: 'Prohibited Behavior',
        items: [
          'Malicious use or abuse of service features',
          'Attempting to damage, interfere with, or harm the service',
          'Using automated tools to excessively request services',
          'Spreading harmful, illegal, or inappropriate content'
        ]
      }
    ]
  },
  {
    id: 'intellectual-property',
    title: 'Intellectual Property',
    icon: Shield,
    content: [
      {
        subtitle: 'Our Rights',
        items: [
          'Fortune Cookie AI trademarks, logos, and brands belong to us',
          'Website design, code, and functionality are protected by copyright',
          'Editing and organizing work of preset message database is protected',
          'We reserve all rights not expressly granted'
        ]
      },
      {
        subtitle: 'User Content',
        items: [
          'Custom messages you generate belong to you',
          'You authorize us to store and process your usage data to improve services',
          'You may not claim ownership of our intellectual property',
          'You are free to use and share the messages you generate'
        ]
      }
    ]
  },
  {
    id: 'disclaimers',
    title: 'Disclaimers',
    icon: AlertTriangle,
    content: [
      {
        subtitle: 'Service Provision',
        items: [
          'Services are provided "as is" without any express or implied warranties',
          'We do not guarantee the continuity, accuracy, or reliability of the service',
          'Generated messages are for entertainment only and do not constitute professional advice',
          'We are not responsible for service interruptions or data loss'
        ]
      },
      {
        subtitle: 'Limitation of Liability',
        items: [
          'To the maximum extent permitted by law, we exclude all liability',
          'We are not liable for any indirect, incidental, or consequential damages',
          'Our total liability does not exceed the fees you paid for using the service (if applicable)',
          'Some jurisdictions may not allow liability limitations, in which case local laws shall prevail'
        ]
      }
    ]
  }
]

const serviceFeatures = [
  {
    feature: 'AI Message Generation',
    description: 'Create personalized messages using advanced AI technology',
    status: 'available',
    limitations: 'Daily generation count may be limited'
  },
  {
    feature: 'Message Database',
    description: 'Browse 500+ carefully categorized fortune cookie messages',
    status: 'available',
    limitations: 'Content is regularly updated and maintained'
  },
  {
    feature: 'History Records',
    description: 'Locally save your generation history and preference settings',
    status: 'available',
    limitations: 'Data is stored on your device'
  },
  {
    feature: 'Offline Features',
    description: 'Provide basic functionality when network is interrupted',
    status: 'limited',
    limitations: 'Limited functionality, AI generation unavailable'
  }
]

export default function TermsPage() {
  return (
    <>
      <main className="min-h-screen w-full overflow-x-hidden relative">
        <BackgroundEffects />
        <div className="relative z-10">
          <div className="container mx-auto px-4 py-8">
            {/* Page Title */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                <Scale className="w-8 h-8 text-green-600" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-green-600 via-blue-600 to-green-800 bg-clip-text text-transparent mb-4">
                Terms of Service
              </h1>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-6">
                Welcome to Fortune Cookie AI! Please read these Terms of Service carefully, as they govern your rights and obligations when using our services.
              </p>
              <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                <span>Last Updated: August 25, 2024</span>
                <Badge className="bg-green-100 text-green-800">Effective</Badge>
              </div>
            </div>

            {/* Important Notice */}
            <section className="mb-12">
              <Card className="p-6 bg-amber-50/50 backdrop-blur-sm border-amber-200">
                <div className="flex items-start gap-4">
                  <AlertTriangle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-1" />
                  <div>
                    <h2 className="text-xl font-semibold text-gray-800 mb-3">
                      Important Notice
                    </h2>
                    <p className="text-gray-600 text-sm leading-relaxed mb-4">
                      By using Fortune Cookie AI services, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.
                      If you do not agree to any terms, please stop using our services immediately.
                    </p>
                    <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span>Free service usage</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span>No account registration required</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span>Local data storage</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span>Open source friendly</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </section>

            {/* Detailed Terms */}
            <div className="space-y-8 mb-12">
              {termsSections.map((section) => (
                <section key={section.id} id={section.id}>
                  <Card className="p-6 bg-white/90 backdrop-blur-sm border-gray-200">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <section.icon className="w-5 h-5 text-green-600" />
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
                                <div className="w-1.5 h-1.5 bg-green-500 rounded-full flex-shrink-0 mt-2"></div>
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

            {/* Service Features Description */}
            <section className="mb-12">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                Service Features Details
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                {serviceFeatures.map((item, index) => (
                  <Card key={index} className="p-6 bg-white/90 backdrop-blur-sm border-gray-200">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-lg font-semibold text-gray-800">
                        {item.feature}
                      </h3>
                      <Badge className={
                        item.status === 'available' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }>
                        {item.status === 'available' ? 'Available' : 'Limited'}
                      </Badge>
                    </div>
                    <p className="text-gray-600 text-sm mb-3">
                      {item.description}
                    </p>
                    <p className="text-xs text-gray-500">
                      <span className="font-medium">Limitations: </span>
                      {item.limitations}
                    </p>
                  </Card>
                ))}
              </div>
            </section>

            {/* Dispute Resolution */}
            <section className="mb-12">
              <Card className="p-6 bg-blue-50/50 backdrop-blur-sm border-blue-200">
                <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-3">
                  <Scale className="w-5 h-5 text-blue-600" />
                  Dispute Resolution
                </h2>
                <div className="space-y-3 text-sm text-gray-600">
                  <p>
                    <span className="font-medium">Applicable Law: </span>
                    These Terms of Service are governed by the laws of the People's Republic of China.
                  </p>
                  <p>
                    <span className="font-medium">Dispute Resolution: </span>
                    Any disputes should first be resolved through friendly negotiation. If negotiation fails, litigation may be brought to a competent people's court.
                  </p>
                  <p>
                    <span className="font-medium">Severability: </span>
                    If any part of these terms is deemed invalid or unenforceable, the remaining parts shall remain valid.
                  </p>
                </div>
              </Card>
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
                  If you have any questions about these Terms of Service or need assistance, please contact us:
                </p>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Email: </span>
                    <span>support@fortune-cookie.cc</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Legal Email: </span>
                    <span>legal@fortune-cookie.cc</span>
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
