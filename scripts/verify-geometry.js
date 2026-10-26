/* فحص هندسي: لا عناصر خارج حدود الشاشة على الجوال + انحدار القائمة العلوية */
const { chromium } = require('playwright');
const FILE = 'file:///home/z/my-project/download/dameen.html';
let bad = 0;

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  const errs = [];
  page.on('pageerror', e => errs.push(e.message));

  await page.goto(FILE); await page.waitForTimeout(500);

  const overflow = async (label) => {
    const n = await page.evaluate(() => {
      let c = 0; const W = document.documentElement.clientWidth;
      document.querySelectorAll('#app *').forEach(el => {
        if (el.closest('.bubwrap') || el.closest('.chiprow')) return; // حاويات تمرير أفقية مقصودة
        const r = el.getBoundingClientRect();
        if (r.width > 1 && (r.left < -8 || r.right > W + 8)) c++;
      });
      return c;
    });
    console.log((n ? '✗ OVERFLOW ' : '✓ clean    ') + label + (n ? ' (' + n + ' عناصر)' : ''));
    if (n) bad++;
  };

  await page.evaluate(`addToCart('p22',1);addToCart('p19',1);addToCart('p24',1);quickLogin('customer')`);
  await page.evaluate(`go('home')`); await page.waitForTimeout(400); await overflow('الرئيسية');
  await page.evaluate(`go('cart')`); await page.waitForTimeout(400); await overflow('السلة');
  await page.evaluate(`startCheckout()`); await page.waitForTimeout(400); await overflow('بوابة الطلب');
  await page.evaluate(`ckSetBook('s5','date','2026-11-14');ckSetBook('s5','setup','18:00');ckGiftTog('s6');ckSetGift('s6','name','هند العلي');ckSetGift('s6','phone','0551234567');ckSetGift('s6','city','الرياض')`);
  await page.evaluate(`CK.step=2;ckRefresh()`); await page.waitForTimeout(300); await overflow('الدفع');
  await page.evaluate(`placeOrder()`); await page.waitForTimeout(400);
  await page.evaluate(`closeModal();go('orders')`); await page.waitForTimeout(400); await overflow('الطلبات');
  const gi = await page.evaluate(`DB.orders[0].groups.findIndex(g=>g.store==='s8')`);
  await page.evaluate(`openOChat(DB.orders[0].id,${gi})`); await page.waitForTimeout(300); await overflow('محادثة الطلب');
  await page.evaluate(`closeModal();SES={phone:'0500000010',role:'merchant',store:'s8'};go('m-set')`); await page.waitForTimeout(400); await overflow('إعدادات التاجر');
  await page.evaluate(`go('m-orders')`); await page.waitForTimeout(400); await overflow('طلبات التاجر');
  await page.evaluate(`go('m-wallet')`); await page.waitForTimeout(400); await overflow('محفظة التاجر');
  await page.evaluate(`SES={phone:'0500000003',role:'admin'};go('a-over')`); await page.waitForTimeout(400); await overflow('لوحة الإدارة');
  await page.evaluate(`go('a-rev')`); await page.waitForTimeout(400); await overflow('إيرادات الإدارة');

  // انحدار: القائمة العلوية (زائر مبسط / عميل كامل + بحث)
  await page.evaluate(`logout()`); await page.waitForTimeout(300);
  const gNav = await page.locator('.topin .nav').count();
  const gSearchHome = await page.locator('.topin .sbox').count();
  const gLogin = await page.locator('.topin button:has-text("تسجيل الدخول")').count();
  console.log((gNav === 0 && gSearchHome === 0 && gLogin === 1 ? '✓ ' : '✗ ') + 'زائر: شريط مبسط (بلا بحث في الرئيسية) + دخول');
  if (!(gNav === 0 && gSearchHome === 0 && gLogin === 1)) bad++;
  await page.evaluate(`go('section','family')`); await page.waitForTimeout(400);
  const gSearch = await page.locator('.topin .sbox').count();
  console.log((gSearch === 1 ? '✓ ' : '✗ ') + 'زائر: البحث يظهر داخل القسم');
  if (gSearch !== 1) bad++;
  await page.fill('#sq', 'كيكة'); await page.keyboard.press('Enter'); await page.waitForTimeout(400);
  const sr = await page.textContent('#app');
  console.log((sr.includes('كيكة العيد') ? '✓ ' : '✗ ') + 'البحث يجد الكيكة');
  if (!sr.includes('كيكة العيد')) bad++;
  await page.evaluate(`quickLogin('customer')`); await page.waitForTimeout(300);
  const navLinks = await page.locator('.topin .nav .nlink').count();
  console.log((navLinks >= 5 ? '✓ ' : '✗ ') + 'بعد الدخول: قائمة كاملة (' + navLinks + ' روابط)');
  if (navLinks < 5) bad++;

  await browser.close();
  console.log('\nRESULT: ' + (bad || errs.length ? 'FAIL' : 'ALL CLEAN') + ' (overflow=' + bad + ', jsErrors=' + errs.length + ')');
  process.exit(bad || errs.length ? 1 : 0);
})();
