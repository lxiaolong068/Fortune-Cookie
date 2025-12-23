"use client";

import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { startGoogleSignIn } from "@/lib/auth-client";
import type { QuotaStatus } from "@/lib/types/generator";

interface HeroSectionProps {
  quotaStatus: QuotaStatus | null;
  isQuotaLoading: boolean;
  isAuthenticated: boolean;
  isAuthLoading: boolean;
}

export function HeroSection({
  quotaStatus,
  isQuotaLoading,
  isAuthenticated,
  isAuthLoading,
}: HeroSectionProps) {
  const quotaPercentage = quotaStatus
    ? ((quotaStatus.limit - quotaStatus.remaining) / quotaStatus.limit) * 100
    : 0;

  const quotaResetLabel = quotaStatus
    ? new Date(quotaStatus.resetsAtUtc).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        timeZoneName: "short",
      })
    : "";

  return (
    <div className="text-center mb-8">
      {/* H1 Title */}
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-amber-600 via-yellow-600 to-orange-600 bg-clip-text text-transparent mb-4"
      >
        AI Fortune Cookie Generator
      </motion.h1>

      {/* Subtitle */}
      <motion.p
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="text-lg text-gray-600 max-w-2xl mx-auto mb-4"
      >
        Create personalized fortune cookie messages and lucky numbers in seconds.
      </motion.p>

      {/* Social Proof */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="flex justify-center mb-6"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-amber-50/80 to-yellow-50/80 backdrop-blur-sm border border-amber-200/50">
          <span className="text-amber-500">⭐</span>
          <span className="text-sm text-amber-700 font-medium">
            4.8/5 · 10,000+ fortunes generated
          </span>
        </div>
      </motion.div>

      {/* Quota Display Card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
        className="max-w-sm mx-auto"
      >
        <Card className="bg-white/90 backdrop-blur-sm border-amber-200">
          <div className="p-4">
            {/* Quota Header */}
            <div className="flex items-center justify-between mb-3">
              <div className="text-left">
                <p className="text-sm font-medium text-gray-700">
                  Today&apos;s fortune quota
                </p>
                <p className="text-xs text-gray-500">
                  {isQuotaLoading || !quotaStatus
                    ? "Loading quota..."
                    : `${quotaStatus.remaining} of ${quotaStatus.limit} remaining`}
                </p>
              </div>
              {isAuthenticated ? (
                <Badge className="bg-green-100 text-green-700 border-green-200">
                  Signed in
                </Badge>
              ) : isAuthLoading ? (
                <Badge className="bg-slate-100 text-slate-700 border-slate-200">
                  Checking
                </Badge>
              ) : (
                <Badge className="bg-amber-100 text-amber-700 border-amber-200">
                  Guest
                </Badge>
              )}
            </div>

            {/* Progress Bar */}
            {quotaStatus && (
              <div className="mb-3">
                <Progress
                  value={quotaPercentage}
                  className="h-2 bg-amber-100"
                />
              </div>
            )}

            {/* Reset Time */}
            {quotaStatus && (
              <p className="text-xs text-gray-500 text-left mb-3">
                Resets at {quotaResetLabel}
              </p>
            )}

            {/* Sign In CTA for Guests */}
            {!isAuthenticated && !isAuthLoading && (
              <Button
                variant="outline"
                size="sm"
                className="w-full border-amber-200 text-amber-700 hover:bg-amber-50"
                onClick={startGoogleSignIn}
                aria-label="Sign in with Google for more fortunes"
              >
                Sign in for 10 fortunes/day
              </Button>
            )}
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
