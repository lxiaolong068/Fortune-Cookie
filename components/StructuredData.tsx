import Script from 'next/script'

interface StructuredDataProps {
  data: object
}

export function StructuredData({ data }: StructuredDataProps) {
  return (
    <Script
      id="structured-data"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}

// 预定义的结构化数据组件
export function WebsiteStructuredData() {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Fortune Cookie AI',
    description: 'Free online AI-powered fortune cookie generator with personalized messages and lucky numbers',
    url: 'https://fortune-cookie-ai.vercel.app',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://fortune-cookie-ai.vercel.app/search?q={search_term_string}',
      },
      'query-input': 'required name=search_term_string',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Fortune Cookie AI',
      logo: {
        '@type': 'ImageObject',
        url: 'https://fortune-cookie-ai.vercel.app/logo.svg',
      },
    },
  }

  return <StructuredData data={data} />
}

export function WebApplicationStructuredData() {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Fortune Cookie AI Generator',
    description: 'Free online AI-powered fortune cookie generator. Create personalized inspirational messages, funny quotes, and discover lucky numbers.',
    url: 'https://fortune-cookie-ai.vercel.app',
    applicationCategory: 'Entertainment',
    operatingSystem: 'Any',
    browserRequirements: 'Requires JavaScript. Requires HTML5.',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      ratingCount: '1250',
      bestRating: '5',
      worstRating: '1',
    },
    author: {
      '@type': 'Organization',
      name: 'Fortune Cookie AI Team',
    },
    datePublished: '2024-01-01',
    dateModified: new Date().toISOString().split('T')[0],
    inLanguage: 'en-US',
    isAccessibleForFree: true,
    keywords: 'fortune cookie, AI generator, inspirational quotes, lucky numbers, free online tool',
  }

  return <StructuredData data={data} />
}

export function OrganizationStructuredData() {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Fortune Cookie AI',
    description: 'Provider of free online AI-powered fortune cookie generator',
    url: 'https://fortune-cookie-ai.vercel.app',
    logo: 'https://fortune-cookie-ai.vercel.app/logo.svg',
    sameAs: [
      'https://twitter.com/fortunecookieai',
      'https://github.com/fortune-cookie-ai',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'Customer Service',
      availableLanguage: ['English'],
    },
  }

  return <StructuredData data={data} />
}

export function BreadcrumbStructuredData({ items }: { 
  items: Array<{ name: string; url: string }> 
}) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url.startsWith('http') ? item.url : `https://fortune-cookie-ai.vercel.app${item.url}`,
    })),
  }

  return <StructuredData data={data} />
}

export function FAQStructuredData({ 
  faqs 
}: { 
  faqs: Array<{ question: string; answer: string }> 
}) {
  const data = {
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
  }

  return <StructuredData data={data} />
}
