"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import {
  Trash2,
  Calendar,
  Tag,
  Sparkles,
  LogIn,
  Search,
  SlidersHorizontal,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/components/ui/sonner";
import { SocialShare } from "@/components/SocialShare";
import { FavoritesEmptyState } from "@/components/FavoritesEmptyState";
import { useAuthSession, startGoogleSignIn } from "@/lib/auth-client";
import {
  getLocalFavorites,
  removeLocalFavorite,
  type FavoriteItem,
} from "@/lib/favorites";
import { cn } from "@/lib/utils";

interface FavoritesListProps {
  className?: string;
}

export function FavoritesList({ className }: FavoritesListProps) {
  const { data: session, status } = useAuthSession();
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState<
    "newest" | "oldest" | "alphabetical"
  >("newest");

  const isAuthenticated = status === "authenticated" && !!session?.user?.id;
  const isLoadingAuth = status === "loading";

  // Fetch favorites
  const normalizeFavorites = useCallback((items: FavoriteItem[]) => {
    return items.map((item) => ({
      ...item,
      createdAt: new Date(item.createdAt),
    }));
  }, []);

  const fetchFavorites = useCallback(async () => {
    setIsLoading(true);
    try {
      if (isAuthenticated) {
        const response = await fetch("/api/favorites");
        if (response.ok) {
          const data = await response.json();
          setFavorites(normalizeFavorites(data.favorites || []));
        } else {
          throw new Error("Failed to fetch favorites");
        }
      } else {
        const localFavorites = getLocalFavorites();
        setFavorites(normalizeFavorites(localFavorites));
      }
    } catch (error) {
      console.error("Failed to fetch favorites:", error);
      toast.error("Failed to load favorites");
      // Fallback to local favorites
      setFavorites(normalizeFavorites(getLocalFavorites()));
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, normalizeFavorites]);

  useEffect(() => {
    if (!isLoadingAuth) {
      void fetchFavorites();
    }
  }, [isLoadingAuth, fetchFavorites]);

  const categoryOptions = useMemo(() => {
    const categories = new Set<string>();
    favorites.forEach((favorite) => {
      const category = favorite.theme || favorite.category;
      if (category) categories.add(category);
    });
    return Array.from(categories).sort((a, b) => a.localeCompare(b));
  }, [favorites]);

  const categoryCounts = useMemo(() => {
    return favorites.reduce<Record<string, number>>((acc, favorite) => {
      const category = favorite.theme || favorite.category || "Other";
      acc[category] = (acc[category] || 0) + 1;
      return acc;
    }, {});
  }, [favorites]);

  const topCategory = useMemo(() => {
    const entries = Object.entries(categoryCounts);
    if (entries.length === 0) return null;
    entries.sort((a, b) => b[1] - a[1]);
    return entries[0]?.[0] || null;
  }, [categoryCounts]);

  const filteredFavorites = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    let results = favorites.filter((favorite) => {
      if (!query) return true;
      return favorite.message.toLowerCase().includes(query);
    });

    if (selectedCategory !== "all") {
      results = results.filter((favorite) => {
        const category = favorite.theme || favorite.category;
        return category === selectedCategory;
      });
    }

    switch (sortBy) {
      case "oldest":
        results = [...results].sort(
          (a, b) => a.createdAt.getTime() - b.createdAt.getTime(),
        );
        break;
      case "alphabetical":
        results = [...results].sort((a, b) =>
          a.message.localeCompare(b.message),
        );
        break;
      case "newest":
      default:
        results = [...results].sort(
          (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
        );
        break;
    }

    return results;
  }, [favorites, searchQuery, selectedCategory, sortBy]);

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
    return (
      <FavoritesEmptyState
        isAuthenticated={isAuthenticated}
        className={className}
      />
    );
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
      <div className="flex flex-col gap-4 mb-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-gray-600">
            {favorites.length} favorite{favorites.length !== 1 ? "s" : ""}
            {favorites.length >= 50 && (
              <span className="text-amber-600 ml-2">(Maximum reached)</span>
            )}
          </p>
          <div className="flex items-center gap-2">
            <Badge className="bg-amber-100 text-amber-700">
              {categoryOptions.length} Categories
            </Badge>
            {topCategory && (
              <Badge className="bg-white text-gray-600 border border-amber-100">
                Top: {topCategory}
              </Badge>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[1fr,180px,180px] gap-3">
          <div className="relative">
            <Search className="h-4 w-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <Input
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search saved fortunes"
              className="pl-9"
              aria-label="Search favorites"
            />
          </div>
          <Select
            value={selectedCategory}
            onValueChange={(value) => setSelectedCategory(value)}
          >
            <SelectTrigger className="w-full" aria-label="Filter by category">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All categories</SelectItem>
              {categoryOptions.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={sortBy}
            onValueChange={(value) =>
              setSortBy(value as "newest" | "oldest" | "alphabetical")
            }
          >
            <SelectTrigger className="w-full" aria-label="Sort favorites">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest first</SelectItem>
              <SelectItem value="oldest">Oldest first</SelectItem>
              <SelectItem value="alphabetical">Alphabetical</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Empty filtered state */}
      {filteredFavorites.length === 0 ? (
        <Card className="bg-white/80 backdrop-blur-sm border-amber-100">
          <CardContent className="p-8 text-center">
            <div className="flex items-center justify-center gap-2 text-amber-600 mb-3">
              <SlidersHorizontal className="h-5 w-5" />
              <span className="text-sm font-medium">No matches found</span>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Try a different keyword or reset your filters.
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("all");
                setSortBy("newest");
              }}
            >
              Reset filters
            </Button>
          </CardContent>
        </Card>
      ) : null}

      {/* Favorites grid */}
      {filteredFavorites.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFavorites.map((favorite) => (
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
                  className="h-11 w-11 min-h-[44px] min-w-[44px] text-gray-400 hover:text-red-500 hover:bg-red-50"
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
      )}
    </div>
  );
}
