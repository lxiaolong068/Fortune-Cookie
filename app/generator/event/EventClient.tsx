"use client";

import { useCallback, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { Copy, Loader2, Wand2, PartyPopper, ClipboardList } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import {
  EVENT_TYPES,
  EVENT_TONES,
  EVENT_QUANTITIES,
  type EventType,
  type EventTone,
} from "@/lib/prompts/event";

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

export function EventClient() {
  const [eventType, setEventType] = useState<EventType>("wedding");
  const [personalization, setPersonalization] = useState("");
  const [tone, setTone] = useState<EventTone>("sweet");
  const [quantity, setQuantity] = useState<number>(10);
  const [avoidDuplicates, setAvoidDuplicates] = useState(true);
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
          mode: "event",
          source: "generator",
          params: { eventType, personalization, tone, quantity, avoidDuplicates },
        }),
      });
      const json = await res.json();
      if (!res.ok) {
        toast.error(json?.error || "Generation failed. Please try again.");
        return;
      }
      const fortunes: GeneratedFortune[] = json?.data?.fortunes ?? [];
      if (fortunes.length === 0) {
        toast.error("Nothing came back. Try again.");
        return;
      }
      setResults(fortunes);
      if (avoidDuplicates && fortunes.length < quantity) {
        toast.info(
          `${fortunes.length} unique messages (duplicates removed).`,
        );
      }
    } catch {
      toast.error("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [eventType, personalization, tone, quantity, avoidDuplicates]);

  const copyOne = useCallback((text: string) => {
    navigator.clipboard?.writeText(text).then(
      () => toast.success("Copied"),
      () => toast.error("Copy failed"),
    );
  }, []);

  const copyAll = useCallback(() => {
    const all = results.map((r) => r.message).join("\n");
    navigator.clipboard?.writeText(all).then(
      () => toast.success(`Copied ${results.length} messages`),
      () => toast.error("Copy failed"),
    );
  }, [results]);

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,400px)_minmax(0,1fr)]">
      {/* Parameter panel */}
      <div className="space-y-6 rounded-2xl border border-slate-200 bg-white/70 p-6 backdrop-blur dark:border-slate-700 dark:bg-slate-900/60">
        <Segmented
          label="Event Type"
          options={EVENT_TYPES}
          value={eventType}
          onChange={setEventType}
        />

        <div>
          <label
            htmlFor="event-personalization"
            className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
          >
            Personalization{" "}
            <span className="text-xs font-normal text-slate-400">
              (names, dates, hobbies…)
            </span>
          </label>
          <textarea
            id="event-personalization"
            value={personalization}
            onChange={(e) => setPersonalization(e.target.value)}
            maxLength={200}
            rows={3}
            placeholder="e.g. Sarah & Tom, met in Paris, love hiking"
            className="w-full resize-none rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-500/40 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
          />
        </div>

        <Segmented
          label="Tone"
          options={EVENT_TONES}
          value={tone}
          onChange={setTone}
        />

        <Segmented
          label="Quantity"
          options={EVENT_QUANTITIES.map((q) => ({ value: q, label: String(q) }))}
          value={quantity}
          onChange={setQuantity}
        />

        <div className="flex items-center justify-between">
          <label
            htmlFor="avoid-dupes"
            className="text-sm font-medium text-slate-700 dark:text-slate-300"
          >
            Avoid duplicates
          </label>
          <Switch
            id="avoid-dupes"
            checked={avoidDuplicates}
            onCheckedChange={setAvoidDuplicates}
          />
        </div>

        <Button
          onClick={generate}
          disabled={isLoading}
          className="w-full rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Writing {quantity} messages…
            </>
          ) : (
            <>
              <Wand2 className="mr-2 h-4 w-4" />
              Generate {quantity} Messages
            </>
          )}
        </Button>
      </div>

      {/* Results */}
      <div className="min-h-[200px]">
        {results.length === 0 && !isLoading && (
          <div className="flex h-full min-h-[200px] flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 p-8 text-center text-slate-400 dark:border-slate-700">
            <PartyPopper className="mb-3 h-8 w-8" />
            <p>Describe the event and generate a batch of fortunes.</p>
          </div>
        )}

        {results.length > 0 && (
          <div className="mb-3 flex items-center justify-between">
            <p className="text-sm text-slate-500">
              {results.length} message{results.length === 1 ? "" : "s"}
            </p>
            <Button variant="outline" size="sm" onClick={copyAll} className="rounded-lg">
              <ClipboardList className="mr-1.5 h-4 w-4" />
              Copy all
            </Button>
          </div>
        )}

        <ul className="space-y-2 list-none p-0 m-0">
          <AnimatePresence>
            {results.map((fortune, index) => (
              <motion.li
                key={`${index}-${fortune.message.slice(0, 16)}`}
                initial={{ opacity: 0, y: -8, scaleY: 0.7 }}
                animate={{ opacity: 1, y: 0, scaleY: 1 }}
                exit={{ opacity: 0 }}
                transition={{
                  delay: Math.min(index * 0.03, 0.6),
                  duration: 0.25,
                  ease: "easeOut",
                }}
                style={{ transformOrigin: "top" }}
                className="group relative flex items-start gap-3 rounded-lg border border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50 p-3 pr-10 dark:border-amber-500/30 dark:from-slate-800 dark:to-slate-800/60"
              >
                <span className="mt-0.5 text-xs font-medium text-amber-500">
                  {index + 1}
                </span>
                <p className="flex-1 font-serif text-sm text-slate-800 dark:text-slate-100">
                  {fortune.message}
                </p>
                <button
                  type="button"
                  onClick={() => copyOne(fortune.message)}
                  aria-label="Copy message"
                  className="absolute right-2 top-2 rounded-lg p-1.5 text-slate-400 opacity-0 transition-opacity hover:bg-white/60 hover:text-amber-600 group-hover:opacity-100 dark:hover:bg-slate-700/60"
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
