/**
 * Simple CrisisCore gate:
 * - find Math.random() in control paths
 * - find direct cart/core state getters that return mutable objects
 * Exit nonzero on critical hits.
 */
const { execSync } = require('node:child_process');

function rg(pattern) {
  try {
    return execSync(`rg -n --hidden --glob '!node_modules' "${pattern}"`, { stdio: ['ignore','pipe','ignore'] })
      .toString();
  } catch {
    return '';
  }
}

let critical = false;

// 1) Random in control flow
const randomHits = rg(String.raw`\bif\s*\(.*Math\.random\(\)|Math\.random\(\)\s*[<>]=?`);
if (randomHits) {
  console.log('CRITICAL: Math.random() used in control flow:\n' + randomHits);
  critical = true;
}

// 2) Mutable returns from getCart or similar getters
const getterHits = rg(String.raw`getCart\s*\(\)[\s\S]{0,200}\{\s*return\s+this\.cartData\s*;`);
if (getterHits) {
  console.log('CRITICAL: getCart() returns live mutable object:\n' + getterHits);
  critical = true;
}

process.exit(critical ? 2 : 0);
