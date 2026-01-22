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
import { Sparkles, Search, Clock, Flame, SortAsc } from "lucide-react";
import { searchFortunes, getDatabaseStats } from "@/lib/fortune-database";
import {
  categoryConfig,
  categoryBadgeColors,
  type FortuneCategory,
} from "@/lib/category-config";
import { useLocale } from "@/lib/locale-context";

const ITEMS_PER_PAGE = 24;

export function BrowsePageContent() {
  const searchParams = useSearchParams();
  const searchParamsKey = searchParams.toString();
  const currentPage = parseInt(searchParams.get("page") || "1", 10);
  const { t, getLocalizedHref } = useLocale();

  const [searchQuery, setSearchQuery] = useState(
    searchParams.get("q") || "",
  );
  const [selectedCategory, setSelectedCategory] = useState<string>(
    searchParams.get("category") || "all",
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
    );

    // Sort results
    switch (sortBy) {
      case "popularity":
        results.sort((a, b) => b.popularity - a.popularity);
        break;
      case "recent":
        results.sort(
          (a, b) =>
            new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime(),
        );
        break;
      case "alphabetical":
        results.sort((a, b) => a.message.localeCompare(b.message));
        break;
    }

    return results;
  }, [searchQuery, selectedCategory, sortBy]);

  // Paginate results
  const totalPages = Math.ceil(
    filteredAndSortedFortunes.length / ITEMS_PER_PAGE,
  );
  const paginatedFortunes = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredAndSortedFortunes.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredAndSortedFortunes, currentPage]);

  // Build search params for pagination (preserve filters)
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

  return (
    <main className="min-h-screen w-full overflow-x-hidden relative">
      <DynamicBackgroundEffects />
      <div className="relative z-10">
        <div className="container mx-auto px-4 py-8">
          {/* Page Title */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-amber-600 via-yellow-600 to-orange-600 bg-clip-text text-transparent mb-4">
              {t("browse.title")}
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-6">
              {t("browse.subtitle")}
            </p>

            {/* Statistics */}
            <div className="flex flex-wrap justify-center gap-3 md:gap-4 mb-8">
              <Badge className="bg-blue-100 text-blue-800 py-1.5 px-3">
                {t("browse.stats.totalMessages", { count: stats.total })}
              </Badge>
              <Badge className="bg-green-100 text-green-800 py-1.5 px-3">
                {t("browse.stats.categories", {
                  count: Object.keys(stats.categories).length,
                })}
              </Badge>
              <Badge className="bg-purple-100 text-purple-800 py-1.5 px-3">
                {t("browse.stats.tags", { count: stats.tags })}
              </Badge>
            </div>

            {/* SEO Category Links - improved touch targets */}
            <div className="flex flex-wrap justify-center gap-3 md:gap-2 mb-8 max-w-3xl mx-auto">
              {Object.keys(stats.categories).map((category) => (
                <Link
                  key={category}
                  href={`${getLocalizedHref("/browse")}?category=${encodeURIComponent(
                    category,
                  )}`}
                >
                  <Badge
                    variant="outline"
                    className="hover:bg-amber-50 cursor-pointer transition-colors py-2 px-4 min-h-[40px] text-sm flex items-center"
                  >
                    {formatCategoryLabel(category)}
                  </Badge>
                </Link>
              ))}
            </div>
          </div>

          {/* Search and Filters */}
          <Card className="p-6 bg-white/90 backdrop-blur-sm border-amber-200 mb-8">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder={t("messages.search.placeholder")}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 min-h-[44px] focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  aria-label={t("messages.search.ariaLabel")}
                />
              </div>

              <Select
                value={selectedCategory}
                onValueChange={setSelectedCategory}
              >
                <SelectTrigger
                  aria-label={t("messages.filterByCategory")}
                  className="min-h-[44px]"
                >
                  <SelectValue placeholder={t("messages.allCategories")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">
                    {t("messages.allCategories")}
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

          {/* Filter Tabs and Results Count */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            {/* Quick Filter Tabs - 44px touch targets */}
            <div
              className="flex gap-2"
              role="tablist"
              aria-label={t("browse.sortLabel")}
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
                aria-label={t("common.popular")}
              >
                <Flame className="w-4 h-4 mr-1.5" aria-hidden="true" />
                {t("common.popular")}
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
                aria-label={t("common.newest")}
              >
                <Clock className="w-4 h-4 mr-1.5" aria-hidden="true" />
                {t("common.newest")}
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
                aria-label={t("common.alphabetical")}
              >
                <SortAsc className="w-4 h-4 mr-1.5" aria-hidden="true" />
                {t("common.alphabetical")}
              </Button>
            </div>

            {/* Results Count */}
            <p className="text-gray-600 text-sm">
              {resultsSummary}
            </p>
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
                  className="p-6 bg-white/90 backdrop-blur-sm border-amber-200 hover:shadow-lg transition-all duration-200 hover:scale-105"
                >
                  <div className="flex items-start justify-between mb-3">
                    <Link
                      href={`${getLocalizedHref("/browse")}?category=${encodeURIComponent(
                        fortune.category,
                      )}`}
                      className="hover:opacity-80 transition-opacity"
                    >
                      <Badge className={colorClass}>
                        {Icon && <Icon className="w-3 h-3 mr-1" />}
                        {formatCategoryLabel(fortune.category)}
                      </Badge>
                    </Link>
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
                        {t("generator.luckyNumbers")}:
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
                          {t("messages.tagsLabel")}:
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {fortune.tags.slice(0, 3).map((tag) => (
                            <Badge
                              key={tag}
                              variant="outline"
                              className="text-xs py-1 px-2"
                            >
                              {tag}
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
                {t("messages.results.noResultsTitle")}
              </h3>
              <p className="text-gray-500">
                {t("messages.results.noResultsDescription")}
              </p>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={filteredAndSortedFortunes.length}
              itemsPerPage={ITEMS_PER_PAGE}
              basePath={getLocalizedHref("/browse")}
              searchParams={paginationParams}
              showItemCount
              className="mt-8"
            />
          )}
        </div>
      </div>
    </main>
  );
}
