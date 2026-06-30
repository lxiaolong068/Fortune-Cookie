"use client";

import { useCallback, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { Sparkles, Copy, Loader2, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  TIME_HORIZONS,
  FORTUNE_TYPES,
  ORACLE_QUANTITIES,
  MIN_INTENSITY,
  MAX_INTENSITY,
  type TimeHorizon,
  type FortuneType,
} from "@/lib/prompts/oracle";

interface GeneratedFortune {
  message: string;
  luckyNumbers: number[];
}

const INTENSITY_LABELS: Record<number, string> = {
  1: "Vague",
  2: "Loose",
  3: "Balanced",
  4: "Specific",
  5: "Precise",
};

function SegmentedGroup<T extends string | number>({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: ReadonlyArray<{ value: T; label: string }>;
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div>
      <p className="mb-2 text-sm font-medium text-slate-700 dark:text-slate-300">
        {label}
      </p>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => (
          <button
            key={String(opt.value)}
            type="button"
            onClick={() => onChange(opt.value)}
            aria-pressed={value === opt.value}
            className={cn(
              "rounded-xl border px-3 py-2 text-sm font-medium transition-all",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500",
              value === opt.value
                ? "border-amber-400 bg-amber-100 text-amber-800 dark:border-amber-500/60 dark:bg-amber-500/20 dark:text-amber-200"
                : "border-slate-200 bg-white text-slate-600 hover:border-amber-300 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300",
            )}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export function OracleClient() {
  const [timeHorizon, setTimeHorizon] = useState<TimeHorizon>("today");
  const [intensity, setIntensity] = useState(3);
  const [fortuneTypes, setFortuneTypes] = useState<FortuneType[]>(["good"]);
  const [quantity, setQuantity] = useState<number>(1);
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<GeneratedFortune[]>([]);

  const toggleType = useCallback((type: FortuneType) => {
    setFortuneTypes((prev) =>
      prev.includes(type)
        ? prev.filter((t) => t !== type)
        : [...prev, type],
    );
  }, []);

  const generate = useCallback(async () => {
    if (fortuneTypes.length === 0) {
      toast.error("Pick at least one fortune type.");
      return;
    }
    setIsLoading(true);
    setResults([]);
    try {
      const res = await fetch("/api/generator", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode: "oracle",
          source: "generator",
          params: { timeHorizon, intensity, fortuneTypes, quantity },
        }),
      });
      const json = await res.json();
      if (!res.ok) {
        toast.error(json?.error || "Generation failed. Please try again.");
        return;
      }
      const fortunes: GeneratedFortune[] = json?.data?.fortunes ?? [];
      if (fortunes.length === 0) {
        toast.error("The oracle stayed silent. Try again.");
        return;
      }
      setResults(fortunes);
    } catch {
      toast.error("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [timeHorizon, intensity, fortuneTypes, quantity]);

  const copyFortune = useCallback((text: string) => {
    navigator.clipboard?.writeText(text).then(
      () => toast.success("Copied"),
      () => toast.error("Copy failed"),
    );
  }, []);

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,360px)_minmax(0,1fr)]">
      {/* Parameter panel */}
      <div className="space-y-6 rounded-2xl border border-slate-200 bg-white/70 p-6 backdrop-blur dark:border-slate-700 dark:bg-slate-900/60">
        <SegmentedGroup
          label="Time Horizon"
          options={TIME_HORIZONS}
          value={timeHorizon}
          onChange={setTimeHorizon}
        />

        <div>
          <p className="mb-2 text-sm font-medium text-slate-700 dark:text-slate-300">
            Intensity — {INTENSITY_LABELS[intensity]}
          </p>
          <div className="flex gap-2">
            {Array.from(
              { length: MAX_INTENSITY - MIN_INTENSITY + 1 },
              (_, i) => MIN_INTENSITY + i,
            ).map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => setIntensity(n)}
                aria-label={`Intensity ${n}`}
                aria-pressed={intensity === n}
                className={cn(
                  "h-10 flex-1 rounded-xl border text-sm font-semibold transition-all",
                  n <= intensity
                    ? "border-amber-400 bg-amber-100 text-amber-800 dark:border-amber-500/60 dark:bg-amber-500/20 dark:text-amber-200"
                    : "border-slate-200 bg-white text-slate-400 dark:border-slate-700 dark:bg-slate-800",
                )}
              >
                {n}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="mb-2 text-sm font-medium text-slate-700 dark:text-slate-300">
            Fortune Type{" "}
            <span className="text-xs font-normal text-slate-400">
              (choose one or more)
            </span>
          </p>
          <div className="flex flex-wrap gap-2">
            {FORTUNE_TYPES.map((opt) => {
              const active = fortuneTypes.includes(opt.value);
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => toggleType(opt.value)}
                  aria-pressed={active}
                  className={cn(
                    "rounded-xl border px-3 py-2 text-sm font-medium transition-all",
                    active
                      ? "border-amber-400 bg-amber-100 text-amber-800 dark:border-amber-500/60 dark:bg-amber-500/20 dark:text-amber-200"
                      : "border-slate-200 bg-white text-slate-600 hover:border-amber-300 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300",
                  )}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
        </div>

        <SegmentedGroup
          label="Quantity"
          options={ORACLE_QUANTITIES.map((q) => ({ value: q, label: String(q) }))}
          value={quantity}
          onChange={setQuantity}
        />

        <Button
          onClick={generate}
          disabled={isLoading}
          className="w-full rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Consulting the oracle…
            </>
          ) : (
            <>
              <Wand2 className="mr-2 h-4 w-4" />
              Reveal {quantity === 1 ? "Fortune" : `${quantity} Fortunes`}
            </>
          )}
        </Button>
      </div>

      {/* Results */}
      <div className="min-h-[200px]">
        {results.length === 0 && !isLoading && (
          <div className="flex h-full min-h-[200px] flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 p-8 text-center text-slate-400 dark:border-slate-700">
            <Sparkles className="mb-3 h-8 w-8" />
            <p>Set your parameters and reveal your fortunes.</p>
          </div>
        )}

        <ul className="space-y-3 list-none p-0 m-0">
          <AnimatePresence>
            {results.map((fortune, index) => (
              <motion.li
                key={`${index}-${fortune.message.slice(0, 16)}`}
                initial={{ opacity: 0, y: -12, scaleY: 0.6 }}
                animate={{ opacity: 1, y: 0, scaleY: 1 }}
                exit={{ opacity: 0 }}
                transition={{
                  delay: index * 0.08,
                  duration: 0.35,
                  ease: "easeOut",
                }}
                style={{ transformOrigin: "top" }}
                className="group relative overflow-hidden rounded-xl border border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50 p-4 pr-12 shadow-sm dark:border-amber-500/30 dark:from-slate-800 dark:to-slate-800/60"
              >
                <p className="font-serif text-slate-800 dark:text-slate-100">
                  {fortune.message}
                </p>
                {fortune.luckyNumbers?.length > 0 && (
                  <p className="mt-2 text-xs tracking-wider text-amber-600 dark:text-amber-300">
                    Lucky: {fortune.luckyNumbers.join(" · ")}
                  </p>
                )}
                <button
                  type="button"
                  onClick={() => copyFortune(fortune.message)}
                  aria-label="Copy fortune"
                  className="absolute right-3 top-3 rounded-lg p-2 text-slate-400 opacity-0 transition-opacity hover:bg-white/60 hover:text-amber-600 group-hover:opacity-100 dark:hover:bg-slate-700/60"
                >
                  <Copy className="h-4 w-4" />
                </button>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      </div>
    </div>
  );
}
