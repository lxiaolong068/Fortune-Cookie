"use client";

import { useState, useEffect, useCallback } from "react";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/sonner";
import { useAuthSession } from "@/lib/auth-client";
import {
  getLocalFavorites,
  addLocalFavorite,
  removeLocalFavorite,
  isLocalFavorite,
  type FavoriteItem,
} from "@/lib/favorites";
import { cn } from "@/lib/utils";

interface FavoriteButtonProps {
  message: string;
  luckyNumbers?: number[];
  theme?: string;
  category?: string;
  source?: string;
  className?: string;
  variant?: "default" | "icon" | "text";
  size?: "default" | "sm" | "lg";
  onFavoriteChange?: (isFavorited: boolean) => void;
}

export function FavoriteButton({
  message,
  luckyNumbers,
  theme,
  category,
  source,
  className,
  variant = "default",
  size = "default",
  onFavoriteChange,
}: FavoriteButtonProps) {
  const { data: session, status } = useAuthSession();
  const [isFavorited, setIsFavorited] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [favoriteId, setFavoriteId] = useState<string | null>(null);

  const isAuthenticated = status === "authenticated" && !!session?.user?.id;

  // Check initial favorite status
  const checkFavoriteStatus = useCallback(async () => {
    if (!message) return;

    if (isAuthenticated) {
      try {
        const response = await fetch("/api/favorites");
        if (response.ok) {
          const data = await response.json();
          const favorites = data.favorites as FavoriteItem[];
          const found = favorites.find((f) => f.message === message);
          setIsFavorited(!!found);
          setFavoriteId(found?.id || null);
        }
      } catch (error) {
        console.error("Failed to check favorite status:", error);
        // Fallback to local check
        setIsFavorited(isLocalFavorite(message));
      }
    } else {
      setIsFavorited(isLocalFavorite(message));
      const locals = getLocalFavorites();
      const found = locals.find((f) => f.message === message);
      setFavoriteId(found?.id || null);
    }
  }, [message, isAuthenticated]);

  useEffect(() => {
    void checkFavoriteStatus();
  }, [checkFavoriteStatus]);

  const handleToggleFavorite = async () => {
    if (isLoading) return;

    setIsLoading(true);

    try {
      if (isFavorited) {
        // Remove favorite
        if (isAuthenticated && favoriteId) {
          const response = await fetch(`/api/favorites?id=${favoriteId}`, {
            method: "DELETE",
          });
          if (!response.ok) throw new Error("Failed to remove favorite");
        } else if (favoriteId) {
          removeLocalFavorite(favoriteId);
        }

        setIsFavorited(false);
        setFavoriteId(null);
        toast.success("Removed from favorites");
        onFavoriteChange?.(false);
      } else {
        // Add favorite
        const favoriteData = {
          message,
          luckyNumbers,
          theme,
          category,
          source,
        };

        if (isAuthenticated) {
          const response = await fetch("/api/favorites", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(favoriteData),
          });

          if (!response.ok) {
            const data = await response.json();
            if (response.status === 409) {
              toast.info("Already in favorites");
              setIsFavorited(true);
              return;
            }
            throw new Error(data.error || "Failed to add favorite");
          }

          const data = await response.json();
          setFavoriteId(data.favorite.id);
        } else {
          const result = addLocalFavorite(favoriteData);
          if (!result) {
            toast.info("Already in favorites");
            setIsFavorited(true);
            return;
          }
          setFavoriteId(result.id);
        }

        setIsFavorited(true);
        toast.success("Added to favorites!");
        onFavoriteChange?.(true);
      }
    } catch (error) {
      console.error("Failed to toggle favorite:", error);
      toast.error("Failed to update favorites");
    } finally {
      setIsLoading(false);
    }
  };

  const buttonSize = size === "sm" ? "sm" : size === "lg" ? "lg" : "default";
  const iconSize = size === "sm" ? "h-3 w-3" : size === "lg" ? "h-5 w-5" : "h-4 w-4";

  if (variant === "icon") {
    return (
      <Button
        variant="ghost"
        size="icon"
        onClick={handleToggleFavorite}
        disabled={isLoading}
        className={cn(
          "transition-colors",
          isFavorited && "text-red-500 hover:text-red-600",
          className
        )}
        aria-label={isFavorited ? "Remove from favorites" : "Add to favorites"}
      >
        <Heart
          className={cn(
            iconSize,
            isFavorited && "fill-current",
            isLoading && "animate-pulse"
          )}
        />
      </Button>
    );
  }

  if (variant === "text") {
    return (
      <Button
        variant="ghost"
        size={buttonSize}
        onClick={handleToggleFavorite}
        disabled={isLoading}
        className={cn(
          "gap-1.5 transition-colors",
          isFavorited && "text-red-500 hover:text-red-600",
          className
        )}
      >
        <Heart
          className={cn(
            iconSize,
            isFavorited && "fill-current",
            isLoading && "animate-pulse"
          )}
        />
        {isFavorited ? "Saved" : "Save"}
      </Button>
    );
  }

  // Default variant
  return (
    <Button
      variant={isFavorited ? "default" : "outline"}
      size={buttonSize}
      onClick={handleToggleFavorite}
      disabled={isLoading}
      className={cn(
        "gap-2 transition-all",
        isFavorited && "bg-red-500 hover:bg-red-600 text-white border-red-500",
        className
      )}
    >
      <Heart
        className={cn(
          iconSize,
          isFavorited && "fill-current",
          isLoading && "animate-pulse"
        )}
      />
      {isFavorited ? "Saved" : "Save"}
    </Button>
  );
}
