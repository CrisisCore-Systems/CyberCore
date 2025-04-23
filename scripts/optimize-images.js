// scripts/optimize-images.js
const { readdir, stat, mkdir, writeFile } = require('fs/promises');
const path = require('path');
const sharp = require('sharp');
const svgo = require('svgo');
const { cpus } = require('os');
const { promisify } = require('util');
const { createReadStream, existsSync } = require('fs');
const { pipeline } = require('stream');
const { createGzip, createBrotliCompress } = require('zlib');

const pipelineAsync = promisify(pipeline);
const numCpus = cpus().length;

// Configuration
const config = {
  // Image formats to process
  imageExtensions: ['.jpg', '.jpeg', '.png', '.gif', '.svg', '.webp'],

  // Sharp configuration for different image types
  sharp: {
    jpeg: {
      quality: 80,
      progressive: true,
      mozjpeg: true, // Use mozjpeg for better compression
    },
    png: {
      quality: 80,
      compressionLevel: 9,
      palette: true,
    },
    webp: {
      quality: 80,
      effort: 6,
    },
    gif: {
      // GIF optimization is limited but we'll still process them
    },
    avif: {
      quality: 65,
      effort: 8,
    },
  },

  // SVGO configuration
  svgo: {
    multipass: true,
    plugins: [
      {
        name: 'preset-default',
        params: {
          overrides: {
            removeViewBox: false,
            cleanupIDs: true,
            removeUselessStrokeAndFill: true,
            convertColors: true,
            removeUnknownsAndDefaults: true,
          },
        },
      },
      'sortAttrs',
      'removeScriptElement',
    ],
  },

  // Compression options
  compress: {
    gzip: {
      level: 9,
    },
    brotli: {
      params: {
        [require('zlib').constants.BROTLI_PARAM_QUALITY]: 11,
      },
    },
  },

  // Generate WebP and AVIF versions
  generateFormats: {
    webp: true,
    avif: true,
  },
};

// Helper function to get all image files in a directory
async function getAllImageFiles(directory) {
  const imageFiles = [];

  async function processDir(currentDir) {
    const files = await readdir(currentDir);

    for (const file of files) {
      const filePath = path.join(currentDir, file);
      const stats = await stat(filePath);

      if (stats.isDirectory()) {
        await processDir(filePath);
      } else if (config.imageExtensions.includes(path.extname(file).toLowerCase())) {
        imageFiles.push(filePath);
      }
    }
  }

  await processDir(directory);
  return imageFiles;
}

// Process images in batches to avoid memory issues
async function processBatch(imageFiles, batchSize = 10) {
  const results = {
    total: imageFiles.length,
    processed: 0,
    skipped: 0,
    errors: 0,
    originalSize: 0,
    optimizedSize: 0,
  };

  console.log(`Processing ${imageFiles.length} images in batches of ${batchSize}...`);

  for (let i = 0; i < imageFiles.length; i += batchSize) {
    const batch = imageFiles.slice(i, i + batchSize);
    await Promise.all(
      batch.map(async (file) => {
        try {
          const result = await optimizeImage(file);

          if (result.skipped) {
            results.skipped++;
          } else {
            results.processed++;
            results.originalSize += result.originalSize;
            results.optimizedSize += result.optimizedSize;
          }
        } catch (error) {
          console.error(`Error optimizing ${file}:`, error.message);
          results.errors++;
        }
      })
    );

    console.log(
      `Progress: ${Math.min(i + batchSize, imageFiles.length)}/${imageFiles.length} images`
    );
  }

  return results;
}

// Optimize a single image
async function optimizeImage(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const stats = await stat(filePath);
  const originalSize = stats.size;

  // If the file is too small, skip it
  if (originalSize < 10 * 1024) {
    // Less than 10KB
    return { skipped: true, reason: 'file too small' };
  }

  // SVG files are handled differently
  if (ext === '.svg') {
    return optimizeSvg(filePath, originalSize);
  }

  // For other image types, use sharp
  let sharpInstance = sharp(filePath, { failOnError: false });
  const metadata = await sharpInstance.metadata();

  // Determine output format based on input
  let outputOptions;
  let outputFormat;

  if (ext === '.jpg' || ext === '.jpeg') {
    outputOptions = config.sharp.jpeg;
    outputFormat = 'jpeg';
  } else if (ext === '.png') {
    outputOptions = config.sharp.png;
    outputFormat = 'png';
  } else if (ext === '.webp') {
    outputOptions = config.sharp.webp;
    outputFormat = 'webp';
  } else if (ext === '.gif') {
    // GIFs are tricky with sharp, we'll just compress mildly
    outputOptions = config.sharp.gif;
    outputFormat = 'gif';
  } else {
    // For unsupported formats, skip
    return { skipped: true, reason: 'unsupported format' };
  }

  // Process the image
  const optimizedBuffer = await sharpInstance[outputFormat](outputOptions).toBuffer();

  // Save the optimized image
  await writeFile(filePath, optimizedBuffer);

  // Generate WebP version if enabled and source isn't already WebP
  if (config.generateFormats.webp && ext !== '.webp') {
    const webpPath = filePath.replace(ext, '.webp');
    await sharpInstance.webp(config.sharp.webp).toFile(webpPath);
  }

  // Generate AVIF version if enabled (for modern browsers)
  if (config.generateFormats.avif) {
    // Skip AVIF generation for GIFs as it doesn't support animation
    if (ext !== '.gif' || (ext === '.gif' && !metadata.pages)) {
      const avifPath = filePath.replace(ext, '.avif');
      try {
        await sharpInstance.avif(config.sharp.avif).toFile(avifPath);
      } catch (error) {
        // AVIF might not be supported, so just log and continue
        console.warn(`Could not generate AVIF for ${filePath}: ${error.message}`);
      }
    }
  }

  // Get the new size
  const newStats = await stat(filePath);
  const optimizedSize = newStats.size;

  // Generate compressed versions for web servers that support pre-compression
  await generateCompressedVersions(filePath);

  return {
    skipped: false,
    originalSize,
    optimizedSize,
    savings: originalSize - optimizedSize,
    savingsPercent: ((originalSize - optimizedSize) / originalSize) * 100,
  };
}

// Optimize SVG using SVGO
async function optimizeSvg(filePath, originalSize) {
  const svgContent = await require('fs').promises.readFile(filePath, 'utf8');

  // Optimize with SVGO
  const result = svgo.optimize(svgContent, {
    path: filePath,
    ...config.svgo,
  });

  // Save the optimized SVG
  await writeFile(filePath, result.data);

  // Get the new size
  const newStats = await stat(filePath);
  const optimizedSize = newStats.size;

  // Generate compressed versions
  await generateCompressedVersions(filePath);

  return {
    skipped: false,
    originalSize,
    optimizedSize,
    savings: originalSize - optimizedSize,
    savingsPercent: ((originalSize - optimizedSize) / originalSize) * 100,
  };
}

// Generate gzip and brotli compressed versions for web servers
async function generateCompressedVersions(filePath) {
  try {
    // Gzip compression
    const gzipPath = `${filePath}.gz`;
    const gzipStream = createGzip(config.compress.gzip);
    await pipelineAsync(
      createReadStream(filePath),
      gzipStream,
      require('fs').createWriteStream(gzipPath)
    );

    // Brotli compression (better than gzip)
    const brotliPath = `${filePath}.br`;
    const brotliStream = createBrotliCompress(config.compress.brotli);
    await pipelineAsync(
      createReadStream(filePath),
      brotliStream,
      require('fs').createWriteStream(brotliPath)
    );

    return true;
  } catch (error) {
    console.error(`Error compressing ${filePath}:`, error.message);
    return false;
  }
}

// Format bytes to human-readable format
function formatBytes(bytes, decimals = 2) {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

// Main function
async function main() {
  console.log('🚀 Starting image optimization with Squoosh/GFX pipeline...');
  console.log(`📊 Using up to ${numCpus} CPU cores`);

  try {
    // Create necessary directories
    const optimizedDir = path.resolve(__dirname, '../optimized');
    if (!existsSync(optimizedDir)) {
      await mkdir(optimizedDir, { recursive: true });
    }

    // Optimize images in assets folder
    const assetsDir = path.resolve(__dirname, '../assets');
    const imageFiles = await getAllImageFiles(assetsDir);

    console.log(`📷 Found ${imageFiles.length} images to optimize`);

    // Process all images
    const results = await processBatch(imageFiles, Math.max(1, Math.floor(numCpus / 2)));

    // Print results
    console.log('\n✅ Image optimization complete!');
    console.log('📊 Results:');
    console.log(`  • Total images: ${results.total}`);
    console.log(`  • Processed: ${results.processed}`);
    console.log(`  • Skipped: ${results.skipped}`);
    console.log(`  • Errors: ${results.errors}`);
    console.log(`  • Original size: ${formatBytes(results.originalSize)}`);
    console.log(`  • Optimized size: ${formatBytes(results.optimizedSize)}`);
    console.log(
      `  • Size reduction: ${formatBytes(results.originalSize - results.optimizedSize)} (${(
        ((results.originalSize - results.optimizedSize) / results.originalSize) *
        100
      ).toFixed(2)}%)`
    );

    // Print bonus formats
    if (config.generateFormats.webp) {
      console.log('🌟 WebP versions generated for better web performance');
    }
    if (config.generateFormats.avif) {
      console.log('🌟 AVIF versions generated for even better web performance in modern browsers');
    }

    console.log('\n🔍 Next steps:');
    console.log('  • Use <picture> elements with <source> tags for WebP and AVIF formats');
    console.log(
      '  • Configure your server to serve pre-compressed files with .gz and .br extensions'
    );
    console.log('  • Update image references in your code to use the new optimized versions');
  } catch (error) {
    console.error('❌ Error optimizing images:', error);
    process.exit(1);
  }
}

// Run the main function
main();
