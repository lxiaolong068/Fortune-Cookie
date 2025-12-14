/**
 * MDX Components
 *
 * Custom component mapping for MDX content rendering.
 * Allows embedding React components directly in blog posts.
 */

import Link from 'next/link'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

/**
 * Custom Link Component for internal/external links
 */
function CustomLink({
  href,
  children,
  ...props
}: React.AnchorHTMLAttributes<HTMLAnchorElement>) {
  const isInternal = href?.startsWith('/') || href?.startsWith('#')

  if (isInternal) {
    return (
      <Link
        href={href || '#'}
        className="text-amber-600 hover:text-amber-700 underline underline-offset-4 transition-colors"
        {...props}
      >
        {children}
      </Link>
    )
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-amber-600 hover:text-amber-700 underline underline-offset-4 transition-colors font-medium decoration-amber-300 hover:decoration-amber-500"
      {...props}
    >
      {children}
    </a>
  )
}

/**
 * Custom Image Component with Next.js optimization
 */
function CustomImage({
  src,
  alt,
  width,
  height,
  ...props
}: React.ImgHTMLAttributes<HTMLImageElement> & {
  width?: number | string
  height?: number | string
}) {
  if (!src) return null

  // Use Next.js Image for optimized images
  if (src.startsWith('/') || src.startsWith('http')) {
    return (
      <figure className="my-10">
        <div className="relative w-full overflow-hidden rounded-xl shadow-lg border border-gray-100 dark:border-gray-800">
          <Image
            src={src}
            alt={alt || 'Blog image'}
            width={Number(width) || 800}
            height={Number(height) || 450}
            className="w-full h-auto object-cover transition-transform duration-500 hover:scale-[1.02]"
          />
        </div>
        {alt && (
          <figcaption className="mt-3 text-center text-sm text-gray-500 dark:text-gray-400 italic">
            {alt}
          </figcaption>
        )}
      </figure>
    )
  }

  // Fallback for other image sources
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt || 'Blog image'}
      className="w-full h-auto rounded-lg my-8"
      {...props}
    />
  )
}

/**
 * Callout/Note Component for highlighting important information
 */
function Callout({
  children,
  type = 'info',
  title,
}: {
  children: React.ReactNode
  type?: 'info' | 'warning' | 'tip' | 'note'
  title?: string
}) {
  const styles = {
    info: 'bg-blue-50 border-blue-200 text-blue-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    tip: 'bg-green-50 border-green-200 text-green-800',
    note: 'bg-amber-50 border-amber-200 text-amber-800',
  }

  const icons = {
    info: 'ℹ️',
    warning: '⚠️',
    tip: '💡',
    note: '📝',
  }

  return (
    <Card className={cn('my-6 border-l-4', styles[type])}>
      <CardContent className="py-4">
        {title && (
          <p className="font-semibold mb-2">
            {icons[type]} {title}
          </p>
        )}
        <div className="text-sm">{children}</div>
      </CardContent>
    </Card>
  )
}

/**
 * Code Block with syntax highlighting placeholder
 * Note: For full syntax highlighting, integrate with rehype-prism or similar
 */
function CodeBlock({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLPreElement>) {
  return (
    <div className="relative group">
      <div className="absolute -inset-2 bg-gradient-to-r from-amber-100 to-orange-100 dark:from-amber-900/20 dark:to-orange-900/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity -z-10 blur-sm" />
      <pre
        className={cn(
          'bg-gray-900 text-gray-100 rounded-xl p-6 overflow-x-auto my-8 shadow-xl border border-gray-800',
          'text-sm font-mono leading-relaxed',
          className
        )}
        {...props}
      >
        {children}
      </pre>
    </div>
  )
}

/**
 * Inline Code
 */
function InlineCode({
  children,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  return (
    <code
      className="bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded text-sm font-mono"
      {...props}
    >
      {children}
    </code>
  )
}

/**
 * Blockquote styling
 */
function Blockquote({
  children,
  ...props
}: React.BlockquoteHTMLAttributes<HTMLQuoteElement>) {
  return (
    <blockquote
      className="border-l-4 border-amber-500 bg-amber-50/50 dark:bg-amber-900/10 pl-6 py-4 my-8 italic text-gray-700 dark:text-gray-300 rounded-r-lg"
      {...props}
    >
      {children}
    </blockquote>
  )
}

/**
 * MDX Components Export
 * Map HTML elements to custom React components
 */
export const mdxComponents = {
  // Typography overrides handled by Tailwind prose
  a: CustomLink,
  img: CustomImage,
  pre: CodeBlock,
  code: InlineCode,
  blockquote: Blockquote,
  // Custom components available in MDX
  Callout,
  Card,
  Badge,
  Image: CustomImage,
}

export default mdxComponents
