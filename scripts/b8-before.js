const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch();
  const pg = await b.newPage({ viewport: { width: 1440, height: 900 } });
  await pg.goto('file:///home/z/my-project/download/dameen.html');
  await pg.waitForTimeout(1200);
  await pg.screenshot({ path: '/home/z/my-project/scripts/shots/b8-before-guest-home.png', fullPage: true });
  // guest section
  await pg.evaluate(() => go('section', 'fashion'));
  await pg.waitForTimeout(600);
  await pg.screenshot({ path: '/home/z/my-project/scripts/shots/b8-before-guest-section.png', fullPage: true });
  // logged in customer home
  await pg.evaluate(() => { openAuth(); document.querySelector('#lg-id').value = '0500000001'; document.querySelector('#lg-pw').value = '1234'; doLogin(); });
  await pg.waitForTimeout(800);
  await pg.screenshot({ path: '/home/z/my-project/scripts/shots/b8-before-user-home.png', fullPage: true });
  await pg.evaluate(() => go('section', 'food'));
  await pg.waitForTimeout(600);
  await pg.screenshot({ path: '/home/z/my-project/scripts/shots/b8-before-user-section.png', fullPage: true });
  await b.close();
  console.log('done');
})();
