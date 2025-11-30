/**
 * 站点配置和 URL 工具函数
 * 统一处理所有域名、URL 生成，确保 SEO 一致性
 */

import { getBlobUrl, hasBlobUrl } from "./blob-urls";

/**
 * 获取站点的基础 URL
 * 优先使用环境变量 NEXT_PUBLIC_APP_URL，回退到本地开发地址
 * 确保返回的 URL 不以斜杠结尾
 */
export function getSiteUrl(): string {
  const raw = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  try {
    const url = new URL(raw);
    // 确保返回的 URL 不以斜杠结尾
    return url.origin;
  } catch (error) {
    // 如果 URL 解析失败，回退到本地开发地址
    console.warn(
      "Invalid NEXT_PUBLIC_APP_URL, falling back to localhost:",
      error,
    );
    return "http://localhost:3000";
  }
}

/**
 * 生成完整的页面 URL
 * @param path - 页面路径，可以是相对路径或绝对路径
 * @returns 完整的 URL
 */
export function getFullUrl(path: string = ""): string {
  const baseUrl = getSiteUrl();

  // 如果已经是完整 URL，直接返回
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }

  // 确保路径以斜杠开头
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;

  return `${baseUrl}${normalizedPath}`;
}

/**
 * 生成 canonical URL
 * @param path - 页面路径
 * @returns canonical URL
 */
export function getCanonicalUrl(path: string = ""): string {
  return getFullUrl(path);
}

/**
 * 生成图片的完整 URL
 * 优先使用 Vercel Blob Storage URL（用于 CDN 分发优化）
 * @param imagePath - 图片路径
 * @returns 完整的图片 URL（Blob URL 或 本地 URL）
 */
export function getImageUrl(imagePath: string): string {
  // 如果已经是完整 URL，直接返回
  if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
    return imagePath;
  }

  // 确保图片路径以斜杠开头
  const normalizedPath = imagePath.startsWith("/")
    ? imagePath
    : `/${imagePath}`;

  // 优先使用 Blob Storage URL（用于 CDN 分发优化）
  if (hasBlobUrl(normalizedPath)) {
    return getBlobUrl(normalizedPath);
  }

  // 回退到本地 URL
  return getFullUrl(normalizedPath);
}

/**
 * 站点基本信息配置
 */
export const siteConfig = {
  name: "Fortune Cookie AI",
  title: "Fortune Cookie - Free Online AI Generator",
  description:
    "Free online AI-powered fortune cookie generator. Get personalized inspirational messages, funny quotes, and lucky numbers. Create custom cookies with our AI.",
  keywords: [
    "fortune cookie",
    "free online fortune cookie generator ai",
    "custom fortune cookie message creator",
    "ai fortune cookie sayings app",
    "inspirational fortune cookie quotes",
    "funny fortune cookie messages",
    "lucky numbers generator",
    "personalized fortune cookies",
  ],
  author: "Fortune Cookie AI Team",
  creator: "Fortune Cookie AI",
  publisher: "Fortune Cookie AI",
  twitterHandle: "@fortunecookieai",
} as const;

/**
 * 获取站点的基本元数据
 */
export function getSiteMetadata() {
  const baseUrl = getSiteUrl();

  return {
    title: siteConfig.title,
    description: siteConfig.description,
    keywords: [...siteConfig.keywords],
    author: siteConfig.author,
    creator: siteConfig.creator,
    publisher: siteConfig.publisher,
    baseUrl,
    url: baseUrl,
    siteName: siteConfig.name,
    locale: "en_US",
    type: "website" as const,
  };
}

/**
 * 获取 Open Graph 图片配置
 */
export function getOGImageConfig() {
  return {
    url: getImageUrl("/og-image.png"),
    width: 1200,
    height: 630,
    alt: siteConfig.title,
    type: "image/png" as const,
  };
}

/**
 * 获取 Twitter 图片配置
 */
export function getTwitterImageConfig() {
  return {
    url: getImageUrl("/twitter-image.png"),
    alt: siteConfig.title,
  };
}

/**
 * 生成结构化数据的基础 URL 引用
 */
export function getStructuredDataUrls() {
  const baseUrl = getSiteUrl();

  return {
    website: baseUrl,
    logo: getImageUrl("/logo.svg"),
    searchAction: `${baseUrl}/search?q={search_term_string}`,
    organization: baseUrl,
  };
}
