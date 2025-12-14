import { NextRequest, NextResponse } from "next/server";
import {
  WebVitalMetric,
  createSuccessResponse,
  createErrorResponse,
  isWebVitalMetric,
} from "@/types/api";

type StoredWebVitalMetric = WebVitalMetric & {
  timestamp: number;
  userAgent: string;
  url: string;
  connectionType: string;
  deviceMemory: string;
  effectiveType: string;
  sampled: boolean;
  samplingRate: number;
};

// In-memory storage for demo (use a real database in production)
const metricsStore: StoredWebVitalMetric[] = [];

// 安全工具函数
function getCorsOrigin(): string {
  if (process.env.NODE_ENV === "production") {
    return process.env.NEXT_PUBLIC_APP_URL || "https://your-domain.com";
  }
  return "*";
}

function addSecurityHeaders(response: NextResponse): NextResponse {
  response.headers.set("Access-Control-Allow-Origin", getCorsOrigin());
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-XSS-Protection", "1; mode=block");
  return response;
}

// RUM采样率函数 - 根据指标类型和性能情况调整采样率
function getSamplingRate(metricName: string, value: number): number {
  // 基础采样率
  let baseRate = 0.1; // 10% 基础采样率

  // 根据指标类型调整
  switch (metricName) {
    case "LCP":
      // LCP是关键指标，提高采样率
      baseRate = 0.2;
      // 对于性能差的情况，提高采样率以便调试
      if (value > 4000)
        baseRate = 0.5; // 超过4秒的LCP
      else if (value > 2500) baseRate = 0.3; // 超过2.5秒的LCP
      break;
    case "INP":
      baseRate = 0.15;
      if (value > 500)
        baseRate = 0.4; // 超过500ms的INP
      else if (value > 200) baseRate = 0.25; // 超过200ms的INP
      break;
    case "CLS":
      baseRate = 0.1;
      if (value > 0.25)
        baseRate = 0.4; // 超过0.25的CLS
      else if (value > 0.1) baseRate = 0.2; // 超过0.1的CLS
      break;
    case "FCP":
      baseRate = 0.1;
      if (value > 3000) baseRate = 0.3; // 超过3秒的FCP
      break;
    case "TTFB":
      baseRate = 0.1;
      if (value > 1800) baseRate = 0.3; // 超过1.8秒的TTFB
      break;
  }

  return Math.min(baseRate, 1.0); // 确保不超过100%
}

export async function POST(request: NextRequest) {
  try {
    let metric: unknown;

    // 解析和验证请求体
    try {
      metric = await request.json();
    } catch {
      const response = NextResponse.json(
        { error: "Invalid JSON in request body" },
        { status: 400 },
      );
      return addSecurityHeaders(response);
    }

    // 全面验证指标数据
    if (!isWebVitalMetric(metric)) {
      const response = NextResponse.json(
        createErrorResponse(
          "Invalid metric data. Required fields: id, name, value, delta, rating",
        ),
        { status: 400 },
      );
      return addSecurityHeaders(response);
    }

    // 限制存储的指标数量（防止内存泄漏）
    if (metricsStore.length > 10000) {
      metricsStore.splice(0, 1000); // 移除最旧的1000条记录
    }

    // 安全地获取请求头信息
    const userAgent = request.headers.get("user-agent")?.slice(0, 500) || "";
    const referer = request.headers.get("referer")?.slice(0, 500) || "";

    // 获取额外的RUM数据
    const connectionType = request.headers.get("connection-type") || "unknown";
    const deviceMemory = request.headers.get("device-memory") || "unknown";
    const effectiveType = request.headers.get("effective-type") || "unknown";

    // 实现采样逻辑 - 只存储一定比例的数据以避免存储过载
    const samplingRate = getSamplingRate(metric.name, metric.value);
    const shouldSample = Math.random() < samplingRate;

    // Store the metric (in production, save to database)
    if (shouldSample) {
      metricsStore.push({
        ...metric,
        timestamp: Date.now(),
        userAgent,
        url: referer,
        connectionType,
        deviceMemory,
        effectiveType,
        sampled: true,
        samplingRate,
      });
    }

    // Log performance issues
    const thresholds = {
      CLS: { good: 0.1, poor: 0.25 },
      INP: { good: 200, poor: 500 },
      FCP: { good: 1800, poor: 3000 },
      LCP: { good: 2500, poor: 4000 },
      TTFB: { good: 800, poor: 1800 },
    };

    const threshold = thresholds[metric.name as keyof typeof thresholds];
    if (threshold) {
      if (metric.value > threshold.poor) {
        console.warn(`Poor ${metric.name}: ${metric.value}`);
      } else if (metric.value > threshold.good) {
        console.log(`Needs improvement ${metric.name}: ${metric.value}`);
      }
    }

    const response = NextResponse.json(
      createSuccessResponse({ success: true }),
    );
    return addSecurityHeaders(response);
  } catch (error) {
    console.error("Web Vitals API error:", error);
    const response = NextResponse.json(
      createErrorResponse("Failed to process metric"),
      { status: 500 },
    );
    return addSecurityHeaders(response);
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const metric = searchParams.get("metric");
    const limitParam = searchParams.get("limit") || "100";

    // 验证和清理参数
    const validMetrics = ["CLS", "INP", "FCP", "LCP", "TTFB"];
    const sanitizedMetric =
      metric && validMetrics.includes(metric) ? metric : null;

    const limit = Math.min(Math.max(parseInt(limitParam) || 100, 1), 1000); // 限制在1-1000之间

    let results = metricsStore;

    if (sanitizedMetric) {
      results = results.filter((m) => m.name === sanitizedMetric);
    }

    // Get recent metrics
    results = results
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, limit);

    // Calculate averages and sampling statistics
    const averages = results.reduce(
      (acc, metric) => {
        if (!acc[metric.name]) {
          acc[metric.name] = {
            total: 0,
            count: 0,
            average: 0,
            sampledCount: 0,
            totalSampled: 0,
          };
        }
        const metricData = acc[metric.name];
        if (metricData) {
          metricData.total += metric.value;
          metricData.count += 1;
          metricData.average = metricData.total / metricData.count;

          // Track sampling statistics
          if (metric.sampled) {
            metricData.sampledCount += 1;
            metricData.totalSampled += metric.value;
          }
        }
        return acc;
      },
      {} as Record<
        string,
        {
          total: number;
          count: number;
          average: number;
          sampledCount: number;
          totalSampled: number;
        }
      >,
    );

    // Calculate performance outliers (values above 95th percentile)
    const outliers = results
      .filter((metric) => {
        const thresholds = {
          CLS: 0.25,
          INP: 500,
          FCP: 3000,
          LCP: 4000,
          TTFB: 1800,
        };
        return (
          metric.value >
          (thresholds[metric.name as keyof typeof thresholds] || 0)
        );
      })
      .slice(0, 50); // Limit outliers to prevent large responses

    const response = NextResponse.json(
      createSuccessResponse({
        metrics: results,
        averages,
        outliers,
        total: results.length,
        samplingInfo: {
          totalSampled: results.filter((m) => m.sampled).length,
          totalReceived: metricsStore.length,
          samplingRatio:
            results.filter((m) => m.sampled).length /
            Math.max(metricsStore.length, 1),
        },
      }),
    );

    return addSecurityHeaders(response);
  } catch (error) {
    console.error("Web Vitals GET error:", error);
    const response = NextResponse.json(
      { error: "Failed to fetch metrics" },
      { status: 500 },
    );
    return addSecurityHeaders(response);
  }
}

// Handle CORS preflight
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": getCorsOrigin(),
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers":
        "Content-Type, Authorization, X-Requested-With",
      "Access-Control-Max-Age": "86400",
      "X-Content-Type-Options": "nosniff",
      "X-Frame-Options": "DENY",
      "X-XSS-Protection": "1; mode=block",
    },
  });
}
