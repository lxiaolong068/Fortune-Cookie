#!/usr/bin/env node

/**
 * Test script to validate sitemap.xml generation
 * Checks XML format, required fields, and protocol compliance
 */

import { execSync } from 'child_process';
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

const SITEMAP_URL = 'http://localhost:3000/sitemap.xml';
const OUTPUT_FILE = '/tmp/sitemap-validation.xml';

console.log('🔍 Sitemap Validation Test\n');

// Start dev server in background
console.log('Starting dev server...');
const devServer = execSync('npm run dev &', { encoding: 'utf-8' });

// Wait for server to start
console.log('Waiting for server to be ready...');
execSync('sleep 5');

try {
  // Fetch sitemap
  console.log(`\n📥 Fetching sitemap from ${SITEMAP_URL}...`);
  const sitemap = execSync(`curl -s ${SITEMAP_URL}`, { encoding: 'utf-8' });
  
  writeFileSync(OUTPUT_FILE, sitemap);
  console.log(`✅ Sitemap saved to ${OUTPUT_FILE}`);
  
  // Display first 100 lines
  console.log('\n📄 Sitemap content (first 100 lines):\n');
  const lines = sitemap.split('\n').slice(0, 100);
  lines.forEach((line, i) => {
    console.log(`${String(i + 1).padStart(3, ' ')}: ${line}`);
  });
  
  // Basic validation
  console.log('\n\n🔍 Validation Results:\n');
  
  const checks = [
    {
      name: 'XML Declaration',
      test: () => sitemap.includes('<?xml version="1.0" encoding="UTF-8"?>'),
      fix: 'Add XML declaration at the beginning'
    },
    {
      name: 'Sitemap Namespace',
      test: () => sitemap.includes('xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"'),
      fix: 'Add correct xmlns attribute to <urlset>'
    },
    {
      name: 'URL Entries',
      test: () => sitemap.includes('<url>') && sitemap.includes('</url>'),
      fix: 'Ensure URL entries are properly formatted'
    },
    {
      name: 'Location Tags',
      test: () => sitemap.includes('<loc>') && sitemap.includes('</loc>'),
      fix: 'Add <loc> tags for each URL'
    },
    {
      name: 'Absolute URLs',
      test: () => {
        const locMatches = sitemap.match(/<loc>(.*?)<\/loc>/g) || [];
        return locMatches.every(loc => 
          loc.includes('http://') || loc.includes('https://')
        );
      },
      fix: 'Use absolute URLs with protocol and domain'
    },
    {
      name: 'LastMod Format',
      test: () => {
        const lastmodMatches = sitemap.match(/<lastmod>(.*?)<\/lastmod>/g) || [];
        if (lastmodMatches.length === 0) return true; // Optional field
        return lastmodMatches.every(lastmod => {
          const date = lastmod.match(/<lastmod>(.*?)<\/lastmod>/)?.[1];
          return date && /^\d{4}-\d{2}-\d{2}/.test(date);
        });
      },
      fix: 'Use ISO 8601 date format (YYYY-MM-DD or YYYY-MM-DDTHH:MM:SS)'
    },
    {
      name: 'ChangeFreq Values',
      test: () => {
        const freqMatches = sitemap.match(/<changefreq>(.*?)<\/changefreq>/g) || [];
        if (freqMatches.length === 0) return true; // Optional field
        const validFreqs = ['always', 'hourly', 'daily', 'weekly', 'monthly', 'yearly', 'never'];
        return freqMatches.every(freq => {
          const value = freq.match(/<changefreq>(.*?)<\/changefreq>/)?.[1];
          return value && validFreqs.includes(value);
        });
      },
      fix: 'Use valid changefreq values: always, hourly, daily, weekly, monthly, yearly, never'
    },
    {
      name: 'Priority Range',
      test: () => {
        const priorityMatches = sitemap.match(/<priority>(.*?)<\/priority>/g) || [];
        if (priorityMatches.length === 0) return true; // Optional field
        return priorityMatches.every(priority => {
          const value = parseFloat(priority.match(/<priority>(.*?)<\/priority>/)?.[1] || '');
          return !isNaN(value) && value >= 0.0 && value <= 1.0;
        });
      },
      fix: 'Priority values must be between 0.0 and 1.0'
    },
    {
      name: 'Proper Tag Closure',
      test: () => {
        const openTags = (sitemap.match(/<[^/][^>]*>/g) || []).length;
        const closeTags = (sitemap.match(/<\/[^>]+>/g) || []).length;
        const selfClosing = (sitemap.match(/<[^>]+\/>/g) || []).length;
        return openTags === closeTags + selfClosing;
      },
      fix: 'Ensure all tags are properly closed'
    }
  ];
  
  let passed = 0;
  let failed = 0;
  
  checks.forEach(check => {
    try {
      const result = check.test();
      if (result) {
        console.log(`✅ ${check.name}`);
        passed++;
      } else {
        console.log(`❌ ${check.name}`);
        console.log(`   Fix: ${check.fix}`);
        failed++;
      }
    } catch (error) {
      console.log(`❌ ${check.name} (Error: ${error.message})`);
      console.log(`   Fix: ${check.fix}`);
      failed++;
    }
  });
  
  // Statistics
  console.log('\n\n📊 Statistics:\n');
  const urlCount = (sitemap.match(/<url>/g) || []).length;
  const locCount = (sitemap.match(/<loc>/g) || []).length;
  const lastmodCount = (sitemap.match(/<lastmod>/g) || []).length;
  const changefreqCount = (sitemap.match(/<changefreq>/g) || []).length;
  const priorityCount = (sitemap.match(/<priority>/g) || []).length;
  
  console.log(`Total URLs: ${urlCount}`);
  console.log(`Location tags: ${locCount}`);
  console.log(`LastMod tags: ${lastmodCount}`);
  console.log(`ChangeFreq tags: ${changefreqCount}`);
  console.log(`Priority tags: ${priorityCount}`);
  
  // Summary
  console.log('\n\n📋 Summary:\n');
  console.log(`✅ Passed: ${passed}/${checks.length}`);
  console.log(`❌ Failed: ${failed}/${checks.length}`);
  
  if (failed === 0) {
    console.log('\n🎉 All checks passed! Sitemap is compliant with XML Sitemap protocol.');
  } else {
    console.log('\n⚠️  Some checks failed. Please review and fix the issues above.');
  }
  
} catch (error) {
  console.error('❌ Error:', error.message);
} finally {
  // Kill dev server
  console.log('\n\nCleaning up...');
  try {
    execSync('pkill -f "next dev"');
  } catch (e) {
    // Ignore errors
  }
}

