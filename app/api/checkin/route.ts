import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { DatabaseManager } from "@/lib/database";

/**
 * Get today's date key in YYYY-MM-DD format (always returns a string)
 */
function getTodayKey(): string {
  const iso = new Date().toISOString();
  const parts = iso.split("T");
  return parts[0] ?? iso.slice(0, 10);
}

/**
 * Get yesterday's date key in YYYY-MM-DD format (always returns a string)
 */
function getYesterdayKey(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  const iso = d.toISOString();
  const parts = iso.split("T");
  return parts[0] ?? iso.slice(0, 10);
}

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

    const userId: string = session.user.id;
    const prisma = DatabaseManager.getInstance();
    const today = getTodayKey();

    // Get today's check-in
    const todayCheckIn = await prisma.dailyCheckIn.findUnique({
      where: {
        userId_dateKey: {
          userId,
          dateKey: today,
        },
      },
    });

    // Get recent check-ins to calculate streak
    const recentCheckIns = await prisma.dailyCheckIn.findMany({
      where: { userId },
      orderBy: { dateKey: "desc" },
      take: 30,
    });

    // Calculate current streak
    const currentStreak =
      recentCheckIns.length > 0 && recentCheckIns[0] != null
        ? recentCheckIns[0].streakCount
        : 0;

    // Calculate total check-ins
    const totalCheckIns = await prisma.dailyCheckIn.count({
      where: { userId },
    });

    const lastCheckIn =
      recentCheckIns.length > 0 && recentCheckIns[0] != null
        ? recentCheckIns[0].dateKey
        : null;

    return NextResponse.json({
      success: true,
      data: {
        checkedInToday: !!todayCheckIn,
        currentStreak,
        totalCheckIns,
        todayBonus: todayCheckIn?.bonusQuota ?? 0,
        lastCheckIn,
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
    const today = getTodayKey();
    const yesterdayKey = getYesterdayKey();
    const userId: string = session.user.id;

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
    await prisma.dailyCheckIn.create({
      data: {
        userId,
        dateKey: today,
        streakCount: newStreak,
        bonusQuota,
      },
    });

    // Grant bonus quota to user's today's fortune quota
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
