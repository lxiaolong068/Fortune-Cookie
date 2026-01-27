"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  History,
  Sparkles,
  ChevronRight,
  HelpCircle,
  MapPin,
  Calendar,
  User,
  Award,
  BookOpen,
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

// Historical figures claiming invention
const inventors = [
  {
    name: "Makoto Hagiwara",
    location: "San Francisco, California",
    period: "1890s-1900s",
    claim:
      "Served fortune cookies at the Japanese Tea Garden in Golden Gate Park",
    evidence:
      "Historical records show he served cookies with thank-you notes to garden visitors. A federal judge ruled in San Francisco's favor in 1983.",
    image: "/images/history/hagiwara.jpg",
  },
  {
    name: "David Jung",
    location: "Los Angeles, California",
    period: "1918",
    claim:
      "Founder of Hong Kong Noodle Company, claimed to invent fortune cookies to give to poor people",
    evidence:
      "Jung distributed cookies containing inspirational messages to homeless people near his shop. Los Angeles claims this as the true origin.",
    image: "/images/history/jung.jpg",
  },
  {
    name: "Seiichi Kito",
    location: "Los Angeles, California",
    period: "1903",
    claim:
      "Japanese immigrant who may have introduced fortune cookies to the U.S.",
    evidence:
      "Some historians believe Kito brought the recipe from Japan where similar cookies called 'tsujiura senbei' existed.",
    image: "/images/history/kito.jpg",
  },
];

// Timeline events
const timeline = [
  {
    year: "1878",
    event: "Japanese 'Tsujiura Senbei' Documented",
    description:
      "Similar fortune-telling crackers are documented in Kyoto, Japan, containing 'omikuji' (fortune slips).",
  },
  {
    year: "1890s",
    event: "Makoto Hagiwara's Tea Garden",
    description:
      "Fortune cookies reportedly served at the Japanese Tea Garden in San Francisco's Golden Gate Park.",
  },
  {
    year: "1918",
    event: "David Jung's Claim",
    description:
      "Hong Kong Noodle Company in Los Angeles begins distributing fortune cookies.",
  },
  {
    year: "1940s",
    event: "Japanese Internment Impact",
    description:
      "During WWII, Japanese Americans were interned, and Chinese-owned businesses took over fortune cookie production.",
  },
  {
    year: "1960s",
    event: "Automated Production",
    description:
      "Edward Louie invents the automated fortune cookie machine, enabling mass production.",
  },
  {
    year: "1983",
    event: "Official Ruling",
    description:
      "A mock trial at the Court of Historical Review rules in favor of San Francisco as the birthplace.",
  },
  {
    year: "Today",
    event: "3 Billion Annually",
    description:
      "An estimated 3 billion fortune cookies are produced each year, mostly in the United States.",
  },
];

// Fun facts
const funFacts = [
  {
    title: "Not Actually Chinese",
    description:
      "Despite their association with Chinese restaurants, fortune cookies were invented in America by Japanese immigrants.",
    icon: MapPin,
  },
  {
    title: "Rare in China",
    description:
      "Fortune cookies are virtually unknown in China. When introduced there, they were marketed as 'Genuine American Fortune Cookies'.",
    icon: Award,
  },
  {
    title: "WWII Connection",
    description:
      "The association with Chinese restaurants happened because Japanese-Americans were interned during WWII.",
    icon: History,
  },
  {
    title: "World Record",
    description:
      "The largest fortune cookie ever made weighed over 100 pounds and was created in 2005.",
    icon: Award,
  },
];

// FAQ data
const faqData = [
  {
    question: "Are fortune cookies Chinese or Japanese?",
    answer:
      "Fortune cookies were invented in America, most likely by Japanese immigrants in the late 1800s or early 1900s. They have roots in Japanese 'tsujiura senbei' crackers but evolved into a distinctly American creation.",
  },
  {
    question: "Why are fortune cookies served at Chinese restaurants?",
    answer:
      "During WWII, Japanese-Americans were interned, and Chinese-American entrepreneurs took over fortune cookie production. This led to their association with Chinese restaurants in America.",
  },
  {
    question: "Do they have fortune cookies in China?",
    answer:
      "Fortune cookies are extremely rare in China. They're considered an American invention, and when they were introduced to China, they were marketed as 'American Fortune Cookies'.",
  },
  {
    question: "Who invented the fortune cookie machine?",
    answer:
      "Edward Louie of San Francisco's Lotus Fortune Cookie Company invented the automated fortune cookie machine in the 1960s, enabling mass production.",
  },
];

export function WhoInventedPageContent() {
  return (
    <PageLayout gradient="indigo">
      <PageHero
        badge={<HeroBadge icon={History}>History & Origins</HeroBadge>}
        title="Who Invented Fortune Cookies?"
        gradientTitle
        description="Discover the fascinating and disputed history of fortune cookies. From Japanese tea gardens to Chinese restaurants, explore the true origins of this iconic American treat."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "History" }]}
      />

      {/* Quick Overview */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <ModernCard variant="glass" className="max-w-4xl mx-auto">
              <div className="p-6 md:p-8">
                <div className="flex items-start gap-4">
                  <BookOpen className="w-8 h-8 text-indigo-500 flex-shrink-0" />
                  <div>
                    <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-2 font-display">
                      The Short Answer
                    </h2>
                    <p className="text-slate-600 dark:text-slate-300">
                      Fortune cookies were most likely invented in California in
                      the late 1800s or early 1900s by{" "}
                      <strong>Japanese immigrants</strong>, not Chinese. The two
                      main claimants are
                      <strong> Makoto Hagiwara</strong> of San Francisco and{" "}
                      <strong>David Jung</strong> of Los Angeles. The cookies
                      have roots in Japanese 'tsujiura senbei' but evolved into
                      a distinctly American creation.
                    </p>
                  </div>
                </div>
              </div>
            </ModernCard>
          </motion.div>
        </div>
      </section>

      {/* Inventors Section */}
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
                <User className="w-6 h-6 text-indigo-500" />
                <span className="text-indigo-600 dark:text-indigo-400 font-semibold">
                  The Claimants
                </span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-800 dark:text-white font-display">
                Who Claims to Have{" "}
                <span className="text-gradient-primary">Invented</span> Them?
              </h2>
            </motion.div>

            <div className="grid gap-6 md:grid-cols-3">
              {inventors.map((inventor, index) => (
                <motion.div key={inventor.name} variants={staggerItem}>
                  <ModernCard variant="feature" className="h-full">
                    <div className="p-6">
                      <div
                        className={cn(
                          "w-16 h-16 rounded-full flex items-center justify-center mb-4",
                          "bg-gradient-to-br from-indigo-500 to-purple-600 text-white",
                        )}
                      >
                        <User className="w-8 h-8" />
                      </div>
                      <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2 font-display">
                        {inventor.name}
                      </h3>
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                          <MapPin className="w-4 h-4" />
                          {inventor.location}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                          <Calendar className="w-4 h-4" />
                          {inventor.period}
                        </div>
                      </div>
                      <p className="text-slate-600 dark:text-slate-300 text-sm mb-4">
                        <strong>Claim:</strong> {inventor.claim}
                      </p>
                      <p className="text-slate-500 dark:text-slate-400 text-sm italic">
                        {inventor.evidence}
                      </p>
                    </div>
                  </ModernCard>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Timeline Section */}
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
                <Calendar className="w-6 h-6 text-indigo-500" />
                <span className="text-indigo-600 dark:text-indigo-400 font-semibold">
                  Timeline
                </span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-800 dark:text-white font-display">
                Fortune Cookie{" "}
                <span className="text-gradient-primary">History</span>
              </h2>
            </motion.div>

            <div className="max-w-3xl mx-auto">
              <div className="relative">
                {/* Timeline line */}
                <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-indigo-500 via-purple-500 to-indigo-500" />

                {timeline.map((item, index) => (
                  <motion.div
                    key={item.year}
                    variants={staggerItem}
                    className={cn(
                      "relative mb-8 last:mb-0",
                      index % 2 === 0
                        ? "md:pr-1/2 md:text-right"
                        : "md:pl-1/2 md:ml-auto",
                    )}
                  >
                    <div
                      className={cn(
                        "ml-16 md:ml-0",
                        index % 2 === 0 ? "md:mr-8" : "md:ml-8",
                      )}
                    >
                      <ModernCard variant="glass">
                        <div className="p-4 md:p-6">
                          <span className="inline-block px-3 py-1 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 font-bold text-sm mb-2">
                            {item.year}
                          </span>
                          <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-2 font-display">
                            {item.event}
                          </h3>
                          <p className="text-slate-600 dark:text-slate-300 text-sm">
                            {item.description}
                          </p>
                        </div>
                      </ModernCard>
                    </div>
                    {/* Timeline dot */}
                    <div
                      className={cn(
                        "absolute top-6 w-4 h-4 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 border-4 border-white dark:border-slate-900",
                        "left-6 md:left-1/2 md:-translate-x-1/2",
                      )}
                    />
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Fun Facts Section */}
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
                <Sparkles className="w-6 h-6 text-indigo-500" />
                <span className="text-indigo-600 dark:text-indigo-400 font-semibold">
                  Did You Know?
                </span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-800 dark:text-white font-display">
                Fun <span className="text-gradient-primary">Facts</span>
              </h2>
            </motion.div>

            <div className="grid gap-6 md:grid-cols-2 max-w-4xl mx-auto">
              {funFacts.map((fact, index) => (
                <motion.div key={fact.title} variants={staggerItem}>
                  <ModernCard variant="glass" className="h-full">
                    <div className="p-6">
                      <div className="flex items-start gap-4">
                        <ModernCardIcon
                          gradientFrom={
                            index % 2 === 0
                              ? "from-indigo-500"
                              : "from-purple-500"
                          }
                          gradientTo={
                            index % 2 === 0 ? "to-purple-500" : "to-pink-500"
                          }
                        >
                          <fact.icon className="w-6 h-6 text-white" />
                        </ModernCardIcon>
                        <div>
                          <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-2 font-display">
                            {fact.title}
                          </h3>
                          <p className="text-slate-600 dark:text-slate-300">
                            {fact.description}
                          </p>
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
                  Create Your Own Fortune Cookie Legacy!
                </h2>
                <p className="text-white/80 mb-6 max-w-xl mx-auto">
                  Generate unique fortune messages with our AI-powered generator
                  and become part of fortune cookie history.
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
