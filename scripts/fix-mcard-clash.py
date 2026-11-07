#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""إصلاح تعارض .mcard: بطاقات معرض الوسائط كانت تطغى على بطاقات النوافذ
- النافذة (openModal) تحتاج overflow-y:auto للتمرير — كان يُلغى بـ overflow:hidden
- صور النوافذ (zoomImg) كانت تُقلص لارتفاع 124px بقاعدة .mcard img
- الحل: حصر قواعد المعرض داخل حاوياتها .mrail/.vrail — المعرض نفسه بلا أي تغيير بصري
"""
import io

SRC = '/home/z/my-project/download/dameen.html'
html = io.open(SRC, encoding='utf-8').read()

G = '.mrail .mcard,.vrail .mcard'  # البادئة المحصورة

REPL = [
    # بطاقة المعرض نفسها — كانت تقتل تمرير النوافذ
    ('.mcard{position:relative;flex:0 0 176px;scroll-snap-align:start;border-radius:16px;overflow:hidden;cursor:pointer;background:var(--card2);border:1px solid var(--line);box-shadow:0 5px 14px rgba(29,68,50,.09);transition:transform .18s}',
     G + '{position:relative;flex:0 0 176px;scroll-snap-align:start;border-radius:16px;overflow:hidden;cursor:pointer;background:var(--card2);border:1px solid var(--line);box-shadow:0 5px 14px rgba(29,68,50,.09);transition:transform .18s}'),
    # رفع البطاقة عند المرور — كانت ترفع النافذة كلها!
    ('.mcard:hover{transform:translateY(-3px)}',
     G + ':hover{transform:translateY(-3px)}'),
    # صورة البطاقة — كانت تقلص صور zoomImg داخل النوافذ
    ('.mcard img{width:100%;height:124px;object-fit:cover;display:block}',
     G + ' img{width:100%;height:124px;object-fit:cover;display:block}'),
    # أبناء البطاقة (توجد فقط في المعرض — حصرها أيضاً لضمان صفر تأثير على النوافذ مستقبلاً)
    ('.mcard .mcap{position:absolute;inset-inline:0;bottom:0;padding:24px 10px 8px;background:linear-gradient(0deg,rgba(16,26,21,.88),rgba(16,26,21,0));color:#fff;display:flex;flex-direction:column;gap:1px}',
     G + ' .mcap{position:absolute;inset-inline:0;bottom:0;padding:24px 10px 8px;background:linear-gradient(0deg,rgba(16,26,21,.88),rgba(16,26,21,0));color:#fff;display:flex;flex-direction:column;gap:1px}'),
    ('.mcard .mcap b{font-size:11.5px;font-weight:800;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}',
     G + ' .mcap b{font-size:11.5px;font-weight:800;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}'),
    ('.mcard .mcap small{font-size:10.5px;font-weight:700;color:#EBDCA8}',
     G + ' .mcap small{font-size:10.5px;font-weight:700;color:#EBDCA8}'),
    ('.mcard .play{position:absolute;top:42%;left:50%;transform:translate(-50%,-50%);width:42px;height:42px;border-radius:50%;background:rgba(16,26,21,.55);border:2px solid #fff;color:#fff;display:grid;place-items:center;font-size:14px;box-shadow:0 4px 14px rgba(0,0,0,.3)}',
     G + ' .play{position:absolute;top:42%;left:50%;transform:translate(-50%,-50%);width:42px;height:42px;border-radius:50%;background:rgba(16,26,21,.55);border:2px solid #fff;color:#fff;display:grid;place-items:center;font-size:14px;box-shadow:0 4px 14px rgba(0,0,0,.3)}'),
    ('.mcard .vtag{position:absolute;top:8px;inset-inline-end:8px;background:rgba(16,26,21,.74);color:#fff;font-size:9.5px;font-weight:700;padding:2.5px 8px;border-radius:99px}',
     G + ' .vtag{position:absolute;top:8px;inset-inline-end:8px;background:rgba(16,26,21,.74);color:#fff;font-size:9.5px;font-weight:700;padding:2.5px 8px;border-radius:99px}'),
]

missing = [old for old, _ in REPL if old not in html]
if missing:
    print('⚠ غير موجود:'); [print('  ', m[:80]) for m in missing]
    raise SystemExit(1)

for old, new in REPL:
    assert html.count(old) == 1, 'تكرار غير متوقع: ' + old[:60]
    html = html.replace(old, new)

io.open(SRC, 'w', encoding='utf-8').write(html)
print('✓ حُصرت ٨ قواعد معرض الوسائط داخل .mrail/.vrail — النوافذ تستعيد تمريرها')
