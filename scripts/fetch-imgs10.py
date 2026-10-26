#!/usr/bin/env python3
import subprocess, json, os, time
from concurrent.futures import ThreadPoolExecutor

IMG_DIR = '/home/z/my-project/scripts/img'
os.makedirs(IMG_DIR, exist_ok=True)

QUERIES = {
  'secgaming': 'gaming setup with neon lights console and controller desk',
  's9cov': 'gaming gear store shelves with headsets and accessories neon',
  's10cov': 'digital gift cards and subscription codes display',
  'p25': 'wireless gaming headset with microphone RGB lighting',
  'p26': 'pro gaming controller gamepad black',
  'p27': 'handheld gaming console portable device',
  'p28': 'mechanical RGB backlit gaming keyboard',
  'p29': 'video game digital download code card',
  'p30': 'gaming subscription gift card 12 months',
  'p31': 'ebook reading on tablet device digital book',
  'p32': 'custom neon theme user interface design dashboard',
}

def fetch(item):
    key, q = item
    out = os.path.join(IMG_DIR, key + '.json')
    if os.path.exists(out) and os.path.getsize(out) > 100:
        return key, 'cached'
    for attempt in range(3):
        try:
            r = subprocess.run(['z-ai', 'image-search', '-q', q, '-c', '2', '--gl', 'us', '--no-rank'],
                               capture_output=True, text=True, timeout=240)
            txt = r.stdout
            i = txt.find('{')
            if i < 0:
                if attempt < 2:
                    time.sleep(8)
                    continue
                return key, 'NO JSON: ' + (r.stderr or txt)[:100]
            data = json.loads(txt[i:])
            if not data.get('success') or not data.get('results'):
                if attempt < 2:
                    time.sleep(8)
                    continue
                return key, 'FAIL: ' + str(data.get('error', 'empty'))[:100]
            with open(out, 'w') as f:
                json.dump(data, f, ensure_ascii=False)
            return key, 'ok ' + str(len(data['results']))
        except Exception as e:
            if attempt < 2:
                time.sleep(8)
                continue
            return key, 'ERR: ' + str(e)[:100]

with ThreadPoolExecutor(max_workers=2) as ex:
    for key, status in ex.map(fetch, QUERIES.items()):
        print(key, '->', status, flush=True)

print('\n=== SUMMARY ===')
for key in QUERIES:
    p = os.path.join(IMG_DIR, key + '.json')
    if os.path.exists(p):
        d = json.load(open(p))
        urls = [r['original_url'] for r in d['results']]
        print(key, len(urls), urls[0][:75])
    else:
        print(key, 'MISSING')
