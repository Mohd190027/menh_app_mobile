'use client';
/* ضمين — pages/orders.tsx
 * صفحة «طلباتي» ومكوناتها: مجموعة الشحنة (Ogroup)، بيانات الشحنة للناقل (ShipBlock)،
 * شريط البوليصة (LogiStrip)، محادثة الطلب المراقبة (OChatModal/Omsg)، التقييم والتحرير الفوري،
 * نافذة الشكوى/النزاع (CompBody)، وOTP الخدمات الميدانية (OtpBox) —
 * منقول حرفياً من dameen.js بنفس عناصر DOM والفئات والنصوص والأرقام والمنطق:
 *   السطور ٩٥٤-١٠٢٦: otpBox/mSendOTP/checkOTP/sendMyLoc/mAskExtra/mAskExtraGo/payExtra
 *   السطور ١٤٦٩-١٨١٠: GLBL/GSTEPS/gstep/pgOrders/ogroup/confirmReceive/shipBlock/shipCopy/logiStrip/
 *     openOChat/myORole/ochatHTML/omsgHTML/ochatRefresh/sendOMsg/openRate/oStarPick/submitOrderRate/
 *     doRelease/doRefund/openComplaint/compBody/compExtra/compRefresh/pickCompImg/submitComplaint
 * ochatRefresh أصبحت bumpUI('ochat') وcompRefresh أصبحت bumpUI('compbody') —
 * والنافذتان تقرآن useUI وتعيدان بناء محتواهما بمفتاح النبضة (Fragment key) = نفس أثر
 * innerHTML في الأصل، وتمرير المحادثة للأسفل في useEffect يعمل بعد كل تحديث.
 */
import { Fragment, useEffect } from 'react';
import { $, ar, ard, money, r2, dt, ago, clock, chatGuard, secOf, catComm, P, ST, SEC, USERS, DB, toast } from '../core';
import { impRefund } from '../store';
import { SES, OCHAT, ORATE, COMP, COMPS, me, go, render, pushNotif, openModal, closeModal, bumpUI, useUI, setOCHAT, setORATE, setCOMP } from '../store';
import { openAuth } from '../auth';
import { Img, Stars } from '../ui';

/* GLBL/GSTEPS (السطران ١٤٦٩-١٤٧٠) */
export const GLBL={pending:'بانتظار القبول',preparing:'قيد التحضير',shipped:'تم الشحن',received:'استُلم — قيد الفحص',released:'حُرر المبلغ',disputed:'قيد التحكيم',refunded:'استُرجع المبلغ'};
export const GSTEPS=['القبول','التحضير','الشحن','الاستلام','التحرير'];

/* openDispute (السطر ١٨٤٤ في الأصل) معرّفة في صفحة النزاعات src/dameen/pages/disputes.tsx
 * ولم تُحوَّل بعد (كعب حالياً). نداء الأصل محفوظ حرفياً عبر تحميل ديناميكي متأخر:
 * يعمل بصمت الآن (الكعب لا يصدّر الدالة)، ويُفعَّل تلقائياً فور تصدير disputes.tsx
 * للدالة بنفس الاسم والتوقيع openDispute(id). */
function openDispute(id){import('./disputes').then(m=>{const f=(m as any).openDispute;if(typeof f==='function')f(id)}).catch(()=>{})}

/* gstep (السطر ١٤٧١) */
export function gstep(g){return{pending:0,preparing:1,shipped:2,received:3,released:4}[g.status]}

/* pgOrders (السطر ١٤٧٢) */
export function PgOrders(){
if(!SES)return <><div className="pghead"><h1>🧾 طلباتي</h1></div><div className="empty"><div className="em">🔐</div><b>سجّل دخولك لمتابعة طلباتك</b><span>ستجد هنا كل شحنة بحالتها وعدّاد الحماية</span><button className="btn mt" onClick={()=>openAuth(undefined)}>تسجيل الدخول</button></div></>;
const os=DB.orders.filter(o=>o.customer===SES.phone);
if(!os.length)return <><div className="pghead"><h1>🧾 طلباتي</h1></div><div className="empty"><div className="em">📦</div><b>لا طلبات بعد</b><span>أول طلب لك سيظهر هنا بحالاته المباشرة</span><button className="btn mt" onClick={()=>go('home',undefined)}>ابدأ التسوق</button></div></>;
return <>
<div className="pghead"><h1>🧾 طلباتي</h1><span className="tag grn">{ar(os.length)} طلبات</span></div>
{os.map((o:any)=>(<div className="ocard" key={o.id}>
<div className="spread" style={{flexWrap:'wrap'}}>
<div><b className="fx" style={{fontSize:'14px'}}>طلب #{ar(o.id)}</b><div className="hint">{dt(o.at)} · {({mada:'مدى',visa:'فيزا/ماستركارد',apple:'Apple Pay',tabby:'تقسيط تابي',tamara:'تقسيط تمارا',bal:'محفظة ضمين'}[o.pay])||'دفع إلكتروني'}{o.paidBy?' ('+o.paidBy+')':null}{o.inst?' — '+ar(o.inst.n)+' دفعات × '+ard(o.inst.each)+' ر.س':null}</div></div>
{o.coupon&&o.coupon.amt?<span className="tag amb">كوبون −{money(o.coupon.amt)}</span>:null}
{o.ptsUsed?<span className="tag amb">نقاط −{money(o.ptsAmt)}</span>:null}
{o.freeDl?<span className="tag grn">🚚 توصيل مجاني (نقاط)</span>:null}
{o.tax?<span className="tag gry">ض.ق.م ١٥٪: {money(o.tax)}</span>:null}
</div>
<div className="hint">📍 {o.addr}</div>
{o.groups.map((g:any,gi:number)=>(<Ogroup key={gi} o={o} g={g} gi={gi}/>))}
</div>))}
</>;
}

/* ogroup (السطر ١٤٨٩) */
export function Ogroup({o,g,gi}:any){
const s=ST(g.store),sec=SEC(s.sec);
const st=g.status;
const dis=DB.disputes.find(d=>d.order===o.id&&d.store===g.store);
const archived=g.chat&&(g.chatArchived||['received','released','refunded','disputed'].includes(st));
return <div className="ogroup">
<div className="spread" style={{flexWrap:'wrap'}}>
<div style={{display:'flex',alignItems:'center',gap:'9px'}}>
<div className="cghead" style={{'--c':s.color,background:s.color+'14',border:0,padding:'4px 12px 4px 9px',borderRadius:'11px'} as any}><div className="lg" style={{width:'24px',height:'24px',fontSize:'11px'}}>{s.name[0]}</div></div>
<div><b style={{fontSize:'12.5px',color:s.color}}>{s.name}</b><div className="hint">شحنة مستقلة · حماية {sec.win}</div></div>
</div>
{st==='disputed'?<span className="tag red">⚖️ قيد التحكيم</span>:st==='refunded'?<span className="tag gry">💸 استُرجع المبلغ</span>:<span className={'tag '+(st==='released'?'grn':'amb')}>{GLBL[st]}</span>}
</div>
<div className="oitems">{g.items.map((it:any,i:number)=>{const p=P(it.pid);return <span className="oitag" key={i} onClick={()=>go('product',it.pid)}>{p?<Img src={p.imgs[0]} cls='' alt=''/>:null} {ar(it.qty)}× {p?p.name:'—'}</span>})}</div>
{g.logi?logiStrip(o,g):null}
{shipBlock(o,g,gi)}
{g.booking?<div className="hint" style={{marginTop:'7px',background:'#A45A3A12',border:'1px dashed #A45A3A55',borderRadius:'11px',padding:'8px 11px',lineHeight:1.8}}>🎪 <b>حجز مناسبتك:</b> {g.booking.date} · التركيب {g.booking.setup}{g.booking.tear?' · الفك '+g.booking.tear:null}{g.booking.dl==='pickup'?' · 🚶 استلام من مقر المتجر بلا توصيل':' · 🚚 فريق المتجر يوصل ويركّب'}{g.booking.geo?' · 📍 موقع المناسبة محدد لفريق التنسيق':null}{g.booking.note?' · '+g.booking.note:null}</div>:null}
{g.gift?<div className="giftrow">🎁 إهداء إلى: <b>{g.gift.name||'مستلم'}</b> · {ar(g.gift.phone)} · {g.gift.city||'—'} — صدرت البوليصة باسم المستلم فتوصله الهدية مباشرة</div>:null}
{g.digi?<div className="giftrow" style={{background:'#50489E12',borderColor:'#50489E66'}}>⚡ طلب رقمي — سُلّم فوراً إلى <a style={{color:'#50489E',fontWeight:800,cursor:'pointer'}} onClick={()=>go('dlib',undefined)}>مكتبتك الرقمية</a> والكود/الملف جاهز للعرض والتحميل</div>:null}
{g.custom?<div className="giftrow" style={{background:'#A45A3A12',borderColor:'#A45A3A66'}}>✏️ طلب قابل للتعديل — راسل متجرك عبر محادثة الطلب بأي تعديل (أي مبلغ إضافي يُحجز بضمان ضمين حتى الاستلام)</div>:null}
{g.extra?<div className="giftrow" style={{background:'#1D44320d',borderColor:'#1D443255'}}>💰 أُضيف للشحنة مبلغ تعديلات محجوز بالخزنة: <b>{money(g.extra)}</b></div>:null}
{g.ans&&g.ans.length?<div className="hint" style={{marginTop:'6px'}}>❓ إجاباتك للمتجر: {g.ans.map((x:any,xi:number)=><Fragment key={xi}>{xi?' · ':null}{x.q} ← <b>{x.a}</b></Fragment>)}</div>:null}
{g.pans&&g.pans.length?<div className="hint" style={{marginTop:'6px'}}>❓ إجاباتك على أسئلة المنتجات: {g.pans.map((x:any,xi:number)=><Fragment key={xi}>{xi?' · ':null}{x.pn} — {x.ans.map((y:any,yi:number)=><Fragment key={yi}>{yi?'، ':null}{y.q} ← <b>{y.a}</b></Fragment>)}</Fragment>)}</div>:null}
{g.chat?<div className="mt" style={{display:'flex',gap:'7px',flexWrap:'wrap',alignItems:'center'}}><button className="btn soft sm" onClick={()=>openOChat(o.id,gi)}>💬 محادثة الطلب{g.chatDeleted?' — محذوفة لمخالفة':(g.chatArchived||['received','released','refunded','disputed'].includes(st))?' — مؤرشفة':' ('+ar(g.chat.length)+' رسالة)'}</button>{g.viol&&(g.viol.customer+g.viol.merchant)?<span className="tag red">{ar(g.viol.customer+g.viol.merchant)} رسالة محجوبة أمنياً</span>:null}</div>:null}
{st!=='disputed'&&st!=='refunded'?<div className="osteps">{GSTEPS.map((l,i)=><div key={i} className={'st '+(i<gstep(g)?'on':i===gstep(g)?(st==='received'?'cur on':'on'):'')}><i></i>{l}</div>)}</div>:null}
{st==='received'?<>
<div className="spread mt" style={{flexWrap:'wrap'}}>
<span className="cd" data-cd={g.complaintUntil}><b>⏳ {clock(g.complaintUntil-Date.now())}</b> متبقٍ من نافذة الحماية — بعدها يُحرر المبلغ تلقائياً</span></div>
<div className="spread mt" style={{gap:'8px',flexWrap:'wrap'}}>
<button className="btn sm" onClick={()=>openRate(o.id,gi)}>⭐ قيّم وحرر فوراً</button>
<button className="btn red sm" onClick={()=>openComplaint(o.id,gi)}>⚠️ فتح نزاع</button>
</div>
</>:null}
{st==='shipped'?(g.ship&&g.ship.mode==='field'?<OtpBox o={o} g={g} gi={gi}/>:<button className="btn sm mt" onClick={()=>confirmReceive(o.id,gi)}>📦 استلمت الشحنة — ابدأ الفحص</button>):null}
{st==='pending'?<div className="hint mt">بانتظار قبول المتجر للطلب…</div>:null}
{st==='preparing'?<div className="hint mt">🧵 المتجر يحضّر طلبك الآن</div>:null}
{st==='disputed'&&dis?<button className="btn red sm mt" onClick={()=>openDispute(dis.id)}>💬 متابعة النزاع والدردشة</button>:null}
{st==='refunded'?<div className="hint mt">💸 استُرجع كامل مبلغ الشحنة ({money(g.sub)}) إلى محفظة ضمين — استخدمه في طلبك القادم.</div>:null}
{st==='released'&&g.payout?<div className="mt" style={{background:'#1D443208',border:'1px dashed #1D443233',borderRadius:'12px',padding:'9px 13px',fontSize:'11.5px'}}>
<b style={{color:'var(--grn)'}}>🔓 تفصيل التحرير</b> — إجمالي الشحنة {money(g.payout.sub)} · عمولة ضمين: {money(g.payout.comm)} · صافي التاجر: {money(g.payout.net)}{g.rated?<> · تقييمك: <Stars r={g.rated.stars}/></>:null}</div>:null}
<div className="hint" style={{marginTop:'7px'}}>إجمالي الشحنة: <b>{money(r2(g.sub+g.dl))}</b>{g.dl?' (شحن '+money(g.dl)+')':null}</div>
</div>;
}

/* otpBox (السطر ٩٥٤) — يُرسم داخل Ogroup عندما تكون الشحنة خدمة ميدانية (كما في الأصل) */
export function OtpBox({o,g,gi}:any){
return <div className="otpbox">
<div className="spread" style={{flexWrap:'wrap'}}><b style={{fontSize:'12px'}}>🎯 تأكيد إتمام الخدمة بكود OTP</b>
{g.otp?<span className="tag grn">الكود وصل جوالك: <b style={{letterSpacing:'2px'}}>{ar(g.otp)}</b></span>:<span className="tag amb">بانتظار كود فريق التنسيق بعد التركيب</span>}</div>
<p className="hint" style={{margin:'6px 0 9px',lineHeight:1.8}}>لا تُحرر مستحقات متجر الديكور والفعاليات إلا بإدخال كود التأكيد منك عند اكتمال التركيب في موقع المناسبة — حماية للطرفين، وبقية مبلغك محجوز بالخزنة حتى ذلك الحين.</p>
<div style={{display:'flex',gap:'8px',alignItems:'center',flexWrap:'wrap'}}>
<input className="inp" id={'otpin-'+o.id} style={{width:'120px',textAlign:'center',letterSpacing:'4px',fontWeight:800}} maxLength={4} placeholder="٠٠٠٠"/>
<button className="btn sm" onClick={()=>checkOTP(o.id,gi)}>✅ تأكيد إتمام الخدمة</button>
{g.otpBad?<span className="tag red">{ar(g.otpBad)} محاولة خاطئة</span>:null}
</div></div>;
}

/* mSendOTP (السطر ٩٦٤) */
export function mSendOTP(oid,gi){
const o=DB.orders.find(x=>x.id===oid) as any;const g=o.groups[gi];
g.otp=String(Math.floor(1000+Math.random()*9000));
g.otpAt=Date.now();
if(g.chat&&!g.chatDeleted)g.chat.push({r:'sys',t:'🎯 أرسل فريق التنسيق كود تأكيد إتمام الخدمة — أدخله بعد اكتمال التركيب ليُحرر مستحق المتجر.',at:Date.now()});
pushNotif(o.customer,'🎯','كود تأكيد إتمام الخدمة','كودك لطلب #'+ar(oid)+': '+g.otp+' — أدخله في التطبيق بعد اكتمال التركيب في موقع المناسبة',['orders']);
toast('أُرسل كود التأكيد للعميل (محاكاة SMS) ✓','ok');render();
}

/* checkOTP (السطر ٩٧٢) — String() حول indexOf لسلامة الأنواع، والناتج نفسه حرفياً */
export function checkOTP(oid,gi){
const o=DB.orders.find(x=>x.id===oid) as any;const g=o.groups[gi];
const raw=(($('#otpin-'+oid)||{value:''}).value)||'';
const norm=String(raw).replace(/[٠-٩]/g,d=>String('٠١٢٣٤٥٦٧٨٩'.indexOf(d))).trim();
if(!g.otp){toast('لم يرسل المتجر كود التأكيد بعد','amb');return}
if(norm!==g.otp){g.otpBad=(g.otpBad||0)+1;toast('الكود غير صحيح — تأكد منه مع فريق التنسيق ('+ar(g.otpBad)+' محاولات)','err');render();return}
g.otpOk=true;g.status='received';g.complaintUntil=Date.now();
doRelease(o,g,'كود تأكيد العميل (OTP)',false);
toast('تم تأكيد إتمام الخدمة وحُرر مستحق المتجر 🎯','ok');render();
}

/* sendMyLoc (السطر ٩٨٣) */
export function sendMyLoc(){
if(!OCHAT)return;
const o=DB.orders.find(x=>x.id===OCHAT.oid) as any;const g=o.groups[OCHAT.gi];
const u=me() as any;
const done=(geo,txt)=>{
g.chat.push({r:'customer',loc:{geo,txt},at:Date.now()});
pushNotif(ST(g.store).owner,'📍','العميل شارك موقعه','وصل موقع العميل في محادثة طلب #'+ar(o.id)+' — لتوجيه الفريق بدقة',['m-orders']);
toast(geo?'شاركت موقعك الحالي مع المتجر ✓':'شاركت عنوانك المحفوظ كرسالة موقع (تعذر GPS)','ok');
ochatRefresh()};
const fallback=()=>{const a=(u.addrs||[]).find(x=>x.def)||(u.addrs||[])[0];done(null,(a&&a.a)?a.a:'موقعي')};
if(navigator.geolocation)navigator.geolocation.getCurrentPosition(p=>done({lat:+p.coords.latitude.toFixed(4),lng:+p.coords.longitude.toFixed(4)},'موقعي الحالي'),fallback,{timeout:8000});
else fallback();
}

/* mAskExtra (السطر ٩٩٦) + mAskExtraGo (السطر ١٠٠٥) */
export function mAskExtra(){
if(!OCHAT)return;
openModal(<MAskExtraModal/>,undefined);
}
function MAskExtraModal(){
return <>
<div className="mhead"><b>💰 طلب مبلغ إضافي (تعديل)</b><button className="x" onClick={()=>closeModal()}>✕</button></div>
<div className="mbody">
<div className="demo mb"><b style={{fontSize:'12px'}}>سعّر التعديل الذي اتفقت عليه مع العميل</b><p className="hint" style={{marginTop:'3px',lineHeight:1.8}}>يُرسل طلب الدفع داخل المحادثة — يدفع العميل بضمان ضمين، ويُحجز المبلغ مع بقية قيمة الطلب في الخزنة حتى الاستلام والتحرير.</p></div>
<div className="fgrid"><div className="fld"><label>المبلغ (ر.س)</label><input className="inp" id="ex-amt" type="number" min="1" defaultValue={25}/></div>
<div className="fld"><label>السبب (يظهر للعميل)</label><input className="inp" id="ex-note" placeholder="مثال: إضافة اسم مطرز على البوكس"/></div></div>
<button className="btn amb wide mt" onClick={()=>mAskExtraGo()}>إرسال طلب الدفع للعميل</button>
</div>
</>;
}
export function mAskExtraGo(){
if(!OCHAT)return closeModal();
const o=DB.orders.find(x=>x.id===OCHAT.oid) as any;const g=o.groups[OCHAT.gi];
const amt=Math.max(1,+((($('#ex-amt')||{value:0}).value)||0));
const note=(($('#ex-note')||{value:''}).value||'').trim();
g.chat.push({r:'merchant',payreq:{amt,note,paid:false},at:Date.now()});
pushNotif(o.customer,'💰','طلب التاجر مبلغاً إضافياً','قدّم متجر '+ST(g.store).name+' تعديلاً بـ'+money(amt)+' على طلبك #'+ar(o.id)+' — راجعه في محادثة الطلب',['orders']);
closeModal();toast('أُرسل طلب الدفع إلى العميل ✓','ok');openOChat(OCHAT.oid,OCHAT.gi);
}

/* payExtra (السطر ١٠١٤) */
export function payExtra(oid,gi,mi){
const o=DB.orders.find(x=>x.id===oid) as any;if(!o)return;const g=o.groups[gi];const m=g.chat[mi];
if(!m||!m.payreq||m.payreq.paid)return;
const u=me() as any;const amt=m.payreq.amt;
if((u.bal||0)>=amt){u.bal=r2((u.bal||0)-amt);m.payreq.via='محفظة ضمين'}
else{m.payreq.via='بطاقة مدى (Moyasar)'}
m.payreq.paid=true;
g.sub=r2(g.sub+amt);g.extra=r2((g.extra||0)+amt);
g.chat.push({r:'sys',t:'💰 حُجز مبلغ التعديل '+money(amt)+' في خزنة ضمين — إجمالي قيمة الشحنة الآن '+money(r2(g.sub+(g.dl||0)))+'، والمبلغ كله ضمن الحماية حتى الاستلام.',at:Date.now()});
pushNotif(ST(g.store).owner,'💰','دفع العميل مبلغ التعديل','حُجز '+money(amt)+' إضافية في طلب #'+ar(oid)+' — ضمن حماية ضمين حتى التحرير',['m-orders']);
toast('حُجز مبلغ التعديل في الخزنة بضمان ضمين ✓','ok');ochatRefresh();render();
}

/* confirmReceive (السطر ١٥٣٠) */
export function confirmReceive(oid,gi){
const o=DB.orders.find(x=>x.id===oid) as any;const g=o.groups[gi];
g.status='received';g.complaintUntil=Date.now()+secOf(g.store).winMin*60e3;
if(g.logi)g.logi.events.push({t:'أكّد العميل التسليم — تحديث حالة تلقائي عبر Webhook',at:Date.now()});
if(g.chat&&!g.chatArchived&&!g.chatDeleted){g.chatArchived=true;g.chat.push({r:'sys',t:'🗄️ أُرشفت المحادثة فور تسليم الشحنة — للاعتراض على الشحنة افتح نزاعاً خلال نافذة الحماية.',at:Date.now()})}
pushNotif(o.customer,'🛡️','بدأت نافذة الحماية','افحص طلبك #'+ar(oid)+' — لديك '+secOf(g.store).win,['orders']);
const own=ST(g.store).owner;if(own)pushNotif(own,'📦','أكّد العميل الاستلام','بدأت نافذة حماية طلب #'+ar(oid)+' — يُحرر المبلغ تلقائياً بانتهائها',['m-orders']);
toast('بدأت نافذة الفحص — '+secOf(g.store).win+' 🛡️','ok');render();
}

/* shipBlock (السطر ١٥٤١) — بيانات الشحنة لشركة الشحن */
export function ShipBlock({o,g,gi}:any){
if(!g.logi||!g.logi.mode||g.logi.mode==='field'||g.logi.mode==='digital')return null;
const cust=(USERS[o.customer]||{}) as any;
const its=g.items.map((it:any)=>({p:P(it.pid) as any,qty:it.qty})).filter((x:any)=>x.p);
const frag=its.filter((x:any)=>x.p.fragile).map((x:any)=>x.p.name);
const cold=its.filter((x:any)=>x.p.ptype==='chilled'||x.p.temp==='chilled').map((x:any)=>x.p.name);
const hot=its.filter((x:any)=>x.p.ptype==='instant'||x.p.temp==='hot').map((x:any)=>x.p.name);
const sans=(g.ans||[]).map((x:any)=>x.q+': '+x.a).join(' · ');
const pans=(g.pans||[]).map((x:any)=>x.pn+' — '+x.ans.map((y:any)=>y.q+': '+y.a).join('، ')).join(' · ');
return <div className="shipblk">
<div className="spread" style={{flexWrap:'wrap'}}><b style={{fontSize:'12px'}}>📋 بيانات الشحنة — لشركة الشحن ({g.logi.courier})</b>
<button className="btn gray xs" onClick={()=>shipCopy(o.id,gi)}>📋 نسخ للشحن</button></div>
<div className="srow2"><span>المستلم</span><b>{cust.name||'عميل ضمين'}{cust.phone?' · '+ar(o.customer):null}</b></div>
<div className="srow2"><span>العنوان</span><b>{o.addr||'—'}</b></div>
<div className="srow2"><span>المسار</span><b>من {ST(g.store).city||'—'} إلى {o.city||'—'}{g.logi.wb?' · بوليصة '+ar(g.logi.wb):null}</b></div>
<div className="srow2"><span>الطرود</span><b>{ar(g.items.reduce((a,x)=>a+x.qty,0))} قطعة · {ar(its.length)} منتج</b></div>
{frag.length?<div className="srow2"><span>تعليمات التداول</span><b style={{color:'#B3541E'}}>⚠️ قابل للكسر: {frag.join('، ')} — تغليف حماية إلزامي</b></div>:null}
{cold.length?<div className="srow2"><span>سلسلة التبريد</span><b style={{color:'#2E6B8A'}}>🧊 مبرد: {cold.join('، ')} — نقل مبرد إلزامي</b></div>:null}
{hot.length?<div className="srow2"><span>التسليم الحار</span><b style={{color:'#A45A3A'}}>🔥 يُسلّم ساخناً: {hot.join('، ')} — حافظات حرارية</b></div>:null}
{sans?<div className="srow2"><span>إجابات أسئلة المتجر</span><b>{sans}</b></div>:null}
{pans?<div className="srow2"><span>اختيارات العميل للمنتجات</span><b>{pans}</b></div>:null}
</div>;
}
export function shipBlock(o:any,g:any,gi:any){return <ShipBlock o={o} g={g} gi={gi}/>}

/* shipCopy (السطر ١٥٦٤) */
export function shipCopy(oid,gi){
const o=DB.orders.find(x=>x.id===oid) as any;if(!o)return;const g=o.groups[gi];if(!g||!g.logi)return;
const cust=(USERS[o.customer]||{}) as any;
const its=g.items.map((it:any)=>({p:P(it.pid) as any,qty:it.qty})).filter((x:any)=>x.p);
const frag=its.filter((x:any)=>x.p.fragile).map((x:any)=>x.p.name);
const cold=its.filter((x:any)=>x.p.ptype==='chilled'||x.p.temp==='chilled').map((x:any)=>x.p.name);
const hot=its.filter((x:any)=>x.p.ptype==='instant'||x.p.temp==='hot').map((x:any)=>x.p.name);
const txt=['بيانات شحنة ضمين — طلب #'+o.id,
'شركة الشحن: '+(g.logi.courier||'—')+(g.logi.wb?' · بوليصة '+g.logi.wb:''),
'المستلم: '+(cust.name||'عميل ضمين')+' · '+o.customer,
'العنوان: '+(o.addr||'—'),
'المسار: من '+(ST(g.store).city||'—')+' إلى '+(o.city||'—'),
'المحتويات: '+its.map((x:any)=>x.qty+'× '+x.p.name).join('، '),
frag.length?'⚠️ قابل للكسر: '+frag.join('، ')+' — تغليف حماية إلزامي':'',
cold.length?'🧊 مبرد: '+cold.join('، ')+' — نقل مبرد إلزامي':'',
hot.length?'🔥 يُسلّم ساخناً: '+hot.join('، ')+' — حافظات حرارية':'',
(g.ans||[]).map((x:any)=>x.q+': '+x.a).join(' | '),
(g.pans||[]).map((x:any)=>x.pn+' — '+x.ans.map((y:any)=>y.q+': '+y.a).join('، ')).join(' | ')
].filter(Boolean).join('\n');
const done=()=>toast('نُسخت بيانات الشحنة لتسليمها لشركة الشحن ✓','ok');
if(navigator.clipboard&&navigator.clipboard.writeText)navigator.clipboard.writeText(txt).then(done,done);else done();
}

/* logiStrip (السطر ١٥٨٧) — شريط البوليصة والتتبع بالحالات */
export function LogiStrip({o,g}:any){
const l=g.logi,s=ST(g.store);
const modeTxt=l.mode==='chilled'?'🧊 جارٍ جدولة توصيل مبرد مع أقرب شركة توصيل مبرد متعاقدة (موعد مسبق)':l.mode==='instant'?'🛵 جارٍ البحث عن مندوب فوري — وقت التوصيل المتوقع: ٤٥ دقيقة':'🚚 تتبع بالحالات فقط — بلا خريطة مباشرة حفاظاً على خصوصية الطرفين';
return <div className="lgstrip">
<div className="spread" style={{flexWrap:'wrap'}}><b>{l.wb?'📄 بوليصة '+ar(l.wb)+' · ':null}{l.courier}</b><span className="hint">من {s.city||'—'} إلى {o.city||'مدينتك'}</span></div>
{modeTxt}
{g.ship&&g.ship.charge?<div className="hint">رسوم الشحن المدفوعة: {money(g.ship.charge)} ← تُحوّل لحساب الشريك اللوجستي</div>:(g.ship&&g.ship.source==='merchant'?<div className="hint">الشحن على حساب المتجر 🎁 — وما يتحمله يُقتطع من صافيه ولا يمس العمولة</div>:null)}
{g.ship&&g.ship.fragile?<div className="hint" style={{color:'#B3541E',fontWeight:700}}>⚠️ قابل للكسر — العلامة منقولة آلياً لشركة الشحن: تغليف خاص إلزامي (رسوم حماية ١٥ ر.س ضمن الشحن)</div>:null}
{l.events.slice(-3).map((e:any,i:number)=><div key={i} className="lgev">⚡ {e.t} · {ago(e.at)}</div>)}
</div>;
}
export function logiStrip(o:any,g:any){return <LogiStrip o={o} g={g}/>}

/* openOChat (السطر ١٦٠٠) — يضبط OCHAT عبر المطاوعة ثم يفتح نافذة المحادثة */
export function openOChat(oid,gi){
const o=DB.orders.find(x=>x.id===oid) as any;if(!o)return;const g=o.groups[gi];if(!g.chat)return;
setOCHAT({oid,gi});openModal(<OChatModal/>,'lg');
}

/* myORole (السطر ١٦٠٥) */
export function myORole(o,g){
if(!SES)return null;
if(SES.role==='admin'||SES.role==='staff')return 'admin';
if(SES.role==='customer'&&o.customer===SES.phone)return 'customer';
if(SES.role==='merchant'&&g.store===SES.store)return 'merchant';
return null;
}

/* ochatHTML (السطر ١٦١٢) → OChatModal — تقرأ useUI('ochat') وتعيد بناء محتواها بمفتاح
 * النبضة عند كل bumpUI('ochat') (بديل إعادة بناء $('.mcard').innerHTML في ochatRefresh)،
 * وتمرير المحادثة للأسفل في useEffect يعمل بعد كل تحديث (بديل setTimeout في openOChat
 * وسطر scrollTop في ochatRefresh). */
export function OChatModal(){
const t=useUI('ochat');
useEffect(()=>{const l=$('#chatlog');if(l)l.scrollTop=l.scrollHeight},[t]);
const o=DB.orders.find(x=>x.id===OCHAT.oid) as any;const g=o&&o.groups[OCHAT.gi];
const s=ST(g.store),cust=USERS[o.customer];
const r=myORole(o,g);
const archived=g.chatArchived||['received','released','refunded','disputed'].includes(g.status);
const canWrite=(r==='customer'||r==='merchant')&&!g.chatDeleted&&!archived;
return <Fragment key={t}>
<div className="mhead"><b>💬 محادثة الطلب #{ar(o.id)} — {s.name}</b>
{g.chatDeleted?<span className="tag red">محذوفة لمخالفة</span>:archived?<span className="tag gry">🗄️ مؤرشفة</span>:<span className="tag grn">نشطة</span>}
<button className="x" onClick={()=>{setOCHAT(null);closeModal()}}>✕</button></div>
<div className="parties">
<span className="party" style={{'--pc':'var(--grn)'} as any}><i></i> 👩 {cust?cust.name:'العميل'}</span>
<span className="party" style={{'--pc':s.color} as any}><i></i> 🏪 {s.name}</span>
<span className="party" style={{'--pc':'var(--navy)'} as any}><i></i> 🛡️ الإدارة تُتابع تلقائياً</span>
</div>
<div className="cwrap">
<div className="chatlog" id="chatlog">
{g.chat.map((m:any,i:number)=><Omsg key={i} m={m} g={g} mi={i}/>)}
</div>
{canWrite?<><div className="chatbar">{r==='customer'?<button className="btn soft xs" onClick={()=>sendMyLoc()}>📍 مشاركة موقعي مع المتجر</button>:null}{r==='merchant'?<button className="btn amb xs" onClick={()=>mAskExtra()}>💰 طلب مبلغ إضافي (تعديل)</button>:null}</div>
<div className="composer">
<textarea id="omsg" placeholder="اكتب تفاصيل طلبك أو استفسارك… (محادثة مراقبة: تُحجب الأرقام والروابط ووسائل التواصل الخارجية تلقائياً)"></textarea>
<button className="btn" onClick={()=>sendOMsg()}>إرسال ➤</button>
</div></>:<div className="composer"><div className="hint" style={{padding:'8px',lineHeight:1.8}}>{g.chatDeleted?'🚫 حُذفت المحادثة نهائياً بعد رصد ٣ مخالفات لسياسة التواصل خارج التطبيق — للاعتراض راسل دعم ضمين.':archived?'🗄️ أُرشفت المحادثة فور تسليم الشحنة — للاعتراض افتح نزاعاً خلال نافذة الحماية.':r==='admin'?'🛡️ أنت بوضع المراقبة — الإدارة تطلع ولا تشارك':'🔒 سجّل دخولك كأحد طرفي الطلب للمشاركة'}</div></div>}
</div>
</Fragment>;
}
export {OChatModal as ochatHTML};

/* omsgHTML (السطر ١٦٣٦) → Omsg — cgi تُلتقط وقت الرسم كما يُضمَّن OCHAT.gi في نص الأصل */
export function Omsg({m,g,mi}:any){
if(m.r==='sys')return <div className="msg r-s">🔔 {m.t}<div style={{fontSize:'9px',marginTop:'2px'}}>{ago(m.at)}</div></div>;
const o=DB.orders.find(x=>x.id===OCHAT.oid) as any;
const who=m.r==='customer'?(USERS[o.customer]?USERS[o.customer].name.split(' ')[0]:'العميل'):ST(g.store).name;
const mine=SES&&((m.r==='customer'&&SES.role==='customer'&&o.customer===SES.phone)||(m.r==='merchant'&&SES.role==='merchant'&&g.store===SES.store));
const stamp=<div style={{fontSize:'9px',marginTop:'3px',opacity:.7}}>{ago(m.at)}</div>;
const mcs=m.r==='merchant'?({'--mc':ST(g.store).color} as any):undefined;
const cgi=OCHAT.gi;
if(m.loc)return <div className={'msg '+(mine?'me':'them')+' '+(m.r==='customer'?'r-c':'r-m')} style={mcs}>
<span className="who">{m.r==='customer'?'👩 '+who:'🏪 '+who} · 📍 مشاركة موقع</span>
<span className="locpin">📍 {m.loc.txt}{m.loc.geo?' ('+ard(m.loc.geo.lat)+'، '+ard(m.loc.geo.lng)+')':null}</span>
{stamp}</div>;
if(m.payreq){const custSide=SES&&SES.role==='customer';
return <div className={'msg '+(mine?'me':'them')+' '+(m.r==='merchant'?'r-m':'r-c')} style={mcs}>
<span className="who">{m.r==='merchant'?'🏪 '+who:'👩 '+who} · 💰 طلب مبلغ إضافي</span>
<div className="payreq"><b>تعديل بـ {money(m.payreq.amt)}</b>{m.payreq.note?<span className="hint">{m.payreq.note}</span>:null}
{m.payreq.paid?<span className="tag grn">✓ سُدد وحُجز في الخزنة — {m.payreq.via||'محفظة ضمين'}</span>:custSide?<button className="btn amb xs" onClick={()=>payExtra(o.id,cgi,mi)}>🔒 ادفع {money(m.payreq.amt)} بضمان ضمين</button>:<span className="tag amb">بانتظار دفع العميل</span>}
</div>{stamp}</div>}
return <div className={'msg '+(mine?'me':'them')+' '+(m.r==='customer'?'r-c':'r-m')} style={mcs}><span className="who">{m.r==='customer'?'👩 '+who:'🏪 '+who}</span>{m.t}{stamp}</div>;
}

/* ochatRefresh (السطر ١٦٥٠) — كانت تعيد بناء $('.mcard').innerHTML وتمرر للأسفل
 * ⇒ الآن bumpUI('ochat') والتمرير في useEffect داخل OChatModal.
 * تصفير OCHAT مع السكوت عند فقدان الشحنة/المحادثة يبقى كما في الأصل حرفياً. */
export function ochatRefresh(){
if(!OCHAT)return;
const o=DB.orders.find(x=>x.id===OCHAT.oid) as any;const g=o&&o.groups[OCHAT.gi];
if(!g||!g.chat){setOCHAT(null);return}
bumpUI('ochat');
}

/* sendOMsg (السطر ١٦٥٧) */
export function sendOMsg(){
const o=DB.orders.find(x=>x.id===OCHAT.oid) as any;const g=o.groups[OCHAT.gi];
const r=myORole(o,g);
if(r!=='customer'&&r!=='merchant'){toast('الإدارة تتابع المحادثة ولا تشارك فيها','amb');return}
const txt=($('#omsg').value||'').trim();
if(!txt){toast('اكتب رسالتك أولاً','err');return}
const v=chatGuard(txt);
if(!v.ok){
g.viol[r]=(g.viol[r]||0)+1;
const n=g.viol[r];
g.chat.push({r:'sys',t:'🚫 حُجبت رسالة ('+v.why+') — تحذير '+ar(n)+' من ٣: التواصل خارج ضمين ممنوع، وأي رقم أو رابط أو وسيلة تواصل تُحجب تلقائياً.',at:Date.now()});
pushNotif('0500000003','🛡️','محاولة تواصل خارج التطبيق','رُصدت رسالة محجوبة ('+v.why+') في محادثة طلب #'+ar(o.id)+' — '+ST(g.store).name,['a-over']);
const other=r==='customer'?ST(g.store).owner:o.customer;
if(other)pushNotif(other,'🚫','تنبيه أمني','رُصدت محاولة مشاركة بيانات تواصل في محادثة طلب #'+ar(o.id)+' — يُمنع التواصل خارج ضمين حمايةً للطرفين',['orders']);
$('#omsg').value='';
if(n>=3){
g.chatDeleted=true;
g.chat=[{r:'sys',t:'حُذفت المحادثة نهائياً — رُصدت ٣ محاولات لمخالفة سياسة التواصل خارج التطبيق. للاعتراض راسل دعم ضمين.',at:Date.now()}];
pushNotif('0500000003','⛔','حُذفت محادثة طلب','تجاوز أحد الطرفين ٣ مخالفات في طلب #'+ar(o.id)+' — '+ST(g.store).name,['a-over']);
toast('حُذفت المحادثة بعد ٣ مخالفات ⛔','err');
}else toast('حُجبت رسالتك ('+v.why+') — التواصل خارج ضمين ممنوع ⚠️','err');
ochatRefresh();render();return;
}
g.chat.push({r,t:txt,at:Date.now()});
const other=r==='customer'?ST(g.store).owner:o.customer;
if(other)pushNotif(other,'💬','رسالة جديدة في طلب #'+ar(o.id),(r==='customer'?(USERS[o.customer]?USERS[o.customer].name.split(' ')[0]:'العميل'):ST(g.store).name)+' راسلك بخصوص طلبك',['orders']);
$('#omsg').value='';ochatRefresh();
}

/* openRate (السطر ١٦٨٧) + oStarPick (١٦٩٥) + submitOrderRate (١٦٩٦) */
export function openRate(oid,gi){setORATE({stars:0,oid,gi});
openModal(<RateModal/>,undefined);}
function RateModal(){
return <>
<div className="mhead"><b>⭐ التقييم والتحرير الفوري</b><button className="x" onClick={()=>closeModal()}>✕</button></div>
<div className="mbody">
<p className="hint mb">تقييمك يحرر المبلغ للتاجر فوراً ويمنحك <b>+١٠ نقاط</b> إضافية — يمكنك أيضاً الانتظار حتى تنتهي نافذة الحماية تلقائياً.</p>
<div className="starin" id="ostars">{[1,2,3,4,5].map(i=><span key={i} onClick={()=>oStarPick(i)}>★</span>)}</div>
<textarea className="inp" id="ortxt" placeholder="كيف كانت تجربتك مع المنتج والتغليف والسرعة؟" style={{minHeight:'74px',margin:'10px 0'}}></textarea>
<button className="btn amb wide" onClick={()=>submitOrderRate()}>🚀 أرسل التقييم وحرر المبلغ</button>
</div>
</>;
}
export function oStarPick(n){ORATE.stars=n;document.querySelectorAll('#ostars span').forEach((s,i)=>s.classList.toggle('on',i<n))}
export function submitOrderRate(){
if(!ORATE.stars){toast('اختر النجوم أولاً','err');return}
const o=DB.orders.find(x=>x.id===ORATE.oid) as any;const g=o.groups[ORATE.gi];
g.rated={stars:ORATE.stars,txt:($('#ortxt').value||'').trim()};
doRelease(o,g,'تقييم العميل',true);
closeModal();toast('شكراً! حُرر المبلغ للتاجر وكسبت نقاطك ⭐','ok');render();
}

/* doRelease (السطر ١٧٠٤) — محرك ضمين: توزيع صافٍ/عمولة/لوجستيات/نقاط حرفياً */
export function doRelease(o,g,by,bonus?){
if(g.status!=='received')return;
g.status='released';g.releasedAt=Date.now();g.releasedBy=by;
const comm=r2(g.items.reduce((a,it)=>{const pd=P(it.pid) as any;return a+it.price*it.qty*catComm(ST(g.store).sec,pd?pd.cat:'')/100},0));
const sh=g.ship||{mode:'std',cost:(g.dl||0),charge:(g.dl||0),subsidy:0,source:'customer'};
const mShip=sh.source==='merchant'?r2(sh.subsidy||0):0;
const ptsShip=sh.source==='pts'?r2(sh.cost||0):0;
let net=r2(g.sub-comm-mShip);if(net<0)net=0;
DB.aRevenue=r2(DB.aRevenue+comm);
const rm=DB.revMonths[DB.revMonths.length-1];rm.v=r2(rm.v+comm);
DB.logiWallet=r2((DB.logiWallet||0)+(sh.charge||0)+mShip+ptsShip);
if(ptsShip)DB.aPtsWallet=r2((DB.aPtsWallet||0)-ptsShip);
DB.storeWallets[g.store]=r2((DB.storeWallets[g.store]||0)+net);
g.payout={sub:g.sub,comm,net,ship:{charge:sh.charge||0,merchant:mShip,pts:ptsShip}};
const u=USERS[o.customer] as any;
const giftPts=g.items.reduce((a,it)=>{const pd=P(it.pid) as any;return a+((pd&&pd.pts)||0)*it.qty},0);
const pts=Math.floor(net/10)+(bonus?10:0);
if(u){u.pts=(u.pts||0)+pts+giftPts;
u.ptsLog.unshift({t:'تحرير طلب #'+o.id+(bonus?' + مكافأة تقييم':''),v:pts,at:Date.now()});
if(giftPts)u.ptsLog.unshift({t:'نقاط هدية على منتجات الطلب #'+o.id,v:giftPts,at:Date.now()})}
pushNotif(o.customer,'🔓','تم تحرير مبلغ طلبك','صافي '+money(net)+' حُوِّل إلى '+ST(g.store).name+' — كسبت '+ar(pts)+' نقطة ولاء',['orders']);
const own=ST(g.store).owner;if(own)pushNotif(own,'💰','تحرير دفعة جديدة','استلمت '+money(net)+' صافي الطلب #'+ar(o.id)+' (عمولة ضمين '+money(comm)+(mShip?' + دعمك للشحن '+money(mShip):'')+')',['m-wallet']);
}

/* doRefund (السطر ١٧٢٧) */
export function doRefund(o,g,by){
g.status='refunded';g.refundedAt=Date.now();g.refundedBy=by;
const back=r2(g.sub+((g.ship&&g.ship.charge)||(g.dl||0)));
const u=USERS[o.customer] as any;if(u){u.bal=r2((u.bal||0)+back)}
pushNotif(o.customer,'💸','استُرجع مبلغ طلبك','أُعيد '+money(back)+' إلى محفظة ضمين الخاصة بك (المنتجات + الشحن)',['account']);
const own=ST(g.store).owner;if(own)pushNotif(own,'↩️','استرجاع مبلغ شحنة','حكم التحكيم لطلب #'+ar(o.id)+': استرجاع كامل المبلغ للعميل',['m-disputes']);
impRefund(o,g);
}

/* openComplaint (السطر ١٧٤٧) — إسناد COMP الكلي عبر المطاوعة ثم إكمال الحقول كما في الأصل */
export function openComplaint(oid,gi){
setCOMP({sub:'damaged',img:null});(COMP as any).oid=oid;(COMP as any).gi=gi;
openModal(<CompModal/>,undefined);
}
function CompModal(){
return <>
<div className="mhead"><b>⚠️ فتح نزاع على الشحنة</b><button className="x" onClick={()=>closeModal()}>✕</button></div>
<div className="mbody" id="compbody"><CompBody/></div>
</>;
}

/* compBody (السطر ١٧٥١) → CompBody — تقرأ useUI('compbody') وتعيد بناء محتواها
 * بمفتاح النبضة (بديل compRefresh: إعادة بناء #compbody) */
export function CompBody(){
const t=useUI('compbody');
return <Fragment key={t}>
<div className="demo mb"><b style={{fontSize:'12.5px'}}>🛡️ لا تقلق — مبلغك ما زال محجوزاً</b>
<p className="hint" style={{marginTop:'2px'}}>افتح النزاع خلال نافذة الحماية وسيبقى المبلغ معلقاً حتى تصدر الإدارة حكمها بدردشة ثلاثية الأطراف.</p></div>
<div className="fld"><label>سبب النزاع</label>
<select className="inp" defaultValue={COMP.sub} onChange={e=>{COMP.sub=e.target.value;(COMP as any).img=null;compRefresh()}}>
{Object.entries(COMPS).map(([k,v])=><option key={k} value={k}>{v}</option>)}
</select></div>
<div className="mt" id="compx">{compExtra()}</div>
<div className="spread mt">
<button className="btn gray sm" onClick={()=>closeModal()}>إلغاء</button>
<button className="btn red" onClick={()=>submitComplaint()}>⚖️ افتح النزاع</button>
</div>
</Fragment>;
}

/* compExtra (السطر ١٧٦٣) */
export function compExtra(){
if(COMP.sub==='damaged')return <>
<div className="fld"><label>صف الضرر بدقة</label><textarea className="inp" id="cp-txt" style={{minHeight:'64px'}} placeholder="مثال: شد واضح عند الطرف الأيسر مع خيط مقطوع…"></textarea></div>
<div className="mt"><button className="btn soft sm" onClick={()=>pickCompImg()}>📎 إرفاق صورة الضرر (مطلوبة)</button>
{(COMP as any).img?<span className="tag red" style={{marginInlineStart:'6px'}}>✓ مرفقة</span>:<span className="hint"> — ستظهر كدليل في الدردشة</span>}</div>
</>;
if(COMP.sub==='notmatch')return <>
<div className="fgrid">
<div className="fld"><label>ماذا طلبت؟</label><input className="inp" id="cp-want" placeholder="مثال: بوكس أخضر زيتي"/></div>
<div className="fld"><label>ماذا وصلك؟</label><input className="inp" id="cp-got" placeholder="مثال: كحلي غامق"/></div>
</div>
<div className="fld mt"><label>تفاصيل إضافية</label><textarea className="inp" id="cp-txt" style={{minHeight:'54px'}}></textarea></div>
<div className="mt"><button className="btn soft sm" onClick={()=>pickCompImg()}>📎 إرفاق صورة للمقارنة (اختياري)</button>
{(COMP as any).img?<span className="tag red" style={{marginInlineStart:'6px'}}>✓ مرفقة</span>:null}</div>
</>;
return <>
<div className="fld"><label>اشرح ما حدث بدقة</label><textarea className="inp" id="cp-txt" style={{minHeight:'74px'}} placeholder="كل التفاصيل تساعد الإدارة على الحكم العادل…"></textarea></div>
<div className="mt"><button className="btn soft sm" onClick={()=>pickCompImg()}>📎 إرفاق صورة (اختياري)</button>
{(COMP as any).img?<span className="tag red" style={{marginInlineStart:'6px'}}>✓ مرفقة</span>:null}</div>
</>;
}

/* compRefresh (السطر ١٧٨١) — كانت تعيد بناء #compbody ⇒ الآن bumpUI('compbody') */
export function compRefresh(){bumpUI('compbody')}

/* pickCompImg (السطر ١٧٨٢) — عبر حقل #fup المخفي كما في الأصل حرفياً
 * (الوصول للخاصية بالقوس ['onchange'] = إسناد .onchange في الأصل نفسه: يستبدل أي معالج
 *  سابق ولا يكدّس المعالجات — نفس السلوك حرفياً) */
export function pickCompImg(){
$('#fup')['onchange']=e=>{const f=e.target.files[0];if(!f)return;
const rd=new FileReader();rd.onload=()=>{(COMP as any).img=rd.result;$('#fup').value='';compRefresh();toast('أُرفقت الصورة ✓','ok')};rd.readAsDataURL(f)};
$('#fup').click();
}

/* submitComplaint (السطر ١٧٨٧) */
export function submitComplaint(){
const o=DB.orders.find(x=>x.id===(COMP as any).oid) as any;const g=o.groups[(COMP as any).gi];
let txt='';
if(COMP.sub==='notmatch'){
const w=($('#cp-want')||{value:''}).value.trim(),gt=($('#cp-got')||{value:''}).value.trim();
if(!w||!gt){toast('أكمل حقلَي «ماذا طلبت / ماذا وصلك»','err');return}
txt='طلبت: '+w+' — لكن وصلني: '+gt+'. '+(($('#cp-txt')||{value:''}).value.trim());
}else{
txt=($('#cp-txt')||{value:''}).value.trim();
if(!txt){toast('اكتب شرحاً للسبب أولاً','err');return}
}
if(COMP.sub==='damaged'&&!(COMP as any).img){toast('إرفاق صورة الضرر إلزامي لهذا السبب','err');return}
const d={id:'d'+(DB.disputes.length+10),order:o.id,store:g.store,customer:SES.phone,subject:COMPS[COMP.sub],openedAt:Date.now(),status:'open',ruling:null,
messages:[{r:'sys',t:'فتح العميل نزاعاً على الطلب #'+ar(o.id)+' ('+ST(g.store).name+') بسبب: '+COMPS[COMP.sub],at:Date.now()},
{r:'customer',t:txt,at:Date.now()+1000,img:(COMP as any).img||undefined}]} as any;
DB.disputes.unshift(d);
g.status='disputed';
const own=ST(g.store).owner;
if(own)pushNotif(own,'⚖️','نزاع جديد على طلبك','فتح العميل نزاعاً بسبب: '+COMPS[COMP.sub],['m-disputes']);
pushNotif('0500000003','⚖️','نزاع جديد بانتظار التحكيم',ST(g.store).name+' · '+COMPS[COMP.sub],['a-disputes']);
pushNotif('0500000013','⚖️','نزاع جديد بانتظار التحكيم',ST(g.store).name+' · '+COMPS[COMP.sub],['e-disputes']);
toast('فُتح النزاع — المبلغ معلق حتى الحكم ⚖️','ok');
closeModal();render();openDispute(d.id);
}
