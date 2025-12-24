"use client";

import { useEffect, useRef, useState, ReactNode } from "react";
import { motion, useReducedMotion, Variants } from "framer-motion";

export type RevealDirection =
  | "up"
  | "down"
  | "left"
  | "right"
  | "fade"
  | "scale";

interface ScrollRevealProps {
  children: ReactNode;
  direction?: RevealDirection;
  delay?: number;
  duration?: number;
  distance?: number;
  once?: boolean;
  threshold?: number;
  className?: string;
  as?: keyof JSX.IntrinsicElements;
}

const getVariants = (
  direction: RevealDirection,
  distance: number,
): Variants => {
  const hidden: Record<string, number | string> = { opacity: 0 };
  const visible: Record<string, number | string> = { opacity: 1 };

  switch (direction) {
    case "up":
      hidden.y = distance;
      visible.y = 0;
      break;
    case "down":
      hidden.y = -distance;
      visible.y = 0;
      break;
    case "left":
      hidden.x = distance;
      visible.x = 0;
      break;
    case "right":
      hidden.x = -distance;
      visible.x = 0;
      break;
    case "scale":
      hidden.scale = 0.8;
      visible.scale = 1;
      break;
    case "fade":
    default:
      // Just opacity, already set
      break;
  }

  return { hidden, visible };
};

export function ScrollReveal({
  children,
  direction = "up",
  delay = 0,
  duration = 0.5,
  distance = 30,
  once = true,
  threshold = 0.1,
  className = "",
  as = "div",
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // If user prefers reduced motion, show immediately
    if (prefersReducedMotion) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry?.isIntersecting) {
          setIsVisible(true);
          if (once) {
            observer.unobserve(element);
          }
        } else if (!once) {
          setIsVisible(false);
        }
      },
      { threshold, rootMargin: "0px 0px -50px 0px" },
    );

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, [once, threshold, prefersReducedMotion]);

  const variants = getVariants(direction, distance);
  const MotionComponent = motion[
    as as keyof typeof motion
  ] as typeof motion.div;

  // If reduced motion, render without animation
  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <MotionComponent
      ref={ref}
      initial="hidden"
      animate={isVisible ? "visible" : "hidden"}
      variants={variants}
      transition={{
        duration,
        delay,
        ease: [0.25, 0.1, 0.25, 1], // Custom easing
      }}
      className={className}
    >
      {children}
    </MotionComponent>
  );
}

// Staggered children animation container
interface StaggerContainerProps {
  children: ReactNode;
  staggerDelay?: number;
  className?: string;
}

export function StaggerContainer({
  children,
  staggerDelay = 0.1,
  className = "",
}: StaggerContainerProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    if (prefersReducedMotion) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry?.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(element);
        }
      },
      { threshold: 0.1 },
    );

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, [prefersReducedMotion]);

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isVisible ? "visible" : "hidden"}
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: staggerDelay,
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Individual stagger item
interface StaggerItemProps {
  children: ReactNode;
  direction?: RevealDirection;
  distance?: number;
  className?: string;
}

export function StaggerItem({
  children,
  direction = "up",
  distance = 20,
  className = "",
}: StaggerItemProps) {
  const variants = getVariants(direction, distance);

  return (
    <motion.div
      variants={variants}
      transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
