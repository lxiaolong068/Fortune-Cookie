// Extended Fortune Cookie Database with 200+ messages

export interface FortuneMessage {
  id: string;
  message: string;
  category:
    | "inspirational"
    | "funny"
    | "love"
    | "success"
    | "wisdom"
    | "friendship"
    | "health"
    | "travel"
    | "birthday"
    | "study";
  tags: string[];
  luckyNumbers: number[];
  popularity: number; // 1-10 scale
  dateAdded: string;
}

// Inspirational Messages (25+)
const inspirationalMessages: Omit<FortuneMessage, "id" | "dateAdded">[] = [
  {
    message: "Your future is created by what you do today, not tomorrow.",
    category: "inspirational",
    tags: ["future", "action", "motivation"],
    luckyNumbers: [7, 14, 23, 31, 42, 56],
    popularity: 9,
  },
  {
    message:
      "The best time to plant a tree was 20 years ago. The second best time is now.",
    category: "inspirational",
    tags: ["timing", "action", "growth"],
    luckyNumbers: [3, 18, 27, 35, 49, 63],
    popularity: 8,
  },
  {
    message:
      "Success is not final, failure is not fatal: it is the courage to continue that counts.",
    category: "inspirational",
    tags: ["success", "failure", "courage", "persistence"],
    luckyNumbers: [9, 16, 24, 38, 47, 55],
    popularity: 9,
  },
  {
    message: "Believe you can and you're halfway there.",
    category: "inspirational",
    tags: ["belief", "confidence", "achievement"],
    luckyNumbers: [2, 11, 29, 33, 44, 51],
    popularity: 8,
  },
  {
    message: "The only way to do great work is to love what you do.",
    category: "inspirational",
    tags: ["work", "passion", "greatness"],
    luckyNumbers: [5, 12, 21, 36, 43, 58],
    popularity: 9,
  },
  {
    message: "It does not matter how slowly you go as long as you do not stop.",
    category: "inspirational",
    tags: ["persistence", "progress", "determination"],
    luckyNumbers: [8, 15, 22, 37, 46, 59],
    popularity: 7,
  },
  {
    message: "In the middle of difficulty lies opportunity.",
    category: "inspirational",
    tags: ["opportunity", "difficulty", "challenge"],
    luckyNumbers: [4, 13, 25, 32, 48, 57],
    popularity: 8,
  },
  {
    message: "The journey of a thousand miles begins with one step.",
    category: "inspirational",
    tags: ["journey", "beginning", "progress"],
    luckyNumbers: [6, 17, 28, 39, 45, 61],
    popularity: 9,
  },
  {
    message:
      "What lies behind us and what lies before us are tiny matters compared to what lies within us.",
    category: "inspirational",
    tags: ["inner strength", "potential", "self-belief"],
    luckyNumbers: [10, 20, 30, 40, 50, 60],
    popularity: 8,
  },
  {
    message: "The mind is everything. What you think you become.",
    category: "inspirational",
    tags: ["mindset", "thoughts", "transformation"],
    luckyNumbers: [1, 8, 15, 22, 29, 36],
    popularity: 9,
  },
  {
    message: "Every accomplishment starts with the decision to try.",
    category: "inspirational",
    tags: ["decision", "trying", "accomplishment"],
    luckyNumbers: [11, 22, 33, 44, 55, 66],
    popularity: 8,
  },
  {
    message:
      "You are never too old to set another goal or to dream a new dream.",
    category: "inspirational",
    tags: ["goals", "dreams", "age"],
    luckyNumbers: [7, 19, 31, 43, 55, 67],
    popularity: 8,
  },
  {
    message: "The secret of getting ahead is getting started.",
    category: "inspirational",
    tags: ["starting", "progress", "action"],
    luckyNumbers: [3, 14, 25, 36, 47, 58],
    popularity: 9,
  },
  {
    message: "Your potential is endless. Go do what you were created to do.",
    category: "inspirational",
    tags: ["potential", "purpose", "action"],
    luckyNumbers: [8, 16, 24, 32, 40, 48],
    popularity: 8,
  },
  {
    message:
      "Stars can't shine without darkness. Your struggles make you stronger.",
    category: "inspirational",
    tags: ["struggles", "strength", "perseverance"],
    luckyNumbers: [5, 17, 29, 41, 53, 65],
    popularity: 8,
  },
  {
    message:
      "The only limit to your impact is your imagination and commitment.",
    category: "inspirational",
    tags: ["impact", "imagination", "commitment"],
    luckyNumbers: [2, 14, 26, 38, 50, 62],
    popularity: 7,
  },
  {
    message: "Today's preparation determines tomorrow's achievement.",
    category: "inspirational",
    tags: ["preparation", "achievement", "future"],
    luckyNumbers: [9, 18, 27, 36, 45, 54],
    popularity: 8,
  },
  {
    message:
      "Your life does not get better by chance, it gets better by change.",
    category: "inspirational",
    tags: ["change", "improvement", "life"],
    luckyNumbers: [4, 13, 22, 31, 40, 49],
    popularity: 9,
  },
  {
    message: "Dream big. Start small. Act now.",
    category: "inspirational",
    tags: ["dreams", "action", "starting"],
    luckyNumbers: [1, 11, 21, 31, 41, 51],
    popularity: 9,
  },
  {
    message:
      "The harder you work for something, the greater you'll feel when you achieve it.",
    category: "inspirational",
    tags: ["hard work", "achievement", "satisfaction"],
    luckyNumbers: [6, 15, 24, 33, 42, 51],
    popularity: 8,
  },
  {
    message: "Don't wait for opportunity. Create it.",
    category: "inspirational",
    tags: ["opportunity", "creation", "proactive"],
    luckyNumbers: [7, 16, 25, 34, 43, 52],
    popularity: 9,
  },
  {
    message: "Courage is not the absence of fear, but the triumph over it.",
    category: "inspirational",
    tags: ["courage", "fear", "triumph"],
    luckyNumbers: [8, 17, 26, 35, 44, 53],
    popularity: 8,
  },
  {
    message: "Small daily improvements lead to stunning results.",
    category: "inspirational",
    tags: ["improvement", "consistency", "results"],
    luckyNumbers: [3, 12, 21, 30, 39, 48],
    popularity: 8,
  },
  {
    message: "Your attitude determines your direction.",
    category: "inspirational",
    tags: ["attitude", "direction", "mindset"],
    luckyNumbers: [5, 14, 23, 32, 41, 50],
    popularity: 8,
  },
  {
    message: "The comeback is always stronger than the setback.",
    category: "inspirational",
    tags: ["comeback", "setback", "resilience"],
    luckyNumbers: [9, 19, 29, 39, 49, 59],
    popularity: 9,
  },
];

// Funny Messages (25+)
const funnyMessages: Omit<FortuneMessage, "id" | "dateAdded">[] = [
  {
    message: "You will find happiness with a new love... probably your cat.",
    category: "funny",
    tags: ["love", "pets", "humor"],
    luckyNumbers: [13, 26, 39, 52, 65, 4],
    popularity: 8,
  },
  {
    message: "A closed mouth gathers no foot.",
    category: "funny",
    tags: ["wisdom", "humor", "speaking"],
    luckyNumbers: [7, 21, 35, 49, 63, 14],
    popularity: 7,
  },
  {
    message: "You will be hungry again in one hour.",
    category: "funny",
    tags: ["food", "humor", "prediction"],
    luckyNumbers: [1, 11, 22, 33, 44, 55],
    popularity: 9,
  },
  {
    message: "Help! I'm being held prisoner in a fortune cookie factory!",
    category: "funny",
    tags: ["meta", "humor", "factory"],
    luckyNumbers: [6, 18, 30, 42, 54, 66],
    popularity: 8,
  },
  {
    message:
      "The early bird might get the worm, but the second mouse gets the cheese.",
    category: "funny",
    tags: ["timing", "strategy", "humor"],
    luckyNumbers: [2, 14, 26, 38, 50, 62],
    popularity: 8,
  },
  {
    message: "You are not illiterate.",
    category: "funny",
    tags: ["obvious", "humor", "reading"],
    luckyNumbers: [9, 18, 27, 36, 45, 54],
    popularity: 6,
  },
  {
    message: "Ignore previous fortune.",
    category: "funny",
    tags: ["meta", "humor", "contradiction"],
    luckyNumbers: [3, 15, 27, 39, 51, 63],
    popularity: 7,
  },
  {
    message: "You will receive a fortune cookie.",
    category: "funny",
    tags: ["meta", "obvious", "humor"],
    luckyNumbers: [12, 24, 36, 48, 60, 5],
    popularity: 7,
  },
  {
    message: "Beware of cookies bearing fortunes.",
    category: "funny",
    tags: ["meta", "warning", "humor"],
    luckyNumbers: [8, 16, 24, 32, 40, 48],
    popularity: 6,
  },
  {
    message: "You are reading a fortune cookie.",
    category: "funny",
    tags: ["obvious", "meta", "humor"],
    luckyNumbers: [4, 8, 12, 16, 20, 24],
    popularity: 5,
  },
  {
    message:
      "Your future is as bright as your past is dark... which isn't saying much.",
    category: "funny",
    tags: ["future", "sarcasm", "humor"],
    luckyNumbers: [11, 22, 33, 44, 55, 66],
    popularity: 7,
  },
  {
    message: "You will soon be hungry again. Order more Chinese food.",
    category: "funny",
    tags: ["food", "hunger", "humor"],
    luckyNumbers: [5, 15, 25, 35, 45, 55],
    popularity: 8,
  },
  {
    message: "A wise man once said nothing. He was probably eating.",
    category: "funny",
    tags: ["wisdom", "eating", "humor"],
    luckyNumbers: [7, 17, 27, 37, 47, 57],
    popularity: 8,
  },
  {
    message: "Your lucky numbers are: All of them. You'll need the luck.",
    category: "funny",
    tags: ["luck", "numbers", "humor"],
    luckyNumbers: [1, 2, 3, 4, 5, 6],
    popularity: 7,
  },
  {
    message: "Today you will make progress... toward your refrigerator.",
    category: "funny",
    tags: ["progress", "food", "humor"],
    luckyNumbers: [8, 18, 28, 38, 48, 58],
    popularity: 8,
  },
  {
    message: "The answer you seek is in another cookie.",
    category: "funny",
    tags: ["meta", "answers", "humor"],
    luckyNumbers: [10, 20, 30, 40, 50, 60],
    popularity: 7,
  },
  {
    message: "Your socks will bring you great fortune... if you wear them.",
    category: "funny",
    tags: ["socks", "absurd", "humor"],
    luckyNumbers: [3, 13, 23, 33, 43, 53],
    popularity: 6,
  },
  {
    message: "You will soon meet a tall, dark stranger... in the mirror.",
    category: "funny",
    tags: ["stranger", "self", "humor"],
    luckyNumbers: [6, 16, 26, 36, 46, 56],
    popularity: 7,
  },
  {
    message: "Error 404: Fortune not found.",
    category: "funny",
    tags: ["tech", "error", "humor"],
    luckyNumbers: [4, 0, 4, 14, 24, 34],
    popularity: 8,
  },
  {
    message: "This fortune intentionally left blank.",
    category: "funny",
    tags: ["blank", "meta", "humor"],
    luckyNumbers: [0, 0, 0, 0, 0, 0],
    popularity: 6,
  },
  {
    message:
      "You will find what you're looking for in the last place you look. Obviously.",
    category: "funny",
    tags: ["search", "obvious", "humor"],
    luckyNumbers: [9, 19, 29, 39, 49, 59],
    popularity: 7,
  },
  {
    message:
      "A journey of a thousand miles begins with a single step... and comfortable shoes.",
    category: "funny",
    tags: ["journey", "shoes", "humor"],
    luckyNumbers: [1, 12, 23, 34, 45, 56],
    popularity: 7,
  },
  {
    message: "Your pet goldfish is plotting against you.",
    category: "funny",
    tags: ["pets", "absurd", "humor"],
    luckyNumbers: [2, 13, 24, 35, 46, 57],
    popularity: 6,
  },
  {
    message: "Congratulations! You can read.",
    category: "funny",
    tags: ["reading", "obvious", "humor"],
    luckyNumbers: [5, 16, 27, 38, 49, 60],
    popularity: 6,
  },
  {
    message: "You have just wasted time reading this fortune.",
    category: "funny",
    tags: ["time", "meta", "humor"],
    luckyNumbers: [0, 11, 22, 33, 44, 55],
    popularity: 7,
  },
];

// Love & Relationship Messages (20+)
const loveMessages: Omit<FortuneMessage, "id" | "dateAdded">[] = [
  {
    message: "Love is the bridge between two hearts.",
    category: "love",
    tags: ["love", "connection", "hearts"],
    luckyNumbers: [14, 28, 42, 56, 7, 21],
    popularity: 8,
  },
  {
    message: "The best love is the kind that awakens the soul.",
    category: "love",
    tags: ["love", "soul", "awakening"],
    luckyNumbers: [11, 22, 33, 44, 55, 66],
    popularity: 9,
  },
  {
    message: "True love stories never have endings.",
    category: "love",
    tags: ["true love", "eternal", "stories"],
    luckyNumbers: [2, 12, 22, 32, 42, 52],
    popularity: 8,
  },
  {
    message:
      "Love is not about finding the right person, but being the right person.",
    category: "love",
    tags: ["love", "self-improvement", "relationships"],
    luckyNumbers: [5, 15, 25, 35, 45, 55],
    popularity: 9,
  },
  {
    message: "In the arithmetic of love, one plus one equals everything.",
    category: "love",
    tags: ["love", "mathematics", "unity"],
    luckyNumbers: [1, 11, 21, 31, 41, 51],
    popularity: 7,
  },
  {
    message: "Love recognizes no barriers.",
    category: "love",
    tags: ["love", "barriers", "universal"],
    luckyNumbers: [6, 16, 26, 36, 46, 56],
    popularity: 8,
  },
  {
    message: "The heart wants what it wants.",
    category: "love",
    tags: ["heart", "desire", "love"],
    luckyNumbers: [9, 19, 29, 39, 49, 59],
    popularity: 7,
  },
  {
    message: "Love is friendship set on fire.",
    category: "love",
    tags: ["love", "friendship", "passion"],
    luckyNumbers: [3, 13, 23, 33, 43, 53],
    popularity: 8,
  },
  {
    message: "A loving heart is the truest wisdom.",
    category: "love",
    tags: ["love", "wisdom", "heart"],
    luckyNumbers: [7, 17, 27, 37, 47, 57],
    popularity: 8,
  },
  {
    message: "Where there is love, there is life.",
    category: "love",
    tags: ["love", "life", "vitality"],
    luckyNumbers: [4, 14, 24, 34, 44, 54],
    popularity: 9,
  },
  {
    message:
      "The greatest thing you'll ever learn is just to love and be loved in return.",
    category: "love",
    tags: ["love", "learning", "reciprocity"],
    luckyNumbers: [8, 18, 28, 38, 48, 58],
    popularity: 9,
  },
  {
    message: "Love isn't something you find. Love is something that finds you.",
    category: "love",
    tags: ["love", "discovery", "fate"],
    luckyNumbers: [10, 20, 30, 40, 50, 60],
    popularity: 8,
  },
  {
    message: "To love and be loved is to feel the sun from both sides.",
    category: "love",
    tags: ["love", "warmth", "reciprocity"],
    luckyNumbers: [12, 24, 36, 48, 60, 6],
    popularity: 8,
  },
  {
    message: "Love is composed of a single soul inhabiting two bodies.",
    category: "love",
    tags: ["love", "soul", "unity"],
    luckyNumbers: [2, 14, 26, 38, 50, 62],
    popularity: 8,
  },
  {
    message:
      "Keep love in your heart. A life without it is like a sunless garden.",
    category: "love",
    tags: ["love", "heart", "life"],
    luckyNumbers: [5, 17, 29, 41, 53, 65],
    popularity: 7,
  },
  {
    message: "Love is the master key that opens the gates of happiness.",
    category: "love",
    tags: ["love", "happiness", "key"],
    luckyNumbers: [7, 19, 31, 43, 55, 67],
    popularity: 8,
  },
  {
    message:
      "Romance is thinking about your significant other when you should be thinking about something else.",
    category: "love",
    tags: ["romance", "thinking", "distraction"],
    luckyNumbers: [3, 15, 27, 39, 51, 63],
    popularity: 7,
  },
  {
    message: "A true love affair never ends.",
    category: "love",
    tags: ["love", "eternal", "affair"],
    luckyNumbers: [9, 21, 33, 45, 57, 69],
    popularity: 7,
  },
  {
    message: "The best thing to hold onto in life is each other.",
    category: "love",
    tags: ["love", "holding", "life"],
    luckyNumbers: [11, 23, 35, 47, 59, 71],
    popularity: 9,
  },
  {
    message: "You will soon find the love that has been seeking you.",
    category: "love",
    tags: ["love", "future", "seeking"],
    luckyNumbers: [14, 28, 42, 56, 70, 7],
    popularity: 8,
  },
];

// Success & Career Messages (20+)
const successMessages: Omit<FortuneMessage, "id" | "dateAdded">[] = [
  {
    message: "Success is where preparation and opportunity meet.",
    category: "success",
    tags: ["success", "preparation", "opportunity"],
    luckyNumbers: [10, 20, 30, 40, 50, 60],
    popularity: 9,
  },
  {
    message: "The way to get started is to quit talking and begin doing.",
    category: "success",
    tags: ["action", "beginning", "doing"],
    luckyNumbers: [7, 14, 21, 28, 35, 42],
    popularity: 8,
  },
  {
    message: "Innovation distinguishes between a leader and a follower.",
    category: "success",
    tags: ["innovation", "leadership", "distinction"],
    luckyNumbers: [4, 17, 29, 41, 53, 65],
    popularity: 8,
  },
  {
    message: "Don't be afraid to give up the good to go for the great.",
    category: "success",
    tags: ["courage", "excellence", "improvement"],
    luckyNumbers: [8, 16, 24, 32, 40, 48],
    popularity: 9,
  },
  {
    message: "Your limitation—it's only your imagination.",
    category: "success",
    tags: ["limitations", "imagination", "potential"],
    luckyNumbers: [12, 24, 36, 48, 60, 3],
    popularity: 8,
  },
  {
    message:
      "Success is not the key to happiness. Happiness is the key to success.",
    category: "success",
    tags: ["success", "happiness", "key"],
    luckyNumbers: [5, 15, 25, 35, 45, 55],
    popularity: 9,
  },
  {
    message: "The only impossible journey is the one you never begin.",
    category: "success",
    tags: ["journey", "beginning", "possibility"],
    luckyNumbers: [1, 13, 25, 37, 49, 61],
    popularity: 8,
  },
  {
    message: "Great things never come from comfort zones.",
    category: "success",
    tags: ["comfort zone", "growth", "greatness"],
    luckyNumbers: [9, 18, 27, 36, 45, 54],
    popularity: 9,
  },
  {
    message:
      "The difference between ordinary and extraordinary is that little extra.",
    category: "success",
    tags: ["effort", "extraordinary", "difference"],
    luckyNumbers: [6, 16, 26, 36, 46, 56],
    popularity: 8,
  },
  {
    message:
      "Success usually comes to those who are too busy to be looking for it.",
    category: "success",
    tags: ["success", "busy", "work"],
    luckyNumbers: [3, 13, 23, 33, 43, 53],
    popularity: 8,
  },
  {
    message: "Your career is about to take an unexpected and exciting turn.",
    category: "success",
    tags: ["career", "change", "excitement"],
    luckyNumbers: [11, 22, 33, 44, 55, 66],
    popularity: 8,
  },
  {
    message: "A promotion or new opportunity is on the horizon.",
    category: "success",
    tags: ["promotion", "opportunity", "future"],
    luckyNumbers: [7, 17, 27, 37, 47, 57],
    popularity: 8,
  },
  {
    message: "Your hard work will soon pay off in ways you never expected.",
    category: "success",
    tags: ["hard work", "reward", "surprise"],
    luckyNumbers: [8, 18, 28, 38, 48, 58],
    popularity: 9,
  },
  {
    message:
      "The successful warrior is the average person with laser-like focus.",
    category: "success",
    tags: ["focus", "warrior", "success"],
    luckyNumbers: [2, 14, 26, 38, 50, 62],
    popularity: 8,
  },
  {
    message:
      "Success is walking from failure to failure with no loss of enthusiasm.",
    category: "success",
    tags: ["success", "failure", "enthusiasm"],
    luckyNumbers: [4, 15, 26, 37, 48, 59],
    popularity: 8,
  },
  {
    message: "Your talent combined with hard work will open doors.",
    category: "success",
    tags: ["talent", "hard work", "doors"],
    luckyNumbers: [5, 16, 27, 38, 49, 60],
    popularity: 8,
  },
  {
    message:
      "Winners are not people who never fail, but people who never quit.",
    category: "success",
    tags: ["winners", "persistence", "quitting"],
    luckyNumbers: [1, 12, 23, 34, 45, 56],
    popularity: 9,
  },
  {
    message: "The only place success comes before work is in the dictionary.",
    category: "success",
    tags: ["success", "work", "order"],
    luckyNumbers: [9, 19, 29, 39, 49, 59],
    popularity: 7,
  },
  {
    message: "Your next chapter is going to be amazing.",
    category: "success",
    tags: ["future", "chapter", "amazing"],
    luckyNumbers: [10, 20, 30, 40, 50, 60],
    popularity: 8,
  },
  {
    message: "Every expert was once a beginner. Keep learning.",
    category: "success",
    tags: ["learning", "expert", "growth"],
    luckyNumbers: [6, 17, 28, 39, 50, 61],
    popularity: 8,
  },
];

// Wisdom Messages (20+)
const wisdomMessages: Omit<FortuneMessage, "id" | "dateAdded">[] = [
  {
    message: "Be yourself; everyone else is already taken.",
    category: "wisdom",
    tags: ["authenticity", "self", "uniqueness"],
    luckyNumbers: [12, 24, 36, 41, 53, 65],
    popularity: 9,
  },
  {
    message:
      "Two roads diverged in a wood, and I took the one less traveled by, and that has made all the difference.",
    category: "wisdom",
    tags: ["choices", "path", "difference"],
    luckyNumbers: [14, 28, 35, 49, 56, 63],
    popularity: 8,
  },
  {
    message:
      "Yesterday is history, tomorrow is a mystery, today is a gift of God, which is why we call it the present.",
    category: "wisdom",
    tags: ["time", "present", "gift"],
    luckyNumbers: [7, 21, 28, 42, 49, 56],
    popularity: 9,
  },
  {
    message:
      "Don't judge each day by the harvest you reap but by the seeds that you plant.",
    category: "wisdom",
    tags: ["judgment", "growth", "planting"],
    luckyNumbers: [11, 22, 33, 44, 55, 66],
    popularity: 8,
  },
  {
    message:
      "It is during our darkest moments that we must focus to see the light.",
    category: "wisdom",
    tags: ["darkness", "light", "focus"],
    luckyNumbers: [5, 10, 25, 40, 55, 65],
    popularity: 8,
  },
  {
    message:
      "The greatest glory in living lies not in never falling, but in rising every time we fall.",
    category: "wisdom",
    tags: ["glory", "falling", "rising"],
    luckyNumbers: [39, 7, 28, 56, 11, 64],
    popularity: 9,
  },
  {
    message: "Life is what happens when you're busy making other plans.",
    category: "wisdom",
    tags: ["life", "plans", "living"],
    luckyNumbers: [3, 15, 27, 39, 51, 63],
    popularity: 8,
  },
  {
    message: "The only true wisdom is in knowing you know nothing.",
    category: "wisdom",
    tags: ["wisdom", "knowledge", "humility"],
    luckyNumbers: [8, 16, 24, 32, 40, 48],
    popularity: 8,
  },
  {
    message:
      "In three words I can sum up everything I've learned about life: it goes on.",
    category: "wisdom",
    tags: ["life", "continuation", "learning"],
    luckyNumbers: [3, 13, 23, 33, 43, 53],
    popularity: 8,
  },
  {
    message: "The unexamined life is not worth living.",
    category: "wisdom",
    tags: ["life", "examination", "worth"],
    luckyNumbers: [6, 18, 30, 42, 54, 66],
    popularity: 7,
  },
  {
    message: "Knowing yourself is the beginning of all wisdom.",
    category: "wisdom",
    tags: ["self-knowledge", "wisdom", "beginning"],
    luckyNumbers: [1, 12, 23, 34, 45, 56],
    popularity: 9,
  },
  {
    message:
      "The fool doth think he is wise, but the wise man knows himself to be a fool.",
    category: "wisdom",
    tags: ["wisdom", "fool", "self-knowledge"],
    luckyNumbers: [4, 16, 28, 40, 52, 64],
    popularity: 7,
  },
  {
    message: "Patience is bitter, but its fruit is sweet.",
    category: "wisdom",
    tags: ["patience", "fruit", "reward"],
    luckyNumbers: [9, 18, 27, 36, 45, 54],
    popularity: 8,
  },
  {
    message:
      "A wise person learns more from their enemies than a fool from their friends.",
    category: "wisdom",
    tags: ["learning", "enemies", "friends"],
    luckyNumbers: [2, 14, 26, 38, 50, 62],
    popularity: 7,
  },
  {
    message: "The only thing we have to fear is fear itself.",
    category: "wisdom",
    tags: ["fear", "courage", "mindset"],
    luckyNumbers: [7, 17, 27, 37, 47, 57],
    popularity: 9,
  },
  {
    message:
      "To be yourself in a world that is constantly trying to make you something else is the greatest accomplishment.",
    category: "wisdom",
    tags: ["authenticity", "world", "accomplishment"],
    luckyNumbers: [5, 15, 25, 35, 45, 55],
    popularity: 8,
  },
  {
    message: "It is not the mountain we conquer, but ourselves.",
    category: "wisdom",
    tags: ["mountain", "self", "conquest"],
    luckyNumbers: [10, 20, 30, 40, 50, 60],
    popularity: 8,
  },
  {
    message:
      "The mind that opens to a new idea never returns to its original size.",
    category: "wisdom",
    tags: ["mind", "ideas", "growth"],
    luckyNumbers: [8, 19, 30, 41, 52, 63],
    popularity: 8,
  },
  {
    message: "Silence is a true friend who never betrays.",
    category: "wisdom",
    tags: ["silence", "friend", "trust"],
    luckyNumbers: [11, 22, 33, 44, 55, 66],
    popularity: 7,
  },
  {
    message: "Those who cannot change their minds cannot change anything.",
    category: "wisdom",
    tags: ["change", "mind", "flexibility"],
    luckyNumbers: [3, 14, 25, 36, 47, 58],
    popularity: 8,
  },
];

// Friendship Messages (20+) - NEW
const friendshipMessages: Omit<FortuneMessage, "id" | "dateAdded">[] = [
  {
    message: "A true friend is one soul in two bodies.",
    category: "friendship",
    tags: ["friendship", "soul", "connection"],
    luckyNumbers: [2, 14, 26, 38, 50, 62],
    popularity: 9,
  },
  {
    message:
      "Friendship is born at that moment when one person says to another: 'What! You too?'",
    category: "friendship",
    tags: ["friendship", "connection", "discovery"],
    luckyNumbers: [7, 17, 27, 37, 47, 57],
    popularity: 8,
  },
  {
    message: "A friend is someone who knows all about you and still loves you.",
    category: "friendship",
    tags: ["friendship", "acceptance", "love"],
    luckyNumbers: [11, 22, 33, 44, 55, 66],
    popularity: 9,
  },
  {
    message:
      "Good friends are like stars. You don't always see them, but you know they're always there.",
    category: "friendship",
    tags: ["friendship", "stars", "presence"],
    luckyNumbers: [5, 15, 25, 35, 45, 55],
    popularity: 9,
  },
  {
    message:
      "Friendship is the only cement that will ever hold the world together.",
    category: "friendship",
    tags: ["friendship", "world", "unity"],
    luckyNumbers: [1, 12, 23, 34, 45, 56],
    popularity: 8,
  },
  {
    message: "A sweet friendship refreshes the soul.",
    category: "friendship",
    tags: ["friendship", "sweet", "soul"],
    luckyNumbers: [8, 18, 28, 38, 48, 58],
    popularity: 8,
  },
  {
    message: "Friends are the family you choose.",
    category: "friendship",
    tags: ["friendship", "family", "choice"],
    luckyNumbers: [3, 13, 23, 33, 43, 53],
    popularity: 9,
  },
  {
    message:
      "A loyal friend laughs at your jokes when they're not so good, and sympathizes with your problems when they're not so bad.",
    category: "friendship",
    tags: ["friendship", "loyalty", "support"],
    luckyNumbers: [6, 16, 26, 36, 46, 56],
    popularity: 8,
  },
  {
    message:
      "Walking with a friend in the dark is better than walking alone in the light.",
    category: "friendship",
    tags: ["friendship", "dark", "light"],
    luckyNumbers: [9, 19, 29, 39, 49, 59],
    popularity: 8,
  },
  {
    message:
      "A real friend is one who walks in when the rest of the world walks out.",
    category: "friendship",
    tags: ["friendship", "real", "support"],
    luckyNumbers: [4, 14, 24, 34, 44, 54],
    popularity: 9,
  },
  {
    message:
      "Friendship improves happiness and abates misery by the doubling of our joy and the dividing of our grief.",
    category: "friendship",
    tags: ["friendship", "happiness", "grief"],
    luckyNumbers: [10, 20, 30, 40, 50, 60],
    popularity: 7,
  },
  {
    message:
      "One of the most beautiful qualities of true friendship is to understand and to be understood.",
    category: "friendship",
    tags: ["friendship", "understanding", "beauty"],
    luckyNumbers: [12, 24, 36, 48, 60, 6],
    popularity: 8,
  },
  {
    message: "A friend is what the heart needs all the time.",
    category: "friendship",
    tags: ["friendship", "heart", "need"],
    luckyNumbers: [7, 17, 27, 37, 47, 57],
    popularity: 8,
  },
  {
    message:
      "There is nothing I would not do for those who are really my friends.",
    category: "friendship",
    tags: ["friendship", "dedication", "loyalty"],
    luckyNumbers: [5, 15, 25, 35, 45, 55],
    popularity: 7,
  },
  {
    message: "New friends await you in unexpected places. Stay open.",
    category: "friendship",
    tags: ["friendship", "new", "openness"],
    luckyNumbers: [3, 14, 25, 36, 47, 58],
    popularity: 8,
  },
  {
    message: "The language of friendship is not words but meanings.",
    category: "friendship",
    tags: ["friendship", "language", "meaning"],
    luckyNumbers: [8, 18, 28, 38, 48, 58],
    popularity: 7,
  },
  {
    message:
      "Be slow to fall into friendship, but when you are in, continue firm and constant.",
    category: "friendship",
    tags: ["friendship", "patience", "constancy"],
    luckyNumbers: [9, 19, 29, 39, 49, 59],
    popularity: 7,
  },
  {
    message:
      "Friendship is the golden thread that ties the heart of all the world.",
    category: "friendship",
    tags: ["friendship", "golden", "heart"],
    luckyNumbers: [11, 22, 33, 44, 55, 66],
    popularity: 8,
  },
  {
    message:
      "True friends are never apart, maybe in distance but never in heart.",
    category: "friendship",
    tags: ["friendship", "distance", "heart"],
    luckyNumbers: [2, 13, 24, 35, 46, 57],
    popularity: 9,
  },
  {
    message: "A day spent with friends is a day well spent.",
    category: "friendship",
    tags: ["friendship", "time", "joy"],
    luckyNumbers: [1, 11, 21, 31, 41, 51],
    popularity: 8,
  },
];

// Birthday Messages (20+) - NEW
const birthdayMessages: Omit<FortuneMessage, "id" | "dateAdded">[] = [
  {
    message:
      "This year, your birthday wishes will come true in unexpected ways.",
    category: "birthday",
    tags: ["birthday", "wishes", "fortune"],
    luckyNumbers: [1, 12, 23, 34, 45, 56],
    popularity: 9,
  },
  {
    message: "A new age brings new adventures and wonderful surprises.",
    category: "birthday",
    tags: ["birthday", "adventures", "surprises"],
    luckyNumbers: [7, 17, 27, 37, 47, 57],
    popularity: 8,
  },
  {
    message:
      "May your birthday mark the beginning of a wonderful period of time.",
    category: "birthday",
    tags: ["birthday", "beginning", "time"],
    luckyNumbers: [3, 13, 23, 33, 43, 53],
    popularity: 8,
  },
  {
    message: "The coming year holds the keys to many doors of opportunity.",
    category: "birthday",
    tags: ["birthday", "opportunity", "year"],
    luckyNumbers: [5, 15, 25, 35, 45, 55],
    popularity: 8,
  },
  {
    message:
      "Age is merely the number of years the world has been enjoying you.",
    category: "birthday",
    tags: ["birthday", "age", "joy"],
    luckyNumbers: [9, 18, 27, 36, 45, 54],
    popularity: 9,
  },
  {
    message:
      "Your next year will be filled with laughter, love, and prosperity.",
    category: "birthday",
    tags: ["birthday", "laughter", "prosperity"],
    luckyNumbers: [11, 22, 33, 44, 55, 66],
    popularity: 9,
  },
  {
    message: "Every candle on your cake is a wish waiting to come true.",
    category: "birthday",
    tags: ["birthday", "candles", "wishes"],
    luckyNumbers: [2, 14, 26, 38, 50, 62],
    popularity: 8,
  },
  {
    message: "The best is yet to come. Happy birthday!",
    category: "birthday",
    tags: ["birthday", "future", "happiness"],
    luckyNumbers: [8, 16, 24, 32, 40, 48],
    popularity: 9,
  },
  {
    message: "May this birthday bring you closer to all your dreams.",
    category: "birthday",
    tags: ["birthday", "dreams", "wishes"],
    luckyNumbers: [4, 14, 24, 34, 44, 54],
    popularity: 8,
  },
  {
    message: "A birthday is not just a year older, but a year wiser.",
    category: "birthday",
    tags: ["birthday", "age", "wisdom"],
    luckyNumbers: [6, 17, 28, 39, 50, 61],
    popularity: 8,
  },
  {
    message:
      "Your birthday is nature's way of telling you to celebrate yourself.",
    category: "birthday",
    tags: ["birthday", "celebration", "self"],
    luckyNumbers: [10, 20, 30, 40, 50, 60],
    popularity: 8,
  },
  {
    message: "This birthday begins a new chapter. Make it a bestseller.",
    category: "birthday",
    tags: ["birthday", "chapter", "story"],
    luckyNumbers: [1, 11, 21, 31, 41, 51],
    popularity: 8,
  },
  {
    message:
      "Count your life by smiles, not tears. Count your age by friends, not years.",
    category: "birthday",
    tags: ["birthday", "smiles", "friends"],
    luckyNumbers: [12, 24, 36, 48, 60, 6],
    popularity: 9,
  },
  {
    message: "May your special day be the beginning of an extraordinary year.",
    category: "birthday",
    tags: ["birthday", "special", "extraordinary"],
    luckyNumbers: [7, 19, 31, 43, 55, 67],
    popularity: 8,
  },
  {
    message:
      "Birthdays are a new start, a fresh beginning, and a time to pursue dreams.",
    category: "birthday",
    tags: ["birthday", "new start", "dreams"],
    luckyNumbers: [3, 15, 27, 39, 51, 63],
    popularity: 8,
  },
  {
    message:
      "Your birthday is the first day of another 365-day journey around the sun.",
    category: "birthday",
    tags: ["birthday", "journey", "sun"],
    luckyNumbers: [3, 6, 5, 12, 24, 36],
    popularity: 7,
  },
  {
    message: "With age comes wisdom, and with wisdom comes great happiness.",
    category: "birthday",
    tags: ["birthday", "wisdom", "happiness"],
    luckyNumbers: [8, 18, 28, 38, 48, 58],
    popularity: 8,
  },
  {
    message:
      "Growing older is mandatory, but growing up is optional. Stay young at heart.",
    category: "birthday",
    tags: ["birthday", "growing", "young"],
    luckyNumbers: [5, 16, 27, 38, 49, 60],
    popularity: 8,
  },
  {
    message:
      "May today be the start of a wonderful, glorious, and joyful year!",
    category: "birthday",
    tags: ["birthday", "start", "joy"],
    luckyNumbers: [9, 21, 33, 45, 57, 69],
    popularity: 8,
  },
  {
    message: "Another year of life is another chance to achieve your dreams.",
    category: "birthday",
    tags: ["birthday", "life", "dreams"],
    luckyNumbers: [4, 15, 26, 37, 48, 59],
    popularity: 8,
  },
];

// Study & Motivation Messages (20+) - NEW
const studyMessages: Omit<FortuneMessage, "id" | "dateAdded">[] = [
  {
    message:
      "The more you study, the more you know. The more you know, the more you grow.",
    category: "study",
    tags: ["study", "knowledge", "growth"],
    luckyNumbers: [7, 14, 21, 28, 35, 42],
    popularity: 8,
  },
  {
    message: "Success in exams comes to those who prepare with dedication.",
    category: "study",
    tags: ["study", "exams", "preparation"],
    luckyNumbers: [3, 13, 23, 33, 43, 53],
    popularity: 9,
  },
  {
    message: "Your next test will reveal the strength you didn't know you had.",
    category: "study",
    tags: ["study", "test", "strength"],
    luckyNumbers: [9, 18, 27, 36, 45, 54],
    popularity: 8,
  },
  {
    message: "Education is the passport to the future. Invest in it wisely.",
    category: "study",
    tags: ["study", "education", "future"],
    luckyNumbers: [5, 15, 25, 35, 45, 55],
    popularity: 9,
  },
  {
    message: "The expert in anything was once a beginner. Keep studying.",
    category: "study",
    tags: ["study", "expert", "beginner"],
    luckyNumbers: [1, 12, 23, 34, 45, 56],
    popularity: 8,
  },
  {
    message:
      "Your brain is a muscle. The more you exercise it, the stronger it gets.",
    category: "study",
    tags: ["study", "brain", "exercise"],
    luckyNumbers: [8, 16, 24, 32, 40, 48],
    popularity: 8,
  },
  {
    message: "Every hour of studying is a step closer to your dreams.",
    category: "study",
    tags: ["study", "hours", "dreams"],
    luckyNumbers: [6, 17, 28, 39, 50, 61],
    popularity: 8,
  },
  {
    message:
      "The pain of studying is temporary. The pride of achievement is forever.",
    category: "study",
    tags: ["study", "pain", "achievement"],
    luckyNumbers: [11, 22, 33, 44, 55, 66],
    popularity: 9,
  },
  {
    message: "Good grades follow good study habits. Build yours today.",
    category: "study",
    tags: ["study", "grades", "habits"],
    luckyNumbers: [4, 14, 24, 34, 44, 54],
    popularity: 8,
  },
  {
    message:
      "A mind that is stretched by new knowledge never returns to its old dimensions.",
    category: "study",
    tags: ["study", "mind", "knowledge"],
    luckyNumbers: [10, 20, 30, 40, 50, 60],
    popularity: 8,
  },
  {
    message:
      "Your academic breakthrough is just around the corner. Keep pushing.",
    category: "study",
    tags: ["study", "academic", "breakthrough"],
    luckyNumbers: [2, 13, 24, 35, 46, 57],
    popularity: 8,
  },
  {
    message: "Study hard, for the well is deep, and our brains are shallow.",
    category: "study",
    tags: ["study", "hard work", "depth"],
    luckyNumbers: [7, 17, 27, 37, 47, 57],
    popularity: 7,
  },
  {
    message: "The only way to learn is to never stop studying.",
    category: "study",
    tags: ["study", "learning", "continuous"],
    luckyNumbers: [3, 14, 25, 36, 47, 58],
    popularity: 8,
  },
  {
    message: "Focus on your studies now, and your future self will thank you.",
    category: "study",
    tags: ["study", "focus", "future"],
    luckyNumbers: [9, 19, 29, 39, 49, 59],
    popularity: 9,
  },
  {
    message: "Knowledge is power. Empower yourself through education.",
    category: "study",
    tags: ["study", "knowledge", "power"],
    luckyNumbers: [5, 16, 27, 38, 49, 60],
    popularity: 8,
  },
  {
    message:
      "Your concentration and focus will lead to excellent exam results.",
    category: "study",
    tags: ["study", "concentration", "exams"],
    luckyNumbers: [8, 18, 28, 38, 48, 58],
    popularity: 8,
  },
  {
    message:
      "Learning is not a destination but a lifelong journey. Embrace it.",
    category: "study",
    tags: ["study", "learning", "journey"],
    luckyNumbers: [1, 11, 21, 31, 41, 51],
    popularity: 8,
  },
  {
    message:
      "The seeds of knowledge you plant today will grow into forests of opportunity.",
    category: "study",
    tags: ["study", "knowledge", "opportunity"],
    luckyNumbers: [6, 17, 28, 39, 50, 61],
    popularity: 8,
  },
  {
    message:
      "Stay curious, stay hungry for knowledge, and success will follow.",
    category: "study",
    tags: ["study", "curiosity", "success"],
    luckyNumbers: [4, 15, 26, 37, 48, 59],
    popularity: 8,
  },
  {
    message:
      "Your dedication to learning will open doors you never knew existed.",
    category: "study",
    tags: ["study", "dedication", "doors"],
    luckyNumbers: [12, 24, 36, 48, 60, 6],
    popularity: 9,
  },
];

// Health Messages (keeping minimal for now)
const healthMessages: Omit<FortuneMessage, "id" | "dateAdded">[] = [
  {
    message: "Good health is the greatest wealth you can possess.",
    category: "health",
    tags: ["health", "wealth", "body"],
    luckyNumbers: [7, 14, 21, 28, 35, 42],
    popularity: 8,
  },
  {
    message: "A healthy outside starts from the inside.",
    category: "health",
    tags: ["health", "inside", "outside"],
    luckyNumbers: [3, 13, 23, 33, 43, 53],
    popularity: 8,
  },
  {
    message: "Take care of your body. It's the only place you have to live.",
    category: "health",
    tags: ["health", "body", "care"],
    luckyNumbers: [1, 11, 21, 31, 41, 51],
    popularity: 9,
  },
  {
    message: "Your body hears everything your mind says. Stay positive.",
    category: "health",
    tags: ["health", "body", "mind"],
    luckyNumbers: [5, 15, 25, 35, 45, 55],
    popularity: 8,
  },
  {
    message: "A moment of relaxation is worth a lifetime of stress.",
    category: "health",
    tags: ["health", "relaxation", "stress"],
    luckyNumbers: [9, 18, 27, 36, 45, 54],
    popularity: 8,
  },
];

// Travel Messages (keeping minimal for now)
const travelMessages: Omit<FortuneMessage, "id" | "dateAdded">[] = [
  {
    message: "Adventure awaits those who dare to explore.",
    category: "travel",
    tags: ["travel", "adventure", "explore"],
    luckyNumbers: [7, 14, 21, 28, 35, 42],
    popularity: 8,
  },
  {
    message:
      "The world is a book, and those who do not travel read only one page.",
    category: "travel",
    tags: ["travel", "world", "book"],
    luckyNumbers: [3, 13, 23, 33, 43, 53],
    popularity: 9,
  },
  {
    message: "Your next journey will bring wisdom and joy.",
    category: "travel",
    tags: ["travel", "journey", "wisdom"],
    luckyNumbers: [5, 15, 25, 35, 45, 55],
    popularity: 8,
  },
  {
    message: "Pack your bags. Destiny is calling you to new horizons.",
    category: "travel",
    tags: ["travel", "destiny", "horizons"],
    luckyNumbers: [9, 18, 27, 36, 45, 54],
    popularity: 8,
  },
  {
    message: "Travel far, travel wide, and discover who you truly are.",
    category: "travel",
    tags: ["travel", "discovery", "self"],
    luckyNumbers: [1, 11, 21, 31, 41, 51],
    popularity: 8,
  },
];

// Combine all messages and add IDs and dates
export const fortuneDatabase: FortuneMessage[] = [
  ...inspirationalMessages,
  ...funnyMessages,
  ...loveMessages,
  ...successMessages,
  ...wisdomMessages,
  ...friendshipMessages,
  ...birthdayMessages,
  ...studyMessages,
  ...healthMessages,
  ...travelMessages,
].map((message, index) => ({
  ...message,
  id: `fortune_${index + 1}`,
  dateAdded: new Date(2024, 0, 1 + (index % 365)).toISOString(),
}));

// Search and filter functions
export function searchFortunes(
  query: string,
  category?: string,
): FortuneMessage[] {
  const searchTerm = query.toLowerCase().trim();

  return fortuneDatabase.filter((fortune) => {
    const matchesCategory = !category || fortune.category === category;
    const matchesSearch =
      !searchTerm ||
      fortune.message.toLowerCase().includes(searchTerm) ||
      fortune.tags.some((tag) => tag.toLowerCase().includes(searchTerm));

    return matchesCategory && matchesSearch;
  });
}

export function getFortunesByCategory(category: string): FortuneMessage[] {
  return fortuneDatabase.filter((fortune) => fortune.category === category);
}

export function getPopularFortunes(limit: number = 10): FortuneMessage[] {
  return fortuneDatabase
    .sort((a, b) => b.popularity - a.popularity)
    .slice(0, limit);
}

export function getRandomFortune(category?: string): FortuneMessage {
  const filteredFortunes = category
    ? getFortunesByCategory(category)
    : fortuneDatabase;

  if (filteredFortunes.length === 0) {
    throw new Error("No fortunes available");
  }

  const randomIndex = Math.floor(Math.random() * filteredFortunes.length);
  const fortune = filteredFortunes[randomIndex];

  if (!fortune) {
    throw new Error("Failed to select fortune");
  }

  return fortune;
}

export function getFortuneById(id: string): FortuneMessage | undefined {
  return fortuneDatabase.find((fortune) => fortune.id === id);
}

// Get all available categories
export function getAvailableCategories(): string[] {
  return Array.from(new Set(fortuneDatabase.map((f) => f.category)));
}

// Statistics
export function getDatabaseStats() {
  const categories = fortuneDatabase.reduce(
    (acc, fortune) => {
      acc[fortune.category] = (acc[fortune.category] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  return {
    total: fortuneDatabase.length,
    categories,
    averagePopularity:
      fortuneDatabase.reduce((sum, f) => sum + f.popularity, 0) /
      fortuneDatabase.length,
    tags: Array.from(new Set(fortuneDatabase.flatMap((f) => f.tags))).length,
  };
}
