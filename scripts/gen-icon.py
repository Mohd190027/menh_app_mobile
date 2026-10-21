#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""توليد أيقونات تطبيق ضمين: خلفية متدرجة خضراء + «ض» بالكريمي — 4 ملفات PNG مُحسَّنة"""
from PIL import Image, ImageDraw, ImageFont, ImageFilter
import base64, io, os

W = 1024
FONT = '/usr/share/fonts/truetype/freefont/FreeSerifBold.ttf'
GREEN1, GREEN2, GREEN3 = (29, 68, 50), (46, 92, 67), (60, 115, 85)
CREAM = (246, 242, 233)
GOLD = (176, 126, 43)

def gradient(w, h):
    img = Image.new('RGB', (w, h))
    d = ImageDraw.Draw(img)
    # تدرج قطري 140deg عبر ثلاث درجات خضراء
    stops = [(0.0, GREEN1), (0.62, GREEN2), (1.0, GREEN3)]
    for y in range(h):
        for x in range(0, w, 8):  # خطوط أفقية مع إزاحة قطرية
            t = (x / w * 0.45 + y / h * 0.55)
            for i in range(len(stops) - 1):
                t0, c0 = stops[i]; t1, c1 = stops[i + 1]
                if t0 <= t <= t1:
                    f = (t - t0) / (t1 - t0)
                    c = tuple(int(c0[k] + (c1[k] - c0[k]) * f) for k in range(3))
                    break
            else:
                c = stops[-1][1]
            d.rectangle([x, y, x + 8, y + 1], fill=c)
    return img

def make_icon(size, letter_scale=0.52, rounded=False, glow=False):
    img = gradient(W, W)
    if glow:  # هالة ذهبية خفيفة خلف الحرف
        gl = Image.new('L', (W, W), 0)
        gd = ImageDraw.Draw(gl)
        gd.ellipse([W * 0.22, W * 0.20, W * 0.78, W * 0.82], fill=90)
        gl = gl.filter(ImageFilter.GaussianBlur(70))
        gold_layer = Image.new('RGB', (W, W), GOLD)
        img = Image.composite(gold_layer, img, gl.point(lambda v: min(v, 38)))
    d = ImageDraw.Draw(img)
    font = ImageFont.truetype(FONT, int(W * letter_scale))
    bbox = d.textbbox((0, 0), 'ض', font=font)
    tw, th = bbox[2] - bbox[0], bbox[3] - bbox[1]
    d.text(((W - tw) / 2 - bbox[0], (W - th) / 2 - bbox[1] - W * 0.015), 'ض', font=font, fill=CREAM,
           stroke_width=int(W * 0.008), stroke_fill=CREAM)
    img = img.resize((size, size), Image.LANCZOS)
    if rounded:  # زوايا مدورة بخلفية شفافة (لأيقونة any)
        r = int(size * 0.225)
        mask = Image.new('L', (size, size), 0)
        ImageDraw.Draw(mask).rounded_rectangle([0, 0, size - 1, size - 1], radius=r, fill=255)
        out = Image.new('RGBA', (size, size), (0, 0, 0, 0))
        out.paste(img, (0, 0), mask)
        img = out
    return img

def to_b64(img):
    buf = io.BytesIO()
    if img.mode == 'RGBA':
        img_q = img.quantize(colors=192, method=Image.FASTOCTREE)
    else:
        img_q = img.quantize(colors=192, method=Image.MEDIANCUT)
    img_q.save(buf, format='PNG', optimize=True)
    data = buf.getvalue()
    return base64.b64encode(data).decode(), len(data)

OUT = '/home/z/my-project/scripts/img/icons'
os.makedirs(OUT, exist_ok=True)
results = {}
for key, kw in [
    ('icon192', dict(size=192, letter_scale=0.52, rounded=True, glow=True)),
    ('icon512', dict(size=512, letter_scale=0.52, rounded=True, glow=True)),
    ('mask512', dict(size=512, letter_scale=0.42, rounded=False, glow=True)),   # قابلة للقناع: حرف أصغر داخل منطقة أمان
    ('apple180', dict(size=180, letter_scale=0.46, rounded=False, glow=True)),  # iOS يقصّر الزوايا تلقائياً
]:
    img = make_icon(**kw)
    img.save(os.path.join(OUT, key + '.png'))
    b64, ln = to_b64(img)
    open(os.path.join(OUT, key + '.b64'), 'w').write(b64)
    results[key] = ln
    print(key, '→', ln, 'bytes')

print('TOTAL:', sum(results.values()), 'bytes raw base64 ~', sum(results.values()) * 4 // 3)
