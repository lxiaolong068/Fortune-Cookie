import { Metadata } from 'next'
import { DynamicBackgroundEffects } from '@/components/DynamicBackgroundEffects'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Clock, Users, ChefHat, Utensils, Star } from 'lucide-react'
import { RecipeStructuredData, BreadcrumbStructuredData } from '@/components/StructuredData'
import { FAQStructuredData, recipeFAQs } from '@/components/FAQStructuredData'
import { getSiteUrl } from '@/lib/site'

const baseUrl = getSiteUrl()

// Static generation configuration
export const dynamic = 'force-static'
export const revalidate = 86400 // 24 hours

export const metadata: Metadata = {
  title: 'Fortune Cookie Recipes - How to Make Homemade Fortune Cookies',
  description: 'Learn to make delicious homemade fortune cookies with easy step-by-step recipes. Perfect for parties and creating custom messages at home.',
  openGraph: {
    title: 'Fortune Cookie Recipes - How to Make Homemade Fortune Cookies',
    description: 'Learn how to make delicious homemade fortune cookies with our easy step-by-step recipes.',
    type: 'article',
    url: `${baseUrl}/recipes`,
  },
  alternates: {
    canonical: '/recipes',
  },
}

const recipes = [
  {
    id: 'classic',
    title: 'Classic Fortune Cookies',
    difficulty: 'Medium',
    time: '45 minutes',
    servings: '24 cookies',
    rating: 4.8,
    description: 'The traditional fortune cookie recipe with a crispy texture and perfect fold.',
    ingredients: [
      '3 large egg whites',
      '3/4 cup white sugar',
      '1/2 cup butter, melted',
      '1/4 teaspoon vanilla extract',
      '1/4 teaspoon almond extract',
      '1 cup all-purpose flour',
      '2 tablespoons water',
      'Pinch of salt'
    ],
    instructions: [
      'Preheat oven to 300°F (150°C). Line baking sheets with parchment paper.',
      'In a bowl, whisk egg whites and sugar until frothy.',
      'Add melted butter, vanilla, and almond extracts. Mix well.',
      'Gradually add flour, water, and salt. Mix until smooth.',
      'Drop spoonfuls of batter onto prepared baking sheets, spacing 4 inches apart.',
      'Bake for 15-20 minutes until edges are golden brown.',
      'Working quickly, place fortune in center and fold cookie in half, then bend over edge of bowl.',
      'Cool in muffin tin to maintain shape.'
    ]
  },
  {
    id: 'chocolate',
    title: 'Chocolate Fortune Cookies',
    difficulty: 'Medium',
    time: '50 minutes',
    servings: '20 cookies',
    rating: 4.6,
    description: 'A delicious twist on the classic with rich chocolate flavor.',
    ingredients: [
      '3 large egg whites',
      '3/4 cup white sugar',
      '1/2 cup butter, melted',
      '1/4 teaspoon vanilla extract',
      '3/4 cup all-purpose flour',
      '1/4 cup cocoa powder',
      '2 tablespoons water',
      'Pinch of salt'
    ],
    instructions: [
      'Preheat oven to 300°F (150°C). Line baking sheets with parchment paper.',
      'Whisk egg whites and sugar until frothy.',
      'Add melted butter and vanilla extract.',
      'Sift together flour and cocoa powder, then gradually add to mixture.',
      'Add water and salt, mix until smooth.',
      'Drop spoonfuls onto baking sheets, spacing well apart.',
      'Bake for 18-22 minutes until set.',
      'Quickly add fortunes and fold while warm.'
    ]
  },
  {
    id: 'gluten-free',
    title: 'Gluten-Free Fortune Cookies',
    difficulty: 'Easy',
    time: '40 minutes',
    servings: '18 cookies',
    rating: 4.4,
    description: 'Perfect for those with gluten sensitivities, without compromising on taste.',
    ingredients: [
      '3 large egg whites',
      '3/4 cup sugar',
      '1/2 cup melted butter',
      '1/4 teaspoon vanilla extract',
      '1 cup gluten-free flour blend',
      '2 tablespoons water',
      '1/4 teaspoon xanthan gum (if not in flour blend)',
      'Pinch of salt'
    ],
    instructions: [
      'Preheat oven to 300°F (150°C).',
      'Beat egg whites and sugar until frothy.',
      'Mix in melted butter and vanilla.',
      'Combine gluten-free flour, xanthan gum, and salt.',
      'Gradually add dry ingredients to wet mixture.',
      'Add water and mix until smooth.',
      'Bake small circles for 15-18 minutes.',
      'Shape while warm with fortunes inside.'
    ]
  }
]

const tips = [
  {
    title: 'Work Quickly',
    description: 'Fortune cookies must be shaped while still warm and pliable. Work with 2-3 cookies at a time.',
    icon: '⏰'
  },
  {
    title: 'Prepare Fortunes',
    description: 'Cut fortune messages into strips about 3 inches long and 1/2 inch wide before baking.',
    icon: '📝'
  },
  {
    title: 'Use Parchment Paper',
    description: 'Always use parchment paper to prevent sticking and ensure easy removal.',
    icon: '📄'
  },
  {
    title: 'Storage Tips',
    description: 'Store in airtight containers to maintain crispness. They stay fresh for up to one week.',
    icon: '📦'
  }
]

export default function RecipesPage() {
  return (
    <>
      <RecipeStructuredData recipes={recipes} />
      <BreadcrumbStructuredData items={[
        { name: 'Home', url: '/' },
        { name: 'Fortune Cookie Recipes', url: '/recipes' }
      ]} />
      <main className="min-h-screen w-full overflow-x-hidden relative">
        <DynamicBackgroundEffects />
        <div className="relative z-10">
          <div className="container mx-auto px-4 py-8">
            {/* 页面标题 */}
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-amber-600 via-yellow-600 to-orange-600 bg-clip-text text-transparent mb-4">
                Fortune Cookie Recipes
              </h1>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Create your own delicious fortune cookies at home with our tested recipes. 
                Perfect for parties, special occasions, or whenever you want to share some wisdom!
              </p>
            </div>

            {/* 食谱列表 */}
            <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-8 mb-16">
              {recipes.map((recipe) => (
                <Card key={recipe.id} className="p-6 bg-white/90 backdrop-blur-sm border-amber-200 hover:shadow-lg transition-all duration-200">
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-xl font-semibold text-gray-800">
                        {recipe.title}
                      </h3>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        <span className="text-sm text-gray-600">{recipe.rating}</span>
                      </div>
                    </div>
                    <p className="text-gray-600 text-sm mb-3">
                      {recipe.description}
                    </p>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      <Badge className="bg-blue-100 text-blue-800">
                        <Clock className="w-3 h-3 mr-1" />
                        {recipe.time}
                      </Badge>
                      <Badge className="bg-green-100 text-green-800">
                        <Users className="w-3 h-3 mr-1" />
                        {recipe.servings}
                      </Badge>
                      <Badge className="bg-purple-100 text-purple-800">
                        <ChefHat className="w-3 h-3 mr-1" />
                        {recipe.difficulty}
                      </Badge>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-gray-800 mb-2 flex items-center gap-2">
                        <Utensils className="w-4 h-4" />
                        Ingredients
                      </h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        {recipe.ingredients.slice(0, 4).map((ingredient, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <span className="text-amber-500 mt-1">•</span>
                            {ingredient}
                          </li>
                        ))}
                        {recipe.ingredients.length > 4 && (
                          <li className="text-amber-600 font-medium">
                            +{recipe.ingredients.length - 4} more ingredients
                          </li>
                        )}
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-medium text-gray-800 mb-2">
                        Quick Steps
                      </h4>
                      <ol className="text-sm text-gray-600 space-y-1">
                        {recipe.instructions.slice(0, 3).map((step, index) => (
                          <li key={index} className="flex gap-2">
                            <span className="text-amber-500 font-medium">{index + 1}.</span>
                            {step}
                          </li>
                        ))}
                        <li className="text-amber-600 font-medium">
                          +{recipe.instructions.length - 3} more steps
                        </li>
                      </ol>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* 制作技巧 */}
            <section className="mb-16">
              <h2 className="text-2xl font-semibold text-gray-800 mb-8 text-center">
                Pro Tips for Perfect Fortune Cookies
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                {tips.map((tip, index) => (
                  <Card key={index} className="p-6 bg-white/90 backdrop-blur-sm border-amber-200">
                    <div className="flex items-start gap-4">
                      <div className="text-3xl">{tip.icon}</div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">
                          {tip.title}
                        </h3>
                        <p className="text-gray-600 leading-relaxed">
                          {tip.description}
                        </p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </section>

            {/* SEO内容 */}
            <div className="max-w-4xl mx-auto">
              <section className="mb-12">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                  Making Fortune Cookies at Home
                </h2>
                <p className="text-gray-600 leading-relaxed mb-4">
                  Creating homemade fortune cookies is a delightful way to add a personal touch to any gathering. 
                  These crispy, sweet treats are perfect for parties, special occasions, or simply as a fun 
                  family activity. The key to success lies in working quickly while the cookies are still warm 
                  and pliable, allowing you to achieve that characteristic curved shape.
                </p>
                <p className="text-gray-600 leading-relaxed">
                  Our recipes range from the classic vanilla version to exciting variations like chocolate and 
                  gluten-free options. Each recipe has been tested to ensure consistent results, whether you're 
                  a beginner baker or an experienced chef looking to try something new.
                </p>
              </section>
            </div>
          </div>
        </div>
      </main>

      <FAQStructuredData faqs={recipeFAQs} />
    </>
  )
}
