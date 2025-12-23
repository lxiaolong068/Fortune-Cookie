"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { RecentTab } from "./RecentTab";
import { FavoritesTab } from "./FavoritesTab";
import { TrendingTab } from "./TrendingTab";
import { type HistoryTab, type HistoryItem } from "@/lib/types/generator";
import { sessionManager, type FortuneHistory } from "@/lib/session-manager";

interface HistoryTabsContainerProps {
  activeTab: HistoryTab;
  onTabChange: (tab: HistoryTab) => void;
}

const tabs: { id: HistoryTab; label: string; icon: string }[] = [
  { id: "recent", label: "Recent", icon: "🕐" },
  { id: "favorites", label: "Favorites", icon: "❤️" },
  { id: "trending", label: "Trending", icon: "🔥" },
];

export function HistoryTabsContainer({
  activeTab,
  onTabChange,
}: HistoryTabsContainerProps) {
  const [recentHistory, setRecentHistory] = useState<HistoryItem[]>([]);

  // Load recent history from SessionManager
  const loadRecentHistory = useCallback(() => {
    try {
      const history = sessionManager.getHistory(10);
      const mappedHistory: HistoryItem[] = history.map(
        (item: FortuneHistory) => ({
          id: item.id,
          message: item.message,
          category: item.category,
          timestamp: item.timestamp,
          liked: item.liked,
          shared: item.shared,
          source: item.source === "database" ? "offline" : item.source,
        })
      );
      setRecentHistory(mappedHistory);
    } catch (error) {
      console.error("Failed to load recent history:", error);
    }
  }, []);

  useEffect(() => {
    loadRecentHistory();

    // Listen for storage events to sync across tabs
    const handleStorageChange = () => {
      loadRecentHistory();
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [loadRecentHistory]);

  // Refresh history when tab becomes active
  useEffect(() => {
    if (activeTab === "recent") {
      loadRecentHistory();
    }
  }, [activeTab, loadRecentHistory]);

  return (
    <Card className="bg-white/90 backdrop-blur-sm border-amber-200 overflow-hidden">
      {/* Tab Navigation */}
      <div className="flex border-b border-amber-100">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={cn(
              "flex-1 px-4 py-3 text-sm font-medium transition-all duration-200",
              "focus:outline-none focus:ring-2 focus:ring-inset focus:ring-amber-400",
              "flex items-center justify-center gap-2",
              activeTab === tab.id
                ? "text-amber-700 bg-amber-50 border-b-2 border-amber-500"
                : "text-gray-500 hover:text-amber-600 hover:bg-amber-50/50"
            )}
            role="tab"
            aria-selected={activeTab === tab.id}
            aria-controls={`${tab.id}-panel`}
          >
            <span>{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="p-4">
        <AnimatePresence mode="wait">
          {activeTab === "recent" && (
            <motion.div
              key="recent"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              id="recent-panel"
              role="tabpanel"
              aria-labelledby="recent-tab"
            >
              <RecentTab
                history={recentHistory}
                onHistoryUpdate={loadRecentHistory}
              />
            </motion.div>
          )}

          {activeTab === "favorites" && (
            <motion.div
              key="favorites"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              id="favorites-panel"
              role="tabpanel"
              aria-labelledby="favorites-tab"
            >
              <FavoritesTab />
            </motion.div>
          )}

          {activeTab === "trending" && (
            <motion.div
              key="trending"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              id="trending-panel"
              role="tabpanel"
              aria-labelledby="trending-tab"
            >
              <TrendingTab />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Card>
  );
}
