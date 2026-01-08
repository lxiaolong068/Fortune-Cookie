// API Response Type Contracts
// Consistent response envelope and interfaces for all API routes

// Generic API response envelope
export interface ApiEnvelope<T = unknown> {
  data?: T;
  error?: string;
  meta?: Record<string, unknown>;
}

// Success response helper
export interface ApiSuccessResponse<T = unknown> extends ApiEnvelope<T> {
  data: T;
  error?: never;
}

// Error response helper
export interface ApiErrorResponse extends ApiEnvelope<never> {
  data?: never;
  error: string;
}

// Web Vitals metric interface
export interface WebVitalMetric {
  id: string;
  name: "CLS" | "INP" | "FCP" | "LCP" | "TTFB" | "FID";
  value: number;
  delta: number;
  rating: "good" | "needs-improvement" | "poor";
  navigationType: string;
  entries?: PerformanceEntry[];
}

// Analytics event interface
export interface AnalyticsEvent {
  id: string;
  type: "user_action" | "business_event" | "performance" | "error";
  category: string;
  action: string;
  label?: string;
  value?: number;
  userId?: string;
  sessionId?: string;
  timestamp: string;
  metadata: Record<string, unknown>;
}

// Analytics request interface
export interface AnalyticsRequest {
  events: AnalyticsEvent[];
  timestamp: string;
}

// Fortune generation request interface
export interface FortuneRequest {
  theme?: "funny" | "inspirational" | "love" | "success" | "wisdom" | "random";
  mood?: "positive" | "neutral" | "motivational" | "humorous";
  length?: "short" | "medium" | "long";
  customPrompt?: string;
}

// Fortune response interface
export interface FortuneResponse {
  message: string;
  luckyNumbers: number[];
  theme: string;
  timestamp: string;
}

// Cache statistics interface
export interface CacheStats {
  hits: number;
  misses: number;
  hitRate: number;
  totalRequests: number;
  averageResponseTime: number;
  errorRate: number;
}

// Performance statistics interface
export interface PerformanceStats {
  averageResponseTime: number;
  p95ResponseTime: number;
  p99ResponseTime: number;
  errorCount: number;
  successCount: number;
  totalRequests: number;
}

// Health check response interface
export interface HealthCheckResponse {
  status: "ok" | "degraded" | "down";
  aiEnabled: boolean;
  cacheEnabled: boolean;
  timestamp: string;
  cacheStats?: CacheStats;
}

// Database fortune interface (from Prisma)
export interface DatabaseFortune {
  id: string;
  message: string;
  category: string;
  mood: string;
  length: string;
  source: string;
  popularity: number;
  tags: string | null;
  language: string;
  createdAt: Date;
  updatedAt: Date;
}

// Client-side fortune interface
export interface ClientFortune {
  id?: string;
  message: string;
  category: string;
  mood: string;
  length?: string;
  source?: string;
  popularity?: number;
  tags?: string[];
  language?: string;
  timestamp?: string;
  luckyNumbers?: number[];
}

// Fortunes list response interface
export interface FortunesListResponse {
  fortunes: ClientFortune[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

// User session data interface
export interface UserSessionData {
  userId?: string;
  preferences?: {
    theme?: string;
    language?: string;
    reducedMotion?: boolean;
  };
  history?: {
    fortuneId?: string;
    message: string;
    category: string;
    mood: string;
    source: string;
    liked: boolean;
    shared: boolean;
    tags?: string[];
    customPrompt?: string;
    timestamp: string;
  }[];
  analytics?: {
    pageViews: number;
    fortunesGenerated: number;
    lastActive: string;
  };
}

// API signature validation result
export interface SignatureValidationResult {
  success: boolean;
  keyId?: string;
  error?: string;
  statusCode?: number;
}

// Rate limit result interface
export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
  retryAfter?: number;
}

// Error context interface for monitoring
export interface ErrorContext {
  component?: string;
  action?: string;
  url?: string;
  userAgent?: string;
  userId?: string;
  sessionId?: string;
  additionalData?: Record<string, unknown>;
}

// Performance metric interface
export interface PerformanceMetric {
  name: string;
  value: number;
  unit: string;
  timestamp: string;
  context?: Record<string, unknown>;
}

// SEO tracking data interface
export interface SEOTrackingData {
  keyword: string;
  position: number;
  impressions: number;
  clicks: number;
  ctr: number;
  url: string;
  device: string;
  country: string;
  date: string;
}

// Type guards for runtime type checking
export function isWebVitalMetric(obj: unknown): obj is WebVitalMetric {
  return (
    typeof obj === "object" &&
    obj !== null &&
    "id" in obj &&
    "name" in obj &&
    "value" in obj &&
    "delta" in obj &&
    "rating" in obj &&
    typeof (obj as WebVitalMetric).id === "string" &&
    ["CLS", "INP", "FCP", "LCP", "TTFB", "FID"].includes(
      (obj as WebVitalMetric).name,
    ) &&
    typeof (obj as WebVitalMetric).value === "number" &&
    typeof (obj as WebVitalMetric).delta === "number" &&
    ["good", "needs-improvement", "poor"].includes(
      (obj as WebVitalMetric).rating,
    )
  );
}

export function isAnalyticsEvent(obj: unknown): obj is AnalyticsEvent {
  return (
    typeof obj === "object" &&
    obj !== null &&
    "id" in obj &&
    "type" in obj &&
    "category" in obj &&
    "action" in obj &&
    "timestamp" in obj &&
    typeof (obj as AnalyticsEvent).id === "string" &&
    ["user_action", "business_event", "performance", "error"].includes(
      (obj as AnalyticsEvent).type,
    ) &&
    typeof (obj as AnalyticsEvent).category === "string" &&
    typeof (obj as AnalyticsEvent).action === "string" &&
    typeof (obj as AnalyticsEvent).timestamp === "string"
  );
}

export function isFortuneRequest(obj: unknown): obj is FortuneRequest {
  if (typeof obj !== "object" || obj === null) return false;

  const request = obj as FortuneRequest;

  // All fields are optional, but if present, they must be valid
  if (
    request.theme &&
    !["funny", "inspirational", "love", "success", "wisdom", "random"].includes(
      request.theme,
    )
  ) {
    return false;
  }

  if (
    request.mood &&
    !["positive", "neutral", "motivational", "humorous"].includes(request.mood)
  ) {
    return false;
  }

  if (request.length && !["short", "medium", "long"].includes(request.length)) {
    return false;
  }

  if (request.customPrompt && typeof request.customPrompt !== "string") {
    return false;
  }

  return true;
}

// Helper functions for creating consistent API responses
export function createSuccessResponse<T>(
  data: T,
  meta?: Record<string, unknown>,
): ApiSuccessResponse<T> {
  return { data, ...(meta && { meta }) };
}

export function createErrorResponse(
  error: string,
  meta?: Record<string, unknown>,
): ApiErrorResponse {
  return { error, ...(meta && { meta }) };
}

// =====================================================
// Mobile Authentication Types
// =====================================================

// Apple Sign In request interface
export interface AppleAuthRequest {
  identityToken: string;
  authorizationCode: string;
  userIdentifier: string;
  fullName?: string | null;
  email?: string | null;
}

// Google Sign In request interface
export interface GoogleAuthRequest {
  idToken: string;
  accessToken: string;
}

// Mobile authentication response interface
export interface MobileAuthResponse {
  token: string;
  user: MobileUser;
}

// Mobile user info interface
export interface MobileUser {
  id: string;
  email: string | null;
  name: string | null;
  provider: "apple" | "google";
  createdAt: string;
}

// Mobile auth error codes
export type MobileAuthError =
  | "invalid_token"
  | "session_expired"
  | "unauthorized"
  | "auth_failed"
  | "server_error";

// Mobile auth error response
export interface MobileAuthErrorResponse {
  error: MobileAuthError;
  message: string;
}

// Type guard for Apple auth request
export function isAppleAuthRequest(obj: unknown): obj is AppleAuthRequest {
  if (typeof obj !== "object" || obj === null) return false;

  const request = obj as AppleAuthRequest;

  return (
    typeof request.identityToken === "string" &&
    request.identityToken.length > 0 &&
    typeof request.authorizationCode === "string" &&
    request.authorizationCode.length > 0 &&
    typeof request.userIdentifier === "string" &&
    request.userIdentifier.length > 0
  );
}

// Type guard for Google auth request
export function isGoogleAuthRequest(obj: unknown): obj is GoogleAuthRequest {
  if (typeof obj !== "object" || obj === null) return false;

  const request = obj as GoogleAuthRequest;

  return (
    typeof request.idToken === "string" &&
    request.idToken.length > 0 &&
    typeof request.accessToken === "string" &&
    request.accessToken.length > 0
  );
}
