#!/usr/bin/env bash
# بحث تسلسلي — $1 = ملف قائمة
OUT=/tmp/img-search; mkdir -p "$OUT"
while IFS='|' read -r name query count; do
  [ -z "$name" ] && continue
  if [ -s "$OUT/$name.json" ]; then echo "تخطي $name"; continue; fi
  raw=$(timeout 150 z-ai image-search -q "$query" --count "$count" --no-rank 2>/dev/null) || true
  printf '%s' "$raw" > "$OUT/$name.raw"
  python3 - "$OUT/$name.raw" "$OUT/$name.json" "$name" << 'PY'
import json, sys
raw = open(sys.argv[1], encoding='utf-8', errors='ignore').read()
i = raw.find('{')
if i < 0: sys.exit(1)
try: d = json.loads(raw[i:])
except Exception: sys.exit(1)
if d.get('success') and d.get('results'):
    json.dump(d, open(sys.argv[2], 'w')); print(f"  ✓ {sys.argv[3]}: {len(d['results'])}")
else: sys.exit(1)
PY
  [ -s "$OUT/$name.json" ] || echo "  ⚠ فشل: $name"
done < "$1"
