import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import {
  getDailyQuotaStatus,
  recordFortuneUsage,
  resolveGuestId,
  type QuotaIdentity,
} from "@/lib/quota";
import { createSuccessResponse, createErrorResponse } from "@/types/api";
import { openRouterClient } from "@/lib/openrouter";
import { validateFortune } from "@/lib/prompts";
import {
  normalizeOracleParams,
  buildOracleSystemPrompt,
  buildOracleUserPrompt,
} from "@/lib/prompts/oracle";

export const dynamic = "force-dynamic";

export interface GeneratedFortune {
  message: string;
  luckyNumbers: number[];
}

/**
 * Unified generator endpoint for the v2 tool site.
 * POST { mode: "oracle", params: {...} } → { fortunes: GeneratedFortune[] }
 * Future modes (event / rpg / persona) add branches here.
 */
export async function POST(request: NextRequest) {
  // Parse body
  let body: { mode?: string; params?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      createErrorResponse("Invalid JSON in request body"),
      { status: 400 },
    );
  }

  const mode = body?.mode;
  if (mode !== "oracle") {
    return NextResponse.json(
      createErrorResponse(
        `Unsupported generator mode: ${String(mode)}. Supported: oracle.`,
      ),
      { status: 400 },
    );
  }

  // Identity + quota gate (check only; charge on success)
  const session = await getServerSession(authOptions);
  const identity: QuotaIdentity = session?.user?.id
    ? { isAuthenticated: true, userId: session.user.id }
    : { isAuthenticated: false, guestId: resolveGuestId(request) };

  const quota = await getDailyQuotaStatus(identity);
  if (quota.remaining <= 0) {
    const message = quota.isAuthenticated
      ? "You have reached your daily fortune limit. Please try again tomorrow (UTC)."
      : "You have reached the guest daily limit. Sign in to get more fortunes today.";
    return NextResponse.json(createErrorResponse(message, { quota }), {
      status: 429,
    });
  }

  // Build prompts
  const params = normalizeOracleParams(body.params);
  const systemPrompt = buildOracleSystemPrompt();
  const userPrompt = buildOracleUserPrompt(params);

  // Generate
  let messages: string[];
  try {
    messages = await openRouterClient.generateMessages({
      systemPrompt,
      userPrompt,
      count: params.quantity,
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
      createErrorResponse("The oracle returned nothing. Please try again."),
      { status: 502 },
    );
  }

  // QA filter: drop AI-slop outputs; keep raw if everything is filtered out.
  const clean = messages.filter((m) => validateFortune(m).valid);
  const finalMessages = clean.length > 0 ? clean : messages;

  const fortunes: GeneratedFortune[] = finalMessages.map((message) => ({
    message,
    luckyNumbers: openRouterClient.getLuckyNumbers(),
  }));

  // Charge one quota unit on success
  try {
    await recordFortuneUsage({
      identity,
      theme: "oracle",
      mood: params.fortuneTypes.join(","),
      length: "short",
      hasCustomPrompt: false,
      source: "ai",
    });
  } catch {
    // Non-fatal: never fail a successful generation on usage logging.
  }

  const refreshedQuota = await getDailyQuotaStatus(identity);

  return NextResponse.json(
    createSuccessResponse({
      mode: "oracle",
      params,
      fortunes,
      quota: refreshedQuota,
      source: "ai",
    }),
  );
}
