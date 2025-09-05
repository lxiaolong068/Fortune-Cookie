# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.
``

Project at a glance
- Framework: Next.js 14 (App Router), TypeScript, Tailwind CSS, shadcn/ui
- Testing: Jest (unit/component), Playwright (E2E)
- Data: Prisma ORM (PostgreSQL schema), optional Redis (Upstash) for caching/ratelimiting
- AI: OpenRouter integration with graceful local fallback
- SEO/Perf: Strong metadata + structured data, CSP/security headers, Core Web Vitals tracking

Core commands
- Install and dev
  ```bash path=null start=null
  npm install
  npm run dev
  ```
- Build and run
  ```bash path=null start=null
  npm run build        # prisma generate && next build
  npm run start        # start production server
  npm run analyze      # build with bundle analyzer report
  ```
- Lint and types
  ```bash path=null start=null
  npm run lint
  npm run type-check
  ```
- Unit/component tests (Jest)
  ```bash path=null start=null
  npm test                 # run all
  npm run test:watch       # watch mode
  npm run test:coverage    # coverage
  npm run test:unit        # only __tests__
  npm run test:api         # only API tests
  npm run test:components  # only component tests
  npm run test:lib         # only lib tests
  ```
- Run a single Jest test
  ```bash path=null start=null
  # by file
  npx jest __tests__/api/fortune.test.ts
  # by test name substring
  npx jest __tests__/api/fortune.test.ts -t "generates fortune successfully"
  # via npm
  npm test -- __tests__/api/fortune.test.ts -t "generates fortune successfully"
  ```
- E2E tests (Playwright)
  ```bash path=null start=null
  npm run test:e2e            # run all
  npm run test:e2e:headed     # headed mode
  npm run test:e2e:debug      # debug mode
  # single file / test
  npx playwright test tests/e2e/generator.spec.ts --project=chromium -g "should generate"
  ```
- Deployment checks
  ```bash path=null start=null
  npm run test:local          # test local deployment (TEST_URL defaults to http://localhost:3000)
  npm run test:deployment     # test deployed URL (uses environment)
  npm run vercel-check        # Vercel deployment status checks
  ```
- Database (Prisma)
  ```bash path=null start=null
  # Ensure DATABASE_URL is set to a PostgreSQL connection string
  npm run db:generate
  npm run db:push
  npm run db:migrate
  npm run db:studio
  npm run db:seed             # seeds from lib/fortune-database
  npm run db:seed:clean       # clean then seed
  npm run db:seed:force       # overwrite existing
  npm run db:validate
  npm run db:reset            # reset and reseed
  ```

High-level architecture
- App Router and layout
  - app/layout.tsx composes global metadata (from lib/site.ts), theme initialization, service worker initialization, performance monitor, analytics initializer, and shared UI (navigation/footer). Metadata and SEO images are derived from lib/site.ts and components/SEO.tsx.
  - app/page.tsx sets homepage metadata via generateSEOMetadata and injects JSON-LD structured data components.
  - app/robots.ts and app/sitemap.ts dynamically generate SEO infrastructure.

- API surface (Next.js route handlers under app/api)
  - /api/fortune (POST): AI-backed fortune generator
    - Orchestrates input sanitization/validation, optional rate limiting (Upstash), cache lookup/store, OpenRouter call (lib/openrouter.ts) with graceful fallback, and returns a consistent response envelope (types/api.ts createSuccessResponse/createErrorResponse).
  - /api/fortunes (GET): serves local database of curated fortunes with actions search/category/popular/random/stats; integrates edge caching helpers.
  - /api/analytics and /api/analytics/web-vitals: accept batched analytics events and Core Web Vitals samples; include validation, sampling, and safe headers; data stored in-memory by default for demo.
  - /api/analytics/dashboard: returns summarized analytics (mocked server-side aggregation with strict sanitization and safe headers).
  - /api/cache and /api/database: operational endpoints for cache stats/maintenance and DB health/stats/ops; protected by HMAC signature middleware (see Security below).

- AI integration (lib/openrouter.ts)
  - Uses OPENROUTER_API_KEY and OPENROUTER_BASE_URL; falls back to curated messages when the API is unavailable.
  - The system prompt is theme-aware; lucky numbers are generated client-side in the handler.

- Caching and middleware
  - lib/edge-cache.ts exposes helpers for ETag, Cache-Control, and response optimization; also includes warmup and invalidation helpers for CDN flows.
  - middleware.ts applies coarse-grained caching and Server-Timing hints for static assets, API, and pages.
  - Optional Redis (Upstash) integration (lib/redis-cache.ts) for response caching and distributed rate limiting. Features degrade gracefully when Redis env vars are absent.

- Security and API signatures
  - HMAC-SHA256 request signing in lib/api-signature.ts with timestamp/nonce replay protection and permission checks. SignatureMiddleware (lib/signature-middleware.ts) enforces signatures on sensitive routes like /api/cache and /api/analytics/dashboard.
  - next.config.js sets strict security headers (CSP, HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy). API routes include CORS handling.

- Analytics and performance
  - Client-side analytics pipeline in lib/analytics-manager.ts with event batching, web-vitals observers, interaction tracking, and optional consent gating; initialized in components/AnalyticsInitializer.tsx from app/layout.tsx.
  - Core Web Vitals sent to /api/analytics/web-vitals; sampling rate adapts to metric quality to reduce noise while surfacing regressions.

- Service Worker and offline
  - Service worker management in lib/service-worker.ts; UI prompts handled by components/ServiceWorkerInitializer.tsx. Registered only in production builds (npm run build && npm run start) and supports prefetch and offline fallbacks.

- Database layer (Prisma)
  - prisma/schema.prisma declares models (Fortune, UserSession, ApiUsage, WebVital, ErrorLog, CacheStats, UserFeedback) with PostgreSQL provider. DatabaseManager (lib/database.ts) centralizes Prisma client, query monitoring, and simple health/stats utilities. QueryOptimizer provides structured builders for pagination/search/sort.
  - lib/database-service.ts exposes feature-oriented services (e.g., FortuneService) that implement typical read paths (popular/random/search) and business metrics aggregation.

Important environment variables
- Core
  - NEXT_PUBLIC_APP_URL: Base URL used in metadata and external calls.
- AI
  - OPENROUTER_API_KEY, OPENROUTER_BASE_URL
- Database (Prisma/PostgreSQL)
  - DATABASE_URL
  - DB_CONNECTION_LIMIT, DB_QUERY_TIMEOUT, DB_CONNECTION_TIMEOUT, DB_SLOW_QUERY_THRESHOLD (optional tuning)
  - DATABASE_ADMIN_TOKEN (optional legacy bearer fallback for /api/database)
- Cache/Rate limit (optional Upstash Redis)
  - UPSTASH_REDIS_REST_URL, UPSTASH_REDIS_REST_TOKEN
  - CACHE_ADMIN_TOKEN (optional legacy bearer fallback for /api/cache)
- API signatures (for signed routes)
  - API_KEY_ID, API_KEY_SECRET, API_KEY_PERMISSIONS, API_SIGNATURE_SECRET
- Analytics/SEO (optional)
  - GOOGLE_ANALYTICS_ID, GOOGLE_VERIFICATION_CODE

Signed API usage (development)
- Generate and send signed requests using the provided script:
  ```bash path=null start=null
  # run built-in tests against local server
  node scripts/test-api-signature.js test

  # send a signed GET to /api/cache?action=stats
  node scripts/test-api-signature.js sign GET /api/cache?action=stats

  # output signature headers you can reuse in curl/Postman
  node scripts/test-api-signature.js generate GET /api/cache?action=stats
  ```
- Keys
  - In development, ApiKeyManager can initialize a default key id (dev-key-001) using API_SIGNATURE_SECRET (falls back to a local default if not set). For production and CI, set API_KEY_ID, API_KEY_SECRET, and optionally API_KEY_PERMISSIONS.

Notable configuration
- next.config.js
  - optimizePackageImports for UI/chart libs, CSP + security headers, API CORS, chunking rules, and optional bundle analyzer (npm run analyze).
- Playwright
  - tests/e2e with a local dev server auto-started from npm run dev; ensure port 3000 is free.
- Vercel (vercel.json)
  - Runtime regions, build/install commands, function maxDuration, redirects, and a scheduled cron.

References to repo docs
- docs/TESTING.md: Jest and Playwright guidance and coverage
- docs/DATABASE_SETUP.md: Prisma + DB commands and env
- docs/SERVICE_WORKER.md: SW strategies and messaging
- docs/SESSION_MANAGEMENT.md: Client-side session model and storage
- docs/ANALYTICS.md: Event taxonomy, batching, privacy controls
- docs/API_SIGNATURE.md: HMAC details, headers, examples
- CLAUDE.md: Duplicates many of the commands above and summarizes architecture, envs, and security; this WARP.md consolidates the essentials for Warp

