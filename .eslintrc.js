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
    'plugin:@typescript-eslint/recommended',
    'plugin:security/recommended',
    'plugin:sonarjs/recommended',
    'plugin:promise/recommended',
    'plugin:jest/recommended',
    'prettier', // This must come last to override other configs
  ],
  plugins: ['@typescript-eslint', 'security', 'sonarjs', 'promise', 'jest', 'jsdoc'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    project: './tsconfig.json',
  },
  rules: {
    // Basic formatting
    indent: ['error', 2],
    'linebreak-style': ['error', 'windows'],
    quotes: ['error', 'single', { allowTemplateLiterals: true }],
    semi: ['error', 'always'],

    // Error prevention
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': [
      'warn',
      {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
      },
    ],
    'no-console': ['warn', { allow: ['warn', 'error', 'info'] }],
    'no-var': 'error',
    'prefer-const': 'error',
    'no-use-before-define': ['error', { functions: false }],

    // Best practices
    complexity: ['warn', 15],
    'max-lines-per-function': ['warn', 150],
    'max-depth': ['warn', 4],
    'max-nested-callbacks': ['warn', 4],

    // TypeScript-specific rules
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/no-explicit-any': 'warn',

    // Documentation
    'jsdoc/require-jsdoc': [
      'warn',
      {
        require: {
          FunctionDeclaration: true,
          MethodDefinition: true,
          ClassDeclaration: true,
          ArrowFunctionExpression: false,
          FunctionExpression: false,
        },
      },
    ],

    // Security
    'security/detect-object-injection': 'warn',
    'security/detect-non-literal-regexp': 'warn',

    // Promise handling
    'promise/always-return': 'warn',
    'promise/no-callback-in-promise': 'warn',
  },
  overrides: [
    {
      files: ['tests/**/*.js'],
      rules: {
        'no-unused-vars': 'off',
        'max-lines-per-function': 'off',
        'jsdoc/require-jsdoc': 'off',
      },
    },
    {
      files: ['**/quantum-*.js', '**/qear-*.js'],
      rules: {
        complexity: ['warn', 25], // Allow higher complexity for quantum components
        'max-lines-per-function': ['warn', 200],
      },
    },
  ],
  ignorePatterns: ['dist/**/*', 'node_modules/**/*', 'coverage/**/*', 'test-results/**/*'],
  settings: {
    jsdoc: {
      tagNamePreference: {
        returns: 'return',
      },
    },
  },
};
