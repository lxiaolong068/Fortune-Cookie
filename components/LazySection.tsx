"use client";

import { useEffect, useRef, useState, ReactNode } from "react";

interface LazySectionProps {
  children: ReactNode;
  placeholder?: ReactNode;
  rootMargin?: string;
  className?: string;
}

/**
 * LazySection - A generic lazy loading wrapper using Intersection Observer
 *
 * - Renders a placeholder until the section enters the viewport
 * - Uses rootMargin to preload content before it's visible (default 200px)
 * - Once visible, disconnects observer and keeps content rendered
 */
export function LazySection({
  children,
  placeholder,
  rootMargin = "200px",
  className = "",
}: LazySectionProps) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const currentRef = ref.current;
    if (!currentRef) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry && entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin },
    );

    observer.observe(currentRef);

    return () => observer.disconnect();
  }, [rootMargin]);

  return (
    <div ref={ref} className={className}>
      {isVisible ? children : placeholder || <LoadingPlaceholder />}
    </div>
  );
}

/**
 * Default loading placeholder with skeleton animation
 * Mimics the structure of a category section
 */
function LoadingPlaceholder() {
  return (
    <div className="animate-pulse space-y-6 py-12">
      {/* Header skeleton */}
      <div className="flex items-start gap-4">
        <div className="w-14 h-14 bg-gray-200 rounded-xl flex-shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="h-8 bg-gray-200 rounded w-2/5" />
          <div className="h-5 bg-gray-200 rounded w-20" />
        </div>
      </div>

      {/* Intro paragraph skeleton */}
      <div className="space-y-2">
        <div className="h-4 bg-gray-200 rounded w-full" />
        <div className="h-4 bg-gray-200 rounded w-4/5" />
        <div className="h-4 bg-gray-200 rounded w-3/5" />
      </div>

      {/* Cards grid skeleton */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="h-32 bg-gray-200 rounded-lg border-l-4 border-gray-300"
          />
        ))}
      </div>

      {/* Footer links skeleton */}
      <div className="flex justify-between items-center pt-4 border-t border-gray-200">
        <div className="h-5 bg-gray-200 rounded w-48" />
        <div className="h-5 bg-gray-200 rounded w-56" />
      </div>
    </div>
  );
}

/**
 * Alternative placeholder for content sections (History, How to Write, CTA)
 */
export function ContentSectionPlaceholder() {
  return (
    <div className="animate-pulse max-w-5xl mx-auto">
      <div className="bg-gray-100 rounded-3xl p-8 md:p-12 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-gray-200 rounded-full" />
          <div className="h-8 bg-gray-200 rounded w-2/3" />
        </div>

        {/* Content */}
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded w-full" />
            <div className="h-4 bg-gray-200 rounded w-5/6" />
            <div className="h-4 bg-gray-200 rounded w-4/6" />
          </div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded w-full" />
            <div className="h-4 bg-gray-200 rounded w-5/6" />
            <div className="h-4 bg-gray-200 rounded w-4/6" />
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * CTA section placeholder
 */
export function CTAPlaceholder() {
  return (
    <div className="animate-pulse max-w-5xl mx-auto">
      <div className="bg-gradient-to-r from-gray-300 to-gray-400 rounded-3xl p-12 text-center space-y-6">
        <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto" />
        <div className="h-10 bg-gray-200 rounded w-1/2 mx-auto" />
        <div className="h-5 bg-gray-200 rounded w-2/3 mx-auto" />
        <div className="flex justify-center gap-4">
          <div className="h-10 bg-gray-200 rounded w-48" />
          <div className="h-10 bg-gray-200 rounded w-48" />
          <div className="h-10 bg-gray-200 rounded w-48" />
        </div>
        <div className="h-14 bg-gray-200 rounded w-72 mx-auto" />
      </div>
    </div>
  );
}
