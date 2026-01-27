"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { fadeInUp, fadeInDown, staggerContainer } from "@/lib/animations";

// ============================================================================
// TYPES
// ============================================================================

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface CTAButton {
  label: string;
  href: string;
  variant?: "primary" | "secondary" | "outline";
  icon?: LucideIcon;
}

interface PageHeroProps {
  /** Page title */
  title: string;
  /** Optional subtitle (smaller text above title) */
  subtitle?: string;
  /** Description text below title */
  description?: string;
  /** Icon to display (Lucide icon component) */
  icon?: LucideIcon;
  /** Custom icon element (for more complex icons) */
  customIcon?: ReactNode;
  /** Gradient colors for icon background */
  iconGradient?: {
    from: string;
    to: string;
  };
  /** Breadcrumb navigation items */
  breadcrumbs?: BreadcrumbItem[];
  /** Call-to-action buttons */
  cta?: CTAButton[];
  /** Additional content below description */
  children?: ReactNode;
  /** Text alignment */
  align?: "left" | "center" | "right";
  /** Size variant */
  size?: "sm" | "md" | "lg";
  /** Custom class names */
  className?: string;
  /** Container class names */
  containerClassName?: string;
  /** Enable gradient text on title */
  gradientTitle?: boolean;
  /** Badge/tag content */
  badge?: ReactNode;
}

// ============================================================================
// STYLES
// ============================================================================

const alignStyles = {
  left: "text-left items-start",
  center: "text-center items-center",
  right: "text-right items-end",
};

const sizeStyles = {
  sm: {
    container: "py-8 md:py-12",
    title: "text-2xl md:text-3xl",
    description: "text-base max-w-xl",
    icon: "w-12 h-12",
    iconContainer: "p-3",
  },
  md: {
    container: "py-12 md:py-16",
    title: "text-3xl md:text-4xl lg:text-5xl",
    description: "text-lg max-w-2xl",
    icon: "w-14 h-14",
    iconContainer: "p-4",
  },
  lg: {
    container: "py-16 md:py-24",
    title: "text-4xl md:text-5xl lg:text-6xl",
    description: "text-xl max-w-3xl",
    icon: "w-16 h-16",
    iconContainer: "p-5",
  },
};

// ============================================================================
// COMPONENT
// ============================================================================

/**
 * PageHero - Consistent hero section for all pages
 *
 * Task 1.2: Unified page hero component matching homepage design
 *
 * @example
 * // Basic usage
 * <PageHero
 *   title="Explore Fortunes"
 *   description="Browse and search fortune cookie messages"
 *   icon={Search}
 * />
 *
 * @example
 * // With breadcrumbs and CTA
 * <PageHero
 *   title="Blog"
 *   description="Discover wisdom and insights"
 *   breadcrumbs={[{ label: "Home", href: "/" }, { label: "Blog" }]}
 *   cta={[{ label: "Subscribe", href: "/subscribe", variant: "primary" }]}
 * />
 */
export function PageHero({
  title,
  subtitle,
  description,
  icon: Icon,
  customIcon,
  iconGradient = { from: "from-indigo-500", to: "to-purple-500" },
  breadcrumbs,
  cta,
  children,
  align = "center",
  size = "md",
  className,
  containerClassName,
  gradientTitle = false,
  badge,
}: PageHeroProps) {
  const styles = sizeStyles[size];

  return (
    <section
      className={cn(
        "relative overflow-hidden",
        styles.container,
        containerClassName,
      )}
    >
      <div className={cn("container mx-auto px-4", className)}>
        <motion.div
          className={cn("flex flex-col", alignStyles[align])}
          variants={staggerContainer(0.1, 0)}
          initial="hidden"
          animate="visible"
        >
          {/* Breadcrumbs */}
          {breadcrumbs && breadcrumbs.length > 0 && (
            <motion.nav
              variants={fadeInDown}
              className="mb-4 md:mb-6"
              aria-label="Breadcrumb"
            >
              <ol className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                {breadcrumbs.map((item, index) => (
                  <li key={index} className="flex items-center gap-2">
                    {index > 0 && (
                      <span className="text-slate-300 dark:text-slate-600">
                        /
                      </span>
                    )}
                    {item.href ? (
                      <Link
                        href={item.href}
                        className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                      >
                        {item.label}
                      </Link>
                    ) : (
                      <span className="text-slate-700 dark:text-slate-200 font-medium">
                        {item.label}
                      </span>
                    )}
                  </li>
                ))}
              </ol>
            </motion.nav>
          )}

          {/* Badge */}
          {badge && (
            <motion.div variants={fadeInDown} className="mb-4">
              {badge}
            </motion.div>
          )}

          {/* Icon */}
          {(Icon || customIcon) && (
            <motion.div
              variants={fadeInUp}
              className={cn(
                "rounded-2xl bg-gradient-to-br shadow-lg shadow-indigo-500/20 mb-6",
                iconGradient.from,
                iconGradient.to,
                styles.iconContainer,
              )}
            >
              {customIcon ||
                (Icon && <Icon className={cn("text-white", styles.icon)} />)}
            </motion.div>
          )}

          {/* Subtitle */}
          {subtitle && (
            <motion.p
              variants={fadeInUp}
              className="text-indigo-600 dark:text-indigo-400 font-medium mb-2 uppercase tracking-wide text-sm"
            >
              {subtitle}
            </motion.p>
          )}

          {/* Title */}
          <motion.h1
            variants={fadeInUp}
            className={cn(
              "font-heading font-bold leading-tight mb-4",
              styles.title,
              gradientTitle
                ? "bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent"
                : "text-slate-800 dark:text-white",
            )}
          >
            {title}
          </motion.h1>

          {/* Description */}
          {description && (
            <motion.p
              variants={fadeInUp}
              className={cn(
                "text-slate-600 dark:text-slate-300 leading-relaxed",
                styles.description,
                align === "center" && "mx-auto",
              )}
            >
              {description}
            </motion.p>
          )}

          {/* CTA Buttons */}
          {cta && cta.length > 0 && (
            <motion.div
              variants={fadeInUp}
              className="flex flex-wrap gap-4 mt-8"
            >
              {cta.map((button, index) => {
                const ButtonIcon = button.icon;
                return (
                  <Link
                    key={index}
                    href={button.href}
                    className={cn(
                      "inline-flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-300",
                      button.variant === "primary" &&
                        "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/25 hover:-translate-y-0.5 hover:shadow-xl",
                      button.variant === "secondary" &&
                        "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:-translate-y-0.5 hover:shadow-lg",
                      button.variant === "outline" &&
                        "bg-transparent text-indigo-600 dark:text-indigo-400 border-2 border-indigo-600 dark:border-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/50",
                    )}
                  >
                    {ButtonIcon && <ButtonIcon className="w-5 h-5" />}
                    {button.label}
                  </Link>
                );
              })}
            </motion.div>
          )}

          {/* Additional Content */}
          {children && (
            <motion.div variants={fadeInUp} className="mt-8 w-full">
              {children}
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  );
}

// ============================================================================
// HERO BADGE
// ============================================================================

interface HeroBadgeProps {
  children: ReactNode;
  icon?: LucideIcon;
  className?: string;
}

export function HeroBadge({ children, icon: Icon, className }: HeroBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 px-4 py-2 rounded-full",
        "bg-indigo-100 dark:bg-indigo-900/50",
        "text-indigo-700 dark:text-indigo-300",
        "text-sm font-medium",
        "border border-indigo-200 dark:border-indigo-800",
        className,
      )}
    >
      {Icon && <Icon className="w-4 h-4" />}
      {children}
    </span>
  );
}

// ============================================================================
// HERO STATS
// ============================================================================

interface HeroStat {
  value: string | number;
  label: string;
}

interface HeroStatsProps {
  stats: HeroStat[];
  className?: string;
}

export function HeroStats({ stats, className }: HeroStatsProps) {
  return (
    <div
      className={cn("flex flex-wrap justify-center gap-8 md:gap-12", className)}
    >
      {stats.map((stat, index) => (
        <div key={index} className="text-center">
          <div className="text-3xl md:text-4xl font-bold text-indigo-600 dark:text-indigo-400">
            {stat.value}
          </div>
          <div className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            {stat.label}
          </div>
        </div>
      ))}
    </div>
  );
}

// ============================================================================
// EXPORTS
// ============================================================================

export type { PageHeroProps, BreadcrumbItem, CTAButton };
