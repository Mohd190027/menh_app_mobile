#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""الدفعة ١٢ إصلاح ١ — حصر القائمتين المنسدلتين (الأقسام والمتاجر) داخل حدود الشاشة على الجوال"""
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

# حصر أفقي ذكي للقوائم الثابتة: يُحسب موضع الزر لكن يُمنع تجاوز حواف الشاشة
rep(
"""function storesDD(e,btn){
e.stopPropagation();
const el=$('#storesdrop');if(!el)return;
if(el.classList.contains('open')){el.classList.remove('open');return}
const r=btn.getBoundingClientRect();
el.style.top=(r.bottom+8)+'px';
el.style.insetInlineEnd=Math.max(10,window.innerWidth-r.right)+'px';
el.classList.add('open');
}""",
"""function ddPlace(el,btn){
const r=btn.getBoundingClientRect(),vw=window.innerWidth;
el.style.top=(r.bottom+8)+'px';
el.classList.add('open');
const w=el.offsetWidth,margin=10;
let end=Math.max(margin,vw-r.right);
if(w>vw-2*margin){el.style.insetInlineEnd='';el.style.left=margin+'px';el.style.width=(vw-2*margin)+'px'}
else{el.style.left='';el.style.insetInlineEnd=end+'px'}
}
function storesDD(e,btn){
e.stopPropagation();
const el=$('#storesdrop');if(!el)return;
if(el.classList.contains('open')){el.classList.remove('open');return}
ddPlace(el,btn);
}""",
'storesDD محصورة داخل الشاشة')

# نفس الحصر لقائمة الأقسام secDD
rep(
"""function secDD(e,btn){
e.stopPropagation();
const el=$('#secdrop');if(!el)return;
if(el.classList.contains('open')){el.classList.remove('open');return}
const r=btn.getBoundingClientRect();
el.style.top=(r.bottom+8)+'px';
el.style.insetInlineEnd=Math.max(10,window.innerWidth-r.right)+'px';
el.classList.add('open');
}""",
"""function secDD(e,btn){
e.stopPropagation();
const el=$('#secdrop');if(!el)return;
if(el.classList.contains('open')){el.classList.remove('open');return}
ddPlace(el,btn);
}""",
'secDD محصورة داخل الشاشة')

io.open(F, 'w', encoding='utf-8').write(s)
print('تم — قوائم محصورة داخل الشاشة')
