/**
 * Favorites System - Hybrid Storage
 *
 * Guest users: localStorage
 * Authenticated users: Database (synced) with localStorage fallback
 */

import { db as prisma } from "@/lib/database";
import type { Favorite } from "@prisma/client";

// Types
export interface FavoriteItem {
  id: string;
  message: string;
  luckyNumbers?: number[];
  theme?: string;
  category?: string;
  source?: string;
  createdAt: Date;
}

export interface FavoritesState {
  items: FavoriteItem[];
  isLoading: boolean;
  error: string | null;
}

// Constants
const STORAGE_KEY = "fortune_favorites";
const MAX_FAVORITES = 50;

// ============================================
// Local Storage Functions (Guest Users)
// ============================================

export function getLocalFavorites(): FavoriteItem[] {
  if (typeof window === "undefined") return [];

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];

    const parsed = JSON.parse(stored) as FavoriteItem[];
    return parsed.map((item) => ({
      ...item,
      createdAt: new Date(item.createdAt),
    }));
  } catch (error) {
    console.error("Failed to load local favorites:", error);
    return [];
  }
}

export function saveLocalFavorites(favorites: FavoriteItem[]): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
  } catch (error) {
    console.error("Failed to save local favorites:", error);
  }
}

export function addLocalFavorite(
  item: Omit<FavoriteItem, "id" | "createdAt">,
): FavoriteItem | null {
  const favorites = getLocalFavorites();

  // Check if already exists
  if (favorites.some((f) => f.message === item.message)) {
    return null;
  }

  // Enforce max limit
  if (favorites.length >= MAX_FAVORITES) {
    favorites.pop();
  }

  const newFavorite: FavoriteItem = {
    ...item,
    id: `local_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
    createdAt: new Date(),
  };

  favorites.unshift(newFavorite);
  saveLocalFavorites(favorites);

  return newFavorite;
}

export function removeLocalFavorite(id: string): boolean {
  const favorites = getLocalFavorites();
  const index = favorites.findIndex((f) => f.id === id);

  if (index === -1) return false;

  favorites.splice(index, 1);
  saveLocalFavorites(favorites);

  return true;
}

export function isLocalFavorite(message: string): boolean {
  const favorites = getLocalFavorites();
  return favorites.some((f) => f.message === message);
}

export function clearLocalFavorites(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
}

// ============================================
// Database Functions (Authenticated Users)
// ============================================

export async function getUserFavorites(
  userId: string,
): Promise<FavoriteItem[]> {
  try {
    const favorites = await prisma.favorite.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: MAX_FAVORITES,
    });

    return favorites.map((f: Favorite) => ({
      id: f.id,
      message: f.message,
      luckyNumbers: f.luckyNumbers ? JSON.parse(f.luckyNumbers) : undefined,
      theme: f.theme || undefined,
      category: f.category || undefined,
      source: f.source || undefined,
      createdAt: f.createdAt,
    }));
  } catch (error) {
    console.error("Failed to get user favorites:", error);
    return [];
  }
}

export async function addUserFavorite(
  userId: string,
  item: Omit<FavoriteItem, "id" | "createdAt">,
): Promise<FavoriteItem | null> {
  try {
    // Check count limit
    const count = await prisma.favorite.count({ where: { userId } });
    if (count >= MAX_FAVORITES) {
      // Remove oldest
      const oldest = await prisma.favorite.findFirst({
        where: { userId },
        orderBy: { createdAt: "asc" },
      });
      if (oldest) {
        await prisma.favorite.delete({ where: { id: oldest.id } });
      }
    }

    const favorite = await prisma.favorite.create({
      data: {
        userId,
        message: item.message,
        luckyNumbers: item.luckyNumbers
          ? JSON.stringify(item.luckyNumbers)
          : null,
        theme: item.theme || null,
        category: item.category || null,
        source: item.source || null,
      },
    });

    return {
      id: favorite.id,
      message: favorite.message,
      luckyNumbers: favorite.luckyNumbers
        ? JSON.parse(favorite.luckyNumbers)
        : undefined,
      theme: favorite.theme || undefined,
      category: favorite.category || undefined,
      source: favorite.source || undefined,
      createdAt: favorite.createdAt,
    };
  } catch (error) {
    // Handle unique constraint (already favorited)
    if (error instanceof Error && error.message.includes("Unique constraint")) {
      return null;
    }
    console.error("Failed to add user favorite:", error);
    return null;
  }
}

export async function removeUserFavorite(
  userId: string,
  favoriteId: string,
): Promise<boolean> {
  try {
    await prisma.favorite.delete({
      where: {
        id: favoriteId,
        userId,
      },
    });
    return true;
  } catch (error) {
    console.error("Failed to remove user favorite:", error);
    return false;
  }
}

export async function isUserFavorite(
  userId: string,
  message: string,
): Promise<boolean> {
  try {
    const favorite = await prisma.favorite.findFirst({
      where: { userId, message },
    });
    return !!favorite;
  } catch (error) {
    console.error("Failed to check user favorite:", error);
    return false;
  }
}

export async function syncLocalToUser(userId: string): Promise<number> {
  const localFavorites = getLocalFavorites();
  if (localFavorites.length === 0) return 0;

  let synced = 0;

  for (const local of localFavorites) {
    const result = await addUserFavorite(userId, {
      message: local.message,
      luckyNumbers: local.luckyNumbers,
      theme: local.theme,
      category: local.category,
      source: local.source,
    });

    if (result) synced++;
  }

  // Clear local after sync
  if (synced > 0) {
    clearLocalFavorites();
  }

  return synced;
}

// ============================================
// Hybrid Functions (Auto-detect auth state)
// ============================================

export interface FavoriteInput {
  message: string;
  luckyNumbers?: number[];
  theme?: string;
  category?: string;
  source?: string;
}

/**
 * Get favorites - uses API for hybrid behavior
 * Client components should use the useFavorites hook instead
 */
export async function getFavoritesForUser(
  userId: string | null,
): Promise<FavoriteItem[]> {
  if (userId) {
    return getUserFavorites(userId);
  }
  return getLocalFavorites();
}

/**
 * Add favorite - uses API for hybrid behavior
 * Client components should use the useFavorites hook instead
 */
export async function addFavoriteForUser(
  userId: string | null,
  item: FavoriteInput,
): Promise<FavoriteItem | null> {
  if (userId) {
    return addUserFavorite(userId, item);
  }
  return addLocalFavorite(item);
}

/**
 * Check if favorited - uses API for hybrid behavior
 * Client components should use the useFavorites hook instead
 */
export async function isFavoriteForUser(
  userId: string | null,
  message: string,
): Promise<boolean> {
  if (userId) {
    return isUserFavorite(userId, message);
  }
  return isLocalFavorite(message);
}
