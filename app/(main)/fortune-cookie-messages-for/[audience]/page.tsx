import { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  BreadcrumbStructuredData,
  ArticleStructuredData,
} from "@/components/StructuredData";
import { FAQStructuredData } from "@/components/FAQStructuredData";
import { getImageUrl, getSiteUrl } from "@/lib/site";
import {
  getAudience,
  getAllAudienceSlugs,
  getAudiencesByGroup,
} from "@/lib/pseo/audiences";
import { AudiencePageContent } from "./AudiencePageContent";

export const dynamic = "force-static";
export const revalidate = 86400;

const baseUrl = getSiteUrl();

interface PageProps {
  params: Promise<{ audience: string }>;
}

export async function generateStaticParams() {
  return getAllAudienceSlugs().map((slug) => ({ audience: slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { audience } = await params;
  const data = getAudience(audience);

  if (!data) return { title: "Not Found" };

  return {
    title: data.metaTitle,
    description: data.metaDescription,
    openGraph: {
      title: data.metaTitle,
      description: data.metaDescription,
      type: "article",
      url: `${baseUrl}/fortune-cookie-messages-for/${audience}`,
      images: [
        {
          url: `${baseUrl}/api/og?type=pseo&title=${encodeURIComponent(data.title)}&emoji=${encodeURIComponent(data.emoji)}&badge=${encodeURIComponent(data.badge)}&description=${encodeURIComponent(data.description.slice(0, 120))}&gradient=purple`,
          width: 1200,
          height: 630,
          alt: data.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: data.metaTitle,
      description: data.metaDescription,
      images: [`${baseUrl}/api/og?type=pseo&title=${encodeURIComponent(data.title)}&emoji=${encodeURIComponent(data.emoji)}&badge=${encodeURIComponent(data.badge)}&description=${encodeURIComponent(data.description.slice(0, 120))}&gradient=purple`],
      creator: "@fortunecookieai",
    },
    alternates: {
      canonical: `/fortune-cookie-messages-for/${audience}`,
    },
  };
}

export default async function AudiencePage({ params }: PageProps) {
  const { audience } = await params;
  const data = getAudience(audience);

  if (!data) notFound();

  const sameGroup = getAudiencesByGroup(data.group)
    .filter((a) => a.slug !== audience)
    .slice(0, 6);

  const relatedLinks = sameGroup.map((a) => ({
    slug: a.slug,
    title: a.title,
    emoji: a.emoji,
    badge: a.badge,
    basePath: "/fortune-cookie-messages-for",
  }));

  const faqs = data.faqs.map((f) => ({
    question: f.question,
    answer: f.answer,
  }));

  return (
    <>
      <ArticleStructuredData
        headline={data.metaTitle}
        description={data.metaDescription}
        url={`/fortune-cookie-messages-for/${audience}`}
        datePublished="2024-01-15"
        dateModified={new Date().toISOString().split("T")[0]}
      />
      <BreadcrumbStructuredData
        items={[
          { name: "Home", url: "/" },
          {
            name: "Fortune Cookie Messages For",
            url: "/fortune-cookie-messages-for",
          },
          {
            name: data.title,
            url: `/fortune-cookie-messages-for/${audience}`,
          },
        ]}
      />
      <FAQStructuredData faqs={faqs} />
      <AudiencePageContent data={data} relatedLinks={relatedLinks} />
    </>
  );
}
