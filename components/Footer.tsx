import Link from "next/link";
import { Sparkles, Heart, Github, Twitter, Mail } from "lucide-react";
import { headers } from "next/headers";
import { i18n, isValidLocale } from "@/lib/i18n-config";
import { createServerTranslationContext } from "@/lib/translations";

export async function Footer() {
  const requestHeaders = headers();
  const headerLocale = requestHeaders.get("x-locale") ?? "";
  const locale = isValidLocale(headerLocale) ? headerLocale : i18n.defaultLocale;
  const { t, getLocalizedHref } = await createServerTranslationContext(locale);
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
                    {t("common.siteName")}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {t("footer.poweredBy")}
                  </p>
                </div>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed mb-4">
                {t("home.description")}
              </p>

              {/* Social links - 44px touch targets */}
              <div className="flex gap-3">
                <a
                  href="https://twitter.com/fortunecookieai"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 bg-white rounded-lg border border-amber-200 hover:bg-amber-50 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
                  aria-label={t("footer.followTwitter")}
                >
                  <Twitter className="w-5 h-5 text-gray-600" />
                </a>
                <a
                  href="https://github.com/fortune-cookie-ai"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 bg-white rounded-lg border border-amber-200 hover:bg-amber-50 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
                  aria-label={t("footer.viewGithub")}
                >
                  <Github className="w-5 h-5 text-gray-600" />
                </a>
                <a
                  href="mailto:hello@fortune-cookie-ai.com"
                  className="p-3 bg-white rounded-lg border border-amber-200 hover:bg-amber-50 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
                  aria-label={t("footer.contactEmail")}
                >
                  <Mail className="w-5 h-5 text-gray-600" />
                </a>
              </div>
            </div>

            {/* Navigation links */}
            <div className="lg:col-span-3">
              <div className="grid md:grid-cols-3 gap-8">
                {[
                  {
                    title: t("footer.generate"),
                    links: [
                      {
                        href: getLocalizedHref("/"),
                        title: t("footer.fortuneGenerator"),
                      },
                      {
                        href: getLocalizedHref("/generator"),
                        title: t("footer.aiGenerator"),
                      },
                      {
                        href: getLocalizedHref("/browse"),
                        title: t("footer.browseMessages"),
                      },
                    ],
                  },
                  {
                    title: t("footer.learn"),
                    links: [
                      {
                        href: getLocalizedHref("/history"),
                        title: t("navigation.history"),
                      },
                      {
                        href: "/who-invented-fortune-cookies",
                        title: t("footer.whoInvented"),
                      },
                      {
                        href: getLocalizedHref("/recipes"),
                        title: t("navigation.recipes"),
                      },
                    ],
                  },
                  {
                    title: t("footer.messages"),
                    links: [
                      {
                        href: getLocalizedHref("/messages"),
                        title: t("footer.allMessages"),
                      },
                      {
                        href: "/funny-fortune-cookie-messages",
                        title: t("footer.funnyMessages"),
                      },
                      {
                        href: "/how-to-make-fortune-cookies",
                        title: t("footer.howToMake"),
                      },
                    ],
                  },
                ].map((group) => (
                  <div key={group.title}>
                    <h3 className="font-semibold text-gray-800 mb-4">
                      {group.title}
                    </h3>
                    <ul className="space-y-2">
                      {group.links.map((link) => (
                        <li key={link.href}>
                          <Link
                            href={link.href}
                            className="text-gray-600 hover:text-amber-600 transition-colors text-sm"
                          >
                            {link.title}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* SEO-optimized footer links - improved mobile spacing */}
          <div className="border-t border-amber-200 pt-8 mb-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-4 text-sm">
              <div>
                <h4 className="font-semibold text-gray-800 mb-4">
                  {t("footer.popularSearches")}
                </h4>
                <ul className="space-y-3 text-gray-600">
                  <li>
                    <Link
                      href="/funny-fortune-cookie-messages"
                      className="hover:text-amber-600 transition-colors inline-block py-1 min-h-[44px] leading-[44px]"
                    >
                      {t("footer.funnyFortuneMessages")}
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/who-invented-fortune-cookies"
                      className="hover:text-amber-600 transition-colors inline-block py-1 min-h-[44px] leading-[44px]"
                    >
                      {t("footer.whoInventedFull")}
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/how-to-make-fortune-cookies"
                      className="hover:text-amber-600 transition-colors inline-block py-1 min-h-[44px] leading-[44px]"
                    >
                      {t("footer.howToMakeFull")}
                    </Link>
                  </li>
                  <li>
                    <Link
                      href={getLocalizedHref("/messages?category=inspirational")}
                      className="hover:text-amber-600 transition-colors inline-block py-1 min-h-[44px] leading-[44px]"
                    >
                      {t("footer.inspirationalQuotes")}
                    </Link>
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-gray-800 mb-4">
                  {t("footer.fortuneCategories")}
                </h4>
                <ul className="space-y-3 text-gray-600">
                  <li>
                    <Link
                      href={getLocalizedHref("/messages?category=love")}
                      className="hover:text-amber-600 transition-colors inline-block py-1 min-h-[44px] leading-[44px]"
                    >
                      {t("footer.loveFortunes")}
                    </Link>
                  </li>
                  <li>
                    <Link
                      href={getLocalizedHref("/messages?category=success")}
                      className="hover:text-amber-600 transition-colors inline-block py-1 min-h-[44px] leading-[44px]"
                    >
                      {t("footer.successMessages")}
                    </Link>
                  </li>
                  <li>
                    <Link
                      href={getLocalizedHref("/messages?category=wisdom")}
                      className="hover:text-amber-600 transition-colors inline-block py-1 min-h-[44px] leading-[44px]"
                    >
                      {t("footer.wisdomQuotes")}
                    </Link>
                  </li>
                  <li>
                    <Link
                      href={getLocalizedHref("/messages?category=friendship")}
                      className="hover:text-amber-600 transition-colors inline-block py-1 min-h-[44px] leading-[44px]"
                    >
                      {t("footer.friendshipMessages")}
                    </Link>
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-gray-800 mb-4">
                  {t("footer.learnMore")}
                </h4>
                <ul className="space-y-3 text-gray-600">
                  <li>
                    <Link
                      href={getLocalizedHref("/history")}
                      className="hover:text-amber-600 transition-colors inline-block py-1 min-h-[44px] leading-[44px]"
                    >
                      {t("footer.fortuneHistory")}
                    </Link>
                  </li>
                  <li>
                    <Link
                      href={getLocalizedHref("/recipes")}
                      className="hover:text-amber-600 transition-colors inline-block py-1 min-h-[44px] leading-[44px]"
                    >
                      {t("footer.fortuneRecipes")}
                    </Link>
                  </li>
                  <li>
                    <Link
                      href={getLocalizedHref("/blog")}
                      className="hover:text-amber-600 transition-colors inline-block py-1 min-h-[44px] leading-[44px]"
                    >
                      {t("footer.blogArticles")}
                    </Link>
                  </li>
                  <li>
                    <Link
                      href={getLocalizedHref("/generator")}
                      className="hover:text-amber-600 transition-colors inline-block py-1 min-h-[44px] leading-[44px]"
                    >
                      {t("footer.aiGenerator")}
                    </Link>
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-gray-800 mb-4">
                  {t("footer.resources")}
                </h4>
                <ul className="space-y-3 text-gray-600">
                  <li>
                    <Link
                      href={getLocalizedHref("/favorites")}
                      className="hover:text-amber-600 transition-colors inline-block py-1 min-h-[44px] leading-[44px]"
                    >
                      {t("footer.myFavorites")}
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/api/fortunes?action=stats"
                      className="hover:text-amber-600 transition-colors inline-block py-1 min-h-[44px] leading-[44px]"
                    >
                      {t("footer.fortuneDatabase")}
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/sitemap.xml"
                      className="hover:text-amber-600 transition-colors inline-block py-1 min-h-[44px] leading-[44px]"
                    >
                      {t("footer.sitemap")}
                    </Link>
                  </li>
                  <li>
                    <a
                      href="mailto:hello@fortune-cookie-ai.com"
                      className="hover:text-amber-600 transition-colors inline-block py-1 min-h-[44px] leading-[44px]"
                    >
                      {t("footer.contactUs")}
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
                  {t("footer.copyright", { year: currentYear })}{" "}
                  <span className="inline-flex items-center gap-1">
                    {t("footer.madeWith")}
                    <Heart className="w-4 h-4 inline text-red-500" />
                  </span>
                </p>
              </div>

              {/* Legal links with proper touch targets */}
              <div className="flex items-center gap-4 md:gap-6 text-sm text-gray-600">
                <Link
                  href="/privacy"
                  className="hover:text-amber-600 transition-colors py-2 min-h-[44px] flex items-center"
                >
                  {t("footer.privacy")}
                </Link>
                <Link
                  href="/terms"
                  className="hover:text-amber-600 transition-colors py-2 min-h-[44px] flex items-center"
                >
                  {t("footer.terms")}
                </Link>
                <Link
                  href="/cookies"
                  className="hover:text-amber-600 transition-colors py-2 min-h-[44px] flex items-center"
                >
                  {t("footer.cookies")}
                </Link>
              </div>
            </div>

            {/* SEO footer text */}
            <div className="mt-6 text-xs text-gray-500 leading-relaxed">
              <p>{t("seo.homeDescription")}</p>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
