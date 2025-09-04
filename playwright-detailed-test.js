const { chromium } = require('playwright');

async function detailedFortuneTest() {
  const browser = await chromium.launch({ headless: false, slowMo: 1000 });
  const context = await browser.newContext();
  const page = await context.newPage();

  // Collections for monitoring
  const consoleMessages = [];
  const networkRequests = [];
  const errors = [];

  // Enhanced logging
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
    networkRequests.push({
      url: request.url(),
      method: request.method(),
      timestamp: new Date().toISOString()
    });

    if (request.url().includes('api/') || request.url().includes('openrouter')) {
      console.log(`[API REQUEST] ${request.method()} ${request.url()}`);
    }
  });

  page.on('response', async response => {
    if (response.url().includes('api/') || response.url().includes('openrouter')) {
      console.log(`[API RESPONSE] ${response.status()} ${response.url()}`);
      try {
        const responseText = await response.text();
        console.log(`[API RESPONSE BODY] ${responseText.substring(0, 200)}...`);
      } catch (e) {
        console.log(`[API RESPONSE] Could not read response body`);
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
    console.log('🧪 Starting Detailed Fortune Generator Analysis...');

    // Navigate to the generator page
    console.log('\n1️⃣ Navigating to generator page...');
    await page.goto('http://localhost:3000/generator', { waitUntil: 'networkidle' });

    // Wait for React to load
    await page.waitForTimeout(3000);

    // Take initial screenshot
    await page.screenshot({
      path: '/Users/brucelee/Documents/seo/Fortune Cookie/screenshots/detailed-initial.png',
      fullPage: true
    });

    // Analyze the page DOM structure
    console.log('\n2️⃣ Analyzing page DOM structure...');

    // Get page title and URL
    const title = await page.title();
    const url = await page.url();
    console.log(`Page title: ${title}`);
    console.log(`Current URL: ${url}`);

    // Look for all interactive elements
    const interactiveElements = await page.evaluate(() => {
      const elements = [];

      // Find buttons
      const buttons = Array.from(document.querySelectorAll('button, [role="button"]'));
      buttons.forEach((btn, idx) => {
        elements.push({
          type: 'button',
          index: idx,
          text: btn.textContent?.trim() || '',
          className: btn.className,
          id: btn.id,
          dataTestId: btn.getAttribute('data-testid'),
          onclick: btn.onclick ? 'has-onclick' : 'no-onclick'
        });
      });

      // Find clickable areas (divs, etc.)
      const clickables = Array.from(document.querySelectorAll('[onclick], .cursor-pointer, .clickable'));
      clickables.forEach((el, idx) => {
        if (!el.matches('button, [role="button"]')) {
          elements.push({
            type: 'clickable',
            index: idx,
            text: el.textContent?.trim().substring(0, 50) || '',
            className: el.className,
            id: el.id,
            tagName: el.tagName.toLowerCase()
          });
        }
      });

      // Find forms and inputs
      const forms = Array.from(document.querySelectorAll('form, input, select, textarea'));
      forms.forEach((form, idx) => {
        elements.push({
          type: 'form-element',
          index: idx,
          tagName: form.tagName.toLowerCase(),
          type_attr: form.type,
          name: form.name,
          className: form.className
        });
      });

      return elements;
    });

    console.log('\n📋 Interactive elements found:');
    interactiveElements.forEach(el => {
      console.log(`  - ${el.type}: "${el.text}" (${el.tagName || 'button'}) ${el.className ? `class: ${el.className}` : ''}`);
    });

    // Look for fortune-specific content areas
    const fortuneAreas = await page.evaluate(() => {
      const selectors = [
        '.fortune', '.message', '.cookie', '.text', '.content',
        '[data-testid*="fortune"]', '[data-testid*="message"]',
        '.fortune-text', '.fortune-content', '.fortune-display',
        'p', 'div[class*="fortune"]', 'div[class*="message"]'
      ];

      const areas = [];
      selectors.forEach(selector => {
        try {
          const elements = Array.from(document.querySelectorAll(selector));
          elements.forEach(el => {
            const text = el.textContent?.trim();
            if (text && text.length > 10 && text.length < 1000) {
              areas.push({
                selector,
                text: text.substring(0, 100),
                className: el.className,
                id: el.id
              });
            }
          });
        } catch (e) {
          // Ignore selector errors
        }
      });

      return areas;
    });

    console.log('\n💬 Fortune content areas found:');
    fortuneAreas.forEach((area, idx) => {
      console.log(`  ${idx + 1}. "${area.text}..." (${area.selector})`);
    });

    // Test 1: Try clicking on any obvious fortune generation elements
    console.log('\n3️⃣ Testing fortune generation interactions...');

    // Look for cookie-like visual elements that might be clickable
    const cookieElements = await page.locator('.cookie, [data-testid*="cookie"], .fortune-cookie, [class*="cookie"]').count();
    console.log(`Cookie elements found: ${cookieElements}`);

    if (cookieElements > 0) {
      console.log('Clicking on cookie element...');
      await page.locator('.cookie, [data-testid*="cookie"], .fortune-cookie, [class*="cookie"]').first().click();
      await page.waitForTimeout(3000);

      await page.screenshot({
        path: '/Users/brucelee/Documents/seo/Fortune Cookie/screenshots/after-cookie-click.png',
        fullPage: true
      });
    }

    // Try clicking on buttons that might generate fortunes
    const potentialButtons = await page.locator('button').all();
    for (let i = 0; i < Math.min(potentialButtons.length, 3); i++) {
      const buttonText = await potentialButtons[i].textContent();
      console.log(`Clicking button: "${buttonText}"`);

      await potentialButtons[i].click();
      await page.waitForTimeout(2000);

      // Check if new content appeared
      const newContent = await page.evaluate(() => {
        return document.body.textContent;
      });

      console.log(`Content length after click: ${newContent.length}`);
    }

    // Test 2: Try keyboard interactions
    console.log('\n4️⃣ Testing keyboard interactions...');

    await page.keyboard.press('Enter');
    await page.waitForTimeout(1000);

    await page.keyboard.press('Space');
    await page.waitForTimeout(1000);

    // Test 3: Try clicking in the center area (common for card-based UIs)
    console.log('\n5️⃣ Testing center area clicks...');

    const viewport = page.viewportSize();
    await page.click('body', {
      position: {
        x: viewport.width / 2,
        y: viewport.height / 2
      }
    });
    await page.waitForTimeout(2000);

    // Test 4: Check for theme switching
    console.log('\n6️⃣ Testing theme functionality...');

    const themeSelectors = await page.locator('select, [role="combobox"], [data-testid*="theme"]').all();
    for (const selector of themeSelectors) {
      console.log('Testing theme selector...');
      await selector.click();
      await page.waitForTimeout(1000);

      // Try to select different options
      const options = await page.locator('option, [role="option"]').all();
      if (options.length > 0) {
        for (let i = 0; i < Math.min(options.length, 2); i++) {
          const optionText = await options[i].textContent();
          console.log(`Selecting theme: ${optionText}`);
          await options[i].click();
          await page.waitForTimeout(1000);
        }
      }
    }

    // Take final screenshot
    await page.screenshot({
      path: '/Users/brucelee/Documents/seo/Fortune Cookie/screenshots/detailed-final.png',
      fullPage: true
    });

    // Final analysis
    console.log('\n7️⃣ Final analysis...');

    // Check for any new fortune content
    const finalContent = await page.evaluate(() => {
      // Look for text that looks like fortunes
      const allText = Array.from(document.querySelectorAll('*')).map(el => el.textContent?.trim()).filter(text => text && text.length > 20 && text.length < 500);
      return allText.slice(0, 10); // Get first 10 potential fortunes
    });

    console.log('Potential fortune content:');
    finalContent.forEach((text, idx) => {
      if (text && text.includes(' ') && !text.includes('http')) {
        console.log(`  ${idx + 1}. "${text.substring(0, 80)}..."`);
      }
    });

    // Summary
    console.log('\n📊 Test Summary:');
    console.log(`Console messages: ${consoleMessages.length}`);
    console.log(`Network requests: ${networkRequests.length}`);
    console.log(`Page errors: ${errors.length}`);
    console.log(`API requests: ${networkRequests.filter(req => req.url.includes('api/')).length}`);

    // Check if any fortune generation actually happened
    const apiCalls = networkRequests.filter(req => req.url.includes('/api/'));
    if (apiCalls.length === 0) {
      console.log('\n⚠️  No API calls detected - fortune generation may not be working');
    } else {
      console.log('\n✅ API calls detected - fortune generation seems functional');
    }

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    await page.screenshot({
      path: '/Users/brucelee/Documents/seo/Fortune Cookie/screenshots/detailed-error.png',
      fullPage: true
    });
  } finally {
    await browser.close();

    // Save comprehensive results
    const results = {
      timestamp: new Date().toISOString(),
      consoleMessages,
      networkRequests,
      errors,
      apiRequests: networkRequests.filter(req => req.url.includes('/api/'))
    };

    require('fs').writeFileSync(
      '/Users/brucelee/Documents/seo/Fortune Cookie/detailed-test-results.json',
      JSON.stringify(results, null, 2)
    );

    console.log('\n📄 Detailed results saved to detailed-test-results.json');
  }
}

detailedFortuneTest().catch(console.error);
