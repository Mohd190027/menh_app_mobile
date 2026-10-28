/* لقطات الدفعة ١٣: المركز (نظرة عامة فقط) + صفحة المتاجر المستقلة بتبويبيها + الجوال */
const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch();
  const pg = await (await b.newContext({ viewport: { width: 1440, height: 950 } })).newPage();
  await pg.goto('file:///home/z/my-project/download/dameen.html');
  await pg.waitForTimeout(900);
  await pg.evaluate(() => { SES = { phone: '0500000003', role: 'admin', store: null }; render(); go('a-hub'); });
  await pg.waitForTimeout(600);
  await pg.screenshot({ path: '/home/z/my-project/scripts/shots/b13-hub.png' });
  // صفحة المتاجر — تبويب المتاجر الافتراضي
  await pg.evaluate(() => go('a-stores'));
  await pg.waitForTimeout(500);
  await pg.screenshot({ path: '/home/z/my-project/scripts/shots/b13-stores.png' });
  // تبويب طلبات التسجيل
  await pg.evaluate(() => astTab('reqs'));
  await pg.waitForTimeout(500);
  await pg.screenshot({ path: '/home/z/my-project/scripts/shots/b13-reqs.png' });
  // جوال — صفحة المتاجر + الشريط
  const mob = await (await b.newContext({ viewport: { width: 390, height: 844 } })).newPage();
  await mob.goto('file:///home/z/my-project/download/dameen.html');
  await mob.waitForTimeout(900);
  await mob.evaluate(() => { SES = { phone: '0500000003', role: 'admin', store: null }; render(); go('a-stores'); });
  await mob.waitForTimeout(500);
  await mob.screenshot({ path: '/home/z/my-project/scripts/shots/b13-mob.png' });
  const geo = await mob.evaluate(() => ({ ov: document.documentElement.scrollWidth - window.innerWidth }));
  console.log('MOBILE OVERFLOW:', JSON.stringify(geo));
  await b.close();
  console.log('SHOTS DONE');
})();
