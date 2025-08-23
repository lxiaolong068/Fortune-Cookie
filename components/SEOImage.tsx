import Image from 'next/image'
import { cn } from '@/lib/utils'

interface SEOImageProps {
  src: string
  alt: string
  width: number
  height: number
  className?: string
  priority?: boolean
  sizes?: string
  quality?: number
  placeholder?: 'blur' | 'empty'
  blurDataURL?: string
  title?: string
  loading?: 'lazy' | 'eager'
}

export function SEOImage({
  src,
  alt,
  width,
  height,
  className,
  priority = false,
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
  quality = 85,
  placeholder = 'empty',
  blurDataURL,
  title,
  loading = 'lazy',
  ...props
}: SEOImageProps) {
  // Generate structured data for the image
  const imageStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'ImageObject',
    url: src,
    width: width,
    height: height,
    caption: alt,
    ...(title && { name: title }),
  }

  return (
    <div className="relative">
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={cn('rounded-lg shadow-md', className)}
        priority={priority}
        sizes={sizes}
        quality={quality}
        placeholder={placeholder}
        blurDataURL={blurDataURL}
        loading={loading}
        title={title}
        {...props}
      />
      
      {/* Add structured data for the image */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(imageStructuredData)
        }}
      />
    </div>
  )
}

// Optimized fortune cookie image component
export function FortuneCookieImage({
  className,
  priority = false,
  ...props
}: Omit<SEOImageProps, 'src' | 'alt' | 'width' | 'height'>) {
  return (
    <SEOImage
      src="/images/fortune-cookie-hero.svg"
      alt="Golden fortune cookie with inspirational message and lucky numbers"
      width={800}
      height={600}
      className={className}
      priority={priority}
      title="AI-Generated Fortune Cookie"
      sizes="(max-width: 768px) 100vw, 800px"
      {...props}
    />
  )
}

// Gallery component for multiple fortune cookie images
export function FortuneCookieGallery({
  images,
  className
}: {
  images: Array<{
    src: string
    alt: string
    title?: string
  }>
  className?: string
}) {
  const galleryStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'ImageGallery',
    name: 'Fortune Cookie Gallery',
    description: 'Collection of fortune cookie images and designs',
    image: images.map(img => ({
      '@type': 'ImageObject',
      url: img.src,
      caption: img.alt,
      ...(img.title && { name: img.title })
    }))
  }

  return (
    <div className={cn('grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4', className)}>
      {images.map((image, index) => (
        <SEOImage
          key={index}
          src={image.src}
          alt={image.alt}
          width={300}
          height={300}
          className="aspect-square object-cover"
          title={image.title}
          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
        />
      ))}
      
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(galleryStructuredData)
        }}
      />
    </div>
  )
}

// Hero image component with optimized loading
export function HeroImage({
  title,
  subtitle,
  className
}: {
  title: string
  subtitle?: string
  className?: string
}) {
  return (
    <div className={cn('relative overflow-hidden rounded-xl', className)}>
      <SEOImage
        src="/images/fortune-cookie-banner.svg"
        alt={`${title} - Fortune Cookie AI Generator`}
        width={1200}
        height={600}
        priority={true}
        className="w-full h-full object-cover"
        title={title}
        sizes="100vw"
        quality={90}
      />
      
      {/* Overlay content */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent flex items-center justify-center">
        <div className="text-center text-white p-6">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">{title}</h1>
          {subtitle && (
            <p className="text-lg md:text-xl opacity-90">{subtitle}</p>
          )}
        </div>
      </div>
    </div>
  )
}

// Placeholder image generator for development
export function generatePlaceholderImage(
  width: number,
  height: number,
  text?: string,
  bgColor: string = 'f59e0b',
  textColor: string = 'ffffff'
): string {
  const displayText = text || `${width}x${height}`
  return `https://via.placeholder.com/${width}x${height}/${bgColor}/${textColor}?text=${encodeURIComponent(displayText)}`
}

// Image optimization utilities
export const imageOptimization = {
  // Generate responsive image sizes
  generateSizes: (breakpoints: { [key: string]: string }) => {
    return Object.entries(breakpoints)
      .map(([breakpoint, size]) => `(max-width: ${breakpoint}) ${size}`)
      .join(', ')
  },

  // Generate blur data URL for placeholder
  generateBlurDataURL: (width: number = 10, height: number = 10) => {
    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height
    const ctx = canvas.getContext('2d')
    
    if (ctx) {
      // Create a simple gradient blur effect
      const gradient = ctx.createLinearGradient(0, 0, width, height)
      gradient.addColorStop(0, '#f59e0b')
      gradient.addColorStop(1, '#f97316')
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, width, height)
    }
    
    return canvas.toDataURL()
  },

  // Calculate aspect ratio
  calculateAspectRatio: (width: number, height: number) => {
    const gcd = (a: number, b: number): number => b === 0 ? a : gcd(b, a % b)
    const divisor = gcd(width, height)
    return {
      width: width / divisor,
      height: height / divisor,
      ratio: width / height
    }
  }
}
