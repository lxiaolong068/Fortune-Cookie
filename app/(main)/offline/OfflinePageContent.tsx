"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  WifiOff,
  CloudOff,
  Cookie,
  RefreshCw,
  Sparkles,
  Heart,
  Star,
  Clock,
  Lightbulb,
  Compass,
  Smile,
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
import { Button } from "@/components/ui/button";

const breadcrumbItems = [{ label: "Home", href: "/" }, { label: "Offline" }];

// Cached fortunes for offline mode
const offlineFortunes = [
  {
    message: "A journey of a thousand miles begins with a single step.",
    category: "wisdom",
    icon: Compass,
    gradient: { from: "from-blue-500", to: "to-cyan-500" },
  },
  {
    message: "Your patience will be rewarded sooner than you think.",
    category: "encouragement",
    icon: Sparkles,
    gradient: { from: "from-purple-500", to: "to-pink-500" },
  },
  {
    message:
      "The best time to plant a tree was 20 years ago. The second best time is now.",
    category: "wisdom",
    icon: Lightbulb,
    gradient: { from: "from-amber-500", to: "to-orange-500" },
  },
  {
    message:
      "Good things come to those who wait, but better things come to those who work for it.",
    category: "motivation",
    icon: Zap,
    gradient: { from: "from-green-500", to: "to-emerald-500" },
  },
  {
    message: "A smile is a curve that sets everything straight.",
    category: "happiness",
    icon: Smile,
    gradient: { from: "from-rose-500", to: "to-pink-500" },
  },
  {
    message: "The only way to do great work is to love what you do.",
    category: "career",
    icon: Heart,
    gradient: { from: "from-red-500", to: "to-rose-500" },
  },
];

const statusCards = [
  {
    icon: WifiOff,
    title: "No Connection",
    description: "You appear to be offline",
    gradient: { from: "from-gray-500", to: "to-slate-600" },
  },
  {
    icon: Cookie,
    title: "Cached Fortunes",
    description: "Enjoy these saved fortunes",
    gradient: { from: "from-amber-500", to: "to-orange-500" },
  },
  {
    icon: RefreshCw,
    title: "Auto-Reconnect",
    description: "We'll reconnect when possible",
    gradient: { from: "from-green-500", to: "to-emerald-500" },
  },
];

export function OfflinePageContent() {
  const [selectedFortune, setSelectedFortune] = React.useState<number | null>(
    null,
  );
  const [isRefreshing, setIsRefreshing] = React.useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    // Attempt to reload
    window.location.reload();
  };

  const selectRandomFortune = () => {
    const randomIndex = Math.floor(Math.random() * offlineFortunes.length);
    setSelectedFortune(randomIndex);
  };

  return (
    <PageLayout background="subtle" gradient="indigo" headerOffset={false}>
      <PageHero
        title="You're Offline"
        subtitle="No Internet Connection"
        description="Don't worry! We've saved some fortune cookies for you to enjoy while you're offline."
        icon={CloudOff}
        breadcrumbs={breadcrumbItems}
        badge={<HeroBadge icon={WifiOff}>Offline Mode Active</HeroBadge>}
      />

      <div className="container mx-auto px-4 py-12">
        {/* Status Cards */}
        <motion.div
          variants={fadeInUp}
          initial="initial"
          animate="animate"
          className="mb-12"
        >
          <div className="grid gap-6 md:grid-cols-3">
            {statusCards.map((card) => {
              const Icon = card.icon;
              return (
                <ModernCard
                  key={card.title}
                  variant="glass"
                  className="p-6 text-center"
                >
                  <div className="flex justify-center mb-4">
                    <ModernCardIcon
                      gradientFrom={card.gradient.from}
                      gradientTo={card.gradient.to}
                    >
                      <Icon className="w-6 h-6 text-white" />
                    </ModernCardIcon>
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">
                    {card.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {card.description}
                  </p>
                </ModernCard>
              );
            })}
          </div>
        </motion.div>

        {/* Random Fortune Generator */}
        <motion.div
          variants={fadeInUp}
          initial="initial"
          animate="animate"
          className="mb-12"
        >
          <ModernCard variant="glass" className="p-8 text-center">
            <div className="flex justify-center mb-6">
              <motion.div
                animate={{ rotate: selectedFortune !== null ? 360 : 0 }}
                transition={{ duration: 0.5 }}
              >
                <ModernCardIcon
                  gradientFrom="from-indigo-500"
                  gradientTo="to-purple-500"
                  size="lg"
                >
                  <Cookie className="w-10 h-10 text-white" />
                </ModernCardIcon>
              </motion.div>
            </div>

            <h2 className="text-2xl font-bold text-foreground mb-4">
              Crack Open a Fortune
            </h2>

            {selectedFortune !== null && offlineFortunes[selectedFortune] ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6"
              >
                <div
                  className="p-6 rounded-2xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10
                              border border-indigo-200/30 dark:border-indigo-700/30 mb-4"
                >
                  <p className="text-xl text-foreground italic leading-relaxed">
                    &ldquo;{offlineFortunes[selectedFortune]!.message}&rdquo;
                  </p>
                </div>
                <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                  {React.createElement(offlineFortunes[selectedFortune]!.icon, {
                    className: "w-4 h-4",
                  })}
                  <span className="capitalize">
                    {offlineFortunes[selectedFortune]!.category}
                  </span>
                </div>
              </motion.div>
            ) : (
              <p className="text-muted-foreground mb-6">
                Click the button below to reveal your offline fortune!
              </p>
            )}

            <Button
              onClick={selectRandomFortune}
              className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700
                       text-white px-8 py-3 rounded-xl font-semibold
                       shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Sparkles className="w-5 h-5 mr-2" />
              {selectedFortune !== null
                ? "Get Another Fortune"
                : "Open Fortune Cookie"}
            </Button>
          </ModernCard>
        </motion.div>

        {/* Cached Fortunes Grid */}
        <motion.div
          variants={staggerContainerNormal}
          initial="initial"
          animate="animate"
          className="mb-12"
        >
          <h2 className="text-2xl font-bold text-foreground text-center mb-6">
            <Star className="inline-block w-6 h-6 mr-2 text-amber-500" />
            Saved Fortunes Collection
          </h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {offlineFortunes.map((fortune, idx) => {
              const Icon = fortune.icon;
              return (
                <motion.div key={idx} variants={staggerItem}>
                  <ModernCard
                    variant="glass"
                    className="p-6 h-full cursor-pointer hover:scale-[1.02] transition-transform duration-300"
                    onClick={() => setSelectedFortune(idx)}
                  >
                    <div className="flex items-start gap-4">
                      <ModernCardIcon
                        gradientFrom={fortune.gradient.from}
                        gradientTo={fortune.gradient.to}
                        size="sm"
                      >
                        <Icon className="w-4 h-4 text-white" />
                      </ModernCardIcon>
                      <div className="flex-1">
                        <p className="text-foreground leading-relaxed mb-2">
                          &ldquo;{fortune.message}&rdquo;
                        </p>
                        <span className="text-xs text-muted-foreground capitalize">
                          {fortune.category}
                        </span>
                      </div>
                    </div>
                  </ModernCard>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Reconnect Section */}
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
                <RefreshCw
                  className={`w-8 h-8 text-white ${isRefreshing ? "animate-spin" : ""}`}
                />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">
              Ready to Reconnect?
            </h3>
            <p className="text-white/90 mb-6 max-w-lg mx-auto">
              Once you&apos;re back online, refresh the page to access all our
              AI-powered features and discover new personalized fortunes!
            </p>
            <Button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="bg-white text-indigo-600 hover:bg-white/90
                       px-6 py-3 rounded-xl font-semibold
                       shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <RefreshCw
                className={`w-5 h-5 mr-2 ${isRefreshing ? "animate-spin" : ""}`}
              />
              {isRefreshing ? "Refreshing..." : "Try to Reconnect"}
            </Button>
          </ModernCard>
        </motion.div>

        {/* Tips Section */}
        <motion.div
          variants={fadeInUp}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          className="mt-12"
        >
          <ModernCard variant="glass" className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <ModernCardIcon
                gradientFrom="from-amber-500"
                gradientTo="to-orange-500"
                size="sm"
              >
                <Lightbulb className="w-4 h-4 text-white" />
              </ModernCardIcon>
              <h3 className="font-semibold text-foreground">
                Tips While Offline
              </h3>
            </div>
            <ul className="space-y-2 text-muted-foreground">
              <li className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-indigo-500" />
                <span>Your favorites and history are saved locally</span>
              </li>
              <li className="flex items-center gap-2">
                <Star className="w-4 h-4 text-amber-500" />
                <span>
                  Browse through our collection of cached fortunes above
                </span>
              </li>
              <li className="flex items-center gap-2">
                <RefreshCw className="w-4 h-4 text-green-500" />
                <span>
                  The page will automatically update when you&apos;re back
                  online
                </span>
              </li>
            </ul>
          </ModernCard>
        </motion.div>
      </div>
    </PageLayout>
  );
}
