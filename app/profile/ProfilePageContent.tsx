"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import {
  User,
  Heart,
  Clock,
  Settings,
  Shield,
  Trash2,
  FileDown,
  FileText,
  LogIn,
  Loader2,
  Sparkles,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { PageLayout, PageSection } from "@/components/PageLayout";
import { PageHero, HeroBadge } from "@/components/PageHero";
import { ModernCard, ModernCardIcon } from "@/components/ui/modern-card";
import { ThemeToggle } from "@/components/ThemeToggle";
import { FavoritesEmptyState } from "@/components/FavoritesEmptyState";
import { useAuthSession, startGoogleSignIn } from "@/lib/auth-client";
import type { FavoriteItem } from "@/lib/favorites";
import type { HistoryItem } from "@/lib/generation-history";
import { exportFortunesToPDF } from "@/lib/pdf-export";
import { exportFortunesToTxt } from "@/lib/export-txt";

const MODE_LABELS: Record<string, string> = {
  oracle: "Oracle",
  event: "Event",
  rpg: "RPG",
};

function modeLabel(mode: string): string {
  if (MODE_LABELS[mode]) return MODE_LABELS[mode];
  if (mode.startsWith("persona:")) {
    return `Persona: ${mode.slice("persona:".length)}`;
  }
  return mode;
}

function SignInPrompt() {
  return (
    <div className="mx-auto max-w-md text-center">
      <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-900/40">
        <User className="h-8 w-8 text-indigo-500" />
      </div>
      <h2 className="mb-2 text-xl font-semibold text-slate-800 dark:text-white">
        Sign in to view your Profile
      </h2>
      <p className="mb-6 text-slate-600 dark:text-slate-300">
        Favorites, generation history, and exports are only available for
        signed-in accounts.
      </p>
      <Button onClick={() => startGoogleSignIn()} className="gap-2">
        <LogIn className="h-4 w-4" />
        Sign in with Google
      </Button>
    </div>
  );
}

export function ProfilePageContent() {
  const { status } = useAuthSession();
  const isAuthenticated = status === "authenticated";

  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isLoadingFavorites, setIsLoadingFavorites] = useState(true);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);
  const [isExporting, setIsExporting] = useState<"pdf" | "txt" | null>(null);

  const loadFavorites = useCallback(async () => {
    setIsLoadingFavorites(true);
    try {
      const res = await fetch("/api/favorites");
      if (res.ok) {
        const json = await res.json();
        setFavorites(json?.favorites ?? []);
      }
    } finally {
      setIsLoadingFavorites(false);
    }
  }, []);

  const loadHistory = useCallback(async () => {
    setIsLoadingHistory(true);
    try {
      const res = await fetch("/api/history");
      if (res.ok) {
        const json = await res.json();
        setHistory(json?.history ?? []);
      }
    } finally {
      setIsLoadingHistory(false);
    }
  }, []);

  // On sign-in: migrate any guest (localStorage) favorites into the account,
  // then load the authoritative server-side favorites + history.
  useEffect(() => {
    if (!isAuthenticated) return;
    let cancelled = false;

    (async () => {
      try {
        await fetch("/api/favorites", { method: "PUT" });
      } catch {
        // best-effort migration; ignore failures
      }
      if (cancelled) return;
      await Promise.all([loadFavorites(), loadHistory()]);
    })();

    return () => {
      cancelled = true;
    };
  }, [isAuthenticated, loadFavorites, loadHistory]);

  const removeFavorite = useCallback(
    async (id: string) => {
      const previous = favorites;
      setFavorites((prev) => prev.filter((f) => f.id !== id));
      const res = await fetch(`/api/favorites?id=${id}`, { method: "DELETE" });
      if (!res.ok) {
        setFavorites(previous);
        toast.error("Failed to remove favorite");
      }
    },
    [favorites],
  );

  const exportAll = useCallback(
    async (format: "pdf" | "txt") => {
      if (favorites.length === 0) return;
      setIsExporting(format);
      try {
        if (format === "pdf") {
          await exportFortunesToPDF(favorites, {
            title: "My Favorite Fortunes",
            includeLuckyNumbers: true,
            includeDate: true,
          });
        } else {
          exportFortunesToTxt(favorites);
        }
        toast.success(`Exported as ${format.toUpperCase()}`);
      } catch {
        toast.error("Export failed");
      } finally {
        setIsExporting(null);
      }
    },
    [favorites],
  );

  return (
    <PageLayout background="subtle" gradient="indigo" headerOffset={false}>
      <PageHero
        title="Profile"
        subtitle="Your Account"
        description="Your favorites, generation history, and preferences."
        icon={User}
        iconGradient={{ from: "from-indigo-500", to: "to-purple-500" }}
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Profile" }]}
        badge={<HeroBadge icon={Shield}>Signed-in only</HeroBadge>}
        size="md"
      />

      <PageSection padding="lg" bg="transparent">
        <div className="mx-auto max-w-4xl">
          {!isAuthenticated ? (
            status === "loading" ? (
              <div className="flex justify-center py-16">
                <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
              </div>
            ) : (
              <SignInPrompt />
            )
          ) : (
            <Tabs defaultValue="favorites" className="space-y-6">
              <TabsList className="mx-auto grid w-full grid-cols-3 rounded-xl border border-slate-200 bg-white/80 p-1 backdrop-blur-sm dark:border-slate-700 dark:bg-slate-800/80 lg:w-96">
                <TabsTrigger
                  value="favorites"
                  className="flex items-center gap-2 rounded-lg transition-all data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-500 data-[state=active]:to-purple-500 data-[state=active]:text-white"
                >
                  <Heart className="h-4 w-4" />
                  <span className="hidden sm:inline">Favorites</span>
                </TabsTrigger>
                <TabsTrigger
                  value="history"
                  className="flex items-center gap-2 rounded-lg transition-all data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-500 data-[state=active]:to-purple-500 data-[state=active]:text-white"
                >
                  <Clock className="h-4 w-4" />
                  <span className="hidden sm:inline">History</span>
                </TabsTrigger>
                <TabsTrigger
                  value="settings"
                  className="flex items-center gap-2 rounded-lg transition-all data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-500 data-[state=active]:to-purple-500 data-[state=active]:text-white"
                >
                  <Settings className="h-4 w-4" />
                  <span className="hidden sm:inline">Settings</span>
                </TabsTrigger>
              </TabsList>

              {/* Favorites */}
              <TabsContent value="favorites" className="space-y-4">
                {isLoadingFavorites ? (
                  <div className="flex justify-center py-12">
                    <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
                  </div>
                ) : favorites.length === 0 ? (
                  <FavoritesEmptyState isAuthenticated />
                ) : (
                  <>
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <p className="text-sm text-slate-500">
                        {favorites.length} favorite
                        {favorites.length === 1 ? "" : "s"}
                      </p>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => exportAll("txt")}
                          disabled={isExporting !== null}
                          className="rounded-lg"
                        >
                          {isExporting === "txt" ? (
                            <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
                          ) : (
                            <FileText className="mr-1.5 h-4 w-4" />
                          )}
                          Export TXT
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => exportAll("pdf")}
                          disabled={isExporting !== null}
                          className="rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:from-indigo-600 hover:to-purple-600"
                        >
                          {isExporting === "pdf" ? (
                            <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
                          ) : (
                            <FileDown className="mr-1.5 h-4 w-4" />
                          )}
                          Export PDF
                        </Button>
                      </div>
                    </div>

                    <ul className="m-0 list-none space-y-2 p-0">
                      {favorites.map((fav) => (
                        <li
                          key={fav.id}
                          className="group relative rounded-xl border border-indigo-100 bg-white/70 p-4 pr-12 dark:border-slate-700 dark:bg-slate-800/60"
                        >
                          <p className="font-serif text-slate-800 dark:text-slate-100">
                            {fav.message}
                          </p>
                          {fav.luckyNumbers && fav.luckyNumbers.length > 0 && (
                            <p className="mt-1.5 text-xs tracking-wider text-indigo-500 dark:text-indigo-300">
                              Lucky: {fav.luckyNumbers.join(" · ")}
                            </p>
                          )}
                          <button
                            type="button"
                            onClick={() => removeFavorite(fav.id)}
                            aria-label="Remove favorite"
                            className="absolute right-3 top-3 rounded-lg p-2 text-slate-400 opacity-0 transition-opacity hover:bg-red-50 hover:text-red-500 group-hover:opacity-100 dark:hover:bg-red-900/30"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </TabsContent>

              {/* History (read-only) */}
              <TabsContent value="history" className="space-y-4">
                {isLoadingHistory ? (
                  <div className="flex justify-center py-12">
                    <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
                  </div>
                ) : history.length === 0 ? (
                  <div className="flex flex-col items-center rounded-2xl border border-dashed border-slate-300 p-10 text-center text-slate-400 dark:border-slate-700">
                    <Sparkles className="mb-3 h-8 w-8" />
                    <p>
                      No generations yet. Visit the{" "}
                      <a href="/generator" className="underline">
                        Generator
                      </a>{" "}
                      to create some fortunes.
                    </p>
                  </div>
                ) : (
                  <>
                    <p className="text-sm text-slate-500">
                      Your {history.length} most recent generations.
                    </p>
                    <ul className="m-0 list-none space-y-2 p-0">
                      {history.map((item) => (
                        <li
                          key={item.id}
                          className="rounded-xl border border-slate-200 bg-white/70 p-4 dark:border-slate-700 dark:bg-slate-800/60"
                        >
                          <div className="mb-1 flex items-center justify-between gap-2">
                            <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-xs font-medium text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300">
                              {modeLabel(item.mode)}
                            </span>
                            <time className="text-xs text-slate-400">
                              {new Date(item.createdAt).toLocaleDateString()}
                            </time>
                          </div>
                          <p className="font-serif text-sm text-slate-800 dark:text-slate-100">
                            {item.message}
                          </p>
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </TabsContent>

              {/* Settings */}
              <TabsContent value="settings" className="space-y-6">
                <ModernCard variant="glass">
                  <div className="p-6">
                    <div className="mb-4 flex items-center gap-2">
                      <ModernCardIcon
                        gradientFrom="from-blue-500"
                        gradientTo="to-cyan-500"
                        size="sm"
                      >
                        <Settings className="h-4 w-4 text-white" />
                      </ModernCardIcon>
                      <div>
                        <h3 className="font-heading font-semibold text-slate-800 dark:text-white">
                          Appearance
                        </h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                          Theme preference
                        </p>
                      </div>
                    </div>
                    <ThemeToggle variant="dropdown" showLabel />
                  </div>
                </ModernCard>

                <ModernCard variant="glass">
                  <div className="p-6">
                    <div className="mb-4 flex items-center gap-2">
                      <ModernCardIcon
                        gradientFrom="from-indigo-500"
                        gradientTo="to-purple-500"
                        size="sm"
                      >
                        <Shield className="h-4 w-4 text-white" />
                      </ModernCardIcon>
                      <div>
                        <h3 className="font-heading font-semibold text-slate-800 dark:text-white">
                          Data
                        </h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                          Your favorites and history are stored on your
                          account and tied to your sign-in.
                        </p>
                      </div>
                    </div>
                  </div>
                </ModernCard>
              </TabsContent>
            </Tabs>
          )}
        </div>
      </PageSection>
    </PageLayout>
  );
}
