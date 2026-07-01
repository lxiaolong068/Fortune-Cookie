/**
 * Shareable fortune image cards (spec P3 growth: "分享功能 — 生成签文图片卡片").
 * Renders via the existing /api/og?type=fortune endpoint (next/og, edge
 * runtime) — this module just builds the URL and handles the client-side
 * share/download/open flow.
 */

export interface ShareCardOptions {
  message: string;
  luckyNumbers?: number[];
  /** Short label shown as the card's category badge, e.g. "Oracle", "Wedding". */
  category: string;
  /** Single emoji shown next to the category badge. */
  emoji: string;
}

/** Build the /api/og image URL for a fortune (pure, testable). */
export function buildShareCardUrl(options: ShareCardOptions): string {
  const params = new URLSearchParams({
    type: "fortune",
    message: options.message,
    category: options.category,
    emoji: options.emoji,
  });
  if (options.luckyNumbers?.length) {
    params.set("lucky", options.luckyNumbers.join(", "));
  }
  return `/api/og?${params.toString()}`;
}

export type ShareCardResult = "shared" | "downloaded" | "opened";

/**
 * Share the card image via the Web Share API (mobile-friendly, with the
 * rendered PNG attached) when available, otherwise download it, and as a
 * last resort just open the image in a new tab.
 */
export async function shareOrDownloadCard(
  url: string,
  shareText: string,
): Promise<ShareCardResult> {
  try {
    const res = await fetch(url);
    const blob = await res.blob();
    const file = new File([blob], "fortune-cookie.png", { type: "image/png" });

    const nav = navigator as Navigator & {
      canShare?: (data: { files: File[] }) => boolean;
      share?: (data: { files: File[]; text?: string }) => Promise<void>;
    };

    if (nav.canShare?.({ files: [file] }) && nav.share) {
      await nav.share({ files: [file], text: shareText });
      return "shared";
    }

    const objectUrl = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = objectUrl;
    a.download = "fortune-cookie.png";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(objectUrl);
    return "downloaded";
  } catch {
    window.open(url, "_blank", "noopener,noreferrer");
    return "opened";
  }
}
