const { chromium } = require('playwright');

async function testFortuneGeneration() {
  const browser = await chromium.launch({ headless: false, slowMo: 500 });
  const context = await browser.newContext();
  const page = await context.newPage();

  // Collections for monitoring
  const consoleMessages = [];
  const networkRequests = [];
  const apiResponses = [];
  const errors = [];

  // Enhanced monitoring
  page.on('console', msg => {
    const msgData = {
      type: msg.type(),
      text: msg.text(),
      timestamp: new Date().toISOString()
    };
    consoleMessages.push(msgData);
    console.log(`[CONSOLE ${msg.type().toUpperCase()}] ${msg.text()}`);
  });

  page.on('request', request => {
    const reqData = {
      url: request.url(),
      method: request.method(),
      timestamp: new Date().toISOString(),
      postData: request.postData()
    };
    networkRequests.push(reqData);

    if (request.url().includes('/api/fortune')) {
      console.log(`[FORTUNE API REQUEST] ${request.method()} ${request.url()}`);
      if (request.postData()) {
        console.log(`[FORTUNE REQUEST DATA] ${request.postData()}`);
      }
    }
  });

  page.on('response', async response => {
    if (response.url().includes('/api/fortune')) {
      console.log(`[FORTUNE API RESPONSE] ${response.status()} ${response.url()}`);
      try {
        const responseText = await response.text();
        const responseData = {
          url: response.url(),
          status: response.status(),
          body: responseText,
          timestamp: new Date().toISOString()
        };
        apiResponses.push(responseData);
        console.log(`[FORTUNE RESPONSE BODY] ${responseText}`);
      } catch (e) {
        console.log(`[FORTUNE RESPONSE] Could not read response body: ${e.message}`);
      }
    }
  });

  page.on('pageerror', error => {
    errors.push({
      message: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString()
    });
    console.log(`[PAGE ERROR] ${error.message}`);
  });

  try {
    console.log('🍪 Starting Fortune Generation Test...');

    // 1. Navigate to generator
    console.log('\n1️⃣ Navigating to fortune generator...');
    await page.goto('http://localhost:3000/generator', { waitUntil: 'networkidle' });
    await page.waitForTimeout(3000);

    await page.screenshot({
      path: '/Users/brucelee/Documents/seo/Fortune Cookie/screenshots/fortune-test-start.png',
      fullPage: true
    });
    console.log('📸 Initial page screenshot captured');

    // 2. Look for the fortune cookie element
    console.log('\n2️⃣ Locating fortune cookie...');

    // Wait for the cookie to be visible and clickable
    const cookieSelector = '.cursor-pointer, [data-testid*="cookie"], .fortune-cookie';

    // Try multiple selectors to find the clickable cookie
    const potentialSelectors = [
      '.cursor-pointer.mb-8.relative', // Based on the component code
      '[onclick]',
      '.cursor-pointer',
      'div[class*="cursor-pointer"]',
      'div[class*="cookie"]'
    ];

    let cookieElement = null;
    for (const selector of potentialSelectors) {
      const elements = await page.locator(selector).count();
      if (elements > 0) {
        console.log(`Found ${elements} elements with selector: ${selector}`);
        cookieElement = page.locator(selector).first();
        break;
      }
    }

    if (!cookieElement) {
      console.log('No obvious cookie element found, trying to click on the center area...');
      // Find the main container and click in its center
      const mainContainer = page.locator('.flex.flex-col.items-center.justify-center.min-h-screen');
      cookieElement = mainContainer;
    }

    // 3. Test different theme selections
    console.log('\n3️⃣ Testing theme selection...');

    // Check if theme selector is available
    const themeSelector = page.locator('select, [role="combobox"]').first();
    const hasThemeSelector = await themeSelector.count() > 0;

    if (hasThemeSelector) {
      console.log('Theme selector found, testing different themes...');

      const themes = ['funny', 'inspirational', 'love', 'success', 'wisdom', 'random'];

      for (let i = 0; i < 3; i++) { // Test first 3 themes
        const theme = themes[i];
        console.log(`\n--- Testing ${theme} theme ---`);

        try {
          // Click on theme selector
          await themeSelector.click();
          await page.waitForTimeout(500);

          // Select theme
          const themeOption = page.locator(`[value="${theme}"], text=${theme}`, { hasText: new RegExp(theme, 'i') }).first();
          if (await themeOption.count() > 0) {
            await themeOption.click();
            console.log(`Selected theme: ${theme}`);
          }
          await page.waitForTimeout(500);

          // Generate fortune
          console.log('Clicking fortune cookie...');
          await cookieElement.click();

          // Wait for API call and response
          await page.waitForTimeout(5000); // Wait for cracking animation + API response

          // Take screenshot of result
          await page.screenshot({
            path: `/Users/brucelee/Documents/seo/Fortune Cookie/screenshots/fortune-${theme}.png`,
            fullPage: true
          });

          // Check for fortune content
          const fortuneText = await page.locator('.text-gray-700.mb-6.italic, blockquote, .fortune-text').first().textContent();
          if (fortuneText) {
            console.log(`✅ Fortune generated: "${fortuneText.substring(0, 80)}..."`);
          } else {
            console.log('⚠️  No fortune text found in expected locations');
          }

          // Check for lucky numbers
          const luckyNumbers = await page.locator('.w-10.h-10.bg-gradient-to-br, .lucky-number').allTextContents();
          if (luckyNumbers.length > 0) {
            console.log(`🍀 Lucky numbers: ${luckyNumbers.join(', ')}`);
          }

          // Get new fortune for next test
          const newFortuneButton = page.locator('button:has-text("Generate Another Fortune"), button:has-text("New Fortune")').first();
          if (await newFortuneButton.count() > 0) {
            await newFortuneButton.click();
            await page.waitForTimeout(2000);
          }

        } catch (error) {
          console.log(`❌ Error testing ${theme} theme: ${error.message}`);
        }
      }
    } else {
      console.log('No theme selector found, testing default fortune generation...');

      // Test multiple fortune generations
      for (let i = 1; i <= 3; i++) {
        console.log(`\n--- Fortune Generation ${i} ---`);

        console.log('Clicking fortune cookie...');
        await cookieElement.click();

        // Wait for generation process
        await page.waitForTimeout(5000);

        // Capture result
        await page.screenshot({
          path: `/Users/brucelee/Documents/seo/Fortune Cookie/screenshots/fortune-generation-${i}.png`,
          fullPage: true
        });

        // Check result
        const fortuneText = await page.locator('.text-gray-700.mb-6.italic, blockquote, .fortune-text').first().textContent();
        if (fortuneText) {
          console.log(`✅ Fortune ${i}: "${fortuneText.substring(0, 80)}..."`);
        }

        // Get new fortune
        const newFortuneButton = page.locator('button:has-text("Generate Another Fortune"), button:has-text("New Fortune")').first();
        if (await newFortuneButton.count() > 0) {
          await newFortuneButton.click();
          await page.waitForTimeout(2000);
        }
      }
    }

    // 4. Test custom prompt functionality
    console.log('\n4️⃣ Testing custom prompt functionality...');

    const customizeButton = page.locator('button:has-text("Customize")').first();
    if (await customizeButton.count() > 0) {
      console.log('Found customize button, testing custom prompts...');

      await customizeButton.click();
      await page.waitForTimeout(1000);

      const textarea = page.locator('textarea').first();
      if (await textarea.count() > 0) {
        const customPrompt = "Generate a fortune about coding and technology";
        await textarea.fill(customPrompt);
        console.log(`Entered custom prompt: "${customPrompt}"`);

        // Generate fortune with custom prompt
        await cookieElement.click();
        await page.waitForTimeout(5000);

        await page.screenshot({
          path: '/Users/brucelee/Documents/seo/Fortune Cookie/screenshots/fortune-custom-prompt.png',
          fullPage: true
        });

        const customFortune = await page.locator('.text-gray-700.mb-6.italic, blockquote').first().textContent();
        if (customFortune) {
          console.log(`✅ Custom fortune: "${customFortune.substring(0, 80)}..."`);
        }
      }
    }

    // 5. Test AI service fallback behavior
    console.log('\n5️⃣ Testing fallback behavior...');

    // This would require intercepting network requests to simulate AI service failure
    // For now, let's just observe if there are any fallback mechanisms in place

    console.log('Monitoring for fallback scenarios in console and network logs...');

    // Final summary
    console.log('\n6️⃣ Test Summary:');

    const fortuneApiCalls = networkRequests.filter(req => req.url.includes('/api/fortune'));
    const successfulResponses = apiResponses.filter(res => res.status === 200);
    const failedResponses = apiResponses.filter(res => res.status !== 200);

    console.log(`Total API calls to /api/fortune: ${fortuneApiCalls.length}`);
    console.log(`Successful responses: ${successfulResponses.length}`);
    console.log(`Failed responses: ${failedResponses.length}`);
    console.log(`Console errors: ${errors.length}`);

    // Check for AI integration indicators
    const hasOpenRouterCalls = networkRequests.some(req => req.url.includes('openrouter'));
    const hasAIIndicators = consoleMessages.some(msg =>
      msg.text.includes('AI') || msg.text.includes('generating') || msg.text.includes('OpenRouter')
    );

    console.log(`OpenRouter API calls detected: ${hasOpenRouterCalls}`);
    console.log(`AI-related console messages: ${hasAIIndicators}`);

    // Analyze API responses
    if (successfulResponses.length > 0) {
      console.log('\n📋 Sample API Response Analysis:');
      const sampleResponse = successfulResponses[0];
      try {
        const responseObj = JSON.parse(sampleResponse.body);
        console.log(`- Message length: ${responseObj.message?.length || 0} characters`);
        console.log(`- Lucky numbers: ${responseObj.luckyNumbers?.length || 0} numbers`);
        console.log(`- Theme: ${responseObj.theme || 'unknown'}`);
        console.log(`- Source: ${responseObj.source || 'ai'}`);
      } catch (e) {
        console.log('- Could not parse response JSON');
      }
    }

    console.log('\n✅ Fortune Generation Test Completed!');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error('Stack trace:', error.stack);

    await page.screenshot({
      path: '/Users/brucelee/Documents/seo/Fortune Cookie/screenshots/fortune-test-error.png',
      fullPage: true
    });
  } finally {
    await browser.close();

    // Save comprehensive test results
    const results = {
      timestamp: new Date().toISOString(),
      summary: {
        totalAPIRequests: networkRequests.filter(req => req.url.includes('/api/fortune')).length,
        successfulResponses: apiResponses.filter(res => res.status === 200).length,
        errors: errors.length,
        consoleMessages: consoleMessages.length
      },
      consoleMessages,
      networkRequests: networkRequests.filter(req => req.url.includes('/api/')),
      apiResponses,
      errors
    };

    require('fs').writeFileSync(
      '/Users/brucelee/Documents/seo/Fortune Cookie/fortune-generation-test-results.json',
      JSON.stringify(results, null, 2)
    );

    console.log('\n📄 Test results saved to fortune-generation-test-results.json');
  }
}

testFortuneGeneration().catch(console.error);
