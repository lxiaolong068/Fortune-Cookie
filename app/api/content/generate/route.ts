/**
 * Content Generation API Route
 * 内容自动生成 API 路由
 *
 * GET  /api/content/generate  — Vercel Cron 触发 (验证 CRON_SECRET)
 * POST /api/content/generate  — 手动 HTTP 触发 (验证 Authorization: Bearer)
 */

import { NextRequest, NextResponse } from "next/server";
import { createSuccessResponse, createErrorResponse } from "@/types/api";
import { runContentGeneration, type PipelineOptions } from "@/lib/content-pipeline";

// ─── 认证辅助函数 ─────────────────────────────────────────────────────────────

function isAuthorizedCron(request: NextRequest): boolean {
  const cronSecret = process.env.CRON_SECRET;
  const authHeader = request.headers.get("authorization");
  // Vercel 在 cron 请求中自动注入 CRON_SECRET
  if (cronSecret && authHeader === `Bearer ${cronSecret}`) return true;
  // 兼容 CONTENT_ADMIN_TOKEN
  const adminToken = process.env.CONTENT_ADMIN_TOKEN;
  if (adminToken && authHeader === `Bearer ${adminToken}`) return true;
  return false;
}

// ─── GET /api/content/generate — Vercel Cron 触发 ────────────────────────────

export async function GET(request: NextRequest): Promise<NextResponse> {
  if (!isAuthorizedCron(request)) {
    return NextResponse.json(createErrorResponse("Unauthorized"), { status: 401 });
  }

  const options: PipelineOptions = {
    translate: process.env.CONTENT_AUTO_TRANSLATE === "true",
    notify: process.env.CONTENT_AUTO_INDEXNOW === "true",
  };

  try {
    const result = await runContentGeneration(options);

    return NextResponse.json(
      createSuccessResponse(result, {
        triggeredAt: new Date().toISOString(),
        trigger: "cron",
      }),
      { status: result.success ? 200 : 500 },
    );
  } catch (err) {
    console.error("[ContentGenerate] Fatal error:", err);
    return NextResponse.json(
      createErrorResponse(
        err instanceof Error ? err.message : "Internal server error",
        { triggeredAt: new Date().toISOString() },
      ),
      { status: 500 },
    );
  }
}

// ─── POST /api/content/generate — 手动触发 ────────────────────────────────────

interface GenerateRequestBody {
  model?: string;
  topic?: string;
  translate?: boolean;
  notify?: boolean;
  dryRun?: boolean;
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  // 验证 CONTENT_ADMIN_TOKEN
  const adminToken = process.env.CONTENT_ADMIN_TOKEN;
  if (!adminToken) {
    return NextResponse.json(
      createErrorResponse("CONTENT_ADMIN_TOKEN not configured"),
      { status: 503 },
    );
  }

  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${adminToken}`) {
    return NextResponse.json(createErrorResponse("Unauthorized"), { status: 401 });
  }

  // 解析请求体
  let body: GenerateRequestBody = {};
  try {
    const text = await request.text();
    if (text) {
      body = JSON.parse(text) as GenerateRequestBody;
    }
  } catch {
    return NextResponse.json(createErrorResponse("Invalid JSON body"), { status: 400 });
  }

  const options: PipelineOptions = {
    model: body.model,
    topic: body.topic,
    translate: body.translate ?? process.env.CONTENT_AUTO_TRANSLATE === "true",
    notify: body.notify ?? process.env.CONTENT_AUTO_INDEXNOW === "true",
    dryRun: body.dryRun ?? false,
  };

  try {
    const result = await runContentGeneration(options);

    return NextResponse.json(
      createSuccessResponse(result, {
        triggeredAt: new Date().toISOString(),
        trigger: "manual",
        options,
      }),
      { status: result.success ? 200 : 500 },
    );
  } catch (err) {
    console.error("[ContentGenerate] Fatal error:", err);
    return NextResponse.json(
      createErrorResponse(
        err instanceof Error ? err.message : "Internal server error",
        { triggeredAt: new Date().toISOString() },
      ),
      { status: 500 },
    );
  }
}
