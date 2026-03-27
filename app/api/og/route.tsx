/**
 * Dynamic OG Image Generation API
 *
 * Generates personalized Open Graph images for social sharing.
 * Supports three card types:
 *   - fortune: Individual fortune cookie message card
 *   - pseo:    PSEO category page card (audience/occasion/quote/activity)
 *   - blog:    Blog article card
 *
 * Usage:
 *   /api/og?type=fortune&message=Your+fortune&category=inspirational&emoji=🌟
 *   /api/og?type=pseo&title=Teachers&emoji=🍎&badge=For+Teachers&gradient=purple
 *   /api/og?type=blog&title=Article+Title&description=Summary&tag=Tips
 *
 * Built with next/og (Satori) — Edge Runtime compatible, no external deps.
 */

import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

// ─── Colour palettes ────────────────────────────────────────────────────────

const GRADIENTS: Record<string, { from: string; to: string; accent: string }> =
  {
    purple: { from: "#1e1b4b", to: "#312e81", accent: "#a78bfa" },
    amber: { from: "#1c1208", to: "#292010", accent: "#fbbf24" },
    indigo: { from: "#0f172a", to: "#1e1b4b", accent: "#818cf8" },
    green: { from: "#052e16", to: "#14532d", accent: "#4ade80" },
    rose: { from: "#1c0a0a", to: "#2d1010", accent: "#fb7185" },
    default: { from: "#0f172a", to: "#1e1b4b", accent: "#f59e0b" },
  };

const CATEGORY_GRADIENTS: Record<string, string> = {
  inspirational: "purple",
  funny: "amber",
  love: "rose",
  wisdom: "indigo",
  success: "green",
  mystical: "default",
};

// ─── Helper ──────────────────────────────────────────────────────────────────

function truncate(str: string, max: number): string {
  return str.length <= max ? str : str.slice(0, max - 1) + "…";
}

// ─── Card layouts ────────────────────────────────────────────────────────────

function FortuneCookieCard({
  message,
  category,
  emoji,
  luckyNumbers,
}: {
  message: string;
  category: string;
  emoji: string;
  luckyNumbers?: string;
}) {
  const gradientKey = CATEGORY_GRADIENTS[category] ?? "default";
  const { from, to, accent } = GRADIENTS[gradientKey];

  return (
    <div
      style={{
        width: 1200,
        height: 630,
        display: "flex",
        flexDirection: "column",
        background: `linear-gradient(135deg, ${from} 0%, ${to} 100%)`,
        fontFamily: "sans-serif",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Decorative circles */}
      <div
        style={{
          position: "absolute",
          top: -120,
          right: -120,
          width: 400,
          height: 400,
          borderRadius: "50%",
          background: accent,
          opacity: 0.08,
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: -80,
          left: -80,
          width: 300,
          height: 300,
          borderRadius: "50%",
          background: accent,
          opacity: 0.06,
        }}
      />

      {/* Top bar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          padding: "36px 56px 0",
          gap: 14,
        }}
      >
        <div style={{ fontSize: 36 }}>{emoji}</div>
        <div
          style={{
            fontSize: 18,
            fontWeight: 700,
            color: accent,
            textTransform: "uppercase",
            letterSpacing: "0.12em",
          }}
        >
          {category.charAt(0).toUpperCase() + category.slice(1)} Fortune
        </div>
        <div style={{ flex: 1 }} />
        <div
          style={{
            fontSize: 16,
            color: "rgba(255,255,255,0.4)",
            fontWeight: 600,
          }}
        >
          fortunecookie.vip
        </div>
      </div>

      {/* Fortune message */}
      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "32px 72px",
        }}
      >
        <div
          style={{
            background: "rgba(255,255,255,0.06)",
            border: `1px solid rgba(255,255,255,0.12)`,
            borderRadius: 24,
            padding: "48px 56px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 20,
            width: "100%",
          }}
        >
          {/* Opening quote mark */}
          <div
            style={{
              fontSize: 80,
              color: accent,
              opacity: 0.6,
              lineHeight: 1,
              marginBottom: -16,
            }}
          >
            "
          </div>
          <div
            style={{
              fontSize: message.length > 80 ? 32 : 40,
              fontWeight: 700,
              color: "#ffffff",
              textAlign: "center",
              lineHeight: 1.45,
            }}
          >
            {truncate(message, 140)}
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          padding: "0 56px 36px",
          gap: 16,
        }}
      >
        {luckyNumbers && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              background: "rgba(255,255,255,0.08)",
              borderRadius: 100,
              padding: "8px 20px",
            }}
          >
            <span style={{ fontSize: 16, color: accent }}>🍀</span>
            <span
              style={{
                fontSize: 15,
                color: "rgba(255,255,255,0.7)",
                fontWeight: 600,
              }}
            >
              Lucky: {luckyNumbers}
            </span>
          </div>
        )}
        <div style={{ flex: 1 }} />
        <div
          style={{
            fontSize: 15,
            color: "rgba(255,255,255,0.4)",
          }}
        >
          🥠 Free AI Fortune Cookie Generator
        </div>
      </div>
    </div>
  );
}

function PSEOCard({
  title,
  emoji,
  badge,
  description,
  gradient,
}: {
  title: string;
  emoji: string;
  badge: string;
  description: string;
  gradient: string;
}) {
  const { from, to, accent } = GRADIENTS[gradient] ?? GRADIENTS.default;

  return (
    <div
      style={{
        width: 1200,
        height: 630,
        display: "flex",
        flexDirection: "column",
        background: `linear-gradient(135deg, ${from} 0%, ${to} 100%)`,
        fontFamily: "sans-serif",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Decorative elements */}
      <div
        style={{
          position: "absolute",
          top: -100,
          right: -100,
          width: 450,
          height: 450,
          borderRadius: "50%",
          background: accent,
          opacity: 0.07,
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: -60,
          left: 40,
          width: 200,
          height: 200,
          borderRadius: "50%",
          background: accent,
          opacity: 0.05,
        }}
      />

      {/* Site branding top */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          padding: "32px 56px 0",
          gap: 10,
        }}
      >
        <span style={{ fontSize: 24 }}>🥠</span>
        <span
          style={{
            fontSize: 18,
            fontWeight: 700,
            color: "rgba(255,255,255,0.5)",
          }}
        >
          fortunecookie.vip
        </span>
      </div>

      {/* Main content */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "24px 72px",
          gap: 24,
        }}
      >
        {/* Badge */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
          }}
        >
          <div
            style={{
              background: accent,
              color: "#000",
              fontSize: 15,
              fontWeight: 800,
              padding: "6px 18px",
              borderRadius: 100,
              textTransform: "uppercase",
              letterSpacing: "0.08em",
            }}
          >
            {badge}
          </div>
        </div>

        {/* Title */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 20,
          }}
        >
          <span style={{ fontSize: 72 }}>{emoji}</span>
          <div
            style={{
              fontSize: title.length > 30 ? 52 : 64,
              fontWeight: 800,
              color: "#ffffff",
              lineHeight: 1.1,
            }}
          >
            {truncate(title, 50)}
          </div>
        </div>

        {/* Description */}
        <div
          style={{
            fontSize: 24,
            color: "rgba(255,255,255,0.65)",
            lineHeight: 1.5,
            maxWidth: 900,
          }}
        >
          {truncate(description, 120)}
        </div>
      </div>

      {/* Bottom accent bar */}
      <div
        style={{
          height: 6,
          background: `linear-gradient(90deg, ${accent} 0%, transparent 100%)`,
        }}
      />
    </div>
  );
}

function BlogCard({
  title,
  description,
  tag,
  date,
}: {
  title: string;
  description: string;
  tag?: string;
  date?: string;
}) {
  const { from, to, accent } = GRADIENTS.default;

  return (
    <div
      style={{
        width: 1200,
        height: 630,
        display: "flex",
        flexDirection: "column",
        background: `linear-gradient(135deg, ${from} 0%, ${to} 100%)`,
        fontFamily: "sans-serif",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Decorative */}
      <div
        style={{
          position: "absolute",
          top: -80,
          right: -80,
          width: 380,
          height: 380,
          borderRadius: "50%",
          background: accent,
          opacity: 0.07,
        }}
      />

      {/* Site branding */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          padding: "32px 56px 0",
          gap: 10,
        }}
      >
        <span style={{ fontSize: 24 }}>🥠</span>
        <span
          style={{
            fontSize: 18,
            fontWeight: 700,
            color: "rgba(255,255,255,0.5)",
          }}
        >
          fortunecookie.vip · Blog
        </span>
      </div>

      {/* Main content */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "24px 72px",
          gap: 24,
        }}
      >
        {/* Tag */}
        {tag && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
            }}
          >
            <div
              style={{
                background: "rgba(245,158,11,0.2)",
                border: "1px solid rgba(245,158,11,0.4)",
                color: accent,
                fontSize: 14,
                fontWeight: 700,
                padding: "5px 16px",
                borderRadius: 100,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
              }}
            >
              {tag}
            </div>
          </div>
        )}

        {/* Title */}
        <div
          style={{
            fontSize: title.length > 60 ? 40 : 52,
            fontWeight: 800,
            color: "#ffffff",
            lineHeight: 1.2,
            maxWidth: 1000,
          }}
        >
          {truncate(title, 100)}
        </div>

        {/* Description */}
        <div
          style={{
            fontSize: 22,
            color: "rgba(255,255,255,0.6)",
            lineHeight: 1.55,
            maxWidth: 900,
          }}
        >
          {truncate(description, 150)}
        </div>
      </div>

      {/* Bottom bar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          padding: "0 56px 32px",
          gap: 12,
        }}
      >
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: "50%",
            background: accent,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 18,
          }}
        >
          ✍
        </div>
        <span
          style={{
            fontSize: 16,
            color: "rgba(255,255,255,0.5)",
            fontWeight: 600,
          }}
        >
          Fortune Cookie AI
          {date ? ` · ${date}` : ""}
        </span>
        <div style={{ flex: 1 }} />
        <div
          style={{
            height: 4,
            width: 120,
            background: `linear-gradient(90deg, ${accent}, transparent)`,
            borderRadius: 2,
          }}
        />
      </div>
    </div>
  );
}

// ─── Route handler ────────────────────────────────────────────────────────────

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const type = searchParams.get("type") ?? "fortune";

  try {
    if (type === "fortune") {
      const message =
        searchParams.get("message") ?? "Every journey begins with a single step.";
      const category = searchParams.get("category") ?? "inspirational";
      const emoji = searchParams.get("emoji") ?? "🌟";
      const luckyNumbers = searchParams.get("lucky") ?? undefined;

      return new ImageResponse(
        (
          <FortuneCookieCard
            message={message}
            category={category}
            emoji={emoji}
            luckyNumbers={luckyNumbers}
          />
        ),
        {
          width: 1200,
          height: 630,
          headers: {
            "Cache-Control": "public, max-age=86400, s-maxage=86400, stale-while-revalidate=3600",
          },
        }
      );
    }

    if (type === "pseo") {
      const title = searchParams.get("title") ?? "Fortune Cookie Messages";
      const emoji = searchParams.get("emoji") ?? "🥠";
      const badge = searchParams.get("badge") ?? "Fortune Cookie";
      const description =
        searchParams.get("description") ??
        "Discover the perfect fortune cookie messages for every occasion.";
      const gradient = searchParams.get("gradient") ?? "default";

      return new ImageResponse(
        (
          <PSEOCard
            title={title}
            emoji={emoji}
            badge={badge}
            description={description}
            gradient={gradient}
          />
        ),
        {
          width: 1200,
          height: 630,
          headers: {
            "Cache-Control": "public, max-age=86400, s-maxage=86400, stale-while-revalidate=3600",
          },
        }
      );
    }

    if (type === "blog") {
      const title = searchParams.get("title") ?? "Fortune Cookie Blog";
      const description =
        searchParams.get("description") ??
        "Insights, tips, and inspiration from the world of fortune cookies.";
      const tag = searchParams.get("tag") ?? undefined;
      const date = searchParams.get("date") ?? undefined;

      return new ImageResponse(
        (
          <BlogCard
            title={title}
            description={description}
            tag={tag}
            date={date}
          />
        ),
        {
          width: 1200,
          height: 630,
          headers: {
            "Cache-Control": "public, max-age=604800, s-maxage=604800, stale-while-revalidate=86400",
          },
        }
      );
    }

    // Fallback: default OG card
    return new ImageResponse(
      (
        <PSEOCard
          title="Fortune Cookie AI"
          emoji="🥠"
          badge="Free Fortune Generator"
          description="Generate personalized fortune cookie messages for any occasion. Free, instant, and powered by AI."
          gradient="default"
        />
      ),
      {
        width: 1200,
        height: 630,
        headers: {
          "Cache-Control": "public, max-age=86400, s-maxage=86400",
        },
      }
    );
  } catch (error) {
    console.error("OG image generation error:", error);
    return new Response("Failed to generate OG image", { status: 500 });
  }
}
