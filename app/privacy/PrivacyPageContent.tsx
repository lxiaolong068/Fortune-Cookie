"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Shield,
  Database,
  Cookie,
  Eye,
  Lock,
  UserCheck,
  Mail,
  FileText,
  CheckCircle2,
  AlertCircle,
  Info,
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
  { label: "Privacy Policy" },
];

const privacySections = [
  {
    id: "information-collection",
    title: "Information We Collect",
    icon: Database,
    gradient: { from: "from-blue-500", to: "to-cyan-500" },
    content: [
      {
        subtitle: "Information You Provide",
        items: [
          "Account information (email, name) when you sign in with Google",
          "Preferences and settings you choose",
          "Feedback and communications you send us",
        ],
      },
      {
        subtitle: "Automatically Collected Information",
        items: [
          "Usage data (pages visited, features used)",
          "Device information (browser type, operating system)",
          "IP address and approximate location",
          "Cookies and similar technologies",
        ],
      },
    ],
  },
  {
    id: "information-use",
    title: "How We Use Your Information",
    icon: Eye,
    gradient: { from: "from-purple-500", to: "to-pink-500" },
    content: [
      {
        subtitle: "We use your information to:",
        items: [
          "Provide and improve our fortune cookie service",
          "Personalize your experience and recommendations",
          "Save your favorite fortunes and history",
          "Send important updates about our service",
          "Analyze usage patterns to improve features",
          "Ensure security and prevent fraud",
        ],
      },
    ],
  },
  {
    id: "data-sharing",
    title: "Information Sharing",
    icon: UserCheck,
    gradient: { from: "from-green-500", to: "to-emerald-500" },
    content: [
      {
        subtitle: "We may share your information with:",
        items: [
          "Service providers who help operate our platform",
          "Analytics partners (in anonymized form)",
          "Legal authorities when required by law",
        ],
      },
      {
        subtitle: "We never:",
        items: [
          "Sell your personal information",
          "Share your data for third-party advertising",
          "Disclose your identity without consent",
        ],
      },
    ],
  },
  {
    id: "data-security",
    title: "Data Security",
    icon: Lock,
    gradient: { from: "from-amber-500", to: "to-orange-500" },
    content: [
      {
        subtitle: "We protect your data through:",
        items: [
          "Encryption in transit (HTTPS/TLS)",
          "Secure data storage with access controls",
          "Regular security audits and monitoring",
          "Employee training on data protection",
        ],
      },
    ],
  },
  {
    id: "your-rights",
    title: "Your Rights",
    icon: CheckCircle2,
    gradient: { from: "from-indigo-500", to: "to-violet-500" },
    content: [
      {
        subtitle: "You have the right to:",
        items: [
          "Access your personal data",
          "Correct inaccurate information",
          "Delete your account and data",
          "Export your data in a portable format",
          "Opt out of marketing communications",
          "Withdraw consent at any time",
        ],
      },
    ],
  },
];

const cookieTypes = [
  {
    name: "Essential Cookies",
    description: "Required for basic site functionality",
    required: true,
    icon: Shield,
  },
  {
    name: "Analytics Cookies",
    description: "Help us understand how you use our site",
    required: false,
    icon: Eye,
  },
  {
    name: "Preference Cookies",
    description: "Remember your settings and preferences",
    required: false,
    icon: Cookie,
  },
];

export function PrivacyPageContent() {
  return (
    <PageLayout background="subtle" gradient="indigo" headerOffset={false}>
      <PageHero
        title="Privacy Policy"
        subtitle="Your Privacy Matters"
        description="We are committed to protecting your privacy and being transparent about how we collect, use, and share your information."
        icon={Shield}
        breadcrumbs={breadcrumbItems}
        badge={
          <HeroBadge icon={FileText}>Last Updated: January 2025</HeroBadge>
        }
      />

      <div className="container mx-auto px-4 py-12">
        {/* Quick Navigation */}
        <motion.div
          variants={fadeInUp}
          initial="initial"
          animate="animate"
          className="mb-12"
        >
          <ModernCard variant="glass" className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <ModernCardIcon
                gradientFrom="from-indigo-500"
                gradientTo="to-purple-500"
                size="sm"
              >
                <Info className="w-4 h-4 text-white" />
              </ModernCardIcon>
              <h2 className="text-lg font-semibold text-foreground">
                Quick Navigation
              </h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {privacySections.map((section) => (
                <a
                  key={section.id}
                  href={`#${section.id}`}
                  className="px-4 py-2 rounded-full bg-gradient-to-r from-indigo-500/10 to-purple-500/10
                           hover:from-indigo-500/20 hover:to-purple-500/20
                           text-sm font-medium text-foreground transition-all duration-300
                           border border-indigo-200/30 dark:border-indigo-700/30"
                >
                  {section.title}
                </a>
              ))}
            </div>
          </ModernCard>
        </motion.div>

        {/* Privacy Sections */}
        <motion.div
          variants={staggerContainerNormal}
          initial="initial"
          animate="animate"
          className="space-y-8"
        >
          {privacySections.map((section) => {
            const Icon = section.icon;
            return (
              <motion.div
                key={section.id}
                variants={staggerItem}
                id={section.id}
              >
                <ModernCard variant="glass" className="overflow-hidden">
                  <ModernCardHeader>
                    <div className="flex items-center gap-4">
                      <ModernCardIcon
                        gradientFrom={section.gradient.from}
                        gradientTo={section.gradient.to}
                      >
                        <Icon className="w-6 h-6 text-white" />
                      </ModernCardIcon>
                      <ModernCardTitle className="text-xl">
                        {section.title}
                      </ModernCardTitle>
                    </div>
                  </ModernCardHeader>
                  <ModernCardContent>
                    <div className="space-y-6">
                      {section.content.map((contentBlock, idx) => (
                        <div key={idx}>
                          <h4 className="font-medium text-foreground mb-3">
                            {contentBlock.subtitle}
                          </h4>
                          <ul className="space-y-2">
                            {contentBlock.items.map((item, itemIdx) => (
                              <li
                                key={itemIdx}
                                className="flex items-start gap-3 text-muted-foreground"
                              >
                                <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </ModernCardContent>
                </ModernCard>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Cookie Information */}
        <motion.div
          variants={fadeInUp}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          className="mt-12"
          id="cookies"
        >
          <ModernCard variant="glass" className="overflow-hidden">
            <ModernCardHeader>
              <div className="flex items-center gap-4">
                <ModernCardIcon
                  gradientFrom="from-amber-500"
                  gradientTo="to-orange-500"
                >
                  <Cookie className="w-6 h-6 text-white" />
                </ModernCardIcon>
                <div>
                  <ModernCardTitle className="text-xl">
                    Cookies We Use
                  </ModernCardTitle>
                  <ModernCardDescription>
                    Learn about the cookies we use and why
                  </ModernCardDescription>
                </div>
              </div>
            </ModernCardHeader>
            <ModernCardContent>
              <div className="grid gap-4 md:grid-cols-3">
                {cookieTypes.map((cookie) => {
                  const CookieIcon = cookie.icon;
                  return (
                    <div
                      key={cookie.name}
                      className="p-4 rounded-xl bg-gradient-to-br from-white/50 to-white/30
                               dark:from-gray-800/50 dark:to-gray-800/30
                               border border-gray-200/50 dark:border-gray-700/50"
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <CookieIcon className="w-5 h-5 text-indigo-500" />
                        <span className="font-medium text-foreground">
                          {cookie.name}
                        </span>
                        {cookie.required && (
                          <span
                            className="text-xs px-2 py-0.5 bg-indigo-100 dark:bg-indigo-900/30
                                         text-indigo-600 dark:text-indigo-400 rounded-full"
                          >
                            Required
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {cookie.description}
                      </p>
                    </div>
                  );
                })}
              </div>
            </ModernCardContent>
          </ModernCard>
        </motion.div>

        {/* Contact Section */}
        <motion.div
          variants={fadeInUp}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          className="mt-12"
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
              Questions About Privacy?
            </h3>
            <p className="text-white/90 mb-6 max-w-lg mx-auto">
              If you have any questions about this privacy policy or how we
              handle your data, please don&apos;t hesitate to contact us.
            </p>
            <a
              href="mailto:privacy@fortunecookie.ai"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl
                       bg-white text-indigo-600 font-semibold
                       hover:bg-white/90 transition-all duration-300
                       shadow-lg hover:shadow-xl"
            >
              <Mail className="w-5 h-5" />
              Contact Privacy Team
            </a>
          </ModernCard>
        </motion.div>

        {/* Legal Notice */}
        <motion.div
          variants={fadeInUp}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          className="mt-8 text-center"
        >
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <AlertCircle className="w-4 h-4" />
            <span>
              This policy is effective as of January 2025 and applies to all
              users of Fortune Cookie AI.
            </span>
          </div>
        </motion.div>
      </div>
    </PageLayout>
  );
}
