"use client";

import { useEffect, useState } from "react";

export interface AuthSession {
  user?: {
    id?: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    isPremium?: boolean;
  };
  expires?: string;
}

type AuthStatus = "loading" | "authenticated" | "unauthenticated";

export function useAuthSession() {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [status, setStatus] = useState<AuthStatus>("loading");

  useEffect(() => {
    let active = true;

    const loadSession = async () => {
      try {
        const response = await fetch("/api/auth/session", {
          cache: "no-store",
          credentials: "include",
        });
        const data = await response.json().catch(() => null);

        if (!active) return;

        if (data && typeof data === "object" && "user" in data && data.user) {
          setSession(data as AuthSession);
          setStatus("authenticated");
          return;
        }
      } catch (error) {
        console.warn("Failed to load auth session:", error);
      }

      if (!active) return;
      setSession(null);
      setStatus("unauthenticated");
    };

    void loadSession();

    return () => {
      active = false;
    };
  }, []);

  return { data: session, status };
}

/**
 * Kick off Google OAuth. Pass `callbackUrl` (defaults to the current path) so
 * the user lands back where they were instead of on the homepage — important
 * for in-place sign-in prompts like the quota gate card.
 */
export function startGoogleSignIn(callbackUrl?: string) {
  // Browser-only by construction: both callers are click handlers, and the
  // navigation below needs `window` regardless — guarding only the callbackUrl
  // lookup would have been theatre.
  const target =
    callbackUrl ?? `${window.location.pathname}${window.location.search}`;

  window.location.href = `/api/auth/signin/google?callbackUrl=${encodeURIComponent(target)}`;
}

export function startSignOut() {
  window.location.href = "/api/auth/signout";
}
