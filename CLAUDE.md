# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Core Development
```bash
# Start development server
npm run dev

# Build for production
npm run build              # Includes Prisma generation
npm run start             # Start production server
npm run vercel-build      # Vercel optimized build

# Type checking and linting
npm run type-check         # TypeScript checking
npm run lint              # ESLint + Next.js linting

# Bundle analysis
npm run analyze           # Generate bundle analyzer report
```

### Database Commands
```bash
# Database operations
npm run db:generate       # Generate Prisma client
npm run db:push          # Push schema to database
npm run db:migrate       # Run database migrations
npm run db:studio        # Open Prisma Studio
npm run db:seed          # Seed database with sample data
npm run db:seed:clean    # Clean seed with data replacement
npm run db:seed:force    # Force seed with existing data overwrite
npm run db:validate      # Validate database schema and data
npm run db:reset         # Reset database and reseed
```

### Testing
```bash
# Unit and component tests
npm run test             # Run Jest tests
npm run test:watch       # Watch mode
npm run test:coverage    # Coverage report
npm run test:ci          # CI mode with coverage
npm run test:unit        # Run only unit tests
npm run test:api         # Run only API tests
npm run test:components  # Run only component tests
npm run test:lib         # Run only library tests

# E2E testing
npm run test:e2e         # Playwright tests
npm run test:e2e:ui      # With Playwright UI
npm run test:e2e:headed  # Run with browser visible
npm run test:e2e:debug   # Debug mode

# Deployment testing
npm run test:local       # Test local build
npm run test:deployment  # Test production deployment
npm run vercel-check     # Check Vercel deployment
npm run deploy-check     # Alias for vercel-check
```

## Architecture Overview

### Next.js 14 App Router Structure
- **App Router**: Modern file-based routing in `app/` directory
- **API Routes**: RESTful endpoints in `app/api/`
- **Prisma ORM**: Database management with PostgreSQL
- **TypeScript**: Full type safety throughout the application

### Key Components Architecture

#### AI Fortune Generation System
- **OpenRouter Integration**: AI-powered fortune generation with Claude 3 Haiku
- **Graceful Fallback**: Automatic fallback to local database when AI unavailable
- **Theme Support**: Multiple fortune themes (inspirational, funny, love, success, wisdom)
- **Custom Prompts**: User-defined generation prompts

#### Fortune Database System
- **500+ Messages**: Curated fortune collection in `lib/fortune-database.ts`
- **Prisma Schema**: Database models in `prisma/schema.prisma`
- **Search & Filter**: Advanced search and categorization functionality
- **Performance Monitoring**: Query optimization and performance tracking

#### Performance & Monitoring
- **Web Vitals v5**: Latest performance monitoring APIs
- **Error Tracking**: Error boundaries and console-based logging (no third-party service)
- **Performance Budgets**: Core Web Vitals optimization (LCP <2.5s, INP <200ms, CLS <0.1)
- **Database Optimization**: Connection pooling and query performance monitoring

### UI/UX Architecture
- **shadcn/ui**: Modern component library with Radix UI primitives
- **Framer Motion**: Advanced animations and transitions
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Accessibility**: WCAG compliance and keyboard navigation
- **Background Effects**: Dynamic gradients and particle systems

### SEO & Content Strategy
- **Structured Data**: JSON-LD schema markup for search engines
- **Dynamic Meta Tags**: Page-specific SEO optimization
- **Internal Linking**: Strategic content discovery paths
- **Multilingual Support**: Built-in i18n configuration
- **Sitemap Generation**: Automatic sitemap.xml generation

## Environment Variables

### Required
- `OPENROUTER_API_KEY`: AI service API key for fortune generation
- `DATABASE_URL`: PostgreSQL connection string
- `NEXT_PUBLIC_APP_URL`: Application base URL

### Optional  
- `GOOGLE_ANALYTICS_ID`: Google Analytics tracking ID
- `GOOGLE_VERIFICATION_CODE`: Search Console verification

- `UPSTASH_REDIS_REST_URL`: Redis cache URL for performance optimization
- `UPSTASH_REDIS_REST_TOKEN`: Redis authentication token

## Development Guidelines

### Code Organization Patterns
- **Components**: Reusable UI components in `components/`
- **UI Components**: shadcn/ui components in `components/ui/`
- **Utilities**: Shared utilities in `lib/`
- **API Logic**: Business logic in `app/api/` routes
- **Database**: Prisma schema and migrations in `prisma/`

### Database Schema Patterns
The application uses comprehensive database tracking with PostgreSQL and Prisma ORM:
- **Fortune Management**: Message storage with categorization, mood classification, and popularity tracking
- **User Sessions**: Anonymous session management with expiration handling  
- **Performance Metrics**: Web Vitals v5 monitoring and API usage analytics
- **Error Logging**: Comprehensive error tracking with stack traces and context
- **Analytics**: User interaction, feedback collection, and cache statistics
- **Indexing Strategy**: Optimized indexes for category, mood, popularity, and timestamp queries

### AI Integration Patterns
- **Theme-Based Generation**: Different AI prompts for various fortune themes
- **Fallback Strategy**: Graceful degradation when AI services unavailable
- **Performance Optimization**: Caching and rate limiting for API calls
- **Error Handling**: Robust error recovery and user feedback

### Testing Strategy
- **Unit Tests**: Component and utility testing with Jest
- **E2E Tests**: Cross-browser testing with Playwright
- **Performance Testing**: Web Vitals monitoring and optimization
- **Deployment Testing**: Automated pre-deployment validation

### Performance Optimization
- **Bundle Optimization**: Tree shaking and code splitting
- **Image Optimization**: Next.js Image component with WebP/AVIF
- **Caching**: Redis integration for API response caching
- **Database**: Query optimization and connection pooling
- **Monitoring**: Real-time performance tracking and alerting

## Important Implementation Details

### Hydration Warning Resolution
The application uses deterministic PRNG for random number generation to prevent SSR/CSR mismatches.

### Database Connection Management
Uses singleton pattern with connection pooling and automatic cleanup for optimal performance.

### Error Boundary Strategy
Comprehensive error boundaries with console logging; no external error monitoring service is used.

### SEO Implementation
- Dynamic metadata generation per page
- Structured data for rich snippets
- Optimized internal linking structure
- Mobile-first responsive design

When working on this codebase, prioritize:
1. Type safety and proper TypeScript usage
2. Performance optimization and Core Web Vitals
3. Accessibility and responsive design
4. Error handling and graceful degradation
5. SEO best practices and structured data