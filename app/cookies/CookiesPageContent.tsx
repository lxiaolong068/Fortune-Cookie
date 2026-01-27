"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Cookie,
  Shield,
  Eye,
  Settings,
  Clock,
  Database,
  Trash2,
  Info,
  CheckCircle2,
  AlertCircle,
  Mail,
  ExternalLink,
  HardDrive,
  Globe,
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
  { label: "Cookie Policy" },
];

const cookieCategories = [
  {
    id: "essential",
    name: "Essential Cookies",
    icon: Shield,
    gradient: { from: "from-green-500", to: "to-emerald-500" },
    required: true,
    description:
      "These cookies are necessary for the website to function properly.",
    cookies: [
      {
        name: "session_id",
        purpose: "Maintains your session",
        duration: "Session",
      },
      {
        name: "csrf_token",
        purpose: "Security protection",
        duration: "Session",
      },
      {
        name: "auth_token",
        purpose: "Authentication state",
        duration: "7 days",
      },
    ],
  },
  {
    id: "analytics",
    name: "Analytics Cookies",
    icon: Eye,
    gradient: { from: "from-blue-500", to: "to-cyan-500" },
    required: false,
    description: "Help us understand how visitors interact with our website.",
    cookies: [
      { name: "_ga", purpose: "Google Analytics ID", duration: "2 years" },
      {
        name: "_gid",
        purpose: "Google Analytics session",
        duration: "24 hours",
      },
      {
        name: "_gat",
        purpose: "Google Analytics throttling",
        duration: "1 minute",
      },
    ],
  },
  {
    id: "preferences",
    name: "Preference Cookies",
    icon: Settings,
    gradient: { from: "from-purple-500", to: "to-pink-500" },
    required: false,
    description:
      "Remember your settings and preferences for a better experience.",
    cookies: [
      {
        name: "theme",
        purpose: "Dark/light mode preference",
        duration: "1 year",
      },
      { name: "language", purpose: "Language preference", duration: "1 year" },
      {
        name: "fortune_prefs",
        purpose: "Fortune display preferences",
        duration: "1 year",
      },
    ],
  },
  {
    id: "functionality",
    name: "Functionality Cookies",
    icon: Cookie,
    gradient: { from: "from-amber-500", to: "to-orange-500" },
    required: false,
    description: "Enable enhanced functionality and personalization.",
    cookies: [
      {
        name: "favorites",
        purpose: "Saved fortune references",
        duration: "1 year",
      },
      {
        name: "history",
        purpose: "Fortune history tracking",
        duration: "30 days",
      },
      {
        name: "last_fortune",
        purpose: "Last generated fortune",
        duration: "24 hours",
      },
    ],
  },
];

const storageTypes = [
  {
    icon: Cookie,
    title: "HTTP Cookies",
    description: "Small text files stored in your browser",
    gradient: { from: "from-amber-500", to: "to-orange-500" },
  },
  {
    icon: HardDrive,
    title: "Local Storage",
    description: "Browser storage for app data",
    gradient: { from: "from-blue-500", to: "to-cyan-500" },
  },
  {
    icon: Database,
    title: "Session Storage",
    description: "Temporary data for current session",
    gradient: { from: "from-purple-500", to: "to-pink-500" },
  },
];

const managementSteps = [
  {
    step: 1,
    title: "Browser Settings",
    description: "Access your browser's privacy or cookie settings",
    icon: Settings,
  },
  {
    step: 2,
    title: "View Cookies",
    description: "See all cookies stored by websites you've visited",
    icon: Eye,
  },
  {
    step: 3,
    title: "Delete Cookies",
    description: "Remove specific cookies or clear all browsing data",
    icon: Trash2,
  },
  {
    step: 4,
    title: "Block Cookies",
    description: "Configure which cookies to accept or reject",
    icon: Shield,
  },
];

export function CookiesPageContent() {
  return (
    <PageLayout background="subtle" gradient="indigo" headerOffset={false}>
      <PageHero
        title="Cookie Policy"
        subtitle="How We Use Cookies"
        description="Learn about the cookies we use, why we use them, and how you can manage your preferences."
        icon={Cookie}
        breadcrumbs={breadcrumbItems}
        badge={<HeroBadge icon={Clock}>Last Updated: January 2025</HeroBadge>}
      />

      <div className="container mx-auto px-4 py-12">
        {/* What Are Cookies */}
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
                <Info className="w-6 h-6 text-white" />
              </ModernCardIcon>
              <div>
                <h2 className="text-xl font-semibold text-foreground mb-3">
                  What Are Cookies?
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  Cookies are small text files that are stored on your device
                  when you visit a website. They help websites remember your
                  preferences, keep you logged in, and provide a personalized
                  experience. We use cookies and similar technologies to enhance
                  your experience on Fortune Cookie AI.
                </p>
              </div>
            </div>
          </ModernCard>
        </motion.div>

        {/* Storage Types */}
        <motion.div
          variants={fadeInUp}
          initial="initial"
          animate="animate"
          className="mb-12"
        >
          <h2 className="text-2xl font-bold text-foreground mb-6 text-center">
            Types of Storage We Use
          </h2>
          <div className="grid gap-6 md:grid-cols-3">
            {storageTypes.map((type) => {
              const Icon = type.icon;
              return (
                <ModernCard
                  key={type.title}
                  variant="glass"
                  className="p-6 text-center"
                >
                  <div className="flex justify-center mb-4">
                    <ModernCardIcon
                      gradientFrom={type.gradient.from}
                      gradientTo={type.gradient.to}
                    >
                      <Icon className="w-6 h-6 text-white" />
                    </ModernCardIcon>
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">
                    {type.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {type.description}
                  </p>
                </ModernCard>
              );
            })}
          </div>
        </motion.div>

        {/* Cookie Categories */}
        <motion.div
          variants={staggerContainerNormal}
          initial="initial"
          animate="animate"
          className="space-y-8 mb-12"
        >
          <h2 className="text-2xl font-bold text-foreground text-center mb-6">
            Cookie Categories
          </h2>
          {cookieCategories.map((category) => {
            const Icon = category.icon;
            return (
              <motion.div
                key={category.id}
                variants={staggerItem}
                id={category.id}
              >
                <ModernCard variant="glass" className="overflow-hidden">
                  <ModernCardHeader>
                    <div className="flex items-center justify-between flex-wrap gap-4">
                      <div className="flex items-center gap-4">
                        <ModernCardIcon
                          gradientFrom={category.gradient.from}
                          gradientTo={category.gradient.to}
                        >
                          <Icon className="w-6 h-6 text-white" />
                        </ModernCardIcon>
                        <div>
                          <ModernCardTitle className="text-xl">
                            {category.name}
                          </ModernCardTitle>
                          <ModernCardDescription>
                            {category.description}
                          </ModernCardDescription>
                        </div>
                      </div>
                      {category.required ? (
                        <span
                          className="px-3 py-1 bg-green-100 dark:bg-green-900/30
                                       text-green-700 dark:text-green-400
                                       text-sm font-medium rounded-full"
                        >
                          Required
                        </span>
                      ) : (
                        <span
                          className="px-3 py-1 bg-indigo-100 dark:bg-indigo-900/30
                                       text-indigo-700 dark:text-indigo-400
                                       text-sm font-medium rounded-full"
                        >
                          Optional
                        </span>
                      )}
                    </div>
                  </ModernCardHeader>
                  <ModernCardContent>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-gray-200 dark:border-gray-700">
                            <th className="text-left py-3 px-4 font-semibold text-foreground">
                              Cookie Name
                            </th>
                            <th className="text-left py-3 px-4 font-semibold text-foreground">
                              Purpose
                            </th>
                            <th className="text-left py-3 px-4 font-semibold text-foreground">
                              Duration
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {category.cookies.map((cookie, idx) => (
                            <tr
                              key={cookie.name}
                              className={
                                idx !== category.cookies.length - 1
                                  ? "border-b border-gray-100 dark:border-gray-800"
                                  : ""
                              }
                            >
                              <td className="py-3 px-4 font-mono text-indigo-600 dark:text-indigo-400">
                                {cookie.name}
                              </td>
                              <td className="py-3 px-4 text-muted-foreground">
                                {cookie.purpose}
                              </td>
                              <td className="py-3 px-4 text-muted-foreground">
                                {cookie.duration}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </ModernCardContent>
                </ModernCard>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Managing Cookies */}
        <motion.div
          variants={fadeInUp}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          className="mb-12"
        >
          <h2 className="text-2xl font-bold text-foreground text-center mb-6">
            How to Manage Your Cookies
          </h2>
          <ModernCard variant="glass" className="p-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {managementSteps.map((step) => {
                const Icon = step.icon;
                return (
                  <div key={step.step} className="text-center">
                    <div className="relative inline-flex mb-4">
                      <div
                        className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500
                                    flex items-center justify-center"
                      >
                        <Icon className="w-8 h-8 text-white" />
                      </div>
                      <div
                        className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-indigo-600
                                    text-white text-sm font-bold flex items-center justify-center"
                      >
                        {step.step}
                      </div>
                    </div>
                    <h3 className="font-semibold text-foreground mb-2">
                      {step.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {step.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </ModernCard>
        </motion.div>

        {/* Browser Links */}
        <motion.div
          variants={fadeInUp}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          className="mb-12"
        >
          <ModernCard variant="glass" className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <ModernCardIcon
                gradientFrom="from-blue-500"
                gradientTo="to-cyan-500"
                size="sm"
              >
                <Globe className="w-4 h-4 text-white" />
              </ModernCardIcon>
              <h3 className="font-semibold text-foreground">
                Browser Cookie Settings
              </h3>
            </div>
            <p className="text-muted-foreground mb-4">
              Each browser has different ways to manage cookies. Here are links
              to popular browser guides:
            </p>
            <div className="flex flex-wrap gap-3">
              {[
                {
                  name: "Chrome",
                  url: "https://support.google.com/chrome/answer/95647",
                },
                {
                  name: "Firefox",
                  url: "https://support.mozilla.org/en-US/kb/cookies-information-websites-store-on-your-computer",
                },
                {
                  name: "Safari",
                  url: "https://support.apple.com/guide/safari/manage-cookies-sfri11471/mac",
                },
                {
                  name: "Edge",
                  url: "https://support.microsoft.com/en-us/microsoft-edge/delete-cookies-in-microsoft-edge",
                },
              ].map((browser) => (
                <a
                  key={browser.name}
                  href={browser.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full
                           bg-gradient-to-r from-indigo-500/10 to-purple-500/10
                           hover:from-indigo-500/20 hover:to-purple-500/20
                           text-sm font-medium text-foreground transition-all duration-300
                           border border-indigo-200/30 dark:border-indigo-700/30"
                >
                  {browser.name}
                  <ExternalLink className="w-3 h-3" />
                </a>
              ))}
            </div>
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
              Questions About Cookies?
            </h3>
            <p className="text-white/90 mb-6 max-w-lg mx-auto">
              If you have any questions about our use of cookies or this policy,
              please don&apos;t hesitate to contact us.
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
              This cookie policy is part of our Privacy Policy and Terms of
              Service.
            </span>
          </div>
        </motion.div>
      </div>
    </PageLayout>
  );
}
