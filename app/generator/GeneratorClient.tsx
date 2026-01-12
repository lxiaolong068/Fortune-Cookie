"use client";

import { useState, useCallback, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { useAuthSession } from "@/lib/auth-client";

// Types
import type {
  Theme,
  CookieState,
  HistoryTab,
  QuotaStatus,
  Personalization,
  Fortune,
} from "@/lib/types/generator";
import { DEFAULT_PERSONALIZATION } from "@/lib/types/generator";

// Components
import { HeroSection } from "@/components/generator/HeroSection";
import { ThemeSelector } from "@/components/generator/ThemeSelector";
import { PersonalizationPanel } from "@/components/generator/PersonalizationPanel";
import { CookieDisplay } from "@/components/generator/CookieDisplay";
import { ResultLayout } from "@/components/generator/GenerationResult";
import { HistoryTabsContainer } from "@/components/generator/HistoryTabs";
import { SEOContent } from "@/components/generator/SEOContent";
import { RelatedPagesSection } from "@/components/generator/RelatedPagesSection";

// Fortune API response type
interface FortuneApiResponse {
  success: boolean;
  data?: {
    message: string;
    luckyNumbers: number[];
    theme: string;
    source: string;
    timestamp: string;
    id?: string;
  };
  meta?: {
    quota?: QuotaStatus;
    source?: "ai" | "database" | "fallback";
  };
  error?: string;
}

// Valid themes for URL param validation
const VALID_THEMES: Theme[] = [
  "funny",
  "inspirational",
  "love",
  "success",
  "wisdom",
  "random",
];

// Map fortune style to generator tone
const STYLE_TO_TONE: Record<string, Personalization["tone"]> = {
  classic: "",
  poetic: "soft",
  modern: "direct",
  playful: "playful",
  calm: "soft",
};

// Map category names that differ between pages
const CATEGORY_TO_THEME: Record<string, Theme> = {
  // Direct mappings
  funny: "funny",
  inspirational: "inspirational",
  love: "love",
  success: "success",
  wisdom: "wisdom",
  // Indirect mappings (categories that don't have direct theme match)
  friendship: "love", // friendship messages → love theme
  birthday: "funny", // birthday messages → funny theme
  study: "success", // study messages → success theme
  health: "inspirational", // health messages → inspirational theme
  travel: "inspirational", // travel messages → inspirational theme
};

export function GeneratorClient() {
  const { status } = useAuthSession();
  const isAuthenticated = status === "authenticated";
  const isAuthLoading = status === "loading";
  const searchParams = useSearchParams();

  // Parse URL params for "Generate Similar" feature
  const urlTheme = searchParams.get("theme");
  const urlCategory = searchParams.get("category");
  const urlStyle = searchParams.get("style");
  const urlRef = searchParams.get("ref");
  const urlTags = searchParams.get("tags");
  const parsedTags = urlTags
    ? urlTags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean)
    : [];

  // Determine initial theme from URL params
  const getInitialTheme = (): Theme => {
    // Check direct theme param first
    if (urlTheme && VALID_THEMES.includes(urlTheme as Theme)) {
      return urlTheme as Theme;
    }
    // Check category param and map to theme
    if (urlCategory) {
      const mappedTheme = CATEGORY_TO_THEME[urlCategory];
      if (mappedTheme) return mappedTheme;
    }
    return "random";
  };

  // Determine initial tone from URL style param
  const getInitialPersonalization = (): Personalization => {
    const base = { ...DEFAULT_PERSONALIZATION };
    if (urlStyle && urlStyle in STYLE_TO_TONE) {
      base.tone = STYLE_TO_TONE[urlStyle] || "";
    }
    return base;
  };

  // Determine initial custom prompt from reference message
  const getInitialCustomPrompt = (): string => {
    const prompts: string[] = [];

    if (urlRef) {
      prompts.push(`Generate a similar fortune to: "${urlRef}"`);
    }
    if (parsedTags.length > 0) {
      prompts.push(`Include themes like: ${parsedTags.join(", ")}`);
    }

    return prompts.join(" ");
  };

  // Core state
  const [cookieState, setCookieState] = useState<CookieState>("unopened");
  const [currentFortune, setCurrentFortune] = useState<Fortune | null>(null);

  // Selection state - initialized from URL params
  const [selectedTheme, setSelectedTheme] = useState<Theme>(getInitialTheme);
  const [personalization, setPersonalization] = useState<Personalization>(
    getInitialPersonalization,
  );
  const [customPrompt, setCustomPrompt] = useState(getInitialCustomPrompt);
  // Auto-show personalization panel if we have URL params
  const [showPersonalization, setShowPersonalization] = useState(
    Boolean(urlStyle || urlRef || urlTags),
  );

  // UI state
  const [quotaStatus, setQuotaStatus] = useState<QuotaStatus | null>(null);
  const [isQuotaLoading, setIsQuotaLoading] = useState(true);
  const [quotaError, setQuotaError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<HistoryTab>("recent");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationError, setGenerationError] = useState<string | null>(null);
  const [generationSource, setGenerationSource] = useState<
    "ai" | "offline" | null
  >(null);

  // Fetch quota status on mount
  useEffect(() => {
    fetchQuotaStatus();
  }, []);

  const fetchQuotaStatus = async () => {
    setIsQuotaLoading(true);
    setQuotaError(null);
    try {
      const response = await fetch("/api/fortune/quota", {
        cache: "no-store",
        credentials: "include",
      });
      const data = await response.json().catch(() => null);
      if (!response.ok) {
        throw new Error(
          typeof data?.error === "string"
            ? data.error
            : "Failed to load quota status.",
        );
      }

      if (data?.data) {
        setQuotaStatus(data.data);
        return;
      }

      throw new Error("Unexpected quota response.");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to load quota status.";
      console.error("Failed to fetch quota:", err);
      setQuotaError(message);
    } finally {
      setIsQuotaLoading(false);
    }
  };

  const generateFortune = useCallback(async () => {
    if (isGenerating) return;

    setIsGenerating(true);
    setGenerationError(null);
    setCookieState("cracking");

    try {
      const response = await fetch("/api/fortune", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          theme: selectedTheme,
          scenario: personalization.scenario || undefined,
          tone: personalization.tone || undefined,
          language: personalization.language,
          customPrompt: customPrompt || undefined,
        }),
      });

      const data: FortuneApiResponse = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate fortune");
      }

      if (data.success && data.data) {
        const fortune: Fortune = {
          message: data.data.message,
          luckyNumbers: data.data.luckyNumbers,
          theme: data.data.theme,
          timestamp: data.data.timestamp,
          source: data.data.source as Fortune["source"],
        };

        setCurrentFortune(fortune);
        setCookieState("opened");
        setGenerationSource(fortune.source === "ai" ? "ai" : "offline");

        // Update quota if available
        if (data.meta?.quota) {
          setQuotaStatus(data.meta.quota);
        }
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Something went wrong";
      setGenerationError(errorMessage);
      setCookieState("unopened");
      toast.error(errorMessage);
    } finally {
      setIsGenerating(false);
    }
  }, [selectedTheme, personalization, customPrompt, isGenerating]);

  const handleCookieClick = () => {
    if (cookieState === "unopened" && !isGenerating) {
      generateFortune();
    }
  };

  const handleGenerateAnother = () => {
    setCookieState("unopened");
    setCurrentFortune(null);
    setGenerationSource(null);
    setGenerationError(null);
    // Small delay then generate
    setTimeout(() => generateFortune(), 300);
  };

  const handlePersonalizationChange = (updates: Partial<Personalization>) => {
    setPersonalization((prev) => ({ ...prev, ...updates }));
  };

  const handleTogglePersonalization = () => {
    setShowPersonalization((prev) => !prev);
  };

  // Determine if generation is disabled (quota exhausted)
  const isDisabled = quotaStatus !== null && quotaStatus.remaining <= 0;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <HeroSection
        quotaStatus={quotaStatus}
        isQuotaLoading={isQuotaLoading}
        quotaError={quotaError}
        isAuthenticated={isAuthenticated}
        isAuthLoading={isAuthLoading}
      />

      {/* Main Generator Area */}
      <div className="max-w-4xl mx-auto">
        {/* Theme Selector */}
        <div className="mb-6">
          <ThemeSelector
            selectedTheme={selectedTheme}
            onThemeChange={setSelectedTheme}
            disabled={isGenerating}
          />
        </div>

        {/* Personalization Panel */}
        <div className="mb-8">
          <PersonalizationPanel
            isOpen={showPersonalization}
            onToggle={handleTogglePersonalization}
            personalization={personalization}
            onPersonalizationChange={handlePersonalizationChange}
            customPrompt={customPrompt}
            onCustomPromptChange={setCustomPrompt}
            disabled={isGenerating}
          />
        </div>

        {/* Cookie Display / Result Area */}
        <div className="mb-8">
          <AnimatePresence mode="wait">
            {cookieState !== "opened" ? (
              <motion.div
                key="cookie"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
              >
                <CookieDisplay
                  cookieState={cookieState}
                  selectedTheme={selectedTheme}
                  onCookieClick={handleCookieClick}
                  disabled={isDisabled}
                  isGenerating={isGenerating}
                />
              </motion.div>
            ) : currentFortune ? (
              <motion.div
                key="result"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
              >
                <ResultLayout
                  fortune={currentFortune}
                  selectedTheme={selectedTheme}
                  generationSource={generationSource}
                  generationError={generationError}
                  onGenerateAnother={handleGenerateAnother}
                />
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>

        {/* History Tabs */}
        <div className="mb-12">
          <HistoryTabsContainer
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />
        </div>
      </div>

      {/* SEO Content */}
      <SEOContent />

      {/* Related Pages */}
      <RelatedPagesSection />
    </div>
  );
}
