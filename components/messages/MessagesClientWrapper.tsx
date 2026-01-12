"use client";

import { useMemo, useState, useCallback } from "react";
import { LazySection } from "@/components/LazySection";
import {
  MessageCategorySection,
  CategoryConfig,
} from "./MessageCategorySection";
import { HistorySection } from "./HistorySection";
import { HowToWriteSection } from "./HowToWriteSection";
import { CTASection } from "./CTASection";
import { FloatingNav } from "./FloatingNav";
import { CategorySectionSkeleton } from "./MessageCardSkeleton";
import { MessagesSearchFilter } from "./MessagesSearchFilter";
import { FortuneMessage } from "@/lib/fortune-database";

// Content section placeholder for history/how-to-write sections
function ContentSectionPlaceholder() {
  return (
    <div className="animate-pulse" aria-hidden="true">
      <div className="h-8 bg-[#F0F0F0] rounded w-64 mb-4" />
      <div className="space-y-2 mb-6">
        <div className="h-4 bg-[#F0F0F0] rounded w-full" />
        <div className="h-4 bg-[#F0F0F0] rounded w-11/12" />
        <div className="h-4 bg-[#F0F0F0] rounded w-3/4" />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="h-32 bg-[#F5F5F5] rounded-xl" />
        <div className="h-32 bg-[#F5F5F5] rounded-xl" />
      </div>
    </div>
  );
}

// CTA placeholder
function CTAPlaceholder() {
  return (
    <div
      className="animate-pulse p-8 bg-[#F5F5F5] rounded-2xl text-center"
      aria-hidden="true"
    >
      <div className="h-8 bg-[#F0F0F0] rounded w-64 mx-auto mb-4" />
      <div className="h-4 bg-[#F0F0F0] rounded w-96 mx-auto mb-6" />
      <div className="h-12 bg-[#FFE4D6] rounded-full w-48 mx-auto" />
    </div>
  );
}

interface MessagesClientWrapperProps {
  allCategories: CategoryConfig[];
  categoryMessages: Record<string, FortuneMessage[]>;
  categoryMeta: Record<string, { totalCount: number; lastUpdated?: string }>;
}

/**
 * MessagesClientWrapper - Client-side wrapper that handles lazy loading logic
 *
 * Loading Strategy:
 * - First 3 categories (Inspirational, Funny, Love): Render immediately for SEO and first screen
 * - Remaining 5 categories: Lazy load when user scrolls near them
 * - History, How to Write, CTA sections: Lazy load
 *
 * Features:
 * - Search and filter functionality
 * - Floating navigation with Back to Top and category TOC
 * - Skeleton loading states for better perceived performance
 * - Prefetch for "View All" and generator pages
 *
 * This approach:
 * 1. Maintains SEO (structured data and key content are SSR)
 * 2. Reduces initial DOM size (from 120+ cards to ~45)
 * 3. Improves perceived performance (faster first paint)
 * 4. Provides smooth scrolling experience (preloads with 200px margin)
 */
export function MessagesClientWrapper({
  allCategories,
  categoryMessages,
  categoryMeta,
}: MessagesClientWrapperProps) {
  // Track if filters are active to hide category sections
  const [filtersActive, setFiltersActive] = useState(false);

  // Handler for filter state changes
  const handleFiltersActive = useCallback((active: boolean) => {
    setFiltersActive(active);
  }, []);

  // First 3 categories render immediately (SEO + first screen)
  const immediateCategories = allCategories.slice(0, 3);
  // Remaining categories are lazy loaded
  const lazyCategories = allCategories.slice(3);

  // Prepare categories for FloatingNav
  const navCategories = useMemo(() => {
    return allCategories.map((cat) => ({
      id: cat.id,
      label: cat.seoTitle
        .replace(" Fortune Cookie Messages", "")
        .replace(" Messages", ""),
    }));
  }, [allCategories]);

  return (
    <>
      {/* Search and Filter Section */}
      <section className="mb-12" aria-label="Search and filter messages">
        <MessagesSearchFilter
          onFiltersActive={handleFiltersActive}
          className=""
        />
      </section>

      {/* Category Sections - Hidden when filters are active */}
      {!filtersActive && (
        <div className="space-y-20">
          {/* Immediately rendered categories (first 3) */}
          {immediateCategories.map((category) => (
            <MessageCategorySection
              key={category.id}
              category={category}
              messages={categoryMessages[category.id] || []}
              totalCount={categoryMeta[category.id]?.totalCount}
              lastUpdated={categoryMeta[category.id]?.lastUpdated}
            />
          ))}

          {/* Lazy loaded categories (remaining 5) */}
          {lazyCategories.map((category) => (
            <LazySection
              key={category.id}
              rootMargin="300px"
              placeholder={<CategorySectionSkeleton />}
            >
              <MessageCategorySection
                category={category}
                messages={categoryMessages[category.id] || []}
                totalCount={categoryMeta[category.id]?.totalCount}
                lastUpdated={categoryMeta[category.id]?.lastUpdated}
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
          <LazySection rootMargin="200px" placeholder={<CTAPlaceholder />}>
            <CTASection />
          </LazySection>
        </div>
      )}

      {/* Floating Navigation - Only show when not filtering */}
      {!filtersActive && <FloatingNav categories={navCategories} />}
    </>
  );
}
