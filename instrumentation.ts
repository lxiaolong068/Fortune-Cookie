export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    // Server runtime (Node.js)
    try {
      const Sentry = await import('@sentry/nextjs')
      const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN
      const isProd = process.env.NODE_ENV === 'production'
      const enabled = !!dsn && isProd && process.env.NEXT_PUBLIC_ENABLE_SENTRY !== 'false'

      if (enabled) {
        Sentry.init({
          dsn,
          enabled: true,
          debug: false,
          tracesSampleRate: 0.1,
          beforeSend(event) {
            if (isProd) {
              if (event.message?.includes('API key') || event.message?.includes('OPENROUTER_API_KEY')) {
                // keep out of Sentry, but log locally
                console.error('API Key error (not sent to Sentry):', event.message)
                return null
              }
              if (event.exception?.values?.[0]?.type === 'AbortError') {
                return null
              }
            }
            return event
          },
          initialScope: {
            tags: {
              component: 'fortune-cookie-ai-server',
              environment: process.env.NODE_ENV,
            },
          },
        })
      }
    } catch (error) {
      console.warn('Failed to initialize Sentry for Node.js runtime:', error)
    }
  }

  if (process.env.NEXT_RUNTIME === 'edge') {
    // Edge runtime
    try {
      const Sentry = await import('@sentry/nextjs')
      const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN
      const isProd = process.env.NODE_ENV === 'production'
      const enabled = !!dsn && isProd && process.env.NEXT_PUBLIC_ENABLE_SENTRY !== 'false'

      if (enabled) {
        Sentry.init({
          dsn,
          enabled: true,
          debug: false,
          tracesSampleRate: 0.1,
          initialScope: {
            tags: {
              component: 'fortune-cookie-ai-edge',
              environment: process.env.NODE_ENV,
            },
          },
        })
      }
    } catch (error) {
      console.warn('Failed to initialize Sentry for Edge runtime:', error)
    }
  }
}
