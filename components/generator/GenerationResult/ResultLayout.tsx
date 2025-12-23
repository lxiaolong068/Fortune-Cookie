"use client";

import { motion } from "framer-motion";
import { FortuneResultCard } from "./FortuneResultCard";
import { LuckyNumbersCard } from "./LuckyNumbersCard";
import type { Fortune, Theme } from "@/lib/types/generator";

interface ResultLayoutProps {
  fortune: Fortune;
  selectedTheme: Theme;
  generationSource: "ai" | "offline" | null;
  generationError: string | null;
  onGenerateAnother: () => void;
}

export function ResultLayout({
  fortune,
  selectedTheme,
  generationSource,
  generationError,
  onGenerateAnother,
}: ResultLayoutProps) {
  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 30,
        delay: 0.2,
      }}
      className="w-full max-w-4xl mx-auto"
    >
      {/* Desktop: Side-by-side | Mobile: Stacked */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        {/* Fortune Card - Takes 2/3 width on desktop */}
        <div className="md:col-span-2">
          <FortuneResultCard
            fortune={fortune}
            selectedTheme={selectedTheme}
            generationSource={generationSource}
            generationError={generationError}
            onGenerateAnother={onGenerateAnother}
          />
        </div>

        {/* Lucky Numbers Card - Takes 1/3 width on desktop */}
        <div className="md:col-span-1">
          <LuckyNumbersCard
            luckyNumbers={fortune.luckyNumbers}
            timestamp={fortune.timestamp}
          />
        </div>
      </div>
    </motion.div>
  );
}
