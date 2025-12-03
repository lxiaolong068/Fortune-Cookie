// OpenRouter API client for AI-powered fortune generation

import {
  FortuneGenerator,
  FortuneTheme,
  FortuneMood,
  FortuneLength,
  type Fortune
} from './fortune-utils'

export interface FortuneRequest {
  theme?: FortuneTheme
  mood?: FortuneMood
  length?: FortuneLength
  customPrompt?: string
}

export type FortuneResponse = Fortune

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
    const baseInstruction = `IMPORTANT: Output ONLY the fortune message itself. No explanations, no character counts, no additional text. Just the fortune in 1-2 sentences under 100 characters.`

    const prompts = {
      funny: `You are a witty fortune cookie writer. Create humorous, clever, and lighthearted fortune messages that make people smile. Keep them family-friendly and positive. ${baseInstruction}`,

      inspirational: `You are an inspirational fortune cookie writer. Create uplifting, motivational messages that inspire hope, courage, and positive action. Focus on personal growth, dreams, and overcoming challenges. ${baseInstruction}`,

      love: `You are a romantic fortune cookie writer. Create heartwarming messages about love, relationships, friendship, and human connections. Keep them sweet, meaningful, and universally relatable. ${baseInstruction}`,

      success: `You are a success-focused fortune cookie writer. Create messages about achievement, career growth, financial prosperity, and professional development. Focus on ambition, hard work, and reaching goals. ${baseInstruction}`,

      wisdom: `You are a wise fortune cookie writer. Create thoughtful, philosophical messages that offer life wisdom, ancient proverbs, and timeless truths. Focus on deeper meaning and reflection. ${baseInstruction}`,

      random: `You are a versatile fortune cookie writer. Create a fortune message that could be funny, inspirational, wise, or about love/success. Choose randomly and make it engaging and memorable. ${baseInstruction}`
    }

    return prompts[theme as keyof typeof prompts] || prompts.random
  }

  // Use FortuneGenerator for lucky numbers
  private generateLuckyNumbers(): number[] {
    return FortuneGenerator.generateLuckyNumbers()
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
          model: 'deepseek/deepseek-chat-v3-0324',
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

      // Use FortuneGenerator to format and create fortune
      const cleanMessage = FortuneGenerator.cleanMessage(message)
      const formattedMessage = FortuneGenerator.formatFortune(cleanMessage)

      return FortuneGenerator.createFortune(formattedMessage, theme, undefined, 'ai')
      
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

    if (fortunes.length === 0) {
      throw new Error('No fallback fortunes available')
    }

    const randomIndex = Math.floor(Math.random() * fortunes.length)
    const randomFortune = fortunes[randomIndex]

    if (!randomFortune) {
      throw new Error('Failed to select fallback fortune')
    }

    // Use FortuneGenerator to create fortune with fallback source
    return FortuneGenerator.createFortune(randomFortune, theme as FortuneTheme, undefined, 'fallback')
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
