"use client";
import Link from "next/link";
import { Heart, Sparkles, Star, Share2, Wand2 } from "lucide-react";
import { FavoritesList } from "@/components/FavoritesList";
import { PageLayout, PageSection } from "@/components/PageLayout";
import { PageHero, HeroBadge } from "@/components/PageHero";

export function FavoritesPageContent() {
  return (
    <PageLayout background="subtle" gradient="indigo" headerOffset={false}>
      {/* Hero Section */}
      <PageHero
        title="My Favorites"
        subtitle="Saved Fortunes"
        description="Your personal collection of saved fortune cookie messages. Revisit your favorite AI-generated fortunes, share them with friends, or find inspiration whenever you need it."
        icon={Heart}
        iconGradient={{ from: "from-pink-500", to: "to-rose-500" }}
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Favorites" }]}
        badge={<HeroBadge icon={Sparkles}>Personal Collection</HeroBadge>}
        size="md"
      />

      {/* Favorites List */}
      <PageSection padding="lg" bg="transparent">
        <FavoritesList />
      </PageSection>

      {/* SEO Content Section */}
      <PageSection padding="lg" bg="white">
        <div className="max-w-4xl mx-auto space-y-12">

          {/* How it works */}
          <div>
            <h2 className="text-2xl font-heading font-semibold text-slate-800 dark:text-white mb-6">
              How to save and manage your favorite fortunes
            </h2>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="p-5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex flex-col gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center flex-shrink-0">
                  <Wand2 className="w-5 h-5 text-white" />
                </div>
                <p className="font-semibold text-slate-800 dark:text-white text-sm">1. Generate a fortune</p>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed flex-1">Visit the AI Fortune Cookie Generator and crack open a cookie. Choose from 6 themes: Inspirational, Funny, Romantic, Motivational, Philosophical, or Lucky.</p>
                <Link href="/generator" className="text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 mt-auto">
                  Go to Generator →
                </Link>
              </div>
              <div className="p-5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex flex-col gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center flex-shrink-0">
                  <Heart className="w-5 h-5 text-white" />
                </div>
                <p className="font-semibold text-slate-800 dark:text-white text-sm">2. Save your favorites</p>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed flex-1">Click the heart icon on any fortune you love. Your saved fortunes are stored in your account and synced across devices when you are signed in.</p>
              </div>
              <div className="p-5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex flex-col gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center flex-shrink-0">
                  <Share2 className="w-5 h-5 text-white" />
                </div>
                <p className="font-semibold text-slate-800 dark:text-white text-sm">3. Share &amp; revisit</p>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed flex-1">Return to this page anytime to re-read your saved fortunes, share them with friends, or use them as daily affirmations and journaling prompts.</p>
              </div>
            </div>
          </div>

          {/* Why save fortunes */}
          <div className="prose prose-slate dark:prose-invert prose-headings:font-heading max-w-none">
            <h2 className="text-2xl font-heading font-semibold text-slate-800 dark:text-white mb-4">
              Why keep a collection of fortune cookie messages?
            </h2>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
              A saved fortune is more than a novelty — it can serve as a <strong>personal affirmation</strong>, a conversation starter, or a snapshot of a moment that felt meaningful. Many users return to their favorites collection during challenging times, finding that a well-timed fortune can reframe a problem or offer unexpected clarity.
            </p>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
              Fortune cookie messages have a long tradition of distilling wisdom into a single sentence. From Confucian proverbs to modern motivational quotes, the best fortunes share a quality of <strong>universality</strong> — they speak to something true about the human experience while leaving room for personal interpretation.
            </p>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              Our AI-generated fortunes are crafted to maintain this tradition while offering fresh perspectives across six distinct themes. Whether you prefer philosophical depth, lighthearted humor, or romantic inspiration, your favorites collection becomes a curated reflection of what resonates with you.
            </p>
          </div>

          {/* Ways to use saved fortunes */}
          <div>
            <h2 className="text-2xl font-heading font-semibold text-slate-800 dark:text-white mb-4">
              Creative ways to use your saved fortunes
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              {[
                { icon: "📓", title: "Daily journaling prompt", desc: "Start each journal entry with a saved fortune as your opening reflection or theme for the day." },
                { icon: "💌", title: "Personalized messages", desc: "Include a saved fortune in a birthday card, wedding toast, or thank-you note for a thoughtful personal touch." },
                { icon: "🖼️", title: "Desktop wallpaper", desc: "Screenshot a fortune and set it as your phone or desktop wallpaper for a daily dose of inspiration." },
                { icon: "🍪", title: "Homemade fortune cookies", desc: "Print your favorite fortunes and bake them into homemade fortune cookies for parties or gifts." },
                { icon: "📱", title: "Social media captions", desc: "Use a well-chosen fortune as a caption for an Instagram post or Twitter thought-of-the-day." },
                { icon: "🧘", title: "Meditation focus", desc: "Choose one fortune per week as a meditation mantra or mindfulness intention to carry through your days." },
              ].map((use) => (
                <div key={use.title} className="flex items-start gap-3 p-4 rounded-xl bg-pink-50 dark:bg-pink-950/20 border border-pink-100 dark:border-pink-800/30">
                  <span className="text-2xl flex-shrink-0">{use.icon}</span>
                  <div>
                    <p className="font-semibold text-slate-800 dark:text-white text-sm mb-1">{use.title}</p>
                    <p className="text-xs text-slate-600 dark:text-slate-400">{use.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CTA to generator */}
          <div className="rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 p-8 text-center text-white">
            <Star className="w-8 h-8 mx-auto mb-3 opacity-80" />
            <h2 className="text-xl font-heading font-semibold mb-2">Ready to find your next favorite fortune?</h2>
            <p className="text-white/80 text-sm mb-4">Generate unlimited AI-powered fortune cookie messages across 6 themes — free, no signup required.</p>
            <Link
              href="/generator"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white text-indigo-600 font-semibold rounded-xl hover:bg-indigo-50 transition-colors text-sm"
            >
              <Wand2 className="w-4 h-4" />
              Open Fortune Cookie Generator
            </Link>
          </div>

          {/* Internal links */}
          <div>
            <h2 className="text-xl font-heading font-semibold text-slate-800 dark:text-white mb-3">
              Explore more fortune cookie content
            </h2>
            <div className="grid md:grid-cols-2 gap-3">
              {[
                { icon: "🤖", title: "AI Fortune Cookie Generator", href: "/generator" },
                { icon: "🎊", title: "Fortune Cookie Messages by Occasion", href: "/fortune-cookie-messages" },
                { icon: "😂", title: "Funny Fortune Cookie Messages", href: "/funny-fortune-cookie-messages" },
                { icon: "💬", title: "Fortune Cookie Quotes", href: "/fortune-cookie-quotes" },
                { icon: "📅", title: "Daily Fortune Calendar", href: "/calendar" },
                { icon: "📚", title: "History of Fortune Cookies", href: "/history" },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-pink-400 dark:hover:border-pink-600 hover:shadow-sm transition-all text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-pink-700 dark:hover:text-pink-400 group"
                >
                  <span className="text-lg flex-shrink-0">{link.icon}</span>
                  <span className="flex-1">{link.title}</span>
                  <span className="text-slate-400 group-hover:translate-x-1 transition-transform">→</span>
                </Link>
              ))}
            </div>
          </div>

        </div>
      </PageSection>
    </PageLayout>
  );
}
