#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""تصحيح صياغة حصر .mcard: اللاحقة يجب أن تلحق كل محدد في المجموعة
'.mrail .mcard,.vrail .mcard' + ' img' خطأ → '.mrail .mcard img,.vrail .mcard img'
"""
import io

SRC = '/home/z/my-project/download/dameen.html'
html = io.open(SRC, encoding='utf-8').read()

# الصيغة الخاطئة الحالية → الصيغة الصحيحة
FIXES = [
    ('.mrail .mcard,.vrail .mcard:hover{transform:translateY(-3px)}',
     '.mrail .mcard:hover,.vrail .mcard:hover{transform:translateY(-3px)}'),
    ('.mrail .mcard,.vrail .mcard img{width:100%;height:124px;object-fit:cover;display:block}',
     '.mrail .mcard img,.vrail .mcard img{width:100%;height:124px;object-fit:cover;display:block}'),
    ('.mrail .mcard,.vrail .mcard .mcap{position:absolute;inset-inline:0;bottom:0;padding:24px 10px 8px;background:linear-gradient(0deg,rgba(16,26,21,.88),rgba(16,26,21,0));color:#fff;display:flex;flex-direction:column;gap:1px}',
     '.mrail .mcard .mcap,.vrail .mcard .mcap{position:absolute;inset-inline:0;bottom:0;padding:24px 10px 8px;background:linear-gradient(0deg,rgba(16,26,21,.88),rgba(16,26,21,0));color:#fff;display:flex;flex-direction:column;gap:1px}'),
    ('.mrail .mcard,.vrail .mcard .mcap b{font-size:11.5px;font-weight:800;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}',
     '.mrail .mcard .mcap b,.vrail .mcard .mcap b{font-size:11.5px;font-weight:800;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}'),
    ('.mrail .mcard,.vrail .mcard .mcap small{font-size:10.5px;font-weight:700;color:#EBDCA8}',
     '.mrail .mcard .mcap small,.vrail .mcard .mcap small{font-size:10.5px;font-weight:700;color:#EBDCA8}'),
    ('.mrail .mcard,.vrail .mcard .play{position:absolute;top:42%;left:50%;transform:translate(-50%,-50%);width:42px;height:42px;border-radius:50%;background:rgba(16,26,21,.55);border:2px solid #fff;color:#fff;display:grid;place-items:center;font-size:14px;box-shadow:0 4px 14px rgba(0,0,0,.3)}',
     '.mrail .mcard .play,.vrail .mcard .play{position:absolute;top:42%;left:50%;transform:translate(-50%,-50%);width:42px;height:42px;border-radius:50%;background:rgba(16,26,21,.55);border:2px solid #fff;color:#fff;display:grid;place-items:center;font-size:14px;box-shadow:0 4px 14px rgba(0,0,0,.3)}'),
    ('.mrail .mcard,.vrail .mcard .vtag{position:absolute;top:8px;inset-inline-end:8px;background:rgba(16,26,21,.74);color:#fff;font-size:9.5px;font-weight:700;padding:2.5px 8px;border-radius:99px}',
     '.mrail .mcard .vtag,.vrail .mcard .vtag{position:absolute;top:8px;inset-inline-end:8px;background:rgba(16,26,21,.74);color:#fff;font-size:9.5px;font-weight:700;padding:2.5px 8px;border-radius:99px}'),
]

missing = [o for o, _ in FIXES if o not in html]
if missing:
    print('⚠ غير موجود:'); [print('  ', m[:90]) for m in missing]; raise SystemExit(1)
for o, n in FIXES:
    assert html.count(o) == 1
    html = html.replace(o, n)
io.open(SRC, 'w', encoding='utf-8').write(html)
print('✓ صُحّحت ٧ محددات — اللاحقة تلحق كل طرفي المجموعة')
