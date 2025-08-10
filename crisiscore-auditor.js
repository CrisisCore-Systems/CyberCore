#!/usr/bin/env node
/**
 * CrisisCore Auditor++
 * All-in-one auditor and hardener for collapse vectors across the CyberCore repo.
 *
 * What it does (idempotent):
 * - Epoch: Replace core/epoch/AtomicEpoch.ts with a single-lock hardened implementation (fixes double-finally/ghost).
 * - Cart: Harden assets/core/cart-core.ts getCart() to return deep-frozen snapshots (no mutable returns).
 * - NeuralBus: Harden publish() in assets/neural-bus.js and assets/core/neural-bus.ts with per-topic rate limiter + deep-freeze payloads.
 * - Pricing: Fix server/quantum-price-validator.js loyalty return, align tiers, clamp ±15%; match client in assets/quantum-price-calculator.js.
 * - Cleans boundedCoherence multipliers on server (removes undefined factor).
 * - Reports Math.random usage in control paths as warnings (non-fatal).
 *
 * Usage:
 *   node scripts/crisiscore-auditor.js [--dry-run] [--no-commit] [--push] [--branch BRANCH] [--run-tests]
 *
 * Conventions:
 * - Adds markers: // @crisiscore-hardened to guard idempotence.
 * - Creates timestamped .bak backups next to modified files.
 *
 * Invariants enforced:
 * - No state mutation without epoch validation.
 * - Price/coherence paths bounded with hard caps.
 * - Event publish storms damped; payloads immutable to observers.
 * - No mutable return from security/quantum getters.
 */

const fs = require('fs');
const fsp = require('fs/promises');
const path = require('path');
const cp = require('child_process');

const CWD = process.cwd();
const TS = new Date().toISOString().replace(/[:.]/g, '');
const DRY = process.argv.includes('--dry-run');
const NO_COMMIT = process.argv.includes('--no-commit');
const PUSH = process.argv.includes('--push');
const RUN_TESTS = process.argv.includes('--run-tests');
const BRANCH_ARG_IDX = process.argv.indexOf('--branch');
const BRANCH = BRANCH_ARG_IDX > -1 ? process.argv[BRANCH_ARG_IDX + 1] : '';

const log = (...a) => console.log('[Auditor]', ...a);
const warn = (...a) => console.warn('[Auditor][WARN]', ...a);
const err = (...a) => console.error('[Auditor][ERROR]', ...a);

// Utility: ensure directory exists
async function ensureDir(p) {
  await fsp.mkdir(path.dirname(p), { recursive: true });
}

// Utility: backup a file with timestamp suffix; returns backup path or empty if skipped
async function backupFile(file) {
  try {
    const stat = await fsp.stat(file);
    if (!stat.isFile()) return '';
    const bak = `${file}.bak.${TS}`;
    if (DRY) {
      log(`DRY: would backup ${file} -> ${bak}`);
      return bak;
    }
    await fsp.copyFile(file, bak);
    return bak;
  } catch {
    return '';
  }
}

// Utility: read file text safe
async function readFile(file) {
  try {
    return await fsp.readFile(file, 'utf8');
  } catch {
    return '';
  }
}

// Utility: write file with backup
async function writeFileWithBackup(file, content) {
  const before = await readFile(file);
  if (!before) {
    warn(`File not found or empty: ${file}`);
    return { changed: false, reason: 'missing' };
  }
  if (before === content) {
    return { changed: false, reason: 'nochange' };
  }
  await backupFile(file);
  if (DRY) {
    log(`DRY: would write ${file} (${before.length} -> ${content.length} chars)`);
    return { changed: true, reason: 'dry-run' };
  }
  await fsp.writeFile(file, content, 'utf8');
  return { changed: true, reason: 'updated' };
}

// Utility: replace a method block by signature using brace matching
function replaceMethodBlock(src, signatureRegex, newBodyWithBraces) {
  const m = src.match(signatureRegex);
  if (!m) return { src, changed: false, reason: 'sig-not-found' };
  const startIdx = m.index;
  const openBraceIdx = src.indexOf('{', startIdx);
  if (openBraceIdx === -1) return { src, changed: false, reason: 'no-open-brace' };
  // Brace matching
  let i = openBraceIdx;
  let depth = 0;
  for (; i < src.length; i++) {
    const ch = src[i];
    if (ch === '{') depth++;
    else if (ch === '}') {
      depth--;
      if (depth === 0) {
        const endIdx = i;
        const prefix = src.slice(0, openBraceIdx + 1);
        const suffix = src.slice(endIdx);
        const out = prefix + '\n' + newBodyWithBraces.trim() + '\n' + suffix;
        return { src: out, changed: true, reason: 'replaced' };
      }
    }
  }
  return { src, changed: false, reason: 'unterminated' };
}

// Git helpers
function git(cmd, opts = {}) {
  return cp.spawnSync('git', cmd.split(' '), { stdio: 'inherit', ...opts });
}

async function gitStageCommitPush(filesChanged) {
  if (DRY || NO_COMMIT || filesChanged.length === 0) return;

  if (BRANCH) {
    log(`Creating/switching to branch ${BRANCH}`);
    cp.spawnSync('git', ['checkout', '-B', BRANCH], { stdio: 'inherit' });
  }

  const toAdd = filesChanged.filter(Boolean);
  if (toAdd.length) {
    log('Git add files:', toAdd.join(', '));
    git(`add ${toAdd.join(' ')}`);
  }
  const msg = 'CrisisCore: Harden critical collapse vectors (epoch, neural-bus, cart, pricing)';
  git(`commit -m "${msg}"`);

  if (PUSH) {
    git(`push -u origin ${BRANCH || 'HEAD'}`);
  }
}

// Scanner for Math.random in control paths (warn only)
function scanRandomControl(content, file) {
  const findings = [];
  // naive: if (...) Math.random or Math.random inside if / switch conditions or immediate comparisons
  const lines = content.split('\n');
  lines.forEach((line, idx) => {
    if (/\bif\s*\(.*Math\.random\(\)/.test(line) || /Math\.random\(\)\s*[<>]=?/.test(line)) {
      findings.push({ file, line: idx + 1, snippet: line.trim() });
    }
  });
  return findings;
}

// Transform: AtomicEpoch.ts replacement
function hardenedAtomicEpochTs() {
  return `// @crisiscore-hardened: epoch residue registry
const __ccEpochResidue__ = (function () {
  const seen = new Set<number>();
  return {
    mark: (e: number) => seen.add(e),
    clear: (e: number) => seen.delete(e),
    has: (e: number) => seen.has(e),
  };
})();
/**
 * @file AtomicEpoch.ts
 * Implements atomic epoch management with validation barriers
 */

// @crisiscore-hardened: Epoch state pollution protection
export class AtomicEpoch {
  private static readonly epochBuffer = new SharedArrayBuffer(4 * 2); // lock + epoch slot
  private static readonly syncBuffer = new Int32Array(AtomicEpoch.epochBuffer);
  private static readonly EPOCH_LOCK = 0; // index 0
  private static readonly EPOCH_SLOT = 1; // index 1

  private constructor() {} // Prevent instantiation

  // @crisiscore-hardened: single lock lifecycle + deterministic slot update
  public static increment(): number {
    // acquire lock
    while (Atomics.compareExchange(this.syncBuffer, this.EPOCH_LOCK, 0, 1) !== 0) {
      Atomics.wait(this.syncBuffer, this.EPOCH_LOCK, 1);
    }
    try {
      const prev = Atomics.add(this.syncBuffer, this.EPOCH_SLOT, 1);
      const newEpoch = prev + 1;

      // best-effort residue bookkeeping
      try {
        __ccEpochResidue__.clear(prev);
      } catch {}
      try {
        __ccEpochResidue__.mark(newEpoch);
      } catch {}

      this.validateEpochTransition(newEpoch);
      return newEpoch;
    } finally {
      // release lock once
      Atomics.store(this.syncBuffer, this.EPOCH_LOCK, 0);
      Atomics.notify(this.syncBuffer, this.EPOCH_LOCK, 1);
    }
  }

  public static validate(epoch: number): boolean {
    const currentEpoch = Atomics.load(this.syncBuffer, this.EPOCH_SLOT);
    return epoch === currentEpoch;
  }

  private static validateEpochTransition(newEpoch: number): void {
    const lastEpoch = newEpoch - 1;
    if (this.hasGhostState(lastEpoch)) {
      throw new Error('Epoch ghost state detected');
    }
    if (this.hasTimeAnomaly(newEpoch)) {
      throw new Error('Epoch time anomaly detected');
    }
  }

  private static hasGhostState(epoch: number): boolean {
    try {
      const hostCheck = (globalThis as any)?.voidBloom?.epoch?.isClean?.(epoch);
      if (typeof hostCheck === 'boolean') return !hostCheck;
    } catch {}
    return __ccEpochResidue__.has(epoch);
  }

  private static hasTimeAnomaly(_epoch: number): boolean {
    // TODO: Hook to monotonic time or logical clock invariants
    return false;
  }
}
`;
}

// Transform: CartCore.getCart() hardener
function hardenedGetCartTs() {
  return `
    // @crisiscore-hardened: return immutable snapshot
    const clone = (v: unknown) => JSON.parse(JSON.stringify(v ?? null));
    const deepFreeze = (obj: any) => {
      if (!obj || typeof obj !== 'object' || Object.isFrozen(obj)) return obj;
      Object.freeze(obj);
      for (const k of Object.keys(obj)) deepFreeze((obj as any)[k]);
      return obj;
    };
    return deepFreeze(clone(this.cartData));`;
}

// Transform: NeuralBus JS publish() body
function hardenedNeuralBusPublishJSBody() {
  return `// @crisiscore-hardened: per-channel dampener (≤5/sec) + deep-freeze payload
    this.__ccRate__ = this.__ccRate__ || new Map();
    const now = Date.now();
    const windowMs = 1000;
    const maxPerWindow = (this.config && this.config.maxPerWindow) || 5;
    const r = this.__ccRate__.get(channelId) || { start: now, count: 0 };
    if (now - r.start > windowMs) { r.start = now; r.count = 0; }
    if (++r.count > maxPerWindow) {
      console.warn(\`[NeuralBus] rate-limited publish on \${channelId}\`);
      this.__ccRate__.set(channelId, r);
      return message;
    }
    this.__ccRate__.set(channelId, r);

    const deepFreeze = (obj) => {
      if (!obj || typeof obj !== 'object' || Object.isFrozen(obj)) return obj;
      Object.freeze(obj);
      Object.keys(obj).forEach((k) => deepFreeze(obj[k]));
      return obj;
    };
    const cloned = (message && typeof message === 'object')
      ? JSON.parse(JSON.stringify(message))
      : message;
    const frozen = deepFreeze(cloned);

    if (!this.channels.has(channelId)) this.channels.set(channelId, []);
    const channel = this.channels.get(channelId);
    channel.push({ timestamp: now, message: frozen, trace: new Error().stack });

    const subscribers = this._getSubscribers(channelId);
    subscribers.forEach((callback) => {
      try { callback(frozen); }
      catch (error) { console.error(\`Error in NeuralBus subscriber (\${channelId}):\`, error); }
    });

    const system = this.systems?.get?.(channelId);
    if (system && typeof system.onMessage === 'function') {
      try { system.onMessage(frozen); }
      catch (error) { console.error(\`Error in system controller (\${channelId}):\`, error); }
    }

    return frozen;`;
}

// Transform: NeuralBus TS publish() body
function hardenedNeuralBusPublishTSBody() {
  return `// @crisiscore-hardened: per-topic dampener (≤5/sec) + deep-freeze payload
    (this as any).__ccRate__ = (this as any).__ccRate__ || new Map<string, { start: number; count: number }>();
    const now = Date.now();
    const windowMs = 1000;
    const maxPerWindow = ((this as any).config && (this as any).config.maxPerWindow) || 5;
    const r = (this as any).__ccRate__.get(eventName) || { start: now, count: 0 };
    if (now - r.start > windowMs) { r.start = now; r.count = 0; }
    if (++r.count > maxPerWindow) {
      (this as any).log?.(\`Publish rate-limited: \${eventName}\`, 'warn');
      (this as any).__ccRate__.set(eventName, r);
      return;
    }
    (this as any).__ccRate__.set(eventName, r);

    const deepFreeze = (obj: any) => {
      if (!obj || typeof obj !== 'object' || Object.isFrozen(obj)) return obj;
      Object.freeze(obj);
      for (const k of Object.keys(obj)) deepFreeze((obj as any)[k]);
      return obj;
    };
    const frozenData = deepFreeze(
      data && typeof data === 'object' ? JSON.parse(JSON.stringify(data)) : data
    );

    const event: any = {
      id: (this as any).generateId?.() ?? \`\${Date.now()}-\${Math.random()}\`,
      topic: eventName,
      data: frozenData,
      timestamp: now,
      source: options.source || 'unknown',
      sequence: ((this as any).eventSequence = ((this as any).eventSequence || 0) + 1),
    };

    if ((this as any).eventHistory) {
      (this as any).eventHistory.push(event);
      const max = ((this as any).config?.maxEventHistory) || 100;
      if ((this as any).eventHistory.length > max) (this as any).eventHistory.shift();
    }

    const subs = (this as any).subscriptions?.get?.(eventName) || [];
    const wild = (this as any).subscriptions?.get?.('*') || [];
    const all = [...subs, ...wild];
    for (const s of all) {
      try {
        if (s.filter && !s.filter(frozenData, event)) continue;
        s.callback(frozenData, event);
      } catch (error) {
        (this as any).log?.(\`Error in subscriber callback: \${s.id || 'unknown'}\`, 'error');
        console.error(error);
      }
    }

    if ((this as any).events?.[eventName]) {
      (this as any).events[eventName].forEach((cb: Function) => {
        try { cb(frozenData, event); }
        catch (error) {
          (this as any).log?.('Error in legacy subscriber callback', 'error');
          console.error(error);
        }
      });
    }`;
}

// Transform: Loyalty mapping JS
function loyaltyMapJS() {
  return `// @crisiscore-hardened: bounded tiers (quantum ≤ 0.12)
    const tiers = {
      bronze: 0.03,
      silver: 0.05,
      gold: 0.08,
      platinum: 0.12,
      quantum: 0.12,
    };
    return tiers[(tier || '').toLowerCase()] || 0;`;
}

// Transform: server clamp insert
function clampBlockServer() {
  return `\n    // @crisiscore-hardened: clamp total variance ±15% vs base\n    const cap = this.config?.allowedVariance ?? 0.15;\n    const lower = basePrice * (1 - cap);\n    const upper = basePrice * (1 + cap);\n    finalPrice = Math.min(upper, Math.max(lower, finalPrice));\n`;
}

// Transform: client clamp insert
function clampBlockClient() {
  return `\n    // @crisiscore-hardened: clamp total variance ±15% vs base (client parity)\n    const cap = this.config?.cacheVarianceCap ?? 0.15;\n    const lower = basePrice * (1 - cap);\n    const upper = basePrice * (1 + cap);\n    finalPrice = Math.min(upper, Math.max(lower, finalPrice));\n`;
}

// Apply transforms
async function hardenEpochAtomic() {
  const file = path.join(CWD, 'core/epoch/AtomicEpoch.ts');
  const src = await readFile(file);
  if (!src) return { file, changed: false, vector: 'epoch', reason: 'missing' };
  if (src.includes('@crisiscore-hardened')) {
    return { file, changed: false, vector: 'epoch', reason: 'already-hardened' };
  }
  const out = hardenedAtomicEpochTs();
  const res = await writeFileWithBackup(file, out);
  return { file, changed: res.changed, vector: 'epoch', reason: res.reason };
}

async function hardenCartGet() {
  const file = path.join(CWD, 'assets/core/cart-core.ts');
  const src = await readFile(file);
  if (!src) return { file, changed: false, vector: 'cart', reason: 'missing' };
  if (src.includes('@crisiscore-hardened') && src.includes('deepFreeze(')) {
    return { file, changed: false, vector: 'cart', reason: 'already-hardened' };
  }
  // Locate static getCart() method
  const sig = /static\s+getCart\s*\(\s*\)\s*:\s*any\s*\{/m;
  const m = src.match(sig);
  if (!m) return { file, changed: false, vector: 'cart', reason: 'method-not-found' };
  const rep = replaceMethodBlock(src, sig, hardenedGetCartTs());
  if (!rep.changed) return { file, changed: false, vector: 'cart', reason: rep.reason };
  const res = await writeFileWithBackup(file, rep.src);
  return { file, changed: res.changed, vector: 'cart', reason: res.reason };
}

async function hardenNeuralBusJS() {
  const file = path.join(CWD, 'assets/neural-bus.js');
  const src = await readFile(file);
  if (!src) return { file, changed: false, vector: 'neural-bus-js', reason: 'missing' };
  if (src.includes('@crisiscore-hardened') && src.includes('__ccRate__')) {
    return { file, changed: false, vector: 'neural-bus-js', reason: 'already-hardened' };
  }
  const sig = /publish\s*\(\s*channelId\s*,\s*message\s*\)\s*\{/m;
  const rep = replaceMethodBlock(src, sig, hardenedNeuralBusPublishJSBody());
  if (!rep.changed) return { file, changed: false, vector: 'neural-bus-js', reason: rep.reason };
  const res = await writeFileWithBackup(file, rep.src);
  return { file, changed: res.changed, vector: 'neural-bus-js', reason: res.reason };
}

async function hardenNeuralBusTS() {
  const file = path.join(CWD, 'assets/core/neural-bus.ts');
  const src = await readFile(file);
  if (!src) return { file, changed: false, vector: 'neural-bus-ts', reason: 'missing' };
  if (src.includes('@crisiscore-hardened') && src.includes('__ccRate__')) {
    return { file, changed: false, vector: 'neural-bus-ts', reason: 'already-hardened' };
  }
  const sig = /publish\s*\(\s*eventName\s*:\s*string\s*,\s*data[\s\S]*?\)\s*:\s*void\s*\{/m;
  const rep = replaceMethodBlock(src, sig, hardenedNeuralBusPublishTSBody());
  if (!rep.changed) return { file, changed: false, vector: 'neural-bus-ts', reason: rep.reason };
  const res = await writeFileWithBackup(file, rep.src);
  return { file, changed: res.changed, vector: 'neural-bus-ts', reason: res.reason };
}

async function hardenServerPricing() {
  const file = path.join(CWD, 'server/quantum-price-validator.js');
  let src = await readFile(file);
  if (!src) return { file, changed: false, vector: 'pricing-server', reason: 'missing' };

  let changed = false;

  // Remove undefined boundedCoherence factors if any
  if (src.includes('* boundedCoherence')) {
    src = src.replace(/\s*\*\s*boundedCoherence\s*/g, ' ');
    changed = true;
  }

  // Patch loyalty function
  if (!/getCustomerLoyaltyDiscount\s*\([\s\S]*?return tiers/.test(src)) {
    src = src.replace(
      /getCustomerLoyaltyDiscount\s*\(\s*tier\s*\)\s*\{\s*[\s\S]*?\}/m,
      `getCustomerLoyaltyDiscount(tier) {\n${loyaltyMapJS()}\n  }`
    );
    changed = true;
  }

  // Insert clamp before rounding if missing
  if (!/allowedVariance/.test(src) || !/cap\s*=/.test(src)) {
    // Try to insert clamp before rounding occurrence
    const roundIdx = src.lastIndexOf('finalPrice = Math.round');
    if (roundIdx !== -1) {
      const before = src.slice(0, roundIdx);
      const after = src.slice(roundIdx);
      src = before + clampBlockServer() + after;
      changed = true;
    }
  }

  if (!changed) return { file, changed: false, vector: 'pricing-server', reason: 'already-hardened-or-nochange' };
  const res = await writeFileWithBackup(file, src);
  return { file, changed: res.changed, vector: 'pricing-server', reason: res.reason };
}

async function hardenClientPricing() {
  const file = path.join(CWD, 'assets/quantum-price-calculator.js');
  let src = await readFile(file);
  if (!src) return { file, changed: false, vector: 'pricing-client', reason: 'missing' };

  let changed = false;

  // Patch loyalty function
  if (!/getCustomerLoyaltyDiscount\s*\([\s\S]*?return tiers/.test(src)) {
    src = src.replace(
      /getCustomerLoyaltyDiscount\s*\(\s*tier\s*\)\s*\{\s*[\s\S]*?\}/m,
      `getCustomerLoyaltyDiscount(tier) {\n${loyaltyMapJS()}\n  }`
    );
    changed = true;
  } else {
    // Align quantum 0.12 if 0.15 present
    if (src.includes('quantum: 0.15')) {
      src = src.replace('quantum: 0.15', 'quantum: 0.12');
      changed = true;
    }
  }

  // Insert clamp before rounding if missing
  if (!/cacheVarianceCap/.test(src) || !/cap\s*=/.test(src)) {
    const roundIdx = src.lastIndexOf('finalPrice = Math.max(0, Math.round');
    const roundIdxAlt = src.lastIndexOf('finalPrice = Math.round');
    const idx = roundIdx !== -1 ? roundIdx : roundIdxAlt;
    if (idx !== -1) {
      const before = src.slice(0, idx);
      const after = src.slice(idx);
      src = before + clampBlockClient() + after;
      changed = true;
    }
  }

  if (!changed) return { file, changed: false, vector: 'pricing-client', reason: 'already-hardened-or-nochange' };
  const res = await writeFileWithBackup(file, src);
  return { file, changed: res.changed, vector: 'pricing-client', reason: res.reason };
}

// Random control scan across asset/server/snippets
async function gatherRandomFindings() {
  const targets = [
    'assets',
    'server',
    'snippets',
    'sections',
    'core',
    'src',
    'deploy/dev/assets',
  ];
  const findings = [];
  async function recurse(dir) {
    let entries = [];
    try {
      entries = await fsp.readdir(dir, { withFileTypes: true });
    } catch {
      return;
    }
    for (const ent of entries) {
      const p = path.join(dir, ent.name);
      if (ent.isDirectory()) {
        // skip heavy dirs
        if (['node_modules', '.git', 'dist', 'build', 'vendor'].includes(ent.name)) continue;
        await recurse(p);
      } else {
        if (!/\.(js|ts|liquid|css|md|json|mjs|cjs)$/i.test(ent.name)) continue;
        const txt = await readFile(p);
        if (!txt || !txt.includes('Math.random')) continue;
        findings.push(...scanRandomControl(txt, p));
      }
    }
  }
  for (const t of targets) {
    await recurse(path.join(CWD, t));
  }
  return findings;
}

async function main() {
  log('Starting CrisisCore Auditor++', { DRY, NO_COMMIT, PUSH, BRANCH, RUN_TESTS });

  const results = [];
  const filesChanged = [];

  // 1) Epoch
  results.push(await hardenEpochAtomic());

  // 2) Cart getter
  results.push(await hardenCartGet());

  // 3) NeuralBus (JS + TS)
  results.push(await hardenNeuralBusJS());
  results.push(await hardenNeuralBusTS());

  // 4) Pricing server/client
  results.push(await hardenServerPricing());
  results.push(await hardenClientPricing());

  // Collect changed files
  for (const r of results) {
    if (r.changed) filesChanged.push(r.file);
  }

  // 5) Scanner for Math.random in control paths (warn)
  const randomFindings = await gatherRandomFindings();

  // 6) Git ops
  await gitStageCommitPush(filesChanged);

  // 7) Optional tests
  if (RUN_TESTS && !DRY) {
    log('Running tests (npm test)...');
    cp.spawnSync('npm', ['test'], { stdio: 'inherit' });
  }

  // 8) Report
  const summary = {
    changed: filesChanged,
    vectors: results,
    warnings: {
      randomControlFindings: randomFindings.slice(0, 100), // cap output
      totalRandomWarnings: randomFindings.length,
    },
  };

  // Print concise report
  log('Summary:', JSON.stringify(summary, null, 2));

  // Human-readable vector list
  console.log('\nVectors:');
  for (const r of results) {
    console.log(
      `- ${r.vector}: ${r.changed ? 'HARDENED' : 'unchanged'} (${r.reason}) ${r.file || ''}`
    );
  }
  if (randomFindings.length) {
    console.log(`\nWARN: Math.random in control paths detected: ${randomFindings.length} lines`);
    randomFindings.slice(0, 10).forEach((f) =>
      console.log(`  ${f.file}:${f.line}  ${f.snippet}`)
    );
    if (randomFindings.length > 10) {
      console.log('  ... (more omitted)');
    }
  }

  // Exit code
  if (filesChanged.length || randomFindings.length) {
    process.exit(0);
  } else {
    process.exit(0);
  }
}

main().catch((e) => {
  err('Auditor failed:', e);
  process.exit(1);
});
