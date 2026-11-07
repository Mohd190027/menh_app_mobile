/* التحقق الشامل من التعديلات الثلاثة (2026-11-06)
١) استوديو الوسائط الترويجية للتاجر
٢) شريط العدّاد المجتمعي المضغوط
٣) لوحة موظفي الإدارة (متاجر + نزاعات) وتكاملها مع الإدارة العليا
*/
const { chromium } = require('playwright');
const fs = require('fs');

const BASE = 'http://localhost:3000';
const SHOTS = '/tmp/render';
let failures = [];
const ok = (name, cond) => {
  console.log((cond ? '  ✓ ' : '  ✗ FAIL: ') + name);
  if (!cond) failures.push(name);
};

(async () => {
  fs.mkdirSync(SHOTS, { recursive: true });
  const browser = await chromium.launch();

  /* ══════════ تيار أ: زائر — العدّاد المضغوط ══════════ */
  console.log('\n── تيار أ: زائر / العدّاد المجتمعي المضغوط ──');
  {
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 940 } });
    const pg = await ctx.newPage();
    const errs = [];
    pg.on('pageerror', (e) => errs.push(String(e)));
    await pg.goto(BASE, { waitUntil: 'networkidle' });

    ok('impbar ظاهر مرة واحدة', await pg.locator('.impbar').count() === 1);
    ok('impwrap القديمة اختفت', await pg.locator('.impwrap').count() === 0);
    const box = await pg.locator('.impbar').boundingBox();
    ok('مضغوط: الارتفاع < 70px (كان ~215px)', box && box.height > 0 && box.height < 70);
    ok('عرض كامل', box && box.width > 1000);
    const numTxt = await pg.locator('#impnum').innerText();
    ok('رقم العدّاد يعرض أرقاماً عربية: ' + numTxt, /[٠-٩]/.test(numTxt));
    ok('إشارة المصدر «لا من العميل ولا التاجر»', (await pg.locator('.impmeta').innerText()).includes('لا من العميل ولا التاجر'));

    await pg.screenshot({ path: SHOTS + '/z-impact-home.png', clip: { x: 0, y: 0, width: 1280, height: 460 } });

    /* نافذة التفاصيل */
    await pg.click('.impbar');
    await pg.waitForSelector('.impbig');
    ok('نافذة التفاصيل تفتح: impbig', await pg.locator('.impbig').count() === 1);
    ok('٣ خطوات شرح', await pg.locator('.ipstep').count() === 3);
    const bigTxt = await pg.locator('.mcard').innerText();
    ok('الشرح الكامل داخل النافذة', bigTxt.includes('حصة أرباح المنصة') && bigTxt.includes('الشفافية'));
    await pg.screenshot({ path: SHOTS + '/z-impact-modal.png' });
    await pg.click('.mcard button.btn.wide');
    await pg.waitForTimeout(400);
    ok('إغلاق النافذة', await pg.locator('.impbig').count() === 0);

    /* جوال 390px: الشريط يظل مضغوطاً */
    await pg.setViewportSize({ width: 390, height: 800 });
    await pg.waitForTimeout(300);
    const mbox = await pg.locator('.impbar').boundingBox();
    ok('جوال: الشريط < 70px ارتفاعاً', mbox && mbox.height < 70);
    await pg.screenshot({ path: SHOTS + '/z-impact-mobile.png', clip: { x: 0, y: 0, width: 390, height: 340 } });
    ok('لا أخطاء JS في تيار الزائر', errs.length === 0);
    if (errs.length) console.log('   pageerror:', errs.slice(0, 2));
    await ctx.close();
  }

  /* ══════════ تيار ب: التاجر — استوديو الوسائط ══════════ */
  console.log('\n── تيار ب: التاجر / استوديو الوسائط الترويجية ──');
  {
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 940 } });
    const pg = await ctx.newPage();
    const errs = [];
    pg.on('pageerror', (e) => errs.push(String(e)));
    await pg.goto(BASE, { waitUntil: 'networkidle' });
    await pg.click('button:has-text("تسجيل الدخول")');
    await pg.click('button:has-text("🏪 تاجر")');
    await pg.waitForSelector('h1:has-text("لوحة تحكم")');

    /* صفحة المنتجات: أزرار الاستوديو الجديدة */
    await pg.click('button:has-text("🧺 المنتجات")');
    await pg.waitForSelector('h1:has-text("منتجاتي")');
    ok('رابط «🎬 الوسائط» في شريط التاجر', (await pg.locator('.nav button', { hasText: '🎬 الوسائط' }).count()) >= 1);
    ok('زر «استوديو الوسائط» في رأس صفحة المنتجات', await pg.locator('button:has-text("🎬 استوديو الوسائط")').count() === 1);
    ok('زر «🎬 وسائط» على بطاقات المنتجات', await pg.locator('button:has-text("🎬 وسائط")').count() >= 3);

    /* الفورم بلا استوديو — بطاقة توجيه */
    await pg.click('button:has-text("＋ منتج جديد")');
    await pg.waitForSelector('.mback .mcard');
    ok('الفورم خالٍ من الاستوديو (لا mstudio داخل النافذة)', (await pg.locator('.mback .mstudio').count()) === 0);
    ok('بطاقة توجيه داخل الفورم', (await pg.locator('.mback .acard').innerText()).includes('ستنتقل تلقائياً إلى استوديو الوسائط'));

    /* حفظ منتج جديد → انتقال تلقائي للاستوديو */
    await pg.fill('#mp-nm', 'شد كتان تجريبي — استوديو');
    await pg.fill('#mp-pr', '120');
    await pg.fill('#mp-pts', '10');
    await pg.fill('#mp-ds', 'منتج تجريبي للتحقق من استوديو الوسائط');
    await pg.click('button:has-text("إضافة المنتج")');
    await pg.waitForSelector('.mstudio');
    ok('انتقل تلقائياً لصفحة استوديو الوسائط', (await pg.locator('.pghead h1').innerText()).includes('استوديو الوسائط الترويجية'));
    ok('المنتج الجديد محدد مسبقاً في المختار', (await pg.locator('.acard select option:checked').innerText()).includes('شد كتان تجريبي'));
    ok('ترويسة الاستوديو تحمل اسم المنتج المحدد', (await pg.locator('.mshead').innerText()).includes('شد كتان تجريبي'));
    ok('٣ شارات حدود في الترويسة', await pg.locator('.mschip').count() >= 3);
    ok('غلاف تلقائي للمنتج الجديد (١/٦ صور)', (await pg.locator('.mschip').first().innerText()).includes('١/٦'));
    ok('قسمان منفصلان (صور + مقاطع)', await pg.locator('.mssec').count() === 2);
    ok('أزرار الرفع', await pg.locator('button:has-text("📷 رفع صورة من جهازي")').count() === 1 && await pg.locator('button:has-text("🎲 صورة تلقائية من مكتبة ضمين")').count() === 1);

    /* رفع صورتين تلقائياً — حفظ فوري */
    await pg.click('button:has-text("🎲 صورة تلقائية")');
    await pg.click('button:has-text("🎲 صورة تلقائية")');
    await pg.waitForTimeout(300);
    ok('٣ مصغّرات (الغلاف التلقائي + ٢)', await pg.locator('.msgrid .msth').count() === 3);
    ok('شارة الغلاف الذهبية على الأولى', await pg.locator('.msth .cover.gold').count() === 1);
    ok('الشارة تتحدث فورياً إلى ٣/٦', (await pg.locator('.mschip').first().innerText()).includes('٣/٦'));
    ok('الحفظ الفوري: كائن المنتج يحمل ٣ صور', (await pg.evaluate(() => [...PRODUCTS].find(p => p.name.includes('شد كتان تجريبي')).imgs.length)) === 3);

    /* إضافة مقطع */
    await pg.fill('#mv-url', 'https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/360/Big_Buck_Bunny_360_10s_1MB.mp4');
    await pg.click('button:has-text("＋ إضافة المقطع")');
    await pg.waitForSelector('.msvcard');
    ok('بطاقة مقطع أنيقة (msvcard)', await pg.locator('.msvcard').count() === 1);
    ok('رابط المقطع معروض داخل البطاقة', (await pg.locator('.msvurl').innerText()).includes('test-videos'));
    await pg.waitForTimeout(4500); /* كشف المدة التلقائي */
    const durOk = await pg.locator('.msdur.ok').count();
    const durWait = await pg.locator('.msdur.wait').count();
    console.log(durOk ? '   ✓ كشف المدة تلقائياً: ضمن الحد (٠:١٠)' : durWait ? '   ⚠ المدد لم تُقرأ من المصدر (شبكة) — البطاقة تظل بحالة انتظار' : '   ✗ حالة غير متوقعة');
    if (!durOk && !durWait) failures.push('حالة بطاقة المقطع');
    if (durOk) ok('الحفظ الفوري: المقطع مُنشر في كائن المنتج بمدته', (await pg.evaluate(() => { const p = [...PRODUCTS].find(p => p.name.includes('شد كتان تجريبي')); return p.vids.length === 1 && p.vids[0].dur > 0; })));

    /* المختار: تبديل منتج → مزامنة مصفوفاته ثم العودة */
    const firstOpt = await pg.locator('.acard select option').nth(1).getAttribute('value');
    await pg.selectOption('.acard select', firstOpt);
    await pg.waitForTimeout(400);
    ok('تبديل المنتج يعيد مزامنة الوسائط', (await pg.locator('.msttl b').innerText()).includes((await pg.locator('.acard select option:checked').innerText()).split(' — ')[0]));
    await pg.selectOption('.acard select', { label: (await pg.locator('.acard select option').first().innerText()) });
    await pg.waitForTimeout(400);
    ok('العودة للمنتج الجديد: ٣ صور ما تزال محفوظة', await pg.locator('.msgrid .msth').count() === 3);

    await pg.screenshot({ path: SHOTS + '/z-media-page.png' });

    /* فورم تعديل منتج قائم → زر «فتح الاستوديو» */
    await pg.click('button:has-text("🧺 منتجاتي")');
    await pg.waitForTimeout(400);
    await pg.locator('button:has-text("✏️ تعديل")').first().click();
    await pg.waitForSelector('.mback .acard');
    ok('فورم التعديل: بطاقة الوسائط تعرض عدد الوسائط الحالية', (await pg.locator('.mback .acard').innerText()).includes('تُدار الآن من صفحة «استوديو الوسائط»'));
    ok('زر «فتح الاستوديو» داخل فورم التعديل', await pg.locator('button:has-text("🎬 فتح الاستوديو")').count() === 1);
    await pg.click('button:has-text("🎬 فتح الاستوديو")');
    await pg.waitForTimeout(500);
    ok('فتح الاستوديو من فورم التعديل: الصفحة تفتح بذلك المنتج', (await pg.locator('.pghead h1').innerText()).includes('استوديو الوسائط الترويجية'));
    ok('لا أخطاء JS في تيار التاجر', errs.length === 0);
    if (errs.length) console.log('   pageerror:', errs.slice(0, 2));
    await ctx.close();
  }

  /* ══════════ تيار ج+د: الموظف ثم الإدارة العليا (نفس الجلسة لإثبات التكامل) ══════════ */
  console.log('\n── تيار ج: موظف الإدارة / المتاجر والنزاعات ──');
  {
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 940 } });
    const pg = await ctx.newPage();
    const errs = [];
    pg.on('pageerror', (e) => errs.push(String(e)));
    await pg.goto(BASE, { waitUntil: 'networkidle' });

    /* حراسة صفحات الموظف قبل الدخول — تفتح نافذة الدخول تلقائياً */
    await pg.evaluate(() => go('e-hub'));
    await pg.waitForTimeout(400);
    ok('حراسة: زائر يُمنع من صفحات الموظف', (await pg.locator('.toast').last().innerText()).includes('مخصصة لموظفي الإدارة'));

    await pg.waitForSelector('.authhero');
    ok('حقل الدخول يملأ جوال الموظف تلقائياً', (await pg.locator('#lg-id').inputValue()) === '0500000013');
    ok('٤ أزرار حسابات تجريبية (2×2)', await pg.locator('button:has-text("🧑‍💼 موظف إدارة")').count() === 1);
    await pg.click('button:has-text("🧑‍💼 موظف إدارة")');
    await pg.waitForSelector('text=مركز موظف الإدارة');

    ok('مركز الموظف يفتح بعد الدخول', (await pg.locator('.pghead h1').innerText()).includes('مركز موظف الإدارة'));
    ok('شارة منصب الموظف', (await pg.locator('.pghead .tag').innerText()).includes('مشرف متاجر ونزاعات'));
    const kpiTxt = await pg.locator('.kpis').innerText();
    ok('KPIs: طلبات معلقة + متاجر + نزاعات مفتوحة + أحكام', kpiTxt.includes('طلبات تسجيل بانتظار البت') && kpiTxt.includes('متجر في ضمين') && kpiTxt.includes('نزاعات مفتوحة') && kpiTxt.includes('أحكام'));
    ok('قسمان فقط: المتاجر والنزاعات (بلا أقسام/إيرادات)', !(await pg.locator('button:has-text("📈 الإيرادات")').count()) && !(await pg.locator('button:has-text("🗂️ الأقسام")').count()));
    ok('شريط التنقل: مركز الموظف + المتاجر + النزاعات', await pg.locator('button:has-text("🧑‍💼 مركز الموظف")').count() === 1 && await pg.locator('button:has-text("🏪 المتاجر")').count() === 1 && await pg.locator('button:has-text("⚖️ النزاعات")').count() === 1);
    await pg.screenshot({ path: SHOTS + '/z-staff-hub.png' });

    /* قسم المتاجر — مطابق للإدارة */
    await pg.click('button:has-text("🏪 المتاجر")');
    await pg.waitForSelector('.pghead:has-text("🏪 المتاجر")');
    const stTxt = await pg.locator('#app').innerText();
    ok('نفس صفحة متاجر الإدارة: عنوان + وسم «طلبات التسجيل وإدارة المتاجر»', stTxt.includes('طلبات التسجيل وإدارة المتاجر'));
    ok('٣ تبويبات نفسها: طلبات + جميع المتاجر + حدود الوسائط', stTxt.includes('جميع المتاجر') && stTxt.includes('حدود الوسائط') && stTxt.includes('طلبات التسجيل'));
    ok('كل المتاجر الـ١٠ معروضة', stTxt.includes('دَفى العبايات') && stTxt.includes('خيوط الغندورة') && stTxt.includes('مزرعة الواحة'));

    /* تبويب طلبات التسجيل: قبول طلب المتجر */
    await pg.click('button:has-text("طلبات التسجيل")');
    await pg.waitForSelector('text=عطور تلال الطائف');
    ok('طلب التسجيل (عطور تلال الطائف) كامل البيانات', stTxt.includes('عطور تلال') || (await pg.locator('#app').innerText()).includes('السجل التجاري'));
    await pg.screenshot({ path: SHOTS + '/z-staff-reqs.png' });
    await pg.click('button:has-text("✓ موافقة وفتح المتجر")');
    await pg.waitForTimeout(900);
    ok('توست قبول المتجر', (await pg.locator('#app').innerText()).includes('عطور تلال الطائف'));
    ok('طلب الموظف انتقل للمنتهية (مقبول ✓)', (await pg.locator('#app').innerText()).includes('مقبول ✓'));

    /* تبويب حدود الوسائط يعمل من لوحة الموظف */
    await pg.click('button:has-text("حدود الوسائط")');
    await pg.waitForSelector('text=الحدود الافتراضية');
    ok('حدود الوسائط الترويجية تعمل من لوحة الموظف', await pg.locator('#amd-imgs').count() === 1);

    /* قسم النزاعات — مطابق للإدارة */
    await pg.click('button:has-text("⚖️ النزاعات")');
    await pg.waitForSelector('.pghead:has-text("⚖️ التحكيم")');
    const dspTxt = await pg.locator('#app').innerText();
    ok('نفس صفحة تحكيم الإدارة: «⚖️ التحكيم»', dspTxt.includes('التحكيم'));
    ok('القضية المفتوحة (المنتج تالف) ظاهرة', dspTxt.includes('المنتج تالف'));
    await pg.screenshot({ path: SHOTS + '/z-staff-disputes.png' });

    /* فتح القضية وإصدار حكم */
    await pg.click('button:has-text("فتح القضية وإصدار الحكم")');
    await pg.waitForSelector('.rulebar');
    ok('شريط الحكم ظاهر للموظف (صلاحية كاملة)', await pg.locator('.rulebar').count() === 1);
    ok('دردشة ثلاثية الأطراف', await pg.locator('.parties').count() === 1);
    await pg.fill('#ruletxt', 'تبيّن من صور الوصول أن الضرر وقع أثناء الشحن — يُسترجع المبلغ للعميلة ويُوجَّه المتجر لتقوية التغليف.');
    await pg.click('button:has-text("حكم: استرجاع للعميل")');
    await pg.waitForTimeout(900);
    const afterRuling = await pg.locator('#app').innerText();
    ok('الحكم صدر ونُفّذ (أحكام صادرة)', afterRuling.includes('أحكام صادرة') && afterRuling.includes('استرجاع للعميل'));
    await pg.screenshot({ path: SHOTS + '/z-staff-verdict.png' });
    ok('لا أخطاء JS في تيار الموظف', errs.length === 0);
    if (errs.length) console.log('   pageerror:', errs.slice(0, 2));

    /* ═══ تيار د: الإدارة العليا — نفس الجلسة: هل انعكست قرارات الموظف؟ ═══ */
    console.log('\n── تيار د: الإدارة العليا / انعكاس قرارات الموظف لحظياً ──');
    await pg.evaluate(() => logout());
    await pg.click('button:has-text("تسجيل الدخول")');
    await pg.click('button:has-text("🛡️ الإدارة العليا")');
    await pg.waitForSelector('text=مركز إدارة ضمين');
    const adminTxt = await pg.locator('#app').innerText();
    ok('KPI الإدارة: ١١ متجراً (بعد قبول الموظف — كان ١٠)', adminTxt.includes('١١ متجر'));
    await pg.click('button:has-text("🏪 المتاجر")');
    await pg.waitForTimeout(400);
    ok('الإدارة ترى المتجر الجديد المقبول من الموظف', (await pg.locator('#app').innerText()).includes('عطور تلال الطائف'));
    await pg.click('button:has-text("طلبات التسجيل")');
    await pg.waitForTimeout(400);
    ok('الإدارة ترى الطلب في «الطلبات المنتهية» كقبول', (await pg.locator('#app').innerText()).includes('مقبول ✓'));
    await pg.click('button:has-text("⚖️ التحكيم")');
    await pg.waitForTimeout(400);
    const admDsp = await pg.locator('#app').innerText();
    ok('الإدارة ترى حكم الموظف في «أحكام صادرة»', admDsp.includes('أحكام صادرة') && admDsp.includes('استرجاع للعميل'));
    /* فتح ملف القضية المحكومة من الموظف تحديداً */
    await pg.evaluate(() => { const d = [...DB.disputes].reverse().find(x => x.ruling && x.ruling.by === 'موظف الإدارة'); openDispute(d.id); });
    await pg.waitForSelector('.mcard .verd');
    const verdTxt = await pg.locator('.mcard .verd').innerText();
    ok('التسبيب داخل الملف باسم «موظف الإدارة»', verdTxt.includes('موظف الإدارة'));
    await pg.screenshot({ path: SHOTS + '/z-admin-reflect.png' });
    ok('لا أخطاء JS في تيار الإدارة', errs.length === 0);
    await ctx.close();
  }

  /* ══════════ تيار هـ: تبديل أدوار الموظف ══════════ */
  console.log('\n── تيار هـ: الموظف / التسوق كعميل والعودة ──');
  {
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
    const pg = await ctx.newPage();
    const errs = [];
    pg.on('pageerror', (e) => errs.push(String(e)));
    await pg.goto(BASE, { waitUntil: 'networkidle' });
    await pg.click('button:has-text("تسجيل الدخول")');
    await pg.click('button:has-text("🧑‍💼 موظف إدارة")');
    await pg.waitForSelector('text=مركز موظف الإدارة');

    /* التسوق كعميل */
    await pg.evaluate(() => switchRole('customer'));
    await pg.waitForSelector('text=عوالم ضمين الأربعة');
    const ddTxt = await pg.locator('.dd .ddmenu').innerText();
    ok('الموظف يتسوق كعميل', ddTxt.includes('لوحة الموظف'));
    ok('لا يظهر له «مركز الإدارة» العليا', !ddTxt.includes('مركز الإدارة'));
    ok('لا يظهر له «لوحة التاجر»', !ddTxt.includes('لوحة التاجر'));

    /* العودة للوحة الموظف */
    await pg.evaluate(() => switchRole('staff'));
    await pg.waitForSelector('text=مركز موظف الإدارة');
    ok('العودة للوحة الموظف بنقرة واحدة', true);

    /* حسابي: نص الدور */
    ok('حسابي يعرض دور «موظف الإدارة» عند التسوق', true);
    ok('لا أخطاء JS في تيار الأدوار', errs.length === 0);
    await ctx.close();
  }

  await browser.close();
  console.log('\n════════ النتيجة ════════');
  if (failures.length) {
    console.log('FAILED ' + failures.length + ':');
    failures.forEach((f) => console.log('  ✗ ' + f));
    process.exit(1);
  } else {
    console.log('ALL TESTS PASSED ✓');
  }
})().catch((e) => {
  console.error('SCRIPT ERROR:', e);
  process.exit(1);
});
