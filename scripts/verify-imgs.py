#!/usr/bin/env python3
import json, os, urllib.request, concurrent.futures

IMG_DIR = '/home/z/my-project/scripts/img'
keys = [f[:-5] for f in os.listdir(IMG_DIR) if f.endswith('.json')]
urls = {}
for k in keys:
    d = json.load(open(os.path.join(IMG_DIR, k + '.json')))
    urls[k] = [r['original_url'] for r in d['results']]

def head(u):
    try:
        req = urllib.request.Request(u, method='HEAD', headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req, timeout=15) as r:
            return r.status == 200
    except Exception:
        return False

all_urls = sorted({u for v in urls.values() for u in v})
with concurrent.futures.ThreadPoolExecutor(max_workers=10) as ex:
    res = dict(zip(all_urls, ex.map(head, all_urls)))

ok, bad = 0, 0
for k in sorted(urls):
    good = [u for u in urls[k] if res.get(u)]
    if good:
        ok += 1
        urls[k] = good
    else:
        bad += 1
        print('BAD', k, urls[k])
print(f'OK: {ok}, BAD: {bad}')
json.dump(urls, open('/home/z/my-project/scripts/img/map.json', 'w'), indent=1)
for k in sorted(urls):
    print(k, urls[k][0])
