"use client";

import { motion } from "framer-motion";
import { Cake, Users, Sun, Share2, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface UseCase {
  icon: LucideIcon;
  title: string;
  description: string;
  gradient: string;
  iconBg: string;
  iconColor: string;
}

const useCases: UseCase[] = [
  {
    icon: Cake,
    title: "Birthday Celebrations",
    description: "Add a magical touch to birthday parties with personalized fortune messages",
    gradient: "from-pink-50 to-rose-100",
    iconBg: "bg-pink-100",
    iconColor: "text-pink-600",
  },
  {
    icon: Users,
    title: "Team Building",
    description: "Break the ice at corporate events with fun and inspiring fortunes",
    gradient: "from-blue-50 to-indigo-100",
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
  },
  {
    icon: Sun,
    title: "Daily Inspiration",
    description: "Start each day with wisdom and positive energy from your fortune",
    gradient: "from-amber-50 to-yellow-100",
    iconBg: "bg-amber-100",
    iconColor: "text-amber-600",
  },
  {
    icon: Share2,
    title: "Social Sharing",
    description: "Share meaningful fortunes with friends and spread positivity online",
    gradient: "from-green-50 to-emerald-100",
    iconBg: "bg-green-100",
    iconColor: "text-green-600",
  },
];

interface UseCaseScenesProps {
  className?: string;
}

/**
 * UseCaseScenes - Displays 4 usage scenarios with icons and descriptions
 *
 * Features:
 * - 2x2 grid on mobile, 4-column on desktop
 * - Gradient backgrounds matching scenario themes
 * - Hover animations
 * - Staggered entrance animation
 */
export function UseCaseScenes({ className }: UseCaseScenesProps) {
  return (
    <section
      className={cn("py-12", className)}
      aria-labelledby="use-cases-heading"
    >
      <div className="max-w-5xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h2
            id="use-cases-heading"
            className="text-2xl font-semibold text-gray-800 mb-2"
          >
            Perfect For Every Occasion
          </h2>
          <p className="text-gray-600">
            Discover how people use Fortune Cookie in their daily lives
          </p>
        </div>

        {/* Use Case Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {useCases.map((useCase, index) => {
            const Icon = useCase.icon;

            return (
              <motion.div
                key={useCase.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.4,
                  delay: index * 0.1,
                  ease: "easeOut",
                }}
              >
                <div
                  className={cn(
                    "group h-full p-5 md:p-6 rounded-2xl",
                    "bg-gradient-to-br border border-white/50",
                    "transition-all duration-300",
                    "hover:shadow-lg hover:-translate-y-1",
                    useCase.gradient
                  )}
                >
                  {/* Icon */}
                  <div
                    className={cn(
                      "w-12 h-12 rounded-xl flex items-center justify-center mb-4",
                      "transition-transform duration-300 group-hover:scale-110",
                      useCase.iconBg
                    )}
                  >
                    <Icon
                      className={cn("h-6 w-6", useCase.iconColor)}
                      aria-hidden="true"
                    />
                  </div>

                  {/* Content */}
                  <h3 className="text-base md:text-lg font-semibold text-gray-800 mb-2">
                    {useCase.title}
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {useCase.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
