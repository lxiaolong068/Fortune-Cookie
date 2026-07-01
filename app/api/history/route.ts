import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getGenerationHistory } from "@/lib/generation-history";

// GET - list the authenticated user's most recent generation history (Profile page).
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json(
      { error: "Unauthorized", history: [] },
      { status: 401 },
    );
  }

  try {
    const history = await getGenerationHistory(session.user.id);
    return NextResponse.json({ success: true, history, count: history.length });
  } catch (error) {
    console.error("Failed to get generation history:", error);
    return NextResponse.json(
      { error: "Failed to get history", history: [] },
      { status: 500 },
    );
  }
}
