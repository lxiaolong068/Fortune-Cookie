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
        <div className="p-3 rounded-xl bg-white/80 backdrop-blur-sm border border-amber-200 shadow-sm flex-shrink-0">
          <IconComponent className="w-8 h-8 text-amber-600" />
        </div>
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
            {category.seoTitle}
          </h2>
          <Badge variant="secondary" className={`${category.color} mt-2`}>
            {messages.length} messages
          </Badge>
        </div>
      </div>

      {/* Category Intro Paragraph */}
      <p className="text-gray-600 leading-relaxed mb-8 max-w-4xl">
        {category.intro}
      </p>

      {/* Messages Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {displayMessages.map((fortune) => (
          <Card
            key={fortune.id}
            className={`group p-5 bg-white/90 backdrop-blur-sm border-l-4 ${category.borderColor} hover:shadow-lg transition-all duration-300 hover:-translate-y-1`}
          >
            <div className="flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-amber-400 mt-1 flex-shrink-0 opacity-50 group-hover:opacity-100 transition-opacity" />
              <div className="flex-1">
                <blockquote className="text-gray-700 italic leading-relaxed mb-3">
                  &ldquo;{fortune.message}&rdquo;
                </blockquote>
                {fortune.luckyNumbers && (
                  <div className="flex items-center gap-1.5 text-xs text-gray-500">
                    <span>Lucky:</span>
                    {fortune.luckyNumbers.slice(0, 3).map((num, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-amber-100 text-amber-700 font-medium"
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
      <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-gray-200">
        <Link
          href={category.viewAllPath}
          className="inline-flex items-center text-amber-600 hover:text-amber-700 font-medium transition-colors group"
        >
          View all {category.seoTitle.toLowerCase()}
          <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
        </Link>
        <Link
          href={`/generator?category=${category.id}`}
          className="inline-flex items-center text-sm text-gray-500 hover:text-amber-600 transition-colors"
        >
          {category.ctaText} Use our AI generator
          <ArrowRight className="w-4 h-4 ml-1" />
        </Link>
      </div>
    </section>
  );
}
