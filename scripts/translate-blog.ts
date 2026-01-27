#!/usr/bin/env npx ts-node
/**
 * Blog Translation Script
 *
 * Translates blog posts from English to other languages using AI.
 * Uses OpenRouter API for translation.
 *
 * Usage:
 *   npx ts-node scripts/translate-blog.ts --locale zh
 *   npx ts-node scripts/translate-blog.ts --locale es --slug specific-post
 *   npx ts-node scripts/translate-blog.ts --locale pt --all
 */

import * as dotenv from "dotenv";
import fs from "fs";
import path from "path";
import matter from "gray-matter";

// Load environment variables from .env.local
dotenv.config({ path: path.join(process.cwd(), ".env.local") });

// Configuration
const BLOG_DIR = path.join(process.cwd(), "content/blog");
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const OPENROUTER_BASE_URL = "https://openrouter.ai/api/v1";
const MODEL =
  process.env.OPENROUTER_MODEL || "anthropic/claude-3-haiku-20240307";

// Supported locales
type Locale = "zh" | "es" | "pt";

const LOCALE_CONFIG: Record<
  Locale,
  { name: string; nativeName: string; instructions: string }
> = {
  zh: {
    name: "Chinese",
    nativeName: "简体中文",
    instructions: `Translate to Simplified Chinese (简体中文).
- Use natural, fluent Chinese that reads well for native speakers
- Keep technical terms in English when commonly used (e.g., AI, API)
- Maintain the original formatting (markdown, headers, lists)
- Preserve all links, images, and code blocks unchanged
- Use appropriate Chinese punctuation (。，！？：；）
- Keep the tone engaging and accessible`,
  },
  es: {
    name: "Spanish",
    nativeName: "Español",
    instructions: `Translate to Spanish (Español).
- Use natural, fluent Spanish that reads well for native speakers
- Keep technical terms in English when commonly used (e.g., AI, API)
- Maintain the original formatting (markdown, headers, lists)
- Preserve all links, images, and code blocks unchanged
- Use appropriate Spanish punctuation and accents
- Keep the tone engaging and accessible`,
  },
  pt: {
    name: "Portuguese",
    nativeName: "Português (Brasil)",
    instructions: `Translate to Brazilian Portuguese (Português do Brasil).
- Use natural, fluent Brazilian Portuguese that reads well for native speakers
- Keep technical terms in English when commonly used (e.g., AI, API)
- Maintain the original formatting (markdown, headers, lists)
- Preserve all links, images, and code blocks unchanged
- Use appropriate Portuguese punctuation and accents
- Keep the tone engaging and accessible`,
  },
};

interface BlogFrontmatter {
  title: string;
  description: string;
  date: string;
  author: string;
  tags: string[];
  image?: string;
  featured?: boolean;
}

interface TranslationResult {
  title: string;
  description: string;
  content: string;
}

/**
 * Call OpenRouter API to translate content
 */
async function translateWithAI(
  content: string,
  locale: Locale,
  context: string,
): Promise<string> {
  if (!OPENROUTER_API_KEY) {
    throw new Error("OPENROUTER_API_KEY environment variable is not set");
  }

  const config = LOCALE_CONFIG[locale];

  const response = await fetch(`${OPENROUTER_BASE_URL}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${OPENROUTER_API_KEY}`,
      "HTTP-Referer": "https://fortunecookie.vip",
      "X-Title": "Fortune Cookie Blog Translation",
    },
    body: JSON.stringify({
      model: MODEL,
      messages: [
        {
          role: "system",
          content: `You are a professional translator specializing in blog content translation.

${config.instructions}

Context: ${context}

IMPORTANT:
- Return ONLY the translated text, no explanations or notes
- Preserve ALL markdown formatting exactly as it appears
- Keep URLs, image links, and code blocks unchanged
- Do not translate brand names like "Fortune Cookie AI"`,
        },
        {
          role: "user",
          content: `Translate the following to ${config.name}:\n\n${content}`,
        },
      ],
      temperature: 0.3,
      max_tokens: 8000,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`OpenRouter API error: ${response.status} - ${error}`);
  }

  const data = await response.json();
  return data.choices[0]?.message?.content?.trim() || "";
}

/**
 * Translate a blog post's frontmatter and content
 */
async function translatePost(
  slug: string,
  locale: Locale,
): Promise<TranslationResult> {
  const sourcePath = path.join(BLOG_DIR, "en", `${slug}.mdx`);

  if (!fs.existsSync(sourcePath)) {
    throw new Error(`Source file not found: ${sourcePath}`);
  }

  const source = fs.readFileSync(sourcePath, "utf-8");
  const { data: frontmatter, content } = matter(source);
  const fm = frontmatter as BlogFrontmatter;

  console.log(`  Translating title...`);
  const translatedTitle = await translateWithAI(
    fm.title,
    locale,
    "This is a blog post title. Keep it concise and SEO-friendly.",
  );

  console.log(`  Translating description...`);
  const translatedDescription = await translateWithAI(
    fm.description,
    locale,
    "This is a meta description for SEO. Keep it under 160 characters.",
  );

  console.log(`  Translating content...`);
  const translatedContent = await translateWithAI(
    content,
    locale,
    "This is the main blog post content in MDX format.",
  );

  return {
    title: translatedTitle,
    description: translatedDescription,
    content: translatedContent,
  };
}

/**
 * Save translated post to file
 */
function saveTranslatedPost(
  slug: string,
  locale: Locale,
  translation: TranslationResult,
  originalFrontmatter: BlogFrontmatter,
): void {
  const targetDir = path.join(BLOG_DIR, locale);
  const targetPath = path.join(targetDir, `${slug}.mdx`);

  // Ensure target directory exists
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  // Build new frontmatter
  const newFrontmatter: BlogFrontmatter = {
    ...originalFrontmatter,
    title: translation.title,
    description: translation.description,
  };

  // Create MDX content
  const mdxContent = matter.stringify(translation.content, newFrontmatter);

  fs.writeFileSync(targetPath, mdxContent);
  console.log(`  ✓ Saved: ${targetPath}`);
}

/**
 * Get all English blog post slugs
 */
function getAllSlugs(): string[] {
  const enDir = path.join(BLOG_DIR, "en");
  if (!fs.existsSync(enDir)) {
    return [];
  }

  return fs
    .readdirSync(enDir)
    .filter((file) => file.endsWith(".mdx"))
    .map((file) => file.replace(".mdx", ""));
}

/**
 * Check if a translation already exists
 */
function translationExists(slug: string, locale: Locale): boolean {
  const targetPath = path.join(BLOG_DIR, locale, `${slug}.mdx`);
  return fs.existsSync(targetPath);
}

/**
 * Main function
 */
async function main(): Promise<void> {
  const args = process.argv.slice(2);

  // Parse arguments
  let locale: Locale | null = null;
  let specificSlug: string | null = null;
  let translateAll = false;
  let overwrite = false;

  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--locale" && args[i + 1]) {
      const loc = args[i + 1] as Locale;
      if (loc in LOCALE_CONFIG) {
        locale = loc;
      } else {
        console.error(`Invalid locale: ${loc}. Supported: zh, es, pt`);
        process.exit(1);
      }
      i++;
    } else if (args[i] === "--slug" && args[i + 1]) {
      specificSlug = args[i + 1] ?? null;
      i++;
    } else if (args[i] === "--all") {
      translateAll = true;
    } else if (args[i] === "--overwrite") {
      overwrite = true;
    } else if (args[i] === "--help") {
      console.log(`
Blog Translation Script

Usage:
  npx ts-node scripts/translate-blog.ts --locale <locale> [options]

Options:
  --locale <locale>  Target locale (required): zh, es, pt
  --slug <slug>      Translate specific post by slug
  --all              Translate all posts
  --overwrite        Overwrite existing translations
  --help             Show this help message

Examples:
  npx ts-node scripts/translate-blog.ts --locale zh --all
  npx ts-node scripts/translate-blog.ts --locale es --slug ai-fortune-telling-trends-2025
  npx ts-node scripts/translate-blog.ts --locale pt --all --overwrite
      `);
      process.exit(0);
    }
  }

  if (!locale) {
    console.error("Error: --locale is required. Use --help for usage info.");
    process.exit(1);
  }

  if (!OPENROUTER_API_KEY) {
    console.error("Error: OPENROUTER_API_KEY environment variable is not set");
    process.exit(1);
  }

  // Get slugs to translate
  let slugs: string[];
  if (specificSlug) {
    slugs = [specificSlug];
  } else if (translateAll) {
    slugs = getAllSlugs();
  } else {
    console.error("Error: Specify --slug or --all. Use --help for usage info.");
    process.exit(1);
  }

  console.log(
    `\n🌐 Translating ${slugs.length} post(s) to ${LOCALE_CONFIG[locale].nativeName}\n`,
  );

  let translated = 0;
  let skipped = 0;
  let failed = 0;

  for (const slug of slugs) {
    console.log(`\n📝 Processing: ${slug}`);

    // Check if translation exists
    if (!overwrite && translationExists(slug, locale)) {
      console.log(`  ⏭ Skipped (already exists)`);
      skipped++;
      continue;
    }

    try {
      // Read original frontmatter
      const sourcePath = path.join(BLOG_DIR, "en", `${slug}.mdx`);
      const source = fs.readFileSync(sourcePath, "utf-8");
      const { data: frontmatter } = matter(source);

      // Translate
      const translation = await translatePost(slug, locale);

      // Save
      saveTranslatedPost(
        slug,
        locale,
        translation,
        frontmatter as BlogFrontmatter,
      );

      translated++;

      // Rate limiting - wait between requests
      await new Promise((resolve) => setTimeout(resolve, 1000));
    } catch (error) {
      console.error(
        `  ✗ Error: ${error instanceof Error ? error.message : error}`,
      );
      failed++;
    }
  }

  console.log(`\n📊 Summary:`);
  console.log(`  ✓ Translated: ${translated}`);
  console.log(`  ⏭ Skipped: ${skipped}`);
  console.log(`  ✗ Failed: ${failed}`);
  console.log(`  Total: ${slugs.length}\n`);
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
