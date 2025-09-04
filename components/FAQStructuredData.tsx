import { Metadata } from 'next'

export interface FAQItem {
  question: string
  answer: string
}

interface FAQStructuredDataProps {
  faqs: FAQItem[]
}

export function FAQStructuredData({ faqs }: FAQStructuredDataProps) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(structuredData)
      }}
    />
  )
}

// Common FAQ data for different pages
export const fortuneCookieFAQs: FAQItem[] = [
  {
    question: "What are fortune cookies?",
    answer: "Fortune cookies are crisp cookies usually made from flour, sugar, vanilla, and sesame seed oil with a piece of paper inside containing a fortune, prophecy, or wise saying."
  },
  {
    question: "Where do fortune cookies come from?",
    answer: "Despite popular belief, fortune cookies are not traditionally Chinese. They were likely invented in California in the early 1900s by Japanese or Chinese immigrants."
  },
  {
    question: "How are fortune cookies made?",
    answer: "Fortune cookies are made by baking thin wafers of batter, then quickly folding them around a fortune while they're still warm and pliable."
  },
  {
    question: "Can I make fortune cookies at home?",
    answer: "Yes! You can make fortune cookies at home with basic ingredients like flour, sugar, egg whites, and vanilla. The key is working quickly while the cookies are still warm."
  }
]

export const funnyFortuneFAQs: FAQItem[] = [
  {
    question: "What makes a fortune cookie message funny?",
    answer: "Funny fortune cookie messages often use wordplay, unexpected twists, self-referential humor, or absurd predictions that subvert expectations."
  },
  {
    question: "Are funny fortune cookies appropriate for all ages?",
    answer: "Most funny fortune cookie messages are family-friendly, focusing on clever wordplay and harmless humor rather than inappropriate content."
  },
  {
    question: "Can I use funny fortune messages for parties?",
    answer: "Absolutely! Funny fortune cookies are perfect for parties, adding entertainment and conversation starters for guests of all ages."
  },
  {
    question: "How do I share funny fortune cookie messages?",
    answer: "You can easily copy and share funny fortune messages on social media, in text messages, or print them out for homemade fortune cookies."
  }
]

export const recipeFAQs: FAQItem[] = [
  {
    question: "What ingredients do I need to make fortune cookies?",
    answer: "Basic fortune cookie ingredients include all-purpose flour, sugar, egg whites, vanilla extract, vegetable oil, and water. Some recipes also include almond extract."
  },
  {
    question: "How long do homemade fortune cookies last?",
    answer: "Properly stored homemade fortune cookies can last up to one week in an airtight container at room temperature."
  },
  {
    question: "Why do my fortune cookies break when I fold them?",
    answer: "Fortune cookies need to be folded while they're still warm and pliable. If they cool too much, they become brittle and will crack when folded."
  },
  {
    question: "Can I make fortune cookies without special equipment?",
    answer: "Yes! While a fortune cookie mold helps, you can make them with just a baking sheet, mixing bowls, and quick hands to fold them while warm."
  }
]
