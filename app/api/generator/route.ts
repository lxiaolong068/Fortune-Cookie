import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import {
  checkGuestIpDailyCap,
  getScopedLimit,
  getScopedQuotaStatus,
  recordFortuneUsage,
  resolveGuestId,
  type QuotaIdentity,
  type QuotaScope,
} from "@/lib/quota";
import { recordGenerationHistory } from "@/lib/generation-history";
import { createSuccessResponse, createErrorResponse } from "@/types/api";
import { openRouterClient } from "@/lib/openrouter";
import { validateFortune } from "@/lib/prompts";
import {
  normalizeOracleParams,
  buildOracleSystemPrompt,
  buildOracleUserPrompt,
} from "@/lib/prompts/oracle";
import {
  normalizePersonaParams,
  buildPersonaSystemPrompt,
  buildPersonaUserPrompt,
  getPersona,
} from "@/lib/prompts/persona";
import {
  normalizeEventParams,
  buildEventSystemPrompt,
  buildEventUserPrompt,
  isEventQuantityAllowed,
  FREE_EVENT_MAX_QUANTITY,
} from "@/lib/prompts/event";
import {
  normalizeRpgParams,
  buildRpgSystemPrompt,
  buildRpgUserPrompt,
} from "@/lib/prompts/rpg";

export const dynamic = "force-dynamic";

export interface GeneratedFortune {
  message: string;
  luckyNumbers: number[];
}

interface GenerationPlan {
  systemPrompt: string;
  userPrompt: string;
  count: number;
  temperature: number;
  /** Whether to drop AI-slop outputs (banned words / anti-patterns). */
  filterSlop: boolean;
  /** Whether to remove duplicate messages from the batch. */
  dedupe: boolean;
  /** Echoed back to the client + used for usage logging. */
  meta: unknown;
  usage: { theme: string; mood: string };
}

/** Build a generation plan for a mode, or return an error response. */
function planFor(
  mode: string,
  rawParams: unknown,
  isPremium: boolean,
): { plan: GenerationPlan } | { error: NextResponse } {
  if (mode === "oracle") {
    const params = normalizeOracleParams(rawParams);
    return {
      plan: {
        systemPrompt: buildOracleSystemPrompt(),
        userPrompt: buildOracleUserPrompt(params),
        count: params.quantity,
        temperature: 0.9,
        filterSlop: true,
        dedupe: false,
        meta: params,
        usage: { theme: "oracle", mood: params.fortuneTypes.join(",") },
      },
    };
  }

  if (mode === "event") {
    const params = normalizeEventParams(rawParams);
    if (!isEventQuantityAllowed(params.quantity, isPremium)) {
      return {
        error: NextResponse.json(
          createErrorResponse(
            `Batches over ${FREE_EVENT_MAX_QUANTITY} messages are a Premium feature. Pick ${FREE_EVENT_MAX_QUANTITY} or fewer, or upgrade.`,
            { upgrade: true, maxFreeQuantity: FREE_EVENT_MAX_QUANTITY },
          ),
          { status: 403 },
        ),
      };
    }
    return {
      plan: {
        systemPrompt: buildEventSystemPrompt(),
        userPrompt: buildEventUserPrompt(params),
        count: params.quantity,
        temperature: 0.95,
        filterSlop: true,
        dedupe: params.avoidDuplicates,
        meta: params,
        usage: { theme: "event", mood: params.eventType },
      },
    };
  }

  if (mode === "rpg") {
    const params = normalizeRpgParams(rawParams);
    return {
      plan: {
        systemPrompt: buildRpgSystemPrompt(),
        userPrompt: buildRpgUserPrompt(params),
        count: params.quantity,
        temperature: 0.95,
        filterSlop: true,
        dedupe: false,
        meta: params,
        usage: { theme: "rpg", mood: `${params.setting}:${params.style}` },
      },
    };
  }

  if (mode === "persona") {
    const params = normalizePersonaParams(rawParams);
    const persona = getPersona(params.persona);
    if (!persona) {
      return {
        error: NextResponse.json(
          createErrorResponse(`Unknown persona: ${params.persona}`),
          { status: 400 },
        ),
      };
    }
    if (persona.tier === "premium" && !isPremium) {
      return {
        error: NextResponse.json(
          createErrorResponse(
            `"${persona.label}" is a premium persona. Pick a free persona or upgrade.`,
            { upgrade: true, persona: persona.id },
          ),
          { status: 403 },
        ),
      };
    }
    return {
      plan: {
        systemPrompt: buildPersonaSystemPrompt(persona),
        userPrompt: buildPersonaUserPrompt(persona, params.topic, params.quantity),
        count: params.quantity,
        temperature: 1.0,
        filterSlop: false, // personas intentionally subvert the anti-cliché rules
        dedupe: false,
        meta: params,
        usage: { theme: `persona:${persona.id}`, mood: params.topic || "random" },
      },
    };
  }

  return {
    error: NextResponse.json(
      createErrorResponse(
        `Unsupported generator mode: ${String(mode)}. Supported: oracle, persona, event, rpg.`,
      ),
      { status: 400 },
    ),
  };
}

/**
 * Unified generator endpoint for the v2 tool site.
 * POST { mode: "oracle" | "persona", params: {...} } → { fortunes: GeneratedFortune[] }
 */
export async function POST(request: NextRequest) {
  let body: { mode?: string; params?: unknown; source?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      createErrorResponse("Invalid JSON in request body"),
      { status: 400 },
    );
  }

  // Identity resolved first: persona/event gating and the quota bypass below
  // both depend on whether this user is Premium (spec 8.1).
  const session = await getServerSession(authOptions);
  const isPremium = Boolean(session?.user?.isPremium);
  const identity: QuotaIdentity = session?.user?.id
    ? { isAuthenticated: true, userId: session.user.id }
    : { isAuthenticated: false, guestId: resolveGuestId(request) };

  const planResult = planFor(String(body?.mode), body?.params, isPremium);
  if ("error" in planResult) return planResult.error;
  const { plan } = planResult;

  // Quota scope: the homepage daily draw has its own counter, separate from
  // the in-generator counter. Untrusted input is clamped to the two scopes.
  const scope: QuotaScope = body?.source === "home" ? "home" : "generator";

  // Premium: unlimited generator usage (spec 8.1). Home draws are already
  // unlimited for any authenticated user (spec 5.4) regardless of Premium.
  const quota = await getScopedQuotaStatus(identity, scope);
  if (!(isPremium && scope === "generator") && quota.remaining <= 0) {
    let message: string;
    if (scope === "home") {
      message =
        "You've used your free daily draw. Come back tomorrow, or open the Generator.";
    } else if (quota.isAuthenticated) {
      message =
        "You have reached your daily generator limit. Please try again tomorrow (UTC).";
    } else {
      message =
        "You have reached the guest daily limit. Sign in to get more fortunes today.";
    }
    return NextResponse.json(
      createErrorResponse(message, {
        quota,
        scope,
        // Explicit limits so the client never has to hardcode them or read a
        // parallel NEXT_PUBLIC_* env var that can silently drift from these.
        guestLimit: getScopedLimit(scope, false),
        authLimit: getScopedLimit(scope, true),
      }),
      { status: 429 },
    );
  }

  // Anti-abuse backstop: the per-device guest bucket is cheap to mint by
  // rotating X-Client-Id, so cap total guest generations per network per day
  // before spending anything at the model provider.
  const ipCap = await checkGuestIpDailyCap(identity);
  if (!ipCap.allowed) {
    return NextResponse.json(
      createErrorResponse(
        "Too many free fortunes from your network today. Sign in to keep generating.",
        { quota, scope, reason: "network_limit", authLimit: getScopedLimit(scope, true) },
      ),
      { status: 429 },
    );
  }

  // Generate
  let messages: string[];
  try {
    messages = await openRouterClient.generateMessages({
      systemPrompt: plan.systemPrompt,
      userPrompt: plan.userPrompt,
      count: plan.count,
      temperature: plan.temperature,
    });
  } catch (error) {
    const detail = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      createErrorResponse(
        "Fortune generation is temporarily unavailable. Please try again.",
        { detail },
      ),
      { status: 503 },
    );
  }

  if (messages.length === 0) {
    return NextResponse.json(
      createErrorResponse("The generator returned nothing. Please try again."),
      { status: 502 },
    );
  }

  // QA filter (oracle/event): drop AI-slop; keep raw if everything is filtered out.
  let finalMessages = messages;
  if (plan.filterSlop) {
    const clean = messages.filter((m) => validateFortune(m).valid);
    if (clean.length > 0) finalMessages = clean;
  }

  // Dedupe (event Avoid Duplicates): remove case-insensitive repeats.
  if (plan.dedupe) {
    const seen = new Set<string>();
    finalMessages = finalMessages.filter((m) => {
      const key = m.trim().toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }

  const fortunes: GeneratedFortune[] = finalMessages.map((message) => ({
    message,
    luckyNumbers: openRouterClient.getLuckyNumbers(),
  }));

  // Charge one quota unit on success
  try {
    await recordFortuneUsage({
      identity,
      theme: plan.usage.theme,
      mood: plan.usage.mood,
      length: "short",
      hasCustomPrompt: false,
      source: scope, // scope tag drives the per-entry-point counter
    });
  } catch {
    // Non-fatal: never fail a successful generation on usage logging.
  }

  // Generation History (Profile page) — authenticated users only (spec 5.3:
  // guests can't use history). Best-effort; recordGenerationHistory never throws.
  if (identity.userId) {
    await recordGenerationHistory(
      identity.userId,
      fortunes.map((f) => ({
        mode: String(body.mode),
        params: plan.meta,
        message: f.message,
        luckyNumbers: f.luckyNumbers,
      })),
    );
  }

  const refreshedQuota = await getScopedQuotaStatus(identity, scope);
  // Report Premium generator usage as unlimited — the DB-tracked count is
  // still incremented (for stats), but the gate above never enforces it.
  // `unlimited` is the field clients should read; the MAX_SAFE_INTEGER values
  // are kept only so older clients that compare numbers keep working.
  const reportedQuota =
    isPremium && scope === "generator"
      ? {
          ...refreshedQuota,
          unlimited: true,
          limit: Number.MAX_SAFE_INTEGER,
          remaining: Number.MAX_SAFE_INTEGER,
        }
      : refreshedQuota;

  return NextResponse.json(
    createSuccessResponse({
      mode: body.mode,
      params: plan.meta,
      fortunes,
      quota: reportedQuota,
      source: "ai",
    }),
  );
}
