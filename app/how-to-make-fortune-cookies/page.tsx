import { Metadata } from 'next'
import { BackgroundEffects } from '@/components/BackgroundEffects'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Clock, Users, ChefHat, CheckCircle, AlertCircle, Lightbulb } from 'lucide-react'
import { BreadcrumbStructuredData, ArticleStructuredData } from '@/components/StructuredData'

export const metadata: Metadata = {
  title: 'How to Make Fortune Cookies at Home Easy - Step by Step Guide',
  description: 'Learn how to make delicious homemade fortune cookies with our easy step-by-step tutorial. Perfect recipe for beginners with tips, tricks, and custom message ideas.',
  keywords: [
    'how to make fortune cookies at home easy',
    'homemade fortune cookies recipe',
    'fortune cookie recipe easy',
    'best homemade fortune cookies ingredients',
    'fortune cookie baking tutorial',
    'easy fortune cookie recipe',
    'make fortune cookies step by step',
    'fortune cookie recipe for beginners'
  ],
  openGraph: {
    title: 'How to Make Fortune Cookies at Home Easy - Step by Step Guide',
    description: 'Learn how to make delicious homemade fortune cookies with our easy step-by-step tutorial. Perfect recipe for beginners.',
    type: 'article',
    url: 'https://fortune-cookie-ai.vercel.app/how-to-make-fortune-cookies',
  },
  alternates: {
    canonical: '/how-to-make-fortune-cookies',
  },
}

const ingredients = [
  { item: '3 large egg whites', note: 'Room temperature works best' },
  { item: '3/4 cup white sugar', note: 'Granulated sugar' },
  { item: '1/2 cup butter, melted', note: 'Unsalted butter preferred' },
  { item: '1/4 teaspoon vanilla extract', note: 'Pure vanilla extract' },
  { item: '1/4 teaspoon almond extract', note: 'Optional but recommended' },
  { item: '1 cup all-purpose flour', note: 'Sifted for best results' },
  { item: '2 tablespoons water', note: 'Room temperature' },
  { item: 'Pinch of salt', note: 'Enhances flavor' }
]

const steps = [
  {
    step: 1,
    title: 'Prepare Your Workspace',
    description: 'Preheat oven to 300°F (150°C). Line baking sheets with parchment paper. Prepare your fortune messages by cutting them into strips about 3 inches long and 1/2 inch wide.',
    time: '5 minutes',
    tips: ['Have all ingredients at room temperature', 'Prepare fortunes before you start baking']
  },
  {
    step: 2,
    title: 'Mix the Batter',
    description: 'In a large bowl, whisk egg whites and sugar until frothy (about 2 minutes). Add melted butter, vanilla, and almond extracts. Mix well until combined.',
    time: '5 minutes',
    tips: ['Don\'t overbeat the egg whites', 'Make sure butter is cooled slightly before adding']
  },
  {
    step: 3,
    title: 'Add Dry Ingredients',
    description: 'Gradually add flour, water, and salt to the mixture. Stir until you have a smooth batter with no lumps. The consistency should be similar to thin pancake batter.',
    time: '3 minutes',
    tips: ['Sift flour for smoother batter', 'Mix just until combined to avoid tough cookies']
  },
  {
    step: 4,
    title: 'Bake the Cookies',
    description: 'Drop 1 tablespoon of batter onto prepared baking sheets, spacing them 4 inches apart. Use the back of a spoon to spread into 4-inch circles. Bake for 15-20 minutes until edges are golden brown.',
    time: '15-20 minutes',
    tips: ['Only bake 2-3 cookies at a time', 'Cookies should be golden but not brown']
  },
  {
    step: 5,
    title: 'Shape the Cookies (Work Fast!)',
    description: 'Remove from oven and work quickly while cookies are hot. Place fortune in center, fold cookie in half, then bend over the edge of a bowl or muffin tin to create the classic shape.',
    time: '30 seconds per cookie',
    tips: ['Work with one cookie at a time', 'Use oven mitts to protect your hands', 'If cookie hardens, return to oven for 30 seconds']
  },
  {
    step: 6,
    title: 'Cool and Store',
    description: 'Place shaped cookies in muffin tin cups to maintain their shape while cooling. Once completely cool, store in airtight containers for up to one week.',
    time: '10 minutes',
    tips: ['Cool completely before storing', 'Add silica gel packets to maintain crispness']
  }
]

const troubleshooting = [
  {
    problem: 'Cookies are too thick',
    solution: 'Spread the batter thinner on the baking sheet. Use less batter per cookie.'
  },
  {
    problem: 'Cookies crack when folding',
    solution: 'Work faster while cookies are hot, or return to oven for 30 seconds to soften.'
  },
  {
    problem: 'Cookies are too sweet',
    solution: 'Reduce sugar to 1/2 cup and add a pinch more salt for balance.'
  },
  {
    problem: 'Batter is too thick',
    solution: 'Add water 1 teaspoon at a time until you reach the right consistency.'
  }
]

export default function HowToMakeFortuneCookiesPage() {
  return (
    <>
      <ArticleStructuredData
        headline="How to Make Fortune Cookies at Home Easy - Step by Step Guide"
        description="Learn how to make delicious homemade fortune cookies with our easy step-by-step tutorial. Perfect recipe for beginners with tips, tricks, and custom message ideas."
        url="/how-to-make-fortune-cookies"
        datePublished="2024-01-01"
        dateModified={new Date().toISOString().split('T')[0]}
        keywords={[
          'how to make fortune cookies at home easy',
          'homemade fortune cookies recipe',
          'fortune cookie recipe easy',
          'best homemade fortune cookies ingredients',
          'fortune cookie baking tutorial',
          'easy fortune cookie recipe',
          'make fortune cookies step by step',
          'fortune cookie recipe for beginners'
        ]}
      />
      <BreadcrumbStructuredData items={[
        { name: 'Home', url: '/' },
        { name: 'Recipes', url: '/recipes' },
        { name: 'How to Make Fortune Cookies', url: '/how-to-make-fortune-cookies' }
      ]} />
      
      <main className="min-h-screen w-full overflow-x-hidden relative">
        <BackgroundEffects />
        <div className="relative z-10">
          <div className="container mx-auto px-4 py-8">
            {/* 页面标题 */}
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-amber-600 via-yellow-600 to-orange-600 bg-clip-text text-transparent mb-4">
                How to Make Fortune Cookies at Home
              </h1>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-6">
                Learn to make delicious homemade fortune cookies with this easy step-by-step guide. 
                Perfect for beginners and guaranteed to impress your friends and family!
              </p>
              
              {/* 快速信息 */}
              <div className="flex flex-wrap justify-center gap-4">
                <Badge className="bg-blue-100 text-blue-800">
                  <Clock className="w-3 h-3 mr-1" />
                  45 minutes total
                </Badge>
                <Badge className="bg-green-100 text-green-800">
                  <Users className="w-3 h-3 mr-1" />
                  Makes 24 cookies
                </Badge>
                <Badge className="bg-purple-100 text-purple-800">
                  <ChefHat className="w-3 h-3 mr-1" />
                  Beginner friendly
                </Badge>
              </div>
            </div>

            {/* 配料清单 */}
            <section className="mb-12">
              <Card className="p-6 bg-white/90 backdrop-blur-sm border-amber-200">
                <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
                  <ChefHat className="w-6 h-6 text-amber-600" />
                  Ingredients You'll Need
                </h2>
                <div className="grid md:grid-cols-2 gap-4">
                  {ingredients.map((ingredient, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-amber-50 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <span className="font-medium text-gray-800">{ingredient.item}</span>
                        <p className="text-sm text-gray-600">{ingredient.note}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </section>

            {/* 步骤说明 */}
            <section className="mb-12">
              <h2 className="text-2xl font-semibold text-gray-800 mb-8 text-center">
                Step-by-Step Instructions
              </h2>
              <div className="space-y-6">
                {steps.map((step) => (
                  <Card key={step.step} className="p-6 bg-white/90 backdrop-blur-sm border-amber-200">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                        {step.step}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <h3 className="text-lg font-semibold text-gray-800">{step.title}</h3>
                          <Badge className="bg-blue-100 text-blue-800">
                            <Clock className="w-3 h-3 mr-1" />
                            {step.time}
                          </Badge>
                        </div>
                        <p className="text-gray-600 leading-relaxed mb-4">
                          {step.description}
                        </p>
                        {step.tips.length > 0 && (
                          <div className="bg-amber-50 rounded-lg p-3">
                            <h4 className="text-sm font-medium text-amber-800 mb-2 flex items-center gap-1">
                              <Lightbulb className="w-4 h-4" />
                              Pro Tips:
                            </h4>
                            <ul className="text-sm text-amber-700 space-y-1">
                              {step.tips.map((tip, index) => (
                                <li key={index} className="flex items-start gap-2">
                                  <span className="text-amber-500 mt-1">•</span>
                                  {tip}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </section>

            {/* 故障排除 */}
            <section className="mb-12">
              <Card className="p-6 bg-white/90 backdrop-blur-sm border-amber-200">
                <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
                  <AlertCircle className="w-6 h-6 text-orange-600" />
                  Troubleshooting Common Issues
                </h2>
                <div className="space-y-4">
                  {troubleshooting.map((item, index) => (
                    <div key={index} className="border-l-4 border-orange-400 pl-4">
                      <h3 className="font-medium text-gray-800 mb-1">Problem: {item.problem}</h3>
                      <p className="text-gray-600">Solution: {item.solution}</p>
                    </div>
                  ))}
                </div>
              </Card>
            </section>

            {/* 成功秘诀 */}
            <section>
              <Card className="p-8 bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200">
                <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
                  Secrets to Perfect Fortune Cookies
                </h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-3">Timing is Everything</h3>
                    <p className="text-gray-600 mb-4">
                      The key to successful fortune cookies is working quickly while they're hot. 
                      Have your fortunes ready and work with only 2-3 cookies at a time.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-3">Temperature Matters</h3>
                    <p className="text-gray-600 mb-4">
                      Keep your oven at exactly 300°F. Too hot and the cookies will brown too quickly; 
                      too cool and they won't set properly.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-3">Practice Makes Perfect</h3>
                    <p className="text-gray-600 mb-4">
                      Don't worry if your first few cookies aren't perfect. The shaping technique 
                      takes practice, but even imperfect cookies taste great!
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-3">Custom Messages</h3>
                    <p className="text-gray-600 mb-4">
                      Make your fortune cookies extra special by writing personalized messages. 
                      Keep them short, positive, and meaningful to your recipients.
                    </p>
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
