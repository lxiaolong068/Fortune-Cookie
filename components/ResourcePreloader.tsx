"use client";

import { useEffect } from "react";
import { preloadHeavyComponents } from "./OptimizedDynamic";
import { getBlobUrl } from "@/lib/blob-urls";

/**
 * 智能资源预加载器
 * 根据用户行为和网络状况智能预加载资源
 */

interface PreloadConfig {
  // 是否启用预加载
  enabled: boolean;
  // 预加载延迟（毫秒）
  delay: number;
  // 网络条件阈值
  networkThreshold: "slow-2g" | "2g" | "3g" | "4g";
  // 是否在空闲时预加载
  useIdleCallback: boolean;
}

const DEFAULT_CONFIG: PreloadConfig = {
  enabled: true,
  delay: 2000, // 2秒后开始预加载
  networkThreshold: "3g",
  useIdleCallback: true,
};

export function ResourcePreloader({
  config = DEFAULT_CONFIG,
}: {
  config?: Partial<PreloadConfig>;
}) {
  const finalConfig = { ...DEFAULT_CONFIG, ...config };

  useEffect(() => {
    if (!finalConfig.enabled || typeof window === "undefined") return;

    // 检查网络条件
    const connection =
      (navigator as any).connection ||
      (navigator as any).mozConnection ||
      (navigator as any).webkitConnection;
    if (connection) {
      const effectiveType = connection.effectiveType;
      const networkTypes = ["slow-2g", "2g", "3g", "4g"];
      const currentIndex = networkTypes.indexOf(effectiveType);
      const thresholdIndex = networkTypes.indexOf(finalConfig.networkThreshold);

      // 如果网络条件低于阈值，不进行预加载
      if (currentIndex < thresholdIndex) {
        console.log("Network too slow for preloading:", effectiveType);
        return;
      }
    }

    // 检查数据保存模式
    if (connection?.saveData) {
      console.log("Data saver mode enabled, skipping preload");
      return;
    }

    // 检查设备内存（如果可用）
    const deviceMemory = (navigator as any).deviceMemory;
    if (deviceMemory && deviceMemory < 4) {
      console.log("Low memory device, reducing preload");
      // 在低内存设备上减少预加载
      return;
    }

    const startPreload = () => {
      console.log("Starting intelligent resource preload...");

      // 预加载重型组件
      preloadHeavyComponents();

      // 预加载关键路由
      preloadCriticalRoutes();

      // 预加载字体
      preloadFonts();

      // 预加载关键图片
      preloadCriticalImages();
    };

    if (finalConfig.useIdleCallback && "requestIdleCallback" in window) {
      // 在浏览器空闲时预加载
      const timeoutId = setTimeout(() => {
        window.requestIdleCallback(startPreload, { timeout: 5000 });
      }, finalConfig.delay);

      return () => clearTimeout(timeoutId);
    } else {
      // 回退到 setTimeout
      const timeoutId = setTimeout(startPreload, finalConfig.delay);
      return () => clearTimeout(timeoutId);
    }
  }, [finalConfig]);

  return null;
}

// 预加载关键路由
function preloadCriticalRoutes() {
  const criticalRoutes = ["/generator", "/browse", "/messages"];

  criticalRoutes.forEach((route) => {
    const link = document.createElement("link");
    link.rel = "prefetch";
    link.href = route;
    document.head.appendChild(link);
  });
}

// 预加载字体
function preloadFonts() {
  // Next.js 的 Inter 字体已经通过 next/font 优化
  // 这里可以添加其他自定义字体的预加载
}

// 预加载关键图片
// Note: og-image.png and fortune-cookie-hero.svg are not preloaded as they are
// only used for social sharing and homepage respectively, not critical for initial render
function preloadCriticalImages() {
  // Currently no critical images need preloading
  // Images are lazy-loaded or handled by Next.js Image component
}

/**
 * 智能预取组件
 * 基于用户交互预测性地加载资源
 */
export function IntelligentPrefetch() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    let prefetchTimeout: NodeJS.Timeout;

    // 监听鼠标悬停事件，预加载链接
    const handleMouseEnter = (event: MouseEvent) => {
      const target = event.target;
      if (!target || !(target instanceof Element)) return;
      const link = target.closest("a[href]") as HTMLAnchorElement | null;

      if (link && link.href && link.href.startsWith(window.location.origin)) {
        prefetchTimeout = setTimeout(() => {
          const prefetchLink = document.createElement("link");
          prefetchLink.rel = "prefetch";
          prefetchLink.href = link.href;
          document.head.appendChild(prefetchLink);
        }, 100); // 100ms 延迟，避免误触发
      }
    };

    const handleMouseLeave = () => {
      if (prefetchTimeout) {
        clearTimeout(prefetchTimeout);
      }
    };

    // 监听触摸开始事件（移动端）
    const handleTouchStart = (event: TouchEvent) => {
      const target = event.target;
      if (!target || !(target instanceof Element)) return;
      const link = target.closest("a[href]") as HTMLAnchorElement | null;

      if (link && link.href && link.href.startsWith(window.location.origin)) {
        const prefetchLink = document.createElement("link");
        prefetchLink.rel = "prefetch";
        prefetchLink.href = link.href;
        document.head.appendChild(prefetchLink);
      }
    };

    // 添加事件监听器
    document.addEventListener("mouseenter", handleMouseEnter, true);
    document.addEventListener("mouseleave", handleMouseLeave, true);
    document.addEventListener("touchstart", handleTouchStart, true);

    return () => {
      document.removeEventListener("mouseenter", handleMouseEnter, true);
      document.removeEventListener("mouseleave", handleMouseLeave, true);
      document.removeEventListener("touchstart", handleTouchStart, true);
      if (prefetchTimeout) {
        clearTimeout(prefetchTimeout);
      }
    };
  }, []);

  return null;
}

/**
 * 关键资源预加载器
 * 在页面加载时立即预加载关键资源
 */
export function CriticalResourcePreloader() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    // 预加载关键 DNS
    const criticalDomains = [
      "fonts.googleapis.com",
      "fonts.gstatic.com",
      "openrouter.ai",
    ];

    criticalDomains.forEach((domain) => {
      const link = document.createElement("link");
      link.rel = "dns-prefetch";
      link.href = `//${domain}`;
      document.head.appendChild(link);
    });

    // 预连接到关键域名
    const preconnectDomains = [
      "https://fonts.googleapis.com",
      "https://fonts.gstatic.com",
    ];

    preconnectDomains.forEach((domain) => {
      const link = document.createElement("link");
      link.rel = "preconnect";
      link.href = domain;
      link.crossOrigin = "anonymous";
      document.head.appendChild(link);
    });
  }, []);

  return null;
}

/**
 * 组合预加载器
 * 整合所有预加载功能
 */
export function OptimizedPreloader() {
  return (
    <>
      <CriticalResourcePreloader />
      <ResourcePreloader />
      <IntelligentPrefetch />
    </>
  );
}
