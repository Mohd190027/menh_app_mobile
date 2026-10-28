#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""الدفعة ١٢ إصلاح ٢ — منطق حصر القوائم: end = min(vw - r.right, vw - w - margin)"""
import io, sys

F = '/home/z/my-project/download/dameen.html'
s = io.open(F, encoding='utf-8').read()

def rep(old, new, name, count=1):
    global s
    c = s.count(old)
    if c != count:
        print('  FAIL [%s] anchor found %d times (expected %d)' % (name, c, count))
        sys.exit(1)
    s = s.replace(old, new)
    print('  OK %s' % name)

rep(
"""const w=el.offsetWidth,margin=10;
let end=Math.max(margin,vw-r.right);
if(w>vw-2*margin){el.style.insetInlineEnd='';el.style.left=margin+'px';el.style.width=(vw-2*margin)+'px'}
else{el.style.left='';el.style.insetInlineEnd=end+'px'}""",
"""const w=el.offsetWidth,margin=10,room=vw-2*margin;
let end=Math.max(margin,Math.min(vw-r.right,vw-w-margin));
if(w>room){el.style.insetInlineEnd='';el.style.width=room+'px';el.style.left=margin+'px'}
else{el.style.width='';el.style.left='';el.style.insetInlineEnd=end+'px'}""",
'حصر end بين margin و vw-w-margin')

io.open(F, 'w', encoding='utf-8').write(s)
print('تم')
