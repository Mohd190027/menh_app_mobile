/* اختبار وظيفي شامل — الدفعة ٧: البوابة الجديدة + طلبات التسجيل + الأقسام + الملخص المالي */
const { chromium } = require('playwright');
const fs = require('fs');

const FILE = 'file:///home/z/my-project/download/dameen.html';
const SHOT = '/home/z/my-project/scripts/shots';
if (!fs.existsSync(SHOT)) fs.mkdirSync(SHOT, { recursive: true });

let pass = 0, fail = 0;
const ok = (cond, name) => { if (cond) { pass++; console.log('  ✓ ' + name); } else { fail++; console.log('  ✗ FAIL: ' + name); } };

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  const errors = [];
  page.on('pageerror', e => errors.push('PAGEERROR: ' + e.message));
  page.on('console', m => { if (m.type() === 'error') errors.push('CONSOLE: ' + m.text()); });

  await page.goto(FILE);
  await page.waitForTimeout(600);
  ok(errors.length === 0, 'الصفحة تُحمَّل بلا أخطاء JS');

  /* ===== [1] بوابة الدخول الجديدة — التصميم ===== */
  console.log('\n== [1] بوابة الدخول الجديدة ==');
  await page.evaluate(() => openAuth());
  await page.waitForTimeout(250);
  ok(await page.locator('.authhero').count() === 1, 'هيرو البوابة الجديدة (شعار ضمين + تدرج أخضر)');
  ok(await page.locator('.atabs .atab').count() === 2, 'تبويبان: تسجيل الدخول / حساب جديد');
  ok(await page.locator('#lg-id').count() === 1, 'حقل الجوال أو البريد');
  const lgLabel = await page.locator('.mcard').innerText();
  ok(lgLabel.includes('رقم الجوال أو البريد الإلكتروني'), 'التسمية صحيحة (جوال أو بريد)');
  ok(await page.locator('#lg-pw').count() === 1, 'حقل كلمة المرور تحته');
  ok(await page.locator('.gbtn').count() === 1 && lgLabel.includes('المتابعة بحساب Google'), 'زر Google تحت كلمة المرور');
  ok(await page.locator('.switchbox .btn').count() === 3, 'حسابات التجربة الثلاثة موجودة');
  ok(await page.locator('.gbtn svg').count() === 1, 'شعار G الملون يظهر (GICON)');
  await page.screenshot({ path: SHOT + '/b7-auth-login.png' });

  /* ===== [2] دخول بالبريد + بالجوال ===== */
  console.log('\n== [2] الدخول الموحد ==');
  await page.fill('#lg-id', 'noura@mail.com');
  await page.fill('#lg-pw', '1234');
  await page.evaluate(() => doLogin());
  await page.waitForTimeout(300);
  ok(page.evaluate(() => SES && SES.role === 'customer'), 'دخول العميلة نورة ببريدها الإلكتروني');
  await page.evaluate(() => logout());
  await page.evaluate(() => openAuth('merchant'));
  await page.waitForTimeout(200);
  const prefill = await page.inputValue('#lg-id');
  ok(prefill === '0500000002', 'بوابة التاجر تعبئ جوال ريم تلقائياً');
  await page.evaluate(() => doLogin());
  await page.waitForTimeout(300);
  ok(page.evaluate(() => SES && SES.role === 'merchant' && VIEW.page === 'm-dash'), 'دخول التاجرة ريم وتوجيهها للوحة التاجر');
  await page.evaluate(() => logout());
  await page.evaluate(() => openAuth());
  await page.fill('#lg-id', 'fahd@dameen.sa');
  await page.fill('#lg-pw', '1234');
  await page.evaluate(() => doLogin());
  await page.waitForTimeout(300);
  ok(page.evaluate(() => SES && SES.role === 'admin' && VIEW.page === 'a-over'), 'دخول الإدارة فهد ببريده وتوجيهه للمركز');
  await page.evaluate(() => logout());
  await page.evaluate(() => openAuth());
  await page.fill('#lg-id', '0500000001');
  await page.fill('#lg-pw', '0000');
  await page.evaluate(() => doLogin());
  await page.waitForTimeout(200);
  ok(page.evaluate(() => SES === null), 'كلمة مرور خاطئة = لا دخول');

  /* ===== [3] نموذج حساب جديد: عميل ← متجر/إدارة ===== */
  console.log('\n== [3] نماذج التسجيل الثلاثة ==');
  await page.evaluate(() => authTab('reg'));
  await page.waitForTimeout(200);
  let body = await page.locator('.mcard').innerText();
  ok(await page.locator('#rg-nm').count() === 1 && await page.locator('#rg-em').count() === 1, 'أسئلة العميل: الاسم والجوال والبريد والمدينة');
  ok(await page.locator('#rg-city option').count() >= 10, 'قائمة مدن المملكة');
  ok(await page.locator('#rg-pw2').count() === 1, 'تأكيد كلمة المرور للعميل');
  ok(body.includes('متجر جديد') && body.includes('حساب إدارة'), 'زرا متجر جديد وحساب إدارة تحت أسئلة العميل');
  await page.screenshot({ path: SHOT + '/b7-auth-reg.png' });

  await page.evaluate(() => regTab('store'));
  await page.waitForTimeout(200);
  body = await page.locator('.mcard').innerText();
  ok(['#st-nm', '#st-own', '#st-ph', '#st-em', '#st-cr', '#st-iban', '#st-pw', '#st-pw2', '#st-doc-btn'].every(async id => await page.locator(id).count() === 1), 'فورم المتجر: الاسم/المالك/الجوال/البريد/السجل/الآيبان/الوثيقة/كلمة المرور وتأكيدها');
  ok(await page.locator('.secpick button').count() === 4, 'أربعة أزرار لاختيار عالم المتجر');
  await page.screenshot({ path: SHOT + '/b7-auth-reg-store.png' });

  // تقديم طلب متجر (من العالم الثاني: المأكولات)
  await page.fill('#st-nm', 'تمور الواحة الذهبية');
  await page.fill('#st-own', 'سلمان الحارثي');
  await page.fill('#st-ph', '0509876543');
  await page.fill('#st-em', 'salman@waha.sa');
  await page.fill('#st-cr', '1050998877');
  await page.fill('#st-iban', 'SA4420000001234567891234');
  await page.fill('#st-pw', '9999');
  await page.fill('#st-pw2', '9999');
  await page.click('.secpick button:nth-child(2)');
  await page.waitForTimeout(150);
  const secOK = await page.evaluate(() => AUTH.sec === 'family');
  const kept = await page.inputValue('#st-nm');
  ok(secOK, 'اختيار عالم المتجر بالنقر (المأكولات والضيافة)');
  ok(kept === 'تمور الواحة الذهبية', 'اختيار العالم لا يمسح بيانات النموذج');
  await page.evaluate(() => doRegStore());
  await page.waitForTimeout(300);
  ok((await page.locator('.mcard').innerText()).includes('استلمنا طلبك'), 'نافذة تأكيد استلام الطلب');
  const st = await page.evaluate(() => ({ r: DB.reqs[0], n: DB.reqs.length }));
  ok(st.r.kind === 'store' && st.r.store === 'تمور الواحة الذهبية' && st.r.sec === 'family' && st.r.status === 'pending', 'الطلب خُزّن مع العالم المختار');
  ok(await page.evaluate(() => USERS['0509876543'].pend === 'store'), 'حساب صاحب المتجر معلق بانتظار الموافقة');
  await page.evaluate(() => closeModal());

  // الدخول محجوز للمعلق
  await page.evaluate(() => openAuth());
  await page.fill('#lg-id', '0509876543');
  await page.fill('#lg-pw', '9999');
  await page.evaluate(() => doLogin());
  await page.waitForTimeout(200);
  ok(page.evaluate(() => SES === null), 'الدخول محجوز حتى توافق الإدارة');
  await page.evaluate(() => closeModal());

  // طلب إدارة عبر الفورم
  await page.evaluate(() => openAuth());
  await page.evaluate(() => { authTab('reg'); regTab('admin'); });
  await page.waitForTimeout(200);
  await page.fill('#ad-nm', 'عبدالرحمن السبيعي');
  await page.fill('#ad-ph', '0509998877');
  await page.fill('#ad-em', 'abdulrahman@adm.sa');
  await page.fill('#ad-code', 'DMN-2026');
  await page.fill('#ad-pw', '8888');
  await page.fill('#ad-pw2', '8888');
  await page.evaluate(() => doRegAdmin());
  await page.waitForTimeout(250);
  ok(await page.evaluate(() => DB.reqs[0].kind === 'admin' && USERS['0509998877'].pend === 'admin'), 'طلب الإدارة خُزّن وحسابه معلق');
  // رمز خاطئ يُرفض
  await page.evaluate(() => { closeModal(); openAuth(); authTab('reg'); regTab('admin'); });
  await page.waitForTimeout(150);
  await page.fill('#ad-nm', 'مخالف');
  await page.fill('#ad-ph', '0501110000');
  await page.fill('#ad-em', 'x@x.sa');
  await page.fill('#ad-code', 'WRONG');
  await page.evaluate(() => doRegAdmin());
  await page.waitForTimeout(200);
  ok(await page.evaluate(() => DB.reqs.filter(r => r.own === 'مخالف').length === 0), 'رمز دعوة خاطئ = لا طلب');
  await page.evaluate(() => closeModal());

  /* ===== [4] لوحة الإدارة: طلبات التسجيل ===== */
  console.log('\n== [4] طلبات التسجيل في الإدارة ==');
  await page.evaluate(() => quickLogin('admin'));
  await page.waitForTimeout(300);
  const navTxt = await page.locator('#top').innerText();
  ok(navTxt.includes('📋 طلبات التسجيل') && navTxt.includes('🗂️ الأقسام'), 'القائمة الجديدة: طلبات التسجيل + الأقسام');
  ok(!navTxt.includes('المستخدمون'), 'صفحة المستخدمون حُذفت من القائمة');
  await page.evaluate(() => go('a-reqs'));
  await page.waitForTimeout(250);
  const reqsTxt = await page.locator('#app').innerText();
  ok(reqsTxt.includes('عطور تلال الطائف') && reqsTxt.includes('SA0380000000608010167519'), 'الطلب المزروع يظهر بتفاصيله (الاسم والآيبان)');
  ok(reqsTxt.includes('تمور الواحة الذهبية') && reqsTxt.includes('سلمان الحارثي'), 'طلب الفورم الحي يظهر');
  ok(reqsTxt.includes('خالد المطيري') && reqsTxt.includes('مشرف تحكيم'), 'طلب الإدارة يظهر بتفاصيله');
  ok(reqsTxt.includes('السجل التجاري') && reqsTxt.includes('العالم المختار'), 'بطاقة التفاصيل الكاملة');
  await page.screenshot({ path: SHOT + '/b7-a-reqs.png' });

  // موافقة على متجر الفورم الحي (له مستخدم معلق) ثم الدخول به
  await page.evaluate(() => aApproveReq(DB.reqs.find(r => r.store === 'تمور الواحة الذهبية').id));
  await page.waitForTimeout(300);
  const ap = await page.evaluate(() => {
    const s = STORES.find(x => x.name === 'تمور الواحة الذهبية');
    return { s, u: USERS['0509876543'], pend: DB.reqs.filter(r => r.status === 'pending').length };
  });
  ok(ap.s && ap.s.approved === true && ap.s.sec === 'family' && ap.s.iban === 'SA4420000001234567891234', 'المتجر فُتح معتمداً بالعالم الصحيح وبآيبانه');
  ok(ap.u.pend === null && ap.u.store === ap.s.id, 'حُجب التعليق عن صاحبه وربط متجره');
  ok(ap.pend === 3, 'بقيت الطلبات الأخرى معلقة (عطور تلال + خالد + عبدالرحمن)');
  await page.evaluate(() => logout());
  await page.evaluate(() => openAuth());
  await page.fill('#lg-id', '0509876543');
  await page.fill('#lg-pw', '9999');
  await page.evaluate(() => doLogin());
  await page.waitForTimeout(350);
  ok(page.evaluate(() => SES && SES.role === 'merchant' && VIEW.page === 'm-dash'), 'صاحب المتجر يدخل فور الموافقة ويصل للوحة التاجر');
  await page.evaluate(() => logout());

  // رفض طلب الإدارة الحي بسبب
  await page.evaluate(() => quickLogin('admin'));
  await page.waitForTimeout(250);
  await page.evaluate(() => go('a-reqs'));
  await page.evaluate(() => aRejectReq(DB.reqs.find(r => r.own === 'عبدالرحمن السبيعي').id));
  await page.waitForTimeout(250);
  await page.fill('#rj-why', 'لا توجد شاغر إشرافية حالياً');
  await page.evaluate(() => doRejectReq());
  await page.waitForTimeout(300);
  const rj = await page.evaluate(() => ({ u: USERS['0509998877'], r: DB.reqs.find(x => x.own === 'عبدالرحمن السبيعي') }));
  ok(rj.r.status === 'rejected' && rj.r.why.includes('شاغر'), 'الطلب مرفوض بسبب مسجل');
  ok(rj.u.rejected && rj.u.pend === null, 'حساب الطالب موسوم بالرفض');
  await page.evaluate(() => logout());
  await page.evaluate(() => openAuth());
  await page.fill('#lg-id', '0509998877');
  await page.fill('#lg-pw', '8888');
  await page.evaluate(() => doLogin());
  await page.waitForTimeout(200);
  ok(page.evaluate(() => SES === null), 'المرفوض لا يستطيع الدخول');
  await page.evaluate(() => closeModal());

  /* ===== [5] صفحة الأقسام والتصنيفات ===== */
  console.log('\n== [5] الأقسام والتصنيفات ==');
  await page.evaluate(() => quickLogin('admin'));
  await page.waitForTimeout(250);
  await page.evaluate(() => go('a-cats'));
  await page.waitForTimeout(300);
  const catsTxt = await page.locator('#app').innerText();
  ok(catsTxt.includes('عالم الأزياء والجمال') && catsTxt.includes('عالم المأكولات والضيافة') && catsTxt.includes('عالم الهدايا والديكور والمناسبات'), 'العوالم الثلاثة ببطاقاتها');
  ok(await page.locator('#cc-fashion-0').count() === 1, 'حقل عمولة لكل تصنيف');
  ok(catsTxt.includes('منتج'), 'عدد منتجات كل تصنيف');
  await page.screenshot({ path: SHOT + '/b7-a-cats.png' });

  // تعديل عمولة «عبايات» إلى ١٠٪
  await page.fill('#cc-fashion-0', '10');
  await page.evaluate(() => catSave('fashion', 0));
  await page.waitForTimeout(250);
  ok(await page.evaluate(() => CATS.fashion[0].comm === 10), 'عمولة العبايات صارت ١٠٪');

  // إضافة تصنيف جديد ثم حذفه (خطوتان)
  await page.fill('#nc-fashion', 'عطور فاخرة');
  await page.fill('#ncc-fashion', '5');
  await page.evaluate(() => catAdd('fashion'));
  await page.waitForTimeout(250);
  ok(await page.evaluate(() => CATS.fashion.some(c => c.n === 'عطور فاخرة' && c.comm === 5)), 'أُضيف تصنيف «عطور فاخرة» بعمولة ٥٪');
  const idx = await page.evaluate(() => CATS.fashion.findIndex(c => c.n === 'عطور فاخرة'));
  await page.evaluate(idx2 => catDel('fashion', idx2), idx);
  await page.waitForTimeout(200);
  await page.evaluate(idx2 => catDel('fashion', idx2), idx);
  await page.waitForTimeout(250);
  ok(await page.evaluate(() => !CATS.fashion.some(c => c.n === 'عطور فاخرة')), 'حُذف التصنيف الفارغ بعد تأكيد الخطوتين');

  // حذف تصنيف فيه منتجات ممنوع
  await page.evaluate(() => catDel('fashion', 0));
  await page.waitForTimeout(200);
  const stillThere = await page.evaluate(() => CATS.fashion[0].n === 'عبايات');
  await page.evaluate(() => catDel('fashion', 0));
  await page.waitForTimeout(250);
  ok(await page.evaluate(() => CATS.fashion[0].n === 'عبايات' && CATS.fashion[0].comm === 10), 'حذف تصنيف فيه منتجات مرفوض — والعمولة ١٠٪ باقية');
  ok(stillThere, 'خطوة التأكيد الأولى لم تحذف شيئاً');

  /* ===== [6] العمولة حسب التصنيف في التحرير ===== */
  console.log('\n== [6] عمولة التحرير حسب التصنيف ==');
  const before = await page.evaluate(() => ({ rev: DB.aRevenue, w: DB.storeWallets.s1 }));
  const rel = await page.evaluate(() => {
    const o = { id: 9999, customer: '0500000001', at: Date.now(), pay: 'mada', addr: 'الرياض', groups: [{ store: 's1', items: [{ pid: 'p1', qty: 2, price: 100 }], sub: 200, status: 'received', complaintUntil: Date.now() + 6e4 }] };
    DB.orders.unshift(o);
    doRelease(o, o.groups[0], 'اختبار آلي');
    return o.groups[0].payout;
  });
  const after = await page.evaluate(() => ({ rev: DB.aRevenue, w: DB.storeWallets.s1 }));
  ok(Math.abs(rel.comm - 20) < 0.01, 'عمولة ١٠٪ على منتجات العبايات = ٢٠ ر.س (كانت ستصبح ٥)');
  ok(Math.abs(rel.net - 180) < 0.01, 'صافي التاجر ١٨٠ ر.س');
  ok(Math.abs((after.rev - before.rev) - 20) < 0.01 && Math.abs((after.w - before.w) - 180) < 0.01, 'التوزيع الآلي: العمولة للإدارة والصافي للمحفظة');
  // إعادة العمولة إلى ٢٫٥ والتحقق من قيمة الافتراضي
  await page.evaluate(() => { CATS.fashion[0].comm = 2.5; render(); });
  const rel2 = await page.evaluate(() => {
    const o = { id: 9998, customer: '0500000001', at: Date.now(), pay: 'mada', addr: 'الرياض', groups: [{ store: 's1', items: [{ pid: 'p1', qty: 2, price: 100 }], sub: 200, status: 'received' }] };
    DB.orders.unshift(o);
    doRelease(o, o.groups[0], 'اختبار آلي');
    return o.groups[0].payout.comm;
  });
  ok(Math.abs(rel2 - 5) < 0.01, 'إعادة العمولة لـ٢٫٥٪ تعيد الحساب لـ٥ ر.س');

  /* ===== [7] صفحة الإيرادات — الملخص المالي ===== */
  console.log('\n== [7] الملخص المالي الشامل ==');
  await page.evaluate(() => go('a-rev'));
  await page.waitForTimeout(300);
  const revTxt = await page.locator('#app').innerText();
  ok(revTxt.includes('الملخص المالي الشامل'), 'بطاقة الملخص المالي الشامل');
  ok(revTxt.includes('إجمالي قيمة الطلبات') && revTxt.includes('المحجوز في خزنة الضمان') && revTxt.includes('عمولات ضمين المحصلة'), 'بنود الملخص: الإجمالي والمحجوز والعمولات');
  ok(revTxt.includes('دعم شحن تحمله التجار') && revTxt.includes('التزامات النقاط') && revTxt.includes('مسترجع للعملاء'), 'بنود دعم الشحن والنقاط والاسترجاع');
  ok(revTxt.includes('معادلة الخزنة') && revTxt.includes('الدفاتر متوازنة'), 'معادلة الخزنة متوازنة ✓');
  await page.screenshot({ path: SHOT + '/b7-a-rev.png' });

  // إعدادات النقاط برقم حر
  await page.fill('#pv-inp', '0.25');
  await page.evaluate(() => setPtsVal(document.getElementById('pv-inp').value));
  await page.waitForTimeout(250);
  ok(await page.evaluate(() => DB.ptsVal === 0.25), 'قيمة النقطة صارت ٠٫٢٥ برقم حر');
  await page.fill('#fd-inp', '400');
  await page.evaluate(() => setFreeDlPts(document.getElementById('fd-inp').value));
  await page.waitForTimeout(250);
  ok(await page.evaluate(() => DB.freeDlPts === 400), 'نقاط التوصيل المجاني صارت ٤٠٠ برقم حر');
  await page.fill('#pv-inp', '5');
  await page.evaluate(() => setPtsVal(document.getElementById('pv-inp').value));
  await page.waitForTimeout(250);
  ok(await page.evaluate(() => DB.ptsVal === 0.25), 'قيمة خارج النطاق (٥) مرفوضة');
  await page.evaluate(() => { DB.ptsVal = 0.1; DB.freeDlPts = 250; render(); });

  /* ===== [8] فورم منتجات التاجر يعرض عمولة التصنيف ===== */
  console.log('\n== [8] تكامل التاجر ==');
  await page.evaluate(() => { CATS.fashion[0].comm = 10; logout(); openAuth(); });
  await page.fill('#lg-id', 'rima@dafi.sa');
  await page.fill('#lg-pw', '1234');
  await page.evaluate(() => doLogin());
  await page.waitForTimeout(300);
  await page.evaluate(() => mProdForm('p1'));
  await page.waitForTimeout(250);
  const pform = await page.locator('.mcard').innerText();
  ok(pform.includes('عمولة ١٠٪'), 'فورم المنتج يعرض عمولة تصنيف العبايات');
  await page.evaluate(() => closeModal());
  await page.evaluate(() => go('m-set'));
  await page.waitForTimeout(250);
  const mset = await page.locator('#app').innerText();
  ok(mset.includes('عمولة ضمين على تصنيفاتك') && mset.includes('عبايات ١٠٪'), 'إعدادات المتجر تعرض عمولة كل تصنيف');
  await page.evaluate(() => { CATS.fashion[0].comm = 2.5; });

  /* ===== [9] Google المحاكى ===== */
  console.log('\n== [9] Google ==');
  await page.evaluate(() => { logout(); openAuth(); });
  await page.evaluate(() => gAuth());
  await page.waitForTimeout(250);
  const gTxt = await page.locator('.mcard').innerText();
  ok(gTxt.includes('نورة العبدالله') && gTxt.includes('rima@dafi.sa') && gTxt.includes('حساب Google آخر'), 'نافذة اختيار الحساب');
  await page.evaluate(() => gLogin('0500000001'));
  await page.waitForTimeout(300);
  ok(page.evaluate(() => SES && SES.role === 'customer'), 'دخول نورة عبر Google');
  await page.evaluate(() => logout());
  await page.evaluate(() => gNew());
  await page.waitForTimeout(250);
  const preMail = await page.inputValue('#rg-em');
  ok((await page.inputValue('#rg-nm')).length > 0 && preMail.includes('@gmail.com'), 'حساب Google جديد يعبئ الاسم والبريد');

  /* ===== [10] تسجيل عميل جديد بالنقاط الترحيبية ===== */
  await page.fill('#rg-ph', '0507776666');
  await page.fill('#rg-pw', '7777');
  await page.fill('#rg-pw2', '7777');
  await page.evaluate(() => doRegister());
  await page.waitForTimeout(300);
  ok(page.evaluate(() => SES && USERS['0507776666'].pts === 50), 'حساب العميل الجديد + ٥٠ نقطة');
  await page.evaluate(() => logout());

  /* ===== [11] الجوال ٣٩٠px ===== */
  console.log('\n== [11] الجوال ==');
  await page.setViewportSize({ width: 390, height: 844 });
  await page.evaluate(() => openAuth());
  await page.waitForTimeout(250);
  await page.screenshot({ path: SHOT + '/b7-mob-auth.png' });
  await page.evaluate(() => quickLogin('admin'));
  await page.waitForTimeout(250);
  await page.evaluate(() => go('a-reqs'));
  await page.waitForTimeout(250);
  await page.screenshot({ path: SHOT + '/b7-mob-reqs.png' });
  await page.evaluate(() => go('a-cats'));
  await page.waitForTimeout(250);
  await page.screenshot({ path: SHOT + '/b7-mob-cats.png' });
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  ok(overflow <= 0, 'لا تجاوز أفقي على جوال ٣٩٠px');

  /* ===== [12] لا أخطاء JS طوال الجلسة ===== */
  console.log('\n== [12] الأخطاء ==');
  const realErrors = errors.filter(e => !e.includes('favicon'));
  ok(realErrors.length === 0, 'صفر أخطاء JS في كامل الاختبارات' + (realErrors.length ? ' — ' + realErrors[0] : ''));

  await browser.close();
  console.log('\n==============================');
  console.log('النتيجة: ' + pass + ' ✓ / ' + fail + ' ✗');
  process.exit(fail ? 1 : 0);
})();
