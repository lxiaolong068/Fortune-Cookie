import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import {
  getDailyQuotaStatus,
  resolveGuestId,
  type QuotaIdentity,
} from "@/lib/quota";
import { createSuccessResponse, createErrorResponse } from "@/types/api";

function getCorsOrigin(): string {
  if (process.env.NODE_ENV === "production") {
    return process.env.NEXT_PUBLIC_APP_URL || "https://your-domain.com";
  }
  return "*";
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const quotaIdentity: QuotaIdentity = session?.user?.id
      ? { isAuthenticated: true, userId: session.user.id }
      : { isAuthenticated: false, guestId: resolveGuestId(request) };

    const quota = await getDailyQuotaStatus(quotaIdentity);

    const response = NextResponse.json(createSuccessResponse(quota));
    response.headers.set("Cache-Control", "no-store, private");
    response.headers.set("Access-Control-Allow-Origin", getCorsOrigin());
    response.headers.set("Access-Control-Allow-Methods", "GET, OPTIONS");
    response.headers.set(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization, X-Requested-With, X-Client-Id",
    );
    response.headers.set("Access-Control-Max-Age", "86400");
    return response;
  } catch {
    const response = NextResponse.json(
      createErrorResponse("Failed to load quota status."),
      { status: 500 },
    );
    response.headers.set("Cache-Control", "no-store, private");
    response.headers.set("Access-Control-Allow-Origin", getCorsOrigin());
    response.headers.set("Access-Control-Allow-Methods", "GET, OPTIONS");
    response.headers.set(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization, X-Requested-With, X-Client-Id",
    );
    response.headers.set("Access-Control-Max-Age", "86400");
    return response;
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": getCorsOrigin(),
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers":
        "Content-Type, Authorization, X-Requested-With, X-Client-Id",
      "Access-Control-Max-Age": "86400",
    },
  });
}
