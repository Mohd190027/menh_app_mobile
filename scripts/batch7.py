#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""الدفعة ٧ — بوابة دخول جديدة + طلبات تسجيل (عميل/متجر/إدارة) + صفحة الأقسام والتصنيفات + الملخص المالي
كل التعديلات على الملف المدمج مباشرة: download/dameen.html — لا ملف جديد"""
import io, sys

F = '/home/z/my-project/download/dameen.html'
s = io.open(F, encoding='utf-8').read()
orig = len(s)
n_edits = 0

def rep(old, new, name, count=1):
    global s, n_edits
    c = s.count(old)
    if c != count:
        print('  ✗ [%s] anchor found %d times (expected %d)' % (name, c, count))
        sys.exit(1)
    s = s.replace(old, new)
    n_edits += 1
    print('  ✓ %s' % name)

# ============================================================ E1: CSS بوابة الدخول والبطاقات
rep(r'''.mt{margin-top:12px}.mb{margin-bottom:12px}''',
r'''.mt{margin-top:12px}.mb{margin-bottom:12px}

/* ===== بوابة الدخول ===== */
.authhero{background:linear-gradient(140deg,#1D4432 0%,#2E5C43 62%,#3C7355 100%);border-radius:20px;padding:24px 18px 20px;text-align:center;color:#fff;position:relative;overflow:hidden}
.authhero:before{content:'';position:absolute;inset-inline-end:-34px;top:-34px;width:140px;height:140px;border-radius:50%;background:#ffffff14}
.authhero:after{content:'';position:absolute;inset-inline-start:-26px;bottom:-46px;width:110px;height:110px;border-radius:50%;background:#B07E2B26}
.authhero .alg{width:56px;height:56px;border-radius:18px;background:#F6F2E9;color:#1D4432;font-family:Alexandria;font-weight:900;font-size:27px;display:grid;place-items:center;margin:0 auto 10px;box-shadow:0 10px 26px rgba(0,0,0,.28)}
.authhero h2{font-family:Alexandria;font-size:17px;margin-bottom:4px}
.authhero p{font-size:11px;color:#EDE8D8;opacity:.92;line-height:1.7;max-width:330px;margin:0 auto}
.authhero .ax{position:absolute;top:12px;inset-inline-start:12px;width:31px;height:31px;border-radius:10px;border:0;background:#ffffff26;color:#fff;cursor:pointer;font-size:12px;transition:.2s}
.authhero .ax:hover{background:#ffffff40}
.atabs{display:flex;gap:6px;background:#1D443212;padding:4px;border-radius:14px;margin:13px 0}
.atab{flex:1;padding:9px 4px;border-radius:11px;border:0;background:transparent;font-family:inherit;font-weight:800;font-size:12px;color:var(--mut);cursor:pointer;transition:.2s}
.atab.on{background:#fff;color:var(--grn);box-shadow:0 3px 12px #1D44321f}
.orline{display:flex;align-items:center;gap:10px;color:var(--mut);font-size:10.5px;font-weight:700;margin:13px 0}
.orline:before,.orline:after{content:'';flex:1;height:1.5px;background:var(--line)}
.gbtn{display:flex;align-items:center;justify-content:center;gap:10px;width:100%;padding:11px;background:#fff;border:1.5px solid var(--line);border-radius:13px;font-family:inherit;font-weight:800;font-size:13px;color:#2E2E2E;cursor:pointer;transition:.2s}
.gbtn:hover{border-color:#93A1B0;box-shadow:0 6px 16px rgba(0,0,0,.08);transform:translateY(-1px)}
.gbtn svg{width:19px;height:19px;flex-shrink:0}
.switchbox{border:1.5px dashed var(--line);border-radius:16px;padding:12px 13px;margin-top:13px;background:#FFFFFF73}
.secpick{display:grid;grid-template-columns:repeat(3,1fr);gap:7px;margin-top:4px}
.secpick button{padding:9px 4px;border-radius:12px;border:1.5px solid var(--line);background:#fff;font-family:inherit;font-weight:800;font-size:10px;color:var(--mut);cursor:pointer;transition:.2s;line-height:1.7}
.secpick button small{display:block;font-size:15px}
.secpick button.on{border-color:var(--c);color:var(--c);box-shadow:0 0 0 3px #1D443214}
.authfoot{text-align:center;margin-top:13px;font-size:11.5px;color:var(--mut)}
.authfoot a{color:var(--amb);font-weight:800;cursor:pointer;margin:0 3px}
.reqgrid{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:11px}
.reqcell{background:#fff;border:1px solid var(--line);border-radius:12px;padding:8px 11px;min-width:0}
.reqcell span{display:block;font-size:9.5px;color:var(--mut);font-weight:800;margin-bottom:2px}
.reqcell b{font-size:12px;word-break:break-word;line-height:1.5}
@media(max-width:520px){.reqgrid{grid-template-columns:1fr}.secpick button{font-size:9px}}''',
'E1-CSS البوابة الجديدة')

# ============================================================ E2: CATS بكائنات وعمولة لكل تصنيف
rep(r'''const CATS={fashion:['عبايات','أزياء','حقائب وعطور','العناية والجمال'],family:['عسل وتمور','ألبان ومخبوزات','حلويات وأطباق','سدو وحرف'],deco:['ديكور','هدايا','قهوة وضيافة','تنسيق مناسبات']};''',
r'''const CATS={fashion:[{n:'عبايات',comm:2.5},{n:'أزياء',comm:2.5},{n:'حقائب وعطور',comm:2.5},{n:'العناية والجمال',comm:2.5}],family:[{n:'عسل وتمور',comm:2.5},{n:'ألبان ومخبوزات',comm:2.5},{n:'حلويات وأطباق',comm:2.5},{n:'سدو وحرف',comm:2.5}],deco:[{n:'ديكور',comm:2.5},{n:'هدايا',comm:2.5},{n:'قهوة وضيافة',comm:2.5},{n:'تنسيق مناسبات',comm:2.5}]};
const catComm=(sec,cat)=>{const c=(CATS[sec]||[]).find(x=>x.n===cat);return +((c?c.comm:2.5).toFixed(2))};''',
'E2-CATS بعمولة لكل تصنيف')

# ============================================================ E3: بريد للحسابات التجريبية
rep(r"""'0500000002':{name:'ريم الدوسري',role:'merchant',pass:'1234',store:'s1',since:NOW-864e5*400,notif:{ord:true,dis:true}},""",
r"""'0500000002':{name:'ريم الدوسري',role:'merchant',pass:'1234',store:'s1',since:NOW-864e5*400,notif:{ord:true,dis:true},email:'rima@dafi.sa'},""",
'E3a-بريد ريم')
rep(r"""'0500000003':{name:'فهد العتيبي',role:'admin',pass:'1234',since:NOW-864e5*500,notif:{dis:true}},""",
r"""'0500000003':{name:'فهد العتيبي',role:'admin',pass:'1234',since:NOW-864e5*500,notif:{dis:true},email:'fahd@dameen.sa'},""",
'E3b-بريد فهد')

# ============================================================ E4: طلبات التسجيل في قاعدة البيانات
rep(r'''ptsVal:0.1,freeDlPts:250,aPtsWallet:0,ptsFunding:[],logiWallet:418.6,vat:527.4};''',
r'''ptsVal:0.1,freeDlPts:250,aPtsWallet:0,ptsFunding:[],logiWallet:418.6,vat:527.4,
reqs:[
{id:'rq-101',kind:'store',own:'هند الشهري',store:'عطور تلال الطائف',email:'hind@talal.sa',phone:'0501122334',cr:'1010456789',iban:'SA0380000000608010167519',sec:'fashion',at:NOW-864e5*2,status:'pending'},
{id:'rq-102',kind:'admin',own:'خالد المطيري',email:'khaled.m@dameen.sa',phone:'0505544332',role:'مشرف تحكيم ونزاعات',code:'DMN-2026',at:NOW-36e5*30,status:'pending'}]};''',
'E4-DB.reqs بذرة الطلبات')

# ============================================================ E5: خريطة الصفحات
rep(r"""'a-over':pgAOver,'a-disputes':pgADisputes,'a-stores':pgAStores,'a-users':pgAUsers,'a-rev':pgARev};""",
r"""'a-over':pgAOver,'a-disputes':pgADisputes,'a-stores':pgAStores,'a-reqs':pgAReqs,'a-cats':pgACats,'a-rev':pgARev};""",
'E5-خريطة الصفحات')

# ============================================================ E6: قائمة الإدارة العلوية
rep(r"""${mnav('a-over','📊 نظرة عامة')}${mnav('a-disputes','⚖️ التحكيم')}${mnav('a-stores','🏪 المتاجر')}${mnav('a-users','👥 المستخدمون')}${mnav('a-rev','📈 الإيرادات')}""",
r"""${mnav('a-over','📊 نظرة عامة')}${mnav('a-disputes','⚖️ التحكيم')}${mnav('a-stores','🏪 المتاجر')}${mnav('a-reqs','📋 طلبات التسجيل')}${mnav('a-cats','🗂️ الأقسام')}${mnav('a-rev','📈 الإيرادات')}""",
'E6-قائمة الإدارة')

# ============================================================ E7: تصنيفات صفحة القسم
rep(r"""const cats=['الكل',...CATS[sec.id]];""",
r"""const cats=['الكل',...CATS[sec.id].map(c=>c.n)];""",
'E7-تصنيفات صفحة القسم')

# ============================================================ E8: بوابة الدخول الجديدة
rep(r"""let AUTH={tab:'login'};""",
r"""let AUTH={tab:'login',reg:'customer',sec:null,gname:'',gemail:''},REQDOC=null,REJ=null,CATDEL=null;""",
'E8a-حالة البوابة')
rep(r"""function openAuth(hint){AUTH={tab:'login',hint:hint||''};openModal(authHTML());}""",
r"""function openAuth(hint){AUTH={tab:'login',reg:'customer',sec:null,gname:'',gemail:'',hint:hint||''};openModal(authHTML())}""",
'E8b-openAuth')
rep(r"""function authTab(t){AUTH.tab=t;$('#authbody').innerHTML=authBody()}""",
r"""function authTab(t){AUTH.tab=t;$('#authbody').innerHTML=authBody()}
function regTab(r){AUTH.reg=r;$('#authbody').innerHTML=authBody()}""",
'E8c-regTab')
rep('''function authHTML(){return `<div class="mhead"><b>بوابة ضمين</b><button class="x" onclick="closeModal()">✕</button></div>
<div class="mbody" id="authbody">${authBody()}</div>`}''',
'''function authHTML(){return `<div class="mbody" id="authbody" style="padding:18px">${authBody()}</div>`}''',
'E8d-authHTML')

# ---- authBody كاملة
rep(r'''function authBody(){
if(AUTH.tab==='login')return `
<p class="hint mb">سجّل دخولك لإتمام الطلب ومتابعة نزاعاتك — التصفح والإضافة للسلة متاحان دون تسجيل.</p>
<div class="fld"><label>رقم الجوال</label><input class="inp" id="lg-ph" placeholder="05xxxxxxxx" value="0500000001"></div>
<div class="fld mt"><label>كلمة المرور</label><input class="inp" type="password" id="lg-pw" placeholder="••••" value="1234"></div>
<button class="btn wide mt" onclick="doLogin()">دخول</button>
<div class="hr"></div>
<p class="hint b7" style="text-align:center">دخول سريع تجريبي</p>
<div class="fgrid" style="grid-template-columns:1fr 1fr 1fr;gap:8px">
<button class="btn soft sm" onclick="quickLogin('customer')">🛍️ عميل</button>
<button class="btn soft sm" onclick="quickLogin('merchant')">🏪 تاجر</button>
<button class="btn soft sm" onclick="quickLogin('admin')">🛡️ إدارة</button>
</div>
<p class="hint mt" style="text-align:center">ليس لديك حساب؟ <a style="color:var(--amb);font-weight:700;cursor:pointer" onclick="authTab('reg')">أنشئ حساباً جديداً</a></p>`;
return `
<p class="hint mb">حساب جديد في دقيقة — واحصل على ٥٠ نقطة ترحيبية قابلة للاستبدال.</p>
<div class="fld"><label>الاسم الكامل</label><input class="inp" id="rg-nm" placeholder="مثال: نورة العبدالله"></div>
<div class="fgrid mt">
<div class="fld"><label>رقم الجوال</label><input class="inp" id="rg-ph" placeholder="05xxxxxxxx"></div>
<div class="fld"><label>كلمة المرور</label><input class="inp" type="password" id="rg-pw" placeholder="٤ أرقام فأكثر"></div>
</div>
<button class="btn wide mt" onclick="doRegister()">إنشاء الحساب</button>
<p class="hint mt" style="text-align:center">لديك حساب؟ <a style="color:var(--amb);font-weight:700;cursor:pointer" onclick="authTab('login')">تسجيل الدخول</a></p>`;
}''',
r'''function authBody(){
const hero=`<div class="authhero"><button class="ax" onclick="closeModal()" title="إغلاق">✕</button><div class="alg">ض</div><h2>أهلاً بك في ضمين</h2><p>مالك يُحجز في خزنة مستقلة، والتاجر لا يستلم إلا بعد استلامك وتقييمك</p></div>`;
const tabs=`<div class="atabs"><button class="atab ${AUTH.tab==='login'?'on':''}" onclick="authTab('login')">🔑 تسجيل الدخول</button><button class="atab ${AUTH.tab==='reg'?'on':''}" onclick="authTab('reg')">✨ حساب جديد</button></div>`;
if(AUTH.tab==='login')return `${hero}${tabs}
<div class="fld"><label>رقم الجوال أو البريد الإلكتروني</label><input class="inp" id="lg-id" placeholder="05xxxxxxxx أو name@mail.com" value="${AUTH.hint==='merchant'?'0500000002':AUTH.hint==='admin'?'0500000003':'0500000001'}"></div>
<div class="fld mt"><label>كلمة المرور</label><input class="inp" type="password" id="lg-pw" placeholder="••••" value="1234" onkeydown="if(event.key==='Enter')doLogin()"></div>
<button class="btn wide mt" onclick="doLogin()">🔑 دخول</button>
<div class="orline">أو</div>
<button class="gbtn" onclick="gAuth()">${GICON} المتابعة بحساب Google</button>
<div class="switchbox">
<p class="hint" style="font-weight:800;text-align:center;margin-bottom:7px">🧪 حسابات التجربة السريعة</p>
<div class="fgrid" style="grid-template-columns:1fr 1fr 1fr;gap:7px">
<button class="btn soft sm" onclick="quickLogin('customer')">🛍️ عميل</button>
<button class="btn soft sm" onclick="quickLogin('merchant')">🏪 تاجر</button>
<button class="btn soft sm" onclick="quickLogin('admin')">🛡️ إدارة</button>
</div></div>
<p class="authfoot">ليس لديك حساب؟ <a onclick="authTab('reg')">أنشئ حسابك الآن</a></p>`;
if(AUTH.reg==='customer')return `${hero}${tabs}
<div class="fld"><label>الاسم الكامل</label><input class="inp" id="rg-nm" placeholder="مثال: نورة العبدالله" value="${esc(AUTH.gname||'')}"></div>
<div class="fgrid mt">
<div class="fld"><label>رقم الجوال</label><input class="inp" id="rg-ph" placeholder="05xxxxxxxx"></div>
<div class="fld"><label>البريد الإلكتروني (اختياري)</label><input class="inp" id="rg-em" placeholder="name@mail.com" value="${esc(AUTH.gemail||'')}"></div>
</div>
<div class="fld mt"><label>مدينتك</label><select class="inp" id="rg-city">${CITIES.map(c=>`<option ${c==='الرياض'?'selected':''}>${c}</option>`).join('')}</select></div>
<div class="fgrid mt">
<div class="fld"><label>كلمة المرور</label><input class="inp" type="password" id="rg-pw" placeholder="٤ خانات فأكثر"></div>
<div class="fld"><label>تأكيد كلمة المرور</label><input class="inp" type="password" id="rg-pw2" placeholder="أعد كتابتها"></div>
</div>
<button class="btn wide mt" onclick="doRegister()">✨ إنشاء الحساب + ٥٠ نقطة ترحيبية</button>
<div class="orline">أو</div>
<button class="gbtn" onclick="gAuth()">${GICON} التسجيل السريع عبر Google</button>
<div class="switchbox">
<p class="hint" style="font-weight:800;text-align:center;margin-bottom:7px">لديك نشاط تجاري أو ترغب بالانضمام لفريق الإدارة؟</p>
<div class="fgrid" style="grid-template-columns:1fr 1fr;gap:8px">
<button class="btn sm" onclick="regTab('store')">🏪 متجر جديد</button>
<button class="btn sm" onclick="regTab('admin')">🛡️ حساب إدارة</button>
</div></div>
<p class="authfoot">لديك حساب؟ <a onclick="authTab('login')">تسجيل الدخول</a></p>`;
if(AUTH.reg==='store')return `${hero}${tabs}
<div class="demo mb"><b style="font-size:12px">🏪 طلب افتتاح متجر جديد</b><p class="hint" style="margin-top:3px">تظهر بياناتك كاملة للإدارة لتوافق أو ترفض — وبعد الموافقة يفتح متجرك في العالم الذي تختاره ويصلك إشعار فوري.</p></div>
<div class="fld"><label>اسم المتجر</label><input class="inp" id="st-nm" placeholder="مثال: عطور تلال الطائف"></div>
<div class="fgrid mt">
<div class="fld"><label>اسم المالك</label><input class="inp" id="st-own" placeholder="الاسم الكامل"></div>
<div class="fld"><label>رقم الجوال</label><input class="inp" id="st-ph" placeholder="05xxxxxxxx"></div>
</div>
<div class="fld mt"><label>البريد الإلكتروني</label><input class="inp" id="st-em" placeholder="store@mail.com"></div>
<div class="fgrid mt">
<div class="fld"><label>رقم السجل التجاري / الوثيقة</label><input class="inp" id="st-cr" placeholder="10xxxxxxxx"></div>
<div class="fld"><label>رقم الآيبان (SA...)</label><input class="inp" id="st-iban" placeholder="SA0000000000000000000000"></div>
</div>
<div class="fld mt"><label>إرفاق وثيقة السجل (اختياري)</label>
<button class="btn soft sm wide" style="justify-content:center" id="st-doc-btn" onclick="pickReqDoc()">📎 اختيار ملف الوثيقة</button></div>
<div class="fld mt"><label>اختر عالم متجرك — واحد فقط</label>
<div class="secpick">${SECTIONS.map(s=>`<button style="--c:${s.color}" class="${AUTH.sec===s.id?'on':''}" onclick="authSec('${s.id}')"><small>${s.icon}</small>${s.name.replace('عالم ','')}</button>`).join('')}</div></div>
<div class="fgrid mt">
<div class="fld"><label>كلمة المرور</label><input class="inp" type="password" id="st-pw" placeholder="٤ خانات فأكثر"></div>
<div class="fld"><label>تأكيد كلمة المرور</label><input class="inp" type="password" id="st-pw2" placeholder="أعد كتابتها"></div>
</div>
<button class="btn wide mt" onclick="doRegStore()">📨 إرسال طلب الاعتماد للإدارة</button>
<p class="authfoot"><a onclick="regTab('customer')">↩ عودة لتسجيل العميل</a> · <a onclick="authTab('login')">تسجيل الدخول</a></p>`;
return `${hero}${tabs}
<div class="demo mb"><b style="font-size:12px">🛡️ طلب انضمام لفريق الإدارة</b><p class="hint" style="margin-top:3px">تراجع الإدارة العليا طلبك بكامل تفاصيله — بعد الموافقة تدخل مركز الإدارة بصلاحيات كاملة، وتسجيل الدخول موحّد للجميع.</p></div>
<div class="fld"><label>الاسم الكامل</label><input class="inp" id="ad-nm" placeholder="مثال: خالد المطيري"></div>
<div class="fgrid mt">
<div class="fld"><label>رقم الجوال</label><input class="inp" id="ad-ph" placeholder="05xxxxxxxx"></div>
<div class="fld"><label>البريد الإلكتروني</label><input class="inp" id="ad-em" placeholder="name@dameen.sa"></div>
</div>
<div class="fld mt"><label>القسم الإشرافي</label><select class="inp" id="ad-role"><option>مشرف تحكيم ونزاعات</option><option>مشرف متاجر واعتماد</option><option>مشرف مالي وإيرادات</option><option>مشرف عام</option></select></div>
<div class="fld mt"><label>رمز الدعوة الإداري</label><input class="inp" id="ad-code" placeholder="يصدر من الإدارة العليا — للتجربة: DMN-2026"></div>
<div class="fgrid mt">
<div class="fld"><label>كلمة المرور</label><input class="inp" type="password" id="ad-pw" placeholder="٤ خانات فأكثر"></div>
<div class="fld"><label>تأكيد كلمة المرور</label><input class="inp" type="password" id="ad-pw2" placeholder="أعد كتابتها"></div>
</div>
<button class="btn wide mt" onclick="doRegAdmin()">📨 إرسال طلب الانضمام</button>
<p class="authfoot"><a onclick="regTab('customer')">↩ عودة لتسجيل العميل</a> · <a onclick="authTab('login')">تسجيل الدخول</a></p>`;
}''',
'E8e-authBody الجديدة')

# ---- doLogin بالجوال أو البريد + حراسة الطلبات المعلقة
rep(r'''function doLogin(){
const ph=($('#lg-ph').value||'').trim(),pw=($('#lg-pw').value||'').trim();
const u=USERS[ph];
if(!u||u.pass!==pw){toast('رقم الجوال أو كلمة المرور غير صحيحة','err');return}
SES={phone:ph,role:u.role,store:u.store||null};
closeModal();toast('أهلاً بك '+esc(u.name)+' 👋','ok');
if(u.role==='merchant')go('m-dash');else if(u.role==='admin')go('a-over');else{render()}
}''',
r'''function userIdx(id){id=String(id||'').trim();if(USERS[id])return id;const e=id.toLowerCase();return Object.keys(USERS).find(k=>USERS[k].email&&USERS[k].email.toLowerCase()===e)||null}
function doLogin(){
const id=($('#lg-id').value||'').trim(),pw=($('#lg-pw').value||'').trim();
const k=userIdx(id);
if(!k||USERS[k].pass!==pw){toast('الجوال / البريد أو كلمة المرور غير صحيحة','err');return}
const u=USERS[k];
if(u.pend){toast('طلب تسجيلك ('+(u.pend==='store'?'متجرك':'حساب الإدارة')+') قيد مراجعة الإدارة — سنشعرك فور البت','amb');return}
if(u.rejected){toast('رفضت الإدارة طلب تسجيلك: '+u.rejected,'err');return}
SES={phone:k,role:u.role,store:u.store||null};
closeModal();toast('أهلاً بك '+esc(u.name)+' 👋','ok');
if(u.role==='merchant')go('m-dash');else if(u.role==='admin')go('a-over');else{render()}
}''',
'E8f-doLogin جوال/بريد')

# ---- doRegister + كل دوال التسجيل الجديدة
rep(r'''function doRegister(){
const nm=($('#rg-nm').value||'').trim(),ph=($('#rg-ph').value||'').trim(),pw=($('#rg-pw').value||'').trim();
if(!nm||ph.length<10||pw.length<4){toast('أكمل البيانات: الاسم، جوال ١٠ أرقام، كلمة مرور ٤ فأكثر','err');return}
if(USERS[ph]){toast('هذا الرقم مسجل مسبقاً — سجّل دخولك','amb');authTab('login');return}
USERS[ph]={name:nm,role:'customer',pass:pw,pts:50,bal:0,since:Date.now(),ptsLog:[{t:'هدية الترحيب بضمين',v:50,at:Date.now()}],favs:[...GFav],addrs:[],notif:{ord:true,off:true,dis:true,rev:true},hidePhone:false};
GFav=[];
SES={phone:ph,role:'customer'};
closeModal();toast('تم إنشاء حسابك وأُضيفت ٥٠ نقطة ترحيبية 🎉','ok');render();
}''',
r'''function doRegister(){
const nm=($('#rg-nm').value||'').trim(),ph=($('#rg-ph').value||'').trim(),em=($('#rg-em').value||'').trim().toLowerCase(),pw=($('#rg-pw').value||'').trim(),pw2=($('#rg-pw2').value||'').trim();
if(!nm||ph.length<10||pw.length<4){toast('أكمل البيانات: الاسم، جوال ١٠ أرقام، كلمة مرور ٤ فأكثر','err');return}
if(pw!==pw2){toast('كلمتا المرور غير متطابقتين','err');return}
if(USERS[ph]){toast('هذا الجوال مسجل مسبقاً — سجّل دخولك','amb');authTab('login');return}
if(em&&Object.values(USERS).some(u=>u.email&&u.email.toLowerCase()===em)){toast('هذا البريد مرتبط بحساب آخر','amb');return}
USERS[ph]={name:nm,role:'customer',pass:pw,pts:50,bal:0,since:Date.now(),email:em||'',city:$('#rg-city').value,ptsLog:[{t:'هدية الترحيب بضمين',v:50,at:Date.now()}],favs:[...GFav],addrs:[],notif:{ord:true,off:true,dis:true,rev:true},hidePhone:false};
GFav=[];
SES={phone:ph,role:'customer'};
closeModal();toast('تم إنشاء حسابك وأُضيفت ٥٠ نقطة ترحيبية 🎉','ok');render();
}
function authSec(id){AUTH.sec=id;$('#authbody').innerHTML=authBody()}
function pickReqDoc(){$('#fup').onchange=e=>{const f=e.target.files[0];if(!f)return;
REQDOC={name:f.name,size:Math.max(1,Math.round(f.size/1024))};$('#fup').value='';
toast('أُرفقت الوثيقة: '+f.name+' ✓','ok');
const b=$('#st-doc-btn');if(b)b.innerHTML='📎 '+esc(f.name)+' ('+ar(REQDOC.size)+' كب)'};
$('#fup').click()}
function doRegStore(){
const nm=($('#st-nm').value||'').trim(),own=($('#st-own').value||'').trim(),ph=($('#st-ph').value||'').trim(),em=($('#st-em').value||'').trim(),cr=($('#st-cr').value||'').trim(),iban=($('#st-iban').value||'').replace(/\s+/g,'').toUpperCase(),pw=($('#st-pw').value||'').trim(),pw2=($('#st-pw2').value||'').trim();
if(nm.length<2||own.length<2||ph.length<10||!em.includes('@')||!cr){toast('أكمل بيانات المتجر: الاسم، المالك، جوال ١٠ أرقام، بريد، رقم السجل','err');return}
if(!/^SA/i.test(iban)||iban.length<20){toast('رقم الآيبان غير صحيح — يبدأ بـ SA ويتكون من ٢٤ خانة','err');return}
if(pw.length<4){toast('كلمة المرور ٤ خانات فأكثر','err');return}
if(pw!==pw2){toast('كلمتا المرور غير متطابقتين','err');return}
if(!AUTH.sec){toast('اختر عالم متجرك أولاً','err');return}
if(USERS[ph]){toast(USERS[ph].pend==='store'?'أرسلت طلب متجر بهذا الجوال مسبقاً — قيد المراجعة':'هذا الجوال مسجل — سجّل دخولك','amb');return}
const rid='rq-'+(100+DB.reqs.length+1);
DB.reqs.unshift({id:rid,kind:'store',own,store:nm,email:em.toLowerCase(),phone:ph,cr,crDoc:REQDOC?REQDOC.name:'',iban,sec:AUTH.sec,at:Date.now(),status:'pending'});
USERS[ph]={name:own,role:'merchant',pass:pw,pend:'store',reqId:rid,email:em.toLowerCase(),since:Date.now(),notif:{ord:true,dis:true}};
REQDOC=null;closeModal();reqSent('store',nm);
pushNotif('0500000003','📋','طلب تسجيل متجر جديد','«'+nm+'» بانتظار مراجعتك واعتمادك في طلبات التسجيل',['a-reqs']);
}
function doRegAdmin(){
const nm=($('#ad-nm').value||'').trim(),ph=($('#ad-ph').value||'').trim(),em=($('#ad-em').value||'').trim(),role=$('#ad-role').value,code=($('#ad-code').value||'').trim(),pw=($('#ad-pw').value||'').trim(),pw2=($('#ad-pw2').value||'').trim();
if(nm.length<2||ph.length<10||!em.includes('@')){toast('أكمل البيانات: الاسم، جوال ١٠ أرقام، البريد','err');return}
if(code!=='DMN-2026'){toast('رمز الدعوة الإداري غير صحيح — للتجربة استخدم DMN-2026','err');return}
if(pw.length<4||pw!==pw2){toast('راجع كلمة المرور وتأكيدها (٤ خانات فأكثر)','err');return}
if(USERS[ph]){toast(USERS[ph].pend==='admin'?'أرسلت طلب إدارة بهذا الجوال مسبقاً — قيد المراجعة':'هذا الجوال مسجل — سجّل دخولك','amb');return}
const rid='rq-'+(100+DB.reqs.length+1);
DB.reqs.unshift({id:rid,kind:'admin',own:nm,email:em.toLowerCase(),phone:ph,role,at:Date.now(),status:'pending'});
USERS[ph]={name:nm,role:'admin',pass:pw,pend:'admin',reqId:rid,email:em.toLowerCase(),since:Date.now(),notif:{dis:true}};
closeModal();reqSent('admin',nm);
pushNotif('0500000003','📋','طلب انضمام لفريق الإدارة',nm+' — '+role+' بانتظار مراجعتك',['a-reqs']);
}
function reqSent(kind,nm){
openModal(`<div class="mbody" style="padding:28px 22px;text-align:center">
<div style="font-size:54px">📨</div>
<h2 style="font-family:Alexandria;font-size:17px;margin:9px 0 5px">استلمنا طلبك!</h2>
<p class="hint" style="line-height:2">${kind==='store'?'طلب اعتماد متجر «'+esc(nm)+'»':'طلب انضمامك لفريق الإدارة'} وصل للإدارة بكامل تفاصيله — ستراجع الإدارة بياناتك وتصلك نتيجة الموافقة أو الرفض بإشعار، وحينها تسجّل دخولك بجوالك وكلمة مرورك (الدخول موحّد للجميع).</p>
<div class="demo mt" style="text-align:right"><b style="font-size:11.5px">🧪 للتجربة السريعة</b><p class="hint" style="margin-top:3px;line-height:1.9">سجّل الدخول الآن بحساب الإدارة ← افتح «📋 طلبات التسجيل» وستجد طلبك أول القائمة — اضغط موافقة، ثم اخرج وسجّل دخولك بالجوال وكلمة المرور اللذين أدخلتهما.</p></div>
<button class="btn wide mt" onclick="closeModal()">فهمت، شكراً</button></div>`);
}
function gAuth(){
const accs=[{ph:'0500000001',n:'نورة العبدالله',e:'noura@mail.com',c:'#7A3B44',r:'عميلة',t:'grn'},{ph:'0500000002',n:'ريم الدوسري',e:'rima@dafi.sa',c:'#556636',r:'تاجرة',t:'amb'},{ph:'0500000003',n:'فهد العتيبي',e:'fahd@dameen.sa',c:'#1D4432',r:'إدارة',t:'nvy'}];
openModal(`<div class="mhead"><b>المتابعة بحساب Google</b><button class="x" onclick="closeModal()">✕</button></div>
<div class="mbody">
<div class="demo mb"><b style="font-size:11.5px">OAuth محاكى للنسخة التجريبية</b><p class="hint" style="margin-top:2px">تُحاكي هذه النافذة اختيار حساب Google دون أي اتصال خارجي — اختر حساباً مرتبطاً بضمين أو أنشئ جديداً.</p></div>
${accs.map(a=>`<div style="display:flex;gap:11px;align-items:center;padding:10px 4px;border-bottom:1px dashed var(--line);cursor:pointer" onclick="gLogin('${a.ph}')">
<div style="width:38px;height:38px;border-radius:50%;background:${a.c};color:#fff;display:grid;place-items:center;font-weight:800;font-family:Alexandria;flex-shrink:0">${a.n[0]}</div>
<div style="flex:1;min-width:0"><b style="font-size:13px">${a.n}</b><div class="hint">${a.e}</div></div>
<span class="tag ${a.t}">${a.r}</span></div>`).join('')}
<div style="display:flex;gap:11px;align-items:center;padding:11px 4px;cursor:pointer" onclick="gNew()">
<div style="width:38px;height:38px;border-radius:50%;background:#fff;border:1.5px solid var(--line);display:grid;place-items:center;font-size:18px;color:var(--mut);flex-shrink:0">＋</div>
<div style="flex:1"><b style="font-size:13px">استخدام حساب Google آخر</b><div class="hint">ينشئ حساب عميل جديد ببريدك مباشرة</div></div></div>
</div>`);
}
function gLogin(ph){const u=USERS[ph];if(!u)return;
SES={phone:ph,role:u.role,store:u.store||null};
closeModal();toast('دخلت عبر Google كـ'+esc(u.name)+' 👋','ok');
if(u.role==='merchant')go('m-dash');else if(u.role==='admin')go('a-over');else render()}
function gNew(){AUTH={tab:'reg',reg:'customer',sec:null,gname:'مستخدم Google',gemail:'user'+(1000+Date.now()%9000)+'@gmail.com',hint:''};openModal(authHTML());toast('جلبنا اسمك وبريدك من Google — أكمل جوالك وكلمة مرورك','ok')}''',
'E8g-doRegister والدوال الجديدة')

# ============================================================ E9: نصوص العمولة الديناميكية
rep(r'''<p>نحجز مبلغك في خزنة مستقلة، ولا يستلم التاجر إلا بعد استلامك وتقييمك — والعمولة ٢٫٥٪ تذهب مباشرة للإدارة.</p>''',
r'''<p>نحجز مبلغك في خزنة مستقلة، ولا يستلم التاجر إلا بعد استلامك وتقييمك — والعمولة تُحسم من التاجر فقط وتذهب مباشرة للإدارة.</p>''',
'E9a-نص الرئيسية')
rep(r'''<p class="hint" style="text-align:center;margin-top:8px">عمولة ضمين ٢٫٥٪ تُحسم من التاجر — لا تُضاف عليك</p>''',
r'''<p class="hint" style="text-align:center;margin-top:8px">عمولة ضمين (حسب تصنيف كل منتج) تُحسم من التاجر — لا تُضاف عليك أبداً</p>''',
'E9b-نص السلة')
rep(r'''قيمة المنتجات: ٩٧٫٥٪ للتاجر و٢٫٥٪ عمولة ضمين · رسوم الشحن: تُحوّل لحساب الشريك اللوجستي · الضريبة ١٥٪: لصالح هيئة الزكاة والضريبة — والتحرير لا يتم إلا بعد استلامك ورضاك.''',
r'''قيمة المنتجات: صافي التاجر بعد عمولة ضمين (تحددها الإدارة لكل تصنيف) · رسوم الشحن: تُحوّل لحساب الشريك اللوجستي · الضريبة ١٥٪: لصالح هيئة الزكاة والضريبة — والتحرير لا يتم إلا بعد استلامك ورضاك.''',
'E9c-صندوق بوابة الطلب')
rep(r'''عمولة ضمين ٢٫٥٪: ${money(g.payout.comm)}''',
r'''عمولة ضمين: ${money(g.payout.comm)}''',
'E9d-بطاقة الطلب')
rep(r"""['كم عمولة ضمين؟','٢٫٥٪ فقط من قيمة الشحنة، تُحسم من التاجر ولا تُضاف على العميل أبداً.'],""",
r"""['كم عمولة ضمين؟','تحددها الإدارة لكل تصنيف على حدة (٢٫٥٪ افتراضياً) — تُحسم من التاجر لحظة التحرير فقط ولا تُضاف على العميل أبداً.'],""",
'E9e-السؤال الشائع')

# ============================================================ E10: عمولة ديناميكية في التحرير
rep(r'''const comm=r2(g.sub*0.025);''',
r'''const comm=r2(g.items.reduce((a,it)=>{const pd=P(it.pid);return a+it.price*it.qty*catComm(ST(g.store).sec,pd?pd.cat:'')/100},0));''',
'E10-عمولة حسب التصنيف في doRelease')

# ============================================================ E11: فورم المنتج
rep(r'''<div class="fld"><label>التصنيف</label><select class="inp" id="mp-cat">${CATS[sec.id].map(c=>`<option ${p&&p.cat===c?'selected':''}>${c}</option>`).join('')}</select></div>''',
r'''<div class="fld"><label>التصنيف (وعمولة ضمين عليه)</label><select class="inp" id="mp-cat">${CATS[sec.id].map(c=>`<option value="${esc(c.n)}" ${p&&p.cat===c.n?'selected':''}>${esc(c.n)} — عمولة ${ard(c.comm)}٪</option>`).join('')}</select></div>''',
'E11-فورم المنتج بعمولة التصنيف')

# ============================================================ E12: نصوص محفظة التاجر
rep(r'''<div class="kpi nvy"><i>📈</i><b>${money(totalIn)}</b><span>صافي التحريرات (٩٧٫٥٪)</span></div>''',
r'''<div class="kpi nvy"><i>📈</i><b>${money(totalIn)}</b><span>صافي التحريرات بعد العمولة</span></div>''',
'E12a-KPI الصافي')
rep(r'''<div class="kpi red"><i>🧾</i><b>${money(totalComm)}</b><span>عمولات الإدارة (٢٫٥٪)</span></div>''',
r'''<div class="kpi red"><i>🧾</i><b>${money(totalComm)}</b><span>عمولات الإدارة (حسب التصنيف)</span></div>''',
'E12b-KPI العمولة')
rep(r'''<div class="splitrow"><span><b style="color:var(--grn)">■</b> صافي المتجر ٩٧٫٥٪ ← محفظتك مباشرة</span><span><b style="color:var(--amb)">■</b> عمولة الإدارة ٢٫٥٪ ← حساب التطبيق</span><span><b style="color:var(--navy)">■</b> رسوم الشحن ← حساب الشريك اللوجستي</span></div>''',
r'''<div class="splitrow"><span><b style="color:var(--grn)">■</b> صافي المتجر (بعد عمولة تصنيفاته) ← محفظتك مباشرة</span><span><b style="color:var(--amb)">■</b> عمولة الإدارة ← حساب التطبيق</span><span><b style="color:var(--navy)">■</b> رسوم الشحن ← حساب الشريك اللوجستي</span></div>''',
'E12c-شريط التوزيع')
rep(r'''و<b>عمولة ضمين ٢٫٥٪</b> تتحول لحساب التطبيق''',
r'''و<b>عمولة ضمين (حسب تصنيف كل منتج)</b> تتحول لحساب التطبيق''',
'E12d-شرح التوزيع')

# ============================================================ E13: إعدادات التاجر
rep(r'''const myFund=DB.ptsFunding.filter(x=>x.store===s.id);''',
r'''const myFund=DB.ptsFunding.filter(x=>x.store===s.id);
const myCats=[...new Set(ps.map(p=>p.cat))].map(cn=>({n:cn,c:catComm(s.sec,cn)}));
const ccs=myCats.map(c=>c.c);const ccTxt=ccs.length?(Math.min(...ccs)===Math.max(...ccs)?ard(ccs[0])+'٪':ard(Math.min(...ccs))+'–'+ard(Math.max(...ccs))+'٪'):'—';''',
'E13a-تصنيفات المتجر في pgMSet')
rep(r'''<div class="setrow"><div class="ic">🆔</div><div class="tx"><b>معرّف المتجر</b><span>${s.id.toUpperCase()} · عضوية المالك ${own?'منذ '+MONTHS[new Date(own.since).getMonth()]+' '+ar(new Date(own.since).getFullYear()):'—'}</span></div></div>''',
r'''<div class="setrow"><div class="ic">🆔</div><div class="tx"><b>معرّف المتجر</b><span>${s.id.toUpperCase()} · عضوية المالك ${own?'منذ '+MONTHS[new Date(own.since).getMonth()]+' '+ar(new Date(own.since).getFullYear()):'—'}</span></div></div>
${s.cr?`<div class="setrow"><div class="ic">🧾</div><div class="tx"><b>السجل التجاري / الوثيقة</b><span>${esc(s.cr)}${s.crDoc?` · مرفق: ${esc(s.crDoc)}`:''}</span></div><span class="tag grn">موثّق لدى الإدارة</span></div>`:''}
${s.iban?`<div class="setrow"><div class="ic">🏦</div><div class="tx"><b>الآيبان — تحويل أرباحك</b><span>يُحوَّل إليه صافي محفظتك عند طلب السحب خلال ٢٤ ساعة</span></div><span class="tag nvy" style="font-size:10px;letter-spacing:.5px">${esc(String(s.iban).slice(0,10))}••</span></div>`:''}''',
'E13b-سجل وآيبان المتجر')
rep(r'''<div class="setrow"><div class="ic">🧾</div><div class="tx"><b>عمولة ضمين</b><span>٢٫٥٪ من كل شحنة — تُقتطع لحظة التحرير فقط وتتحول مباشرة لمحفظة الإدارة</span></div><span class="tag amb">٢٫٥٪</span></div>''',
r'''<div class="setrow"><div class="ic">🧾</div><div class="tx"><b>عمولة ضمين على تصنيفاتك</b><span>${myCats.length?myCats.map(c=>esc(c.n)+' '+ard(c.c)+'٪').join(' · '):'لم تضف منتجات بعد'} — تحددها الإدارة لكل تصنيف، وتُقتطع لحظة التحرير فقط وتتحول مباشرة لمحفظة الإدارة ولا تُضاف على العميل</span></div><span class="tag amb">${ccTxt}</span></div>''',
'E13c-صف عمولة المتجر')

# ============================================================ E14: لوحة الإدارة
rep(r'''const releasedTotal=DB.orders.reduce((a,o)=>a+o.groups.reduce((x,g)=>x+(g.payout?g.payout.sub:0),0),0);''',
r'''const releasedTotal=DB.orders.reduce((a,o)=>a+o.groups.reduce((x,g)=>x+(g.payout?g.payout.sub:0),0),0);
const pends=DB.reqs.filter(r=>r.status==='pending');''',
'E14a-طلبات معلقة في pgAOver')
rep(r'''<span>إجمالي عمولات ضمين (٢٫٥٪)</span>''',
r'''<span>إجمالي عمولات ضمين (حسب التصنيف)</span>''',
'E14b-KPI العمولات')
rep(r'''</div></div>
<div class="acard mt"><h3>💬 مراقبة محادثات الطلبات''',
r'''</div></div>
<div class="acard mt"><h3>📋 طلبات تسجيل جديدة ${pends.length?`<span class="tag amb">${ar(pends.length)} بانتظار البت</span>`:'<span class="tag grn">لا طلبات معلقة</span>'}</h3>
${pends.length?pends.slice(0,3).map(r=>`<div class="row"><div style="flex:1;min-width:0"><b>${r.kind==='store'?'🏪 '+esc(r.store):'🛡️ '+esc(r.own)}</b><div class="hint">${r.kind==='store'?esc(r.own)+' · '+SEC(r.sec).name:esc(r.role||'فريق الإدارة')} · ${ago(r.at)}</div></div><button class="btn sm" onclick="go('a-reqs')">مراجعة التفاصيل</button></div>`).join(''):'<p class="hint">طلبات فتح المتاجر والانضمام لفريق الإدارة تظهر هنا فور ورودها.</p>'}
${pends.length?`<button class="btn soft wide mt" onclick="go('a-reqs')">كل الطلبات والتفاصيل الكاملة ←</button>`:''}
</div>
<div class="acard mt"><h3>💬 مراقبة محادثات الطلبات''',
'E14c-بطاقة الطلبات في اللوحة')

# ============================================================ E15: صفحة الطلبات + صفحة الأقسام بدل المستخدمين
rep(r'''function pgAUsers(){
return `<div class="pghead"><h1>👥 المستخدمون (${ar(Object.keys(USERS).length)})</h1></div>
<div class="acard"><div class="rows">
${Object.entries(USERS).map(([ph,u])=>`<div class="row">
<div class="avat" style="width:38px;height:38px;border-radius:12px;font-size:14px">${u.name[0]}</div>
<div style="flex:1;min-width:0"><b>${esc(u.name)}</b><div class="hint">${ar(ph)}${u.store?' · '+ST(u.store).name:''}</div></div>
<span class="tag ${u.role==='customer'?'grn':u.role==='merchant'?'amb':'nvy'}">${{customer:'عميل',merchant:'تاجر',admin:'إدارة'}[u.role]}</span>
${u.role==='customer'?`<span class="hint">🌟 ${ar(u.pts||0)}</span><span class="hint">💰 ${money(u.bal||0)}</span>`:''}
<span class="hint">${ar(DB.orders.filter(o=>o.customer===ph).length)} طلب</span>
</div>`).join('')}
</div></div>`;
}''',
r'''function pgAReqs(){
const pend=DB.reqs.filter(r=>r.status==='pending');
const done=DB.reqs.filter(r=>r.status!=='pending');
return `<div class="pghead"><h1>📋 طلبات التسجيل</h1><span class="tag ${pend.length?'amb':'grn'}">${ar(pend.length)} بانتظار البت · ${ar(done.length)} منتهي</span></div>
<p class="hint mb" style="line-height:1.8">كل من يسجّل متجراً جديداً أو يطلب الانضمام لفريق الإدارة تظهر بياناته كاملة هنا — توافق فتفتح حسابه فوراً ويُبلَّغ، أو ترفض بسببٍ يظهر لصاحب الطلب. تسجيل الدخول موحّد للجميع (جوال أو بريد + كلمة مرور).</p>
${pend.length?pend.map(r=>reqCard(r)).join(''):'<div class="empty"><div class="em">📭</div><b>لا طلبات معلقة</b><span>ستظهر هنا طلبات فتح المتاجر والانضمام للإدارة فور ورودها</span></div>'}
${done.length?`<div class="hr" style="margin:20px 0 10px"></div><b class="fx" style="font-size:13.5px">📁 الطلبات المنتهية</b>
<div class="rows mt">${done.map(r=>`<div class="row" style="flex-wrap:wrap;gap:6px">
<div style="flex:1;min-width:170px"><b>${r.kind==='store'?'🏪 '+esc(r.store):'🛡️ '+esc(r.own)}</b><div class="hint">${r.kind==='store'?esc(r.own)+' · '+SEC(r.sec).name:esc(r.role||'فريق الإدارة')} · ${ago(r.at)}</div></div>
<span class="tag ${r.status==='approved'?'grn':'red'}">${r.status==='approved'?'مقبول ✓':'مرفوض ✗'}</span>
${r.status==='rejected'&&r.why?`<span class="hint">السبب: ${esc(r.why)}</span>`:''}
${r.status==='rejected'?`<button class="btn gray xs" onclick="aApproveReq('${r.id}')">إعادة فتح وقبول</button>`:''}
</div>`).join('')}</div>`:''}`;
}
function reqCard(r){
const isS=r.kind==='store';
return `<div class="acard" style="border-inline-start:4px solid ${isS?SEC(r.sec).color:'var(--navy)'}">
<div class="spread" style="flex-wrap:wrap;gap:8px">
<div><b class="fx" style="font-size:14px">${isS?'🏪 '+esc(r.store)+' — طلب متجر جديد':'🛡️ '+esc(r.own)+' — طلب انضمام للإدارة'}</b>
<div class="hint">${esc(r.own)}${isS?' · '+SEC(r.sec).name:''} · وصل ${ago(r.at)}</div></div>
<span class="tag amb">بانتظار الموافقة</span></div>
<div class="reqgrid">
${isS?`<div class="reqcell"><span>اسم المتجر</span><b>${esc(r.store)}</b></div>
<div class="reqcell"><span>العالم المختار</span><b style="color:${SEC(r.sec).color}">${SEC(r.sec).icon} ${SEC(r.sec).name}</b></div>`:`<div class="reqcell"><span>القسم الإشرافي المطلوب</span><b>${esc(r.role||'—')}</b></div>
<div class="reqcell"><span>رمز الدعوة</span><b>${esc(r.code||'—')} ${r.code==='DMN-2026'?'<span class="tag grn">سليم ✓</span>':'<span class="tag red">غير صحيح</span>'}</b></div>`}
<div class="reqcell"><span>الجوال (يستخدم للدخول)</span><b>${ar(r.phone)}</b></div>
<div class="reqcell"><span>البريد الإلكتروني</span><b>${esc(r.email||'—')}</b></div>
${isS?`<div class="reqcell"><span>السجل التجاري / الوثيقة</span><b>${esc(r.cr)}${r.crDoc?` <span class="tag grn">📎 ${esc(r.crDoc)}</span>`:''}</b></div>
<div class="reqcell"><span>الآيبان (تحويل أرباح المتجر)</span><b>${esc(r.iban)}</b></div>`:`<div class="reqcell" style="grid-column:1/-1"><span>ملاحظة الأمان</span><b class="hint" style="font-weight:600">كلمة المرور محفوظة ولا تُعرض — تُفتح صلاحيات مركز الإدارة كاملة بعد قبولك، ويُبلَّغ صاحب الطلب بأي رفض مع سببه.</b></div>`}
</div>
<div class="spread mt" style="gap:8px;flex-wrap:wrap">
<button class="btn sm" onclick="aApproveReq('${r.id}')">✓ موافقة${isS?' وفتح المتجر':' وفتح الحساب'}</button>
<button class="btn red sm" onclick="aRejectReq('${r.id}')">✗ رفض الطلب</button></div></div>`;
}
function aApproveReq(id){
const r=DB.reqs.find(x=>x.id===id);if(!r)return;
let passInfo='';
if(r.kind==='store'){
let n=STORES.length+1;while(ST('s'+n))n++;const sid='s'+n;
STORES.push({id:sid,name:r.store,sec:r.sec,owner:r.phone,color:SEC(r.sec).color,desc:'متجر جديد معتمد — بانتظار أول منتجاته وهويته',rt:0,sales:0,approved:true,susp:false,open:true,city:'الرياض',dlMode:'customer',freeMin:0,iban:r.iban,cr:r.cr,crDoc:r.crDoc||''});
DB.storeWallets[sid]=0;}
const u=USERS[r.phone];
if(u){u.pend=null;delete u.rejected;
if(r.kind==='store'){const st=STORES.find(x=>x.owner===r.phone);if(st)u.store=st.id}}
else{const st=STORES.find(x=>x.owner===r.phone);
USERS[r.phone]=r.kind==='store'
?{name:r.own,role:'merchant',pass:'1234',store:st?st.id:null,since:Date.now(),email:r.email||'',notif:{ord:true,dis:true}}
:{name:r.own,role:'admin',pass:'1234',since:Date.now(),email:r.email||'',notif:{dis:true}};
passInfo=' — كلمة المرور التجريبية 1234'}
r.status='approved';r.at2=Date.now();
pushNotif(r.phone,'🎉',r.kind==='store'?'اعتُمد متجرك وأصبح جاهزاً!':'مرحباً بك في فريق إدارة ضمين',r.kind==='store'?'«'+r.store+'» فُتح في '+SEC(r.sec).name+' — أضف منتجاتك من لوحة التاجر وابدأ البيع':'فُتحت لك صلاحيات مركز الإدارة كاملة — سجّل دخولك بالجوال وكلمة المرور وابدأ',r.kind==='store'?['m-dash']:['a-over']);
toast(r.kind==='store'?'اعتُمد المتجر وأُبلغ صاحبه ✓':'قُبل طلب الإدارة وأُبلغ صاحبه'+passInfo,'ok');render();
}
function aRejectReq(id){
const r=DB.reqs.find(x=>x.id===id);if(!r)return;REJ=r;
openModal(`<div class="mhead"><b>✗ رفض طلب ${r.kind==='store'?'المتجر «'+esc(r.store)+'»':'الإدارة — '+esc(r.own)}</b><button class="x" onclick="closeModal()">✕</button></div>
<div class="mbody">
<div class="fld"><label>سبب الرفض (يظهر لصاحب الطلب مع إشعار)</label><textarea class="inp" id="rj-why" style="min-height:76px" placeholder="مثال: وثيقة السجل التجاري غير واضحة — أعد إرفاقها"></textarea></div>
<div class="spread mt"><button class="btn gray sm" onclick="closeModal()">تراجع</button><button class="btn red sm" onclick="doRejectReq()">تأكيد الرفض</button></div></div>`);
}
function doRejectReq(){
if(!REJ)return;
const why=($('#rj-why').value||'').trim()||'لم يستوفِ الطلب شروط الاعتماد في ضمين';
REJ.status='rejected';REJ.why=why;REJ.at2=Date.now();
const u=USERS[REJ.phone];if(u){u.pend=null;u.rejected=why}
pushNotif(REJ.phone,'✗',REJ.kind==='store'?'رُفض طلب افتتاح متجرك':'رُفض طلب انضمامك للإدارة',why,null);
closeModal();toast('رُفض الطلب وأُبلغ صاحبه بالسبب','ok');render();
}
function pgACats(){
return `<div class="pghead"><h1>🗂️ الأقسام والتصنيفات</h1><span class="tag grn">عمولة ضمين تُحدَّد لكل تصنيف</span></div>
<p class="hint mb" style="line-height:1.8">أضف وعدّل واحذف تصنيفات العوالم الثلاثة، وحدد عمولة كل تصنيف بنفسك — تُطبَّق العمولة لحظة تحرير أي شحنة على منتجات ذلك التصنيف، وتُحسم من التاجر فقط ولا تُضاف على العميل أبداً.</p>
<div class="grid2">
${SECTIONS.map(sec=>`<div class="acard" style="border-top:3px solid ${sec.color}">
<div class="spread"><h3 style="color:${sec.color}">${sec.icon} ${sec.name}</h3><span class="tag" style="background:${sec.color}18;color:${sec.color}">${ar(CATS[sec.id].length)} تصنيف</span></div>
<div class="rows mt">
${CATS[sec.id].map((c,i)=>{const pc=PRODUCTS.filter(p=>{const s=ST(p.store);return s&&s.sec===sec.id&&p.cat===c.n}).length;
return `<div class="row" style="flex-wrap:wrap;gap:6px">
<div style="flex:1;min-width:120px"><input class="inp" style="padding:7px 10px;font-size:12px" id="cn-${sec.id}-${i}" value="${esc(c.n)}"></div>
<div style="display:flex;align-items:center;gap:5px"><span class="hint" style="white-space:nowrap;font-weight:700">عمولة</span>
<input class="inp" style="width:72px;padding:7px 6px;font-size:12px;text-align:center" type="number" min="0" max="20" step="0.25" id="cc-${sec.id}-${i}" value="${c.comm}"><span class="hint">٪</span></div>
<div style="display:flex;gap:5px;align-items:center;flex-wrap:wrap">
<span class="tag ${pc?'grn':''}" ${pc?'':'style="background:#0000000a;color:var(--mut)"'}>${ar(pc)} منتج</span>
<button class="btn sm" title="حفظ التعديلات" onclick="catSave('${sec.id}',${i})">💾</button>
<button class="btn ${CATDEL===sec.id+'-'+i?'red':'gray'} xs" onclick="catDel('${sec.id}',${i})">${CATDEL===sec.id+'-'+i?'متأكد؟':'🗑'}</button></div></div>`}).join('')}
</div>
<div style="display:grid;grid-template-columns:1.7fr .7fr auto;gap:7px;align-items:end;margin-top:11px">
<div class="fld"><label>تصنيف جديد</label><input class="inp" style="padding:8px 10px;font-size:12px" id="nc-${sec.id}" placeholder="اسم التصنيف"></div>
<div class="fld"><label>عمولته ٪</label><input class="inp" style="padding:8px 6px;font-size:12px;text-align:center" type="number" min="0" max="20" step="0.25" id="ncc-${sec.id}" value="2.5"></div>
<button class="btn soft sm" onclick="catAdd('${sec.id}')">＋ إضافة</button>
</div>
</div>`).join('')}
</div>`;
}
function catSave(sec,i){
const c=CATS[sec][i];
const nm=($('#cn-'+sec+'-'+i).value||'').trim();
const cm=+($('#cc-'+sec+'-'+i).value||0);
if(nm.length<2){toast('اسم التصنيف قصير','err');return}
if(!(cm>=0&&cm<=20)){toast('العمولة يجب أن تكون بين ٠ و ٢٠٪','err');return}
if(CATS[sec].some((x,j)=>j!==i&&x.n===nm)){toast('يوجد تصنيف بنفس الاسم في هذا العالم','err');return}
if(nm!==c.n){PRODUCTS.forEach(p=>{const s=ST(p.store);if(s&&s.sec===sec&&p.cat===c.n)p.cat=nm});c.n=nm}
c.comm=+cm.toFixed(2);CATDEL=null;
toast('حُفظ التصنيف «'+nm+'» — عمولته '+ard(c.comm)+'٪ ✓','ok');render();
}
function catDel(sec,i){
if(CATDEL!==sec+'-'+i){CATDEL=sec+'-'+i;render();toast('اضغط «متأكد؟» مرة أخرى لحذف التصنيف','amb');return}
const c=CATS[sec][i];CATDEL=null;
const pc=PRODUCTS.filter(p=>{const s=ST(p.store);return s&&s.sec===sec&&p.cat===c.n}).length;
if(pc){toast('لا يمكن الحذف — انقل منتجاته ('+ar(pc)+') لتصنيف آخر أولاً','err');render();return}
CATS[sec].splice(i,1);toast('حُذف التصنيف «'+c.n+'» ✓','ok');render();
}
function catAdd(sec){
const nm=($('#nc-'+sec).value||'').trim();
const cm=+($('#ncc-'+sec).value||0);
if(nm.length<2){toast('اكتب اسم التصنيف','err');return}
if(!(cm>=0&&cm<=20)){toast('العمولة يجب أن تكون بين ٠ و ٢٠٪','err');return}
if(CATS[sec].some(x=>x.n===nm)){toast('التصنيف موجود مسبقاً في هذا العالم','err');return}
CATS[sec].push({n:nm,comm:+cm.toFixed(2)});
toast('أُضيف التصنيف «'+nm+'» بعمولة '+ard(cm)+'٪ ✓','ok');render();
}''',
'E15-صفحتا طلبات التسجيل والأقسام')

# ============================================================ E16: صفحة الإيرادات — الملخص المالي الشامل
rep(r'''function pgARev(){
const mx=Math.max(...DB.revMonths.map(m=>m.v));
return `<div class="pghead"><h1>📈 إيرادات ضمين</h1><span class="tag grn">عمولة ٢٫٥٪ تُحوَّل للإدارة لحظة كل تحرير</span></div>
<div class="kpis mb">
<div class="kpi grn"><i>🧾</i><b>${money(DB.aRevenue)}</b><span>إجمالي العمولات حتى اليوم</span></div>
<div class="kpi amb"><i>🔒</i><b>${money(vaultNow())}</b><span>محجوز في الخزنة الآن</span></div>
<div class="kpi nvy"><i>🏪</i><b>${money(r2(Object.values(DB.storeWallets).reduce((a,b)=>a+b,0)))}</b><span>صافي أرصدة التجار</span></div>
<div class="kpi amb"><i>🌟</i><b>${money(DB.aPtsWallet||0)}</b><span>محفظة الإدارة من تمويل النقاط</span></div>
<div class="kpi nvy"><i>🚚</i><b>${money(DB.logiWallet||0)}</b><span>حساب الشريك اللوجستي (OTO/Torod)</span></div>
<div class="kpi"><i>🧾</i><b>${money(DB.vat||0)}</b><span>ضريبة القيمة المضافة المحصلة (١٥٪)</span></div>
</div>
<div class="acard"><h3>عمولات آخر ٥ أشهر (ألف ر.س)</h3>
<div class="rvbars">${DB.revMonths.map(m=>`<div class="rv"><span>${ard(m.v)}</span><i style="height:${Math.max(8,m.v/mx*100)}%"></i><b>${m.m}</b></div>`).join('')}</div>
</div>
<div class="acard mt"><h3>🌟 إعدادات برنامج النقاط (صلاحية الإدارة)</h3>
<div class="setrow"><div class="ic">⭐</div><div class="tx"><b>قيمة النقطة الواحدة</b><span>يموّلها التاجر من محفظته عند إضافة نقاط لمنتجاته — وتدخل محفظة الإدارة</span></div>
<select class="inp" style="width:130px;flex-shrink:0" onchange="setPtsVal(this.value)">${[0.05,0.1,0.15,0.2].map(v=>`<option value="${v}" ${ptsVal()===v?'selected':''}>${ard(v)} ر.س</option>`).join('')}</select></div>
<div class="setrow"><div class="ic">🚚</div><div class="tx"><b>نقاط التوصيل المجاني</b><span>عدد النقاط التي يستبدلها العميل مقابل توصيل مجاني لطلبه من السلة</span></div>
<select class="inp" style="width:130px;flex-shrink:0" onchange="setFreeDlPts(this.value)">${[150,250,350].map(v=>`<option value="${v}" ${fdPts()===v?'selected':''}>${ar(v)} نقطة</option>`).join('')}</select></div>
<div class="setrow"><div class="ic">🏦</div><div class="tx"><b>محفظة الإدارة من النقاط</b><span>رسوم تمويل النقاط المحصّلة من التجار — تُستخدم في مكافآت العملاء</span></div><b class="fx" style="color:var(--amb2)">${money(DB.aPtsWallet||0)}</b></div>
${DB.ptsFunding.length?`<div class="hr"></div><b style="font-size:11.5px">آخر تمويلات التجار</b>
<div class="rows">${DB.ptsFunding.slice(0,4).map(x=>`<div class="row"><div style="flex:1;min-width:0"><b>${esc(ST(x.store).name)} — ${esc(x.pname)}</b><div class="hint">${ago(x.at)}</div></div><span class="hint">${x.pts>0?'+':''}${ar(x.pts)} نقطة</span><b class="fx" style="color:var(--amb2)">${money(x.amt)}</b></div>`).join('')}</div>`:''}
</div>
<div class="acard mt"><h3>أرصدة تجار الضمان</h3>
<div class="rows">${STORES.map(s=>`<div class="row">
<div style="width:34px;height:34px;border-radius:10px;background:${s.color};color:#fff;display:grid;place-items:center;font-size:13px;font-family:Alexandria;font-weight:800">${s.name[0]}</div>
<div style="flex:1"><b>${esc(s.name)}</b><div class="hint">${SEC(s.sec).name} · محجوز لصالحه ${money(heldFor(s.id))}</div></div>
<b class="fx" style="color:var(--grn)">${money(DB.storeWallets[s.id]||0)}</b></div>`).join('')}</div></div>`;
}
function setPtsVal(v){DB.ptsVal=+v;toast('صارت قيمة النقطة '+money(+v)+' — تسري على تمويلات التجار الجديدة','ok');render()}
function setFreeDlPts(v){DB.freeDlPts=+v;toast('صار استبدال التوصيل المجاني بـ'+ar(+v)+' نقطة للعميل','ok');render()}''',
r'''function pgARev(){
const mx=Math.max(...DB.revMonths.map(m=>m.v));
let gmv=0,relSub=0,relNet=0,relComm=0,shipC=0,shipM=0,shipP=0,refunds=0;
DB.orders.forEach(o=>o.groups.forEach(g=>{
const ch=(g.ship&&g.ship.charge)||(g.dl||0);
gmv+=g.sub+ch;
if(g.status==='refunded')refunds+=g.sub+ch;
if(g.payout){relSub+=g.payout.sub;relNet+=g.payout.net;relComm+=g.payout.comm;
if(g.payout.ship){shipC+=g.payout.ship.charge||0;shipM+=g.payout.ship.merchant||0;shipP+=g.payout.ship.pts||0}}}));
const held=vaultNow();
const storesBal=r2(Object.values(DB.storeWallets).reduce((a,b)=>a+b,0));
const ptsLiab=r2(Object.values(USERS).reduce((a,u)=>a+(u.pts||0),0)*ptsVal());
const custBal=r2(Object.values(USERS).reduce((a,u)=>a+(u.bal||0),0));
const relFlow=r2(relSub+shipC);
const fr=[
['🛒 إجمالي قيمة الطلبات في المنصة (منتجات + شحن دفعه العملاء)',money(gmv)],
['🔒 المحجوز في خزنة الضمان الآن (حماية المشترين)',money(held)],
['🔓 المحرر للتجار حتى اليوم (صافي حقهم)',money(relNet)],
['🧾 عمولات ضمين المحصلة (تحولت لحساب التطبيق)',money(relComm)],
['🚚 رسوم شحن دفعها العملاء (تحولت للوجستيات)',money(shipC)],
['🤝 دعم شحن تحمله التجار (مجاني / مناصفة / سقف)',money(shipM)],
['🌟 دعم شحن من نقاط الولاء (حساب الإدارة)',money(shipP)],
['🏦 رصيد حساب الشريك اللوجستي (OTO/Torod)',money(DB.logiWallet||0)],
['↩️ مسترجع للعملاء (محافظ ضمين لديهم)',money(refunds)],
['🧾 ضريبة القيمة المضافة المحصلة (١٥٪)',money(DB.vat||0)],
['⭐ التزامات النقاط لدى العملاء (نقاطهم × قيمة النقطة)',money(ptsLiab)],
['👛 أرصدة عملاء جاهزة للاستخدام من محافظهم',money(custBal)],
['🏪 محافظ التجار المتاحة للسحب',money(storesBal)],
['💰 محفظة الإدارة من تمويلات النقاط',money(DB.aPtsWallet||0)]];
return `<div class="pghead"><h1>📈 إيرادات ضمين</h1><span class="tag grn">عمولات كل تصنيف تُحوَّل للإدارة لحظة التحرير</span></div>
<div class="kpis mb">
<div class="kpi grn"><i>🧾</i><b>${money(DB.aRevenue)}</b><span>إجمالي العمولات حتى اليوم</span></div>
<div class="kpi amb"><i>🔒</i><b>${money(held)}</b><span>محجوز في الخزنة الآن</span></div>
<div class="kpi nvy"><i>🏪</i><b>${money(storesBal)}</b><span>صافي أرصدة التجار</span></div>
<div class="kpi amb"><i>🌟</i><b>${money(DB.aPtsWallet||0)}</b><span>محفظة الإدارة من تمويل النقاط</span></div>
<div class="kpi nvy"><i>🚚</i><b>${money(DB.logiWallet||0)}</b><span>حساب الشريك اللوجستي (OTO/Torod)</span></div>
<div class="kpi"><i>🧾</i><b>${money(DB.vat||0)}</b><span>ضريبة القيمة المضافة المحصلة (١٥٪)</span></div>
</div>
<div class="acard"><h3>📒 الملخص المالي الشامل — كل ما يخص المبالغ في ضمين</h3>
<div class="rows">${fr.map(([l,v])=>`<div class="row" style="flex-wrap:wrap;gap:4px"><div class="tx" style="flex:1;min-width:180px">${l}</div><b class="fx" style="font-size:12.5px;white-space:nowrap">${v}</b></div>`).join('')}</div>
<div class="hr"></div>
<div class="demo"><b style="font-size:11.5px">⚖️ معادلة الخزنة — أين ذهب كل مبلغ؟</b>
<p class="hint" style="margin-top:4px;line-height:2">إجمالي الطلبات <b>${money(gmv)}</b> = محجوز الآن لصالح الشحنات الجارية <b>${money(held)}</b> + محرر بضمان (منتجات <b>${money(relSub)}</b> + شحن دفعه العملاء <b>${money(shipC)}</b>) + مسترجع للعملاء <b>${money(refunds)}</b>${Math.abs(gmv-held-relFlow-refunds)<1?' — <b style="color:var(--grn)">✓ الدفاتر متوازنة</b>':''}</p>
<p class="hint" style="line-height:1.9">عمولة المنصة تُقتطع من نصيب التاجر فقط (وتُحدَّد لكل تصنيف من صفحة الأقسام) — ولا تُضاف على العميل أبداً، بينما دعم التجار ونقاطهم للشحن (${money(r2(shipM+shipP))}) يُقتطع من صافيهم ويُحوَّل للوجستيات.</p></div>
</div>
<div class="acard mt"><h3>عمولات آخر ٥ أشهر (ألف ر.س)</h3>
<div class="rvbars">${DB.revMonths.map(m=>`<div class="rv"><span>${ard(m.v)}</span><i style="height:${Math.max(8,m.v/mx*100)}%"></i><b>${m.m}</b></div>`).join('')}</div>
</div>
<div class="acard mt"><h3>🌟 إعدادات برنامج النقاط — أرقامك أنت</h3>
<div class="setrow"><div class="ic">⭐</div><div class="tx"><b>قيمة النقطة الواحدة (ر.س)</b><span>يموّلها التاجر من محفظته — اختر الرقم الذي يناسبك من ٠٫٠١ إلى ١</span></div>
<div style="display:flex;gap:6px;flex-shrink:0;align-items:center"><input class="inp" id="pv-inp" type="number" step="0.01" min="0.01" max="1" value="${ptsVal()}" style="width:84px;padding:8px;text-align:center"><button class="btn sm" onclick="setPtsVal(document.getElementById('pv-inp').value)">حفظ</button></div></div>
<div class="setrow"><div class="ic">🚚</div><div class="tx"><b>نقاط التوصيل المجاني</b><span>النقاط التي يستبدلها العميل مقابل توصيل مجاني لكل طلبه — من ٥٠ إلى ٢٠٠٠</span></div>
<div style="display:flex;gap:6px;flex-shrink:0;align-items:center"><input class="inp" id="fd-inp" type="number" step="10" min="50" max="2000" value="${fdPts()}" style="width:84px;padding:8px;text-align:center"><button class="btn sm" onclick="setFreeDlPts(document.getElementById('fd-inp').value)">حفظ</button></div></div>
<div class="setrow"><div class="ic">🏦</div><div class="tx"><b>محفظة الإدارة من النقاط</b><span>رسوم تمويل النقاط المحصّلة من التجار — تُستخدم في مكافآت العملاء</span></div><b class="fx" style="color:var(--amb2)">${money(DB.aPtsWallet||0)}</b></div>
${DB.ptsFunding.length?`<div class="hr"></div><b style="font-size:11.5px">آخر تمويلات التجار</b>
<div class="rows">${DB.ptsFunding.slice(0,4).map(x=>`<div class="row"><div style="flex:1;min-width:0"><b>${esc(ST(x.store).name)} — ${esc(x.pname)}</b><div class="hint">${ago(x.at)}</div></div><span class="hint">${x.pts>0?'+':''}${ar(x.pts)} نقطة</span><b class="fx" style="color:var(--amb2)">${money(x.amt)}</b></div>`).join('')}</div>`:''}
</div>
<div class="acard mt"><h3>أرصدة تجار الضمان</h3>
<div class="rows">${STORES.map(s=>`<div class="row">
<div style="width:34px;height:34px;border-radius:10px;background:${s.color};color:#fff;display:grid;place-items:center;font-size:13px;font-family:Alexandria;font-weight:800;overflow:hidden">${s.logo?`<img src="${s.logo}" style="width:100%;height:100%;object-fit:cover">`:s.name[0]}</div>
<div style="flex:1"><b>${esc(s.name)}</b><div class="hint">${SEC(s.sec).name} · محجوز لصالحه ${money(heldFor(s.id))}</div></div>
<b class="fx" style="color:var(--grn)">${money(DB.storeWallets[s.id]||0)}</b></div>`).join('')}</div></div>`;
}
function setPtsVal(v){v=+v;if(!(v>=0.01&&v<=1)){toast('أدخل قيمة النقطة بين ٠٫٠١ و ١ ر.س','err');return}DB.ptsVal=+v.toFixed(2);toast('صارت قيمة النقطة '+money(DB.ptsVal)+' — تسري على تمويلات التجار الجديدة','ok');render()}
function setFreeDlPts(v){v=Math.round(+v);if(!(v>=50&&v<=2000)){toast('أدخل نقاط التوصيل بين ٥٠ و ٢٠٠٠','err');return}DB.freeDlPts=v;toast('صار استبدال التوصيل المجاني بـ'+ar(v)+' نقطة للعميل','ok');render()}''',
'E16-صفحة الإيرادات بالملخص المالي')

# ============================================================ حفظ
io.open(F, 'w', encoding='utf-8').write(s)
print('\nDONE — %d edits applied. size %d -> %d bytes (%d lines)' % (n_edits, orig, len(s), s.count('\n')+1))
