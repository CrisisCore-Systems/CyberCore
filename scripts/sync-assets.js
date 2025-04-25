/**
 * SYNC-ASSETS.JS
 * This script ensures that built assets are properly linked to the deployment directory
 * so they can be served correctly by the dev server.
 */

const fs = require('fs');
const path = require('path');

// Configuration
const config = {
  sourceDir: path.resolve(__dirname, '../assets'),
  distDir: path.resolve(__dirname, '../dist'),
  deployDir: path.resolve(__dirname, '../deploy/dev/assets'),
  // Critical assets that must be available
  essentialAssets: [
    'glitch-engine.js',
    'neural-bus.js',
    'ar-bridge.js',
    'cart-system.js',
    'quantum-visualizer.js',
    'hologram-renderer.js',
  ],
  // Additional assets that should be synchronized if they exist
  additionalAssets: [
    'webgl-bundle.js',
    'core-bundle.js',
    'cart-bundle.js',
    'ritual-engine.js',
    'voidbloom-store.js',
    'main-styles.css',
  ],
};

console.log('🔄 Syncing essential assets to dev deployment directory...');

// Ensure deploy assets directory exists
if (!fs.existsSync(config.deployDir)) {
  console.log(`📁 Creating deploy assets directory: ${config.deployDir}`);
  fs.mkdirSync(config.deployDir, { recursive: true });
}

// Function to process a single asset file
function processAsset(file, isEssential = true) {
  const sourcePath = path.join(config.sourceDir, file);
  const deployPath = path.join(config.deployDir, file);
  const distPath = path.join(config.distDir, file);

  try {
    // First check if file exists in source directory
    if (fs.existsSync(sourcePath)) {
      fs.copyFileSync(sourcePath, deployPath);
      console.log(`✅ Copied from source: ${file}`);
    }
    // Next check if it exists in dist
    else if (fs.existsSync(distPath)) {
      fs.copyFileSync(distPath, deployPath);
      console.log(`✅ Copied from dist: ${file}`);
    }
    // For essential assets, create a stub if not found
    else if (isEssential) {
      // Create a stub file if neither exists
      const className = path
        .basename(file, '.js')
        .split('-')
        .map((part, index) => (index === 0 ? part : part.charAt(0).toUpperCase() + part.slice(1)))
        .join('');

      // Create appropriate stub based on file type
      let stubContent;
      if (file.endsWith('.css')) {
        stubContent = `/* Stub for ${file} */\n`;
      } else {
        // Browser-compatible stubs that don't use ES module syntax
        stubContent = `/**
 * Stub implementation for ${file}
 * This is a placeholder created by the asset sync script.
 */
(function(window) {
  'use strict';

  // Create the class constructor
  function ${className}(options) {
    options = options || {};
    console.info('${className} stub initialized');
    this.options = options;
  }

  // Add methods to the prototype
  ${className}.prototype.initialize = function() {
    console.info('${className}.initialize() called');
    return this;
  };

  // Add static methods
  ${className}.getInstance = function() {
    console.info('${className}.getInstance() called');
    return new ${className}();
  };

  // Assign to global scope for browser usage
  window.${className} = ${className};

})(typeof window !== 'undefined' ? window : global);
`;
      }

      fs.writeFileSync(deployPath, stubContent);
      console.log(`⚠️ Created stub for: ${file}`);
    } else {
      console.log(`ℹ️ Skipping non-essential asset: ${file}`);
    }
  } catch (error) {
    console.error(`❌ Error processing ${file}:`, error.message);
  }
}

// Process all essential assets first
console.log('Processing essential assets:');
config.essentialAssets.forEach((file) => processAsset(file, true));

// Process additional assets
console.log('\nProcessing additional assets:');
config.additionalAssets.forEach((file) => processAsset(file, false));

console.log('\n🎉 Asset sync complete!');
console.log(`ℹ️ Assets are available at ${config.deployDir}`);

// Execute this script if it's the main module
if (require.main === module) {
  // We're done - the script ran as expected
  process.exit(0);
}

module.exports = {
  syncAssets: function () {
    // Process all essential assets
    config.essentialAssets.forEach((file) => processAsset(file, true));
    // Process additional assets
    config.additionalAssets.forEach((file) => processAsset(file, false));
    return true;
  },
};
