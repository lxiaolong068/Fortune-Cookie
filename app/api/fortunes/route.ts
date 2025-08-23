import { NextRequest, NextResponse } from 'next/server'
import { 
  fortuneDatabase, 
  searchFortunes, 
  getFortunesByCategory, 
  getPopularFortunes,
  getRandomFortune,
  getFortuneById,
  getDatabaseStats
} from '@/lib/fortune-database'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const action = searchParams.get('action') || 'list'
    
    switch (action) {
      case 'search': {
        const query = searchParams.get('q') || ''
        const category = searchParams.get('category') || undefined
        const limit = parseInt(searchParams.get('limit') || '50')
        
        const results = searchFortunes(query, category).slice(0, limit)
        
        return NextResponse.json({
          results,
          total: results.length,
          query,
          category
        })
      }
      
      case 'category': {
        const category = searchParams.get('category')
        if (!category) {
          return NextResponse.json(
            { error: 'Category parameter is required' },
            { status: 400 }
          )
        }
        
        const results = getFortunesByCategory(category)
        return NextResponse.json({
          results,
          total: results.length,
          category
        })
      }
      
      case 'popular': {
        const limit = parseInt(searchParams.get('limit') || '10')
        const results = getPopularFortunes(limit)
        
        return NextResponse.json({
          results,
          total: results.length
        })
      }
      
      case 'random': {
        const category = searchParams.get('category') || undefined
        const count = parseInt(searchParams.get('count') || '1')
        
        const results = Array.from({ length: count }, () => 
          getRandomFortune(category)
        )
        
        return NextResponse.json({
          results: count === 1 ? results[0] : results,
          total: count
        })
      }
      
      case 'stats': {
        const stats = getDatabaseStats()
        return NextResponse.json(stats)
      }
      
      case 'get': {
        const id = searchParams.get('id')
        if (!id) {
          return NextResponse.json(
            { error: 'ID parameter is required' },
            { status: 400 }
          )
        }
        
        const fortune = getFortuneById(id)
        if (!fortune) {
          return NextResponse.json(
            { error: 'Fortune not found' },
            { status: 404 }
          )
        }
        
        return NextResponse.json(fortune)
      }
      
      case 'list':
      default: {
        const page = parseInt(searchParams.get('page') || '1')
        const limit = parseInt(searchParams.get('limit') || '20')
        const category = searchParams.get('category') || undefined
        const sortBy = searchParams.get('sort') || 'popularity'
        
        let results = category 
          ? getFortunesByCategory(category)
          : [...fortuneDatabase]
        
        // Sort results
        switch (sortBy) {
          case 'popularity':
            results.sort((a, b) => b.popularity - a.popularity)
            break
          case 'recent':
            results.sort((a, b) => new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime())
            break
          case 'alphabetical':
            results.sort((a, b) => a.message.localeCompare(b.message))
            break
        }
        
        // Pagination
        const startIndex = (page - 1) * limit
        const endIndex = startIndex + limit
        const paginatedResults = results.slice(startIndex, endIndex)
        
        return NextResponse.json({
          results: paginatedResults,
          pagination: {
            page,
            limit,
            total: results.length,
            totalPages: Math.ceil(results.length / limit),
            hasNext: endIndex < results.length,
            hasPrev: page > 1
          },
          category,
          sortBy
        })
      }
    }
    
  } catch (error) {
    console.error('Fortune API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Handle CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}
