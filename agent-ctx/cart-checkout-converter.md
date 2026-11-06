# سجل عمل — تحويل السلة وبوابة الطلب إلى React (pages/cart.tsx)

## المهمة
تحويل دوال dameen.js السطور ١١٣٠-١٤٦٧ (cartCalc, pgCart, cartQty, rmCart, applyCoupon, ptsSet, startCheckout, ckHTML, ckBody, ckRefresh, ckLogin, ckQuick, ckNext, ckBack, addrTxt, useGeo, ckSaveAddr, ckSetAns, ckSetBook, ckSetGift, ckGiftTog, ckEventGeo, ckExtras, placeOrder + OID) إلى `/home/z/my-project/src/dameen/pages/cart.tsx` وفق rx-conventions.md — نفس DOM/الفئات/النصوص/المنطق حرفياً.

## ما تم (المخرجات النهائية)
- **23 تصديراً مطابقاً للمطلوب**: PgCart, cartCalc, cartQty, rmCart, applyCoupon, ptsSet, startCheckout, **CkBody** (مكون ckBody)، ckRefresh, ckLogin, ckQuick, ckNext, ckBack, addrTxt, useGeo, ckSaveAddr, ckSetAns, ckSetBook, ckSetGift, ckGiftTog, ckEventGeo, ckExtras, placeOrder.
- **داخلية (لا تصدير)**: `CkModal` (ckHTML: mhead + mbody#ckbody)، `ckBody()` (محتوى الخطوة)، `let OID=1025`.
- **ckRefresh** ⇒ `bumpUI('ckbody')`، و`CkBody` يقرأ `useUI('ckbody')` ويعيد `<Fragment key={t}>` يضم `<div class="cksteps">{bars}</div>` ثم `{ckBody()}` بالترتيب نفسه — مفتاح النبضة يفرض remount كاملاً للمنطقة (نفس أثر innerHTML: القيم تُستعاد من CK/DB فقط، والحقول غير المربوطة تُفرَّغ).
- **startCheckout**: setCK({step,addr,pay,geo,book,gift,ans,chatG}) + `openModal(<CkModal/>,'lg')`.
- **placeOrder**: حرفي بالكامل — تحقق العنوان/الرصيد/الحجوزات/الإهداء، بناء o + groups (sub/ship/logi عبر mkLogi + بوليصات field/digital الحرفية + fragile unshift)، digital ⇒ grp.digi + u.dlib، أسئلة st.qs ⇒ grp.ans، pans، bal/tabby/tamara، DB.vat، استخدامات الكوبون، خصم النقاط وptsLog، DB.orders.unshift + impAdd، pushNotif للتاجر/العميل/الديجيتال + درددة chatG، ثم `setCART([]);setCPN(null);setPTS(0);setFREE_DL(false);` + ckRefresh + setTimeout المُؤجَّل (1.5s) مع فحص `$('#ckbody')&&$('#modals').innerHTML` كما في الأصل.
- إسنادات CK للحقول تمر بـ `(CK as any).x` لأن store.ts يعرّف CK بنوع ضيق {step,addr,pay} فقط (لا يجوز لمس store.ts) — تعديل الحقول نفسه (لا مطاوعة) كما في الأصل. كذلك `const u=me()` يكفي بلا cast لأن me() تعيد any.
- cartCalc: `const groups:{[k:string]:any}={}` و`quotes` كذلك — ضروري وإلا فـ Object.entries/تعطي unknown في tsc.

## قرارات تحويل مهمة (للوكلاء اللاحقين)
1. **الوسائط الناقصة في TS2554**: toast(msg) بلا نوع ⇒ `toast(msg,undefined)`، وgo('home') ⇒ `go('home',undefined)`، وopenAuth() ⇒ `openAuth(undefined)` — نفس قيم الأصل حرفياً (نفس نهج وكيل shop.tsx: openModal(node,'')).
2. **onInput/onChange**: `e.currentTarget.value` بدل `e.target.value` (React.FormEvent يكتب e.target كـ EventTarget بلا value — e.currentTarget مُنمَّط ويكافئ this.value هنا).
3. **openOChat غير متوفرة بعد**: تُستدعى في زر شاشة النجاح وفي setTimeout داخل placeOrder. orders.tsx (يُكتب بالتوازي) لا يصدّرها بعد ⇒ استوردت `import * as Orders from './orders'` والاستدعاء `(Orders as any).openOChat` داخل حارس — يعمل فور تصدير orders.tsx لها دون تغيير، ولا يكسر tsc الآن.
4. **esc()**: بقيت فقط داخل toast في placeOrder (toast يحقن innerHTML)؛ حُذفت من كل JSX.
5. سلوك ckLogin محفوظ حرفياً: doLogin (المستورد من auth.tsx) يقرأ `$('#lg-id')` الذي لا وجود له في نافذة البوابة (حقل الجوال فيها id="lg-ph" كما بالأصل) — إذن doLogin يرمي TypeError كما في الأصل تماماً وckRefresh لا يعمل؛ ckQuick (quickLogin) يعمل ويسكّر النافذة ثم ckRefresh no-op (لا مشترك) — مطابق للأصل حرفياً.
6. select خيارات المناسبة: `selected` الأصلية ⇒ `defaultValue` على select (بقيمة مكافئة: 'pickup' فقط إن كانت b.dl==='pickup').
7. freeprog/sep/أشرطة الدفع/bars — camelCase للأنماط، و`style={{'--c':s.color} as any}` لبطاقة المجموعة.

## فحوصات ذاتية (نتائج نهائية)
- grep onclick/onchange/oninput/class=" ⇒ فارغ ✓
- grep '${' ⇒ فارغ ✓
- `bunx tsc --noEmit | grep pages/cart.tsx` ⇒ لا أخطاء ✓
- 23 تصديراً كلها بالمطلوب ✓
- `bun run lint` ⇒ لا ذكر لـ cart.tsx إطلاقاً (كل الأخطاء في scripts/ وshop.tsx وغيرها) ✓

## ملاحظات للمنسّق
- **خلل قائم قبل عملي (كما لاحظ وكيل shop.tsx)**: `src/app/page.tsx` يستورد `'./dameen/app'` والمسار الصحيح `'../dameen/app'` ⇒ الصفحة / تُرجع 500 — من مِلْك page.tsx وليس من ملفي.
- **openOChat**: يُتوقع تصديرها من `src/dameen/pages/orders.tsx` (السطر ١٦٠٠ بالأصل) — مرجؤة عبر namespace كما فوق.
- تفاعل بوليصة التابي/تمارا وشاشة النجاح يظهر كاملاً بعد اكتمال orders.tsx (openOChat) — أزرار تتبع الطلب/المكتبة تعمل فوراً.
- اختلاف بسيط عن نص التكليف: التكليف ذكر «pushNotif ثم go('orders')» بينما الأصل ينتهي بـ ckRefresh() (شاشة النجاح) + setTimeout للدردشة، وgo('orders') تُستدعى من زر «📦 تتبع طلبي» في الشاشة نفسها — اتبعت الأصل حرفياً.
