/**
 * BlogCard Component
 *
 * A reusable card component for displaying blog post previews
 * in list views and related posts sections.
 */

import Link from 'next/link'
import Image from 'next/image'
import { Calendar, Clock, User, ArrowRight } from 'lucide-react'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import type { BlogPostMeta } from '@/lib/blog-types'

interface BlogCardProps {
  post: BlogPostMeta
  variant?: 'default' | 'featured' | 'compact'
  className?: string
}

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date)
}

export function BlogCard({ post, variant = 'default', className }: BlogCardProps) {
  const isFeatured = variant === 'featured'
  const isCompact = variant === 'compact'

  return (
    <Link href={`/blog/${post.slug}`} className="block group">
      <Card
        className={cn(
          'overflow-hidden transition-all duration-300 hover:shadow-lg',
          'bg-white/90 backdrop-blur-sm border-amber-200/50',
          'hover:border-amber-300 hover:scale-[1.02]',
          isFeatured && 'md:flex md:flex-row',
          className
        )}
      >
        {/* Image Section */}
        {post.image && post.image.length > 0 && !isCompact && (
          <div
            className={cn(
              'relative overflow-hidden bg-gradient-to-br from-amber-100 to-orange-100',
              isFeatured ? 'md:w-2/5 h-48 md:h-auto' : 'h-48'
            )}
          >
            <Image
              src={post.image}
              alt={post.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes={isFeatured ? '(max-width: 768px) 100vw, 40vw' : '(max-width: 768px) 100vw, 33vw'}
            />
            {post.featured && (
              <Badge className="absolute top-3 left-3 bg-amber-500 text-white">
                Featured
              </Badge>
            )}
          </div>
        )}

        {/* Fallback gradient if no image */}
        {(!post.image || post.image.length === 0) && !isCompact && (
          <div
            className={cn(
              'relative overflow-hidden bg-gradient-to-br from-amber-200 via-yellow-100 to-orange-200',
              isFeatured ? 'md:w-2/5 h-48 md:h-auto' : 'h-48',
              'flex items-center justify-center'
            )}
          >
            <span className="text-6xl">🥠</span>
            {post.featured && (
              <Badge className="absolute top-3 left-3 bg-amber-500 text-white">
                Featured
              </Badge>
            )}
          </div>
        )}

        {/* Content Section */}
        <div className={cn(isFeatured && 'md:w-3/5')}>
          <CardHeader className={cn(isCompact && 'pb-2')}>
            {/* Tags */}
            {post.tags.length > 0 && !isCompact && (
              <div className="flex flex-wrap gap-2 mb-2">
                {post.tags.slice(0, 3).map((tag) => (
                  <Badge
                    key={tag}
                    variant="outline"
                    className="text-xs bg-amber-50 border-amber-200 text-amber-700"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            )}

            {/* Title */}
            <h3
              className={cn(
                'font-semibold text-gray-800 group-hover:text-amber-600 transition-colors line-clamp-2',
                isFeatured ? 'text-xl md:text-2xl' : 'text-lg',
                isCompact && 'text-base'
              )}
            >
              {post.title}
            </h3>
          </CardHeader>

          <CardContent className={cn(isCompact && 'pt-0 pb-2')}>
            {/* Description */}
            <p
              className={cn(
                'text-gray-600 line-clamp-2',
                isFeatured ? 'text-base' : 'text-sm',
                isCompact && 'text-xs line-clamp-1'
              )}
            >
              {post.description}
            </p>
          </CardContent>

          <CardFooter
            className={cn(
              'flex items-center justify-between text-sm text-gray-500',
              isCompact && 'pt-0'
            )}
          >
            {/* Meta Info */}
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {formatDate(post.date)}
              </span>
              {!isCompact && (
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {post.readingTime} min read
                </span>
              )}
            </div>

            {/* Read More Arrow */}
            <ArrowRight className="w-4 h-4 text-amber-500 opacity-0 group-hover:opacity-100 transition-opacity transform group-hover:translate-x-1" />
          </CardFooter>
        </div>
      </Card>
    </Link>
  )
}

export default BlogCard

