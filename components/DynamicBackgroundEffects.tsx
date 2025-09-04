"use client";

import dynamic from 'next/dynamic';
import { StaticBackground } from './StaticBackground';

/**
 * Dynamic Background Effects Component
 * Lazy-loads the heavy BackgroundEffects component to improve LCP and reduce above-the-fold JS
 * Falls back to StaticBackground while loading
 */
const BackgroundEffects = dynamic(
  () => import('./BackgroundEffects').then(mod => ({ default: mod.BackgroundEffects })),
  {
    ssr: false, // Disable SSR to avoid hydration issues and improve initial load
    loading: () => <StaticBackground />, // Show static background while loading
  }
);

export { BackgroundEffects as DynamicBackgroundEffects };
