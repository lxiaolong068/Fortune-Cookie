#!/usr/bin/env node

/**
 * 创建 OG 和 Twitter 图片的 PNG 版本
 * 这个脚本创建基本的 PNG 图片作为占位符
 * 在生产环境中，应该使用专业的图片或设计工具创建高质量的图片
 */

const fs = require('fs');
const path = require('path');

// 创建一个简单的 PNG 图片（使用 base64 编码的最小 PNG）
function createBasicPNG(width, height, filename) {
  // 这是一个 1x1 像素的橙色 PNG 图片的 base64 编码
  // 在实际生产中，你应该使用真正的 1200x630 图片
  const orangePixelPNG = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==';
  
  const buffer = Buffer.from(orangePixelPNG, 'base64');
  const publicDir = path.join(__dirname, '..', 'public');
  const filePath = path.join(publicDir, filename);

  fs.writeFileSync(filePath, buffer);
  console.log(`✓ Created ${filename} (${width}x${height} placeholder)`);
}

// 创建一个更好的 SVG 转 PNG 占位符
function createSVGBasedPNG(filename, title) {
  // 创建一个简单的 SVG 内容，然后保存为 PNG 占位符
  // 注意：这仍然是一个占位符方法，实际生产中需要真正的图片转换
  const svgContent = `<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
  <!-- Background gradient -->
  <defs>
    <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#fef3c7;stop-opacity:1" />
      <stop offset="50%" style="stop-color:#fbbf24;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#f59e0b;stop-opacity:1" />
    </linearGradient>
    <radialGradient id="cookieGradient" cx="50%" cy="50%" r="50%">
      <stop offset="0%" style="stop-color:#fef3c7;stop-opacity:1" />
      <stop offset="70%" style="stop-color:#fbbf24;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#d97706;stop-opacity:1" />
    </radialGradient>
  </defs>
  
  <!-- Background -->
  <rect width="1200" height="630" fill="url(#bgGradient)"/>
  
  <!-- Main fortune cookie -->
  <g transform="translate(200, 200)">
    <!-- Cookie body -->
    <ellipse cx="0" cy="0" rx="120" ry="80" fill="url(#cookieGradient)" stroke="#92400e" stroke-width="3"/>
    <!-- Cookie fold -->
    <path d="M -80 -20 Q 0 -40 80 -20" fill="none" stroke="#92400e" stroke-width="2"/>
    <!-- Paper slip -->
    <rect x="-30" y="20" width="60" height="25" rx="3" fill="white" stroke="#92400e" stroke-width="1"/>
    <!-- Text on paper -->
    <text x="0" y="35" text-anchor="middle" font-family="Arial, sans-serif" font-size="12" fill="#92400e" font-weight="bold">AI</text>
  </g>
  
  <!-- Title -->
  <text x="600" y="200" text-anchor="middle" font-family="Arial, sans-serif" font-size="72" font-weight="bold" fill="#92400e">
    Fortune Cookie AI
  </text>
  
  <!-- Subtitle -->
  <text x="600" y="260" text-anchor="middle" font-family="Arial, sans-serif" font-size="32" fill="#7c2d12">
    Free Online AI Generator
  </text>
  
  <!-- Description -->
  <text x="600" y="320" text-anchor="middle" font-family="Arial, sans-serif" font-size="24" fill="#7c2d12">
    Get personalized inspirational messages, funny quotes, and lucky numbers
  </text>
  
  <!-- Call to action -->
  <rect x="450" y="380" width="300" height="60" rx="30" fill="#dc2626" stroke="#991b1b" stroke-width="2"/>
  <text x="600" y="420" text-anchor="middle" font-family="Arial, sans-serif" font-size="28" font-weight="bold" fill="white">
    Try It Free Now!
  </text>
  
  <!-- Website URL -->
  <text x="600" y="500" text-anchor="middle" font-family="Arial, sans-serif" font-size="20" fill="#7c2d12">
    www.fortune-cookie.cc
  </text>
  
  <!-- Sparkles decoration -->
  <g fill="#fbbf24" opacity="0.6">
    <polygon points="50,300 55,310 65,310 57,318 60,328 50,322 40,328 43,318 35,310 45,310" />
    <polygon points="950,100 955,110 965,110 957,118 960,128 950,122 940,128 943,118 935,110 945,110" />
    <polygon points="150,450 155,460 165,460 157,468 160,478 150,472 140,478 143,468 135,460 145,460" />
    <polygon points="1050,400 1055,410 1065,410 1057,418 1060,428 1050,422 1040,428 1043,418 1035,410 1045,410" />
  </g>
</svg>`;

  // 为了这个演示，我们将创建一个基本的 PNG 占位符
  // 在实际生产中，你需要使用像 sharp、canvas 或其他库来转换 SVG 到 PNG
  createBasicPNG(1200, 630, filename);
}

// 生成 OG 和 Twitter 图片
function generateOGImages() {
  console.log('Creating OG and Twitter PNG images...');
  
  // 创建 OG 图片 (1200x630)
  createSVGBasedPNG('og-image.png', 'Fortune Cookie AI - Open Graph Image');
  
  // 创建 Twitter 图片 (1200x630)
  createSVGBasedPNG('twitter-image.png', 'Fortune Cookie AI - Twitter Card Image');
  
  console.log('\n🎉 OG and Twitter PNG images created successfully!');
  console.log('📝 Note: These are minimal PNG placeholders.');
  console.log('🎨 For production, replace with high-quality 1200x630 PNG images.');
  console.log('💡 Consider using tools like Figma, Canva, or automated image generation.');
  console.log('\n📋 Next steps:');
  console.log('1. Replace placeholder PNGs with actual designed images');
  console.log('2. Ensure images are exactly 1200x630 pixels');
  console.log('3. Optimize images for web (compress without losing quality)');
  console.log('4. Test social media sharing to verify images display correctly');
}

// 运行脚本
if (require.main === module) {
  generateOGImages();
}

module.exports = { generateOGImages, createBasicPNG };
