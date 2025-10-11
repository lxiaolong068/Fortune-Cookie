#!/usr/bin/env node

/**
 * Image Optimization Script
 * 
 * Analyzes and optimizes images in the public directory
 * 
 * Features:
 * - Analyzes image sizes and formats
 * - Provides optimization recommendations
 * - Can convert images to WebP format (requires sharp)
 * - Generates optimization report
 * 
 * Usage:
 *   node scripts/optimize-images.js [options]
 * 
 * Options:
 *   --analyze    Analyze images without converting
 *   --convert    Convert images to WebP format
 *   --quality    WebP quality (default: 85)
 *   --help       Show help
 */

const fs = require('fs')
const path = require('path')

// Configuration
const PUBLIC_DIR = path.join(process.cwd(), 'public')
const IMAGE_EXTENSIONS = ['.png', '.jpg', '.jpeg', '.gif']
const WEBP_QUALITY = 85

// Parse command line arguments
const args = process.argv.slice(2)
const options = {
  analyze: args.includes('--analyze'),
  convert: args.includes('--convert'),
  quality: parseInt(args.find(arg => arg.startsWith('--quality='))?.split('=')[1] || WEBP_QUALITY),
  help: args.includes('--help')
}

// Show help
if (options.help) {
  console.log(`
Image Optimization Script

Usage:
  node scripts/optimize-images.js [options]

Options:
  --analyze    Analyze images without converting
  --convert    Convert images to WebP format (requires sharp)
  --quality=N  WebP quality (default: 85)
  --help       Show this help message

Examples:
  node scripts/optimize-images.js --analyze
  node scripts/optimize-images.js --convert --quality=90
  `)
  process.exit(0)
}

/**
 * Get all image files recursively
 */
function getImageFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir)

  files.forEach(file => {
    const filePath = path.join(dir, file)
    const stat = fs.statSync(filePath)

    if (stat.isDirectory()) {
      getImageFiles(filePath, fileList)
    } else {
      const ext = path.extname(file).toLowerCase()
      if (IMAGE_EXTENSIONS.includes(ext)) {
        fileList.push(filePath)
      }
    }
  })

  return fileList
}

/**
 * Format bytes to human readable
 */
function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
}

/**
 * Analyze images
 */
function analyzeImages() {
  console.log('🔍 Analyzing images...\n')

  const imageFiles = getImageFiles(PUBLIC_DIR)
  
  if (imageFiles.length === 0) {
    console.log('No images found in public directory.')
    return
  }

  let totalSize = 0
  const imageStats = []

  imageFiles.forEach(filePath => {
    const stat = fs.statSync(filePath)
    const relativePath = path.relative(PUBLIC_DIR, filePath)
    const ext = path.extname(filePath).toLowerCase()
    
    totalSize += stat.size
    imageStats.push({
      path: relativePath,
      size: stat.size,
      ext,
      canOptimize: ['.png', '.jpg', '.jpeg'].includes(ext)
    })
  })

  // Sort by size (largest first)
  imageStats.sort((a, b) => b.size - a.size)

  // Print results
  console.log('📊 Image Analysis Report\n')
  console.log('─'.repeat(80))
  console.log(`${'File'.padEnd(50)} ${'Size'.padEnd(15)} ${'Can Optimize'}`)
  console.log('─'.repeat(80))

  imageStats.forEach(img => {
    const canOptimize = img.canOptimize ? '✅ Yes' : '❌ No (SVG/GIF)'
    console.log(
      `${img.path.padEnd(50)} ${formatBytes(img.size).padEnd(15)} ${canOptimize}`
    )
  })

  console.log('─'.repeat(80))
  console.log(`\nTotal: ${imageStats.length} images, ${formatBytes(totalSize)}`)

  // Optimization recommendations
  const optimizableImages = imageStats.filter(img => img.canOptimize)
  const optimizableSize = optimizableImages.reduce((sum, img) => sum + img.size, 0)

  if (optimizableImages.length > 0) {
    console.log(`\n💡 Optimization Potential:`)
    console.log(`   ${optimizableImages.length} images can be optimized`)
    console.log(`   Current size: ${formatBytes(optimizableSize)}`)
    console.log(`   Estimated savings: ~30-50% (${formatBytes(optimizableSize * 0.3)} - ${formatBytes(optimizableSize * 0.5)})`)
    console.log(`\n📝 Recommendations:`)
    console.log(`   1. Use Next.js Image component for automatic optimization`)
    console.log(`   2. Convert PNG/JPG to WebP format (requires sharp)`)
    console.log(`   3. Use appropriate image sizes (don't serve oversized images)`)
    console.log(`   4. Enable lazy loading for below-the-fold images`)
    console.log(`\n🚀 Next Steps:`)
    console.log(`   - Install sharp: npm install sharp`)
    console.log(`   - Run conversion: node scripts/optimize-images.js --convert`)
    console.log(`   - Use OptimizedImage component in your code`)
  } else {
    console.log(`\n✅ All images are already optimized or are SVG/GIF format`)
  }
}

/**
 * Convert images to WebP
 */
async function convertImages() {
  console.log('🔄 Converting images to WebP...\n')

  // Check if sharp is installed
  let sharp
  try {
    sharp = require('sharp')
  } catch (error) {
    console.error('❌ Error: sharp is not installed')
    console.log('\n📦 Install sharp with:')
    console.log('   npm install sharp')
    console.log('\nOr use Next.js Image component for automatic optimization.')
    process.exit(1)
  }

  const imageFiles = getImageFiles(PUBLIC_DIR)
  const convertibleImages = imageFiles.filter(file => {
    const ext = path.extname(file).toLowerCase()
    return ['.png', '.jpg', '.jpeg'].includes(ext)
  })

  if (convertibleImages.length === 0) {
    console.log('No images to convert.')
    return
  }

  console.log(`Found ${convertibleImages.length} images to convert\n`)

  let converted = 0
  let totalOriginalSize = 0
  let totalWebPSize = 0

  for (const filePath of convertibleImages) {
    try {
      const relativePath = path.relative(PUBLIC_DIR, filePath)
      const originalStat = fs.statSync(filePath)
      const webpPath = filePath.replace(/\.(png|jpe?g)$/i, '.webp')

      // Skip if WebP already exists
      if (fs.existsSync(webpPath)) {
        console.log(`⏭️  Skipping ${relativePath} (WebP already exists)`)
        continue
      }

      // Convert to WebP
      await sharp(filePath)
        .webp({ quality: options.quality })
        .toFile(webpPath)

      const webpStat = fs.statSync(webpPath)
      const savings = ((originalStat.size - webpStat.size) / originalStat.size * 100).toFixed(1)

      totalOriginalSize += originalStat.size
      totalWebPSize += webpStat.size
      converted++

      console.log(`✅ ${relativePath}`)
      console.log(`   Original: ${formatBytes(originalStat.size)}`)
      console.log(`   WebP: ${formatBytes(webpStat.size)} (${savings}% smaller)\n`)

    } catch (error) {
      console.error(`❌ Error converting ${filePath}:`, error.message)
    }
  }

  // Summary
  console.log('─'.repeat(80))
  console.log(`\n📊 Conversion Summary:`)
  console.log(`   Converted: ${converted} images`)
  console.log(`   Original size: ${formatBytes(totalOriginalSize)}`)
  console.log(`   WebP size: ${formatBytes(totalWebPSize)}`)
  
  if (totalOriginalSize > 0) {
    const totalSavings = ((totalOriginalSize - totalWebPSize) / totalOriginalSize * 100).toFixed(1)
    console.log(`   Total savings: ${formatBytes(totalOriginalSize - totalWebPSize)} (${totalSavings}%)`)
  }

  console.log(`\n✅ Conversion complete!`)
  console.log(`\n📝 Next Steps:`)
  console.log(`   1. Update image references to use .webp extension`)
  console.log(`   2. Or use OptimizedImage component for automatic format selection`)
  console.log(`   3. Test images in your application`)
  console.log(`   4. Consider removing original files if WebP works well`)
}

/**
 * Main function
 */
async function main() {
  console.log('🖼️  Image Optimization Tool\n')

  if (!fs.existsSync(PUBLIC_DIR)) {
    console.error(`❌ Error: public directory not found at ${PUBLIC_DIR}`)
    process.exit(1)
  }

  if (options.convert) {
    await convertImages()
  } else {
    // Default to analyze
    analyzeImages()
  }
}

// Run
main().catch(error => {
  console.error('❌ Error:', error.message)
  process.exit(1)
})

