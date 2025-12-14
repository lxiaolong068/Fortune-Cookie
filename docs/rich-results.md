# Google Rich Results (Structured Data)

This project uses JSON-LD structured data to improve Google Search appearance (rich results) while keeping runtime overhead minimal.

## Implemented schema types

Global (in `app/layout.tsx`):
- `WebSite` with `SearchAction` (`/search?q={search_term_string}`) for the sitelinks search box
- `Organization` for brand identity (name, logo, socials)

Page-level:
- `BreadcrumbList` for key routes (blog list, blog post, search, and other content pages)
- `Article` for blog posts and long-form informational pages
- `FAQPage` for FAQ sections on content pages
- `HowTo` for tutorial-style pages (e.g. `/how-to-make-fortune-cookies`)
- `Recipe` (within an `ItemList`) for `/recipes`
- `ItemList` for list/browse style pages

## Where the JSON-LD lives

- Core helpers: `components/StructuredData.tsx`
- FAQ JSON-LD: `components/FAQStructuredData.tsx`
- Search page used by `SearchAction`: `app/search/page.tsx`

## Validation

1. Deploy (or run locally) with a valid `NEXT_PUBLIC_APP_URL`.
2. Validate URLs with Google Rich Results Test:
   - https://search.google.com/test/rich-results
3. Validate schema details in Schema Markup Validator (optional):
   - https://validator.schema.org/

## Notes

- The `WebSite` `SearchAction` must point to a real, user-facing results page (implemented at `/search`).
- Keep all schema `name`/`description`/`headline` values in English to match the site's primary language.

