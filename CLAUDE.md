# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Fortune Cookie AI** is an SEO-optimized, AI-powered fortune cookie generator built with Next.js 14 App Router, TypeScript, and Prisma. It features 500+ pre-categorized fortune messages, AI generation via OpenRouter API, comprehensive caching with Redis/Upstash, and full performance monitoring.

**Tech Stack**: Next.js 14, TypeScript, React 18, Prisma ORM, PostgreSQL, Redis (Upstash), OpenRouter API (AI generation), shadcn/ui, Radix UI, Framer Motion, Tailwind CSS

## Development Commands

### Primary Workflow
```bash
# Development server
npm run dev                    # Start development server on localhost:3000

# Database operations (Prisma)
npm run db:generate            # Generate Prisma Client after schema changes
npm run db:push                # Push schema changes to database
npm run db:migrate             # Create and run migrations
npm run db:studio              # Open Prisma Studio GUI
npm run db:seed                # Seed database with fortune messages
npm run db:seed:clean          # Clean seed (remove existing data first)
npm run db:seed:force          # Force seed without prompts
npm run db:validate            # Validate database seeding
npm run db:reset               # Reset database and re-seed

# Type checking and linting
npm run type-check             # TypeScript type checking (runs before build)
npm run lint                   # Next.js ESLint

# Building
npm run build                  # Build for production (includes type-check and Prisma generation)
npm run analyze                # Build with bundle analyzer

# Production
npm start                      # Start production server (after build)
```

### Testing Commands
```bash
# Unit/Integration tests (Jest)
npm test                       # Run Jest tests
npm run test:watch             # Run tests in watch mode
npm run test:coverage          # Run tests with coverage report
npm run test:ci                # CI mode (no watch, with coverage)
npm run test:unit              # Run unit tests only
npm run test:api               # Run API tests only
npm run test:components        # Run component tests only
npm run test:lib               # Run library tests only

# E2E tests (Playwright)
npm run test:e2e               # Run Playwright E2E tests
npm run test:e2e:ui            # Run with Playwright UI
npm run test:e2e:headed        # Run in headed mode (visible browser)
npm run test:e2e:debug         # Run in debug mode

# Deployment tests
npm run test:local             # Test against localhost:3000
npm run test:deployment        # Test production deployment
npm run vercel-check           # Verify Vercel deployment health
```

## Architecture Overview

### Core System Design

**Data Flow Architecture**:
1. **Client Request** → Middleware (rate limiting, CORS) → API Route Handler
2. **API Route** → Redis Cache Check → OpenRouter AI (if cache miss) → Database (analytics)
3. **Response** → Edge Cache Headers → Client with cached fortune

**Caching Strategy** (3-tier):
- **Edge Cache**: Browser + CDN caching via Cache-Control headers
- **Redis Cache**: Distributed cache for fortune results (5-minute TTL)
- **Database**: Long-term storage for analytics and pre-seeded fortunes

**AI Fallback Chain**:
1. Primary: OpenRouter API with Claude 3 Haiku model
2. Fallback: Pre-seeded fortune database (500+ messages)
3. Graceful degradation with user notification

### Directory Structure & Key Files

**API Routes** (`app/api/`):
- `fortune/route.ts` - AI fortune generation with rate limiting, caching, input sanitization
- `fortunes/route.ts` - Database fortune browsing and search
- `analytics/route.ts` - Performance metrics collection
- `database/route.ts` - Database health checks
- `cache/route.ts` - Cache management endpoints

**Core Libraries** (`lib/`):
- `openrouter.ts` - OpenRouter API client with fallback fortunes
- `fortune-database.ts` - 500+ categorized fortune messages with search
- `redis-cache.ts` - Redis/Upstash integration with rate limiting
- `edge-cache.ts` - Edge caching utilities and performance monitoring
- `session-manager.ts` - User session tracking
- `error-monitoring.ts` - Error capture and analytics
- `utils.ts` - Shared utilities (cn, date formatting, etc.)

**Components** (`components/`):
- `AIFortuneCookie.tsx` - Main AI-powered fortune cookie component with theme selection
- `FortuneCookie.tsx` - Original fortune cookie component
- `BackgroundEffects.tsx` - Animated background with particles
- `SEO.tsx` - SEO metadata management
- `StructuredData.tsx` - JSON-LD schema generation
- `PerformanceMonitor.tsx` - Web Vitals monitoring with retry mechanism (exponential backoff, up to 3 retries)
- `AdSenseFacade.tsx` - OptimizedAdSense component using Facade pattern for delayed AdSense script loading (improves LCP)
- `ui/` - shadcn/ui component library

**Dynamic Pages** (`app/browse/`):
- `category/[category]/page.tsx` - Dynamic category pages for browsing fortunes by category with SEO optimization

**Database** (`prisma/`):
- `schema.prisma` - PostgreSQL schema with 7 models (Fortune, UserSession, ApiUsage, WebVital, ErrorLog, CacheStats, UserFeedback)
- Indexed for performance on category, mood, timestamp, popularity

### Critical Implementation Details

**SSR/CSR Consistency**:
- All randomization must use deterministic PRNG to prevent hydration mismatches
- Client-side components marked with `"use client"` directive
- Server components handle SEO metadata and static generation

**Rate Limiting**:
- Upstash Redis-based distributed rate limiting
- Fortune API: 20 requests/10 seconds per IP
- Graceful degradation when Redis unavailable

**Input Sanitization** (`app/api/fortune/route.ts`):
- HTML tag stripping, script removal, length limits
- Prompt injection protection with pattern matching
- Theme/mood/length validation against whitelists

**Performance Targets**:
- LCP (Largest Contentful Paint): < 2.5s
- INP (Interaction to Next Paint): < 200ms
- CLS (Cumulative Layout Shift): < 0.1
- API Response Time: < 500ms (cached), < 2s (AI generation)

**SEO Implementation**:
- Dynamic sitemap generation (`app/sitemap.ts`)
- Robots.txt configuration (`app/robots.ts`)
- JSON-LD structured data (Recipe, Article, FAQ schemas)
- Open Graph and Twitter Card metadata
- Internal linking strategy across 8+ content pages

## Environment Variables

Required in `.env.local`:
```bash
# Database (PostgreSQL)
DATABASE_URL="postgresql://..."

# Redis/Upstash (optional, enables caching and rate limiting)
UPSTASH_REDIS_REST_URL="https://..."
UPSTASH_REDIS_REST_TOKEN="..."

# OpenRouter API (optional, enables AI generation)
OPENROUTER_API_KEY="sk-or-..."
OPENROUTER_BASE_URL="https://openrouter.ai/api/v1"

# Application
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NODE_ENV="development"

# Analytics (optional)
GOOGLE_ANALYTICS_ID="G-..."
GOOGLE_VERIFICATION_CODE="..."
```

**Environment Priority**:
1. `.env.local` (local development, gitignored)
2. `.env` (defaults, committed)
3. Vercel environment variables (production)

## Testing Strategy

**Jest Unit Tests**:
- Coverage target: 70% (branches, functions, lines, statements)
- Test patterns: `**/__tests__/**/*.{test,spec}.{ts,tsx}`
- Run before committing: `npm run test:ci`

**Playwright E2E Tests** (`tests/e2e/`):
- Homepage functionality and fortune generation
- AI generator page with all themes
- Responsive design validation (mobile, tablet, desktop)
- Hydration warning detection
- 404 error prevention

**Deployment Tests** (`scripts/test-deployment.js`):
- Page response validation (200 status)
- API endpoint health checks
- SEO infrastructure (sitemap, robots.txt)
- Static asset availability (favicon, icons)
- Structured data validation

## Common Development Patterns

### Adding New Fortune Categories

1. Update `lib/fortune-database.ts`:
```typescript
const newCategoryMessages: Omit<FortuneMessage, 'id' | 'dateAdded'>[] = [
  {
    message: "Your message here",
    category: 'new_category',
    tags: ['tag1', 'tag2'],
    luckyNumbers: [1, 2, 3, 4, 5, 6],
    popularity: 8
  }
]

// Add to fortuneDatabase export
export const fortuneDatabase: FortuneMessage[] = [
  ...existingMessages,
  ...newCategoryMessages
].map(...)
```

2. Update Prisma schema if storing in database
3. Update `lib/openrouter.ts` theme prompts if using AI
4. Run `npm run db:seed` to update database

### Creating New API Routes

Follow the pattern in `app/api/fortune/route.ts`:
1. Import caching and monitoring utilities
2. Implement rate limiting check (if Redis available)
3. Validate and sanitize inputs
4. Check cache before expensive operations
5. Capture analytics events (user actions, business events)
6. Return consistent API response envelope (createSuccessResponse/createErrorResponse)
7. Add security headers (CORS, CSP, X-Frame-Options)

### Working with Prisma

**Schema Changes**:
```bash
# 1. Edit prisma/schema.prisma
# 2. Generate Prisma Client
npm run db:generate
# 3. Create migration (dev)
npm run db:migrate
# Or push directly (prototyping)
npm run db:push
```

**Using Prisma Client**:
```typescript
import { prisma } from '@/lib/prisma'

// Always use try-catch and proper error handling
try {
  const fortunes = await prisma.fortune.findMany({
    where: { category: 'inspirational' },
    orderBy: { popularity: 'desc' }
  })
} catch (error) {
  captureApiError(error, '/api/endpoint', 'GET', 500)
}
```

### Implementing Caching

**Redis Cache Pattern**:
```typescript
import { cacheManager } from '@/lib/redis-cache'

// Check cache
const cached = await cacheManager.getCachedFortune(key)
if (cached) {
  CachePerformanceMonitor.recordHit()
  return cached
}

// Generate and cache
CachePerformanceMonitor.recordMiss()
const result = await generateExpensiveResult()
await cacheManager.cacheFortune(key, result, ttl)
```

**Edge Cache Headers**:
```typescript
import { EdgeCacheManager } from '@/lib/edge-cache'

const response = EdgeCacheManager.optimizeApiResponse(
  data,
  cacheKey,
  maxAge // seconds
)
```

## Build and Deployment

**Pre-Deployment Checklist**:
1. ✅ Run `npm run type-check` - Must pass
2. ✅ Run `npm run lint` - Must pass
3. ✅ Run `npm run test:ci` - Coverage ≥ 70%
4. ✅ Run `npm run build` - Must complete successfully
5. ✅ Test locally with `npm start`
6. ✅ Run `npm run test:local` - All tests pass

**Vercel Deployment**:
- Auto-deploys from `main` branch
- `vercel-build` script runs type-check before build
- Environment variables configured in Vercel dashboard
- Post-deployment: `npm run vercel-check` validates health

**Build Optimization**:
- Prisma Client generated during build (`prisma generate`)
- Bundle analysis available via `npm run analyze`
- Static page generation for SEO content pages
- API routes deployed as serverless functions

## Troubleshooting

**Hydration Mismatches**:
- Check for non-deterministic rendering (Math.random, Date.now)
- Ensure client/server components properly marked
- Use deterministic PRNG for randomization
- Verify `useEffect` for client-only operations

**TypeScript Errors**:
- Run `npm run db:generate` to regenerate Prisma types
- Check `tsconfig.json` path aliases match imports
- Verify strict mode compliance (`noUncheckedIndexedAccess`)

**Database Issues**:
- Check `DATABASE_URL` in `.env.local`
- Run `npm run db:push` to sync schema
- Use `npm run db:studio` to inspect data visually
- Reset with `npm run db:reset` if corrupted

**Redis/Cache Issues**:
- Cache gracefully degrades when Redis unavailable
- Check `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN`
- Monitor cache stats via `CachePerformanceMonitor.getStats()`
- Test without cache: comment out Redis connection

**AI Generation Failures**:
- System falls back to pre-seeded fortunes automatically
- Check `OPENROUTER_API_KEY` validity
- Test health endpoint: GET `/api/fortune`
- Review OpenRouter dashboard for quota/errors

**Turbopack/HMR Issues**:
- Next.js Turbopack (experimental) may have aggressive caching
- `DynamicNavigation` uses `ssr: false` which can cause client-side caching
- If component changes don't reflect in browser:
  1. Try `rm -rf .next node_modules/.cache && npm run dev`
  2. Try disabling Turbopack: `next dev` without turbo config
  3. Check `docs/blog-navigation-issue.md` for known navigation issues

## Blog Feature

The blog feature uses MDX files in `content/blog/` directory:
- **List page**: `app/blog/page.tsx` - displays all blog posts
- **Detail page**: `app/blog/[slug]/page.tsx` - renders MDX content with SSG
- **Data utilities**: `lib/blog.ts` - getBlogPosts(), getPostBySlug(), getAllTags()
- **Components**: `components/blog/` - BlogCard, MDXComponents

**Known Issue**: Blog navigation link may not appear in desktop navbar due to Turbopack caching. See `docs/blog-navigation-issue.md` for details. Workaround: access blog via Footer link or direct URL `/blog`.

## Security Configuration

**Dynamic CSP with Nonce** (`middleware.ts`):
- Generates unique nonce for each request via `generateNonce()` function
- Nonce applied to inline scripts and styles in CSP header
- Used by `ThemeScript` component for theme initialization

**Security Headers** (configured in `middleware.ts` and `next.config.js`):
- **CSP**: Content Security Policy with dynamic nonce, restricting script/style sources
- **COOP**: Cross-Origin-Opener-Policy set to `same-origin`
- **COEP**: Cross-Origin-Embedder-Policy set to `require-corp`
- **CORP**: Cross-Origin-Resource-Policy set to `same-origin`

**Known Security Limitation**:
- Trusted Types temporarily disabled due to incompatibility with Next.js 14 and Framer Motion
- Results in "TrustedHTML" assignment errors when enabled
- TODO: Re-enable after adding appropriate policies for third-party libraries

**ads.txt and robots.txt Configuration**:
- `next.config.js` uses rewrites to prevent Next.js redirects on these files
- `vercel.json` sets `Content-Type: text/plain` and `Cache-Control: public, max-age=3600`
- Ensures Google AdSense can correctly detect `ads.txt`

## Code Quality Standards

- **TypeScript Strict Mode**: All code must compile with strict checks
- **Path Aliases**: Use `@/` prefix for absolute imports
- **Error Handling**: Always wrap async operations in try-catch, use `captureApiError`
- **Performance**: Monitor with Web Vitals, target Core Web Vitals thresholds
- **SEO**: Maintain structured data, meta tags, sitemap for all public pages
- **Accessibility**: Follow WCAG 2.1 guidelines, use semantic HTML, test with keyboard navigation
- **Security**: Sanitize inputs, validate API requests, implement rate limiting, use CSP headers
