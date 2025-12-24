"use client";

import { useEffect, useState, useTransition } from "react";
import { usePathname, useSearchParams } from "next/navigation";

/**
 * RouteProgress Component
 *
 * Displays a loading progress bar during page transitions.
 * Uses Next.js navigation hooks to detect route changes.
 */
export function RouteProgress() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending] = useTransition();
  const [isNavigating, setIsNavigating] = useState(false);
  const [progress, setProgress] = useState(0);

  // Track navigation start/end
  useEffect(() => {
    // Reset when navigation completes
    setIsNavigating(false);
    setProgress(0);
  }, [pathname, searchParams]);

  // Animate progress bar during navigation
  useEffect(() => {
    if (!isNavigating) return;

    const timer = setInterval(() => {
      setProgress((prev) => {
        // Slow down as we approach 90%
        if (prev >= 90) return prev;
        const increment = Math.random() * 10;
        return Math.min(prev + increment, 90);
      });
    }, 200);

    return () => clearInterval(timer);
  }, [isNavigating]);

  // Detect navigation via click events on links
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const link = target.closest("a");

      if (
        link &&
        link.href &&
        !link.target &&
        !link.download &&
        link.origin === window.location.origin
      ) {
        // Internal navigation detected
        const url = new URL(link.href);
        if (
          url.pathname !== pathname ||
          url.search !== window.location.search
        ) {
          setIsNavigating(true);
          setProgress(10);
        }
      }
    };

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, [pathname]);

  // Show pending state from useTransition
  const showProgress = isNavigating || isPending;

  if (!showProgress) return null;

  return (
    <div
      className="fixed top-0 left-0 right-0 z-[100] h-1 bg-amber-100"
      role="progressbar"
      aria-valuenow={progress}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label="Page loading"
    >
      <div
        className="h-full bg-gradient-to-r from-amber-500 to-orange-500 transition-all duration-200 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}

export default RouteProgress;
