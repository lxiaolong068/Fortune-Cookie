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
        <div className="max-w-4xl mx-auto prose prose-slate dark:prose-invert prose-headings:font-heading">
          <h2 className="text-2xl font-heading font-semibold text-slate-800 dark:text-white mb-4">
            The Cultural Impact of Fortune Cookies
          </h2>
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
            Fortune cookies represent a unique example of cultural fusion in
            American cuisine. While often associated with Chinese restaurants,
            their true origins lie in Japanese tradition, and their modern form
            was developed in the United States. This fascinating history
            reflects the complex nature of cultural exchange and adaptation in
            immigrant communities.
          </p>
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
            Today, fortune cookies have transcended their restaurant origins to
            become a beloved cultural symbol, inspiring everything from digital
            fortune generators to philosophical discussions about fate and
            wisdom. Their evolution from traditional Japanese temple treats to
            modern AI-powered message generators demonstrates how cultural
            traditions adapt and thrive in new environments.
          </p>
          <h3 className="text-xl font-heading font-semibold text-slate-800 dark:text-white mb-3">
            Modern Fortune Cookies and Technology
          </h3>
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
            In the digital age, fortune cookies have found new life through
            online generators and AI-powered message creation. These modern
            interpretations maintain the spirit of the original while offering
            personalized, themed messages that can be customized for different
            occasions and preferences. The tradition continues to evolve,
            bringing ancient wisdom and modern technology together in delightful
            new ways.
          </p>
        </div>
      </PageSection>
    </PageLayout>
  );
}
