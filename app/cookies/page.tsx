import { Metadata } from 'next'
import { BackgroundEffects } from '@/components/BackgroundEffects'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Cookie, Settings, BarChart3, Shield, Eye, Trash2, RefreshCw, Mail } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Cookie 政策 - Fortune Cookie AI',
  description: 'Fortune Cookie AI Cookie 政策。了解我们如何使用 Cookies 和类似技术来改善您的浏览体验。',
  keywords: [
    'Cookie 政策',
    'Cookies',
    '网站 Cookies',
    '浏览器存储',
    '数据收集',
    'Fortune Cookie AI',
    '隐私设置',
    '本地存储'
  ],
  openGraph: {
    title: 'Cookie 政策 - Fortune Cookie AI',
    description: '了解 Fortune Cookie AI 如何使用 Cookies 和本地存储技术。',
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
    name: '必要 Cookies',
    icon: Shield,
    required: true,
    description: '这些 Cookies 对网站正常运行至关重要，无法禁用。',
    purpose: '确保网站基本功能和安全性',
    examples: [
      {
        name: 'fortune_session',
        purpose: '管理用户会话状态',
        duration: '会话结束时',
        type: 'Session Storage'
      },
      {
        name: 'fortune_preferences',
        purpose: '保存用户偏好设置',
        duration: '永久（用户控制）',
        type: 'Local Storage'
      },
      {
        name: 'theme_preference',
        purpose: '记住主题选择',
        duration: '永久（用户控制）',
        type: 'Local Storage'
      }
    ]
  },
  {
    id: 'analytics',
    name: '分析 Cookies',
    icon: BarChart3,
    required: false,
    description: '帮助我们了解网站使用情况，改善用户体验。',
    purpose: '收集匿名使用统计数据',
    examples: [
      {
        name: '_ga',
        purpose: 'Google Analytics 主要标识符',
        duration: '2 年',
        type: 'HTTP Cookie'
      },
      {
        name: '_ga_*',
        purpose: 'Google Analytics 4 属性标识符',
        duration: '2 年',
        type: 'HTTP Cookie'
      },
      {
        name: '_gid',
        purpose: 'Google Analytics 会话标识符',
        duration: '24 小时',
        type: 'HTTP Cookie'
      }
    ]
  },
  {
    id: 'functional',
    name: '功能 Cookies',
    icon: Settings,
    required: false,
    description: '增强网站功能，提供个性化体验。',
    purpose: '记住用户选择和偏好',
    examples: [
      {
        name: 'fortune_history',
        purpose: '保存生成的幸运饼干历史',
        duration: '永久（用户控制）',
        type: 'Local Storage'
      },
      {
        name: 'user_stats',
        purpose: '保存用户使用统计',
        duration: '永久（用户控制）',
        type: 'Local Storage'
      },
      {
        name: 'display_mode',
        purpose: '记住显示模式偏好',
        duration: '永久（用户控制）',
        type: 'Local Storage'
      }
    ]
  }
]

const storageTypes = [
  {
    name: 'HTTP Cookies',
    description: '存储在浏览器中的小型文本文件',
    characteristics: ['可设置过期时间', '可跨页面访问', '自动发送到服务器'],
    control: '可通过浏览器设置管理'
  },
  {
    name: 'Local Storage',
    description: '浏览器本地存储，数据持久保存',
    characteristics: ['永久存储（除非手动清除）', '仅在客户端访问', '存储容量较大'],
    control: '可通过浏览器开发者工具或设置清除'
  },
  {
    name: 'Session Storage',
    description: '会话级别的本地存储',
    characteristics: ['标签页关闭时自动清除', '仅在当前会话有效', '不跨标签页共享'],
    control: '标签页关闭时自动清除'
  }
]

const managementSteps = [
  {
    browser: 'Chrome',
    steps: [
      '点击右上角三点菜单 → 设置',
      '隐私设置和安全性 → Cookies 及其他网站数据',
      '选择"阻止第三方 Cookie"或"阻止所有 Cookie"',
      '或点击"查看所有 Cookie 和网站数据"进行详细管理'
    ]
  },
  {
    browser: 'Firefox',
    steps: [
      '点击右上角菜单按钮 → 设置',
      '隐私与安全 → Cookie 和网站数据',
      '选择合适的 Cookie 设置',
      '点击"管理数据"查看和删除特定 Cookie'
    ]
  },
  {
    browser: 'Safari',
    steps: [
      'Safari 菜单 → 偏好设置',
      '隐私标签页',
      '选择"阻止所有 Cookie"或其他选项',
      '点击"管理网站数据"进行详细设置'
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
            {/* 页面标题 */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-amber-100 rounded-full mb-4">
                <Cookie className="w-8 h-8 text-amber-600" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-amber-600 via-orange-600 to-amber-800 bg-clip-text text-transparent mb-4">
                Cookie 政策
              </h1>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-6">
                本政策说明了 Fortune Cookie AI 如何使用 Cookies 和类似技术来改善您的浏览体验，
                以及您如何控制这些技术的使用。
              </p>
              <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                <span>最后更新：2024年8月25日</span>
                <Badge className="bg-amber-100 text-amber-800">有效</Badge>
              </div>
            </div>

            {/* 什么是 Cookies */}
            <section className="mb-12">
              <Card className="p-6 bg-amber-50/50 backdrop-blur-sm border-amber-200">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center gap-3">
                  <Eye className="w-6 h-6 text-amber-600" />
                  什么是 Cookies？
                </h2>
                <p className="text-gray-600 leading-relaxed mb-4">
                  Cookies 是网站存储在您浏览器中的小型文本文件。它们帮助网站记住您的偏好、
                  改善功能性，并提供更好的用户体验。我们还使用本地存储等类似技术。
                </p>
                <div className="grid md:grid-cols-3 gap-4 text-sm">
                  <div className="flex items-center gap-2 text-gray-600">
                    <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                    <span>改善网站功能</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                    <span>记住用户偏好</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                    <span>分析使用情况</span>
                  </div>
                </div>
              </Card>
            </section>

            {/* Cookie 类别 */}
            <section className="mb-12">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                我们使用的 Cookie 类型
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
                        {category.required ? '必需' : '可选'}
                      </Badge>
                    </div>

                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">用途：</h4>
                      <p className="text-sm text-gray-600">{category.purpose}</p>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-3">具体示例：</h4>
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
                              <span className="font-medium">保留期限：</span>{example.duration}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </section>

            {/* 存储技术说明 */}
            <section className="mb-12">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                存储技术说明
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
                      <h4 className="text-sm font-medium text-gray-700 mb-2">特点：</h4>
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
                      <span className="font-medium">控制方式：</span>
                      {type.control}
                    </div>
                  </Card>
                ))}
              </div>
            </section>

            {/* Cookie 管理 */}
            <section className="mb-12">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center gap-3">
                <Settings className="w-6 h-6 text-gray-600" />
                如何管理 Cookies
              </h2>
              
              {/* 浏览器设置 */}
              <div className="space-y-6 mb-8">
                <h3 className="text-lg font-medium text-gray-800">浏览器设置</h3>
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

              {/* 快速操作 */}
              <Card className="p-6 bg-blue-50/50 backdrop-blur-sm border-blue-200">
                <h3 className="text-lg font-medium text-gray-800 mb-4 flex items-center gap-2">
                  <RefreshCw className="w-5 h-5 text-blue-600" />
                  快速清除本站数据
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  您可以通过以下方式快速清除本网站存储的所有数据：
                </p>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Trash2 className="w-4 h-4 text-red-500" />
                    <span>清除浏览器历史记录和网站数据</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Trash2 className="w-4 h-4 text-red-500" />
                    <span>使用浏览器的"清除浏览数据"功能</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Trash2 className="w-4 h-4 text-red-500" />
                    <span>在开发者工具中清除应用程序存储</span>
                  </div>
                </div>
              </Card>
            </section>

            {/* 第三方服务 */}
            <section className="mb-12">
              <Card className="p-6 bg-yellow-50/50 backdrop-blur-sm border-yellow-200">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                  第三方服务
                </h2>
                <p className="text-gray-600 text-sm leading-relaxed mb-4">
                  我们使用 Google Analytics 来分析网站使用情况。Google Analytics 会设置自己的 Cookies。
                  您可以通过以下方式选择退出：
                </p>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <span>访问 Google Analytics 退出页面</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <span>安装 Google Analytics 退出浏览器插件</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <span>在浏览器中禁用第三方 Cookies</span>
                  </div>
                </div>
              </Card>
            </section>

            {/* 联系信息 */}
            <section>
              <Card className="p-6 bg-gray-50/50 backdrop-blur-sm border-gray-200">
                <div className="flex items-center gap-3 mb-4">
                  <Mail className="w-6 h-6 text-gray-600" />
                  <h2 className="text-xl font-semibold text-gray-800">
                    联系我们
                  </h2>
                </div>
                <p className="text-gray-600 mb-4">
                  如果您对我们的 Cookie 使用有任何疑问，请联系我们：
                </p>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">邮箱：</span>
                    <span>privacy@fortune-cookie.cc</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">主题：</span>
                    <span>Cookie 政策咨询</span>
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
