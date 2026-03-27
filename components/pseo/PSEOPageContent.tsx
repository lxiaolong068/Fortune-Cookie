"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  Sparkles,
  MessageCircle,
  ChevronRight,
  HelpCircle,
  Lightbulb,
  Star,
  Heart,
  Zap,
  BookOpen,
  Coffee,
  Check,
  Copy,
  ArrowRight,
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

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────

export interface PSEOSubcategory {
  name: string;
  messages: string[];
}

export interface PSEOTip {
  title: string;
  description: string;
}

export interface PSEOFAQ {
  question: string;
  answer: string;
}

export interface PSEOBlogPost {
  slug: string;
  title: string;
  description: string;
  emoji: string;
}

export interface PSEORelatedLink {
  slug: string;
  title: string;
  emoji: string;
  badge: string;
  basePath: string;
}

export interface PSEOPageContentProps {
  title: string;
  badge: string;
  emoji: string;
  description: string;
  subcategories: PSEOSubcategory[];
  tips: PSEOTip[];
  faqs: PSEOFAQ[];
  relatedLinks: PSEORelatedLink[];
  gradient?: "indigo" | "purple" | "amber";
  breadcrumbs: { label: string; href?: string }[];
  hubPath: string;
  hubLabel: string;
  /** Optional intro paragraph for content depth */
  introContent?: string;
  /** Related blog posts for cross-linking */
  relatedBlogPosts?: PSEOBlogPost[];
}

import type { LucideIcon } from "lucide-react";

// Rotating icon set for subcategory headers
const categoryIcons: LucideIcon[] = [
  Sparkles,
  MessageCircle,
  Heart,
  Lightbulb,
  Zap,
  BookOpen,
  Coffee,
  Star,
];

// Gradient pairs by position
const gradientPairs: { from: string; to: string }[] = [
  { from: "from-amber-500", to: "to-orange-500" },
  { from: "from-indigo-500", to: "to-purple-500" },
  { from: "from-purple-500", to: "to-pink-500" },
  { from: "from-emerald-500", to: "to-teal-500" },
  { from: "from-rose-500", to: "to-pink-500" },
  { from: "from-blue-500", to: "to-indigo-500" },
];

// ─────────────────────────────────────────────
// Copy Button
// ─────────────────────────────────────────────

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback for older browsers
      const el = document.createElement("textarea");
      el.value = text;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <button
      onClick={handleCopy}
      aria-label={copied ? "Copied!" : "Copy message"}
      className={cn(
        "flex-shrink-0 p-1.5 rounded-lg transition-all duration-200",
        copied
          ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400"
          : "text-slate-400 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900/20",
      )}
    >
      {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
    </button>
  );
}

// ─────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────

export function PSEOPageContent({
  title,
  badge,
  emoji,
  description,
  subcategories,
  tips,
  faqs,
  relatedLinks,
  gradient = "amber",
  breadcrumbs,
  hubPath,
  hubLabel,
  introContent,
  relatedBlogPosts,
}: PSEOPageContentProps) {
  return (
    <PageLayout gradient={gradient}>
      {/* ── Hero ── */}
      <PageHero
        badge={
          <HeroBadge>
            <span className="mr-1">{emoji}</span> {badge}
          </HeroBadge>
        }
        title={title}
        gradientTitle
        description={description}
        breadcrumbs={breadcrumbs}
      />

      {/* ── Intro Content (SEO depth) ── */}
      {introContent && (
        <section className="py-8 md:py-12">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="max-w-3xl mx-auto"
            >
              <ModernCard variant="glass">
                <div className="p-6 md:p-8">
                  <p className="text-slate-700 dark:text-slate-200 leading-relaxed text-base md:text-lg">
                    {introContent}
                  </p>
                </div>
              </ModernCard>
            </motion.div>
          </div>
        </section>
      )}

      {/* ── Message Subcategories ── */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <motion.div
            variants={staggerContainerNormal}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="space-y-10"
          >
            {subcategories.map((category, idx) => {
              const Icon = categoryIcons[idx % categoryIcons.length] as LucideIcon;
              const pair = gradientPairs[idx % gradientPairs.length] ?? gradientPairs[0];
              const { from, to } = pair as { from: string; to: string };

              return (
                <motion.div key={category.name} variants={staggerItem}>
                  <ModernCard variant="glass" className="overflow-hidden">
                    <div className="p-6 md:p-8">
                      {/* Category Header */}
                      <div className="flex items-center gap-4 mb-6">
                        <ModernCardIcon gradientFrom={from} gradientTo={to}>
                          <Icon className="w-6 h-6 text-white" />
                        </ModernCardIcon>
                        <h2 className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-white font-display">
                          {category.name}
                        </h2>
                      </div>

                      {/* Messages Grid */}
                      <div className="grid gap-3 md:grid-cols-2">
                        {category.messages.map((message, mIdx) => (
                          <motion.div
                            key={mIdx}
                            variants={fadeInUp}
                            className={cn(
                              "p-4 rounded-xl border group",
                              "bg-gradient-to-br from-white/50 to-white/30 dark:from-slate-800/50 dark:to-slate-800/30",
                              "border-white/50 dark:border-slate-700/50",
                              "hover:shadow-lg hover:scale-[1.01] transition-all duration-300",
                            )}
                          >
                            <div className="flex items-start gap-3">
                              <Star className="w-4 h-4 text-amber-500 flex-shrink-0 mt-1" />
                              <p className="text-slate-700 dark:text-slate-200 font-medium italic flex-1 text-sm leading-relaxed">
                                &ldquo;{message}&rdquo;
                              </p>
                              <CopyButton text={message} />
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </ModernCard>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* ── Tips Section ── */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-transparent via-amber-50/30 to-transparent dark:via-amber-950/10">
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
              <span className="text-gradient-primary">These Fortunes</span>
            </motion.h2>
            <motion.p
              variants={fadeInUp}
              className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto"
            >
              Make the most of these fortune cookie messages
            </motion.p>
          </motion.div>

          <motion.div
            variants={staggerContainerNormal}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid gap-6 md:grid-cols-3"
          >
            {tips.map((tip, idx) => {
              const tipIcons: LucideIcon[] = [Sparkles, Lightbulb, MessageCircle];
              const TipIcon = (tipIcons[idx % 3] ?? Sparkles) as LucideIcon;
              return (
                <motion.div key={tip.title} variants={staggerItem}>
                  <ModernCard variant="feature" className="h-full">
                    <div className="p-6 text-center">
                      <ModernCardIcon className="mx-auto mb-4">
                        <TipIcon className="w-6 h-6 text-white" />
                      </ModernCardIcon>
                      <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2 font-display">
                        {tip.title}
                      </h3>
                      <p className="text-slate-600 dark:text-slate-300 text-sm">
                        {tip.description}
                      </p>
                    </div>
                  </ModernCard>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* ── AI Generator CTA ── */}
      <section className="py-12 md:py-16">
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
                  Want a Custom Fortune?
                </h2>
                <p className="text-white/80 mb-6 max-w-xl mx-auto">
                  Use our AI-powered fortune cookie generator to create
                  personalized messages for any occasion, mood, or person.
                </p>
                <Link
                  href="/generator"
                  className={cn(
                    "inline-flex items-center gap-2 px-6 py-3 rounded-full",
                    "bg-white text-amber-600 font-semibold",
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

      {/* ── Related Pages ── */}
      {relatedLinks.length > 0 && (
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <motion.div
              variants={staggerContainerNormal}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="text-center mb-10"
            >
              <motion.h2
                variants={fadeInUp}
                className="text-3xl md:text-4xl font-bold text-slate-800 dark:text-white font-display mb-4"
              >
                Explore{" "}
                <span className="text-gradient-primary">More Fortunes</span>
              </motion.h2>
              <motion.p variants={fadeInUp} className="text-slate-600 dark:text-slate-300">
                Discover fortune cookie messages for every occasion and mood
              </motion.p>
            </motion.div>

            <motion.div
              variants={staggerContainerNormal}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
            >
              {relatedLinks.map((link) => (
                <motion.div key={link.slug} variants={staggerItem}>
                  <Link href={`${link.basePath}/${link.slug}`}>
                    <ModernCard
                      variant="default"
                      hoverable
                      className="h-full cursor-pointer"
                    >
                      <div className="p-5 flex items-center gap-4">
                        <span className="text-3xl flex-shrink-0">
                          {link.emoji}
                        </span>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium text-amber-600 dark:text-amber-400 uppercase tracking-wide mb-1">
                            {link.badge}
                          </p>
                          <p className="font-semibold text-slate-800 dark:text-white truncate">
                            {link.title}
                          </p>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-400 flex-shrink-0" />
                      </div>
                    </ModernCard>
                  </Link>
                </motion.div>
              ))}
            </motion.div>

            {/* Hub page link */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-center mt-8"
            >
              <Link
                href={hubPath}
                className="inline-flex items-center gap-2 text-amber-600 dark:text-amber-400 font-semibold hover:underline"
              >
                View all {hubLabel}
                <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          </div>
        </section>
      )}

      {/* ── FAQ ── */}
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
              <HelpCircle className="w-6 h-6 text-amber-500" />
              <span className="text-amber-600 dark:text-amber-400 font-semibold">
                FAQ
              </span>
            </motion.div>
            <motion.h2
              variants={fadeInUp}
              className="text-3xl md:text-4xl font-bold text-slate-800 dark:text-white font-display"
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
            {faqs.map((faq, idx) => (
              <motion.div key={idx} variants={staggerItem}>
                <ModernCard variant="glass" className="overflow-hidden">
                  <div className="p-6">
                    <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-2 font-display">
                      {faq.question}
                    </h3>
                    <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                </ModernCard>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
      {/* ── Related Blog Posts ── */}
      {relatedBlogPosts && relatedBlogPosts.length > 0 && (
        <section className="py-16 md:py-20 bg-gradient-to-b from-transparent via-indigo-50/20 to-transparent dark:via-indigo-950/10">
          <div className="container mx-auto px-4">
            <motion.div
              variants={staggerContainerNormal}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="text-center mb-10"
            >
              <motion.div
                variants={fadeInUp}
                className="flex items-center justify-center gap-2 mb-4"
              >
                <BookOpen className="w-6 h-6 text-indigo-500" />
                <span className="text-indigo-600 dark:text-indigo-400 font-semibold">
                  Related Articles
                </span>
              </motion.div>
              <motion.h2
                variants={fadeInUp}
                className="text-3xl md:text-4xl font-bold text-slate-800 dark:text-white font-display"
              >
                Learn More &amp;{" "}
                <span className="text-gradient-primary">Get Inspired</span>
              </motion.h2>
              <motion.p
                variants={fadeInUp}
                className="text-slate-600 dark:text-slate-300 mt-3 max-w-xl mx-auto"
              >
                Dive deeper with our expert guides and creative ideas
              </motion.p>
            </motion.div>

            <motion.div
              variants={staggerContainerNormal}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
            >
              {relatedBlogPosts.map((post) => (
                <motion.div key={post.slug} variants={staggerItem}>
                  <Link href={`/blog/${post.slug}`}>
                    <ModernCard
                      variant="default"
                      hoverable
                      className="h-full cursor-pointer"
                    >
                      <div className="p-5">
                        <div className="flex items-center gap-3 mb-3">
                          <span className="text-2xl">{post.emoji}</span>
                          <span className="text-xs font-medium text-indigo-600 dark:text-indigo-400 uppercase tracking-wide">
                            Article
                          </span>
                        </div>
                        <h3 className="font-semibold text-slate-800 dark:text-white mb-2 leading-snug">
                          {post.title}
                        </h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-2">
                          {post.description}
                        </p>
                        <div className="flex items-center gap-1 mt-3 text-amber-600 dark:text-amber-400 text-sm font-medium">
                          Read more
                          <ArrowRight className="w-3.5 h-3.5" />
                        </div>
                      </div>
                    </ModernCard>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
      )}
    </PageLayout>
  );
}
