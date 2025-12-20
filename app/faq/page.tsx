import { Metadata } from "next";
import {
  HelpCircle,
  Cookie,
  Utensils,
  History,
  Lightbulb,
  Laugh,
} from "lucide-react";
import { generateSEOMetadata } from "@/components/SEO";
import {
  FAQStructuredData,
  fortuneCookieFAQs,
  funnyFortuneFAQs,
  recipeFAQs,
  howToMakeFAQs,
  whoInventedFAQs,
  historyFAQs,
  type FAQItem,
} from "@/components/FAQStructuredData";
import { BreadcrumbStructuredData } from "@/components/StructuredData";
import { Breadcrumbs } from "@/components/InternalLinks";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const metadata: Metadata = generateSEOMetadata({
  title: "FAQ - Frequently Asked Questions",
  description:
    "Find answers to common questions about fortune cookies, how to make them, their history, funny messages, and more. Get all your fortune cookie questions answered.",
  url: "/faq",
  type: "website",
});

// Combine all FAQs for structured data
const allFAQs: FAQItem[] = [
  ...fortuneCookieFAQs,
  ...funnyFortuneFAQs,
  ...recipeFAQs,
  ...howToMakeFAQs,
  ...whoInventedFAQs,
  ...historyFAQs,
];

interface FAQSection {
  id: string;
  title: string;
  icon: React.ReactNode;
  faqs: FAQItem[];
  description: string;
}

const faqSections: FAQSection[] = [
  {
    id: "general",
    title: "General Questions",
    icon: <Cookie className="h-5 w-5" />,
    faqs: fortuneCookieFAQs,
    description: "Learn the basics about fortune cookies",
  },
  {
    id: "history",
    title: "History & Origins",
    icon: <History className="h-5 w-5" />,
    faqs: [...whoInventedFAQs, ...historyFAQs],
    description: "Discover the fascinating history of fortune cookies",
  },
  {
    id: "recipes",
    title: "Recipes & How-To",
    icon: <Utensils className="h-5 w-5" />,
    faqs: [...recipeFAQs, ...howToMakeFAQs],
    description: "Learn how to make fortune cookies at home",
  },
  {
    id: "funny",
    title: "Funny Messages",
    icon: <Laugh className="h-5 w-5" />,
    faqs: funnyFortuneFAQs,
    description: "Questions about humorous fortune cookie messages",
  },
];

export default function FAQPage() {
  // For structured data (uses url)
  const structuredBreadcrumbs = [
    { name: "Home", url: "/" },
    { name: "FAQ", url: "/faq" },
  ];

  // For visual breadcrumbs (uses href)
  const navBreadcrumbs = [{ name: "Home", href: "/" }, { name: "FAQ" }];

  return (
    <>
      <FAQStructuredData faqs={allFAQs} />
      <BreadcrumbStructuredData items={structuredBreadcrumbs} />

      <div className="min-h-screen bg-gradient-to-b from-zinc-900 via-zinc-800 to-zinc-900">
        <div className="container mx-auto px-4 py-8 md:py-12">
          {/* Breadcrumbs */}
          <div className="mb-6">
            <Breadcrumbs items={navBreadcrumbs} />
          </div>

          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-amber-500/10 mb-6">
              <HelpCircle className="h-8 w-8 text-amber-500" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Frequently Asked Questions
            </h1>
            <p className="text-lg text-zinc-400 max-w-2xl mx-auto">
              Everything you need to know about fortune cookies, from their
              history and origins to making them at home.
            </p>
          </div>

          {/* Quick Navigation */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {faqSections.map((section) => (
              <a
                key={section.id}
                href={`#${section.id}`}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-800/50 hover:bg-zinc-700/50 text-zinc-300 hover:text-amber-400 transition-colors text-sm"
              >
                {section.icon}
                {section.title}
              </a>
            ))}
          </div>

          {/* FAQ Sections */}
          <div className="max-w-3xl mx-auto space-y-12">
            {faqSections.map((section) => (
              <section
                key={section.id}
                id={section.id}
                className="scroll-mt-24"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-amber-500/10 text-amber-500">
                    {section.icon}
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-white">
                      {section.title}
                    </h2>
                    <p className="text-sm text-zinc-500">
                      {section.description}
                    </p>
                  </div>
                </div>

                <div className="bg-zinc-800/30 rounded-xl border border-zinc-700/50 p-4 md:p-6">
                  <Accordion type="single" collapsible className="w-full">
                    {section.faqs.map((faq, index) => (
                      <AccordionItem
                        key={index}
                        value={`${section.id}-${index}`}
                        className={
                          index === section.faqs.length - 1 ? "border-b-0" : ""
                        }
                      >
                        <AccordionTrigger className="text-white text-left">
                          {faq.question}
                        </AccordionTrigger>
                        <AccordionContent className="text-zinc-400 leading-relaxed">
                          {faq.answer}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>
              </section>
            ))}
          </div>

          {/* CTA Section */}
          <div className="mt-16 text-center">
            <div className="bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-amber-500/10 rounded-2xl border border-amber-500/20 p-8 max-w-2xl mx-auto">
              <Lightbulb className="h-8 w-8 text-amber-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">
                Still have questions?
              </h3>
              <p className="text-zinc-400 mb-6">
                Try our AI-powered fortune cookie generator for personalized
                messages, or explore our collection of curated fortunes.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <a
                  href="/generator"
                  className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-amber-500 hover:bg-amber-600 text-zinc-900 font-medium transition-colors"
                >
                  Try AI Generator
                </a>
                <a
                  href="/browse"
                  className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-zinc-700 hover:bg-zinc-600 text-white font-medium transition-colors"
                >
                  Browse Fortunes
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
