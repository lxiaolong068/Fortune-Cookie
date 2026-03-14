/**
 * pSEO Data: Audience-Based Fortune Cookie Messages
 *
 * Powers: /fortune-cookie-messages-for/[audience]
 * Template C: "Fortune Cookie Messages for [Audience]" (20-25 pages)
 */

export interface AudienceSubcategory {
  name: string;
  messages: string[];
}

export interface AudienceTip {
  title: string;
  description: string;
}

export interface AudienceFAQ {
  question: string;
  answer: string;
}

export interface AudienceData {
  slug: string;
  title: string;
  badge: string;
  emoji: string;
  description: string;
  metaTitle: string;
  metaDescription: string;
  subcategories: AudienceSubcategory[];
  tips: AudienceTip[];
  faqs: AudienceFAQ[];
  relatedAudiences: string[];
  group: "family" | "relationships" | "professional" | "social";
}

// ---------------------------------------------------------------------------
// PROFESSIONAL
// ---------------------------------------------------------------------------

const teachers: AudienceData = {
  slug: "teachers",
  title: "Fortune Cookie Messages for Teachers",
  badge: "45+ Messages",
  emoji: "🍎",
  description:
    "Honor the educators who shape futures with thoughtful, funny, and inspiring fortune cookie messages made especially for teachers.",
  metaTitle: "45+ Fortune Cookie Messages for Teachers | Funny & Heartfelt",
  metaDescription:
    "Show your teacher appreciation with 45+ fortune cookie messages for teachers! Funny, heartfelt & inspiring sayings for Teacher Appreciation Week & gifts.",
  subcategories: [
    {
      name: "Heartfelt Appreciation",
      messages: [
        "A great teacher doesn't teach — they inspire a love of learning.",
        "The influence of a good teacher can never be erased.",
        "You plant seeds every day. Some will bloom long after you're gone.",
        "Teaching is the profession that creates all other professions.",
        "One teacher can change a student's entire life — you are that teacher.",
        "The world is better because of educators like you.",
        "Thank you for seeing potential in students who couldn't see it in themselves.",
        "Your patience and passion make the difference between giving up and pushing through.",
        "A great teacher is both a gardener and an architect.",
        "You don't just teach subjects — you teach people how to become.",
      ],
    },
    {
      name: "Funny Teacher Fortunes",
      messages: [
        "Teaching: the only job where you repeat yourself and somehow stay sane.",
        "May your coffee be strong and your students' attention spans be longer.",
        "You survived another school year. That's the real miracle.",
        "Fortune predicts: someone will sharpen a pencil at the worst possible moment.",
        "May all your test papers be graded by magical beings by morning.",
        "You were the favorite teacher. They just didn't say it.",
        "The lesson plan rarely survives first contact with the class. And yet here you are.",
        "May your holidays be actual holidays — no grading allowed.",
        "You have more patience than any fortune cookie could ever describe.",
        "You make multiplication tables interesting. You are a superhero.",
      ],
    },
    {
      name: "Inspirational for Educators",
      messages: [
        "Teaching is not a job — it's a calling you answered.",
        "Education is not filling a pail but lighting a fire.",
        "The best teachers give their students the confidence to eventually not need them.",
        "Your enthusiasm for learning is the most contagious thing in the classroom.",
        "A teacher who loves their students changes them forever.",
        "Keep going — the student who needs you most may not know it yet.",
        "Every lesson is a gift, even when it doesn't feel like it.",
        "You are shaping the future — one student at a time.",
        "The ripples of your teaching extend further than you'll ever know.",
        "Thank you for choosing this. It matters more than anything.",
      ],
    },
  ],
  tips: [
    {
      title: "Teacher Appreciation Week",
      description:
        "Give fortune cookies with teacher-specific messages during Teacher Appreciation Week — a personal, affordable gift that stands out from mugs and gift cards.",
    },
    {
      title: "Student Group Gift",
      description:
        "Have students each contribute a fortune slip with a personal thank-you message — compile them into a custom fortune cookie gift bag from the whole class.",
    },
    {
      title: "End of Year Send-Off",
      description:
        "Present fortune cookies at the end-of-year class celebration — a sweet send-off that teachers and students remember long after graduation.",
    },
  ],
  faqs: [
    {
      question: "What are good fortune cookie messages for teachers?",
      answer:
        "The best teacher fortune cookies balance genuine appreciation ('The influence of a good teacher can never be erased') with teacher-specific humor ('May all your test papers be graded by magical beings by morning').",
    },
    {
      question: "Are fortune cookies a good Teacher Appreciation gift?",
      answer:
        "Yes! Custom fortune cookies with teacher-specific messages are a creative, affordable, and memorable appreciation gift. Pair with a card for extra impact.",
    },
    {
      question: "What should I write for a teacher in a fortune cookie?",
      answer:
        "Acknowledge their specific impact — the subject they teach, the way they handle the classroom, or a moment they helped you. Personal specificity makes the message truly special.",
    },
  ],
  relatedAudiences: ["students", "nurses", "boss-coworkers", "employees"],
  group: "professional",
};

const students: AudienceData = {
  slug: "students",
  title: "Fortune Cookie Messages for Students",
  badge: "45+ Messages",
  emoji: "📖",
  description:
    "Encourage every student on their academic journey with motivating, funny, and supportive fortune cookie messages.",
  metaTitle: "45+ Fortune Cookie Messages for Students | Inspiring & Funny",
  metaDescription:
    "Motivate students with 45+ fortune cookie messages! Inspiring, funny & encouraging sayings for studying, exams & academic life. Free to copy.",
  subcategories: [
    {
      name: "Study & Academic Motivation",
      messages: [
        "Every hour you study today is an investment in who you become tomorrow.",
        "The expert in anything was once a beginner — keep learning.",
        "Your education is a passport. Every lesson is a stamp.",
        "Difficult subjects are the ones that teach you the most.",
        "The difference between ordinary and extraordinary is a little extra study.",
        "Struggle is how the brain grows. Keep struggling.",
        "What you learn today, no one can ever take from you.",
        "Knowledge compounds — the more you know, the easier it is to know more.",
        "Great grades follow great effort. Trust the process.",
        "Learning is not a sprint — it's the most rewarding marathon.",
      ],
    },
    {
      name: "Exam & Test Encouragement",
      messages: [
        "You know more than you think. Trust what you've prepared.",
        "The test is a conversation — answer with confidence.",
        "You've studied. You're ready. Show what you know.",
        "Breathe. Think. Write. You've got this.",
        "Every exam is just a snapshot — it doesn't define your full picture.",
        "Fortune favors the prepared — and you are prepared.",
        "Start with what you know and let the rest follow.",
        "One question at a time. You've answered them all before.",
        "Your hard work has already done the heavy lifting — the exam is just a chance to show it.",
        "Pressure creates diamonds. You're in the process.",
      ],
    },
    {
      name: "Student Life Humor",
      messages: [
        "May your deadlines be flexible and your WiFi be strong.",
        "Coffee: because adulting is hard and class is early.",
        "Your laptop battery will last exactly as long as the lecture doesn't.",
        "Fortune predicts: the essay is due tonight. You knew this.",
        "May the curve be ever in your favor.",
        "Sleep, study, social life — pick two. (You'll cycle through all three.)",
        "Your GPA doesn't define you. Your curiosity does.",
        "The library is your best friend. It knows things.",
        "May you find parking and never run out of printer toner.",
        "You survived the semester. That is the qualification.",
      ],
    },
  ],
  tips: [
    {
      title: "Study Break Treat",
      description:
        "Fortune cookies make a great study break reward — set one out for every two hours of studying and save the funny ones for after the exam.",
    },
    {
      title: "Exam Day Encouragement",
      description:
        "Give a classmate a fortune cookie before a big exam as a small gesture of good luck — it's memorable and kind.",
    },
    {
      title: "Dorm Room Gift",
      description:
        "Include fortune cookies in a care package to a friend away at college — the funny ones especially make dormitory life a little brighter.",
    },
  ],
  faqs: [
    {
      question: "What are good fortune cookie messages for students?",
      answer:
        "The best student fortune cookies balance motivation ('Every hour you study today is an investment in who you become') with relatable humor ('May the curve be ever in your favor').",
    },
    {
      question: "How do fortune cookies help students?",
      answer:
        "A well-timed encouraging message can genuinely shift a student's mindset before an exam or during a tough semester. Fortune cookies are a low-cost, high-impact way to offer support.",
    },
    {
      question: "Are fortune cookies good for study groups?",
      answer:
        "Yes! Fortune cookies are a fun study group icebreaker or reward. Read them aloud at the start or end of a study session for a mood boost.",
    },
  ],
  relatedAudiences: ["teachers", "teens", "kids", "employees"],
  group: "professional",
};

const employees: AudienceData = {
  slug: "employees",
  title: "Fortune Cookie Messages for Employees",
  badge: "40+ Messages",
  emoji: "💼",
  description:
    "Motivate, recognize, and energize your workforce with fortune cookie messages crafted specifically for employees at every level.",
  metaTitle: "40+ Fortune Cookie Messages for Employees | Recognition & Humor",
  metaDescription:
    "Recognize and motivate employees with 40+ fortune cookie messages! Sincere, funny & energizing sayings for employee recognition & gifts.",
  subcategories: [
    {
      name: "Recognition & Appreciation",
      messages: [
        "Your work doesn't just get done — it gets done well. That's rare.",
        "The effort you put in every day is the foundation this team builds on.",
        "Excellence is a choice made repeatedly. You make it look natural.",
        "Great teams are made of people who choose to give their best. Thank you.",
        "Your dedication is not just noticed — it's valued deeply.",
        "Every contribution you make matters more than you know.",
        "The team is stronger because of what you bring.",
        "Your reliability is one of this team's greatest assets.",
        "Hard work and consistency — that's you. Thank you.",
        "What you do every day creates the results everyone celebrates.",
      ],
    },
    {
      name: "Motivation & Drive",
      messages: [
        "Your best work is the foundation of everything that follows.",
        "Show up fully today — it matters more than you think.",
        "Great careers are built one excellent day at a time.",
        "The goal is progress, not perfection — keep moving.",
        "Your potential is larger than your current assignment.",
        "Stay curious, stay hungry — that's the formula.",
        "Every challenge you navigate makes you more capable.",
        "The work you do today is the experience you'll leverage tomorrow.",
        "Your trajectory is determined by the quality of your effort — keep choosing excellence.",
        "Impact starts small and compounds. Keep going.",
      ],
    },
    {
      name: "Workplace Humor",
      messages: [
        "You make the commute worth it.",
        "Fortune predicts: your great idea will be credited to someone else in the meeting.",
        "May your inbox stay manageable and your calendar have white space.",
        "You are the office MVP — don't tell everyone, they'll all want raises.",
        "The printer is afraid of you. In a good way.",
        "May your Mondays feel like Fridays at least occasionally.",
        "Officially the most indispensable person in the office. HR doesn't know this.",
        "May all your meetings end early and your projects finish on time.",
        "You've survived every team reorganization. A true survivor.",
        "Fortune says: today is a good day not to reply all.",
      ],
    },
  ],
  tips: [
    {
      title: "Performance Review Companion",
      description:
        "Add a fortune cookie with a personalized recognition message to a performance review meeting — it humanizes the process and makes the recognition memorable.",
    },
    {
      title: "Random Acts of Recognition",
      description:
        "Leave fortune cookies on employee desks on random Tuesdays — unexpected recognition is more powerful than expected appreciation.",
    },
    {
      title: "New Hire Welcome Kit",
      description:
        "Include a fortune cookie in a new employee welcome kit — a warm, human touch that signals a culture of appreciation from day one.",
    },
  ],
  faqs: [
    {
      question: "What are good fortune cookie messages for employees?",
      answer:
        "The best employee fortune cookies are specific to the work experience — 'Your reliability is one of this team's greatest assets' or the funnier 'May all your meetings end early and your projects finish on time.'",
    },
    {
      question: "How can managers use fortune cookies for employee recognition?",
      answer:
        "Leave fortune cookies with handwritten notes on employee desks, include them in recognition packages, distribute them at team meetings, or use them as small prizes for team achievements.",
    },
    {
      question: "Are fortune cookies an effective employee appreciation gift?",
      answer:
        "Yes — especially when paired with a personalized message. Fortune cookies are memorable, affordable, and show thought. They work best as part of a broader recognition culture.",
    },
  ],
  relatedAudiences: ["boss-coworkers", "teachers", "nurses", "students"],
  group: "professional",
};

const nurses: AudienceData = {
  slug: "nurses",
  title: "Fortune Cookie Messages for Nurses",
  badge: "40+ Messages",
  emoji: "🏥",
  description:
    "Honor the caregivers who give everything with heartfelt, funny, and deeply appreciative fortune cookie messages for nurses and healthcare workers.",
  metaTitle: "40+ Fortune Cookie Messages for Nurses | Appreciation & Humor",
  metaDescription:
    "Appreciate nurses with 40+ fortune cookie messages! Heartfelt, funny & sincere sayings for Nurses Week, hospital gifts & healthcare appreciation.",
  subcategories: [
    {
      name: "Deep Appreciation",
      messages: [
        "What you do in the hardest moments is what heroes are made of.",
        "You hold lives in your hands — and you do it with grace.",
        "Nursing is a calling, and you answered it beautifully.",
        "The care you give changes outcomes in ways medicine alone cannot.",
        "You see people at their most vulnerable and make them feel safe. That is extraordinary.",
        "Your patience and compassion heal more than your hands ever could.",
        "Thank you for choosing the hardest, most important work.",
        "In the middle of someone's worst day, you are often the best thing in the room.",
        "The strength you carry on every shift is humbling.",
        "Healthcare workers like you are the reason people make it through.",
      ],
    },
    {
      name: "Funny Nurse Fortunes",
      messages: [
        "May your shift end on time and your coffee stay warm the whole way.",
        "You deserve a break — and not the kind where you're still answering questions.",
        "Fortune predicts: someone will press the call button the moment you sit down.",
        "May your patients be cooperative and your charting be swift.",
        "You have seen things no fortune cookie can prepare you for. And you're still here.",
        "Twelve-hour shifts: not for the faint of heart. You have the strongest heart.",
        "May the break room snacks be restocked when you most need them.",
        "You can survive anything — you've already done it every day.",
        "The scrubs look great. The bags under your eyes? Earned.",
        "Off-duty nurse: still mentally diagnosing everything. And everyone.",
      ],
    },
    {
      name: "Resilience & Strength",
      messages: [
        "The strength you need is the strength you've always had.",
        "You carry so much — don't forget to rest, too.",
        "Even caregivers need care. Take yours.",
        "Your resilience is a gift — don't spend all of it on the clock.",
        "What you carry home from work has weight. You don't have to carry it alone.",
        "Self-care isn't selfish — it's what sustains your ability to care for others.",
        "The work is hard. So are you.",
        "You can't pour from an empty cup. Fill yours.",
        "Rest is not a reward — it's a requirement for someone who gives as much as you do.",
        "You are doing extraordinary work. Don't forget to be gentle with yourself.",
      ],
    },
  ],
  tips: [
    {
      title: "Nurses Week Gift",
      description:
        "Fortune cookies with nurse-specific messages make a thoughtful, affordable Nurses Week gift — add a small note of specific appreciation for extra impact.",
    },
    {
      title: "Break Room Treat",
      description:
        "Leave a basket of fortune cookies in the nurses' break room with a note of appreciation — they'll grab one between patients and feel seen.",
    },
    {
      title: "Patient's Thank You",
      description:
        "Patients or families who want to thank their nursing team can give fortune cookies with heartfelt messages — a personal gift that feels meaningful.",
    },
  ],
  faqs: [
    {
      question: "What are good fortune cookie messages for nurses?",
      answer:
        "The best nurse fortune cookies combine deep respect with realistic humor — 'You hold lives in your hands and do it with grace' and 'Fortune predicts: someone will press the call button the moment you sit down.'",
    },
    {
      question: "What is a good nurse appreciation gift?",
      answer:
        "Custom fortune cookies with nurse-specific messages are a creative, affordable appreciation gift. They're especially popular for Nurses Week or to thank a nurse who cared for someone you love.",
    },
    {
      question: "How do you thank a nurse with a fortune cookie?",
      answer:
        "Choose a message that acknowledges their specific work — the long shifts, the emotional weight, the care they give. Personal specificity makes the gratitude feel genuine.",
    },
  ],
  relatedAudiences: ["employees", "teachers", "boss-coworkers", "parents"],
  group: "professional",
};

// ---------------------------------------------------------------------------
// RELATIONSHIPS
// ---------------------------------------------------------------------------

const couples: AudienceData = {
  slug: "couples",
  title: "Fortune Cookie Messages for Couples",
  badge: "50+ Messages",
  emoji: "💑",
  description:
    "Celebrate your relationship with romantic, funny, and heartfelt fortune cookie messages perfectly crafted for two.",
  metaTitle: "50+ Fortune Cookie Messages for Couples | Romantic & Funny",
  metaDescription:
    "Share love with 50+ fortune cookie messages for couples! Romantic, funny & heartfelt sayings for date nights, anniversaries & Valentine's Day.",
  subcategories: [
    {
      name: "Romantic & Intimate",
      messages: [
        "The best adventures are the ones you take together.",
        "You are better together than you are apart.",
        "In a world full of people, you found each other. That's the miracle.",
        "Love grows when two people choose each other every single day.",
        "Side by side is the best place to face anything.",
        "The best kind of love is the kind that makes you both better.",
        "Your story is one of the great ones — keep writing it.",
        "May your love only deepen with every shared season.",
        "You are each other's home — and home is where everything begins.",
        "The universe knew what it was doing when it brought you two together.",
      ],
    },
    {
      name: "Funny Couple Fortunes",
      messages: [
        "You've found someone who tolerates your weirdness. Marry them.",
        "The secret to a happy relationship: snacks and low expectations.",
        "May you never run out of things to talk about — or comfortable silence.",
        "Netflix disagreement resolved: alphabetical order.",
        "Love is: putting your phone down to actually be present. Sometimes.",
        "The couple that laughs together, stays together. Keep laughing.",
        "You have found your person. Now hide the remote.",
        "May your Google Home never mishear your arguments.",
        "It takes two to argue — but only one to say sorry first.",
        "You are each other's favorite human. And occasional annoyance. Both.",
      ],
    },
    {
      name: "Date Night & Everyday Love",
      messages: [
        "The ordinary moments you share become the extraordinary memories you keep.",
        "A date night is just an excuse to remember why you chose each other.",
        "Love is found in the little things — make the little things count.",
        "May every dinner be a chance to fall a little more in love.",
        "The best dates are the ones where you forget to check your phones.",
        "Being with you makes everything an adventure.",
        "Today's date night is tomorrow's favorite memory.",
        "Let the routine be full of small moments of love.",
        "A couple who plays together, stays together.",
        "The best investment you make each week is time together.",
      ],
    },
  ],
  tips: [
    {
      title: "Date Night Surprise",
      description:
        "End a date night with a custom fortune cookie — have the message reveal your next date idea or something you love about them.",
    },
    {
      title: "Anniversary Ritual",
      description:
        "Start an annual tradition of sharing fortune cookies on your anniversary — read this year's fortunes and talk about how the year unfolded.",
    },
    {
      title: "Long Distance Love",
      description:
        "Mail fortune cookies with personalized messages to a long-distance partner — a tangible reminder that you're thinking of them.",
    },
  ],
  faqs: [
    {
      question: "What are cute fortune cookie messages for couples?",
      answer:
        "Cute couple fortunes balance romance with playfulness — 'You've found someone who tolerates your weirdness. Marry them.' or 'The best adventures are the ones you take together.'",
    },
    {
      question: "How can you use fortune cookies as a couple?",
      answer:
        "Read them on date nights, include in anniversary gifts, use as a couple's journal prompt, or make it a ritual: break one fortune cookie together every Sunday morning.",
    },
    {
      question: "What fortune cookie messages are good for Valentine's Day?",
      answer:
        "Romantic fortunes like 'You are each other's home' or funny ones like 'May you never run out of things to talk about — or comfortable silence' work perfectly for Valentine's Day.",
    },
  ],
  relatedAudiences: ["boyfriend", "girlfriend", "husband", "wife"],
  group: "relationships",
};

const bestFriend: AudienceData = {
  slug: "best-friend",
  title: "Fortune Cookie Messages for Best Friends",
  badge: "45+ Messages",
  emoji: "👯",
  description:
    "Celebrate your best friend with hilarious, heartfelt, and perfectly accurate fortune cookie messages that only someone who truly knows you could write.",
  metaTitle: "45+ Fortune Cookie Messages for Best Friends | Funny & Heartfelt",
  metaDescription:
    "Show your best friend some love with 45+ fortune cookie messages! Funny, heartfelt & perfectly relatable sayings for best friends. Free to copy.",
  subcategories: [
    {
      name: "True Friendship",
      messages: [
        "A best friend is the rarest kind of treasure — and you found one.",
        "True friends are the ones who know your story and still choose to be in it.",
        "Best friends are the family you get to choose.",
        "A good friend knows all your stories; a best friend has lived them with you.",
        "In a world full of acquaintances, best friends are the miracle.",
        "The best thing about a best friend is that they know the real you — and love that person.",
        "Side by side or miles apart, best friends are always close at heart.",
        "You don't need a hundred friends — you need one like this.",
        "The years go by, but the best friendships don't have to.",
        "Your best friend chose you just as much as you chose them.",
      ],
    },
    {
      name: "Funny Best Friend Fortunes",
      messages: [
        "Your best friend knows where to hide the evidence. Keep them.",
        "You two are the kind of friends who can say nothing and still have the best conversation.",
        "Real friends don't let you wear that. Except sometimes they do for the photos.",
        "Fortune predicts: your best friend will text back immediately. To complain about something else.",
        "You've seen each other's worst days and are still here. Impressive.",
        "Best friend rule: you can roast each other, but no one else can.",
        "May you always have enough dirt on each other to ensure mutual loyalty.",
        "The best kind of friend doesn't judge your terrible ideas. They join you.",
        "Your friendship is either heartwarming or concerning. Probably both.",
        "Best friends: 'I'll bring snacks' is the highest form of love.",
      ],
    },
    {
      name: "Short & Sweet",
      messages: [
        "Grateful for you every day.",
        "You're stuck with me.",
        "Always your person.",
        "We're the weirdest and the best.",
        "Best. Decision. Ever.",
        "You get me.",
        "Lucky to call you mine.",
        "Real one, always.",
        "My person, forever.",
        "Thanks for being you.",
      ],
    },
  ],
  tips: [
    {
      title: "Bestie Care Package",
      description:
        "Include fortune cookies in a best friend care package — choose funny ones that reference your inside jokes for maximum impact.",
    },
    {
      title: "Galentine's Day",
      description:
        "Gift best friend fortune cookies on Galentine's Day or Friend Appreciation Day as a sweet, affordable gesture of love.",
    },
    {
      title: "Hard Times Support",
      description:
        "Send fortune cookies to a best friend going through a difficult time — encouraging messages remind them they're not alone.",
    },
  ],
  faqs: [
    {
      question: "What are funny fortune cookie messages for best friends?",
      answer:
        "Funny best friend fortunes celebrate the specific weirdness of your friendship — 'Your best friend knows where to hide the evidence. Keep them.' or 'You've seen each other's worst days and are still here. Impressive.'",
    },
    {
      question: "Are fortune cookies a good best friend gift?",
      answer:
        "Yes! Fortune cookies with personalized or best-friend-specific messages are a creative, affordable gift. They're especially fun when they reference your specific friendship dynamics.",
    },
    {
      question: "What should I write in a fortune cookie for my best friend?",
      answer:
        "Reference something specific to your friendship — an inside joke, a shared memory, or a quality you love about them. Generic messages are nice; specific ones are unforgettable.",
    },
  ],
  relatedAudiences: ["couples", "friends", "girlfriend", "boyfriend"],
  group: "relationships",
};

const kids: AudienceData = {
  slug: "kids",
  title: "Fortune Cookie Messages for Kids",
  badge: "45+ Messages",
  emoji: "🌟",
  description:
    "Delight young minds with age-appropriate, fun, and encouraging fortune cookie messages that spark wonder and build confidence.",
  metaTitle: "45+ Fortune Cookie Messages for Kids | Fun & Encouraging",
  metaDescription:
    "Delight children with 45+ fortune cookie messages for kids! Fun, encouraging & age-appropriate sayings for lunchboxes, parties & school events.",
  subcategories: [
    {
      name: "Encouraging & Empowering",
      messages: [
        "You are braver than you know and smarter than you think.",
        "Every big dream starts with one small step — and you've already taken it.",
        "There is no one in the world exactly like you — that's a superpower.",
        "The most important opinion about you is your own.",
        "You have the power to make today amazing.",
        "Mistakes are not failures — they're how you learn.",
        "Be kind, be curious, be you.",
        "Your imagination is one of the most powerful things in the world.",
        "The sky is not the limit — it's just the beginning.",
        "You can do hard things.",
      ],
    },
    {
      name: "Fun & Playful",
      messages: [
        "Today is a great day to try something new.",
        "Adventure is everywhere — even in your backyard.",
        "The best way to have a friend is to be one.",
        "Laughter is the best superpower — use it often.",
        "Kindness is always the right answer.",
        "Even superheroes have bad days. What matters is getting up.",
        "The world needs your ideas — don't keep them to yourself.",
        "Today's challenge: find something that makes you laugh.",
        "You are growing into someone truly amazing.",
        "There's magic in trying — don't stop.",
      ],
    },
    {
      name: "School & Learning",
      messages: [
        "Every question you ask makes you smarter.",
        "Reading opens doors to worlds that don't exist yet.",
        "Math is just puzzles with numbers — and you love puzzles.",
        "The smartest thing you can do is ask for help.",
        "School is where you discover the things you're great at.",
        "Every subject you learn is a door you can open later.",
        "The best students make mistakes and try again.",
        "Learning feels hard because growing feels hard — keep going.",
        "Your teacher believes in you — and so do we.",
        "One more question. One more answer. Keep going.",
      ],
    },
  ],
  tips: [
    {
      title: "Lunchbox Surprise",
      description:
        "Tuck a fortune cookie into your child's lunchbox with an encouraging message — a midday surprise that builds confidence.",
    },
    {
      title: "Birthday Party Favor",
      description:
        "Kids birthday parties love fortune cookies — use age-appropriate funny and encouraging messages for a memorable party favor.",
    },
    {
      title: "Bedtime Ritual",
      description:
        "Make reading a fortune cookie part of a bedtime ritual — choose encouraging messages to send kids to sleep with positive thoughts.",
    },
  ],
  faqs: [
    {
      question: "What are good fortune cookie messages for kids?",
      answer:
        "Kid-friendly fortunes should be encouraging, imaginative, and age-appropriate — 'You are braver than you know' or 'There is no one in the world exactly like you — that's a superpower.'",
    },
    {
      question: "Are fortune cookies safe for children?",
      answer:
        "Fortune cookies are generally safe for children over 3-4, as the cookie is hard and could be a choking hazard for very young toddlers. Always supervise young children.",
    },
    {
      question: "How can I use fortune cookies to encourage kids?",
      answer:
        "Put them in lunchboxes, use them as rewards for good behavior, read them aloud at dinner, or make them part of a homework-reward ritual. Kids love the surprise element.",
    },
  ],
  relatedAudiences: ["students", "parents", "teachers", "teens"],
  group: "family",
};

const parents: AudienceData = {
  slug: "parents",
  title: "Fortune Cookie Messages for Parents",
  badge: "40+ Messages",
  emoji: "👨‍👩‍👧",
  description:
    "Honor the parents in your life with warm, funny, and deeply appreciative fortune cookie messages that celebrate the world's hardest job.",
  metaTitle: "40+ Fortune Cookie Messages for Parents | Warm & Funny",
  metaDescription:
    "Celebrate parents with 40+ fortune cookie messages! Warm, funny & heartfelt sayings for Mother's Day, Father's Day, birthdays & everyday appreciation.",
  subcategories: [
    {
      name: "Heartfelt Appreciation",
      messages: [
        "The love of a parent is the first and greatest gift.",
        "Good parents give their children roots and wings.",
        "You showed up every single day — that is everything.",
        "The sacrifices you make will never fully be counted, but they are felt.",
        "Being your child is one of the greatest gifts of my life.",
        "You are the reason I know what love looks like.",
        "Everything good in me was first modeled by you.",
        "Thank you for making our house a home.",
        "The world is better because of the values you passed on.",
        "No one works harder or loves more than a great parent.",
      ],
    },
    {
      name: "Funny Parent Fortunes",
      messages: [
        "Parenting: the job no one trained you for that somehow you figured out.",
        "Your children didn't come with a manual. You wrote one as you went.",
        "Fortune predicts: someone will need something the moment you sit down.",
        "You pretended to know what you were doing. You were right.",
        "The car will be messy until at least 2030. This too shall pass.",
        "May your children appreciate you before they become parents themselves.",
        "'Because I said so' is now understood to be wisdom.",
        "Parenting success: your kids call you when they need advice.",
        "You survived everything they put you through. Impressive.",
        "One day they'll understand everything you did. Probably around age 30.",
      ],
    },
    {
      name: "Encouragement for Parents",
      messages: [
        "You don't have to be perfect — you just have to be present.",
        "The fact that you worry means you care. You're doing great.",
        "Parenting is the hardest thing worth doing.",
        "You are raising a human being — be patient with yourself.",
        "Good enough parenting is often exactly enough.",
        "Rest when you can. You need it more than you'll admit.",
        "Your children see you trying. That matters enormously.",
        "Nobody gets parenting perfectly right — the love makes up the difference.",
        "You are more appreciated than you know.",
        "The mess is proof of a life fully lived together.",
      ],
    },
  ],
  tips: [
    {
      title: "Mother's or Father's Day",
      description:
        "Give fortune cookies with parent-specific messages on Mother's or Father's Day — a personal touch that goes beyond the typical card.",
    },
    {
      title: "Grandparents Too",
      description:
        "These messages work equally well for grandparents — substitute 'grandparent' in any message for an equally heartfelt gift.",
    },
    {
      title: "Kids Make the Gift",
      description:
        "Have kids write their own messages on slips and insert them into fortune cookies — a handmade gift that parents treasure for years.",
    },
  ],
  faqs: [
    {
      question: "What are good fortune cookie messages for parents?",
      answer:
        "The best parent fortune cookies balance deep appreciation with the humor only parents understand — 'You survived everything they put you through. Impressive.' or 'Being your child is one of the greatest gifts of my life.'",
    },
    {
      question: "Are fortune cookies a good gift for parents?",
      answer:
        "Yes, especially when personalized. Fortune cookies with messages that reference specific things your parents did for you are far more meaningful than generic appreciation.",
    },
    {
      question: "What do you write in a fortune cookie for your parents?",
      answer:
        "Be specific about a quality you admire, a memory you cherish, or something they did that shaped you. Specificity transforms a kind sentiment into an unforgettable message.",
    },
  ],
  relatedAudiences: ["kids", "grandparents", "couples", "teachers"],
  group: "family",
};

const grandparents: AudienceData = {
  slug: "grandparents",
  title: "Fortune Cookie Messages for Grandparents",
  badge: "40+ Messages",
  emoji: "👴👵",
  description:
    "Honor grandparents with warm, loving, and sometimes playfully funny fortune cookie messages that celebrate their irreplaceable wisdom and love.",
  metaTitle: "40+ Fortune Cookie Messages for Grandparents | Warm & Loving",
  metaDescription:
    "Celebrate grandparents with 40+ fortune cookie messages! Warm, loving & funny sayings for Grandparents Day, birthdays & holiday gifts.",
  subcategories: [
    {
      name: "Love & Gratitude",
      messages: [
        "Grandparents are the bridge between who you are and where you come from.",
        "The love of a grandparent is one of life's purest gifts.",
        "Your stories are the family treasure we will always pass on.",
        "Being loved by you is one of the great joys of my life.",
        "Grandparents give us roots — and the wisdom to use them.",
        "Your warmth is the constant in a world that changes too quickly.",
        "Thank you for loving us unconditionally since before we could ask.",
        "The family is richer for everything you've given to it.",
        "Your presence in my life is a blessing I count every day.",
        "No Wi-Fi needed to feel connected when we're with you.",
      ],
    },
    {
      name: "Funny Grandparent Fortunes",
      messages: [
        "Grandparents: spoiling grandchildren is the whole point.",
        "The rules at grandma's house are delightfully different.",
        "Fortune predicts: cookies are available at grandparent headquarters.",
        "You remember everything except where you put your glasses.",
        "The best stories always start with 'back in my day...'",
        "GPS was invented because grandparents never needed it.",
        "May your grandchildren call more than once a week.",
        "You invented 'life hacks' before the internet had a name for them.",
        "The wisdom of grandparents: always carry a mint and never rush.",
        "Retirement looks good on you — mostly the part where you get to see us.",
      ],
    },
    {
      name: "Short & Tender",
      messages: [
        "Loved beyond words.",
        "Our favorite human.",
        "Wisdom personified.",
        "Family treasure.",
        "The best of us.",
        "Irreplaceable and adored.",
        "Your love is home.",
        "Grateful every day.",
        "Forever in our hearts.",
        "Thank you — for everything.",
      ],
    },
  ],
  tips: [
    {
      title: "Grandparents Day Gift",
      description:
        "Fortune cookies with grandparent-specific messages make a creative Grandparents Day gift — especially when kids write the fortunes themselves.",
    },
    {
      title: "Holiday Visit",
      description:
        "Bring fortune cookies to a holiday visit with grandparents — reading them aloud becomes a shared activity everyone enjoys.",
    },
    {
      title: "Photo Book Companion",
      description:
        "Pair fortune cookies with a family photo book gift — the photos capture the memories, the fortune adds a message about what those memories mean.",
    },
  ],
  faqs: [
    {
      question: "What are good fortune cookie messages for grandparents?",
      answer:
        "The best grandparent fortune cookies combine genuine gratitude with affectionate humor — 'Grandparents are the bridge between who you are and where you come from' or 'Grandparents: spoiling grandchildren is the whole point.'",
    },
    {
      question: "Are fortune cookies a good gift for grandparents?",
      answer:
        "Yes, especially when handwritten by grandchildren or personalized with family memories. Grandparents treasure thoughtful, personal gestures over generic gifts.",
    },
    {
      question: "How do grandchildren use fortune cookies for grandparents?",
      answer:
        "Have grandchildren write messages on fortune slips to insert into cookies, make them part of a holiday visit activity, or include in a care package with photos and drawings.",
    },
  ],
  relatedAudiences: ["parents", "kids", "couples", "best-friend"],
  group: "family",
};

const teens: AudienceData = {
  slug: "teens",
  title: "Fortune Cookie Messages for Teenagers",
  badge: "45+ Messages",
  emoji: "🎧",
  description:
    "Connect with the teens in your life using relatable, funny, and genuinely encouraging fortune cookie messages written in their language.",
  metaTitle: "45+ Fortune Cookie Messages for Teenagers | Relatable & Inspiring",
  metaDescription:
    "Reach teens with 45+ fortune cookie messages for teenagers! Relatable, funny & genuinely encouraging sayings that actually land. Free to copy.",
  subcategories: [
    {
      name: "Real Talk Encouragement",
      messages: [
        "You don't have to have it all figured out — nobody your age does.",
        "Social media shows highlights. Real life includes the messy parts. Both are valid.",
        "Your worth is not determined by your follower count.",
        "Being different is not a disadvantage — it's your edge.",
        "The opinions that matter most are the ones from people who actually know you.",
        "High school is a chapter, not the whole book.",
        "The version of you at 25 will be grateful for the choices you make now.",
        "Comparison is the fastest way to miss your own potential.",
        "The skills you're building now will matter more than the grades you're stressing about.",
        "You are not behind. Everyone is figuring it out at different speeds.",
      ],
    },
    {
      name: "Relatable & Funny",
      messages: [
        "Fortune predicts: you will check your phone immediately after reading this.",
        "Your GPA does not define you. Your playlist might.",
        "The group chat is a blessing and a curse. Handle accordingly.",
        "May your side quests be as fulfilling as your main quest.",
        "Sleep deprivation is not a personality trait. Sleep.",
        "FOMO is fake. Your couch is real. Balance.",
        "The algorithm does not know you better than you know yourself.",
        "Adulting starts sooner than advertised. You've actually been doing it.",
        "Your parents were once as confused as you are. Still kind of are.",
        "Unbothered is a skill. Practice it.",
      ],
    },
    {
      name: "Motivating & Forward-Looking",
      messages: [
        "The best parts of your story haven't happened yet.",
        "The future belongs to the curious — stay curious.",
        "Your generation is solving problems that didn't exist when the rules were written.",
        "One day you'll look back on today and see how far you've come.",
        "It's okay to be a work in progress — everyone is.",
        "Dream bigger than what anyone has planned for you.",
        "The version of yourself you're becoming is worth the effort.",
        "Not everyone will understand your path. Walk it anyway.",
        "Your potential is genuinely unlimited. Don't let anyone tell you otherwise.",
        "Hard now means easier later. Keep going.",
      ],
    },
  ],
  tips: [
    {
      title: "Non-Cringe Parent Communication",
      description:
        "Slipping a fortune cookie into a teen's bag or leaving one on their desk is a non-intrusive way to share encouragement — less awkward than a conversation, more personal than a text.",
    },
    {
      title: "School Locker Surprise",
      description:
        "A fortune cookie left in a friend's locker with an encouraging message is the kind of small gesture that stays with someone.",
    },
    {
      title: "After a Hard Day",
      description:
        "After a difficult test, breakup, or tough situation, a fortune cookie with a relevant message says 'I see you' in a low-key, teen-appropriate way.",
    },
  ],
  faqs: [
    {
      question: "What are good fortune cookie messages for teenagers?",
      answer:
        "Teen-appropriate fortunes are honest, relatable, and not preachy — 'High school is a chapter, not the whole book' or 'Your worth is not determined by your follower count' land because they're real.",
    },
    {
      question: "How can parents use fortune cookies to connect with teens?",
      answer:
        "Low-key delivery is key — leave a fortune cookie on their desk or in their bag rather than handing it to them directly. Teens respond to gestures that don't require a reaction.",
    },
    {
      question: "What fortune cookie topics resonate with teens?",
      answer:
        "Social media, identity, academic pressure, and belonging are the big teen themes. Fortunes that acknowledge these honestly — without lecturing — feel genuinely relevant.",
    },
  ],
  relatedAudiences: ["students", "kids", "best-friend", "parents"],
  group: "family",
};

const boyfriend: AudienceData = {
  slug: "boyfriend",
  title: "Fortune Cookie Messages for Your Boyfriend",
  badge: "40+ Messages",
  emoji: "💙",
  description:
    "Show your boyfriend how much he means to you with romantic, funny, and heartfelt fortune cookie messages he'll love.",
  metaTitle: "40+ Fortune Cookie Messages for Your Boyfriend | Romantic & Funny",
  metaDescription:
    "Tell your boyfriend how you feel with 40+ fortune cookie messages! Romantic, funny & heartfelt sayings for anniversaries, gifts & everyday love.",
  subcategories: [
    {
      name: "Romantic & Sweet",
      messages: [
        "You make ordinary days feel like love stories.",
        "I like you more every single day.",
        "Being with you is my favorite thing.",
        "You are exactly who I wanted to find.",
        "Lucky doesn't begin to cover how I feel about having you.",
        "You are the person I didn't know I was waiting for.",
        "My favorite version of any day is the one you're in.",
        "You make me want to be more, do more, love better.",
        "I chose right when I chose you.",
        "Every day with you is one I want to remember.",
      ],
    },
    {
      name: "Funny Boyfriend Fortunes",
      messages: [
        "You're not my better half — you're my favorite whole person.",
        "You had me at 'want to split the appetizer?'",
        "Fortune predicts: you will do something annoying and also adorable today.",
        "Your driving is questionable. Everything else is perfect.",
        "My love for you is only slightly smaller than my love for pizza. Slightly.",
        "You're stuck with me. Congratulations.",
        "The best decision I make regularly is spending time with you.",
        "Thank you for pretending my jokes are funny. Most of them.",
        "You give the best hugs. Science agrees.",
        "You're my person. Even during football season.",
      ],
    },
    {
      name: "Short & Affectionate",
      messages: [
        "Mine, and so glad.",
        "You're everything.",
        "Lucky to love you.",
        "Stay forever.",
        "You're my favorite.",
        "Always you.",
        "Best decision.",
        "Grateful every day.",
        "Choose you always.",
        "So very lucky.",
      ],
    },
  ],
  tips: [
    {
      title: "Hidden in His Things",
      description:
        "Slip a fortune cookie into his jacket pocket, gym bag, or desk drawer — a small surprise he'll discover unexpectedly.",
    },
    {
      title: "Date Night Closer",
      description:
        "End a date night with a custom fortune cookie — the message inside becomes the memory he takes home.",
    },
    {
      title: "Anniversary Gift",
      description:
        "Give 12 fortune cookies (one for each month) as an anniversary gift — each with a different message about your year together.",
    },
  ],
  faqs: [
    {
      question: "What are romantic fortune cookie messages for a boyfriend?",
      answer:
        "Romantic boyfriend fortunes feel personal and specific — 'You are exactly who I wanted to find' or 'My favorite version of any day is the one you're in' work because they're sincere without being over-the-top.",
    },
    {
      question: "How do I use a fortune cookie to tell my boyfriend I love him?",
      answer:
        "A custom fortune cookie with 'I love you' or a personal message inside is a creative, sweet way to say it — especially if it's your first time, or paired with a special occasion.",
    },
    {
      question: "What are cute funny messages for a boyfriend fortune cookie?",
      answer:
        "Funny boyfriend fortunes acknowledge the quirks of your specific relationship — 'Your driving is questionable. Everything else is perfect.' lands because it's both specific and affectionate.",
    },
  ],
  relatedAudiences: ["girlfriend", "couples", "best-friend", "husband"],
  group: "relationships",
};

const girlfriend: AudienceData = {
  slug: "girlfriend",
  title: "Fortune Cookie Messages for Your Girlfriend",
  badge: "40+ Messages",
  emoji: "💗",
  description:
    "Make her smile with romantic, funny, and heartfelt fortune cookie messages that show her exactly how much she means to you.",
  metaTitle: "40+ Fortune Cookie Messages for Your Girlfriend | Romantic & Sweet",
  metaDescription:
    "Tell your girlfriend how you feel with 40+ fortune cookie messages! Romantic, sweet & funny sayings for anniversaries, gifts & everyday love.",
  subcategories: [
    {
      name: "Romantic & Heartfelt",
      messages: [
        "You make every day brighter just by being in it.",
        "I'm grateful for you more than I say it.",
        "You are remarkable, and I notice it every single day.",
        "The best thing about my day is you.",
        "You are the kind of person who changes everything for the better.",
        "My life got measurably better when you were in it.",
        "You are beautiful — and I mean that in every sense of the word.",
        "Being with you feels like being home.",
        "You make even the hard days something I want to show up for.",
        "I'd choose you every time, without hesitation.",
      ],
    },
    {
      name: "Funny Girlfriend Fortunes",
      messages: [
        "You are equal parts brilliant, hilarious, and too much for me to handle. Perfect.",
        "I love you even when you're talking through the movie.",
        "Fortune predicts: you will be right again. You usually are.",
        "You have way too many hobbies. I love every single one of them.",
        "Your ability to find amazing restaurants is your greatest superpower.",
        "I was doing fine before you. Now I can't imagine it.",
        "My taste improved when I met you. Restaurants. Movies. Life.",
        "You make me laugh harder than anyone. That's love.",
        "Thank you for putting up with me. I know it's a lot.",
        "The best investment I've made is time with you.",
      ],
    },
    {
      name: "Short & Sweet",
      messages: [
        "You're everything.",
        "Still choosing you.",
        "Lucky every day.",
        "Always you.",
        "My favorite person.",
        "You complete it all.",
        "Grateful it's you.",
        "You're worth it.",
        "Here for it. All of it.",
        "Mine, happily.",
      ],
    },
  ],
  tips: [
    {
      title: "Morning Surprise",
      description:
        "Leave a fortune cookie on her nightstand, in the coffee she makes, or next to her phone charger — a sweet morning start that shows you were thinking of her.",
    },
    {
      title: "Valentine's Day Add-On",
      description:
        "Include fortune cookies with personalized messages in a Valentine's Day gift — more personal than a store-bought card.",
    },
    {
      title: "After a Hard Day",
      description:
        "Give a fortune cookie with an encouraging or funny message after she's had a rough day — it shows you see her and want to make her smile.",
    },
  ],
  faqs: [
    {
      question: "What are romantic fortune cookie messages for a girlfriend?",
      answer:
        "Romantic girlfriend fortunes are specific and sincere — 'You are the kind of person who changes everything for the better' or 'My life got measurably better when you were in it.'",
    },
    {
      question: "How do I use fortune cookies to show my girlfriend I care?",
      answer:
        "Leave them as surprises in unexpected places — her bag, her book, her car. The unexpected discovery makes the message more impactful than a direct handoff.",
    },
    {
      question: "What are funny fortune cookie messages for a girlfriend?",
      answer:
        "Funny girlfriend fortunes reference the specific quirks of your relationship — 'Fortune predicts: you will be right again. You usually are.' works because it's true and affectionate.",
    },
  ],
  relatedAudiences: ["boyfriend", "couples", "best-friend", "wife"],
  group: "relationships",
};

const husband: AudienceData = {
  slug: "husband",
  title: "Fortune Cookie Messages for Your Husband",
  badge: "40+ Messages",
  emoji: "💍",
  description:
    "Remind your husband why you chose him with loving, funny, and heartfelt fortune cookie messages that celebrate your life together.",
  metaTitle: "40+ Fortune Cookie Messages for Your Husband | Loving & Funny",
  metaDescription:
    "Show your husband some love with 40+ fortune cookie messages! Loving, funny & heartfelt sayings for anniversaries, gifts & everyday appreciation.",
  subcategories: [
    {
      name: "Loving & Genuine",
      messages: [
        "You are the best decision I've ever made.",
        "Marrying you was the wisest thing I ever did.",
        "You are a better husband than I knew to hope for.",
        "I am grateful for you in ways I haven't fully found words for yet.",
        "Life with you is the adventure I always wanted.",
        "You are a great partner, a great person, and my favorite human.",
        "I love who we are together.",
        "Every year with you I find more to love.",
        "You make everything better by being in it.",
        "I would choose you again, every time.",
      ],
    },
    {
      name: "Funny Husband Fortunes",
      messages: [
        "You've gotten better at loading the dishwasher. I've noticed.",
        "Fortune predicts: you will think of an excellent point five minutes after the argument ends.",
        "You are my favorite person to argue over the thermostat with.",
        "The fact that I still like you after all these years is impressive. By both of us.",
        "Thank you for pretending to listen. And for when you actually do.",
        "You leave the cabinet doors open. I love you anyway.",
        "May your side of the closet remain organized. Probably.",
        "You are the person I choose to be annoyed by, daily, forever.",
        "My standards were high. You exceeded them. Well done.",
        "Behind every great wife is a husband who does what he's told.",
      ],
    },
    {
      name: "Anniversary & Milestones",
      messages: [
        "The years only make me more certain I chose right.",
        "Our story is still the best one I know.",
        "Here's to every year that made us who we are.",
        "Growing old with you is something I look forward to.",
        "The best is yet to come — and I want all of it with you.",
        "You are worth every year and every sacrifice.",
        "May we have many more years of building this life together.",
        "The home we've built together is my greatest achievement.",
        "Still in love with the adventure that is us.",
        "Thank you for every day you chose us.",
      ],
    },
  ],
  tips: [
    {
      title: "Everyday Appreciation",
      description:
        "Leave fortune cookies in unexpected places — his car, his work bag, next to the coffee maker — for an everyday reminder that you're thinking of him.",
    },
    {
      title: "Anniversary Tradition",
      description:
        "Make fortune cookies a part of your anniversary ritual — choose a new message each year that reflects where you are in your journey together.",
    },
    {
      title: "After a Long Week",
      description:
        "Give a fortune cookie with a funny or affectionate message at the end of a hard week — it shows you see his effort and want to lighten the load.",
    },
  ],
  faqs: [
    {
      question: "What are good fortune cookie messages for a husband?",
      answer:
        "Great husband fortune cookies balance deep appreciation with the playful humor that comes from knowing someone well — 'You leave the cabinet doors open. I love you anyway.' is both funny and true.",
    },
    {
      question: "How do I surprise my husband with a fortune cookie?",
      answer:
        "Hide it somewhere he'll find it unexpectedly — his work bag, his car, tucked in his book. The surprise discovery makes the message land harder.",
    },
    {
      question: "What are romantic fortune cookie messages for a husband?",
      answer:
        "Romantic husband fortunes feel earned and specific — 'You are a better husband than I knew to hope for' or 'Every year with you I find more to love' feel true because they come from real experience.",
    },
  ],
  relatedAudiences: ["wife", "couples", "boyfriend", "best-friend"],
  group: "relationships",
};

const wife: AudienceData = {
  slug: "wife",
  title: "Fortune Cookie Messages for Your Wife",
  badge: "40+ Messages",
  emoji: "💕",
  description:
    "Celebrate the woman you married with loving, funny, and deeply heartfelt fortune cookie messages that say what you feel.",
  metaTitle: "40+ Fortune Cookie Messages for Your Wife | Loving & Heartfelt",
  metaDescription:
    "Show your wife how much she means to you with 40+ fortune cookie messages! Loving, funny & heartfelt sayings for anniversaries, gifts & everyday love.",
  subcategories: [
    {
      name: "Deeply Loving",
      messages: [
        "Marrying you was the beginning of my best years.",
        "You are everything I didn't know I needed.",
        "I am in awe of the person you are every single day.",
        "You make this family, this home, and this life what it is.",
        "The way you love is one of the most beautiful things I've ever witnessed.",
        "I fall more in love with you every year.",
        "Everything is better because you are in it.",
        "You are my partner in every sense of the word.",
        "Thank you for choosing this life — and me — every day.",
        "You are the reason coming home is my favorite part of any day.",
      ],
    },
    {
      name: "Funny Wife Fortunes",
      messages: [
        "You were right. As usual. Happy?",
        "Fortune predicts: you will remind me of something important I've already forgotten.",
        "You manage the household, the kids, and me. That's three full-time jobs.",
        "I thought I was a patient person before I met you. Now I know better.",
        "The fact that you still choose me is genuinely impressive.",
        "You make everything look easy. I've tried. It's not easy.",
        "Thank you for every time you didn't say 'I told you so.' (And for the times you did.)",
        "You've learned to say 'fine' and mean seven different things. I've learned to listen.",
        "You are somehow both my greatest challenge and greatest comfort.",
        "I love you even when you're right. Especially then.",
      ],
    },
    {
      name: "Short & True",
      messages: [
        "Best decision ever.",
        "You are home.",
        "Still choosing you.",
        "Lucky to be yours.",
        "More in love every year.",
        "The best of my life.",
        "You make it worth it.",
        "Forever isn't enough.",
        "Grateful every day.",
        "You are everything.",
      ],
    },
  ],
  tips: [
    {
      title: "Morning Routine Surprise",
      description:
        "Leave a fortune cookie next to her morning coffee — a small daily gesture that adds up to something she notices and appreciates.",
    },
    {
      title: "Anniversary Gift Idea",
      description:
        "Commission a custom fortune cookie as part of an anniversary gift — choose a message that references your specific story together.",
    },
    {
      title: "After a Long Week",
      description:
        "Leave a funny fortune cookie for her at the end of a hard week — it acknowledges what she's been carrying and makes her laugh.",
    },
  ],
  faqs: [
    {
      question: "What are romantic fortune cookie messages for a wife?",
      answer:
        "Romantic wife fortunes feel specific and earned — 'You are everything I didn't know I needed' or 'The way you love is one of the most beautiful things I've ever witnessed.'",
    },
    {
      question: "How do I surprise my wife with a fortune cookie?",
      answer:
        "Place it somewhere she'll find unexpectedly — her bag, her book, next to her coffee. The discovery matters as much as the message.",
    },
    {
      question: "What are funny fortune cookie messages for a wife?",
      answer:
        "Funny wife fortunes work best when they're specific to your relationship — 'You were right. As usual. Happy?' or 'You manage the household, the kids, and me. That's three full-time jobs.' land because they're true.",
    },
  ],
  relatedAudiences: ["husband", "couples", "girlfriend", "best-friend"],
  group: "relationships",
};

// ---------------------------------------------------------------------------
// SOCIAL
// ---------------------------------------------------------------------------

const friends: AudienceData = {
  slug: "friends",
  title: "Fortune Cookie Messages for Friends",
  badge: "45+ Messages",
  emoji: "🤗",
  description:
    "Celebrate friendship in all its forms with warm, funny, and heartfelt fortune cookie messages perfect for any friend in your life.",
  metaTitle: "45+ Fortune Cookie Messages for Friends | Warm & Funny",
  metaDescription:
    "Share love with your friends through 45+ fortune cookie messages! Warm, funny & heartfelt sayings perfect for any occasion with friends.",
  subcategories: [
    {
      name: "Celebrating Friendship",
      messages: [
        "A good friend makes the journey better.",
        "Friends are the family you choose — choose wisely and gratefully.",
        "The best thing in life is having a friend who completely gets you.",
        "True friends are there for the peaks and the valleys equally.",
        "A friend who shows up when it's hard is rarer than gold.",
        "Good friends make ordinary moments extraordinary.",
        "The laughter of friends is the best medicine ever invented.",
        "You don't need many friends — just good ones.",
        "Friendship is the art of choosing, daily, to show up for someone.",
        "A good friend knows when to talk and when to just be there.",
      ],
    },
    {
      name: "Funny Friend Fortunes",
      messages: [
        "A good friend helps you move. A great friend helps you move a body. (Hypothetically.)",
        "Friends don't let friends make bad decisions alone.",
        "Your friendship comes with a lifetime warranty — defects are part of the deal.",
        "I keep you around because you make bad decisions entertaining.",
        "The real reason we're friends: we have enough on each other.",
        "Fortune predicts: you will text each other memes instead of sleeping.",
        "You're the friend I don't have to explain myself to. That's rare.",
        "True friendship: roasting each other publicly, defending each other privately.",
        "You're my 'I'll be there in 10' friend — meaning 30, but you always come.",
        "We are united by our questionable taste and excellent company.",
      ],
    },
    {
      name: "Short & True",
      messages: [
        "Glad you're in my corner.",
        "Better with you.",
        "Lucky to know you.",
        "Grateful for you.",
        "Ride or die.",
        "You get it.",
        "My kind of people.",
        "The best kind of friend.",
        "Wouldn't trade you.",
        "Here for you, always.",
      ],
    },
  ],
  tips: [
    {
      title: "Friendship Gift",
      description:
        "Fortune cookies make a thoughtful, affordable gift for any friend — especially meaningful when the messages reference your specific friendship.",
    },
    {
      title: "Girls' Night Out",
      description:
        "End a girls' night with fortune cookies — reading them aloud is a fun activity that often leads to the best conversations of the evening.",
    },
    {
      title: "Long Distance Friendship",
      description:
        "Mail fortune cookies to a faraway friend — a tangible reminder of your connection when miles keep you apart.",
    },
  ],
  faqs: [
    {
      question: "What are good fortune cookie messages for friends?",
      answer:
        "Great friend fortune cookies balance warmth with the humor that defines real friendship — 'Friends don't let friends make bad decisions alone' or 'You're the friend I don't have to explain myself to. That's rare.'",
    },
    {
      question: "Are fortune cookies a good gift for a friend?",
      answer:
        "Yes! Fortune cookies with friend-specific messages are a creative, affordable, and personal gift that shows thought and care. They're especially effective when personalized to your friendship.",
    },
    {
      question: "What should I write in a fortune cookie for a friend?",
      answer:
        "Reference something specific to your friendship — an inside joke, a quality you love about them, or a memory you share. Specific messages feel like gifts; generic ones feel like cards.",
    },
  ],
  relatedAudiences: ["best-friend", "couples", "boyfriend", "girlfriend"],
  group: "social",
};

const bossCoworkers: AudienceData = {
  slug: "boss-coworkers",
  title: "Fortune Cookie Messages for Boss & Coworkers",
  badge: "40+ Messages",
  emoji: "🏢",
  description:
    "Navigate workplace relationships with professionally appropriate, funny, and genuinely warm fortune cookie messages for bosses and coworkers.",
  metaTitle: "40+ Fortune Cookie Messages for Boss & Coworkers | Professional & Funny",
  metaDescription:
    "Find the perfect fortune cookie messages for your boss and coworkers — 40+ professional, funny & warm sayings for workplace appreciation.",
  subcategories: [
    {
      name: "For Your Boss",
      messages: [
        "Great leadership is knowing when to step back and let the team shine.",
        "The best bosses create an environment where people want to do their best work.",
        "Thank you for the kind of leadership that makes people better.",
        "A manager who cares about growth — personal and professional — is rare. Thank you.",
        "Fortune predicts: you have no idea how much the team talks about how great you are.",
        "Your open door matters more than you know.",
        "A leader is only as great as the team they build — thank you for building a good one.",
        "You make the hard calls so the team can make the right ones.",
        "The work environment you create is itself a kind of leadership.",
        "Great bosses show up — for the work and for the people doing it.",
      ],
    },
    {
      name: "For Coworkers",
      messages: [
        "Working alongside you makes the hard days easier and the good days better.",
        "Great coworkers are rare — you are one of them.",
        "The best thing about this job is the people. You're one of them.",
        "You make Monday less awful. That's a genuine talent.",
        "Fortune predicts: you will save someone's day without even knowing it.",
        "The team is stronger with you in it.",
        "Great coworkers don't just do their job — they make everyone better at theirs.",
        "You bring energy to the room. The right kind.",
        "Professionalism with personality — you have both.",
        "Thank you for the kind of consistency that lets everyone else shine.",
      ],
    },
    {
      name: "Workplace Humor",
      messages: [
        "May your inbox stay manageable and your meetings stay on time.",
        "Fortune predicts: the most important conversation will happen in the hallway.",
        "The real talent here: making small talk in the kitchen.",
        "You survive every reorg. That is the real qualification.",
        "May your slide deck always export correctly.",
        "The printer respects you. That's not nothing.",
        "Office wisdom: whoever controls the snacks controls the culture.",
        "Your calendar is aspirational. We admire it.",
        "May your commute be short and your lunch break be sacred.",
        "You make the open office plan almost tolerable.",
      ],
    },
  ],
  tips: [
    {
      title: "Boss's Day Gift",
      description:
        "Fortune cookies with thoughtful boss-specific messages make a professional, appropriate Boss's Day gift that acknowledges their leadership without being sycophantic.",
    },
    {
      title: "Coworker Farewell",
      description:
        "Give a coworker fortune cookies as a farewell gift when they move on — have each team member contribute a fortune slip for a personalized group gift.",
    },
    {
      title: "Meeting Starter",
      description:
        "Open a team meeting with fortune cookies and have each person read their fortune — a 2-minute mood setter that humanizes the workplace.",
    },
  ],
  faqs: [
    {
      question: "What are professional fortune cookie messages for a boss?",
      answer:
        "Professional boss fortune cookies acknowledge their leadership genuinely — 'Great bosses create an environment where people want to do their best work' or the lighter 'Fortune predicts: you have no idea how much the team talks about how great you are.'",
    },
    {
      question: "Are fortune cookies appropriate for workplace gifts?",
      answer:
        "Yes — especially for casual recognition, holiday parties, or team celebrations. Keep the messages professional and universally appropriate for diverse workplaces.",
    },
    {
      question: "What fortune cookie messages work for coworkers?",
      answer:
        "The best coworker fortunes acknowledge the shared experience of work life — 'You make Monday less awful. That's a genuine talent.' or 'The team is stronger with you in it.'",
    },
  ],
  relatedAudiences: ["employees", "teachers", "nurses", "friends"],
  group: "professional",
};

// ---------------------------------------------------------------------------
// MAIN EXPORT
// ---------------------------------------------------------------------------

export const audiences: AudienceData[] = [
  // Professional
  teachers,
  students,
  employees,
  nurses,
  bossCoworkers,
  // Relationships
  couples,
  bestFriend,
  friends,
  boyfriend,
  girlfriend,
  husband,
  wife,
  // Family
  kids,
  teens,
  parents,
  grandparents,
];

/**
 * Get a single audience by slug
 */
export function getAudience(slug: string): AudienceData | undefined {
  return audiences.find((a) => a.slug === slug);
}

/**
 * Get all audience slugs (for generateStaticParams)
 */
export function getAllAudienceSlugs(): string[] {
  return audiences.map((a) => a.slug);
}

/**
 * Get audiences by group
 */
export function getAudiencesByGroup(
  group: AudienceData["group"],
): AudienceData[] {
  return audiences.filter((a) => a.group === group);
}

/**
 * Get total message count for an audience
 */
export function getAudienceMessageCount(slug: string): number {
  const audience = getAudience(slug);
  if (!audience) return 0;
  return audience.subcategories.reduce(
    (total, sub) => total + sub.messages.length,
    0,
  );
}

export { audiences as audiencesDatabase };
