// CrisisCore-Auditor — static checks for collapse vectors in CyberCore
// Run: ts-node tools/auditor/crisiscore_audit.ts --root . [--report report.json]

import * as fs from 'fs';
import * as fsp from 'fs/promises';
import * as path from 'path';

type Finding = {
  id: string;
  severity: 'CRITICAL'|'HIGH'|'MEDIUM'|'LOW';
  file: string;
  line?: number;
  message: string;
  mitigation?: string;
};

type Options = {
  root: string;
  report?: string;
};

async function* walk(dir: string): AsyncGenerator<string> {
  const entries = await fsp.readdir(dir, { withFileTypes: true });
  for (const e of entries) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) {
      if (['node_modules', '.git', 'dist', 'build'].includes(e.name)) continue;
      yield* walk(p);
    } else {
      yield p;
    }
  }
}

function parseArgs(): Options {
  const args = process.argv.slice(2);
  let root = '.';
  let report: string|undefined;
  for (let i=0;i<args.length;i++){
    if (args[i] === '--root') root = args[++i] ?? '.';
    else if (args[i] === '--report') report = args[++i];
  }
  return { root: path.resolve(root), report };
}

function findLineNumber(content: string, needle: RegExp): number | undefined {
  const m = content.match(needle);
  if (!m || !m.index) return;
  const upto = content.slice(0, m.index);
  return upto.split(/\r?\n/).length;
}

async function audit(root: string): Promise<Finding[]> {
  const findings: Finding[] = [];
  for await (const file of walk(root)) {
    if (!/\.(ts|js|liquid|jsx|tsx)$/.test(file)) continue;

    const content = await fsp.readFile(file, 'utf8');

    // 1) Recursive Yield Loop — price recursion w/ linear multiplier
    if (/calculateNewPrice\s*\([\s\S]*?\)\s*:\s*number/.test(content)) {
      if (/\bprice\s*\*\s*\(\s*1\s*\+\s*\(\s*quantity\s*\*\s*0?\.0?1\)/.test(content)) {
        findings.push({
          id: 'recursive-yield-loop',
          severity: 'CRITICAL',
          file,
          line: findLineNumber(content, /\bcalculateNewPrice\b/),
          message: 'Linear quantity→price multiplier without true upper bound; prone to feedback amplification.',
          mitigation: 'Use non-linear damping + hard caps (≤10% step) and coherence breaker before applying delta.'
        });
      }
    }

    // 2) Quantum State Divergence — engagement feeds coherence directly
    if (/calculateEngagementScore\s*\(\)\s*\{/.test(content)) {
      if (/engagementScore\s*=\s*Math\.max\s*\(\s*0\.3\s*,\s*totalValue\s*\/\s*totalElements\s*\)/.test(content)) {
        findings.push({
          id: 'quantum-state-divergence',
          severity: 'CRITICAL',
          file,
          line: findLineNumber(content, /\bcalculateEngagementScore\b/),
          message: 'Engagement directly feeds coherence; unbounded feedback possible under load.',
          mitigation: 'Insert low-pass filter & decouple from coherence (e.g., 0.7 prev + 0.3 next).'
        });
      }
    }

    // 3) Temporal State Corruption — token write without epoch barrier
    if (/storeAuthToken\s*\(\s*token\s*,\s*expiry\s*\)\s*\{/.test(content) && file.includes('memory-auth')) {
      if (/localStorage\.setItem\(['"]voidbloom_auth_token['"]\s*,\s*token\)/.test(content)
          && !/epoch\s*\.\s*validate/.test(content)) {
        findings.push({
          id: 'temporal-corruption',
          severity: 'CRITICAL',
          file,
          line: findLineNumber(content, /\blocalStorage\.setItem\b/),
          message: 'Auth token write lacks epoch validation; ghost states across transitions possible.',
          mitigation: 'Gate token write with epoch.validate() and rollback on desync.'
        });
      }
    }

    // 4) Loyalty Reward Cascade — quantum tier too high / coupled
    if (/getCustomerLoyaltyDiscount\s*\(\s*tier\s*\)\s*\{/.test(content) && file.includes('quantum-price-validator')) {
      const hasQuantum = /quantum\s*:\s*0\.(1[6-9]|[2-9]\d)/.test(content) || /quantum\s*:\s*0\.15/.test(content);
      if (hasQuantum) {
        findings.push({
          id: 'loyalty-cascade',
          severity: 'CRITICAL',
          file,
          line: findLineNumber(content, /\bgetCustomerLoyaltyDiscount\b/),
          message: 'Quantum tier discount high/coupled; enables multiplicative loop with coherence.',
          mitigation: 'Cap total discount ≤ 0.15 and isolate from coherence multipliers.'
        });
      }
    }

    // 5) Cart Quantum Pollution — quantum cart mutation w/o epoch sync
    if (/addToVault\s*\(\s*productId\s*,\s*variantId\s*\)\s*\{/.test(content) && file.includes('quantum-hologram')) {
      if (/addItemWithQuantumEffect\(\s*variantId\s*,\s*1\s*\)/.test(content) && !/epoch\s*\.\s*validate/.test(content)) {
        findings.push({
          id: 'cart-quantum-pollution',
          severity: 'CRITICAL',
          file,
          line: findLineNumber(content, /addItemWithQuantumEffect/),
          message: 'Quantum cart mutation without epoch synchronization; divergent cart states possible.',
          mitigation: 'Validate current epoch before mutation; block on desync.'
        });
      }
    }
  }
  return findings;
}

async function main() {
  const { root, report } = parseArgs();
  const findings = await audit(root);

  // Pretty print
  if (findings.length === 0) {
    console.log('CrisisCore-Auditor: No collapse vectors detected.');
  } else {
    console.log(`CrisisCore-Auditor: ${findings.length} issue(s) found:\n`);
    for (const f of findings) {
      console.log(`- [${f.severity}] ${f.id}`);
      console.log(`  file: ${path.relative(root, f.file)}${f.line ? `:${f.line}` : ''}`);
      console.log(`  msg : ${f.message}`);
      if (f.mitigation) console.log(`  fix : ${f.mitigation}`);
      console.log('');
    }
  }

  // Optional JSON report
  if (report) {
    await fsp.mkdir(path.dirname(path.resolve(report)), { recursive: true });
    await fsp.writeFile(report, JSON.stringify({ generatedAt: new Date().toISOString(), findings }, null, 2), 'utf8');
    console.log(`Report written: ${report}`);
  }

  // Exit non-zero on CRITICAL/HIGH
  const bad = findings.some(f => f.severity === 'CRITICAL' || f.severity === 'HIGH');
  process.exitCode = bad ? 1 : 0;
}

main().catch(err => {
  console.error('Audit failed:', err?.stack || err);
  process.exit(2);
});
