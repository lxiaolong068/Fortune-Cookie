# Repository Guidelines

This Next.js app powers Fortune Cookie AI; use these guardrails to ship confidently.

## Project Structure & Module Organization
- `app/` hosts App Router routes, metadata, and server actions.
- `components/` houses shared Tailwind UI, while `lib/` centralizes utilities such as SEO helpers and rate limiting.
- `prisma/` stores the schema and migrations; database seeding lives in `scripts/seed-database.ts`.
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
- Use `npm run db:migrate` for schema work, followed by `npm run db:seed` (or `db:seed:clean`) to refresh fixtures.
