"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  getLuckyNumberMeaning,
  getShortMeaning,
  categoryConfig,
  elementConfig,
  isNumberLuckyToday,
  type LuckyNumberMeaning,
} from "@/lib/lucky-numbers";
import { cn } from "@/lib/utils";

interface LuckyNumberCardProps {
  number: number;
  size?: "sm" | "md" | "lg";
  showTooltip?: boolean;
  showFullCard?: boolean;
  onCopy?: (number: number) => void;
  className?: string;
}

/**
 * LuckyNumberCard - Display a lucky number with meaning tooltip/card
 */
export function LuckyNumberCard({
  number,
  size = "md",
  showTooltip = true,
  showFullCard = false,
  onCopy,
  className,
}: LuckyNumberCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [showCard, setShowCard] = useState(false);
  const [copied, setCopied] = useState(false);

  const meaning = getLuckyNumberMeaning(number);
  const isLuckyToday = isNumberLuckyToday(number);

  const sizeClasses = {
    sm: "w-8 h-8 text-sm",
    md: "w-10 h-10 text-base",
    lg: "w-12 h-12 text-lg",
  };

  const handleCopy = async () => {
    if (onCopy) {
      onCopy(number);
    }
    await navigator.clipboard.writeText(number.toString());
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleClick = () => {
    if (showFullCard) {
      setShowCard(!showCard);
    } else {
      handleCopy();
    }
  };

  return (
    <div className={cn("relative inline-block", className)}>
      {/* Number Badge */}
      <motion.button
        className={cn(
          "rounded-full flex items-center justify-center font-bold",
          "bg-gradient-to-br from-amber-100 to-amber-200",
          "border-2 border-amber-400 shadow-md",
          "hover:shadow-lg hover:scale-110 transition-all duration-200",
          "focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2",
          sizeClasses[size],
          isLuckyToday && "ring-2 ring-yellow-400 ring-offset-1"
        )}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handleClick}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        title={showTooltip ? getShortMeaning(number) : undefined}
        aria-label={`Lucky number ${number}: ${getShortMeaning(number)}`}
      >
        <span className="text-amber-900">{number}</span>
        {isLuckyToday && (
          <motion.span
            className="absolute -top-1 -right-1 text-xs"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
          >
            ⭐
          </motion.span>
        )}
      </motion.button>

      {/* Tooltip */}
      <AnimatePresence>
        {showTooltip && isHovered && !showCard && meaning && (
          <motion.div
            initial={{ opacity: 0, y: 5, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 5, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className={cn(
              "absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2",
              "px-3 py-2 rounded-lg shadow-lg",
              "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700",
              "text-sm min-w-[180px] max-w-[250px]"
            )}
          >
            <div className="flex items-center gap-2 mb-1">
              <span className="font-bold text-amber-700 dark:text-amber-400">
                {number}
              </span>
              <span className={categoryConfig[meaning.category].color}>
                {categoryConfig[meaning.category].emoji}
              </span>
              {meaning.element && (
                <span className={elementConfig[meaning.element].color}>
                  {elementConfig[meaning.element].emoji}
                </span>
              )}
            </div>
            <p className="text-gray-600 dark:text-gray-300 text-xs leading-relaxed">
              {meaning.shortMeaning}
            </p>
            {isLuckyToday && (
              <p className="text-yellow-600 dark:text-yellow-400 text-xs mt-1 font-medium">
                ⭐ Extra lucky today!
              </p>
            )}
            {/* Tooltip arrow */}
            <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-px">
              <div className="border-8 border-transparent border-t-white dark:border-t-gray-800" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Full Card Modal */}
      <AnimatePresence>
        {showFullCard && showCard && meaning && (
          <LuckyNumberFullCard
            meaning={meaning}
            isLuckyToday={isLuckyToday}
            onClose={() => setShowCard(false)}
            onCopy={handleCopy}
            copied={copied}
          />
        )}
      </AnimatePresence>

      {/* Copy feedback */}
      <AnimatePresence>
        {copied && !showFullCard && (
          <motion.span
            initial={{ opacity: 0, y: 0 }}
            animate={{ opacity: 1, y: -20 }}
            exit={{ opacity: 0 }}
            className="absolute left-1/2 -translate-x-1/2 -top-2 text-xs text-green-600 font-medium whitespace-nowrap"
          >
            Copied!
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  );
}

/**
 * Full card display for lucky number meaning
 */
interface LuckyNumberFullCardProps {
  meaning: LuckyNumberMeaning;
  isLuckyToday: boolean;
  onClose: () => void;
  onCopy: () => void;
  copied: boolean;
}

function LuckyNumberFullCard({
  meaning,
  isLuckyToday,
  onClose,
  onCopy,
  copied,
}: LuckyNumberFullCardProps) {
  const category = categoryConfig[meaning.category];
  const element = meaning.element ? elementConfig[meaning.element] : null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className={cn(
        "absolute z-50 top-full left-1/2 -translate-x-1/2 mt-2",
        "w-72 p-4 rounded-xl shadow-xl",
        "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <span className="text-3xl font-bold text-amber-700 dark:text-amber-400">
            {meaning.number}
          </span>
          <div className="flex flex-col">
            <span className={cn("text-sm font-medium", category.color)}>
              {category.emoji} {category.label}
            </span>
            {element && (
              <span className={cn("text-xs", element.color)}>
                {element.emoji} {element.label} Element
              </span>
            )}
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          aria-label="Close"
        >
          <svg
            className="w-5 h-5 text-gray-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      {/* Meaning */}
      <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed mb-3">
        {meaning.meaning}
      </p>

      {/* Lucky today badge */}
      {isLuckyToday && (
        <div className="bg-yellow-50 dark:bg-yellow-900/30 rounded-lg p-2 mb-3">
          <p className="text-yellow-700 dark:text-yellow-400 text-sm font-medium">
            ⭐ This number is extra lucky today!
          </p>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-2">
        <button
          onClick={onCopy}
          className={cn(
            "flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors",
            copied
              ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
              : "bg-amber-100 text-amber-700 hover:bg-amber-200 dark:bg-amber-900/30 dark:text-amber-400"
          )}
        >
          {copied ? "✓ Copied!" : "Copy Number"}
        </button>
      </div>
    </motion.div>
  );
}

/**
 * LuckyNumbersRow - Display multiple lucky numbers in a row
 */
interface LuckyNumbersRowProps {
  numbers: number[];
  size?: "sm" | "md" | "lg";
  showTooltip?: boolean;
  showFullCard?: boolean;
  onCopyAll?: () => void;
  className?: string;
}

export function LuckyNumbersRow({
  numbers,
  size = "md",
  showTooltip = true,
  showFullCard = false,
  onCopyAll,
  className,
}: LuckyNumbersRowProps) {
  const [copiedAll, setCopiedAll] = useState(false);

  const handleCopyAll = async () => {
    const text = numbers.join(", ");
    await navigator.clipboard.writeText(text);
    setCopiedAll(true);
    if (onCopyAll) onCopyAll();
    setTimeout(() => setCopiedAll(false), 1500);
  };

  return (
    <div className={cn("flex flex-wrap items-center gap-2", className)}>
      {numbers.map((num) => (
        <LuckyNumberCard
          key={num}
          number={num}
          size={size}
          showTooltip={showTooltip}
          showFullCard={showFullCard}
        />
      ))}
      {numbers.length > 1 && (
        <motion.button
          onClick={handleCopyAll}
          className={cn(
            "ml-2 px-3 py-1.5 rounded-full text-xs font-medium transition-colors",
            copiedAll
              ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
          )}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          aria-label="Copy all numbers"
        >
          {copiedAll ? "✓ Copied!" : "Copy All"}
        </motion.button>
      )}
    </div>
  );
}

/**
 * TodaysLuckyNumbers - Display today's special lucky numbers
 */
interface TodaysLuckyNumbersProps {
  count?: number;
  className?: string;
}

export function TodaysLuckyNumbers({
  count = 6,
  className,
}: TodaysLuckyNumbersProps) {
  // Import dynamically to avoid SSR issues
  const [numbers, setNumbers] = useState<number[]>([]);
  const [isClient, setIsClient] = useState(false);

  // Use effect to ensure client-side only
  useState(() => {
    setIsClient(true);
    import("@/lib/lucky-numbers").then(({ getTodaysLuckyNumbers }) => {
      setNumbers(getTodaysLuckyNumbers(count));
    });
  });

  if (!isClient || numbers.length === 0) {
    return (
      <div className={cn("animate-pulse flex gap-2", className)}>
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700" />
        ))}
      </div>
    );
  }

  return (
    <div className={className}>
      <div className="flex items-center gap-2 mb-2">
        <span className="text-lg">🌟</span>
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Today&apos;s Lucky Numbers
        </span>
      </div>
      <LuckyNumbersRow numbers={numbers} showFullCard />
    </div>
  );
}

export default LuckyNumberCard;
