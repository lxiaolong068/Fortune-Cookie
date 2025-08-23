#!/usr/bin/env node

/**
 * Fortune Cookie AI - OpenRouter API Key Validation Script
 * 
 * This script tests the OpenRouter API key functionality
 * to ensure AI features are working correctly.
 */

const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

// Configuration
const BASE_URL = process.env.TEST_URL || 'http://localhost:3000';
const TIMEOUT = 15000; // 15 seconds for AI requests

// Load environment variables from .env.local
function loadEnvFile() {
  const envPath = path.join(process.cwd(), '.env.local');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    const lines = envContent.split('\n');
    
    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith('#')) {
        const [key, ...valueParts] = trimmed.split('=');
        if (key && valueParts.length > 0) {
          process.env[key.trim()] = valueParts.join('=').trim();
        }
      }
    }
  }
}

// Load environment variables
loadEnvFile();

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
    const result = await testFn();
    console.log(`✅ PASSED: ${name}`);
    if (result && result.details) {
      console.log(`   📋 Details: ${result.details}`);
    }
    testResults.passed++;
    testResults.tests.push({ name, status: 'PASSED', details: result?.details });
  } catch (error) {
    console.log(`❌ FAILED: ${name} - ${error.message}`);
    testResults.failed++;
    testResults.tests.push({ name, status: 'FAILED', error: error.message });
  }
}

// Test cases
async function testEnvironmentVariables() {
  const apiKey = process.env.OPENROUTER_API_KEY;
  const baseUrl = process.env.OPENROUTER_BASE_URL;
  
  if (!apiKey) {
    throw new Error('OPENROUTER_API_KEY not found in environment variables');
  }
  
  if (!apiKey.startsWith('sk-or-v1-')) {
    throw new Error('OPENROUTER_API_KEY does not have the expected format (should start with sk-or-v1-)');
  }
  
  if (!baseUrl) {
    throw new Error('OPENROUTER_BASE_URL not found in environment variables');
  }
  
  return {
    details: `API Key: ${apiKey.substring(0, 15)}..., Base URL: ${baseUrl}`
  };
}

async function testOpenRouterDirectAPI() {
  const apiKey = process.env.OPENROUTER_API_KEY;
  const baseUrl = process.env.OPENROUTER_BASE_URL || 'https://openrouter.ai/api/v1';
  
  if (!apiKey) {
    throw new Error('OPENROUTER_API_KEY not configured');
  }
  
  // Test the models endpoint to verify API key validity
  const response = await makeRequest(`${baseUrl}/models`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    }
  });
  
  if (response.statusCode === 401) {
    throw new Error('API key is invalid or expired');
  }
  
  if (response.statusCode !== 200) {
    throw new Error(`OpenRouter API returned status ${response.statusCode}: ${response.data}`);
  }
  
  let models;
  try {
    models = JSON.parse(response.data);
  } catch (e) {
    throw new Error('Invalid JSON response from OpenRouter API');
  }
  
  if (!models.data || !Array.isArray(models.data)) {
    throw new Error('Unexpected response format from OpenRouter API');
  }
  
  return {
    details: `API key valid, ${models.data.length} models available`
  };
}

async function testFortuneAPIHealthCheck() {
  const response = await makeRequest(`${BASE_URL}/api/fortune`, {
    method: 'GET'
  });
  
  if (response.statusCode !== 200) {
    throw new Error(`Fortune API health check returned status ${response.statusCode}`);
  }
  
  let healthData;
  try {
    healthData = JSON.parse(response.data);
  } catch (e) {
    throw new Error('Invalid JSON response from Fortune API health check');
  }
  
  if (healthData.status !== 'ok') {
    throw new Error(`Fortune API health check failed: ${healthData.message || 'Unknown error'}`);
  }
  
  return {
    details: `AI Enabled: ${healthData.aiEnabled}, Status: ${healthData.status}`
  };
}

async function testFortuneGeneration() {
  const testThemes = ['inspirational', 'funny', 'wisdom'];
  const results = [];
  
  for (const theme of testThemes) {
    const response = await makeRequest(`${BASE_URL}/api/fortune`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 
        theme: theme,
        mood: 'positive',
        length: 'medium'
      })
    });
    
    if (response.statusCode !== 200) {
      throw new Error(`Fortune generation for theme '${theme}' returned status ${response.statusCode}: ${response.data}`);
    }
    
    let fortune;
    try {
      fortune = JSON.parse(response.data);
    } catch (e) {
      throw new Error(`Invalid JSON response for theme '${theme}': ${response.data}`);
    }
    
    if (!fortune.message || !fortune.luckyNumbers || !fortune.theme) {
      throw new Error(`Incomplete fortune response for theme '${theme}': missing required fields`);
    }
    
    if (fortune.message.length < 10) {
      throw new Error(`Fortune message too short for theme '${theme}': ${fortune.message}`);
    }
    
    if (!Array.isArray(fortune.luckyNumbers) || fortune.luckyNumbers.length !== 6) {
      throw new Error(`Invalid lucky numbers for theme '${theme}': expected 6 numbers`);
    }
    
    results.push({
      theme: theme,
      messageLength: fortune.message.length,
      hasLuckyNumbers: fortune.luckyNumbers.length === 6
    });
  }
  
  return {
    details: `Generated ${results.length} fortunes successfully: ${results.map(r => `${r.theme}(${r.messageLength} chars)`).join(', ')}`
  };
}

async function testRateLimiting() {
  // Make multiple rapid requests to test rate limiting
  const requests = [];
  for (let i = 0; i < 3; i++) {
    requests.push(
      makeRequest(`${BASE_URL}/api/fortune`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ theme: 'random' })
      })
    );
  }
  
  const responses = await Promise.all(requests);
  
  // All should succeed (rate limit is generous for testing)
  for (let i = 0; i < responses.length; i++) {
    if (responses[i].statusCode !== 200) {
      throw new Error(`Request ${i + 1} failed with status ${responses[i].statusCode}`);
    }
  }
  
  return {
    details: `Made ${requests.length} concurrent requests successfully`
  };
}

// Main test runner
async function runAllTests() {
  console.log('🤖 Starting OpenRouter API Key Validation Tests');
  console.log(`📍 Testing URL: ${BASE_URL}`);
  console.log('🔑 API Key: ' + (process.env.OPENROUTER_API_KEY ? process.env.OPENROUTER_API_KEY.substring(0, 15) + '...' : 'NOT SET'));
  console.log('=' .repeat(60));

  // Environment tests
  await runTest('Environment Variables Check', testEnvironmentVariables);
  
  // Direct OpenRouter API tests
  await runTest('OpenRouter API Direct Connection', testOpenRouterDirectAPI);
  
  // Local API tests
  await runTest('Fortune API Health Check', testFortuneAPIHealthCheck);
  await runTest('Fortune Generation Test', testFortuneGeneration);
  await runTest('Rate Limiting Test', testRateLimiting);

  // Print results
  console.log('=' .repeat(60));
  console.log('📊 OpenRouter API Test Results:');
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
    
    console.log('\n💡 Troubleshooting Tips:');
    console.log('  1. Verify your OPENROUTER_API_KEY is correct in .env.local');
    console.log('  2. Check your OpenRouter account balance at https://openrouter.ai/');
    console.log('  3. Ensure the development server is running (npm run dev)');
    console.log('  4. Check network connectivity to openrouter.ai');
    
    process.exit(1);
  } else {
    console.log('\n🎉 All OpenRouter API tests passed! Your API key is working correctly.');
    console.log('\n📋 Summary:');
    testResults.tests
      .filter(test => test.status === 'PASSED' && test.details)
      .forEach(test => {
        console.log(`  ✅ ${test.name}: ${test.details}`);
      });
    process.exit(0);
  }
}

// Run tests
runAllTests().catch(error => {
  console.error('💥 Test runner failed:', error.message);
  process.exit(1);
});
