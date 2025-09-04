// This file configures the initialization of Sentry on the browser/client side
import * as Sentry from '@sentry/nextjs'

// Only enable Sentry in production when DSN is provided
const DSN = process.env.NEXT_PUBLIC_SENTRY_DSN
const IS_PROD = process.env.NODE_ENV === 'production'
const ENABLED = !!DSN && IS_PROD && process.env.NEXT_PUBLIC_ENABLE_SENTRY !== 'false'

// Export router transition hook (no-op if disabled)
export const onRouterTransitionStart = ENABLED
  ? Sentry.captureRouterTransitionStart
  : (() => {})

if (ENABLED) {
  Sentry.init({
    dsn: DSN,
    enabled: true,
    // Keep debug off to avoid noisy logs
    debug: false,
    // Reasonable production sampling; disabled entirely in dev via ENABLED
    tracesSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,
    replaysSessionSampleRate: 0.1,
    integrations: [
      Sentry.replayIntegration({
        maskAllText: true,
        blockAllMedia: true,
      }),
    ],
    beforeSend(event) {
      // Filter out less actionable production noise
      if (IS_PROD) {
        if (event.exception?.values?.[0]?.type === 'NetworkError') return null
        if (event.message?.includes('Hydration')) return null
      }
      return event
    },
    initialScope: {
      tags: {
        component: 'fortune-cookie-ai',
        environment: process.env.NODE_ENV,
      },
    },
  })
}
