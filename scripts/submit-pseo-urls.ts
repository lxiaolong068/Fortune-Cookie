/**
 * Submit all new pSEO URLs to IndexNow for instant search engine indexing.
 * Run with: npx tsx scripts/submit-pseo-urls.ts
 */

import { getAllOccasionSlugs } from "../lib/pseo/occasions";
import { getAllQuoteSlugs } from "../lib/pseo/quotes";
import { getAllAudienceSlugs } from "../lib/pseo/audiences";
import { getAllActivitySlugs } from "../lib/pseo/activities";

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://www.fortune-cookie-ai.com";
const INDEXNOW_KEY = "4f58cae8b6004a7a88e13474e58418e1";
const INDEXNOW_ENDPOINT = "https://api.indexnow.org/indexnow";

function buildUrls(): string[] {
  const urls: string[] = [];

  // Hub pages
  urls.push(
    `${BASE_URL}/fortune-cookie-messages`,
    `${BASE_URL}/fortune-cookie-quotes`,
    `${BASE_URL}/fortune-cookie-messages-for`,
    `${BASE_URL}/fortune-cookie-ideas`,
  );

  // Template A — occasions
  for (const slug of getAllOccasionSlugs()) {
    urls.push(`${BASE_URL}/fortune-cookie-messages/${slug}`);
  }

  // Template B — quote categories
  for (const slug of getAllQuoteSlugs()) {
    urls.push(`${BASE_URL}/fortune-cookie-quotes/${slug}`);
  }

  // Template C — audiences
  for (const slug of getAllAudienceSlugs()) {
    urls.push(`${BASE_URL}/fortune-cookie-messages-for/${slug}`);
  }

  // Template D — activities
  for (const slug of getAllActivitySlugs()) {
    urls.push(`${BASE_URL}/fortune-cookie-ideas/${slug}`);
  }

  return urls;
}

async function submitUrls(urls: string[]): Promise<void> {
  const host = new URL(BASE_URL).hostname;

  const payload = {
    host,
    key: INDEXNOW_KEY,
    keyLocation: `${BASE_URL}/${INDEXNOW_KEY}.txt`,
    urlList: urls,
  };

  console.log(`\nSubmitting ${urls.length} URLs to IndexNow...`);

  const response = await fetch(INDEXNOW_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify(payload),
  });

  if (response.ok || response.status === 202) {
    console.log(`✅ IndexNow accepted ${urls.length} URLs (status ${response.status})`);
  } else {
    const body = await response.text();
    console.error(`❌ IndexNow error ${response.status}: ${body}`);
  }
}

async function main() {
  const urls = buildUrls();

  console.log("pSEO URLs to submit:");
  urls.forEach((u) => console.log(`  ${u}`));

  // IndexNow supports up to 10,000 URLs per request — submit all at once
  await submitUrls(urls);

  console.log("\nDone.");
}

main().catch(console.error);
