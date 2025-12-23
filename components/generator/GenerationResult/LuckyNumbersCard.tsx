"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";

interface LuckyNumbersCardProps {
  luckyNumbers: number[];
  timestamp?: string;
}

export function LuckyNumbersCard({ luckyNumbers }: LuckyNumbersCardProps) {
  return (
    <Card className="p-6 bg-white/90 backdrop-blur-sm border-amber-200 shadow-xl h-full flex flex-col">
      {/* Header */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-center mb-4"
      >
        <div className="flex items-center justify-center gap-2 mb-2">
          <span className="text-xl">🎱</span>
          <h3 className="text-lg font-bold text-amber-700">Lucky Numbers</h3>
        </div>
      </motion.div>

      {/* Numbers Display */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="flex-1 flex items-center justify-center"
      >
        <div className="flex flex-wrap justify-center gap-2">
          {luckyNumbers.map((number, index) => (
            <motion.div
              key={`${number}-${index}`}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{
                delay: 0.9 + index * 0.1,
                type: "spring",
                stiffness: 500,
                damping: 25,
              }}
              className="w-11 h-11 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center shadow-md"
            >
              <span className="text-white font-bold text-sm">{number}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Usage Hint */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="text-xs text-gray-500 text-center mt-4"
      >
        Use them for fun, goals, or your next lottery ticket! 🍀
      </motion.p>
    </Card>
  );
}
