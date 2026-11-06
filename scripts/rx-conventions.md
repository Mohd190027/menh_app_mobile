# اتفاقيات تحويل «ضمين» إلى React — اقرأها كاملة قبل كتابة أي سطر

## المهمة
تحويل دوال صفحات dameen.js الأصلي إلى **مكوّنات React** بنفس التصميم بالضبط: نفس عناصر DOM، نفس الفئات (class)، نفس النصوص العربية حرفياً، نفس الأرقام، نفس المنطق. **ممنوع** تغيير التصميم أو تحسينه أو إعادة ترتيبه أو حذف أي شيء.

## المصدر والمخرجات
- المصدر الوحيد: `/home/z/my-project/public/dameen/dameen.js` (ستُخبَر بنطاق أسطرك في كل مهمة).
- الأساس الجاهز: اقرأه قبل التحويل:
  - `src/dameen/core.ts` — كل البيانات والمساعدات النقية (ar, ard, money, esc, toast, dt, ago, clock, hash, SECTIONS, CATS, STORES, PRODUCTS, USERS, DB, MED, IMP, impSeed, impAdd, impRefund, impAnim, impactBlock, impHero, medOf, P, ST, SEC, secOf, eff, stOK, storeOwner, catComm, ptsVal, fdPts, PTI, CITIES, CITY_DL, COURIERS, shipQuote, mkLogi, chatGuard, durTxt, tempTxt, pvidsBlock, vidFail, $, r2, esc, hash, imgTag, STARS, MONTHS, GICON لا هنا)
  - `src/dameen/store.ts` — الحالة: SES, VIEW, CART, GFav, CK, CPN, PTS, RATE, COMP, EVP, FREE_DL, LASTSEC, ASTT, AUTH, REQDOC, REJ, CATDEL, QTY, PANS, OCHAT, ORATE, MSPID, MIMGS, MVIDS, MPID, MPQ, MPQOPEN, COMPS + الدوال: me, isFav, cartCount, custCity, myStore, go, render, renderTop, pushNotif, openModal, closeModal, appSave, bumpUI, useUI, useAppTick + **المطاوعات setX()**
  - `src/dameen/ui.tsx` — `<Img src cls alt/>` (بديل imgTag)، `<Stars r/>` (بديل STARS)، `zoomImg(src)`
  - `src/dameen/auth.tsx` — openAuth, doLogin, quickLogin, switchRole, logout, openBell
  - `src/dameen/top.tsx` — Top, Fab, searchGo, homeGo
  - `src/dameen/install.ts` — appMode, installApp

## قواعد التحويل (إلزامية)

### 1) الدوال
- كل دالة صفحة `pgX()` تصبح مكوّناً `export function PgX()` يعيد JSX — بنفس ترتيب وبنية العناصر.
- دوال الأفعال (doAdd/mSaveProd/...) تبقى دوال عادية `export function` بنفس الاسم والمنطق الحرفي.
- أي كود كان يعمل عند استدعاء دالة الصفحة (مثل `QTY=1; PANS={}`) يبقى في جسم المكوّن — لأن المكوّن يعاد بناؤه كلياً عند كل `render()` (نفس أثر innerHTML في الأصل).
- **إعادة إسناد متغير عالمي**: روابط الاستيراد للقراءة فقط ⇒ استخدم المطاوعة: `CART=[]` → `setCART([])`، `OCHAT=null` → `setOCHAT(null)`، `MIMGS=[]` → `setMIMGS([])`… (متاحة: setSES, setVIEW, setCART, setGFav, setCK, setCPN, setPTS, setQTY, setPANS, setRATE, setCOMP, setEVP, setFREE_DL, setOCHAT, setORATE, setMSPID, setMIMGS, setMVIDS, setMPID, setMPQ, setMPQOPEN, setREQDOC, setAUTH, setREJ, setCATDEL). **تعديل حقول** كائن (`CK.step=2`، `ORATE.stars=n`، `PANS[i]=v`) لا يحتاج مطاوعة.
- `render()` تعني إعادة بناء كاملة (استوردها من store واستدعها كما في الأصل). `renderTop()` كما هي.

### 2) HTML → JSX
- `class=` → `className=` ، `<input>`/`<img>`/`<br>` تُغلق ذاتياً `/>'.
- المعالجات: `onclick="fn('a',2)"` → `onClick={()=>fn('a',2)}` — متعددة العبارات: `onclick="closeModal();go('orders')"` → `onClick={()=>{closeModal();go('orders')}}`.
- `onchange="x(this.value)"` → `onChange={e=>x(e.target.value)}` ، `oninput=` → `onInput=` ، `onkeydown="if(event.key==='Enter')fn()"` → `onKeyDown={e=>{if(e.key==='Enter')fn()}}`.
- `onclick="event.stopPropagation();this.classList.toggle('open')"` → `onClick={e=>{e.stopPropagation();e.currentTarget.classList.toggle('open')}}`.
- القيم الديناميكية `${x}` → `{x}`. الشرطيات `${c?A:''}` → `{c?A:null}`.
- `.map(...).join('')` → `.map(...)` مع `key={i}`.
- السمات: `data-cd="${ms}"` → `data-cd={ms}` ، `data-v=` → `data-v=` (تُكتب كما هي).
- `style="padding:9px 11px"` → `style={{padding:'9px 11px'}}` (kebab→camelCase: border-radius→borderRadius, text-align→textAlign…). خاصية CSS مخصصة: `style="--c:${s.color}"` → `style={{'--c':s.color} as any}`.
- قيم الحقول: `value="${esc(X||'')}"` → `defaultValue={X||''}` (حقول يقرؤها الكود بـ `$('#id').value` تبقى غير مُدارة). السمة `selected` على option → `defaultValue` على select.
- **esc()**: احذفها من نصوص JSX (React يهرّب تلقائياً). **بقيت إلزامية** داخل نداءات `toast()` (لأن toast يحقن innerHTML) وفي أي `b.innerHTML=` مباشر.
- `imgTag(src,cls,alt)` → `<Img src={src} cls={cls} alt={alt}/>` (بدون esc).
- `STARS(r)` → `<Stars r={r}/>`.
- `<video ... onerror="vidFail(this)">` → `onError={e=>vidFail(e.currentTarget)}`.
- روابط نصية `<a onclick="...">` → `<a onClick={...}>`.

### 3) التحديث الجزئي للمناطق (كانت `$('#x').innerHTML=...`)
استخدم `bumpUI(key)` والمكوّن الذي يملك المنطقة يقرأ `useUI(key)` (المفاتيح المحجوزة):
- `ckRefresh()` → `bumpUI('ckbody')` — صفحة السلة/الدفع: منطقة `<CkBody/>` داخلها useUI('ckbody').
- `compRefresh()` → `bumpUI('compbody')` — داخل نافذة الشكوى.
- `dispSelfRefresh()` → `bumpUI('disp')` — داخل نافذة النزاع (وأي `$('.mcard').innerHTML=ochatHTML()` في ochatRefresh → `bumpUI('ochat')`).
- `mpImgsRefresh()/mpVidsRefresh()/mpqRefresh()/ptsCostPrev()/offPrev()` وكل تحديث لشارات/أقسام الاستوديو أو الفورم → `bumpUI('mstudio')` — كل من `<MsChips/> <MsImgsSec/> <MsVidsSec/>` (ومن يستدعيها) يقرأ useUI('mstudio').
- سلوك DOM بعد التحديث (مثل `$('#chatlog').scrollTop=$('#chatlog').scrollHeight` في ochatRefresh): ضعه في `useEffect` داخل مكوّن المنطقة (يعمل بعد كل تحديث للمنطقة).
- شارة نجوم التقييم: `starPick(n)` الأصلية تعدّل classList مباشرة عبر querySelectorAll — انقلها كما هي حرفياً (تعمل على عناصر DOM موجودة) مع `RATE`/`ORATE` العالمية.

### 4) النوافذ
- `openModal(\`...html...\`)` → `openModal(<XModal .../>)`: أنشئ مكوّن نافذة يعيد نفس الـ JSX (ترويسة `.mhead` بزر `.x` + جسم `.mbody`) ثم مرره لـ openModal. الوسائط المحفوظة: zoomImg(src) من ui.tsx.
- أي نافذة لها تبويبات/حالة داخلية (مثل openRate/openComplaint/openDispute/استوديو): الحالة تبقى في المتغيرات العالمية نفسها (ORATE/COMP/EVP/…) والتحديث عبر bumpUI أو openModal جديد كما يفعل الأصل.

### 5) ممنوعات
- لا تغيّر نصاً عربياً ولا رقماً ولا فئة CSS ولا معرّف عنصر (id) — كلها جزء من التصميم.
- لا تحذف فروع الشرط أو تعالجها «بشكل أجمل».
- لا تستخدم Tailwind أو مكتبات UI — JSX خام بنفس فئات الأصل فقط.
- لا تلمس public/dameen/* أو download/* أو أي ملف أساس غير ملفك.
- لا تضف `import` لمكتبات خارجية.
- لا تكتب `dangerouslySetInnerHTML` إلا إن أشار الأصل صراحة لحقن HTML خارجي (نادر جداً).

## مرجع سريع (مثال)
الأصل:
```js
function pcard(p){
const s=ST(p.store),e=eff(p),fav=isFav(p.id);
return `<div class="pcard" onclick="go('product','${p.id}')">
<img src="${p.imgs[0]}" class="pimg" alt="${esc(p.name)}">
<span class="stars">'+'★'.repeat(...)</span></div>`}
```
المحوَّل:
```tsx
import { ST, eff } from '../core';
import { go, isFav } from '../store';
import { Img, Stars } from '../ui';
function Pcard({p}){
const s=ST(p.store),e=eff(p),fav=isFav(p.id);
return <div className="pcard" onClick={()=>go('product',p.id)}>
<Img src={p.imgs[0]} cls="pimg" alt={p.name}/>
<Stars r={p.rating}/></div>}
```

## فحص ذاتي قبل التسليم (إلزامي)
1. `grep -n 'onclick=\|onchange=\|oninput=\|onerror="\|class="' <ملفك>` ⇒ يجب أن يكون **فارغاً**.
2. `grep -n '\${' <ملفك>` ⇒ فارغ (لا قوالب نصية متبقية).
3. `bunx tsc --noEmit 2>&1 | grep <ملفك>` ⇒ لا أخطاء.
4. تأكد أن كل دالة صفحة تُصدَّر بالاسم المطلوب تماماً.
