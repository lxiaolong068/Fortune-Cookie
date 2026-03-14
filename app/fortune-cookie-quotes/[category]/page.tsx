import { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  BreadcrumbStructuredData,
  ArticleStructuredData,
} from "@/components/StructuredData";
import { FAQStructuredData } from "@/components/FAQStructuredData";
import { getImageUrl, getSiteUrl } from "@/lib/site";
import {
  getQuoteCategory,
  getAllQuoteSlugs,
  getQuotesByGroup,
} from "@/lib/pseo/quotes";
import { QuotePageContent } from "./QuotePageContent";

export const dynamic = "force-static";
export const revalidate = 86400;

const baseUrl = getSiteUrl();

interface PageProps {
  params: Promise<{ category: string }>;
}

export async function generateStaticParams() {
  return getAllQuoteSlugs().map((slug) => ({ category: slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { category } = await params;
  const data = getQuoteCategory(category);

  if (!data) return { title: "Not Found" };

  return {
    title: data.metaTitle,
    description: data.metaDescription,
    openGraph: {
      title: data.metaTitle,
      description: data.metaDescription,
      type: "article",
      url: `${baseUrl}/fortune-cookie-quotes/${category}`,
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
      canonical: `/fortune-cookie-quotes/${category}`,
    },
  };
}

export default async function QuoteCategoryPage({ params }: PageProps) {
  const { category } = await params;
  const data = getQuoteCategory(category);

  if (!data) notFound();

  const sameGroup = getQuotesByGroup(data.group)
    .filter((q) => q.slug !== category)
    .slice(0, 6);

  const relatedLinks = sameGroup.map((q) => ({
    slug: q.slug,
    title: q.title,
    emoji: q.emoji,
    badge: q.badge,
    basePath: "/fortune-cookie-quotes",
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
        url={`/fortune-cookie-quotes/${category}`}
        datePublished="2024-01-15"
        dateModified={new Date().toISOString().split("T")[0]}
      />
      <BreadcrumbStructuredData
        items={[
          { name: "Home", url: "/" },
          {
            name: "Fortune Cookie Quotes",
            url: "/fortune-cookie-quotes",
          },
          {
            name: data.title,
            url: `/fortune-cookie-quotes/${category}`,
          },
        ]}
      />
      <FAQStructuredData faqs={faqs} />
      <QuotePageContent data={data} relatedLinks={relatedLinks} />
    </>
  );
}
