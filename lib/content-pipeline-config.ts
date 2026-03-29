/**
 * Content Auto-Generation Pipeline Configuration
 * 内容自动生成管道配置
 */

// ─── Tavily 搜索种子词池 ───────────────────────────────────────────────────────
// 每次运行随机抽取 2-3 个进行搜索
export const TOPIC_SEED_QUERIES: string[] = [
  "fortune cookie AI trends 2026",
  "mindfulness digital wellness trends",
  "luck psychology science research 2025",
  "Chinese fortune cookie cultural history",
  "AI spirituality technology future",
  "positive affirmations mental health habits",
  "fortune telling artificial intelligence predictions",
  "workplace wisdom motivational quotes productivity",
  "cultural traditions good luck superstitions",
  "digital wellbeing positive thinking habits",
  "personalized AI consumer experiences",
  "daily affirmations gratitude practice benefits",
  "fortune cookie party ideas occasions",
  "mindful living daily inspirational wisdom",
  "psychology of optimism happiness science",
  "AI generated personalized content trends",
];

// ─── 内容支柱定义 ─────────────────────────────────────────────────────────────
export interface ContentPillar {
  name: string;
  keywords: string[];
  weight: number; // 选题偏向权重 1-5
}

export const CONTENT_PILLARS: ContentPillar[] = [
  {
    name: "AI & Technology",
    keywords: ["ai", "technology", "artificial-intelligence", "digital", "algorithm", "machine-learning"],
    weight: 5,
  },
  {
    name: "Wellness & Mindfulness",
    keywords: ["wellness", "mindfulness", "meditation", "mental-health", "wellbeing", "positive-thinking"],
    weight: 4,
  },
  {
    name: "Cultural & History",
    keywords: ["culture", "history", "tradition", "chinese", "fortune-telling", "superstition"],
    weight: 3,
  },
  {
    name: "Occasions & Events",
    keywords: ["birthday", "wedding", "graduation", "party", "celebration", "holiday"],
    weight: 3,
  },
  {
    name: "Psychology of Luck",
    keywords: ["luck", "psychology", "optimism", "happiness", "science", "research"],
    weight: 4,
  },
];

// ─── 内链目标 ─────────────────────────────────────────────────────────────────
export interface InternalLinkTarget {
  path: string;
  anchor: string;
  context: string;
}

export const INTERNAL_LINK_TARGETS: InternalLinkTarget[] = [
  { path: "/", anchor: "Fortune Cookie AI", context: "homepage" },
  { path: "/generator", anchor: "AI fortune cookie generator", context: "main product page" },
  { path: "/browse", anchor: "browse fortune cookies", context: "browse page" },
  { path: "/browse/category/inspirational", anchor: "inspirational fortunes", context: "inspirational category" },
  { path: "/browse/category/ai", anchor: "AI-generated fortunes", context: "AI category" },
  { path: "/blog/ai-fortune-telling-trends-2025", anchor: "AI fortune telling trends", context: "related article" },
  { path: "/blog/psychology-of-fortune-cookies", anchor: "psychology of fortune cookies", context: "related article" },
];

// ─── Unsplash 查询映射 ────────────────────────────────────────────────────────
// 按内容支柱选择搜索词
export const UNSPLASH_QUERY_MAP: Record<string, string[]> = {
  "AI & Technology": [
    "artificial intelligence technology futuristic",
    "digital technology glowing abstract",
    "machine learning neural network visualization",
  ],
  "Wellness & Mindfulness": [
    "mindfulness meditation zen peaceful",
    "wellness yoga nature calm",
    "gratitude journal writing morning",
  ],
  "Cultural & History": [
    "chinese culture traditional lantern",
    "fortune telling mystical ancient",
    "asian culture food tradition",
  ],
  "Occasions & Events": [
    "celebration party confetti festive",
    "birthday cake candles celebration",
    "wedding flowers elegant ceremony",
  ],
  "Psychology of Luck": [
    "luck four leaf clover lucky",
    "positive thinking happiness sunshine",
    "success achievement goals journey",
  ],
  default: [
    "fortune cookie wisdom",
    "lucky fortune inspiration",
    "wisdom quote peaceful nature",
  ],
};

// ─── OpenRouter 配置 ──────────────────────────────────────────────────────────
export const DEFAULT_CONTENT_MODEL =
  process.env.CONTENT_GENERATION_MODEL || "x-ai/grok-4.1-fast";

export const OPENROUTER_CONFIG = {
  baseUrl: "https://openrouter.ai/api/v1",
  referer: "https://fortune-cookie.cc",
  title: "Fortune Cookie Blog Generator",
} as const;

// ─── Fallback 话题池 (Tavily 失败时使用) ─────────────────────────────────────
export interface FallbackTopic {
  title: string;
  slug: string;
  description: string;
  tags: string[];
  outline: string[];
  unsplashQuery: string;
}

export const FALLBACK_TOPICS: FallbackTopic[] = [
  {
    title: "The Science of Luck: What Research Reveals About Fortune and Success",
    slug: "science-of-luck-research-fortune-success",
    description: "Explore what psychology and neuroscience tell us about luck, fortune, and why some people seem luckier than others.",
    tags: ["luck", "psychology", "science", "success", "mindset"],
    outline: [
      "Introduction: Is luck real or just perception?",
      "What psychologists say about lucky personalities",
      "Confirmation bias and the illusion of luck",
      "How to cultivate a luckier mindset",
      "Fortune cookies as a daily luck ritual",
      "Conclusion: Creating your own good fortune",
    ],
    unsplashQuery: "luck clover lucky four leaf nature",
  },
  {
    title: "How Fortune Cookies Became America's Favorite Chinese-American Tradition",
    slug: "fortune-cookies-american-chinese-tradition-history",
    description: "The surprising history of how fortune cookies evolved from Japanese American confections to a beloved Chinese-American cultural icon.",
    tags: ["history", "culture", "chinese-american", "tradition", "food"],
    outline: [
      "Introduction: Not from China",
      "Origins in Japanese American bakeries",
      "World War II and the cultural shift",
      "How fortune cookies conquered Chinese restaurants",
      "The message inside: evolution of fortune writing",
      "Fortune cookies in the digital age",
    ],
    unsplashQuery: "chinese american food culture restaurant",
  },
  {
    title: "5 Morning Rituals That Use Ancient Wisdom for Modern Productivity",
    slug: "morning-rituals-ancient-wisdom-modern-productivity",
    description: "Discover how ancient practices like fortune reading, affirmations, and mindful reflection can transform your morning routine and boost productivity.",
    tags: ["morning-routine", "productivity", "mindfulness", "wellness", "habits"],
    outline: [
      "Introduction: The power of intentional mornings",
      "Ritual 1: Mindful fortune reading as daily intention-setting",
      "Ritual 2: Journaling your own fortune",
      "Ritual 3: Affirmations rooted in cultural wisdom",
      "Ritual 4: Gratitude practice inspired by fortune cookie philosophy",
      "Ritual 5: Sharing wisdom with others",
      "Building your personalized morning wisdom routine",
    ],
    unsplashQuery: "morning routine sunrise coffee journal",
  },
  {
    title: "AI vs. Human Wisdom: Who Writes Better Fortune Cookie Messages?",
    slug: "ai-vs-human-fortune-cookie-messages-comparison",
    description: "We put AI-generated fortune cookie messages head-to-head against human-written wisdom. The results might surprise you.",
    tags: ["ai", "creativity", "fortune-cookie", "technology", "comparison"],
    outline: [
      "Introduction: The rise of AI content generation",
      "What makes a great fortune cookie message?",
      "Methodology: Testing AI vs human wisdom",
      "Round 1: Inspirational messages",
      "Round 2: Humor and playfulness",
      "Round 3: Cultural authenticity",
      "The verdict: Collaboration wins",
    ],
    unsplashQuery: "artificial intelligence human collaboration technology",
  },
  {
    title: "Fortune Cookie Messages for Every Zodiac Sign: Personalized Wisdom",
    slug: "fortune-cookie-messages-zodiac-signs-personalized",
    description: "Discover fortune cookie messages perfectly aligned with each zodiac sign's unique personality traits and life journey.",
    tags: ["zodiac", "astrology", "personalization", "fortune-cookie", "horoscope"],
    outline: [
      "Introduction: Personalized fortune in the stars",
      "Fire signs (Aries, Leo, Sagittarius): Bold wisdom",
      "Earth signs (Taurus, Virgo, Capricorn): Grounded guidance",
      "Air signs (Gemini, Libra, Aquarius): Intellectual insights",
      "Water signs (Cancer, Scorpio, Pisces): Emotional wisdom",
      "How AI personalizes fortune by zodiac",
    ],
    unsplashQuery: "zodiac astrology stars cosmos night sky",
  },
];
