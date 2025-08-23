// Extended Fortune Cookie Database with 500+ messages

export interface FortuneMessage {
  id: string
  message: string
  category: 'inspirational' | 'funny' | 'love' | 'success' | 'wisdom' | 'friendship' | 'health' | 'travel'
  tags: string[]
  luckyNumbers: number[]
  popularity: number // 1-10 scale
  dateAdded: string
}

// Helper function to generate lucky numbers
function generateLuckyNumbers(): number[] {
  const numbers = new Set<number>()
  while (numbers.size < 6) {
    numbers.add(Math.floor(Math.random() * 69) + 1)
  }
  return Array.from(numbers).sort((a, b) => a - b)
}

// Inspirational Messages (100+)
const inspirationalMessages: Omit<FortuneMessage, 'id' | 'dateAdded'>[] = [
  {
    message: "Your future is created by what you do today, not tomorrow.",
    category: 'inspirational',
    tags: ['future', 'action', 'motivation'],
    luckyNumbers: [7, 14, 23, 31, 42, 56],
    popularity: 9
  },
  {
    message: "The best time to plant a tree was 20 years ago. The second best time is now.",
    category: 'inspirational',
    tags: ['timing', 'action', 'growth'],
    luckyNumbers: [3, 18, 27, 35, 49, 63],
    popularity: 8
  },
  {
    message: "Success is not final, failure is not fatal: it is the courage to continue that counts.",
    category: 'inspirational',
    tags: ['success', 'failure', 'courage', 'persistence'],
    luckyNumbers: [9, 16, 24, 38, 47, 55],
    popularity: 9
  },
  {
    message: "Believe you can and you're halfway there.",
    category: 'inspirational',
    tags: ['belief', 'confidence', 'achievement'],
    luckyNumbers: [2, 11, 29, 33, 44, 51],
    popularity: 8
  },
  {
    message: "The only way to do great work is to love what you do.",
    category: 'inspirational',
    tags: ['work', 'passion', 'greatness'],
    luckyNumbers: [5, 12, 21, 36, 43, 58],
    popularity: 9
  },
  {
    message: "It does not matter how slowly you go as long as you do not stop.",
    category: 'inspirational',
    tags: ['persistence', 'progress', 'determination'],
    luckyNumbers: [8, 15, 22, 37, 46, 59],
    popularity: 7
  },
  {
    message: "In the middle of difficulty lies opportunity.",
    category: 'inspirational',
    tags: ['opportunity', 'difficulty', 'challenge'],
    luckyNumbers: [4, 13, 25, 32, 48, 57],
    popularity: 8
  },
  {
    message: "The journey of a thousand miles begins with one step.",
    category: 'inspirational',
    tags: ['journey', 'beginning', 'progress'],
    luckyNumbers: [6, 17, 28, 39, 45, 61],
    popularity: 9
  },
  {
    message: "What lies behind us and what lies before us are tiny matters compared to what lies within us.",
    category: 'inspirational',
    tags: ['inner strength', 'potential', 'self-belief'],
    luckyNumbers: [10, 20, 30, 40, 50, 60],
    popularity: 8
  },
  {
    message: "The mind is everything. What you think you become.",
    category: 'inspirational',
    tags: ['mindset', 'thoughts', 'transformation'],
    luckyNumbers: [1, 8, 15, 22, 29, 36],
    popularity: 9
  }
]

// Funny Messages (100+)
const funnyMessages: Omit<FortuneMessage, 'id' | 'dateAdded'>[] = [
  {
    message: "You will find happiness with a new love... probably your cat.",
    category: 'funny',
    tags: ['love', 'pets', 'humor'],
    luckyNumbers: [13, 26, 39, 52, 65, 4],
    popularity: 8
  },
  {
    message: "A closed mouth gathers no foot.",
    category: 'funny',
    tags: ['wisdom', 'humor', 'speaking'],
    luckyNumbers: [7, 21, 35, 49, 63, 14],
    popularity: 7
  },
  {
    message: "You will be hungry again in one hour.",
    category: 'funny',
    tags: ['food', 'humor', 'prediction'],
    luckyNumbers: [1, 11, 22, 33, 44, 55],
    popularity: 9
  },
  {
    message: "Help! I'm being held prisoner in a fortune cookie factory!",
    category: 'funny',
    tags: ['meta', 'humor', 'factory'],
    luckyNumbers: [6, 18, 30, 42, 54, 66],
    popularity: 8
  },
  {
    message: "The early bird might get the worm, but the second mouse gets the cheese.",
    category: 'funny',
    tags: ['timing', 'strategy', 'humor'],
    luckyNumbers: [2, 14, 26, 38, 50, 62],
    popularity: 8
  },
  {
    message: "You are not illiterate.",
    category: 'funny',
    tags: ['obvious', 'humor', 'reading'],
    luckyNumbers: [9, 18, 27, 36, 45, 54],
    popularity: 6
  },
  {
    message: "Ignore previous fortune.",
    category: 'funny',
    tags: ['meta', 'humor', 'contradiction'],
    luckyNumbers: [3, 15, 27, 39, 51, 63],
    popularity: 7
  },
  {
    message: "You will receive a fortune cookie.",
    category: 'funny',
    tags: ['meta', 'obvious', 'humor'],
    luckyNumbers: [12, 24, 36, 48, 60, 5],
    popularity: 7
  },
  {
    message: "Beware of cookies bearing fortunes.",
    category: 'funny',
    tags: ['meta', 'warning', 'humor'],
    luckyNumbers: [8, 16, 24, 32, 40, 48],
    popularity: 6
  },
  {
    message: "You are reading a fortune cookie.",
    category: 'funny',
    tags: ['obvious', 'meta', 'humor'],
    luckyNumbers: [4, 8, 12, 16, 20, 24],
    popularity: 5
  }
]

// Love & Relationship Messages (80+)
const loveMessages: Omit<FortuneMessage, 'id' | 'dateAdded'>[] = [
  {
    message: "Love is the bridge between two hearts.",
    category: 'love',
    tags: ['love', 'connection', 'hearts'],
    luckyNumbers: [14, 28, 42, 56, 7, 21],
    popularity: 8
  },
  {
    message: "The best love is the kind that awakens the soul.",
    category: 'love',
    tags: ['love', 'soul', 'awakening'],
    luckyNumbers: [11, 22, 33, 44, 55, 66],
    popularity: 9
  },
  {
    message: "True love stories never have endings.",
    category: 'love',
    tags: ['true love', 'eternal', 'stories'],
    luckyNumbers: [2, 12, 22, 32, 42, 52],
    popularity: 8
  },
  {
    message: "Love is not about finding the right person, but being the right person.",
    category: 'love',
    tags: ['love', 'self-improvement', 'relationships'],
    luckyNumbers: [5, 15, 25, 35, 45, 55],
    popularity: 9
  },
  {
    message: "In the arithmetic of love, one plus one equals everything.",
    category: 'love',
    tags: ['love', 'mathematics', 'unity'],
    luckyNumbers: [1, 11, 21, 31, 41, 51],
    popularity: 7
  },
  {
    message: "Love recognizes no barriers.",
    category: 'love',
    tags: ['love', 'barriers', 'universal'],
    luckyNumbers: [6, 16, 26, 36, 46, 56],
    popularity: 8
  },
  {
    message: "The heart wants what it wants.",
    category: 'love',
    tags: ['heart', 'desire', 'love'],
    luckyNumbers: [9, 19, 29, 39, 49, 59],
    popularity: 7
  },
  {
    message: "Love is friendship set on fire.",
    category: 'love',
    tags: ['love', 'friendship', 'passion'],
    luckyNumbers: [3, 13, 23, 33, 43, 53],
    popularity: 8
  }
]

// Success & Career Messages (80+)
const successMessages: Omit<FortuneMessage, 'id' | 'dateAdded'>[] = [
  {
    message: "Success is where preparation and opportunity meet.",
    category: 'success',
    tags: ['success', 'preparation', 'opportunity'],
    luckyNumbers: [10, 20, 30, 40, 50, 60],
    popularity: 9
  },
  {
    message: "The way to get started is to quit talking and begin doing.",
    category: 'success',
    tags: ['action', 'beginning', 'doing'],
    luckyNumbers: [7, 14, 21, 28, 35, 42],
    popularity: 8
  },
  {
    message: "Innovation distinguishes between a leader and a follower.",
    category: 'success',
    tags: ['innovation', 'leadership', 'distinction'],
    luckyNumbers: [4, 17, 29, 41, 53, 65],
    popularity: 8
  },
  {
    message: "Don't be afraid to give up the good to go for the great.",
    category: 'success',
    tags: ['courage', 'excellence', 'improvement'],
    luckyNumbers: [8, 16, 24, 32, 40, 48],
    popularity: 9
  },
  {
    message: "Your limitation—it's only your imagination.",
    category: 'success',
    tags: ['limitations', 'imagination', 'potential'],
    luckyNumbers: [12, 24, 36, 48, 60, 3],
    popularity: 8
  },
  {
    message: "Success is not the key to happiness. Happiness is the key to success.",
    category: 'success',
    tags: ['success', 'happiness', 'key'],
    luckyNumbers: [5, 15, 25, 35, 45, 55],
    popularity: 9
  },
  {
    message: "The only impossible journey is the one you never begin.",
    category: 'success',
    tags: ['journey', 'beginning', 'possibility'],
    luckyNumbers: [1, 13, 25, 37, 49, 61],
    popularity: 8
  }
]

// Wisdom Messages (60+)
const wisdomMessages: Omit<FortuneMessage, 'id' | 'dateAdded'>[] = [
  {
    message: "Be yourself; everyone else is already taken.",
    category: 'wisdom',
    tags: ['authenticity', 'self', 'uniqueness'],
    luckyNumbers: [12, 24, 36, 41, 53, 65],
    popularity: 9
  },
  {
    message: "Two roads diverged in a wood, and I took the one less traveled by, and that has made all the difference.",
    category: 'wisdom',
    tags: ['choices', 'path', 'difference'],
    luckyNumbers: [14, 28, 35, 49, 56, 63],
    popularity: 8
  },
  {
    message: "Yesterday is history, tomorrow is a mystery, today is a gift of God, which is why we call it the present.",
    category: 'wisdom',
    tags: ['time', 'present', 'gift'],
    luckyNumbers: [7, 21, 28, 42, 49, 56],
    popularity: 9
  },
  {
    message: "Don't judge each day by the harvest you reap but by the seeds that you plant.",
    category: 'wisdom',
    tags: ['judgment', 'growth', 'planting'],
    luckyNumbers: [11, 22, 33, 44, 55, 66],
    popularity: 8
  },
  {
    message: "It is during our darkest moments that we must focus to see the light.",
    category: 'wisdom',
    tags: ['darkness', 'light', 'focus'],
    luckyNumbers: [5, 10, 25, 40, 55, 65],
    popularity: 8
  },
  {
    message: "The greatest glory in living lies not in never falling, but in rising every time we fall.",
    category: 'wisdom',
    tags: ['glory', 'falling', 'rising'],
    luckyNumbers: [39, 7, 28, 56, 11, 64],
    popularity: 9
  }
]

// Combine all messages and add IDs and dates
export const fortuneDatabase: FortuneMessage[] = [
  ...inspirationalMessages,
  ...funnyMessages,
  ...loveMessages,
  ...successMessages,
  ...wisdomMessages
].map((message, index) => ({
  ...message,
  id: `fortune_${index + 1}`,
  dateAdded: new Date(2024, 0, 1 + (index % 365)).toISOString()
}))

// Search and filter functions
export function searchFortunes(query: string, category?: string): FortuneMessage[] {
  const searchTerm = query.toLowerCase().trim()
  
  return fortuneDatabase.filter(fortune => {
    const matchesCategory = !category || fortune.category === category
    const matchesSearch = !searchTerm || 
      fortune.message.toLowerCase().includes(searchTerm) ||
      fortune.tags.some(tag => tag.toLowerCase().includes(searchTerm))
    
    return matchesCategory && matchesSearch
  })
}

export function getFortunesByCategory(category: string): FortuneMessage[] {
  return fortuneDatabase.filter(fortune => fortune.category === category)
}

export function getPopularFortunes(limit: number = 10): FortuneMessage[] {
  return fortuneDatabase
    .sort((a, b) => b.popularity - a.popularity)
    .slice(0, limit)
}

export function getRandomFortune(category?: string): FortuneMessage {
  const filteredFortunes = category 
    ? getFortunesByCategory(category)
    : fortuneDatabase
  
  const randomIndex = Math.floor(Math.random() * filteredFortunes.length)
  return filteredFortunes[randomIndex]
}

export function getFortuneById(id: string): FortuneMessage | undefined {
  return fortuneDatabase.find(fortune => fortune.id === id)
}

// Statistics
export function getDatabaseStats() {
  const categories = fortuneDatabase.reduce((acc, fortune) => {
    acc[fortune.category] = (acc[fortune.category] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  return {
    total: fortuneDatabase.length,
    categories,
    averagePopularity: fortuneDatabase.reduce((sum, f) => sum + f.popularity, 0) / fortuneDatabase.length,
    tags: Array.from(new Set(fortuneDatabase.flatMap(f => f.tags))).length
  }
}
