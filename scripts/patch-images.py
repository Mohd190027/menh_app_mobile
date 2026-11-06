#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""ترقيع الصور: استبدال كل روابط CDN الميتة/الهشة بمسارات محلية دائمة
- ١٩ رابطاً حياً → تنزيلها تم بأسمائها (هاش) → /dameen/img/<hash>
- ٢٢ رابطاً ميتاً → صور بديلة مناسبة للسياق
- ZPOOL → إعادة بناء بمزيج محلي متنوع
"""
import io, re, shutil

SRC = '/home/z/my-project/download/dameen.html'
html = io.open(SRC, encoding='utf-8').read()

DEAD = [l.split()[-1] for l in io.open('/tmp/img-status.txt', encoding='utf-8') if l.startswith('404')]
DEAD_H = {u.rsplit('/', 1)[-1] for u in DEAD}

# خريطة: هاش ميت → صورة محلية (للاستخدام العام خارج ZPOOL)
MAP = {
    'b2f1f08ffc64.png': 'foodcat.jpg',   # تصنيف عالم المأكولات والضيافة
    '98a1ab5d2183.jpg': 'GIFT_OR_BOX',    # متعدد السياقات (s6 غلاف / p19 بوكس)
    '28b3519cc57c.jpg': 'gstore.jpg',    # غلاف قيمز زون
    '8eac332529c2.png': 'codes.jpg',     # غلاف بايت كود
    '53aef9882d40.jpg': 'pajamas.jpg',   # p4 طقم بيت
    'cce49520b1e4.jpeg': 'dates.jpg',    # p9 تمر خلاص
    '271fff8e23ab.jpeg': 'syrup.jpg',    # p10 دبس تمر
    '650709575035.jpg': 'basket.jpg',    # p11 سلة الواحة
    '559a027cf1cb.jpg': 'burner.jpg',    # p17 مبخرة
    '285d08d3a5ca.jpg': 'cups.jpg',      # p18 فناجيل
    '991d8bb4c001.jpg': 'enab.jpg',      # p23 ورق عنب
    '2f9d9fe61140.jpg': 'headset2.jpg',  # p25 سماعة (الصورة الثانية)
    '308769bd3796.jpg': 'headset1.jpg',  # p25 سماعة (الغلاف)
    'e861dc8f6341.png': 'controller1.jpg', # p26 ذراع (الغلاف)
    '5bd6ab3c9322.png': 'controller2.jpg', # p26 ذراع (الثانية)
    '7ddc9c999a9d.jpg': 'console.png',   # p27 جهاز محمول
    '4e591ed2c48b.png': 'keyboard.jpg',  # p28 لوحة مفاتيح
    '2fb50ac6678a.jpg': 'gcode.jpg',     # p29 كود لعبة
    '160a70aabe91.jpg': 'gsub.jpg',      # p30 اشتراك جيمنج
    '06fdd0b9a622.jpg': 'gbook.jpg',     # p31 كتاب PDF
    '2ee34fcf2428.jpg': 'torn.jpg',      # دليل نزاع: مفرش ممزق
    '2f0ce9ff82fd.jpg': 'wbox.jpg',      # دليل نزاع: بوكس لون خاطئ
}
ZPOOL_POOL = ['dates.jpg', 'syrup.jpg', 'basket.jpg', 'cups.jpg', 'burner.jpg', 'enab.jpg',
              'giftbox.jpg', 'vgifts.jpg', 'headset1.jpg', 'headset2.jpg', 'controller1.jpg',
              'controller2.jpg', 'console.png', 'keyboard.jpg', 'gcode.jpg', 'gsub.jpg',
              'gbook.jpg', 'pajamas.jpg', 'foodcat.jpg', 'gstore.jpg']
CDN = 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/'
lines = html.split('\n')
zpool_done = False
for i, ln in enumerate(lines):
    if CDN not in ln:
        continue
    # ١) سطر ZPOOL — إعادة بناء كاملة
    if 'const ZPOOL=[' in ln:
        urls = re.findall(re.escape(CDN) + r"([a-z0-9]+\.\w+)", ln)
        out = []
        zi = 0
        for h in urls:
            if h in DEAD_H:
                out.append('/dameen/img/' + ZPOOL_POOL[zi % len(ZPOOL_POOL)]); zi += 1
            else:
                out.append('/dameen/img/' + h)
        lines[i] = re.sub(r"\[.*\]", '[' + ','.join(f"'{u}'" for u in out) + ']', ln, count=1)
        zpool_done = True
        print(f'ZPOOL: {len(urls)} مدخل → {zi} استبدال ميت')
        continue
    # ٢) استبدال الروابط الحية بنفس أسمائها
    for h in set(re.findall(re.escape(CDN) + r"([a-z0-9]+\.\w+)", ln)):
        if h not in DEAD_H:
            ln = ln.replace(CDN + h, '/dameen/img/' + h)
    # ٣) الروابط الميتة حسب السياق
    for h in set(re.findall(re.escape(CDN) + r"([a-z0-9]+\.\w+)", ln)):
        if h in DEAD_H:
            tgt = MAP.get(h)
            if tgt == 'GIFT_OR_BOX':
                tgt = 'vgifts.jpg' if "id:'s6'" in ln else 'giftbox.jpg'
            if not tgt:
                print(f'  ⚠ هاش بلا خريطة: {h} (سطر {i+1})'); continue
            ln = ln.replace(CDN + h, '/dameen/img/' + tgt)
            print(f'  سطر {i+1}: {h} → {tgt}')
    lines[i] = ln

html = '\n'.join(lines)
# تحقق نهائي
rest = re.findall(re.escape(CDN) + r"[a-z0-9]+\.\w+", html)
print('════ روابط CDN متبقية:', len(rest))
for r in set(rest): print('  ⚠', r)
io.open(SRC, 'w', encoding='utf-8').write(html)
print('ZPOOL معاد بناؤه:', zpool_done, '| تم الحفظ')
