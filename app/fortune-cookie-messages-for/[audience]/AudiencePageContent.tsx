"use client";

import { AudienceData } from "@/lib/pseo/audiences";
import {
  PSEOPageContent,
  PSEORelatedLink,
} from "@/components/pseo/PSEOPageContent";

interface Props {
  data: AudienceData;
  relatedLinks: PSEORelatedLink[];
}

export function AudiencePageContent({ data, relatedLinks }: Props) {
  return (
    <PSEOPageContent
      title={`Fortune Cookie Messages for ${data.title}`}
      badge={data.badge}
      emoji={data.emoji}
      description={data.description}
      subcategories={data.subcategories}
      tips={data.tips}
      faqs={data.faqs}
      relatedLinks={relatedLinks}
      gradient="purple"
      breadcrumbs={[
        { label: "Home", href: "/" },
        {
          label: "Messages For",
          href: "/fortune-cookie-messages-for",
        },
        { label: data.title },
      ]}
      hubPath="/fortune-cookie-messages-for"
      hubLabel="audience messages"
    />
  );
}
