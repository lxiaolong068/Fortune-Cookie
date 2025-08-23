// OpenRouter API client for AI-powered fortune generation

export interface FortuneRequest {
  theme?: 'funny' | 'inspirational' | 'love' | 'success' | 'wisdom' | 'random'
  mood?: 'positive' | 'neutral' | 'motivational'
  length?: 'short' | 'medium' | 'long'
  customPrompt?: string
}

export interface FortuneResponse {
  message: string
  luckyNumbers: number[]
  theme: string
  timestamp: string
}

class OpenRouterClient {
  private apiKey: string
  private baseUrl: string

  constructor() {
    this.apiKey = process.env.OPENROUTER_API_KEY || ''
    this.baseUrl = process.env.OPENROUTER_BASE_URL || 'https://openrouter.ai/api/v1'
    
    if (!this.apiKey) {
      console.warn('OpenRouter API key not found. AI features will be disabled.')
    }
  }

  private getSystemPrompt(theme: string): string {
    const prompts = {
      funny: `You are a witty fortune cookie writer. Create humorous, clever, and lighthearted fortune messages that make people smile. Keep them family-friendly and positive. The message should be 1-2 sentences and under 100 characters.`,
      
      inspirational: `You are an inspirational fortune cookie writer. Create uplifting, motivational messages that inspire hope, courage, and positive action. Focus on personal growth, dreams, and overcoming challenges. The message should be 1-2 sentences and under 100 characters.`,
      
      love: `You are a romantic fortune cookie writer. Create heartwarming messages about love, relationships, friendship, and human connections. Keep them sweet, meaningful, and universally relatable. The message should be 1-2 sentences and under 100 characters.`,
      
      success: `You are a success-focused fortune cookie writer. Create messages about achievement, career growth, financial prosperity, and professional development. Focus on ambition, hard work, and reaching goals. The message should be 1-2 sentences and under 100 characters.`,
      
      wisdom: `You are a wise fortune cookie writer. Create thoughtful, philosophical messages that offer life wisdom, ancient proverbs, and timeless truths. Focus on deeper meaning and reflection. The message should be 1-2 sentences and under 100 characters.`,
      
      random: `You are a versatile fortune cookie writer. Create a fortune message that could be funny, inspirational, wise, or about love/success. Choose randomly and make it engaging and memorable. The message should be 1-2 sentences and under 100 characters.`
    }
    
    return prompts[theme as keyof typeof prompts] || prompts.random
  }

  private generateLuckyNumbers(): number[] {
    const numbers = new Set<number>()
    while (numbers.size < 6) {
      numbers.add(Math.floor(Math.random() * 69) + 1)
    }
    return Array.from(numbers).sort((a, b) => a - b)
  }

  async generateFortune(request: FortuneRequest): Promise<FortuneResponse> {
    // If no API key, return a fallback fortune
    if (!this.apiKey) {
      return this.getFallbackFortune(request.theme || 'random')
    }

    try {
      const theme = request.theme || 'random'
      const systemPrompt = this.getSystemPrompt(theme)
      
      let userPrompt = `Generate a fortune cookie message.`
      
      if (request.customPrompt) {
        userPrompt += ` Custom request: ${request.customPrompt}`
      }
      
      if (request.mood) {
        userPrompt += ` Mood: ${request.mood}`
      }
      
      if (request.length) {
        const lengthGuide = {
          short: 'Keep it very concise (under 50 characters)',
          medium: 'Medium length (50-80 characters)', 
          long: 'Longer message (80-100 characters)'
        }
        userPrompt += ` Length: ${lengthGuide[request.length]}`
      }

      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
          'X-Title': 'Fortune Cookie AI'
        },
        body: JSON.stringify({
          model: 'anthropic/claude-3-haiku',
          messages: [
            {
              role: 'system',
              content: systemPrompt
            },
            {
              role: 'user', 
              content: userPrompt
            }
          ],
          max_tokens: 150,
          temperature: 0.8,
          top_p: 0.9
        })
      })

      if (!response.ok) {
        throw new Error(`OpenRouter API error: ${response.status}`)
      }

      const data = await response.json()
      const message = data.choices?.[0]?.message?.content?.trim() || ''
      
      // Clean up the message (remove quotes if present)
      const cleanMessage = message.replace(/^["']|["']$/g, '').trim()
      
      return {
        message: cleanMessage,
        luckyNumbers: this.generateLuckyNumbers(),
        theme,
        timestamp: new Date().toISOString()
      }
      
    } catch (error) {
      console.error('Error generating fortune:', error)
      // Return fallback fortune on error
      return this.getFallbackFortune(request.theme || 'random')
    }
  }

  private getFallbackFortune(theme: string): FortuneResponse {
    const fallbackFortunes = {
      funny: [
        "You will find happiness with a new love... probably your cat.",
        "A closed mouth gathers no foot.",
        "The early bird might get the worm, but the second mouse gets the cheese.",
        "Help! I'm being held prisoner in a fortune cookie factory!",
        "You will be hungry again in one hour."
      ],
      inspirational: [
        "Your future is created by what you do today, not tomorrow.",
        "Believe you can and you're halfway there.",
        "The only way to do great work is to love what you do.",
        "Success is not final, failure is not fatal: it is the courage to continue that counts.",
        "The best time to plant a tree was 20 years ago. The second best time is now."
      ],
      love: [
        "Love is the bridge between two hearts.",
        "The best love is the kind that awakens the soul.",
        "True love stories never have endings.",
        "Love is not about finding the right person, but being the right person.",
        "In the arithmetic of love, one plus one equals everything."
      ],
      success: [
        "Success is where preparation and opportunity meet.",
        "The way to get started is to quit talking and begin doing.",
        "Innovation distinguishes between a leader and a follower.",
        "Don't be afraid to give up the good to go for the great.",
        "Your limitation—it's only your imagination."
      ],
      wisdom: [
        "The journey of a thousand miles begins with one step.",
        "What lies behind us and what lies before us are tiny matters compared to what lies within us.",
        "Be yourself; everyone else is already taken.",
        "In the middle of difficulty lies opportunity.",
        "The mind is everything. What you think you become."
      ],
      random: [
        "Your future is created by what you do today, not tomorrow.",
        "You will find happiness with a new love... probably your cat.",
        "Love is the bridge between two hearts.",
        "Success is where preparation and opportunity meet.",
        "The journey of a thousand miles begins with one step."
      ]
    }

    const fortunes = fallbackFortunes[theme as keyof typeof fallbackFortunes] || fallbackFortunes.random
    const randomFortune = fortunes[Math.floor(Math.random() * fortunes.length)]
    
    return {
      message: randomFortune,
      luckyNumbers: this.generateLuckyNumbers(),
      theme,
      timestamp: new Date().toISOString()
    }
  }

  // Health check method
  async healthCheck(): Promise<boolean> {
    if (!this.apiKey) return false
    
    try {
      const response = await fetch(`${this.baseUrl}/models`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`
        }
      })
      return response.ok
    } catch {
      return false
    }
  }
}

// Export singleton instance
export const openRouterClient = new OpenRouterClient()
