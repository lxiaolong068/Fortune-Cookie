/**
 * IndexNow API Client
 * 用于向搜索引擎提交 URL 更新通知
 * @see https://www.indexnow.org/documentation
 */

// IndexNow 配置
export const INDEXNOW_CONFIG = {
  apiKey: "4f58cae8b6004a7a88e13474e58418e1",
  host: process.env.INDEXNOW_HOST || "fortune-cookie.cc",
  keyLocation: `https://${process.env.INDEXNOW_HOST || "fortune-cookie.cc"}/4f58cae8b6004a7a88e13474e58418e1.txt`,
  // 支持的搜索引擎端点
  endpoints: [
    "https://api.indexnow.org/indexnow",
    "https://www.bing.com/indexnow",
    "https://yandex.com/indexnow",
  ],
} as const;

// IndexNow API 响应状态
export type IndexNowStatus =
  | "success" // 200 OK
  | "bad_request" // 400 Bad request
  | "forbidden" // 403 Forbidden (密钥无效)
  | "unprocessable" // 422 Unprocessable Entity
  | "rate_limited" // 429 Too Many Requests
  | "error"; // 其他错误

export interface IndexNowResult {
  status: IndexNowStatus;
  statusCode: number;
  message: string;
  endpoint?: string;
  urls?: string[];
}

export interface IndexNowBatchResult {
  success: boolean;
  results: IndexNowResult[];
  successCount: number;
  failedCount: number;
}

/**
 * 解析 IndexNow API 响应状态
 */
function parseStatusCode(statusCode: number): IndexNowStatus {
  switch (statusCode) {
    case 200:
    case 202:
      return "success";
    case 400:
      return "bad_request";
    case 403:
      return "forbidden";
    case 422:
      return "unprocessable";
    case 429:
      return "rate_limited";
    default:
      return "error";
  }
}

/**
 * 获取状态消息
 */
function getStatusMessage(status: IndexNowStatus): string {
  switch (status) {
    case "success":
      return "URL(s) successfully submitted";
    case "bad_request":
      return "Invalid request format";
    case "forbidden":
      return "Invalid API key";
    case "unprocessable":
      return "URL does not belong to the host or key mismatch";
    case "rate_limited":
      return "Too many requests, please try again later";
    default:
      return "Unknown error occurred";
  }
}

/**
 * 验证 URL 格式
 */
function validateUrl(url: string, host: string): boolean {
  try {
    const parsed = new URL(url);
    return parsed.hostname === host || parsed.hostname === `www.${host}`;
  } catch {
    return false;
  }
}

/**
 * 规范化 URL（确保包含协议）
 */
function normalizeUrl(url: string, host: string): string {
  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }
  if (url.startsWith("/")) {
    return `https://${host}${url}`;
  }
  return `https://${host}/${url}`;
}

/**
 * 提交单个 URL 到 IndexNow
 */
export async function submitUrl(url: string): Promise<IndexNowResult> {
  const normalizedUrl = normalizeUrl(url, INDEXNOW_CONFIG.host);

  if (!validateUrl(normalizedUrl, INDEXNOW_CONFIG.host)) {
    return {
      status: "unprocessable",
      statusCode: 422,
      message: `Invalid URL: ${url} does not belong to ${INDEXNOW_CONFIG.host}`,
      urls: [url],
    };
  }

  return submitUrls([normalizedUrl]);
}

/**
 * 批量提交 URL 到 IndexNow
 */
export async function submitUrls(urls: string[]): Promise<IndexNowResult> {
  if (!urls || urls.length === 0) {
    return {
      status: "bad_request",
      statusCode: 400,
      message: "No URLs provided",
      urls: [],
    };
  }

  // 规范化和验证所有 URL
  const normalizedUrls = urls.map((url) =>
    normalizeUrl(url, INDEXNOW_CONFIG.host),
  );
  const invalidUrls = normalizedUrls.filter(
    (url) => !validateUrl(url, INDEXNOW_CONFIG.host),
  );

  if (invalidUrls.length > 0) {
    return {
      status: "unprocessable",
      statusCode: 422,
      message: `Invalid URLs detected: ${invalidUrls.join(", ")}`,
      urls: invalidUrls,
    };
  }

  // IndexNow 限制每次最多 10,000 个 URL
  if (normalizedUrls.length > 10000) {
    return {
      status: "bad_request",
      statusCode: 400,
      message: "Too many URLs. Maximum 10,000 URLs per request.",
      urls: normalizedUrls,
    };
  }

  const requestBody = {
    host: INDEXNOW_CONFIG.host,
    key: INDEXNOW_CONFIG.apiKey,
    keyLocation: INDEXNOW_CONFIG.keyLocation,
    urlList: normalizedUrls,
  };

  // 尝试向第一个可用的端点提交
  const endpoint = INDEXNOW_CONFIG.endpoints[0];

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
      body: JSON.stringify(requestBody),
    });

    const status = parseStatusCode(response.status);

    return {
      status,
      statusCode: response.status,
      message: getStatusMessage(status),
      endpoint,
      urls: normalizedUrls,
    };
  } catch (error) {
    console.error("IndexNow submission error:", error);
    return {
      status: "error",
      statusCode: 500,
      message:
        error instanceof Error ? error.message : "Network error occurred",
      endpoint,
      urls: normalizedUrls,
    };
  }
}

/**
 * 向多个搜索引擎端点提交 URL（带重试机制）
 */
export async function submitUrlsToAllEngines(
  urls: string[],
): Promise<IndexNowBatchResult> {
  const results: IndexNowResult[] = [];
  let successCount = 0;
  let failedCount = 0;

  // 规范化 URL
  const normalizedUrls = urls.map((url) =>
    normalizeUrl(url, INDEXNOW_CONFIG.host),
  );

  for (const endpoint of INDEXNOW_CONFIG.endpoints) {
    try {
      const requestBody = {
        host: INDEXNOW_CONFIG.host,
        key: INDEXNOW_CONFIG.apiKey,
        keyLocation: INDEXNOW_CONFIG.keyLocation,
        urlList: normalizedUrls,
      };

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
        body: JSON.stringify(requestBody),
      });

      const status = parseStatusCode(response.status);
      const result: IndexNowResult = {
        status,
        statusCode: response.status,
        message: getStatusMessage(status),
        endpoint,
        urls: normalizedUrls,
      };

      results.push(result);

      if (status === "success") {
        successCount++;
      } else {
        failedCount++;
      }
    } catch (error) {
      console.error(`IndexNow submission error to ${endpoint}:`, error);
      results.push({
        status: "error",
        statusCode: 500,
        message:
          error instanceof Error ? error.message : "Network error occurred",
        endpoint,
        urls: normalizedUrls,
      });
      failedCount++;
    }
  }

  return {
    success: successCount > 0,
    results,
    successCount,
    failedCount,
  };
}

/**
 * 提交站点地图 URL 列表（用于批量更新）
 */
export async function submitSitemapUrls(): Promise<IndexNowResult> {
  const siteUrl = `https://${INDEXNOW_CONFIG.host}`;

  // 核心页面 URL
  const coreUrls = [
    `${siteUrl}/`,
    `${siteUrl}/generator`,
    `${siteUrl}/messages`,
    `${siteUrl}/about`,
    `${siteUrl}/history`,
    `${siteUrl}/blog`,
    `${siteUrl}/browse`,
  ];

  return submitUrls(coreUrls);
}

/**
 * 通知页面更新（用于内容发布/修改后调用）
 */
export async function notifyPageUpdate(
  path: string,
): Promise<IndexNowResult> {
  console.log(`[IndexNow] Notifying page update: ${path}`);
  return submitUrl(path);
}

/**
 * 通知博客文章更新
 */
export async function notifyBlogPostUpdate(
  slug: string,
): Promise<IndexNowResult> {
  const url = `/blog/${slug}`;
  console.log(`[IndexNow] Notifying blog post update: ${url}`);
  return submitUrl(url);
}

/**
 * 通知分类页面更新
 */
export async function notifyCategoryUpdate(
  category: string,
): Promise<IndexNowResult> {
  const url = `/browse/category/${category}`;
  console.log(`[IndexNow] Notifying category update: ${url}`);
  return submitUrl(url);
}

