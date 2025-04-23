// scripts/accessibility-test.js
/**
 * Accessibility testing with Axe-Core
 * Part of VoidBloom Theme Audit requirement for accessibility enforcement
 */

const puppeteer = require('puppeteer');
const { AxePuppeteer } = require('@axe-core/puppeteer');
const fs = require('fs');
const path = require('path');
const chalk = require('chalk');

// Configuration
const config = {
  // URLs to test (can be local dev server or production URLs)
  urls: [
    'http://localhost:8080',
    'http://localhost:8080/collections',
    'http://localhost:8080/products/sample-product',
    'http://localhost:8080/cart',
    'http://localhost:8080/account',
  ],
  // Output directory for reports
  outputDir: path.resolve(__dirname, '../test-results/accessibility'),
  // Axe configuration
  axeConfig: {
    runOnly: {
      type: 'tag',
      values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'best-practice'],
    },
    // You can disable specific rules here if they're not applicable
    // disableRules: ['color-contrast'],
  },
  // Browserstack configuration (if using)
  browserstack: {
    enabled: false,
    user: process.env.BROWSERSTACK_USERNAME,
    key: process.env.BROWSERSTACK_ACCESS_KEY,
    browsers: [
      { os: 'Windows', os_version: '10', browser: 'Chrome', browser_version: 'latest' },
      { os: 'OS X', os_version: 'Big Sur', browser: 'Safari', browser_version: 'latest' },
    ],
  },
  // Viewport sizes to test
  viewports: [
    { width: 375, height: 667, name: 'mobile' },
    { width: 768, height: 1024, name: 'tablet' },
    { width: 1280, height: 800, name: 'desktop' },
  ],
};

// Create output directory if it doesn't exist
if (!fs.existsSync(config.outputDir)) {
  fs.mkdirSync(config.outputDir, { recursive: true });
}

/**
 * Formats accessibility violations for better readability
 * @param {Array} violations - The accessibility violations from Axe
 * @returns {Object} Formatted violations data
 */
function formatViolations(violations) {
  return violations.map((violation) => ({
    id: violation.id,
    impact: violation.impact,
    description: violation.help,
    helpUrl: violation.helpUrl,
    nodes: violation.nodes.map((node) => ({
      html: node.html,
      failureSummary: node.failureSummary,
      target: node.target,
    })),
  }));
}

/**
 * Runs accessibility tests on a single URL with multiple viewports
 * @param {string} url - The URL to test
 * @param {Object} browser - Puppeteer browser instance
 */
async function testUrl(url, browser) {
  console.log(chalk.blue(`Testing URL: ${url}`));

  // Create results object for this URL
  const urlResults = {
    url,
    timestamp: new Date().toISOString(),
    viewportResults: [],
  };

  // Test each viewport
  for (const viewport of config.viewports) {
    console.log(chalk.cyan(`  Viewport: ${viewport.name} (${viewport.width}x${viewport.height})`));

    // Create a new page for this test
    const page = await browser.newPage();
    await page.setViewport(viewport);

    try {
      // Navigate to the URL
      await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });

      // Allow some time for animations and dynamic content to load
      await page.waitForTimeout(2000);

      // Run Axe analysis
      const results = await new AxePuppeteer(page).configure(config.axeConfig).analyze();

      // Format and add results to our data structure
      const viewportResult = {
        viewport: viewport.name,
        dimensions: `${viewport.width}x${viewport.height}`,
        violations: formatViolations(results.violations),
        passes: results.passes.length,
        incomplete: results.incomplete.length,
        violationCount: results.violations.length,
      };

      urlResults.viewportResults.push(viewportResult);

      // Log violations to console
      if (viewportResult.violations.length > 0) {
        console.log(
          chalk.red(`    ❌ Found ${viewportResult.violations.length} accessibility violations`)
        );
        viewportResult.violations.forEach((violation) => {
          console.log(
            chalk.yellow(`      • ${violation.id} (${violation.impact}): ${violation.description}`)
          );
          console.log(chalk.gray(`        ${violation.helpUrl}`));
        });
      } else {
        console.log(chalk.green(`    ✅ No accessibility violations found`));
      }
    } catch (error) {
      console.error(chalk.red(`    Error testing ${url} at viewport ${viewport.name}:`), error);

      // Add error to results
      urlResults.viewportResults.push({
        viewport: viewport.name,
        dimensions: `${viewport.width}x${viewport.height}`,
        error: error.message,
      });
    } finally {
      await page.close();
    }
  }

  // Save results to file
  const urlSlug = url
    .replace(/^https?:\/\//, '')
    .replace(/[^\w]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');

  const outputPath = path.join(
    config.outputDir,
    `axe-results-${urlSlug}-${new Date().toISOString().replace(/:/g, '-')}.json`
  );

  fs.writeFileSync(outputPath, JSON.stringify(urlResults, null, 2));
  console.log(chalk.blue(`  Results saved to: ${outputPath}`));

  return urlResults;
}

/**
 * Main function to run all tests
 */
async function runTests() {
  console.log(chalk.blue('🔍 Running VoidBloom Accessibility Tests'));
  console.log(chalk.blue('======================================='));

  let browser;
  try {
    // Launch browser
    browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    // Track all results and summary
    const allResults = [];
    const summary = {
      totalViolations: 0,
      criticalViolations: 0,
      seriousViolations: 0,
      moderateViolations: 0,
      minorViolations: 0,
      urlsTested: 0,
      urlsWithViolations: 0,
    };

    // Test each URL
    for (const url of config.urls) {
      const result = await testUrl(url, browser);
      allResults.push(result);

      // Count violations for summary
      let urlHasViolations = false;
      result.viewportResults.forEach((viewportResult) => {
        if (viewportResult.violations) {
          summary.totalViolations += viewportResult.violations.length;

          viewportResult.violations.forEach((violation) => {
            if (violation.impact === 'critical') summary.criticalViolations++;
            if (violation.impact === 'serious') summary.seriousViolations++;
            if (violation.impact === 'moderate') summary.moderateViolations++;
            if (violation.impact === 'minor') summary.minorViolations++;
          });

          if (viewportResult.violations.length > 0) {
            urlHasViolations = true;
          }
        }
      });

      summary.urlsTested++;
      if (urlHasViolations) {
        summary.urlsWithViolations++;
      }
    }

    // Save full report
    const summaryFilePath = path.join(
      config.outputDir,
      `axe-summary-${new Date().toISOString().replace(/:/g, '-')}.json`
    );

    fs.writeFileSync(summaryFilePath, JSON.stringify({ summary, results: allResults }, null, 2));

    // Print summary
    console.log(chalk.blue('\n📊 Accessibility Test Summary'));
    console.log(chalk.blue('============================='));
    console.log(`URLs tested: ${summary.urlsTested}`);
    console.log(`URLs with violations: ${summary.urlsWithViolations}`);
    console.log(`Total violations: ${summary.totalViolations}`);
    console.log(`  Critical: ${chalk.red(summary.criticalViolations)}`);
    console.log(`  Serious: ${chalk.yellow(summary.seriousViolations)}`);
    console.log(`  Moderate: ${chalk.cyan(summary.moderateViolations)}`);
    console.log(`  Minor: ${chalk.gray(summary.minorViolations)}`);

    // Fail if critical or serious violations exist
    const hasFailingViolations = summary.criticalViolations > 0 || summary.seriousViolations > 0;

    if (hasFailingViolations) {
      console.log(
        chalk.red('\n❌ Accessibility tests failed due to critical or serious violations')
      );
      process.exit(1);
    } else if (summary.totalViolations > 0) {
      console.log(
        chalk.yellow(
          '\n⚠️ Accessibility tests passed with warnings (moderate or minor issues found)'
        )
      );
    } else {
      console.log(chalk.green('\n✅ Accessibility tests passed with no violations'));
    }
  } catch (error) {
    console.error(chalk.red('Error running accessibility tests:'), error);
    process.exit(1);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

// Run tests when executed directly
if (require.main === module) {
  runTests();
}

module.exports = {
  runTests,
  testUrl,
};
