import Script from 'next/script'
import { getStructuredDataUrls } from '@/lib/site'

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
  const urls = getStructuredDataUrls()

  const data = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Fortune Cookie AI',
    description: 'Free online AI-powered fortune cookie generator with personalized messages and lucky numbers',
    url: urls.website,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: urls.searchAction,
      },
      'query-input': 'required name=search_term_string',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Fortune Cookie AI',
      logo: {
        '@type': 'ImageObject',
        url: urls.logo,
      },
    },
  }

  return <StructuredData data={data} />
}

export function WebApplicationStructuredData() {
  const urls = getStructuredDataUrls()

  const data = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Fortune Cookie AI Generator',
    description: 'Free online AI-powered fortune cookie generator. Create personalized inspirational messages, funny quotes, and discover lucky numbers.',
    url: urls.website,
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
  const urls = getStructuredDataUrls()

  const data = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Fortune Cookie AI',
    description: 'Provider of free online AI-powered fortune cookie generator',
    url: urls.organization,
    logo: urls.logo,
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
  const urls = getStructuredDataUrls()

  const data = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url.startsWith('http') ? item.url : `${urls.website}${item.url}`,
    })),
  }

  return <StructuredData data={data} />
}

/**
 * Article 结构化数据组件
 * 用于文章类页面（如 History、How-to 等）
 */
export function ArticleStructuredData({
  headline,
  description,
  url,
  image,
  datePublished,
  dateModified,
  author = 'Fortune Cookie AI Team',
  keywords = []
}: {
  headline: string
  description: string
  url: string
  image?: string
  datePublished?: string
  dateModified?: string
  author?: string
  keywords?: string[]
}) {
  const urls = getStructuredDataUrls()
  const fullUrl = url.startsWith('http') ? url : `${urls.website}${url}`
  const fullImageUrl = image ? (image.startsWith('http') ? image : `${urls.website}${image}`) : `${urls.website}/og-image.png`

  const data = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline,
    description,
    url: fullUrl,
    mainEntityOfPage: fullUrl,
    image: {
      '@type': 'ImageObject',
      url: fullImageUrl,
      width: 1200,
      height: 630
    },
    author: {
      '@type': 'Organization',
      name: author,
      url: urls.organization
    },
    publisher: {
      '@type': 'Organization',
      name: 'Fortune Cookie AI',
      logo: {
        '@type': 'ImageObject',
        url: urls.logo
      }
    },
    datePublished: datePublished || new Date().toISOString(),
    dateModified: dateModified || new Date().toISOString(),
    ...(keywords.length > 0 && { keywords: keywords.join(', ') })
  }

  return <StructuredData data={data} />
}

/**
 * Recipe 结构化数据组件
 * 用于食谱页面
 */
export function RecipeStructuredData({
  recipes
}: {
  recipes: Array<{
    id: string
    title: string
    description: string
    ingredients: string[]
    instructions: string[]
    time: string
    servings: string
    difficulty: string
    rating?: number
  }>
}) {
  const urls = getStructuredDataUrls()

  const data = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Fortune Cookie Recipes',
    description: 'Collection of homemade fortune cookie recipes',
    url: `${urls.website}/recipes`,
    numberOfItems: recipes.length,
    itemListElement: recipes.map((recipe, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'Recipe',
        name: recipe.title,
        description: recipe.description,
        image: `${urls.website}/og-image.png`,
        author: {
          '@type': 'Organization',
          name: 'Fortune Cookie AI Team'
        },
        recipeIngredient: recipe.ingredients,
        recipeInstructions: recipe.instructions.map((instruction, idx) => ({
          '@type': 'HowToStep',
          name: `Step ${idx + 1}`,
          text: instruction
        })),
        totalTime: recipe.time,
        recipeYield: recipe.servings,
        recipeDifficulty: recipe.difficulty,
        ...(recipe.rating && {
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: recipe.rating,
            ratingCount: 100,
            bestRating: 5,
            worstRating: 1
          }
        }),
        recipeCategory: 'Dessert',
        recipeCuisine: 'Asian-American',
        keywords: 'fortune cookies, homemade cookies, dessert recipe, baking'
      }
    }))
  }

  return <StructuredData data={data} />
}

/**
 * ItemList 结构化数据组件
 * 用于消息列表、浏览页面等
 */
export function ItemListStructuredData({
  name,
  description,
  url,
  items
}: {
  name: string
  description: string
  url: string
  items: Array<{
    name: string
    description?: string
    url?: string
    category?: string
  }>
}) {
  const urls = getStructuredDataUrls()
  const fullUrl = url.startsWith('http') ? url : `${urls.website}${url}`

  const data = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name,
    description,
    url: fullUrl,
    numberOfItems: items.length,
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      ...(item.description && { description: item.description }),
      ...(item.url && {
        url: item.url.startsWith('http') ? item.url : `${urls.website}${item.url}`
      }),
      ...(item.category && { category: item.category })
    }))
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
