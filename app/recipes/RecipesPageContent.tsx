"use client";

import Link from "next/link";
import { ChefHat, Sparkles, Heart, BookOpen } from "lucide-react";
import { InternalLink } from "@/components/InternalLinks";
import { ExpandableRecipeCard } from "@/components/ExpandableRecipeCard";
import { PageLayout, PageSection } from "@/components/PageLayout";
import { PageHero, HeroBadge } from "@/components/PageHero";
import { ModernCard, ModernCardIcon } from "@/components/ui/modern-card";

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
    gradient: { from: "from-amber-500", to: "to-orange-500" },
  },
  {
    title: "Prepare Fortunes",
    description:
      "Cut fortune messages into strips about 3 inches long and 1/2 inch wide before baking.",
    icon: "📝",
    gradient: { from: "from-blue-500", to: "to-cyan-500" },
  },
  {
    title: "Use Parchment Paper",
    description:
      "Always use parchment paper to prevent sticking and ensure easy removal.",
    icon: "📄",
    gradient: { from: "from-emerald-500", to: "to-teal-500" },
  },
  {
    title: "Storage Tips",
    description:
      "Store in airtight containers to maintain crispness. They stay fresh for up to one week.",
    icon: "📦",
    gradient: { from: "from-purple-500", to: "to-pink-500" },
  },
  {
    title: "Personalize Your Fortunes",
    description:
      "Create unique, meaningful messages with our AI fortune generator. Generate custom fortunes for birthdays, weddings, or any special occasion.",
    icon: "✨",
    gradient: { from: "from-indigo-500", to: "to-purple-500" },
    link: "/generator",
  },
];

const processSteps = [
  {
    step: 1,
    title: "Choose a Recipe",
    description: "Pick from classic, chocolate, or gluten-free options below",
    Icon: ChefHat,
    gradient: { from: "from-amber-500", to: "to-orange-500" },
  },
  {
    step: 2,
    title: "Generate Fortunes",
    description: "Use our AI generator or browse the message library",
    Icon: Sparkles,
    gradient: { from: "from-indigo-500", to: "to-purple-500" },
    link: "/generator",
  },
  {
    step: 3,
    title: "Bake & Share",
    description: "Follow the steps and enjoy with friends and family",
    Icon: Heart,
    gradient: { from: "from-pink-500", to: "to-rose-500" },
  },
];

export function RecipesPageContent() {
  return (
    <PageLayout background="subtle" gradient="indigo" headerOffset={false}>
      {/* Hero Section */}
      <PageHero
        title="Fortune Cookie Recipes"
        subtitle="Homemade Delights"
        description="Create your own delicious homemade fortune cookies at home with our tested recipes. Perfect for parties, special occasions, or whenever you want to share some wisdom!"
        icon={ChefHat}
        iconGradient={{ from: "from-amber-500", to: "to-orange-500" }}
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Recipes" }]}
        badge={<HeroBadge icon={Sparkles}>3 Tested Recipes</HeroBadge>}
        size="md"
      />

      {/* Three-Step Process Flow */}
      <PageSection padding="md" bg="transparent">
        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {processSteps.map((item, index) => {
            const content = (
              <ModernCard
                variant="glass"
                hoverable
                className="text-center h-full"
              >
                <div className="flex flex-col items-center gap-4">
                  <ModernCardIcon
                    gradientFrom={item.gradient.from}
                    gradientTo={item.gradient.to}
                    size="lg"
                  >
                    <item.Icon className="w-7 h-7 text-white" />
                  </ModernCardIcon>
                  <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 text-sm font-bold">
                    {item.step}
                  </div>
                  <h3 className="text-lg font-heading font-semibold text-slate-800 dark:text-white">
                    {item.title}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    {item.description}
                  </p>
                </div>
              </ModernCard>
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
                {index < processSteps.length - 1 && (
                  <div
                    className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 z-10 w-8 h-8 items-center justify-center text-indigo-300 dark:text-indigo-600"
                    aria-hidden="true"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </PageSection>

      {/* Video Tutorial Section */}
      <PageSection padding="lg" bg="transparent">
        <div className="flex items-center gap-3 mb-6">
          <ModernCardIcon
            gradientFrom="from-red-500"
            gradientTo="to-rose-500"
            size="sm"
          >
            <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M8 5v14l11-7z" />
            </svg>
          </ModernCardIcon>
          <h2 className="text-2xl font-heading font-semibold text-slate-800 dark:text-white">
            Watch: How to Make Fortune Cookies
          </h2>
        </div>
        <div className="max-w-3xl mx-auto">
          <div className="relative w-full aspect-video rounded-xl overflow-hidden shadow-lg">
            <iframe
              src="https://www.youtube.com/embed/8UlFxiLQZIk"
              title="Homemade Fortune Cookie Recipe – Step-by-Step Tutorial"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              loading="lazy"
              className="absolute inset-0 w-full h-full"
            />
          </div>
          <p className="mt-4 text-sm text-slate-500 dark:text-slate-400 text-center">
            Video by{" "}
            <a
              href="https://www.youtube.com/watch?v=8UlFxiLQZIk"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-amber-600"
            >
              Bigger Bolder Baking with Gemma Stafford
            </a>
          </p>
        </div>
      </PageSection>

      {/* Recipe Cards Grid */}
      <PageSection padding="lg" bg="transparent">
        <div className="flex items-center gap-3 mb-8">
          <ModernCardIcon
            gradientFrom="from-amber-500"
            gradientTo="to-orange-500"
            size="sm"
          >
            <BookOpen className="w-4 h-4 text-white" />
          </ModernCardIcon>
          <h2 className="text-2xl font-heading font-semibold text-slate-800 dark:text-white">
            Choose Your Recipe
          </h2>
        </div>
        <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-8">
          {recipes.map((recipe) => (
            <ExpandableRecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>
      </PageSection>

      {/* Pro Tips Section */}
      <PageSection padding="lg" bg="gradient">
        <div className="flex items-center gap-3 mb-8 justify-center">
          <ModernCardIcon
            gradientFrom="from-indigo-500"
            gradientTo="to-purple-500"
            size="sm"
          >
            <Sparkles className="w-4 h-4 text-white" />
          </ModernCardIcon>
          <h2 className="text-2xl font-heading font-semibold text-slate-800 dark:text-white">
            Pro Tips for Perfect Fortune Cookies
          </h2>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tips.map((tip, index) => {
            const content = (
              <ModernCard variant="glass" hoverable className="h-full">
                <div className="flex items-start gap-4">
                  <div className="text-3xl flex-shrink-0" aria-hidden="true">
                    {tip.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-heading font-semibold text-slate-800 dark:text-white mb-2">
                      {tip.title}
                    </h3>
                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm">
                      {tip.description}
                    </p>
                  </div>
                </div>
              </ModernCard>
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
      </PageSection>

      {/* Related Content Section */}
      <PageSection padding="lg" bg="transparent">
        <div className="flex items-center gap-3 mb-8 justify-center">
          <ModernCardIcon
            gradientFrom="from-emerald-500"
            gradientTo="to-teal-500"
            size="sm"
          >
            <BookOpen className="w-4 h-4 text-white" />
          </ModernCardIcon>
          <h2 className="text-2xl font-heading font-semibold text-slate-800 dark:text-white">
            Related Guides & Resources
          </h2>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          <InternalLink
            href="/how-to-make-fortune-cookies"
            title="How to Make Fortune Cookies"
            description="Detailed step-by-step tutorial"
            iconName="chefHat"
            badge="Tutorial"
          />
          <InternalLink
            href="/generator"
            title="AI Fortune Generator"
            description="Create personalized messages with AI"
            iconName="sparkles"
            badge="AI"
          />
          <InternalLink
            href="/funny-fortune-cookie-messages"
            title="Funny Fortune Messages"
            description="Hilarious messages for parties"
            iconName="smile"
          />
          <InternalLink
            href="/history"
            title="Fortune Cookie History"
            description="Origins and cultural significance"
            iconName="clock"
          />
          <InternalLink
            href="/who-invented-fortune-cookies"
            title="Who Invented Fortune Cookies?"
            description="Discover the surprising story"
            iconName="clock"
            badge="Popular"
          />
          <InternalLink
            href="/messages"
            title="All Fortune Messages"
            description="Browse our complete collection"
            iconName="messageSquare"
          />
        </div>
      </PageSection>

      {/* SEO Content Section */}
      <PageSection padding="lg" bg="white">
        <div className="max-w-4xl mx-auto space-y-12">

          {/* Main prose */}
          <div className="prose prose-slate dark:prose-invert prose-headings:font-heading max-w-none">
            <h2 className="text-2xl font-heading font-semibold text-slate-800 dark:text-white mb-4">
              Making Fortune Cookies at Home: Everything You Need to Know
            </h2>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
              Creating <strong>homemade fortune cookies</strong> is a delightful way to add a personal touch to any gathering. These crispy, sweet treats are perfect for parties, weddings, baby showers, or simply as a fun family activity. The key to success lies in working quickly while the cookies are still warm and pliable — you have about 30 seconds after they come out of the oven to fold them into their signature shape before they harden.
            </p>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
              Our three recipes cover the most popular variations: the <strong>classic vanilla fortune cookie</strong> (light, crispy, and buttery), the <strong>chocolate-dipped version</strong> (for an indulgent twist), and a <strong>gluten-free alternative</strong> using rice flour and almond flour for guests with dietary restrictions. Each recipe has been tested to ensure consistent results, whether you&apos;re a beginner baker or an experienced chef. For a full walkthrough, see our{" "}
              <Link href="/how-to-make-fortune-cookies" className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-medium">
                how to make fortune cookies
              </Link>{" "}
              guide.
            </p>
            <h3 className="text-xl font-heading font-semibold text-slate-800 dark:text-white mb-3">
              Pro Tips for Perfect Fortune Cookies
            </h3>
          </div>

          {/* Tips grid */}
          <div className="grid md:grid-cols-2 gap-4">
            {[
              { icon: "⏱️", title: "Work fast", desc: "You have 20–30 seconds to fold each cookie after removing from the oven. Prepare your folding station before baking." },
              { icon: "🧁", title: "Thin batter is key", desc: "Spread the batter very thin — about 3–4 inches in diameter. Thick batter produces chewy cookies instead of crispy ones." },
              { icon: "🌡️", title: "Consistent oven temp", desc: "Bake at exactly 325°F (165°C). Too hot and they burn; too cool and they won't crisp up properly." },
              { icon: "📝", title: "Fortune slip size", desc: "Cut fortune slips to about 3.5 × 0.5 inches. Too large and they're hard to fold in; too small and they fall out." },
              { icon: "🧤", title: "Non-stick is essential", desc: "Use a silicone baking mat or well-greased parchment. Fortune cookies stick aggressively to ungreased surfaces." },
              { icon: "🥚", title: "Bake in small batches", desc: "Bake only 2–3 cookies at a time. By the time you fold the third, the first is already too hard to shape." },
            ].map((tip) => (
              <div key={tip.title} className="flex items-start gap-3 p-4 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-800/30">
                <span className="text-2xl flex-shrink-0">{tip.icon}</span>
                <div>
                  <p className="font-semibold text-slate-800 dark:text-white text-sm mb-1">{tip.title}</p>
                  <p className="text-xs text-slate-600 dark:text-slate-400">{tip.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* FAQ */}
          <div>
            <h2 className="text-2xl font-heading font-semibold text-slate-800 dark:text-white mb-6">
              Frequently asked questions about fortune cookie recipes
            </h2>
            <div className="space-y-4">
              {[
                {
                  q: "How long do homemade fortune cookies stay fresh?",
                  a: "Homemade fortune cookies stay crispy for 3–5 days when stored in an airtight container at room temperature. Avoid refrigerating them as moisture will make them soft. For longer storage, freeze the unfilled, unfolded baked discs and fold them after reheating.",
                },
                {
                  q: "Can I make fortune cookies without eggs?",
                  a: "Yes! You can substitute each egg white with 2 tablespoons of aquafaba (the liquid from canned chickpeas). The texture will be slightly different but still crispy. Our gluten-free recipe also works well with this substitution.",
                },
                {
                  q: "What can I write on fortune cookie slips?",
                  a: "You can write anything — traditional proverbs, funny jokes, personalized messages, or event-specific notes. For weddings, try romantic quotes; for birthdays, use the guest of honor's inside jokes. Our AI Fortune Cookie Generator can create custom fortunes for any occasion in seconds.",
                },
                {
                  q: "Why are my fortune cookies soft instead of crispy?",
                  a: "Soft fortune cookies are usually caused by one of three issues: (1) the batter was spread too thick, (2) the oven temperature was too low, or (3) they were stored in a humid environment. Make sure to bake until the edges are golden brown, not just set.",
                },
                {
                  q: "Can I make fortune cookies ahead of time for a party?",
                  a: "Absolutely. Bake and fold the cookies up to 3 days in advance, but insert the fortune slips on the day of the event to prevent the paper from absorbing moisture. Store in an airtight tin at room temperature.",
                },
              ].map((faq) => (
                <div key={faq.q} className="p-5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  <p className="font-semibold text-slate-800 dark:text-white mb-2 text-sm">{faq.q}</p>
                  <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Internal links */}
          <div>
            <h2 className="text-xl font-heading font-semibold text-slate-800 dark:text-white mb-3">
              More fortune cookie resources
            </h2>
            <div className="grid md:grid-cols-2 gap-3">
              {[
                { icon: "🔧", title: "How to Make Fortune Cookies (Step-by-Step)", href: "/how-to-make-fortune-cookies" },
                { icon: "🤖", title: "AI Fortune Cookie Generator", href: "/generator" },
                { icon: "😂", title: "Funny Fortune Cookie Messages", href: "/funny-fortune-cookie-messages" },
                { icon: "🎊", title: "Fortune Cookie Messages by Occasion", href: "/fortune-cookie-messages" },
                { icon: "📚", title: "History of Fortune Cookies", href: "/history" },
                { icon: "🤔", title: "Who Invented Fortune Cookies?", href: "/who-invented-fortune-cookies" },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-amber-400 dark:hover:border-amber-600 hover:shadow-sm transition-all text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-amber-700 dark:hover:text-amber-400 group"
                >
                  <span className="text-lg flex-shrink-0">{link.icon}</span>
                  <span className="flex-1">{link.title}</span>
                  <span className="text-slate-400 group-hover:translate-x-1 transition-transform">→</span>
                </Link>
              ))}
            </div>
          </div>

        </div>
      </PageSection>
    </PageLayout>
  );
}
