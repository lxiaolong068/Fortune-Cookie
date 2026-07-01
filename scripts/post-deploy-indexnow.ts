#!/usr/bin/env tsx

/**
 * Post-deploy IndexNow notification
 *
 * Runs after `next build` (via the postbuild npm hook). Submits the site's
 * core URLs to IndexNow so that Bing / Yandex / IndexNow.org-aware engines
 * pick up changes faster than waiting for their next sitemap crawl.
 *
 * Behavior:
 *   - Only runs on Vercel production deploys (VERCEL_ENV === "production").
 *     Skips local builds and preview deploys.
 *   - Submits a fixed list of CORE_URLS on every deploy so that homepage /
 *     listing freshness signals reach search engines.
 *   - Never fails the build: all errors are caught and logged.
 *
 * Manual overrides:
 *   INDEXNOW_DISABLE=true   - skip submission entirely
 *   INDEXNOW_FORCE=1        - run even outside Vercel (useful for testing)
 *   INDEXNOW_DRY_RUN=1      - print URLs that would be submitted, then exit
 *                             (no network call; pairs well with INDEXNOW_FORCE)
 */

import { submitUrlsToAllEngines, INDEXNOW_CONFIG } from "../lib/indexnow";

// Keep in sync with app/sitemap.ts — only currently-existing, indexable routes.
const CORE_URLS = ["/", "/generator", "/about", "/cookies", "/privacy", "/terms"];

interface Decision {
  run: boolean;
  reason: string;
}

function shouldRun(): Decision {
  if (process.env.INDEXNOW_DISABLE === "true") {
    return { run: false, reason: "INDEXNOW_DISABLE=true" };
  }
  if (process.env.INDEXNOW_FORCE === "1") {
    return { run: true, reason: "INDEXNOW_FORCE=1 (manual override)" };
  }
  const vercelEnv = process.env.VERCEL_ENV;
  if (!vercelEnv) {
    return {
      run: false,
      reason: "Not on Vercel (set INDEXNOW_FORCE=1 to override)",
    };
  }
  if (vercelEnv !== "production") {
    return { run: false, reason: `VERCEL_ENV=${vercelEnv} (not production)` };
  }
  return { run: true, reason: "Vercel production deploy" };
}

async function main(): Promise<void> {
  const decision = shouldRun();
  if (!decision.run) {
    console.log(`[IndexNow] Skipping: ${decision.reason}`);
    return;
  }
  console.log(`[IndexNow] Running: ${decision.reason}`);

  const baseUrl = `https://${INDEXNOW_CONFIG.host}`;
  const fullUrls = CORE_URLS.map((p) => `${baseUrl}${p}`);

  console.log(`[IndexNow] Submitting ${fullUrls.length} core URLs.`);

  if (process.env.INDEXNOW_DRY_RUN === "1") {
    console.log("[IndexNow] DRY RUN — URLs that would be submitted:");
    for (const url of fullUrls) {
      console.log(`  ${url}`);
    }
    return;
  }

  const result = await submitUrlsToAllEngines(fullUrls);
  console.log(
    `[IndexNow] ${result.successCount}/${result.results.length} engines accepted the submission.`,
  );
  for (const r of result.results) {
    console.log(`  - ${r.endpoint}: ${r.statusCode} ${r.message}`);
  }
}

main().catch((error) => {
  console.error("[IndexNow] Unexpected error (non-fatal):", error);
  // Always exit 0 so this script never fails the deploy.
  process.exit(0);
});
