/**
 * Generation history for authenticated users (Profile "Generation History").
 * Guests do not get history (spec 5.3) — callers should only invoke these
 * for a signed-in userId.
 */
import { db } from "@/lib/database";

const MAX_HISTORY = 50;
// Cap per-request inserts so a single large batch (e.g. a 100-message Event
// Master run) doesn't instantly fill the entire history with one generation.
const MAX_INSERT_PER_REQUEST = 20;

export interface HistoryEntryInput {
  mode: string;
  params: unknown;
  message: string;
  luckyNumbers?: number[];
}

export interface HistoryItem {
  id: string;
  mode: string;
  params: unknown;
  message: string;
  luckyNumbers?: number[];
  createdAt: Date;
}

/** Best-effort write; never throws (a logging failure must not fail a generation). */
export async function recordGenerationHistory(
  userId: string,
  entries: HistoryEntryInput[],
): Promise<void> {
  if (entries.length === 0) return;
  const bounded = entries.slice(0, MAX_INSERT_PER_REQUEST);

  try {
    await db.generationHistory.createMany({
      data: bounded.map((entry) => ({
        userId,
        mode: entry.mode,
        params: JSON.stringify(entry.params ?? {}),
        message: entry.message,
        luckyNumbers: entry.luckyNumbers
          ? JSON.stringify(entry.luckyNumbers)
          : null,
      })),
    });

    // Trim to the most recent MAX_HISTORY rows for this user.
    const count = await db.generationHistory.count({ where: { userId } });
    if (count > MAX_HISTORY) {
      const stale = await db.generationHistory.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        skip: MAX_HISTORY,
        select: { id: true },
      });
      if (stale.length > 0) {
        await db.generationHistory.deleteMany({
          where: { id: { in: stale.map((s) => s.id) } },
        });
      }
    }
  } catch (error) {
    console.error("Failed to record generation history:", error);
  }
}

export async function getGenerationHistory(
  userId: string,
): Promise<HistoryItem[]> {
  const rows = await db.generationHistory.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: MAX_HISTORY,
  });

  return rows.map((row) => ({
    id: row.id,
    mode: row.mode,
    params: safeParseJson(row.params),
    message: row.message,
    luckyNumbers: row.luckyNumbers ? safeParseJson(row.luckyNumbers) : undefined,
    createdAt: row.createdAt,
  }));
}

function safeParseJson(raw: string): any {
  try {
    return JSON.parse(raw);
  } catch {
    return undefined;
  }
}
