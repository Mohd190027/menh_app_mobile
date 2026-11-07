#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""التعديل ٣ (طلب 2026-11-06): لوحة تحكم خاصة لموظفي الإدارة
- دور جديد staff + حساب تجريبي 0500000013 (خالد المطيري — مشرف متاجر ونزاعات)
- صفحات e-hub / e-stores / e-disputes — قسم المتاجر وقسم النزاعات من لوحة الإدارة نفسها بالضبط
- كل موافقة/حكم من الموظف ينعكس فوراً على الإدارة العليا (نفس قاعدة البيانات)
"""
import io

SRC = '/home/z/my-project/download/dameen.html'
h = io.open(SRC, encoding='utf-8').read()
orig_len = len(h)

def rep(old, new, label):
    global h
    c = h.count(old)
    assert c == 1, 'FAIL [%s]: count=%d' % (label, c)
    h = h.replace(old, new)
    print('OK  ' + label)

# ═══ ١) حساب الموظف التجريبي ═══
rep("""'0500000012':{name:'لينا العسيري',role:'merchant',pass:'1234',store:'s10',since:NOW-864e5*100,notif:{ord:true,dis:true}}};""",
"""'0500000012':{name:'لينا العسيري',role:'merchant',pass:'1234',store:'s10',since:NOW-864e5*100,notif:{ord:true,dis:true}},
'0500000013':{name:'خالد المطيري',role:'staff',pass:'1234',since:NOW-864e5*30,notif:{ord:true,dis:true},email:'khaled.m@dameen.sa',staffTitle:'مشرف متاجر ونزاعات'}};""", 'USERS staff account')

# ═══ ٢) حراسة صفحات e- + مساراتها في go() ═══
rep("""if(VIEW.page.startsWith('a-')&&(!SES||SES.role!=='admin')){toast('هذه الصفحة مخصصة للإدارة','err');openAuth('admin');return}""",
"""if(VIEW.page.startsWith('a-')&&(!SES||SES.role!=='admin')){toast('هذه الصفحة مخصصة للإدارة العليا','err');openAuth('admin');return}
if(VIEW.page.startsWith('e-')&&(!SES||SES.role!=='staff')){toast('هذه الصفحة مخصصة لموظفي الإدارة','err');openAuth('staff');return}""", 'go() e-guard')

rep("""else if(page==='a-reqs'){VIEW={page:'a-stores',atab:'reqs'};ASTT='reqs'}
else if(page==='a-stores')VIEW={page:'a-stores',atab:arg||ASTT||'stores'}""",
"""else if(page==='a-reqs'){VIEW={page:'a-stores',atab:'reqs'};ASTT='reqs'}
else if(page==='a-stores')VIEW={page:'a-stores',atab:arg||ASTT||'stores'}
else if(page==='e-reqs'){VIEW={page:'e-stores',atab:'reqs'};ASTT='reqs'}
else if(page==='e-stores')VIEW={page:'e-stores',atab:arg||ASTT||'stores'}""", 'go() e-routes')

# ═══ ٣) خريطة الصفحات في render() ═══
rep("""'a-hub':pgAHub,'a-stores':pgAStoresPage,'a-disputes':pgADisputes,'a-cats':pgACats,'a-rev':pgARev};""",
"""'a-hub':pgAHub,'a-stores':pgAStoresPage,'a-disputes':pgADisputes,'a-cats':pgACats,'a-rev':pgARev,'e-hub':pgEHub,'e-stores':pgAStoresPage,'e-disputes':pgADisputes};""", 'render() page map')

# ═══ ٤) القائمة العلوية للموظف ═══
rep("""}else if(SES.role==='admin'){
h=`<div class="topin">${brand}${sb}<nav class="nav">
${mnav('a-hub','📊 مركز الإدارة')}${mnav('a-stores','🏪 المتاجر')}${mnav('a-disputes','⚖️ التحكيم')}${mnav('a-cats','🗂️ الأقسام')}${mnav('a-rev','📈 الإيرادات')}
</nav>${bellBtn()}${roleDD()}</div>`;
}else{ /* عميل مسجّل: القائمة الكاملة */""",
"""}else if(SES.role==='admin'){
h=`<div class="topin">${brand}${sb}<nav class="nav">
${mnav('a-hub','📊 مركز الإدارة')}${mnav('a-stores','🏪 المتاجر')}${mnav('a-disputes','⚖️ التحكيم')}${mnav('a-cats','🗂️ الأقسام')}${mnav('a-rev','📈 الإيرادات')}
</nav>${bellBtn()}${roleDD()}</div>`;
}else if(SES.role==='staff'){
h=`<div class="topin">${brand}${sb}<nav class="nav">
${mnav('e-hub','🧑‍💼 مركز الموظف')}${mnav('e-stores','🏪 المتاجر')}${mnav('e-disputes','⚖️ النزاعات')}
</nav>${bellBtn()}${roleDD()}</div>`;
}else{ /* عميل مسجّل: القائمة الكاملة */""", 'renderTop staff branch')

# ═══ ٥) قائمة الحساب المنسدلة roleDD ═══
rep("""function roleDD(){const u=me();const roleTxt={customer:'عميل',merchant:'تاجر',admin:'الإدارة'}[SES.role];""",
"""function roleDD(){const u=me();const roleTxt={customer:'عميل',merchant:'تاجر',admin:'الإدارة',staff:'موظف إدارة'}[SES.role];""", 'roleDD roleTxt')

rep("""${SES.role!=='customer'?`<div class="it" onclick="switchRole('customer')">🛍️ التسوق كعميل</div>`:''}
${SES.role!=='merchant'?`<div class="it" onclick="switchRole('merchant')">🏪 لوحة التاجر</div>`:''}
${SES.role!=='admin'&&u.role==='admin'?`<div class="it" onclick="switchRole('admin')">🛡️ مركز الإدارة</div>`:''}""",
"""${SES.role!=='customer'?`<div class="it" onclick="switchRole('customer')">🛍️ التسوق كعميل</div>`:''}
${SES.role!=='merchant'&&(u.role==='merchant'||u.role==='admin')?`<div class="it" onclick="switchRole('merchant')">🏪 لوحة التاجر</div>`:''}
${SES.role!=='admin'&&u.role==='admin'?`<div class="it" onclick="switchRole('admin')">🛡️ مركز الإدارة</div>`:''}
${SES.role!=='staff'&&u.role==='staff'?`<div class="it" onclick="switchRole('staff')">🧑‍💼 لوحة الموظف</div>`:''}""", 'roleDD staff option')

# ═══ ٦) switchRole ═══
rep("""if(r==='admin'){if(me().role==='admin'){SES.role='admin';go('a-over')}else{toast('الإدارة تدخل بحساب المشرف العام فقط','err');openAuth('admin')}}
}""",
"""if(r==='admin'){if(me().role==='admin'){SES.role='admin';go('a-over')}else{toast('الإدارة العليا تدخل بحساب المشرف العام فقط','err');openAuth('admin')}}
if(r==='staff'){if(me().role==='staff'){SES.role='staff';go('e-hub')}else{toast('لوحة الموظف لفريق الإدارة المعتمد فقط','err')}}
}""", 'switchRole staff')

# ═══ ٧) doLogin / gLogin / quickLogin ═══
rep("""if(u.role==='merchant')go('m-dash');else if(u.role==='admin')go('a-over');else{render()}
}""",
"""if(u.role==='merchant')go('m-dash');else if(u.role==='admin')go('a-over');else if(u.role==='staff')go('e-hub');else{render()}
}""", 'doLogin staff nav')

rep("""closeModal();toast('دخلت عبر Google كـ'+esc(u.name)+' 👋','ok');
if(u.role==='merchant')go('m-dash');else if(u.role==='admin')go('a-over');else render()}""",
"""closeModal();toast('دخلت عبر Google كـ'+esc(u.name)+' 👋','ok');
if(u.role==='merchant')go('m-dash');else if(u.role==='admin')go('a-over');else if(u.role==='staff')go('e-hub');else render()}""", 'gLogin staff nav')

rep("""function quickLogin(r){
const map={customer:'0500000001',merchant:'0500000002',admin:'0500000003'};
const u=USERS[map[r]];SES={phone:map[r],role:u.role,store:u.store||null};
closeModal();toast('دخلت كـ'+esc(u.name)+' ('+({customer:'عميل',merchant:'تاجر',admin:'إدارة'}[r])+')','ok');
if(r==='merchant')go('m-dash');else if(r==='admin')go('a-over');else render();
}""",
"""function quickLogin(r){
const map={customer:'0500000001',merchant:'0500000002',admin:'0500000003',staff:'0500000013'};
const u=USERS[map[r]];SES={phone:map[r],role:u.role,store:u.store||null};
closeModal();toast('دخلت كـ'+esc(u.name)+' ('+({customer:'عميل',merchant:'تاجر',admin:'الإدارة',staff:'موظف إدارة'}[r])+')','ok');
if(r==='merchant')go('m-dash');else if(r==='admin')go('a-over');else if(r==='staff')go('e-hub');else render();
}""", 'quickLogin staff')

# ═══ ٨) أزرار الحسابات التجريبية 2×2 ═══
rep("""<div class="fgrid" style="grid-template-columns:1fr 1fr 1fr;gap:7px">
<button class="btn soft sm" onclick="quickLogin('customer')">🛍️ عميل</button>
<button class="btn soft sm" onclick="quickLogin('merchant')">🏪 تاجر</button>
<button class="btn soft sm" onclick="quickLogin('admin')">🛡️ إدارة</button>
</div>""",
"""<div class="fgrid" style="grid-template-columns:1fr 1fr;gap:7px">
<button class="btn soft sm" onclick="quickLogin('customer')">🛍️ عميل</button>
<button class="btn soft sm" onclick="quickLogin('merchant')">🏪 تاجر</button>
<button class="btn soft sm" onclick="quickLogin('admin')">🛡️ الإدارة العليا</button>
<button class="btn soft sm" onclick="quickLogin('staff')">🧑‍💼 موظف إدارة</button>
</div>""", 'quick login buttons')

# ═══ ٩) حقل الدخول التلقائي staff ═══
rep("""value="${AUTH.hint==='merchant'?'0500000002':AUTH.hint==='admin'?'0500000003':'0500000001'}\"""",
"""value="${AUTH.hint==='merchant'?'0500000002':AUTH.hint==='admin'?'0500000003':AUTH.hint==='staff'?'0500000013':'0500000001'}\"""", 'login input staff value')

# ═══ ١٠) حساب Google المحاكى: إضافة الموظف ═══
rep("""{ph:'0500000003',n:'فهد العتيبي',e:'fahd@dameen.sa',c:'#1D4432',r:'إدارة',t:'nvy'}];""",
"""{ph:'0500000003',n:'فهد العتيبي',e:'fahd@dameen.sa',c:'#1D4432',r:'الإدارة العليا',t:'nvy'},{ph:'0500000013',n:'خالد المطيري',e:'khaled.m@dameen.sa',c:'#2E6B4F',r:'موظف إدارة',t:'amb'}];""", 'gAuth staff account')

# ═══ ١١) طلبات الانضمام تُنشئ موظفاً + إشعار للموظف ═══
rep("""USERS[ph]={name:nm,role:'admin',pass:pw,pend:'admin',reqId:rid,email:em.toLowerCase(),since:Date.now(),notif:{dis:true}};
closeModal();reqSent('admin',nm);
pushNotif('0500000003','📋','طلب انضمام لفريق الإدارة',nm+' — '+role+' بانتظار مراجعتك',['a-reqs']);""",
"""USERS[ph]={name:nm,role:'staff',pass:pw,pend:'admin',reqId:rid,email:em.toLowerCase(),since:Date.now(),staffTitle:role,notif:{dis:true}};
closeModal();reqSent('admin',nm);
pushNotif('0500000003','📋','طلب انضمام لفريق الإدارة',nm+' — '+role+' بانتظار مراجعتك',['a-reqs']);
pushNotif('0500000013','📋','طلب انضمام لفريق الإدارة',nm+' — '+role+' بانتظار مراجعة فريق الموظفين',['e-reqs']);""", 'doRegAdmin staff + notif')

rep("""pushNotif('0500000003','📋','طلب تسجيل متجر جديد','«'+nm+'» بانتظار مراجعتك واعتمادك في طلبات التسجيل',['a-reqs']);""",
"""pushNotif('0500000003','📋','طلب تسجيل متجر جديد','«'+nm+'» بانتظار مراجعتك واعتمادك في طلبات التسجيل',['a-reqs']);
pushNotif('0500000013','📋','طلب تسجيل متجر جديد','«'+nm+'» بانتظار مراجعتك واعتمادك في قسم المتاجر',['e-reqs']);""", 'doRegStore staff notif')

# ═══ ١٢) إشعار نزاع جديد للموظف ═══
rep("""pushNotif('0500000003','⚖️','نزاع جديد بانتظار التحكيم',ST(g.store).name+' · '+COMPS[COMP.sub],['a-disputes']);""",
"""pushNotif('0500000003','⚖️','نزاع جديد بانتظار التحكيم',ST(g.store).name+' · '+COMPS[COMP.sub],['a-disputes']);
pushNotif('0500000013','⚖️','نزاع جديد بانتظار التحكيم',ST(g.store).name+' · '+COMPS[COMP.sub],['e-disputes']);""", 'new dispute staff notif')

# ═══ ١٣) إشعارات رسائل النزاع للموظف ═══
rep("""if(r==='customer'){const own=ST(d.store).owner;if(own)pushNotif(own,'💬','رسالة جديدة في النزاع',custName(d)+' أضاف رداً/دلياً جديداً',['m-disputes']);pushNotif('0500000003','💬','رسالة جديدة في النزاع','نزاع طلب #'+ar(d.order)+' — '+custName(d),['a-disputes'])}
else if(r==='merchant'){pushNotif(d.customer,'💬','رد من المتجر على نزاعك',ST(d.store).name+' رد على نزاع طلب #'+ar(d.order),['disputes']);pushNotif('0500000003','💬','رسالة من التاجر في النزاع','نزاع طلب #'+ar(d.order)+' — '+ST(d.store).name,['a-disputes'])}""",
"""if(r==='customer'){const own=ST(d.store).owner;if(own)pushNotif(own,'💬','رسالة جديدة في النزاع',custName(d)+' أضاف رداً/دلياً جديداً',['m-disputes']);pushNotif('0500000003','💬','رسالة جديدة في النزاع','نزاع طلب #'+ar(d.order)+' — '+custName(d),['a-disputes']);pushNotif('0500000013','💬','رسالة جديدة في النزاع','نزاع طلب #'+ar(d.order)+' — '+custName(d),['e-disputes'])}
else if(r==='merchant'){pushNotif(d.customer,'💬','رد من المتجر على نزاعك',ST(d.store).name+' رد على نزاع طلب #'+ar(d.order),['disputes']);pushNotif('0500000003','💬','رسالة من التاجر في النزاع','نزاع طلب #'+ar(d.order)+' — '+ST(d.store).name,['a-disputes']);pushNotif('0500000013','💬','رسالة من التاجر في النزاع','نزاع طلب #'+ar(d.order)+' — '+ST(d.store).name,['e-disputes'])}""", 'dispute msg staff notifs')

# ═══ ١٤) أدوار النزاع: الموظف يعمل كإدارة في التحكيم ═══
rep("""const canChat=SES&&((d.customer===SES.phone&&SES.role==='customer')||(d.store===SES.store&&SES.role==='merchant')||(SES.role==='admin'));
const isAdmin=SES&&SES.role==='admin'&&d.status==='open';""",
"""const canChat=SES&&((d.customer===SES.phone&&SES.role==='customer')||(d.store===SES.store&&SES.role==='merchant')||(SES.role==='admin'||SES.role==='staff'));
const isAdmin=SES&&(SES.role==='admin'||SES.role==='staff')&&d.status==='open';""", 'dispute canChat/isAdmin')

rep("""const mine=SES&&((m.r==='customer'&&d.customer===SES.phone&&SES.role==='customer')||(m.r==='merchant'&&d.store===SES.store&&SES.role==='merchant')||(m.r==='admin'&&SES.role==='admin'));""",
"""const mine=SES&&((m.r==='customer'&&d.customer===SES.phone&&SES.role==='customer')||(m.r==='merchant'&&d.store===SES.store&&SES.role==='merchant')||(m.r==='admin'&&(SES.role==='admin'||SES.role==='staff')));""", 'msgHTML mine')

rep("""function myRoleIn(d){
if(!SES)return null;
if(SES.role==='customer'&&d.customer===SES.phone)return 'customer';
if(SES.role==='merchant'&&d.store===SES.store)return 'merchant';
if(SES.role==='admin')return 'admin';
return null;
}""",
"""function myRoleIn(d){
if(!SES)return null;
if(SES.role==='customer'&&d.customer===SES.phone)return 'customer';
if(SES.role==='merchant'&&d.store===SES.store)return 'merchant';
if(SES.role==='admin'||SES.role==='staff')return 'admin';
return null;
}""", 'myRoleIn staff')

rep("""function myORole(o,g){
if(!SES)return null;
if(SES.role==='admin')return 'admin';
if(SES.role==='customer'&&o.customer===SES.phone)return 'customer';""",
"""function myORole(o,g){
if(!SES)return null;
if(SES.role==='admin'||SES.role==='staff')return 'admin';
if(SES.role==='customer'&&o.customer===SES.phone)return 'customer';""", 'myORole staff')

# ═══ ١٥) الحكم باسم الجهة المُصدِرة ═══
rep("""d.ruling={act,by:'الإدارة',text:txt,at:Date.now()};d.status='resolved';
d.messages.push({r:'sys',t:'أصدرت الإدارة حكمها: '+(act==='release'?'إفراج المبلغ للتاجر — التسبيب: ':'استرجاع المبلغ للعميلة — التسبيب: ')+txt,at:Date.now()});""",
"""d.ruling={act,by:(SES&&SES.role==='staff')?'موظف الإدارة':'الإدارة',text:txt,at:Date.now()};d.status='resolved';
d.messages.push({r:'sys',t:'صدر حكم '+(SES&&SES.role==='staff'?'موظف الإدارة':'الإدارة')+': '+(act==='release'?'إفراج المبلغ للتاجر — التسبيب: ':'استرجاع المبلغ للعميلة — التسبيب: ')+txt,at:Date.now()});""", 'ruleAct ruling by')

# ═══ ١٦) الموافقة على طلب الإدارة تُنشئ موظفاً ═══
rep("""else{const st=STORES.find(x=>x.owner===r.phone);
USERS[r.phone]=r.kind==='store'
?{name:r.own,role:'merchant',pass:'1234',store:st?st.id:null,since:Date.now(),email:r.email||'',notif:{ord:true,dis:true}}
:{name:r.own,role:'admin',pass:'1234',since:Date.now(),email:r.email||'',notif:{dis:true}};
passInfo=' — كلمة المرور التجريبية 1234'}""",
"""else{const st=STORES.find(x=>x.owner===r.phone);
USERS[r.phone]=r.kind==='store'
?{name:r.own,role:'merchant',pass:'1234',store:st?st.id:null,since:Date.now(),email:r.email||'',notif:{ord:true,dis:true}}
:{name:r.own,role:'staff',pass:'1234',since:Date.now(),email:r.email||'',staffTitle:r.role||'مشرف عام',notif:{dis:true}};
passInfo=' — كلمة المرور التجريبية 1234'}""", 'aApproveReq staff creation')

rep("""pushNotif(r.phone,'🎉',r.kind==='store'?'اعتُمد متجرك وأصبح جاهزاً!':'مرحباً بك في فريق إدارة ضمين',r.kind==='store'?'«'+r.store+'» فُتح في '+SEC(r.sec).name+' — أضف منتجاتك من لوحة التاجر وابدأ البيع':'فُتحت لك صلاحيات مركز الإدارة كاملة — سجّل دخولك بالجوال وكلمة المرور وابدأ',r.kind==='store'?['m-dash']:['a-over']);
toast(r.kind==='store'?'اعتُمد المتجر وأُبلغ صاحبه ✓':'قُبل طلب الإدارة وأُبلغ صاحبه'+passInfo,'ok');render();""",
"""pushNotif(r.phone,'🎉',r.kind==='store'?'اعتُمد متجرك وأصبح جاهزاً!':'مرحباً بك في فريق إدارة ضمين',r.kind==='store'?'«'+r.store+'» فُتح في '+SEC(r.sec).name+' — أضف منتجاتك من لوحة التاجر وابدأ البيع':'فُتحت لك صلاحيات لوحة الموظف (المتاجر والنزاعات) — سجّل دخولك بالجوال وكلمة المرور وابدأ',r.kind==='store'?['m-dash']:['e-hub']);
toast(r.kind==='store'?'اعتُمد المتجر وأُبلغ صاحبه ✓':'قُبل طلب الانضمام وأُبلغ صاحبه'+passInfo,'ok');render();""", 'aApproveReq staff notif/go')

# ═══ ١٧) نصوص طلب الانضمام ═══
rep("""<p class="hint" style="margin-top:3px">تراجع الإدارة العليا طلبك بكامل تفاصيله — بعد الموافقة تدخل مركز الإدارة بصلاحيات كاملة، وتسجيل الدخول موحّد للجميع.</p>""",
"""<p class="hint" style="margin-top:3px">تراجع الإدارة العليا طلبك بكامل تفاصيله — بعد الموافقة تدخل لوحة موظف الإدارة بصلاحيات المتاجر والنزاعات، وتسجيل الدخول موحّد للجميع.</p>""", 'admin join hero text')

rep("""<b class="hint" style="font-weight:600">كلمة المرور محفوظة ولا تُعرض — تُفتح صلاحيات مركز الإدارة كاملة بعد قبولك، ويُبلَّغ صاحب الطلب بأي رفض مع سببه.</b>""",
"""<b class="hint" style="font-weight:600">كلمة المرور محفوظة ولا تُعرض — تُفتح لك لوحة موظف الإدارة (المتاجر والنزاعات) بعد القبول، ويُبلَّغ صاحب الطلب بأي رفض مع سببه.</b>""", 'reqCard safety note')

# ═══ ١٨) نص دور الموظف في صفحة الحساب ═══
rep("""<span>أنت الآن بدور ${SES.role==='merchant'?'التاجر':'الإدارة'}</span>""",
"""<span>أنت الآن بدور ${SES.role==='merchant'?'التاجر':SES.role==='staff'?'موظف الإدارة':'الإدارة العليا'}</span>""", 'pgAccount role text')

# ═══ ١٩) مركز الموظف pgEHub — بعد pgAHub ═══
rep("""function pgAHub(){
return `<div class="pghead"><h1>🛡️ مركز إدارة ضمين</h1><span class="tag nvy">المشرف العام</span></div>
${pgAOver()}`;
}""",
"""function pgAHub(){
return `<div class="pghead"><h1>🛡️ مركز إدارة ضمين</h1><span class="tag nvy">المشرف العام</span></div>
${pgAOver()}`;
}
/* ================= 🧑‍💼 لوحة موظفي الإدارة ================= */
function pgEHub(){
const open=DB.disputes.filter(d=>d.status==='open');
const done=DB.disputes.filter(d=>d.status==='resolved');
const pends=DB.reqs.filter(r=>r.status==='pending');
const susp=STORES.filter(s=>s.susp).length;
const st=me();
return `<div class="pghead"><h1>🧑‍💼 مركز موظف الإدارة</h1><span class="tag amb">${esc(st.staffTitle||'مشرف متاجر ونزاعات')}</span></div>
<div class="kpis">
<div class="kpi amb" style="cursor:pointer" onclick="go('e-reqs')"><i>📋</i><b>${ar(pends.length)}</b><span>طلبات تسجيل بانتظار البت</span></div>
<div class="kpi" style="cursor:pointer" onclick="go('e-stores')"><i>🏪</i><b>${ar(STORES.length)}</b><span>متجر في ضمين — ${ar(susp)} موقوف</span></div>
<div class="kpi red" style="cursor:pointer" onclick="go('e-disputes')"><i>⚖️</i><b>${ar(open.length)}</b><span>نزاعات مفتوحة بانتظار الحكم</span></div>
<div class="kpi grn"><i>📁</i><b>${ar(done.length)}</b><span>أحكام تحكيم صادرة</span></div>
</div>
<div class="grid2 mt">
<div class="acard"><h3>🏪 قسم المتاجر</h3>
<p class="hint mb" style="line-height:1.8">اعتماد طلبات تسجيل المتاجر الجديدة وفتحها فوراً، وإدارة المتاجر القائمة وإيقاف المخالف منها، وضبط حدود الوسائط الترويجية لكل متجر — نفس صفحة المتاجر في مركز الإدارة تماماً.</p>
<div class="rows">
<div class="row" style="cursor:pointer" onclick="go('e-reqs')"><div class="fx" style="font-size:13px">📋 طلبات بانتظار البت</div><span class="tag ${pends.length?'amb':'grn'}">${ar(pends.length)} طلب</span></div>
<div class="row" style="cursor:pointer" onclick="go('e-stores')"><div class="fx" style="font-size:13px">🏪 متاجر عاملة</div><span class="tag grn">${ar(STORES.length-susp)} متجر</span></div>
<div class="row" style="cursor:pointer" onclick="go('e-stores','stores')"><div class="fx" style="font-size:13px">⛔ متاجر موقوفة</div><span class="tag ${susp?'red':'grn'}">${ar(susp)} متجر</span></div>
</div>
<button class="btn soft wide mt" onclick="go('e-stores')">فتح قسم المتاجر ←</button></div>
<div class="acard"><h3>⚖️ قسم النزاعات</h3>
<p class="hint mb" style="line-height:1.8">قضايا التحكيم الثلاثي بدردشة الأطراف وأدلة الصور — اقرأ الحجج وأصدر حكمك بتسبيب يظهر للعميل والتاجر وينفّذ تلقائياً على المبلغ المحجوز — نفس صفحة التحكيم في مركز الإدارة تماماً.</p>
${open.length?open.map(d=>`<div class="row" style="cursor:pointer" onclick="openDispute('${d.id}')"><div style="flex:1;min-width:0"><b style="font-size:12.5px">${esc(d.subject)}</b><div class="hint">${ST(d.store).name} · طلب #${ar(d.order)} · ${ago(d.openedAt)}</div></div><span class="tag red">يحتاج حكماً</span></div>`).join(''):'<div class="hint mb">لا نزاعات معلقة حالياً — كل شيء تحت السيطرة 🕊️</div>'}
<button class="btn soft wide mt" onclick="go('e-disputes')">فتح قسم النزاعات ←</button></div>
</div>
<div class="acard mt"><h3>🤝 تكامل لحظي مع الإدارة العليا</h3>
<p class="hint" style="line-height:1.9">أنت معتمد ضمن فريق موظفي ضمين — كل موافقة تُصدرها على متجر وكل حكم تصدره يظهر مباشرة في مركز الإدارة العليا والعكس صحيح، لأنكم تعملون على قاعدة بيانات واحدة تتحدّث لحظياً. صلاحياتك: اعتماد المتاجر وإدارتها وضبط حدود وسائطها، والبت في النزاعات — أما الأقسام والعمولات والإيرادات المالية فتبقى لمركز الإدارة العليا.</p></div>`;
}""", 'pgEHub function')

io.open(SRC, 'w', encoding='utf-8').write(h)
print('SAVED: %d -> %d bytes (%+d)' % (orig_len, len(h), len(h) - orig_len))
