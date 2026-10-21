#!/usr/bin/env python3
import subprocess, json, os, sys
from concurrent.futures import ThreadPoolExecutor

IMG_DIR = '/home/z/my-project/scripts/img'
os.makedirs(IMG_DIR, exist_ok=True)

QUERIES = {
  'secfash': 'elegant black abaya luxury fashion boutique display',
  'secfood': 'premium Saudi dates and honey jars traditional luxury',
  'secgift': 'Arabic luxury home decor candles brass elegant interior',
  'p4a': 'women cotton embroidered pajama loungewear set folded',
  'p4b': 'cozy beige cotton pajama set for women',
  'p5': 'elegant velvet evening gown dress fashion',
  'p8a': 'natural sidr honey jar with dipper',
  'p8b': 'glass jar of golden honey on wooden table',
  'p9': 'premium khalas dates in decorative bowl',
  'p10': 'dark date syrup in glass bottle',
  'p11': 'dates and honey luxury gift basket',
  'p12': 'traditional Saudi sadu weaving colorful textile',
  'p13': 'handwoven colorful textile craft closeup',
  'p14': 'fresh white cheese in bowl homemade',
  'p15': 'traditional Arabic flat bread fresh baked',
  'p16': 'scented candle in glass jar with flowers aesthetic',
  'p17': 'Arabic brass incense burner mabkhara with smoke',
  'p18': 'Arabic coffee cups golden set with dallah',
  'p19a': 'luxury velvet gift box with ribbon',
  'p19b': 'elegant white gift box with gold ribbon',
  'p20': 'Arabic calligraphy framed wall art black and gold',
  'p21': 'handmade glazed ceramic pottery vase earthy tones',
  'p22': 'celebration cake with cream frosting decoration',
  'p23': 'stuffed grape leaves plate traditional Arabic',
  'p24': 'Arabic hospitality table setting with coffee and dates',
}

import time
def fetch(item):
    key, q = item
    out = os.path.join(IMG_DIR, key + '.json')
    if os.path.exists(out) and os.path.getsize(out) > 100:
        return key, 'cached'
    for attempt in range(3):
        try:
            r = subprocess.run(['z-ai', 'image-search', '-q', q, '-c', '2', '--gl', 'us', '--no-rank'],
                               capture_output=True, text=True, timeout=240)
            # stdout has banner lines then JSON; find the JSON start
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

# summary
print('\n=== SUMMARY ===')
for key in QUERIES:
    p = os.path.join(IMG_DIR, key + '.json')
    if os.path.exists(p):
        d = json.load(open(p))
        urls = [r['original_url'] for r in d['results']]
        print(key, len(urls), urls[0][:70])
    else:
        print(key, 'MISSING')
