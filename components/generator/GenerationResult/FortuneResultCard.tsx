"use client";

import { motion } from "framer-motion";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SocialShare } from "@/components/SocialShare";
import { FavoriteButton } from "@/components/FavoriteButton";
import { cn } from "@/lib/utils";
import { type Fortune, type Theme, THEME_CONFIGS } from "@/lib/types/generator";

interface FortuneResultCardProps {
  fortune: Fortune;
  selectedTheme: Theme;
  generationSource: "ai" | "offline" | null;
  generationError: string | null;
  onGenerateAnother: () => void;
}

export function FortuneResultCard({
  fortune,
  selectedTheme,
  generationSource,
  generationError,
  onGenerateAnother,
}: FortuneResultCardProps) {
  const themeKey = (fortune.theme as Theme) || selectedTheme;
  const config = THEME_CONFIGS[themeKey] || THEME_CONFIGS.random;

  // Format timestamp for display
  const formattedTime = new Date(fortune.timestamp).toLocaleString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  return (
    <Card className="p-6 bg-white/90 backdrop-blur-sm border-amber-200 shadow-xl h-full">
      {/* Header */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="mb-4"
      >
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">✨</span>
              <h2 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-amber-600 via-yellow-600 to-orange-600 bg-clip-text text-transparent">
                Your AI Fortune
              </h2>
            </div>

            {/* Tags Row */}
            <div className="flex flex-wrap items-center gap-2">
              {/* Theme Badge */}
              <Badge className={cn("text-xs border", config.color)}>
                <span className="mr-1">{config.icon}</span>
                {config.label}
              </Badge>

              {/* Source Badge */}
              {generationSource && (
                <Badge
                  className={cn(
                    "text-xs border",
                    generationSource === "ai"
                      ? "bg-green-100 text-green-700 border-green-200"
                      : "bg-blue-100 text-blue-700 border-blue-200"
                  )}
                >
                  {generationSource === "ai" ? "✨ AI Generated" : "📚 Offline"}
                </Badge>
              )}
            </div>
          </div>

          {/* Favorite Button */}
          <FavoriteButton
            message={fortune.message}
            luckyNumbers={fortune.luckyNumbers}
            theme={fortune.theme}
            category={selectedTheme === "random" ? "inspirational" : selectedTheme}
            source={generationSource || "ai"}
            variant="icon"
            size="sm"
            className="h-11 w-11 min-h-[44px] min-w-[44px]"
          />
        </div>

        {/* Error Message */}
        {generationError && (
          <p className="text-xs text-amber-600 mb-2">{generationError}</p>
        )}
      </motion.div>

      {/* Fortune Message */}
      <motion.blockquote
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="text-center text-gray-700 mb-6 italic leading-relaxed text-lg md:text-xl px-4"
      >
        &ldquo;{fortune.message}&rdquo;
      </motion.blockquote>

      {/* Timestamp */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="text-xs text-gray-400 text-center mb-6"
      >
        Generated at {formattedTime} · Powered by AI Fortune Cookie
      </motion.p>

      {/* Share Actions */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="flex flex-col items-center gap-4 mb-6"
      >
        <SocialShare
          message={fortune.message}
          luckyNumbers={fortune.luckyNumbers}
          variant="inline"
          className="justify-center"
        />
      </motion.div>

      {/* Generate Another Button */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1 }}
        className="text-center"
      >
        <Button
          onClick={onGenerateAnother}
          className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white px-6 py-2 rounded-full shadow-lg transform transition-all duration-200 hover:scale-105"
          aria-label="Generate another fortune"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Generate Another Fortune
        </Button>
      </motion.div>
    </Card>
  );
}
