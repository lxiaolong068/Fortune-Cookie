"use client";

import { Clock, MapPin, Sparkles, BookOpen } from "lucide-react";
import { PageLayout, PageSection } from "@/components/PageLayout";
import { PageHero, HeroBadge } from "@/components/PageHero";
import { ModernCard, ModernCardIcon } from "@/components/ui/modern-card";
import { Badge } from "@/components/ui/badge";

const timelineEvents = [
  {
    year: "1870s",
    title: "Japanese Origins",
    location: "Kyoto, Japan",
    description:
      'The earliest known predecessor to fortune cookies appears in Japan as "tsujiura senbei" - crackers containing fortunes sold near temples and shrines.',
    icon: "🏮",
    gradient: { from: "from-red-500", to: "to-rose-500" },
  },
  {
    year: "1890s-1900s",
    title: "Immigration to America",
    location: "California, USA",
    description:
      "Japanese immigrants bring the concept to California, where it begins to evolve in the diverse cultural landscape of the American West Coast.",
    icon: "🚢",
    gradient: { from: "from-blue-500", to: "to-cyan-500" },
  },
  {
    year: "1910s",
    title: "First American Fortune Cookies",
    location: "San Francisco, CA",
    description:
      "Makoto Hagiwara at the Japanese Tea Garden in Golden Gate Park is credited with serving the first fortune cookies in America.",
    icon: "🌸",
    gradient: { from: "from-pink-500", to: "to-fuchsia-500" },
  },
  {
    year: "1920s-1930s",
    title: "Chinese Restaurant Adoption",
    location: "Los Angeles & San Francisco",
    description:
      "Chinese restaurants begin serving fortune cookies, gradually becoming associated with Chinese cuisine in American popular culture.",
    icon: "🥠",
    gradient: { from: "from-amber-500", to: "to-orange-500" },
  },
  {
    year: "1940s-1950s",
    title: "Mass Production Begins",
    location: "California",
    description:
      "Automated fortune cookie machines are invented, allowing for mass production and widespread distribution across the United States.",
    icon: "🏭",
    gradient: { from: "from-slate-500", to: "to-slate-600" },
  },
  {
    year: "1960s-Present",
    title: "Cultural Icon",
    location: "Worldwide",
    description:
      "Fortune cookies become a beloved cultural symbol, spreading globally and evolving into the digital age with AI-powered generators.",
    icon: "🌍",
    gradient: { from: "from-emerald-500", to: "to-teal-500" },
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

export function HistoryPageContent() {
  return (
    <PageLayout background="subtle" gradient="indigo" headerOffset={false}>
      {/* Hero Section */}
      <PageHero
        title="History of Fortune Cookies"
        subtitle="Origins & Evolution"
        description="Discover the fascinating journey of fortune cookies from their Japanese origins to becoming an iconic symbol of American-Chinese cuisine and culture."
        icon={Clock}
        iconGradient={{ from: "from-amber-500", to: "to-orange-500" }}
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "History" }]}
        badge={<HeroBadge icon={BookOpen}>Cultural Story</HeroBadge>}
        size="md"
      />

      {/* Timeline Section */}
      <PageSection padding="lg" bg="transparent">
        <div className="flex items-center gap-3 mb-8 justify-center">
          <ModernCardIcon
            gradientFrom="from-indigo-500"
            gradientTo="to-purple-500"
            size="sm"
          >
            <Clock className="w-4 h-4 text-white" />
          </ModernCardIcon>
          <h2 className="text-2xl font-heading font-semibold text-slate-800 dark:text-white">
            Timeline of Fortune Cookie History
          </h2>
        </div>

        <div className="max-w-4xl mx-auto space-y-6">
          {timelineEvents.map((event, index) => (
            <div
              key={index}
              className="flex flex-col md:flex-row gap-6 items-start"
            >
              <div className="flex-shrink-0">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-white/80 to-white/40 dark:from-slate-800/80 dark:to-slate-800/40 backdrop-blur-sm border border-white/50 dark:border-slate-700/50 flex items-center justify-center text-3xl shadow-lg">
                  {event.icon}
                </div>
              </div>
              <ModernCard variant="glass" hoverable className="flex-1">
                <div className="p-6">
                  <div className="flex flex-wrap items-center gap-3 mb-3">
                    <Badge
                      className={`bg-gradient-to-r ${event.gradient.from} ${event.gradient.to} text-white border-transparent`}
                    >
                      {event.year}
                    </Badge>
                    <div className="flex items-center gap-1 text-sm text-slate-500 dark:text-slate-400">
                      <MapPin className="w-4 h-4" />
                      {event.location}
                    </div>
                  </div>
                  <h3 className="text-xl font-heading font-semibold text-slate-800 dark:text-white mb-2">
                    {event.title}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                    {event.description}
                  </p>
                </div>
              </ModernCard>
            </div>
          ))}
        </div>
      </PageSection>

      {/* Fun Facts Section */}
      <PageSection padding="lg" bg="gradient">
        <div className="flex items-center gap-3 mb-8 justify-center">
          <ModernCardIcon
            gradientFrom="from-amber-500"
            gradientTo="to-orange-500"
            size="sm"
          >
            <Sparkles className="w-4 h-4 text-white" />
          </ModernCardIcon>
          <h2 className="text-2xl font-heading font-semibold text-slate-800 dark:text-white">
            Fun Facts About Fortune Cookies
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {funFacts.map((fact, index) => (
            <ModernCard key={index} variant="glass" hoverable>
              <div className="p-6 flex items-start gap-4">
                <div className="text-4xl flex-shrink-0">{fact.icon}</div>
                <div>
                  <h3 className="text-lg font-heading font-semibold text-slate-800 dark:text-white mb-2">
                    {fact.title}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm">
                    {fact.description}
                  </p>
                </div>
              </div>
            </ModernCard>
          ))}
        </div>
      </PageSection>

      {/* SEO Content Section */}
      <PageSection padding="lg" bg="white">
        <div className="max-w-4xl mx-auto space-y-12">

          {/* Cultural Impact */}
          <div className="prose prose-slate dark:prose-invert prose-headings:font-heading max-w-none">
            <h2 className="text-2xl font-heading font-semibold text-slate-800 dark:text-white mb-4">
              The Cultural Impact of Fortune Cookies
            </h2>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
              Fortune cookies represent one of the most fascinating examples of cultural fusion in American culinary history. While universally associated with Chinese restaurants, their true origins lie in Japanese tradition — a nuance that was largely obscured by the upheaval of World War II, when Japanese-American businesses were shuttered and Chinese restaurants stepped in to fill the void, bringing fortune cookies with them.
            </p>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
              The cookie's journey from a Japanese temple treat (<em>tsujiura senbei</em>) to an American pop-culture icon reflects the complex, often invisible ways that immigrant communities shape national identity. Today, over <strong>3 billion fortune cookies</strong> are produced annually in the United States alone — yet the treat remains virtually unknown in mainland China, where it is sometimes marketed as an "American curiosity."
            </p>
            <h3 className="text-xl font-heading font-semibold text-slate-800 dark:text-white mb-3">
              Fortune Cookies in the Digital Age
            </h3>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
              In the 21st century, fortune cookies have found new life through digital platforms. AI-powered fortune cookie generators now allow anyone to receive a personalized message in seconds, themed to their mood, occasion, or language. This evolution mirrors the cookie's original spirit: a small, unexpected moment of wisdom or humor delivered at just the right time.
            </p>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              From physical bakeries producing billions of crispy wafers to AI models generating millions of unique messages, the fortune cookie has proven remarkably adaptable. Its core appeal — the delight of an unexpected message — transcends medium, culture, and era.
            </p>
          </div>

          {/* Key facts table */}
          <div>
            <h2 className="text-2xl font-heading font-semibold text-slate-800 dark:text-white mb-4">
              Fortune Cookie History: Key Facts at a Glance
            </h2>
            <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 dark:bg-slate-800">
                  <tr>
                    <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-300">Topic</th>
                    <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-300">Detail</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                  {[
                    ["Origin country", "Japan (not China)"],
                    ["Earliest predecessor", "Tsujiura senbei — Japanese temple crackers with fortunes, 1870s"],
                    ["First in America", "Makoto Hagiwara, Japanese Tea Garden, San Francisco, ~1914"],
                    ["Why linked to China", "WWII internment of Japanese Americans; Chinese restaurants adopted the treat"],
                    ["Annual production", "Over 3 billion cookies per year, mostly in the USA"],
                    ["Largest manufacturer", "Wonton Food Inc., Brooklyn, NY — produces ~4.5 million/day"],
                    ["Typical fortune length", "15–20 words"],
                    ["Lucky numbers", "Most fortunes include 6 lucky numbers on the reverse"],
                  ].map(([topic, detail]) => (
                    <tr key={topic} className="bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="px-4 py-3 font-medium text-slate-700 dark:text-slate-300">{topic}</td>
                      <td className="px-4 py-3 text-slate-600 dark:text-slate-400">{detail}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* FAQ */}
          <div>
            <h2 className="text-2xl font-heading font-semibold text-slate-800 dark:text-white mb-6">
              Frequently asked questions about fortune cookie history
            </h2>
            <div className="space-y-4">
              {[
                {
                  q: "Who invented fortune cookies?",
                  a: "The most widely accepted account credits Makoto Hagiwara, a Japanese immigrant who managed the Japanese Tea Garden in San Francisco's Golden Gate Park. He is believed to have served fortune cookies to guests around 1914. However, David Jung of Los Angeles also claims credit, creating them around 1918. The debate remains unresolved, but both claimants are American, not Chinese.",
                },
                {
                  q: "Are fortune cookies actually Chinese?",
                  a: "No. Fortune cookies were invented in the United States, inspired by Japanese temple crackers (tsujiura senbei). They became associated with Chinese cuisine after WWII, when Chinese restaurants adopted them following the internment of Japanese Americans. Fortune cookies are largely unknown in mainland China.",
                },
                {
                  q: "What is written inside a fortune cookie?",
                  a: "Traditional fortune cookie messages include short proverbs, predictions, or words of wisdom — typically 15–20 words. The reverse side usually features a set of lucky numbers and sometimes a word in Chinese or a language lesson. Modern AI-generated fortunes can be themed to specific occasions, moods, or styles.",
                },
                {
                  q: "How many fortune cookies are made each year?",
                  a: "Over 3 billion fortune cookies are produced annually, with the vast majority made in the United States. The largest single manufacturer is Wonton Food Inc. in Brooklyn, New York, which produces approximately 4.5 million cookies per day.",
                },
                {
                  q: "What is the difference between a fortune cookie and a tsujiura senbei?",
                  a: "Tsujiura senbei are larger, darker, and made with miso and sesame — quite different from the sweet, vanilla-flavored American fortune cookie. The fortune is folded inside the senbei rather than tucked into a fold. Both share the core concept of a baked treat containing a paper fortune.",
                },
              ].map((faq) => (
                <div key={faq.q} className="p-5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  <p className="font-semibold text-slate-800 dark:text-white mb-2 text-sm">{faq.q}</p>
                  <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Internal links */}
          <div>
            <h2 className="text-xl font-heading font-semibold text-slate-800 dark:text-white mb-3">
              Continue exploring fortune cookies
            </h2>
            <div className="grid md:grid-cols-2 gap-3">
              {[
                { icon: "🤔", title: "Who Invented Fortune Cookies?", href: "/who-invented-fortune-cookies" },
                { icon: "🤖", title: "AI Fortune Cookie Generator", href: "/generator" },
                { icon: "🍪", title: "Fortune Cookie Recipes", href: "/recipes" },
                { icon: "🔧", title: "How to Make Fortune Cookies", href: "/how-to-make-fortune-cookies" },
                { icon: "🎊", title: "Fortune Cookie Messages by Occasion", href: "/fortune-cookie-messages" },
                { icon: "💬", title: "Fortune Cookie Quotes", href: "/fortune-cookie-quotes" },
              ].map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-amber-400 dark:hover:border-amber-600 hover:shadow-sm transition-all text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-amber-700 dark:hover:text-amber-400 group"
                >
                  <span className="text-lg flex-shrink-0">{link.icon}</span>
                  <span className="flex-1">{link.title}</span>
                  <span className="text-slate-400 group-hover:translate-x-1 transition-transform">→</span>
                </a>
              ))}
            </div>
          </div>

        </div>
      </PageSection>
    </PageLayout>
  );
}
