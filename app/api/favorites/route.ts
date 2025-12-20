import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import {
  getUserFavorites,
  addUserFavorite,
  removeUserFavorite,
  syncLocalToUser,
  type FavoriteInput,
} from "@/lib/favorites";

// GET - Get user's favorites
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized", favorites: [] },
        { status: 401 }
      );
    }

    const favorites = await getUserFavorites(session.user.id);

    return NextResponse.json({
      success: true,
      favorites,
      count: favorites.length,
    });
  } catch (error) {
    console.error("Failed to get favorites:", error);
    return NextResponse.json(
      { error: "Failed to get favorites", favorites: [] },
      { status: 500 }
    );
  }
}

// POST - Add a favorite
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json() as FavoriteInput;

    if (!body.message || typeof body.message !== "string") {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    const favorite = await addUserFavorite(session.user.id, {
      message: body.message,
      luckyNumbers: body.luckyNumbers,
      theme: body.theme,
      category: body.category,
      source: body.source,
    });

    if (!favorite) {
      return NextResponse.json(
        { error: "Already favorited or failed to add" },
        { status: 409 }
      );
    }

    return NextResponse.json({
      success: true,
      favorite,
    });
  } catch (error) {
    console.error("Failed to add favorite:", error);
    return NextResponse.json(
      { error: "Failed to add favorite" },
      { status: 500 }
    );
  }
}

// DELETE - Remove a favorite
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const favoriteId = searchParams.get("id");

    if (!favoriteId) {
      return NextResponse.json(
        { error: "Favorite ID is required" },
        { status: 400 }
      );
    }

    const success = await removeUserFavorite(session.user.id, favoriteId);

    if (!success) {
      return NextResponse.json(
        { error: "Failed to remove favorite" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error("Failed to remove favorite:", error);
    return NextResponse.json(
      { error: "Failed to remove favorite" },
      { status: 500 }
    );
  }
}

// PUT - Sync local favorites to user account
export async function PUT() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const synced = await syncLocalToUser(session.user.id);

    return NextResponse.json({
      success: true,
      synced,
    });
  } catch (error) {
    console.error("Failed to sync favorites:", error);
    return NextResponse.json(
      { error: "Failed to sync favorites" },
      { status: 500 }
    );
  }
}
