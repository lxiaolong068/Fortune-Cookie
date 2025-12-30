/**
 * IndexNow API Route
 * 用于提交 URL 到 IndexNow，通知搜索引擎内容更新
 */

import { NextRequest, NextResponse } from "next/server";
import {
  submitUrl,
  submitUrls,
  submitUrlsToAllEngines,
  submitSitemapUrls,
  INDEXNOW_CONFIG,
  type IndexNowResult,
  type IndexNowBatchResult,
} from "@/lib/indexnow";
import { createSuccessResponse, createErrorResponse } from "@/types/api";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// 添加安全头部
function addSecurityHeaders(response: NextResponse): NextResponse {
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-XSS-Protection", "1; mode=block");
  return response;
}

// 验证管理员令牌
function validateAdminToken(request: NextRequest): boolean {
  const adminToken = process.env.INDEXNOW_ADMIN_TOKEN;
  if (!adminToken) {
    // 如果没有配置管理员令牌，禁用此功能
    return false;
  }

  const authHeader = request.headers.get("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return false;
  }

  const token = authHeader.substring(7);
  return token === adminToken;
}

// 验证请求来源（仅允许认证用户或管理员令牌）
async function validateAccess(request: NextRequest): Promise<boolean> {
  // 检查管理员令牌
  if (validateAdminToken(request)) {
    return true;
  }

  // 检查用户认证
  const session = await getServerSession(authOptions);
  return !!session?.user;
}

/**
 * POST /api/indexnow
 * 提交 URL 到 IndexNow
 *
 * Request body:
 * - url: string (单个 URL)
 * - urls: string[] (多个 URL)
 * - action: "single" | "batch" | "all_engines" | "sitemap"
 */
export async function POST(request: NextRequest) {
  try {
    // 验证访问权限
    const hasAccess = await validateAccess(request);
    if (!hasAccess) {
      const response = NextResponse.json(
        createErrorResponse("Unauthorized. Please sign in or provide a valid admin token."),
        { status: 401 },
      );
      return addSecurityHeaders(response);
    }

    const body = await request.json();
    const { url, urls, action = "single" } = body;

    let result: IndexNowResult | IndexNowBatchResult;

    switch (action) {
      case "single":
        if (!url) {
          const response = NextResponse.json(
            createErrorResponse("URL is required for single submission"),
            { status: 400 },
          );
          return addSecurityHeaders(response);
        }
        result = await submitUrl(url);
        break;

      case "batch":
        if (!urls || !Array.isArray(urls) || urls.length === 0) {
          const response = NextResponse.json(
            createErrorResponse("URLs array is required for batch submission"),
            { status: 400 },
          );
          return addSecurityHeaders(response);
        }
        result = await submitUrls(urls);
        break;

      case "all_engines":
        if (!urls || !Array.isArray(urls) || urls.length === 0) {
          const response = NextResponse.json(
            createErrorResponse("URLs array is required for all engines submission"),
            { status: 400 },
          );
          return addSecurityHeaders(response);
        }
        result = await submitUrlsToAllEngines(urls);
        break;

      case "sitemap":
        result = await submitSitemapUrls();
        break;

      default:
        const response = NextResponse.json(
          createErrorResponse(`Invalid action: ${action}. Use: single, batch, all_engines, sitemap`),
          { status: 400 },
        );
        return addSecurityHeaders(response);
    }

    // 记录日志
    console.log(`[IndexNow API] Action: ${action}, Result:`, JSON.stringify(result, null, 2));

    const responseData = createSuccessResponse(result, {
      action,
      timestamp: new Date().toISOString(),
      host: INDEXNOW_CONFIG.host,
    });

    const response = NextResponse.json(responseData);
    return addSecurityHeaders(response);
  } catch (error) {
    console.error("[IndexNow API] Error:", error);

    const response = NextResponse.json(
      createErrorResponse(
        error instanceof Error ? error.message : "Internal server error",
      ),
      { status: 500 },
    );
    return addSecurityHeaders(response);
  }
}

/**
 * GET /api/indexnow
 * 获取 IndexNow 配置信息（公开）
 */
export async function GET() {
  const responseData = createSuccessResponse({
    enabled: true,
    host: INDEXNOW_CONFIG.host,
    keyLocation: INDEXNOW_CONFIG.keyLocation,
    endpoints: INDEXNOW_CONFIG.endpoints,
  });

  const response = NextResponse.json(responseData);
  return addSecurityHeaders(response);
}

// CORS 预检请求
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": process.env.NEXT_PUBLIC_APP_URL || "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
      "Access-Control-Max-Age": "86400",
      "X-Content-Type-Options": "nosniff",
      "X-Frame-Options": "DENY",
      "X-XSS-Protection": "1; mode=block",
    },
  });
}

