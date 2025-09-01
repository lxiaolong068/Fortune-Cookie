# Repository Guidelines

## Project Structure & Module Organization
- `app/`: Next.js 14 App Router (routes, `api/`, `layout.tsx`, `globals.css`).
- `components/`: Shared React components; UI primitives in `components/ui`.
- `lib/`: Utilities and clients (e.g., `lib/openrouter.ts`, SEO helpers).
- `prisma/`: `schema.prisma`, migrations, and local dev DB.
- `public/`: Static assets (icons, images, og/twitter images).
- `__tests__/`, `*.{test,spec}.ts(x)`: Unit/integration; `tests/e2e/`: Playwright.
- `scripts/`: Tooling (deployment checks, seeding) and DX helpers.

## Build, Test, and Development Commands
- `npm run dev`: Start local server at `http://localhost:3000`.
- `npm run build`: Generate Prisma client, then build Next.js.
- `npm start`: Run production server.
- `npm run lint` / `npm run type-check`: ESLint and TypeScript checks.
- `npm test` / `npm run test:coverage`: Jest unit/integration and coverage.
- `npm run test:e2e` (`:ui`, `:headed`, `:debug`): Playwright E2E variants.
- Prisma: `npm run db:push | db:migrate | db:seed | db:reset | db:studio`.

## Coding Style & Naming Conventions
- Languages: TypeScript + React 18; Next.js App Router.
- Linting: `next lint` with project rules; fix warnings before PR.
- Components: PascalCase files (e.g., `components/FortuneCookie.tsx`).
- Hooks/utilities: camelCase (e.g., `useFortune()`, `formatSeoMeta`).
- Routes: kebab-case folders under `app/` (e.g., `app/funny-fortune-cookie-messages/`).
- Styles: Tailwind CSS; prefer utility composition over deep custom CSS.

## Testing Guidelines
- Frameworks: Jest + Testing Library (jsdom) for unit/integration; Playwright for E2E.
- Coverage: Global threshold 70% (branches, functions, lines, statements) via `jest.config.js`.
- Naming: `*.test.tsx` or `*.spec.ts(x)` colocated or in `__tests__/`.
- Run: `npm test`, `npm run test:unit`, `npm run test:e2e` (use `:ui` to debug).

## Commit & Pull Request Guidelines
- Commits: Conventional Commits (e.g., `feat: add generator presets`, `fix(build): resolve TS errors`).
- Branches: `feat/<scope>`, `fix/<scope>`, `chore/<scope>`.
- PRs: Clear description, linked issues, and screenshots for UI changes. Ensure lint, type-check, unit, and E2E tests pass; update docs when behavior changes.

## Security & Configuration Tips
- Env: Do not commit secrets. Copy `.env.example` to `.env.local`; set `OPENROUTER_API_KEY`, `NEXT_PUBLIC_APP_URL`.
- Database: After schema changes, run `npm run db:push` or `db:migrate`; seed with `npm run db:seed`.
