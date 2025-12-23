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
      <div className="text-center bg-gradient-to-r from-amber-500 to-orange-500 rounded-3xl p-12 shadow-2xl text-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('/noise.png')] opacity-20 pointer-events-none"></div>
        <div className="relative z-10">
          <Lightbulb className="w-16 h-16 mx-auto mb-6 text-yellow-200 animate-pulse" />
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Create Your Own Destiny
          </h2>
          <p className="text-lg md:text-xl text-amber-50 mb-8 max-w-2xl mx-auto">
            Why wait for a cookie to tell your future? Use our advanced{" "}
            <strong>AI fortune cookie generator</strong> to craft
            unique, personalized messages with lucky numbers instantly.
          </p>

          {/* Micro Steps */}
          <div className="flex flex-wrap justify-center gap-4 mb-10">
            <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-3 text-left">
              <span className="font-bold text-yellow-200">1.</span>{" "}
              Choose a theme (love, work, birthday, exam...)
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-3 text-left">
              <span className="font-bold text-yellow-200">2.</span>{" "}
              Describe your situation in one sentence
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-3 text-left">
              <span className="font-bold text-yellow-200">3.</span> Get
              unique messages + lucky numbers
            </div>
          </div>

          <Link href="/generator">
            <Button
              size="lg"
              className="bg-white text-amber-600 hover:bg-yellow-50 font-bold text-lg px-8 py-6 h-auto shadow-lg hover:shadow-xl transition-all hover:scale-105"
            >
              Open AI Fortune Cookie Generator
              <Sparkles className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
