#!/usr/bin/env bash
set -euo pipefail

# Run from repo root; operate only inside backend/
if [ ! -d "backend" ]; then
  echo "Run from the repository root (backend/ not found)"; exit 1
fi

echo "Fixing import prefixes inside backend/ ..."

# 1) Replace: from backend.module.sub import X  -> from module.sub import X
# 2) Replace: import backend.module.sub          -> import module.sub
# Note: BSD sed (macOS) inline edit uses -i '' for no backup
find backend -type f -name "*.py" -print0 | xargs -0 sed -i '' \
  -e 's/^[[:space:]]*from[[:space:]]\+backend\.\([A-Za-z0-9_\.]\+\)[[:space:]]\+import[[:space:]]\+/from \1 import /' \
  -e 's/^[[:space:]]*import[[:space:]]\+backend\.\([A-Za-z0-9_\.]\+\)/import \1/'

echo "Scanning for remaining prefixed imports..."
grep -Rn "from[[:space:]]\+backend\.\|import[[:space:]]\+backend\." backend || echo "✅ No remaining 'backend.' imports."

echo "Done."
