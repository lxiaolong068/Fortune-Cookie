"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import {
  type Personalization,
  type Scenario,
  type Tone,
  type Language,
  SCENARIO_OPTIONS,
  TONE_OPTIONS,
  LANGUAGE_OPTIONS,
} from "@/lib/types/generator";

interface PersonalizationPanelProps {
  isOpen: boolean;
  onToggle: () => void;
  personalization: Personalization;
  onPersonalizationChange: (updates: Partial<Personalization>) => void;
  customPrompt: string;
  onCustomPromptChange: (value: string) => void;
  disabled?: boolean;
}

export function PersonalizationPanel({
  isOpen,
  onToggle,
  personalization,
  onPersonalizationChange,
  customPrompt,
  onCustomPromptChange,
  disabled = false,
}: PersonalizationPanelProps) {
  return (
    <Card className="bg-white/90 backdrop-blur-sm border-amber-200 overflow-hidden">
      {/* Collapsible Header */}
      <Button
        variant="ghost"
        onClick={onToggle}
        disabled={disabled}
        className={cn(
          "w-full flex items-center justify-between p-4 h-auto",
          "hover:bg-amber-50/50 rounded-none",
          disabled && "opacity-50 cursor-not-allowed"
        )}
        aria-expanded={isOpen}
        aria-controls="personalization-content"
      >
        <div className="flex items-center gap-2">
          <span className="text-base">🪄</span>
          <span className="text-sm font-medium text-gray-700">
            Make it more personal
          </span>
          <span className="text-xs text-gray-400">(optional)</span>
        </div>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="w-4 h-4 text-gray-500" />
        </motion.div>
      </Button>

      {/* Collapsible Content */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="personalization-content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 space-y-4 border-t border-amber-100">
              {/* Scenario Selection */}
              <div className="pt-4">
                <Label
                  htmlFor="scenario-select"
                  className="text-sm font-medium text-gray-700 mb-2 block"
                >
                  Scenario
                </Label>
                <Select
                  value={personalization.scenario || "any"}
                  onValueChange={(value) =>
                    onPersonalizationChange({
                      scenario: value === "any" ? "" : (value as Scenario),
                    })
                  }
                  disabled={disabled}
                >
                  <SelectTrigger id="scenario-select" className="w-full">
                    <SelectValue placeholder="Any scenario" />
                  </SelectTrigger>
                  <SelectContent>
                    {SCENARIO_OPTIONS.map((option) => (
                      <SelectItem
                        key={option.value || "any"}
                        value={option.value || "any"}
                      >
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Tone Selection */}
              <div>
                <Label className="text-sm font-medium text-gray-700 mb-2 block">
                  Tone preference
                </Label>
                <div className="grid grid-cols-2 gap-2">
                  {TONE_OPTIONS.map((option) => {
                    const isSelected =
                      personalization.tone === option.value ||
                      (!personalization.tone && option.value === "");
                    return (
                      <button
                        key={option.value || "default"}
                        type="button"
                        onClick={() =>
                          onPersonalizationChange({ tone: option.value as Tone })
                        }
                        disabled={disabled}
                        className={cn(
                          "p-3 rounded-lg border-2 text-left transition-all duration-200",
                          "focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-1",
                          isSelected
                            ? "border-amber-500 bg-amber-50"
                            : "border-gray-200 hover:border-amber-300 hover:bg-amber-50/30",
                          disabled && "opacity-50 cursor-not-allowed"
                        )}
                        aria-pressed={isSelected}
                      >
                        <div className="text-sm font-medium text-gray-800">
                          {option.label}
                        </div>
                        <div className="text-xs text-gray-500 mt-0.5">
                          {option.description}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Language Selection */}
              <div>
                <Label
                  htmlFor="language-select"
                  className="text-sm font-medium text-gray-700 mb-2 block"
                >
                  Language
                </Label>
                <Select
                  value={personalization.language}
                  onValueChange={(value) =>
                    onPersonalizationChange({ language: value as Language })
                  }
                  disabled={disabled}
                >
                  <SelectTrigger id="language-select" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {LANGUAGE_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Custom Prompt */}
              <div>
                <Label
                  htmlFor="custom-prompt"
                  className="text-sm font-medium text-gray-700 mb-2 block"
                >
                  Custom request
                </Label>
                <Textarea
                  id="custom-prompt"
                  placeholder="Add a specific request or context (e.g., 'for my graduation ceremony')"
                  value={customPrompt}
                  onChange={(e) => onCustomPromptChange(e.target.value)}
                  disabled={disabled}
                  className="resize-none"
                  rows={2}
                  maxLength={500}
                />
                <p className="text-xs text-gray-400 mt-1 text-right">
                  {customPrompt.length}/500
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}
