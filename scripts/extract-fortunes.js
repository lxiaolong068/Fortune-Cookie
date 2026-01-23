#!/usr/bin/env node
/**
 * Script to extract all fortune messages and generate translation template
 * Usage: node scripts/extract-fortunes.js
 */

const fs = require('fs');
const path = require('path');

// Read the fortune-database.ts file
const dbPath = path.join(__dirname, '../lib/fortune-database.ts');
const content = fs.readFileSync(dbPath, 'utf-8');

// Extract messages using regex - handles both single-line and multi-line messages
const messageRegex = /message:\s*(?:"([^"]+)"|`([^`]+)`|"([^"]*)"[\s\S]*?"([^"]*)")/g;
const simpleMessageRegex = /message:\s*"([^"]+)"/g;

const messages = [];
let match;

// Reset and use simple regex for single-line messages
const lines = content.split('\n');
let currentCategory = '';
let messageIndex = 0;

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];

  // Detect category arrays
  const categoryMatch = line.match(/const (\w+)Messages.*=/);
  if (categoryMatch) {
    currentCategory = categoryMatch[1];
  }

  // Extract simple messages
  const msgMatch = line.match(/message:\s*"([^"]+)"/);
  if (msgMatch && msgMatch[1] && !msgMatch[1].includes('string')) {
    messageIndex++;
    messages.push({
      id: `fortune_${messageIndex}`,
      message: msgMatch[1],
      category: currentCategory
    });
  }

  // Handle multi-line messages (message: followed by content on next line)
  if (line.trim() === 'message:') {
    // Look at next line(s) for the actual message
    let j = i + 1;
    let fullMessage = '';
    while (j < lines.length && !lines[j].includes('category:')) {
      const nextLine = lines[j].trim();
      const contentMatch = nextLine.match(/"([^"]+)"/);
      if (contentMatch) {
        fullMessage += (fullMessage ? ' ' : '') + contentMatch[1];
      }
      j++;
    }
    if (fullMessage) {
      messageIndex++;
      messages.push({
        id: `fortune_${messageIndex}`,
        message: fullMessage,
        category: currentCategory
      });
    }
  }
}

console.log(`Found ${messages.length} fortune messages\n`);

// Generate output files
const outputDir = path.join(__dirname, '../content');

// 1. Create English reference file
const enMessages = {};
messages.forEach(m => {
  enMessages[m.id] = {
    message: m.message,
    category: m.category
  };
});
fs.writeFileSync(
  path.join(outputDir, 'fortune-messages-en.json'),
  JSON.stringify(enMessages, null, 2)
);
console.log('Created: content/fortune-messages-en.json');

// 2. Create translation template (to be filled)
const translationTemplate = {
  zh: {},
  es: {},
  pt: {}
};

messages.forEach(m => {
  ['zh', 'es', 'pt'].forEach(lang => {
    translationTemplate[lang][m.id] = {
      message: '', // To be translated
      status: 'pending'
    };
  });
});

fs.writeFileSync(
  path.join(outputDir, 'fortune-translations-template.json'),
  JSON.stringify(translationTemplate, null, 2)
);
console.log('Created: content/fortune-translations-template.json');

// 3. Print statistics
const categories = {};
messages.forEach(m => {
  categories[m.category] = (categories[m.category] || 0) + 1;
});

console.log('\nMessages by category:');
Object.entries(categories).forEach(([cat, count]) => {
  console.log(`  ${cat}: ${count}`);
});

// 4. Export messages for translation (simple format)
const forTranslation = messages.map(m => `[${m.id}] ${m.message}`).join('\n');
fs.writeFileSync(
  path.join(outputDir, 'messages-for-translation.txt'),
  forTranslation
);
console.log('\nCreated: content/messages-for-translation.txt (for batch translation)');
