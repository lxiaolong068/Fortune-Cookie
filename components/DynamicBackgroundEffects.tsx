"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { StaticBackground } from "./StaticBackground";

/**
 * Dynamic Background Effects Component
 * - Renders a static background immediately.
 * - Only loads animated effects on capable devices after idle time.
 */
const BackgroundEffects = dynamic(
  () =>
    import("./BackgroundEffects").then((mod) => ({
      default: mod.BackgroundEffects,
    })),
  {
    ssr: false,
    loading: () => <StaticBackground />,
  },
);

type DynamicBackgroundEffectsProps = {
  idleDelay?: number;
};

export function DynamicBackgroundEffects({
  idleDelay = 2500,
}: DynamicBackgroundEffectsProps) {
  const [shouldAnimate, setShouldAnimate] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const isMobile = window.innerWidth < 768;
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    type NetworkInformation = {
      saveData?: boolean;
      effectiveType?: "slow-2g" | "2g" | "3g" | "4g";
    };
    type NavigatorWithConnection = Navigator & {
      connection?: NetworkInformation;
      deviceMemory?: number;
    };
    const navigatorWithConnection = navigator as NavigatorWithConnection;
    const connection = navigatorWithConnection.connection;
    const saveData = Boolean(connection?.saveData);
    const effectiveType = connection?.effectiveType;
    const isSlowNetwork =
      effectiveType === "slow-2g" || effectiveType === "2g";
    const deviceMemory = navigatorWithConnection.deviceMemory;
    const isLowMemory =
      typeof deviceMemory === "number" && deviceMemory < 4;

    if (
      isMobile ||
      prefersReducedMotion ||
      saveData ||
      isSlowNetwork ||
      isLowMemory
    ) {
      return;
    }

    const requestIdle = (window as typeof window & {
      requestIdleCallback?: (cb: () => void, opts?: { timeout?: number }) => number;
      cancelIdleCallback?: (handle: number) => void;
    }).requestIdleCallback;

    if (typeof requestIdle === "function") {
      const handle = requestIdle(() => setShouldAnimate(true), {
        timeout: idleDelay,
      });
      return () => {
        if (typeof window.cancelIdleCallback === "function") {
          window.cancelIdleCallback(handle);
        }
      };
    }

    const timeoutHandle = window.setTimeout(() => {
      setShouldAnimate(true);
    }, idleDelay);

    return () => {
      window.clearTimeout(timeoutHandle);
    };
  }, [idleDelay]);

  if (!shouldAnimate) {
    return <StaticBackground />;
  }

  return <BackgroundEffects />;
}
