module.exports = {
  // The root of your source code
  rootDir: './',

  // Test environment for browser-like globals
  testEnvironment: 'jsdom',

  // Verbose output
  verbose: true,

  // Don't use watchman for file crawling
  watchman: false,

  // Test file patterns
  testMatch: [
    '**/tests/unit/**/*.test.js',
    '**/tests/integration/**/*.test.js',
    '**/tests/e2e/**/*.test.js',
    '**/tests/quantum/**/*.test.js', // Added quantum-specific tests
  ],

  // Module file extensions
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],

  // Setup files to run before each test
  setupFilesAfterEnv: [
    '<rootDir>/tests/jest.setup.js',
    '<rootDir>/tests/quantum.setup.js', // Specific setup for quantum tests
    '<rootDir>/tests/setup.js',
  ],

  // Transform files with babel and ts-jest
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
    '^.+\\.(js|jsx)$': ['babel-jest', { configFile: './babel.config.js' }],
  },

  // Don't ignore node_modules that use ES modules
  transformIgnorePatterns: ['/node_modules/(?!(chai|sinon|sinon-chai)/)'],

  // Coverage configuration
  collectCoverage: true,
  collectCoverageFrom: [
    'assets/**/*.{js,ts}',
    'Core/**/*.js', // Added Core directory
    'cybercore/**/*.js', // Added cybercore directory
    '!assets/**/*.d.ts',
    '!assets/index.ts',
    '!**/node_modules/**',
    '!**/vendor/**',
    '!**/tests/**',
    '!**/coverage/**',
  ],
  coverageDirectory: 'coverage',
  coverageReporters: [
    'text',
    'lcov',
    'html',
    'json', // Added JSON reporter
    'cobertura', // Added Cobertura for CI integration
    'text-summary',
  ],
  coverageThreshold: {
    // Added coverage requirements
    global: {
      statements: 70,
      branches: 60,
      functions: 70,
      lines: 70,
    },
    './assets/quantum-*.js': {
      statements: 80, // Higher standards for quantum components
      branches: 70,
      functions: 80,
      lines: 80,
    },
  },

  // Explicitly mock certain modules
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
    '^@assets/(.*)$': '<rootDir>/assets/$1', // Path aliases matching jsconfig.json
    '^@core/(.*)$': '<rootDir>/Core/$1', // Path aliases matching jsconfig.json
    '^@config/(.*)$': '<rootDir>/config/$1', // Path aliases matching jsconfig.json
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '\\.(gif|ttf|eot|svg)$': '<rootDir>/tests/mocks/fileMock.js',
  },

  // Timeouts for tests
  testTimeout: 30000,

  // Performance optimizations
  maxWorkers: '70%', // Limit CPU usage
  maxConcurrency: 5, // Limit parallel test files

  // Snapshot testing
  snapshotFormat: {
    printBasicPrototype: false,
  },

  // Clear mocks between tests
  clearMocks: true,
  resetMocks: false,
  restoreMocks: true,

  // Custom reporters
  reporters: [
    'default',
    [
      'jest-junit',
      {
        outputDirectory: 'test-results',
        outputName: 'junit.xml',
      },
    ],
    [
      'jest-html-reporter',
      {
        pageTitle: 'CyberCore Test Report',
        outputPath: 'test-results/test-report.html',
        includeFailureMsg: true,
      },
    ],
  ],

  // For quantum component tests
  bail: process.env.CI === 'true' ? 1 : 0,
  notify: true,
  notifyMode: 'failure-change',

  // Jest globals for ts-jest
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.json',
    },
  },

  // Ignore certain paths for tests
  testPathIgnorePatterns: ['/node_modules/', '/dist/'],

  // Roots for tests
  roots: ['<rootDir>/tests'],
};
