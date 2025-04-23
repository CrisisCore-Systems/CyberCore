module.exports = {
  // Specify testing environment
  testEnvironment: 'jsdom',

  // Unified transformer configuration with consistent plugin settings
  transform: {
    // Process TypeScript files
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        tsconfig: 'tsconfig.json',
        // Important: Do not override Babel settings here
        babelConfig: false,
      },
    ],
    // Process JavaScript files with consistent Babel configuration
    '^.+\\.jsx?$': [
      'babel-jest',
      // No additional Babel config here - use global babel.config.js
    ],
  },

  // Files to collect coverage from
  collectCoverageFrom: ['assets/**/*.{js,jsx,ts,tsx}', '!assets/**/*.d.ts', '!**/node_modules/**'],

  // Setup files to run before tests
  setupFilesAfterEnv: ['<rootDir>/tests/setup/test-setup.js'],

  // Mock file patterns
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': '<rootDir>/tests/mocks/styleMock.js',
    '\\.(jpg|jpeg|png|gif|webp|svg)$': '<rootDir>/tests/mocks/fileMock.js',
  },

  // Test reporting
  reporters: [
    'default',
    [
      'jest-html-reporter',
      {
        pageTitle: 'VoidBloom Test Report',
        outputPath: 'test-results/test-report.html',
      },
    ],
  ],
};
