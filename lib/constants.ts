/**
 * Application Constants
 * 
 * Centralized constants for the Fortune Cookie AI application.
 * Replaces magic numbers and hardcoded values throughout the codebase.
 * 
 * @module lib/constants
 */

// ============================================================================
// LOTTERY CONSTANTS
// ============================================================================

/**
 * Lottery number configuration
 * Used for generating lucky numbers in fortune cookies
 */
export const LOTTERY = {
  /** Number of lucky numbers to generate */
  COUNT: 6,
  
  /** Minimum lucky number value (inclusive) */
  MIN_NUMBER: 1,
  
  /** Maximum lucky number value (inclusive) */
  MAX_NUMBER: 69,
  
  /** Powerball minimum number */
  POWERBALL_MIN: 1,
  
  /** Powerball maximum number */
  POWERBALL_MAX: 26,
} as const

// ============================================================================
// CACHE TTL (Time To Live) CONSTANTS
// ============================================================================

/**
 * Cache expiration times in seconds
 * Used by Redis cache manager for different data types
 */
export const CACHE_TTL = {
  /** Fortune cookie cache duration: 24 hours */
  FORTUNE: 60 * 60 * 24,
  
  /** Fortune list cache duration: 1 hour */
  FORTUNE_LIST: 60 * 60,
  
  /** Analytics data cache duration: 30 minutes */
  ANALYTICS: 60 * 30,
  
  /** User session cache duration: 7 days */
  USER_SESSION: 60 * 60 * 24 * 7,
  
  /** API response cache duration: 5 minutes */
  API_RESPONSE: 60 * 5,
  
  /** Edge cache duration: 1 hour */
  EDGE_CACHE: 60 * 60,
  
  /** Static content cache duration: 24 hours */
  STATIC_CONTENT: 60 * 60 * 24,
} as const

// ============================================================================
// RATE LIMITING CONSTANTS
// ============================================================================

/**
 * Rate limiting configuration
 * Used by Upstash rate limiters for API protection
 */
export const RATE_LIMITS = {
  /** API request rate limit */
  API: {
    /** Maximum requests per window */
    MAX_REQUESTS: 50,
    /** Time window in minutes */
    WINDOW_MINUTES: 15,
    /** Window in milliseconds */
    WINDOW_MS: 15 * 60 * 1000,
  },
  
  /** Fortune generation rate limit */
  FORTUNE: {
    /** Maximum requests per window */
    MAX_REQUESTS: 10,
    /** Time window in minutes */
    WINDOW_MINUTES: 1,
    /** Window in milliseconds */
    WINDOW_MS: 60 * 1000,
  },
  
  /** Search rate limit */
  SEARCH: {
    /** Maximum requests per window */
    MAX_REQUESTS: 30,
    /** Time window in minutes */
    WINDOW_MINUTES: 1,
    /** Window in milliseconds */
    WINDOW_MS: 60 * 1000,
  },
  
  /** Strict rate limit for sensitive operations */
  STRICT: {
    /** Maximum requests per window */
    MAX_REQUESTS: 100,
    /** Time window in hours */
    WINDOW_HOURS: 1,
    /** Window in milliseconds */
    WINDOW_MS: 60 * 60 * 1000,
  },
} as const

// ============================================================================
// PERFORMANCE CONSTANTS
// ============================================================================

/**
 * Performance thresholds and targets
 * Based on Core Web Vitals and application requirements
 */
export const PERFORMANCE = {
  /** Core Web Vitals thresholds */
  WEB_VITALS: {
    /** Largest Contentful Paint target (seconds) */
    LCP_TARGET: 2.5,
    /** Largest Contentful Paint warning threshold */
    LCP_WARNING: 4.0,
    
    /** Interaction to Next Paint target (milliseconds) */
    INP_TARGET: 200,
    /** Interaction to Next Paint warning threshold */
    INP_WARNING: 500,
    
    /** Cumulative Layout Shift target */
    CLS_TARGET: 0.1,
    /** Cumulative Layout Shift warning threshold */
    CLS_WARNING: 0.25,
    
    /** First Contentful Paint target (seconds) */
    FCP_TARGET: 1.8,
    /** First Contentful Paint warning threshold */
    FCP_WARNING: 3.0,
    
    /** Time to First Byte target (milliseconds) */
    TTFB_TARGET: 600,
    /** Time to First Byte warning threshold */
    TTFB_WARNING: 1800,
  },
  
  /** API response time targets */
  API_RESPONSE: {
    /** Target response time for cached requests (ms) */
    CACHED_TARGET: 500,
    
    /** Target response time for AI generation (ms) */
    AI_GENERATION_TARGET: 2000,
    
    /** Maximum acceptable response time (ms) */
    MAX_ACCEPTABLE: 5000,
    
    /** Timeout for API requests (ms) */
    TIMEOUT: 30000,
  },
  
  /** Cache performance targets */
  CACHE: {
    /** Target cache hit rate (percentage) */
    HIT_RATE_TARGET: 60,
    
    /** Warning threshold for cache hit rate */
    HIT_RATE_WARNING: 40,
    
    /** Target cache response time (ms) */
    RESPONSE_TIME_TARGET: 50,
  },
  
  /** Bundle size limits */
  BUNDLE: {
    /** Maximum initial bundle size (KB) */
    MAX_INITIAL_SIZE: 200,
    
    /** Maximum total bundle size (KB) */
    MAX_TOTAL_SIZE: 500,
    
    /** Warning threshold for bundle size (KB) */
    WARNING_SIZE: 150,
  },
} as const

// ============================================================================
// FORTUNE MESSAGE CONSTANTS
// ============================================================================

/**
 * Fortune message configuration
 * Used for validation and generation
 */
export const FORTUNE_MESSAGE = {
  /** Minimum message length (characters) */
  MIN_LENGTH: 10,
  
  /** Maximum message length (characters) */
  MAX_LENGTH: 200,
  
  /** Target message length for short fortunes */
  SHORT_LENGTH: 50,
  
  /** Target message length for medium fortunes */
  MEDIUM_LENGTH: 80,
  
  /** Target message length for long fortunes */
  LONG_LENGTH: 100,
  
  /** Maximum custom prompt length */
  MAX_CUSTOM_PROMPT: 500,
} as const

// ============================================================================
// ERROR HANDLING CONSTANTS
// ============================================================================

/**
 * Error handling configuration
 * Used by ErrorBoundary and error monitoring
 */
export const ERROR_HANDLING = {
  /** Maximum retry attempts */
  MAX_RETRIES: 5,
  
  /** Initial retry delay (ms) */
  INITIAL_RETRY_DELAY: 1000,
  
  /** Maximum retry delay (ms) */
  MAX_RETRY_DELAY: 10000,
  
  /** Exponential backoff multiplier */
  BACKOFF_MULTIPLIER: 2,
  
  /** Error log retention (days) */
  LOG_RETENTION_DAYS: 30,
} as const

// ============================================================================
// PAGINATION CONSTANTS
// ============================================================================

/**
 * Pagination configuration
 * Used for fortune browsing and search results
 */
export const PAGINATION = {
  /** Default page size */
  DEFAULT_PAGE_SIZE: 20,
  
  /** Maximum page size */
  MAX_PAGE_SIZE: 100,
  
  /** Minimum page size */
  MIN_PAGE_SIZE: 5,
} as const

// ============================================================================
// SESSION CONSTANTS
// ============================================================================

/**
 * User session configuration
 */
export const SESSION = {
  /** Session ID length (characters) */
  ID_LENGTH: 32,
  
  /** Session cookie name */
  COOKIE_NAME: 'fortune_session',
  
  /** Session expiration (seconds) */
  EXPIRATION: 60 * 60 * 24 * 7, // 7 days
} as const

// ============================================================================
// ANALYTICS CONSTANTS
// ============================================================================

/**
 * Analytics and monitoring configuration
 */
export const ANALYTICS = {
  /** Sample rate for RUM (Real User Monitoring) */
  RUM_SAMPLE_RATE: 0.1, // 10%
  
  /** Batch size for analytics events */
  BATCH_SIZE: 100,
  
  /** Flush interval for analytics (ms) */
  FLUSH_INTERVAL: 30000, // 30 seconds
  
  /** Maximum events in queue */
  MAX_QUEUE_SIZE: 1000,
} as const

// ============================================================================
// IMAGE OPTIMIZATION CONSTANTS
// ============================================================================

/**
 * Image optimization configuration
 */
export const IMAGE = {
  /** Default image quality (1-100) */
  DEFAULT_QUALITY: 85,
  
  /** WebP quality */
  WEBP_QUALITY: 80,
  
  /** AVIF quality */
  AVIF_QUALITY: 75,
  
  /** Maximum image width (px) */
  MAX_WIDTH: 3840,
  
  /** Maximum image height (px) */
  MAX_HEIGHT: 2160,
  
  /** Thumbnail size (px) */
  THUMBNAIL_SIZE: 150,
  
  /** Avatar size (px) */
  AVATAR_SIZE: 200,
} as const

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Convert minutes to milliseconds
 * @param minutes - Number of minutes
 * @returns Milliseconds
 */
export function minutesToMs(minutes: number): number {
  return minutes * 60 * 1000
}

/**
 * Convert hours to milliseconds
 * @param hours - Number of hours
 * @returns Milliseconds
 */
export function hoursToMs(hours: number): number {
  return hours * 60 * 60 * 1000
}

/**
 * Convert days to milliseconds
 * @param days - Number of days
 * @returns Milliseconds
 */
export function daysToMs(days: number): number {
  return days * 24 * 60 * 60 * 1000
}

/**
 * Convert seconds to milliseconds
 * @param seconds - Number of seconds
 * @returns Milliseconds
 */
export function secondsToMs(seconds: number): number {
  return seconds * 1000
}

