# Repository Guidelines

This Next.js app powers Fortune Cookie AI; use these guardrails to ship confidently.

## Project Structure & Module Organization
- `app/` hosts App Router routes, metadata, and server actions.
- `app/browse/category/[category]/` contains dynamic category pages for browsing fortunes by category.
- `app/api/auth/[...nextauth]/` implements NextAuth routes; `app/api/fortune/quota/` exposes quota status.
- `components/` houses shared Tailwind UI, while `lib/` centralizes utilities such as SEO helpers and rate limiting.
- `components/blog/` contains MDX blog components (`BlogCard.tsx`, `MDXComponents.tsx`).
- `content/blog/` stores MDX blog posts with frontmatter metadata.
- `prisma/` stores the schema and migrations; database seeding lives in `scripts/seed-database.ts`.
- `lib/auth.ts` and `lib/auth-client.ts` manage server/client auth helpers; `lib/quota.ts` tracks daily usage.
- Unit specs sit in `__tests__/`, Playwright journeys in `tests/e2e/`, and public assets in `public/`.

## Build, Test, and Development Commands
- `npm run dev` starts the Next.js dev server on http://localhost:3000 with hot reload.
- `npm run build` runs `prisma generate` then compiles; pair with `npm run analyze` for bundle stats.
- `npm run lint`, `npm run type-check`, and `npm run test` must pass before a PR; `npm run test:coverage` refreshes reports in `coverage/`.
- Playwright suites run through `npm run test:e2e`; use `npm run test:e2e:ui` or `npm run test:e2e:debug` for diagnosis.

## Coding Style & Naming Conventions
- Stick to TypeScript, React function components, and a 2-space indent that matches existing files.
- Component files use PascalCase (`components/FortuneCookie.tsx`), utility modules stay camelCase (`lib/seo.ts`).
- Tailwind classes should follow logical grouping (layout → spacing → color); rely on `clsx`/`cn` helpers instead of string concatenation.
- Run `npm run lint -- --fix` before pushing; resolve residual warnings flagged by `next/core-web-vitals` rules.

## Testing Guidelines
- Write Jest specs alongside the feature (`feature.test.tsx`) or inside `__tests__/`; prefer Testing Library assertions over implementation checks.
- Keep coverage steady by adding tests whenever you modify a module.
- End-to-end additions belong in `tests/e2e` with descriptive filenames (e.g., `fortune-download.spec.ts`); exercise new flows with Playwright smoke cases.

## Commit & Pull Request Guidelines
- Follow the conventional `type(optional-scope): subject` format in history (`feat: …`, `refactor(scope): …`, `i18n: …`); keep subjects imperative and under ~72 characters.
- Every PR needs a concise summary, linked issue or ticket, test commands run, and screenshots or recordings for UI changes.
- Call out `.env.local` updates whenever environment keys change.

## Configuration & Environment
- Copy `.env.example` to `.env.local` and supply Upstash, Prisma, and analytics keys before running seeds.
- Auth requires `NEXTAUTH_URL`, `NEXTAUTH_SECRET`, `GOOGLE_CLIENT_ID`, and `GOOGLE_CLIENT_SECRET`.
- Quota settings use `AUTH_DAILY_LIMIT` and `GUEST_DAILY_LIMIT` (UTC reset).
- Use `npm run db:migrate` for schema work, followed by `npm run db:seed` (or `db:seed:clean`) to refresh fixtures.

## Blog Feature
- Blog uses MDX files in `content/blog/` with frontmatter (title, description, date, author, tags, image, featured).
- Data layer: `lib/blog.ts` exports `getBlogPosts()`, `getPostBySlug()`, `getAllTags()`.
- Components: `components/blog/BlogCard.tsx`, `components/blog/MDXComponents.tsx`.
- Pages: `app/blog/page.tsx` (list), `app/blog/[slug]/page.tsx` (detail with SSG via `generateStaticParams`).
- SEO: Article JSON-LD structured data, Open Graph metadata, sitemap integration.

## IndexNow Integration
- **Purpose**: Instant notification to search engines when content is published, modified, or deleted.
- **API Key File**: `public/4f58cae8b6004a7a88e13474e58418e1.txt` - must exist for key verification.
- **Core Library**: `lib/indexnow.ts` - provides `submitUrl()`, `submitUrls()`, `submitUrlsToAllEngines()`, `notifyBlogPostUpdate()`, `notifyCategoryUpdate()`.
- **API Route**: `POST /api/indexnow` - requires authentication (admin token or signed-in user).
- **Actions**: `single` (one URL), `batch` (multiple URLs), `all_engines` (submit to Bing, Yandex, IndexNow API), `sitemap` (core pages).
- **Environment**: Set `INDEXNOW_HOST` and `INDEXNOW_ADMIN_TOKEN` in `.env.local`.

## Security & Accessibility
- **CSP Headers**: Dynamic nonce generated in `middleware.ts` for inline scripts; COOP, COEP, CORP headers configured for production security.
- **Auth CSP Exception**: `/api/auth/*` skips the `form-action` directive to allow OAuth POSTs.
- **Trusted Types**: Temporarily disabled due to Next.js 14 + Framer Motion incompatibility; see `middleware.ts` comments.
- **Accessibility**: All interactive buttons must include `aria-label` attributes; navigation toggle uses `aria-expanded` for screen reader support.
- **AdSense Optimization**: Use `OptimizedAdSense` component (Facade pattern) to defer AdSense loading and improve LCP.

## Known Issues
- **Blog Navigation**: Desktop navbar may not show Blog link due to Turbopack caching + `DynamicNavigation` (`ssr: false`). See `docs/blog-navigation-issue.md`. Workaround: access via Footer or `/blog` URL directly.
- **Turbopack HMR**: If component changes don't reflect, try `rm -rf .next node_modules/.cache && npm run dev`.
