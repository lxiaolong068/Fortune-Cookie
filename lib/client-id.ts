/**
 * Anonymous browser identity for guest quota accounting.
 *
 * Guest quota falls back to the request IP on the server (`resolveGuestId` in
 * lib/quota.ts already prefers the `x-client-id` header). IP-based identity
 * means everyone behind the same Wi-Fi / office / carrier NAT shares one
 * bucket, so a first-time visitor can be told "you're out of fortunes" before
 * they ever generated one. Sending a stable per-browser id fixes that without
 * any backend change.
 *
 * Degradation ladder:
 *   1. localStorage-persisted UUID (normal case, survives reloads)
 *   2. in-memory UUID (private mode / storage disabled — new id per page load)
 *   3. no header at all on the server (SSR) → backend falls back to IP
 */

const STORAGE_KEY = "fc_client_id_v1";

/** Module-level cache so we hit localStorage at most once per page load. */
let cachedId: string | null = null;

function randomId(): string {
  try {
    const cryptoObj = globalThis.crypto;
    if (typeof cryptoObj?.randomUUID === "function") {
      return cryptoObj.randomUUID();
    }
    if (typeof cryptoObj?.getRandomValues === "function") {
      const bytes = new Uint8Array(16);
      cryptoObj.getRandomValues(bytes);
      return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
    }
  } catch {
    // crypto unavailable (very old browser / restricted context)
  }
  return `fc-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 12)}`;
}

/**
 * Stable anonymous id for this browser. Returns null during SSR so callers
 * simply omit the header and the server falls back to IP.
 */
export function getClientId(): string | null {
  if (typeof window === "undefined") return null;
  if (cachedId) return cachedId;

  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored && stored.trim().length > 0) {
      cachedId = stored.trim();
      return cachedId;
    }
  } catch {
    // localStorage blocked (Safari private mode, cookie-blocking extensions)
  }

  const created = randomId();
  cachedId = created;
  try {
    window.localStorage.setItem(STORAGE_KEY, created);
  } catch {
    // memory-only for this page load; still better than sharing an IP bucket
  }
  return created;
}

/**
 * Merge the `X-Client-Id` header into a fetch header bag.
 * Use for every request that consumes or reports guest quota.
 */
export function withClientId(
  headers: Record<string, string> = {},
): Record<string, string> {
  const id = getClientId();
  return id ? { ...headers, "X-Client-Id": id } : { ...headers };
}
