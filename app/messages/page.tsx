import { Metadata } from "next";
import { DynamicBackgroundEffects } from "@/components/DynamicBackgroundEffects";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sparkles, Heart, Smile, TrendingUp, Star, Scroll, Brain, Globe, Lightbulb } from "lucide-react";
import Link from "next/link";
import {
  ItemListStructuredData,
  BreadcrumbStructuredData,
} from "@/components/StructuredData";
import { getSiteUrl } from "@/lib/site";

const baseUrl = getSiteUrl();

export const metadata: Metadata = {
  title: "Fortune Cookie Messages: History, Psychology & Daily Inspiration",
  description:
    "Explore the fascinating history of fortune cookies, the psychology behind why we love them, and a curated collection of inspirational, funny, and love-themed messages.",
  openGraph: {
    title: "Fortune Cookie Messages: History, Psychology & Daily Inspiration",
    description:
      "Explore the fascinating history of fortune cookies, the psychology behind why we love them, and a curated collection of inspirational, funny, and love-themed messages.",
    type: "website",
    url: `${baseUrl}/messages`,
  },
  alternates: {
    canonical: "/messages",
  },
};

// 示例消息数据
const messageCategories = [
  {
    id: "inspirational",
    name: "Inspirational",
    icon: Star,
    color: "bg-blue-100 text-blue-800",
    messages: [
      "Your future is created by what you do today, not tomorrow.",
      "The best time to plant a tree was 20 years ago. The second best time is now.",
      "Success is not final, failure is not fatal: it is the courage to continue that counts.",
      "Believe you can and you're halfway there.",
      "The only way to do great work is to love what you do.",
    ],
  },
  {
    id: "funny",
    name: "Funny",
    icon: Smile,
    color: "bg-yellow-100 text-yellow-800",
    messages: [
      "You will find happiness with a new love... probably your cat.",
      "A closed mouth gathers no foot.",
      "You will be hungry again in one hour.",
      "Help! I'm being held prisoner in a fortune cookie factory!",
      "The early bird might get the worm, but the second mouse gets the cheese.",
    ],
  },
  {
    id: "love",
    name: "Love & Relationships",
    icon: Heart,
    color: "bg-pink-100 text-pink-800",
    messages: [
      "Love is the bridge between two hearts.",
      "The best love is the kind that awakens the soul.",
      "True love stories never have endings.",
      "Love is not about finding the right person, but being the right person.",
      "In the arithmetic of love, one plus one equals everything.",
    ],
  },
  {
    id: "success",
    name: "Success & Career",
    icon: TrendingUp,
    color: "bg-green-100 text-green-800",
    messages: [
      "Success is where preparation and opportunity meet.",
      "The way to get started is to quit talking and begin doing.",
      "Innovation distinguishes between a leader and a follower.",
      "Don't be afraid to give up the good to go for the great.",
      "Your limitation—it's only your imagination.",
    ],
  },
];

const funFacts = [
  {
    title: "Not Actually Chinese",
    content: "Fortune cookies likely originated in Japan, not China. A Japanese cracker called 'tsujiura senbei' dates back to 19th-century Kyoto.",
    icon: Globe,
  },
  {
    title: "Billions Served",
    content: "Approximately 3 billion fortune cookies are produced globally every year, with the vast majority consumed in the United States.",
    icon: TrendingUp,
  },
  {
    title: "Lottery Winners",
    content: "A surprising number of people have won lottery jackpots by playing the 'lucky numbers' found on the back of their fortune cookie slips!",
    icon: Sparkles,
  },
];

export default function MessagesPage() {
  // Prepare message items for structured data
  const messageItems = messageCategories.flatMap((category) =>
    category.messages.map((message) => ({
      name: message,
      description: `${category.name} fortune cookie message`,
      category: category.name,
    })),
  );

  return (
    <>
      <ItemListStructuredData
        name="Fortune Cookie Messages Collection"
        description="Browse our collection of inspirational fortune cookie messages, funny quotes, and motivational sayings. Find the perfect fortune cookie message for any occasion."
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
            {/* 页面标题 */}
            <div className="text-center mb-16">
              <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-amber-600 via-yellow-600 to-orange-600 bg-clip-text text-transparent mb-6">
                Fortune Cookie Messages
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Discover a world of wisdom, humor, and daily inspiration. From ancient proverbs
                to AI-generated insights, explore the messages that have captivated hearts for generations.
              </p>
            </div>

            {/* 消息分类 */}
            <div className="space-y-16">
              {messageCategories.map((category) => {
                const IconComponent = category.icon;
                return (
                  <section key={category.id} className="scroll-mt-20">
                    <div className="flex items-center gap-3 mb-8">
                      <div className="p-3 rounded-xl bg-white/80 backdrop-blur-sm border border-amber-200 shadow-sm">
                        <IconComponent className="w-8 h-8 text-amber-600" />
                      </div>
                      <div>
                        <h2 className="text-3xl font-bold text-gray-900">
                          {category.name}
                        </h2>
                        <Badge variant="secondary" className={`${category.color} mt-2`}>
                          {category.messages.length} curated messages
                        </Badge>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {category.messages.map((message, index) => (
                        <Card
                          key={index}
                          className="group p-6 bg-white/90 backdrop-blur-sm border-amber-100 hover:border-amber-300 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                        >
                          <div className="flex items-start gap-4">
                            <Sparkles className="w-6 h-6 text-amber-400 mt-1 flex-shrink-0 opacity-50 group-hover:opacity-100 transition-opacity" />
                            <blockquote className="text-lg text-gray-700 font-medium italic leading-relaxed">
                              &ldquo;{message}&rdquo;
                            </blockquote>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </section>
                );
              })}
            </div>

            {/* 新增内容板块 */}
            <div className="mt-24 space-y-24 max-w-5xl mx-auto">
              {/* History Section */}
              <section className="bg-white/60 backdrop-blur-md rounded-3xl p-8 md:p-12 border border-amber-100 shadow-lg">
                <div className="flex items-center gap-4 mb-8">
                  <div className="p-3 bg-amber-100 rounded-full">
                    <Scroll className="w-8 h-8 text-amber-700" />
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                    A Brief History of Fortune Cookies
                  </h2>
                </div>
                <div className="prose prose-lg text-gray-700 max-w-none">
                  <p>
                    While often synonymous with Chinese takeout in ancient Western culture, the fortune cookie actually traces its roots back to <b>19th-century Japan</b>.  A similar cracker known as <em>&quot;tsujiura senbei&quot;</em> was sold in Kyoto, featuring a paper fortune tucked into the fold of the savory, sesame-miso flavored treat.
                  </p>
                  <p className="mt-4">
                    The modern, vanilla-sweetened version we know today was popularized in <b>California</b> in the early 20th century. While the exact inventor is debated—often attributed to either Makoto Hagiwara of San Francisco or David Jung of Los Angeles—it wasn&apos;t until after World War II that they became a staple in Chinese-American restaurants, eventually spreading joy (and lucky numbers) across the globe.
                  </p>
                </div>
              </section>

              {/* Psychology Section */}
              <section className="grid md:grid-cols-2 gap-12 items-center">
                <div className="order-2 md:order-1">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="p-3 bg-purple-100 rounded-full">
                      <Brain className="w-8 h-8 text-purple-700" />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900">
                      Why We Love Them
                    </h2>
                  </div>
                  <div className="prose prose-lg text-gray-700">
                    <p>
                      The appeal of fortune cookies goes beyond the crunch. It&apos;s often linked to the <b>Barnum Effect</b> (or Forer Effect)—a psychological phenomenon where individuals believe consistent, generic personality descriptions apply specifically to them.
                    </p>
                    <p className="mt-4">
                      The vague yet positive nature of fortune cookie messages allows us to project our own hopes, dreams, and current situations onto the text. This creates a moment of personal connection and delight, making the experience feel serendipitous and meaningful.
                    </p>
                  </div>
                </div>
                <div className="order-1 md:order-2 bg-gradient-to-br from-purple-50 to-amber-50 p-8 rounded-2xl border border-purple-100 shadow-inner">
                  <h3 className="text-xl font-bold text-purple-900 mb-4">Did You Know?</h3>
                  <ul className="space-y-4">
                    {funFacts.map((fact, idx) => (
                      <li key={idx} className="flex gap-3 items-start">
                        <fact.icon className="w-5 h-5 text-purple-600 mt-1 flex-shrink-0" />
                        <div>
                          <strong className="block text-gray-900 font-semibold">{fact.title}</strong>
                          <span className="text-gray-600 text-sm">{fact.content}</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </section>

              {/* CTA Section */}
              <section className="text-center bg-gradient-to-r from-amber-500 to-orange-500 rounded-3xl p-12 shadow-2xl text-white relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full bg-[url('/noise.png')] opacity-20 user-select-none pointer-events-none"></div>
                <div className="relative z-10">
                  <Lightbulb className="w-16 h-16 mx-auto mb-6 text-yellow-200 animate-pulse" />
                  <h2 className="text-3xl md:text-5xl font-bold mb-6">
                    Create Your Own Destiny
                  </h2>
                  <p className="text-xl md:text-2xl text-amber-50 mb-10 max-w-2xl mx-auto">
                    Why wait for a cookie to tell your future? Use our advanced AI generator to craft unique, personalized fortune messages instantly.
                  </p>
                  <Link href="/generator">
                    <Button size="lg" className="bg-white text-amber-600 hover:bg-yellow-50 font-bold text-lg px-8 py-6 h-auto shadow-lg hover:shadow-xl transition-all hover:scale-105">
                      Generate AI Fortune Now
                    </Button>
                  </Link>
                </div>
              </section>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
