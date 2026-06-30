import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import {
  getScopedQuotaStatus,
  recordFortuneUsage,
  resolveGuestId,
  type QuotaIdentity,
  type QuotaScope,
} from "@/lib/quota";
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
  /** Echoed back to the client + used for usage logging. */
  meta: unknown;
  usage: { theme: string; mood: string };
}

/** Build a generation plan for a mode, or return an error response. */
function planFor(
  mode: string,
  rawParams: unknown,
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
        meta: params,
        usage: { theme: "oracle", mood: params.fortuneTypes.join(",") },
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
    if (persona.tier === "premium") {
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
        meta: params,
        usage: { theme: `persona:${persona.id}`, mood: params.topic || "random" },
      },
    };
  }

  return {
    error: NextResponse.json(
      createErrorResponse(
        `Unsupported generator mode: ${String(mode)}. Supported: oracle, persona.`,
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

  const planResult = planFor(String(body?.mode), body?.params);
  if ("error" in planResult) return planResult.error;
  const { plan } = planResult;

  // Quota scope: the homepage daily draw has its own counter, separate from
  // the in-generator counter. Untrusted input is clamped to the two scopes.
  const scope: QuotaScope = body?.source === "home" ? "home" : "generator";

  // Identity + quota gate (check only; charge on success)
  const session = await getServerSession(authOptions);
  const identity: QuotaIdentity = session?.user?.id
    ? { isAuthenticated: true, userId: session.user.id }
    : { isAuthenticated: false, guestId: resolveGuestId(request) };

  const quota = await getScopedQuotaStatus(identity, scope);
  if (quota.remaining <= 0) {
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
    return NextResponse.json(createErrorResponse(message, { quota }), {
      status: 429,
    });
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

  // QA filter (Oracle only): drop AI-slop; keep raw if everything is filtered out.
  let finalMessages = messages;
  if (plan.filterSlop) {
    const clean = messages.filter((m) => validateFortune(m).valid);
    if (clean.length > 0) finalMessages = clean;
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

  const refreshedQuota = await getScopedQuotaStatus(identity, scope);

  return NextResponse.json(
    createSuccessResponse({
      mode: body.mode,
      params: plan.meta,
      fortunes,
      quota: refreshedQuota,
      source: "ai",
    }),
  );
}
