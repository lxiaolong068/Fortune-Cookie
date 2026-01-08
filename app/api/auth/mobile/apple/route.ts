/**
 * Apple Sign In Mobile Authentication Endpoint
 *
 * POST /api/auth/mobile/apple
 *
 * Authenticates iOS users with Sign In with Apple credentials.
 * Validates Apple's identity token and creates a mobile session.
 */

import { NextRequest, NextResponse } from "next/server";
import {
  verifyAppleToken,
  findOrCreateMobileUser,
  createMobileSession,
} from "@/lib/mobile-auth";
import { captureApiError } from "@/lib/error-monitoring";
import {
  isAppleAuthRequest,
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
    if (!isAppleAuthRequest(body)) {
      const errorResponse: MobileAuthErrorResponse = {
        error: "invalid_token",
        message:
          "Missing required fields: identityToken, authorizationCode, userIdentifier",
      };
      return NextResponse.json(errorResponse, {
        status: 400,
        headers: getCorsHeaders(),
      });
    }

    const { identityToken, userIdentifier, fullName, email } = body;

    // Verify Apple identity token
    let tokenPayload;
    try {
      tokenPayload = await verifyAppleToken(identityToken);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Token verification failed";

      captureApiError(
        new Error(`Apple token verification failed: ${errorMessage}`),
        "/api/auth/mobile/apple",
        "POST",
        401,
        Date.now() - startTime,
      );

      const errorResponse: MobileAuthErrorResponse = {
        error: "invalid_token",
        message: "Apple identity token verification failed",
      };
      return NextResponse.json(errorResponse, {
        status: 401,
        headers: getCorsHeaders(),
      });
    }

    // Verify the user identifier matches the token's subject claim
    if (tokenPayload.sub !== userIdentifier) {
      captureApiError(
        new Error("User identifier mismatch with token subject"),
        "/api/auth/mobile/apple",
        "POST",
        401,
        Date.now() - startTime,
      );

      const errorResponse: MobileAuthErrorResponse = {
        error: "invalid_token",
        message: "User identifier does not match token",
      };
      return NextResponse.json(errorResponse, {
        status: 401,
        headers: getCorsHeaders(),
      });
    }

    // Find or create user
    // Note: Apple only sends name and email on first authorization
    // Use token email as fallback if request email is not provided
    const userEmail = email || tokenPayload.email || null;
    const userName = fullName || null;

    const user = await findOrCreateMobileUser("apple", userIdentifier, {
      email: userEmail,
      name: userName,
    });

    // Create mobile session
    const session = await createMobileSession(user.id, "apple");

    // Build response
    const response: MobileAuthResponse = {
      token: session.token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        provider: "apple",
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
      "/api/auth/mobile/apple",
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
