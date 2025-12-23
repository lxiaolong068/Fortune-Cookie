"use client";

import { LazySection, ContentSectionPlaceholder, CTAPlaceholder } from "@/components/LazySection";
import { MessageCategorySection, CategoryConfig } from "./MessageCategorySection";
import { HistorySection } from "./HistorySection";
import { HowToWriteSection } from "./HowToWriteSection";
import { CTASection } from "./CTASection";
import { FortuneMessage } from "@/lib/fortune-database";

interface MessagesClientWrapperProps {
  allCategories: CategoryConfig[];
  categoryMessages: Record<string, FortuneMessage[]>;
}

/**
 * MessagesClientWrapper - Client-side wrapper that handles lazy loading logic
 *
 * Loading Strategy:
 * - First 3 categories (Inspirational, Funny, Love): Render immediately for SEO and first screen
 * - Remaining 5 categories: Lazy load when user scrolls near them
 * - History, How to Write, CTA sections: Lazy load
 *
 * This approach:
 * 1. Maintains SEO (structured data and key content are SSR)
 * 2. Reduces initial DOM size (from 120+ cards to ~45)
 * 3. Improves perceived performance (faster first paint)
 * 4. Provides smooth scrolling experience (preloads with 200px margin)
 */
export function MessagesClientWrapper({
  allCategories,
  categoryMessages
}: MessagesClientWrapperProps) {
  // First 3 categories render immediately (SEO + first screen)
  const immediateCategories = allCategories.slice(0, 3);
  // Remaining categories are lazy loaded
  const lazyCategories = allCategories.slice(3);

  return (
    <div className="space-y-20">
      {/* Immediately rendered categories (first 3) */}
      {immediateCategories.map((category) => (
        <MessageCategorySection
          key={category.id}
          category={category}
          messages={categoryMessages[category.id] || []}
        />
      ))}

      {/* Lazy loaded categories (remaining 5) */}
      {lazyCategories.map((category) => (
        <LazySection key={category.id} rootMargin="300px">
          <MessageCategorySection
            category={category}
            messages={categoryMessages[category.id] || []}
          />
        </LazySection>
      ))}

      {/* Lazy loaded History & Psychology section */}
      <LazySection
        rootMargin="200px"
        placeholder={<ContentSectionPlaceholder />}
      >
        <HistorySection />
      </LazySection>

      {/* Lazy loaded How to Write section */}
      <LazySection
        rootMargin="200px"
        placeholder={<ContentSectionPlaceholder />}
      >
        <HowToWriteSection />
      </LazySection>

      {/* Lazy loaded CTA section */}
      <LazySection
        rootMargin="200px"
        placeholder={<CTAPlaceholder />}
      >
        <CTASection />
      </LazySection>
    </div>
  );
}
