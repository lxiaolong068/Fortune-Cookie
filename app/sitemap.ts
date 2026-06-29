import { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/site";

type ChangeFrequency = NonNullable<
  MetadataRoute.Sitemap[number]["changeFrequency"]
>;

interface PageConfig {
  path: string;
  priority: number;
  changeFrequency: ChangeFrequency;
  lastModified: Date;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = getSiteUrl();
  const now = new Date();
  const legalPagesDate = new Date("2025-10-01");

  // English-only tool site. Only currently-existing, indexable routes are listed.
  // Generator sub-modes (/generator/{oracle,event,rpg,persona}) are added once they ship.
  // /profile and /offline are intentionally excluded (login wall / offline fallback → noindex).
  const pages: PageConfig[] = [
    { path: "/", priority: 1.0, changeFrequency: "daily", lastModified: now },
    { path: "/generator", priority: 0.9, changeFrequency: "daily", lastModified: now },
    { path: "/about", priority: 0.5, changeFrequency: "monthly", lastModified: legalPagesDate },
    { path: "/cookies", priority: 0.4, changeFrequency: "monthly", lastModified: legalPagesDate },
    { path: "/privacy", priority: 0.3, changeFrequency: "yearly", lastModified: legalPagesDate },
    { path: "/terms", priority: 0.3, changeFrequency: "yearly", lastModified: legalPagesDate },
  ];

  return pages.map((page) => ({
    url: `${baseUrl}${page.path}`,
    lastModified: page.lastModified,
    changeFrequency: page.changeFrequency,
    priority: page.priority,
  }));
}
