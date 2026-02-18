"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Shield,
  Sparkles,
  Users,
  Globe,
  Heart,
  Zap,
  BookOpen,
  Mail,
  CheckCircle2,
  Info,
  Code,
  Brain,
} from "lucide-react";

import { PageLayout } from "@/components/PageLayout";
import { PageHero, HeroBadge } from "@/components/PageHero";
import {
  ModernCard,
  ModernCardHeader,
  ModernCardTitle,
  ModernCardDescription,
  ModernCardContent,
  ModernCardIcon,
} from "@/components/ui/modern-card";
import {
  staggerContainerNormal,
  staggerItem,
  fadeInUp,
} from "@/lib/animations";

const breadcrumbItems = [
  { label: "Home", href: "/" },
  { label: "About Us" },
];

const missionValues = [
  {
    icon: Heart,
    title: "Free & Accessible",
    description:
      "We believe everyone deserves a moment of inspiration. Our fortune cookie generator is completely free, with no hidden costs or paywalls.",
    gradient: { from: "from-pink-500", to: "to-rose-500" },
  },
  {
    icon: Shield,
    title: "Privacy First",
    description:
      "Your data is yours. We collect minimal information, never sell personal data, and are transparent about our data practices.",
    gradient: { from: "from-green-500", to: "to-emerald-500" },
  },
  {
    icon: Sparkles,
    title: "Quality Content",
    description:
      "Every fortune message is carefully curated or AI-generated to be meaningful, thought-provoking, and uplifting.",
    gradient: { from: "from-amber-500", to: "to-orange-500" },
  },
  {
    icon: Globe,
    title: "Global Reach",
    description:
      "Our platform supports multiple languages and is designed to bring joy to people around the world, regardless of background.",
    gradient: { from: "from-blue-500", to: "to-cyan-500" },
  },
];

const techStack = [
  {
    icon: Code,
    title: "Modern Web Technology",
    description:
      "Built with Next.js 14, TypeScript, and React — industry-standard technologies used by millions of websites worldwide.",
    gradient: { from: "from-indigo-500", to: "to-purple-500" },
  },
  {
    icon: Brain,
    title: "AI-Powered Generation",
    description:
      "Our fortune messages are generated using advanced AI language models, ensuring each message is unique, creative, and contextually relevant.",
    gradient: { from: "from-violet-500", to: "to-purple-500" },
  },
  {
    icon: Zap,
    title: "Optimized Performance",
    description:
      "We prioritize fast load times and smooth interactions. Our platform uses edge caching, progressive enhancement, and modern web performance techniques.",
    gradient: { from: "from-yellow-500", to: "to-amber-500" },
  },
  {
    icon: Shield,
    title: "Security & Reliability",
    description:
      "Protected by HTTPS encryption, Content Security Policy headers, and regular security audits. Your experience is safe and reliable.",
    gradient: { from: "from-teal-500", to: "to-cyan-500" },
  },
];

const milestones = [
  {
    year: "2024",
    title: "Project Launch",
    description:
      "Fortune Cookie AI launched with 500+ curated fortune messages across 6 categories.",
  },
  {
    year: "2024",
    title: "AI Integration",
    description:
      "Integrated AI language models to generate personalized fortune cookie messages on demand.",
  },
  {
    year: "2025",
    title: "Multi-Language Support",
    description:
      "Expanded to support English and Chinese, bringing fortune cookies to a global audience.",
  },
  {
    year: "2025",
    title: "Content Expansion",
    description:
      "Added blog articles, recipes, history guides, and educational content about fortune cookie culture.",
  },
];

export function AboutPageContent() {
  return (
    <PageLayout background="subtle" gradient="indigo" headerOffset={false}>
      <PageHero
        title="About Us"
        subtitle="Fortune Cookie AI"
        description="We are a small team passionate about bringing moments of inspiration and joy through AI-powered fortune cookie messages."
        icon={Users}
        breadcrumbs={breadcrumbItems}
        badge={<HeroBadge icon={Info}>Est. 2024</HeroBadge>}
      />

      <div className="container mx-auto px-4 py-12">
        {/* Our Story */}
        <motion.div
          variants={fadeInUp}
          initial="initial"
          animate="animate"
          className="mb-12"
        >
          <ModernCard variant="glass" className="p-6">
            <div className="flex items-start gap-4">
              <ModernCardIcon
                gradientFrom="from-indigo-500"
                gradientTo="to-purple-500"
              >
                <BookOpen className="w-6 h-6 text-white" />
              </ModernCardIcon>
              <div>
                <h2 className="text-xl font-semibold text-foreground mb-3">
                  Our Story
                </h2>
                <div className="space-y-4 text-muted-foreground leading-relaxed">
                  <p>
                    Fortune Cookie AI was born from a simple idea: what if we
                    could combine the timeless charm of fortune cookies with
                    modern AI technology to create something truly special?
                  </p>
                  <p>
                    Traditional fortune cookies have brought smiles to millions
                    of people for over a century. We wanted to preserve that
                    magic while making it accessible to anyone, anywhere, at any
                    time. Our AI-powered generator creates unique, personalized
                    messages that go beyond generic sayings — each fortune is
                    crafted to inspire, motivate, or bring a smile to your face.
                  </p>
                  <p>
                    Today, our platform hosts over 500 curated fortune messages
                    across categories like Inspirational, Love, Humor, Career,
                    Wisdom, and more. Whether you&apos;re looking for daily
                    motivation, a fun conversation starter, or a thoughtful
                    message to share with friends, Fortune Cookie AI is here for
                    you.
                  </p>
                </div>
              </div>
            </div>
          </ModernCard>
        </motion.div>

        {/* Mission & Values */}
        <motion.div
          variants={staggerContainerNormal}
          initial="initial"
          animate="animate"
          className="mb-12"
        >
          <h2 className="text-2xl font-bold text-foreground text-center mb-8">
            Our Mission & Values
          </h2>
          <div className="grid gap-6 md:grid-cols-2">
            {missionValues.map((value) => {
              const Icon = value.icon;
              return (
                <motion.div key={value.title} variants={staggerItem}>
                  <ModernCard variant="glass" className="h-full">
                    <ModernCardHeader>
                      <div className="flex items-center gap-4">
                        <ModernCardIcon
                          gradientFrom={value.gradient.from}
                          gradientTo={value.gradient.to}
                        >
                          <Icon className="w-6 h-6 text-white" />
                        </ModernCardIcon>
                        <ModernCardTitle>{value.title}</ModernCardTitle>
                      </div>
                    </ModernCardHeader>
                    <ModernCardContent>
                      <p className="text-muted-foreground">
                        {value.description}
                      </p>
                    </ModernCardContent>
                  </ModernCard>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Technology */}
        <motion.div
          variants={fadeInUp}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          className="mb-12"
        >
          <h2 className="text-2xl font-bold text-foreground text-center mb-8">
            Built with Modern Technology
          </h2>
          <div className="grid gap-6 md:grid-cols-2">
            {techStack.map((tech) => {
              const Icon = tech.icon;
              return (
                <ModernCard key={tech.title} variant="glass" className="h-full">
                  <ModernCardHeader>
                    <div className="flex items-center gap-4">
                      <ModernCardIcon
                        gradientFrom={tech.gradient.from}
                        gradientTo={tech.gradient.to}
                      >
                        <Icon className="w-6 h-6 text-white" />
                      </ModernCardIcon>
                      <ModernCardTitle>{tech.title}</ModernCardTitle>
                    </div>
                  </ModernCardHeader>
                  <ModernCardContent>
                    <p className="text-muted-foreground">{tech.description}</p>
                  </ModernCardContent>
                </ModernCard>
              );
            })}
          </div>
        </motion.div>

        {/* Milestones */}
        <motion.div
          variants={fadeInUp}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          className="mb-12"
        >
          <h2 className="text-2xl font-bold text-foreground text-center mb-8">
            Our Journey
          </h2>
          <ModernCard variant="glass" className="p-6">
            <div className="space-y-6">
              {milestones.map((milestone, idx) => (
                <div key={idx} className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-16 text-center">
                    <span className="inline-block px-3 py-1 text-sm font-bold bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-full">
                      {milestone.year}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">
                      {milestone.title}
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      {milestone.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </ModernCard>
        </motion.div>

        {/* What Makes Us Different */}
        <motion.div
          variants={fadeInUp}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          className="mb-12"
        >
          <ModernCard variant="glass" className="overflow-hidden">
            <ModernCardHeader>
              <div className="flex items-center gap-4">
                <ModernCardIcon
                  gradientFrom="from-amber-500"
                  gradientTo="to-orange-500"
                >
                  <Sparkles className="w-6 h-6 text-white" />
                </ModernCardIcon>
                <div>
                  <ModernCardTitle className="text-xl">
                    What Makes Us Different
                  </ModernCardTitle>
                  <ModernCardDescription>
                    Why people choose Fortune Cookie AI
                  </ModernCardDescription>
                </div>
              </div>
            </ModernCardHeader>
            <ModernCardContent>
              <ul className="space-y-3">
                {[
                  "500+ curated fortune messages across 6 categories",
                  "AI-generated personalized fortunes — every message is unique",
                  "No registration required — start using immediately",
                  "Mobile-friendly design that works on any device",
                  "Lucky numbers generated with each fortune",
                  "Share fortunes easily on social media",
                  "Educational content about fortune cookie history and culture",
                  "Regular updates with new features and content",
                ].map((item, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-3 text-muted-foreground"
                  >
                    <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </ModernCardContent>
          </ModernCard>
        </motion.div>

        {/* Contact Section */}
        <motion.div
          variants={fadeInUp}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
        >
          <ModernCard
            variant="gradient"
            className="text-center p-8"
            gradientFrom="from-indigo-500"
            gradientTo="to-purple-600"
          >
            <div className="flex justify-center mb-4">
              <div className="p-3 rounded-2xl bg-white/20 backdrop-blur-sm">
                <Mail className="w-8 h-8 text-white" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">
              Get in Touch
            </h3>
            <p className="text-white/90 mb-6 max-w-lg mx-auto">
              Have questions, feedback, or partnership ideas? We&apos;d love to
              hear from you. Our team reads every message.
            </p>
            <a
              href="mailto:hello@fortune-cookie-ai.com"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl
                       bg-white text-indigo-600 font-semibold
                       hover:bg-white/90 transition-all duration-300
                       shadow-lg hover:shadow-xl"
            >
              <Mail className="w-5 h-5" />
              Contact Us
            </a>
          </ModernCard>
        </motion.div>
      </div>
    </PageLayout>
  );
}
