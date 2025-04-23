/**
 * Jest Setup
 * Centralized test setup file for all Jest tests
 */

// Import all test helpers
import './setup-helpers/api-mocks.js';
import './setup-helpers/dom-mocks.js';
import './setup-helpers/observer-mocks.js';
import './setup-helpers/worker-mocks.js';

// Add global test utilities
global.waitForElement = (selector, root = document, timeout = 2000) => {
  return new Promise((resolve, reject) => {
    const element = root.querySelector(selector);
    if (element) {
      resolve(element);
      return;
    }

    const observer = new MutationObserver(() => {
      const element = root.querySelector(selector);
      if (element) {
        observer.disconnect();
        resolve(element);
      }
    });

    observer.observe(root, {
      childList: true,
      subtree: true,
    });

    setTimeout(() => {
      observer.disconnect();
      reject(new Error(`Element ${selector} not found after ${timeout}ms`));
    }, timeout);
  });
};

// Setup polyfills for test environment
if (typeof structuredClone === 'undefined') {
  global.structuredClone = (obj) => JSON.parse(JSON.stringify(obj));
}

// Add CSS custom properties support to JSDOM
document.documentElement.style.setProperty =
  document.documentElement.style.setProperty || (() => {});

// Setup console mocks
const originalConsole = { ...console };
beforeAll(() => {
  // Silence console during tests
  jest.spyOn(console, 'log').mockImplementation(() => {});
  jest.spyOn(console, 'error').mockImplementation(() => {});
  jest.spyOn(console, 'warn').mockImplementation(() => {});
});

afterAll(() => {
  // Restore console
  console.log = originalConsole.log;
  console.error = originalConsole.error;
  console.warn = originalConsole.warn;
});
