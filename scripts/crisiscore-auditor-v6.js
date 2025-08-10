#!/usr/bin/env node

/**
 * CrisisCore Auditor V6
 * Enhanced with:
 *  - ~ expansion in --root paths
 *  - Clear logging of REPO_ROOT
 *  - Early existence checks for vectors
 */

const fs = require('fs');
const path = require('path');

// Simple logger
function log(...args) {
  console.log('[AuditorV6]', ...args);
}

// Expand ~ to absolute home directory
function expandHome(p) {
  if (!p) return p;
  if (p.startsWith('~')) {
    const home = process.env.HOME || process.env.USERPROFILE || '';
    return path.join(home, p.slice(1));
  }
  return p;
}

// Parse arguments
const args = process.argv.slice(2);
const ROOT_ARG_IDX = args.indexOf('--root');
const REPO_ROOT = ROOT_ARG_IDX > -1
  ? path.resolve(expandHome(args[ROOT_ARG_IDX + 1]))
  : process.cwd();

const DRY = args.includes('--dry-run');
const NO_COMMIT = args.includes('--no-commit');
const PUSH = args.includes('--push');
const BRANCH_ARG_IDX = args.indexOf('--branch');
const BRANCH = BRANCH_ARG_IDX > -1 ? args[BRANCH_ARG_IDX + 1] : '';
const RUN_TESTS = args.includes('--run-tests');

log('Start', { DRY, NO_COMMIT, PUSH, BRANCH, RUN_TESTS });
log('Using REPO_ROOT:', REPO_ROOT);

// Vector definitions
const vectors = [
  { vector: 'epoch', file: 'core/epoch/AtomicEpoch.ts' },
  { vector: 'neural-bus-js', file: 'assets/neural-bus.js' },
  { vector: 'neural-bus-ts', file: 'assets/core/neural-bus.ts' },
  { vector: 'pricing-server', file: 'server/quantum-price-validator.js' },
  { vector: 'pricing-client', file: 'assets/quantum-price-calculator.js' }
];

// Check each vector for existence
const summary = {
  changed: [],
  vectors: [],
  warnings: {
    totalRandomWarnings: 0,
    randomControlFindings: []
  }
};

for (const v of vectors) {
  const fullPath = path.join(REPO_ROOT, v.file);
  const exists = fs.existsSync(fullPath);
  summary.vectors.push({
    file: fullPath,
    changed: false,
    vector: v.vector,
    reason: exists ? 'unchanged' : 'missing'
  });
  if (!exists) {
    log(`[WARN] Missing file for vector "${v.vector}":`, fullPath);
  }
}

// Output summary
log('Summary:', JSON.stringify(summary, null, 2));
console.log('\nVectors:');
for (const v of summary.vectors) {
  console.log(`- ${v.vector}: ${v.reason} ${v.file}`);
}

// Optional push/branch handling (placeholder — implement as needed)
if (!DRY) {
  if (PUSH) {
    log('Pushing changes to branch:', BRANCH || '(default)');
    // Implement git push logic here
  }
}
