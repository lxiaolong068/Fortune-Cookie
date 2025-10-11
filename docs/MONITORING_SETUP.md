# Post-Deployment Monitoring Setup

**Project**: Fortune Cookie AI  
**Date**: 2025-10-11  
**Status**: Monitoring Configuration Guide

---

## 📊 Monitoring Overview

### Monitoring Stack

1. **Vercel Analytics** - Built-in platform monitoring
2. **Google Analytics** - User behavior tracking
3. **Web Vitals** - Performance monitoring
4. **Error Monitoring** - Application error tracking
5. **Cache Performance** - Redis cache monitoring
6. **API Monitoring** - Endpoint performance tracking

---

## 1. Vercel Analytics (Built-in)

### Setup

**Automatic** - No configuration needed, enabled by default

### Metrics Available

**Real-time Metrics**:
- Requests per second
- Error rate
- Response time (p50, p95, p99)
- Bandwidth usage
- Geographic distribution

**Access**:
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project
3. Click "Analytics" tab

### Key Metrics to Monitor

| Metric | Target | Alert Threshold |
|--------|--------|-----------------|
| **Error Rate** | <0.1% | >1% |
| **Response Time (p95)** | <500ms | >2000ms |
| **Requests/min** | Varies | Sudden drops |
| **Bandwidth** | <10GB/day | >50GB/day |

---

## 2. Google Analytics

### Setup

**Already Configured** via `GOOGLE_ANALYTICS_ID` environment variable

### Verification

```bash
# Check if GA is loaded
# Open browser console on your site:
window.gtag

# Should return a function if GA is loaded
```

### Key Events Tracked

**Automatic Events**:
- Page views
- Session duration
- Bounce rate
- User demographics

**Custom Events** (implemented in code):
- Fortune generation
- Theme selection
- Share actions
- Download actions

### Dashboard Setup

1. Go to [Google Analytics](https://analytics.google.com)
2. Select your property
3. Create custom dashboard with:
   - Real-time users
   - Page views
   - Fortune generation events
   - Error events
   - Performance metrics

---

## 3. Web Vitals Monitoring

### Setup

**Already Implemented** in `components/PerformanceMonitor.tsx`

### Core Web Vitals Tracked

| Metric | Target | Warning | Poor |
|--------|--------|---------|------|
| **LCP** (Largest Contentful Paint) | <2.5s | 2.5-4.0s | >4.0s |
| **INP** (Interaction to Next Paint) | <200ms | 200-500ms | >500ms |
| **CLS** (Cumulative Layout Shift) | <0.1 | 0.1-0.25 | >0.25 |
| **FCP** (First Contentful Paint) | <1.8s | 1.8-3.0s | >3.0s |
| **TTFB** (Time to First Byte) | <600ms | 600-1800ms | >1800ms |

### Monitoring Code

```typescript
// Already implemented in components/PerformanceMonitor.tsx
import { onCLS, onINP, onLCP, onFCP, onTTFB } from 'web-vitals'

onLCP(console.log)
onINP(console.log)
onCLS(console.log)
onFCP(console.log)
onTTFB(console.log)
```

### Viewing Web Vitals

**Vercel Dashboard**:
1. Go to Analytics → Speed
2. View Core Web Vitals scores
3. Check field data (real users)

**Chrome DevTools**:
1. Open DevTools
2. Go to Lighthouse tab
3. Run audit
4. Check Core Web Vitals section

---

## 4. Error Monitoring

### Setup

**Already Implemented** via `lib/error-monitoring.ts`

### Error Tracking Features

**Automatic Capture**:
- API errors
- Client-side errors
- Unhandled promise rejections
- Network errors

**Error Context**:
- Error message
- Stack trace
- User session ID
- Request details
- Timestamp

### Viewing Errors

**Vercel Logs**:
```bash
# View error logs
vercel logs --prod | grep "ERROR"

# Real-time error monitoring
vercel logs --prod --follow | grep "ERROR"
```

**Database Errors**:
```sql
-- Query error logs from database
SELECT * FROM "ErrorLog"
WHERE "timestamp" > NOW() - INTERVAL '1 day'
ORDER BY "timestamp" DESC
LIMIT 100;
```

### Error Alerts

**Set up alerts for**:
- Error rate >1%
- Critical errors (500 status)
- API failures
- Database connection errors

---

## 5. Cache Performance Monitoring

### Setup

**Already Implemented** via `lib/edge-cache.ts` and `lib/redis-cache.ts`

### Metrics Tracked

| Metric | Target | Alert Threshold |
|--------|--------|-----------------|
| **Cache Hit Rate** | >60% | <40% |
| **Cache Response Time** | <50ms | >200ms |
| **Redis Connection** | 100% | <95% |
| **Cache Size** | <1GB | >5GB |

### Monitoring Cache Stats

**API Endpoint**:
```bash
# Get cache statistics
curl https://your-domain.com/api/cache/stats

# Response:
{
  "hits": 1000,
  "misses": 400,
  "hitRate": 71.4,
  "totalRequests": 1400,
  "avgResponseTime": 45
}
```

**Code**:
```typescript
import { CachePerformanceMonitor } from '@/lib/edge-cache'

const stats = CachePerformanceMonitor.getStats()
console.log('Cache hit rate:', stats.hitRate)
```

### Cache Health Checks

**Daily Checks**:
- Cache hit rate
- Redis connection status
- Cache response times
- Memory usage

---

## 6. API Monitoring

### Setup

**Already Implemented** via API route handlers

### Endpoints to Monitor

| Endpoint | Target Response Time | Alert Threshold |
|----------|---------------------|-----------------|
| `/api/fortune` | <500ms (cached) | >2000ms |
| `/api/fortune` | <2000ms (AI) | >5000ms |
| `/api/fortunes` | <300ms | >1000ms |
| `/api/analytics` | <200ms | >500ms |

### Monitoring API Performance

**Vercel Functions**:
1. Go to Vercel Dashboard
2. Click "Functions" tab
3. View function invocations
4. Check execution time
5. Review error rates

**Custom Monitoring**:
```typescript
// Already implemented in API routes
const startTime = Date.now()
// ... API logic ...
const duration = Date.now() - startTime
console.log(`API response time: ${duration}ms`)
```

---

## 7. Database Monitoring

### Metrics to Track

| Metric | Target | Alert Threshold |
|--------|--------|-----------------|
| **Connection Pool** | <80% | >90% |
| **Query Time** | <100ms | >500ms |
| **Active Connections** | <50 | >100 |
| **Database Size** | <1GB | >10GB |

### Monitoring Queries

**Slow Query Log**:
```sql
-- Find slow queries
SELECT * FROM pg_stat_statements
WHERE mean_exec_time > 100
ORDER BY mean_exec_time DESC
LIMIT 10;
```

**Connection Status**:
```sql
-- Check active connections
SELECT count(*) FROM pg_stat_activity;
```

---

## 8. Alert Configuration

### Recommended Alerts

**Critical Alerts** (Immediate action required):
- Error rate >5%
- API response time >5s
- Database connection failure
- Redis connection failure
- Deployment failure

**Warning Alerts** (Monitor closely):
- Error rate >1%
- API response time >2s
- Cache hit rate <40%
- Memory usage >80%
- Bandwidth >80% of limit

**Info Alerts** (Good to know):
- Deployment success
- Traffic spike
- New user milestone
- Performance improvement

### Alert Channels

**Vercel Notifications**:
1. Go to Project Settings
2. Click "Notifications"
3. Configure:
   - Email notifications
   - Slack integration
   - Discord webhook

**Custom Alerts** (via code):
```typescript
// Example: Send alert when error rate is high
if (errorRate > 0.01) {
  await sendAlert({
    level: 'critical',
    message: `Error rate is ${errorRate * 100}%`,
    channel: 'slack'
  })
}
```

---

## 9. Monitoring Dashboard

### Recommended Dashboard Layout

**Section 1: Real-time Overview**
- Current users
- Requests per minute
- Error rate
- Response time

**Section 2: Performance**
- Core Web Vitals (LCP, INP, CLS)
- API response times
- Cache hit rate
- Database query time

**Section 3: Errors**
- Error count (last hour)
- Error types
- Affected endpoints
- Error trends

**Section 4: Business Metrics**
- Fortune generations
- User sessions
- Popular themes
- Geographic distribution

### Creating Custom Dashboard

**Tools**:
- Vercel Analytics (built-in)
- Google Analytics (custom reports)
- Grafana (advanced, requires setup)
- Custom dashboard (build your own)

---

## 10. Monitoring Schedule

### First Hour After Deployment

**Check every 15 minutes**:
- Error rate
- Response times
- User traffic
- Critical errors

### First Day

**Check every 4 hours**:
- Error trends
- Performance metrics
- Cache effectiveness
- User feedback

### First Week

**Daily checks**:
- Error logs review
- Performance trends
- Cache hit rate
- User analytics

### Ongoing

**Weekly checks**:
- Performance report
- Error analysis
- Cache optimization
- User behavior analysis

**Monthly checks**:
- Comprehensive review
- Optimization opportunities
- Capacity planning
- Cost analysis

---

## 11. Monitoring Checklist

### Daily Monitoring
- [ ] Check error rate (<0.1%)
- [ ] Verify API response times (<500ms)
- [ ] Review cache hit rate (>60%)
- [ ] Check Core Web Vitals (all green)
- [ ] Review user feedback

### Weekly Monitoring
- [ ] Analyze error trends
- [ ] Review performance metrics
- [ ] Check cache effectiveness
- [ ] Analyze user behavior
- [ ] Review cost and usage

### Monthly Monitoring
- [ ] Comprehensive performance review
- [ ] Identify optimization opportunities
- [ ] Capacity planning
- [ ] Security audit
- [ ] Documentation update

---

## 12. Monitoring Tools Summary

| Tool | Purpose | Access |
|------|---------|--------|
| **Vercel Analytics** | Platform monitoring | Vercel Dashboard |
| **Google Analytics** | User behavior | analytics.google.com |
| **Web Vitals** | Performance | Built-in component |
| **Error Monitoring** | Error tracking | Vercel Logs + Database |
| **Cache Monitor** | Cache performance | API endpoint |
| **API Monitor** | Endpoint performance | Vercel Functions |

---

## ✅ Monitoring Setup Complete

**Status**: ✅ All monitoring systems configured and ready

**Next Steps**:
1. Deploy to production
2. Verify all monitoring systems are active
3. Set up alert channels
4. Create monitoring dashboard
5. Begin daily monitoring routine

---

*Monitoring setup guide created on 2025-10-11. All systems ready for production monitoring! 📊*

