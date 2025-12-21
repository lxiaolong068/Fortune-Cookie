import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface StarRatingProps {
  rating: number;
  maxRating?: number;
  count?: number;
  size?: "sm" | "md" | "lg";
  showText?: boolean;
  className?: string;
}

const sizeClasses = {
  sm: {
    star: "h-3 w-3",
    text: "text-xs",
    gap: "gap-0.5",
  },
  md: {
    star: "h-4 w-4",
    text: "text-sm",
    gap: "gap-1",
  },
  lg: {
    star: "h-5 w-5",
    text: "text-base",
    gap: "gap-1",
  },
};

export function StarRating({
  rating,
  maxRating = 5,
  count,
  size = "md",
  showText = true,
  className,
}: StarRatingProps) {
  const styles = sizeClasses[size];
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = maxRating - fullStars - (hasHalfStar ? 1 : 0);

  const ariaLabel = count
    ? `Rating: ${rating} out of ${maxRating} stars based on ${count} reviews`
    : `Rating: ${rating} out of ${maxRating} stars`;

  return (
    <div
      className={cn("flex items-center", styles.gap, className)}
      role="img"
      aria-label={ariaLabel}
    >
      {/* Full stars */}
      {Array.from({ length: fullStars }).map((_, i) => (
        <Star
          key={`full-${i}`}
          className={cn(styles.star, "fill-amber-400 text-amber-400")}
          aria-hidden="true"
        />
      ))}

      {/* Half star */}
      {hasHalfStar && (
        <div className="relative" aria-hidden="true">
          <Star className={cn(styles.star, "text-gray-300")} />
          <div className="absolute inset-0 overflow-hidden w-1/2">
            <Star className={cn(styles.star, "fill-amber-400 text-amber-400")} />
          </div>
        </div>
      )}

      {/* Empty stars */}
      {Array.from({ length: emptyStars }).map((_, i) => (
        <Star
          key={`empty-${i}`}
          className={cn(styles.star, "text-gray-300")}
          aria-hidden="true"
        />
      ))}

      {/* Rating text */}
      {showText && (
        <span className={cn(styles.text, "text-gray-600 ml-1")}>
          {rating.toFixed(1)}
          {count !== undefined && (
            <span className="text-gray-400">
              {" "}
              ({count.toLocaleString()}
              {count >= 1000 ? "+" : ""})
            </span>
          )}
        </span>
      )}
    </div>
  );
}
