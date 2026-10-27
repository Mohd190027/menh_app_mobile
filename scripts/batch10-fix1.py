#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""إصلاحات لاحقة للدفعة ١٠ — ipOK للمنتجات الرقمية الجديدة في mSaveProd"""
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

rep("giftOk:$('#mp-gift')?$('#mp-gift').checked:false,fragile,customOk,digi,sold:0,rt:0,rc:0",
    "giftOk:$('#mp-gift')?$('#mp-gift').checked:false,fragile,customOk,digi,ipOK,sold:0,rt:0,rc:0",
    'mSaveProd: ipOK على المنتج الرقمي الجديد')

io.open(F, 'w', encoding='utf-8').write(s)
print('DONE: %d fixes' % n)
