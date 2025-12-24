/**
 * Hero Background Decorations
 *
 * Subtle, CSS-only decorative elements for the hero area.
 * Uses CSS animations to avoid impacting LCP while adding visual interest.
 */

export function HeroDecorations() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {/* Floating circles */}
      <div className="hero-float-slow absolute top-[10%] left-[10%] w-20 h-20 rounded-full bg-gradient-to-br from-amber-200/30 to-yellow-300/20 blur-xl" />
      <div className="hero-float-medium absolute top-[20%] right-[15%] w-16 h-16 rounded-full bg-gradient-to-br from-orange-200/30 to-amber-300/20 blur-xl" />
      <div className="hero-float-fast absolute bottom-[25%] left-[20%] w-12 h-12 rounded-full bg-gradient-to-br from-yellow-200/40 to-orange-200/20 blur-lg" />
      <div className="hero-float-slow absolute bottom-[15%] right-[10%] w-24 h-24 rounded-full bg-gradient-to-br from-amber-100/30 to-yellow-200/20 blur-xl" />

      {/* Sparkle decorations */}
      <svg
        className="hero-sparkle absolute top-[15%] right-[25%] w-6 h-6 text-amber-300/50"
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
      </svg>
      <svg
        className="hero-sparkle-delay absolute bottom-[30%] left-[15%] w-4 h-4 text-yellow-400/40"
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
      </svg>
      <svg
        className="hero-sparkle absolute top-[40%] left-[8%] w-5 h-5 text-orange-300/40"
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
      </svg>
      <svg
        className="hero-sparkle-delay absolute bottom-[20%] right-[20%] w-5 h-5 text-amber-400/40"
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
      </svg>

      {/* Subtle gradient orbs */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-radial from-amber-200/10 to-transparent rounded-full blur-3xl hero-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-gradient-radial from-orange-200/10 to-transparent rounded-full blur-3xl hero-pulse-delay" />

      {/* Decorative lines */}
      <div className="absolute top-[5%] left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-300/20 to-transparent" />
      <div className="absolute bottom-[5%] left-0 right-0 h-px bg-gradient-to-r from-transparent via-orange-300/20 to-transparent" />
    </div>
  );
}

/**
 * Mini floating elements that can be placed around content
 */
export function FloatingElement({
  className = "",
  size = "md",
  color = "amber",
  delay = 0,
}: {
  className?: string;
  size?: "sm" | "md" | "lg";
  color?: "amber" | "orange" | "yellow";
  delay?: number;
}) {
  const sizeClasses = {
    sm: "w-2 h-2",
    md: "w-3 h-3",
    lg: "w-4 h-4",
  };

  const colorClasses = {
    amber: "bg-amber-400/60",
    orange: "bg-orange-400/60",
    yellow: "bg-yellow-400/60",
  };

  return (
    <div
      className={`rounded-full ${sizeClasses[size]} ${colorClasses[color]} blur-sm hero-float-slow ${className}`}
      style={{ animationDelay: `${delay}s` }}
      aria-hidden="true"
    />
  );
}
