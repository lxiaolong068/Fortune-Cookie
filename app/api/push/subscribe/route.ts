import { NextRequest, NextResponse } from "next/server";
import { DatabaseManager } from "@/lib/database";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

/**
 * POST /api/push/subscribe
 * Subscribe to push notifications
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { subscription, preferences } = body;

    if (!subscription || !subscription.endpoint) {
      return NextResponse.json(
        { error: "Invalid subscription data" },
        { status: 400 },
      );
    }

    // Get user session if available
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;

    // Store subscription in database
    // Using upsert to handle re-subscriptions
    const prisma = DatabaseManager.getInstance();
    await prisma.pushSubscription.upsert({
      where: {
        endpoint: subscription.endpoint,
      },
      update: {
        p256dh: subscription.keys?.p256dh || "",
        auth: subscription.keys?.auth || "",
        expirationTime: subscription.expirationTime
          ? new Date(subscription.expirationTime)
          : null,
        userId: userId || null,
        dailyFortune: preferences?.dailyFortune ?? true,
        dailyFortuneTime: preferences?.dailyFortuneTime ?? "08:00",
        specialEvents: preferences?.specialEvents ?? true,
        newFeatures: preferences?.newFeatures ?? false,
        updatedAt: new Date(),
      },
      create: {
        endpoint: subscription.endpoint,
        p256dh: subscription.keys?.p256dh || "",
        auth: subscription.keys?.auth || "",
        expirationTime: subscription.expirationTime
          ? new Date(subscription.expirationTime)
          : null,
        userId: userId || null,
        dailyFortune: preferences?.dailyFortune ?? true,
        dailyFortuneTime: preferences?.dailyFortuneTime ?? "08:00",
        specialEvents: preferences?.specialEvents ?? true,
        newFeatures: preferences?.newFeatures ?? false,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Successfully subscribed to push notifications",
    });
  } catch (error) {
    console.error("Push subscribe error:", error);
    return NextResponse.json(
      { error: "Failed to subscribe to push notifications" },
      { status: 500 },
    );
  }
}
