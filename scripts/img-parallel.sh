#!/usr/bin/env bash
# بحث متوازٍ عن الصور — $1 = ملف قائمة الاستعلامات (name|query|count)
OUT=/tmp/img-search; mkdir -p "$OUT"
run_one() {
  IFS='|' read -r name query count <<< "$1"
  [ -s "$OUT/$name.json" ] && { echo "تخطي $name"; return; }
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
}
export -f run_one; export OUT
cat "$1" | xargs -d '\n' -P 3 -I {} bash -c 'run_one "$@"' _ {}
echo "════ انتهت: $(ls $OUT/*.json 2>/dev/null | wc -l) استعلام ناجح ════"
