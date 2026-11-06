'use client';
/* ضمين — pages/disputes.tsx
 * «نزاعاتي» — منقول حرفياً من dameen.js (السطور ١٨١٢-١٩٤٧):
 * pgDisputes→PgDisputes, dispCard→DispCard, openDispute→OpenDispute,
 * dispModalHTML→DisputeModal, msgHTML→Msg, verdCard→VerdCard,
 * myRoleIn→MyRoleIn, sendMsg→SendMsg, attachEv→AttachEv, ruleAct→RuleAct.
 * dispSelfRefresh الأصلية (كانت تعيد بناء .mcard عبر innerHTML) صارت bumpUI('disp'):
 * DisputeModal يقرأ useUI('disp') ويعيد تركيب نافذته بمفتاح النبضة (نفس أثر innerHTML:
 * تفريغ حقول الكتابة وإعادة رسم المحادثة/الأدلة)، والتمرير لأسفل بعد الإرسال
 * في useEffect داخل مكوّن سجل الرسائل ChatLog.
 */
import { useEffect, Fragment } from 'react';
import { $, ar, money, toast, ago, dt, ST, USERS, DB } from '../core';
import { SES, VIEW, EVP, go, render, openModal, closeModal, pushNotif, bumpUI, useUI, setEVP } from '../store';
import { openAuth } from '../auth';
import { zoomImg } from '../ui';
import { doRefund, doRelease } from './orders';

/* pgDisputes (السطر ١٨١٢) */
export function PgDisputes(){
if(!SES)return <><div className="pghead"><h1>⚖️ نزاعاتي</h1></div><div className="empty"><div className="em">⚖️</div><b>سجّل دخولك لمتابعة نزاعاتك</b><span>دردشة ثلاثية الأطراف مع المتجر والإدارة حتى يصدر الحكم</span><button className="btn mt" onClick={()=>openAuth(undefined)}>تسجيل الدخول</button></div></>;
const mine=DB.disputes.filter(d=>d.customer===SES.phone);
if(!mine.length)return <><div className="pghead"><h1>⚖️ نزاعاتي</h1></div><div className="empty"><div className="em">🕊️</div><b>لا نزاعات — وهذا ممتاز</b><span>عند وجود أي مشكلة مع شحنة، افتح النزاع من صفحة طلباتك خلال نافذة الحماية</span><button className="btn mt" onClick={()=>go('orders',undefined)}>ذهاب إلى طلباتي</button></div></>;
const open=mine.filter(d=>d.status==='open'),done=mine.filter(d=>d.status==='resolved');
const tab=VIEW['dtab']||'open';
return <>
<div className="pghead"><h1>⚖️ نزاعاتي</h1>
<span className={'tag '+(open.length?'red':'grn')}>{ar(open.length)} جارٍ · {ar(done.length)} منتهٍ</span></div>
<div className="chiprow"><button className={'chip '+(tab==='open'?'on':'')} onClick={()=>{VIEW['dtab']='open';render()}}>⏳ النزاعات الجارية ({ar(open.length)})</button>
<button className={'chip '+(tab==='done'?'on':'')} style={{'--acc':'var(--grn)'} as any} onClick={()=>{VIEW['dtab']='done';render()}}>📁 النزاعات السابقة ({ar(done.length)})</button></div>
{(tab==='open'?open:done).length?(tab==='open'?open:done).map((d,i)=><DispCard key={d.id} d={d}/>):<div className="empty" style={{padding:'30px'}}><div className="em">{tab==='open'?'⏳':'📁'}</div><b>{tab==='open'?'لا نزاعات جارية':'لا نزاعات سابقة'}</b></div>}
</>;
}

/* dispCard (السطر ١٨٢٤) */
export function DispCard({d}){
const s=ST(d.store),o=DB.orders.find(x=>x.id===d.order);
const last=[...d.messages].reverse().find(m=>m.r!=='sys');
return <div className="ocard" style={{borderInlineStart:'4px solid '+(d.status==='open'?'var(--red)':'var(--grn)')}}>
<div className="spread" style={{flexWrap:'wrap'}}>
<div><b className="fx" style={{fontSize:'13.5px'}}>⚖️ {d.subject}</b>
<div className="hint">طلب #{ar(d.order)} · {s.name} · فُتح {ago(d.openedAt)}</div></div>
{d.status==='open'?<span className="tag red">قيد التحكيم — المبلغ معلق</span>:<span className="tag grn">أُصدر الحكم</span>}
</div>
{d.status==='resolved'&&d.ruling?<div className={'verd '+(d.ruling.act==='release'?'rel':'ref')} style={{margin:'10px 0 4px'}}>
<h4>{d.ruling.act==='release'?'🔓 نتيجة النزاع: إفراج المبلغ للتاجر':'💸 نتيجة النزاع: استرجاع المبلغ لك'}</h4>
<div className="why">{d.ruling.text}</div>
<div className="hint" style={{marginTop:'5px'}}>{d.ruling.by} · {dt(d.ruling.at)}</div></div>:null}
{last?<div className="hint" style={{marginTop:'8px',background:'var(--card2)',borderRadius:'11px',padding:'8px 12px'}}>💬 آخر رسالة ({last.r==='customer'?'أنت':last.r==='merchant'?'المتجر':'الإدارة'}): {last.t.slice(0,90)}{last.t.length>90?'…':''}</div>:null}
<div className="spread mt" style={{gap:'8px'}}>
<button className={'btn sm '+(d.status==='open'?'red':'')} onClick={()=>OpenDispute(d.id)}>💬 {d.status==='open'?'متابعة الدردشة وإضافة أدلة':'عرض المحادثة والحكم'}</button>
<span className="hint">{ar(d.messages.length)} رسالة</span>
</div></div>;
}

/* openDispute (السطر ١٨٤٤) */
let OPEN_DID=null;
export function OpenDispute(id){
const d=DB.disputes.find(x=>x.id===id);if(!d)return;
OPEN_DID=id;setEVP([]);
openModal(<DisputeModal d={d}/>,'lg');
setTimeout(()=>{const l=$('#chatlog');if(l)l.scrollTop=l.scrollHeight},50);
}
/* الاسم الأصلي openDispute منشور كذلك — pages/orders تستدعيها ديناميكياً باسمها الأصلي
 * (import('./disputes').then(m=>m.openDispute)) فجسر الاسم يُبقي نداءاتها تعمل */
export { OpenDispute as openDispute };

/* dispModalHTML (السطر ١٨٥٠) — نافذة النزاع: تقرأ useUI('disp') وتُعاد تركيباً كاملاً
 * عند كل bumpUI('disp') عبر مفتاح النبضة (نفس أثر $('.mcard').innerHTML=... في الأصل) */
export function DisputeModal({d}){
const tick=useUI('disp');
const s=ST(d.store),cust=USERS[d.customer],o=DB.orders.find(x=>x.id===d.order);
const g=o.groups.find(x=>x.store===d.store);
const canChat=SES&&((d.customer===SES.phone&&SES.role==='customer')||(d.store===SES.store&&SES.role==='merchant')||(SES.role==='admin'||SES.role==='staff'));
const isAdmin=SES&&(SES.role==='admin'||SES.role==='staff')&&d.status==='open';
return <div key={tick}>
<div className="mhead"><b>⚖️ {d.subject} — طلب #{ar(d.order)}</b>
{d.status==='open'?<span className="tag red">قيد التحكيم</span>:<span className="tag grn">منتهٍ</span>}
<button className="x" onClick={()=>{OPEN_DID=null;closeModal()}}>✕</button></div>
<div className="parties">
<span className="party" style={{'--pc':'var(--grn)'} as any}><i></i> 👩 {cust?cust.name:'العميل'}</span>
<span className="party" style={{'--pc':s.color} as any}><i></i> 🏪 {s.name}</span>
<span className="party" style={{'--pc':'var(--navy)'} as any}><i></i> 🛡️ الإدارة (محكّم)</span>
<span className="party" style={{'--pc':'var(--amb)'} as any}><i></i> 💰 معلق: {money(g.sub)}</span>
</div>
<div className="cwrap" id="dispwrap">
<ChatLog d={d}/>
{EVP.length?<div className="evpill">📎 {EVP.map((e,i)=><Fragment key={i}><img src={e} onClick={()=>zoomImg(e)}/><button className="btn gray xs" onClick={()=>{EVP.splice(i,1);bumpUI('disp')}}>✕</button></Fragment>)}<span>صورة جاهزة للإرسال كدليل</span></div>:null}
{d.status==='resolved'?null:canChat?<div className="composer">
<textarea id="msgtxt" placeholder="اكتب حجتك أو ردك هنا… سيظهر للأطراف الثلاثة"></textarea>
<button className="iconbtn" onClick={()=>AttachEv()} title="إرفاق صورة دليل">📎</button>
<button className="btn" onClick={()=>SendMsg(d.id)}>إرسال ➤</button>
</div>:<div className="composer"><div className="hint" style={{padding:'8px'}}>🔒 سجّل دخولك بحساب أحد الأطراف للمشاركة في الدردشة</div></div>}
{isAdmin?<div className="rulebar">
<b style={{fontSize:'12px'}} className="fx">🛡️ إصدار الحكم — اقرأ الحجج ثم اكتب تسبيبك (يظهر للطرفين)</b>
<textarea id="ruletxt" placeholder="مثال: بعد الاطلاع على الصور وتقرير التغليف، تبيّن أن الضرر وقع أثناء الشحن…"></textarea>
<div className="spread" style={{gap:'8px'}}>
<button className="btn sm" onClick={()=>RuleAct(d.id,'release')}>🔓 حكم: إفراج للتاجر</button>
<button className="btn red sm" onClick={()=>RuleAct(d.id,'refund')}>💸 حكم: استرجاع للعميل</button>
</div></div>:null}
</div>
</div>;
}

/* سجل رسائل النزاع (#chatlog) — التمرير لأسفل بعد كل تحديث (كان في dispSelfRefresh) في useEffect */
function ChatLog({d}){
useEffect(()=>{const l=$('#chatlog');if(l)l.scrollTop=l.scrollHeight});
return <div className="chatlog" id="chatlog">
{d.ruling?<VerdCard d={d}/>:null}
{d.messages.map((m,i)=><Msg key={i} m={m} d={d}/>)}
</div>;
}

/* msgHTML (السطر ١٨٨٤) */
export function Msg({m,d}){
const cust=USERS[d.customer];
if(m.r==='sys')return <div className="msg r-s">⚖️ {m.t}<div style={{fontSize:'9px',marginTop:'2px'}}>{ago(m.at)}</div></div>;
const who={customer:cust?'👩 '+cust.name.split(' ')[0]:'العميل',merchant:'🏪 '+ST(d.store).name,admin:'🛡️ الإدارة'}[m.r];
const mine=SES&&((m.r==='customer'&&d.customer===SES.phone&&SES.role==='customer')||(m.r==='merchant'&&d.store===SES.store&&SES.role==='merchant')||(m.r==='admin'&&(SES.role==='admin'||SES.role==='staff')));
const rcls=m.r==='customer'?'r-c':m.r==='merchant'?'r-m':'r-a';
return <div className={'msg '+(mine?'me':'them')+' '+rcls} style={m.r==='merchant'?({'--mc':ST(d.store).color} as any):undefined}>
<span className="who">{who}</span>{m.t}
{m['img']?<img className="ev" src={m['img']} onClick={()=>zoomImg(m['img'])}/>:null}
<div style={{fontSize:'9px',marginTop:'3px',opacity:'.7'}}>{ago(m.at)}</div></div>;
}

/* verdCard (السطر ١٨٩٦) */
export function VerdCard({d}){
const r=d.ruling,rel=r.act==='release';
return <div className={'verd '+(rel?'rel':'ref')}>
<h4>{rel?'🔓 الحكم النهائي: إفراج المبلغ للتاجر':'💸 الحكم النهائي: استرجاع المبلغ للعميل'}</h4>
<div className="why">{r.text}</div>
<div className="hint" style={{marginTop:'5px'}}>أصدره {r.by} · {dt(r.at)} — نُفذ تلقائياً على الشحنة</div></div>;
}

/* myRoleIn (السطر ١٩٠٣) */
export function MyRoleIn(d){
if(!SES)return null;
if(SES.role==='customer'&&d.customer===SES.phone)return 'customer';
if(SES.role==='merchant'&&d.store===SES.store)return 'merchant';
if(SES.role==='admin'||SES.role==='staff')return 'admin';
return null;
}

/* sendMsg (السطر ١٩١٠) — dispSelfRefresh() صارت bumpUI('disp') */
export function SendMsg(id){
const d=DB.disputes.find(x=>x.id===id);
const r=MyRoleIn(d);
if(!r){toast('سجّل دخولك كأحد الأطراف أولاً','amb');openAuth(undefined);return}
const txt=($('#msgtxt')||{value:''}).value.trim();
const img=EVP[0];
if(!txt&&!img){toast('اكتب رسالة أو أرفق صورة','err');return}
d.messages.push({r,t:txt||'(صورة دليل)',at:Date.now(),img});
if(r==='customer'){const own=ST(d.store).owner;if(own)pushNotif(own,'💬','رسالة جديدة في النزاع',custName(d)+' أضاف رداً/دلياً جديداً',['m-disputes']);pushNotif('0500000003','💬','رسالة جديدة في النزاع','نزاع طلب #'+ar(d.order)+' — '+custName(d),['a-disputes']);pushNotif('0500000013','💬','رسالة جديدة في النزاع','نزاع طلب #'+ar(d.order)+' — '+custName(d),['e-disputes'])}
else if(r==='merchant'){pushNotif(d.customer,'💬','رد من المتجر على نزاعك',ST(d.store).name+' رد على نزاع طلب #'+ar(d.order),['disputes']);pushNotif('0500000003','💬','رسالة من التاجر في النزاع','نزاع طلب #'+ar(d.order)+' — '+ST(d.store).name,['a-disputes']);pushNotif('0500000013','💬','رسالة من التاجر في النزاع','نزاع طلب #'+ar(d.order)+' — '+ST(d.store).name,['e-disputes'])}
else{pushNotif(d.customer,'💬','مداخلة من الإدارة','الإدارة علّقت على نزاع طلب #'+ar(d.order),['disputes']);const own=ST(d.store).owner;if(own)pushNotif(own,'💬','مداخلة من الإدارة','الإدارة علّقت على نزاع طلب #'+ar(d.order),['m-disputes'])}
setEVP([]);
bumpUI('disp');render();
}

/* custName (السطر ١٩٢٤) */
const custName=d=>{const u=USERS[d.customer];return u?u.name.split(' ')[0]:'العميل'};

/* attachEv (السطر ١٩٣١) — يرفق دليلاً عبر #fup حرفياً؛ dispSelfRefresh() صارت bumpUI('disp')
 * (تعيين المعالج بصيغة الأقواس ['onchange'] = نفس إسناد الخاصية .onchange في الأصل) */
export function AttachEv(){
$('#fup')['onchange']=e=>{const f=e.target.files[0];if(!f)return;
const rd=new FileReader();rd.onload=()=>{EVP.push(rd.result);$('#fup').value='';bumpUI('disp');toast('أُرفقت الصورة — اضغط إرسال لتظهر كدليل','ok')};rd.readAsDataURL(f)};
$('#fup').click();
}

/* ruleAct (السطر ١٩٣٦) — الأحكام حرفياً (release/refund) عبر doRelease/doRefund من orders */
export function RuleAct(id,act){
const d=DB.disputes.find(x=>x.id===id);
const txt=($('#ruletxt')||{value:''}).value.trim();
if(!txt){toast('اكتب تسبيب الحكم — يظهر للطرفين','err');return}
d.ruling={act,by:(SES&&SES.role==='staff')?'موظف الإدارة':'الإدارة',text:txt,at:Date.now()};d.status='resolved';
d.messages.push({r:'sys',t:'صدر حكم '+(SES&&SES.role==='staff'?'موظف الإدارة':'الإدارة')+': '+(act==='release'?'إفراج المبلغ للتاجر — التسبيب: ':'استرجاع المبلغ للعميلة — التسبيب: ')+txt,at:Date.now()});
const o=DB.orders.find(x=>x.id===d.order);const g=o.groups.find(x=>x.store===d.store);
if(act==='release')doRelease(o,g,'حكم التحكيم');else doRefund(o,g,'حكم التحكيم');
toast('أُصدر الحكم ونُفذ على الشحنة ⚖️','ok');
OPEN_DID=null;closeModal();render();
}
