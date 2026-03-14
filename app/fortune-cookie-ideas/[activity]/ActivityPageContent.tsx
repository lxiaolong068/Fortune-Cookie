"use client";

import { ActivityData } from "@/lib/pseo/activities";
import {
  PSEOPageContent,
  PSEORelatedLink,
} from "@/components/pseo/PSEOPageContent";

interface Props {
  data: ActivityData;
  relatedLinks: PSEORelatedLink[];
}

export function ActivityPageContent({ data, relatedLinks }: Props) {
  return (
    <PSEOPageContent
      title={`Fortune Cookie Ideas for ${data.title}`}
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
          label: "Fortune Cookie Ideas",
          href: "/fortune-cookie-ideas",
        },
        { label: data.title },
      ]}
      hubPath="/fortune-cookie-ideas"
      hubLabel="activity ideas"
    />
  );
}
