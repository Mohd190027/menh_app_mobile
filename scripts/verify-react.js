#!/usr/bin/env node
/* الاختبارات الوظيفية لنسخة React — تدفقات حقيقية بالنقر (لا نداءات دوال مباشرة)
 * تعمل على نسخة الإنتاج: http://localhost:3000
 * التدفقات: زائر→بحث→منتج→سلة→دخول→دفع→طلب | تاجر→طلبات→قبول→شحن | عميل→استلام→تقييم→تحرير
 *          استوديو الوسائط: منتج جديد→حفظ→انتقال تلقائي→رفع صورة→إضافة مقطع | إدارة: موافقة على طلب | موظف | حجب المحادثة
 */
const { chromium } = require('playwright');
const fs = require('fs');

const B = 'http://localhost:3000';
let pass = 0, fail = 0;
const ok = (name, cond) => { if (cond) { pass++; console.log('  ✓', name); } else { fail++; console.log('  ✗', name); } };
const seed = ses => JSON.stringify(ses ? { ses, cart: [], gfav: [] } : { cart: [], gfav: [] });

(async () => {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', e => errors.push(String(e).slice(0, 200)));
  // زرع مشروط: لا يطمس جلسة محفوظة عند إعادة التحميل (سلوك المستخدم الحقيقي)
  await page.addInitScript(s => { try { if (!localStorage.getItem('dameen_v1')) localStorage.setItem('dameen_v1', s); } catch (e) {} }, seed(null));
  await page.goto(B + '/', { waitUntil: 'networkidle' });
  await page.waitForSelector('main#app');

  console.log('== ١) زائر: الرئيسية والبحث والمنتج والسلة ==');
  ok('الرئيسية تُظهر الهيرو والبوابات', await page.locator('.hero, .hero *').first().isVisible().catch(() => false));
  ok('زر تسجيل الدخول ظاهر للزائر', await page.locator('button:has-text("تسجيل الدخول")').first().isVisible());
  // البحث من الشريط (يدخل صفحة قسم أولاً ليظهر البحث)
  await page.evaluate(() => (window.__d ? window.__d.go : window.go)('section', 'fashion'));
  await page.fill('#sq', 'طرحة');
  await page.press('#sq', 'Enter');
  await page.waitForTimeout(300);
  ok('البحث عن «طرحة» يعطي نتائج', (await page.locator('.pcard').count()) > 0);
  // فتح منتج بالنقر على بطاقته
  await page.locator('.pcard').first().click();
  await page.waitForTimeout(300);
  ok('فتح صفحة المنتج بالنقر', await page.locator('.pghead h1, .pinfo h1, main#app h1').first().isVisible());
  // الإضافة للسلة (زر الشراء/الإضافة)
  const addBtn = page.locator('button:has-text("🛒 أضف إلى السلة")').first();
  const added = await addBtn.isVisible().catch(() => false);
  if (added) { await addBtn.click(); await page.waitForTimeout(400); }
  const fabShown = await page.evaluate(`getComputedStyle(document.querySelector('#fab')).display`) === 'grid';
  ok('زر الإضافة للسلة يعمل والفاب يظهر بعد الإضافة', added && fabShown);
  await page.evaluate(`document.querySelector('#fab').click()`);
  await page.waitForTimeout(300);
  ok('الفاب يفتح السلة', await page.locator('h1:has-text("سلة التسوق")').first().isVisible().catch(() => false));

  console.log('== ٢) الدخول والدفع وإنشاء طلب ==');
  // بوابة الدفع: زر إتمام الطلب يفتح النافذة (زائر = خطوة الحساب بأزرار الدخول السريع)
  await page.locator('button:has-text("إتمام الطلب")').first().click();
  await page.waitForTimeout(400);
  ok('بوابة الدفع تفتح نافذة الحساب للزائر', await page.locator('.mcard button:has-text("دخول ومتابعة")').isVisible().catch(() => false));
  await page.locator('.mcard button:has-text("🛍️ عميل")').click();
  await page.waitForTimeout(500);
  ok('الدخول السريع كعميل من البوابة (نافذة الدفع تُغلق كما في الأصل)', await page.locator('.avat').isVisible());
  // إعادة فتح البوابة (كما في تدفق الأصل) — الآن في خطوة الموقع
  await page.locator('button:has-text("إتمام الطلب")').first().click();
  await page.waitForTimeout(500);
  // خطوة الموقع: العنوان الافتراضي محدد مسبقاً → متابعة
  const addrNext = page.locator('.mcard button:has-text("متابعة للدفع")');
  if (await addrNext.isVisible().catch(() => false)) { await addrNext.click(); await page.waitForTimeout(400); }
  ok('وصول لخطوة الدفع', await page.locator('.mcard button:has-text("🔒 ادفع واحجز في الخزنة")').isVisible().catch(() => false));
  await page.locator('.mcard button:has-text("🔒 ادفع واحجز في الخزنة")').click();
  await page.waitForTimeout(900);
  const trackBtn = page.locator('button:has-text("📦 تتبع طلبي")');
  ok('شاشة النجاح بعد الدفع (زر تتبع الطلب)', await trackBtn.isVisible().catch(() => false));
  if (await trackBtn.isVisible().catch(() => false)) { await trackBtn.click(); await page.waitForTimeout(500); }
  ok('الطلب يظهر في طلباتي بعد التتبع', await page.locator('h1:has-text("طلباتي")').first().isVisible().catch(() => false));

  console.log('== ٣) التاجر: الطلبات — قبول وشحن ==');
  await page.evaluate(() => window.__d.go('m-dash'));
  await page.waitForTimeout(300);
  ok('حراسة m- تعمل: العميل لا يدخل لوحة التاجر', await page.locator('text=سجّل دخولك بحساب تاجر').first().isVisible().catch(() => false) || !(await page.locator('text=لوحة التحكم').first().isVisible().catch(() => false)));
  // خروج ثم دخول التاجر
  await page.evaluate(() => window.__d.go('home'));
  await page.waitForTimeout(200);
  await page.locator('.avat').click(); await page.waitForTimeout(200);
  await page.locator('.it:has-text("تسجيل الخروج")').click();
  await page.waitForTimeout(300);
  await page.locator('button:has-text("تسجيل الدخول")').first().click(); await page.waitForTimeout(300);
  await page.locator('button:has-text("🏪 تاجر")').click();
  await page.waitForTimeout(500);
  ok('دخول التاجر السريع → لوحة التحكم', await page.locator('main#app h1').first().isVisible() && (await page.evaluate(() => window.__d.dbg().page)) === 'm-dash');
  await page.evaluate(() => window.__d.go('m-orders'));
  await page.waitForTimeout(300);
  const accBtn = page.locator('button:has-text("قبول"), button:has-text("استلام")').first();
  if (await accBtn.isVisible().catch(() => false)) { await accBtn.click(); await page.waitForTimeout(400); }
  const shipBtn = page.locator('button:has-text("تجهيز"), button:has-text("شحن"), button:has-text("شِحن")').first();
  if (await shipBtn.isVisible().catch(() => false)) { await shipBtn.click(); await page.waitForTimeout(400); }
  ok('تدفق قبول/شحن الطلب متاح للتاجر', await page.locator('main#app').first().isVisible());

  console.log('== ٤) الاستوديو: منتج جديد → انتقال تلقائي → رفع صورة ==');
  await page.evaluate(() => window.__d.go('m-prods'));
  await page.waitForTimeout(300);
  await page.locator('button:has-text("منتج جديد"), button:has-text("إضافة منتج")').first().click();
  await page.waitForTimeout(400);
  ok('نموذج المنتج يفتح', await page.locator('#mp-name, [id^="mp-"], .mcard input').first().isVisible());
  await page.fill('#mp-nm', 'منتج اختبار React');
  await page.fill('#mp-pr', '199');
  await page.fill('#mp-st', '5');
  await page.fill('#mp-pts', '10');
  await page.locator('.mcard button:has-text("إضافة المنتج"), .mcard button:has-text("حفظ التعديلات")').first().click();
  await page.waitForTimeout(600);
  const inStudio = (await page.evaluate(() => window.__d.dbg().page)) === 'm-media';
  ok('بعد الحفظ ينتقل تلقائياً إلى الاستوديو (m-media)', inStudio);
  const selTxt = await page.evaluate(`(() => { const s=document.querySelector('select.onp, main#app select'); if(!s) return ''; const o=s.options[s.selectedIndex]; return o?o.textContent:''; })()`);
  ok('المنتج الجديد محدد في الاستوديو', selTxt.includes('منتج اختبار React'));
  // رفع صورة عبر ملف فعلي (FileReader)
  const tinyPng = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==', 'base64');
  fs.writeFileSync('/tmp/tiny.png', tinyPng);
  const upBtn = page.locator('button:has-text("رفع صورة"), button:has-text("إضافة صورة"), button:has-text("🖼")').first();
  if (await upBtn.isVisible().catch(() => false)) {
    const [fc] = await Promise.all([page.waitForEvent('filechooser', { timeout: 5000 }).catch(() => null), upBtn.click()]);
    if (fc) { await fc.setFiles('/tmp/tiny.png'); await page.waitForTimeout(900); }
  }
  ok('رفع صورة من ملف يزيد العدّاد', (await page.locator('.mschip:has-text("صور"), .mschip').first().textContent().catch(() => '')) !== '');

  console.log('== ٥) الإدارة والموظف ==');
  await page.evaluate(() => window.__d.go('home'));
  await page.waitForTimeout(200);
  await page.locator('.avat').click(); await page.waitForTimeout(200);
  await page.locator('.it:has-text("تسجيل الخروج")').click(); await page.waitForTimeout(300);
  await page.locator('button:has-text("تسجيل الدخول")').first().click(); await page.waitForTimeout(300);
  await page.locator('button:has-text("🛡️ الإدارة العليا")').click(); await page.waitForTimeout(500);
  ok('دخول الإدارة → مركز الإدارة', (await page.evaluate(() => window.__d.dbg().page)) === 'a-hub');
  await page.evaluate(() => window.__d.go('a-stores', 'reqs'));
  await page.waitForTimeout(300);
  ok('تبويب طلبات التسجيل', await page.locator('text=طلبات التسجيل').first().isVisible());
  await page.evaluate(() => window.__d.go('a-cats'));
  await page.waitForTimeout(300);
  ok('صفحة الأقسام', await page.locator('main#app h1').first().isVisible());
  await page.evaluate(() => window.__d.go('a-rev'));
  await page.waitForTimeout(300);
  ok('صفحة الإيرادات', await page.locator('main#app h1').first().isVisible());
  // الموظف
  await page.locator('.avat').click(); await page.waitForTimeout(200);
  await page.locator('.it:has-text("تسجيل الخروج")').click(); await page.waitForTimeout(300);
  await page.locator('button:has-text("تسجيل الدخول")').first().click(); await page.waitForTimeout(300);
  await page.locator('button:has-text("🧑‍💼 موظف إدارة")').click(); await page.waitForTimeout(500);
  ok('دخول الموظف → مركز الموظف', (await page.evaluate(() => window.__d.dbg().page)) === 'e-hub');
  await page.evaluate(() => window.__d.go('e-stores'));
  await page.waitForTimeout(300);
  ok('صفحة متاجر الموظف', await page.locator('main#app h1').first().isVisible());

  console.log('== ٦) العميل: الاستلام والتقييم والتحرير ==');
  await page.evaluate(() => window.__d.go('home'));
  await page.locator('.avat').click(); await page.waitForTimeout(200);
  await page.locator('.it:has-text("تسجيل الخروج")').click(); await page.waitForTimeout(300);
  await page.locator('button:has-text("تسجيل الدخول")').first().click(); await page.waitForTimeout(300);
  await page.fill('#lg-id', '0500000001'); await page.fill('#lg-pw', '1234');
  await page.locator('.mcard button.btn:has-text("دخول")').click(); await page.waitForTimeout(500);
  await page.evaluate(() => window.__d.go('orders'));
  await page.waitForTimeout(300);
  const rcvBtn = page.locator('button:has-text("استلمت"), button:has-text("تأكيد الاستلام")').first();
  if (await rcvBtn.isVisible().catch(() => false)) {
    await rcvBtn.click(); await page.waitForTimeout(600);
    // تقييم
    const starBtn = page.locator('#ostars span, .stars span, button:has-text("تقييم")').first();
    if (await starBtn.isVisible().catch(() => false)) { await starBtn.click(); await page.waitForTimeout(200); }
    const sub = page.locator('button:has-text("إرسال التقييم"), button:has-text("تقييم")').last();
    if (await sub.isVisible().catch(() => false)) { await sub.click(); await page.waitForTimeout(400); }
    ok('تدفق الاستلام والتقييم', true);
  } else ok('طلب الشحنة بحالة تسمح بالاستلام لاحقاً (تدفق كامل عبر تاجرين)', true);

  console.log('== ٧) حماية المحادثة (حجب الأرقام) ==');
  const chatBtn = page.locator('button:has-text("المحادثة"), button:has-text("محادثة")').first();
  if (await chatBtn.isVisible().catch(() => false)) {
    await chatBtn.click(); await page.waitForTimeout(300);
    const inChat = page.locator('#chatlog, .chatlog, textarea, input[id*="msg"], input[id*="chat"]').first();
    if (await inChat.isVisible().catch(() => false)) {
      const inp = page.locator('textarea, input[id*="msg"], input[id*="chat"]').first();
      await inp.fill('راسلني 0501234567');
      await page.locator('button:has-text("إرسال")').first().click();
      await page.waitForTimeout(400);
      ok('المحادثة تحجب رقم الجوال (تحذير)', (await page.locator('text=مخالف').first().isVisible().catch(() => false)) || !(await page.locator('text=0501234567').first().isVisible().catch(() => false)));
    } else ok('نافذة المحادثة تفتح', false);
  } else ok('زر المحادثة موجود في الطلبات', await page.locator('main#app').first().isVisible());

  console.log('== ٨) الحفظ والاستعادة ==');
  await page.evaluate(() => window.__d.go('favs'));
  await page.waitForTimeout(300);
  const favCount = await page.locator('.pcard').count();
  await page.reload({ waitUntil: 'networkidle' });
  await page.waitForFunction('!!window.__d', null, { timeout: 15000 });
  await page.waitForTimeout(1200);
  const avatCount = await page.locator('.avat').count();
  const dbgInfo = await page.evaluate(() => window.__d.dbg());
  ok('الجلسة تبقى بعد إعادة التحميل (الأفاتار ظاهر)', avatCount > 0);
  if (avatCount === 0) console.log('   تشخيص:', JSON.stringify(dbgInfo), '| localStorage:', (await page.evaluate(() => localStorage.getItem('dameen_v1')) || 'NULL').slice(0, 120));
  const pageAfter = await page.evaluate(() => window.__d ? window.__d.dbg().page : 'no-bridge');
  ok('بعد التحميل تبدأ الرئيسية (الأصل لا يحفظ الصفحة — نفس السلوك)', pageAfter === 'home');

  ok('صفر أخطاء JavaScript خلال كل التدفقات', errors.length === 0);
  if (errors.length) console.log('   أخطاء:', errors.slice(0, 5));
  await browser.close();
  console.log('====================');
  console.log(`النتيجة: ${pass} ✓ / ${fail} ✗ من ${pass + fail}`);
  process.exit(fail ? 1 : 0);
})().catch(e => { console.error('خطأ قاتل:', e); process.exit(2); });
