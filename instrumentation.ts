export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    // Server runtime (Node.js)
    const { default: Sentry } = await import('@sentry/nextjs')
    
    Sentry.init({
      dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
      
      // Adjust this value in production, or use tracesSampler for greater control
      tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
      
      // Setting this option to true will print useful information to the console while you're setting up Sentry.
      debug: process.env.NODE_ENV === 'development',
      
      // Performance monitoring
      beforeSend(event, hint) {
        // Filter out certain errors in production
        if (process.env.NODE_ENV === 'production') {
          // Don't send API key related errors to Sentry
          if (event.message?.includes('API key') || event.message?.includes('OPENROUTER_API_KEY')) {
            console.error('API Key error (not sent to Sentry):', event.message)
            return null
          }
          
          // Filter out expected errors
          if (event.exception?.values?.[0]?.type === 'AbortError') {
            return null
          }
        }
        
        return event
      },
      
      // Set server context
      initialScope: {
        tags: {
          component: 'fortune-cookie-ai-server',
          environment: process.env.NODE_ENV,
        },
      },
    })
  }

  if (process.env.NEXT_RUNTIME === 'edge') {
    // Edge runtime
    const { default: Sentry } = await import('@sentry/nextjs')
    
    Sentry.init({
      dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
      
      // Adjust this value in production, or use tracesSampler for greater control
      tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
      
      // Setting this option to true will print useful information to the console while you're setting up Sentry.
      debug: process.env.NODE_ENV === 'development',
      
      // Set edge context
      initialScope: {
        tags: {
          component: 'fortune-cookie-ai-edge',
          environment: process.env.NODE_ENV,
        },
      },
    })
  }
}