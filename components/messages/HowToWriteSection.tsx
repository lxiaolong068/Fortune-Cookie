"use client";

import { Pen, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useLocale } from "@/lib/locale-context";

const writingPrincipleKeys = [
  "messages.howToWrite.principles.one",
  "messages.howToWrite.principles.two",
  "messages.howToWrite.principles.three",
  "messages.howToWrite.principles.four",
  "messages.howToWrite.principles.five",
  "messages.howToWrite.principles.six",
];

const templateExampleKeys = [
  "messages.howToWrite.templates.one",
  "messages.howToWrite.templates.two",
  "messages.howToWrite.templates.three",
  "messages.howToWrite.templates.four",
  "messages.howToWrite.templates.five",
  "messages.howToWrite.templates.six",
  "messages.howToWrite.templates.seven",
  "messages.howToWrite.templates.eight",
];

/**
 * HowToWriteSection - Guide for writing fortune cookie messages
 *
 * Contains:
 * - Writing principles list
 * - Template examples
 * - CTA to AI generator
 * - Internal link to how-to-make page
 */
export function HowToWriteSection() {
  const { t, getLocalizedHref } = useLocale();
  const generatorHref = getLocalizedHref("/generator");

  return (
    <section className="mt-16 max-w-5xl mx-auto">
      <div className="rounded-3xl border border-[#FFE4D6] bg-white p-8 shadow-lg md:p-12">
        <div className="flex items-center gap-4 mb-8">
          <div className="rounded-full bg-[#FFE4D6] p-3">
            <Pen className="h-8 w-8 text-[#E55328]" />
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-[#222222]">
            {t("messages.howToWrite.title")}
          </h2>
        </div>

        <p className="text-[#555555] leading-relaxed mb-8">
          {t("messages.howToWrite.introPrefix")}
          <Link
            href="/how-to-make-fortune-cookies"
            className="font-medium text-[#FF6B3D] hover:text-[#E55328] hover:underline"
          >
            {t("messages.howToWrite.introLink")}
          </Link>
          {t("messages.howToWrite.introSuffix")}
        </p>

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {/* Writing Principles */}
          <div>
            <h3 className="text-lg font-semibold text-[#222222] mb-4">
              {t("messages.howToWrite.principlesTitle")}
            </h3>
            <ul className="space-y-3">
              {writingPrincipleKeys.map((principleKey, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-[#FFE4D6] text-sm font-medium text-[#E55328]">
                    {idx + 1}
                  </span>
                  <span className="text-[#555555]">{t(principleKey)}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Template Examples */}
          <div>
            <h3 className="text-lg font-semibold text-[#222222] mb-4">
              {t("messages.howToWrite.templatesTitle")}
            </h3>
            <ul className="space-y-2">
              {templateExampleKeys.map((templateKey, idx) => (
                <li
                  key={idx}
                  className="border-l-2 border-[#FFE4D6] py-1 pl-3 text-[#555555] italic"
                >
                  &ldquo;{t(templateKey)}&rdquo;
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Writing CTA */}
        <div className="flex flex-col items-center justify-between gap-4 rounded-xl border border-[#FFE4D6] bg-[#FAFAFA] p-6 sm:flex-row">
          <p className="text-[#555555]">
            <strong>{t("messages.howToWrite.ctaStrong")}</strong>
            {t("messages.howToWrite.ctaSuffix")}
          </p>
          <Link href={generatorHref}>
            <Button className="whitespace-nowrap bg-[#FF6B3D] text-white hover:bg-[#E55328]">
              {t("messages.howToWrite.ctaButton")}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
