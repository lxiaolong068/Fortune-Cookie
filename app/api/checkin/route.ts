import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { DatabaseManager } from "@/lib/database";

/**
 * GET /api/checkin
 * Get current user's check-in status (today's status + streak)
 */
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 },
      );
    }

    const prisma = DatabaseManager.getInstance();
    const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

    // Get today's check-in
    const todayCheckIn = await prisma.dailyCheckIn.findUnique({
      where: {
        userId_dateKey: {
          userId: session.user.id,
          dateKey: today,
        },
      },
    });

    // Get recent check-ins to calculate streak
    const recentCheckIns = await prisma.dailyCheckIn.findMany({
      where: { userId: session.user.id },
      orderBy: { dateKey: "desc" },
      take: 30,
    });

    // Calculate current streak
    let currentStreak = 0;
    if (recentCheckIns.length > 0) {
      currentStreak = recentCheckIns[0].streakCount;
    }

    // Calculate total check-ins
    const totalCheckIns = await prisma.dailyCheckIn.count({
      where: { userId: session.user.id },
    });

    return NextResponse.json({
      success: true,
      data: {
        checkedInToday: !!todayCheckIn,
        currentStreak,
        totalCheckIns,
        todayBonus: todayCheckIn?.bonusQuota ?? 0,
        lastCheckIn: recentCheckIns[0]?.dateKey ?? null,
      },
    });
  } catch (error) {
    console.error("Check-in GET error:", error);
    return NextResponse.json(
      { error: "Failed to get check-in status" },
      { status: 500 },
    );
  }
}

/**
 * POST /api/checkin
 * Perform daily check-in and earn bonus quota
 */
export async function POST(_request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 },
      );
    }

    const prisma = DatabaseManager.getInstance();
    const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
    const userId = session.user.id;

    // Check if already checked in today
    const existingCheckIn = await prisma.dailyCheckIn.findUnique({
      where: {
        userId_dateKey: {
          userId,
          dateKey: today,
        },
      },
    });

    if (existingCheckIn) {
      return NextResponse.json(
        {
          error: "Already checked in today",
          data: {
            checkedInToday: true,
            currentStreak: existingCheckIn.streakCount,
            bonusQuota: existingCheckIn.bonusQuota,
          },
        },
        { status: 409 },
      );
    }

    // Calculate streak: check yesterday's check-in
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayKey = yesterday.toISOString().split("T")[0];

    const yesterdayCheckIn = await prisma.dailyCheckIn.findUnique({
      where: {
        userId_dateKey: {
          userId,
          dateKey: yesterdayKey,
        },
      },
    });

    // Calculate new streak count
    const newStreak = yesterdayCheckIn
      ? yesterdayCheckIn.streakCount + 1
      : 1;

    // Calculate bonus quota based on streak milestones
    // Day 1: +1, Day 3: +2, Day 7: +3, Day 14: +5, Day 30: +10
    let bonusQuota = 1; // base bonus for checking in
    if (newStreak >= 30) bonusQuota = 10;
    else if (newStreak >= 14) bonusQuota = 5;
    else if (newStreak >= 7) bonusQuota = 3;
    else if (newStreak >= 3) bonusQuota = 2;

    // Create check-in record
    const checkIn = await prisma.dailyCheckIn.create({
      data: {
        userId,
        dateKey: today,
        streakCount: newStreak,
        bonusQuota,
      },
    });

    // Grant bonus quota to user's today's fortune quota
    // Update or create today's quota record with bonus
    const existingQuota = await prisma.fortuneQuota.findUnique({
      where: {
        userId_dateKey: {
          userId,
          dateKey: today,
        },
      },
    });

    if (existingQuota) {
      await prisma.fortuneQuota.update({
        where: {
          userId_dateKey: {
            userId,
            dateKey: today,
          },
        },
        data: {
          dailyLimit: existingQuota.dailyLimit + bonusQuota,
        },
      });
    }
    // If no quota record yet, it will be created with the bonus when they first generate

    // Get total check-ins
    const totalCheckIns = await prisma.dailyCheckIn.count({
      where: { userId },
    });

    return NextResponse.json({
      success: true,
      data: {
        checkedInToday: true,
        currentStreak: newStreak,
        bonusQuota,
        totalCheckIns,
        isNewRecord: newStreak > (yesterdayCheckIn?.streakCount ?? 0),
        milestoneReached: [3, 7, 14, 30].includes(newStreak),
      },
    });
  } catch (error) {
    console.error("Check-in POST error:", error);
    return NextResponse.json(
      { error: "Failed to perform check-in" },
      { status: 500 },
    );
  }
}
