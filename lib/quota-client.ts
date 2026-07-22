/**
 * Client-side helpers for reading the quota object the generator API already
 * returns, so the UI can explain a 429 in place instead of flashing a toast.
 *
 * No backend change is involved: /api/generator returns the full quota both on
 * success (`data.quota`) and on a 429 (`meta.quota`, via createErrorResponse).
 */

export interface QuotaInfo {
  limit: number;
  used: number;
  remaining: number;
  /** ISO timestamp of the next UTC midnight reset. */
  resetsAtUtc: string;
  isAuthenticated: boolean;
}

/**
 * Daily generator allowance for a signed-in account, used only for the
 * "what do I get for signing in" copy. Mirrors GENERATOR_AUTH_DAILY_LIMIT on
 * the server; the public env var is optional and only needed if that server
 * default is ever changed.
 */
const parsedSignedInLimit = Number.parseInt(
  process.env.NEXT_PUBLIC_GENERATOR_AUTH_DAILY_LIMIT || "",
  10,
);
export const SIGNED_IN_DAILY_LIMIT = Number.isNaN(parsedSignedInLimit)
  ? 10
  : parsedSignedInLimit;

/**
 * Daily generator allowance for a guest. Mirrors GENERATOR_GUEST_DAILY_LIMIT on
 * the server; used only for the "you still have N in the Generator" copy shown
 * by the homepage daily gate, where the response quota describes the *home*
 * scope and therefore cannot supply this number.
 */
const parsedGuestGeneratorLimit = Number.parseInt(
  process.env.NEXT_PUBLIC_GENERATOR_GUEST_DAILY_LIMIT || "",
  10,
);
export const GUEST_GENERATOR_DAILY_LIMIT = Number.isNaN(
  parsedGuestGeneratorLimit,
)
  ? 3
  : parsedGuestGeneratorLimit;

/**
 * The server encodes "no limit" as a sentinel number rather than null — 9999
 * for the unlimited home scope, Number.MAX_SAFE_INTEGER for Premium accounts.
 * Anything at or above this threshold must never be rendered as a count.
 */
export const UNLIMITED_REMAINING_THRESHOLD = 1000;

/** True when `remaining` is a sentinel meaning "unlimited", not a real count. */
export function isUnlimitedRemaining(remaining: number | null): boolean {
  return remaining !== null && remaining >= UNLIMITED_REMAINING_THRESHOLD;
}

function isQuotaInfo(value: unknown): value is QuotaInfo {
  if (!value || typeof value !== "object") return false;
  const q = value as Record<string, unknown>;
  return (
    typeof q.limit === "number" &&
    typeof q.used === "number" &&
    typeof q.remaining === "number" &&
    typeof q.resetsAtUtc === "string" &&
    typeof q.isAuthenticated === "boolean"
  );
}

/**
 * Pull the quota object out of an API payload. Handles the success envelope
 * (`data.quota`), the error envelope (`meta.quota`) and a `details.quota`
 * shape, so it keeps working if the envelope key ever changes.
 */
export function extractQuota(payload: unknown): QuotaInfo | null {
  if (!payload || typeof payload !== "object") return null;
  const root = payload as Record<string, unknown>;

  for (const key of ["meta", "details", "data"] as const) {
    const branch = root[key];
    if (branch && typeof branch === "object") {
      const quota = (branch as Record<string, unknown>).quota;
      if (isQuotaInfo(quota)) return quota;
    }
  }

  if (isQuotaInfo(root.quota)) return root.quota;
  return null;
}

/**
 * Relative countdown to the reset, e.g. "6h 12m" or "42m".
 * Hours and minutes are both shown so the wait reads as a concrete, finite
 * number rather than a vague "6h". The trailing "0m" is dropped on the hour.
 * Returns null when the reset time is unusable or already past.
 */
export function formatResetIn(
  resetsAtUtc: string,
  now: number = Date.now(),
): string | null {
  const resetAt = Date.parse(resetsAtUtc);
  if (Number.isNaN(resetAt)) return null;

  const diffMs = resetAt - now;
  if (diffMs <= 0) return null;

  const minutes = Math.ceil(diffMs / 60000);
  if (minutes < 60) return `${minutes}m`;

  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  return rest === 0 ? `${hours}h` : `${hours}h ${rest}m`;
}
