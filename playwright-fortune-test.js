const { chromium } = require('playwright');

async function testFortuneGenerator() {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  // Arrays to store collected data
  const consoleMessages = [];
  const networkRequests = [];
  const errors = [];

  // Listen to console messages
  page.on('console', msg => {
    const msgData = {
      type: msg.type(),
      text: msg.text(),
      timestamp: new Date().toISOString()
    };
    consoleMessages.push(msgData);
    console.log(`[CONSOLE ${msg.type().toUpperCase()}] ${msg.text()}`);
  });

  // Listen to network requests
  page.on('request', request => {
    const reqData = {
      url: request.url(),
      method: request.method(),
      timestamp: new Date().toISOString()
    };
    networkRequests.push(reqData);

    if (request.url().includes('api/fortune') || request.url().includes('openrouter')) {
      console.log(`[NETWORK REQUEST] ${request.method()} ${request.url()}`);
    }
  });

  // Listen to network responses
  page.on('response', response => {
    if (response.url().includes('api/fortune') || response.url().includes('openrouter')) {
      console.log(`[NETWORK RESPONSE] ${response.status()} ${response.url()}`);
    }
  });

  // Listen to page errors
  page.on('pageerror', error => {
    const errorData = {
      message: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString()
    };
    errors.push(errorData);
    console.log(`[PAGE ERROR] ${error.message}`);
  });

  try {
    console.log('🚀 Starting Fortune Generator Tests...');

    // 1. Navigate to generator page
    console.log('\n📍 Step 1: Navigating to http://localhost:3000/generator');
    await page.goto('http://localhost:3000/generator', { waitUntil: 'networkidle' });

    // Wait for page to fully load
    await page.waitForTimeout(2000);

    // Take screenshot of initial page
    await page.screenshot({
      path: '/Users/brucelee/Documents/seo/Fortune Cookie/screenshots/generator-initial.png',
      fullPage: true
    });
    console.log('📸 Initial screenshot captured');

    // 2. Analyze page structure
    console.log('\n🔍 Step 2: Analyzing page structure');

    // Look for generate button
    const generateButton = await page.locator('button:has-text("Generate"), button[data-testid*="generate"], .generate-btn, [role="button"]:has-text("Generate")').first();
    const generateButtonExists = await generateButton.count() > 0;
    console.log(`Generate button found: ${generateButtonExists}`);

    // Look for theme selectors
    const themeSelectors = await page.locator('select, [role="combobox"], .theme-selector, [data-testid*="theme"]').count();
    console.log(`Theme selector elements found: ${themeSelectors}`);

    // Check for fortune display area
    const fortuneDisplay = await page.locator('.fortune-display, [data-testid*="fortune"], .fortune-text, .message').count();
    console.log(`Fortune display areas found: ${fortuneDisplay}`);

    if (!generateButtonExists) {
      // Try to find any clickable elements that might generate fortunes
      const clickableElements = await page.locator('button, [role="button"], .btn, [data-testid*="click"]').all();
      console.log(`Found ${clickableElements.length} clickable elements to investigate`);

      for (let i = 0; i < Math.min(clickableElements.length, 5); i++) {
        const text = await clickableElements[i].textContent();
        console.log(`  - Clickable element ${i+1}: "${text}"`);
      }
    }

    // 3. Test fortune generation
    console.log('\n🎲 Step 3: Testing fortune generation');

    if (generateButtonExists) {
      console.log('Clicking generate button...');
      await generateButton.click();

      // Wait for network activity and DOM changes
      await page.waitForTimeout(3000);

      // Take screenshot after generation attempt
      await page.screenshot({
        path: '/Users/brucelee/Documents/seo/Fortune Cookie/screenshots/generator-after-click.png',
        fullPage: true
      });
      console.log('📸 Post-generation screenshot captured');

    } else {
      console.log('⚠️  No obvious generate button found, trying alternative approaches...');

      // Try clicking on the page center (might be a card-based UI)
      await page.click('body', { position: { x: 400, y: 400 } });
      await page.waitForTimeout(2000);

      // Or try pressing Enter/Space
      await page.keyboard.press('Enter');
      await page.waitForTimeout(1000);
    }

    // 4. Check for theme selection functionality
    console.log('\n🎨 Step 4: Testing theme functionality');

    const themeDropdown = await page.locator('select, [role="combobox"]').first();
    if (await themeDropdown.count() > 0) {
      console.log('Theme dropdown found, testing theme changes...');

      // Get available options
      const options = await page.locator('select option, [role="option"]').allTextContents();
      console.log(`Available themes: ${options.join(', ')}`);

      // Test different themes if available
      for (let i = 0; i < Math.min(options.length, 3); i++) {
        if (options[i] && options[i].trim()) {
          console.log(`Testing theme: ${options[i]}`);
          await themeDropdown.selectOption({ label: options[i] });
          await page.waitForTimeout(1000);

          // Try generating with this theme
          if (generateButtonExists) {
            await generateButton.click();
            await page.waitForTimeout(2000);
          }
        }
      }
    } else {
      console.log('No theme dropdown found, checking for theme buttons...');
      const themeButtons = await page.locator('[data-theme], .theme-btn, button:has-text("theme")').count();
      console.log(`Theme buttons found: ${themeButtons}`);
    }

    // 5. Test multiple generations
    console.log('\n🔄 Step 5: Testing multiple generations');

    for (let i = 1; i <= 3; i++) {
      console.log(`Generation attempt ${i}...`);
      if (generateButtonExists) {
        await generateButton.click();
      } else {
        // Try alternative interaction
        await page.keyboard.press('Space');
      }
      await page.waitForTimeout(2000);
    }

    // 6. Check for displayed fortunes
    console.log('\n📝 Step 6: Checking generated fortunes');

    const fortuneTexts = await page.locator('.fortune-text, .message, [data-testid*="fortune"], .fortune-content').allTextContents();
    if (fortuneTexts.length > 0) {
      console.log('🎉 Fortunes found:');
      fortuneTexts.slice(0, 3).forEach((text, index) => {
        if (text && text.trim().length > 10) {
          console.log(`  ${index + 1}. "${text.trim().substring(0, 100)}${text.length > 100 ? '...' : ''}"`);
        }
      });
    } else {
      console.log('⚠️  No fortune text found in expected selectors');
      // Try broader search
      const allText = await page.locator('p, div, span').allTextContents();
      const potentialFortunes = allText.filter(text =>
        text && text.trim().length > 20 && text.trim().length < 500
      ).slice(0, 3);

      if (potentialFortunes.length > 0) {
        console.log('Potential fortune content found:');
        potentialFortunes.forEach((text, index) => {
          console.log(`  ${index + 1}. "${text.trim().substring(0, 100)}..."`);
        });
      }
    }

    // 7. Final screenshot
    await page.screenshot({
      path: '/Users/brucelee/Documents/seo/Fortune Cookie/screenshots/generator-final.png',
      fullPage: true
    });
    console.log('📸 Final screenshot captured');

    // 8. Analyze collected data
    console.log('\n📊 Test Results Summary:');
    console.log(`Console messages: ${consoleMessages.length}`);
    console.log(`Network requests: ${networkRequests.length}`);
    console.log(`Page errors: ${errors.length}`);

    // Check for API calls
    const apiRequests = networkRequests.filter(req =>
      req.url.includes('/api/fortune') || req.url.includes('openrouter')
    );
    console.log(`API fortune requests: ${apiRequests.length}`);

    // Check for errors
    if (errors.length > 0) {
      console.log('\n❌ Errors detected:');
      errors.forEach((error, index) => {
        console.log(`  ${index + 1}. ${error.message}`);
      });
    }

    // Check console warnings/errors
    const consoleErrors = consoleMessages.filter(msg =>
      msg.type === 'error' || msg.type === 'warning'
    );
    if (consoleErrors.length > 0) {
      console.log('\n⚠️  Console issues:');
      consoleErrors.forEach((msg, index) => {
        console.log(`  ${index + 1}. [${msg.type.toUpperCase()}] ${msg.text}`);
      });
    }

    console.log('\n✅ Fortune Generator testing completed!');

  } catch (error) {
    console.error('❌ Test execution failed:', error.message);

    // Take error screenshot
    await page.screenshot({
      path: '/Users/brucelee/Documents/seo/Fortune Cookie/screenshots/generator-error.png',
      fullPage: true
    });

  } finally {
    await browser.close();

    // Save detailed results to file
    const results = {
      timestamp: new Date().toISOString(),
      consoleMessages,
      networkRequests,
      errors,
      apiRequests: networkRequests.filter(req =>
        req.url.includes('/api/fortune') || req.url.includes('openrouter')
      )
    };

    require('fs').writeFileSync(
      '/Users/brucelee/Documents/seo/Fortune Cookie/test-results.json',
      JSON.stringify(results, null, 2)
    );

    console.log('\n📄 Detailed results saved to test-results.json');
  }
}

// Run the test
testFortuneGenerator().catch(console.error);
