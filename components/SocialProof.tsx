"use client";

import { Sparkles, Users, Cookie } from "lucide-react";
import { StarRating } from "@/components/StarRating";
import { AnimatedCounter } from "@/components/AnimatedCounter";
import { cn } from "@/lib/utils";

interface SocialProofProps {
  variant?: "default" | "compact" | "hero";
  className?: string;
}

// Static data matching the JSON-LD structured data
const SOCIAL_PROOF_DATA = {
  rating: 4.8,
  reviewCount: 1250,
  fortunesGenerated: 10000,
  happyUsers: 5000,
};

export function SocialProof({
  variant = "default",
  className,
}: SocialProofProps) {
  if (variant === "compact") {
    return (
      <div
        className={cn(
          "inline-flex items-center gap-4 px-4 py-2",
          "bg-amber-50/80 rounded-full border border-amber-200",
          className,
        )}
      >
        <StarRating
          rating={SOCIAL_PROOF_DATA.rating}
          count={SOCIAL_PROOF_DATA.reviewCount}
          size="sm"
        />
        <span className="text-xs text-gray-500">|</span>
        <div className="flex items-center gap-1 text-sm text-gray-600">
          <Cookie className="h-3.5 w-3.5 text-amber-500" aria-hidden="true" />
          <span>
            <AnimatedCounter
              value={SOCIAL_PROOF_DATA.fortunesGenerated}
              suffix="+"
              duration={1500}
            />{" "}
            generated
          </span>
        </div>
      </div>
    );
  }

  if (variant === "hero") {
    return (
      <div
        className={cn(
          "flex flex-col items-center gap-6 py-8",
          "bg-gradient-to-b from-amber-50/50 to-transparent",
          className,
        )}
      >
        {/* Main rating */}
        <div className="flex flex-col items-center gap-2">
          <StarRating
            rating={SOCIAL_PROOF_DATA.rating}
            count={SOCIAL_PROOF_DATA.reviewCount}
            size="lg"
          />
          <p className="text-sm text-gray-500">
            Rated by our community of fortune seekers
          </p>
        </div>

        {/* Stats row */}
        <div className="flex flex-wrap justify-center gap-8 md:gap-12">
          <Stat
            icon={<Cookie className="h-5 w-5" />}
            value={SOCIAL_PROOF_DATA.fortunesGenerated}
            label="Fortunes Generated"
            suffix="+"
          />
          <Stat
            icon={<Users className="h-5 w-5" />}
            value={SOCIAL_PROOF_DATA.happyUsers}
            label="Happy Users"
            suffix="+"
          />
          <StatText
            icon={<Sparkles className="h-5 w-5" />}
            value="Free"
            label="Always Free"
          />
        </div>
      </div>
    );
  }

  // Default variant
  return (
    <div
      className={cn(
        "flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 py-4",
        "bg-amber-50/50 rounded-lg border border-amber-100",
        className,
      )}
    >
      <StarRating
        rating={SOCIAL_PROOF_DATA.rating}
        count={SOCIAL_PROOF_DATA.reviewCount}
        size="md"
      />

      <div
        className="hidden sm:block h-6 w-px bg-amber-200"
        aria-hidden="true"
      />

      <div className="flex items-center gap-2 text-gray-600">
        <Cookie className="h-4 w-4 text-amber-500" aria-hidden="true" />
        <span className="text-sm font-medium">
          <AnimatedCounter
            value={SOCIAL_PROOF_DATA.fortunesGenerated}
            suffix="+"
            duration={1500}
          />{" "}
          fortunes generated
        </span>
      </div>
    </div>
  );
}

// Internal stat component for hero variant - with animated counter
function Stat({
  icon,
  value,
  label,
  suffix = "",
}: {
  icon: React.ReactNode;
  value: number;
  label: string;
  suffix?: string;
}) {
  return (
    <div className="flex flex-col items-center gap-1">
      <div className="flex items-center gap-2 text-amber-600">
        {icon}
        <span className="text-xl font-bold text-gray-800">
          <AnimatedCounter value={value} suffix={suffix} duration={2000} />
        </span>
      </div>
      <span className="text-xs text-gray-500">{label}</span>
    </div>
  );
}

// Internal stat component for text values (non-animated)
function StatText({
  icon,
  value,
  label,
}: {
  icon: React.ReactNode;
  value: string;
  label: string;
}) {
  return (
    <div className="flex flex-col items-center gap-1">
      <div className="flex items-center gap-2 text-amber-600">
        {icon}
        <span className="text-xl font-bold text-gray-800">{value}</span>
      </div>
      <span className="text-xs text-gray-500">{label}</span>
    </div>
  );
}
