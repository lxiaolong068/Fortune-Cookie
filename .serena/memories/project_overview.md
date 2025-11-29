# Fortune Cookie AI - Project Overview

## Purpose
SEO-optimized, AI-powered fortune cookie generator built with Next.js 14 App Router.

## Tech Stack
- **Framework**: Next.js 14 (App Router), TypeScript, React 18
- **Database**: PostgreSQL with Prisma ORM
- **Caching**: Redis (Upstash) for distributed caching and rate limiting
- **AI**: OpenRouter API (Claude 3 Haiku model)
- **UI**: shadcn/ui, Radix UI, Framer Motion, Tailwind CSS
- **Testing**: Jest (unit), Playwright (E2E)

## Key Features
- 500+ pre-categorized fortune messages
- AI generation via OpenRouter API with fallback chain
- 3-tier caching (Edge, Redis, Database)
- Full SEO with structured data, sitemap, Open Graph
- Performance monitoring with Web Vitals
- Rate limiting and input sanitization

## Directory Structure
```
app/           - Next.js App Router pages and API routes
components/    - React components (UI, features)
lib/           - Core business logic, utilities, services
prisma/        - Database schema and migrations
tests/         - E2E tests (Playwright)
__tests__/     - Unit tests (Jest)
scripts/       - Utility scripts (seed, deploy checks)
content/       - MDX blog content
public/        - Static assets
```

## Architecture
- **Data Flow**: Client → Middleware (rate limit) → API → Cache → AI/DB
- **Caching**: Edge headers → Redis (5min TTL) → Database
- **AI Fallback**: OpenRouter → Pre-seeded fortunes → Graceful degradation
