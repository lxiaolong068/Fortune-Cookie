"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion, useReducedMotion } from "framer-motion";

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
  /** Show visual highlight effect when counting */
  showHighlight?: boolean;
}

/**
 * Easing function for smooth animation (easeOutExpo)
 * More dramatic start, smoother end for visual impact
 */
function easeOutExpo(t: number): number {
  return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
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
  showHighlight = true,
}: AnimatedCounterProps) {
  const [displayValue, setDisplayValue] = useState(value);
  const [hasAnimated, setHasAnimated] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const elementRef = useRef<HTMLSpanElement>(null);
  const animationRef = useRef<number | null>(null);
  const prefersReducedMotion = useReducedMotion();

  const startAnimation = useCallback(() => {
    const startTime = performance.now();
    setDisplayValue(0);
    setIsAnimating(true);

    function animate(currentTime: number) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easeOutExpo(progress);
      const currentValue = Math.floor(easedProgress * value);

      setDisplayValue(currentValue);

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        setDisplayValue(value);
        setIsAnimating(false);
      }
    }

    animationRef.current = requestAnimationFrame(animate);
  }, [duration, value]);

  useEffect(() => {
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
        threshold: 0.3,
        rootMargin: "0px 0px -50px 0px",
      },
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [value, hasAnimated, startAnimation, prefersReducedMotion]);

  const formattedValue = formatNumber
    ? displayValue.toLocaleString()
    : displayValue.toString();

  // If reduced motion, render simple span
  if (prefersReducedMotion) {
    return (
      <span ref={elementRef} className={className}>
        {prefix}
        {formattedValue}
        {suffix}
      </span>
    );
  }

  return (
    <motion.span
      ref={elementRef}
      className={`relative inline-block ${className || ""}`}
      animate={
        isAnimating && showHighlight
          ? {
              scale: [1, 1.05, 1],
            }
          : {}
      }
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      {/* Highlight glow effect during animation */}
      {isAnimating && showHighlight && (
        <motion.span
          className="absolute inset-0 -z-10 rounded-lg bg-amber-400/20 blur-md"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: [0, 0.5, 0], scale: [0.8, 1.2, 1] }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      )}
      {prefix}
      <span className={isAnimating ? "tabular-nums" : ""}>
        {formattedValue}
      </span>
      {suffix}
    </motion.span>
  );
}
