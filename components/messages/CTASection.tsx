import { Lightbulb, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

/**
 * CTASection - Final call-to-action section for the messages page
 *
 * Contains:
 * - Headline and description
 * - 3-step micro-guide
 * - Primary CTA button to generator
 */
export function CTASection() {
  return (
    <section className="mt-16 max-w-5xl mx-auto">
      <div className="relative overflow-hidden rounded-3xl border border-[#FFD6C5] bg-gradient-to-r from-[#FFE4D6] to-[#FAFAFA] p-12 text-center shadow-2xl">
        <div className="pointer-events-none absolute left-0 top-0 h-full w-full bg-[url('/noise.png')] opacity-20"></div>
        <div className="relative z-10">
          <Lightbulb className="mx-auto mb-6 h-16 w-16 animate-pulse text-[#E55328]" />
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-[#222222]">
            Create Your Own Destiny
          </h2>
          <p className="text-lg md:text-xl text-[#555555] mb-8 max-w-2xl mx-auto">
            Why wait for a cookie to tell your future? Use our advanced{" "}
            <strong>AI fortune cookie generator</strong> to craft
            unique, personalized messages with lucky numbers instantly.
          </p>

          {/* Micro Steps */}
          <div className="flex flex-wrap justify-center gap-4 mb-10">
            <div className="rounded-lg border border-[#FFE4D6] bg-white/80 px-4 py-3 text-left text-[#555555]">
              <span className="font-bold text-[#E55328]">1.</span>{" "}
              Choose a theme (love, work, birthday, exam...)
            </div>
            <div className="rounded-lg border border-[#FFE4D6] bg-white/80 px-4 py-3 text-left text-[#555555]">
              <span className="font-bold text-[#E55328]">2.</span>{" "}
              Describe your situation in one sentence
            </div>
            <div className="rounded-lg border border-[#FFE4D6] bg-white/80 px-4 py-3 text-left text-[#555555]">
              <span className="font-bold text-[#E55328]">3.</span> Get
              unique messages + lucky numbers
            </div>
          </div>

          <Link href="/generator">
            <Button
              size="lg"
              className="h-auto px-8 py-6 text-lg font-bold bg-[#FF6B3D] text-white shadow-lg transition-all hover:scale-105 hover:shadow-xl hover:bg-[#E55328]"
            >
              Open AI Fortune Cookie Generator
              <Sparkles className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
