"use client";

import { OccasionData } from "@/lib/pseo/occasions";
import {
  PSEOPageContent,
  PSEORelatedLink,
} from "@/components/pseo/PSEOPageContent";
import {
  occasionBlogRecommendations,
  occasionIntroContent,
} from "@/lib/pseo/blog-recommendations";

interface Props {
  data: OccasionData;
  relatedLinks: PSEORelatedLink[];
}

export function OccasionPageContent({ data, relatedLinks }: Props) {
  const relatedBlogPosts = occasionBlogRecommendations[data.slug] ?? [];
  const introContent = occasionIntroContent[data.slug];

  return (
    <PSEOPageContent
      title={`${data.title} Fortune Cookie Messages`}
      badge={data.badge}
      emoji={data.emoji}
      description={data.description}
      subcategories={data.subcategories}
      tips={data.tips}
      faqs={data.faqs}
      relatedLinks={relatedLinks}
      gradient="amber"
      breadcrumbs={[
        { label: "Home", href: "/" },
        {
          label: "Fortune Cookie Messages",
          href: "/fortune-cookie-messages",
        },
        { label: data.title },
      ]}
      hubPath="/fortune-cookie-messages"
      hubLabel="occasion messages"
      introContent={introContent}
      relatedBlogPosts={relatedBlogPosts}
    />
  );
}
