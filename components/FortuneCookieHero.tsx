import { cn } from "@/lib/utils";

/**
 * Server-rendered fallback hero shown while the interactive fortune cookie
 * experience loads. Keeps meaningful content above the fold for SEO and
 * improves LCP by avoiding large client bundles on first paint.
 */
export function FortuneCookieHero() {
  return (
    <section className="flex flex-col items-center justify-center min-h-screen p-6 bg-gradient-to-br from-orange-50/80 to-amber-100/80 backdrop-blur-sm">
      <div className="w-full max-w-2xl min-h-[600px] flex flex-col items-center justify-center text-center space-y-6">
        <div
          aria-hidden="true"
          className={cn(
            "w-32 h-32 rounded-full bg-gradient-to-br from-yellow-200 to-amber-300",
            "shadow-lg border-2 border-amber-300 flex items-center justify-center",
            "relative overflow-hidden",
          )}
        >
          <div className="absolute inset-2 rounded-full border border-amber-400/50" />
          <div className="absolute inset-4 rounded-full border border-amber-400/30" />
          <span className="text-amber-700 font-semibold">🍪</span>
        </div>

        <div className="space-y-3">
          <span
            role="heading"
            aria-level={2}
            className="block text-3xl font-semibold bg-gradient-to-r from-amber-700 via-yellow-600 to-orange-700 bg-clip-text text-transparent"
          >
            Fortune Cookie
          </span>
          <p className="text-amber-700">
            Tap the cookie to crack it open and reveal your personalized
            AI-powered fortune.
          </p>
        </div>

        <div className="flex flex-col items-center gap-3">
          <p className="text-sm text-amber-600/90">
            Loading the interactive experience…
          </p>
          <div className="h-2 w-32 rounded-full bg-amber-200 overflow-hidden">
            <div className="h-full w-1/2 animate-pulse rounded-full bg-gradient-to-r from-amber-400 to-orange-400" />
          </div>
        </div>
      </div>
    </section>
  );
}
