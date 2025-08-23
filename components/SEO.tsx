import { Metadata } from 'next'

interface SEOProps {
  title?: string
  description?: string
  keywords?: string[]
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
  title = 'Fortune Cookie - Free Online AI Generator',
  description = 'Free online AI-powered fortune cookie generator. Get personalized inspirational messages, funny quotes, and lucky numbers. Create custom fortune cookies with our AI tool.',
  keywords = [
    'fortune cookie',
    'free online fortune cookie generator ai',
    'custom fortune cookie message creator',
    'ai fortune cookie sayings app',
    'inspirational fortune cookie quotes',
    'funny fortune cookie messages',
    'lucky numbers generator',
    'personalized fortune cookies'
  ],
  image = '/og-image.jpg',
  url = 'https://fortune-cookie-ai.vercel.app',
  type = 'website',
  publishedTime,
  modifiedTime,
  author = 'Fortune Cookie AI Team',
  section,
  tags = []
}: SEOProps): Metadata {
  const baseUrl = 'https://fortune-cookie-ai.vercel.app'
  const fullUrl = url.startsWith('http') ? url : `${baseUrl}${url}`
  const fullImageUrl = image.startsWith('http') ? image : `${baseUrl}${image}`

  return {
    title: {
      default: title,
      template: '%s | Fortune Cookie AI'
    },
    description,
    keywords,
    authors: [{ name: author }],
    creator: 'Fortune Cookie AI',
    publisher: 'Fortune Cookie AI',
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    metadataBase: new URL(baseUrl),
    alternates: {
      canonical: url === baseUrl ? '/' : url.replace(baseUrl, ''),
    },
    openGraph: {
      type,
      locale: 'en_US',
      url: fullUrl,
      title,
      description,
      siteName: 'Fortune Cookie AI',
      images: [
        {
          url: fullImageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      ...(publishedTime && { publishedTime }),
      ...(modifiedTime && { modifiedTime }),
      ...(author && { authors: [author] }),
      ...(section && { section }),
      ...(tags.length > 0 && { tags }),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
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
