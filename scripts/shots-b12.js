/* لقطات الدفعة ١٢: قائمة المتاجر المنسدلة للإدارة + تبويب المتاجر بلا اعتماد */
const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch();
  const pg = await (await b.newContext({ viewport: { width: 1440, height: 950 } })).newPage();
  await pg.goto('file:///home/z/my-project/download/dameen.html');
  await pg.waitForTimeout(900);
  // دخول الإدارة
  await pg.evaluate(() => { SES = { phone: '0500000003', role: 'admin', store: null }; render(); go('a-hub'); });
  await pg.waitForTimeout(600);
  // ١) القائمة مفتوحة
  await pg.click('#top .nav [data-storesb]');
  await pg.waitForTimeout(300);
  await pg.screenshot({ path: '/home/z/my-project/scripts/shots/b12-admin-dd.png' });
  // ٢) تبويب المتاجر
  await pg.evaluate(() => [...document.querySelectorAll('#storesdrop .hti')].find(x => x.innerText.includes('جميع المتاجر')).click());
  await pg.waitForTimeout(500);
  await pg.screenshot({ path: '/home/z/my-project/scripts/shots/b12-admin-stores.png' });
  // ٣) جوال: القائمة المنسدلة
  const mob = await (await b.newContext({ viewport: { width: 390, height: 844 } })).newPage();
  await mob.goto('file:///home/z/my-project/download/dameen.html');
  await mob.waitForTimeout(900);
  await mob.evaluate(() => { SES = { phone: '0500000003', role: 'admin', store: null }; render(); go('a-hub'); });
  await mob.waitForTimeout(500);
  // تصفية الشريط الأفقي حتى يظهر الزر ثم نقرة حقيقية
  await mob.evaluate(() => { const nav = document.querySelector('#top .nav'); if (nav) { const b = nav.querySelector('[data-storesb]'); if (b) b.scrollIntoView({ inline: 'center', block: 'nearest' }); } });
  await mob.waitForTimeout(200);
  try { await mob.click('#top .nav [data-storesb]', { timeout: 5000 }); } catch (e) { console.log('click fallback'); await mob.evaluate(() => storesDD({ stopPropagation() {} }, document.querySelector('#top .nav [data-storesb]'))); }
  await mob.waitForTimeout(300);
  const geo = await mob.evaluate(() => { const el = document.querySelector('#storesdrop'); const r = el.getBoundingClientRect(); return { open: el.classList.contains('open'), left: r.left, right: r.right, vw: window.innerWidth }; });
  console.log('MOBILE GEO:', JSON.stringify(geo));
  await mob.screenshot({ path: '/home/z/my-project/scripts/shots/b12-admin-mob.png' });
  await b.close();
  console.log('SHOTS DONE');
})();
