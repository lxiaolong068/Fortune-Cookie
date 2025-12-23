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
      <div className="bg-white/60 backdrop-blur-md rounded-3xl p-8 md:p-12 border border-amber-100 shadow-lg">
        <div className="flex items-center gap-4 mb-8">
          <div className="p-3 bg-green-100 rounded-full">
            <Pen className="w-8 h-8 text-green-700" />
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
            How to Write Your Own Fortune Cookie Messages
          </h2>
        </div>

        <p className="text-gray-600 leading-relaxed mb-8">
          Creating your own fortune cookie messages is an art that
          combines brevity, positivity, and just the right amount of
          mystery. The best fortunes are short, uplifting, and
          open-ended enough for readers to find personal meaning.
          Whether you&apos;re making{" "}
          <Link
            href="/how-to-make-fortune-cookies"
            className="text-amber-600 hover:text-amber-700 font-medium"
          >
            homemade fortune cookies
          </Link>{" "}
          or crafting messages for an event, these principles will guide
          you.
        </p>

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {/* Writing Principles */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Writing Principles
            </h3>
            <ul className="space-y-3">
              {writingPrinciples.map((principle, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-green-100 text-green-700 flex items-center justify-center text-sm font-medium flex-shrink-0">
                    {idx + 1}
                  </span>
                  <span className="text-gray-600">{principle}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Template Examples */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Template Examples
            </h3>
            <ul className="space-y-2">
              {templateExamples.map((template, idx) => (
                <li
                  key={idx}
                  className="text-gray-600 italic border-l-2 border-amber-300 pl-3 py-1"
                >
                  &ldquo;{template}&rdquo;
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Writing CTA */}
        <div className="bg-gradient-to-r from-green-50 to-amber-50 p-6 rounded-xl border border-green-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-gray-700">
            <strong>Don&apos;t want to write from scratch?</strong> Let
            our AI create personalized fortune cookie messages for you.
          </p>
          <Link href="/generator">
            <Button className="bg-green-600 hover:bg-green-700 text-white whitespace-nowrap">
              Try AI Generator
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
