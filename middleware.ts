import { NextRequest, NextResponse } from "next/server";
import { EdgeCacheManager } from "./lib/edge-cache";
import {
  i18n,
  isValidLocale,
  pathConfig,
  type Locale,
} from "./lib/i18n-config";

// 需要缓存的路径模式
const CACHEABLE_PATHS = [
  "/api/fortunes",
  "/api/analytics/dashboard",
  "/api/analytics/web-vitals",
];

// 静态资源路径
const STATIC_PATHS = [
  "/_next/static",
  "/favicon.ico",
  "/apple-touch-icon.png",
  "/favicon-32x32.png",
  "/favicon-16x16.png",
  "/site.webmanifest",
  "/manifest.webmanifest",
  "/sw.js",
  "/robots.txt",
  "/sitemap.xml",
];

// 不需要处理的路径
const SKIP_PATHS = ["/_next", "/api/cache", "/__nextjs_original-stack-frame"];

// 不进行语言重定向的路径
const LOCALE_SKIP_PATHS = [
  "/api",
  "/_next",
  "/favicon",
  "/robots.txt",
  "/sitemap.xml",
  "/ads.txt",
  "/site.webmanifest",
  "/manifest.webmanifest",
  "/sw.js",
  "/__nextjs_original-stack-frame",
];

// 静态文件扩展名和文件名（用于重定向到根路径）
const STATIC_FILE_PATTERNS = [
  "manifest.webmanifest",
  "sw.js",
  "robots.txt",
  "sitemap.xml",
  "ads.txt",
  "site.webmanifest",
];

// 生成 CSP Nonce
function generateNonce(): string {
  const array = new Uint8Array(16);
  crypto.getRandomValues(array);
  return Buffer.from(array).toString("base64");
}

export function middleware(request: NextRequest) {
  const startTime = Date.now();
  const { pathname } = request.nextUrl;

  // 生成 CSP Nonce
  const nonce = generateNonce();

  // 检查是否是根路径的静态文件（如 /manifest.webmanifest）
  // 这些文件应该直接返回，不进行任何语言检测或重定向
  if (STATIC_FILE_PATTERNS.some((file) => pathname === `/${file}`)) {
    return handleStaticAssets(request, startTime);
  }

  // 检查是否是带语言前缀的静态文件请求（如 /zh/manifest.webmanifest）
  // 需要重定向到根路径
  const segments = pathname.split("/").filter(Boolean);
  if (segments.length >= 2) {
    const lastSegment = segments[segments.length - 1];
    if (
      lastSegment &&
      STATIC_FILE_PATTERNS.includes(lastSegment) &&
      isValidLocale(segments[0] ?? "")
    ) {
      // 重定向到根路径的静态文件
      const rootUrl = new URL(request.url);
      rootUrl.pathname = `/${lastSegment}`;
      return NextResponse.redirect(rootUrl, 301);
    }
  }

  // 跳过不需要处理的路径
  if (SKIP_PATHS.some((path) => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  // 处理静态资源
  if (STATIC_PATHS.some((path) => pathname.startsWith(path))) {
    return handleStaticAssets(request, startTime);
  }

  // 处理API路由缓存
  if (pathname.startsWith("/api/")) {
    return handleApiCaching(request, startTime, nonce);
  }

  // 处理多语言路由（在页面缓存之前）
  const localeResponse = handleLocaleDetection(request, startTime, nonce);
  if (localeResponse) {
    return localeResponse;
  }

  // 处理页面缓存
  return handlePageCaching(request, startTime, nonce);
}

/**
 * Detect preferred locale from Accept-Language header
 */
function detectLocaleFromHeader(acceptLanguage: string | null): Locale {
  if (!acceptLanguage) {
    return i18n.defaultLocale;
  }

  // Parse Accept-Language header
  const languages = acceptLanguage
    .split(",")
    .map((lang) => {
      const parts = lang.trim().split(";q=");
      const code = parts[0]?.toLowerCase() ?? "";
      const qualityStr = parts[1];
      return {
        code,
        quality: qualityStr ? parseFloat(qualityStr) : 1,
      };
    })
    .sort((a, b) => b.quality - a.quality);

  // Find the first supported locale
  for (const { code } of languages) {
    // Check exact match
    if (isValidLocale(code)) {
      return code;
    }

    // Check language code without region (e.g., "en-US" -> "en")
    const languageCode = code.split("-")[0];
    if (languageCode && isValidLocale(languageCode)) {
      return languageCode;
    }
  }

  return i18n.defaultLocale;
}

/**
 * Handle locale detection and redirection
 * Returns a response if redirection is needed, otherwise null
 */
function handleLocaleDetection(
  request: NextRequest,
  startTime: number,
  nonce: string,
): NextResponse | null {
  const { pathname } = request.nextUrl;

  // Skip locale handling for certain paths
  if (LOCALE_SKIP_PATHS.some((path) => pathname.startsWith(path))) {
    return null;
  }

  // Check if pathname starts with a locale
  const segments = pathname.split("/").filter(Boolean);
  const firstSegment = segments[0] ?? "";
  const pathnameHasLocale = isValidLocale(firstSegment);

  // Get locale from cookie or Accept-Language header
  const cookieLocale = request.cookies.get(pathConfig.detection.cookieName)
    ?.value as Locale | undefined;
  const headerLocale = pathConfig.detection.header
    ? detectLocaleFromHeader(request.headers.get("Accept-Language"))
    : i18n.defaultLocale;

  // Determine the preferred locale
  const preferredLocale =
    cookieLocale && isValidLocale(cookieLocale) ? cookieLocale : headerLocale;

  // If path already has a locale prefix, check if it's valid
  if (pathnameHasLocale) {
    // Valid locale in path - continue with current locale
    // Set locale cookie if not already set
    const response = NextResponse.next();
    if (!cookieLocale || cookieLocale !== firstSegment) {
      response.cookies.set(pathConfig.detection.cookieName, firstSegment, {
        path: "/",
        maxAge: pathConfig.detection.cookieMaxAge,
      });
    }
    return null; // Let the page caching handle it
  }

  // Path doesn't have a locale prefix
  // For default locale without showDefaultLocale, don't redirect
  if (preferredLocale === i18n.defaultLocale && !pathConfig.showDefaultLocale) {
    // Set cookie for default locale
    const response = NextResponse.next();
    if (cookieLocale !== i18n.defaultLocale) {
      response.cookies.set(
        pathConfig.detection.cookieName,
        i18n.defaultLocale,
        {
          path: "/",
          maxAge: pathConfig.detection.cookieMaxAge,
        },
      );
    }
    return null; // Don't redirect, serve default locale content
  }

  // Redirect to localized path for non-default locales
  if (preferredLocale !== i18n.defaultLocale) {
    const localizedUrl = new URL(request.url);
    localizedUrl.pathname = `/${preferredLocale}${pathname === "/" ? "" : pathname}`;

    const response = NextResponse.redirect(localizedUrl, 307);
    response.cookies.set(pathConfig.detection.cookieName, preferredLocale, {
      path: "/",
      maxAge: pathConfig.detection.cookieMaxAge,
    });
    addServerTiming(response, startTime, "locale-redirect");
    addSecurityHeaders(response, nonce);
    return response;
  }

  return null;
}

// 添加Server-Timing头部的工具函数
function addServerTiming(
  response: NextResponse,
  startTime: number,
  operation: string,
): void {
  const duration = Date.now() - startTime;
  const existingTiming = response.headers.get("Server-Timing");
  const newTiming = `${operation};dur=${duration}`;

  if (existingTiming) {
    response.headers.set("Server-Timing", `${existingTiming}, ${newTiming}`);
  } else {
    response.headers.set("Server-Timing", newTiming);
  }
}

// 处理静态资源缓存
function handleStaticAssets(
  request: NextRequest,
  startTime: number,
): NextResponse {
  const response = NextResponse.next();

  // 设置长期缓存头部
  response.headers.set("Cache-Control", "public, max-age=31536000, immutable");
  response.headers.set("CDN-Cache-Control", "public, max-age=31536000");

  // 添加Server-Timing头部
  addServerTiming(response, startTime, "static");

  return response;
}

// 处理API缓存
function handleApiCaching(
  request: NextRequest,
  startTime: number,
  nonce: string,
): NextResponse {
  const { pathname, searchParams } = request.nextUrl;
  const isAuthRoute = pathname.startsWith("/api/auth");

  // 检查是否是可缓存的API路径
  const isCacheable = CACHEABLE_PATHS.some((path) => pathname.startsWith(path));

  if (!isCacheable) {
    const response = NextResponse.next();
    addServerTiming(response, startTime, "api-uncacheable");
    addSecurityHeaders(response, nonce, {
      includeFormAction: !isAuthRoute,
    });
    return response;
  }

  // 生成 ETag 用于条件请求
  const etag = generateSimpleETag(pathname + searchParams.toString());

  // 检查条件请求
  const ifNoneMatch = request.headers.get("If-None-Match");
  const ifModifiedSince = request.headers.get("If-Modified-Since");

  if (ifNoneMatch === etag) {
    // 返回 304 Not Modified
    const response = new NextResponse(null, {
      status: 304,
      statusText: "Not Modified",
      headers: {
        ETag: etag,
        "Cache-Control": "public, max-age=300, stale-while-revalidate=60",
        "CDN-Cache-Control": "public, max-age=300",
      },
    });
    addServerTiming(response, startTime, "api-304");
    addSecurityHeaders(response, nonce, {
      includeFormAction: !isAuthRoute,
    });
    return response;
  }

  // 继续处理请求，添加缓存头
  const response = NextResponse.next();

  // 根据 API 类型设置不同的缓存策略
  if (pathname.includes("/fortunes")) {
    // 幸运饼干数据 - 中等缓存时间
    response.headers.set(
      "Cache-Control",
      "public, max-age=300, stale-while-revalidate=60",
    );
    response.headers.set("CDN-Cache-Control", "public, max-age=300");
  } else if (pathname.includes("/analytics")) {
    // 分析数据 - 短缓存时间
    response.headers.set(
      "Cache-Control",
      "public, max-age=60, stale-while-revalidate=30",
    );
    response.headers.set("CDN-Cache-Control", "public, max-age=60");
  } else {
    // 默认 API 缓存
    response.headers.set(
      "Cache-Control",
      "public, max-age=180, stale-while-revalidate=60",
    );
    response.headers.set("CDN-Cache-Control", "public, max-age=180");
  }

  // 添加 ETag 和 Last-Modified
  response.headers.set("ETag", etag);
  response.headers.set("Last-Modified", new Date().toUTCString());

  // 添加 Vary 头以支持内容协商
  response.headers.set("Vary", "Accept-Encoding, Accept");

  addServerTiming(response, startTime, "api-cacheable");
  addSecurityHeaders(response, nonce, {
    includeFormAction: !isAuthRoute,
  });
  return response;
}

// 添加安全标头（包括 CSP Nonce）
function addSecurityHeaders(
  response: NextResponse,
  nonce: string,
  options?: { includeFormAction?: boolean },
): void {
  const includeFormAction = options?.includeFormAction ?? true;
  // 将 nonce 添加到响应头，供页面使用
  response.headers.set("x-nonce", nonce);

  // 更新 CSP 标头以使用 nonce
  // Note: 在开发环境中使用更宽松的 CSP 策略以避免 hydration 问题
  // 生产环境应该使用更严格的策略
  const isDev = process.env.NODE_ENV === "development";

  // Note: Next.js generates inline scripts for hydration that cannot receive nonces
  // Therefore we must use 'unsafe-inline' for script-src in both dev and production
  // This is a known Next.js limitation: https://github.com/vercel/next.js/issues/18557
  const csp = [
    "default-src 'self'",
    // 'unsafe-inline' is required for Next.js hydration scripts
    // 'unsafe-eval' is needed for some Next.js features in development
    `script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com https://ssl.google-analytics.com https://pagead2.googlesyndication.com https://www.googleadservices.com https://googleads.g.doubleclick.net https://fundingchoicesmessages.google.com https://ep1.adtrafficquality.google https://ep2.adtrafficquality.google`,
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data: https: blob:",
    "connect-src 'self' https://openrouter.ai https://www.google-analytics.com https://analytics.google.com https://stats.g.doubleclick.net https://pagead2.googlesyndication.com https://www.googleadservices.com https://googleads.g.doubleclick.net https://fundingchoicesmessages.google.com https://ep1.adtrafficquality.google https://ep2.adtrafficquality.google",
    "frame-src 'self' https://googleads.g.doubleclick.net https://tpc.googlesyndication.com https://fundingchoicesmessages.google.com https://ep1.adtrafficquality.google https://ep2.adtrafficquality.google https://www.google.com",
    "media-src 'self'",
    "object-src 'none'",
    "base-uri 'self'",
    includeFormAction ? "form-action 'self'" : "",
    isDev ? "" : "frame-ancestors 'none'",
    isDev ? "" : "upgrade-insecure-requests",
  ]
    .filter(Boolean)
    .join("; ");

  response.headers.set("Content-Security-Policy", csp);
}

// 处理页面缓存
function handlePageCaching(
  request: NextRequest,
  startTime: number,
  nonce: string,
): NextResponse {
  const response = NextResponse.next();
  const pathname = request.nextUrl.pathname;

  // 从路径中提取实际页面路径（去除语言前缀）
  const segments = pathname.split("/").filter(Boolean);
  const firstSegment = segments[0] ?? "";
  const hasLocalePrefix = isValidLocale(firstSegment);
  const actualPath = hasLocalePrefix
    ? "/" + segments.slice(1).join("/")
    : pathname;

  // 为页面设置适当的缓存头部
  if (actualPath === "/" || actualPath === "") {
    // 首页 - 短期缓存
    response.headers.set("Cache-Control", "public, max-age=60, s-maxage=300");
    addServerTiming(response, startTime, "page-home");
  } else if (actualPath.startsWith("/messages")) {
    // 消息页面 - 中期缓存
    response.headers.set("Cache-Control", "public, max-age=300, s-maxage=600");
    addServerTiming(response, startTime, "page-messages");
  } else if (pathname.startsWith("/api/")) {
    // API路由
    addServerTiming(response, startTime, "page-api");
  } else {
    // 其他页面 - 验证缓存
    response.headers.set("Cache-Control", "public, max-age=0, must-revalidate");
    addServerTiming(response, startTime, "page-other");
  }

  // 添加Vary头部 - 包含Accept-Language以支持多语言缓存
  response.headers.set("Vary", "Accept-Encoding, User-Agent, Accept-Language");

  // 添加安全标头
  addSecurityHeaders(response, nonce);

  return response;
}

// 生成简单的ETag
function generateSimpleETag(content: string): string {
  // 简单的哈希函数（生产环境应使用更强的哈希）
  let hash = 0;
  for (let i = 0; i < content.length; i++) {
    const char = content.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // 转换为32位整数
  }
  return `"${Math.abs(hash).toString(36)}"`;
}

// 配置中间件匹配路径
export const config = {
  matcher: [
    /*
     * 匹配所有请求路径，除了以下开头的路径:
     * - _next/static (静态文件)
     * - _next/image (图像优化文件)
     * - favicon.ico (favicon文件)
     * - manifest.webmanifest (PWA manifest)
     * - sw.js (Service Worker)
     * - robots.txt (搜索引擎爬虫)
     * - sitemap.xml (网站地图)
     * - ads.txt (广告配置)
     */
    "/((?!_next/static|_next/image|favicon.ico|manifest.webmanifest|sw.js|robots.txt|sitemap.xml|ads.txt).*)",
  ],
};
