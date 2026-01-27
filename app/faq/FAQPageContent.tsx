"use client";

import {
  HelpCircle,
  Cookie,
  Utensils,
  History,
  Lightbulb,
  Laugh,
  Sparkles,
  MessageCircle,
  type LucideIcon,
} from "lucide-react";
import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { PageLayout, PageSection } from "@/components/PageLayout";
import { PageHero, HeroBadge } from "@/components/PageHero";
import { ModernCard, ModernCardIcon } from "@/components/ui/modern-card";
import {
  fortuneCookieFAQs,
  funnyFortuneFAQs,
  recipeFAQs,
  howToMakeFAQs,
  whoInventedFAQs,
  historyFAQs,
  type FAQItem,
} from "@/components/FAQStructuredData";
import { staggerContainerNormal, staggerItem } from "@/lib/animations";
import Link from "next/link";

interface FAQSection {
  id: string;
  title: string;
  Icon: LucideIcon;
  faqs: FAQItem[];
  description: string;
  gradient: {
    from: string;
    to: string;
  };
}

const faqSections: FAQSection[] = [
  {
    id: "general",
    title: "General Questions",
    Icon: Cookie,
    faqs: fortuneCookieFAQs,
    description: "Learn the basics about fortune cookies",
    gradient: { from: "from-amber-500", to: "to-orange-500" },
  },
  {
    id: "history",
    title: "History & Origins",
    Icon: History,
    faqs: [...whoInventedFAQs, ...historyFAQs],
    description: "Discover the fascinating history of fortune cookies",
    gradient: { from: "from-indigo-500", to: "to-purple-500" },
  },
  {
    id: "recipes",
    title: "Recipes & How-To",
    Icon: Utensils,
    faqs: [...recipeFAQs, ...howToMakeFAQs],
    description: "Learn how to make fortune cookies at home",
    gradient: { from: "from-emerald-500", to: "to-teal-500" },
  },
  {
    id: "funny",
    title: "Funny Messages",
    Icon: Laugh,
    faqs: funnyFortuneFAQs,
    description: "Questions about humorous fortune cookie messages",
    gradient: { from: "from-pink-500", to: "to-rose-500" },
  },
];

// For breadcrumb navigation
const breadcrumbItems = [{ label: "Home", href: "/" }, { label: "FAQ" }];

export function FAQPageContent() {
  const totalQuestions = faqSections.reduce(
    (acc, section) => acc + section.faqs.length,
    0,
  );

  return (
    <PageLayout background="subtle" gradient="indigo" headerOffset={false}>
      <PageHero
        title="Frequently Asked Questions"
        subtitle="Help Center"
        description="Everything you need to know about fortune cookies, from their history and origins to making them at home."
        icon={HelpCircle}
        iconGradient={{ from: "from-indigo-500", to: "to-purple-500" }}
        breadcrumbs={breadcrumbItems}
        badge={
          <HeroBadge icon={MessageCircle}>
            {totalQuestions} Questions Answered
          </HeroBadge>
        }
      />

      <PageSection padding="lg" bg="transparent">
        {/* Quick Navigation */}
        <motion.div
          variants={staggerContainerNormal}
          initial="hidden"
          animate="visible"
          className="flex flex-wrap justify-center gap-3 mb-12"
        >
          {faqSections.map((section) => {
            const Icon = section.Icon;
            return (
              <motion.a
                key={section.id}
                variants={staggerItem}
                href={`#${section.id}`}
                className="group inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 hover:border-indigo-500/30 text-zinc-300 hover:text-white transition-all duration-300"
              >
                <Icon className="h-4 w-4 text-indigo-400 group-hover:text-indigo-300 transition-colors" />
                <span className="text-sm font-medium">{section.title}</span>
              </motion.a>
            );
          })}
        </motion.div>

        {/* FAQ Sections */}
        <motion.div
          variants={staggerContainerNormal}
          initial="hidden"
          animate="visible"
          className="max-w-4xl mx-auto space-y-8"
        >
          {faqSections.map((section) => {
            const Icon = section.Icon;
            return (
              <motion.section
                key={section.id}
                id={section.id}
                variants={staggerItem}
                className="scroll-mt-24"
              >
                <ModernCard variant="glass" className="overflow-hidden">
                  {/* Section Header */}
                  <div className="p-6 border-b border-white/10">
                    <div className="flex items-center gap-4">
                      <ModernCardIcon
                        gradientFrom={section.gradient.from}
                        gradientTo={section.gradient.to}
                        size="md"
                      >
                        <Icon className="w-5 h-5 text-white" />
                      </ModernCardIcon>
                      <div>
                        <h2 className="text-xl font-semibold text-white">
                          {section.title}
                        </h2>
                        <p className="text-sm text-zinc-400 mt-0.5">
                          {section.description}
                        </p>
                      </div>
                      <div className="ml-auto">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${section.gradient.from} ${section.gradient.to} text-white`}
                        >
                          {section.faqs.length} Q&A
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Accordion */}
                  <div className="p-4 md:p-6">
                    <Accordion type="single" collapsible className="w-full">
                      {section.faqs.map((faq, index) => (
                        <AccordionItem
                          key={index}
                          value={`${section.id}-${index}`}
                          className={`border-white/10 ${
                            index === section.faqs.length - 1
                              ? "border-b-0"
                              : ""
                          }`}
                        >
                          <AccordionTrigger className="text-white text-left hover:text-indigo-300 transition-colors py-4">
                            <span className="pr-4">{faq.question}</span>
                          </AccordionTrigger>
                          <AccordionContent className="text-zinc-400 leading-relaxed pb-4">
                            {faq.answer}
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </div>
                </ModernCard>
              </motion.section>
            );
          })}
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-16"
        >
          <ModernCard
            variant="glass"
            className="max-w-2xl mx-auto text-center p-8 bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-pink-500/10"
          >
            <ModernCardIcon
              gradientFrom="from-amber-500"
              gradientTo="to-orange-500"
              size="lg"
              className="mx-auto mb-6"
            >
              <Lightbulb className="w-6 h-6 text-white" />
            </ModernCardIcon>
            <h3 className="text-2xl font-bold text-white mb-3">
              Still have questions?
            </h3>
            <p className="text-zinc-400 mb-8 max-w-md mx-auto">
              Try our AI-powered fortune cookie generator for personalized
              messages, or explore our collection of curated fortunes.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/generator"
                className="group inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-medium transition-all duration-300 shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:scale-105"
              >
                <Sparkles className="h-5 w-5 group-hover:rotate-12 transition-transform" />
                Try AI Generator
              </Link>
              <Link
                href="/explore"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white/10 hover:bg-white/15 text-white font-medium transition-all duration-300 border border-white/10 hover:border-white/20"
              >
                <Cookie className="h-5 w-5" />
                Explore Fortunes
              </Link>
            </div>
          </ModernCard>
        </motion.div>
      </PageSection>
    </PageLayout>
  );
}
