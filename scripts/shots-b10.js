const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: { width: 1440, height: 950 }, permissions: ['geolocation'] });
  await ctx.setGeolocation({ latitude: 24.7136, longitude: 46.6753 });
  const pg = await ctx.newPage();
  await pg.goto('file:///home/z/my-project/download/dameen.html');
  await pg.waitForTimeout(900);
  // الرئيسية — العوالم الأربعة
  await pg.screenshot({ path: '/home/z/my-project/scripts/shots/b10-home-4worlds.png' });
  // شراء خدمة ميدانية وفتح الدردشة — لقطة محادثة بالموقع وطلب مبلغ إضافي
  await pg.evaluate(() => { openAuth(); document.querySelector('#lg-id').value = '0500000001'; document.querySelector('#lg-pw').value = '1234'; doLogin(); });
  await pg.waitForTimeout(400);
  await pg.evaluate(() => { CART = []; addToCart('p24', 1); startCheckout(); });
  await pg.waitForTimeout(300);
  await pg.evaluate(() => { CK.book['s5'] = { dl: 'field', date: '2026-11-05', setup: '18:00', tear: '23:00' }; ckRefresh(); ckNext(); });
  await pg.waitForTimeout(250);
  await pg.evaluate(() => placeOrder());
  await pg.waitForTimeout(2100);
  await pg.evaluate(() => { sendMyLoc(); const g = DB.orders[0].groups[0]; g.chat.push({ r: 'merchant', payreq: { amt: 35, note: 'إضافة شموع ورد للطاولة الرئيسية', paid: false }, at: Date.now() }); ochatRefresh(); });
  await pg.waitForTimeout(900);
  await pg.screenshot({ path: '/home/z/my-project/scripts/shots/b10-chat-loc-payreq.png' });
  await pg.evaluate(() => closeModal());
  // بطاقة كوبونات التاجر
  await pg.evaluate(() => { logout(); openAuth(); document.querySelector('#lg-id').value = '0500000002'; document.querySelector('#lg-pw').value = '1234'; doLogin(); });
  await pg.waitForTimeout(500);
  await pg.evaluate(() => go('m-set'));
  await pg.waitForTimeout(400);
  await pg.evaluate(() => { window.scrollTo(0, 1200); });
  await pg.waitForTimeout(300);
  await pg.screenshot({ path: '/home/z/my-project/scripts/shots/b10-mcoupons.png' });
  // قسم الألعاب سطح المكتب
  await pg.evaluate(() => { logout(); go('section', 'gaming'); });
  await pg.waitForTimeout(900);
  await pg.screenshot({ path: '/home/z/my-project/scripts/shots/b10-gaming-full.png' });
  await b.close();
  console.log('shots done');
})();
