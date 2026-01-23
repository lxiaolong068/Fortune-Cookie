import { headers } from "next/headers";
import { i18n, isValidLocale } from "@/lib/i18n-config";
import { getTranslation, loadTranslations } from "@/lib/translations";

/**
 * Modern Static LCP Component - Server-Side Rendered
 *
 * This component renders the critical LCP (Largest Contentful Paint) elements
 * server-side with a modern, visually appealing design.
 *
 * Design updates:
 * - Modern 3D-style fortune cookie SVG with paper slip
 * - Indigo-based gradient background with floating blobs
 * - Fredoka/Nunito typography
 * - Subtle animations (CSS-only for performance)
 *
 * Expected LCP improvement maintained: < 2.5s
 */
export async function FortuneCookieStatic() {
  const requestHeaders = headers();
  const headerLocale = requestHeaders.get("x-locale") ?? "";
  const locale = isValidLocale(headerLocale)
    ? headerLocale
    : i18n.defaultLocale;
  const translations = await loadTranslations(locale);
  const t = (key: string) => getTranslation(translations, key);

  return (
    <section
      className="fortune-cookie-lcp relative flex flex-col items-center justify-center min-h-screen p-6 overflow-hidden"
      style={{ contentVisibility: "auto" }}
      aria-label={t("home.experienceLabel")}
    >
      {/* Modern Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-950" />

      {/* Animated Gradient Blobs */}
      <div
        className="absolute inset-0 overflow-hidden pointer-events-none"
        aria-hidden="true"
      >
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-200/40 dark:bg-indigo-500/20 rounded-full blur-3xl animate-blob" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-orange-200/30 dark:bg-orange-500/15 rounded-full blur-3xl animate-blob animation-delay-2000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-purple-200/30 dark:bg-purple-500/15 rounded-full blur-3xl animate-blob animation-delay-4000" />
      </div>

      {/* Grid Pattern Overlay */}
      <div
        className="absolute inset-0 bg-grid opacity-30 dark:opacity-20 bg-grid-fade pointer-events-none"
        aria-hidden="true"
      />

      <div className="w-full max-w-2xl min-h-[600px] flex flex-col items-center justify-center relative z-10">
        {/* LCP Element: Modern 3D Cookie Visual */}
        <div className="fortune-cookie-static w-48 h-48 flex items-center justify-center mb-8 animate-cookie-float">
          <div className="relative cursor-pointer group">
            {/* Glow effect behind cookie */}
            <div
              className="absolute inset-0 bg-gradient-radial from-amber-300/50 via-orange-300/30 to-transparent blur-2xl scale-150 group-hover:scale-175 transition-transform duration-500"
              aria-hidden="true"
            />

            {/* Modern Fortune Cookie SVG */}
            <svg
              viewBox="0 0 200 140"
              className="w-48 h-36 relative z-10 drop-shadow-2xl animate-cookie-glow"
              aria-label="Fortune Cookie"
            >
              <defs>
                {/* Cookie gradient */}
                <linearGradient
                  id="cookieGradient"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="100%"
                >
                  <stop offset="0%" stopColor="#FDE68A" />
                  <stop offset="30%" stopColor="#FBBF24" />
                  <stop offset="60%" stopColor="#F59E0B" />
                  <stop offset="100%" stopColor="#D97706" />
                </linearGradient>

                {/* Inner shadow gradient */}
                <linearGradient
                  id="innerShadow"
                  x1="0%"
                  y1="0%"
                  x2="0%"
                  y2="100%"
                >
                  <stop offset="0%" stopColor="#92400E" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#92400E" stopOpacity="0" />
                </linearGradient>

                {/* Paper gradient */}
                <linearGradient
                  id="paperGradient"
                  x1="0%"
                  y1="0%"
                  x2="0%"
                  y2="100%"
                >
                  <stop offset="0%" stopColor="#FFFBEB" />
                  <stop offset="100%" stopColor="#FEF3C7" />
                </linearGradient>

                {/* Drop shadow filter */}
                <filter
                  id="cookieShadow"
                  x="-20%"
                  y="-20%"
                  width="140%"
                  height="140%"
                >
                  <feDropShadow
                    dx="0"
                    dy="8"
                    stdDeviation="12"
                    floodColor="#92400E"
                    floodOpacity="0.25"
                  />
                </filter>

                {/* Subtle inner shadow */}
                <filter id="innerGlow">
                  <feGaussianBlur stdDeviation="2" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {/* Cookie shadow on surface */}
              <ellipse
                cx="100"
                cy="130"
                rx="60"
                ry="8"
                fill="rgba(0,0,0,0.1)"
                className="blur-sm"
              />

              {/* Main cookie body - folded fortune cookie shape */}
              <g filter="url(#cookieShadow)">
                {/* Left half of cookie */}
                <path
                  d="M25 70
                     C25 40, 55 15, 100 20
                     C100 50, 85 70, 100 75
                     C60 75, 40 60, 25 70Z"
                  fill="url(#cookieGradient)"
                />

                {/* Right half of cookie */}
                <path
                  d="M175 70
                     C175 40, 145 15, 100 20
                     C100 50, 115 70, 100 75
                     C140 75, 160 60, 175 70Z"
                  fill="url(#cookieGradient)"
                />

                {/* Cookie fold line detail */}
                <path
                  d="M100 20 C100 50, 100 60, 100 75"
                  stroke="#B45309"
                  strokeWidth="2"
                  strokeOpacity="0.3"
                  fill="none"
                />

                {/* Texture lines on left */}
                <path
                  d="M40 55 Q60 45, 80 50"
                  stroke="#B45309"
                  strokeWidth="1"
                  strokeOpacity="0.15"
                  fill="none"
                />
                <path
                  d="M50 65 Q65 58, 85 62"
                  stroke="#B45309"
                  strokeWidth="1"
                  strokeOpacity="0.1"
                  fill="none"
                />

                {/* Texture lines on right */}
                <path
                  d="M160 55 Q140 45, 120 50"
                  stroke="#B45309"
                  strokeWidth="1"
                  strokeOpacity="0.15"
                  fill="none"
                />
                <path
                  d="M150 65 Q135 58, 115 62"
                  stroke="#B45309"
                  strokeWidth="1"
                  strokeOpacity="0.1"
                  fill="none"
                />
              </g>

              {/* Fortune paper slip peeking out */}
              <g className="animate-paper-peek">
                <rect
                  x="75"
                  y="68"
                  width="50"
                  height="10"
                  rx="1"
                  fill="url(#paperGradient)"
                  stroke="#FCD34D"
                  strokeWidth="0.5"
                />
                {/* Paper text hint */}
                <line
                  x1="80"
                  y1="72"
                  x2="115"
                  y2="72"
                  stroke="#D97706"
                  strokeWidth="0.5"
                  strokeOpacity="0.4"
                />
                <line
                  x1="82"
                  y1="75"
                  x2="108"
                  y2="75"
                  stroke="#D97706"
                  strokeWidth="0.5"
                  strokeOpacity="0.3"
                />
              </g>

              {/* Sparkle decorations */}
              <g className="animate-sparkle-float">
                <path
                  d="M165 30 L167 35 L172 37 L167 39 L165 44 L163 39 L158 37 L163 35 Z"
                  fill="#FCD34D"
                  opacity="0.9"
                />
              </g>
              <g
                className="animate-sparkle-float"
                style={{ animationDelay: "0.5s" }}
              >
                <path
                  d="M35 45 L36.5 48.5 L40 50 L36.5 51.5 L35 55 L33.5 51.5 L30 50 L33.5 48.5 Z"
                  fill="#F59E0B"
                  opacity="0.8"
                />
              </g>
              <g
                className="animate-sparkle-float"
                style={{ animationDelay: "1s" }}
              >
                <path
                  d="M150 85 L151 87 L153 88 L151 89 L150 91 L149 89 L147 88 L149 87 Z"
                  fill="#FBBF24"
                  opacity="0.7"
                />
              </g>
            </svg>
          </div>
        </div>

        {/* LCP Element: Title and Description */}
        <div className="text-center relative px-4">
          {/* Subtle glow behind text */}
          <div
            className="absolute inset-0 bg-gradient-radial from-indigo-200/30 via-transparent to-transparent blur-2xl transform scale-150 opacity-50 dark:from-indigo-500/20"
            aria-hidden="true"
          />

          {/* Main Title - Modern gradient text */}
          <h2 className="text-4xl md:text-5xl mb-4 font-heading font-bold text-gradient-gold relative z-10">
            {t("home.heroTitleShort")}
          </h2>

          {/* Subtitle */}
          <p className="text-lg text-slate-600 dark:text-slate-300 mb-6 relative z-10 font-body">
            {t("home.tapToOpen")}
          </p>

          {/* Modern magic hint badge */}
          <div className="inline-flex items-center justify-center gap-3 px-5 py-2.5 rounded-full glass border border-indigo-200/50 dark:border-indigo-500/30 shadow-soft relative z-10 group hover:shadow-lg transition-all duration-300">
            {/* Sparkle icon */}
            <svg
              className="w-5 h-5 text-indigo-500 dark:text-indigo-400 animate-sparkle-float"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
            </svg>

            <span className="text-sm font-medium text-slate-700 dark:text-slate-200 font-body">
              {t("home.magicAwaits")}
            </span>

            {/* Second sparkle */}
            <svg
              className="w-4 h-4 text-orange-500 dark:text-orange-400 animate-sparkle-float"
              style={{ animationDelay: "0.5s" }}
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
            </svg>
          </div>

          {/* Scroll hint */}
          <div className="mt-12 animate-bounce opacity-50" aria-hidden="true">
            <svg
              className="w-6 h-6 mx-auto text-slate-400 dark:text-slate-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
              />
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}

/**
 * Lightweight loading indicator shown during hydration
 */
export function FortuneCookieLoadingOverlay() {
  return (
    <div
      className="absolute inset-0 flex items-center justify-center pointer-events-none z-20"
      aria-hidden="true"
    >
      <div className="sr-only">Loading interactive features...</div>
    </div>
  );
}
