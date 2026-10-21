const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch();
  const pg = await b.newPage({ viewport: { width: 1440, height: 900 } });
  const errs = [];
  pg.on('pageerror', e => errs.push('PAGEERROR: ' + e.message));
  pg.on('console', m => { if (m.type() === 'error') errs.push('CONSOLE: ' + m.text()); });
  await pg.goto('file:///home/z/my-project/download/dameen.html');
  await pg.waitForTimeout(1500);

  // ===== GUEST: home =====
  const guestHome = await pg.evaluate(() => ({
    topHasSearch: !!document.querySelector('#sq'),
    topBtns: document.querySelector('#top').innerText.replace(/\n/g, ' | '),
    bubbles: document.querySelectorAll('.bub').length,
    bubbleImgs: [...document.querySelectorAll('.bub img')].slice(0, 3).map(i => i.src.slice(0, 55)),
    bestSellers: document.body.innerHTML.includes('الأكثر مبيعاً'),
    trioCards: document.querySelectorAll('.tri').length,
    trioHasImg: [...document.querySelectorAll('.tri .bg')].map(i => i.src.slice(0, 55)),
    bigstores: document.querySelectorAll('.bigstore').length,
  }));
  console.log('GUEST HOME:', JSON.stringify(guestHome, null, 1));
  await pg.screenshot({ path: '/home/z/my-project/scripts/shots/b8-guest-home.png', fullPage: true });

  // ===== GUEST: section (search should appear, big stores) =====
  await pg.evaluate(() => go('section', 'fashion'));
  await pg.waitForTimeout(900);
  const guestSec = await pg.evaluate(() => ({
    topHasSearch: !!document.querySelector('#sq'),
    storeCards: document.querySelectorAll('.bigstore').length,
    storeCardImgs: [...document.querySelectorAll('.bigstore .cov img')].slice(0, 3).map(i => i.src.slice(0, 55)),
    secheroHasBg: getComputedStyle(document.querySelector('.sechero')).backgroundImage.includes('url'),
  }));
  console.log('GUEST SECTION:', JSON.stringify(guestSec, null, 1));
  await pg.screenshot({ path: '/home/z/my-project/scripts/shots/b8-guest-section.png', fullPage: true });

  // ===== CUSTOMER: home (no search, nav present) then section (search+nav) =====
  await pg.evaluate(() => { openAuth(); document.querySelector('#lg-id').value = '0500000001'; document.querySelector('#lg-pw').value = '1234'; doLogin(); });
  await pg.waitForTimeout(900);
  const userHome = await pg.evaluate(() => ({
    topHasSearch: !!document.querySelector('#sq'),
    topHasNav: !!document.querySelector('#top .nav'),
    bubbles: document.querySelectorAll('.bub').length,
    trioCards: document.querySelectorAll('.tri').length,
    bestSellers: document.body.innerHTML.includes('الأكثر مبيعاً'),
  }));
  console.log('USER HOME:', JSON.stringify(userHome, null, 1));
  await pg.screenshot({ path: '/home/z/my-project/scripts/shots/b8-user-home.png', fullPage: true });

  await pg.evaluate(() => go('section', 'deco'));
  await pg.waitForTimeout(900);
  const userSec = await pg.evaluate(() => ({
    topHasSearch: !!document.querySelector('#sq'),
    topHasNav: !!document.querySelector('#top .nav'),
    storeCards: document.querySelectorAll('.bigstore').length,
  }));
  console.log('USER SECTION:', JSON.stringify(userSec, null, 1));
  await pg.screenshot({ path: '/home/z/my-project/scripts/shots/b8-user-section.png', fullPage: true });

  // ===== product page real image + family section =====
  await pg.evaluate(() => go('section', 'family'));
  await pg.waitForTimeout(700);
  await pg.screenshot({ path: '/home/z/my-project/scripts/shots/b8-user-section-family.png', fullPage: true });
  await pg.evaluate(() => go('product', 'p8'));
  await pg.waitForTimeout(900);
  const prod = await pg.evaluate(() => ({
    gal: [...document.querySelectorAll('.pgallery img, .pimg img, #app img')].slice(0, 2).map(i => i.src.slice(0, 60)),
  }));
  console.log('PRODUCT p8:', JSON.stringify(prod));
  await pg.screenshot({ path: '/home/z/my-project/scripts/shots/b8-product.png', fullPage: false });

  // ===== mobile guest home =====
  await pg.setViewportSize({ width: 390, height: 844 });
  await pg.evaluate(() => { logout(); go('home'); });
  await pg.waitForTimeout(900);
  await pg.screenshot({ path: '/home/z/my-project/scripts/shots/b8-guest-home-mobile.png', fullPage: false });
  const mob = await pg.evaluate(() => ({ topHasSearch: !!document.querySelector('#sq') }));
  console.log('MOBILE GUEST HOME:', JSON.stringify(mob));
  await pg.evaluate(() => go('section', 'family'));
  await pg.waitForTimeout(700);
  await pg.screenshot({ path: '/home/z/my-project/scripts/shots/b8-guest-section-mobile.png', fullPage: false });

  console.log('ERRORS:', errs.length ? '\n' + errs.join('\n') : 'none');
  await b.close();
})();
