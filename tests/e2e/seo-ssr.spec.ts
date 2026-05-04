import { test, expect, type APIRequestContext } from "@playwright/test";

/**
 * SSR-rendered SEO regressions
 *
 * Catches the class of bug where critical SEO markup (H1, og:url, canonical)
 * is missing from the server-rendered HTML because a parent component is
 * loaded with `dynamic({ ssr: false })`.
 *
 * Production once shipped a homepage where the H1 was wrapped in
 * <ScrollReveal> (a client-only component), so `curl /` returned zero <h1>
 * tags. Existing Playwright tests passed because the client-side hydration
 * eventually injected the H1 — but Google's static crawler never sees that.
 *
 * These tests use raw fetch (no JS execution) and assert markup is in the
 * initial HTML response.
 */

interface PageCheck {
  path: string;
  expectedH1Pattern: RegExp;
}

const PAGES: PageCheck[] = [
  { path: "/", expectedH1Pattern: /Fortune Cookie/i },
  { path: "/generator", expectedH1Pattern: /Generator|Fortune/i },
  { path: "/blog", expectedH1Pattern: /Blog|Fortune/i },
  { path: "/explore", expectedH1Pattern: /Browse|Fortune|Explore/i },
  { path: "/recipes", expectedH1Pattern: /Recipe|Fortune Cookie/i },
  { path: "/how-to-make-fortune-cookies", expectedH1Pattern: /Fortune Cookies/i },
  { path: "/about", expectedH1Pattern: /About|Fortune Cookie AI/i },
  { path: "/privacy", expectedH1Pattern: /Privacy/i },
  { path: "/terms", expectedH1Pattern: /Terms/i },
  { path: "/cookies", expectedH1Pattern: /Cookie/i },
];

async function fetchHtml(
  request: APIRequestContext,
  path: string,
): Promise<string> {
  const response = await request.get(path);
  expect(response.ok(), `${path} should respond 2xx`).toBeTruthy();
  return await response.text();
}

function countMatches(html: string, pattern: RegExp): number {
  const matches = html.match(pattern);
  return matches ? matches.length : 0;
}

test.describe("SSR SEO regressions", () => {
  for (const page of PAGES) {
    test(`${page.path} has exactly one server-rendered <h1>`, async ({
      request,
    }) => {
      const html = await fetchHtml(request, page.path);
      const h1Count = countMatches(html, /<h1[\s>]/g);
      expect(
        h1Count,
        `${page.path} must have exactly one <h1> in raw SSR HTML (found ${h1Count}). If a *PageContent component renders the H1, it must NOT be wrapped in dynamic({ ssr: false }).`,
      ).toBe(1);
    });

    test(`${page.path} H1 contains expected keywords`, async ({ request }) => {
      const html = await fetchHtml(request, page.path);
      const h1Match = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/);
      expect(h1Match, `${page.path} should contain a <h1> tag`).not.toBeNull();
      const h1Text = (h1Match?.[1] ?? "").replace(/<[^>]*>/g, "").trim();
      expect(h1Text).toMatch(page.expectedH1Pattern);
    });
  }

  test("og:url uses the canonical www. host across audited pages", async ({
    request,
  }) => {
    const auditedPaths = ["/", "/privacy", "/cookies", "/about", "/terms"];
    for (const path of auditedPaths) {
      const html = await fetchHtml(request, path);
      const ogUrlMatch = html.match(
        /<meta[^>]+property=["']og:url["'][^>]+content=["']([^"']+)["']/i,
      );
      expect(ogUrlMatch, `${path} should declare og:url`).not.toBeNull();
      const ogUrl = ogUrlMatch?.[1] ?? "";
      expect(
        ogUrl,
        `${path}: og:url must point to the canonical www. host (got ${ogUrl})`,
      ).not.toMatch(/fortune-cookie\.cc/);
      expect(ogUrl).toMatch(/^https:\/\/www\.fortunecookie\.vip/);
    }
  });

  test("canonical link is present on indexable pages", async ({ request }) => {
    const indexablePaths = ["/", "/generator", "/blog", "/explore", "/recipes"];
    for (const path of indexablePaths) {
      const html = await fetchHtml(request, path);
      expect(
        html,
        `${path} should declare a <link rel="canonical">`,
      ).toMatch(/<link[^>]+rel=["']canonical["']/);
    }
  });
});
