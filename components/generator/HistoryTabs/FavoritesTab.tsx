"use client";

import { useState, useEffect } from "react";
import { Copy, Check, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { THEME_CONFIGS } from "@/lib/types/generator";
import {
  getLocalFavorites,
  removeLocalFavorite,
  type FavoriteItem,
} from "@/lib/favorites";
import Link from "next/link";

export function FavoritesTab() {
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const loadFavorites = () => {
    try {
      setIsLoading(true);
      const items = getLocalFavorites();
      // Show only first 10 favorites in this preview
      setFavorites(items.slice(0, 10));
    } catch (error) {
      console.error("Failed to load favorites:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadFavorites();
  }, []);

  const handleCopy = async (item: FavoriteItem) => {
    try {
      await navigator.clipboard.writeText(item.message);
      setCopiedId(item.id);
      toast.success("Fortune copied to clipboard!");
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      toast.error("Failed to copy");
    }
  };

  const handleRemove = (item: FavoriteItem) => {
    try {
      removeLocalFavorite(item.id);
      loadFavorites();
      toast.success("Removed from favorites");
    } catch {
      toast.error("Failed to remove");
    }
  };

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <div className="w-8 h-8 border-2 border-amber-200 border-t-amber-600 rounded-full animate-spin mx-auto mb-3" />
        <p className="text-gray-500 text-sm">Loading favorites...</p>
      </div>
    );
  }

  if (favorites.length === 0) {
    return (
      <div className="text-center py-8">
        <span className="text-4xl mb-3 block">⭐</span>
        <p className="text-gray-500 text-sm">
          You haven&apos;t saved any fortunes yet.
          <br />
          Tap the heart icon to save your favorites.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="max-h-80 overflow-y-auto space-y-3">
        {favorites.map((item) => {
          const config =
            THEME_CONFIGS[item.category as keyof typeof THEME_CONFIGS] ||
            THEME_CONFIGS.random;
          const isCopied = copiedId === item.id;

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
                    {item.luckyNumbers && item.luckyNumbers.length > 0 && (
                      <span className="text-xs text-gray-400">
                        🎱 {item.luckyNumbers.slice(0, 3).join(", ")}...
                      </span>
                    )}
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
                    onClick={() => handleRemove(item)}
                    className="h-8 w-8 p-0 text-gray-400 hover:text-red-500"
                    aria-label="Remove from favorites"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Link to full favorites page */}
      <div className="text-center pt-2 border-t border-gray-100">
        <Link
          href="/favorites"
          className="text-sm text-amber-600 hover:text-amber-700 font-medium"
        >
          View all favorites →
        </Link>
      </div>
    </div>
  );
}
