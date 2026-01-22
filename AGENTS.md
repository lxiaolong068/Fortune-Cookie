# Repository Guidelines

## Project Structure & Module Organization
This is a Next.js 14 (App Router) TypeScript app. Key paths:

- `app/`: routes, API handlers, metadata (`layout.tsx`, `page.tsx`, `sitemap.ts`, `robots.ts`).
- `components/`: UI and feature components (includes `components/ui/` for shadcn/ui).
- `lib/`: shared utilities, API clients, and data helpers.
- `content/` and `docs/`: content and documentation sources.
- `public/`: static assets (images, icons, OG image).
- `prisma/`: schema and migrations.
- `__tests__/` and `tests/e2e/`: unit/integration tests and Playwright E2E tests.
- `scripts/`: deployment and database utilities.
- `task_plan.md`, `progress.md`, `findings.md`: planning logs and execution notes.

## Build, Test, and Development Commands
Common commands (from `package.json`):

```bash
npm run dev          # local dev server at http://localhost:3000
npm run build        # prisma generate + Next.js production build
npm run start        # serve the production build
npm run lint         # Next.js ESLint rules
npm run type-check   # TypeScript type checking
npm run test         # Jest unit/integration tests
npm run test:coverage # Jest with coverage thresholds
npm run test:e2e     # Playwright E2E suite
```

Database helpers (Prisma):
`npm run db:push`, `npm run db:migrate`, `npm run db:seed`.

## Coding Style & Naming Conventions
- TypeScript-first; follow existing patterns in `app/`, `components/`, and `lib/`.
- Linting via `next/core-web-vitals` and `next/typescript`; avoid `any` and unused vars.
- Use `@/` aliases for root imports (see Jest module mapping).
- Naming: `PascalCase` for React components, `camelCase` for functions/variables.
- Styling uses Tailwind CSS; keep utility classes consistent with nearby code.

## Testing Guidelines
- Jest tests live in `__tests__/` or alongside code as `*.test.ts(x)` / `*.spec.ts(x)`.
- Coverage thresholds are enforced at 70% globally.
- Playwright E2E tests are in `tests/e2e/` and run against `http://localhost:3000`.

## Commit & Pull Request Guidelines
- Commit history follows Conventional Commits (e.g., `feat(messages): add filters`).
- Include a concise summary and scope when relevant.
- PRs should include: summary, testing notes (commands run), and screenshots for UI changes.

## Security & Configuration Tips
- Configure secrets via `.env.local` (e.g., `OPENROUTER_API_KEY`, analytics IDs).
- Never commit credentials; use sample env files where available.

## Current Project Status (2026-01-12)
- **Focus:** FortuneCookie messages doc update + UI parity for messages pages.
- **Phase:** Phase 4 (Testing & Verification) — see `task_plan.md` and `progress.md`.
- **Recent changes:** length/style badges in cards and search results, always-visible actions, lucky number copy tip, category totals + ISO updated dates, tags passed into generator flows, JSON-LD enrichment, copy success feedback.
- **Open items:** verify doc scope against source files, validate category totals/ISO dates + JSON-LD output, confirm missing doc file name/path, confirm language preference for doc updates.
