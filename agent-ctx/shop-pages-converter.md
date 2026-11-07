# سجل عمل — تحويل صفحات التسوّق إلى React (shop.tsx)

## المهمة
تحويل دوال dameen.js (السطور ٢٢٥-٢٥٩: impactBlock/impInfo/impHero/playVid/pvidsBlock + السطور ٦٤٩-٩٥٣: pcard→pgDLib وأفعالها) إلى `/home/z/my-project/src/dameen/pages/shop.tsx` وفق rx-conventions.md، بنفس DOM/الفئات/النصوص حرفياً.

## ما تم (المخرجات النهائية)
- **صفحات (export function)**: PgHome, PgSearch, PgSection, PgStore, PgProduct, PgFavs, PgDLib — `if(!p) return <PgHome/>;` و `if(!s) return <PgHome/>;` كما طُلب.
- **مكونات قوالب (export)**: Pcard({p}), Mstore({s}), Bigstore({s}), StoreMedia({s}), DlBadge({p}), RevBlock({p}), ImpactBar() (من impactBlock), ImpHero() (من impHero — يُستعمل خارج نطاقي في السطر ١٩٧٧ بلوحة التاجر، لذا مُصدَّر), PvidsBlock({p}), QBlock({q,i,color}).
- **مكونات نوافذ داخلية**: ImpInfoModal (mhead/mbody/impsteps حرفياً), PlayVidModal (mhead + mbody vmodal مع `<video … onError={e=>vidFail(e.currentTarget)}>` وشارة durTxt), DLinkModal (رابط S3 المؤقت مع data-cd).
- **أفعال (export function بنفس الأسماء)**: playVid, addToCart, toggleFav, submitRating, qStep, panChip, starPick, dReveal, dCopy, dLink, dDownload, searchNoOp (دالة فارغة كما وردت في التكليف).
- **مساعدات داخلية (لا تصدير)**: pubProds, ars, `let DLN:any=null` (السطر ٩٣٣).

## قرارات تحويل مهمة (للوكلاء اللاحقين)
1. **كتابة VIEW**: store.ts يُصدّر `VIEW={page:'home'}` بنوع `{page:string}` ⇒ كل وصول لحقول ديناميكية (q/sec/cat/store/scat/pid/_pid/tab/gi) يتطلب `VIEW as any`. استخدمت `const V=VIEW as any;` في رأس كل مكوّن/دالة تحتاجه (يقرأ الربط الحي في كل render — لا تكتب `const V` على مستوى الموديول لأن go() يعيد إسناد VIEW).
2. **أرقام الوسائط في TS**: `openModal(node)` بمعامل واحد يخطئ TS2554 (store.ts يعرّف cls بلا افتراضي) ⇒ أكتب `openModal(node,'')`. كذلك `go('home',undefined)` و`toast(msg,undefined)` عند غياب المعامل (نفس قيم الأصل حرفياً).
3. **addToCart**: الأصل ينادي `renderTop();renderFab()` — لا وجود لـ renderFab في النسخة React (Fab يقرأ useAppTick) ⇒ استُبدلت بـ `render()` (تُحدّث top+fab+app، وappSave). ملاحظة جانبية: هذا يعيد بناء الصفحة (الأصل كان يبقيها) — النتيجة المرئية متطابقة (QTY/PANS/RATE عالمية فتُستعاد).
4. **اتحاد أنواع PRODUCTS/STORES**: أي منتج/متجر من `P()/ST()` يُوصل لحقول اختيارية (qs/vids/fragile/temp/pts/logo/…) يُسبَق بـ `as any` (`const p=P(V.pid) as any`) — casting لا يغيّر شيئاً وقت التشغيل.
5. `esc()` أبقيتها فقط داخل toast في addToCart (toast يحقن innerHTML) وحذفتها من كل JSX.
6. مؤثرات DOM مباشرة كما هي: starPick (classList على #rstars span)، qStep (`$('#qv').textContent`)، dReveal (`el.dataset.on`)، dDownload (Blob + a.click).
7. الصور: `<Img src cls alt/>` بدل imgTag، `<Stars r/>` بدل STARS، وصور trio/bigstore/thumbs/logos ظلت `<img>` عادية لأن لها onerror مخصصاً غير بذورة picsum.
8. `impInfo` أصبحت ImpInfoModal تُفتح من ImpactBar بـ `openModal(<ImpInfoModal/>,'')`، وplayVid فتحتها كدالة تحمل الوسائط الأصلية (pid,src,dur) → `openModal(<PlayVidModal …/>,'lg')`.
9. تكرار `track` مرتين في bubtrack عبر `{track}{track}` (React يعالج المصفوفتين بمفاتيح مُسلسَلة تلقائياً — بلا تعارض).
10. bumpUI: لا شيء في هذا الملف (كما بالتكليف) — كل التحديثات render() كاملة.

## فحوصات ذاتية (نتائج نهائية)
- grep onclick/onchange/oninput/onerror="/class= ⇒ فارغ ✓
- grep '$\{' ⇒ فارغ ✓
- `bunx tsc --noEmit | grep shop.tsx` ⇒ لا أخطاء ✓
- تصدير كل الأسماء المطلوبة ✓ (تحقق آلي عبر استيراد bun: 29 تصديراً، لا نواقص)

## ملاحظات للمنسّق
- **خلل قائم قبل عملي**: `src/app/page.tsx` يستورد `'./dameen/app'` والمسار الصحيح `'../dameen/app'` (الملف في src/dameen/app.tsx) ⇒ الصفحة / تُرجع 500 والسيرفر يفشل في الحزمة. الخطأ موجود في baseline قبل تعديلي ولا يجوز لي لمس الملف — يحتاج إصلاحاً من مالك page.tsx.
- ملفات dameen أخرى (core/store/ui/auth/top/app) فيها أخطاء tsc أساسية (openModal بمعامل واحد، VIEW.q، …) — baseline وليست من ملفي.
- eslint على shop.tsx: تحذيرات alt-text لصور الشعارات (الأصل بلا alt — أبقيتها كما هي) وتحذيرا no-unused-expressions لثلاثية toggleFav (منطق الأصل الحرفي)، وخطأ react-hooks/immutability لسطر التهيئة `V._pid=V.pid…` في PgProduct — هذا النمط مفروض بالتكليف (كود كان يعمل عند استدعاء دالة الصفحة يبقى في جسم المكوّن) والمترجم الفعلي غير مفعّل في next.config.
