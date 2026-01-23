import { Metadata } from "next";
import { DynamicBackgroundEffects } from "@/components/DynamicBackgroundEffects";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin } from "lucide-react";
import {
  ArticleStructuredData,
  BreadcrumbStructuredData,
} from "@/components/StructuredData";
import { FAQStructuredData, historyFAQs } from "@/components/FAQStructuredData";
import { getImageUrl, getSiteUrl } from "@/lib/site";
import { generateAlternateLanguages } from "@/lib/i18n-config";

const baseUrl = getSiteUrl();

// Static generation configuration
export const dynamic = "force-static";
export const revalidate = 86400; // 24 hours

export const metadata: Metadata = {
  title: "History of Fortune Cookies - Origins and Cultural Evolution",
  description:
    "Explore the fascinating history of fortune cookies from Japanese roots in Kyoto to American invention in California. Discover the true story of Makoto Hagiwara and the evolution of this beloved treat.",
  openGraph: {
    title: "History of Fortune Cookies - Origins and Cultural Evolution",
    description:
      "Discover the fascinating history of fortune cookies, from their Japanese roots to American invention. Learn about Makoto Hagiwara and the cultural journey of this iconic cookie.",
    type: "article",
    url: `${baseUrl}/history`,
    images: [
      {
        url: getImageUrl("/og-image.png"),
        width: 1200,
        height: 630,
        alt: "History of Fortune Cookies",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "History of Fortune Cookies - Origins and Cultural Evolution",
    description:
      "Explore the fascinating history of fortune cookies from Japanese roots in Kyoto to American invention in California.",
    images: [getImageUrl("/twitter-image.png")],
    creator: "@fortunecookieai",
  },
  alternates: {
    canonical: "/history",
    languages: generateAlternateLanguages("/history", baseUrl),
  },
};

const timelineEvents = [
  {
    year: "1870s",
    title: "Japanese Origins",
    location: "Kyoto, Japan",
    description:
      'The earliest known predecessor to fortune cookies appears in Japan as "tsujiura senbei" - crackers containing fortunes sold near temples and shrines.',
    icon: "🏮",
    color: "bg-red-100 text-red-800",
  },
  {
    year: "1890s-1900s",
    title: "Immigration to America",
    location: "California, USA",
    description:
      "Japanese immigrants bring the concept to California, where it begins to evolve in the diverse cultural landscape of the American West Coast.",
    icon: "🚢",
    color: "bg-blue-100 text-blue-800",
  },
  {
    year: "1910s",
    title: "First American Fortune Cookies",
    location: "San Francisco, CA",
    description:
      "Makoto Hagiwara at the Japanese Tea Garden in Golden Gate Park is credited with serving the first fortune cookies in America.",
    icon: "🌸",
    color: "bg-pink-100 text-pink-800",
  },
  {
    year: "1920s-1930s",
    title: "Chinese Restaurant Adoption",
    location: "Los Angeles & San Francisco",
    description:
      "Chinese restaurants begin serving fortune cookies, gradually becoming associated with Chinese cuisine in American popular culture.",
    icon: "🥠",
    color: "bg-yellow-100 text-yellow-800",
  },
  {
    year: "1940s-1950s",
    title: "Mass Production Begins",
    location: "California",
    description:
      "Automated fortune cookie machines are invented, allowing for mass production and widespread distribution across the United States.",
    icon: "🏭",
    color: "bg-gray-100 text-gray-800",
  },
  {
    year: "1960s-Present",
    title: "Cultural Icon",
    location: "Worldwide",
    description:
      "Fortune cookies become a beloved cultural symbol, spreading globally and evolving into the digital age with AI-powered generators.",
    icon: "🌍",
    color: "bg-green-100 text-green-800",
  },
];

const funFacts = [
  {
    title: "Not Actually Chinese",
    description:
      "Despite popular belief, fortune cookies were invented in America, not China. They are rarely found in China today.",
    icon: "🤔",
  },
  {
    title: "Japanese Inspiration",
    description:
      'The concept originated from Japanese "omikuji" fortune-telling papers and "tsujiura senbei" crackers.',
    icon: "🎌",
  },
  {
    title: "World War II Impact",
    description:
      "During WWII, Japanese Americans were interned, leading Chinese restaurants to adopt and popularize fortune cookies.",
    icon: "📜",
  },
  {
    title: "Billions Produced",
    description:
      "Over 3 billion fortune cookies are produced annually, with most made in the United States.",
    icon: "📊",
  },
];

export default function HistoryPage() {
  return (
    <>
      <ArticleStructuredData
        headline="History of Fortune Cookies - Origins and Cultural Evolution"
        description="Discover the fascinating history of fortune cookies, from their Japanese roots to American invention. Learn about the cultural evolution and origins of this beloved treat."
        url="/history"
        datePublished="2024-01-01"
        dateModified={new Date().toISOString().split("T")[0]}
        keywords={[
          "history of fortune cookies",
          "fortune cookie origins",
          "who invented fortune cookies",
          "fortune cookies japanese roots",
          "fortune cookies in america",
          "cultural history",
          "asian american food history",
          "fortune cookie facts",
        ]}
      />
      <BreadcrumbStructuredData
        items={[
          { name: "Home", url: "/" },
          { name: "History of Fortune Cookies", url: "/history" },
        ]}
      />
      <main className="min-h-screen w-full overflow-x-hidden relative">
        <DynamicBackgroundEffects />
        <div className="relative z-10">
          <div className="container mx-auto px-4 py-8">
            {/* 页面标题 */}
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-amber-600 via-yellow-600 to-orange-600 bg-clip-text text-transparent mb-4">
                History of Fortune Cookies
              </h1>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Discover the fascinating journey of fortune cookies from their
                Japanese origins to becoming an iconic symbol of
                American-Chinese cuisine and culture.
              </p>
            </div>

            {/* 时间线 */}
            <section className="mb-16">
              <h2 className="text-2xl font-semibold text-gray-800 mb-8 text-center">
                Timeline of Fortune Cookie History
              </h2>
              <div className="space-y-8">
                {timelineEvents.map((event, index) => (
                  <div
                    key={index}
                    className="flex flex-col md:flex-row gap-6 items-start"
                  >
                    <div className="flex-shrink-0">
                      <div className="w-16 h-16 rounded-full bg-white/90 backdrop-blur-sm border-2 border-amber-200 flex items-center justify-center text-2xl">
                        {event.icon}
                      </div>
                    </div>
                    <Card className="flex-1 p-6 bg-white/90 backdrop-blur-sm border-amber-200">
                      <div className="flex flex-wrap items-center gap-3 mb-3">
                        <Badge className={event.color}>{event.year}</Badge>
                        <div className="flex items-center gap-1 text-sm text-gray-500">
                          <MapPin className="w-4 h-4" />
                          {event.location}
                        </div>
                      </div>
                      <h3 className="text-xl font-semibold text-gray-800 mb-2">
                        {event.title}
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        {event.description}
                      </p>
                    </Card>
                  </div>
                ))}
              </div>
            </section>

            {/* 有趣的事实 */}
            <section className="mb-16">
              <h2 className="text-2xl font-semibold text-gray-800 mb-8 text-center">
                Fun Facts About Fortune Cookies
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                {funFacts.map((fact, index) => (
                  <Card
                    key={index}
                    className="p-6 bg-white/90 backdrop-blur-sm border-amber-200 hover:shadow-lg transition-all duration-200"
                  >
                    <div className="flex items-start gap-4">
                      <div className="text-3xl">{fact.icon}</div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">
                          {fact.title}
                        </h3>
                        <p className="text-gray-600 leading-relaxed">
                          {fact.description}
                        </p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </section>

            {/* SEO内容 */}
            <div className="max-w-4xl mx-auto">
              <section className="mb-12">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                  The Cultural Impact of Fortune Cookies
                </h2>
                <p className="text-gray-600 leading-relaxed mb-4">
                  Fortune cookies represent a unique example of cultural fusion
                  in American cuisine. While often associated with Chinese
                  restaurants, their true origins lie in Japanese tradition, and
                  their modern form was developed in the United States. This
                  fascinating history reflects the complex nature of cultural
                  exchange and adaptation in immigrant communities.
                </p>
                <p className="text-gray-600 leading-relaxed">
                  Today, fortune cookies have transcended their restaurant
                  origins to become a beloved cultural symbol, inspiring
                  everything from digital fortune generators to philosophical
                  discussions about fate and wisdom. Their evolution from
                  traditional Japanese temple treats to modern AI-powered
                  message generators demonstrates how cultural traditions adapt
                  and thrive in new environments.
                </p>
              </section>

              <section className="mb-12">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                  Modern Fortune Cookies and Technology
                </h2>
                <p className="text-gray-600 leading-relaxed">
                  In the digital age, fortune cookies have found new life
                  through online generators and AI-powered message creation.
                  These modern interpretations maintain the spirit of the
                  original while offering personalized, themed messages that can
                  be customized for different occasions and preferences. The
                  tradition continues to evolve, bringing ancient wisdom and
                  modern technology together in delightful new ways.
                </p>
              </section>
            </div>
          </div>
        </div>
      </main>

      <FAQStructuredData faqs={historyFAQs} />
    </>
  );
}
