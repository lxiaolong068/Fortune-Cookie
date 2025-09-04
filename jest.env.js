// Jest environment variables setup

// Mock environment variables for testing
process.env.NODE_ENV = 'test'
process.env.NEXT_PUBLIC_APP_URL = 'http://localhost:3000'
process.env.NEXT_PUBLIC_APP_NAME = 'Fortune Cookie AI Test'
process.env.DATABASE_URL = 'file:./test.db'

// Mock API keys (use test values)
process.env.OPENROUTER_API_KEY = 'test-openrouter-key'
process.env.API_KEY_ID = 'test-key-001'
process.env.API_KEY_SECRET = 'test-secret-key'
process.env.API_SIGNATURE_SECRET = 'test-signature-secret'

// Mock Redis/Cache configuration
process.env.UPSTASH_REDIS_REST_URL = 'http://localhost:6379'
process.env.UPSTASH_REDIS_REST_TOKEN = 'test-redis-token'
process.env.CACHE_ADMIN_TOKEN = 'test-cache-admin-token'


// Mock Google Analytics
process.env.GOOGLE_ANALYTICS_ID = 'G-TEST123456'
process.env.GOOGLE_VERIFICATION_CODE = 'test-verification-code'

// Mock database configuration
process.env.DB_CONNECTION_LIMIT = '5'
process.env.DB_QUERY_TIMEOUT = '5000'
process.env.DB_CONNECTION_TIMEOUT = '3000'
process.env.DB_SLOW_QUERY_THRESHOLD = '500'

// Mock rate limiting
process.env.RATE_LIMIT_MAX_REQUESTS = '100'
process.env.RATE_LIMIT_WINDOW_MS = '900000'
