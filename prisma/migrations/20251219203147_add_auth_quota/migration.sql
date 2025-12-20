-- CreateTable
CREATE TABLE "public"."auth_users" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT,
    "emailVerified" TIMESTAMP(3),
    "image" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "auth_users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."auth_accounts" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,

    CONSTRAINT "auth_accounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."auth_sessions" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "auth_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."auth_verification_tokens" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "public"."fortune_quota" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "guestId" TEXT,
    "dateKey" TEXT NOT NULL,
    "usedCount" INTEGER NOT NULL DEFAULT 0,
    "dailyLimit" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "fortune_quota_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."fortune_usage" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "guestId" TEXT,
    "dateKey" TEXT NOT NULL,
    "theme" TEXT NOT NULL,
    "mood" TEXT NOT NULL,
    "length" TEXT NOT NULL,
    "hasCustomPrompt" BOOLEAN NOT NULL DEFAULT false,
    "source" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "fortune_usage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "auth_users_email_key" ON "public"."auth_users"("email");

-- CreateIndex
CREATE INDEX "auth_accounts_userId_idx" ON "public"."auth_accounts"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "auth_accounts_provider_providerAccountId_key" ON "public"."auth_accounts"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "auth_sessions_sessionToken_key" ON "public"."auth_sessions"("sessionToken");

-- CreateIndex
CREATE INDEX "auth_sessions_userId_idx" ON "public"."auth_sessions"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "auth_verification_tokens_token_key" ON "public"."auth_verification_tokens"("token");

-- CreateIndex
CREATE UNIQUE INDEX "auth_verification_tokens_identifier_token_key" ON "public"."auth_verification_tokens"("identifier", "token");

-- CreateIndex
CREATE INDEX "fortune_quota_dateKey_idx" ON "public"."fortune_quota"("dateKey");

-- CreateIndex
CREATE INDEX "fortune_quota_userId_idx" ON "public"."fortune_quota"("userId");

-- CreateIndex
CREATE INDEX "fortune_quota_guestId_idx" ON "public"."fortune_quota"("guestId");

-- CreateIndex
CREATE UNIQUE INDEX "fortune_quota_userId_dateKey_key" ON "public"."fortune_quota"("userId", "dateKey");

-- CreateIndex
CREATE UNIQUE INDEX "fortune_quota_guestId_dateKey_key" ON "public"."fortune_quota"("guestId", "dateKey");

-- CreateIndex
CREATE INDEX "fortune_usage_dateKey_idx" ON "public"."fortune_usage"("dateKey");

-- CreateIndex
CREATE INDEX "fortune_usage_userId_idx" ON "public"."fortune_usage"("userId");

-- CreateIndex
CREATE INDEX "fortune_usage_guestId_idx" ON "public"."fortune_usage"("guestId");

-- AddForeignKey
ALTER TABLE "public"."auth_accounts" ADD CONSTRAINT "auth_accounts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."auth_users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."auth_sessions" ADD CONSTRAINT "auth_sessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."auth_users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."fortune_quota" ADD CONSTRAINT "fortune_quota_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."auth_users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."fortune_usage" ADD CONSTRAINT "fortune_usage_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."auth_users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
