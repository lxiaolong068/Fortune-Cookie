# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Fortune Cookie AI** is an SEO-optimized, AI-powered fortune cookie generator built with Next.js 14 App Router, TypeScript, and Prisma. It features 500+ pre-categorized fortune messages, AI generation via OpenRouter API, comprehensive caching with Redis/Upstash, and full performance monitoring.

**Tech Stack**: Next.js 14, TypeScript, React 18, Prisma ORM, PostgreSQL, Redis (Upstash), OpenRouter API (AI generation), NextAuth.js (Google OAuth), shadcn/ui, Radix UI, Framer Motion, Tailwind CSS

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
- `fortune/quota/route.ts` - User quota status endpoint (daily limits for guests/authenticated users)
- `fortunes/route.ts` - Database fortune browsing and search
- `auth/[...nextauth]/route.ts` - NextAuth.js authentication routes (Google OAuth)
- `analytics/route.ts` - Performance metrics collection
- `database/route.ts` - Database health checks
- `cache/route.ts` - Cache management endpoints

**Core Libraries** (`lib/`):
- `openrouter.ts` - OpenRouter API client with fallback fortunes
- `fortune-database.ts` - 500+ categorized fortune messages with search
- `redis-cache.ts` - Redis/Upstash integration with rate limiting
- `edge-cache.ts` - Edge caching utilities and performance monitoring
- `auth.ts` - NextAuth.js configuration with Google OAuth provider
- `auth-client.ts` - Client-side authentication hooks (`useAuthSession`, `startGoogleSignIn`, `startSignOut`)
- `quota.ts` - Daily fortune quota system (guest: 1/day, authenticated: 10/day)
- `session-manager.ts` - User session tracking
- `error-monitoring.ts` - Error capture and analytics
- `utils.ts` - Shared utilities (cn, date formatting, etc.)
- `blob-urls.ts` - Vercel Blob Storage URL mappings (auto-generated)

**Components** (`components/`):
- `AIFortuneCookie.tsx` - Main AI-powered fortune cookie component with theme selection
- `FortuneCookie.tsx` - Original fortune cookie component
- `BackgroundEffects.tsx` - Animated background with particles
- `SEO.tsx` - SEO metadata management
- `StructuredData.tsx` - JSON-LD schema generation
- `PerformanceMonitor.tsx` - Web Vitals monitoring with retry mechanism (exponential backoff, up to 3 retries)
- `AdSenseFacade.tsx` - OptimizedAdSense component using Facade pattern for delayed AdSense script loading (improves LCP)
- `ExpandableRecipeCard.tsx` - Expandable recipe card with collapsible ingredients/instructions sections
- `Navigation.tsx` - Main navigation component with authentication state integration
- `ui/` - shadcn/ui component library

**Dynamic Pages** (`app/browse/`):
- `category/[category]/page.tsx` - Dynamic category pages for browsing fortunes by category with SEO optimization

**Database** (`prisma/`):
- `schema.prisma` - PostgreSQL schema with 13 models:
  - Core: Fortune, UserSession, ApiUsage, WebVital, ErrorLog, CacheStats, UserFeedback
  - Auth (NextAuth): User, Account, Session, VerificationToken
  - Quota: FortuneQuota, FortuneUsage
- Indexed for performance on category, mood, timestamp, popularity, userId, dateKey

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
- **IndexNow Integration** (`lib/indexnow.ts`, `app/api/indexnow/route.ts`):
  - Instant URL submission to search engines (Bing, Yandex, IndexNow API)
  - API key verification file at `/4f58cae8b6004a7a88e13474e58418e1.txt`
  - Supports single URL, batch submission, and sitemap URL notifications
  - Admin token or authenticated user required for API access

### Authentication & Quota System

**Google OAuth Authentication** (NextAuth.js):
- Provider: Google OAuth 2.0 via `next-auth/providers/google`
- Adapter: Prisma Adapter for database session storage
- Session Strategy: Database sessions (not JWT)
- Client hooks: `useAuthSession()`, `startGoogleSignIn()`, `startSignOut()`

**Fortune Quota System** (`lib/quota.ts`):
- **Guest Users**: 1 AI fortune per day (configurable via `GUEST_DAILY_LIMIT`)
- **Authenticated Users**: 10 AI fortunes per day (configurable via `AUTH_DAILY_LIMIT`)
- Quota resets at UTC midnight
- Guest identification via `X-Client-Id` header or IP-based fallback
- Quota status endpoint: `GET /api/fortune/quota`

**Quota Flow**:
1. Request arrives at `/api/fortune`
2. Resolve identity (authenticated user ID or guest ID)
3. Check daily quota via `getDailyQuotaStatus()`
4. If quota exceeded, return 429 with reset time
5. On successful generation, increment usage via `recordFortuneUsage()`

## Environment Variables

Required in `.env.local` (see `.env.example` for full template):
```bash
# Database (PostgreSQL)
DATABASE_URL="postgresql://..."

# Redis/Upstash (optional, enables caching and rate limiting)
UPSTASH_REDIS_REST_URL="https://..."
UPSTASH_REDIS_REST_TOKEN="..."

# OpenRouter API (optional, enables AI generation)
OPENROUTER_API_KEY="sk-or-..."
OPENROUTER_BASE_URL="https://openrouter.ai/api/v1"
OPENROUTER_MODEL="openai/gpt-4o-mini"  # Optional: specify model

# Google OAuth (NextAuth.js - enables user authentication)
GOOGLE_CLIENT_ID="..."
GOOGLE_CLIENT_SECRET="..."
NEXTAUTH_SECRET="..."  # Generate with: openssl rand -base64 32
NEXTAUTH_URL="http://localhost:3000"  # Set to production URL in deployment

# Fortune Quota (optional, defaults shown)
GUEST_DAILY_LIMIT="1"   # Daily AI fortune limit for guests
AUTH_DAILY_LIMIT="10"   # Daily AI fortune limit for authenticated users

# Application
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_APP_NAME="Fortune Cookie AI"
NODE_ENV="development"

# Analytics (optional)
GOOGLE_ANALYTICS_ID="G-..."
GOOGLE_VERIFICATION_CODE="..."
GOOGLE_ADSENSE_CLIENT_ID="ca-pub-..."

# Vercel Blob Storage (for CDN-optimized images)
BLOB_READ_WRITE_TOKEN="vercel_blob_rw_..."
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

## Image Management (Vercel Blob Storage)

All static images are hosted on Vercel Blob Storage for CDN optimization and improved performance.

**Image Architecture**:
- Images stored in Vercel Blob Storage (CDN-distributed globally)
- `lib/blob-urls.ts` - Auto-generated URL mappings
- `lib/site.ts` - `getImageUrl()` automatically returns Blob URLs
- Original images retained in `public/` as backup

**Adding/Updating Images**:
```bash
# 1. Add new image to public/ directory
# 2. Run upload script to sync to Blob Storage
node scripts/upload-to-blob.js

# Options:
node scripts/upload-to-blob.js --dry-run     # Preview without uploading
node scripts/upload-to-blob.js --single favicon.ico  # Upload single file
node scripts/upload-to-blob.js --list        # List existing blobs
```

**Using Images in Code**:
```typescript
// Use getImageUrl() for automatic Blob URL resolution
import { getImageUrl } from '@/lib/site'
const imageUrl = getImageUrl('/og-image.png')
// Returns: https://oxnbbm6ljoyuzqns.public.blob.vercel-storage.com/og-image.png

// Or use getBlobUrl() directly
import { getBlobUrl } from '@/lib/blob-urls'
const blobUrl = getBlobUrl('/images/blog/hero.jpg')
```

**Image Files** (24 total):
- Favicons: `favicon.ico`, `favicon-16x16.png`, `favicon-32x32.png`
- App Icons: `apple-touch-icon.png`, `android-chrome-*.png`
- Social: `og-image.png`, `twitter-image.png`, `logo.svg`
- Blog: `images/blog/*.jpg`
- UI: `images/fortune-cookie-hero.svg`, `images/fortune-cookie-banner.svg`

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

### Working with Authentication

**Server-Side Session Access**:
```typescript
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// In API routes or Server Components
const session = await getServerSession(authOptions);
if (session?.user?.id) {
  // User is authenticated
  const userId = session.user.id;
}
```

**Client-Side Session Access**:
```typescript
import { useAuthSession, startGoogleSignIn, startSignOut } from "@/lib/auth-client";

function MyComponent() {
  const { data: session, status } = useAuthSession();
  
  if (status === "loading") return <Loading />;
  if (status === "authenticated") {
    return <button onClick={startSignOut}>Sign Out</button>;
  }
  return <button onClick={startGoogleSignIn}>Sign In with Google</button>;
}
```

**Checking Quota in API Routes**:
```typescript
import { getDailyQuotaStatus, resolveGuestId, type QuotaIdentity } from "@/lib/quota";

const session = await getServerSession(authOptions);
const quotaIdentity: QuotaIdentity = session?.user?.id
  ? { isAuthenticated: true, userId: session.user.id }
  : { isAuthenticated: false, guestId: resolveGuestId(request) };

const quota = await getDailyQuotaStatus(quotaIdentity);
if (quota.remaining <= 0) {
  return NextResponse.json({ error: "Quota exceeded" }, { status: 429 });
}
```

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

**Authentication Issues** (NextAuth.js):
- Check `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` are set correctly
- Verify `NEXTAUTH_SECRET` is set (generate with `openssl rand -base64 32`)
- Ensure `NEXTAUTH_URL` matches your application URL
- Check Google Cloud Console for OAuth consent screen configuration
- Verify authorized redirect URIs include `/api/auth/callback/google`
- Run `npm run db:push` to ensure auth tables exist (User, Account, Session, VerificationToken)

**Quota System Issues**:
- Check quota status: GET `/api/fortune/quota`
- Guest ID resolved from `X-Client-Id` header or IP address
- Quota resets at UTC midnight (not local time)
- Adjust limits via `GUEST_DAILY_LIMIT` and `AUTH_DAILY_LIMIT` env vars
- Debug with `npm run db:studio` to inspect FortuneQuota/FortuneUsage tables

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
