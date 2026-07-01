import { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  BreadcrumbStructuredData,
  ArticleStructuredData,
} from "@/components/StructuredData";
import { FAQStructuredData } from "@/components/FAQStructuredData";
import { getImageUrl, getSiteUrl } from "@/lib/site";
import {
  getOccasion,
  getAllOccasionSlugs,
  getOccasionsByGroup,
} from "@/lib/pseo/occasions";
import { OccasionPageContent } from "./OccasionPageContent";

export const dynamic = "force-static";
export const revalidate = 86400;

const baseUrl = getSiteUrl();

interface PageProps {
  params: Promise<{ occasion: string }>;
}

export async function generateStaticParams() {
  return getAllOccasionSlugs().map((slug) => ({ occasion: slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { occasion } = await params;
  const data = getOccasion(occasion);

  if (!data) return { title: "Not Found" };

  return {
    title: data.metaTitle,
    description: data.metaDescription,
    openGraph: {
      title: data.metaTitle,
      description: data.metaDescription,
      type: "article",
      url: `${baseUrl}/fortune-cookie-messages/${occasion}`,
      images: [
        {
          url: `${baseUrl}/api/og?type=pseo&title=${encodeURIComponent(data.title)}&emoji=${encodeURIComponent(data.emoji)}&badge=${encodeURIComponent(data.badge)}&description=${encodeURIComponent(data.description.slice(0, 120))}&gradient=amber`,
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
      images: [`${baseUrl}/api/og?type=pseo&title=${encodeURIComponent(data.title)}&emoji=${encodeURIComponent(data.emoji)}&badge=${encodeURIComponent(data.badge)}&description=${encodeURIComponent(data.description.slice(0, 120))}&gradient=amber`],
      creator: "@fortunecookieai",
    },
    alternates: {
      canonical: `/fortune-cookie-messages/${occasion}`,
    },
  };
}

export default async function OccasionPage({ params }: PageProps) {
  const { occasion } = await params;
  const data = getOccasion(occasion);

  if (!data) notFound();

  // Build related links from same group (exclude self)
  const sameGroup = getOccasionsByGroup(data.group)
    .filter((o) => o.slug !== occasion)
    .slice(0, 6);

  const relatedLinks = sameGroup.map((o) => ({
    slug: o.slug,
    title: o.title,
    emoji: o.emoji,
    badge: o.badge,
    basePath: "/fortune-cookie-messages",
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
        url={`/fortune-cookie-messages/${occasion}`}
        datePublished="2024-01-15"
        dateModified={new Date().toISOString().split("T")[0]}
      />
      <BreadcrumbStructuredData
        items={[
          { name: "Home", url: "/" },
          {
            name: "Fortune Cookie Messages",
            url: "/fortune-cookie-messages",
          },
          {
            name: data.title,
            url: `/fortune-cookie-messages/${occasion}`,
          },
        ]}
      />
      <FAQStructuredData faqs={faqs} />
      <OccasionPageContent data={data} relatedLinks={relatedLinks} />
    </>
  );
}
