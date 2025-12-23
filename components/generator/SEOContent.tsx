"use client";

import Link from "next/link";
import { Card } from "@/components/ui/card";

export function SEOContent() {
  return (
    <div className="max-w-4xl mx-auto space-y-12">
      {/* Section E1: How it works */}
      <section>
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          How our AI fortune cookie generator works
        </h2>
        <div className="prose prose-amber max-w-none">
          <p className="text-gray-600 leading-relaxed mb-4">
            Our AI-powered fortune cookie generator combines advanced language
            models with traditional fortune cookie wisdom to create unique,
            personalized messages. When you select a theme and click the cookie,
            our AI analyzes your preferences and generates a fortune that&apos;s
            both meaningful and relevant to your chosen context.
          </p>
          <p className="text-gray-600 leading-relaxed mb-4">
            You can customize your fortune by selecting a theme (like inspiration,
            humor, or wisdom), choosing a scenario (work, love, study), and even
            selecting your preferred tone. The AI uses these inputs to craft a
            fortune that feels personally tailored to you.
          </p>
          <p className="text-gray-600 leading-relaxed">
            Your privacy is important to us. We don&apos;t store any personal
            information, and your fortune requests are processed anonymously. The
            experience is designed purely for fun and entertainment—like cracking
            open a real fortune cookie, but with the power of AI!
          </p>
        </div>
      </section>

      {/* Section E2: What you can use it for */}
      <section>
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          What you can use it for
        </h2>
        <div className="grid md:grid-cols-2 gap-4">
          {USE_CASES.map((useCase, index) => (
            <Card
              key={index}
              className="p-4 bg-white/80 backdrop-blur-sm border-amber-200 hover:border-amber-300 transition-colors"
            >
              <div className="flex items-start gap-3">
                <span className="text-2xl" aria-hidden="true">
                  {useCase.icon}
                </span>
                <div>
                  <h3 className="font-medium text-gray-800 mb-1">
                    {useCase.title}
                  </h3>
                  <p className="text-sm text-gray-600">{useCase.description}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Section E3: Key features */}
      <section>
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Key features
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          {FEATURES.map((feature, index) => (
            <div
              key={index}
              className="bg-white/80 backdrop-blur-sm rounded-lg p-6 border border-amber-200"
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl" aria-hidden="true">
                  {feature.icon}
                </span>
                <h3 className="text-lg font-medium text-amber-700">
                  {feature.title}
                </h3>
              </div>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Internal Links */}
      <section className="pt-4">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Explore more
        </h2>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/messages"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-50 text-amber-700 hover:bg-amber-100 transition-colors text-sm font-medium"
          >
            📜 Browse fortune messages
          </Link>
          <Link
            href="/history"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-50 text-amber-700 hover:bg-amber-100 transition-colors text-sm font-medium"
          >
            📚 History of fortune cookies
          </Link>
          <Link
            href="/recipes"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-50 text-amber-700 hover:bg-amber-100 transition-colors text-sm font-medium"
          >
            🍪 Fortune cookie recipes
          </Link>
          <Link
            href="/favorites"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-50 text-amber-700 hover:bg-amber-100 transition-colors text-sm font-medium"
          >
            ❤️ My favorites
          </Link>
        </div>
      </section>
    </div>
  );
}

// Use cases data
const USE_CASES = [
  {
    icon: "🎉",
    title: "Party & events",
    description:
      "Generate fun fortunes for party games, dinner parties, or corporate events. Add a unique twist to your celebrations!",
  },
  {
    icon: "📱",
    title: "Social media posts",
    description:
      "Create shareable fortune cookie messages for Instagram, Twitter, or TikTok. Stand out with AI-generated wisdom!",
  },
  {
    icon: "🌅",
    title: "Daily inspiration",
    description:
      "Start your day with a personalized fortune. Use it as a daily affirmation or motivational boost.",
  },
  {
    icon: "🎁",
    title: "Gifts & greeting cards",
    description:
      "Add a personal touch to birthday cards, thank-you notes, or gift tags with custom fortune messages.",
  },
  {
    icon: "📚",
    title: "Classroom activities",
    description:
      "Teachers can use it for creative writing prompts, ice-breakers, or fun classroom rewards.",
  },
  {
    icon: "💼",
    title: "Team building",
    description:
      "Use fortunes as conversation starters in meetings or workshops. Great for remote team activities!",
  },
];

// Features data
const FEATURES = [
  {
    icon: "🎨",
    title: "Personalized messages",
    description:
      "Generate custom fortune cookie messages based on different themes like inspiration, humor, love, and success.",
  },
  {
    icon: "🎱",
    title: "Lucky numbers",
    description:
      "Each fortune comes with a set of lucky numbers, perfect for lottery tickets or just for fun!",
  },
  {
    icon: "⭐",
    title: "Save favorites",
    description:
      "Save and revisit your favorite fortunes anytime. Build your personal collection of wisdom!",
  },
  {
    icon: "🆓",
    title: "Free to use",
    description:
      "Our fortune cookie generator is free to use with generous daily limits. No credit card required!",
  },
  {
    icon: "🔒",
    title: "Privacy focused",
    description:
      "Your fortune requests are anonymous. We don't store personal data or track your activity.",
  },
  {
    icon: "📤",
    title: "Easy sharing",
    description:
      "Share your fortunes directly to social media or copy them to clipboard with one click.",
  },
];
