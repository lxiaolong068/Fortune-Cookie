"use client";

import { Card } from "@/components/ui/card";

interface MessageCardSkeletonProps {
  count?: number;
}

/**
 * MessageCardSkeleton - Skeleton loading state for message cards
 *
 * Features:
 * - Matches exact dimensions of MessageCard
 * - Animated pulse effect
 * - Configurable number of skeleton cards
 */
export function MessageCardSkeleton({ count = 6 }: MessageCardSkeletonProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, index) => (
        <Card
          key={index}
          className="border border-[#FFE4D6] border-l-4 border-l-[#FFE4D6] bg-white p-5 animate-pulse"
          aria-hidden="true"
        >
          <div className="flex items-start gap-3">
            {/* Sparkle icon placeholder */}
            <div className="mt-1 h-5 w-5 rounded bg-[#FFE4D6]" />
            <div className="flex-1 space-y-3">
              {/* Message text placeholder */}
              <div className="space-y-2">
                <div className="h-4 bg-[#F0F0F0] rounded w-full" />
                <div className="h-4 bg-[#F0F0F0] rounded w-11/12" />
                <div className="h-4 bg-[#F0F0F0] rounded w-4/5" />
              </div>
              {/* Lucky numbers placeholder */}
              <div className="flex items-center gap-1.5">
                <div className="h-3 w-10 bg-[#F0F0F0] rounded" />
                <div className="h-5 w-5 rounded-full bg-[#FFE4D6]" />
                <div className="h-5 w-5 rounded-full bg-[#FFE4D6]" />
                <div className="h-5 w-5 rounded-full bg-[#FFE4D6]" />
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}

/**
 * CategorySectionSkeleton - Full skeleton for a category section
 */
export function CategorySectionSkeleton() {
  return (
    <div className="animate-pulse" aria-hidden="true">
      {/* Header skeleton */}
      <div className="flex items-start gap-4 mb-6">
        <div className="flex-shrink-0 rounded-xl bg-[#F0F0F0] p-3 h-14 w-14" />
        <div className="flex-1">
          <div className="h-8 bg-[#F0F0F0] rounded w-64 mb-2" />
          <div className="h-6 bg-[#FFE4D6] rounded w-24" />
        </div>
      </div>

      {/* Intro paragraph skeleton */}
      <div className="space-y-2 mb-8 max-w-4xl">
        <div className="h-4 bg-[#F0F0F0] rounded w-full" />
        <div className="h-4 bg-[#F0F0F0] rounded w-11/12" />
        <div className="h-4 bg-[#F0F0F0] rounded w-3/4" />
      </div>

      {/* Message cards skeleton */}
      <MessageCardSkeleton count={6} />

      {/* Footer skeleton */}
      <div className="flex items-center justify-between gap-4 border-t border-[#FFE4D6] pt-4 mt-6">
        <div className="h-5 bg-[#FFE4D6] rounded w-48" />
        <div className="h-5 bg-[#F0F0F0] rounded w-56" />
      </div>
    </div>
  );
}
