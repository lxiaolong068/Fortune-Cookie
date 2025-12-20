import type { NextRequest } from "next/server";
import { db } from "@/lib/database";

const DEFAULT_GUEST_DAILY_LIMIT = 1;
const DEFAULT_AUTH_DAILY_LIMIT = 10;

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

export function resolveGuestId(request: NextRequest): string {
  const headerId = request.headers.get("x-client-id");
  if (headerId && headerId.trim().length > 0) {
    return headerId.trim();
  }

  const forwarded = request.headers.get("x-forwarded-for");
  const ip = forwarded ? forwarded.split(",")[0]?.trim() : request.ip;
  return ip || "unknown";
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
    },
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
