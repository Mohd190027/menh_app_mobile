#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""استخراج CSS/JS من dameen.html (المصدر) إلى public/dameen/ + مزامنة النسخ"""
import io, shutil

SRC = '/home/z/my-project/download/dameen.html'
html = io.open(SRC, encoding='utf-8').read()

s = html.index('<style>') + len('<style>')
e = html.index('</style>')
css = html[s:e].strip() + '\n'

s = html.index('<script>') + len('<script>')
e = html.rindex('</script>')
js = html[s:e].strip() + '\n'

io.open('/home/z/my-project/public/dameen/dameen.css', 'w', encoding='utf-8').write(css)
io.open('/home/z/my-project/public/dameen/dameen.js', 'w', encoding='utf-8').write(js)
shutil.copy(SRC, '/home/z/my-project/public/dameen.html')
print('css=%d bytes, js=%d bytes, html copied' % (len(css), len(js)))
