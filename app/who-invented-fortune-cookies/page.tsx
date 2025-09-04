import { Metadata } from 'next'
import { DynamicBackgroundEffects } from '@/components/DynamicBackgroundEffects'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Calendar, MapPin, User, Lightbulb } from 'lucide-react'
import { BreadcrumbStructuredData, FAQStructuredData } from '@/components/StructuredData'
import { FAQStructuredData as FAQSchema, whoInventedFAQs } from '@/components/FAQStructuredData'

import { getSiteUrl } from '@/lib/site'

const baseUrl = getSiteUrl()

// Static generation configuration
export const dynamic = 'force-static'
export const revalidate = 86400 // 24 hours

export const metadata: Metadata = {
  title: 'Who Invented Fortune Cookies? The Surprising History & Origins',
  description: 'Discover who invented fortune cookies — from Japanese origins to American development — and the surprising truth behind this beloved treat.',
  openGraph: {
    title: 'Who Invented Fortune Cookies? The Surprising History & Origins',
    description: 'Discover who really invented fortune cookies! Learn about the Japanese origins, American development, and the surprising truth behind this beloved treat\'s creation.',
    type: 'article',
    url: `${baseUrl}/who-invented-fortune-cookies`,
  },
  alternates: {
    canonical: '/who-invented-fortune-cookies',
  },
}

const inventors = [
  {
    name: 'Makoto Hagiwara',
    role: 'Japanese Tea Garden Designer',
    location: 'San Francisco, CA',
    year: '1914',
    claim: 'Served fortune cookies at the Japanese Tea Garden in Golden Gate Park',
    credibility: 'High',
    description: 'Most widely credited with introducing fortune cookies to America. Hagiwara served these treats to visitors at the Japanese Tea Garden as a gesture of hospitality.'
  },
  {
    name: 'David Jung',
    role: 'Restaurant Owner',
    location: 'Los Angeles, CA', 
    year: '1918',
    claim: 'Created fortune cookies at Hong Kong Noodle Company',
    credibility: 'Medium',
    description: 'Jung claimed to have invented fortune cookies to give to poor and homeless people on the streets, with inspirational messages inside.'
  },
  {
    name: 'Seiichi Kito',
    role: 'Confectioner',
    location: 'Los Angeles, CA',
    year: '1920s',
    claim: 'Mass-produced fortune cookies at Fugetsu-do bakery',
    credibility: 'Medium',
    description: 'While not the original inventor, Kito played a crucial role in popularizing and mass-producing fortune cookies in America.'
  }
]

const faqs = [
  {
    question: 'Who really invented fortune cookies?',
    answer: 'While the exact inventor is debated, Makoto Hagiwara is most widely credited with introducing fortune cookies to America around 1914 at the Japanese Tea Garden in San Francisco. However, the concept originated from Japanese "tsujiura senbei" crackers.'
  },
  {
    question: 'Are fortune cookies Chinese or Japanese?',
    answer: 'Fortune cookies have Japanese origins, inspired by "tsujiura senbei" crackers from Japan. They were adapted and popularized in America, later becoming associated with Chinese restaurants despite not being traditionally Chinese.'
  },
  {
    question: 'When were fortune cookies first made?',
    answer: 'The earliest fortune cookies in America appeared around 1914, though similar treats existed in Japan much earlier. The modern fortune cookie as we know it developed in California in the early 20th century.'
  },
  {
    question: 'Why are fortune cookies associated with Chinese food?',
    answer: 'Fortune cookies became associated with Chinese restaurants in America during the mid-20th century when Chinese restaurant owners adopted them as a dessert offering, despite their Japanese-American origins.'
  }
]

export default function WhoInventedFortuneCookiesPage() {
  return (
    <>
      <BreadcrumbStructuredData items={[
        { name: 'Home', url: '/' },
        { name: 'History', url: '/history' },
        { name: 'Who Invented Fortune Cookies', url: '/who-invented-fortune-cookies' }
      ]} />
      <FAQStructuredData faqs={faqs} />
      
      <main className="min-h-screen w-full overflow-x-hidden relative">
        <DynamicBackgroundEffects />
        <div className="relative z-10">
          <div className="container mx-auto px-4 py-8">
            {/* 页面标题 */}
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-amber-600 via-yellow-600 to-orange-600 bg-clip-text text-transparent mb-4">
                Who Invented Fortune Cookies?
              </h1>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                The surprising truth about fortune cookie origins and the people behind this beloved treat. 
                Discover the Japanese roots and American innovation that created the fortune cookies we know today.
              </p>
            </div>

            {/* 主要发明者 */}
            <section className="mb-16">
              <h2 className="text-2xl font-semibold text-gray-800 mb-8 text-center">
                The Leading Candidates for Fortune Cookie Inventor
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {inventors.map((inventor, index) => (
                  <Card key={index} className="p-6 bg-white/90 backdrop-blur-sm border-amber-200 hover:shadow-lg transition-all duration-200">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center">
                        <User className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800">{inventor.name}</h3>
                        <p className="text-sm text-gray-600">{inventor.role}</p>
                      </div>
                    </div>
                    
                    <div className="space-y-3 mb-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar className="w-4 h-4" />
                        <span>{inventor.year}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <MapPin className="w-4 h-4" />
                        <span>{inventor.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Lightbulb className="w-4 h-4 text-amber-500" />
                        <Badge className={
                          inventor.credibility === 'High' ? 'bg-green-100 text-green-800' :
                          inventor.credibility === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }>
                          {inventor.credibility} Credibility
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <h4 className="font-medium text-gray-800 mb-2">Claim to Fame:</h4>
                      <p className="text-sm text-gray-600 italic">"{inventor.claim}"</p>
                    </div>
                    
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {inventor.description}
                    </p>
                  </Card>
                ))}
              </div>
            </section>

            {/* 真相揭秘 */}
            <section className="mb-16">
              <Card className="p-8 bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200">
                <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
                  The Most Likely Answer: Makoto Hagiwara
                </h2>
                <div className="prose prose-lg max-w-none text-gray-700">
                  <p className="mb-4">
                    While the exact origins remain debated, <strong>Makoto Hagiwara</strong> is most widely 
                    credited as the person who introduced fortune cookies to America. Around 1914, Hagiwara, 
                    who designed the Japanese Tea Garden in San Francisco's Golden Gate Park, began serving 
                    these treats to visitors.
                  </p>
                  <p className="mb-4">
                    Hagiwara's fortune cookies were inspired by traditional Japanese "tsujiura senbei" - 
                    crackers containing fortunes that were sold near temples and shrines in Japan. He adapted 
                    this concept for American audiences, creating the curved shape and sweet flavor we 
                    associate with fortune cookies today.
                  </p>
                  <p>
                    The confusion about fortune cookie origins stems from the fact that multiple people 
                    contributed to their development and popularization in different ways. While Hagiwara 
                    likely introduced them, others like David Jung and Seiichi Kito helped spread and 
                    commercialize them throughout California and beyond.
                  </p>
                </div>
              </Card>
            </section>

            {/* FAQ部分 */}
            <section className="mb-16">
              <h2 className="text-2xl font-semibold text-gray-800 mb-8 text-center">
                Frequently Asked Questions
              </h2>
              <div className="space-y-6">
                {faqs.map((faq, index) => (
                  <Card key={index} className="p-6 bg-white/90 backdrop-blur-sm border-amber-200">
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">
                      {faq.question}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {faq.answer}
                    </p>
                  </Card>
                ))}
              </div>
            </section>

            {/* 结论 */}
            <section>
              <Card className="p-8 bg-white/90 backdrop-blur-sm border-amber-200">
                <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
                  The Legacy Lives On
                </h2>
                <p className="text-gray-600 leading-relaxed text-center max-w-3xl mx-auto">
                  Regardless of who exactly invented fortune cookies, their impact on American culture is undeniable. 
                  From Makoto Hagiwara's hospitality gesture at the Japanese Tea Garden to today's AI-powered 
                  fortune generators, these simple treats continue to bring joy, wisdom, and a touch of mystery 
                  to people around the world. The true invention of fortune cookies was not just creating a cookie, 
                  but creating a tradition of sharing hope and inspiration.
                </p>
              </Card>
            </section>
          </div>
        </div>
      </main>

      <FAQSchema faqs={whoInventedFAQs} />
    </>
  )
}
