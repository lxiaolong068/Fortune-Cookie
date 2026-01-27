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
import { getImageUrl } from '@/lib/site'

/**
 * Custom Link Component for internal/external links
 * 增强链接对比度和可识别性
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
        className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 underline underline-offset-4 decoration-blue-300 hover:decoration-blue-500 dark:decoration-blue-600 dark:hover:decoration-blue-400 transition-colors font-medium"
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
      className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 underline underline-offset-4 decoration-blue-300 hover:decoration-blue-500 dark:decoration-blue-600 dark:hover:decoration-blue-400 transition-colors font-medium"
      {...props}
    >
      {children}
    </a>
  )
}

/**
 * Custom Image Component with Next.js optimization
 * 增强图注可读性
 */
function CustomImage({
  src,
  alt,
  width,
  height,
  loading,
  ...props
}: React.ImgHTMLAttributes<HTMLImageElement> & {
  width?: number | string
  height?: number | string
}) {
  if (!src) return null
  const resolvedSrc = src.startsWith('/') ? getImageUrl(src) : src

  // Use Next.js Image for optimized images
  if (src.startsWith('/') || src.startsWith('http')) {
    const imageWidth = Number(width) || 800
    const imageHeight = Number(height) || 450
    return (
      <figure className="my-10">
        <div className="relative w-full overflow-hidden rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
          <Image
            src={resolvedSrc}
            alt={alt || 'Blog image'}
            width={imageWidth}
            height={imageHeight}
            className="w-full h-auto object-cover transition-transform duration-500 hover:scale-[1.02]"
            sizes="(max-width: 768px) 100vw, 800px"
            loading={loading}
          />
        </div>
        {alt && (
          <figcaption className="mt-3 text-center text-[15px] leading-relaxed text-slate-600 dark:text-slate-400 italic px-4">
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
      src={resolvedSrc}
      alt={alt || 'Blog image'}
      className="w-full h-auto rounded-lg my-8"
      loading={loading || 'lazy'}
      decoding="async"
      width={typeof width === 'number' ? width : undefined}
      height={typeof height === 'number' ? height : undefined}
      {...props}
    />
  )
}

/**
 * Callout/Note Component for highlighting important information
 * 优化文字对比度
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
    info: 'bg-blue-50 border-blue-200 text-blue-900 dark:bg-blue-950/30 dark:border-blue-800 dark:text-blue-100',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-900 dark:bg-yellow-950/30 dark:border-yellow-800 dark:text-yellow-100',
    tip: 'bg-green-50 border-green-200 text-green-900 dark:bg-green-950/30 dark:border-green-800 dark:text-green-100',
    note: 'bg-indigo-50 border-indigo-200 text-indigo-900 dark:bg-indigo-950/30 dark:border-indigo-800 dark:text-indigo-100',
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
          <p className="font-semibold mb-2 text-[15px]">
            {icons[type]} {title}
          </p>
        )}
        <div className="text-[15px] leading-relaxed">{children}</div>
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
 * 提升内联代码对比度
 */
function InlineCode({
  children,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  return (
    <code
      className="bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-slate-100 px-2 py-0.5 rounded text-[15px] font-mono border border-slate-200 dark:border-slate-700"
      {...props}
    >
      {children}
    </code>
  )
}

/**
 * Blockquote styling
 * 增强引用块可读性
 */
function Blockquote({
  children,
  ...props
}: React.BlockquoteHTMLAttributes<HTMLQuoteElement>) {
  return (
    <blockquote
      className="border-l-4 border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/20 dark:border-indigo-400 pl-6 py-4 my-8 italic text-slate-700 dark:text-slate-300 rounded-r-lg text-[17px] leading-relaxed"
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
