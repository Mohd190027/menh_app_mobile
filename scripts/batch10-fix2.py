#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""إصلاح ٢ — إعادة فتح دردشة الطلب بعد إرسال طلب المبلغ الإضافي (النافذة كانت تُستبدل)"""
import io, sys
F = '/home/z/my-project/download/dameen.html'
s = io.open(F, encoding='utf-8').read()
n = 0
def rep(old, new, name, count=1):
    global s, n
    c = s.count(old)
    if c != count:
        print('  FAIL [%s] anchor found %d times (expected %d)' % (name, c, count))
        sys.exit(1)
    s = s.replace(old, new)
    n += 1
    print('  OK %s' % name)

rep("closeModal();toast('أُرسل طلب الدفع إلى العميل ✓','ok');ochatRefresh();",
    "closeModal();toast('أُرسل طلب الدفع إلى العميل ✓','ok');openOChat(OCHAT.oid,OCHAT.gi);",
    'mAskExtraGo: إعادة فتح الدردشة بعد الإرسال')

io.open(F, 'w', encoding='utf-8').write(s)
print('DONE: %d fixes' % n)
