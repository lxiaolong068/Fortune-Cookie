"use client";

import { useState, useEffect } from "react";
import { Copy, Check, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { THEME_CONFIGS, TRENDING_FORTUNES } from "@/lib/types/generator";
import {
  addLocalFavorite,
  isLocalFavorite,
  removeLocalFavorite,
  getLocalFavorites,
} from "@/lib/favorites";

export function TrendingTab() {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [favoriteStates, setFavoriteStates] = useState<Record<string, boolean>>(
    {},
  );

  // Check favorite status on mount
  useEffect(() => {
    const states: Record<string, boolean> = {};
    for (const item of TRENDING_FORTUNES) {
      states[item.id] = isLocalFavorite(item.message);
    }
    setFavoriteStates(states);
  }, []);

  const handleCopy = async (id: string, message: string) => {
    try {
      await navigator.clipboard.writeText(message);
      setCopiedId(id);
      toast.success("Fortune copied to clipboard!");
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      toast.error("Failed to copy");
    }
  };

  const handleToggleFavorite = (
    id: string,
    message: string,
    category: string,
  ) => {
    try {
      const isCurrentlyFavorite = favoriteStates[id];

      if (isCurrentlyFavorite) {
        // Find the favorite by message to get its ID
        const favorites = getLocalFavorites();
        const favorite = favorites.find((f) => f.message === message);
        if (favorite) {
          removeLocalFavorite(favorite.id);
        }
        setFavoriteStates((prev) => ({ ...prev, [id]: false }));
        toast.success("Removed from favorites");
      } else {
        addLocalFavorite({
          message,
          category,
          source: "database",
        });
        setFavoriteStates((prev) => ({ ...prev, [id]: true }));
        toast.success("Added to favorites!");
      }
    } catch {
      toast.error("Failed to update favorite");
    }
  };

  const formatNumber = (num: number): string => {
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}k`;
    }
    return num.toString();
  };

  return (
    <div className="space-y-3">
      {/* Info Banner */}
      <div className="bg-amber-50 rounded-lg p-3 mb-4">
        <p className="text-xs text-amber-700">
          🔥 Most popular fortunes from the last 7 days
        </p>
      </div>

      <div className="max-h-80 overflow-y-auto space-y-3">
        {TRENDING_FORTUNES.map((item) => {
          const config =
            THEME_CONFIGS[item.category as keyof typeof THEME_CONFIGS] ||
            THEME_CONFIGS.random;
          const isCopied = copiedId === item.id;
          const isFav = favoriteStates[item.id];

          return (
            <div
              key={item.id}
              className="p-3 rounded-lg border border-gray-100 hover:border-amber-200 transition-colors bg-white/50"
            >
              <div className="flex items-start justify-between gap-3">
                {/* Fortune Content */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-700 line-clamp-2 mb-2">
                    &ldquo;{item.message}&rdquo;
                  </p>
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge
                      variant="outline"
                      className={cn("text-xs", config.color)}
                    >
                      {config.icon} {config.label}
                    </Badge>
                    <span className="text-xs text-gray-400">
                      ♥ {formatNumber(item.saves)} saves ·{" "}
                      {formatNumber(item.shares)} shares
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 flex-shrink-0">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleCopy(item.id, item.message)}
                    className="h-8 w-8 p-0"
                    aria-label="Copy fortune"
                  >
                    {isCopied ? (
                      <Check className="w-4 h-4 text-green-500" />
                    ) : (
                      <Copy className="w-4 h-4 text-gray-400" />
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      handleToggleFavorite(item.id, item.message, item.category)
                    }
                    className={cn("h-8 w-8 p-0", isFav && "text-red-500")}
                    aria-label={
                      isFav ? "Remove from favorites" : "Add to favorites"
                    }
                  >
                    <Heart
                      className={cn("w-4 h-4", isFav ? "fill-current" : "")}
                    />
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
