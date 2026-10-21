const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch();
  const pg = await b.newPage({ viewport: { width: 1440, height: 900 } });
  const errs = [];
  pg.on('pageerror', e => errs.push('PAGEERROR: ' + e.message));
  pg.on('console', m => { if (m.type() === 'error') errs.push('CONSOLE: ' + m.text()); });
  await pg.goto('file:///home/z/my-project/download/dameen.html');
  await pg.waitForTimeout(1000);
  // login as customer and explicitly go home
  await pg.evaluate(() => { openAuth(); document.querySelector('#lg-id').value = '0500000001'; document.querySelector('#lg-pw').value = '1234'; doLogin(); go('home'); });
  await pg.waitForTimeout(1200);
  const userHome = await pg.evaluate(() => ({
    page: VIEW.page,
    topHasSearch: !!document.querySelector('#sq'),
    topHasNav: !!document.querySelector('#top .nav'),
    topText: document.querySelector('#top').innerText.replace(/\n/g, ' | ').slice(0, 90),
    bubbles: document.querySelectorAll('.bub').length,
    trioCards: document.querySelectorAll('.tri').length,
    homeBestSellers: document.querySelector('#app').innerHTML.includes('الأكثر مبيعاً'),
    heroText: document.querySelector('#app .hero h1')?.textContent?.slice(0, 40),
  }));
  console.log('USER HOME:', JSON.stringify(userHome, null, 1));
  await pg.screenshot({ path: '/home/z/my-project/scripts/shots/b8-user-home-fixed.png', fullPage: true });
  // then into a section
  await pg.evaluate(() => go('section', 'fashion'));
  await pg.waitForTimeout(800);
  const userSec = await pg.evaluate(() => ({
    topHasSearch: !!document.querySelector('#sq'),
    topHasNav: !!document.querySelector('#top .nav'),
    storeCards: document.querySelectorAll('.bigstore').length,
  }));
  console.log('USER SECTION:', JSON.stringify(userSec));
  await pg.screenshot({ path: '/home/z/my-project/scripts/shots/b8-user-section-fixed.png', fullPage: true });
  console.log('ERRORS:', errs.length ? '\n' + errs.join('\n') : 'none');
  await b.close();
})();
