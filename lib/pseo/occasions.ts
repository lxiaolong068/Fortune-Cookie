/**
 * pSEO Data: Occasion-Based Fortune Cookie Messages
 *
 * Powers: /fortune-cookie-messages/[occasion]
 * Template A: "[Occasion] Fortune Cookie Messages" (35-40 pages)
 */

export interface OccasionSubcategory {
  name: string;
  messages: string[];
}

export interface OccasionTip {
  title: string;
  description: string;
}

export interface OccasionFAQ {
  question: string;
  answer: string;
}

export interface OccasionData {
  slug: string;
  title: string;
  /** Short badge text shown in hero, e.g. "50+ Messages" */
  badge: string;
  emoji: string;
  /** One sentence hero description */
  description: string;
  metaTitle: string;
  metaDescription: string;
  subcategories: OccasionSubcategory[];
  tips: OccasionTip[];
  faqs: OccasionFAQ[];
  /** slugs of related occasions for cross-linking */
  relatedOccasions: string[];
  /** Occasion grouping for Hub page */
  group: "lifecycle" | "holiday" | "workplace" | "cultural";
  /** Season for holiday grouping (optional) */
  season?: "spring" | "summer" | "fall" | "winter" | "year-round";
}

// ---------------------------------------------------------------------------
// LIFECYCLE EVENTS
// ---------------------------------------------------------------------------

const wedding: OccasionData = {
  slug: "wedding",
  title: "Wedding Fortune Cookie Messages",
  badge: "60+ Messages",
  emoji: "💍",
  description:
    "Celebrate love and new beginnings with heartfelt, funny, and romantic fortune cookie messages perfect for wedding favors and receptions.",
  metaTitle: "60+ Wedding Fortune Cookie Messages | For Favors & Receptions",
  metaDescription:
    "Find the perfect wedding fortune cookie messages! 60+ heartfelt, funny & romantic sayings for wedding favors, receptions & bridal showers. Free to copy.",
  subcategories: [
    {
      name: "Heartfelt & Romantic",
      messages: [
        "May your love story be the greatest adventure you ever share.",
        "Two hearts, one journey — may every step bring you closer.",
        "Love is not just looking at each other; it's looking in the same direction.",
        "May your marriage be as endless as your love, and as strong as your promise.",
        "The best thing to hold onto in life is each other.",
        "A great marriage is not when 'perfect couple' comes together, but when imperfect people learn to enjoy their differences.",
        "May you grow old on one pillow and share a thousand sunsets together.",
        "Together is a wonderful place to be.",
        "In all the world, there is no heart for me like yours.",
        "You are my today and all of my tomorrows.",
      ],
    },
    {
      name: "Funny & Lighthearted",
      messages: [
        "May your Wi-Fi be as strong as your marriage vows.",
        "Love is blind — but marriage is a real eye-opener. Enjoy the view!",
        "You've found your person. Now hide the remote control carefully.",
        "Congratulations! You've upgraded from 'single' to 'taken' — no returns.",
        "May your arguments always end in laughter and your laughter never end.",
        "The secret to a happy marriage? 'Yes, dear' and a good sense of humor.",
        "You're not losing a friend; you're gaining a dishwasher partner.",
        "May the only dishes you fight over be which restaurant to order from.",
        "A perfect marriage: one who is deaf and one who is blind.",
        "May your love be modern enough to survive the times, and old-fashioned enough to last forever.",
      ],
    },
    {
      name: "Short & Sweet",
      messages: [
        "Love deeply, laugh often, live fully.",
        "You found your person. Cherish them always.",
        "Today, forever begins.",
        "Together is the best place to be.",
        "Two hearts, one dream.",
        "Love is the answer — now what was the question?",
        "Be each other's safe haven.",
        "Forever starts today.",
        "Choose love, every single day.",
        "Your story is just beginning.",
      ],
    },
  ],
  tips: [
    {
      title: "Use as Table Favor Inserts",
      description:
        "Print the messages on small slips and insert them into real fortune cookies as personalized wedding favors — guests love the surprise.",
    },
    {
      title: "Pair with Lucky Numbers",
      description:
        "Add your wedding date digits as the 'lucky numbers' on the back of each fortune slip for a personal touch.",
    },
    {
      title: "Create a Photo Booth Prop",
      description:
        "Print a large fortune cookie fortune as a photo booth prop — choose a funny message for laughs or a romantic one for keepsakes.",
    },
  ],
  faqs: [
    {
      question: "How many fortune cookies do I need for a wedding?",
      answer:
        "Plan for one fortune cookie per guest as a favor, plus extras for the dessert table. For a wedding of 100 guests, order 110–120 to be safe.",
    },
    {
      question: "Can I customize fortune cookies for a wedding?",
      answer:
        "Yes! Many bakeries offer custom fortune cookies where you can choose the messages. You can also use our AI generator to create personalized wedding fortunes.",
    },
    {
      question: "What are good fortune cookie messages for a wedding reception?",
      answer:
        "The best wedding fortune cookie messages blend love and humor — heartfelt sentiments for the ceremony, and light-hearted jokes for the reception. Mix and match from the categories above.",
    },
  ],
  relatedOccasions: ["bridal-shower", "anniversary", "engagement", "valentines-day"],
  group: "lifecycle",
};

const birthday: OccasionData = {
  slug: "birthday",
  title: "Birthday Fortune Cookie Messages",
  badge: "60+ Messages",
  emoji: "🎂",
  description:
    "Make someone's birthday unforgettable with funny, heartfelt, and inspiring fortune cookie messages they'll treasure.",
  metaTitle: "60+ Birthday Fortune Cookie Messages | Funny & Heartfelt",
  metaDescription:
    "Celebrate with 60+ birthday fortune cookie messages! Funny, heartfelt & inspiring sayings for birthday parties, gifts & cards. Free to copy & share!",
  subcategories: [
    {
      name: "Funny Birthday Fortunes",
      messages: [
        "Age is just a number — but in your case, it's a really big one.",
        "You're not getting older; you're getting better at pretending you're younger.",
        "Happy birthday! The older you get, the more you know — and the less you remember.",
        "They say with age comes wisdom. At your age, you should be a genius by now.",
        "Birthday calories don't count. It's science. Enjoy the cake.",
        "Another birthday? At this rate, you'll be old one day.",
        "You're not over the hill — you're just at the scenic overlook.",
        "May your birthday be filled with cake, laughter, and zero responsibilities.",
        "Wishing you a day as fabulous as your jokes are terrible. (In the best way.)",
        "Getting older is mandatory. Growing up is optional.",
      ],
    },
    {
      name: "Heartfelt & Inspiring",
      messages: [
        "May this birthday be the start of the best chapter of your life.",
        "Every year you grow wiser, kinder, and more wonderful.",
        "The world is better with you in it — happy birthday.",
        "May your dreams be as big as your birthday wishes.",
        "This year, may every door you knock on swing wide open.",
        "You are a gift to everyone who knows you. Happy birthday.",
        "May this year bring you everything you've been working toward.",
        "Birthdays are reminders that life is precious — make every moment count.",
        "Here's to the year that changes everything for the better.",
        "Your best days are still ahead of you.",
      ],
    },
    {
      name: "Short & Sweet",
      messages: [
        "Another trip around the sun, well done!",
        "Make a wish — you deserve it.",
        "Shine bright today and always.",
        "The best is yet to come.",
        "Today is your day!",
        "Eat cake first. Questions later.",
        "Age beautifully.",
        "You only turn this age once. Make it count.",
        "Celebrate big — you've earned it.",
        "Keep being amazing.",
      ],
    },
  ],
  tips: [
    {
      title: "Add to Gift Bags",
      description:
        "Tuck a birthday fortune cookie into each party favor bag for a sweet personalized surprise that guests can enjoy at home.",
    },
    {
      title: "Milestone Birthdays",
      description:
        "For milestone birthdays (30, 40, 50), customize the messages with age-specific humor to get the crowd laughing.",
    },
    {
      title: "Fortune Cookie Tower",
      description:
        "Stack birthday fortune cookies in a decorative jar as a centerpiece — guests can grab one and read their fortune aloud.",
    },
  ],
  faqs: [
    {
      question: "What are some funny birthday fortune cookie messages?",
      answer:
        "Funny birthday fortunes play on age, wisdom, and the passage of time. Examples: 'Age is just a number — but in your case, it's a really big one' or 'Birthday calories don't count. It's science.'",
    },
    {
      question: "What should I write in a birthday fortune cookie?",
      answer:
        "Choose messages that match the birthday person's personality — funny for the joker in your life, heartfelt for someone going through a big year, or inspiring for someone chasing a new goal.",
    },
    {
      question: "Can fortune cookies be used as birthday party favors?",
      answer:
        "Absolutely! Birthday fortune cookies are one of the most popular party favors. You can order them with custom messages, or buy plain ones and insert your own printed fortunes.",
    },
  ],
  relatedOccasions: ["graduation", "retirement", "baby-shower", "holiday-christmas"],
  group: "lifecycle",
};

const graduation: OccasionData = {
  slug: "graduation",
  title: "Graduation Fortune Cookie Messages",
  badge: "50+ Messages",
  emoji: "🎓",
  description:
    "Celebrate the graduate's next big chapter with inspiring, funny, and motivating fortune cookie messages for caps, gowns, and beyond.",
  metaTitle: "50+ Graduation Fortune Cookie Messages | Inspiring & Funny",
  metaDescription:
    "Honor the graduate with 50+ graduation fortune cookie messages! Inspiring, funny & motivational sayings for graduation parties & gifts. Free to copy.",
  subcategories: [
    {
      name: "Inspiring & Motivational",
      messages: [
        "Your education is a passport to the future — use it wisely.",
        "The tassel was worth the hassle.",
        "Go confidently in the direction of your dreams.",
        "Today you graduate. Tomorrow the world is yours.",
        "Your diploma opens doors — your character keeps them open.",
        "The beginning is always today.",
        "Success is not final; keep learning, keep growing.",
        "You are braver than you believe, smarter than you seem.",
        "The best is yet to come — your story is just beginning.",
        "Believe in yourself and the rest will fall into place.",
      ],
    },
    {
      name: "Funny Graduation Fortunes",
      messages: [
        "Congratulations! Now you're qualified to find out how little your degree pays.",
        "You survived finals, all-nighters, and group projects. You can survive anything.",
        "Your parents are very proud and also very relieved.",
        "A diploma is just a receipt. Now go earn the real reward.",
        "Congratulations! May your career be as successful as your ability to cram before exams.",
        "Google is free. Use it wisely.",
        "The world needs your talents — and also your student loan payments.",
        "You spent years learning to think. Now spend a lifetime actually doing.",
        "May your first job have real coffee and not just the free kind.",
        "Plot twist: real life has no study guide.",
      ],
    },
    {
      name: "Short & Sweet",
      messages: [
        "The adventure begins now.",
        "Go make us proud.",
        "Dream big. Start now.",
        "Hard work paid off.",
        "Your chapter one starts here.",
        "You did it!",
        "The world is waiting for you.",
        "Make every step count.",
        "Go further than you imagined.",
        "Fly high, graduate.",
      ],
    },
  ],
  tips: [
    {
      title: "Graduation Party Centerpiece",
      description:
        "Fill a graduation cap prop with fortune cookies as a party centerpiece — guests love reaching in for a fortune.",
    },
    {
      title: "Pair with a Card",
      description:
        "Tuck a fortune cookie into a graduation card envelope as a sweet surprise alongside your written message.",
    },
    {
      title: "Class of [Year] Custom Fortunes",
      description:
        "Create fortunes that reference the class year for a timeless keepsake — e.g., 'Class of 2026: the world is yours.'",
    },
  ],
  faqs: [
    {
      question: "What should I write in a graduation fortune cookie?",
      answer:
        "Mix inspiration with humor. Inspiring messages work well for the ceremony, while funny fortunes get laughs at the party. Personalize with the graduate's field of study if possible.",
    },
    {
      question: "Are fortune cookies a good graduation gift?",
      answer:
        "Yes! Custom fortune cookies with personalized messages make a creative, affordable gift or party favor. Many graduates keep their fortune as a memento.",
    },
    {
      question: "What are good graduation fortune cookie sayings?",
      answer:
        "Great graduation sayings balance encouragement and humor — 'The tassel was worth the hassle' and 'Go confidently in the direction of your dreams' are crowd favorites.",
    },
  ],
  relatedOccasions: ["birthday", "retirement", "back-to-school", "workplace-team-building"],
  group: "lifecycle",
};

const retirement: OccasionData = {
  slug: "retirement",
  title: "Retirement Fortune Cookie Messages",
  badge: "50+ Messages",
  emoji: "🌅",
  description:
    "Toast the retiree's new beginning with funny, warm, and celebratory fortune cookie messages that honor a lifetime of hard work.",
  metaTitle: "50+ Retirement Fortune Cookie Messages | Funny & Heartfelt",
  metaDescription:
    "Celebrate retirement with 50+ funny and heartfelt fortune cookie messages! Perfect for retirement parties, cards & gifts. Free to copy and share.",
  subcategories: [
    {
      name: "Funny Retirement Fortunes",
      messages: [
        "Retirement: finally, the work-life balance you always deserved.",
        "You don't have to pretend to be busy anymore.",
        "Congratulations! Monday is now just another Saturday.",
        "Retirement means never having to set an alarm again — unless you want to.",
        "Gone fishing. Gone golfing. Gone — and loving it.",
        "You've graduated from the school of hard work. Class dismissed.",
        "The best project you ever completed? Your career. Now enjoy the break.",
        "Every day is now the weekend. You're welcome.",
        "No more meetings that could have been emails.",
        "Retirement: where the coffee is always hot because you're never rushing.",
      ],
    },
    {
      name: "Heartfelt & Warm",
      messages: [
        "May your retirement be as wonderful as the career that earned it.",
        "The chapters ahead are the best ones yet.",
        "A lifetime of dedication — now it's time for a lifetime of joy.",
        "Your legacy lives on in everyone you mentored.",
        "This is not an ending — it's the most exciting beginning yet.",
        "May every day of retirement feel like a reward well earned.",
        "The world is better for the work you've done.",
        "You gave your best years — now enjoy your golden ones.",
        "Time is yours now. Use it beautifully.",
        "The adventure of a lifetime starts today.",
      ],
    },
    {
      name: "Short & Sweet",
      messages: [
        "You earned this.",
        "Time to relax and enjoy.",
        "The best chapter starts now.",
        "Finally free!",
        "Adventure awaits.",
        "Work less. Live more.",
        "Wander, wonder, enjoy.",
        "Cheers to the next chapter.",
        "Golden years ahead.",
        "Rest well — you've earned it.",
      ],
    },
  ],
  tips: [
    {
      title: "Office Party Centerpiece",
      description:
        "Arrange a retirement fortune cookie display with messages from each colleague — a personalized send-off the retiree will treasure.",
    },
    {
      title: "Timeline Fortune Cookies",
      description:
        "Include fortunes that reference milestones from the retiree's career for a meaningful, personalized touch.",
    },
    {
      title: "Retirement Gift Basket",
      description:
        "Add fortune cookies to a retirement gift basket alongside their favorite snacks, books, or hobbies — wrap it with a bow.",
    },
  ],
  faqs: [
    {
      question: "What are funny retirement fortune cookie messages?",
      answer:
        "Funny retirement fortunes celebrate the freedom of not working — 'Retirement: finally, the work-life balance you always deserved' or 'No more meetings that could have been emails' always get big laughs.",
    },
    {
      question: "What do you write in a retirement fortune cookie?",
      answer:
        "Mix humor with warmth. Acknowledge their accomplishments, celebrate their freedom, and wish them well for the years ahead. Keep it personal if you know the retiree well.",
    },
    {
      question: "Are fortune cookies good for a retirement party?",
      answer:
        "Absolutely! Retirement fortune cookies are a creative party favor and icebreaker. Guests love reading their fortunes aloud, especially funny ones about leaving work behind.",
    },
  ],
  relatedOccasions: ["birthday", "graduation", "workplace-work-anniversary", "workplace-employee-appreciation"],
  group: "lifecycle",
};

const babySHower: OccasionData = {
  slug: "baby-shower",
  title: "Baby Shower Fortune Cookie Messages",
  badge: "50+ Messages",
  emoji: "👶",
  description:
    "Welcome the newest arrival with sweet, funny, and heartfelt fortune cookie messages perfect for baby shower favors and games.",
  metaTitle: "50+ Baby Shower Fortune Cookie Messages | Sweet & Funny",
  metaDescription:
    "Delight guests with 50+ baby shower fortune cookie messages! Sweet, funny & heartwarming sayings for shower favors, games & gifts. Free to copy.",
  subcategories: [
    {
      name: "Sweet & Heartwarming",
      messages: [
        "May this little one bring more joy than you ever thought possible.",
        "A baby is a little bit of heaven sent down to earth.",
        "The greatest thing you will ever do is love this child.",
        "Every child is a gift the world has been waiting for.",
        "You are about to experience a love like no other.",
        "May your home be filled with laughter, love, and tiny footsteps.",
        "The moment a child is born, a parent is born too.",
        "This little one will change your world in the most beautiful way.",
        "May they grow up surrounded by love, wonder, and kindness.",
        "New life, new love — welcome to the greatest adventure.",
      ],
    },
    {
      name: "Funny & Lighthearted",
      messages: [
        "Sleep now. Seriously — sleep as much as you possibly can.",
        "May your coffee always be strong and your baby always be happy.",
        "Congratulations! You'll never pee alone again.",
        "Babies are adorable little creatures who will steal your heart and your sleep.",
        "May your diaper changes be swift and your baby's aim be terrible.",
        "Fun fact: 'I'll sleep when the baby sleeps' is fiction.",
        "Enjoy your last quiet restaurant meal for approximately three years.",
        "May your stroller wheels always roll smoothly and your baby never cry in public.",
        "You're having a baby! Stock up on coffee. And more coffee.",
        "The nursery looks great. Enjoy it before it becomes a disaster zone.",
      ],
    },
    {
      name: "Short & Sweet",
      messages: [
        "Little one, big love.",
        "The best is about to begin.",
        "A new love is on the way.",
        "Tiny toes, giant love.",
        "Dreams come true in little packages.",
        "Ready or not — here comes joy.",
        "Hello, little miracle.",
        "Every little thing is gonna be alright.",
        "Cherish every moment.",
        "Love multiplies — it never divides.",
      ],
    },
  ],
  tips: [
    {
      title: "Shower Game Prize",
      description:
        "Use fortune cookies as prizes for baby shower games — winners get to choose a fortune cookie from a decorated basket.",
    },
    {
      title: "Gender Reveal Fortunes",
      description:
        "For a combined baby shower and gender reveal, have fortune cookies with pink or blue messages inside for a sweet reveal moment.",
    },
    {
      title: "Guest Book Alternative",
      description:
        "Ask guests to write their own fortune for the baby on a card — collect them all in a keepsake box for the parents.",
    },
  ],
  faqs: [
    {
      question: "What should baby shower fortune cookie messages say?",
      answer:
        "Baby shower fortunes should be warm, celebratory, and fun. Mix sweet sentiments ('A baby is a little bit of heaven') with funny ones ('Sleep now. Seriously.') to keep guests entertained.",
    },
    {
      question: "How do you use fortune cookies at a baby shower?",
      answer:
        "Fortune cookies work as favors, game prizes, or centerpiece decorations. You can even turn opening fortunes into a shower activity — each guest reads theirs aloud.",
    },
    {
      question: "Are fortune cookies a good baby shower favor?",
      answer:
        "Yes! They're affordable, customizable, and guests love them. Order custom fortune cookies with baby-themed messages or make your own with printed inserts.",
    },
  ],
  relatedOccasions: ["wedding", "birthday", "bridal-shower", "valentines-day"],
  group: "lifecycle",
};

const engagement: OccasionData = {
  slug: "engagement",
  title: "Engagement Fortune Cookie Messages",
  badge: "45+ Messages",
  emoji: "💒",
  description:
    "Celebrate the big 'yes' with romantic, funny, and joyful fortune cookie messages perfect for engagement parties and announcements.",
  metaTitle: "45+ Engagement Fortune Cookie Messages | Romantic & Funny",
  metaDescription:
    "Celebrate the engagement with 45+ romantic and funny fortune cookie messages! Perfect for engagement parties, announcements & gifts. Free to copy.",
  subcategories: [
    {
      name: "Romantic & Sweet",
      messages: [
        "You found the one worth choosing every single day.",
        "Love is the adventure you're about to begin together.",
        "May your engagement be the preview to an extraordinary life together.",
        "You said yes to a lifetime of love — congratulations!",
        "Some things are just meant to be. You two are one of them.",
        "The greatest love story starts with a single question.",
        "Congratulations on finding your forever person.",
        "May your love grow deeper with every passing year.",
        "The best chapters of your story are ahead of you.",
        "Two hearts, one future — and it looks beautiful.",
      ],
    },
    {
      name: "Funny Engagement Fortunes",
      messages: [
        "You've committed to sharing fries for life. Congratulations.",
        "Love is grand — so is getting a plus-one to every event forever.",
        "Congrats! You're now legally allowed to say 'my fiancé' constantly.",
        "May your planning be stress-free and your guest list manageable.",
        "You found someone who loves you at your worst. Keep them.",
        "Love is saying 'yes' to one person and 'no' to a lot of drama.",
        "Engagement: the calm before the wedding planning storm.",
        "Congratulations! May your ring always sparkle and your Netflix queue always agree.",
        "You're officially off the market — and the market is devastated.",
        "May your marriage be longer than your engagement planning feels.",
      ],
    },
    {
      name: "Short & Sweet",
      messages: [
        "You said yes. Now the adventure begins.",
        "Love chose you. Wisely.",
        "Forever found its starting point.",
        "Here's to the beginning of always.",
        "She said yes!",
        "He said yes!",
        "They said yes!",
        "Big love, bigger future.",
        "One question, one lifetime.",
        "Soon to be forever.",
      ],
    },
  ],
  tips: [
    {
      title: "Engagement Party Favors",
      description:
        "Fortune cookies with engagement-themed fortunes make elegant, affordable party favors for an engagement celebration dinner.",
    },
    {
      title: "Proposal Surprise",
      description:
        "Some people pop the question with a custom fortune cookie containing the proposal message inside — a memorable and unique way to propose.",
    },
    {
      title: "Save the Date Insert",
      description:
        "Mail fortune cookies with the save-the-date information printed on the fortune slip as a creative announcement.",
    },
  ],
  faqs: [
    {
      question: "Can you propose with a fortune cookie?",
      answer:
        "Yes! Proposing with a custom fortune cookie is a creative and memorable idea. Have 'Will you marry me?' printed on the fortune slip inside — it's a moment they'll never forget.",
    },
    {
      question: "What are good engagement party fortune cookie messages?",
      answer:
        "The best engagement fortune cookies are romantic, celebratory, and a little playful. Mix sweet messages about love and commitment with light-hearted jokes about wedding planning.",
    },
    {
      question: "How do you use fortune cookies at an engagement party?",
      answer:
        "Place fortune cookies at each table setting as party favors, or create a fortune cookie 'bar' where guests can pick their own and read them aloud for a fun icebreaker.",
    },
  ],
  relatedOccasions: ["wedding", "anniversary", "bridal-shower", "valentines-day"],
  group: "lifecycle",
};

const anniversary: OccasionData = {
  slug: "anniversary",
  title: "Anniversary Fortune Cookie Messages",
  badge: "45+ Messages",
  emoji: "❤️",
  description:
    "Honor years of love with romantic, funny, and timeless fortune cookie messages perfect for anniversary celebrations and gifts.",
  metaTitle: "45+ Anniversary Fortune Cookie Messages | Romantic & Funny",
  metaDescription:
    "Celebrate love with 45+ anniversary fortune cookie messages! Romantic, funny & heartfelt sayings for anniversary dinners, gifts & cards. Free to copy.",
  subcategories: [
    {
      name: "Romantic & Timeless",
      messages: [
        "Every year together is a treasure worth celebrating.",
        "True love doesn't grow old — it grows deeper.",
        "You are the chapter I never want to end.",
        "Years pass, but my love for you only grows stronger.",
        "Here's to us — the greatest story I've ever been part of.",
        "May every anniversary remind us why we chose each other.",
        "Love is the reason I look forward to every day.",
        "You are my home, my adventure, and my greatest love.",
        "The best thing that ever happened to me was finding you.",
        "Here's to many more years of choosing each other.",
      ],
    },
    {
      name: "Funny Anniversary Fortunes",
      messages: [
        "Congratulations on another year of putting up with each other.",
        "They said it wouldn't last — look at you proving everyone wrong.",
        "After all these years, you still make me smile — and occasionally argue.",
        "Love means never having to say 'I told you so'... but sometimes you still do.",
        "Happy anniversary! You still have the best worst habits I love.",
        "The secret to a long marriage: take turns being right.",
        "We've been together long enough that finishing each other's sentences is just efficiency.",
        "May you argue only about who loves who more.",
        "Here's to the one who has seen my worst and stayed anyway.",
        "We're still going strong — or at least stumbling in the same direction.",
      ],
    },
    {
      name: "Short & Sweet",
      messages: [
        "Still choosing you.",
        "Every year, more in love.",
        "Forever is not long enough.",
        "Here's to us.",
        "You + me = always.",
        "Love only grows.",
        "Thank you for choosing me.",
        "More love with every year.",
        "Still my favorite.",
        "Time well spent — together.",
      ],
    },
  ],
  tips: [
    {
      title: "Year Count Fortunes",
      description:
        "Customize fortunes with the specific anniversary year for a personal touch — '5 years and still my favorite person' or '25 years and counting.'",
    },
    {
      title: "Anniversary Dinner Surprise",
      description:
        "Ask the restaurant to bring a custom fortune cookie after dessert with a special message — a simple gesture that creates a lasting memory.",
    },
    {
      title: "Love Notes Box",
      description:
        "Collect fortune cookie messages over the years as love notes in a keepsake box — a tradition that becomes more meaningful with each anniversary.",
    },
  ],
  faqs: [
    {
      question: "What are romantic anniversary fortune cookie messages?",
      answer:
        "Romantic anniversary fortunes celebrate time, commitment, and deepening love — 'True love doesn't grow old — it grows deeper' or 'You are the chapter I never want to end.'",
    },
    {
      question: "What do you write in a fortune cookie for an anniversary?",
      answer:
        "Reflect on your journey together, celebrate the years passed, and look forward to the future. Personal references to your specific relationship make it extra special.",
    },
    {
      question: "How can fortune cookies be used for anniversary celebrations?",
      answer:
        "Surprise your partner with a custom fortune cookie at dinner, use them as party favors at an anniversary celebration, or include one in a romantic anniversary gift basket.",
    },
  ],
  relatedOccasions: ["wedding", "engagement", "valentines-day", "birthday"],
  group: "lifecycle",
};

const bridalShower: OccasionData = {
  slug: "bridal-shower",
  title: "Bridal Shower Fortune Cookie Messages",
  badge: "45+ Messages",
  emoji: "👰",
  description:
    "Shower the bride-to-be with love and laughter using sweet, funny, and romantic fortune cookie messages for her special day.",
  metaTitle: "45+ Bridal Shower Fortune Cookie Messages | Sweet & Funny",
  metaDescription:
    "Celebrate the bride with 45+ bridal shower fortune cookie messages! Sweet, funny & romantic sayings for bridal shower favors & games. Free to copy.",
  subcategories: [
    {
      name: "Sweet & Romantic",
      messages: [
        "May your marriage be as beautiful as today's celebration.",
        "The best is about to begin — your forever with the one you love.",
        "Here's to love, laughter, and happily ever after.",
        "May you always be as happy as you are today.",
        "A bride is a woman with a great future behind her name.",
        "May your love be modern enough to survive the times, old-fashioned enough to last forever.",
        "You are about to marry your best friend — the luckiest kind of love.",
        "May your home be filled with laughter and your heart with love.",
        "Wishing you a lifetime of adventure with your perfect person.",
        "Here's to the woman who found her forever.",
      ],
    },
    {
      name: "Funny & Playful",
      messages: [
        "Soon your last name will change, but your fabulousness is forever.",
        "Enjoy the last shower before you share one forever.",
        "Love means never having to fight over the blanket... much.",
        "May your future husband be everything your mother-in-law says he isn't.",
        "Congratulations! Wedding planning: the Olympics for brides.",
        "Enjoy being a Miss — in a few weeks you'll be a Mrs.",
        "May your wedding be as perfect as this shower — just with a larger guest list.",
        "Here's to finding someone who thinks your quirks are your best features.",
        "Marriage: the adventure where you pick your own travel partner.",
        "She found her lobster. Cheers!",
      ],
    },
    {
      name: "Short & Sweet",
      messages: [
        "Soon to be Mrs.",
        "Love begins here.",
        "She said yes!",
        "Here comes the bride.",
        "Forever is almost here.",
        "From Miss to Mrs.",
        "Almost there, bride!",
        "Almost wed.",
        "The big day nears.",
        "Shower her with love.",
      ],
    },
  ],
  tips: [
    {
      title: "Game Prize",
      description:
        "Use fortune cookies as prizes for bridal shower games like bridal bingo, 'how well do you know the bride,' or wedding word scrambles.",
    },
    {
      title: "Advice Fortune Twist",
      description:
        "Ask each guest to write a piece of marriage advice on a card — collect them and read them aloud like 'fortunes from the shower.'",
    },
    {
      title: "Décor and Favor Combo",
      description:
        "Display fortune cookies in a tiered stand as a centerpiece — guests can take one as a favor at the end of the party.",
    },
  ],
  faqs: [
    {
      question: "What are good bridal shower fortune cookie messages?",
      answer:
        "Great bridal shower fortunes mix romance with humor — celebrate the bride's upcoming marriage, poke fun at wedding planning, and wish her a joyful future.",
    },
    {
      question: "How do you use fortune cookies at a bridal shower?",
      answer:
        "Fortune cookies make excellent bridal shower favors, game prizes, or centerpiece elements. You can even use them as a fun activity where guests read fortunes aloud.",
    },
    {
      question: "Are fortune cookies a good bridal shower favor?",
      answer:
        "Yes! Custom fortune cookies with love-themed messages are a creative, affordable, and delicious bridal shower favor that guests of all ages enjoy.",
    },
  ],
  relatedOccasions: ["wedding", "engagement", "anniversary", "valentines-day"],
  group: "lifecycle",
};

// ---------------------------------------------------------------------------
// HOLIDAYS
// ---------------------------------------------------------------------------

const valentinesDay: OccasionData = {
  slug: "valentines-day",
  title: "Valentine's Day Fortune Cookie Messages",
  badge: "55+ Messages",
  emoji: "💝",
  description:
    "Share the love on Valentine's Day with romantic, funny, and sweet fortune cookie messages for your person, friends, or Galentine's celebration.",
  metaTitle: "55+ Valentine's Day Fortune Cookie Messages | Romantic & Funny",
  metaDescription:
    "Spread love with 55+ Valentine's Day fortune cookie messages! Romantic, funny & sweet sayings for Valentine's cards, gifts & parties. Free to copy.",
  subcategories: [
    {
      name: "Romantic & Passionate",
      messages: [
        "You are the reason I believe in love.",
        "Every moment with you is a moment I want to keep forever.",
        "My favorite place is wherever you are.",
        "You are my sun on a cloudy day and my stars on a clear night.",
        "In a world full of people, my eyes always find you.",
        "You are the chapter in my life I never want to end.",
        "Meeting you was fate; falling for you was my favorite choice.",
        "You make ordinary days feel like love stories.",
        "I would choose you in a hundred lifetimes, in a hundred worlds.",
        "To love you is the best thing I've ever done.",
      ],
    },
    {
      name: "Funny & Playful",
      messages: [
        "Will you be the WiFi to my phone? I feel a connection.",
        "You stole my heart — but I'll let you keep it.",
        "I love you more than pizza. That's saying a lot.",
        "You're my favorite notification.",
        "Are you a time traveler? Because I see you in my future.",
        "I'm not a photographer, but I can picture us together.",
        "You must be a magician — every time I look at you, everyone else disappears.",
        "I love you like Netflix loves buffering at the best part.",
        "Valentine's Day is the only day I'm allowed to say this: you're my lobster.",
        "You had me at 'free food.'",
      ],
    },
    {
      name: "Galentine's & Friendship Love",
      messages: [
        "To my favorite person: thanks for being my ride-or-die.",
        "Friends like you are the greatest love story of all.",
        "You don't need a valentine when you have a best friend like this.",
        "Galentine's truth: sometimes the best love is the one beside you.",
        "Here's to the love that never needs a special occasion.",
        "Best friends are the family we choose — today and every day.",
        "You are my person, my human, my best friend.",
        "Forget the roses — real love is showing up every day.",
        "Side by side or miles apart, you're always in my heart.",
        "Lucky in friends, lucky in life.",
      ],
    },
  ],
  tips: [
    {
      title: "Valentine's Dinner Surprise",
      description:
        "Ask your restaurant to bring a custom fortune cookie as part of the dessert course — have your special message inside.",
    },
    {
      title: "Galentine's Party Favor",
      description:
        "Use fortune cookies with friendship messages as Galentine's party favors — each guest gets a love note from the universe.",
    },
    {
      title: "Fortune Cookie Box Gift",
      description:
        "Assemble a gift box of chocolate-dipped fortune cookies with romantic messages inside as a sweet Valentine's gift.",
    },
  ],
  faqs: [
    {
      question: "What are good Valentine's Day fortune cookie messages?",
      answer:
        "Valentine's fortunes range from deeply romantic ('You are the reason I believe in love') to playfully flirty ('Will you be the WiFi to my phone?'). Match the tone to your relationship.",
    },
    {
      question: "Can fortune cookies be used as Valentine's gifts?",
      answer:
        "Absolutely! Custom fortune cookies with romantic messages are a creative, affordable, and delicious Valentine's gift. Pair with chocolate or flowers for a complete gift.",
    },
    {
      question: "What are Galentine's Day fortune cookie messages?",
      answer:
        "Galentine's fortunes celebrate female friendship and chosen family — messages like 'Friends like you are the greatest love story of all' or 'You are my person, my human, my best friend.'",
    },
  ],
  relatedOccasions: ["wedding", "anniversary", "engagement", "birthday"],
  group: "holiday",
  season: "winter",
};

const christmas: OccasionData = {
  slug: "christmas",
  title: "Christmas Fortune Cookie Messages",
  badge: "55+ Messages",
  emoji: "🎄",
  description:
    "Spread holiday cheer with festive, funny, and heartwarming Christmas fortune cookie messages for gifts, parties, and stockings.",
  metaTitle: "55+ Christmas Fortune Cookie Messages | Festive & Funny",
  metaDescription:
    "Spread holiday cheer with 55+ Christmas fortune cookie messages! Festive, funny & heartwarming sayings for Christmas parties, gifts & stockings.",
  subcategories: [
    {
      name: "Festive & Heartwarming",
      messages: [
        "May your Christmas be merry, bright, and filled with everything you love.",
        "The spirit of Christmas is giving, loving, and being grateful.",
        "May the magic of Christmas fill your home with joy and warmth.",
        "Tis the season to count your blessings and share them generously.",
        "Christmas is best when shared with the people who matter most.",
        "May every gift you give and receive come from the heart.",
        "Wishing you peace, love, and joy this holiday season.",
        "May your Christmas be as warm as the fire and as bright as the lights.",
        "The greatest gifts are the ones wrapped in love.",
        "May your holiday season be full of laughter, food, and family.",
      ],
    },
    {
      name: "Funny Christmas Fortunes",
      messages: [
        "Santa has your list — and it's longer than he expected.",
        "The best gift this Christmas? Not having to cook.",
        "May your eggnog be strong and your relatives be brief.",
        "Ho ho ho — may your turkey be moist and your traffic be light.",
        "You've been mostly nice. That should count for something.",
        "Christmas calories don't count. It's in the holiday contract.",
        "May you find exactly what you asked for — and also socks.",
        "May your holiday sweater be ugly enough to win the contest.",
        "Jingle all the way — to the snack table.",
        "December prediction: cookies will be eaten, and you will be judged for nothing.",
      ],
    },
    {
      name: "Short & Sweet",
      messages: [
        "Merry Christmas!",
        "Peace, joy, love.",
        "'Tis the season to be jolly.",
        "Joy to the world.",
        "Make it merry.",
        "Deck the halls of your heart.",
        "Ho ho ho!",
        "Bright days ahead.",
        "Let it snow, let it glow.",
        "Season's greetings.",
      ],
    },
  ],
  tips: [
    {
      title: "Stocking Stuffer",
      description:
        "Tuck fortune cookies with Christmas messages into stockings as a fun, affordable stocking stuffer that kids and adults enjoy.",
    },
    {
      title: "Holiday Party Favor",
      description:
        "Use Christmas-themed fortune cookies as party favors at your holiday gathering — wrap them in festive cellophane with a ribbon.",
    },
    {
      title: "Advent Calendar Insert",
      description:
        "Include a fortune cookie in a DIY advent calendar for a sweet surprise on Christmas Day or Christmas Eve.",
    },
  ],
  faqs: [
    {
      question: "What are funny Christmas fortune cookie messages?",
      answer:
        "Funny Christmas fortunes play on holiday traditions — 'May your eggnog be strong and your relatives be brief' or 'Christmas calories don't count. It's in the holiday contract.'",
    },
    {
      question: "Are fortune cookies a good Christmas gift?",
      answer:
        "Yes! Fortune cookies with Christmas messages are a creative stocking stuffer, party favor, or small gift. Custom fortune cookies with personalized messages add an extra special touch.",
    },
    {
      question: "What should Christmas fortune cookie messages say?",
      answer:
        "Balance festive cheer with warmth and humor. Wish the recipient a merry, bright holiday season, reference Christmas traditions with a playful twist, or offer a heartfelt message of gratitude.",
    },
  ],
  relatedOccasions: ["new-year", "thanksgiving", "halloween", "valentines-day"],
  group: "holiday",
  season: "winter",
};

const newYear: OccasionData = {
  slug: "new-year",
  title: "New Year Fortune Cookie Messages",
  badge: "50+ Messages",
  emoji: "🎆",
  description:
    "Ring in the new year with hopeful, funny, and inspiring fortune cookie messages to set the perfect tone for the year ahead.",
  metaTitle: "50+ New Year Fortune Cookie Messages | Hopeful & Funny",
  metaDescription:
    "Welcome the new year with 50+ fortune cookie messages! Hopeful, inspiring & funny sayings for New Year's Eve parties & gifts. Free to copy.",
  subcategories: [
    {
      name: "Hopeful & Inspiring",
      messages: [
        "The new year stands before you like a fresh chapter. Write it boldly.",
        "May this year bring you everything you've been brave enough to want.",
        "A new year is a new chance to become who you've always wanted to be.",
        "This year, dare to believe in yourself a little more.",
        "Every new year is a gift — open it with gratitude.",
        "The best is yet to come.",
        "May the doors that open this year lead somewhere extraordinary.",
        "Fresh start, new possibilities, endless hope.",
        "This year, your only competition is who you were last year.",
        "Embrace the unknown — the best things haven't happened yet.",
      ],
    },
    {
      name: "Funny New Year Fortunes",
      messages: [
        "Your resolutions are valid. Statistically, one might even stick.",
        "New year, same you — and that's actually great news.",
        "January 1st: the only morning everyone exercises simultaneously.",
        "May your New Year's resolutions survive until at least February.",
        "Champagne: because water is for January resolutions.",
        "2024 called — it wants credit for your growth. 2025 says 'you're welcome.'",
        "May your year be as good as your midnight kiss was.",
        "Resolution pro tip: make one you've already done this year.",
        "New year, new phone plan for all those productivity apps you'll use twice.",
        "Out with the old, in with the hopeful naivety.",
      ],
    },
    {
      name: "Short & Sweet",
      messages: [
        "Happy New Year!",
        "Fresh start, big dreams.",
        "New year, new chapter.",
        "Here's to the year ahead.",
        "Make it count.",
        "Begin boldly.",
        "New possibilities await.",
        "Dream bigger this year.",
        "Cheers to a new year.",
        "The best is coming.",
      ],
    },
  ],
  tips: [
    {
      title: "New Year's Eve Party Favor",
      description:
        "Hand out fortune cookies at midnight as a party favor — guests break them open for their 'fortune' for the new year.",
    },
    {
      title: "Vision Board Companion",
      description:
        "Include a fortune cookie message in your new year vision board as a guiding word or theme for the year ahead.",
    },
    {
      title: "Year in Review Toast",
      description:
        "Read fortune cookie messages aloud during your New Year's Eve toast — choose inspiring messages for a meaningful celebration.",
    },
  ],
  faqs: [
    {
      question: "What are good New Year fortune cookie messages?",
      answer:
        "New Year fortunes balance hope and humor — 'The new year stands before you like a fresh chapter. Write it boldly' for inspiration, or 'Your resolutions are valid. Statistically, one might even stick' for laughs.",
    },
    {
      question: "How do you use fortune cookies for New Year's Eve?",
      answer:
        "Fortune cookies make festive party favors or a midnight activity — guests break them open at midnight for their 'fortune' for the coming year.",
    },
    {
      question: "What are funny New Year's fortune cookie messages?",
      answer:
        "Funny New Year fortunes playfully poke fun at resolutions, champagne, and the eternal optimism of January 1st. Guests love reading them aloud.",
    },
  ],
  relatedOccasions: ["christmas", "thanksgiving", "birthday", "valentines-day"],
  group: "holiday",
  season: "winter",
};

const halloween: OccasionData = {
  slug: "halloween",
  title: "Halloween Fortune Cookie Messages",
  badge: "45+ Messages",
  emoji: "🎃",
  description:
    "Haunt your guests with spooky, funny, and wickedly good Halloween fortune cookie messages for parties, trick-or-treat bags, and costumes.",
  metaTitle: "45+ Halloween Fortune Cookie Messages | Spooky & Funny",
  metaDescription:
    "Haunt the party with 45+ Halloween fortune cookie messages! Spooky, funny & witty sayings for Halloween parties, trick-or-treat bags & costumes.",
  subcategories: [
    {
      name: "Spooky & Mysterious",
      messages: [
        "Something wicked this way comes — and it is magnificent.",
        "The spirits say your future is delightfully dark.",
        "Beware the full moon — it reveals what daylight hides.",
        "Your destiny is written in the stars... and it's a little haunted.",
        "The veil between worlds thins tonight — use this knowledge wisely.",
        "Mysterious forces are at work in your favor.",
        "Some shadows are safe to follow. Choose yours carefully.",
        "The night knows things the day doesn't dare to say.",
        "Your intuition is your most powerful spell.",
        "Dark does not mean evil. Trust the night.",
      ],
    },
    {
      name: "Funny Halloween Fortunes",
      messages: [
        "Your costume is great. Your candy is greater.",
        "This fortune is haunted. Just kidding. Or am I?",
        "The spirits predict: you will eat too much candy tonight.",
        "Trick or treat — but mostly treat.",
        "You will encounter a ghost tonight. It is a child in a sheet.",
        "May your costume win the contest and your candy last until November.",
        "The dead say: 'at least you're not us.'",
        "A witch once told me you're fantastic. She was right.",
        "Boo! Now that we have your attention: happy Halloween!",
        "Fortune for tonight: more candy, fewer tricks.",
      ],
    },
    {
      name: "Short & Sweet",
      messages: [
        "Boo!",
        "Happy Haunting!",
        "Eat candy. Be scary.",
        "Tricks are for kids.",
        "Fear nothing.",
        "Witch way to the candy?",
        "Greetings from the dark side.",
        "Have a spook-tacular night.",
        "Be afraid. Be very... nah, just have fun.",
        "Stay creepy.",
      ],
    },
  ],
  tips: [
    {
      title: "Trick-or-Treat Alternative",
      description:
        "Hand out Halloween fortune cookies as an alternative to candy — kids and parents love the novelty.",
    },
    {
      title: "Party Activity",
      description:
        "Set up a fortune cookie station at your Halloween party where guests can grab a 'prophetic fortune' for the night.",
    },
    {
      title: "Haunted House Prop",
      description:
        "Use fortune cookies with spooky messages as a haunted house prop — 'discover your fate' as guests pass through.",
    },
  ],
  faqs: [
    {
      question: "What are Halloween fortune cookie messages?",
      answer:
        "Halloween fortune cookies feature spooky, funny, or mysterious messages themed around the holiday — ghost predictions, candy humor, and 'prophetic' sayings for the night.",
    },
    {
      question: "Can you give fortune cookies on Halloween?",
      answer:
        "Yes! Fortune cookies make a fun, unique Halloween treat — especially with spooky or funny messages inside. They're also a popular alternative to candy.",
    },
    {
      question: "What should Halloween fortune cookie messages say?",
      answer:
        "Mix genuinely spooky sayings with lighthearted humor. 'This fortune is haunted. Just kidding. Or am I?' is always a crowd-pleaser.",
    },
  ],
  relatedOccasions: ["christmas", "thanksgiving", "new-year", "birthday"],
  group: "holiday",
  season: "fall",
};

const thanksgiving: OccasionData = {
  slug: "thanksgiving",
  title: "Thanksgiving Fortune Cookie Messages",
  badge: "45+ Messages",
  emoji: "🦃",
  description:
    "Give thanks with warm, funny, and heartfelt Thanksgiving fortune cookie messages perfect for the holiday table and family gatherings.",
  metaTitle: "45+ Thanksgiving Fortune Cookie Messages | Warm & Funny",
  metaDescription:
    "Celebrate Thanksgiving with 45+ fortune cookie messages! Warm, funny & heartfelt sayings for Thanksgiving dinners, tables & family gatherings.",
  subcategories: [
    {
      name: "Grateful & Warm",
      messages: [
        "Gratitude turns what we have into enough.",
        "The thankful heart finds joy in the ordinary.",
        "Today, count your blessings — they far outnumber your worries.",
        "Be grateful for the people at your table, not just the food on it.",
        "Thankfulness is the greatest form of happiness.",
        "The more you appreciate, the more life gives you to appreciate.",
        "Gratitude is not only the greatest of virtues, but the parent of all others.",
        "May your heart be as full as your plate.",
        "The best things in life are the people you're thankful for.",
        "Every day is a chance to be grateful — today especially.",
      ],
    },
    {
      name: "Funny Thanksgiving Fortunes",
      messages: [
        "The turkey forgives nothing.",
        "Elastic waistbands: the real Thanksgiving miracle.",
        "You have much to be thankful for — especially leftovers.",
        "The stuffing will be better tomorrow. Trust the process.",
        "Thankful prediction: you will eat twice the pie you planned.",
        "Today's forecast: 100% chance of turkey coma.",
        "May your family arguments be brief and your pie portions generous.",
        "Gratitude is easy when someone else cooks.",
        "The Macy's Parade means it's time to panic about the oven.",
        "Blessed are those who remembered to thaw the turkey.",
      ],
    },
    {
      name: "Short & Sweet",
      messages: [
        "Thankful. Always.",
        "Grateful today and every day.",
        "Count your blessings.",
        "Give thanks — deeply.",
        "Full heart, full plate.",
        "Happy Thanksgiving!",
        "Be present. Be grateful.",
        "Family first.",
        "Thankfulness is a superpower.",
        "Today: eat, love, be grateful.",
      ],
    },
  ],
  tips: [
    {
      title: "Table Place Card Alternative",
      description:
        "Use fortune cookies as personalized place cards at Thanksgiving dinner — write each guest's name on the fortune slip inside.",
    },
    {
      title: "Gratitude Activity",
      description:
        "Before the meal, have each guest read their fortune aloud and share one thing they're grateful for — a meaningful holiday tradition.",
    },
    {
      title: "Leftovers Box Surprise",
      description:
        "Add fortune cookies to the leftovers containers you send home with guests — a sweet reminder of the day.",
    },
  ],
  faqs: [
    {
      question: "What are good Thanksgiving fortune cookie messages?",
      answer:
        "Thanksgiving fortunes celebrate gratitude, family, and food — balance heartfelt messages about counting blessings with humor about turkey, stuffing, and elastic waistbands.",
    },
    {
      question: "How do you use fortune cookies at Thanksgiving dinner?",
      answer:
        "Read fortunes aloud before the meal as a gratitude activity, use them as place cards, or serve them with dessert as a fun post-dinner activity.",
    },
    {
      question: "Are fortune cookies good for Thanksgiving?",
      answer:
        "Yes! Fortune cookies with Thanksgiving messages are a fun, unique addition to the holiday table. Kids and adults alike enjoy the fortune-telling tradition.",
    },
  ],
  relatedOccasions: ["christmas", "halloween", "new-year", "birthday"],
  group: "holiday",
  season: "fall",
};

const mothersDay: OccasionData = {
  slug: "mothers-day",
  title: "Mother's Day Fortune Cookie Messages",
  badge: "45+ Messages",
  emoji: "🌸",
  description:
    "Honor mom with loving, funny, and heartfelt Mother's Day fortune cookie messages that celebrate everything she means to you.",
  metaTitle: "45+ Mother's Day Fortune Cookie Messages | Loving & Funny",
  metaDescription:
    "Celebrate mom with 45+ Mother's Day fortune cookie messages! Loving, funny & heartfelt sayings for Mother's Day gifts, brunch & cards. Free to copy.",
  subcategories: [
    {
      name: "Loving & Heartfelt",
      messages: [
        "A mother's love is the purest force in the universe.",
        "Everything I am, I owe to the woman who believed in me first.",
        "No words are enough to thank you for a lifetime of love.",
        "Mom: the first word that meant safety, love, and home.",
        "You gave me roots to stand on and wings to fly.",
        "The world is a better place because you're in it.",
        "There is nothing in the world that compares to a mother's love.",
        "You made every hard day easier just by being there.",
        "Watching you be a mother is one of the great joys of my life.",
        "Thank you for every sacrifice, every hug, every moment you showed up.",
      ],
    },
    {
      name: "Funny & Playful",
      messages: [
        "Mom: a person who pretends she has nothing to do while doing everything.",
        "You always knew where everything was. Witchcraft.",
        "'Because I said so' is now scientifically proven wisdom.",
        "Mom's taxi service: 24/7, no charge, eternal gratitude required.",
        "You deserve a trophy for every time you said 'fine' and meant the opposite.",
        "Thank you for pretending not to notice half the things you definitely noticed.",
        "Mom level: asking if you've eaten before you've said hello.",
        "Your googling skills have never been matched.",
        "You survived us. That is the greatest achievement.",
        "Mom was right. There. We said it.",
      ],
    },
    {
      name: "Short & Sweet",
      messages: [
        "Happy Mother's Day!",
        "Everything good in me is you.",
        "Thank you, Mom.",
        "You are loved.",
        "Mom = home.",
        "First my mother, forever my friend.",
        "Love you more than words.",
        "You made me who I am.",
        "Grateful for you always.",
        "Mom, you're everything.",
      ],
    },
  ],
  tips: [
    {
      title: "Mother's Day Brunch Favor",
      description:
        "Serve fortune cookies with Mother's Day messages as a sweet end to brunch — mom and her guests will love reading them aloud.",
    },
    {
      title: "Gift Basket Addition",
      description:
        "Tuck fortune cookies with personalized messages into a Mother's Day gift basket alongside her favorite treats.",
    },
    {
      title: "Kids' DIY Gift",
      description:
        "Have kids write their own messages for mom on fortune slips and insert them into store-bought fortune cookies — a heartfelt handmade gift.",
    },
  ],
  faqs: [
    {
      question: "What are sweet Mother's Day fortune cookie messages?",
      answer:
        "Sweet Mother's Day fortunes celebrate a mother's love, sacrifice, and presence — 'A mother's love is the purest force in the universe' or 'You gave me roots to stand on and wings to fly.'",
    },
    {
      question: "What are funny Mother's Day fortune cookie messages?",
      answer:
        "Funny Mother's Day fortunes celebrate mom's superpowers humorously — 'You always knew where everything was. Witchcraft.' or 'You survived us. That is the greatest achievement.'",
    },
    {
      question: "How do you use fortune cookies for Mother's Day?",
      answer:
        "Use fortune cookies as brunch favors, gift basket additions, or a card accompaniment. They make especially meaningful gifts when kids write their own messages.",
    },
  ],
  relatedOccasions: ["fathers-day", "birthday", "anniversary", "valentines-day"],
  group: "holiday",
  season: "spring",
};

const fathersDay: OccasionData = {
  slug: "fathers-day",
  title: "Father's Day Fortune Cookie Messages",
  badge: "45+ Messages",
  emoji: "👔",
  description:
    "Celebrate dad with funny, heartfelt, and appreciative Father's Day fortune cookie messages that honor everything he does.",
  metaTitle: "45+ Father's Day Fortune Cookie Messages | Funny & Heartfelt",
  metaDescription:
    "Celebrate dad with 45+ Father's Day fortune cookie messages! Funny, heartfelt & appreciative sayings for Father's Day gifts, cards & BBQs.",
  subcategories: [
    {
      name: "Heartfelt & Appreciative",
      messages: [
        "Dad: the man, the myth, the legend.",
        "Any man can be a father, but it takes someone special to be a dad.",
        "A father is someone you look up to no matter how tall you grow.",
        "The greatest thing a father can do for his children is love their mother.",
        "Dad, you showed me what strength really looks like.",
        "Behind every great kid is a truly amazing dad.",
        "Thank you for every lesson, sacrifice, and hug.",
        "A dad's love is forever — steady, strong, and sure.",
        "You are the standard by which all others are measured.",
        "Dad: the original superhero — no cape required.",
      ],
    },
    {
      name: "Funny Father's Day Fortunes",
      messages: [
        "Dad jokes are no laughing matter. Except they completely are.",
        "You've earned the right to tell bad jokes. Indefinitely.",
        "Dad wisdom: if it ain't broke, wait until someone else tries to fix it.",
        "May your remote control never disappear and your BBQ never run out of gas.",
        "Thank you for pretending my jokes were funny. Yours too.",
        "The real reason dads grill: fire + meat = ancient power.",
        "Father's Day prediction: someone bought you a tie and socks.",
        "Dad, you were right. I hate that.",
        "May your golf game improve and your lawn be always green.",
        "You could have been cool. Instead, you became a dad. Same thing.",
      ],
    },
    {
      name: "Short & Sweet",
      messages: [
        "Happy Father's Day!",
        "Best dad ever.",
        "Thanks for everything, Dad.",
        "Dad: still the strongest.",
        "You are my hero.",
        "Proud to be yours.",
        "Thanks, old man. 😄",
        "Dad, you're legendary.",
        "First my father, forever my friend.",
        "Love you, Dad.",
      ],
    },
  ],
  tips: [
    {
      title: "BBQ Favor",
      description:
        "Serve fortune cookies with Father's Day messages after the BBQ — dad and his guests will enjoy reading funny fortunes over dessert.",
    },
    {
      title: "Kids' Gift Idea",
      description:
        "Have kids write their own messages for dad on fortune slips — insert into fortune cookies for a personalized, heartfelt gift.",
    },
    {
      title: "Gift Bag Addition",
      description:
        "Tuck fortune cookies with funny or heartfelt messages into a Father's Day gift bag alongside his favorite snacks or beer.",
    },
  ],
  faqs: [
    {
      question: "What are funny Father's Day fortune cookie messages?",
      answer:
        "Funny Father's Day fortunes celebrate dad's jokes, grilling obsession, and wise (if annoying) advice — 'Dad, you were right. I hate that.' always lands perfectly.",
    },
    {
      question: "What should I write in a Father's Day fortune cookie?",
      answer:
        "Balance appreciation with humor. Acknowledge something specific dad always says or does, then flip it humorously — or go heartfelt if the moment calls for it.",
    },
    {
      question: "How do you use fortune cookies for Father's Day?",
      answer:
        "Serve fortune cookies at the Father's Day BBQ or dinner, include them in a gift bag, or have kids insert handwritten messages inside for a personal touch.",
    },
  ],
  relatedOccasions: ["mothers-day", "birthday", "anniversary", "graduation"],
  group: "holiday",
  season: "summer",
};

// ---------------------------------------------------------------------------
// WORKPLACE
// ---------------------------------------------------------------------------

const employeeAppreciation: OccasionData = {
  slug: "workplace-employee-appreciation",
  title: "Employee Appreciation Fortune Cookie Messages",
  badge: "45+ Messages",
  emoji: "🏆",
  description:
    "Recognize your team's hard work with motivating, funny, and sincere employee appreciation fortune cookie messages.",
  metaTitle: "45+ Employee Appreciation Fortune Cookie Messages",
  metaDescription:
    "Show your team some love with 45+ employee appreciation fortune cookie messages! Motivating, funny & sincere sayings for employee recognition.",
  subcategories: [
    {
      name: "Sincere & Motivating",
      messages: [
        "Your hard work doesn't go unnoticed — it is the foundation of our success.",
        "Great teams are made of people who make the impossible seem ordinary.",
        "Your contributions make this team extraordinary.",
        "Excellence is not an act but a habit — thank you for making it yours.",
        "The effort you bring each day inspires everyone around you.",
        "Behind every successful project is a dedicated person like you.",
        "Your commitment to quality sets the standard for all of us.",
        "A team is only as strong as its most dedicated members — thank you.",
        "Great work is rarely noticed in the moment, but always remembered in the outcome.",
        "Your expertise is our greatest competitive advantage.",
      ],
    },
    {
      name: "Funny & Lighthearted",
      messages: [
        "You are the reason the coffee machine hasn't quit.",
        "Employee of the moment — and probably all the other moments.",
        "If dedication were a sport, you'd need a bigger trophy case.",
        "Officially the most indispensable person in the room. Don't tell HR.",
        "You make impossible deadlines look easy. We're onto you.",
        "The office runs on coffee, Wi-Fi, and whatever you're doing over there.",
        "We appreciate you the most — which is why we keep asking for more.",
        "Fortune predicts: a raise is in your future. (Check with your manager.)",
        "Your calendar is a work of fiction. How are you everywhere at once?",
        "You put the 'pro' in professional and the 'caf' in caffeine.",
      ],
    },
    {
      name: "Short & Impactful",
      messages: [
        "You matter here.",
        "Keep being brilliant.",
        "Your work changes things.",
        "Appreciated more than you know.",
        "The team is better with you.",
        "You set the bar — high.",
        "Thank you, sincerely.",
        "Outstanding. Always.",
        "Your effort = our success.",
        "You make it look effortless.",
      ],
    },
  ],
  tips: [
    {
      title: "All-Hands Meeting Favor",
      description:
        "Distribute fortune cookies at an all-hands or team meeting as a fun recognition activity — each team member gets a personal fortune.",
    },
    {
      title: "Desk Drop Surprise",
      description:
        "Leave a fortune cookie on each employee's desk as a surprise appreciation gesture — include a small note with a specific compliment.",
    },
    {
      title: "Award Ceremony Pair",
      description:
        "Use fortune cookies alongside formal awards — give each award recipient a fortune cookie with a message that reflects their specific contribution.",
    },
  ],
  faqs: [
    {
      question: "What are good employee appreciation fortune cookie messages?",
      answer:
        "The best employee appreciation fortunes balance sincere recognition with light-hearted humor — 'Your hard work doesn't go unnoticed' or the funnier 'If dedication were a sport, you'd need a bigger trophy case.'",
    },
    {
      question: "How do you use fortune cookies for employee appreciation?",
      answer:
        "Distribute fortune cookies at team meetings, leave them on desks as surprise gifts, or include them in recognition packages alongside formal awards.",
    },
    {
      question: "Are fortune cookies a good employee gift?",
      answer:
        "Yes! Fortune cookies with appreciation messages are a fun, affordable, and memorable way to recognize employees. Pair with a personalized note for extra impact.",
    },
  ],
  relatedOccasions: ["workplace-work-anniversary", "workplace-team-building", "workplace-office-party", "retirement"],
  group: "workplace",
};

const teamBuilding: OccasionData = {
  slug: "workplace-team-building",
  title: "Team Building Fortune Cookie Messages",
  badge: "40+ Messages",
  emoji: "🤝",
  description:
    "Strengthen your team with motivating, funny, and collaborative fortune cookie messages perfect for team building activities.",
  metaTitle: "40+ Team Building Fortune Cookie Messages | Motivating & Fun",
  metaDescription:
    "Build better teams with 40+ team building fortune cookie messages! Motivating, collaborative & fun sayings for corporate events & workshops.",
  subcategories: [
    {
      name: "Collaborative & Inspiring",
      messages: [
        "Alone we go fast; together we go far.",
        "Great teams don't happen by accident — they are built with intention.",
        "The strength of the team is each individual member; the strength of each member is the team.",
        "Collaboration is the engine of innovation.",
        "A team that laughs together, succeeds together.",
        "Every great team is built on trust, communication, and mutual respect.",
        "Your best idea becomes better when someone else builds on it.",
        "The best teams make each other better.",
        "Diverse perspectives are not a challenge — they are a superpower.",
        "When we all contribute our best, the whole becomes greater than the sum.",
      ],
    },
    {
      name: "Fun & Motivating",
      messages: [
        "Today's challenge: outperform yesterday's team. (You're winning.)",
        "Teamwork makes the dream work — and the deadline less terrifying.",
        "The team that snacks together, works together.",
        "Fortune predicts: this team will accomplish something remarkable today.",
        "Your superpower: making every meeting slightly less awful.",
        "Meetings are better with fortune cookies. Remember that.",
        "Who knew that putting all these people in a room would work this well?",
        "The secret team formula: 1 part expertise + 1 part trust + 1 part snacks.",
        "You are surrounded by your future success story.",
        "Plot twist: the 'team-building activity' actually works this time.",
      ],
    },
    {
      name: "Short & Punchy",
      messages: [
        "Together we're unstoppable.",
        "Trust the team.",
        "One team, one goal.",
        "Stronger together.",
        "Your team has your back.",
        "Build each other up.",
        "The best work is shared work.",
        "We > me.",
        "Collaborate to elevate.",
        "Good teams last.",
      ],
    },
  ],
  tips: [
    {
      title: "Workshop Icebreaker",
      description:
        "Open a team building workshop by having each participant read their fortune aloud — a simple way to get people talking.",
    },
    {
      title: "Team Challenge Prize",
      description:
        "Award fortune cookies as small prizes during team building challenges or games — personalize messages for winning teams.",
    },
    {
      title: "Retrospective Closer",
      description:
        "End a team retrospective or workshop with fortune cookies — a positive, light-hearted close to a productive session.",
    },
  ],
  faqs: [
    {
      question: "What are good team building fortune cookie messages?",
      answer:
        "Great team building fortunes celebrate collaboration, trust, and shared success — 'Alone we go fast; together we go far' or the funnier 'The team that snacks together, works together.'",
    },
    {
      question: "How do you use fortune cookies for team building?",
      answer:
        "Fortune cookies work as icebreakers (read aloud to open a session), activity prizes, or closing-session gifts. They're especially effective at loosening up formal corporate events.",
    },
    {
      question: "Are fortune cookies good for corporate team building events?",
      answer:
        "Yes! Fortune cookies with team-themed messages are an affordable, universally enjoyed way to add a fun element to any corporate team building event.",
    },
  ],
  relatedOccasions: ["workplace-employee-appreciation", "workplace-office-party", "workplace-work-anniversary", "graduation"],
  group: "workplace",
};

const officeParty: OccasionData = {
  slug: "workplace-office-party",
  title: "Office Party Fortune Cookie Messages",
  badge: "40+ Messages",
  emoji: "🎉",
  description:
    "Make your office party memorable with funny, festive, and workplace-appropriate fortune cookie messages for all colleagues.",
  metaTitle: "40+ Office Party Fortune Cookie Messages | Funny & Festive",
  metaDescription:
    "Liven up the office party with 40+ fortune cookie messages! Funny, festive & workplace-appropriate sayings for holiday parties & corporate events.",
  subcategories: [
    {
      name: "Fun & Office-Appropriate",
      messages: [
        "Tonight, the spreadsheets sleep and the fun begins.",
        "Office party prediction: someone will accidentally reveal too much.",
        "May your eggnog be strong and your emails be brief.",
        "This is the one meeting that counts as work and fun simultaneously.",
        "The dress code tonight is: finally out of Zoom-appropriate tops.",
        "Tonight's agenda: none. Enjoy the freedom.",
        "The copier has been waiting for this party as much as you have.",
        "You survived the year. This party is your reward.",
        "May the year-end review of this party be five stars.",
        "The office plants are proud of you. (They've watched everything.)",
      ],
    },
    {
      name: "Festive & Celebratory",
      messages: [
        "What a year it's been — here's to the team that made it.",
        "Celebrate the wins, learn from the challenges, and enjoy this moment.",
        "This team accomplished great things — tonight we celebrate them all.",
        "Hard work recognized, good people gathered — that's the formula.",
        "Here's to the colleagues who became teammates who became friends.",
        "May the holiday spirit last longer than the open bar.",
        "Another year wiser, stronger, and more deserving of celebration.",
        "To the team that showed up every day — this party is for you.",
        "The best part of this company is the people in this room.",
        "Cheers to the year and the team that lived it.",
      ],
    },
    {
      name: "Short & Punchy",
      messages: [
        "Party time. Well earned.",
        "Cheers to the team!",
        "Tonight: no meetings.",
        "You deserve this.",
        "Great year, great team.",
        "Office hours: suspended.",
        "Celebrate hard.",
        "Tonight we feast.",
        "Eat, drink, be merry.",
        "Work can wait.",
      ],
    },
  ],
  tips: [
    {
      title: "Holiday Party Favor",
      description:
        "Set out a fortune cookie basket at the office holiday party — employees grab one as a party favor and read them aloud for laughs.",
    },
    {
      title: "Secret Santa Bonus",
      description:
        "Include a fortune cookie with a funny office-appropriate message inside every Secret Santa gift for extra fun.",
    },
    {
      title: "Year in Review Activity",
      description:
        "Use fortune cookies with messages that reference company milestones from the year — a fun and personalized party activity.",
    },
  ],
  faqs: [
    {
      question: "What are funny office party fortune cookie messages?",
      answer:
        "Funny office party fortunes reference the shared experience of office life — 'Tonight, the spreadsheets sleep and the fun begins' or 'You survived the year. This party is your reward.'",
    },
    {
      question: "How do you use fortune cookies at an office party?",
      answer:
        "Fortune cookies work as party favors, icebreakers, or activities — set out a basket for guests to grab and read aloud, or use them as prizes for party games.",
    },
    {
      question: "What should office party fortune cookies say?",
      answer:
        "Keep office party fortunes professional but playful — celebrate the team's accomplishments, poke gentle fun at office life, and wish everyone well for the new year.",
    },
  ],
  relatedOccasions: ["workplace-employee-appreciation", "workplace-team-building", "christmas", "new-year"],
  group: "workplace",
};

const workAnniversary: OccasionData = {
  slug: "workplace-work-anniversary",
  title: "Work Anniversary Fortune Cookie Messages",
  badge: "40+ Messages",
  emoji: "📅",
  description:
    "Celebrate years of dedication with sincere, funny, and motivating work anniversary fortune cookie messages for colleagues and employees.",
  metaTitle: "40+ Work Anniversary Fortune Cookie Messages | Sincere & Funny",
  metaDescription:
    "Honor workplace milestones with 40+ work anniversary fortune cookie messages! Sincere, funny & motivating sayings for work anniversaries & milestones.",
  subcategories: [
    {
      name: "Sincere & Celebratory",
      messages: [
        "Years of dedication are the foundation of a remarkable career.",
        "Every year you stay is another year the team is lucky to have you.",
        "Your loyalty and expertise are among this company's greatest assets.",
        "Work anniversaries measure time; your impact measures legacy.",
        "Another year of showing up, stepping up, and making a difference.",
        "You've grown with us — and helped us grow. Thank you.",
        "A work anniversary is a reminder of how much you've contributed.",
        "The years go by, but great colleagues remain irreplaceable.",
        "Your tenure tells a story of consistency, dedication, and excellence.",
        "Here's to another year of doing great work with great people.",
      ],
    },
    {
      name: "Funny Work Anniversary Fortunes",
      messages: [
        "Another year of pretending the printer isn't your nemesis.",
        "Officially too senior to figure out the new software updates.",
        "Your first day felt long. This anniversary feels short. Time is weird.",
        "Years here = expert-level coffee machine navigation.",
        "Fortune predicts: your knowledge is now considered 'institutional wisdom.'",
        "You've survived more software migrations than anyone should.",
        "Another year, another desk plant that you kept alive.",
        "Senior enough to know better; experienced enough not to say it.",
        "The company photo from your first day is evidence of how far you've come.",
        "HR prediction: you will receive cake and a slightly awkward speech.",
      ],
    },
    {
      name: "Short & Impactful",
      messages: [
        "Years well spent.",
        "Your impact is lasting.",
        "Still going strong.",
        "Cheers to another year!",
        "Time flies with great work.",
        "A year more valuable than the last.",
        "Keep doing great things.",
        "Here's to many more.",
        "Dedication celebrated.",
        "Milestone reached — keep going.",
      ],
    },
  ],
  tips: [
    {
      title: "Anniversary Desk Surprise",
      description:
        "Leave a fortune cookie on a colleague's desk on their work anniversary with a year-specific message — '5 years of excellence' makes it personal.",
    },
    {
      title: "All-Team Recognition",
      description:
        "Announce work anniversaries in team meetings and hand out fortune cookies as a fun recognition moment everyone enjoys.",
    },
    {
      title: "Milestone Gift Companion",
      description:
        "Include a fortune cookie with a personalized message alongside a more formal work anniversary gift for a memorable touch.",
    },
  ],
  faqs: [
    {
      question: "What are good work anniversary fortune cookie messages?",
      answer:
        "Work anniversary fortunes balance genuine appreciation with office humor — 'Another year of pretending the printer isn't your nemesis' gets laughs while 'Your loyalty is one of our greatest assets' feels genuinely valued.",
    },
    {
      question: "How do you celebrate a work anniversary with fortune cookies?",
      answer:
        "Surprise the employee with a fortune cookie desk drop, include one in their anniversary recognition package, or have the team share fortunes during a celebration lunch.",
    },
    {
      question: "What should a work anniversary fortune cookie say?",
      answer:
        "Reference the specific milestone if possible ('5 years and still our best') and balance professional appreciation with the kind of insider humor that only comes from shared years of work.",
    },
  ],
  relatedOccasions: ["workplace-employee-appreciation", "workplace-team-building", "retirement", "graduation"],
  group: "workplace",
};

const backToSchool: OccasionData = {
  slug: "back-to-school",
  title: "Back to School Fortune Cookie Messages",
  badge: "40+ Messages",
  emoji: "📚",
  description:
    "Inspire students and teachers for the new school year with motivating, funny, and encouraging fortune cookie messages.",
  metaTitle: "40+ Back to School Fortune Cookie Messages | Inspiring & Funny",
  metaDescription:
    "Start the school year right with 40+ back to school fortune cookie messages! Inspiring, funny & encouraging sayings for students & teachers.",
  subcategories: [
    {
      name: "Inspiring & Motivating",
      messages: [
        "Every school year is a new chapter — make it a great one.",
        "Learning is the superpower that never stops growing.",
        "Your education is the one thing no one can ever take from you.",
        "The new school year is full of people you haven't met yet and ideas you haven't imagined.",
        "Great things happen to those who keep showing up and learning.",
        "Today's knowledge is tomorrow's opportunity.",
        "This year, discover something that surprises you.",
        "The best students are the ones who stay curious.",
        "Every lesson is a step toward who you're becoming.",
        "You are braver than your first-day nerves suggest.",
      ],
    },
    {
      name: "Funny School Fortunes",
      messages: [
        "The school supplies are organized. This will not last.",
        "Prediction: your locker combination will be forgotten by week two.",
        "The pencil case is full. This is the most prepared you will ever be.",
        "May your teacher forget to assign homework on Fridays.",
        "Lunch table prediction: you will find your people.",
        "The first day is the hardest. The second day is similar.",
        "Fortune says: the test is on the chapter you skimmed.",
        "May all group projects be distributed fairly. (They won't.)",
        "School bus wisdom: the back seat teaches more than the textbook.",
        "You survived summer — school is easy by comparison.",
      ],
    },
    {
      name: "Short & Encouraging",
      messages: [
        "New year, new you.",
        "Show up ready.",
        "You've got this.",
        "Learn something today.",
        "First days are new beginnings.",
        "Stay curious.",
        "Make this year count.",
        "You belong here.",
        "Good things take effort.",
        "Be brave. Learn anyway.",
      ],
    },
  ],
  tips: [
    {
      title: "First Day Lunchbox",
      description:
        "Tuck a fortune cookie into your child's lunchbox on the first day of school — a surprise note of encouragement mid-day.",
    },
    {
      title: "Teacher Welcome Gift",
      description:
        "Gift fortune cookies with encouraging messages to teachers at the start of the year as a sweet appreciation gesture.",
    },
    {
      title: "Classroom Community Builder",
      description:
        "Use fortune cookies as an icebreaker on the first day — students read their fortunes and share one thing they hope to learn this year.",
    },
  ],
  faqs: [
    {
      question: "What are good back to school fortune cookie messages?",
      answer:
        "Back to school fortunes mix inspiration with humor — 'The school supplies are organized. This will not last' gets laughs while 'Learning is the superpower that never stops growing' genuinely motivates.",
    },
    {
      question: "How do you use fortune cookies for back to school?",
      answer:
        "Put them in lunchboxes, use them as classroom icebreakers, or give them as first-day gifts to students or teachers. They're a fun way to start the year on a positive note.",
    },
    {
      question: "Are fortune cookies good for teachers?",
      answer:
        "Yes! Fortune cookies with encouraging or funny messages make a thoughtful, affordable gift for teachers at the start of the school year or during Teacher Appreciation Week.",
    },
  ],
  relatedOccasions: ["graduation", "workplace-team-building", "birthday", "retirement"],
  group: "workplace",
  season: "fall",
};

// ---------------------------------------------------------------------------
// MAIN EXPORT
// ---------------------------------------------------------------------------

export const occasions: OccasionData[] = [
  // Lifecycle
  wedding,
  birthday,
  graduation,
  retirement,
  babySHower,
  engagement,
  anniversary,
  bridalShower,
  // Holidays
  valentinesDay,
  christmas,
  newYear,
  halloween,
  thanksgiving,
  mothersDay,
  fathersDay,
  // Workplace
  employeeAppreciation,
  teamBuilding,
  officeParty,
  workAnniversary,
  backToSchool,
];

/**
 * Get a single occasion by slug
 */
export function getOccasion(slug: string): OccasionData | undefined {
  return occasions.find((o) => o.slug === slug);
}

/**
 * Get all occasion slugs (for generateStaticParams)
 */
export function getAllOccasionSlugs(): string[] {
  return occasions.map((o) => o.slug);
}

/**
 * Get occasions by group
 */
export function getOccasionsByGroup(
  group: OccasionData["group"],
): OccasionData[] {
  return occasions.filter((o) => o.group === group);
}

/**
 * Get total message count for an occasion
 */
export function getOccasionMessageCount(slug: string): number {
  const occasion = getOccasion(slug);
  if (!occasion) return 0;
  return occasion.subcategories.reduce(
    (total, sub) => total + sub.messages.length,
    0,
  );
}

export { occasions as occasionsDatabase };
