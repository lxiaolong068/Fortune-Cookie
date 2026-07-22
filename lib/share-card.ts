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

const CARD_FILENAME = "fortune-cookie.png";

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

/**
 * "cancelled" means the user dismissed the system share sheet. It is a normal
 * outcome, not an error: callers must stay silent on it (no toast, no tab).
 */
export type ShareCardResult = "shared" | "downloaded" | "opened" | "cancelled";

/**
 * Blob cache for prefetched cards, keyed by image URL.
 *
 * iOS Safari only honours navigator.share() while the user gesture is still
 * "active"; an `await fetch(...)` in between expires it and Safari throws
 * NotAllowedError. So the card PNG is fetched ahead of the click (see
 * prefetchShareCard) and the click handler can call share() synchronously.
 * Bounded to a handful of entries — one card is ~100KB and the homepage only
 * ever keeps the current fortune.
 */
const CARD_CACHE_LIMIT = 4;
const cardBlobCache = new Map<string, Blob>();

function rememberBlob(url: string, blob: Blob): void {
  cardBlobCache.delete(url);
  cardBlobCache.set(url, blob);
  while (cardBlobCache.size > CARD_CACHE_LIMIT) {
    const oldest = cardBlobCache.keys().next().value;
    if (oldest === undefined) break;
    cardBlobCache.delete(oldest);
  }
}

/**
 * Warm the blob cache for a card URL. Call this as soon as the card becomes
 * shareable (e.g. when the fortune is revealed), never inside the click
 * handler. Failures are swallowed on purpose: a cold cache only means the
 * share path falls back to fetching inline, it must never surface an error.
 */
export async function prefetchShareCard(url: string): Promise<void> {
  if (cardBlobCache.has(url)) return;
  try {
    const res = await fetch(url);
    if (!res.ok) return;
    const blob = await res.blob();
    rememberBlob(url, blob);
  } catch {
    // ignore — shareOrDownloadCard will fetch on demand
  }
}

/** Discard cached card blobs (used when the fortune changes). */
export function clearShareCardCache(): void {
  cardBlobCache.clear();
}

function isAbortError(err: unknown): boolean {
  return (
    typeof err === "object" &&
    err !== null &&
    (err as { name?: unknown }).name === "AbortError"
  );
}

/** Trigger a browser download for an already-fetched blob. */
function triggerDownload(blob: Blob, filename: string): void {
  const objectUrl = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = objectUrl;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  // Revoking synchronously after click() races the download in Firefox and
  // some WebViews (0-byte file / failed download). Give the browser a beat to
  // take ownership of the object URL first.
  setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);
}

/**
 * Download the card image, skipping the Web Share sheet. Used by the explicit
 * "Save image" action, where the user has already decided not to share.
 */
export async function downloadCard(
  url: string,
  filename = CARD_FILENAME,
): Promise<"downloaded" | "opened"> {
  try {
    const cached = cardBlobCache.get(url);
    if (cached) {
      triggerDownload(cached, filename);
      return "downloaded";
    }
    const res = await fetch(url);
    const blob = await res.blob();
    rememberBlob(url, blob);
    triggerDownload(blob, filename);
    return "downloaded";
  } catch {
    window.open(url, "_blank", "noopener,noreferrer");
    return "opened";
  }
}

type ShareCapableNavigator = Navigator & {
  canShare?: (data: { files: File[] }) => boolean;
  share?: (data: { files: File[]; text?: string }) => Promise<void>;
};

/**
 * Share an already-materialised blob. Kept separate (and free of awaits before
 * `nav.share`) so the cached path calls share() inside the user gesture.
 */
async function shareBlob(
  blob: Blob,
  url: string,
  shareText: string,
): Promise<ShareCardResult> {
  const file = new File([blob], CARD_FILENAME, { type: "image/png" });
  const nav = navigator as ShareCapableNavigator;

  if (nav.canShare?.({ files: [file] }) && nav.share) {
    try {
      await nav.share({ files: [file], text: shareText });
      return "shared";
    } catch (err) {
      // The user dismissed the sheet — that is a decision, not a failure.
      // Opening the raw PNG in a new tab here would actively fight them.
      if (isAbortError(err)) return "cancelled";
      // Anything else (NotAllowedError, unsupported payload): fall back to a
      // download rather than a naked image tab.
      try {
        triggerDownload(blob, CARD_FILENAME);
        return "downloaded";
      } catch {
        window.open(url, "_blank", "noopener,noreferrer");
        return "opened";
      }
    }
  }

  triggerDownload(blob, CARD_FILENAME);
  return "downloaded";
}

/**
 * Share the card image via the Web Share API (mobile-friendly, with the
 * rendered PNG attached) when available, otherwise download it, and as a
 * last resort just open the image in a new tab.
 *
 * Call prefetchShareCard(url) beforehand: with a warm cache this runs
 * synchronously up to navigator.share(), which is what iOS Safari requires.
 */
export async function shareOrDownloadCard(
  url: string,
  shareText: string,
): Promise<ShareCardResult> {
  const cached = cardBlobCache.get(url);
  if (cached) return shareBlob(cached, url, shareText);

  try {
    const res = await fetch(url);
    const blob = await res.blob();
    rememberBlob(url, blob);
    return await shareBlob(blob, url, shareText);
  } catch {
    window.open(url, "_blank", "noopener,noreferrer");
    return "opened";
  }
}
