const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } });
  const pg = await ctx.newPage();
  const errs = [];
  pg.on('pageerror', e => errs.push('PAGEERROR: ' + e.message));
  pg.on('console', m => { if (m.type() === 'error') errs.push('CONSOLE: ' + m.text()); });

  // ===== 1. fresh load: PWA layer =====
  await pg.goto('file:///home/z/my-project/download/dameen.html');
  await pg.waitForTimeout(1000);
  const pwa = await pg.evaluate(async () => {
    const out = { metas: {}, manifest: null, chip: false, iconLink: false, appleIcon: false };
    ['theme-color', 'apple-mobile-web-app-capable', 'apple-mobile-web-app-title', 'mobile-web-app-capable'].forEach(n => {
      out.metas[n] = document.querySelector(`meta[name="${n}"]`)?.content || null;
    });
    const l = document.querySelector('link[rel=manifest]');
    if (l) { try { const t = await (await fetch(l.href)).text(); out.manifest = JSON.parse(t); } catch (e) { out.manifest = 'ERR ' + e.message; } }
    out.chip = !!document.querySelector('#top .appchip');
    out.iconLink = (document.querySelector('link[rel=icon]')?.href || '').startsWith('data:image/png;base64,');
    out.appleIcon = (document.querySelector('link[rel=apple-touch-icon]')?.href || '').startsWith('data:image/png;base64,');
    return out;
  });
  console.log('PWA LAYER:', JSON.stringify({
    metas: pwa.metas,
    chip: pwa.chip, iconLink: pwa.iconLink, appleIcon: pwa.appleIcon,
    manifestOk: !!pwa.manifest && typeof pwa.manifest === 'object',
    manifestName: pwa.manifest?.name, display: pwa.manifest?.display,
    icons: pwa.manifest?.icons?.map(i => i.sizes + ':' + i.purpose),
    iconDataOk: (pwa.manifest?.icons || []).every(i => i.src.startsWith('data:image/png;base64,')),
  }, null, 1));

  // ===== 2. install button → instructions toast =====
  await pg.evaluate(() => installApp());
  await pg.waitForTimeout(400);
  const toast1 = await pg.evaluate(() => document.querySelector('.toast')?.textContent?.slice(0, 50));
  console.log('INSTALL TOAST:', toast1);

  // ===== 3. persistence: login + cart =====
  await pg.evaluate(() => { openAuth(); document.querySelector('#lg-id').value = '0500000001'; document.querySelector('#lg-pw').value = '1234'; doLogin(); });
  await pg.waitForTimeout(500);
  await pg.evaluate(() => addToCart('p1', 2));
  await pg.waitForTimeout(300);
  await pg.evaluate(() => appSave());
  // reload
  await pg.goto('file:///home/z/my-project/download/dameen.html');
  await pg.waitForTimeout(1000);
  const restored = await pg.evaluate(() => ({
    logged: !!SES && SES.phone === '0500000001',
    role: SES?.role,
    cart: CART.length ? CART[0].pid + ' x' + CART[0].qty : null,
    navShown: !!document.querySelector('#top .nav'),
    cartBadge: document.querySelector('#top')?.innerText.includes('السلة'),
  }));
  console.log('AFTER RELOAD:', JSON.stringify(restored));

  // ===== 4. account menu has install item (customer) =====
  await pg.evaluate(() => { const d = document.querySelector('#top .dd'); d.classList.add('open'); });
  await pg.waitForTimeout(200);
  const menu = await pg.evaluate(() => [...document.querySelectorAll('#top .ddmenu .it')].map(i => i.textContent.trim()));
  console.log('ACCOUNT MENU:', JSON.stringify(menu));

  // ===== 5. logout clears session =====
  await pg.evaluate(() => { logout(); appSave(); });
  await pg.goto('file:///home/z/my-project/download/dameen.html');
  await pg.waitForTimeout(800);
  const afterLogout = await pg.evaluate(() => ({ guest: !SES, chip: !!document.querySelector('#top .appchip') }));
  console.log('AFTER LOGOUT+RELOAD:', JSON.stringify(afterLogout));

  // ===== 6. screenshot guest with chip =====
  await pg.screenshot({ path: '/home/z/my-project/scripts/shots/b9-guest-chip.png' });

  console.log('ERRORS:', errs.length ? '\n' + errs.join('\n') : 'none');
  await b.close();
})();
