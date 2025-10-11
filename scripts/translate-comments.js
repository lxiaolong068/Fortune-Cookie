#!/usr/bin/env node

/**
 * Automated Comment Translation Script
 * Translates Chinese comments to English using i18n-mapping.json
 * 
 * Usage:
 *   node scripts/translate-comments.js [file-path]
 *   node scripts/translate-comments.js --all
 *   node scripts/translate-comments.js --dry-run [file-path]
 */

const fs = require('fs')
const path = require('path')

// Load i18n mapping
const mappingPath = path.join(__dirname, '../docs/i18n-mapping.json')
const mapping = JSON.parse(fs.readFileSync(mappingPath, 'utf8'))

// Configuration
const config = {
  dryRun: process.argv.includes('--dry-run'),
  all: process.argv.includes('--all'),
  verbose: process.argv.includes('--verbose'),
  filePath: process.argv.find(arg => !arg.startsWith('--') && arg !== 'node' && !arg.endsWith('.js')),
}

// Files to translate (priority order)
const filesToTranslate = [
  'app/api/fortune/route.ts',
  'app/api/fortunes/route.ts',
  'lib/redis-cache.ts',
  'lib/database.ts',
  'lib/analytics-manager.ts',
  'lib/performance-budget.ts',
  'lib/session-manager.ts',
  'lib/error-monitoring.ts',
  'app/api/analytics/route.ts',
  'app/api/database/route.ts',
  'app/api/cache/route.ts',
  'prisma/schema.prisma',
]

/**
 * Translate a single line of text
 * @param {string} line - Line to translate
 * @returns {string} - Translated line
 */
function translateLine(line) {
  let translated = line

  // First, try to match common phrases (longer matches first)
  const phrases = Object.entries(mapping.common_phrases || {})
    .sort((a, b) => b[0].length - a[0].length)

  for (const [chinese, english] of phrases) {
    if (translated.includes(chinese)) {
      translated = translated.replace(new RegExp(chinese, 'g'), english)
      if (config.verbose) {
        console.log(`  Phrase: "${chinese}" → "${english}"`)
      }
    }
  }

  // Then, translate individual terms
  const terms = Object.entries(mapping.terminology || {})
    .sort((a, b) => b[0].length - a[0].length)

  for (const [chinese, english] of terms) {
    if (translated.includes(chinese)) {
      translated = translated.replace(new RegExp(chinese, 'g'), english)
      if (config.verbose) {
        console.log(`  Term: "${chinese}" → "${english}"`)
      }
    }
  }

  return translated
}

/**
 * Check if a line contains Chinese characters
 * @param {string} line - Line to check
 * @returns {boolean} - True if line contains Chinese
 */
function containsChinese(line) {
  return /[\u4e00-\u9fa5]/.test(line)
}

/**
 * Translate comments in a file
 * @param {string} filePath - Path to file
 * @returns {Object} - Translation statistics
 */
function translateFile(filePath) {
  const fullPath = path.join(__dirname, '..', filePath)
  
  if (!fs.existsSync(fullPath)) {
    console.error(`❌ File not found: ${filePath}`)
    return { linesTranslated: 0, chineseRemaining: 0 }
  }

  console.log(`\n📄 Processing: ${filePath}`)
  
  const content = fs.readFileSync(fullPath, 'utf8')
  const lines = content.split('\n')
  
  let linesTranslated = 0
  let chineseRemaining = 0
  const translatedLines = []

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    
    if (containsChinese(line)) {
      const translated = translateLine(line)
      
      if (translated !== line) {
        linesTranslated++
        translatedLines.push(line)
        
        if (config.verbose) {
          console.log(`\n  Line ${i + 1}:`)
          console.log(`  Before: ${line}`)
          console.log(`  After:  ${translated}`)
        } else {
          console.log(`  ✓ Line ${i + 1} translated`)
        }
        
        lines[i] = translated
      }
      
      // Check if Chinese still remains
      if (containsChinese(translated)) {
        chineseRemaining++
        console.log(`  ⚠️  Line ${i + 1} still contains Chinese: ${translated.substring(0, 80)}...`)
      }
    }
  }

  // Write back to file (unless dry run)
  if (!config.dryRun && linesTranslated > 0) {
    fs.writeFileSync(fullPath, lines.join('\n'), 'utf8')
    console.log(`✅ Saved ${filePath}`)
  } else if (config.dryRun && linesTranslated > 0) {
    console.log(`🔍 Dry run: Would translate ${linesTranslated} lines`)
  } else {
    console.log(`✓ No Chinese comments found`)
  }

  return { linesTranslated, chineseRemaining }
}

/**
 * Main function
 */
function main() {
  console.log('🌐 Automated Comment Translation Script')
  console.log('=' .repeat(50))
  
  if (config.dryRun) {
    console.log('🔍 DRY RUN MODE - No files will be modified')
  }
  
  console.log(`\n📚 Loaded ${Object.keys(mapping.terminology || {}).length} terms`)
  console.log(`📚 Loaded ${Object.keys(mapping.common_phrases || {}).length} phrases`)

  let totalTranslated = 0
  let totalRemaining = 0
  let filesProcessed = 0

  if (config.all) {
    // Translate all files
    console.log(`\n🔄 Translating ${filesToTranslate.length} files...`)
    
    for (const file of filesToTranslate) {
      const stats = translateFile(file)
      totalTranslated += stats.linesTranslated
      totalRemaining += stats.chineseRemaining
      if (stats.linesTranslated > 0 || stats.chineseRemaining > 0) {
        filesProcessed++
      }
    }
  } else if (config.filePath) {
    // Translate single file
    const stats = translateFile(config.filePath)
    totalTranslated += stats.linesTranslated
    totalRemaining += stats.chineseRemaining
    filesProcessed = 1
  } else {
    // Show usage
    console.log('\n📖 Usage:')
    console.log('  node scripts/translate-comments.js [file-path]')
    console.log('  node scripts/translate-comments.js --all')
    console.log('  node scripts/translate-comments.js --dry-run [file-path]')
    console.log('  node scripts/translate-comments.js --verbose [file-path]')
    console.log('\n📝 Examples:')
    console.log('  node scripts/translate-comments.js lib/database.ts')
    console.log('  node scripts/translate-comments.js --all')
    console.log('  node scripts/translate-comments.js --dry-run --all')
    process.exit(0)
  }

  // Summary
  console.log('\n' + '='.repeat(50))
  console.log('📊 Translation Summary')
  console.log('='.repeat(50))
  console.log(`Files processed: ${filesProcessed}`)
  console.log(`Lines translated: ${totalTranslated}`)
  console.log(`Chinese remaining: ${totalRemaining}`)
  
  if (totalRemaining > 0) {
    console.log('\n⚠️  Some Chinese text could not be translated automatically.')
    console.log('   Please review and translate manually.')
  }
  
  if (config.dryRun) {
    console.log('\n🔍 This was a dry run. Run without --dry-run to apply changes.')
  } else if (totalTranslated > 0) {
    console.log('\n✅ Translation complete!')
    console.log('   Run `npm run type-check` to verify no syntax errors.')
  }
}

// Run main function
try {
  main()
} catch (error) {
  console.error('\n❌ Error:', error.message)
  if (config.verbose) {
    console.error(error.stack)
  }
  process.exit(1)
}

