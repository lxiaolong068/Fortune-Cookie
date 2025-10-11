/**
 * Optimized Image Component
 * 
 * Wrapper around Next.js Image component with additional optimizations:
 * - Automatic WebP/AVIF format conversion
 * - Lazy loading by default
 * - Responsive image sizing
 * - Blur placeholder support
 * - Priority loading for above-the-fold images
 * - Automatic width/height calculation
 */

import Image, { ImageProps } from 'next/image'
import { useState } from 'react'
import { cn } from '@/lib/utils'

interface OptimizedImageProps extends Omit<ImageProps, 'src'> {
  src: string
  alt: string
  width?: number
  height?: number
  priority?: boolean
  quality?: number
  className?: string
  objectFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down'
  loading?: 'lazy' | 'eager'
  placeholder?: 'blur' | 'empty'
  blurDataURL?: string
  sizes?: string
  fill?: boolean
  onLoadingComplete?: () => void
}

/**
 * OptimizedImage Component
 * 
 * Provides automatic image optimization with Next.js Image component
 * 
 * Features:
 * - Automatic format conversion (WebP/AVIF)
 * - Lazy loading by default
 * - Responsive sizing
 * - Blur placeholder
 * - Loading state handling
 * - Error state handling
 * 
 * @example
 * ```tsx
 * <OptimizedImage
 *   src="/images/hero.png"
 *   alt="Hero image"
 *   width={800}
 *   height={600}
 *   priority
 * />
 * ```
 */
export function OptimizedImage({
  src,
  alt,
  width,
  height,
  priority = false,
  quality = 85,
  className,
  objectFit = 'cover',
  loading = 'lazy',
  placeholder = 'empty',
  blurDataURL,
  sizes,
  fill = false,
  onLoadingComplete,
  ...props
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  // Handle image load completion
  const handleLoadingComplete = () => {
    setIsLoading(false)
    if (onLoadingComplete) {
      onLoadingComplete()
    }
  }

  // Handle image load error
  const handleError = () => {
    setIsLoading(false)
    setHasError(true)
  }

  // Error fallback
  if (hasError) {
    return (
      <div
        className={cn(
          'flex items-center justify-center bg-gray-100 text-gray-400',
          className
        )}
        style={{ width, height }}
      >
        <svg
          className="w-12 h-12"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      </div>
    )
  }

  // Determine if we should use fill mode
  const useFill = fill || (!width && !height)

  // Common image props
  const imageProps: Partial<ImageProps> = {
    alt,
    quality,
    priority,
    loading: priority ? 'eager' : loading,
    placeholder,
    onLoad: handleLoadingComplete,
    onError: handleError,
    className: cn(
      'transition-opacity duration-300',
      isLoading ? 'opacity-0' : 'opacity-100',
      className
    ),
    ...props,
  }

  // Add blur placeholder if provided
  if (placeholder === 'blur' && blurDataURL) {
    imageProps.blurDataURL = blurDataURL
  }

  // Add sizes for responsive images
  if (sizes) {
    imageProps.sizes = sizes
  } else if (!useFill) {
    // Default responsive sizes
    imageProps.sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
  }

  // Render with fill mode
  if (useFill) {
    return (
      <div className={cn('relative', className)} style={{ width, height }}>
        <Image
          src={src}
          fill
          style={{ objectFit }}
          {...imageProps}
        />
      </div>
    )
  }

  // Render with explicit dimensions
  return (
    <Image
      src={src}
      width={width}
      height={height}
      style={{ objectFit }}
      {...imageProps}
    />
  )
}

/**
 * Responsive Image Component
 * 
 * Automatically adjusts image size based on viewport
 * 
 * @example
 * ```tsx
 * <ResponsiveImage
 *   src="/images/hero.png"
 *   alt="Hero image"
 *   aspectRatio="16/9"
 * />
 * ```
 */
export function ResponsiveImage({
  src,
  alt,
  aspectRatio = '16/9',
  className,
  priority = false,
  ...props
}: {
  src: string
  alt: string
  aspectRatio?: string
  className?: string
  priority?: boolean
} & Partial<OptimizedImageProps>) {
  return (
    <div
      className={cn('relative w-full', className)}
      style={{ aspectRatio }}
    >
      <OptimizedImage
        src={src}
        alt={alt}
        fill
        priority={priority}
        {...props}
      />
    </div>
  )
}

/**
 * Avatar Image Component
 * 
 * Optimized for profile pictures and avatars
 * 
 * @example
 * ```tsx
 * <AvatarImage
 *   src="/images/avatar.png"
 *   alt="User avatar"
 *   size={64}
 * />
 * ```
 */
export function AvatarImage({
  src,
  alt,
  size = 48,
  className,
  ...props
}: {
  src: string
  alt: string
  size?: number
  className?: string
} & Partial<OptimizedImageProps>) {
  return (
    <div
      className={cn('relative rounded-full overflow-hidden', className)}
      style={{ width: size, height: size }}
    >
      <OptimizedImage
        src={src}
        alt={alt}
        width={size}
        height={size}
        objectFit="cover"
        {...props}
      />
    </div>
  )
}

/**
 * Hero Image Component
 * 
 * Optimized for large hero/banner images
 * Always uses priority loading
 * 
 * @example
 * ```tsx
 * <HeroImage
 *   src="/images/hero.png"
 *   alt="Hero banner"
 * />
 * ```
 */
export function HeroImage({
  src,
  alt,
  className,
  ...props
}: {
  src: string
  alt: string
  className?: string
} & Partial<OptimizedImageProps>) {
  return (
    <ResponsiveImage
      src={src}
      alt={alt}
      aspectRatio="21/9"
      priority
      quality={90}
      className={className}
      {...props}
    />
  )
}

/**
 * Thumbnail Image Component
 * 
 * Optimized for small thumbnail images
 * 
 * @example
 * ```tsx
 * <ThumbnailImage
 *   src="/images/thumb.png"
 *   alt="Thumbnail"
 *   size={120}
 * />
 * ```
 */
export function ThumbnailImage({
  src,
  alt,
  size = 120,
  className,
  ...props
}: {
  src: string
  alt: string
  size?: number
  className?: string
} & Partial<OptimizedImageProps>) {
  return (
    <div
      className={cn('relative overflow-hidden rounded-lg', className)}
      style={{ width: size, height: size }}
    >
      <OptimizedImage
        src={src}
        alt={alt}
        width={size}
        height={size}
        objectFit="cover"
        quality={75}
        {...props}
      />
    </div>
  )
}

export default OptimizedImage

