'use client';
/* ضمين — pages/admin.tsx
 * مركز الإدارة (a-hub) + مركز الموظف (e-hub) + صفحة المتاجر وطلبات التسجيل (a-stores/e-stores)
 * + التحكيم (a-disputes/e-disputes) + الأقسام (a-cats) + الإيرادات (a-rev) —
 * منقول حرفياً من dameen.js (السطور ٢٧٠٥-٣٠٧٧): نفس العناصر والفئات والنصوص والأرقام،
 * والمعالجات تصبح خصائص React — بلا أي تغيير في التصميم.
 * ملاحظة: ASTT=t في الأصل (سطر ٢٧٤٢) لا يمكن تنفيذه — روابط الاستيراد للقراءة فقط
 * ولا توجد مطاوعة setASTT في store.ts (انظر التقرير).
 */
import { $, ar, ard, money, r2, dt, ago, toast, SEC, ST, SECTIONS, CATS, PRODUCTS, STORES, USERS, DB, MED, medOf, ptsVal, fdPts, IMP } from '../core';
import { VIEW, REJ, CATDEL, me, render, pushNotif, openModal, closeModal, appSave, setREJ, setCATDEL, go as _go } from '../store';
import { AcouponCard } from './merchant2';
import { OpenDispute } from './disputes';
import { openOChat } from './orders';
import { heldFor } from './merchant1';

/* go الأصلية تُستدعى بوسيط واحد في مواضع عدة هنا — alias بنفس الدالة بلا أي تغيير سلوكي */
const go = _go as (page: string, arg?: any) => void;

/* ================= 🛡️ مركز إدارة ضمين (السطر ٢٧٠٥) ================= */
export function PgAHub(){
return <>
<div className="pghead"><h1>🛡️ مركز إدارة ضمين</h1><span className="tag nvy">المشرف العام</span></div>
<PgAOver/>
</>;
}
/* ================= 🧑‍💼 لوحة موظفي الإدارة (السطر ٢٧١٠) ================= */
export function PgEHub(){
const open=DB.disputes.filter(d=>d.status==='open');
const done=DB.disputes.filter(d=>d.status==='resolved');
const pends=DB.reqs.filter(r=>r.status==='pending');
const susp=STORES.filter(s=>s.susp).length;
const st=me();
return <>
<div className="pghead"><h1>🧑‍💼 مركز موظف الإدارة</h1><span className="tag amb">{st.staffTitle||'مشرف متاجر ونزاعات'}</span></div>
<div className="kpis">
<div className="kpi amb" style={{cursor:'pointer'}} onClick={()=>go('e-reqs')}><i>📋</i><b>{ar(pends.length)}</b><span>طلبات تسجيل بانتظار البت</span></div>
<div className="kpi" style={{cursor:'pointer'}} onClick={()=>go('e-stores')}><i>🏪</i><b>{ar(STORES.length)}</b><span>متجر في ضمين — {ar(susp)} موقوف</span></div>
<div className="kpi red" style={{cursor:'pointer'}} onClick={()=>go('e-disputes')}><i>⚖️</i><b>{ar(open.length)}</b><span>نزاعات مفتوحة بانتظار الحكم</span></div>
<div className="kpi grn"><i>📁</i><b>{ar(done.length)}</b><span>أحكام تحكيم صادرة</span></div>
</div>
<div className="grid2 mt">
<div className="acard"><h3>🏪 قسم المتاجر</h3>
<p className="hint mb" style={{lineHeight:'1.8'}}>اعتماد طلبات تسجيل المتاجر الجديدة وفتحها فوراً، وإدارة المتاجر القائمة وإيقاف المخالف منها، وضبط حدود الوسائط الترويجية لكل متجر — نفس صفحة المتاجر في مركز الإدارة تماماً.</p>
<div className="rows">
<div className="row" style={{cursor:'pointer'}} onClick={()=>go('e-reqs')}><div className="fx" style={{fontSize:'13px'}}>📋 طلبات بانتظار البت</div><span className={'tag '+(pends.length?'amb':'grn')}>{ar(pends.length)} طلب</span></div>
<div className="row" style={{cursor:'pointer'}} onClick={()=>go('e-stores')}><div className="fx" style={{fontSize:'13px'}}>🏪 متاجر عاملة</div><span className="tag grn">{ar(STORES.length-susp)} متجر</span></div>
<div className="row" style={{cursor:'pointer'}} onClick={()=>go('e-stores','stores')}><div className="fx" style={{fontSize:'13px'}}>⛔ متاجر موقوفة</div><span className={'tag '+(susp?'red':'grn')}>{ar(susp)} متجر</span></div>
</div>
<button className="btn soft wide mt" onClick={()=>go('e-stores')}>فتح قسم المتاجر ←</button></div>
<div className="acard"><h3>⚖️ قسم النزاعات</h3>
<p className="hint mb" style={{lineHeight:'1.8'}}>قضايا التحكيم الثلاثي بدردشة الأطراف وأدلة الصور — اقرأ الحجج وأصدر حكمك بتسبيب يظهر للعميل والتاجر وينفّذ تلقائياً على المبلغ المحجوز — نفس صفحة التحكيم في مركز الإدارة تماماً.</p>
{open.length?open.map(d=><div className="row" style={{cursor:'pointer'}} onClick={()=>OpenDispute(d.id)} key={d.id}><div style={{flex:'1',minWidth:'0'}}><b style={{fontSize:'12.5px'}}>{d.subject}</b><div className="hint">{ST(d.store).name} · طلب #{ar(d.order)} · {ago(d.openedAt)}</div></div><span className="tag red">يحتاج حكماً</span></div>):<div className="hint mb">لا نزاعات معلقة حالياً — كل شيء تحت السيطرة 🕊️</div>}
<button className="btn soft wide mt" onClick={()=>go('e-disputes')}>فتح قسم النزاعات ←</button></div>
</div>
<div className="acard mt"><h3>🤝 تكامل لحظي مع الإدارة العليا</h3>
<p className="hint" style={{lineHeight:'1.9'}}>أنت معتمد ضمن فريق موظفي ضمين — كل موافقة تُصدرها على متجر وكل حكم تصدره يظهر مباشرة في مركز الإدارة العليا والعكس صحيح، لأنكم تعملون على قاعدة بيانات واحدة تتحدّث لحظياً. صلاحياتك: اعتماد المتاجر وإدارتها وضبط حدود وسائطها، والبت في النزاعات — أما الأقسام والعمولات والإيرادات المالية فتبقى لمركز الإدارة العليا.</p></div>
</>;
}
/* ================= صفحة المتاجر المستقلة (السطر ٢٧٤١) ================= */
export function PgAStoresPage(){
const t=['reqs','stores','media'].includes((VIEW as any).atab)?(VIEW as any).atab:'stores';
/* الأصل: ASTT=t; — إسناد رابط الاستيراد ممنوع في ESM ولا توجد مطاوعة setASTT في store */
const pends=DB.reqs.filter(r=>r.status==='pending').length;
const tab=(k,l,n?)=><button className={t===k?'on':''} onClick={()=>astTab(k)}>{l}{n?' ('+ar(n)+')':null}</button>;
return <>
<div className="pghead"><h1>🏪 المتاجر</h1><span className="tag nvy">طلبات التسجيل وإدارة المتاجر</span></div>
<div className="tabs" style={{marginTop:'8px'}}>{tab('reqs','📋 طلبات التسجيل',pends)}{tab('stores','🏪 جميع المتاجر',STORES.length)}{tab('media','🎛️ حدود الوسائط')}</div>
{t==='reqs'?<PgAReqs/>:t==='media'?<PgAMedia/>:<PgAStores/>}
</>;
}
export function astTab(t){(VIEW as any).atab=t;render()}
const vaultNow=()=>r2(DB.orders.reduce((a,o)=>a+o.groups.filter(g=>['pending','preparing','shipped','received','disputed'].includes(g.status)).reduce((x,g:any)=>x+g.sub+((g.ship&&g.ship.charge)||(g.dl||0)),0),0));
/* ================= نظرة عامة على الإدارة (السطر ٢٧٥١) ================= */
export function PgAOver(){
const open=DB.disputes.filter(d=>d.status==='open');
const chats=[];DB.orders.forEach(o=>o.groups.forEach((g:any,gi)=>{if(g.chat&&g.chat.length)chats.push({o,g,gi})}));
chats.sort((a,b)=>(((b.g.chat||[]).slice(-1)[0]||{}).at||0)-(((a.g.chat||[]).slice(-1)[0]||{}).at||0));
const vTot=DB.orders.reduce((a,o)=>a+o.groups.reduce((x,g:any)=>x+(g.viol?g.viol.customer+g.viol.merchant:0),0),0);
const releasedTotal=DB.orders.reduce((a,o)=>a+o.groups.reduce((x,g:any)=>x+(g.payout?g.payout.sub:0),0),0);
const pends=DB.reqs.filter(r=>r.status==='pending');
return <>
<div className="kpis">
<div className="kpi grn"><i>🧾</i><b>{money(DB.aRevenue)}</b><span>إجمالي عمولات ضمين (حسب التصنيف)</span></div>
<div className="kpi amb"><i>🔒</i><b>{money(vaultNow())}</b><span>مبالغ محجوزة حالياً</span></div>
<div className="kpi nvy"><i>🔓</i><b>{money(releasedTotal)}</b><span>إجمالي الشحنات المحررة</span></div>
<div className="kpi red"><i>⚖️</i><b>{ar(open.length)}</b><span>نزاعات بانتظار حكمك</span></div>
<div className="kpi" style={{cursor:'pointer'}} onClick={()=>go('a-stores')}><i>🏪</i><b>{ar(STORES.length)}</b><span>متجر في ضمين</span></div>
<div className="kpi"><i>👥</i><b>{ar(Object.keys(USERS).length)}</b><span>مستخدم مسجل</span></div>
<div className="kpi" style={{cursor:'pointer'}} onClick={()=>go('a-stores','media')}><i>🌟</i><b>{money(IMP.total)}</b><span>أثر مجتمعي شفاف (من أرباح ضمين)</span></div>
</div>
<div className="grid2 mt">
<div className="acard"><h3>⚖️ طابور التحكيم</h3>
{open.length?open.map(d=><div className="row" style={{cursor:'pointer'}} onClick={()=>OpenDispute(d.id)} key={d.id}>
<div style={{flex:'1'}}><b>{d.subject}</b><div className="hint">{ST(d.store).name} · طلب #{ar(d.order)} · {ago(d.openedAt)}</div></div>
<span className="tag red">يحتاج حكماً</span></div>):<div className="hint mb">لا نزاعات معلقة — كل شيء تحت السيطرة 🕊️</div>}
<button className="btn soft wide" onClick={()=>go('a-disputes')}>كل النزاعات ←</button></div>
<div className="acard"><h3>🏪 المتاجر وطلبات التسجيل</h3>
<div className="rows">
<div className="row"><div className="fx" style={{fontSize:'13px'}}>🏪 متاجر ضمين</div><span className={'tag '+(STORES.filter(s=>s.susp).length?'amb':'grn')}>{ar(STORES.length)} متجر · {ar(STORES.filter(s=>s.susp).length)} موقوف</span></div>
<div className="row"><div className="fx" style={{fontSize:'13px'}}>📋 طلبات تسجيل بانتظار البت</div><span className={'tag '+(pends.length?'amb':'grn')}>{ar(pends.length)} طلب</span></div>
</div>
<button className="btn soft wide mt" onClick={()=>go('a-stores')}>فتح صفحة المتاجر وطلبات التسجيل ←</button>{' '}
<button className="btn soft wide mt" onClick={()=>go('a-stores','media')}>🎛️ حدود الوسائط الترويجية للمتاجر ←</button>
</div></div>
<div className="acard mt"><h3>💬 مراقبة محادثات الطلبات {vTot?<span className="tag red">{ar(vTot)} مخالفة محجوبة</span>:<span className="tag grn">بلا مخالفات</span>}</h3>
<p className="hint mb">محادثات العميل × التاجر مرتبطة بالطلب — تُحجب الأرقام والروابط ووسائل التواصل الخارجية تلقائياً، وتُحذف المحادثة بعد ٣ مخالفات مع تنبيه فوري للإدارة.</p>
<div className="rows">{chats.slice(0,5).length?chats.slice(0,5).map(({o,g,gi})=>{const last=[...(g.chat||[])].reverse().find(m=>m.r!=='sys');
const ltxt=last?(last.loc?('📍 '+last.loc.txt):(last.payreq?('💰 طلب مبلغ إضافي بـ'+money(last.payreq.amt)):String(last.t))):'';
return <div className="row" style={{cursor:'pointer'}} onClick={()=>openOChat(o.id,gi)} key={o.id+'-'+gi}>
<div style={{flex:'1',minWidth:'0'}}><b>طلب #{ar(o.id)} · {ST(g.store).name} × {USERS[o.customer]?USERS[o.customer].name.split(' ')[0]:'عميل'}</b>
<div className="hint">{last?ltxt.slice(0,60)+(ltxt.length>60?'…':''):'—'} · {ar((g.chat||[]).length)} رسالة{g.chatDeleted?' · ⛔ محذوفة لمخالفة':g.chatArchived?' · 🗄️ مؤرشفة':null}</div></div>
{(g.viol&&(g.viol.customer+g.viol.merchant))?<span className="tag red">{ar(g.viol.customer+g.viol.merchant)} 🚫</span>:<span className="tag grn">سليمة</span>}</div>}):<div className="hint">لا محادثات طلبات بعد</div>}</div></div>
</>;
}
/* ================= ⚖️ التحكيم (السطر ٢٧٩٠) ================= */
export function PgADisputes(){
const open=DB.disputes.filter(d=>d.status==='open');
const done=DB.disputes.filter(d=>d.status==='resolved');
return <>
<div className="pghead"><h1>⚖️ التحكيم</h1><span className={'tag '+(open.length?'red':'grn')}>{ar(open.length)} مفتوح · {ar(done.length)} محسوم</span></div>
<b className="fx" style={{fontSize:'14px',color:'var(--red)'}}>⏳ بانتظار الحكم — افتح الدردشة واطّلع على أدلة الطرفين</b>
{open.length?open.map(d=>{const o=DB.orders.find(x=>x.id===d.order);const g=o.groups.find(x=>x.store===d.store);
return <div className="ocard" style={{borderInlineStart:'4px solid var(--red)'}} key={d.id}>
<div className="spread" style={{flexWrap:'wrap'}}>
<div><b className="fx" style={{fontSize:'13.5px'}}>{d.subject}</b>
<div className="hint">{USERS[d.customer]?USERS[d.customer].name:'عميل'} × {ST(d.store).name} · طلب #{ar(d.order)} · {money(g.sub)} معلقة</div></div>
<span className="tag red">مبلغ معلق {money(g.sub)}</span></div>
<button className="btn red sm mt" onClick={()=>OpenDispute(d.id)}>🛡️ فتح القضية وإصدار الحكم</button></div>}):<div className="empty" style={{padding:'26px'}}><div className="em">🕊️</div><b>لا قضايا مفتوحة</b></div>}
<div className="hr" style={{margin:'20px 0'}}></div>
<b className="fx" style={{fontSize:'14px',color:'var(--grn)'}}>📁 أحكام صادرة</b>
{done.length?done.map(d=><div className="ocard" style={{borderInlineStart:'4px solid var(--grn)'}} key={d.id}>
<div className="spread" style={{flexWrap:'wrap'}}>
<div><b className="fx" style={{fontSize:'13px'}}>{d.subject} — طلب #{ar(d.order)}</b>
<div className="hint">{d.ruling.act==='release'?'إفراج للتاجر':'استرجاع للعميل'} · {dt(d.ruling.at)}</div></div>
<button className="btn gray xs" onClick={()=>OpenDispute(d.id)}>عرض الملف</button></div>
<div className={'verd '+(d.ruling.act==='release'?'rel':'ref')} style={{margin:'8px 0 0'}}><h4>التسبيب</h4><div className="why">{d.ruling.text}</div></div></div>):<div className="hint mt">لا أحكام سابقة</div>}
</>;
}
/* ================= 🏪 جميع المتاجر (السطر ٢٨١١) ================= */
export function PgAStores(){
return <>
<div className="spread" style={{margin:'2px 0 12px'}}><b className="fx" style={{fontSize:'14.5px'}}>🏪 إدارة المتاجر</b><span className="tag gry">{ar(STORES.length)} متجر مسجل</span></div>
<div className="acard"><div className="rows">
{STORES.map(s=><div className="row" key={s.id}>
<div style={{width:'44px',height:'44px',borderRadius:'13px',background:s.color,color:'#fff',display:'grid',placeItems:'center',fontFamily:'Alexandria',fontWeight:800,flexShrink:0}}>{s.name[0]}</div>
<div style={{flex:'1',minWidth:'0'}}><b>{s.name}</b>
<div className="hint">{SEC(s.sec).name} · {USERS[s.owner]?USERS[s.owner].name:'—'} · ★ {ard(s.rt)} · {ar(s.sales)} عملية</div></div>
<div style={{display:'flex',gap:'6px',alignItems:'center',flexWrap:'wrap'}}>
<span className="fx" style={{fontSize:'12.5px',color:'var(--grn)'}}>{money(DB.storeWallets[s.id]||0)}</span>
{s.susp?<><span className="tag red">موقوف</span><button className="btn gray xs" onClick={()=>aSusp(s.id)}>إلغاء الإيقاف</button></>:<><span className="tag grn">يعمل</span><button className="btn red xs" onClick={()=>aSusp(s.id)}>إيقاف</button></>}
</div></div>)}
</div></div>
</>;
}
export function aSusp(sid){const s=ST(sid);s.susp=!s.susp;
pushNotif(s.owner,s.susp?'⛔':'✅',s.susp?'أُوقف متجرك مؤقتاً':'أُلغي إيقاف متجرك',s.susp?'راجع فريق الامتثال في ضمين':'عاد متجرك للعمل بشكل طبيعي',['m-set']);
toast(s.susp?'أُوقف المتجر مؤقتاً':'أُعيد تشغيل المتجر','ok');render()}
/* ===== 🎛️ حدود الوسائط الترويجية — تحددها الإدارة لكل متجر (السطر ٢٨٢٩) ===== */
export function PgAMedia(){
return <>
<div className="spread" style={{margin:'2px 0 12px'}}><b className="fx" style={{fontSize:'14.5px'}}>🎛️ حدود الوسائط الترويجية</b><span className="tag gry">تُطبَّق على منتجات كل متجر</span></div>
<p className="hint mb" style={{lineHeight:'1.8'}}>تحدد الإدارة لكل متجر عدد الصور الترويجية وعدد المقاطع المرئية وأقصى مدة لكل مقطع في كل منتج — يلتزم بها التاجر في نموذج إضافة وتعديل المنتجات، وتظهر الوسائط للعملاء داخل صفحة المتجر بشكل أنيق.</p>
<div className="acard"><h3>الحدود الافتراضية (لكل المتاجر)</h3>
<div className="fgrid">
<div className="fld"><label>🖼️ عدد الصور لكل منتج</label><input className="inp" id="amd-imgs" type="number" min="1" max="12" defaultValue={MED.imgs}/></div>
<div className="fld"><label>🎬 عدد المقاطع لكل منتج</label><input className="inp" id="amd-vids" type="number" min="0" max="4" defaultValue={MED.vids}/></div>
<div className="fld"><label>⏱️ أقصى مدة للمقطع (ثانية)</label><input className="inp" id="amd-secs" type="number" min="10" max="300" step="5" defaultValue={MED.secs}/></div>
</div>
<button className="btn sm mt" onClick={()=>aSaveMedDef()}>حفظ الحدود الافتراضية</button></div>
<div className="acard mt"><h3>حدود خاصة بكل متجر</h3>
<p className="hint mb">عدّل الأرقام ثم اضغط حفظ — المتجر الذي لا تعدّله يتبع الافتراضي، و«إلغاء الخاص» يعيده للافتراضي.</p>
<div className="rows">
{STORES.map(s=>{const m=medOf(s);const own=!!MED.stores[s.id];
return <div className="row" style={{flexWrap:'wrap',gap:'8px'}} key={s.id}>
<div style={{flex:'1',minWidth:'140px',display:'flex',gap:'9px',alignItems:'center'}}>
<div style={{width:'36px',height:'36px',borderRadius:'11px',background:s.color,color:'#fff',display:'grid',placeItems:'center',fontWeight:800,flexShrink:0}}>{s.name[0]}</div>
<div><b style={{fontSize:'12.5px'}}>{s.name}</b><div className="hint">{own?'حد خاص من الإدارة':'يتبع الافتراضي'}</div></div></div>
<div style={{display:'flex',gap:'6px',alignItems:'center',flexWrap:'wrap'}}>
<span className="hint">🖼️</span><input className="inp" style={{width:'62px',padding:'8px',textAlign:'center'}} id={'amd-i-'+s.id} type="number" min="1" max="12" defaultValue={m.imgs}/>
<span className="hint">🎬</span><input className="inp" style={{width:'62px',padding:'8px',textAlign:'center'}} id={'amd-v-'+s.id} type="number" min="0" max="4" defaultValue={m.vids}/>
<span className="hint">⏱️ث</span><input className="inp" style={{width:'70px',padding:'8px',textAlign:'center'}} id={'amd-s-'+s.id} type="number" min="10" max="300" step="5" defaultValue={m.secs}/>
{own?<button className="btn gray xs" onClick={()=>aMedReset(s.id)}>إلغاء الخاص</button>:null}
</div></div>})}
</div>
<button className="btn sm mt" onClick={()=>aSaveMedStores()}>حفظ حدود المتاجر</button></div>
</>;
}
const medClamp=(v,a,b,d)=>Math.max(a,Math.min(b,Math.round(+v)||d));
export function aSaveMedDef(){
MED.imgs=medClamp(($('#amd-imgs')||{}).value,1,12,6);
MED.vids=medClamp(($('#amd-vids')||{}).value,0,4,2);
MED.secs=medClamp(($('#amd-secs')||{}).value,10,300,60);
appSave();toast('حُفظت الحدود الافتراضية للوسائط لكل المتاجر ✓','ok');render();
}
export function aSaveMedStores(){
STORES.forEach(s=>{
const vi=$('#amd-v-'+s.id);if(!vi)return;
MED.stores[s.id]={imgs:medClamp(($('#amd-i-'+s.id)||{}).value,1,12,MED.imgs),vids:medClamp(vi.value,0,4,MED.vids),secs:medClamp(($('#amd-s-'+s.id)||{}).value,10,300,MED.secs)};
});
appSave();toast('حُفظت حدود الوسائط الخاصة بكل متجر ✓','ok');render();
}
export function aMedReset(sid){delete MED.stores[sid];appSave();toast('أُلغي الحد الخاص — المتجر يتبع الافتراضي الآن','ok');render()}
/* ================= 📋 طلبات التسجيل (السطر ٢٨٧١) ================= */
function PgAReqs(){
const pend=DB.reqs.filter(r=>r.status==='pending');
const done=DB.reqs.filter(r=>r.status!=='pending');
return <>
<div className="spread" style={{margin:'2px 0 12px'}}><b className="fx" style={{fontSize:'14.5px'}}>📋 طلبات التسجيل</b><span className={'tag '+(pend.length?'amb':'grn')}>{ar(pend.length)} بانتظار البت · {ar(done.length)} منتهي</span></div>
<p className="hint mb" style={{lineHeight:'1.8'}}>كل من يسجّل متجراً جديداً أو يطلب الانضمام لفريق الإدارة تظهر بياناته كاملة هنا — توافق فتفتح حسابه فوراً ويُبلَّغ، أو ترفض بسببٍ يظهر لصاحب الطلب. تسجيل الدخول موحّد للجميع (جوال أو بريد + كلمة مرور).</p>
{pend.length?pend.map(r=><ReqCard r={r} key={r.id}/>):<div className="empty"><div className="em">📭</div><b>لا طلبات معلقة</b><span>ستظهر هنا طلبات فتح المتاجر والانضمام للإدارة فور ورودها</span></div>}
{done.length?<><div className="hr" style={{margin:'20px 0 10px'}}></div><b className="fx" style={{fontSize:'13.5px'}}>📁 الطلبات المنتهية</b>
<div className="rows mt">{done.map((r:any)=><div className="row" style={{flexWrap:'wrap',gap:'6px'}} key={r.id}>
<div style={{flex:'1',minWidth:'170px'}}><b>{r.kind==='store'?'🏪 '+r.store:'🛡️ '+r.own}</b><div className="hint">{r.kind==='store'?r.own+' · '+SEC(r.sec).name:r.role||'فريق الإدارة'} · {ago(r.at)}</div></div>
<span className={'tag '+(r.status==='approved'?'grn':'red')}>{r.status==='approved'?'مقبول ✓':'مرفوض ✗'}</span>
{r.status==='rejected'&&r.why?<span className="hint">السبب: {r.why}</span>:null}
{r.status==='rejected'?<button className="btn gray xs" onClick={()=>aApproveReq(r.id)}>إعادة فتح وقبول</button>:null}
</div>)}</div></>:null}
</>;
}
/* بطاقة طلب تسجيل (السطر ٢٨٨٥) */
export function ReqCard({r}){
const isS=r.kind==='store';
return <div className="acard" style={{borderInlineStart:'4px solid '+(isS?SEC(r.sec).color:'var(--navy)')}}>
<div className="spread" style={{flexWrap:'wrap',gap:'8px'}}>
<div><b className="fx" style={{fontSize:'14px'}}>{isS?'🏪 '+r.store+' — طلب متجر جديد':'🛡️ '+r.own+' — طلب انضمام للإدارة'}</b>
<div className="hint">{r.own}{isS?' · '+SEC(r.sec).name:''} · وصل {ago(r.at)}</div></div>
<span className="tag amb">بانتظار الموافقة</span></div>
<div className="reqgrid">
{isS?<><div className="reqcell"><span>اسم المتجر</span><b>{r.store}</b></div>
<div className="reqcell"><span>العالم المختار</span><b style={{color:SEC(r.sec).color}}>{SEC(r.sec).icon} {SEC(r.sec).name}</b></div></>:<><div className="reqcell"><span>القسم الإشرافي المطلوب</span><b>{r.role||'—'}</b></div>
<div className="reqcell"><span>رمز الدعوة</span><b>{r.code||'—'} {r.code==='DMN-2026'?<span className="tag grn">سليم ✓</span>:<span className="tag red">غير صحيح</span>}</b></div></>}
<div className="reqcell"><span>الجوال (يستخدم للدخول)</span><b>{ar(r.phone)}</b></div>
<div className="reqcell"><span>البريد الإلكتروني</span><b>{r.email||'—'}</b></div>
{isS?<><div className="reqcell"><span>السجل التجاري / الوثيقة</span><b>{r.cr}{r.crDoc?<>{' '}<span className="tag grn">📎 {r.crDoc}</span></>:null}</b></div>
<div className="reqcell"><span>الآيبان (تحويل أرباح المتجر)</span><b>{r.iban}</b></div></>:<div className="reqcell" style={{gridColumn:'1/-1'}}><span>ملاحظة الأمان</span><b className="hint" style={{fontWeight:600}}>كلمة المرور محفوظة ولا تُعرض — تُفتح لك لوحة موظف الإدارة (المتاجر والنزاعات) بعد القبول، ويُبلَّغ صاحب الطلب بأي رفض مع سببه.</b></div>}
</div>
<div className="spread mt" style={{gap:'8px',flexWrap:'wrap'}}>
<button className="btn sm" onClick={()=>aApproveReq(r.id)}>✓ موافقة{isS?' وفتح المتجر':' وفتح الحساب'}</button>
<button className="btn red sm" onClick={()=>aRejectReq(r.id)}>✗ رفض الطلب</button></div></div>;
}
/* الموافقة على طلب (السطر ٢٩٠٥) */
export function aApproveReq(id){
const r:any=DB.reqs.find(x=>x.id===id);if(!r)return;
let passInfo='';
if(r.kind==='store'){
let n=STORES.length+1;while(ST('s'+n))n++;const sid='s'+n;
STORES.push({id:sid,name:r.store,sec:r.sec,owner:r.phone,color:SEC(r.sec).color,desc:'متجر جديد — بانتظار أول منتجاته وهويته',rt:0,sales:0,susp:false,open:true,city:'الرياض',dlMode:'customer',freeMin:0,iban:r.iban,cr:r.cr,crDoc:r.crDoc||''} as any);
DB.storeWallets[sid]=0;}
const u=USERS[r.phone];
if(u){u.pend=null;delete u.rejected;
if(r.kind==='store'){const st=STORES.find(x=>x.owner===r.phone);if(st)u.store=st.id}}
else{const st=STORES.find(x=>x.owner===r.phone);
USERS[r.phone]=r.kind==='store'
?{name:r.own,role:'merchant',pass:'1234',store:st?st.id:null,since:Date.now(),email:r.email||'',notif:{ord:true,dis:true}}
:{name:r.own,role:'staff',pass:'1234',since:Date.now(),email:r.email||'',staffTitle:r.role||'مشرف عام',notif:{dis:true}};
passInfo=' — كلمة المرور التجريبية 1234'}
r.status='approved';r.at2=Date.now();
pushNotif(r.phone,'🎉',r.kind==='store'?'اعتُمد متجرك وأصبح جاهزاً!':'مرحباً بك في فريق إدارة ضمين',r.kind==='store'?'«'+r.store+'» فُتح في '+SEC(r.sec).name+' — أضف منتجاتك من لوحة التاجر وابدأ البيع':'فُتحت لك صلاحيات لوحة الموظف (المتاجر والنزاعات) — سجّل دخولك بالجوال وكلمة المرور وابدأ',r.kind==='store'?['m-dash']:['e-hub']);
toast(r.kind==='store'?'اعتُمد المتجر وأُبلغ صاحبه ✓':'قُبل طلب الانضمام وأُبلغ صاحبه'+passInfo,'ok');render();
}
/* الرفض بسبب (السطر ٢٩٢٤) */
function RejModal({r}){
return <>
<div className="mhead"><b>✗ رفض طلب {r.kind==='store'?'المتجر «'+r.store+'»':'الإدارة — '+r.own}</b><button className="x" onClick={()=>closeModal()}>✕</button></div>
<div className="mbody">
<div className="fld"><label>سبب الرفض (يظهر لصاحب الطلب مع إشعار)</label><textarea className="inp" id="rj-why" style={{minHeight:'76px'}} placeholder="مثال: وثيقة السجل التجاري غير واضحة — أعد إرفاقها"></textarea></div>
<div className="spread mt"><button className="btn gray sm" onClick={()=>closeModal()}>تراجع</button><button className="btn red sm" onClick={()=>doRejectReq()}>تأكيد الرفض</button></div></div>
</>;
}
export function aRejectReq(id){
const r=DB.reqs.find(x=>x.id===id);if(!r)return;setREJ(r);
openModal(<RejModal r={r}/>,undefined);}
export function doRejectReq(){
if(!REJ)return;
const why=($('#rj-why').value||'').trim()||'لم يستوفِ الطلب شروط الاعتماد في ضمين';
REJ.status='rejected';REJ.why=why;REJ.at2=Date.now();
const u=USERS[REJ.phone];if(u){u.pend=null;u.rejected=why}
pushNotif(REJ.phone,'✗',REJ.kind==='store'?'رُفض طلب افتتاح متجرك':'رُفض طلب انضمامك للإدارة',why,null);
closeModal();toast('رُفض الطلب وأُبلغ صاحبه بالسبب','ok');render();
}
/* ================= 🗂️ الأقسام والتصنيفات (السطر ٢٩٣٩) ================= */
export function PgACats(){
return <>
<div className="pghead"><h1>🗂️ الأقسام والتصنيفات</h1><span className="tag grn">عمولة ضمين تُحدَّد لكل تصنيف</span></div>
<p className="hint mb" style={{lineHeight:'1.8'}}>أضف وعدّل واحذف تصنيفات العوالم الأربعة، وغيّر اسم أي قسم بزر ✏️، وحدد عمولة كل تصنيف بنفسك — تُطبَّق العمولة لحظة تحرير أي شحنة على منتجات ذلك التصنيف، وتُحسم من التاجر فقط ولا تُضاف على العميل أبداً.</p>
<div className="grid2">
{SECTIONS.map(sec=><div className="acard" style={{borderTop:'3px solid '+sec.color}} key={sec.id}>
<div className="spread"><h3 style={{color:sec.color}}>{sec.icon} {sec.name}</h3><div style={{display:'flex',gap:'6px',alignItems:'center',flexWrap:'wrap'}}><span className="tag" style={{background:sec.color+'18',color:sec.color}}>{ar(CATS[sec.id].length)} تصنيف</span><button className="btn gray xs" onClick={()=>secRename(sec.id)}>✏️ تغيير الاسم</button></div></div>
<div className="rows mt">
{CATS[sec.id].map((c,i)=>{const pc=PRODUCTS.filter(p=>{const s=ST(p.store);return s&&s.sec===sec.id&&p.cat===c.n}).length;
return <div className="row" style={{flexWrap:'wrap',gap:'6px'}} key={sec.id+'-'+i}>
<div style={{flex:'1',minWidth:'120px'}}><input className="inp" style={{padding:'7px 10px',fontSize:'12px'}} id={'cn-'+sec.id+'-'+i} defaultValue={c.n}/></div>
<div style={{display:'flex',alignItems:'center',gap:'5px'}}><span className="hint" style={{whiteSpace:'nowrap',fontWeight:700}}>عمولة</span>
<input className="inp" style={{width:'72px',padding:'7px 6px',fontSize:'12px',textAlign:'center'}} type="number" min="0" max="20" step="0.25" id={'cc-'+sec.id+'-'+i} defaultValue={c.comm}/><span className="hint">٪</span></div>
<div style={{display:'flex',gap:'5px',alignItems:'center',flexWrap:'wrap'}}>
<span className={'tag '+(pc?'grn':'')} style={pc?null:{background:'#0000000a',color:'var(--mut)'}}>{ar(pc)} منتج</span>
<button className="btn sm" title="حفظ التعديلات" onClick={()=>catSave(sec.id,i)}>💾</button>
<button className={'btn '+(CATDEL===sec.id+'-'+i?'red':'gray')+' xs'} onClick={()=>catDel(sec.id,i)}>{CATDEL===sec.id+'-'+i?'متأكد؟':'🗑'}</button></div></div>})}
</div>
<div style={{display:'grid',gridTemplateColumns:'1.7fr .7fr auto',gap:'7px',alignItems:'end',marginTop:'11px'}}>
<div className="fld"><label>تصنيف جديد</label><input className="inp" style={{padding:'8px 10px',fontSize:'12px'}} id={'nc-'+sec.id} placeholder="اسم التصنيف"/></div>
<div className="fld"><label>عمولته ٪</label><input className="inp" style={{padding:'8px 6px',fontSize:'12px',textAlign:'center'}} type="number" min="0" max="20" step="0.25" id={'ncc-'+sec.id} defaultValue="2.5"/></div>
<button className="btn soft sm" onClick={()=>catAdd(sec.id)}>＋ إضافة</button>
</div>
</div>)}
</div>
</>;
}
export function catSave(sec,i){
const c=CATS[sec][i];
const nm=($('#cn-'+sec+'-'+i).value||'').trim();
const cm=+($('#cc-'+sec+'-'+i).value||0);
if(nm.length<2){toast('اسم التصنيف قصير','err');return}
if(!(cm>=0&&cm<=20)){toast('العمولة يجب أن تكون بين ٠ و ٢٠٪','err');return}
if(CATS[sec].some((x,j)=>j!==i&&x.n===nm)){toast('يوجد تصنيف بنفس الاسم في هذا العالم','err');return}
if(nm!==c.n){PRODUCTS.forEach(p=>{const s=ST(p.store);if(s&&s.sec===sec&&p.cat===c.n)p.cat=nm});c.n=nm}
c.comm=+cm.toFixed(2);setCATDEL(null);
toast('حُفظ التصنيف «'+nm+'» — عمولته '+ard(c.comm)+'٪ ✓','ok');render();
}
export function catDel(sec,i){
if(CATDEL!==sec+'-'+i){setCATDEL(sec+'-'+i);render();toast('اضغط «متأكد؟» مرة أخرى لحذف التصنيف','amb');return}
const c=CATS[sec][i];setCATDEL(null);
const pc=PRODUCTS.filter(p=>{const s=ST(p.store);return s&&s.sec===sec&&p.cat===c.n}).length;
if(pc){toast('لا يمكن الحذف — انقل منتجاته ('+ar(pc)+') لتصنيف آخر أولاً','err');render();return}
CATS[sec].splice(i,1);toast('حُذف التصنيف «'+c.n+'» ✓','ok');render();
}
export function catAdd(sec){
const nm=($('#nc-'+sec).value||'').trim();
const cm=+($('#ncc-'+sec).value||0);
if(nm.length<2){toast('اكتب اسم التصنيف','err');return}
if(!(cm>=0&&cm<=20)){toast('العمولة يجب أن تكون بين ٠ و ٢٠٪','err');return}
if(CATS[sec].some(x=>x.n===nm)){toast('التصنيف موجود مسبقاً في هذا العالم','err');return}
CATS[sec].push({n:nm,comm:+cm.toFixed(2)});
toast('أُضيف التصنيف «'+nm+'» بعمولة '+ard(cm)+'٪ ✓','ok');render();
}
/* تغيير اسم القسم (العالم) — يُطبَّق فوراً في كل ضمين (السطر ٢٩٩٢) */
function SecRenameModal({sec,sid}){
return <>
<div className="mhead"><b>✏️ تغيير اسم القسم</b><button className="x" onClick={()=>closeModal()}>✕</button></div>
<div className="mbody">
<div className="demo mb"><b style={{fontSize:'12px'}}>الاسم الجديد يُطبَّق فوراً في كل ضمين</b>
<p className="hint" style={{marginTop:'3px'}}>القائمة العلوية، بطاقات الرئيسية، صفحات القسم، اختيار عالم التاجر الجديد، وبطاقات الطلبات — كلها تقرأ الاسم من هنا.</p></div>
<div className="fld"><label>اسم القسم</label><input className="inp" id="sn-nm" defaultValue={sec.name}/></div>
<div className="fld mt"><label>الوصف المختصر (يظهر تحت الاسم)</label><input className="inp" id="sn-ds" defaultValue={sec.desc}/></div>
<div className="spread mt"><button className="btn gray sm" onClick={()=>closeModal()}>تراجع</button><button className="btn" onClick={()=>secSaveName(sid)}>حفظ الاسم</button></div></div>
</>;
}
export function secRename(sid){
const sec=SEC(sid);
openModal(<SecRenameModal sec={sec} sid={sid}/>,undefined);
}
export function secSaveName(sid){
const sec=SEC(sid);
const nm=($('#sn-nm').value||'').trim(),ds=($('#sn-ds').value||'').trim();
if(nm.length<4){toast('اسم القسم قصير جداً (٤ أحرف فأكثر)','err');return}
const old=sec.name;
sec.name=nm;if(ds)sec.desc=ds;
closeModal();toast('حُفظ اسم القسم: «'+old+'» ← «'+nm+'» ✓','ok');render();
}
/* ================= 📈 إيرادات ضمين (السطر ٣٠١٠) ================= */
export function PgARev(){
const mx=Math.max(...DB.revMonths.map(m=>m.v));
let gmv=0,relSub=0,relNet=0,relComm=0,shipC=0,shipM=0,shipP=0,refunds=0;
DB.orders.forEach(o=>o.groups.forEach((g:any)=>{
const ch=(g.ship&&g.ship.charge)||(g.dl||0);
gmv+=g.sub+ch;
if(g.status==='refunded')refunds+=g.sub+ch;
if(g.payout&&g.status==='released'){relSub+=g.payout.sub;relNet+=g.payout.net;relComm+=g.payout.comm;
if(g.payout.ship){shipC+=g.payout.ship.charge||0;shipM+=g.payout.ship.merchant||0;shipP+=g.payout.ship.pts||0}}}));
const held=vaultNow();
const otpHeld=r2(DB.orders.reduce((a,o)=>a+o.groups.filter((g:any)=>g.ship&&g.ship.mode==='field'&&g.status==='shipped').reduce((x,g)=>x+g.sub,0),0));
const storesBal=r2(Object.values(DB.storeWallets).reduce((a:any,b:any)=>a+b,0));
const ptsLiab=r2((Object.values(USERS).reduce((a:any,u:any)=>a+(u.pts||0),0) as any)*ptsVal());
const custBal=r2(Object.values(USERS).reduce((a:any,u:any)=>a+(u.bal||0),0));
const relFlow=r2(relSub+shipC);
const fr=[
['🛒 إجمالي قيمة الطلبات في المنصة (منتجات + شحن دفعه العملاء)',money(gmv)],
['🔒 المحجوز في خزنة الضمان الآن (حماية المشترين)',money(held)],
['🎪 مستحقات خدمات ميدانية معلقة بانتظار كود تأكيد العميل (OTP)',money(otpHeld)],
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
return <>
<div className="pghead"><h1>📈 إيرادات ضمين</h1><span className="tag grn">عمولات كل تصنيف تُحوَّل للإدارة لحظة التحرير</span></div>
<div className="kpis mb">
<div className="kpi grn"><i>🧾</i><b>{money(DB.aRevenue)}</b><span>إجمالي العمولات حتى اليوم</span></div>
<div className="kpi amb"><i>🔒</i><b>{money(held)}</b><span>محجوز في الخزنة الآن</span></div>
<div className="kpi nvy"><i>🏪</i><b>{money(storesBal)}</b><span>صافي أرصدة التجار</span></div>
<div className="kpi amb"><i>🌟</i><b>{money(DB.aPtsWallet||0)}</b><span>محفظة الإدارة من تمويل النقاط</span></div>
<div className="kpi nvy"><i>🚚</i><b>{money(DB.logiWallet||0)}</b><span>حساب الشريك اللوجستي (OTO/Torod)</span></div>
<div className="kpi"><i>🧾</i><b>{money(DB.vat||0)}</b><span>ضريبة القيمة المضافة المحصلة (١٥٪)</span></div>
</div>
<div className="acard"><h3>📒 الملخص المالي الشامل — كل ما يخص المبالغ في ضمين</h3>
<div className="rows">{fr.map(([l,v],i)=><div className="row" style={{flexWrap:'wrap',gap:'4px'}} key={i}><div className="tx" style={{flex:'1',minWidth:'180px'}}>{l}</div><b className="fx" style={{fontSize:'12.5px',whiteSpace:'nowrap'}}>{v}</b></div>)}</div>
<div className="hr"></div>
<div className="demo"><b style={{fontSize:'11.5px'}}>⚖️ معادلة الخزنة — أين ذهب كل مبلغ؟</b>
<p className="hint" style={{marginTop:'4px',lineHeight:'2'}}>إجمالي الطلبات <b>{money(gmv)}</b> = محجوز الآن لصالح الشحنات الجارية <b>{money(held)}</b> + محرر بضمان (منتجات <b>{money(relSub)}</b> + شحن دفعه العملاء <b>{money(shipC)}</b>) + مسترجع للعملاء <b>{money(refunds)}</b>{Math.abs(gmv-held-relFlow-refunds)<1?<>{' — '}<b style={{color:'var(--grn)'}}>✓ الدفاتر متوازنة</b></>:null}</p>
<p className="hint" style={{lineHeight:'1.9'}}>عمولة المنصة تُقتطع من نصيب التاجر فقط (وتُحدَّد لكل تصنيف من صفحة الأقسام) — ولا تُضاف على العميل أبداً، بينما دعم التجار ونقاطهم للشحن ({money(r2(shipM+shipP))}) يُقتطع من صافيهم ويُحوَّل للوجستيات.</p></div>
</div>
<div className="acard mt"><h3>عمولات آخر ٥ أشهر (ألف ر.س)</h3>
<div className="rvbars">{DB.revMonths.map(m=><div className="rv" key={m.m}><span>{ard(m.v)}</span><i style={{height:Math.max(8,m.v/mx*100)+'%'}}></i><b>{m.m}</b></div>)}</div>
</div>
<div className="acard mt"><h3>🌟 إعدادات برنامج النقاط — أرقامك أنت</h3>
<div className="setrow"><div className="ic">⭐</div><div className="tx"><b>قيمة النقطة الواحدة (ر.س)</b><span>يموّلها التاجر من محفظته — اختر الرقم الذي يناسبك من ٠٫٠١ إلى ١</span></div>
<div style={{display:'flex',gap:'6px',flexShrink:0,alignItems:'center'}}><input className="inp" id="pv-inp" type="number" step="0.01" min="0.01" max="1" defaultValue={ptsVal()} style={{width:'84px',padding:'8px',textAlign:'center'}}/><button className="btn sm" onClick={()=>setPtsVal($('#pv-inp').value)}>حفظ</button></div></div>
<div className="setrow"><div className="ic">🚚</div><div className="tx"><b>نقاط التوصيل المجاني</b><span>النقاط التي يستبدلها العميل مقابل توصيل مجاني لكل طلبه — من ٥٠ إلى ٢٠٠٠</span></div>
<div style={{display:'flex',gap:'6px',flexShrink:0,alignItems:'center'}}><input className="inp" id="fd-inp" type="number" step="10" min="50" max="2000" defaultValue={fdPts()} style={{width:'84px',padding:'8px',textAlign:'center'}}/><button className="btn sm" onClick={()=>setFreeDlPts($('#fd-inp').value)}>حفظ</button></div></div>
<div className="setrow"><div className="ic">🏦</div><div className="tx"><b>محفظة الإدارة من النقاط</b><span>رسوم تمويل النقاط المحصّلة من التجار — تُستخدم في مكافآت العملاء</span></div><b className="fx" style={{color:'var(--amb2)'}}>{money(DB.aPtsWallet||0)}</b></div>
{DB.ptsFunding.length?<><div className="hr"></div><b style={{fontSize:'11.5px'}}>آخر تمويلات التجار</b>
<div className="rows">{DB.ptsFunding.slice(0,4).map((x,xi)=><div className="row" key={xi}><div style={{flex:'1',minWidth:'0'}}><b>{ST(x.store).name} — {x.pname}</b><div className="hint">{ago(x.at)}</div></div><span className="hint">{x.pts>0?'+':null}{ar(x.pts)} نقطة</span><b className="fx" style={{color:'var(--amb2)'}}>{money(x.amt)}</b></div>)}</div></>:null}
</div>
<div className="acard mt"><h3>أرصدة تجار الضمان</h3>
<div className="rows">{STORES.map((s:any)=><div className="row" key={s.id}>
<div style={{width:'34px',height:'34px',borderRadius:'10px',background:s.color,color:'#fff',display:'grid',placeItems:'center',fontSize:'13px',fontFamily:'Alexandria',fontWeight:800,overflow:'hidden'}}>{s.logo?<img src={s.logo} style={{width:'100%',height:'100%',objectFit:'cover'}}/>:s.name[0]}</div>
<div style={{flex:'1'}}><b>{s.name}</b><div className="hint">{SEC(s.sec).name} · محجوز لصالحه {money(heldFor(s.id))}</div></div>
<b className="fx" style={{color:'var(--grn)'}}>{money(DB.storeWallets[s.id]||0)}</b></div>)}</div></div>
<AcouponCard/>
</>;
}
export function setPtsVal(v){v=+v;if(!(v>=0.01&&v<=1)){toast('أدخل قيمة النقطة بين ٠٫٠١ و ١ ر.س','err');return}DB.ptsVal=+v.toFixed(2);toast('صارت قيمة النقطة '+money(DB.ptsVal)+' — تسري على تمويلات التجار الجديدة','ok');render()}
export function setFreeDlPts(v){v=Math.round(+v);if(!(v>=50&&v<=2000)){toast('أدخل نقاط التوصيل بين ٥٠ و ٢٠٠٠','err');return}DB.freeDlPts=v;toast('صار استبدال التوصيل المجاني بـ'+ar(v)+' نقطة للعميل','ok');render()}
