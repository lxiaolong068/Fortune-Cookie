/**
 * GA4 event bridge — the single entry point for product analytics.
 *
 * Why this file exists
 * --------------------
 * `lib/analytics-manager.ts` only ever posts to our own `/api/analytics` and to
 * the error-monitoring capture helpers. It never calls `gtag`, so nothing it
 * records reaches GA4 — which is why the GA4 property showed zero key events
 * for the growth work. This module is the missing hop: it calls `gtag('event',
 * …)` directly, and mirrors the same event into `analyticsManager` so the
 * in-house pipeline keeps its data too.
 *
 * Known inconsistency (deliberately NOT fixed here)
 * ------------------------------------------------
 * `analyticsManager` is gated by the consent banner (`AnalyticsInitializer`
 * calls `setTrackingEnabled()` from the stored preference), whereas the gtag
 * script is loaded unconditionally by `components/PerformanceMonitor.tsx` and
 * therefore is NOT gated. So the two sinks can disagree: gtag may receive an
 * event that `analyticsManager` drops. That asymmetry predates this module and
 * belongs to the consent design, not to the tracking bridge — changing it here
 * would silently alter what the banner means. Documented, left alone.
 *
 * Hard rule
 * ---------
 * Tracking is never allowed to break a user flow. Every path in this file is
 * wrapped so that a missing `gtag`, a blocked script, an ad blocker, a
 * server-side render or a throwing sink all end in a silent no-op.
 */

/** Values GA4 accepts as an event parameter. `null`/`undefined` are dropped. */
export type TrackParamValue = string | number | boolean | null | undefined;

export type TrackParams = Readonly<Record<string, TrackParamValue>>;

/** GA4 limits (https://support.google.com/analytics/answer/9267744). */
const MAX_EVENT_NAME_LENGTH = 40;
const MAX_PARAM_NAME_LENGTH = 40;
const MAX_PARAM_VALUE_LENGTH = 100;
const MAX_PARAMS_PER_EVENT = 25;

/**
 * GA4 names must be alphanumeric + underscore and must start with a letter.
 * Anything else is coerced rather than dropped: a mangled-but-present event is
 * far more useful than a silently missing one.
 */
function normalizeName(raw: string, maxLength: number): string {
  const cleaned = raw
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9_]+/g, "_")
    .replace(/^_+/, "");
  const safe = /^[a-z]/.test(cleaned) ? cleaned : `e_${cleaned}`;
  return safe.slice(0, maxLength);
}

function normalizeValue(value: Exclude<TrackParamValue, null | undefined>) {
  if (typeof value === "number") {
    // NaN/Infinity serialise to `null` in the gtag payload and poison the
    // metric — send nothing rather than a hole.
    return Number.isFinite(value) ? value : undefined;
  }
  if (typeof value === "boolean") {
    // Sent as a string so GA4 reports read "true"/"false" instead of 1/0.
    return value ? "true" : "false";
  }
  return value.slice(0, MAX_PARAM_VALUE_LENGTH);
}

function normalizeParams(params: TrackParams): Record<string, string | number> {
  const out: Record<string, string | number> = {};
  let count = 0;
  for (const [key, value] of Object.entries(params)) {
    if (value === null || value === undefined) continue;
    if (count >= MAX_PARAMS_PER_EVENT) break;
    const normalized = normalizeValue(value);
    if (normalized === undefined) continue;
    out[normalizeName(key, MAX_PARAM_NAME_LENGTH)] = normalized;
    count += 1;
  }
  return out;
}

/**
 * Console echo for local verification.
 *
 * gtag only loads in production (see PerformanceMonitor), so in development the
 * only proof a call site fires is this log. It is on by default in dev, and can
 * be switched on in production from the browser console with:
 *
 *     localStorage.setItem("fc_track_debug", "1")
 */
function isDebugEnabled(): boolean {
  if (process.env.NODE_ENV !== "production") return true;
  try {
    return window.localStorage.getItem("fc_track_debug") === "1";
  } catch {
    return false;
  }
}

/**
 * Report a product event to GA4 (and mirror it into the in-house pipeline).
 *
 * @param name   GA4 event name; normalised to snake_case, max 40 chars.
 * @param params Optional event parameters; values are truncated to 100 chars.
 */
export function trackEvent(name: string, params: TrackParams = {}): void {
  try {
    if (typeof window === "undefined") return;

    const eventName = normalizeName(name, MAX_EVENT_NAME_LENGTH);
    if (!eventName) return;
    const eventParams = normalizeParams(params);

    if (isDebugEnabled()) {
      // eslint-disable-next-line no-console
      console.debug("[track]", eventName, eventParams);
    }

    // 1) GA4. Absent in development, when the script is blocked, or before it
    //    has finished loading — all of which are a no-op, never an error.
    try {
      if (typeof window.gtag === "function") {
        window.gtag("event", eventName, eventParams);
      }
    } catch {
      // swallow: an analytics failure must not surface to the user
    }

    // 2) In-house pipeline. Imported lazily so this module stays out of the
    //    critical bundle; `AnalyticsInitializer` (root layout) already loads
    //    the manager on every page, so this resolves from cache in practice.
    void import("@/lib/analytics-manager")
      .then(({ analyticsManager }) => {
        analyticsManager.trackUserBehavior(eventName, eventParams);
      })
      .catch(() => {
        // swallow: see above
      });
  } catch {
    // swallow: see above
  }
}
