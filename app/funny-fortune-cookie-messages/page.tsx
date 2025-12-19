import { Metadata } from "next";
import { DynamicBackgroundEffects } from "@/components/DynamicBackgroundEffects";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Smile, Laugh, Sparkles, Copy, Share2 } from "lucide-react";
import {
  BreadcrumbStructuredData,
  ArticleStructuredData,
} from "@/components/StructuredData";
import {
  FAQStructuredData,
  funnyFortuneFAQs,
} from "@/components/FAQStructuredData";
import { RelatedPages, messageRelatedPages } from "@/components/RelatedPages";
import { getSiteUrl } from "@/lib/site";

const baseUrl = getSiteUrl();

// Static generation configuration
export const dynamic = "force-static";
export const revalidate = 86400; // 24 hours

export const metadata: Metadata = {
  title: "Funny Fortune Cookie Messages - Hilarious Sayings & Jokes",
  description:
    "Discover the funniest fortune cookie messages and hilarious sayings! Perfect for parties and pranks. Browse our collection of witty, humorous fortunes.",
  openGraph: {
    title: "Funny Fortune Cookie Messages - Hilarious Sayings & Jokes",
    description:
      "Discover the funniest fortune cookie messages and hilarious sayings! Perfect for parties and pranks. Browse our collection of witty, humorous fortunes.",
    type: "article",
    url: `${baseUrl}/funny-fortune-cookie-messages`,
  },
  alternates: {
    canonical: "/funny-fortune-cookie-messages",
  },
};

const funnyCategories = [
  {
    title: "Classic Funny Messages",
    icon: Smile,
    color: "bg-yellow-100 text-yellow-800",
    messages: [
      "You will find happiness with a new love... probably your cat.",
      "A closed mouth gathers no foot.",
      "You will be hungry again in one hour.",
      "Help! I'm being held prisoner in a fortune cookie factory!",
      "The early bird might get the worm, but the second mouse gets the cheese.",
      "You are not illiterate.",
      "Ignore previous fortune.",
      "You will receive a fortune cookie.",
      "Beware of cookies bearing fortunes.",
      "You are reading a fortune cookie.",
    ],
  },
  {
    title: "Witty & Clever",
    icon: Laugh,
    color: "bg-blue-100 text-blue-800",
    messages: [
      "Your future is as bright as your past is dark... which isn't saying much.",
      "You will soon be hungry again. Order more Chinese food.",
      "A wise man once said nothing. He was probably eating.",
      "Your lucky numbers are: All of them. You'll need the luck.",
      "Today you will make progress... toward your refrigerator.",
      "You will find what you're looking for in the last place you look. Obviously.",
      "A journey of a thousand miles begins with a single step... and comfortable shoes.",
      "You will live long enough to open many fortune cookies.",
      "Your future contains many fortune cookies.",
      "The answer you seek is in another cookie.",
    ],
  },
  {
    title: "Absurd & Random",
    icon: Sparkles,
    color: "bg-purple-100 text-purple-800",
    messages: [
      "Your socks will bring you great fortune... if you wear them.",
      "Beware of falling coconuts on Tuesday.",
      "You will soon meet a tall, dark stranger... in the mirror.",
      "Your pet goldfish is plotting against you.",
      "The moon is made of cheese, but not the good kind.",
      "You will discover that your refrigerator is running. You should catch it.",
      "A duck will change your life. Probably not today.",
      "Your future involves at least three more meals.",
      "You will soon realize this fortune makes no sense.",
      "Congratulations! You can read.",
    ],
  },
  {
    title: "Self-Referential Humor",
    icon: Copy,
    color: "bg-green-100 text-green-800",
    messages: [
      "This fortune is worth exactly what you paid for it.",
      "You have just wasted time reading this fortune.",
      "This fortune cookie is stale.",
      "You will eat another fortune cookie within 24 hours.",
      "The fortune you seek is in another cookie.",
      "This fortune intentionally left blank.",
      "Error 404: Fortune not found.",
      "Your fortune is loading... please wait.",
      "This fortune has been recalled by the manufacturer.",
      "You are holding a fortune cookie. Congratulations on your observation skills.",
    ],
  },
];

const usageIdeas = [
  {
    title: "Party Entertainment",
    description:
      "Use funny fortune cookies as party favors or ice breakers at gatherings.",
    icon: "🎉",
  },
  {
    title: "Office Pranks",
    description:
      "Brighten up the workplace with humorous fortunes in the break room.",
    icon: "💼",
  },
  {
    title: "Gift Additions",
    description: "Add a funny fortune cookie to gift bags for an extra smile.",
    icon: "🎁",
  },
  {
    title: "Social Media",
    description:
      "Share funny fortune messages on social media for laughs and engagement.",
    icon: "📱",
  },
];

export default function FunnyFortuneCookieMessagesPage() {
  return (
    <>
      <ArticleStructuredData
        headline="Funny Fortune Cookie Messages - Hilarious Sayings & Jokes"
        description="Discover the funniest fortune cookie messages and hilarious sayings. Perfect for parties, pranks, and bringing smiles."
        url="/funny-fortune-cookie-messages"
        datePublished="2024-01-01"
        dateModified={new Date().toISOString().split("T")[0]}
        keywords={[
          "funny fortune cookie messages",
          "hilarious fortune cookie sayings",
          "funny fortune cookie jokes",
          "witty fortune cookie quotes",
        ]}
      />
      <BreadcrumbStructuredData
        items={[
          { name: "Home", url: "/" },
          { name: "Messages", url: "/messages" },
          {
            name: "Funny Fortune Cookie Messages",
            url: "/funny-fortune-cookie-messages",
          },
        ]}
      />

      <main className="min-h-screen w-full overflow-x-hidden relative">
        <DynamicBackgroundEffects />
        <div className="relative z-10">
          <div className="container mx-auto px-4 py-8">
            {/* 页面标题 */}
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-amber-600 via-yellow-600 to-orange-600 bg-clip-text text-transparent mb-4">
                Funny Fortune Cookie Messages
              </h1>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-6">
                Get ready to laugh with our collection of hilarious fortune
                cookie messages! Perfect for parties, pranks, or just
                brightening someone’s day with humor.
              </p>

              <div className="flex flex-wrap justify-center gap-4">
                <Badge className="bg-yellow-100 text-yellow-800">
                  <Smile className="w-3 h-3 mr-1" />
                  100+ Funny Messages
                </Badge>
                <Badge className="bg-blue-100 text-blue-800">
                  <Laugh className="w-3 h-3 mr-1" />
                  Family Friendly
                </Badge>
                <Badge className="bg-green-100 text-green-800">
                  <Share2 className="w-3 h-3 mr-1" />
                  Easy to Share
                </Badge>
              </div>
            </div>

            {/* 搞笑消息分类 */}
            <div className="space-y-12 mb-16">
              {funnyCategories.map((category, categoryIndex) => {
                const Icon = category.icon;
                return (
                  <section key={categoryIndex}>
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-2 rounded-lg bg-white/80 backdrop-blur-sm border border-amber-200">
                        <Icon className="w-6 h-6 text-amber-600" />
                      </div>
                      <h2 className="text-2xl font-semibold text-gray-800">
                        {category.title}
                      </h2>
                      <Badge className={category.color}>
                        {category.messages.length} messages
                      </Badge>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {category.messages.map((message, index) => (
                        <Card
                          key={index}
                          className="p-4 bg-white/90 backdrop-blur-sm border-amber-200 hover:shadow-lg transition-all duration-200 group"
                        >
                          <div className="flex items-start gap-3">
                            <Sparkles className="w-4 h-4 text-amber-500 mt-1 flex-shrink-0" />
                            <div className="flex-1">
                              <blockquote className="text-gray-700 italic leading-relaxed text-sm mb-3">
                                &ldquo;{message}&rdquo;
                              </blockquote>
                              <div className="text-xs text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                                Click to copy
                              </div>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </section>
                );
              })}
            </div>

            {/* 使用建议 */}
            <section className="mb-12">
              <h2 className="text-2xl font-semibold text-gray-800 mb-8 text-center">
                Creative Ways to Use Funny Fortune Messages
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {usageIdeas.map((idea, index) => (
                  <Card
                    key={index}
                    className="p-6 bg-white/90 backdrop-blur-sm border-amber-200 text-center hover:shadow-lg transition-all duration-200"
                  >
                    <div className="text-4xl mb-4">{idea.icon}</div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                      {idea.title}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {idea.description}
                    </p>
                  </Card>
                ))}
              </div>
            </section>

            {/* 创作提示 */}
            <section>
              <Card className="p-8 bg-gradient-to-r from-yellow-50 to-orange-50 border-amber-200">
                <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
                  Tips for Creating Your Own Funny Fortune Messages
                </h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-3">
                      Keep It Short & Sweet
                    </h3>
                    <p className="text-gray-600 mb-4">
                      The best funny fortunes are concise and punchy. Aim for
                      one or two sentences that deliver the humor quickly.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-3">
                      Play with Expectations
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Start with a traditional fortune format, then twist it
                      with unexpected humor or absurd conclusions.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-3">
                      Use Self-Reference
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Some of the funniest fortunes reference the fact that
                      they’re fortune cookies or break the fourth wall.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-3">
                      Stay Family-Friendly
                    </h3>
                    <p className="text-gray-600 mb-4">
                      The best funny fortunes are clever without being
                      offensive, making them perfect for any audience.
                    </p>
                  </div>
                </div>
              </Card>
            </section>

            {/* FAQ Section */}
            <section className="mb-16">
              <h2 className="text-3xl font-bold text-center mb-8 text-gray-900">
                Frequently Asked Questions
              </h2>
              <Card className="max-w-4xl mx-auto">
                <div className="p-6 space-y-6">
                  {funnyFortuneFAQs.map((faq, index) => (
                    <div
                      key={index}
                      className="border-b border-gray-200 last:border-b-0 pb-4 last:pb-0"
                    >
                      <h3 className="font-semibold text-lg text-gray-900 mb-2">
                        {faq.question}
                      </h3>
                      <p className="text-gray-600">{faq.answer}</p>
                    </div>
                  ))}
                </div>
              </Card>
            </section>

            {/* Related Pages */}
            <RelatedPages
              title="Explore More Fortune Content"
              pages={messageRelatedPages}
              className="mb-8"
            />
          </div>
        </div>
      </main>

      <FAQStructuredData faqs={funnyFortuneFAQs} />
    </>
  );
}
