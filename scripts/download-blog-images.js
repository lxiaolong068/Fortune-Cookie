/**
 * Script to download blog hero images from Unsplash
 * Run: node scripts/download-blog-images.js
 */

import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.join(__dirname, "..");

// Blog posts configuration
const blogImages = [
  {
    slug: "ai-fortune-telling-trends-2025",
    query: "AI technology crystal ball futuristic",
    filename: "ai-fortune-telling-hero.jpg",
  },
  {
    slug: "fortune-cookies-japanese-origins",
    query: "japanese temple traditional kyoto",
    filename: "fortune-cookies-origins-hero.jpg",
  },
  {
    slug: "psychology-of-luck",
    query: "four leaf clover luck nature",
    filename: "psychology-luck-hero.jpg",
  },
  {
    slug: "history-of-fortune-cookies",
    query: "fortune cookie chinese food vintage",
    filename: "history-fortune-cookies-hero.jpg",
  },
  {
    slug: "psychology-of-fortune-cookies",
    query: "meditation mindfulness zen peaceful",
    filename: "psychology-fortune-cookies-hero.jpg",
  },
  {
    slug: "building-fortune-cookie-seo",
    query: "SEO web development coding laptop analytics",
    filename: "building-seo-hero.jpg",
  },
  {
    slug: "how-ai-writes-fortunes",
    query: "artificial intelligence neural network technology abstract",
    filename: "ai-tech-magic.jpg",
  },
  {
    slug: "fortune-cookies-pop-culture",
    query: "movie theater vintage retro film",
    filename: "pop-culture-fortune-cookie.jpg",
  },
];

// Simple fetch-based Unsplash client
async function searchUnsplash(accessKey, query) {
  const url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=1&orientation=landscape`;

  const response = await fetch(url, {
    headers: {
      Authorization: `Client-ID ${accessKey}`,
    },
  });

  if (!response.ok) {
    throw new Error(
      `Unsplash API error: ${response.status} ${response.statusText}`,
    );
  }

  const data = await response.json();
  return data.results;
}

async function downloadImage(url, destPath) {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Failed to download image: ${response.status}`);
  }

  const buffer = Buffer.from(await response.arrayBuffer());
  await fs.mkdir(path.dirname(destPath), { recursive: true });
  await fs.writeFile(destPath, buffer);
}

async function trackDownload(accessKey, downloadLocation) {
  try {
    await fetch(downloadLocation, {
      headers: {
        Authorization: `Client-ID ${accessKey}`,
      },
    });
  } catch (e) {
    console.warn("Failed to track download:", e.message);
  }
}

async function main() {
  // Load config
  const configPath = path.join(projectRoot, "unsplash.config.json");
  const configData = await fs.readFile(configPath, "utf-8");
  const config = JSON.parse(configData);

  const accessKey = config.accessKey;
  const imageDestDir = path.join(
    projectRoot,
    config.imageDestination || "public/images",
    "blog",
  );

  if (!accessKey) {
    console.error("Error: No Unsplash access key found in config");
    process.exit(1);
  }

  console.log(`Destination directory: ${imageDestDir}`);
  console.log(`Processing ${blogImages.length} blog posts...\n`);

  const results = [];

  for (const blog of blogImages) {
    console.log(`[${blog.slug}]`);
    console.log(`  Searching: "${blog.query}"`);

    try {
      const photos = await searchUnsplash(accessKey, blog.query);

      if (photos.length === 0) {
        console.log(`  ⚠️  No photos found`);
        continue;
      }

      const photo = photos[0];
      const destPath = path.join(imageDestDir, blog.filename);

      // Check if already exists
      try {
        await fs.access(destPath);
        console.log(`  ✅ Already exists: ${blog.filename}`);
        results.push({
          slug: blog.slug,
          filename: blog.filename,
          photoId: photo.id,
          photographer: photo.user.name,
          photographerUrl: photo.user.links.html,
        });
        continue;
      } catch {
        // File doesn't exist, proceed with download
      }

      // Download the regular size image
      console.log(
        `  Downloading from: ${photo.urls.regular.substring(0, 50)}...`,
      );
      await downloadImage(photo.urls.regular, destPath);

      // Track download for Unsplash compliance
      await trackDownload(accessKey, photo.links.download_location);

      console.log(`  ✅ Downloaded: ${blog.filename}`);
      console.log(
        `  📷 Photo by: ${photo.user.name} (${photo.user.links.html})`,
      );

      results.push({
        slug: blog.slug,
        filename: blog.filename,
        photoId: photo.id,
        photographer: photo.user.name,
        photographerUrl: photo.user.links.html,
      });

      // Rate limiting delay
      await new Promise((r) => setTimeout(r, 300));
    } catch (error) {
      console.log(`  ❌ Error: ${error.message}`);
    }

    console.log("");
  }

  // Save attribution info
  const attributionPath = path.join(imageDestDir, "attribution.json");
  await fs.writeFile(attributionPath, JSON.stringify(results, null, 2));
  console.log(`\nAttribution saved to: ${attributionPath}`);

  console.log("\n=== Summary ===");
  console.log(`Downloaded: ${results.length}/${blogImages.length} images`);
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
