"use client";

import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { useSession } from "next-auth/react";

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

export function GeneratorClient() {
  const { status } = useSession();
  const isAuthenticated = status === "authenticated";

  // Core state
  const [cookieState, setCookieState] = useState<CookieState>("unopened");
  const [currentFortune, setCurrentFortune] = useState<Fortune | null>(null);

  // Selection state
  const [selectedTheme, setSelectedTheme] = useState<Theme>("random");
  const [personalization, setPersonalization] = useState<Personalization>(
    DEFAULT_PERSONALIZATION,
  );
  const [customPrompt, setCustomPrompt] = useState("");
  const [showPersonalization, setShowPersonalization] = useState(false);

  // UI state
  const [quotaStatus, setQuotaStatus] = useState<QuotaStatus | null>(null);
  const [isQuotaLoading, setIsQuotaLoading] = useState(true);
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
    try {
      const response = await fetch("/api/fortune/quota");
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data) {
          setQuotaStatus(data.data);
        }
      }
    } catch (err) {
      console.error("Failed to fetch quota:", err);
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
        isAuthenticated={isAuthenticated}
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
