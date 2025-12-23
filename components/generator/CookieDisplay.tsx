"use client";

import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  type Theme,
  type CookieState,
  THEME_CONFIGS,
} from "@/lib/types/generator";

interface CookieDisplayProps {
  cookieState: CookieState;
  selectedTheme: Theme;
  onCookieClick: () => void;
  disabled?: boolean;
  isGenerating?: boolean;
}

export function CookieDisplay({
  cookieState,
  selectedTheme,
  onCookieClick,
  disabled = false,
}: CookieDisplayProps) {
  const config = THEME_CONFIGS[selectedTheme];

  if (cookieState === "cracking") {
    return <CrackingCookie />;
  }

  // Unopened state - clickable cookie
  return (
    <div className="flex flex-col items-center">
      <motion.div
        whileHover={{ scale: disabled ? 1 : 1.05 }}
        whileTap={{ scale: disabled ? 1 : 0.95 }}
        animate={{
          y: [0, -10, 0],
          rotate: [0, 2, -2, 0],
        }}
        transition={{
          y: {
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          },
          rotate: {
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          },
        }}
        onClick={() => !disabled && onCookieClick()}
        className={cn(
          "cursor-pointer mb-6 relative",
          disabled && "opacity-60 cursor-not-allowed",
        )}
        role="button"
        tabIndex={disabled ? -1 : 0}
        aria-label="Click to generate fortune cookie"
        aria-disabled={disabled}
        onKeyDown={(e) => {
          if (!disabled && (e.key === "Enter" || e.key === " ")) {
            e.preventDefault();
            onCookieClick();
          }
        }}
      >
        <div className="relative">
          {/* Cookie Shadow */}
          <div className="absolute top-2 left-2 w-32 h-20 bg-black/20 rounded-full blur-md" />

          {/* Fortune Cookie */}
          <div className="relative w-32 h-20 bg-gradient-to-br from-yellow-200 to-amber-300 rounded-full transform rotate-12 shadow-lg border-2 border-amber-400">
            {/* Cookie texture lines */}
            <div className="absolute inset-2 border border-amber-500/30 rounded-full" />
            <div className="absolute inset-4 border border-amber-500/20 rounded-full" />

            {/* Theme indicator badge */}
            <div className="absolute -top-3 -right-3">
              <Badge className={cn("text-xs border", config.color)}>
                <span className="mr-1">{config.icon}</span>
                {config.label}
              </Badge>
            </div>

            {/* Sparkle effect */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "linear",
              }}
              className="absolute -top-2 -right-2"
            >
              <span className="text-2xl drop-shadow-lg">✨</span>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Instructions */}
      <div className="text-center">
        <h2 className="text-2xl md:text-3xl mb-3 bg-gradient-to-r from-amber-700 via-yellow-600 to-orange-700 bg-clip-text text-transparent font-bold">
          AI Fortune Cookie
        </h2>
        <p className="text-amber-700 mb-4">
          {disabled
            ? "Daily limit reached. Come back tomorrow!"
            : "Tap the cookie to generate your personalized fortune!"}
        </p>
        <div className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-amber-50/80 to-yellow-50/80 backdrop-blur-sm border border-amber-200/50">
          <span>✨</span>
          <span className="text-sm text-amber-700 font-medium">
            Powered by AI
          </span>
        </div>
      </div>
    </div>
  );
}

// Cracking animation component
function CrackingCookie() {
  return (
    <div className="flex flex-col items-center">
      <motion.div
        initial={{ scale: 1 }}
        animate={{ scale: [1, 1.2, 0.8, 1.1] }}
        transition={{ duration: 2, ease: "easeInOut" }}
        className="mb-6"
      >
        <motion.div
          animate={{
            rotate: [0, 5, -5, 10, -10, 0],
            scale: [1, 1.1, 0.9, 1.05, 0.95, 1],
          }}
          transition={{ duration: 2, ease: "easeInOut" }}
          className="relative"
        >
          {/* Cracking cookie with split effect */}
          <div className="relative w-32 h-20">
            {/* Left half */}
            <motion.div
              animate={{ x: [-16, -24], rotate: [0, -15] }}
              transition={{ duration: 2, ease: "easeOut" }}
              className="absolute left-0 w-16 h-20 bg-gradient-to-br from-yellow-200 to-amber-300 rounded-l-full border-2 border-amber-400 overflow-hidden"
            >
              <div className="absolute inset-1 border border-amber-500/30 rounded-l-full" />
            </motion.div>

            {/* Right half */}
            <motion.div
              animate={{ x: [16, 24], rotate: [0, 15] }}
              transition={{ duration: 2, ease: "easeOut" }}
              className="absolute right-0 w-16 h-20 bg-gradient-to-br from-yellow-200 to-amber-300 rounded-r-full border-2 border-amber-400 overflow-hidden"
            >
              <div className="absolute inset-1 border border-amber-500/30 rounded-r-full" />
            </motion.div>

            {/* AI generation indicator */}
            <div className="absolute -top-8 left-1/2 transform -translate-x-1/2">
              <div className="flex items-center gap-2 px-3 py-1 bg-white/90 rounded-full border border-amber-200">
                <motion.span
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="inline-block"
                >
                  ⏳
                </motion.span>
                <span className="text-sm text-amber-700">Generating...</span>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1, 0.7, 1] }}
        transition={{ duration: 2 }}
        className="text-amber-700 text-center"
      >
        AI is crafting your personalized fortune...
      </motion.p>
    </div>
  );
}
