"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Sparkles,
  ChevronRight,
  ArrowRight,
  Star,
  Heart,
  Smile,
  TrendingUp,
  Brain,
  Users,
  Cake,
  BookOpen,
} from "lucide-react";
import Link from "next/link";
import { FortuneMessage } from "@/lib/fortune-database";
import { CopyButton } from "./CopyButton";

// Icon name to component mapping (for client-side resolution)
const iconMap = {
  star: Star,
  smile: Smile,
  heart: Heart,
  "trending-up": TrendingUp,
  brain: Brain,
  users: Users,
  cake: Cake,
  "book-open": BookOpen,
} as const;

export type IconName = keyof typeof iconMap;

export interface CategoryConfig {
  id: string;
  seoTitle: string;
  iconName: IconName; // Serializable string instead of function
  color: string;
  borderColor: string;
  intro: string;
  viewAllPath: string;
  ctaText: string;
}

// Related categories mapping for internal linking
const relatedCategories: Record<string, string[]> = {
  inspirational: ["success", "wisdom"],
  funny: ["birthday", "friendship"],
  love: ["friendship", "inspirational"],
  success: ["inspirational", "wisdom"],
  wisdom: ["inspirational", "study"],
  friendship: ["love", "birthday"],
  birthday: ["funny", "friendship"],
  study: ["wisdom", "success"],
};

// Category labels for display
const categoryLabels: Record<string, string> = {
  inspirational: "Inspirational",
  funny: "Funny",
  love: "Love",
  success: "Success",
  wisdom: "Wisdom",
  friendship: "Friendship",
  birthday: "Birthday",
  study: "Study",
};

interface MessageCategorySectionProps {
  category: CategoryConfig;
  messages: FortuneMessage[];
  totalCount?: number; // Total count for "View All" badge
  lastUpdated?: string; // ISO date string for last updated
}

/**
 * MessageCategorySection - Renders a single category section with header, intro, messages grid, and links
 *
 * Features:
 * 1. Lazy loading of individual category sections
 * 2. Copy button on each message card
 * 3. Enhanced header with button-style "View All" and metadata
 * 4. Accessible with proper ARIA labels and semantic structure
 * 5. Related categories for internal linking
 */
export function MessageCategorySection({
  category,
  messages,
  totalCount,
  lastUpdated,
}: MessageCategorySectionProps) {
  const IconComponent = iconMap[category.iconName];
  const displayMessages = messages.slice(0, 15);
  const headingId = `${category.id}-heading`;
  const related = relatedCategories[category.id] || [];

  // Format last updated date
  const formattedDate = lastUpdated
    ? new Date(lastUpdated).toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
      })
    : "Jan 2026";

  const displayCount = totalCount || messages.length;

  return (
    <section
      id={category.id}
      className="scroll-mt-20"
      role="region"
      aria-labelledby={headingId}
    >
      {/* Category Header - Enhanced with button-style View All and metadata */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 rounded-xl border border-[#FFE4D6] bg-white p-3 shadow-sm">
            <IconComponent
              className="h-8 w-8 text-[#FF6B3D]"
              aria-hidden="true"
            />
          </div>
          <div>
            <h2
              id={headingId}
              className="text-2xl md:text-3xl font-bold text-[#222222]"
            >
              {category.seoTitle}
            </h2>
            <div className="flex flex-wrap items-center gap-2 mt-2">
              <Badge variant="secondary" className={category.color}>
                {displayCount} messages
              </Badge>
              <span className="text-xs text-[#888888]">
                · Updated {formattedDate}
              </span>
            </div>
          </div>
        </div>

        {/* Button-style View All (visible on larger screens) */}
        <div className="hidden sm:block">
          <Button
            asChild
            variant="outline"
            className="border-[#FFD6C5] text-[#FF6B3D] hover:bg-[#FFE4D6] hover:text-[#E55328] hover:border-[#FF6B3D]"
          >
            <Link href={category.viewAllPath} prefetch={true}>
              View All
              <ChevronRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>

      {/* Category Intro Paragraph */}
      <p className="text-[#555555] leading-relaxed mb-8 max-w-4xl">
        {category.intro}
      </p>

      {/* Messages Grid - Semantic list structure */}
      <ul
        role="list"
        className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-6 list-none p-0"
        aria-label={`${category.seoTitle} messages`}
      >
        {displayMessages.map((fortune) => (
          <li key={fortune.id}>
            <Card
              className={`group border border-[#FFE4D6] border-l-4 bg-white p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${category.borderColor} h-full`}
            >
              <div className="flex items-start gap-3">
                <Sparkles
                  className="mt-1 h-5 w-5 flex-shrink-0 text-[#FF6B3D] opacity-50 transition-opacity group-hover:opacity-100"
                  aria-hidden="true"
                />
                <div className="flex-1 min-w-0">
                  <blockquote className="text-[#222222] italic leading-relaxed mb-3">
                    &ldquo;{fortune.message}&rdquo;
                  </blockquote>
                  <div className="flex items-center justify-between gap-2">
                    {fortune.luckyNumbers &&
                      fortune.luckyNumbers.length > 0 && (
                        <div className="flex items-center gap-1.5 text-xs text-[#555555]">
                          <span>Lucky:</span>
                          {fortune.luckyNumbers.slice(0, 3).map((num, i) => (
                            <span
                              key={i}
                              className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#FFE4D6] text-[#E55328] font-medium"
                              aria-label={`Lucky number ${num}`}
                            >
                              {num}
                            </span>
                          ))}
                        </div>
                      )}
                    {/* Copy Button */}
                    <CopyButton
                      message={fortune.message}
                      luckyNumbers={fortune.luckyNumbers}
                      className="ml-auto opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity"
                    />
                  </div>
                </div>
              </div>
            </Card>
          </li>
        ))}
      </ul>

      {/* View All + CTA Row + Related Categories */}
      <div className="border-t border-[#FFE4D6] pt-4 space-y-3">
        {/* Main CTAs */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* Mobile View All (visible on small screens) */}
          <Link
            href={category.viewAllPath}
            prefetch={true}
            className="sm:hidden inline-flex items-center font-medium text-[#FF6B3D] transition-colors hover:text-[#E55328] hover:underline group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6B3D] focus-visible:ring-offset-2 rounded"
          >
            View all {category.seoTitle.toLowerCase()}
            <ChevronRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>

          {/* Desktop: show count link */}
          <Link
            href={category.viewAllPath}
            prefetch={true}
            className="hidden sm:inline-flex items-center font-medium text-[#FF6B3D] transition-colors hover:text-[#E55328] hover:underline group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6B3D] focus-visible:ring-offset-2 rounded"
          >
            See all {displayCount}{" "}
            {category.seoTitle
              .toLowerCase()
              .replace(" fortune cookie messages", "")
              .replace(" messages", "")}{" "}
            messages
            <ChevronRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>

          {/* AI Generator CTA */}
          <Link
            href={`/generator?category=${category.id}`}
            prefetch={true}
            className="inline-flex items-center text-sm text-[#555555] transition-colors hover:text-[#E55328] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6B3D] focus-visible:ring-offset-2 rounded"
          >
            {category.ctaText} Use our AI generator
            <ArrowRight className="ml-1 h-4 w-4" aria-hidden="true" />
          </Link>
        </div>

        {/* Related Categories - Internal Linking */}
        {related.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 text-sm">
            <span className="text-[#888888]">Related:</span>
            {related.map((relatedId) => (
              <Link
                key={relatedId}
                href={`#${relatedId}`}
                className="inline-flex items-center px-3 py-1 rounded-full bg-[#F5F5F5] text-[#555555] hover:bg-[#FFE4D6] hover:text-[#E55328] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6B3D] focus-visible:ring-offset-2"
              >
                {categoryLabels[relatedId] || relatedId}
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
