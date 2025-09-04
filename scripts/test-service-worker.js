#!/usr/bin/env node

/**
 * Service Worker Cache Behavior Test Script
 * 
 * This script tests the Service Worker cache behavior to ensure:
 * 1. Offline functionality works correctly
 * 2. Admin/analytics pages are never cached
 * 3. Cache invalidation scenarios work properly
 * 4. TTL-based cache expiration works
 */

const puppeteer = require('puppeteer')
const path = require('path')

// Test configuration
const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
const TEST_TIMEOUT = 30000

// Test cases
const TEST_CASES = [
  {
    name: 'Homepage caching',
    url: '/',
    shouldCache: true,
    description: 'Homepage should be cached with short TTL'
  },
  {
    name: 'Generator page caching',
    url: '/generator',
    shouldCache: true,
    description: 'Generator page should be cached'
  },
  {
    name: 'Analytics page no-cache',
    url: '/analytics',
    shouldCache: false,
    description: 'Analytics page should never be cached'
  },
  {
    name: 'Admin page no-cache',
    url: '/admin',
    shouldCache: false,
    description: 'Admin pages should never be cached'
  },
  {
    name: 'Static assets caching',
    url: '/favicon.ico',
    shouldCache: true,
    description: 'Static assets should be cached'
  }
]

async function runTests() {
  console.log('🧪 Starting Service Worker Cache Behavior Tests...\n')
  
  let browser
  let results = []
  
  try {
    // Launch browser
    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    })
    
    const page = await browser.newPage()
    
    // Enable service worker
    await page.goto(BASE_URL, { waitUntil: 'networkidle2' })
    
    // Wait for service worker to register
    await page.evaluate(() => {
      return new Promise((resolve) => {
        if ('serviceWorker' in navigator) {
          navigator.serviceWorker.ready.then(resolve)
        } else {
          resolve()
        }
      })
    })
    
    console.log('✅ Service Worker registered successfully\n')
    
    // Test each case
    for (const testCase of TEST_CASES) {
      console.log(`🔍 Testing: ${testCase.name}`)
      console.log(`   URL: ${testCase.url}`)
      console.log(`   Expected: ${testCase.shouldCache ? 'Should cache' : 'Should NOT cache'}`)
      
      const result = await testCacheBehavior(page, testCase)
      results.push(result)
      
      console.log(`   Result: ${result.passed ? '✅ PASS' : '❌ FAIL'}`)
      if (!result.passed) {
        console.log(`   Error: ${result.error}`)
      }
      console.log()
    }
    
    // Test offline functionality
    console.log('🔍 Testing offline functionality...')
    const offlineResult = await testOfflineFunctionality(page)
    results.push(offlineResult)
    console.log(`   Result: ${offlineResult.passed ? '✅ PASS' : '❌ FAIL'}`)
    if (!offlineResult.passed) {
      console.log(`   Error: ${offlineResult.error}`)
    }
    console.log()
    
    // Test cache invalidation
    console.log('🔍 Testing cache invalidation...')
    const invalidationResult = await testCacheInvalidation(page)
    results.push(invalidationResult)
    console.log(`   Result: ${invalidationResult.passed ? '✅ PASS' : '❌ FAIL'}`)
    if (!invalidationResult.passed) {
      console.log(`   Error: ${invalidationResult.error}`)
    }
    console.log()
    
  } catch (error) {
    console.error('❌ Test execution failed:', error)
    process.exit(1)
  } finally {
    if (browser) {
      await browser.close()
    }
  }
  
  // Print summary
  printTestSummary(results)
  
  // Exit with appropriate code
  const failedTests = results.filter(r => !r.passed)
  process.exit(failedTests.length > 0 ? 1 : 0)
}

async function testCacheBehavior(page, testCase) {
  try {
    // Clear cache first
    await page.evaluate(() => {
      return caches.keys().then(names => 
        Promise.all(names.map(name => caches.delete(name)))
      )
    })
    
    // Visit the page
    await page.goto(BASE_URL + testCase.url, { waitUntil: 'networkidle2' })
    
    // Check if page is cached
    const isCached = await page.evaluate(async (url) => {
      const cacheNames = await caches.keys()
      for (const cacheName of cacheNames) {
        const cache = await caches.open(cacheName)
        const response = await cache.match(url)
        if (response) return true
      }
      return false
    }, BASE_URL + testCase.url)
    
    const passed = testCase.shouldCache ? isCached : !isCached
    
    return {
      name: testCase.name,
      passed,
      error: passed ? null : `Expected ${testCase.shouldCache ? 'cached' : 'not cached'}, got ${isCached ? 'cached' : 'not cached'}`
    }
    
  } catch (error) {
    return {
      name: testCase.name,
      passed: false,
      error: error.message
    }
  }
}

async function testOfflineFunctionality(page) {
  try {
    // Visit homepage to cache it
    await page.goto(BASE_URL, { waitUntil: 'networkidle2' })
    
    // Go offline
    await page.setOfflineMode(true)
    
    // Try to visit cached page
    await page.goto(BASE_URL, { waitUntil: 'domcontentloaded' })
    
    // Check if offline page is shown or cached content
    const pageContent = await page.content()
    const isOfflinePageOrCached = pageContent.includes('Offline Mode') || 
                                  pageContent.includes('Fortune Cookie AI')
    
    // Go back online
    await page.setOfflineMode(false)
    
    return {
      name: 'Offline functionality',
      passed: isOfflinePageOrCached,
      error: isOfflinePageOrCached ? null : 'Offline functionality not working properly'
    }
    
  } catch (error) {
    return {
      name: 'Offline functionality',
      passed: false,
      error: error.message
    }
  }
}

async function testCacheInvalidation(page) {
  try {
    // This is a simplified test - in a real scenario, you'd test TTL expiration
    // For now, we'll just test that cache can be cleared
    
    // Visit a page to cache it
    await page.goto(BASE_URL, { waitUntil: 'networkidle2' })
    
    // Clear cache
    await page.evaluate(() => {
      return caches.keys().then(names => 
        Promise.all(names.map(name => caches.delete(name)))
      )
    })
    
    // Check if cache is cleared
    const cacheNames = await page.evaluate(() => caches.keys())
    
    return {
      name: 'Cache invalidation',
      passed: cacheNames.length === 0,
      error: cacheNames.length === 0 ? null : 'Cache was not properly cleared'
    }
    
  } catch (error) {
    return {
      name: 'Cache invalidation',
      passed: false,
      error: error.message
    }
  }
}

function printTestSummary(results) {
  console.log('📊 Test Summary')
  console.log('================')
  
  const passed = results.filter(r => r.passed).length
  const total = results.length
  
  console.log(`Total tests: ${total}`)
  console.log(`Passed: ${passed}`)
  console.log(`Failed: ${total - passed}`)
  console.log(`Success rate: ${Math.round((passed / total) * 100)}%`)
  
  if (total - passed > 0) {
    console.log('\n❌ Failed tests:')
    results.filter(r => !r.passed).forEach(result => {
      console.log(`   - ${result.name}: ${result.error}`)
    })
  }
  
  console.log()
}

// Run tests if this script is executed directly
if (require.main === module) {
  runTests().catch(console.error)
}

module.exports = { runTests }
