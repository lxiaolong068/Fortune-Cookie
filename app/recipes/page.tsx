import { Metadata } from "next";
import Link from "next/link";
import { DynamicBackgroundEffects } from "@/components/DynamicBackgroundEffects";
import { Card } from "@/components/ui/card";
import {
  RecipeStructuredData,
  BreadcrumbStructuredData,
} from "@/components/StructuredData";
import { FAQStructuredData, recipeFAQs } from "@/components/FAQStructuredData";
import { InternalLink } from "@/components/InternalLinks";
import { ExpandableRecipeCard } from "@/components/ExpandableRecipeCard";
import { getImageUrl, getSiteUrl } from "@/lib/site";
import {
  ChefHat,
  Sparkles,
  Heart,
  Clock,
  Smile,
  MessageSquare,
} from "lucide-react";

const baseUrl = getSiteUrl();

// Static generation configuration
export const dynamic = "force-static";
export const revalidate = 86400; // 24 hours

export const metadata: Metadata = {
  title: "Fortune Cookie Recipes - Classic, Chocolate & Gluten-Free",
  description:
    "Classic, chocolate, and gluten-free fortune cookie recipes with step-by-step instructions and baking tips. Perfect for parties and special occasions.",
  openGraph: {
    title: "Fortune Cookie Recipes - Classic, Chocolate & Gluten-Free",
    description:
      "Classic, chocolate, and gluten-free fortune cookie recipes with step-by-step instructions and baking tips. Perfect for parties and special occasions.",
    type: "article",
    url: `${baseUrl}/recipes`,
    images: [
      {
        url: getImageUrl("/og-image.png"),
        width: 1200,
        height: 630,
        alt: "Fortune Cookie Recipes",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Fortune Cookie Recipes - Classic, Chocolate & Gluten-Free",
    description:
      "Classic, chocolate, and gluten-free fortune cookie recipes with step-by-step instructions and baking tips.",
    images: [getImageUrl("/twitter-image.png")],
    creator: "@fortunecookieai",
  },
  alternates: {
    canonical: "/recipes",
  },
};

const recipes = [
  {
    id: "classic",
    title: "Classic Fortune Cookies",
    difficulty: "Medium",
    time: "45 minutes",
    servings: "24 cookies",
    rating: 4.8,
    description:
      "The traditional fortune cookie recipe with a crispy texture and perfect fold.",
    extendedDescription:
      "These traditional fortune cookies feature a delicate, crispy texture with subtle vanilla and almond flavors. Perfect for Chinese New Year celebrations, birthday parties, or wedding favors where you want to add a personalized touch with custom messages.",
    ingredients: [
      "3 large egg whites",
      "3/4 cup white sugar",
      "1/2 cup butter, melted",
      "1/4 teaspoon vanilla extract",
      "1/4 teaspoon almond extract",
      "1 cup all-purpose flour",
      "2 tablespoons water",
      "Pinch of salt",
    ],
    instructions: [
      "Preheat oven to 300°F (150°C). Line baking sheets with parchment paper.",
      "In a bowl, whisk egg whites and sugar until frothy.",
      "Add melted butter, vanilla, and almond extracts. Mix well.",
      "Gradually add flour, water, and salt. Mix until smooth.",
      "Drop spoonfuls of batter onto prepared baking sheets, spacing 4 inches apart.",
      "Bake for 15-20 minutes until edges are golden brown.",
      "Working quickly, place fortune in center and fold cookie in half, then bend over edge of bowl.",
      "Cool in muffin tin to maintain shape.",
    ],
  },
  {
    id: "chocolate",
    title: "Chocolate Fortune Cookies",
    difficulty: "Medium",
    time: "50 minutes",
    servings: "20 cookies",
    rating: 4.6,
    description: "A delicious twist on the classic with rich chocolate flavor.",
    extendedDescription:
      "These chocolate fortune cookies offer a decadent twist on the traditional recipe, featuring rich cocoa flavor that pairs beautifully with sweet fortune messages. Ideal for Valentine's Day treats, chocolate lovers' birthday parties, or as unique after-dinner desserts.",
    ingredients: [
      "3 large egg whites",
      "3/4 cup white sugar",
      "1/2 cup butter, melted",
      "1/4 teaspoon vanilla extract",
      "3/4 cup all-purpose flour",
      "1/4 cup cocoa powder",
      "2 tablespoons water",
      "Pinch of salt",
    ],
    instructions: [
      "Preheat oven to 300°F (150°C). Line baking sheets with parchment paper.",
      "Whisk egg whites and sugar until frothy.",
      "Add melted butter and vanilla extract.",
      "Sift together flour and cocoa powder, then gradually add to mixture.",
      "Add water and salt, mix until smooth.",
      "Drop spoonfuls onto baking sheets, spacing well apart.",
      "Bake for 18-22 minutes until set.",
      "Quickly add fortunes and fold while warm.",
    ],
  },
  {
    id: "gluten-free",
    title: "Gluten-Free Fortune Cookies",
    difficulty: "Easy",
    time: "40 minutes",
    servings: "18 cookies",
    rating: 4.4,
    description:
      "Perfect for those with gluten sensitivities, without compromising on taste.",
    extendedDescription:
      "These gluten-free fortune cookies are perfect for guests with dietary restrictions, ensuring everyone can enjoy the fun of cracking open a cookie to reveal their fortune. Great for inclusive party planning, celiac-friendly events, or health-conscious gatherings.",
    ingredients: [
      "3 large egg whites",
      "3/4 cup sugar",
      "1/2 cup melted butter",
      "1/4 teaspoon vanilla extract",
      "1 cup gluten-free flour blend",
      "2 tablespoons water",
      "1/4 teaspoon xanthan gum (if not in flour blend)",
      "Pinch of salt",
    ],
    instructions: [
      "Preheat oven to 300°F (150°C).",
      "Beat egg whites and sugar until frothy.",
      "Mix in melted butter and vanilla.",
      "Combine gluten-free flour, xanthan gum, and salt.",
      "Gradually add dry ingredients to wet mixture.",
      "Add water and mix until smooth.",
      "Bake small circles for 15-18 minutes.",
      "Shape while warm with fortunes inside.",
    ],
  },
];

const tips = [
  {
    title: "Work Quickly",
    description:
      "Fortune cookies must be shaped while still warm and pliable. Work with 2-3 cookies at a time.",
    icon: "⏰",
  },
  {
    title: "Prepare Fortunes",
    description:
      "Cut fortune messages into strips about 3 inches long and 1/2 inch wide before baking.",
    icon: "📝",
  },
  {
    title: "Use Parchment Paper",
    description:
      "Always use parchment paper to prevent sticking and ensure easy removal.",
    icon: "📄",
  },
  {
    title: "Storage Tips",
    description:
      "Store in airtight containers to maintain crispness. They stay fresh for up to one week.",
    icon: "📦",
  },
  {
    title: "Personalize Your Fortunes",
    description:
      "Create unique, meaningful messages with our AI fortune generator. Generate custom fortunes for birthdays, weddings, or any special occasion.",
    icon: "✨",
    link: "/generator",
  },
];

const processSteps = [
  {
    step: 1,
    title: "Choose a Recipe",
    description: "Pick from classic, chocolate, or gluten-free options below",
    icon: ChefHat,
  },
  {
    step: 2,
    title: "Generate Fortunes",
    description: "Use our AI generator or browse the message library",
    icon: Sparkles,
    link: "/generator",
  },
  {
    step: 3,
    title: "Bake & Share",
    description: "Follow the steps and enjoy with friends and family",
    icon: Heart,
  },
];

export default function RecipesPage() {
  return (
    <>
      <RecipeStructuredData recipes={recipes} />
      <BreadcrumbStructuredData
        items={[
          { name: "Home", url: "/" },
          { name: "Fortune Cookie Recipes", url: "/recipes" },
        ]}
      />
      <main className="min-h-screen w-full overflow-x-hidden relative">
        <DynamicBackgroundEffects />
        <div className="relative z-10">
          <div className="container mx-auto px-4 py-8">
            {/* Hero Section */}
            <div className="text-center mb-8">
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-amber-600 via-yellow-600 to-orange-600 bg-clip-text text-transparent mb-4">
                Fortune Cookie Recipes
              </h1>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Create your own delicious{" "}
                <strong>homemade fortune cookies</strong> at home with our
                tested recipes. Perfect for parties, special occasions, or
                whenever you want to share some wisdom!
              </p>
            </div>

            {/* Three-Step Process Flow */}
            <section
              className="mb-12"
              aria-label="How to make fortune cookies in 3 easy steps"
            >
              <div className="grid md:grid-cols-3 gap-4 max-w-4xl mx-auto">
                {processSteps.map((item, index) => {
                  const IconComponent = item.icon;
                  const content = (
                    <Card className="p-6 bg-white/90 backdrop-blur-sm border-amber-200 text-center h-full hover:shadow-lg transition-all duration-200">
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center">
                          <IconComponent
                            className="w-6 h-6 text-amber-600"
                            aria-hidden="true"
                          />
                        </div>
                        <div className="text-sm font-medium text-amber-600">
                          Step {item.step}
                        </div>
                        <h3 className="text-lg font-semibold text-gray-800">
                          {item.title}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {item.description}
                        </p>
                      </div>
                      {index < processSteps.length - 1 && (
                        <div
                          className="hidden md:block absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 text-amber-300 text-2xl"
                          aria-hidden="true"
                        >
                          →
                        </div>
                      )}
                    </Card>
                  );

                  return (
                    <div key={item.step} className="relative">
                      {item.link ? (
                        <Link href={item.link} className="block h-full">
                          {content}
                        </Link>
                      ) : (
                        content
                      )}
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Recipe Cards Grid */}
            <section aria-label="Fortune cookie recipes">
              <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-8 mb-16">
                {recipes.map((recipe) => (
                  <ExpandableRecipeCard key={recipe.id} recipe={recipe} />
                ))}
              </div>
            </section>

            {/* Pro Tips Section */}
            <section className="mb-16" aria-labelledby="pro-tips-heading">
              <h2
                id="pro-tips-heading"
                className="text-2xl font-semibold text-gray-800 mb-8 text-center"
              >
                Pro Tips for Perfect Fortune Cookies
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {tips.map((tip, index) => {
                  const content = (
                    <Card className="p-6 bg-white/90 backdrop-blur-sm border-amber-200 h-full hover:shadow-lg transition-all duration-200">
                      <div className="flex items-start gap-4">
                        <div
                          className="text-3xl flex-shrink-0"
                          aria-hidden="true"
                        >
                          {tip.icon}
                        </div>
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
                  );

                  return tip.link ? (
                    <Link key={index} href={tip.link} className="block">
                      {content}
                    </Link>
                  ) : (
                    <div key={index}>{content}</div>
                  );
                })}
              </div>
            </section>

            {/* Related Content Section */}
            <section
              className="mb-16"
              aria-labelledby="related-content-heading"
            >
              <h2
                id="related-content-heading"
                className="text-2xl font-semibold text-gray-800 mb-6 text-center"
              >
                Related Guides & Resources
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                <InternalLink
                  href="/how-to-make-fortune-cookies"
                  title="How to Make Fortune Cookies"
                  description="Detailed step-by-step tutorial"
                  icon={ChefHat}
                  badge="Tutorial"
                />
                <InternalLink
                  href="/generator"
                  title="AI Fortune Generator"
                  description="Create personalized messages with AI"
                  icon={Sparkles}
                  badge="AI"
                />
                <InternalLink
                  href="/funny-fortune-cookie-messages"
                  title="Funny Fortune Messages"
                  description="Hilarious messages for parties"
                  icon={Smile}
                />
                <InternalLink
                  href="/history"
                  title="Fortune Cookie History"
                  description="Origins and cultural significance"
                  icon={Clock}
                />
                <InternalLink
                  href="/who-invented-fortune-cookies"
                  title="Who Invented Fortune Cookies?"
                  description="Discover the surprising story"
                  icon={Clock}
                  badge="Popular"
                />
                <InternalLink
                  href="/messages"
                  title="All Fortune Messages"
                  description="Browse our complete collection"
                  icon={MessageSquare}
                />
              </div>
            </section>

            {/* SEO Content Section */}
            <div className="max-w-4xl mx-auto">
              <section
                className="mb-12"
                aria-labelledby="making-cookies-heading"
              >
                <h2
                  id="making-cookies-heading"
                  className="text-2xl font-semibold text-gray-800 mb-4"
                >
                  Making Fortune Cookies at Home
                </h2>
                <p className="text-gray-600 leading-relaxed mb-4">
                  Creating <strong>homemade fortune cookie recipes</strong> is a
                  delightful way to add a personal touch to any gathering. These
                  crispy, sweet treats are perfect for parties, special
                  occasions, or simply as a fun family activity. The key to
                  success lies in working quickly while the cookies are still
                  warm and pliable, allowing you to achieve that characteristic
                  curved shape. For a detailed guide, check out our{" "}
                  <Link
                    href="/how-to-make-fortune-cookies"
                    className="text-amber-600 hover:text-amber-700 underline underline-offset-2"
                  >
                    how to make fortune cookies
                  </Link>{" "}
                  tutorial.
                </p>
                <p className="text-gray-600 leading-relaxed mb-4">
                  Our recipes range from the{" "}
                  <strong>classic, chocolate, and gluten-free</strong> options
                  to suit every taste and dietary need. Each recipe has been
                  tested to ensure consistent results, whether you&apos;re a
                  beginner baker or an experienced chef looking to try something
                  new. Learn more about the fascinating{" "}
                  <Link
                    href="/history"
                    className="text-amber-600 hover:text-amber-700 underline underline-offset-2"
                  >
                    history of fortune cookies
                  </Link>{" "}
                  and discover{" "}
                  <Link
                    href="/who-invented-fortune-cookies"
                    className="text-amber-600 hover:text-amber-700 underline underline-offset-2"
                  >
                    who invented fortune cookies
                  </Link>
                  .
                </p>
                <p className="text-gray-600 leading-relaxed">
                  Once your cookies are baked and cooled, don&apos;t forget to
                  fill them with meaningful messages! Try our{" "}
                  <Link
                    href="/generator"
                    className="text-amber-600 hover:text-amber-700 underline underline-offset-2"
                  >
                    AI fortune generator
                  </Link>{" "}
                  to create personalized fortunes, or browse our collection of{" "}
                  <Link
                    href="/funny-fortune-cookie-messages"
                    className="text-amber-600 hover:text-amber-700 underline underline-offset-2"
                  >
                    funny fortune cookie messages
                  </Link>{" "}
                  for inspiration.
                </p>
              </section>
            </div>
          </div>
        </div>
      </main>

      <FAQStructuredData faqs={recipeFAQs} />
    </>
  );
}
