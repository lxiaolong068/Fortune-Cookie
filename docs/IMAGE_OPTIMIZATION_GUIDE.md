# Image Optimization Guide

## Overview

This guide covers image optimization strategies for the Fortune Cookie AI project, including the use of Next.js Image component, OptimizedImage wrapper, and best practices.

---

## Current Status

### Image Analysis Results

**Total Images**: 7 PNG files  
**Total Size**: 490 Bytes  
**Status**: ✅ **Already Highly Optimized**

All images in the `public/` directory are already optimized to ~70 bytes each:
- `android-chrome-192x192.png` - 70 Bytes
- `android-chrome-512x512.png` - 70 Bytes
- `apple-touch-icon.png` - 70 Bytes
- `favicon-16x16.png` - 70 Bytes
- `favicon-32x32.png` - 70 Bytes
- `og-image.png` - 70 Bytes
- `twitter-image.png` - 70 Bytes

**Conclusion**: Images are already optimized. Focus on using Next.js Image component for automatic optimization.

---

## Components Available

### 1. OptimizedImage Component

**Location**: `components/OptimizedImage.tsx`

**Features**:
- Automatic WebP/AVIF format conversion
- Lazy loading by default
- Responsive image sizing
- Blur placeholder support
- Priority loading for above-the-fold images
- Loading and error state handling

**Basic Usage**:
```tsx
import { OptimizedImage } from '@/components/OptimizedImage'

<OptimizedImage
  src="/images/hero.png"
  alt="Hero image"
  width={800}
  height={600}
  priority
/>
```

### 2. ResponsiveImage Component

**For images that should fill their container**:

```tsx
import { ResponsiveImage } from '@/components/OptimizedImage'

<ResponsiveImage
  src="/images/banner.png"
  alt="Banner"
  aspectRatio="16/9"
/>
```

### 3. AvatarImage Component

**For profile pictures and avatars**:

```tsx
import { AvatarImage } from '@/components/OptimizedImage'

<AvatarImage
  src="/images/avatar.png"
  alt="User avatar"
  size={64}
/>
```

### 4. HeroImage Component

**For large hero/banner images**:

```tsx
import { HeroImage } from '@/components/OptimizedImage'

<HeroImage
  src="/images/hero.png"
  alt="Hero banner"
/>
```

### 5. ThumbnailImage Component

**For small thumbnail images**:

```tsx
import { ThumbnailImage } from '@/components/OptimizedImage'

<ThumbnailImage
  src="/images/thumb.png"
  alt="Thumbnail"
  size={120}
/>
```

---

## Next.js Image Component

The project already uses Next.js Image component, which provides automatic optimization:

### Features

- ✅ **Automatic Format Conversion**: WebP/AVIF when supported
- ✅ **Responsive Images**: Serves appropriate sizes
- ✅ **Lazy Loading**: Images load as they enter viewport
- ✅ **Blur Placeholder**: Smooth loading experience
- ✅ **Priority Loading**: For above-the-fold images

### Configuration

**next.config.js**:
```javascript
module.exports = {
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
  },
}
```

---

## Best Practices

### 1. Always Specify Width and Height

```tsx
// ✅ Good
<OptimizedImage
  src="/image.png"
  alt="Description"
  width={800}
  height={600}
/>

// ❌ Bad (causes layout shift)
<OptimizedImage
  src="/image.png"
  alt="Description"
/>
```

### 2. Use Priority for Above-the-Fold Images

```tsx
// ✅ Good - Hero image loads immediately
<OptimizedImage
  src="/hero.png"
  alt="Hero"
  width={1200}
  height={600}
  priority
/>

// ❌ Bad - Hero image lazy loads
<OptimizedImage
  src="/hero.png"
  alt="Hero"
  width={1200}
  height={600}
/>
```

### 3. Use Appropriate Sizes

```tsx
// ✅ Good - Responsive sizes
<OptimizedImage
  src="/image.png"
  alt="Description"
  width={800}
  height={600}
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
/>
```

### 4. Use Fill for Background Images

```tsx
// ✅ Good - Fill container
<div className="relative w-full h-64">
  <OptimizedImage
    src="/background.png"
    alt="Background"
    fill
    objectFit="cover"
  />
</div>
```

### 5. Provide Meaningful Alt Text

```tsx
// ✅ Good - Descriptive alt text
<OptimizedImage
  src="/fortune-cookie.png"
  alt="Golden fortune cookie with inspirational message"
  width={400}
  height={300}
/>

// ❌ Bad - Generic alt text
<OptimizedImage
  src="/fortune-cookie.png"
  alt="image"
  width={400}
  height={300}
/>
```

---

## Image Optimization Script

**Location**: `scripts/optimize-images.js`

### Usage

**Analyze images**:
```bash
node scripts/optimize-images.js --analyze
```

**Convert to WebP** (requires sharp):
```bash
npm install sharp
node scripts/optimize-images.js --convert --quality=85
```

### Features

- ✅ Analyzes image sizes and formats
- ✅ Provides optimization recommendations
- ✅ Converts images to WebP format
- ✅ Generates optimization report
- ✅ Calculates potential savings

---

## Performance Targets

### Core Web Vitals

- **LCP (Largest Contentful Paint)**: < 2.5s
  - Use `priority` for hero images
  - Optimize image sizes
  - Use appropriate formats (WebP/AVIF)

- **CLS (Cumulative Layout Shift)**: < 0.1
  - Always specify width/height
  - Use aspect ratio for responsive images
  - Avoid layout shifts during load

### Image Loading Strategy

1. **Above-the-fold images**: `priority={true}`
2. **Below-the-fold images**: `loading="lazy"` (default)
3. **Background images**: `fill={true}`
4. **Thumbnails**: Lower quality (75)
5. **Hero images**: Higher quality (90)

---

## Migration Guide

### Migrating from `<img>` to OptimizedImage

**Before**:
```tsx
<img
  src="/images/hero.png"
  alt="Hero"
  className="w-full h-auto"
/>
```

**After**:
```tsx
<OptimizedImage
  src="/images/hero.png"
  alt="Hero"
  width={1200}
  height={600}
  className="w-full h-auto"
/>
```

### Migrating from Next.js Image to OptimizedImage

**Before**:
```tsx
import Image from 'next/image'

<Image
  src="/images/hero.png"
  alt="Hero"
  width={1200}
  height={600}
/>
```

**After**:
```tsx
import { OptimizedImage } from '@/components/OptimizedImage'

<OptimizedImage
  src="/images/hero.png"
  alt="Hero"
  width={1200}
  height={600}
/>
```

---

## Troubleshooting

### Issue: Images not loading

**Solution**: Check that images are in the `public/` directory and paths are correct.

```tsx
// ✅ Correct
<OptimizedImage src="/images/hero.png" ... />

// ❌ Incorrect
<OptimizedImage src="images/hero.png" ... />
<OptimizedImage src="public/images/hero.png" ... />
```

### Issue: Layout shift during load

**Solution**: Always specify width and height.

```tsx
// ✅ Correct
<OptimizedImage
  src="/image.png"
  alt="Description"
  width={800}
  height={600}
/>
```

### Issue: Images too large

**Solution**: Use appropriate sizes and quality.

```tsx
// ✅ Correct
<OptimizedImage
  src="/image.png"
  alt="Description"
  width={800}
  height={600}
  quality={85}
  sizes="(max-width: 768px) 100vw, 50vw"
/>
```

---

## Summary

### Current State ✅

- ✅ Images already optimized (490 Bytes total)
- ✅ Next.js Image component in use
- ✅ OptimizedImage wrapper created
- ✅ Image optimization script available
- ✅ Comprehensive documentation

### Recommendations

1. **Use OptimizedImage component** for all new images
2. **Specify width/height** to prevent layout shift
3. **Use priority** for above-the-fold images
4. **Use appropriate quality** (75-90 depending on use case)
5. **Provide meaningful alt text** for accessibility

### Performance Impact

- **Current**: Images already optimized
- **With Next.js Image**: Automatic format conversion (WebP/AVIF)
- **With OptimizedImage**: Additional loading states and error handling
- **Expected**: No significant size reduction (already optimized), but better UX

---

**Next Steps**:
1. Use OptimizedImage component in new features
2. Monitor Core Web Vitals (LCP, CLS)
3. Test image loading on different devices
4. Consider lazy loading for below-the-fold images

