"use client";

import { useState, Suspense } from "react";
import dynamic from "next/dynamic";
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

// Dynamic imports for heavy dependencies
const AnimatePresence = dynamic(
  () => import("framer-motion").then((mod) => mod.AnimatePresence),
  { ssr: false },
);

const motion = dynamic(
  () => import("framer-motion").then((mod) => ({ default: mod.motion.div })),
  { ssr: false, loading: () => <div /> },
);

// Dynamic imports for icons (lazy loaded)
const Sparkles = dynamic(() =>
  import("lucide-react").then((mod) => ({ default: mod.Sparkles })),
);
const RefreshCw = dynamic(() =>
  import("lucide-react").then((mod) => ({ default: mod.RefreshCw })),
);
const Wand2 = dynamic(() =>
  import("lucide-react").then((mod) => ({ default: mod.Wand2 })),
);
const Heart = dynamic(() =>
  import("lucide-react").then((mod) => ({ default: mod.Heart })),
);
const Smile = dynamic(() =>
  import("lucide-react").then((mod) => ({ default: mod.Smile })),
);
const TrendingUp = dynamic(() =>
  import("lucide-react").then((mod) => ({ default: mod.TrendingUp })),
);
const Brain = dynamic(() =>
  import("lucide-react").then((mod) => ({ default: mod.Brain })),
);
const Shuffle = dynamic(() =>
  import("lucide-react").then((mod) => ({ default: mod.Shuffle })),
);
const Loader2 = dynamic(() =>
  import("lucide-react").then((mod) => ({ default: mod.Loader2 })),
);

interface Fortune {
  message: string;
  luckyNumbers: number[];
  theme: string;
  timestamp: string;
}

type CookieState = "unopened" | "cracking" | "opened";
type Theme =
  | "funny"
  | "inspirational"
  | "love"
  | "success"
  | "wisdom"
  | "random";

// Theme configuration with lazy-loaded icons
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

  const generateFortune = async () => {
    if (state !== "unopened" || isGenerating) return;

    setIsGenerating(true);
    setState("cracking");

    try {
      const response = await fetch("/api/fortune", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          theme: selectedTheme,
          customPrompt: customPrompt.trim() || undefined,
          mood: "positive",
          length: "medium",
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate fortune");
      }

      const json = await response.json();
      const fortune: Fortune =
        json && typeof json === "object" && "data" in json && json.data
          ? (json.data as Fortune)
          : (json as Fortune);
      setCurrentFortune(fortune);

      // Add to user history
      try {
        await sessionManager.initializeSession();
        sessionManager.addFortuneToHistory({
          fortuneId: undefined,
          message: fortune.message,
          category:
            selectedTheme === "random" ? "inspirational" : selectedTheme,
          mood: "positive",
          source: "ai",
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
      // Fallback to local fortune
      const fallbackFortune: Fortune = {
        message: "The best fortunes come to those who create their own luck.",
        luckyNumbers: [7, 14, 21, 28, 35, 42],
        theme: selectedTheme,
        timestamp: new Date().toISOString(),
      };
      setCurrentFortune(fallbackFortune);

      // Add fallback fortune to history
      try {
        await sessionManager.initializeSession();
        sessionManager.addFortuneToHistory({
          fortuneId: undefined,
          message: fallbackFortune.message,
          category:
            selectedTheme === "random" ? "inspirational" : selectedTheme,
          mood: "positive",
          source: "offline",
          liked: false,
          shared: false,
          tags: fallbackFortune.luckyNumbers
            ? [`lucky-${fallbackFortune.luckyNumbers[0]}`]
            : undefined,
        });
      } catch (error) {
        console.error("Failed to save fallback to history:", error);
      }

      setTimeout(() => {
        setState("opened");
        setIsGenerating(false);
      }, 2000);
    }
  };

  const resetCookie = () => {
    setState("unopened");
    setCurrentFortune(null);
    setCustomPrompt("");
  };

  const ThemeIcon = themeConfig[selectedTheme].icon;

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      {/* Theme Selection */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Choose Your Fortune Theme</label>
        <Select
          value={selectedTheme}
          onValueChange={(value) => setSelectedTheme(value as Theme)}
        >
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(themeConfig).map(([key, config]) => {
              const Icon = config.icon;
              return (
                <SelectItem key={key} value={key}>
                  <div className="flex items-center gap-2">
                    <Suspense fallback={<div className="w-4 h-4" />}>
                      <Icon className="w-4 h-4" />
                    </Suspense>
                    <span>{config.label}</span>
                  </div>
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
      </div>

      {/* Fortune Cookie Card - Simplified without heavy animations for initial load */}
      <Card className="p-8 text-center space-y-6">
        {state === "unopened" && (
          <div className="space-y-6">
            <div className="text-6xl">🥠</div>
            <Button
              onClick={generateFortune}
              disabled={isGenerating}
              size="lg"
              className="w-full"
            >
              {isGenerating ? (
                <>
                  <Suspense fallback={<span className="mr-2">⏳</span>}>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  </Suspense>
                  Generating...
                </>
              ) : (
                <>
                  <Suspense fallback={<span className="mr-2">✨</span>}>
                    <Wand2 className="mr-2 h-4 w-4" />
                  </Suspense>
                  Generate Fortune
                </>
              )}
            </Button>
          </div>
        )}

        {state === "cracking" && (
          <div className="space-y-4">
            <div className="text-6xl animate-bounce">🥠</div>
            <p className="text-muted-foreground">
              Cracking open your fortune...
            </p>
          </div>
        )}

        {state === "opened" && currentFortune && (
          <div className="space-y-6">
            <Badge className={cn("text-sm", themeConfig[selectedTheme].color)}>
              <Suspense fallback={<span className="mr-1">📝</span>}>
                <ThemeIcon className="w-3 h-3 mr-1" />
              </Suspense>
              {themeConfig[selectedTheme].label}
            </Badge>

            <p className="text-lg font-medium leading-relaxed">
              {currentFortune.message}
            </p>

            {currentFortune.luckyNumbers &&
              currentFortune.luckyNumbers.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    Your Lucky Numbers:
                  </p>
                  <div className="flex justify-center gap-2 flex-wrap">
                    {currentFortune.luckyNumbers.map((num, idx) => (
                      <Badge
                        key={idx}
                        variant="outline"
                        className="text-base px-3 py-1"
                      >
                        {num}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

            <Button onClick={resetCookie} variant="outline" className="w-full">
              <Suspense fallback={<span className="mr-2">🔄</span>}>
                <RefreshCw className="mr-2 h-4 w-4" />
              </Suspense>
              Try Another Fortune
            </Button>
          </div>
        )}
      </Card>

      {/* Customization Section */}
      <Card className="p-6 space-y-4">
        <Button
          variant="ghost"
          onClick={() => setShowCustomization(!showCustomization)}
          className="w-full justify-between"
        >
          <span>Customize Your Fortune</span>
          <span>{showCustomization ? "−" : "+"}</span>
        </Button>

        {showCustomization && (
          <div className="space-y-4 pt-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Custom Prompt (Optional)
              </label>
              <Textarea
                placeholder="Add your own twist to the fortune..."
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                className="min-h-[100px]"
                maxLength={500}
              />
              <p className="text-xs text-muted-foreground">
                {customPrompt.length}/500 characters
              </p>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
