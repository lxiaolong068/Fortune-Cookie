# Code Style & Conventions

## TypeScript
- **Strict Mode**: All code must compile with strict checks
- **noUncheckedIndexedAccess**: Enabled for safer array/object access
- **Path Aliases**: Use `@/` prefix (e.g., `@/lib/utils`, `@/components/ui`)

## Naming Conventions
- **Files**: kebab-case for components (`AIFortuneCookie.tsx`), kebab-case for utils
- **Variables/Functions**: camelCase
- **Types/Interfaces**: PascalCase
- **Constants**: UPPER_SNAKE_CASE

## React Patterns
- **Client Components**: Mark with `"use client"` directive
- **Server Components**: Default for SEO metadata and static generation
- **SSR/CSR Consistency**: Use deterministic PRNG for randomization (hydration safety)

## Error Handling
- Wrap async operations in try-catch
- Use `captureApiError` for API error tracking
- Graceful degradation (e.g., AI → pre-seeded fortunes)

## API Response Pattern
- Use `createSuccessResponse`/`createErrorResponse` envelope
- Include security headers (CORS, CSP, X-Frame-Options)
- Implement rate limiting where applicable

## Performance Targets
- LCP < 2.5s, INP < 200ms, CLS < 0.1
- API Response: < 500ms (cached), < 2s (AI generation)
