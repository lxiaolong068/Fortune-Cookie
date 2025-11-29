export interface FAQItem {
  question: string;
  answer: string;
}

interface FAQStructuredDataProps {
  faqs: FAQItem[];
}

export function FAQStructuredData({ faqs }: FAQStructuredDataProps) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(structuredData),
      }}
    />
  );
}

// Common FAQ data for different pages
export const fortuneCookieFAQs: FAQItem[] = [
  {
    question: "What are fortune cookies?",
    answer:
      "Fortune cookies are crisp cookies usually made from flour, sugar, vanilla, and sesame seed oil with a piece of paper inside containing a fortune, prophecy, or wise saying.",
  },
  {
    question: "Where do fortune cookies come from?",
    answer:
      "Despite popular belief, fortune cookies are not traditionally Chinese. They were likely invented in California in the early 1900s by Japanese or Chinese immigrants.",
  },
  {
    question: "How are fortune cookies made?",
    answer:
      "Fortune cookies are made by baking thin wafers of batter, then quickly folding them around a fortune while they're still warm and pliable.",
  },
  {
    question: "Can I make fortune cookies at home?",
    answer:
      "Yes! You can make fortune cookies at home with basic ingredients like flour, sugar, egg whites, and vanilla. The key is working quickly while the cookies are still warm.",
  },
];

export const funnyFortuneFAQs: FAQItem[] = [
  {
    question: "What makes a fortune cookie message funny?",
    answer:
      "Funny fortune cookie messages often use wordplay, unexpected twists, self-referential humor, or absurd predictions that subvert expectations.",
  },
  {
    question: "Are funny fortune cookies appropriate for all ages?",
    answer:
      "Most funny fortune cookie messages are family-friendly, focusing on clever wordplay and harmless humor rather than inappropriate content.",
  },
  {
    question: "Can I use funny fortune messages for parties?",
    answer:
      "Absolutely! Funny fortune cookies are perfect for parties, adding entertainment and conversation starters for guests of all ages.",
  },
  {
    question: "How do I share funny fortune cookie messages?",
    answer:
      "You can easily copy and share funny fortune messages on social media, in text messages, or print them out for homemade fortune cookies.",
  },
];

export const recipeFAQs: FAQItem[] = [
  {
    question: "What ingredients do I need to make fortune cookies?",
    answer:
      "Basic fortune cookie ingredients include all-purpose flour, sugar, egg whites, vanilla extract, vegetable oil, and water. Some recipes also include almond extract.",
  },
  {
    question: "How long do homemade fortune cookies last?",
    answer:
      "Properly stored homemade fortune cookies can last up to one week in an airtight container at room temperature.",
  },
  {
    question: "Why do my fortune cookies break when I fold them?",
    answer:
      "Fortune cookies need to be folded while they're still warm and pliable. If they cool too much, they become brittle and will crack when folded.",
  },
  {
    question: "Can I make fortune cookies without special equipment?",
    answer:
      "Yes! While a fortune cookie mold helps, you can make them with just a baking sheet, mixing bowls, and quick hands to fold them while warm.",
  },
  {
    question: "What's the best temperature for baking fortune cookies?",
    answer:
      "Fortune cookies are typically baked at 300°F (150°C) for 12-15 minutes until the edges are lightly golden. This temperature ensures they cook evenly without burning.",
  },
  {
    question: "Can I make gluten-free fortune cookies?",
    answer:
      "Yes! You can substitute all-purpose flour with a gluten-free flour blend. The texture may be slightly different, but they'll still fold and taste great.",
  },
];

export const howToMakeFAQs: FAQItem[] = [
  {
    question: "How difficult is it to make fortune cookies at home?",
    answer:
      "Making fortune cookies at home is moderately challenging. The baking is easy, but you need to work quickly to fold them while they're still warm and pliable.",
  },
  {
    question: "What's the most important tip for making fortune cookies?",
    answer:
      "Work fast! Fortune cookies must be shaped while they're still hot from the oven. Once they cool, they become brittle and will crack if you try to fold them.",
  },
  {
    question: "How do I prevent fortune cookies from sticking to the pan?",
    answer:
      "Always use parchment paper or silicone baking mats. Never use cooking spray or butter directly on the pan as it can affect the cookie's texture.",
  },
  {
    question: "Can I prepare the batter ahead of time?",
    answer:
      "It's best to use the batter immediately after mixing. The batter can separate if left sitting, which affects the cookie's texture and ability to fold properly.",
  },
  {
    question: "What size should I make the fortune cookie circles?",
    answer:
      "Make circles about 3-4 inches in diameter. This size is perfect for folding and creates the classic fortune cookie shape without being too thick or thin.",
  },
];

export const whoInventedFAQs: FAQItem[] = [
  {
    question: "Who really invented fortune cookies?",
    answer:
      "While the exact inventor is debated, Makoto Hagiwara is most widely credited with introducing fortune cookies to America around 1914 at the Japanese Tea Garden in San Francisco. However, the concept originated from Japanese 'tsujiura senbei' crackers.",
  },
  {
    question: "Are fortune cookies Chinese or Japanese?",
    answer:
      "Fortune cookies have Japanese origins, inspired by 'tsujiura senbei' crackers from Japan. They were adapted and popularized in America, later becoming associated with Chinese restaurants despite not being traditionally Chinese.",
  },
  {
    question: "When were fortune cookies first made?",
    answer:
      "The earliest fortune cookies in America appeared around 1914, though similar treats existed in Japan much earlier. The modern fortune cookie as we know it developed in California in the early 20th century.",
  },
  {
    question: "Why are fortune cookies associated with Chinese food?",
    answer:
      "Fortune cookies became associated with Chinese restaurants in America during the mid-20th century when Chinese restaurant owners adopted them as a dessert offering, despite their Japanese-American origins.",
  },
  {
    question: "What are tsujiura senbei?",
    answer:
      "Tsujiura senbei are traditional Japanese crackers that contained fortunes or predictions. They're considered the predecessor to modern fortune cookies and were popular in Japan during the 19th century.",
  },
];

export const historyFAQs: FAQItem[] = [
  {
    question: "What is the history of fortune cookies?",
    answer:
      "Fortune cookies have a complex history spanning from 19th century Japan to early 20th century California. They evolved from Japanese tsujiura senbei and were popularized in American Chinese restaurants.",
  },
  {
    question: "When did fortune cookies become popular in America?",
    answer:
      "Fortune cookies gained popularity in America during the 1940s and 1950s when Chinese restaurants began serving them as complimentary desserts. They became a staple of American Chinese cuisine by the 1960s.",
  },
  {
    question: "Are fortune cookies eaten in China?",
    answer:
      "No, fortune cookies are not traditionally eaten in China and are largely unknown there. They're considered an American invention and are primarily found in Chinese restaurants outside of China.",
  },
  {
    question: "How did fortune cookies spread across America?",
    answer:
      "Fortune cookies spread through Chinese restaurants across America after World War II. Restaurant owners found them to be an inexpensive and memorable way to end meals, leading to widespread adoption.",
  },
  {
    question: "What was the original purpose of fortune cookies?",
    answer:
      "Originally, fortune cookies served as a gesture of hospitality and entertainment. They provided diners with a small surprise and positive message to end their meal on a pleasant note.",
  },
];
