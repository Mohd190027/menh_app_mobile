/* تحويل التطبيق إلى موقع — تحقق شامل على http://localhost:3000/
 * يثبت أن الموقع يقدم نفس تطبيق ضمين كاملاً: زائر + ٣ أدوار + الجوال + استعادة الجلسة + صفر أخطاء JS */
const { chromium } = require('playwright');
const URL = 'http://localhost:3000/';
let PASS = 0, FAIL = 0;
const chk = (name, cond, extra) => {
  if (cond) { PASS++; console.log('  PASS ' + name + (extra !== undefined ? ' | ' + JSON.stringify(extra) : '')); }
  else { FAIL++; console.log('  **FAIL** ' + name + (extra !== undefined ? ' | ' + JSON.stringify(extra) : '')); }
};
(async () => {
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: { width: 1440, height: 950 } });
  const pg = await ctx.newPage();
  const errs = [];
  pg.on('pageerror', e => errs.push('PAGEERROR: ' + e.message));
  pg.on('console', m => { if (m.type() === 'error' && !m.text().includes('favicon')) errs.push('CONSOLE: ' + m.text()); });

  // ============ T1: الموقع يقدم التطبيق كاملاً للزائر ============
  console.log('== T1: الجذر / يقدم تطبيق ضمين ==');
  const resp = await pg.goto(URL, { waitUntil: 'load' });
  await pg.waitForTimeout(1000);
  chk('HTTP 200 على الجذر', resp.status() === 200, resp.status());
  chk('العنوان «ضمين — تسوّق مضمون بثقة»', (await pg.title()).includes('ضمين'));
  const doc = await pg.evaluate(() => ({ rtl: document.documentElement.dir, lang: document.documentElement.lang, h: document.body.innerText.length, txt: document.body.innerText }));
  chk('وثيقة عربية RTL', doc.rtl === 'rtl' && doc.lang === 'ar', doc);
  // مقارنة مباشرة مع النسخة المحلية (نفس المتصفح، نفس الظروف) لإثبات تطابق الموقع
  const ctx2 = await b.newContext({ viewport: { width: 1440, height: 950 } });
  const pg2 = await ctx2.newPage();
  await pg2.goto('file:///home/z/my-project/download/dameen.html', { waitUntil: 'load' });
  await pg2.waitForTimeout(1000);
  const localTxt = await pg2.evaluate(() => document.body.innerText);
  await ctx2.close();
  chk('الموقع يعرض نفس محتوى التطبيق المحلي حرفياً', doc.txt === localTxt, { site: doc.txt.length, local: localTxt.length });
  chk('محتوى معروض (ليست صفحة بيضاء)', doc.h > 1000, doc.h);
  chk('الشريط المصغر للزائر: زر تسجيل الدخول', await pg.evaluate(() => [...document.querySelectorAll('#top button')].some(x => x.textContent.trim() === 'تسجيل الدخول')));
  chk('زر «📲 التطبيق» (PWA) موجود', await pg.evaluate(() => document.body.innerText.includes('📲 التطبيق')));
  chk('أربعة عوالم معروضة', await pg.evaluate(() => document.body.innerText.includes('عوالم ضمين')));
  const kfs = await pg.evaluate(() => [...document.querySelectorAll('img')].filter(i => i.src.startsWith('http')).length);
  chk('صور حقيقية خارجية محملة (img http)', kfs > 5, kfs);

  // ============ T2: دخول الأدوار الثلاثة عبر الواجهة ============
  console.log('== T2: دخول الأدوار عبر الواجهة ==');
  const loginUI = async (phone) => {
    await pg.evaluate(() => { if (typeof SES !== 'undefined' && SES) { logout(); } });
    await pg.waitForTimeout(200);
    await pg.evaluate(() => openAuth());
    await pg.waitForTimeout(400);
    await pg.fill('#lg-id', phone);
    await pg.fill('#lg-pw', '1234');
    await pg.evaluate(() => doLogin());
    await pg.waitForTimeout(700);
  };
  await loginUI('0500000003');
  const adm = await pg.evaluate(() => ({ role: SES && SES.role, page: VIEW.page, name: (document.querySelector('#top') || {}).innerText || '' }));
  chk('دخول الإدارة عبر الواجهة', adm.role === 'admin' && adm.page === 'a-hub' && adm.name.includes('مركز الإدارة') && adm.name.includes('المتاجر') && adm.name.includes('التحكيم'), { role: adm.role, page: adm.page });
  const sp = await pg.evaluate(() => { const b = [...document.querySelectorAll('#top .nav .nlink')].find(x => x.textContent.trim() === '🏪 المتاجر'); b.click(); return { page: VIEW.page, atab: VIEW.atab, h1: (document.querySelector('.pghead h1') || {}).textContent || '' }; });
  await pg.waitForTimeout(300);
  chk('زر «المتاجر» يفتح الصفحة المستقلة', sp.page === 'a-stores' && sp.h1.includes('المتاجر'), sp);
  chk('التبويبان بعدّادات حية', await pg.evaluate(() => [...document.querySelectorAll('.tabs button')].length === 2 && document.body.innerText.includes('جميع المتاجر (')));
  const reqGo = await pg.evaluate(() => { astTab('reqs'); return document.body.innerText.includes('طلبات التسجيل ('); });
  chk('تبويب طلبات التسجيل يعمل', reqGo);

  await loginUI('0500000002');
  const mer = await pg.evaluate(() => ({ role: SES && SES.role, page: VIEW.page, nav: (document.querySelector('#top .nav') || {}).innerText || '' }));
  chk('دخول التاجر عبر الواجهة', mer.role === 'merchant' && mer.page === 'm-dash' && mer.nav.includes('المنتجات') && mer.nav.includes('المحفظة'), { role: mer.role, page: mer.page });
  const mwallet = await pg.evaluate(() => { go('m-wallet'); return { page: VIEW.page, txt: document.body.innerText.includes('محفظة') }; });
  chk('صفحة محفظة التاجر تعمل', mwallet.page === 'm-wallet' && mwallet.txt, mwallet.page);

  await loginUI('0500000001');
  const cus = await pg.evaluate(() => ({ role: SES && SES.role, home: VIEW.page }));
  chk('دخول العميل عبر الواجهة', cus.role === 'customer', cus);
  // مسار الشراء الذهبي: فتح منتج وإضافته للسلة
  const buy = await pg.evaluate(() => {
    const p = pubProds()[0]; go('product', p.id);
    return { pid: VIEW.pid, name: p.name, hasBtn: document.body.innerText.includes('أضف إلى السلة') };
  });
  await pg.waitForTimeout(300);
  const cartAdd = await pg.evaluate(() => { addToCart(VIEW.pid, 1); return { cart: CART.length }; });
  chk('منتج يفتح بزر «أضف للسلة»', buy.hasBtn, buy.name);
  chk('الإضافة للسلة تعمل عبر الموقع', cartAdd.cart >= 1, cartAdd);

  // ============ T3: استعادة الجلسة بعد إعادة التحميل (سلوك موقع مستقر) ============
  console.log('== T3: استعادة الجلسة عبر localStorage ==');
  await pg.reload({ waitUntil: 'load' });
  await pg.waitForTimeout(1000);
  const restored = await pg.evaluate(() => ({ ses: !!(typeof SES !== 'undefined' && SES && SES.role), cart: (typeof CART !== 'undefined' ? CART.length : -1), role: typeof SES !== 'undefined' && SES ? SES.role : null }));
  chk('الجلسة تبقى بعد إعادة التحميل', restored.ses && restored.role === 'customer', restored);
  chk('السلة تبقى بعد إعادة التحميل', restored.cart >= 1, restored.cart);

  // ============ T4: الجوال ٣٩٠px بلا تجاوز أفقي ============
  console.log('== T4: الجوال ==');
  await pg.setViewportSize({ width: 390, height: 844 });
  await pg.waitForTimeout(500);
  const ov = await pg.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  chk('لا تجاوز أفقي على ٣٩٠px', ov <= 0, ov);

  // ============ T5: صفر أخطاء JS ============
  console.log('== T5: صفر أخطاء ==');
  chk('صفر أخطاء JS على الموقع كله', errs.length === 0, errs.slice(0, 4));

  await b.close();
  console.log('\n===== النتيجة: ' + PASS + '/' + (PASS + FAIL) + ' =====');
  process.exit(FAIL > 0 ? 1 : 0);
})().catch(e => { console.error('EXCEPTION:', e.message); process.exit(2); });
