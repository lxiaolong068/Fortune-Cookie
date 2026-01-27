import { Metadata } from "next";
import {
  BreadcrumbStructuredData,
  ArticleStructuredData,
  HowToStructuredData,
} from "@/components/StructuredData";
import {
  FAQStructuredData,
  howToMakeFAQs,
} from "@/components/FAQStructuredData";
import { getImageUrl, getSiteUrl } from "@/lib/site";
import { generateAlternateLanguages } from "@/lib/i18n-config";
import { HowToMakePageContent } from "./HowToMakePageContent";

const baseUrl = getSiteUrl();

// Static generation configuration
export const dynamic = "force-static";
export const revalidate = 86400; // 24 hours

export const metadata: Metadata = {
  title: "How to Make Fortune Cookies at Home - Easy Step by Step",
  description:
    "Easy step-by-step guide to make homemade fortune cookies. Perfect for beginners with tips, tricks, and custom message ideas.",
  openGraph: {
    title: "How to Make Fortune Cookies at Home - Easy Step by Step",
    description:
      "Easy step-by-step guide to make homemade fortune cookies. Perfect for beginners with tips, tricks, and custom message ideas.",
    type: "article",
    url: `${baseUrl}/how-to-make-fortune-cookies`,
    images: [
      {
        url: getImageUrl("/og-image.png"),
        width: 1200,
        height: 630,
        alt: "How to Make Fortune Cookies",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "How to Make Fortune Cookies at Home - Easy Step by Step",
    description:
      "Easy step-by-step guide to make homemade fortune cookies. Perfect for beginners with tips, tricks, and custom message ideas.",
    images: [getImageUrl("/twitter-image.png")],
    creator: "@fortunecookieai",
  },
  alternates: {
    canonical: "/how-to-make-fortune-cookies",
    languages: generateAlternateLanguages(
      "/how-to-make-fortune-cookies",
      baseUrl,
    ),
  },
};

// HowTo structured data for recipe
const recipeSteps = [
  {
    name: "Prepare Your Fortunes",
    text: "Write or print your fortune messages on small strips of paper (about 3.5 inches by 0.5 inches).",
  },
  {
    name: "Mix Dry Ingredients",
    text: "In a bowl, whisk together flour, sugar, salt, and cornstarch until well combined.",
  },
  {
    name: "Combine Wet Ingredients",
    text: "In another bowl, mix egg whites, vegetable oil, vanilla extract, and water until smooth.",
  },
  {
    name: "Create the Batter",
    text: "Gradually add wet ingredients to dry ingredients, stirring until smooth.",
  },
  {
    name: "Prepare Baking Sheet",
    text: "Line a baking sheet with parchment paper or silicone mat. Preheat oven to 300°F (150°C).",
  },
  {
    name: "Form Circles",
    text: "Drop 1 tablespoon of batter onto the sheet and spread into a thin 3-inch circle.",
  },
  {
    name: "Bake Until Golden",
    text: "Bake for 8-10 minutes until edges are golden brown and the center is set.",
  },
  {
    name: "Fold Quickly",
    text: "Remove from oven, place fortune in center, fold in half, then bend over the edge of a mug.",
  },
];

export default function HowToMakeFortuneCookiesPage() {
  return (
    <>
      <ArticleStructuredData
        headline="How to Make Fortune Cookies at Home - Easy Step by Step Guide"
        description="Easy step-by-step guide to make homemade fortune cookies. Perfect for beginners with tips, tricks, and custom message ideas."
        url="/how-to-make-fortune-cookies"
        datePublished="2024-01-15"
        dateModified={new Date().toISOString().split("T")[0]}
      />
      <BreadcrumbStructuredData
        items={[
          { name: "Home", url: "/" },
          { name: "Recipe", url: "/how-to-make-fortune-cookies" },
        ]}
      />
      <HowToStructuredData
        name="How to Make Fortune Cookies at Home"
        description="Learn to make delicious homemade fortune cookies with this easy recipe. Perfect for parties, gifts, or just for fun!"
        url="/how-to-make-fortune-cookies"
        totalTime="PT30M"
        steps={recipeSteps}
      />
      <FAQStructuredData faqs={howToMakeFAQs} />
      <HowToMakePageContent />
    </>
  );
}
