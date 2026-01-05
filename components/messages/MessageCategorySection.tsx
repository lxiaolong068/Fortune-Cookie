import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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

interface MessageCategorySectionProps {
  category: CategoryConfig;
  messages: FortuneMessage[];
}

/**
 * MessageCategorySection - Renders a single category section with header, intro, messages grid, and links
 *
 * This component is extracted from the main messages page to enable:
 * 1. Lazy loading of individual category sections
 * 2. Better code organization and reusability
 * 3. Easier maintenance and testing
 */
export function MessageCategorySection({
  category,
  messages,
}: MessageCategorySectionProps) {
  const IconComponent = iconMap[category.iconName];
  const displayMessages = messages.slice(0, 15);

  return (
    <section id={category.id} className="scroll-mt-20">
      {/* Category Header */}
      <div className="flex items-start gap-4 mb-6">
        <div className="flex-shrink-0 rounded-xl border border-[#FFE4D6] bg-white p-3 shadow-sm">
          <IconComponent className="h-8 w-8 text-[#FF6B3D]" />
        </div>
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-[#222222]">
            {category.seoTitle}
          </h2>
          <Badge variant="secondary" className={`mt-2 ${category.color}`}>
            {messages.length} messages
          </Badge>
        </div>
      </div>

      {/* Category Intro Paragraph */}
      <p className="text-[#555555] leading-relaxed mb-8 max-w-4xl">
        {category.intro}
      </p>

      {/* Messages Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-6">
        {displayMessages.map((fortune) => (
          <Card
            key={fortune.id}
            className={`group border border-[#FFE4D6] border-l-4 bg-white p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${category.borderColor}`}
          >
            <div className="flex items-start gap-3">
              <Sparkles className="mt-1 h-5 w-5 flex-shrink-0 text-[#FF6B3D] opacity-50 transition-opacity group-hover:opacity-100" />
              <div className="flex-1">
                <blockquote className="text-[#222222] italic leading-relaxed mb-3">
                  &ldquo;{fortune.message}&rdquo;
                </blockquote>
                {fortune.luckyNumbers && (
                  <div className="flex items-center gap-1.5 text-xs text-[#555555]">
                    <span>Lucky:</span>
                    {fortune.luckyNumbers.slice(0, 3).map((num, i) => (
                      <span
                        key={i}
                        className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#FFE4D6] text-[#E55328] font-medium"
                      >
                        {num}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* View All + CTA Row */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-t border-[#FFE4D6] pt-4">
        <Link
          href={category.viewAllPath}
          className="inline-flex items-center font-medium text-[#FF6B3D] transition-colors hover:text-[#E55328] hover:underline group"
        >
          View all {category.seoTitle.toLowerCase()}
          <ChevronRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Link>
        <Link
          href={`/generator?category=${category.id}`}
          className="inline-flex items-center text-sm text-[#555555] transition-colors hover:text-[#E55328] hover:underline"
        >
          {category.ctaText} Use our AI generator
          <ArrowRight className="ml-1 h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}
