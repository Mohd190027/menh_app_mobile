'use client';
/* ضمين — auth.tsx
 * الدخول والتسجيل وطلب المتجر وحساب الإدارة + Google + الإشعارات + الجلسة —
 * منقول من dameen.js (٤٥٣-٦٤٧ و٤٤٠-٤٥٠) بنفس البنية والنصوص حرفياً.
 * تبويبات النافذة صارت حالة محلية في المكوّن (نفس أثر authTab/regTab التي كانت تعيد بناء #authbody).
 */
import { useState } from 'react';
import { $, ar, esc, toast, USERS, SECTIONS, CITIES, DB, STORES, ago } from './core';
import { SES, VIEW, AUTH, REQDOC, GFav, me, go, render, closeModal, openModal, pushNotif, setSES, setGFav, setREQDOC } from './store';

/* GICON (السطر ٤٥٤) */
export const Gicon = () => (
  <svg viewBox="0 0 48 48" aria-hidden="true"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" /><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" /><path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" /><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" /></svg>
);

/* openAuth (السطر ٤٥٥) */
export function openAuth(hint?){AUTH.tab='login';AUTH.reg='customer';AUTH.sec=null;AUTH.gname='';AUTH.gemail='';AUTH.hint=hint||'';openModal(<AuthModal/>)}

/* هيكل النافذة = authHTML/authBody (٤٥٨-٥٣٥) */
function AuthModal(){
const [tab,setTab]=useState(AUTH.tab);
const [reg,setReg]=useState(AUTH.reg);
const [sec,setSec]=useState(AUTH.sec);
const authTab=t=>setTab(t);
const regTab=r=>{setReg(r);setTab('reg')};
const hero=(
<div className="authhero"><button className="ax" onClick={()=>closeModal()} title="إغلاق">✕</button><div className="alg">ض</div><h2>أهلاً بك في ضمين</h2><p>مالك يُحجز في خزنة مستقلة، والتاجر لا يستلم إلا بعد استلامك وتقييمك</p></div>
);
const tabs=(
<div className="atabs"><button className={'atab '+(tab==='login'?'on':'')} onClick={()=>authTab('login')}>🔑 تسجيل الدخول</button><button className={'atab '+(tab==='reg'?'on':'')} onClick={()=>authTab('reg')}>✨ حساب جديد</button></div>
);
if(tab==='login')return <div className="mbody" id="authbody" style={{padding:'18px'}}>
{hero}{tabs}
<div className="fld"><label>رقم الجوال أو البريد الإلكتروني</label><input className="inp" id="lg-id" placeholder="05xxxxxxxx أو name@mail.com" defaultValue={AUTH.hint==='merchant'?'0500000002':AUTH.hint==='admin'?'0500000003':AUTH.hint==='staff'?'0500000013':'0500000001'}/></div>
<div className="fld mt"><label>كلمة المرور</label><input className="inp" type="password" id="lg-pw" placeholder="••••" defaultValue="1234" onKeyDown={e=>{if(e.key==='Enter')doLogin()}}/></div>
<button className="btn wide mt" onClick={()=>doLogin()}>🔑 دخول</button>
<div className="orline">أو</div>
<button className="gbtn" onClick={()=>gAuth()}><Gicon/> المتابعة بحساب Google</button>
<div className="switchbox">
<p className="hint" style={{fontWeight:800,textAlign:'center',marginBottom:'7px'}}>🧪 حسابات التجربة السريعة</p>
<div className="fgrid" style={{gridTemplateColumns:'1fr 1fr',gap:'7px'}}>
<button className="btn soft sm" onClick={()=>quickLogin('customer')}>🛍️ عميل</button>
<button className="btn soft sm" onClick={()=>quickLogin('merchant')}>🏪 تاجر</button>
<button className="btn soft sm" onClick={()=>quickLogin('admin')}>🛡️ الإدارة العليا</button>
<button className="btn soft sm" onClick={()=>quickLogin('staff')}>🧑‍💼 موظف إدارة</button>
</div></div>
<p className="authfoot">ليس لديك حساب؟ <a onClick={()=>authTab('reg')}>أنشئ حسابك الآن</a></p>
</div>;
if(reg==='customer')return <div className="mbody" id="authbody" style={{padding:'18px'}}>
{hero}{tabs}
<div className="fld"><label>الاسم الكامل</label><input className="inp" id="rg-nm" placeholder="مثال: نورة العبدالله" defaultValue={AUTH.gname||''}/></div>
<div className="fgrid mt">
<div className="fld"><label>رقم الجوال</label><input className="inp" id="rg-ph" placeholder="05xxxxxxxx"/></div>
<div className="fld"><label>البريد الإلكتروني (اختياري)</label><input className="inp" id="rg-em" placeholder="name@mail.com" defaultValue={AUTH.gemail||''}/></div>
</div>
<div className="fld mt"><label>مدينتك</label><select className="inp" id="rg-city" defaultValue="الرياض">{CITIES.map(c=><option key={c}>{c}</option>)}</select></div>
<div className="fgrid mt">
<div className="fld"><label>كلمة المرور</label><input className="inp" type="password" id="rg-pw" placeholder="٤ خانات فأكثر"/></div>
<div className="fld"><label>تأكيد كلمة المرور</label><input className="inp" type="password" id="rg-pw2" placeholder="أعد كتابتها"/></div>
</div>
<button className="btn wide mt" onClick={()=>doRegister()}>✨ إنشاء الحساب + ٥٠ نقطة ترحيبية</button>
<div className="orline">أو</div>
<button className="gbtn" onClick={()=>gAuth()}><Gicon/> التسجيل السريع عبر Google</button>
<div className="switchbox">
<p className="hint" style={{fontWeight:800,textAlign:'center',marginBottom:'7px'}}>لديك نشاط تجاري أو ترغب بالانضمام لفريق الإدارة؟</p>
<div className="fgrid" style={{gridTemplateColumns:'1fr 1fr',gap:'8px'}}>
<button className="btn sm" onClick={()=>regTab('store')}>🏪 متجر جديد</button>
<button className="btn sm" onClick={()=>regTab('admin')}>🛡️ حساب إدارة</button>
</div></div>
<p className="authfoot">لديك حساب؟ <a onClick={()=>authTab('login')}>تسجيل الدخول</a></p>
</div>;
if(reg==='store')return <div className="mbody" id="authbody" style={{padding:'18px'}}>
{hero}{tabs}
<div className="demo mb"><b style={{fontSize:'12px'}}>🏪 طلب افتتاح متجر جديد</b><p className="hint" style={{marginTop:'3px'}}>تظهر بياناتك كاملة للإدارة لتوافق أو ترفض — وبعد الموافقة يفتح متجرك في العالم الذي تختاره ويصلك إشعار فوري.</p></div>
<div className="fld"><label>اسم المتجر</label><input className="inp" id="st-nm" placeholder="مثال: عطور تلال الطائف"/></div>
<div className="fgrid mt">
<div className="fld"><label>اسم المالك</label><input className="inp" id="st-own" placeholder="الاسم الكامل"/></div>
<div className="fld"><label>رقم الجوال</label><input className="inp" id="st-ph" placeholder="05xxxxxxxx"/></div>
</div>
<div className="fld mt"><label>البريد الإلكتروني</label><input className="inp" id="st-em" placeholder="store@mail.com"/></div>
<div className="fgrid mt">
<div className="fld"><label>رقم السجل التجاري / الوثيقة</label><input className="inp" id="st-cr" placeholder="10xxxxxxxx"/></div>
<div className="fld"><label>رقم الآيبان (SA...)</label><input className="inp" id="st-iban" placeholder="SA0000000000000000000000"/></div>
</div>
<div className="fld mt"><label>إرفاق وثيقة السجل (اختياري)</label>
<button className="btn soft sm wide" style={{justifyContent:'center'}} id="st-doc-btn" onClick={()=>pickReqDoc()}>📎 اختيار ملف الوثيقة</button></div>
<div className="fld mt"><label>اختر عالم متجرك — واحد فقط</label>
<div className="secpick">{SECTIONS.map(s=><button type="button" key={s.id} style={{'--c':s.color} as any} className={sec===s.id?'on':''} onClick={()=>setSec(s.id)}><small>{s.icon}</small>{s.name.replace('عالم ','')}</button>)}</div></div>
<div className="fgrid mt">
<div className="fld"><label>كلمة المرور</label><input className="inp" type="password" id="st-pw" placeholder="٤ خانات فأكثر"/></div>
<div className="fld"><label>تأكيد كلمة المرور</label><input className="inp" type="password" id="st-pw2" placeholder="أعد كتابتها"/></div>
</div>
<button className="btn wide mt" onClick={()=>doRegStore()}>📨 إرسال طلب الاعتماد للإدارة</button>
<p className="authfoot"><a onClick={()=>regTab('customer')}>↩ عودة لتسجيل العميل</a> · <a onClick={()=>authTab('login')}>تسجيل الدخول</a></p>
</div>;
return <div className="mbody" id="authbody" style={{padding:'18px'}}>
{hero}{tabs}
<div className="demo mb"><b style={{fontSize:'12px'}}>🛡️ طلب انضمام لفريق الإدارة</b><p className="hint" style={{marginTop:'3px'}}>تراجع الإدارة العليا طلبك بكامل تفاصيله — بعد الموافقة تدخل لوحة موظف الإدارة بصلاحيات المتاجر والنزاعات، وتسجيل الدخول موحّد للجميع.</p></div>
<div className="fld"><label>الاسم الكامل</label><input className="inp" id="ad-nm" placeholder="مثال: خالد المطيري"/></div>
<div className="fgrid mt">
<div className="fld"><label>رقم الجوال</label><input className="inp" id="ad-ph" placeholder="05xxxxxxxx"/></div>
<div className="fld"><label>البريد الإلكتروني</label><input className="inp" id="ad-em" placeholder="name@dameen.sa"/></div>
</div>
<div className="fld mt"><label>القسم الإشرافي</label><select className="inp" id="ad-role"><option>مشرف تحكيم ونزاعات</option><option>مشرف متاجر واعتماد</option><option>مشرف مالي وإيرادات</option><option>مشرف عام</option></select></div>
<div className="fld mt"><label>رمز الدعوة الإداري</label><input className="inp" id="ad-code" placeholder="يصدر من الإدارة العليا — للتجربة: DMN-2026"/></div>
<div className="fgrid mt">
<div className="fld"><label>كلمة المرور</label><input className="inp" type="password" id="ad-pw" placeholder="٤ خانات فأكثر"/></div>
<div className="fld"><label>تأكيد كلمة المرور</label><input className="inp" type="password" id="ad-pw2" placeholder="أعد كتابتها"/></div>
</div>
<button className="btn wide mt" onClick={()=>doRegAdmin()}>📨 إرسال طلب الانضمام</button>
<p className="authfoot"><a onClick={()=>regTab('customer')}>↩ عودة لتسجيل العميل</a> · <a onClick={()=>authTab('login')}>تسجيل الدخول</a></p>
</div>;
}

/* userIdx/doLogin/doRegister (٥٣٦-٥٥٨ حرفياً) */
function userIdx(id){id=String(id||'').trim();if(USERS[id])return id;const e=id.toLowerCase();return Object.keys(USERS).find(k=>USERS[k].email&&USERS[k].email.toLowerCase()===e)||null}
export function doLogin(){
const id=($('#lg-id').value||'').trim(),pw=($('#lg-pw').value||'').trim();
const k=userIdx(id);
if(!k||USERS[k].pass!==pw){toast('الجوال / البريد أو كلمة المرور غير صحيحة','err');return}
const u=USERS[k];
if(u.pend){toast('طلب تسجيلك ('+(u.pend==='store'?'متجرك':'حساب الإدارة')+') قيد مراجعة الإدارة — سنشعرك فور البت','amb');return}
if(u.rejected){toast('رفضت الإدارة طلب تسجيلك: '+u.rejected,'err');return}
setSES({phone:k,role:u.role,store:u.store||null});
closeModal();toast('أهلاً بك '+esc(u.name)+' 👋','ok');
if(u.role==='merchant')go('m-dash');else if(u.role==='admin')go('a-over');else if(u.role==='staff')go('e-hub');else{render()}
}
export function doRegister(){
const nm=($('#rg-nm').value||'').trim(),ph=($('#rg-ph').value||'').trim(),em=($('#rg-em').value||'').trim().toLowerCase(),pw=($('#rg-pw').value||'').trim(),pw2=($('#rg-pw2').value||'').trim();
if(!nm||ph.length<10||pw.length<4){toast('أكمل البيانات: الاسم، جوال ١٠ أرقام، كلمة مرور ٤ فأكثر','err');return}
if(pw!==pw2){toast('كلمتا المرور غير متطابقتين','err');return}
if(USERS[ph]){toast('هذا الجوال مسجل مسبقاً — سجّل دخولك','amb');return}
if(em&&Object.values(USERS).some((u:any)=>u.email&&u.email.toLowerCase()===em)){toast('هذا البريد مرتبط بحساب آخر','amb');return}
USERS[ph]={name:nm,role:'customer',pass:pw,pts:50,bal:0,since:Date.now(),email:em||'',city:$('#rg-city').value,ptsLog:[{t:'هدية الترحيب بضمين',v:50,at:Date.now()}],favs:[...GFav],addrs:[],notif:{ord:true,off:true,dis:true,rev:true},hidePhone:false};
GFav.length=0;
setSES({phone:ph,role:'customer'});
closeModal();toast('تم إنشاء حسابك وأُضيفت ٥٠ نقطة ترحيبية 🎉','ok');render();
}

/* pickReqDoc (٥٦٠-٥٦٤ حرفياً) */
export function pickReqDoc(){$('#fup').onchange=e=>{const f=e.target.files[0];if(!f)return;
setREQDOC({name:f.name,size:Math.max(1,Math.round(f.size/1024))});(e.target).value='';
toast('أُرفقت الوثيقة: '+f.name+' ✓','ok');
const b=$('#st-doc-btn');if(b)b.innerHTML='📎 '+f.name+' ('+ar(REQDOC.size)+' كب)'};
$('#fup').click()}

/* doRegStore/doRegAdmin/reqSent (٥٦٥-٦٠٠ حرفياً) */
export function doRegStore(){
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
setREQDOC(null);closeModal();reqSent('store',nm);
pushNotif('0500000003','📋','طلب تسجيل متجر جديد','«'+nm+'» بانتظار مراجعتك واعتمادك في طلبات التسجيل',['a-reqs']);
pushNotif('0500000013','📋','طلب تسجيل متجر جديد','«'+nm+'» بانتظار مراجعتك واعتمادك في قسم المتاجر',['e-reqs']);
}
export function doRegAdmin(){
const nm=($('#ad-nm').value||'').trim(),ph=($('#ad-ph').value||'').trim(),em=($('#ad-em').value||'').trim(),role=$('#ad-role').value,code=($('#ad-code').value||'').trim(),pw=($('#ad-pw').value||'').trim(),pw2=($('#ad-pw2').value||'').trim();
if(nm.length<2||ph.length<10||!em.includes('@')){toast('أكمل البيانات: الاسم، جوال ١٠ أرقام، البريد','err');return}
if(code!=='DMN-2026'){toast('رمز الدعوة الإداري غير صحيح — للتجربة استخدم DMN-2026','err');return}
if(pw.length<4||pw!==pw2){toast('راجع كلمة المرور وتأكيدها (٤ خانات فأكثر)','err');return}
if(USERS[ph]){toast(USERS[ph].pend==='admin'?'أرسلت طلب إدارة بهذا الجوال مسبقاً — قيد المراجعة':'هذا الجوال مسجل — سجّل دخولك','amb');return}
const rid='rq-'+(100+DB.reqs.length+1);
DB.reqs.unshift({id:rid,kind:'admin',own:nm,email:em.toLowerCase(),phone:ph,role,at:Date.now(),status:'pending'});
USERS[ph]={name:nm,role:'staff',pass:pw,pend:'admin',reqId:rid,email:em.toLowerCase(),since:Date.now(),staffTitle:role,notif:{dis:true}};
closeModal();reqSent('admin',nm);
pushNotif('0500000003','📋','طلب انضمام لفريق الإدارة',nm+' — '+role+' بانتظار مراجعتك',['a-reqs']);
pushNotif('0500000013','📋','طلب انضمام لفريق الإدارة',nm+' — '+role+' بانتظار مراجعة فريق الموظفين',['e-reqs']);
}
function reqSent(kind,nm){
openModal(<div className="mbody" style={{padding:'28px 22px',textAlign:'center'}}>
<div style={{fontSize:'54px'}}>📨</div>
<h2 style={{fontFamily:'Alexandria',fontSize:'17px',margin:'9px 0 5px'}}>استلمنا طلبك!</h2>
<p className="hint" style={{lineHeight:'2'}}>{kind==='store'?'طلب اعتماد متجر «'+nm+'»':'طلب انضمامك لفريق الإدارة'} وصل للإدارة بكامل تفاصيله — ستراجع الإدارة بياناتك وتصلك نتيجة الموافقة أو الرفض بإشعار، وحينها تسجّل دخولك بجوالك وكلمة مرورك (الدخول موحّد للجميع).</p>
<div className="demo mt" style={{textAlign:'right'}}><b style={{fontSize:'11.5px'}}>🧪 للتجربة السريعة</b><p className="hint" style={{marginTop:'3px',lineHeight:'1.9'}}>سجّل الدخول الآن بحساب الإدارة ← افتح «📋 طلبات التسجيل» وستجد طلبك أول القائمة — اضغط موافقة، ثم اخرج وسجّل دخولك بالجوال وكلمة المرور اللذين أدخلتهما.</p></div>
<button className="btn wide mt" onClick={()=>closeModal()}>فهمت، شكراً</button></div>);
}

/* gAuth/gLogin/gNew/quickLogin (٦٠١-٦٢٥ حرفياً) */
export function gAuth(){
const accs=[{ph:'0500000001',n:'نورة العبدالله',e:'noura@mail.com',c:'#7A3B44',r:'عميلة',t:'grn'},{ph:'0500000002',n:'ريم الدوسري',e:'rima@dafi.sa',c:'#556636',r:'تاجرة',t:'amb'},{ph:'0500000003',n:'فهد العتيبي',e:'fahd@dameen.sa',c:'#1D4432',r:'الإدارة العليا',t:'nvy'},{ph:'0500000013',n:'خالد المطيري',e:'khaled.m@dameen.sa',c:'#2E6B4F',r:'موظف إدارة',t:'amb'}];
openModal(<div>
<div className="mhead"><b>المتابعة بحساب Google</b><button className="x" onClick={()=>closeModal()}>✕</button></div>
<div className="mbody">
<div className="demo mb"><b style={{fontSize:'11.5px'}}>OAuth محاكى للنسخة التجريبية</b><p className="hint" style={{marginTop:'2px'}}>تُحاكي هذه النافذة اختيار حساب Google دون أي اتصال خارجي — اختر حساباً مرتبطاً بضمين أو أنشئ جديداً.</p></div>
{accs.map(a=><div key={a.ph} style={{display:'flex',gap:'11px',alignItems:'center',padding:'10px 4px',borderBottom:'1px dashed var(--line)',cursor:'pointer'}} onClick={()=>gLogin(a.ph)}>
<div style={{width:'38px',height:'38px',borderRadius:'50%',background:a.c,color:'#fff',display:'grid',placeItems:'center',fontWeight:800,fontFamily:'Alexandria',flexShrink:0}}>{a.n[0]}</div>
<div style={{flex:1,minWidth:0}}><b style={{fontSize:'13px'}}>{a.n}</b><div className="hint">{a.e}</div></div>
<span className={'tag '+a.t}>{a.r}</span></div>)}
<div style={{display:'flex',gap:'11px',alignItems:'center',padding:'11px 4px',cursor:'pointer'}} onClick={()=>gNew()}>
<div style={{width:'38px',height:'38px',borderRadius:'50%',background:'#fff',border:'1.5px solid var(--line)',display:'grid',placeItems:'center',fontSize:'18px',color:'var(--mut)',flexShrink:0}}>＋</div>
<div style={{flex:1}}><b style={{fontSize:'13px'}}>استخدام حساب Google آخر</b><div className="hint">ينشئ حساب عميل جديد ببريدك مباشرة</div></div></div>
</div></div>);
}
function gLogin(ph){const u=USERS[ph];if(!u)return;
setSES({phone:ph,role:u.role,store:u.store||null});
closeModal();toast('دخلت عبر Google كـ'+esc(u.name)+' 👋','ok');
if(u.role==='merchant')go('m-dash');else if(u.role==='admin')go('a-over');else if(u.role==='staff')go('e-hub');else render()}
function gNew(){AUTH.tab='reg';AUTH.reg='customer';AUTH.sec=null;AUTH.gname='مستخدم Google';AUTH.gemail='user'+(1000+Date.now()%9000)+'@gmail.com';AUTH.hint='';openModal(<AuthModal/>);toast('جلبنا اسمك وبريدك من Google — أكمل جوالك وكلمة مرورك','ok')}
export function quickLogin(r){
const map={customer:'0500000001',merchant:'0500000002',admin:'0500000003',staff:'0500000013'};
const u=USERS[map[r]];setSES({phone:map[r],role:u.role,store:u.store||null});
closeModal();toast('دخلت كـ'+esc(u.name)+' ('+({customer:'عميل',merchant:'تاجر',admin:'الإدارة',staff:'موظف إدارة'}[r])+')','ok');
if(r==='merchant')go('m-dash');else if(r==='admin')go('a-over');else if(r==='staff')go('e-hub');else render();
}

/* openBell (٦٣٣-٦٤٢ حرفياً) */
export function openBell(){
const list=DB.notifs.filter(n=>n.to===SES.phone);
list.forEach(n=>n.read=true);
openModal(<div>
<div className="mhead"><b>🔔 الإشعارات</b><button className="x" onClick={()=>closeModal()}>✕</button></div>
<div className="mbody" style={{padding:'10px 14px'}}>
{list.length?list.map(n=><div key={n.at+'-'+n.t} className="row" style={{display:'flex',gap:'11px',padding:'11px 4px',borderBottom:'1px dashed #EAE3D0',alignItems:'flex-start',cursor:n.go?'pointer':undefined}} onClick={n.go?()=>{closeModal();go(n.go[0],n.go[1])}:undefined}>
<div style={{fontSize:'20px'}}>{n.ic}</div>
<div style={{flex:1}}><b style={{fontSize:'13px'}}>{n.t}</b><div className="hint">{n.b}</div></div>
<div className="hint" style={{whiteSpace:'nowrap'}}>{ago(n.at)}</div></div>):<div className="empty"><div className="em">🔕</div><b>لا إشعارات بعد</b><span>ستظهر هنا تحديثات طلباتك ونزاعاتك</span></div>}
</div></div>);
}

/* switchRole/logout (٤٤٠-٤٥٠ حرفياً) */
export function switchRole(r){
if(r==='customer'){SES.role='customer';go('home');return}
if(r==='merchant'){const own=STORES.find(s=>s.owner===SES.phone);
if(own){SES.role='merchant';SES.store=own.id;go('m-dash')}
else if(me().role==='admin'){SES.role='merchant';SES.store='s1';go('m-dash')}
else{toast('لا يوجد متجر مرتبط بحسابك — استخدم حساب التاجر التجريبي','amb');openAuth('merchant')}}
return;
if(r==='admin'){if(me().role==='admin'){SES.role='admin';go('a-over')}else{toast('الإدارة العليا تدخل بحساب المشرف العام فقط','err');openAuth('admin')}}
if(r==='staff'){if(me().role==='staff'){SES.role='staff';go('e-hub')}else{toast('لوحة الموظف لفريق الإدارة المعتمد فقط','err')}}
}
export function logout(){setSES(null);VIEW.page='home';go('home');toast('تم تسجيل الخروج، تجوّل بحرية 👋')}
