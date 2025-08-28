# Repository Guidelines

## Project Structure & Module Organization
- `app/`: Next.js 14 App Router (routes, `api/`, `layout.tsx`, `globals.css`).
- `components/`: Shared React components (UI primitives in `components/ui`).
- `lib/`: Utilities and clients (e.g., `lib/openrouter.ts`, SEO helpers, data utils).
- `prisma/`: `schema.prisma`, `migrations/`, and local dev DB; manage schema with Prisma.
- `public/`: Static assets (icons, images, og/twitter images).
- `__tests__/` and `*.{test,spec}.ts(x)`: Unit/integration tests; `tests/e2e/`: Playwright specs.
- `scripts/`: Tooling (deployment checks, seeding) and DX helpers.

## Build, Test, and Development Commands
- `npm run dev`: Start local dev server at `http://localhost:3000`.
- `npm run build`: Generate Prisma client then build Next.js.
- `npm start`: Run the production server.
- `npm run lint` / `npm run type-check`: ESLint and TypeScript checks.
- `npm test` / `npm run test:coverage`: Jest tests and coverage.
- `npm run test:e2e` (`:ui`, `:headed`, `:debug`): Playwright E2E.
- `npm run db:push` | `db:migrate` | `db:seed` | `db:reset` | `db:studio`: Prisma workflow.

## Coding Style & Naming Conventions
- **Languages**: TypeScript + React 18; Next.js App Router.
- **Linting**: Follow project ESLint rules via `next lint`; fix warnings before PR.
- **Components**: PascalCase files (e.g., `components/FortuneCookie.tsx`). Hooks/utilities use camelCase.
- **Routes**: Kebab-case segment folders in `app/` (e.g., `app/funny-fortune-cookie-messages/`).
- **Tests**: Name as `*.test.tsx` or `*.spec.tsx`; colocate or under `__tests__/`.
- **Styles**: Tailwind CSS utilities; prefer composition over deep custom CSS.

## Testing Guidelines
- **Frameworks**: Jest + Testing Library (jsdom) for unit/integration; Playwright for E2E.
- **Coverage**: Global threshold 70% (branches, functions, lines, statements) enforced by `jest.config.js`.
- **Locations**: `__tests__/` or colocated specs; avoid testing implementation details.
- **Commands**: `npm test`, `npm run test:unit`, `npm run test:e2e` (use `:ui` to debug).

## Commit & Pull Request Guidelines
- **Commits**: Use Conventional Commits (e.g., `feat: add generator presets`, `fix(build): resolve TS errors`).
- **Branches**: `feat/<scope>`, `fix/<scope>`, `chore/<scope>`.
- **PRs**: Include clear description, linked issues, and screenshots for UI changes. Ensure `lint`, `type-check`, unit, and E2E tests pass; update docs when behavior changes.

## Security & Configuration Tips
- **Env files**: Do not commit secrets. Copy `.env.example` to `.env.local`; set required keys (e.g., `OPENROUTER_API_KEY`, `NEXT_PUBLIC_APP_URL`).
- **Database**: Run `npm run db:push` (or `db:migrate`) after schema changes; seed with `npm run db:seed` when needed.
