"use client";

import { ReactNode, forwardRef, ComponentPropsWithoutRef } from "react";
import { motion, HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";
import { cardHover, cardTap } from "@/lib/animations";

// ============================================================================
// TYPES
// ============================================================================

export type CardVariant = "default" | "glass" | "gradient" | "feature" | "stat";

interface ModernCardProps extends Omit<HTMLMotionProps<"div">, "children"> {
  children: ReactNode;
  variant?: CardVariant;
  /** Enable hover animation */
  hoverable?: boolean;
  /** Custom gradient colors (for gradient variant) */
  gradientFrom?: string;
  gradientTo?: string;
  /** Custom background color */
  bgColor?: string;
  /** Custom border color */
  borderColor?: string;
  /** Disable padding */
  noPadding?: boolean;
  /** Card size */
  size?: "sm" | "md" | "lg";
}

// ============================================================================
// VARIANT STYLES
// ============================================================================

const variantStyles: Record<CardVariant, string> = {
  default: cn(
    "bg-white dark:bg-slate-800",
    "border border-slate-100 dark:border-slate-700",
    "shadow-sm"
  ),
  glass: cn(
    "bg-white/70 dark:bg-slate-900/70",
    "backdrop-blur-xl backdrop-saturate-150",
    "border border-white/20 dark:border-slate-700/50",
    "shadow-lg shadow-indigo-500/5"
  ),
  gradient: cn(
    "bg-gradient-to-br",
    "border border-transparent",
    "shadow-lg"
  ),
  feature: cn(
    "bg-white dark:bg-slate-800",
    "border border-slate-100 dark:border-slate-700",
    "shadow-lg shadow-indigo-500/5"
  ),
  stat: cn(
    "bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/50 dark:to-purple-950/50",
    "border border-indigo-100/50 dark:border-indigo-800/30",
    "shadow-sm"
  ),
};

const sizeStyles: Record<"sm" | "md" | "lg", string> = {
  sm: "p-4 rounded-xl",
  md: "p-6 rounded-2xl",
  lg: "p-8 rounded-3xl",
};

// ============================================================================
// COMPONENT
// ============================================================================

/**
 * ModernCard - A versatile card component with multiple variants
 *
 * Task 1.3: Unified card component for consistent UI across pages
 *
 * @example
 * // Default card
 * <ModernCard>Content</ModernCard>
 *
 * @example
 * // Glass card with hover
 * <ModernCard variant="glass" hoverable>Content</ModernCard>
 *
 * @example
 * // Gradient card
 * <ModernCard variant="gradient" gradientFrom="from-indigo-500" gradientTo="to-purple-500">
 *   Content
 * </ModernCard>
 */
export const ModernCard = forwardRef<HTMLDivElement, ModernCardProps>(
  (
    {
      children,
      variant = "default",
      hoverable = false,
      gradientFrom = "from-indigo-500",
      gradientTo = "to-purple-500",
      bgColor,
      borderColor,
      noPadding = false,
      size = "md",
      className,
      ...props
    },
    ref
  ) => {
    const baseStyles = cn(
      "relative overflow-hidden transition-all duration-300",
      !noPadding && sizeStyles[size],
      variantStyles[variant],
      // Apply custom gradient colors for gradient variant
      variant === "gradient" && `${gradientFrom} ${gradientTo}`,
      // Apply custom colors if provided
      bgColor,
      borderColor,
      className
    );

    if (hoverable) {
      return (
        <motion.div
          ref={ref}
          className={cn(baseStyles, "cursor-pointer")}
          initial="rest"
          whileHover="hover"
          whileTap={cardTap}
          variants={cardHover}
          {...props}
        >
          {children}
        </motion.div>
      );
    }

    return (
      <motion.div ref={ref} className={baseStyles} {...props}>
        {children}
      </motion.div>
    );
  }
);

ModernCard.displayName = "ModernCard";

// ============================================================================
// SUB-COMPONENTS
// ============================================================================

interface CardHeaderProps extends ComponentPropsWithoutRef<"div"> {
  children: ReactNode;
}

export function ModernCardHeader({
  children,
  className,
  ...props
}: CardHeaderProps) {
  return (
    <div className={cn("mb-4", className)} {...props}>
      {children}
    </div>
  );
}

interface CardTitleProps extends ComponentPropsWithoutRef<"h3"> {
  children: ReactNode;
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
}

export function ModernCardTitle({
  children,
  as: Component = "h3",
  className,
  ...props
}: CardTitleProps) {
  return (
    <Component
      className={cn(
        "font-heading font-semibold text-slate-800 dark:text-white",
        "text-lg md:text-xl",
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
}

interface CardDescriptionProps extends ComponentPropsWithoutRef<"p"> {
  children: ReactNode;
}

export function ModernCardDescription({
  children,
  className,
  ...props
}: CardDescriptionProps) {
  return (
    <p
      className={cn(
        "text-slate-600 dark:text-slate-300 text-sm md:text-base",
        className
      )}
      {...props}
    >
      {children}
    </p>
  );
}

interface CardContentProps extends ComponentPropsWithoutRef<"div"> {
  children: ReactNode;
}

export function ModernCardContent({
  children,
  className,
  ...props
}: CardContentProps) {
  return (
    <div className={cn("", className)} {...props}>
      {children}
    </div>
  );
}

interface CardFooterProps extends ComponentPropsWithoutRef<"div"> {
  children: ReactNode;
}

export function ModernCardFooter({
  children,
  className,
  ...props
}: CardFooterProps) {
  return (
    <div className={cn("mt-4 pt-4 border-t border-slate-100 dark:border-slate-700", className)} {...props}>
      {children}
    </div>
  );
}

// ============================================================================
// ICON CONTAINER
// ============================================================================

interface CardIconProps extends ComponentPropsWithoutRef<"div"> {
  children: ReactNode;
  gradientFrom?: string;
  gradientTo?: string;
  size?: "sm" | "md" | "lg";
}

export function ModernCardIcon({
  children,
  gradientFrom = "from-indigo-500",
  gradientTo = "to-purple-500",
  size = "md",
  className,
  ...props
}: CardIconProps) {
  const sizeClasses = {
    sm: "p-2 rounded-lg",
    md: "p-3 rounded-xl",
    lg: "p-4 rounded-2xl",
  };

  return (
    <div
      className={cn(
        "bg-gradient-to-br shadow-lg",
        gradientFrom,
        gradientTo,
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

// ============================================================================
// EXPORTS
// ============================================================================

export {
  ModernCardHeader as CardHeader,
  ModernCardTitle as CardTitle,
  ModernCardDescription as CardDescription,
  ModernCardContent as CardContent,
  ModernCardFooter as CardFooter,
  ModernCardIcon as CardIcon,
};
