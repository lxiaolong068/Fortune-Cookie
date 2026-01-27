/**
 * Unified Animation Configuration
 * Task 1.4: Centralized Framer Motion animation presets
 *
 * Usage:
 * import { fadeInUp, staggerContainer, pageTransition } from '@/lib/animations'
 */

import { Variants, Transition } from "framer-motion";

// ============================================================================
// EASING PRESETS
// ============================================================================

export const easings = {
  // Smooth easing for most animations
  smooth: [0.25, 0.1, 0.25, 1] as const,
  // Bouncy easing for playful interactions
  bounce: [0.68, -0.55, 0.265, 1.55] as const,
  // Quick snap for UI feedback
  snap: [0.23, 1, 0.32, 1] as const,
  // Gentle ease for subtle animations
  gentle: [0.4, 0, 0.2, 1] as const,
  // Spring-like easing
  spring: [0.175, 0.885, 0.32, 1.275] as const,
} as const;

// ============================================================================
// DURATION PRESETS
// ============================================================================

export const durations = {
  fast: 0.15,
  normal: 0.3,
  medium: 0.5,
  slow: 0.7,
  slower: 1,
} as const;

// ============================================================================
// FADE ANIMATIONS
// ============================================================================

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: durations.normal, ease: easings.smooth },
  },
};

export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: durations.medium, ease: easings.smooth },
  },
};

export const fadeInDown: Variants = {
  hidden: { opacity: 0, y: -20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: durations.medium, ease: easings.smooth },
  },
};

export const fadeInLeft: Variants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: durations.medium, ease: easings.smooth },
  },
};

export const fadeInRight: Variants = {
  hidden: { opacity: 0, x: 20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: durations.medium, ease: easings.smooth },
  },
};

// ============================================================================
// SCALE ANIMATIONS
// ============================================================================

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: durations.normal, ease: easings.smooth },
  },
};

export const scaleInBounce: Variants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: durations.medium, ease: easings.bounce },
  },
};

export const popIn: Variants = {
  hidden: { opacity: 0, scale: 0.5 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: durations.normal, ease: easings.spring },
  },
};

// ============================================================================
// SLIDE ANIMATIONS
// ============================================================================

export const slideInUp: Variants = {
  hidden: { y: 40, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: durations.medium, ease: easings.smooth },
  },
  exit: {
    y: -20,
    opacity: 0,
    transition: { duration: durations.fast, ease: easings.smooth },
  },
};

export const slideInDown: Variants = {
  hidden: { y: -40, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: durations.medium, ease: easings.smooth },
  },
  exit: {
    y: 20,
    opacity: 0,
    transition: { duration: durations.fast, ease: easings.smooth },
  },
};

export const slideInLeft: Variants = {
  hidden: { x: -40, opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: { duration: durations.medium, ease: easings.smooth },
  },
  exit: {
    x: 20,
    opacity: 0,
    transition: { duration: durations.fast, ease: easings.smooth },
  },
};

export const slideInRight: Variants = {
  hidden: { x: 40, opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: { duration: durations.medium, ease: easings.smooth },
  },
  exit: {
    x: -20,
    opacity: 0,
    transition: { duration: durations.fast, ease: easings.smooth },
  },
};

// ============================================================================
// STAGGER CONTAINERS
// ============================================================================

export const staggerContainer = (
  staggerDelay = 0.1,
  delayChildren = 0,
): Variants => ({
  hidden: {},
  visible: {
    transition: {
      staggerChildren: staggerDelay,
      delayChildren,
    },
  },
});

export const staggerContainerFast: Variants = staggerContainer(0.05);
export const staggerContainerNormal: Variants = staggerContainer(0.1);
export const staggerContainerSlow: Variants = staggerContainer(0.15);

// ============================================================================
// STAGGER ITEMS
// ============================================================================

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: durations.normal, ease: easings.smooth },
  },
};

export const staggerItemLeft: Variants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: durations.normal, ease: easings.smooth },
  },
};

export const staggerItemRight: Variants = {
  hidden: { opacity: 0, x: 20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: durations.normal, ease: easings.smooth },
  },
};

export const staggerItemScale: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: durations.normal, ease: easings.smooth },
  },
};

// ============================================================================
// HOVER ANIMATIONS
// ============================================================================

export const hoverScale = {
  scale: 1.02,
  transition: { duration: durations.fast, ease: easings.smooth },
};

export const hoverScaleLarge = {
  scale: 1.05,
  transition: { duration: durations.fast, ease: easings.smooth },
};

export const hoverLift = {
  y: -4,
  transition: { duration: durations.fast, ease: easings.smooth },
};

export const hoverGlow = {
  boxShadow: "0 0 30px rgba(79, 70, 229, 0.3)",
  transition: { duration: durations.normal, ease: easings.smooth },
};

// ============================================================================
// TAP ANIMATIONS
// ============================================================================

export const tapScale = {
  scale: 0.98,
  transition: { duration: durations.fast, ease: easings.snap },
};

export const tapScaleSmall = {
  scale: 0.95,
  transition: { duration: durations.fast, ease: easings.snap },
};

// ============================================================================
// PAGE TRANSITIONS
// ============================================================================

export const pageTransition: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: durations.medium, ease: easings.smooth },
  },
  exit: {
    opacity: 0,
    y: -10,
    transition: { duration: durations.fast, ease: easings.smooth },
  },
};

// ============================================================================
// CARD ANIMATIONS
// ============================================================================

export const cardHover: Variants = {
  rest: {
    scale: 1,
    y: 0,
    boxShadow:
      "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
  },
  hover: {
    scale: 1.02,
    y: -4,
    boxShadow:
      "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
    transition: { duration: durations.normal, ease: easings.smooth },
  },
};

export const cardTap = {
  scale: 0.98,
  transition: { duration: durations.fast, ease: easings.snap },
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Create custom fade animation with configurable direction and distance
 */
export function createFadeAnimation(
  direction: "up" | "down" | "left" | "right" | "none" = "up",
  distance = 20,
  duration = durations.medium,
): Variants {
  const hidden: Record<string, number> = { opacity: 0 };
  const visible: Record<string, number> = { opacity: 1 };

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
  }

  return {
    hidden,
    visible: {
      ...visible,
      transition: { duration, ease: easings.smooth },
    },
  };
}

/**
 * Create stagger container with custom timing
 */
export function createStaggerContainer(
  staggerDelay = 0.1,
  delayChildren = 0,
): Variants {
  return {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: staggerDelay,
        delayChildren,
      },
    },
  };
}

/**
 * Get transition config for consistent timing
 */
export function getTransition(
  duration: keyof typeof durations = "normal",
  easing: keyof typeof easings = "smooth",
): Transition {
  return {
    duration: durations[duration],
    ease: easings[easing],
  };
}

// ============================================================================
// REDUCED MOTION UTILITIES
// ============================================================================

/**
 * Returns null variants for reduced motion preference
 */
export const reducedMotionVariants: Variants = {
  hidden: {},
  visible: {},
};

/**
 * Get variants respecting reduced motion preference
 * Usage: const variants = getAccessibleVariants(fadeInUp, prefersReducedMotion)
 */
export function getAccessibleVariants(
  variants: Variants,
  prefersReducedMotion: boolean | null,
): Variants {
  if (prefersReducedMotion) {
    return reducedMotionVariants;
  }
  return variants;
}
