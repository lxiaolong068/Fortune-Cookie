"use client"

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { DynamicBackgroundEffects } from '@/components/DynamicBackgroundEffects'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Sparkles, Search, Filter, Heart, Smile, TrendingUp, Brain, Users, Plane, Activity } from 'lucide-react'
import { fortuneDatabase, searchFortunes, getDatabaseStats, FortuneMessage } from '@/lib/fortune-database'

const categoryIcons = {
  inspirational: Sparkles,
  funny: Smile,
  love: Heart,
  success: TrendingUp,
  wisdom: Brain,
  friendship: Users,
  health: Activity,
  travel: Plane
}

const categoryColors = {
  inspirational: 'bg-blue-100 text-blue-800',
  funny: 'bg-yellow-100 text-yellow-800',
  love: 'bg-pink-100 text-pink-800',
  success: 'bg-green-100 text-green-800',
  wisdom: 'bg-purple-100 text-purple-800',
  friendship: 'bg-orange-100 text-orange-800',
  health: 'bg-red-100 text-red-800',
  travel: 'bg-indigo-100 text-indigo-800'
}

export default function BrowsePage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [sortBy, setSortBy] = useState<'popularity' | 'recent' | 'alphabetical'>('popularity')

  const stats = getDatabaseStats()

  const filteredAndSortedFortunes = useMemo(() => {
    let results = searchFortunes(
      searchQuery,
      selectedCategory === 'all' ? undefined : selectedCategory
    )

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

    return results
  }, [searchQuery, selectedCategory, sortBy])

  return (
    <>
      <main className="min-h-screen w-full overflow-x-hidden relative">
        <DynamicBackgroundEffects />
        <div className="relative z-10">
          <div className="container mx-auto px-4 py-8">
            {/* 页面标题 */}
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-amber-600 via-yellow-600 to-orange-600 bg-clip-text text-transparent mb-4">
                Browse Fortune Messages
              </h1>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-6">
                Explore our collection of {stats.total}+ fortune cookie messages across {Object.keys(stats.categories).length} categories.
                Find the perfect message for any occasion!
              </p>

              {/* 统计信息 */}
              <div className="flex flex-wrap justify-center gap-4 mb-8">
                <Badge className="bg-blue-100 text-blue-800">
                  {stats.total} Total Messages
                </Badge>
                <Badge className="bg-green-100 text-green-800">
                  {Object.keys(stats.categories).length} Categories
                </Badge>
                <Badge className="bg-purple-100 text-purple-800">
                  {stats.tags} Unique Tags
                </Badge>
              </div>

              {/* SEO Category Links */}
              <div className="flex flex-wrap justify-center gap-2 mb-8 max-w-3xl mx-auto">
                {Object.keys(stats.categories).map((category) => (
                  <Link key={category} href={`/browse/category/${category}`}>
                    <Badge variant="outline" className="hover:bg-amber-50 cursor-pointer transition-colors py-1 px-3">
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </Badge>
                  </Link>
                ))}
              </div>
            </div>

            {/* 搜索和筛选 */}
            <Card className="p-6 bg-white/90 backdrop-blur-sm border-amber-200 mb-8">
              <div className="grid md:grid-cols-3 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search messages or tags..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>

                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {Object.entries(stats.categories).map(([category, count]) => {
                      const Icon = categoryIcons[category as keyof typeof categoryIcons]
                      return (
                        <SelectItem key={category} value={category}>
                          <div className="flex items-center gap-2">
                            {Icon && <Icon className="w-4 h-4" />}
                            <span className="capitalize">{category}</span>
                            <span className="text-gray-500">({count})</span>
                          </div>
                        </SelectItem>
                      )
                    })}
                  </SelectContent>
                </Select>

                <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="popularity">Most Popular</SelectItem>
                    <SelectItem value="recent">Most Recent</SelectItem>
                    <SelectItem value="alphabetical">A-Z</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </Card>

            {/* 结果 */}
            <div className="mb-6">
              <p className="text-gray-600">
                Showing {filteredAndSortedFortunes.length} results
                {searchQuery && ` for "${searchQuery}"`}
                {selectedCategory !== 'all' && ` in ${selectedCategory}`}
              </p>
            </div>

            {/* Fortune 列表 */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAndSortedFortunes.map((fortune) => {
                const Icon = categoryIcons[fortune.category as keyof typeof categoryIcons]
                const colorClass = categoryColors[fortune.category as keyof typeof categoryColors]

                return (
                  <Card key={fortune.id} className="p-6 bg-white/90 backdrop-blur-sm border-amber-200 hover:shadow-lg transition-all duration-200 hover:scale-105">
                    <div className="flex items-start justify-between mb-3">
                      <Link href={`/browse/category/${fortune.category}`} className="hover:opacity-80 transition-opacity">
                        <Badge className={colorClass}>
                          {Icon && <Icon className="w-3 h-3 mr-1" />}
                          {fortune.category}
                        </Badge>
                      </Link>
                      <div className="flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-amber-500" />
                        <span className="text-xs text-gray-500">{fortune.popularity}/10</span>
                      </div>
                    </div>

                    <blockquote className="text-gray-700 italic leading-relaxed mb-4">
                      "{fortune.message}"
                    </blockquote>

                    <div className="space-y-3">
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Lucky Numbers:</p>
                        <div className="flex gap-1">
                          {fortune.luckyNumbers.map((number) => (
                            <span
                              key={number}
                              className="w-6 h-6 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center text-white text-xs font-medium"
                            >
                              {number}
                            </span>
                          ))}
                        </div>
                      </div>

                      {fortune.tags.length > 0 && (
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Tags:</p>
                          <div className="flex flex-wrap gap-1">
                            {fortune.tags.slice(0, 3).map((tag) => (
                              <Badge key={tag} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                            {fortune.tags.length > 3 && (
                              <Badge variant="outline" className="text-xs">
                                +{fortune.tags.length - 3}
                              </Badge>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </Card>
                )
              })}
            </div>

            {filteredAndSortedFortunes.length === 0 && (
              <div className="text-center py-12">
                <Sparkles className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-600 mb-2">No fortunes found</h3>
                <p className="text-gray-500">Try adjusting your search or filter criteria.</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  )
}
