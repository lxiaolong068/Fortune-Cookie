-- CreateTable
CREATE TABLE "public"."fortunes" (
    "id" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "mood" TEXT NOT NULL,
    "length" TEXT NOT NULL,
    "source" TEXT NOT NULL DEFAULT 'database',
    "popularity" INTEGER NOT NULL DEFAULT 0,
    "tags" TEXT,
    "language" TEXT NOT NULL DEFAULT 'zh',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "fortunes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."user_sessions" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "userId" TEXT,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "data" TEXT,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."api_usage" (
    "id" TEXT NOT NULL,
    "endpoint" TEXT NOT NULL,
    "method" TEXT NOT NULL,
    "statusCode" INTEGER NOT NULL,
    "responseTime" INTEGER NOT NULL,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "keyId" TEXT,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "api_usage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."web_vitals" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,
    "delta" DOUBLE PRECISION NOT NULL,
    "rating" TEXT NOT NULL,
    "navigationType" TEXT,
    "url" TEXT,
    "userAgent" TEXT,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "web_vitals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."error_logs" (
    "id" TEXT NOT NULL,
    "level" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "stack" TEXT,
    "context" TEXT,
    "component" TEXT,
    "userId" TEXT,
    "sessionId" TEXT,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "error_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."cache_stats" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "operation" TEXT NOT NULL,
    "size" INTEGER,
    "ttl" INTEGER,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "cache_stats_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."user_feedback" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "rating" INTEGER,
    "fortuneId" TEXT,
    "sessionId" TEXT,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_feedback_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "fortunes_category_idx" ON "public"."fortunes"("category");

-- CreateIndex
CREATE INDEX "fortunes_mood_idx" ON "public"."fortunes"("mood");

-- CreateIndex
CREATE INDEX "fortunes_popularity_idx" ON "public"."fortunes"("popularity");

-- CreateIndex
CREATE INDEX "fortunes_createdAt_idx" ON "public"."fortunes"("createdAt");

-- CreateIndex
CREATE INDEX "fortunes_category_mood_idx" ON "public"."fortunes"("category", "mood");

-- CreateIndex
CREATE UNIQUE INDEX "user_sessions_sessionId_key" ON "public"."user_sessions"("sessionId");

-- CreateIndex
CREATE INDEX "user_sessions_sessionId_idx" ON "public"."user_sessions"("sessionId");

-- CreateIndex
CREATE INDEX "user_sessions_userId_idx" ON "public"."user_sessions"("userId");

-- CreateIndex
CREATE INDEX "user_sessions_expiresAt_idx" ON "public"."user_sessions"("expiresAt");

-- CreateIndex
CREATE INDEX "api_usage_endpoint_idx" ON "public"."api_usage"("endpoint");

-- CreateIndex
CREATE INDEX "api_usage_timestamp_idx" ON "public"."api_usage"("timestamp");

-- CreateIndex
CREATE INDEX "api_usage_keyId_idx" ON "public"."api_usage"("keyId");

-- CreateIndex
CREATE INDEX "api_usage_endpoint_timestamp_idx" ON "public"."api_usage"("endpoint", "timestamp");

-- CreateIndex
CREATE INDEX "web_vitals_name_idx" ON "public"."web_vitals"("name");

-- CreateIndex
CREATE INDEX "web_vitals_timestamp_idx" ON "public"."web_vitals"("timestamp");

-- CreateIndex
CREATE INDEX "web_vitals_name_timestamp_idx" ON "public"."web_vitals"("name", "timestamp");

-- CreateIndex
CREATE INDEX "error_logs_level_idx" ON "public"."error_logs"("level");

-- CreateIndex
CREATE INDEX "error_logs_timestamp_idx" ON "public"."error_logs"("timestamp");

-- CreateIndex
CREATE INDEX "error_logs_component_idx" ON "public"."error_logs"("component");

-- CreateIndex
CREATE INDEX "error_logs_level_timestamp_idx" ON "public"."error_logs"("level", "timestamp");

-- CreateIndex
CREATE INDEX "cache_stats_key_idx" ON "public"."cache_stats"("key");

-- CreateIndex
CREATE INDEX "cache_stats_operation_idx" ON "public"."cache_stats"("operation");

-- CreateIndex
CREATE INDEX "cache_stats_timestamp_idx" ON "public"."cache_stats"("timestamp");

-- CreateIndex
CREATE INDEX "user_feedback_type_idx" ON "public"."user_feedback"("type");

-- CreateIndex
CREATE INDEX "user_feedback_status_idx" ON "public"."user_feedback"("status");

-- CreateIndex
CREATE INDEX "user_feedback_createdAt_idx" ON "public"."user_feedback"("createdAt");
