/**
 * Push Notification Manager
 *
 * Handles Web Push API integration for daily fortune reminders.
 * Supports subscription management and notification scheduling.
 */

// ============================================================================
// Types
// ============================================================================

export interface PushSubscriptionData {
  endpoint: string;
  expirationTime: number | null;
  keys: {
    p256dh: string;
    auth: string;
  };
}

export interface NotificationPermissionState {
  permission: NotificationPermission;
  supported: boolean;
  subscribed: boolean;
}

export interface NotificationPreferences {
  dailyFortune: boolean;
  dailyFortuneTime: string; // HH:mm format in user's local time
  specialEvents: boolean;
  newFeatures: boolean;
}

const DEFAULT_PREFERENCES: NotificationPreferences = {
  dailyFortune: true,
  dailyFortuneTime: "08:00",
  specialEvents: true,
  newFeatures: false,
};

// ============================================================================
// Constants
// ============================================================================

const STORAGE_KEYS = {
  SUBSCRIPTION: "fortune-push-subscription",
  PREFERENCES: "fortune-notification-preferences",
  LAST_PROMPT: "fortune-notification-last-prompt",
} as const;

// Minimum time between permission prompts (7 days)
const MIN_PROMPT_INTERVAL = 7 * 24 * 60 * 60 * 1000;

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Convert a base64 string to Uint8Array for VAPID key
 */
function urlBase64ToUint8Array(base64String: string): Uint8Array<ArrayBuffer> {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");

  const rawData = window.atob(base64);
  const buffer = new ArrayBuffer(rawData.length);
  const outputArray = new Uint8Array(buffer);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }

  return outputArray;
}

/**
 * Check if push notifications are supported
 */
export function isPushSupported(): boolean {
  return (
    typeof window !== "undefined" &&
    "serviceWorker" in navigator &&
    "PushManager" in window &&
    "Notification" in window
  );
}

/**
 * Get current notification permission state
 */
export function getPermissionState(): NotificationPermissionState {
  if (!isPushSupported()) {
    return {
      permission: "denied",
      supported: false,
      subscribed: false,
    };
  }

  const subscription = localStorage.getItem(STORAGE_KEYS.SUBSCRIPTION);

  return {
    permission: Notification.permission,
    supported: true,
    subscribed: !!subscription,
  };
}

// ============================================================================
// Push Notification Manager Class
// ============================================================================

export class PushNotificationManager {
  private vapidPublicKey: string | null = null;
  private registration: ServiceWorkerRegistration | null = null;
  private subscription: PushSubscription | null = null;

  constructor() {
    // VAPID public key should be set via environment variable
    this.vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || null;
  }

  /**
   * Initialize the push notification manager
   */
  async initialize(): Promise<boolean> {
    if (!isPushSupported()) {
      console.warn("Push notifications not supported");
      return false;
    }

    try {
      // Get service worker registration
      this.registration = await navigator.serviceWorker.ready;

      // Check for existing subscription
      this.subscription = await this.registration.pushManager.getSubscription();

      if (this.subscription) {
        // Store subscription in localStorage for quick access
        localStorage.setItem(
          STORAGE_KEYS.SUBSCRIPTION,
          JSON.stringify(this.subscription.toJSON()),
        );
      }

      return true;
    } catch (error) {
      console.error("Failed to initialize push notifications:", error);
      return false;
    }
  }

  /**
   * Request notification permission
   */
  async requestPermission(): Promise<NotificationPermission> {
    if (!isPushSupported()) {
      return "denied";
    }

    try {
      const permission = await Notification.requestPermission();

      // Record when we last prompted
      localStorage.setItem(STORAGE_KEYS.LAST_PROMPT, Date.now().toString());

      return permission;
    } catch (error) {
      console.error("Failed to request notification permission:", error);
      return "denied";
    }
  }

  /**
   * Subscribe to push notifications
   */
  async subscribe(): Promise<PushSubscription | null> {
    if (!this.registration || !this.vapidPublicKey) {
      console.error("Push manager not initialized or VAPID key missing");
      return null;
    }

    if (Notification.permission !== "granted") {
      const permission = await this.requestPermission();
      if (permission !== "granted") {
        return null;
      }
    }

    try {
      // Subscribe to push notifications
      this.subscription = await this.registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(this.vapidPublicKey),
      });

      // Store subscription locally
      localStorage.setItem(
        STORAGE_KEYS.SUBSCRIPTION,
        JSON.stringify(this.subscription.toJSON()),
      );

      // Send subscription to server
      await this.sendSubscriptionToServer(this.subscription);

      return this.subscription;
    } catch (error) {
      console.error("Failed to subscribe to push notifications:", error);
      return null;
    }
  }

  /**
   * Unsubscribe from push notifications
   */
  async unsubscribe(): Promise<boolean> {
    if (!this.subscription) {
      return true;
    }

    try {
      // Unsubscribe from push
      await this.subscription.unsubscribe();

      // Remove from server
      await this.removeSubscriptionFromServer(this.subscription);

      // Clear local storage
      localStorage.removeItem(STORAGE_KEYS.SUBSCRIPTION);
      this.subscription = null;

      return true;
    } catch (error) {
      console.error("Failed to unsubscribe from push notifications:", error);
      return false;
    }
  }

  /**
   * Send subscription to server
   */
  private async sendSubscriptionToServer(
    subscription: PushSubscription,
  ): Promise<void> {
    try {
      await fetch("/api/push/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          subscription: subscription.toJSON(),
          preferences: this.getPreferences(),
        }),
      });
    } catch (error) {
      console.error("Failed to send subscription to server:", error);
    }
  }

  /**
   * Remove subscription from server
   */
  private async removeSubscriptionFromServer(
    subscription: PushSubscription,
  ): Promise<void> {
    try {
      await fetch("/api/push/unsubscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          endpoint: subscription.endpoint,
        }),
      });
    } catch (error) {
      console.error("Failed to remove subscription from server:", error);
    }
  }

  /**
   * Get notification preferences
   */
  getPreferences(): NotificationPreferences {
    const stored = localStorage.getItem(STORAGE_KEYS.PREFERENCES);
    if (stored) {
      try {
        return { ...DEFAULT_PREFERENCES, ...JSON.parse(stored) };
      } catch {
        return DEFAULT_PREFERENCES;
      }
    }
    return DEFAULT_PREFERENCES;
  }

  /**
   * Update notification preferences
   */
  async updatePreferences(
    preferences: Partial<NotificationPreferences>,
  ): Promise<void> {
    const current = this.getPreferences();
    const updated = { ...current, ...preferences };

    localStorage.setItem(STORAGE_KEYS.PREFERENCES, JSON.stringify(updated));

    // Sync with server if subscribed
    if (this.subscription) {
      try {
        await fetch("/api/push/preferences", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            endpoint: this.subscription.endpoint,
            preferences: updated,
          }),
        });
      } catch (error) {
        console.error("Failed to sync preferences with server:", error);
      }
    }
  }

  /**
   * Check if we should show permission prompt
   */
  shouldShowPrompt(): boolean {
    if (!isPushSupported()) {
      return false;
    }

    // Don't prompt if already granted or denied
    if (Notification.permission !== "default") {
      return false;
    }

    // Check if we've prompted recently
    const lastPrompt = localStorage.getItem(STORAGE_KEYS.LAST_PROMPT);
    if (lastPrompt) {
      const elapsed = Date.now() - parseInt(lastPrompt);
      if (elapsed < MIN_PROMPT_INTERVAL) {
        return false;
      }
    }

    return true;
  }

  /**
   * Get current subscription status
   */
  isSubscribed(): boolean {
    return !!this.subscription;
  }

  /**
   * Get permission status
   */
  getPermission(): NotificationPermission {
    if (!isPushSupported()) {
      return "denied";
    }
    return Notification.permission;
  }

  /**
   * Show a local notification (for testing)
   */
  async showLocalNotification(
    title: string,
    options?: NotificationOptions,
  ): Promise<void> {
    if (!this.registration || Notification.permission !== "granted") {
      return;
    }

    await this.registration.showNotification(title, {
      icon: "/apple-touch-icon.png",
      badge: "/favicon-32x32.png",
      ...options,
    });
  }
}

// Global instance
export const pushManager = new PushNotificationManager();

// ============================================================================
// React Hook for Push Notifications
// ============================================================================

import { useState, useEffect, useCallback } from "react";

export interface UsePushNotificationsReturn {
  supported: boolean;
  permission: NotificationPermission;
  subscribed: boolean;
  loading: boolean;
  subscribe: () => Promise<boolean>;
  unsubscribe: () => Promise<boolean>;
  requestPermission: () => Promise<NotificationPermission>;
  preferences: NotificationPreferences;
  updatePreferences: (prefs: Partial<NotificationPreferences>) => Promise<void>;
  shouldShowPrompt: boolean;
}

export function usePushNotifications(): UsePushNotificationsReturn {
  const [supported, setSupported] = useState(false);
  const [permission, setPermission] =
    useState<NotificationPermission>("default");
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [preferences, setPreferences] =
    useState<NotificationPreferences>(DEFAULT_PREFERENCES);
  const [shouldShowPrompt, setShouldShowPrompt] = useState(false);

  // Initialize on mount
  useEffect(() => {
    async function init() {
      const isSupported = isPushSupported();
      setSupported(isSupported);

      if (isSupported) {
        setPermission(Notification.permission);
        setShouldShowPrompt(pushManager.shouldShowPrompt());

        await pushManager.initialize();
        setSubscribed(pushManager.isSubscribed());
        setPreferences(pushManager.getPreferences());
      }

      setLoading(false);
    }

    init();
  }, []);

  // Subscribe handler
  const subscribe = useCallback(async (): Promise<boolean> => {
    setLoading(true);
    try {
      const subscription = await pushManager.subscribe();
      const success = !!subscription;
      setSubscribed(success);
      setPermission(Notification.permission);
      setShouldShowPrompt(false);
      return success;
    } finally {
      setLoading(false);
    }
  }, []);

  // Unsubscribe handler
  const unsubscribe = useCallback(async (): Promise<boolean> => {
    setLoading(true);
    try {
      const success = await pushManager.unsubscribe();
      if (success) {
        setSubscribed(false);
      }
      return success;
    } finally {
      setLoading(false);
    }
  }, []);

  // Request permission handler
  const requestPermission =
    useCallback(async (): Promise<NotificationPermission> => {
      const perm = await pushManager.requestPermission();
      setPermission(perm);
      setShouldShowPrompt(false);
      return perm;
    }, []);

  // Update preferences handler
  const updatePreferences = useCallback(
    async (prefs: Partial<NotificationPreferences>): Promise<void> => {
      await pushManager.updatePreferences(prefs);
      setPreferences(pushManager.getPreferences());
    },
    [],
  );

  return {
    supported,
    permission,
    subscribed,
    loading,
    subscribe,
    unsubscribe,
    requestPermission,
    preferences,
    updatePreferences,
    shouldShowPrompt,
  };
}
