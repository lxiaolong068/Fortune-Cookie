"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { type Theme, THEME_CONFIGS } from "@/lib/types/generator";

interface ThemeSelectorProps {
  selectedTheme: Theme;
  onThemeChange: (theme: Theme) => void;
  disabled?: boolean;
}

const themes: Theme[] = ['random', 'inspirational', 'funny', 'love', 'success', 'wisdom'];

export function ThemeSelector({
  selectedTheme,
  onThemeChange,
  disabled = false,
}: ThemeSelectorProps) {
  return (
    <div className="w-full">
      <h3 className="text-sm font-medium text-gray-700 mb-3">
        Choose your fortune theme
      </h3>

      {/* Theme Pills Grid */}
      <div className="flex flex-wrap gap-2 justify-center">
        {themes.map((theme) => {
          const config = THEME_CONFIGS[theme];
          const isSelected = selectedTheme === theme;

          return (
            <motion.button
              key={theme}
              type="button"
              onClick={() => !disabled && onThemeChange(theme)}
              disabled={disabled}
              whileHover={{ scale: disabled ? 1 : 1.05 }}
              whileTap={{ scale: disabled ? 1 : 0.95 }}
              className={cn(
                "relative px-4 py-2 rounded-full border-2 transition-all duration-200",
                "flex items-center gap-2 text-sm font-medium",
                "focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2",
                isSelected
                  ? "border-amber-500 bg-amber-50 text-amber-800 shadow-md"
                  : "border-gray-200 bg-white text-gray-600 hover:border-amber-300 hover:bg-amber-50/50",
                disabled && "opacity-50 cursor-not-allowed"
              )}
              aria-label={`Select ${config.label} theme`}
              aria-pressed={isSelected}
            >
              {/* Theme Icon */}
              <span className="text-base" aria-hidden="true">
                {config.icon}
              </span>

              {/* Theme Label */}
              <span>{config.label}</span>

              {/* Selected Indicator */}
              {isSelected && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 w-4 h-4 bg-amber-500 rounded-full flex items-center justify-center"
                  aria-hidden="true"
                >
                  <svg
                    className="w-2.5 h-2.5 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={3}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </motion.span>
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Selected Theme Description */}
      <motion.p
        key={selectedTheme}
        initial={{ opacity: 0, y: -5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="text-xs text-gray-500 text-center mt-3"
      >
        {THEME_CONFIGS[selectedTheme].description}
      </motion.p>
    </div>
  );
}
