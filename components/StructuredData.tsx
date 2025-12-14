import { getStructuredDataUrls, getImageUrl } from "@/lib/site";
export { FAQStructuredData } from "./FAQStructuredData";

interface StructuredDataProps {
  data: unknown;
  id?: string;
  nonce?: string | null;
}

export function StructuredData({ data, id, nonce }: StructuredDataProps) {
  return (
    <script
      id={id}
      nonce={nonce ?? undefined}
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

// 预定义的结构化数据组件
export function WebsiteStructuredData({ nonce }: { nonce?: string | null } = {}) {
  const urls = getStructuredDataUrls();

  const data = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${urls.website}#website`,
    name: "Fortune Cookie AI",
    description:
      "Free online AI-powered fortune cookie generator with personalized messages and lucky numbers",
    url: urls.website,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: urls.searchAction,
      },
      "query-input": "required name=search_term_string",
    },
    publisher: {
      "@type": "Organization",
      "@id": `${urls.organization}#organization`,
      name: "Fortune Cookie AI",
      logo: {
        "@type": "ImageObject",
        url: urls.logo,
      },
    },
  };

  return <StructuredData id="schema-website" nonce={nonce} data={data} />;
}

export function WebApplicationStructuredData() {
  const urls = getStructuredDataUrls();

  const data = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "@id": `${urls.website}#webapp`,
    name: "Fortune Cookie AI Generator",
    description:
      "Free online AI-powered fortune cookie generator. Create personalized inspirational messages, funny quotes, and discover lucky numbers.",
    url: urls.website,
    applicationCategory: "Entertainment",
    operatingSystem: "Any",
    browserRequirements: "Requires JavaScript. Requires HTML5.",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    author: {
      "@type": "Organization",
      name: "Fortune Cookie AI Team",
    },
    datePublished: "2024-01-01",
    dateModified: new Date().toISOString().split("T")[0],
    inLanguage: "en-US",
    isAccessibleForFree: true,
    keywords:
      "fortune cookie, AI generator, inspirational quotes, lucky numbers, free online tool",
  };

  return <StructuredData id="schema-webapplication" data={data} />;
}

export function OrganizationStructuredData({
  nonce,
}: { nonce?: string | null } = {}) {
  const urls = getStructuredDataUrls();

  const data = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${urls.organization}#organization`,
    name: "Fortune Cookie AI",
    description: "Provider of free online AI-powered fortune cookie generator",
    url: urls.organization,
    logo: urls.logo,
    sameAs: [
      "https://twitter.com/fortunecookieai",
      "https://github.com/fortune-cookie-ai",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "Customer Service",
      availableLanguage: ["English"],
    },
  };

  return <StructuredData id="schema-organization" nonce={nonce} data={data} />;
}

export function BreadcrumbStructuredData({
  items,
  nonce,
}: {
  items: Array<{ name: string; url: string }>;
  nonce?: string | null;
}) {
  const urls = getStructuredDataUrls();

  const data = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url.startsWith("http")
        ? item.url
        : `${urls.website}${item.url}`,
    })),
  };

  return <StructuredData nonce={nonce} data={data} />;
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
  author = "Fortune Cookie AI Team",
  keywords = [],
  nonce,
}: {
  headline: string;
  description: string;
  url: string;
  image?: string;
  datePublished?: string;
  dateModified?: string;
  author?: string;
  keywords?: string[];
  nonce?: string | null;
}) {
  const urls = getStructuredDataUrls();
  const fullUrl = url.startsWith("http") ? url : `${urls.website}${url}`;
  const fullImageUrl = image
    ? getImageUrl(image)
    : getImageUrl("/og-image.png");

  const data = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline,
    description,
    url: fullUrl,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": fullUrl,
    },
    image: {
      "@type": "ImageObject",
      url: fullImageUrl,
      width: 1200,
      height: 630,
    },
    author: {
      "@type": "Organization",
      name: author,
      url: urls.organization,
    },
    publisher: {
      "@type": "Organization",
      name: "Fortune Cookie AI",
      logo: {
        "@type": "ImageObject",
        url: urls.logo,
      },
    },
    datePublished: datePublished || new Date().toISOString(),
    dateModified: dateModified || new Date().toISOString(),
    inLanguage: "en-US",
    ...(keywords.length > 0 && { keywords: keywords.join(", ") }),
  };

  return <StructuredData nonce={nonce} data={data} />;
}

/**
 * HowTo 结构化数据组件
 * 用于教程/指南类页面（适用于 Google How-to rich results）
 */
export function HowToStructuredData({
  name,
  description,
  url,
  image,
  totalTime,
  supplies = [],
  tools = [],
  steps,
  nonce,
}: {
  name: string;
  description: string;
  url: string;
  image?: string;
  totalTime?: string;
  supplies?: string[];
  tools?: string[];
  steps: Array<{ name: string; text: string; url?: string; image?: string }>;
  nonce?: string | null;
}) {
  const urls = getStructuredDataUrls();
  const fullUrl = url.startsWith("http") ? url : `${urls.website}${url}`;

  const data = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name,
    description,
    url: fullUrl,
    ...(image && {
      image: {
        "@type": "ImageObject",
        url: getImageUrl(image),
        width: 1200,
        height: 630,
      },
    }),
    ...(totalTime && { totalTime }),
    ...(supplies.length > 0 && {
      supply: supplies.map((supply) => ({
        "@type": "HowToSupply",
        name: supply,
      })),
    }),
    ...(tools.length > 0 && {
      tool: tools.map((tool) => ({
        "@type": "HowToTool",
        name: tool,
      })),
    }),
    step: steps.map((step) => ({
      "@type": "HowToStep",
      name: step.name,
      text: step.text,
      ...(step.url && {
        url: step.url.startsWith("http") ? step.url : `${urls.website}${step.url}`,
      }),
      ...(step.image && {
        image: {
          "@type": "ImageObject",
          url: getImageUrl(step.image),
        },
      }),
    })),
  };

  return <StructuredData nonce={nonce} data={data} />;
}

/**
 * Recipe 结构化数据组件
 * 用于食谱页面
 */
export function RecipeStructuredData({
  recipes,
  nonce,
}: {
  recipes: Array<{
    id: string;
    title: string;
    description: string;
    ingredients: string[];
    instructions: string[];
    time: string;
    servings: string;
    difficulty: string;
    rating?: number;
  }>;
  nonce?: string | null;
}) {
  const urls = getStructuredDataUrls();

  const data = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Fortune Cookie Recipes",
    description: "Collection of homemade fortune cookie recipes",
    url: `${urls.website}/recipes`,
    numberOfItems: recipes.length,
    itemListElement: recipes.map((recipe, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Recipe",
        name: recipe.title,
        description: recipe.description,
        image: getImageUrl("/og-image.png"),
        author: {
          "@type": "Organization",
          name: "Fortune Cookie AI Team",
        },
        recipeIngredient: recipe.ingredients,
        recipeInstructions: recipe.instructions.map((instruction, idx) => ({
          "@type": "HowToStep",
          name: `Step ${idx + 1}`,
          text: instruction,
        })),
        totalTime: recipe.time,
        recipeYield: recipe.servings,
        recipeDifficulty: recipe.difficulty,
        ...(recipe.rating && {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: recipe.rating,
            ratingCount: 100,
            bestRating: 5,
            worstRating: 1,
          },
        }),
        recipeCategory: "Dessert",
        recipeCuisine: "Asian-American",
        keywords: "fortune cookies, homemade cookies, dessert recipe, baking",
      },
    })),
  };

  return <StructuredData nonce={nonce} data={data} />;
}

/**
 * ItemList 结构化数据组件
 * 用于消息列表、浏览页面等
 */
export function ItemListStructuredData({
  name,
  description,
  url,
  items,
  nonce,
}: {
  name: string;
  description: string;
  url: string;
  items: Array<{
    name: string;
    description?: string;
    url?: string;
    category?: string;
  }>;
  nonce?: string | null;
}) {
  const urls = getStructuredDataUrls();
  const fullUrl = url.startsWith("http") ? url : `${urls.website}${url}`;

  const data = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name,
    description,
    url: fullUrl,
    numberOfItems: items.length,
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      ...(item.description && { description: item.description }),
      ...(item.url && {
        url: item.url.startsWith("http")
          ? item.url
          : `${urls.website}${item.url}`,
      }),
      ...(item.category && { category: item.category }),
    })),
  };

  return <StructuredData nonce={nonce} data={data} />;
}
