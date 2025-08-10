/**
 * Flags unguarded NeuralBus.publish sites outside the core bus impl.
 * Heuristic: calls to NeuralBus.publish( or .publish( without nearby "rate-limit"
 */
const { execSync } = require('node:child_process');

function rg(pattern, globs = '') {
  try {
    return execSync(`rg -n --hidden --glob '!node_modules' ${globs} "${pattern}"`, { stdio: ['ignore','pipe','ignore'] })
      .toString();
  } catch {
    return '';
  }
}

// Exclude the bus implementation files we expect to be hardened
const globs = `--glob '!assets/neural-bus.js' --glob '!assets/core/neural-bus.ts'`;

const pubs = rg(String.raw`\bNeuralBus\.publish\s*\(`, globs);
if (!pubs) process.exit(0);

const lines = pubs.trim().split('\n').filter(Boolean);
let flagged = 0;

for (const line of lines) {
  // naive allowlist: if same file has "rate-limited" or "__ccRate__" nearby, skip
  // (we only get lines here; keep it simple)
  if (line.match(/rate-?limited|__ccRate__/i)) continue;
  console.log('WARN: Unguarded publish site ->', line);
  flagged++;
}

process.exit(0);
