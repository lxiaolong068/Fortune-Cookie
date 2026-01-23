"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { DynamicBackgroundEffects } from "@/components/DynamicBackgroundEffects";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Pagination } from "@/components/Pagination";
import {
  Sparkles,
  Search,
  Clock,
  Flame,
  SortAsc,
  Star,
  TrendingUp,
  Copy,
  Check,
  ArrowRight,
} from "lucide-react";
import {
  searchFortunes,
  getDatabaseStats,
  localizeFortunes,
} from "@/lib/fortune-database";
import {
  categoryConfig,
  categoryBadgeColors,
  type FortuneCategory,
} from "@/lib/category-config";
import { useLocale } from "@/lib/locale-context";

const ITEMS_PER_PAGE = 24;

export function ExplorePageContent() {
  const searchParams = useSearchParams();
  const searchParamsKey = searchParams.toString();
  const currentPage = parseInt(searchParams.get("page") || "1", 10);
  const { t, getLocalizedHref, locale } = useLocale();

  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const [selectedCategory, setSelectedCategory] = useState<string>(
    searchParams.get("category") || "all"
  );
  const [sortBy, setSortBy] = useState<
    "popularity" | "recent" | "alphabetical"
  >(() => {
    const sortParam = searchParams.get("sort");
    if (sortParam === "recent" || sortParam === "alphabetical") {
      return sortParam;
    }
    return "popularity";
  });
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const formatCategoryLabel = useCallback(
    (category: string) => {
      const key = `generator.themes.${category}`;
      const translated = t(key);
      if (translated !== key) {
        return translated;
      }
      return category.charAt(0).toUpperCase() + category.slice(1);
    },
    [t]
  );

  const formatTagLabel = useCallback(
    (tag: string) => {
      const lengthKey = `tags.length.${tag}`;
      const lengthTranslated = t(lengthKey);
      if (lengthTranslated !== lengthKey) return lengthTranslated;

      const styleKey = `tags.style.${tag}`;
      const styleTranslated = t(styleKey);
      if (styleTranslated !== styleKey) return styleTranslated;

      const themeKey = `generator.themes.${tag}`;
      const themeTranslated = t(themeKey);
      if (themeTranslated !== themeKey) return themeTranslated;

      return tag.charAt(0).toUpperCase() + tag.slice(1);
    },
    [t]
  );

  useEffect(() => {
    const nextQuery = searchParams.get("q") || "";
    const nextCategory = searchParams.get("category") || "all";
    const sortParam = searchParams.get("sort");
    const nextSort =
      sortParam === "recent" || sortParam === "alphabetical"
        ? sortParam
        : "popularity";

    if (nextQuery !== searchQuery) {
      setSearchQuery(nextQuery);
    }

    if (nextCategory !== selectedCategory) {
      setSelectedCategory(nextCategory);
    }

    if (nextSort !== sortBy) {
      setSortBy(nextSort);
    }
  }, [searchParamsKey, searchQuery, selectedCategory, sortBy, searchParams]);

  const stats = getDatabaseStats();

  const filteredAndSortedFortunes = useMemo(() => {
    const results = searchFortunes(
      searchQuery,
      selectedCategory === "all" ? undefined : selectedCategory,
      locale
    );
    const localizedResults = localizeFortunes(results, locale);

    switch (sortBy) {
      case "popularity":
        localizedResults.sort((a, b) => b.popularity - a.popularity);
        break;
      case "recent":
        localizedResults.sort(
          (a, b) =>
            new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime()
        );
        break;
      case "alphabetical":
        localizedResults.sort((a, b) => a.message.localeCompare(b.message));
        break;
    }

    return localizedResults;
  }, [searchQuery, selectedCategory, sortBy, locale]);

  const totalPages = Math.ceil(
    filteredAndSortedFortunes.length / ITEMS_PER_PAGE
  );
  const paginatedFortunes = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredAndSortedFortunes.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredAndSortedFortunes, currentPage]);

  const paginationParams: Record<string, string> = {};
  if (searchQuery) paginationParams.q = searchQuery;
  if (selectedCategory !== "all") paginationParams.category = selectedCategory;
  if (sortBy !== "popularity") paginationParams.sort = sortBy;

  const resultsSummary = useMemo(() => {
    const totalCount = filteredAndSortedFortunes.length;
    const pageCount = paginatedFortunes.length;
    const categoryLabel =
      selectedCategory === "all" ? "" : formatCategoryLabel(selectedCategory);

    if (searchQuery && categoryLabel) {
      return t("messages.results.summaryWithQueryAndCategory", {
        pageCount,
        totalCount,
        query: searchQuery,
        category: categoryLabel,
      });
    }

    if (searchQuery) {
      return t("messages.results.summaryWithQuery", {
        pageCount,
        totalCount,
        query: searchQuery,
      });
    }

    if (categoryLabel) {
      return t("messages.results.summaryWithCategory", {
        pageCount,
        totalCount,
        category: categoryLabel,
      });
    }

    return t("messages.results.summary", {
      pageCount,
      totalCount,
    });
  }, [
    filteredAndSortedFortunes.length,
    paginatedFortunes.length,
    searchQuery,
    selectedCategory,
    formatCategoryLabel,
    t,
  ]);

  const handleCopy = useCallback(
    async (fortune: { id: string; message: string; luckyNumbers: number[] }) => {
      const textToCopy = `"${fortune.message}"\n\nLucky Numbers: ${fortune.luckyNumbers.join(", ")}`;
      try {
        await navigator.clipboard.writeText(textToCopy);
        setCopiedId(fortune.id);
        setTimeout(() => setCopiedId(null), 2000);
      } catch (err) {
        console.error("Failed to copy:", err);
      }
    },
    []
  );

  const handleResetFilters = useCallback(() => {
    setSearchQuery("");
    setSelectedCategory("all");
    setSortBy("popularity");
  }, []);

  return (
    <main className="min-h-screen w-full overflow-x-hidden relative bg-[#FAFAFA]">
      <DynamicBackgroundEffects />
      <div className="relative z-10">
        <div className="container mx-auto px-4 py-8">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#222222] mb-4">
              {t("explore.title") !== "explore.title"
                ? t("explore.title")
                : "Explore Fortune Messages"}
            </h1>
            <p className="text-lg md:text-xl text-[#555555] max-w-3xl mx-auto mb-8">
              {t("explore.subtitle") !== "explore.subtitle"
                ? t("explore.subtitle")
                : "Discover hundreds of fortune cookie messages. Search, filter by category, and find the perfect fortune for any occasion."}
            </p>

            {/* Statistics */}
            <div className="flex flex-wrap justify-center gap-3 mb-8">
              <Badge className="px-4 py-2 border border-[#FFD6C5] bg-[#FFE4D6] text-[#E55328]">
                <Sparkles className="mr-2 h-4 w-4" />
                {stats.total}+ {t("explore.stats.messages") !== "explore.stats.messages" ? t("explore.stats.messages") : "Messages"}
              </Badge>
              <Badge className="px-4 py-2 border border-[#FFD6C5] bg-[#FFE4D6] text-[#E55328]">
                <Star className="mr-2 h-4 w-4" />
                {Object.keys(stats.categories).length} {t("explore.stats.categories") !== "explore.stats.categories" ? t("explore.stats.categories") : "Categories"}
              </Badge>
              <Badge className="px-4 py-2 border border-[#FFD6C5] bg-[#FFE4D6] text-[#E55328]">
                <TrendingUp className="mr-2 h-4 w-4" />
                {t("explore.stats.aiAvailable") !== "explore.stats.aiAvailable" ? t("explore.stats.aiAvailable") : "AI Generator Available"}
              </Badge>
            </div>

            {/* Quick Category Links */}
            <div className="flex flex-wrap justify-center gap-3 max-w-4xl mx-auto">
              {Object.keys(stats.categories).map((category) => {
                const config = categoryConfig[category as FortuneCategory];
                const Icon = config?.icon;
                const isSelected = selectedCategory === category;
                return (
                  <button
                    key={category}
                    onClick={() =>
                      setSelectedCategory(isSelected ? "all" : category)
                    }
                    className={`inline-flex items-center gap-2 rounded-full px-4 py-2 transition-all duration-200 ${
                      isSelected
                        ? "bg-[#E55328] text-white shadow-md"
                        : "border border-[#FFD6C5] bg-[#FFE4D6] text-[#E55328] hover:bg-[#FFD6C5]"
                    }`}
                  >
                    {Icon && <Icon className="h-4 w-4" />}
                    <span className="text-sm font-medium">
                      {formatCategoryLabel(category)}
                    </span>
                    <span className="text-xs opacity-75">
                      ({stats.categories[category]})
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Search and Filters */}
          <Card className="p-6 bg-white/90 backdrop-blur-sm border-amber-200 mb-8">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder={
                    t("messages.search.placeholder") !== "messages.search.placeholder"
                      ? t("messages.search.placeholder")
                      : "Search fortune messages..."
                  }
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 min-h-[44px] focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  aria-label={
                    t("messages.search.ariaLabel") !== "messages.search.ariaLabel"
                      ? t("messages.search.ariaLabel")
                      : "Search fortune messages"
                  }
                />
              </div>

              <Select
                value={selectedCategory}
                onValueChange={setSelectedCategory}
              >
                <SelectTrigger
                  aria-label={
                    t("messages.filterByCategory") !== "messages.filterByCategory"
                      ? t("messages.filterByCategory")
                      : "Filter by category"
                  }
                  className="min-h-[44px]"
                >
                  <SelectValue
                    placeholder={
                      t("messages.allCategories") !== "messages.allCategories"
                        ? t("messages.allCategories")
                        : "All Categories"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">
                    {t("messages.allCategories") !== "messages.allCategories"
                      ? t("messages.allCategories")
                      : "All Categories"}
                  </SelectItem>
                  {Object.entries(stats.categories).map(([category, count]) => {
                    const config = categoryConfig[category as FortuneCategory];
                    const Icon = config?.icon;
                    return (
                      <SelectItem key={category} value={category}>
                        <div className="flex items-center gap-2">
                          {Icon && <Icon className="w-4 h-4" />}
                          <span>{formatCategoryLabel(category)}</span>
                          <span className="text-gray-500">({count})</span>
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>
          </Card>

          {/* Sort Tabs and Results Count */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div
              className="flex gap-2"
              role="tablist"
              aria-label={
                t("browse.sortLabel") !== "browse.sortLabel"
                  ? t("browse.sortLabel")
                  : "Sort options"
              }
            >
              <Button
                variant={sortBy === "popularity" ? "default" : "outline"}
                onClick={() => setSortBy("popularity")}
                className={`min-h-[44px] px-4 ${
                  sortBy === "popularity"
                    ? "bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
                    : ""
                }`}
                role="tab"
                aria-selected={sortBy === "popularity"}
              >
                <Flame className="w-4 h-4 mr-1.5" aria-hidden="true" />
                {t("common.popular") !== "common.popular" ? t("common.popular") : "Popular"}
              </Button>
              <Button
                variant={sortBy === "recent" ? "default" : "outline"}
                onClick={() => setSortBy("recent")}
                className={`min-h-[44px] px-4 ${
                  sortBy === "recent"
                    ? "bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
                    : ""
                }`}
                role="tab"
                aria-selected={sortBy === "recent"}
              >
                <Clock className="w-4 h-4 mr-1.5" aria-hidden="true" />
                {t("common.newest") !== "common.newest" ? t("common.newest") : "Newest"}
              </Button>
              <Button
                variant={sortBy === "alphabetical" ? "default" : "outline"}
                onClick={() => setSortBy("alphabetical")}
                className={`min-h-[44px] px-4 ${
                  sortBy === "alphabetical"
                    ? "bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
                    : ""
                }`}
                role="tab"
                aria-selected={sortBy === "alphabetical"}
              >
                <SortAsc className="w-4 h-4 mr-1.5" aria-hidden="true" />
                {t("common.alphabetical") !== "common.alphabetical" ? t("common.alphabetical") : "A-Z"}
              </Button>
            </div>

            <p className="text-gray-600 text-sm">{resultsSummary}</p>
          </div>

          {/* Fortune List */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {paginatedFortunes.map((fortune) => {
              const config =
                categoryConfig[fortune.category as FortuneCategory];
              const Icon = config?.icon;
              const colorClass =
                categoryBadgeColors[fortune.category] ||
                "bg-gray-100 text-gray-800";

              return (
                <Card
                  key={fortune.id}
                  className="p-6 bg-white/90 backdrop-blur-sm border-amber-200 hover:shadow-lg transition-all duration-200 hover:scale-[1.02]"
                >
                  <div className="flex items-start justify-between mb-3">
                    <button
                      onClick={() => setSelectedCategory(fortune.category)}
                      className="hover:opacity-80 transition-opacity"
                    >
                      <Badge className={colorClass}>
                        {Icon && <Icon className="w-3 h-3 mr-1" />}
                        {formatCategoryLabel(fortune.category)}
                      </Badge>
                    </button>
                    <div className="flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-amber-500" />
                      <span className="text-xs text-gray-500">
                        {fortune.popularity}/10
                      </span>
                    </div>
                  </div>

                  <blockquote className="text-gray-700 italic leading-relaxed mb-4">
                    &ldquo;{fortune.message}&rdquo;
                  </blockquote>

                  <div className="space-y-3">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">
                        {t("generator.luckyNumbers") !== "generator.luckyNumbers"
                          ? t("generator.luckyNumbers")
                          : "Lucky Numbers"}
                        :
                      </p>
                      <div className="flex gap-1">
                        {fortune.luckyNumbers.map((number) => (
                          <span
                            key={number}
                            className="w-6 h-6 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center text-white text-xs font-medium"
                          >
                            {number}
                          </span>
                        ))}
                      </div>
                    </div>

                    {fortune.tags.length > 0 && (
                      <div>
                        <p className="text-xs text-gray-500 mb-1">
                          {t("messages.tagsLabel") !== "messages.tagsLabel"
                            ? t("messages.tagsLabel")
                            : "Tags"}
                          :
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {fortune.tags.slice(0, 3).map((tag) => (
                            <Badge
                              key={tag}
                              variant="outline"
                              className="text-xs py-1 px-2"
                            >
                              {formatTagLabel(tag)}
                            </Badge>
                          ))}
                          {fortune.tags.length > 3 && (
                            <Badge
                              variant="outline"
                              className="text-xs py-1 px-2"
                            >
                              +{fortune.tags.length - 3}
                            </Badge>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Copy Button */}
                    <div className="pt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleCopy(fortune)}
                        className="w-full min-h-[40px] text-sm"
                      >
                        {copiedId === fortune.id ? (
                          <>
                            <Check className="w-4 h-4 mr-2 text-green-500" />
                            {t("common.copied") !== "common.copied" ? t("common.copied") : "Copied!"}
                          </>
                        ) : (
                          <>
                            <Copy className="w-4 h-4 mr-2" />
                            {t("common.copy") !== "common.copy" ? t("common.copy") : "Copy"}
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>

          {/* Empty State */}
          {paginatedFortunes.length === 0 && (
            <div className="text-center py-12">
              <Sparkles className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-600 mb-2">
                {t("messages.results.noResultsTitle") !== "messages.results.noResultsTitle"
                  ? t("messages.results.noResultsTitle")
                  : "No fortunes found"}
              </h3>
              <p className="text-gray-500 mb-4">
                {t("messages.results.noResultsDescription") !== "messages.results.noResultsDescription"
                  ? t("messages.results.noResultsDescription")
                  : "Try adjusting your search or filters"}
              </p>
              <Button
                variant="outline"
                onClick={handleResetFilters}
                className="min-h-[44px]"
              >
                {t("common.resetFilters") !== "common.resetFilters"
                  ? t("common.resetFilters")
                  : "Reset Filters"}
              </Button>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={filteredAndSortedFortunes.length}
              itemsPerPage={ITEMS_PER_PAGE}
              basePath={getLocalizedHref("/explore")}
              searchParams={paginationParams}
              showItemCount
              className="mt-8"
            />
          )}

          {/* CTA Section */}
          <Card className="mt-12 border border-[#FFD6C5] bg-gradient-to-r from-[#FFE4D6] to-[#FFF5F0]">
            <div className="p-8 text-center">
              <Sparkles className="mx-auto mb-4 h-12 w-12 text-[#E55328] opacity-90" />
              <h2 className="text-2xl md:text-3xl font-bold mb-4 text-[#222222]">
                {t("explore.cta.title") !== "explore.cta.title"
                  ? t("explore.cta.title")
                  : "Want a Personalized Fortune?"}
              </h2>
              <p className="text-[#555555] mb-6 max-w-xl mx-auto">
                {t("explore.cta.description") !== "explore.cta.description"
                  ? t("explore.cta.description")
                  : "Our AI can generate unique fortunes tailored to your preferences, mood, and occasion."}
              </p>
              <Button
                asChild
                size="lg"
                className="bg-[#FF6B3D] text-white hover:bg-[#E55328] min-h-[48px]"
              >
                <Link href={getLocalizedHref("/generator")}>
                  {t("explore.cta.button") !== "explore.cta.button"
                    ? t("explore.cta.button")
                    : "Generate AI Fortune"}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </main>
  );
}
