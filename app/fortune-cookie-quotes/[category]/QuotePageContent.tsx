"use client";

import { QuoteData } from "@/lib/pseo/quotes";
import {
  PSEOPageContent,
  PSEORelatedLink,
} from "@/components/pseo/PSEOPageContent";
import {
  quoteBlogRecommendations,
  quoteIntroContent,
} from "@/lib/pseo/blog-recommendations";

interface Props {
  data: QuoteData;
  relatedLinks: PSEORelatedLink[];
}

export function QuotePageContent({ data, relatedLinks }: Props) {
  const relatedBlogPosts = quoteBlogRecommendations[data.slug] ?? [];
  const introContent = quoteIntroContent[data.slug];

  return (
    <PSEOPageContent
      title={`${data.title} Fortune Cookie Quotes`}
      badge={data.badge}
      emoji={data.emoji}
      description={data.description}
      subcategories={data.subcategories}
      tips={data.tips}
      faqs={data.faqs}
      relatedLinks={relatedLinks}
      gradient="indigo"
      breadcrumbs={[
        { label: "Home", href: "/" },
        {
          label: "Fortune Cookie Quotes",
          href: "/fortune-cookie-quotes",
        },
        { label: data.title },
      ]}
      hubPath="/fortune-cookie-quotes"
      hubLabel="quote categories"
      introContent={introContent}
      relatedBlogPosts={relatedBlogPosts}
    />
  );
}
