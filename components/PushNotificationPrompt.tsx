"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, BellOff, X, Check, Clock, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  usePushNotifications,
  type NotificationPreferences,
} from "@/lib/push-notifications";

// ============================================================================
// Types
// ============================================================================

interface PushNotificationPromptProps {
  className?: string;
  variant?: "banner" | "card" | "minimal";
  onDismiss?: () => void;
}

interface NotificationSettingsProps {
  className?: string;
  onClose?: () => void;
}

// ============================================================================
// Banner Prompt Component
// ============================================================================

function BannerPrompt({
  onSubscribe,
  onDismiss,
  loading,
}: {
  onSubscribe: () => void;
  onDismiss: () => void;
  loading: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg"
    >
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-full">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <p className="font-medium">Get Daily Fortune Reminders</p>
              <p className="text-sm text-white/80">
                Never miss your daily wisdom and lucky numbers!
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onSubscribe}
              disabled={loading}
              className="px-4 py-2 bg-white text-amber-600 font-medium rounded-lg hover:bg-amber-50 transition-colors disabled:opacity-50"
            >
              {loading ? "..." : "Enable"}
            </button>
            <button
              onClick={onDismiss}
              className="p-2 hover:bg-white/20 rounded-full transition-colors"
              aria-label="Dismiss"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ============================================================================
// Card Prompt Component
// ============================================================================

function CardPrompt({
  onSubscribe,
  onDismiss,
  loading,
}: {
  onSubscribe: () => void;
  onDismiss: () => void;
  loading: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="bg-card rounded-2xl border shadow-lg overflow-hidden max-w-sm"
    >
      {/* Header */}
      <div className="p-4 bg-gradient-to-r from-amber-500/10 to-orange-500/10 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
              <Bell className="w-5 h-5 text-white" />
            </div>
            <h3 className="font-semibold">Daily Reminders</h3>
          </div>
          <button
            onClick={onDismiss}
            className="p-1.5 hover:bg-muted rounded-full transition-colors"
            aria-label="Close"
          >
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-4">
        <p className="text-sm text-muted-foreground">
          Get notified every morning with your daily fortune, lucky numbers, and
          personalized advice to start your day right!
        </p>

        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <Check className="w-4 h-4 text-green-500" />
            <span>Daily fortune at 8:00 AM</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Check className="w-4 h-4 text-green-500" />
            <span>Lucky numbers & colors</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Check className="w-4 h-4 text-green-500" />
            <span>Special event reminders</span>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={onSubscribe}
            disabled={loading}
            className="flex-1 px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-medium rounded-lg hover:from-amber-600 hover:to-orange-600 transition-colors disabled:opacity-50"
          >
            {loading ? "Enabling..." : "Enable Notifications"}
          </button>
          <button
            onClick={onDismiss}
            className="px-4 py-2 text-muted-foreground hover:bg-muted rounded-lg transition-colors"
          >
            Later
          </button>
        </div>
      </div>
    </motion.div>
  );
}

// ============================================================================
// Minimal Prompt Component
// ============================================================================

function MinimalPrompt({
  onSubscribe,
  onDismiss,
  loading,
}: {
  onSubscribe: () => void;
  onDismiss: () => void;
  loading: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="flex items-center gap-3 p-3 bg-card rounded-xl border shadow-md"
    >
      <Bell className="w-5 h-5 text-amber-500" />
      <span className="text-sm">Get daily reminders?</span>
      <button
        onClick={onSubscribe}
        disabled={loading}
        className="px-3 py-1 text-sm bg-amber-500 text-white rounded-md hover:bg-amber-600 transition-colors disabled:opacity-50"
      >
        Yes
      </button>
      <button
        onClick={onDismiss}
        className="p-1 hover:bg-muted rounded-full transition-colors"
        aria-label="No"
      >
        <X className="w-4 h-4" />
      </button>
    </motion.div>
  );
}

// ============================================================================
// Main Prompt Component
// ============================================================================

export function PushNotificationPrompt({
  className,
  variant = "card",
  onDismiss,
}: PushNotificationPromptProps) {
  const [dismissed, setDismissed] = useState(false);
  const { supported, permission, subscribed, loading, subscribe, shouldShowPrompt } =
    usePushNotifications();

  // Don't show if not supported, already subscribed, or permission denied
  if (!supported || subscribed || permission === "denied" || !shouldShowPrompt) {
    return null;
  }

  // Don't show if dismissed
  if (dismissed) {
    return null;
  }

  const handleSubscribe = async () => {
    const success = await subscribe();
    if (success) {
      setDismissed(true);
      onDismiss?.();
    }
  };

  const handleDismiss = () => {
    setDismissed(true);
    onDismiss?.();
  };

  return (
    <AnimatePresence>
      <div className={className}>
        {variant === "banner" && (
          <BannerPrompt
            onSubscribe={handleSubscribe}
            onDismiss={handleDismiss}
            loading={loading}
          />
        )}
        {variant === "card" && (
          <CardPrompt
            onSubscribe={handleSubscribe}
            onDismiss={handleDismiss}
            loading={loading}
          />
        )}
        {variant === "minimal" && (
          <MinimalPrompt
            onSubscribe={handleSubscribe}
            onDismiss={handleDismiss}
            loading={loading}
          />
        )}
      </div>
    </AnimatePresence>
  );
}

// ============================================================================
// Notification Settings Component
// ============================================================================

export function NotificationSettings({
  className,
  onClose,
}: NotificationSettingsProps) {
  const {
    supported,
    permission,
    subscribed,
    loading,
    subscribe,
    unsubscribe,
    preferences,
    updatePreferences,
  } = usePushNotifications();

  const [localPrefs, setLocalPrefs] = useState<NotificationPreferences>(preferences);

  useEffect(() => {
    setLocalPrefs(preferences);
  }, [preferences]);

  const handleToggleSubscription = async () => {
    if (subscribed) {
      await unsubscribe();
    } else {
      await subscribe();
    }
  };

  const handlePreferenceChange = async (
    key: keyof NotificationPreferences,
    value: boolean | string
  ) => {
    const updated = { ...localPrefs, [key]: value };
    setLocalPrefs(updated);
    await updatePreferences({ [key]: value });
  };

  if (!supported) {
    return (
      <div className={cn("p-4 bg-muted rounded-xl", className)}>
        <div className="flex items-center gap-3 text-muted-foreground">
          <BellOff className="w-5 h-5" />
          <p className="text-sm">
            Push notifications are not supported in your browser.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("bg-card rounded-2xl border shadow-sm overflow-hidden", className)}>
      {/* Header */}
      <div className="p-4 border-b bg-gradient-to-r from-amber-500/10 to-orange-500/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
              <Bell className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold">Notification Settings</h3>
              <p className="text-sm text-muted-foreground">
                Manage your notification preferences
              </p>
            </div>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="p-2 hover:bg-muted rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-6">
        {/* Main Toggle */}
        <div className="flex items-center justify-between p-4 bg-muted/50 rounded-xl">
          <div className="flex items-center gap-3">
            {subscribed ? (
              <Bell className="w-5 h-5 text-amber-500" />
            ) : (
              <BellOff className="w-5 h-5 text-muted-foreground" />
            )}
            <div>
              <p className="font-medium">Push Notifications</p>
              <p className="text-sm text-muted-foreground">
                {subscribed ? "Enabled" : "Disabled"}
              </p>
            </div>
          </div>
          <button
            onClick={handleToggleSubscription}
            disabled={loading || permission === "denied"}
            className={cn(
              "relative w-12 h-6 rounded-full transition-colors",
              subscribed ? "bg-amber-500" : "bg-muted-foreground/30",
              loading && "opacity-50 cursor-not-allowed"
            )}
          >
            <span
              className={cn(
                "absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform",
                subscribed ? "translate-x-6" : "translate-x-0.5"
              )}
            />
          </button>
        </div>

        {permission === "denied" && (
          <div className="p-3 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-sm text-red-600 dark:text-red-400">
              Notifications are blocked. Please enable them in your browser settings.
            </p>
          </div>
        )}

        {/* Preference Options */}
        {subscribed && (
          <div className="space-y-4">
            <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
              Notification Types
            </h4>

            {/* Daily Fortune */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <div>
                  <p className="text-sm font-medium">Daily Fortune</p>
                  <p className="text-xs text-muted-foreground">
                    Get your fortune every morning
                  </p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={localPrefs.dailyFortune}
                onChange={(e) =>
                  handlePreferenceChange("dailyFortune", e.target.checked)
                }
                className="w-4 h-4 rounded border-gray-300 text-amber-500 focus:ring-amber-500"
              />
            </div>

            {/* Time Picker */}
            {localPrefs.dailyFortune && (
              <div className="flex items-center justify-between pl-7">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">Delivery Time</span>
                </div>
                <select
                  value={localPrefs.dailyFortuneTime}
                  onChange={(e) =>
                    handlePreferenceChange("dailyFortuneTime", e.target.value)
                  }
                  className="px-3 py-1.5 text-sm bg-muted rounded-lg border-0 focus:ring-2 focus:ring-amber-500"
                >
                  <option value="06:00">6:00 AM</option>
                  <option value="07:00">7:00 AM</option>
                  <option value="08:00">8:00 AM</option>
                  <option value="09:00">9:00 AM</option>
                  <option value="10:00">10:00 AM</option>
                  <option value="12:00">12:00 PM</option>
                  <option value="18:00">6:00 PM</option>
                  <option value="20:00">8:00 PM</option>
                </select>
              </div>
            )}

            {/* Special Events */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Bell className="w-4 h-4 text-blue-500" />
                <div>
                  <p className="text-sm font-medium">Special Events</p>
                  <p className="text-xs text-muted-foreground">
                    Lucky days and special occasions
                  </p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={localPrefs.specialEvents}
                onChange={(e) =>
                  handlePreferenceChange("specialEvents", e.target.checked)
                }
                className="w-4 h-4 rounded border-gray-300 text-amber-500 focus:ring-amber-500"
              />
            </div>

            {/* New Features */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Sparkles className="w-4 h-4 text-purple-500" />
                <div>
                  <p className="text-sm font-medium">New Features</p>
                  <p className="text-xs text-muted-foreground">
                    Updates and new features
                  </p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={localPrefs.newFeatures}
                onChange={(e) =>
                  handlePreferenceChange("newFeatures", e.target.checked)
                }
                className="w-4 h-4 rounded border-gray-300 text-amber-500 focus:ring-amber-500"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================================================
// Floating Action Button for Notifications
// ============================================================================

export function NotificationFAB({ className }: { className?: string }) {
  const [showSettings, setShowSettings] = useState(false);
  const { supported, subscribed, shouldShowPrompt, subscribe, loading } =
    usePushNotifications();

  if (!supported) return null;

  // If should show prompt, show subscribe button
  if (shouldShowPrompt && !subscribed) {
    return (
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => subscribe()}
        disabled={loading}
        className={cn(
          "fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 text-white shadow-lg hover:shadow-xl transition-shadow flex items-center justify-center",
          className
        )}
        aria-label="Enable notifications"
      >
        <Bell className="w-6 h-6" />
      </motion.button>
    );
  }

  // Otherwise show settings button
  return (
    <>
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setShowSettings(true)}
        className={cn(
          "fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full bg-card border shadow-lg hover:shadow-xl transition-shadow flex items-center justify-center",
          subscribed && "ring-2 ring-amber-500 ring-offset-2",
          className
        )}
        aria-label="Notification settings"
      >
        {subscribed ? (
          <Bell className="w-6 h-6 text-amber-500" />
        ) : (
          <BellOff className="w-6 h-6 text-muted-foreground" />
        )}
      </motion.button>

      {/* Settings Modal */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
            onClick={() => setShowSettings(false)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md"
            >
              <NotificationSettings onClose={() => setShowSettings(false)} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default PushNotificationPrompt;
