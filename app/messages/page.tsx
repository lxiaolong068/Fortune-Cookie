import { Metadata } from "next";
import { DynamicBackgroundEffects } from "@/components/DynamicBackgroundEffects";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Sparkles,
  Heart,
  Smile,
  TrendingUp,
  Star,
  Scroll,
  Brain,
  Globe,
  Lightbulb,
  Users,
  Cake,
  BookOpen,
  ArrowRight,
  Pen,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import {
  ItemListStructuredData,
  BreadcrumbStructuredData,
} from "@/components/StructuredData";
import { getImageUrl, getSiteUrl } from "@/lib/site";
import {
  getFortunesByCategory,
  getDatabaseStats,
} from "@/lib/fortune-database";

const baseUrl = getSiteUrl();

export const metadata: Metadata = {
  title:
    "Fortune Cookie Messages – Funny, Inspirational, Love & Success Quotes",
  description:
    "Browse 200+ fortune cookie messages for daily inspiration, parties, gift cards, and social media. Funny, inspirational, love, success, wisdom, and friendship sayings with lucky numbers.",
  openGraph: {
    title:
      "Fortune Cookie Messages – Funny, Inspirational, Love & Success Quotes",
    description:
      "Browse 200+ fortune cookie messages for daily inspiration, parties, gift cards, and social media. Funny, inspirational, love, success, wisdom, and friendship sayings.",
    type: "website",
    url: `${baseUrl}/messages`,
    images: [
      {
        url: getImageUrl("/og-image.png"),
        width: 1200,
        height: 630,
        alt: "Fortune Cookie Messages",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title:
      "Fortune Cookie Messages – Funny, Inspirational, Love & Success Quotes",
    description:
      "Browse 200+ fortune cookie messages for daily inspiration, parties, gift cards, and social media. Funny, inspirational, love, success, wisdom, and friendship sayings.",
    images: [getImageUrl("/twitter-image.png")],
    creator: "@fortunecookieai",
  },
  alternates: {
    canonical: "/messages",
  },
};

// Category configuration with SEO-optimized content
const categoryConfig = {
  inspirational: {
    id: "inspirational",
    seoTitle: "Inspirational Fortune Cookie Messages",
    icon: Star,
    color: "bg-blue-100 text-blue-800",
    borderColor: "border-l-blue-500",
    intro:
      "Discover uplifting fortune cookie sayings that inspire positivity, motivation, and personal growth. These inspirational quotes are perfect for daily encouragement, graduation cards, sharing words of wisdom with friends, or printing on custom fortune cookies for special occasions. Each message carries timeless wisdom to brighten your day.",
    viewAllPath: "/messages/inspirational",
    ctaText: "Want more inspirational messages?",
  },
  funny: {
    id: "funny",
    seoTitle: "Funny Fortune Cookie Messages",
    icon: Smile,
    color: "bg-yellow-100 text-yellow-800",
    borderColor: "border-l-yellow-500",
    intro:
      "Get ready to laugh with our collection of hilarious fortune cookie sayings and witty jokes. These funny fortune messages are perfect for parties, pranks, brightening someone's day with humor, or adding levity to office events. From clever wordplay to absurd predictions, these messages will bring smiles.",
    viewAllPath: "/funny-fortune-cookie-messages",
    ctaText: "Want more funny fortune cookies?",
  },
  love: {
    id: "love",
    seoTitle: "Love Fortune Cookie Messages",
    icon: Heart,
    color: "bg-pink-100 text-pink-800",
    borderColor: "border-l-pink-500",
    intro:
      "Explore romantic fortune cookie messages about love, relationships, and matters of the heart. These sweet and heartfelt sayings are ideal for Valentine's Day, wedding favors, anniversary celebrations, or expressing affection to someone special. Let these love fortunes kindle romance and connection.",
    viewAllPath: "/messages/love",
    ctaText: "Want more love fortune messages?",
  },
  success: {
    id: "success",
    seoTitle: "Success & Career Fortune Cookie Messages",
    icon: TrendingUp,
    color: "bg-green-100 text-green-800",
    borderColor: "border-l-green-500",
    intro:
      "Motivating fortune cookie messages about achievement, career success, and reaching your goals. These success-themed sayings are perfect for corporate events, graduation parties, job promotions, or anyone needing a boost of professional motivation. Let these fortunes fuel your ambition.",
    viewAllPath: "/messages/success",
    ctaText: "Want more success messages?",
  },
  wisdom: {
    id: "wisdom",
    seoTitle: "Wisdom Fortune Cookie Messages",
    icon: Brain,
    color: "bg-purple-100 text-purple-800",
    borderColor: "border-l-purple-500",
    intro:
      "Thoughtful and philosophical fortune cookie messages offering timeless wisdom and life insights. These profound sayings draw from ancient philosophy and modern understanding, perfect for reflection, meditation, or sharing deep thoughts with friends seeking guidance and perspective.",
    viewAllPath: "/messages/wisdom",
    ctaText: "Want more wisdom fortunes?",
  },
  friendship: {
    id: "friendship",
    seoTitle: "Friendship Fortune Cookie Messages",
    icon: Users,
    color: "bg-teal-100 text-teal-800",
    borderColor: "border-l-teal-500",
    intro:
      "Celebrate the bonds of friendship with these heartwarming fortune cookie messages. Perfect for friend reunions, bestie gifts, friendship day celebrations, or simply reminding your friends how much they mean to you. These messages honor the beautiful connections that enrich our lives.",
    viewAllPath: "/messages/friendship",
    ctaText: "Want more friendship fortunes?",
  },
  birthday: {
    id: "birthday",
    seoTitle: "Birthday Fortune Cookie Messages",
    icon: Cake,
    color: "bg-orange-100 text-orange-800",
    borderColor: "border-l-orange-500",
    intro:
      "Make birthdays extra special with these celebratory fortune cookie messages. Ideal for birthday party favors, greeting cards, or adding a unique touch to birthday celebrations. These messages bring hope, joy, and positive predictions for the year ahead.",
    viewAllPath: "/messages/birthday",
    ctaText: "Want more birthday messages?",
  },
  study: {
    id: "study",
    seoTitle: "Study & Exam Motivation Messages",
    icon: BookOpen,
    color: "bg-indigo-100 text-indigo-800",
    borderColor: "border-l-indigo-500",
    intro:
      "Inspiring fortune cookie messages for students, test-takers, and lifelong learners. These motivational sayings are perfect for exam preparation, back-to-school encouragement, study groups, or anyone pursuing academic excellence. Let these fortunes boost your focus and confidence.",
    viewAllPath: "/messages/study",
    ctaText: "Want more study motivation?",
  },
};

const funFacts = [
  {
    title: "Not Actually Chinese",
    content:
      "Fortune cookies likely originated in Japan, not China. A Japanese cracker called 'tsujiura senbei' dates back to 19th-century Kyoto.",
    icon: Globe,
  },
  {
    title: "Billions Served",
    content:
      "Approximately 3 billion fortune cookies are produced globally every year, with the vast majority consumed in the United States.",
    icon: TrendingUp,
  },
  {
    title: "Lottery Winners",
    content:
      "A surprising number of people have won lottery jackpots by playing the 'lucky numbers' found on the back of their fortune cookie slips!",
    icon: Sparkles,
  },
];

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

export default function MessagesPage() {
  const stats = getDatabaseStats();

  // Prepare message items for structured data
  const allCategories = Object.values(categoryConfig);
  const messageItems = allCategories.flatMap((category) => {
    const messages = getFortunesByCategory(category.id);
    return messages.slice(0, 5).map((fortune) => ({
      name: fortune.message,
      description: `${category.seoTitle.replace(" Fortune Cookie Messages", "").replace(" Messages", "")} fortune cookie message`,
      category: category.seoTitle,
    }));
  });

  return (
    <>
      <ItemListStructuredData
        name="Fortune Cookie Messages Collection"
        description="Browse our complete collection of 200+ fortune cookie messages including funny, inspirational, love, success, wisdom, friendship, birthday, and study motivation sayings. Find the perfect fortune for any occasion."
        url="/messages"
        items={messageItems}
      />
      <BreadcrumbStructuredData
        items={[
          { name: "Home", url: "/" },
          { name: "Fortune Cookie Messages", url: "/messages" },
        ]}
      />
      <main className="min-h-screen w-full overflow-x-hidden relative">
        <DynamicBackgroundEffects />
        <div className="relative z-10">
          <div className="container mx-auto px-4 py-8">
            {/* Hero Section */}
            <div className="text-center mb-16">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-amber-600 via-yellow-600 to-orange-600 bg-clip-text text-transparent mb-6">
                Fortune Cookie Messages
              </h1>
              <p className="text-lg md:text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed mb-8">
                Browse hundreds of fortune cookie messages perfect for daily
                inspiration, parties, gift cards, printing, and social media
                captions. Discover funny, inspirational, love, success, wisdom,
                and friendship sayings—each with lucky numbers to brighten your
                day.
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                <Badge className="bg-amber-100 text-amber-800 px-4 py-2">
                  <Sparkles className="w-4 h-4 mr-2" />
                  {stats.total}+ Messages
                </Badge>
                <Badge className="bg-blue-100 text-blue-800 px-4 py-2">
                  <Star className="w-4 h-4 mr-2" />
                  {Object.keys(stats.categories).length} Categories
                </Badge>
                <Badge className="bg-green-100 text-green-800 px-4 py-2">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  AI Generator Available
                </Badge>
              </div>
            </div>

            {/* Message Categories - Main Content */}
            <div className="space-y-20">
              {allCategories.map((category) => {
                const IconComponent = category.icon;
                const messages = getFortunesByCategory(category.id);
                const displayMessages = messages.slice(0, 15);

                return (
                  <section
                    key={category.id}
                    id={category.id}
                    className="scroll-mt-20"
                  >
                    {/* Category Header */}
                    <div className="flex items-start gap-4 mb-6">
                      <div className="p-3 rounded-xl bg-white/80 backdrop-blur-sm border border-amber-200 shadow-sm flex-shrink-0">
                        <IconComponent className="w-8 h-8 text-amber-600" />
                      </div>
                      <div>
                        <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                          {category.seoTitle}
                        </h2>
                        <Badge
                          variant="secondary"
                          className={`${category.color} mt-2`}
                        >
                          {messages.length} messages
                        </Badge>
                      </div>
                    </div>

                    {/* Category Intro Paragraph */}
                    <p className="text-gray-600 leading-relaxed mb-8 max-w-4xl">
                      {category.intro}
                    </p>

                    {/* Messages Grid */}
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                      {displayMessages.map((fortune) => (
                        <Card
                          key={fortune.id}
                          className={`group p-5 bg-white/90 backdrop-blur-sm border-l-4 ${category.borderColor} hover:shadow-lg transition-all duration-300 hover:-translate-y-1`}
                        >
                          <div className="flex items-start gap-3">
                            <Sparkles className="w-5 h-5 text-amber-400 mt-1 flex-shrink-0 opacity-50 group-hover:opacity-100 transition-opacity" />
                            <div className="flex-1">
                              <blockquote className="text-gray-700 italic leading-relaxed mb-3">
                                &ldquo;{fortune.message}&rdquo;
                              </blockquote>
                              {fortune.luckyNumbers && (
                                <div className="flex items-center gap-1.5 text-xs text-gray-500">
                                  <span>Lucky:</span>
                                  {fortune.luckyNumbers
                                    .slice(0, 3)
                                    .map((num, i) => (
                                      <span
                                        key={i}
                                        className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-amber-100 text-amber-700 font-medium"
                                      >
                                        {num}
                                      </span>
                                    ))}
                                </div>
                              )}
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>

                    {/* View All + CTA Row */}
                    <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-gray-200">
                      <Link
                        href={category.viewAllPath}
                        className="inline-flex items-center text-amber-600 hover:text-amber-700 font-medium transition-colors group"
                      >
                        View all {category.seoTitle.toLowerCase()}
                        <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                      </Link>
                      <Link
                        href={`/generator?category=${category.id}`}
                        className="inline-flex items-center text-sm text-gray-500 hover:text-amber-600 transition-colors"
                      >
                        {category.ctaText} Use our AI generator
                        <ArrowRight className="w-4 h-4 ml-1" />
                      </Link>
                    </div>
                  </section>
                );
              })}
            </div>

            {/* History & Psychology Section - Condensed */}
            <section className="mt-24 max-w-5xl mx-auto">
              <div className="bg-white/60 backdrop-blur-md rounded-3xl p-8 md:p-12 border border-amber-100 shadow-lg">
                <div className="flex items-center gap-4 mb-8">
                  <div className="p-3 bg-amber-100 rounded-full">
                    <Scroll className="w-8 h-8 text-amber-700" />
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                    History & Psychology Behind Fortune Cookie Messages
                  </h2>
                </div>

                <div className="grid md:grid-cols-2 gap-8 mb-8">
                  {/* History */}
                  <div className="prose prose-lg text-gray-700">
                    <p>
                      While often associated with Chinese cuisine in Western
                      culture, the{" "}
                      <Link
                        href="/history"
                        className="text-amber-600 hover:text-amber-700 font-medium"
                      >
                        fortune cookie history
                      </Link>{" "}
                      actually traces back to{" "}
                      <strong>19th-century Japan</strong>. A similar cracker
                      called <em>&quot;tsujiura senbei&quot;</em> was sold in
                      Kyoto with paper fortunes tucked inside. The modern,
                      vanilla-sweetened version was popularized in California in
                      the early 20th century. Learn more about{" "}
                      <Link
                        href="/who-invented-fortune-cookies"
                        className="text-amber-600 hover:text-amber-700 font-medium"
                      >
                        who invented fortune cookies
                      </Link>
                      .
                    </p>
                  </div>

                  {/* Psychology */}
                  <div className="prose prose-lg text-gray-700">
                    <p>
                      The appeal of fortune cookies is linked to the{" "}
                      <strong>Barnum Effect</strong>—a psychological phenomenon
                      where individuals believe vague, general statements apply
                      specifically to them. The positive, open-ended nature of
                      fortune cookie messages allows us to project our hopes and
                      dreams onto the text, creating a moment of personal
                      connection and delight.
                    </p>
                  </div>
                </div>

                {/* Did You Know */}
                <div className="bg-gradient-to-br from-purple-50 to-amber-50 p-6 rounded-2xl border border-purple-100">
                  <h3 className="text-lg font-bold text-purple-900 mb-4">
                    Did You Know?
                  </h3>
                  <ul className="space-y-3">
                    {funFacts.map((fact, idx) => (
                      <li key={idx} className="flex gap-3 items-start">
                        <fact.icon className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <strong className="text-gray-900">
                            {fact.title}:
                          </strong>{" "}
                          <span className="text-gray-600">{fact.content}</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </section>

            {/* How to Write Section - NEW */}
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

            {/* Enhanced CTA Section */}
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

            {/* Quick Navigation */}
            <section className="mt-16 max-w-5xl mx-auto">
              <h2 className="text-xl font-semibold text-gray-900 mb-6 text-center">
                Jump to Category
              </h2>
              <div className="flex flex-wrap justify-center gap-3">
                {allCategories.map((category) => {
                  const IconComponent = category.icon;
                  return (
                    <Link
                      key={category.id}
                      href={`#${category.id}`}
                      className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${category.color} hover:opacity-80 transition-opacity`}
                    >
                      <IconComponent className="w-4 h-4" />
                      <span className="text-sm font-medium">
                        {category.seoTitle
                          .replace(" Fortune Cookie Messages", "")
                          .replace(" Messages", "")}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </section>
          </div>
        </div>
      </main>
    </>
  );
}
