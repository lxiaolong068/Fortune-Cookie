# Suggested Commands

## Development
```bash
npm run dev              # Start dev server (localhost:3000)
npm run build            # Production build (includes type-check + Prisma)
npm start                # Start production server
```

## Type Checking & Linting
```bash
npm run type-check       # TypeScript type checking
npm run lint             # ESLint
```

## Database (Prisma)
```bash
npm run db:generate      # Generate Prisma Client
npm run db:push          # Push schema to database
npm run db:migrate       # Run migrations
npm run db:studio        # Open Prisma Studio GUI
npm run db:seed          # Seed database with fortunes
npm run db:reset         # Reset and re-seed
```

## Testing
```bash
npm test                 # Jest unit tests
npm run test:ci          # CI mode with coverage
npm run test:e2e         # Playwright E2E tests
npm run test:e2e:ui      # Playwright with UI
npm run test:local       # Test localhost deployment
npm run test:deployment  # Test production deployment
```

## Pre-Commit Checklist
1. `npm run type-check` - Must pass
2. `npm run lint` - Must pass
3. `npm run test:ci` - Coverage ≥70%
4. `npm run build` - Must succeed
