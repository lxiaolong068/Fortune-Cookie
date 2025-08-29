import React, { useState } from 'react'
import Image from 'next/image'
import { cn } from '@/lib/utils'

const ERROR_IMG_SRC =
  'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODgiIGhlaWdodD0iODgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgc3Ryb2tlPSIjMDAwIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBvcGFjaXR5PSIuMyIgZmlsbD0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIzLjciPjxyZWN0IHg9IjE2IiB5PSIxNiIgd2lkdGg9IjU2IiBoZWlnaHQ9IjU2IiByeD0iNiIvPjxwYXRoIGQ9Im0xNiA1OCAxNi0xOCAzMiAzMiIvPjxjaXJjbGUgY3g9IjUzIiBjeT0iMzUiIHI9IjciLz48L3N2Zz4KCg=='

interface OptimizedImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  className?: string
  style?: React.CSSProperties
  priority?: boolean
  sizes?: string
  quality?: number
  fill?: boolean
  placeholder?: 'blur' | 'empty'
  blurDataURL?: string
}

/**
 * 优化的图片组件，使用 Next.js Image 组件并提供错误回退
 * 替换原有的 ImageWithFallback 组件，提供更好的性能和 SEO
 */
export function ImageWithFallback({
  src,
  alt,
  width = 400,
  height = 300,
  className,
  style,
  priority = false,
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
  quality = 85,
  fill = false,
  placeholder = 'empty',
  blurDataURL,
  ...rest
}: OptimizedImageProps) {
  const [didError, setDidError] = useState(false)

  const handleError = () => {
    setDidError(true)
  }

  if (didError) {
    return (
      <div
        className={cn(
          'inline-flex items-center justify-center bg-gray-100 text-center border border-gray-200 rounded',
          className
        )}
        style={style || { width, height }}
      >
        <div className="flex flex-col items-center justify-center p-4">
          <img
            src={ERROR_IMG_SRC}
            alt="Error loading image"
            className="w-12 h-12 opacity-50 mb-2"
          />
          <span className="text-xs text-gray-500">Image not found</span>
        </div>
      </div>
    )
  }

  if (fill) {
    return (
      <Image
        src={src}
        alt={alt}
        fill
        className={className}
        style={style}
        priority={priority}
        sizes={sizes}
        quality={quality}
        placeholder={placeholder}
        blurDataURL={blurDataURL}
        onError={handleError}
        {...rest}
      />
    )
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      style={style}
      priority={priority}
      sizes={sizes}
      quality={quality}
      placeholder={placeholder}
      blurDataURL={blurDataURL}
      onError={handleError}
      {...rest}
    />
  )
}
