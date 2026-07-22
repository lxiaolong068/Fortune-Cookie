import { createHash } from "node:crypto";
import type { NextRequest } from "next/server";
import { db } from "@/lib/database";

const DEFAULT_GUEST_DAILY_LIMIT = 5;
const DEFAULT_AUTH_DAILY_LIMIT = 20;

/**
 * Any limit at or above this value is reported to clients as "unlimited"
 * rather than as a literal number (see `QuotaStatus.unlimited`).
 */
const UNLIMITED = 9999;

export function isUnlimitedLimit(limit: number): boolean {
  return limit >= UNLIMITED;
}

const parsedGuestLimit = Number.parseInt(
  process.env.GUEST_DAILY_LIMIT || `${DEFAULT_GUEST_DAILY_LIMIT}`,
  10,
);
const parsedAuthLimit = Number.parseInt(
  process.env.AUTH_DAILY_LIMIT || `${DEFAULT_AUTH_DAILY_LIMIT}`,
  10,
);

export const GUEST_DAILY_LIMIT = Number.isNaN(parsedGuestLimit)
  ? DEFAULT_GUEST_DAILY_LIMIT
  : parsedGuestLimit;
export const AUTH_DAILY_LIMIT = Number.isNaN(parsedAuthLimit)
  ? DEFAULT_AUTH_DAILY_LIMIT
  : parsedAuthLimit;

export type QuotaIdentity = {
  isAuthenticated: boolean;
  userId?: string;
  guestId?: string;
};

export type QuotaStatus = {
  limit: number;
  used: number;
  remaining: number;
  resetsAtUtc: string;
  isAuthenticated: boolean;
  /**
   * Explicit "no ceiling" flag. Prefer this over comparing `limit` against a
   * magic sentinel (Number.MAX_SAFE_INTEGER / 9999) — rendering the raw number
   * produces strings like "9007199254740991 free fortunes left today."
   */
  unlimited: boolean;
  /**
   * The daily limit this identity *would* get when signed in. Lets the UI say
   * "sign in for N per day" without hardcoding N or reading a parallel
   * NEXT_PUBLIC_* env var that can drift from the server-side one.
   */
  authLimit: number;
};

export function getDailyLimit(isAuthenticated: boolean): number {
  return isAuthenticated ? AUTH_DAILY_LIMIT : GUEST_DAILY_LIMIT;
}

export function getUtcDateKey(date: Date = new Date()): string {
  const year = date.getUTCFullYear();
  const month = `${date.getUTCMonth() + 1}`.padStart(2, "0");
  const day = `${date.getUTCDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function getNextUtcReset(date: Date = new Date()): Date {
  return new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate() + 1),
  );
}

// ---------------------------------------------------------------------------
// Guest identity
//
// A guest bucket is derived from BOTH the client-supplied `X-Client-Id` header
// and the request's network prefix:
//
//     guestId = <ipHash:12>.<deviceHash:20>
//
//   * Two devices on the same Wi-Fi / office / carrier NAT send different
//     client ids, so they land in different deviceHash buckets and never eat
//     each other's free quota (this is the whole point of the header).
//   * The header alone can no longer *name* a bucket: it is salted and mixed
//     with the network prefix, so a forged id cannot target another visitor's
//     bucket, and garbage/oversized values can never reach the database index.
//   * The shared `ipHash` prefix makes every bucket from one network cheaply
//     countable, which is what `checkGuestIpDailyCap` uses as the abuse
//     ceiling (rotating the header still costs real IPs).
// ---------------------------------------------------------------------------

/**
 * Server-only salt. Without it the guest id is a pure function of public
 * inputs; with it, ids cannot be precomputed offline for a known IP range.
 */
const GUEST_ID_SALT =
  process.env.GUEST_ID_SALT ||
  process.env.NEXTAUTH_SECRET ||
  "fortune-cookie-guest-id-v1";

const CLIENT_ID_MAX_LENGTH = 64;
const CLIENT_ID_MIN_LENGTH = 8;
/** UUIDs, hex ids and the `fc-<base36>-<base36>` fallback all fit this set. */
const CLIENT_ID_DISALLOWED = /[^A-Za-z0-9._:-]/g;

const IP_HASH_LENGTH = 12;
const DEVICE_HASH_LENGTH = 20;

function sha256Hex(input: string): string {
  return createHash("sha256").update(input).digest("hex");
}

/**
 * Truncate first, then strip: otherwise a caller could pad with disallowed
 * characters to smuggle an arbitrarily long payload past the length check.
 * Returns null when the remainder is too short to be a real id.
 */
function sanitizeClientId(raw: string | null): string | null {
  if (!raw) return null;
  const cleaned = raw
    .trim()
    .slice(0, CLIENT_ID_MAX_LENGTH)
    .replace(CLIENT_ID_DISALLOWED, "");
  return cleaned.length >= CLIENT_ID_MIN_LENGTH ? cleaned : null;
}

function resolveClientIp(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  const first = forwarded?.split(",")[0]?.trim();
  if (first) return first;
  const realIp = request.headers.get("x-real-ip")?.trim();
  if (realIp) return realIp;
  return request.ip || "unknown";
}

/**
 * Network prefix rather than the exact address (IPv4 /24, IPv6 /64): mobile
 * carriers rotate the last octets constantly, and a guest whose bucket changed
 * on every hop would effectively have unlimited quota.
 */
function getIpBucket(ip: string): string {
  if (ip.includes(":")) {
    return ip.split(":").slice(0, 4).join(":");
  }
  const octets = ip.split(".");
  return octets.length === 4 ? octets.slice(0, 3).join(".") : ip;
}

export function resolveGuestId(request: NextRequest): string {
  const ipBucket = getIpBucket(resolveClientIp(request));
  const clientId = sanitizeClientId(request.headers.get("x-client-id"));

  const ipHash = sha256Hex(`${GUEST_ID_SALT}|ip|${ipBucket}`).slice(
    0,
    IP_HASH_LENGTH,
  );
  // No usable header (SSR, storage disabled, hostile client sending junk):
  // fall back to one shared per-network bucket — the pre-header behaviour.
  const deviceHash = sha256Hex(
    `${GUEST_ID_SALT}|cid|${ipBucket}|${clientId ?? "no-client-id"}`,
  ).slice(0, DEVICE_HASH_LENGTH);

  return `${ipHash}.${deviceHash}`;
}

/** The shared network prefix of a guest id, or null if it isn't one of ours. */
export function getGuestIpBucketKey(guestId: string): string | null {
  const prefix = guestId.split(".")[0];
  return prefix && prefix.length === IP_HASH_LENGTH ? prefix : null;
}

function getQuotaWhere(identity: QuotaIdentity, dateKey: string) {
  if (identity.userId) {
    return { userId_dateKey: { userId: identity.userId, dateKey } };
  }

  if (identity.guestId) {
    return { guestId_dateKey: { guestId: identity.guestId, dateKey } };
  }

  return null;
}

export async function getDailyQuotaStatus(
  identity: QuotaIdentity,
): Promise<QuotaStatus> {
  const dateKey = getUtcDateKey();
  const limit = getDailyLimit(identity.isAuthenticated);
  const resetAt = getNextUtcReset().toISOString();
  const where = getQuotaWhere(identity, dateKey);

  if (!where) {
    return {
      limit,
      used: limit,
      remaining: 0,
      resetsAtUtc: resetAt,
      isAuthenticated: identity.isAuthenticated,
      unlimited: false,
      authLimit: AUTH_DAILY_LIMIT,
    };
  }

  const quota = await db.fortuneQuota.findUnique({ where });
  const used = quota?.usedCount ?? 0;

  return {
    limit,
    used,
    remaining: Math.max(0, limit - used),
    resetsAtUtc: resetAt,
    isAuthenticated: identity.isAuthenticated,
    unlimited: isUnlimitedLimit(limit),
    authLimit: AUTH_DAILY_LIMIT,
  };
}

export async function consumeDailyQuota(
  identity: QuotaIdentity,
): Promise<{ allowed: boolean; quota: QuotaStatus }> {
  const dateKey = getUtcDateKey();
  const limit = getDailyLimit(identity.isAuthenticated);
  const resetAt = getNextUtcReset().toISOString();
  const where = getQuotaWhere(identity, dateKey);

  if (!where) {
    return {
      allowed: false,
      quota: {
        limit,
        used: limit,
        remaining: 0,
        resetsAtUtc: resetAt,
        isAuthenticated: identity.isAuthenticated,
        unlimited: false,
        authLimit: AUTH_DAILY_LIMIT,
      },
    };
  }

  const result = await db.$transaction(async (tx) => {
    const existing = await tx.fortuneQuota.findUnique({ where });

    if (!existing) {
      const created = await tx.fortuneQuota.create({
        data: {
          userId: identity.userId,
          guestId: identity.guestId,
          dateKey,
          usedCount: 1,
          dailyLimit: limit,
        },
      });

      return { allowed: true, used: created.usedCount };
    }

    if (existing.usedCount >= limit) {
      return { allowed: false, used: existing.usedCount };
    }

    const updated = await tx.fortuneQuota.update({
      where: { id: existing.id },
      data: {
        usedCount: { increment: 1 },
        dailyLimit: limit,
      },
    });

    return { allowed: true, used: updated.usedCount };
  });

  return {
    allowed: result.allowed,
    quota: {
      limit,
      used: result.used,
      remaining: Math.max(0, limit - result.used),
      resetsAtUtc: resetAt,
      isAuthenticated: identity.isAuthenticated,
      unlimited: isUnlimitedLimit(limit),
      authLimit: AUTH_DAILY_LIMIT,
    },
  };
}

// ---------------------------------------------------------------------------
// Scoped quota (v2): independent per-entry-point counters.
//   home      → the homepage daily draw (guest 1/day, authenticated unlimited)
//   generator → the /generator modes      (guest 3/day, authenticated 10/day)
// Counting is derived from FortuneUsage rows tagged with `source = scope`, so
// it needs no schema change and is isolated from the legacy FortuneQuota
// counter still used by /api/fortune.
// ---------------------------------------------------------------------------

export type QuotaScope = "home" | "generator";

function envInt(name: string, fallback: number): number {
  const parsed = Number.parseInt(process.env[name] || `${fallback}`, 10);
  return Number.isNaN(parsed) ? fallback : parsed;
}

const SCOPE_LIMITS: Record<QuotaScope, { guest: number; auth: number }> = {
  home: {
    guest: envInt("HOME_GUEST_DAILY_LIMIT", 1),
    auth: envInt("HOME_AUTH_DAILY_LIMIT", UNLIMITED),
  },
  generator: {
    guest: envInt("GENERATOR_GUEST_DAILY_LIMIT", 3),
    auth: envInt("GENERATOR_AUTH_DAILY_LIMIT", 10),
  },
};

export function getScopedLimit(
  scope: QuotaScope,
  isAuthenticated: boolean,
): number {
  const limits = SCOPE_LIMITS[scope];
  return isAuthenticated ? limits.auth : limits.guest;
}

async function countScopedUsage(
  identity: QuotaIdentity,
  dateKey: string,
  scope: QuotaScope,
): Promise<number | null> {
  if (identity.userId) {
    return db.fortuneUsage.count({
      where: { userId: identity.userId, dateKey, source: scope },
    });
  }
  if (identity.guestId) {
    return db.fortuneUsage.count({
      where: { guestId: identity.guestId, dateKey, source: scope },
    });
  }
  return null;
}

/**
 * Per-scope daily quota status. The counter is the number of FortuneUsage rows
 * for this identity+day tagged with `source = scope`; record one (via
 * recordFortuneUsage with source: scope) on each successful generation.
 */
export async function getScopedQuotaStatus(
  identity: QuotaIdentity,
  scope: QuotaScope,
): Promise<QuotaStatus> {
  const dateKey = getUtcDateKey();
  const limit = getScopedLimit(scope, identity.isAuthenticated);
  const resetAt = getNextUtcReset().toISOString();

  const authLimit = getScopedLimit(scope, true);

  const used = await countScopedUsage(identity, dateKey, scope);
  if (used === null) {
    return {
      limit,
      used: limit,
      remaining: 0,
      resetsAtUtc: resetAt,
      isAuthenticated: identity.isAuthenticated,
      unlimited: false,
      authLimit,
    };
  }

  return {
    limit,
    used,
    remaining: Math.max(0, limit - used),
    resetsAtUtc: resetAt,
    isAuthenticated: identity.isAuthenticated,
    unlimited: isUnlimitedLimit(limit),
    authLimit,
  };
}

export async function recordFortuneUsage(input: {
  identity: QuotaIdentity;
  theme: string;
  mood: string;
  length: string;
  hasCustomPrompt: boolean;
  source?: string;
}): Promise<void> {
  const dateKey = getUtcDateKey();

  await db.fortuneUsage.create({
    data: {
      userId: input.identity.userId,
      guestId: input.identity.guestId,
      dateKey,
      theme: input.theme,
      mood: input.mood,
      length: input.length,
      hasCustomPrompt: input.hasCustomPrompt,
      source: input.source,
    },
  });
}

// ---------------------------------------------------------------------------
// Per-network abuse ceiling
//
// Per-device quota is intentionally cheap to obtain (that is what makes the
// shared-Wi-Fi experience work), so it cannot be the anti-abuse control on its
// own: a loop that rotates `X-Client-Id` mints a fresh bucket every request.
// This is the backstop — a coarse daily ceiling on *all* guest generations
// coming from one network prefix, counted via the shared `ipHash` prefix that
// every guest id from that network carries.
//
// It is deliberately far above normal usage: it should only ever trip on
// scripted abuse, never on a real office or campus. Signed-in users are exempt
// (they are rate-limited by their own account quota instead).
// ---------------------------------------------------------------------------

export const GUEST_IP_DAILY_LIMIT = envInt("GUEST_IP_DAILY_LIMIT", 200);

export type IpCapStatus = {
  allowed: boolean;
  used: number;
  limit: number;
};

export async function checkGuestIpDailyCap(
  identity: QuotaIdentity,
): Promise<IpCapStatus> {
  const limit = GUEST_IP_DAILY_LIMIT;

  // limit <= 0 disables the ceiling entirely (escape hatch for incidents).
  if (identity.isAuthenticated || !identity.guestId || limit <= 0) {
    return { allowed: true, used: 0, limit };
  }

  const bucket = getGuestIpBucketKey(identity.guestId);
  if (!bucket) {
    return { allowed: true, used: 0, limit };
  }

  try {
    // Bounded by the `dateKey` index to a single day's rows; the `bucket.`
    // prefix match then selects every guest bucket on this network.
    const used = await db.fortuneUsage.count({
      where: {
        dateKey: getUtcDateKey(),
        guestId: { startsWith: `${bucket}.` },
      },
    });
    return { allowed: used < limit, used, limit };
  } catch {
    // Fail open: the per-identity quota gate above already ran against the
    // same database, so a failure here cannot be the only thing standing
    // between a user and a generation.
    return { allowed: true, used: 0, limit };
  }
}
