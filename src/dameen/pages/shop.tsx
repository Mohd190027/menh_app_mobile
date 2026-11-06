'use client';
/* ضمين — pages/shop.tsx
 * صفحات التسوّق (الرئيسية/البحث/القسم/المتجر/المنتج/المفضلة/المكتبة الرقمية) وبطاقاتها وأفعالها —
 * منقولة من dameen.js (السطور ٢٢٥-٢٥٩ و٦٤٩-٩٥٣) بنفس العناصر والفئات والنصوص حرفياً:
 * دوال القوالب صارت مكوّنات، وimpInfo/playVid/dLink تفتح نوافذها عبر openModal بمكوّنات JSX،
 * وأفعال DOM المباشرة (starPick/qStep/dReveal) كما هي لأن عناصرها موجودة في الصفحة.
 */
import { $, ar, ard, money, esc, r2, dt, ago, clock, hash, toast, tempTxt, durTxt, vidFail, SECTIONS, CATS, STORES, PRODUCTS, P, ST, SEC, secOf, eff, stOK, getIMP } from '../core';
import { SES, VIEW, GFav, CART, QTY, PANS, RATE, me, isFav, go, render, openModal, closeModal, setQTY, setPANS, setRATE, setGFav } from '../store';
import { Img, Stars } from '../ui';
import { openAuth } from '../auth';

/* DLN — السطر ٩٣٣: رابط المكتبة المؤقت المعروض حالياً */
let DLN:any=null;

/* ================= العدّاد المجتمعي (٢٢٥) ================= */
export function ImpactBar(){
const IMP=getIMP();
return <button className="impbar" type="button" onClick={()=>openModal(<ImpInfoModal/>,'')} title="اضغط لعرض تفاصيل العدّاد المجتمعي">
<span className="impstar">🌟</span>
<span className="impmain"><span className="implb">🌟 العدّاد المجتمعي الشفاف — أثر ضمين</span>
<span className="impval"><b id="impnum">{ard(IMP.total)}</b><small>ر.س معتمدة لأعمال الخير</small></span></span>
<span className="impsep"></span>
<span className="impmeta"><span>من <b>{ar(IMP.n)}</b> عملية شراء ناجحة عبر ضمين</span><span>اقتطاع <b>٠٫٥٠ ر.س</b> عن كل عملية — لا من العميل ولا التاجر</span></span>
<span className="impq">؟</span>
</button>;
}

/* impInfo (٢٣٣) — نافذة تفاصيل العدّاد */
function ImpInfoModal(){
const IMP=getIMP();
return <>
<div className="mhead"><b>🌟 العدّاد المجتمعي الشفاف</b><button className="x" onClick={()=>closeModal()}>✕</button></div>
<div className="mbody">
<div className="impbig"><span className="n">{ard(IMP.total)}</span><small>ريال سعودي معتمدة لأعمال الخير</small><span className="tag wht">من {ar(IMP.n)} عملية شراء ناجحة</span></div>
<p className="hint" style={{lineHeight:2,marginTop:'11px'}}>مع كل عملية شراء ناجحة تقتطع ضمين <b>٠٫٥٠ ريال من حصة أرباح المنصة</b> — لا من جيب العميل ولا من التاجر — وتعتمدها لأعمال الخير. العدّاد يتحدّث لحظياً مع كل عملية، والشفافية كاملة أمام جميع الأطراف.</p>
<div className="impsteps">
<div className="ipstep"><i>🛒</i><div><b>عملية شراء ناجحة</b><span>يُحجز مبلغ العميل في الخزنة المستقلة حتى استلامه وتقييمه</span></div></div>
<div className="ipstep"><i>💎</i><div><b>اقتطاع ٠٫٥٠ ريال</b><span>من عمولة ضمين على الصفقة — لا يزيد سعر المنتج أمام العميل أبداً</span></div></div>
<div className="ipstep"><i>🤲</i><div><b>اعتماد لأعمال الخير</b><span>يتحدّث العدّاد لحظياً ويظهر بشفافية للعميل والتاجر والإدارة معاً</span></div></div>
</div>
<button className="btn wide mt" onClick={()=>closeModal()}>فهمت، شكراً 💚</button>
</div></>;
}

/* impHero (٢٤٤) — بطاقة مساهماتي الخيرية في لوحات الأدوار */
export function ImpHero(){
const IMP=getIMP();
return <div className="imphero">
<div className="spread"><b style={{fontSize:'13.5px'}}>🌟 مساهماتي الخيرية</b><span className="tag wht">من أرباح ضمين — لا من مالك</span></div>
<div style={{display:'flex',alignItems:'baseline',gap:'8px',marginTop:'6px'}}><span className="bignum">{ard(IMP.users[SES.phone]||0)}</span><span style={{fontSize:'12px',fontWeight:800}}>ر.س</span></div>
<div className="hint" style={{marginTop:'2px'}}>اقتطعت ضمين ٠٫٥٠ ريال من أرباحها مع كل عملية شراء ناجحة لك{(IMP.users[SES.phone]||0)>0?' — مجموع أثرك الخيري باسمك':': أول عملية شراء لك تضيف أول ٠٫٥٠ ر.س ✨'}</div>
</div>;
}

/* playVid (٢٥٠) — مشغّل المقطع الترويجي */
export function playVid(pid,src,dur){const p=P(pid) as any;if(!p)return;
openModal(<PlayVidModal p={p} src={src} dur={dur}/>,'lg');}

function PlayVidModal({p,src,dur}){
const s=ST(p.store);
return <>
<div className="mhead"><b>🎬 {p.name}</b><button className="x" onClick={()=>closeModal()}>✕</button></div>
<div className="mbody vmodal">
<video src={src} poster={p.imgs[0]||''} controls autoPlay playsInline preload="metadata" onError={e=>vidFail(e.currentTarget)}></video>
<div className="vinfo"><span className="hint">{dur?'⏱️ المدة '+durTxt(dur)+' · ':''}من متجر <a style={{color:s.color,fontWeight:800,cursor:'pointer'}} onClick={()=>{closeModal();go('product',p.id)}}>{s.name}</a> · {money(eff(p))}</span>
<button className="btn sm" onClick={()=>{closeModal();go('product',p.id)}}>🛒 صفحة المنتج</button></div>
</div></>;
}

/* pvidsBlock (٢٥٧) — شريط المقاطع الترويجية في صفحة المنتج */
export function PvidsBlock({p}){
if(!p.vids||!p.vids.length)return null;
return <div className="pvids"><b>🎬 مقاطع ترويجية من المتجر</b>
<div className="vrail">{p.vids.map((v,vi)=><div className="mcard" key={vi} onClick={()=>playVid(p.id,v.src,+v.dur||0)}>
<Img src={p.imgs[0]} cls="" alt={p.name}/><span className="play">▶</span><span className="vtag">🎬 {v.dur?durTxt(v.dur):'مقطع '+ar(vi+1)}</span><div className="mcap"><b>مقطع {ar(vi+1)}</b><small>{money(eff(p))}</small></div></div>)}</div></div>;
}

/* ================= بطاقة المنتج (٦٤٩) ================= */
export function Pcard({p}){
const s=ST(p.store),sec=SEC(s.sec),e=eff(p),fav=isFav(p.id);
return <div className="pcard" onClick={()=>go('product',p.id)}>
<div className="ph">{p.off?<span className="offb">خصم {ar(p.off)}٪</span>:null}{p.pts?<span className="ptsb">🌟 {ar(p.pts)} نقطة</span>:null}<span className="secb" style={{'--c':sec.color} as any}>{sec.name}</span>
<button className={'favh '+(fav?'on':'')} onClick={e=>{e.stopPropagation();toggleFav(p.id)}}>{fav?'♥':'♡'}</button>
<Img src={p.imgs[0]} cls="" alt=""/> </div>
<div className="pb"><div className="nm">{p.name}</div>
<div className="st"><Stars r={p.rt}/> <span>{ar(p.rc)}</span><span>·</span><span>{s.name}</span></div>
<div className="pr"><b>{money(e)}</b>{p.off?<s>{ard(p.price)}</s>:null}</div></div></div>;
}

/* pubProds (٦٥٩) */
const pubProds=()=>PRODUCTS.filter(p=>stOK(ST(p.store)));

/* ================= الرئيسية (٦٦٢) ================= */
export function PgHome(){
const u=me();
const bubs=[...pubProds()].sort((a,b)=>b.sold-a.sold).slice(0,12);
let fi=0;
const track=bubs.map(p=>{const sec=secOf(p.store);
return <div className="bub" style={{'--c':sec.color} as any} key={p.id} onClick={()=>go('product',p.id)}>
<div className="ring"><div style={{'--d':(fi++*0.55).toFixed(2)+'s'} as any}><Img src={p.imgs[0]} cls="" alt=""/></div></div><b>{p.name}</b><span>{ard(eff(p))} ر.س</span></div>});
return <>
<div className="hero">
<h1>{u?<>أهلاً بك يا {u.name.split(' ')[0]} 👋</>:<>تسوّق <em>بضمين</em>… مالك محجوز حتى ترضى</>}</h1>
<p>نحجز مبلغك في خزنة مستقلة، ولا يستلم التاجر إلا بعد استلامك وتقييمك — والعمولة تُحسم من التاجر فقط وتذهب مباشرة للإدارة.</p>
<div className="trust"><span className="tchip"><i>🔒</i> خزنة ضمان مستقلة</span><span className="tchip"><i>⏱️</i> تحرير تلقائي بانتهاء نافذة الحماية</span><span className="tchip"><i>⚖️</i> تحكيم ثلاثي الأطراف</span><span className="tchip"><i>🚚</i> شحن آلي عبر OTO وTorod</span><span className="tchip"><i>💳</i> مدى وApple Pay وتقسيط تابي وتمارا</span><span className="tchip"><i>⚡</i> تسليم رقمي فوري</span></div>
</div>

<ImpactBar/>

<div className="bubzone"><div className="lbl"><span className="dot"></span> يتجدّد الآن بين متاجر ضمين — انقر أي منتج لتفاصيله</div>
<div className="bubwrap"><div className="bubtrack">{track}{track}</div></div></div>

<div className="secthead"><h2>عوالم ضمين الأربعة</h2><div className="ln"></div><span className="hint">اختر عالمك وابدأ بضمان</span></div>
<div className="trio">{SECTIONS.map(s=>{
const sts=STORES.filter(x=>x.sec===s.id&&stOK(x)).length;
const prs=PRODUCTS.filter(p=>SEC(ST(p.store).sec).id===s.id&&stOK(ST(p.store))).length;
return <div className="tri" style={{'--c':s.color} as any} key={s.id} onClick={()=>go('section',s.id)}>
<img className="bg" src={s.img} alt={s.name} loading="lazy" onError={e=>{e.currentTarget.style.display='none'}}/>
<div className="shade"></div>
<div className="win"><i>🛡️ نافذة الحماية</i><b>{s.win}</b></div>
<div className="body"><div className="ic">{s.icon}</div><div className="tx"><b>{s.name}</b><span>{s.desc}</span><div className="stx"><em>{ars(sts)} متاجر</em><em>{ars(prs)} منتج</em><em>تسوّق الآن ←</em></div></div></div></div>})}</div>

<div className="secthead"><h2>كيف يعمل ضمين؟</h2><div className="ln"></div></div>
<div className="how">
<div className="howc"><div className="n">١</div><div><b>اطلب وادفع</b><span>يُحجز مبلغك في خزنة ضمين المستقلة — لا يلمسه التاجر.</span></div></div>
<div className="howc"><div className="n">٢</div><div><b>استلم وقيّم</b><span>خلال نافذة حماية القسم، افحص طلبك بكل راحة.</span></div></div>
<div className="howc"><div className="n">٣</div><div><b>نحرر المبلغ</b><span>بالرضا أو تلقائياً — صافي التاجر يحرر لحظتها، والعمولة للإدارة.</span></div></div>
</div></>;
}

/* ars (٦٩٨) */
function ars(n){return ar(n)}

/* ================= البحث (٧٠١) ================= */
export function PgSearch(){
const V=VIEW as any;
const q=(V.q||'').trim();
const ql=q.replace(/[أإآ]/g,'ا');
const hit=s=>s.replace(/[أإآ]/g,'ا').includes(ql);
const ps=pubProds().filter(p=>hit(p.name)||hit(p.cat)||hit(ST(p.store).name));
const ss=STORES.filter(s=>stOK(s)&&hit(s.name));
return <>
<div className="pghead"><button className="backb" onClick={()=>go('home',undefined)}>→</button><h1>نتائج البحث عن «{q}»</h1><span className="tag gry">{ar(ps.length+ss.length)} نتيجة</span></div>
{ss.length?<><div className="secthead"><h2>متاجر</h2><div className="ln"></div></div><div className="ministores">{ss.map(s=><Mstore s={s} key={s.id}/>)}</div></>:null}
<div className="secthead"><h2>منتجات</h2><div className="ln"></div></div>
{ps.length?<div className="pgrid">{ps.map(p=><Pcard p={p} key={p.id}/>)}</div>:<div className="empty"><div className="em">🔍</div><b>لا نتائج مطابقة</b><span>جرّب كلمة أعم مثل «عباية» أو «عسل»</span></div>}
</>;
}

/* ================= بطاقة المتجر المصغّرة (٧١٤) ================= */
export function Mstore({s}){
const n=PRODUCTS.filter(p=>p.store===s.id).length;
return <div className="mstore" style={{'--c':s.color} as any} onClick={()=>go('store',s.id)}>
<div className="lg">{s.logo?<img src={s.logo} style={{width:'100%',height:'100%',objectFit:'cover',borderRadius:'50%'}}/>:s.name[0]}</div>
<div><b>{s.name}</b><span className="mr">★ {ard(s.rt)} · 📍 {s.city||''} · {ar(n)} منتج{n>4?'':' جديد'}</span></div></div>;
}

/* bigstore (٧٢٠) */
export function Bigstore({s}){
const sec=SEC(s.sec);const n=PRODUCTS.filter(p=>p.store===s.id).length;
return <div className="bigstore" style={{'--c':s.color} as any} onClick={()=>go('store',s.id)}>
<div className="cov"><img src={s.cover||sec.img} alt={s.name} loading="lazy" onError={e=>{const t=e.currentTarget;t.onerror=null;t.src=sec.img}}/><div className="tint"></div><span className="winb">🛡️ حماية {sec.win}</span></div>
<div className="info">
<div className="lg">{s.logo?<img src={s.logo} style={{width:'100%',height:'100%',objectFit:'cover'}}/>:s.name[0]}</div>
<h3>{s.name}</h3>
<div className="desc">{s.desc}</div>
<div className="meta"><span>★ <b>{ard(s.rt)}</b> تقييم</span><span>📍 {s.city||'—'}</span><span>🧺 <b>{ar(n)}</b> منتج</span><span>🛒 {ars(s.sales)} طلباً</span></div>
<div className="vst">🚪 زيارة المتجر</div>
</div></div>;
}

/* ================= صفحة القسم (٧٣٤) ================= */
export function PgSection(){
const V=VIEW as any;
const sec=SEC(V.sec)||SECTIONS[0];
const cats=['الكل',...CATS[sec.id].map(c=>c.n)];
const stores=STORES.filter(s=>s.sec===sec.id&&stOK(s));
let ps=PRODUCTS.filter(p=>ST(p.store).sec===sec.id&&stOK(ST(p.store)));
if(V.cat!=='الكل')ps=ps.filter(p=>p.cat===V.cat);
return <>
<div className="pghead"><button className="backb" onClick={()=>go('home',undefined)}>→</button><h1>{sec.icon} {sec.name}</h1></div>
<div className="sechero" style={{'--acc':sec.color,backgroundImage:"linear-gradient(115deg,"+sec.color+"F2 0%,"+sec.color+"C9 55%,"+sec.color+"9C 100%),url('"+sec.img+"')",backgroundSize:'cover',backgroundPosition:'center'} as any}>
<div className="ic">{sec.icon}</div>
<div style={{flex:1}}><h1>{sec.name}</h1><p>{sec.desc} — {ars(stores.length)} متاجر موثوقة بنفس القسم</p></div>
<div className="winb">🛡️ نافذة الحماية: {sec.win}</div>
</div>
<div className="secthead"><h2>متاجر القسم</h2><div className="ln"></div></div>
<div className="storegrid">{stores.map(s=><Bigstore s={s} key={s.id}/>)}</div>
<div className="chiprow" style={{marginTop:'6px'}}>{cats.map(c=><button className={'chip '+(V.cat===c?'on':'')} style={{'--acc':sec.color} as any} key={c} onClick={()=>{V.cat=c;render()}}>{c}</button>)}</div>
<div className="secthead"><h2>{ars(ps.length)} منتجاً</h2><div className="ln"></div></div>
{ps.length?<div className="pgrid">{ps.map(p=><Pcard p={p} key={p.id}/>)}</div>:<div className="empty"><div className="em">🧺</div><b>لا منتجات في هذا التصنيف حالياً</b><span>تابع المتاجر قريباً</span></div>}
</>;
}

/* ================= صفحة المتجر (٧٥٤) ================= */
export function PgStore(){
const V=VIEW as any;
const s=ST(V.store) as any;
if(!s)return <PgHome/>;
const sec=SEC(s.sec);
const all=PRODUCTS.filter(p=>p.store===s.id);
const cats=['الكل',...[...new Set(all.map(p=>p.cat))]];
const scat=V.scat||'الكل';
const ps=scat==='الكل'?all:all.filter(p=>p.cat===scat);
return <>
<div className="pghead"><button className="backb" onClick={()=>go('section',sec.id)}>→</button><h1>{s.name}</h1><span className="tag" style={{background:s.color+'18',color:s.color}}>{sec.name}</span></div>
<div className="storeban" style={{'--c':s.color,...(s.cover?{backgroundImage:"linear-gradient(100deg,"+s.color+"F2,"+s.color+"C4),url('"+s.cover+"')",backgroundSize:'cover',backgroundPosition:'center'}:{})} as any}>
<div className="lg">{s.logo?<img src={s.logo} style={{width:'100%',height:'100%',objectFit:'cover'}}/>:s.name[0]}</div>
<div style={{flex:1}}><h1>{s.name}</h1><p>{s.desc}</p>
<div style={{display:'flex',gap:'12px',flexWrap:'wrap',marginTop:'7px',fontSize:'11.5px',opacity:.95}}>
<span>📍 {s.city||'—'}</span><span>·</span><span>★ {ard(s.rt)} تقييم المتجر</span><span>·</span><span>{ars(s.sales)} طلباً مكتمل البيع</span><span>·</span><span>🛡️ نافذة حماية {sec.win}</span></div></div>
{s.open?null:<span className="tag wht">مغلق مؤقتاً</span>}
</div>
<StoreMedia s={s}/>
<div className="secthead"><h2>🗂️ تصنيفات المتجر ({ars(cats.length-1)})</h2><div className="ln"></div></div>
<div className="chiprow">{cats.map((c:any)=><button className={'chip '+(scat===c?'on':'')} style={{'--acc':s.color} as any} key={c} onClick={()=>{V.scat=c;render()}}>{c}</button>)}</div>
<div className="secthead"><h2>{scat==='الكل'?'منتجات المتجر':'منتجات «'+scat+'»'} ({ars(ps.length)})</h2><div className="ln"></div></div>
{ps.length?<div className="pgrid">{ps.map(p=><Pcard p={p} key={p.id}/>)}</div>:<div className="empty"><div className="em">🧺</div><b>لا منتجات في هذا التصنيف حالياً</b><span>جرّب تصنيفاً آخر من تصنيفات المتجر</span></div>}
</>;
}

/* storeMedia (٧٧٧) — معرض الوسائط الترويجية للمتجر */
export function StoreMedia({s}){
const cards:any[]=[];
PRODUCTS.filter(p=>p.store===s.id).forEach(p=>{
(p.vids||[]).forEach(v=>cards.push({p,type:'v',src:v.src,dur:+v.dur||0}));
(p.imgs||[]).slice(1).forEach((im,i)=>cards.push({p,type:'i',im,i}));
});
if(!cards.length)return null;
return <div className="mshow">
<div className="hrow"><h3>🎬 معرض {s.name} الترويجي</h3><span className="hint">{ar(cards.length)} وسائط من منتجات المتجر — انقر أي وسائط</span></div>
<div className="mrail">{cards.slice(0,16).map((c,ci)=>c.type==='v'
?<div className="mcard" key={ci} onClick={()=>playVid(c.p.id,c.src,c.dur)}>
<Img src={c.p.imgs[0]} cls="" alt={c.p.name}/><span className="play">▶</span><span className="vtag">🎬 {c.dur?durTxt(c.dur):'مقطع'}</span><div className="mcap"><b>{c.p.name}</b><small>{money(eff(c.p))}</small></div></div>
:<div className="mcard" key={ci} onClick={()=>go('product',c.p.id)}>
<Img src={c.im} cls="" alt={c.p.name}/><div className="mcap"><b>{c.p.name}</b><small>{money(eff(c.p))} · صورة {ar(c.i+2)}</small></div></div>
)}</div></div>;
}

/* dlBadge (٧٩٣) — شارة نوع التسليم والقيود */
export function DlBadge({p}){
const t=p.ptype||'std';
const M:any={chilled:{ic:'🧊',l:'توصيل مبرد — حساس للحرارة',d:'يُرسل مندوب مجهز بحافظة برودة (Cooling Box) داخل نفس المدينة، أو شحن مبرد بين المدن عبر شركات مبردة متعاقدة (OTO/Torod) حسب موقعك.'},
instant:{ic:'🛵',l:'توصيل فوري',d:'يبحث النظام عن مندوب فوري فور تأكيد الطلب داخل مدينة المتجر فقط — التسليم المتوقع خلال ٤٥ دقيقة حفاظاً على حرارة الطبق.'},
field:{ic:'🎪',l:'خدمة ديكور وتنسيق ميداني',d:'بلا شحن تجاري: فريق المتجر يوصل ويركّب في موقع المناسبة (أو تستلم من مقر المتجر)، مع حجز موعد مسبق ودردشة تنسيق بعد الدفع لإرسال موقعك.'},
digital:{ic:'⚡',l:'منتج رقمي — تسليم فوري',d:'الكود/الملف يوصلك لحظة الدفع في «مكتبتك الرقمية» عبر رابط مؤقت آمن (S3 Signed) صالح ١٠ دقائق — ٠ ر.س شحن ولا انتظار.'},
ship:{ic:'📦',l:'قابل للشحن',d:'تُصدر له بوليصة آلية عبر شركاء ضمين اللوجستيين (OTO/Torod).'}};
const m=M[t];if(!m)return null;
return <div style={{display:'flex',gap:'10px',alignItems:'flex-start',background:'var(--card2)',border:'1px dashed var(--line)',borderRadius:'12px',padding:'9px 12px',marginBottom:'9px'}}><span style={{fontSize:'18px'}}>{m.ic}</span><div><b style={{fontSize:'12px'}}>{m.l}</b><div className="hint">{m.d}</div>{p.fragile?<div className="hint" style={{color:'#B3541E',fontWeight:700}}>⚠️ قابل للكسر — تنبيه تلقائي في بوليصة الشحن + رسوم حماية ١٥ ر.س تُضاف لسعر الشحن</div>:null}{p.customOk?<div className="hint" style={{color:'var(--amb2)',fontWeight:700}}>✏️ قابل للتعديل حسب طلبك — بعد الدفع تفتح دردشة التعديلات مع التاجر (طلب أي مبلغ إضافي يكون بضمان ضمين)</div>:null}{p.giftOk?<div className="hint" style={{color:'var(--amb2)',fontWeight:700}}>🎁 قابل للإهداء — يكفي جوال المستلم ومدينته عند إتمام الطلب</div>:null}</div></div>;
}

/* ================= صفحة المنتج (٨٠٣) ================= */
export function PgProduct(){
const V=VIEW as any;
const p=P(V.pid) as any;if(!p)return <PgHome/>;
if(V._pid!==V.pid){V._pid=V.pid;setQTY(1);V.tab='desc';setRATE({stars:0});setPANS({})}
const s=ST(p.store),sec=SEC(s.sec),e=eff(p),fav=isFav(p.id);
const similar=PRODUCTS.filter(x=>x.id!==p.id&&ST(x.store).sec===s.sec&&stOK(ST(x.store))).slice(0,4);
const gal=p.imgs.length>1?p.imgs:[p.imgs[0],p.imgs[0]];
const tab=V.tab||'desc';
return <>
<div className="pghead"><button className="backb" onClick={()=>go('store',s.id)}>→</button><h1>{p.name}</h1><span className="tag" style={{background:sec.color+'18',color:sec.color}}>{sec.name}</span></div>
<div className="ppage">
<div className="pgal">
<div className="main"><Img src={gal[V.gi||0]} cls="" alt=""/></div>
{p.imgs.length>1?<div className="thumbs">{p.imgs.map((im,i)=><img src={im} className={i===(V.gi||0)?'on':''} key={i} onClick={()=>{V.gi=i;render()}} onError={e=>{const t=e.currentTarget;t.onerror=null;t.src='https://picsum.photos/seed/d'+(hash(im)%997)+'/200/200'}}/>)}</div>:null}
<PvidsBlock p={p}/>
<div className="gstrip"><span className="gi">🛡️</span><div><b>حماية ضمين مفعّلة على هذا المنتج</b><br/>مبلغك يُحجز في خزنة مستقلة، ونافذة فحص القسم «{sec.name}» هي <b>{sec.win}</b> بعد الاستلام — للطلب أو الاسترجاع قبل التحرير.</div></div>
</div>
<div>
<div style={{display:'flex',gap:'8px',alignItems:'flex-start'}}>
<h2 style={{fontSize:'18px',flex:1}}>{p.name}</h2>
<button className={'iconbtn '+(fav?'':'')} style={{color:fav?'var(--red)':'inherit'}} onClick={()=>toggleFav(p.id)}>{fav?'♥':'♡'}</button>
</div>
<div style={{display:'flex',gap:'10px',alignItems:'center',flexWrap:'wrap',margin:'4px 0 10px'}}>
<Stars r={p.rt}/> <b style={{fontSize:'12.5px'}}>{ard(p.rt)}</b><span className="hint">({ar(p.rc)} تقييم)</span>
<span className="hint">· بيع {ar(p.sold)} مرة</span><span className="hint">· {p.stock>0?'متوفر ('+ar(p.stock)+')':'نفدت الكمية'}</span>{p.fragile?<span className="hint" style={{color:'#B3541E',fontWeight:800}}>· ⚠️ قابل للكسر</span>:null}{p.temp&&p.temp!=='std'?<span className="hint" style={{fontWeight:800}}>· {tempTxt(p)}</span>:null}
</div>
<div style={{display:'flex',alignItems:'baseline',gap:'10px',marginBottom:'5px'}}>
<span className="fx" style={{fontSize:'26px',fontWeight:800,color:'var(--grn)'}}>{money(e)}</span>
{p.off?<><s className="mut">{money(p.price)}</s><span className="tag red">وفّر {ar(p.off)}٪</span></>:null}
</div>
{p.pts?<div className="hint" style={{color:'var(--amb2)',fontWeight:700,marginBottom:'10px'}}>🌟 يمنح هذا المنتج {ar(p.pts)} نقطة ولاء للعميل عند تحرير الطلب</div>:<div style={{height:'6px'}}></div>}
<DlBadge p={p}/>
{p.qs&&p.qs.length?<div className="pqwrap"><b style={{fontSize:'12.5px'}}>❓ أسئلة من التاجر — أجب عنها قبل الإضافة للسلة</b>{p.qs.map((q,i)=><QBlock q={q} i={i} color={sec.color} key={i}/>)}</div>:null}
<div className="hint mb">يبيعه متجر <a style={{color:s.color,fontWeight:700,cursor:'pointer'}} onClick={()=>go('store',s.id)}>{s.name}</a> ★ {ard(s.rt)} · شحنة ضمن {sec.win} حماية · يشحن من 📍 {s.city||'—'}</div>
<div className="spread" style={{gap:'10px',flexWrap:'wrap'}}>
<div className="qty"><button onClick={()=>qStep(1)}>＋</button><b id="qv">{ar(QTY)}</b><button onClick={()=>qStep(-1)}>−</button></div>
<button className="btn" style={{flex:1}} disabled={!p.stock} onClick={()=>addToCart(p.id,QTY,undefined)}>🛒 أضف إلى السلة</button>
<button className="btn amb" disabled={!p.stock} onClick={()=>addToCart(p.id,QTY,true)}>اشترِ الآن</button>
</div>
<div className="tabs">
<button className={tab==='desc'?'on':''} onClick={()=>{V.tab='desc';render()}}>الوصف</button>
<button className={tab==='specs'?'on':''} onClick={()=>{V.tab='specs';render()}}>المواصفات</button>
<button className={tab==='revs'?'on':''} onClick={()=>{V.tab='revs';render()}}>التقييمات ({ar(p.rc)})</button>
</div>
{tab==='specs'?<div>{Object.entries(p.specs).map(([k,v])=><div className="specrow" key={k}><span>{k}</span><b>{v as any}</b></div>)}</div>:null}
{tab==='revs'?<RevBlock p={p}/>:null}
{tab==='desc'?<p style={{fontSize:'13.5px',lineHeight:1.95,color:'#3d443a'}}>{p.desc}</p>:null}
</div></div>
<div className="secthead"><h2>منتجات مشابهة من قسم {sec.name}</h2><div className="ln"></div></div>
<div className="pgrid">{similar.map(x=><Pcard p={x} key={x.id}/>)}</div>
</>;
}

/* revBlock (٨٥٢) — قائمة التقييمات وإضافة تقييم */
export function RevBlock({p}){
const mine=p.ratings.some(r=>SES&&r.by===SES.phone);
return <div style={{marginBottom:'12px'}}>
{mine||!SES?null:<div className="acard" style={{padding:'14px'}}><b style={{fontSize:'12.5px'}}>أضف تقييمك للمنتج</b>
<div className="starin" id="rstars">{[1,2,3,4,5].map(i=><span key={i} onClick={()=>starPick(i)}>★</span>)}</div>
<textarea className="inp" id="rtxt" placeholder="شاركي تجربتك بالتفصيل…" style={{minHeight:'64px',marginBottom:'9px'}}></textarea>
<button className="btn sm" onClick={()=>submitRating(p.id)}>إرسال التقييم</button></div>}
{p.ratings.length?p.ratings.slice().reverse().map((r,ri)=><div className="rev" key={ri}>
<div className="rh"><div className="av">👤</div><b>{r.name||'عميل'}</b><Stars r={r.stars}/><span className="hint">{ago(r.at)}</span></div>
<p>{r.txt}</p></div>):<div className="empty" style={{padding:'26px'}}><div className="em">💬</div><b>لا تقييمات بعد</b><span>كن أول من يشارك تجربته</span></div>}</div>;
}

/* starPick (٨٦٣) — يعمل على عناصر DOM موجودة كما في الأصل */
export function starPick(n){RATE.stars=n;document.querySelectorAll('#rstars span').forEach((s,i)=>s.classList.toggle('on',i<n))}

/* submitRating (٨٦٤) */
export function submitRating(pid){
if(!SES){toast('سجّل دخولك لتقييم المنتج','amb');openAuth('');return}
const p=P(pid) as any;if(!RATE.stars){toast('اختر عدد النجوم أولاً','err');return}
if(p.ratings.some(r=>r.by===SES.phone)){toast('قيّمت هذا المنتج مسبقاً','amb');return}
const txt=($('#rtxt')||{value:''}).value.trim();
p.ratings.push({by:SES.phone,name:me().name.split(' ')[0],stars:RATE.stars,txt,at:Date.now()});
p.rc++;p.rt=r2((p.rt*(p.rc-1)+RATE.stars)/p.rc);
toast('شكراً لتقييمك 💚','ok');render();
}

/* qStep (٨٧٣) — يحدّث رقم الكمية مباشرة في DOM */
export function qStep(d){const p=P((VIEW as any).pid) as any;setQTY(Math.min(Math.max(1,QTY+d),Math.max(1,p.stock||1)));$('#qv').textContent=ar(QTY)}

/* qBlock (٨٧٦) — أسئلة التاجر المخصصة */
export function QBlock({q,i,color}){
if(q.t==='opts')return <div className="pq"><label>{q.q}</label><div className="chiprow" style={{marginTop:'7px'}}>{q.o.map(o=><button className={'chip '+((PANS[i]||'')===o?'on':'')} style={{'--acc':color} as any} key={o} onClick={e=>panChip(e.currentTarget,i)} data-v={o}>{o}</button>)}</div></div>;
return <div className="pq"><label>{q.q}</label><input className="inp" style={{fontSize:'12.5px',marginTop:'7px'}} defaultValue={PANS[i]||''} onInput={e=>{PANS[i]=e.currentTarget.value}} placeholder="اكتب جوابك هنا…"/></div>;
}

/* panChip (٨٨٠) */
export function panChip(el,i){PANS[i]=el.dataset.v;render()}

/* addToCart (٨٨١) — الأصل ينادي renderTop+renderFab وهنا render() تغطيهما (الفاب يقرأ نبض التطبيق) */
export function addToCart(pid,qty,buy){
const p=P(pid) as any;if(!p.stock){toast('نفدت الكمية حالياً','err');return}
const qs=p.qs||[];
if(qs.length){const miss=qs.findIndex((q,i)=>!String(PANS[i]||'').trim());
if(miss>=0){toast('أجب عن سؤال التاجر «'+qs[miss].q+'» أولاً — يظهر فوق زر الشراء','err');const el=document.querySelector('.pqwrap');if(el)el.scrollIntoView({behavior:'smooth',block:'center'});return}}
const ans=qs.length?qs.map((q,i)=>({q:q.q,a:String(PANS[i]||'').trim()})):[];
const ex=CART.find(c=>c.pid===pid);
if(ex){ex.qty=Math.min(ex.qty+qty,p.stock);if(ans.length)ex.ans=ans}
else CART.push({pid,qty:Math.min(qty,p.stock),ans});
toast('أُضيف «'+esc(p.name)+'» إلى السلة','ok');
if(buy)go('cart',undefined);else render();
}

/* toggleFav (٨٩٣) */
export function toggleFav(pid){
if(!SES){GFav.includes(pid)?setGFav(GFav.filter(x=>x!==pid)):GFav.push(pid);toast(GFav.includes(pid)?'أُضيف للمفضلة (سيُحفظ عند التسجيل)':'أُزيل من المفضلة',undefined);render();return}
const u=me();u.favs=u.favs||[];
u.favs.includes(pid)?u.favs=u.favs.filter(x=>x!==pid):u.favs.push(pid);
toast(u.favs.includes(pid)?'❤️ أُضيف إلى مفضلتك':'أُزيل من المفضلة',undefined);render();
}

/* pgFavs (٨٩٩) */
export function PgFavs(){
const ids=SES?(me().favs||[]):GFav;
const ps=ids.map(P).filter(Boolean);
return <>
<div className="pghead"><h1>❤️ مفضلتي</h1><span className="tag amb">{ar(ps.length)} منتج</span></div>
{ps.length?<div className="pgrid">{ps.map(p=><Pcard p={p} key={p.id}/>)}</div>:<div className="empty"><div className="em">🤍</div><b>لا منتجات في مفضلتك بعد</b><span>اضغط ♡ على أي منتج يعجبك</span><button className="btn mt" onClick={()=>go('home',undefined)}>ابدأ التصفح</button></div>}
</>;
}

/* ================= المكتبة الرقمية (٩٠٦) ================= */
export function PgDLib(){
if(!SES)return <>
<div className="pghead"><h1>📚 مكتبتي الرقمية</h1></div><div className="empty"><div className="em">🔐</div><b>سجّل دخولك لعرض مكتبتك</b><span>كل أصل رقمي تشتريه في ضمين يُسلَّم فوراً هنا</span><button className="btn mt" onClick={()=>openAuth('')}>تسجيل الدخول</button></div>
</>;
const u=me();const lib=u.dlib||[];
return <>
<div className="pghead"><h1>📚 مكتبتي الرقمية</h1><span className="tag grn">{ar(lib.length)} أصل رقمي</span></div>
<p className="hint mb" style={{lineHeight:1.8}}>⚡ كل لعبة رقمية أو كود اشتراك أو كتاب إلكتروني تشتريه يُسلَّم هنا فور الدفع — الأكواد تُعرض مباشرة، والملفات عبر روابط مؤقتة آمنة موقّعة (S3 Signed) صالحة ١٠ دقائق لكل عملية، وتبقى مشترياتك محفوظة دائماً ويمكن توليد رابط جديد في أي وقت.</p>
{lib.length?<>
<div className="pgrid">{lib.map((it,i)=>{const p=P(it.pid);const s=ST(it.store);
return <div className="dlgcard" style={{'--c':s.color} as any} key={i}>
<div className="ph">{p?<Img src={p.imgs[0]} cls="" alt=""/>:null}</div>
<div className="pb">
<b style={{fontSize:'12.5px',display:'block',lineHeight:1.5}}>{it.name}</b>
<div className="hint" style={{margin:'3px 0 8px'}}>{s.name} · طلب #{ar(it.oid)} · {dt(it.at)}</div>
{it.kind==='code'?<><div className="dcode" id={'dcode-'+i}>••••-••••-••••-••••</div>
<div style={{display:'flex',gap:'6px',marginTop:'8px',flexWrap:'wrap'}}>
<button className="btn soft xs" onClick={()=>dReveal(i)}>👁️ إظهار الكود</button>
<button className="btn gray xs" onClick={()=>dCopy(i)}>📋 نسخ</button></div></>
:<><div className="hint" style={{marginBottom:'6px'}}>📁 {it.val}{it.size?' · '+it.size:''}</div>
<button className="btn soft xs" onClick={()=>dLink(i)}>🔗 تحميل عبر رابط مؤقت آمن</button></>}
</div></div>})}</div>
<div className="hint mt" style={{textAlign:'center'}}>🔒 الروابط المؤقتة موقّعة رقمياً وتنتهي بعد ١٠ دقائق — والمحتوى محفوظ في مكتبتك دائماً.</div>
</>:<div className="empty"><div className="em">⚡</div><b>لا مشتريات رقمية بعد</b><span>تصفح «عالم الألعاب والأجهزة والمنتجات الرقمية» — التسليم فوري بعد الدفع بضمان ضمين</span><button className="btn mt" onClick={()=>go('section','gaming')}>🛒 تسوّق الرقميات</button></div>}
</>;
}

/* dReveal (٩٢٧) — يبدّل نص الكود في DOM مباشرة */
export function dReveal(i){const it=(me().dlib||[])[i];if(!it)return;const el=$('#dcode-'+i) as any;if(!el)return;
if(el.dataset.on){el.textContent='••••-••••-••••-••••';delete el.dataset.on;return}
el.dataset.on='1';el.textContent=it.val;toast('الكود ظاهر الآن — انسخه واحتفظ به بأمان 🔒','ok')}

/* dCopy (٩٣٠) */
export function dCopy(i){const it=(me().dlib||[])[i];if(!it)return;
const done=()=>toast('نُسخ الكود إلى الحافظة ✓','ok');
if(navigator.clipboard&&navigator.clipboard.writeText)navigator.clipboard.writeText(it.val).then(done,done);else done()}

/* dLink (٩٣٤) — نافذة الرابط المؤقت الموقّع */
export function dLink(i){const it=(me().dlib||[])[i];if(!it)return;
const tok=Math.random().toString(36).slice(2,10).toUpperCase();
DLN={i,exp:Date.now()+600000};
openModal(<DLinkModal it={it} tok={tok} exp={DLN.exp}/>,'')}

function DLinkModal({it,tok,exp}){
return <>
<div className="mhead"><b>🔗 رابط مؤقت آمن (S3 Signed URL)</b><button className="x" onClick={()=>closeModal()}>✕</button></div>
<div className="mbody">
<div className="demo mb"><b style={{fontSize:'12px'}}>{it.val}</b>
<p className="hint" style={{marginTop:'5px',wordBreak:'break-all',direction:'ltr',textAlign:'left',fontFamily:'monospace',fontSize:'10.5px'}}>https://files.dameen.sa/{encodeURIComponent(it.val)}?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=DMN%2F2026%2Fme-central-1%2Fs3%2Faws4_request&X-Amz-Expires=600&token={tok}</p></div>
<div className="srow"><span>⏳ صلاحية الرابط</span><b className="cd" data-cd={exp} style={{border:0,background:'none',padding:0}}>{clock(exp-Date.now())}</b></div>
<div className="srow"><span>📁 الملف</span><b>{it.val}{it.size?' · '+it.size:''}</b></div>
<button className="btn amb wide mt" onClick={()=>dDownload()}>⬇️ تنزيل الملف الآن</button>
<p className="hint mt" style={{textAlign:'center'}}>ينتهي الرابط تلقائياً بعد ١٠ دقائق — ويمكنك توليد رابط جديد من مكتبتك وقت الحاجة.</p>
</div></>;
}

/* dDownload (٩٤٦) */
export function dDownload(){
const it=((me().dlib||[])[(DLN||{}).i]);if(!it)return;
const txt='ضمين — تسليم رقمي آمن\n====================\nالمنتج: '+it.name+'\nالمتجر: '+ST(it.store).name+'\nرقم الطلب: #'+it.oid+'\nالملف: '+it.val+'\nالتاريخ: '+dt(it.at)+'\n\nرابط مؤقت موقع رقمياً (S3 Signed URL) صالح ١٠ دقائق.\nشكراً لتسوقك بضمان ضمين 💚';
const a=document.createElement('a');a.href=URL.createObjectURL(new Blob(['\ufeff'+txt],{type:'text/plain;charset=utf-8'}));
a.download=String(it.val).replace(/\.[^.]+$/,'')+'-dameen.txt';
document.body.appendChild(a);a.click();a.remove();
toast('بدأ التنزيل عبر الرابط المؤقت ✓','ok')}

/* searchNoOp — دالة فارغة (لا شيء) */
export function searchNoOp(){}
