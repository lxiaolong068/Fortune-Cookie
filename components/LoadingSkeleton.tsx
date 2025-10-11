/**
 * Loading Skeleton Component
 * Provides visual feedback while components are being loaded
 */

import { cn } from "@/lib/utils";

interface LoadingSkeletonProps {
  className?: string;
  variant?: "card" | "text" | "circle" | "button";
  lines?: number;
}

export function LoadingSkeleton({ 
  className, 
  variant = "card",
  lines = 3 
}: LoadingSkeletonProps) {
  if (variant === "text") {
    return (
      <div className={cn("space-y-2", className)}>
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className={cn(
              "h-4 bg-gray-200 rounded animate-pulse",
              i === lines - 1 && "w-3/4" // Last line shorter
            )}
          />
        ))}
      </div>
    );
  }

  if (variant === "circle") {
    return (
      <div
        className={cn(
          "rounded-full bg-gray-200 animate-pulse",
          className
        )}
      />
    );
  }

  if (variant === "button") {
    return (
      <div
        className={cn(
          "h-10 bg-gray-200 rounded-md animate-pulse",
          className
        )}
      />
    );
  }

  // Default card variant
  return (
    <div className={cn("rounded-lg border bg-card p-6 space-y-4", className)}>
      <div className="h-6 bg-gray-200 rounded animate-pulse w-1/2" />
      <div className="space-y-2">
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className={cn(
              "h-4 bg-gray-200 rounded animate-pulse",
              i === lines - 1 && "w-3/4"
            )}
          />
        ))}
      </div>
      <div className="h-10 bg-gray-200 rounded animate-pulse w-1/3" />
    </div>
  );
}

/**
 * Fortune Cookie Loading Skeleton
 * Specific skeleton for fortune cookie component
 */
export function FortuneCookieSkeleton() {
  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      {/* Theme selector skeleton */}
      <div className="space-y-2">
        <div className="h-4 bg-gray-200 rounded animate-pulse w-24" />
        <div className="h-10 bg-gray-200 rounded-md animate-pulse" />
      </div>

      {/* Cookie card skeleton */}
      <div className="rounded-lg border bg-card p-8 space-y-6">
        {/* Cookie image placeholder */}
        <div className="w-48 h-48 mx-auto bg-gray-200 rounded-full animate-pulse" />
        
        {/* Action button skeleton */}
        <div className="h-12 bg-gray-200 rounded-md animate-pulse w-full" />
      </div>

      {/* Customization section skeleton */}
      <div className="rounded-lg border bg-card p-6 space-y-4">
        <div className="h-6 bg-gray-200 rounded animate-pulse w-1/3" />
        <div className="h-24 bg-gray-200 rounded-md animate-pulse" />
        <div className="h-10 bg-gray-200 rounded-md animate-pulse w-1/4" />
      </div>
    </div>
  );
}

