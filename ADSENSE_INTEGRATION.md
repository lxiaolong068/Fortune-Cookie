# Google AdSense Integration Guide

## Overview

Google AdSense has been successfully integrated into the Fortune Cookie website using Next.js 14 App Router best practices. The integration includes proper script loading, CSP configuration, and performance optimization.

## Implementation Details

### 1. AdSense Component

**Location**: `components/PerformanceMonitor.tsx`

```typescript
export function GoogleAdSense({ clientId }: { clientId: string }) {
  if (!clientId || process.env.NODE_ENV !== 'production') {
    return null
  }

  return (
    <Script
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${clientId}`}
      strategy="afterInteractive"
      crossOrigin="anonymous"
      onLoad={() => {
        if (process.env.NODE_ENV === 'development') {
          console.log('Google AdSense script loaded successfully')
        }
      }}
      onError={(error) => {
        console.error('Failed to load Google AdSense script:', error)
        // Error monitoring integration
      }}
    />
  )
}
```

### 2. Layout Integration

**Location**: `app/layout.tsx`

The AdSense component is added to the root layout to ensure it loads on all pages:

```typescript
import { GoogleAdSense } from '@/components/PerformanceMonitor'

// In the body section:
<GoogleAdSense clientId={process.env.GOOGLE_ADSENSE_CLIENT_ID || 'ca-pub-6958408841088360'} />
```

### 3. Content Security Policy (CSP)

**Location**: `next.config.js`

Updated CSP headers to allow AdSense scripts and resources:

```javascript
"script-src 'self' 'unsafe-eval' 'unsafe-inline' ... https://pagead2.googlesyndication.com https://www.googleadservices.com https://googleads.g.doubleclick.net",
"connect-src 'self' ... https://pagead2.googlesyndication.com https://www.googleadservices.com https://googleads.g.doubleclick.net",
"frame-src 'self' https://googleads.g.doubleclick.net https://tpc.googlesyndication.com",
```

### 4. DNS Prefetching

**Location**: `components/PerformanceMonitor.tsx`

Added AdSense domains to DNS prefetch list for improved performance:

```javascript
const domains = [
  // ... existing domains
  'pagead2.googlesyndication.com',
  'www.googleadservices.com',
  'googleads.g.doubleclick.net'
]
```

### 5. Environment Configuration

**Location**: `.env.example`

```bash
# Google AdSense 客户端 ID (可选)
# 格式: ca-pub-XXXXXXXXXXXXXXXX
# 获取地址: https://www.google.com/adsense/
GOOGLE_ADSENSE_CLIENT_ID=ca-pub-6958408841088360
```

## Key Features

### ✅ Performance Optimized
- Uses Next.js `Script` component with `afterInteractive` strategy
- DNS prefetching for AdSense domains
- Only loads in production environment

### ✅ Security Compliant
- Proper CSP configuration
- `crossOrigin="anonymous"` attribute
- Secure script loading

### ✅ Error Handling
- Script load error monitoring
- Integration with existing error monitoring system
- Graceful fallback in development

### ✅ SEO Friendly
- Non-blocking script loading
- Maintains Core Web Vitals performance
- Proper meta tags and structured data preserved

## Configuration

### Production Setup

1. **Set Environment Variable**:
   ```bash
   GOOGLE_ADSENSE_CLIENT_ID=ca-pub-YOUR-ACTUAL-CLIENT-ID
   ```

2. **Verify AdSense Account**:
   - Ensure your AdSense account is approved
   - Add your domain to AdSense
   - Configure ad units as needed

3. **Deploy and Test**:
   - Deploy to production environment
   - Verify scripts load correctly
   - Check browser console for any errors

### Development Testing

The AdSense script only loads in production (`NODE_ENV=production`). For development testing:

```bash
NODE_ENV=production npm run build
NODE_ENV=production npm start
```

## Verification

Run the included test script to verify integration:

```bash
node test-adsense.js
```

Expected output: All checks should show ✅

## Performance Impact

- **Script Loading**: Non-blocking, loads after page interaction
- **DNS Prefetch**: Reduces connection time to AdSense servers
- **CSP Optimized**: Minimal security policy changes
- **Error Monitoring**: Integrated with existing performance monitoring

## Troubleshooting

### Common Issues

1. **Script not loading**: Check environment variables and production mode
2. **CSP violations**: Verify all AdSense domains are whitelisted
3. **Ad not showing**: Ensure AdSense account approval and proper ad unit setup

### Debug Mode

In development, enable debug logging by checking browser console for AdSense-related messages.

## Next Steps

1. **Ad Placement**: Add specific ad units using `<ins>` tags where needed
2. **Auto Ads**: Configure Auto Ads in AdSense dashboard if desired
3. **Performance Monitoring**: Monitor Core Web Vitals impact
4. **Revenue Optimization**: Test different ad placements and formats

## Support

For AdSense-specific issues, refer to:
- [Google AdSense Help Center](https://support.google.com/adsense)
- [AdSense Policy Center](https://support.google.com/adsense/answer/48182)
- [Next.js Script Optimization](https://nextjs.org/docs/app/api-reference/components/script)
