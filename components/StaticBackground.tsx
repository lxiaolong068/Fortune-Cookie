"use client";

/**
 * Static Background Component
 * Lightweight fallback for BackgroundEffects when animations are disabled
 * or when performance optimization is needed
 */
export function StaticBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {/* Static gradient background */}
      <div className="absolute inset-0 bg-gradient-radial from-yellow-200/10 via-amber-200/5 to-transparent" />
      
      {/* Subtle static light rays */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-radial from-yellow-200/15 via-amber-200/8 to-transparent rounded-full blur-3xl opacity-60" />
      
      {/* Additional static elements for visual interest */}
      <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-gradient-radial from-amber-300/5 to-transparent rounded-full blur-2xl" />
      <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-gradient-radial from-yellow-300/5 to-transparent rounded-full blur-2xl" />
      <div className="absolute top-3/4 left-3/4 w-24 h-24 bg-gradient-radial from-orange-300/5 to-transparent rounded-full blur-xl" />
    </div>
  );
}
