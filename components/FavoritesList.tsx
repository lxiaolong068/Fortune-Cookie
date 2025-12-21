"use client";

import { useState, useEffect, useCallback } from "react";
import { Trash2, Calendar, Tag, Sparkles, LogIn } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/sonner";
import { SocialShare } from "@/components/SocialShare";
import { FavoritesEmptyState } from "@/components/FavoritesEmptyState";
import { useAuthSession, startGoogleSignIn } from "@/lib/auth-client";
import { getLocalFavorites, removeLocalFavorite, type FavoriteItem } from "@/lib/favorites";
import { cn } from "@/lib/utils";

interface FavoritesListProps {
  className?: string;
}

export function FavoritesList({ className }: FavoritesListProps) {
  const { data: session, status } = useAuthSession();
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const isAuthenticated = status === "authenticated" && !!session?.user?.id;
  const isLoadingAuth = status === "loading";

  // Fetch favorites
  const fetchFavorites = useCallback(async () => {
    setIsLoading(true);
    try {
      if (isAuthenticated) {
        const response = await fetch("/api/favorites");
        if (response.ok) {
          const data = await response.json();
          setFavorites(data.favorites || []);
        } else {
          throw new Error("Failed to fetch favorites");
        }
      } else {
        const localFavorites = getLocalFavorites();
        setFavorites(localFavorites);
      }
    } catch (error) {
      console.error("Failed to fetch favorites:", error);
      toast.error("Failed to load favorites");
      // Fallback to local favorites
      setFavorites(getLocalFavorites());
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (!isLoadingAuth) {
      void fetchFavorites();
    }
  }, [isLoadingAuth, fetchFavorites]);

  // Handle delete
  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      if (isAuthenticated) {
        const response = await fetch(`/api/favorites?id=${id}`, {
          method: "DELETE",
        });
        if (!response.ok) {
          throw new Error("Failed to delete");
        }
      } else {
        removeLocalFavorite(id);
      }

      setFavorites((prev) => prev.filter((f) => f.id !== id));
      toast.success("Removed from favorites");
    } catch (error) {
      console.error("Failed to delete favorite:", error);
      toast.error("Failed to remove favorite");
    } finally {
      setDeletingId(null);
    }
  };

  // Format date
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Loading skeleton
  if (isLoadingAuth || isLoading) {
    return (
      <div className={cn("grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6", className)}>
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i} className="bg-white/80 backdrop-blur-sm border-amber-100 animate-pulse">
            <CardContent className="p-6">
              <div className="h-4 bg-amber-100 rounded w-1/4 mb-4" />
              <div className="h-20 bg-amber-50 rounded mb-4" />
              <div className="flex gap-2 mb-4">
                <div className="h-6 w-6 bg-amber-100 rounded-full" />
                <div className="h-6 w-6 bg-amber-100 rounded-full" />
                <div className="h-6 w-6 bg-amber-100 rounded-full" />
              </div>
              <div className="h-3 bg-amber-100 rounded w-1/3" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  // Empty state
  if (favorites.length === 0) {
    return <FavoritesEmptyState isAuthenticated={isAuthenticated} className={className} />;
  }

  return (
    <div className={className}>
      {/* Guest sync prompt */}
      {!isAuthenticated && favorites.length > 0 && (
        <Card className="mb-6 bg-amber-50/80 border-amber-200">
          <CardContent className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <LogIn className="h-5 w-5 text-amber-600" />
              <div>
                <p className="text-sm font-medium text-gray-800">
                  Sign in to sync your favorites
                </p>
                <p className="text-xs text-gray-600">
                  Your {favorites.length} favorite{favorites.length !== 1 ? "s" : ""} will be saved
                  to your account
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => startGoogleSignIn()}
              className="border-amber-300 text-amber-700 hover:bg-amber-100"
            >
              Sign In
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Stats */}
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-gray-600">
          {favorites.length} favorite{favorites.length !== 1 ? "s" : ""}
          {favorites.length >= 50 && (
            <span className="text-amber-600 ml-2">(Maximum reached)</span>
          )}
        </p>
      </div>

      {/* Favorites grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {favorites.map((favorite) => (
          <Card
            key={favorite.id}
            className={cn(
              "group bg-white/80 backdrop-blur-sm border-amber-100",
              "hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
            )}
          >
            <CardContent className="p-6">
              {/* Theme/Category badge */}
              <div className="flex items-center justify-between mb-3">
                {favorite.theme || favorite.category ? (
                  <Badge
                    variant="secondary"
                    className="bg-amber-100 text-amber-700 capitalize"
                  >
                    <Tag className="h-3 w-3 mr-1" />
                    {favorite.theme || favorite.category}
                  </Badge>
                ) : (
                  <div />
                )}
                {favorite.source === "ai" && (
                  <Badge variant="outline" className="text-xs text-gray-500">
                    AI Generated
                  </Badge>
                )}
              </div>

              {/* Message */}
              <blockquote className="text-gray-700 italic mb-4 leading-relaxed min-h-[80px]">
                &ldquo;{favorite.message}&rdquo;
              </blockquote>

              {/* Lucky numbers */}
              {favorite.luckyNumbers && favorite.luckyNumbers.length > 0 && (
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="h-4 w-4 text-amber-500" />
                  <div className="flex gap-1.5">
                    {favorite.luckyNumbers.map((num, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center justify-center w-7 h-7 text-xs font-medium bg-amber-100 text-amber-700 rounded-full"
                      >
                        {num}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Date */}
              <div className="flex items-center gap-1 text-xs text-gray-500 mb-4">
                <Calendar className="h-3 w-3" />
                {formatDate(favorite.createdAt)}
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-3 border-t border-amber-100">
                <SocialShare
                  message={favorite.message}
                  luckyNumbers={favorite.luckyNumbers}
                  variant="compact"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDelete(favorite.id)}
                  disabled={deletingId === favorite.id}
                  className="h-8 w-8 text-gray-400 hover:text-red-500 hover:bg-red-50"
                  aria-label="Remove from favorites"
                >
                  <Trash2
                    className={cn(
                      "h-4 w-4",
                      deletingId === favorite.id && "animate-pulse"
                    )}
                  />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
