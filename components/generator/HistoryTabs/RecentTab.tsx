"use client";

import { useState, useEffect } from "react";
import { Copy, Check, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { type HistoryItem } from "@/lib/types/generator";
import { THEME_CONFIGS } from "@/lib/types/generator";
import { sessionManager } from "@/lib/session-manager";
import {
  addLocalFavorite,
  isLocalFavorite,
  removeLocalFavorite,
  getLocalFavorites,
} from "@/lib/favorites";

interface RecentTabProps {
  history: HistoryItem[];
  onHistoryUpdate: () => void;
}

export function RecentTab({ history, onHistoryUpdate }: RecentTabProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [favoriteStates, setFavoriteStates] = useState<Record<string, boolean>>(
    {},
  );

  // Check favorite status on mount and when history changes
  useEffect(() => {
    const states: Record<string, boolean> = {};
    for (const item of history) {
      states[item.id] = isLocalFavorite(item.message);
    }
    setFavoriteStates(states);
  }, [history]);

  const handleCopy = async (item: HistoryItem) => {
    try {
      await navigator.clipboard.writeText(item.message);
      setCopiedId(item.id);
      toast.success("Fortune copied to clipboard!");
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      toast.error("Failed to copy");
    }
  };

  const handleToggleFavorite = (item: HistoryItem) => {
    try {
      const isCurrentlyFavorite = favoriteStates[item.id];

      if (isCurrentlyFavorite) {
        // Find the favorite by message to get its ID
        const favorites = getLocalFavorites();
        const favorite = favorites.find((f) => f.message === item.message);
        if (favorite) {
          removeLocalFavorite(favorite.id);
        }
        setFavoriteStates((prev) => ({ ...prev, [item.id]: false }));
        toast.success("Removed from favorites");
      } else {
        addLocalFavorite({
          message: item.message,
          category: item.category,
          luckyNumbers: item.luckyNumbers,
          source: item.source || "ai",
        });
        setFavoriteStates((prev) => ({ ...prev, [item.id]: true }));
        sessionManager.likeFortuneInHistory(item.id);
        toast.success("Added to favorites!");
      }
      onHistoryUpdate();
    } catch {
      toast.error("Failed to update favorite");
    }
  };

  const formatTimeAgo = (date: Date): string => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60)
      return `${diffMins} minute${diffMins > 1 ? "s" : ""} ago`;
    if (diffHours < 24)
      return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
    return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
  };

  if (history.length === 0) {
    return (
      <div className="text-center py-8">
        <span className="text-4xl mb-3 block">🥠</span>
        <p className="text-gray-500 text-sm">
          No fortunes generated yet.
          <br />
          Tap the cookie above to get your first fortune!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3 max-h-80 overflow-y-auto">
      {history.map((item) => {
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
                    {formatTimeAgo(item.timestamp)}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1 flex-shrink-0">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleCopy(item)}
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
                  onClick={() => handleToggleFavorite(item)}
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
  );
}
