/**
 * Unified session validation endpoint.
 *
 * GET /api/auth/session
 *
 * Supports:
 * - Authorization: Bearer {mobile_session_token}
 * - NextAuth cookie session (web)
 */

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { validateMobileSession } from "@/lib/mobile-auth";
import { captureApiError } from "@/lib/error-monitoring";
import { type MobileUser, type MobileAuthErrorResponse } from "@/types/api";

function getCorsHeaders(): Record<string, string> {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Max-Age": "86400",
  };
}

function withCors(response: NextResponse): NextResponse {
  const corsHeaders = getCorsHeaders();
  Object.entries(corsHeaders).forEach(([key, value]) => {
    response.headers.set(key, value);
  });
  response.headers.set("Cache-Control", "no-store, private");
  return response;
}

export async function OPTIONS(): Promise<NextResponse> {
  return new NextResponse(null, {
    status: 204,
    headers: getCorsHeaders(),
  });
}

function extractBearerToken(request: NextRequest): string | null {
  const authHeader = request.headers.get("Authorization");
  if (!authHeader) {
    return null;
  }

  const parts = authHeader.split(" ");
  if (parts.length !== 2) {
    return null;
  }

  const prefix = parts[0];
  const token = parts[1];

  if (!prefix || !token || prefix.toLowerCase() !== "bearer") {
    return null;
  }

  const trimmedToken = token.trim();
  return trimmedToken.length > 0 ? trimmedToken : null;
}

export async function GET(request: NextRequest): Promise<NextResponse> {
  const startTime = Date.now();

  try {
    const token = extractBearerToken(request);

    if (token) {
      let result;
      try {
        result = await validateMobileSession(token);
      } catch (dbError) {
        captureApiError(
          dbError instanceof Error ? dbError : new Error("Mobile session validation failed"),
          "/api/auth/session",
          "GET",
          503,
          Date.now() - startTime,
        );
        const errorResponse: MobileAuthErrorResponse = {
          error: "server_error",
          message: "Session service is temporarily unavailable.",
        };
        return withCors(NextResponse.json(errorResponse, { status: 503 }));
      }

      if (!result) {
        const errorResponse: MobileAuthErrorResponse = {
          error: "session_expired",
          message: "Session has expired. Please sign in again.",
        };
        return withCors(NextResponse.json(errorResponse, { status: 401 }));
      }

      const { user, session } = result;

      const response: MobileUser = {
        id: user.id,
        email: user.email,
        name: user.name,
        provider: session.provider as "apple" | "google",
        createdAt: user.createdAt.toISOString(),
      };

      return withCors(NextResponse.json(response, { status: 200 }));
    }

    let session;
    try {
      session = await getServerSession(authOptions);
    } catch (authError) {
      captureApiError(
        authError instanceof Error ? authError : new Error("Web session validation failed"),
        "/api/auth/session",
        "GET",
        503,
        Date.now() - startTime,
      );
      // Return 401 instead of 500 when session service is unavailable —
      // the client can treat this as "not authenticated" and continue gracefully
      const errorResponse: MobileAuthErrorResponse = {
        error: "unauthorized",
        message: "Session validation is temporarily unavailable.",
      };
      return withCors(NextResponse.json(errorResponse, { status: 401 }));
    }

    if (session?.user) {
      return withCors(NextResponse.json(session, { status: 200 }));
    }

    const errorResponse: MobileAuthErrorResponse = {
      error: "unauthorized",
      message: "Missing or invalid Authorization header. Use: Bearer {token}",
    };
    return withCors(NextResponse.json(errorResponse, { status: 401 }));
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";

    captureApiError(
      error instanceof Error ? error : new Error(errorMessage),
      "/api/auth/session",
      "GET",
      500,
      Date.now() - startTime,
    );

    const errorResponse: MobileAuthErrorResponse = {
      error: "server_error",
      message: "An unexpected error occurred. Please try again.",
    };
    return withCors(NextResponse.json(errorResponse, { status: 500 }));
  }
}
