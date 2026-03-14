/**
 * pSEO Data: Category-Based Fortune Cookie Quotes
 *
 * Powers: /fortune-cookie-quotes/[category]
 * Template B: "[Category] Fortune Cookie Quotes" (25-30 pages)
 */

export interface QuoteSubcategory {
  name: string;
  messages: string[];
}

export interface QuoteTip {
  title: string;
  description: string;
}

export interface QuoteFAQ {
  question: string;
  answer: string;
}

export interface QuoteData {
  slug: string;
  title: string;
  badge: string;
  emoji: string;
  description: string;
  metaTitle: string;
  metaDescription: string;
  subcategories: QuoteSubcategory[];
  tips: QuoteTip[];
  faqs: QuoteFAQ[];
  /** Slugs of related quote categories for cross-linking */
  relatedCategories: string[];
  /** Broad tone group for Hub page */
  group: "positive" | "reflective" | "humor" | "life" | "relationship";
}

// ---------------------------------------------------------------------------
// POSITIVE & UPLIFTING
// ---------------------------------------------------------------------------

const inspirational: QuoteData = {
  slug: "inspirational",
  title: "Inspirational Fortune Cookie Quotes",
  badge: "70+ Quotes",
  emoji: "✨",
  description:
    "Discover powerful inspirational fortune cookie quotes that ignite motivation, spark hope, and remind you of your limitless potential.",
  metaTitle: "70+ Inspirational Fortune Cookie Quotes | Motivating Sayings",
  metaDescription:
    "Find your spark with 70+ inspirational fortune cookie quotes! Powerful, uplifting sayings to motivate, encourage & inspire. Free to copy & share.",
  subcategories: [
    {
      name: "Believe in Yourself",
      messages: [
        "Your future is created by what you do today, not tomorrow.",
        "Believe you can and you're halfway there.",
        "You are braver than you believe, stronger than you seem.",
        "The only limits that exist are the ones you place on yourself.",
        "Every expert was once a beginner — keep going.",
        "You are more capable than your fear tells you.",
        "Trust yourself. You have survived everything so far.",
        "The seed of greatness is already within you.",
        "Your potential is the only thing bigger than your doubts.",
        "Confidence is not 'they will like me' — it's 'I'll be fine either way.'",
      ],
    },
    {
      name: "Take Action",
      messages: [
        "The best time to plant a tree was 20 years ago. The second best time is now.",
        "A year from now you'll wish you had started today.",
        "Small steps in the right direction are better than a giant leap in the wrong one.",
        "Action is the foundational key to all success.",
        "You don't have to be great to start, but you have to start to be great.",
        "Progress, not perfection, is the goal.",
        "Momentum is built one step at a time.",
        "Do something today that your future self will thank you for.",
        "The journey of a thousand miles begins with a single step.",
        "Start where you are. Use what you have. Do what you can.",
      ],
    },
    {
      name: "Overcome Obstacles",
      messages: [
        "Storms make trees take deeper roots.",
        "The gem cannot be polished without friction.",
        "Every setback is a setup for a comeback.",
        "The obstacle is the way.",
        "Difficulties are the stepping stones to success.",
        "Fall seven times, stand up eight.",
        "What doesn't break you makes you extraordinary.",
        "The darkest hour has only sixty minutes.",
        "Challenges are what make life interesting; overcoming them is what makes life meaningful.",
        "You were not built for easy. You were built for this.",
      ],
    },
  ],
  tips: [
    {
      title: "Morning Ritual",
      description:
        "Read an inspirational fortune cookie quote each morning to set a positive, motivated tone for your day before reaching for your phone.",
    },
    {
      title: "Share in Team Meetings",
      description:
        "Open a team meeting with an inspirational fortune cookie quote — it takes 30 seconds and shifts the energy in the room.",
    },
    {
      title: "Journal Prompts",
      description:
        "Use an inspirational quote as a journal prompt — write for 5 minutes about what the quote means to you today.",
    },
  ],
  faqs: [
    {
      question: "What are the best inspirational fortune cookie quotes?",
      answer:
        "The best inspirational fortunes combine timeless wisdom with a fresh angle — 'Your future is created by what you do today, not tomorrow' or 'The seed of greatness is already within you' are perennial favorites.",
    },
    {
      question: "How do I use inspirational fortune cookie quotes daily?",
      answer:
        "Read one each morning, pin your favorites to your workspace, use them as journal prompts, or share one in your team's daily check-in. Small doses of inspiration consistently applied create lasting motivation.",
    },
    {
      question: "Are fortune cookie quotes actually inspirational?",
      answer:
        "The best fortune cookie quotes distill centuries of wisdom into memorable, actionable phrases. They work because brevity forces clarity — a short, sharp insight often lands harder than a long motivational speech.",
    },
  ],
  relatedCategories: ["motivational", "encouraging", "uplifting", "positive"],
  group: "positive",
};

const motivational: QuoteData = {
  slug: "motivational",
  title: "Motivational Fortune Cookie Quotes",
  badge: "65+ Quotes",
  emoji: "🚀",
  description:
    "Push past your limits with motivational fortune cookie quotes that fuel ambition, drive action, and keep you moving forward.",
  metaTitle: "65+ Motivational Fortune Cookie Quotes | Drive & Ambition",
  metaDescription:
    "Fuel your ambition with 65+ motivational fortune cookie quotes! Action-driven sayings that push you to work harder, dream bigger & achieve more.",
  subcategories: [
    {
      name: "Work Harder",
      messages: [
        "The harder you work, the luckier you seem to get.",
        "Talent gets you in the room; hard work keeps you there.",
        "Success is the sum of small efforts repeated day after day.",
        "Nothing worth having comes easy — but everything worth having comes to those who persist.",
        "Work until your bank account looks like a phone number.",
        "Hustle in silence. Let success make the noise.",
        "The dream is free. The hustle is sold separately.",
        "Success doesn't come to you — you go to it.",
        "Great things come to those who work their face off.",
        "Don't watch the clock — do what it does. Keep going.",
      ],
    },
    {
      name: "Dream Bigger",
      messages: [
        "Your dream doesn't care about your excuses.",
        "Dream big enough to scare yourself.",
        "The only dream you should fear is the one you gave up on.",
        "Your vision is the map; your effort is the fuel.",
        "Shoot for the moon — even if you miss, you land among the stars.",
        "Dare to begin the impossible — it rarely stays impossible.",
        "Think big. Start small. Scale fast.",
        "The life you want exists. Go build it.",
        "Big dreams require big courage and relentless execution.",
        "If your plan doesn't scare you a little, it's not big enough.",
      ],
    },
    {
      name: "Keep Going",
      messages: [
        "Winners never quit, and quitters never win.",
        "When you feel like quitting, remember why you started.",
        "Perseverance is the mother of all good luck.",
        "Every champion was once a contender who refused to give up.",
        "It's always too soon to quit.",
        "One more day. One more rep. One more step.",
        "The only real failure is the failure to keep trying.",
        "Endurance is not just the ability to bear a hard thing, but to turn it into glory.",
        "The road to success is always under construction.",
        "Keep going. The breakthrough is closer than the breakdown.",
      ],
    },
  ],
  tips: [
    {
      title: "Pre-Workout Ritual",
      description:
        "Read a motivational fortune cookie quote before your workout or a challenging task — it primes your mindset for effort.",
    },
    {
      title: "Vision Board Addition",
      description:
        "Print your favorite motivational quotes and add them to your vision board or goals journal for daily reinforcement.",
    },
    {
      title: "Accountability Partner Shares",
      description:
        "Share a motivational quote with your accountability partner each week to keep each other energized and on track.",
    },
  ],
  faqs: [
    {
      question: "What is the most motivational fortune cookie message?",
      answer:
        "Motivation is personal, but universally powerful quotes include 'The harder you work, the luckier you seem to get' and 'When you feel like quitting, remember why you started.'",
    },
    {
      question: "How are motivational fortune cookie quotes different from inspirational ones?",
      answer:
        "Inspirational quotes tend to uplift and comfort; motivational quotes push you to act. Motivational fortunes are more action-oriented — 'Do something today your future self will thank you for.'",
    },
    {
      question: "Where can I find good motivational fortune cookie quotes?",
      answer:
        "Browse the collection above, or use our AI fortune generator to create custom motivational messages tailored to your specific goals, challenges, or context.",
    },
  ],
  relatedCategories: ["inspirational", "encouraging", "success", "life"],
  group: "positive",
};

const encouraging: QuoteData = {
  slug: "encouraging",
  title: "Encouraging Fortune Cookie Quotes",
  badge: "60+ Quotes",
  emoji: "💪",
  description:
    "Find comfort and courage with encouraging fortune cookie quotes that remind you that you are enough, you are not alone, and you can do this.",
  metaTitle: "60+ Encouraging Fortune Cookie Quotes | You've Got This",
  metaDescription:
    "Get the encouragement you need with 60+ fortune cookie quotes! Comforting, uplifting sayings that remind you of your strength. Free to copy.",
  subcategories: [
    {
      name: "You're Enough",
      messages: [
        "You are enough — exactly as you are right now.",
        "Stop waiting to be perfect before you begin — begin and let perfect follow.",
        "Comparison is the thief of joy. Run your own race.",
        "You don't need anyone's permission to be who you are.",
        "Your worth is not measured by your productivity.",
        "Being yourself is your superpower — never apologize for it.",
        "You are not behind. You are on your own path.",
        "You don't have to be everything to everyone — just be yourself.",
        "The world needs you, not your impression of someone else.",
        "You are doing better than you think.",
      ],
    },
    {
      name: "You're Not Alone",
      messages: [
        "Someone, somewhere, is rooting for you.",
        "You don't have to carry everything alone.",
        "Hard days are not the end — they are the middle of the story.",
        "Even on your worst day, you are still someone's reason to smile.",
        "The people who love you see what you can't see right now.",
        "Asking for help is not weakness — it's the wisest kind of strength.",
        "You matter more than you know.",
        "The universe has not forgotten you.",
        "Your presence in this world makes a difference — believe it.",
        "Someone is thinking of you warmly today.",
      ],
    },
    {
      name: "Keep Going",
      messages: [
        "Every storm runs out of rain.",
        "This too shall pass — and so will you, right through it.",
        "You have survived 100% of your hardest days so far.",
        "Hard is not the same as impossible.",
        "Rest if you must, but don't you quit.",
        "The most beautiful things grow through the cracks.",
        "Even the darkest night will end, and the sun will rise.",
        "Slow progress is still progress.",
        "You are closer than you think.",
        "Tomorrow holds possibilities that today can't yet see.",
      ],
    },
  ],
  tips: [
    {
      title: "Send to a Friend",
      description:
        "Copy an encouraging quote and send it to someone who's going through a hard time — a small gesture that can mean everything.",
    },
    {
      title: "Bathroom Mirror Note",
      description:
        "Write your favorite encouraging quote on a sticky note and put it on your bathroom mirror for a daily reminder.",
    },
    {
      title: "Mental Health Day",
      description:
        "On tough mental health days, read through encouraging quotes as a gentle reminder that hard days are temporary.",
    },
  ],
  faqs: [
    {
      question: "What are encouraging fortune cookie messages for hard times?",
      answer:
        "The best encouraging fortunes for hard times acknowledge difficulty while affirming resilience — 'You have survived 100% of your hardest days so far' or 'This too shall pass — and so will you, right through it.'",
    },
    {
      question: "How can I use encouraging fortune cookie quotes to help someone?",
      answer:
        "Text an encouraging quote to someone struggling, include one in a care package, write it on a card, or share it on social media as a positive ripple for whoever needs it.",
    },
    {
      question: "What's the difference between encouraging and inspirational quotes?",
      answer:
        "Inspiring quotes elevate your vision; encouraging quotes validate your struggle and remind you of your strength. Encouraging fortunes say 'you can' specifically to someone who doubts themselves.",
    },
  ],
  relatedCategories: ["inspirational", "uplifting", "positive", "life"],
  group: "positive",
};

const uplifting: QuoteData = {
  slug: "uplifting",
  title: "Uplifting Fortune Cookie Quotes",
  badge: "55+ Quotes",
  emoji: "🌈",
  description:
    "Brighten your day with uplifting fortune cookie quotes full of positivity, warmth, and the gentle reminder that good things are coming.",
  metaTitle: "55+ Uplifting Fortune Cookie Quotes | Brighten Your Day",
  metaDescription:
    "Brighten any day with 55+ uplifting fortune cookie quotes! Warm, positive & feel-good sayings to lift your mood instantly. Free to copy & share.",
  subcategories: [
    {
      name: "Positive Outlook",
      messages: [
        "The sun always shines above the clouds.",
        "Something wonderful is about to happen.",
        "Good things take time — great things take a little longer.",
        "Happiness is not a destination; it's a way of traveling.",
        "The world is full of kind people — if you can't find one, be one.",
        "Today is a good day to have a good day.",
        "Positive thoughts attract positive outcomes.",
        "Every morning is a new beginning — let it be a good one.",
        "Smile — it's free and it changes everything.",
        "Optimism is the faith that leads to achievement.",
      ],
    },
    {
      name: "Gratitude & Joy",
      messages: [
        "Count your blessings — they outnumber your worries.",
        "Gratitude turns what we have into enough.",
        "Joy is not in things; it is in us.",
        "The happiest people don't have the best of everything — they make the best of everything.",
        "Appreciate the beauty of where you are on the way to where you're going.",
        "There is always something to be grateful for.",
        "Happiness grows when you water it with gratitude.",
        "Every day holds at least one beautiful moment.",
        "Find the gift in the ordinary.",
        "Joy is the simplest form of gratitude.",
      ],
    },
    {
      name: "Gentle Encouragement",
      messages: [
        "Be gentle with yourself — you're doing the best you can.",
        "Give yourself the grace you so freely give to others.",
        "Rest is not laziness — it's part of the process.",
        "Bloom at your own pace.",
        "Not every day has to be productive to be worthwhile.",
        "Healing is not linear — be patient with yourself.",
        "You are allowed to take up space.",
        "Peace of mind is worth more than productivity.",
        "You deserve the same kindness you show everyone else.",
        "Grow at the speed of understanding, not of expectation.",
      ],
    },
  ],
  tips: [
    {
      title: "Midday Reset",
      description:
        "Read an uplifting quote at lunchtime to reset your mood for the afternoon — a 30-second mental break that changes your energy.",
    },
    {
      title: "Good News Journal",
      description:
        "Pair an uplifting quote with one good thing that happened today in a 'good news journal' — builds a powerful positivity practice.",
    },
    {
      title: "Social Media Boost",
      description:
        "Share an uplifting fortune cookie quote on your social media — you never know whose day it might change.",
    },
  ],
  faqs: [
    {
      question: "What are the most uplifting fortune cookie messages?",
      answer:
        "Uplifting fortunes combine warmth and hope — 'Something wonderful is about to happen' or 'The happiest people don't have the best of everything — they make the best of everything' consistently resonate.",
    },
    {
      question: "How do uplifting fortune cookie quotes help mental health?",
      answer:
        "Brief positive messages can interrupt negative thought loops and reframe perspective. They work as micro-doses of positivity — not a cure, but a helpful daily practice.",
    },
    {
      question: "Are uplifting and encouraging fortune cookies different?",
      answer:
        "Uplifting quotes focus on positivity, joy, and hope; encouraging quotes focus specifically on your ability to overcome difficulty. Uplifting fortunes brighten good days; encouraging ones help on the hard ones.",
    },
  ],
  relatedCategories: ["encouraging", "positive", "inspirational", "life"],
  group: "positive",
};

const positive: QuoteData = {
  slug: "positive",
  title: "Positive Fortune Cookie Quotes",
  badge: "60+ Quotes",
  emoji: "☀️",
  description:
    "Fill your day with positive fortune cookie quotes that shift your mindset, attract good energy, and celebrate the good in every moment.",
  metaTitle: "60+ Positive Fortune Cookie Quotes | Good Vibes Only",
  metaDescription:
    "Spread good vibes with 60+ positive fortune cookie quotes! Feel-good, optimistic sayings to shift your mindset and attract positivity. Free to copy.",
  subcategories: [
    {
      name: "Good Vibes",
      messages: [
        "Good energy is contagious — spread it freely.",
        "Positivity is a choice you make before the day makes it for you.",
        "Your energy introduces you before you speak.",
        "Be the energy you want to attract.",
        "What you think, you become — think good thoughts.",
        "A positive mind finds opportunity in every difficulty.",
        "Radiate positivity and watch the world respond.",
        "Good things happen to people who believe they will.",
        "Your vibe sets the tone — make it a good one.",
        "Life reflects what you expect of it.",
      ],
    },
    {
      name: "Silver Linings",
      messages: [
        "Every cloud has a silver lining — look for it.",
        "Problems are just solutions in disguise.",
        "Challenges are hidden opportunities for growth.",
        "The rain makes the flowers grow.",
        "Even detours lead somewhere interesting.",
        "A door closing is often a window opening.",
        "What seems like the end is often a new beginning.",
        "The worst days are often the ones that teach the most.",
        "Not all who wander are lost — some are discovering.",
        "Friction creates fire — and fire creates light.",
      ],
    },
    {
      name: "Today Is Good",
      messages: [
        "Today has the potential to be extraordinary.",
        "This moment is exactly where you are supposed to be.",
        "Right now is the perfect time to feel good.",
        "Something good is happening — maybe you just can't see it yet.",
        "Today is a canvas — paint it with intention.",
        "Every day above ground is a gift worth appreciating.",
        "The present moment is always the best starting point.",
        "Good is happening right now — just look around.",
        "Today will be a great story someday.",
        "This is a good day because you made it to it.",
      ],
    },
  ],
  tips: [
    {
      title: "Morning Affirmation",
      description:
        "Choose a positive quote each morning as your daily affirmation — say it aloud three times to reinforce the mindset.",
    },
    {
      title: "Gratitude Jar",
      description:
        "Write positive fortune cookie quotes on slips of paper and put them in a jar — draw one whenever you need a mood boost.",
    },
    {
      title: "Office Desk Display",
      description:
        "Print 5-7 positive quotes and rotate them on your desk display — a subtle environmental design for sustained positivity.",
    },
  ],
  faqs: [
    {
      question: "What are good positive fortune cookie messages?",
      answer:
        "Good positive fortunes are actionable and brief — 'Be the energy you want to attract' or 'Positivity is a choice you make before the day makes it for you' are both memorable and grounding.",
    },
    {
      question: "Do positive fortune cookie quotes actually work?",
      answer:
        "Research on positive priming suggests that brief positive messages can shift mood and mindset. Fortune cookie quotes work best as daily practices — one quote read mindfully, not scrolled past.",
    },
    {
      question: "What is the most popular positive fortune cookie saying?",
      answer:
        "Classic positive fortunes like 'Good things come to those who believe' and 'Your energy introduces you before you speak' are widely shared because they're universally relatable.",
    },
  ],
  relatedCategories: ["uplifting", "inspirational", "encouraging", "life"],
  group: "positive",
};

// ---------------------------------------------------------------------------
// HUMOR
// ---------------------------------------------------------------------------

const funny: QuoteData = {
  slug: "funny",
  title: "Funny Fortune Cookie Quotes",
  badge: "80+ Quotes",
  emoji: "😂",
  description:
    "Crack up your friends with the funniest fortune cookie quotes — witty, absurd, and hilariously self-aware sayings that are too good not to share.",
  metaTitle: "80+ Funny Fortune Cookie Quotes | Hilarious Sayings & Jokes",
  metaDescription:
    "Laugh out loud with 80+ funny fortune cookie quotes! Hilarious, witty & absurd sayings perfect for parties, gifts & sharing. Free to copy.",
  subcategories: [
    {
      name: "Meta & Self-Aware",
      messages: [
        "Help! I'm trapped in a fortune cookie factory!",
        "This fortune is intentionally left blank as a metaphor for your future.",
        "The fortune you seek is in another cookie.",
        "Obviously your fortune is that you are reading this fortune.",
        "Your future is uncertain — much like the person who wrote this.",
        "Error 404: fortune not found. Please break another cookie.",
        "This fortune is haunted. (Just kidding. Or is it?)",
        "You are either very hungry or very curious. Probably both.",
        "Lucky numbers: the ones you pick.",
        "The cookie was right. The fortune? We'll see.",
      ],
    },
    {
      name: "Absurd & Surreal",
      messages: [
        "Beware of a tall, dark stranger who is actually just your shadow.",
        "Someone is thinking about you. It may be your cat judging you.",
        "Your lucky color is the one you're wearing. Probably.",
        "The answer is yes — unless the answer is no.",
        "Good luck. You'll need it. Or maybe not. Fortunes are vague.",
        "A surprise awaits you. It is socks.",
        "You will soon meet a stranger. They are also a stranger to you.",
        "The stars are aligned in your favor, assuming you believe in that.",
        "Today's lucky animal: whichever one doesn't bite you.",
        "Your future is bright — wear sunglasses.",
      ],
    },
    {
      name: "Relatable Humor",
      messages: [
        "You will find true happiness — as soon as you figure out the Wi-Fi password.",
        "Your bed is calling. Loudly.",
        "Avoid unnecessary stress. Also avoid Mondays.",
        "Today's wisdom: the early bird is exhausted by noon.",
        "Great things await those who have a full battery.",
        "Your lucky number is the number of snacks currently within reach.",
        "Adventure is out there. But so is your couch.",
        "Fortune predicts: you will check your phone immediately after reading this.",
        "The universe supports your nap.",
        "Success is just around the corner — so is the snack machine.",
      ],
    },
  ],
  tips: [
    {
      title: "Party Icebreaker",
      description:
        "Use funny fortune cookies as a party icebreaker — everyone reads their fortune aloud and the room immediately warms up.",
    },
    {
      title: "Office Desk Surprise",
      description:
        "Leave a funny fortune cookie quote on a colleague's desk as a pick-me-up — it takes 10 seconds and makes someone's day.",
    },
    {
      title: "Social Media Caption",
      description:
        "Use a funny fortune cookie quote as a social media caption — they perform exceptionally well because people share what makes them laugh.",
    },
  ],
  faqs: [
    {
      question: "What are the funniest fortune cookie messages ever?",
      answer:
        "The funniest fortune cookies are meta and self-aware — 'Help! I'm trapped in a fortune cookie factory!' and 'Error 404: fortune not found. Please break another cookie.' consistently get the biggest laughs.",
    },
    {
      question: "Are funny fortune cookies appropriate for all ages?",
      answer:
        "The funny quotes above are all family-friendly and appropriate for any age group. Avoid fortune cookies with adult humor for events that include children.",
    },
    {
      question: "What makes a fortune cookie message funny?",
      answer:
        "The best funny fortunes use surprise, self-reference, absurdism, or relatable humor. The contrast between the fortune cookie's traditional sage wisdom and a completely silly message is inherently funny.",
    },
  ],
  relatedCategories: ["sarcastic", "clever", "dark-humor", "life"],
  group: "humor",
};

const sarcastic: QuoteData = {
  slug: "sarcastic",
  title: "Sarcastic Fortune Cookie Quotes",
  badge: "55+ Quotes",
  emoji: "😏",
  description:
    "For those who prefer their wisdom with an eye-roll — sarcastic fortune cookie quotes that say what everyone's thinking.",
  metaTitle: "55+ Sarcastic Fortune Cookie Quotes | Witty & Sharp",
  metaDescription:
    "Fortune cookies with attitude — 55+ sarcastic quotes that say the quiet part loud. Witty, sharp & hilariously honest. Free to copy & share.",
  subcategories: [
    {
      name: "Sarcastically Wise",
      messages: [
        "Another day, another opportunity to fake enthusiasm.",
        "Congratulations on making it this far despite everything.",
        "The secret to success is pretending you know what you're doing.",
        "You are destined for greatness. The commute will be terrible, though.",
        "Your hard work will be noticed — by the people who did none.",
        "Fortune smiles upon you. It's not a very nice smile.",
        "Good news: your potential is limitless. Bad news: so is the paperwork.",
        "You will achieve great things — right after this nap.",
        "Success is just around the corner. Unfortunately, so is another meeting.",
        "Your future is bright. Bring sunscreen and a realistic outlook.",
      ],
    },
    {
      name: "Reality Checks",
      messages: [
        "The early bird gets the worm. The second mouse gets the cheese. Choose your metaphor.",
        "Life is short. Spend less of it reading fortunes.",
        "You can't control everything. Isn't that comforting?",
        "Your lucky day is coming. It is not today.",
        "The glass is half full — of something you probably didn't want.",
        "Patience is a virtue. So is knowing when to quit.",
        "True happiness awaits. It's behind all the other stuff.",
        "Success is earned, not given. Unfortunately.",
        "Fortune favors the bold — and occasionally the moderately prepared.",
        "Change is coming. You might want to sit down.",
      ],
    },
    {
      name: "Dry Wit",
      messages: [
        "You are unique — just like everyone else.",
        "Some days you're the pigeon. Today you're the statue.",
        "The answers you seek will come. In their own time. When they feel like it.",
        "Your stars are aligned. They are aligned in a mediocre formation.",
        "Everything happens for a reason. Sometimes the reason is bad luck.",
        "Not all who wander are lost. Some are just avoiding responsibility.",
        "Good fortune awaits! (Results may vary.)",
        "Wisdom comes with age. Apparently it's taking its time with you.",
        "Your best days are ahead. Your worst also.",
        "Rise and grind. Or rise and gently shuffle. Both count.",
      ],
    },
  ],
  tips: [
    {
      title: "Gift for the Pessimist",
      description:
        "Sarcastic fortune cookies make the perfect gift for the friend who rolls their eyes at inspirational quotes — they'll appreciate the honesty.",
    },
    {
      title: "Office White Elephant",
      description:
        "A box of sarcastic fortune cookies makes an excellent office white elephant gift that everyone laughs at together.",
    },
    {
      title: "Know Your Audience",
      description:
        "Sarcastic quotes land perfectly with the right crowd. For mixed groups, pair with genuinely uplifting quotes so everyone has something they like.",
    },
  ],
  faqs: [
    {
      question: "What are sarcastic fortune cookie messages?",
      answer:
        "Sarcastic fortune cookies deliver wisdom with a wink — they acknowledge the gap between fortune cookie optimism and real life. 'Fortune smiles upon you. It's not a very nice smile.' is the genre in one sentence.",
    },
    {
      question: "Are sarcastic fortune cookies appropriate for gifts?",
      answer:
        "Yes — for the right person. Sarcastic fortune cookies are perfect for friends with a dry sense of humor, coworkers who appreciate irony, or anyone who rolls their eyes at overly positive messaging.",
    },
    {
      question: "Where can I find the best sarcastic fortune cookie sayings?",
      answer:
        "Browse the collection above, or use our AI fortune generator to create custom sarcastic fortunes tailored to a specific person, situation, or event.",
    },
  ],
  relatedCategories: ["funny", "clever", "dark-humor", "life"],
  group: "humor",
};

const darkHumor: QuoteData = {
  slug: "dark-humor",
  title: "Dark Humor Fortune Cookie Quotes",
  badge: "45+ Quotes",
  emoji: "💀",
  description:
    "For those who laugh in the face of the absurd — dark humor fortune cookie quotes that find comedy in life's bleaker truths.",
  metaTitle: "45+ Dark Humor Fortune Cookie Quotes | Darkly Funny",
  metaDescription:
    "Fortune cookies for the cynically inclined — 45+ dark humor quotes that find comedy in life's shadows. Edgy, clever & surprisingly relatable.",
  subcategories: [
    {
      name: "Existential Comedy",
      messages: [
        "Life is short. This cookie is shorter. Enjoy both.",
        "You only live once — so far.",
        "Somewhere, someone has it worse. Isn't that comforting?",
        "The universe is vast and largely indifferent. You're still having a nice day, though.",
        "Death comes for everyone. But not today, so finish the noodles.",
        "You matter. In the grand cosmic scale, briefly, but still.",
        "Everything ends eventually. This cookie. This meal. This conversation.",
        "Nothing is permanent — which is either terrifying or liberating. Pick one.",
        "The good news: you're alive. The other news: everything is complicated.",
        "Technically, things could be worse. Statistically, they often get there.",
      ],
    },
    {
      name: "Life's Absurdities",
      messages: [
        "Misfortune cookies: life doesn't always serve you what you ordered.",
        "Today's forecast: mild chaos with a chance of bewilderment.",
        "You are the hero of your story. The story has several difficult chapters.",
        "Fortune favors the bold — and occasionally enjoys watching the bold fail.",
        "Your journey is unique. Some of the roads are unpaved.",
        "They say laughter is the best medicine. Actual medicine also helps.",
        "Success is imminent. The definition of 'imminent' remains unclear.",
        "The stars were aligned — briefly, before the clouds rolled in.",
        "Plot twist incoming. You were not prepared. Nobody ever is.",
        "Good times are ahead. Also: traffic. Mostly good times.",
      ],
    },
    {
      name: "Wry Observations",
      messages: [
        "Adulting: not as advertised.",
        "Everything works out in the end. If it hasn't, it's not the end.",
        "The optimist sees the glass half full. The pessimist is still right half the time.",
        "What doesn't kill you gives you unusual anecdotes.",
        "Life is a roller coaster. You signed up for it at birth.",
        "Someone has a plan for you. They haven't told anyone.",
        "Embrace the chaos. It was going to happen anyway.",
        "The fortune you wanted was in a different cookie.",
        "Great things await those who survive long enough to see them.",
        "At least you have soup. Soup helps.",
      ],
    },
  ],
  tips: [
    {
      title: "Know Your Audience",
      description:
        "Dark humor fortune cookies are best for friends who share your sense of humor. Save them for close friends, not professional events or mixed-age family gatherings.",
    },
    {
      title: "Halloween Treat",
      description:
        "Dark humor fortune cookies are perfectly on-brand for Halloween parties — use them alongside spooky decorations for maximum effect.",
    },
    {
      title: "Adult Party Favor",
      description:
        "For adults-only gatherings, dark humor fortune cookies make a memorable party favor that gets people talking and laughing.",
    },
  ],
  faqs: [
    {
      question: "What are dark humor fortune cookie messages?",
      answer:
        "Dark humor fortunes find comedy in existential, absurd, or uncomfortably honest aspects of life. The best ones make you laugh and then immediately think — 'Life is short. This cookie is shorter. Enjoy both.'",
    },
    {
      question: "Are dark humor fortune cookies appropriate?",
      answer:
        "Dark humor is highly audience-dependent. These messages are for adults who enjoy irony and existential comedy — not for children, sensitive situations, or professional events.",
    },
    {
      question: "What's the difference between sarcastic and dark humor fortune cookies?",
      answer:
        "Sarcastic fortunes critique situations with irony; dark humor fortunes engage with heavier themes (mortality, chaos, absurdity) and find comedy in them. Both require a good sense of humor.",
    },
  ],
  relatedCategories: ["funny", "sarcastic", "clever", "life"],
  group: "humor",
};

const clever: QuoteData = {
  slug: "clever",
  title: "Clever Fortune Cookie Quotes",
  badge: "55+ Quotes",
  emoji: "🧠",
  description:
    "Outwit the ordinary with clever fortune cookie quotes that are smart, witty, and just unexpected enough to make you think twice.",
  metaTitle: "55+ Clever Fortune Cookie Quotes | Witty & Smart",
  metaDescription:
    "Discover 55+ clever fortune cookie quotes! Smart, witty & surprisingly profound sayings that make you laugh and think at the same time.",
  subcategories: [
    {
      name: "Wordplay & Wit",
      messages: [
        "Time flies — you are the pilot.",
        "The pen is mightier than the sword, but harder to find on your desk.",
        "Think outside the cookie.",
        "The early bird gets the worm. Worms prefer sleeping in.",
        "Two roads diverged in a wood — the traffic on both was terrible.",
        "Knowledge is power — power requires responsibility — no pressure.",
        "A rolling stone gathers no moss, but does build momentum.",
        "You can't make everyone happy. You are not a fortune cookie. Wait.",
        "The road less traveled still has road construction.",
        "Curiosity killed the cat — but satisfaction brought it back.",
      ],
    },
    {
      name: "Paradox & Irony",
      messages: [
        "The more you know, the more you know you don't know.",
        "Be yourself — unless you can be a dragon. Then be a dragon.",
        "To err is human; to blame it on autocorrect is modern.",
        "The best plans are the ones that survive contact with reality.",
        "Overthinking: the art of solving problems you haven't had yet.",
        "Procrastinate wisely — the problems you avoid often solve themselves.",
        "The answer you're looking for is probably simpler than you think.",
        "The best time to do something is after you've thought about it for exactly the right amount of time.",
        "Simplicity is the ultimate sophistication — and very hard to achieve.",
        "The map is not the territory, and the fortune is not the future.",
      ],
    },
    {
      name: "Sharp Observations",
      messages: [
        "You are what you repeatedly do — which explains a lot.",
        "The secret of getting ahead is getting started — then not stopping.",
        "Every expert was once a disaster. Keep going.",
        "Wisdom: knowing what to overlook.",
        "Confidence is silent. Insecurity is loud.",
        "Assumptions make us all look foolish eventually.",
        "The person who says it cannot be done should not interrupt the one doing it.",
        "Talent without discipline is a rough draft.",
        "Speak clearly if you speak at all — carve every word before you let it fall.",
        "Luck is preparation meeting a moment it was ready for.",
      ],
    },
  ],
  tips: [
    {
      title: "Conversation Starter",
      description:
        "Share a clever fortune cookie quote to start a dinner conversation — the paradoxical ones especially get people debating and laughing.",
    },
    {
      title: "Email Signature",
      description:
        "Rotate clever fortune cookie quotes in your email signature — a subtle way to show personality without being unprofessional.",
    },
    {
      title: "Brainstorm Opener",
      description:
        "Open a creative brainstorming session with a clever quote to shift everyone into lateral thinking mode.",
    },
  ],
  faqs: [
    {
      question: "What are clever fortune cookie messages?",
      answer:
        "Clever fortunes use wordplay, paradox, or sharp observation to deliver insight with a twist — 'Think outside the cookie' or 'The more you know, the more you know you don't know' are classic examples.",
    },
    {
      question: "How are clever fortune cookies different from funny ones?",
      answer:
        "Funny fortunes prioritize the laugh; clever fortunes prioritize the insight that also makes you smile. Clever messages often have a layer of truth that makes you stop and think.",
    },
    {
      question: "What makes a fortune cookie message clever?",
      answer:
        "Wordplay, subverted expectations, paradox, or a familiar phrase with an unexpected twist. The best clever fortunes feel obvious in hindsight but surprising when you first read them.",
    },
  ],
  relatedCategories: ["funny", "sarcastic", "philosophical", "wisdom"],
  group: "humor",
};

// ---------------------------------------------------------------------------
// REFLECTIVE / LIFE
// ---------------------------------------------------------------------------

const deep: QuoteData = {
  slug: "deep",
  title: "Deep Fortune Cookie Quotes",
  badge: "60+ Quotes",
  emoji: "🌊",
  description:
    "Explore profound fortune cookie quotes that go beyond the surface — deep, thought-provoking sayings that stay with you long after you've eaten the cookie.",
  metaTitle: "60+ Deep Fortune Cookie Quotes | Profound & Thought-Provoking",
  metaDescription:
    "Dive deeper with 60+ profound fortune cookie quotes! Thought-provoking, meaningful sayings that make you think, reflect & see things differently.",
  subcategories: [
    {
      name: "On Life",
      messages: [
        "The meaning of life is whatever you ascribe to it.",
        "Life is not what happens to you — it's what you do with what happens.",
        "Every person you meet is fighting a battle you know nothing about.",
        "You are both the problem and the solution.",
        "The self you are tomorrow is shaped by the choices you make today.",
        "What you resist persists. What you accept transforms.",
        "Life is the art of drawing sufficient conclusions from insufficient premises.",
        "You cannot step into the same river twice — because neither you nor the river is the same.",
        "The unexamined life is not worth living. But neither is the over-examined one.",
        "Between stimulus and response, there is space. In that space lies your freedom.",
      ],
    },
    {
      name: "On Self",
      messages: [
        "Know yourself — it is the beginning of all wisdom.",
        "You are not your thoughts; you are the awareness behind them.",
        "The cave you fear to enter holds the treasure you seek.",
        "What you seek is seeking you.",
        "Your shadow is the part of you that needs the most love.",
        "The self is not something you find — it's something you create.",
        "Most of your suffering comes from the story you tell about your pain.",
        "Your inner world creates your outer world.",
        "The longest journey is from your head to your heart.",
        "You cannot pour from an empty cup — fill yours first.",
      ],
    },
    {
      name: "On Time & Change",
      messages: [
        "Impermanence is not a problem to be solved — it's the nature of everything.",
        "The present moment is the only time over which we have dominion.",
        "Change is the only constant. Make peace with it.",
        "The past is a story. The future is a dream. Now is real.",
        "Nothing is permanent — not even your problems.",
        "Time does not heal all wounds. Attention does.",
        "The clock is running. Use your time well.",
        "What you are is what you have been. What you will be is what you do now.",
        "We do not remember days; we remember moments.",
        "The future belongs to those who prepare for it today.",
      ],
    },
  ],
  tips: [
    {
      title: "Meditation Contemplation",
      description:
        "Choose a deep quote and sit with it for 5 minutes during meditation — let it surface questions or insights without forcing answers.",
    },
    {
      title: "Philosophical Discussion",
      description:
        "Use a deep fortune cookie quote to start a philosophical conversation with friends — 'What you resist persists' can spark a fascinating discussion.",
    },
    {
      title: "Writing Prompt",
      description:
        "Use a deep quote as a creative writing or journaling prompt — explore what it means to you, where you agree or disagree, and why.",
    },
  ],
  faqs: [
    {
      question: "What are deep fortune cookie messages?",
      answer:
        "Deep fortune cookies go beyond surface positivity — they engage with philosophical, psychological, or existential themes. 'Between stimulus and response, there is space. In that space lies your freedom' is a deep fortune.",
    },
    {
      question: "What makes a fortune cookie quote profound?",
      answer:
        "Profound quotes contain a truth that resonates differently each time you encounter it, depending on where you are in life. They invite reflection rather than just motivation.",
    },
    {
      question: "Are deep fortune cookies good gifts?",
      answer:
        "Yes — for thoughtful, reflective people. Deep fortune cookies are especially meaningful for milestones like graduations, milestone birthdays, or life transitions when people are naturally reflective.",
    },
  ],
  relatedCategories: ["philosophical", "wisdom", "life", "meaningful"],
  group: "reflective",
};

const philosophical: QuoteData = {
  slug: "philosophical",
  title: "Philosophical Fortune Cookie Quotes",
  badge: "55+ Quotes",
  emoji: "🤔",
  description:
    "Ponder the big questions with philosophical fortune cookie quotes inspired by centuries of wisdom, from Stoics to Zen masters.",
  metaTitle: "55+ Philosophical Fortune Cookie Quotes | Ancient Wisdom",
  metaDescription:
    "Explore 55+ philosophical fortune cookie quotes! Timeless wisdom from Stoics, Zen masters & great thinkers distilled into one perfect sentence.",
  subcategories: [
    {
      name: "Stoic Wisdom",
      messages: [
        "We suffer more in imagination than in reality.",
        "You have power over your mind, not outside events. Realize this.",
        "Do not seek for events to happen as you wish, but wish events to happen as they do.",
        "The impediment to action advances action. What stands in the way becomes the way.",
        "Man is disturbed not by events, but by his opinion of events.",
        "Waste no more time arguing what a good person should be. Be one.",
        "It is not what happens to you, but how you react to it that matters.",
        "First say to yourself what you would be; then do what you have to do.",
        "He who fears death will never do anything worthy of a living man.",
        "The whole future lies in uncertainty. Live immediately.",
      ],
    },
    {
      name: "Zen & Eastern Thought",
      messages: [
        "The obstacle is the path.",
        "Before enlightenment, chop wood, carry water. After enlightenment, chop wood, carry water.",
        "When you realize there is nothing lacking, the whole world belongs to you.",
        "The finger pointing at the moon is not the moon.",
        "Not knowing is most intimate.",
        "If you are present in this moment, you miss nothing.",
        "Everything is as it should be — even the parts that hurt.",
        "The master sees nothing as a problem, only as a situation.",
        "Do not seek the truth. Only cease to cherish opinions.",
        "Water is soft and humble, yet it shapes every stone it touches.",
      ],
    },
    {
      name: "Existential & Modern",
      messages: [
        "Existence precedes essence — you define yourself through your choices.",
        "The unexamined life is not worth living.",
        "Hell is other people — and also traffic.",
        "Man is condemned to be free.",
        "In the middle of difficulty lies opportunity.",
        "We are what we repeatedly do. Excellence is a habit.",
        "The only true wisdom is in knowing you know nothing.",
        "One cannot think well, love well, sleep well, if one has not dined well.",
        "The purpose of life is to live it fully.",
        "Life can only be understood backwards; but it must be lived forwards.",
      ],
    },
  ],
  tips: [
    {
      title: "Philosophy Book Club Opener",
      description:
        "Open a book club or philosophy discussion group with a fortune cookie quote — it sets the intellectual tone and gets everyone thinking.",
    },
    {
      title: "Question Mark It",
      description:
        "Instead of accepting a philosophical quote as truth, turn it into a question: 'Is the obstacle really the path? When, and when not?'",
    },
    {
      title: "Daily Practice",
      description:
        "Pick one philosophical quote per week and live by it — notice where it rings true and where it breaks down. Philosophy is best learned by doing.",
    },
  ],
  faqs: [
    {
      question: "What are philosophical fortune cookie messages?",
      answer:
        "Philosophical fortunes draw from Stoic, Zen, Existentialist, or classic Western philosophy — distilling complex ideas into memorable single sentences like 'The impediment to action advances action.'",
    },
    {
      question: "Which philosophers are most quoted in fortune cookies?",
      answer:
        "Stoics (Marcus Aurelius, Epictetus, Seneca), Zen masters (Laozi, Zhuangzi), and modern philosophers (Sartre, Nietzsche, Wittgenstein) provide the most quotable material for thoughtful fortune cookies.",
    },
    {
      question: "How do philosophical fortune cookies differ from deep ones?",
      answer:
        "Deep quotes evoke emotion and personal reflection; philosophical quotes engage with specific schools of thought or frameworks. Philosophical fortunes are more structured in their wisdom tradition.",
    },
  ],
  relatedCategories: ["deep", "wisdom", "meaningful", "life"],
  group: "reflective",
};

const meaningful: QuoteData = {
  slug: "meaningful",
  title: "Meaningful Fortune Cookie Quotes",
  badge: "55+ Quotes",
  emoji: "💫",
  description:
    "Find real significance in these meaningful fortune cookie quotes — words that carry weight, invite reflection, and land in the heart.",
  metaTitle: "55+ Meaningful Fortune Cookie Quotes | Profound & Significant",
  metaDescription:
    "Discover 55+ meaningful fortune cookie quotes with real depth and significance. Profound sayings that stick with you. Free to copy & share.",
  subcategories: [
    {
      name: "Purpose & Meaning",
      messages: [
        "The purpose of life is a life of purpose.",
        "What we do for ourselves dies with us. What we do for others is eternal.",
        "Find what you love and let it consume you — wisely.",
        "A life well-lived is measured in moments of meaning, not minutes.",
        "Your why is stronger than any how.",
        "Service to others is the rent you pay for your room here on earth.",
        "Meaning is not found — it is made.",
        "The things that matter most must never be at the mercy of things that matter least.",
        "You make a living by what you get; you make a life by what you give.",
        "Leave every room — and every relationship — better than you found it.",
      ],
    },
    {
      name: "Connection & Love",
      messages: [
        "The most important thing in life is the quality of your connections.",
        "Love is the only thing that multiplies when you give it away.",
        "We are at our best when we are for someone other than ourselves.",
        "What is done in love is done well.",
        "Wherever you are, be fully there.",
        "The greatest gift you can give someone is your full attention.",
        "Kindness is a language the deaf can hear and the blind can see.",
        "Small acts of kindness are never small.",
        "Be someone's reason to believe in goodness today.",
        "The best inheritance you can leave is the memory of who you were.",
      ],
    },
    {
      name: "Legacy & Impact",
      messages: [
        "In a hundred years, what will matter is the lives you touched.",
        "The measure of a person is how they treat someone who can do nothing for them.",
        "Not all of us can do great things — but we can do small things with great love.",
        "Your legacy is the sum of your smallest daily choices.",
        "The ripple you create today may be the wave that changes someone's tomorrow.",
        "To plant a tree is to believe in tomorrow.",
        "How you make people feel is what they remember.",
        "Character is doing the right thing when nobody is watching.",
        "Live in such a way that those who know you but don't know you would love you.",
        "The best time to make a difference was ten years ago. The second best time is now.",
      ],
    },
  ],
  tips: [
    {
      title: "Milestone Gift",
      description:
        "A meaningful fortune cookie quote makes a perfect addition to a milestone gift — graduation, anniversary, retirement — when words need weight.",
    },
    {
      title: "Legacy Letter",
      description:
        "Use meaningful quotes as anchors for a 'legacy letter' — a letter you write to a child or future self about what matters most.",
    },
    {
      title: "Eulogy Reference",
      description:
        "When writing a eulogy or tribute, meaningful fortune cookie quotes can beautifully capture what made a person's life significant.",
    },
  ],
  faqs: [
    {
      question: "What are meaningful fortune cookie messages?",
      answer:
        "Meaningful fortunes carry genuine weight — they speak to purpose, love, connection, and legacy. 'What we do for ourselves dies with us. What we do for others is eternal' is a meaningful fortune.",
    },
    {
      question: "How are meaningful fortune cookies different from inspirational ones?",
      answer:
        "Inspirational fortunes energize and motivate; meaningful ones invite you to reflect on what truly matters. Meaningful quotes are less about doing and more about being.",
    },
    {
      question: "When should I use meaningful fortune cookie quotes?",
      answer:
        "Meaningful quotes are perfect for milestone moments — graduations, anniversaries, funerals, retirement — when the occasion calls for more than celebration.",
    },
  ],
  relatedCategories: ["deep", "philosophical", "life", "encouraging"],
  group: "reflective",
};

const life: QuoteData = {
  slug: "life",
  title: "Fortune Cookie Quotes About Life",
  badge: "70+ Quotes",
  emoji: "🌱",
  description:
    "Navigate the beautiful, complicated journey of life with fortune cookie quotes that capture its wisdom, wonder, and occasional absurdity.",
  metaTitle: "70+ Fortune Cookie Quotes About Life | Wisdom for Every Stage",
  metaDescription:
    "Discover 70+ fortune cookie quotes about life! Wise, relatable & profound sayings for every stage and situation in life. Free to copy & share.",
  subcategories: [
    {
      name: "Life's Lessons",
      messages: [
        "Life doesn't get easier — you get stronger.",
        "The most valuable lessons are rarely the most comfortable ones.",
        "Everything you've ever wanted is on the other side of fear.",
        "You grow the most in the places that were the hardest to be.",
        "Not all who wander are lost — some are discovering the scenic route.",
        "The best teachers are often the worst experiences.",
        "Mistakes are proof that you're trying.",
        "Regret is the heaviest bag you'll ever carry.",
        "The lessons you resist are the ones you most need.",
        "Life is the teacher; you are always the student.",
      ],
    },
    {
      name: "Life's Simple Truths",
      messages: [
        "The best things in life are free — and hard to appreciate until they're not.",
        "Most of the things you worry about never happen.",
        "The people who love you will find a way to reach you.",
        "You can't go back and change the beginning, but you can start now and change the ending.",
        "The smallest act of kindness is worth more than the greatest intention.",
        "Hard work beats talent when talent doesn't work hard.",
        "Your attitude determines your direction.",
        "Life is 10% what happens to you and 90% how you respond.",
        "The only failure in life is the failure to try.",
        "Good relationships are built, not found.",
      ],
    },
    {
      name: "Life's Wonder",
      messages: [
        "Life is made of moments — collect the beautiful ones.",
        "Pay attention. The best moments are hiding in the ordinary.",
        "Slow down. The best things in life require presence, not speed.",
        "Ordinary days are extraordinary upon reflection.",
        "Life is a collection of tiny miracles.",
        "The beauty of life is in its variety.",
        "Savor the moment you're in — it won't come again.",
        "Some of the best days of your life haven't happened yet.",
        "Life is richer when you're paying attention.",
        "The extraordinary lives inside the ordinary — look closely.",
      ],
    },
  ],
  tips: [
    {
      title: "Life Stages Gifting",
      description:
        "Fortune cookie quotes about life are universally applicable — perfect gifts at any life stage: 18, 30, 40, 50, retirement, or recovery.",
    },
    {
      title: "Journaling Prompt",
      description:
        "Pick a life quote that resonates and write for 10 minutes about how it applies to your current chapter. You'll be surprised by what surfaces.",
    },
    {
      title: "Family Table Tradition",
      description:
        "Read a 'fortune for the day' aloud at dinner — a simple tradition that sparks genuine conversation across generations.",
    },
  ],
  faqs: [
    {
      question: "What are the best fortune cookie quotes about life?",
      answer:
        "The best life quotes are both universal and personal — 'Life doesn't get easier — you get stronger' or 'Some of the best days of your life haven't happened yet' resonate across ages and circumstances.",
    },
    {
      question: "How do fortune cookie quotes relate to real life advice?",
      answer:
        "Fortune cookie quotes distill real wisdom into memorable phrases. The best ones echo advice from psychologists, philosophers, and great thinkers — presented in a format anyone can absorb.",
    },
    {
      question: "What makes a great fortune cookie quote about life?",
      answer:
        "Great life quotes are short enough to memorize, true enough to apply, and surprising enough to stop you mid-bite. They say something you already sensed but hadn't articulated.",
    },
  ],
  relatedCategories: ["deep", "meaningful", "philosophical", "inspirational"],
  group: "life",
};

const shortQuotes: QuoteData = {
  slug: "short",
  title: "Short Fortune Cookie Quotes",
  badge: "80+ Quotes",
  emoji: "✏️",
  description:
    "Sometimes less is more — discover the most powerful short fortune cookie quotes that pack maximum wisdom into minimum words.",
  metaTitle: "80+ Short Fortune Cookie Quotes | Brief & Powerful",
  metaDescription:
    "Find the perfect short fortune cookie quote — 80+ brief, memorable sayings that pack maximum wisdom into minimum words. Free to copy & share.",
  subcategories: [
    {
      name: "Inspiring One-Liners",
      messages: [
        "Begin.",
        "Persist.",
        "Do the thing.",
        "Be brave today.",
        "Now is enough.",
        "Keep going.",
        "You've got this.",
        "Start before ready.",
        "Believe more.",
        "Act. Now.",
        "Dream bigger.",
        "Stay curious.",
        "Show up.",
        "Trust the process.",
        "Make it count.",
      ],
    },
    {
      name: "Wise & Concise",
      messages: [
        "Kindness wins.",
        "Choose joy.",
        "Less is more.",
        "Presence is the gift.",
        "Earn it daily.",
        "Progress, not perfection.",
        "Gratitude opens doors.",
        "Silence speaks volumes.",
        "Time is the gift.",
        "Love more. Judge less.",
        "Be the change.",
        "Patience pays.",
        "Truth first.",
        "Enough is enough.",
        "Today counts.",
      ],
    },
    {
      name: "Funny Shorties",
      messages: [
        "Sleep more.",
        "Eat the cake.",
        "Coffee first.",
        "Nap incoming.",
        "No.",
        "Maybe tomorrow.",
        "Good luck.",
        "¯\\_(ツ)_/¯",
        "This is fine.",
        "Not today.",
        "Try again.",
        "More soup.",
        "Delete it.",
        "Breathe.",
        "Same.",
      ],
    },
  ],
  tips: [
    {
      title: "Social Media Caption",
      description:
        "Short fortune cookie quotes make perfect social media captions — they're punchy, shareable, and look great with any photo.",
    },
    {
      title: "Text Message Encouragement",
      description:
        "Send a short fortune cookie quote to a friend who needs a boost — 'You've got this.' with nothing else is often more powerful than a paragraph.",
    },
    {
      title: "Phone Lock Screen",
      description:
        "Set a short quote as your phone lock screen wallpaper — you'll read it dozens of times a day without even thinking about it.",
    },
  ],
  faqs: [
    {
      question: "What are the shortest fortune cookie quotes?",
      answer:
        "The shortest fortunes are often the most powerful — single words like 'Begin.' or 'Persist.' or two-word phrases like 'Kindness wins.' pack surprising impact because they leave room for your own interpretation.",
    },
    {
      question: "What makes a short fortune cookie quote memorable?",
      answer:
        "Memorable short quotes use strong, specific words — not vague abstractions. 'Do the thing.' is memorable; 'Take action toward your goals' is forgettable. Brevity forces precision.",
    },
    {
      question: "Where can I use short fortune cookie quotes?",
      answer:
        "Short quotes are perfect for social media captions, phone lock screens, text messages, greeting cards, sticky notes, email signatures, and anywhere else words need to be few but powerful.",
    },
  ],
  relatedCategories: ["inspirational", "funny", "clever", "positive"],
  group: "humor",
};

// ---------------------------------------------------------------------------
// RELATIONSHIPS
// ---------------------------------------------------------------------------

const love: QuoteData = {
  slug: "love",
  title: "Love Fortune Cookie Quotes",
  badge: "65+ Quotes",
  emoji: "❤️",
  description:
    "Celebrate all forms of love with fortune cookie quotes that capture the beauty, complexity, and joy of loving and being loved.",
  metaTitle: "65+ Love Fortune Cookie Quotes | Romantic & Heartfelt",
  metaDescription:
    "Find the perfect love fortune cookie quote — 65+ romantic, heartfelt & timeless sayings about love in all its forms. Free to copy & share.",
  subcategories: [
    {
      name: "Romantic Love",
      messages: [
        "You are the reason I believe in love.",
        "In all the world, there is no heart for me like yours.",
        "True love is not found — it is built, moment by moment.",
        "You are the chapter in my story I never want to end.",
        "I would choose you in a hundred lifetimes.",
        "Meeting you was fate; falling for you was my favorite choice.",
        "Love is not about finding the right person, but creating the right relationship.",
        "You are my favorite adventure and my greatest comfort.",
        "The best love is the one that makes you a better person without changing who you are.",
        "Loving you is the best thing I've ever done.",
      ],
    },
    {
      name: "Self-Love",
      messages: [
        "You cannot give love well to others until you give it to yourself.",
        "Be your own best friend first.",
        "Self-love is not selfish — it's essential.",
        "You deserve the love you so freely give to others.",
        "The relationship you have with yourself sets the tone for every other relationship.",
        "Loving yourself is the greatest revolution.",
        "You are worthy of love exactly as you are — right now.",
        "Treat yourself as you would the person you love most.",
        "You are enough. You have always been enough.",
        "Filling your own cup is not selfishness — it's survival.",
      ],
    },
    {
      name: "Timeless Love Wisdom",
      messages: [
        "The best thing to hold onto in life is each other.",
        "Love multiplies when it is given away.",
        "To love and be loved is to feel the sun from both sides.",
        "The greatest happiness in life is knowing you are loved for who you are.",
        "Love is not just looking at each other — it's looking in the same direction.",
        "Where there is great love, there are always wishes.",
        "Love is the bridge between you and everything.",
        "A loving heart is the truest wisdom.",
        "Love given freely returns multiplied.",
        "The capacity to love is humanity's greatest gift.",
      ],
    },
  ],
  tips: [
    {
      title: "Valentine's Day Card",
      description:
        "Use a love fortune cookie quote as the centerpiece of a handwritten Valentine's card — more meaningful than any store-bought sentiment.",
    },
    {
      title: "Anniversary Toast",
      description:
        "Open an anniversary toast with a love fortune cookie quote — it sets a warm, celebratory tone before your personal words.",
    },
    {
      title: "Love Note Jar",
      description:
        "Write love fortune cookie quotes on slips of paper and put them in a jar — your partner can draw one whenever they need a reminder.",
    },
  ],
  faqs: [
    {
      question: "What are the best love fortune cookie quotes?",
      answer:
        "The best love fortunes capture the universal experience of love in fresh language — 'You are the chapter in my story I never want to end' or 'Love is not found — it is built, moment by moment.'",
    },
    {
      question: "What are self-love fortune cookie quotes?",
      answer:
        "Self-love fortunes affirm your worth and remind you to care for yourself — 'You deserve the love you so freely give to others' or 'You are enough. You have always been enough.'",
    },
    {
      question: "How can I use love fortune cookie quotes for Valentine's Day?",
      answer:
        "Use love quotes in cards, as table decorations, tucked into gifts, or as a surprise inside a custom fortune cookie. They also make beautiful toasts and social media captions.",
    },
  ],
  relatedCategories: ["inspirational", "meaningful", "uplifting", "positive"],
  group: "relationship",
};

const goodLuck: QuoteData = {
  slug: "good-luck",
  title: "Good Luck Fortune Cookie Quotes",
  badge: "50+ Quotes",
  emoji: "🍀",
  description:
    "Send fortune your way with good luck fortune cookie quotes that celebrate serendipity, preparation, and the magic of believing in your own fortune.",
  metaTitle: "50+ Good Luck Fortune Cookie Quotes | Lucky Sayings",
  metaDescription:
    "Attract good fortune with 50+ good luck fortune cookie quotes! Lucky, hopeful & motivating sayings for any new beginning. Free to copy & share.",
  subcategories: [
    {
      name: "You Make Your Luck",
      messages: [
        "Luck is preparation meeting opportunity.",
        "The harder you work, the luckier you get.",
        "Fortune favors the prepared mind.",
        "Luck is not something you have — it's something you create.",
        "Opportunity dances with those already on the floor.",
        "The luckiest people are the ones who show up consistently.",
        "Good luck follows those who stay ready.",
        "Luck is when preparation shakes hands with opportunity.",
        "Your good luck is your readiness meeting the right moment.",
        "Make your own luck — work for it daily.",
      ],
    },
    {
      name: "Classic Lucky Fortunes",
      messages: [
        "Good luck is on your side today.",
        "The stars have aligned in your favor.",
        "Fortune smiles upon those who believe in it.",
        "Good things are coming — be ready to receive them.",
        "This is your lucky day.",
        "A windfall of fortune approaches.",
        "Expect the unexpected — and expect it to be wonderful.",
        "The universe conspires in favor of those who believe.",
        "You are luckier than you know.",
        "A serendipitous encounter awaits — stay open.",
      ],
    },
    {
      name: "Good Luck for New Beginnings",
      messages: [
        "New beginnings carry their own kind of luck.",
        "Every fresh start is an invitation for good fortune.",
        "Today's first step is tomorrow's lucky break.",
        "The best luck is a new beginning taken boldly.",
        "May every new door you open lead somewhere wonderful.",
        "Fresh starts attract fresh fortune.",
        "Begin with belief and luck tends to follow.",
        "Courage is the beginning of all good luck.",
        "Your best fortune comes from your boldest moves.",
        "New chapter, new fortune — go write it.",
      ],
    },
  ],
  tips: [
    {
      title: "Pre-Exam or Interview",
      description:
        "Read a good luck fortune cookie quote before a big exam, job interview, or presentation — a small ritual that builds confidence.",
    },
    {
      title: "New Job Send-Off",
      description:
        "Include a good luck fortune cookie in a card for someone starting a new job or moving to a new city — a sweet symbolic wish.",
    },
    {
      title: "Sports Event Motivation",
      description:
        "Share good luck fortunes with teammates before a game or competition — a fun team ritual that builds shared energy.",
    },
  ],
  faqs: [
    {
      question: "What are good luck fortune cookie messages?",
      answer:
        "Good luck fortunes range from classic wishes ('This is your lucky day') to wisdom about creating luck ('The harder you work, the luckier you get'). The best combine hope with agency.",
    },
    {
      question: "What do you say in a fortune cookie for good luck?",
      answer:
        "Wish for a specific outcome ('May every door you open lead somewhere wonderful'), affirm their readiness ('Luck favors the prepared'), or simply state 'Good luck is on your side today.'",
    },
    {
      question: "Are fortune cookies actually good luck?",
      answer:
        "Culturally, fortune cookies are associated with good luck and positive prediction. The act of reading a positive fortune creates a small psychological boost — optimism that can become self-fulfilling.",
    },
  ],
  relatedCategories: ["inspirational", "positive", "motivational", "encouraging"],
  group: "positive",
};

// ---------------------------------------------------------------------------
// MAIN EXPORT
// ---------------------------------------------------------------------------

export const quotes: QuoteData[] = [
  // Positive & Uplifting
  inspirational,
  motivational,
  encouraging,
  uplifting,
  positive,
  goodLuck,
  // Humor
  funny,
  sarcastic,
  darkHumor,
  clever,
  shortQuotes,
  // Reflective / Life
  deep,
  philosophical,
  meaningful,
  life,
  // Relationship
  love,
];

/**
 * Get a single quote category by slug
 */
export function getQuoteCategory(slug: string): QuoteData | undefined {
  return quotes.find((q) => q.slug === slug);
}

/**
 * Get all quote category slugs (for generateStaticParams)
 */
export function getAllQuoteSlugs(): string[] {
  return quotes.map((q) => q.slug);
}

/**
 * Get quote categories by group
 */
export function getQuotesByGroup(group: QuoteData["group"]): QuoteData[] {
  return quotes.filter((q) => q.group === group);
}

/**
 * Get total message count for a quote category
 */
export function getQuoteMessageCount(slug: string): number {
  const category = getQuoteCategory(slug);
  if (!category) return 0;
  return category.subcategories.reduce(
    (total, sub) => total + sub.messages.length,
    0,
  );
}

export { quotes as quotesDatabase };
