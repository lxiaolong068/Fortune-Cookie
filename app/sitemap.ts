import { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/site";
import { i18n, getLocalizedPath, getAlternateLinks } from "@/lib/i18n-config";
import { getDatabaseStats } from "@/lib/fortune-database";
import { getBlogPosts } from "@/lib/blog";

/**
 * Generate XML Sitemap for SEO
 *
 * This sitemap follows the XML Sitemap Protocol 0.9 specification:
 * https://www.sitemaps.org/protocol.html
 *
 * Key features:
 * - Multi-language support with hreflang tags
 * - Proper priority and change frequency settings
 * - ISO 8601 date format for lastModified
 * - Absolute URLs with protocol and domain
 *
 * SEO Best Practices:
 * - Priority: 1.0 (homepage) > 0.8-0.9 (key pages) > 0.5-0.7 (content) > 0.3-0.4 (utility)
 * - ChangeFrequency: Reflects actual content update patterns
 * - LastModified: Based on actual content changes, not build time
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = getSiteUrl();

  // Define last modification dates for different page types
  // Static content pages: Use fixed dates based on last actual update
  const staticContentDate = new Date("2025-01-15"); // Last major content update
  const legalPagesDate = new Date("2025-01-01"); // Privacy/Terms last updated

  // Dynamic content pages: Use recent date to indicate freshness
  const dynamicContentDate = new Date("2025-10-01"); // Monthly update for dynamic content
  const weeklyContentDate = new Date("2025-10-01"); // Weekly update for frequently changing content

  // Pages that should be excluded from sitemap (noindex pages)
  const excludedPages = new Set(["/analytics"]);

  /**
   * Page configuration with SEO metadata
   *
   * Priority guidelines:
   * - 1.0: Homepage (most important)
   * - 0.9: Primary features (generator)
   * - 0.8: Core content pages (messages, browse)
   * - 0.7: Secondary content (history, recipes)
   * - 0.6: Educational content (how-to, funny messages)
   * - 0.5: User features (profile)
   * - 0.3-0.4: Utility pages (cookies, legal)
   * - 0.2: Offline fallback
   *
   * ChangeFrequency guidelines:
   * - daily: Homepage, generator (AI-powered, frequently updated)
   * - weekly: Message collections, browse (new content added regularly)
   * - monthly: Educational content, recipes (stable content)
   * - yearly: Legal pages, offline (rarely changes)
   */
  const pages = [
    {
      path: "/",
      priority: 1.0,
      changeFrequency: "daily" as const,
      lastModified: weeklyContentDate, // Homepage updated frequently
    },
    {
      path: "/generator",
      priority: 0.9,
      changeFrequency: "daily" as const,
      lastModified: weeklyContentDate, // AI generator, frequently enhanced
    },
    {
      path: "/messages",
      priority: 0.8,
      changeFrequency: "weekly" as const,
      lastModified: weeklyContentDate, // Message collection grows weekly
    },
    {
      path: "/browse",
      priority: 0.8,
      changeFrequency: "weekly" as const,
      lastModified: weeklyContentDate, // Browse page updated with new messages
    },
    {
      path: "/history",
      priority: 0.7,
      changeFrequency: "monthly" as const,
      lastModified: staticContentDate, // Historical content, stable
    },
    {
      path: "/recipes",
      priority: 0.7,
      changeFrequency: "monthly" as const,
      lastModified: staticContentDate, // Recipe content, occasionally updated
    },
    {
      path: "/who-invented-fortune-cookies",
      priority: 0.6,
      changeFrequency: "monthly" as const,
      lastModified: staticContentDate, // Educational content, stable
    },
    {
      path: "/how-to-make-fortune-cookies",
      priority: 0.6,
      changeFrequency: "monthly" as const,
      lastModified: staticContentDate, // Tutorial content, stable
    },
    {
      path: "/funny-fortune-cookie-messages",
      priority: 0.6,
      changeFrequency: "weekly" as const,
      lastModified: weeklyContentDate, // Funny messages updated regularly
    },
    {
      path: "/profile",
      priority: 0.5,
      changeFrequency: "weekly" as const,
      lastModified: dynamicContentDate, // User profile features
    },
    {
      path: "/favorites",
      priority: 0.6,
      changeFrequency: "weekly" as const,
      lastModified: dynamicContentDate, // User favorites page
    },
    {
      path: "/faq",
      priority: 0.7,
      changeFrequency: "monthly" as const,
      lastModified: staticContentDate, // FAQ page
    },
    {
      path: "/cookies",
      priority: 0.4,
      changeFrequency: "monthly" as const,
      lastModified: legalPagesDate, // Cookie policy
    },
    {
      path: "/offline",
      priority: 0.2,
      changeFrequency: "yearly" as const,
      lastModified: staticContentDate, // Offline fallback page
    },
    {
      path: "/privacy",
      priority: 0.3,
      changeFrequency: "yearly" as const,
      lastModified: legalPagesDate, // Privacy policy
    },
    {
      path: "/terms",
      priority: 0.3,
      changeFrequency: "yearly" as const,
      lastModified: legalPagesDate, // Terms of service
    },
  ].filter((page) => !excludedPages.has(page.path));

  // Add category pages dynamically
  const stats = getDatabaseStats();
  Object.keys(stats.categories).forEach((category) => {
    pages.push({
      path: `/browse/category/${category}`,
      priority: 0.7,
      changeFrequency: "weekly" as const,
      lastModified: weeklyContentDate,
    });
  });

  // Add message category sub-pages
  const messageCategories = [
    "inspirational",
    "funny",
    "love",
    "success",
    "wisdom",
  ];
  messageCategories.forEach((category) => {
    pages.push({
      path: `/messages/${category}`,
      priority: 0.8,
      changeFrequency: "weekly" as const,
      lastModified: weeklyContentDate,
    });
  });

  // Add tag pages dynamically
  const allTags = [
    "motivation",
    "action",
    "future",
    "success",
    "love",
    "humor",
    "wisdom",
    "self-improvement",
    "relationships",
    "happiness",
    "career",
    "health",
    "money",
    "friendship",
    "family",
    "gratitude",
    "patience",
    "courage",
    "creativity",
    "learning",
  ];
  allTags.forEach((tag) => {
    pages.push({
      path: `/tag/${encodeURIComponent(tag)}`,
      priority: 0.6,
      changeFrequency: "weekly" as const,
      lastModified: weeklyContentDate,
    });
  });

  // Add blog pages dynamically
  pages.push({
    path: "/blog",
    priority: 0.8,
    changeFrequency: "weekly" as const,
    lastModified: weeklyContentDate,
  });

  // Add individual blog posts
  const blogPosts = getBlogPosts();
  blogPosts.forEach((post) => {
    pages.push({
      path: `/blog/${post.slug}`,
      priority: 0.7,
      changeFrequency: "monthly" as const,
      lastModified: new Date(post.date),
    });
  });

  /**
   * Generate sitemap entries for all locales
   *
   * For each page, we create entries for all supported locales (en, zh)
   * and include hreflang alternate links for proper multi-language SEO.
   *
   * XML Output format:
   * <url>
   *   <loc>https://example.com/page</loc>
   *   <xhtml:link rel="alternate" hreflang="en-US" href="https://example.com/page" />
   *   <xhtml:link rel="alternate" hreflang="zh-CN" href="https://example.com/zh/page" />
   *   <lastmod>2025-10-01T00:00:00.000Z</lastmod>
   *   <changefreq>weekly</changefreq>
   *   <priority>0.8</priority>
   * </url>
   */
  const sitemapEntries: MetadataRoute.Sitemap = [];

  pages.forEach((page) => {
    // For each page, create entries for all supported locales
    i18n.locales.forEach((locale) => {
      const localizedPath = getLocalizedPath(page.path, locale);
      const fullUrl = `${baseUrl}${localizedPath}`;

      // Generate alternate language links for hreflang tags
      // This helps search engines understand the relationship between language versions
      const alternates = getAlternateLinks(page.path).reduce(
        (acc, alt) => {
          acc[alt.hreflang] = `${baseUrl}${alt.href}`;
          return acc;
        },
        {} as Record<string, string>,
      );

      sitemapEntries.push({
        url: fullUrl, // Absolute URL (required)
        lastModified: page.lastModified, // ISO 8601 date format (optional but recommended)
        changeFrequency: page.changeFrequency, // Update frequency hint (optional)
        priority: page.priority, // Relative priority 0.0-1.0 (optional)
        alternates: {
          languages: alternates, // Hreflang alternate links (optional, for i18n)
        },
      });
    });
  });

  return sitemapEntries;
}

/**
 * Sitemap Validation Checklist:
 *
 * ✅ XML Declaration: <?xml version="1.0" encoding="UTF-8"?>
 * ✅ Namespace: xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
 * ✅ Required Fields: <loc> with absolute URLs
 * ✅ Optional Fields: <lastmod>, <changefreq>, <priority>
 * ✅ Date Format: ISO 8601 (YYYY-MM-DDTHH:MM:SS.sssZ)
 * ✅ ChangeFreq Values: always, hourly, daily, weekly, monthly, yearly, never
 * ✅ Priority Range: 0.0 to 1.0
 * ✅ Tag Closure: All tags properly closed
 * ✅ Special Characters: Properly escaped in URLs
 * ✅ Multi-language: hreflang alternate links for i18n
 *
 * Testing:
 * - Local: http://localhost:3000/sitemap.xml
 * - Production: https://your-domain.com/sitemap.xml
 * - Validation: https://www.xml-sitemaps.com/validate-xml-sitemap.html
 * - Google Search Console: Submit sitemap for indexing
 *
 * Performance:
 * - Max 50,000 URLs per sitemap (current: ~28 URLs with 2 locales)
 * - Max 50MB uncompressed (current: <100KB)
 * - Consider sitemap index if exceeding limits
 */
