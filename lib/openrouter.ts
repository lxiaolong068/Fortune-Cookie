// OpenRouter API client for AI-powered fortune generation

import {
  FortuneGenerator,
  FortuneTheme,
  FortuneMood,
  FortuneLength,
  type Fortune,
} from "./fortune-utils";

// Personalization types
export type Scenario = "work" | "love" | "study" | "health" | "other" | "";
export type Tone = "soft" | "direct" | "playful" | "";
export type Language = "en" | "zh";

export interface FortuneRequest {
  theme?: FortuneTheme;
  mood?: FortuneMood;
  length?: FortuneLength;
  customPrompt?: string;
  // New personalization fields
  scenario?: Scenario;
  tone?: Tone;
  language?: Language;
}

export type FortuneResponse = Fortune;

type OpenRouterApiError = {
  provider: "openrouter";
  status?: number;
  code?: string;
  message: string;
};

class OpenRouterClient {
  private apiKey: string;
  private baseUrl: string;
  private model: string;

  constructor() {
    this.apiKey = (process.env.OPENROUTER_API_KEY || "").trim();
    this.baseUrl = (
      process.env.OPENROUTER_BASE_URL || "https://openrouter.ai/api/v1"
    ).replace(/\/+$/, "");
    this.model = (process.env.OPENROUTER_MODEL || "openai/gpt-4o-mini").trim();

    if (!this.apiKey) {
      console.warn(
        "OpenRouter API key not found. AI features will be disabled.",
      );
    }
  }

  private getSystemPrompt(theme: string, language: Language = "en"): string {
    const languageInstruction =
      language === "zh"
        ? "IMPORTANT: Output ONLY the fortune message itself in Simplified Chinese (简体中文). No explanations, no character counts, no additional text. Just the fortune in 1-2 sentences under 50 Chinese characters."
        : "IMPORTANT: Output ONLY the fortune message itself. No explanations, no character counts, no additional text. Just the fortune in 1-2 sentences under 100 characters.";

    const prompts =
      language === "zh"
        ? {
            funny: `你是一个智慧幽默的签文作家。创作幽默、机智、轻松的签文，让人会心一笑。保持正面积极、适合所有年龄。${languageInstruction}`,

            inspirational: `你是一个励志签文作家。创作振奋人心、积极向上的签文，激励人们追求梦想、勇敢前行。聚焦个人成长和克服挑战。${languageInstruction}`,

            love: `你是一个浪漫签文作家。创作关于爱情、友情、人际关系的温馨签文。保持甜蜜、有意义、普遍共鸣。${languageInstruction}`,

            success: `你是一个成功导向的签文作家。创作关于成就、事业发展、财富繁荣的签文。聚焦抱负、努力和目标达成。${languageInstruction}`,

            wisdom: `你是一个智慧签文作家。创作富有哲理、引人深思的签文，传递人生智慧和古老谚语。聚焦深层含义和反思。${languageInstruction}`,

            random: `你是一个多才多艺的签文作家。随机创作幽默、励志、智慧或关于爱情/成功的签文。让它引人入胜、令人难忘。${languageInstruction}`,
          }
        : {
            funny: `You are a witty fortune cookie writer. Create humorous, clever, and lighthearted fortune messages that make people smile. Keep them family-friendly and positive. ${languageInstruction}`,

            inspirational: `You are an inspirational fortune cookie writer. Create uplifting, motivational messages that inspire hope, courage, and positive action. Focus on personal growth, dreams, and overcoming challenges. ${languageInstruction}`,

            love: `You are a romantic fortune cookie writer. Create heartwarming messages about love, relationships, friendship, and human connections. Keep them sweet, meaningful, and universally relatable. ${languageInstruction}`,

            success: `You are a success-focused fortune cookie writer. Create messages about achievement, career growth, financial prosperity, and professional development. Focus on ambition, hard work, and reaching goals. ${languageInstruction}`,

            wisdom: `You are a wise fortune cookie writer. Create thoughtful, philosophical messages that offer life wisdom, ancient proverbs, and timeless truths. Focus on deeper meaning and reflection. ${languageInstruction}`,

            random: `You are a versatile fortune cookie writer. Create a fortune message that could be funny, inspirational, wise, or about love/success. Choose randomly and make it engaging and memorable. ${languageInstruction}`,
          };

    return prompts[theme as keyof typeof prompts] || prompts.random;
  }

  private attachAiError(
    fortune: FortuneResponse,
    aiError: OpenRouterApiError,
  ): FortuneResponse {
    return {
      ...fortune,
      aiError,
    };
  }

  private async parseOpenRouterError(
    response: Response,
  ): Promise<OpenRouterApiError> {
    const status = response.status;

    try {
      const isProd = process.env.NODE_ENV === "production";
      const json = (await response.json().catch(() => null)) as unknown;
      const errorObj =
        json && typeof json === "object" && "error" in json
          ? (json as { error?: unknown }).error
          : undefined;
      const rawMessage =
        errorObj &&
        typeof errorObj === "object" &&
        "message" in errorObj &&
        typeof (errorObj as { message?: unknown }).message === "string"
          ? (errorObj as { message: string }).message
          : undefined;
      const code =
        errorObj &&
        typeof errorObj === "object" &&
        "code" in errorObj &&
        typeof (errorObj as { code?: unknown }).code === "string"
          ? (errorObj as { code: string }).code
          : undefined;

      const message =
        status === 401
          ? "OpenRouter authentication failed. Verify OPENROUTER_API_KEY."
          : status === 403
            ? "OpenRouter access denied. Check your account permissions/quota."
            : status === 429
              ? "OpenRouter rate limited. Please try again later."
              : (!isProd && rawMessage) || `OpenRouter API error (${status})`;

      return { provider: "openrouter", status, code, message };
    } catch {
      return {
        provider: "openrouter",
        status,
        message: `OpenRouter API error (${status})`,
      };
    }
  }

  private buildHeaders(): Record<string, string> {
    return {
      Authorization: `Bearer ${this.apiKey}`,
      "Content-Type": "application/json",
      "HTTP-Referer":
        process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
      "X-Title": "Fortune Cookie AI",
    };
  }

  // Use FortuneGenerator for lucky numbers
  private generateLuckyNumbers(): number[] {
    return FortuneGenerator.generateLuckyNumbers();
  }

  async generateFortune(request: FortuneRequest): Promise<FortuneResponse> {
    // If no API key, return a fallback fortune
    if (!this.apiKey) {
      const theme = request.theme || "random";
      const fortune = this.getFallbackFortune(theme);
      return this.attachAiError(fortune, {
        provider: "openrouter",
        message: "OpenRouter API key is missing",
      });
    }

    try {
      const theme = request.theme || "random";
      const language = request.language || "en";
      const systemPrompt = this.getSystemPrompt(theme, language);

      let userPrompt = `Generate a fortune cookie message.`;

      // Add scenario context if provided
      if (request.scenario) {
        const scenarioContexts: Record<string, string> = {
          work: "for someone focused on their career and professional life",
          love: "for someone thinking about love and relationships",
          study: "for someone focused on learning and academic pursuits",
          health: "for someone concerned about health and wellness",
          other: "for general life guidance",
        };
        const scenarioContext = scenarioContexts[request.scenario] || "";
        if (scenarioContext) {
          userPrompt += ` Context: This fortune is ${scenarioContext}.`;
        }
      }

      // Add tone modifier if provided
      if (request.tone) {
        const toneDescriptions: Record<string, string> = {
          soft: "gentle, warm, and comforting",
          direct: "straightforward, honest, and no-nonsense",
          playful: "fun, lighthearted, and witty",
        };
        const toneStyle = toneDescriptions[request.tone] || "";
        if (toneStyle) {
          userPrompt += ` Tone: Make it ${toneStyle}.`;
        }
      }

      if (request.customPrompt) {
        userPrompt += ` Custom request: ${request.customPrompt}`;
      }

      if (request.mood) {
        userPrompt += ` Mood: ${request.mood}`;
      }

      if (request.length) {
        const lengthGuide = {
          short: "Keep it very concise (under 50 characters)",
          medium: "Medium length (50-80 characters)",
          long: "Longer message (80-100 characters)",
        };
        userPrompt += ` Length: ${lengthGuide[request.length]}`;
      }

      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: "POST",
        headers: this.buildHeaders(),
        body: JSON.stringify({
          model: this.model,
          messages: [
            {
              role: "system",
              content: systemPrompt,
            },
            {
              role: "user",
              content: userPrompt,
            },
          ],
          max_tokens: 150,
          temperature: 0.8,
          top_p: 0.9,
        }),
      });

      if (!response.ok) {
        const aiError = await this.parseOpenRouterError(response);
        console.error("OpenRouter request failed:", {
          status: aiError.status,
          code: aiError.code,
          message: aiError.message,
        });
        const fallbackFortune = this.getFallbackFortune(theme);
        return this.attachAiError(fallbackFortune, aiError);
      }

      const data = await response.json();
      const message = data.choices?.[0]?.message?.content?.trim() || "";

      // Use FortuneGenerator to format and create fortune
      const cleanMessage = FortuneGenerator.cleanMessage(message);
      const formattedMessage = FortuneGenerator.formatFortune(cleanMessage);

      return FortuneGenerator.createFortune(
        formattedMessage,
        theme,
        undefined,
        "ai",
      );
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      console.error("Error generating fortune:", message);
      // Return fallback fortune on error
      const theme = request.theme || "random";
      const fallbackFortune = this.getFallbackFortune(theme);
      return this.attachAiError(fallbackFortune, {
        provider: "openrouter",
        message,
      });
    }
  }

  private getFallbackFortune(theme: string): FortuneResponse {
    const fallbackFortunes = {
      funny: [
        "You will find happiness with a new love... probably your cat.",
        "A closed mouth gathers no foot.",
        "The early bird might get the worm, but the second mouse gets the cheese.",
        "Help! I'm being held prisoner in a fortune cookie factory!",
        "You will be hungry again in one hour.",
      ],
      inspirational: [
        "Your future is created by what you do today, not tomorrow.",
        "Believe you can and you're halfway there.",
        "The only way to do great work is to love what you do.",
        "Success is not final, failure is not fatal: it is the courage to continue that counts.",
        "The best time to plant a tree was 20 years ago. The second best time is now.",
      ],
      love: [
        "Love is the bridge between two hearts.",
        "The best love is the kind that awakens the soul.",
        "True love stories never have endings.",
        "Love is not about finding the right person, but being the right person.",
        "In the arithmetic of love, one plus one equals everything.",
      ],
      success: [
        "Success is where preparation and opportunity meet.",
        "The way to get started is to quit talking and begin doing.",
        "Innovation distinguishes between a leader and a follower.",
        "Don't be afraid to give up the good to go for the great.",
        "Your limitation—it's only your imagination.",
      ],
      wisdom: [
        "The journey of a thousand miles begins with one step.",
        "What lies behind us and what lies before us are tiny matters compared to what lies within us.",
        "Be yourself; everyone else is already taken.",
        "In the middle of difficulty lies opportunity.",
        "The mind is everything. What you think you become.",
      ],
      random: [
        "Your future is created by what you do today, not tomorrow.",
        "You will find happiness with a new love... probably your cat.",
        "Love is the bridge between two hearts.",
        "Success is where preparation and opportunity meet.",
        "The journey of a thousand miles begins with one step.",
      ],
    };

    const fortunes =
      fallbackFortunes[theme as keyof typeof fallbackFortunes] ||
      fallbackFortunes.random;

    if (fortunes.length === 0) {
      throw new Error("No fallback fortunes available");
    }

    const randomIndex = Math.floor(Math.random() * fortunes.length);
    const randomFortune = fortunes[randomIndex];

    if (!randomFortune) {
      throw new Error("Failed to select fallback fortune");
    }

    // Use FortuneGenerator to create fortune with fallback source
    return FortuneGenerator.createFortune(
      randomFortune,
      theme as FortuneTheme,
      undefined,
      "fallback",
    );
  }

  // Health check method
  async healthCheck(): Promise<boolean> {
    if (!this.apiKey) return false;

    try {
      const response = await fetch(`${this.baseUrl}/auth/key`, {
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          "HTTP-Referer":
            process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
          "X-Title": "Fortune Cookie AI",
        },
      });
      if (!response.ok) {
        if (process.env.NODE_ENV !== "production") {
          const aiError = await this.parseOpenRouterError(response);
          console.warn("OpenRouter health check failed:", {
            status: aiError.status,
            code: aiError.code,
            message: aiError.message,
          });
        }
        return false;
      }
      return true;
    } catch {
      return false;
    }
  }
}

// Export singleton instance
export const openRouterClient = new OpenRouterClient();
