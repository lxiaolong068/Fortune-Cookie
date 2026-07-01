import Link from "next/link";
import { Sparkles, Heart, Twitter, Mail } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-r from-amber-50 to-orange-50 border-t border-amber-200 mt-16">
      <div className="container mx-auto px-4 py-12">
        {/* Main footer content */}
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-8 mb-8">
          {/* Brand section */}
          <div className="max-w-sm">
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
              Generate personalized fortune cookie messages for any occasion —
              predictions, custom party fortunes, and more.
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
                href="mailto:lxiaolong068@gmail.com"
                className="p-3 bg-white rounded-lg border border-amber-200 hover:bg-amber-50 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
                aria-label="Contact us via email"
              >
                <Mail className="w-5 h-5 text-gray-600" />
              </a>
            </div>
          </div>

          {/* Core links */}
          <nav aria-label="Footer navigation">
            <h3 className="font-semibold text-gray-800 mb-4">Explore</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/"
                  className="text-gray-600 hover:text-amber-600 transition-colors text-sm"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/generator"
                  className="text-gray-600 hover:text-amber-600 transition-colors text-sm"
                >
                  Generator
                </Link>
              </li>
            </ul>
          </nav>
        </div>

        {/* Bottom section */}
        <div className="border-t border-amber-200 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-sm text-gray-600">
              <p>
                {`© ${currentYear} Fortune Cookie AI. All rights reserved.`}{" "}
                <span className="inline-flex items-center gap-1">
                  Made with love for fortune seekers everywhere
                  <Heart className="w-4 h-4 inline text-red-500" />
                </span>
              </p>
            </div>

            {/* Legal links with proper touch targets */}
            <div className="flex items-center gap-4 md:gap-6 text-sm text-gray-600">
              <Link
                href="/about"
                className="hover:text-amber-600 transition-colors py-2 min-h-[44px] flex items-center"
              >
                About
              </Link>
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
        </div>
      </div>
    </footer>
  );
}
