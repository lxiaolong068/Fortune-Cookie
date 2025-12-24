"use client";

import { useEffect, useRef, useState, useCallback } from "react";

interface AnimatedCounterProps {
  /** The target number to count to */
  value: number;
  /** Duration of the animation in milliseconds */
  duration?: number;
  /** Format the number (e.g., add commas) */
  formatNumber?: boolean;
  /** Suffix to append (e.g., "+") */
  suffix?: string;
  /** Prefix to prepend (e.g., "$") */
  prefix?: string;
  /** Additional className for styling */
  className?: string;
}

/**
 * Easing function for smooth animation (easeOutQuart)
 * Starts fast, ends slow for a natural counting feel
 */
function easeOutQuart(t: number): number {
  return 1 - Math.pow(1 - t, 4);
}

/**
 * AnimatedCounter - Counts from 0 to target value when visible
 *
 * Features:
 * - IntersectionObserver for visibility detection
 * - SSR-safe: renders final value on server
 * - Respects prefers-reduced-motion
 * - Smooth easeOutQuart animation
 */
export function AnimatedCounter({
  value,
  duration = 2000,
  formatNumber = true,
  suffix = "",
  prefix = "",
  className,
}: AnimatedCounterProps) {
  const [displayValue, setDisplayValue] = useState(value);
  const [hasAnimated, setHasAnimated] = useState(false);
  const elementRef = useRef<HTMLSpanElement>(null);
  const animationRef = useRef<number | null>(null);

  const startAnimation = useCallback(() => {
    const startTime = performance.now();
    setDisplayValue(0);

    function animate(currentTime: number) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easeOutQuart(progress);
      const currentValue = Math.floor(easedProgress * value);

      setDisplayValue(currentValue);

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        setDisplayValue(value);
      }
    }

    animationRef.current = requestAnimationFrame(animate);
  }, [duration, value]);

  useEffect(() => {
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (prefersReducedMotion) {
      setDisplayValue(value);
      setHasAnimated(true);
      return;
    }

    const element = elementRef.current;
    if (!element || hasAnimated) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry?.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          startAnimation();
          observer.disconnect();
        }
      },
      {
        threshold: 0.5,
        rootMargin: "0px",
      },
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [value, hasAnimated, startAnimation]);

  const formattedValue = formatNumber
    ? displayValue.toLocaleString()
    : displayValue.toString();

  return (
    <span ref={elementRef} className={className}>
      {prefix}
      {formattedValue}
      {suffix}
    </span>
  );
}
