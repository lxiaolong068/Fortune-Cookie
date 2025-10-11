# 🔐 Security Fix Guide - Fortune Cookie AI

**Date**: 2025-10-11  
**Priority**: CRITICAL  
**Status**: Action Required

---

## 🚨 Critical Security Issue Identified

### Exposed Credentials in `.env.example`

**Issue**: Google AdSense Client ID was exposed in `.env.example` file:
- **Exposed ID**: `ca-pub-6958408841088360`
- **File**: `.env.example:26`
- **Risk Level**: HIGH
- **Git History**: Exposed in commit history

---

## ✅ Immediate Actions Taken

### 1. Sanitized `.env.example`
- ✅ Replaced real AdSense ID with placeholder: `ca-pub-XXXXXXXXXXXXXXXX`
- ✅ Added security warning comments
- ✅ Committed sanitized version

### 2. Security Audit Completed
- ✅ Created `scripts/security-audit.sh` for automated auditing
- ✅ Scanned git history for leaked secrets
- ✅ Generated audit report in `security-audit/` directory

---

## 🔧 Required Manual Actions

### Step 1: Revoke Exposed Google AdSense ID

**Action**: Immediately revoke the exposed AdSense client ID

1. **Login to Google AdSense Console**
   - Visit: https://www.google.com/adsense/
   - Login with your Google account

2. **Navigate to Account Settings**
   - Go to: Account → Settings → Account Information

3. **Generate New AdSense Client ID**
   - If possible, rotate/regenerate the client ID
   - Or create a new ad unit with a new ID

4. **Update Ad Units**
   - Update all ad units to use the new client ID
   - Remove references to the old ID

**Timeline**: Complete within 24 hours

---

### Step 2: Update Production Environment Variables

**Action**: Update environment variables in Vercel (or your deployment platform)

#### For Vercel Deployment:

```bash
# Method 1: Using Vercel CLI
vercel env rm GOOGLE_ADSENSE_CLIENT_ID production
vercel env add GOOGLE_ADSENSE_CLIENT_ID production

# Method 2: Using Vercel Dashboard
# 1. Go to: https://vercel.com/dashboard
# 2. Select your project
# 3. Go to: Settings → Environment Variables
# 4. Delete old GOOGLE_ADSENSE_CLIENT_ID
# 5. Add new GOOGLE_ADSENSE_CLIENT_ID with new value
```

#### Environment Variables to Update:

```bash
# Required - Update with new AdSense ID
GOOGLE_ADSENSE_CLIENT_ID=ca-pub-YOUR_NEW_ID_HERE

# Verify these are not exposed (should be placeholders in .env.example)
OPENROUTER_API_KEY=your_actual_key_here
UPSTASH_REDIS_REST_URL=your_actual_url_here
UPSTASH_REDIS_REST_TOKEN=your_actual_token_here
DATABASE_URL=your_actual_database_url_here
```

**Timeline**: Complete within 24 hours

---

### Step 3: Verify Local Environment

**Action**: Ensure your local `.env.local` is secure

```bash
# 1. Check if .env.local exists and is in .gitignore
cat .gitignore | grep ".env.local"

# 2. Verify .env.local has real credentials (not placeholders)
cat .env.local | grep "GOOGLE_ADSENSE_CLIENT_ID"

# 3. Update .env.local with new AdSense ID
# Edit .env.local manually and replace with new ID
```

**Verification Checklist**:
- [ ] `.env.local` is in `.gitignore`
- [ ] `.env.local` contains real credentials
- [ ] `.env.example` contains only placeholders
- [ ] New AdSense ID is configured in `.env.local`

---

### Step 4: Audit Other Credentials

**Action**: Review and rotate other potentially exposed credentials

Based on security audit, check these credentials:

#### 1. OpenRouter API Key
```bash
# If exposed, rotate immediately:
# 1. Visit: https://openrouter.ai/keys
# 2. Revoke old key
# 3. Generate new key
# 4. Update in Vercel and .env.local
```

#### 2. Upstash Redis Credentials
```bash
# If exposed, rotate immediately:
# 1. Visit: https://console.upstash.com/
# 2. Navigate to your Redis database
# 3. Rotate credentials or create new database
# 4. Update UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN
```

#### 3. Database Credentials
```bash
# If exposed, rotate immediately:
# 1. Access your database provider (Neon, Supabase, etc.)
# 2. Rotate database password
# 3. Update DATABASE_URL with new credentials
```

**Timeline**: Complete within 48 hours

---

## 🛡️ Prevention Measures

### 1. Git Secrets Prevention

Install `git-secrets` to prevent future leaks:

```bash
# Install git-secrets (macOS)
brew install git-secrets

# Initialize in repository
cd /path/to/Fortune-Cookie
git secrets --install
git secrets --register-aws

# Add custom patterns
git secrets --add 'ca-pub-[0-9]{16}'
git secrets --add 'sk-or-[a-zA-Z0-9]{48}'
git secrets --add 'postgresql://[^:]+:[^@]+@'
```

### 2. Pre-commit Hooks

Create `.git/hooks/pre-commit`:

```bash
#!/bin/bash
# Pre-commit hook to prevent secrets

# Check for potential secrets
if git diff --cached | grep -E "(ca-pub-[0-9]{16}|sk-or-[a-zA-Z0-9]{48}|postgresql://[^:]+:[^@]+@)"; then
    echo "❌ ERROR: Potential secret detected in commit!"
    echo "Please remove sensitive data before committing."
    exit 1
fi

exit 0
```

### 3. Environment Variable Checklist

Before committing any `.env*` file:

- [ ] File contains only placeholder values
- [ ] No real API keys or tokens
- [ ] No real database URLs
- [ ] No real passwords
- [ ] Security warnings are present
- [ ] File is properly documented

### 4. Regular Security Audits

Schedule regular security audits:

```bash
# Run security audit monthly
npm run security:audit

# Or manually:
bash scripts/security-audit.sh
```

---

## 📋 Verification Checklist

After completing all steps, verify:

### Production Environment
- [ ] Old AdSense ID revoked in Google AdSense Console
- [ ] New AdSense ID generated
- [ ] New AdSense ID configured in Vercel environment variables
- [ ] Production deployment successful with new credentials
- [ ] AdSense ads displaying correctly on production site

### Local Environment
- [ ] `.env.local` updated with new AdSense ID
- [ ] `.env.example` contains only placeholders
- [ ] `.gitignore` includes `.env.local`
- [ ] Local development working with new credentials

### Security Measures
- [ ] Security audit completed and reviewed
- [ ] Git secrets prevention installed (optional but recommended)
- [ ] Pre-commit hooks configured (optional but recommended)
- [ ] Team notified of security incident and new procedures

### Documentation
- [ ] This guide reviewed and followed
- [ ] Security incident documented
- [ ] Lessons learned documented
- [ ] Prevention measures implemented

---

## 📞 Support & Resources

### Internal Resources
- **Security Lead**: Review and approve all credential rotations
- **DevOps Team**: Assist with environment variable updates
- **Development Team**: Verify application functionality after updates

### External Resources
- **Google AdSense Help**: https://support.google.com/adsense/
- **Vercel Environment Variables**: https://vercel.com/docs/environment-variables
- **Git Secrets**: https://github.com/awslabs/git-secrets
- **OWASP Secrets Management**: https://owasp.org/www-community/vulnerabilities/Use_of_hard-coded_password

---

## 📝 Incident Timeline

| Date | Action | Status |
|------|--------|--------|
| 2025-10-11 | Security issue identified | ✅ Complete |
| 2025-10-11 | `.env.example` sanitized | ✅ Complete |
| 2025-10-11 | Security audit script created | ✅ Complete |
| 2025-10-11 | Security audit executed | ✅ Complete |
| 2025-10-11 | This guide created | ✅ Complete |
| TBD | Revoke old AdSense ID | ⏳ Pending |
| TBD | Generate new AdSense ID | ⏳ Pending |
| TBD | Update Vercel environment variables | ⏳ Pending |
| TBD | Verify production deployment | ⏳ Pending |
| TBD | Complete security verification | ⏳ Pending |

---

## ⚠️ Important Notes

1. **Do NOT commit** any files containing real credentials
2. **Do NOT share** the exposed AdSense ID publicly
3. **Do NOT delay** credential rotation - complete within 24-48 hours
4. **Do communicate** with team members about security procedures
5. **Do document** all actions taken for future reference

---

**Document Status**: ✅ Active  
**Next Review**: After credential rotation completion  
**Owner**: Security Lead / DevOps Team

---

*This is a critical security document. Keep it updated and review regularly.*

