# Deployment Guide

**Project**: Fortune Cookie AI  
**Date**: 2025-10-11  
**Status**: Ready for Deployment  
**Platform**: Vercel

---

## 📋 Prerequisites

### 1. Vercel Account Setup

- ✅ Vercel account created
- ✅ GitHub repository connected
- ✅ Project imported to Vercel
- ✅ Environment variables configured

### 2. Environment Variables

**Required in Vercel Dashboard**:

```bash
# Database
DATABASE_URL="postgresql://..."

# Redis/Upstash (Required for caching and rate limiting)
UPSTASH_REDIS_REST_URL="https://..."
UPSTASH_REDIS_REST_TOKEN="..."

# OpenRouter API (Required for AI generation)
OPENROUTER_API_KEY="sk-or-..."
OPENROUTER_BASE_URL="https://openrouter.ai/api/v1"

# Application
NEXT_PUBLIC_APP_URL="https://your-domain.com"
NODE_ENV="production"

# Analytics (Optional)
GOOGLE_ANALYTICS_ID="G-..."
GOOGLE_VERIFICATION_CODE="..."
```

### 3. Pre-Deployment Checklist

✅ All checks passed (see `PRE_DEPLOYMENT_CHECKLIST.md`)

---

## 🚀 Deployment Options

### Option 1: Automatic Deployment (Recommended)

**Vercel automatically deploys when you push to main branch**

```bash
# 1. Ensure all changes are committed
git status

# 2. Push to main branch
git push origin main

# 3. Vercel will automatically:
#    - Detect the push
#    - Run build
#    - Deploy to production
#    - Assign production URL
```

**Monitoring**:
- Watch deployment in Vercel Dashboard
- Check deployment logs for errors
- Verify deployment URL

### Option 2: Manual Deployment via Vercel CLI

**Install Vercel CLI** (if not installed):
```bash
npm install -g vercel
```

**Login to Vercel**:
```bash
vercel login
```

**Deploy to Staging**:
```bash
# Deploy to preview/staging environment
vercel

# This will:
# - Build the project
# - Deploy to a preview URL
# - Provide a unique URL for testing
```

**Deploy to Production**:
```bash
# Deploy to production
vercel --prod

# This will:
# - Build the project
# - Deploy to production domain
# - Update production URL
```

### Option 3: Vercel Dashboard Deployment

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project
3. Click "Deployments" tab
4. Click "Redeploy" on the latest deployment
5. Select "Production" or "Preview"
6. Click "Redeploy"

---

## 🧪 Staging Deployment (Recommended First Step)

### 1. Deploy to Staging

```bash
# Deploy to preview environment
vercel

# Output will show:
# ✅ Preview: https://fortune-cookie-ai-xyz123.vercel.app
```

### 2. Run Smoke Tests

**Manual Testing**:
1. Visit staging URL
2. Test fortune generation
3. Test browsing fortunes
4. Test analytics page
5. Test all navigation links
6. Test mobile responsiveness

**Automated Testing** (optional):
```bash
# Set staging URL
export NEXT_PUBLIC_APP_URL="https://fortune-cookie-ai-xyz123.vercel.app"

# Run E2E tests against staging
npm run test:e2e
```

### 3. Verify Features

**Core Features**:
- ✅ Fortune generation works
- ✅ AI generation works (if API key configured)
- ✅ Caching works (Redis)
- ✅ Rate limiting works
- ✅ Analytics tracking works
- ✅ All pages load correctly
- ✅ No console errors
- ✅ Performance is good

**If all tests pass**: Proceed to production deployment

---

## 🌐 Production Deployment

### 1. Deploy to Production

**Option A: Automatic (Push to main)**
```bash
git push origin main
```

**Option B: Manual (Vercel CLI)**
```bash
vercel --prod
```

**Option C: Dashboard**
- Click "Redeploy" → "Production"

### 2. Monitor Deployment

**Vercel Dashboard**:
1. Go to Deployments tab
2. Watch build logs
3. Check for errors
4. Wait for "Ready" status

**Expected Output**:
```
✅ Build completed
✅ Deployment ready
🌐 Production: https://your-domain.com
```

### 3. Verify Production

**Health Checks**:
```bash
# Check homepage
curl https://your-domain.com

# Check API health
curl https://your-domain.com/api/fortune

# Check sitemap
curl https://your-domain.com/sitemap.xml

# Check robots.txt
curl https://your-domain.com/robots.txt
```

**Manual Verification**:
1. Visit production URL
2. Test fortune generation
3. Check analytics
4. Verify all pages load
5. Test on mobile devices
6. Check browser console for errors

---

## 📊 Post-Deployment Monitoring

### 1. Immediate Monitoring (First Hour)

**Vercel Analytics**:
- Monitor error rates
- Check response times
- Watch traffic patterns

**Application Monitoring**:
```bash
# Check error logs
vercel logs --prod

# Monitor real-time logs
vercel logs --prod --follow
```

**Key Metrics to Watch**:
- Error rate: Should be <0.1%
- API response time: Should be <500ms
- Cache hit rate: Should be >60%
- Page load time: Should be <3s

### 2. First Day Monitoring

**Check Every 4 Hours**:
- Error rates
- Performance metrics
- User feedback
- Analytics data

**Vercel Dashboard Metrics**:
- Requests per hour
- Error count
- Response times
- Bandwidth usage

### 3. First Week Monitoring

**Daily Checks**:
- Review error logs
- Check performance trends
- Monitor cache effectiveness
- Review user analytics

**Weekly Report**:
- Total requests
- Error rate
- Average response time
- Cache hit rate
- Core Web Vitals scores

---

## 🔧 Troubleshooting

### Common Issues

**1. Build Fails**
```bash
# Check build logs
vercel logs --prod

# Common fixes:
# - Verify environment variables
# - Check for TypeScript errors
# - Ensure dependencies are installed
```

**2. API Errors**
```bash
# Check API logs
vercel logs --prod | grep "api/"

# Common fixes:
# - Verify OPENROUTER_API_KEY
# - Check UPSTASH_REDIS credentials
# - Verify DATABASE_URL
```

**3. Performance Issues**
```bash
# Check bundle size
npm run analyze

# Common fixes:
# - Enable caching
# - Optimize images
# - Check Redis connection
```

**4. Rate Limiting Issues**
```bash
# Check rate limiter logs
vercel logs --prod | grep "rate"

# Common fixes:
# - Verify Redis connection
# - Adjust rate limits in code
# - Check IP detection
```

---

## 🔄 Rollback Procedure

### If Issues Occur

**Option 1: Instant Rollback (Vercel Dashboard)**
1. Go to Deployments tab
2. Find previous working deployment
3. Click "..." menu
4. Click "Promote to Production"

**Option 2: Git Revert**
```bash
# Revert to previous commit
git revert HEAD
git push origin main

# Vercel will auto-deploy the reverted version
```

**Option 3: Redeploy Previous Version**
```bash
# Find previous deployment
vercel ls

# Promote previous deployment
vercel promote <deployment-url> --prod
```

---

## ✅ Deployment Checklist

### Pre-Deployment
- [x] All phases (1-4) completed
- [x] Tests passing (107+ tests)
- [x] Build successful
- [x] Environment variables configured
- [x] Documentation complete
- [x] Security verified

### During Deployment
- [ ] Deploy to staging first
- [ ] Run smoke tests on staging
- [ ] Verify all features work
- [ ] Deploy to production
- [ ] Monitor deployment logs
- [ ] Verify production health

### Post-Deployment
- [ ] Check error rates (first hour)
- [ ] Monitor performance metrics
- [ ] Verify analytics tracking
- [ ] Test all critical paths
- [ ] Check mobile responsiveness
- [ ] Review user feedback

---

## 📞 Support

### Resources

- **Vercel Documentation**: https://vercel.com/docs
- **Next.js Documentation**: https://nextjs.org/docs
- **Project Repository**: https://github.com/lxiaolong068/Fortune-Cookie
- **Vercel Dashboard**: https://vercel.com/dashboard

### Emergency Contacts

- **Vercel Support**: support@vercel.com
- **Project Owner**: [Your contact info]

---

## 🎉 Success Criteria

**Deployment is successful when**:
- ✅ All pages load without errors
- ✅ Fortune generation works
- ✅ API responses are fast (<500ms)
- ✅ No console errors
- ✅ Analytics tracking works
- ✅ Mobile experience is good
- ✅ Core Web Vitals are green
- ✅ Error rate is <0.1%

---

*Deployment guide created on 2025-10-11. Ready to deploy! 🚀*

