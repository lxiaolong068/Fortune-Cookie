# Task Completion Checklist

## Before Committing Code
1. ✅ Run `npm run type-check` - All types must resolve
2. ✅ Run `npm run lint` - No errors (warnings acceptable)
3. ✅ Run `npm run test:ci` - Tests pass, coverage ≥70%
4. ✅ Run `npm run build` - Build succeeds

## For Database Changes
1. Edit `prisma/schema.prisma`
2. Run `npm run db:generate` - Regenerate Prisma Client
3. Run `npm run db:push` or `npm run db:migrate`

## For New API Routes
1. Implement rate limiting (if Redis available)
2. Validate and sanitize inputs
3. Check cache before expensive operations
4. Return consistent API response envelope
5. Add security headers

## For New Components
1. Use `"use client"` if interactive
2. Follow shadcn/ui patterns where applicable
3. Ensure SSR/CSR consistency (no hydration mismatches)
4. Test accessibility (keyboard navigation, ARIA)
