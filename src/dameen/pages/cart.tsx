'use client';
/* ضمين — pages/cart.tsx
 * السلة + بوابة الطلب الآمن — منقول من dameen.js (السطور ١١٣٠-١٤٦٧) حرفياً:
 * cartCalc, pgCart, cartQty, rmCart, applyCoupon, ptsSet, OID, startCheckout,
 * ckHTML (→ CkModal: mhead + mbody#ckbody), ckBody (→ <CkBody/>: منطقة #ckbody تضم
 * cksteps + محتوى الخطوة), ckRefresh, ckLogin, ckQuick, ckNext, ckBack, addrTxt,
 * useGeo, ckSaveAddr, ckSetAns, ckSetBook, ckSetGift, ckGiftTog, ckEventGeo,
 * ckExtras, placeOrder.
 * ckRefresh الأصلية كانت تعيد بناء #ckbody فقط عبر innerHTML ⇒ هنا bumpUI('ckbody')
 * و<CkBody/> تقرأ useUI('ckbody') وتُعاد تركيباً كاملاً مع كل نبضة (Fragment بمفتاح النبضة — نفس أثر innerHTML).
 * ملاحظة: openOChat تُستدعى من صفحة الطلبات (orders.tsx تُكتب بالتوازي) ⇒ مرجؤة عبر
 * namespace الوحدة لأنها غير مُصدَّرة بعد.
 */
import { Fragment } from 'react';
import { $, P, ST, SEC, eff, money, ar, ard, r2, esc, toast, shipQuote, mkLogi, DB, USERS, ptsVal, fdPts, PTI, tempTxt, secOf, IMP } from '../core';
import { impAdd } from '../store';
import { SES, CART, CK, CPN, PTS, FREE_DL, me, custCity, cartCount, go, render, bumpUI, useUI, pushNotif, openModal, closeModal, setCK, setCART, setCPN, setPTS, setFREE_DL } from '../store';
import { doLogin, quickLogin, openAuth } from '../auth';
import { Img } from '../ui';
import * as Orders from './orders';

/* cartCalc (السطر ١١٣٠ حرفياً) */
export function cartCalc(){
const items=CART.map(c=>({...c,p:P(c.pid)})).filter(c=>c.p);
const groups:{[k:string]:any}={};items.forEach(c=>{(groups[c.p.store]=groups[c.p.store]||[]).push(c)});
const city=custCity();
const fd=FREE_DL&&SES&&(me().pts||0)>=fdPts();
const quotes:{[k:string]:any}={};let dlCharge=0,dlCost=0;
Object.entries(groups).forEach(([sid,its])=>{const q=shipQuote(its,ST(sid),city,fd);quotes[sid]=q;dlCharge+=q.charge;dlCost+=q.cost});
dlCharge=r2(dlCharge);dlCost=r2(dlCost);
const sub=r2(items.reduce((a,c)=>a+eff(c.p)*c.qty,0));
let cpn=0,cpnBad='';
if(CPN&&DB.coupons[CPN]){const cc=DB.coupons[CPN];
const csub=cc.store==='all'?sub:Object.entries(groups).reduce((a,[sid,its])=>sid===cc.store?a+r2(its.reduce((x,y)=>x+eff(y.p)*y.qty,0)):a,0);
if(cc.store!=='all'&&!Object.keys(groups).includes(cc.store))cpnBad='كوبون «'+CPN+'» خاص بمتجر «'+ST(cc.store).name+'» وليس ضمن سلتك';
else if(sub<(cc.min||0))cpnBad='كوبون «'+CPN+'» يشترط طلباً بقيمة '+money(cc.min)+' على الأقل';
else if(cc.maxUses&&(cc.uses||0)>=cc.maxUses)cpnBad='كوبون «'+CPN+'» استُنفد ('+ar(cc.maxUses)+' استخدام)';
else cpn=r2(Math.min(cc.type==='pct'?csub*cc.v/100:cc.v,cc.max||csub,csub));}
const avail=SES?Math.max(0,(me().pts||0)-(fd?fdPts():0)):0;
const ptsMax=SES?Math.floor(avail/100)*100:0;
let ptsUse=Math.min(PTS,ptsMax,Math.floor(Math.max(sub-cpn,0)/(ptsVal()*100))*100);ptsUse=Math.max(0,Math.floor(ptsUse/100)*100);
const ptsAmt=r2(ptsUse*ptsVal());
const net=r2(Math.max(0,sub+dlCharge-cpn-ptsAmt));
const tax=r2(net*0.15);
const total=r2(net+tax);
return{items,groups,sub,city,dlCharge,dlCost,quotes,fd,fdN:fdPts(),cpn,cpnBad,ptsMax,ptsUse,ptsAmt,net,tax,total};
}

/* pgCart (السطر ١١٥٥ حرفياً) */
export function PgCart(){
if(!CART.length)return <><div className="pghead"><h1>🛒 سلة التسوق</h1></div>
<div className="empty"><div className="em">🛒</div><b>سلتك فارغة</b><span>تجوّل بين عوالم ضمين الأربعة واختر ما يعجبك — الدفع محمي بضمان ضمين</span>{' '}
<button className="btn mt" onClick={()=>go('home',undefined)}>ابدأ التصفح</button></div></>;
const c=cartCalc();
return <><div className="pghead"><h1>🛒 سلة التسوق</h1><span className="tag grn">{ar(cartCount())} منتج · {ar(Object.keys(c.groups).length)} شحنة</span></div>
<div className="hint mb">🚚 شحنة مستقلة لكل متجر مع بوليصة مستقلة — كلفة الشحن تُحسب ديناميكياً من مدينة كل متجر إلى مدينتك ({c.city}) · الضريبة ١٥٪ على إجمالي الفاتورة.</div>
<div className="cartgrid"><div>
{Object.entries(c.groups).map(([sid,its])=>{
const s=ST(sid),sec=SEC(s.sec),gsub=r2(its.reduce((a,x)=>a+eff(x.p)*x.qty,0));const q=c.quotes[sid];
return <div className="cgroup" key={sid}>
<div className="cghead" style={{'--c':s.color} as any}><div className="lg">{s.name[0]}</div>
<div style={{flex:1}}><b style={{color:s.color}}>{s.name}</b><div className="hint">شحنة مستقلة · 🛡️ حماية {sec.win} بعد الاستلام</div></div>
<span className="tag gry">{ar(its.length)} منتج</span></div>
{its.map(x=>{const p=x.p,e=eff(p);
return <div className="citem" key={p.id} onClick={()=>go('product',p.id)}>
<div className="im"><Img src={p.imgs[0]} cls="" alt=""/></div>
<div className="info">
<b style={{fontSize:'13px'}}>{p.name}</b>
<div className="hint">{s.name}{p.off?<> · <span style={{color:'var(--red)',fontWeight:700}}>خصم {ar(p.off)}٪</span></>:null}{PTI(p)?<> · <span style={{fontWeight:700}}>{PTI(p)}</span></>:null}{p.giftOk?' · 🎁 قابل للإهداء':''}{p.fragile?<> · <span style={{color:'#B3541E',fontWeight:700}}>⚠️ قابل للكسر</span></>:null}{p.customOk?' · ✏️ قابل للتعديل':''}{x.ans&&x.ans.length?<> · <span style={{color:'var(--grn)',fontWeight:800}}>❓ {x.ans.map(y=>y.q+': '+y.a).join(' · ')}</span></>:null}{p.temp&&p.temp!=='std'?<> · <b>{tempTxt(p)}</b></>:''}</div>
<div style={{display:'flex',gap:'9px',alignItems:'center',marginTop:'5px'}}>
<div className="qty" onClick={e=>e.stopPropagation()}>
<button onClick={()=>cartQty(p.id,1)}>＋</button><b>{ar(x.qty)}</b><button onClick={()=>cartQty(p.id,-1)}>−</button>
</div>
<b className="fx" style={{color:'var(--grn)'}}>{money(r2(e*x.qty))}</b>
</div></div>
<button className="iconbtn" style={{width:'33px',height:'33px',fontSize:'12px'}} onClick={e=>{e.stopPropagation();rmCart(p.id)}} title="إزالة">🗑️</button>
</div>})}
<div className="cghead" style={{border:0,borderTop:'1px solid var(--line)',background:'transparent'}}>
<span>إجمالي الشحنة</span><b className="fx" style={{marginInlineStart:'auto'}}>{money(gsub)}</b>
<span className="hint">{q.mode==='field'?'🎪 توصيل وتركيب فريق المتجر':q.mode==='digital'?'⚡ تسليم رقمي فوري — ٠ ر.س شحن':q.charge?<>+ شحن {money(q.charge)} · {q.label}</>:<>+ شحن مجاني 🎉{q.why?' — '+q.why:''}</>}</span>
{q.blocked?<div style={{color:'var(--red)',fontWeight:700,fontSize:'11px',marginTop:'5px',lineHeight:'1.7'}}>⛔ {q.blocked}</div>:null}
{(s.freeMin||0)>0&&s.dlMode!=='free'&&q.mode!=='field'&&q.mode!=='digital'&&!q.blocked&&gsub<s.freeMin?<div className="freeprog"><div className="fp-hint">أضف {money(r2(s.freeMin-gsub))} لهذه الشحنة واحصل على شحن مجاني من {s.name}</div><div className="pbar"><i style={{width:Math.min(100,r2(gsub/s.freeMin*100))+'%'}}></i></div></div>:null}
</div>
</div>})}
</div>
<div className="sumbox">
<b className="fx" style={{fontSize:'15px'}}>ملخص الطلب</b>
<div className="hint mb" style={{marginTop:'2px'}}>🔒 يُحجز المبلغ في خزنة ضمين ولا يُحرَّر للتاجر إلا بعد رضاك</div>
<div className="srow"><span>المجموع الفرعي ({ar(cartCount())} منتج)</span><b>{money(c.sub)}</b></div>
<div className="srow"><span>الشحن ({ar(Object.keys(c.groups).length)} شحنة · إلى {c.city})</span><b>{c.dlCharge?money(c.dlCharge):'مجاني 🎉'}</b></div>
<div className="hr" style={{margin:'8px 0'}}></div>
<div style={{display:'flex',gap:'7px',marginBottom:'9px'}}>
<input className="inp" id="cpnin" placeholder="كود الخصم (جرّب DAMIN10)" defaultValue={CPN||''} style={{fontSize:'12px'}}/>
{CPN?<button className="btn gray sm" onClick={()=>{setCPN(null);render()}}>إلغاء</button>:<button className="btn sm" onClick={()=>applyCoupon()}>تطبيق</button>}
</div>
{c.cpnBad?<div className="srow" style={{color:'var(--red)',fontWeight:700,fontSize:'11.5px'}}>🎟️ {c.cpnBad}</div>:null}
{c.cpn?<div className="srow disc"><span>خصم الكوبون {CPN}{DB.coupons[CPN]&&DB.coupons[CPN].store!=='all'?' — من متجر '+ST(DB.coupons[CPN].store).name:' — شامل من الإدارة'}</span><b>− {money(c.cpn)}</b></div>:null}
{SES?<>
<div className="srow"><span>🌟 نقاطك: {ar(me().pts||0)} نقطة</span>
<div style={{display:'flex',gap:'5px',flexWrap:'wrap'}}>
{c.ptsMax>=100?<><button className="btn soft xs" onClick={()=>ptsSet(Math.min(100,c.ptsMax))}>+١٠٠</button>
{c.ptsMax>=300?<button className="btn soft xs" onClick={()=>ptsSet(Math.min(300,c.ptsMax))}>+٣٠٠</button>:null}
<button className="btn soft xs" onClick={()=>ptsSet(c.ptsMax)}>الكل</button></>:null}
{PTS?<button className="btn gray xs" onClick={()=>ptsSet(0)}>إلغاء {ar(PTS)}</button>:null}
</div></div>
{c.ptsUse?<div className="srow disc"><span>خصم النقاط ({ar(c.ptsUse)} نقطة)</span><b>− {money(c.ptsAmt)}</b></div>:null}
{c.dlCharge>0?<>
<div className="srow"><span>🚚 توصيل مجاني؟</span>
{(me().pts||0)>=c.fdN?<button className={'btn '+(c.fd?'gray':'amb')+' xs'} onClick={()=>{setFREE_DL(!FREE_DL);render()}}>{c.fd?'إلغاء الاستبدال':'استبدال '+ar(c.fdN)+' نقطة'}</button>:<span className="hint">تحتاج {ar(c.fdN-(me().pts||0))} نقطة أخرى</span>}</div>
{c.fd?<div className="srow disc"><span>توصيل مجاني بالنقاط ({ar(c.fdN)} نقطة)</span><b>− {money(c.dlCost)}</b></div>:null}
</>:null}
</>:<div className="hint mb">🌟 سجّل دخولك لاستبدال نقاط الولاء (كل ١٠٠ نقطة = {money(100*ptsVal())} — أو توصيل مجاني بـ{ar(fdPts())} نقطة)</div>}
<div className="srow"><span>ضريبة القيمة المضافة ١٥٪</span><b>{money(c.tax)}</b></div>
<div className="srow tot"><span>الإجمالي (شامل الضريبة)</span><b>{money(c.total)}</b></div>
<div className="hint" style={{textAlign:'center',marginTop:'6px'}}>💳 قسّمها على ٤ دفعات مع تابي ({money(r2(c.total/4))} للدفعة) أو ٣ دفعات مع تمارا ({money(r2(c.total/3))})</div>
<button className="btn amb wide mt" onClick={()=>startCheckout()}>🔒 إتمام الطلب الآمن</button>
<p className="hint" style={{textAlign:'center',marginTop:'8px'}}>عمولة ضمين (حسب تصنيف كل منتج) تُحسم من التاجر — لا تُضاف عليك أبداً</p>
</div></div></>;
}

/* cartQty (السطر ١٢٢٥ حرفياً) */
export function cartQty(pid,d){const it=CART.find(c=>c.pid===pid);if(!it)return;
it.qty+=d;const p=P(pid);
if(it.qty>Math.max(1,p.stock||9)){it.qty=Math.max(1,p.stock||9);toast('الكمية المتاحة '+ar(p.stock||1),'amb')}
if(it.qty<=0)setCART(CART.filter(c=>c.pid!==pid));
render()}
/* rmCart (السطر ١٢٣٠ حرفياً) */
export function rmCart(pid){setCART(CART.filter(c=>c.pid!==pid));toast('أُزيل من السلة',undefined);render()}
/* applyCoupon (السطر ١٢٣١ حرفياً) */
export function applyCoupon(){const v=($('#cpnin').value||'').trim().toUpperCase();
if(!v){setCPN(null);render();return}
if(!DB.coupons[v]){toast('كود غير صالح','err');setCPN(null);render();return}
setCPN(v);const c=DB.coupons[v];const cart=cartCalc();
if(cart.cpnBad){toast(cart.cpnBad,'err');setCPN(null);render();return}
toast('فُعّل كوبون «'+v+'» 🎉 '+(c.store==='all'?'— خصم شامل من الإدارة على كل المتاجر':'— خصم من متجر '+ST(c.store).name),'ok');render()}
/* ptsSet (السطر ١٢٣٧ حرفياً) */
export function ptsSet(n){setPTS(n);render()}

/* ================= بوابة الطلب ================= */
let OID=1025;
/* startCheckout (السطر ١٢٤١ حرفياً) */
export function startCheckout(){
if(!CART.length)return;
const bl=Object.values(cartCalc().quotes).filter(q=>q.blocked);
if(bl.length){toast(bl[0].blocked,'err');return}
setCK({step:SES?1:0,addr:me()&&me().addrs&&me().addrs.length?(me().addrs.findIndex(a=>a.def)>=0?me().addrs.findIndex(a=>a.def):0):-1,pay:'mada',geo:null,book:{},gift:{},ans:{},chatG:null});
openModal(<CkModal/>,'lg');}
/* ckHTML (السطر ١٢٤٧) — القالب الخارجي للبوابة: mhead + mbody#ckbody */
function CkModal(){
return <>
<div className="mhead"><b>🔒 بوابة الطلب الآمن</b><button className="x" onClick={()=>closeModal()}>✕</button></div>
<div className="mbody" id="ckbody">
<CkBody/>
</div>
</>;}
/* ckBody (السطر ١٢٥٥) — منطقة #ckbody: خطوات cksteps ثم محتوى ckBody بالترتيب نفسه
 * (ckRefresh الأصلية كانت تعيد بناء هذه المنطقة كاملة عبر innerHTML) */
export function CkBody(){
const t=useUI('ckbody');
const steps=['الحساب','الموقع','الدفع'];
const bars=steps.map((s,i)=><div key={i} className={'ckstep '+(CK.step===i?'on':(CK.step>i||((i===0)&&SES)?'done':''))}><div className="b"></div>{s}</div>);
return <Fragment key={t}>
<div className="cksteps">{bars}</div>
{ckBody()}
</Fragment>;}
function ckBody(){
if(CK.step===0)return <>
<div className="demo mb"><b style={{fontSize:'13px'}}>🛡️ خطوة واحدة قبل الحجز</b>
<p className="hint" style={{marginTop:'3px'}}>سلتك محفوظة كما هي — سجّل دخولك أو أنشئ حساباً لإكمال الحجز في خزنة ضمين.</p></div>
<div className="fld"><label>رقم الجوال</label><input className="inp" id="lg-ph" placeholder="05xxxxxxxx" defaultValue="0500000001"/></div>
<div className="fgrid mt">
<div className="fld"><label>كلمة المرور</label><input className="inp" type="password" id="lg-pw" defaultValue="1234"/></div>
<div className="fld" style={{display:'flex',alignItems:'flex-end'}}><button className="btn wide" onClick={()=>ckLogin()}>دخول ومتابعة</button></div>
</div>
<div className="hr"></div>
<p className="hint" style={{textAlign:'center'}}>أو جرب بحساب تجريبي:</p>
<div className="fgrid" style={{gridTemplateColumns:'1fr 1fr 1fr',gap:'8px'}}>
<button className="btn soft sm" onClick={()=>ckQuick('customer')}>🛍️ عميل</button>
<button className="btn soft sm" onClick={()=>ckQuick('merchant')}>🏪 تاجر</button>
<button className="btn soft sm" onClick={()=>ckQuick('admin')}>🛡️ إدارة</button></div>
<p className="hint mt" style={{textAlign:'center'}}>جديد على ضمين؟ <a style={{color:'var(--amb)',fontWeight:700,cursor:'pointer'}} onClick={()=>{closeModal();openAuth(undefined)}}>أنشئ حساباً</a> ثم عُد لإتمام طلبك.</p>
</>;
if(CK.step===1){const u=me();
return <>
<b style={{fontSize:'13.5px'}} className="fx">📍 عنوان التسليم</b>
<p className="hint" style={{marginTop:'3px'}}>🚚 التوصيل عبر شركاء ضمين اللوجستيين (OTO / Torod) فقط — لا يوجد استلام شخصي «يد بيد»، ويُتابع الطلب بالحالات لحفظ حقوق الطرفين.</p>
<div className="mt mb" style={{display:'flex',gap:'8px',flexWrap:'wrap'}}>
<button className="btn soft sm" onClick={()=>useGeo()}>🛰️ تحديد موقعي تلقائياً</button>
{(CK as any).geo?<span className="tag grn">✓ تم تحديد الموقع (٢٤٫٧١٣٦، ٤٦٫٦٧٥٣)</span>:null}
</div>
{u.addrs&&u.addrs.length?u.addrs.map((a,i)=><div className={'addrcard '+(CK.addr===i?'on':'')} key={i} onClick={()=>{CK.addr=i;ckRefresh()}}>
<div className="rd"></div><div style={{flex:1}}><b style={{fontSize:'12.5px'}}>{a.t} {a.def?<span className="tag grn" style={{fontSize:'9px'}}>افتراضي</span>:''}</b><div className="hint">{a.a}</div></div></div>):<p className="hint mb">لا عناوين محفوظة — أضف عنواناً واحداً على الأقل.</p>}
<div className="acard" style={{padding:'13px',marginTop:'10px'}}>
<b style={{fontSize:'12.5px'}}>➕ عنوان جديد</b>
<div className="fgrid mt">
<div className="fld"><label>الاسم المختصر</label><input className="inp" id="na-t" placeholder="مثال: المنزل"/></div>
<div className="fld"><label>المدينة</label><input className="inp" id="na-c" placeholder="الرياض"/></div>
</div>
<div className="fld mt"><label>العنوان التفصيلي</label><input className="inp" id="na-a" placeholder="الحي، الشارع، رقم المبنى…"/></div>
<button className="btn soft sm mt" onClick={()=>ckSaveAddr()}>حفظ العنوان</button>
</div>
{ckExtras()}
<div className="spread mt">
<button className="btn gray sm" onClick={()=>ckBack()}>→ رجوع</button>
<button className="btn sm" onClick={()=>ckNext()}>متابعة للدفع ←</button>
</div>
</>;}
if(CK.step===2){const c=cartCalc();const u=me();
return <>
<b style={{fontSize:'13.5px'}} className="fx">💳 طريقة الدفع</b>
<p className="hint mb">يُخصم المبلغ منك ويُحجز في خزنة ضمين المستقلة — لا يصل للتاجر مباشرة.</p>
<div className="pays">
{[['mada','💳','مدى','بوابة Moyasar'],['visa','🏦','فيزا / ماستركارد','بوابة HyperPay'],['apple','🍎','Apple Pay','بوابة Moyasar'],['tabby','🅣','تابي','قسّمها على ٤ دفعات'],['tamara','🔵','تمارا','قسّمها على ٣ دفعات'],['bal','🌟','محفظة ضمين','رصيدك '+ard(u.bal||0)+' ر.س']].map(([k,i,n,s])=><button key={k} className={'pay '+(CK.pay===k?'on':'')} onClick={()=>{CK.pay=k;ckRefresh()}}><i>{i}</i><b>{n}</b><span>{s}</span></button>)}
</div>
{(CK.pay==='tabby'||CK.pay==='tamara')?<div className="acard mt" style={{padding:'12px',background:'#1D44320a',borderColor:'#1D443233'}}><b className="fx" style={{fontSize:'12.5px'}}>{CK.pay==='tabby'?'🅣 تابي — ٤ دفعات شهرية بلا فوائد ولا رسوم':'🔵 تمارا — ٣ دفعات بلا فوائد'}</b>
<div className="srow mt" style={{padding:'3px 0'}}><span>إجمالي الفاتورة (منتجات + شحن + ضريبة)</span><b>{money(c.total)}</b></div>
<div className="srow disc"><span>دفعتك الأولى الآن</span><b>{money(r2(c.total/(CK.pay==='tabby'?4:3)))}</b></div>
<div className="hint">يُقسّم كامل الفاتورة (المنتجات + الشحن + الضريبة) — والتحرير للتاجر يبقى بضمان ضمين.</div></div>:null}
{CK.pay==='bal'&&u.bal<c.total?<p className="hint" style={{color:'var(--red)',marginTop:'8px'}}>⚠️ رصيد محفظتك لا يكفي — اختر طريقة أخرى.</p>:null}
{CK.pay==='visa'?<div className="acard mt" style={{padding:'12px'}}><div className="fgrid"><div className="fld"><label>رقم البطاقة</label><input className="inp" placeholder="٤٢٤٢ ٤٢٤٢ ٤٢٤٢ ٤٢٤٢"/></div><div className="fld"><label>تاريخ الانتهاء / CVC</label><input className="inp" placeholder="١٢/٢٨ · ١٢٣"/></div></div></div>:null}
<div className="demo" style={{marginTop:'10px'}}><b style={{fontSize:'11.5px'}}>🧮 كيف يتوزع مبلغك؟</b>
<div className="hint" style={{marginTop:'3px',lineHeight:'1.9'}}>قيمة المنتجات: صافي التاجر بعد عمولة ضمين (تحددها الإدارة لكل تصنيف) · رسوم الشحن: تُحوّل لحساب الشريك اللوجستي · الضريبة ١٥٪: لصالح هيئة الزكاة والضريبة — والتحرير لا يتم إلا بعد استلامك ورضاك.</div></div>
<div className="hr"></div>
<div className="srow"><span>المنتجات والشحن (بعد الخصومات)</span><b>{money(c.net)}</b></div>
<div className="srow"><span>ضريبة القيمة المضافة ١٥٪</span><b>{money(c.tax)}</b></div>
<div className="srow tot"><span>إجمالي الحجز في الخزنة</span><b>{money(c.total)}</b></div>
<div className="srow"><span>التسليم إلى</span><span style={{fontSize:'11.5px'}}>{(CK as any).addrTxt||addrTxt()}</span></div>
<div className="spread mt">
<button className="btn gray sm" onClick={()=>ckBack()}>→ رجوع</button>
<button className="btn amb" onClick={()=>placeOrder()}>🔒 ادفع واحجز في الخزنة</button>
</div>
</>;}
const og:any=DB.orders.find(x=>x.id===(CK as any).oid);const g0=(og&&(CK as any).chatG!=null)?og.groups[(CK as any).chatG]:null;
return <div style={{textAlign:'center',padding:'8px 4px'}}>
<div className="bigok">✅</div>
<b className="fx" style={{fontSize:'17px'}}>تم حجز مبلغك في خزنة ضمين!</b>
<p className="hint mt" style={{lineHeight:'1.9'}}>رقم طلبك <b style={{color:'var(--grn)'}}>#{ar((CK as any).oid)}</b><br/>أُرسلت طلباتك إلى {ar((CK as any).gcount)} متجر — كل شحنة ببوليصة مستقلة.<br/>📄 أُصدرت {ar((CK as any).wb||0)} بوليصة شحن آلية وأُرسلت طلبات الاستلام للمناديب · فُتحت محادثة الطلب مع كل متجر (بلا أرقام ولا روابط).{og&&og.groups.some(g=>g.digi)?<><br/>⚡ مشترياتك الرقمية سُلّمت فوراً إلى «مكتبتك الرقمية».</>:null}<br/>💡 للعميل: يمكنك فتح نزاع خلال نافذة الحماية قبل التحرير التلقائي.</p>
<div className="impdone">🌟 <b>شكراً لك!</b> باسم طلبك هذا اقتطعت ضمين <b>٠٫٥٠ ر.س من أرباحها</b> — لا من مبلغك ولا من التاجر — واعتمدتها لأعمال الخير.<br/><small>إجمالي مساهماتك الخيرية عبر طلباتك بلغ <b>{money(IMP.users[SES.phone]||0)}</b> — تابعها في «حسابي» 🌱</small></div>
{g0?<button className="btn wide mt" onClick={()=>{closeModal();const oc=(Orders as any).openOChat;if(oc)oc((CK as any).oid,(CK as any).chatG)}}>💬 دردشة التنسيق/التعديلات مع {ST(g0.store).name}</button>:null}
{og&&og.groups.some(g=>g.digi)?<button className="btn wide mt" onClick={()=>{closeModal();go('dlib',undefined)}}>📚 مكتبتي الرقمية — الكود/الملف جاهز</button>:null}
<button className="btn wide mt" onClick={()=>{closeModal();go('orders',undefined)}}>📦 تتبع طلبي</button>
<button className="btn gray wide mt" onClick={()=>{closeModal();go('home',undefined)}}>مواصلة التسوق</button></div>;
}
/* ckRefresh (السطر ١٣٣٢) — كانت تعيد بناء #ckbody فقط ⇒ نبضة المنطقة */
export function ckRefresh(){bumpUI('ckbody')}
/* ckLogin (السطر ١٣٣٣ حرفياً) */
export function ckLogin(){doLogin();if(SES&&SES.role==='customer'){CK.step=1;CK.addr=me().addrs&&me().addrs.length?0:-1;ckRefresh()}}
/* ckQuick (السطر ١٣٣٤ حرفياً) */
export function ckQuick(r){quickLogin(r);if(SES&&SES.role==='customer'){CK.step=1;CK.addr=me().addrs&&me().addrs.length?0:-1;ckRefresh()}}
/* ckNext (السطر ١٣٣٥ حرفياً) */
export function ckNext(){if(CK.addr<0){toast('اختر عنواناً أو أضف عنواناً جديداً','err');return}CK.step=2;ckRefresh()}
/* ckBack (السطر ١٣٣٦ حرفياً) */
export function ckBack(){CK.step=Math.max(SES?1:0,CK.step-1);ckRefresh()}
/* addrTxt (السطر ١٣٣٧ حرفياً) */
export function addrTxt(){const u=me();return u&&u.addrs&&u.addrs[CK.addr]?u.addrs[CK.addr].a:''}
/* useGeo (السطر ١٣٣٨ حرفياً) */
export function useGeo(){
if(!navigator.geolocation){toast('تحديد الموقع غير مدعوم — أضف العنوان يدوياً','amb');return}
toast('جارٍ تحديد موقعك…',undefined);
navigator.geolocation.getCurrentPosition(
p=>{(CK as any).geo={lat:+p.coords.latitude.toFixed(4),lng:+p.coords.longitude.toFixed(4)};toast('تم تحديد موقعك ✓','ok');ckRefresh()},
()=>toast('تعذر تحديد الموقع — أضف العنوان يدوياً','amb'),{timeout:8000});
}
/* ckSaveAddr (السطر ١٣٤٥ حرفياً) */
export function ckSaveAddr(){
const t=($('#na-t')||{value:''}).value.trim(),c=($('#na-c')||{value:''}).value.trim(),a=($('#na-a')||{value:''}).value.trim();
if(!t||!a){toast('اكتب الاسم المختصر والعنوان التفصيلي','err');return}
const u=me();u.addrs=u.addrs||[];u.addrs.push({t,a:(c?c+'، ':'')+a});
CK.addr=u.addrs.length-1;toast('حُفظ العنوان ✓','ok');ckRefresh();
}
/* ===== خيارات التسليم الخاصة لكل شحنة ===== */
export function ckSetAns(sid,i,v){((CK as any).ans[sid]=(CK as any).ans[sid]||[])[i]=v}
export function ckSetBook(sid,k,v){((CK as any).book[sid]=(CK as any).book[sid]||{});(CK as any).book[sid][k]=v}
export function ckSetGift(sid,k,v){((CK as any).gift[sid]=(CK as any).gift[sid]||{on:false,name:'',phone:'',city:''});(CK as any).gift[sid][k]=v}
export function ckGiftTog(sid){const g=(CK as any).gift[sid]||{on:false,name:'',phone:'',city:''};g.on=!g.on;(CK as any).gift[sid]=g;ckRefresh()}
export function ckEventGeo(sid){
if(!navigator.geolocation){toast('تحديد الموقع غير مدعوم — اكتب ملاحظة الموقع بدلاً منه','amb');return}
toast('جارٍ تحديد موقع المناسبة…',undefined);
navigator.geolocation.getCurrentPosition(
p=>{((CK as any).book[sid]=(CK as any).book[sid]||{});(CK as any).book[sid].geo={lat:+p.coords.latitude.toFixed(4),lng:+p.coords.longitude.toFixed(4)};toast('وصل موقع المناسبة لفريق التنسيق ✓','ok');ckRefresh()},
()=>toast('تعذر تحديد الموقع — جرّب مرة أخرى','amb'),{timeout:8000});
}
/* ckExtras (السطر ١٣٦٣ حرفياً) */
export function ckExtras(){
const c=cartCalc();const out:any[]=[];
Object.entries(c.groups).forEach(([sid,its])=>{
const st:any=ST(sid),sec=SEC(st.sec),q=c.quotes[sid];const blocks:any[]=[];
if(sec.id==='family'&&(st.qs||[]).length){
blocks.push(<>
<b style={{fontSize:'11.5px'}}>❓ أسئلة «{st.name}» قبل إعداد طلبك</b>
{st.qs.map((qq,i)=><div className="fld" style={{marginTop:'7px'}} key={i}><label>{qq}</label><input className="inp" style={{fontSize:'12px'}} defaultValue={((CK as any).ans[sid]||[])[i]||''} onInput={e=>ckSetAns(sid,i,e.currentTarget.value)}/></div>)}
<p className="hint" style={{marginTop:'5px'}}>تصلك إجاباتك مع الطلب مباشرة — أسئلة يحددها المتجر لقسم المأكولات والضيافة.</p>
</>);}
if(q.mode==='chilled')blocks.push(<div className="hint" style={{lineHeight:'1.8'}}>🧊 هذه الشحنة تضم منتجات حساسة للحرارة — {c.city===(st.city||'')?'سيُرسل مندوب مجهز بحافظة برودة (Cooling Box) داخل المدينة نفسها':'ستُشحن مبردة بين المدن عبر شركات الشحن المبرد المتعاقدة عبر بوابة OTO/Torod'} بعد تأكيد الطلب.</div>);
if(q.mode==='instant'&&!q.blocked)blocks.push(<div className="hint" style={{lineHeight:'1.8'}}>🛵 أطباق طازجة — سيبحث النظام عن مندوب فوري فور تأكيد طلبك داخل {c.city} فقط (نطاق {ar(st.rangeKm||20)} كم حول مدينة المتجر «{st.city}»)، ووقت التوصيل المتوقع ٤٥ دقيقة.</div>);
if(q.blocked)blocks.push(<div className="hint" style={{lineHeight:'1.8',color:'var(--red)',fontWeight:700}}>⛔ {q.blocked}</div>);
if(q.mode==='digital')blocks.push(<div className="hint" style={{lineHeight:'1.8'}}>⚡ منتجات رقمية — يُسلّم الكود/الملف فور الدفع إلى «مكتبتك الرقمية» عبر رابط مؤقت آمن (S3 Signed) صالح ١٠ دقائق، بدون شحن وبدون انتظار.</div>);
if(q.fragile)blocks.push(<div className="hint" style={{lineHeight:'1.8'}}>⚠️ شحنة قابلة للكسر — تُنقل العلامة آلياً لشركة الشحن (OTO/Torod) مع تنبيه تغليف خاص إلزامي في البوليصة، ورسوم حماية ١٥ ر.س مدرجة ضمن الشحن.</div>);
if(its.some(x=>x.p.customOk))blocks.push(<div className="hint" style={{lineHeight:'1.8'}}>✏️ هذا المتجر يقبل التعديلات حسب طلبك — بعد الدفع تفتح دردشة التعديلات مباشرة مع التاجر، ويقدر يطلب مبلغاً إضافياً لأي إضافة (يُحجز بضمان ضمين).</div>);
if(sec.id==='deco'&&its.some(x=>x.p.giftOk)){
const g=(CK as any).gift[sid]||{on:false,name:'',phone:'',city:''};
blocks.push(<>
<div className="spread"><b style={{fontSize:'11.5px'}}>🎁 إهداء لشخص آخر</b><button className={'sw '+(g.on?'on':'')} onClick={()=>ckGiftTog(sid)}></button></div>
{g.on?<><div className="fgrid" style={{marginTop:'7px'}}><div className="fld"><label>جوال المستلم (١٠ أرقام يبدأ بـ 05)</label><input className="inp" style={{fontSize:'12px'}} defaultValue={g.phone||''} onInput={e=>ckSetGift(sid,'phone',e.currentTarget.value)}/></div><div className="fld"><label>مدينة المستلم</label><input className="inp" style={{fontSize:'12px'}} placeholder="مثال: الرياض" defaultValue={g.city||''} onInput={e=>ckSetGift(sid,'city',e.currentTarget.value)}/></div></div>
<div className="fld" style={{marginTop:'7px'}}><label>اسم المستلم (اختياري — يُطبع على بطاقة الإهداء)</label><input className="inp" style={{fontSize:'12px'}} defaultValue={g.name||''} onInput={e=>ckSetGift(sid,'name',e.currentTarget.value)}/></div>
<p className="hint" style={{marginTop:'5px'}}>يكفي جوال المستلم ومدينته — تصدر البوليصة باسمه فتوصله الهدية مباشرة، وكل التواصل عبر ضمين فقط.</p></>:<p className="hint" style={{marginTop:'4px'}}>فعّل الخيار لإرسال هديتك لشخص غيرك — يُطلب جواله ومدينته فقط.</p>}
</>);}
if(q.mode==='field'){
const b=(CK as any).book[sid]||{};
blocks.push(<>
<b style={{fontSize:'11.5px'}}>🎪 حجز موعد المناسبة (إلزامي لخدمة التنسيق الميداني)</b>
<div className="fld" style={{marginTop:'7px'}}><label>🚚 طريقة تسليم المناسبة</label><select className="inp" style={{fontSize:'12px'}} defaultValue={b.dl==='pickup'?'pickup':'field'} onChange={e=>ckSetBook(sid,'dl',e.currentTarget.value)}>
<option value="field">فريق المتجر يوصل ويركّب في موقع المناسبة</option>
<option value="pickup">استلام من مقر المتجر — بلا توصيل (التنسيق عبر دردشة ضمين بعد الدفع)</option></select></div>
<div className="fgrid" style={{marginTop:'7px'}}>
<div className="fld"><label>تاريخ المناسبة</label><input type="date" className="inp" style={{fontSize:'12px'}} defaultValue={b.date||''} onChange={e=>ckSetBook(sid,'date',e.currentTarget.value)}/></div>
<div className="fld"><label>وقت التركيب</label><input type="time" className="inp" style={{fontSize:'12px'}} defaultValue={b.setup||''} onChange={e=>ckSetBook(sid,'setup',e.currentTarget.value)}/></div>
<div className="fld"><label>وقت الفك / الاسترجاع</label><input type="time" className="inp" style={{fontSize:'12px'}} defaultValue={b.tear||''} onChange={e=>ckSetBook(sid,'tear',e.currentTarget.value)}/></div>
<div className="fld"><label>ملاحظة لفريق التنسيق</label><input className="inp" style={{fontSize:'12px'}} placeholder="مثال: الدخول من البوابة الشمالية" defaultValue={b.note||''} onInput={e=>ckSetBook(sid,'note',e.currentTarget.value)}/></div>
</div>
<div style={{display:'flex',gap:'8px',alignItems:'center',marginTop:'8px',flexWrap:'wrap'}}>
<button className="btn soft sm" onClick={()=>ckEventGeo(sid)}>📍 مشاركة موقع المناسبة (GPS)</button>
{b.geo?<span className="tag grn">✓ وصل الموقع لفريق التنسيق ({ard(b.geo.lat)}، {ard(b.geo.lng)})</span>:<span className="hint">لتوجيه فريق التنسيق بدقة يوم المناسبة</span>}
</div>
</>);}
if(blocks.length)out.push(<div className="acard" style={{padding:'12px',marginTop:'10px',borderColor:st.color+'55'}} key={sid}><div className="spread" style={{marginBottom:'5px'}}><b className="fx" style={{fontSize:'12px'}}>🚚 خيارات التسليم — {st.name}</b><span className="tag" style={{background:st.color+'18',color:st.color}}>{q.label}</span></div>{blocks.map((bb,bi)=><Fragment key={bi}>{bi?<div className="hr" style={{margin:'9px 0'}}></div>:null}{bb}</Fragment>)}</div>);
});
return out;
}
/* placeOrder (السطر ١٤٠٥ حرفياً) */
export function placeOrder(){
const u=me();const c=cartCalc();
if(CK.addr<0||!u.addrs[CK.addr]){toast('حدد عنوان التسليم أولاً','err');CK.step=1;ckRefresh();return}
if(CK.pay==='bal'&&u.bal<c.total){toast('رصيد المحفظة لا يكفي','err');return}
for(const [sid,its] of Object.entries(c.groups)){
const q=c.quotes[sid];
if(q.blocked){toast(q.blocked,'err');CK.step=1;ckRefresh();return}
if(q.mode==='field'){const b=(CK as any).book[sid]||{};if(!b.date||!b.setup){toast('أكمل حجز موعد المناسبة (التاريخ ووقت التركيب) لشحنة '+ST(sid).name,'err');CK.step=1;ckRefresh();return}}
const gft=(CK as any).gift[sid];
if(gft&&gft.on&&(!/^05\d{8}$/.test((gft.phone||'').replace(/\s/g,''))||!((gft.city||'').trim()))){toast('أكمل بيانات الإهداء — جوال مستلم يبدأ بـ 05 + مدينته','err');CK.step=1;ckRefresh();return}
}
(CK as any).addrTxt=u.addrs[CK.addr].a;
CK.step=3;(CK as any).oid=OID;(CK as any).gcount=Object.keys(c.groups).length;(CK as any).wb=0;
const o:any={id:OID++,customer:SES.phone,at:Date.now(),pay:CK.pay,addr:(CK as any).addrTxt,city:c.city,
coupon:{code:CPN,amt:c.cpn},ptsUsed:c.ptsUse,ptsAmt:c.ptsAmt,freeDl:c.fd,net:c.net,tax:c.tax,total:c.total,
groups:Object.entries(c.groups).map(([sid,its])=>{const st:any=ST(sid),q=c.quotes[sid];
const bk=(CK as any).book[sid]||{};
const pans=[];its.forEach(x=>{if(x.ans&&x.ans.length)pans.push({pn:x.p.name,ans:x.ans.map(y=>({q:y.q,a:y.a}))})});
const grp:any={store:sid,
items:its.map(x=>({pid:x.pid,qty:x.qty,price:eff(x.p)})),
sub:r2(its.reduce((a,x)=>a+eff(x.p)*x.qty,0)),dl:q.charge,status:'pending',
ship:{mode:q.mode,cost:q.cost,charge:q.charge,subsidy:q.subsidy,source:q.source,why:q.why,label:q.label,fragile:q.fragile},
logi:q.mode==='field'?{wb:null,courier:bk.dl==='pickup'?'استلام من مقر المتجر — بلا توصيل':'توصيل وتركيب فريق المتجر',mode:'field',events:[{t:bk.dl==='pickup'?'استلام من المقر — بلا بوليصة شحن، والتنسيق عبر دردشة ضمين بعد الدفع':'خدمة ميدانية — بلا بوليصة آلية، الحجز بموعد المناسبة',at:Date.now()}]}:
q.mode==='digital'?{wb:null,courier:'تسليم رقمي فوري (ضمين ديجيتال)',mode:'digital',events:[{t:'سُلّم المحتوى الرقمي فور الدفع إلى مكتبة العميل — عبر رابط مؤقت موقّع (S3 Signed URL)',at:Date.now()}]}:
mkLogi(q.mode,sid+OID),
chat:[{r:'sys',t:'فُتحت محادثة الطلب — للتفاصيل والطلبات الخاصة فقط. ممنوع تبادل الأرقام أو الروابط أو أي وسيلة تواصل خارج ضمين (الإدارة تُتابع تلقائياً وحجب المخالف فوري).',at:Date.now()}],
viol:{customer:0,merchant:0}};
if(q.fragile&&grp.logi)grp.logi.events.unshift({t:'⚠️ علامة «قابل للكسر» نُقلت آلياً لشركة الشحن ('+grp.logi.courier+') — تغليف خاص إلزامي في البوليصة + رسوم حماية ١٥ ر.س ضمن الشحن',at:Date.now()});
if(q.mode==='field')grp.booking=(CK as any).book[sid];
if(q.mode==='digital'){
grp.status='received';grp.digi=true;grp.complaintUntil=Date.now()+secOf(sid).winMin*60e3;
grp.chat.push({r:'sys',t:'⚡ سُلّم المحتوى الرقمي فوراً — الكود/الملف في «مكتبتك الرقمية»، ومبلغك محجوز بضمان ضمين حتى نهاية نافذة الحماية.',at:Date.now()});
u.dlib=u.dlib||[];
its.filter(x=>x.p.ptype==='digital'&&x.p.digi).forEach(x=>u.dlib.unshift({pid:x.p.id,name:x.p.name,store:sid,kind:x.p.digi.kind,val:x.p.digi.val,size:x.p.digi.size||'',at:Date.now(),oid:OID-1}));}
if(its.some(x=>x.p.customOk)){grp.custom=true;grp.chat.push({r:'sys',t:'✏️ دردشة التعديلات مفتوحة — حدد طلبك بدقة، ويقدر التاجر يطلب مبلغاً إضافياً لأي تعديل يتفقان عليه (يُحجز بضمان ضمين حتى الاستلام).',at:Date.now()})}
if((CK as any).gift[sid]&&(CK as any).gift[sid].on)grp.gift={name:(((CK as any).gift[sid].name)||'').trim(),phone:(((CK as any).gift[sid].phone)||'').trim(),city:(((CK as any).gift[sid].city)||'').trim()};
if(st.qs&&st.qs.length)grp.ans=st.qs.map((qq,i)=>({q:qq,a:((((CK as any).ans[sid]||[])[i])||'').trim()})).filter(x=>x.a);
if(pans.length)grp.pans=pans;
if(q.mode!=='field'&&q.mode!=='digital')(CK as any).wb++;
return grp})};
if(c.fd)o.freeDl=true;
if(CK.pay==='bal'){u.bal=r2((u.bal||0)-c.total);o.paidBy='محفظة ضمين'}
if(CK.pay==='tabby')o.inst={by:'تابي',n:4,each:r2(c.total/4)};
if(CK.pay==='tamara')o.inst={by:'تمارا',n:3,each:r2(c.total/3)};
DB.vat=r2((DB.vat||0)+c.tax);
if(CPN&&DB.coupons[CPN])DB.coupons[CPN].uses=(DB.coupons[CPN].uses||0)+1;
if(c.fd){u.pts=(u.pts||0)-c.fdN;u.ptsLog.unshift({t:'استبدال نقاط بتوصيل مجاني في الطلب #'+(OID-1),v:-c.fdN,at:Date.now()})}
if(c.ptsUse){u.pts=(u.pts||0)-c.ptsUse;u.ptsLog.unshift({t:'استبدال نقاط في الطلب #'+(OID-1),v:-c.ptsUse,at:Date.now()})}
DB.orders.unshift(o);
impAdd(o);
let chatG=-1;
o.groups.forEach((g,gi)=>{const own=ST(g.store).owner;
if(own&&USERS[own])pushNotif(own,g.digi?'⚡':'📦','طلب جديد'+(g.digi?' رقمي — سُلّم فوراً للعميل':' بانتظار قبولك'),'عميل جديد أرسل طلباً بقيمة '+money(g.sub),['m-orders']);
if(chatG<0&&(g.custom||(g.ship&&g.ship.mode==='field')))chatG=gi});
pushNotif(SES.phone,'🔒','تم حجز مبلغ طلبك','مبلغ '+money(c.total)+' محجوز بأمان في خزنة ضمين',['orders']);
if(o.groups.some(g=>g.digi))pushNotif(SES.phone,'⚡','مشترياتك الرقمية جاهزة','الكود/الملف في «مكتبتك الرقمية» — تسليم فوري بضمان ضمين',['dlib']);
if(chatG>=0){(CK as any).chatG=chatG;const g=o.groups[chatG];
pushNotif(SES.phone,'💬','فُتحت دردشة مع '+ST(g.store).name,'شارك تفاصيلك وموقعك عبر الدردشة — التواصل داخل ضمين فقط',['orders']);
toast('💬 فُتحت دردشة التنسيق/التعديلات مع '+esc(ST(g.store).name),'ok')}
setCART([]);setCPN(null);setPTS(0);setFREE_DL(false);
ckRefresh();
if(chatG>=0)setTimeout(()=>{if($('#ckbody')&&$('#modals').innerHTML){const oc=(Orders as any).openOChat;if(oc)oc((CK as any).oid,chatG)}},1500);
}
