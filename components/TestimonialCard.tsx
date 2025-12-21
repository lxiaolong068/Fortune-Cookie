import { Quote } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { StarRating } from "@/components/StarRating";
import { cn } from "@/lib/utils";
import type { Testimonial } from "@/lib/testimonials";

interface TestimonialCardProps {
  testimonial: Testimonial;
  className?: string;
}

export function TestimonialCard({
  testimonial,
  className,
}: TestimonialCardProps) {
  return (
    <Card
      className={cn(
        "group relative overflow-hidden transition-all duration-300",
        "hover:shadow-lg hover:-translate-y-1",
        "bg-white/80 backdrop-blur-sm border-amber-100",
        className
      )}
    >
      <CardContent className="p-6">
        {/* Quote icon */}
        <Quote
          className="absolute top-4 right-4 h-8 w-8 text-amber-200 opacity-50 group-hover:opacity-100 transition-opacity"
          aria-hidden="true"
        />

        {/* Star rating */}
        <div className="mb-4">
          <StarRating rating={testimonial.rating} size="sm" showText={false} />
        </div>

        {/* Quote text */}
        <blockquote className="text-gray-700 italic mb-4 leading-relaxed">
          &ldquo;{testimonial.quote}&rdquo;
        </blockquote>

        {/* Author info */}
        <div className="flex items-center gap-3">
          {/* Avatar with initials */}
          <div
            className={cn(
              "flex items-center justify-center",
              "h-10 w-10 rounded-full text-white font-semibold text-sm",
              testimonial.avatarBg
            )}
            aria-hidden="true"
          >
            {testimonial.initials}
          </div>

          {/* Name and location */}
          <div>
            <div className="font-medium text-gray-800">{testimonial.name}</div>
            {testimonial.location && (
              <div className="text-sm text-gray-500">{testimonial.location}</div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
