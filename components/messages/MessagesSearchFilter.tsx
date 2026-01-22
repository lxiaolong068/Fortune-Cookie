"use client";

import { useState, useCallback, useMemo, useEffect } from "react";
import { Search, X, SlidersHorizontal, Sparkles } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  searchMessagesWithFilters,
  styleConfig,
  type FortuneMessage,
  type MoodType,
  type LengthType,
  type StyleFilterType,
} from "@/lib/fortune-database";
import { useTranslation } from "@/lib/locale-context";
import { CopyButton } from "./CopyButton";
import { GenerateSimilarButton } from "./GenerateSimilarButton";

interface MessagesSearchFilterProps {
  onFiltersActive: (active: boolean) => void;
  className?: string;
}

/**
 * MessagesSearchFilter - Search and filter component for fortune messages
 *
 * Features:
 * - Keyword search (debounced 300ms)
 * - Mood filter: All, Positive, Humor, Romance, Wisdom
 * - Length filter: All, Short, Medium, Long
 * - Clear filters button
 * - Shows filtered results with copy buttons
 */
export function MessagesSearchFilter({
  onFiltersActive,
  className = "",
}: MessagesSearchFilterProps) {
  const { t, locale } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [mood, setMood] = useState<MoodType>("all");
  const [length, setLength] = useState<LengthType>("all");
  const [style, setStyle] = useState<StyleFilterType>("all");
  const [showFilters, setShowFilters] = useState(false);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Check if any filters are active
  const hasActiveFilters = useMemo(() => {
    return (
      debouncedQuery.trim() !== "" ||
      mood !== "all" ||
      length !== "all" ||
      style !== "all"
    );
  }, [debouncedQuery, mood, length, style]);

  // Notify parent of filter state
  useEffect(() => {
    onFiltersActive(hasActiveFilters);
  }, [hasActiveFilters, onFiltersActive]);

  // Get filtered results
  const filteredResults = useMemo(() => {
    if (!hasActiveFilters) return [];

    return searchMessagesWithFilters({
      query: debouncedQuery,
      mood,
      length,
      style,
      sortBy: "popularity",
      limit: 50,
      locale,
    });
  }, [debouncedQuery, mood, length, style, hasActiveFilters, locale]);

  // Clear all filters
  const clearFilters = useCallback(() => {
    setSearchQuery("");
    setDebouncedQuery("");
    setMood("all");
    setLength("all");
    setStyle("all");
  }, []);

  // Toggle filters panel
  const toggleFilters = useCallback(() => {
    setShowFilters((prev) => !prev);
  }, []);

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#888888]" />
          <Input
            type="search"
            placeholder={t("messages.search.placeholder")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-10 border-[#FFD6C5] focus:border-[#FF6B3D] focus:ring-[#FF6B3D]"
            aria-label={t("messages.search.ariaLabel")}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-[#888888] hover:text-[#555555] focus:outline-none"
              aria-label={t("messages.search.clear")}
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Filter Toggle Button */}
        <Button
          variant="outline"
          onClick={toggleFilters}
          className={`gap-2 border-[#FFD6C5] ${showFilters ? "bg-[#FFE4D6] border-[#FF6B3D]" : ""}`}
          aria-expanded={showFilters}
          aria-controls="filter-panel"
        >
          <SlidersHorizontal className="h-4 w-4" />
          {t("messages.search.filtersButton")}
          {(mood !== "all" || length !== "all" || style !== "all") && (
            <Badge className="bg-[#FF6B3D] text-white text-xs px-1.5">
              {(mood !== "all" ? 1 : 0) +
                (length !== "all" ? 1 : 0) +
                (style !== "all" ? 1 : 0)}
            </Badge>
          )}
        </Button>
      </div>

      <div className="flex items-center gap-2 text-xs text-[#888888]">
        <Sparkles className="h-3.5 w-3.5 text-[#FF6B3D]" aria-hidden="true" />
        <p>{t("messages.tip.luckyNumbers")}</p>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div
          id="filter-panel"
          className="flex flex-wrap items-center gap-4 p-4 bg-[#F9F9F9] rounded-xl border border-[#FFE4D6] animate-in fade-in slide-in-from-top-2 duration-200"
        >
          {/* Mood Filter */}
          <div className="flex items-center gap-2">
            <label htmlFor="mood-filter" className="text-sm text-[#555555]">
              {t("messages.filters.moodLabel")}:
            </label>
            <Select value={mood} onValueChange={(v) => setMood(v as MoodType)}>
              <SelectTrigger
                id="mood-filter"
                className="w-32 border-[#FFD6C5] focus:ring-[#FF6B3D]"
              >
                <SelectValue placeholder={t("messages.filters.allMoods")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">
                  {t("messages.filters.allMoods")}
                </SelectItem>
                <SelectItem value="positive">
                  {t("messages.filters.moodOptions.positive")}
                </SelectItem>
                <SelectItem value="humor">
                  {t("messages.filters.moodOptions.humor")}
                </SelectItem>
                <SelectItem value="romance">
                  {t("messages.filters.moodOptions.romance")}
                </SelectItem>
                <SelectItem value="wisdom">
                  {t("messages.filters.moodOptions.wisdom")}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Length Filter */}
          <div className="flex items-center gap-2">
            <label htmlFor="length-filter" className="text-sm text-[#555555]">
              {t("messages.filters.lengthLabel")}:
            </label>
            <Select
              value={length}
              onValueChange={(v) => setLength(v as LengthType)}
            >
              <SelectTrigger
                id="length-filter"
                className="w-32 border-[#FFD6C5] focus:ring-[#FF6B3D]"
              >
                <SelectValue placeholder={t("messages.filters.allLengths")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">
                  {t("messages.filters.allLengths")}
                </SelectItem>
                <SelectItem value="short">{t("tags.length.short")}</SelectItem>
                <SelectItem value="medium">{t("tags.length.medium")}</SelectItem>
                <SelectItem value="long">{t("tags.length.long")}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Style Filter */}
          <div className="flex items-center gap-2">
            <label htmlFor="style-filter" className="text-sm text-[#555555]">
              {t("messages.filters.styleLabel")}:
            </label>
            <Select
              value={style}
              onValueChange={(v) => setStyle(v as StyleFilterType)}
            >
              <SelectTrigger
                id="style-filter"
                className="w-36 border-[#FFD6C5] focus:ring-[#FF6B3D]"
              >
                <SelectValue placeholder={t("messages.filters.allStyles")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">
                  {t("messages.filters.allStyles")}
                </SelectItem>
                {Object.entries(styleConfig).map(([key, config]) => (
                  <SelectItem key={key} value={key}>
                    {config.emoji} {t(`tags.style.${key}`)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Clear Filters */}
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="text-[#888888] hover:text-[#E55328] hover:bg-[#FFE4D6]"
            >
              <X className="h-4 w-4 mr-1" />
              {t("messages.filters.clearAll")}
            </Button>
          )}
        </div>
      )}

      {/* Filtered Results */}
      {hasActiveFilters && (
        <div className="space-y-4">
          {/* Results Header */}
          <div className="flex items-center justify-between">
            <p className="text-sm text-[#555555]">
              {filteredResults.length === 0 ? (
                t("messages.results.noResultsTitle")
              ) : (
                (() => {
                  const countText = String(filteredResults.length);
                  const resultText =
                    filteredResults.length === 1
                      ? t("messages.results.foundSingle", {
                          count: countText,
                        })
                      : t("messages.results.foundPlural", {
                          count: countText,
                        });
                  const index = resultText.indexOf(countText);
                  if (index === -1) {
                    return resultText;
                  }
                  return (
                    <>
                      {resultText.slice(0, index)}
                      <span className="font-semibold text-[#222222]">
                        {countText}
                      </span>
                      {resultText.slice(index + countText.length)}
                    </>
                  );
                })()
              )}
            </p>
            {filteredResults.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="text-[#FF6B3D] hover:text-[#E55328] hover:bg-[#FFE4D6]"
              >
                {t("messages.results.backToCategories")}
              </Button>
            )}
          </div>

          {/* Results Grid */}
          {filteredResults.length > 0 && (
            <ul
              role="list"
              className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 list-none p-0"
              aria-label={t("messages.results.filteredAria")}
            >
              {filteredResults.map((fortune: FortuneMessage) => (
                <li key={fortune.id}>
                  <Card className="group border border-[#FFE4D6] border-l-4 border-l-[#FFE4D6] bg-white p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg h-full">
                    <div className="flex items-start gap-3">
                      <Sparkles
                        className="mt-1 h-5 w-5 flex-shrink-0 text-[#FF6B3D] opacity-50 transition-opacity group-hover:opacity-100"
                        aria-hidden="true"
                      />
                      <div className="flex-1 min-w-0">
                        <blockquote className="text-[#222222] italic leading-relaxed mb-3">
                          &ldquo;{fortune.message}&rdquo;
                        </blockquote>
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2 flex-wrap">
                          <Badge
                            variant="secondary"
                            className="text-xs bg-[#F5F5F5] text-[#555555]"
                          >
                            {(() => {
                              const label = t(
                                `generator.themes.${fortune.category}`,
                              );
                              return label ===
                                `generator.themes.${fortune.category}`
                                ? fortune.category
                                : label;
                            })()}
                          </Badge>
                          {fortune.lengthType && (
                            <Badge
                              variant="secondary"
                              className="text-xs bg-[#F5F5F5] text-[#555555]"
                            >
                              {t(`tags.length.${fortune.lengthType}`)}
                            </Badge>
                          )}
                          {fortune.style && styleConfig[fortune.style] && (
                            <Badge
                              variant="outline"
                              className="text-xs border-[#E5E5E5] text-[#888888]"
                              title={t(
                                `tags.styleDescription.${fortune.style}`,
                              )}
                            >
                              {styleConfig[fortune.style].emoji}{" "}
                              {t(`tags.style.${fortune.style}`)}
                            </Badge>
                          )}
                            {fortune.luckyNumbers &&
                              fortune.luckyNumbers.length > 0 && (
                                <div className="flex items-center gap-1 text-xs text-[#888888]">
                                  {fortune.luckyNumbers
                                    .slice(0, 3)
                                    .map((num, i) => (
                                      <span
                                        key={i}
                                        className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#FFE4D6] text-[#E55328] font-medium"
                                      >
                                        {num}
                                      </span>
                                    ))}
                                </div>
                              )}
                          </div>
                          <div className="flex items-center gap-1 transition-opacity">
                            <GenerateSimilarButton
                              message={fortune.message}
                              category={fortune.category}
                              style={fortune.style}
                              tags={fortune.tags}
                            />
                            <CopyButton
                              message={fortune.message}
                              luckyNumbers={fortune.luckyNumbers}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                </li>
              ))}
            </ul>
          )}

          {/* No Results Message */}
          {filteredResults.length === 0 && (
            <div className="text-center py-12 px-4 bg-[#F9F9F9] rounded-xl border border-[#FFE4D6]">
              <Search className="h-12 w-12 mx-auto text-[#FFD6C5] mb-4" />
              <h3 className="text-lg font-semibold text-[#222222] mb-2">
                {t("messages.results.noResultsTitle")}
              </h3>
              <p className="text-[#555555] mb-4">
                {t("messages.results.noResultsDescription")}
              </p>
              <Button
                variant="outline"
                onClick={clearFilters}
                className="border-[#FFD6C5] text-[#FF6B3D] hover:bg-[#FFE4D6]"
              >
                {t("messages.results.clearFilters")}
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
