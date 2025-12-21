import { MessageCircle } from "lucide-react";
import { TestimonialCard } from "@/components/TestimonialCard";
import { getTestimonials } from "@/lib/testimonials";
import { cn } from "@/lib/utils";

interface TestimonialsProps {
  limit?: number;
  title?: string;
  className?: string;
}

export function Testimonials({
  limit = 6,
  title = "What Our Users Say",
  className,
}: TestimonialsProps) {
  // Use deterministic selection to avoid hydration mismatches
  const displayTestimonials = getTestimonials(limit);

  return (
    <section className={cn("py-12", className)} aria-labelledby="testimonials-heading">
      <div className="container mx-auto px-4">
        {/* Section header */}
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-2 mb-4">
            <MessageCircle className="h-6 w-6 text-amber-500" aria-hidden="true" />
            <h2
              id="testimonials-heading"
              className="text-2xl md:text-3xl font-bold text-gray-800"
            >
              {title}
            </h2>
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Join thousands of happy users who start their day with a fortune cookie.
            Here&apos;s what they have to say about our AI-powered generator.
          </p>
        </div>

        {/* Testimonials grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {displayTestimonials.map((testimonial) => (
            <TestimonialCard key={testimonial.id} testimonial={testimonial} />
          ))}
        </div>
      </div>
    </section>
  );
}
