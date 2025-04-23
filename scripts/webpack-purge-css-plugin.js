// scripts/webpack-purge-css-plugin.js
/**
 * Custom CSS purging plugin for webpack to reduce bundle size
 * Part of VoidBloom Theme Audit requirement for bundle budget ≤ 50 MB
 */

const glob = require('glob');
const path = require('path');
const { PurgeCSS } = require('purgecss');
const fs = require('fs');
const chalk = require('chalk');

class WebpackPurgeCSSPlugin {
  constructor(options = {}) {
    this.options = {
      paths: [
        './snippets/**/*.liquid',
        './templates/**/*.liquid',
        './sections/**/*.liquid',
        './layout/**/*.liquid',
      ],
      safelist: {
        standard: [
          // Critical classes that should never be purged
          /trauma/,
          /quantum/,
          /vb-/,
          /hologram/,
          /is-/,
          /has-/,
          /active/,
          /open/,
          /hidden/,
          /visible/,
          /fade/,
          /slide/,
          /blur/,
          'fade-in',
          'fade-out',
          'active',
          'selected',

          // Shopify admin classes
          /^shopify/,
          /^Shopify/,
          /^admin-/,
        ],
        deep: [/trauma-.*__/, /quantum-.*__/, /vb-.*__/],
        greedy: [
          // Preserve all aria and data states
          /^aria-/,
          /^data-/,
        ],
      },
      // Paths to CSS files that should be ignored by purge
      ignoreCSS: ['node_modules', 'trauma-effects.css', 'animations.css', 'focus-states.css'],
      ...options,
    };
  }

  apply(compiler) {
    // Hook into the emit phase
    compiler.hooks.emit.tapAsync('WebpackPurgeCSSPlugin', async (compilation, callback) => {
      try {
        console.log(chalk.blue('🧹 Running CSS purge to reduce bundle size...'));

        // Find all CSS assets in the compilation
        const cssAssets = Object.keys(compilation.assets).filter(
          (name) =>
            name.endsWith('.css') && !this.options.ignoreCSS.some((ignore) => name.includes(ignore))
        );

        // Get content from the paths for purging
        const content = [];
        this.options.paths.forEach((pattern) => {
          const files = glob.sync(pattern);
          files.forEach((file) => {
            if (fs.existsSync(file)) {
              content.push(file);
            }
          });
        });

        // Track total size reduction
        let totalSizeBefore = 0;
        let totalSizeAfter = 0;

        // Process each CSS asset
        for (const assetName of cssAssets) {
          const asset = compilation.assets[assetName];
          const originalCss = asset.source();
          totalSizeBefore += originalCss.length;

          // Run PurgeCSS on the asset
          const purgeResults = await new PurgeCSS().purge({
            content,
            css: [{ raw: originalCss, extension: 'css' }],
            safelist: this.options.safelist,
            rejected: true, // Track rejected selectors for debugging
          });

          if (purgeResults.length > 0) {
            const purgedCss = purgeResults[0].css;
            totalSizeAfter += purgedCss.length;

            // Only replace the asset if we actually removed something
            // and didn't completely break it
            if (purgedCss.length < originalCss.length && purgedCss.length > 0) {
              // Replace the asset with the purged version
              compilation.assets[assetName] = {
                source: () => purgedCss,
                size: () => purgedCss.length,
              };

              const rejectedCount = purgeResults[0].rejected ? purgeResults[0].rejected.length : 0;
              const reductionPercentage = (
                ((originalCss.length - purgedCss.length) / originalCss.length) *
                100
              ).toFixed(2);

              console.log(
                chalk.green(`✅ Purged ${assetName}: `) +
                  chalk.yellow(
                    `${(originalCss.length / 1024).toFixed(2)} KB → ${(
                      purgedCss.length / 1024
                    ).toFixed(2)} KB `
                  ) +
                  chalk.green(
                    `(${reductionPercentage}% reduction, ${rejectedCount} selectors removed)`
                  )
              );
            } else {
              console.log(
                chalk.yellow(
                  `⚠️ Skipped ${assetName}: No significant reduction or too aggressive purging`
                )
              );
            }
          }
        }

        // Log overall results
        const totalReductionKB = ((totalSizeBefore - totalSizeAfter) / 1024).toFixed(2);
        const totalReductionPercentage = (
          ((totalSizeBefore - totalSizeAfter) / totalSizeBefore) *
          100
        ).toFixed(2);

        if (totalSizeBefore > totalSizeAfter) {
          console.log(
            chalk.blue('📊 Total CSS reduction: ') +
              chalk.green(`${totalReductionKB} KB (${totalReductionPercentage}%)`)
          );
        } else {
          console.log(chalk.yellow('⚠️ No overall CSS size reduction achieved'));
        }

        callback();
      } catch (error) {
        console.error(chalk.red('❌ Error in PurgeCSS plugin:'), error);
        callback();
      }
    });
  }
}

module.exports = WebpackPurgeCSSPlugin;
