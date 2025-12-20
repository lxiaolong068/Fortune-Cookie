"use client";

import { useEffect, useState } from "react";

export interface AuthSession {
  user?: {
    id?: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
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
        const response = await fetch("/api/auth/session");
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

export function startGoogleSignIn() {
  window.location.href = "/api/auth/signin/google";
}

export function startSignOut() {
  window.location.href = "/api/auth/signout";
}
