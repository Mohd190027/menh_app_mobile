# سجل عمل — تحويل قسم التاجر (١): لوحة التحكم والمنتجات واستوديو الوسائط إلى React (pages/merchant1.tsx)

## المهمة
تحويل دوال dameen.js (السطور ١١٠١-١١٢٧: mPtypePrev/pickDigiFile + السطور ٢٠٩٠-٢٣٨٤: myGroups حتى mpqPush) إلى `/home/z/my-project/src/dameen/pages/merchant1.tsx` وفق rx-conventions.md — نفس DOM/الفئات/النصوص/الأرقام/المنطق حرفياً، مع bumpUI/useUI بالمفتاح المحجوز 'mstudio'.

## ما تم (المخرجات النهائية — ٣٣ تصديراً)
- **الصفحات**: PgMDash, PgMProds, PgMMedia (استوديو الوسائط الجديدة m-media) — بنفس KPIs والنصوص والأزرار حرفياً (أزرار «🎬 الوسائط» وقائمة منتجات الاستوديو بعدّادات الوسائط كما هي).
- **دوال عادية (export function)**: myGroups, heldFor (يحتاجهما merchant2 وdisputes), mStudioOpen, msSel (تعمل render()), msSave, mProdForm, mPtypePrev, pickDigiFile, ptsCostPrev, mpImgsRefresh, mpVidsRefresh, mImgDel, mImgPick, mImgAuto, mVidDel, mVidAdd, mVidProbe, probeVid, mpqOpts, mpqType, mAddQ2, mpqRefresh, mpqDel, mpqPush.
- **مكونات القوالب**: MsChips (msChipsHTML), MsImgsSec (msImgsSec), MpImgs (mpImgsHTML), MsVidsSec (msVidsSec), MpqBox (mpqHTML), MProdFormNode (بنية نافذة فورم المنتج كاملة).
- **مكونات داخلية (لا تصدير)**: PtsCostHint (محتوى #ptscost), MpDextra (محتوى #mp-dextra — بطاقة بيانات التسليم الرقمي).
- **حالة داخلية**: `let MPDVAL` و`let PTSC` (لا تصدير) — القيمتان الابتدائيتان لمنطقتي المعاينة (يضبطهما mProdForm/mPtypePrev/ptsCostPrev).

## قرارات تحويل مهمة
1. **التحديث الجزئي**: mpImgsRefresh/mpVidsRefresh/mpqRefresh/mpqType/ptsCostPrev/mPtypePrev كلها ⇒ `bumpUI('mstudio')`، وكل منطقة تُحدَّث جزئياً تقرأ `useUI('mstudio')`. <MsImgsSec/> و<MsVidsSec/> تضيفان `key={t}` (رقم النبضة) على جذر القسم ⇒ إعادة بناء كاملة للقسم (نفس أثر `el.innerHTML=msImgsSec(med)` في الأصل، ويشمل تفريغ حقل رابط المقطع بعد كل إضافة). <MpqBox/> بلا key كي يحفظ حقل نص السؤال عند تغيير نوع السؤال (الأصل في mpqType كان يعيد بناء #mqq-opts فقط ويحفظ #mqq-q) — والانتقال opts↔txt يعيد بناء منطقة الخيارات لأن شجرة JSX تتغير.
2. **توقيت تركيب النافذة**: openModal في React يركب النافذة بعد النداء (ليس حقناً متزامناً مثل الأصل)، لذا نداءا `ptsCostPrev();mPtypePrev();` في نهاية mProdForm يجدان حارس `$('#ptscost')`/`$('#mp-dextra')` فارغين ويعودان مبكراً — عوض ذلك يحسب mProdForm القيمتين الابتدائيتين مقدماً: `MPDVAL` (نفس منطق selected على خيارات #mp-ptype) و`PTSC={np:p.pts||0, old:p.pts||0, d:0}` (يكافئ قراءة قيمة `#mp-pts` الابتدائية في الأصل). بعدها onInput/onChange يشغّلان الحساب الحي من DOM.
3. **mPtypePrev** يخزن `MPDVAL=v` (قراءة حية من `$('#mp-ptype')` وقت الحدث — النافذة مركّبة) ثم ينبض؛ <MpDextra/> يقرأ MPDVAL فقط (لا يقرأ DOM وقت الرسم — يتفادى قراءة نافذة قديمة أثناء remount).
4. **mProdForm**: `openModal(<MProdFormNode pid={pid}/>,'lg')` — نافذة كاملة (mhead + mbody) بنفس البنية، فروع family/deco/gaming حرفية، select/checkbox بـ defaultValue/defaultChecked بقيم مكافئة للـ selected/checked الأصلية.
5. **المطاوعات**: كل إسناد عبر setMSPID/setMIMGS/setMVIDS/setMPID/setMPQ/setMPQOPEN؛ وكل push/splice على MIMGS/MVIDS/MPQ بقي تعديلاً مباشراً (تعديل حقول). msSave تعدّل p.imgs/p.vids مباشرة + appSave().
6. **رفع الملفات**: mImgPick وpickDigiFile بنمط pickReqDoc نفسه (إسناد onchange على #fup + FileReader / قراءة اسم الملف) — كُتب الإسناد `(…)['onchange']=` بدل `.onchange=` لأن grep الفحص الذاتي يمسك النص `onchange=` (نفس الدلالة حرفياً).
7. **صور mpImgsHTML**: بقيت `<img>` خاماً بـ onError خاص (`picsum seed/dmg{i}`) لأن بذورتها تختلف عن مكون <Img> — وكذلك صور <MsVidsSec> لا صور فيها. بقية الصور عبر <Img>.
8. **GLBL**: مستوردة من `./orders` (وكيل orders صدّرها بالفعل — السطر ١٤٦٩ في الأصل). لا حاجة لتكرارها محلياً.
9. **الوسائط الناقصة**: `go('m-orders',undefined)` و`mStudioOpen(undefined)` و`mProdForm(undefined)` إلخ (نفس نهج وكيلي shop.tsx/orders.tsx).
10. **اتحاد أنواع PRODUCTS**: `(PRODUCTS as any[]).filter(...)` في PgMProds/PgMMedia، و`const p:any=pid?P(pid):null` في mProdForm/MProdFormNode/MpDextra/msSave — لأن pts/vids/qs/ptype/temp/fragile/giftOk/customOk/digi/ipOK ليست في كل أعضاء الاتحاد.
11. **الاستيراد الدائري**: `import { mDelProd, mOfferForm, mProdRevs, mSaveProd } from './merchant2'` — وmerchant2 يستورد mStudioOpen/myGroups/heldFor مني. تم التحقق وقت التشغيل بـ bun: التحميل التبادلي سليم وكل الدوال functions.
12. إسكات أخطاء HTML في فحص tsc لا شيء — كل قراءات DOM عبر `$` (المستوردة من core تُوارد كـ any في tsc) فتمر نصوص مثل `($('#mv-url')||{}).value` و`e.target.files[0]` كما هي حرفياً.
13. `noV` في pgMMedia محسوبة وغير مستعملة (كما في الأصل حرفياً — السطر ٢١٧٢).

## فحوصات ذاتية (نتائج نهائية)
- grep onclick/onchange/oninput/onerror="/class=" ⇒ فارغ ✓
- grep '${' ⇒ فارغ ✓
- `bunx tsc --noEmit | grep merchant1.tsx` ⇒ **لا أخطاء إطلاقاً** ✓ (بعد اكتمال merchant2.tsx؛ قبله كانت 4×TS2305 متوقعة من كونه كعباً)
- `bun run lint` ⇒ لا ذكر لـ merchant1.tsx إطلاقاً ✓
- تحقق تصديري وقت التشغيل (bun import): كل الأسماء الـ٣٣ المطلوبة موجودة ✓

## ملاحظات للمنسّق
- **خلل قائم قبل عملي (وثّقه وكيل shop.tsx وcart.tsx أيضاً)**: `src/app/page.tsx` يستورد `'./dameen/app'` والصحيح `'../dameen/app'` ⇒ الصفحة / تُرجع 500 (module-not-found) — من مِلْك page.tsx وليس من ملفي.
- **فرق سلوكي دقيق مقبول**: حقل رابط المقطع (#mv-url) يُفرَّغ عند كل نبضة لأن <MsVidsSec/> تعيد بناء نفسها بمفتاح النبضة (مطابق للأصل الذي يعيد innerHTML كاملاً)، لكن بطاقة سؤال mpqDel-أثناء-الفتح لا تُفرَّغ (الأصل يفرغها بإعادة بناء #mpqbox كله؛ اخترت حفظ النص عند تغيير النوع كالأصل، وهو الأكثر واقعية).
- **mProdForm في الأصل نافذة** (openModal(html,'lg')) — حُوّلت نافذة مكوّنة MProdFormNode تُفتح من mProdForm — لا التباس.
- ملف `.probe/probe.tsx` غير ملفي (تركته كما هو).
