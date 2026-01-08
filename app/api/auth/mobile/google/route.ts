/**
 * Google Sign In Mobile Authentication Endpoint
 *
 * POST /api/auth/mobile/google
 *
 * Authenticates iOS users with Google Sign In credentials.
 * Validates Google's ID token and creates a mobile session.
 */

import { NextRequest, NextResponse } from "next/server";
import {
  verifyGoogleToken,
  findOrCreateMobileUser,
  createMobileSession,
} from "@/lib/mobile-auth";
import { captureApiError } from "@/lib/error-monitoring";
import {
  isGoogleAuthRequest,
  type MobileAuthResponse,
  type MobileAuthErrorResponse,
} from "@/types/api";

// CORS configuration for mobile apps
function getCorsHeaders(): HeadersInit {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
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

export async function POST(request: NextRequest): Promise<NextResponse> {
  const startTime = Date.now();

  try {
    // Parse request body
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      const errorResponse: MobileAuthErrorResponse = {
        error: "invalid_token",
        message: "Invalid request body",
      };
      return NextResponse.json(errorResponse, {
        status: 400,
        headers: getCorsHeaders(),
      });
    }

    // Validate request structure
    if (!isGoogleAuthRequest(body)) {
      const errorResponse: MobileAuthErrorResponse = {
        error: "invalid_token",
        message: "Missing required fields: idToken, accessToken",
      };
      return NextResponse.json(errorResponse, {
        status: 400,
        headers: getCorsHeaders(),
      });
    }

    const { idToken } = body;

    // Verify Google ID token
    let tokenPayload;
    try {
      tokenPayload = await verifyGoogleToken(idToken);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Token verification failed";

      captureApiError(
        new Error(`Google token verification failed: ${errorMessage}`),
        "/api/auth/mobile/google",
        "POST",
        401,
        Date.now() - startTime,
      );

      const errorResponse: MobileAuthErrorResponse = {
        error: "invalid_token",
        message: "Google ID token verification failed",
      };
      return NextResponse.json(errorResponse, {
        status: 401,
        headers: getCorsHeaders(),
      });
    }

    // Extract user info from token payload
    const googleUserId = tokenPayload.sub;
    const userEmail = tokenPayload.email || null;
    const userName = tokenPayload.name || null;

    // Find or create user
    const user = await findOrCreateMobileUser("google", googleUserId, {
      email: userEmail,
      name: userName,
    });

    // Create mobile session
    const session = await createMobileSession(user.id, "google");

    // Build response
    const response: MobileAuthResponse = {
      token: session.token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        provider: "google",
        createdAt: user.createdAt.toISOString(),
      },
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
      "/api/auth/mobile/google",
      "POST",
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
