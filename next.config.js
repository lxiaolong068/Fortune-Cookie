// Injected content via Sentry wizard below

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Image optimization
  images: {
    // Use remotePatterns (recommended) instead of deprecated domains
    remotePatterns: [
      {
        protocol: "https",
        hostname: "oxnbbm6ljoyuzqns.public.blob.vercel-storage.com",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "localhost",
      },
      {
        protocol: "https",
        hostname: "via.placeholder.com",
      },
    ],
    formats: ["image/webp", "image/avif"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days
  },
  // Skip ESLint only on Vercel to avoid deploy failures.
  // Local `npm run lint` and local `next build` still run lint.
  eslint: {
    ignoreDuringBuilds: process.env.VERCEL === "1",
  },

  // 安全和SEO优化配置
  async headers() {
    return [
      // 静态资源缓存 - 长期缓存不可变资源
      {
        source: "/_next/static/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      // 图片资源缓存
      {
        source: "/images/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      // Favicon 和图标缓存
      {
        source:
          "/:path(favicon\\.ico|apple-touch-icon\\.png|favicon-.*\\.png|android-chrome-.*\\.png|.*\\.svg)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=86400, stale-while-revalidate=604800",
          },
        ],
      },
      // Manifest 文件缓存
      {
        source: "/manifest.webmanifest",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=86400, stale-while-revalidate=604800",
          },
        ],
      },
      // ads.txt 和 robots.txt - 确保正确的 Content-Type 和缓存
      {
        source: "/:path(ads\\.txt|robots\\.txt)",
        headers: [
          {
            key: "Content-Type",
            value: "text/plain; charset=utf-8",
          },
          {
            key: "Cache-Control",
            value: "public, max-age=3600, must-revalidate",
          },
        ],
      },
      {
        source: "/(.*)",
        headers: [
          // 基础安全头部
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "origin-when-cross-origin",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          {
            key: "X-DNS-Prefetch-Control",
            value: "on",
          },
          // Content Security Policy 已在 middleware.ts 中配置
          // 在 middleware 中配置 CSP 可以支持动态 nonce 生成，提供更好的安全性
          // 参见 middleware.ts 中的 addSecurityHeaders() 函数
          // 权限策略
          {
            key: "Permissions-Policy",
            value:
              "camera=(), microphone=(), geolocation=(), interest-cohort=()",
          },
          // 严格传输安全 (HSTS) - 仅在生产环境有效
          {
            key: "Strict-Transport-Security",
            value: "max-age=31536000; includeSubDomains; preload",
          },
          // Cross-Origin 策略已移除
          // 原因：COOP/COEP/CORP 头部会导致 Next.js 开发模式下的 hydration 失败
          // 这些头部主要用于启用 SharedArrayBuffer 等高级功能
          // 对于大多数 Web 应用来说，这些头部不是必需的
          // 如果需要这些功能，请在生产环境的 CDN/反向代理层配置
        ],
      },
      // API路由的CORS配置
      {
        source: "/api/(.*)",
        headers: [
          {
            key: "Access-Control-Allow-Origin",
            value:
              process.env.NODE_ENV === "production"
                ? process.env.NEXT_PUBLIC_APP_URL || "https://your-domain.com"
                : "*",
          },
          {
            key: "Access-Control-Allow-Methods",
            value: "GET, POST, OPTIONS",
          },
          {
            key: "Access-Control-Allow-Headers",
            value: "Content-Type, Authorization, X-Requested-With",
          },
          {
            key: "Access-Control-Max-Age",
            value: "86400",
          },
        ],
      },
    ];
  },
  // 确保 ads.txt 和 robots.txt 在所有域名上都可访问（不重定向）
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: "/ads.txt",
          destination: "/ads.txt",
        },
        {
          source: "/robots.txt",
          destination: "/robots.txt",
        },
      ],
    };
  },
  // 性能优化
  compress: true,
  poweredByHeader: false,
  // 静态文件优化
  trailingSlash: false,
  // 构建优化
  swcMinify: true,

  // Compiler 配置 - 针对现代浏览器优化
  // Next.js 14 使用 SWC，会自动读取 package.json 中的 browserslist
  // 这将移除不必要的 polyfills 和转译
  compiler: {
    // 不移除 console.log，保持原有行为
    removeConsole: false,
  },

  // 针对现代浏览器的目标配置
  transpilePackages: [],

  // 生产环境优化
  // 启用 source maps 以便于调试和错误追踪
  // Source maps 将被上传到错误监控服务，不会暴露给最终用户
  productionBrowserSourceMaps: true,

  // 实验性性能优化
  experimental: {
    optimizePackageImports: [
      "lucide-react",
      "@radix-ui/react-checkbox",
      "@radix-ui/react-dropdown-menu",
      "@radix-ui/react-label",
      "@radix-ui/react-progress",
      "@radix-ui/react-select",
      "@radix-ui/react-separator",
      "@radix-ui/react-slot",
      "@radix-ui/react-switch",
      "@radix-ui/react-tabs",
      "recharts",
      "framer-motion",
    ],
    instrumentationHook: true,
    // 启用 turbo 模式以提升构建性能
    turbo: {
      rules: {
        "*.svg": {
          loaders: ["@svgr/webpack"],
          as: "*.js",
        },
      },
    },
  },

  // Bundle analyzer and webpack optimizations
  webpack: (config, { isServer, dev }) => {
    // Bundle analyzer (only in analyze mode)
    if (process.env.ANALYZE === "true" && !isServer) {
      const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");
      config.plugins.push(
        new BundleAnalyzerPlugin({
          analyzerMode: "static",
          openAnalyzer: false,
          reportFilename: "../bundle-analyzer-report.html",
        }),
      );
    }

    // 性能优化配置
    if (!dev) {
      // 代码分割优化 - 减少初始 bundle 大小
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          ...config.optimization.splitChunks,
          chunks: "all",
          maxInitialRequests: 25,
          minSize: 20000,
          cacheGroups: {
            ...config.optimization.splitChunks.cacheGroups,
            // 默认 vendor chunk
            defaultVendors: {
              test: /[\\/]node_modules[\\/]/,
              priority: -10,
              reuseExistingChunk: true,
              name(module) {
                const match = module.context.match(
                  /[\\/]node_modules[\\/](.*?)([\\/]|$)/,
                );
                if (!match) return "vendors";
                const packageName = match[1];
                return `npm.${packageName.replace("@", "")}`;
              },
            },
            // 将大型UI库分离到单独的chunk（异步加载）
            radixui: {
              test: /[\\/]node_modules[\\/]@radix-ui[\\/]/,
              name: "radix-ui",
              chunks: "async",
              priority: 30,
              reuseExistingChunk: true,
            },
            // 将图表库分离（异步加载）
            recharts: {
              test: /[\\/]node_modules[\\/]recharts[\\/]/,
              name: "recharts",
              chunks: "async",
              priority: 25,
              reuseExistingChunk: true,
            },
            // 将动画库分离（异步加载以减少初始 bundle）
            framerMotion: {
              test: /[\\/]node_modules[\\/]framer-motion[\\/]/,
              name: "framer-motion",
              chunks: "async",
              priority: 20,
              reuseExistingChunk: true,
            },
            // 将图标库分离（异步加载）
            lucide: {
              test: /[\\/]node_modules[\\/]lucide-react[\\/]/,
              name: "lucide-react",
              chunks: "async",
              priority: 15,
              reuseExistingChunk: true,
            },
            // React 核心库保持同步
            react: {
              test: /[\\/]node_modules[\\/](react|react-dom|scheduler)[\\/]/,
              name: "react",
              chunks: "all",
              priority: 40,
              reuseExistingChunk: true,
            },
            // 公共代码
            common: {
              minChunks: 2,
              priority: -20,
              reuseExistingChunk: true,
            },
          },
        },
      };
    }

    return config;
  },

  // 环境变量
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
};

module.exports = nextConfig;
