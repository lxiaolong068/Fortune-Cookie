import { Metadata } from "next";
import {
  RecipeStructuredData,
  BreadcrumbStructuredData,
} from "@/components/StructuredData";
import { FAQStructuredData, recipeFAQs } from "@/components/FAQStructuredData";
import { getImageUrl, getSiteUrl } from "@/lib/site";
import { generateAlternateLanguages } from "@/lib/i18n-config";
import { RecipesPageContent } from "./RecipesPageContent";

const baseUrl = getSiteUrl();

// Static generation configuration
export const dynamic = "force-static";
export const revalidate = 86400; // 24 hours

export const metadata: Metadata = {
  title: "Fortune Cookie Recipes - Classic, Chocolate & Gluten-Free",
  description:
    "Classic, chocolate, and gluten-free fortune cookie recipes with step-by-step instructions and baking tips. Perfect for parties and special occasions.",
  openGraph: {
    title: "Fortune Cookie Recipes - Classic, Chocolate & Gluten-Free",
    description:
      "Classic, chocolate, and gluten-free fortune cookie recipes with step-by-step instructions and baking tips. Perfect for parties and special occasions.",
    type: "article",
    url: `${baseUrl}/recipes`,
    images: [
      {
        url: getImageUrl("/og-image.png"),
        width: 1200,
        height: 630,
        alt: "Fortune Cookie Recipes",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Fortune Cookie Recipes - Classic, Chocolate & Gluten-Free",
    description:
      "Classic, chocolate, and gluten-free fortune cookie recipes with step-by-step instructions and baking tips.",
    images: [getImageUrl("/twitter-image.png")],
    creator: "@fortunecookieai",
  },
  alternates: {
    canonical: "/recipes",
    languages: generateAlternateLanguages("/recipes", baseUrl),
  },
};

// Recipe data for structured data (server-side only)
const recipes = [
  {
    id: "classic",
    title: "Classic Fortune Cookies",
    difficulty: "Medium",
    time: "45 minutes",
    servings: "24 cookies",
    rating: 4.8,
    description:
      "The traditional fortune cookie recipe with a crispy texture and perfect fold.",
    extendedDescription:
      "These traditional fortune cookies feature a delicate, crispy texture with subtle vanilla and almond flavors. Perfect for Chinese New Year celebrations, birthday parties, or wedding favors where you want to add a personalized touch with custom messages.",
    ingredients: [
      "3 large egg whites",
      "3/4 cup white sugar",
      "1/2 cup butter, melted",
      "1/4 teaspoon vanilla extract",
      "1/4 teaspoon almond extract",
      "1 cup all-purpose flour",
      "2 tablespoons water",
      "Pinch of salt",
    ],
    instructions: [
      "Preheat oven to 300°F (150°C). Line baking sheets with parchment paper.",
      "In a bowl, whisk egg whites and sugar until frothy.",
      "Add melted butter, vanilla, and almond extracts. Mix well.",
      "Gradually add flour, water, and salt. Mix until smooth.",
      "Drop spoonfuls of batter onto prepared baking sheets, spacing 4 inches apart.",
      "Bake for 15-20 minutes until edges are golden brown.",
      "Working quickly, place fortune in center and fold cookie in half, then bend over edge of bowl.",
      "Cool in muffin tin to maintain shape.",
    ],
  },
  {
    id: "chocolate",
    title: "Chocolate Fortune Cookies",
    difficulty: "Medium",
    time: "50 minutes",
    servings: "20 cookies",
    rating: 4.6,
    description: "A delicious twist on the classic with rich chocolate flavor.",
    extendedDescription:
      "These chocolate fortune cookies offer a decadent twist on the traditional recipe, featuring rich cocoa flavor that pairs beautifully with sweet fortune messages. Ideal for Valentine's Day treats, chocolate lovers' birthday parties, or as unique after-dinner desserts.",
    ingredients: [
      "3 large egg whites",
      "3/4 cup white sugar",
      "1/2 cup butter, melted",
      "1/4 teaspoon vanilla extract",
      "3/4 cup all-purpose flour",
      "1/4 cup cocoa powder",
      "2 tablespoons water",
      "Pinch of salt",
    ],
    instructions: [
      "Preheat oven to 300°F (150°C). Line baking sheets with parchment paper.",
      "Whisk egg whites and sugar until frothy.",
      "Add melted butter and vanilla extract.",
      "Sift together flour and cocoa powder, then gradually add to mixture.",
      "Add water and salt, mix until smooth.",
      "Drop spoonfuls onto baking sheets, spacing well apart.",
      "Bake for 18-22 minutes until set.",
      "Quickly add fortunes and fold while warm.",
    ],
  },
  {
    id: "gluten-free",
    title: "Gluten-Free Fortune Cookies",
    difficulty: "Easy",
    time: "40 minutes",
    servings: "18 cookies",
    rating: 4.4,
    description:
      "Perfect for those with gluten sensitivities, without compromising on taste.",
    extendedDescription:
      "These gluten-free fortune cookies are perfect for guests with dietary restrictions, ensuring everyone can enjoy the fun of cracking open a cookie to reveal their fortune. Great for inclusive party planning, celiac-friendly events, or health-conscious gatherings.",
    ingredients: [
      "3 large egg whites",
      "3/4 cup sugar",
      "1/2 cup melted butter",
      "1/4 teaspoon vanilla extract",
      "1 cup gluten-free flour blend",
      "2 tablespoons water",
      "1/4 teaspoon xanthan gum (if not in flour blend)",
      "Pinch of salt",
    ],
    instructions: [
      "Preheat oven to 300°F (150°C).",
      "Beat egg whites and sugar until frothy.",
      "Mix in melted butter and vanilla.",
      "Combine gluten-free flour, xanthan gum, and salt.",
      "Gradually add dry ingredients to wet mixture.",
      "Add water and mix until smooth.",
      "Bake small circles for 15-18 minutes.",
      "Shape while warm with fortunes inside.",
    ],
  },
];

export default function RecipesPage() {
  return (
    <>
      <RecipeStructuredData recipes={recipes} />
      <BreadcrumbStructuredData
        items={[
          { name: "Home", url: "/" },
          { name: "Fortune Cookie Recipes", url: "/recipes" },
        ]}
      />
      <RecipesPageContent />
      <FAQStructuredData faqs={recipeFAQs} />
    </>
  );
}
