#!/bin/bash

# ads.txt 访问测试脚本
# 用于验证 ads.txt 文件在根域名和 www 子域名上都可正常访问

set -e

echo "🔍 Testing ads.txt accessibility for AdSense..."
echo ""

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 测试 URL
ROOT_DOMAIN="https://fortune-cookie.cc/ads.txt"
WWW_DOMAIN="https://www.fortune-cookie.cc/ads.txt"

# 期望的内容
EXPECTED_CONTENT="google.com, pub-6958408841088360, DIRECT, f08c47fec0942fa0"

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Test 1: Root domain (fortune-cookie.cc/ads.txt)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# 获取 HTTP 状态码和 Location 头
HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" -L "$ROOT_DOMAIN")
REDIRECT_URL=$(curl -s -I "$ROOT_DOMAIN" | grep -i "^location:" | awk '{print $2}' | tr -d '\r')

echo "URL: $ROOT_DOMAIN"
echo "HTTP Status: $HTTP_STATUS"

if [ -n "$REDIRECT_URL" ]; then
    echo -e "${YELLOW}⚠️  Redirect detected: $REDIRECT_URL${NC}"
    echo -e "${RED}❌ FAIL: ads.txt should NOT redirect (AdSense requirement)${NC}"
    REDIRECT_DETECTED=true
else
    echo -e "${GREEN}✅ No redirect detected${NC}"
    REDIRECT_DETECTED=false
fi

# 检查 Content-Type
CONTENT_TYPE=$(curl -s -I "$ROOT_DOMAIN" | grep -i "^content-type:" | awk '{print $2}' | tr -d '\r')
echo "Content-Type: $CONTENT_TYPE"

if [[ "$CONTENT_TYPE" == *"text/plain"* ]]; then
    echo -e "${GREEN}✅ Correct Content-Type${NC}"
else
    echo -e "${YELLOW}⚠️  Content-Type should be text/plain${NC}"
fi

# 检查文件内容
CONTENT=$(curl -s -L "$ROOT_DOMAIN" | tr -d '\r\n' | xargs)
echo "Content: $CONTENT"

if [[ "$CONTENT" == *"$EXPECTED_CONTENT"* ]]; then
    echo -e "${GREEN}✅ Content matches expected${NC}"
else
    echo -e "${RED}❌ Content does not match expected${NC}"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Test 2: WWW subdomain (www.fortune-cookie.cc/ads.txt)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

HTTP_STATUS_WWW=$(curl -s -o /dev/null -w "%{http_code}" -L "$WWW_DOMAIN")
CONTENT_WWW=$(curl -s -L "$WWW_DOMAIN" | tr -d '\r\n' | xargs)

echo "URL: $WWW_DOMAIN"
echo "HTTP Status: $HTTP_STATUS_WWW"
echo "Content: $CONTENT_WWW"

if [ "$HTTP_STATUS_WWW" = "200" ] && [[ "$CONTENT_WWW" == *"$EXPECTED_CONTENT"* ]]; then
    echo -e "${GREEN}✅ WWW domain accessible${NC}"
else
    echo -e "${RED}❌ WWW domain issue${NC}"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Summary"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if [ "$HTTP_STATUS" = "200" ] && [ "$REDIRECT_DETECTED" = false ] && [[ "$CONTENT" == *"$EXPECTED_CONTENT"* ]]; then
    echo -e "${GREEN}✅ All tests passed!${NC}"
    echo -e "${GREEN}✅ ads.txt is correctly configured for AdSense${NC}"
    echo ""
    echo "Next steps:"
    echo "1. Wait 24-48 hours for Google to re-crawl"
    echo "2. Check AdSense console for ads.txt status"
    echo "3. Or manually trigger recheck in AdSense"
    exit 0
else
    echo -e "${RED}❌ Tests failed!${NC}"
    echo ""
    echo "Issues detected:"
    if [ "$HTTP_STATUS" != "200" ]; then
        echo "  - Root domain returns HTTP $HTTP_STATUS (should be 200)"
    fi
    if [ "$REDIRECT_DETECTED" = true ]; then
        echo "  - Root domain redirects (AdSense requires direct access)"
        echo ""
        echo "🔧 Fix required:"
        echo "   Go to Vercel Dashboard → Settings → Domains"
        echo "   Set 'fortune-cookie.cc' as Primary Domain"
        echo "   Or disable 'Redirect to www' option"
    fi
    if [[ "$CONTENT" != *"$EXPECTED_CONTENT"* ]]; then
        echo "  - Content does not match expected"
    fi
    echo ""
    echo "📖 See ADSENSE_FIX.md for detailed instructions"
    exit 1
fi

