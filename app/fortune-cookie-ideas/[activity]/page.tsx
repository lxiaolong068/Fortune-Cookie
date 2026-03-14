import { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  BreadcrumbStructuredData,
  ArticleStructuredData,
} from "@/components/StructuredData";
import { FAQStructuredData } from "@/components/FAQStructuredData";
import { getImageUrl, getSiteUrl } from "@/lib/site";
import {
  getActivity,
  getAllActivitySlugs,
  getActivitiesByGroup,
} from "@/lib/pseo/activities";
import { ActivityPageContent } from "./ActivityPageContent";

export const dynamic = "force-static";
export const revalidate = 86400;

const baseUrl = getSiteUrl();

interface PageProps {
  params: Promise<{ activity: string }>;
}

export async function generateStaticParams() {
  return getAllActivitySlugs().map((slug) => ({ activity: slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { activity } = await params;
  const data = getActivity(activity);

  if (!data) return { title: "Not Found" };

  return {
    title: data.metaTitle,
    description: data.metaDescription,
    openGraph: {
      title: data.metaTitle,
      description: data.metaDescription,
      type: "article",
      url: `${baseUrl}/fortune-cookie-ideas/${activity}`,
      images: [
        {
          url: getImageUrl("/og-image.png"),
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
      images: [getImageUrl("/twitter-image.png")],
      creator: "@fortunecookieai",
    },
    alternates: {
      canonical: `/fortune-cookie-ideas/${activity}`,
    },
  };
}

export default async function ActivityPage({ params }: PageProps) {
  const { activity } = await params;
  const data = getActivity(activity);

  if (!data) notFound();

  const sameGroup = getActivitiesByGroup(data.group)
    .filter((a) => a.slug !== activity)
    .slice(0, 6);

  const relatedLinks = sameGroup.map((a) => ({
    slug: a.slug,
    title: a.title,
    emoji: a.emoji,
    badge: a.badge,
    basePath: "/fortune-cookie-ideas",
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
        url={`/fortune-cookie-ideas/${activity}`}
        datePublished="2024-01-15"
        dateModified={new Date().toISOString().split("T")[0]}
      />
      <BreadcrumbStructuredData
        items={[
          { name: "Home", url: "/" },
          {
            name: "Fortune Cookie Ideas",
            url: "/fortune-cookie-ideas",
          },
          {
            name: data.title,
            url: `/fortune-cookie-ideas/${activity}`,
          },
        ]}
      />
      <FAQStructuredData faqs={faqs} />
      <ActivityPageContent data={data} relatedLinks={relatedLinks} />
    </>
  );
}
