'use client';
/* ضمين — pages/merchant2.tsx
 * صفحات التاجر (٢): الطلبات والمحفظة والنزاعات والإعدادات + الكوبونات والعروض وحفظ/حذف المنتج —
 * منقول من dameen.js (السطور ١٠٢٧-١٠٩٩، ٢٣٨٥-٢٤٥٤، ٢٤٥٦-٢٧٠٢) بنفس البنية والفئات والنصوص حرفياً.
 * ملاحظات التحويل:
 * - PRODUCTS=PRODUCTS.filter(...) في حذف المنتج صارت تفريغاً في المكان splice(...) لأن روابط الاستيراد للقراءة فقط (نفس الأثر).
 * - offPrev (تحديث جزئي لمنطقة المعاينة #offprev) ⇒ bumpUI('mstudio') والمنطقة <OffPrevArea/> تقرأ useUI('mstudio').
 * - بعد إنشاء منتج جديد يُفتح الاستوديو عبر mStudioOpen من merchant1 (المكافئ الحرفي لـ MSPID=…;closeModal();go('m-media')).
 */
import { Fragment } from 'react';
import { $, ar, ard, money, r2, toast, dt, ago, clock, DB, USERS, STORES, PRODUCTS, P, ST, SEC, secOf, eff, ptsVal, catComm, medOf, ZPOOL, MONTHS, CITIES } from '../core';
import { SES, VIEW, MPQ, myStore, go, render, pushNotif, openModal, closeModal, bumpUI, useUI, setMPID } from '../store';
import { Img, Stars } from '../ui';
import { mStudioOpen, myGroups, heldFor } from './merchant1';
import { openOChat, mSendOTP, shipBlock } from './orders';
import { OpenDispute } from './disputes';

/* ===== حالات الطلب وخطوات التتبع (السطران ١٤٦٩-١٤٧١) ===== */
const GLBL={pending:'بانتظار القبول',preparing:'قيد التحضير',shipped:'تم الشحن',received:'استُلم — قيد الفحص',released:'حُرر المبلغ',disputed:'قيد التحكيم',refunded:'استُرجع المبلغ'};
const GSTEPS=['القبول','التحضير','الشحن','الاستلام','التحرير'];
const gstep=g=>({pending:0,preparing:1,shipped:2,received:3,released:4}[g.status]);

/* ================= كوبونات التاجر (١٠٢٧-١٠٦٣) ================= */
export function McouponCard(){
const s:any=myStore();
const mine:any=Object.entries(DB.coupons).filter(([k,c]:any)=>c.store===s.id);
return <div className="acard"><h3>🎟️ كوبونات متجرك</h3>
<p className="hint mb" style={{lineHeight:'1.8'}}>أصدر كوبونات خاصة بعملاء متجرك — يُطبق الكوبون عند الطلب على قيمة منتجاتك في السلة، والعمولة تُحسب بعد الخصم، ولا يمس الخصم رسوم الشحن.</p>
{mine.length?<div className="rows mb">{mine.map(([k,c])=><div className="row" style={{flexWrap:'wrap',gap:'6px'}} key={k}>
<div style={{flex:'1',minWidth:'130px'}}><b className="fx" style={{letterSpacing:'1px'}}>{k}</b><div className="hint">{c.type==='pct'?ar(c.v)+'٪ بحد أقصى '+money(c.max||c.v):'خصم ثابت '+money(c.v)} · حد أدنى {money(c.min||0)}{c.maxUses?' · حتى '+ar(c.maxUses)+' استخدام':''}</div></div>
<span className="tag grn">استُخدم {ar(c.uses||0)} مرة</span>
<button className="btn red xs" onClick={()=>mDelCoupon(k)}>🗑</button></div>)}</div>:<div className="hint mb">لا كوبونات صادرة لمتجرك بعد — الكوبونات تزيد مبيعاتك وتجذب العملاء الجدد.</div>}
<div className="fgrid">
<div className="fld"><label>الكود (أحرف إنجليزية)</label><input className="inp" id="mc-code" placeholder={'مثال: '+s.id.toUpperCase()+'-15'} style={{textTransform:'uppercase'}}/></div>
<div className="fld"><label>النوع</label><select className="inp" id="mc-type"><option value="pct">نسبة ٪</option><option value="amt">مبلغ ثابت (ر.س)</option></select></div>
</div>
<div className="fgrid mt">
<div className="fld"><label>القيمة</label><input className="inp" id="mc-v" type="number" min="1" defaultValue={10}/></div>
<div className="fld"><label>أقصى خصم للنسبة (ر.س)</label><input className="inp" id="mc-max" type="number" min="1" defaultValue={50}/></div>
<div className="fld"><label>أدنى قيمة طلب (ر.س)</label><input className="inp" id="mc-min" type="number" min="0" defaultValue={0}/></div>
<div className="fld"><label>حد الاستخدام (٠ = بلا حد)</label><input className="inp" id="mc-uses" type="number" min="0" defaultValue={0}/></div>
</div>
<button className="btn sm mt" onClick={()=>mAddCoupon()}>＋ إصدار كوبون لمتجرك</button>
</div>}
export function mAddCoupon(){
const s:any=myStore();
const code=((($('#mc-code')||{value:''}).value)||'').trim().toUpperCase();
const type=($('#mc-type')||{value:'pct'}).value;
const v=+((($('#mc-v')||{value:0}).value)||0);
const mx=+((($('#mc-max')||{value:0}).value)||0);
const mn=+((($('#mc-min')||{value:0}).value)||0);
const us=+((($('#mc-uses')||{value:0}).value)||0);
if(!/^[A-Z0-9-]{3,15}$/.test(code)){toast('اكتب كوداً إنجليزياً من ٣ إلى ١٥ خانة (أحرف وأرقام و-)','err');return}
if(DB.coupons[code]){toast('هذا الكود مستخدم مسبقاً في ضمين','err');return}
if(v<1||(type==='pct'&&v>90)){toast('قيمة الكوبون بين ١ و٩٠٪ (أو مبلغ من ١ ر.س)','err');return}
if(type==='pct'&&!mx){toast('حدد أقصى مبلغ للخصم عند النسبة','err');return}
DB.coupons[code]={type,v,max:type==='pct'?mx:v,store:s.id,min:mn,uses:0,maxUses:us||0};
toast('صدر كوبون «'+code+'» لمتجرك ✓','ok');render();
}
export function mDelCoupon(k){delete DB.coupons[k];toast('حُذف الكوبون «'+k+'»','');render()}

/* ================= كوبونات الإدارة (١٠٦٤-١٠٩٩) ================= */
export function AcouponCard(){
const all:any=Object.entries(DB.coupons);
return <div className="acard mt"><h3>🎟️ كوبونات الخصم — إدارة ضمين</h3>
<p className="hint mb" style={{lineHeight:'1.8'}}>أصدر كوبونات شاملة لكل متاجر ضمين أو خاصة بمتجر بعينه، وتابع كوبونات التجار واستخداماتها — يُطبق الكوبون على قيمة المنتجات عند الطلب فقط.</p>
<div className="rows mb">{all.length?all.map(([k,c])=><div className="row" style={{flexWrap:'wrap',gap:'6px'}} key={k}>
<div style={{flex:'1',minWidth:'140px'}}><b className="fx" style={{letterSpacing:'1px'}}>{k}</b><div className="hint">{c.type==='pct'?ar(c.v)+'٪ بحد أقصى '+money(c.max||c.v):'خصم ثابت '+money(c.v)} · حد أدنى {money(c.min||0)}</div></div>
<span className={'tag '+(c.store==='all'?'nvy':'gry')}>{c.store==='all'?'شامل لكل المتاجر':'متجر '+ST(c.store).name}</span>
<span className="tag grn">استُخدم {ar(c.uses||0)}{c.maxUses?' / '+ar(c.maxUses):''}</span>
<button className="btn red xs" onClick={()=>aDelCoupon(k)}>🗑</button></div>):<div className="hint mb">لا كوبونات في المنصة بعد</div>}</div>
<div className="fgrid">
<div className="fld"><label>الكود</label><input className="inp" id="ac-code" placeholder="مثال: DMN25" style={{textTransform:'uppercase'}}/></div>
<div className="fld"><label>النطاق</label><select className="inp" id="ac-store"><option value="all">شامل لكل المتاجر</option>{STORES.map(s=><option value={s.id} key={s.id}>{s.name}</option>)}</select></div>
</div>
<div className="fgrid mt">
<div className="fld"><label>النوع</label><select className="inp" id="ac-type"><option value="pct">نسبة ٪</option><option value="amt">مبلغ ثابت (ر.س)</option></select></div>
<div className="fld"><label>القيمة</label><input className="inp" id="ac-v" type="number" min="1" defaultValue={10}/></div>
<div className="fld"><label>أقصى خصم للنسبة (ر.س)</label><input className="inp" id="ac-max" type="number" min="1" defaultValue={60}/></div>
<div className="fld"><label>أدنى قيمة طلب (ر.س)</label><input className="inp" id="ac-min" type="number" min="0" defaultValue={0}/></div>
</div>
<button className="btn sm mt" onClick={()=>aAddCoupon()}>＋ إصدار كوبون</button>
</div>}
export function aAddCoupon(){
const code=((($('#ac-code')||{value:''}).value)||'').trim().toUpperCase();
const store=($('#ac-store')||{value:'all'}).value;
const type=($('#ac-type')||{value:'pct'}).value;
const v=+((($('#ac-v')||{value:0}).value)||0);
const mx=+((($('#ac-max')||{value:0}).value)||0);
const mn=+((($('#ac-min')||{value:0}).value)||0);
if(!/^[A-Z0-9-]{3,15}$/.test(code)){toast('اكتب كوداً إنجليزياً من ٣ إلى ١٥ خانة','err');return}
if(DB.coupons[code]){toast('هذا الكود مستخدم مسبقاً','err');return}
if(v<1||(type==='pct'&&v>90)){toast('قيمة الكوبون بين ١ و٩٠٪ (أو مبلغ من ١ ر.س)','err');return}
if(type==='pct'&&!mx){toast('حدد أقصى مبلغ للخصم عند النسبة','err');return}
DB.coupons[code]={type,v,max:type==='pct'?mx:v,store,min:mn,uses:0,maxUses:0};
toast('صدر كوبون «'+code+'» '+(store==='all'?'الشامل لكل المتاجر ✓':'لمتجر '+ST(store).name+' ✓'),'ok');render();
}
export function aDelCoupon(k){delete DB.coupons[k];toast('حُذف الكوبون «'+k+'» من المنصة','');render()}

/* ================= حفظ منتج جديد/تعديل (٢٣٨٥-٢٤٢٦) ================= */
export function mSaveProd(pid){
const s:any=myStore(),sec=SEC(s.sec);
const nm=($('#mp-nm').value||'').trim(),pr=+($('#mp-pr').value||0),st=+($('#mp-st').value||0);
if(!nm||pr<1){toast('أكمل الاسم والسعر','err');return}
const specs:any={};($('#mp-sp').value||'').split('\n').forEach(l=>{const i=l.indexOf(':');if(i>0)specs[l.slice(0,i).trim()]=l.slice(i+1).trim()});
const off=Math.min(90,Math.max(0,+($('#mp-off').value||0)));
const pts=Math.max(0,Math.min(500,Math.round(+($('#mp-pts').value||0)||0)));
if(!(pts>=1)){toast('🌟 نقاط الولاء إجبارية — حدد نقاطاً (١ فأكثر) يمنحها المنتج للعميل عند التحرير','err');$('#mp-pts').focus();return}
const pv=ptsVal();const old=pid?((P(pid) as any).pts||0):0;const dPts=pts-old;const cost=r2(dPts*pv);
if(cost>0&&(DB.storeWallets[s.id]||0)<cost){toast('محفظتك لا تكفي لتمويل '+ar(pts)+' نقطة ('+money(cost)+') — قلّل النقاط أو راجع محفظتك','err');return}
let ptypeVal=(($('#mp-ptype')||{}).value)||'';
let fragile=false,customOk=false,digi=null,ipOK=false;
if(sec.id==='gaming'){
if(ptypeVal==='digital'){
ipOK=!!$('#mp-ip')&&$('#mp-ip').checked;
if(!ipOK){toast('⚖️ إقرار الملكية الفكرية إلزامي قبل رفع الملفات والأكواد الرقمية','err');return}
const dv=($('#mp-dval').value||'').trim();
if(dv.length<3){toast('أدخل قيمة الكود أو اسم الملف الرقمي','err');return}
digi={kind:$('#mp-dkind').value,val:dv,size:($('#df-hint')&&$('#df-hint').dataset.size)||''};}
fragile=(ptypeVal==='fragile');
ptypeVal=digi?'digital':'std';
}else if(sec.id==='deco'){
if(!['ship','field'].includes(ptypeVal))ptypeVal='ship';
fragile=!!$('#mp-frag')&&$('#mp-frag').checked;
customOk=!!$('#mp-custom')&&$('#mp-custom').checked;
}else{
if(!['chilled','instant'].includes(ptypeVal))ptypeVal='std';
}
fragile=fragile||($('#mp-frag2')&&$('#mp-frag2').value==='1');
const tempv=$('#mp-temp')?$('#mp-temp').value:'std';
if(dPts!==0){DB.storeWallets[s.id]=r2((DB.storeWallets[s.id]||0)-cost);
DB.aPtsWallet=r2((DB.aPtsWallet||0)+cost);
DB.ptsFunding.unshift({store:s.id,amt:cost,pts:dPts,pname:nm,at:Date.now()})}
if(pid){const p:any=P(pid);Object.assign(p,{name:nm,cat:$('#mp-cat').value,price:pr,off,stock:st,desc:$('#mp-ds').value.trim(),specs,pts,ptype:ptypeVal||p.ptype||'std',giftOk:$('#mp-gift')?$('#mp-gift').checked:!!p.giftOk,fragile,customOk,temp:tempv,qs:MPQ.map(x=>({...x}))});
if(digi)p.digi=digi;if(ipOK)p.ipOK=true;
toast('حُفظ تعديل المنتج ✓'+(dPts?' — '+(dPts>0?'خُصمت':'استُرجعت')+' '+money(Math.abs(cost))+' تمويل نقاط':''),'ok')}
else{PRODUCTS.unshift({id:'p'+(Date.now()%100000),store:s.id,name:nm,cat:$('#mp-cat').value,price:pr,off,stock:st,pts,ptype:ptypeVal||'std',giftOk:$('#mp-gift')?$('#mp-gift').checked:false,fragile,customOk,digi,ipOK,sold:0,rt:0,rc:0,imgs:[ZPOOL[Math.floor(Math.random()*ZPOOL.length)]],vids:[],temp:tempv,desc:$('#mp-ds').value.trim()||nm,specs,specsFallback:{},ratings:[],qs:MPQ.map(x=>({...x}))} as any);
toast('أُضيف المنتج لمتجرك ✓ — أضف صوره ومقاطعه من استوديو الوسائط 🎬'+(pts?' — خُصمت '+money(cost)+' تمويل '+ar(pts)+' نقطة':''),'ok')}
setMPID(null);
if(pid){closeModal();render()}
else{mStudioOpen(PRODUCTS[0].id)}
}

/* ===== العروض بنسبة حرة (٢٤٢٨-٢٤٥٤) ===== */
let OFFPID=null;
const offVal=()=>Math.min(90,Math.max(0,Math.round(+((($('#mp-off2')||{value:0}).value)||0))));
export function mOfferForm(pid){
const p=P(pid);OFFPID=pid;
openModal(<>
<div className="mhead"><b>🏷️ عرض «{p.name}»</b><button className="x" onClick={()=>closeModal()}>✕</button></div>
<div className="mbody">
<div className="demo mb"><b style={{fontSize:'12.5px'}}>ضع خصماً على كيفك</b>
<p className="hint" style={{marginTop:'2px'}}>اختر نسبة جاهزة أو اكتب أي نسبة تريدها من ١ إلى ٩٠٪ — يُحدّث السعر للعملاء فوراً.</p></div>
<div className="chiprow">{[5,10,15,20,25,30,40,50,60].map(v=><button className="chip" style={{'--acc':ST(p.store).color} as any} key={v} onClick={()=>{$('#mp-off2').value=v;offPrev()}}>{ar(v)}٪</button>)}<button className="chip" style={{'--acc':'var(--red)'} as any} onClick={()=>{$('#mp-off2').value=0;offPrev()}}>إلغاء العرض</button></div>
<div className="fld mt"><label>نسبة الخصم (٪) — ٠ يعني بلا عرض</label><input className="inp" id="mp-off2" type="number" min="0" max="90" defaultValue={p.off||0} onInput={()=>offPrev()}/></div>
<OffPrevArea/>
<div className="spread mt"><button className="btn gray" onClick={()=>closeModal()}>تراجع</button>
<button className="btn" onClick={()=>mOfferSet2()}>حفظ العرض</button></div>
</div>
</>,'');
offPrev();
}
/* منطقة المعاينة #offprev — كانت تُملأ بـ innerHTML في offPrev، الآن تقرأ useUI('mstudio') */
function OffPrevArea(){
useUI('mstudio');
const p=P(OFFPID);const v=offVal();const e=r2(p.price*(1-v/100));
return <div className="acard" style={{padding:'12px'}} id="offprev">
<div className="spread"><span className="hint">السعر الحالي</span><b>{money(p.off?r2(p.price*(1-p.off/100)):p.price)}</b></div>
<div className="spread" style={{marginTop:'5px'}}><span className="hint">{v?'السعر بعد الخصم الجديد':'بلا خصم — السعر الأصلي'}</span><b className="fx" style={{fontSize:'16px',color:v?'var(--grn)':'var(--ink)'}}>{money(e)}</b></div>
{v?<div className="hint" style={{marginTop:'5px'}}>العميل يوفّر <b style={{color:'var(--red)'}}>{money(r2(p.price-e))}</b> ({ar(v)}٪)</div>:null}
</div>}
export function offPrev(){
const el=$('#offprev');if(!el)return;
bumpUI('mstudio');
}
export function mOfferSet2(){
const p=P(OFFPID);const v=offVal();p.off=v;
closeModal();toast(v?'فُعّل خصم '+ar(v)+'٪ على «'+p.name+'» — السعر الجديد '+money(eff(p)):'أُلغي العرض على «'+p.name+'»','ok');render();
}

/* ===== تقييمات وتعليقات العملاء على المنتج (٢٤٥٦-٢٤٦٨) ===== */
export function mProdRevs(pid){
const p=P(pid);
const dist=[5,4,3,2,1].map(n=>p.ratings.filter(r=>r.stars===n).length);
const mx=Math.max(1,...dist);
openModal(<>
<div className="mhead"><b>⭐ تقييمات «{p.name}»</b><button className="x" onClick={()=>closeModal()}>✕</button></div>
<div className="mbody">
<div className="acard" style={{display:'flex',gap:'16px',alignItems:'center',flexWrap:'wrap'}}>
<div style={{textAlign:'center',minWidth:'92px'}}><b className="fx" style={{fontSize:'31px',color:'var(--amb2)'}}>{ard(p.rt)}</b><div><Stars r={p.rt}/></div><div className="hint">{ar(p.rc)} تقييم · {ar(p.sold)} عملية بيع</div></div>
<div style={{flex:'1',minWidth:'170px'}}>{dist.map((n,i)=>{const st=5-i;return <div style={{display:'flex',alignItems:'center',gap:'7px',fontSize:'10.5px',margin:'3px 0'}} key={i}><span style={{width:'26px'}}>{ar(st)}★</span><div style={{flex:'1',height:'7px',background:'#EFE9DA',borderRadius:'8px',overflow:'hidden'}}><i style={{display:'block',height:'100%',width:(n/mx*100)+'%',background:'var(--amb)'}}></i></div><span className="mut" style={{width:'20px'}}>{ar(n)}</span></div>})}</div>
</div>
{p.ratings.length?[...p.ratings].reverse().map((r,i)=><div className="mprev" key={i}><div className="spread" style={{flexWrap:'wrap'}}><div style={{display:'flex',gap:'8px',alignItems:'center'}}><div className="avat" style={{width:'30px',height:'30px',borderRadius:'10px',fontSize:'12px'}}>{(r.name||'ع')[0]}</div><b style={{fontSize:'12px'}}>{r.name||'عميل'}</b><Stars r={r.stars}/></div><span className="hint">{ago(r.at)}</span></div><p>{r.txt||<i className="mut">قيّم بالنجوم دون تعليق نصي</i>}</p></div>):<div className="empty" style={{padding:'26px'}}><div className="em">💬</div><b>لا تعليقات بعد</b><span>سيظهر هنا كل تعليق وتقييم يكتبه عملاؤك عن هذا المنتج</span></div>}
</div>
</>,'lg');
}

/* ===== حذف منتج (٢٤٦٩-٢٤٧٣) ===== */
export function mDelProd(pid){
openModal(<>
<div className="mhead"><b>حذف منتج</b><button className="x" onClick={()=>closeModal()}>✕</button></div><div className="mbody">
<p style={{fontSize:'13.5px'}}>هل تريد حذف «{P(pid).name}» من متجرك؟ لا يمكن التراجع.</p>
<div className="spread mt"><button className="btn gray" onClick={()=>closeModal()}>تراجع</button>
<button className="btn red" onClick={()=>{PRODUCTS.splice(0,PRODUCTS.length,...PRODUCTS.filter((p:any)=>p.pid!==pid&&p.id!==pid));closeModal();toast('حُذف المنتج','');render()}}>تأكيد الحذف</button></div></div>
</>,'')}

/* ================= طلبات التاجر (٢٤٧٤-٢٥٣٥) ================= */
export function PgMOrders(){
const gs:any=myGroups();
const NR=['pending','preparing','shipped'],RC=['received','released'];
const stat=x=>x.g.status;
const C={all:gs.length,
nr:gs.filter(x=>NR.includes(stat(x))).length,
rcv:gs.filter(x=>RC.includes(stat(x))).length,
pnd:gs.filter(x=>stat(x)==='pending').length,
prep:gs.filter(x=>stat(x)==='preparing').length,
ship:gs.filter(x=>stat(x)==='shipped').length,
recv:gs.filter(x=>stat(x)==='received').length,
rel:gs.filter(x=>stat(x)==='released').length,
bad:gs.filter(x=>['disputed','refunded'].includes(stat(x))).length};
const relVal=r2(gs.filter(x=>stat(x)==='released').reduce((a,x)=>a+x.g.sub,0));
const f=(VIEW as any).mof||'all';
const PRED={all:()=>true,pnd:x=>stat(x)==='pending',prep:x=>stat(x)==='preparing',ship:x=>stat(x)==='shipped',recv:x=>stat(x)==='received',rel:x=>stat(x)==='released',bad:x=>['disputed','refunded'].includes(stat(x)),nr:x=>NR.includes(stat(x)),rcv:x=>RC.includes(stat(x))};
const FILTS=[['all','📦 الكل'],['nr','⏳ لم تُستلم بعد'],['rcv','📥 تم استلامها'],['pnd','بانتظار القبول'],['prep','قيد التحضير'],['ship','تم شحنها'],['recv','قيد الفحص'],['rel','🔓 محررة'],['bad','⚖️ نزاعات واسترجاعات']];
const list=gs.filter(PRED[f]);
return <>
<div className="pghead"><h1>📦 طلبات متجري ({ar(gs.length)})</h1></div>
<div className="kpis mb">
<div className="kpi nvy"><i>📦</i><b>{ar(C.all)}</b><span>إجمالي الطلبات</span></div>
<div className="kpi amb"><i>⏳</i><b>{ar(C.nr)}</b><span>لم تُستلم بعد</span></div>
<div className="kpi grn"><i>📥</i><b>{ar(C.rcv)}</b><span>استلمها العميل</span></div>
<div className="kpi grn"><i>🔓</i><b>{ar(C.rel)}</b><span>محررة (مكتملة)</span></div>
<div className="kpi red"><i>⚖️</i><b>{ar(C.bad)}</b><span>نزاعات واسترجاعات</span></div>
<div className="kpi"><i>💰</i><b>{money(relVal)}</b><span>قيمة الشحنات المحررة</span></div>
</div>
<div className="chiprow">{FILTS.map(([k,l])=><button className={'chip '+(f===k?'on':'')} key={k} onClick={()=>{(VIEW as any).mof=k;render()}}>{l} ({ar(C[k])})</button>)}</div>
<div className="mt">
{list.length?list.map(({o,g,gi})=>{
const cust=USERS[o.customer];
const dis=DB.disputes.find(d=>d.order===o.id&&d.store===SES.store);
return <div className="ocard" key={o.id+'-'+gi}>
<div className="spread" style={{flexWrap:'wrap'}}>
<div><b className="fx" style={{fontSize:'13.5px'}}>طلب #{ar(o.id)}</b>
<div className="hint">{cust?cust.name.split(' ')[0]:'عميل'} {cust&&cust.hidePhone?'· رقمه مخفي بطلبه':'· '+ar(o.customer)} · {dt(o.at)}</div></div>
<span className={'tag '+(g.status==='pending'?'amb':g.status==='released'?'grn':g.status==='disputed'?'red':'gry')}>{GLBL[g.status]}</span>
</div>
{o.freeDl?<span className="tag grn" style={{marginTop:'6px'}}>🚚 توصيل مجاني — استبدلها العميل بالنقاط</span>:null}
<div className="oitems">{g.items.map((it,i)=>{const p:any=P(it.pid);return <span className="oitag" key={i}>{p?<Img src={p.imgs[0]} cls="" alt=""/>:null} {ar(it.qty)}× {p?p.name:'—'}{p&&(p.pts||0)>0?<>{' '}<span style={{color:'var(--amb2)'}}>🌟{ar(p.pts*it.qty)}</span></>:null}</span>})}</div>
{g.logi?<div className="hint" style={{marginTop:'6px'}}>📄 {g.logi.wb?'بوليصة '+ar(g.logi.wb)+' · ':''}{g.logi.courier}{g.logi.wb?<>{' · '}<a style={{color:'var(--grn)',fontWeight:700,cursor:'pointer'}} onClick={()=>toast('أُرسلت البوليصة للطباعة 🖨️','ok')}>طباعة البوليصة 🖨️</a></>:' — بلا بوليصة (خدمة ميدانية)'} · من {ST(g.store).city||'—'} إلى {o.city||'—'}</div>:null}
{shipBlock(o,g,gi)}
{g.booking?<div className="bkcard"><b style={{fontSize:'11.5px'}}>🎪 مناسبة العميل — حجز مؤكد</b>
<div className="hint" style={{lineHeight:'1.8',marginTop:'4px'}}>📅 {g.booking.date} · التركيب {g.booking.setup}{g.booking.tear?' · الفك '+g.booking.tear:''}{g.booking.dl==='pickup'?' · 🚶 يستلمها العميل من مقرك بلا توصيل':' · 🚚 فريقك يوصل ويركّب في الموقع'}{g.booking.geo?' · 📍 موقع محدد ('+ard(g.booking.geo.lat)+'، '+ard(g.booking.geo.lng)+')':''}{g.booking.note?' · '+g.booking.note:''}</div></div>:null}
{g.custom?<div className="giftrow" style={{background:'#A45A3A12',borderColor:'#A45A3A66'}}>✏️ طلب قابل للتعديل — ناقش العميل في المحادثة واطلب مبلغ أي إضافة من زر «طلب مبلغ إضافي» داخل الدردشة (يُحجز بضمان ضمين)</div>:null}
{g.digi?<div className="giftrow" style={{background:'#50489E12',borderColor:'#50489E66'}}>⚡ طلب رقمي — سُلّم فوراً للعميل عند الدفع في مكتبته الرقمية، والمبلغ محجوز حتى نهاية نافذة الحماية ({secOf(g.store).win})</div>:null}
{g.ship&&g.ship.fragile?<div className="giftrow" style={{background:'#8A4B080f',borderColor:'#8A4B0866'}}>⚠️ شحنة قابلة للكسر — نُقلت العلامة لشركة الشحن آلياً: تغليف خاص إلزامي + رسوم حماية ١٥ ر.س ضمن الشحن</div>:null}
{g.gift?<div className="giftrow">🎁 إهداء — المستلم: <b>{g.gift.name}</b> · {ar(g.gift.phone)} (يُطبع على البوليصة كمتسلم)</div>:null}
{g.ans&&g.ans.length?<div className="hint" style={{marginTop:'6px'}}>❓ إجابات العميل على أسئلتك: {g.ans.map((x,i)=><Fragment key={i}>{i?' · ':null}{x.q} ← <b>{x.a}</b></Fragment>)}</div>:null}
{g.pans&&g.pans.length?<div className="hint" style={{marginTop:'6px'}}>❓ إجابات العميل على أسئلة المنتجات: {g.pans.map((x,i)=><Fragment key={i}>{i?' · ':null}{x.pn} — {x.ans.map((y,j)=><Fragment key={j}>{j?' · ':null}{y.q} ← <b>{y.a}</b></Fragment>)}</Fragment>)}</div>:null}
{g.chat?<button className="btn soft xs" style={{marginTop:'7px'}} onClick={()=>openOChat(o.id,gi)}>💬 محادثة الطلب{g.chatDeleted?' — محذوفة لمخالفة':(g.chatArchived||['received','released','refunded','disputed'].includes(g.status))?' — مؤرشفة':''}</button>:null}
{['disputed','refunded'].includes(g.status)?null:<div className="osteps">{GSTEPS.map((l,i)=><div className={'st '+(i<gstep(g)?'on':i===gstep(g)?'on':'')} key={i}><i></i>{l}</div>)}</div>}
{g.status==='received'?<div className="hint">⏳ العميل يفحص الشحنة — يُحرر المبلغ تلقائياً بعد <b className="cd" style={{border:'0',background:'none',padding:'0'}} data-cd={g.complaintUntil}>{clock(g.complaintUntil-Date.now())}</b></div>:null}
{g.status==='pending'?<button className="btn sm mt" onClick={()=>mAccept(o.id,gi)}>✅ اقبل الطلب وابدأ التحضير</button>:null}
{g.status==='preparing'?<button className="btn amb sm mt" onClick={()=>mShip(o.id,gi)}>{g.logi&&g.logi.wb?'🚚 سلّم الشحنة للمندوب — بوليصة '+ar(g.logi.wb):(g.ship&&g.ship.mode==='field'?(g.booking&&g.booking.dl==='pickup'?'🚶 جهّز الطلب — العميل سيستلمه من مقرك':'🎪 انطلق الفريق إلى موقع المناسبة'):'🚚 حدّث حالة الشحن')}</button>:null}
{g.status==='shipped'&&g.ship&&g.ship.mode==='field'?(g.otp?<div className="bkcard" style={{borderColor:'#1D443255',background:'#1D44320a'}}><b style={{fontSize:'11.5px'}}>🎯 كود تأكيد إتمام الخدمة: <b className="fx" style={{letterSpacing:'3px',fontSize:'15px'}}>{ar(g.otp)}</b></b><div className="hint" style={{marginTop:'4px',lineHeight:'1.7'}}>أظهره للعميل في موقع المناسبة — تُحرر مستحقاتك فور إدخاله من تطبيق العميل (لا تُصرف إلا بهذا الكود).</div></div>:<button className="btn amb sm mt" onClick={()=>mSendOTP(o.id,gi)}>🎯 اكتمل التركيب — أرسل كود التأكيد للعميل</button>):null}
{g.status==='disputed'&&dis?<button className="btn red sm mt" onClick={()=>OpenDispute(dis.id)}>⚖️ متابعة النزاع والرد على العميل</button>:null}
{g.status==='released'&&g.payout?<div className="hint mt" style={{background:'#1D443208',borderRadius:'10px',padding:'7px 11px'}}>🔓 حُرر {money(g.payout.net)} صافياً (عمولة ضمين {money(g.payout.comm)}){g.rated?<>{' · تقييم العميل '}<Stars r={g.rated.stars}/></>:null}</div>:null}
<div className="hint" style={{marginTop:'6px'}}>قيمة الشحنة: <b>{money(g.sub)}</b> → صافيك عند التحرير: <b style={{color:'var(--grn)'}}>{money(r2(g.sub*0.975-((g.ship&&g.ship.source==='merchant')?g.ship.subsidy:0)))}</b>{g.ship&&g.ship.source==='merchant'?<> <span className="tag amb" style={{fontSize:'9px'}}>شمل {money(g.ship.subsidy)} دعمك للشحن — لا يمس العمولة</span></>:null}</div>
</div>}):<div className="empty"><div className="em">📦</div><b>لا طلبات في هذا التصنيف</b><span>غيّر الفلتر أو تابع كل الطلبات</span></div>}
</div>
</>
}

/* قبول الطلب/الشحن (٢٥٣٦-٢٥٤٧) */
export function mAccept(oid,gi){const o:any=DB.orders.find(x=>x.id===oid);const g=o.groups[gi];
g.status='preparing';
if(g.logi)g.logi.events.push({t:'قَبِل المتجر الطلب وبدأ التحضير — تحديث Webhook',at:Date.now()});
pushNotif(o.customer,'🧵','متجرك بدأ التحضير',ST(g.store).name+' قبلت طلبك #'+ar(oid)+' وقيد التحضير الآن',['orders']);
toast('قُبل الطلب — بدأ التحضير ✅','ok');render()}
export function mShip(oid,gi){const o:any=DB.orders.find(x=>x.id===oid);const g=o.groups[gi];
g.status='shipped';
if(g.logi&&g.logi.wb)g.logi.events.push({t:'استلم المندوب الشحنة من المتجر (Pickup مؤكد) — تحديث Webhook',at:Date.now()});
else if(g.logi&&g.logi.mode==='field'&&g.booking&&g.booking.dl==='pickup')g.logi.events.push({t:'جُهّز الطلب لاستلام العميل من مقر المتجر — بلا توصيل',at:Date.now()});
else if(g.logi)g.logi.events.push({t:'انطلق فريق المتجر للتركيب في موعد المناسبة',at:Date.now()});
pushNotif(o.customer,'🚚','تحديث على طلبك',ST(g.store).name+' حدّثت طلبك #'+ar(oid)+(g.ship&&g.ship.mode==='field'?' — الفريق في موقع المناسبة، وبعد اكتمال التركيب يصلك كود التأكيد':' — أكّد الاستلام عند وصوله'),['orders']);
toast('سُجل التحديث 🚚','ok');render()}

/* ================= محفظة التاجر (٢٥٤٨-٢٥٨٧) ================= */
export function PgMWallet(){
const s:any=myStore();
const tx:any[]=[];DB.orders.forEach((o:any)=>o.groups.forEach((g:any)=>{if(g.store===s.id&&g.payout&&g.payout.net>0)tx.push({o,g})}));
tx.sort((a,b)=>b.g.releasedAt-a.g.releasedAt);
const totalIn=tx.reduce((a,x)=>a+x.g.payout.net,0);
const totalComm=tx.reduce((a,x)=>a+x.g.payout.comm,0);
const myLogi=r2(DB.orders.reduce((a,o:any)=>a+o.groups.filter((g:any)=>g.store===s.id&&g.payout).reduce((x,g)=>x+((g.ship&&g.ship.charge)||0)+((g.payout.ship&&g.payout.ship.merchant)||0),0),0));
const fund=DB.ptsFunding.filter(x=>x.store===s.id);
const fundNet=r2(fund.reduce((a,x)=>a+x.amt,0));
return <>
<div className="pghead"><h1>💰 محفظة {s.name}</h1><button className="btn amb sm" onClick={()=>toast('أُرسل طلب السحب — يُحوَّل خلال ٢٤ ساعة 🏦','ok')}>🏦 طلب سحب الرصيد</button></div>
<div className="kpis">
<div className="kpi grn"><i>💵</i><b>{money(DB.storeWallets[s.id]||0)}</b><span>رصيدك المتاح للسحب</span></div>
<div className="kpi amb"><i>🔒</i><b>{money(heldFor(s.id))}</b><span>محجوز لحظة تحرير الطلبات</span></div>
<div className="kpi nvy"><i>📈</i><b>{money(totalIn)}</b><span>صافي التحريرات بعد العمولة</span></div>
<div className="kpi red"><i>🧾</i><b>{money(totalComm)}</b><span>عمولات الإدارة (حسب التصنيف)</span></div>
<div className="kpi nvy"><i>🚚</i><b>{money(myLogi)}</b><span>حُوّل للشريك اللوجستي (OTO/Torod)</span></div>
</div>
<div className="acard mt"><h3>⚙️ كيف يتوزع كل مبلغ محرَّر؟ (توزيع ثلاثي لحظي)</h3>
<div className="splitbar"><i className="net"></i><i className="comm"></i></div>
<div className="splitrow"><span><b style={{color:'var(--grn)'}}>■</b> صافي المتجر (بعد عمولة تصنيفاته) ← محفظتك مباشرة</span><span><b style={{color:'var(--amb)'}}>■</b> عمولة الإدارة ← حساب التطبيق</span><span><b style={{color:'var(--navy)'}}>■</b> رسوم الشحن ← حساب الشريك اللوجستي</span></div>
<p className="hint mt" style={{lineHeight:'1.9'}}>عند تحرير أي شحنة يتوزع المبلغ ثلاثياً لحظياً: <b>صافي حقك</b> يدخل رصيدك المتاح، و<b>عمولة ضمين (حسب تصنيف كل منتج)</b> تتحول لحساب التطبيق، و<b>رسوم الشحن</b> (ما دفعه العميل + ما تدعمه أنت من توصيل مجاني أو مناصفة أو سقف مجاني) تتحول لحساب الشريك اللوجستي (OTO/Torod) — ودعمك للشحن يُقتطع من صافيك فقط ولا يمس العمولة أبداً.</p></div>
<div className="acard mt"><h3>🔓 سجل التحريرات (كل تحرير بتوزيعه: صافيك + العمولة + الشحن)</h3>
<div className="rows">{tx.length?tx.map(({o,g},i)=><div className="row" style={{cursor:'pointer',flexWrap:'wrap'}} key={i} onClick={()=>go('m-orders',undefined)}>
<div style={{flex:'1',minWidth:'150px'}}><b>طلب #{ar(o.id)} · {USERS[o.customer]?USERS[o.customer].name.split(' ')[0]:'عميل'}</b>
<div className="hint">{dt(g.releasedAt)} · بواسطة {g.releasedBy||'—'}</div></div>
<div style={{textAlign:'left'}}>
<div className="hint">قيمة الشحنة {money(g.payout.sub)}</div>
<b className="fx" style={{color:'var(--grn)'}}>+ {money(g.payout.net)} صافيك</b>
<div className="hint" style={{color:'var(--amb2)'}}>− {money(g.payout.comm)} عمولة الإدارة ← مباشرة</div>
{g.payout.ship&&(g.payout.ship.charge||g.payout.ship.merchant)?<div className="hint" style={{color:'var(--navy)'}}>🚚 شحن: {money(g.payout.ship.charge||0)} من العميل{g.payout.ship.merchant?' + '+money(g.payout.ship.merchant)+' دعمك':''} ← اللوجستي</div>:null}
</div></div>):<div className="hint">لا تحريرات بعد — تُحرر الشحنات بعد استلام العميل</div>}</div></div>
{fund.length?<div className="acard mt"><h3>🌟 تمويلات نقاط الولاء</h3>
<p className="hint mb" style={{lineHeight:'1.8'}}>كل نقطة تضيفها لمنتجاتك تُخصم من محفظتك فوراً وتُحوَّل لمحفظة الإدارة، ويستلمها العميل نقاط ولاء عند تحرير طلبه.</p>
<div className="rows">{fund.map((f,i)=><div className="row" key={i}>
<div style={{flex:'1'}}><b>{f.pts>0?'تمويل '+ar(f.pts)+' نقطة':'استرجاع '+ar(-f.pts)+' نقطة'} — {f.pname}</b>
<div className="hint">{dt(f.at)}</div></div>
<b className="fx" style={{color:f.amt>=0?'var(--amb2)':'var(--grn)'}}>{f.amt>=0?'−':'+'} {money(Math.abs(f.amt))}</b></div>)}</div>
<div className="hint mt">إجمالي تمويلك للنقاط: <b>{money(fundNet)}</b> — تجدها في محفظة الإدارة</div></div>:null}
<button className="btn amb wide mt" onClick={()=>toast('أُرسل طلب السحب — يُحوَّل خلال ٢٤ ساعة 🏦','ok')}>🏦 طلب سحب الرصيد المتاح</button>
</>
}

/* ================= نزاعات التاجر (٢٥٨٨-٢٥٩٩) ================= */
export function PgMDisputes(){
const ds=DB.disputes.filter(d=>d.store===SES.store);
return <>
<div className="pghead"><h1>⚖️ نزاعات متجري ({ar(ds.length)})</h1></div>
{ds.length?ds.map(d=>{const o=DB.orders.find(x=>x.id===d.order);
return <div className="ocard" style={{borderInlineStart:'4px solid '+(d.status==='open'?'var(--red)':'var(--grn)')}} key={d.id}>
<div className="spread" style={{flexWrap:'wrap'}}>
<div><b className="fx" style={{fontSize:'13px'}}>⚖️ {d.subject}</b><div className="hint">طلب #{ar(d.order)} · {USERS[d.customer]?USERS[d.customer].name.split(' ')[0]:'عميل'} · {ago(d.openedAt)}</div></div>
{d.status==='open'?<span className="tag red">بانتظار حكم الإدارة — المبلغ معلق</span>:<span className={'tag '+(d.ruling.act==='release'?'grn':'gry')}>{d.ruling.act==='release'?'حُكم لصالحك':'استُرجع للعميل'}</span>}</div>
{d.ruling?<div className={'verd '+(d.ruling.act==='release'?'rel':'ref')} style={{margin:'9px 0 2px'}}><h4>تسبيب الحكم</h4><div className="why">{d.ruling.text}</div></div>:null}
<button className={'btn sm '+(d.status==='open'?'red':'')+' mt'} onClick={()=>OpenDispute(d.id)}>💬 {d.status==='open'?'الرد على العميل وإضافة أدلتك':'عرض المحادثة'}</button>
</div>}):<div className="empty"><div className="em">🕊️</div><b>لا نزاعات على متجرك</b><span>استمر في الجودة والسرعة 🌟</span></div>}
</>
}

/* ================= إعدادات المتجر (٢٦٠٠-٢٦٨٥) ================= */
export function PgMSet(){
const s:any=myStore(),sec=SEC(s.sec);
const own=USERS[s.owner];
const med=medOf(s);
const ps=PRODUCTS.filter((p:any)=>p.store===s.id);
const myFund=DB.ptsFunding.filter(x=>x.store===s.id);
const myCats=[...new Set(ps.map((p:any)=>p.cat))].map(cn=>({n:cn,c:catComm(s.sec,cn)}));
const ccs=myCats.map(c=>c.c);const ccTxt=ccs.length?(Math.min(...ccs)===Math.max(...ccs)?ard(ccs[0])+'٪':ard(Math.min(...ccs))+'–'+ard(Math.max(...ccs))+'٪'):'—';
return <>
<div className="pghead"><h1>⚙️ إعدادات المتجر</h1><span className="tag" style={{background:s.color+'18',color:s.color}}>{sec.name}</span></div>
<div className="grid2">
<div>
<div className="acard"><h3>🏪 ملف المتجر الكامل</h3>
<div className="setrow"><div className="ic">🏷️</div><div className="tx"><b>اسم المتجر</b><span>{s.name}</span></div><span className="tag grn">معروض للعملاء</span></div>
<div className="setrow"><div className="ic">🗂️</div><div className="tx"><b>القسم</b><span>{sec.name} — نافذة حماية {sec.win} بعد الاستلام</span></div><span className="tag" style={{background:s.color+'18',color:s.color}}>ثابت</span></div>
<div className="setrow"><div className="ic">👤</div><div className="tx"><b>المالك</b><span>{own?own.name+' · '+ar(s.owner):'—'}</span></div><span className="tag grn">عضو ضمين</span></div>
<div className="setrow"><div className="ic">🆔</div><div className="tx"><b>معرّف المتجر</b><span>{s.id.toUpperCase()} · عضوية المالك {own?'منذ '+MONTHS[new Date(own.since).getMonth()]+' '+ar(new Date(own.since).getFullYear()):'—'}</span></div></div>
{s.cr?<div className="setrow"><div className="ic">🧾</div><div className="tx"><b>السجل التجاري / الوثيقة</b><span>{s.cr}{s.crDoc?' · مرفق: '+s.crDoc:''}</span></div><span className="tag grn">موثّق لدى الإدارة</span></div>:null}
{s.iban?<div className="setrow"><div className="ic">🏦</div><div className="tx"><b>الآيبان — تحويل أرباحك</b><span>يُحوَّل إليه صافي محفظتك عند طلب السحب خلال ٢٤ ساعة</span></div><span className="tag nvy" style={{fontSize:'10px',letterSpacing:'.5px'}}>{String(s.iban).slice(0,10)}••</span></div>:null}
<div className="setrow"><div className="ic">⭐</div><div className="tx"><b>تقييم المتجر</b><span>{ard(s.rt)} من ٥ — {ar(s.sales)} عملية بيع مكتملة</span></div><Stars r={s.rt}/></div>
<div className="setrow"><div className="ic">🧺</div><div className="tx"><b>المنتجات المعروضة</b><span>{ar(ps.length)} منتج · {ar(ps.filter(p=>p.off>0).length)} عليه عرض · {ar(ps.filter((p:any)=>(p.pts||0)>0).length)} يمنح نقاطاً</span></div></div>
<div className="setrow"><div className="ic">🎬</div><div className="tx"><b>الوسائط الترويجية — حدود الإدارة لمتجرك</b><span>حتى {ar(med.imgs)} صور و{ar(med.vids)} مقاطع بمدة {ar(med.secs)} ثانية للمقطع، لكل منتج</span></div><span className="tag gry">من الإدارة</span></div>
<div className="setrow"><div className="ic">💰</div><div className="tx"><b>المحفظة</b><span>متاح {money(DB.storeWallets[s.id]||0)} · محجوز {money(heldFor(s.id))}</span></div><button className="btn soft xs" onClick={()=>go('m-wallet',undefined)}>عرض</button></div>
</div>
<div className="acard"><h3>🖼️ هوية المتجر — اللوقو والصورة</h3>
<div className="storeid" style={{'--c':s.color} as any}>
<div className="big">{s.logo?<img src={s.logo}/>:s.name[0]}</div>
<b>{s.name}</b>
<div className="hint">اللوقو يظهر مكان الحرف في بطاقة متجرك وصفحته لكل العملاء</div>
<div className="cov">{s.cover?<img src={s.cover}/>:'صورة غلاف متجرك (بانر صفحة المتجر)'}</div>
</div>
<div className="spread mt" style={{gap:'8px',flexWrap:'wrap'}}>
<button className="btn soft sm" onClick={()=>pickStoreImg('logo')}>📷 رفع/تغيير اللوقو</button>
{s.logo?<button className="btn gray xs" onClick={()=>rmStoreImg('logo')}>إزالة اللوقو</button>:null}
</div>
<div className="spread mt" style={{gap:'8px',flexWrap:'wrap'}}>
<button className="btn soft sm" onClick={()=>pickStoreImg('cover')}>🖼️ رفع/تغيير صورة الغلاف</button>
{s.cover?<button className="btn gray xs" onClick={()=>rmStoreImg('cover')}>إزالة الغلاف</button>:null}
</div>
<p className="hint mt" style={{lineHeight:'1.8'}}>تظهر هوية متجرك لكل عملاء ضمين: اللوقو في بطاقات المتجر والبحث والأقسام، والغلاف كبانر لصفحة متجرك.</p>
</div>
<McouponCard/>
</div>
<div>
<div className="acard"><h3>✏️ بيانات قابلة للتعديل</h3>
<div className="fld"><label>اسم المتجر</label><input className="inp" id="ms-nm" defaultValue={s.name}/></div>
<div className="fld mt"><label>وصف المتجر (يظهر لكل العملاء)</label><textarea className="inp" id="ms-ds" style={{minHeight:'80px'}} defaultValue={s.desc}></textarea></div>
<button className="btn mt" onClick={()=>mSaveStore()}>حفظ البيانات</button>
</div>
<div className="acard"><h3>🚦 حالة التشغيل</h3>
<div className="setrow"><div className="ic">{s.open?'🟢':'🔴'}</div><div className="tx"><b>استقبال الطلبات</b><span>{s.open?'متجرك مفتوح ويستقبل الطلبات':'مغلق مؤقتاً — منتجاتك تظهر دون زر شراء'}</span></div>
<button className={'sw '+(s.open?'on':'')} onClick={()=>{myStore().open=!myStore().open;render()}}></button></div>
<div className="setrow"><div className="ic">🛡️</div><div className="tx"><b>نافذة حماية قسمك</b><span>{sec.name}: {sec.win} بعد استلام العميل — ثابتة بسياسة ضمين</span></div><span className="tag grn">إلزامية</span></div>
<div className="setrow"><div className="ic">⛔</div><div className="tx"><b>حالة المتجر</b><span>{s.susp?'متجرك موقوف مؤقتاً من الإدارة — راجع فريق الامتثال':'متجرك يعمل بكامل صلاحياته ومعروض للعملاء'}</span></div><span className={'tag '+(s.susp?'red':'grn')}>{s.susp?'موقوف':'سليم'}</span></div>
</div>
<div className="acard"><h3>🧾 العمولة ونظام النقاط</h3>
<div className="setrow"><div className="ic">🧾</div><div className="tx"><b>عمولة ضمين على تصنيفاتك</b><span>{myCats.length?myCats.map(c=>c.n+' '+ard(c.c)+'٪').join(' · '):'لم تضف منتجات بعد'} — تحددها الإدارة لكل تصنيف، وتُقتطع لحظة التحرير فقط وتتحول مباشرة لمحفظة الإدارة ولا تُضاف على العميل</span></div><span className="tag amb">{ccTxt}</span></div>
<div className="setrow"><div className="ic">🌟</div><div className="tx"><b>قيمة النقطة (تحددها الإدارة)</b><span>{money(ptsVal())} للنقطة — تُخصم من محفظتك عند إضافة نقاط لأي منتج وتُحوَّل لمحفظة الإدارة</span></div><span className="tag amb">{money(ptsVal())}</span></div>
<div className="setrow"><div className="ic">📊</div><div className="tx"><b>تمويلك للنقاط حتى الآن</b><span>{ar(myFund.reduce((a,x)=>a+x.pts,0))} نقطة تمّولها · {money(r2(myFund.reduce((a,x)=>a+x.amt,0)))}</span></div><button className="btn soft xs" onClick={()=>go('m-wallet',undefined)}>السجل</button></div>
</div>
<div className="acard"><h3>📍 موقع المتجر — حماية من الالتفاف</h3>
<div className="fld"><label>مدينة النشاط (الوحيدة الظاهرة للعملاء)</label>
<select className="inp" id="ms-city" defaultValue={s.city}>{CITIES.map(c=><option key={c}>{c}</option>)}</select></div>
<div className="fld mt"><label>الحي والشارع (محجوب دائماً عن العملاء)</label><input className="inp" id="ms-area" defaultValue={s.area||''} placeholder="مثال: حي الياسمين، شارع الأمير سلطان"/></div>
<p className="hint mt" style={{lineHeight:'1.8'}}>🔒 ما يراه العميل: <b>📍 {s.city}</b> فقط — العنوان التفصيلي يُنقل داخل السيرفر إلى شريك الشحن لإصدار البوليصة دون أن يظهر في أي واجهة، ولا يوجد استلام شخصي «يد بيد» في ضمين، والتتبع بالحالات فقط.</p>
<button className="btn mt sm" onClick={()=>mSaveLoc()}>حفظ الموقع</button>
</div>
<div className="acard"><h3>🚚 خيارات التوصيل وسقف الشحن المجاني</h3>
<div className="fld"><label>من يتحمل رسوم التوصيل؟</label>
<select className="inp" id="ms-dlm" defaultValue={s.dlMode}>
<option value="customer">توصيل على العميل (١٠٠٪)</option>
<option value="half">توصيل مناصفة (٥٠٪ عليك / ٥٠٪ على العميل)</option>
<option value="free">توصيل مجاني (١٠٠٪ عليك)</option>
</select></div>
<div className="fld mt"><label>سقف الشحن المجاني — أدنى قيمة طلب (ر.س، 0 = معطَّل)</label><input className="inp" id="ms-fmin" type="number" min="0" defaultValue={s.freeMin||0}/></div>
{sec.id==='family'?<div className="fld mt"><label>🛵 نطاق التوصيل الفوري (كم داخل «{s.city}» فقط)</label><input className="inp" id="ms-range" type="number" min="1" max="60" defaultValue={s.rangeKm||20}/>
<p className="hint" style={{marginTop:'5px',lineHeight:'1.8'}}>الأطباق الطازجة تُوصل بمناديب فوريين داخل مدينتك فقط — يُمنع أي طلب من خارج النطاق تلقائياً حفاظاً على حرارة الوجبة (مثال: داخل الرياض أو على بعد ٢٠ كم).</p></div>:null}
<p className="hint mt" style={{lineHeight:'1.8'}}>⚖️ ما تتحمله من رسوم الشحن يُقتطع من <b>صافيك فقط</b> لحظة التحرير — ولا يمس عمولة المنصة (٢٫٥٪) أبداً، ويُحوَّل كاملاً لحساب الشريك اللوجستي. ويرى العميل شريط تقدم في سلة التسوق يشجعه على بلوغ سقفك.</p>
<button className="btn mt sm" onClick={()=>mSaveShip()}>حفظ خيارات التوصيل</button>
</div>
{sec.id==='family'?<div className="acard"><h3>❓ أسئلة متجري عند الطلب</h3>
<p className="hint mb" style={{lineHeight:'1.8'}}>أضف أسئلة تناسب مطبخك — تظهر للعميل عند إتمام الطلب وتصلك إجاباته مع الشحنة (متاحة لقسم المأكولات والضيافة).</p>
{(s.qs||[]).length?(s.qs||[]).map((q,i)=><div className="setrow" key={i}><div className="ic">❓</div><div className="tx"><b>{q}</b><span>سؤال رقم {ar(i+1)} — يظهر للعميل عند الطلب</span></div><button className="btn gray xs" onClick={()=>mDelQ(i)}>حذف</button></div>):<div className="hint mb">لا أسئلة بعد</div>}
<div className="fld mt"><label>سؤال جديد</label><input className="inp" id="ms-q" placeholder="مثال: هل تريد الكيكة بالكريمة أم بالتمر؟"/></div>
<button className="btn soft sm mt" onClick={()=>mAddQ()}>＋ إضافة السؤال</button>
</div>:null}</div>
</div>
</>
}

/* رفع/إزالة لوقو وغلاف المتجر (٢٦٨٧-٢٦٩٢) */
export function pickStoreImg(kind){
$('#fup').onchange = e=>{const f=e.target.files[0];if(!f)return;
const rd=new FileReader();rd.onload=()=>{myStore()[kind]=rd.result;$('#fup').value='';
toast(kind==='logo'?'حُدّث لوقو متجرك — يظهر الآن لكل العملاء ✓':'حُدّثت صورة غلاف متجرك ✓','ok');render()};rd.readAsDataURL(f)};
$('#fup').click()}
export function rmStoreImg(kind){delete myStore()[kind];toast(kind==='logo'?'أُزيل اللوقو وعاد الحرف الافتراضي':'أُزيلت صورة الغلاف وعاد اللون الافتراضي','');render()}
export function mSaveStore(){const s=myStore();
const nm=($('#ms-nm').value||'').trim();
if(nm.length<2){toast('اسم المتجر قصير','err');return}
s.name=nm;s.desc=($('#ms-ds').value||'').trim();
toast('حُفظت بيانات متجرك ✓','ok');render()}

export function mSaveLoc(){const s:any=myStore();s.city=$('#ms-city').value;s.area=($('#ms-area').value||'').trim();toast('حُفظ الموقع — يظهر للعملاء مدينة النشاط فقط ✓','ok');render()}
export function mSaveShip(){const s:any=myStore();s.dlMode=$('#ms-dlm').value;s.freeMin=Math.max(0,Math.round(+($('#ms-fmin').value||0)));if($('#ms-range'))s.rangeKm=Math.min(60,Math.max(1,Math.round(+($('#ms-range').value||20))));toast('حُفظت خيارات التوصيل ✓','ok');render()}
export function mAddQ(){const v=($('#ms-q').value||'').trim();if(v.length<3){toast('اكتب سؤالاً أوضح','err');return}const s:any=myStore();s.qs=s.qs||[];s.qs.push(v);toast('أُضيف السؤال — سيظهر للعملاء عند الطلب ✓','ok');render()}
export function mDelQ(i){const s:any=myStore();s.qs.splice(i,1);toast('حُذف السؤال','');render()}
