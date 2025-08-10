#!/bin/bash
set -e
ROOT_DIR="${1:-.}"
echo "[*] Applying CrisisCore Hardening fixes to $ROOT_DIR"

# Inject imports & usage in affected files
declare -A files_to_patch=(
  ["quantum-analytics.js"]="QuantumBreaker"
  ["ResonanceSystem.js"]="ResonanceDampener"
  ["quantum-hologram.js"]="QuantumVerifier"
  ["assets/memory-encoder.ts"]="PatternIsolator"
  ["QuantumFlowExtension.jsx"]="CoherenceGate"
)

for file in "${!files_to_patch[@]}"; do
  path="$ROOT_DIR/$file"
  if [[ -f "$path" ]]; then
    echo "  [+] Patching $file"
    sed -i "1i import { ${files_to_patch[$file]} } from './tools/auditor/crisiscore_hardening';" "$path"
    # You could also add code snippets to instantiate and use the fix here
  else
    echo "  [!] Skipped missing $file"
  fi
done

echo "[✓] Hardening injection complete."
