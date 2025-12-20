import { NextRequest, NextResponse } from "next/server";
import { openRouterClient, FortuneRequest, type FortuneResponse } from "@/lib/openrouter";
import {
  captureApiError,
  captureUserAction,
  captureBusinessEvent,
} from "@/lib/error-monitoring";
import {
  rateLimiters,
  cacheManager,
  generateRequestHash,
} from "@/lib/redis-cache";
import { EdgeCacheManager, CachePerformanceMonitor } from "@/lib/edge-cache";
import { createSuccessResponse, createErrorResponse } from "@/types/api";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import {
  consumeDailyQuota,
  recordFortuneUsage,
  resolveGuestId,
  type QuotaIdentity,
} from "@/lib/quota";
import {
  validateApiKey,
  getEnhancedRateLimit,
  getAuthTier,
  getMaskedApiKey,
  getRateLimitHeaders,
  getRateLimitErrorResponse,
  getAIRateLimitErrorResponse,
} from "@/lib/api-auth";

// 输入cleanup和验证utility/tool
function sanitizeString(input: unknown, maxLength: number = 500): string {
  if (typeof input !== "string") return "";

  // 移除潜在的恶意字符和脚本
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "") // 移除script标签
    .replace(/<[^>]*>/g, "") // 移除HTML标签
    .replace(/javascript:/gi, "") // 移除javascript协议
    .replace(/on\w+\s*=/gi, "") // 移除event处理器
    .trim()
    .slice(0, maxLength); // limitlength
}

function validateTheme(theme: string): boolean {
  const validThemes = [
    "funny",
    "inspirational",
    "love",
    "success",
    "wisdom",
    "random",
  ];
  return validThemes.includes(theme);
}

function validateMood(mood: string): boolean {
  const validMoods = ["positive", "neutral", "motivational", "humorous"];
  return validMoods.includes(mood);
}

function validateLength(length: string): boolean {
  const validLengths = ["short", "medium", "long"];
  return validLengths.includes(length);
}

// CORSconfiguration
function getCorsOrigin(): string {
  if (process.env.NODE_ENV === "production") {
    return process.env.NEXT_PUBLIC_APP_URL || "https://your-domain.com";
  }
  return "*";
}

// get/retrieveclient标识符
function getClientIdentifier(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  const ip = forwarded ? forwarded.split(",")[0]?.trim() : request.ip;
  return ip || "unknown";
}

export async function POST(request: NextRequest) {
  const startTime = Date.now();

  try {
    // Validate API key (if provided)
    if (!validateApiKey(request)) {
      return NextResponse.json(
        createErrorResponse("Invalid API key provided"),
        { status: 401 },
      );
    }

    const session = await getServerSession(authOptions);

    // Get authentication tier and enhanced rate limit
    const authTier = getAuthTier(request);
    const enhancedLimit = getEnhancedRateLimit(request);
    const clientId = getClientIdentifier(request);
    const maskedKey = getMaskedApiKey(request);

    // Distributed rate limiting check (only when Redis is available)
    if (rateLimiters) {
      // Use enhanced rate limit based on authentication
      const rateLimitResult = await rateLimiters.fortune.limit(clientId);

      if (!rateLimitResult.success) {
        // Record rate limit event with authentication tier
        captureUserAction("rate_limit_exceeded", "fortune_api", clientId, {
          limit: enhancedLimit,
          remaining: rateLimitResult.remaining,
          reset: rateLimitResult.reset,
          endpoint: "/api/fortune",
          authTier,
          apiKey: maskedKey,
        });

        CachePerformanceMonitor.recordError();

        return NextResponse.json(
          getRateLimitErrorResponse(
            enhancedLimit,
            rateLimitResult.remaining,
            rateLimitResult.reset,
            authTier,
          ),
          {
            status: 429,
            headers: getRateLimitHeaders(
              enhancedLimit,
              rateLimitResult.remaining,
              rateLimitResult.reset,
            ),
          },
        );
      }
    }

    // Parse and validate request body
    let body: Record<string, unknown>;
    try {
      body = (await request.json()) as Record<string, unknown>;
    } catch {
      return NextResponse.json(
        createErrorResponse("Invalid JSON in request body"),
        { status: 400 },
      );
    }

    // Input validation and sanitization
    const theme = body.theme ? sanitizeString(body.theme, 50) : "random";
    const mood = body.mood ? sanitizeString(body.mood, 50) : "positive";
    const length = body.length ? sanitizeString(body.length, 50) : "medium";
    const customPrompt = body.customPrompt
      ? sanitizeString(body.customPrompt, 500)
      : undefined;

    // Validate parameters
    if (!validateTheme(theme)) {
      return NextResponse.json(
        createErrorResponse(
          "Invalid theme. Must be one of: funny, inspirational, love, success, wisdom, random",
        ),
        { status: 400 },
      );
    }

    if (!validateMood(mood)) {
      return NextResponse.json(
        createErrorResponse(
          "Invalid mood. Must be one of: positive, neutral, motivational, humorous",
        ),
        { status: 400 },
      );
    }

    if (!validateLength(length)) {
      return NextResponse.json(
        createErrorResponse(
          "Invalid length. Must be one of: short, medium, long",
        ),
        { status: 400 },
      );
    }

    // checkcustom提示的内容安全性
    if (customPrompt && customPrompt.length > 0) {
      const suspiciousPatterns = [
        /ignore\s+previous\s+instructions/i,
        /system\s+prompt/i,
        /you\s+are\s+now/i,
        /forget\s+everything/i,
        /new\s+instructions/i,
      ];

      if (suspiciousPatterns.some((pattern) => pattern.test(customPrompt))) {
        return NextResponse.json(
          createErrorResponse(
            "Custom prompt contains potentially harmful content",
          ),
          { status: 400 },
        );
      }
    }

    const quotaIdentity: QuotaIdentity = session?.user?.id
      ? { isAuthenticated: true, userId: session.user.id }
      : { isAuthenticated: false, guestId: resolveGuestId(request) };

    const quotaResult = await consumeDailyQuota(quotaIdentity);
    if (!quotaResult.allowed) {
      captureUserAction("daily_quota_exceeded", "fortune_api", clientId, {
        authTier,
        apiKey: maskedKey,
        limit: quotaResult.quota.limit,
        used: quotaResult.quota.used,
        resetAtUtc: quotaResult.quota.resetsAtUtc,
        userId: quotaIdentity.userId,
        guestId: quotaIdentity.guestId,
      });

      const message = quotaResult.quota.isAuthenticated
        ? "You have reached your daily fortune limit. Please try again tomorrow (UTC)."
        : "You have reached the guest daily limit. Sign in to get more fortunes today.";

      return NextResponse.json(
        createErrorResponse(message, {
          quota: quotaResult.quota,
          suggestion: quotaResult.quota.isAuthenticated
            ? "Daily quota resets at 00:00 UTC."
            : "Sign in with Google to get a higher daily limit.",
        }),
        { status: 429 },
      );
    }

    const fortuneRequest: FortuneRequest = {
      theme: theme as FortuneRequest["theme"],
      mood: mood as FortuneRequest["mood"],
      length: length as FortuneRequest["length"],
      customPrompt,
    };

    // generation/generaterequesthashused forcache
    const requestHash = generateRequestHash(fortuneRequest);

    // checkcache
    let fortune = await cacheManager.getCachedFortune<FortuneResponse>(requestHash);

    // Never serve cached fallback/database fortunes; they can get stuck after a transient AI failure.
    if (fortune && fortune.source !== "ai") {
      await cacheManager.deleteCachedFortune(requestHash);
      fortune = null;
    }

    if (fortune) {
      // cache命中
      CachePerformanceMonitor.recordHit();

      captureBusinessEvent("fortune_cache_hit", {
        theme: fortuneRequest.theme,
        requestHash,
        responseTime: Date.now() - startTime,
      });
    } else {
      // Cache miss - will call AI, check hourly rate limit first
      CachePerformanceMonitor.recordMiss();

      // Check AI generation rate limit (1 per hour per IP)
      if (rateLimiters?.aiGeneration) {
        const aiLimitResult = await rateLimiters.aiGeneration.limit(clientId);

        if (!aiLimitResult.success) {
          // Record AI rate limit event
          captureUserAction("ai_rate_limit_exceeded", "fortune_api", clientId, {
            reset: aiLimitResult.reset,
            endpoint: "/api/fortune",
            authTier,
            apiKey: maskedKey,
          });

          return NextResponse.json(
            getAIRateLimitErrorResponse(aiLimitResult.reset),
            {
              status: 429,
              headers: {
                "X-RateLimit-Limit": "1",
                "X-RateLimit-Remaining": "0",
                "X-RateLimit-Reset": aiLimitResult.reset.toString(),
                "X-RateLimit-Window": "1h",
              },
            },
          );
        }
      } else {
        // Redis unavailable - allow AI generation in development, but log warning
        console.warn(
          "⚠️ Redis unavailable: AI generation proceeding without rate limiting. " +
          "This is acceptable for development but should be configured for production."
        );
      }

      fortune = await openRouterClient.generateFortune(fortuneRequest);

      // Cache result (if not custom prompt)
      if (!fortuneRequest.customPrompt) {
        // Only cache real AI results; never cache fallback/database responses
        if (fortune?.source === "ai") {
          await cacheManager.cacheFortune(requestHash, fortune);
        }
      }
    }

    // Record successful business event
    const responseTime = Date.now() - startTime;
    captureBusinessEvent("fortune_generated", {
      theme: fortuneRequest.theme,
      mood: fortuneRequest.mood,
      length: fortuneRequest.length,
      hasCustomPrompt: !!fortuneRequest.customPrompt,
      responseTime,
      source: fortune.source || "unknown",
      cached: !!fortune.cached,
    });

    // Record user action
    captureUserAction("generate_fortune", "fortune_generator", clientId, {
      theme: fortuneRequest.theme,
      responseTime,
      cached: !!fortune.cached,
    });

    try {
      await recordFortuneUsage({
        identity: quotaIdentity,
        theme,
        mood,
        length,
        hasCustomPrompt: !!customPrompt,
        source: fortune.source || "unknown",
      });
    } catch (usageError) {
      console.warn("Failed to record fortune usage:", usageError);
    }

    // Create optimized response with consistent envelope
    const responseData = createSuccessResponse(fortune, {
      cached: !!fortune.cached,
      cacheKey: requestHash,
      responseTime,
      source: fortune.source || "unknown",
      aiError: fortune.aiError,
      quota: quotaResult.quota,
    });

    const response = EdgeCacheManager.optimizeApiResponse(
      responseData,
      requestHash,
      fortuneRequest.customPrompt || fortune?.source !== "ai" ? 0 : 300, // Only edge-cache real AI results
    );

    // Disable edge caching when quota metadata is included (user-specific response).
    response.headers.set("Cache-Control", "no-store, private");
    response.headers.set("CDN-Cache-Control", "no-store");
    response.headers.set(
      "Vary",
      "Accept-Encoding, Authorization, X-Client-Id",
    );

    // CORS headers
    response.headers.set("Access-Control-Allow-Origin", getCorsOrigin());
    response.headers.set("Access-Control-Allow-Methods", "POST, OPTIONS");
    response.headers.set(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization, X-Requested-With, X-Client-Id",
    );
    response.headers.set("Access-Control-Max-Age", "86400");

    // additional的安全头部
    response.headers.set("X-Content-Type-Options", "nosniff");
    response.headers.set("X-Frame-Options", "DENY");
    response.headers.set("X-XSS-Protection", "1; mode=block");

    // 限流information头部 - 只在Redisavailableadd
    // (rateLimitResult is now scoped inside if block, headers not needed for success case)

    return response;
  } catch (error) {
    const responseTime = Date.now() - startTime;

    // record/logcache错误
    CachePerformanceMonitor.recordError();

    // record/logAPI错误
    captureApiError(
      error instanceof Error ? error : new Error(String(error)),
      "/api/fortune",
      "POST",
      500,
      responseTime,
    );

    console.error("Fortune generation error:", error);

    const errorResponse = NextResponse.json(
      createErrorResponse("Failed to generate fortune. Please try again.", {
        responseTime,
      }),
      { status: 500 },
    );

    // add安全头部
    errorResponse.headers.set("X-Content-Type-Options", "nosniff");
    errorResponse.headers.set("X-Frame-Options", "DENY");
    errorResponse.headers.set("X-XSS-Protection", "1; mode=block");

    return errorResponse;
  }
}

export async function GET(request: NextRequest) {
  // Health check endpoint with caching
  try {
    void request;
    // checkcache的健康状态
    const cachedHealth = await cacheManager.getCachedApiResponse(
      "health",
      "check",
    );

    if (cachedHealth) {
      CachePerformanceMonitor.recordHit();

      const response = EdgeCacheManager.optimizeApiResponse(
        cachedHealth,
        "health-check",
        60,
      );
      response.headers.set("X-Cache", "HIT");
      return response;
    }

    CachePerformanceMonitor.recordMiss();

    // Check Redis connection
    const redisHealthy = await cacheManager.isConnected();
    const isHealthy = await openRouterClient.healthCheck();

    const healthData = {
      status: "ok",
      aiEnabled: isHealthy,
      cacheEnabled: redisHealthy,
      timestamp: new Date().toISOString(),
      cacheStats: CachePerformanceMonitor.getStats(),
    };

    const responseData = createSuccessResponse(healthData, {
      cached: false,
    });

    // cacheHealth check结果
    await cacheManager.cacheApiResponse("health", "check", responseData);

    const response = EdgeCacheManager.optimizeApiResponse(
      responseData,
      "health-check",
      60,
    );
    response.headers.set("X-Cache", "MISS");

    return response;
  } catch (error) {
    CachePerformanceMonitor.recordError();

    captureApiError(
      error instanceof Error ? error : new Error(String(error)),
      "/api/fortune",
      "GET",
      503,
    );

    return NextResponse.json(createErrorResponse("Service unavailable"), {
      status: 503,
    });
  }
}

export async function OPTIONS() {
  // Handle CORS preflight with enhanced security
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": getCorsOrigin(),
      "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
      "Access-Control-Allow-Headers":
        "Content-Type, Authorization, X-Requested-With, X-Client-Id",
      "Access-Control-Max-Age": "86400",
      "X-Content-Type-Options": "nosniff",
      "X-Frame-Options": "DENY",
      "X-XSS-Protection": "1; mode=block",
    },
  });
}
