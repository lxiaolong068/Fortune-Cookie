"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  ChefHat,
  Clock,
  Users,
  Sparkles,
  ChevronRight,
  ListChecks,
  AlertTriangle,
  HelpCircle,
  Lightbulb,
  CheckCircle2,
  Timer,
  Flame,
} from "lucide-react";
import { PageLayout } from "@/components/PageLayout";
import { PageHero, HeroBadge } from "@/components/PageHero";
import { ModernCard, ModernCardIcon } from "@/components/ui/modern-card";
import {
  staggerContainerNormal,
  staggerItem,
  fadeInUp,
} from "@/lib/animations";
import { cn } from "@/lib/utils";

// Recipe data
const recipeInfo = {
  prepTime: "20 minutes",
  cookTime: "8-10 minutes",
  servings: "24 cookies",
  difficulty: "Medium",
};

const ingredients = [
  { item: "All-purpose flour", amount: "1/2 cup", notes: "sifted" },
  { item: "Sugar", amount: "1/2 cup", notes: "superfine preferred" },
  { item: "Salt", amount: "1/4 teaspoon", notes: "" },
  { item: "Cornstarch", amount: "1 tablespoon", notes: "" },
  { item: "Vegetable oil", amount: "3 tablespoons", notes: "" },
  { item: "Egg whites", amount: "2 large", notes: "room temperature" },
  { item: "Vanilla extract", amount: "1 teaspoon", notes: "" },
  { item: "Water", amount: "2 tablespoons", notes: "" },
];

const steps = [
  {
    title: "Prepare Your Fortunes",
    description:
      "Write or print your fortune messages on small strips of paper (about 3.5 inches by 0.5 inches). Make sure they're ready before you start baking.",
    tip: "Use food-safe paper or print on parchment paper for the best results.",
  },
  {
    title: "Mix Dry Ingredients",
    description:
      "In a bowl, whisk together flour, sugar, salt, and cornstarch until well combined.",
    tip: "Sifting prevents lumps and ensures a smooth batter.",
  },
  {
    title: "Combine Wet Ingredients",
    description:
      "In another bowl, mix egg whites, vegetable oil, vanilla extract, and water until smooth.",
    tip: "Room temperature egg whites incorporate better into the batter.",
  },
  {
    title: "Create the Batter",
    description:
      "Gradually add wet ingredients to dry ingredients, stirring until smooth. The batter should be thin enough to spread easily.",
    tip: "Rest the batter for 15 minutes for better results.",
  },
  {
    title: "Prepare Baking Sheet",
    description:
      "Line a baking sheet with parchment paper or silicone mat. Preheat oven to 300°F (150°C).",
    tip: "A silicone mat provides the best non-stick surface for delicate cookies.",
  },
  {
    title: "Form Circles",
    description:
      "Drop 1 tablespoon of batter onto the sheet. Use the back of a spoon to spread into a thin 3-inch circle.",
    tip: "Only bake 2-3 at a time - you need to fold them while hot.",
  },
  {
    title: "Bake Until Golden",
    description:
      "Bake for 8-10 minutes until edges are golden brown and the center is set.",
    tip: "Watch carefully - they can burn quickly in the last minute.",
  },
  {
    title: "Fold Quickly",
    description:
      "Remove from oven and immediately place fortune in center. Fold in half, then bend over the edge of a mug to create the classic shape.",
    tip: "Work fast! You have about 10 seconds before they become too crisp to fold.",
  },
];

const troubleshooting = [
  {
    problem: "Cookies are too crispy to fold",
    solution:
      "Work faster or bake fewer cookies at a time. Keep unused batter warm.",
  },
  {
    problem: "Cookies are too soft",
    solution: "Bake for 1-2 minutes longer until edges are properly golden.",
  },
  {
    problem: "Uneven browning",
    solution:
      "Check your oven temperature and rotate the baking sheet halfway through.",
  },
  {
    problem: "Batter is too thick",
    solution:
      "Add water one teaspoon at a time until you reach a spreadable consistency.",
  },
];

const faqData = [
  {
    question: "Can I make fortune cookies without an oven?",
    answer:
      "Yes! You can make them in a skillet or on a griddle over medium-low heat. The process is similar, but requires more attention to prevent burning.",
  },
  {
    question: "How long do homemade fortune cookies stay fresh?",
    answer:
      "Stored in an airtight container, fortune cookies stay crispy for about 1 week. They can become soft in humid environments.",
  },
  {
    question: "Can I add food coloring to the batter?",
    answer:
      "Absolutely! Add a few drops of gel food coloring to create festive colored cookies for holidays or special occasions.",
  },
  {
    question: "Why do my fortune cookies taste different from restaurant ones?",
    answer:
      "Restaurant fortune cookies often use commercial recipes with different ratios. Homemade ones tend to be more buttery and less sweet.",
  },
];

export function HowToMakePageContent() {
  return (
    <PageLayout gradient="indigo">
      <PageHero
        badge={<HeroBadge icon={ChefHat}>Recipe Guide</HeroBadge>}
        title="How to Make Fortune Cookies"
        gradientTitle
        description="Learn the art of making homemade fortune cookies with this comprehensive guide. From mixing the perfect batter to folding techniques, master the complete process step by step."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Recipe" }]}
      />

      {/* Recipe Quick Info */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <motion.div
            variants={staggerContainerNormal}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4"
          >
            {[
              { label: "Prep Time", value: recipeInfo.prepTime, icon: Clock },
              { label: "Cook Time", value: recipeInfo.cookTime, icon: Timer },
              { label: "Servings", value: recipeInfo.servings, icon: Users },
              {
                label: "Difficulty",
                value: recipeInfo.difficulty,
                icon: Flame,
              },
            ].map((info) => (
              <motion.div key={info.label} variants={staggerItem}>
                <ModernCard variant="glass" className="text-center p-6">
                  <info.icon className="w-8 h-8 text-indigo-500 mx-auto mb-2" />
                  <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">
                    {info.label}
                  </p>
                  <p className="text-lg font-bold text-slate-800 dark:text-white">
                    {info.value}
                  </p>
                </ModernCard>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Ingredients Section */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-transparent via-indigo-50/30 to-transparent dark:via-indigo-950/10">
        <div className="container mx-auto px-4">
          <motion.div
            variants={staggerContainerNormal}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="max-w-3xl mx-auto"
          >
            <motion.div variants={fadeInUp} className="text-center mb-12">
              <div className="flex items-center justify-center gap-2 mb-4">
                <ListChecks className="w-6 h-6 text-indigo-500" />
                <span className="text-indigo-600 dark:text-indigo-400 font-semibold">
                  Ingredients
                </span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-800 dark:text-white font-display">
                What You'll <span className="text-gradient-primary">Need</span>
              </h2>
            </motion.div>

            <ModernCard variant="glass">
              <div className="p-6 md:p-8">
                <div className="space-y-4">
                  {ingredients.map((ingredient, index) => (
                    <motion.div
                      key={ingredient.item}
                      variants={staggerItem}
                      className={cn(
                        "flex items-center justify-between py-3",
                        index !== ingredients.length - 1 &&
                          "border-b border-slate-200/50 dark:border-slate-700/50",
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                        <span className="text-slate-700 dark:text-slate-200 font-medium">
                          {ingredient.item}
                        </span>
                        {ingredient.notes && (
                          <span className="text-sm text-slate-500">
                            ({ingredient.notes})
                          </span>
                        )}
                      </div>
                      <span className="text-indigo-600 dark:text-indigo-400 font-semibold">
                        {ingredient.amount}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </ModernCard>
          </motion.div>
        </div>
      </section>

      {/* Steps Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <motion.div
            variants={staggerContainerNormal}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.div variants={fadeInUp} className="text-center mb-12">
              <div className="flex items-center justify-center gap-2 mb-4">
                <ChefHat className="w-6 h-6 text-indigo-500" />
                <span className="text-indigo-600 dark:text-indigo-400 font-semibold">
                  Instructions
                </span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-800 dark:text-white font-display">
                Step-by-Step{" "}
                <span className="text-gradient-primary">Guide</span>
              </h2>
            </motion.div>

            <div className="max-w-4xl mx-auto space-y-6">
              {steps.map((step, index) => (
                <motion.div key={step.title} variants={staggerItem}>
                  <ModernCard variant="glass" className="overflow-hidden">
                    <div className="p-6 md:p-8">
                      <div className="flex items-start gap-4">
                        <div
                          className={cn(
                            "flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center",
                            "bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-bold text-lg",
                          )}
                        >
                          {index + 1}
                        </div>
                        <div className="flex-grow">
                          <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2 font-display">
                            {step.title}
                          </h3>
                          <p className="text-slate-600 dark:text-slate-300 mb-4">
                            {step.description}
                          </p>
                          <div
                            className={cn(
                              "flex items-start gap-2 p-3 rounded-lg",
                              "bg-amber-50 dark:bg-amber-900/20 border border-amber-200/50 dark:border-amber-700/30",
                            )}
                          >
                            <Lightbulb className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                            <p className="text-sm text-amber-800 dark:text-amber-300">
                              <strong>Pro Tip:</strong> {step.tip}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </ModernCard>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Troubleshooting Section */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-transparent via-indigo-50/30 to-transparent dark:via-indigo-950/10">
        <div className="container mx-auto px-4">
          <motion.div
            variants={staggerContainerNormal}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.div variants={fadeInUp} className="text-center mb-12">
              <div className="flex items-center justify-center gap-2 mb-4">
                <AlertTriangle className="w-6 h-6 text-indigo-500" />
                <span className="text-indigo-600 dark:text-indigo-400 font-semibold">
                  Troubleshooting
                </span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-800 dark:text-white font-display">
                Common{" "}
                <span className="text-gradient-primary">
                  Problems & Solutions
                </span>
              </h2>
            </motion.div>

            <div className="max-w-3xl mx-auto grid gap-4 md:grid-cols-2">
              {troubleshooting.map((item, index) => (
                <motion.div key={index} variants={staggerItem}>
                  <ModernCard variant="feature" className="h-full">
                    <div className="p-6">
                      <h3 className="text-lg font-bold text-red-600 dark:text-red-400 mb-2">
                        {item.problem}
                      </h3>
                      <p className="text-slate-600 dark:text-slate-300">
                        <span className="font-semibold text-green-600 dark:text-green-400">
                          Solution:{" "}
                        </span>
                        {item.solution}
                      </p>
                    </div>
                  </ModernCard>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <motion.div
            variants={staggerContainerNormal}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <motion.div
              variants={fadeInUp}
              className="flex items-center justify-center gap-2 mb-4"
            >
              <HelpCircle className="w-6 h-6 text-indigo-500" />
              <span className="text-indigo-600 dark:text-indigo-400 font-semibold">
                FAQ
              </span>
            </motion.div>
            <motion.h2
              variants={fadeInUp}
              className="text-3xl md:text-4xl font-bold text-slate-800 dark:text-white font-display mb-4"
            >
              Frequently Asked{" "}
              <span className="text-gradient-primary">Questions</span>
            </motion.h2>
          </motion.div>

          <motion.div
            variants={staggerContainerNormal}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="max-w-3xl mx-auto space-y-4"
          >
            {faqData.map((faq, index) => (
              <motion.div key={index} variants={staggerItem}>
                <ModernCard variant="glass" className="overflow-hidden">
                  <div className="p-6">
                    <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-2 font-display">
                      {faq.question}
                    </h3>
                    <p className="text-slate-600 dark:text-slate-300">
                      {faq.answer}
                    </p>
                  </div>
                </ModernCard>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <ModernCard variant="gradient" className="overflow-hidden">
              <div className="p-8 md:p-12 text-center">
                <Sparkles className="w-12 h-12 text-white/80 mx-auto mb-4" />
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-4 font-display">
                  Need Custom Fortune Messages?
                </h2>
                <p className="text-white/80 mb-6 max-w-xl mx-auto">
                  Use our AI-powered generator to create personalized fortune
                  messages for your homemade cookies!
                </p>
                <Link
                  href="/ai-generator"
                  className={cn(
                    "inline-flex items-center gap-2 px-6 py-3 rounded-full",
                    "bg-white text-indigo-600 font-semibold",
                    "hover:bg-white/90 hover:scale-105 transition-all duration-300",
                    "shadow-lg hover:shadow-xl",
                  )}
                >
                  Generate Fortune Messages
                  <ChevronRight className="w-5 h-5" />
                </Link>
              </div>
            </ModernCard>
          </motion.div>
        </div>
      </section>
    </PageLayout>
  );
}
