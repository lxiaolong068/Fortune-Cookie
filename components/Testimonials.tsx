"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { MessageCircle, ChevronLeft, ChevronRight } from "lucide-react";
import { TestimonialCard } from "@/components/TestimonialCard";
import { getTestimonials } from "@/lib/testimonials";
import { cn } from "@/lib/utils";

interface TestimonialsProps {
  limit?: number;
  title?: string;
  className?: string;
  /** Enable carousel mode for mobile */
  enableCarousel?: boolean;
  /** Auto-scroll interval in milliseconds (0 to disable) */
  autoScrollInterval?: number;
}

export function Testimonials({
  limit = 6,
  title = "What Our Users Say",
  className,
  enableCarousel = true,
  autoScrollInterval = 8000,
}: TestimonialsProps) {
  // Use deterministic selection to avoid hydration mismatches
  const displayTestimonials = getTestimonials(limit);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check for mobile viewport
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Auto-scroll functionality
  useEffect(() => {
    if (!enableCarousel || !isMobile || isPaused || autoScrollInterval === 0)
      return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % displayTestimonials.length);
    }, autoScrollInterval);

    return () => clearInterval(timer);
  }, [
    enableCarousel,
    isMobile,
    isPaused,
    autoScrollInterval,
    displayTestimonials.length,
  ]);

  // Scroll to current index
  useEffect(() => {
    if (!enableCarousel || !isMobile || !scrollContainerRef.current) return;

    const container = scrollContainerRef.current;
    const cardWidth = container.scrollWidth / displayTestimonials.length;
    container.scrollTo({
      left: currentIndex * cardWidth,
      behavior: "smooth",
    });
  }, [currentIndex, enableCarousel, isMobile, displayTestimonials.length]);

  const goToPrevious = useCallback(() => {
    setCurrentIndex(
      (prev) =>
        (prev - 1 + displayTestimonials.length) % displayTestimonials.length,
    );
  }, [displayTestimonials.length]);

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % displayTestimonials.length);
  }, [displayTestimonials.length]);

  return (
    <section
      className={cn("py-12", className)}
      aria-labelledby="testimonials-heading"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="container mx-auto px-4">
        {/* Section header */}
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-2 mb-4">
            <MessageCircle
              className="h-6 w-6 text-amber-500"
              aria-hidden="true"
            />
            <h2
              id="testimonials-heading"
              className="text-2xl md:text-3xl font-bold text-gray-800"
            >
              {title}
            </h2>
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Join thousands of happy users who start their day with a fortune
            cookie. Here&apos;s what they have to say about our AI-powered
            generator.
          </p>
        </div>

        {/* Desktop: Grid layout */}
        <div className="hidden md:grid grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {displayTestimonials.map((testimonial) => (
            <TestimonialCard key={testimonial.id} testimonial={testimonial} />
          ))}
        </div>

        {/* Mobile: Carousel layout */}
        {enableCarousel && (
          <div className="md:hidden relative">
            {/* Navigation arrows */}
            <button
              onClick={goToPrevious}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-white/90 shadow-md hover:bg-white transition-all focus:outline-none focus:ring-2 focus:ring-amber-400"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="h-5 w-5 text-gray-600" />
            </button>

            <button
              onClick={goToNext}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-white/90 shadow-md hover:bg-white transition-all focus:outline-none focus:ring-2 focus:ring-amber-400"
              aria-label="Next testimonial"
            >
              <ChevronRight className="h-5 w-5 text-gray-600" />
            </button>

            {/* Scrollable container */}
            <div
              ref={scrollContainerRef}
              className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide gap-4 px-8"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {displayTestimonials.map((testimonial) => (
                <div
                  key={testimonial.id}
                  className="flex-shrink-0 w-[calc(100%-2rem)] snap-center"
                >
                  <TestimonialCard testimonial={testimonial} />
                </div>
              ))}
            </div>

            {/* Dot indicators */}
            <div
              className="flex justify-center gap-2 mt-4"
              role="tablist"
              aria-label="Testimonial navigation"
            >
              {displayTestimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={cn(
                    "w-2 h-2 rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2",
                    index === currentIndex
                      ? "bg-amber-500 w-6"
                      : "bg-amber-200 hover:bg-amber-300",
                  )}
                  role="tab"
                  aria-selected={index === currentIndex}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>
          </div>
        )}

        {/* Fallback for mobile when carousel is disabled */}
        {!enableCarousel && (
          <div className="md:hidden space-y-4">
            {displayTestimonials.slice(0, 3).map((testimonial) => (
              <TestimonialCard key={testimonial.id} testimonial={testimonial} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
