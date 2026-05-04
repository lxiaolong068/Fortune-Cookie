#!/usr/bin/env tsx

/**
 * Post-deploy IndexNow notification
 *
 * Runs after `next build` (via the postbuild npm hook). Submits recently
 * published blog posts and a small set of core URLs to IndexNow so that
 * Bing / Yandex / IndexNow.org-aware engines pick up changes faster than
 * waiting for their next sitemap crawl.
 *
 * Behavior:
 *   - Only runs on Vercel production deploys (VERCEL_ENV === "production").
 *     Skips local builds and preview deploys.
 *   - Reads content/blog/{en,zh,es,pt}/*.mdx, filters to posts with a
 *     frontmatter `date` within the last RECENCY_DAYS days.
 *   - Always submits a fixed list of CORE_URLS (homepage, blog index,
 *     explore, generator, recipes) so that homepage/listing freshness signals
 *     reach search engines on every deploy.
 *   - Never fails the build: all errors are caught and logged.
 *
 * Manual overrides:
 *   INDEXNOW_DISABLE=true   - skip submission entirely
 *   INDEXNOW_FORCE=1        - run even outside Vercel (useful for testing)
 *   INDEXNOW_DRY_RUN=1      - print URLs that would be submitted, then exit
 *                             (no network call; pairs well with INDEXNOW_FORCE)
 */

import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { submitUrlsToAllEngines, INDEXNOW_CONFIG } from "../lib/indexnow";

const RECENCY_DAYS = 30;
const LOCALES = ["en", "zh", "es", "pt"] as const;
type Locale = (typeof LOCALES)[number];
const DEFAULT_LOCALE: Locale = "en";

const CORE_URLS = ["/", "/blog", "/explore", "/generator", "/recipes"];

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

function getRecentBlogPaths(): string[] {
  const cutoff = Date.now() - RECENCY_DAYS * 24 * 60 * 60 * 1000;
  const paths: string[] = [];

  for (const locale of LOCALES) {
    const dir = path.join(process.cwd(), "content/blog", locale);
    if (!fs.existsSync(dir)) continue;

    let files: string[];
    try {
      files = fs.readdirSync(dir).filter((f) => /\.mdx?$/.test(f));
    } catch (err) {
      console.warn(`[IndexNow] Could not read ${dir}:`, err);
      continue;
    }

    for (const file of files) {
      const filePath = path.join(dir, file);
      try {
        const { data } = matter(fs.readFileSync(filePath, "utf-8"));
        if (!data.date) continue;

        const postDate = new Date(data.date).getTime();
        if (Number.isNaN(postDate)) continue;
        if (postDate < cutoff) continue;

        const slug = file.replace(/\.mdx?$/, "");
        const urlPath =
          locale === DEFAULT_LOCALE
            ? `/blog/${slug}`
            : `/${locale}/blog/${slug}`;
        paths.push(urlPath);
      } catch (err) {
        console.warn(`[IndexNow] Could not parse ${filePath}:`, err);
      }
    }
  }

  return paths;
}

async function main(): Promise<void> {
  const decision = shouldRun();
  if (!decision.run) {
    console.log(`[IndexNow] Skipping: ${decision.reason}`);
    return;
  }
  console.log(`[IndexNow] Running: ${decision.reason}`);

  const blogPaths = getRecentBlogPaths();
  const allPaths = Array.from(new Set([...CORE_URLS, ...blogPaths]));

  const baseUrl = `https://${INDEXNOW_CONFIG.host}`;
  const fullUrls = allPaths.map((p) => `${baseUrl}${p}`);

  console.log(
    `[IndexNow] Submitting ${fullUrls.length} URLs (${blogPaths.length} recent posts + ${CORE_URLS.length} core).`,
  );

  if (fullUrls.length === 0) {
    console.log("[IndexNow] No URLs to submit, exiting.");
    return;
  }

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
