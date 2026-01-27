"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { DynamicBackgroundEffects } from "@/components/DynamicBackgroundEffects";
import { pageTransition } from "@/lib/animations";

// ============================================================================
// TYPES
// ============================================================================

type BackgroundVariant = "full" | "subtle" | "minimal" | "none";

interface PageLayoutProps {
  children: ReactNode;
  /** Background animation variant */
  background?: BackgroundVariant;
  /** Enable page transition animation */
  animate?: boolean;
  /** Custom class for main container */
  className?: string;
  /** Custom class for content wrapper */
  contentClassName?: string;
  /** Use full-width layout (no container) */
  fullWidth?: boolean;
  /** Background gradient overlay */
  gradient?: "indigo" | "purple" | "amber" | "none";
  /** Fixed header offset padding */
  headerOffset?: boolean;
}

// ============================================================================
// BACKGROUND COMPONENTS
// ============================================================================

function FullBackground() {
  return <DynamicBackgroundEffects />;
}

function SubtleBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      {/* Gradient mesh */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 via-white to-purple-50/50 dark:from-indigo-950/20 dark:via-slate-900 dark:to-purple-950/20" />

      {/* Subtle grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.02] dark:opacity-[0.05]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%236366f1' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      {/* Soft glow */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-400/10 dark:bg-indigo-400/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-400/10 dark:bg-purple-400/5 rounded-full blur-3xl" />
    </div>
  );
}

function MinimalBackground() {
  return (
    <div className="fixed inset-0 -z-10 bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-950" />
  );
}

// ============================================================================
// GRADIENT OVERLAYS
// ============================================================================

const gradientStyles = {
  indigo:
    "bg-gradient-to-b from-indigo-50/80 via-white to-white dark:from-indigo-950/30 dark:via-slate-900 dark:to-slate-900",
  purple:
    "bg-gradient-to-b from-purple-50/80 via-white to-white dark:from-purple-950/30 dark:via-slate-900 dark:to-slate-900",
  amber:
    "bg-gradient-to-b from-amber-50/80 via-white to-white dark:from-amber-950/30 dark:via-slate-900 dark:to-slate-900",
  none: "",
};

// ============================================================================
// COMPONENT
// ============================================================================

/**
 * PageLayout - Consistent page layout wrapper with background effects
 *
 * Task 1.1: Unified page layout component for consistent UI across pages
 *
 * @example
 * // Full animated background (like homepage)
 * <PageLayout background="full">
 *   <PageHero title="Page Title" />
 *   <section>Content</section>
 * </PageLayout>
 *
 * @example
 * // Subtle background for content-heavy pages
 * <PageLayout background="subtle" gradient="indigo">
 *   <PageHero title="Blog" />
 *   <BlogContent />
 * </PageLayout>
 *
 * @example
 * // Minimal background for legal/static pages
 * <PageLayout background="minimal">
 *   <LegalContent />
 * </PageLayout>
 */
export function PageLayout({
  children,
  background = "subtle",
  animate = true,
  className,
  contentClassName,
  fullWidth = false,
  gradient = "none",
  headerOffset = true,
}: PageLayoutProps) {
  // Render background based on variant
  const renderBackground = () => {
    switch (background) {
      case "full":
        return <FullBackground />;
      case "subtle":
        return <SubtleBackground />;
      case "minimal":
        return <MinimalBackground />;
      case "none":
      default:
        return null;
    }
  };

  const content = (
    <div
      className={cn(
        "relative z-10",
        gradientStyles[gradient],
        contentClassName
      )}
    >
      {fullWidth ? (
        children
      ) : (
        <div className="container mx-auto px-4">{children}</div>
      )}
    </div>
  );

  return (
    <main
      className={cn(
        "min-h-screen w-full overflow-x-hidden relative",
        headerOffset && "pt-16", // Account for fixed header
        className
      )}
    >
      {renderBackground()}

      {animate ? (
        <motion.div
          variants={pageTransition}
          initial="initial"
          animate="animate"
          exit="exit"
        >
          {content}
        </motion.div>
      ) : (
        content
      )}
    </main>
  );
}

// ============================================================================
// PAGE SECTION
// ============================================================================

interface PageSectionProps {
  children: ReactNode;
  className?: string;
  /** Background style */
  bg?: "white" | "gray" | "gradient" | "transparent";
  /** Padding size */
  padding?: "sm" | "md" | "lg" | "xl";
  /** Section ID for anchor links */
  id?: string;
}

const sectionBgStyles = {
  white: "bg-white dark:bg-slate-900",
  gray: "bg-slate-50 dark:bg-slate-800/50",
  gradient:
    "bg-gradient-to-b from-indigo-50/50 to-white dark:from-indigo-950/20 dark:to-slate-900",
  transparent: "bg-transparent",
};

const sectionPaddingStyles = {
  sm: "py-8 md:py-12",
  md: "py-12 md:py-16",
  lg: "py-16 md:py-24",
  xl: "py-24 md:py-32",
};

export function PageSection({
  children,
  className,
  bg = "transparent",
  padding = "md",
  id,
}: PageSectionProps) {
  return (
    <section
      id={id}
      className={cn(
        "relative",
        sectionBgStyles[bg],
        sectionPaddingStyles[padding],
        className
      )}
    >
      <div className="container mx-auto px-4">{children}</div>
    </section>
  );
}

// ============================================================================
// DIVIDERS
// ============================================================================

interface SectionDividerProps {
  className?: string;
  variant?: "wave" | "curve" | "line";
  color?: string;
}

export function SectionDivider({
  className,
  variant = "line",
  color = "border-slate-100 dark:border-slate-800",
}: SectionDividerProps) {
  if (variant === "line") {
    return (
      <div className={cn("border-t", color, className)} aria-hidden="true" />
    );
  }

  // Wave and curve variants use SVG
  return (
    <div className={cn("w-full overflow-hidden", className)} aria-hidden="true">
      <svg
        viewBox="0 0 1200 120"
        preserveAspectRatio="none"
        className="w-full h-12 md:h-16"
      >
        {variant === "wave" ? (
          <path
            d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
            className="fill-white dark:fill-slate-900"
          />
        ) : (
          <path
            d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z"
            className="fill-white dark:fill-slate-900"
          />
        )}
      </svg>
    </div>
  );
}

// ============================================================================
// EXPORTS
// ============================================================================

export type { PageLayoutProps, PageSectionProps, BackgroundVariant };
