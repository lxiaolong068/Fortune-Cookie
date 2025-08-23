# 🤖 AI功能集成指南 - OpenRouter API

## 📋 准备工作

### 1. 获取OpenRouter API密钥
1. 访问 [OpenRouter.ai](https://openrouter.ai/)
2. 注册账户并获取API密钥
3. 在项目根目录创建 `.env.local` 文件：
```bash
OPENROUTER_API_KEY=your_api_key_here
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 2. 安装必要依赖
```bash
npm install openai  # 用于类型定义
npm install zod     # 用于数据验证
```

## 🔧 API路由实现

### 1. 创建AI生成API (`src/app/api/generate-fortune/route.ts`)

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

// 请求数据验证schema
const FortuneRequestSchema = z.object({
  theme: z.enum(['funny', 'inspirational', 'love', 'success', 'wisdom', 'custom']),
  customPrompt: z.string().optional(),
  language: z.string().default('en'),
})

// 主题提示词映射
const THEME_PROMPTS = {
  funny: 'Generate a humorous but positive fortune cookie message that will make people smile. Keep it light-hearted and family-friendly.',
  inspirational: 'Create an uplifting and motivational fortune cookie message about personal growth, success, or overcoming challenges.',
  love: 'Write a romantic and heartwarming fortune cookie message about love, relationships, or finding happiness with others.',
  success: 'Generate an encouraging fortune cookie message about achieving goals, career success, or personal accomplishments.',
  wisdom: 'Create a wise and thoughtful fortune cookie message with life advice or philosophical insights.',
  custom: 'Generate a positive and meaningful fortune cookie message based on the user\'s specific request.'
}

export async function POST(request: NextRequest) {
  try {
    // 解析和验证请求数据
    const body = await request.json()
    const { theme, customPrompt, language } = FortuneRequestSchema.parse(body)

    // 构建提示词
    const systemPrompt = `You are a wise fortune cookie message generator. Create positive, inspiring, and culturally sensitive messages. 
    Rules:
    - Keep messages between 10-25 words
    - Always be positive and uplifting
    - Avoid negative predictions or controversial topics
    - Make it memorable and meaningful
    - End with a period
    - Do not include "Fortune Cookie says:" or similar prefixes`

    const userPrompt = theme === 'custom' && customPrompt 
      ? `${THEME_PROMPTS.custom} User request: ${customPrompt}`
      : THEME_PROMPTS[theme]

    // 调用OpenRouter API
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL,
        'X-Title': 'Fortune Cookie Generator',
      },
      body: JSON.stringify({
        model: 'openai/gpt-3.5-turbo',
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
        max_tokens: 100,
        temperature: 0.8,
        top_p: 0.9,
      }),
    })

    if (!response.ok) {
      throw new Error(`OpenRouter API error: ${response.status}`)
    }

    const data = await response.json()
    const fortune = data.choices[0]?.message?.content?.trim()

    if (!fortune) {
      throw new Error('No fortune generated')
    }

    // 生成幸运数字
    const luckyNumbers = generateLuckyNumbers()

    return NextResponse.json({
      success: true,
      data: {
        quote: fortune,
        numbers: luckyNumbers,
        theme,
        timestamp: new Date().toISOString(),
      }
    })

  } catch (error) {
    console.error('Fortune generation error:', error)
    
    // 返回备用fortune（从现有数据库）
    const fallbackFortune = getFallbackFortune()
    
    return NextResponse.json({
      success: false,
      error: 'Failed to generate custom fortune',
      data: fallbackFortune
    }, { status: 500 })
  }
}

// 生成幸运数字
function generateLuckyNumbers(): number[] {
  const numbers: number[] = []
  while (numbers.length < 6) {
    const num = Math.floor(Math.random() * 99) + 1
    if (!numbers.includes(num)) {
      numbers.push(num)
    }
  }
  return numbers.sort((a, b) => a - b)
}

// 获取备用fortune
function getFallbackFortune() {
  const fallbackFortunes = [
    {
      quote: "Your future is created by what you do today, not tomorrow.",
      numbers: [7, 14, 23, 31, 42, 56],
    },
    {
      quote: "Believe you can and you're halfway there.",
      numbers: [2, 11, 29, 33, 44, 51],
    },
    // 添加更多备用fortune...
  ]
  
  const randomIndex = Math.floor(Math.random() * fallbackFortunes.length)
  return fallbackFortunes[randomIndex]
}
```

### 2. 创建API客户端 (`src/lib/ai-client.ts`)

```typescript
interface FortuneRequest {
  theme: 'funny' | 'inspirational' | 'love' | 'success' | 'wisdom' | 'custom'
  customPrompt?: string
  language?: string
}

interface FortuneResponse {
  success: boolean
  data: {
    quote: string
    numbers: number[]
    theme: string
    timestamp: string
  }
  error?: string
}

export async function generateFortune(request: FortuneRequest): Promise<FortuneResponse> {
  try {
    const response = await fetch('/api/generate-fortune', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    })

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Client error:', error)
    throw new Error('Failed to generate fortune')
  }
}

// 使用示例
export async function generateThemeFortune(theme: FortuneRequest['theme']) {
  return generateFortune({ theme })
}

export async function generateCustomFortune(prompt: string) {
  return generateFortune({ 
    theme: 'custom', 
    customPrompt: prompt 
  })
}
```

## 🎨 前端组件实现

### 1. AI生成器组件 (`src/components/AIFortuneGenerator.tsx`)

```typescript
'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Loader2, Sparkles, Heart, Laugh, Trophy, Brain } from 'lucide-react'
import { generateFortune } from '@/lib/ai-client'

const THEMES = [
  { id: 'funny', label: 'Funny', icon: Laugh, color: 'bg-yellow-500' },
  { id: 'inspirational', label: 'Inspirational', icon: Sparkles, color: 'bg-blue-500' },
  { id: 'love', label: 'Love', icon: Heart, color: 'bg-pink-500' },
  { id: 'success', label: 'Success', icon: Trophy, color: 'bg-green-500' },
  { id: 'wisdom', label: 'Wisdom', icon: Brain, color: 'bg-purple-500' },
] as const

type Theme = typeof THEMES[number]['id']

export function AIFortuneGenerator() {
  const [selectedTheme, setSelectedTheme] = useState<Theme>('inspirational')
  const [customPrompt, setCustomPrompt] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [fortune, setFortune] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const handleGenerate = async () => {
    setIsGenerating(true)
    setError(null)

    try {
      const result = await generateFortune({
        theme: selectedTheme === 'custom' ? 'custom' : selectedTheme,
        customPrompt: selectedTheme === 'custom' ? customPrompt : undefined,
      })

      if (result.success) {
        setFortune(result.data)
      } else {
        setError(result.error || 'Failed to generate fortune')
        setFortune(result.data) // 显示备用fortune
      }
    } catch (err) {
      setError('Network error. Please try again.')
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* 主题选择 */}
      <Card className="p-6">
        <h2 className="text-2xl font-semibold mb-4">Choose Your Fortune Theme</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {THEMES.map((theme) => {
            const Icon = theme.icon
            return (
              <motion.button
                key={theme.id}
                onClick={() => setSelectedTheme(theme.id)}
                className={`p-4 rounded-lg border-2 transition-all ${
                  selectedTheme === theme.id
                    ? 'border-primary bg-primary/10'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Icon className={`w-8 h-8 mx-auto mb-2 ${theme.color} text-white rounded p-1`} />
                <span className="text-sm font-medium">{theme.label}</span>
              </motion.button>
            )
          })}
        </div>
      </Card>

      {/* 自定义输入 */}
      {selectedTheme === 'custom' && (
        <Card className="p-6">
          <Label htmlFor="custom-prompt" className="text-lg font-medium">
            Custom Fortune Request
          </Label>
          <Textarea
            id="custom-prompt"
            placeholder="Describe what kind of fortune you'd like... (e.g., 'about starting a new business', 'for my graduation day')"
            value={customPrompt}
            onChange={(e) => setCustomPrompt(e.target.value)}
            className="mt-2"
            rows={3}
          />
        </Card>
      )}

      {/* 生成按钮 */}
      <div className="text-center">
        <Button
          onClick={handleGenerate}
          disabled={isGenerating || (selectedTheme === 'custom' && !customPrompt.trim())}
          size="lg"
          className="px-8 py-3 text-lg"
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Generating Your Fortune...
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5 mr-2" />
              Generate AI Fortune
            </>
          )}
        </Button>
      </div>

      {/* 错误显示 */}
      {error && (
        <Card className="p-4 border-red-200 bg-red-50">
          <p className="text-red-600 text-center">{error}</p>
        </Card>
      )}

      {/* Fortune显示 */}
      {fortune && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <Card className="p-8 bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200">
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Your AI Fortune</h3>
              <blockquote className="text-xl italic text-gray-700 mb-6">
                "{fortune.quote}"
              </blockquote>
              <div className="flex justify-center items-center space-x-2 text-sm text-gray-600">
                <span>Lucky Numbers:</span>
                {fortune.numbers.map((num: number, index: number) => (
                  <span
                    key={index}
                    className="bg-yellow-200 text-yellow-800 px-2 py-1 rounded-full font-medium"
                  >
                    {num}
                  </span>
                ))}
              </div>
            </motion.div>
          </Card>
        </motion.div>
      )}
    </div>
  )
}
```

## 🔒 安全和最佳实践

### 1. API密钥安全
- 永远不要在客户端代码中暴露API密钥
- 使用环境变量存储敏感信息
- 在生产环境中设置适当的CORS策略

### 2. 错误处理
- 实现优雅的降级机制
- 提供有意义的错误消息
- 记录错误以便调试

### 3. 成本控制
```typescript
// 添加请求限制
const RATE_LIMIT = {
  windowMs: 15 * 60 * 1000, // 15分钟
  max: 10, // 每个IP最多10次请求
}

// 添加缓存机制
const fortuneCache = new Map()
```

## 📊 测试和验证

### 1. API测试
```bash
# 测试API端点
curl -X POST http://localhost:3000/api/generate-fortune \
  -H "Content-Type: application/json" \
  -d '{"theme": "funny"}'
```

### 2. 功能测试清单
- [ ] 所有主题都能正常生成fortune
- [ ] 自定义提示功能正常
- [ ] 错误处理机制有效
- [ ] 备用fortune系统工作
- [ ] 幸运数字生成正确

---

**下一步**: 完成AI集成后，继续进行内容管理和SEO内容创建。
