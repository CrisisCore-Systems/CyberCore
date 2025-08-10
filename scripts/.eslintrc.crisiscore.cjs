/**
 * CrisisCore ESLint overlay: focuses on collapse vectors without touching base config.
 * Used only by Husky pre-commit.
 */
module.exports = {
  root: false,
  extends: [],
  overrides: [
    {
      files: ['**/ritual-engine/**/*.js', 'assets/trauma-visualizer.js'],
      rules: {
        'complexity': ['warn', 20],
        'max-lines-per-function': ['warn', 175],
        'no-param-reassign': 'error',
        'no-self-assign': 'error'
      }
    },
    {
      files: ['**/quantum-*.{js,ts}', '**/qear-*.{js,ts}'],
      rules: {
        'complexity': ['warn', 25],
        'max-lines-per-function': ['warn', 200],
        '@typescript-eslint/no-explicit-any': 'warn',
        'no-param-reassign': 'error',
        'no-var': 'error',
        'prefer-const': 'error'
      }
    }
  ]
};
