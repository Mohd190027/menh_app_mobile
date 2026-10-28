#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""الدفعة ١٢ — قسم الإدارة:
١) زر «المتاجر» في القائمة العلوية: قائمة منسدلة فيها «طلبات التسجيل» و«جميع المتاجر» — تفتح التبويب المناسب في مركز الإدارة
٢) حذف «حق الاعتماد» نهائياً: كل المتاجر معروضة للعملاء، لا بطاقة اعتماد ولا زر اعتماد ولا حقل اعتماد في إعدادات التاجر — يبقى الإيقاف فقط
كل التعديلات على الملف المدمج مباشرة: download/dameen.html"""
import io, sys

F = '/home/z/my-project/download/dameen.html'
s = io.open(F, encoding='utf-8').read()
orig = len(s)
n_edits = 0

def rep(old, new, name, count=1):
    global s, n_edits
    c = s.count(old)
    if c != count:
        print('  FAIL [%s] anchor found %d times (expected %d)' % (name, c, count))
        sys.exit(1)
    s = s.replace(old, new)
    n_edits += 1
    print('  OK %s' % name)

print('== A. قائمة الإدارة العلوية: زر المتاجر ▾ بقائمة منسدلة ==')
rep(
"${mnav('a-hub','📊 مركز الإدارة')}${mnav('a-disputes','⚖️ التحكيم')}${mnav('a-cats','🗂️ الأقسام')}${mnav('a-rev','📈 الإيرادات')}\n"
"</nav>${bellBtn()}${roleDD()}</div>`;",
"REPM",
0) if False else None

rep(
"${mnav('a-hub','📊 مركز الإدارة')}${mnav('a-disputes','⚖️ التحكيم')}${mnav('a-cats','🗂️ الأقسام')}${mnav('a-rev','📈 الإيرادات')}\n"
"</nav>${bellBtn()}${roleDD()}</div>`;",
"${mnav('a-hub','📊 مركز الإدارة')}${mnav('a-disputes','⚖️ التحكيم')}${mnav('a-cats','🗂️ الأقسام')}${mnav('a-rev','📈 الإيرادات')}\n"
"<button class=\"nlink\" data-storesb onclick=\"storesDD(event,this)\">🏪 المتاجر ▾</button>\n"
"<div class=\"ddmenu secs\" id=\"storesdrop\"><div class=\"sechd\">إدارة ضمين — اختر وجهة</div>\n"
"<div class=\"hti\" onclick=\"storesDDGo('reqs')\"><b>📋 طلبات التسجيل</b><span>مراجعة طلبات فتح المتاجر والانضمام للإدارة</span></div>\n"
"<div class=\"hti\" onclick=\"storesDDGo('stores')\"><b>🏪 جميع المتاجر</b><span>الإيقاف والإلغاء ومراجعة المحافظ</span></div></div>\n"
"</nav>${bellBtn()}${roleDD()}</div>`;",
"A1 زر المتاجر ▾ + القائمة المنسدلة")

print('== B. منطق القائمة المنسدلة للمتاجر ==')
rep(
"function bellBtn(){",
"function storesDD(e,btn){\n"
"e.stopPropagation();\n"
"const el=$('#storesdrop');if(!el)return;\n"
"if(el.classList.contains('open')){el.classList.remove('open');return}\n"
"const r=btn.getBoundingClientRect();\n"
"el.style.top=(r.bottom+8)+'px';\n"
"el.style.insetInlineEnd=Math.max(10,window.innerWidth-r.right)+'px';\n"
"el.classList.add('open');\n"
"}\n"
"function storesDDGo(t){const el=$('#storesdrop');if(el)el.classList.remove('open');go('a-hub',t)}\n"
"function bellBtn(){",
'B1 storesDD + storesDDGo')

rep(
"if(el&&el.classList.contains('open')&&!el.contains(e.target)&&!(e.target.closest&&e.target.closest('[data-secb]')))el.classList.remove('open')});",
"if(el&&el.classList.contains('open')&&!el.contains(e.target)&&!(e.target.closest&&e.target.closest('[data-secb]')))el.classList.remove('open');\n"
"const el2=$('#storesdrop');\n"
"if(el2&&el2.classList.contains('open')&&!el2.contains(e.target)&&!(e.target.closest&&e.target.closest('[data-storesb]')))el2.classList.remove('open')});",
'B2 إغلاق بالنقر خارجها')

rep(
"window.addEventListener('scroll',()=>{const el=$('#secdrop');if(el)el.classList.remove('open')},true)}",
"window.addEventListener('scroll',()=>{const el=$('#secdrop');if(el)el.classList.remove('open');const el2=$('#storesdrop');if(el2)el2.classList.remove('open')},true)}",
'B3 إغلاق بالتمرير')

print('== C. حذف حق الاعتماد نهائياً ==')
# C1: stOK — كل المتاجر صالحة ما لم تكن موقوفة
rep(
"const stOK=s=>s.approved&&!s.susp;",
"const stOK=s=>!s.susp;",
'C1 stOK بلا اعتماد')

# C2: فخار الطائف معتمد في البيانات
rep(
"rt:4.4,sales:12,approved:false,susp:false,open:true,city:'الطائف',dlMode:'customer',freeMin:0}",
"rt:4.4,sales:12,susp:false,open:true,city:'الطائف',dlMode:'customer',freeMin:0}",
'C2 s7 بلا حقل approved')

# C3: فتح المتاجر الجديدة من الطلبات — بلا approved
rep(
"STORES.push({id:sid,name:r.store,sec:r.sec,owner:r.phone,color:SEC(r.sec).color,desc:'متجر جديد معتمد — بانتظار أول منتجاته وهويته',rt:0,sales:0,approved:true,susp:false,open:true,city:'الرياض',dlMode:'customer',freeMin:0,iban:r.iban,cr:r.cr,crDoc:r.crDoc||''});",
"STORES.push({id:sid,name:r.store,sec:r.sec,owner:r.phone,color:SEC(r.sec).color,desc:'متجر جديد — بانتظار أول منتجاته وهويته',rt:0,sales:0,susp:false,open:true,city:'الرياض',dlMode:'customer',freeMin:0,iban:r.iban,cr:r.cr,crDoc:r.crDoc||''});",
'C3 فتح متجر جديد بلا approved')

# C4: KPI المتاجر — لا معلق
rep(
"<div class=\"kpi\"><i>🏪</i><b>${ar(STORES.length)}</b><span>متجر (${ar(STORES.filter(s=>!s.approved).length)} معلق)</span></div>",
"<div class=\"kpi\"><i>🏪</i><b>${ar(STORES.length)}</b><span>متجر في ضمين</span></div>",
'C4 KPI بلا معلق')

# C5: بطاقة «متاجر بانتظار الاعتماد» في النظرة العامة تُحذف وتُستبدل بملخص صحي
rep(
"<div class=\"acard\"><h3>🚦 متاجر بانتظار الاعتماد</h3>\n"
"${STORES.filter(s=>!s.approved).map(s=>`<div class=\"row\">\n"
"<div class=\"mstore\" style=\"--c:${s.color};pointer-events:none\"><div class=\"lg\">${s.name[0]}</div><div><b>${esc(s.name)}</b><span class=\"mr\">${SEC(s.sec).name} · ${USERS[s.owner]?esc(USERS[s.owner].name):''}</span></div></div>\n"
"<button class=\"btn sm\" onclick=\"aApprove('${s.id}')\">✓ اعتماد</button></div>`).join('')||'<div class=\"hint\">لا متاجر معلقة</div>'}\n"
"</div></div>",
"<div class=\"acard\"><h3>🚦 صحة المتاجر</h3>\n"
"${STORES.filter(s=>s.susp).map(s=>`<div class=\"row\"><div class=\"mstore\" style=\"--c:${s.color};pointer-events:none\"><div class=\"lg\">${s.name[0]}</div><div><b>${esc(s.name)}</b><span class=\"mr\">${SEC(s.sec).name} · ${USERS[s.owner]?esc(USERS[s.owner].name):''}</span></div></div><button class=\"btn gray xs\" onclick=\"aSusp('${s.id}')\">إلغاء الإيقاف</button></div>`).join('')||'<div class=\"hint\">كل المتاجر تعمل بشكل سليم 🟢</div>'}\n"
"</div></div>",
'C5 بطاقة صحة المتاجر بلا اعتماد')

# C6: تبويب المتاجر — بلا زر اعتماد ولا شارة معلق
rep(
"${!s.approved?`<span class=\"tag amb\">معلق</span><button class=\"btn sm\" onclick=\"aApprove('${s.id}')\">✓ اعتماد</button>`\n"
":s.susp?`<span class=\"tag red\">موقوف</span><button class=\"btn gray xs\" onclick=\"aSusp('${s.id}')\">إلغاء الإيقاف</button>`\n"
":`<span class=\"tag grn\">معتمد</span><button class=\"btn red xs\" onclick=\"aSusp('${s.id}')\">إيقاف</button>`}",
"${s.susp?`<span class=\"tag red\">موقوف</span><button class=\"btn gray xs\" onclick=\"aSusp('${s.id}')\">إلغاء الإيقاف</button>`\n"
":`<span class=\"tag grn\">يعمل</span><button class=\"btn red xs\" onclick=\"aSusp('${s.id}')\">إيقاف</button>`}",
'C6 تبويب المتاجر بلا اعتماد')

# C7: حذف دالة aApprove نهائياً
rep(
"function aApprove(sid){const s=ST(sid);s.approved=true;\n"
"pushNotif(s.owner,'🎉','تهانينا! اعتُمد متجرك','«'+s.name+'» صار ظاهراً للعملاء في قسم '+SEC(s.sec).name,['m-dash']);\n"
"toast('اعتُمد متجر «'+s.name+'» ✓','ok');render()}\n",
"",
'C7 حذف aApprove')

# C8: إعدادات التاجر — صف المالك بلا شارة اعتماد
rep(
"<div class=\"setrow\"><div class=\"ic\">👤</div><div class=\"tx\"><b>المالك</b><span>${own?esc(own.name)+' · '+ar(s.owner):'—'}</span></div><span class=\"tag ${s.approved?'grn':'amb'}\">${s.approved?'معتمد من الإدارة':'بانتظار الاعتماد'}</span></div>",
"<div class=\"setrow\"><div class=\"ic\">👤</div><div class=\"tx\"><b>المالك</b><span>${own?esc(own.name)+' · '+ar(s.owner):'—'}</span></div><span class=\"tag grn\">عضو ضمين</span></div>",
'C8 صف المالك بلا اعتماد')

# C9: إعدادات التاجر — حقل حالة الاعتماد والإيقاف → الإيقاف فقط
rep(
"<div class=\"setrow\"><div class=\"ic\">⛔</div><div class=\"tx\"><b>حالة الاعتماد والإيقاف</b><span>${!s.approved?'لم يُعتمد متجرك بعد — بانتظار مراجعة الإدارة':s.susp?'متجرك موقوف مؤقتاً من الإدارة — راجع فريق الامتثال':'متجرك معتمد ويعمل بكامل صلاحياته'}</span></div><span class=\"tag ${!s.approved?'amb':s.susp?'red':'grn'}\">${!s.approved?'معلق':s.susp?'موقوف':'سليم'}</span></div>",
"<div class=\"setrow\"><div class=\"ic\">⛔</div><div class=\"tx\"><b>حالة المتجر</b><span>${s.susp?'متجرك موقوف مؤقتاً من الإدارة — راجع فريق الامتثال':'متجرك يعمل بكامل صلاحياته ومعروض للعملاء'}</span></div><span class=\"tag ${s.susp?'red':'grn'}\">${s.susp?'موقوف':'سليم'}</span></div>",
'C9 حقل الحالة بلا اعتماد')

print('== D. تحسينات تبعية ==')
# D1: نص لوحة التاجر للمعلقين سابقاً لم يعد له معنى — تأكيد نص مرجعيات إعدادات التاجر (فحص فقط)
if 'بانتظار الاعتماد' in s or 'aApprove(' in s:
    print('  FAIL [D1] بقيت مراجع اعتماد: %d / %d' % (s.count('بانتظار الاعتماد'), s.count('aApprove(')))
    sys.exit(1)
print('  OK D1 لا مراجع اعتماد متبقية')

print('== D. تنظيف حقول approved الميتة من بيانات المتاجر ==')
# D0: إزالة approved:true من بيانات المتاجر التسعة المزروعة (حقل ميت بعد إلغاء الاعتماد)
c9 = s.count(',approved:true,susp:false,open:true')
if c9 != 9:
    print('  FAIL [D0] approved:true,susp found %d times (expected 9)' % c9)
    sys.exit(1)
s = s.replace(',approved:true,susp:false,open:true', ',susp:false,open:true')
n_edits += 1
print('  OK D0 حذف approved:true من %d متجراً' % c9)

if 'approved' in s:
    # المسموح فقط داخل DB.reqs (status approved) — نطابق فقط حقول المتاجر
    import re
    bad = [m.group(0) for m in re.finditer(r's\.approved|!s\.approved|approved:true|approved:false|\.approved\?', s)]
    if bad:
        print('  FAIL [D2] مراجع approved متبقية: %s' % set(bad))
        sys.exit(1)
print('  OK D2 لا s.approved متبقية')

io.open(F, 'w', encoding='utf-8').write(s)
print('\nتمت %d تعديلات. الحجم: %d → %d حرفاً (%+.1f KB)' % (n_edits, orig, len(s), (len(s)-orig)/1024))
