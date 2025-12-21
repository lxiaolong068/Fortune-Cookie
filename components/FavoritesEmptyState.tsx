"use client";

import Link from "next/link";
import { Heart, Cookie, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { startGoogleSignIn } from "@/lib/auth-client";
import { cn } from "@/lib/utils";

interface FavoritesEmptyStateProps {
  isAuthenticated: boolean;
  className?: string;
}

export function FavoritesEmptyState({
  isAuthenticated,
  className,
}: FavoritesEmptyStateProps) {
  return (
    <Card
      className={cn(
        "max-w-md mx-auto bg-white/80 backdrop-blur-sm border-amber-200",
        className
      )}
    >
      <CardContent className="flex flex-col items-center text-center p-8">
        {/* Icon */}
        <div className="relative mb-6">
          <div className="w-20 h-20 rounded-full bg-amber-100 flex items-center justify-center">
            <Heart className="h-10 w-10 text-amber-400" />
          </div>
          <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center">
            <Cookie className="h-4 w-4 text-white" />
          </div>
        </div>

        {/* Title */}
        <h2 className="text-xl font-semibold text-gray-800 mb-2">
          No Favorites Yet
        </h2>

        {/* Description */}
        <p className="text-gray-600 mb-6">
          {isAuthenticated
            ? "You haven't saved any fortune cookies yet. Generate some fortunes and save your favorites!"
            : "Start collecting your favorite fortune cookies! Sign in to save them across devices."}
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 w-full">
          <Button asChild className="flex-1 bg-amber-600 hover:bg-amber-700">
            <Link href="/generator">
              <Cookie className="h-4 w-4 mr-2" />
              Generate Fortunes
            </Link>
          </Button>

          {!isAuthenticated && (
            <Button
              variant="outline"
              className="flex-1 border-amber-300 text-amber-700 hover:bg-amber-50"
              onClick={() => startGoogleSignIn()}
            >
              <LogIn className="h-4 w-4 mr-2" />
              Sign In
            </Button>
          )}
        </div>

        {/* Guest note */}
        {!isAuthenticated && (
          <p className="text-xs text-gray-500 mt-4">
            Your favorites are currently saved locally. Sign in to sync them
            across devices and never lose them!
          </p>
        )}
      </CardContent>
    </Card>
  );
}
