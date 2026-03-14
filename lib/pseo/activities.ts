/**
 * Template D: Fortune Cookie Ideas for [Activity]
 * Powers: /fortune-cookie-ideas/[activity]
 * 15 activities across 4 groups
 */

export interface ActivitySubcategory {
  name: string;
  messages: string[];
}

export interface ActivityTip {
  title: string;
  description: string;
}

export interface ActivityFAQ {
  question: string;
  answer: string;
}

export interface ActivityData {
  slug: string;
  title: string;
  badge: string;
  emoji: string;
  description: string;
  metaTitle: string;
  metaDescription: string;
  subcategories: ActivitySubcategory[];
  tips: ActivityTip[];
  faqs: ActivityFAQ[];
  relatedActivities: string[];
  group: "entertaining" | "educational" | "creative" | "professional";
}

export const activitiesDatabase: ActivityData[] = [
  // ─────────────────────────────────────────────
  // GROUP: entertaining
  // ─────────────────────────────────────────────
  {
    slug: "dinner-parties",
    title: "Dinner Parties",
    badge: "Party Hosting",
    emoji: "🍽️",
    description: "Fortune cookie messages to delight your dinner party guests",
    metaTitle: "50+ Fortune Cookie Ideas for Dinner Parties | Dinner Party Fortune Messages",
    metaDescription: "Elevate your dinner party with creative fortune cookie ideas! Witty, elegant, and fun messages your guests will love. Perfect icebreakers for any dinner gathering.",
    subcategories: [
      {
        name: "Witty & Elegant",
        messages: [
          "The best conversations happen over the best food. You're already halfway there.",
          "Tonight's table is a universe of its own — explore every dish.",
          "A dinner party is the art of turning strangers into friends and friends into family.",
          "The secret ingredient in every great meal is the company around the table.",
          "Save room for dessert — and for the memories you're making right now.",
          "Life is uncertain. Eat the fancy appetizer first.",
          "A good host prepares the food; a great host prepares the atmosphere.",
          "The finest wines and the finest conversations have one thing in common: they both improve with time.",
          "Tonight's meal will be forgotten, but tonight's laughter will not.",
          "Every dinner party is a small act of civilization.",
        ],
      },
      {
        name: "Icebreaker Fun",
        messages: [
          "Share your most embarrassing cooking disaster before dessert arrives.",
          "Before you leave tonight, teach someone at this table something new.",
          "Your dinner partner has a hidden talent. Ask them about it.",
          "The person to your left owes you a compliment. Collect now.",
          "Challenge: say something kind about every person at this table before the night ends.",
          "Your fortune: you will attempt a new recipe this week. It will be interesting.",
          "The stars predict a lively debate about the best cuisine in the world. Begin.",
          "Propose a toast to the most underrated dish you've ever eaten.",
          "You are hereby challenged to describe this meal using only adjectives.",
          "Your mission: make the quietest person at the table laugh before dinner ends.",
        ],
      },
      {
        name: "Gratitude & Connection",
        messages: [
          "Gratitude is the seasoning that makes every meal taste better.",
          "The hands that prepared this food did so with love. Honor them.",
          "You have been seated next to exactly the right person tonight.",
          "This table holds more wisdom than any library. Tap into it.",
          "A shared meal is a shared story. What chapter are you writing tonight?",
          "The richest table is not the one with the most dishes, but the most laughter.",
          "Tonight, put the phone down and feast on conversation.",
          "Something wonderful is about to happen at this table. Pay attention.",
          "The people gathered here are the greatest gift of the evening.",
          "Tomorrow you'll remember the conversation, not the menu.",
        ],
      },
    ],
    tips: [
      {
        title: "Place fortunes under dessert plates",
        description: "Tuck fortune cookie messages under dessert plates for a magical reveal at the end of the meal — it creates a perfect conversation starter for the final course.",
      },
      {
        title: "Customize messages to your guests",
        description: "Write personalized fortunes for each guest based on something you know about them. This personal touch makes the experience unforgettable.",
      },
      {
        title: "Use fortunes as seating card themes",
        description: "Print a fortune on each seating card so guests discover their message as they find their seat — sets a fun, curious tone for the entire evening.",
      },
    ],
    faqs: [
      {
        question: "How many fortune cookie messages do I need for a dinner party?",
        answer: "Plan for 2-3 fortunes per guest — one for the start as an icebreaker, one at dessert, and optionally a take-home message. For a party of 10, prepare 20-30 unique messages.",
      },
      {
        question: "Can I use the same fortunes for every guest?",
        answer: "You can! Many hosts print the same set of messages and let guests pick randomly from a bowl. But personalized fortunes make the evening extra special and memorable.",
      },
      {
        question: "What's the best time to reveal fortune cookie messages at a dinner party?",
        answer: "The sweet spot is after the main course and before dessert — guests are relaxed, conversation is flowing, and the fortune becomes a natural bridge to dessert.",
      },
    ],
    relatedActivities: ["game-night", "gift-baskets", "ice-breakers", "care-packages"],
    group: "entertaining" as const,
  },
  {
    slug: "game-night",
    title: "Game Night",
    badge: "Game Night Fun",
    emoji: "🎲",
    description: "Fortune cookie ideas that add magic to your game night",
    metaTitle: "50+ Fortune Cookie Ideas for Game Night | Game Night Fortune Messages",
    metaDescription: "Level up your game night with fun fortune cookie messages! Playful predictions, friendly challenges, and hilarious twists to add to any board game or card night.",
    subcategories: [
      {
        name: "Playful Predictions",
        messages: [
          "Tonight, the dice will roll in your favor — eventually.",
          "The cards you're dealt tonight are not the cards you'll be holding at the end.",
          "Your strategy is brilliant. Unfortunately, so is everyone else's.",
          "A great victory is coming. The question is: for whom?",
          "You will make an alliance tonight that you will immediately regret.",
          "Fortune favors the bold — and the player who reads the rulebook.",
          "Someone at this table is bluffing. It might be you.",
          "The longest game of the night will also be the most memorable.",
          "Your lucky number tonight is… whatever you don't roll.",
          "You are one clever move away from either triumph or disaster. Choose wisely.",
        ],
      },
      {
        name: "Friendly Challenges",
        messages: [
          "Challenge accepted: win the next round without speaking.",
          "Your next move must be decided by the person to your right.",
          "For the next round, narrate your moves like a sports commentator.",
          "Give a dramatic victory speech before you've actually won.",
          "Trade your best card/piece with the player who's losing most.",
          "Your fortune: attempt the most dramatic move of the game on your next turn.",
          "Start a slow clap for whoever makes the worst move in the next round.",
          "Announce your secret strategy loudly to everyone. Watch chaos ensue.",
          "Invent a new house rule that benefits you. Propose it seriously.",
          "For the next three turns, you must make a different sound effect with each move.",
        ],
      },
      {
        name: "Team Spirit",
        messages: [
          "The best game night memories are never about who won.",
          "A gracious winner and a gracious loser are both champions tonight.",
          "The real treasure was the arguments we had along the way.",
          "Victory tastes better when shared. Defeat heals faster when laughed off.",
          "Everyone at this table is winning at being a good sport.",
          "The scoreboard is temporary; the friendship is permanent.",
          "Tonight's true prize: a story you'll tell for years.",
          "Help your opponent celebrate a good move. It will confuse them.",
          "The player who laughs the most tonight is the true winner.",
          "Game nights are better with snacks, friends, and terrible winners.",
        ],
      },
    ],
    tips: [
      {
        title: "Use fortunes as wild cards",
        description: "Create a 'Fortune Card' deck where players can draw a fortune instead of taking a normal action. The fortune becomes a special game event!",
      },
      {
        title: "Draw at the start of each game",
        description: "Have each player draw a fortune before a new game begins — it sets a fun, unpredictable tone and gives everyone a personal 'prophecy' to work toward.",
      },
      {
        title: "Award fortunes as consolation prizes",
        description: "Give fortune messages to players who finish last each round — it softens the sting of losing and keeps everyone's spirits high.",
      },
    ],
    faqs: [
      {
        question: "What kinds of fortune messages work best for game night?",
        answer: "Playful predictions, fun challenges, and team-building messages work best. Avoid anything too serious — game night fortunes should spark laughter and friendly mischief.",
      },
      {
        question: "Can fortune cookie messages be used as actual game mechanics?",
        answer: "Absolutely! Create a 'Fortune Deck' as a wildcard element in any game. Drawing a fortune can grant bonus points, impose fun penalties, or trigger special rounds.",
      },
      {
        question: "How do I make fortune messages feel special at game night?",
        answer: "Print them on colored paper and fold them like real fortune cookies, or put them in small envelopes labeled 'Open only when you win' or 'Emergency fortune — use when losing.'",
      },
    ],
    relatedActivities: ["dinner-parties", "ice-breakers", "diy-crafts", "social-media-content"],
    group: "entertaining" as const,
  },
  {
    slug: "date-night",
    title: "Date Night",
    badge: "Romantic",
    emoji: "💕",
    description: "Romantic and playful fortune cookie messages for memorable date nights",
    metaTitle: "50+ Fortune Cookie Ideas for Date Night | Romantic Fortune Messages",
    metaDescription: "Make date night unforgettable with sweet and playful fortune cookie messages! Romantic fortunes, fun date challenges, and heartfelt messages for couples.",
    subcategories: [
      {
        name: "Sweet & Romantic",
        messages: [
          "Tonight is a chapter in your love story worth remembering.",
          "The best adventure is the one you have with the right person.",
          "You are exactly where you're supposed to be, with exactly the right person.",
          "Love is not what you feel — it's what you do on an ordinary Tuesday night.",
          "The stars aligned to bring you here tonight. Notice them.",
          "Every date night is a small renewal of your biggest commitment.",
          "The person across from you chose you today, just like every day before.",
          "Fall in love again tonight with the person you already love.",
          "Your greatest story has no better co-author than the one beside you.",
          "Tonight, forget the world and remember each other.",
        ],
      },
      {
        name: "Playful Challenges",
        messages: [
          "Before the night ends, share a memory you've never told your partner.",
          "Take a photo together right now. You'll love it in ten years.",
          "Pick up the tab for the person across from you. Consider it an investment.",
          "Tell your partner one thing you admire about them that you rarely say.",
          "Plan your next date night before this one ends.",
          "Share your most embarrassing story with your partner. They'll love you more for it.",
          "Put your phones away for the next 30 minutes. Just be here.",
          "Ask your partner the best question you've ever wanted to ask.",
          "Describe your partner using only three words. Make them perfect.",
          "Before dessert, make a promise to each other. Any promise.",
        ],
      },
      {
        name: "Deep Connection",
        messages: [
          "Ask the person you love what made them smile this week.",
          "The most romantic thing you can do: truly listen.",
          "Love is in the details you notice when you pay attention.",
          "Tonight, be curious about the person you know best.",
          "The deepest conversation you've never had is waiting to happen.",
          "Growth and love are not separate paths — they are one.",
          "Your relationship is worth every uncomfortable conversation.",
          "Be the partner tonight that you want to have tomorrow.",
          "Love expands when you make room for honesty.",
          "The person you're with is still surprising you. Let them.",
        ],
      },
    ],
    tips: [
      {
        title: "Hide fortunes in unexpected places",
        description: "Slip a fortune under a dinner plate, inside a napkin fold, or tucked into a dessert menu for your partner to discover — the element of surprise makes it magical.",
      },
      {
        title: "Write personalized fortunes for your partner",
        description: "Replace generic messages with fortunes written specifically for your relationship — inside jokes, shared memories, or things you've been meaning to say.",
      },
      {
        title: "Use fortunes as conversation starters",
        description: "Print several 'Question Fortunes' — fortune-style prompts that invite deeper conversation — and take turns drawing from a small jar during dinner.",
      },
    ],
    faqs: [
      {
        question: "What makes a great fortune cookie message for date night?",
        answer: "The best date night fortunes are personal, warm, and slightly playful. Mix romantic sentiments with fun challenges or questions that invite real conversation.",
      },
      {
        question: "Can I use fortune cookies on a first date?",
        answer: "Yes! Fortune cookies work beautifully on first dates — they're lighthearted conversation starters that break tension and create memorable shared moments without pressure.",
      },
      {
        question: "How do I make fortune cookies at home for date night?",
        answer: "Write your custom messages, fold them into store-bought fortune cookie shells, or use small origami paper stars or envelopes as a DIY alternative that's just as charming.",
      },
    ],
    relatedActivities: ["dinner-parties", "gift-baskets", "journal-prompts", "care-packages"],
    group: "entertaining" as const,
  },
  {
    slug: "ice-breakers",
    title: "Icebreakers",
    badge: "Team Activity",
    emoji: "🧊",
    description: "Fortune cookie icebreaker messages for groups, teams, and new gatherings",
    metaTitle: "50+ Fortune Cookie Icebreakers | Fortune Cookie Ideas for Group Activities",
    metaDescription: "Break the ice with creative fortune cookie messages! Perfect icebreaker fortunes for team meetings, workshops, parties, and any group activity.",
    subcategories: [
      {
        name: "Self-Discovery Prompts",
        messages: [
          "Share one thing about yourself that would surprise everyone in this room.",
          "What's a skill you have that nobody here knows about?",
          "Describe yourself using only three words — and make them interesting.",
          "What's the most unexpected place you've ever been?",
          "Share the worst job you ever had and what you learned from it.",
          "What's a popular opinion you strongly disagree with?",
          "Describe your ideal Saturday morning in one sentence.",
          "What book, film, or show has genuinely changed how you see the world?",
          "If you could master any skill instantly, what would you choose?",
          "Share a small, strange habit that you actually like about yourself.",
        ],
      },
      {
        name: "Group Connection",
        messages: [
          "Find someone in this room who shares your biggest travel dream.",
          "Challenge: have a 60-second conversation with someone you haven't spoken to yet.",
          "Your mission: learn the name and one interesting fact about three new people.",
          "Introduce yourself as if you were a fictional character from a movie.",
          "Find the person in the room whose birthday is closest to yours.",
          "Share a compliment with a stranger in this room right now.",
          "Your task: find someone who has done something you've always wanted to do.",
          "Tell the group one thing you're genuinely excited about this week.",
          "Ask someone in the room what their superpower would be.",
          "Start a handshake, fist bump, or wave trend with the next person you meet.",
        ],
      },
      {
        name: "Team Energy Builders",
        messages: [
          "The energy you bring to this room is contagious. Make it positive.",
          "Every great team starts with one honest conversation.",
          "You are exactly the kind of person this group needs.",
          "Collaboration is the superpower hiding in plain sight.",
          "Listen first, talk second — that's the secret to every great team.",
          "The most valuable thing you can contribute today: your full attention.",
          "Great things begin with small acts of courage. Start now.",
          "Your idea is worth sharing. The group is ready to hear it.",
          "The best teams are built on trust, and trust starts here.",
          "Something unexpected and valuable will come from this group today.",
        ],
      },
    ],
    tips: [
      {
        title: "Use fortunes as introduction prompts",
        description: "Have each participant draw a fortune and use it as their introduction prompt — 'My fortune says I should tell you about my hidden talent, so here it is.'",
      },
      {
        title: "Pair fortunes with physical activity",
        description: "Print activity-based fortunes like 'Find someone wearing blue and introduce yourself' to get people moving and mixing naturally.",
      },
      {
        title: "Time the fortune reveal strategically",
        description: "Give fortunes at the very start to set a curious, playful tone — or at the midpoint as an energy refresher when a group gathering needs a spark.",
      },
    ],
    faqs: [
      {
        question: "Are fortune cookie messages effective icebreakers for work meetings?",
        answer: "Very! They create low-pressure, equal participation — everyone gets a prompt, which removes the awkwardness of 'who goes first?' and makes sharing feel natural and fun.",
      },
      {
        question: "How many fortune messages do I need for an icebreaker activity?",
        answer: "Prepare at least one per person, plus a few extras. If using fortunes for group activities, prepare 2-3 per person so there's variety and no one gets the same message.",
      },
      {
        question: "Can fortune icebreakers work for large groups of 50+ people?",
        answer: "Yes! For large groups, use fortunes as pair-up prompts — each person finds their 'fortune match' with a complementary message, which naturally creates pairs for activities.",
      },
    ],
    relatedActivities: ["game-night", "dinner-parties", "classroom-activities", "marketing-campaigns"],
    group: "entertaining" as const,
  },
  // ─────────────────────────────────────────────
  // GROUP: educational
  // ─────────────────────────────────────────────
  {
    slug: "classroom-activities",
    title: "Classroom Activities",
    badge: "Educational",
    emoji: "📚",
    description: "Fortune cookie messages for teachers and students in the classroom",
    metaTitle: "50+ Fortune Cookie Ideas for Classroom Activities | Teacher Fortune Messages",
    metaDescription: "Engage students with creative fortune cookie classroom activities! Inspirational messages, writing prompts, and fun educational fortunes for teachers.",
    subcategories: [
      {
        name: "Motivational for Students",
        messages: [
          "Every mistake you make in this classroom is evidence that you're trying.",
          "The question you're afraid to ask is the most important one in the room.",
          "Understanding something difficult today makes tomorrow's hard things easier.",
          "Your brain is changing shape right now as you learn. That is extraordinary.",
          "The effort you put in today compounds into the knowledge you'll have tomorrow.",
          "Not knowing yet is the beginning of knowing. You're exactly where you should be.",
          "Ask for help. The smartest people always do.",
          "One idea you learn today could change everything later.",
          "Reading is not homework. Reading is a superpower in disguise.",
          "You are more capable than your last test score suggests.",
        ],
      },
      {
        name: "Writing Prompts",
        messages: [
          "Write about a place that only exists in your imagination.",
          "Describe a future version of yourself who has learned everything you want to learn.",
          "Write a letter to a historical figure whose era you'd love to visit.",
          "Tell the story of an ordinary object — from the object's point of view.",
          "What would you study if there were no tests and no grades?",
          "Write a dialogue between two people who completely disagree — and both make good points.",
          "Describe the most interesting thing you've ever learned and why it stayed with you.",
          "What do you wish adults understood about being your age?",
          "Write about a moment when you changed your mind about something important.",
          "Imagine the world 50 years from now. What do you hope is different?",
        ],
      },
      {
        name: "Classroom Community",
        messages: [
          "Every person in this classroom has something the rest of the class needs.",
          "Help someone understand something today — it will help you understand it better.",
          "The kindest thing you can do in school is listen when someone speaks.",
          "This classroom is only as good as everyone in it. Make it great.",
          "Your curiosity is contagious. Spread it generously.",
          "Teach others what you know. Learning accelerates when shared.",
          "Be the classmate who makes the room feel safe enough to try.",
          "The best student is not the smartest — it's the most curious.",
          "Celebrate your classmates' progress like you celebrate your own.",
          "You belong here. Your voice matters in this room.",
        ],
      },
    ],
    tips: [
      {
        title: "Use fortunes as daily writing warm-ups",
        description: "Start each class with students drawing a fortune and writing for 5 minutes in response — it builds writing habits, sparks creativity, and settles the class quickly.",
      },
      {
        title: "Create a Fortune Wall of Wisdom",
        description: "Have students write their own fortune-style messages about what they've learned, then post them on a classroom bulletin board for ongoing inspiration.",
      },
      {
        title: "Use fortunes as end-of-lesson reflections",
        description: "Give each student a fortune at the end of class and ask: 'How does this connect to what we learned today?' — a simple but powerful metacognitive practice.",
      },
    ],
    faqs: [
      {
        question: "What grade levels work best for fortune cookie classroom activities?",
        answer: "Fortune cookie activities work across all grades! Adjust the message complexity — simple, visual fortunes for elementary, thought-provoking prompts for middle and high school, reflective fortunes for college-level discussions.",
      },
      {
        question: "How can teachers use fortune cookies for writing instruction?",
        answer: "Use fortunes as story starters, essay prompts, or reflective journal entries. The fortune format naturally models concise, impactful writing — great for lessons on voice and economy of language.",
      },
      {
        question: "Can fortune messages be tied to curriculum content?",
        answer: "Absolutely. Create subject-specific fortune sets — math problem-solving fortunes, historical-figure wisdom quotes for history class, scientific curiosity prompts for science — to reinforce curriculum themes.",
      },
    ],
    relatedActivities: ["journal-prompts", "ice-breakers", "lunch-box-notes", "diy-crafts"],
    group: "educational" as const,
  },
  {
    slug: "lunch-box-notes",
    title: "Lunch Box Notes",
    badge: "Family Activity",
    emoji: "🥪",
    description: "Warm and encouraging fortune cookie messages for lunch box surprises",
    metaTitle: "50+ Fortune Cookie Lunch Box Notes | Lunch Box Message Ideas",
    metaDescription: "Surprise your kids or partner with sweet fortune cookie lunch box notes! Encouraging, funny, and heartfelt messages to brighten anyone's midday.",
    subcategories: [
      {
        name: "Encouragement & Love",
        messages: [
          "You are braver than you know and smarter than you think. Have a great day.",
          "No matter what happens today, you are deeply loved.",
          "Today will be better because you're in it.",
          "The best part of my day is knowing I'll see you later.",
          "You've got this. All of it. Every bit.",
          "I packed extra love in here today.",
          "You are my favorite part of every ordinary Tuesday.",
          "Whatever happens today, I'm proud of you.",
          "This lunch was made with love. Please eat it with happiness.",
          "You light up every room you walk into. Remember that at lunch.",
        ],
      },
      {
        name: "Fun & Silly",
        messages: [
          "Warning: this lunch is 100% homemade, 100% delicious, and 100% made with questionable skill.",
          "Eating lunch is scientifically proven to make afternoons better. Enjoy this experiment.",
          "Your sandwich is delicious. Your fortune is even better. Today is your day.",
          "If you're reading this, the sandwich has already been eaten by your future self. Time is weird.",
          "The stars predict great things for you this afternoon. Also: eat your vegetables.",
          "This note is brought to you by someone who thinks you're pretty great.",
          "A lunchtime fortune: the vending machine treats do not count as lunch. Nice try.",
          "Today's secret ingredient in your lunch: 100% genuine 'you've got this' energy.",
          "Eat your lunch. Drink your water. Take over the world. In that order.",
          "You're in the top 1% of people I've made lunch for. Actually, the top 100%.",
        ],
      },
      {
        name: "Afternoon Motivation",
        messages: [
          "Half the day is done. The best half might still be ahead.",
          "Fuel up — the afternoon needs you at your best.",
          "Rest is part of the work. Enjoy this break fully.",
          "Your afternoon challenge: notice one beautiful thing you'd normally overlook.",
          "Today's afternoon goal: finish what you started this morning.",
          "The sun is at its brightest midday. So are you.",
          "Recharge. Refocus. Return stronger.",
          "You're halfway through something difficult. Don't stop now.",
          "The hardest problems often solve themselves after lunch. Just saying.",
          "Even the best adventures have a lunch break. This is yours.",
        ],
      },
    ],
    tips: [
      {
        title: "Keep a rotation of messages",
        description: "Prepare 20-30 messages in advance and rotate them randomly — your child or partner will start looking forward to discovering a new fortune each day.",
      },
      {
        title: "Make it interactive",
        description: "Leave a question on the fortune note and ask them to write back on a sticky note — turns the lunch box exchange into a daily mini letter-writing tradition.",
      },
      {
        title: "Celebrate milestones with special fortunes",
        description: "On test days, first days of new things, or tough weeks, write a longer, extra-heartfelt fortune note — these are the ones that get saved and kept.",
      },
    ],
    faqs: [
      {
        question: "How long should a lunch box fortune message be?",
        answer: "Keep it under 25 words for kids — short enough to read quickly but meaningful enough to remember. For adults, a sentence or two is perfect. Think fortune cookie length!",
      },
      {
        question: "What's a good cadence for lunch box fortune notes?",
        answer: "Daily is wonderful, but even 2-3 times per week creates a meaningful tradition. Consistency matters more than frequency — predictable notes become something to look forward to.",
      },
      {
        question: "Can I use fortune messages for adult lunch boxes?",
        answer: "Absolutely! A fortune note in an adult's lunch box is unexpectedly touching — it works for partners, adult kids away at college (via text), or even colleagues as a small act of kindness.",
      },
    ],
    relatedActivities: ["care-packages", "classroom-activities", "journal-prompts", "gift-baskets"],
    group: "educational" as const,
  },
  {
    slug: "journal-prompts",
    title: "Journal Prompts",
    badge: "Reflective Writing",
    emoji: "📓",
    description: "Fortune cookie messages as reflective journaling prompts for self-discovery",
    metaTitle: "50+ Fortune Cookie Journal Prompts | Fortune Cookie Writing Prompts",
    metaDescription: "Use fortune cookie messages as daily journal prompts! Deep, reflective, and inspiring writing prompts for self-discovery, gratitude journaling, and personal growth.",
    subcategories: [
      {
        name: "Self-Discovery",
        messages: [
          "What version of yourself showed up today that you're proud of?",
          "Write about a belief you held a year ago that you no longer hold.",
          "What would you do differently if you knew no one would judge you?",
          "Describe the person you're becoming — in the present tense.",
          "What has fear stopped you from doing that you still want to do?",
          "Write a letter to the version of yourself from five years ago.",
          "What do you want more of in your life right now?",
          "What are you tolerating that you no longer need to?",
          "Name three things you've learned about yourself in the past month.",
          "What does your ideal ordinary day look like?",
        ],
      },
      {
        name: "Gratitude & Presence",
        messages: [
          "Write about three small things that happened today worth noticing.",
          "What moment this week made you feel most alive?",
          "Name someone whose life has shaped yours without knowing it.",
          "What do you take for granted that you'd fiercely miss if it were gone?",
          "Write about a place that makes you feel instantly at peace.",
          "What sensory detail from today is worth remembering?",
          "Who deserves your gratitude that you haven't thanked yet?",
          "Describe the best version of your everyday life in vivid detail.",
          "What is working in your life right now that deserves recognition?",
          "Write about a small pleasure that brings you disproportionate joy.",
        ],
      },
      {
        name: "Growth & Vision",
        messages: [
          "What would you attempt if you were certain you'd succeed?",
          "What is the one change that would most improve your life right now?",
          "Write about the problem you keep putting off solving — and why.",
          "What story are you telling yourself that isn't helping you?",
          "Describe your life one year from now if everything went well.",
          "What do you need to let go of to move forward?",
          "Write about a challenge you've overcome that made you stronger.",
          "What skill do you want to build this year, and why does it matter?",
          "What would your future self thank you for doing today?",
          "Write your own fortune for tomorrow. Make it true.",
        ],
      },
    ],
    tips: [
      {
        title: "Draw a fortune at the start of each journaling session",
        description: "Keep a bowl of printed fortune prompts on your desk. Draw one before each session to remove the 'blank page' paralysis and immediately spark writing.",
      },
      {
        title: "Use fortunes for morning pages practice",
        description: "Combine Julia Cameron's morning pages approach with fortune prompts — draw a fortune, then write freely for 3 pages without stopping, beginning from the prompt.",
      },
      {
        title: "Create a 30-day fortune journal challenge",
        description: "Prepare 30 fortune-style writing prompts, one for each day of a month. Share the challenge with a friend for accountability and deeper reflection.",
      },
    ],
    faqs: [
      {
        question: "How do fortune cookie messages work as journal prompts?",
        answer: "Fortune messages are designed to be interpretive and open-ended — perfect journaling conditions. Their brevity invites expansion, and their philosophical tone naturally leads to introspection.",
      },
      {
        question: "Can I use fortune journal prompts for therapy or coaching?",
        answer: "Yes! Therapists and coaches use fortune-style prompts as non-threatening entry points for difficult topics. The framing as a 'fortune' reduces resistance and invites playful exploration.",
      },
      {
        question: "What's the best way to organize a fortune journal practice?",
        answer: "Keep a dedicated journal and a jar of printed fortune prompts. Date each entry, write the fortune at the top as the heading, and let the writing go wherever it needs to go.",
      },
    ],
    relatedActivities: ["classroom-activities", "lunch-box-notes", "social-media-content", "care-packages"],
    group: "educational" as const,
  },
  // ─────────────────────────────────────────────
  // GROUP: creative
  // ─────────────────────────────────────────────
  {
    slug: "gift-baskets",
    title: "Gift Baskets",
    badge: "Gift Giving",
    emoji: "🧺",
    description: "Fortune cookie messages to include in gift baskets for any occasion",
    metaTitle: "50+ Fortune Cookie Messages for Gift Baskets | Gift Basket Fortune Ideas",
    metaDescription: "Elevate any gift basket with a personal fortune cookie message! Warm, thoughtful, and occasion-perfect fortune messages to include in gift baskets.",
    subcategories: [
      {
        name: "Warm & Personal",
        messages: [
          "This basket was assembled with intention. Each item was chosen thinking of you.",
          "You deserve every beautiful thing in here and more.",
          "This is a small collection of things I hope make your day brighter.",
          "Everything here was picked with one person in mind. You.",
          "The real gift is the thought behind every item in this basket.",
          "I wish I could give you everything you deserve. This is a start.",
          "Inside this basket: a small reflection of how much I appreciate you.",
          "You are worth far more than what's in here. But I hope it helps.",
          "This was put together with care, attention, and genuine affection.",
          "May everything in here remind you how thought-of and cherished you are.",
        ],
      },
      {
        name: "Celebratory & Joyful",
        messages: [
          "You've earned every treat in here. Celebrate yourself without guilt.",
          "Congratulations! This basket is your reward for being amazing.",
          "Big achievements deserve big baskets. This is just the beginning.",
          "Every item here is a tiny standing ovation. You deserve the whole crowd.",
          "This basket says: we see you, we celebrate you, we're so proud.",
          "You did it! Whatever 'it' is — it was worth celebrating.",
          "Joy multiplies when it's shared. Let this basket start a celebration.",
          "The best gift you can give yourself today: enjoy every single thing in here.",
          "A basket of possibilities, pleasures, and perfectly chosen things — just for you.",
          "This basket was curated with one goal: make you smile. Mission accomplished?",
        ],
      },
      {
        name: "Comforting & Supportive",
        messages: [
          "This basket can't solve everything, but it can make today a little softer.",
          "On difficult days, little comforts make a big difference. This is yours.",
          "I can't always be there, but I wanted you to feel cared for right now.",
          "Rest, restore, and remember that you are not in this alone.",
          "Every item in here was chosen to say: I see how hard things are right now.",
          "Healing takes time. This basket is meant to keep you company.",
          "You don't have to be okay today. This basket just wants to sit with you.",
          "Whatever you're going through, you are still the person we believe in.",
          "Sending warmth, comfort, and a small reminder that you are loved.",
          "The hardest seasons always end. This basket is for right now.",
        ],
      },
    ],
    tips: [
      {
        title: "Attach the fortune to a ribbon on the basket",
        description: "Tie a printed fortune to the ribbon or bow of the gift basket as a visible, decorative element — it becomes the first thing the recipient notices.",
      },
      {
        title: "Tuck the fortune under the central item",
        description: "Bury the fortune under the star item in the basket so it's discovered during unpacking — like a small treasure hidden in the gift itself.",
      },
      {
        title: "Match the fortune tone to the occasion",
        description: "A celebration basket needs a joyful fortune; a care basket needs a comforting one. Take 30 seconds to choose the right tone and the fortune elevates the whole gift.",
      },
    ],
    faqs: [
      {
        question: "Should I write the fortune myself or use a pre-written one?",
        answer: "A handwritten personal fortune is most meaningful, but a well-chosen pre-written message is absolutely fine. Personalizing any message with the recipient's name takes it to the next level.",
      },
      {
        question: "How do I format a fortune for a gift basket?",
        answer: "Print on a small card (business card size works beautifully), use nice paper, and optionally seal it in a tiny envelope. The presentation matters almost as much as the message.",
      },
      {
        question: "Can I include multiple fortune messages in one gift basket?",
        answer: "Yes! A 'fortune card collection' of 5-7 messages tied together makes a lovely addition — the recipient has a set of daily fortunes to draw from over the coming week.",
      },
    ],
    relatedActivities: ["care-packages", "dinner-parties", "date-night", "diy-crafts"],
    group: "creative" as const,
  },
  {
    slug: "advent-calendar",
    title: "Advent Calendar",
    badge: "Holiday Seasonal",
    emoji: "🎄",
    description: "Daily fortune cookie messages for advent calendars and countdown traditions",
    metaTitle: "25 Fortune Cookie Advent Calendar Messages | Daily Fortune Messages",
    metaDescription: "Fill your advent calendar with meaningful fortune cookie messages! Daily fortunes, reflections, and holiday wisdom for a countdown full of joy and intention.",
    subcategories: [
      {
        name: "Holiday Reflection",
        messages: [
          "The best gifts are not found in stores — they're found in moments of genuine connection.",
          "Slow down enough this season to notice what is actually beautiful about it.",
          "Gift giving is one language of love. Make sure it speaks your truth.",
          "The holidays are not a perfect season — they are a human one.",
          "Whatever this time of year means to you, let it mean something.",
          "Presence is the most irreplaceable present of the season.",
          "The magic of this time of year lives inside quiet moments, not grand gestures.",
          "Let go of what the season is supposed to be and find what it actually is.",
          "Give your time this season. It is more valuable than anything wrapped.",
          "The best holiday memory you'll make this year hasn't happened yet.",
        ],
      },
      {
        name: "Daily Intentions",
        messages: [
          "Today: call someone you haven't spoken to in too long.",
          "Today: do one kind thing you won't mention to anyone.",
          "Today: give yourself permission to do less and feel more.",
          "Today: say 'I love you' to someone who needs to hear it.",
          "Today: notice beauty in exactly three ordinary things.",
          "Today: be the warmth you wish the world had more of.",
          "Today: forgive something small that's been taking up too much space.",
          "Today: be present in one conversation instead of thinking about the next.",
          "Today: write down three things you're grateful for this season.",
          "Today: rest without guilt. Rest is not laziness — it's wisdom.",
        ],
      },
      {
        name: "Countdown Joy",
        messages: [
          "The countdown is not to a day — it's to a feeling. Start feeling it now.",
          "Each day leading up to something wonderful is itself wonderful.",
          "Anticipation is its own kind of joy. Let yourself enjoy the waiting.",
          "The best part of any countdown is the daily reminder that something good is coming.",
          "You are X days from a celebration. Use the wait wisely.",
          "Every small tradition you keep is a gift to your future self.",
          "The season of giving begins with giving yourself a moment to breathe.",
          "Open this and feel it: the year is almost done and you made it through.",
          "The holidays don't need to be perfect. They need to be yours.",
          "Something warm and wonderful is on its way. So is today.",
        ],
      },
    ],
    tips: [
      {
        title: "Pair fortunes with small activities",
        description: "Combine each fortune message with a tiny activity card — 'Call a friend,' 'Take a walk,' 'Watch a holiday film' — to make the advent calendar an experience, not just a countdown.",
      },
      {
        title: "Create a family fortune chain",
        description: "Each family member writes one fortune for each day of the advent, then mix them together in the calendar — it becomes a guessing game of who wrote each day's message.",
      },
      {
        title: "Use fortunes as reflection prompts at dinner",
        description: "Open the day's fortune at the dinner table and use it as a shared conversation prompt — it builds a nightly family ritual that deepens connection through December.",
      },
    ],
    faqs: [
      {
        question: "How many fortune messages do I need for an advent calendar?",
        answer: "Traditional advent calendars cover December 1-24 (24 messages) or December 1-25 (25 messages). Prepare a few extras in case you want to swap based on mood or occasion.",
      },
      {
        question: "Can I make an advent calendar with non-holiday fortune messages?",
        answer: "Absolutely! A 'countdown to my birthday' or 'January wellness advent' using general fortune messages works beautifully. The countdown framework is the feature, not the holiday.",
      },
      {
        question: "What's the best paper for printing fortune advent messages?",
        answer: "Cardstock in festive colors works wonderfully. You can also use craft paper with hand-stamped or drawn decorations — the texture and handmade quality make each message feel special.",
      },
    ],
    relatedActivities: ["gift-baskets", "diy-crafts", "care-packages", "lunch-box-notes"],
    group: "creative" as const,
  },
  {
    slug: "care-packages",
    title: "Care Packages",
    badge: "Long Distance",
    emoji: "📦",
    description: "Heartfelt fortune cookie messages to include in care packages",
    metaTitle: "50+ Fortune Cookie Messages for Care Packages | Care Package Fortune Ideas",
    metaDescription: "Add a personal touch to any care package with meaningful fortune cookie messages! Perfect for college students, military personnel, long-distance friends, and anyone who needs a lift.",
    subcategories: [
      {
        name: "Encouragement Across Distance",
        messages: [
          "Distance is just geography. The connection is still here.",
          "You are being thought of, across every mile between us.",
          "Far away doesn't mean forgotten. Not even close.",
          "This package traveled to find you because you're worth finding.",
          "The miles between us do not measure how much you're missed.",
          "Every item here carries a piece of home to where you are.",
          "You are not alone in whatever you're facing right now.",
          "I can't be there, but I hope this helps you feel less far.",
          "Even oceans apart, you are deeply, constantly loved.",
          "Home is wherever you bring your heart. Bring it everywhere.",
        ],
      },
      {
        name: "Strength & Resilience",
        messages: [
          "You are doing something hard. That makes you remarkable.",
          "This season will not last forever, even if it feels like it will.",
          "Everything you're navigating right now is building something in you.",
          "Rest if you must. Just don't give up.",
          "Hard days prove what easy days never can: that you're strong.",
          "You've survived every difficult day before this one. This one too.",
          "The struggle you're in right now is developing the strength you'll need.",
          "Keep going. Something worth finishing is always worth the hard middle.",
          "Your persistence is more powerful than any obstacle in your way.",
          "You are more than enough for everything you're facing right now.",
        ],
      },
      {
        name: "Warmth & Belonging",
        messages: [
          "Unpacking this is like getting a little bit of home in the mail.",
          "These things were chosen for you specifically. You are thought about.",
          "Everything in here is evidence that someone is paying attention to your life.",
          "You belong, even when you're far from the places that made you.",
          "May this package remind you that you are exactly where you're meant to be.",
          "Carry this warmth with you into the places that feel unfamiliar.",
          "Even when life feels uncertain, you are certain to those who love you.",
          "You are held in thought and warmth from wherever this was sent.",
          "Wherever you are right now, you are loved from exactly here.",
          "The care put into this package is a fraction of the care held for you.",
        ],
      },
    ],
    tips: [
      {
        title: "Include a personal fortune written by hand",
        description: "Add a handwritten fortune on a small folded piece of paper tucked inside one of the items — the discovery of the hidden note makes it extra special.",
      },
      {
        title: "Create a 'one for each hard day' envelope set",
        description: "Pack 7 small sealed envelopes labeled Day 1 through Day 7, each with a unique fortune inside — a week's worth of encouragement delivered all at once.",
      },
      {
        title: "Match the fortune to the recipient's current situation",
        description: "A student during finals needs a different fortune than someone who just moved cities. A few personalized words about their specific experience elevates the entire package.",
      },
    ],
    faqs: [
      {
        question: "What types of fortune messages work best in care packages?",
        answer: "Encouragement, warmth, and resilience-themed fortunes work best. Avoid humor that might not land without context — care packages call for sincere, heartfelt messages.",
      },
      {
        question: "Should the fortune be visible when the package is opened or hidden inside?",
        answer: "Both work! A visible fortune on top sets a warm tone immediately. A hidden fortune tucked inside a snack or beneath tissue paper creates a delightful surprise discovery.",
      },
      {
        question: "How can I make care package fortunes more personal?",
        answer: "Reference shared memories, use an inside joke in the wording, or write the fortune as a direct message rather than a third-person prediction — 'You've got this' over 'You will succeed.'",
      },
    ],
    relatedActivities: ["gift-baskets", "lunch-box-notes", "advent-calendar", "journal-prompts"],
    group: "creative" as const,
  },
  {
    slug: "diy-crafts",
    title: "DIY Crafts",
    badge: "Handmade",
    emoji: "✂️",
    description: "Fortune cookie messages for DIY craft projects and handmade gifts",
    metaTitle: "50+ Fortune Cookie Messages for DIY Crafts | Handmade Fortune Ideas",
    metaDescription: "Create beautiful handmade fortune cookie crafts! Custom fortune messages for DIY projects, paper crafts, and creative gift-making activities.",
    subcategories: [
      {
        name: "Paper Craft Fortunes",
        messages: [
          "This message was folded with care and sent with intention.",
          "The hands that made this were thinking of you.",
          "Handmade means made by someone who cared enough to make it.",
          "Paper can hold anything — a wish, a word, a little piece of someone.",
          "The art of making something by hand is the art of paying attention.",
          "This little folded thing carries something no machine can replicate: love.",
          "Even the smallest handmade thing holds the greatest amount of thought.",
          "Creation is a form of conversation. This piece is speaking to you.",
          "What's made by hand is kept by heart.",
          "Imperfect and handmade is always better than perfect and purchased.",
        ],
      },
      {
        name: "Creative Inspiration",
        messages: [
          "Make something today, even if no one sees it.",
          "Creativity is not a talent — it's a practice. Practice today.",
          "The best art starts with the willingness to make something bad first.",
          "Every expert was once a beginner holding scissors and a dream.",
          "Make it your own. That's what 'handmade' actually means.",
          "The world needs what only your hands can make.",
          "Don't wait until you're good enough to start. Start to get good.",
          "Your creative instincts know more than your inner critic does.",
          "A finished imperfect thing is worth more than a perfect idea never made.",
          "The materials are just the beginning. The rest is all you.",
        ],
      },
      {
        name: "Gift-Giving with Heart",
        messages: [
          "Someone spent their most valuable resource — time — to make this for you.",
          "This gift cannot be returned or exchanged. It is one of a kind, like you.",
          "Handmade gifts carry the maker with them wherever they go.",
          "The gift tag says 'from me' — but what it really says is 'you mattered enough.'",
          "Nothing you'll receive this year cost more than the time this took to make.",
          "This was built from scratch for someone who deserves scratch-built things.",
          "Keep this. Not because it's expensive — because it's irreplaceable.",
          "Somewhere between the glue and the glitter, someone was thinking of you.",
          "Treasure this not for what it is, but for what it represents.",
          "This was made with imperfect hands and a perfect heart.",
        ],
      },
    ],
    tips: [
      {
        title: "Make your own fortune cookie shapes from paper",
        description: "Cut circles from card stock, write your fortune on a strip of paper, fold the circle in half with the strip inside, then gently bend the edges down — a paper fortune cookie that holds any message.",
      },
      {
        title: "Stamp or emboss fortunes for a polished look",
        description: "Use letter stamps, embossing powder, or a basic printer to create professional-looking fortunes — pairs beautifully with rustic kraft paper for a handmade-yet-polished aesthetic.",
      },
      {
        title: "Incorporate fortunes into larger craft projects",
        description: "Embed fortune messages into decoupage frames, greeting cards, shadow boxes, or scrapbook pages — the fortune becomes an integrated part of the art, not just an add-on.",
      },
    ],
    faqs: [
      {
        question: "How do I make homemade fortune cookies?",
        answer: "Traditional fortune cookies are made from a thin batter (flour, sugar, egg white, butter, vanilla) baked briefly, then folded around a paper fortune while still hot. DIY paper versions are simpler and skip the baking entirely.",
      },
      {
        question: "What paper works best for printing fortune messages for crafts?",
        answer: "Kraft paper, cardstock, and vellum all work beautifully. Thin paper mimics the look of real fortune cookie slips; heavier cardstock creates a keepsake-quality message worth saving.",
      },
      {
        question: "Can children participate in fortune cookie DIY craft projects?",
        answer: "Absolutely — and it's a wonderful activity. Children can write (or dictate) their own fortunes, decorate the paper, and assemble paper fortune shapes. The message they create becomes especially meaningful.",
      },
    ],
    relatedActivities: ["gift-baskets", "advent-calendar", "classroom-activities", "care-packages"],
    group: "creative" as const,
  },
  // ─────────────────────────────────────────────
  // GROUP: professional
  // ─────────────────────────────────────────────
  {
    slug: "fundraising",
    title: "Fundraising Events",
    badge: "Fundraising",
    emoji: "💝",
    description: "Fortune cookie messages for charity events, galas, and fundraising campaigns",
    metaTitle: "50+ Fortune Cookie Ideas for Fundraising Events | Charity Fortune Messages",
    metaDescription: "Elevate your fundraising event with meaningful fortune cookie messages! Inspiring fortunes for charity galas, school fundraisers, and nonprofit campaigns.",
    subcategories: [
      {
        name: "Generosity & Impact",
        messages: [
          "What you give tonight will do more than you will ever see.",
          "Generosity is the investment with the highest return.",
          "The cause you support tonight ripples forward in ways you cannot imagine.",
          "Giving is not a subtraction from your life — it's an addition.",
          "Tonight, your generosity is someone else's turning point.",
          "Small contributions compound into massive change over time.",
          "Every dollar given here carries with it the intention behind it.",
          "The most powerful act you can take tonight is an act of generosity.",
          "What you give today lives on long after tonight.",
          "Your presence and generosity tonight are already changing things.",
        ],
      },
      {
        name: "Community & Purpose",
        messages: [
          "You came here because you believe in something. That belief is the foundation of change.",
          "A room full of people who care is one of the most powerful forces in the world.",
          "Communities are built one act of goodwill at a time.",
          "Together, this room holds the power to change something real.",
          "You are part of something larger than this evening.",
          "Every person here shares a belief that things can be better. Act on it.",
          "The world is changed by people who show up — like you did tonight.",
          "Your decision to be here tonight was itself a form of generosity.",
          "Change begins with people who choose to care. You are here. You care.",
          "This cause has no better advocates than the people in this room.",
        ],
      },
      {
        name: "Gratitude & Inspiration",
        messages: [
          "Thank you for choosing to be part of something meaningful tonight.",
          "Your generosity is someone else's hope made tangible.",
          "You didn't have to come tonight. You chose to. That choice matters.",
          "The greatest gift you can give any cause is your belief in it.",
          "Gratitude from those who will benefit from your generosity travels here.",
          "Thank you for turning goodwill into action.",
          "Your presence here is a statement: I believe this is worth fighting for.",
          "Acts of generosity like this are how good things actually get built.",
          "Tonight's event is proof that people who care can do extraordinary things.",
          "Every great cause was once funded by people who simply chose to give.",
        ],
      },
    ],
    tips: [
      {
        title: "Use fortunes as table centerpiece conversation starters",
        description: "Place a fortune under each guest's dinner plate or wine glass — after a toast, invite everyone to read their fortune aloud as an icebreaker that reinforces the event's mission.",
      },
      {
        title: "Include fortunes in auction bid envelopes",
        description: "Slip a fortune into each silent auction bid envelope — donors who open their envelope to place a bid discover an unexpected message that makes the giving feel more personal.",
      },
      {
        title: "Create mission-aligned fortunes",
        description: "Write fortunes that connect directly to the cause — a children's literacy fundraiser fortune might say 'Tonight's gift will one day help a child read their first book.'",
      },
    ],
    faqs: [
      {
        question: "How can fortune cookies enhance a fundraising event experience?",
        answer: "Fortunes create personal connection moments in large, impersonal event settings. A thoughtful fortune message reminds each guest that their individual presence and contribution matters.",
      },
      {
        question: "Can fortune cookies themselves be sold as fundraising items?",
        answer: "Yes! Custom-branded fortune cookies make excellent fundraising products. Sell them individually, in boxes, or as part of a gift set — they appeal broadly and have excellent margins.",
      },
      {
        question: "What fortune messages are most appropriate for serious causes?",
        answer: "For serious causes, lean toward gratitude, impact, and community messages — avoid humor or frivolity. The fortune should reinforce the gravity and importance of the cause while feeling warm, not heavy.",
      },
    ],
    relatedActivities: ["dinner-parties", "marketing-campaigns", "ice-breakers", "gift-baskets"],
    group: "professional" as const,
  },
  {
    slug: "restaurant-menu",
    title: "Restaurant Menu",
    badge: "Restaurant Business",
    emoji: "🍜",
    description: "Fortune cookie messages for restaurants to include on menus and with dessert",
    metaTitle: "50+ Fortune Cookie Messages for Restaurants | Restaurant Fortune Cookie Ideas",
    metaDescription: "Delight your restaurant guests with creative fortune cookie messages! Perfect fortunes for Asian restaurants, upscale dining, dessert pairings, and special events.",
    subcategories: [
      {
        name: "Dining Experience",
        messages: [
          "The best meals are not just eaten — they are remembered.",
          "Tonight's table is a stage. The best scene is the one unfolding right now.",
          "A great meal asks nothing of you but your full presence.",
          "Savor this. Not just the food — the company, the moment, the evening.",
          "Food is the universal language. You are fluent in it.",
          "The meal in front of you was made by someone who cares about craft.",
          "Dining well is an act of appreciation — for the food, the chef, and each other.",
          "Every dish here tells a story. Tonight, it becomes part of yours.",
          "Good food makes better conversations. Let both linger.",
          "The secret ingredient in every dish tonight is the intention behind it.",
        ],
      },
      {
        name: "Returning Guest Appreciation",
        messages: [
          "Thank you for returning. This table has been waiting for you.",
          "Loyalty tastes sweeter than anything on our menu.",
          "Guests who return are not customers — they are family.",
          "Your presence here tonight is the best review we could receive.",
          "A familiar face is the finest addition to any dining room.",
          "Thank you for making this place part of your story.",
          "The kitchen prepares with extra care for those who keep coming back.",
          "You are not just a guest — you are part of what makes this place what it is.",
          "Your return tonight is appreciated more than this fortune can express.",
          "Tonight's meal is better because you chose to be here again.",
        ],
      },
      {
        name: "Special Occasion Dining",
        messages: [
          "Whatever brought you here tonight deserves to be celebrated.",
          "This meal is a small ceremony marking something meaningful.",
          "Special occasions deserve extraordinary meals. We hope we've delivered.",
          "Tonight is already a memory in the making. Enjoy every course.",
          "The occasion brought you here. The food made it unforgettable.",
          "Celebrations are better with great food and the right people. You have both.",
          "The best part of any milestone: the meal shared to mark it.",
          "Tonight is one for the books — and the recipe box.",
          "Whatever you're celebrating tonight, we're honored to be part of it.",
          "This is one of the meals you'll mention when someone says 'tell me about a great night.'",
        ],
      },
    ],
    tips: [
      {
        title: "Serve fortunes with the dessert course",
        description: "Present a small fortune cookie alongside the dessert plate — it's the traditional moment and creates a memorable ritual guests associate with your restaurant.",
      },
      {
        title: "Use seasonal fortunes tied to your menu changes",
        description: "Update your fortune messages with each seasonal menu rotation — regulars will notice and appreciate the thoughtful detail that matches the evolving dining experience.",
      },
      {
        title: "Create a loyalty fortune program",
        description: "Give returning guests a special 'returning guest' fortune with their bill — a simple gesture that acknowledges loyalty and makes regulars feel genuinely seen.",
      },
    ],
    faqs: [
      {
        question: "What makes a great restaurant fortune cookie message?",
        answer: "Restaurant fortunes should enhance the dining experience — they should be warm, memorable, and relevant to being in a restaurant. Avoid generic fortunes and instead create messages that feel tailored to your brand.",
      },
      {
        question: "Can restaurants use custom fortune cookies as a marketing strategy?",
        answer: "Absolutely. Custom branded fortune cookies with your restaurant name, logo, or special message are memorable marketing tools. Guests often share them on social media, extending your restaurant's reach organically.",
      },
      {
        question: "How often should restaurants change their fortune cookie messages?",
        answer: "Rotate messages seasonally at minimum, or more frequently if you have a loyal regular customer base. Fresh fortunes give regulars a reason to pay attention and feel like each visit offers something new.",
      },
    ],
    relatedActivities: ["dinner-parties", "fundraising", "marketing-campaigns", "ice-breakers"],
    group: "professional" as const,
  },
  {
    slug: "social-media-content",
    title: "Social Media Content",
    badge: "Digital Marketing",
    emoji: "📱",
    description: "Fortune cookie messages optimized for social media posts and engagement",
    metaTitle: "50+ Fortune Cookie Messages for Social Media | Fortune Cookie Quotes for Instagram",
    metaDescription: "Boost engagement with shareable fortune cookie messages for social media! Perfect for Instagram captions, Twitter posts, Facebook updates, and TikTok content.",
    subcategories: [
      {
        name: "Shareable Wisdom",
        messages: [
          "The best investment you'll ever make is in yourself.",
          "Not all who wander are lost — some are just taking the scenic route.",
          "Your story is still being written. Make it worth reading.",
          "The secret to happiness is wanting what you already have.",
          "You don't need a new year to start new. You just need today.",
          "Small steps forward still beat standing still.",
          "The version of you that you're scared to be is the one people need to meet.",
          "Your potential has no expiration date.",
          "Clarity comes when you stop asking what others think and start asking what you know.",
          "The most powerful thing you can do today is decide to try again.",
        ],
      },
      {
        name: "Relatable & Witty",
        messages: [
          "Your vibe is your marketing.",
          "Be the energy you're constantly searching for in everyone else.",
          "Not every post needs a caption. But every life needs a direction.",
          "Delete the apps. Keep the people.",
          "Your aesthetic is valid. Your algorithm is not your identity.",
          "Log off. Touch grass. Return improved.",
          "You are not your follower count. You are your follower caliber.",
          "The life you're performing online is not the one you're actually living.",
          "Post less. Live more. Screenshot nothing.",
          "Your best content is the life you're not posting about.",
        ],
      },
      {
        name: "Motivational Monday Energy",
        messages: [
          "It's Monday again. Radical concept: embrace it.",
          "The week doesn't care about your weekend excuses. Go.",
          "Monday is a blank page. Write something interesting.",
          "Your future self is watching how you treat this Monday.",
          "This is the week you stop waiting and start doing.",
          "Mondays are for people who plan. Be one of those people.",
          "Somewhere, someone is doing the thing you've been putting off.",
          "The most productive day of the week is the one you decide to try.",
          "You have 168 hours this week. Use them like they matter.",
          "This week: less wishing, more working.",
        ],
      },
    ],
    tips: [
      {
        title: "Pair fortunes with minimal-design visual templates",
        description: "Fortune messages perform best on social media when paired with clean, readable visuals — dark background, centered white text, subtle fortune cookie graphic. Let the words breathe.",
      },
      {
        title: "Use fortune posts as weekly series content",
        description: "Create a recurring 'Fortune Friday' or 'Monday Fortune' series — consistent naming helps followers anticipate the content and builds reliable engagement patterns over time.",
      },
      {
        title: "Ask followers to share their interpretation",
        description: "Post a fortune and ask 'What does this mean to you today?' in the caption — open-ended questions tied to fortune messages reliably generate thoughtful comments and shares.",
      },
    ],
    faqs: [
      {
        question: "What social media platforms work best for fortune cookie content?",
        answer: "Instagram (quote graphics and Reels), Twitter/X (standalone text fortunes), Pinterest (visual fortune graphics), and TikTok (fortune reveals with trending audio) all perform well with fortune-style content.",
      },
      {
        question: "How often should I post fortune cookie content on social media?",
        answer: "2-3 times per week is sustainable and prevents audience fatigue. Daily fortune posts work with a strong content calendar, but consistency and quality matter more than frequency.",
      },
      {
        question: "Can I use fortune cookie messages to grow a social media following?",
        answer: "Yes! Fortune messages have high share potential because they're relatable and quotable. Consistent, high-quality fortune content builds an audience that actively shares your posts, expanding organic reach.",
      },
    ],
    relatedActivities: ["marketing-campaigns", "journal-prompts", "game-night", "ice-breakers"],
    group: "professional" as const,
  },
  {
    slug: "marketing-campaigns",
    title: "Marketing Campaigns",
    badge: "Business Marketing",
    emoji: "📣",
    description: "Fortune cookie messages for brand campaigns, email marketing, and business communications",
    metaTitle: "50+ Fortune Cookie Messages for Marketing Campaigns | Brand Fortune Ideas",
    metaDescription: "Energize your marketing campaigns with memorable fortune cookie messages! Creative fortunes for email marketing, brand campaigns, trade shows, and customer engagement.",
    subcategories: [
      {
        name: "Brand & Product Launch",
        messages: [
          "Something worth your attention is about to arrive.",
          "The next great thing always starts with a single decision to try it.",
          "What you're looking for has been looking for you too.",
          "The best solutions are the ones that make you wonder how you managed without them.",
          "Change feels uncomfortable until it feels like progress.",
          "Innovation is just a better answer to a problem that already exists.",
          "The future of your industry is not a mystery — it's a decision.",
          "What you do next could be the thing you talk about for years.",
          "The right tool doesn't just solve your problem — it changes how you work.",
          "Something is about to make your day measurably easier. Pay attention.",
        ],
      },
      {
        name: "Customer Retention",
        messages: [
          "The best companies don't just sell things — they keep their promises.",
          "Thank you for trusting us. We don't take that lightly.",
          "Your continued partnership is the best metric we track.",
          "Loyalty is earned by showing up consistently. We intend to keep showing up.",
          "Great products get customers. Great relationships keep them.",
          "You chose us once. We'd like to earn that choice again every day.",
          "Your success is the most meaningful KPI in our business.",
          "Good service should never feel surprising. We're working on making it obvious.",
          "The best review you'll ever write about us is the word of mouth you share.",
          "Behind every satisfied customer is a team that cared about getting it right.",
        ],
      },
      {
        name: "Trade Show & Event Marketing",
        messages: [
          "The best business conversation you'll have today hasn't started yet.",
          "Somewhere in this room is your next great partnership.",
          "Come for the booth. Stay for the relationship.",
          "Great products are discovered at events like this one.",
          "You stopped here for a reason. Let's find out what it is.",
          "Every successful partnership starts with a handshake at a place like this.",
          "Your next best decision may have just started with picking up this fortune.",
          "The thing you're looking for may be exactly what we built.",
          "Great opportunities announce themselves quietly. Listen carefully today.",
          "A conversation started here has the power to change both our businesses.",
        ],
      },
    ],
    tips: [
      {
        title: "Include fortunes in email marketing as a signature element",
        description: "Add a rotating 'fortune of the week' at the bottom of your marketing emails — it becomes a signature element subscribers look forward to and remember.",
      },
      {
        title: "Use fortunes in trade show swag bags",
        description: "Branded fortune cookies or fortune message cards in trade show bags stand out from the sea of pens and notebooks — they're quirky, memorable, and conversation-starting.",
      },
      {
        title: "Tie fortunes to campaign themes",
        description: "Write fortunes that metaphorically connect to your campaign's core message — if launching a productivity tool, fortunes about 'clarity' and 'finding the right path' reinforce the brand narrative.",
      },
    ],
    faqs: [
      {
        question: "How can fortune cookie messages improve marketing ROI?",
        answer: "Memorable, shareable content drives organic reach. Fortune-style messages have high quotability and emotional resonance — when marketing copy feels like wisdom, customers remember and share it.",
      },
      {
        question: "Can fortune cookie themes work for B2B marketing?",
        answer: "Absolutely. B2B buyers are still human beings who respond to thoughtful, memorable communication. Fortune-style messages in B2B campaigns stand out in inboxes and trade show environments precisely because they're unexpected.",
      },
      {
        question: "How do I measure the effectiveness of fortune-style marketing content?",
        answer: "Track shares, saves, and comment sentiment for social media fortunes; open rates and click-throughs for email fortunes; and brand recall surveys for event-based fortune campaigns.",
      },
    ],
    relatedActivities: ["social-media-content", "restaurant-menu", "fundraising", "ice-breakers"],
    group: "professional" as const,
  },
];

// ─────────────────────────────────────────────
// Helper Functions
// ─────────────────────────────────────────────

export function getActivity(slug: string): ActivityData | undefined {
  return activitiesDatabase.find((a) => a.slug === slug);
}

export function getAllActivitySlugs(): string[] {
  return activitiesDatabase.map((a) => a.slug);
}

export function getActivitiesByGroup(
  group: ActivityData["group"],
): ActivityData[] {
  return activitiesDatabase.filter((a) => a.group === group);
}

export function getActivityMessageCount(slug: string): number {
  const activity = getActivity(slug);
  if (!activity) return 0;
  return activity.subcategories.reduce(
    (total, sub) => total + sub.messages.length,
    0,
  );
}
