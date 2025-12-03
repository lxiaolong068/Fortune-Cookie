#!/usr/bin/env node

/**
 * Vercel Blob Storage Migration Script
 *
 * Uploads all images from public/ directory to Vercel Blob Storage
 * and generates a mapping file for updating code references.
 *
 * Usage:
 *   node scripts/upload-to-blob.js           # Upload all images
 *   node scripts/upload-to-blob.js --dry-run # Preview without uploading
 *   node scripts/upload-to-blob.js --single favicon.ico  # Upload single file
 */

const { put, list } = require('@vercel/blob');
const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const PUBLIC_DIR = path.join(process.cwd(), 'public');
const OUTPUT_FILE = path.join(process.cwd(), 'blob-urls.json');

// Image extensions to process
const IMAGE_EXTENSIONS = ['.png', '.jpg', '.jpeg', '.svg', '.webp', '.gif', '.ico'];

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
  dim: '\x1b[2m',
};

function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

function logSuccess(message) {
  log(`✅ ${message}`, colors.green);
}

function logWarning(message) {
  log(`⚠️  ${message}`, colors.yellow);
}

function logError(message) {
  log(`❌ ${message}`, colors.red);
}

function logInfo(message) {
  log(`ℹ️  ${message}`, colors.cyan);
}

/**
 * Recursively find all image files in a directory
 */
function findImageFiles(dir, baseDir = dir, files = []) {
  const items = fs.readdirSync(dir);

  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      findImageFiles(fullPath, baseDir, files);
    } else {
      const ext = path.extname(item).toLowerCase();
      if (IMAGE_EXTENSIONS.includes(ext)) {
        const relativePath = path.relative(baseDir, fullPath);
        files.push({
          fullPath,
          relativePath,
          fileName: item,
          size: stat.size,
        });
      }
    }
  }

  return files;
}

/**
 * Format file size for display
 */
function formatSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

/**
 * Get content type based on file extension
 */
function getContentType(fileName) {
  const ext = path.extname(fileName).toLowerCase();
  const contentTypes = {
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.svg': 'image/svg+xml',
    '.webp': 'image/webp',
    '.gif': 'image/gif',
    '.ico': 'image/x-icon',
  };
  return contentTypes[ext] || 'application/octet-stream';
}

/**
 * Upload a single file to Vercel Blob Storage
 */
async function uploadFile(file, dryRun = false) {
  const { fullPath, relativePath, fileName, size } = file;

  // Use the relative path as the blob pathname to maintain directory structure
  // Remove leading slashes and normalize path separators
  const blobPathname = relativePath.replace(/\\/g, '/');

  if (dryRun) {
    logInfo(`[DRY RUN] Would upload: ${relativePath} (${formatSize(size)})`);
    return {
      originalPath: `/${relativePath.replace(/\\/g, '/')}`,
      blobUrl: `[DRY_RUN] https://blob.vercel-storage.com/${blobPathname}`,
      size,
    };
  }

  try {
    const fileBuffer = fs.readFileSync(fullPath);
    const contentType = getContentType(fileName);

    const blob = await put(blobPathname, fileBuffer, {
      access: 'public',
      contentType,
      addRandomSuffix: false, // Keep original filename
      allowOverwrite: true, // Allow overwriting existing blobs
    });

    logSuccess(`Uploaded: ${relativePath} → ${blob.url}`);

    return {
      originalPath: `/${relativePath.replace(/\\/g, '/')}`,
      blobUrl: blob.url,
      size,
      contentType,
    };
  } catch (error) {
    logError(`Failed to upload ${relativePath}: ${error.message}`);
    throw error;
  }
}

/**
 * Main upload function
 */
async function uploadAllImages(options = {}) {
  const { dryRun = false, singleFile = null } = options;

  log('\n' + '='.repeat(60), colors.bright);
  log('  Vercel Blob Storage Migration Script', colors.bright);
  log('='.repeat(60) + '\n', colors.bright);

  // Check for token
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    logError('BLOB_READ_WRITE_TOKEN not found in environment variables');
    logInfo('Please ensure .env.local contains BLOB_READ_WRITE_TOKEN');
    process.exit(1);
  }

  logSuccess('BLOB_READ_WRITE_TOKEN found');

  // Find all image files
  logInfo(`Scanning ${PUBLIC_DIR} for image files...`);
  let imageFiles = findImageFiles(PUBLIC_DIR);

  if (singleFile) {
    imageFiles = imageFiles.filter(f =>
      f.relativePath === singleFile || f.fileName === singleFile
    );
    if (imageFiles.length === 0) {
      logError(`File not found: ${singleFile}`);
      process.exit(1);
    }
  }

  log(`\nFound ${imageFiles.length} image files:\n`, colors.cyan);

  // Display file list
  let totalSize = 0;
  for (const file of imageFiles) {
    log(`  📄 ${file.relativePath} (${formatSize(file.size)})`, colors.dim);
    totalSize += file.size;
  }

  log(`\n  Total: ${imageFiles.length} files, ${formatSize(totalSize)}\n`, colors.bright);

  if (dryRun) {
    logWarning('DRY RUN MODE - No files will be uploaded\n');
  }

  // Upload files
  const results = {
    uploaded: [],
    failed: [],
    mapping: {},
  };

  log('Starting upload process...\n', colors.cyan);

  for (let i = 0; i < imageFiles.length; i++) {
    const file = imageFiles[i];
    const progress = `[${i + 1}/${imageFiles.length}]`;

    try {
      log(`${progress} Processing: ${file.relativePath}`, colors.dim);
      const result = await uploadFile(file, dryRun);
      results.uploaded.push(result);
      results.mapping[result.originalPath] = result.blobUrl;
    } catch (error) {
      results.failed.push({
        file: file.relativePath,
        error: error.message,
      });
    }
  }

  // Summary
  log('\n' + '='.repeat(60), colors.bright);
  log('  Upload Summary', colors.bright);
  log('='.repeat(60) + '\n', colors.bright);

  logSuccess(`Successfully uploaded: ${results.uploaded.length} files`);

  if (results.failed.length > 0) {
    logError(`Failed: ${results.failed.length} files`);
    for (const failure of results.failed) {
      log(`  - ${failure.file}: ${failure.error}`, colors.red);
    }
  }

  // Save mapping file
  if (!dryRun && results.uploaded.length > 0) {
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(results.mapping, null, 2));
    logSuccess(`\nURL mapping saved to: ${OUTPUT_FILE}`);

    // Also create a TypeScript constants file
    const tsContent = generateTypeScriptConstants(results.mapping);
    const tsFile = path.join(process.cwd(), 'lib', 'blob-urls.ts');
    fs.writeFileSync(tsFile, tsContent);
    logSuccess(`TypeScript constants saved to: ${tsFile}`);
  }

  // Display mapping
  log('\n' + '-'.repeat(60), colors.dim);
  log('  URL Mapping (for code updates)', colors.bright);
  log('-'.repeat(60) + '\n', colors.dim);

  for (const [original, blob] of Object.entries(results.mapping)) {
    log(`  ${original}`, colors.yellow);
    log(`    → ${blob}\n`, colors.green);
  }

  return results;
}

/**
 * Generate TypeScript constants file for blob URLs
 */
function generateTypeScriptConstants(mapping) {
  const lines = [
    '/**',
    ' * Auto-generated Vercel Blob Storage URLs',
    ' * Generated by: scripts/upload-to-blob.js',
    ` * Generated at: ${new Date().toISOString()}`,
    ' * ',
    ' * DO NOT EDIT MANUALLY - Re-run the upload script to regenerate',
    ' */',
    '',
    '// Blob store base URL (extracted from first URL)',
  ];

  const urls = Object.values(mapping);
  if (urls.length > 0 && !urls[0].includes('DRY_RUN')) {
    // Extract base URL from the first blob URL
    const firstUrl = urls[0];
    const baseMatch = firstUrl.match(/^(https:\/\/[^/]+)/);
    if (baseMatch) {
      lines.push(`export const BLOB_STORE_BASE_URL = '${baseMatch[1]}';`);
    }
  }

  lines.push('');
  lines.push('// Individual blob URLs mapped from original paths');
  lines.push('export const BLOB_URLS: Record<string, string> = {');

  for (const [original, blob] of Object.entries(mapping)) {
    // Create a safe key name
    const keyName = original
      .replace(/^\//, '')
      .replace(/[^a-zA-Z0-9]/g, '_')
      .toUpperCase();
    lines.push(`  '${original}': '${blob}',`);
  }

  lines.push('};');
  lines.push('');
  lines.push('// Helper function to get blob URL for an image path');
  lines.push('export function getBlobUrl(imagePath: string): string {');
  lines.push('  // Normalize path to start with /');
  lines.push("  const normalizedPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;");
  lines.push('  return BLOB_URLS[normalizedPath] || imagePath;');
  lines.push('}');
  lines.push('');
  lines.push('// Check if an image path has a blob URL');
  lines.push('export function hasBlobUrl(imagePath: string): boolean {');
  lines.push("  const normalizedPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;");
  lines.push('  return normalizedPath in BLOB_URLS;');
  lines.push('}');
  lines.push('');

  return lines.join('\n');
}

/**
 * List existing blobs in storage
 */
async function listExistingBlobs() {
  log('\n' + '='.repeat(60), colors.bright);
  log('  Existing Blobs in Storage', colors.bright);
  log('='.repeat(60) + '\n', colors.bright);

  try {
    const { blobs } = await list();

    if (blobs.length === 0) {
      logInfo('No blobs found in storage');
      return;
    }

    log(`Found ${blobs.length} blobs:\n`, colors.cyan);

    for (const blob of blobs) {
      log(`  📦 ${blob.pathname}`, colors.dim);
      log(`     URL: ${blob.url}`, colors.green);
      log(`     Size: ${formatSize(blob.size)}`, colors.dim);
      log(`     Uploaded: ${new Date(blob.uploadedAt).toLocaleString()}\n`, colors.dim);
    }
  } catch (error) {
    logError(`Failed to list blobs: ${error.message}`);
  }
}

// Parse command line arguments
const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');
const listOnly = args.includes('--list');
const singleFileIndex = args.indexOf('--single');
const singleFile = singleFileIndex !== -1 ? args[singleFileIndex + 1] : null;

// Run
if (listOnly) {
  listExistingBlobs();
} else {
  uploadAllImages({ dryRun, singleFile })
    .then(results => {
      if (results.failed.length > 0) {
        process.exit(1);
      }
    })
    .catch(error => {
      logError(`Upload failed: ${error.message}`);
      process.exit(1);
    });
}
