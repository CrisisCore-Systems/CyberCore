// scripts/check-size.js
const fs = require('fs');
const path = require('path');
const chalk = require('chalk') || {
  red: (t) => t,
  green: (t) => t,
  yellow: (t) => t,
  bold: (t) => t,
};

// Configuration
const MAX_BUNDLE_SIZE_MB = 50;
const MAX_BUNDLE_SIZE_BYTES = MAX_BUNDLE_SIZE_MB * 1024 * 1024;
const DIST_DIR = path.resolve(__dirname, '../dist');

/**
 * Get the size of a directory recursively
 * @param {string} dirPath - The directory path to check
 * @returns {Object} Object containing total size and file sizes by type
 */
function getDirSize(dirPath) {
  const stats = {
    totalSize: 0,
    fileTypes: {},
    largestFiles: [],
    detailedBreakdown: {
      js: { size: 0, count: 0 },
      css: { size: 0, count: 0 },
      html: { size: 0, count: 0 },
      images: { size: 0, count: 0 },
      other: { size: 0, count: 0 },
    },
  };

  // Helper to track largest files
  function addToLargestFiles(filePath, size) {
    stats.largestFiles.push({ path: filePath, size });
    // Sort by size descending and keep only top 20
    stats.largestFiles.sort((a, b) => b.size - a.size);
    if (stats.largestFiles.length > 20) {
      stats.largestFiles.pop();
    }
  }

  function processDir(currentPath) {
    const files = fs.readdirSync(currentPath);

    for (const file of files) {
      const filePath = path.join(currentPath, file);
      const fileStat = fs.statSync(filePath);

      if (fileStat.isDirectory()) {
        processDir(filePath);
      } else {
        const fileSize = fileStat.size;
        stats.totalSize += fileSize;

        // Track by file extension
        const ext = path.extname(file).toLowerCase();
        if (!stats.fileTypes[ext]) {
          stats.fileTypes[ext] = { size: 0, count: 0 };
        }
        stats.fileTypes[ext].size += fileSize;
        stats.fileTypes[ext].count += 1;

        // Detailed breakdown
        if (['.js', '.mjs'].includes(ext)) {
          stats.detailedBreakdown.js.size += fileSize;
          stats.detailedBreakdown.js.count += 1;
        } else if (ext === '.css') {
          stats.detailedBreakdown.css.size += fileSize;
          stats.detailedBreakdown.css.count += 1;
        } else if (ext === '.html') {
          stats.detailedBreakdown.html.size += fileSize;
          stats.detailedBreakdown.html.count += 1;
        } else if (['.jpg', '.jpeg', '.png', '.gif', '.svg', '.webp', '.avif'].includes(ext)) {
          stats.detailedBreakdown.images.size += fileSize;
          stats.detailedBreakdown.images.count += 1;
        } else {
          stats.detailedBreakdown.other.size += fileSize;
          stats.detailedBreakdown.other.count += 1;
        }

        // Track largest files
        addToLargestFiles(filePath.replace(DIST_DIR, ''), fileSize);
      }
    }
  }

  if (fs.existsSync(dirPath)) {
    processDir(dirPath);
  } else {
    console.error(`Directory does not exist: ${dirPath}`);
    process.exit(1);
  }

  return stats;
}

/**
 * Format bytes to human-readable format
 * @param {number} bytes - The number of bytes
 * @param {number} decimals - Number of decimal places to show
 * @returns {string} Human-readable size string
 */
function formatBytes(bytes, decimals = 2) {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

/**
 * Print the stats in a readable format
 * @param {Object} stats - The stats object from getDirSize
 */
function printStats(stats) {
  console.log('📦 Bundle Size Analysis:');
  console.log('-'.repeat(50));

  // Total size with colorization based on limit
  const totalSizeMB = stats.totalSize / (1024 * 1024);
  const sizeText = `Total Size: ${formatBytes(stats.totalSize)} (${totalSizeMB.toFixed(2)} MB)`;

  if (stats.totalSize > MAX_BUNDLE_SIZE_BYTES) {
    console.log(chalk.red.bold(`❌ ${sizeText} - Exceeds limit of ${MAX_BUNDLE_SIZE_MB} MB!`));
  } else if (stats.totalSize > MAX_BUNDLE_SIZE_BYTES * 0.9) {
    console.log(chalk.yellow.bold(`⚠️ ${sizeText} - Near limit of ${MAX_BUNDLE_SIZE_MB} MB`));
  } else {
    console.log(chalk.green.bold(`✅ ${sizeText} - Under limit of ${MAX_BUNDLE_SIZE_MB} MB`));
  }

  console.log('-'.repeat(50));
  console.log('🔍 Breakdown by Category:');
  console.log(
    `JavaScript: ${formatBytes(stats.detailedBreakdown.js.size)} (${
      stats.detailedBreakdown.js.count
    } files)`
  );
  console.log(
    `CSS: ${formatBytes(stats.detailedBreakdown.css.size)} (${
      stats.detailedBreakdown.css.count
    } files)`
  );
  console.log(
    `HTML: ${formatBytes(stats.detailedBreakdown.html.size)} (${
      stats.detailedBreakdown.html.count
    } files)`
  );
  console.log(
    `Images: ${formatBytes(stats.detailedBreakdown.images.size)} (${
      stats.detailedBreakdown.images.count
    } files)`
  );
  console.log(
    `Other: ${formatBytes(stats.detailedBreakdown.other.size)} (${
      stats.detailedBreakdown.other.count
    } files)`
  );

  console.log('-'.repeat(50));
  console.log('📂 Breakdown by File Extension:');

  // Sort extensions by size (descending)
  const sortedExtensions = Object.entries(stats.fileTypes).sort((a, b) => b[1].size - a[1].size);

  sortedExtensions.forEach(([ext, data]) => {
    console.log(`${ext || 'No extension'}: ${formatBytes(data.size)} (${data.count} files)`);
  });

  console.log('-'.repeat(50));
  console.log('📁 Largest Files:');

  stats.largestFiles.forEach((file, index) => {
    console.log(`${index + 1}. ${file.path}: ${formatBytes(file.size)}`);
  });

  // Output recommendations if over limit
  if (stats.totalSize > MAX_BUNDLE_SIZE_BYTES) {
    console.log('-'.repeat(50));
    console.log('🔧 Recommendations to reduce bundle size:');

    // Recommend optimization of largest category
    const largestCategory = Object.entries(stats.detailedBreakdown).sort(
      (a, b) => b[1].size - a[1].size
    )[0];

    if (largestCategory[0] === 'js') {
      console.log('• Implement code splitting for JavaScript files');
      console.log('• Use dynamic imports for large libraries like Three.js');
      console.log('• Ensure all JavaScript is properly tree-shaken');
      console.log('• Remove unused code and dependencies');
    } else if (largestCategory[0] === 'images') {
      console.log('• Further optimize and compress images');
      console.log('• Convert images to more efficient formats (WebP, AVIF)');
      console.log('• Implement lazy loading for images');
      console.log('• Consider using responsive images with srcset');
    } else if (largestCategory[0] === 'css') {
      console.log('• Purge unused CSS');
      console.log('• Split CSS into critical and non-critical');
      console.log('• Minimize CSS selector complexity');
    }

    console.log('• Review and optimize the largest files listed above');
    console.log('• Consider implementing a CDN for large static assets');
  }
}

/**
 * Main function
 */
function main() {
  if (!fs.existsSync(DIST_DIR)) {
    console.error(`Dist directory not found: ${DIST_DIR}`);
    console.error('Please run "npm run build" first to generate the build files.');
    process.exit(1);
  }

  const stats = getDirSize(DIST_DIR);
  printStats(stats);

  // Generate a JSON report for potential CI integration
  const reportPath = path.resolve(__dirname, '../bundle-size-report.json');
  fs.writeFileSync(
    reportPath,
    JSON.stringify(
      {
        timestamp: new Date().toISOString(),
        maxSizeBytes: MAX_BUNDLE_SIZE_BYTES,
        totalSizeBytes: stats.totalSize,
        breakdown: stats.detailedBreakdown,
        largestFiles: stats.largestFiles,
        overLimit: stats.totalSize > MAX_BUNDLE_SIZE_BYTES,
      },
      null,
      2
    )
  );

  console.log(`📊 Report saved to ${reportPath}`);

  // Exit with error code if over limit
  if (stats.totalSize > MAX_BUNDLE_SIZE_BYTES) {
    process.exit(1);
  }
}

// Run the main function
main();
