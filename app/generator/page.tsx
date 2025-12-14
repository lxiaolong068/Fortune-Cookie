import { Metadata } from 'next'
import dynamic from 'next/dynamic'
import { DynamicBackgroundEffects } from '@/components/DynamicBackgroundEffects'
import { getSiteUrl } from '@/lib/site'

// Dynamic import for heavy AIFortuneCookie component to reduce initial bundle
const AIFortuneCookie = dynamic(
  () => import('@/components/AIFortuneCookie').then(mod => ({ default: mod.AIFortuneCookie })),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-amber-200 border-t-amber-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-amber-700">Loading AI Fortune Cookie Generator...</p>
        </div>
      </div>
    ),
  }
)

const baseUrl = getSiteUrl()

export const metadata: Metadata = {
  title: 'AI Fortune Cookie Generator - Create Custom Messages',
  description: 'Free AI fortune cookie generator for personalized messages, funny quotes, and lucky numbers. Create and share custom fortune cookies instantly.',
  openGraph: {
    title: 'AI Fortune Cookie Generator - Create Custom Messages',
    description: 'Use our advanced AI fortune cookie generator to create personalized inspirational messages, funny quotes, and custom fortune cookies.',
    type: 'website',
    url: `${baseUrl}/generator`,
  },
  alternates: {
    canonical: '/generator',
  },
}

export default function GeneratorPage() {
  return (
    <main className="min-h-screen w-full overflow-x-hidden relative">
      <DynamicBackgroundEffects />
      <div className="relative z-10">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-amber-600 via-yellow-600 to-orange-600 bg-clip-text text-transparent mb-4">
              AI Fortune Cookie Generator
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Create personalized fortune cookies with our advanced AI. Generate inspirational messages, 
              funny quotes, and discover your lucky numbers with just a click!
            </p>
          </div>
          
          <AIFortuneCookie />
          
          {/* SEO优化内容 */}
          <div className="mt-16 max-w-4xl mx-auto">
            <section className="mb-12">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                How Our AI Fortune Cookie Generator Works
              </h2>
              <p className="text-gray-600 leading-relaxed">
                Our AI-powered fortune cookie generator uses advanced algorithms to create unique, 
                personalized messages tailored to your preferences. Whether you’re looking for 
                inspiration, humor, or wisdom, our tool generates authentic fortune cookie messages 
                that feel genuine and meaningful.
              </p>
            </section>
            
            <section className="mb-12">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Features of Our Fortune Cookie AI
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 border border-amber-200">
                  <h3 className="text-lg font-medium text-amber-700 mb-2">Personalized Messages</h3>
                  <p className="text-gray-600">
                    Generate custom fortune cookie messages based on different themes like inspiration, 
                    humor, love, and success.
                  </p>
                </div>
                <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 border border-amber-200">
                  <h3 className="text-lg font-medium text-amber-700 mb-2">Lucky Numbers</h3>
                  <p className="text-gray-600">
                    Each fortune comes with a set of lucky numbers, perfect for lottery tickets 
                    or just for fun!
                  </p>
                </div>
                <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 border border-amber-200">
                  <h3 className="text-lg font-medium text-amber-700 mb-2">Beautiful Animations</h3>
                  <p className="text-gray-600">
                    Enjoy smooth, delightful animations as you crack open your virtual fortune cookie.
                  </p>
                </div>
                <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 border border-amber-200">
                  <h3 className="text-lg font-medium text-amber-700 mb-2">Free to Use</h3>
                  <p className="text-gray-600">
                    Our fortune cookie generator is completely free with no registration required.
                  </p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </main>
  )
}
