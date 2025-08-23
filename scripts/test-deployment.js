#!/usr/bin/env node

/**
 * Fortune Cookie AI - Deployment Test Script
 * 
 * This script tests all major functionality after deployment
 * to ensure everything is working correctly.
 */

const https = require('https');
const http = require('http');

// Configuration
const BASE_URL = process.env.TEST_URL || 'http://localhost:3000';
const TIMEOUT = 10000; // 10 seconds

// Test results
let testResults = {
  passed: 0,
  failed: 0,
  tests: []
};

// Utility function to make HTTP requests
function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;
    const urlObj = new URL(url);

    const timeout = setTimeout(() => {
      reject(new Error('Request timeout'));
    }, TIMEOUT);

    const requestOptions = {
      hostname: urlObj.hostname,
      port: urlObj.port,
      path: urlObj.pathname + urlObj.search,
      method: options.method || 'GET',
      headers: options.headers || {}
    };

    const req = protocol.request(requestOptions, (res) => {
      clearTimeout(timeout);
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          data: data
        });
      });
    });

    req.on('error', (err) => {
      clearTimeout(timeout);
      reject(err);
    });

    // Write POST data if provided
    if (options.body) {
      req.write(options.body);
    }

    req.end();
  });
}

// Test function wrapper
async function runTest(name, testFn) {
  console.log(`🧪 Testing: ${name}`);
  try {
    await testFn();
    console.log(`✅ PASSED: ${name}`);
    testResults.passed++;
    testResults.tests.push({ name, status: 'PASSED' });
  } catch (error) {
    console.log(`❌ FAILED: ${name} - ${error.message}`);
    testResults.failed++;
    testResults.tests.push({ name, status: 'FAILED', error: error.message });
  }
}

// Test cases
async function testHomePage() {
  const response = await makeRequest(`${BASE_URL}/`);
  if (response.statusCode !== 200) {
    throw new Error(`Expected status 200, got ${response.statusCode}`);
  }
  if (!response.data.includes('Fortune Cookie')) {
    throw new Error('Home page does not contain expected content');
  }
}

async function testGeneratorPage() {
  const response = await makeRequest(`${BASE_URL}/generator`);
  if (response.statusCode !== 200) {
    throw new Error(`Expected status 200, got ${response.statusCode}`);
  }
  if (!response.data.includes('AI Generator')) {
    throw new Error('Generator page does not contain expected content');
  }
}

async function testMessagesPage() {
  const response = await makeRequest(`${BASE_URL}/messages`);
  if (response.statusCode !== 200) {
    throw new Error(`Expected status 200, got ${response.statusCode}`);
  }
  if (!response.data.includes('Fortune Cookie Messages')) {
    throw new Error('Messages page does not contain expected content');
  }
}

async function testHistoryPage() {
  const response = await makeRequest(`${BASE_URL}/history`);
  if (response.statusCode !== 200) {
    throw new Error(`Expected status 200, got ${response.statusCode}`);
  }
  if (!response.data.includes('History of Fortune Cookies')) {
    throw new Error('History page does not contain expected content');
  }
}

async function testRecipesPage() {
  const response = await makeRequest(`${BASE_URL}/recipes`);
  if (response.statusCode !== 200) {
    throw new Error(`Expected status 200, got ${response.statusCode}`);
  }
  if (!response.data.includes('Fortune Cookie Recipes')) {
    throw new Error('Recipes page does not contain expected content');
  }
}

async function testBrowsePage() {
  const response = await makeRequest(`${BASE_URL}/browse`);
  if (response.statusCode !== 200) {
    throw new Error(`Expected status 200, got ${response.statusCode}`);
  }
  if (!response.data.includes('Browse Fortune Messages')) {
    throw new Error('Browse page does not contain expected content');
  }
}

async function testSEOPages() {
  const seoPages = [
    '/who-invented-fortune-cookies',
    '/how-to-make-fortune-cookies',
    '/funny-fortune-cookie-messages'
  ];

  for (const page of seoPages) {
    const response = await makeRequest(`${BASE_URL}${page}`);
    if (response.statusCode !== 200) {
      throw new Error(`SEO page ${page} returned status ${response.statusCode}`);
    }
  }
}

async function testAPIEndpoints() {
  // Test fortune generation API
  const fortuneResponse = await makeRequest(`${BASE_URL}/api/fortune`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ theme: 'inspirational' })
  });

  if (fortuneResponse.statusCode !== 200) {
    throw new Error(`Fortune API returned status ${fortuneResponse.statusCode}`);
  }

  // Test fortunes database API
  const fortunesResponse = await makeRequest(`${BASE_URL}/api/fortunes`);
  if (fortunesResponse.statusCode !== 200) {
    throw new Error(`Fortunes API returned status ${fortunesResponse.statusCode}`);
  }

  // Test analytics dashboard API
  const analyticsResponse = await makeRequest(`${BASE_URL}/api/analytics/dashboard`);
  if (analyticsResponse.statusCode !== 200) {
    throw new Error(`Analytics API returned status ${analyticsResponse.statusCode}`);
  }
}

async function testSEOInfrastructure() {
  // Test sitemap
  const sitemapResponse = await makeRequest(`${BASE_URL}/sitemap.xml`);
  if (sitemapResponse.statusCode !== 200) {
    throw new Error(`Sitemap returned status ${sitemapResponse.statusCode}`);
  }

  // Test robots.txt
  const robotsResponse = await makeRequest(`${BASE_URL}/robots.txt`);
  if (robotsResponse.statusCode !== 200) {
    throw new Error(`Robots.txt returned status ${robotsResponse.statusCode}`);
  }

  // Test manifest (Next.js generates it at /site.webmanifest)
  const manifestResponse = await makeRequest(`${BASE_URL}/site.webmanifest`);
  if (manifestResponse.statusCode !== 200) {
    throw new Error(`Manifest returned status ${manifestResponse.statusCode}`);
  }
}

async function testMetaTags() {
  const response = await makeRequest(`${BASE_URL}/`);
  const html = response.data;

  // Check for essential meta tags
  const requiredTags = [
    '<meta name="description"',
    '<meta property="og:title"',
    '<meta property="og:description"',
    '<meta name="twitter:card"',
    '<title>'
  ];

  for (const tag of requiredTags) {
    if (!html.includes(tag)) {
      throw new Error(`Missing required meta tag: ${tag}`);
    }
  }
}

async function testStructuredData() {
  const response = await makeRequest(`${BASE_URL}/`);
  const html = response.data;

  if (!html.includes('application/ld+json')) {
    throw new Error('No structured data found on home page');
  }

  if (!html.includes('@type')) {
    throw new Error('Invalid structured data format');
  }
}

// Main test runner
async function runAllTests() {
  console.log('🚀 Starting Fortune Cookie AI Deployment Tests');
  console.log(`📍 Testing URL: ${BASE_URL}`);
  console.log('=' .repeat(50));

  // Core page tests
  await runTest('Home Page', testHomePage);
  await runTest('Generator Page', testGeneratorPage);
  await runTest('Messages Page', testMessagesPage);
  await runTest('History Page', testHistoryPage);
  await runTest('Recipes Page', testRecipesPage);
  await runTest('Browse Page', testBrowsePage);

  // SEO page tests
  await runTest('SEO Pages', testSEOPages);

  // API tests
  await runTest('API Endpoints', testAPIEndpoints);

  // SEO infrastructure tests
  await runTest('SEO Infrastructure', testSEOInfrastructure);
  await runTest('Meta Tags', testMetaTags);
  await runTest('Structured Data', testStructuredData);

  // Print results
  console.log('=' .repeat(50));
  console.log('📊 Test Results Summary:');
  console.log(`✅ Passed: ${testResults.passed}`);
  console.log(`❌ Failed: ${testResults.failed}`);
  console.log(`📈 Success Rate: ${Math.round((testResults.passed / (testResults.passed + testResults.failed)) * 100)}%`);

  if (testResults.failed > 0) {
    console.log('\n❌ Failed Tests:');
    testResults.tests
      .filter(test => test.status === 'FAILED')
      .forEach(test => {
        console.log(`  - ${test.name}: ${test.error}`);
      });
    process.exit(1);
  } else {
    console.log('\n🎉 All tests passed! Deployment is ready for production.');
    process.exit(0);
  }
}

// Run tests
runAllTests().catch(error => {
  console.error('💥 Test runner failed:', error.message);
  process.exit(1);
});
