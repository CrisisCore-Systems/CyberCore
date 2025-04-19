// Jest setup file
// This file is run before each test to set up the test environment

// Mock browser APIs not available in jsdom
global.ResizeObserver = class ResizeObserver {
  constructor(callback) {
    this.callback = callback;
  }
  observe() {}
  unobserve() {}
  disconnect() {}
};

// Mock for Web Components API
if (!window.customElements) {
  window.customElements = {
    define: jest.fn(),
    get: jest.fn(),
  };
}

// Mock for Web Workers
if (typeof Worker === 'undefined') {
  global.Worker = class MockWorker {
    constructor() {
      this.addEventListener = jest.fn();
      this.postMessage = jest.fn();
      this.terminate = jest.fn();
    }
  };
}

// Mock for requestAnimationFrame/cancelAnimationFrame
if (typeof requestAnimationFrame === 'undefined') {
  global.requestAnimationFrame = jest.fn((callback) => {
    return setTimeout(callback, 0);
  });

  global.cancelAnimationFrame = jest.fn((id) => {
    clearTimeout(id);
  });
}

// Mock for IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor(callback) {
    this.callback = callback;
  }
  observe() {}
  unobserve() {}
  disconnect() {}
};

// Mock for structuredClone
if (typeof structuredClone === 'undefined') {
  global.structuredClone = (obj) => JSON.parse(JSON.stringify(obj));
}

// Add some DOM testing utilities to the global scope
Object.defineProperty(global, 'waitForElement', {
  value: (selector, root = document, timeout = 2000) => {
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
  },
});

// Add CSS custom properties support to JSDOM
document.documentElement.style.setProperty =
  document.documentElement.style.setProperty || (() => {});

// Setup console mocks for testing
const originalConsoleError = console.error;
const originalConsoleWarn = console.warn;
const originalConsoleLog = console.log;

console.error = jest.fn();
console.warn = jest.fn();
console.log = jest.fn();

// Restore console methods after tests
beforeAll(() => {
  jest.spyOn(console, 'error');
  jest.spyOn(console, 'warn');
  jest.spyOn(console, 'log');
});

afterAll(() => {
  console.error = originalConsoleError;
  console.warn = originalConsoleWarn;
  console.log = originalConsoleLog;
});

// Clear mocks between tests
beforeEach(() => {
  jest.clearAllMocks();
});
