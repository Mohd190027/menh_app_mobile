#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""الدفعة ١٣ — قسم الإدارة: فصل طلبات التسجيل والمتاجر من مركز الإدارة في صفحة مستقلة باسم «المتاجر»
- مركز الإدارة (a-hub): نظرة عامة فقط (KPIs + التحكيم + ملخص + المحادثات)
- صفحة جديدة (a-stores) باسم «🏪 المتاجر»: تبويبا «طلبات التسجيل» و«جميع المتاجر»
- زر الشريط العلوي «🏪 المتاجر» مباشر (بلا قائمة منسدلة) — المسارات القديمة a-reqs/a-over أسماء مستعارة
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

print('== A. المسارات: a-hub نظرة عامة فقط + a-stores صفحة مستقلة ==')
rep(
"let LASTSEC=null,AHUBT='over';",
"let LASTSEC=null,ASTT='stores';",
'A1 متغير التبويب للصفحة الجديدة')

rep(
"""else if(page==='a-hub')VIEW={page:'a-hub',atab:arg||AHUBT||'over'};
else if(page==='a-over'){VIEW={page:'a-hub',atab:'over'};AHUBT='over'}
else if(page==='a-reqs'){VIEW={page:'a-hub',atab:'reqs'};AHUBT='reqs'}
else if(page==='a-stores'){VIEW={page:'a-hub',atab:'stores'};AHUBT='stores'}""",
"""else if(page==='a-hub')VIEW={page:'a-hub'};
else if(page==='a-over')VIEW={page:'a-hub'};
else if(page==='a-reqs'){VIEW={page:'a-stores',atab:'reqs'};ASTT='reqs'}
else if(page==='a-stores')VIEW={page:'a-stores',atab:arg||ASTT||'stores'}""",
'A2 مسارات go() الجديدة')

rep(
"'a-hub':pgAHub,'a-disputes':pgADisputes,'a-cats':pgACats,'a-rev':pgARev};",
"'a-hub':pgAHub,'a-stores':pgAStoresPage,'a-disputes':pgADisputes,'a-cats':pgACats,'a-rev':pgARev};",
'A3 تسجيل صفحة المتاجر في render()')

print('== B. الشريط العلوي: زر «المتاجر» مباشر بلا قائمة ==')
rep(
"""${mnav('a-hub','📊 مركز الإدارة')}${mnav('a-disputes','⚖️ التحكيم')}${mnav('a-cats','🗂️ الأقسام')}${mnav('a-rev','📈 الإيرادات')}
<button class="nlink" data-storesb onclick="storesDD(event,this)">🏪 المتاجر ▾</button>
<div class="ddmenu secs" id="storesdrop"><div class="sechd">إدارة ضمين — اختر وجهة</div>
<div class="hti" onclick="storesDDGo('reqs')"><b>📋 طلبات التسجيل</b><span>مراجعة طلبات فتح المتاجر والانضمام للإدارة</span></div>
<div class="hti" onclick="storesDDGo('stores')"><b>🏪 جميع المتاجر</b><span>الإيقاف والإلغاء ومراجعة المحافظ</span></div></div>
</nav>${bellBtn()}${roleDD()}</div>`;""",
"""${mnav('a-hub','📊 مركز الإدارة')}${mnav('a-stores','🏪 المتاجر')}${mnav('a-disputes','⚖️ التحكيم')}${mnav('a-cats','🗂️ الأقسام')}${mnav('a-rev','📈 الإيرادات')}
</nav>${bellBtn()}${roleDD()}</div>`;""",
'B1 زر «🏪 المتاجر» مباشر')

rep(
"""const el2=$('#storesdrop');
if(el2&&el2.classList.contains('open')&&!el2.contains(e.target)&&!(e.target.closest&&e.target.closest('[data-storesb]')))el2.classList.remove('open')});
window.addEventListener('scroll',()=>{const el=$('#secdrop');if(el)el.classList.remove('open');const el2=$('#storesdrop');if(el2)el2.classList.remove('open')},true)}""",
"""});
window.addEventListener('scroll',()=>{const el=$('#secdrop');if(el)el.classList.remove('open')},true)}""",
'B2 حذف معالجات الإغلاق الخاصة بالقائمة الملغاة')

rep(
"""function storesDD(e,btn){
e.stopPropagation();
const el=$('#storesdrop');if(!el)return;
if(el.classList.contains('open')){el.classList.remove('open');return}
ddPlace(el,btn);
}
function storesDDGo(t){const el=$('#storesdrop');if(el)el.classList.remove('open');go('a-hub',t)}
function bellBtn(){""",
"""function bellBtn(){""",
'B3 حذف storesDD/storesDDGo')

print('== C. الصفحات: مركز = نظرة عامة + صفحة متاجر مستقلة ==')
rep(
"""/* مركز الإدارة: نظرة عامة + طلبات التسجيل + المتاجر في صفحة واحدة بتبويبات */
function pgAHub(){
const t=['over','reqs','stores'].includes(VIEW.atab)?VIEW.atab:'over';AHUBT=t;
const pends=DB.reqs.filter(r=>r.status==='pending').length;
const tab=(k,l,n)=>`<button class="${t===k?'on':''}" onclick="ahubTab('${k}')">${l}${n?` (${ar(n)})`:''}</button>`;
return `<div class="pghead"><h1>🛡️ مركز إدارة ضمين</h1><span class="tag nvy">المشرف العام</span></div>
<div class="tabs" style="margin-top:8px">${tab('over','📊 نظرة عامة')}${tab('reqs','📋 طلبات التسجيل',pends)}${tab('stores','🏪 المتاجر',STORES.length)}</div>
${t==='over'?pgAOver():t==='reqs'?pgAReqs():pgAStores()}`;
}
function ahubTab(t){VIEW.atab=t;render()}""",
"""/* مركز الإدارة: نظرة عامة فقط — طلبات التسجيل والمتاجر في صفحة «المتاجر» المستقلة */
function pgAHub(){
return `<div class="pghead"><h1>🛡️ مركز إدارة ضمين</h1><span class="tag nvy">المشرف العام</span></div>
${pgAOver()}`;
}
/* صفحة المتاجر المستقلة: طلبات التسجيل + جميع المتاجر بتبويبين */
function pgAStoresPage(){
const t=['reqs','stores'].includes(VIEW.atab)?VIEW.atab:'stores';ASTT=t;
const pends=DB.reqs.filter(r=>r.status==='pending').length;
const tab=(k,l,n)=>`<button class="${t===k?'on':''}" onclick="astTab('${k}')">${l}${n?` (${ar(n)})`:''}</button>`;
return `<div class="pghead"><h1>🏪 المتاجر</h1><span class="tag nvy">طلبات التسجيل وإدارة المتاجر</span></div>
<div class="tabs" style="margin-top:8px">${tab('reqs','📋 طلبات التسجيل',pends)}${tab('stores','🏪 جميع المتاجر',STORES.length)}</div>
${t==='reqs'?pgAReqs():pgAStores()}`;
}
function astTab(t){VIEW.atab=t;render()}""",
'C1 pgAHub نظرة عامة + pgAStoresPage جديدة')

print('== D. النظرة العامة: ملخص المتاجر والطلبات بدل البطاقات الإدارية ==')
rep(
"""<div class="kpi"><i>🏪</i><b>${ar(STORES.length)}</b><span>متجر في ضمين</span></div>""",
"""<div class="kpi" style="cursor:pointer" onclick="go('a-stores')"><i>🏪</i><b>${ar(STORES.length)}</b><span>متجر في ضمين</span></div>""",
'D1 KPI المتاجر ينقل للصفحة الجديدة')

rep(
"""<div class="acard"><h3>🚦 صحة المتاجر</h3>
${STORES.filter(s=>s.susp).map(s=>`<div class="row"><div class="mstore" style="--c:${s.color};pointer-events:none"><div class="lg">${s.name[0]}</div><div><b>${esc(s.name)}</b><span class="mr">${SEC(s.sec).name} · ${USERS[s.owner]?esc(USERS[s.owner].name):''}</span></div></div><button class="btn gray xs" onclick="aSusp('${s.id}')">إلغاء الإيقاف</button></div>`).join('')||'<div class="hint">كل المتاجر تعمل بشكل سليم 🟢</div>'}
</div></div>""",
"""<div class="acard"><h3>🏪 المتاجر وطلبات التسجيل</h3>
<div class="rows">
<div class="row"><div class="fx" style="font-size:13px">🏪 متاجر ضمين</div><span class="tag ${STORES.filter(s=>s.susp).length?'amb':'grn'}">${ar(STORES.length)} متجر · ${ar(STORES.filter(s=>s.susp).length)} موقوف</span></div>
<div class="row"><div class="fx" style="font-size:13px">📋 طلبات تسجيل بانتظار البت</div><span class="tag ${pends.length?'amb':'grn'}">${ar(pends.length)} طلب</span></div>
</div>
<button class="btn soft wide mt" onclick="go('a-stores')">فتح صفحة المتاجر وطلبات التسجيل ←</button>
</div></div>""",
'D2 بطاقة ملخص تنقل للصفحة المستقلة')

rep(
"""<div class="acard mt"><h3>📋 طلبات تسجيل جديدة ${pends.length?`<span class="tag amb">${ar(pends.length)} بانتظار البت</span>`:'<span class="tag grn">لا طلبات معلقة</span>'}</h3>
${pends.length?pends.slice(0,3).map(r=>`<div class="row"><div style="flex:1;min-width:0"><b>${r.kind==='store'?'🏪 '+esc(r.store):'🛡️ '+esc(r.own)}</b><div class="hint">${r.kind==='store'?esc(r.own)+' · '+SEC(r.sec).name:esc(r.role||'فريق الإدارة')} · ${ago(r.at)}</div></div><button class="btn sm" onclick="go('a-reqs')">مراجعة التفاصيل</button></div>`).join(''):'<p class="hint">طلبات فتح المتاجر والانضمام لفريق الإدارة تظهر هنا فور ورودها.</p>'}
${pends.length?`<button class="btn soft wide mt" onclick="go('a-reqs')">كل الطلبات والتفاصيل الكاملة ←</button>`:''}
</div>
""", '', 'D3 حذف بطاقة معاينة الطلبات من المركز')

print('== E. فحوص نهائية ==')
for bad in ['storesDD', 'storesdrop', 'data-storesb', 'ahubTab', 'AHUBT']:
    if bad in s:
        print('  FAIL [E1] مرجع متبقٍ: %s' % bad)
        sys.exit(1)
print('  OK E1 لا مراجع متبقية للقائمة الملغاة/ahubTab')
if s.count('function astTab') != 1 or s.count('function pgAStoresPage') != 1:
    print('  FAIL [E2] الدوال الجديدة ناقصة')
    sys.exit(1)
print('  OK E2 astTab/pgAStoresPage موجودتان')

io.open(F, 'w', encoding='utf-8').write(s)
print('\nتمت %d تعديلات. الحجم: %d → %d حرفاً (%+.1f KB)' % (n_edits, orig, len(s), (len(s)-orig)/1024))
