#!/usr/bin/env node

/**
 * Download Unsplash images for new blog posts
 * Uses the Unsplash API to search and download relevant hero images
 */

const fs = require("fs");
const path = require("path");
const https = require("https");

// Load config
const configPath = path.join(__dirname, "..", "unsplash.config.json");
const config = JSON.parse(fs.readFileSync(configPath, "utf8"));
const ACCESS_KEY = config.accessKey;

// Blog posts that need images
const blogPosts = [
  {
    slug: "daily-affirmations-micro-habits-2025",
    filename: "daily-affirmations-micro-habits-2025-hero.jpg",
    searchQuery: "morning coffee meditation wellness routine",
    fallbackQuery: "sunrise morning peaceful",
  },
  {
    slug: "learn-english-idioms-fortune-cookies",
    filename: "learn-english-idioms-fortune-cookies-hero.jpg",
    searchQuery: "books learning study english",
    fallbackQuery: "education reading notebook",
  },
  {
    slug: "romantic-fortune-cookie-messages",
    filename: "romantic-fortune-cookie-messages-hero.jpg",
    searchQuery: "love letter romantic hearts",
    fallbackQuery: "couple romance date",
  },
  {
    slug: "virtual-team-ice-breakers-fortune-cookies",
    filename: "virtual-team-ice-breakers-fortune-cookies-hero.jpg",
    searchQuery: "remote work video call team meeting",
    fallbackQuery: "laptop work from home office",
  },
  {
    slug: "instagram-fortune-cookie-captions",
    filename: "instagram-fortune-cookie-captions-hero.jpg",
    searchQuery: "social media phone instagram aesthetic",
    fallbackQuery: "smartphone photography content",
  },
  {
    slug: "ai-fortune-writing-prompts",
    filename: "ai-fortune-writing-prompts-hero.jpg",
    searchQuery: "writing creative typewriter notebook",
    fallbackQuery: "pen paper journal creative",
  },
  {
    slug: "virtual-party-fortune-cookies-2025",
    filename: "virtual-party-fortune-cookies-2025-hero.jpg",
    searchQuery: "celebration party confetti festive",
    fallbackQuery: "new year celebration virtual",
  },
  // New articles - December 2024
  {
    slug: "overcoming-decision-fatigue-ai-fortune-cookies",
    filename: "decision-fatigue-hero.jpg",
    searchQuery: "decision making overwhelmed choices productivity",
    fallbackQuery: "mental clarity focus thinking",
  },
  {
    slug: "wedding-fortune-cookie-messages-guide-2025",
    filename: "wedding-fortune-cookies-hero.jpg",
    searchQuery: "wedding favors table setting elegant celebration",
    fallbackQuery: "wedding reception romantic dinner",
  },
  {
    slug: "american-cultural-values-fortune-cookie-phrases",
    filename: "american-cultural-values-hero.jpg",
    searchQuery: "american culture diversity statue liberty",
    fallbackQuery: "usa patriotic culture melting pot",
  },
  // New articles - January 2026
  {
    slug: "manifestation-ai-fortune-cookies-2026-goals",
    filename: "manifestation-ai-fortunes-hero.jpg",
    searchQuery: "manifestation vision board goals meditation spiritual",
    fallbackQuery: "meditation mindfulness goal setting journal",
  },
  {
    slug: "british-vs-american-fortune-cookie-culture",
    filename: "british-american-fortune-cookies-hero.jpg",
    searchQuery: "british american flags culture comparison",
    fallbackQuery: "london new york culture travel",
  },
  {
    slug: "future-of-fortune-cookies-ar-vr-tech",
    filename: "ar-fortune-cookies-future-hero.jpg",
    searchQuery: "augmented reality vr headset futuristic technology",
    fallbackQuery: "virtual reality future tech innovation",
  },
];

const outputDir = path.join(__dirname, "..", "public", "images", "blog");
const attributionPath = path.join(outputDir, "attribution.json");

// Ensure output directory exists
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Load existing attribution
let attributions = [];
if (fs.existsSync(attributionPath)) {
  attributions = JSON.parse(fs.readFileSync(attributionPath, "utf8"));
}

function fetchJSON(url) {
  return new Promise((resolve, reject) => {
    https
      .get(
        url,
        {
          headers: {
            Authorization: `Client-ID ${ACCESS_KEY}`,
            "Accept-Version": "v1",
          },
        },
        (res) => {
          let data = "";
          res.on("data", (chunk) => (data += chunk));
          res.on("end", () => {
            try {
              resolve(JSON.parse(data));
            } catch (e) {
              reject(
                new Error(`Failed to parse JSON: ${data.substring(0, 200)}`),
              );
            }
          });
        },
      )
      .on("error", reject);
  });
}

function downloadImage(url, filepath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(filepath);
    https
      .get(url, (response) => {
        // Handle redirects
        if (response.statusCode === 301 || response.statusCode === 302) {
          https
            .get(response.headers.location, (redirectResponse) => {
              redirectResponse.pipe(file);
              file.on("finish", () => {
                file.close();
                resolve();
              });
            })
            .on("error", reject);
        } else {
          response.pipe(file);
          file.on("finish", () => {
            file.close();
            resolve();
          });
        }
      })
      .on("error", reject);
  });
}

async function searchAndDownload(post) {
  console.log(`\n🔍 Searching for: "${post.searchQuery}" (${post.slug})`);

  const filepath = path.join(outputDir, post.filename);

  // Check if already exists
  if (fs.existsSync(filepath)) {
    console.log(`  ⏭️  Already exists: ${post.filename}`);
    return null;
  }

  try {
    // Search Unsplash
    const searchUrl = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(post.searchQuery)}&per_page=5&orientation=landscape`;
    const searchResult = await fetchJSON(searchUrl);

    if (!searchResult.results || searchResult.results.length === 0) {
      console.log(`  ⚠️  No results, trying fallback: "${post.fallbackQuery}"`);
      const fallbackUrl = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(post.fallbackQuery)}&per_page=5&orientation=landscape`;
      const fallbackResult = await fetchJSON(fallbackUrl);

      if (!fallbackResult.results || fallbackResult.results.length === 0) {
        console.log(`  ❌ No images found for ${post.slug}`);
        return null;
      }
      searchResult.results = fallbackResult.results;
    }

    // Pick the first result
    const photo = searchResult.results[0];
    console.log(
      `  📸 Found: "${photo.description || photo.alt_description || "Untitled"}" by ${photo.user.name}`,
    );

    // Download the image (regular size, ~1080px width)
    const imageUrl = photo.urls.regular;
    console.log(`  ⬇️  Downloading...`);
    await downloadImage(imageUrl, filepath);

    // Track download for Unsplash guidelines
    const trackUrl = `https://api.unsplash.com/photos/${photo.id}/download`;
    await fetchJSON(trackUrl).catch(() => {}); // Best effort tracking

    console.log(`  ✅ Saved: ${post.filename}`);

    // Return attribution info
    return {
      slug: post.slug,
      filename: post.filename,
      photoId: photo.id,
      photographer: photo.user.name,
      photographerUrl: photo.user.links.html,
    };
  } catch (error) {
    console.error(`  ❌ Error: ${error.message}`);
    return null;
  }
}

async function main() {
  console.log("🥠 Fortune Cookie Blog Image Downloader");
  console.log("========================================");
  console.log(`Output directory: ${outputDir}`);

  const newAttributions = [];

  for (const post of blogPosts) {
    const attribution = await searchAndDownload(post);
    if (attribution) {
      newAttributions.push(attribution);
    }
    // Rate limiting - wait 1 second between requests
    await new Promise((r) => setTimeout(r, 1000));
  }

  if (newAttributions.length > 0) {
    // Merge with existing attributions
    const existingSlugs = new Set(attributions.map((a) => a.slug));
    for (const attr of newAttributions) {
      if (!existingSlugs.has(attr.slug)) {
        attributions.push(attr);
      }
    }

    // Save updated attributions
    fs.writeFileSync(attributionPath, JSON.stringify(attributions, null, 2));
    console.log(`\n📝 Updated ${attributionPath}`);
  }

  console.log("\n========================================");
  console.log(`✅ Done! Downloaded ${newAttributions.length} new images.`);
}

main().catch(console.error);
