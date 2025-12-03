#!/usr/bin/env node
/**
 * Generate PNG icons from SVG source files
 * Uses sharp library to convert SVG to PNG with correct dimensions
 */

const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const PUBLIC_DIR = path.join(__dirname, '../public');

const ICONS_TO_GENERATE = [
  { svg: 'android-chrome-192x192.svg', png: 'android-chrome-192x192.png', size: 192 },
  { svg: 'android-chrome-512x512.svg', png: 'android-chrome-512x512.png', size: 512 },
  { svg: 'apple-touch-icon.svg', png: 'apple-touch-icon.png', size: 180 },
  { svg: 'favicon-16x16.svg', png: 'favicon-16x16.png', size: 16 },
  { svg: 'favicon-32x32.svg', png: 'favicon-32x32.png', size: 32 },
];

async function generateIcon(svgFile, pngFile, size) {
  const svgPath = path.join(PUBLIC_DIR, svgFile);
  const pngPath = path.join(PUBLIC_DIR, pngFile);

  // Check if SVG exists
  if (!fs.existsSync(svgPath)) {
    // Fallback to logo.svg or icon.svg
    const fallbacks = ['icon.svg', 'logo.svg'];
    let fallbackPath = null;
    
    for (const fallback of fallbacks) {
      const p = path.join(PUBLIC_DIR, fallback);
      if (fs.existsSync(p)) {
        fallbackPath = p;
        break;
      }
    }
    
    if (!fallbackPath) {
      console.log(`⚠️  Skipping ${pngFile}: No SVG source found`);
      return false;
    }
    
    console.log(`ℹ️  Using fallback ${path.basename(fallbackPath)} for ${pngFile}`);
    
    try {
      await sharp(fallbackPath)
        .resize(size, size, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
        .png()
        .toFile(pngPath);
      
      console.log(`✅ Generated ${pngFile} (${size}x${size})`);
      return true;
    } catch (err) {
      console.error(`❌ Failed to generate ${pngFile}:`, err.message);
      return false;
    }
  }

  try {
    await sharp(svgPath)
      .resize(size, size, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png()
      .toFile(pngPath);
    
    console.log(`✅ Generated ${pngFile} (${size}x${size})`);
    return true;
  } catch (err) {
    console.error(`❌ Failed to generate ${pngFile}:`, err.message);
    return false;
  }
}

async function main() {
  console.log('🎨 Generating PNG icons from SVG sources...\n');
  
  let success = 0;
  let failed = 0;
  
  for (const icon of ICONS_TO_GENERATE) {
    const result = await generateIcon(icon.svg, icon.png, icon.size);
    if (result) success++;
    else failed++;
  }
  
  console.log(`\n📊 Results: ${success} generated, ${failed} skipped/failed`);
  
  if (success > 0) {
    console.log('\n💡 Remember to upload new icons to Vercel Blob Storage:');
    console.log('   node scripts/upload-to-blob.js');
  }
}

main().catch(console.error);

