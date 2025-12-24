import Link from "next/link";
import { Sparkles, Heart, Github, Twitter, Mail } from "lucide-react";
import { FooterLinks } from "./InternalLinks";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <>
      <footer className="bg-gradient-to-r from-amber-50 to-orange-50 border-t border-amber-200 mt-16">
        <div className="container mx-auto px-4 py-12">
          {/* Main footer content */}
          <div className="grid lg:grid-cols-4 gap-8 mb-8">
            {/* Brand section */}
            <div className="lg:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <div className="p-2 bg-gradient-to-br from-amber-400 to-orange-500 rounded-lg">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800">
                    Fortune Cookie AI
                  </h3>
                  <p className="text-sm text-gray-600">Powered by AI</p>
                </div>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed mb-4">
                Create personalized fortune cookies with our AI-powered
                generator. Discover wisdom, humor, and inspiration in every
                message.
              </p>

              {/* Social links - 44px touch targets */}
              <div className="flex gap-3">
                <a
                  href="https://twitter.com/fortunecookieai"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 bg-white rounded-lg border border-amber-200 hover:bg-amber-50 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
                  aria-label="Follow us on Twitter"
                >
                  <Twitter className="w-5 h-5 text-gray-600" />
                </a>
                <a
                  href="https://github.com/fortune-cookie-ai"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 bg-white rounded-lg border border-amber-200 hover:bg-amber-50 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
                  aria-label="View our GitHub repository"
                >
                  <Github className="w-5 h-5 text-gray-600" />
                </a>
                <a
                  href="mailto:hello@fortune-cookie-ai.com"
                  className="p-3 bg-white rounded-lg border border-amber-200 hover:bg-amber-50 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
                  aria-label="Contact us via email"
                >
                  <Mail className="w-5 h-5 text-gray-600" />
                </a>
              </div>
            </div>

            {/* Navigation links */}
            <div className="lg:col-span-3">
              <FooterLinks />
            </div>
          </div>

          {/* SEO-optimized footer links - improved mobile spacing */}
          <div className="border-t border-amber-200 pt-8 mb-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-4 text-sm">
              <div>
                <h4 className="font-semibold text-gray-800 mb-4">
                  Popular Searches
                </h4>
                <ul className="space-y-3 text-gray-600">
                  <li>
                    <Link
                      href="/funny-fortune-cookie-messages"
                      className="hover:text-amber-600 transition-colors inline-block py-1 min-h-[44px] leading-[44px]"
                    >
                      Funny Fortune Messages
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/who-invented-fortune-cookies"
                      className="hover:text-amber-600 transition-colors inline-block py-1 min-h-[44px] leading-[44px]"
                    >
                      Who Invented Fortune Cookies
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/how-to-make-fortune-cookies"
                      className="hover:text-amber-600 transition-colors inline-block py-1 min-h-[44px] leading-[44px]"
                    >
                      How to Make Fortune Cookies
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/messages?category=inspirational"
                      className="hover:text-amber-600 transition-colors inline-block py-1 min-h-[44px] leading-[44px]"
                    >
                      Inspirational Quotes
                    </Link>
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-gray-800 mb-4">
                  Fortune Categories
                </h4>
                <ul className="space-y-3 text-gray-600">
                  <li>
                    <Link
                      href="/messages?category=love"
                      className="hover:text-amber-600 transition-colors inline-block py-1 min-h-[44px] leading-[44px]"
                    >
                      Love Fortune Cookies
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/messages?category=success"
                      className="hover:text-amber-600 transition-colors inline-block py-1 min-h-[44px] leading-[44px]"
                    >
                      Success Messages
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/messages?category=wisdom"
                      className="hover:text-amber-600 transition-colors inline-block py-1 min-h-[44px] leading-[44px]"
                    >
                      Wisdom Quotes
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/messages?category=friendship"
                      className="hover:text-amber-600 transition-colors inline-block py-1 min-h-[44px] leading-[44px]"
                    >
                      Friendship Messages
                    </Link>
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-gray-800 mb-4">Learn More</h4>
                <ul className="space-y-3 text-gray-600">
                  <li>
                    <Link
                      href="/history"
                      className="hover:text-amber-600 transition-colors inline-block py-1 min-h-[44px] leading-[44px]"
                    >
                      Fortune Cookie History
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/recipes"
                      className="hover:text-amber-600 transition-colors inline-block py-1 min-h-[44px] leading-[44px]"
                    >
                      Fortune Cookie Recipes
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/blog"
                      className="hover:text-amber-600 transition-colors inline-block py-1 min-h-[44px] leading-[44px]"
                    >
                      Blog & Articles
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/generator"
                      className="hover:text-amber-600 transition-colors inline-block py-1 min-h-[44px] leading-[44px]"
                    >
                      AI Generator
                    </Link>
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-gray-800 mb-4">Resources</h4>
                <ul className="space-y-3 text-gray-600">
                  <li>
                    <Link
                      href="/favorites"
                      className="hover:text-amber-600 transition-colors inline-block py-1 min-h-[44px] leading-[44px]"
                    >
                      My Favorites
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/api/fortunes?action=stats"
                      className="hover:text-amber-600 transition-colors inline-block py-1 min-h-[44px] leading-[44px]"
                    >
                      Fortune Database
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/sitemap.xml"
                      className="hover:text-amber-600 transition-colors inline-block py-1 min-h-[44px] leading-[44px]"
                    >
                      Sitemap
                    </Link>
                  </li>
                  <li>
                    <a
                      href="mailto:hello@fortune-cookie-ai.com"
                      className="hover:text-amber-600 transition-colors inline-block py-1 min-h-[44px] leading-[44px]"
                    >
                      Contact Us
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Bottom section */}
          <div className="border-t border-amber-200 pt-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="text-sm text-gray-600">
                <p>
                  © {currentYear} Fortune Cookie AI. Made with{" "}
                  <Heart className="w-4 h-4 inline text-red-500" /> for
                  spreading wisdom and joy.
                </p>
              </div>

              {/* Legal links with proper touch targets */}
              <div className="flex items-center gap-4 md:gap-6 text-sm text-gray-600">
                <Link
                  href="/privacy"
                  className="hover:text-amber-600 transition-colors py-2 min-h-[44px] flex items-center"
                >
                  Privacy Policy
                </Link>
                <Link
                  href="/terms"
                  className="hover:text-amber-600 transition-colors py-2 min-h-[44px] flex items-center"
                >
                  Terms of Service
                </Link>
                <Link
                  href="/cookies"
                  className="hover:text-amber-600 transition-colors py-2 min-h-[44px] flex items-center"
                >
                  Cookie Policy
                </Link>
              </div>
            </div>

            {/* SEO footer text */}
            <div className="mt-6 text-xs text-gray-500 leading-relaxed">
              <p>
                Fortune Cookie AI is the leading free online fortune cookie
                generator powered by artificial intelligence. Create
                personalized inspirational messages, funny quotes, and discover
                your lucky numbers. Our AI-powered tool generates unique fortune
                cookies for entertainment, motivation, and sharing. Learn about
                fortune cookie history, discover who invented fortune cookies,
                and find easy recipes to make homemade fortune cookies. Browse
                our extensive collection of fortune cookie messages including
                funny sayings, inspirational quotes, love messages, and success
                affirmations. Perfect for parties, gifts, and daily inspiration.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
