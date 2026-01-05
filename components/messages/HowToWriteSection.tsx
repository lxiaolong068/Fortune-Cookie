import { Pen, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const writingPrinciples = [
  "Use second person 'you' to create personal connection",
  "Keep messages open-ended for reader projection",
  "Avoid specific dates or numbers (except lucky numbers)",
  "Stay positive and forward-looking",
  "Mix short punchy sentences with longer reflective ones",
  "Use timeless language that resonates across generations",
];

const templateExamples = [
  "Soon, you will discover a new opportunity in [work/love/creativity].",
  "Your patience today will bring unexpected rewards tomorrow.",
  "A chance encounter will lead to lasting friendship.",
  "The path you least expect will bring the greatest joy.",
  "Your kindness will return to you tenfold.",
  "A decision you make this week will shape your future.",
  "Trust your instincts—they know the way.",
  "Someone is thinking of you with great affection.",
];

/**
 * HowToWriteSection - Guide for writing fortune cookie messages
 *
 * Contains:
 * - Writing principles list
 * - Template examples
 * - CTA to AI generator
 * - Internal link to how-to-make page
 */
export function HowToWriteSection() {
  return (
    <section className="mt-16 max-w-5xl mx-auto">
      <div className="rounded-3xl border border-[#FFE4D6] bg-white p-8 shadow-lg md:p-12">
        <div className="flex items-center gap-4 mb-8">
          <div className="rounded-full bg-[#FFE4D6] p-3">
            <Pen className="h-8 w-8 text-[#E55328]" />
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-[#222222]">
            How to Write Your Own Fortune Cookie Messages
          </h2>
        </div>

        <p className="text-[#555555] leading-relaxed mb-8">
          Creating your own fortune cookie messages is an art that
          combines brevity, positivity, and just the right amount of
          mystery. The best fortunes are short, uplifting, and
          open-ended enough for readers to find personal meaning.
          Whether you&apos;re making{" "}
          <Link
            href="/how-to-make-fortune-cookies"
            className="font-medium text-[#FF6B3D] hover:text-[#E55328] hover:underline"
          >
            homemade fortune cookies
          </Link>{" "}
          or crafting messages for an event, these principles will guide
          you.
        </p>

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {/* Writing Principles */}
          <div>
            <h3 className="text-lg font-semibold text-[#222222] mb-4">
              Writing Principles
            </h3>
            <ul className="space-y-3">
              {writingPrinciples.map((principle, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-[#FFE4D6] text-sm font-medium text-[#E55328]">
                    {idx + 1}
                  </span>
                  <span className="text-[#555555]">{principle}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Template Examples */}
          <div>
            <h3 className="text-lg font-semibold text-[#222222] mb-4">
              Template Examples
            </h3>
            <ul className="space-y-2">
              {templateExamples.map((template, idx) => (
                <li
                  key={idx}
                  className="border-l-2 border-[#FFE4D6] py-1 pl-3 text-[#555555] italic"
                >
                  &ldquo;{template}&rdquo;
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Writing CTA */}
        <div className="flex flex-col items-center justify-between gap-4 rounded-xl border border-[#FFE4D6] bg-[#FAFAFA] p-6 sm:flex-row">
          <p className="text-[#555555]">
            <strong>Don&apos;t want to write from scratch?</strong> Let
            our AI create personalized fortune cookie messages for you.
          </p>
          <Link href="/generator">
            <Button className="whitespace-nowrap bg-[#FF6B3D] text-white hover:bg-[#E55328]">
              Try AI Generator
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
