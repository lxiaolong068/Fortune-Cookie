import "server-only";

import { getBlogPosts, type BlogPostMeta } from "@/lib/blog";
import { searchFortunes, type FortuneMessage } from "@/lib/fortune-database";

export type StaticPageResult = {
  title: string;
  description: string;
  url: string;
};

const staticPages: StaticPageResult[] = [
  {
    title: "Home",
    description: "Generate a free AI-powered fortune cookie message.",
    url: "/",
  },
  {
    title: "AI Generator",
    description: "Create personalized fortune cookie messages with AI.",
    url: "/generator",
  },
  {
    title: "Browse Fortune Messages",
    description: "Browse fortune messages by category and popularity.",
    url: "/browse",
  },
  {
    title: "Fortune Cookie Messages",
    description: "Explore inspirational, funny, love, and success messages.",
    url: "/messages",
  },
  {
    title: "Recipes",
    description: "Learn how to make fortune cookies and browse recipes.",
    url: "/recipes",
  },
  {
    title: "How to Make Fortune Cookies",
    description: "Step-by-step guide to making fortune cookies at home.",
    url: "/how-to-make-fortune-cookies",
  },
  {
    title: "History",
    description: "Explore the origins and cultural evolution of fortune cookies.",
    url: "/history",
  },
  {
    title: "Who Invented Fortune Cookies?",
    description: "Discover the surprising story behind fortune cookie origins.",
    url: "/who-invented-fortune-cookies",
  },
  {
    title: "Funny Fortune Cookie Messages",
    description: "Browse hilarious fortune cookie sayings and jokes.",
    url: "/funny-fortune-cookie-messages",
  },
  {
    title: "Blog",
    description: "Read articles about fortune cookies, luck, and wisdom.",
    url: "/blog",
  },
];

function normalizeQuery(query: string): string {
  return query.toLowerCase().trim();
}

export function searchSite(query: string, options?: {
  maxPages?: number;
  maxBlogPosts?: number;
  maxFortunes?: number;
}) {
  const normalized = normalizeQuery(query);

  const maxPages = options?.maxPages ?? 10;
  const maxBlogPosts = options?.maxBlogPosts ?? 10;
  const maxFortunes = options?.maxFortunes ?? 20;

  if (!normalized) {
    return {
      query,
      pages: [] as StaticPageResult[],
      blogPosts: [] as BlogPostMeta[],
      fortunes: [] as FortuneMessage[],
    };
  }

  const pages = staticPages
    .filter((page) => {
      const haystack = `${page.title} ${page.description}`.toLowerCase();
      return haystack.includes(normalized);
    })
    .slice(0, maxPages);

  const blogPosts = getBlogPosts({ includeDrafts: false })
    .filter((post) => {
      const haystack = [
        post.title,
        post.description,
        post.author,
        post.tags.join(" "),
      ]
        .join(" ")
        .toLowerCase();
      return haystack.includes(normalized);
    })
    .slice(0, maxBlogPosts);

  const fortunes = searchFortunes(query).slice(0, maxFortunes);

  return { query, pages, blogPosts, fortunes };
}

