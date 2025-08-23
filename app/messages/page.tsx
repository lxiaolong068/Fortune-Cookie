import { Metadata } from 'next'
import { BackgroundEffects } from '@/components/BackgroundEffects'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Sparkles, Heart, Smile, TrendingUp, Star } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Fortune Cookie Messages - Inspirational Quotes & Sayings',
  description: 'Browse our collection of inspirational fortune cookie messages, funny quotes, and motivational sayings. Find the perfect fortune cookie message for any occasion.',
  keywords: [
    'fortune cookie messages',
    'inspirational fortune cookie quotes',
    'funny fortune cookie sayings',
    'motivational quotes',
    'fortune cookie wisdom',
    'positive affirmations',
    'daily inspiration',
    'uplifting messages'
  ],
  openGraph: {
    title: 'Fortune Cookie Messages - Inspirational Quotes & Sayings',
    description: 'Browse our collection of inspirational fortune cookie messages, funny quotes, and motivational sayings.',
    type: 'website',
    url: 'https://fortune-cookie-ai.vercel.app/messages',
  },
  alternates: {
    canonical: '/messages',
  },
}

// 示例消息数据
const messageCategories = [
  {
    id: 'inspirational',
    name: 'Inspirational',
    icon: Star,
    color: 'bg-blue-100 text-blue-800',
    messages: [
      'Your future is created by what you do today, not tomorrow.',
      'The best time to plant a tree was 20 years ago. The second best time is now.',
      'Success is not final, failure is not fatal: it is the courage to continue that counts.',
      'Believe you can and you\'re halfway there.',
      'The only way to do great work is to love what you do.',
    ]
  },
  {
    id: 'funny',
    name: 'Funny',
    icon: Smile,
    color: 'bg-yellow-100 text-yellow-800',
    messages: [
      'You will find happiness with a new love... probably your cat.',
      'A closed mouth gathers no foot.',
      'You will be hungry again in one hour.',
      'Help! I\'m being held prisoner in a fortune cookie factory!',
      'The early bird might get the worm, but the second mouse gets the cheese.',
    ]
  },
  {
    id: 'love',
    name: 'Love & Relationships',
    icon: Heart,
    color: 'bg-pink-100 text-pink-800',
    messages: [
      'Love is the bridge between two hearts.',
      'The best love is the kind that awakens the soul.',
      'True love stories never have endings.',
      'Love is not about finding the right person, but being the right person.',
      'In the arithmetic of love, one plus one equals everything.',
    ]
  },
  {
    id: 'success',
    name: 'Success & Career',
    icon: TrendingUp,
    color: 'bg-green-100 text-green-800',
    messages: [
      'Success is where preparation and opportunity meet.',
      'The way to get started is to quit talking and begin doing.',
      'Innovation distinguishes between a leader and a follower.',
      'Don\'t be afraid to give up the good to go for the great.',
      'Your limitation—it\'s only your imagination.',
    ]
  },
]

export default function MessagesPage() {
  return (
    <>
      <main className="min-h-screen w-full overflow-x-hidden relative">
        <BackgroundEffects />
        <div className="relative z-10">
          <div className="container mx-auto px-4 py-8">
            {/* 页面标题 */}
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-amber-600 via-yellow-600 to-orange-600 bg-clip-text text-transparent mb-4">
                Fortune Cookie Messages
              </h1>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Discover our curated collection of inspirational quotes, funny sayings, and wisdom-filled messages. 
                Perfect for daily motivation or sharing with friends!
              </p>
            </div>

            {/* 消息分类 */}
            <div className="space-y-12">
              {messageCategories.map((category) => {
                const IconComponent = category.icon
                return (
                  <section key={category.id} className="mb-12">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-2 rounded-lg bg-white/80 backdrop-blur-sm border border-amber-200">
                        <IconComponent className="w-6 h-6 text-amber-600" />
                      </div>
                      <h2 className="text-2xl font-semibold text-gray-800">
                        {category.name}
                      </h2>
                      <Badge className={category.color}>
                        {category.messages.length} messages
                      </Badge>
                    </div>
                    
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {category.messages.map((message, index) => (
                        <Card key={index} className="p-6 bg-white/90 backdrop-blur-sm border-amber-200 hover:shadow-lg transition-all duration-200 hover:scale-105">
                          <div className="flex items-start gap-3">
                            <Sparkles className="w-5 h-5 text-amber-500 mt-1 flex-shrink-0" />
                            <blockquote className="text-gray-700 italic leading-relaxed">
                              "{message}"
                            </blockquote>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </section>
                )
              })}
            </div>

            {/* SEO内容 */}
            <div className="mt-16 max-w-4xl mx-auto">
              <section className="mb-12">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                  About Fortune Cookie Messages
                </h2>
                <p className="text-gray-600 leading-relaxed mb-4">
                  Fortune cookies have been bringing wisdom, humor, and inspiration to people for generations. 
                  Our collection features carefully curated messages that span various themes and emotions, 
                  from motivational quotes that inspire action to funny sayings that bring a smile to your face.
                </p>
                <p className="text-gray-600 leading-relaxed">
                  Whether you're looking for daily inspiration, planning a special event, or just want to 
                  brighten someone's day, our fortune cookie messages offer the perfect blend of wisdom 
                  and entertainment. Each message is designed to be meaningful, memorable, and shareable.
                </p>
              </section>

              <section className="mb-12">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                  Message Categories
                </h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 border border-amber-200">
                    <h3 className="text-lg font-medium text-amber-700 mb-2">Inspirational Messages</h3>
                    <p className="text-gray-600">
                      Uplifting quotes and motivational sayings to inspire and encourage positive thinking.
                    </p>
                  </div>
                  <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 border border-amber-200">
                    <h3 className="text-lg font-medium text-amber-700 mb-2">Funny Sayings</h3>
                    <p className="text-gray-600">
                      Humorous and witty messages that bring laughter and joy to your day.
                    </p>
                  </div>
                  <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 border border-amber-200">
                    <h3 className="text-lg font-medium text-amber-700 mb-2">Love & Relationships</h3>
                    <p className="text-gray-600">
                      Romantic and heartfelt messages about love, friendship, and human connections.
                    </p>
                  </div>
                  <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 border border-amber-200">
                    <h3 className="text-lg font-medium text-amber-700 mb-2">Success & Career</h3>
                    <p className="text-gray-600">
                      Professional wisdom and career-focused messages for achieving your goals.
                    </p>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
