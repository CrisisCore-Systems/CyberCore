#!/usr/bin/env node

/**
 * VoidBloom Theme Direct Deployment Script
 *
 * This script packages the VoidBloom theme for Shopify deployment
 * by directly copying the theme files in their correct structure.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const archiver = require('archiver');

// Configuration
const config = {
  themeName: 'VoidBloom',
  zipOutput: 'deploy/voidbloom-theme.zip',
  directories: ['layout', 'templates', 'snippets', 'sections', 'config', 'locales', 'assets'],
};

console.log(`\n🌸 Preparing ${config.themeName} for Shopify Deployment\n`);

// Step 1: Ensure the deploy directory exists
console.log('📁 Preparing deployment directory...');
if (!fs.existsSync(path.dirname(config.zipOutput))) {
  fs.mkdirSync(path.dirname(config.zipOutput), { recursive: true });
}

// Step 2: Create zip archive
console.log('🗜️  Creating theme archive...');
const output = fs.createWriteStream(config.zipOutput);
const archive = archiver('zip', {
  zlib: { level: 9 }, // Maximum compression
});

output.on('close', function () {
  console.log(`✅ Archive created successfully: ${config.zipOutput}`);
  console.log(`   Total size: ${(archive.pointer() / 1024 / 1024).toFixed(2)} MB`);
  console.log('\n🚀 Theme is ready for upload to Shopify\n');
  console.log('   Upload Instructions:');
  console.log('   1. Go to your Shopify admin panel');
  console.log('   2. Navigate to Online Store > Themes');
  console.log('   3. Click "Add theme" > "Upload zip file"');
  console.log('   4. Select the generated zip file from:');
  console.log(`      ${path.resolve(config.zipOutput)}\n`);
  console.log('🔍 If you encounter 404 errors after upload:');
  console.log('   - Check that all liquid templates are in the correct folders');
  console.log('   - Verify that all asset references in liquid files match the actual filenames');
  console.log('   - Ensure theme.liquid in the layout/ folder contains valid asset references\n');
});

archive.on('error', function (err) {
  console.error('❌ Archive creation failed', err);
  process.exit(1);
});

archive.pipe(output);

// Add directories directly to the zip
config.directories.forEach((dir) => {
  if (fs.existsSync(dir)) {
    archive.directory(dir, dir);
    console.log(`   ✓ Adding directory: ${dir}`);
  } else {
    console.log(`   ✗ Directory not found: ${dir}`);
  }
});

// Finalize the archive
archive.finalize();
