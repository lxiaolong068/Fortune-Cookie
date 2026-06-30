"use client";

import { useCallback, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { Dices, Copy, Loader2, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  RPG_TARGETS,
  RPG_STYLES,
  RPG_SETTINGS,
  RPG_QUANTITIES,
  type RpgTarget,
  type RpgStyle,
  type RpgSetting,
} from "@/lib/prompts/rpg";

interface GeneratedFortune {
  message: string;
  luckyNumbers: number[];
}

function Segmented<T extends string | number>({
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

export function RpgClient() {
  const [target, setTarget] = useState<RpgTarget>("for-character");
  const [style, setStyle] = useState<RpgStyle>("ominous");
  const [setting, setSetting] = useState<RpgSetting>("classic-fantasy");
  const [quantity, setQuantity] = useState<number>(1);
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<GeneratedFortune[]>([]);

  const generate = useCallback(async () => {
    setIsLoading(true);
    setResults([]);
    try {
      const res = await fetch("/api/generator", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode: "rpg",
          source: "generator",
          params: { target, style, setting, quantity },
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
  }, [target, style, setting, quantity]);

  const copyFortune = useCallback((text: string) => {
    navigator.clipboard?.writeText(text).then(
      () => toast.success("Copied"),
      () => toast.error("Copy failed"),
    );
  }, []);

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,400px)_minmax(0,1fr)]">
      {/* Parameter panel */}
      <div className="space-y-6 rounded-2xl border border-slate-200 bg-white/70 p-6 backdrop-blur dark:border-slate-700 dark:bg-slate-900/60">
        <Segmented label="Target" options={RPG_TARGETS} value={target} onChange={setTarget} />
        <Segmented label="Style" options={RPG_STYLES} value={style} onChange={setStyle} />
        <Segmented label="Setting" options={RPG_SETTINGS} value={setting} onChange={setSetting} />
        <Segmented
          label="Quantity"
          options={RPG_QUANTITIES.map((q) => ({ value: q, label: String(q) }))}
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
              Roll {quantity === 1 ? "a Fortune" : `${quantity} Fortunes`}
            </>
          )}
        </Button>
      </div>

      {/* Results */}
      <div className="min-h-[200px]">
        {results.length === 0 && !isLoading && (
          <div className="flex h-full min-h-[200px] flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 p-8 text-center text-slate-400 dark:border-slate-700">
            <Dices className="mb-3 h-8 w-8" />
            <p>Set the scene and roll for prophecy.</p>
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
                transition={{ delay: index * 0.08, duration: 0.35, ease: "easeOut" }}
                style={{ transformOrigin: "top" }}
                className="group relative overflow-hidden rounded-xl border border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50 p-4 pr-12 shadow-sm dark:border-amber-500/30 dark:from-slate-800 dark:to-slate-800/60"
              >
                <p className="font-serif text-slate-800 dark:text-slate-100">
                  {fortune.message}
                </p>
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
