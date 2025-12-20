"use client";

import { PropsWithChildren, useEffect, useState } from "react";

type DeferredMountProps = PropsWithChildren<{
  delay?: number;
  triggerOnInteraction?: boolean;
  useIdle?: boolean;
}>;

type RequestIdleCallback = (
  callback: () => void,
  options?: { timeout?: number },
) => number;
type CancelIdleCallback = (handle: number) => void;

export function DeferredMount({
  children,
  delay = 2000,
  triggerOnInteraction = true,
  useIdle = true,
}: DeferredMountProps) {
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    if (shouldRender || typeof window === "undefined") {
      return;
    }

    let idleHandle: number | ReturnType<typeof setTimeout> | null = null;
    let handleType: "idle" | "timeout" | null = null;
    const events = triggerOnInteraction
      ? ["pointerdown", "keydown", "touchstart", "scroll"]
      : [];

    const reveal = () => setShouldRender(true);

    if (useIdle) {
      const requestIdle = (window as typeof window & {
        requestIdleCallback?: RequestIdleCallback;
      }).requestIdleCallback;

      if (typeof requestIdle === "function") {
        idleHandle = requestIdle(reveal, { timeout: delay });
        handleType = "idle";
      } else {
        idleHandle = setTimeout(reveal, delay);
        handleType = "timeout";
      }
    }

    if (triggerOnInteraction) {
      events.forEach((event) => {
        window.addEventListener(event, reveal, { once: true, passive: true });
      });
    }

    return () => {
      if (idleHandle !== null) {
        if (handleType === "idle") {
          const cancelIdle = (window as typeof window & {
            cancelIdleCallback?: CancelIdleCallback;
          }).cancelIdleCallback;
          if (typeof cancelIdle === "function") {
            cancelIdle(idleHandle as number);
          }
        } else {
          clearTimeout(idleHandle as ReturnType<typeof setTimeout>);
        }
      }

      if (triggerOnInteraction) {
        events.forEach((event) => {
          window.removeEventListener(event, reveal);
        });
      }
    };
  }, [delay, shouldRender, triggerOnInteraction, useIdle]);

  if (!shouldRender) {
    return null;
  }

  return <>{children}</>;
}
