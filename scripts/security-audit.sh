#!/bin/bash

# 🔐 Security Audit Script for Fortune Cookie AI
# This script audits git history for potentially leaked secrets

echo "🔍 Starting Security Audit..."
echo "================================"
echo ""

# Create audit directory
AUDIT_DIR="security-audit"
mkdir -p "$AUDIT_DIR"

# Audit timestamp
TIMESTAMP=$(date +"%Y-%m-%d_%H-%M-%S")
AUDIT_FILE="$AUDIT_DIR/audit-report-$TIMESTAMP.log"

echo "📝 Audit Report - $TIMESTAMP" > "$AUDIT_FILE"
echo "================================" >> "$AUDIT_FILE"
echo "" >> "$AUDIT_FILE"

# Check for exposed AdSense ID
echo "🔍 Checking for exposed Google AdSense ID..."
echo "## Google AdSense ID Audit" >> "$AUDIT_FILE"
echo "" >> "$AUDIT_FILE"

if git log -p | grep -i "ca-pub-6958408841088360" > /dev/null 2>&1; then
    echo "⚠️  WARNING: Exposed AdSense ID found in git history!" | tee -a "$AUDIT_FILE"
    echo "" >> "$AUDIT_FILE"
    echo "Occurrences:" >> "$AUDIT_FILE"
    git log --all --full-history -p | grep -n "ca-pub-6958408841088360" >> "$AUDIT_FILE" 2>&1
    echo "" >> "$AUDIT_FILE"
else
    echo "✅ No exposed AdSense ID found in git history" | tee -a "$AUDIT_FILE"
fi

echo "" >> "$AUDIT_FILE"

# Check for other potential secrets
echo "🔍 Checking for other potential secrets..."
echo "## Other Potential Secrets" >> "$AUDIT_FILE"
echo "" >> "$AUDIT_FILE"

# Check for API keys
echo "### API Keys" >> "$AUDIT_FILE"
if git log -p | grep -E "(OPENROUTER_API_KEY|API_KEY|SECRET_KEY).*=.*[a-zA-Z0-9]{20,}" > /dev/null 2>&1; then
    echo "⚠️  WARNING: Potential API keys found in git history!" | tee -a "$AUDIT_FILE"
    git log --all --full-history -p | grep -E "(OPENROUTER_API_KEY|API_KEY|SECRET_KEY).*=.*[a-zA-Z0-9]{20,}" | head -20 >> "$AUDIT_FILE" 2>&1
else
    echo "✅ No obvious API keys found" | tee -a "$AUDIT_FILE"
fi

echo "" >> "$AUDIT_FILE"

# Check for database URLs
echo "### Database URLs" >> "$AUDIT_FILE"
if git log -p | grep -E "postgresql://.*:.*@" > /dev/null 2>&1; then
    echo "⚠️  WARNING: Potential database URLs found in git history!" | tee -a "$AUDIT_FILE"
    git log --all --full-history -p | grep -E "postgresql://.*:.*@" | head -10 >> "$AUDIT_FILE" 2>&1
else
    echo "✅ No database URLs found" | tee -a "$AUDIT_FILE"
fi

echo "" >> "$AUDIT_FILE"

# Check for Redis URLs
echo "### Redis URLs" >> "$AUDIT_FILE"
if git log -p | grep -E "UPSTASH_REDIS.*=.*https://" > /dev/null 2>&1; then
    echo "⚠️  WARNING: Potential Redis URLs found in git history!" | tee -a "$AUDIT_FILE"
    git log --all --full-history -p | grep -E "UPSTASH_REDIS.*=.*https://" | head -10 >> "$AUDIT_FILE" 2>&1
else
    echo "✅ No Redis URLs found" | tee -a "$AUDIT_FILE"
fi

echo "" >> "$AUDIT_FILE"

# Summary
echo "" >> "$AUDIT_FILE"
echo "================================" >> "$AUDIT_FILE"
echo "## Audit Summary" >> "$AUDIT_FILE"
echo "" >> "$AUDIT_FILE"
echo "Audit completed at: $(date)" >> "$AUDIT_FILE"
echo "Report saved to: $AUDIT_FILE" >> "$AUDIT_FILE"
echo "" >> "$AUDIT_FILE"

# Recommendations
echo "## Recommendations" >> "$AUDIT_FILE"
echo "" >> "$AUDIT_FILE"
echo "1. ✅ Rotate the exposed Google AdSense ID immediately" >> "$AUDIT_FILE"
echo "2. ✅ Update production environment variables in Vercel" >> "$AUDIT_FILE"
echo "3. ✅ Ensure .env.local is in .gitignore" >> "$AUDIT_FILE"
echo "4. ✅ Review all environment variables for sensitive data" >> "$AUDIT_FILE"
echo "5. ✅ Consider using git-secrets or similar tools for prevention" >> "$AUDIT_FILE"
echo "" >> "$AUDIT_FILE"

echo ""
echo "================================"
echo "✅ Security audit completed!"
echo "📄 Report saved to: $AUDIT_FILE"
echo ""
echo "Next steps:"
echo "1. Review the audit report"
echo "2. Revoke exposed credentials in respective consoles"
echo "3. Generate new credentials"
echo "4. Update production environment variables"
echo ""

