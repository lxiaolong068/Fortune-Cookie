import { NextRequest, NextResponse } from 'next/server'
import { openRouterClient, FortuneRequest } from '@/lib/openrouter'

// Rate limiting (simple in-memory store for demo)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>()

function getRateLimitKey(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for')
  const ip = forwarded ? forwarded.split(',')[0] : request.ip || 'unknown'
  return ip
}

function checkRateLimit(key: string): { allowed: boolean; resetTime?: number } {
  const now = Date.now()
  const windowMs = 15 * 60 * 1000 // 15 minutes
  const maxRequests = 50 // 50 requests per 15 minutes
  
  const record = rateLimitMap.get(key)
  
  if (!record || now > record.resetTime) {
    rateLimitMap.set(key, { count: 1, resetTime: now + windowMs })
    return { allowed: true }
  }
  
  if (record.count >= maxRequests) {
    return { allowed: false, resetTime: record.resetTime }
  }
  
  record.count++
  return { allowed: true }
}

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const rateLimitKey = getRateLimitKey(request)
    const rateLimit = checkRateLimit(rateLimitKey)
    
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { 
          error: 'Rate limit exceeded. Please try again later.',
          resetTime: rateLimit.resetTime 
        },
        { status: 429 }
      )
    }

    // Parse request body
    const body = await request.json()
    const fortuneRequest: FortuneRequest = {
      theme: body.theme || 'random',
      mood: body.mood || 'positive',
      length: body.length || 'medium',
      customPrompt: body.customPrompt
    }

    // Validate theme
    const validThemes = ['funny', 'inspirational', 'love', 'success', 'wisdom', 'random']
    if (fortuneRequest.theme && !validThemes.includes(fortuneRequest.theme)) {
      return NextResponse.json(
        { error: 'Invalid theme. Must be one of: ' + validThemes.join(', ') },
        { status: 400 }
      )
    }

    // Generate fortune
    const fortune = await openRouterClient.generateFortune(fortuneRequest)
    
    // Add CORS headers
    const response = NextResponse.json(fortune)
    response.headers.set('Access-Control-Allow-Origin', '*')
    response.headers.set('Access-Control-Allow-Methods', 'POST, OPTIONS')
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type')
    
    return response
    
  } catch (error) {
    console.error('Fortune generation error:', error)
    return NextResponse.json(
      { error: 'Failed to generate fortune. Please try again.' },
      { status: 500 }
    )
  }
}

export async function GET() {
  // Health check endpoint
  try {
    const isHealthy = await openRouterClient.healthCheck()
    return NextResponse.json({ 
      status: 'ok', 
      aiEnabled: isHealthy,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    return NextResponse.json(
      { status: 'error', message: 'Service unavailable' },
      { status: 503 }
    )
  }
}

export async function OPTIONS() {
  // Handle CORS preflight
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}
