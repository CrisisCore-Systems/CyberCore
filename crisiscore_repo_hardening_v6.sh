#!/usr/bin/env bash
# CrisisCore Repo Hardening v6
# Usage:
#   ./crisiscore_repo_hardening_v6.sh [REPO_ROOT]
# Example:
#   ./crisiscore_repo_hardening_v6.sh .
set -euo pipefail

ROOT="${1:-.}"
cd "$ROOT"

ts() { date -u +"%Y%m%dT%H%M%SZ"; }
backup() {
  local f="$1"
  [[ -f "$f" ]] || return 0
  cp -p "$f" "$f.bak.$(ts)"
}

echo "[+] CrisisCore hardening starting in: $(pwd)"

# 0) Ensure folders exist
mkdir -p assets/security scripts .husky

###############################################################################
# 1) Re-enable linting on risky files: edit .eslintignore conservatively
###############################################################################
if [[ -f ".eslintignore" ]]; then
  echo "[+] Patching .eslintignore (commenting out high-risk exclusions)"
  backup .eslintignore
  # Comment exact matches if present
  sed -i \
    -e 's|^\s*assets/cart-system\.js\s*$|# crisiscore: was excluded -> assets/cart-system.js|g' \
    -e 's|^\s*assets/trauma-visualizer\.js\s*$|# crisiscore: was excluded -> assets/trauma-visualizer.js|g' \
    -e 's|^\s*assets/js/ritual-engine/core/trauma-assessment\.js\s*$|# crisiscore: was excluded -> assets/js/ritual-engine/core/trauma-assessment.js|g' \
    -e 's|^\s*assets/js/ritual-engine/vectors/narrative-assessment\.js\s*$|# crisiscore: was excluded -> assets/js/ritual-engine/vectors/narrative-assessment.js|g' \
    .eslintignore
else
  echo "[!] .eslintignore not found; skipping"
fi

###############################################################################
# 2) Add ESLint override rules (safe, standard rules only)
###############################################################################
ESLINTRC_MAIN=""
for f in .eslintrc.js .eslintrc.cjs .eslintrc.json; do
  [[ -f "$f" ]] && ESLINTRC_MAIN="$f" && break
done

if [[ -n "$ESLINTRC_MAIN" ]]; then
  echo "[+] Appending targeted overrides to $ESLINTRC_MAIN (idempotent)"
  backup "$ESLINTRC_MAIN"
  # If file is JSON we avoid appending JS; in that case write a companion config.
  if [[ "$ESLINTRC_MAIN" == *.json ]]; then
    tee scripts/.eslintrc.crisiscore.cjs >/dev/null <<'EOF'
/* crisiscore supplemental eslint config */
module.exports = {
  overrides: [
    {
      files: ['**/quantum-*.{js,ts}', '**/qear-*.{js,ts}'],
      rules: {
        '@typescript-eslint/no-explicit-any': 'warn',
        'no-param-reassign': 'error',
        'no-var': 'error',
        'prefer-const': 'error',
        'complexity': ['warn', 25],
        'max-lines-per-function': ['warn', 200],
      },
    },
    {
      files: ['**/ritual-engine/**/*.js', 'assets/trauma-visualizer.js', 'assets/cart-system.js'],
      rules: {
        'no-param-reassign': 'error',
        'no-self-assign': 'error',
        'prefer-const': 'error',
        'no-var': 'error',
        'max-depth': ['warn', 4],
        'complexity': ['warn', 20],
      },
    },
  ],
};
EOF
    echo "[i] Use with: npx eslint -c scripts/.eslintrc.crisiscore.cjs ."
  else
    # JS/CJS: append block if not already present
    if ! grep -q "crisiscore supplemental overrides" "$ESLINTRC_MAIN"; then
      cat >>"$ESLINTRC_MAIN" <<'EOF'

// crisiscore supplemental overrides
;(function(cfg){
  try {
    cfg.overrides = cfg.overrides || [];
    cfg.overrides.push(
      {
        files: ['**/quantum-*.{js,ts}', '**/qear-*.{js,ts}'],
        rules: {
          '@typescript-eslint/no-explicit-any': 'warn',
          'no-param-reassign': 'error',
          'no-var': 'error',
          'prefer-const': 'error',
          'complexity': ['warn', 25],
          'max-lines-per-function': ['warn', 200],
        },
      },
      {
        files: ['**/ritual-engine/**/*.js', 'assets/trauma-visualizer.js', 'assets/cart-system.js'],
        rules: {
          'no-param-reassign': 'error',
          'no-self-assign': 'error',
          'prefer-const': 'error',
          'no-var': 'error',
          'max-depth': ['warn', 4],
          'complexity': ['warn', 20],
        },
      }
    );
  } catch (e) {}
})(module.exports || (module.exports = {}));
EOF
    else
      echo "[i] ESLint overrides already present"
    fi
  fi
else
  echo "[!] No eslint config found; skipping override injection"
fi

###############################################################################
# 3) Safe NeuralBus facade (immutable payload + per-epoch rate limiting)
###############################################################################
echo "[+] Installing SafeNeuralBus facade at assets/security/neural-bus-safe.js"
backup assets/security/neural-bus-safe.js || true
mkdir -p assets/security
tee assets/security/neural-bus-safe.js >/dev/null <<'EOF'
/**
 * @crisiscore-hardened: Neural bus wrapper with cascade protection
 * Drop-in facade: import and use SafeNeuralBus instead of global NeuralBus.
 */
export const SafeNeuralBus = (() => {
  const eventCounts = new Map();
  const MAX_EVENTS_PER_EPOCH = 15;

  const getCurrentEpoch = () => {
    try { return (window?.voidBloom?.epoch?.current?.() ?? 'unknown') } catch { return 'unknown' }
  };

  const deepFreeze = (obj) => {
    if (!obj || typeof obj !== 'object') return obj;
    if (Object.isFrozen(obj)) return obj;
    Object.freeze(obj);
    for (const k of Object.keys(obj)) deepFreeze(obj[k]);
    return obj;
  };

  return Object.freeze({
    publish: (eventName, payload) => {
      const epoch = getCurrentEpoch();

      // reset/count per-epoch
      if (epoch !== eventCounts.get('__lastEpoch')) {
        eventCounts.clear();
        eventCounts.set('__lastEpoch', epoch);
      }
      const key = `${eventName}:${epoch}`;
      const count = (eventCounts.get(key) || 0) + 1;
      eventCounts.set(key, count);

      if (count > MAX_EVENTS_PER_EPOCH) {
        console.error(`NeuralBus cascade prevented: ${eventName} exceeded limit in epoch ${epoch}`);
        return false;
      }

      const safePayload = payload && typeof payload === 'object'
        ? deepFreeze(JSON.parse(JSON.stringify(payload)))
        : payload;

      return window.NeuralBus?.publish?.(eventName, safePayload);
    },

    subscribe: (eventName, callback) => {
      const safeCallback = (data) => {
        const safeData = data && typeof data === 'object'
          ? JSON.parse(JSON.stringify(data))
          : data;
        return callback(safeData);
      };
      return window.NeuralBus?.subscribe?.(eventName, safeCallback);
    },

    getEventCounts: () => Object.freeze(Object.fromEntries(eventCounts)),
  });
})();
EOF

###############################################################################
# 4) Minimal collapse-vector checks
###############################################################################
echo "[+] Writing scripts/check-collapse-vectors.js"
backup scripts/check-collapse-vectors.js || true
tee scripts/check-collapse-vectors.js >/dev/null <<'EOF'
#!/usr/bin/env node
// Minimal scan for risky patterns in staged files
const { execSync } = require('node:child_process');
const staged = execSync('git diff --cached --name-only', { encoding: 'utf8' })
  .split('\n').filter(f => f && /\.(js|ts|liquid)$/.test(f));

const risky = [];
const fs = require('node:fs');

for (const f of staged) {
  const t = fs.existsSync(f) ? fs.readFileSync(f, 'utf8') : '';
  if (/NeuralBus\.publish\s*\(/.test(t) && !/SafeNeuralBus/.test(t)) {
    risky.push({ file: f, reason: 'direct NeuralBus.publish (use SafeNeuralBus or ensure damping)' });
  }
  if (/getCart\s*\(\)[\s\S]{0,200}\{[\s\S]*return\s+this\.cartData\b/.test(t)) {
    risky.push({ file: f, reason: 'cart getter returns live state (should deep-freeze clone)' });
  }
  if (/\bMath\.random\(\)\s*[<>]/.test(t)) {
    risky.push({ file: f, reason: 'randomness in control path (can cause observer drift)' });
  }
}

if (risky.length) {
  console.error('CrisisCore vector check failed:\n' +
    risky.map(r => ` - ${r.file}: ${r.reason}`).join('\n'));
  process.exit(1);
}
console.log('CrisisCore vector check: OK');
EOF
chmod +x scripts/check-collapse-vectors.js

echo "[+] Writing scripts/neural-cascade-check.js (eslint config shim)"
backup scripts/neural-cascade-check.js || true
tee scripts/neural-cascade-check.js >/dev/null <<'EOF'
module.exports = {
  rules: {
    // Gentle hint rules to catch obvious cascade patterns without breaking builds
    'no-restricted-syntax': ['warn', {
      selector: "CallExpression[callee.object.name='NeuralBus'][callee.property.name='publish']",
      message: "Use SafeNeuralBus.publish or ensure per-topic rate limiting and frozen payload."
    }],
  }
};
EOF

###############################################################################
# 5) Husky pre-commit guard
###############################################################################
echo "[+] Installing Husky pre-commit hook"
backup .husky/pre-commit || true
tee .husky/pre-commit >/dev/null <<'EOF'
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

# Fast exit if no JS/TS changes
if ! git diff --cached --name-only | grep -E '\.(js|ts|cjs|mjs|tsx)$' >/dev/null 2>&1; then
  exit 0
fi

# Lint-staged first (if present)
if [ -f package.json ] && npx --yes --quiet --no-install lint-staged >/dev/null 2>&1; then
  npx lint-staged || exit 1
fi

# CrisisCore focused checks
node scripts/check-collapse-vectors.js || exit 1

# Neural cascade hint pass (non-blocking without eslint installed)
if command -v npx >/dev/null 2>&1; then
  npx --yes eslint --no-eslintrc -c scripts/neural-cascade-check.js "$(git diff --cached --name-only | tr '\n' ' ')" || true
fi
EOF
chmod +x .husky/pre-commit

###############################################################################
# 6) Add basic lint-staged config if missing
###############################################################################
if [[ ! -f ".lintstagedrc.json" && -f "package.json" ]]; then
  echo "[+] Adding .lintstagedrc.json"
  tee .lintstagedrc.json >/dev/null <<'EOF'
{
  "*.{js,ts,tsx,cjs,mjs}": ["eslint --fix --max-warnings=0"],
  "*.{css,scss}": ["stylelint --fix"]
}
EOF
fi

###############################################################################
# 7) Friendly summary
###############################################################################
echo ""
echo "[✓] Hardening complete."
echo "Backups created with suffix: .bak.$(ts) (at operation time)."
echo ""
echo "Next steps:"
echo "  git add -A"
echo "  git commit -m \"CrisisCore: re-enable lint, install SafeNeuralBus, pre-commit guards\""
echo "  # then push (SSH key must be set up):"
echo "  git push -u origin \$(git branch --show-current)"
