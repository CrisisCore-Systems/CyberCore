module.exports = {
  root: true,
  env: {
    browser: true,
    es6: true,
    node: true,
    worker: true,
    jest: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:promise/recommended',
    'plugin:jest/recommended',
    'prettier', // This must come last to override other configs
  ],
  plugins: ['@typescript-eslint', 'security', 'sonarjs', 'promise', 'jest', 'jsdoc'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    // Remove project reference to avoid TypeScript errors on JS files
  },
  // Define globals that are used across your codebase
  globals: {
    NeuralBus: 'readonly',
    THREE: 'readonly',
    Stats: 'readonly',
    GlitchEngine: 'readonly',
    Shopify: 'readonly',
  },
  rules: {
    // Basic formatting
    indent: ['error', 2],
    'linebreak-style': ['error', 'windows'],
    quotes: ['error', 'single', { allowTemplateLiterals: true }],
    semi: ['error', 'always'],

    // Error prevention
    'no-unused-vars': [
      'warn',
      {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
        caughtErrorsIgnorePattern: '^_',
      },
    ],
    'no-console': ['warn', { allow: ['warn', 'error', 'info'] }],
    'no-var': 'error', // Use let/const instead of var
    'prefer-const': 'error', // Prefer const for variables that are not reassigned

    // Best practices
    complexity: ['warn', 15],
    'max-lines-per-function': ['warn', 150],
    'max-depth': ['warn', 4],
    'max-nested-callbacks': ['warn', 4],

    // Documentation (jsdoc plugin)
    'jsdoc/require-jsdoc': [
      'warn',
      {
        require: {
          FunctionDeclaration: true,
          MethodDefinition: true,
          ClassDeclaration: true,
          ArrowFunctionExpression: false, // Typically don't require JSDoc on simple arrow functions
          FunctionExpression: false, // Typically don't require JSDoc on simple function expressions
        },
      },
    ],
    'jsdoc/check-types': 'warn', // Validate JSDoc types
    'jsdoc/check-param-names': 'warn', // Validate parameter names in JSDoc

    // Promise handling (promise plugin)
    'promise/always-return': 'warn',
    'promise/no-callback-in-promise': 'warn',
    'promise/catch-or-return': 'warn', // Ensure promises are handled
    'promise/no-nesting': 'warn', // Avoid deeply nested promises
  },
  overrides: [
    {
      // TypeScript specific configuration
      files: ['**/*.ts'],
      extends: ['plugin:@typescript-eslint/recommended'],
      parserOptions: {
        project: './tsconfig.json',
      },
      rules: {
        // TypeScript-specific rules
        '@typescript-eslint/no-unused-vars': [
          'warn',
          {
            argsIgnorePattern: '^_',
            varsIgnorePattern: '^_',
            caughtErrorsIgnorePattern: '^_',
          },
        ],
        '@typescript-eslint/explicit-function-return-type': 'off', // Often too strict for large JS projects
        '@typescript-eslint/no-explicit-any': 'warn', // Warns about using 'any'
        '@typescript-eslint/no-inferrable-types': 'warn', // Warns when assigning a default value to a type that could be inferred
        '@typescript-eslint/no-use-before-define': [
          'error',
          { functions: false, classes: false, variables: true },
        ],
      },
    },
    {
      files: ['tests/**/*.js', 'tests/**/*.ts'], // Include .ts files in overrides
      rules: {
        'no-unused-vars': 'off',
        '@typescript-eslint/no-unused-vars': 'off', // Also turn off TS unused vars in tests
        'max-lines-per-function': 'off',
        'jsdoc/require-jsdoc': 'off',
        '@typescript-eslint/no-explicit-any': 'off', // Allow any in tests if needed
      },
    },
    {
      files: ['**/quantum-*.js', '**/qear-*.js', '**/quantum-*.ts', '**/qear-*.ts'], // Include .ts files
      rules: {
        complexity: ['warn', 25], // Allow higher complexity for quantum components
        'max-lines-per-function': ['warn', 200],
        '@typescript-eslint/no-explicit-any': 'off', // Allow any in specific complex files
      },
    },
  ],
  // Ensure ignorePatterns is correct
  ignorePatterns: [
    'dist/**/*',
    'node_modules/**/*',
    'coverage/**/*',
    'test-results/**/*',
    '.eslintrc.js',
    'deploy/**/*', // Ignore deployed files
    'webpack.*.js', // Ignore webpack config files
    'babel.config.js',
    'postcss.config.js',
    'tailwind.config.js',
    'jest.config.js',
  ],

  settings: {
    jsdoc: {
      tagNamePreference: {
        returns: 'return', // Prefer @return over @returns
      },
      preferredTypes: {
        // Define preferred types if needed
        object: 'Object',
        'array<>': 'Array<>',
        'Array.<>': 'Array<>',
      },
    },
  },
};
