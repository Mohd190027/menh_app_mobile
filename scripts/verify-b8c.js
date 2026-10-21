const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch();
  const pg = await b.newPage({ viewport: { width: 1440, height: 900 } });
  await pg.goto('file:///home/z/my-project/download/dameen.html');
  await pg.waitForTimeout(2200); // wait for images

  // ===== image loading check (home) =====
  const homeImgs = await pg.evaluate(() => {
    const imgs = [...document.querySelectorAll('.bub img, .tri .bg')];
    return {
      total: imgs.length,
      loaded: imgs.filter(i => i.complete && i.naturalWidth > 0).length,
      broken: imgs.filter(i => i.complete && i.naturalWidth === 0).map(i => i.src.slice(-20)),
    };
  });
  console.log('HOME IMGS:', JSON.stringify(homeImgs));

  // ===== carousel motion check =====
  const t1 = await pg.evaluate(() => getComputedStyle(document.querySelector('.bubtrack')).transform);
  await pg.waitForTimeout(1600);
  const t2 = await pg.evaluate(() => getComputedStyle(document.querySelector('.bubtrack')).transform);
  console.log('CAROUSEL MOVING:', t1 !== t2, t1.slice(0, 30), '→', t2.slice(0, 30));

  // ===== trio card geometry =====
  const trio = await pg.evaluate(() => [...document.querySelectorAll('.tri')].map(el => {
    const r = el.getBoundingClientRect();
    return { w: Math.round(r.width), h: Math.round(r.height), hasShade: !!el.querySelector('.shade'), hasWin: !!el.querySelector('.win'), txt: el.querySelector('.tx b').textContent.slice(0, 18) };
  }));
  console.log('TRIO:', JSON.stringify(trio));

  // ===== section bigstore geometry + images =====
  await pg.evaluate(() => go('section', 'family'));
  await pg.waitForTimeout(1800);
  const sec = await pg.evaluate(() => {
    const cards = [...document.querySelectorAll('.bigstore')];
    return {
      n: cards.length,
      geom: cards.map(el => { const r = el.getBoundingClientRect(); return { w: Math.round(r.width), h: Math.round(r.height) }; }),
      imgsLoaded: [...document.querySelectorAll('.bigstore .cov img')].filter(i => i.complete && i.naturalWidth > 0).length,
      imgsTotal: document.querySelectorAll('.bigstore .cov img').length,
      vstBtn: cards.map(c => c.querySelector('.vst')?.textContent.trim()),
      meta: cards[0]?.querySelector('.meta')?.textContent.trim().slice(0, 60),
    };
  });
  console.log('SECTION BIGSTORES:', JSON.stringify(sec, null, 1));

  // ===== sechero bg image loaded? =====
  const hero = await pg.evaluate(async () => {
    const bg = getComputedStyle(document.querySelector('.sechero')).backgroundImage;
    const m = bg.match(/url\("?([^")]+)"?\)/);
    if (!m) return { bg: 'none' };
    return await new Promise(res => { const im = new Image(); im.onload = () => res({ loaded: true, url: m[1].slice(-22) }); im.onerror = () => res({ loaded: false, url: m[1].slice(-22) }); im.src = m[1]; });
  });
  console.log('SECHERO BG:', JSON.stringify(hero));

  // ===== product detail real images =====
  await pg.evaluate(() => go('product', 'p9'));
  await pg.waitForTimeout(1500);
  const prod = await pg.evaluate(() => {
    const imgs = [...document.querySelectorAll('#app img')].filter(i => i.naturalWidth > 0 || !i.complete);
    return { loaded: imgs.filter(i => i.complete && i.naturalWidth > 0).length, total: imgs.length, first: imgs[0]?.src.slice(-24), name: document.querySelector('#app h1')?.textContent?.slice(0, 25) };
  });
  console.log('PRODUCT p9:', JSON.stringify(prod));

  // ===== merchant dashboard still intact =====
  await pg.evaluate(() => { logout(); openAuth('merchant'); document.querySelector('#lg-id').value = '0500000002'; document.querySelector('#lg-pw').value = '1234'; doLogin(); });
  await pg.waitForTimeout(900);
  const mdash = await pg.evaluate(() => ({ page: VIEW.page, h1: document.querySelector('#app h1')?.textContent?.slice(0, 30), topHasSearch: !!document.querySelector('#sq'), topHasNav: !!document.querySelector('#top .nav') }));
  console.log('MERCHANT DASH:', JSON.stringify(mdash));
  await b.close();
})();
