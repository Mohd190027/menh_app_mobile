#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""إصلاح ٣ — معاينة آخر رسالة في مراقبة محادثات الإدارة (رسائل الموقع والمبلغ الإضافي بلا .t)"""
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

rep("""<div class="rows">${chats.slice(0,5).map(({o,g,gi})=>{const last=[...(g.chat||[])].reverse().find(m=>m.r!=='sys');
return `<div class="row" style="cursor:pointer" onclick="openOChat(${o.id},${gi})">
<div style="flex:1;min-width:0"><b>طلب #${ar(o.id)} · ${ST(g.store).name} × ${USERS[o.customer]?esc(USERS[o.customer].name.split(' ')[0]):'عميل'}</b>
<div class="hint">${last?esc(last.t.slice(0,60))+(last.t.length>60?'…':''):'—'} · ${ar((g.chat||[]).length)} رسالة${g.chatDeleted?' · ⛔ محذوفة لمخالفة':g.chatArchived?' · 🗄️ مؤرشفة':''}</div></div>""",
"""<div class="rows">${chats.slice(0,5).map(({o,g,gi})=>{const last=[...(g.chat||[])].reverse().find(m=>m.r!=='sys');
const ltxt=last?(last.loc?('📍 '+last.loc.txt):(last.payreq?('💰 طلب مبلغ إضافي بـ'+money(last.payreq.amt)):String(last.t))):'';
return `<div class="row" style="cursor:pointer" onclick="openOChat(${o.id},${gi})">
<div style="flex:1;min-width:0"><b>طلب #${ar(o.id)} · ${ST(g.store).name} × ${USERS[o.customer]?esc(USERS[o.customer].name.split(' ')[0]):'عميل'}</b>
<div class="hint">${last?esc(ltxt.slice(0,60))+(ltxt.length>60?'…':''):'—'} · ${ar((g.chat||[]).length)} رسالة${g.chatDeleted?' · ⛔ محذوفة لمخالفة':g.chatArchived?' · 🗄️ مؤرشفة':''}</div></div>""",
'pgAOver: معاينة آمنة لرسائل الموقع والمبلغ')

io.open(F, 'w', encoding='utf-8').write(s)
print('DONE: %d fixes' % n)
