"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Textarea } from "./ui/textarea";
import { cn } from "@/lib/utils";
import { sessionManager } from "@/lib/session-manager";
import { captureUserAction } from "@/lib/error-monitoring";
import { startGoogleSignIn, useAuthSession } from "@/lib/auth-client";
import { SocialShare } from "@/components/SocialShare";
import { FavoriteButton } from "@/components/FavoriteButton";

// Dynamic imports for Lucide icons (~10KB saved)
// Icons are lazy loaded with emoji fallbacks for better initial load performance

// Lucide Icons (~10KB) - lazy loaded with emoji fallbacks
const Sparkles = dynamic(
  () => import("lucide-react").then((m) => ({ default: m.Sparkles })),
  { loading: () => <span className="inline-block w-4 h-4">✨</span> },
);

const RefreshCw = dynamic(
  () => import("lucide-react").then((m) => ({ default: m.RefreshCw })),
  { loading: () => <span className="inline-block w-4 h-4">🔄</span> },
);

const Wand2 = dynamic(
  () => import("lucide-react").then((m) => ({ default: m.Wand2 })),
  { loading: () => <span className="inline-block w-4 h-4">🪄</span> },
);

const Heart = dynamic(
  () => import("lucide-react").then((m) => ({ default: m.Heart })),
  { loading: () => <span className="inline-block w-4 h-4">❤️</span> },
);

const Smile = dynamic(
  () => import("lucide-react").then((m) => ({ default: m.Smile })),
  { loading: () => <span className="inline-block w-4 h-4">😊</span> },
);

const TrendingUp = dynamic(
  () => import("lucide-react").then((m) => ({ default: m.TrendingUp })),
  { loading: () => <span className="inline-block w-4 h-4">📈</span> },
);

const Brain = dynamic(
  () => import("lucide-react").then((m) => ({ default: m.Brain })),
  { loading: () => <span className="inline-block w-4 h-4">🧠</span> },
);

const Shuffle = dynamic(
  () => import("lucide-react").then((m) => ({ default: m.Shuffle })),
  { loading: () => <span className="inline-block w-4 h-4">🔀</span> },
);

const Loader2 = dynamic(
  () => import("lucide-react").then((m) => ({ default: m.Loader2 })),
  {
    loading: () => (
      <span className="inline-block w-4 h-4 animate-spin">⏳</span>
    ),
  },
);

interface Fortune {
  message: string;
  luckyNumbers: number[];
  theme: string;
  timestamp: string;
  source?: "ai" | "database" | "fallback";
  cached?: boolean;
  aiError?: {
    provider: string;
    status?: number;
    code?: string;
    message: string;
  };
}

interface QuotaStatus {
  limit: number;
  used: number;
  remaining: number;
  resetsAtUtc: string;
  isAuthenticated: boolean;
}

type CookieState = "unopened" | "cracking" | "opened";
type Theme =
  | "funny"
  | "inspirational"
  | "love"
  | "success"
  | "wisdom"
  | "random";

const themeConfig = {
  funny: {
    icon: Smile,
    color: "bg-yellow-100 text-yellow-800",
    label: "Funny",
    description: "Humorous and witty messages",
  },
  inspirational: {
    icon: Sparkles,
    color: "bg-blue-100 text-blue-800",
    label: "Inspirational",
    description: "Motivational and uplifting",
  },
  love: {
    icon: Heart,
    color: "bg-pink-100 text-pink-800",
    label: "Love & Relationships",
    description: "Romance and connections",
  },
  success: {
    icon: TrendingUp,
    color: "bg-green-100 text-green-800",
    label: "Success & Career",
    description: "Achievement and prosperity",
  },
  wisdom: {
    icon: Brain,
    color: "bg-purple-100 text-purple-800",
    label: "Wisdom",
    description: "Philosophical insights",
  },
  random: {
    icon: Shuffle,
    color: "bg-gray-100 text-gray-800",
    label: "Random",
    description: "Surprise me!",
  },
};

export function AIFortuneCookie() {
  const [state, setState] = useState<CookieState>("unopened");
  const [currentFortune, setCurrentFortune] = useState<Fortune | null>(null);
  const [selectedTheme, setSelectedTheme] = useState<Theme>("random");
  const [customPrompt, setCustomPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [showCustomization, setShowCustomization] = useState(false);
  const [generationSource, setGenerationSource] = useState<
    "ai" | "offline" | null
  >(null);
  const [generationError, setGenerationError] = useState<string | null>(null);
  const [quotaStatus, setQuotaStatus] = useState<QuotaStatus | null>(null);
  const [isQuotaLoading, setIsQuotaLoading] = useState(false);
  const { status: authStatus } = useAuthSession();

  useEffect(() => {
    const loadQuota = async () => {
      setIsQuotaLoading(true);
      try {
        const localSession = await sessionManager.initializeSession();
        const response = await fetch("/api/fortune/quota", {
          method: "GET",
          headers: {
            "X-Client-Id": localSession.userId,
          },
        });
        const json = await response.json().catch(() => null);
        const data =
          json && typeof json === "object" && "data" in json ? json.data : json;
        if (response.ok && data) {
          setQuotaStatus(data as QuotaStatus);
        }
      } catch (error) {
        console.error("Failed to load quota status:", error);
      } finally {
        setIsQuotaLoading(false);
      }
    };

    void loadQuota();
  }, [authStatus]);

  const generateFortune = async () => {
    if (state !== "unopened" || isGenerating) return;

    if (quotaStatus && quotaStatus.remaining <= 0) {
      const message = quotaStatus.isAuthenticated
        ? "Daily limit reached. Please try again tomorrow (UTC)."
        : "Guest limit reached. Sign in to generate more fortunes today.";
      setGenerationError(message);
      return;
    }

    setIsGenerating(true);
    setState("cracking");
    setGenerationError(null);
    setGenerationSource(null);

    try {
      const localSession = await sessionManager.initializeSession();
      const response = await fetch("/api/fortune", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Client-Id": localSession.userId,
        },
        body: JSON.stringify({
          theme: selectedTheme,
          customPrompt: customPrompt.trim() || undefined,
          mood: "positive",
          length: "medium",
        }),
      });

      const json = await response.json().catch(() => null);

      if (json?.meta?.quota) {
        setQuotaStatus(json.meta.quota as QuotaStatus);
      }

      if (!response.ok) {
        const apiMessage =
          json &&
          typeof json === "object" &&
          "message" in json &&
          typeof json.message === "string"
            ? json.message
            : json &&
                typeof json === "object" &&
                "error" in json &&
                typeof json.error === "string"
              ? json.error
              : `Request failed (${response.status})`;
        const isQuotaError =
          response.status === 429 && !!(json && json.meta && json.meta.quota);
        if (isQuotaError) {
          setGenerationError(apiMessage);
          setIsGenerating(false);
          setState("unopened");
          return;
        }
        throw new Error(apiMessage);
      }

      const fortune: Fortune =
        json && typeof json === "object" && "data" in json && json.data
          ? (json.data as Fortune)
          : (json as Fortune);
      setCurrentFortune(fortune);

      // Determine source from fortune object or API response meta
      const source = fortune.source || json?.meta?.source || "ai";
      const generationSourceValue =
        source === "fallback" || source === "database" ? "offline" : "ai";
      setGenerationSource(generationSourceValue);

      if (generationSourceValue === "offline" && fortune.aiError?.message) {
        const statusPrefix = fortune.aiError.status
          ? `(${fortune.aiError.status}) `
          : "";
        setGenerationError(
          `AI unavailable ${statusPrefix}${fortune.aiError.message}`,
        );
      }

      // Add to user history
      try {
        sessionManager.addFortuneToHistory({
          fortuneId: undefined,
          message: fortune.message,
          category:
            selectedTheme === "random" ? "inspirational" : selectedTheme,
          mood: "positive",
          source: generationSourceValue === "ai" ? "ai" : "offline",
          liked: false,
          shared: false,
          tags: fortune.luckyNumbers
            ? [`lucky-${fortune.luckyNumbers[0]}`]
            : undefined,
          customPrompt: customPrompt.trim() || undefined,
        });

        captureUserAction("fortune_generated", "ai_fortune_cookie", undefined, {
          theme: selectedTheme,
          hasCustomPrompt: !!customPrompt.trim(),
        });
      } catch (error) {
        console.error("Failed to save to history:", error);
      }

      // Show cracking animation for 2 seconds, then reveal fortune
      setTimeout(() => {
        setState("opened");
        setIsGenerating(false);
      }, 2000);
    } catch (error) {
      console.error("Error generating fortune:", error);
      setGenerationSource("offline");
      const message =
        error instanceof Error
          ? error.message
          : "AI service unavailable, using offline fortune";
      setGenerationError(message);

      // Fallback to local fortune
      const fallbackFortune: Fortune = {
        message: "The best fortunes come to those who create their own luck.",
        luckyNumbers: [7, 14, 21, 28, 35, 42],
        theme: selectedTheme,
        timestamp: new Date().toISOString(),
        source: "fallback",
      };
      setCurrentFortune(fallbackFortune);

      // Add fallback fortune to history
      try {
        sessionManager.addFortuneToHistory({
          fortuneId: undefined,
          message: fallbackFortune.message,
          category:
            selectedTheme === "random" ? "inspirational" : selectedTheme,
          mood: "positive",
          source: "offline",
          liked: false,
          shared: false,
          customPrompt: customPrompt.trim() || undefined,
        });

        captureUserAction(
          "fortune_generated_fallback",
          "ai_fortune_cookie",
          undefined,
          {
            theme: selectedTheme,
            hasCustomPrompt: !!customPrompt.trim(),
          },
        );
      } catch (historyError) {
        console.error("Failed to save fallback to history:", historyError);
      }

      setTimeout(() => {
        setState("opened");
        setIsGenerating(false);
      }, 2000);
    }
  };

  const getNewCookie = () => {
    setState("unopened");
    setCurrentFortune(null);
    setCustomPrompt("");
    setGenerationSource(null);
    setGenerationError(null);
  };

  const ThemeIcon = themeConfig[selectedTheme].icon;
  const hasQuota = !quotaStatus || quotaStatus.remaining > 0;
  const isAuthenticated =
    quotaStatus?.isAuthenticated ?? authStatus === "authenticated";
  const quotaResetLabel = quotaStatus
    ? new Date(quotaStatus.resetsAtUtc).toUTCString()
    : "";

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-gradient-to-br from-orange-50/80 to-amber-100/80 backdrop-blur-sm">
      {/* Reserve space to prevent CLS - stable container dimensions */}
      <div className="w-full max-w-2xl min-h-[600px] flex flex-col items-center justify-center">
        <AnimatePresence mode="wait">
          {state === "unopened" && (
            <motion.div
              key="unopened"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{
                type: "spring",
                stiffness: 260,
                damping: 20,
                duration: 0.6,
              }}
              className="flex flex-col items-center max-w-md w-full"
            >
              <Card className="w-full mb-4 bg-white/90 backdrop-blur-sm border-amber-200">
                <div className="p-4 flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-700">
                        Daily quota
                      </p>
                      <p className="text-xs text-gray-500">
                        {isQuotaLoading || !quotaStatus
                          ? "Loading quota..."
                          : `${quotaStatus.remaining} of ${quotaStatus.limit} remaining`}
                      </p>
                    </div>
                    {isAuthenticated ? (
                      <Badge className="bg-green-100 text-green-700">
                        Signed in
                      </Badge>
                    ) : (
                      <Badge className="bg-amber-100 text-amber-700">
                        Guest
                      </Badge>
                    )}
                  </div>
                  {quotaStatus && (
                    <div className="text-xs text-gray-500">
                      Resets at {quotaResetLabel}
                    </div>
                  )}
                  {!isAuthenticated && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-amber-200 text-amber-700 hover:bg-amber-50"
                      onClick={startGoogleSignIn}
                      aria-label="Sign in with Google"
                    >
                      Sign in for 10/day
                    </Button>
                  )}
                </div>
              </Card>

              {/* Theme Selection */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="w-full mb-6"
              >
                <Card className="p-4 bg-white/90 backdrop-blur-sm border-amber-200">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-medium text-gray-700">
                      Choose Your Fortune Theme
                    </h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowCustomization(!showCustomization)}
                      className="text-amber-600 hover:text-amber-700"
                      aria-label="Customize fortune request"
                    >
                      <Wand2 className="w-4 h-4 mr-1" />
                      Customize
                    </Button>
                  </div>

                  <Select
                    value={selectedTheme}
                    onValueChange={(value: Theme) => setSelectedTheme(value)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue>
                        <div className="flex items-center gap-2">
                          <ThemeIcon className="w-4 h-4" />
                          <span>{themeConfig[selectedTheme].label}</span>
                        </div>
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(themeConfig).map(([key, config]) => {
                        const Icon = config.icon;
                        return (
                          <SelectItem key={key} value={key}>
                            <div className="flex items-center gap-2">
                              <Icon className="w-4 h-4" />
                              <div>
                                <div className="font-medium">
                                  {config.label}
                                </div>
                                <div className="text-xs text-gray-500">
                                  {config.description}
                                </div>
                              </div>
                            </div>
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>

                  <AnimatePresence>
                    {showCustomization && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="mt-3 overflow-hidden"
                      >
                        <Textarea
                          placeholder="Add a custom request (optional)..."
                          value={customPrompt}
                          onChange={(e) => setCustomPrompt(e.target.value)}
                          className="resize-none"
                          rows={2}
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Card>
              </motion.div>

              {/* Fortune Cookie */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
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
                onClick={generateFortune}
                className={cn(
                  "cursor-pointer mb-8 relative",
                  !hasQuota && "opacity-60 cursor-not-allowed",
                )}
                role="button"
                aria-label="Generate fortune cookie"
              >
                <div className="relative">
                  {/* Cookie Shadow */}
                  <div className="absolute top-2 left-2 w-32 h-20 bg-black/20 rounded-full blur-md" />

                  {/* Fortune Cookie */}
                  <div className="relative w-32 h-20 bg-gradient-to-br from-yellow-200 to-amber-300 rounded-full transform rotate-12 shadow-lg border-2 border-amber-400">
                    {/* Cookie texture lines */}
                    <div className="absolute inset-2 border border-amber-500/30 rounded-full" />
                    <div className="absolute inset-4 border border-amber-500/20 rounded-full" />

                    {/* Theme indicator */}
                    <div className="absolute -top-3 -right-3">
                      <Badge
                        className={cn(
                          "text-xs",
                          themeConfig[selectedTheme].color,
                        )}
                      >
                        <ThemeIcon className="w-3 h-3 mr-1" />
                        {themeConfig[selectedTheme].label}
                      </Badge>
                    </div>

                    {/* Sparkle effects */}
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 8,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                      className="absolute -top-2 -right-2"
                    >
                      <Sparkles className="w-6 h-6 text-yellow-400 drop-shadow-lg" />
                    </motion.div>
                  </div>
                </div>
              </motion.div>

              {/* Instructions */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="text-center"
              >
                <span
                  role="heading"
                  aria-level={2}
                  className="block text-3xl mb-3 bg-gradient-to-r from-amber-700 via-yellow-600 to-orange-700 bg-clip-text text-transparent font-bold"
                >
                  AI Fortune Cookie
                </span>
                <p className="text-amber-700 mb-4">
                  Tap the cookie to generate your personalized fortune!
                </p>
                {generationError && (
                  <p className="text-xs text-amber-600 mb-3">
                    {generationError}
                  </p>
                )}
                <div className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-amber-50/80 to-yellow-50/80 backdrop-blur-sm border border-amber-200/50">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span className="text-sm text-amber-700 font-medium">
                    Powered by AI
                  </span>
                </div>
              </motion.div>
            </motion.div>
          )}

          {state === "cracking" && (
            <motion.div
              key="cracking"
              initial={{ scale: 1 }}
              animate={{ scale: [1, 1.2, 0.8, 1.1] }}
              transition={{ duration: 2, ease: "easeInOut" }}
              className="flex flex-col items-center"
            >
              <motion.div
                animate={{
                  rotate: [0, 5, -5, 10, -10, 0],
                  scale: [1, 1.1, 0.9, 1.05, 0.95, 1],
                }}
                transition={{ duration: 2, ease: "easeInOut" }}
                className="relative mb-8"
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
                      <Loader2 className="w-4 h-4 text-amber-600 animate-spin" />
                      <span className="text-sm text-amber-700">
                        Generating...
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 1, 0.7, 1] }}
                transition={{ duration: 2 }}
                className="text-amber-700 text-center"
              >
                AI is crafting your personalized fortune...
              </motion.p>
            </motion.div>
          )}

          {state === "opened" && currentFortune && (
            <motion.div
              key="opened"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 30,
                delay: 0.2,
              }}
              className="w-full max-w-md"
            >
              <Card className="p-6 bg-white/90 backdrop-blur-sm border-amber-200 shadow-xl">
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="text-center mb-6"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1 flex items-center justify-center gap-2">
                      <Sparkles className="w-8 h-8 text-amber-500" />
                      <h2 className="text-2xl font-bold bg-gradient-to-r from-amber-600 via-yellow-600 to-orange-600 bg-clip-text text-transparent">
                        Your AI Fortune
                      </h2>
                    </div>
                    <FavoriteButton
                      message={currentFortune.message}
                      luckyNumbers={currentFortune.luckyNumbers}
                      theme={currentFortune.theme}
                      category={
                        selectedTheme === "random"
                          ? "inspirational"
                          : selectedTheme
                      }
                      source={generationSource || "ai"}
                      variant="icon"
                      size="sm"
                      className="mt-1 h-11 w-11 min-h-[44px] min-w-[44px]"
                    />
                  </div>

                  <div className="flex items-center justify-center gap-2 mb-4">
                    <Badge
                      className={cn(
                        themeConfig[currentFortune.theme as Theme]?.color ||
                          "bg-gray-100 text-gray-800",
                      )}
                    >
                      <ThemeIcon className="w-3 h-3 mr-1" />
                      {themeConfig[currentFortune.theme as Theme]?.label ||
                        currentFortune.theme}
                    </Badge>

                    {/* Generation source indicator */}
                    {generationSource && (
                      <Badge
                        className={cn(
                          "text-xs",
                          generationSource === "ai"
                            ? "bg-green-100 text-green-700 border-green-200"
                            : "bg-blue-100 text-blue-700 border-blue-200",
                        )}
                      >
                        {generationSource === "ai"
                          ? "✨ AI Generated"
                          : "📚 Offline"}
                      </Badge>
                    )}
                  </div>

                  {/* Error message if API failed */}
                  {generationError && (
                    <p className="text-xs text-amber-600 mb-2">
                      {generationError}
                    </p>
                  )}
                </motion.div>

                <motion.blockquote
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="text-center text-gray-700 mb-6 italic leading-relaxed text-lg"
                >
                  &ldquo;{currentFortune.message}&rdquo;
                </motion.blockquote>

                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.8 }}
                  className="text-center mb-6"
                >
                  <h3 className="text-sm text-amber-700 mb-3">
                    Your Lucky Numbers
                  </h3>
                  <div className="flex justify-center gap-2 flex-wrap">
                    {currentFortune.luckyNumbers.map((number, index) => (
                      <motion.div
                        key={number}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{
                          delay: 1 + index * 0.1,
                          type: "spring",
                          stiffness: 500,
                          damping: 25,
                        }}
                        className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center shadow-md"
                      >
                        <span className="text-white font-medium text-sm">
                          {number}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                {/* Share Actions */}
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 1.2 }}
                  className="flex flex-col items-center gap-4 mb-6"
                >
                  <SocialShare
                    message={currentFortune.message}
                    luckyNumbers={currentFortune.luckyNumbers}
                    variant="inline"
                    className="justify-center"
                  />
                </motion.div>

                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 1.5 }}
                  className="text-center"
                >
                  <Button
                    onClick={getNewCookie}
                    className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white px-6 py-2 rounded-full shadow-lg transform transition-all duration-200 hover:scale-105"
                    aria-label="Generate another fortune"
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Generate Another Fortune
                  </Button>
                </motion.div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
