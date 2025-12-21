/**
 * Static Testimonials Data
 *
 * Curated testimonials for social proof display on homepage and key pages.
 * All testimonials are fictional but representative of typical user feedback.
 */

export interface Testimonial {
  id: string;
  name: string;
  initials: string;
  quote: string;
  rating: number;
  location?: string;
  avatarBg: string;
}

export const testimonials: Testimonial[] = [
  {
    id: "1",
    name: "Sarah M.",
    initials: "SM",
    quote:
      "Love starting my day with a fortune cookie! The AI messages are surprisingly insightful and always brighten my morning.",
    rating: 5,
    location: "California",
    avatarBg: "bg-amber-500",
  },
  {
    id: "2",
    name: "James L.",
    initials: "JL",
    quote:
      "I use this for team meetings - we crack open a fortune cookie before each standup. Great for morale!",
    rating: 5,
    location: "New York",
    avatarBg: "bg-orange-500",
  },
  {
    id: "3",
    name: "Emily C.",
    initials: "EC",
    quote:
      "The themed fortunes are perfect for parties. My guests loved getting personalized messages!",
    rating: 5,
    location: "Texas",
    avatarBg: "bg-rose-500",
  },
  {
    id: "4",
    name: "Michael R.",
    initials: "MR",
    quote:
      "Simple, fun, and free. The lucky numbers have actually been lucky for me a few times!",
    rating: 4,
    location: "Florida",
    avatarBg: "bg-blue-500",
  },
  {
    id: "5",
    name: "Lisa T.",
    initials: "LT",
    quote:
      "As a teacher, I use this to give my students fun encouragement. They absolutely love it!",
    rating: 5,
    location: "Washington",
    avatarBg: "bg-purple-500",
  },
  {
    id: "6",
    name: "David K.",
    initials: "DK",
    quote:
      "Been using this daily for months. The variety of messages keeps it fresh and entertaining.",
    rating: 5,
    location: "Illinois",
    avatarBg: "bg-emerald-500",
  },
  {
    id: "7",
    name: "Anna W.",
    initials: "AW",
    quote:
      "The AI generator creates such creative fortunes. Much better than the generic ones you get at restaurants!",
    rating: 5,
    location: "Colorado",
    avatarBg: "bg-pink-500",
  },
  {
    id: "8",
    name: "Robert H.",
    initials: "RH",
    quote:
      "Great little app for a quick pick-me-up. The inspirational messages really do help sometimes.",
    rating: 4,
    location: "Arizona",
    avatarBg: "bg-cyan-500",
  },
];

/**
 * Get a subset of testimonials for display
 * Uses deterministic selection to avoid hydration mismatches
 */
export function getTestimonials(limit?: number): Testimonial[] {
  if (!limit || limit >= testimonials.length) {
    return testimonials;
  }
  return testimonials.slice(0, limit);
}

/**
 * Get average rating from all testimonials
 */
export function getAverageRating(): number {
  const sum = testimonials.reduce((acc, t) => acc + t.rating, 0);
  return Math.round((sum / testimonials.length) * 10) / 10;
}

/**
 * Get total testimonial count
 */
export function getTestimonialCount(): number {
  return testimonials.length;
}
