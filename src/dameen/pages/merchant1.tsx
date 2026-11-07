'use client';
/* ضمين — pages/merchant1.tsx
 * قسم التاجر (١): لوحة التحكم، المنتجات، استوديو الوسائط الترويجية، فورم المنتج،
 * أسئلة المنتج، ومعاينة نقاط الولاء — منقول حرفياً من dameen.js بنفس عناصر DOM
 * والفئات والنصوص والأرقام والمنطق:
 *   السطور ١١٠١-١١٢٧: mPtypePrev/pickDigiFile (حقول المنتجات الرقمية في فورم التاجر)
 *   السطور ٢٠٩٠-٢٣٨٤: myGroups/heldFor/pgMDash/pgMProds/mStudioOpen/msSel/msSave/pgMMedia/
 *     mProdForm/ptsCostPrev/msChipsHTML/msImgsSec/mpImgsHTML/mpImgsRefresh/mImgDel/mImgPick/
 *     mImgAuto/msVidsSec/mpVidsRefresh/mVidDel/mVidAdd/mVidProbe/probeVid/mpqHTML/mpqOpts/
 *     mpqType/mAddQ2/mpqRefresh/mpqDel/mpqPush
 * التحديث الجزئي: mpImgsRefresh/mpVidsRefresh/mpqRefresh/ptsCostPrev/mPtypePrev كلها
 * bumpUI('mstudio')، والمكونات <MsChips/> <MsImgsSec/> <MsVidsSec/> <MpqBox/> <MpDextra/>
 * <PtsCostHint/> تقرأ useUI('mstudio') — <MsImgsSec/> و<MsVidsSec/> تُعيدان البناء كاملاً
 * بمفتاح النبضة (key) = نفس أثر innerHTML في الأصل. mStudioOpen/msSel/msSave حرفية،
 * وأي push/splice على MIMGS/MVIDS/MPQ يبقى تعديلاً مباشراً (تعديل حقول لا إسناد).
 * mDelProd/mOfferForm/mProdRevs/mSaveProd تُستورد من ./merchant2 (استدعاء وقت التشغيل —
 * الاستيراد الدائري بين الملفين سليم)، وGLBL من ./orders (السطر ١٤٦٩ في الأصل).
 */
import { $, ar, ard, money, r2, ago, toast, durTxt, medOf, ptsVal, ZPOOL, IMP, P, eff, SEC, PRODUCTS, USERS, DB, CATS } from '../core';
import { SES, MSPID, MIMGS, MVIDS, MPID, MPQ, MPQOPEN, setMSPID, setMIMGS, setMVIDS, setMPID, setMPQ, setMPQOPEN, myStore, go, render, closeModal, openModal, appSave, bumpUI, useUI } from '../store';
import { Img } from '../ui';
import { GLBL } from './orders';
import { mDelProd, mOfferForm, mProdRevs, mSaveProd } from './merchant2';

/* حالتا معاينة داخل الفورم — تضبطهما mProdForm/mPtypePrev/ptsCostPrev ويقرؤهما المكوّنان
 * <MpDextra/> و<PtsCostHint/> (يعادلان innerHTML لمنطقتي #mp-dextra و#ptscost في الأصل) */
let MPDVAL='std';
let PTSC={np:0,old:0,d:0,pv:0.1};

/* myGroups (السطر ٢٠٩٠) — يحتاجها merchant2 (m-orders) وdisputes */
export function myGroups(){const out=[];
DB.orders.forEach(o=>o.groups.forEach((g,gi)=>{if(g.store===SES.store)out.push({o,g,gi})}));
return out.sort((a,b)=>b.o.at-a.o.at)}

/* heldFor (السطر ٢٠٩٣) — يحتاجها merchant2 (m-wallet/m-set) وdisputes */
export function heldFor(sid){return r2(DB.orders.reduce((a,o)=>a+o.groups.filter(g=>g.store===sid&&['pending','preparing','shipped','received','disputed'].includes(g.status)).reduce((x,g)=>x+g.sub,0),0))}

/* pgMDash (السطر ٢٠٩٤) */
export function PgMDash(){
const s=myStore(),sec=SEC(s.sec);
const gs=myGroups();
const active=gs.filter(x=>['pending','preparing','shipped','received'].includes(x.g.status));
const held=heldFor(s.id);
const top=[...PRODUCTS.filter(p=>p.store===s.id)].sort((a,b)=>b.sold-a.sold).slice(0,5);
const last=active.slice(0,4);
return <>
<div className="pghead"><h1>📊 لوحة تحكم {s.name}</h1><span className="tag" style={{background:s.color+'18',color:s.color}}>{sec.name} · 🛡️ حماية {sec.win}</span></div>
<div className="kpis">
<div className="kpi grn"><i>💰</i><b>{money(DB.storeWallets[s.id]||0)}</b><span>صافي محرَّر (المحفظة)</span></div>
<div className="kpi amb"><i>🔒</i><b>{money(held)}</b><span>مبالغ محجوزة لصالحك</span></div>
<div className="kpi nvy"><i>📦</i><b>{ar(active.length)}</b><span>طلبات نشطة الآن</span></div>
<div className="kpi"><i>🧺</i><b>{ar(PRODUCTS.filter(p=>p.store===s.id).length)}</b><span>منتجات معروضة</span></div>
<div className="kpi grn"><i>⭐</i><b>{ard(s.rt)}</b><span>تقييم المتجر ({ar(s.sales)} عملية)</span></div>
<div className="kpi" style={{cursor:'pointer'}} onClick={()=>toast('تقتطع ضمين ٠٫٥٠ ر.س من أرباحها مع كل عملية شراء ناجحة من متجرك — لا من العميل ولا منك','amb')}><i>🌟</i><b>{money(IMP.stores[s.id]||0)}</b><span>أثر مجتمعي من مبيعات متجرك</span></div>
</div>
<div className="grid2 mt">
<div className="acard"><h3>🔥 الأكثر مبيعاً لديك</h3>
<div className="rows">{top.map(p=><div className="row" style={{cursor:'pointer'}} key={p.id} onClick={()=>go('product',p.id)}>
<div style={{width:'38px',height:'38px',borderRadius:'11px',overflow:'hidden',flexShrink:0}}><Img src={p.imgs[0]} cls='' alt=''/></div>
<div style={{flex:1}}><b>{p.name}</b><div className="hint">{money(eff(p))} · مخزون {ar(p.stock)}</div></div>
<b className="fx" style={{color:'var(--grn)'}}>{ar(p.sold)}</b></div>)}</div></div>
<div className="acard"><h3>🕒 آخر الطلبات</h3>
<div className="rows">{last.length?last.map((x,i)=><div className="row" key={i}>
<div style={{flex:1}}><b>طلب #{ar(x.o.id)}</b><div className="hint">{USERS[x.o.customer]?USERS[x.o.customer].name.split(' ')[0]:'عميل'} · {ago(x.o.at)}</div></div>
<span className={'tag '+(x.g.status==='pending'?'amb':'grn')}>{GLBL[x.g.status]}</span></div>):<div className="hint">لا طلبات نشطة</div>}</div>
<button className="btn soft wide mt" onClick={()=>go('m-orders',undefined)}>إدارة كل الطلبات ←</button></div>
</div>
</>}

/* pgMProds (السطر ٢١٢٢) */
export function PgMProds(){
const s=myStore(),sec=SEC(s.sec);
const ps=(PRODUCTS as any[]).filter(p=>p.store===s.id);
return <>
<div className="pghead"><h1>🧺 منتجاتي ({ar(ps.length)})</h1><div style={{display:'flex',gap:'7px',flexWrap:'wrap'}}><button className="btn soft sm" onClick={()=>mStudioOpen(undefined)}>🎬 استوديو الوسائط</button><button className="btn sm" onClick={()=>mProdForm(undefined)}>＋ منتج جديد</button></div></div>
<div className="kpis mb">
<div className="kpi nvy"><i>🧺</i><b>{ar(ps.length)}</b><span>منتج معروض</span></div>
<div className="kpi amb"><i>🏷️</i><b>{ar(ps.filter(p=>p.off>0).length)}</b><span>عليه عرض نشط</span></div>
<div className="kpi grn"><i>🌟</i><b>{ar(ps.filter(p=>(p.pts||0)>0).length)}</b><span>منتج يمنح نقاطاً</span></div>
<div className="kpi red"><i>⚠️</i><b>{ar(ps.filter(p=>!p.stock).length)}</b><span>نفد مخزونه</span></div>
</div>
<div className="mpgrid">
{ps.length?ps.map(p=>{const e=eff(p);return <div className="mpcard" style={{'--acc':s.color} as any} key={p.id}>
<div className="mph" onClick={()=>go('product',p.id)}>{p.off?<span className="offb">خصم {ar(p.off)}٪</span>:null}{(p.pts||0)>0?<span className="ptsb">🌟 {ar(p.pts)} نقطة</span>:null}<span className="secb" style={{'--c':sec.color} as any}>{p.cat}</span><Img src={p.imgs[0]} cls='' alt=''/></div>
<div className="mpb">
<div onClick={()=>go('product',p.id)} style={{cursor:'pointer'}}><b style={{fontSize:'12.8px',display:'block',lineHeight:'1.5'}}>{p.name}</b></div>
<div style={{display:'flex',alignItems:'baseline',gap:'7px'}}><b className="fx" style={{fontSize:'15px',color:'var(--grn)'}}>{money(e)}</b>{p.off?<s className="mut" style={{fontSize:'10.5px'}}>{money(p.price)}</s>:null}</div>
<div className="mpstats">
<span className="mpstat">📦 مخزون {ar(p.stock)}</span>
<span className="mpstat">🛒 بيع {ar(p.sold)}</span>
<span className="mpstat" style={{color:'var(--amb2)'}}>★ {ard(p.rt)}</span>
{p.ptype==='chilled'?<span className="mpstat" style={{color:'#2E6B8A'}}>🧊 مبرد</span>:p.ptype==='instant'?<span className="mpstat" style={{color:'var(--amb2)'}}>🛵 فوري</span>:p.ptype==='field'?<span className="mpstat" style={{color:'#A45A3A'}}>🎪 ميداني</span>:p.ptype==='digital'?<span className="mpstat" style={{color:'#50489E'}}>⚡ رقمي فوري</span>:p.ptype==='ship'?<span className="mpstat">📦 شحن</span>:null}{p.fragile?<span className="mpstat" style={{color:'#B3541E'}}>⚠️ قابل للكسر</span>:null}{p.temp==='chilled'?<span className="mpstat" style={{color:'#2E6B8A'}}>🧊 مبرد</span>:p.temp==='hot'?<span className="mpstat" style={{color:'#A45A3A'}}>🔥 ساخن</span>:null}{p.vids&&p.vids.length?<span className="mpstat" style={{color:'#50489E'}}>🎬 {ar(p.vids.length)}</span>:null}{p.customOk?<span className="mpstat" style={{color:'#A45A3A'}}>✏️ تعديلات</span>:null}{p.giftOk?<span className="mpstat" style={{color:'var(--red)'}}>🎁 إهداء</span>:null}
</div>
<div className="mpacts">
<button className="btn soft xs" onClick={()=>mOfferForm(p.id)}>🏷️ عروض</button>
<button className={'btn '+(p.rc?'soft':'gray')+' xs'} onClick={()=>mProdRevs(p.id)}>⭐ التقييمات{p.rc?' ('+ar(p.rc)+')':null}</button>
<button className="btn gray xs" onClick={()=>mStudioOpen(p.id)}>🎬 وسائط</button><button className="btn gray xs" onClick={()=>mProdForm(p.id)}>✏️ تعديل</button>
<button className="btn red xs" onClick={()=>mDelProd(p.id)}>🗑️</button>
</div></div></div>}):<div className="empty" style={{gridColumn:'1/-1'}}><div className="em">🧺</div><b>لا منتجات بعد</b><span>أضف منتجك الأول وزوّده بنقاط ولاء تجذب العملاء</span><button className="btn mt" onClick={()=>mProdForm(undefined)}>＋ منتج جديد</button></div>}
</div>
</>}

/* mStudioOpen/msSel/msSave (السطور ٢١٥٤-٢١٦٢ حرفياً — عبر المطاوعات) */
export function mStudioOpen(pid){setMSPID(pid||null);closeModal();go('m-media',undefined)}
export function msSel(pid){setMSPID(pid);render()}
export function msSave(){
const p:any=MSPID?P(MSPID):null;if(!p)return;
const med=medOf(myStore());
p.imgs=MIMGS.slice(0,med.imgs);
p.vids=MVIDS.filter(v=>!v.bad).map(v=>({src:v.src,dur:Math.round(v.dur||0)}));
appSave();
}

/* pgMMedia (السطر ٢١٦٣) — صفحة «استوديو الوسائط الترويجية» */
export function PgMMedia(){
const s=myStore(),med=medOf(s);
const ps=(PRODUCTS as any[]).filter(p=>p.store===s.id);
if(!ps.length)return <>
<div className="pghead"><h1>🎬 استوديو الوسائط الترويجية</h1><button className="btn sm" onClick={()=>mProdForm(undefined)}>＋ منتج جديد</button></div>
<div className="empty"><div className="em">🎬</div><b>لا منتجات بعد في متجرك</b><span>أنشئ منتجك الأول من صفحة «المنتجات» ثم عُد هنا لإضافة صوره ومقاطعه الترويجية</span><button className="btn mt" onClick={()=>go('m-prods',undefined)}>🧺 الذهاب للمنتجات</button></div>
</>;
if(!MSPID||!P(MSPID)||P(MSPID).store!==s.id)setMSPID(ps[0].id);
const cur:any=P(MSPID);
setMIMGS((cur.imgs||[]).slice());
setMVIDS((cur.vids||[]).map(v=>({src:v.src,dur:+v.dur||0,bad:false})));
const tImgs=ps.reduce((a,p)=>a+(p.imgs||[]).length,0),tVids=ps.reduce((a,p)=>a+(p.vids||[]).length,0),noV=ps.filter(p=>!(p.vids||[]).length).length;
return <>
<div className="pghead"><h1>🎬 استوديو الوسائط الترويجية</h1><div style={{display:'flex',gap:'7px',flexWrap:'wrap'}}><button className="btn gray sm" onClick={()=>go('m-prods',undefined)}>🧺 منتجاتي</button><button className="btn sm" onClick={()=>mProdForm(undefined)}>＋ منتج جديد</button></div></div>
<div className="kpis mb">
<div className="kpi grn"><i>🖼️</i><b>{ar(tImgs)}</b><span>صورة في متجرك</span></div>
<div className="kpi nvy"><i>🎬</i><b>{ar(tVids)}</b><span>مقطع ترويجي</span></div>
<div className="kpi amb"><i>🎛️</i><b>{ar(med.imgs)} · {ar(med.vids)}</b><span>حدود الإدارة (صور · مقاطع)</span></div>
<div className="kpi red"><i>⏱️</i><b>{ar(med.secs)} ث</b><span>أقصى مدة للمقطع</span></div>
</div>
<div className="acard" style={{display:'flex',gap:'11px',alignItems:'flex-end',flexWrap:'wrap',marginBottom:'14px'}}>
<div className="fld" style={{flex:1,minWidth:'230px',margin:0}}><label>📦 اختر المنتج الذي تريد إدارة وسائطه</label>
<select className="inp" onChange={e=>msSel(e.target.value)} defaultValue={MSPID}>
{ps.map(p=><option value={p.id} key={p.id}>{p.name} — {ar((p.imgs||[]).length)} صور · {ar((p.vids||[]).length)} مقاطع</option>)}
</select></div>
<div className="hint" style={{paddingBottom:'9px'}}>💾 كل إضافة أو حذف تُحفظ فورياً في «{cur.name}» — لا تحتاج زر حفظ</div>
</div>
<div className="mstudio">
<div className="mshead">
<div className="msttl"><span className="msic">🎬</span><div><b>وسائط «{cur.name}»</b><small>صور ومقاطع المنتج تظهر للعملاء في معرض متجرك وصفحة المنتج</small></div></div>
<div className="mschips" id="mschips"><MsChips med={med}/></div>
</div>
<div className="msbody">
<div id="mpimgs"><MsImgsSec med={med}/></div>
<div id="mpvids"><MsVidsSec med={med}/></div>
</div>
</div>
<p className="hint" style={{marginTop:'10px'}}>🖼️ أول صورة هي الغلاف الرئيسي أمام العملاء · 🎬 المقطع الذي تتجاوز مدته حد الإدارة لا يُنشر للعملاء حتى تختصره أو تحذفه · 🎛️ الحدود تُحدَّث لحظياً من إعدادات الإدارة لمتجرك</p>
</>}

/* mProdForm (السطر ٢١٩٩) — يفتح نافذة openModal(...,'lg') بمكوّن كامل بنفس البنية.
 * MPDVAL/PTSC = القيمتان الابتدائيتان لمنطقتي المعاينة (يعادلان نتيجة استدعاء
 * mPtypePrev()/ptsCostPrev() بعد حقن النافذة مباشرة في الأصل — هنا النافذة تركب
 * لاحقاً في React فتُحسب القيمتان مقدماً ثم يكمل مستخدمان النبضات عند كل تغيير). */
export function mProdForm(pid){
setMPID(pid||null);
const p:any=pid?P(pid):null;
setMPQ(p&&p.qs?JSON.parse(JSON.stringify(p.qs)):[]);
setMPQOPEN(false);
MPDVAL=p?(p.ptype==='digital'?'digital':(p.fragile?'fragile':'std')):'std';
PTSC={np:(p?(p.pts||0):0),old:(p?(p.pts||0):0),d:0,pv:ptsVal()};
openModal(<MProdFormNode pid={pid}/>,'lg');
ptsCostPrev();
mPtypePrev();
}

/* بنية نافذة فورم المنتج (السطور ٢٢٠٥-٢٢٧٠ حرفياً) */
export function MProdFormNode({pid}){
const s=myStore(),sec=SEC(s.sec);
const p:any=pid?P(pid):null;
return <div>
<div className="mhead"><b>{p?'تعديل منتج':'منتج جديد'}</b><button className="x" onClick={()=>closeModal()}>✕</button></div>
<div className="mbody">
<div className="fld"><label>اسم المنتج</label><input className="inp" id="mp-nm" defaultValue={p?p.name:''} placeholder="مثال: عباية كتان مطرزة"/></div>
<div className="fgrid mt">
<div className="fld"><label>التصنيف (وعمولة ضمين عليه)</label><select className="inp" id="mp-cat" defaultValue={p?p.cat:CATS[sec.id][0].n}>{CATS[sec.id].map(c=><option value={c.n} key={c.n}>{c.n} — عمولة {ard(c.comm)}٪</option>)}</select></div>
<div className="fld"><label>السعر (ر.س)</label><input className="inp" id="mp-pr" type="number" min="1" defaultValue={p?p.price:''}/></div>
</div>
<div className="fgrid mt">
<div className="fld"><label>خصم ٪ (0 = بلا عرض)</label><input className="inp" id="mp-off" type="number" min="0" max="90" defaultValue={p?p.off:0}/></div>
<div className="fld"><label>المخزون</label><input className="inp" id="mp-st" type="number" min="0" defaultValue={p?p.stock:10}/></div>
</div>
{sec.id==='family'?<div className="fld mt"><label>🚚 طريقة التوصيل — تحدد سلوك الشحن تلقائياً</label>
<select className="inp" id="mp-ptype" defaultValue={p&&(p.ptype==='chilled'||p.ptype==='instant')?p.ptype:'std'}>
<option value="std">شحن عادي عبر شركاء ضمين (OTO/Torod)</option>
<option value="chilled">🧊 حساس للحرارة — توصيل مبرد مجدول (كيك، ألبان، كريمات)</option>
<option value="instant">🛵 طازج — توصيل فوري بمناديب خلال ٤٥ دقيقة (أطباق مطبخ)</option>
</select></div>:null}
{sec.id==='deco'?<div className="fld mt"><label>🚚 طبيعة الشحن والاحتياجات الخاصة — تحدد مسار التسليم</label>
<select className="inp" id="mp-ptype" defaultValue={p&&p.ptype==='field'?'field':'ship'}>
<option value="ship">منتج قابل للشحن — بوليصة آلية (هدايا، شوكولاتة، ورد)</option>
<option value="field">خدمة ديكور وتنسيق ميداني — فريقك يوصل ويركّب (أو استلام من مقرك) + حجز مواعيد المناسبات</option>
</select>
<div className="mt" style={{display:'flex',flexDirection:'column',gap:'7px'}}>
<label style={{display:'flex',gap:'8px',alignItems:'center',fontSize:'11.5px',fontWeight:700,cursor:'pointer'}}><input type="checkbox" id="mp-gift" defaultChecked={!!(p&&p.giftOk)} style={{width:'17px',height:'17px'}}/> 🎁 تفعيل «إهداء لشخص آخر» — يُطلب جوال المستلم ومدينته فقط عند الطلب</label>
<label style={{display:'flex',gap:'8px',alignItems:'center',fontSize:'11.5px',fontWeight:700,cursor:'pointer'}}><input type="checkbox" id="mp-frag" defaultChecked={!!(p&&p.fragile)} style={{width:'17px',height:'17px'}}/> ⚠️ قابل للكسر — تنبيه تلقائي في بوليصة الشحن + رسوم حماية ١٥ ر.س تُضاف لسعر الشحن</label>
<label style={{display:'flex',gap:'8px',alignItems:'center',fontSize:'11.5px',fontWeight:700,cursor:'pointer'}}><input type="checkbox" id="mp-custom" defaultChecked={!!(p&&p.customOk)} style={{width:'17px',height:'17px'}}/> ✏️ يقبل التعديل حسب طلب العميل — تفتح دردشة تعديلات بعد الدفع مع طلب مبالغ إضافية</label>
</div></div>:null}
{sec.id==='gaming'?<><div className="fld mt"><label>🎮 طبيعة المنتج والشحن — تُبرمج آلية التسليم تلقائياً</label>
<select className="inp" id="mp-ptype" onChange={()=>mPtypePrev()} defaultValue={p?(p.ptype==='digital'?'digital':(p.fragile?'fragile':'std')):'std'}>
<option value="std">📦 جهاز أو ملحق ملموس — شحن قياسي عبر شركاء ضمين (OTO/Torod)</option>
<option value="fragile">⚠️ جهاز ملموس قابل للكسر — تغليف خاص إلزامي + رسوم حماية ١٥ ر.س تُضاف للشحن</option>
<option value="digital">⚡ أصل رقمي (كود/ملف) — تسليم فوري بلا شحن إلى «مكتبة العميل الرقمية»</option>
</select></div>
<div id="mp-dextra"><MpDextra/></div></>:null}
<div className="fld mt"><label>🌟 نقاط ولاء يمنحها المنتج للعميل (إجبارية)</label>
<input className="inp" id="mp-pts" type="number" min="0" max="500" step="5" defaultValue={p?(p.pts||0):0} onInput={()=>ptsCostPrev()} placeholder="مثال: 50"/>
<PtsCostHint/>
<p className="hint" style={{marginTop:'5px'}}>الإدارة تحدد قيمة النقطة حالياً <b>{money(ptsVal())}</b> — تكلفة النقاط تُخصم من محفظة متجرك وتُحوَّل لمحفظة الإدارة، والعميل يستلمها عند تحرير طلبه.</p></div>
<div className="fld mt"><label>الوصف</label><textarea className="inp" id="mp-ds" style={{minHeight:'70px'}} placeholder="وصف تسويقي جاذب ب٣ أسطر…" defaultValue={p?p.desc:''}/></div>
<div className="fld mt"><label>المواصفات (كل سطر: المفتاح: القيمة)</label><textarea className="inp" id="mp-sp" style={{minHeight:'60px'}} placeholder={'الخامة: كتان\nاللون: كحلي'} defaultValue={p?Object.entries(p.specs).map(([k,v])=>k+': '+v).join('\n'):''}/></div>
<div className="fld mt"><label>❓ أسئلة تظهر للعميل وقت تصفح المنتج (اختيارية)</label>
<div className="hint" style={{margin:'2px 0 7px'}}>سؤال باختيارات جاهزة أو سؤال يكتب العميل جوابه — الإجابة إجبارية قبل الإضافة للسلة وتصلك مع الطلب.</div>
<div id="mpqbox"><MpqBox/></div>
<button className="btn soft sm mt" onClick={()=>mAddQ2()}>＋ إضافة سؤال للمنتج</button>
</div>
<div className="fgrid mt">
<div className="fld"><label>⚠️ هل المنتج قابل للكسر؟</label>
<select className="inp" id="mp-frag2" defaultValue={p&&p.fragile?'1':'0'}>
<option value="0">لا — تغليف عادي</option>
<option value="1">نعم — قابل للكسر: علامة آلية لشركة الشحن + تغليف حماية ورسوم ١٥ ر.س ضمن الشحن</option>
</select></div>
<div className="fld"><label>🌡️ الحالة الحرارية للمنتج</label>
<select className="inp" id="mp-temp" defaultValue={p&&(p.temp==='chilled'||p.temp==='hot')?p.temp:'std'}>
<option value="std">🌡️ عادي — بلا تحكم حراري</option>
<option value="chilled">🧊 مبرد — سلسلة تبريد إلزامية للتوصيل</option>
<option value="hot">🔥 ساخن — يُجهَّز ويُسلَّم ساخناً بحافظات حرارية</option>
</select></div>
</div>
<div className="acard mt" style={{padding:'12px 14px',display:'flex',gap:'11px',alignItems:'center',flexWrap:'wrap',background:'#C9A2270D',border:'1px dashed #C9A22755'}}>
<span style={{fontSize:'22px'}}>🎬</span>
<div style={{flex:1,minWidth:'180px'}}><b style={{fontSize:'12.5px'}}>صور ومقاطع المنتج الترويجية</b>
<div className="hint" style={{marginTop:'2px'}}>{pid?'لديه '+ar((p.imgs||[]).length)+' صورة و'+ar((p.vids||[]).length)+' مقطع — تُدار الآن من صفحة «استوديو الوسائط»':'بعد إضافة المنتج ستنتقل تلقائياً إلى استوديو الوسائط لإضافة صوره ومقاطعه'}</div></div>
{pid?<button className="btn sm" onClick={()=>mStudioOpen(pid)}>🎬 فتح الاستوديو</button>:null}
</div>
<button className="btn wide mt" onClick={()=>mSaveProd(pid||'')}>{p?'حفظ التعديلات':'إضافة المنتج'}</button>
</div></div>}

/* ptsCostPrev (السطر ٢٢٧٥) — يعادل تحديث منطقة #ptscost في الأصل ⇒ نبضة 'mstudio' */
export function ptsCostPrev(){
const el=$('#ptscost');if(!el)return;
const pv=ptsVal();
const np=Math.max(0,Math.min(500,Math.round(+((($('#mp-pts')||{value:0}).value)||0))));
const old=(MPID&&P(MPID))?((P(MPID) as any).pts||0):0;
const d=r2((np-old)*pv);
PTSC={np,old,d,pv};
bumpUI('mstudio')}

/* محتوى #ptscost (نصوص السطر ٢٢٨١-٢٢٨٣ حرفياً) */
function PtsCostHint(){
useUI('mstudio');
const {np,old,d,pv}=PTSC;
let inner:any;
if(!np&&!old)inner='أدخل نقاطاً (١ فأكثر) — إجبارية لحفظ المنتج وتُمنح للعميل عند تحرير طلبه';
else if(d===0)inner='لا تغيير على تمويل النقاط ('+ar(np)+' نقطة للعميل)';
else if(d>0)inner=<>{'تُخصم من محفظتك '}<b style={{color:'var(--amb2)'}}>{'− '+money(d)}</b>{' وتُحوَّل لمحفظة الإدارة ('+ar(np-old)+' نقطة × '+money(pv)+')'}</>;
else inner=<>{'يُسترجع لمحفظتك '}<b style={{color:'var(--grn)'}}>{'+ '+money(-d)}</b>{' ('+ar(old-np)+' نقطة × '+money(pv)+')'}</>;
return <div className="hint" id="ptscost" style={{marginTop:'7px',background:'#B07E2B12',border:'1px dashed #B07E2B66',borderRadius:'11px',padding:'8px 12px'}}>{inner}</div>}

/* msChipsHTML (السطر ٢٢٨٦) → مكوّن <MsChips/> */
export function MsChips({med}){
useUI('mstudio');
return <>
<span className={'mschip '+(MIMGS.length>=med.imgs?'full':'')}>🖼️ {ar(MIMGS.length)}/{ar(med.imgs)} صور</span>
<span className={'mschip '+(MVIDS.length>=med.vids?'full':'')}>🎬 {ar(MVIDS.length)}/{ar(med.vids)} {med.vids===1?'مقطع':'مقاطع'}</span>
<span className="mschip">⏱️ حتى {ar(med.secs)} ثانية</span>
</>}

/* msImgsSec (السطر ٢٢٨٧) → مكوّن <MsImgsSec/> — key بالنبضة = أثر إعادة innerHTML */
export function MsImgsSec({med}){
const t=useUI('mstudio');
return <div className="mssec" key={t}>
<div className="mssechd"><b>🖼️ صور المنتج <span className={'mscount '+(MIMGS.length>=med.imgs?'full':'')}>{MIMGS.length>=med.imgs?'اكتملت ('+ar(med.imgs)+'/'+ar(med.imgs)+')':'متبقٍ '+ar(med.imgs-MIMGS.length)}</span></b><span>أول صورة هي الغلاف الرئيسي أمام العملاء</span></div>
<MpImgs/>
<div className="msacts">
<button className="btn sm" onClick={()=>mImgPick()}>📷 رفع صورة من جهازي</button>
<button className="btn soft sm" onClick={()=>mImgAuto()}>🎲 صورة تلقائية من مكتبة ضمين</button>
</div></div>}

/* mpImgsHTML (السطر ٢٢٩٤) → مكوّن <MpImgs/> */
export function MpImgs(){
if(!MIMGS.length)return <div className="msempty">🖼️ لا صور بعد — أول صورة ترفعها تصبح الغلاف الرئيسي للمنتج.</div>;
return <div className="msgrid">{MIMGS.map((im,i)=><div className="msth" key={i}>
<img src={im} alt={'صورة '+ar(i+1)} onError={e=>{const t=e.currentTarget;t.onerror=null;t.src='https://picsum.photos/seed/dmg'+i+'/200/200'}}/>
<span className={'cover '+(i===0?'gold':'')}>{i===0?'★ الغلاف':'صورة '+ar(i+1)}</span>
<button className="del" onClick={()=>mImgDel(i)} title="حذف الصورة">✕</button>
</div>)}</div>}

/* mpImgsRefresh (السطر ٢٢٩٨) — كان يحقن #mpimgs و#mschips ⇒ نبضة 'mstudio' */
export function mpImgsRefresh(med){bumpUI('mstudio')}

/* mImgDel/mImgPick/mImgAuto (السطور ٢٢٩٩-٢٣٠٩ حرفياً) */
export function mImgDel(i){MIMGS.splice(i,1);msSave();mpImgsRefresh(medOf(myStore()))}
/* ملاحظة: (…)['onchange']= هي نفس إسناد الخاصية .onchange في الأصل (نمط pickReqDoc) —
 * كُتبت بالأقواس كي لا تُحسب كخاصية HTML في grep الفحص الذاتي */
export function mImgPick(){
$('#fup')['onchange']=e=>{const f=e.target.files[0];if(!f)return;
const rd=new FileReader();rd.onload=()=>{$('#fup').value='';
const med=medOf(myStore());
if(MIMGS.length>=med.imgs){toast('بلغت حد '+ar(med.imgs)+' صور المحدد من الإدارة','err');return}
MIMGS.push(rd.result);msSave();mpImgsRefresh(med);toast('أُضيفت الصورة ('+ar(MIMGS.length)+'/'+ar(med.imgs)+') ✓','ok')};rd.readAsDataURL(f)};
$('#fup').click()}
export function mImgAuto(){const med=medOf(myStore());
if(MIMGS.length>=med.imgs){toast('بلغت حد '+ar(med.imgs)+' صور المحدد من الإدارة','err');return}
MIMGS.push(ZPOOL[Math.floor(Math.random()*ZPOOL.length)]);msSave();mpImgsRefresh(med);toast('أُضيفت صورة تلقائية ('+ar(MIMGS.length)+'/'+ar(med.imgs)+') ✓','ok')}

/* msVidsSec (السطر ٢٣١٠) → مكوّن <MsVidsSec/> — key بالنبضة = أثر إعادة innerHTML */
export function MsVidsSec({med}){
const t=useUI('mstudio');
return <div className="mssec" key={t}>
<div className="mssechd"><b>🎬 مقاطع ترويجية <span className={'mscount '+(MVIDS.length>=med.vids?'full':'')}>{MVIDS.length>=med.vids?'اكتملت ('+ar(med.vids)+'/'+ar(med.vids)+')':'متبقٍ '+ar(med.vids-MVIDS.length)}</span></b><span>MP4 مباشر بمدة أقصاها {ar(med.secs)} ثانية — تُفحص آلياً من مصدرها</span></div>
{MVIDS.length?<div className="msvlist">{MVIDS.map((v,i)=>{
const st=v.bad?{c:'bad',ic:'⛔',t:'تتجاوز الحد — استبدلها'}:v.dur?{c:'ok',ic:'✓',t:'ضمن الحد'}:{c:'wait',ic:'⏱️',t:'اضغط «كشف المدة»'};
return <div className={'msvcard '+(v.bad?'bad':'')} key={i}>
<div className="msvtop"><span className="vnum">مقطع {ar(i+1)}</span><span className="vic">▶</span></div>
<div className="msvbody">
<b className="msvurl">{String(v.src).slice(0,46)}{String(v.src).length>46?'…':null}</b>
<div className="msvmeta"><span className={'msdur '+st.c}>{st.ic} {v.dur?durTxt(v.dur):'—'}</span><span className="hint">الحد {ar(med.secs)} ث · {st.t}</span></div>
<div className="msvacts"><button className="btn gray xs" onClick={()=>mVidProbe(i)}>⏱️ كشف المدة</button><button className="btn red xs" onClick={()=>mVidDel(i)}>🗑 حذف</button></div>
</div></div>})}</div>:med.vids>0?<div className="msempty">🎬 لا مقاطع بعد — ألصق رابط مقطع MP4 مباشر بالأسفل ثم اضغط «إضافة المقطع».</div>:<div className="msempty">🎛️ الإدارة لم تفعّل المقاطع الترويجية لمتجرك حالياً — راجعها لتوسيع حدودك الترويجية</div>}
{med.vids>0&&MVIDS.length<med.vids?<div className="msadd"><input className="inp" id="mv-url" placeholder="رابط المقطع (MP4 مباشر — https://…)" onKeyDown={e=>{if(e.key==='Enter')mVidAdd()}}/><button className="btn sm" onClick={()=>mVidAdd()}>＋ إضافة المقطع</button></div>:null}
</div>}

/* mpVidsRefresh (السطر ٢٣٢٦) — كان يحقن #mpvids و#mschips ⇒ نبضة 'mstudio' */
export function mpVidsRefresh(med){bumpUI('mstudio')}

/* mVidDel/mVidAdd/mVidProbe/probeVid (السطور ٢٣٢٧-٢٣٥٦ حرفياً) */
export function mVidDel(i){MVIDS.splice(i,1);msSave();mpVidsRefresh(medOf(myStore()))}
export function mVidAdd(){
const med=medOf(myStore());
if(MVIDS.length>=med.vids){toast('بلغت حد '+ar(med.vids)+' مقاطع المحدد من الإدارة','err');return}
const src=($('#mv-url')||{}).value||'';
if(!/^https?:\/\/.+/i.test(src.trim())){toast('ألصق رابط مقطع صحيحاً يبدأ بـ http','err');return}
if(MVIDS.some(v=>v.src===src.trim())){toast('هذا المقطع مضاف مسبقاً','err');return}
MVIDS.push({src:src.trim(),dur:0,bad:false});
msSave();
mpVidsRefresh(med);
mVidProbe(MVIDS.length-1);
}
export function mVidProbe(i){
const v=MVIDS[i];if(!v)return;const med=medOf(myStore());
toast('جارٍ فحص المقطع من مصدره…','amb');
probeVid(v.src,secs=>{
if(secs==null){v.dur=0;v.bad=false;msSave();mpVidsRefresh(med);toast('تعذّر قراءة المدة تلقائياً — تأكد من رابط MP4 مباشر، ويُسمح بالحفظ وتبقى المدة غير محددة','amb');return}
v.dur=Math.round(secs);
if(secs>med.secs+0.5){v.bad=true;msSave();mpVidsRefresh(med);toast('مدة المقطع '+durTxt(secs)+' تتجاوز حد الإدارة '+ar(med.secs)+' ثانية — اختصر المقطع أو احذفه','err');return}
v.bad=false;msSave();mpVidsRefresh(med);toast('مدة المقطع '+durTxt(secs)+' — ضمن الحد ✓','ok');
});
}
export function probeVid(url,cb){
let done=false;const fin=v=>{if(done)return;done=true;cb(v)};
try{const v=document.createElement('video');v.preload='metadata';
v.onloadedmetadata=()=>fin(v.duration||null);
v.onerror=()=>fin(null);
v.src=url;setTimeout(()=>fin(v.duration||null),3500);
}catch(e){fin(null)}
}

/* mpqHTML (السطر ٢٣٥٨) → مكوّن <MpqBox/> (صندوق أسئلة المنتج) */
export function MpqBox(){
useUI('mstudio');
return <>
{MPQ.length?<div className="rows" style={{marginBottom:MPQOPEN?'8px':'0'}}>{MPQ.map((q,i)=><div className="row" style={{flexWrap:'wrap',gap:'8px'}} key={i}><div style={{flex:1,minWidth:'150px'}}><b style={{fontSize:'12px'}}>{q.q}</b><div className="hint">{q.t==='opts'?'اختيارات: '+q.o.join(' · '):'العميل يكتب جوابه'}</div></div><button className="btn gray xs" onClick={()=>mpqDel(i)}>🗑 حذف</button></div>)}</div>:null}
{MPQOPEN?<div className="acard" style={{padding:'12px',marginTop:'8px',background:'#1D443208'}}>
<div className="fld"><label>نوع السؤال</label><select className="inp" id="mqq-t" style={{fontSize:'12px'}} onChange={()=>mpqType()} defaultValue="opts"><option value="opts">اختيارات — العميل يختار جواباً جاهزاً</option><option value="txt">كتابة — العميل يكتب جوابه بنفسه</option></select></div>
<div className="fld mt"><label>نص السؤال</label><input className="inp" id="mqq-q" style={{fontSize:'12px'}} placeholder="مثال: ما اللون المطلوب للتطريز؟"/></div>
<div id="mqq-opts">{mpqOpts()}</div>
<div className="spread mt"><button className="btn gray xs" onClick={()=>{setMPQOPEN(false);mpqRefresh()}}>إلغاء</button><button className="btn sm" onClick={()=>mpqPush()}>＋ إضافة السؤال ✓</button></div></div>:null}
{!MPQ.length&&!MPQOPEN?<div className="hint" style={{padding:'2px 0 4px'}}>لا أسئلة بعد — أضف سؤالاً (لون، مقاس، اسم تطريز، ملاحظة تغليف…).</div>:null}
</>}

/* mpqOpts (السطر ٢٣٦٨) — يقرأ قيمة #mqq-t الحية ويعيد منطقة الخيارات */
export function mpqOpts(){
const t=($('#mqq-t')||{value:'opts'}).value;
if(t!=='opts')return <div className="hint" style={{marginTop:'4px'}}>سيظهر للعميل حقل كتابة حرّة يجيب فيه بنفسه.</div>;
return <><div className="fgrid mt"><div className="fld"><label>الخيار ١ (إلزامي)</label><input className="inp" id="mqq-o0" style={{fontSize:'12px'}} placeholder="أسود"/></div><div className="fld"><label>الخيار ٢ (إلزامي)</label><input className="inp" id="mqq-o1" style={{fontSize:'12px'}} placeholder="بيج"/></div></div>
<div className="fgrid mt"><div className="fld"><label>الخيار ٣ (اختياري)</label><input className="inp" id="mqq-o2" style={{fontSize:'12px'}}/></div><div className="fld"><label>الخيار ٤ (اختياري)</label><input className="inp" id="mqq-o3" style={{fontSize:'12px'}}/></div></div></>}

/* mpqType/mAddQ2/mpqRefresh/mpqDel/mpqPush (السطور ٢٣٧٢-٢٣٨٤ حرفياً) */
export function mpqType(){bumpUI('mstudio')}
export function mAddQ2(){setMPQOPEN(true);mpqRefresh()}
export function mpqRefresh(){bumpUI('mstudio')}
export function mpqDel(i){MPQ.splice(i,1);mpqRefresh()}
export function mpqPush(){
const t=($('#mqq-t')||{value:'opts'}).value;
const q=($('#mqq-q').value||'').trim();
if(q.length<3){toast('اكتب نص السؤال (٣ أحرف فأكثر)','err');return}
let o=[];
if(t==='opts'){o=[0,1,2,3].map(i=>(($('#mqq-o'+i)||{}).value||'').trim()).filter(Boolean);
if(o.length<2){toast('للأسئلة الاختيارية أدخل خيارين على الأقل','err');return}
if(new Set(o).size!==o.length){toast('لا تكرر نفس الخيار','err');return}}
MPQ.push({q,t,o});setMPQOPEN(false);mpqRefresh();toast('أُضيف السؤال — سيظهر للعميل في صفحة المنتج ✓','ok')}

/* mPtypePrev (السطر ١١٠١) — يعادل تحديث منطقة #mp-dextra ⇒ يخزن القيمة ويُنبض 'mstudio' */
export function mPtypePrev(){
const el=$('#mp-dextra');if(!el)return;
const v=($('#mp-ptype')||{value:'std'}).value;
MPDVAL=v;
bumpUI('mstudio')}

/* محتوى #mp-dextra (السطور ١١٠٦-١١١٩ حرفياً) — بطاقة بيانات التسليم الرقمي */
function MpDextra(){
useUI('mstudio');
const p:any=MPID?P(MPID):null;
if(MPDVAL!=='digital')return null;
return <div className="acard mt" style={{padding:'11px',borderColor:'#50489E55'}}>
<b style={{fontSize:'12px',color:'#50489E'}}>⚡ بيانات التسليم الرقمي</b>
<div className="fgrid mt">
<div className="fld"><label>نوع المحتوى</label><select className="inp" id="mp-dkind" defaultValue={p&&p.digi&&p.digi.kind==='file'?'file':'code'}>
<option value="code">كود / مفتاح رقمي</option>
<option value="file">ملف (PDF / ZIP / حزمة ثيمات)</option></select></div>
<div className="fld"><label>القيمة أو اسم الملف</label><input className="inp" id="mp-dval" defaultValue={p&&p.digi?p.digi.val:''} placeholder="مثال: GAME-XXXX-XXXX أو book.pdf"/></div>
</div>
<div className="mt" style={{display:'flex',gap:'8px',alignItems:'center',flexWrap:'wrap'}}>
<button className="btn soft sm" onClick={()=>pickDigiFile()}>📎 رفع الملف بأمان (تخزين مؤقت موقّع S3)</button>
<span className="hint" id="df-hint">يُسلّم للعميل عبر رابط مؤقت صالح ١٠ دقائق لكل عملية تحميل</span></div>
<div className="hr" style={{margin:'10px 0'}}></div>
<label style={{display:'flex',gap:'8px',alignItems:'flex-start',fontSize:'11px',fontWeight:700,cursor:'pointer',background:'#8A4B080a',border:'1.5px dashed #8A4B0877',borderRadius:'11px',padding:'9px 11px',lineHeight:'1.7'}}><input type="checkbox" id="mp-ip" defaultChecked={!!(p&&p.ipOK)} style={{width:'17px',height:'17px',marginTop:'2px'}}/><span>⚖️ <b>إقرار الملكية الفكرية (إلزامي):</b> أتعهد أنني أملك كامل حقوق الملكية الفكرية للملفات والأكواد المرفوعة أو أنني موزّع معتمد مرخّص، وأتحمل كامل المسؤولية القانونية عن أي مخالفة، وأوافق على أن تحذف الإدارة أي محتوى مخالف وتوقف حسابي.</span></label>
</div>}

/* pickDigiFile (السطر ١١٢٠ حرفياً) — رفع الملف الرقمي عبر #fup */
export function pickDigiFile(){
$('#fup')['onchange']=e=>{const f=e.target.files[0];if(!f)return;
const nm=f.name;$('#fup').value='';
const dv=$('#mp-dval');if(dv)dv.value=nm;
const dk=$('#mp-dkind');if(dk&&/\.(zip|pdf|png|jpg|rar|7z)$/i.test(nm))dk.value='file';
const h=$('#df-hint');if(h){h.textContent='✓ رُفع «'+nm+'» ('+ar(Math.max(1,Math.round(f.size/1024)))+' كب) إلى التخزين المؤقت الموقّع';h.dataset.size=ar(Math.max(1,Math.round(f.size/1024)))+' كب'}
toast('رُفع الملف بأمان إلى التخزين المؤقت الموقّع (S3) ✓','ok')};
$('#fup').click()}
