// tests/accessibility/accessibility.test.js
/**
 * Jest tests for accessibility using Axe-Core
 * This fulfills the VoidBloom Theme Audit requirement to fail build on accessibility violations
 */

const { runTests } = require('../../scripts/accessibility-test');

// Make test timeout longer to accommodate accessibility testing
jest.setTimeout(120000);

describe('Accessibility Tests', () => {
  it('should pass accessibility tests without critical or serious violations', async () => {
    // Mock console.log/error to capture output
    const originalConsoleLog = console.log;
    const originalConsoleError = console.error;

    let testOutput = [];
    let testError = null;

    console.log = (...args) => {
      testOutput.push(args.join(' '));
    };

    console.error = (...args) => {
      testOutput.push(args.join(' '));
    };

    try {
      await runTests();
    } catch (error) {
      testError = error;
    } finally {
      // Restore console methods
      console.log = originalConsoleLog;
      console.error = originalConsoleError;

      // Output test results for debugging
      testOutput.forEach((line) => console.log(line));

      // If test threw an error, it should be due to accessibility violations
      if (testError) {
        fail(`Accessibility tests failed: ${testError.message}`);
      }
    }
  });
});
