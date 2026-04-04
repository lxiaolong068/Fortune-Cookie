// Fortune Cookie AI - Service Worker
// 提供离线支持和缓存管理

const CACHE_NAME = "fortune-cookie-ai-v4";
const STATIC_CACHE_NAME = "fortune-static-v4";
const DYNAMIC_CACHE_NAME = "fortune-dynamic-v4";
const API_CACHE_NAME = "fortune-api-v4";

// 需要预缓存的关键静态资源（仅限关键资源，避免HTML路由）
// 注意：不包含 /offline（该路由不存在），避免 caches.addAll() 因 404 失败
const STATIC_ASSETS = [
  "/app-manifest.json",
  "/favicon.ico",
  "/apple-touch-icon.png",
  "/favicon-32x32.png",
  "/favicon-16x16.png",
  // 不再预缓存HTML路由，避免过时内容问题
];

// 不应该被缓存的路径（管理页面和分析页面）
const NEVER_CACHE_PATHS = [
  "/admin",
  "/analytics",
  "/api/analytics",
  "/api/admin",
];

// 短期缓存的HTML路由（设置保守的TTL）
const SHORT_CACHE_ROUTES = [
  "/",
  "/generator",
  "/messages",
  "/browse",
  "/history",
];

// 需要缓存的API端点
const CACHEABLE_APIS = ["/api/fortunes", "/api/fortune"];

// 离线时的回退页面（使用内联 HTML，/offline 路由不存在）
const OFFLINE_PAGE = null;
const OFFLINE_API_RESPONSE = {
  success: false,
  error: "Offline mode - please check your internet connection",
  offline: true,
  timestamp: new Date().toISOString(),
};

// 安装事件 - 预缓存静态资源
self.addEventListener("install", (event) => {
  console.log("Service Worker: Installing...");

  event.waitUntil(
    Promise.all([
      // 缓存静态资源
      caches.open(STATIC_CACHE_NAME).then((cache) => {
        console.log("Service Worker: Caching static assets");
        return cache.addAll(STATIC_ASSETS);
      }),

      // 预缓存一些幸运饼干数据
      caches.open(API_CACHE_NAME).then((cache) => {
        console.log("Service Worker: Pre-caching API data");
        return fetch("/api/fortunes?action=popular&limit=10")
          .then((response) => {
            if (response.ok) {
              cache.put(
                "/api/fortunes?action=popular&limit=10",
                response.clone(),
              );
            }
            return response;
          })
          .catch(() => {
            // 如果网络请求失败，缓存一个默认响应
            const defaultResponse = new Response(
              JSON.stringify({
                results: [
                  {
                    id: "offline-1",
                    message: "Even offline, hope lights the way forward.",
                    category: "inspirational",
                    mood: "positive",
                    source: "offline",
                    offline: true,
                  },
                  {
                    id: "offline-2",
                    message: "Challenges are stepping stones to success.",
                    category: "motivational",
                    mood: "positive",
                    source: "offline",
                    offline: true,
                  },
                ],
                total: 2,
                offline: true,
              }),
              {
                headers: { "Content-Type": "application/json" },
              },
            );

            return cache.put(
              "/api/fortunes?action=popular&limit=10",
              defaultResponse,
            );
          });
      }),
    ]).then(() => {
      console.log("Service Worker: Installation complete");
      // 强制激活新的Service Worker
      return self.skipWaiting();
    }),
  );
});

// 激活事件 - 清理旧缓存
self.addEventListener("activate", (event) => {
  console.log("Service Worker: Activating...");

  event.waitUntil(
    Promise.all([
      // 清理旧版本的缓存
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (
              cacheName !== STATIC_CACHE_NAME &&
              cacheName !== DYNAMIC_CACHE_NAME &&
              cacheName !== API_CACHE_NAME
            ) {
              console.log("Service Worker: Deleting old cache:", cacheName);
              return caches.delete(cacheName);
            }
          }),
        );
      }),

      // 立即控制所有客户端
      self.clients.claim(),
    ]).then(() => {
      console.log("Service Worker: Activation complete");
    }),
  );
});

// 获取事件 - 处理网络请求
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // 只处理同源请求
  if (url.origin !== location.origin) {
    return;
  }

  // 根据请求类型选择不同的缓存策略
  if (request.method === "GET") {
    if (url.pathname.startsWith("/api/")) {
      // API请求 - 网络优先策略
      event.respondWith(handleApiRequest(request));
    } else if (isStaticAsset(url.pathname)) {
      // 静态资源 - 缓存优先策略
      event.respondWith(handleStaticRequest(request));
    } else {
      // 页面请求 - 网络优先，缓存回退策略
      event.respondWith(handlePageRequest(request));
    }
  }
});

// 处理API请求 - Stale-While-Revalidate 策略
async function handleApiRequest(request) {
  const url = new URL(request.url);
  if (!isCacheableApi(url.pathname)) {
    return fetch(request);
  }

  const cache = await caches.open(API_CACHE_NAME);

  // 立即从缓存获取（如果有）
  const cachedResponse = await cache.match(request);

  // 在后台发起网络请求更新缓存
  const networkPromise = fetch(request)
    .then(async (networkResponse) => {
      if (networkResponse.ok && isCacheableApi(url.pathname)) {
        // 添加时间戳到响应头
        const headers = new Headers(networkResponse.headers);
        headers.set("sw-cached-at", Date.now().toString());

        const body = await networkResponse.clone().blob();
        const responseToCache = new Response(body, {
          status: networkResponse.status,
          statusText: networkResponse.statusText,
          headers,
        });

        // 异步更新缓存，不阻塞响应
        cache.put(request, responseToCache).catch((err) => {
          console.warn("Failed to update cache:", err);
        });
      }
      return networkResponse;
    })
    .catch((error) => {
      console.log("Service Worker: Network request failed:", error);
      return null;
    });

  // 如果有缓存，立即返回缓存（Stale）
  if (cachedResponse) {
    // 在后台更新缓存（Revalidate）
    networkPromise.catch(() => {}); // 静默处理网络错误
    return cachedResponse;
  }

  // 没有缓存，等待网络请求
  const networkResponse = await networkPromise;
  if (networkResponse) {
    return networkResponse;
  }

  // 网络失败且无缓存，返回离线响应
  return new Response(JSON.stringify(OFFLINE_API_RESPONSE), {
    status: 503,
    statusText: "Service Unavailable",
    headers: { "Content-Type": "application/json" },
  });
}

// 处理静态资源请求 - Cache First with Background Refresh
async function handleStaticRequest(request) {
  const cache = await caches.open(STATIC_CACHE_NAME);

  // 立即从缓存获取
  const cachedResponse = await cache.match(request);

  // 在后台刷新缓存
  const networkPromise = fetch(request)
    .then(async (networkResponse) => {
      if (networkResponse.ok) {
        // 添加时间戳
        const headers = new Headers(networkResponse.headers);
        headers.set("sw-cached-at", Date.now().toString());

        const body = await networkResponse.clone().blob();
        const responseToCache = new Response(body, {
          status: networkResponse.status,
          statusText: networkResponse.statusText,
          headers,
        });

        // 异步更新缓存
        cache.put(request, responseToCache).catch((err) => {
          console.warn("Failed to update static cache:", err);
        });
      }
      return networkResponse;
    })
    .catch((error) => {
      console.log(
        "Service Worker: Static asset network request failed:",
        error,
      );
      return null;
    });

  // 如果有缓存，立即返回
  if (cachedResponse) {
    networkPromise.catch(() => {}); // 静默处理网络错误
    return cachedResponse;
  }

  // 没有缓存，等待网络请求
  const networkResponse = await networkPromise;
  if (networkResponse) {
    return networkResponse;
  }

  // 网络失败且无缓存
  return new Response("Resource not available offline", {
    status: 503,
    statusText: "Service Unavailable",
  });
}

// 检查路径是否应该被缓存
function shouldCachePage(pathname) {
  // 永远不缓存的路径
  if (NEVER_CACHE_PATHS.some((path) => pathname.startsWith(path))) {
    return false;
  }

  // 只缓存特定的路由
  return SHORT_CACHE_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(route + "/"),
  );
}

// 处理页面请求 - 网络优先，有选择性的缓存策略
async function handlePageRequest(request) {
  const url = new URL(request.url);
  const pathname = url.pathname;

  try {
    // 尝试网络请求
    // For 'navigate' requests (full page loads) we must NOT pass the original
    // request object because the browser sets redirect:'manual' in that mode.
    // A server-side language redirect (e.g. / → /es) would then return a 307
    // with response.ok=false and we'd wrongly show the offline page.
    // Using fetch(request.url) issues a fresh request with redirect:'follow'.
    //
    // For all other modes (RSC soft-navigation, prefetch, etc.) we MUST pass
    // the original request so that Next.js App Router headers are preserved:
    //   RSC: 1 / Next-Router-State-Tree / Next-Router-Prefetch
    // Without them the server returns full HTML instead of an RSC payload,
    // which can cause Next.js to fall back to a hard navigation and trigger
    // the language-cookie reset bug in middleware.
    const networkResponse = request.mode === 'navigate'
      ? await fetch(request.url)
      : await fetch(request);

    if (networkResponse.ok) {
      // 只缓存允许的页面，并设置较短的TTL
      if (shouldCachePage(pathname)) {
        const cache = await caches.open(DYNAMIC_CACHE_NAME);
        const responseClone = networkResponse.clone();

        try {
          // clone response to avoid locking the stream we return to the browser
          const headers = new Headers(responseClone.headers);
          headers.set("sw-cached-at", Date.now().toString());
          headers.set("sw-cache-ttl", (5 * 60 * 1000).toString()); // 5分钟TTL

          const body = await responseClone.blob();
          const responseToCache = new Response(body, {
            status: responseClone.status,
            statusText: responseClone.statusText,
            headers,
          });

          await cache.put(request, responseToCache);
        } catch (cacheError) {
          console.warn(
            "Service Worker: Failed to cache page response",
            cacheError,
          );
        }
      }
      return networkResponse;
    }

    throw new Error(`Network response not ok: ${networkResponse.status}`);
  } catch (error) {
    console.log("Service Worker: Page request failed, trying cache:", error);

    // 检查是否应该使用缓存
    if (!shouldCachePage(pathname)) {
      // 对于不应缓存的页面，直接返回离线页面
      return getOfflinePage();
    }

    // 网络失败，尝试从缓存获取
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      // 检查缓存是否过期
      const cachedAt = cachedResponse.headers.get("sw-cached-at");
      const ttl = cachedResponse.headers.get("sw-cache-ttl");

      if (cachedAt && ttl) {
        const age = Date.now() - parseInt(cachedAt);
        if (age > parseInt(ttl)) {
          console.log(
            "Service Worker: Cached response expired, serving offline page",
          );
          return getOfflinePage();
        }
      }

      return cachedResponse;
    }

    // 缓存也没有，返回离线页面
    return getOfflinePage();
  }
}

// 获取离线页面的辅助函数
async function getOfflinePage() {
  // 直接返回内联离线页面（/offline 路由不存在）
  return new Response(
    `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Offline Mode - Fortune Cookie AI</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, sans-serif; text-align: center; padding: 2rem; }
        .offline-container { max-width: 400px; margin: 0 auto; }
        .offline-icon { font-size: 4rem; margin-bottom: 1rem; }
        .offline-title { color: #333; margin-bottom: 1rem; }
        .offline-message { color: #666; margin-bottom: 2rem; }
        .retry-button { background: #ff6b35; color: white; border: none; padding: 0.75rem 1.5rem; border-radius: 0.5rem; cursor: pointer; }
      </style>
    </head>
    <body>
      <div class="offline-container">
        <div class="offline-icon">🔮</div>
        <h1 class="offline-title">Offline Mode</h1>
        <p class="offline-message">You are currently offline. Please check your internet connection and try again.</p>
        <button class="retry-button" onclick="window.location.reload()">Reconnect</button>
      </div>
    </body>
    </html>
  `,
    {
      headers: { "Content-Type": "text/html" },
    },
  );
}

// 工具函数：检查是否为静态资源
// 注意：/_next/static/ 由 Vercel CDN 处理（immutable cache-control），
// 不在 SW 层缓存，避免新部署后 chunk 版本冲突导致 ERR_FAILED
function isStaticAsset(pathname) {
  return (
    pathname.startsWith("/static/") ||
    (pathname.includes(".") &&
      !pathname.includes("/api/") &&
      !pathname.startsWith("/_next/"))
  );
}

// 工具函数：检查API是否可缓存
function isCacheableApi(pathname) {
  return CACHEABLE_APIS.some((api) => pathname === api);
}

// 消息处理 - 与主线程通信
self.addEventListener("message", (event) => {
  const { type, payload } = event.data;

  switch (type) {
    case "SKIP_WAITING":
      self.skipWaiting();
      break;

    case "GET_CACHE_STATUS":
      getCacheStatus().then((status) => {
        event.ports[0].postMessage({ type: "CACHE_STATUS", payload: status });
      });
      break;

    case "CLEAR_CACHE":
      clearAllCaches().then(() => {
        event.ports[0].postMessage({ type: "CACHE_CLEARED" });
      });
      break;

    case "PREFETCH_CONTENT":
      prefetchContent(payload).then(() => {
        event.ports[0].postMessage({ type: "CONTENT_PREFETCHED" });
      });
      break;
  }
});

// 获取缓存状态
async function getCacheStatus() {
  const cacheNames = await caches.keys();
  const status = {};

  for (const cacheName of cacheNames) {
    const cache = await caches.open(cacheName);
    const keys = await cache.keys();
    status[cacheName] = keys.length;
  }

  return status;
}

// 清理所有缓存
async function clearAllCaches() {
  const cacheNames = await caches.keys();
  await Promise.all(cacheNames.map((name) => caches.delete(name)));
}

// 预取内容
async function prefetchContent(urls) {
  const cache = await caches.open(DYNAMIC_CACHE_NAME);

  for (const url of urls) {
    try {
      const response = await fetch(url);
      if (response.ok) {
        await cache.put(url, response);
      }
    } catch (error) {
      console.log("Service Worker: Failed to prefetch:", url, error);
    }
  }
}

console.log("Service Worker: Script loaded");

// ============================================================================
// Push Notification Support
// ============================================================================

// Push notification event - received when a push message arrives
self.addEventListener("push", (event) => {
  console.log("Service Worker: Push received");

  let notificationData = {
    title: "Fortune Cookie AI",
    body: "Your daily fortune is ready! 🥠",
    icon: "/apple-touch-icon.png",
    badge: "/favicon-32x32.png",
    tag: "daily-fortune",
    data: {
      url: "/",
      type: "daily-fortune",
    },
  };

  // Try to parse push data
  if (event.data) {
    try {
      const data = event.data.json();
      notificationData = {
        ...notificationData,
        ...data,
      };
    } catch (e) {
      // If not JSON, use text as body
      const text = event.data.text();
      if (text) {
        notificationData.body = text;
      }
    }
  }

  const { title, ...options } = notificationData;

  event.waitUntil(
    self.registration.showNotification(title, {
      ...options,
      vibrate: [200, 100, 200],
      requireInteraction: false,
      actions: [
        {
          action: "view",
          title: "View Fortune",
        },
        {
          action: "dismiss",
          title: "Dismiss",
        },
      ],
    }),
  );
});

// Notification click event
self.addEventListener("notificationclick", (event) => {
  console.log("Service Worker: Notification clicked", event.action);

  event.notification.close();

  if (event.action === "dismiss") {
    return;
  }

  // Default action or 'view' action - open the app
  const urlToOpen = event.notification.data?.url || "/";

  event.waitUntil(
    clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((windowClients) => {
        // Check if there's already a window open
        for (const client of windowClients) {
          if (client.url.includes(self.location.origin) && "focus" in client) {
            client.navigate(urlToOpen);
            return client.focus();
          }
        }
        // If no window is open, open a new one
        if (clients.openWindow) {
          return clients.openWindow(urlToOpen);
        }
      }),
  );
});

// Notification close event (for analytics)
self.addEventListener("notificationclose", (event) => {
  console.log("Service Worker: Notification closed without interaction");
});

// Push subscription change event
self.addEventListener("pushsubscriptionchange", (event) => {
  console.log("Service Worker: Push subscription changed");

  event.waitUntil(
    // Resubscribe with the same options
    self.registration.pushManager
      .subscribe(event.oldSubscription.options)
      .then((subscription) => {
        // Send new subscription to server
        return fetch("/api/push/resubscribe", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            oldEndpoint: event.oldSubscription.endpoint,
            newSubscription: subscription.toJSON(),
          }),
        });
      })
      .catch((error) => {
        console.error("Service Worker: Failed to resubscribe:", error);
      }),
  );
});
