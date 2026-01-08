/**
 * Mobile Session Validation Endpoint
 *
 * GET /api/auth/mobile/session
 *
 * Validates an existing mobile session token and returns current user info.
 * Used by iOS app to check if session is still valid on app launch.
 */

import { NextRequest, NextResponse } from "next/server";
import { validateMobileSession } from "@/lib/mobile-auth";
import { captureApiError } from "@/lib/error-monitoring";
import { type MobileUser, type MobileAuthErrorResponse } from "@/types/api";

// CORS configuration for mobile apps
function getCorsHeaders(): HeadersInit {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Max-Age": "86400",
  };
}

// Handle preflight requests
export async function OPTIONS(): Promise<NextResponse> {
  return new NextResponse(null, {
    status: 204,
    headers: getCorsHeaders(),
  });
}

/**
 * Extract Bearer token from Authorization header
 */
function extractBearerToken(request: NextRequest): string | null {
  const authHeader = request.headers.get("Authorization");
  if (!authHeader) {
    return null;
  }

  // Check for Bearer prefix (case-insensitive)
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
    // Extract Bearer token from Authorization header
    const token = extractBearerToken(request);

    if (!token) {
      const errorResponse: MobileAuthErrorResponse = {
        error: "unauthorized",
        message: "Missing or invalid Authorization header. Use: Bearer {token}",
      };
      return NextResponse.json(errorResponse, {
        status: 401,
        headers: getCorsHeaders(),
      });
    }

    // Validate the session
    const result = await validateMobileSession(token);

    if (!result) {
      const errorResponse: MobileAuthErrorResponse = {
        error: "session_expired",
        message: "Session has expired. Please sign in again.",
      };
      return NextResponse.json(errorResponse, {
        status: 401,
        headers: getCorsHeaders(),
      });
    }

    const { user, session } = result;

    // Build response matching the MobileUser interface
    const response: MobileUser = {
      id: user.id,
      email: user.email,
      name: user.name,
      provider: session.provider as "apple" | "google",
      createdAt: user.createdAt.toISOString(),
    };

    return NextResponse.json(response, {
      status: 200,
      headers: getCorsHeaders(),
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";

    captureApiError(
      error instanceof Error ? error : new Error(errorMessage),
      "/api/auth/mobile/session",
      "GET",
      500,
      Date.now() - startTime,
    );

    const errorResponse: MobileAuthErrorResponse = {
      error: "server_error",
      message: "An unexpected error occurred. Please try again.",
    };
    return NextResponse.json(errorResponse, {
      status: 500,
      headers: getCorsHeaders(),
    });
  }
}
