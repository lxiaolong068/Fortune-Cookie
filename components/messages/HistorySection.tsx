"use client";

import { Scroll, Globe, TrendingUp, Sparkles } from "lucide-react";
import Link from "next/link";
import { useLocale } from "@/lib/locale-context";

const funFacts = [
  {
    titleKey: "messages.history.funFacts.notChinese.title",
    contentKey: "messages.history.funFacts.notChinese.content",
    icon: Globe,
  },
  {
    titleKey: "messages.history.funFacts.billionsServed.title",
    contentKey: "messages.history.funFacts.billionsServed.content",
    icon: TrendingUp,
  },
  {
    titleKey: "messages.history.funFacts.lotteryWinners.title",
    contentKey: "messages.history.funFacts.lotteryWinners.content",
    icon: Sparkles,
  },
];

/**
 * HistorySection - History & Psychology section for the messages page
 *
 * Contains:
 * - Brief history of fortune cookies
 * - Psychology explanation (Barnum Effect)
 * - Fun facts with icons
 * - Internal links to related pages
 */
export function HistorySection() {
  const { t, getLocalizedHref } = useLocale();
  const historyHref = getLocalizedHref("/history");

  return (
    <section className="mt-24 max-w-5xl mx-auto">
      <div className="rounded-3xl border border-[#FFE4D6] bg-white p-8 shadow-lg md:p-12">
        <div className="flex items-center gap-4 mb-8">
          <div className="rounded-full bg-[#FFE4D6] p-3">
            <Scroll className="h-8 w-8 text-[#E55328]" />
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-[#222222]">
            {t("messages.history.title")}
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {/* History */}
          <div className="prose prose-lg text-[#555555]">
            <p>
              {t("messages.history.introPrefix")}
              <Link
                href={historyHref}
                className="font-medium text-[#FF6B3D] hover:text-[#E55328] hover:underline"
              >
                {t("messages.history.introLink")}
              </Link>
              {t("messages.history.introMiddle")}
              <strong>{t("messages.history.introHighlight")}</strong>
              {t("messages.history.introSuffix")}
              <Link
                href="/who-invented-fortune-cookies"
                className="font-medium text-[#FF6B3D] hover:text-[#E55328] hover:underline"
              >
                {t("messages.history.inventedLink")}
              </Link>
              {t("messages.history.introEnd")}
            </p>
          </div>

          {/* Psychology */}
          <div className="prose prose-lg text-[#555555]">
            <p>
              {t("messages.history.psychologyPrefix")}
              <strong>{t("messages.history.barnumEffect")}</strong>
              {t("messages.history.psychologySuffix")}
            </p>
          </div>
        </div>

        {/* Did You Know */}
        <div className="rounded-2xl border border-[#FFE4D6] bg-[#FAFAFA] p-6">
          <h3 className="text-lg font-bold text-[#222222] mb-4">
            {t("messages.history.funFactsTitle")}
          </h3>
          <ul className="space-y-3">
            {funFacts.map((fact, idx) => (
              <li key={idx} className="flex gap-3 items-start">
                <fact.icon className="mt-0.5 h-5 w-5 flex-shrink-0 text-[#FF6B3D]" />
                <div>
                  <strong className="text-[#222222]">
                    {t(fact.titleKey)}:
                  </strong>{" "}
                  <span className="text-[#555555]">
                    {t(fact.contentKey)}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
