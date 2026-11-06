#!/usr/bin/env bash
# دفعة بحث الصور — يلتقط stdout ويستخرج JSON (خيار -o لا يعمل في هذه النسخة)
set -u
OUT=/tmp/img-search
mkdir -p "$OUT"

search () {  # $1=اسم  $2=استعلام  $3=عدد
  local f="$OUT/$1.json"
  if [ -s "$f" ] && python3 -c "import json,sys; d=json.load(open('$f')); sys.exit(0 if d.get('success') and d.get('results') else 1)" 2>/dev/null; then
    echo "تخطي $1 (موجود)"
    return
  fi
  echo "🔍 $1 ..."
  local raw
  raw=$(timeout 110 z-ai image-search -q "$2" --count "${3:-3}" --no-rank 2>/dev/null) || true
  printf '%s' "$raw" > "$OUT/$1.raw"
  python3 - "$OUT/$1.raw" "$f" <<'PY'
import json, sys
raw = open(sys.argv[1], encoding='utf-8', errors='ignore').read()
i = raw.find('{')
if i < 0: sys.exit(1)
try:
    d = json.loads(raw[i:])
except Exception:
    sys.exit(1)
if d.get('success') and d.get('results'):
    json.dump(d, open(sys.argv[2], 'w'))
    print(f"  ✓ {len(d['results'])} صورة")
else:
    sys.exit(1)
PY
  [ -s "$f" ] || echo "  ⚠ فشل: $1"
}

search dates      "premium Saudi khalas dates in a bowl, product photo" 4
search syrup      "dark date syrup dibs in glass jar, product photo" 3
search basket     "luxury gift basket with dates, honey jars and sweets" 3
search cups       "golden Arabic coffee cups dallah set, elegant product photo" 4
search burner     "engraved brass Arabic mabkhara incense burner" 3
search giftbox    "elegant velvet gift box navy gold ribbon" 3
search enab       "cooked warak enab grape leaves plate middle eastern dish" 3
search pajamas    "cotton embroidered pajama sleep set folded, product photo" 3
search headset    "wireless gaming headset black RGB, product photo" 4
search controller "pro gaming controller gamepad black, product photo" 4
search console    "handheld gaming console device, product photo" 3
search keyboard   "RGB mechanical gaming keyboard, product photo" 3
search gcode      "digital game code gift card for online gaming store" 3
search gsub       "gaming subscription card 12 months premium membership" 3
search gbook      "game development programming ebook on laptop screen" 3
search torn       "torn damaged fabric cloth closeup, defect evidence" 3
search wbox       "opened luxury gift box navy color complaint" 3
search gstore     "neon gaming store banner purple blue esports" 2
search vgifts     "elegant gift shop display wrapped presents warm tones" 2
search codes      "digital codes electronics store flat lay tech" 2
search foodcat    "Saudi hospitality dates coffee traditional food spread" 2

echo "════ انتهت الدفعة ════"
ls "$OUT"/*.json 2>/dev/null | wc -l
