"use client";

import { useCallback, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { Drama, Copy, Loader2, Wand2, Lock, ImageDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FavoriteButton } from "@/components/FavoriteButton";
import { QuotaGateCard } from "@/components/QuotaGateCard";
import { useAuthSession } from "@/lib/auth-client";
import { buildShareCardUrl, shareOrDownloadCard } from "@/lib/share-card";
import { withClientId } from "@/lib/client-id";
import { extractQuota, type QuotaInfo } from "@/lib/quota-client";
import { trackEvent } from "@/lib/track";
import { cn } from "@/lib/utils";
import {
  PERSONAS,
  PERSONA_QUANTITIES,
  FREE_PERSONA_IDS,
  getPersona,
} from "@/lib/prompts/persona";

interface GeneratedFortune {
  message: string;
  luckyNumbers: number[];
}

const FREE = new Set(FREE_PERSONA_IDS);

export function PersonaClient() {
  const { data: session } = useAuthSession();
  const isPremium = Boolean(session?.user?.isPremium);

  const [persona, setPersona] = useState<string>("passive-aggressive");
  const [topic, setTopic] = useState("");
  const [quantity, setQuantity] = useState<number>(1);
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<GeneratedFortune[]>([]);
  const [quotaGate, setQuotaGate] = useState<QuotaInfo | null>(null);
  const [quotaMessage, setQuotaMessage] = useState<string | undefined>();

  const canUse = useCallback(
    (id: string) => isPremium || FREE.has(id),
    [isPremium],
  );

  const generate = useCallback(async () => {
    if (!canUse(persona)) {
      toast.error("That persona is premium. Pick a free one for now.");
      return;
    }
    setIsLoading(true);
    // Clear any previous gate up front: a stale card (e.g. pre-sign-in guest
    // numbers) left on screen next to a fresh non-429 error reads as "signing
    // in did nothing".
    setQuotaGate(null);
    setQuotaMessage(undefined);
    try {
      const res = await fetch("/api/generator", {
        method: "POST",
        headers: withClientId({ "Content-Type": "application/json" }),
        body: JSON.stringify({
          mode: "persona",
          source: "generator",
          params: { persona, topic, quantity },
        }),
      });
      // Bare .json() throws on the HTML error pages a CDN/edge can return,
      // which the outer catch would mislabel as "Network error".
      const json = await res.json().catch(() => null);
      if (!res.ok) {
        // Daily limit: show an in-place card (results above are kept) instead
        // of a toast the user can miss.
        const quota = res.status === 429 ? extractQuota(json) : null;
        if (quota) {
          setQuotaGate(quota);
          setQuotaMessage(
            typeof json?.error === "string" ? json.error : undefined,
          );
          return;
        }
        toast.error(json?.error || "Generation failed. Please try again.");
        return;
      }
      const fortunes: GeneratedFortune[] = json?.data?.fortunes ?? [];
      if (fortunes.length === 0) {
        toast.error("Nothing came back. Try again.");
        return;
      }
      // Reported on a successful reveal only. Generator modes have no local
      // fallback (failures surface as a toast and return early), so
      // is_fallback is structurally false here.
      trackEvent("cookie_cracked", {
        source: "generator",
        is_fallback: false,
      });
      setResults(fortunes);
      setQuotaGate(null);
    } catch {
      toast.error("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [persona, topic, quantity, canUse]);

  const copyFortune = useCallback((text: string) => {
    navigator.clipboard?.writeText(text).then(
      () => toast.success("Copied"),
      () => toast.error("Copy failed"),
    );
  }, []);

  const shareImage = useCallback(
    async (fortune: GeneratedFortune) => {
      const label = getPersona(persona)?.label ?? "Persona";
      const url = buildShareCardUrl({
        message: fortune.message,
        luckyNumbers: fortune.luckyNumbers,
        category: label,
        emoji: "🎭",
      });
      const result = await shareOrDownloadCard(url, fortune.message);
      if (result === "downloaded") toast.success("Image saved");
    },
    [persona],
  );

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,400px)_minmax(0,1fr)]">
      {/* Parameter panel */}
      <div className="space-y-6 rounded-2xl border border-slate-200 bg-white/70 p-6 backdrop-blur dark:border-slate-700 dark:bg-slate-900/60">
        <div>
          <p className="mb-2 text-sm font-medium text-slate-700 dark:text-slate-300">
            Persona
          </p>
          <div className="grid gap-2 sm:grid-cols-2">
            {PERSONAS.map((p) => {
              const unlocked = canUse(p.id);
              const active = persona === p.id;
              return (
                <button
                  key={p.id}
                  type="button"
                  disabled={!unlocked}
                  onClick={() => unlocked && setPersona(p.id)}
                  aria-pressed={active}
                  title={unlocked ? p.example : "Premium persona"}
                  className={cn(
                    "rounded-xl border p-3 text-left transition-all",
                    !unlocked && "cursor-not-allowed opacity-60",
                    active
                      ? "border-amber-400 bg-amber-100 dark:border-amber-500/60 dark:bg-amber-500/20"
                      : "border-slate-200 bg-white hover:border-amber-300 dark:border-slate-700 dark:bg-slate-800",
                  )}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                      {p.label}
                    </span>
                    {!unlocked && <Lock className="h-3.5 w-3.5 text-slate-400" />}
                  </div>
                  <p className="mt-1 line-clamp-2 text-xs text-slate-500 dark:text-slate-400">
                    {p.description}
                  </p>
                </button>
              );
            })}
          </div>
          {!isPremium && (
            <p className="mt-2 text-xs text-slate-400">
              Locked personas unlock with Premium.
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="persona-topic"
            className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
          >
            Topic{" "}
            <span className="text-xs font-normal text-slate-400">
              (optional — e.g. love, career, money)
            </span>
          </label>
          <input
            id="persona-topic"
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            maxLength={60}
            placeholder="Leave blank for the persona's choice"
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-500/40 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
          />
        </div>

        <div>
          <p className="mb-2 text-sm font-medium text-slate-700 dark:text-slate-300">
            Quantity
          </p>
          <div className="flex gap-2">
            {PERSONA_QUANTITIES.map((q) => (
              <button
                key={q}
                type="button"
                onClick={() => setQuantity(q)}
                aria-pressed={quantity === q}
                className={cn(
                  "h-10 flex-1 rounded-xl border text-sm font-semibold transition-all",
                  quantity === q
                    ? "border-amber-400 bg-amber-100 text-amber-800 dark:border-amber-500/60 dark:bg-amber-500/20 dark:text-amber-200"
                    : "border-slate-200 bg-white text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300",
                )}
              >
                {q}
              </button>
            ))}
          </div>
        </div>

        <Button
          onClick={generate}
          disabled={isLoading}
          className="w-full rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Channeling…
            </>
          ) : (
            <>
              <Wand2 className="mr-2 h-4 w-4" />
              Generate {quantity === 1 ? "Fortune" : `${quantity} Fortunes`}
            </>
          )}
        </Button>
      </div>

      {/* Results */}
      <div className="min-h-[200px]">
        {quotaGate && (
          <QuotaGateCard
            quota={quotaGate}
            message={quotaMessage}
            className="mb-4"
          />
        )}

        {results.length === 0 && !isLoading && !quotaGate && (
          <div className="flex h-full min-h-[200px] flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 p-8 text-center text-slate-400 dark:border-slate-700">
            <Drama className="mb-3 h-8 w-8" />
            <p>Pick a persona and let them speak.</p>
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
                className="group relative overflow-hidden rounded-xl border border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50 p-4 pr-28 shadow-sm dark:border-amber-500/30 dark:from-slate-800 dark:to-slate-800/60"
              >
                <p className="font-serif text-slate-800 dark:text-slate-100">
                  {fortune.message}
                </p>
                <div className="absolute right-2 top-2 flex items-center">
                  <FavoriteButton
                    variant="icon"
                    size="sm"
                    message={fortune.message}
                    luckyNumbers={fortune.luckyNumbers}
                    theme={`persona:${persona}`}
                  />
                  <button
                    type="button"
                    onClick={() => copyFortune(fortune.message)}
                    aria-label="Copy fortune"
                    className="rounded-lg p-2 text-slate-400 opacity-0 transition-opacity hover:bg-white/60 hover:text-amber-600 group-hover:opacity-100 dark:hover:bg-slate-700/60"
                  >
                    <Copy className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => shareImage(fortune)}
                    aria-label="Share as image"
                    className="rounded-lg p-2 text-slate-400 opacity-0 transition-opacity hover:bg-white/60 hover:text-amber-600 group-hover:opacity-100 dark:hover:bg-slate-700/60"
                  >
                    <ImageDown className="h-4 w-4" />
                  </button>
                </div>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      </div>
    </div>
  );
}
