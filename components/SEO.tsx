import { Metadata } from 'next'
import { getSiteUrl, getFullUrl, getImageUrl, getSiteMetadata } from '@/lib/site'

interface SEOProps {
  title?: string
  description?: string
  image?: string
  url?: string
  type?: 'website' | 'article'
  publishedTime?: string
  modifiedTime?: string
  author?: string
  section?: string
  tags?: string[]
}

export function generateSEOMetadata({
  title,
  description,
  image = '/og-image.png',
  url,
  type = 'website',
  publishedTime,
  modifiedTime,
  author,
  section,
  tags = []
}: SEOProps): Metadata {
  const siteMetadata = getSiteMetadata()
  const finalTitle = title || siteMetadata.title
  const finalDescription = description || siteMetadata.description
  const normalizedDescription = finalDescription.length > 160
    ? finalDescription.slice(0, 157) + '...'
    : finalDescription
  const finalAuthor = author || siteMetadata.author
  const baseUrl = siteMetadata.baseUrl
  const fullUrl = url ? getFullUrl(url) : baseUrl
  const fullImageUrl = getImageUrl(image)

  return {
    title: {
      default: finalTitle,
      template: '%s | Fortune Cookie AI'
    },
    description: normalizedDescription,
    authors: [{ name: finalAuthor }],
    creator: siteMetadata.creator,
    publisher: siteMetadata.publisher,
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    metadataBase: new URL(baseUrl),
    alternates: {
      canonical: url ? (url === baseUrl ? '/' : url.replace(baseUrl, '')) : '/',
    },
    openGraph: {
      type,
      locale: siteMetadata.locale,
      url: fullUrl,
      title: finalTitle,
      description: finalDescription,
      siteName: siteMetadata.siteName,
      images: [
        {
          url: fullImageUrl,
          width: 1200,
          height: 630,
          alt: finalTitle,
        },
      ],
      ...(publishedTime && { publishedTime }),
      ...(modifiedTime && { modifiedTime }),
      ...(finalAuthor && { authors: [finalAuthor] }),
      ...(section && { section }),
      ...(tags.length > 0 && { tags }),
    },
    twitter: {
      card: 'summary_large_image',
      title: finalTitle,
      description: finalDescription,
      images: [fullImageUrl],
      creator: '@fortunecookieai',
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    verification: {
      google: process.env.GOOGLE_VERIFICATION_CODE,
    },
  }
}

// 结构化数据生成器
export function generateJSONLD(data: {
  type: 'WebSite' | 'WebApplication' | 'Article' | 'Organization'
  name: string
  description: string
  url: string
  image?: string
  author?: string
  datePublished?: string
  dateModified?: string
  keywords?: string[]
}) {
  const baseStructure = {
    '@context': 'https://schema.org',
    '@type': data.type,
    name: data.name,
    description: data.description,
    url: data.url,
    ...(data.image && { image: data.image }),
    ...(data.author && { author: { '@type': 'Person', name: data.author } }),
    ...(data.datePublished && { datePublished: data.datePublished }),
    ...(data.dateModified && { dateModified: data.dateModified }),
    ...(data.keywords && { keywords: data.keywords.join(', ') }),
  }

  if (data.type === 'WebApplication') {
    return {
      ...baseStructure,
      applicationCategory: 'Entertainment',
      operatingSystem: 'Any',
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD',
      },
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: '4.8',
        ratingCount: '1250',
      },
    }
  }

  if (data.type === 'Organization') {
    return {
      ...baseStructure,
      logo: data.image,
      sameAs: [
        'https://twitter.com/fortunecookieai',
        'https://github.com/fortune-cookie-ai',
      ],
    }
  }

  return baseStructure
}

// SEO工具函数
export const SEOUtils = {
  // 生成面包屑导航结构化数据
  generateBreadcrumbJSONLD: (items: Array<{ name: string; url: string }>) => ({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }),

  // 生成FAQ结构化数据
  generateFAQJSONLD: (faqs: Array<{ question: string; answer: string }>) => ({
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  }),

  // 生成评论结构化数据
  generateReviewJSONLD: (reviews: Array<{
    author: string
    rating: number
    reviewBody: string
    datePublished: string
  }>) => ({
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: 'Fortune Cookie AI Generator',
    review: reviews.map(review => ({
      '@type': 'Review',
      author: {
        '@type': 'Person',
        name: review.author,
      },
      reviewRating: {
        '@type': 'Rating',
        ratingValue: review.rating,
        bestRating: 5,
      },
      reviewBody: review.reviewBody,
      datePublished: review.datePublished,
    })),
  }),
}


// 兼容性 SEO 组件（App Router 中建议使用 metadata/generateMetadata）
// 该组件主要用于注入结构化数据，避免现有代码导入报错
export type SEOPropsComponent = {
  title?: string
  description?: string
  canonical?: string
  noIndex?: boolean
  openGraph?: any
  jsonLd?: Record<string, any> | Record<string, any>[]
}

export function SEO({ jsonLd }: SEOPropsComponent) {
  if (!jsonLd) return null
  const json = Array.isArray(jsonLd) ? jsonLd : [jsonLd]
  return (
    <>
      {json.map((obj, idx) => (
        <script
          key={idx}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(obj) }}
        />
      ))}
    </>
  )
}
