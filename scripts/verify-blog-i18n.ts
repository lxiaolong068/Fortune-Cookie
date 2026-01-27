/**
 * Blog i18n Verification Script
 *
 * Verifies that the multi-language blog infrastructure is working correctly.
 * Run with: npx ts-node --skip-project scripts/verify-blog-i18n.ts
 */

import fs from "fs";
import path from "path";

// Colors for terminal output
const colors = {
  green: "\x1b[32m",
  red: "\x1b[31m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  reset: "\x1b[0m",
  bold: "\x1b[1m",
};

function log(
  message: string,
  type: "success" | "error" | "warning" | "info" = "info"
) {
  const icons = {
    success: `${colors.green}✓${colors.reset}`,
    error: `${colors.red}✗${colors.reset}`,
    warning: `${colors.yellow}⚠${colors.reset}`,
    info: `${colors.blue}ℹ${colors.reset}`,
  };
  console.log(`${icons[type]} ${message}`);
}

function header(text: string) {
  console.log(`\n${colors.bold}${colors.blue}═══ ${text} ═══${colors.reset}\n`);
}

async function main() {
  console.log(
    `${colors.bold}${colors.blue}
╔════════════════════════════════════════════╗
║     Blog i18n Infrastructure Verification   ║
╚════════════════════════════════════════════╝
${colors.reset}`
  );

  const blogDir = path.join(process.cwd(), "content/blog");
  const locales = ["en", "zh", "es", "pt"];
  let allPassed = true;

  // Test 1: Directory Structure
  header("1. Directory Structure Verification");

  for (const locale of locales) {
    const localeDir = path.join(blogDir, locale);
    if (fs.existsSync(localeDir)) {
      const files = fs.readdirSync(localeDir).filter((f) => f.endsWith(".mdx"));
      log(`${locale}/ directory exists with ${files.length} MDX files`, "success");
    } else {
      log(`${locale}/ directory missing`, locale === "en" ? "error" : "warning");
      if (locale === "en") allPassed = false;
    }
  }

  // Test 2: English articles migration
  header("2. English Articles Migration");

  const enDir = path.join(blogDir, "en");
  if (fs.existsSync(enDir)) {
    const enFiles = fs.readdirSync(enDir).filter((f) => f.endsWith(".mdx"));
    if (enFiles.length >= 39) {
      log(`All 39 English articles migrated (found ${enFiles.length})`, "success");
    } else {
      log(`Only ${enFiles.length}/39 articles found in en/`, "error");
      allPassed = false;
    }

    // Check that root directory is clean (no stray MDX files)
    const rootFiles = fs.readdirSync(blogDir).filter((f) => f.endsWith(".mdx"));
    if (rootFiles.length === 0) {
      log("Root blog directory clean (no stray MDX files)", "success");
    } else {
      log(`Found ${rootFiles.length} MDX files in root (should be 0)`, "error");
      allPassed = false;
    }
  } else {
    log("en/ directory not found", "error");
    allPassed = false;
  }

  // Test 3: lib/blog.ts functions
  header("3. Blog Library Functions");

  try {
    // Dynamic import to handle ES modules
    const blogModule = await import("../lib/blog");

    // Test getAllPostSlugs
    const slugs = blogModule.getAllPostSlugs("en");
    if (slugs.length >= 39) {
      log(`getAllPostSlugs('en') returns ${slugs.length} slugs`, "success");
    } else {
      log(`getAllPostSlugs('en') only returns ${slugs.length} slugs`, "error");
      allPassed = false;
    }

    // Test getBlogPosts
    const posts = blogModule.getBlogPosts({ locale: "en" });
    if (posts.length >= 39) {
      log(`getBlogPosts({ locale: 'en' }) returns ${posts.length} posts`, "success");
    } else {
      log(`getBlogPosts({ locale: 'en' }) only returns ${posts.length} posts`, "error");
      allPassed = false;
    }

    // Test getPostBySlug
    const firstSlug = slugs[0];
    if (firstSlug) {
      const post = blogModule.getPostBySlug(firstSlug, "en");
      if (post && post.title) {
        log(`getPostBySlug('${firstSlug}', 'en') returns valid post`, "success");
      } else {
        log(`getPostBySlug failed for '${firstSlug}'`, "error");
        allPassed = false;
      }
    }

    // Test getAvailableTranslations
    if (firstSlug) {
      const translations = blogModule.getAvailableTranslations(firstSlug);
      if (translations.availableLocales.includes("en")) {
        log(`getAvailableTranslations works correctly`, "success");
      } else {
        log(`getAvailableTranslations failed`, "error");
        allPassed = false;
      }
    }

    // Test backward compatibility (no locale parameter)
    const backwardPosts = blogModule.getBlogPosts();
    if (backwardPosts.length >= 39) {
      log(`Backward compatibility: getBlogPosts() without locale works`, "success");
    } else {
      log(`Backward compatibility broken`, "error");
      allPassed = false;
    }
  } catch (error) {
    log(`Failed to import blog module: ${error}`, "error");
    allPassed = false;
  }

  // Test 4: Type definitions
  header("4. Type Definitions");

  const typesFile = path.join(process.cwd(), "lib/blog-types.ts");
  if (fs.existsSync(typesFile)) {
    const content = fs.readFileSync(typesFile, "utf-8");
    const requiredTypes = [
      "BlogPostFrontmatter",
      "BlogPost",
      "BlogPostMeta",
      "LocalizedBlogPost",
      "BlogPostTranslationStatus",
    ];

    for (const typeName of requiredTypes) {
      if (content.includes(`interface ${typeName}`)) {
        log(`Type '${typeName}' defined`, "success");
      } else {
        log(`Type '${typeName}' missing`, "error");
        allPassed = false;
      }
    }
  } else {
    log("blog-types.ts not found", "error");
    allPassed = false;
  }

  // Summary
  header("Summary");

  if (allPassed) {
    console.log(
      `${colors.green}${colors.bold}
╔════════════════════════════════════════════╗
║  ✓ All Phase 1 checks passed successfully!  ║
╚════════════════════════════════════════════╝
${colors.reset}`
    );
    console.log("Next steps:");
    console.log("  1. Proceed to Phase 2: Routing Implementation");
    console.log("  2. Create app/[locale]/blog/ pages");
    console.log("  3. Add language switcher component");
  } else {
    console.log(
      `${colors.red}${colors.bold}
╔════════════════════════════════════════════╗
║  ✗ Some checks failed. Please fix issues.  ║
╚════════════════════════════════════════════╝
${colors.reset}`
    );
  }

  process.exit(allPassed ? 0 : 1);
}

main().catch(console.error);
