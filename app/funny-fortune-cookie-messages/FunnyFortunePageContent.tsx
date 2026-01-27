"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  Laugh,
  Sparkles,
  MessageCircle,
  ChevronRight,
  HelpCircle,
  Lightbulb,
  Star,
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

// Fortune message categories with their messages
const funnyCategories = [
  {
    name: "Self-Deprecating Humor",
    icon: Laugh,
    messages: [
      "You will find what you're looking for... right after you stop looking for it.",
      "Your patience will be tested. Mainly by you.",
      "You are destined for greatness. Just not today. Maybe tomorrow.",
      "The fortune you seek is in another cookie.",
    ],
  },
  {
    name: "Absurdist Wisdom",
    icon: Sparkles,
    messages: [
      "A duck's quack doesn't echo. Neither does your advice.",
      "You will step on a Lego. This is unavoidable.",
      "Today is a good day to wear mismatched socks intentionally.",
      "Your spirit animal is a confused penguin.",
    ],
  },
  {
    name: "Modern Life Humor",
    icon: MessageCircle,
    messages: [
      "Your WiFi signal will be strong today. Your willpower, not so much.",
      "You will remember that embarrassing thing you did in 2012. Again.",
      "Your inbox is almost clean. Almost.",
      "Someone will ask you 'Working hard or hardly working?' Prepare yourself.",
    ],
  },
  {
    name: "Unexpected Twists",
    icon: Lightbulb,
    messages: [
      "Help! I'm trapped in a fortune cookie factory!",
      "This fortune intentionally left blank for contemplation.",
      "Error 404: Fortune not found. Try refreshing your karma.",
      "You opened the wrong cookie. This fortune was meant for someone cooler.",
    ],
  },
];

// FAQ data
const faqData = [
  {
    question: "What makes fortune cookie messages funny?",
    answer:
      "Funny fortune cookie messages typically use unexpected twists, relatable modern humor, self-deprecating jokes, or absurdist wisdom that subverts traditional fortune cookie expectations.",
  },
  {
    question: "Can I use these funny fortunes for my own cookies?",
    answer:
      "Yes! These fortune messages are perfect for parties, events, or making your own homemade fortune cookies with a humorous twist.",
  },
  {
    question: "Are traditional fortune cookies supposed to be funny?",
    answer:
      "Traditional fortune cookies often contain inspirational messages or vague predictions. Funny fortune cookies are a modern twist that prioritizes humor over mysticism.",
  },
  {
    question: "How can I generate more funny fortune messages?",
    answer:
      "Try our AI Fortune Cookie Generator to create unlimited custom fortunes with different moods, including hilarious and witty options!",
  },
];

export function FunnyFortunePageContent() {
  return (
    <PageLayout gradient="indigo">
      <PageHero
        badge={<HeroBadge icon={Laugh}>Funny Collection</HeroBadge>}
        title="Funny Fortune Cookie Messages"
        gradientTitle
        description="A curated collection of hilarious, witty, and unexpectedly funny fortune cookie messages that will make you laugh out loud. Perfect for parties, pranks, and brightening someone's day!"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Funny Messages" },
        ]}
      />

      {/* Categories Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <motion.div
            variants={staggerContainerNormal}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="space-y-12"
          >
            {funnyCategories.map((category, categoryIndex) => (
              <motion.div key={category.name} variants={staggerItem}>
                <ModernCard variant="glass" className="overflow-hidden">
                  <div className="p-6 md:p-8">
                    {/* Category Header */}
                    <div className="flex items-center gap-4 mb-6">
                      <ModernCardIcon
                        gradientFrom={
                          categoryIndex % 2 === 0
                            ? "from-indigo-500"
                            : "from-purple-500"
                        }
                        gradientTo={
                          categoryIndex % 2 === 0
                            ? "to-purple-500"
                            : "to-pink-500"
                        }
                      >
                        <category.icon className="w-6 h-6 text-white" />
                      </ModernCardIcon>
                      <h2 className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-white font-display">
                        {category.name}
                      </h2>
                    </div>

                    {/* Messages Grid */}
                    <div className="grid gap-4 md:grid-cols-2">
                      {category.messages.map((message, messageIndex) => (
                        <motion.div
                          key={messageIndex}
                          variants={fadeInUp}
                          className={cn(
                            "p-4 rounded-xl border",
                            "bg-gradient-to-br from-white/50 to-white/30 dark:from-slate-800/50 dark:to-slate-800/30",
                            "border-white/50 dark:border-slate-700/50",
                            "hover:shadow-lg hover:scale-[1.02] transition-all duration-300",
                          )}
                        >
                          <div className="flex items-start gap-3">
                            <Star className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                            <p className="text-slate-700 dark:text-slate-200 font-medium italic">
                              "{message}"
                            </p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </ModernCard>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Tips Section */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-transparent via-indigo-50/30 to-transparent dark:via-indigo-950/10">
        <div className="container mx-auto px-4">
          <motion.div
            variants={staggerContainerNormal}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <motion.h2
              variants={fadeInUp}
              className="text-3xl md:text-4xl font-bold text-slate-800 dark:text-white font-display mb-4"
            >
              Tips for Using{" "}
              <span className="text-gradient-primary">Funny Fortunes</span>
            </motion.h2>
            <motion.p
              variants={fadeInUp}
              className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto"
            >
              Make the most of these hilarious fortune cookie messages
            </motion.p>
          </motion.div>

          <motion.div
            variants={staggerContainerNormal}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid gap-6 md:grid-cols-3"
          >
            {[
              {
                title: "Party Favors",
                description:
                  "Print these fortunes and place them in homemade cookies for memorable party treats.",
                icon: Sparkles,
              },
              {
                title: "Office Laughs",
                description:
                  "Share a fortune with coworkers to brighten up the workday with unexpected humor.",
                icon: MessageCircle,
              },
              {
                title: "Custom Cookies",
                description:
                  "Use our generator to create personalized funny fortunes for any occasion.",
                icon: Lightbulb,
              },
            ].map((tip, index) => (
              <motion.div key={tip.title} variants={staggerItem}>
                <ModernCard variant="feature" className="h-full">
                  <div className="p-6 text-center">
                    <ModernCardIcon className="mx-auto mb-4">
                      <tip.icon className="w-6 h-6 text-white" />
                    </ModernCardIcon>
                    <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2 font-display">
                      {tip.title}
                    </h3>
                    <p className="text-slate-600 dark:text-slate-300">
                      {tip.description}
                    </p>
                  </div>
                </ModernCard>
              </motion.div>
            ))}
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
                  Generate Your Own Funny Fortunes!
                </h2>
                <p className="text-white/80 mb-6 max-w-xl mx-auto">
                  Use our AI-powered fortune cookie generator to create
                  unlimited custom funny fortunes for any occasion.
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
                  Try AI Generator
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
