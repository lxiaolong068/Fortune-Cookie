import { NextRequest, NextResponse } from "next/server";
import { DatabaseManager } from "@/lib/database";

/**
 * POST /api/push/unsubscribe
 * Unsubscribe from push notifications
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { endpoint } = body;

    if (!endpoint) {
      return NextResponse.json(
        { error: "Endpoint is required" },
        { status: 400 },
      );
    }

    // Delete subscription from database
    const prisma = DatabaseManager.getInstance();
    await prisma.pushSubscription
      .delete({
        where: {
          endpoint,
        },
      })
      .catch(() => {
        // Ignore if subscription doesn't exist
      });

    return NextResponse.json({
      success: true,
      message: "Successfully unsubscribed from push notifications",
    });
  } catch (error) {
    console.error("Push unsubscribe error:", error);
    return NextResponse.json(
      { error: "Failed to unsubscribe from push notifications" },
      { status: 500 },
    );
  }
}
