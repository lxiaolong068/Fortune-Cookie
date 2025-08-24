# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

**Start Development Server:**
```bash
npm run dev
```
Server runs at http://localhost:3000

**Build & Deployment:**
```bash
npm run build          # Build for production
npm run start           # Start production server
npm run lint            # Run ESLint
npm run type-check      # TypeScript type checking
```

**Testing Commands:**
```bash
# Unit Tests (Jest)
npm run test            # Run all unit tests
npm run test:watch      # Run tests in watch mode
npm run test:coverage   # Generate coverage report
npm run test:unit       # Run specific unit tests
npm run test:api        # Test API endpoints
npm run test:components # Test React components
npm run test:lib        # Test utility functions

# E2E Tests (Playwright)
npm run test:e2e        # Run Playwright E2E tests
npm run test:e2e:ui     # Run tests with Playwright UI
npm run test:e2e:debug  # Run tests in debug mode
npm run test:local      # Test local development server
npm run test:deployment # Test production deployment
```

**Database Commands:**
```bash
npm run db:generate     # Generate Prisma client
npm run db:push         # Push schema to database
npm run db:migrate      # Run database migrations
npm run db:studio       # Open Prisma Studio
npm run db:seed         # Seed database with fortune data
npm run db:seed:clean   # Clean and reseed database
npm run db:reset        # Reset database and reseed
```

**Analysis:**
```bash
npm run analyze         # Bundle analysis with webpack-bundle-analyzer
```

## Architecture & Tech Stack

**Framework:** Next.js 14 with App Router architecture
- Server-side rendering and static site generation
- API routes in `app/api/` directory
- File-based routing with route groups

**AI Integration:**
- OpenRouter API client in `lib/openrouter.ts`
- AI fortune generation with theme-based prompts
- Fallback system using local fortune database (500+ messages)
- Rate limiting and error handling in API routes

**Key Libraries:**
- **UI Components:** shadcn/ui with Radix UI primitives
- **Styling:** Tailwind CSS with CSS variables for theming
- **Animations:** Framer Motion for complex animations
- **Icons:** Lucide React
- **Type Safety:** Full TypeScript implementation

**Database Architecture:**
- **Prisma ORM** with SQLite database for development
- **Schema**: `prisma/schema.prisma` with 7 models
- **Fortune Model**: Messages with categories, moods, popularity ratings
- **Analytics Models**: WebVital, ApiUsage, ErrorLog tracking
- **User Models**: UserSession, UserFeedback for interaction data
- **Fallback System**: Local fortune database in `lib/fortune-database.ts` (500+ messages)

## Project Structure

**Core Pages:**
- `/` - Homepage with hero and feature overview
- `/generator` - AI-powered fortune cookie generator
- `/messages` - Browse categorized fortune messages
- `/browse` - Advanced search and filtering
- `/history` - Fortune cookie history and cultural background
- `/recipes` - Fortune cookie making tutorials
- `/who-invented-fortune-cookies` - Inventor story page
- `/how-to-make-fortune-cookies` - Step-by-step making guide
- `/funny-fortune-cookie-messages` - Comedy-focused message collection

**API Endpoints:**
- `/api/fortune` - AI fortune generation with OpenRouter
- `/api/fortunes` - Fortune database queries
- `/api/analytics/dashboard` - Analytics data
- `/api/analytics/web-vitals` - Performance monitoring

**Key Components:**
- `AIFortuneCookie.tsx` - Main AI generator with animated state machine
- `FortuneCookie.tsx` - Static fortune cookie display
- `BackgroundEffects.tsx` - Animated gradient and particle effects
- `Navigation.tsx` - Main site navigation
- `SEO.tsx` - Dynamic SEO metadata components
- `StructuredData.tsx` - JSON-LD structured data
- `PerformanceMonitor.tsx` - Core Web Vitals tracking

## Configuration

**Environment Variables Required:**
```bash
# AI Generation
OPENROUTER_API_KEY=your_api_key          # OpenRouter API for AI fortune generation

# Database
DATABASE_URL="file:./dev.db"             # SQLite database path

# App Configuration  
NEXT_PUBLIC_APP_URL=https://your-domain  # App URL for API requests

# Analytics (Optional)
GOOGLE_ANALYTICS_ID=your_ga_id           # Google Analytics tracking
GOOGLE_VERIFICATION_CODE=your_code       # Search Console verification

# Rate Limiting (Optional)
UPSTASH_REDIS_REST_URL=your_redis_url    # Redis for rate limiting
UPSTASH_REDIS_REST_TOKEN=your_token      # Redis authentication

# Monitoring (Optional) 
SENTRY_DSN=your_sentry_dsn               # Error tracking with Sentry
```

**AI Configuration:**
- OpenRouter client supports multiple AI models
- Theme-based system prompts for different fortune types
- Graceful degradation when AI service unavailable
- Rate limiting: 50 requests per 15 minutes per IP

## Development Patterns

**Component Patterns:**
- Client components use "use client" directive
- Server components for SEO and initial data loading
- Shared UI components in `components/ui/`
- Framer Motion for consistent animations

**State Management:**
- React hooks for local component state
- No global state management (Redux, Zustand) currently used
- Server state handled through API routes

**SEO Implementation:**
- Dynamic metadata generation per page
- Structured data (JSON-LD) for search engines
- Optimized images and performance
- Core Web Vitals monitoring

**Error Handling:**
- API routes include comprehensive error handling
- Client-side graceful degradation
- Fallback fortune database for AI failures
- User-friendly error messages

## Testing Strategy

**Unit Testing with Jest:**
- Test setup: `jest.config.js` with Next.js integration
- Coverage threshold: 70% for all metrics
- Test patterns: `__tests__/**/*.{js,jsx,ts,tsx}` and `*.{test,spec}.{js,jsx,ts,tsx}`
- Components, API endpoints, and utility functions covered
- Test environment: jsdom for React component testing

**E2E Testing with Playwright:**
- Tests in `tests/e2e/` directory
- Cross-browser testing (Chrome, Firefox, Safari, Mobile)
- Responsive design validation
- Performance and accessibility checks

**Key Test Areas:**
- Homepage functionality and responsiveness
- AI generator workflow and error states
- Navigation and page loading
- SEO metadata presence
- No hydration warnings or 404 errors
- Database operations and API endpoints

## Performance Considerations

**Optimization Features:**
- Next.js image optimization enabled
- Static asset optimization with proper caching
- Code splitting and lazy loading
- Web Vitals monitoring with reporting
- Bundle analysis available

**Core Web Vitals Targets:**
- LCP (Largest Contentful Paint): < 2.5s
- FID (First Input Delay): < 100ms  
- CLS (Cumulative Layout Shift): < 0.1

## Common Issues & Solutions

**Hydration Warnings:**
- All interactive components properly handle SSR/CSR differences
- Random number generation uses deterministic seeds where needed

**TypeScript Configuration:**
- Strict mode enabled
- Path mapping configured for clean imports
- Global type definitions in `types/global.d.ts`

**Animation Performance:**
- Framer Motion animations optimized for 60fps
- GPU acceleration used for transforms and opacity
- Reduced motion support for accessibility

## Database Development

**Schema Management:**
- Use `npm run db:migrate` for schema changes
- Always run `npm run db:generate` after schema updates
- Database seeding available with categorized fortune data
- Prisma Studio at `npm run db:studio` for database inspection

**Data Models:**
- **Fortune**: Core message data with SEO optimization fields
- **Analytics**: Performance monitoring with WebVital, ApiUsage models
- **User Tracking**: Session management and feedback collection
- **Error Logging**: Comprehensive error tracking and debugging

**Development Workflow:**
1. Modify `prisma/schema.prisma`
2. Run `npm run db:migrate` to apply changes
3. Run `npm run db:generate` to update Prisma client
4. Seed data with `npm run db:seed` if needed