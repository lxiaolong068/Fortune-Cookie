"use client";

import Link from "next/link";
import { Card } from "@/components/ui/card";

export function SEOContent() {
  return (
    <div className="max-w-4xl mx-auto space-y-16 py-8">
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
            fortune that feels personally tailored to you. Each generated message
            is unique — the same combination of inputs will never produce the
            exact same fortune twice.
          </p>
          <p className="text-gray-600 leading-relaxed">
            Your privacy is important to us. We don&apos;t store any personal
            information, and your fortune requests are processed anonymously. The
            experience is designed purely for fun and entertainment — like cracking
            open a real fortune cookie, but with the power of AI!
          </p>
        </div>

        {/* Step-by-step guide */}
        <div className="mt-6 grid md:grid-cols-3 gap-4">
          {STEPS.map((step, index) => (
            <div
              key={index}
              className="bg-amber-50 rounded-xl p-5 border border-amber-100"
            >
              <div className="flex items-center gap-3 mb-2">
                <span className="w-7 h-7 rounded-full bg-amber-400 text-white text-sm font-bold flex items-center justify-center flex-shrink-0">
                  {index + 1}
                </span>
                <h3 className="font-semibold text-gray-800">{step.title}</h3>
              </div>
              <p className="text-sm text-gray-600">{step.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Section E2: Fortune themes explained */}
      <section>
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">
          Fortune cookie themes — find your perfect message
        </h2>
        <p className="text-gray-600 mb-6">
          Our AI fortune cookie generator offers six distinct themes, each
          crafted to match a different mood or purpose. Whether you need a
          motivational boost, a good laugh, or romantic inspiration, there&apos;s
          a theme for every occasion.
        </p>
        <div className="grid md:grid-cols-2 gap-4">
          {THEMES.map((theme, index) => (
            <Card
              key={index}
              className="p-5 bg-white/80 backdrop-blur-sm border-amber-200 hover:border-amber-300 transition-colors"
            >
              <div className="flex items-start gap-3">
                <span className="text-2xl flex-shrink-0" aria-hidden="true">
                  {theme.icon}
                </span>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-1">
                    {theme.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-2">{theme.description}</p>
                  <p className="text-xs text-amber-600 italic">&ldquo;{theme.example}&rdquo;</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Section E3: What you can use it for */}
      <section>
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          What you can use the fortune cookie generator for
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

      {/* Section E4: Key features */}
      <section>
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Key features of our free fortune cookie generator
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

      {/* Section E5: Why choose us */}
      <section className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-8 border border-amber-100">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Why choose Fortune Cookie AI over other generators?
        </h2>
        <p className="text-gray-600 mb-6 leading-relaxed">
          Most online fortune cookie generators simply pick a random pre-written
          message from a static list. Our generator is fundamentally different:
          it uses real-time AI to craft a message that responds to your specific
          theme, mood, and context — every single time. Here&apos;s what sets us
          apart:
        </p>
        <div className="grid md:grid-cols-3 gap-4">
          {DIFFERENTIATORS.map((item, index) => (
            <div key={index} className="bg-white/70 rounded-xl p-4 border border-amber-100">
              <span className="text-2xl block mb-2">{item.icon}</span>
              <h3 className="font-semibold text-gray-800 mb-1 text-sm">{item.title}</h3>
              <p className="text-xs text-gray-600">{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Section E6: FAQ */}
      <section>
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">
          Frequently asked questions about fortune cookie generators
        </h2>
        <div className="space-y-4">
          {FAQS.map((faq, index) => (
            <div
              key={index}
              className="bg-white/80 backdrop-blur-sm rounded-lg p-5 border border-amber-200"
            >
              <h3 className="font-semibold text-gray-800 mb-2">{faq.question}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{faq.answer}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Section E7: Internal Links Hub */}
      <section className="pt-4">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">
          Explore our fortune cookie collection
        </h2>
        <p className="text-gray-600 text-sm mb-5">
          Looking for pre-written fortunes for a specific occasion or audience?
          Browse our curated collections below.
        </p>
        <div className="grid md:grid-cols-2 gap-3">
          {INTERNAL_LINKS.map((link, index) => (
            <Link
              key={index}
              href={link.href}
              className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/80 border border-amber-200 hover:border-amber-400 hover:shadow-sm transition-all text-sm font-medium text-gray-700 hover:text-amber-700 group"
            >
              <span className="text-lg flex-shrink-0">{link.icon}</span>
              <span className="flex-1">{link.title}</span>
              <span className="text-amber-400 group-hover:translate-x-1 transition-transform">→</span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

// Step-by-step guide data
const STEPS = [
  {
    title: "Choose a theme",
    description:
      "Pick from Inspirational, Funny, Love, Wisdom, Success, or Mystical to set the tone of your fortune.",
  },
  {
    title: "Personalize (optional)",
    description:
      "Select a scenario, mood, and language to make your fortune even more tailored to your situation.",
  },
  {
    title: "Crack it open",
    description:
      "Click the fortune cookie and watch it crack open to reveal your unique AI-generated message and lucky numbers.",
  },
];

// Themes data
const THEMES = [
  {
    icon: "✨",
    title: "Inspirational fortune cookies",
    description:
      "Uplifting messages designed to motivate and encourage. Perfect for starting your day on a positive note or sharing with someone who needs a boost.",
    example: "The path to your dreams is paved with the courage to begin.",
  },
  {
    icon: "😄",
    title: "Funny fortune cookies",
    description:
      "Witty, humorous fortunes that bring a smile to your face. Great for parties, social media posts, and lightening the mood.",
    example: "Your future is bright — wear sunglasses.",
  },
  {
    icon: "💕",
    title: "Love & romance fortune cookies",
    description:
      "Romantic and heartfelt messages for couples, anniversaries, Valentine's Day, or anyone celebrating love.",
    example: "The heart that loves is always young.",
  },
  {
    icon: "🦉",
    title: "Wisdom fortune cookies",
    description:
      "Thoughtful, philosophical messages drawing on timeless wisdom. Ideal for reflection, journaling prompts, or meaningful gifts.",
    example: "Silence is the sleep that nourishes wisdom.",
  },
  {
    icon: "🏆",
    title: "Success & career fortune cookies",
    description:
      "Achievement-focused fortunes for professionals, graduates, and anyone chasing their goals. Perfect for workplace events and team building.",
    example: "Opportunities multiply as they are seized.",
  },
  {
    icon: "🔮",
    title: "Mystical fortune cookies",
    description:
      "Enigmatic, otherworldly messages with a touch of mystery. Ideal for Halloween, themed parties, or those who love a hint of the unknown.",
    example: "The stars align for those who dare to look up.",
  },
];

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

// Why choose us data
const DIFFERENTIATORS = [
  {
    icon: "🤖",
    title: "Real AI, not random picks",
    description:
      "Every fortune is generated live by an AI language model — not pulled from a static list.",
  },
  {
    icon: "🎯",
    title: "Context-aware messages",
    description:
      "Your theme, mood, and scenario inputs shape each fortune, making it feel genuinely personal.",
  },
  {
    icon: "🌍",
    title: "Multi-language support",
    description:
      "Generate fortunes in English, Spanish, Chinese, French, and more — perfect for global audiences.",
  },
  {
    icon: "⚡",
    title: "Instant generation",
    description:
      "No waiting. Your fortune appears in seconds, backed by a 500+ message offline library for zero downtime.",
  },
  {
    icon: "🔓",
    title: "No account required",
    description:
      "Get 5 free fortunes per day as a guest. Sign in with Google for 20 daily fortunes — still completely free.",
  },
  {
    icon: "📱",
    title: "Works on any device",
    description:
      "Fully responsive design optimized for mobile, tablet, and desktop. Use it anywhere, anytime.",
  },
];

// FAQ data
const FAQS = [
  {
    question: "Is this fortune cookie generator really free?",
    answer:
      "Yes, completely free. Guest users can generate up to 5 AI fortune cookies per day. Sign in with your Google account to unlock 20 daily fortunes — no payment or credit card ever required.",
  },
  {
    question: "How is this different from a random fortune cookie generator?",
    answer:
      "Most generators simply pick a pre-written message at random. Ours uses a live AI model that reads your chosen theme, mood, and scenario to craft a brand-new message every time. The result feels personal rather than generic.",
  },
  {
    question: "Can I use the generated fortunes for my business or event?",
    answer:
      "Absolutely. The fortunes are generated for personal and commercial use. Many users print them for wedding favors, corporate events, restaurant menus, and branded gift packaging.",
  },
  {
    question: "What languages does the fortune cookie generator support?",
    answer:
      "The generator supports English, Spanish, French, German, Chinese (Simplified), Japanese, and several other languages. Select your preferred language in the Personalization panel before generating.",
  },
  {
    question: "How do the lucky numbers work?",
    answer:
      "Each fortune comes with a set of AI-selected lucky numbers. They are generated algorithmically and are meant purely for fun — think of them as your personal lottery picks or a playful nod to the tradition of fortune cookie lucky numbers.",
  },
  {
    question: "Can I save or share my fortune cookie messages?",
    answer:
      "Yes. You can copy any fortune to your clipboard with one click, or use the share button to post directly to social media. Signed-in users can also save fortunes to their Favorites for future reference.",
  },
];

// Internal links hub data
const INTERNAL_LINKS = [
  {
    icon: "🎊",
    title: "Fortune cookie messages by occasion",
    href: "/fortune-cookie-messages",
  },
  {
    icon: "💬",
    title: "Fortune cookie quotes by category",
    href: "/fortune-cookie-quotes",
  },
  {
    icon: "🎁",
    title: "Fortune cookie messages for everyone",
    href: "/fortune-cookie-messages-for",
  },
  {
    icon: "💡",
    title: "Fortune cookie ideas by activity",
    href: "/fortune-cookie-ideas",
  },
  {
    icon: "😂",
    title: "Funny fortune cookie messages",
    href: "/funny-fortune-cookie-messages",
  },
  {
    icon: "🌐",
    title: "Free online fortune cookie",
    href: "/free-online-fortune-cookie",
  },
  {
    icon: "📜",
    title: "Browse all fortune messages",
    href: "/messages",
  },
  {
    icon: "📚",
    title: "History of fortune cookies",
    href: "/who-invented-fortune-cookies",
  },
  {
    icon: "🍪",
    title: "How to make fortune cookies",
    href: "/how-to-make-fortune-cookies",
  },
  {
    icon: "📅",
    title: "Fortune cookie calendar",
    href: "/calendar",
  },
];
