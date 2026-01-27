"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Scale,
  FileText,
  UserCheck,
  Shield,
  AlertTriangle,
  Ban,
  RefreshCw,
  Mail,
  CheckCircle2,
  XCircle,
  Info,
  Sparkles,
  Heart,
  Zap,
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
  { label: "Terms of Service" },
];

const termsSections = [
  {
    id: "acceptance",
    title: "Acceptance of Terms",
    icon: UserCheck,
    gradient: { from: "from-blue-500", to: "to-cyan-500" },
    content: `By accessing and using Fortune Cookie AI, you accept and agree to be bound by
    these Terms of Service. If you do not agree to these terms, please do not use our service.
    We may update these terms from time to time, and your continued use constitutes acceptance
    of any changes.`,
  },
  {
    id: "service-description",
    title: "Service Description",
    icon: Sparkles,
    gradient: { from: "from-purple-500", to: "to-pink-500" },
    content: `Fortune Cookie AI provides an AI-powered fortune cookie experience that generates
    personalized fortune messages, lucky numbers, and wisdom quotes. The service includes features
    such as daily fortunes, themed fortunes, fortune history, and favorites collection.`,
  },
  {
    id: "user-responsibilities",
    title: "User Responsibilities",
    icon: Shield,
    gradient: { from: "from-green-500", to: "to-emerald-500" },
    content: `Users are responsible for maintaining the confidentiality of their account credentials,
    using the service in compliance with applicable laws, not attempting to circumvent security measures,
    and not using the service for any illegal or unauthorized purpose.`,
  },
  {
    id: "intellectual-property",
    title: "Intellectual Property",
    icon: FileText,
    gradient: { from: "from-amber-500", to: "to-orange-500" },
    content: `All content, features, and functionality of Fortune Cookie AI, including but not limited
    to text, graphics, logos, and software, are owned by Fortune Cookie AI and protected by intellectual
    property laws. You may not reproduce, distribute, or create derivative works without permission.`,
  },
  {
    id: "limitation-liability",
    title: "Limitation of Liability",
    icon: AlertTriangle,
    gradient: { from: "from-red-500", to: "to-rose-500" },
    content: `Fortune Cookie AI is provided "as is" without warranties of any kind. We are not liable
    for any indirect, incidental, or consequential damages arising from your use of the service.
    Fortune messages are for entertainment purposes only and should not be relied upon for life decisions.`,
  },
  {
    id: "termination",
    title: "Termination",
    icon: Ban,
    gradient: { from: "from-gray-500", to: "to-slate-600" },
    content: `We reserve the right to terminate or suspend your access to the service at any time,
    without prior notice, for any reason including violation of these terms. Upon termination,
    your right to use the service will immediately cease.`,
  },
  {
    id: "changes",
    title: "Changes to Terms",
    icon: RefreshCw,
    gradient: { from: "from-indigo-500", to: "to-violet-500" },
    content: `We may modify these terms at any time. We will notify users of significant changes
    through the service or via email. Your continued use after changes constitutes acceptance
    of the new terms.`,
  },
];

const serviceFeatures = [
  {
    icon: Sparkles,
    title: "AI-Generated Fortunes",
    description: "Personalized wisdom powered by AI",
  },
  {
    icon: Heart,
    title: "Save Favorites",
    description: "Keep your meaningful fortunes",
  },
  {
    icon: Zap,
    title: "Daily Fortunes",
    description: "Fresh inspiration every day",
  },
];

const prohibitedActions = [
  "Using automated systems to access the service",
  "Attempting to reverse engineer the AI models",
  "Sharing account credentials with others",
  "Using the service for spam or harassment",
  "Circumventing usage limits or security measures",
];

const userRights = [
  "Access to the free tier of fortune generation",
  "Ability to save and manage favorite fortunes",
  "Control over your personal data and preferences",
  "Right to delete your account and data",
];

export function TermsPageContent() {
  return (
    <PageLayout background="subtle" gradient="indigo" headerOffset={false}>
      <PageHero
        title="Terms of Service"
        subtitle="Legal Agreement"
        description="Please read these terms carefully before using Fortune Cookie AI. By using our service, you agree to these terms."
        icon={Scale}
        breadcrumbs={breadcrumbItems}
        badge={<HeroBadge icon={FileText}>Effective: January 2025</HeroBadge>}
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
              {termsSections.map((section) => (
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

        {/* Service Features Overview */}
        <motion.div
          variants={fadeInUp}
          initial="initial"
          animate="animate"
          className="mb-12"
        >
          <h2 className="text-2xl font-bold text-foreground mb-6 text-center">
            Our Service Includes
          </h2>
          <div className="grid gap-6 md:grid-cols-3">
            {serviceFeatures.map((feature) => {
              const Icon = feature.icon;
              return (
                <ModernCard
                  key={feature.title}
                  variant="glass"
                  className="p-6 text-center"
                >
                  <div className="flex justify-center mb-4">
                    <ModernCardIcon
                      gradientFrom="from-indigo-500"
                      gradientTo="to-purple-500"
                    >
                      <Icon className="w-6 h-6 text-white" />
                    </ModernCardIcon>
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {feature.description}
                  </p>
                </ModernCard>
              );
            })}
          </div>
        </motion.div>

        {/* Terms Sections */}
        <motion.div
          variants={staggerContainerNormal}
          initial="initial"
          animate="animate"
          className="space-y-8"
        >
          {termsSections.map((section) => {
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
                    <p className="text-muted-foreground leading-relaxed">
                      {section.content}
                    </p>
                  </ModernCardContent>
                </ModernCard>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Rights and Restrictions */}
        <motion.div
          variants={fadeInUp}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          className="mt-12 grid gap-6 md:grid-cols-2"
        >
          {/* User Rights */}
          <ModernCard variant="glass" className="overflow-hidden">
            <ModernCardHeader>
              <div className="flex items-center gap-4">
                <ModernCardIcon
                  gradientFrom="from-green-500"
                  gradientTo="to-emerald-500"
                >
                  <CheckCircle2 className="w-6 h-6 text-white" />
                </ModernCardIcon>
                <div>
                  <ModernCardTitle>Your Rights</ModernCardTitle>
                  <ModernCardDescription>
                    What you can do with our service
                  </ModernCardDescription>
                </div>
              </div>
            </ModernCardHeader>
            <ModernCardContent>
              <ul className="space-y-3">
                {userRights.map((right, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">{right}</span>
                  </li>
                ))}
              </ul>
            </ModernCardContent>
          </ModernCard>

          {/* Prohibited Actions */}
          <ModernCard variant="glass" className="overflow-hidden">
            <ModernCardHeader>
              <div className="flex items-center gap-4">
                <ModernCardIcon
                  gradientFrom="from-red-500"
                  gradientTo="to-rose-500"
                >
                  <XCircle className="w-6 h-6 text-white" />
                </ModernCardIcon>
                <div>
                  <ModernCardTitle>Prohibited Actions</ModernCardTitle>
                  <ModernCardDescription>
                    What you cannot do
                  </ModernCardDescription>
                </div>
              </div>
            </ModernCardHeader>
            <ModernCardContent>
              <ul className="space-y-3">
                {prohibitedActions.map((action, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <XCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">{action}</span>
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
              Questions About Our Terms?
            </h3>
            <p className="text-white/90 mb-6 max-w-lg mx-auto">
              If you have any questions about these Terms of Service, please
              contact our legal team.
            </p>
            <a
              href="mailto:legal@fortunecookie.ai"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl
                       bg-white text-indigo-600 font-semibold
                       hover:bg-white/90 transition-all duration-300
                       shadow-lg hover:shadow-xl"
            >
              <Mail className="w-5 h-5" />
              Contact Legal Team
            </a>
          </ModernCard>
        </motion.div>
      </div>
    </PageLayout>
  );
}
