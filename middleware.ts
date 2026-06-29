import { NextRequest, NextResponse } from "next/server";

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
  "/app-manifest.json",
  "/sw.js",
  "/robots.txt",
  "/sitemap.xml",
];

// 不需要处理的路径
const SKIP_PATHS = ["/_next", "/api/cache", "/__nextjs_original-stack-frame"];

// 根路径静态文件（直接返回，不做任何处理）
const STATIC_FILE_PATTERNS = [
  "app-manifest.json",
  "sw.js",
  "robots.txt",
  "sitemap.xml",
  "ads.txt",
  "site.webmanifest",
];

// 已知爬虫和自动化工具的 User-Agent 关键词
const BOT_USER_AGENTS = [
  "bot",
  "spider",
  "crawl",
  "slurp",
  "mediapartners",
  "headlesschrome",
  "puppeteer",
  "phantom",
  "selenium",
  "lighthouse",
  "pagespeed",
  "gtmetrix",
  "pingdom",
  "uptimerobot",
  "statuscake",
  "sitechecker",
];

function isBot(userAgent: string | null): boolean {
  if (!userAgent) return false;
  const ua = userAgent.toLowerCase();
  return BOT_USER_AGENTS.some((bot) => ua.includes(bot));
}

// 生成 CSP Nonce
function generateNonce(): string {
  const array = new Uint8Array(16);
  crypto.getRandomValues(array);
  return Buffer.from(array).toString("base64");
}

export function middleware(request: NextRequest) {
  const startTime = Date.now();
  const { pathname } = request.nextUrl;

  // Bot 检测 — 对已知爬虫设置标记并跳过分析相关处理
  const userAgent = request.headers.get("user-agent");
  if (isBot(userAgent)) {
    const response = NextResponse.next();
    response.headers.set("X-Is-Bot", "true");
    return response;
  }

  // 生成 CSP Nonce
  const nonce = generateNonce();

  // 根路径静态文件（如 /app-manifest.json）直接返回
  if (STATIC_FILE_PATTERNS.some((file) => pathname === `/${file}`)) {
    return handleStaticAssets(request, startTime);
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

  // 处理页面缓存
  return handlePageCaching(request, startTime, nonce);
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
  const pathname = request.nextUrl.pathname;

  // app-manifest.json 和 sw.js 使用短缓存，其他静态资源使用长期缓存
  if (pathname === "/app-manifest.json" || pathname === "/site.webmanifest") {
    // PWA manifest - 短缓存以便快速更新
    response.headers.set(
      "Cache-Control",
      "no-store, no-cache, must-revalidate",
    );
    response.headers.set("CDN-Cache-Control", "no-store");
  } else if (pathname === "/sw.js") {
    // Service Worker - 不缓存以确保更新
    response.headers.set(
      "Cache-Control",
      "no-store, no-cache, must-revalidate",
    );
    response.headers.set("CDN-Cache-Control", "no-store");
  } else {
    // 其他静态资源 - 长期缓存
    response.headers.set(
      "Cache-Control",
      "public, max-age=31536000, immutable",
    );
    response.headers.set("CDN-Cache-Control", "public, max-age=31536000");
  }

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

  if (ifNoneMatch === etag) {
    // 返回 304 Not Modified
    const response = new NextResponse(null, {
      status: 304,
      statusText: "Not Modified",
      headers: {
        ETag: etag,
        "Cache-Control": "public, max-age=600, stale-while-revalidate=300",
        "CDN-Cache-Control": "public, max-age=600",
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

  // 根据 API 类型设置不同的缓存策略 (optimized for low-traffic)
  if (pathname.includes("/fortunes")) {
    // 幸运饼干数据 - 延长缓存以提高命中率
    response.headers.set(
      "Cache-Control",
      "public, max-age=600, stale-while-revalidate=300",
    );
    response.headers.set("CDN-Cache-Control", "public, max-age=600");
  } else if (pathname.includes("/analytics")) {
    // 分析数据 - 适度延长
    response.headers.set(
      "Cache-Control",
      "public, max-age=120, stale-while-revalidate=60",
    );
    response.headers.set("CDN-Cache-Control", "public, max-age=120");
  } else {
    // 默认 API 缓存 - 延长
    response.headers.set(
      "Cache-Control",
      "public, max-age=300, stale-while-revalidate=120",
    );
    response.headers.set("CDN-Cache-Control", "public, max-age=300");
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
    "frame-src 'self' https://www.youtube.com https://googleads.g.doubleclick.net https://tpc.googlesyndication.com https://fundingchoicesmessages.google.com https://ep1.adtrafficquality.google https://ep2.adtrafficquality.google https://www.google.com",
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

  // 为页面设置适当的缓存头部 (optimized for low-traffic: ~14 sessions/day)
  if (pathname === "/" || pathname === "") {
    // 首页 - 延长缓存以提高低流量下命中率
    response.headers.set(
      "Cache-Control",
      "public, max-age=120, s-maxage=600, stale-while-revalidate=300",
    );
    addServerTiming(response, startTime, "page-home");
  } else if (pathname.startsWith("/generator")) {
    // 生成器 - 中期缓存
    response.headers.set(
      "Cache-Control",
      "public, max-age=300, s-maxage=900, stale-while-revalidate=600",
    );
    addServerTiming(response, startTime, "page-generator");
  } else {
    // 其他页面 - 短缓存 + stale-while-revalidate 保证速度
    response.headers.set(
      "Cache-Control",
      "public, max-age=60, stale-while-revalidate=300",
    );
    addServerTiming(response, startTime, "page-other");
  }

  // 添加Vary头部
  response.headers.set("Vary", "Accept-Encoding, User-Agent");

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
     * - app-manifest.json (PWA manifest)
     * - sw.js (Service Worker)
     * - robots.txt (搜索引擎爬虫)
     * - sitemap.xml (网站地图)
     * - ads.txt (广告配置)
     */
    "/((?!_next/static|_next/image|favicon.ico|app-manifest.json|sw.js|robots.txt|sitemap.xml|ads.txt).*)",
  ],
};
