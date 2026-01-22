import { NextRequest, NextResponse } from "next/server";
import { DatabaseManager } from "@/lib/database";

/**
 * PUT /api/push/preferences
 * Update notification preferences
 */
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { endpoint, preferences } = body;

    if (!endpoint) {
      return NextResponse.json(
        { error: "Endpoint is required" },
        { status: 400 },
      );
    }

    // Update preferences in database
    const prisma = DatabaseManager.getInstance();
    await prisma.pushSubscription.update({
      where: {
        endpoint,
      },
      data: {
        dailyFortune: preferences?.dailyFortune,
        dailyFortuneTime: preferences?.dailyFortuneTime,
        specialEvents: preferences?.specialEvents,
        newFeatures: preferences?.newFeatures,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      message: "Preferences updated successfully",
    });
  } catch (error) {
    console.error("Push preferences error:", error);
    return NextResponse.json(
      { error: "Failed to update preferences" },
      { status: 500 },
    );
  }
}
