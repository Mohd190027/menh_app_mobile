'use client';
/* ضمين — pages/account.tsx
 * «حسابي + الإعدادات» — منقول حرفياً من dameen.js (السطور ١٩٤٨-٢٠٨٧):
 * pgAccount→PgAccount, notifTog, privacyTog, setDefAddr, delAddr, logoutAll, walletInfo,
 * saveProfile, saveEmail, savePass, saveAddr, supportOpen, faqOpen.
 * profileForm/emailForm/passForm/addrForm في الأصل تفتح نوافذ openModal (لا تُعيد بناء
 * قسم داخل الصفحة) ⇒ حُوّلت إلى مكوّنات نوافذ (ProfileForm/EmailForm/PassForm/AddrForm)
 * تُفتح عبر openModal(...) كما يفعل الأصل حرفياً.
 * useGeo (السطر ١٣٣٨) مشتركة مع صفحة السلة ⇒ مستوردة من pages/cart.
 * impHero() من core تعيد سلسلة HTML تُحقن كما في الأصل (dangerouslySetInnerHTML).
 * ملاحظة TS: openModal/go/openAuth/toast في store/core/auth تأخذ معاملاً ثانياً اختيارياً
 * بلا قيمة افتراضية ⇒ يُمرَّر undefined صراحة حيث استُدعيت بمعامل واحد في الأصل (نفس الأثر حرفياً).
 */
import { $, ar, money, toast, MONTHS, DB, ptsVal, fdPts } from '../core';
import { ImpHero } from './shop';
import { SES, me, go, render, openModal, closeModal } from '../store';
import { openAuth, switchRole, logout } from '../auth';
import { useGeo } from './cart';

/* pgAccount (السطر ١٩٤٨) */
export function PgAccount(){
if(!SES)return <><div className="pghead"><h1>👤 حسابي</h1></div><div className="empty"><div className="em">👤</div><b>سجّل دخولك للوصول لحسابك</b><span>النقاط، العناوين، الإشعارات والإعدادات كلها هنا</span><button className="btn mt" onClick={()=>openAuth(undefined)}>تسجيل الدخول</button></div></>;
if(SES.role!=='customer')return <><div className="pghead"><h1>👤 حسابي</h1></div><div className="empty"><div className="em">🛍️</div><b>صفحة الحساب لعملاء ضمين</b><span>أنت الآن بدور {SES.role==='merchant'?'التاجر':SES.role==='staff'?'موظف الإدارة':'الإدارة العليا'}</span><button className="btn mt" onClick={()=>switchRole('customer')}>العودة للتسوق كعميل</button></div></>;
const u=me();
const ordersN=DB.orders.filter(o=>o.customer===SES.phone).length;
const disOpen=DB.disputes.filter(d=>d.customer===SES.phone&&d.status==='open').length;
const favN=(u.favs||[]).length;
const nextHund=(100-(u.pts%100))%100;
return <>
<div className="pghead"><h1>👤 حسابي وإعداداتي</h1></div>
<div className="accgrid">
<div>
<div className="acard" style={{display:'flex',gap:'13px',alignItems:'center'}}>
<div className="avat" style={{width:'54px',height:'54px',borderRadius:'17px',fontSize:'21px'}}>{u.name[0]}</div>
<div style={{flex:1}}><b className="fx" style={{fontSize:'15px'}}>{u.name}</b>
<div className="hint">{ar(SES.phone)}{u.email?' · '+u.email:''}</div>
<div className="hint">عضو منذ {MONTHS[new Date(u.since).getMonth()]} {ar(new Date(u.since).getFullYear())}</div></div>
<button className="btn soft sm" onClick={()=>profileForm()}>تعديل</button>
</div>
<div className="ptshero">
<div className="spread"><b className="fx" style={{fontSize:'14px'}}>🌟 نقاط الولاء</b><span className="tag wht">كل ١٠٠ نقطة = {money(100*ptsVal())}</span></div>
<div style={{display:'flex',alignItems:'baseline',gap:'9px',marginTop:'6px'}}>
<span className="fx" style={{fontSize:'34px',fontWeight:800}}>{ar(u.pts||0)}</span><span style={{fontSize:'12px',opacity:'.9'}}>نقطة</span></div>
<div className="pbar"><i style={{width:((u.pts%100)||100)+'%'}}></i></div>
<div style={{fontSize:'10.5px',opacity:'.92'}}>{nextHund?'تبقّى '+ar(nextHund)+' نقطة لخصم ١٠ ريال القادم':'أنت عند حد خصم جاهز — استخدمه في السلة! 🎉'}</div>
<div className="hr" style={{background:'#ffffff30'}}></div>
<div style={{fontSize:'10.5px',opacity:'.95',lineHeight:'1.9'}}>✦ نقطة عن كل ١٠ ريال عند تحرير أي شحنة<br/>✦ +١٠ نقاط مكافأة عند تقييمك للطلب<br/>✦ استبدلها بخصم مباشر من ملخص السلة<br/>✦ {ar(fdPts())} نقطة = 🚚 توصيل مجاني لطلباتك</div>
{(u.ptsLog&&u.ptsLog.length)?<><div className="hr" style={{background:'#ffffff30'}}></div><b style={{fontSize:'11px'}}>سجل النقاط</b>
{u.ptsLog.slice(0,4).map((l,li)=><div className="spread" style={{fontSize:'10.5px',padding:'2.5px 0'}} key={li}><span style={{opacity:'.92'}}>{l.t}</span><b>{l.v>0?'+':''}{ar(l.v)}</b></div>)}</>:null}
</div>
<ImpHero/>
<div className="qtiles">
<div className="qtile" onClick={()=>go('orders',undefined)}><i>🧾</i><b>طلباتي</b><span>{ar(ordersN)} طلبات</span></div>
<div className="qtile" onClick={()=>go('disputes',undefined)}><i>⚖️</i><b>نزاعاتي</b><span>{ar(disOpen)} جارٍ</span></div>
<div className="qtile" onClick={()=>go('favs',undefined)}><i>❤️</i><b>مفضلتي</b><span>{ar(favN)} منتج</span></div>
<div className="qtile" onClick={()=>walletInfo()}><i>🌟</i><b>محفظة ضمين</b><span>{money(u.bal||0)}</span></div>
</div>
</div>
<div>
<div className="acard"><h3>👤 الملف الشخصي</h3>
<div className="setrow"><div className="ic">🏷️</div><div className="tx"><b>الاسم</b><span>{u.name}</span></div><button className="btn soft xs" onClick={()=>profileForm()}>تعديل</button></div>
<div className="setrow"><div className="ic">📱</div><div className="tx"><b>رقم الجوال (معرّف حسابك)</b><span>{ar(SES.phone)}</span></div><span className="tag grn">موثّق</span></div>
<div className="setrow"><div className="ic">✉️</div><div className="tx"><b>البريد الإلكتروني</b><span>{u.email?u.email:'غير مضاف'}</span></div><button className="btn soft xs" onClick={()=>emailForm()}>{u.email?'تعديل':'إضافة'}</button></div>
</div>
<div className="acard"><h3>🔐 كلمة المرور والأمان</h3>
<div className="setrow"><div className="ic">🔑</div><div className="tx"><b>كلمة المرور</b><span>آخر تحديث غير محدد — ننصح بالتغيير الدوري</span></div><button className="btn soft xs" onClick={()=>passForm()}>تغيير</button></div>
<div className="setrow"><div className="ic">💻</div><div className="tx"><b>تسجيل الخروج من كل الأجهزة</b><span>إنهاء جميع الجلسات النشطة باستثناء الحالية</span></div><button className="btn soft xs" onClick={()=>logoutAll()}>تنفيذ</button></div>
</div>
<div className="acard"><h3>📍 عناويني المحفوظة</h3>
{(u.addrs||[]).map((a,i)=><div className="setrow" key={i}><div className="ic">🏠</div><div className="tx"><b>{a.t} {a.def?<span className="tag grn" style={{fontSize:'9px'}}>افتراضي</span>:null}</b><span>{a.a}</span></div>
<div style={{display:'flex',gap:'5px'}}>{a.def?null:<button className="btn soft xs" onClick={()=>setDefAddr(i)}>افتراضي</button>}<button className="btn gray xs" onClick={()=>delAddr(i)}>حذف</button></div></div>)}
<div className="setrow"><div className="ic">➕</div><div className="tx"><b>إضافة عنوان جديد</b><span>مع إمكانية تحديد موقعك تلقائياً</span></div><button className="btn soft xs" onClick={()=>addrForm()}>إضافة</button></div>
</div>
<div className="acard"><h3>🔔 الإشعارات</h3>
{[['ord','تحديثات الطلبات','قبول، شحن، استلام وتحرير المبلغ'],['off','العروض والخصومات','عروض الأقسام والكوبونات الجديدة'],['dis','النزاعات','ردود المتجر ومداخلات الإدارة'],['rev','التقييمات','تذكير بتقييم طلباتك المستلمة']].map(([k,t,s])=>
<div className="setrow" key={k}><div className="ic">🔔</div><div className="tx"><b>{t}</b><span>{s}</span></div>
<button className={'sw '+((u.notif&&u.notif[k])?'on':'')} onClick={()=>notifTog(k)}></button></div>)}
</div>
<div className="acard"><h3>🛡️ الخصوصية</h3>
<div className="setrow"><div className="ic">🙈</div><div className="tx"><b>إخفاء رقم جوالي عن التجار</b><span>يظهر للتاجر كـ«عميل ضمين موثّق» فقط</span></div>
<button className={'sw '+(u.hidePhone?'on':'')} onClick={()=>privacyTog()}></button></div>
<div className="setrow"><div className="ic">📜</div><div className="tx"><b>شفافية استخدام البيانات</b><span>لا نشارك بياناتك مع طرف ثالث — تُستخدم للطلبات والنزاعات فقط</span></div><span className="tag grn">مفعّل دائماً</span></div>
</div>
<div className="acard"><h3>💬 الدعم والمساعدة</h3>
<div className="setrow"><div className="ic">🎧</div><div className="tx"><b>تواصل معنا</b><span>فريق ضمين يجيب خلال ساعات العمل</span></div><button className="btn soft xs" onClick={()=>supportOpen()}>مراسلة</button></div>
<div className="setrow"><div className="ic">❓</div><div className="tx"><b>الأسئلة الشائعة</b><span>كيف يعمل الحجز والتحرير والتحكيم؟</span></div><button className="btn soft xs" onClick={()=>faqOpen()}>عرض</button></div>
</div>
<div className="acard" style={{borderColor:'#A63A2E44'}}><h3 style={{color:'var(--red)'}}>⏻ منطقة الخروج</h3>
<div className="setrow"><div className="ic" style={{background:'#A63A2E10'}}>🚪</div><div className="tx"><b>تسجيل الخروج</b><span>تبقى سلتك ومفضلتك محفوظة لجولتك القادمة</span></div><button className="btn red xs" onClick={()=>logout()}>خروج</button></div>
</div>
</div></div>
</>;
}

/* notifTog/privacyTog/setDefAddr/delAddr/logoutAll/walletInfo (السطور ١٩١٩-٢٠٢٤) */
export function notifTog(k){const u=me();u.notif=u.notif||{};u.notif[k]=!u.notif[k];toast(u.notif[k]?'✓ فُعّل الإشعار':'أُوقف الإشعار',undefined);render()}
export function privacyTog(){const u=me();u.hidePhone=!u.hidePhone;toast(u.hidePhone?'رقمك مخفي عن التجار الآن ✓':'أُلغي إخفاء الرقم',undefined);render()}
export function setDefAddr(i){const u=me();u.addrs.forEach((a,j)=>a.def=j===i);toast('صار «'+u.addrs[i].t+'» العنوان الافتراضي ✓','ok');render()}
export function delAddr(i){const u=me();const t=u.addrs[i].t;u.addrs.splice(i,1);toast('حُذف عنوان «'+t+'»',undefined);render()}
export function logoutAll(){toast('تم إنهاء الجلسات من كل الأجهزة ✓','ok')}
export function walletInfo(){toast('رصيد محفظة ضمين: '+money(me().bal||0)+' — يُستخدم تلقائياً كوسيلة دفع','amb')}

/* profileForm/emailForm/passForm/addrForm (السطور ٢٠٢٥-٢٠٦٢) — نوافذ openModal في الأصل */
function profileForm(){openModal(<ProfileForm/>,undefined)}
function emailForm(){openModal(<EmailForm/>,undefined)}
function passForm(){openModal(<PassForm/>,undefined)}
function addrForm(){openModal(<AddrForm/>,undefined)}
export function ProfileForm(){const u=me();
return <div>
<div className="mhead"><b>تعديل الملف الشخصي</b><button className="x" onClick={()=>closeModal()}>✕</button></div><div className="mbody">
<div className="fld"><label>الاسم الكامل</label><input className="inp" id="pf-nm" defaultValue={u.name}/></div>
<button className="btn wide mt" onClick={()=>saveProfile()}>حفظ التغييرات</button></div>
</div>}
export function EmailForm(){const u=me();
return <div>
<div className="mhead"><b>البريد الإلكتروني</b><button className="x" onClick={()=>closeModal()}>✕</button></div><div className="mbody">
<div className="fld"><label>البريد (لإشعارات الفواتير والعروض)</label><input className="inp" id="pf-em" defaultValue={u.email||''} placeholder="name@mail.com"/></div>
<button className="btn wide mt" onClick={()=>saveEmail()}>حفظ</button></div>
</div>}
export function PassForm(){
return <div>
<div className="mhead"><b>🔑 تغيير كلمة المرور</b><button className="x" onClick={()=>closeModal()}>✕</button></div><div className="mbody">
<div className="fld"><label>كلمة المرور الحالية</label><input className="inp" type="password" id="pw-o"/></div>
<div className="fgrid mt">
<div className="fld"><label>الجديدة</label><input className="inp" type="password" id="pw-n"/></div>
<div className="fld"><label>تأكيد الجديدة</label><input className="inp" type="password" id="pw-c"/></div>
</div>
<button className="btn wide mt" onClick={()=>savePass()}>تحديث كلمة المرور</button></div>
</div>}
export function AddrForm(){
return <div>
<div className="mhead"><b>📍 عنوان جديد</b><button className="x" onClick={()=>closeModal()}>✕</button></div><div className="mbody">
<button className="btn soft wide mb" onClick={()=>useGeo()}>🛰️ تحديد موقعي تلقائياً</button>
<div className="fgrid">
<div className="fld"><label>الاسم المختصر</label><input className="inp" id="ad-t" placeholder="المنزل / العمل / الاستراحة"/></div>
<div className="fld"><label>المدينة</label><input className="inp" id="ad-c" placeholder="الرياض"/></div>
</div>
<div className="fld mt"><label>العنوان التفصيلي</label><input className="inp" id="ad-a" placeholder="الحي، الشارع، رقم المبنى"/></div>
<div className="fld mt"><label>ملاحظة للمندوب (اختياري)</label><input className="inp" id="ad-n" placeholder="مثال: الاتصال قبل الوصول"/></div>
<button className="btn wide mt" onClick={()=>saveAddr()}>حفظ العنوان</button></div>
</div>}

/* saveProfile/saveEmail/savePass/saveAddr (السطور ٢٠٢٩-٢٠٦٨) */
export function saveProfile(){const nm=($('#pf-nm').value||'').trim();
if(nm.length<3){toast('اكتب اسماً صحيحاً','err');return}
me().name=nm;closeModal();toast('حُفظ اسمك ✓','ok');render()}
export function saveEmail(){const em=($('#pf-em').value||'').trim();
if(em&&!em.includes('@')){toast('صيغة بريد غير صحيحة','err');return}
me().email=em;closeModal();toast('حُفظ البريد ✓','ok');render()}
export function savePass(){const u=me();
const o=$('#pw-o').value,n=$('#pw-n').value,c=$('#pw-c').value;
if(o!==u.pass){toast('كلمة المرور الحالية غير صحيحة','err');return}
if(n.length<4){toast('الجديدة ٤ محارف فأكثر','err');return}
if(n!==c){toast('التأكيد لاطابق الجديدة','err');return}
u.pass=n;closeModal();toast('حُدثت كلمة المرور ✓','ok')}
export function saveAddr(){
const t=($('#ad-t').value||'').trim(),c=($('#ad-c').value||'').trim(),a=($('#ad-a').value||'').trim(),n=($('#ad-n').value||'').trim();
if(!t||!a){toast('الاسم المختصر والعنوان التفصيلي مطلوبان','err');return}
const u=me();u.addrs=u.addrs||[];
u.addrs.push({t,a:(c?c+'، ':'')+a+(n?' — '+n:'')});
closeModal();toast('أُضيف العنوان ✓','ok');render()}

/* supportOpen (السطر ٢٠٦٩) */
export function supportOpen(){
openModal(<div>
<div className="mhead"><b>🎧 تواصل معنا</b><button className="x" onClick={()=>closeModal()}>✕</button></div><div className="mbody">
<div className="fld"><label>موضوع الرسالة</label><select className="inp" id="sp-s"><option>استفسار عن طلب</option><option>مشكلة في الدفع</option><option>اقتراح تحسين</option><option>شكوى على متجر</option></select></div>
<div className="fld mt"><label>نص الرسالة</label><textarea className="inp" id="sp-b" style={{minHeight:'90px'}} placeholder="نحن نسمعك…"></textarea></div>
<button className="btn wide mt" onClick={()=>{if(!$('#sp-b').value.trim()){toast('اكتب رسالتك أولاً','err');return}closeModal();toast('وصلت رسالتك — سنرد خلال ٢٤ ساعة 🎧','ok')}}>إرسال</button>
<div className="hint mt" style={{textAlign:'center'}}>أو واتساب الدعم: {ar('0590000000')} · من ٩ ص إلى ٩ م</div></div>
</div>,undefined)}

/* faqOpen (السطر ٢٠٧٥) */
export function faqOpen(){
const F=[['متى يستلم التاجر المبلغ؟','عند استلامك وتقييمك، أو تلقائياً بانتهاء نافذة حماية القسم (من ٣٠ دقيقة حتى ٢٤ ساعة حسب القسم).'],
['ماذا لو كان المنتج تالفاً؟','افتح نزاعاً خلال نافذة الحماية — يبقى مبلغك معلقاً وتحكم الإدارة بعد دردشة ثلاثية مع الأدلة.'],
['كم عمولة ضمين؟','تحددها الإدارة لكل تصنيف على حدة (٢٫٥٪ افتراضياً) — تُحسم من التاجر لحظة التحرير فقط ولا تُضاف على العميل أبداً.'],
['كيف أكسب النقاط؟','نقطة عن كل ١٠ ريال عند تحرير أي شحنة + ١٠ نقاط مع كل تقييم + نقاط هدية على منتجات مختارة — وكل ١٠٠ نقطة تساوي '+money(100*ptsVal())+' خصم، أو '+ar(fdPts())+' نقطة مقابل توصيل مجاني.'],
['هل يمكن الدفع من المحفظة؟','نعم — مبالغ الاسترجاع تضاف لمحفظة ضمين وتستخدمها كوسيلة دفع مباشرة.'],
['كيف تُحسب رسوم الشحن؟','ديناميكياً من مدينة كل متجر إلى مدينتك عبر شركاء ضمين اللوجستيين (OTO/Torod) — ولكل متجر خياراته: توصيل على العميل أو مناصفة أو مجاني، مع سقف شحن مجاني لكل متجر يظهر كشريط تقدم في السلة.'],
['هل يوجد استلام شخصي «يد بيد» من المتجر؟','لا — ملغي كلياً في ضمين: كل شحنة تُصدر لها بوليصة آلية ويُتابع الطلب بالحالات فقط (بلا خريطة مباشرة) حفاظاً على خصوصية الطرفين.'],
['لماذا أرى مدينة المتجر فقط دون حيّه؟','حمايةً من التواصل خارج التطبيق: يظهر للمتاجر مدينة نشاطها فقط، والعنوان التفصيلي يبقى في السيرفر ويُرسل للشريك اللوجستي لإصدار البوليصة دون أن يظهر لك.'],
['كيف أراسل المتجر؟','من صفحة طلباتي — محادثة مرتبطة بالطلب تخضع لفلترة أمنية: أي رقم جوال أو رابط أو وسيلة تواصل خارجية (واتساب/سناب/انستقرام…) تُحجب فوراً مع تنبيه الطرفين والإدارة، وتُحذف المحادثة بعد ٣ مخالفات.'],
['ما طرق الدفع والتقسيط؟','مدى وApple Pay والفيزا/ماستركارد عبر بوابات معتمدة (Moyasar/HyperPay)، والتقسيط عبر تابي (٤ دفعات) وتمارا (٣ دفعات) على إجمالي الفاتورة: المنتجات + الشحن + الضريبة ١٥٪.']];
openModal(<div>
<div className="mhead"><b>❓ الأسئلة الشائعة</b><button className="x" onClick={()=>closeModal()}>✕</button></div><div className="mbody">
{F.map(([q,a],i)=><div style={{borderBottom:'1px dashed var(--line)',padding:'9px 2px'}} key={i}><b style={{fontSize:'12.5px'}}>{q}</b><p className="hint" style={{marginTop:'2px'}}>{a}</p></div>)}</div>
</div>,undefined)}
