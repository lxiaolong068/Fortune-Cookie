/**
 * Modern Hero Background Decorations
 *
 * Updated with modern Indigo/Purple color scheme and blob animations.
 * CSS-only animations to avoid impacting LCP while adding visual interest.
 */

export function HeroDecorations() {
  return (
    <div
      className="absolute inset-0 overflow-hidden pointer-events-none"
      aria-hidden="true"
    >
      {/* Large animated gradient blobs */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-gradient-to-br from-indigo-300/30 to-purple-300/20 dark:from-indigo-500/20 dark:to-purple-500/10 rounded-full blur-3xl animate-blob" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-gradient-to-br from-orange-200/25 to-amber-200/15 dark:from-orange-500/15 dark:to-amber-500/10 rounded-full blur-3xl animate-blob animation-delay-2000" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-gradient-to-br from-purple-200/20 to-pink-200/10 dark:from-purple-500/15 dark:to-pink-500/10 rounded-full blur-3xl animate-blob animation-delay-4000" />

      {/* Floating sparkle decorations */}
      <svg
        className="absolute top-[15%] right-[20%] w-8 h-8 text-indigo-400/50 dark:text-indigo-300/40 animate-sparkle-float"
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
      </svg>
      <svg
        className="absolute bottom-[25%] left-[15%] w-5 h-5 text-purple-400/40 dark:text-purple-300/30 animate-sparkle-float"
        style={{ animationDelay: "1s" }}
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
      </svg>
      <svg
        className="absolute top-[35%] left-[10%] w-6 h-6 text-orange-400/40 dark:text-orange-300/30 animate-sparkle-float"
        style={{ animationDelay: "0.5s" }}
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
      </svg>
      <svg
        className="absolute bottom-[15%] right-[25%] w-6 h-6 text-indigo-300/50 dark:text-indigo-400/30 animate-sparkle-float"
        style={{ animationDelay: "1.5s" }}
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
      </svg>

      {/* Small floating orbs */}
      <div className="absolute top-[20%] left-[30%] w-3 h-3 bg-indigo-400/40 dark:bg-indigo-300/30 rounded-full blur-sm animate-float" />
      <div
        className="absolute bottom-[30%] right-[15%] w-2 h-2 bg-purple-400/40 dark:bg-purple-300/30 rounded-full blur-sm animate-float"
        style={{ animationDelay: "1s" }}
      />
      <div
        className="absolute top-[60%] left-[8%] w-4 h-4 bg-orange-300/30 dark:bg-orange-400/20 rounded-full blur-sm animate-float"
        style={{ animationDelay: "2s" }}
      />

      {/* Subtle decorative lines */}
      <div className="absolute top-[8%] left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-300/30 dark:via-indigo-400/20 to-transparent" />
      <div className="absolute bottom-[8%] left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-300/30 dark:via-purple-400/20 to-transparent" />

      {/* Corner accents */}
      <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-indigo-200/20 to-transparent dark:from-indigo-500/10" />
      <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-tl from-purple-200/20 to-transparent dark:from-purple-500/10" />
    </div>
  );
}

/**
 * Mini floating elements that can be placed around content
 */
export function FloatingElement({
  className = "",
  size = "md",
  color = "indigo",
  delay = 0,
}: {
  className?: string;
  size?: "sm" | "md" | "lg";
  color?: "indigo" | "purple" | "orange" | "amber";
  delay?: number;
}) {
  const sizeClasses = {
    sm: "w-2 h-2",
    md: "w-3 h-3",
    lg: "w-4 h-4",
  };

  const colorClasses = {
    indigo: "bg-indigo-400/60 dark:bg-indigo-300/40",
    purple: "bg-purple-400/60 dark:bg-purple-300/40",
    orange: "bg-orange-400/60 dark:bg-orange-300/40",
    amber: "bg-amber-400/60 dark:bg-amber-300/40",
  };

  return (
    <div
      className={`rounded-full ${sizeClasses[size]} ${colorClasses[color]} blur-sm animate-float ${className}`}
      style={{ animationDelay: `${delay}s` }}
      aria-hidden="true"
    />
  );
}

/**
 * Modern Section Background - for use in content sections
 */
export function SectionBackground({
  variant = "default",
  className = "",
}: {
  variant?: "default" | "subtle" | "accent";
  className?: string;
}) {
  const variants = {
    default:
      "from-slate-50 via-white to-indigo-50/30 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-950/30",
    subtle: "from-white to-slate-50 dark:from-slate-900 dark:to-slate-800",
    accent:
      "from-indigo-50/50 via-white to-purple-50/50 dark:from-indigo-950/30 dark:via-slate-900 dark:to-purple-950/30",
  };

  return (
    <div
      className={`absolute inset-0 bg-gradient-to-br ${variants[variant]} ${className}`}
      aria-hidden="true"
    >
      {/* Subtle grid overlay */}
      <div className="absolute inset-0 bg-grid opacity-20 dark:opacity-10 bg-grid-fade" />
    </div>
  );
}
