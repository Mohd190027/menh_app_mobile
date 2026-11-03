# -*- coding: utf-8 -*-
"""نقل عداد الأثر إلى أعلى الصفحة الرئيسية (بعد الهيرو مباشرة) لبروز أكبر"""
import io, sys

P = '/home/z/my-project/download/dameen.html'
html = io.open(P, encoding='utf-8').read()

# 1) إزالته من أسفل الصفحة (بعد قسم «كيف يعمل»)
old_end = '''<div class="howc"><div class="n">٣</div><div><b>نحرر المبلغ</b><span>بالرضا أو تلقائياً — صافي التاجر يحرر لحظتها، والعمولة للإدارة.</span></div></div>
</div>
${impactBlock()}`;'''
new_end = '''<div class="howc"><div class="n">٣</div><div><b>نحرر المبلغ</b><span>بالرضا أو تلقائياً — صافي التاجر يحرر لحظتها، والعمولة للإدارة.</span></div></div>
</div>`;'''
assert html.count(old_end) == 1, 'end anchor'
html = html.replace(old_end, new_end)

# 2) إدراجه بعد الهيرو مباشرة (قبل bubzone)
old_bub = '<div class="bubzone">'
assert html.count(old_bub) == 1, 'bubzone anchor'
html = html.replace(old_bub, '${impactBlock()}\n\n<div class="bubzone">')

io.open(P, 'w', encoding='utf-8').write(html)
print('OK — impact counter moved to top of homepage')
